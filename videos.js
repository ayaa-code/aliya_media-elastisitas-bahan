// Verified using YouTube oEmbed on 2026-10-26. Runtime errors retain external links.
const experiment={id:'5Hq3EGzkKds',title:'Percobaan Hukum Hooke Menggunakan Alat Sederhana',author:'Fadilla Ramadhani'};
const hooke={id:'iydokKuQb4E',title:'Hukum Hooke | Susunan Pegas Seri dan Paralel',author:'Iqbal Noviansyah'};
const energy={id:'fWCmPv9gX2U',title:'Energi Potensial Pegas',author:'Toto Study'};
const records=[experiment,experiment,hooke,hooke,energy];
const players=new Set();let apiPromise;
function getAPI(){
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(!apiPromise)apiPromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script'),timer=setTimeout(()=>{apiPromise=null;reject(new Error('Video belum dapat dimuat.'));},12000);
  window.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);resolve(window.YT);};
  script.src='https://www.youtube.com/iframe_api';script.onerror=()=>{clearTimeout(timer);apiPromise=null;reject(new Error('Koneksi YouTube tidak tersedia.'));};document.head.append(script);
 });return apiPromise;
}
export function cleanupVideos(){for(const player of players){try{player.destroy();}catch{}}players.clear();}
export function mountVideos(root,beforePlay){
 root.querySelectorAll('.video').forEach((node,index)=>{
  const video=records[index];
  node.innerHTML=`<h3>🎬 Tonton penjelasan</h3><p><strong>${video.title}</strong><br>Sumber: ${video.author} · YouTube</p>${index===2||index===3?'<p class="tiny muted">Fokus pada hubungan gaya, pertambahan panjang, dan konstanta pegas. Bagian seri/paralel adalah pengayaan dan tidak diujikan.</p>':''}<div class="video-mount" id="video-${index}"></div><p class="video-status tiny muted" aria-live="polite">Video dimuat hanya saat kamu memilih tombol di bawah.</p><div class="row"><button class="quiet video-load">▶ Muat video</button><a class="quiet" href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener noreferrer">Buka di YouTube ↗</a></div>`;
  const button=node.querySelector('button'),status=node.querySelector('.video-status');
  button.addEventListener('click',async()=>{
   button.disabled=true;status.textContent='Menyiapkan video…';beforePlay();
   try{
    const YT=await getAPI();if(!node.isConnected)return;
    if(!document.getElementById(`video-${index}`)){const mount=document.createElement('div');mount.id=`video-${index}`;node.insertBefore(mount,status);}
    let player;const failure=()=>{try{player?.destroy();players.delete(player);}catch{}status.textContent='Video belum bisa diputar di sini. Gunakan tautan Buka di YouTube.';button.hidden=false;button.disabled=false;};
    const timer=setTimeout(()=>{if(node.isConnected)failure();},15000);
    player=new YT.Player(`video-${index}`,{host:'https://www.youtube-nocookie.com',videoId:video.id,playerVars:{autoplay:0,playsinline:1,rel:0,origin:location.origin},events:{onReady:()=>{clearTimeout(timer);if(!node.isConnected){player.destroy();return;}status.textContent='Video siap. Tekan Play pada pemutar untuk menonton.';button.hidden=true;},onError:()=>{clearTimeout(timer);failure();}}});players.add(player);
   }catch{if(node.isConnected){status.textContent='YouTube belum dapat dihubungi. Gunakan tautan Buka di YouTube.';button.disabled=false;}}
  });
 });
}
