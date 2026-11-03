'use strict';
(() => {
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d'),$=id=>document.getElementById(id);
const W=1200,H=720,INK='#302538',keys=new Set(),TAU=Math.PI*2;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let state='menu',level=0,score=0,lives=3,best=0,elapsed=0,spawn=0,clock=0,shake=0,noticeTime=0,last=0,acc=0,jumpQueued=0,winTimer=0,throwTime=0;
let barrels=[],particles=[],popups=[],stars=[],sparks=[],player,hammer,platforms,ladders;
try{best=Number(localStorage.getItem('kong-record')||0)||0;}catch{}
const themes=[{"name":"DIE BAUSTELLE","sky":["#e9a983","#f9d7a0"],"steel":"#5dafa7","edge":"#328681","city":"#a67b89","accent":"#f7ce67","layout":[[280,1000],[180,870],[350,1020],[220,850]],"slope":0.023},{"name":"NEON-NACHT","sky":["#494677","#bf87a5"],"steel":"#75a9cd","edge":"#49749e","city":"#615980","accent":"#f7ce67","layout":[[200,920],[390,1020],[180,820],[420,960]],"slope":0.027},{"name":"DER HAFEN","sky":["#6495ae","#d7dcc2"],"steel":"#64afbc","edge":"#347f91","city":"#577d94","accent":"#f7ce67","layout":[[360,980],[220,780],[450,1040],[250,890]],"slope":0.018},{"name":"DIE DACHGÄRTEN","sky":["#739f91","#e0d6a4"],"steel":"#83ae77","edge":"#547c59","city":"#648779","accent":"#f7ce67","layout":[[180,790],[420,1000],[240,910],[480,1060]],"slope":0.032},{"name":"KUPFERWERK","sky":["#a96663","#f3bd81"],"steel":"#bb8768","edge":"#865940","city":"#966b6b","accent":"#f7ce67","layout":[[420,1030],[190,860],[340,960],[210,800]],"slope":0.025},{"name":"REGENVIERTEL","sky":["#515e82","#a9bdc9"],"steel":"#7e9fb7","edge":"#4a718e","city":"#546782","accent":"#f7ce67","layout":[[240,930],[470,1060],[180,820],[380,980]],"slope":0.035},{"name":"WOLKENBRÜCKE","sky":["#9babc3","#f4dfbc"],"steel":"#a8beb4","edge":"#708d8d","city":"#8994b4","accent":"#f7ce67","layout":[[390,850],[230,990],[460,1040],[190,880]],"slope":0.02},{"name":"FROSTTURM","sky":["#708eae","#c8dfe0"],"steel":"#94becb","edge":"#5a8f9e","city":"#748fa9","accent":"#f7ce67","layout":[[210,1020],[400,870],[280,1060],[460,940]],"slope":0.03},{"name":"GLUTDÄCHER","sky":["#9e535d","#f4a76c"],"steel":"#b68765","edge":"#795440","city":"#824f65","accent":"#f7ce67","layout":[[450,980],[250,810],[490,1030],[200,890]],"slope":0.034},{"name":"DAS KRONENDACH","sky":["#564472","#e3a4b5"],"steel":"#b595bc","edge":"#75658f","city":"#776086","accent":"#f7ce67","layout":[[320,1050],[180,900],[410,970],[280,820]],"slope":0.026}];
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
class Sound {
 constructor(){this.ctx=null;this.enabled=true;this.volume=.55;this.step=0;this.timer=null;this.next=0;}
 async start(){try{if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=this.volume*.48;this.master.connect(this.ctx.destination);this.noise=this.ctx.createBuffer(1,this.ctx.sampleRate*.25,this.ctx.sampleRate);const d=this.noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}await this.ctx.resume();if(!this.timer){this.next=this.ctx.currentTime+.05;this.timer=setInterval(()=>this.schedule(),90);}this.update();}catch(error){console.warn('KONG audio could not start:',error?.message||String(error));this.enabled=false;if(!this.master)this.ctx=null;this.update();}}
 update(){if(this.master)this.master.gain.setTargetAtTime(this.enabled?this.volume*.48:0,this.ctx.currentTime,.035);$('sound').innerHTML=(this.enabled?'♫':'♪')+' <span>TON '+(this.enabled?'AN':'AUS')+'</span>';$('sound').setAttribute('aria-label',this.enabled?'Ton ausschalten':'Ton einschalten');}
 tone(freq,duration=.15,type='triangle',gain=.25,when=0,end=null){if(!this.ctx)return;const t=when||this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(end)o.frequency.exponentialRampToValueAtTime(end,t+duration);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(gain,t+.008);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration+.02);}
 hiss(t,gain=.08,duration=.07){if(!this.ctx)return;const n=this.ctx.createBufferSource(),g=this.ctx.createGain(),f=this.ctx.createBiquadFilter();n.buffer=this.noise;f.type='highpass';f.frequency.value=5500;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);n.connect(f);f.connect(g);g.connect(this.master);n.start(t);n.stop(t+duration);}
 schedule(){if(!this.ctx)return;if(state!=='playing'||!this.enabled){this.next=this.ctx.currentTime+.05;return;}const speed=.145-level*.003;if(this.next<this.ctx.currentTime-.1)this.next=this.ctx.currentTime+.02;while(this.next<this.ctx.currentTime+.18){const t=this.next,s=this.step%32,roots=level%3===0?[130.81,155.56,174.61,116.54]:level%3===1?[146.83,174.61,130.81,196]:[164.81,130.81,196,146.83],root=roots[Math.floor(s/8)],mel=[0,7,12,7,3,7,15,12];if(s%2===0)this.tone(root*(s%8===6?1.5:1),.19,'triangle',.20,t);if(s%4===0)this.tone(135,.13,'sine',.55,t,38);if(s%8===4)this.hiss(t,.22,.12);this.hiss(t,s%2?.055:.09,.035);if(s%2===0)this.tone(root*2*Math.pow(2,mel[Math.floor(s/2)%8]/12),.13,'square',.045,t);if(s%16===14&&level>1)this.tone(root*4,.3,'sine',.09,t);if(s%8===0){this.tone(root*2,.4,'triangle',.055,t);this.tone(root*3,.4,'triangle',.045,t);}this.next+=speed;this.step++;}}
 fx(name){if(!this.enabled||!this.ctx)return;if(name==="land")this.tone(90,.055,"sine",.07,0,50);if(name==='jump')this.tone(230,.13,'square',.12,0,600);if(name==='star'){this.tone(880,.1,'sine',.3);this.tone(1320,.22,'triangle',.2,this.ctx?.currentTime+.075);}if(name==='hit'){this.tone(180,.35,'sawtooth',.23,0,35);this.hiss(this.ctx?.currentTime,.3,.2);}if(name==='smash'){this.tone(90,.15,'triangle',.55,0,28);this.hiss(this.ctx?.currentTime,.2,.13);}if(name==='power')[330,440,660,880].forEach((f,i)=>this.tone(f,.2,'square',.1,this.ctx?.currentTime+i*.09));if(name==='win')[523,659,784,1046,784,1046].forEach((f,i)=>this.tone(f,.32,'triangle',.3,this.ctx?.currentTime+i*.13));}
}
const sound=new Sound();
const art=window.RooftopArt?new window.RooftopArt():null;
let dustClock=0;
function surface(i,x){const p=platforms[i];return p.y+p.slope*(x-600);}
function setup(n){level=n;elapsed=0;spawn=1.6;throwTime=0;barrels=[];sparks=[];particles=[];popups=[];platforms=Array.from({length:5},(_,i)=>({y:673-i*123,slope:(i%2?-1:1)*themes[n].slope}));
 const positions=themes[n].layout;
 ladders=positions.flatMap((xs,i)=>xs.map(x=>({x,low:i,high:i+1,bottom:surface(i,x),top:surface(i+1,x)})));
 stars=[];for(let i=0;i<5;i++)for(const x of [460,710,1080])stars.push({x:x+(i%2?-70:0)-(i===4&&x===1080?100:0),y:surface(i,x)-33,floor:i,got:false,phase:rnd(0,TAU)});
 const hammerX=500+(n%3)*65;hammer={x:hammerX,y:surface(1,hammerX)-30,got:false};
 if(n>0)for(let i=0;i<Math.min(3,1+Math.floor(n/4));i++)sparks.push({x:600,y:0,floor:1+i,phase:i*2.2+n*.6,cooldown:0});
 player={x:115,y:surface(0,115),vx:0,vy:0,floor:0,onGround:true,climbing:null,face:1,inv:2,power:0,walk:0,coyote:.1,land:0,takeoff:0};
 updateHud();}
