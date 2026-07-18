/* Detail artikel: memuat data/artikel/<slug>.txt sesuai ?id= */
document.addEventListener('DOMContentLoaded', async () => {
  const isiEl = document.getElementById('isi');
  const id = (new URLSearchParams(location.search).get('id') || '').toLowerCase();

  /* slug hanya boleh huruf/angka/tanda hubung */
  if (!/^[a-z0-9-]+$/.test(id)) {
    isiEl.innerHTML = '<p>Artikel tidak ditemukan. <a href="berita.html">Kembali ke daftar berita.</a></p>';
    return;
  }

  const res = await fetch('data/artikel/' + id + '.txt');
  if (!res.ok) {
    isiEl.innerHTML = '<p>Artikel tidak ditemukan. <a href="berita.html">Kembali ke daftar berita.</a></p>';
    return;
  }

  const { meta, body } = Parser.parseArticle(await res.text());
  document.title = meta.judul + ' — SD Negeri 2 Nangsri';
  document.getElementById('judul').textContent = meta.judul;
  document.getElementById('meta').textContent = `${fmtDate(meta.tanggal)} · ${meta.penulis || ''}`;

  const cover =
    meta.foto && meta.foto !== '-'
      ? `<img class="cover" data-reveal src="assets/img/berita/${esc(meta.foto)}" alt="${esc(meta.judul)}">`
      : '';
  const paras = body
    .split(/\n\s*\n/)
    .map((p, i) => `<p data-reveal data-reveal-delay="${(i % 5) * 80}">${esc(p.trim())}</p>`)
    .join('');
  isiEl.innerHTML = cover + paras;

  Anim.scan(isiEl);
});
