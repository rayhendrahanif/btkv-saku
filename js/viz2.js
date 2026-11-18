/* Visualisasi bagian 2 */
VIZ.cabg = {t: 'Konfigurasi graft CABG yang lazim', c: 'LIMA in situ ke LAD; vena safena atau arteri radialis dari aorta ke sistem sirkumfleksa dan kanan. Garis putus-putus = koroner natif dengan stenosis proksimal.', h: () => S(340, 280,
  P('M170 70 C100 70 62 130 80 200 C95 250 140 272 170 276 C200 272 245 250 260 200 C278 130 240 70 170 70z', 'nt fl') +
  B(140, 18, 60, 56, 'Aorta', 'ox') + P('M200 26 L300 26', 'ox th') + Tx(290, 18, 'a. subklavia kiri', 'sm', 'end') +
  P('M206 96 C202 150 196 210 184 258', 'nt th dsh') + P('M206 96 C236 104 256 126 258 160', 'nt th dsh') + P('M150 88 C104 98 82 140 86 190 C92 228 124 252 150 262', 'nt th dsh') +
  P('M286 26 C292 90 240 150 198 190', 'hl th ar') + Tx(300, 100, 'LIMA|→ LAD', 'hl') +
  P('M196 56 C262 60 286 110 256 172', 'de th ar') + Tx(298, 190, 'vena/radialis|→ OM', 'sm de') +
  P('M146 56 C60 70 40 190 118 246', 'de th ar') + Tx(50, 110, 'vena safena|→ RCA distal', 'sm de') +
  C(198, 190, 4, 'hl') + C(256, 172, 4, 'de') + C(118, 246, 4, 'de'))};

VIZ.carpentier = {t: 'Klasifikasi fungsional Carpentier', c: 'Garis horizontal = bidang anulus; ventrikel kiri di bawahnya. Digambar saat sistol.', h: () => { const pan = (x, t, s, a, p, note) => `<g transform="translate(${x},0)">` + Tx(40, 16, t, 'hl') + L(4, 60, 76, 60, 'ax th') + P(a, 'ox th nf') + P(p, 'de th nf') + Tx(40, 128, s, 'sm') + (note || '') + '</g>';
  return S(340, 160, pan(4, 'Tipe I', 'gerak normal|anulus melebar', 'M4 60 L34 84', 'M76 60 L48 84', Tx(41, 96, '↔ celah', 'sm')) + pan(88, 'Tipe II', 'gerak berlebih|prolaps', 'M4 60 L40 80', 'M76 60 L46 42', Tx(52, 36, 'prolaps', 'sm de')) + pan(172, 'Tipe IIIa', 'restriksi sistol|+ diastol (reumatik)', 'M4 60 L30 92', 'M76 60 L54 90', P('M30 92 L28 112 M54 90 L56 112', 'nt')) + pan(256, 'Tipe IIIb', 'restriksi sistol|(tethering, iskemik)', 'M4 60 L36 82', 'M76 60 L60 96', P('M60 96 L70 114', 'nt') + Tx(60, 122, '', 'sm'))); }};

VIZ.dissection = {t: 'Klasifikasi diseksi: Stanford dan DeBakey', c: 'Merah = segmen terdiseksi. Stanford A = aorta asendens terlibat, apa pun lokasi robekan.', h: () => { const ao = 'M30 150 L30 60 C30 20 80 20 80 60 L80 190', asc = 'M30 150 L30 60 C30 40 42 30 55 30', arch = 'M55 30 C68 30 80 40 80 60', desA = 'M80 60 L80 125', desB = 'M80 60 L80 190';
  const pan = (x, t, st, segs) => `<g transform="translate(${x},16)">` + P(ao, 'aoBg') + segs.map(s => P(s, 'aoDx')).join('') + P('M46 26 L46 12 M55 24 L55 10 M64 26 L64 12', 'nt th') + Tx(55, 212, t, 'hl') + Tx(55, 228, st, 'sm') + '</g>';
  return S(340, 252, pan(0, 'DeBakey I', 'Stanford A', [asc, arch, desB]) + pan(84, 'DeBakey II', 'Stanford A', [asc]) + pan(168, 'DeBakey IIIa', 'Stanford B', [desA]) + pan(252, 'DeBakey IIIb', 'Stanford B', [desB]) + L(168, 6, 168, 248, 'dsh ax') + Tx(84, 10, 'operasi darurat', 'sm ox') + Tx(252, 10, 'medis ± TEVAR', 'sm de')); }};

