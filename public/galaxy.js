const room = $('galaxy-room'), galaxyCanvas = $('galaxy-canvas'), gc = galaxyCanvas.getContext('2d');
let unlockInProgress=false;
const unlockCanvas=$('unlock-cosmos'), uc=unlockCanvas.getContext('2d');
const unlockDust=Array.from({length:1400},(_,i)=>({a:i*2.399963,r:Math.random(),s:Math.random(),z:Math.random(),arm:i%5}));
let unlockFrame=0,unlockStarted=0,uw=0,uh=0;
function startUnlockCosmos(){
  [uw,uh]=size(unlockCanvas,uc);
  unlockStarted=performance.now();
  if(reduceMotion.matches)return;
  unlockFrame=requestAnimationFrame(paintUnlockCosmos);
}
function stopUnlockCosmos(){cancelAnimationFrame(unlockFrame);}
function easeUnlock(value){const v=Math.max(0,Math.min(1,value));return v*v*(3-2*v);}
function paintUnlockCosmos(now){
  const t=(now-unlockStarted)/1000,cx=uw/2,cy=uh*.43,span=Math.min(uw,uh)*.39;
  uc.clearRect(0,0,uw,uh);
  const form=easeUnlock((t-.55)/.95),portal=easeUnlock((t-2.65)/.75),flight=easeUnlock((t-3.15)/.65);
  const beat=1+.1*Math.exp(-Math.pow((t-1.85)/.12,2))+.13*Math.exp(-Math.pow((t-2.35)/.13,2));
  const glow=uc.createRadialGradient(cx,cy,0,cx,cy,span*1.6);
  glow.addColorStop(0,`rgba(235,83,158,${.1+form*.1})`);glow.addColorStop(.6,'#7e2a6c15');glow.addColorStop(1,'#0000');uc.fillStyle=glow;uc.fillRect(0,0,uw,uh);
  uc.globalCompositeOperation='lighter';
  unlockDust.forEach((p,i)=>{
    const q=(i%100)/100;
    let lx,ly;
    if(i%3===0){const a=Math.PI+q*Math.PI;lx=Math.cos(a)*11;ly=Math.sin(a)*11-10;}
    else{const edge=q*4;if(edge<1){lx=-17+edge*34;ly=-4;}else if(edge<2){lx=17;ly=-4+(edge-1)*27;}else if(edge<3){lx=17-(edge-2)*34;ly=23;}else{lx=-17;ly=23-(edge-3)*27;}}
    const r=p.r>.35?.95+p.r*.05:Math.sqrt(p.r),ha=p.a;
    const hx=16*Math.sin(ha)**3/23*span*r*beat,hy=-(13*Math.cos(ha)-5*Math.cos(2*ha)-2*Math.cos(3*ha)-Math.cos(4*ha))/23*span*r*beat;
    const curl=Math.sin(p.a+t*4)*Math.sin(form*Math.PI)*span*.2;
    let x=cx+lx*(1-form)+hx*form+Math.cos(p.a)*curl,y=cy+ly*(1-form)+hy*form+Math.sin(p.a)*curl;
    const pa=p.a+t*.9,pr=span*(.45+p.r*.55)*(1+flight*5);
    x=x*(1-portal)+(cx+Math.cos(pa)*pr)*portal;y=y*(1-portal)+(cy+Math.sin(pa)*pr*.8)*portal;
    // The last particles settle onto the actual galaxy's camera projection.
    if(galaxyOpen){const dust=galaxyCloud[i%galaxyCloud.length],a=dust.a-galaxyTime*.075,target=projectWorld({x:Math.cos(a)*dust.r,y:dust.y,z:Math.sin(a)*dust.r}),settle=easeUnlock((t-3.55)/.65);x=x*(1-settle)+target.x*settle;y=y*(1-settle)+target.y*settle;}
    const alpha=easeUnlock((t-.3)/.4)*(.3+p.s*.65),dot=.5+p.s*1.3;
    uc.fillStyle=`rgba(255,${Math.round(105+p.s*120)},${Math.round(165+p.s*80)},${alpha})`;uc.beginPath();uc.arc(x,y,dot,0,Math.PI*2);uc.fill();
    if(p.s>.97){uc.fillStyle=`rgba(255,173,220,${alpha*.08})`;uc.beginPath();uc.arc(x,y,8,0,Math.PI*2);uc.fill();}
    if(portal>.05&&t<3.7){const tail=flight*.12;uc.strokeStyle=`rgba(255,189,225,${alpha*.4})`;uc.lineWidth=.7;uc.beginPath();uc.moveTo(x,y);uc.lineTo(x-(x-cx)*tail,y-(y-cy)*tail);uc.stroke();}
  });
  if(portal>.02&&t<3.85){for(let i=0;i<3;i++){const r=span*(.6+portal*(2+i*.6));uc.strokeStyle=`rgba(255,180,222,${(1-flight)*.3})`;uc.lineWidth=1;uc.beginPath();uc.ellipse(cx,cy,r,r*.8,0,0,Math.PI*2);uc.stroke();}}
  uc.globalCompositeOperation='source-over';unlockFrame=requestAnimationFrame(paintUnlockCosmos);
}
for(let i=0;i<64;i++){
  const ray=document.createElement('span');ray.style.cssText=`--angle:${i*360/64}deg;--ray-delay:${Math.random()*.8}s;--ray-length:${25+Math.random()*90}px;--ray-start:${25+Math.random()*60}px`;
  $('unlock-tunnel').appendChild(ray);
}
function beginUniverseUnlock(){
  if(unlockInProgress||galaxyOpen)return;
  unlockInProgress=true;
  const sequence=$('unlock-sequence');
  sequence.hidden=false;sequence.classList.add('running');
  document.body.classList.add('universe-unlocking');
  document.querySelector('main').inert=true;document.querySelector('footer').inert=true;
  sequence.focus({preventScroll:true});
  startUnlockCosmos();
  $('unlock-form').querySelector('button[type="submit"]').disabled=true;
  if(reduceMotion.matches){
    setTimeout(()=>{openGalaxy();finishUnlockSequence();},150);
  }else{
    setTimeout(()=>{openGalaxy();},3100);
    setTimeout(()=>{
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        sequence.classList.add('finished');
        setTimeout(finishUnlockSequence,700);
      }));
    },3700);
  }
}
function finishUnlockSequence(){
  stopUnlockCosmos();
  const sequence=$('unlock-sequence');sequence.hidden=true;sequence.classList.remove('running','finished');
  document.body.classList.remove('universe-unlocking');unlockInProgress=false;
  $('unlock-form').querySelector('button[type="submit"]').disabled=false;
}
let galaxyOpen=false, gw=0, gh=0, galaxyTime=0, galaxyFrame=0, galaxyLast=0;
$('cosmic-title').textContent=settings.title;
$('cosmic-message').textContent=settings.message;
$('cosmic-from').textContent='Always yours, '+settings.from;
const envelopeDialog=$('envelope-dialog');
const orbitingEnvelopes=[];
// Read status lasts only until the page is reloaded.
const readNoteKeys=new Set();
(settings.loveNotes||[]).forEach((note,index)=>{
  const envelope=document.createElement('button');
  envelope.type='button';envelope.className='floating-envelope';
  const noteKey=note.id||JSON.stringify([note.title,note.message]);
  function updateReadBadge(){
    const read=readNoteKeys.has(noteKey);
    envelope.classList.toggle('note-read',read);
    envelope.setAttribute('aria-label',`${read?'Read':'Unread'} love note ${index+1}: ${note.title}`);
    envelope.title=read?'Read love note':'A new little love note';
  }
  updateReadBadge();
  envelope.setAttribute('aria-haspopup','dialog');
  const inner=note.orbit==='inner',sameLayer=settings.loveNotes.filter(item=>(item.orbit==='inner')===inner);
  const layerIndex=settings.loveNotes.slice(0,index).filter(item=>(item.orbit==='inner')===inner).length;
  orbitingEnvelopes.push({element:envelope,phase:layerIndex/Math.max(1,sameLayer.length)*Math.PI*2,radius:.65+(index%3)*.13,inner});
  envelope.innerHTML='<svg width="28" height="25" viewBox="0 0 28 25" fill="none" aria-hidden="true"><rect x="2" y="5" width="24" height="17" rx="4" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.2"/><path d="m3 7 11 8L25 7M3 20l7-7m15 7-7-7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 9s-4-2.5-4-4.6C10 2 13 2 14 4c1-2 4-2 4 .4C18 6.5 14 9 14 9Z" fill="currentColor"/></svg>';
  envelope.addEventListener('click',()=>{
    $('envelope-title').textContent=note.title;
    $('envelope-message').textContent=note.message;
    $('envelope-from').textContent='Always yours, '+settings.from;
    envelopeDialog.showModal();
    readNoteKeys.add(noteKey);updateReadBadge();
  });
  const badge=document.createElement('span');
  badge.className='unread-badge';badge.setAttribute('aria-hidden','true');
  badge.appendChild(heartIcon());envelope.appendChild(badge);
  $('universe-envelopes').appendChild(envelope);
});
$('envelope-close').addEventListener('click',()=>envelopeDialog.close());
envelopeDialog.addEventListener('click',event=>{if(event.target===envelopeDialog){const box=envelopeDialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)envelopeDialog.close();}});
let envelopeTime=0;
function envelopeWorld(orbit){
  if(orbit.inner){
    // Match the spiral-arm equation and rotation used by the galaxy particles.
    const r=.36+(orbit.phase/(Math.PI*2))*.35;
    const angle=orbit.phase+r*5.7-galaxyTime*.075;
    return {x:Math.cos(angle)*r,y:0,z:Math.sin(angle)*r};
  }
  const angle=orbit.phase+envelopeTime*.13,r=.62+orbit.radius*.59;
  return {x:Math.cos(angle)*r,y:.1+Math.sin(angle*2)*.055,z:Math.sin(angle)*r};
}
function positionEnvelopes(){
  for(const orbit of orbitingEnvelopes){
    const p=projectWorld(envelopeWorld(orbit));
    orbit.element.style.left=p.x+'px';orbit.element.style.top=p.y+'px';
    orbit.element.style.setProperty('--tilt',Math.sin(orbit.phase+envelopeTime*.13)*9+'deg');
    orbit.element.style.setProperty('--depth-scale',Math.max(.72,Math.min(1.12,p.scale))*(orbit.inner?.85:1));
    orbit.element.classList.toggle('inner-envelope',orbit.inner);
    orbit.element.style.opacity=String(.65+Math.min(.35,p.scale*.3));
    orbit.element.style.zIndex=String(Math.round(p.scale*100));
  }
}
function galaxySize(){if(!galaxyOpen)return;[gw,gh]=size(galaxyCanvas,gc);positionEnvelopes();paintGalaxy();}
function openGalaxy(){
  galaxyOpen=true;room.hidden=false;document.body.classList.add('cosmic-open');
  document.querySelector('main').inert=true;document.querySelector('footer').inert=true;
  $('galaxy-back').focus({preventScroll:true});galaxySize();galaxyLast=0;
  cancelAnimationFrame(galaxyFrame);galaxyFrame=requestAnimationFrame(animateGalaxy);
}
function closeGalaxy(){
  galaxyOpen=false;cancelAnimationFrame(galaxyFrame);room.hidden=true;
  document.body.classList.remove('cosmic-open');document.querySelector('main').inert=false;document.querySelector('footer').inert=false;
  $('cosmic-note').close();$('galaxy-letter').setAttribute('aria-expanded','false');
  $('password').value='';$('password').focus({preventScroll:true});
}
$('galaxy-back').addEventListener('click',closeGalaxy);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&galaxyOpen&&!envelopeDialog.open&&!$('cosmic-note').open)closeGalaxy();});
$('galaxy-letter').addEventListener('click',()=>{$('cosmic-note').showModal();$('galaxy-letter').setAttribute('aria-expanded','true');});
$('cosmic-close').addEventListener('click',()=> $('cosmic-note').close());
$('cosmic-note').addEventListener('close',()=> $('galaxy-letter').setAttribute('aria-expanded','false'));
$('cosmic-note').addEventListener('click',event=>{const note=$('cosmic-note');if(event.target!==note)return;const box=note.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)note.close();});
window.addEventListener('resize',galaxySize);
reduceMotion.addEventListener('change',()=>{if(galaxyOpen)paintGalaxy();});
function animateGalaxy(now){
  if(!galaxyOpen)return;
  galaxyFrame=requestAnimationFrame(animateGalaxy);
  if(now-galaxyLast<33)return;
  if(reduceMotion.matches){updateCamera();positionEnvelopes();paintGalaxy();galaxyLast=now;return;}
  const step=Math.min((now-galaxyLast)/1000,.05);
  updateCamera();
  galaxyTime+=step;
  envelopeTime+=step;positionEnvelopes();
  galaxyLast=now;paintGalaxy();
}
function drawOrbitHeart(x,y,scale,alpha){
  gc.save();gc.translate(x,y);gc.scale(scale,scale);
  gc.shadowColor='#ff3870';gc.shadowBlur=12;
  gc.fillStyle=`rgba(255,108,158,${alpha*.28})`;
  gc.strokeStyle=`rgba(255,157,191,${alpha})`;gc.lineWidth=1.15/scale;
  gc.beginPath();gc.moveTo(0,7);gc.bezierCurveTo(-15,-2,-9,-13,0,-6);gc.bezierCurveTo(9,-13,15,-2,0,7);gc.fill();gc.stroke();gc.restore();
}
// Every object shares the same perspective camera, including the clickable envelopes.
const camera={yaw:0,pitch:.48,targetYaw:0,targetPitch:.48};
let dragPointer=null,dragX=0,dragY=0;
function projectWorld(p){
  const cs=Math.cos(camera.yaw),sn=Math.sin(camera.yaw),cp=Math.cos(camera.pitch),sp=Math.sin(camera.pitch);
  const x=p.x*cs+p.z*sn,z=-p.x*sn+p.z*cs,y=p.y*cp-z*sp,depth=p.y*sp+z*cp;
  const perspective=3.8/(3.8-depth),unit=Math.min(gw*.30,gh*.38);
  return{x:gw/2+x*unit*perspective,y:gh*.57-y*unit*perspective,scale:perspective,depth};
}
function updateCamera(){const smooth=reduceMotion.matches?1:.16;camera.yaw+=(camera.targetYaw-camera.yaw)*smooth;camera.pitch+=(camera.targetPitch-camera.pitch)*smooth;}
function resetCamera(){camera.targetYaw=0;camera.targetPitch=.48;}
galaxyCanvas.addEventListener('pointerdown',event=>{
  if(event.button!==0)return;dragPointer=event.pointerId;dragX=event.clientX;dragY=event.clientY;
  galaxyCanvas.setPointerCapture(event.pointerId);room.classList.add('is-dragging');
});
galaxyCanvas.addEventListener('pointermove',event=>{
  if(event.pointerId!==dragPointer)return;
  camera.targetYaw+=(event.clientX-dragX)*.006;
  camera.targetPitch=Math.max(-.18,Math.min(1.24,camera.targetPitch+(event.clientY-dragY)*.005));
  dragX=event.clientX;dragY=event.clientY;
});
function endUniverseDrag(event){if(event.pointerId!==dragPointer)return;dragPointer=null;room.classList.remove('is-dragging');if(galaxyCanvas.hasPointerCapture(event.pointerId))galaxyCanvas.releasePointerCapture(event.pointerId);}
galaxyCanvas.addEventListener('pointerup',endUniverseDrag);galaxyCanvas.addEventListener('pointercancel',endUniverseDrag);galaxyCanvas.addEventListener('lostpointercapture',()=>{dragPointer=null;room.classList.remove('is-dragging');});
galaxyCanvas.addEventListener('keydown',event=>{
  const changes={ArrowLeft:[-.13,0],ArrowRight:[.13,0],ArrowUp:[0,-.1],ArrowDown:[0,.1]};
  if(!changes[event.key])return;event.preventDefault();camera.targetYaw+=changes[event.key][0];camera.targetPitch=Math.max(-.18,Math.min(1.24,camera.targetPitch+changes[event.key][1]));
});

