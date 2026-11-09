/* BROT · Un univers Yayoi Kusama — interaccions
   Cada sala és un mòdul: HERO, REPETICIÓ, ACUMULACIÓ, INFINIT, DISSOLUCIÓ DEL JO, RITUAL, CICLE VITAL.
   Un sol bucle requestAnimationFrame només anima les sales visibles. */
(()=>{
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd=(a,b)=>a+Math.random()*(b-a);
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const C={bone:css('--bone')||'#f2ece1',ink:css('--ink')||'#16110f',red:css('--cadmium')||'#d32a1d',yel:css('--chrome')||'#f3c316',blue:css('--cobalt')||'#2337c6'};

/* ---------- comptador global + rastre ---------- */
let total=0;
const gEl=document.getElementById('gcount'), pip=document.getElementById('pip'), endN=document.getElementById('end-n');
const trace=document.getElementById('trace'), tctx=trace.getContext('2d');
let tdots=[]; const TMAX=9000;
function sizeTrace(){const d=Math.min(2,devicePixelRatio||1);trace.width=innerWidth*d;trace.height=innerHeight*d;tctx.setTransform(d,0,0,d,0,0);tctx.clearRect(0,0,innerWidth,innerHeight);for(const p of tdots)drawT(p)}
function drawT(p){tctx.fillStyle=`rgba(255,255,255,${p.a})`;tctx.beginPath();tctx.arc(p.x*innerWidth,p.y*innerHeight,p.r,0,7);tctx.fill()}
addEventListener('resize',sizeTrace);sizeTrace();
const milestones={40:'Primer rastre: mira els punts petits que apareixen per tota la pàgina.',250:'La repetició ja comença a tapar la web.',800:'Ara el patró és més present que el contingut.',2000:'Ja no hi ha fons. Només gest repetit.'};
const toast=document.getElementById('toast');let tt;
function say(m){toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>toast.classList.remove('show'),3800)}
let pipT;
function tick(n=1){
  for(let i=0;i<n;i++){
    total++;
    if(milestones[total])say(milestones[total]);
    if(tdots.length<TMAX && Math.random()<.6){const p={x:Math.random(),y:Math.random(),r:rnd(1,2.8)*(1+Math.min(total,3000)/3000),a:rnd(.35,.8)};tdots.push(p);drawT(p)}
  }
  gEl.textContent=String(total).padStart(5,'0');endN.textContent=total.toLocaleString('ca');
  pip.classList.add('on');if(window.innerWidth>860)document.querySelector('.hud').style.setProperty('--hs',Math.min(150,74+Math.log2(1+total)*6)+'px');clearTimeout(pipT);pipT=setTimeout(()=>pip.classList.remove('on'),120);
}
document.getElementById('trace-clear').onclick=()=>{tdots=[];sizeTrace();say('Rastre esborrat. El comptador continua: el que has fet, ho has fet.')};


/* ---------- espai lliure de cada escenari (desktop) ---------- */
function freeX(id,w){const t=document.querySelector('#'+id+' .txt');if(!t||getComputedStyle(t).position!=='absolute')return{x0:0,x1:w};const r=t.getBoundingClientRect(),s=t.parentElement.getBoundingClientRect();const L=r.left-s.left;return L<w/2?{x0:r.width,x1:w}:{x0:0,x1:L}}

/* ---------- navegació de punts + HUD ---------- */
const navA=[...document.querySelectorAll('.dots a')];
const secs=navA.map(a=>document.querySelector(a.getAttribute('href')));
const navIO=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){navA.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}},{rootMargin:'-45% 0px -45% 0px'});secs.forEach(sec=>sec&&navIO.observe(sec));
const hud=document.querySelector('.hud');
/* ---------- el cursor també es repeteix ---------- */
const echo=document.getElementById('echo');const trail=[];
if(matchMedia('(pointer:fine)').matches&&!RM){for(let i=0;i<9;i++){const d=document.createElement('i');d.style.opacity=(1-i/10).toFixed(2);d.style.width=d.style.height=(10-i*.7)+'px';echo.appendChild(d);trail.push({el:d,x:-50,y:-50})}
  let mx=-50,my=-50;addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
  (function run(){let x=mx,y=my;for(const t of trail){t.x+=(x-t.x)*.35;t.y+=(y-t.y)*.35;t.el.style.transform=`translate(${t.x}px,${t.y}px)`;x=t.x;y=t.y}requestAnimationFrame(run)})();}