VIZ.bleeding = {t: 'Ambang laju perdarahan untuk eksplorasi ulang', c: 'Kriteria dari Bojar, Manual of Perioperative Care in Adult Cardiac Surgery. Selalu gabungkan dengan hemodinamik dan hasil koagulasi.', h: () => { const d = [['> 400 mL/jam', '1 jam', 400, 1], ['> 300 mL/jam', '2-3 jam', 300, 2.5], ['> 200 mL/jam', '4 jam', 200, 4]]; return S(340, 190, L(60, 160, 330, 160, 'ax') + L(60, 10, 60, 160, 'ax') + Tx(195, 184, 'lama perdarahan (jam)', 'sm') + [1, 2, 3, 4].map(h => Tx(60 + h * 62, 174, h, 'sm')).join('') + [100, 200, 300, 400].map(v => Tx(54, 164 - v / 400 * 140, v, 'sm', 'end') + L(60, 160 - v / 400 * 140, 330, 160 - v / 400 * 140, 'grid')).join('') +
    d.map((r, i) => `<rect x="60" y="${160 - r[2] / 400 * 140}" width="${r[3] * 62}" height="${r[2] / 400 * 140}" class="bar ${['ox', 'mx', 'de'][i]}" opacity=".45"/>` + Tx(54 + r[3] * 62, 174 - r[2] / 400 * 140 + 2, r[0] + ' × ' + r[1], 'sm', 'end')).join('')); }};

VIZ.fetal = {t: 'Sirkulasi fetal dan tiga pirau', c: 'Kotak kuning = pirau fetal yang menutup setelah lahir.', h: () => S(340, 300,
  B(120, 6, 100, 28, 'Plasenta', 'ox') + Ar(170, 34, 170, 48, 'ox') + Tx(240, 44, 'v. umbilikalis', 'sm ox') +
  B(105, 48, 130, 26, 'Duktus venosus', 'hl') + Ar(170, 74, 170, 88, 'ox') + B(120, 88, 100, 24, 'IVC', 'mx') + Ar(150, 112, 100, 128, 'mx') +
  B(30, 128, 110, 34, 'RA', 'mx') + B(200, 128, 110, 34, 'LA', 'ox') + B(140, 133, 60, 24, 'F. ovale', 'hl') +
  Ar(85, 162, 85, 184, 'de') + Ar(255, 162, 255, 184, 'ox') + B(30, 184, 110, 30, 'RV', 'de') + B(200, 184, 110, 30, 'LV', 'ox') +
  Ar(85, 214, 85, 232, 'de') + Ar(255, 214, 255, 232, 'ox') + B(20, 232, 110, 28, 'A. pulmonalis', 'de') + B(210, 232, 110, 28, 'Aorta', 'ox') +
  B(132, 236, 76, 22, 'D. arteriosus', 'hl') + Tx(75, 276, 'paru (PVR tinggi,|aliran sedikit)', 'sm de') + Tx(265, 276, 'asendens → otak, koroner|desendens → a. umbilikalis', 'sm ox') + Tx(40, 110, 'SVC ↓', 'sm de'))};

