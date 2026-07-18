/* Guru & karyawan: grid kartu; kepala sekolah selalu tampil pertama. */
document.addEventListener('DOMContentLoaded', async () => {
  const guru = await fetch('data/guru.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));

  guru.sort((a, b) => {
    const ks = (g) => (/kepala sekolah/i.test(g.jabatan) ? 0 : 1);
    return ks(a) - ks(b);
  });

  const initials = (nama) =>
    nama
      .replace(/\[|\]/g, '')
      .split(/[\s,]+/)
      .filter((w) => /^[A-Za-z]/.test(w))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('') || '?';

  document.getElementById('daftar-guru').innerHTML = guru
    .map((g, i) => {
      const isKepsek = /kepala sekolah/i.test(g.jabatan);
      const avatar =
        g.foto && g.foto !== '-'
          ? `<img class="avatar" src="assets/img/guru/${esc(g.foto)}" alt="Foto ${esc(g.nama)}" loading="lazy">`
          : `<div class="avatar" aria-hidden="true">${esc(initials(g.nama))}</div>`;
      return `
      <div class="card person${isKepsek ? ' kepsek' : ''}" data-reveal data-reveal-delay="${(i % 4) * 90}">
        ${avatar}
        <div class="card-body">
          <h3>${esc(g.nama)}</h3>
          <span class="badge${isKepsek ? ' amber' : ''}">${esc(g.jabatan)}</span>
          <span class="meta">${g.nip && g.nip !== '-' ? 'NIP. ' + esc(g.nip) : '&nbsp;'}</span>
        </div>
      </div>`;
    })
    .join('');

  Anim.scan();
});