/* ---------- escenaris ---------- */
function stage(id,onResize){
  const cv=document.getElementById(id),ctx=cv.getContext('2d');
  const S={cv,ctx,w:1,h:1,vis:false};
  const rs=()=>{const r=cv.getBoundingClientRect();const d=Math.min(2,devicePixelRatio||1);if(r.width<2)return;S.w=r.width;S.h=r.height;cv.width=Math.round(r.width*d);cv.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);onResize&&onResize(S)};
  new ResizeObserver(rs).observe(cv);
  new IntersectionObserver(e=>{S.vis=e[0].isIntersecting},{rootMargin:'80px'}).observe(cv);
  return S;
}
const pos=(e,cv)=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};

/* ===== PORTADA: camp de punts que reacciona ===== */
const P=stage('c-cover');
let cp={x:-999,y:-999,act:0};
P.cv.parentElement.addEventListener('pointermove',e=>{const r=P.cv.getBoundingClientRect();cp.x=e.clientX-r.left;cp.y=e.clientY-r.top;cp.act=performance.now()});
function stepCover(t){
  const{ctx,w,h}=P;ctx.fillStyle=C.red;ctx.fillRect(0,0,w,h);
  let px=cp.x,py=cp.y;
  if(performance.now()-cp.act>2500){px=w*(.62+.25*Math.sin(t*.35));py=h*(.45+.3*Math.sin(t*.53+1))}
  const sp=w<600?20:26,R=Math.min(w,h)*.42;
  for(let y=sp/2;y<h;y+=sp)for(let x=sp/2;x<w;x+=sp){
    const d=Math.hypot(x-px,y-py),k=Math.max(0,1-d/R);
    const wave=RM?0:Math.sin(t*1.2+x*.02+y*.015)*.6;
    const r=1.6+wave+k*k*sp*.42;
    ctx.fillStyle=k>.55?C.yel:k>.2?C.bone:'rgba(242,236,225,.45)';
    ctx.beginPath();ctx.arc(x,y,Math.max(.6,r),0,7);ctx.fill();
  }
}

/* ===== HERO: un punt que es duplica ===== */
const H=stage('c-hero',S=>{if(!hero.length)seedHero(S);drawHero()});
let hero=[],heroR=0;
function seedHero(S){hero=[{x:S.w*.72,y:S.h*.58,r:Math.min(S.w,S.h)*.16,tx:S.w*.72,ty:S.h*.58}]}
function drawHero(){const{ctx,w,h}=H;ctx.clearRect(0,0,w,h);ctx.fillStyle=C.red;for(const d of hero){ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,7);ctx.fill()}}
H.cv.addEventListener('click',e=>{
  if(hero.length>=4096){seedHero(H);heroR=0;say('Tornem a un sol punt. Torna-ho a provar.');}
  else{
    const add=[];
    for(const d of hero){
      d.r=Math.max(2.2,d.r*.72);
      const a=rnd(0,7),k=d.r*rnd(2.2,3.4);
      add.push({x:d.x,y:d.y,r:d.r,tx:Math.min(H.w,Math.max(0,d.tx+Math.cos(a)*k)),ty:Math.min(H.h,Math.max(0,d.ty+Math.sin(a)*k))});
    }
    hero=hero.concat(add);heroR++;tick(Math.min(add.length,64));
  }
  document.getElementById('hero-n').textContent=hero.length.toLocaleString('ca');
  document.getElementById('hero-r').textContent=heroR;
});
function stepHero(){let moving=false;for(const d of hero){const dx=d.tx-d.x,dy=d.ty-d.y;if(Math.abs(dx)+Math.abs(dy)>.3){d.x+=dx*.12;d.y+=dy*.12;moving=true}}if(moving)drawHero()}

