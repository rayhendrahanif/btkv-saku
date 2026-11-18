/* BTKV Saku: aplikasi belajar offline bergaya referensi klinis */
'use strict';
const GROUPS = [
  ['dasar', 'Ilmu Dasar BTKV', 'Anatomi, fisiologi, hemostasis, CPB, proteksi miokard'],
  ['dewasa', 'Bedah Jantung Dewasa', 'Koroner, katup, aorta, komplikasi infark'],
  ['perio', 'Perioperatif dan ICU', 'Hemodinamik, perdarahan, aritmia, komplikasi organ'],
  ['kong', 'Jantung Pediatrik dan Kongenital', 'Pirau, lesi sianotik, ventrikel tunggal'],
  ['toraks', 'Bedah Toraks', 'Pleura, trauma, kanker paru, mediastinum'],
  ['vask', 'Bedah Vaskular', 'Arteri perifer, aneurisma, vena, akses dialisis']
];
const PGROUPS = [['dws', 'Dasar Bedah Jantung dan Jantung Dewasa'], ['kgn', 'Jantung Pediatrik dan Kongenital'], ['trk', 'Bedah Toraks'], ['vsk', 'Bedah Vaskular']];
const LEVEL = ['', 'Level 1: mengetahui dan melihat', 'Level 2: dengan bantuan langsung DPJP', 'Level 3: seluruh tindakan dengan bantuan terbatas', 'Level 4: mandiri dan mampu mengatasi komplikasi'];
const REFS = {
  KBB: 'Kirklin/Barratt-Boyes Cardiac Surgery, ed. 4', CSA: 'Cohn, Cardiac Surgery in the Adult, ed. 5', JH: 'Johns Hopkins Textbook of Cardiothoracic Surgery',
  BOJ: 'Bojar, Manual of Perioperative Care in Adult Cardiac Surgery', WIL: "Wilcox's Surgical Anatomy of the Heart", GAN: "Ganong's Review of Medical Physiology, ed. 25",
  RRP: 'Rapid Review Physiology, ed. 2', KQ: 'Key Questions in Cardiac Surgery', SAB: 'Sabiston Textbook of Surgery, ed. 21', SCH: "Schwartz's Principles of Surgery, ed. 11",
  ATL: 'Sellke & Ruel, Atlas of Cardiac Surgical Techniques, ed. 2', SAKTI: 'Buku Sakti Tes CPPDS Bedah Toraks dan Kardiovaskular, ed. 1 (2024)', KUR: 'Buku Kurikulum PPDS-1 BTKV FKUI 2022'
};
const SRC_ORDER = ['ATL', 'KBB', 'CSA', 'JH', 'WIL', 'SAB', 'SCH', 'KQ', 'BOJ', 'RRP', 'GAN', 'SAKTI'];
const TOPICS = window.TOPICS, PROCS = window.PROCS, byId = Object.fromEntries(TOPICS.map(t => [t.id, t])), pById = Object.fromEntries(PROCS.map(p => [p.id, p]));
const ABBR = Object.fromEntries(window.ABBR_LIST.map(a => [a[0], a])), ASRC = window.ABBR_SRC || {};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const strip = h => h.replace(/<[^>]+>/g, ' ');
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/* ---------- penyimpanan lokal ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('btkv.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('btkv.' + k, JSON.stringify(v)); } catch (e) { /* mode privat */ } }
};
let read = store.get('read', {}), marks = store.get('marks', {}), known = store.get('known', {}), best = store.get('best', {}), prefs = Object.assign({theme: 'auto', fs: 0, view: 'modul', pview: 'grup', gview: 'sumber'}, store.get('prefs', {}));
const savePrefs = () => store.set('prefs', prefs);
const applyPrefs = () => { document.documentElement.dataset.theme = prefs.theme; document.documentElement.style.setProperty('--fs', (16 + prefs.fs * 1.5) + 'px'); };
applyPrefs();

