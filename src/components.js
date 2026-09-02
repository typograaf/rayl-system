/* --------------------------------------------------------- the label roll */
var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
var ruler = null, advCache = Object.create(null);
function advance(ch, font, track){
  var key = font + "|" + track + "|" + ch;
  if (advCache[key] !== undefined) return advCache[key];
  if (!ruler){
    ruler = document.createElement("span");
    ruler.setAttribute("aria-hidden","true");
    ruler.style.cssText = "position:absolute;visibility:hidden;white-space:pre;top:-9999px;left:-9999px;text-box-trim:none";
    document.body.appendChild(ruler);
  }
  ruler.style.font = font;
  ruler.style.letterSpacing = track;   /* a control tracks 0, running text +2% */
  ruler.textContent = ch;
  var w = ruler.getBoundingClientRect().width;
  advCache[key] = w;
  return w;
}
/* `owner` is the thing the roll is the label OF — a button, a cell, a row. It
   matters because a rolled label is TWO glyphs per character: the one leaving
   and the one arriving. Read as text it says EExxppoorrtt, which is what a
   screen reader announces and what anything asking the button its name gets
   back. So the spans are hidden from the accessibility tree and the owner
   carries the real name, kept in step with what is showing. */
function Roll(host, owner){
  this.host = host;
  this.owner = owner || null;
  host.classList.add("rayl-roll");
  host.setAttribute("aria-hidden", "true");
  this.text = host.dataset.label || host.textContent || "";
  this.swap = host.dataset.swap || this.text;
  this.showing = this.text;
  this.chars = []; this.busy = false; this.pending = null;
  host.textContent = "";
  var cs = getComputedStyle(host);
  this.font = cs.fontStyle+" "+cs.fontWeight+" "+cs.fontSize+"/"+cs.fontSize+" "+cs.fontFamily;
  this.track = cs.letterSpacing;
  this.render(this.text);
  this.name();
}
/* An owner that came with a name of its own keeps it — an icon-only button is
   labelled for what it does, not for the nothing it has written on it. */
Roll.prototype.name = function(){
  if (this.owner && !this.owner.__raylNamed)
    this.owner.setAttribute("aria-label", this.showing);
};

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
    c.box.style.width = (g ? advance(g, this.font, this.track) : 0) + "px";
  }
  this.showing = text;
  this.name();
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
    c.box.style.width = (g ? advance(g, this.font, this.track) : 0) + "px";
    if (force || g !== was) moving.push(c);
  }
  this.showing = next;
  this.name();
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
  var base = parseFloat(cs.getPropertyValue("--rayl-stagger")) || 20;
  var cap = parseFloat(cs.getPropertyValue("--rayl-roll-max")) || 400;
  /* short labels keep the full stagger; longer ones compress so that every
     label, whatever its length, finishes at about the same moment */
  var n = moving.length;
  var st = n > 1 ? Math.min(base, Math.max(0, (cap - ms) / (n - 1))) : 0;
  this.host.style.setProperty("--rayl-stagger", st + "ms");
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
/* How many decimals a step asks for: 0.01 wants two, 0.5 wants one, 1 wants
   none. Read off the step rather than guessed, so a control shows exactly the
   precision it can actually reach. */
function decimalsOf(step){
  var t = String(step);
  var dot = t.indexOf(".");
  return dot < 0 ? 0 : Math.min(3, t.length - dot - 1);
}

