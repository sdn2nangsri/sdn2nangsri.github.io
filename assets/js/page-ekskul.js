/* Ekstrakurikuler: kartu per kegiatan. */
document.addEventListener('DOMContentLoaded', async () => {
  const ekskul = await fetch('data/ekstrakurikuler.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));

  document.getElementById('daftar-ekskul').innerHTML = ekskul
    .map(
      (e, i) => `
      <div class="card" data-reveal data-reveal-delay="${(i % 3) * 110}"><div class="card-body">
        <div style="font-size:2.4rem">${e.ikon || '⭐'}</div>
        <h3>${esc(e.nama)}</h3>
        <span class="badge">${esc(e.jadwal)}</span>
        <p class="meta">${esc(String(e.deskripsi || '').replace(/\n/g, ' '))}</p>
        <span class="meta"><strong>Pembina:</strong> ${esc(e.pembina)}</span>
      </div></div>`
    )
    .join('');

  Anim.scan();
});
