const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const elements=new Map(),handlers={};const noop=()=>{};const context=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>k in o?o[k]:noop});
function el(id){if(!elements.has(id))elements.set(id,{id,style:{},classList:{add:noop,remove:noop},setAttribute:noop,focus:noop,addEventListener:noop,getBoundingClientRect:()=>({width:1200,height:720}),getContext:()=>context});return elements.get(id);}
const sandbox={console,Math:Object.create(Math),Set,Number,localStorage:{getItem:()=>0,setItem:noop},matchMedia:()=>({matches:false}),document:{createElement:()=>el(Math.random()),getElementById:el,querySelectorAll:()=>[],addEventListener:(n,fn)=>handlers[n]=fn},window:{addEventListener:noop},requestAnimationFrame:noop,setInterval:noop};
let source=fs.readFileSync(__dirname+'/game.js','utf8');source=source.replace('setup(0);requestAnimationFrame(frame);','setup(0); globalThis.test={setup,update,draw,start,pause,resume,hurt,finish,surface,keys,moveBarrel,barrelSpeed,ladderDropChance,activate(){state="playing"},heroPose,themes,get ladders(){return ladders},get sparks(){return sparks},get p(){return player}, get state(){return state},get score(){return score},get lives(){return lives},get barrels(){return barrels},get stars(){return stars},get hammer(){return hammer}, get level(){return level}, jump(){jumpQueued=.15}, quiet(){sound.enabled=false;sound.start=()=>{}}, addBarrel(b){barrels.push(b)}};');vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/art.js','utf8'),sandbox);vm.runInContext(source,sandbox);const t=sandbox.test;t.quiet();const tick=(secs)=>{for(let i=0;i<secs*120;i++)t.update(1/120)};
t.start();assert.equal(t.state,'playing');const y=t.p.y;t.jump();tick(.25);assert(t.p.y<y-65,'jump clears barrel height');tick(.65);assert(t.p.onGround,'lands on platform');assert.equal(t.p.floor,0);
t.keys.add('ArrowRight');tick(.6);t.keys.clear();tick(.2);assert(t.p.x>240,'movement works');
t.p.x=280;t.p.y=t.surface(0,280);t.keys.add('ArrowUp');tick(1.1);t.keys.clear();assert.equal(t.p.floor,1,'ladder reaches next platform');assert(t.p.onGround);t.keys.add('ArrowDown');tick(1.1);t.keys.clear();assert.equal(t.p.floor,0,'ladder descends');
t.p.x=t.stars[0].x;t.p.y=t.surface(0,t.p.x);t.update(1/120);assert.equal(t.score,250,'collect star once');tick(.2);assert.equal(t.score,250);
t.p.x=t.hammer.x;t.p.floor=1;t.p.y=t.surface(1,t.p.x);tick(.02);assert(t.p.power>7.9,'hammer pickup');t.addBarrel({x:t.p.x+30,y:t.p.y-16,floor:1,dir:1,fall:false,vy:0,rot:0,speed:100});const before=t.score;tick(.02);assert(t.score>=before+200,'hammer destroys barrel');tick(8.1);assert.equal(t.p.power,0,'hammer expires');
t.p.inv=0;t.hurt();assert.equal(t.lives,2);t.hurt();assert.equal(t.lives,2,'respawn invulnerability');
t.pause();const px=t.p.x;t.keys.add('ArrowRight');tick(2);assert.equal(t.p.x,px,'pause freezes physics');t.resume();assert.equal(t.state,'playing');
assert.equal(t.themes.length,10);assert.equal(new Set(t.themes.map(t=>JSON.stringify(t.layout))).size,10,'10 different layouts');
for(let n=0;n<10;n++){t.setup(n);t.p.inv=1000;
 for(const l of t.ladders){t.activate();t.p.x=l.x;t.p.y=l.bottom;t.p.floor=l.low;t.p.onGround=true;t.p.climbing=null;t.keys.clear();t.keys.add('ArrowUp');tick(1.2);t.keys.clear();assert.equal(t.p.floor,l.high,'reachable ladder in level '+(n+1));}
 t.activate();t.p.x=110;t.p.floor=0;t.p.y=t.surface(0,110);tick(15);assert(t.barrels.length>2&&t.barrels.length<30,'bounded barrel spawning');for(const s of t.sparks)assert(s.floor>=0&&s.floor<=4,'valid spark floor');t.draw();
 t.p.x=1080;t.p.floor=4;t.p.y=t.surface(4,1080);t.p.onGround=true;t.update(1/120);assert.equal(t.state,'winning');tick(2.9);assert.equal(t.state,n===9?'won':'between');if(n<9)t.start();t.draw();}