VIZ.septal = {t: 'Lokasi defek septum atrium dan ventrikel', c: 'Kiri: septum atrium dilihat dari atrium kanan. Kanan: septum ventrikel dilihat dari ventrikel kanan.', h: () => S(340, 230,
  `<ellipse cx="85" cy="115" rx="72" ry="92" class="vb fl"/>` + Tx(85, 16, 'Septum atrium', 'hl') + C(85, 36, 9, 'de') + Tx(85, 40, 'SVC', 'sm') + C(85, 196, 9, 'de') + Tx(85, 200, 'IVC', 'sm') +
  `<ellipse cx="85" cy="112" rx="20" ry="16" class="vb ox"/>` + Tx(85, 116, 'sekundum', 'sm') + `<ellipse cx="92" cy="62" rx="16" ry="9" class="vb mx"/>` + Tx(128, 66, 'sinus|venosus', 'sm', 'start') +
  `<ellipse cx="126" cy="150" rx="12" ry="12" class="vb hl"/>` + Tx(126, 154, 'primum', 'sm') + C(98, 170, 7, 'nt') + Tx(60, 166, 'sinus|koronarius', 'sm') + P('M142 110 C158 130 150 172 124 186', 'nt th') + Tx(160, 200, 'katup trikuspid', 'sm', 'end') +
  P('M200 40 L320 40 L300 210 L220 210z', 'vb fl') + Tx(260, 16, 'Septum ventrikel', 'hl') + Tx(260, 34, 'katup pulmonal', 'sm') +
  `<ellipse cx="282" cy="58" rx="16" ry="9" class="vb mx"/>` + Tx(282, 62, 'subarterial', 'sm') + `<ellipse cx="232" cy="88" rx="18" ry="11" class="vb ox"/>` + Tx(232, 110, 'perimembranosa', 'sm') +
  `<ellipse cx="226" cy="140" rx="14" ry="10" class="vb hl"/>` + Tx(226, 162, 'inlet', 'sm') + `<ellipse cx="278" cy="150" rx="13" ry="10" class="vb de"/>` + C(262, 190, 6, 'de') + Tx(292, 176, 'muskular', 'sm'))};

VIZ.tof = {t: 'Tetralogi Fallot', c: 'Empat komponen akibat deviasi anterosefalad septum infundibular. Pirau kanan ke kiri melalui VSD menimbulkan sianosis.', h: () => S(340, 250,
  B(84, 70, 60, 50, 'RA', 'de') + B(200, 70, 110, 50, 'LA', 'ox') + B(30, 150, 120, 80, '', 'de') + Tx(80, 205, 'RV|(4) hipertrofi', 'de') + B(190, 150, 120, 80, 'LV', 'ox') +
  `<rect x="150" y="150" width="40" height="34" class="vb hl"/>` + Tx(170, 163, '(1) VSD', 'sm') + Ar(152, 176, 188, 176, 'de') +
  B(140, 20, 60, 46, '(3) Aorta|overriding', 'mx') + P('M170 150 L170 66', 'mx th ar') +
  P('M40 150 L40 24', 'de th') + P('M66 150 L66 24', 'de th') + P('M40 124 L50 130 M66 124 L56 130', 'ox th') + Tx(30, 14, 'a. pulmonalis', 'sm de', 'start') + Tx(8, 244, '(2) obstruksi jalur keluar RV (tanda merah)', 'sm ox', 'start') +
  Ar(114, 120, 114, 150, 'de') + Ar(255, 120, 255, 150, 'ox'))};

VIZ.fontan = {t: 'Tiga tahap paliasi ventrikel tunggal', c: 'Tahap akhir: seluruh aliran balik vena sistemik mengalir pasif ke arteri pulmonalis; ventrikel tunggal hanya memompa sirkulasi sistemik.', h: () => { const pan = (x, t, sub, extra) => `<g transform="translate(${x},0)">` + Tx(52, 14, t, 'hl') + Tx(52, 28, sub, 'sm') + B(18, 150, 68, 40, 'Ventrikel|tunggal', 'mx') + B(18, 110, 68, 26, 'Atrium', 'mx') + B(30, 200, 44, 20, 'Aorta', 'ox') + B(14, 66, 76, 22, 'A. pulmonalis', 'de') + extra + '</g>';
  return S(340, 232, pan(0, 'Tahap 1', 'neonatus', B(30, 40, 44, 18, 'pirau', 'hl') + P('M94 210 C104 150 100 60 76 50', 'ox ar') + Tx(52, 102, 'SVC + IVC ↓', 'sm de')) + pan(114, 'Tahap 2: Glenn', '3-6 bulan', B(30, 38, 44, 18, 'SVC', 'de') + Ar(52, 56, 52, 66, 'de') + Tx(52, 102, 'IVC ↓ atrium', 'sm de')) + pan(228, 'Tahap 3: Fontan', '2-4 tahun', B(30, 38, 44, 18, 'SVC', 'de') + Ar(52, 56, 52, 66, 'de') + P('M100 180 C108 130 104 90 90 80', 'de th ar') + Tx(100, 196, 'IVC', 'sm de'))); }};

