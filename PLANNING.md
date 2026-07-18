# Planning: Website Statis Profil Sekolah — SD Negeri 2 Nangsri

Website profil sekolah statis (tanpa database, tanpa build step) yang di-deploy ke **GitHub Pages**. Seluruh konten dikelola lewat file `.txt` di folder `/data`, dimuat ke halaman via JavaScript `fetch()`.

---

## 1. Data Sekolah (Hasil Riset Online)

Data berikut ditemukan dari sumber publik (Zekolah / referensi Kemendikbud) dan dipakai sebagai data awal. Yang belum ditemukan diisi placeholder untuk dilengkapi manual.

| Field | Nilai |
|---|---|
| Nama | SD Negeri 2 Nangsri |
| NPSN | 20309360 |
| Status | Negeri (naungan Kemendikdasmen) |
| Alamat | Brajan, Desa Nangsri, Kec. Manisrenggo, Kab. Klaten, Jawa Tengah 57485 |
| Tahun berdiri | 1968 |
| Akreditasi | A — SK No. 044/BANSM-JTG/SK/X/2018 (16 Oktober 2018) |
| Email | sdnegeri2nangsri@yahoo.co.id |
| Koordinat | -7.708542, 110.515157 |
| Waktu belajar | Pagi, 6 hari sekolah |
| Kepala sekolah | _(placeholder — isi manual)_ |
| Jumlah guru / siswa / rombel | _(placeholder — isi manual)_ |
| Visi & Misi | _(placeholder — isi manual)_ |

---

## 2. Teknologi

- **HTML + CSS + Vanilla JavaScript** — tanpa framework, tanpa bundler, tanpa Node. Langsung jalan di GitHub Pages.
- **Data-driven dari `.txt`**: setiap halaman `fetch()` file `.txt`-nya, mem-parse, lalu me-render ke DOM. Update konten = edit file `.txt` di GitHub (bisa lewat web editor GitHub dari HP sekalipun), commit, selesai.
- **CSS**: satu file `style.css` custom (mobile-first, responsif). Palet warna khas sekolah (mis. hijau/merah-putih) + Google Fonts opsional (bisa di-self-host agar full offline-capable).
- **Tidak ada backend** — formulir kontak cukup link `mailto:` / WhatsApp.

### Kenapa bukan Jekyll?
GitHub Pages mendukung Jekyll, tapi tujuan utamanya "mudah di-manage tanpa database" — file `.txt` polos + JS loader lebih sederhana dipahami operator sekolah daripada front-matter Jekyll. (Tambahkan file kosong `.nojekyll` agar Pages tidak menjalankan Jekyll.)

---

## 3. Struktur Folder

```
/
├── index.html              # Beranda (hero, sambutan, highlight berita & agenda)
├── profil.html             # Profil Sekolah
├── guru.html               # Guru dan Karyawan
├── kesiswaan.html          # Kesiswaan
├── galeri.html             # Galeri
├── berita.html             # Berita dan Artikel (daftar)
├── artikel.html            # Halaman baca 1 artikel (?id=slug)
├── ekstrakurikuler.html    # Ekstrakurikuler
├── kalender.html           # Kalender Kegiatan
├── mading.html             # Mading Sekolah
├── .nojekyll
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── parser.js       # parser format .txt (key:value & record)
│   │   ├── main.js         # header/footer/nav bersama, data sekolah global
│   │   └── page-*.js       # render per halaman (page-guru.js, page-berita.js, dst.)
│   └── img/
│       ├── logo.png
│       ├── guru/           # foto guru
│       ├── galeri/         # foto galeri
│       ├── berita/         # thumbnail berita
│       └── mading/         # karya siswa
└── data/
    ├── sekolah.txt         # identitas sekolah (dipakai semua halaman: header, footer, meta)
    ├── profil.txt          # sejarah, visi, misi, tujuan, fasilitas, sambutan kepsek
    ├── guru.txt            # daftar guru & karyawan
    ├── kesiswaan.txt       # data siswa per kelas, prestasi, tata tertib
    ├── galeri.txt          # daftar foto + album + caption
    ├── berita.txt          # indeks berita (judul, tanggal, slug, ringkasan)
    ├── artikel/            # isi lengkap tiap berita: artikel/<slug>.txt
    ├── ekstrakurikuler.txt # daftar ekskul
    ├── kalender.txt        # agenda kegiatan per tanggal
    └── mading.txt          # karya siswa (puisi, gambar, cerpen)
```

