import test from 'node:test';
import assert from 'node:assert/strict';
import {simulate,answerOnce,advance,freshProgress,restoreProgress,score} from '../core.js';
import {questions} from '../content.js';
test('energi dan jarak mematuhi model ideal',()=>{
 const a=simulate({mass:.2,kind:0,x:.1},1);
 assert.ok(Math.abs(a.energy-.4)<1e-12);assert.ok(Math.abs(a.range-.4)<1e-12);
 const b=simulate({mass:.2,kind:0,x:.2},1);assert.ok(Math.abs(b.energy/a.energy-4)<1e-12);
 const heavy=simulate({mass:.4,kind:0,x:.1},1);assert.ok(Math.abs(heavy.range-a.range/2)<1e-12);
});
test('k lebih besar meningkatkan energi pada pemampatan sama',()=>{assert.ok(simulate({mass:.3,kind:2,x:.15},1).range>simulate({mass:.3,kind:0,x:.15},1).range);});
test('batas model tidak diekstrapolasi',()=>{const a=simulate({mass:.2,kind:2,x:.3},1);assert.equal(a.outcome,'limit');assert.equal(a.energy,null);assert.equal(a.range,0);});
test('jawaban terkunci, benar bernilai 20, salah tetap lanjut',()=>{
 const p=freshProgress();p.phase='quiz';assert.equal(answerOnce(p,1),true);assert.equal(answerOnce(p,0),false);assert.equal(score(p.answers,questions),20);assert.equal(advance(p),true);
 p.phase='quiz';assert.equal(answerOnce(p,0),true);assert.equal(score(p.answers,questions),20);assert.equal(advance(p),true);assert.equal(p.level,2);
});
test('lima jawaban benar tepat 100 dan berakhir',()=>{const p=freshProgress();for(const q of questions){p.phase='quiz';answerOnce(p,q.answer);advance(p);}assert.equal(score(p.answers,questions),100);assert.equal(p.phase,'done');assert.equal(advance(p),false);});
test('pemulihan pending feedback tidak memberi kesempatan kedua',()=>{const p=restoreProgress({version:1,level:0,phase:'feedback',answers:[1],launches:[]});assert.equal(p.phase,'feedback');assert.equal(answerOnce(p,0),false);advance(p);assert.equal(p.level,1);});
test('pemulihan checkpoint memerlukan peluncuran dan urutan sah',()=>{const p=restoreProgress({version:1,phase:'quiz',answers:[1],launches:[{},{}]});assert.equal(p.level,1);assert.equal(p.phase,'quiz');assert.deepEqual(restoreProgress({version:1,answers:[9,1]}).answers,[]);});
test('parameter tak valid ditolak',()=>{assert.throws(()=>simulate({mass:0,kind:0,x:.1},1),RangeError);});
