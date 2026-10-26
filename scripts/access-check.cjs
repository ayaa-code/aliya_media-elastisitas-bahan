const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
async function run(){
 const browser=await chromium.launch({headless:true,channel:'msedge'}),checks=[];
 const check=(name,result)=>{assert.ok(result,name);checks.push(name);};
 try{
 const context=await browser.newContext({viewport:{width:1024,height:900},reducedMotion:'no-preference'});
 await context.addInitScript(()=>{
  window.testSpeech={calls:[],cancels:0,pauses:0,resumes:0};
  window.SpeechSynthesisUtterance=class {constructor(text){this.text=text;}};
  Object.defineProperty(window,'speechSynthesis',{value:{paused:false,getVoices:()=>[{lang:'id-ID',name:'Mock Indonesia'}],cancel(){testSpeech.cancels++;this.paused=false;},speak(u){testSpeech.calls.push({text:u.text,rate:u.rate,lang:u.lang});u.onstart?.();},pause(){testSpeech.pauses++;this.paused=true;},resume(){testSpeech.resumes++;this.paused=false;}}});
  window.YT={Player:class{constructor(id,options){this.node=document.getElementById(id);queueMicrotask(()=>options.events.onError({data:150}));}destroy(){this.node?.remove();}}};
 });
 const page=await context.newPage();await page.goto('http://127.0.0.1:5180');await page.locator('[data-action=auth-switch]').click();await page.locator('#name').fill('Keyboard');await page.locator('#email').fill(`keyboard-${Date.now()}@example.com`);await page.locator('#password').fill('testpass123');await page.locator('#confirm').fill('testpass123');await page.locator('#auth-form button[type=submit]').click();await page.locator('.dashboard').waitFor();
 await page.locator('[data-action=learn]').focus();await page.keyboard.press('Enter');await page.locator('.lesson').first().waitFor();check('Kartu materi dapat diaktifkan keyboard',await page.locator('.lesson').count()===5);
 await page.locator('[data-action=speak]').nth(0).click();await page.locator('[data-action=speak]').nth(1).click();check('Narasi kedua membatalkan narasi sebelumnya',await page.evaluate(()=>testSpeech.calls.length===2&&testSpeech.cancels>=2));
 await page.locator('[data-action=pause-speech]').nth(1).click();await page.locator('[data-action=speak]').nth(1).click();check('Jeda dan lanjut narasi',await page.evaluate(()=>testSpeech.pauses===1&&testSpeech.resumes===1));
 await page.locator('#rate-1').selectOption('1.5');check('Perubahan kecepatan diterapkan',await page.evaluate(()=>testSpeech.calls.at(-1).rate===1.5));
 await page.locator('[data-action=stop-speech]').nth(1).click();check('Stop memperbarui status audio',await page.locator('#speech-1').textContent()==='Siap diputar');
 await page.locator('.video-load').first().click();check('Error video menampilkan tautan cadangan',await page.locator('.video-status').first().textContent().then(s=>s.includes('Buka di YouTube')));
 await page.locator('.video-load').first().click();check('Video gagal dapat dicoba lagi',await page.locator('.video-load').first().isEnabled());
 await page.locator('[data-action=settings]').click();const end=page.locator('#modal [data-action=close-modal]').last();await end.focus();await page.keyboard.press('Tab');check('Fokus terjaga di dialog',await page.locator('#modal [data-action=close-modal]').first().evaluate(n=>n===document.activeElement));await page.keyboard.press('Escape');check('Escape menutup dialog pengaturan',!await page.locator('dialog').evaluate(n=>n.open));
 await page.locator('[data-action=home]').first().click();await page.locator('[data-action=game]').focus();await page.keyboard.press('Enter');await page.locator('[data-action=start-game]').focus();await page.keyboard.press('Enter');
 await page.locator('#compression').focus();const before=Number(await page.locator('#compression').inputValue());await page.keyboard.press('ArrowRight');check('Slider mendukung keyboard',Number(await page.locator('#compression').inputValue())===before+1);
 await page.locator('[data-action=launch]').focus();await page.keyboard.press('Enter');const a=await page.locator('#actor').getAttribute('transform');await page.waitForTimeout(200);const b=await page.locator('#actor').getAttribute('transform');check('Animasi peluncuran bergerak pada mode normal',a!==b);await page.locator('[data-action=checkpoint]').waitFor();await page.locator('[data-action=checkpoint]').focus();await page.keyboard.press('Enter');await page.locator('[data-choice="1"]').focus();await page.keyboard.press('Enter');check('Checkpoint dapat dijawab keyboard',await page.locator('dialog').evaluate(n=>n.open));
 const context2=await browser.newContext();await context2.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{value:undefined});});const p2=await context2.newPage();await p2.goto('http://127.0.0.1:5180');
 // Reuse local demo session in this isolated context only for the unsupported-audio check.
 const values=await page.evaluate(()=>({db:localStorage.getItem('stretch-measure-v1'),session:localStorage.getItem('stretch-session')}));await p2.evaluate(v=>{localStorage.setItem('stretch-measure-v1',v.db);localStorage.setItem('stretch-session',v.session);},values);await p2.reload();await p2.locator('[data-action=learn]').click();check('Browser tanpa audio mendapat fallback',await p2.locator('.audio-box button:disabled').count()===15);
 fs.writeFileSync('artifacts/access-report.json',JSON.stringify({passed:checks.length,checks},null,2));console.log(JSON.stringify({passed:checks.length,checks},null,2));
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
