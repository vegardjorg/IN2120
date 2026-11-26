/* ============================================================
   IN2120 guide · figurer/fig-h2018.js
   Eksamensfigurene fra H2018, tegnet på nytt med IN.fig (API øverst i fig-felles.js).
   Kilde: UiO, IN2120 eksamen H2018 (eksamen/in2120-2018-x-qa.pdf). Kontrollliste: plan/figurer/INVENTAR-h2018.md.
   Regler som i fig-h2021.js: tro mot arket, ikke røp svaret (ingen fasitmarkering, ingen rette tall/navn i feltene),
   tål flere kall, svarfelt bare som HTML (IN.fig.felt) oppå eller under SVG-en.
   Lokale hjelpere: el, sv, overlegg, fargePil (samme som i fig-h2021.js), lagBoks (rektangel med flere tekstlinjer).
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FIGURER = IN.FIGURER || {};
  var F = IN.fig;
  if (!F) return;
  var NS = "http://www.w3.org/2000/svg";
  var MORK = "#1b1d21"; // tekst på lyse, faste fyllfarger (leselig i begge tema)

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
  function pst(v, tot) { return (Math.round(v / tot * 10000) / 100) + "%"; }
  function overlegg(parent, w, hh, o) {
    o = o || {};
    var wrap = el("div", "position:relative;width:100%;margin:0 auto;" + (o.maks ? "max-width:" + o.maks + "px;" : ""), parent);
    var svg = F.svg(wrap, { w: w, h: hh, oppg: o.oppg, tittel: o.tittel, desc: o.desc });
    svg.style.maxWidth = "none";
    return {
      wrap: wrap, svg: svg,
      felt: function (i, x, y, fw, fh) {
        var ph = F.felt(wrap, i);
        ph.style.cssText = "position:absolute;left:" + pst(x, w) + ";top:" + pst(y, hh) + ";width:" + pst(fw, w) +
          ";height:" + pst(fh, hh) + ";max-width:none;min-height:0;display:flex;align-items:center;";
        return ph;
      }
    };
  }
  function fargePil(parent, punkter, farge, bredde, begge) {
    bredde = bredde || 2;
    var d = punkter.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ");
    sv("path", { d: d, fill: "none", stroke: farge, "stroke-width": bredde, "stroke-linejoin": "round" }, parent);
    function spiss(a, b) {
      var v = Math.atan2(b[1] - a[1], b[0] - a[0]), L = 6 + bredde * 2.2, B = 4 + bredde * 1.3;
      var p1 = [b[0] - L * Math.cos(v) + B * Math.sin(v), b[1] - L * Math.sin(v) - B * Math.cos(v)];
      var p2 = [b[0] - L * Math.cos(v) - B * Math.sin(v), b[1] - L * Math.sin(v) + B * Math.cos(v)];
      sv("path", { d: "M" + b.join(" ") + " L" + p1.join(" ") + " L" + p2.join(" ") + " z", fill: farge }, parent);
    }
    spiss(punkter[punkter.length - 2], punkter[punkter.length - 1]);
    if (begge) spiss(punkter[1], punkter[0]);
  }
  /* Rektangel med fast fyll og én eller flere tekstlinjer midt i (mørk tekst, fordi fyllet er lyst). */
  function lagBoks(parent, x, y, w, h, linjer, fyll, o) {
    o = o || {};
    var g = F.g(parent);
    sv("rect", { x: x, y: y, width: w, height: h, rx: o.r || 0, fill: fyll, stroke: o.strek || "#5b5f66", "stroke-width": o.sb || 1.2, "stroke-dasharray": o.stiplet ? "5 4" : null }, g);
    linjer = [].concat(linjer || []);
    var str = o.str || 16, lh = str * 1.2, y0 = y + h / 2 - (linjer.length - 1) * lh / 2;
    linjer.forEach(function (t, i) {
      var tx = F.tekst(g, x + w / 2, y0 + i * lh, t, { str: str, fet: o.fet });
      tx.setAttribute("style", "fill:" + (o.tekstfarge || MORK));
    });
    return g;
  }

  /* ---------- H2018-3.1: kryptoperioder (ingen felt i figuren) ----------
     Kilde: s. 6 (plan/figurer/kilde/H2018-3.1.png). To loddrette grensestreker; gult felt «Protection Period» fra
     venstre til litt over midten, grønt «Processing Period» fra et stykke inn til høyre kant, blått «Cryptoperiod» over hele. */
  IN.FIGURER["H2018-3.1"] = function (host, oppg) {
    var s = F.svg(host, { w: 560, h: 200, oppg: oppg, tittel: "Kryptoperioder", maks: 640 });
    var X0 = 30, X1 = 530;
    F.linje(s, [[X0, 8], [X0, 192]]);
    F.linje(s, [[X1, 8], [X1, 192]]);
    function band(x, w, y, farge, navn) {
      sv("rect", { x: x, y: y, width: w, height: 50, fill: farge, stroke: "#5b5f66", "stroke-width": 1 }, s);
      fargePil(s, [[x + 8, y + 34], [x + w - 8, y + 34]], MORK, 1.6, true);
      F.tekst(s, x + w / 2, y + 16, navn, { str: 16, fet: true }).setAttribute("style", "fill:" + MORK);
    }
    band(X0, 300, 14, "#ffe27a", "Protection Period");
    band(140, X1 - 140, 74, "#a8dc8c", "Processing Period");
    band(X0, X1 - X0, 134, "#9cc3f0", "Cryptoperiod");
  };

  /* ---------- H2018-5.2: type 1-arkitektur med ringer (felt under figuren) ----------
     Kilde: s. 12 (H2018-5.2.png). Fire «App.» over to «Guest OS VM» over «Hypervisor» over «Hardware», stiplede skillelinjer. */
  IN.FIGURER["H2018-5.2"] = function (host, oppg) {
    var s = F.svg(host, { w: 440, h: 250, oppg: oppg, tittel: "Type 1 VM Architecture", maks: 520 });
    [20, 122, 224, 326].forEach(function (x) { lagBoks(s, x, 30, 94, 40, "App.", "#9fdcdc"); });
    F.linje(s, [[10, 82], [430, 82]], { stiplet: true });
    lagBoks(s, 20, 94, 196, 44, "Guest OS VM", "#f6b26b");
    lagBoks(s, 224, 94, 196, 44, "Guest OS VM", "#f6b26b");
    F.linje(s, [[10, 150], [430, 150]], { stiplet: true });
    lagBoks(s, 20, 162, 400, 34, "Hypervisor", "#ffe599");
    F.linje(s, [[10, 206], [430, 206]], { stiplet: true });
    lagBoks(s, 20, 214, 400, 32, "Hardware", "#f4cccc");
  };

  /* ---------- H2018-5.3: TPM-brikke (illustrasjon, ingen felt) ----------
     Kilde: s. 12 (H2018-5.3.png) viser et produktfoto av to TPM-brikker. Tegnet som en generisk brikke uten merkenavn. */
  IN.FIGURER["H2018-5.3"] = function (host, oppg) {
    var s = F.svg(host, { w: 220, h: 180, oppg: oppg, tittel: "TPM-brikke", maks: 260 });
    var g = F.g(s);
    for (var i = 0; i < 8; i++) {
      var p = 52 + i * 15;
      sv("rect", { x: p, y: 22, width: 6, height: 14, fill: "#b9bcc2" }, g);
      sv("rect", { x: p, y: 144, width: 6, height: 14, fill: "#b9bcc2" }, g);
      sv("rect", { x: 42, y: p - 12, width: 14, height: 6, fill: "#b9bcc2" }, g);
      sv("rect", { x: 164, y: p - 12, width: 14, height: 6, fill: "#b9bcc2" }, g);
    }
    sv("rect", { x: 54, y: 34, width: 112, height: 112, rx: 6, fill: "#2b2e33", stroke: "#111", "stroke-width": 1.2 }, g);
    sv("circle", { cx: 68, cy: 48, r: 4, fill: "#55595f" }, g);
    F.tekst(g, 110, 84, "TPM", { str: 26, fet: true }).setAttribute("style", "fill:#ffffff");
    F.tekst(g, 110, 112, "2.0", { str: 18 }).setAttribute("style", "fill:#d5d9df");
  };

  /* ---------- H2018-6.3: trusseltre (fire dra-felt i figuren) ----------
     Kilde: s. 14 (H2018-6.3.png). Rot øverst, «OR» under, to AND-prikker, fire blader; høyre blad er ferdig utfylt «XSS Attack».
     Felt: 0 rot, 1 venstre AND venstre, 2 venstre AND høyre, 3 høyre AND venstre (samme rekkefølge som inspera.felt). */
  IN.FIGURER["H2018-6.3"] = function (host, oppg) {
    var rull = el("div", "overflow-x:auto;max-width:100%;", host);
    var inn = el("div", "min-width:520px;max-width:760px;margin:0 auto;", rull);
    var W = 760, H = 330, o = overlegg(inn, W, H, { oppg: oppg, tittel: "Trusseltre" }), s = o.svg;
    var GR = "#9dce85", GRK = "#3f8a1f";
    function blad(x, y, w, h, tekst) {
      sv("rect", { x: x, y: y, width: w, height: h, fill: GR, stroke: GRK, "stroke-width": tekst ? 0 : 2.5 }, s);
      if (tekst) F.tekst(s, x + w / 2, y + h / 2, tekst, { str: 20 }).setAttribute("style", "fill:" + MORK);
    }
    var R = { x: 285, y: 12, w: 190, h: 82 };
    blad(R.x, R.y, R.w, R.h);
    F.tekst(s, 380, 122, "OR", { str: 18 });
    var VA = [170, 178], HA = [590, 178];
    F.pil(s, [[380, 96], [VA[0] + 8, VA[1] - 4]]);
    F.pil(s, [[380, 96], [HA[0] - 8, HA[1] - 4]]);
    sv("circle", { cx: VA[0], cy: VA[1], r: 7, fill: "currentColor" }, s);
    sv("circle", { cx: HA[0], cy: HA[1], r: 7, fill: "currentColor" }, s);
    F.tekst(s, VA[0] - 16, VA[1], "AND", { str: 17, anker: "end" });
    F.tekst(s, HA[0] + 16, HA[1], "AND", { str: 17, anker: "start" });
    var BY = 250, BW = 170, BH = 72, BX = [12, 202, 392, 578];
    F.pil(s, [VA, [BX[0] + BW / 2, BY - 2]]);
    F.pil(s, [VA, [BX[1] + BW / 2, BY - 2]]);
    F.pil(s, [HA, [BX[2] + BW / 2, BY - 2]]);
    F.pil(s, [HA, [BX[3] + BW / 2, BY - 2]]);
    for (var i = 0; i < 3; i++) blad(BX[i], BY, BW, BH);
    blad(BX[3], BY, BW, BH, "XSS Attack");
    o.felt(0, R.x + 12, R.y + 18, R.w - 24, R.h - 36);
    for (var j = 0; j < 3; j++) o.felt(j + 1, BX[j] + 10, BY + 16, BW - 20, BH - 32);
  };

  /* ---------- H2018-8.1: IAM-faser (ingen felt i figuren; matrisen står under) ----------
     Kilde: s. 19 (H2018-8.1.png). To avrundede rammer med trinn 1–3 og 4–6 og piler ned; grønt bånd «Identity Management»
     over trinn 1, 2, 4, 5 og gult bånd «Access Management» over trinn 3 og 6. Båndetikettene står midt mellom rammene som på arket. */
  IN.FIGURER["H2018-8.1"] = function (host, oppg) {
    var s = F.svg(host, { w: 686, h: 350, oppg: oppg, tittel: "Faser i identitets- og tilgangsstyring", maks: 740 });
    sv("rect", { x: 4, y: 62, width: 678, height: 164, fill: "#7cc46a", "fill-opacity": 0.35 }, s);
    sv("rect", { x: 4, y: 240, width: 678, height: 84, fill: "#f2d04b", "fill-opacity": 0.45 }, s);
    function etikett(y, l1, l2) { F.tekst(s, 343, y - 11, l1, { str: 16, fet: true }); F.tekst(s, 343, y + 11, l2, { str: 16, fet: true }); }
    etikett(144, "Identity", "Management");
    etikett(282, "Access", "Management");
    function fase(x0, navn, start) {
      sv("rect", { x: x0, y: 46, width: 262, height: 292, rx: 24, fill: "none", stroke: "currentColor", "stroke-width": 2.4 }, s);
      F.tekst(s, x0 + 131, 24, navn, { str: 19 });
      var ys = [74, 166, 256], cx = x0 + 131;
      for (var i = 0; i < 3; i++) {
        F.boks(s, cx - 70, ys[i], 140, 48, String(start + i), { rolle: "noytral" });
        if (i < 2) F.pil(s, [[cx, ys[i] + 50], [cx, ys[i + 1] - 2]]);
      }
    }
    fase(20, "Configuration phase", 1);
    fase(404, "Operation phase", 4);
  };

  /* ---------- H2018-8.4: roller og tilgangsmatrise (ingen felt i figuren) ----------
     Kilde: s. 21 (H2018-8.4.png). Brukere med piler til roller til venstre; matrise roller × objekter til høyre. */
  IN.FIGURER["H2018-8.4"] = function (host, oppg) {
    var c = F.celler(host, 2, { kol: 2 });
    var s = F.svg(c[0], { w: 300, h: 270, oppg: oppg, tittel: "Brukere og roller" });
    var brukere = ["John", "Cary", "Mary", "Walter"], ys = [50, 116, 182, 248];
    var B = brukere.map(function (n, i) { return F.boks(s, 10, ys[i] - 20, 100, 40, n, { rolle: "noytral" }); });
    var R = ["R1", "R2", "R3", "R4"].map(function (n, i) { return F.boks(s, 200, ys[i] - 20, 72, 40, n, { rolle: "uthev", kursiv: false }); });
    [[0, 0], [1, 0], [1, 1], [2, 1], [3, 2], [3, 3]].forEach(function (k) {
      F.pil(s, [[110, ys[k[0]]], [198, ys[k[1]]]]);
    });
    void B; void R;
    el("div", "font-weight:700;text-align:center;margin:.2rem 0 .3rem;", c[1], "Objects");
    F.tabell(c[1], {
      hode: ["Roles", "O1", "O2", "O3", "O4"],
      rader: [
        ["R1", "r,w", "-", "x", "r"],
        ["R2", "r", "-", "r", "r,w"],
        ["R3", "-", "x", "-", "-"],
        ["R4", "r,w", "x", "x", "x"]
      ]
    });
  };

  /* ---------- H2018-9.4: DMZ-arkitektur (ingen felt i figuren) ----------
     Kilde: s. 24 (H2018-9.4.png). Internett-sky → ytre brannmur → DMZ-buss med DNS/Web/E-post → indre brannmur →
     buss med arbeidsstasjoner, produksjonssystemer og DB-tjener. */
  IN.FIGURER["H2018-9.4"] = function (host, oppg) {
    var rull = el("div", "overflow-x:auto;max-width:100%;", host);
    var inn = el("div", "min-width:560px;max-width:860px;margin:0 auto;", rull);
    var s = F.svg(inn, { w: 890, h: 520, oppg: oppg, tittel: "DMZ-arkitektur" });
    var NETT = "#6b6bf0";
    function buss(p) { sv("path", { d: "M" + p.map(function (q) { return q.join(" "); }).join(" L"), fill: "none", stroke: NETT, "stroke-width": 6, "stroke-linejoin": "round" }, s); }
    // nettlinjer først (under symbolene)
    buss([[250, 108], [350, 108], [350, 440], [840, 440]]);
    buss([[48, 320], [48, 276], [350, 276]]);
    [142, 240].forEach(function (x) { buss([[x, 276], [x, 320]]); });
    [535, 633, 733, 838].forEach(function (x) { buss([[x, 440], [x, 400]]); });
    // sky
    sv("path", { d: "M110 150 C70 150 70 110 100 100 C95 70 140 60 160 78 C180 50 235 56 240 88 C275 92 270 140 240 142 C230 165 180 165 165 150 C150 166 120 166 110 150 z", fill: "#eef0f4", stroke: "#8a8f98", "stroke-width": 2 }, s);
    F.tekst(s, 175, 108, "Internet", { str: 22, fet: true }).setAttribute("style", "fill:" + MORK);
    // brannmurer (murstein)
    function mur(x, y) {
      var g = F.g(s);
      sv("rect", { x: x, y: y, width: 40, height: 90, fill: "#6e7178", stroke: "#3a3d42", "stroke-width": 1.5 }, g);
      for (var r = 1; r < 6; r++) sv("line", { x1: x, y1: y + r * 15, x2: x + 40, y2: y + r * 15, stroke: "#3a3d42", "stroke-width": 1.2 }, g);
      for (var k = 0; k < 6; k++) {
        var dx = k % 2 ? 13 : 26;
        sv("line", { x1: x + dx, y1: y + k * 15, x2: x + dx, y2: y + k * 15 + 15, stroke: "#3a3d42", "stroke-width": 1.2 }, g);
      }
      return g;
    }
    mur(330, 136);
    F.tekst(s, 390, 144, "External", { str: 19, anker: "start" });
    F.tekst(s, 390, 172, "Router /", { str: 19, anker: "start" });
    F.tekst(s, 390, 200, "Firewall", { str: 19, anker: "start" });
    F.tekst(s, 176, 254, "DMZ (Demilitarized Zone)", { str: 19, fet: true });
    mur(330, 314);
    F.tekst(s, 380, 324, "Internal", { str: 19, anker: "start" });
    F.tekst(s, 380, 352, "Router /", { str: 19, anker: "start" });
    F.tekst(s, 380, 380, "Firewall", { str: 19, anker: "start" });
    // tjenere
    function tjener(x, y, h) {
      var g = F.g(s);
      sv("rect", { x: x, y: y, width: 40, height: h, fill: "#e4e4dc", stroke: "#5b5f66", "stroke-width": 1.4 }, g);
      [10, 18, 26].forEach(function (d) { sv("line", { x1: x + 6, y1: y + d, x2: x + 34, y2: y + d, stroke: "#5b5f66", "stroke-width": 1.4 }, g); });
      return g;
    }
    tjener(28, 320, 82); tjener(122, 320, 82); tjener(220, 320, 82);
    [[48, "DNS"], [142, "Web"], [240, "Email"]].forEach(function (t) {
      F.tekst(s, t[0], 422, t[1], { str: 19 });
      F.tekst(s, t[0], 450, "Server", { str: 19 });
    });
    // arbeidsstasjoner
    function pc(x) {
      var g = F.g(s);
      sv("rect", { x: x - 30, y: 318, width: 60, height: 50, fill: "#e4e4dc", stroke: "#5b5f66", "stroke-width": 1.4 }, g);
      sv("rect", { x: x - 22, y: 326, width: 44, height: 32, fill: "#ffffff", stroke: "#5b5f66", "stroke-width": 1 }, g);
      sv("rect", { x: x - 44, y: 374, width: 88, height: 22, fill: "#e4e4dc", stroke: "#5b5f66", "stroke-width": 1.4 }, g);
      return g;
    }
    pc(535); pc(633);
    F.tekst(s, 600, 294, "Workstations", { str: 19 });
    tjener(713, 312, 84); tjener(818, 312, 84);
    F.tekst(s, 737, 248, "Production", { str: 19 });
    F.tekst(s, 737, 276, "Systems", { str: 19 });
    F.tekst(s, 840, 248, "DB", { str: 19 });
    F.tekst(s, 840, 276, "Server", { str: 19 });
    F.tekst(s, 636, 470, "Internal Networks", { str: 19, fet: true });
  };
})();
