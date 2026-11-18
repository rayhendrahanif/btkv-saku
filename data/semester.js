/* Pembagian semester menurut Tabel 6 "Materi Kurikulum", Buku Kurikulum PPDS-1 BTKV FKUI 2022.
   Kurikulum hanya mencantumkan nama modul per semester; penempatan topik ke modul adalah pemetaan aplikasi ini. */
window.SEMESTERS = [
  {n: 'I', tahap: 'Tahap MDU/MDK', mod: 'Filsafat ilmu, metodologi penelitian, biostatistik, quality & safety, EBM; Ilmu Bedah Dasar (biologi molekuler, farmakologi klinik, keterampilan bedah dasar)'},
  {n: 'II', tahap: 'Tahap BTKV Dasar', mod: 'Pengenalan Bedah Jantung Pediatrik, Bedah Jantung Dewasa, Bedah Toraks, Bedah Vaskular'},
  {n: 'III', tahap: 'Tahap Bedah Dasar', mod: 'Rotasi Bedah Ortopedi, Onkologi, Plastik, Urologi, Anak, Digestif (pendidikan bersama PPDS Ilmu Bedah)'},
  {n: 'IV', tahap: 'Tahap BTKV Madya', mod: 'Bedah Jantung Dewasa Pratama dan Madya (bedah, teknik, perioperatif)'},
  {n: 'V', tahap: 'Tahap BTKV Madya', mod: 'Bedah Jantung Pediatrik dan Kongenital Dasar; Kongenital Asianotik'},
  {n: 'VI', tahap: 'Tahap BTKV Madya', mod: 'Bedah Vaskular Dasar (vaskular perifer, trauma vaskular, akses dialisis); Bedah Toraks Dasar (dinding dada, paru, trauma)'},
  {n: 'VII', tahap: 'Tahap BTKV Madya', mod: 'Bedah Jantung Dewasa Paripurna I; Kongenital Sianotik'},
  {n: 'VIII', tahap: 'Tahap BTKV Utama', mod: 'Bedah Vaskular Lanjut (rekonstruksi dan endovaskular); Bedah Toraks Madya (mediastinum dan diafragma)'},
  {n: 'IX', tahap: 'Tahap BTKV Utama', mod: 'Bedah Jantung Pediatrik Kompleks (obstruktif, kompleks); Bedah Jantung Dewasa Paripurna II'},
  {n: 'X', tahap: 'Tahap BTKV Utama', mod: 'Bedah Toraks Lanjut (jalan napas dan esofagus); Mandiri; Proposal dan Tesis'}
];
/* semester (1-10) untuk tiap topik materi */
window.TOPIC_SEM = {
  'anat-jantung': [2], 'anat-koroner': [2], 'konduksi': [2], 'fis-siklus': [2], 'fis-co': [2], 'fis-respirasi': [2], 'hemostasis': [1, 2], 'cpb': [2, 4], 'proteksi-miokard': [4], 'protesa': [2, 4],
  'cabg': [4], 'katup-aorta': [4], 'katup-mitral': [4], 'aorta': [7], 'endokarditis': [7], 'komplikasi-mi': [9],
  'perio-praop': [4], 'perio-hemodinamik': [4], 'perio-perdarahan': [4], 'perio-aritmia': [4], 'perio-organ': [4],
  'kong-dasar': [2, 5], 'kong-asianotik': [5], 'kong-sianotik': [7], 'kong-univentrikel': [9],
  'tor-anatomi': [2, 6], 'tor-pleura': [6], 'tor-trauma': [3, 6], 'tor-kankerparu': [6], 'tor-mediastinum': [8, 10],
  'vas-pad': [2, 6], 'vas-ali': [6], 'vas-aneurisma': [8], 'vas-vena': [6]
};
