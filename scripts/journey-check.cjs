const {chromium}=require(process.env.PLAYWRIGHT_MODULE);const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:5180');await page.locator('[data-action=auth-switch]').click();for(const [id,value]of Object.entries({name:'Journey',email:`journey${Date.now()}@example.com`,password:'demo1234',confirm:'demo1234'}))await page.locator('#'+id).fill(value);await page.locator('button[type=submit]').click();await page.locator('[data-action=game]').click();await page.locator('[data-action=start-game]').click();await page.locator('#bouncie-frame').waitFor();
await page.screenshot({path:'artifacts/journey-desktop.png',fullPage:true});
await page.locator('[data-action=pause-game]').click();const t=await page.locator('#world').getAttribute('data-time');await page.waitForTimeout(300);assert.equal(await page.locator('#world').getAttribute('data-time'),t);await page.locator('[data-action=resume-game]').click();
let questions=0,iterations=0;await page.keyboard.down('ArrowRight');
while(iterations++<1500){
 if(await page.locator('.score-big').count())break;
 if(await page.locator('.star-quiz').count()){
  await page.keyboard.up('ArrowRight');const time=await page.locator('#world').getAttribute('data-time');await page.waitForTimeout(180);assert.equal(await page.locator('#world').getAttribute('data-time'),time);assert.equal(await page.locator('#chaser').count(),0);assert.ok(await page.locator('.question-figure img').evaluate(n=>n.complete&&n.naturalWidth>0));
  await page.locator(`[data-choice="${[1,2,0,2,2][questions]}"]`).click();questions++;await page.locator('[data-action=continue]').click();console.log('Challenge',questions,'completed');
  if(questions===1){await page.reload();await page.locator('[data-action=game]').click();await page.locator('#bouncie-frame').waitFor();assert.equal(await page.locator('.star-quiz').count(),0);}
  await page.keyboard.down('ArrowRight');continue;
 }
 const p=await page.locator('#world').evaluate(n=>({x:+n.dataset.x,g:n.dataset.grounded==='true',camera:+n.dataset.camera}));
 const section=Math.floor(Math.min(8999,p.x)/1800),local=p.x%1800,split=section%2?490:520;
 if(p.g&&(local>185&&local<275||local>split-80&&local<split||section>=1&&local>770&&local<850||local>1040&&local<1120||section>=3&&local>1515&&local<1615))await page.keyboard.press('Space');
 if(iterations===100){assert.ok(p.camera>0);await page.screenshot({path:'artifacts/journey-scrolling.png',fullPage:true});}
 await page.waitForTimeout(55);
}
await page.keyboard.up('ArrowRight');assert.equal(questions,5);assert.equal(await page.locator('.score-big').innerText().then(s=>s.includes('100')),true);assert.ok(await page.locator('.adventure-result').innerText().then(s=>s.includes('Adventure Points')));await page.setViewportSize({width:320,height:740});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log('PASS: continuous world, five quizzes, camera, pause, no chaser, persistence, separate scores, finish, mobile, no errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
