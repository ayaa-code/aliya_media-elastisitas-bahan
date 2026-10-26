# Stretch & Measure

Explore, Stretch, and Learn.

Media pembelajaran Fisika SMA kelas XI tentang elastisitas bahan pada pegas. Materi singkat dan narasi Bahasa Indonesia dilengkapi game orisinal **Trampoline Quest** bersama Bouncie, anak kecil ramah berkaus bergambar pegas.

## Menjalankan

Memerlukan Node.js versi modern, tanpa instalasi dependensi aplikasi.

```sh
npm run dev
```

Buka http://127.0.0.1:5180. Buat akun demo melalui **Create account**, lalu masuk. Gunakan email contoh dan kata sandi khusus demo. Membuka index.html langsung dengan file:// tidak didukung karena aplikasi menggunakan JavaScript modules dan Web Crypto.

## Alur dan fitur

- Login / registrasi lokal dengan nama, email, password, konfirmasi, Remember me, dan show/hide password.
- Dashboard berbahasa Inggris dengan tepat dua kartu: Learn & Explore dan Trampoline Quest.
- Lima submateri: benda elastis/plastis, pertambahan panjang, Hukum Hooke, konstanta pegas, serta batas elastis dan energi potensial.
- Narasi per submateri: putar, jeda, stop, kecepatan 0.75–1.5×. Ketersediaan suara Indonesia bergantung pada browser/perangkat.
- Video YouTube per topik dan e-book resmi Kemendikbud. Tiga video relevan diverifikasi melalui oEmbed YouTube dan digunakan pada lima submateri. Video hanya dimuat saat tombol dipilih, tanpa autoplay. Kesalahan pemutar menampilkan tautan cadangan.
- Game trampolin lima level: Bouncie memantul otomatis; siswa menggeser kiri/kanan dengan tombol, panah keyboard, atau A/D.
- Tangkap 🌀 pegas (+5), kartu rumus atau energi (+10); koleksi terlewat −5 dan skor tidak pernah kurang dari nol.
- Tangkap ⭐ bintang untuk menjeda arena dan membuka satu Star Challenge. Lima soal PG A–E dikunci setelah satu jawaban; benar +20, salah +0.
- Popup pembahasan dan tombol Lanjutkan; tidak ada navigasi ke soal sebelumnya.
- Penyimpanan progres per akun, termasuk popup yang belum dilanjutkan ketika refresh.
- Play Again dan Reset Progres memerlukan konfirmasi.
- Kontras tinggi, teks besar, kurangi gerak, dukungan prefers-reduced-motion, keyboard, dan target sentuh besar.
- Tidak memerlukan kamera atau mikrofon.

## Akun dan penyimpanan

Ini demonstrasi lokal, bukan autentikasi produksi. Akun dan progres hanya tersedia pada browser dan origin yang sama. Akun localhost tidak ikut berpindah ke domain Vercel. Password disimpan sebagai digest PBKDF2-SHA256 dengan salt acak (100.000 iterasi), bukan teks biasa. Progres klien tetap dapat dimodifikasi lewat alat pengembang; skor bukan hasil ujian yang diamankan server. Forgot Password menjelaskan batas layanan lokal dan tidak berpura-pura mengirim email.

Remember me memakai localStorage; jika tidak dicentang, sesi memakai sessionStorage. Bila penyimpanan dibatasi browser, aplikasi memberi pemberitahuan dan mempertahankan data di memori selama masih terbuka.

## Kaitan dengan fisika

Game ini bukan simulasi numerik peluncuran. Trampolin menjadi konteks permainan yang sederhana, sedangkan konsep fisika diuji melalui Star Challenge: benda elastis/plastis, pertambahan panjang akibat beban, Hukum Hooke F = kΔx, konstanta pegas, batas elastis, dan energi potensial Eₚ = ½kx². Ini mencegah mekanik game yang rumit menghalangi pemahaman konsep.

## Mengisi ilustrasi soal

