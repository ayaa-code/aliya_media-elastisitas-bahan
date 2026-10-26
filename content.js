export const EBOOK='https://repositori.kemendikdasmen.go.id/22205/1/XI_Fisika_KD-3.2-_Final.pdf';
export const topics=[
 {title:'Benda elastis dan plastis',tag:'01 · Kenali sifat bahan',visual:'elastic',
  paragraphs:['Benda elastis dapat kembali ke bentuk dan ukuran awal setelah gaya dihilangkan, selama batas elastisnya belum terlampaui. Pegas logam dan karet gelang merupakan contoh yang dekat dengan keseharian.',
  'Benda plastis mengalami perubahan bentuk permanen. Clay atau plastisin yang ditekan tidak kembali sendiri seperti semula. Pada papan eksperimenmu, clay berfungsi sebagai beban; pegaslah yang sedang kita pelajari.'],
  takeaway:'Berubah bentuk belum tentu plastis. Perhatikan apa yang terjadi setelah gaya dilepaskan.',
  query:'benda elastis plastis fisika kelas 11',pages:'hlm. 7–9, 12'},
 {title:'Pertambahan panjang pegas',tag:'02 · Amati perubahan',visual:'load',
  paragraphs:['Catat panjang awal pegas tanpa beban, L₀. Gantungkan beban, tunggu hingga pegas diam, lalu ukur panjang akhirnya, L. Pertambahan panjang adalah Δx = L − L₀; bukan panjang akhir pegas.',
  'Saat beban diam pada pegas vertikal, besar gaya pegas sama dengan berat beban: kΔx = mg. Untuk pegas yang sama dalam daerah linear, massa dua kali lebih besar menghasilkan pertambahan panjang dua kali lebih besar. Dalam contoh kita gunakan g = 10 m/s².'],
  formula:'Δx = L − L₀',example:'Panjang awal 10 cm, panjang akhir 14 cm → Δx = 4 cm = 0,04 m.',
  takeaway:'Bandingkan pegas yang sama, tunggu hingga diam, dan ukur dari titik acuan yang tetap.',
  query:'percobaan hukum Hooke pertambahan panjang pegas',pages:'hlm. 18–19'},
 {title:'Hukum Hooke',tag:'03 · Hubungkan gaya dan panjang',visual:'graph',
  paragraphs:['Dalam daerah linear pegas, besar gaya sebanding dengan besar perubahan panjangnya. Hubungan ini dinyatakan dengan F = kΔx. Satuan F adalah newton (N), k adalah newton per meter (N/m), dan Δx adalah meter (m).',
  'Grafik gaya F pada sumbu vertikal dan perubahan panjang Δx pada sumbu horizontal berbentuk garis lurus melalui titik asal untuk pegas ideal. Kemiringan grafik adalah k. Gaya pemulih pegas berlawanan arah dengan simpangan; bentuk bertandanya adalah Fₚ = −kx.'],
  formula:'F = kΔx',example:'k = 100 N/m dan Δx = 0,04 m → F = 4 N.',
  takeaway:'Gunakan besar gaya untuk perhitungan F = kΔx. Jangan lupa mengubah cm menjadi m.',
  query:'hukum Hooke F k delta x fisika kelas 11',pages:'hlm. 19–20'},
 {title:'Konstanta pegas',tag:'04 · Pilih kekakuan',visual:'stiffness',
  paragraphs:['Konstanta pegas k menyatakan kekakuan sebuah pegas. Pegas dengan k besar memerlukan gaya lebih besar untuk menghasilkan perubahan panjang yang sama.',
  'Jika gayanya sama, pegas lunak dengan k kecil memanjang lebih jauh. Jika pemampatannya sama, pegas kaku memberikan gaya lebih besar dan menyimpan energi lebih besar. Selalu perhatikan besaran mana yang dibuat tetap ketika membandingkan pegas.'],
  formula:'k = F / Δx',example:'Gaya sama 2 N: k = 50 N/m → Δx = 4 cm; k = 100 N/m → Δx = 2 cm.',
  takeaway:'k besar → lebih kaku. Besar k tidak ditentukan hanya dari gambar jumlah lilitan.',
  query:'konstanta pegas kekakuan pegas hukum Hooke',pages:'hlm. 19–20'},
 {title:'Batas elastis dan energi pegas',tag:'05 · Simpan energi, kenali batasnya',visual:'energy',
  paragraphs:['Jika batas elastis dilampaui, pegas dapat mengalami perubahan bentuk permanen. Batas berlakunya hubungan linear (batas proporsional) tidak selalu sama dengan batas elastis. Benda bisa tetap elastis walaupun hubungan gaya dan panjangnya tidak lagi linear.',
  'Pegas ideal yang ditarik atau dimampatkan menyimpan energi potensial elastis: Eₚ = ½k(Δx)². Satuannya joule (J). Untuk pegas yang sama, perubahan panjang dua kali lebih besar menyimpan energi empat kali lebih besar, selama masih dalam daerah linear.',
  'Pada pelontar pegas ideal, energi potensial dapat berubah menjadi energi gerak. Pada pemampatan dan massa yang sama, k lebih besar menghasilkan laju awal lebih besar. Pada k dan pemampatan yang sama, massa lebih besar menghasilkan laju awal lebih kecil. Game memakai konteks pegas sebagai petualangan; pemahaman konsep diperiksa melalui kuis.'],
  formula:'Eₚ = ½k(Δx)²',example:'k = 100 N/m, Δx = 0,10 m → Eₚ = 0,5 J.',
  takeaway:'Gunakan rumus energi dalam daerah linear pegas. Jangan menarik pegas fisik sampai rusak.',
  query:'energi potensial pegas batas elastis fisika kelas 11',pages:'hlm. 7, 22–23'}
];
export const questions=[
 {title:'Benda elastis',prompt:'Perhatikan perubahan bentuk pegas pada visual. Setelah gaya tarik dilepaskan, pegas kembali ke panjang semula. Sifat benda tersebut adalah …',options:['Plastis karena bentuknya berubah','Elastis karena kembali ke bentuk semula','Rapuh karena ditarik','Kaku karena tidak bergerak','Permanen karena mendapat gaya'],answer:1,explanation:'Benda elastis dapat kembali ke bentuk atau ukuran semula setelah gaya dihilangkan.'},
 {title:'Pengaruh beban',prompt:'Pada visual terdapat tiga pegas identik. Pegas ketiga diberi beban paling besar dan memanjang paling jauh. Mengapa hal itu terjadi?',options:['Gaya gravitasi pada pegas ketiga nol','Pegas ketiga tidak mendapat gaya','Beban pada pegas ketiga paling besar','Pegas ketiga paling pendek sejak awal','Semua pegas memiliki pertambahan panjang sama'],answer:2,explanation:'Beban yang lebih besar memberikan gaya berat lebih besar sehingga pegas memanjang lebih jauh, selama masih berada dalam batas elastis.'},
 {title:'Konstanta pegas',prompt:'Tiga pegas mendapat beban yang sama. Pegas A memanjang 2 cm, pegas B memanjang 5 cm, dan pegas C memanjang 8 cm. Pegas manakah yang memiliki konstanta pegas paling besar?',options:['Pegas A','Pegas B','Pegas C','Pegas A dan B','Ketiganya sama'],answer:0,explanation:'Untuk gaya yang sama, pegas yang paling sedikit memanjang adalah pegas yang paling kaku dan memiliki konstanta pegas terbesar.'},
 {title:'Batas elastis',prompt:'Pegas ditarik terlalu jauh. Setelah gaya dilepaskan, panjang pegas tidak kembali seperti semula. Apa yang paling mungkin terjadi?',options:['Pegas menjadi lebih elastis','Pegas tidak mengalami perubahan','Pegas melewati batas elastis dan berubah permanen','Gaya gravitasi hilang','Massa benda menjadi nol'],answer:2,explanation:'Pegas yang melewati batas elastis dapat mengalami perubahan bentuk permanen.'},
 {title:'Energi potensial pegas',prompt:'Tiga pelontar memakai pegas yang sama. Pegas A ditekan 2 cm, pegas B 4 cm, dan pegas C 6 cm. Pelontar manakah yang menyimpan energi potensial pegas paling besar?',options:['Pelontar A','Pelontar B','Pelontar C','Semua sama','Tidak dapat ditentukan'],answer:2,explanation:'Semakin besar perubahan panjang pegas, semakin besar energi potensial elastis yang tersimpan.'}
];
export const outcomeText={success:['Tepat di target!','Kombinasi massa, kekakuan, dan pemampatanmu membawa Bouncie ke platform.'],short:['Hampir sampai!','Jarak lompatan masih kurang. Dengan massa dan k yang sama, pemampatan lebih besar menyimpan lebih banyak energi.'],over:['Sedikit terlalu jauh!','Bouncie melewati target. Dengan massa dan k yang sama, kurangi pemampatan untuk mengurangi energi lompatan.'],limit:['Kenali batas pegas','Pemampatan melebihi batas model. Peluncuran dibatalkan; Hukum Hooke linear tidak dipakai untuk menghitung gerak di luar batas ini.']};