const base={onGround:true,vx:245,walk:0,climbing:null};const pose0=t.heroPose(base),pose1=t.heroPose({...base,walk:Math.PI/2});assert.notDeepEqual(pose0.legs,pose1.legs,'run changes knee and foot positions');assert.notDeepEqual(pose0.arms,pose1.arms,'run changes elbow and hand positions');assert.notDeepEqual(pose0,t.heroPose({...base,onGround:false}),'distinct jump pose');assert.notDeepEqual(t.heroPose({...base,climbing:{},walk:0}).arms,t.heroPose({...base,climbing:{},walk:Math.PI/2}).arms,'alternating climb arms');
t.start();for(let i=0;i<3;i++){t.p.inv=0;t.hurt();}assert.equal(t.state,'over');assert.equal(t.lives,0);t.start();assert.equal(t.lives,3);assert.equal(t.score,0);assert.equal(t.level,0);

// Exercise real motion through every ladder in both directions at all ten speeds.
for(let n=0;n<10;n++){
 t.setup(n);
 sandbox.Math.random=()=>1;const fast=t.barrelSpeed(n);
 if(n>0){sandbox.Math.random=()=>0;assert(t.barrelSpeed(n)>112+(n-1)*14+5,'successive speed bands never overlap');}
 assert(t.ladderDropChance(n)>0&&t.ladderDropChance(n)<.5,'ladder drops remain occasional');
 for(const l of t.ladders)for(const dir of [-1,1]){
  const make=()=>({x:l.x-dir*.5,y:l.top-16,floor:l.high,dir,fall:false,vy:0,rot:0,speed:fast,scored:true});
  sandbox.Math.random=()=>0;const b=make();t.moveBarrel(b,1/120);
  assert(b.fall,'crossing starts ladder fall');assert.equal(b.x,l.x);assert.equal(b.floor,l.low);assert.equal(b.scored,false);
  let frames=0;while(b.fall&&frames++<240){t.moveBarrel(b,1/120);assert.equal(b.x,l.x,'fall stays centred on ladder');}
  assert(!b.fall,'lands within two seconds');assert.equal(b.y,t.surface(l.low,l.x)-16);assert.equal(b.dir,-dir);assert.equal(b.vy,0);
  t.moveBarrel(b,1/120);assert(!b.fall,'does not immediately drop again');assert((b.x-l.x)*-dir>0,'rolls away on lower floor');
  let rolls=0;sandbox.Math.random=()=>{rolls++;return 1};const pass=make();t.moveBarrel(pass,1/120);
  assert(!pass.fall,'can roll past a ladder');assert.equal(pass.floor,l.high);assert.equal(rolls,1);
  t.moveBarrel(pass,1/120);assert.equal(rolls,1,'does not reroll after passing');
 }
}
sandbox.Math.random=Math.random;
t.setup(0);for(const dir of [-1,1]){
 const b={x:dir===1?1135.9:64.1,y:0,floor:1,dir,fall:false,vy:0,rot:0,speed:112};
 t.moveBarrel(b,1/120);assert(b.fall);assert.equal(b.floor,0);
 for(let i=0;i<240&&b.fall;i++)t.moveBarrel(b,1/120);
 assert(!b.fall);assert.equal(b.dir,-dir,'edge drops still reverse');
 b.x=dir===1?64.1:1135.9;t.moveBarrel(b,1/120);assert(b.dead,'barrels leave bottom floor');
}
t.start();t.p.inv=0;let victim={x:t.p.x,y:t.p.y-24,floor:0,dir:1,fall:true,vy:0,rot:0,speed:112};t.addBarrel(victim);t.update(1/120);assert.equal(t.lives,2,'falling barrel collision');
t.p.power=8;victim={x:t.p.x,y:t.p.y-24,floor:0,dir:1,fall:true,vy:0,rot:0,speed:112};t.addBarrel(victim);t.update(1/120);assert(victim.dead,'hammer destroys falling barrels');
console.log('PASS: all 80 ladders in both directions, occasional drop/pass decisions, no per-frame reroll, centred falls and exact landings, edge drops, bottom cleanup, strictly increasing speeds, falling collisions and hammer.');
console.log('PASS: 10 unique levels, all 80 ladders reachable, bounded hazard spawning, valid hazard floors, all 10 level transitions, final princess rescue, articulated run/jump/climb poses, movement, jump clearance, landing, collection, hammer pickup/smash/expiry, invulnerability, pause, victory/game over/restart, all-theme drawing.');




