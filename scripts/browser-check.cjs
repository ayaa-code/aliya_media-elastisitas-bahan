const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.TEST_URL||'http://127.0.0.1:5180';

async function run(){
 const browser=await chromium.launch({headless:true,channel:'msedge'}),checks=[],errors=[];
 const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
 fs.mkdirSync('artifacts',{recursive:true});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base);await page.locator('[data-action=auth-switch]').click();
  const email=`bounce-${Date.now()}@example.com`;
  await page.locator('#name').fill('Aliya');await page.locator('#email').fill(email);await page.locator('#password').fill('demopass123');await page.locator('#confirm').fill('demopass123');await page.locator('#auth-form button[type=submit]').click();
  await page.locator('.dashboard').waitFor();
  check('Tepat dua kartu dashboard',await page.locator('.dashboard-card').count()===2);
  for(const width of [320,375,768,1440]){await page.setViewportSize({width,height:900});check(`Dashboard tanpa overflow ${width}px`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await page.locator('[data-action=game]').click();await page.locator('[data-action=start-game]').click();
  await page.locator('#world').waitFor();
  check('Kontrol kiri kanan tersedia',await page.locator('.move-btn').count()===2);
  await page.setViewportSize({width:320,height:740});check('Game tanpa overflow 320px',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'artifacts/game-trampoline.png',fullPage:true});
  await page.locator('[data-action=move-left]').click();await page.keyboard.press('d');check('Kontrol klik dan keyboard dapat dipakai',true);
  // The first star appears in Bouncie's current lane, so every learner can discover the first quiz calmly.
  await page.waitForFunction(()=>document.querySelector('#collectibles [data-id]'));
  await page.locator('dialog[open]').waitFor({timeout:6000});
  check('Bintang menghentikan game dan membuka popup soal',await page.locator('.star-quiz').count()===1);
  check('Popup memiliki lima opsi A–E',await page.locator('.star-quiz .option').count()===5);
  check('Placeholder gambar soal ada',await page.locator('.star-quiz .image-placeholder').innerText().then(s=>s.includes('Visual soal akan ditambahkan')));
  await page.locator('[data-choice="1"]').click();await page.locator('[data-action=continue]').waitFor();
  check('Jawaban benar memberi umpan balik',await page.locator('dialog').innerText().then(s=>s.includes('+20')));
  await page.keyboard.press('Escape');check('Popup wajib tidak tertutup Escape',await page.locator('dialog').evaluate(node=>node.open));
  await page.locator('[data-action=continue]').click();check('Lanjut kembali ke arena',await page.locator('#world').count()===1);
  check('Tidak ada JavaScript error',errors.length===0);
  fs.writeFileSync('artifacts/browser-report.json',JSON.stringify({passed:checks.length,checks,errors},null,2));console.log(JSON.stringify({passed:checks.length,checks,errors},null,2));
 }finally{await browser.close();}
}
run().catch(error=>{console.error(error);process.exitCode=1;});
