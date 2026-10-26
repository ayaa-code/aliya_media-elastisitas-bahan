# Stretch & Measure

Explore, Stretch, and Learn.

## Versi perjalanan bergulir

Mesin game aktif berada di journey.js: dunia 9.000 unit dengan lima bagian tersambung, kamera mengikuti pada x layar 350/960, rintangan batang kayu/batu, platform bergerak, pegas bantu, dan finish tunggal. Pengejar ungu berjalan mendekat; tertangkap −10 Adventure Points, jatuh/terbentur −5. Perlindungan sesudah respawn mencegah penalti berulang. Relaxed Mode tersedia sebelum mulai dan melalui Pause. Latar 3D buatan AI terpisah dari awan, pengunjung langit, pepohonan dekat, platform, karakter, dan pengejar SVG bergradasi.

Learning Score kini khusus kuis (0–100). Adventure Points terpisah: rintangan +5 dan level +25, masing-masing hanya sekali. Progres versi 4 menyimpan checkpoint koordinat, jawaban, klaim bonus, mode dan poin; data lama dimigrasikan dengan jawaban dipertahankan. Pause menghentikan waktu dunia dan pengejar. Uji terbaru: scripts/journey-check.cjs dan scripts/chaser-check.cjs. Bagian di bawah menjelaskan evolusi awal game; mekanik skor terbaru mengikuti bagian ini.

Media Fisika SMA XI tentang elastisitas bahan dan pegas. Akun demo, Learning Library dengan lima submateri/audio/video, dan permainan Bouncie’s Spring Trail.

## Jalankan

Gunakan Node.js modern lalu jalankan npm run dev. Buka http://127.0.0.1:5180. Daftarkan akun demo melalui Create account. Gunakan email contoh dan kata sandi khusus demo.

## Bouncie’s Spring Trail

Bouncie di game kini memakai sprite transparan bergaya 3D berdasarkan desain yang disetujui: 12 pose dalam atlas WebP sekitar 301 KiB. Tangan dan kaki berganti pose pada siklus berjalan empat frame; ada pose kedip, naik, turun, mendarat, senang, dan kaget. Ini animasi sprite, bukan model 3D real-time. Rincian frame, titik pijak, proses aset, dan prompt ada di docs/BOUNCIE-ASSETS.md.

Bouncie perempuan berambut cokelat dengan kuncir dan ikat rambut kuning, kaus turquoise bergambar pegas, celana kuning, dan sepatu. Tahan A/D atau ←/→ untuk bergerak; Space, W, ↑, atau tombol Jump untuk melompat. Tombol sentuh dapat ditahan sambil menekan Jump.

Lima level: First Steps, Little Leap, Springy Path, Careful Bounce, dan Final Trail. Platform rumput, celah pendek, rintangan balok, serta platform bergerak lambat di level akhir. Tidak ada double jump atau batas waktu.

Setiap level memiliki tepat satu bintang kuis. Menyentuh bintang menjeda arena dan membuka soal A–E. Jawaban hanya sekali: benar +20, salah +0, dilanjutkan pembahasan. Continue Journey mengembalikan pemain ke pijakan aman. Capai bendera finish untuk beralih level. Jawaban kelima belum mengakhiri permainan sampai finish terakhir tercapai.

Jatuh atau terkena rintangan mengembalikan Bouncie ke checkpoint dan mengurangi maksimal 5 poin yang tersedia. Skor permainan tidak negatif. Jumlah jawaban benar ditampilkan terpisah dari skor permainan sehingga hasil konsep tetap terlihat. Checkpoint, level, jawaban, dan skor tersimpan per akun. Reset memerlukan konfirmasi.

## Materi dan aksesibilitas

Lima materi: benda elastis/plastis, pengaruh beban pada panjang pegas, Hukum Hooke, konstanta pegas, batas elastis dan energi potensial. Game adalah konteks bermain; konsep fisika dievaluasi melalui lima Star Challenge. Gambar soal masih placeholder sesuai permintaan.

Narasi mendukung putar/jeda/lanjut/stop dan kecepatan. Ketersediaan suara Indonesia bergantung perangkat. Video YouTube dimuat atas permintaan dengan tautan cadangan. E-book resmi: https://repositori.kemendikdasmen.go.id/22205/1/XI_Fisika_KD-3.2-_Final.pdf

Kontras tinggi, teks besar, dan Reduce motion tersedia. Kamera/mikrofon tidak dipakai. Belum diuji pada iPhone fisik atau bersama peserta didik; telaah guru/dosen tetap diperlukan.

## Penyimpanan

Akun demo lokal memakai PBKDF2-SHA256 dan salt acak. Ini bukan login sekolah berbasis server. Akun/progres hanya pada browser dan origin yang sama. Nilai lokal dapat dimodifikasi melalui alat pengembang. Sesi Remember me memakai localStorage, sesi lainnya sessionStorage. Jika penyimpanan ditolak, aplikasi menggunakan memori dan memberi pemberitahuan.

## Pengujian

npm test menjalankan uji status, skor, dan penguncian kuis. npm run check memeriksa sintaks. Pengujian browser terbaru: node scripts/trail-check.cjs (memerlukan Playwright melalui PLAYWRIGHT_MODULE dan Edge, server lokal aktif). Skrip browser-check.cjs dan access-check.cjs menyimpan pemeriksaan versi permainan lama.

## Publikasi

Repository: https://github.com/ayaa-code/aliya_media-elastisitas-bahan

Situs: https://stretch-measure.vercel.app

Deploy langsung dari direktori stretch-measure: npx vercel --prod. Penyambungan otomatis GitHub–Vercel masih memerlukan izin repository pada akun Vercel. Buildless static website, output direktori titik, tanpa backend.

## Sumber

Nasukha Z. (2020), Elastisitas Bahan: Fisika Kelas XI, Direktorat SMA Kemendikbud; halaman 7–9, 12, 18–20, 22–23. Modul menggunakan KD; penempatan Kurikulum Merdeka mengikuti ATP sekolah. Pertanyaan merupakan adaptasi konsep, bukan klaim salinan nomor soal modul.

Video: Fadilla Ramadhani (5Hq3EGzkKds), Iqbal Noviansyah (iydokKuQb4E), Toto Study (fWCmPv9gX2U). Metadata diperiksa 26 Oktober 2026, ketersediaan dapat berubah.

SVG dan karakter dibuat untuk proyek ini. Font Nunito dari Google Fonts dengan fallback sistem. Proyek dikembangkan dengan bantuan AI; nyatakan penggunaannya sesuai ketentuan tugas.

