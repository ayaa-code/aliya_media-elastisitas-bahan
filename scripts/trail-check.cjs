const {chromium}=require(process.env.PLAYWRIGHT_MODULE);const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{const page=await browser.newPage({viewport:{width:1400,height:950}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5180');await page.locator('[data-action=auth-switch]').click();for(const [id,value] of Object.entries({name:'Trail Test',email:`trail${Date.now()}@example.com`,password:'test1234',confirm:'test1234'}))await page.locator('#'+id).fill(value);await page.locator('button[type=submit]').click();await page.locator('[data-action=game]').click();await page.locator('[data-action=start-game]').click();
await page.locator('#bouncie-frame').waitFor();
await page.keyboard.down('ArrowRight');await page.waitForTimeout(80);const walkFrame=await page.locator('#trail-player').getAttribute('data-frame');await page.waitForTimeout(140);assert.notEqual(await page.locator('#trail-player').getAttribute('data-frame'),walkFrame);assert.equal(await page.locator('#trail-player').getAttribute('data-animation'),'walk');await page.keyboard.up('ArrowRight');
await page.keyboard.down('ArrowLeft');await page.waitForTimeout(220);assert.equal(await page.locator('#trail-player').getAttribute('data-facing'),'-1');await page.keyboard.up('ArrowLeft');
await page.screenshot({path:'artifacts/spring-trail-desktop.png',fullPage:true});
for(let level=0;level<5;level++){console.log('Testing level',level+1);
 for(let step=0;step<140;step++){
  if(await page.locator('dialog[open]').count())break;
  const p=await page.locator('#world').evaluate(n=>({x:+n.dataset.x,g:n.dataset.grounded==='true'}));
  if(p.g&&(p.x>215&&p.x<300||level>0&&p.x>380&&p.x<455||p.x>565&&p.x<640))await page.keyboard.press('Space');
  if(p.x>740){await page.keyboard.up('ArrowRight');await page.keyboard.down('ArrowLeft');await page.waitForTimeout(180);await page.keyboard.up('ArrowLeft');}
  await page.keyboard.down('ArrowRight');await page.waitForTimeout(65);
 }
 await page.keyboard.up('ArrowRight');await page.locator('.star-quiz').waitFor({timeout:3000});assert.equal(await page.locator('.option').count(),5);
 const before=await page.locator('#world').getAttribute('data-x'),frozen=await page.locator('#trail-player').getAttribute('data-frame');await page.waitForTimeout(200);assert.equal(await page.locator('#world').getAttribute('data-x'),before);assert.equal(await page.locator('#trail-player').getAttribute('data-frame'),frozen);
 await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(n=>n.open),true);
 await page.locator(`[data-choice="${[1,2,0,2,2][level]}"]`).click();await page.locator('[data-action=continue]').click();
 if(level===0){await page.reload();await page.locator('[data-action=game]').click();assert.equal(await page.locator('.star-quiz').count(),0);}
 for(let step=0;step<70;step++){
  if(await page.locator('.score-big').count())break;
  const p=await page.locator('#world').evaluate(n=>({x:+n.dataset.x,g:n.dataset.grounded==='true'}));
  if(p.g&&p.x>735&&p.x<790)await page.keyboard.press('Space');
  await page.keyboard.down('d');await page.waitForTimeout(65);
  if(await page.locator('.score-big').count())break;
  if(await page.locator('.game-head').innerText().then(t=>t.includes(`Level ${level+2} of 5`)))break;
 }
 await page.keyboard.up('d');
}
assert.ok(await page.locator('.score-panel').innerText().then(t=>t.includes('5 dari 5 jawaban benar')));assert.ok(Number(await page.locator('.score-big').innerText())>=0);await page.setViewportSize({width:320,height:740});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log('PASS: five levels, movement, jumping, stars, pause, locked quiz, refresh, finish, correct answers, nonnegative score, mobile, no errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
