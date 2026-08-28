/* Lightweight scroll parallax for elements marked data-parallax="<factor>".
 * A positive factor moves the element slower than the page (classic
 * background-drift effect); works on any element, not just backgrounds, and
 * skips entirely for reduced-motion users or on touch-scroll jank-prone
 * browsers is avoided by keeping the transform rAF-throttled.
 */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!els.length) return;

  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;

    els.forEach(function (el) {
      var factor = parseFloat(el.getAttribute('data-parallax')) || 0.15;
      var scale = el.getAttribute('data-parallax-scale');
      var rect = el.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var offset = (center - vh / 2) * factor;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)' + (scale ? ' scale(' + scale + ')' : '');
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