function updateHud(){$('score').textContent=String(score).padStart(6,'0');$('best').textContent=String(best).padStart(6,'0');$('level').innerHTML=String(level+1).padStart(2,'0')+' <i>/ '+String(themes.length).padStart(2,'0')+'</i>';$('level-name').textContent=themes[level].name;$('lives').textContent='♥ '.repeat(lives)+'♡ '.repeat(3-lives);$('lives').setAttribute('aria-label',lives+' Leben');$('bonus').innerHTML='BONUS <b>'+Math.max(0,5000-Math.floor(elapsed)*20).toLocaleString('de-CH')+'</b>';}
function record(){if(score>best){best=score;try{localStorage.setItem('kong-record',best);}catch{}}updateHud();}
function points(n,x,y,label){score+=n;popups.push({x,y,text:label||'+'+n,life:1.1,color:'#fff5c4'});updateHud();}
function notify(t){$('notice').textContent=t;noticeTime=2;$('notice').classList.add('show');}
function burst(x,y,color,count=14){for(let i=0;i<count;i++)particles.push({x,y,vx:rnd(-180,180),vy:rnd(-240,40),life:rnd(.3,.8),max:.8,color,size:rnd(3,8)});}
function showCard(tag,title,text,button,extra){$('card-tag').textContent=tag;$('card-title').innerHTML=title;$('card-text').textContent=text;$('play').innerHTML=button+' <span>↗</span>';$('card-extra').textContent=extra;$('overlay').classList.remove('hidden');$('menu-note').style.display='none';$('play').focus({preventScroll:true});}
function start(){sound.start();keys.clear();jumpQueued=0;if(state==='paused'){resume();return;}if(state==='between'){setup(level+1);}else{score=0;lives=3;setup(0);}state='playing';document.body?.classList.add('is-playing');window.scrollTo?.({top:0,behavior:'instant'});$('overlay').classList.add('hidden');$('status').textContent='HOCH HINAUS. DU SCHAFFST DAS.';canvas.focus({preventScroll:true});notify('LEVEL '+(level+1)+' · '+themes[level].name);}
function pause(){if(state!=='playing')return;state='paused';keys.clear();showCard('KURZ DURCHATMEN','Kleine<br><em>Pause.</em>','Deine Fässer warten. Dein nächster grosser Sprung auch.','WEITERSPIELEN','P oder Escape zum Fortsetzen');$('status').textContent='PAUSE. ALLES BLEIBT STEHEN.';}
function resume(){state='playing';keys.clear();$('overlay').classList.add('hidden');$('status').textContent='WEITER GEHT’S!';canvas.focus({preventScroll:true});sound.start();}
function hurt(){if(player.inv>0)return;lives--;sound.fx('hit');shake=reduced?0:12;burst(player.x,player.y-22,'#fff0b5',25);if(lives<=0){state='over';record();showCard('DAS WAR KNAPP!','Noch eine<br><em>Runde?</em>','Jeder gute Aufstieg beginnt mit einem neuen Versuch. Dein Rekord wartet darauf, gebrochen zu werden.','NOCH MAL',score.toLocaleString('de-CH')+' Punkte · Rekord '+best.toLocaleString('de-CH'));$('status').textContent='GAME OVER · ABER NICHT FÜR IMMER.';}else{Object.assign(player,{x:115,y:surface(0,115),vx:0,vy:0,floor:0,onGround:true,climbing:null,inv:3,power:0});barrels=barrels.filter(b=>b.floor!==0);notify('WEITER! NOCH '+lives+' LEBEN');}updateHud();}
function finish(){state='winning';winTimer=2.8;const bonus=Math.max(0,5000-Math.floor(elapsed)*20);points(bonus,1040,135,'BONUS +'+bonus);sound.fx('win');notify(level===themes.length-1?'PRINZESSIN LUMI IST FREI!':'SCHLOSS '+(level+1)+' VON '+themes.length+' GEÖFFNET!');if(level<themes.length-1&&(level+1)%2===0&&lives<3){lives++;popups.push({x:980,y:110,text:'+1 LEBEN',life:2,color:'#fff5c4'});}for(let i=0;i<55;i++)particles.push({x:rnd(150,1100),y:rnd(40,180),vx:rnd(-130,130),vy:rnd(-230,-50),life:rnd(1,2.6),max:2.6,color:['#ffdc60','#f47b6f','#a7e1cc'][i%3],size:rnd(5,11)});record();}
// Non-overlapping speed bands: even the slowest barrel is faster next level.
function barrelSpeed(n){return 112+n*14+rnd(-5,5);}
function ladderDropChance(n){return .24+n*.012;}
function spawnBarrel(){throwTime=.45;barrels.push({x:215,y:surface(4,215)-16,floor:4,dir:1,fall:false,vy:0,rot:0,speed:barrelSpeed(level),scored:false,metal:level>=4&&Math.random()<.22});}
function moveBarrel(b,dt){
 b.rot+=b.dir*b.speed*dt/16;
 if(b.fall){
  b.vy+=1000*dt;b.y+=b.vy*dt;
  const target=surface(b.floor,b.x)-16;
  if(b.y>=target){b.y=target;b.fall=false;b.dir*=-1;b.vy=0;}
  return;
 }
 const previousX=b.x;b.x+=b.dir*b.speed*dt;b.y=surface(b.floor,b.x)-16;
 // Test only when crossing a ladder centre, never once per animation frame.
 const crossed=ladders.filter(l=>l.high===b.floor&&(b.dir>0?previousX<l.x&&b.x>=l.x:previousX>l.x&&b.x<=l.x)).sort((a,c)=>b.dir*(a.x-c.x));
 for(const l of crossed){if(Math.random()<ladderDropChance(level)){
  b.x=l.x;b.y=l.top-16;b.floor=l.low;b.fall=true;b.vy=0;b.scored=false;return;
 }}
 if(b.x>1136||b.x<64){b.x=clamp(b.x,64,1136);b.floor--;if(b.floor<0){b.dead=true;return;}b.fall=true;b.vy=0;b.scored=false;}
}
function update(dt){clock+=dt;throwTime=Math.max(0,throwTime-dt);if(noticeTime>0){noticeTime-=dt;if(noticeTime<=0)$('notice').classList.remove('show');}shake=Math.max(0,shake-dt*30);
 for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=460*dt;p.life-=dt;}particles=particles.filter(p=>p.life>0);for(const p of popups){p.y-=40*dt;p.life-=dt;}popups=popups.filter(p=>p.life>0);
 if(state==='winning'){winTimer-=dt;if(winTimer<=0){if(level<themes.length-1){state='between';showCard('SCHLOSS '+(level+1)+' VON '+themes.length+' GEÖFFNET','Weiter zur<br><em>Prinzessin.</em>','Ein Bann weniger! Der nächste Riegel wartet auf dem Dach „'+themes[level+1].name+'“. Befreie Lumi von allen zehn Schlössern.','NÄCHSTES LEVEL',score.toLocaleString('de-CH')+' Punkte · '+lives+' Leben · alle 2 Levels ein Leben zurück');}else{state='won';showCard('PRINZESSIN LUMI IST FREI','Ein royales<br><em>Happy End!</em>','Zehn Dächer bezwungen, alle Schlösser geöffnet und Prinzessin Lumi befreit. Die Stadt feiert euch!','NOCH EINE RUNDE',score.toLocaleString('de-CH')+' Punkte · Rekord '+best.toLocaleString('de-CH'));$('status').textContent='10 LEVELS GESCHAFFT · PRINZESSIN BEFREIT!';}}return;}
 if(state!=='playing')return;elapsed+=dt;spawn-=dt;jumpQueued=Math.max(0,jumpQueued-dt);if(spawn<=0){spawnBarrel();spawn=Math.max(1.65,2.85-level*.12)+rnd(0,.35);}if(Math.floor(elapsed*10)%10===0)updateHud();
 const p=player,prevY=p.y,move=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),up=keys.has('ArrowUp')||keys.has('KeyW'),down=keys.has('ArrowDown')||keys.has('KeyS');
 p.land=Math.max(0,(p.land||0)-dt*5);p.takeoff=Math.max(0,(p.takeoff||0)-dt*7);p.inv=Math.max(0,p.inv-dt);p.power=Math.max(0,p.power-dt);p.walk+=Math.abs(p.vx)*dt*.065;if(p.onGround)p.coyote=.1;else p.coyote=Math.max(0,p.coyote-dt);
 if(!p.climbing&&(up||down)){const l=ladders.find(l=>Math.abs(p.x-l.x)<25&&((up&&Math.abs(p.y-l.bottom)<15)||(down&&Math.abs(p.y-l.top)<15)||(!p.onGround&&p.y>=l.top&&p.y<=l.bottom)));if(l){p.climbing=l;p.x=l.x;p.vx=0;p.vy=0;p.onGround=false;}}
 if(p.climbing){const l=p.climbing;p.y+=(down?1:0)*155*dt-(up?1:0)*155*dt;p.walk+=(up||down)?dt*11:0;if(p.y<=l.top){p.y=l.top;p.floor=l.high;p.onGround=true;p.climbing=null;}else if(p.y>=l.bottom){p.y=l.bottom;p.floor=l.low;p.onGround=true;p.climbing=null;}if(jumpQueued>0){p.climbing=null;p.vy=-440;p.vx=move*225;p.face=move||p.face;jumpQueued=0;sound.fx('jump');}}
 else{const target=move*245;p.vx+=(target-p.vx)*Math.min(1,dt*(p.onGround?20:9));if(move)p.face=move;p.x=clamp(p.x+p.vx*dt,66,1134);if(jumpQueued>0&&(p.onGround||p.coyote>0)){p.vy=-465;p.takeoff=1;p.onGround=false;p.coyote=0;jumpQueued=0;sound.fx('jump');burst(p.x,p.y,'#f4dfbb',6);}if(p.onGround)p.y=surface(p.floor,p.x);else{p.vy+=1250*dt;p.y+=p.vy*dt;if(p.vy>=0){for(let i=4;i>=0;i--){const y=surface(i,p.x);if(prevY<=y+2&&p.y>=y){p.land=Math.min(1,p.vy/600);if(p.vy>250){burst(p.x,y,themes[level].accent,5);sound.fx("land");}p.y=y;p.floor=i;p.onGround=true;p.vy=0;break;}}}}}
 dustClock-=dt;if(p.onGround&&Math.abs(p.vx)>100&&dustClock<=0){dustClock=.11;particles.push({x:p.x-p.face*10,y:p.y-2,vx:-p.face*rnd(20,45),vy:rnd(-35,-10),life:.3,max:.3,color:"#f4e6ce88",size:rnd(3,6)});}
 for(const s of stars)if(!s.got&&Math.hypot(p.x-s.x,p.y-24-s.y)<34){s.got=true;points(250,s.x,s.y);burst(s.x,s.y,'#ffe173',10);sound.fx('star');}
 if(!hammer.got&&Math.hypot(p.x-hammer.x,p.y-24-hammer.y)<36){hammer.got=true;p.power=8;points(500,hammer.x,hammer.y,'HAMMER!');sound.fx('power');notify('HAMMERZEIT! · 8 SEKUNDEN');}
 for(const b of barrels){moveBarrel(b,dt);if(b.dead)continue;
 const dx=Math.abs(p.x-b.x),dy=Math.abs(p.y-22-b.y);if(p.power>0&&dx<66&&dy<60){b.dead=true;burst(b.x,b.y,b.metal?'#b8e0de':'#eab765',18);points(200,b.x,b.y,'KRACH! +200');sound.fx('smash');shake=reduced?0:4;}else if(dx<27&&dy<31){hurt();}else if(!b.scored&&!p.onGround&&!p.climbing&&dx<29&&p.y<b.y-6&&p.y>b.y-100){b.scored=true;points(100,p.x,p.y-50);sound.tone(600,.07,'triangle',.15);}}
 barrels=barrels.filter(b=>!b.dead);for(const s of sparks){s.cooldown=Math.max(0,s.cooldown-dt);if(s.cooldown>0)continue;s.x=600+Math.sin(clock*.65+s.phase)*310;s.y=surface(s.floor,s.x)-22+Math.sin(clock*4+s.phase)*6;if(Math.hypot(p.x-s.x,p.y-22-s.y)<30){if(p.power>0){s.cooldown=5;s.phase+=3;points(300,s.x,s.y);burst(s.x,s.y,'#ffe59b');sound.fx('smash');s.x=-1000;}else hurt();}}
 if(state==='playing'&&p.floor===4&&p.onGround&&p.x>1050)finish();
}
// Illustration primitives: every character and prop is drawn in-game, at full resolution.
function path(points,fill,stroke=INK,width=3){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineJoin='round';ctx.stroke();}}
function ellipse(x,y,rx,ry,fill,stroke=INK,width=3){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function rect(x,y,w,h,fill,stroke=null,width=3){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.strokeRect(x,y,w,h);}}
function line(x,y,x2,y2,color=INK,width=3){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke();}
function text(t,x,y,size,color=INK,align='center'){ctx.fillStyle=color;ctx.font=`800 ${size}px "Barlow Condensed", Impact, sans-serif`;ctx.textAlign=align;ctx.fillText(t,x,y);}
function starShape(x,y,r,fill,angle=0){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5+angle;pts.push([x+Math.cos(a)*(i%2?r*.46:r),y+Math.sin(a)*(i%2?r*.46:r)]);}path(pts,fill,INK,2.4);}
const buildings=Array.from({length:22},(_,i)=>({x:i*65-30,w:45+(i*37%45),h:85+(i*89%230),ant:i%4===0}));
function background(){if(art){art.background(ctx,level,clock,player.x);return;}const t=themes[level],g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,t.sky[0]);g.addColorStop(1,t.sky[1]);rect(0,0,W,H,g);ellipse(910,151,91,91,level===1?'#f4dec9':'#ffe7aa',null);ctx.save();ctx.globalAlpha=.18;for(let x=8;x<W;x+=15)for(let y=9;y<340;y+=15)ellipse(x,y,1.1,1.1,'#74364a',null);ctx.restore();
 for(let i=0;i<5;i++){const x=(i*293+clock*(reduced?0:2))%1450-120,y=66+(i%3)*55;ctx.save();ctx.globalAlpha=.33;ellipse(x,y,70,13,'#fff3d6',null);ellipse(x+39,y-9,41,15,'#fff3d6',null);ctx.restore();}
 ctx.save();ctx.globalAlpha=.24;for(const b of buildings){rect(b.x,660-b.h,b.w,b.h,t.city);if(b.ant)line(b.x+b.w/2,660-b.h,b.x+b.w/2,625-b.h,t.city,3);}ctx.restore();
 for(const b of buildings){const x=b.x*1.35-70,y=730-b.h*.78;rect(x,y,b.w*1.1,b.h,t.city);rect(x-4,y, b.w*1.1+8,7,t.city);for(let wx=x+10;wx<x+b.w-4;wx+=17)for(let wy=y+17;wy<700;wy+=25)rect(wx,wy,7,10,level===1?'#edc890':'#d8ac9e');}
 // Crane and distant water tower.
 ctx.save();ctx.globalAlpha=.26;const cc=level===1?'#352e58':'#926476';for(let y=70;y<680;y+=55){line(970,y,1010,y+55,cc,3);line(1010,y,970,y+55,cc,3);}line(970,45,970,700,cc,7);line(1010,45,1010,700,cc,7);line(770,65,1160,65,cc,9);line(770,65,990,12,cc,3);line(1160,65,990,12,cc,3);line(790,65,790,200,cc,2);line(790,200,800,211,cc,5);rect(382,235,85,62,cc);ellipse(425,235,43,11,cc,null);line(390,295,378,375,cc,6);line(458,295,471,375,cc,6);ctx.restore();
 // Structural supports, with inked cross bracing.
 for(const x of [115,600,1085]){rect(x-7,198,14,510,'#608980',INK,2);for(let y=200;y<650;y+=123){line(x-50,y+15,x+50,y+118,'#5a827d',5);line(x+50,y+15,x-50,y+118,'#5a827d',5);}}
}
function drawLadder(l){const y1=l.top-3,y2=l.bottom+4;line(l.x-14,y1,l.x-14,y2,INK,9);line(l.x+14,y1,l.x+14,y2,INK,9);line(l.x-14,y1,l.x-14,y2,'#f4d28d',5);line(l.x+14,y1,l.x+14,y2,'#f4d28d',5);for(let y=y1+12;y<y2;y+=17){line(l.x-14,y+2,l.x+14,y+2,INK,6);line(l.x-14,y,l.x+14,y,'#ffe8ab',4);}}
function drawPlatform(i){if(art){art.platform(ctx,level,i,surface,themes[level]);return;}const t=themes[level],left=surface(i,48),right=surface(i,1152);path([[48,left],[1152,right],[1152,right+22],[48,left+22]],t.steel,INK,3);line(50,left+3,1150,right+3,'#c2e5bf',3);for(let x=65;x<1140;x+=50){const y=surface(i,x);line(x,y+18,x+14,y+6,t.edge,3);line(x+14,y+6,x+28,y+18,t.edge,3);ellipse(x+34,y+11,2,2,INK,null);}path([[48,left],[60,left],[60,left+22],[48,left+22]],'#e6b363',INK,2);path([[1140,right],[1152,right],[1152,right+22],[1140,right+22]],'#e6b363',INK,2);}
function barrel(x,y,rot,metal=false,scale=1){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(scale,scale);ellipse(0,0,17,17,metal?'#9fced2':'#b66a3e');ellipse(0,0,12,13,metal?'#c1e0d9':'#e6a25c',INK,2);line(-7,-10,-7,10,metal?'#7b9da7':'#995633',2);line(1,-12,1,12,metal?'#7b9da7':'#995633',2);line(8,-9,8,9,metal?'#7b9da7':'#995633',2);line(-14,-7,14,-7,'#f2cc8e',4);line(-14,7,14,7,'#f2cc8e',4);ellipse(0,0,3,3,'#765042',null);ctx.restore();}
// Curved ink outlines and articulated poses, drawn at the physics character's feet.
function shape(commands,fill,stroke=INK,width=2.5){ctx.beginPath();for(const [op,...a] of commands){if(op==='M')ctx.moveTo(...a);if(op==='L')ctx.lineTo(...a);if(op==='Q')ctx.quadraticCurveTo(...a);if(op==='C')ctx.bezierCurveTo(...a);if(op==='Z')ctx.closePath();}ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.lineJoin='round';ctx.stroke();}}
function limb(a,b,c,color,width){line(...a,...b,INK,width+3);line(...b,...c,INK,width+3);line(...a,...b,color,width);line(...b,...c,color,width);}
function heroPose(p){const running=p.onGround&&Math.abs(p.vx)>16,climbing=!!p.climbing,air=!p.onGround&&!climbing,phase=p.walk;
 const stride=running?Math.sin(phase):0,opposite=running?Math.sin(phase+Math.PI):0;
 return {running,climbing,air,bob:running?-Math.abs(Math.cos(phase))*3:climbing?0:air?0:Math.sin(clock*2.5)*.8,lean:running?.12:air?.07:0,
  legs:climbing?[[[-7,-20],[-13,-12+Math.sin(phase)*5],[-13,-3+Math.sin(phase)*6]],[[7,-20],[13,-12-Math.sin(phase)*5],[13,-3-Math.sin(phase)*6]]]:air?[[[-6,-20],[-14,-16],[-18,-8]],[[6,-20],[18,-27],[22,-17]]]:[[[-6,-20],[-5+stride*9,-12-Math.max(0,-stride)*4],[-7+stride*15,-3-Math.max(0,-stride)*8]],[[6,-20],[6+opposite*9,-12-Math.max(0,-opposite)*4],[8+opposite*15,-3-Math.max(0,-opposite)*8]]],
  arms:climbing?[[[-11,-38],[-19,-44+Math.sin(phase)*7],[-16,-55+Math.sin(phase)*9]],[[11,-38],[19,-44-Math.sin(phase)*7],[16,-55-Math.sin(phase)*9]]]:air?[[[-11,-37],[-21,-42],[-22,-54]],[[11,-37],[20,-44],[24,-53]]]:[[[-10,-37],[-14-opposite*10,-28],[-8-opposite*19,-23-Math.max(0,opposite)*11]],[[10,-37],[14-stride*10,-28],[18-stride*19,-23-Math.max(0,stride)*11]]]};}
