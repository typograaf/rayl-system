/* --------------------------------------------------------- the label roll */
var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
var ruler = null, advCache = Object.create(null);
function advance(ch, font){
  var key = font + "|" + ch;
  if (advCache[key] !== undefined) return advCache[key];
  if (!ruler){
    ruler = document.createElement("span");
    ruler.setAttribute("aria-hidden","true");
    ruler.style.cssText = "position:absolute;visibility:hidden;white-space:pre;top:-9999px;left:-9999px;text-box-trim:none";
    document.body.appendChild(ruler);
  }
  ruler.style.font = font;
  ruler.style.letterSpacing = "0.02em";
  ruler.textContent = ch;
  var w = ruler.getBoundingClientRect().width;
  advCache[key] = w;
  return w;
}
function Roll(host){
  this.host = host;
  host.classList.add("rayl-roll");
  this.text = host.dataset.label || host.textContent || "";
  this.swap = host.dataset.swap || this.text;
  this.showing = this.text;
  this.chars = []; this.busy = false; this.pending = null;
  host.textContent = "";
  var cs = getComputedStyle(host);
  this.font = cs.fontStyle+" "+cs.fontWeight+" "+cs.fontSize+"/"+cs.fontSize+" "+cs.fontFamily;
  this.render(this.text);
}
Roll.prototype.grow = function(n){
  while (this.chars.length < n){
    var box = document.createElement("span"); box.className = "rayl-ch";
    var nxt = document.createElement("span"); nxt.className = "rayl-g rayl-nxt";
    var cur = document.createElement("span"); cur.className = "rayl-g rayl-cur";
    box.appendChild(nxt); box.appendChild(cur);
    this.host.appendChild(box);
    this.chars.push({box:box, cur:cur, nxt:nxt});
  }
};
Roll.prototype.render = function(text){        /* no animation, straight to it */
  this.grow(text.length);
  for (var i=0;i<this.chars.length;i++){
    var c = this.chars[i], g = i < text.length ? text.charAt(i) : "";
    c.cur.textContent = g; c.nxt.textContent = g;
    c.box.style.width = (g ? advance(g, this.font) : 0) + "px";
  }
  this.showing = text;
};
Roll.prototype.instant = function(fn){
  this.host.classList.add("is-instant"); fn();
  void this.host.offsetWidth;
  this.host.classList.remove("is-instant");
};
Roll.prototype.settle = function(){
  var self = this;
  clearTimeout(this._t);
  this.instant(function(){
    for (var i=0;i<self.chars.length;i++){
      var c = self.chars[i];
      c.cur.textContent = c.nxt.textContent;
      c.box.classList.remove("is-rolled");
    }
  });
  this.busy = false;
};
/* `force` rolls every character even when the text has not changed — that is
   what a button does on hover. Without it only the characters that actually
   differ move, which is what a counter wants: 12 to 13 rolls one digit.
   A change arriving mid-roll is remembered, not applied: interrupting looked
   like the value simply swapping, which is worse than arriving a beat late. */
Roll.prototype.to = function(next, force){
  var self = this;
  if (this.busy){ this.pending = {t:next, f:force}; return; }
  if (!force && next === this.showing) return;
  if (reduced){ this.render(next); return; }
  this.grow(Math.max(next.length, this.showing.length));
  var moving = [];
  for (var i=0;i<this.chars.length;i++){
    var c = this.chars[i];
    var g = i < next.length ? next.charAt(i) : "";
    var was = c.cur.textContent;
    c.nxt.textContent = g;
    c.box.style.width = (g ? advance(g, this.font) : 0) + "px";
    if (force || g !== was) moving.push(c);
  }
  this.showing = next;
  if (!moving.length) return;
  var idx = moving.map(function(_,i){ return i; });
  for (var k=idx.length-1;k>0;k--){
    var j = Math.floor(Math.random()*(k+1)); var t=idx[k]; idx[k]=idx[j]; idx[j]=t;
  }
  for (var m=0;m<moving.length;m++){
    moving[m].box.style.setProperty("--i", idx[m]);
    moving[m].box.classList.add("is-rolled");
  }
  this.busy = true;
  var cs = getComputedStyle(document.documentElement);
  var ms = parseFloat(cs.getPropertyValue("--rayl-dur")) || 280;
  var st = parseFloat(cs.getPropertyValue("--rayl-stagger")) || 20;
  this._t = setTimeout(function(){
    self.settle();
    var p = self.pending; self.pending = null;
    if (p) self.to(p.t, p.f);
  }, ms + (moving.length - 1) * st + 40);
};
Roll.prototype.turn = function(){ this.to(this.showing, true); };


/* ------------------------------------------------------------- the counter */
/* One column per decimal place. The units column follows the value exactly, so
   dragging spins it; every column above it holds still until the one below is
   about to wrap, then carries over quickly — an odometer, so the number stays
   readable at speed instead of sitting between two digits. */
