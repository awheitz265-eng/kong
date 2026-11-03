/* Original, engine-free Canvas illustration. Static scenery is cached per level. */
(() => {
'use strict';
const TAU=Math.PI*2,INK='#302b40';
const palettes=[
 ['#6c8cbd','#ffd8a1','#526884','#8c8fa4','#bd9695'],
 ['#191e46','#845b99','#252c55','#3e4776','#6d5583'],
 ['#579ac0','#e3dcca','#355b76','#628fa6','#8aadb9'],
 ['#7fa6a0','#f0dfaa','#486a68','#709285','#9ca990'],
 ['#5d526d','#edb47f','#494957','#7b6572','#a78178'],
 ['#34465f','#a2b0bb','#2c425e','#4b637b','#73879c'],
 ['#648bbc','#f7dfc1','#587396','#8298b4','#b2bbc9'],
 ['#53799b','#d6e7ec','#375b7d','#64899e','#97b5c3'],
 ['#4c304d','#fcae72','#432d48','#765069','#af726f'],
 ['#322950','#df9ba9','#373251','#625378','#9a7597']];
class Art {
 constructor(){this.layers=new Map();this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}
 gradient(c,x,y,x2,y2,a,b){const g=c.createLinearGradient(x,y,x2,y2);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
 rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h);}
 line(c,x,y,x2,y2,color,width=2){c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
 poly(c,points,fill,stroke=null,width=2){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.lineJoin='round';c.stroke();}}
 oval(c,x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fillStyle=fill;c.fill();}
 glow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#ffffff00');this.oval(c,x,y,r,r,g);}
 cloud(c,x,y,s,color){c.save();c.translate(x,y);c.scale(s,s);c.beginPath();c.moveTo(-75,10);c.bezierCurveTo(-110,-12,-65,-29,-43,-20);c.bezierCurveTo(-40,-67,23,-67,37,-29);c.bezierCurveTo(75,-46,96,-4,72,11);c.bezierCurveTo(35,21,-42,20,-75,10);c.fillStyle=color;c.fill();c.restore();}
 tower(c,x,y,w,h,color,style=0,night=false){this.rect(c,x,y,w,h,this.gradient(c,x,y,x+w,y,color,'#3b425c'));this.poly(c,[[x+w,y],[x+w+18,y-9],[x+w+18,y+h],[x+w,y+h]],'#3a405b66');this.rect(c,x-4,y-5,w+8,8,'#c1bdbe66');if(style===1){this.rect(c,x+w*.35,y-27,w*.3,24,color);this.line(c,x+w/2,y-60,x+w/2,y-27,color,3);}if(style===2)this.poly(c,[[x-4,y-4],[x+w/2,y-35],[x+w+4,y-4]],color);
  for(let yy=y+17;yy<y+h-10;yy+=23)for(let xx=x+10;xx<x+w-9;xx+=18){const on=((xx*7+yy*3)|0)%9<5;this.rect(c,xx,yy,7,11,night&&on?'#ffd795aa':'#d6dfe12f');this.line(c,xx,yy+11,xx+8,yy+11,'#1c30412b',2);}
 }
 crane(c,x,y,w,color){this.rect(c,x,y,12,520,color);for(let yy=y;yy<y+480;yy+=35){this.line(c,x-12,yy,x+23,yy+35,color,3);this.line(c,x+23,yy,x-12,yy+35,color,3);}this.line(c,x-w*.38,y,x+w*.62,y,color,9);this.line(c,x-w*.38,y,x+6,y-40,color,3);this.line(c,x+6,y-40,x+w*.62,y,color,3);this.line(c,x+w*.5,y,x+w*.5,y+98,color,2);this.line(c,x+w*.5,y+98,x+w*.5+10,y+110,color,5);this.rect(c,x-25,y-5,43,30,color);}
 tree(c,x,y,s=1){this.line(c,x,y,x,y-60*s,'#536854',8*s);this.oval(c,x,y-68*s,31*s,38*s,'#385f58');this.oval(c,x-17*s,y-62*s,23*s,26*s,'#53816a');this.oval(c,x+10*s,y-83*s,23*s,28*s,'#73a77a');this.line(c,x,y-30*s,x+17*s,y-57*s,'#48634e',3*s);}
 castle(c,x,y,w,h){this.tower(c,x,y,w,h,'#a19bb6',0,true);for(let xx=x-4;xx<x+w+8;xx+=18)this.rect(c,xx,y-15,10,20,'#c2b5ca');this.poly(c,[[x-12,y-18],[x+w/2,y-82],[x+w+12,y-18]],'#855b89',INK,2);this.line(c,x+w/2,y-80,x+w/2,y-116,'#cdb6a9',3);this.poly(c,[[x+w/2,y-115],[x+w/2+35,y-107],[x+w/2,y-94]],'#efb35d');for(let yy=y+24;yy<y+h;yy+=45){this.oval(c,x+w/2,yy,8,13,'#f5cd9388');this.rect(c,x+w/2-8,yy,16,13,'#f5cd9388');}}
 build(n){const sky=document.createElement('canvas'),far=document.createElement('canvas'),near=document.createElement('canvas');for(const el of [sky,far,near]){el.width=1320;el.height=720;}const c=sky.getContext('2d'),f=far.getContext('2d'),q=near.getContext('2d'),p=palettes[n],night=[1,5,9].includes(n);
 this.rect(c,0,0,1320,720,this.gradient(c,0,0,0,720,p[0],p[1]));
 // Warm backlight / moon halo with broad, translucent rays.
 this.glow(c,950,112,330,night?'#fff0e727':'#ffe3ad70');this.oval(c,950,112,night?39:67,night?39:67,night?'#e8e4d3':'#ffe8b5');
 if(night){for(let i=0;i<75;i++){const x=(i*193)%1320,y=(i*67)%320;this.oval(c,x,y,i%5===0?1.8:.8,'#fff5dba0');}this.oval(c,964,104,39,39,p[0]);}else{c.save();c.globalAlpha=.07;for(let i=0;i<5;i++)this.poly(c,[[950,112],[150+i*320,720],[400+i*320,720]],'#fff5cd');c.restore();}
 for(let i=0;i<4;i++)this.cloud(c,130+i*350,100+(i%2)*78,.65+i*.13,night?'#bd9ac01b':'#fff5e540');
 // Distant architecture has softer edges and lower contrast.
 f.globalAlpha=.4;for(let i=0;i<22;i++){const h=90+(i*79+n*29)%230,w=43+(i*37)%44;this.tower(f,i*68-20,580-h,w,h,p[3],i%3,night);}f.globalAlpha=1;
 for(let i=0;i<13;i++){const h=85+(i*57+n*17)%160;this.tower(q,i*111-20,690-h,66+(i*23)%35,h,p[4],i%3,night);}
 // Landmark illustrations are unique to each world.
 if(n===0){f.globalAlpha=.65;this.crane(f,390,205,430,p[2]);this.crane(f,1050,275,320,p[2]);f.globalAlpha=1;this.rect(q,713,410,82,78,'#c8a38d');this.oval(q,754,410,41,12,'#e1c3a3');this.poly(q,[[708,407],[754,379],[799,407]],'#787382');for(let xx=723;xx<790;xx+=18)this.line(q,xx,420,xx,480,'#9d7b72',2);this.line(q,721,488,706,560,'#746975',6);this.line(q,786,488,801,560,'#746975',6);}
 if(n===1){for(let i=0;i<5;i++){const x=160+i*244,y=270+(i%3)*70;this.rect(q,x,y,39,112,'#33334e');q.save();q.shadowColor=i%2?'#7be5de':'#ed90bd';q.shadowBlur=18;q.strokeStyle=i%2?'#7be5de':'#ed90bd';q.lineWidth=3;q.strokeRect(x+4,y+4,31,104);q.fillStyle=q.strokeStyle;q.font='800 18px sans-serif';q.textAlign='center';['夜','光','星'].forEach((t,j)=>q.fillText(t,x+19,y+29+j*30));q.restore();}this.line(f,70,320,1280,320,'#dbacd171',3);}
 if(n===2){this.rect(q,0,520,1320,200,this.gradient(q,0,520,0,720,'#77bec2','#326f93'));for(let i=0;i<55;i++)this.line(q,(i*97)%1320,535+(i*23)%160,(i*97)%1320+22+(i%7)*9,535+(i*23)%160,'#cce1ce55',2);for(const x of [220,760]){this.poly(q,[[x,560],[x+205,560],[x+170,600],[x+25,600]],'#3e5874',INK,2);this.rect(q,x+30,524,118,34,'#b77e6b');for(let j=0;j<5;j++)this.rect(q,x+38+j*21,530,13,13,'#e4c79b');this.rect(q,x+140,504,35,55,'#e1dbbd');this.line(q,x+164,500,x+164,438,'#476981',3);}this.crane(f,330,240,420,p[2]);this.crane(f,1050,290,310,p[2]);}
 if(n===3){for(const x of [150,540,960]){this.rect(q,x,418,180,100,'#78a9a077');this.poly(q,[[x-10,418],[x+90,350],[x+190,418]],'#cbe1b790','#6b8e83',3);for(let i=0;i<5;i++)this.line(q,x+i*45,418,x+i*45,517,'#588077',4);this.line(q,x,465,x+180,465,'#588077',4);for(let i=0;i<5;i++)this.tree(q,x+18+i*34,520,.55);}for(let i=0;i<7;i++)this.tree(q,70+i*195,690,.9+(i%3)*.2);}
 if(n===4||n===8){for(let i=0;i<4;i++){const x=210+i*283,y=310+(i%2)*80;this.rect(f,x,y,45,350,p[2]);this.rect(f,x-6,y-7,57,15,p[4]);for(let j=0;j<5;j++)this.rect(f,x,y+30+j*38,45,7,'#d79c7250');}for(const x of [370,890]){this.rect(q,x,440,130,180,'#9c786b');this.oval(q,x+65,440,65,22,'#bf9981');this.line(q,x-30,505,x+170,505,'#65747a',14);this.line(q,x+170,505,x+170,635,'#65747a',14);for(let j=0;j<3;j++)this.rect(q,x+15+j*35,475,21,51,n===8?'#ffc477':'#e0ad76');}if(n===8)this.glow(q,640,690,290,'#ff963f80');}
 if(n===5){this.line(f,40,370,1270,370,'#303c57',12);for(const x of [250,990]){this.line(f,x,290,x,600,'#364761',18);for(let j=-4;j<=4;j++)this.line(f,x,290,x+j*60,370,'#4c5874',2);}for(let i=0;i<7;i++){const x=130+i*172;this.line(q,x,470,x,620,'#3c4a63',5);this.line(q,x,470,x+30,470,'#3c4a63',5);this.glow(q,x+30,478,50,'#ffdea555');this.oval(q,x+30,478,5,3,'#ffe1ae');}}
 if(n===6){for(let i=0;i<7;i++)this.cloud(q,i*215,540+(i%3)*55,1.6,'#fff5e8c0');for(const x of [280,840]){this.line(f,x,240,x,550,'#8390a9',9);this.line(f,x-110,280,x+110,280,'#8390a9',7);this.poly(f,[[x-12,245],[x,220],[x+12,245]],'#b5bfd1');}this.poly(f,[[990,240],[1045,210],[1048,243],[998,258]],'#e2ac9d');this.line(f,1019,254,1019,292,'#a38490',1);}
 if(n===7){for(let i=0;i<5;i++){const x=i*310;this.poly(f,[[x-100,540],[x+140,210+(i%2)*70],[x+360,540]],i%2?'#9bb7c5':'#83a3b6');this.poly(f,[[x+65,320],[x+140,210+(i%2)*70],[x+225,340],[x+160,310],[x+120,333]],'#e8eff0');}for(let i=0;i<8;i++){const x=90+i*170;this.line(q,x,500,x,690,'#688496',7);for(let j=0;j<4;j++)this.poly(q,[[x-45-j*5,640-j*30],[x,520-j*15],[x+45+j*5,640-j*30]],j%2?'#8eafad':'#c2d7d0');}}
 if(n===9){this.castle(f,100,330,110,340);this.castle(f,1030,330,110,340);this.castle(f,390,260,100,390);this.castle(f,790,260,100,390);this.rect(f,450,400,390,260,'#9986a6');this.castle(f,580,210,150,450);for(let x=480;x<840;x+=60)this.rect(f,x,390,25,25,'#c4afc4');this.glow(f,650,390,270,'#ecc2e32c');}
 const result={sky,far,near};this.layers.set(n,result);return result;
 }
 background(c,n,time,playerX){const a=this.layers.get(n)||this.build(n),t=this.reduced?0:time,pan=this.reduced?0:(playerX-600)*.018;c.drawImage(a.sky,-60,0);c.drawImage(a.far,-60-pan*.35,0);c.drawImage(a.near,-60-pan,0);
 // Moving clouds/smoke are kept separate from cached architecture.
 if([0,2,6].includes(n)){c.globalAlpha=.3;for(let i=0;i<3;i++)this.cloud(c,(i*460+t*5)%1560-180,110+i*48,.65,'#fff8e3');c.globalAlpha=1;}
 if(n===4||n===8){for(let i=0;i<9;i++){const phase=(t*.11+i*.115)%1;c.globalAlpha=(1-phase)*.22;this.cloud(c,135+(i%4)*283+phase*90,290-phase*200, .25+phase*.8,'#d6b7b3');}c.globalAlpha=1;}
 // Load-bearing columns sit behind the playable surfaces.
 for(const x of [115,600,1085]){this.rect(c,x-8,190,16,510,'#25374455');this.rect(c,x-5,190,4,510,'#e7e8cd33');for(let y=200;y<650;y+=123){this.line(c,x-44,y+18,x+44,y+112,'#3e686055',5);this.line(c,x+44,y+18,x-44,y+112,'#3e686055',5);}}
 }
 platform(c,n,i,yAt,theme){const a=yAt(i,48),b=yAt(i,1152),g=this.gradient(c,0,a,0,a+27,theme.steel,theme.edge);
 this.poly(c,[[48,a+6],[1152,b+6],[1160,b+26],[56,a+26]],'#202c3d66');this.poly(c,[[48,a],[1152,b],[1152,b+22],[48,a+22]],g,INK,2.5);this.poly(c,[[48,a],[1152,b],[1145,b-6],[55,a-6]],'#d4e0c7');this.line(c,49,a+3,1150,b+3,'#f4f1cb80',2);this.line(c,50,a+20,1150,b+20,theme.edge,4);
 for(let x=66;x<1140;x+=48){const y=yAt(i,x);if(n===3){this.line(c,x,y+4,x+3,y+18,'#527957',2);this.line(c,x+13,y+8,x+38,y+10,'#416b5444',1);}else{this.poly(c,[[x,y+6],[x+20,y+6],[x+10,y+17]],theme.edge);this.oval(c,x+31,y+10,2.8,2.8,'#253a42');this.oval(c,x+30,y+9,1.2,1.2,'#eef1d0');}}
 if(n===7){this.line(c,52,a-4,1146,b-4,'#eff8f4',5);for(let x=94;x<1140;x+=113){const y=yAt(i,x);this.poly(c,[[x,y+22],[x+11,y+22],[x+5,y+43]],'#b7dbe8b0');}}
 if(n===1||n===9){c.save();c.shadowBlur=9;c.shadowColor=n===1?'#6ef5db':'#f2c176';this.line(c,60,a+23,1140,b+23,c.shadowColor,1.5);c.restore();}
 for(const x of [48,1140]){const y=yAt(i,x);this.rect(c,x,y,12,22,'#dcb275');this.line(c,x,y+3,x+10,y+15,'#584747',3);this.line(c,x,y+14,x+6,y+22,'#584747',3);}
 }
 foreground(c,n,time){const t=this.reduced?0:time;
 if(n===3){for(const x of [36,1168]){for(let i=0;i<7;i++){const y=200+i*69;this.line(c,x,y,x+Math.sin(i)*12,y+70,'#4c775a',3);for(let j=0;j<3;j++){this.oval(c,x+(j%2?-10:10),y+j*19,12,5,j%2?'#83b375':'#557f57');}}}}
 if(n===5){c.save();c.globalAlpha=.32;for(let i=0;i<105;i++){const x=((i*127-t*95)%1300+1300)%1300,y=(i*79+t*490)%740;this.line(c,x,y,x-6,y+19,'#d1e5f2',1);}c.restore();}
 if(n===7){for(let i=0;i<62;i++){const x=(i*179+Math.sin(t+i)*16)%1200,y=(i*97+t*(13+i%7))%720;c.globalAlpha=.25+(i%4)*.14;this.oval(c,x,y,1+i%3,1+i%3,'#f5ffff');}c.globalAlpha=1;}
 if([3,8,9].includes(n)){for(let i=0;i<24;i++){const x=(i*197+Math.sin(t*.7+i)*28)%1200,y=(i*83-t*(n===8?28:6)+72000)%720;this.glow(c,x,y,5,n===8?'#ffad4e99':'#ffeb9c88');this.oval(c,x,y,1.2,1.2,'#ffedb8');}}
 const v=c.createRadialGradient(600,340,270,600,340,720);v.addColorStop(0,'#151b3000');v.addColorStop(1,'#151b303b');this.rect(c,0,0,1200,720,v);
 }
}
window.RooftopArt=Art;
})();
