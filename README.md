# Website SD Negeri 2 Nangsri

Website statis profil sekolah untuk **SD Negeri 2 Nangsri** (Manisrenggo, Klaten) — tanpa database, tanpa framework. Seluruh konten dikelola lewat file `.txt` di folder [`data/`](data/).

## Cara update konten (untuk operator sekolah)

Semua konten ada di folder `data/`. Cara paling mudah — langsung dari browser:

1. Buka repositori ini di GitHub, masuk ke folder `data/`.
2. Klik file yang ingin diubah (mis. `berita.txt`), lalu klik ikon ✏️ (Edit).
3. Ubah isinya, lalu klik **Commit changes**.
4. Tunggu ± 1 menit, website otomatis ter-update.

| Ingin mengubah… | Edit file |
|---|---|
| Identitas sekolah (alamat, email, NPSN) | `data/sekolah.txt` |
| Gambar slider di beranda (hero) | `data/hero.txt` + upload foto ke `assets/img/hero/` |
| Visi, misi, sejarah, fasilitas, sambutan | `data/profil.txt` |
| Daftar guru & karyawan | `data/guru.txt` |
| Data siswa, prestasi, tata tertib | `data/kesiswaan.txt` |
| Foto galeri | `data/galeri.txt` + upload foto ke `assets/img/galeri/` |
| Daftar berita | `data/berita.txt` |
| Isi lengkap berita | buat file baru di `data/artikel/<slug>.txt` |
| Ekstrakurikuler | `data/ekstrakurikuler.txt` |
| Agenda kegiatan | `data/kalender.txt` |
| Karya siswa di mading | `data/mading.txt` |

### Aturan format `.txt`

- Satu baris data ditulis `kunci: nilai`.
- Nilai panjang boleh turun baris, asalkan baris lanjutannya **diberi spasi di awal**.
- Untuk file berisi daftar (guru, berita, dll.), tiap entri dipisah baris berisi `---`.
- Baris yang diawali `#` adalah komentar (tidak ditampilkan).
- Tanggal selalu ditulis `TAHUN-BULAN-TANGGAL`, contoh: `2026-08-17`.

### Menambah berita baru

1. Edit `data/berita.txt`, tambahkan blok baru di bagian atas (pisahkan dengan `---`), tentukan `slug` (huruf kecil, tanpa spasi, pakai `-`).
2. Buat file `data/artikel/<slug>.txt` — bagian atas berisi `judul:`, `tanggal:`, `penulis:`, `foto:`, lalu baris `---`, lalu isi berita (paragraf dipisah baris kosong).
3. (Opsional) Upload gambar ke `assets/img/berita/` dan isi nama filenya di kolom `foto:`.

### Menambah foto guru / galeri

- Foto guru: upload ke `assets/img/guru/`, lalu isi `foto: namafile.jpg` di `data/guru.txt`. Jika belum ada foto, isi `foto: -` (akan tampil avatar inisial).
- Kompres foto dulu (usahakan < 300 KB), nama file tanpa spasi.

> ⚠️ Data guru, siswa, dan nama-nama di file data saat ini masih **contoh/placeholder** (ditandai `[Nama ...]`). Ganti dengan data sebenarnya sebelum dipublikasikan.

## Menjalankan secara lokal

Halaman memuat data via `fetch()`, jadi tidak bisa dibuka langsung dari file explorer (`file://`). Jalankan server lokal:

```bash
python -m http.server 8000
# lalu buka http://localhost:8000
```

Atau gunakan ekstensi **Live Server** di VS Code.

## Deploy ke GitHub Pages

1. Push repositori ini ke GitHub.
2. Buka **Settings ▸ Pages**.
3. Pada *Build and deployment*, pilih **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Simpan — situs tersedia di `https://<username>.github.io/<nama-repo>/`.

Semua path di kode sudah **relatif**, jadi aman dipasang di subpath project site maupun custom domain.

## Struktur proyek

```
index.html, profil.html, guru.html, ...   → halaman situs
assets/css/style.css                      → seluruh styling
assets/js/parser.js                       → parser format .txt
assets/js/main.js                         → header, nav, footer bersama
assets/js/page-*.js                       → logika render per halaman
assets/img/                               → logo & gambar (galeri, berita, mading, guru)
data/                                     → SEMUA KONTEN situs (.txt)
```
