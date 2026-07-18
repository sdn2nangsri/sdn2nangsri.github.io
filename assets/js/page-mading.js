/* Mading: kartu "sticky note" karya siswa, terbaru dulu. */
document.addEventListener('DOMContentLoaded', async () => {
  const karya = await fetch('data/mading.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));
  karya.sort((a, b) => (b.tanggal || '').localeCompare(a.tanggal || ''));

  const labelJenis = {
    puisi: '📝 Puisi',
    pantun: '🎋 Pantun',
    cerpen: '📚 Cerpen',
    gambar: '🎨 Gambar',
    info: '📢 Info',
  };

  document.getElementById('mading').innerHTML = karya
    .map((k, i) => {
      const gambar =
        k.jenis === 'gambar' && k.foto
          ? `<img src="assets/img/mading/${esc(k.foto)}" alt="${esc(k.judul)}" loading="lazy">`
          : '';
      return `
      <div class="note" data-reveal="zoom" data-reveal-delay="${(i % 4) * 100}">
        <span class="badge">${labelJenis[k.jenis] || '⭐ Karya'}</span>
        <h3>${esc(k.judul)}</h3>
        ${gambar}
        <div class="isi">${esc(k.isi)}</div>
        <div class="oleh">— ${esc(k.nama)}, ${esc(k.kelas)} · ${fmtDate(k.tanggal)}</div>
      </div>`;
    })
    .join('');

  Anim.scan();
});