/* ---------- singkatan ---------- */
const keys = Object.keys(ABBR).sort((a, b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const ABRX = new RegExp('(^|[^A-Za-z0-9])(' + keys.join('|') + ')(?![A-Za-z0-9])', 'g');
function expandAbbr(root) {
  const seen = new Set(), walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode: n => n.parentElement.closest('svg,abbr,button,input,label,.noab,.chips,.fig') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT});
  const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    const txt = n.nodeValue; ABRX.lastIndex = 0; if (!ABRX.test(txt)) continue; ABRX.lastIndex = 0;
    const frag = document.createDocumentFragment(); let last = 0, m;
    while ((m = ABRX.exec(txt))) {
      const k = m[2], start = m.index + m[1].length, end = start + k.length, a = ABBR[k];
      frag.append(txt.slice(last, start));
      const el = document.createElement('abbr'); el.className = 'ab'; el.dataset.k = k; el.textContent = k; el.tabIndex = 0; frag.append(el);
      const after = txt.slice(end, end + 8), dup = /^ [(\[]/.test(after) && after.slice(2).toLowerCase().startsWith(a[1].slice(0, 4).toLowerCase());
      if (!seen.has(k) && !dup) { const sp = document.createElement('span'); sp.className = 'abx'; sp.textContent = ' (' + a[1] + ')'; frag.append(sp); }
      seen.add(k); last = end;
    }
    frag.append(txt.slice(last)); n.replaceWith(frag);
  }
}
const srcHtml = k => { const s = ASRC[k]; if (!s) return ''; return `<span class="src">Sumber: ${s.u ? `<a href="${esc(s.u)}" target="_blank" rel="noopener">${esc(s.s)}</a>` : esc(s.s)}</span>`; };
document.addEventListener('click', e => {
  const ab = e.target.closest('abbr.ab'), pop = $('#pop');
  if (ab) { const a = ABBR[ab.dataset.k]; pop.innerHTML = `<b>${esc(a[0])}</b> = ${esc(a[1])}${a[2] ? `<br><span>${esc(a[2])}</span>` : ''}${srcHtml(a[0])}`; pop.hidden = false; clearTimeout(pop._t); pop._t = setTimeout(() => pop.hidden = true, 9000); }
  else if (!e.target.closest('#pop')) pop.hidden = true;
});

/* ---------- komponen umum ---------- */
const stars = n => `<span class="stars" aria-label="High-yield ${n} dari 3">${'★'.repeat(n)}<i>${'★'.repeat(3 - n)}</i></span>`;
const semChips = arr => (arr || []).map(n => `<span class="chip">Smt ${ROMAN[n]}</span>`).join('');
const topicRow = t => `<a class="row" href="#/t/${t.id}"><span class="rt">${esc(t.t)}<small>${semChips(window.TOPIC_SEM[t.id])}</small></span><span class="rm">${stars(t.hy)}${marks[t.id] ? '<b class="bm">◆</b>' : ''}${read[t.id] ? '<b class="ok">✓</b>' : ''}</span></a>`;
const procRow = p => `<a class="row" href="#/p/${p.id}"><span class="rt">${esc(p.t)}<small>${semChips(p.sm)}</small></span><span class="rm"><span class="lv lv${p.lv}" title="${esc(LEVEL[p.lv])}">L${p.lv}</span>${marks['p:' + p.id] ? '<b class="bm">◆</b>' : ''}</span></a>`;
const seg = (id, opts, cur) => `<div class="seg" id="${id}" role="tablist">${opts.map(o => `<button role="tab" data-v="${o[0]}" class="${o[0] === cur ? 'on' : ''}">${o[1]}</button>`).join('')}</div>`;
function mountViz(root) {
  $$('[data-viz]', root).forEach(el => { const v = VIZ[el.dataset.viz]; if (!v) return; el.className = 'vizbox'; el.innerHTML = `<div class="vizt">${esc(v.t)}</div><div class="noab">${v.h()}</div><div class="vizc">${esc(v.c)}</div>`; if (v.init) v.init(el); });
}
const view = $('#view');
function render(html, after) { view.innerHTML = html; window.scrollTo(0, 0); if (after) after(view); }
function wrapTables(v) { $$('table', v).forEach(tb => { if (!tb.parentElement.classList.contains('tw')) { const w = document.createElement('div'); w.className = 'tw'; tb.replaceWith(w); w.append(tb); } }); }

/* ---------- gambar dari paket galeri ---------- */
function figGrid(key, label) {
  const ids = GAL.forItem(key);
  if (!GAL.man) return `<div class="note">Gambar dari buku rujukan untuk bagian ini ada di paket galeri pribadi. <a href="#/galeri">Impor paket galeri</a> sekali di perangkat ini untuk menampilkannya.</div>`;
  if (!ids.length) return `<p class="gd">Belum ada gambar yang cocok di buku rujukan untuk ${label || 'bagian ini'}.</p>`;
  return `<div class="figs">${ids.map(id => figThumb(id)).join('')}</div>`;
}
const figThumb = id => { const i = GAL.info(id) || {b: '', p: ''}; return `<button class="fig" data-id="${esc(id)}"><img alt="" data-src="${esc(id)}"><span>${esc(i.b)} · hlm. ${esc(i.p)}</span></button>`; };
async function hydrateFigs(root) {
  for (const img of $$('img[data-src]', root)) { const u = await GAL.url(img.dataset.src); if (u) img.src = u; img.removeAttribute('data-src'); }
  $$('button.fig', root).forEach(b => b.onclick = () => lightbox(b.dataset.id, $$('button.fig', root).map(x => x.dataset.id)));
}
async function lightbox(id, list) {
  const lb = $('#lb'), i = GAL.info(id), idx = list.indexOf(id), u = await GAL.url(id);
  lb.innerHTML = `<div class="lbbar"><span>${idx + 1} / ${list.length}</span><button id="lbx" aria-label="Tutup">✕</button></div><div class="lbimg"><img src="${u}" alt=""></div><div class="lbcap"><b>${esc(REFS[i.b] || i.b)}</b>, halaman PDF ${esc(i.p)}${i.c ? `<br><span>${esc(i.c)}</span>` : ''}</div><div class="lbnav"><button id="lbp" ${idx ? '' : 'disabled'}>‹ Sebelumnya</button><button id="lbn" ${idx < list.length - 1 ? '' : 'disabled'}>Berikutnya ›</button></div>`;
  lb.hidden = false; document.body.classList.add('nos');
  $('#lbx').onclick = () => { lb.hidden = true; document.body.classList.remove('nos'); };
  $('#lbp').onclick = () => lightbox(list[idx - 1], list); $('#lbn').onclick = () => lightbox(list[idx + 1], list);
}

/* ---------- beranda / materi ---------- */
function pageHome() {
  const total = TOPICS.length, done = TOPICS.filter(t => read[t.id]).length;
  render(`<section class="hero"><p class="eyebrow">Bedah Toraks, Kardiak, dan Vaskular</p><h1>Materi</h1>
  <div class="search big"><input id="q" type="search" placeholder="Cari topik, prosedur, istilah, atau singkatan" autocomplete="off" aria-label="Cari"></div>
  <p class="progt">${total} topik · ${PROCS.length} prosedur · ${done} topik sudah dibaca</p><div class="prog"><div style="width:${done / total * 100}%"></div></div></section>
  <div id="res"></div>
  <div id="body">${seg('vw', [['modul', 'Per modul'], ['semester', 'Per semester']], prefs.view)}<div id="lst"></div></div>`, v => {
    $('#q').oninput = e => search(e.target.value.trim());
    $$('#vw button').forEach(b => b.onclick = () => { prefs.view = b.dataset.v; savePrefs(); pageHome(); });
    $('#lst').innerHTML = prefs.view === 'semester' ? semesterList(true) : GROUPS.map(g => { const ts = TOPICS.filter(t => t.g === g[0]); return `<section class="grp"><h2>${g[1]}</h2><p class="gd">${g[2]} · ${ts.filter(t => read[t.id]).length}/${ts.length} dibaca</p>${ts.map(topicRow).join('')}</section>`; }).join('') +
      (Object.keys(marks).length ? `<section class="grp"><h2>Penanda saya</h2>${TOPICS.filter(t => marks[t.id]).map(topicRow).join('')}${PROCS.filter(p => marks['p:' + p.id]).map(procRow).join('')}</section>` : '');
  });
}
function semesterList(withTopics) {
  return `<p class="note">Pembagian semester mengikuti Tabel 6 Buku Kurikulum PPDS-1 BTKV FKUI 2022. Kurikulum hanya mencantumkan nama modul; penempatan tiap topik dan prosedur ke modul adalah pemetaan aplikasi ini.</p>` +
    window.SEMESTERS.map((s, i) => { const n = i + 1, ts = TOPICS.filter(t => (window.TOPIC_SEM[t.id] || []).includes(n)), ps = PROCS.filter(p => (p.sm || []).includes(n));
      return `<details class="sem" ${n === 2 ? 'open' : ''}><summary><span class="sn">${ROMAN[n]}</span><span><b>Semester ${ROMAN[n]}</b> · ${esc(s.tahap)}<em>${esc(s.mod)}</em></span><i>${ts.length + ps.length}</i></summary>
      ${withTopics && ts.length ? `<h3>Topik</h3>${ts.map(topicRow).join('')}` : ''}${ps.length ? `<h3>Prosedur</h3>${ps.map(procRow).join('')}` : ''}${!ts.length && !ps.length ? '<p class="gd">Semester ini berisi rotasi bedah umum di luar BTKV; tidak ada topik khusus di aplikasi.</p>' : ''}</details>`; }).join('');
}
function search(q) {
  const res = $('#res'), body = $('#body'); if (q.length < 2) { res.innerHTML = ''; body.hidden = false; return; }
  const lq = q.toLowerCase(); body.hidden = true;
  const ab = window.ABBR_LIST.filter(a => a[0].toLowerCase().startsWith(lq) || a[1].toLowerCase().includes(lq) || a[2].toLowerCase().includes(lq)).slice(0, 6);
  const hit = (title, texts) => { let sc = title.toLowerCase().includes(lq) ? 10 : 0, snip = ''; for (const p of texts) { const i = p.toLowerCase().indexOf(lq); if (i >= 0) { sc++; if (!snip) snip = (i > 50 ? '…' : '') + p.slice(Math.max(0, i - 50), i + 90).replace(/\s+/g, ' ') + '…'; } } return {sc, snip}; };
  const th = TOPICS.map(t => ({t, ...hit(t.t, [...t.pearls, ...t.s.map(s => s[0] + '. ' + strip(s[1]))])})).filter(h => h.sc).sort((a, b) => b.sc - a.sc);
  const ph = PROCS.map(p => ({p, ...hit(p.t, [p.ind, p.prep, ...p.st, ...p.pit, p.post])})).filter(h => h.sc).sort((a, b) => b.sc - a.sc);
  res.innerHTML = (ab.length ? `<section class="grp"><h2>Singkatan</h2>${ab.map(a => `<div class="gl"><b>${esc(a[0])}</b> ${esc(a[1])}${a[2] ? `<span>${esc(a[2])}</span>` : ''}${srcHtml(a[0])}</div>`).join('')}</section>` : '') +
    `<section class="grp"><h2>Topik (${th.length})</h2>${th.map(h => `<a class="row col" href="#/t/${h.t.id}"><span class="rt">${esc(h.t.t)}</span><span class="snip">${esc(h.snip)}</span></a>`).join('') || '<p class="gd">Tidak ditemukan.</p>'}</section>` +
    `<section class="grp"><h2>Prosedur (${ph.length})</h2>${ph.map(h => `<a class="row col" href="#/p/${h.p.id}"><span class="rt">${esc(h.p.t)}</span><span class="snip">${esc(h.snip)}</span></a>`).join('') || '<p class="gd">Tidak ditemukan.</p>'}</section>`;
}

/* ---------- kerangka (outline) gaya referensi ---------- */
function outline(items) {
  return `<button class="olbtn" id="olb" aria-expanded="false">☰ Kerangka topik</button><nav class="ol" id="ol" hidden>${items.map(([id, l, sub]) => `<a href="#" data-to="${id}" class="${sub ? 'sub' : ''}">${esc(l)}</a>`).join('')}</nav>`;
}
function bindOutline(v) {
  const b = $('#olb', v), o = $('#ol', v); if (!b) return;
  b.onclick = () => { o.hidden = !o.hidden; b.setAttribute('aria-expanded', !o.hidden); };
  $$('a[data-to]', o).forEach(a => a.onclick = e => { e.preventDefault(); o.hidden = true; const t = document.getElementById(a.dataset.to); if (t) { if (t.tagName === 'DETAILS') t.open = true; t.scrollIntoView({behavior: 'smooth', block: 'start'}); } });
}

/* ---------- halaman topik ---------- */
function pageTopic(id) {
  const t = byId[id]; if (!t) return pageHome();
  const g = GROUPS.find(x => x[0] === t.g), list = TOPICS.filter(x => x.g === t.g), i = list.indexOf(t), prev = list[i - 1], next = list[i + 1];
  const vizIds = t.s.flatMap(s => [...s[1].matchAll(/data-viz="(\w+)"/g)].map(m => m[1]));
  const nImg = GAL.forItem('t:' + id).length;
  render(`<article class="doc"><p class="crumb"><a href="#/">Materi</a> › ${g[1]}</p><h1>${esc(t.t)}</h1>
  <p class="meta">${stars(t.hy)} <span>${['', 'Pendukung', 'Penting', 'Sangat high-yield'][t.hy]}</span> ${semChips(window.TOPIC_SEM[id])}</p>
  <p class="byline">Rujukan: ${t.ref.map(r => esc(REFS[r] || r)).join('; ')}</p>
  ${outline([['ringkas', 'Ringkasan dan rekomendasi'], ...t.s.map((s, j) => ['s' + j, s[0]]), ['grafik', `Grafik (${vizIds.length + nImg})`], ['rujukan', 'Rujukan']])}
  <div class="btnrow"><button class="mini" id="bm">${marks[id] ? '◆ Ditandai' : '◇ Tandai'}</button><button class="mini" id="rd">${read[id] ? '✓ Sudah dibaca' : 'Tandai sudah dibaca'}</button><a class="mini" href="#/kuis/${id}">Kuis (${t.q.length})</a></div>
  <section class="summary" id="ringkas"><h2>Ringkasan dan rekomendasi</h2><ul>${t.pearls.map(p => `<li>${esc(p)}</li>`).join('')}</ul></section>
  ${t.s.map((s, j) => `<section id="s${j}" class="sec"><h2><span class="num">${j + 1}</span>${esc(s[0])}</h2>${s[1]}</section>`).join('')}
  <section id="grafik" class="sec"><h2>Grafik</h2>${vizIds.length ? `<p class="gd">Visualisasi di dalam teks: ${vizIds.map(v => esc(VIZ[v] ? VIZ[v].t : v)).join('; ')}.</p>` : ''}<h3>Gambar dari buku rujukan</h3>${figGrid('t:' + id)}</section>
  <section class="refs" id="rujukan"><h2>Rujukan</h2><ol>${t.ref.map(r => `<li>${esc(REFS[r] || r)}</li>`).join('')}</ol></section>
  <div class="pn">${prev ? `<a href="#/t/${prev.id}">← ${esc(prev.t)}</a>` : '<span></span>'}${next ? `<a href="#/t/${next.id}">${esc(next.t)} →</a>` : '<span></span>'}</div></article>`, v => {
    wrapTables(v); mountViz(v); expandAbbr($('article', v)); bindOutline(v); hydrateFigs(v);
    $('#bm').onclick = () => { marks[id] ? delete marks[id] : marks[id] = 1; store.set('marks', marks); $('#bm').textContent = marks[id] ? '◆ Ditandai' : '◇ Tandai'; };
    $('#rd').onclick = () => { read[id] ? delete read[id] : read[id] = 1; store.set('read', read); $('#rd').textContent = read[id] ? '✓ Sudah dibaca' : 'Tandai sudah dibaca'; };
  });
}

/* ---------- prosedur ---------- */
function pageProcs() {
  render(`<section class="hero"><p class="eyebrow">Sesuai daftar kompetensi kurikulum</p><h1>Prosedur Bedah</h1>
  <p class="lede">${PROCS.length} tindakan bedah jantung dewasa, kongenital, toraks, dan vaskular dari Tabel 3 dan Tabel 4 kurikulum, masing-masing dengan indikasi, persiapan, langkah, jebakan, pascaoperasi, dan gambar.</p>
  <div class="search"><input id="pq" type="search" placeholder="Saring prosedur" aria-label="Saring prosedur"></div></section>
  ${seg('pv', [['grup', 'Per bidang'], ['semester', 'Per semester'], ['level', 'Per level kompetensi']], prefs.pview)}<div id="pl"></div>
  <p class="note">L1 sampai L4 adalah level kompetensi minimal tahap BTKV Utama menurut kurikulum. ${LEVEL.slice(1).map(esc).join('. ')}.</p>`, v => {
    const draw = () => { const f = $('#pq').value.trim().toLowerCase(), ps = PROCS.filter(p => !f || (p.t + ' ' + p.kw.join(' ')).toLowerCase().includes(f));
      $('#pl').innerHTML = prefs.pview === 'semester' ? window.SEMESTERS.map((s, i) => { const l = ps.filter(p => (p.sm || []).includes(i + 1)); return l.length ? `<section class="grp"><h2>Semester ${ROMAN[i + 1]}</h2><p class="gd">${esc(s.mod)}</p>${l.map(procRow).join('')}</section>` : ''; }).join('')
        : prefs.pview === 'level' ? [4, 3, 2, 1].map(n => { const l = ps.filter(p => p.lv === n); return l.length ? `<section class="grp"><h2><span class="lv lv${n}">L${n}</span> ${esc(LEVEL[n])}</h2>${l.map(procRow).join('')}</section>` : ''; }).join('')
        : PGROUPS.map(g => { const l = ps.filter(p => p.g === g[0]); return l.length ? `<section class="grp"><h2>${g[1]}</h2><p class="gd">${l.length} prosedur</p>${l.map(procRow).join('')}</section>` : ''; }).join(''); };
    $('#pq').oninput = draw; $$('#pv button').forEach(b => b.onclick = () => { prefs.pview = b.dataset.v; savePrefs(); $$('#pv button').forEach(x => x.classList.toggle('on', x === b)); draw(); }); draw();
  });
}
function pageProc(id) {
  const p = pById[id]; if (!p) return pageProcs();
  const list = PROCS.filter(x => x.g === p.g), i = list.indexOf(p), prev = list[i - 1], next = list[i + 1], g = PGROUPS.find(x => x[0] === p.g);
  const refs = [p.atl && p.atl.length ? `${REFS.ATL}, bab terkait (halaman PDF ${p.atl[0]}-${p.atl[1]})` : null, 'Buku Kurikulum PPDS-1 BTKV FKUI 2022 (Tabel 3 dan 4: level kompetensi dan jumlah kasus minimal)'].filter(Boolean);
  const nImg = GAL.forItem('p:' + id).length;
  render(`<article class="doc"><p class="crumb"><a href="#/prosedur">Prosedur</a> › ${g[1]}</p><h1>${esc(p.t)}</h1>
  <p class="meta"><span class="lv lv${p.lv}">L${p.lv}</span> <span>${esc(LEVEL[p.lv])}</span> ${semChips(p.sm)}</p>
  ${p.min ? `<p class="byline">Kasus minimal kurikulum: ${esc(p.min)}</p>` : ''}
  ${outline([['ind', 'Indikasi'], ['prep', 'Persiapan, posisi, dan akses'], ['st', `Langkah operasi (${p.st.length})`], ['pit', 'Jebakan teknis dan komplikasi'], ['post', 'Pascaoperasi'], ['grafik', `Gambar (${nImg})`], ['rujukan', 'Rujukan']])}
  <div class="btnrow"><button class="mini" id="bm">${marks['p:' + id] ? '◆ Ditandai' : '◇ Tandai'}</button></div>
  <section class="summary" id="ind"><h2>Indikasi</h2><p>${esc(p.ind)}</p></section>
  <section class="sec" id="prep"><h2><span class="num">1</span>Persiapan, posisi, dan akses</h2><p>${esc(p.prep)}</p></section>
  <section class="sec" id="st"><h2><span class="num">2</span>Langkah operasi</h2><ol class="steps">${p.st.map(s => `<li>${esc(s)}</li>`).join('')}</ol></section>
  <section class="sec" id="pit"><h2><span class="num">3</span>Jebakan teknis dan komplikasi</h2><ul class="warn">${p.pit.map(s => `<li>${esc(s)}</li>`).join('')}</ul></section>
  <section class="sec" id="post"><h2><span class="num">4</span>Pascaoperasi</h2><p>${esc(p.post)}</p></section>
  <section class="sec" id="grafik"><h2><span class="num">5</span>Gambar</h2>${figGrid('p:' + id, 'prosedur ini')}</section>
  <section class="refs" id="rujukan"><h2>Rujukan</h2><ol>${refs.map(r => `<li>${esc(r)}</li>`).join('')}</ol><p class="gd">Langkah disusun ulang dengan kalimat sendiri sebagai panduan belajar; teknik dan pilihan bahan bervariasi antar-pusat dan operator.</p></section>
  <div class="pn">${prev ? `<a href="#/p/${prev.id}">← ${esc(prev.t)}</a>` : '<span></span>'}${next ? `<a href="#/p/${next.id}">${esc(next.t)} →</a>` : '<span></span>'}</div></article>`, v => {
    expandAbbr($('article', v)); bindOutline(v); hydrateFigs(v);
    $('#bm').onclick = () => { const k = 'p:' + id; marks[k] ? delete marks[k] : marks[k] = 1; store.set('marks', marks); $('#bm').textContent = marks[k] ? '◆ Ditandai' : '◇ Tandai'; };
  });
}

/* ---------- galeri ---------- */
function pageGaleri() {
  const m = GAL.man;
  if (!m) return render(`<section class="hero"><p class="eyebrow">Gambar dari buku rujukan</p><h1>Galeri</h1>
    <p class="lede">Gambar dari buku-buku rujukan disimpan sebagai paket pribadi (<b>btkv-galeri.pack</b>) dan hanya tersimpan di perangkat ini. Paket ini tidak diunggah ke GitHub.</p></section>
    <div class="card"><h2>Impor paket galeri</h2><ol class="steps"><li>Simpan berkas btkv-galeri.pack ke iPhone (aplikasi File / Files, misalnya lewat AirDrop atau iCloud Drive).</li><li>Ketuk tombol di bawah, pilih berkas tersebut.</li><li>Tunggu sampai selesai. Setelah itu galeri dan gambar di setiap topik serta prosedur bisa dibuka tanpa internet.</li></ol>
    <label class="mini pri file">Pilih berkas paket<input type="file" id="pk" hidden></label><p id="pkst" class="gd"></p></div>`, v => {
      $('#pk').onchange = async e => { const f = e.target.files[0]; if (!f) return; const st = $('#pkst');
        try { st.textContent = 'Membaca paket…'; await GAL.importFile(f, x => st.textContent = 'Menyimpan gambar ' + Math.round(x * 100) + '%'); st.textContent = 'Selesai.'; pageGaleri(); }
        catch (err) { st.textContent = 'Gagal: ' + err.message; } };
    });
  const bySrc = SRC_ORDER.map(b => [b, m.imgs.filter(i => i.b === b)]).filter(x => x[1].length);
  const itemLabel = k => k.startsWith('t:') ? (byId[k.slice(2)] || {}).t : (pById[k.slice(2)] || {}).t;
  const byItem = Object.entries(m.items).filter(([k]) => itemLabel(k));
  render(`<section class="hero"><p class="eyebrow">Paket pribadi di perangkat ini</p><h1>Galeri</h1><p class="lede">${m.imgs.length} gambar dari ${bySrc.length} buku rujukan. Ketuk gambar untuk memperbesar dan melihat keterangan serta halaman sumbernya.</p></section>
  ${seg('gv', [['sumber', 'Per sumber'], ['topik', 'Per topik'], ['prosedur', 'Per prosedur']], prefs.gview)}<div id="gl"></div>
  <div class="btnrow"><button class="mini" id="gclr">Hapus paket dari perangkat</button></div>`, v => {
    const draw = () => { const gl = $('#gl');
      if (prefs.gview === 'sumber') gl.innerHTML = bySrc.map(([b, l]) => `<details class="gsec"><summary><b>${esc(REFS[b] || b)}</b><i>${l.length}</i></summary><div class="figs">${l.map(i => figThumb(i.id)).join('')}</div></details>`).join('');
      else { const pre = prefs.gview === 'topik' ? 't:' : 'p:'; gl.innerHTML = byItem.filter(([k]) => k.startsWith(pre)).map(([k, ids]) => `<details class="gsec"><summary><b>${esc(itemLabel(k))}</b><i>${ids.length}</i></summary><div class="figs">${ids.map(figThumb).join('')}</div><a class="mini" href="#/${pre[0]}/${k.slice(2)}">Buka ${pre === 't:' ? 'topik' : 'prosedur'}</a></details>`).join(''); }
      $$('details.gsec', gl).forEach(d => d.addEventListener('toggle', () => { if (d.open && !d._h) { d._h = 1; hydrateFigs(d); } }));
    };
    $$('#gv button').forEach(b => b.onclick = () => { prefs.gview = b.dataset.v; savePrefs(); $$('#gv button').forEach(x => x.classList.toggle('on', x === b)); draw(); }); draw();
    $('#gclr').onclick = async () => { await GAL.clear(); pageGaleri(); };
  });
}

/* ---------- high-yield ---------- */
function pageHY() {
  const lv = [[3, 'Sangat high-yield', 'Kuasai lebih dulu: paling sering ditanyakan dan paling menentukan keputusan klinis.'], [2, 'Penting', 'Lengkapi setelah kelompok pertama.']];
  render(`<section class="hero"><p class="eyebrow">Urutan belajar yang disarankan</p><h1>High-Yield</h1><p class="lede">Ringkasan poin kunci tiap topik. Ketuk topik untuk membuka poinnya.</p></section>
  ${lv.map(l => `<section class="grp"><h2>${stars(l[0])} ${l[1]}</h2><p class="gd">${l[2]}</p>${TOPICS.filter(t => t.hy === l[0]).map(t => `<details class="hy"><summary><span>${esc(t.t)}</span><em>${GROUPS.find(g => g[0] === t.g)[1]}</em></summary><ul>${t.pearls.map(p => `<li>${esc(p)}</li>`).join('')}</ul><a class="mini" href="#/t/${t.id}">Buka materi lengkap</a></details>`).join('')}</section>`).join('')}`, v => {
    $$('details.hy', v).forEach(d => d.addEventListener('toggle', () => { if (d.open && !d._x) { expandAbbr(d); d._x = 1; } }));
  });
}

/* ---------- latihan ---------- */
const qPool = scope => TOPICS.filter(t => scope === 'all' || t.g === scope || t.id === scope).flatMap(t => t.q.map((q, i) => ({id: t.id + '.' + i, t, q})));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function pageLatihan() {
  const card = (href, title, sub) => `<a class="row col" href="${href}"><span class="rt">${title}</span><span class="snip">${sub}</span></a>`;
  render(`<section class="hero"><h1>Latihan</h1><p class="lede">Kuis pilihan ganda dengan pembahasan, dan kartu hafalan.</p></section>
  <section class="grp"><h2>Kuis</h2>${card('#/kuis/all', 'Campuran semua modul', `10 soal acak dari ${qPool('all').length} soal`)}${GROUPS.map(g => card('#/kuis/' + g[0], g[1], `${qPool(g[0]).length} soal${best[g[0]] != null ? ' · nilai terbaik ' + best[g[0]] + '%' : ''}`)).join('')}</section>
  <section class="grp"><h2>Flashcard</h2>${card('#/kartu/abbr', 'Singkatan', `${window.ABBR_LIST.length} kartu · ${window.ABBR_LIST.filter(a => known['ab.' + a[0]]).length} hafal`)}${GROUPS.map(g => { const p = qPool(g[0]); return card('#/kartu/' + g[0], g[1], `${p.length} kartu · ${p.filter(c => known[c.id]).length} hafal`); }).join('')}</section>`);
}
function pageQuiz(scope) {
  let pool = shuffle(qPool(scope)); if (scope === 'all') pool = pool.slice(0, 10);
  if (!pool.length) return pageLatihan();
  let i = 0, score = 0; const name = scope === 'all' ? 'Campuran' : (GROUPS.find(g => g[0] === scope) || [0, byId[scope].t])[1];
  const show = () => {
    if (i >= pool.length) { const pct = Math.round(score / pool.length * 100); if (GROUPS.some(g => g[0] === scope) && (best[scope] == null || pct > best[scope])) { best[scope] = pct; store.set('best', best); }
      return render(`<section class="hero"><h1>Selesai</h1><p class="lede">${name}</p></section><div class="result"><div class="big">${score}/${pool.length}</div><p>${pct >= 80 ? 'Sangat baik.' : pct >= 60 ? 'Cukup; ulangi topik yang salah.' : 'Baca ulang materinya, lalu coba lagi.'}</p><div class="btnrow ctr"><button class="mini" id="again">Ulangi</button><a class="mini" href="#/latihan">Kembali ke Latihan</a></div></div>`, () => $('#again').onclick = () => pageQuiz(scope)); }
    const c = pool[i], order = shuffle(c.q[1].map((o, k) => k)); let done = false;
    render(`<p class="crumb"><a href="#/latihan">Latihan</a> › Kuis ${esc(name)}</p><div class="qhead"><span>Soal ${i + 1} dari ${pool.length}</span><span>Benar ${score}</span></div><div class="prog"><div style="width:${i / pool.length * 100}%"></div></div>
    <div class="qcard"><p class="qq">${esc(c.q[0])}</p><div class="opts">${order.map(k => `<button class="opt" data-k="${k}">${esc(c.q[1][k])}</button>`).join('')}</div><div class="expl" hidden><p>${esc(c.q[3])}</p><p class="gd">Topik: <a href="#/t/${c.t.id}">${esc(c.t.t)}</a></p><button class="mini pri" id="nx">${i + 1 < pool.length ? 'Soal berikutnya' : 'Lihat hasil'}</button></div></div>`, v => {
      $$('.opt', v).forEach(b => b.onclick = () => { if (done) return; done = true; const ok = +b.dataset.k === c.q[2]; if (ok) score++;
        $$('.opt', v).forEach(o => { o.disabled = true; if (+o.dataset.k === c.q[2]) o.classList.add('right'); }); if (!ok) b.classList.add('wrong');
        const ex = $('.expl', v); ex.hidden = false; expandAbbr(ex); $('#nx').onclick = () => { i++; show(); }; ex.scrollIntoView({behavior: 'smooth', block: 'nearest'}); });
    });
  };
  show();
}
function pageCards(deck) {
  const all = deck === 'abbr' ? window.ABBR_LIST.map(a => ({id: 'ab.' + a[0], f: a[0], b: `<b>${esc(a[1])}</b>${a[2] ? '<br>' + esc(a[2]) : ''}${srcHtml(a[0])}`}))
    : qPool(deck).map(c => ({id: c.id, f: c.q[0], b: `<b>${esc(c.q[1][c.q[2]])}</b><br>${esc(c.q[3])}`, sub: c.t.t}));
  if (!all.length) return pageLatihan();
  let onlyNew = true, list, i;
  const build = () => { list = shuffle(all.filter(c => !onlyNew || !known[c.id])); i = 0; };
  const show = () => {
    const name = deck === 'abbr' ? 'Singkatan' : GROUPS.find(g => g[0] === deck)[1], nk = all.filter(c => known[c.id]).length;
    const head = `<p class="crumb"><a href="#/latihan">Latihan</a> › Flashcard ${esc(name)}</p><div class="qhead"><span>${nk} dari ${all.length} hafal</span><label class="chk"><input type="checkbox" id="on" ${onlyNew ? 'checked' : ''}> hanya yang belum hafal</label></div>`;
    if (i >= list.length) return render(head + `<div class="result"><div class="big">✓</div><p>${list.length ? 'Putaran selesai.' : 'Semua kartu di dek ini sudah hafal.'}</p><div class="btnrow ctr"><button class="mini" id="again">Mulai lagi</button><button class="mini" id="reset">Reset hafalan dek</button></div></div>`, bind);
    const c = list[i];
    render(head + `<div class="prog"><div style="width:${i / list.length * 100}%"></div></div><div class="fc" id="fc" role="button" tabindex="0" aria-label="Balik kartu"><span class="fcf ${deck === 'abbr' ? 'bigf' : ''}">${esc(c.f)}</span><span class="fcb" hidden>${c.b}</span><span class="fch">ketuk untuk membalik</span></div>${c.sub ? `<p class="gd ctr">${esc(c.sub)}</p>` : ''}<div class="btnrow ctr"><button class="mini" id="no">Ulangi lagi</button><button class="mini pri" id="yes">Hafal</button></div>`, bind);
  };
  const bind = v => {
    const on = $('#on', v); if (on) on.onchange = () => { onlyNew = on.checked; build(); show(); };
    const fc = $('#fc', v); if (fc) { fc.onclick = e => { if (e.target.closest('a')) return; const b = $('.fcb', fc); b.hidden = !b.hidden; $('.fch', fc).hidden = !b.hidden; fc.classList.toggle('flip', !b.hidden); if (!b.hidden && deck !== 'abbr' && !fc._x) { expandAbbr(b); fc._x = 1; } };
      $('#yes').onclick = () => { known[list[i].id] = 1; store.set('known', known); i++; show(); }; $('#no').onclick = () => { delete known[list[i].id]; store.set('known', known); i++; show(); }; }
    const ag = $('#again', v); if (ag) ag.onclick = () => { build(); show(); };
    const rs = $('#reset', v); if (rs) rs.onclick = () => { all.forEach(c => delete known[c.id]); store.set('known', known); build(); show(); };
  };
  build(); show();
}

/* ---------- alat: glosarium, kalkulator, pengaturan ---------- */
function pageAlat() {
  const t = (href, title, sub) => `<a class="row col" href="${href}"><span class="rt">${title}</span><span class="snip">${sub}</span></a>`;
  render(`<section class="hero"><h1>Alat</h1></section><section class="grp">${t('#/hy', 'High-Yield', 'Urutan belajar dan poin kunci tiap topik')}${t('#/kalk', 'Kalkulator klinis', 'BSA dan aliran pompa, hemodinamik, oksigen, katup aorta, Qp:Qs, ABI, fungsi paru pascaoperasi, gradien A-a')}${t('#/glos', 'Glosarium singkatan', `${window.ABBR_LIST.length} singkatan dengan kepanjangan dan sumbernya`)}</section>
  <section class="grp about"><h2>Pengaturan</h2><div class="btnrow"><button class="mini" id="thm">Tema: ${{auto: 'otomatis', light: 'terang', dark: 'gelap'}[prefs.theme]}</button><button class="mini" id="fsm">Huruf A−</button><button class="mini" id="fsp">Huruf A+</button></div><p class="gd" id="off"></p>
  <h2>Tentang</h2><p>Struktur mengikuti Buku Kurikulum PPDS-1 BTKV FKUI 2022. Isi disusun ulang dengan kalimat sendiri berdasarkan buku rujukan yang dicantumkan di tiap topik, untuk belajar pribadi. Bukan pengganti buku teks, pedoman terbaru, maupun penilaian klinis; angka dan ambang dapat berbeda antar-edisi dan antar-pusat.</p></section>`, () => {
    $('#thm').onclick = () => { prefs.theme = {auto: 'light', light: 'dark', dark: 'auto'}[prefs.theme]; savePrefs(); applyPrefs(); pageAlat(); };
    $('#fsm').onclick = () => { prefs.fs = Math.max(-2, prefs.fs - 1); savePrefs(); applyPrefs(); };
    $('#fsp').onclick = () => { prefs.fs = Math.min(4, prefs.fs + 1); savePrefs(); applyPrefs(); };
    offlineStatus();
  });
}
function pageGlos() {
  const list = window.ABBR_LIST.slice().sort((a, b) => a[0].toLowerCase().localeCompare(b[0].toLowerCase()));
  const html = f => list.filter(a => !f || (a[0] + ' ' + a[1] + ' ' + a[2]).toLowerCase().includes(f)).map(a => `<div class="gl"><b>${esc(a[0])}</b> ${esc(a[1])}${a[2] ? `<span>${esc(a[2])}</span>` : ''}${srcHtml(a[0])}</div>`).join('') || '<p class="gd">Tidak ditemukan.</p>';
  render(`<p class="crumb"><a href="#/alat">Alat</a></p><section class="hero"><h1>Glosarium Singkatan</h1><p class="lede">${list.length} singkatan. Setiap kepanjangan disertai sumbernya: halaman PDF buku rujukan tempat istilah itu didefinisikan, atau artikel asli (PubMed/DOI) untuk nama uji klinis, klasifikasi, dan pedoman.</p></section><div class="search"><input id="gq" type="search" placeholder="Saring singkatan" aria-label="Saring"></div><section class="grp" id="gll">${html('')}</section>`, () => $('#gq').oninput = e => $('#gll').innerHTML = html(e.target.value.trim().toLowerCase()));
}
const N = (v, d = 1) => isFinite(v) ? v.toLocaleString('id-ID', {maximumFractionDigits: d, minimumFractionDigits: d}) : '–';
const CALC = [
  {id: 'bsa', t: 'Luas permukaan tubuh, aliran pompa, dan dosis heparin', f: [['w', 'Berat badan', 65, 'kg'], ['h', 'Tinggi badan', 165, 'cm'], ['ci', 'Target indeks aliran', 2.4, 'L/menit/m²']],
    r: x => { const m = Math.sqrt(x.w * x.h / 3600), d = .007184 * x.w ** .425 * x.h ** .725; return [['BSA (Mosteller)', N(m, 2) + ' m²'], ['BSA (DuBois)', N(d, 2) + ' m²'], ['Aliran pompa penuh', N(m * x.ci, 2) + ' L/menit'], ['Heparin 300-400 unit/kg', N(x.w * 300, 0) + ' – ' + N(x.w * 400, 0) + ' unit'], ['Protamin (1 mg per 100 unit heparin)', N(x.w * 3, 0) + ' – ' + N(x.w * 4, 0) + ' mg']]; }},
  {id: 'hemo', t: 'Profil hemodinamik', f: [['hr', 'Laju jantung', 80, 'kali/menit'], ['sbp', 'Sistolik', 110, 'mmHg'], ['dbp', 'Diastolik', 60, 'mmHg'], ['cvp', 'CVP', 8, 'mmHg'], ['mpap', 'Tekanan arteri pulmonalis rerata', 20, 'mmHg'], ['pcwp', 'PCWP', 12, 'mmHg'], ['co', 'Curah jantung', 4.5, 'L/menit'], ['bsa', 'BSA', 1.7, 'm²']],
    r: x => { const map = x.dbp + (x.sbp - x.dbp) / 3, ci = x.co / x.bsa, svr = (map - x.cvp) / x.co * 80, pvr = (x.mpap - x.pcwp) / x.co * 80; return [['MAP', N(map, 0) + ' mmHg'], ['Indeks jantung (CI)', N(ci, 2) + ' L/menit/m²', ci < 2.2 ? 'rendah' : ''], ['Isi sekuncup (SV)', N(x.co / x.hr * 1000, 0) + ' mL'], ['SVR', N(svr, 0) + ' dyn·dtk/cm⁵', svr < 800 ? 'rendah' : svr > 1200 ? 'tinggi' : ''], ['PVR', N(pvr, 0) + ' dyn·dtk/cm⁵ (' + N(pvr / 80, 1) + ' unit Wood)', pvr > 250 ? 'tinggi' : ''], ['Gradien transpulmonal', N(x.mpap - x.pcwp, 0) + ' mmHg']]; }},
  {id: 'o2', t: 'Kandungan, penghantaran, dan konsumsi oksigen', f: [['hb', 'Hemoglobin', 10, 'g/dL'], ['sa', 'SaO₂', 98, '%'], ['pa', 'PaO₂', 100, 'mmHg'], ['sv', 'SvO₂', 68, '%'], ['pv', 'PvO₂', 38, 'mmHg'], ['co', 'Curah jantung', 4.5, 'L/menit']],
    r: x => { const ca = 1.34 * x.hb * x.sa / 100 + .003 * x.pa, cv = 1.34 * x.hb * x.sv / 100 + .003 * x.pv; return [['CaO₂', N(ca) + ' mL/dL'], ['CvO₂', N(cv) + ' mL/dL'], ['Penghantaran O₂ (DO₂)', N(x.co * ca * 10, 0) + ' mL/menit'], ['Konsumsi O₂ (VO₂, Fick)', N(x.co * (ca - cv) * 10, 0) + ' mL/menit'], ['Rasio ekstraksi O₂', N((ca - cv) / ca * 100, 0) + '%', (ca - cv) / ca > .35 ? 'tinggi' : '']]; }},
  {id: 'ava', t: 'Katup aorta: persamaan kontinuitas dan gradien', f: [['d', 'Diameter LVOT', 2.0, 'cm'], ['v1', 'VTI LVOT', 20, 'cm'], ['v2', 'VTI katup aorta', 90, 'cm'], ['vm', 'Kecepatan puncak', 4.2, 'm/dtk'], ['bsa', 'BSA', 1.7, 'm²']],
    r: x => { const a = Math.PI * (x.d / 2) ** 2 * x.v1 / x.v2; return [['Luas katup aorta', N(a, 2) + ' cm²', a <= 1 ? 'kriteria berat (≤ 1,0)' : ''], ['Luas terindeks', N(a / x.bsa, 2) + ' cm²/m²', a / x.bsa <= .6 ? '≤ 0,6' : ''], ['Gradien puncak (4v²)', N(4 * x.vm ** 2, 0) + ' mmHg'], ['Indeks kecepatan tanpa dimensi', N(x.v1 / x.v2, 2), x.v1 / x.v2 < .25 ? '< 0,25' : '']]; }},
  {id: 'qpqs', t: 'Rasio aliran paru terhadap sistemik (Qp:Qs)', f: [['ao', 'Saturasi aorta', 96, '%'], ['mv', 'Saturasi vena campuran', 68, '%'], ['pv', 'Saturasi vena pulmonalis', 98, '%'], ['pa', 'Saturasi arteri pulmonalis', 84, '%']],
    r: x => { const q = (x.ao - x.mv) / (x.pv - x.pa); return [['Qp:Qs', N(q, 2), q > 1.5 ? 'pirau kiri ke kanan bermakna' : q < 1 ? 'pirau kanan ke kiri dominan' : '']]; }},
  {id: 'abi', t: 'Ankle-Brachial Index', f: [['dp', 'Sistolik a. dorsalis pedis', 90, 'mmHg'], ['pt', 'Sistolik a. tibialis posterior', 100, 'mmHg'], ['br', 'Sistolik brakial tertinggi', 130, 'mmHg']],
    r: x => { const a = Math.max(x.dp, x.pt) / x.br; return [['ABI', N(a, 2), a > 1.4 ? 'tidak terkompresi' : a >= 1 ? 'normal' : a > .9 ? 'batas' : a >= .4 ? 'penyakit arteri perifer' : 'iskemia berat']]; }},
  {id: 'ppo', t: 'Perkiraan fungsi paru pascaoperasi', f: [['f', 'FEV₁ praoperasi', 2.0, 'L'], ['p', 'FEV₁ (% prediksi)', 70, '%'], ['dl', 'DLCO (% prediksi)', 65, '%'], ['s', 'Segmen fungsional yang direseksi', 3, 'dari 19']],
    r: x => { const k = 1 - x.s / 19; return [['ppoFEV₁', N(x.f * k, 2) + ' L'], ['ppoFEV₁ (% prediksi)', N(x.p * k, 0) + '%', x.p * k < 30 ? '< 30%: risiko tinggi' : x.p * k < 60 ? '30-60%: perlu uji latih' : ''], ['ppoDLCO (% prediksi)', N(x.dl * k, 0) + '%', x.dl * k < 30 ? '< 30%: risiko tinggi' : x.dl * k < 60 ? '30-60%: perlu uji latih' : '']]; }},
  {id: 'aa', t: 'Gas alveolar dan gradien A-a', f: [['fi', 'FiO₂', 21, '%'], ['pco', 'PaCO₂', 40, 'mmHg'], ['po', 'PaO₂', 90, 'mmHg'], ['atm', 'Tekanan atmosfer', 760, 'mmHg'], ['age', 'Usia', 40, 'tahun']],
    r: x => { const A = x.fi / 100 * (x.atm - 47) - x.pco / .8, g = A - x.po; return [['PAO₂ (alveolar)', N(A, 0) + ' mmHg'], ['Gradien A-a', N(g, 0) + ' mmHg', g > x.age / 4 + 4 ? 'meningkat' : ''], ['Gradien normal perkiraan (usia/4 + 4)', N(x.age / 4 + 4, 0) + ' mmHg'], ['Rasio PaO₂/FiO₂', N(x.po / (x.fi / 100), 0)]]; }}
];
function pageCalc() {
  render(`<p class="crumb"><a href="#/alat">Alat</a></p><section class="hero"><h1>Kalkulator</h1><p class="lede">Alat bantu belajar. Periksa kembali setiap hasil sebelum dipakai untuk keputusan klinis.</p></section>${CALC.map(c => `<details class="calc" id="c-${c.id}"><summary>${c.t}</summary><div class="cf">${c.f.map(f => `<label><span>${f[1]}</span><span class="inp"><input type="number" inputmode="decimal" step="any" data-k="${f[0]}" value="${f[2]}"><em>${f[3]}</em></span></label>`).join('')}</div><div class="cr"></div></details>`).join('')}`, v => {
    CALC.forEach(c => { const el = $('#c-' + c.id, v), out = $('.cr', el), run = () => { const x = {}; $$('input', el).forEach(i => x[i.dataset.k] = parseFloat(i.value.replace(',', '.'))); out.innerHTML = c.r(x).map(r => `<div><span>${r[0]}</span><b>${r[1]}</b>${r[2] ? `<i>${r[2]}</i>` : ''}</div>`).join(''); }; $$('input', el).forEach(i => i.oninput = run); run(); });
    $('#c-bsa', v).open = true;
  });
}

/* ---------- router ---------- */
function route() {
  const [, p, a] = location.hash.split('/'), tab = {t: 'home', p: 'proc', prosedur: 'proc', galeri: 'gal', latihan: 'lat', kuis: 'lat', kartu: 'lat', alat: 'alat', hy: 'alat', kalk: 'alat', glos: 'alat'}[p] || 'home';
  $$('nav.tabs a').forEach(x => x.classList.toggle('on', x.dataset.tab === tab)); $('#pop').hidden = true; $('#lb').hidden = true; document.body.classList.remove('nos');
  const go = {t: () => pageTopic(a), p: () => pageProc(a), prosedur: pageProcs, galeri: pageGaleri, hy: pageHY, latihan: pageLatihan, kuis: () => pageQuiz(a || 'all'), kartu: () => pageCards(a || 'abbr'), kalk: pageCalc, glos: pageGlos, alat: pageAlat}[p];
  (go || pageHome)();
}
window.addEventListener('hashchange', route);

/* ---------- mode offline ---------- */
let offState = 'Memeriksa mode offline…';
function offlineStatus() { const el = $('#off'); if (el) el.textContent = offState; }
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').then(reg => {
    const ready = () => { offState = '● Siap dipakai offline'; offlineStatus(); };
    if (reg.active) ready(); navigator.serviceWorker.ready.then(ready);
    reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) { offState = 'Versi baru terpasang: tutup dan buka lagi aplikasi'; offlineStatus(); } }); });
  }).catch(() => { offState = 'Mode offline tidak tersedia di peramban ini'; offlineStatus(); });
} else offState = 'Buka lewat alamat https agar bisa offline';
GAL.load().finally(route);
