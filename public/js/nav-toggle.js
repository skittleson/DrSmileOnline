// Mobile nav hamburger toggle.
// External file (served from 'self') so it complies with the site CSP,
// which forbids inline scripts and inline event handlers.
(function () {
  document.querySelectorAll('.nav-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var menu = document.getElementById('nav-menu');
      if (!menu) return;
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      if (open) {
        var first = menu.querySelector('a, button');
        if (first) first.focus();
      }
    });
  });
})();