/* ===== REPETICIÓ: xarxa ===== */
let loops=[],netLayer=0,netCount=0;
const N=stage('c-net',()=>redrawNet());
const netCol=l=>l%3===1?C.red:l%3===2?C.blue:C.ink;
function loop(ctx,x,y,r,a,l){ctx.strokeStyle=netCol(l);ctx.globalAlpha=.78;ctx.lineWidth=1.25;ctx.beginPath();ctx.arc(x,y,r,a,a+Math.PI);ctx.stroke();ctx.globalAlpha=1}
function redrawNet(){const{ctx,w,h}=N;ctx.clearRect(0,0,w,h);for(let i=0;i<loops.length;i+=5)loop(ctx,loops[i],loops[i+1],loops[i+2],loops[i+3],loops[i+4])}
function addLoop(x,y,r,a,auto){if(loops.length>150000)loops.splice(0,5000);loops.push(x,y,r,a,netLayer);loop(N.ctx,x,y,r,a,netLayer);netCount++;document.getElementById('net-n').textContent=netCount.toLocaleString('ca')+' llaçades'+(netLayer?` · capa ${netLayer+1}`:'');if(!auto)tick()}
let nd=null,acc=0;
N.cv.addEventListener('pointerdown',e=>{N.cv.setPointerCapture(e.pointerId);nd=pos(e,N.cv);acc=0});
N.cv.addEventListener('pointermove',e=>{if(!nd)return;const p=pos(e,N.cv);const dx=p.x-nd.x,dy=p.y-nd.y,d=Math.hypot(dx,dy);const step=9;if(d<1)return;const ang=Math.atan2(dy,dx);let t=acc;while(t<d){const x=nd.x+dx*t/d,y=nd.y+dy*t/d;addLoop(x+rnd(-2,2),y+rnd(-2,2),rnd(5,9),ang+rnd(-.3,.3));t+=step}acc=t-d;nd=p});
const endNet=()=>nd=null;N.cv.addEventListener('pointerup',endNet);N.cv.addEventListener('pointercancel',endNet);
let netAuto=!RM,ax=10,ay=12,adir=1;
const autoBtn=document.getElementById('net-auto');
const setAutoLabel=()=>autoBtn.firstElementChild.textContent=netAuto?'Atura la mà':'Mà automàtica';
setAutoLabel();
autoBtn.onclick=()=>{netAuto=!netAuto;setAutoLabel()};
document.getElementById('net-clear').onclick=()=>{loops=[];netLayer=0;netCount=0;ax=10;ay=12;adir=1;redrawNet();document.getElementById('net-n').textContent='0 llaçades'};
const speedEl=document.getElementById('net-speed');
function stepNet(){
  if(!netAuto)return;
  const n=+speedEl.value;
  for(let i=0;i<n;i++){
    const r=rnd(5.5,8);
    addLoop(ax+rnd(-1.5,1.5),ay+rnd(-1.5,1.5),r,rnd(-.35,.35),true);
    ax+=r*1.45*adir;
    if(ax>N.w-6||ax<6){adir*=-1;ay+=r*1.15;ax=Math.min(N.w-6,Math.max(6,ax))}
    if(ay>N.h-4){ay=rnd(6,14);ax=adir>0?8:N.w-8;netLayer++;if(netLayer===1)say('Segona passada: la xarxa vella queda a sota, però no desapareix.')}
  }
}