function shaded(top,bottom,y=-70,height=75){const g=ctx.createLinearGradient(-20,y,22,y+height);g.addColorStop(0,top);g.addColorStop(1,bottom);return g;}
function person(x,y,scale=1){const p=player,pose=heroPose(p);ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ellipse(0,1,pose.air?14:21,pose.air?2.5:4,'#20243940',null);ctx.scale(1+(p.land||0)*.18-(p.takeoff||0)*.08,1-(p.land||0)*.16+(p.takeoff||0)*.10);ctx.scale(pose.climbing?1:p.face,1);if(p.inv>0&&Math.floor(clock*12)%2===0)ctx.globalAlpha=.45;
 // Rear limbs, with separate knees, elbows and rotating boots.
 const boot=(leg,dark)=>{const foot=leg[2];ctx.save();ctx.translate(...foot);ctx.rotate(pose.air?-.25:pose.running?Math.sin(p.walk+(dark?0:Math.PI))*.22:0);shape([['M',-5,-5],['L',5,-5],['Q',7,-1,12,-1],['Q',15,4,8,5],['L',-6,5],['Z']],dark?'#874b38':'#bd6c42',INK,2);line(-5,3,11,3,'#f3d4a2',2);ctx.restore();};
 limb(...pose.legs[0],'#28586d',9);boot(pose.legs[0],true);limb(...pose.arms[0],'#bd5945',7);ellipse(...pose.arms[0][2],4.5,5,'#f3bc87',INK,2);
 ctx.save();ctx.translate(0,pose.bob);ctx.rotate(pose.lean);
 // Scarf trails in the direction opposite travel.
 const flutter=Math.sin(clock*16)*3*(pose.running||pose.air?1:.25);
 shape([['M',-6,-42],['Q',-19,-44,-31,-41+flutter],['L',-26,-36+flutter],['L',-32,-32+flutter],['Q',-18,-35,-5,-37],['Z']],'#f6bf50',INK,2);
 shape([['M',-10,-41],['Q',0,-45,11,-39],['L',13,-22],['Q',2,-15,-12,-21],['Z']],shaded('#ffad79','#c54c52'),INK,2.5);
 shape([['M',-10,-31],['L',10,-31],['L',12,-19],['Q',0,-13,-12,-19],['Z']],shaded('#76d2cf','#25637e'),INK,2);line(-6,-39,-6,-28,shaded('#76d2cf','#25637e'),4);line(7,-39,7,-28,shaded('#76d2cf','#25637e'),4);ellipse(-6,-28,1.5,1.5,'#ffe591',null);ellipse(7,-28,1.5,1.5,'#ffe591',null);rect(-3,-27,7,5,'#75b9bc');line(-9,-20,9,-20,'#234959',2);line(-8,-38,-8,-33,'#ffd9a0',1.4);
 const nod=pose.running?Math.sin(p.walk)*.045:0;ctx.save();ctx.translate(0,-48);ctx.rotate(nod);
 if(pose.climbing){shape([['M',-12,-4],['Q',-14,13,-7,14],['L',7,14],['Q',14,10,12,-4],['Z']],'#613b32',INK,2);ellipse(0,3,11,10,'#774731',INK,2);}
 else{shape([['M',-11,-7],['Q',6,-14,12,-4],['L',12,1],['Q',20,2,16,6],['L',12,7],['Q',12,15,2,15],['Q',-11,14,-11,5],['Z']],shaded('#ffe2b1','#e7a37e'),INK,2.4);shape([['M',-12,-5],['L',-5,-7],['L',-4,4],['L',-9,8],['L',-12,4],['Z']],'#654133',null);ellipse(-9,6,4,5,'#e9a675',INK,1.5);ellipse(7,1,3,4.5,'#fff9e6',null);ellipse(8,2,1.5,2.7,INK,null);line(3,-5,10,-6,INK,2);shape([['M',4,9],['Q',9,12,12,8]],'#fff6de',INK,1.3);}
 shape([['M',-14,-6],['C',-16,-23,11,-28,14,-8],['L',16,-5],['Q',0,-1,-14,-6],['Z']],shaded('#fff2a0','#e99b2c'),INK,2.5);shape([['M',-9,-13],['Q',-7,-20,3,-20],['L',3,-16],['Q',-5,-16,-9,-10],['Z']],'#ffe995',null);line(2,-21,3,-7,'#d79432',2);shape([['M',-15,-7],['Q',2,-3,20,-7],['L',19,-2],['Q',2,2,-15,-3],['Z']],'#f2b63d',INK,2);ctx.restore();ctx.restore();
 limb(...pose.legs[1],'#4595a9',9);boot(pose.legs[1],false);limb(...pose.arms[1],'#f38361',7);ellipse(...pose.arms[1][2],4.7,5,'#ffcf9f',INK,2);ctx.restore();}