function Reel(host, max, step, min){
  this.host = host;
  host.classList.add("rayl-reel");
  host.textContent = "";
  this.dp = decimalsOf(step == null ? 1 : step);
  var span = Math.max(Math.abs(max || 1), Math.abs(min || 0), 1);
  this.places = String(Math.max(1, Math.floor(span))).length;
  this.signed = (min != null && min < 0);
  var cs = getComputedStyle(host);
  var font = cs.fontStyle+" "+cs.fontWeight+" "+cs.fontSize+"/"+cs.fontSize+" "+cs.fontFamily;
  this.w = advance("0", font, cs.letterSpacing);
  this.cols = [];

  /* A minus is not a digit and does not roll: it appears and goes, because a
     number crossing zero has not counted round to its sign. */
  if (this.signed){
    this.sign = document.createElement("span");
    this.sign.className = "rayl-sign";
    this.sign.innerHTML = "<span>\u2212</span>";
    host.appendChild(this.sign);
    this.signW = advance("\u2212", font, cs.letterSpacing);
  }

  var self = this;
  function column(place){
    var col = document.createElement("span");
    col.className = "rayl-col";
    col.style.width = self.w + "px";
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
    self.cols.push({ el: col, strip: strip, place: place });
  }

  for (var p = this.places - 1; p >= 0; p--) column(p);
  if (this.dp){
    var dot = document.createElement("span");
    dot.className = "rayl-point";
    dot.innerHTML = "<span>.</span>";
    host.appendChild(dot);
    this.dotW = advance(".", font, cs.letterSpacing);
    for (var q = 1; q <= this.dp; q++) column(-q);
  }
}
Reel.prototype.set = function(v){
  var cell = parseFloat(getComputedStyle(this.host).getPropertyValue("--rayl-travel")) || 12;
  var neg = v < 0;
  var a = Math.abs(v);
  if (this.sign) this.sign.style.width = (neg ? this.signW : 0) + "px";
  for (var i = 0; i < this.cols.length; i++){
    var c = this.cols[i];
    var unit = Math.pow(10, c.place);
    var raw = a / unit;
    var whole = Math.floor(raw + 1e-9);
    var frac = raw - whole;
    /* The lowest column runs free; every column above it holds still until the
       one below is about to wrap. With decimals the lowest is the last one, not
       the units — which is what keeps a hundredth spinning while the whole
       number stands still. */
    var lowest = -this.dp;
    var pos = (whole % 10) + (c.place === lowest ? frac : (frac > 0.9 ? (frac - 0.9) / 0.1 : 0));
    c.strip.style.transform = "translateY(" + (-pos * cell) + "px)";
    /* A leading zero collapses; a decimal one never does, because 0.5 is not 5
       and .50 is not a number anybody writes. */
    var needed = c.place <= 0 || a >= unit;
    c.el.style.width = (needed ? this.w : 0) + "px";
  }
};

/* WHEN a label rolls is the control's to choose, not a constant.
     hover  the label turns as the pointer arrives — the default, and what makes
            a button read as a material that can turn
     press  it turns when the button is clicked, and not before. For a panel
            where the pointer crosses a dozen controls on the way to one, a turn
            on every crossing is noise; the colour is enough to say "this one".
     none   never on its own. The host calls turn() when its own state says so —
            an option group whose selection is decided elsewhere. */
