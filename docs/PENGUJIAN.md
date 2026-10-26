# Pengujian Stretch & Measure

26 Oktober 2026.

## Otomatis

- 8 pengujian inti lulus: perhitungan energi/jarak ideal, pengaruh massa dan k, penolakan parameter tidak sah, batas model, penguncian jawaban, skor 100, pemulihan feedback, urutan checkpoint.
- Pemeriksaan sintaks JavaScript lulus.
- 42 pemeriksaan browser Microsoft Edge lulus, tanpa JavaScript error pada alur yang diperiksa.
- Alur browser meliputi registrasi, login, logout, validasi, sambutan personal, tepat dua kartu, materi/audio/video cadangan, e-book, pengaturan akses, lima level dan checkpoint, refresh pada feedback, benar 100, salah tetap lanjut, batas model, dan konfirmasi reset.
- Dashboard diuji tanpa overflow horizontal pada 320, 375, 768, 1024, 1440 px. Materi diuji pada 375 px, game pada 320 dan 375 px.
- 13 pemeriksaan tambahan lulus: keyboard pada kartu/slider/checkpoint, penguncian fokus dialog, Escape pengaturan, animasi normal, audio putar/jeda/lanjut/stop/kecepatan, audio tidak didukung, error video dan retry. Integrasi audio serta error video diuji dengan stub untuk mengisolasi perilaku aplikasi, bukan membuktikan keluaran suara fisik.
- Pengujian utama browser menggunakan reduced motion agar hasil stabil. Animasi normal dan keyboard diperiksa pada rangkaian tambahan tersebut.
- Deployment produksi merespons HTTP 200 tanpa login Vercel. Rangkaian 42 pemeriksaan juga lulus pada deployment pertama; patch video akhir diverifikasi lagi secara lokal sebelum deployment berikutnya.

## Keterbatasan

- Belum merupakan audit WCAG penuh atau uji pengguna bersama siswa berkebutuhan akses beragam.
- Belum diuji langsung di iPhone/iPad fisik atau Safari iOS. Responsivitas browser desktop dan emulasi bukan jaminan kesamaan semua perangkat.
- Ketersediaan suara Indonesia, jeda/lanjut narasi, dan kualitas pelafalan bergantung mesin suara perangkat.
- Metadata dan dukungan embed tiga video telah diverifikasi melalui oEmbed YouTube. Ketersediaan video dapat berubah dan pemutaran penuh pada semua perangkat belum diuji. Kesalahan runtime menampilkan tautan langsung sebagai cadangan.
- Ilustrasi soal masih placeholder sesuai permintaan pengguna.
- Login dan nilai bersifat lokal; bukan sistem penilaian server.
- Model game ideal memiliki penyederhanaan yang dijelaskan dalam UI dan README.
- Telaah guru/dosen terhadap media, redaksi soal, dan tujuan pembelajaran tetap diperlukan sebelum dipakai dalam kelas.
