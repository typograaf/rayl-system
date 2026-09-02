/* ============================================= rayl-solve: the loading mark
 * What Rayl shows while something is loading. Not decoration on the logo: the
 * mark is the thing that moves, and its solved state is the icon, so a wait
 * ends on the brand rather than on a spinner that had nothing to do with it.
 *
 * Adopted from examples/rayl-solve.html. Its timings and its curve are NOT the
 * system's — see RAYL-OPEN.md, "The loading mark's timing".
 * ========================================================================= */

/* ============================================== rayl-solve: the mark, solving
 * A bandaged two-by-two. The bar is glued across two cells, so a layer can
 * only turn when it does not cut one. The camera never moves: face-on is the
 * only view the mark is allowed to be seen from, and nothing is shaded, so a
 * mechanism that is genuinely three-dimensional arrives as flat drawing.
 *
 * One function, one element. Everything it knows is inside it; the puzzle
 * itself is worked out once and shared, because it is the same puzzle for
 * every instance on the page.
 * ========================================================================= */
function raylSolve(el){
  if (el.__rayl) return el;
  el.__rayl = true;

  var NS = "http://www.w3.org/2000/svg";

  /* --------------------------------------------------------- the puzzle --
   * Two thousand and sixteen positions, none more than ten turns from home.
   * Small enough to hold, so the solve is a lookup rather than a search. */
  var P = raylSolve.puzzle || (raylSolve.puzzle = (function(){

    /* The three shapes, each a recipe rather than a drawing, so it can be
       asked for at any size: the corners of its box and the radius at each
       one. What is drawn is the outline around the circles sitting in those
       corners, arcs where the circles are and straight runs on the common
       tangents between them. Built this way a shape cannot misbehave at any
       size — squeeze it and a circle becomes a capsule, a capsule a line. */
    var SHAPES = {
      bar:      {w:150, h:69, corners:[[-1,-1,17.5],[1,-1,34.5],[1,1,34.5],[-1,1,17.5]]},
      circle:   {w:69,  h:69, corners:[[-1,-1,34.5],[1,-1,34.5],[1,1,34.5],[-1,1,34.5]]},
      triangle: {w:69,  h:69, corners:[[-1,-1,17.5],[1,1,17.5],[-1,1,17.5]]}
    };

    function num(v){ return Math.round(v * 1000) / 1000; }

    function outline(shape, sx, sy){
      var w = shape.w * sx, h = shape.h * sy, n = shape.corners.length, i;
      if (w <= 0.01 || h <= 0.01) return "";
      var c = [];
      for (i=0;i<n;i++){
        var k = shape.corners[i];
        var r = Math.min(k[2], w/2, h/2);
        c.push([k[0] * (w/2 - r), k[1] * (h/2 - r), r]);
      }
      var starts = [], ends = [];
      for (i=0;i<n;i++){
        var a = c[i], b = c[(i+1)%n];
        var dx = b[0]-a[0], dy = b[1]-a[1], len = Math.hypot(dx, dy);
        var nx, ny;
        if (len < 1e-9){
          /* two corner circles in the same place — a circle is four of them —
             so the tangent comes from which side of the box they sit on */
          var ka = shape.corners[i], kb = shape.corners[(i+1)%n];
          if (ka[1] === kb[1]){ nx = 0; ny = ka[1]; }
          else if (ka[0] === kb[0]){ nx = ka[0]; ny = 0; }
          else { nx = 0; ny = ka[1] || -1; }
        } else {
          var ux = dx/len, uy = dy/len;
          var lean = (a[2] - b[2]) / len;
          if (lean > 1) lean = 1; else if (lean < -1) lean = -1;
          var lie = Math.sqrt(1 - lean*lean);
          nx = uy * lie + ux * lean;
          ny = -ux * lie + uy * lean;
        }
        ends[i] = [a[0] + nx*a[2], a[1] + ny*a[2]];
        starts[(i+1)%n] = [b[0] + nx*b[2], b[1] + ny*b[2]];
      }
      var d = "M" + num(starts[0][0]) + " " + num(starts[0][1]);
      for (i=0;i<n;i++){
        var r2 = c[i][2];
        if (r2 > 0.002 &&
            (Math.abs(starts[i][0]-ends[i][0]) > 0.002 ||
             Math.abs(starts[i][1]-ends[i][1]) > 0.002))
          d += "A" + num(r2) + " " + num(r2) + " 0 0 1 " + num(ends[i][0]) + " " + num(ends[i][1]);
        else
          d += "L" + num(ends[i][0]) + " " + num(ends[i][1]);
        var nx2 = starts[(i+1)%n];
        d += "L" + num(nx2[0]) + " " + num(nx2[1]);
      }
      return d + "Z";
    }

    /* Screen axes: x right, y down, z toward you. One lattice step is the
       icon's own pitch, 81 of its 150 units; a shape is 69 of them, so what
       is left between them is the gap in the mark itself. */
    var HALF = 40.5, CELL = 81, LAP = 2, PEBBLE = 0.34;

    var ID = [1,0,0, 0,1,0, 0,0,1];
    var BASE = [[1,0,0, 0,0,-1, 0,1,0],
                [0,0,1, 0,1,0, -1,0,0],
                [0,-1,0, 1,0,0, 0,0,1]];
    function mul(a,b){
      var o = new Array(9);
      for (var r=0;r<3;r++) for (var c=0;c<3;c++){
        var s=0; for (var k=0;k<3;k++) s += a[r*3+k]*b[k*3+c];
        o[r*3+c]=s;
      }
      return o;
    }
    function turn(m,v){
      return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2],
              m[3]*v[0]+m[4]*v[1]+m[5]*v[2],
              m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];
    }
    var ORI = [ID], ORI_AT = {};
    ORI_AT[ID.join(",")] = 0;
    for (var qi=0; qi<ORI.length; qi++){
      for (var bi=0; bi<3; bi++){
        var nm = mul(BASE[bi], ORI[qi]), nk = nm.join(",");
        if (!(nk in ORI_AT)){ ORI_AT[nk] = ORI.length; ORI.push(nm); }
      }
    }

    /* six pieces over eight cells: two bars glued along x, four corners */
    var HOME = [
      {c:[0,-1,1],  long:[1,0,0], art:"bar"},
      {c:[0,-1,-1], long:[1,0,0], art:"bar"},
      {c:[-1,1,1],  long:null,    art:"circle"},
      {c:[1,1,1],   long:null,    art:"triangle"},
      {c:[-1,1,-1], long:null,    art:"circle"},
      {c:[1,1,-1],  long:null,    art:"triangle"}
    ];

    /* Five layers, not six. The back layer is there, but nothing in it is
       drawn, so turning it is a turn nobody can see, and a run of those reads
       as the mark sitting still. Leaving it out costs nothing: every position
       is still reachable, the furthest just goes from nine turns out to ten. */
    var MOVES = [];
    for (var ax=0; ax<3; ax++) for (var side=0; side<2; side++){
      if (ax === 2 && !side) continue;
      for (var q=1; q<=3; q++){
        var m = ID;
        for (var i=0;i<q;i++) m = mul(BASE[ax], m);
        MOVES.push({axis:ax, val:side?1:-1, quarters:q, mat:m, layer:ax*2+side});
      }
    }
    function inverse(m){ var b = m - m%3; return b + (2 - m%3); }
    function sameLayer(a,b){ return MOVES[a].layer === MOVES[b].layer; }
    function isSpin(m){ return MOVES[m].axis === 2; }

    function solved(){
      return HOME.map(function(h){ return {c:h.c.slice(), o:0}; });
    }
    function cellsOf(st,i){
      var p = st[i], L = HOME[i].long;
      if (!L) return [p.c];
      var d = turn(ORI[p.o], L);
      return [[p.c[0]+d[0], p.c[1]+d[1], p.c[2]+d[2]],
              [p.c[0]-d[0], p.c[1]-d[1], p.c[2]-d[2]]];
    }
    /* 2 = the whole piece is in this layer, 1 = the layer cuts it, 0 = out */
    function sits(st,i,axis,val){
      var cs = cellsOf(st,i), inside = 0;
      for (var k=0;k<cs.length;k++) if (cs[k][axis] === val) inside++;
      return inside === cs.length ? 2 : inside ? 1 : 0;
    }
    function legal(st,m){
      var mv = MOVES[m];
      for (var i=0;i<HOME.length;i++) if (sits(st,i,mv.axis,mv.val) === 1) return false;
      return true;
    }
    function play(st,m){
      var mv = MOVES[m], out = [];
      for (var i=0;i<HOME.length;i++){
        var p = st[i];
        if (sits(st,i,mv.axis,mv.val) === 2)
          out.push({c:turn(mv.mat,p.c), o:ORI_AT[mul(mv.mat, ORI[p.o]).join(",")]});
        else out.push({c:p.c.slice(), o:p.o});
      }
      return out;
    }
    function key(st){
      var k = "";
      for (var i=0;i<HOME.length;i++)
        k += (st[i].c[0]+1) + "" + (st[i].c[1]+1) + "" + (st[i].c[2]+1) + st[i].o.toString(36);
      return k;
    }
    var GOAL = key(solved());

    /* every position knows the turn that takes it one step nearer home */
    var DIST = {}, TOWARD = {};
    (function(){
      var front = [solved()];
      DIST[GOAL] = 0;
      while (front.length){
        var next = [];
        for (var i=0;i<front.length;i++){
          var s = front[i], d = DIST[key(s)];
          for (var m=0;m<MOVES.length;m++){
            if (!legal(s,m)) continue;
            var t = play(s,m), k = key(t);
            if (k in DIST) continue;
            DIST[k] = d + 1;
            TOWARD[k] = inverse(m);
            next.push(t);
          }
        }
        front = next;
      }
    })();
    function road(st){
      var path = [], s = st, guard = 0;
      while (key(s) !== GOAL && guard++ < 32){
        var m = TOWARD[key(s)];
        path.push(m);
        s = play(s, m);
      }
      return path;
    }

    function options(st, avoid){
      var out = [];
      for (var m=0;m<MOVES.length;m++){
        if (!legal(st,m)) continue;
        if (avoid !== undefined && sameLayer(m, avoid)) continue;
        out.push(m);
      }
      return out;
    }
    /* nineteen positions in a hundred can do nothing but spin the whole mark,
       so a walk that wanders into one has to spin its way back out */
    function cornered(st){
      for (var m=0;m<MOVES.length;m++) if (!isSpin(m) && legal(st,m)) return false;
      return true;
    }
    function choices(st, avoid, sober){
      var all = options(st, avoid);
      if (!all.length) all = options(st);
      var spins = [], turns = [], open = [];
      for (var i=0;i<all.length;i++){
        var m = all[i];
        if (isSpin(m)){ spins.push(m); continue; }
        turns.push(m);
        if (!cornered(play(st, m))) open.push(m);
      }
      var pool;
      if (!turns.length){
        pool = [];
        for (var j=0;j<spins.length;j++) if (!cornered(play(st, spins[j]))) pool.push(spins[j]);
        if (!pool.length) pool = spins;
      }
      else if (!sober && spins.length && Math.random() < 0.15) pool = spins;
      else pool = open.length ? open : turns;
      return pool;
    }
    function wander(st, avoid, sober){
      var pool = choices(st, avoid, sober);
      return pool[Math.floor(Math.random()*pool.length)];
    }
    /* A random walk takes a long time to get anywhere. This takes the turn
       that leaves the mark furthest from home, so it is properly lost in a
       handful rather than tearing about for half a minute. */
    function stray(st, avoid, sober){
      var pool = choices(st, avoid, sober), far = -1, best = [];
      for (var i=0;i<pool.length;i++){
        var d = DIST[key(play(st, pool[i]))];
        if (d === undefined) d = -1;
        if (d > far){ far = d; best = [pool[i]]; }
        else if (d === far) best.push(pool[i]);
      }
      return best[Math.floor(Math.random()*best.length)];
    }

    /* ------------------------------------------------------ the drawing --
     * A layer turns exactly as it does on the cube, the near pieces swinging
     * wide and the far ones coming into view behind them. What differs is
     * what gets drawn: the projection only says how wide a face has become,
     * and the shape is cut again at that width with its corners still round.
     * Nothing is scaled and nothing is shaded. */
    function spinAbout(axis, deg){
      var r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
      if (axis === 0) return [1,0,0, 0,c,-s, 0,s,c];
      if (axis === 1) return [c,0,s, 0,1,0, -s,0,c];
      return [c,-s,0, s,c,0, 0,0,1];
    }
    var FACEUV = [
      {d:[1,0,0],  U:[0,0,-1], V:[0,1,0]},
      {d:[-1,0,0], U:[0,0,1],  V:[0,1,0]},
      {d:[0,-1,0], U:[1,0,0],  V:[0,0,1]},
      {d:[0,1,0],  U:[1,0,0],  V:[0,0,-1]},
      {d:[0,0,1],  U:[1,0,0],  V:[0,1,0]},
      {d:[0,0,-1], U:[-1,0,0], V:[0,1,0]}
    ];
    function axisOf(v){ return v[0] ? 0 : v[1] ? 1 : 2; }
    /* a bar lying front to back counts as at the front, though its middle is not */
    function atFront(st, i){
      var cs = cellsOf(st, i);
      for (var k=0;k<cs.length;k++) if (cs[k][2] > 0) return true;
      return false;
    }
    function project(st, spin){
      var out = [], mv = spin ? MOVES[spin.move] : null;
      var R = spin ? spinAbout(mv.axis, spin.deg) : null;
      for (var i=0;i<HOME.length;i++){
        var moving = mv && sits(st, i, mv.axis, mv.val) === 2;
        if (!moving && !atFront(st, i)) continue;
        var piece = HOME[i], M = ORI[st[i].o], T = moving ? mul(R, M) : M;
        var c = st[i].c, C = [c[0]*HALF, c[1]*HALF, c[2]*HALF];
        if (moving) C = turn(R, C);
        var h = piece.long ? [CELL, HALF, HALF] : [HALF, HALF, HALF];
        for (var f=0;f<6;f++){
          var F = FACEUV[f], n = turn(T, F.d);
          if (n[2] < 0.002) continue;                /* turned away, or edge on */
          var d = F.d, off = turn(T, [d[0]*h[0], d[1]*h[1], d[2]*h[2]]);
          var uD = turn(T, F.U), vD = turn(T, F.V);
          var lu = Math.hypot(uD[0], uD[1]), lv = Math.hypot(vD[0], vD[1]);
          if (lu < 1e-4 || lv < 1e-4) continue;
          var end = piece.long && axisOf(d) === 0;   /* a bar seen end on */
          out.push({
            z: C[2] + off[2],
            x: C[0] + off[0] + 75, y: C[1] + off[1] + 75,
            fw: 2*h[axisOf(F.U)] + LAP, fh: 2*h[axisOf(F.V)] + LAP,
            shape: SHAPES[end ? "circle" : piece.art],
            lu: lu, lv: lv,
            su: [uD[0]/lu, uD[1]/lu], sv: [vD[0]/lv, vD[1]/lv]
          });
        }
      }
      out.sort(function(a,b){ return a.z - b.z; });  /* far ones drawn first */
      return out;
    }

    /* ------------------------------------------------------- the easing --
     * whatever CSS would take, solved here rather than declared */
    var NAMED = {linear:[0,0,1,1], ease:[0.25,0.1,0.25,1], "ease-in":[0.42,0,1,1],
                 "ease-out":[0,0,0.58,1], "ease-in-out":[0.42,0,0.58,1]};
    function bezier(p){
      var x1=p[0], y1=p[1], x2=p[2], y2=p[3];
      return function(x){
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        var t = x;
        for (var i=0;i<8;i++){
          var u = 1-t;
          var fx = 3*u*u*t*x1 + 3*u*t*t*x2 + t*t*t - x;
          var dd = 3*u*u*x1 + 6*u*t*(x2-x1) + 3*t*t*(1-x2);
          if (dd < 1e-6 && dd > -1e-6) break;
          t -= fx/dd;
          if (t < 0) t = 0; else if (t > 1) t = 1;
        }
        var v = 1-t;
        return 3*v*v*t*y1 + 3*v*t*t*y2 + t*t*t;
      };
    }
    function readEase(text){
      var s = String(text).trim().toLowerCase();
      if (s in NAMED) return bezier(NAMED[s]);
      var n = "\\s*(-?\\d*\\.?\\d+)\\s*";
      var cb = s.match(new RegExp("^cubic-bezier\\(" + n + "," + n + "," + n + "," + n + "\\)$"));
      if (cb){
        var p = [+cb[1], +cb[2], +cb[3], +cb[4]];
        if (p[0] < 0 || p[0] > 1 || p[2] < 0 || p[2] > 1) return null;   /* CSS says so */
        return bezier(p);
      }
      return null;
    }

    return {SHAPES:SHAPES, HOME:HOME, MOVES:MOVES, DIST:DIST, PEBBLE:PEBBLE,
            num:num, outline:outline, solved:solved, key:key, play:play,
            legal:legal, isSpin:isSpin, options:options, wander:wander,
            stray:stray, road:road, project:project, readEase:readEase};
  })());

  /* ---------------------------------------------------- this one's parts -- */
  var size = parseFloat(el.dataset.size) || 150;
  el.style.width = el.style.height = size + "px";
  el.setAttribute("role", "img");
  if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", el.dataset.label || "Rayl");

  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 150 150");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("aria-hidden", "true");
  el.appendChild(svg);

  var POOL = 14, faces = [], i;      /* six pieces, at most two faces apiece */
  for (i=0;i<POOL;i++){
    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "rayl-solve-face");
    var tile = document.createElementNS(NS, "rect");
    tile.setAttribute("class", "rayl-solve-tile");
    var art = document.createElementNS(NS, "path");
    art.setAttribute("class", "rayl-solve-art");
    g.appendChild(tile); g.appendChild(art); svg.appendChild(g);
    faces.push({g:g, tile:tile, art:art});
  }

  /* -------------------------------------------------------- the numbers -- */
  function ms(name, fallback){
    var v = parseFloat(el.dataset[name]);
    return isFinite(v) && v >= 0 ? v : fallback;
  }
  var TIME = {
    turn:     ms("turn", 480),       /* one layer, a quarter round        */
    gap:      ms("gap", 0),          /* the beat between two turns        */
    scramble: ms("scramble", 480),   /* the quicker turn it scrambles at  */
    beat:     ms("beat", 20),        /* and the beat between those        */
    think:    ms("think", 400),      /* lost, before it starts back       */
    hold:     ms("hold", 960)        /* sitting on the mark               */
  };
  /* Not the system curve. Chosen on the bench, and on the open list rather
     than quietly standing in for the one movement everything else uses. */
  var ease = P.readEase(el.dataset.ease || "cubic-bezier(0.5, 0.14, 0.36, 0.79)")
          || P.readEase("cubic-bezier(0.5, 0.14, 0.36, 0.79)");
  var SCRAMBLE = 10, LOST = 7;       /* turns away at most, and far enough */

  var REDUCED = window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --------------------------------------------------------- the drawing -- */
  function paint(st, spin){
    var seen = P.project(st, spin), n;
    for (n=0; n<faces.length; n++){
      var cell = faces[n];
      if (n >= seen.length){ cell.g.setAttribute("display", "none"); continue; }
      var F = seen[n];
      cell.g.removeAttribute("display");
      cell.g.setAttribute("transform",
        "translate(" + P.num(F.x) + " " + P.num(F.y) + ") matrix(" +
        P.num(F.su[0]) + " " + P.num(F.su[1]) + " " +
        P.num(F.sv[0]) + " " + P.num(F.sv[1]) + " 0 0)");
      var tw = F.fw * F.lu, th = F.fh * F.lv;
      cell.tile.setAttribute("x", P.num(-tw/2));
      cell.tile.setAttribute("y", P.num(-th/2));
      cell.tile.setAttribute("width", P.num(tw));
      cell.tile.setAttribute("height", P.num(th));
      /* A face on its way to edge-on passes through being a hairline, and a
         hairline looks like it might snap. Under a third of its width it
         starts losing its other side too, so it leaves as a pebble rather
         than a needle. The drawing only: the tile behind it is the ground
         this piece carries, and a tile that has shrunk stops covering. */
      var sx = F.lu, sy = F.lv, flat = sx < sy, thin = flat ? sx : sy;
      if (thin < P.PEBBLE){
        var k = thin / P.PEBBLE;
        if (flat) sy *= k; else sx *= k;
      }
      cell.art.setAttribute("d", P.outline(F.shape, sx, sy));
    }
  }

  /* ----------------------------------------------------------- the drive -- */
  var state = P.solved(), queue = [], step = null;
  var phase = "landed", next = "scramble", slips = 0, playing = false, raf = 0;

  function say(next){
    if (next === phase) return;
    phase = next;
    el.classList.remove("is-landed", "is-scrambling", "is-solving", "is-still");
    el.classList.add("is-" + next);
    el.dispatchEvent(new CustomEvent("rayl:change", {bubbles:true,
      detail:{phase:next}}));
  }
  /* A step says which clock it runs on rather than how long it lasts, and the
     number is read as the step starts, so a change of numbers lands on the
     next turn instead of waiting out everything already queued. */
  function push(m, at, of){ queue.push({move:m, at:at, of:of}); }
  function wait(at, of){ queue.push({at:at, of:of}); }
  function clock(at){ return typeof at === "number" ? at : TIME[at]; }

  function decide(){
    if (next === "scramble"){
      var st = state, path = [], last, spun = false, far = P.DIST[P.key(st)], stop = 0;
      while (path.length < SCRAMBLE && P.DIST[P.key(st)] < LOST){
        last = P.stray(st, last, spun);
        spun = P.isSpin(last);
        st = P.play(st, last);
        path.push(last);
        /* a greedy walk can plateau, so end the scramble where it got
           furthest rather than wherever the count ran out */
        if (P.DIST[P.key(st)] > far){ far = P.DIST[P.key(st)]; stop = path.length; }
      }
      if (stop) path.length = stop;
      for (var i=0;i<path.length;i++){
        push(path[i], "scramble", "scrambling");
        wait("beat", "scrambling");
      }
      wait("think", "scrambling");
      next = "solve";
      return;
    }
    var home = P.road(state);
    /* nothing left to undo: it is home, and it sits there */
    if (!home.length){ wait("hold", "landed"); next = "scramble"; slips = 0; return; }
    /* A wrong turn, thought about, and then found again. The trying is the
       point, so it happens on the way rather than being staged at the end,
       and never more than twice before it gives up and goes home. */
    if (slips < 2 && home.length > 2 && Math.random() < 0.5){
      var keep = 1 + Math.floor(Math.random()*2), at = state;
      for (var j=0;j<keep;j++){
        push(home[j], "turn", "solving"); wait("gap", "solving");
        at = P.play(at, home[j]);
      }
      if (P.options(at, home[keep]).length){
        push(P.wander(at, home[keep], keep && P.isSpin(home[keep-1])), "turn", "solving");
        wait("think", "solving");
        slips++;
        return;
      }
    }
    for (var k=0;k<home.length;k++){ push(home[k], "turn", "solving"); wait("gap", "solving"); }
  }

  function frame(now){
    if (!step){
      if (!queue.length) decide();
      step = queue.shift();
      step.t0 = now;
      step.ms = clock(step.at);
      say(step.of);
      if (step.move !== undefined){
        var q = P.MOVES[step.move].quarters;
        /* a half turn is as true one way as the other, so let it choose */
        step.deg = q === 3 ? -90 : q === 2 ? (Math.random() < 0.5 ? 180 : -180) : 90;
      }
    }
    /* a tab comes back from being hidden with a stale clock: rebase rather
       than let a turn jump to its end */
    if (now - step.t0 > step.ms + 1000) step.t0 = now;
    var p = step.ms <= 0 ? 1 : (now - step.t0) / step.ms;
    if (p > 1) p = 1;
    if (step.move === undefined){
      if (p >= 1) step = null;
    } else {
      paint(state, {move:step.move, deg:step.deg * ease(p)});
      if (p >= 1){ state = P.play(state, step.move); step = null; paint(state, null); }
    }
    raf = playing ? requestAnimationFrame(frame) : 0;
  }

  function start(){
    if (!raf && playing) raf = requestAnimationFrame(frame);
  }
  function stop(){
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  /* Somebody asking for less motion is asking for none: the mark sits solved,
     and there is no fade or crossfade standing in for the turn. */
  el.play = function(on){
    playing = on !== false && !REDUCED;
    if (playing){
      if (step){ step.t0 = performance.now(); say(step.of); }
      start();
    }
    else { stop(); say("still"); }
    return el;
  };
  el.scramble = function(){
    queue = []; step = null; next = "scramble"; slips = 0; decide(); el.play(true); return el;
  };
  el.solve = function(){
    queue = []; step = null; next = "solve"; slips = 0; decide(); el.play(true); return el;
  };

  /* off the screen is not worth a frame */
  if (window.IntersectionObserver){
    new IntersectionObserver(function(rows){
      if (rows[rows.length-1].isIntersecting) start(); else stop();
    }).observe(el);
  }

  paint(state, null);
  if (el.dataset.play === "still" || REDUCED) say("still");
  else { wait("hold", "landed"); el.play(true); }
  return el;
}
