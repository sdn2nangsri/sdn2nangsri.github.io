/* Kalender: agenda dikelompokkan per bulan; agenda yang sudah lewat diredupkan. */
document.addEventListener('DOMContentLoaded', async () => {
  const agenda = await fetch('data/kalender.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));
  agenda.sort((a, b) => (a.tanggal || '').localeCompare(b.tanggal || ''));

  const today = new Date().toISOString().slice(0, 10);
  const groups = new Map();
  for (const a of agenda) {
    const key = (a.tanggal || '').slice(0, 7); // YYYY-MM
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(a);
  }

  const namaBulan = (ym) =>
    new Date(ym + '-01T00:00:00').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  document.getElementById('kalender').innerHTML =
    [...groups.entries()]
      .map(
        ([ym, items]) => `
        <div class="month-group">
          <h2>${esc(namaBulan(ym))}</h2>
          <ul class="agenda">
            ${items
              .map((a, i) => {
                const d = new Date(a.tanggal + 'T00:00:00');
                const past = (a.sampai || a.tanggal) < today;
                const rentang = a.sampai
                  ? `${fmtDate(a.tanggal)} – ${fmtDate(a.sampai)}`
                  : fmtDate(a.tanggal);
                return `
                <li class="${past ? 'past' : ''}" data-reveal="left" data-reveal-delay="${(i % 6) * 80}">
                  <div class="tgl">
                    <strong>${d.getDate()}</strong>
                    <span>${esc(d.toLocaleDateString('id-ID', { month: 'short' }))}</span>
                  </div>
                  <div class="isi">
                    <strong>${esc(a.kegiatan)}</strong>
                    <span>${rentang}${a.keterangan ? ' · ' + esc(a.keterangan) : ''}</span>
                  </div>
                </li>`;
              })
              .join('')}
          </ul>
        </div>`
      )
      .join('') || '<p class="loading">Belum ada agenda.</p>';

  Anim.scan();
});