VIZ.lungseg = {t: 'Lobus dan jumlah segmen paru', c: 'Total 19 segmen fungsional dipakai untuk menghitung fungsi paru pascaoperasi (kanan 3 + 2 + 5; kiri 5 + 4).', h: () => S(340, 250,
  P('M150 30 C100 30 60 90 50 160 C46 200 60 230 100 230 L150 220z', 'vb fl') + P('M190 30 C240 30 280 90 290 160 C294 200 280 230 240 230 L190 220 L190 150 C205 150 205 120 190 110z', 'vb fl') +
  P('M150 110 L75 100', 'nt th') + P('M150 160 L58 185', 'nt th') + P('M190 95 L286 170', 'nt th') + B(160, 10, 20, 70, '', 'nt') + Tx(170, 8, 'trakea', 'sm') +
  Tx(110, 74, 'Atas: 3|apikal, posterior,|anterior', 'sm') + Tx(100, 132, 'Tengah: 2|lateral, medial', 'sm') + Tx(105, 196, 'Bawah: 5|superior + 4 basal', 'sm') +
  Tx(240, 74, 'Atas: 5|apikoposterior (2),|anterior, lingula (2)', 'sm') + Tx(232, 186, 'Bawah: 4|superior + 3 basal', 'sm') + Tx(100, 246, 'KANAN (10)', 'hl') + Tx(240, 246, 'KIRI (9)', 'hl'))};

VIZ.wsd = {t: 'Sistem drainase tiga botol', c: 'Sistem sekali pakai modern menyatukan ketiga ruang ini. Jangan mengangkat botol di atas dada pasien.', h: () => { const bot = (x, t, lvl) => `<rect x="${x}" y="70" width="84" height="120" rx="8" class="vb fl"/>` + `<rect x="${x + 2}" y="${190 - lvl}" width="80" height="${lvl - 2}" class="bar de" opacity=".35"/>` + Tx(x + 42, 212, t, 'sm');
  return S(340, 236, Tx(20, 18, 'dari pasien →', 'sm ox', 'start') + bot(18, '1. Penampung|cairan', 30) + bot(128, '2. Segel air|undulasi = paten', 36) + bot(238, '3. Pengatur isap', 80) +
    P('M10 30 L44 30 L44 120', 'ox th') + P('M76 100 L76 40 L150 40 L150 174', 'nt th') + Tx(170, 150, '2 cm', 'sm hl', 'start') + P('M184 100 L184 40 L262 40 L262 100', 'nt th') + P('M284 24 L284 176', 'hl th') + Tx(284, 16, 'pipa terbuka ke udara', 'sm hl') + Tx(304, 140, '-20|cmH2O', 'sm hl') + P('M310 100 L310 50 L336 50', 'nt th ar') + Tx(336, 44, 'isap', 'sm', 'end')); }};

VIZ.cardiacbox = {t: 'Kotak jantung dan segitiga aman', c: 'Luka tembus di dalam kotak jantung dianggap cedera jantung sampai terbukti tidak. Segitiga aman adalah lokasi pemasangan selang dada.', h: () => S(340, 270,
  P('M110 20 C130 10 210 10 230 20 L290 44 C320 60 322 120 316 250 L24 250 C18 120 20 60 50 44z', 'vb fl') + P('M110 20 L60 44 M230 20 L280 44', 'nt') + C(170, 8, 14, 'nt') +
  `<rect x="120" y="44" width="100" height="130" class="vb ox" opacity=".5"/>` + Tx(170, 100, 'KOTAK JANTUNG|klavikula → tepi iga|antara garis|midklavikula', 'sm') + P('M120 174 C150 160 190 160 220 174', 'nt dsh') +
  P('M300 90 L282 150 L318 150z', 'vb hl') + Tx(262, 196, 'segitiga aman:|pektoralis mayor,|latisimus dorsi,|sela iga ke-5', 'sm') + C(120, 120, 2.5, 'nt') + C(220, 120, 2.5, 'nt') + L(282, 150, 318, 150, 'hl th'))};

