# Pengujian Stretch & Measure

26 Oktober 2026.

## Otomatis

- 5 pengujian inti lulus: penguncian jawaban, skor lima jawaban benar, pemulihan feedback/kuis, serta poin koleksi yang tidak membuat skor negatif.
- Pemeriksaan sintaks JavaScript lulus.
- 15 pemeriksaan browser Microsoft Edge lulus pada revisi game trampolin, tanpa JavaScript error pada alur yang diperiksa.
- Alur baru memeriksa registrasi, dua kartu dashboard, responsivitas, kontrol klik dan keyboard, bintang yang menjeda game, popup A–E, placeholder gambar, umpan balik +20, Escape yang tidak menutup popup wajib, dan kembali ke arena setelah Continue.
- Dashboard diuji tanpa overflow horizontal pada 320, 375, 768, 1024, 1440 px. Materi diuji pada 375 px, game pada 320 dan 375 px.
- Pengujian tambahan terdahulu untuk audio/video tetap relevan pada bagian materi. Integrasi audio serta error video diuji dengan stub untuk mengisolasi perilaku aplikasi, bukan membuktikan keluaran suara fisik.
- Deployment produksi merespons HTTP 200 tanpa login Vercel. Rangkaian 42 pemeriksaan juga lulus pada deployment pertama; patch video akhir diverifikasi lagi secara lokal sebelum deployment berikutnya.

## Keterbatasan

- Belum merupakan audit WCAG penuh atau uji pengguna bersama siswa berkebutuhan akses beragam.
- Belum diuji langsung di iPhone/iPad fisik atau Safari iOS. Responsivitas browser desktop dan emulasi bukan jaminan kesamaan semua perangkat.
- Ketersediaan suara Indonesia, jeda/lanjut narasi, dan kualitas pelafalan bergantung mesin suara perangkat.
- Metadata dan dukungan embed tiga video telah diverifikasi melalui oEmbed YouTube. Ketersediaan video dapat berubah dan pemutaran penuh pada semua perangkat belum diuji. Kesalahan runtime menampilkan tautan langsung sebagai cadangan.
- Ilustrasi soal masih placeholder sesuai permintaan pengguna.
- Login dan nilai bersifat lokal; bukan sistem penilaian server.
- Game trampolin adalah konteks bermain, bukan simulasi mekanika trampolin atau model peluncur pegas numerik.
- Telaah guru/dosen terhadap media, redaksi soal, dan tujuan pembelajaran tetap diperlukan sebelum dipakai dalam kelas.
