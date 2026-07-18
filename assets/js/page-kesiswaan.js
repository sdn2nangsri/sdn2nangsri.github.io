/* Kesiswaan: tabel siswa per kelas, prestasi, pembiasaan, tata tertib. */
document.addEventListener('DOMContentLoaded', async () => {
  const rec = await fetch('data/kesiswaan.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));

  const kelas = rec.filter((r) => r.tipe === 'kelas');
  const prestasi = rec.filter((r) => r.tipe === 'prestasi');
  const pembiasaan = rec.filter((r) => r.tipe === 'pembiasaan');
  const tatib = rec.filter((r) => r.tipe === 'tatatertib');

  const totL = kelas.reduce((n, k) => n + (+k.laki || 0), 0);
  const totP = kelas.reduce((n, k) => n + (+k.perempuan || 0), 0);

  document.getElementById('konten').innerHTML = `
    <section class="block">
      <div class="section-title"><h2>Jumlah Siswa per Kelas</h2></div>
      <div class="table-wrap" data-reveal><table class="nice">
        <thead><tr><th>Kelas</th><th>Laki-laki</th><th>Perempuan</th><th>Jumlah</th><th>Wali Kelas</th></tr></thead>
        <tbody>
          ${kelas
            .map(
              (k) => `<tr>
                <td>${esc(k.nama)}</td>
                <td>${esc(k.laki)}</td>
                <td>${esc(k.perempuan)}</td>
                <td>${(+k.laki || 0) + (+k.perempuan || 0)}</td>
                <td>${esc(k.wali || '-')}</td>
              </tr>`
            )
            .join('')}
        </tbody>
        <tfoot><tr><td>Total</td><td>${totL}</td><td>${totP}</td><td>${totL + totP}</td><td></td></tr></tfoot>
      </table></div>
    </section>

    <section class="block">
      <div class="section-title"><h2>Prestasi Siswa</h2></div>
      <div class="grid grid-wide">
        ${prestasi
          .map(
            (p, i) => `
            <div class="card" data-reveal data-reveal-delay="${(i % 3) * 110}"><div class="card-body">
              <div style="font-size:1.8rem">🏆</div>
              <h3>${esc(p.nama)}</h3>
              <span class="meta">${esc(p.peraih || '')}</span>
              <span class="badge amber">${esc(p.tahun)}</span>
            </div></div>`
          )
          .join('')}
      </div>
    </section>

    <section class="block">
      <div class="section-title"><h2>Program Pembiasaan</h2></div>
      <div class="grid">
        ${pembiasaan
          .map(
            (p, i) => `
            <div class="card" data-reveal data-reveal-delay="${(i % 4) * 90}"><div class="card-body">
              <h3>${esc(p.nama)}</h3>
              <p class="meta">${esc(p.deskripsi)}</p>
            </div></div>`
          )
          .join('')}
      </div>
    </section>

    <section class="block">
      <div class="section-title"><h2>Tata Tertib Siswa</h2></div>
      <ol class="num-list" data-reveal>
        ${tatib.map((t) => `<li>${esc(t.isi)}</li>`).join('')}
      </ol>
    </section>`;

  Anim.scan();
});
