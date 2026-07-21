/* Profil: sambutan, sejarah, visi-misi-tujuan, identitas, fasilitas. */
document.addEventListener('DOMContentLoaded', async () => {
  const [s, p] = await Promise.all([
    Site.load(),
    fetch('data/profil.txt').then((r) => r.text()).then((t) => Parser.parseKV(t)),
  ]);

  const paras = (v) =>
    String(v || '')
      .split('\n')
      .filter(Boolean)
      .map((x) => `<p>${esc(x)}</p>`)
      .join('');
  const checks = (v) => `<ul class="check-list">${parseList(v).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;

  document.getElementById('konten').innerHTML = `
    <section class="block" data-reveal>
      <div class="card"><div class="card-body" style="display:flex;flex-direction:row;gap:1.5rem;flex-wrap:wrap;align-items:stretch;justify-content:center">
  <div style="max-width:520px">
    ${paras(p.sambutan)}
    <p><strong>${esc(p.sambutan_nama)}</strong><br><span class="muted">Kepala SD Negeri 2 Nangsri</span></p>
  </div>
  ${p.sambutan_foto ? `<img src="assets/img/${esc(p.sambutan_foto)}" alt="${esc(p.sambutan_nama)}" style="width:280px;object-fit:cover;border-radius:14px;flex-shrink:0">` : ''}
</div></div>
    </section>

    <section class="block" data-reveal>
      <div class="section-title"><h2>Sejarah Singkat</h2></div>
      ${paras(p.sejarah)}
    </section>

    <section class="block" data-reveal>
      <div class="section-title"><h2>Visi</h2></div>
      <div class="card"><div class="card-body"><p><em>"${esc(String(p.visi).replace(/\n/g, ' '))}"</em></p></div></div>
    </section>

    <section class="block" data-reveal>
      <div class="section-title"><h2>Misi</h2></div>
      ${checks(p.misi)}
    </section>

    <section class="block" data-reveal>
      <div class="section-title"><h2>Tujuan Sekolah</h2></div>
      ${checks(p.tujuan)}
    </section>

    <section class="block" data-reveal>
      <div class="section-title"><h2>Identitas Sekolah</h2></div>
      <div class="table-wrap"><table class="nice">
        <tr><th>Nama Sekolah</th><td>${esc(s.nama)}</td></tr>
        <tr><th>NPSN</th><td>${esc(s.npsn)}</td></tr>
        <tr><th>Status</th><td>${esc(s.status)}</td></tr>
        <tr><th>Alamat</th><td>${esc(s.alamat)}</td></tr>
        <tr><th>Tahun Berdiri</th><td>${esc(s.tahun_berdiri)}</td></tr>
        <tr><th>Akreditasi</th><td>${esc(s.akreditasi)} — ${esc(s.akreditasi_sk)}</td></tr>
        <tr><th>Kurikulum</th><td>${esc(p.kurikulum)}</td></tr>
        <tr><th>Waktu Belajar</th><td>${esc(s.waktu_belajar)}</td></tr>
        <tr><th>Email</th><td><a href="mailto:${esc(s.email)}">${esc(s.email)}</a></td></tr>
      </table></div>
    </section>

    <section class="block" data-reveal>
      <div class="section-title"><h2>Fasilitas</h2></div>
      ${checks(p.fasilitas)}
    </section>`;

  Anim.scan();
});