Gambar lima soal sengaja belum dibuat, sesuai permintaan. Placeholder berada di popup Star Challenge dalam app.js, dengan teks “Visual soal akan ditambahkan.” Semua informasi yang diperlukan untuk menjawab tetap ditulis dalam soal. Tambahkan aset dan alt text yang menjelaskan data pada gambar saat ilustrasi sudah tersedia.

Kelima soal merupakan adaptasi konsep untuk game, bukan salinan verbatim lima nomor soal dari modul.

## Struktur

| File | Fungsi |
| --- | --- |
| index.html | Shell HTML dan dialog |
| styles.css | Desain responsif dan aksesibilitas |
| app.js | Navigasi, narasi, game, kuis, popup, dan hasil |
| content.js | Lima ringkasan materi dan lima soal |
| core.js | Mesin skor, status progres, dan penguncian jawaban |
| store.js | Akun demo, sesi, preferensi, progres |
| visuals.js | SVG orisinal Bouncie, diagram, dan dunia game |
| videos.js | Pemutar YouTube dengan tautan cadangan |
| scripts/serve.mjs | Server lokal |
| tests/core.test.js | Pengujian skor dan kunci progres |
| scripts/browser-check.cjs | Pengujian browser end-to-end |

## Verifikasi

```sh
npm test
npm run check
```

Pengujian browser membutuhkan Playwright dan Microsoft Edge. Atur PLAYWRIGHT_MODULE ke lokasi paket Playwright jika bukan dependensi lokal, lalu jalankan `node scripts/browser-check.cjs` setelah server aktif. TEST_URL dapat mengarahkan pengujian ke domain deployment. Screenshot dan laporan masuk artifacts/ (diabaikan Git).

Lihat docs/PENGUJIAN.md untuk cakupan dan batas pengujian.

## GitHub dan Vercel

Repository tujuan: https://github.com/ayaa-code/aliya_media-elastisitas-bahan

Website publik: https://stretch-measure.vercel.app

Deploy CLI sudah berhasil. Penyambungan otomatis GitHub ke Vercel ditolak oleh izin akun Vercel terhadap repository ini, sehingga push GitHub belum memicu deploy otomatis. Untuk mengaktifkannya, buka Project Settings → Git pada Vercel, hubungkan akun GitHub dengan akses ke repository tujuan, lalu pilih repository tersebut. Aplikasi publik tetap dapat digunakan melalui deployment langsung.

Untuk impor Vercel: pilih repository tersebut, Framework Preset **Other**, Root Directory `.`, tanpa build command, Output Directory `.`. Ini aplikasi statis tanpa server backend atau secret. vercel.json menyertakan header pembatas kamera/mikrofon dan pengaturan statis.

Jika memakai CLI yang sudah login:

```sh
npx vercel --prod
```

Deploy hanya direktori stretch-measure ini, bukan folder proyek lama di atasnya.

## Sumber dan kredit

Nas­ukha Z. (2020). *Elastisitas Bahan: Fisika Kelas XI*. Direktorat SMA, Kemendikbud. Pada halaman katalog repositori, penulis tercatat sebagai Nashuka. Ringkasan bersumber dari halaman 7–9, 12, 18–20, dan 22–23. https://repositori.kemendikdasmen.go.id/22205/

Modul 2020 menggunakan KD, bukan CP Kurikulum Merdeka. Kesesuaian penempatan di kelas mengikuti ATP sekolah; modul dipakai sebagai sumber konsep, bukan diklaim buku Kurikulum Merdeka terbaru.

Ilustrasi SVG, maskot, dan mekanik aplikasi dibuat khusus untuk proyek ini. Font Nunito melalui Google Fonts, dengan font sistem sebagai cadangan. Tautan YouTube memerlukan internet. Proyek dikembangkan dengan bantuan AI; pemilik tugas perlu menelaah dan menyatakan penggunaannya sesuai ketentuan UTS.

Video pendukung (metadata dan dukungan embed diverifikasi 26 Oktober 2026):
- Fadilla Ramadhani: https://www.youtube.com/watch?v=5Hq3EGzkKds
- Iqbal Noviansyah: https://www.youtube.com/watch?v=iydokKuQb4E
- Toto Study: https://www.youtube.com/watch?v=fWCmPv9gX2U