VIZ.nodemap = {t: 'Stasiun kelenjar getah bening (tumor paru kanan)', c: 'N1 = hilus dan intrapulmonal ipsilateral (10-14); N2 = mediastinum ipsilateral dan subkarina (2-9); N3 = kontralateral atau supraklavikula.', h: () => { const n = (x, y, s, cls) => C(x, y, 11, cls) + Tx(x, y + 4, s, 'sm');
  return S(340, 250, P('M160 10 L160 110 L80 190 M180 10 L180 110 L260 190 M160 110 L170 124 L180 110', 'nt th') + P('M60 30 C140 60 200 60 280 30', 'nt dsh') + Tx(300, 26, 'aorta', 'sm') +
    n(140, 40, '2R', 'mx') + n(200, 40, '2L', 'ox') + n(140, 84, '4R', 'mx') + n(200, 84, '4L', 'ox') + n(232, 64, '5', 'ox') + n(264, 58, '6', 'ox') + n(170, 142, '7', 'mx') + n(170, 178, '8', 'mx') + n(170, 214, '9', 'mx') +
    n(120, 126, '10R', 'de') + n(92, 152, '11', 'de') + n(66, 178, '12-14', 'de') + n(222, 126, '10L', 'ox') + n(250, 152, '11L', 'ox') +
    Tx(20, 236, 'N1', 'de', 'start') + Tx(60, 236, 'N2', 'mx', 'start') + Tx(100, 236, 'N3 (kontralateral)', 'ox', 'start') + Tx(20, 14, 'KANAN', 'sm', 'start') + Tx(320, 14, 'KIRI', 'sm', 'end')); }};

VIZ.mediastinum = {t: 'Kompartemen mediastinum (pandangan lateral)', c: 'Lokasi massa mempersempit diagnosis banding.', h: () => S(340, 240,
  P('M40 20 L300 20 L300 220 L40 220z', 'vb fl') + L(128, 20, 128, 220, 'nt th') + L(224, 20, 224, 220, 'nt th') + Tx(20, 124, 'sternum', 'sm') + Tx(320, 124, 'vertebra', 'sm') +
  Tx(86, 44, 'ANTERIOR', 'hl') + Tx(86, 70, 'Timoma|Teratoma /|sel germinal|Limfoma|Tiroid|retrosternal', 'sm') +
  Tx(176, 44, 'MEDIUS', 'hl') + Tx(176, 70, 'Kista bronkogenik|Kista perikard|Limfadenopati|Aneurisma|aorta', 'sm') + `<ellipse cx="176" cy="176" rx="30" ry="32" class="vb ox" opacity=".4"/>` + Tx(176, 180, 'jantung', 'sm') +
  Tx(262, 44, 'POSTERIOR', 'hl') + Tx(262, 70, 'Tumor neurogenik|(schwannoma,|neurofibroma,|neuroblastoma)|Kista|enterik', 'sm'))};

VIZ.abi = {t: 'Interpretasi Ankle-Brachial Index', c: 'ABI = tekanan sistolik pergelangan kaki tertinggi dibagi tekanan sistolik brakial tertinggi.',
  h: () => `<div id="abS"></div>${slider('abV', 'ABI', 0.2, 1.6, 0.01, 0.95)}<div class="vout" id="abO"></div>`,
  init(el) { const z = [[.2, .4, 'ox', 'Iskemia berat: nyeri istirahat atau kehilangan jaringan sering dijumpai'], [.4, .7, 'mx', 'Penyakit arteri perifer sedang: klaudikasio'], [.7, .9, 'hl', 'Penyakit arteri perifer ringan'], [.9, 1.0, 'nt', 'Batas (borderline)'], [1.0, 1.4, 'de', 'Normal'], [1.4, 1.6, 'ox', 'Arteri tidak terkompresi (kalsifikasi media): pakai indeks jari kaki-brakial']], X = v => 14 + (v - .2) / 1.4 * 312, $ = id => el.querySelector('#' + id);
    const draw = () => { const v = +$('abV').value, r = z.find(q => v < q[1]) || z[5]; $('abVv').textContent = v.toFixed(2);
      $('abS').innerHTML = S(340, 70, z.map(q => `<rect x="${X(q[0])}" y="24" width="${X(q[1]) - X(q[0])}" height="18" class="bar ${q[2]}" opacity=".6"/>`).join('') + [.4, .7, .9, 1.0, 1.4].map(t => Tx(X(t), 58, String(t.toFixed(1)).replace('.', ','), 'sm')).join('') + P(`M${X(v)} 22 l-6 -12 l12 0z`, 'cur fillc')); $('abO').innerHTML = `<b>${r[3]}</b>`; };
    $('abV').oninput = draw; draw(); }};

