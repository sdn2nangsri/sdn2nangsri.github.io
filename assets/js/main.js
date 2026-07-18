/* Layout bersama (header, nav, footer) + util yang dipakai semua halaman. */

const Site = {
  _promise: null,
  load() {
    if (!this._promise) {
      this._promise = fetch('data/sekolah.txt')
        .then((r) => r.text())
        .then((t) => Parser.parseKV(t));
    }
    return this._promise;
  },
};

const NAV = [
  ['index.html', 'Beranda'],
  ['profil.html', 'Profil'],
  ['guru.html', 'Guru & Karyawan'],
  ['kesiswaan.html', 'Kesiswaan'],
  ['galeri.html', 'Galeri'],
  ['berita.html', 'Berita'],
  ['ekstrakurikuler.html', 'Ekstrakurikuler'],
  ['kalender.html', 'Kalender'],
  ['mading.html', 'Mading'],
];

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* "2026-08-17" -> "17 Agustus 2026" */
function fmtDate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso || '';
  return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* Nilai multi-baris yang tiap barisnya diawali "- " -> array item. */
function parseList(value) {
  return String(value || '')
    .split('\n')
    .map((l) => l.replace(/^-\s*/, '').trim())
    .filter(Boolean);
}

function currentPage() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return file === 'artikel.html' ? 'berita.html' : file;
}

async function initLayout() {
  const s = await Site.load();
  const active = currentPage();

  const headerEl = document.getElementById('site-header');
  if (headerEl) {
    headerEl.innerHTML = `
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html">
            <img src="assets/img/logo.svg" alt="Logo ${esc(s.nama)}" width="44" height="44">
            <span class="brand-text">
              <strong>${esc(s.nama)}</strong>
              <small>${esc(s.kecamatan || '')}${s.kabupaten ? ', ' + esc(s.kabupaten) : ''}</small>
            </span>
          </a>
          <button class="nav-toggle" aria-label="Buka menu" aria-expanded="false">☰</button>
          <nav class="site-nav" aria-label="Navigasi utama">
            <ul>
              ${NAV.map(
                ([href, label]) =>
                  `<li><a href="${href}"${href === active ? ' class="active" aria-current="page"' : ''}>${label}</a></li>`
              ).join('')}
            </ul>
          </nav>
        </div>
      </header>`;

    const toggle = headerEl.querySelector('.nav-toggle');
    const nav = headerEl.querySelector('.site-nav');
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const footerEl = document.getElementById('site-footer');
  if (footerEl) {
    const maps = `https://www.google.com/maps?q=${encodeURIComponent(s.lintang + ',' + s.bujur)}&z=16&output=embed`;
    footerEl.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <h3>${esc(s.nama)}</h3>
            <p>${esc(s.alamat)}</p>
            <p>
              NPSN: ${esc(s.npsn)}<br>
              Akreditasi: ${esc(s.akreditasi)}<br>
              Email: <a href="mailto:${esc(s.email)}">${esc(s.email)}</a>
            </p>
          </div>
          <div>
            <h3>Tautan Cepat</h3>
            <ul class="footer-links">
              ${NAV.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h3>Lokasi</h3>
            <iframe class="footer-map" src="${maps}" title="Peta lokasi ${esc(s.nama)}"
              loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="container">© ${new Date().getFullYear()} ${esc(s.nama)} — ${esc(s.tagline || '')}</div>
        </div>
      </footer>`;
  }
}

document.addEventListener('DOMContentLoaded', initLayout);
