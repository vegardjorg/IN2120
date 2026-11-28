/* ============================================================
   IN2120 guide · begrep-tips.js  (portert fra IN2010 2026-11-26)
   Verktøytips for forkortelser og begreper i løpende tekst (SMB, Telnet, salt …).
   Ordene og tekstene står i begreper-data.js (IN.BEGREPER), den eneste kilden.
   Lastes rett etter begreper-data.js, som lastes rett etter symboler.js.

   Slik virker det:
   - IN.begrepTips(root) går gjennom TEKSTNODER i root (aldri innerHTML) og pakker
     FØRSTE forekomst av hvert begrep per seksjon/kort inn i <span class="bt" data-bt="id">.
     Seksjon/kort = nærmeste details.examtask, .card, .callout, table, [data-panel], section eller main.
   - Øvingstekst (påstanden i sant/usant og quiz, Inspera-tekst, øvingsspørsmål) skannes også (EXTXT), men aldri
     svaralternativer, felt eller fasit. Forkortelser viser bare fullformen før svar; vanlige begreper (bt-etter)
     er inaktive til øvingen er besvart (besvart()), så tipset ikke røper svaret.
   - Bare vanlig prosa (p, li, td, dd, .callout …) inne i <main>. Aldri i kode,
     terminalutdata, figurer (SVG), lenker, knapper, skjemafelt, overskrifter, quizspørsmål
     og -svar, øvinger (.ov, .dra), Inspera-oppgaver eller eksamenskortets «Oppgave»-fane
     (der et tips kunne røpe fasiten). data-bt-off på et element slår det av for alt inni.
   - Lat skanning: skjulte faner ([data-panel][hidden]) hoppes over og skannes når de
     vises (in:shown fra IN.tabs). Eksamenskortenes faner bygges først når de åpnes, og
     core.js kaller da IN.symbolTips(fanen).
   - Filen kobler seg på IN.symbolTips (core.js): hver gang symbolene skannes
     (oppstart, nivåbytte, nye faner i eksamenskort), skannes begrepene også.
     Da trengs ingen endring i core.js. Uten core.js skanner den selv ved oppstart.
   - Ett felles tips (#bt-tip, role="tooltip") med delegerte lyttere på document:
     mus: hover viser, klikk fester · tastatur: fokus viser, Esc lukker ·
     touch: trykk viser, nytt trykk eller trykk utenfor lukker.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BG = IN.BEGREPER;
  if (!BG) return;
  var LIST = BG.list;

  function pageId() { return (document.body && document.body.getAttribute("data-page")) || ""; }

  /* ---------- Mønstre ---------- */
  var WCH = "A-Za-z0-9_ÆØÅæøåÀ-ÖØ-öø-ÿ";
  var WORD = new RegExp("[" + WCH + "]");             // bokstav rett før treffet → ikke et helt ord
  var ALL = [];
  Object.keys(LIST).forEach(function (id) {
    var e = LIST[id], res = [];
    // Hel-ord-krav bak: (?![bokstav]) inne i mønsteret, så regex prøver en kortere bøyning
    // i stedet for å forkaste treffet.
    function rx(list, fl) { return new RegExp("(?:" + list.join("|") + ")(?![" + WCH + "])", fl); }
    if (e.m && e.m.length) res.push(rx(e.m, "gi"));
    if (e.mc && e.mc.length) res.push(rx(e.mc, "g"));
    e._re = res;
    e._ctx = e.ctx ? new RegExp(e.ctx, "i") : null;
    e._nctx = e.nctx ? new RegExp(e.nctx, "i") : null;
    ALL = ALL.concat(e.m || [], e.mc || []);
  });
  var PRE = new RegExp(ALL.join("|"), "i");          // grovsil: hopp over tekst uten noe kandidat

  var ALLOW = "p, li, td, dd, dt, figcaption, blockquote, .callout, .explain-body, .qz-exp, .sp-explain, " +
    ".et-content, .et-pf-body, .pc-exp-body, .lead";
  var SKIP = "code, kbd, pre, samp, var, a, button, input, textarea, select, option, label, output, svg, script, style, " +
    "h1, h2, h3, h4, h5, h6, summary, header, footer, nav, th, [contenteditable], [title], [data-tip], [aria-live], " +
    "[role=status], [role=button], [role=tab], [role=tablist], [draggable=true], " +
    ".sym, .bt, .has-tip, .pc-tip, .mono, .kbd, .term, .terminal, .pseudo, .pcode, .parsons, .tagline, " +
    ".tabs, .badge, .pill, .chip, .lbl, .tag, figure, .fig, " +
    ".qz-prompt, .qz-choices, .qz-choice, .qz-key, .qz-lbl, .qz-head, .qz-foot, " +
    ".ov, .dra, [class*=insp], .bank-insp, .et-pane.t-oppgave, .et-head, .et-tabs, .et-foot, .sp-gjett, " +
    "[data-bt-off]";
  var SCOPE = ".qz-item, .insp-m tr, .insp-sq, .insp, .dra, .ov, details.examtask, .card, .callout, table, [data-panel], section, main";

  /* Øvingstekst (eierens ønske 2026-11-26: «MAC i sant/usant skal få tips»): påstanden i sant/usant og quiz,
     Inspera-teksten (deloppgave, felttekst, matriserad), øvingenes spørsmål og eksamenskortets «Oppgave»-fane.
     Aldri i svaralternativer, felt, knapper eller fasit. Bare oppslag med fullform (forkortelser), og før
     øvingen er besvart viser tipset bare fullformen og forvekslingslinja, ikke forklaringen (den kunne røpe svaret). */
  var EXTXT = ".qz-prompt, .insp-sq-t, .insp-tekst, .insp-m-s, .insp-et, .ov-tekst, .ov-q, .dra-prompt, .et-pane.t-oppgave";
  var EXSKIP = "code, kbd, pre, samp, var, a, button, input, textarea, select, option, label, output, svg, script, style, " +
    "h1, h2, h3, h4, h5, h6, summary, [contenteditable], [data-tip], [aria-live], [role=status], [role=button], " +
    ".sym, .bt, .has-tip, .pc-tip, .mono, .kbd, .term, .terminal, .pseudo, .pcode, figure, .fig, " +
    ".insp-slot, .insp-opt, .insp-fasit, .insp-res, .qz-choices, .qz-exp-btn, .dra-board, .dra-chip, .ov-losn, [data-bt-off]";
  var EXCTX = "[data-panel], details.examtask, section, main";

  function scopeOf(n) { return (n.closest && n.closest(SCOPE)) || document.body; }

  /* Er øvingen tipset står i besvart (eller fasiten vist)? Da kan hele forklaringen vises. */
  function besvart(s) {
    var q = s.closest(".qz-item");
    if (q) return /\b(answered|is-right|is-wrong|is-blank)\b/.test(q.className) || !!q.querySelector(".qz-exp:not([hidden])");
    var c = s.closest(".insp, .ov, .dra, .et-pane");
    if (!c && s.closest(".ov-tekst")) c = s.closest(".ov-tekst").parentNode;
    if (!c) return true;
    if (/\bis-(right|wrong)\b/.test(c.className)) return true;
    return !!c.querySelector(".insp-sum, .ov-losn:not([hidden]), .dra-fasit:not([hidden]), .is-right, .is-wrong");
  }

  /* Treff i én tekst: [{ i, n, id }] i rekkefølge, uten overlapp (lengste treff vinner).
     sc = seksjonens tekst (for ctx/nctx), page = body[data-page]. */
  function hitsIn(text, page, sc) {
    var hits = [];
    Object.keys(LIST).forEach(function (id) {
      var e = LIST[id];
      if (e.ikke && e.ikke.indexOf(page) >= 0) return;
      if (e._ctx && !(sc != null && e._ctx.test(sc))) return;
      if (e._nctx && sc != null && e._nctx.test(sc)) return;
      e._re.forEach(function (re) {
        re.lastIndex = 0;
        var m;
        while ((m = re.exec(text)) !== null) {
          if (!m[0]) { re.lastIndex++; continue; }
          var a = text.charAt(m.index - 1);
          if (a && WORD.test(a)) { re.lastIndex = m.index + 1; continue; }
          hits.push({ i: m.index, n: m[0].length, id: id });
        }
      });
    });
    hits.sort(function (x, y) { return x.i - y.i || y.n - x.n; });
    var out = [], end = -1;
    hits.forEach(function (h) { if (h.i >= end) { out.push(h); end = h.i + h.n; } });
    return out;
  }

  function scan(root) {
    if (!root) return;
    if (root.nodeType === 9) root = root.body;
    if (!root || root.nodeType !== 1) return;
    bind();
    if (st.cur && !st.cur.isConnected) hide();
    var page = pageId(), seenBy = [], todo = [], n;
    function info(scope, ov) {
      for (var k = 0; k < seenBy.length; k++) if (seenBy[k][0] === scope) return seenBy[k][1];
      var s = {};
      Array.prototype.forEach.call(scope.querySelectorAll(".bt"), function (b) {
        if (scopeOf(b.parentNode) === scope) s[b.getAttribute("data-bt")] = 1;
      });
      // I øvinger er enheten liten (én påstand), så ctx/nctx (MAC = meldingsautentisering eller tvungen tilgang)
      // avgjøres av hele fanen/kortet rundt.
      var cx = ov ? scope.closest(EXCTX) : null;
      var r = { seen: s, text: (scope.textContent || "") + (cx && cx !== scope ? " " + (cx.textContent || "") : "") };
      seenBy.push([scope, r]);
      return r;
    }
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), ovSet = [];
    while ((n = w.nextNode())) {
      var p = n.parentNode;
      if (!n.nodeValue || !PRE.test(n.nodeValue) || !p || !p.closest) continue;
      if (!p.closest("main, [data-bt-on]")) continue;
      if (p.closest("[data-panel][hidden]")) continue;            // lat: skannes når fanen vises
      if (p.closest(ALLOW) && !p.closest(SKIP)) todo.push(n);
      else if (p.closest(EXTXT) && !p.closest(EXSKIP)) { todo.push(n); ovSet.push(n); }
    }
    todo.forEach(function (tn) {
      var ov = ovSet.indexOf(tn) >= 0;
      var text = tn.nodeValue, inf = info(scopeOf(tn.parentNode), ov), s = inf.seen, keep = [];
      hitsIn(text, page, inf.text).forEach(function (h) {
        // Øving: forkortelser viser fullformen med en gang. Vanlige begreper (salt, brannmur …) blir først aktive
        // når øvingen er besvart (bt-etter), siden selve definisjonen kunne røpe svaret.
        if (!s[h.id]) { s[h.id] = 1; h.ov = ov; h.etter = ov && !LIST[h.id].full; keep.push(h); }
      });
      if (!keep.length) return;
      var frag = document.createDocumentFragment(), pos = 0;
      keep.forEach(function (h) {
        if (h.i > pos) frag.appendChild(document.createTextNode(text.slice(pos, h.i)));
        var sp = document.createElement("span");
        sp.className = h.etter ? "bt bt-ov bt-etter" : h.ov ? "bt bt-ov" : "bt";
        sp.setAttribute("data-bt", h.id);
        sp.tabIndex = h.etter ? -1 : 0;
        sp.textContent = text.substr(h.i, h.n);
        frag.appendChild(sp);
        pos = h.i + h.n;
      });
      if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
      tn.parentNode.replaceChild(frag, tn);
    });
  }

  /* ---------- Tipset ---------- */
  var st = { tip: null, cur: null, at: 0, pinned: false, bound: false, timer: 0 };

  function mk(tag, cls, text) {
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (text != null) x.textContent = text;
    return x;
  }
  function tipEl() {
    if (st.tip) return st.tip;
    var t = st.tip = mk("div", "pc-tip bt-tip");
    t.id = "bt-tip";
    t.setAttribute("role", "tooltip");
    t.hidden = true;
    document.body.appendChild(t);
    return t;
  }
  function fill(t, id, s) {
    var e = LIST[id];
    var skjul = !!(s && s.classList.contains("bt-ov") && !besvart(s));
    while (t.firstChild) t.removeChild(t.firstChild);
    var h = mk("span", "bt-tip-h");
    h.appendChild(mk("b", null, e.ord));
    if (e.full) h.appendChild(document.createTextNode(" · " + e.full));
    t.appendChild(h);
    if (!skjul) t.appendChild(mk("span", "bt-tip-t", e.txt));
    // Standardport (feltet port; portIP = ikke i kursmaterialet). Skjules som forklaringen i ubesvarte øvinger,
    // ellers røper tipset svaret på portoppgaver (H2024 26, Snort-regler).
    if (!skjul && e.port) t.appendChild(mk("span", "bt-tip-pt", "Standardport: " + e.port + (e.portIP ? " · ikke pensum" : "")));
    if (e.forveks) t.appendChild(mk("span", "bt-tip-fv", e.forveks));
    if (skjul) t.appendChild(mk("span", "bt-tip-se", "Hele forklaringen vises når du har svart."));
    var b = BG.BLOKK && BG.BLOKK[e.b];
    if (b && b[1] !== pageId()) t.appendChild(mk("span", "bt-tip-se", BG.se(e)));
  }
  function show(s, pin) {
    var id = s.getAttribute("data-bt");
    if (!LIST[id]) return;
    if (s.classList.contains("bt-etter") && !besvart(s)) return;      // vanlig begrep i ubesvart øving: ingen tips ennå
    clearTimeout(st.timer);
    var t = tipEl();
    fill(t, id, s);
    t.hidden = false;
    t.classList.toggle("is-pinned", !!pin);
    if (st.cur && st.cur !== s) { st.cur.removeAttribute("aria-describedby"); st.cur.classList.remove("is-open"); }
    st.cur = s; st.at = Date.now(); st.pinned = !!pin;
    s.setAttribute("aria-describedby", "bt-tip");
    s.classList.add("is-open");
    place(s);
  }
  /* Over begrepet, sentrert og holdt innenfor skjermen; under hvis det ikke er plass over. */
  function place(s) {
    var t = st.tip;
    t.style.left = "0px"; t.style.top = "0px";
    var r = s.getClientRects()[0] || s.getBoundingClientRect();
    var tr = t.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    var left = Math.max(8, Math.min(r.left + r.width / 2 - tr.width / 2, vw - tr.width - 8));
    var top = r.top - tr.height - 6;
    var sticky = IN.stickyH ? IN.stickyH() : 0;
    if (top < sticky + 4) top = r.bottom + 6;
    t.style.left = (window.pageXOffset + left) + "px";
    t.style.top = (window.pageYOffset + top) + "px";
  }
  function hide() {
    clearTimeout(st.timer);
    if (st.tip) st.tip.hidden = true;
    if (st.cur) { st.cur.removeAttribute("aria-describedby"); st.cur.classList.remove("is-open"); }
    st.cur = null; st.pinned = false;
  }
  function hideSoon() { clearTimeout(st.timer); st.timer = setTimeout(hide, 150); }

  function btOf(e) {
    var x = e.target;
    if (!x || !x.closest || x.closest(".sym")) return null;   // symbolet inni har sitt eget tips
    return x.closest(".bt");
  }
  function inTip(x) { return !!(st.tip && x && x.nodeType === 1 && st.tip.contains(x)); }

  function bind() {
    if (st.bound) return;
    st.bound = true;
    document.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      if (inTip(e.target)) { clearTimeout(st.timer); return; }
      var s = btOf(e);
      if (s && s !== st.cur && !st.pinned) show(s, false);
      else if (s && s === st.cur) clearTimeout(st.timer);
    });
    document.addEventListener("pointerout", function (e) {
      if (e.pointerType !== "mouse" || !st.cur || st.pinned) return;
      var to = e.relatedTarget;
      var from = e.target === st.cur || st.cur.contains(e.target) || inTip(e.target);
      if (from && !(to && (st.cur.contains(to) || inTip(to)))) hideSoon();
    });
    document.addEventListener("focusin", function (e) {
      var s = btOf(e);
      if (s) show(s, false);
      else if (st.cur && !inTip(e.target)) hide();
    });
    document.addEventListener("focusout", function (e) {
      if (st.cur && e.target === st.cur && !st.pinned && !inTip(e.relatedTarget)) hide();
    });
    document.addEventListener("click", function (e) {
      if (inTip(e.target)) return;
      var s = btOf(e);
      if (!s) { if (st.cur) hide(); return; }
      // Touch: pointerover/fokus og klikk kommer rett etter hverandre – ikke lukk det som nettopp åpnet seg.
      if (st.cur === s && st.pinned && Date.now() - st.at > 400) hide(); else show(s, true);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && st.cur) hide();
    });
    document.addEventListener("dragstart", hide);
    // Lat skanning av faner som blir synlige
    document.addEventListener("in:shown", function (e) {
      var p = e.target;
      if (p && p.nodeType === 1) { try { scan(p); } catch (err) { if (window.console) console.warn("begrep-tips:", err); } }
    });
    // Rulling/ny størrelse: lukk – men ikke når tipset kom fra tastaturfokus. Tab til et begrep
    // utenfor skjermen ruller siden selv, og da skal tipset følge med, ikke forsvinne.
    function moved() {
      if (!st.cur) return;
      if (document.activeElement === st.cur && !st.pinned) place(st.cur); else hide();
    }
    window.addEventListener("scroll", moved, { passive: true });
    window.addEventListener("resize", moved);
  }

  /* ---------- Kobling til core.js ---------- */
  IN.begrepTips = scan;
  IN.begrepTips.hide = hide;
  IN.begrepTips.hitsIn = hitsIn;      // til test og gjennomgang

  /* Ordlista: IN.begrepTips.ordliste(host) tegner alle oppslag i IN.BEGREPER alfabetisk,
     med søkefelt og lenke til blokka. Tegnes én gang (kall den når lista åpnes). */
  IN.begrepTips.ordliste = function (host) {
    if (!host || host._ord) return;
    host._ord = true;
    var BG = IN.BEGREPER; if (!BG) return;
    var ids = Object.keys(BG.list).sort(function (a, b) {
      return BG.list[a].ord.localeCompare(BG.list[b].ord, "nb", { sensitivity: "base" });
    });
    var inp = document.createElement("input");
    inp.type = "search"; inp.className = "ord-sok"; inp.placeholder = "Søk, f.eks. SMB eller salt";
    inp.setAttribute("aria-label", "Søk i ordlista");
    var tell = document.createElement("p"); tell.className = "ord-tell small muted"; tell.setAttribute("aria-live", "polite");
    var dl = document.createElement("dl"); dl.className = "ord-liste";
    var rader = ids.map(function (id) {
      var e = BG.list[id], b = BG.BLOKK[e.b];
      var dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.innerHTML = "<b>" + e.ord + "</b>" + (e.full ? " · " + e.full : "");
      dd.innerHTML = e.txt || "";
      if (e.port) { var pt = document.createElement("span"); pt.className = "ord-pt"; pt.textContent = "Standardport: " + e.port + (e.portIP ? " · ikke pensum" : ""); dd.appendChild(pt); }
      if (b) { var a = document.createElement("a"); a.href = b[0]; a.className = "ord-se"; a.textContent = BG.se(e); dd.appendChild(document.createTextNode(" ")); dd.appendChild(a); }
      if (e.forveks) { var fv = document.createElement("span"); fv.className = "ord-fv"; fv.textContent = e.forveks; dd.appendChild(fv); }
      dl.appendChild(dt); dl.appendChild(dd);
      return { dt: dt, dd: dd, s: (e.ord + " " + (e.full || "") + " " + dt.textContent + " " + dd.textContent).toLowerCase() };
    });
    function filter() {
      var q = inp.value.trim().toLowerCase(), n = 0;
      rader.forEach(function (r) { var vis = !q || r.s.indexOf(q) >= 0; r.dt.hidden = r.dd.hidden = !vis; if (vis) n++; });
      tell.textContent = q ? n + " av " + rader.length + " begreper" : rader.length + " begreper";
    }
    inp.addEventListener("input", filter);
    host.appendChild(inp); host.appendChild(tell); host.appendChild(dl);
    filter();
  };
  if (typeof IN.symbolTips === "function" && !IN.symbolTips._bt) {
    var orig = IN.symbolTips;
    IN.symbolTips = function (root) {
      var r = orig.apply(this, arguments);
      try { scan(root); } catch (err) { if (window.console) console.warn("begrep-tips:", err); }
      return r;
    };
    IN.symbolTips._bt = true;
  } else if (typeof IN.symbolTips !== "function") {
    var go = function () { scan(document); };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
    window.addEventListener("load", go);
  }
})();
