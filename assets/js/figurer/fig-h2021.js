/* ============================================================
   IN2120 guide · figurer/fig-h2021.js
   Eksamensfigurene fra H2021, tegnet på nytt med IN.fig (API øverst i fig-felles.js).
   Kilde: UiO, IN2120 eksamen H2021 (eksamen/in2120-2021-x-qa.pdf). Kontrollliste: plan/figurer/INVENTAR-h2021.md.

   Mal (én funksjon per oppgave; key = oppgavens key i assets/js/eksamensbank/h2021.js):
     IN.FIGURER["H2021-n"] = function (host, oppg) {
       var F = IN.fig;
       var s = F.svg(host, { w: 300, h: 200, oppg: oppg });
       // … bokser, piler, tekst. Svarfelt i figuren: F.felt(htmlNode, i) (i HTML, ikke i SVG).
     };
   Regler: tro mot arket (samme elementer, piler, etiketter, plassering), ikke røp svaret,
   tål flere kall (ingen global tilstand), temafarger via CSS-klassene i figurer.css.

   Lokale hjelpere (bare i denne fila):
     el(tag, css, parent, tekst)       HTML-element med inline stil.
     overlegg(parent, w, h, o)         SVG med viewBox w × h og HTML-felt lagt oppå i prosent av viewBox
                                       → { wrap, svg, felt(i, x, y, fw, fh) }. Feltene følger SVG-en når den skalerer.
     responsiv(node, grenser, fn)      fn(smal, nivå) ved første tegning og når bredden krysser en grense (ResizeObserver);
                                       nivå = antall grenser bredden er over, smal = nivå 0.
     fargePil(parent, punkter, farge, bredde)   pil i egen farge (markøren i IN.fig følger alltid strekfargen).
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FIGURER = IN.FIGURER || {};
  var F = IN.fig;
  if (!F) return;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- lokale hjelpere ---------- */
  function el(tag, css, parent, tekst) {
    var n = document.createElement(tag);
    if (css) n.setAttribute("style", css);
    if (tekst != null) n.textContent = tekst;
    if (parent) parent.appendChild(n);
    return n;
  }
  function sv(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  /* Lite tallfelt (T) oppå en sirkel: .insp-t har min-width 126px i stilarket, så feltet som inspera.js flytter inn,
     får inline-stil som lar det fylle plassholderen. Ingen CSS-hjelper for dette i figurer.css (se rapporten). */
  function kompaktFelt(ph) {
    function tilpass() {
      var inp = ph.querySelector("input");
      if (inp) inp.style.cssText = "min-width:0;width:100%;height:100%;box-sizing:border-box;padding:0 2px;text-align:center;font-size:15px;";
    }
    if (window.MutationObserver) new MutationObserver(tilpass).observe(ph, { childList: true });
    tilpass();
  }
  function pst(v, tot) { return (Math.round(v / tot * 10000) / 100) + "%"; }

  function overlegg(parent, w, hh, o) {
    o = o || {};
    var wrap = el("div", "position:relative;width:100%;margin:0 auto;" + (o.maks ? "max-width:" + o.maks + "px;" : ""), parent);
    var svg = F.svg(wrap, { w: w, h: hh, oppg: o.oppg, tittel: o.tittel, desc: o.desc });
    svg.style.maxWidth = "none";
    return {
      wrap: wrap, svg: svg,
      felt: function (i, x, y, fw, fh, kompakt) {
        var ph = F.felt(wrap, i);
        ph.style.cssText = "position:absolute;left:" + pst(x, w) + ";top:" + pst(y, hh) + ";width:" + pst(fw, w) +
          ";height:" + pst(fh, hh) + ";max-width:none;min-height:0;";
        if (kompakt) kompaktFelt(ph);
        return ph;
      }
    };
  }

  function responsiv(node, grenser, fn) {
    var sist = null;
    grenser = [].concat(grenser);
    function sjekk(bredde) {
      var b = bredde > 0 ? bredde : (window.innerWidth || 1000) - 80, niva = 0;
      grenser.forEach(function (g) { if (b >= g) niva++; });
      if (niva !== sist) { sist = niva; fn(niva === 0, niva); }
    }
    sjekk(0);
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function (e) {
        if (!node.isConnected) { ro.disconnect(); return; }
        sjekk(e[0].contentRect.width);
      });
      ro.observe(node);
    }
  }

  function fargePil(parent, punkter, farge, bredde) {
    bredde = bredde || 4;
    var d = punkter.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ");
    sv("path", { d: d, fill: "none", stroke: farge, "stroke-width": bredde, "stroke-linejoin": "round" }, parent);
    var a = punkter[punkter.length - 2], b = punkter[punkter.length - 1];
    var v = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 6 + bredde * 2.2, B = 4 + bredde * 1.3;
    var p1 = [b[0] - L * Math.cos(v) + B * Math.sin(v), b[1] - L * Math.sin(v) - B * Math.cos(v)];
    var p2 = [b[0] - L * Math.cos(v) - B * Math.sin(v), b[1] - L * Math.sin(v) + B * Math.cos(v)];
    sv("path", { d: "M" + b.join(" ") + " L" + p1.join(" ") + " L" + p2.join(" ") + " z", fill: farge }, parent);
  }

  /* Tittel over figuren (som på arket). */
  function tittel(parent, tekst, css) {
    return el("div", "font-weight:700;font-size:1.25rem;text-align:center;margin:.2rem 0 .6rem;" + (css || ""), parent, tekst);
  }

  /* ---------- H2021-1.1: KIT-trekanten og «Personvern» (ingen felt i figuren) ----------
     Kilde: s. 2. Tykk trekant med etikettene langs sidene, tekst inni; adskilt avrundet stolpe til høyre. */
  IN.FIGURER["H2021-1.1"] = function (host, oppg) {
    var c = F.celler(host, 2, { kol: 2 });
    var s = F.svg(c[0], { w: 310, h: 262, oppg: oppg, tittel: "Informasjonssikkerhet (trekant)" });
    var L = [30, 238], R = [280, 238], T = [155, 21.5];
    sv("path", { d: "M" + L.join(" ") + " L" + T.join(" ") + " L" + R.join(" ") + " z", fill: "var(--fig-bg)",
      stroke: "var(--fig-funk-fyll)", "stroke-width": 34, "stroke-linejoin": "round" }, s);
    function side(x, y, rot, t) {
      var tx = F.tekst(s, x, y, t, { fet: true, str: 18 });
      tx.setAttribute("transform", "rotate(" + rot + " " + x + " " + y + ")");
      tx.setAttribute("style", "fill:var(--fig-funk-t)");
    }
    side(92.5, 129.8, -60, "Konfidensialitet");
    side(217.5, 129.8, 60, "Integritet");
    side(155, 238, 0, "Tilgjengelighet");
    F.tekst(s, 155, 178, "Informasjons-", { str: 18 });
    F.tekst(s, 155, 201, "sikkerhet", { str: 18 });
    c[1].style.alignSelf = "center";
    var p = F.svg(c[1], { w: 310, h: 56, tittel: "Personvern", desc: "Avrundet stolpe med teksten Personvern, adskilt fra trekanten." });
    sv("rect", { x: 10, y: 8, width: 290, height: 40, rx: 20, style: "fill:var(--fig-funk-fyll)" }, p);
    F.tekst(p, 155, 28, "Personvern", { fet: true, str: 19 }).setAttribute("style", "fill:var(--fig-funk-t)");
  };

  /* ---------- H2021-1.3: IAM-faser (6 felt i boksene) ----------
     Kilde: s. 4. To avrundede rammer; venstre: pil ned, så dobbeltpil; høyre: to piler ned. */
  IN.FIGURER["H2021-1.3"] = function (host, oppg) {
    var c = F.celler(host, 2, { kol: 2 });
    function blokkpil(parent, dobbel) {
      var s = F.svg(parent, { w: 40, h: 40, tittel: dobbel ? "Dobbeltpil" : "Pil ned", desc: dobbel ? "Dobbeltpil opp og ned" : "Pil nedover" });
      s.style.maxWidth = "34px";
      var d = dobbel ? "M20 1 L34 12 L27 12 L27 28 L34 28 L20 39 L6 28 L13 28 L13 12 L6 12 z"
        : "M13 1 L27 1 L27 24 L35 24 L20 39 L5 24 L13 24 z";
      sv("path", { d: d, fill: "#bfe7f8", stroke: "#4f8fb3", "stroke-width": 1.4, "stroke-linejoin": "round" }, s);
    }
    function fase(celle, navn, start, piler) {
      celle.style.alignSelf = "start";
      el("div", "font-size:1.45rem;text-align:center;margin-bottom:.4rem;", celle, navn);
      var r = el("div", "width:100%;max-width:340px;box-sizing:border-box;border:2.5px solid currentColor;border-radius:26px;padding:16px 12px;display:flex;flex-direction:column;align-items:center;gap:4px;", celle);
      for (var i = 0; i < 3; i++) {
        var b = el("div", "width:100%;box-sizing:border-box;border:1.5px solid var(--color-outline);background:var(--color-surface-container-low);padding:10px 8px;display:flex;justify-content:center;", r);
        F.felt(b, start + i);
        if (i < 2) blokkpil(r, piler[i]);
      }
    }
    fase(c[0], "Konfigureringsfase", 0, [false, true]);
    fase(c[1], "Bruksfase", 3, [false, false]);
  };

  /* ---------- H2021-2.3: leveransekjedeangrep (ingen felt i figuren) ----------
     Kilde: s. 7. Trusselaktør → leverandørens verdier; leverandør og virksomhet forbundet av båndet «Tillitsforhold»;
     svart pil «tjenester/produkter»; oransje pil fra leverandørens verdier til virksomhetens verdier; «Hendelse» begge steder. */
  IN.FIGURER["H2021-2.3"] = function (host, oppg) {
    // Bred figur: rulles vannrett i seg selv på smal skjerm (ingen felt), så teksten holder seg lesbar.
    var rull = el("div", "overflow-x:auto;max-width:100%;", host);
    var inn = el("div", "min-width:540px;max-width:820px;margin:0 auto;", rull);
    var s = F.svg(inn, { w: 660, h: 214, oppg: oppg, tittel: "Leveransekjedeangrep" });
    var BLA = "#3b6fd6", ORA = "#f08a24";
    var LV = { x: 178, y: 18, w: 130, h: 182 }, VK = { x: 488, y: 10, w: 140, h: 196 }, TY = 78, BY = 132;
    // rammer
    sv("rect", { x: LV.x, y: LV.y, width: LV.w, height: LV.h, rx: 22, fill: "none", stroke: BLA, "stroke-width": 2.5, "stroke-dasharray": "8 6" }, s);
    sv("rect", { x: VK.x, y: VK.y, width: VK.w, height: VK.h, rx: 22, fill: "none", stroke: BLA, "stroke-width": 4.5 }, s);
    // båndet «Tillitsforhold»: åpning i rammene mellom båndets kanter
    sv("rect", { x: LV.x + LV.w - 4, y: TY + 2.5, width: 8, height: BY - TY - 5, style: "fill:var(--fig-bg)" }, s);
    sv("rect", { x: VK.x - 4, y: TY + 3, width: 8, height: BY - TY - 6, style: "fill:var(--fig-bg)" }, s);
    sv("path", { d: "M" + (LV.x + LV.w) + " " + TY + " H" + VK.x + " M" + (LV.x + LV.w) + " " + BY + " H" + VK.x, stroke: BLA, "stroke-width": 4.5, fill: "none" }, s);
    F.tekst(s, 398, 60, "Tillitsforhold", { str: 18 });
    // trusselaktør (stilisert hettekledd person)
    F.tekst(s, 58, 66, "Trusselaktør", { str: 18 });
    var ta = F.g(s);
    sv("rect", { x: 22, y: 82, width: 72, height: 78, rx: 4, fill: "#163a22" }, ta);
    sv("path", { d: "M30 160 C30 118 40 92 58 92 C76 92 86 118 86 160 z", fill: "#050a06" }, ta);
    sv("ellipse", { cx: 58, cy: 126, rx: 13, ry: 16, fill: "#2c6a3c" }, ta);
    sv("title", {}, ta).textContent = "Trusselaktør (hettekledd person)";
    fargePil(s, [[96, 146], [196, 146]], ORA, 5);
    // leverandør: etikett, fabrikk, verdier, hendelse
    F.tekst(s, LV.x + 58, 40, "Leverandør", { str: 18 });
    var fab = F.g(s);
    sv("path", { d: "M200 100 V62 h10 V50 h8 v12 l18 -12 v12 l18 -12 v12 l18 -12 V100 z", fill: BLA }, fab);
    [212, 232, 252].forEach(function (x) { sv("rect", { x: x, y: 84, width: 14, height: 6, fill: "#ffffff" }, fab); });
    sv("title", {}, fab).textContent = "Fabrikk (leverandør)";
    function sylinder(cx, cy) {
      var g = F.g(s);
      sv("path", { d: "M" + (cx - 24) + " " + cy + " v12 a24 7 0 0 0 48 0 v-12", fill: "#cde8bf", stroke: "#2f3a2a", "stroke-width": 1.4 }, g);
      sv("ellipse", { cx: cx, cy: cy, rx: 24, ry: 7, fill: "#e3f3d8", stroke: "#2f3a2a", "stroke-width": 1.4 }, g);
      sv("title", {}, g).textContent = "Verdier (database)";
    }
    function stjerne(cx, cy, rx, ry) {
      var p = [];
      for (var i = 0; i < 24; i++) { var r = i % 2 ? 0.62 : 1, v = Math.PI * 2 * i / 24; p.push((cx + rx * r * Math.cos(v)).toFixed(1) + " " + (cy + ry * r * Math.sin(v)).toFixed(1)); }
      sv("path", { d: "M" + p.join(" L") + " z", fill: "#fff35c", stroke: "#8a7a00", "stroke-width": 1.2 }, s);
      F.tekst(s, cx, cy, "Hendelse", { str: 15 }).setAttribute("style", "fill:#1b1d21");
    }
    sylinder(222, 142);
    F.tekst(s, 222, 180, "Verdier", { str: 17 });
    // virksomhet: etikett, bygning, verdier, hendelse
    F.tekst(s, VK.x + 66, 34, "Virksomhet", { str: 18 });
    var byg = F.g(s);
    sv("path", { d: "M524 64 L558 48 L592 64 z", fill: "#e0866c", stroke: "#5a2a1a", "stroke-width": 1.2 }, byg);
    sv("rect", { x: 524, y: 64, width: 68, height: 40, fill: "#f0a48c", stroke: "#5a2a1a", "stroke-width": 1.2 }, byg);
    [530, 544, 566, 580].forEach(function (x) { sv("rect", { x: x, y: 72, width: 7, height: 24, fill: "#6b2f1e" }, byg); });
    sv("rect", { x: 552, y: 82, width: 12, height: 22, fill: "#c9d7ea" }, byg);
    sv("title", {}, byg).textContent = "Bygning (virksomhet)";
    sylinder(542, 154);
    F.tekst(s, 542, 192, "Verdier", { str: 17 });
    // piler gjennom båndet
    F.pil(s, [[312, 100], [VK.x + 32, 100]]);
    F.tekst(s, 400, 88, "tjenester/produkter", { str: 17 });
    fargePil(s, [[246, 146], [292, 146], [304, 118], [500, 118], [512, 132], [512, 152], [516, 152]], ORA, 5);
    stjerne(306, 170, 50, 25);   // til høyre for «Verdier» (ikke over etiketten)
    stjerne(606, 160, 52, 25);
  };

  /* ---------- H2021-3.2: pingvinbildene (felt under bilde 2, bilde 3 og «Ingen») ----------
     Kilde: s. 9. Bildene er stiliserte: 1 klartekstpingvin, 2 grått stripete bilde der omrisset synes, 3 jevn fargestøy. */
  IN.FIGURER["H2021-3.2"] = function (host, oppg) {
    var c = F.celler(host, 4, { kol: 4 }), W = 200, H = 210;
    function pingvin(g, fyll) {
      // fyll: { kropp, mage, nebb, fot, oye, strek }
      var st = fyll.strek ? { stroke: fyll.strek, "stroke-width": 3 } : {};
      function a(o) { for (var k in st) o[k] = st[k]; return o; }
      sv("ellipse", a({ cx: 100, cy: 120, rx: 58, ry: 72, fill: fyll.kropp }), g);
      sv("ellipse", a({ cx: 100, cy: 56, rx: 34, ry: 36, fill: fyll.kropp }), g);
      sv("ellipse", a({ cx: 100, cy: 132, rx: 40, ry: 56, fill: fyll.mage }), g);
      sv("ellipse", a({ cx: 88, cy: 50, rx: 8, ry: 10, fill: fyll.oye }), g);
      sv("ellipse", a({ cx: 112, cy: 50, rx: 8, ry: 10, fill: fyll.oye }), g);
      sv("path", a({ d: "M84 70 Q100 58 116 70 Q100 84 84 70 z", fill: fyll.nebb }), g);
      sv("path", a({ d: "M44 186 Q46 166 70 170 Q86 176 82 192 Q62 200 44 186 z", fill: fyll.fot }), g);
      sv("path", a({ d: "M156 186 Q154 166 130 170 Q114 176 118 192 Q138 200 156 186 z", fill: fyll.fot }), g);
    }
    // 1: klartekst
    var s1 = F.svg(c[0], { w: W, h: H, maks: 220, tittel: "Bilde 1: klartekst", desc: "Pingvin i farger (svart, hvit, gul)." });
    sv("rect", { x: 0, y: 0, width: W, height: H, fill: "#ffffff" }, s1);
    pingvin(s1, { kropp: "#111111", mage: "#f4f4f4", nebb: "#f2b705", fot: "#f2b705", oye: "#ffffff" });
    el("div", "font-size:1.25rem;min-height:2.2rem;display:flex;align-items:center;", c[0], "Klartekst");
    // 2: grått stripete bilde der omrisset synes
    var s2 = F.svg(c[1], { w: W, h: H, maks: 220, tittel: "Bilde 2", desc: "Grått, stripete bilde der pingvinens omriss tydelig synes." });
    var id = s2._pil.replace(/-pil$/, ""), defs = s2.querySelector("defs");
    function striper(pid, a, b, vinkel) {
      var p = sv("pattern", { id: pid, width: 6, height: 6, patternUnits: "userSpaceOnUse", patternTransform: "rotate(" + vinkel + ")" }, defs);
      sv("rect", { width: 6, height: 6, fill: a }, p);
      sv("rect", { width: 3, height: 6, fill: b }, p);
    }
    striper(id + "-a", "#8d8d8d", "#a2a2a2", 35);
    striper(id + "-b", "#6a6a6a", "#9a9a9a", -35);
    striper(id + "-c", "#b5b5b5", "#8f8f8f", 80);
    sv("rect", { x: 0, y: 0, width: W, height: H, fill: "url(#" + id + "-a)" }, s2);
    pingvin(s2, { kropp: "url(#" + id + "-b)", mage: "url(#" + id + "-c)", nebb: "url(#" + id + "-c)", fot: "url(#" + id + "-c)", oye: "url(#" + id + "-a)", strek: "#4a4a4a" });
    F.felt(c[1], 0);
    // 3: jevn fargestøy (deterministisk, samme hver gang)
    var s3 = F.svg(c[2], { w: W, h: H, maks: 220, tittel: "Bilde 3", desc: "Bilde med jevn, fargerik støy uten noe synlig mønster." });
    var seed = 2021, n = 50, cw = W / n, ch = H / n, g3 = F.g(s3);
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      sv("rect", { x: (x * cw).toFixed(2), y: (y * ch).toFixed(2), width: (cw + 0.3).toFixed(2), height: (ch + 0.3).toFixed(2),
        fill: "hsl(" + Math.floor(rnd() * 360) + " " + Math.floor(20 + rnd() * 40) + "% " + Math.floor(40 + rnd() * 35) + "%)" }, g3);
    }
    F.felt(c[2], 1);
    // 4: «Ingen»
    el("div", "font-size:1.25rem;", c[3], "Ingen");
    F.felt(c[3], 2);
  };

  /* ---------- H2021-3.3: dekryptering med tellermodus (felt A–D i diagrammet, E under «Ingen») ----------
     Kilde: s. 10. A (rød ramme) og nøkkel K → B (blå ramme) → ⊕ ← C (rød ramme); ⊕ → D (rød ramme). */
  IN.FIGURER["H2021-3.3"] = function (host, oppg) {
    var rad = el("div", "display:flex;flex-wrap:wrap;gap:1.2rem 2rem;align-items:flex-end;", host);
    var v = el("div", "flex:1 1 300px;max-width:470px;min-width:0;", rad);
    el("div", "font-size:1.3rem;margin:0 0 .4rem;", v, "Dekryptering med tellermodus");
    var o = overlegg(v, 420, 312, { oppg: oppg, tittel: "Dekryptering med tellermodus" }), s = o.svg;
    function ramme(x, y, w, hh, farge, br) {
      sv("rect", { x: x, y: y, width: w, height: hh, fill: "none", style: "stroke:" + farge, "stroke-width": br }, s);
    }
    ramme(40, 8, 200, 60, "var(--fig-klar)", 5);              // A
    F.nokkel(s, 282, 16, { str: 1.15 });
    F.tekst(s, 304, 54, "K", { kursiv: true, str: 22, anker: "start" });
    F.pil(s, [[200, 70], [200, 104]]);
    F.pil(s, [[282, 68], [282, 104]]);
    sv("rect", { x: 112, y: 106, width: 280, height: 62, style: "fill:var(--fig-funk-fyll);stroke:var(--fig-strek)", "stroke-width": 1.5 }, s); // B
    F.pil(s, [[200, 168], [200, 196]]);
    F.xor(s, 200, 210, 14);
    ramme(4, 182, 168, 56, "var(--fig-klar)", 5);             // C
    F.pil(s, [[172, 210], [186, 210]]);
    F.pil(s, [[200, 224], [200, 246]]);
    ramme(96, 248, 220, 60, "var(--fig-klar)", 5);            // D
    o.felt(0, 46, 14, 188, 48);
    o.felt(1, 118, 113, 268, 48);
    o.felt(2, 10, 188, 156, 44);
    o.felt(3, 102, 254, 208, 48);
    var ingen = el("div", "flex:0 1 230px;display:flex;flex-direction:column;align-items:center;gap:.5rem;", rad);
    el("div", "font-size:1.25rem;", ingen, "Ingen");
    F.felt(ingen, 4);
  };

  /* ---------- H2021-4.4: tre sertifikattrær (ingen felt i figuren) ----------
     Kilde: s. 14. Rot → to mellomliggende; venstre mellomliggende → subjekt 1 og 2, høyre → subjekt 3. */
  IN.FIGURER["H2021-4.4"] = function (host, oppg) {
    var s = F.svg(host, { w: 644, h: 196, oppg: oppg, tittel: "Sertifikattrær", maks: 780 });
    var R = 13, Y = [24, 96, 170];
    function kant(a, b) {
      var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.sqrt(dx * dx + dy * dy);
      F.pil(s, [[a[0] + dx / l * R, a[1] + dy / l * R], [b[0] - dx / l * (R + 1), b[1] - dy / l * (R + 1)]]);
    }
    for (var t = 0; t < 3; t++) {
      var x0 = 18 + t * 110, rot = [x0 + 38, Y[0]], m = [[x0 + 20, Y[1]], [x0 + 56, Y[1]]],
        sub = [[x0 + 4, Y[2]], [x0 + 38, Y[2]], [x0 + 72, Y[2]]];
      sv("circle", { cx: rot[0], cy: rot[1], r: R, fill: "currentColor" }, s);
      m.forEach(function (p) {
        sv("circle", { cx: p[0], cy: p[1], r: R, style: "fill:var(--fig-bg)", stroke: "currentColor", "stroke-width": 3 }, s);
        sv("circle", { cx: p[0], cy: p[1], r: 5.5, fill: "currentColor" }, s);
        kant(rot, p);
      });
      sub.forEach(function (p) { sv("circle", { cx: p[0], cy: p[1], r: R, style: "fill:var(--fig-bg)", stroke: "currentColor", "stroke-width": 3 }, s); });
      kant(m[0], sub[0]); kant(m[0], sub[1]); kant(m[1], sub[2]);
    }
    F.tekst(s, 350, Y[0], "Rotsertifikater", { anker: "start", str: 22 });
    F.tekst(s, 350, Y[1], "Mellomliggende sertifikater", { anker: "start", str: 22 });
    F.tekst(s, 350, Y[2], "Subjektsertifikater", { anker: "start", str: 22 });
  };

  /* ---------- H2021-5.1: lagstabelen (4 felt i de midtre lagene) ----------
     Kilde: s. 15. «Apper» øverst (turkis), fire lag, «Fysisk lag» nederst (lysegrønn). */
  IN.FIGURER["H2021-5.1"] = function (host) {
    var st = el("div", "max-width:540px;margin:0 auto;border:1.5px solid #4a5a8a;", host);
    el("div", "background:#1de9c4;color:#06201b;font-size:1.3rem;text-align:center;padding:.75rem;", st, "Apper");
    for (var i = 0; i < 4; i++) {
      var r = el("div", "background:#dbe3f1;border-top:1.5px solid #4a5a8a;padding:7px 8px;display:flex;justify-content:center;", st);
      F.felt(r, i);
    }
    el("div", "background:#eefde0;color:#1b2a12;border-top:1.5px solid #4a5a8a;font-size:1.3rem;text-align:center;padding:.75rem;", st, "Fysisk lag");
  };

  /* ---------- H2021-7.2: OIDC-flyten (12 tallfelt, ett ved hver melding) ----------
     Kilde: s. 21. Feltene ligger der arket har de svarte sirklene. Bred figur: rulles vannrett på smal skjerm. */
  IN.FIGURER["H2021-7.2"] = function (host, oppg) {
    var rull = el("div", "overflow-x:auto;max-width:100%;", host);
    var inn = el("div", "min-width:700px;max-width:900px;margin:0 auto;", rull);
    var o = overlegg(inn, 900, 548, { oppg: oppg, tittel: "OpenID Connect: meldingsflyt" }), s = o.svg;
    var T = 17;
    function t(x, y, tekst, anker) { return F.tekst(s, x, y, tekst, { str: T, anker: anker }); }
    // toppen: OpenID Connect + Federation Agreement
    var logo = F.g(s);
    sv("path", { d: "M330 18 v40 l10 -4 v-36 z", fill: "#f7931e" }, logo);
    sv("path", { d: "M326 52 a30 18 0 0 1 4 -30", fill: "none", stroke: "#9a9a9a", "stroke-width": 4 }, logo);
    F.tekst(s, 352, 36, "OpenID Connect", { anker: "start", str: 28 });
    t(450, 70, "Federation Agreement");
    F.pil(s, [[450, 82], [200, 82], [200, 100]]);
    F.pil(s, [[450, 82], [720, 82], [720, 100]]);
    // ikoner
    var idpI = F.g(s);
    sv("rect", { x: 180, y: 102, width: 40, height: 38, rx: 6, style: "fill:var(--fig-bg)", stroke: "currentColor", "stroke-width": 3 }, idpI);
    sv("rect", { x: 188, y: 118, width: 24, height: 14, rx: 2, fill: "currentColor" }, idpI);
    sv("path", { d: "M192 116 v-8 m5 8 v-10 m5 10 v-10 m5 10 v-8", stroke: "currentColor", "stroke-width": 3, fill: "none" }, idpI);
    sv("title", {}, idpI).textContent = "IdP-ikon";
    var spI = F.g(s);
    sv("path", { d: "M694 112 L720 100 L746 112 z", fill: "#3b8a3b" }, spI);
    sv("rect", { x: 694, y: 112, width: 52, height: 30, fill: "#e06a3a", stroke: "#5a2a1a", "stroke-width": 1 }, spI);
    [700, 712, 726, 738].forEach(function (x) { sv("rect", { x: x, y: 117, width: 5, height: 20, fill: "#3a1a10" }, spI); });
    sv("title", {}, spI).textContent = "SP-ikon (bygning)";
    // bokser
    sv("rect", { x: 150, y: 150, width: 100, height: 46, fill: "#f9d3c9", stroke: "#e2b2a5", "stroke-width": 1.5 }, s);
    F.tekst(s, 200, 173, "IdP", { str: 18 }).setAttribute("style", "fill:#1b1d21");
    sv("rect", { x: 670, y: 150, width: 120, height: 52, fill: "#f9d3c9", stroke: "#3b5a9a", "stroke-width": 2 }, s);
    F.tekst(s, 730, 176, "SP", { str: 18 }).setAttribute("style", "fill:#1b1d21");
    sv("rect", { x: 380, y: 360, width: 140, height: 62, rx: 14, fill: "#3cc8f5", stroke: "#1b7fa8", "stroke-width": 1.5 }, s);
    F.tekst(s, 450, 391, "Nettleser", { str: 20 }).setAttribute("style", "fill:#0b1a22");
    // person
    var pers = F.g(s);
    sv("circle", { cx: 548, cy: 408, r: 8, fill: "#c98a5a" }, pers);
    sv("path", { d: "M536 420 h24 l2 46 h-8 l-2 46 h-5 l-1 -40 l-1 40 h-5 l-2 -46 h-8 z", fill: "#2a6fd6" }, pers);
    sv("path", { d: "M547 420 l1 0 l2 18 l-2 4 l-2 -4 z", fill: "#d62020" }, pers);
    sv("title", {}, pers).textContent = "Bruker";
    pers.setAttribute("transform", "translate(-58 22)");   // under nettleseren, til venstre for «tjeneste»-pila (som arket)
    function nokkel(x, y) {
      var g = F.g(s);
      sv("circle", { cx: x, cy: y, r: 7, fill: "#7fe0b5", stroke: "#2f7a5a", "stroke-width": 1 }, g);
      sv("path", { d: "M" + (x + 6) + " " + (y - 2) + " h24 v4 h-4 v4 h-3 v-4 h-3 v4 h-3 v-4 h-11 z", fill: "#7fe0b5", stroke: "#2f7a5a", "stroke-width": 1 }, g);
      sv("title", {}, g).textContent = "Nøkkel (autentikator)";
    }
    function token(x, y) {
      var g = F.g(s);
      sv("rect", { x: x, y: y, width: 70, height: 30, rx: 3, fill: "#f08080" }, g);
      F.tekst(g, x + 35, y + 15, "Token", { str: 17 }).setAttribute("style", "fill:#1b1d21");
      sv("rect", { x: x + 50, y: y - 22, width: 20, height: 18, rx: 2, fill: "#ffd21f", stroke: "#1b1d21", "stroke-width": 1.4 }, g);
      sv("path", { d: "M" + (x + 54) + " " + (y - 22) + " v-4 a6 6 0 0 1 12 0 v4", fill: "none", stroke: "#1b1d21", "stroke-width": 1.6 }, g);
    }
    // meldinger
    F.pil(s, [[490, 360], [490, 128], [668, 128]]);                 t(578, 114, "tjenesteforespørsel");
    F.pil(s, [[670, 170], [515, 170], [515, 358]]);                 t(598, 156, "liste over IdP-er");
    F.pil(s, [[528, 362], [684, 204]]);                             t(560, 244, "velg", "start"); t(560, 263, "IdP", "start");
    F.pil(s, [[700, 204], [532, 376]]);                             t(650, 292, "diriger", "start"); t(650, 311, "nettleser til", "start"); t(650, 330, "IdP", "start");
    F.pil(s, [[440, 358], [440, 128], [250, 128]]);                 t(345, 114, "be om autentisering");
    F.pil(s, [[250, 166], [415, 166], [415, 358]]);                 t(330, 151, "vis login-side");
    F.pil(s, [[386, 362], [248, 200]]);                             t(300, 286, "send", "end"); t(300, 305, "autentikator", "end");
    nokkel(214, 236);
    F.pil(s, [[150, 160], [112, 160], [112, 186], [150, 186]]);     t(66, 214, "bruker"); t(66, 233, "autentiseres");
    F.pil(s, [[196, 196], [196, 404], [378, 404]]);                 t(286, 424, "token til nettleser");
    token(162, 352);
    F.pil(s, [[522, 400], [770, 400], [770, 204]]);                 t(625, 424, "videresend", "start"); t(625, 443, "token til SP", "start");
    token(780, 300);
    F.pil(s, [[790, 176], [866, 176], [866, 490], [514, 490], [514, 424]]); t(690, 508, "tjeneste");
    sv("path", { d: "M476 458 Q452 456 450 438", fill: "none", stroke: "#f2c200", "stroke-width": 4 }, s);
    fargePil(s, [[450, 440], [449, 425]], "#f2c200", 4);
    nokkel(352, 472);
    t(420, 512, "presenter"); t(420, 532, "autentikator");
    // svarte sirkler der tallene skal stå (felt legges oppå)
    var P = [[490, 300], [515, 240], [602, 284], [676, 229], [440, 250], [415, 210], [440, 478], [291, 250], [112, 173], [330, 404], [700, 400], [600, 490]];
    P.forEach(function (p, i) {
      sv("circle", { cx: p[0], cy: p[1], r: 14, fill: "currentColor" }, s);
      o.felt(i, p[0] - 26, p[1] - 17, 52, 34, true);
    });
  };

  /* ---------- H2021-8.2: NIST CSF og NSMs grunnprinsipper (5 + 4 felt) ----------
     Kilde: s. 24. Overskrift, vannrett linje, loddrette greiner ned til feltene. Smal skjerm: loddrett linje, greiner mot høyre. */
  IN.FIGURER["H2021-8.2"] = function (host) {
    var GRA = "#8a8a8a";
    function tre(navn, farger, start) {
      var n = farger.length, sek = el("div", "margin:0 0 1.4rem;", host);
      tittel(sek, navn);
      var tr = el("div", "position:relative;", sek), bar = el("div", "position:absolute;background:" + GRA + ";", tr);
      var rad = el("div", "display:flex;gap:10px;", tr), stubber = [], ting = [];
      farger.forEach(function (f, i) {
        var it = el("div", "display:flex;min-width:0;", rad);
        stubber.push(el("div", "background:" + GRA + ";flex:none;", it));
        var r = el("div", "flex:1 1 auto;min-width:0;border:3px solid " + f + ";border-radius:3px;padding:4px;display:flex;justify-content:center;", it);
        F.felt(r, start + i);
        ting.push(it);
      });
      responsiv(tr, 620, function (smal) {
        var kant = (100 / (2 * n)) + "%";
        rad.style.flexDirection = smal ? "column" : "row";
        bar.style.cssText = "position:absolute;background:" + GRA + ";" + (smal
          ? "left:0;width:3px;top:" + kant + ";bottom:" + kant + ";"
          : "top:0;height:3px;left:" + kant + ";right:" + kant + ";");
        ting.forEach(function (it, i) {
          it.style.flex = smal ? "none" : "1 1 0";
          it.style.flexDirection = smal ? "row" : "column";
          it.style.alignItems = smal ? "center" : "stretch";
          stubber[i].style.cssText = "background:" + GRA + ";flex:none;" + (smal ? "width:18px;height:3px;" : "width:3px;height:18px;margin:0 auto;");
        });
      });
    }
    tre("NIST Cyber Security Framework", ["#3fbfd9", "#b04a9a", "#d8cc00", "#d62020", "#5fae2e"], 0);
    tre("NSM Grunnprinsipper for IKT-sikkerhet", ["#8aa6cf", "#8aa6cf", "#8aa6cf", "#8aa6cf"], 5);
  };

  /* ---------- H2021-9.1: sju chevroner (felt i hver, nummer 1–7 over) ----------
     Kilde: s. 25. Smal skjerm: chevronene stables loddrett, nummeret til venstre. */
  IN.FIGURER["H2021-9.1"] = function (host) {
    var FARGE = ["#d9472b", "#4a7fb0", "#a39a1e", "#2f5f9a", "#4f9a3a", "#6f9a7a", "#cf5f78"];
    tittel(host, "Syklus for innebygd informasjonssikkerhet");
    var rad = el("div", "display:flex;gap:4px;", host), ting = [], nr = [];
    FARGE.forEach(function (f, i) {
      var it = el("div", "display:flex;align-items:center;gap:6px;min-width:0;", rad);
      nr.push(el("div", "flex:none;width:1.7rem;height:1.7rem;border:1.5px solid currentColor;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.95rem;", it, String(i + 1)));
      var ch = el("div", "align-self:stretch;background:" + f + ";clip-path:polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%,12px 50%);padding:9px 14px 9px 16px;display:flex;justify-content:center;min-width:0;", it);
      F.felt(ch, i);
      ting.push(it);
    });
    responsiv(rad, 720, function (smal) {   // én vannrett rad som arket når figuren er minst 720 px bred
      rad.style.flexDirection = smal ? "column" : "row";
      ting.forEach(function (it) {
        it.style.flex = smal ? "none" : "1 1 0";
        it.style.flexDirection = smal ? "row" : "column";
      });
      ting.forEach(function (it) { it.lastChild.style.flex = smal ? "1 1 auto" : "none"; it.lastChild.style.width = smal ? "auto" : "100%"; });
    });
  };

  /* ---------- H2021-10.1: Cyber Kill Chain (7 felt i trapp langs pila, nummer 1–7 over) ----------
     Kilde: s. 28. Bred gul pil skrått ned mot høyre; feltene i trapp ned mot høyre. */
  IN.FIGURER["H2021-10.1"] = function (host) {
    tittel(host, "Cyber Kill Chain");
    var box = el("div", "position:relative;padding:6px 0 4px;", host);
    var pil = document.createElementNS(NS, "svg");
    pil.setAttribute("viewBox", "0 0 100 100");
    pil.setAttribute("preserveAspectRatio", "none");
    pil.setAttribute("aria-hidden", "true");
    pil.setAttribute("style", "position:absolute;inset:0;width:100%;height:100%;");
    sv("path", { d: "M5 0 L89 62 L88 50 L100 90 L80 100 L84 90 L3 22 z", fill: "#f7c96b", stroke: "#c8962e", "stroke-width": 0.4, "vector-effect": "non-scaling-stroke" }, pil);
    box.appendChild(pil);
    var rader = [];
    for (var i = 0; i < 7; i++) {
      var r = el("div", "position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;margin-top:2px;", box);
      el("div", "width:1.8rem;height:1.8rem;border:1.5px solid #1b1d21;background:#ffffff;color:#1b1d21;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1rem;", r, String(i + 1));
      var f = el("div", "width:100%;box-sizing:border-box;border:1.5px solid var(--color-outline);background:var(--color-surface-container-lowest);border-radius:4px;padding:4px;display:flex;justify-content:center;", r);
      F.felt(f, i);
      rader.push(r);
    }
    responsiv(box, [560, 740], function (smal, niva) {
      // smal: brede felt i slak trapp; middels: halv bredde; bred (som arket): feltene side om side i trapp, radene overlapper loddrett
      var B = [62, 30, 16.5][niva];
      rader.forEach(function (r, i) {
        r.style.width = B + "%";
        r.style.marginLeft = (i * (100 - B) / 6) + "%";
        r.style.marginTop = !i ? "2px" : niva === 2 ? "-34px" : niva === 1 ? "-14px" : "2px";
      });
    });
  };
})();