const galaxyCloud=Array.from({length:12500},(_,i)=>{
  const r=Math.pow(Math.random(),.63)*1.22,a=(i%4)*Math.PI/2+r*5.7+(Math.random()-.5)*(.2+r*.6);
  return{r,a,y:(Math.random()-.5)*(.035+.065*(1-r)),size:Math.random(),warm:Math.random()};
});
const heartCloud=Array.from({length:3400},()=>{
  const a=Math.random()*Math.PI*2,r=Math.random()<.66?.95+Math.random()*.05:Math.sqrt(Math.random());
  return{x:16*Math.sin(a)**3/40*r,y:(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))/40*r+.85,z:(Math.random()-.5)*.14*Math.sqrt(Math.max(0,1-r*r)),size:Math.random()};
});
const deepStars=Array.from({length:430},()=>({x:Math.random(),y:Math.random(),s:Math.random(),phase:Math.random()*6.28}));
function projectedDustTrail(end,phase,alpha){
  const angle=Math.atan2(end.z,end.x),start={x:Math.cos(angle)*.11,y:0,z:Math.sin(angle)*.11};
  gc.save();gc.globalCompositeOperation='lighter';
  for(let j=0;j<85;j++){
    const seed=j*2.39996+phase,t=(j/85+galaxyTime*.15)%1,u=1-t,wave=Math.sin(t*Math.PI);
    const curl=Math.sin(t*12-galaxyTime*1.8+phase)*.03*wave,scatter=Math.sin(seed*6.3)*.025*wave;
    const a=angle+(1-t)*.38;
    const r=Math.hypot(end.x,end.z)*t+.11*u;
    const p=projectWorld({x:Math.cos(a)*r+curl,y:end.y*t+wave*.08+scatter,z:Math.sin(a)*r+curl});
    const opacity=alpha*(.25+wave*.6)*(.4+.6*Math.sin(seed+galaxyTime)**2);
    gc.fillStyle=`rgba(255,180,215,${opacity})`;const sz=(.5+(j%4)*.23)*p.scale;
    gc.fillRect(p.x,p.y,sz,sz);
    if(j%21===0){gc.fillStyle=`rgba(255,115,192,${opacity*.07})`;gc.beginPath();gc.arc(p.x,p.y,5*p.scale,0,Math.PI*2);gc.fill();}
  }
  gc.restore();
}
function glowAt(point,radius,color){const p=projectWorld(point),r=radius*Math.min(gw*.30,gh*.38)*p.scale,g=gc.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,color);g.addColorStop(1,'#0000');gc.fillStyle=g;gc.fillRect(p.x-r,p.y-r,r*2,r*2);}
const characterSprites=['hello-kitty.png','kuromi.png','my-melody.png','cinnamoroll.png','pompompurin.png','pochacco.png','keroppi.png'].map(src=>{
  const img=new Image();img.src=src;img.addEventListener('load',()=>{if(galaxyOpen)paintGalaxy();});return img;
});
function drawGalaxyCharacters(){
  const characters=[];
  for(let i=0;i<characterSprites.length;i++){
    const a=i*Math.PI*2/characterSprites.length+.4-galaxyTime*.045,r=.67+(i%3)*.18;
    const p=projectWorld({x:Math.cos(a)*r,y:.22+Math.sin(galaxyTime*.65+i)*.055,z:Math.sin(a)*r});
    characters.push({p,img:characterSprites[i],tilt:Math.sin(galaxyTime*.45+i)*.12});
  }
  characters.sort((a,b)=>a.p.depth-b.p.depth);
  for(const {p,img,tilt} of characters){
    if(!img.complete||!img.naturalWidth)continue;
    const bound=(gw<600?43:60)*p.scale;
    const factor=bound/Math.max(img.naturalWidth,img.naturalHeight),w=img.naturalWidth*factor,h=img.naturalHeight*factor;
    gc.save();gc.translate(p.x,p.y);gc.rotate(tilt);gc.globalAlpha=.82;gc.shadowColor='#e8a3d060';gc.shadowBlur=12;gc.drawImage(img,-w/2,-h/2,w,h);gc.restore();
  }
}
function paintGalaxy(){
  gc.globalCompositeOperation='source-over';gc.fillStyle='#03020a';gc.fillRect(0,0,gw,gh);
  for(const star of deepStars){
    const x=((star.x*gw+camera.yaw*22)%gw+gw)%gw,y=((star.y*gh+camera.pitch*15)%gh+gh)%gh;
    const alpha=.15+star.s*.55*(.6+.4*Math.sin(galaxyTime*.4+star.phase)**2);
    gc.fillStyle=`rgba(220,207,255,${alpha})`;gc.fillRect(x,y,.5+star.s*1.3,.5+star.s*1.3);
    if(star.s>.975){gc.strokeStyle=`rgba(244,208,255,${alpha*.4})`;gc.lineWidth=.5;gc.beginPath();gc.moveTo(x-4,y);gc.lineTo(x+4,y);gc.moveTo(x,y-4);gc.lineTo(x,y+4);gc.stroke();}
  }
  glowAt({x:-.55,y:.08,z:-.35},.95,'#792f8724');glowAt({x:.5,y:0,z:.3},.8,'#ee366923');glowAt({x:0,y:0,z:0},.4,'#ff9a873d');glowAt({x:0,y:.8,z:0},.6,'#ed216d1d');
  const points=[];
  for(const dust of galaxyCloud){
    const a=dust.a-galaxyTime*.075,p=projectWorld({x:Math.cos(a)*dust.r,y:dust.y,z:Math.sin(a)*dust.r});
    points.push({...p,size:(.35+dust.size*1.25)*p.scale,kind:0,brightness:dust.size,r:dust.r,warm:dust.warm});
  }
  const pulse=1+Math.sin(galaxyTime*1.8)*.018;
  for(const dust of heartCloud){const p=projectWorld({x:dust.x*pulse,y:(dust.y-.85)*pulse+.85,z:dust.z});points.push({...p,size:(.45+dust.size*1.2)*p.scale,kind:1,brightness:dust.size});}
  points.sort((a,b)=>a.depth-b.depth);
  for(const p of points){
    if(p.kind){gc.fillStyle=`rgba(255,${Math.round(70+p.brightness*115)},${Math.round(135+p.brightness*90)},${.3+p.brightness*.65})`;}
    else{const core=Math.max(0,1-p.r*2.7);gc.fillStyle=`rgba(${p.warm>.85?190:255},${Math.round(65+core*160+p.brightness*45)},${Math.round(130+core*90+p.warm*50)},${.18+p.brightness*.65})`;}
    gc.fillRect(p.x,p.y,p.size,p.size);
  }
  // A luminous accretion ring sits inside the same three-dimensional plane.
  glowAt({x:0,y:0,z:0},.16,'#ffbda455');
  gc.save();gc.globalCompositeOperation='lighter';
  for(let i=0;i<700;i++){const seed=i*2.39996,r=.025+(.5+.5*Math.sin(i*17.13))*.13,a=seed+galaxyTime*.3,p=projectWorld({x:Math.cos(a)*r,y:Math.sin(seed)*.008,z:Math.sin(a)*r});gc.fillStyle=i%4?'#ff9db570':'#ffe3ccbb';gc.fillRect(p.x,p.y,p.scale,p.scale);}
  for(let i=0;i<210;i++){const a=i/210*Math.PI*2,p=projectWorld({x:Math.cos(a)*.092,y:.008,z:Math.sin(a)*.092});gc.fillStyle='#ffd9ccaa';gc.fillRect(p.x,p.y,1.5*p.scale,1.5*p.scale);}
  gc.restore();
  for(let i=0;i<10;i++){
    const a=i/10*Math.PI*2-galaxyTime*(.1+(i%3)*.018),r=.43+(i%3)*.29;
    const world={x:Math.cos(a)*r,y:.05+Math.sin(a*2)*.035,z:Math.sin(a)*r},p=projectWorld(world);
    projectedDustTrail(world,a,.5);drawOrbitHeart(p.x,p.y,(1.25+(i%2)*.3)*p.scale,.65);
  }
  for(const orbit of orbitingEnvelopes)projectedDustTrail(envelopeWorld(orbit),orbit.phase,.65);
  const words=settings.floatingWords.length?settings.floatingWords:['my love'];
  for(let i=0;i<9;i++){
    const a=i/9*Math.PI*2-galaxyTime*.04,r=.6+(i%3)*.2,p=projectWorld({x:Math.cos(a)*r,y:.1,z:Math.sin(a)*r});
    gc.save();gc.translate(p.x,p.y);gc.rotate(Math.sin(a)*.12);gc.font=`italic ${Math.max(10,Math.min(17,gw/55))*p.scale}px Georgia`;gc.textAlign='center';gc.shadowColor='#ff69a7';gc.shadowBlur=9;gc.fillStyle='#ffc1d5b3';gc.fillText(words[i%words.length],0,0);gc.restore();
  }
  drawGalaxyCharacters();
}
