/* ============================================================
   IN2120 guide · figurer/fig-h2019.js
   Eksamensfigurene fra H2019, tegnet på nytt med IN.fig (API øverst i fig-felles.js).
   Kilde: UiO, IN2120 eksamen H2019 (eksamen/in2120-2019-x-qa.pdf). Kontrollliste: plan/figurer/INVENTAR-h2019.md.
   Regler: tro mot arket, ikke røp svaret, tål flere kall, temafarger via CSS-variabler.
   Lokale hjelpere: el(tag, css, parent, tekst), sv(tag, attrs, parent) (kopiert fra fig-h2021.js).
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FIGURER = IN.FIGURER || {};
  var F = IN.fig;
  if (!F) return;
  var NS = "http://www.w3.org/2000/svg";

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
  function txt(parent, x, y, t, o) {
    o = o || {};
    var n = sv("text", { x: x, y: y, "text-anchor": o.anker || "middle", "dominant-baseline": "middle",
      "font-size": o.str || 14, "font-weight": o.fet ? 700 : null,
      style: "fill:" + (o.farge || "currentColor") }, parent);
    n.textContent = t;
    return n;
  }

  /* ---------- H2019-4.5: DMZ mellom to brannmurer (ingen felt i figuren) ----------
     Kilde: s. 12. Sky «Internet», ytre brannmur, DMZ-buss mot venstre med tre «?», indre brannmur,
     intern buss mot høyre med tre «?». Blå linjer. */
  IN.FIGURER["H2019-4.5"] = function (host, oppg) {
    var s = F.svg(host, { w: 440, h: 362, oppg: oppg, maks: 520, tittel: "DMZ mellom to brannmurer",
      desc: "Internett, ytre brannmur, DMZ med tre ukjente systemer, indre brannmur, interne nett med tre ukjente systemer." });
    var BLA = "#2f7fd1";
    function linje(d, b) { sv("path", { d: d, fill: "none", stroke: BLA, "stroke-width": b || 5, "stroke-linecap": "round" }, s); }
    function mur(x, y) {
      sv("rect", { x: x - 24, y: y - 16, width: 48, height: 32, rx: 3, fill: "#c8553d", stroke: "#7a2e1f", "stroke-width": 1.5 }, s);
      [y - 5, y + 6].forEach(function (yy) { sv("line", { x1: x - 24, y1: yy, x2: x + 24, y2: yy, stroke: "#f3d6cc", "stroke-width": 1.2 }, s); });
      [[x - 8, y - 16, y - 5], [x + 10, y - 16, y - 5], [x, y - 5, y + 6], [x - 14, y + 6, y + 16], [x + 14, y + 6, y + 16]].forEach(function (l) {
        sv("line", { x1: l[0], y1: l[1], x2: l[0], y2: l[2], stroke: "#f3d6cc", "stroke-width": 1.2 }, s);
      });
    }
    function sporsmal(x, y) {
      sv("rect", { x: x - 26, y: y - 18, width: 52, height: 36, rx: 4, style: "fill:var(--fig-bg);stroke:var(--fig-strek)", "stroke-width": 1.5 }, s);
      txt(s, x, y + 1, "?", { str: 20, fet: true });
    }
    // Sky
    sv("path", { d: "M40 62 a22 22 0 0 1 24 -30 a28 28 0 0 1 52 -4 a22 22 0 0 1 30 26 a18 18 0 0 1 -8 34 h-92 a18 18 0 0 1 -6 -26 z",
      style: "fill:var(--color-surface-container-low);stroke:var(--fig-strek)", "stroke-width": 1.8 }, s);
    txt(s, 92, 62, "Internet", { fet: true, str: 15 });
    // Ytre brannmur
    linje("M150 62 H250 V96");
    mur(250, 112);
    txt(s, 282, 112, "External Router / Firewall", { anker: "start", str: 13 });
    linje("M250 128 V176");
    // DMZ-buss mot venstre
    linje("M250 176 H40");
    txt(s, 145, 164, "DMZ (Demilitarized Zone)", { str: 13, fet: true });
    [70, 135, 200].forEach(function (x) { linje("M" + x + " 176 V196", 3); sporsmal(x, 214); });
    linje("M250 176 V242");
    mur(250, 258);
    txt(s, 282, 258, "Internal Router / Firewall", { anker: "start", str: 13 });
    linje("M250 274 V334");
    // Intern buss mot høyre
    linje("M250 334 H436");
    txt(s, 360, 350, "Internal Networks", { str: 13, fet: true });
    [304, 358, 412].forEach(function (x) { linje("M" + x + " 334 V320", 3); sporsmal(x, 302); });
  };

  /* ---------- H2019-6.1: trusseltre (4 D-felt) ----------
     Kilde: s. 15. Rot (felt 0) → OR → to AND-prikker → fire løv: felt 1, 2, 3 og ferdig utfylt «Remote login as user». */
  IN.FIGURER["H2019-6.1"] = function (host, oppg) {
    var wrap = el("div", "width:100%;max-width:640px;margin:0 auto;", host);
    var boks = "box-sizing:border-box;border:2.5px solid var(--fig-strek);border-radius:6px;background:var(--fig-bg);padding:6px 3px;min-height:54px;display:flex;align-items:center;justify-content:center;";
    function tilpass(ph) {
      /* Smale løv (mobil): nedtrekket kutter valget, så valgt tekst vises også under feltet. */
      var vis = null;
      function oppdater(x) {
        if (!vis) return;
        var t = x.selectedIndex > 0 ? x.options[x.selectedIndex].text : "";
        vis.textContent = t;
        vis.style.display = t && x.clientWidth && x.clientWidth < 150 ? "block" : "none";
      }
      function f() {
        var x = ph.querySelector("select");
        if (!x || x._tilpasset) return;
        x._tilpasset = true;
        x.style.width = "100%"; x.style.minWidth = "0";
        if (ph.parentNode && ph.parentNode.parentNode && ph.parentNode.parentNode.style.display === "grid") {
          ph.parentNode.style.flexDirection = "column";
          vis = el("div", "display:none;font-size:.72rem;line-height:1.15;text-align:center;overflow-wrap:anywhere;margin-top:4px;", ph.parentNode);
          vis.setAttribute("aria-hidden", "true");
          ["change", "input", "blur"].forEach(function (ev) { x.addEventListener(ev, function () { oppdater(x); }); });
          window.addEventListener("resize", function () { oppdater(x); });
          oppdater(x);
        }
      }
      if (window.MutationObserver) new MutationObserver(f).observe(ph, { childList: true });
      f();
    }
    var rot = el("div", "display:flex;justify-content:center;", wrap);
    var rb = el("div", boks + "width:min(260px,60%);", rot);
    tilpass(F.felt(rb, 0));
    var s = F.svg(wrap, { w: 400, h: 96, oppg: oppg, tittel: "Trusseltre: forgreninger",
      desc: "Fra roten går to piler (OR) ned til to AND-prikker; hver AND-prikk har to piler ned til to noder." });
    s.style.maxWidth = "none";
    s.style.display = "block";
    var X = [50, 150, 250, 350];
    function pil(x1, y1, x2, y2) {
      sv("line", { x1: x1, y1: y1, x2: x2, y2: y2, style: "stroke:var(--fig-strek)", "stroke-width": 1.8 }, s);
      var v = Math.atan2(y2 - y1, x2 - x1), L = 9, B = 4.5;
      sv("path", { d: "M" + x2 + " " + y2 + " L" + (x2 - L * Math.cos(v) + B * Math.sin(v)) + " " + (y2 - L * Math.sin(v) - B * Math.cos(v)) +
        " L" + (x2 - L * Math.cos(v) - B * Math.sin(v)) + " " + (y2 - L * Math.sin(v) + B * Math.cos(v)) + " z", style: "fill:var(--fig-strek)" }, s);
    }
    pil(200, 2, 100, 38); pil(200, 2, 300, 38);
    txt(s, 200, 30, "OR", { fet: true, str: 14 });
    [100, 300].forEach(function (x) { sv("circle", { cx: x, cy: 42, r: 5, style: "fill:var(--fig-strek)" }, s); });
    txt(s, 82, 44, "AND", { anker: "end", fet: true, str: 14 });
    txt(s, 318, 44, "AND", { anker: "start", fet: true, str: 14 });
    pil(100, 46, X[0], 94); pil(100, 46, X[1], 94); pil(300, 46, X[2], 94); pil(300, 46, X[3], 94);
    var rad = el("div", "display:grid;grid-template-columns:repeat(4,1fr);gap:6px;", wrap);
    for (var i = 1; i <= 3; i++) tilpass(F.felt(el("div", boks, rad), i));
    el("div", boks.replace("2.5px solid var(--fig-strek)", "1.2px solid var(--color-outline)") +
      "background:var(--color-surface-container-low);text-align:center;font-size:.9rem;", rad, "Remote login as user");
  };

  /* ---------- H2019-8.1: IAM-faser 1–6 (ingen felt i figuren) ----------
     Kilde: s. 21. To rammer (konfigurering/bruk), grønt stiplet bånd «Identity Management» (1, 2 | 4, 5),
     gult stiplet bånd «Access Management» (3 | 6); piler 1→2→3 og 4→5→6. */
  IN.FIGURER["H2019-8.1"] = function (host, oppg) {
    var s = F.svg(host, { w: 460, h: 340, oppg: oppg, maks: 560, tittel: "IAM: konfigureringsfase og bruksfase",
      desc: "To faser med tre nummererte steg hver; steg 1, 2, 4 og 5 i identitetshåndtering, steg 3 og 6 i tilgangshåndtering." });
    // Bånd
    sv("rect", { x: 6, y: 52, width: 448, height: 170, rx: 10, fill: "rgba(76,175,80,.14)", stroke: "#3c9a40", "stroke-width": 2, "stroke-dasharray": "7 5" }, s);
    sv("rect", { x: 6, y: 232, width: 448, height: 96, rx: 10, fill: "rgba(240,200,40,.18)", stroke: "#c9a400", "stroke-width": 2, "stroke-dasharray": "7 5" }, s);
    txt(s, 230, 137, "Identity", { fet: true, str: 13, farge: "#3c9a40" });
    txt(s, 230, 153, "Management", { fet: true, str: 13, farge: "#3c9a40" });
    txt(s, 230, 272, "Access", { fet: true, str: 13, farge: "#b08f00" });
    txt(s, 230, 288, "Management", { fet: true, str: 13, farge: "#b08f00" });
    // Rammer
    [[20, "Configuration phase"], [280, "Operation phase"]].forEach(function (r) {
      sv("rect", { x: r[0], y: 30, width: 160, height: 306, rx: 18, fill: "none", style: "stroke:var(--fig-strek)", "stroke-width": 2.5 }, s);
      txt(s, r[0] + 80, 14, r[1], { fet: true, str: 14 });
    });
    function steg(x, y, n, fyll) {
      sv("rect", { x: x - 55, y: y - 20, width: 110, height: 40, rx: 4, fill: fyll, stroke: "#555", "stroke-width": 1.2 }, s);
      txt(s, x, y + 1, String(n), { fet: true, str: 17, farge: "#222" });
    }
    function pil(x, y1, y2) {
      sv("path", { d: "M" + (x - 8) + " " + y1 + " H" + (x + 8) + " V" + (y2 - 10) + " H" + (x + 15) + " L" + x + " " + y2 + " L" + (x - 15) + " " + (y2 - 10) + " H" + (x - 8) + " z",
        fill: "#bfe7f8", stroke: "#4f8fb3", "stroke-width": 1.2 }, s);
    }
    [[100, "#d9d9d9", 1], [360, "#d8cff3", 4]].forEach(function (k) {
      steg(k[0], 92, k[2], k[1]); pil(k[0], 112, 162);
      steg(k[0], 182, k[2] + 1, k[1]); pil(k[0], 202, 260);
      steg(k[0], 280, k[2] + 2, k[1]);
    });
  };
})();
