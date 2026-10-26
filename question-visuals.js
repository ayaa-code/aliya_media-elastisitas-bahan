export const questionVisuals=[
 {src:'./assets/questions/elastic.svg',alt:'Tiga tahap pegas: sebelum ditarik panjangnya 10 cm, saat ditarik 15 cm, sesudah dilepas 10 cm.',source:'Ilustrasi adaptasi konsep · Modul Elastisitas Bahan (2020), hlm. 8–9 dan 12.'},
 {src:'./assets/questions/load.webp',alt:'Pegas kiri tanpa beban, pegas tengah dengan satu beban dan pertambahan panjang x, pegas kanan dengan dua beban dan pertambahan panjang 2x.',source:'Cuplikan gambar pegas · Modul Elastisitas Bahan, Direktorat SMA (2020), hlm. 18.'},
 {src:'./assets/questions/stiffness.svg',alt:'Pegas A, B, dan C mendapat gaya yang sama. Pertambahan panjang A 2 cm, B 5 cm, C 8 cm.',source:'Ilustrasi adaptasi data soal · Modul Elastisitas Bahan (2020), hlm. 19–20.'},
 {src:'./assets/questions/limit.svg',alt:'Sebelum diberi gaya panjang pegas 10 cm; sesudah ditarik jauh dan dilepas panjangnya 14 cm.',source:'Ilustrasi adaptasi konsep · Modul Elastisitas Bahan (2020), hlm. 7 dan 12. Batas elastis berbeda dari batas linear.'},
 {src:'./assets/questions/energy.svg',alt:'Tiga pegas identik dipampatkan: A sebesar 2 cm, B 4 cm, C 6 cm. Semua pemampatan dalam daerah linear.',source:'Ilustrasi adaptasi data soal · Modul Elastisitas Bahan (2020), hlm. 22–23.'}
];
export function questionFigure(index){const v=questionVisuals[index];return `<figure class="question-figure"><img src="${v.src}" alt="${v.alt}"><figcaption>${v.source}</figcaption><button type="button" class="quiet" data-action="zoom-question" data-index="${index}">⤢ Perbesar gambar</button></figure>`;}