---

## 4. Format File `.txt`

Dua format sederhana yang konsisten di semua file, di-handle satu parser (`parser.js`):

**a. Key–value** (untuk data tunggal seperti `sekolah.txt`, `profil.txt`). Nilai multi-baris didukung sampai key berikutnya:

```txt
nama: SD Negeri 2 Nangsri
npsn: 20309360
alamat: Brajan, Desa Nangsri, Kec. Manisrenggo, Kab. Klaten, Jawa Tengah 57485
visi: Terwujudnya peserta didik yang beriman, cerdas,
  terampil, dan berbudi pekerti luhur.
```

**b. Record list** (untuk data berulang seperti guru, berita, galeri). Record dipisah baris `---`, baris diawali `#` = komentar:

```txt
# data/guru.txt
nama: Budi Santoso, S.Pd.
jabatan: Kepala Sekolah
nip: 19700101 199003 1 001
foto: budi.jpg
---
nama: Siti Aminah, S.Pd.SD
jabatan: Guru Kelas 1
nip: -
foto: siti.jpg
```

Aturan parser: `key: value` per baris, baris lanjutan (indentasi) digabung ke value sebelumnya, `---` memisah record, `#` diabaikan. Sekitar 30 baris JS.

---

## 5. Halaman & Section

Semua halaman berbagi **header** (logo + nama sekolah + nav responsif hamburger) dan **footer** (alamat, email, NPSN, embed Google Maps dari koordinat) yang di-render `main.js` dari `data/sekolah.txt`.

| # | Halaman | Sumber data | Isi |
|---|---|---|---|
| 0 | Beranda | `sekolah.txt`, `berita.txt`, `kalender.txt` | Hero + sambutan singkat, 3 berita terbaru, agenda terdekat, statistik ringkas (akreditasi, tahun berdiri, jumlah siswa/guru) |
| 1 | Profil Sekolah | `profil.txt` | Sejarah, visi–misi–tujuan, sambutan kepala sekolah, akreditasi, fasilitas, peta lokasi |
| 2 | Guru dan Karyawan | `guru.txt` | Grid kartu: foto, nama, NIP, jabatan; kepala sekolah ditampilkan paling atas |
| 3 | Kesiswaan | `kesiswaan.txt` | Jumlah siswa per kelas (tabel), prestasi siswa, tata tertib, program pembiasaan |
| 4 | Galeri | `galeri.txt` | Grid foto dengan filter album + lightbox sederhana (vanilla JS) |
| 5 | Berita dan Artikel | `berita.txt` + `artikel/<slug>.txt` | Daftar kartu berita (terbaru dulu); klik → `artikel.html?id=slug` memuat isi lengkap |
| 6 | Ekstrakurikuler | `ekstrakurikuler.txt` | Kartu per ekskul: nama, pembina, jadwal, deskripsi, foto |
| 7 | Kalender Kegiatan | `kalender.txt` | Daftar agenda dikelompokkan per bulan (tanggal, kegiatan, keterangan); agenda lewat otomatis diredupkan |
| 8 | Mading Sekolah | `mading.txt` | Papan karya siswa: puisi/cerpen/gambar dengan nama & kelas pembuat, gaya "sticky note" |

---

## 6. Tahapan Implementasi

