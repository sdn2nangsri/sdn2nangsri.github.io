document.addEventListener('DOMContentLoaded', async () => {
  const ikm = await fetch('data/ikm.txt')
    .then((r) => r.text())
    .then((t) => Parser.parseRecords(t));

  document.getElementById('daftar-ikm').innerHTML = ikm
    .map((d, i) => {
      const kelasList = String(d.rincian_kelas || '')
        .split('\n')
        .filter(Boolean)
        .map((x) => `<li>${esc(x.trim())}</li>`)
        .join('');
      return `
      <div class="card" data-reveal data-reveal-delay="${(i % 3) * 110}"><div class="card-body">
        ${d.foto ? `<img src="assets/img/ikm/${esc(d.foto)}" alt="Sertifikat IKM ${esc(d.periode)}" style="width:100%;border-radius:8px;border:1px solid var(--border, #ddd)">` : ''}
        <span class="badge">Periode ${esc(d.periode)}</span>
        <div style="font-size:2.6rem;font-weight:800;color:var(--green-700)">${esc(d.nilai)}</div>
        <p class="meta">Jumlah responden: ${esc(d.jumlah_responden)} orang</p>
        <ul class="meta" style="padding-left:1.1rem;margin:0">${kelasList}</ul>
      </div></div>`;
    })
    .join('');

  Anim.scan();
});