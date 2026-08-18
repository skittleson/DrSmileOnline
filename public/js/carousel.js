// Testimonial carousel controls.
// External file (served from 'self') so it complies with the site CSP,
// which forbids inline scripts and inline event handlers.
(function () {
  document.querySelectorAll('.carousel').forEach(function (carousel) {
    var track = carousel.querySelector('.carousel-track');
    if (!track) return;
    var slides = Array.prototype.slice.call(track.querySelectorAll('.carousel-slide'));
    if (slides.length === 0) return;

    function show(index) {
      var current = ((index % slides.length) + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.setAttribute('aria-hidden', i !== current ? 'true' : 'false');
      });
      track.style.transform = 'translateX(-' + current * 100 + '%)';
    }
    function currentIndex() {
      return slides.findIndex(function (s) {
        return s.getAttribute('aria-hidden') === 'false';
      });
    }

    carousel.querySelectorAll('.carousel-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dir = btn.getAttribute('data-dir') === 'prev' ? -1 : 1;
        var base = currentIndex();
        show((base === -1 ? 0 : base) + dir);
      });
    });
  });
})();