1. **Fondasi** — struktur folder, `parser.js` + unit sanity check, `style.css` (variabel warna, layout, komponen kartu/tabel/nav), header–footer bersama.
2. **Data awal** — tulis semua file `/data/*.txt` berisi data riset di atas + placeholder realistis untuk yang belum ada (guru, siswa, berita contoh, dst.), plus gambar placeholder.
3. **Halaman inti** — Beranda, Profil, Guru, Kesiswaan.
4. **Halaman konten** — Berita + artikel detail, Galeri + lightbox, Ekstrakurikuler.
5. **Halaman dinamis-tanggal** — Kalender Kegiatan, Mading.
6. **Polish** — meta SEO per halaman (title, description, Open Graph), favicon, responsif mobile, aksesibilitas dasar (alt text, kontras), `404.html`.
7. **Deploy** — push ke GitHub → Settings ▸ Pages ▸ deploy dari branch `main` (root). URL: `https://<username>.github.io/<nama-repo>/`. **Catatan penting:** karena project site berada di subpath, semua path asset/data harus **relatif** (`data/guru.txt`, bukan `/data/guru.txt`).
8. **Dokumentasi operator** — `README.md` berisi panduan singkat "cara update konten lewat GitHub web editor" untuk guru/operator sekolah.

---

## 7. Catatan Teknis

- `fetch()` file lokal tidak jalan via `file://` — untuk development pakai `python -m http.server` atau Live Server VS Code.
- Nama file foto tanpa spasi (gunakan `-`), kompres gambar (< 300 KB) agar situs cepat.
- Tanggal di `.txt` ditulis `YYYY-MM-DD` agar mudah di-sort; JS yang memformat ke "17 Agustus 2026".
- Semua konten berbahasa Indonesia.

