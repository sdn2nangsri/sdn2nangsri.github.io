/* Galeri: grid foto, filter per album, lightbox sederhana. */
document.addEventListener('DOMContentLoaded', async () => {
  const foto = await fetch('data/galeri.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));
  foto.sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));

  const albums = ['Semua', ...new Set(foto.map((f) => f.album).filter(Boolean))];
  const filterEl = document.getElementById('filter');
  const gridEl = document.getElementById('galeri');

  function render(album) {
    const list = album === 'Semua' ? foto : foto.filter((f) => f.album === album);
    gridEl.innerHTML = list
      .map(
        (f, i) => `
        <figure class="card galeri-item" data-i="${i}" data-album="${esc(f.album)}"
          data-reveal="zoom" data-reveal-delay="${(i % 8) * 70}">
          <img class="thumb" src="assets/img/galeri/${esc(f.foto)}" alt="${esc(f.judul)}" loading="lazy">
          <figcaption class="card-body">
            <h3>${esc(f.judul)}</h3>
            <span class="meta">${esc(f.album)} · ${fmtDate(f.tanggal)}</span>
          </figcaption>
        </figure>`
      )
      .join('');

    gridEl.querySelectorAll('.galeri-item').forEach((el) => {
      el.addEventListener('click', () => {
        const f = list[+el.dataset.i];
        openLightbox('assets/img/galeri/' + f.foto, `${f.judul} — ${fmtDate(f.tanggal)}`);
      });
    });

    Anim.scan(gridEl); // item baru hasil filter ikut dianimasikan
  }

  filterEl.innerHTML = albums
    .map((a, i) => `<button${i === 0 ? ' class="active"' : ''} data-album="${esc(a)}">${esc(a)}</button>`)
    .join('');
  filterEl.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      filterEl.querySelector('.active')?.classList.remove('active');
      btn.classList.add('active');
      render(btn.dataset.album);
    });
  });

  const lb = document.getElementById('lightbox');
  function openLightbox(src, caption) {
    lb.querySelector('img').src = src;
    lb.querySelector('img').alt = caption;
    lb.querySelector('.caption').textContent = caption;
    lb.classList.add('open');
  }
  function closeLightbox() {
    lb.classList.remove('open');
    lb.querySelector('img').src = '';
  }
  lb.addEventListener('click', (e) => {
    if (e.target === lb || e.target.classList.contains('close')) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  render('Semua');
});
