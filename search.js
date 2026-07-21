(function () {
  var PRODUCTS = [
    // ── FOR HER ──────────────────────────────────────────────────
    {n:'Sterling Bangle Set 01',   c:'bangles-bracelets', g:'For Her', p:'forher.html', r:1999},
    {n:'Sterling Bangle Set 02',   c:'bangles-bracelets', g:'For Her', p:'forher.html', r:1999},
    {n:'Twisted Bangle 01',        c:'bangles-bracelets', g:'For Her', p:'forher.html', r:1999},
    {n:'Twisted Bangle 02',        c:'bangles-bracelets', g:'For Her', p:'forher.html', r:1999},
    {n:'Moonflower Ring 01',       c:'rings',             g:'For Her', p:'forher.html', r:1999},
    {n:'Moonflower Ring 02',       c:'rings',             g:'For Her', p:'forher.html', r:1999},
    {n:'Lotus Band Ring 01',       c:'rings',             g:'For Her', p:'forher.html', r:1999},
    {n:'Lotus Band Ring 02',       c:'rings',             g:'For Her', p:'forher.html', r:1999},
    {n:'Cascade Drop Earring 01',  c:'earrings',          g:'For Her', p:'forher.html', r:1999},
    {n:'Cascade Drop Earring 02',  c:'earrings',          g:'For Her', p:'forher.html', r:1999},
    {n:'Silver Hoop 01',           c:'earrings',          g:'For Her', p:'forher.html', r:1999},
    {n:'Silver Hoop 02',           c:'earrings',          g:'For Her', p:'forher.html', r:1999},
    {n:'Lotus Pendant 01',         c:'pendants',          g:'For Her', p:'forher.html', r:1999},
    {n:'Lotus Pendant 02',         c:'pendants',          g:'For Her', p:'forher.html', r:1999},
    {n:'Crescent Pendant 01',      c:'pendants',          g:'For Her', p:'forher.html', r:1999},
    {n:'Crescent Pendant 02',      c:'pendants',          g:'For Her', p:'forher.html', r:1999},
    {n:'Heritage Necklace Set 01', c:'necklace-sets',     g:'For Her', p:'forher.html', r:1999},
    {n:'Heritage Necklace Set 02', c:'necklace-sets',     g:'For Her', p:'forher.html', r:1999},
    {n:'Layered Necklace Set 01',  c:'necklace-sets',     g:'For Her', p:'forher.html', r:1999},
    {n:'Layered Necklace Set 02',  c:'necklace-sets',     g:'For Her', p:'forher.html', r:1999},
    {n:'Mangalsutra Classic 01',   c:'mangalsutra',       g:'For Her', p:'forher.html', r:1999},
    {n:'Mangalsutra Classic 02',   c:'mangalsutra',       g:'For Her', p:'forher.html', r:1999},
    {n:'Mangalsutra Slim 01',      c:'mangalsutra',       g:'For Her', p:'forher.html', r:1999},
    {n:'Mangalsutra Slim 02',      c:'mangalsutra',       g:'For Her', p:'forher.html', r:1999},
    {n:'Bloom Brooch 01',          c:'brooches',          g:'For Her', p:'forher.html', r:1999},
    {n:'Bloom Brooch 02',          c:'brooches',          g:'For Her', p:'forher.html', r:1999},
    {n:'Leaf Brooch 01',           c:'brooches',          g:'For Her', p:'forher.html', r:1999},
    {n:'Leaf Brooch 02',           c:'brooches',          g:'For Her', p:'forher.html', r:1999},
    {n:'Silver Anklet 01',         c:'anklets',           g:'For Her', p:'forher.html', r:1999},
    {n:'Silver Anklet 02',         c:'anklets',           g:'For Her', p:'forher.html', r:1999},
    {n:'Charm Anklet 01',          c:'anklets',           g:'For Her', p:'forher.html', r:1999},
    {n:'Charm Anklet 02',          c:'anklets',           g:'For Her', p:'forher.html', r:1999},
    // ── FOR HIM ──────────────────────────────────────────────────
    {n:'Sterling Wristlet 01',     c:'wristlets',         g:'For Him', p:'forhim.html', r:2499},
    {n:'Sterling Wristlet 02',     c:'wristlets',         g:'For Him', p:'forhim.html', r:2499},
    {n:'Chain Wristlet 01',        c:'wristlets',         g:'For Him', p:'forhim.html', r:2499},
    {n:'Chain Wristlet 02',        c:'wristlets',         g:'For Him', p:'forhim.html', r:2499},
    {n:'Silver Chain 01',          c:'chain',             g:'For Him', p:'forhim.html', r:2499},
    {n:'Silver Chain 02',          c:'chain',             g:'For Him', p:'forhim.html', r:2499},
    {n:'Figaro Chain 01',          c:'chain',             g:'For Him', p:'forhim.html', r:2499},
    {n:'Figaro Chain 02',          c:'chain',             g:'For Him', p:'forhim.html', r:2499},
    {n:'Lapel Brooch 01',          c:'brooches',          g:'For Him', p:'forhim.html', r:2499},
    {n:'Lapel Brooch 02',          c:'brooches',          g:'For Him', p:'forhim.html', r:2499},
    {n:'Shield Brooch 01',         c:'brooches',          g:'For Him', p:'forhim.html', r:2499},
    {n:'Shield Brooch 02',         c:'brooches',          g:'For Him', p:'forhim.html', r:2499},
    // ── VIRASAT ──────────────────────────────────────────────────
    {n:'Virasat Heritage Necklace Set 01', c:'necklace-sets',     g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Heritage Necklace Set 02', c:'necklace-sets',     g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Jhumka 01',               c:'earrings',          g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Jhumka 02',               c:'earrings',          g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Kangan 01',               c:'bangles-bracelets', g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Kangan 02',               c:'bangles-bracelets', g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Kundan Ring 01',          c:'rings',             g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Kundan Ring 02',          c:'rings',             g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Temple Pendant 01',       c:'pendants',          g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Temple Pendant 02',       c:'pendants',          g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Mangalsutra 01',          c:'mangalsutra',       g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Mangalsutra 02',          c:'mangalsutra',       g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Payal 01',                c:'anklets',           g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Payal 02',                c:'anklets',           g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Brooch 01',               c:'brooches',          g:'Virasat', p:'virasat.html', r:3999},
    {n:'Virasat Wristlet 01',             c:'wristlets',         g:'Virasat', p:'virasat.html', r:3999}
  ];

  var CAT_LABELS = {
    'bangles-bracelets': 'Bangles & Bracelets',
    'rings':             'Rings',
    'earrings':          'Earrings',
    'pendants':          'Pendants',
    'necklace-sets':     'Necklace Sets',
    'mangalsutra':       'Mangalsutra',
    'brooches':          'Brooches',
    'anklets':           'Anklets',
    'wristlets':         'Wristlets',
    'chain':             'Chain'
  };

  function init() {
    var input   = document.getElementById('search-input');
    var overlay = document.getElementById('search-overlay');
    if (!input || !overlay) return;

    var hint = overlay.querySelector('p');

    // Inject results container
    var box = document.createElement('div');
    box.id = 'hoa-sr';
    box.style.cssText = [
      'width:560px;max-width:90vw;margin-top:20px',
      'background:#0e0e0e;border:1px solid #1a1a1a',
      'display:none;max-height:60vh;overflow-y:auto'
    ].join(';');
    if (hint) hint.insertAdjacentElement('afterend', box);
    else overlay.appendChild(box);

    function render(q) {
      if (!q || q.length < 2) {
        box.style.display = 'none';
        if (hint) hint.style.display = '';
        return;
      }
      if (hint) hint.style.display = 'none';

      var lq = q.toLowerCase();
      var matches = PRODUCTS.filter(function (p) {
        return p.n.toLowerCase().indexOf(lq) !== -1 ||
          (CAT_LABELS[p.c] || '').toLowerCase().indexOf(lq) !== -1 ||
          p.g.toLowerCase().indexOf(lq) !== -1;
      }).slice(0, 8);

      if (matches.length === 0) {
        box.innerHTML =
          '<p style="font-family:Cinzel,serif;font-size:9px;letter-spacing:3px;' +
          'text-transform:uppercase;color:#555;text-align:center;padding:24px;">' +
          'No results for &ldquo;' + q + '&rdquo;</p>';
        box.style.display = 'block';
        return;
      }

      box.innerHTML = matches.map(function (p, i) {
        var border = i < matches.length - 1 ? 'border-bottom:1px solid #1a1a1a;' : '';
        var href   = p.g === 'Virasat' ? p.p : (p.p + '#' + p.c);
        return '<a href="' + href + '" onclick="closeSearch()" ' +
          'style="display:flex;justify-content:space-between;align-items:center;' +
          'padding:14px 20px;text-decoration:none;' + border +
          'transition:background .15s;" ' +
          'onmouseover="this.style.background=\'rgba(255,255,255,.04)\'" ' +
          'onmouseout="this.style.background=\'\'">' +
          '<div>' +
          '<div style="font-family:\'Playfair Display\',serif;font-size:14px;' +
          'font-style:italic;color:#f5f5f5;margin-bottom:4px;">' + p.n + '</div>' +
          '<div style="font-family:Cinzel,serif;font-size:7.5px;letter-spacing:2px;' +
          'text-transform:uppercase;color:#555;">' + p.g + ' · ' +
          (CAT_LABELS[p.c] || p.c) + '</div>' +
          '</div>' +
          '<span style="font-family:\'Cormorant Garamond\',serif;font-size:16px;' +
          'color:#909090;flex-shrink:0;margin-left:20px;">' +
          '₹' + p.r.toLocaleString('en-IN') + '</span>' +
          '</a>';
      }).join('');
      box.style.display = 'block';
    }

    input.addEventListener('input', function () { render(this.value.trim()); });

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
