import test from 'node:test';
import assert from 'node:assert/strict';
import {answerOnce,advance,freshProgress,restoreProgress,score,addBonus} from '../core.js';
import {questions} from '../content.js';
test('jawaban terkunci, benar bernilai 20, salah tetap lanjut',()=>{
 const p=freshProgress();p.phase='quiz';assert.equal(answerOnce(p,1),true);assert.equal(answerOnce(p,0),false);assert.equal(score(p.answers,questions),20);assert.equal(advance(p),true);
 p.level=1;p.phase='quiz';assert.equal(answerOnce(p,0),true);assert.equal(score(p.answers,questions),20);assert.equal(advance(p),true);assert.equal(p.level,1);
});
test('lima jawaban benar tepat 100 tetapi finish tetap diperlukan',()=>{const p=freshProgress();for(const q of questions){p.phase='quiz';answerOnce(p,q.answer);advance(p);p.level++;}assert.equal(score(p.answers,questions),100);assert.equal(p.phase,'setup');assert.equal(advance(p),false);});
test('pemulihan feedback membuat jawaban tetap terkunci',()=>{const p=restoreProgress({version:4,level:0,phase:'feedback',answers:[1],adventure:5,checkpoint:{x:1450,y:390},claimed:['log']});assert.equal(p.phase,'feedback');assert.equal(answerOnce(p,0),false);advance(p);assert.equal(p.level,0);assert.equal(p.checkpoint.x,1450);assert.equal(p.adventure,5);assert.deepEqual(p.claimed,['log']);});
test('pemulihan quiz mempertahankan level dan data tidak sah diabaikan',()=>{const p=restoreProgress({version:2,phase:'quiz',answers:[1],bonus:10});assert.equal(p.level,1);assert.equal(p.phase,'quiz');assert.deepEqual(restoreProgress({version:2,answers:[9,1]}).answers,[]);});
test('penalti adventure tidak mengurangi Learning Score',()=>{const p=freshProgress();p.answers=[1];addBonus(p,10);addBonus(p,-50);assert.equal(p.adventure,0);assert.equal(score(p.answers,questions),20);});