/* ===== ACUMULACIÓ ===== */
const A=stage('c-acc',S=>{if(!units.length)for(let i=0;i<70;i++)spawn(S.w/2+rnd(-60,60),S.h/2+rnd(-60,60),true)});
let units=[];const UMAX=1100;
function spawn(x,y,silent){if(units.length>=UMAX){if(!silent&&!spawn.full){say('El cos és ple. Buida-ho o sacseja-ho.');spawn.full=1}return}const r=rnd(5,13)*(A.w<500?.8:1);units.push({x,y,vx:rnd(-1,1),vy:rnd(-1,1),r,rot:rnd(0,7),sq:rnd(.72,1)});if(!silent)tick();document.getElementById('acc-n').textContent=units.length.toLocaleString('ca')+' unitats'}
let ap=null;
A.cv.addEventListener('pointerdown',e=>{A.cv.setPointerCapture(e.pointerId);ap=pos(e,A.cv);for(let i=0;i<8;i++)spawn(ap.x+rnd(-8,8),ap.y+rnd(-8,8))});
A.cv.addEventListener('pointermove',e=>{if(ap)ap=pos(e,A.cv)});
const endA=()=>ap=null;A.cv.addEventListener('pointerup',endA);A.cv.addEventListener('pointercancel',endA);
document.getElementById('acc-clear').onclick=()=>{units=[];spawn.full=0;document.getElementById('acc-n').textContent='0 unitats'};
document.getElementById('acc-shake').onclick=()=>{for(const u of units){u.vx+=rnd(-14,14);u.vy+=rnd(-14,14)}tick()};
function stepAcc(){
  const{ctx,w,h}=A;
  if(ap&&Math.random()<.6)spawn(ap.x+rnd(-10,10),ap.y+rnd(-10,10));
  const cx=w/2,cy=h/2,cell=30,grid=new Map();
  units.forEach((u,i)=>{const k=((u.x/cell)|0)+','+((u.y/cell)|0);(grid.get(k)||grid.set(k,[]).get(k)).push(i)});
  for(let i=0;i<units.length;i++){
    const u=units[i];u.vx+=(cx-u.x)*.0009;u.vy+=(cy-u.y)*.0009;
    const gx=(u.x/cell)|0,gy=(u.y/cell)|0;
    for(let ox=-1;ox<=1;ox++)for(let oy=-1;oy<=1;oy++){const c=grid.get((gx+ox)+','+(gy+oy));if(!c)continue;for(const j of c){if(j<=i)continue;const v=units[j];let dx=v.x-u.x,dy=v.y-u.y;const d=Math.hypot(dx,dy)||.01,m=u.r+v.r+1.5;if(d<m){const f=(m-d)/d*.28;dx*=f;dy*=f;u.vx-=dx;u.vy-=dy;v.vx+=dx;v.vy+=dy}}}
  }
  ctx.clearRect(0,0,w,h);ctx.lineWidth=1.3;
  for(const u of units){u.vx*=.86;u.vy*=.86;u.x+=u.vx;u.y+=u.vy;u.rot+=u.vx*.01;
    ctx.beginPath();ctx.ellipse(u.x,u.y,u.r,u.r*u.sq,u.rot,0,7);ctx.fillStyle=C.bone;ctx.fill();ctx.strokeStyle=C.ink;ctx.stroke();
    ctx.beginPath();ctx.arc(u.x-u.r*.3,u.y-u.r*.3,u.r*.18,0,7);ctx.fillStyle=C.red;ctx.fill()}
}

