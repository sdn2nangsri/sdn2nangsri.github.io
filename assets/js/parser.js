/*
 * Parser format data .txt situs SD Negeri 2 Nangsri.
 *
 * Format a — key–value (satu objek per file):
 *   kunci: nilai
 *     lanjutan nilai (baris berindentasi digabung ke kunci sebelumnya)
 *
 * Format b — daftar record: record dipisah baris berisi "---".
 * Baris diawali "#" adalah komentar dan diabaikan.
 */
const Parser = (() => {
  function parseKV(text) {
    const obj = {};
    let lastKey = null;
    let blankPending = false; // baris kosong di tengah nilai = pemisah bait/paragraf
    for (const raw of String(text).split(/\r?\n/)) {
      if (/^\s*#/.test(raw)) continue;
      if (!raw.trim()) {
        blankPending = true;
        continue;
      }
      const m = raw.match(/^([A-Za-z0-9_]+)\s*:\s?(.*)$/);
      if (m) {
        obj[m[1]] = m[2].trim();
        lastKey = m[1];
      } else if (lastKey && /^\s+\S/.test(raw)) {
        obj[lastKey] += (blankPending ? '\n\n' : '\n') + raw.trim();
      } else {
        lastKey = null;
      }
      blankPending = false;
    }
    return obj;
  }

  function parseRecords(text) {
    return String(text)
      .split(/^\s*---\s*$/m)
      .map(parseKV)
      .filter((r) => Object.keys(r).length > 0);
  }

  /* Artikel: blok key–value, lalu "---", lalu isi bebas (paragraf dipisah baris kosong). */
  function parseArticle(text) {
    const t = String(text);
    const m = t.match(/^\s*---\s*$/m);
    if (!m) return { meta: parseKV(t), body: '' };
    return {
      meta: parseKV(t.slice(0, m.index)),
      body: t.slice(m.index + m[0].length).trim(),
    };
  }

  return { parseKV, parseRecords, parseArticle };
})();

/* Ekspor untuk pengujian di Node (tidak berpengaruh di browser). */
if (typeof module !== 'undefined' && module.exports) module.exports = Parser;