function gorilla(){const y=surface(4,157),wind=state==='playing'?clamp((.75-spawn)/.75,0,1):0,release=throwTime>0?Math.sin((1-throwTime/.45)*Math.PI):0,breathe=Math.sin(clock*2.8)*1.7,beat=state==='menu'?(Math.max(0,Math.sin(clock*1.5))**12):0;
 ctx.save();ctx.translate(153,y);ellipse(0,0,78,9,'#30253835',null);ctx.translate(-wind*5+release*7,breathe);ctx.rotate(-wind*.055+release*.05);
 // Wide shoulders, compact haunches and long knuckle-walking arms.
 ellipse(-30,-11,26,13,'#573b35',INK,3);ellipse(30,-11,26,13,'#573b35',INK,3);
 shape([['M',-43,-33],['C',-68,-67,-55,-118,-13,-124],['C',27,-133,61,-105,55,-64],['L',38,-17],['Q',4,-6,-34,-21],['Z']],shaded('#a5774e','#452b32',-160,160),INK,4);
 shape([['M',-30,-85],['C',-18,-103,23,-104,35,-77],['Q',37,-35,10,-25],['Q',-24,-26,-30,-85],['Z']],shaded('#d6aa75','#8b5740',-110,100),INK,2.5);
 shape([['M',-28,-87],['Q',-8,-100,6,-87],['Q',20,-100,34,-84],['L',28,-69],['Q',3,-75,-21,-66],['Z']],'#c29460',null);
 const arm=(side,raise)=>{ctx.save();ctx.translate(side*43,-89);ctx.rotate(side*(-.14-raise*1.95));shape([['M',-17,-11],['C',-31,8,-23,34,-21,55],['Q',-21,70,2,70],['Q',23,69,22,52],['L',17,3],['Q',13,-22,-17,-11],['Z']],side<0?'#66412f':'#805239',INK,3.5);shape([['M',-20,48],['Q',-6,39,17,49],['L',20,60],['Q',12,74,-14,67],['Z']],'#9c704f',INK,2);for(let i=0;i<4;i++)line(-13+i*8,55,-12+i*8,65,'#503c36',2);ctx.restore();};
 arm(-1,beat*.7);arm(1,wind*.92-release*.3);for(let i=0;i<5;i++){line(-28+i*12,-106+Math.abs(i-2)*3,-31+i*12,-99+Math.abs(i-2)*3,'#e0b77c55',2);}line(-17,-56,17,-56,'#e7bd8270',2);line(-14,-44,14,-44,'#70463366',2);
 ctx.save();ctx.translate(3,-106+wind*3);ctx.rotate(release*.09);
 ellipse(-28,-8,9,11,'#9c704f',INK,3);ellipse(28,-8,9,11,'#9c704f',INK,3);
 shape([['M',-30,3],['C',-40,-37,-18,-56,8,-49],['C',37,-48,42,-18,28,11],['Q',1,31,-30,3],['Z']],shaded('#a5774e','#452b32',-160,160),INK,3.5);
 path([[-19,-43],[-12,-54],[-3,-48],[5,-55],[15,-44]],shaded('#a5774e','#452b32',-160,160),INK,2);
 shape([['M',-25,-25],['Q',-14,-37,0,-28],['Q',17,-37,26,-22],['L',23,-5],['Q',0,10,-25,-4],['Z']],'#b88a60',INK,2);
 ellipse(-12,-19,8,6,'#fff1ca',null);ellipse(13,-19,8,6,'#fff1ca',null);ellipse(-9,-18,2.5,3.5,INK,null);ellipse(16,-18,2.5,3.5,INK,null);line(-25,-29,-4,-24,'#422e2a',6);line(4,-24,25,-29,'#422e2a',6);
 // A broad flat nose and a projecting jaw, rather than a circular snout.
 shape([['M',-13,-9],['Q',0,-15,14,-8],['L',9,1],['Q',0,4,-10,0],['Z']],'#493b35',INK,2);ellipse(-6,-5,3,1.8,'#201d25',null);ellipse(7,-5,3,1.8,'#201d25',null);
 shape([['M',-23,0],['Q',-8,6,0,4],['Q',15,4,23,0],['Q',28,23,1,27],['Q',-26,24,-23,0],['Z']],shaded('#e3c097','#a97751',-30,50),INK,2.5);
 if(wind>.3||beat>.3){ellipse(1,14,14,9,'#39262d',INK,2);path([[-11,8],[-7,15],[-3,8]],'#fff0cd',null);path([[6,8],[10,15],[14,8]],'#fff0cd',null);}else{line(-13,13,14,13,'#50372f',2.5);line(-11,18,10,18,'#d7b186',2);}
 ctx.restore();ctx.restore();
 if(wind>0)barrel(214-wind*30,y-80-wind*65,-wind*2,false,1.05);
 barrel(64,y-18,.2,false,1);barrel(78,y-49,-.3,false,1);
}
function princess(x,y,freed){ctx.save();ctx.translate(x,y);const wave=Math.sin(clock*6),bob=freed?Math.abs(Math.sin(clock*5))*-5:Math.sin(clock*2)*1;ellipse(0,1,24,4,'#30253830',null);ctx.translate(0,bob);
 // Long golden hair, a flared dress, puff sleeves, tiara and a waving hand.
 shape([['M',-14,-60],['C',-28,-48,-18,-29,-26,-19],['Q',0,-9,25,-22],['C',13,-37,27,-63,8,-68],['Z']],'#d69436',INK,2.5);
 ellipse(-7,-3,8,4,'#be4875',INK,2);ellipse(10,-3,8,4,'#be4875',INK,2);
 shape([['M',-10,-36],['Q',-11,-17,-25,-5],['Q',0,6,26,-5],['Q',12,-18,11,-36],['Z']],shaded('#ffa5c5','#b83e81'),INK,2.5);
 shape([['M',-3,-30],['Q',-2,-9,-15,-3],['Q',3,2,16,-4],['Q',5,-14,4,-30],['Z']],'#ffb0cb',null);line(-20,-4,21,-4,'#ffe7ca',2.5);
 limb([-11,-40],[-21,-35],[-23,-21],'#ffd0ad',5);limb([11,-40],[22,-47],[20+wave*5,-61],'#ffd0ad',5);ellipse(20+wave*5,-63,4,5,'#ffd0ad',INK,1.5);
 ellipse(-11,-40,7,7,'#f4a0c0',INK,2);ellipse(11,-40,7,7,'#f4a0c0',INK,2);path([[-9,-41],[0,-36],[9,-41],[8,-27],[-8,-27]],'#c3427e',INK,2);ellipse(0,-33,2.8,3.3,'#7edacb',INK,1);
 ellipse(0,-53,12,14,shaded('#ffead0','#efac8d'),INK,2);shape([['M',-13,-57],['Q',-14,-72,4,-67],['Q',18,-65,13,-49],['Q',7,-51,4,-61],['Q',-2,-53,-13,-52],['Z']],shaded('#fff0a2','#d8953e'),INK,2);ellipse(-4,-52,1.5,2.4,INK,null);ellipse(6,-52,1.5,2.4,INK,null);line(-7,-55,-3,-56,INK,1);line(4,-56,8,-55,INK,1);shape([['M',-3,-45],['Q',1,-41,6,-46]],'#fff5de',INK,1.2);ellipse(-8,-46,3,1.5,'#ed9a8d',null);
 path([[-12,-68],[-15,-79],[-6,-74],[0,-84],[6,-74],[15,-79],[12,-68]],'#ffd95a',INK,2);ellipse(0,-74,2.5,3,'#ef6596',INK,1);ctx.restore();}
