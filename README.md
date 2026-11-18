# BTKV Saku

Referensi belajar offline untuk **Bedah Toraks, Kardiak, dan Vaskular (BTKV)**, mengikuti struktur Buku Kurikulum PPDS-1 BTKV FKUI 2022, dengan tampilan bergaya referensi klinis (kerangka topik, ringkasan dan rekomendasi, grafik, rujukan).

- Toggle **Per modul / Per semester** (Semester I–X sesuai Tabel 6 kurikulum)
- Tab **Prosedur**: 92 tindakan bedah jantung dewasa, kongenital, toraks, dan vaskular dari daftar kompetensi kurikulum (Tabel 3 dan 4), lengkap dengan level kompetensi, kasus minimal, indikasi, persiapan, langkah operasi, jebakan, pascaoperasi, dan gambar
- Tab **Galeri**: gambar dari buku rujukan, per sumber, per topik, dan per prosedur (lihat bagian Galeri pribadi)
- 241 singkatan, masing-masing dengan kepanjangan dan **sumbernya** (halaman PDF buku rujukan, atau artikel asli dengan PMID/DOI)

- 34 topik dalam 6 modul: Ilmu Dasar, Jantung Dewasa, Perioperatif/ICU, Kongenital, Toraks, Vaskular
- Penanda high-yield (★ sampai ★★★) dan halaman ringkasan High-Yield
- 30 visualisasi (sebagian interaktif: diagram Wiggers, loop tekanan-volume, kurva disosiasi O₂, ABI)
- Kepanjangan singkatan otomatis pada kemunculan pertama; semua singkatan bisa diketuk
- Kuis pilihan ganda dengan pembahasan, flashcard, kalkulator klinis, penanda dan progres baca (tersimpan di HP)
- Berjalan sepenuhnya offline setelah dibuka sekali (PWA, Progressive Web App)

## Unggah ke GitHub Pages

1. Buat repository baru di GitHub, misalnya `btkv-saku` (Public).
2. Unggah **isi** folder ini (bukan foldernya) ke repository: *Add file → Upload files*, seret semua berkas dan folder, lalu *Commit changes*.
3. Buka *Settings → Pages*. Pada *Build and deployment*, pilih *Deploy from a branch*, branch `main`, folder `/ (root)`, lalu *Save*.
4. Tunggu 1-2 menit. Alamatnya: `https://<username>.github.io/btkv-saku/`.

## Pasang di iPhone

1. Buka alamat di atas dengan **Safari**, tunggu sampai halaman beranda bagian *Tentang* menampilkan "● Siap dipakai offline".
2. Ketuk tombol *Bagikan* → *Tambah ke Layar Utama*.
3. Buka dari ikon di layar utama. Setelah itu aplikasi bisa dipakai tanpa internet.

Di Android: buka dengan Chrome → menu ⋮ → *Instal aplikasi* / *Tambahkan ke layar utama*.

## Galeri pribadi (btkv-galeri.pack)

Gambar dari buku teks **tidak** disimpan di repo ini karena hak ciptanya milik penerbit dan repo GitHub Pages bersifat publik. Gambar dikemas dalam berkas terpisah `btkv-galeri.pack` yang hanya disimpan di perangkat Anda:

1. Kirim `btkv-galeri.pack` ke iPhone (AirDrop, iCloud Drive, atau aplikasi File).
2. Buka aplikasi BTKV Saku → tab **Galeri** → **Pilih berkas paket** → pilih berkas tersebut.
3. Setelah selesai, gambar muncul di Galeri dan di bagian Grafik/Gambar setiap topik dan prosedur, termasuk saat offline.

Jangan unggah berkas `.pack` ke GitHub (sudah dicegah oleh `.gitignore` bila memakai git).

## Memperbarui materi

Materi ada di `data/d1-dasar.js` sampai `data/d6-vaskular.js`, prosedur di `data/p1-jantung.js` sampai `data/p4-vaskular.js`, semester di `data/semester.js`, singkatan di `data/abbr.js` dan sumbernya di `data/abbr-src.js`. Setiap kali mengubah isi, **naikkan `VERSION` di `sw.js`** (misalnya `btkv-v2` → `btkv-v3`) agar HP mengunduh versi baru; tutup lalu buka lagi aplikasinya dua kali.

## Catatan

Isi disusun ulang dengan kalimat sendiri dari buku teks rujukan (tercantum di tiap topik) untuk belajar pribadi. Bukan pengganti buku teks, pedoman terbaru, maupun penilaian klinis.