function upgradeButton(btn, opts){
  if (btn.__rayl) return btn.__rayl;
  var host = document.createElement("span");
  host.dataset.label = btn.dataset.label || btn.textContent.trim();
  if (btn.dataset.swap) host.dataset.swap = btn.dataset.swap;
  var icon = btn.dataset.icon ? makeIcon(btn.dataset.icon) : null;
  btn.textContent = "";
  if (icon) btn.appendChild(icon);
  btn.appendChild(host);
  btn.__raylNamed = btn.hasAttribute("aria-label");
  var r = new Roll(host, btn);
  btn.__rayl = r;
  if (btn.disabled) return r;
  var when = (opts && opts.roll) || btn.dataset.roll || "hover";
  if (when === "hover"){
    btn.addEventListener("pointerenter", function(){ r.turn(); });
    btn.addEventListener("focus", function(){ r.turn(); });
  } else if (when === "press"){
    btn.addEventListener("click", function(){ r.turn(); });
  }
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

  btn.__raylNamed = btn.hasAttribute("aria-label");
  var r = new Roll(host, btn);
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

/* ---------------------------------------------------------- a line of text */
/* The roll is not a button feature. Where the thing that changed is a value on
   a line — an address, a count, a status — the same movement runs on the line
   itself, clipped to the row. */
function upgradeLine(el){
  if (el.__rayl) return el.__rayl;
  el.classList.add("is-line");
  /* a line labels itself: the name goes on the element the roll is on */
  var r = new Roll(el, el);
  el.removeAttribute("aria-hidden");
  el.__rayl = r;
  return r;
}

/* A control hands a line its new value: data-rolls names the line's id. The
   line goes back on its own after a beat, because a status is a moment and the
   address underneath it is what the row is actually for. */
function wireRolls(root){
  [].forEach.call(root.querySelectorAll("[data-rolls]"), function(btn){
    if (btn.__raylRolls) return;
    btn.__raylRolls = true;
    btn.addEventListener("click", function(){
      var line = document.getElementById(btn.dataset.rolls);
      var r = line && line.__rayl;
      if (!r || r.busy) return;
      var back = r.showing === r.text;
      r.to(back ? r.swap : r.text);
      if (back){
        clearTimeout(r.__back);
        r.__back = setTimeout(function(){ r.to(r.text); }, 2400);
      }
    });
  });
}


/* -------------------------------------------------------- the option group */
/* A row of cells where exactly one is on. Hover turns that cell's label; the
   click turns it a second time and opens the circle. A turn asked for while one
   is still running queues rather than being dropped — that is Roll's own
   behaviour, so nothing extra is needed here.

   No turn on focus: an arrow key moves focus and selects in the same beat, and
   two turns fired back to back read as a stutter. The turn belongs to the
   selection, not to the focus ring. */
function upgradeSeg(seg){
  if (seg.__rayl) return seg.__rayl;
  seg.__rayl = true;
  var opts = [].slice.call(seg.querySelectorAll(".rayl-seg-opt"));
  seg.setAttribute("role", "radiogroup");

  opts.forEach(function(o){
    var fill = document.createElement("span");
    fill.className = "rayl-seg-fill";
    var host = document.createElement("span");
    host.dataset.label = o.dataset.label || o.textContent.trim();
    o.textContent = "";
    o.appendChild(fill);
    o.appendChild(host);
    o.__raylNamed = o.hasAttribute("aria-label");
    o.__roll = new Roll(host, o);
    o.setAttribute("role", "radio");
    o.setAttribute("aria-checked", o.classList.contains("is-on") ? "true" : "false");
    o.tabIndex = -1;
  });
  /* one tab stop for the whole group: the selected cell, or the first that can
     take it, so the group is never unreachable from the keyboard */
  var on = seg.querySelector(".rayl-seg-opt.is-on:enabled") ||
           seg.querySelector(".rayl-seg-opt:enabled");
  if (on) on.tabIndex = 0;

  function select(next){
    var prev = seg.querySelector(".rayl-seg-opt.is-on");
    if (!next || next === prev || next.disabled) return;
    if (prev){
      prev.classList.remove("is-on");
      prev.setAttribute("aria-checked", "false");
      prev.tabIndex = -1;
    }
    next.classList.add("is-on");
    next.setAttribute("aria-checked", "true");
    next.tabIndex = 0;
    next.__roll.turn();
    seg.dispatchEvent(new CustomEvent("rayl:change", {bubbles:true, detail:{
      value: next.__roll.text, index: opts.indexOf(next), option: next}}));
  }
  seg.select = select;

  opts.forEach(function(o){
    if (o.disabled) return;
    o.addEventListener("pointerenter", function(){ o.__roll.turn(); });
    o.addEventListener("click", function(){ select(o); });
    o.addEventListener("keydown", function(e){
      var d = (e.key === "ArrowRight" || e.key === "ArrowDown") ?  1
            : (e.key === "ArrowLeft"  || e.key === "ArrowUp")   ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var i = opts.indexOf(o);
      for (var n = 0; n < opts.length; n++){
        i = (i + d + opts.length) % opts.length;
        if (!opts[i].disabled){ select(opts[i]); opts[i].focus(); return; }
      }
    });
  });
  return seg;
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
