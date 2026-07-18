/* Animasi situs: reveal saat scroll, angka berhitung, dan efek header.
 * JS hanya memicu class — gaya animasinya ada di style.css (blok "Animasi").
 *
 * Pemakaian di HTML/render:
 *   data-reveal                  -> fade + naik saat masuk viewport
 *   data-reveal="left|right|zoom"-> varian arah
 *   data-reveal-delay="200"      -> tunda 200 ms (efek berurutan antar kartu)
 *   data-counter="123"           -> angka berhitung 0 -> 123 saat terlihat
 *
 * page-*.js memanggil Anim.scan() setiap selesai me-render konten dinamis.
 */
document.documentElement.classList.add('js');

const Anim = (() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    const target = parseInt(el.dataset.counter, 10);
    if (reduce || !isFinite(target)) {
      el.textContent = el.dataset.counter;
      return;
    }
    const dur = 1200;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  const io =
    'IntersectionObserver' in window
      ? new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue;
              reveal(e.target);
              io.unobserve(e.target);
            }
          },
          { threshold: 0.15 }
        )
      : null;

  function reveal(el) {
    el.classList.add('is-visible');
    if (el.dataset.counter !== undefined) countUp(el);
    if (el.dataset.reveal !== undefined) {
      /* Setelah animasi masuk selesai, lepas atributnya agar transisi hover
         kartu kembali cepat dan aturan transform lain (mis. rotasi mading)
         berlaku lagi. */
      el.addEventListener(
        'transitionend',
        () => {
          el.removeAttribute('data-reveal');
          el.style.transitionDelay = '';
        },
        { once: true }
      );
    }
  }

  function scan(root = document) {
    root
      .querySelectorAll('[data-reveal]:not(.is-visible), [data-counter]:not(.is-visible)')
      .forEach((el) => {
        if (reduce || !io) {
          el.classList.add('is-visible');
          if (el.dataset.counter !== undefined) el.textContent = el.dataset.counter;
          el.removeAttribute('data-reveal');
          return;
        }
        if (el.dataset.revealDelay) el.style.transitionDelay = el.dataset.revealDelay + 'ms';
        io.observe(el);
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    scan();

    /* Bayangan header setelah halaman di-scroll (throttle via rAF). */
    let ticking = false;
    addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          document.body.classList.toggle('scrolled', scrollY > 10);
          ticking = false;
        });
      },
      { passive: true }
    );
  });

  return { scan, reduce };
})();
