const {chromium,webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.TEST_URL||'http://127.0.0.1:5180';
async function run(){
 const browser=await chromium.launch({headless:true,channel:'msedge'}),checks=[],errors=[];
 fs.mkdirSync('artifacts',{recursive:true});
 const check=(name,ok)=>{assert.ok(ok,name);checks.push(name);};
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.locator('#auth-form').waitFor();
 await page.screenshot({path:'artifacts/login-desktop.png',fullPage:true});
 await page.locator('#auth-form button[type=submit]').click();check('Validasi input login',!!await page.locator('#auth-error').textContent());
 await page.locator('[data-action=auth-switch]').click();
 const email=`uji-${Date.now()}@example.com`;
 await page.locator('#name').fill('Aliya');await page.locator('#email').fill(email);await page.locator('#password').fill('demopass123');await page.locator('#confirm').fill('demopass123');
 await page.locator('#auth-form button[type=submit]').click();await page.locator('.dashboard').waitFor();
 check('Pendaftaran dan sambutan personal',await page.locator('h1').textContent()==='Welcome, Aliya!');
 check('Tepat dua kartu tanpa panel setelahnya',await page.locator('.dashboard-card').count()===2&&await page.locator('.dashboard').evaluate(n=>n.lastElementChild.classList.contains('card-grid')));
 const data=await page.evaluate(()=>localStorage.getItem('stretch-measure-v1'));check('Kata sandi tidak disimpan sebagai teks biasa',!data.includes('demopass123'));
 await page.screenshot({path:'artifacts/dashboard-desktop.png',fullPage:true});
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});check(`Dashboard tanpa overflow ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width===375)await page.screenshot({path:'artifacts/dashboard-mobile.png',fullPage:true});
 }
 await page.locator('[data-action=learn]').click();check('Lima submateri',await page.locator('.lesson').count()===5);check('Lima kelompok audio dan video dengan tautan cadangan',await page.locator('.audio-box').count()===5&&await page.locator('.video a').count()===5&&await page.locator('.video-load').count()===5);
 check('E-book resmi',await page.locator('.ebook a').getAttribute('href').then(s=>s.includes('repositori.kemendikdasmen.go.id')));
 await page.setViewportSize({width:375,height:812});check('Materi tanpa overflow 375px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.locator('[data-action=settings]').click();await page.locator('#pref-large').check();await page.locator('#pref-contrast').check();await page.locator('#pref-reduce').check();await page.locator('#modal [data-action=close-modal]').last().click();
 check('Pengaturan akses diterapkan',await page.locator('html').evaluate(n=>['large','contrast','reduce'].every(c=>n.classList.contains(c))));
 await page.locator('[data-action=home]').first().click();await page.locator('[data-action=game]').click();await page.locator('[data-action=start-game]').click();
 check('Game tersedia di HP',await page.locator('#world').isVisible());check('Game tanpa overflow 375px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'artifacts/game-desktop.png',fullPage:true});
 await page.locator('[data-action=settings]').click();await page.locator('#pref-large').uncheck();await page.locator('#pref-contrast').uncheck();await page.locator('#modal [data-action=close-modal]').last().click();
 const correct=[1,2,0,2,2];
 for(let i=0;i<5;i++){
  await page.locator('[data-action=launch]').click();await page.locator('[data-action=checkpoint]').waitFor();
  if(i===0){check('Satu peluncuran per level',await page.locator('[data-action=launch]').isDisabled());await page.locator('[data-action=checkpoint]').click();}
  else await page.locator('[data-action=checkpoint]').click();
  check(`Lima opsi checkpoint ${i+1}`,await page.locator('.option').count()===5);
  check(`Placeholder gambar ${i+1}`,await page.locator('.image-placeholder').textContent().then(s=>s.includes('Visual soal akan ditambahkan')));
  await page.locator(`[data-choice="${correct[i]}"]`).click();await page.locator('dialog[open]').waitFor();
  check(`Jawaban terkunci ${i+1}`,await page.locator('.option:disabled').count()===5);
  if(i===0){await page.keyboard.press('Escape');check('Feedback wajib tidak tertutup Escape',await page.locator('dialog').evaluate(n=>n.open));await page.reload();await page.locator('[data-action=game]').click();await page.locator('dialog[open]').waitFor();check('Reload mempertahankan kunci dan feedback',await page.locator('.option:disabled').count()===5);}
  if(i===2)await page.screenshot({path:'artifacts/quiz-feedback.png',fullPage:true});
  await page.locator('[data-action=continue]').click();
 }
 check('Lima benar menghasilkan 100',await page.locator('.score-big').innerText().then(s=>s.includes('100')));
 await page.screenshot({path:'artifacts/score.png',fullPage:true});
 await page.locator('[data-action=replay]').click();await page.locator('#modal [data-action=close-modal]').click();check('Batal reset mempertahankan skor',await page.locator('.score-big').innerText().then(s=>s.includes('100')));
 await page.locator('[data-action=replay]').click();await page.locator('[data-action=confirm-reset]').click();await page.locator('[data-action=start-game]').click();
 await page.locator('#compression').fill('30');await page.locator('#compression').dispatchEvent('input');await page.locator('[data-action=launch]').click();check('Peluncuran di luar batas dibatalkan',await page.locator('#launch-result').innerText().then(s=>s.includes('Peluncuran dibatalkan')));
 await page.locator('[data-action=checkpoint]').click();await page.locator('[data-choice="0"]').click();check('Jawaban salah +0',await page.locator('dialog').innerText().then(s=>s.includes('+0 poin')));await page.locator('[data-action=continue]').click();check('Jawaban salah tetap lanjut level 2',await page.locator('.game-head').innerText().then(s=>/level 2 of 5/i.test(s)));
 await page.locator('[data-action=logout]').click();await page.locator('#email').fill(email);await page.locator('#password').fill('demopass123');await page.locator('#auth-form button[type=submit]').click();await page.locator('[data-action=game]').click();check('Progres terpisah dan pulih setelah login',await page.locator('.game-head').innerText().then(s=>/level 2 of 5/i.test(s)));
 await page.setViewportSize({width:320,height:740});await page.screenshot({path:'artifacts/game-mobile.png',fullPage:true});check('Game tanpa overflow 320px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 check('Tidak ada JavaScript error',errors.length===0);
 console.log(JSON.stringify({passed:checks.length,checks,errors},null,2));fs.writeFileSync('artifacts/browser-report.json',JSON.stringify({passed:checks.length,checks,errors},null,2));
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
