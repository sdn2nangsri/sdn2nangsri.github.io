/* Daftar berita, terbaru di atas, dengan kotak pencarian sederhana. */
document.addEventListener('DOMContentLoaded', async () => {
  const berita = await fetch('data/berita.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));
  berita.sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));

  const listEl = document.getElementById('daftar-berita');
  const cariEl = document.getElementById('cari-berita');

  function render(items) {
    if (!items.length) {
      listEl.innerHTML = '<p class="muted">Tidak ada berita yang cocok dengan pencarian.</p>';
      return;
    }
    listEl.innerHTML = items
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
    Anim.scan(listEl);
  }

  render(berita);

  if (cariEl) {
    cariEl.addEventListener('input', () => {
      const q = cariEl.value.trim().toLowerCase();
      render(
        q
          ? berita.filter((b) =>
              `${b.judul || ''} ${b.ringkasan || ''} ${b.penulis || ''}`.toLowerCase().includes(q)
            )
          : berita
      );
    });
  }
});