function rescueScene(){const x=1080,y=surface(4,x),final=level===themes.length-1,opening=(state==='winning'||state==='won'),freed=final&&opening;
 princess(x+(freed?-Math.min(28,(2.8-winTimer)*15):0),y,freed);
 // One enchanted seal per rooftop. The last seal opens the cage for good.
 const lift=opening?clamp((2.8-winTimer)/1.1,0,1)*112:0;ctx.save();ctx.translate(x,y-lift);ctx.globalAlpha=opening?1-clamp(lift/120,0,1):.82;
 shape([['M',-35,0],['L',-35,-84],['C',-35,-113,35,-113,35,-84],['L',35,0]],'#b7ced011',INK,3);
 for(let bx=-34;bx<=34;bx+=17){line(bx,0,bx,-85,'#526675',4);line(bx+1,0,bx+1,-85,'#c3d7d1',1.2);}line(-36,-84,36,-84,'#526675',5);line(-37,0,37,0,'#526675',5);line(-35,-18,35,-18,'#526675',4);
 ellipse(0,-22,10,11,'#ffcd56',INK,2);ellipse(0,-24,2.5,3,INK,null);line(0,-22,0,-18,INK,2);ctx.restore();
 if(!opening){ctx.save();ctx.translate(x,y-124+Math.sin(clock*2)*2);path([[-48,-17],[48,-17],[48,6],[6,6],[0,13],[-6,6],[-48,6]],'#fff0d5',INK,2);text(final?'LETZTES SCHLOSS!':'RETTE MICH!',0,0,14);ctx.restore();}
 if(freed){for(let i=0;i<3;i++){const hx=x-22+i*23,hy=y-88-(clock*22+i*17)%65;ctx.save();ctx.translate(hx,hy);shape([['M',0,5],['C',-18,-7,-7,-15,0,-7],['C',7,-15,18,-7,0,5]],'#f17b9f',INK,1.5);ctx.restore();}}
}

