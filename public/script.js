const settings = window.SUKI;
const $ = id => document.getElementById(id);
function heartIcon(){
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),path=document.createElementNS('http://www.w3.org/2000/svg','path');
  svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','heart-icon');svg.setAttribute('width','16');svg.setAttribute('height','16');svg.setAttribute('aria-hidden','true');
  path.setAttribute('d','M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z');svg.appendChild(path);return svg;
}
function heartText(element,text){element.replaceChildren();String(text).split(/([\u2661\u2665])/).forEach(part=>element.appendChild(/^[\u2661\u2665]$/.test(part)?heartIcon():document.createTextNode(part)));}

document.title = 'To my beautiful girl';
$('message-title').textContent = settings.title;
$('message').textContent = settings.message;
$('from').textContent = settings.from;
heartText($('hint-text'),settings.hint);
document.querySelectorAll('.orbit-word').forEach((el,i) => heartText(el,settings.floatingWords[i] || '\u2661'));
$('hint').addEventListener('click', () => { $('hint-text').hidden = !$('hint-text').hidden; $('hint').setAttribute('aria-expanded', String(!$('hint-text').hidden)); });
$('reveal').addEventListener('click', () => { const show = $('password').type === 'password'; $('password').type = show ? 'text' : 'password'; $('reveal').setAttribute('aria-label', show ? 'Hide password' : 'Show password'); });
$('unlock-form').addEventListener('submit', e => {
  e.preventDefault();
  if ($('password').value.toLowerCase() === settings.password.toLowerCase()) {
    if($('letter').classList.contains('password-accepted'))return;
    $('letter').classList.add('password-accepted');
    document.querySelector('.heart-stage').classList.add('heart-accepted');
    burst=1;
    setTimeout(()=>{beginUniverseUnlock();$('letter').classList.remove('password-accepted');document.querySelector('.heart-stage').classList.remove('heart-accepted');},reduceMotion.matches?0:320);
  } else {
    heartText($('feedback'),'Not quite, my love. Try a little closer to the heart \u2661');
    $('password').setAttribute('aria-invalid','true');
    $('letter').classList.remove('shake'); void $('letter').offsetWidth; $('letter').classList.add('shake');
  }
});
$('password').addEventListener('input', () => { $('feedback').textContent=''; $('password').removeAttribute('aria-invalid');$('letter').classList.toggle('has-password',$('password').value.length>0); });
$('relock').addEventListener('click', () => { $('locked').hidden=false; $('unlocked').hidden=true; $('password').value=''; $('password').type='password'; $('reveal').setAttribute('aria-label','Show password'); $('password').focus(); });
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reduceMotion.matches, time = 0, burst = 0;
const heart = $('heart'), hc = heart.getContext('2d'), sky = $('universe'), sc = sky.getContext('2d');
let hw, hh, sw, sh;
function size(canvas, ctx) { const r=canvas.getBoundingClientRect(), d=Math.min(devicePixelRatio || 1,2); canvas.width=r.width*d; canvas.height=r.height*d; ctx.setTransform(d,0,0,d,0,0); return [r.width,r.height]; }
function resize(){[hw,hh]=size(heart,hc);[sw,sh]=size(sky,sc);if(paused)draw();}
const dots=Array.from({length:3600},()=>({a:Math.random()*Math.PI*2,r:Math.random(),j:Math.random(),s:Math.random(),phase:Math.random()*6.28}));
const stars=Array.from({length:105},()=>({x:Math.random(),y:Math.random(),r:Math.random()*.9+.2,a:Math.random()*.45+.1}));
function draw(){
  hc.clearRect(0,0,hw,hh);sc.clearRect(0,0,sw,sh);
  stars.forEach(s=>{sc.fillStyle=`rgba(239,169,192,${s.a*(.7+.3*Math.sin(time*.4+s.x*20))})`;sc.beginPath();sc.arc(s.x*sw,s.y*sh,s.r,0,Math.PI*2);sc.fill();});
  const scale=Math.min(hw/37,hh/35)*(1+.018*Math.sin(time*2.4)+burst*.08),cx=hw/2,cy=hh*.40;
  const halo=hc.createRadialGradient(cx,cy,0,cx,cy,Math.min(hw,hh)*.37);
  halo.addColorStop(0,'#f8689a12');halo.addColorStop(.6,'#ec3d7920');halo.addColorStop(1,'#0000');hc.fillStyle=halo;hc.fillRect(0,0,hw,hh);
  for(const p of dots){
    const a=p.a, r=p.j<.60 ? .94+p.r*.08 : Math.sqrt(p.r)*.92;
    const x=16*Math.pow(Math.sin(a),3),y=13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a);
    const drift=Math.sin(time*.8+p.phase)*1.5;
    hc.fillStyle=`rgba(${p.s>.8?'255,211,227':'248,94,148'},${(.2+p.s*.65)*(.72+.28*Math.sin(time+p.phase))})`;
    hc.beginPath();hc.arc(cx+x*r*scale+drift,cy-y*r*scale+drift,p.s*1.1+.25,0,Math.PI*2);hc.fill();
  }
  for(let i=0;i<470;i++){const p=dots[i],a=p.a+time*.13,rad=(.1+p.r*.38)*hw;const x=Math.cos(a+rad*.018)*rad,y=Math.sin(a+rad*.018)*rad*.19;hc.fillStyle=`rgba(235,75,119,${p.s*.34})`;hc.fillRect(cx+x,hh*.84+y,1.1,1.1);}
  burst*=.97;
}
let last=0;
function tick(now){requestAnimationFrame(tick);if(paused || now-last<30)return;time+=Math.min((now-last)/1000,.05);last=now;draw();}
const song = $('song');
song.volume = .65;
function musicLabel(){const muted=song.muted||song.volume===0;$('soundless').classList.toggle('muted',muted);$('soundless').setAttribute('aria-label',muted?'Unmute music':'Mute music');$('soundless').title=muted?'Unmute music':'Mute music';$('soundless').setAttribute('aria-pressed',String(muted));$('volume-value').textContent=Math.round(song.volume*100)+'%';$('volume').style.setProperty('--level',Math.round(song.volume*100)+'%');}
async function startMusic(){try{await song.play();$('music-status').textContent='';}catch{if(!song.error)heartText($('music-status'),'Use the speaker to try the music again \u2661');}}
$('soundless').addEventListener('click',()=>{song.muted=!(song.muted||song.volume===0);if(!song.muted&&song.volume===0){song.volume=.65;$('volume').value='65';}musicLabel();if(song.paused)void startMusic();});
$('volume').addEventListener('input',()=>{song.volume=Number($('volume').value)/100;song.muted=false;musicLabel();if(song.paused)void startMusic();});
song.addEventListener('volumechange',musicLabel);
song.addEventListener('playing',()=>{$('music-status').textContent='';});
const pageSections = document.querySelectorAll('header, main, footer');
pageSections.forEach(section=>{section.inert=true;});
let entered = false;
function enterPage(event){
  if(entered)return;
  entered=true;
  void startMusic();
  document.body.classList.remove('awaiting-entry');
  document.body.classList.add('revealing');
  $('entrance').classList.add('departing');
  pageSections.forEach(section=>{section.inert=false;});
  burst=1;
  if(!reduceMotion.matches){
    const x=event.detail ? event.clientX : innerWidth/2,y=event.detail ? event.clientY : innerHeight/2;
    for(let i=0;i<22;i++){
      const spark=document.createElement('span'),angle=i/22*Math.PI*2,distance=90+Math.random()*190;
      spark.className='reveal-spark';heartText(spark,i%3===0?'\u2661':'✧');
      spark.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(angle)*distance}px;--dy:${Math.sin(angle)*distance}px;--turn:${Math.random()*100-50}deg;--spark-size:${12+Math.random()*15}px`;
      document.body.appendChild(spark);setTimeout(()=>spark.remove(),1500);
    }
  }
  setTimeout(()=>{if(document.activeElement===$('entrance'))$('password').focus({preventScroll:true});$('entrance').hidden=true;document.body.classList.remove('revealing');},reduceMotion.matches?0:1100);
}
$('entrance').addEventListener('click',enterPage);
song.addEventListener('error',()=>{heartText($('music-status'),'The song couldn’t load. Please refresh and try again \u2661');musicLabel();});
for(let i=0;i<65;i++){const particle=document.createElement('span');heartText(particle,i%3===0?'\u2661':i%3===1?'✧':'✦');particle.className='love-particle';particle.style.cssText=`--x:${3+Math.random()*94}%;--y:${Math.random()*100}%;--duration:${12+Math.random()*15}s;--delay:${-Math.random()*25}s;--size:${10+Math.random()*12}px;--opacity:${.15+Math.random()*.3}`;$('love-dust').appendChild(particle);}
reduceMotion.addEventListener('change', e=>{paused=e.matches;draw();});
window.addEventListener('resize',resize);resize();musicLabel();requestAnimationFrame(tick);

const atmosphere = document.createElement('div');
atmosphere.className='atmosphere';atmosphere.setAttribute('aria-hidden','true');
for(let i=0;i<3;i++){const glow=document.createElement('div');glow.className='love-glow glow-'+i;atmosphere.appendChild(glow);}
for(let i=0;i<5;i++){const star=document.createElement('span');star.className='shooting-star';star.style.cssText=`--top:${8+i*17}%;--wait:${i*3.7}s;--flight:${13+i*2}s`;atmosphere.appendChild(star);}
for(let i=0;i<12;i++){const heart=document.createElementNS('http://www.w3.org/2000/svg','svg');heart.setAttribute('viewBox','0 0 24 24');heart.classList.add('drifting-heart');heart.style.cssText=`--left:${Math.random()*100}%;--travel:${22+Math.random()*20}s;--offset:${-Math.random()*40}s;--heart-size:${14+Math.random()*27}px`;const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z');heart.appendChild(path);atmosphere.appendChild(heart);}
document.body.appendChild(atmosphere);
let lastTrail=0,trailCount=0;
document.addEventListener('pointermove',event=>{
  if(!entered||reduceMotion.matches||event.pointerType!=='mouse'||performance.now()-lastTrail<85||trailCount>=16)return;
  lastTrail=performance.now();trailCount++;
  const spark=document.createElement('span');spark.className='cursor-spark';spark.setAttribute('aria-hidden','true');heartText(spark,Math.random()>.7?'\u2661':'✧');spark.style.cssText=`left:${event.clientX}px;top:${event.clientY}px;--drift:${Math.random()*40-20}px`;
  document.body.appendChild(spark);setTimeout(()=>{spark.remove();trailCount--;},1100);
});