function Reel(host, max){
  this.host = host;
  host.classList.add("rayl-reel");
  host.textContent = "";
  this.places = String(Math.max(1, Math.round(max))).length;
  var cs = getComputedStyle(host);
  var font = cs.fontStyle+" "+cs.fontWeight+" "+cs.fontSize+"/"+cs.fontSize+" "+cs.fontFamily;
  this.w = advance("0", font);
  this.cols = [];
  for (var p = this.places - 1; p >= 0; p--){
    var col = document.createElement("span");
    col.className = "rayl-col";
    col.style.width = this.w + "px";
    var strip = document.createElement("span");
    strip.className = "rayl-strip";
    for (var d = 0; d <= 10; d++){          /* 0..9 then 0 again, so 9 wraps up */
      var cell = document.createElement("span");
      cell.className = "rayl-digit";
      var num = document.createElement("span");
      num.className = "rayl-num";
      num.textContent = String(d % 10);
      cell.appendChild(num);
      strip.appendChild(cell);
    }
    col.appendChild(strip);
    host.appendChild(col);
    this.cols.push({ el: col, strip: strip, place: p });
  }
}
Reel.prototype.set = function(v){
  var cell = parseFloat(getComputedStyle(this.host).getPropertyValue("--rayl-travel")) || 12;
  v = Math.max(0, v);
  for (var i = 0; i < this.cols.length; i++){
    var c = this.cols[i];
    var unit = Math.pow(10, c.place);
    var raw = v / unit;
    var whole = Math.floor(raw);
    var frac = raw - whole;
    /* the units column runs free; the rest only move as the one below wraps */
    var pos = (whole % 10) + (c.place === 0 ? frac : (frac > 0.9 ? (frac - 0.9) / 0.1 : 0));
    c.strip.style.transform = "translateY(" + (-pos * cell) + "px)";
    var needed = c.place === 0 || v >= unit;
    c.el.style.width = (needed ? this.w : 0) + "px";
  }
};

function upgradeButton(btn){
  if (btn.__rayl) return btn.__rayl;
  var host = document.createElement("span");
  host.dataset.label = btn.dataset.label || btn.textContent.trim();
  if (btn.dataset.swap) host.dataset.swap = btn.dataset.swap;
  var icon = btn.dataset.icon ? makeIcon(btn.dataset.icon) : null;
  btn.textContent = "";
  if (icon) btn.appendChild(icon);
  btn.appendChild(host);
  var r = new Roll(host);
  btn.__rayl = r;
  if (btn.disabled) return r;
  btn.addEventListener("pointerenter", function(){ r.turn(); });
  btn.addEventListener("focus", function(){ r.turn(); });
  if (btn.dataset.swap) btn.addEventListener("click", function(){
    if (r.busy) return;
    var back = r.showing === r.text;
    r.to(back ? r.swap : r.text);
  });
  return r;
}


/* The reveal button: a label pill with a circle behind its right end.
   Its width is the label plus its own padding, the gap and the circle — measured
   from the roll's character boxes, so it fits the text rather than guessing. */
function upgradeIconButton(btn){
  if (btn.__rayl) return btn.__rayl;
  var body = document.createElement("span");
  body.className = "rayl-ibtn-body";
  var host = document.createElement("span");
  host.dataset.label = btn.dataset.label || btn.textContent.trim();
  body.appendChild(host);

  var dot = document.createElement("span");
  dot.className = "rayl-ibtn-dot";
  var icon = document.createElement("span");
  icon.className = "rayl-ibtn-icon";
  var d = ICONS[btn.dataset.icon];
  if (d) icon.innerHTML = '<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">'+d+'</svg>';
  dot.appendChild(icon);

  btn.textContent = "";
  btn.appendChild(body);
  btn.appendChild(dot);

  var r = new Roll(host);
  btn.__rayl = r;

  function size(){
    var w = 0;
    for (var i=0;i<r.chars.length;i++) w += parseFloat(r.chars[i].box.style.width) || 0;
    var h = parseFloat(getComputedStyle(btn).height) || 32.376;
    btn.style.setProperty("--w", (w + 24 + 6 + h) + "px");
  }
  size();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){
    advCache = Object.create(null); r.render(r.showing); size();
  });

  if (btn.disabled) return r;
  btn.addEventListener("pointerenter", function(){ r.turn(); });
  btn.addEventListener("focus", function(){ r.turn(); });
  return r;
}

/* ------------------------------------------------------------- the icons */
function makeIcon(name){
  var span = document.createElement("span");
  span.className = "rayl-icon";
  span.setAttribute("aria-hidden","true");
  var d = ICONS[name];
  if (d) span.innerHTML = '<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">'+d+'</svg>';
  return span;
}
function upgradeIcon(el){
  if (el.__rayl) return;
  var d = ICONS[el.dataset.icon];
  if (d) el.innerHTML = '<svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">'+d+'</svg>';
  el.setAttribute("aria-hidden","true");
  el.__rayl = true;
}
