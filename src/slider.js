/* The track, from the app's src/track.js — a rounded nub carrying the value with
   a 2px rail running *out* of it through a concave fillet on each side. Each rail
   is drawn only when there is room, so a nub at either end closes on its own
   corner instead of growing a stub.

   The app's fillet is a hand-fitted cubic sized for a nub of exactly 12. Here the
   nub grows on hover, so the fillet is written as an arc instead: at rest it is
   the same quarter-circle of radius 2, and it stays tangent to both the nub and
   the rail at every size. */
const H=12, NUB_R=3, RAIL_H=2, MIN_NUB=24, PAD=24, VB=24;
const S_IDLE=1, S_HOVER=1.35;
/* magnetism: the nub leans toward a nearby cursor, but never changes the value */
const PULL_RADIUS=104, PULL_STRENGTH=0.6, PULL_MAX=12;
/* vertically the nub is welded to the rail, so it can only lean as far as the
   fillet allows before the join would invert — 0.7 of it leaves room to spare */
const PULL_STRENGTH_Y=0.55, PULL_ROOM=0.7;
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const rnd=v=>Math.round(v*1000)/1000;
const easeOut=t=>1-Math.pow(1-t,3);
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;
let measure=null;
function textWidth(t,size){
  if(!measure) measure=document.createElement("canvas").getContext("2d");
  measure.font="500 "+size+"px Azeret, ui-monospace, monospace";
  return measure.measureText(t).width;
}

/* One closed path. cy is the rail's centre line; the nub is nh tall, and dy
   leans it off that line. Leaning makes the two fillets unequal — the one it
   moves toward shortens, the other grows — which is what keeps the nub welded
   to the rail instead of floating away from it. */
function trackPath(W,x,w,cy,nh,r,dy){
  const right=x+w, cap=RAIL_H/2, rt=cy-cap, rb=cy+cap;
  const top=cy+dy-nh/2, bot=cy+dy+nh/2;
  const fT=rt-(top+r), fB=(bot-r)-rb;
  const room=Math.max(fT,fB)+cap;
  const hasL=x>room, hasR=right<W-room, ok=fT>0.01&&fB>0.01;
  const A=(rr,ex,ey,sw)=>"A"+rnd(rr)+" "+rnd(rr)+" 0 0 "+sw+" "+rnd(ex)+" "+rnd(ey);
  const d=["M"+rnd(x+r)+" "+rnd(top),"H"+rnd(right-r),A(r,right,top+r,1)];
  if(hasR&&ok){
    d.push(A(fT,right+fT,rt,0),"H"+rnd(W-cap),A(cap,W-cap,rb,1),
           "H"+rnd(right+fB),A(fB,right,rb+fB,0));
  } else d.push("L"+rnd(right)+" "+rnd(bot-r));
  d.push(A(r,right-r,bot,1),"H"+rnd(x+r),A(r,x,bot-r,1));
  if(hasL&&ok){
    d.push(A(fB,x-fB,rb,0),"H"+rnd(cap),A(cap,cap,rt,1),
           "H"+rnd(x-fT),A(fT,x,rt-fT,0));
  } else d.push("L"+rnd(x)+" "+rnd(top+r));
  d.push(A(r,x+r,top,1),"Z");
  return d.join("");
}

