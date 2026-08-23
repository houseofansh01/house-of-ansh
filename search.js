(function () {
  var TYPE_LABELS = {
    'bangles-bracelets': 'Bangles / Bracelets',
    'rings':             'Rings',
    'earrings':          'Earrings',
    'pendants':          'Pendants',
    'necklace-sets':     'Necklace Sets',
    'mangalsutra':       'Mangalsutra',
    'brooches':          'Brooches',
    'anklets':           'Anklets',
    'wristlets':         'Wristlets',
    'chain':             'Chain',
    'necklaces':         'Necklaces'
  };
  var GROUP_PAGE  = { forher: 'forher.html', forhim: 'forhim.html', virasat: 'virasat.html' };
  var GROUP_LABEL = { forher: 'For Her', forhim: 'For Him', virasat: 'Virasat' };

  var firebaseConfig = {
    apiKey: "AIzaSyBwqpavjzi15Zt9qHoufjJFI05k7AAHLRs",
    authDomain: "house-of-ansh.firebaseapp.com",
    projectId: "house-of-ansh",
    storageBucket: "house-of-ansh.firebasestorage.app",
    messagingSenderId: "386185011014",
    appId: "1:386185011014:web:fef798d4e17c84170bcf47"
  };

  var productsPromise = null;

  function he(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // Loaded live from Firestore on first use, so any product added in the admin
  // panel shows up in search automatically — nothing here needs to be kept in sync by hand.
  function loadProducts() {
    if (productsPromise) return productsPromise;
    productsPromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js")
    ]).then(function (mods) {
      var appMod = mods[0], fsMod = mods[1];
      var app = appMod.getApps().length ? appMod.getApps()[0] : appMod.initializeApp(firebaseConfig);
      var db  = fsMod.getFirestore(app);
      return fsMod.getDocs(fsMod.collection(db, 'products'));
    }).then(function (snap) {
      return snap.docs.map(function (d) {
        var p = d.data();
        var typeSlugs = (Array.isArray(p.productTypes) && p.productTypes.length)
          ? p.productTypes : (p.productType ? [p.productType] : []);
        var typeLabel = typeSlugs.map(function (s) { return TYPE_LABELS[s] || s; }).filter(Boolean).join(' · ');
        var thumb = (Array.isArray(p.images) && p.images[0]) || p.imageUrl || '';
        var cats  = Array.isArray(p.categories) ? p.categories : (p.category ? [p.category] : []);
        var groupKey = cats.indexOf('virasat') !== -1 ? 'virasat' : (cats.indexOf('forhim') !== -1 ? 'forhim' : 'forher');
        return {
          id: d.id,
          name: p.name || '',
          price: Number(p.price) || 0,
          img: thumb,
          cat: typeSlugs.join(' '),
          typeLabel: typeLabel,
          group: GROUP_LABEL[groupKey],
          page: GROUP_PAGE[groupKey],
          availability: p.availability || 'in-stock'
        };
      });
    }).catch(function () { return []; });
    return productsPromise;
  }

  function init() {
    var input   = document.getElementById('search-input');
    var overlay = document.getElementById('search-overlay');
    if (!input || !overlay) return;

    var hint = overlay.querySelector('p');

    var box = document.createElement('div');
    box.id = 'hoa-sr';
    box.style.cssText = [
      'width:560px;max-width:90vw;margin-top:20px',
      'background:#0e0e0e;border:1px solid #1a1a1a',
      'display:none;max-height:60vh;overflow-y:auto'
    ].join(';');
    if (hint) hint.insertAdjacentElement('afterend', box);
    else overlay.appendChild(box);

    function renderMatches(q, list) {
      var lq = q.toLowerCase();
      var matches = list.filter(function (p) {
        return p.name.toLowerCase().indexOf(lq) !== -1 ||
          p.typeLabel.toLowerCase().indexOf(lq) !== -1 ||
          p.group.toLowerCase().indexOf(lq) !== -1;
      }).slice(0, 8);

      if (matches.length === 0) {
        box.innerHTML =
          '<p style="font-family:Cinzel,serif;font-size:9px;letter-spacing:3px;' +
          'text-transform:uppercase;color:#555;text-align:center;padding:24px;">' +
          'No results for &ldquo;' + he(q) + '&rdquo;</p>';
        box.style.display = 'block';
        return;
      }

      box.innerHTML = matches.map(function (p, i) {
        var border = i < matches.length - 1 ? 'border-bottom:1px solid #1a1a1a;' : '';
        var href = 'product.html?id=' + encodeURIComponent(p.id) +
          '&name=' + encodeURIComponent(p.name) +
          '&cat=' + encodeURIComponent(p.cat) +
          '&price=' + encodeURIComponent(p.price) +
          '&avail=' + encodeURIComponent(p.availability) +
          '&img=' + encodeURIComponent(p.img) +
          '&from=' + encodeURIComponent(p.page);
        var thumbHtml = p.img
          ? '<img src="' + p.img + '" style="width:42px;height:42px;object-fit:cover;margin-right:14px;flex-shrink:0;" alt=""/>'
          : '<div style="width:42px;height:42px;background:#1a1a1a;margin-right:14px;flex-shrink:0;"></div>';
        return '<a href="' + href + '" onclick="closeSearch()" ' +
          'style="display:flex;align-items:center;justify-content:space-between;' +
          'padding:14px 20px;text-decoration:none;' + border +
          'transition:background .15s;" ' +
          'onmouseover="this.style.background=\'rgba(255,255,255,.04)\'" ' +
          'onmouseout="this.style.background=\'\'">' +
          '<div style="display:flex;align-items:center;min-width:0;">' + thumbHtml +
          '<div style="min-width:0;">' +
          '<div style="font-family:\'Playfair Display\',serif;font-size:14px;' +
          'font-style:italic;color:#f5f5f5;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + he(p.name) + '</div>' +
          '<div style="font-family:Cinzel,serif;font-size:7.5px;letter-spacing:2px;' +
          'text-transform:uppercase;color:#555;">' + he(p.group) + (p.typeLabel ? ' · ' + he(p.typeLabel) : '') +
          '</div></div></div>' +
          '<span style="font-family:\'Cormorant Garamond\',serif;font-size:16px;' +
          'color:#909090;flex-shrink:0;margin-left:20px;">' +
          '₹' + p.price.toLocaleString('en-IN') + '</span>' +
          '</a>';
      }).join('');
      box.style.display = 'block';
    }

    function render(q) {
      if (!q || q.length < 2) {
        box.style.display = 'none';
        if (hint) hint.style.display = '';
        return;
      }
      if (hint) hint.style.display = 'none';
      box.innerHTML =
        '<p style="font-family:Cinzel,serif;font-size:9px;letter-spacing:3px;' +
        'text-transform:uppercase;color:#555;text-align:center;padding:24px;">Searching&hellip;</p>';
      box.style.display = 'block';
      loadProducts().then(function (list) {
        if (input.value.trim() !== q) return; // input moved on while we were fetching
        renderMatches(q, list);
      });
    }

    input.addEventListener('input', function () { render(this.value.trim()); });
    input.addEventListener('focus', function () { loadProducts(); }); // prefetch so first keystroke feels instant

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = box.querySelector('a');
        if (first) { first.click(); return; }
      }
    });

    // Wrap closeSearch to also reset state
    var _orig = window.closeSearch;
    window.closeSearch = function () {
      if (_orig) _orig();
      input.value = '';
      box.style.display = 'none';
      box.innerHTML = '';
      if (hint) hint.style.display = '';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
