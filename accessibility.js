(function () {
  function inferAlt(src) {
    if (!src) return "Site image";
    var name = src.split('/').pop().split('\\').pop().split('?')[0].split('#')[0];
    name = name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
    if (!name) return "Site image";
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  function relPathToRoot() {
    var p = (location.pathname || '').replace(/\\/g, '/');
    var idx = p.toLowerCase().indexOf('/thewholewebsite2.0/');
    if (idx === -1) return '';
    var sub = p.slice(idx + '/thewholewebsite2.0/'.length);
    var segs = sub.split('/');
    if (segs.length <= 1) return '';
    return '../'.repeat(segs.length - 1);
  }

  function enhanceHomepage(main, side, rootPrefix) {
    if (!main || main.querySelector('.home-hero')) return;

    main.classList.add('home-main');
    if (side) side.classList.add('home-side');

    var hero = document.createElement('section');
    hero.className = 'home-hero';
    hero.innerHTML =
      '<p class="eyebrow">UIS Cybersecurity</p>' +
      '<h1>Center for Systems Security and Information Assurance</h1>' +
      '<p>The center advances cybersecurity education, research, and public service through academic programs, faculty scholarship, and regional partnerships.</p>' +
      '<div class="home-actions">' +
        '<a class="uis-btn" href="' + rootPrefix + 'education.html">Explore Programs</a>' +
        '<a class="uis-btn ghost" href="' + rootPrefix + 'research.html">Meet Faculty</a>' +
        '<a class="uis-btn ghost" href="' + rootPrefix + 'conferences.html">View Conferences</a>' +
      '</div>';

    main.insertBefore(hero, main.firstChild);

    var allWelcome = main.querySelectorAll('.welcome');
    if (allWelcome.length > 0) allWelcome[0].classList.add('home-news-card');
    if (allWelcome.length > 1) allWelcome[1].classList.add('home-mission-card');

    if (side && !side.querySelector('.side-highlight')) {
      var card = document.createElement('section');
      card.className = 'side-highlight';
      card.innerHTML =
        '<h3>Quick Links</h3>' +
        '<ul>' +
          '<li><a href="' + rootPrefix + 'education.html">Program of Study</a></li>' +
          '<li><a href="' + rootPrefix + 'resources.html">Learning Resources</a></li>' +
          '<li><a href="' + rootPrefix + 'outreach.html">Community Outreach</a></li>' +
          '<li><a href="https://www.uis.edu/admissions">Admissions</a></li>' +
        '</ul>';
      side.insertBefore(card, side.firstChild);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.setAttribute('lang', 'en');

    if (!document.querySelector('.skip-link')) {
      var skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#main-content';
      skip.textContent = 'Skip to main content';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    var topMenu = document.getElementById('top_menu');
    if (topMenu) {
      topMenu.setAttribute('role', 'navigation');
      topMenu.setAttribute('aria-label', 'Primary navigation');
      var rename = {
        'education.html': 'Programs',
        '../education.html': 'Programs',
        '../../education.html': 'Programs',
        'research.html': 'Faculty',
        '../research.html': 'Faculty',
        '../../research.html': 'Faculty'
      };
      topMenu.querySelectorAll('a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').toLowerCase();
        if (rename[href]) a.textContent = rename[href];
      });
    }

    var bottom = document.getElementById('bottom_table');
    if (bottom) {
      bottom.setAttribute('role', 'contentinfo');
      bottom.setAttribute('aria-label', 'Footer navigation');
      bottom.querySelectorAll('a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').toLowerCase();
        if (href.indexOf('education.html') >= 0) a.textContent = 'Programs';
        if (href.indexOf('research.html') >= 0) a.textContent = 'Faculty';
      });
    }

    var side = document.querySelector('td.side_bar, td.side_bar_up, td.side_bar_down');
    if (side) {
      side.setAttribute('role', 'complementary');
      side.setAttribute('aria-label', 'Sidebar links');
    }

    var main = document.querySelector('td.main, td.main1');
    if (main) {
      main.id = 'main-content';
      main.setAttribute('role', 'main');
      main.setAttribute('tabindex', '-1');
    }

    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('#top_menu a, #bottom_table a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === page) a.setAttribute('aria-current', 'page');
    });

    document.querySelectorAll('img').forEach(function (img) {
      var alt = img.getAttribute('alt');
      if (alt === null || alt.trim() === '') img.setAttribute('alt', inferAlt(img.getAttribute('src')));
    });

    document.querySelectorAll('marquee').forEach(function (mq) {
      var text = (mq.textContent || '').replace(/\s+/g, ' ').trim();
      if (text) {
        var fallback = document.createElement('p');
        fallback.className = 'marquee-fallback';
        fallback.textContent = text;
        mq.parentNode.insertBefore(fallback, mq.nextSibling);
      }
      mq.setAttribute('aria-hidden', 'true');
    });

    var logo = document.getElementById('logo');
    if (logo) {
      var logoCell = logo.querySelector('td');
      if (logoCell && !logoCell.querySelector('.uis-brand')) {
        logoCell.innerHTML = '';
        var brand = document.createElement('div');
        brand.className = 'uis-brand';
        brand.innerHTML = '<p class="kicker">University of Illinois Springfield</p>' +
          '<p class="title">Center for Systems Security and Information Assurance</p>' +
          '<p class="subtitle">Cybersecurity education, research, and outreach</p>';
        logoCell.appendChild(brand);
      }
    }

    var rootPrefix = relPathToRoot();

    if ((page === '' || page === 'index.html') && main) {
      enhanceHomepage(main, side, rootPrefix);
    }

    if (!document.querySelector('.uis-site-footer')) {
      var footer = document.createElement('section');
      footer.className = 'uis-site-footer';
      footer.setAttribute('aria-label', 'Center footer');
      footer.innerHTML =
        '<div class="inner">' +
          '<div><h4>Center for Systems Security and Information Assurance</h4>' +
          '<p>One University Plaza, UHB 3100, Springfield, Illinois, 62703-5407</p>' +
          '<p>csc@uis.edu • 217-206-6770</p></div>' +
          '<div><h4>Site Links</h4><ul>' +
          '<li><a href="' + rootPrefix + 'education.html">Programs</a></li>' +
          '<li><a href="' + rootPrefix + 'conferences.html">Conferences</a></li>' +
          '<li><a href="' + rootPrefix + 'research.html">Faculty</a></li>' +
          '<li><a href="' + rootPrefix + 'resources.html">Resources</a></li>' +
          '</ul></div>' +
          '<div><h4>Resources</h4><ul>' +
          '<li><a href="https://www.uis.edu/admissions">How to Apply</a></li>' +
          '<li><a href="https://www.uis.edu/cost-aid">Cost & Aid</a></li>' +
          '<li><a href="https://www.uis.edu/visit">Visit</a></li>' +
          '<li><a href="https://www.uis.edu/request-information">Request Info</a></li>' +
          '</ul></div>' +
        '</div>' +
        '<div class="legal">© 2026 The Board of Trustees of the University of Illinois | <a href="https://www.uis.edu/accessibility">Accessibility</a> | <a href="https://www.uis.edu/privacy-policy">Privacy Notice</a> | <a href="https://www.uis.edu/foia">FOIA</a> | <a href="https://www.uis.edu/emergency">Emergency</a></div>';

      var anchor = document.getElementById('bottom_table');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(footer, anchor.nextSibling);
      else document.body.appendChild(footer);
    }
  });
})();
