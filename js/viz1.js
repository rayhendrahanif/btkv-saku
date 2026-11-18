/* Visualisasi SVG. Setiap entri: {t: judul, c: keterangan, h: () => html, init?: (el) => void} */
window.VIZ = {};
const S = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" class="viz" role="img" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs>${inner}</svg>`;
const Tx = (x, y, s, cls = '', a = 'middle') => String(s).split('|').map((l, i) => `<text x="${x}" y="${y + i * 13}" text-anchor="${a}" class="vt ${cls}">${l}</text>`).join('');
const B = (x, y, w, h, s, cls = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" class="vb ${cls}"/>` + Tx(x + w / 2, y + h / 2 + 4 - (String(s).split('|').length - 1) * 6.5, s, cls);
const Ar = (x1, y1, x2, y2, cls = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="va ${cls}" marker-end="url(#ah)"/>`;
const L = (x1, y1, x2, y2, cls = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="vl ${cls}"/>`;
const P = (d, cls = '') => `<path d="${d}" class="vp ${cls}"/>`;
const C = (x, y, r, cls = '') => `<circle cx="${x}" cy="${y}" r="${r}" class="vb ${cls}"/>`;
const poly = (pts, cls = '') => `<polyline points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" class="vp ${cls}"/>`;
const slider = (id, label, min, max, step, val, unit = '') => `<label class="sl"><span>${label}: <b id="${id}v">${val}</b> ${unit}</span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;

VIZ.heartbox = {t: 'Skema empat ruang dan arah aliran', c: 'Biru = darah miskin oksigen, merah = kaya oksigen. Katup aorta berada di tengah, berkontinuitas fibrosa dengan katup mitral.', h: () => S(340, 250,
  B(20, 20, 70, 30, 'SVC / IVC', 'de') + Ar(90, 35, 108, 60, 'de') +
  B(40, 60, 110, 60, 'RA|atrium kanan', 'de') + B(40, 150, 110, 70, 'RV|ventrikel kanan', 'de') +
  Tx(95, 139, 'katup trikuspid', 'sm') + Ar(95, 120, 95, 150, 'de') +
  B(190, 60, 110, 60, 'LA|atrium kiri', 'ox') + B(190, 150, 110, 70, 'LV|ventrikel kiri', 'ox') +
  Tx(245, 139, 'katup mitral', 'sm') + Ar(245, 120, 245, 150, 'ox') +
  P('M150 185 C170 185 170 25 150 25', 'de ar') + Tx(170, 16, 'a. pulmonalis → paru', 'sm de') +
  P('M300 40 C320 40 320 80 300 80', 'ox ar') + Tx(262, 36, 'v. pulmonalis', 'sm ox') +
  P('M190 200 C172 200 176 240 215 240', 'ox ar') + Tx(262, 244, 'aorta → sistemik', 'sm ox'))};

VIZ.coronary = {t: 'Skema arteri koroner (pandangan anterior)', c: 'Dominansi kanan: posterior descending artery berasal dari RCA. Garis putus-putus = berjalan di permukaan posterior.', h: () => S(340, 300,
  P('M170 40 C90 40 50 110 70 190 C85 250 140 285 170 290 C200 285 255 250 270 190 C290 110 250 40 170 40z', 'nt fl') +
  C(170, 62, 20, 'ox') + Tx(170, 66, 'Aorta', 'sm') +
  P('M188 68 L210 78', 'ox th') + Tx(232, 66, 'LMCA', 'sm ox') +
  P('M210 78 C205 130 195 210 180 270', 'ox th') + Tx(214, 236, 'LAD', 'ox') +
  P('M203 120 L235 150 M199 160 L228 190', 'ox') + Tx(226, 206, 'diagonal', 'sm') +
  P('M203 110 L185 125 M199 150 L182 164 M194 190 L178 203', 'ox') + Tx(150, 150, 'septal', 'sm') +
  P('M210 78 C245 85 268 110 272 150', 'ox th') + Tx(296, 108, 'LCx', 'ox') +
  P('M262 112 L248 160 M270 140 L258 200', 'ox dsh') + Tx(288, 215, 'OM', 'sm') +
  P('M152 70 C100 80 70 120 72 180 C76 225 110 262 150 276', 'de th') + Tx(46, 130, 'RCA', 'de') +
  P('M110 92 L98 78', 'de') + Tx(84, 70, 'nodus SA', 'sm') +
  P('M74 190 L110 215', 'de') + Tx(128, 228, 'marginal akut', 'sm') +
  P('M150 276 C160 240 166 200 168 150', 'de dsh th') + Tx(110, 262, 'post. descending', 'sm de', 'end') + C(150, 276, 4, 'de') + Tx(150, 296, 'kruks (nodus AV)', 'sm'))};

VIZ.conduction = {t: 'Jalur dan kecepatan konduksi', c: 'Kecepatan menurut Ganong (tabel kecepatan konduksi jaringan jantung). Perlambatan di nodus AV memberi waktu pengisian ventrikel.', h: () => S(340, 300,
  B(95, 10, 150, 34, 'Nodus SA · 0,05 m/dtk', 'hl') + Ar(170, 44, 170, 62) +
  B(95, 62, 150, 34, 'Miokard atrium · 1 m/dtk') + Ar(170, 96, 170, 114) +
  B(95, 114, 150, 34, 'Nodus AV · 0,05 m/dtk', 'hl') + Tx(292, 128, 'apeks|segitiga Koch', 'sm') + Ar(170, 148, 170, 166) +
  B(95, 166, 150, 34, 'Berkas His · 1 m/dtk') + Tx(46, 180, 'menembus|korpus fibrosum', 'sm') +
  Ar(140, 200, 90, 224) + Ar(200, 200, 250, 224) +
  B(20, 224, 130, 30, 'Cabang berkas kanan') + B(190, 224, 130, 30, 'Cabang berkas kiri') +
  Tx(255, 268, 'fasikulus anterior + posterior', 'sm') + Tx(85, 268, 'lewat pita moderator', 'sm') +
  B(70, 276, 200, 22, 'Serabut Purkinje · 4 m/dtk', 'ox'))};

VIZ.actionpotential = {t: 'Potensial aksi: miosit ventrikel vs sel nodus SA', c: 'Kiri: lima fase miosit kerja. Kanan: sel pacu tanpa fase 1 dan 2, dengan depolarisasi spontan fase 4.', h: () => S(340, 210,
  L(20, 180, 330, 180, 'ax') + L(20, 15, 20, 180, 'ax') + Tx(14, 22, '+20', 'sm', 'end') + Tx(14, 172, '-90', 'sm', 'end') + Tx(26, 196, 'mV vs waktu', 'sm', 'start') +
  P('M25 170 L45 170 L50 30 L58 48 C90 50 110 58 125 80 C140 120 148 165 160 170 L180 170', 'ox th nf') +
  Tx(40, 120, '0', 'hl') + Tx(62, 26, '1', 'hl') + Tx(92, 44, '2', 'hl') + Tx(152, 120, '3', 'hl') + Tx(170, 164, '4', 'hl') +
  Tx(95, 100, 'Na+ masuk (0)|Ca2+ masuk (2)|K+ keluar (3)', 'sm') +
  P('M200 135 L232 118 C240 80 246 62 252 60 C264 64 270 110 280 135 L312 118 C318 90 322 70 326 62', 'de th nf') +
  Tx(214, 142, '4', 'hl') + Tx(236, 84, '0', 'hl') + Tx(276, 96, '3', 'hl') + Tx(258, 160, 'If (HCN) → Ca2+ tipe-T|→ Ca2+ tipe-L (fase 0)', 'sm') + Tx(100, 14, 'Ventrikel', '') + Tx(260, 14, 'Nodus SA', ''))};

/* ---------- Wiggers interaktif ---------- */
(function () {
  const ip = (pts, t) => { for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [a, b] = [pts[i - 1], pts[i]], u = (t - a[0]) / (b[0] - a[0]), s = (1 - Math.cos(u * Math.PI)) / 2; return a[1] + (b[1] - a[1]) * s; } return pts[pts.length - 1][1]; };
  const LV = [[0, 6], [.05, 10], [.1, 10], [.15, 80], [.22, 115], [.28, 120], [.36, 108], [.42, 90], [.46, 40], [.5, 7], [.55, 3], [.62, 5], [.8, 6]];
  const AO = [[0, 86], [.1, 81], [.15, 80], [.22, 113], [.28, 118], [.36, 107], [.42, 92], [.435, 87], [.455, 94], [.6, 89], [.8, 86]];
  const LA = [[0, 6], [.05, 11], [.1, 8], [.13, 11], [.2, 5], [.42, 12], [.5, 13], [.56, 5], [.62, 6], [.8, 6]];
  const VOL = [[0, 105], [.1, 130], [.15, 130], [.27, 80], [.42, 55], [.5, 55], [.62, 100], [.8, 105]];
  const g = (t, m, s, a) => a * Math.exp(-((t - m) ** 2) / (2 * s * s));
  const ecg = t => g(t, .04, .014, .15) + g(t, .098, .004, -.12) + g(t, .108, .006, 1) + g(t, .12, .004, -.22) + g(t, .36, .03, .3);
  const PH = [[0, .1, 'Sistol atrium', 'Mitral terbuka, aorta tertutup. Gelombang a pada atrium; S4 bila ventrikel kaku.'], [.1, .15, 'Kontraksi isovolumetrik', 'Semua katup tertutup. S1 di awal fase. Tekanan naik, volume tetap (EDV).'], [.15, .27, 'Ejeksi cepat', 'Aorta terbuka. Tekanan ventrikel sedikit di atas aorta; volume turun cepat.'], [.27, .42, 'Ejeksi lambat', 'Aorta masih terbuka; repolarisasi (gelombang T). Gelombang v atrium menanjak.'], [.42, .5, 'Relaksasi isovolumetrik', 'Semua katup tertutup. S2 dan takik dikrotik. Volume tetap (ESV).'], [.5, .62, 'Pengisian cepat', 'Mitral terbuka; y descent. S3 bila ada kelebihan volume.'], [.62, .8, 'Diastasis', 'Pengisian lambat; tekanan atrium dan ventrikel hampir sama.']];
  VIZ.wiggers = {t: 'Diagram Wiggers interaktif', c: 'Geser untuk menjelajah satu siklus (0,8 detik; 75 kali/menit). Nilai bersifat ilustratif.',
    h: () => `<div id="wgS"></div>${slider('wgT', 'Waktu', 0, 0.8, 0.005, 0.2, 'detik')}<div class="vout" id="wgO"></div>`,
    init(el) {
      const W = 340, X = t => 30 + t / .8 * 300, Yp = p => 150 - p / 130 * 135, Yv = v => 235 - (v - 40) / 100 * 55, Ye = e => 290 - e * 30;
      const N = 240, ts = [...Array(N + 1)].map((_, i) => i / N * .8);
      const base = PH.map((p, i) => `<rect x="${X(p[0])}" y="10" width="${X(p[1]) - X(p[0])}" height="290" class="band${i % 2}"/>`).join('') +
        poly(ts.map(t => [X(t), Yp(ip(AO, t))]), 'ox nf') + poly(ts.map(t => [X(t), Yp(ip(LV, t))]), 'hl th nf') + poly(ts.map(t => [X(t), Yp(ip(LA, t))]), 'de nf') +
        poly(ts.map(t => [X(t), Yv(ip(VOL, t))]), 'mx th nf') + poly(ts.map(t => [X(t), Ye(ecg(t))]), 'nt nf') +
        Tx(X(.5), 46, 'Aorta', 'sm ox', 'start') + Tx(X(.3), 44, 'LV', 'sm hl', 'start') + Tx(34, 136, 'LA', 'sm de', 'start') + Tx(34, 172, 'Volume LV', 'sm mx', 'start') + Tx(34, 268, 'EKG', 'sm', 'start') +
        L(X(.1), 300, X(.1), 308, 'ax') + Tx(X(.1), 318, 'S1', 'sm') + L(X(.42), 300, X(.42), 308, 'ax') + Tx(X(.42), 318, 'S2', 'sm') + Tx(8, 18, '120', 'sm', 'start') + Tx(8, 152, '0', 'sm', 'start');
      const box = el.querySelector('#wgS'), out = el.querySelector('#wgO'), inp = el.querySelector('#wgT');
      const draw = () => { const t = +inp.value, ph = PH.find(p => t <= p[1]) || PH[6];
        box.innerHTML = S(W, 322, base + L(X(t), 10, X(t), 300, 'cur') + C(X(t), Yp(ip(LV, t)), 3.5, 'hl') + C(X(t), Yp(ip(AO, t)), 3, 'ox') + C(X(t), Yv(ip(VOL, t)), 3, 'mx'));
        el.querySelector('#wgTv').textContent = t.toFixed(2);
        const mo = ip(LA, t) >= ip(LV, t) - .5 && (t < .1 || t >= .5), ao = t >= .15 && t < .42;
        out.innerHTML = `<b>${ph[2]}</b><br>${ph[3]}<br><span class="chips"><i>LV ${ip(LV, t).toFixed(0)} mmHg</i><i>Aorta ${ip(AO, t).toFixed(0)} mmHg</i><i>LA ${ip(LA, t).toFixed(0)} mmHg</i><i>Volume ${ip(VOL, t).toFixed(0)} mL</i><i>Mitral ${mo ? 'terbuka' : 'tertutup'}</i><i>Katup aorta ${ao ? 'terbuka' : 'tertutup'}</i></span>`; };
      inp.oninput = draw; draw();
    }};
})();

/* ---------- PV loop interaktif ---------- */
VIZ.pvloop = {t: 'Simulasi loop tekanan-volume', c: 'Model elastansi sederhana (ESPVR linear, EDPVR eksponensial). Garis abu-abu = kondisi dasar. Untuk memahami arah perubahan, bukan nilai klinis.',
  h: () => `<div id="pvS"></div>${slider('pvE', 'Preload (EDV)', 80, 190, 5, 130, 'mL')}${slider('pvA', 'Afterload (Ea)', 0.8, 3.6, 0.1, 1.6, 'mmHg/mL')}${slider('pvC', 'Kontraktilitas (Ees)', 0.8, 4, 0.1, 2.5, 'mmHg/mL')}<div class="vout" id="pvO"></div><div class="btnrow"><button class="mini" data-p="130,1.6,2.5">Normal</button><button class="mini" data-p="170,2.4,1.0">Gagal sistolik</button><button class="mini" data-p="130,1.6,3.8">Inotropik</button><button class="mini" data-p="130,3.2,2.5">Afterload naik</button></div>`,
  init(el) {
    const V0 = 10, edp = v => 1.2 * (Math.exp(.02 * (v - V0)) - 1), X = v => 34 + v / 200 * 296, Y = p => 235 - p / 200 * 220;
    const calc = (edv, ea, ees) => { const esv = (ea * edv + ees * V0) / (ees + ea), pes = ees * (esv - V0); return {edv, esv, pes, sv: edv - esv, ef: (edv - esv) / edv * 100, ped: edp(edv), ea, ees}; };
    const loop = r => { const pts = [[r.edv, r.ped], [r.edv, r.pes * .72]]; for (let i = 1; i <= 20; i++) { const u = i / 20, v = r.edv - (r.edv - r.esv) * u; pts.push([v, r.pes * .72 + (r.pes - r.pes * .72) * u + r.pes * .13 * Math.sin(u * Math.PI)]); } pts.push([r.esv, edp(r.esv)]); for (let i = 1; i <= 12; i++) { const v = r.esv + (r.edv - r.esv) * i / 12; pts.push([v, edp(v)]); } return pts.map(p => [X(p[0]), Y(Math.min(p[1], 200))]); };
    const b0 = calc(130, 1.6, 2.5), $ = id => el.querySelector('#' + id);
    const draw = () => { const r = calc(+$('pvE').value, +$('pvA').value, +$('pvC').value);
      $('pvEv').textContent = r.edv; $('pvAv').textContent = r.ea.toFixed(1); $('pvCv').textContent = r.ees.toFixed(1);
      const ed = [...Array(40)].map((_, i) => { const v = V0 + i * 4.8; return [X(v), Y(Math.min(edp(v), 200))]; });
      $('pvS').innerHTML = S(340, 262, L(34, 235, 332, 235, 'ax') + L(34, 12, 34, 235, 'ax') + [50, 100, 150, 200].map(v => Tx(X(v), 249, v, 'sm') + Tx(28, Y(v) + 4, v, 'sm', 'end')).join('') + Tx(183, 260, 'Volume LV (mL)', 'sm') +
        poly(ed, 'de dsh nf') + L(X(V0), Y(0), X(V0 + 200 / r.ees), Y(200), 'ox dsh') + L(X(r.esv), Y(r.pes), X(r.edv), Y(0), 'mx dsh') +
        `<polygon points="${loop(b0).map(p => p.join(',')).join(' ')}" class="ghost"/>` + `<polygon points="${loop(r).map(p => p.join(',')).join(' ')}" class="loop"/>` +
        Tx(X(V0 + 190 / r.ees) - 4, Y(190) + 2, 'ESPVR', 'sm ox', 'end') + Tx(318, Y(edp(190)) - 6, 'EDPVR', 'sm de', 'end') + Tx(X(r.edv) - 4, Y(8), 'Ea', 'sm mx', 'end'));
      $('pvO').innerHTML = `<span class="chips"><i>SV ${r.sv.toFixed(0)} mL</i><i>EF ${r.ef.toFixed(0)}%</i><i>ESV ${r.esv.toFixed(0)} mL</i><i>Tekanan akhir sistol ${r.pes.toFixed(0)} mmHg</i><i>Tekanan akhir diastol ${r.ped.toFixed(0)} mmHg</i><i>Stroke work ≈ ${(r.sv * r.pes * .0133 / 100).toFixed(2)} J</i></span>`; };
    el.querySelectorAll('input').forEach(i => i.oninput = draw);
    el.querySelectorAll('button[data-p]').forEach(b => b.onclick = () => { const [a, c, d] = b.dataset.p.split(','); $('pvE').value = a; $('pvA').value = c; $('pvC').value = d; draw(); });
    draw();
  }};

VIZ.starling = {t: 'Kurva Frank-Starling', c: 'Pada preload yang sama, inotropik atau penurunan afterload menaikkan isi sekuncup; gagal jantung mendatarkan kurva sehingga tambahan cairan hanya menaikkan tekanan pengisian.', h: () => S(340, 220,
  L(40, 190, 325, 190, 'ax') + L(40, 15, 40, 190, 'ax') + Tx(182, 210, 'Preload (tekanan/volume akhir diastol)', 'sm') + Tx(14, 100, 'SV', 'sm') +
  P('M45 185 C90 90 160 45 320 35', 'ox th nf') + Tx(322, 28, 'Inotropik / afterload turun', 'sm ox', 'end') +
  P('M45 187 C100 120 170 85 320 75', 'nt th nf') + Tx(322, 92, 'Normal', 'sm', 'end') +
  P('M45 189 C110 160 190 145 320 142', 'de th nf') + Tx(322, 160, 'Gagal jantung', 'sm de', 'end') +
  L(230, 190, 230, 40, 'dsh ax') + Tx(232, 182, 'kongesti →', 'sm', 'start'))};

VIZ.spirogram = {t: 'Volume dan kapasitas paru', c: 'Nilai perkiraan dewasa. RV, dan karenanya FRC serta TLC, tidak dapat diukur dengan spirometri biasa.', h: () => { const Y = v => 200 - v / 6 * 180; let d = 'M20 ' + Y(2.65); for (let x = 20; x <= 110; x += 2) d += ` L${x} ${Y(2.65 + .25 * Math.sin((x - 20) / 7))}`; d += ` C118 ${Y(3)} 122 ${Y(6)} 132 ${Y(6)} C142 ${Y(6)} 148 ${Y(1.2)} 160 ${Y(1.2)} C168 ${Y(1.2)} 170 ${Y(2.4)} 176 ${Y(2.65)}`; for (let x = 176; x <= 200; x += 2) d += ` L${x} ${Y(2.65 + .25 * Math.sin((x - 176) / 7))}`;
  const br = (x, a, b, s, cls) => L(x, Y(a), x, Y(b), cls + ' th') + L(x - 4, Y(a), x + 4, Y(a), cls) + L(x - 4, Y(b), x + 4, Y(b), cls) + Tx(x + 6, (Y(a) + Y(b)) / 2 + 4, s, 'sm ' + cls, 'start');
  return S(380, 215, [0, 1.2, 2.4, 2.9, 6].map(v => L(20, Y(v), 372, Y(v), 'grid')).join('') + P(d, 'hl th nf') +
    br(222, 2.9, 6, 'IRV 3,1', 'de') + br(222, 2.4, 2.9, 'TV 0,5', 'ox') + br(222, 1.2, 2.4, 'ERV 1,2', 'mx') + br(222, 0, 1.2, 'RV 1,2', 'nt') +
    br(268, 1.2, 6, 'VC 4,8', 'de') + br(304, 0, 2.4, 'FRC 2,4', 'mx') + br(342, 0, 6, 'TLC', 'ox') + Tx(60, 212, 'liter', 'sm')); }};

VIZ.odc = {t: 'Kurva disosiasi oksihemoglobin interaktif', c: 'Persamaan Hill (n = 2,7) dengan koreksi Kelman untuk pH, suhu, dan PaCO2. Garis abu-abu = kondisi baku (P50 sekitar 26,6 mmHg).',
  h: () => `<div id="odS"></div>${slider('odP', 'pH', 7.0, 7.7, 0.01, 7.4)}${slider('odT', 'Suhu', 18, 41, 0.5, 37, '°C')}${slider('odC', 'PaCO2', 20, 80, 1, 40, 'mmHg')}<div class="vout" id="odO"></div>`,
  init(el) { const $ = id => el.querySelector('#' + id), X = p => 36 + p / 100 * 294, Y = s => 200 - s * 180, cur = p50 => [...Array(51)].map((_, i) => { const p = i * 2; return [X(p), Y(p ** 2.7 / (p50 ** 2.7 + p ** 2.7 || 1))]; });
    const draw = () => { const ph = +$('odP').value, T = +$('odT').value, co = +$('odC').value, p50 = 26.6 * 10 ** (.024 * (T - 37) + .4 * (7.4 - ph) + .06 * Math.log10(co / 40));
      $('odPv').textContent = ph.toFixed(2); $('odTv').textContent = T; $('odCv').textContent = co;
      const sat = p => p ** 2.7 / (p50 ** 2.7 + p ** 2.7) * 100;
      $('odS').innerHTML = S(340, 228, L(36, 200, 332, 200, 'ax') + L(36, 15, 36, 200, 'ax') + [20, 40, 60, 80, 100].map(v => Tx(X(v), 214, v, 'sm') + Tx(30, Y(v / 100) + 4, v, 'sm', 'end') + L(36, Y(v / 100), 332, Y(v / 100), 'grid')).join('') + Tx(184, 226, 'PO2 (mmHg)', 'sm') +
        poly(cur(26.6), 'ghostl nf') + poly(cur(p50), 'ox th nf') + L(X(p50), Y(.5), X(p50), 200, 'dsh ax') + C(X(p50), Y(.5), 3.5, 'ox') + Tx(X(p50) + 6, Y(.5) + 14, 'P50', 'sm ox', 'start'));
      $('odO').innerHTML = `<b>${p50 > 27.6 ? 'Bergeser ke KANAN: afinitas turun, pelepasan O2 ke jaringan lebih mudah' : p50 < 25.6 ? 'Bergeser ke KIRI: afinitas naik, pelepasan O2 ke jaringan lebih sulit' : 'Posisi baku'}</b><br><span class="chips"><i>P50 ${p50.toFixed(1)} mmHg</i><i>Saturasi pada PO2 40: ${sat(40).toFixed(0)}%</i><i>pada PO2 60: ${sat(60).toFixed(0)}%</i><i>pada PO2 100: ${sat(100).toFixed(0)}%</i></span>`; };
    el.querySelectorAll('input').forEach(i => i.oninput = draw); draw(); }};

VIZ.coag = {t: 'Kaskade koagulasi dan titik kerja obat', c: 'aPTT menilai jalur intrinsik + bersama; PT/INR menilai jalur ekstrinsik + bersama.', h: () => S(340, 300,
  Tx(80, 16, 'Intrinsik (aPTT)', 'de') + Tx(260, 16, 'Ekstrinsik (PT)', 'ox') +
  B(40, 24, 80, 24, 'XII → XIIa', 'de') + Ar(80, 48, 80, 58, 'de') + B(40, 58, 80, 24, 'XI → XIa', 'de') + Ar(80, 82, 80, 92, 'de') + B(30, 92, 100, 28, 'IX → IXa + VIIIa', 'de') +
  B(205, 58, 110, 28, 'Faktor jaringan|+ VIIa', 'ox') + Ar(100, 120, 150, 142, 'de') + Ar(250, 86, 195, 142, 'ox') +
  B(115, 142, 110, 28, 'X → Xa + Va', 'mx') + Ar(170, 170, 170, 184, 'mx') + B(95, 184, 150, 28, 'Protrombin (II) → Trombin', 'mx') + Ar(170, 212, 170, 226, 'mx') +
  B(95, 226, 150, 28, 'Fibrinogen → Fibrin', 'mx') + Ar(170, 254, 170, 266, 'mx') + B(85, 266, 170, 26, 'Ikatan silang (XIIIa)', 'mx') +
  Tx(288, 150, 'Rivaroksaban,|apiksaban → Xa', 'sm hl') + Tx(292, 194, 'Dabigatran,|bivalirudin → IIa', 'sm hl') + Tx(48, 160, 'Heparin +|antitrombin|→ IIa, Xa', 'sm hl') + Tx(46, 226, 'Warfarin →|II, VII, IX, X', 'sm hl'))};

VIZ.cpb = {t: 'Sirkuit cardiopulmonary bypass', c: 'Biru = darah vena, merah = darah teroksigenasi. Urutan mulai: heparin, ACT tercapai, kanulasi arteri lalu vena.', h: () => S(340, 330,
  B(105, 8, 130, 44, 'PASIEN|RA/vena kava · aorta', 'hl') +
  P('M115 52 L115 96', 'de th ar') + Tx(64, 72, 'kanula vena|(gravitasi)', 'sm de') +
  B(60, 96, 110, 40, 'Reservoir vena|+ kardiotomi', 'de') + Ar(115, 136, 115, 158, 'de') +
  B(60, 158, 110, 34, 'Pompa utama', '') + Tx(115, 204, 'roller / sentrifugal', 'sm') + Ar(115, 210, 115, 226, 'de') +
  B(40, 226, 150, 40, 'Penukar panas|+ oksigenator membran', 'mx') + Tx(22, 290, 'gas: O2 + udara|(FiO2, sweep)', 'sm', 'start') + Ar(60, 280, 78, 266, '') +
  P('M190 246 L250 246 L250 200', 'ox th ar') + B(205, 166, 100, 34, 'Filter arteri|+ perangkap udara', 'ox') + P('M255 166 L255 60 L235 40', 'ox th ar') + Tx(230, 110, 'kanula|arteri', 'sm ox') +
  P('M105 30 L30 30 L30 110 L60 110', 'de dsh ar') + Tx(34, 22, 'sucker + vent', 'sm de', 'start') +
  P('M170 256 L170 300 L300 300 L300 40 L235 22', 'mx dsh ar') + Tx(232, 316, 'kardioplegia (anterograd / retrograd)', 'sm mx'))};

VIZ.iabp = {t: 'Gelombang tekanan arteri dengan IABP (rasio 1:2)', c: 'Balon mengembang pada takik dikrotik dan mengempis tepat sebelum sistol berikutnya.', h: () => S(340, 200,
  L(20, 180, 330, 180, 'ax') +
  P('M20 150 C30 150 36 70 52 70 C66 70 70 110 80 118 L86 112 C100 116 120 140 140 150', 'nt th nf') +
  P('M140 150 C150 150 156 70 172 70 C186 70 190 110 200 118 C206 60 218 40 226 40 C240 40 244 120 262 162', 'ox th nf') +
  P('M262 162 C272 162 278 82 294 82 C306 82 312 120 330 140', 'de th nf') +
  Tx(52, 60, 'sistol tanpa bantuan', 'sm') + Tx(226, 30, 'augmentasi diastolik', 'sm ox') + Tx(246, 176, 'akhir diastol berbantuan ↓', 'sm de') + Tx(336, 72, 'sistol berbantuan ↓', 'sm de', 'end') + Tx(200, 132, 'inflasi', 'sm hl') + Tx(270, 150, 'deflasi', 'sm hl', 'start'))};

VIZ.mvo2 = {t: 'Konsumsi oksigen miokard pada berbagai keadaan', c: 'mL O2 per 100 g per menit (nilai perkiraan). Henti listrik-mekanik memberi penghematan terbesar.', h: () => { const d = [['Bekerja, normotermia', 9, 'ox'], ['Kosong berdenyut (CPB)', 4.5, 'mx'], ['Henti, 37 °C', 1, 'de'], ['Henti, hipotermia', .3, 'hl']]; return S(340, 150, d.map((r, i) => Tx(8, 26 + i * 34, r[0], 'sm', 'start') + `<rect x="150" y="${14 + i * 34}" width="${r[1] / 9 * 160}" height="18" rx="4" class="bar ${r[2]}"/>` + Tx(156 + r[1] / 9 * 160, 28 + i * 34, String(r[1]).replace('.', ','), 'sm', 'start')).join('')); }};
