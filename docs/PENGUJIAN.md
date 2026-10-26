# Pengujian Stretch & Measure

Pembaruan 27 Oktober 2026: antarmuka pastel, sapaan Bouncie, akses belajar, gambar soal, dan penghapusan pengejar.

## Pemeriksaan yang dilakukan

- Lima uji inti lulus: satu jawaban per soal, skor kuis, syarat finish, pemulihan feedback/checkpoint dan pemisahan penalti Adventure Points.
- Pemeriksaan sintaks modul aktif lulus.
- Browser Edge: registrasi/login, ikon mata password, dua kartu dashboard dan aset 3D, frame melambai yang berubah serta bubble nama.
- Dashboard tanpa overflow pada lebar 320, 375, 768 dan 1440 px; ukuran sangat besar dan kontras tinggi diperiksa pada 320 px.
- Ukuran teks, spasi, kontras, reduce motion, bahasa, penyimpanan preferensi, reset preferensi dan panduan fokus paragraf diuji. Reset diperiksa lagi setelah refresh.
- Lima gambar soal termuat. Dialog pembesaran memakai Escape tanpa menutup kuis. Jawaban tetap terkunci setelah refresh.
- Jalur 9.000 unit dan kelima level berhasil dituntaskan dengan keyboard. Kamera, pause, checkpoint, lima kuis, sumber gambar, dua skor dan finish berfungsi; tidak ada pengejar atau penalti tangkapan.
- Tidak ada JavaScript error pada alur browser tersebut.
- Screenshot login, dashboard, ponsel dengan aksesibilitas, serta soal diperiksa visual. Halaman 18 e-book dirender dan cuplikan diagram pembebanan diperiksa.
- Warna ujung gradasi tombol utama/biru terhadap teks putih mempunyai rasio sekitar 5,15–6,86:1; ini pemeriksaan bagian tertentu, bukan audit kontras/WCAG menyeluruh.
- Multi-touch arah+lompat pernah diuji dengan simulasi Chrome DevTools Protocol pada mesin game yang sama; bukan uji ponsel fisik.

Skrip acuan: scripts/redesign-check.cjs, scripts/journey-check.cjs dan tests/core.test.js. Hasil screenshot berada pada artifacts/ yang tidak disertakan deployment.

## Batasan

Belum diuji pada iPhone/iPad fisik atau Safari iOS dan belum dilakukan uji pengguna bersama peserta didik berkebutuhan akses beragam. Tidak diklaim sebagai audit WCAG penuh.

Suara Indonesia dan jeda/lanjut narasi bergantung perangkat. Integrasi kontrol audio/video pernah diperiksa menggunakan stub; keluaran suara fisik dan pemutaran semua video di semua perangkat belum diverifikasi.

Login dan nilai bersifat lokal, bukan autentikasi atau penilaian server. Ilustrasi soal adalah satu cuplikan beratribusi dan empat adaptasi; jangan menganggap seluruh buku bebas lisensi. Kesesuaian materi, instrumen dan media masih memerlukan telaah dosen/guru.
