const sticky = document.querySelector('.sticky-cta');
if (sticky) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        sticky.setAttribute('inert', '');
      } else {
        sticky.removeAttribute('inert');
      }
      sticky.classList.toggle('visible', !entry.isIntersecting);
    },
    { threshold: 0 }
  );
  const hero = document.querySelector('.hero');
  if (hero) observer.observe(hero);
}