VIZ.ali = {t: 'Klasifikasi Rutherford untuk iskemia tungkai akut', c: 'Defisit motorik menandai batas antara "masih ada waktu" dan "segera".', h: () => { const r = [['I · Viabel', 'tidak ada', 'tidak ada', 'terdengar', 'terdengar', 'de'], ['IIa · Terancam marginal', 'minimal (jari)', 'tidak ada', 'sering tidak', 'terdengar', 'hl'], ['IIb · Terancam segera', 'lebih luas, nyeri istirahat', 'ringan-sedang', 'tidak', 'terdengar', 'mx'], ['III · Ireversibel', 'anestesia luas', 'paralisis, rigor', 'tidak', 'tidak', 'ox']];
  return `<div class="tw"><table class="mini"><tr><th>Kelas</th><th>Sensorik</th><th>Motorik</th><th>Arteri (Doppler)</th><th>Vena (Doppler)</th></tr>${r.map(x => `<tr class="row-${x[5]}"><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td><td>${x[4]}</td></tr>`).join('')}</table></div>`; }};

VIZ.aaa = {t: 'Aneurisma aorta abdominal, EVAR, dan endoleak', c: 'Tipe I dan III menghubungkan kantong langsung dengan tekanan sistemik sehingga harus diperbaiki.', h: () => S(340, 290,
  P('M150 10 L150 80 C110 100 100 170 140 210 L110 280 M190 10 L190 80 C230 100 240 170 200 210 L230 280 M170 220 L150 280 M170 220 L190 280', 'ox th nf') +
  P('M150 56 L104 46 M190 56 L236 46', 'ox th') + Tx(70, 44, 'a. renalis', 'sm') + P('M158 62 L158 206 L132 270 M182 62 L182 206 L208 270 M158 62 L182 62', 'hl th nf dsh') + Tx(170, 140, 'stent|graft', 'sm hl') +
  Ar(120, 70, 152, 72, 'de') + Tx(74, 74, 'Tipe Ia|(leher proksimal)', 'sm de') + Ar(96, 150, 116, 150, 'de') + Tx(52, 146, 'Tipe II|(lumbal, a.|mesenterika|inferior)', 'sm de') +
  Ar(236, 180, 190, 186, 'de') + Tx(282, 176, 'Tipe III|(sambungan /|robekan kain)', 'sm de') + Ar(250, 262, 214, 262, 'de') + Tx(290, 258, 'Tipe Ib|(iliaka)', 'sm de') + L(108, 126, 232, 126, 'dsh ax') + Tx(284, 116, 'perbaikan elektif|≥ 5,5 cm (pria)|≥ 5,0 cm (wanita)', 'sm'))};

VIZ.avf = {t: 'Urutan pilihan akses hemodialisis', c: 'Mulai dari distal, lengan non-dominan, dan autogen. Fistula matang: aliran > 600 mL/menit, diameter > 6 mm, kedalaman < 6 mm.', h: () => S(340, 170,
  P('M10 60 C80 40 200 50 250 62 L320 58 C334 58 334 96 320 96 L250 92 C200 110 80 116 10 100z', 'vb fl') + Tx(40, 30, 'lengan atas', 'sm') + Tx(170, 30, 'siku', 'sm') + Tx(290, 30, 'pergelangan', 'sm') + L(170, 40, 170, 110, 'dsh ax') +
  C(262, 70, 12, 'de') + Tx(262, 74, '1', '') + C(170, 66, 12, 'mx') + Tx(170, 70, '2', '') + C(120, 92, 12, 'hl') + Tx(120, 96, '3', '') + C(70, 78, 12, 'ox') + Tx(70, 82, '4', '') +
  Tx(8, 132, '1 Radiosefalika (Brescia-Cimino)   2 Brakiosefalika', 'sm', 'start') + Tx(8, 148, '3 Brakiobasilika dengan transposisi   4 Graft prostetik (ePTFE)', 'sm', 'start') + Tx(8, 164, 'Kateter vena sentral bertunel: pilihan terakhir / sementara', 'sm', 'start'))};
