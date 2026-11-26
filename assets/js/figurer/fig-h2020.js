/* ============================================================
   IN2120 guide · figurer/fig-h2020.js
   Eksamensfigurene fra H2020, tegnet på nytt med IN.fig (API øverst i fig-felles.js).
   Kilde: UiO, IN2120 eksamen H2020 (eksamen/in2120-2020-x-qa.pdf). Kontrollliste: plan/figurer/INVENTAR-h2020.md.
   Regler: tro mot arket (samme elementer, piler, etiketter, plassering), ikke røp svaret,
   tål flere kall (ingen global tilstand). Svarfelt i figuren: F.felt(htmlNode, i), aldri inni SVG.

   Lokale hjelpere (bare i denne fila):
     el(tag, css, parent, tekst)        HTML-element med inline stil.
     sv(tag, attrs, parent)             SVG-element.
     fargePil(parent, punkter, farge, bredde, dobbel)   pil i egen farge, spiss i siste punkt (og første hvis dobbel).
     sky(parent, cx, cy, sk)            tegnet sky (Internett / skyplattform).
     blokkpil(parent)                   lyseblå blokkpil nedover (HTML-SVG mellom bokser).
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
  function spiss(parent, a, b, farge, bredde) {
    var v = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 6 + bredde * 2.2, B = 4 + bredde * 1.3;
    var p1 = [b[0] - L * Math.cos(v) + B * Math.sin(v), b[1] - L * Math.sin(v) - B * Math.cos(v)];
    var p2 = [b[0] - L * Math.cos(v) - B * Math.sin(v), b[1] - L * Math.sin(v) + B * Math.cos(v)];
    sv("path", { d: "M" + b.join(" ") + " L" + p1.join(" ") + " L" + p2.join(" ") + " z", fill: farge }, parent);
  }
  function fargePil(parent, punkter, farge, bredde, dobbel) {
    bredde = bredde || 4;
    var d = punkter.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ");
    sv("path", { d: d, fill: "none", stroke: farge, "stroke-width": bredde, "stroke-linejoin": "round" }, parent);
    spiss(parent, punkter[punkter.length - 2], punkter[punkter.length - 1], farge, bredde);
    if (dobbel) spiss(parent, punkter[1], punkter[0], farge, bredde);
  }
  function sky(parent, cx, cy, sk, fyll, kant) {
    var g = sv("g", { transform: "translate(" + cx + " " + cy + ") scale(" + sk + ")" }, parent);
    var C = [[-52, 6, 26], [-26, -16, 28], [8, -24, 30], [40, -10, 26], [56, 12, 22], [24, 22, 26], [-14, 24, 26]];
    C.forEach(function (c) { sv("circle", { cx: c[0], cy: c[1], r: c[2], fill: fyll, stroke: kant, "stroke-width": 2 / sk }, g); });
    C.forEach(function (c) { sv("circle", { cx: c[0], cy: c[1], r: c[2] - 2 / sk, fill: fyll }, g); });
    return g;
  }
  function blokkpil(parent) {
    var s = F.svg(parent, { w: 40, h: 40, tittel: "Pil ned", desc: "Pil nedover" });
    s.style.maxWidth = "34px";
    sv("path", { d: "M13 1 L27 1 L27 24 L35 24 L20 39 L5 24 L13 24 z", fill: "#bfe7f8", stroke: "#4f8fb3",
      "stroke-width": 1.4, "stroke-linejoin": "round" }, s);
  }

  /* ---------- H2020-1.1 og H2020-7.2: nettbasert eksamen (ingen felt i figuren) ----------
     Kilde: s. 2 og s. 22 (samme figur). Foreleser ↔ sky med tjener og Inspera-vindu ↔ student med bærbar PC,
     lyseblå dobbeltpiler, tekst under hver del. Bred figur: rulles vannrett på smal skjerm. */
  function eksamensfigur(host, oppg) {
    var rull = el("div", "overflow-x:auto;max-width:100%;", host);
    var inn = el("div", "min-width:560px;max-width:820px;margin:0 auto;", rull);
    var s = F.svg(inn, { w: 780, h: 270, oppg: oppg, tittel: "Nettbasert eksamen" });
    var BLA = "#8fd3f4";
    // Foreleser (dress)
    sv("circle", { cx: 110, cy: 62, r: 30, fill: "#f1c9a5", stroke: "#5b4636", "stroke-width": 2 }, s);
    sv("path", { d: "M80 54 Q110 18 140 54 Q132 36 110 34 Q88 36 80 54 z", fill: "#5b4636" }, s);
    sv("path", { d: "M52 196 L60 122 Q66 100 110 96 Q154 100 160 122 L168 196 z", fill: "#3b4a63", stroke: "#24304a", "stroke-width": 2 }, s);
    sv("path", { d: "M98 98 L110 140 L122 98 z", fill: "#ffffff" }, s);
    sv("path", { d: "M106 104 L110 132 L114 104 z", fill: "#b23a3a" }, s);
    // Sky med tjenerskap og nettleservindu
    sky(s, 390, 100, 1.9, "var(--color-surface-container-low)", "var(--color-outline)");
    sv("rect", { x: 300, y: 56, width: 48, height: 96, rx: 4, fill: "#4b5563", stroke: "#1f2937", "stroke-width": 2 }, s);
    [70, 90, 110, 130].forEach(function (y) {
      sv("rect", { x: 306, y: y, width: 36, height: 12, rx: 2, fill: "#9ca3af" }, s);
      sv("circle", { cx: 336, cy: y + 6, r: 2.5, fill: "#34d399" }, s);
    });
    sv("rect", { x: 368, y: 52, width: 140, height: 104, rx: 6, fill: "#ffffff", stroke: "#475569", "stroke-width": 2 }, s);
    sv("rect", { x: 368, y: 52, width: 140, height: 18, rx: 6, fill: "#cbd5e1" }, s);
    [380, 392, 404].forEach(function (x) { sv("circle", { cx: x, cy: 61, r: 3.5, fill: "#64748b" }, s); });
    sv("text", { x: 438, y: 114, "text-anchor": "middle", "dominant-baseline": "central", "font-size": 22,
      "font-weight": 700, fill: "#1e3a8a" }, s).textContent = "Inspera";
    // Student med bærbar PC
    sv("circle", { cx: 680, cy: 70, r: 28, fill: "#f1c9a5", stroke: "#5b4636", "stroke-width": 2 }, s);
    sv("path", { d: "M652 62 Q656 34 684 36 Q708 38 708 64 Q696 48 676 50 Q660 52 652 62 z", fill: "#a0522d" }, s);
    sv("path", { d: "M628 196 L634 130 Q642 104 680 100 Q718 104 726 130 L732 196 z", fill: "#2f855a", stroke: "#22543d", "stroke-width": 2 }, s);
    sv("path", { d: "M598 128 L650 128 L668 184 L616 184 z", fill: "#94a3b8", stroke: "#334155", "stroke-width": 2 }, s);
    sv("rect", { x: 610, y: 184, width: 112, height: 9, rx: 3, fill: "#64748b" }, s);
    // Dobbeltpiler
    fargePil(s, [[180, 110], [268, 110]], BLA, 9, true);
    fargePil(s, [[516, 110], [592, 110]], BLA, 9, true);
    // Tekst
    F.tekst(s, 110, 222, "Foreleser som", { str: 18 });
    F.tekst(s, 110, 244, "lager eksamen", { str: 18 });
    F.tekst(s, 400, 222, "Platform for", { str: 18 });
    F.tekst(s, 400, 244, "online eksamen", { str: 18 });
    F.tekst(s, 680, 222, "Student som", { str: 18 });
    F.tekst(s, 680, 244, "tar eksamen", { str: 18 });
  }
  IN.FIGURER["H2020-1.1"] = eksamensfigur;
  IN.FIGURER["H2020-7.2"] = eksamensfigur;

  /* ---------- H2020-1.2: IAM-faser (6 felt i boksene) ----------
     Kilde: s. 3. To avrundede rammer; tre bokser i hver med enkel pil ned mellom boksene (begge kolonner). */
  IN.FIGURER["H2020-1.2"] = function (host) {
    var c = F.celler(host, 2, { kol: 2 });
    function fase(celle, navn, start) {
      celle.style.alignSelf = "start";
      el("div", "font-size:1.45rem;text-align:center;margin-bottom:.4rem;", celle, navn);
      var r = el("div", "width:100%;max-width:340px;box-sizing:border-box;border:2.5px solid currentColor;border-radius:26px;padding:16px 12px;display:flex;flex-direction:column;align-items:center;gap:4px;", celle);
      for (var i = 0; i < 3; i++) {
        var b = el("div", "width:100%;box-sizing:border-box;border:1.5px solid var(--color-outline);background:var(--color-surface-container-low);padding:10px 8px;display:flex;justify-content:center;", r);
        F.felt(b, start + i);
        if (i < 2) blokkpil(r);
      }
    }
    fase(c[0], "Konfigureringsfase", 0);
    fase(c[1], "Bruksfase", 3);
  };

  /* ---------- H2020-4.2: DMZ og interne nett (ingen felt i figuren) ----------
     Kilde: s. 13. Sky «Internet» → ytre brannmur → buss «DMZ» med tre «?»-bokser → indre brannmur → buss
     «Internal Networks» med tre «?»-bokser. Blå linjer, murvegg-ikoner. */
  IN.FIGURER["H2020-4.2"] = function (host, oppg) {
    var s = F.svg(host, { w: 660, h: 372, oppg: oppg, tittel: "Nettverk med DMZ", maks: 760 });
    var BL = "#6b6bff";
    function linje(p) {
      sv("path", { d: p.map(function (q, i) { return (i ? "L" : "M") + q[0] + " " + q[1]; }).join(" "),
        fill: "none", stroke: BL, "stroke-width": 5, "stroke-linejoin": "round" }, s);
    }
    function mur(x, y, w, h) {
      sv("rect", { x: x + 5, y: y + 5, width: w, height: h, fill: "#9a9a9a" }, s);
      sv("rect", { x: x, y: y, width: w, height: h, fill: "#6b6b6b", stroke: "#3f3f3f", "stroke-width": 1.5 }, s);
      for (var r = 1; r * 10 < h; r++) {
        sv("line", { x1: x, y1: y + r * 10, x2: x + w, y2: y + r * 10, stroke: "#9b9b9b", "stroke-width": 1.2 }, s);
      }
      for (var k = 0; k * 10 < h; k++) {
        var xx = x + (k % 2 ? w / 3 : (2 * w) / 3);
        sv("line", { x1: xx, y1: y + k * 10, x2: xx, y2: Math.min(y + h, y + k * 10 + 10), stroke: "#9b9b9b", "stroke-width": 1.2 }, s);
      }
    }
    function sporsmal(cx, cy) { F.boks(s, cx - 21, cy - 22, 42, 44, "?", { rolle: "noytral", kursiv: false }); }
    // Linjer først, så ikoner og bokser oppå
    linje([[206, 56], [298, 56], [298, 80]]);
    linje([[293, 150], [293, 222]]);
    linje([[48, 193], [293, 193]]);
    [48, 122, 204].forEach(function (x) { linje([[x, 193], [x, 232]]); });
    linje([[293, 296], [293, 324], [606, 324]]);
    [443, 526, 606].forEach(function (x) { linje([[x, 324], [x, 292]]); });
    sky(s, 150, 52, 0.95, "#e4e4dc", "#7a7a72");
    F.tekst(s, 150, 54, "Internet", { fet: true, str: 20 }).setAttribute("style", "fill:#111111");
    mur(280, 74, 30, 76);
    F.tekst(s, 325, 84, "External", { anker: "start", str: 18 });
    F.tekst(s, 325, 107, "Router /", { anker: "start", str: 18 });
    F.tekst(s, 325, 130, "Firewall", { anker: "start", str: 18 });
    F.tekst(s, 34, 175, "DMZ (Demilitarized Zone)", { anker: "start", fet: true, str: 18 });
    [48, 122, 204].forEach(function (x) { sporsmal(x, 254); });
    mur(272, 220, 34, 76);
    F.tekst(s, 318, 230, "Internal", { anker: "start", str: 18 });
    F.tekst(s, 318, 253, "Router /", { anker: "start", str: 18 });
    F.tekst(s, 318, 276, "Firewall", { anker: "start", str: 18 });
    [443, 526, 606].forEach(function (x) { sporsmal(x, 270); });
    F.tekst(s, 443, 352, "Internal Networks", { anker: "start", fet: true, str: 18 });
  };

  /* ---------- H2020-5.1: privilegieringer (6 felt i stabelen) ----------
     Kilde: s. 15. Olivenfarget stabel med grønne kanter; ringetikett øverst til høyre i hvert felt.
     Ring 2 og Ring 1 deler ett høyt felt (tynn strek mellom etikettene). */
  IN.FIGURER["H2020-5.1"] = function (host) {
    var st = el("div", "max-width:560px;margin:0 auto;border:1.5px solid #3b3b2a;background:#3b3b2a;display:flex;flex-direction:column;gap:2px;", host);
    var rader = [["Ring 3"], ["Ring 2", "Ring 1"], ["Ring 0"], ["Ring -1"], ["Ring -2"], ["Ring -3"]];
    rader.forEach(function (navn, i) {
      var r = el("div", "position:relative;background:#d8d5aa;color:#1b1b10;border:2.5px solid #4f9a1f;min-height:" +
        (navn.length > 1 ? 104 : 58) + "px;display:flex;align-items:center;padding:6px 96px 6px 10px;box-sizing:border-box;", st);
      var etik = el("div", "position:absolute;right:8px;top:4px;bottom:4px;display:flex;flex-direction:column;justify-content:space-between;align-items:flex-end;font-size:1.45rem;line-height:1.1;", r);
      navn.forEach(function (n, j) {
        if (j) el("div", "position:absolute;left:-14px;right:-8px;top:50%;border-top:1px solid #5f5f45;", etik);
        el("div", "white-space:nowrap;", etik, n);
      });
      var f = el("div", "flex:1 1 auto;display:flex;min-width:0;position:relative;z-index:1;", r);
      F.felt(f, i);
    });
  };

  /* ---------- H2020-7.1: risikostyring med to beslutningspunkter (ingen felt i figuren) ----------
     Kilde: s. 21. «Risikostyring» → blå stiplet ramme (Planlegging → Risikovurdering → rombe 1 → Risikobehandlingssplan
     → rombe 2 → Akseptert gjenværende risiko, «Nei» fra hver rombe tilbake til Planlegging) → «Gjennomfør
     risikobehandlingsplan». Arket skriver «Risikobehandlingssplan» i boksen (gjengitt ordrett). */
  IN.FIGURER["H2020-7.1"] = function (host, oppg) {
    var s = F.svg(host, { w: 640, h: 366, oppg: oppg, tittel: "Risikostyring med beslutningspunkter", maks: 760 });
    var GR = "#7cb44a", GRF = "#e9f3dc", BLA = "#1d3fd6";
    function gronn(x, y, w, h, t, r) {
      sv("rect", { x: x, y: y, width: w, height: h, rx: r || 0, fill: GRF, stroke: GR, "stroke-width": 2.5 }, s);
      F.tekst(s, x + w / 2, y + h / 2, t, { str: 17 }).setAttribute("style", "fill:#111111");
    }
    function rombe(cx, cy) {
      sv("path", { d: "M" + (cx - 22) + " " + cy + " L" + cx + " " + (cy - 17) + " L" + (cx + 22) + " " + cy + " L" + cx + " " + (cy + 17) + " z",
        fill: "#d4e8a6", stroke: GR, "stroke-width": 2 }, s);
    }
    F.boks(s, 180, 6, 172, 28, "Risikostyring", { rolle: "noytral" });
    sv("rect", { x: 100, y: 44, width: 444, height: 274, fill: "none", stroke: BLA, "stroke-width": 3.5, "stroke-dasharray": "12 6" }, s);
    gronn(156, 62, 220, 30, "Planlegging");
    gronn(156, 112, 220, 30, "Risikovurdering", 15);
    rombe(266, 172);
    gronn(150, 202, 228, 28, "Risikobehandlingssplan");
    rombe(266, 254);
    gronn(126, 280, 280, 30, "Akseptert gjenværende risiko");
    F.boks(s, 100, 330, 370, 30, "Gjennomfør risikobehandlingsplan", { rolle: "noytral" });
    // Piler nedover
    F.pil(s, [[266, 34], [266, 62]]);
    F.pil(s, [[266, 92], [266, 112]]);
    F.pil(s, [[266, 142], [266, 155]]);
    F.pil(s, [[266, 189], [266, 202]]);
    F.pil(s, [[266, 230], [266, 237]]);
    F.pil(s, [[266, 271], [266, 280]]);
    F.pil(s, [[266, 310], [266, 330]]);
    // «Nei» tilbake til Planlegging
    F.pil(s, [[244, 172], [126, 172], [126, 70], [156, 70]]);
    F.pil(s, [[244, 254], [116, 254], [116, 82], [156, 82]]);
    F.tekst(s, 226, 160, "Nei", { str: 16 });
    F.tekst(s, 282, 190, "Ja", { str: 16 });
    F.tekst(s, 226, 242, "Nei", { str: 16 });
    F.tekst(s, 282, 272, "Ja", { str: 16 });
    F.tekst(s, 302, 160, "Beslutningspunkt 1:", { anker: "start", str: 16 });
    F.tekst(s, 302, 182, "Er vurdering akseptabel?", { anker: "start", str: 16 });
    F.tekst(s, 302, 242, "Beslutningspunkt 2:", { anker: "start", str: 16 });
    F.tekst(s, 302, 264, "Er behandlingsplan akseptabel?", { anker: "start", str: 16 });
  };
})();
