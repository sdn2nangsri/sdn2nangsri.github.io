/*
 * Validator format file data/*.txt — dijalankan otomatis oleh GitHub Actions
 * pada setiap commit, atau manual dengan:  node scripts/validate-data.js
 *
 * Memakai parser yang sama dengan situs (assets/js/parser.js) sehingga
 * apa yang lolos di sini pasti terbaca oleh halaman.
 */
const fs = require('fs');
const path = require('path');
const Parser = require('../assets/js/parser.js');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);

const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v);

/* Baris yang bukan komentar/kosong/lanjutan/pemisah harus berbentuk "kunci: nilai". */
function checkSyntax(file) {
  read(file)
    .split(/\r?\n/)
    .forEach((line, i) => {
      if (!line.trim() || /^\s*#/.test(line)) return; // kosong / komentar
      if (/^\s*---\s*$/.test(line)) return; // pemisah record
      if (/^\s+\S/.test(line)) return; // baris lanjutan nilai
      if (!/^[A-Za-z0-9_]+\s*:/.test(line)) {
        err(file, `baris ${i + 1} bukan format "kunci: nilai" — «${line.trim().slice(0, 60)}»`);
      }
    });
}

/* File record: tiap blok wajib punya kunci tertentu; kunci tanggal harus YYYY-MM-DD. */
function checkRecords(file, requiredKeys, dateKeys = []) {
  checkSyntax(file);
  const records = Parser.parseRecords(read(file));
  if (!records.length) err(file, 'tidak ada satu pun record terbaca');
  records.forEach((r, i) => {
    for (const k of requiredKeys) {
      if (!r[k]) err(file, `record #${i + 1} tidak punya kunci wajib "${k}"`);
    }
    for (const k of dateKeys) {
      if (r[k] && r[k] !== '-' && !isDate(r[k])) {
        err(file, `record #${i + 1} kunci "${k}" harus TAHUN-BULAN-TANGGAL, ditemukan "${r[k]}"`);
      }
    }
  });
  return records;
}

/* File key–value: kunci tertentu wajib terisi. */
function checkKV(file, requiredKeys) {
  checkSyntax(file);
  const obj = Parser.parseKV(read(file));
  for (const k of requiredKeys) {
    if (!obj[k]) err(file, `kunci wajib "${k}" kosong atau tidak ada`);
  }
  return obj;
}

checkKV('data/sekolah.txt', ['nama', 'npsn', 'alamat', 'email']);
checkKV('data/profil.txt', ['visi', 'misi', 'sejarah']);
checkKV('data/spmb.txt', ['tahun_ajaran', 'status', 'syarat', 'alur']);

checkRecords('data/guru.txt', ['nama', 'jabatan']);
checkRecords('data/hero.txt', ['foto', 'keterangan']);
checkRecords('data/galeri.txt', ['foto', 'judul', 'album'], ['tanggal']);
checkRecords('data/ekstrakurikuler.txt', ['nama', 'jadwal']);
checkRecords('data/kalender.txt', ['tanggal', 'kegiatan'], ['tanggal', 'sampai']);
checkRecords('data/mading.txt', ['judul', 'nama', 'kelas'], ['tanggal']);
checkRecords('data/kesiswaan.txt', ['tipe']);

/* Berita: slug wajib valid + file artikelnya harus ada. */
const berita = checkRecords('data/berita.txt', ['slug', 'judul', 'tanggal', 'ringkasan'], ['tanggal']);
for (const b of berita) {
  if (b.slug && !/^[a-z0-9-]+$/.test(b.slug)) {
    err('data/berita.txt', `slug "${b.slug}" hanya boleh huruf kecil, angka, dan tanda "-"`);
  }
  if (b.slug && !fs.existsSync(path.join(DATA, 'artikel', b.slug + '.txt'))) {
    err('data/berita.txt', `file artikel "data/artikel/${b.slug}.txt" tidak ditemukan`);
  }
}

/* Tiap file artikel harus punya meta judul + tanggal + isi. */
for (const f of fs.readdirSync(path.join(DATA, 'artikel'))) {
  if (!f.endsWith('.txt')) continue;
  const rel = 'data/artikel/' + f;
  const { meta, body } = Parser.parseArticle(read(rel));
  if (!meta.judul) err(rel, 'tidak ada kunci "judul"');
  if (!meta.tanggal) err(rel, 'tidak ada kunci "tanggal"');
  else if (!isDate(meta.tanggal)) err(rel, `tanggal harus TAHUN-BULAN-TANGGAL, ditemukan "${meta.tanggal}"`);
  if (!body) err(rel, 'isi artikel kosong (jangan lupa baris "---" lalu isi di bawahnya)');
}

if (errors.length) {
  console.error(`✗ Ditemukan ${errors.length} masalah format:\n`);
  for (const e of errors) console.error('  - ' + e);
  console.error('\nLihat aturan format di README.md bagian "Aturan format .txt".');
  process.exit(1);
}
console.log('✓ Semua file data/*.txt valid.');
