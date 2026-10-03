(function () {
  /* ── LABELS / ROUTING ── */
  var TYPE_LABELS = {
    'bangles-bracelets':'Bangles / Bracelets','rings':'Rings','earrings':'Earrings',
    'pendants':'Pendants','pendant-sets':'Pendant Sets','necklace-sets':'Necklace Sets',
    'mangalsutra':'Mangalsutra','brooches':'Brooches','anklets':'Anklets',
    'wristlets':'Wristlets','chain':'Chain','necklaces':'Necklaces'
  };
  var GROUP_PAGE  = { forher:'forher.html', forhim:'forhim.html', virasat:'virasat.html' };
  var GROUP_LABEL = { forher:'For Her', forhim:'For Him', virasat:'Virasat' };

  /* ── DEFAULT CATEGORY SUGGESTIONS (shown before typing) ── */
  var DEFAULTS = [
    { label:'Rings',        slug:'rings',             page:'forher.html' },
    { label:'Earrings',     slug:'earrings',          page:'forher.html' },
    { label:'Bangles',      slug:'bangles-bracelets', page:'forher.html' },
    { label:'Pendants',     slug:'pendants',          page:'forher.html' },
    { label:'Necklaces',    slug:'necklaces',         page:'forher.html' },
    { label:'Mangalsutra',  slug:'mangalsutra',       page:'forher.html' },
    { label:'Anklets',      slug:'anklets',           page:'forher.html' },
    { label:'For Him',      slug:'',                  page:'forhim.html' },
    { label:'Virasat',      slug:'',                  page:'virasat.html' }
  ];

  /* ── TYPO CORRECTIONS ── */
  var TYPOS = {
    'earings':'earrings','earing':'earring','earring':'earrings',
    'bangels':'bangles','bangel':'bangle','braclet':'bracelet','braclets':'bracelets',
    'neclace':'necklace','necklase':'necklace','neckless':'necklace',
    'pendent':'pendant','pendents':'pendants','pendunt':'pendant',
    'mangalsutar':'mangalsutra','manglasutra':'mangalsutra','managalsutra':'mangalsutra',
    'brooch':'brooches','broche':'brooches','broches':'brooches',
    'anklet':'anklets','wristlet':'wristlets',
    'jewellry':'jewellery','jewlery':'jewellery','jewlry':'jewellery',
    'silver':'silver','silvar':'silver','sliver':'silver',
    'rigns':'rings','rigng':'ring','rins':'rings'
  };

  /* ── COLOR SYNONYMS (text-based, no CORS needed) ── */
  var COLORS = {
    red:    ['red','ruby','crimson','garnet','coral','cherry'],
    pink:   ['pink','rose','blush','coral','peach','magenta','rosy'],
    blue:   ['blue','sapphire','navy','aqua','teal','cobalt','indigo','azure'],
    green:  ['green','emerald','jade','olive','mint','turquoise','forest'],
    yellow: ['yellow','gold','amber','citrine','topaz','sunny','lemon'],
    gold:   ['gold','golden','amber','yellow','topaz','bronze','warm'],
    white:  ['white','pearl','ivory','cream','moonstone','milky','clear'],
    black:  ['black','onyx','dark','jet','ebony','obsidian','noir'],
    purple: ['purple','amethyst','lavender','violet','mauve','lilac','plum'],
    orange: ['orange','coral','carnelian','amber','sunset','rust','copper'],
    brown:  ['brown','chocolate','coffee','bronze','walnut','rustic'],
    grey:   ['grey','gray','silver','platinum','slate','ash'],
    gray:   ['grey','gray','silver','platinum','slate','ash'],
    silver: ['silver','platinum','grey','gray','chrome','metallic','steel']
  };

  /* ── RGB → COLOR NAME (for canvas extraction) ── */
  var RGB_COLORS = {
    red:[215,50,50],    pink:[220,110,150],  blue:[55,95,200],
    green:[55,175,75],  yellow:[215,200,50], gold:[195,165,50],
    white:[230,230,230],silver:[175,175,175],black:[38,38,38],
    purple:[140,50,195],orange:[220,118,40], brown:[138,78,50]
  };
  function rgbDist(a, b) {
    return Math.sqrt((a[0]-b.r)*(a[0]-b.r)+(a[1]-b.g)*(a[1]-b.g)+(a[2]-b.b)*(a[2]-b.b));
  }
  function rgbToName(rgb) {
    var best=null, bDist=Infinity;
    Object.keys(RGB_COLORS).forEach(function(n){
      var d=rgbDist(RGB_COLORS[n],rgb);
      if(d<bDist){bDist=d;best=n;}
    });
    return bDist < 80 ? best : null;
  }

  /* ── CANVAS COLOR EXTRACTION (best-effort, CORS optional) ── */
  var colorCache = {};
  try { colorCache = JSON.parse(localStorage.getItem('hoa_img_colors')||'{}'); } catch(e){}
  function saveColorCache() { try{localStorage.setItem('hoa_img_colors',JSON.stringify(colorCache));}catch(e){} }

  function extractColor(imgUrl, cb) {
    if(!imgUrl){cb(null);return;}
    if(colorCache[imgUrl]){cb(colorCache[imgUrl]);return;}
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      try {
        var c = document.createElement('canvas'); c.width = c.height = 24;
        var ctx = c.getContext('2d'); ctx.drawImage(img,0,0,24,24);
        var d = ctx.getImageData(0,0,24,24).data;
        var r=0,g=0,b=0,n=0;
        for(var i=0;i<d.length;i+=4){
          var br=(d[i]+d[i+1]+d[i+2])/3;
          if(br>45&&br<225){r+=d[i];g+=d[i+1];b+=d[i+2];n++;}
        }
        if(n>0){
          var name=rgbToName({r:Math.round(r/n),g:Math.round(g/n),b:Math.round(b/n)});
          colorCache[imgUrl]=name; saveColorCache(); cb(name);
        } else { cb(null); }
      } catch(e){ cb(null); }
    };
    img.onerror = function(){ cb(null); };
    img.src = imgUrl;
  }

  /* ── FIREBASE / PRODUCT LOADING ── */
  var firebaseConfig = {
    apiKey:"AIzaSyBwqpavjzi15Zt9qHoufjJFI05k7AAHLRs",
    authDomain:"house-of-ansh.firebaseapp.com",
    projectId:"house-of-ansh",
    storageBucket:"house-of-ansh.firebasestorage.app",
    messagingSenderId:"386185011014",
    appId:"1:386185011014:web:fef798d4e17c84170bcf47"
  };
  var productsPromise = null;
  function loadProducts() {
    if(productsPromise) return productsPromise;
    productsPromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js")
    ]).then(function(mods){
      var app = mods[0].getApps().length ? mods[0].getApps()[0] : mods[0].initializeApp(firebaseConfig);
      var db  = mods[1].getFirestore(app);
      return mods[1].getDocs(mods[1].collection(db,'products'));
    }).then(function(snap){
      return snap.docs.map(function(d){
        var p = d.data();
        var typeSlugs = (Array.isArray(p.productTypes)&&p.productTypes.length)?p.productTypes:(p.productType?[p.productType]:[]);
        var typeLabel = typeSlugs.map(function(s){return TYPE_LABELS[s]||s;}).filter(Boolean).join(' · ');
        var thumb = (Array.isArray(p.images)&&p.images[0])||p.imageUrl||'';
        var cats  = Array.isArray(p.categories)?p.categories:(p.category?[p.category]:[]);
        var gk    = cats.indexOf('virasat')!==-1?'virasat':(cats.indexOf('forhim')!==-1?'forhim':'forher');
        return {
          id:d.id, name:p.name||'', price:Number(p.price)||0,
          img:thumb, cat:typeSlugs.join(' '), typeLabel:typeLabel,
          group:GROUP_LABEL[gk], page:GROUP_PAGE[gk],
          description:p.description||'',
          availability:p.availability||'in-stock'
        };
      });
    }).catch(function(){return [];});
    return productsPromise;
  }

  /* ── LOAD FUSE.JS (fuzzy search) ── */
  var fuseReady = false;
  function loadFuse(cb) {
    if(window.Fuse){fuseReady=true;cb();return;}
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/7.0.0/fuse.min.js';
    s.onload = function(){fuseReady=true;cb();};
    s.onerror = function(){cb();};
    document.head.appendChild(s);
  }

  /* ── RECENT SEARCHES ── */
  function getRecent(){try{return JSON.parse(localStorage.getItem('hoa_recent_searches')||'[]');}catch(e){return[];}}
  function addRecent(q){
    if(!q||q.length<2)return;
    var r=getRecent().filter(function(x){return x.toLowerCase()!==q.toLowerCase();});
    r.unshift(q); r=r.slice(0,5);
    try{localStorage.setItem('hoa_recent_searches',JSON.stringify(r));}catch(e){}
  }

  /* ── HELPERS ── */
  function he(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

  function correctTypos(q) {
    return q.split(/\s+/).map(function(w){
      var lw=w.toLowerCase(); return TYPOS[lw]||w;
    }).join(' ');
  }

  function extractColorQuery(q) {
    var words=q.toLowerCase().split(/\s+/);
    for(var i=0;i<words.length;i++){
      if(COLORS[words[i]]) return {word:words[i],synonyms:COLORS[words[i]]};
    }
    return null;
  }

  function productUrl(p){
    return 'product.html?id='+encodeURIComponent(p.id)+'&name='+encodeURIComponent(p.name)+
      '&cat='+encodeURIComponent(p.cat)+'&price='+encodeURIComponent(p.price)+
      '&avail='+encodeURIComponent(p.availability)+'&img='+encodeURIComponent(p.img)+
      '&from='+encodeURIComponent(p.page);
  }

  function resultHtml(p, i, total) {
    var border=i<total-1?'border-bottom:1px solid #1a1a1a;':'';
    var thumb=p.img
      ?'<img src="'+p.img+'" style="width:46px;height:46px;object-fit:cover;margin-right:14px;flex-shrink:0;" alt=""/>'
      :'<div style="width:46px;height:46px;background:#1a1a1a;margin-right:14px;flex-shrink:0;"></div>';
    return '<a href="'+productUrl(p)+'" onclick="closeSearch();if(typeof addRecentSearch===\'function\')addRecentSearch()" '+
      'style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;text-decoration:none;'+border+
      'transition:background .15s;" onmouseover="this.style.background=\'rgba(255,255,255,.04)\'" '+
      'onmouseout="this.style.background=\'\'">' +
      '<div style="display:flex;align-items:center;min-width:0;">'+thumb+
      '<div style="min-width:0;">'+
      '<div style="font-family:\'Playfair Display\',serif;font-size:14px;font-style:italic;color:#f5f5f5;margin-bottom:3px;'+
      'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+he(p.name)+'</div>'+
      '<div style="font-family:Cinzel,serif;font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#999;">'+
      he(p.group)+(p.typeLabel?' · '+he(p.typeLabel):'')+'</div>'+
      '</div></div>'+
      '<span style="font-family:\'Cormorant Garamond\',serif;font-size:16px;color:#b8b8b8;flex-shrink:0;margin-left:20px;">'+
      '₹'+p.price.toLocaleString('en-IN')+'</span></a>';
  }

  /* ── SEARCH LOGIC ── */
  function doSearch(rawQ, list, box, hint) {
    var q = correctTypos(rawQ.trim());
    var colorInfo = extractColorQuery(q);
    // Remove color word from query for text search
    var textQ = colorInfo ? q.replace(new RegExp('\\b'+colorInfo.word+'\\b','i'),'').trim() : q;

    var matches = [];

    if(fuseReady && window.Fuse && textQ.length >= 2) {
      var fuse = new Fuse(list, {
        keys:['name','typeLabel','group','description'],
        threshold:0.42, includeScore:true, minMatchCharLength:2
      });
      matches = fuse.search(textQ).map(function(r){return r.item;});
    } else if(textQ.length >= 2) {
      var lq = textQ.toLowerCase();
      matches = list.filter(function(p){
        return p.name.toLowerCase().indexOf(lq)!==-1 ||
               p.typeLabel.toLowerCase().indexOf(lq)!==-1 ||
               p.group.toLowerCase().indexOf(lq)!==-1;
      });
    } else {
      matches = list.slice();
    }

    // Apply color filter (text synonyms)
    if(colorInfo) {
      var syns = colorInfo.synonyms;
      var colorMatches = matches.filter(function(p){
        var txt=(p.name+' '+p.typeLabel+' '+p.description).toLowerCase();
        return syns.some(function(s){return txt.indexOf(s)!==-1;});
      });

      // Also boost by canvas-extracted color
      var colorBoost = matches.filter(function(p){
        return p._extractedColor && syns.indexOf(p._extractedColor)!==-1;
      });

      // Merge: colorMatches first, then colorBoost (avoiding dups), then rest
      var seen={};
      var merged=[];
      colorMatches.concat(colorBoost).forEach(function(p){if(!seen[p.id]){seen[p.id]=true;merged.push(p);}});
      // If we have color-specific results, show them; otherwise show all matches with a note
      if(merged.length > 0) matches = merged;
    }

    matches = matches.slice(0, 8);

    if(matches.length === 0) {
      box.innerHTML = '<p style="font-family:Cinzel,serif;font-size:9px;letter-spacing:3px;'+
        'text-transform:uppercase;color:#888;text-align:center;padding:28px 20px;">'+
        'No results for &ldquo;'+he(rawQ)+'&rdquo;'+
        (colorInfo?'<br><span style="font-size:8px;letter-spacing:1px;margin-top:6px;display:block;color:#666;">Try a different colour or browse a category below.</span>':'')+
        '</p>';
      box.style.display='block';
      if(hint)hint.style.display='none';
      return;
    }

    box.innerHTML = matches.map(function(p,i){return resultHtml(p,i,matches.length);}).join('');
    box.style.display='block';
    if(hint)hint.style.display='none';
  }

  /* ── DEFAULT SUGGESTIONS UI ── */
  function renderDefaults(box, hint) {
    var recent = getRecent();
    var html = '<div style="padding:20px 20px 8px;">';

    if(recent.length) {
      html += '<div style="font-family:Cinzel,serif;font-size:8px;letter-spacing:2.5px;text-transform:uppercase;'+
        'color:#666;margin-bottom:10px;">Recent</div>'+
        '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;">'+
        recent.map(function(r){
          return '<button onclick="document.getElementById(\'search-input\').value='+JSON.stringify(r)+
            ';document.getElementById(\'search-input\').dispatchEvent(new Event(\'input\'))" '+
            'style="background:rgba(196,196,196,.08);border:1px solid rgba(196,196,196,.15);color:#d8d8d8;'+
            'font-family:\'Cormorant Garamond\',serif;font-size:14px;padding:5px 14px;cursor:pointer;transition:background .2s;" '+
            'onmouseover="this.style.background=\'rgba(196,196,196,.16)\'" '+
            'onmouseout="this.style.background=\'rgba(196,196,196,.08)\'">'+he(r)+'</button>';
        }).join('')+'</div>';
    }

    html += '<div style="font-family:Cinzel,serif;font-size:8px;letter-spacing:2.5px;text-transform:uppercase;'+
      'color:#666;margin-bottom:10px;">Browse Categories</div>'+
      '<div style="display:flex;flex-wrap:wrap;gap:8px;padding-bottom:16px;">'+
      DEFAULTS.map(function(d){
        var href = d.slug ? d.page+'?filter='+d.slug : d.page;
        return '<a href="'+href+'" onclick="closeSearch()" '+
          'style="background:rgba(196,196,196,.06);border:1px solid rgba(196,196,196,.14);color:#f2f2f2;'+
          'font-family:Cinzel,serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;'+
          'padding:8px 16px;text-decoration:none;transition:background .2s;display:inline-block;" '+
          'onmouseover="this.style.background=\'rgba(196,196,196,.15)\'" '+
          'onmouseout="this.style.background=\'rgba(196,196,196,.06)\'">'+he(d.label)+'</a>';
      }).join('')+
      '</div></div>';

    box.innerHTML = html;
    box.style.display = 'block';
    if(hint) hint.style.display = 'none';
  }

  /* ── INIT ── */
  function init() {
    var input   = document.getElementById('search-input');
    var overlay = document.getElementById('search-overlay');
    if(!input||!overlay) return;

    var hint = overlay.querySelector('p');
    var box  = document.createElement('div');
    box.id = 'hoa-sr';
    box.style.cssText = 'width:560px;max-width:90vw;margin-top:20px;background:#0e0e0e;'+
      'border:1px solid #1a1a1a;display:none;max-height:60vh;overflow-y:auto;';
    if(hint) hint.insertAdjacentElement('afterend', box);
    else overlay.appendChild(box);

    // Prefetch products + Fuse on first focus
    var prefetched = false;
    function prefetch() {
      if(prefetched) return; prefetched=true;
      loadFuse(function(){});
      loadProducts().then(function(list){
        // Kick off canvas color extraction in the background
        list.forEach(function(p){
          if(p.img && !colorCache[p.img]) {
            extractColor(p.img, function(name){ if(name) p._extractedColor=name; });
          } else if(colorCache[p.img]) {
            p._extractedColor = colorCache[p.img];
          }
        });
      });
    }

    // Recent searches expose for onclick handlers
    window.addRecentSearch = function(){};

    var currentQ = '';
    input.addEventListener('input', function(){
      var q = this.value.trim();
      currentQ = q;
      if(!q) {
        // Show defaults
        loadProducts().then(function(){ renderDefaults(box, hint); });
        return;
      }
      if(q.length < 2){ box.style.display='none'; if(hint)hint.style.display=''; return; }

      if(hint) hint.style.display='none';
      box.innerHTML='<p style="font-family:Cinzel,serif;font-size:9px;letter-spacing:3px;'+
        'text-transform:uppercase;color:#666;text-align:center;padding:24px;">Searching&hellip;</p>';
      box.style.display='block';

      Promise.all([
        loadProducts(),
        new Promise(function(res){loadFuse(res);})
      ]).then(function(results){
        if(input.value.trim()!==q) return;
        addRecent(q);
        doSearch(q, results[0], box, hint);
      });
    });

    input.addEventListener('focus', function(){
      prefetch();
      if(!this.value.trim()) {
        loadProducts().then(function(){ renderDefaults(box, hint); });
      }
    });

    input.addEventListener('keydown', function(e){
      if(e.key==='Enter'){
        var first=box.querySelector('a');
        if(first){addRecent(currentQ);first.click();}
      }
    });

    var _orig = window.closeSearch;
    window.closeSearch = function(){
      if(_orig) _orig();
      input.value=''; currentQ='';
      box.style.display='none'; box.innerHTML='';
      if(hint) hint.style.display='';
    };
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init);
  } else {
    init();
  }
})();