function mountSlider(host){
  const min=+host.dataset.min,max=+host.dataset.max,step=+host.dataset.step;
  /* `shown` runs free while dragging so the nub tracks the cursor exactly; the
     readout is always the snapped value, and on release the nub glides to it */
  let shown=+host.dataset.val, W=170;
  let scale=S_IDLE, pull=0, pullY=0, raf=0;
  let box={x:0,w:MIN_NUB,top:0,bot:H};     /* the nub as last drawn */
  const aS={from:S_IDLE,to:S_IDLE,t0:0,dur:0,done:true};
  const aP={from:0,to:0,t0:0,dur:0,done:true};
  const aY={from:0,to:0,t0:0,dur:0,done:true};
  const aV={from:0,to:0,t0:0,dur:0,done:true};
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("height",String(VB));
  svg.setAttribute("role","slider");
  svg.setAttribute("tabindex","0");
  svg.setAttribute("aria-label",host.dataset.label||"value");
  svg.setAttribute("aria-valuemin",String(min));
  svg.setAttribute("aria-valuemax",String(max));
  const path=document.createElementNS(NS,"path");
  svg.append(path); host.append(svg);

  const snap=v=>clamp(Math.round((v-min)/step)*step+min,min,max);
  const readout=()=>String(snap(shown));
  /* the readout is a real element riding the nub — SVG text cannot carry a
     per-digit reel, and a number being dragged wants a reel, not a swap */
  const val=document.createElement("span");
  val.className="rayl-val";
  host.append(val);
  const reel=new Reel(val,max);
  function nubWidth(s){
    return Math.max(MIN_NUB*s, Math.ceil(textWidth(readout(),8*s))+PAD*s);
  }
  function render(){
    W=Math.max(90,Math.round(host.clientWidth||170));
    svg.setAttribute("viewBox","0 0 "+W+" "+VB);
    const cy=VB/2, s=scale, nh=H*s, r=NUB_R*s, w=nubWidth(s);
    const u=max===min?0:clamp((shown-min)/(max-min),0,1);
    const home=u*(W-w);                    /* no inset: it reaches both ends */
    const x=clamp(home+pull,0,W-w);        /* the lean is drawn, never stored */
    const room=leanRoom(s), dy=clamp(pullY,-room,room);
    box={x:x,w:w,top:cy+dy-nh/2,bot:cy+dy+nh/2};
    path.setAttribute("d",trackPath(W,x,w,cy,nh,r,dy));
    /* the box is laid out unscaled and then scaled whole, so the reel's own
       measurements never change underneath it */
    val.style.width=rnd(w/s)+"px";
    val.style.height=H+"px";
    val.style.left=rnd(x+w/2)+"px";
    /* the readout is a sibling of the svg, not a child of it: the svg is 24
       tall and centred on a 12 box, so its own centre line sits (VB-H)/2
       above the host's. Without that term the number rides six low. */
    val.style.top=rnd(cy+dy-(VB-H)/2)+"px";
    val.style.transform="translate(-50%,-50%) scale("+rnd(s)+")";
    reel.set(shown);                     /* continuous: it spins with the drag */
    svg.setAttribute("aria-valuenow",readout());
  }
  function read(a,now){
    const p=a.dur<=0?1:clamp((now-a.t0)/a.dur,0,1);
    a.done=p>=1;
    return a.from+(a.to-a.from)*easeOut(p);
  }
  function tick(now){
    scale=read(aS,now); pull=read(aP,now); pullY=read(aY,now);
    if(!aV.done) shown=read(aV,now);
    render();
    raf=(aS.done&&aP.done&&aY.done&&aV.done)?0:requestAnimationFrame(tick);
  }
  function kick(){ if(!raf) raf=requestAnimationFrame(tick); }
  function run(a,target,ms,current){
    if(REDUCED){ a.from=a.to=target; a.dur=0; a.done=true; return target; }
    a.from=current; a.to=target; a.dur=ms; a.t0=performance.now(); a.done=false;
    kick(); return current;
  }
  function scaleTo(target,ms){
    if(Math.abs(target-scale)<0.001&&aS.done) return;
    if(REDUCED){ scale=target; render(); return; }
    run(aS,target,ms,scale);
  }
  function pullTo(target,ms){
    if(REDUCED){ pull=target; render(); return; }
    run(aP,target,ms,pull);
  }
  function pullYTo(target,ms){
    if(REDUCED){ pullY=target; render(); return; }
    run(aY,target,ms,pullY);
  }
  function leanRoom(s){                    /* how far the fillet lets it lean */
    return (H*s/2 - RAIL_H/2 - NUB_R*s)*PULL_ROOM;
  }

  function nubHome(){
    const w=nubWidth(scale);
    const u=max===min?0:clamp((shown-min)/(max-min),0,1);
    return u*(W-w)+w/2;
  }
  function localX(clientX){
    const rect=svg.getBoundingClientRect();
    return ((clientX-rect.left)/rect.width)*W;
  }
  /* unsnapped: the nub follows the cursor exactly while it is held */
  function valueAt(clientX){
    const rect=svg.getBoundingClientRect();
    const px=((clientX-rect.left)/rect.width)*W;
    const w=nubWidth(scale), span=W-w;
    const u=span<=0?0:clamp((px-w/2)/span,0,1);
    return clamp(min+u*(max-min),min,max);
  }

  let hovering=false, dragging=false, focused=false;
  /* Engaged is one state with three ways in, and the nub carries the hover
     colour through all of them. Magnetism already starts before the pointer
     reaches the nub, so the colour has to start there too — otherwise the thing
     leans toward you while still insisting it has not been touched. */
  function engaged(){ host.classList.toggle("is-near", hovering||dragging||focused); }
  /* growth and magnetism share one range: the moment the nub starts leaning
     toward the cursor it is also allowed to grow. A little hysteresis on the
     boundary so a cursor resting exactly on it does not stutter. */
  function inRange(dist){ return dist < (hovering ? PULL_RADIUS+10 : PULL_RADIUS); }
  svg.addEventListener("pointerenter",()=>{ /* the rail alone does not grow it */ });
  svg.addEventListener("pointerleave",()=>{
    hovering=false; engaged();
    if(!dragging){ scaleTo(S_IDLE,240); pullTo(0,320); pullYTo(0,320); }  /* drift home */
  });
  svg.addEventListener("pointerdown",e=>{
    dragging=true; engaged();
    try{svg.setPointerCapture(e.pointerId);}catch(err){}
    svg.focus();
    scaleTo(S_HOVER,120);                  /* touch has no hover, so grow on contact */
    pullTo(0,120); pullYTo(0,120);         /* the cursor takes it from here */
    aV.done=true; shown=valueAt(e.clientX); render(); e.preventDefault();
  });
  svg.addEventListener("pointermove",e=>{
    if(dragging){ shown=valueAt(e.clientX); render(); return; }
    /* lean toward the cursor: nothing at the nub, nothing past the radius,
       most in between, so it eases in and out of range on its own */
    const rect=svg.getBoundingClientRect();
    const px=localX(e.clientX);
    const py=((e.clientY-rect.top)/rect.height)*VB;
    const d=px-nubHome(), dv=py-VB/2;
    const dist=Math.hypot(d,dv);
    const on=inRange(dist);
    if(on!==hovering){ hovering=on; engaged(); scaleTo(on?S_HOVER:S_IDLE, on?180:240); }
    if(!on){ pullTo(0,140); pullYTo(0,140); return; }
    const fall=1-dist/PULL_RADIUS;         /* nothing at the nub, nothing at the edge */
    const room=leanRoom(scale);
    pullTo(clamp(d*PULL_STRENGTH*fall,-PULL_MAX,PULL_MAX),90);
    pullYTo(clamp(dv*PULL_STRENGTH_Y*fall,-room,room),90);
  });
  function release(){
    if(!dragging) return;
    dragging=false; engaged();
    const landed=snap(shown);              /* settle onto the nearest step */
    if(REDUCED) shown=landed; else run(aV,landed,200,shown);
    scaleTo(hovering?S_HOVER:S_IDLE, hovering?140:240);
    if(!hovering){ pullTo(0,320); pullYTo(0,320); }
    render();
  }
  svg.addEventListener("pointerup",release);
  svg.addEventListener("pointercancel",release);
  svg.addEventListener("focus",()=>{ focused=true; engaged(); scaleTo(S_HOVER,180); });
  svg.addEventListener("blur",()=>{ focused=false; engaged();
    if(!hovering&&!dragging) scaleTo(S_IDLE,240); });
  svg.addEventListener("keydown",e=>{
    const n={ArrowLeft:-1,ArrowDown:-1,ArrowRight:1,ArrowUp:1}[e.key];
    if(!n) return; e.preventDefault();
    const next=snap(snap(shown)+n*step*(e.shiftKey?10:1));
    if(REDUCED){ shown=next; render(); } else run(aV,next,140,shown);
  });

  render();
  if(window.ResizeObserver) new ResizeObserver(render).observe(host);
}