function hammerArt(x,y,angle=0,scale=1){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);rect(-3,-2,7,29,'#b6754d',INK,2);path([[-16,-12],[15,-12],[18,1],[-16,1]],'#b7d7ce',INK,3);rect(-15,-10,6,9,'#e4ece0');ctx.restore();}
function draw(){ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.clearRect(0,0,W,H);ctx.save();if(shake)ctx.translate(rnd(-shake,shake),rnd(-shake/2,shake/2));background();for(const l of ladders)drawLadder(l);for(let i=0;i<5;i++)drawPlatform(i);
 rescueScene();
 gorilla();
 for(const s of stars)if(!s.got){const bob=reduced?0:Math.sin(clock*3+s.phase)*3;ctx.save();ctx.globalAlpha=.14;ellipse(s.x,s.y+bob,23,23,'#fff5b5',null);ctx.restore();ctx.save();ctx.shadowBlur=12;ctx.shadowColor='#ffe785';starShape(s.x,s.y+bob,12,'#ffdb62',Math.sin(clock*2+s.phase)*.12);ctx.restore();line(s.x-3,s.y-7+bob,s.x+1,s.y-7+bob,'#fff9d9',2);if(Math.sin(clock*3+s.phase)>.7){line(s.x+17,s.y-18+bob,s.x+17,s.y-10+bob,'#fff4c3',1.5);line(s.x+13,s.y-14+bob,s.x+21,s.y-14+bob,'#fff4c3',1.5);}}
 if(!hammer.got){const hy=hammer.y+Math.sin(clock*3)*4;ellipse(hammer.x,hy,25,25,'#fff0bb77',null);hammerArt(hammer.x,hy-6,-.5,.9);}
 for(const b of barrels)barrel(b.x,b.y,b.rot,b.metal);
 // Menu preview includes a few rolling hazards before play begins.
 if(state==='menu'){barrel(760,surface(3,760)-16,clock);barrel(550,surface(2,550)-16,-clock);barrel(965,surface(0,965)-16,clock*.8);}
 for(const s of sparks){if(s.cooldown>0)continue;if(state==='menu')s.y=surface(s.floor,s.x)-22;const pts=[];for(let i=0;i<16;i++){const a=i*TAU/16,r=i%2?11:19+Math.sin(clock*15+i)*3;pts.push([s.x+Math.cos(a)*r,s.y+Math.sin(a)*r]);}path(pts,'#ffd55f',INK,2);ellipse(s.x,s.y,9,11,'#f78c59',null);ellipse(s.x-3,s.y-2,2,3,INK,null);ellipse(s.x+4,s.y-2,2,3,INK,null);}
 if(player.power>0){ctx.save();ctx.globalAlpha=.2+.1*Math.sin(clock*10);ellipse(player.x,player.y-28,38,40,'#fff3b3',null);ctx.restore();}
 person(player.x,player.y,1.08);if(player.power>0){hammerArt(player.x+player.face*28,player.y-50,player.face*(Math.sin(clock*15)*.8+.4),1.15);rect(player.x-22,player.y-80,44,5,'#302538');rect(player.x-21,player.y-79,42*player.power/8,3,'#ffda64');}
 if(art)art.foreground(ctx,level,clock);
 // Little site details.
 path([[82,surface(0,82)-2],[94,surface(0,94)-29],[106,surface(0,106)-2]],'#ef865a',INK,2);line(89,surface(0,89)-12,101,surface(0,101)-12,'#ffe9ba',4);
 for(const p of particles){ctx.save();ctx.globalAlpha=Math.min(1,p.life*2);ctx.translate(p.x,p.y);ctx.rotate(p.life*7);rect(-p.size/2,-p.size/2,p.size,p.size,p.color);ctx.restore();}
 for(const p of popups){ctx.save();ctx.globalAlpha=Math.min(1,p.life*2);ctx.font='800 23px "Barlow Condensed", Impact, sans-serif';ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle=INK;ctx.strokeText(p.text,p.x,p.y);ctx.fillStyle=p.color;ctx.fillText(p.text,p.x,p.y);ctx.restore();}
 ctx.restore();}