/* ===== INFINIT: habitació de miralls ===== */
const R=stage('c-room');
const lights=[];for(let i=0;i<36;i++)lights.push({x:rnd(-.9,.9),y:rnd(-.85,.6),z:rnd(-.9,.9),ph:rnd(0,7)});
let yaw=0,pitch=0,tyaw=0,tpitch=0,roomMode=0;
const roomModes=['respiració','onada de colors','parpelleig','foc'];
R.cv.addEventListener('pointermove',e=>{const p=pos(e,R.cv);tyaw=(p.x/R.w-.5)*1.6;tpitch=(p.y/R.h-.5)*.9});
const nextMode=()=>{roomMode=(roomMode+1)%roomModes.length;document.getElementById('room-n').textContent=`36 llums · ∞ reflexos · ${roomModes[roomMode]}`;tick()};
R.cv.addEventListener('click',nextMode);
document.getElementById('room-mode').onclick=nextMode;
document.getElementById('room-full').onclick=()=>{const el=R.cv.parentElement;(el.requestFullscreen?el.requestFullscreen():Promise.reject()).catch(()=>say('Aquest navegador no deixa obrir pantalla completa aquí. Apropa\'t a la pantalla.'))};
function lightCol(l,t,copyIx){
  let k,b;
  if(roomMode===0){k=(t*.15)|0;b=.55+.45*Math.sin(t*1.4+l.ph*.25)}
  else if(roomMode===1){k=((t*.6+l.x*1.5+copyIx*.4)|0);b=.85}
  else if(roomMode===2){k=2;b=Math.sin(t*6+l.ph*9)>.2?1:.12}
  else{k=Math.sin(t*2+l.ph)>0?1:3;b=.6+.4*Math.sin(t*3+l.ph)}
  const pal=[[243,195,22],[211,42,29],[60,90,255],[255,120,40],[242,236,225]];
  return[pal[((k%5)+5)%5],b];
}
function stepRoom(t){
  const{ctx,w,h}=R;yaw+=(tyaw+Math.sin(t*.07)*.25-yaw)*.05;pitch+=(tpitch-pitch)*.05;
  ctx.fillStyle='#07070f';ctx.fillRect(0,0,w,h);ctx.globalCompositeOperation='lighter';
  const f=Math.min(w,h)*.9,cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  for(let ix=-3;ix<=3;ix++)for(let iy=-1;iy<=1;iy++)for(let iz=-3;iz<=3;iz++){
    const mx=ix&1?-1:1,my=iy&1?-1:1,mz=iz&1?-1:1,cix=Math.abs(ix)+Math.abs(iy)+Math.abs(iz);
    for(const l of lights){
      let x=2*ix+l.x*mx,y=2*iy+l.y*my,z=2*iz+l.z*mz;
      let X=x*cy-z*sy,Z=x*sy+z*cy;let Y=y*cp-Z*sp;Z=y*sp+Z*cp;
      if(Z<.08)continue;
      const sx=w/2+X/Z*f,syy=h/2+Y/Z*f;if(sx<-20||sx>w+20||syy<-20||syy>h+20)continue;
      const fade=Math.max(0,1-Z/11);if(fade<=0)continue;
      const[c,b]=lightCol(l,t,cix);const r=Math.max(.6,.045/Z*f);const a=fade*b;
      ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${(a*.16).toFixed(3)})`;ctx.beginPath();ctx.arc(sx,syy,r*3.2,0,7);ctx.fill();
      ctx.fillStyle=`rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(3)})`;ctx.beginPath();ctx.arc(sx,syy,r,0,7);ctx.fill();
    }
  }
  ctx.globalCompositeOperation='source-over';
}

/* ===== DISSOLUCIÓ DEL JO ===== */
const J=stage('c-self',()=>buildSelf());
const nameEl=document.getElementById('self-name'),oblEl=document.getElementById('self-obl');
let cells=[],obl=.12,step=10;
function buildSelf(){
  const w=Math.floor(J.w),h=Math.floor(J.h);step=Math.max(7,Math.round(Math.min(w,h)/48));
  const off=document.createElement('canvas');off.width=w;off.height=h;const o=off.getContext('2d');
  const txt=(nameEl.value.trim()||'JO').toUpperCase();
  let fs=h*.62;o.font=`900 ${fs}px Unbounded, "Arial Black", sans-serif`;const fx=freeX('jo',w),fw=fx.x1-fx.x0;const mw=o.measureText(txt).width;if(mw>fw*.86){fs*=fw*.86/mw;o.font=`900 ${fs}px Unbounded, "Arial Black", sans-serif`}
  o.textAlign='center';o.textBaseline='middle';o.fillStyle='#000';o.fillText(txt,(fx.x0+fx.x1)/2,h/2+fs*.04);
  const data=o.getImageData(0,0,w,h).data;cells=[];
  for(let y=step/2;y<h;y+=step)for(let x=step/2;x<w;x+=step){
    const on=data[(((y|0)*w+(x|0))*4)+3]>128;
    cells.push({x,y,on,th:Math.random(),ph:rnd(0,7),jx:rnd(-1,1),jy:rnd(-1,1)});
  }
}
nameEl.addEventListener('input',()=>{buildSelf();tick()});
oblEl.addEventListener('input',()=>{obl=oblEl.value/100});
document.getElementById('self-reset').onclick=()=>{obl=0;oblEl.value=0};
let lastSelf=null;
J.cv.addEventListener('pointermove',e=>{const p=pos(e,J.cv);if(lastSelf&&Math.hypot(p.x-lastSelf.x,p.y-lastSelf.y)>14){obl=Math.min(1,obl+.006);oblEl.value=Math.round(obl*100);tick()}if(!lastSelf||Math.hypot(p.x-lastSelf.x,p.y-lastSelf.y)>14)lastSelf=p});
const lerp=(a,b,t)=>a+(b-a)*t;
function stepSelf(t){
  const{ctx,w,h}=J;ctx.fillStyle='#e9e6f5';ctx.fillRect(0,0,w,h);
  const base=step*.36;const drift=Math.max(0,(obl-.8)/.2);
  const bgR=lerp(185,35,obl),bgG=lerp(190,55,obl),bgB=lerp(235,198,obl);
  for(const c of cells){
    const breathe=RM?1:1+.12*Math.sin(t*1.6+c.ph);
    if(c.on){ctx.fillStyle='rgb(35,55,198)';ctx.beginPath();ctx.arc(c.x+c.jx*step*.5*drift,c.y+c.jy*step*.5*drift,base*breathe,0,7);ctx.fill()}
    else if(c.th<obl){ctx.fillStyle=`rgb(${bgR|0},${bgG|0},${bgB|0})`;ctx.beginPath();ctx.arc(c.x+c.jx*step*.5*drift,c.y+c.jy*step*.5*drift,base*lerp(.55,1,obl)*breathe,0,7);ctx.fill()}
  }
  const tag=obl<.35?'jo: visible':obl<.7?'jo: es confon':obl<.95?'jo: gairebé desaparegut':'jo: dissolt';
  const el=document.getElementById('self-n');if(el.textContent!==tag){el.textContent=tag;if(tag==='jo: dissolt')say('Has desaparegut dins el patró. El nom encara hi és, però ja no es pot veure.')}
}

/* ===== RITUAL sonor ===== */
const T=stage('c-rit');
const LOOP=6;let ac=null,t0=performance.now()/1000,events=[{p:.0,n:0,demo:1},{p:.25,n:2,demo:1},{p:.5,n:4,demo:1},{p:.62,n:3,demo:1},{p:.75,n:1,demo:1}],rings=[],plays=0,lastPh=0;
const scale=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];
function tone(n,vol=.22){if(!ac)return;const now=ac.currentTime,o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain();o.type='sine';o2.type='triangle';o.frequency.value=scale[n%scale.length];o2.frequency.value=scale[n%scale.length]*2.001;
  g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(vol,now+.012);g.gain.exponentialRampToValueAtTime(.0008,now+1.6);
  const g2=ac.createGain();g2.gain.value=.18;o.connect(g);o2.connect(g2);g2.connect(g);g.connect(ac.destination);o.start(now);o2.start(now);o.stop(now+1.7);o2.stop(now+1.7)}
let noteIx=0;
function tap(){
  if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}}
  if(ac&&ac.state==='suspended')ac.resume();
  if(events.some(e=>e.demo))events=events.filter(e=>!e.demo).concat(events.filter(e=>e.demo).map(e=>({...e,demo:0})));
  const ph=((performance.now()/1000-t0)%LOOP)/LOOP;const n=noteIx++%scale.length;
  if(events.length>=40)events.shift();
  events.push({p:ph,n});tone(n,.28);rings.push({r:0,a:1,n});tick();
  document.getElementById('rit-n').textContent=`${events.length} sons al cercle · ${plays} repeticions`;
}
document.getElementById('rit-tap').addEventListener('click',tap);
document.getElementById('rit-clear').onclick=()=>{events=[];rings=[];document.getElementById('rit-n').textContent='silenci · toca per començar'};
T.cv.addEventListener('click',tap);
addEventListener('keydown',e=>{if(e.code==='Space'&&T.vis&&document.activeElement.tagName!=='INPUT'){e.preventDefault();tap()}});
function stepRit(){
  const{ctx,w,h}=T;const now=performance.now()/1000;const ph=((now-t0)%LOOP)/LOOP;
  for(const e of events){const crossed=lastPh<=ph?(e.p>lastPh&&e.p<=ph):(e.p>lastPh||e.p<=ph);if(crossed){rings.push({r:0,a:.8,n:e.n});if(ac&&!e.demo){tone(e.n,.16);plays++;tick()}}}
  lastPh=ph;
  if(ac)document.getElementById('rit-n').textContent=`${events.length} sons al cercle · ${plays} repeticions`;
  ctx.fillStyle=C.yel;ctx.fillRect(0,0,w,h);
  const fr=freeX('ritual',w),cx=(fr.x0+fr.x1)/2,cy=h/2,R0=Math.min(fr.x1-fr.x0,h)*.38;
  ctx.strokeStyle=C.ink;ctx.globalAlpha=1;
  for(const r of rings){r.r+=R0*.012;r.a*=.985;ctx.globalAlpha=r.a;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,r.r,0,7);ctx.stroke()}
  rings=rings.filter(r=>r.a>.03&&r.r<Math.max(w,h));ctx.globalAlpha=1;
  ctx.lineWidth=1.5;ctx.setLineDash([2,6]);ctx.beginPath();ctx.arc(cx,cy,R0,0,7);ctx.stroke();ctx.setLineDash([]);
  for(let i=0;i<60;i++){const a=i/60*Math.PI*2-Math.PI/2,k=i%10===0?10:4;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*(R0+6),cy+Math.sin(a)*(R0+6));ctx.lineTo(cx+Math.cos(a)*(R0+6+k),cy+Math.sin(a)*(R0+6+k));ctx.stroke()}
  for(const e of events){const a=e.p*Math.PI*2-Math.PI/2,rr=R0*(.55+e.n*.06);const near=Math.abs(((ph-e.p+1.5)%1)-.5)<.03;
    ctx.fillStyle=near?C.red:C.ink;ctx.beginPath();ctx.arc(cx+Math.cos(a)*R0,cy+Math.sin(a)*R0,near?11:7,0,7);ctx.fill();
    ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);ctx.stroke();ctx.globalAlpha=1}
  const a=ph*Math.PI*2-Math.PI/2;ctx.strokeStyle=C.red;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*(R0+18),cy+Math.sin(a)*(R0+18));ctx.stroke();
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(cx,cy,6,0,7);ctx.fill();
}

/* ===== CICLE VITAL ===== */
const G=stage('c-germ',S=>{if(!plants.length&&S.w>10){for(let i=0;i<3;i++)plant(S.w*(.25+i*.25),true)}});
let plants=[],seeds=[],gens=0;const PMAX=16;
function plant(x,silent){if(plants.length>=PMAX)return;const life=rnd(.35,.6)*G.h/1.6;plants.push({x,segs:[],tips:[{x,y:G.h-4,a:-Math.PI/2+rnd(-.15,.15),life,gen:0,w:2.4}],blooms:[],age:0,alpha:1,col:Math.random()<.5?C.red:C.yel});if(!silent){gens++;tick();document.getElementById('germ-n').textContent=gens+' brots'}}
G.cv.addEventListener('pointerdown',e=>{const p=pos(e,G.cv);plant(p.x);if(plants.length>=PMAX)say('El jardí és ple. Espera que les plantes velles es desfacin.')});
document.getElementById('germ-rain').onclick=()=>{for(let i=0;i<10;i++)seeds.push({x:rnd(10,G.w-10),y:rnd(-80,0),vy:rnd(1,2),vx:rnd(-.4,.4)});tick()};
document.getElementById('germ-clear').onclick=()=>{for(const p of plants)p.age=Math.max(p.age,9999);seeds=[]};
function stepGerm(){
  const{ctx,w,h}=G;
  for(const p of plants){
    p.age++;
    const nt=[];
    for(const t of p.tips){
      const nx=t.x+Math.cos(t.a)*1.7,ny=t.y+Math.sin(t.a)*1.7;p.segs.push(t.x,t.y,nx,ny,t.w);
      t.x=nx;t.y=ny;t.a+=rnd(-.09,.09)+(-Math.PI/2-t.a)*.01;t.life-=1.7;t.w=Math.max(.6,t.w*.995);
      if(t.gen<4&&Math.random()<.022)nt.push({x:t.x,y:t.y,a:t.a+(Math.random()<.5?-1:1)*rnd(.4,.8),life:t.life*.75,gen:t.gen+1,w:t.w*.7});
      if(t.life>0&&t.y>4)nt.push(t);else{p.blooms.push({x:t.x,y:t.y,r:0,m:rnd(5,13),dropped:0});tick()}
    }
    p.tips=nt;
    for(const b of p.blooms)if(b.r<b.m)b.r+=.15;
    if(!p.tips.length&&p.age>260)for(const b of p.blooms)if(!b.dropped&&Math.random()<.01){b.dropped=1;if(Math.random()<.45)seeds.push({x:b.x,y:b.y,vy:0,vx:rnd(-.6,.6)})}
    if(p.age>620)p.alpha-=.004;
  }
  plants=plants.filter(p=>p.alpha>0);
  for(const s of seeds){s.vy+=.05;s.y+=s.vy;s.x+=s.vx;if(s.y>=h-4){s.dead=1;if(plants.length<PMAX&&Math.random()<.7)plant(Math.min(w-8,Math.max(8,s.x)))}}
  seeds=seeds.filter(s=>!s.dead);
  ctx.fillStyle=C.ink;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle=C.bone;ctx.lineCap='round';
  for(const p of plants){
    ctx.globalAlpha=Math.max(0,p.alpha)*.9;
    const sg=p.segs;for(let i=0;i<sg.length;i+=5){ctx.lineWidth=sg[i+4];ctx.beginPath();ctx.moveTo(sg[i],sg[i+1]);ctx.lineTo(sg[i+2],sg[i+3]);ctx.stroke()}
    for(const b of p.blooms){ctx.fillStyle=p.col;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,7);ctx.fill();if(b.r>4){ctx.fillStyle=C.ink;for(let k=0;k<5;k++){const a=k/5*6.283;ctx.beginPath();ctx.arc(b.x+Math.cos(a)*b.r*.5,b.y+Math.sin(a)*b.r*.5,b.r*.13,0,7);ctx.fill()}}}
  }
  ctx.globalAlpha=1;ctx.fillStyle=C.yel;for(const s of seeds){ctx.beginPath();ctx.arc(s.x,s.y,2.6,0,7);ctx.fill()}
  ctx.fillStyle=C.bone;ctx.globalAlpha=.25;ctx.fillRect(0,h-3,w,3);ctx.globalAlpha=1;
}

/* ---------- bucle únic ---------- */
function frame(ms){
  const t=ms/1000;
  if(P.vis)stepCover(t);
  if(H.vis)stepHero();
  if(N.vis)stepNet();
  if(A.vis)stepAcc();
  if(R.vis)stepRoom(t);
  if(J.vis)stepSelf(t);
  if(T.vis)stepRit();
  if(G.vis)stepGerm();
  requestAnimationFrame(frame);
}
document.fonts&&document.fonts.ready.then(()=>buildSelf());
requestAnimationFrame(frame);
})();
