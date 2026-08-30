/* Review carousel.
 *
 * Progressive enhancement: the markup renders a usable first slide with no
 * JavaScript at all, and this file adds sliding, arrows, dots, swipe, keyboard
 * control and autoplay on top of it.
 *
 * Autoplay stops permanently once someone interacts, and never starts for a
 * visitor who prefers reduced motion - a testimonial sliding away mid-sentence
 * is worse than one that sits still.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var track = root.querySelector('[data-carousel-track]');
  var slides = track ? Array.prototype.slice.call(track.children) : [];
  if (slides.length < 2) return;

  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-carousel-dot]'));
  var prev = root.querySelector('[data-carousel-prev]');
  var next = root.querySelector('[data-carousel-next]');

  var index = 0;
  var timer = null;
  var INTERVAL = 6000;

  var reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    /* matchMedia unavailable; treat as no preference. */
  }

  function show(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + index * 100 + '%)';

    slides.forEach(function (slide, n) {
      // Hide off-screen slides from assistive tech and from tab order, so a
      // screen reader is not read five testimonials as one run-on block.
      if (n === index) {
        slide.removeAttribute('aria-hidden');
      } else {
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    dots.forEach(function (dot, n) {
      if (n === index) {
        dot.classList.add('is-active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('is-active');
        dot.removeAttribute('aria-current');
      }
    });
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  /* Any deliberate interaction ends autoplay for the rest of the visit: once
   * someone is driving, taking control back from them is hostile. */
  function interact(fn) {
    return function (e) {
      stop();
      fn(e);
    };
  }

  if (prev) prev.addEventListener('click', interact(function () { show(index - 1); }));
  if (next) next.addEventListener('click', interact(function () { show(index + 1); }));

  dots.forEach(function (dot, n) {
    dot.addEventListener('click', interact(function () { show(n); }));
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      stop();
      show(index - 1);
    } else if (e.key === 'ArrowRight') {
      stop();
      show(index + 1);
    }
  });

  /* Touch swipe. Horizontal intent only: a mostly-vertical drag is the visitor
   * scrolling the page, and hijacking that would trap them on the carousel. */
  var startX = 0;
  var startY = 0;
  var tracking = false;

  root.addEventListener('touchstart', function (e) {
    if (!e.touches || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  root.addEventListener('touchend', function (e) {
    if (!tracking) return;
    tracking = false;
    var touch = (e.changedTouches && e.changedTouches[0]) || null;
    if (!touch) return;

    var dx = touch.clientX - startX;
    var dy = touch.clientY - startY;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;

    stop();
    show(dx < 0 ? index + 1 : index - 1);
  }, { passive: true });

  // Pause while hovered, so a review cannot slide away mid-read.
  root.addEventListener('mouseenter', stop);

  show(0);

  if (!reducedMotion) {
    timer = window.setInterval(function () { show(index + 1); }, INTERVAL);
  }
})();
