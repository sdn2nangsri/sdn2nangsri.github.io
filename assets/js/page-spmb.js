/* SPMB / Penerimaan Murid Baru: render data/spmb.txt */
document.addEventListener('DOMContentLoaded', async () => {
  const d = await fetch('data/spmb.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseKV(t));

  document.getElementById('spmb-sub').textContent =
    `Tahun Ajaran ${d.tahun_ajaran || '-'} — SD Negeri 2 Nangsri`;

  /* Kartu ringkasan (memakai gaya .stats beranda) */
  const status = (d.status || '').toLowerCase();
  const statusLabel =
    status === 'dibuka' ? 'Dibuka' : status === 'segera' ? 'Segera Dibuka' : 'Ditutup';
  const ringkas = [
    ['Status Pendaftaran', statusLabel],
    ['Periode', d.periode],
    ['Kuota', d.kuota],
    ['Pengumuman', d.pengumuman],
  ].filter(([, v]) => v && v !== '-');
  document.getElementById('spmb-ringkas').innerHTML = ringkas
    .map(
      ([label, val], i) =>
        `<div class="stat" data-reveal data-reveal-delay="${i * 100}"><strong>${esc(val)}</strong><span>${esc(label)}</span></div>`
    )
    .join('');

  const fillList = (id, value, cls) => {
    document.getElementById(id).innerHTML = parseList(value)
      .map((item) => `<li${cls ? ` class="${cls}"` : ''}>${esc(item)}</li>`)
      .join('');
  };
  fillList('spmb-syarat', d.syarat);
  fillList('spmb-dokumen', d.dokumen);
  fillList('spmb-alur', d.alur);

  /* Kontak panitia + tombol WhatsApp (memakai util waNumber dari main.js) */
  const wa = waNumber(d.kontak_wa);
  const nama = d.kontak_nama && d.kontak_nama !== '-' ? d.kontak_nama : '';
  if (nama || wa) {
    document.getElementById('spmb-kontak-blok').hidden = false;
    document.getElementById('spmb-kontak').innerHTML =
      (nama ? `${esc(nama)}<br>` : '') +
      (wa
        ? `<a class="btn" href="https://wa.me/${wa}?text=${encodeURIComponent('Halo, saya ingin bertanya tentang pendaftaran murid baru SD Negeri 2 Nangsri.')}" target="_blank" rel="noopener">Hubungi via WhatsApp</a>`
        : '');
  }

  const catatan = document.getElementById('spmb-catatan');
  catatan.textContent = d.catatan && d.catatan !== '-' ? d.catatan.replace(/\n+/g, ' ') : '';

  Anim.scan();
});
