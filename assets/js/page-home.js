/* Beranda: hero slider, badge, statistik, 3 berita terbaru, agenda, ekskul. */

/* Slider hero: gambar dari data/hero.txt, ganti otomatis tiap 5 detik. */
function initHeroSlider(slides) {
  const wrap = document.getElementById('hero-slides');
  const dots = document.getElementById('hero-dots');
  const prev = document.getElementById('hero-prev');
  const next = document.getElementById('hero-next');
  if (!wrap || !slides.length) return;

  wrap.innerHTML = slides
    .map(
      (sl) =>
        `<div class="hero-slide" style="background-image:url('assets/img/hero/${esc(sl.foto)}')" role="img" aria-label="${esc(sl.keterangan || '')}"></div>`
    )
    .join('');
  const els = [...wrap.querySelectorAll('.hero-slide')];

  let current = 0;
  let timer = null;

  function show(i) {
    current = (i + slides.length) % slides.length;
    els.forEach((el, j) => el.classList.toggle('active', j === current));
    dots?.querySelectorAll('button').forEach((b, j) => b.classList.toggle('active', j === current));
  }

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function play() {
    if (reduceMotion || slides.length < 2) return;
    stop();
    timer = setInterval(() => show(current + 1), 5000);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  if (slides.length > 1) {
    dots.innerHTML = slides
      .map((sl, i) => `<button aria-label="Gambar ${i + 1}: ${esc(sl.keterangan || '')}"></button>`)
      .join('');
    dots.querySelectorAll('button').forEach((b, i) =>
      b.addEventListener('click', () => {
        show(i);
        play(); // reset hitungan setelah interaksi
      })
    );
    prev.hidden = next.hidden = false;
    prev.addEventListener('click', () => (show(current - 1), play()));
    next.addEventListener('click', () => (show(current + 1), play()));

    const hero = wrap.closest('.hero');
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', play);
  }

  show(0);
  play();
}

document.addEventListener('DOMContentLoaded', async () => {
  const [s, guruTxt, kesiswaanTxt, beritaTxt, kalenderTxt, ekskulTxt, heroTxt] = await Promise.all([
    Site.load(),
    fetch('data/guru.txt').then((r) => r.text()),
    fetch('data/kesiswaan.txt').then((r) => r.text()),
    fetch('data/berita.txt').then((r) => r.text()),
    fetch('data/kalender.txt').then((r) => r.text()),
    fetch('data/ekstrakurikuler.txt').then((r) => r.text()),
    fetch('data/hero.txt').then((r) => (r.ok ? r.text() : '')),
  ]);

  initHeroSlider(Parser.parseRecords(heroTxt));

  document.getElementById('hero-tagline').textContent = s.tagline;
  document.getElementById('hero-badges').innerHTML = `
    <span class="badge">Akreditasi ${esc(s.akreditasi)}</span>
    <span class="badge">NPSN ${esc(s.npsn)}</span>
    <span class="badge">Berdiri ${esc(s.tahun_berdiri)}</span>`;

  const guru = Parser.parseRecords(guruTxt);
  const kelas = Parser.parseRecords(kesiswaanTxt).filter((r) => r.tipe === 'kelas');
  const totalSiswa = kelas.reduce((n, k) => n + (+k.laki || 0) + (+k.perempuan || 0), 0);
  document.getElementById('stats').innerHTML = `
    <div class="stat" data-reveal><strong>${esc(s.akreditasi)}</strong><span>Akreditasi</span></div>
    <div class="stat" data-reveal data-reveal-delay="100"><strong data-counter="${totalSiswa}">0</strong><span>Siswa</span></div>
    <div class="stat" data-reveal data-reveal-delay="200"><strong data-counter="${guru.length}">0</strong><span>Guru & Karyawan</span></div>
    <div class="stat" data-reveal data-reveal-delay="300"><strong data-counter="${kelas.length}">0</strong><span>Rombongan Belajar</span></div>`;

  const berita = Parser.parseRecords(beritaTxt)
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 3);
  document.getElementById('berita-terbaru').innerHTML = berita
    .map(
      (b, i) => `
      <article class="card" data-reveal data-reveal-delay="${i * 120}">
        <a href="artikel.html?id=${encodeURIComponent(b.slug)}">
          <img class="thumb" src="assets/img/berita/${esc(b.foto)}" alt="${esc(b.judul)}" loading="lazy">
        </a>
        <div class="card-body">
          <span class="meta">${fmtDate(b.tanggal)}</span>
          <h3><a href="artikel.html?id=${encodeURIComponent(b.slug)}">${esc(b.judul)}</a></h3>
          <p class="meta">${esc(b.ringkasan)}</p>
        </div>
      </article>`
    )
    .join('');

  const today = new Date().toISOString().slice(0, 10);
  const agenda = Parser.parseRecords(kalenderTxt)
    .filter((a) => (a.sampai || a.tanggal) >= today)
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    .slice(0, 4);
  document.getElementById('agenda-terdekat').innerHTML =
    agenda
      .map((a, i) => {
        const d = new Date(a.tanggal + 'T00:00:00');
        const bln = d.toLocaleDateString('id-ID', { month: 'short' });
        return `
        <li data-reveal="left" data-reveal-delay="${i * 100}">
          <div class="tgl"><strong>${d.getDate()}</strong><span>${esc(bln)}</span></div>
          <div class="isi">
            <strong>${esc(a.kegiatan)}</strong>
            <span>${a.sampai ? fmtDate(a.tanggal) + ' – ' + fmtDate(a.sampai) : fmtDate(a.tanggal)}${a.keterangan ? ' · ' + esc(a.keterangan) : ''}</span>
          </div>
        </li>`;
      })
      .join('') || '<li class="loading">Belum ada agenda mendatang.</li>';

  const ekskul = Parser.parseRecords(ekskulTxt).slice(0, 5);
  document.getElementById('ekskul-ringkas').innerHTML = ekskul
    .map(
      (e, i) => `
      <div class="card" data-reveal data-reveal-delay="${i * 90}"><div class="card-body center">
        <div style="font-size:2.2rem">${e.ikon || '⭐'}</div>
        <h3>${esc(e.nama)}</h3>
        <span class="meta">${esc(e.jadwal)}</span>
      </div></div>`
    )
    .join('');

  Anim.scan();
});
