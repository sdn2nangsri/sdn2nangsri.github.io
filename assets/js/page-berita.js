/* Daftar berita, terbaru di atas. */
document.addEventListener('DOMContentLoaded', async () => {
  const berita = await fetch('data/berita.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));
  berita.sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));

  document.getElementById('daftar-berita').innerHTML = berita
    .map(
      (b, i) => `
      <article class="card" data-reveal data-reveal-delay="${(i % 3) * 120}">
        <a href="artikel.html?id=${encodeURIComponent(b.slug)}">
          <img class="thumb" src="assets/img/berita/${esc(b.foto)}" alt="${esc(b.judul)}" loading="lazy">
        </a>
        <div class="card-body">
          <span class="meta">${fmtDate(b.tanggal)} · ${esc(b.penulis)}</span>
          <h3><a href="artikel.html?id=${encodeURIComponent(b.slug)}">${esc(b.judul)}</a></h3>
          <p class="meta">${esc(b.ringkasan)}</p>
          <a href="artikel.html?id=${encodeURIComponent(b.slug)}">Baca selengkapnya →</a>
        </div>
      </article>`
    )
    .join('');

  Anim.scan();
});