**Sumber data:** [Zekolah — Profil SD Negeri 2 Nangsri](https://data-sekolah.zekolah.id/sekolah/sd-negeri-2-nangsri-78169), [Referensi Data Kemendikbud (NPSN 20309360)](https://referensi.data.kemdikbud.go.id/pendidikan/npsn/20309360)

---

# Planning: Animasi JavaScript

Menambahkan animasi pada seluruh situs agar terasa hidup dan modern, **tanpa library** (tetap vanilla JS + CSS), tanpa mengorbankan performa dan aksesibilitas.

## A. Prinsip

1. **JS hanya pemicu, CSS yang menganimasikan** — JavaScript menambah/menghapus class (mis. `.is-visible`); transisi/keyframes didefinisikan di CSS. Lebih hemat dan mudah di-maintain.
2. **Hanya animasikan `transform` dan `opacity`** — properti yang di-render di GPU, tidak memicu reflow, tetap 60fps di HP murah sekalipun.
3. **Hormati `prefers-reduced-motion`** — jika pengguna menonaktifkan animasi di OS-nya, semua elemen langsung tampil tanpa animasi (sudah dipraktikkan di hero slider).
4. **Progressive enhancement** — tanpa JS pun konten tetap terlihat; class awal `[data-reveal]` hanya disembunyikan jika JS aktif (ditandai `<html class="js">`), sehingga tidak ada konten "hilang" jika script gagal.

## B. Arsitektur

```
assets/js/animate.js   ← modul animasi bersama, dimuat SETELAH main.js di semua halaman
assets/css/style.css   ← tambahan blok "/* Animasi */" (keyframes + utility class)
```

API berbasis atribut data di HTML — halaman cukup memberi atribut, tanpa JS tambahan:

| Atribut | Efek |
|---|---|
| `data-reveal` | Elemen fade + naik saat masuk viewport (IntersectionObserver) |
| `data-reveal="left"` / `"right"` / `"zoom"` | Varian arah animasi |
| `data-reveal-delay="200"` | Delay ms — untuk efek berurutan (stagger) antar kartu |
| `data-counter="123"` | Angka berhitung naik 0 → target saat terlihat (requestAnimationFrame) |

Karena kartu/grid di-render dinamis oleh `page-*.js`, fungsi `Anim.scan(container)` dipanggil ulang setelah render agar elemen baru ikut terdaftar di observer.

## C. Daftar Animasi per Bagian

| # | Bagian | Animasi | Teknik |
|---|---|---|---|
| 1 | Hero (beranda) | Teks judul/tagline/tombol masuk berurutan saat load; efek **Ken Burns** (zoom lambat) pada slide aktif | CSS keyframes + class `.active` slider yang sudah ada |
| 2 | Statistik beranda | Angka berhitung 0 → nilai akhir saat kartu terlihat | `data-counter`, rAF, `IntersectionObserver` |
| 3 | Semua grid kartu (berita, guru, ekskul, galeri, prestasi) | Fade-up berurutan (stagger 80–120 ms antar kartu) | `data-reveal` + `data-reveal-delay` diberikan saat render |
| 4 | Header | Bayangan muncul + sedikit memadat setelah scroll > 10px | listener `scroll` (throttle rAF) toggle class `.scrolled` |
| 5 | Menu mobile | Slide-down halus saat dibuka/ditutup | transisi `max-height`/`transform` pada `.site-nav` |
| 6 | Galeri | Item fade-in ulang saat ganti filter album; lightbox fade + zoom-in | re-`scan()` setelah filter; keyframe `zoomIn` pada `.lightbox.open img` |
| 7 | Mading | Kartu "tertempel" berurutan (jatuh + rotasi kecil); goyang halus saat hover | `data-reveal="zoom"` + transisi transform hover |
| 8 | Kalender | Baris agenda slide-in dari kiri berurutan per bulan | `data-reveal="left"` |
| 9 | Artikel | Cover + paragraf fade-in lembut | `data-reveal` |
| 10 | Hover kartu (semua) | Terangkat 4px + bayangan menebal | CSS murni (`transition: transform, box-shadow`) |

## D. Sketsa Teknis

```js
// animate.js (inti ± 60 baris)
const Anim = (() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);            // sekali tampil, selesai — hemat resource
    }
  }, { threshold: 0.15 });

  function scan(root = document) {
    root.querySelectorAll('[data-reveal]:not(.is-visible)').forEach(el => {
      if (reduce) { el.classList.add('is-visible'); return; }
      el.style.transitionDelay = (el.dataset.revealDelay || 0) + 'ms';
      io.observe(el);
    });
    root.querySelectorAll('[data-counter]').forEach(/* rAF count-up */);
  }
  return { scan, reduce };
})();
```

```css
/* style.css — blok Animasi */
.js [data-reveal] { opacity: 0; transform: translateY(24px); transition: opacity .6s, transform .6s; }
.js [data-reveal="left"]  { transform: translateX(-32px); }
.js [data-reveal="zoom"]  { transform: scale(.92); }
.js [data-reveal].is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .js [data-reveal] { opacity: 1; transform: none; transition: none; } }
```

## E. Tahapan Implementasi

1. **Fondasi** — buat `animate.js` (observer + scan + counter), tandai `<html class="js">`, tambah blok CSS animasi, muat script di 10 halaman.
2. **Beranda** — entrance hero, Ken Burns slide, counter statistik, stagger berita/agenda/ekskul.
3. **Halaman daftar** — guru, galeri (termasuk re-scan saat filter), berita, ekskul, kesiswaan.
4. **Halaman lain** — kalender (slide-in), mading (zoom + hover goyang), artikel, profil.
5. **Mikro-interaksi CSS** — hover kartu, tombol, header `.scrolled`, transisi menu mobile.
6. **Verifikasi** — cek semua halaman di server lokal; uji `prefers-reduced-motion`; pastikan tidak ada layout shift (animasi hanya transform/opacity); konten tetap tampil saat JS dimatikan.

**Perkiraan bobot:** ± 60 baris JS baru + ± 70 baris CSS + perubahan kecil di tiap `page-*.js` (menambah atribut `data-reveal` saat render + panggil `Anim.scan()`).