function frame(t){const delta=Math.min((t-last)/1000||0,.05);last=t;if(state==='playing'||state==='winning'||state==='menu'){acc+=delta;while(acc>=1/120){update(1/120);acc-=1/120;}}draw();requestAnimationFrame(frame);}
$('play').addEventListener('click',start);$('pause').addEventListener('click',()=>state==='paused'?resume():pause());
$('sound').addEventListener('click',()=>{sound.enabled=!sound.enabled;sound.start();sound.update();});$('volume').addEventListener('input',e=>{sound.volume=e.target.value/100;sound.update();});
let helpWasPlaying=false;function closeHelp(){$('instructions').close();if(helpWasPlaying&&state==='paused')resume();helpWasPlaying=false;} $('help').onclick=()=>{helpWasPlaying=state==='playing';if(helpWasPlaying)pause();$('instructions').showModal();};$('close-help').onclick=closeHelp;$('help-ok').onclick=closeHelp;$('instructions').addEventListener('cancel',e=>{e.preventDefault();closeHelp();});
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.querySelector('.cabinet').requestFullscreen();}catch{notify('Vollbild wird hier nicht unterstützt.');}};
document.addEventListener('keydown',e=>{if($('instructions').open)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)&&e.target.tagName!=='INPUT')e.preventDefault();if(e.repeat)return;if(e.code==='KeyP'||e.code==='Escape'){state==='paused'?resume():pause();return;}if(e.code==='KeyM'){sound.enabled=!sound.enabled;sound.start();sound.update();return;}if((e.code==='Enter'||e.code==='Space')&&['menu','over','won','between'].includes(state)&&e.target!==$('play')){start();return;}keys.add(e.code);if(e.code==='Space'||e.code==='KeyX')jumpQueued=.15;});document.addEventListener('keyup',e=>keys.delete(e.code));
for(const button of document.querySelectorAll('[data-key]')){const key=button.dataset.key;button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(key);button.classList.add('pressed');if(key==='Space')jumpQueued=.15;});for(const ev of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(ev,()=>{keys.delete(key);button.classList.remove('pressed');});}
window.addEventListener('blur',()=>{keys.clear();pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();pause();}});
function resizeCanvas(){const r=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1200,Math.round(r.width*d));canvas.height=Math.round(canvas.width*H/W);}window.addEventListener('resize',resizeCanvas);resizeCanvas();
setup(0);requestAnimationFrame(frame);
// Read-only diagnostics for quality checks; no gameplay controls or hidden cheats.
window.kongDiagnostics=()=>({state,level:level+1,score,lives,barrels:barrels.length,player:{x:player.x,y:player.y,floor:player.floor,climbing:!!player.climbing},audio:sound.ctx?.state||'not-started'});
})();
