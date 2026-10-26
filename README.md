# Stretch & Measure

Explore, Stretch, and Learn.

Media Fisika SMA XI: elastisitas bahan dan pegas. Antarmuka pastel dengan Bouncie bergaya 3D, Learning Library, serta petualangan platform Bouncie’s Spring Trail.

## Jalankan

Gunakan Node.js modern, jalankan npm run dev, kemudian buka http://127.0.0.1:5180. Daftarkan akun demo melalui Create account. Gunakan email contoh dan kata sandi khusus demo. Tidak perlu instalasi dependensi aplikasi. Membuka langsung melalui file:// tidak didukung.

## Desain dan akses belajar

Login, registrasi, dashboard dan game memakai identitas Bouncie yang konsisten. Dashboard memiliki tepat dua kartu: Learn & Explore dan Bouncie’s Spring Trail. Ilustrasi buku/gamepad 3D menggantikan emoji standar. Password memakai tombol mata dengan label aksesibel.

Bouncie menyapa dengan empat frame melambai dan bubble nama siswa, sekali saat dashboard dibuka. Sapa Bouncie memutar ulang. Kurangi gerak atau preferensi perangkat membuat sapaan statis. Pergantian halaman membuang loop sambutan.

Nyaman untukmu menyediakan ukuran teks normal/besar/sangat besar, spasi baca, kontras tinggi, kurangi gerak, panduan fokus paragraf, bahasa UI Indonesia/English, panduan keyboard dan reset preferensi. Preferensi bertahan setelah refresh, terpisah dari akun dan progres. Materi, diagram dan soal tetap berbahasa Indonesia; bagian ilmiah diberi atribut bahasa.

## Materi dan soal

Lima topik: benda elastis/plastis, pengaruh beban, Hukum Hooke, konstanta pegas, batas elastis dan energi potensial. Narasi mendukung putar/jeda/lanjut/stop serta kecepatan. Suara Indonesia bergantung perangkat. Video YouTube dimuat atas permintaan dengan tautan cadangan.

Lima Star Challenge kini memiliki gambar: satu cuplikan diagram pembebanan pegas dari hlm. 18 e-book dan empat SVG adaptasi konsep/data soal. Gambar dapat diperbesar dalam dialog terpisah. Escape menutup pembesaran tanpa menutup soal. Sumber, halaman dan alasan adaptasi tercatat di docs/SUMBER-ILUSTRASI-SOAL.md.

Modul resmi 2020 menggunakan KD, bukan buku CP Kurikulum Merdeka terbaru; penempatan pembelajaran mengikuti ATP sekolah. Materi dan instrumen tetap memerlukan telaah guru/dosen.

## Game

Dunia 9.000 unit, lima bagian tersambung, kamera pengikut, celah, batang kayu/batu, platform bergerak, pegas bantu, checkpoint dan finish tunggal. Tidak ada pengejar ungu atau mode pengejar.

Tahan A/D atau ←/→ untuk bergerak, Space/W/↑ untuk lompat. Tombol arah dan Jump bisa disentuh bersamaan. Tidak ada double jump dan tidak ada batas waktu kuis.

Satu bintang per level membuka soal A–E. Jawaban hanya sekali dan langsung disimpan. Pembahasan diikuti Continue Journey. Semua waktu dunia berhenti saat dialog terbuka atau tab tersembunyi. Finish terakhir diperlukan untuk menyelesaikan petualangan.

Learning Score: benar +20, salah +0, maksimum 100. Tidak dikurangi karena jatuh. Adventure Points: rintangan pertama kali +5, level +25, jatuh/terbentur −5, minimum 0. Klaim bonus tersimpan agar tidak berulang saat respawn atau refresh.

## Akun dan progres

Akun demo menggunakan digest PBKDF2-SHA256 dengan salt acak. Akun, progres dan nilai berada pada browser/origin yang sama; localhost berbeda dari domain Vercel. Nilai lokal dapat diedit melalui alat pengembang, sehingga bukan penilaian server. Remember me memakai localStorage, sesi lainnya sessionStorage.

Progres menyimpan level, checkpoint koordinat, jawaban dan Adventure Points. Data lama yang kompatibel dipulihkan dengan jawaban dipertahankan; mode pengejar lama tidak dibaca. Reset game meminta konfirmasi dan hanya memengaruhi akun aktif. Reset preferensi tidak menghapus akun atau game.

## Pengujian

npm test: status, penguncian jawaban, pemulihan progres dan pemisahan skor.
npm run check: sintaks semua modul aktif.

Browser: scripts/redesign-check.cjs dan scripts/journey-check.cjs memakai Playwright/Edge melalui PLAYWRIGHT_MODULE, dengan server lokal aktif. Skrip pemeriksaan versi lama bukan acuan game saat ini. Laporan cakupan ada pada docs/PENGUJIAN.md.

## Publikasi

Repository: https://github.com/ayaa-code/aliya_media-elastisitas-bahan
Situs: https://stretch-measure.vercel.app

Deploy langsung dari direktori stretch-measure: npx vercel --prod. Proyek statis tanpa build command/backend. Output direktori titik. Pengaitan otomatis GitHub ke Vercel masih memerlukan izin repository pada akun Vercel.

## Sumber dan aset

Direktorat SMA, Kemendikbud (2020), Modul Fisika XI KD 3.2: Elastisitas Bahan, hlm. 7–9, 12, 18–20, 22–23. E-book: https://repositori.kemendikdasmen.go.id/22205/1/XI_Fisika_KD-3.2-_Final.pdf

Video: Fadilla Ramadhani (5Hq3EGzkKds), Iqbal Noviansyah (iydokKuQb4E), Toto Study (fWCmPv9gX2U). Metadata diperiksa 26 Oktober 2026; ketersediaan bisa berubah.

Aset AI dan prompt: docs/REDESIGN.md, docs/BOUNCIE-ASSETS.md, docs/JOURNEY-ASSETS.md. Font Nunito via Google Fonts dengan fallback sistem. Kamera dan mikrofon tidak dipakai. Pengembangan dibantu AI; pengguna perlu menyatakan pemanfaatannya sesuai ketentuan tugas.

