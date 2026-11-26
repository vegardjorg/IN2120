/* ============================================================
   IN2120 guide · figurer/fig-h2025.js
   Eksamensfigurene fra H2025, tegnet på nytt med IN.fig (API øverst i fig-felles.js).
   Kilde: UiO, IN2120 eksamen H2025 (eksamen/in2120-2025-x-qa.pdf). Kontrollliste: plan/figurer/INVENTAR-h2025.md.

   Mal (én funksjon per oppgave; key = oppgavens key i assets/js/eksamensbank/h2025.js):
     IN.FIGURER["H2025-n"] = function (host, oppg) {
       var F = IN.fig;
       var s = F.svg(host, { w: 300, h: 200, oppg: oppg });
       // … bokser, piler, tekst. Svarfelt i figuren: F.felt(htmlNode, i) (i HTML, ikke i SVG).
     };
   Regler: tro mot arket (samme elementer, piler, etiketter, plassering), ikke røp svaret,
   tål flere kall (ingen global tilstand), temafarger via CSS-klassene i figurer.css.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FIGURER = IN.FIGURER || {};
  var F = IN.fig;
  if (!F) return;

  /* ---------- H2025-8: tre operasjonsmoduser (arket: venstre, midten, høyre; svarfelt under hvert) ----------
     Kilde: in2120-2025-x-qa.pdf s. 4, oppgave 8. Felles mål i alle tre: viewBox 310 × 205, C-raden på samme høyde
     (som på arket), nøkkelen K til venstre med en linje som grener ned i hver E. Ingen modusnavn i figuren. */
  IN.FIGURER["H2025-8"] = function (host, oppg) {
    var W = 310, H = 205, MW = 40, MH = 30, EW = 56, EH = 38, CY = 165, c = F.celler(host, 3);

    function nokkelLinje(s, y, x0, cols, ekstra, kryss) {
      var last = cols[cols.length - 1] + 16;
      F.brutt(s, y, x0, last + (ekstra || 0), kryss);
      return last;
    }
    function gren(s, x, y0, y1) { F.pil(s, [[x, y0], [x, y1]]); }
    function cBoks(s, cx, i) { F.boks(s, cx - MW / 2, CY, MW, MH, "C_" + i, { rolle: "chiffer" }); }

    /* Venstre: M → ⊕ (IV / forrige C) → E(K) → C, C kjedes videre til neste ⊕, C₃ ut til høyre. */
    (function () {
      var s = F.svg(c[0], { w: W, h: H, tittel: "Venstre diagram",
        desc: "M1, M2 og M3 øverst. M1 XOR-es med IV, M2 med C1 og M3 med C2. Resultatet går inn i E sammen med nøkkelen K, og ut kommer C1, C2 og C3. C3 har en pil videre ut til høyre." });
      var cols = [95, 180, 265], XY = 60, KY = 84, EY = 98;
      F.nokkel(s, 28, 64, { etikett: "K" });
      var kryss = cols.slice().concat([cols[0] + 42, cols[1] + 42]);
      nokkelLinje(s, KY, 40, cols, 0, kryss);
      cols.forEach(function (cx, i) {
        F.boks(s, cx - MW / 2, 6, MW, MH, "M_" + (i + 1), { rolle: "klar" });
        F.pil(s, [[cx, 6 + MH], [cx, XY - 10]]);
        F.xor(s, cx, XY, 10);
        F.pil(s, [[cx, XY + 10], [cx, EY]]);
        gren(s, cx + 16, KY, EY);
        F.boks(s, cx - EW / 2, EY, EW, EH, "E", { rolle: "funk" });
        F.pil(s, [[cx, EY + EH], [cx, CY]]);
        cBoks(s, cx, i + 1);
        if (i < 2) F.pil(s, [[cx + MW / 2, CY + MH / 2], [cx + 42, CY + MH / 2], [cx + 42, XY], [cols[i + 1] - 10, XY]]);
        else F.pil(s, [[cx + MW / 2, CY + MH / 2], [W - 4, CY + MH / 2]]);
      });
      F.tekst(s, cols[0] - 30, XY, "IV", { anker: "end", kursiv: true });
      F.pil(s, [[cols[0] - 28, XY], [cols[0] - 10, XY]]);
      F.felt(c[0], 0);
    })();

    /* Midten: T → E(K) → ⊕ ← M, ⊕ → C. */
    (function () {
      var s = F.svg(c[1], { w: W, h: H, tittel: "Midtre diagram",
        desc: "T1, T2 og T3 øverst går inn i hver sin E sammen med nøkkelen K. Utgangen fra hver E XOR-es med M1, M2 og M3, som kommer inn fra venstre. Resultatet er C1, C2 og C3." });
      var cols = [95, 185, 275], KY = 46, EY = 62, XY = 128;
      F.nokkel(s, 30, 26, { etikett: "K" });
      nokkelLinje(s, KY, 44, cols, 0, cols);
      cols.forEach(function (cx, i) {
        F.boks(s, cx - MW / 2, 4, MW, MH, "T_" + (i + 1), { rolle: "teller" });
        F.pil(s, [[cx, 4 + MH], [cx, EY]]);
        gren(s, cx + 16, KY, EY);
        F.boks(s, cx - EW / 2, EY, EW, EH, "E", { rolle: "funk" });
        F.pil(s, [[cx, EY + EH], [cx, XY - 10]]);
        F.xor(s, cx, XY, 10);
        F.boks(s, cx - 64, XY - MH / 2, MW, MH, "M_" + (i + 1), { rolle: "klar" });
        F.pil(s, [[cx - 24, XY], [cx - 10, XY]]);
        F.pil(s, [[cx, XY + 10], [cx, CY]]);
        cBoks(s, cx, i + 1);
      });
      F.felt(c[1], 1);
    })();

    /* Høyre: M → E(K) → C, ingen kobling mellom blokkene. */
    (function () {
      var s = F.svg(c[2], { w: W, h: H, tittel: "Høyre diagram",
        desc: "M1, M2 og M3 går rett inn i hver sin E sammen med nøkkelen K, og ut kommer C1, C2 og C3. Ingen XOR og ingen kobling mellom blokkene." });
      var cols = [95, 170, 245], KY = 84, EY = 98;
      F.nokkel(s, 28, 64, { etikett: "K" });
      nokkelLinje(s, KY, 40, cols, 0, cols);
      cols.forEach(function (cx, i) {
        F.boks(s, cx - MW / 2, 40, MW, MH, "M_" + (i + 1), { rolle: "klar" });
        F.pil(s, [[cx, 40 + MH], [cx, EY]]);
        gren(s, cx + 16, KY, EY);
        F.boks(s, cx - EW / 2, EY, EW, EH, "E", { rolle: "funk" });
        F.pil(s, [[cx, EY + EH], [cx, CY]]);
        cBoks(s, cx, i + 1);
      });
      F.felt(c[2], 2);
    })();
  };

  /* ---------- Lokale hjelpere (finnes ikke i IN.fig) ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function sv(tag, a, p) {
    var n = document.createElementNS(NS, tag);
    for (var k in a) if (a[k] != null) n.setAttribute(k, a[k]);
    if (p) p.appendChild(n);
    return n;
  }
  function hx(tag, a, p) {
    var n = document.createElement(tag);
    for (var k in a || {}) {
      if (a[k] == null) continue;
      if (k === "text") n.textContent = a[k]; else n.setAttribute(k, a[k]);
    }
    if (p) p.appendChild(n);
    return n;
  }
  /* F.tekst med størrelse som faktisk virker: .fig-txt i figurer.css (17px) overstyrer font-size-attributtet, så str settes som inline stil. */
  function T(s, x, y, t, o) {
    var n = F.tekst(s, x, y, t, o);
    if (o && o.str) n.style.fontSize = o.str + "px";
    return n;
  }
  function rot(n) { while (n && n.nodeName.toLowerCase() !== "svg") n = n.parentNode; return n; }
  /* Buet pil (vilkårlig path-d) med spiss i enden. */
  function bue(s, d, o) {
    var p = sv("path", { d: d, class: "fig-strek" + (o && o.klasse ? " " + o.klasse : ""), fill: "none", style: o && o.style }, s), r = rot(s);
    if (r && r._pil) p.setAttribute("marker-end", "url(#" + r._pil + ")");
    return p;
  }
  /* Sky: ellipse av buer som buler utover (med klokka, sweep 1). */
  function sky(cx, cy, rx, ry, n, fase) {
    var pts = [], i, d;
    for (i = 0; i < n; i++) {
      var t = (i / n) * 2 * Math.PI + (fase || 0);
      pts.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]);
    }
    d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (i = 0; i < n; i++) {
      var a = pts[i], b = pts[(i + 1) % n], r = Math.hypot(b[0] - a[0], b[1] - a[1]) * 0.62;
      d += " A" + r.toFixed(1) + " " + r.toFixed(1) + " 0 0 1 " + b[0].toFixed(1) + " " + b[1].toFixed(1);
    }
    return d + " Z";
  }
  /* Sikksakk fra a til b (trådløs forbindelse på tavla). */
  function sikksakk(a, b, n, amp) {
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, d = "M" + a[0] + " " + a[1];
    for (var i = 1; i < n; i++) {
      var f = i / n, s = i % 2 ? amp : -amp;
      d += " L" + (a[0] + dx * f + nx * s).toFixed(1) + " " + (a[1] + dy * f + ny * s).toFixed(1);
    }
    return d + " L" + b[0] + " " + b[1];
  }
  /* Bølget linje (WIFI på tavla). */
  function bolge(x0, x1, y, n, amp) {
    var w = (x1 - x0) / n, d = "M" + x0 + " " + y;
    for (var i = 0; i < n; i++) d += " q" + (w / 2) + " " + (i % 2 ? amp : -amp) * 2 + " " + w + " 0";
    return d;
  }
  var TEAL = "#2bb5b0", TEAL_FYLL = "rgba(43, 181, 176, 0.42)";

  /* ---------- H2025-14: PowerShell-vindu med portskanning (programnavn sladdet) ----------
     Kilde: in2120-2025-x-qa.pdf s. 8. Sladdene står som hvite felt på arket; her █-tegn i samme bredde
     (kolonnene målt i skjermbildet: 32 tegn i første linje, 5 foran «scan report»/«done», 15 i URL-en).
     Tom linje før «OS detection performed», som på arket. */
  IN.FIGURER["H2025-14"] = function (host) {
    function B(n) { return new Array(n + 1).join("\u2588"); }
    var t = F.terminal(host, [
      "Starting" + B(32) + "at 2022-09-11 13:30 Vest-Europa (sommertid)",
      B(5) + "scan report for 192.168.211.129",
      "Host is up (0.00073s latency).",
      "Not shown: 997 filtered tcp ports (no-response)",
      "PORT   STATE SERVICE",
      "21/tcp open  ftp",
      "22/tcp open  ssh",
      "80/tcp open  http",
      "MAC Address: 00:0C:29:1B:96:3B (VMware)",
      "Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port",
      "Device type: general purpose",
      "Running: Linux 4.X|5.X",
      "OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5",
      "OS details: Linux 4.15 - 5.6",
      "Network Distance: 1 hop",
      "",
      "OS detection performed. Please report any incorrect results at https://" + B(15) + "/ .",
      B(5) + "done: 1 IP address (1 host up) scanned in 47.07 seconds",
      "PS C:\\>"
    ], { tittel: "Windows PowerShell" });
    t.style.background = "#012456";   // PowerShell-blått som på arket (samme i lys og mørk modus)
  };

  /* ---------- H2025-22: lagmodellen vippet på siden (laveste lag til venstre) ----------
     Kilde: in2120-2025-x-qa.pdf s. 12. Seks kolonner med tekst rotert 90° (leses ovenfra og ned), «Internett-stakk» til høyre. */
  IN.FIGURER["H2025-22"] = function (host, oppg) {
    var s = F.svg(host, { w: 480, h: 300, oppg: oppg, maks: 560, tittel: "Internett-stakken liggende" });
    var kol = [
      ["Fysisk", 56, "var(--color-tone-ok)"], ["Link", 54, "var(--color-tone-info)"], ["Internett", 54, "var(--color-tone-info)"],
      ["Transport", 108, "var(--color-tone-info)"], ["Applikasjon", 108, "var(--color-tone-info)"], ["App", 54, TEAL_FYLL]
    ], x = 8;
    kol.forEach(function (k) {
      sv("rect", { x: x, y: 6, width: k[1], height: 288, style: "fill:" + k[2] + ";stroke:" + TEAL + ";stroke-width:2" }, s);
      var cx = x + k[1] / 2, t = T(s, cx, 130, k[0], { str: 23 });
      t.setAttribute("transform", "rotate(90 " + cx + " 130)");
      x += k[1];
    });
    var lt = T(s, x + 22, 130, "Internett-stakk", { str: 23 });
    lt.setAttribute("transform", "rotate(90 " + (x + 22) + " 130)");
  };

  /* ---------- H2025-25: passnøkkel-arkitektur med fem svarfelt i figuren ----------
     Kilde: in2120-2025-x-qa.pdf s. 15. Bred figur (≥ 700 px): feltene ligger oppå tegningen der arket har dem
     (1 på buen bruker → klient, 2 i klientboksen, 3 på buen tjener → klient øverst, 4 på buen klient → tjener nederst,
     5 øverst i tjenerboksen). Smal figur: samme figur stående (rotert en kvart runde med klokka, så «over» blir «til høyre»),
     med nummerert merke der feltet står, og feltene nummerert under. Byttes med ResizeObserver (inline stil, ingen CSS). */
  IN.FIGURER["H2025-25"] = function (host, oppg) {
    var BLA = "var(--fig-funk-fyll)";
    function person(s, cx, cy) {
      var g = sv("g", { "aria-hidden": "true" }, s);
      sv("circle", { cx: cx, cy: cy - 30, r: 17, style: "fill:" + BLA + ";stroke:var(--fig-strek);stroke-width:1" }, g);
      sv("path", { d: "M" + (cx - 36) + " " + (cy + 34) + " Q" + (cx - 34) + " " + (cy - 8) + " " + cx + " " + (cy - 8) +
        " Q" + (cx + 34) + " " + (cy - 8) + " " + (cx + 36) + " " + (cy + 34) + " Z", style: "fill:" + BLA + ";stroke:var(--fig-strek);stroke-width:1" }, g);
    }
    function laptop(s, cx, cy) {
      var g = sv("g", { "aria-hidden": "true" }, s);
      sv("rect", { x: cx - 40, y: cy - 44, width: 80, height: 54, rx: 3, style: "fill:var(--color-surface-container-high);stroke:var(--fig-strek);stroke-width:1.2" }, g);
      sv("rect", { x: cx - 34, y: cy - 38, width: 68, height: 42, style: "fill:" + BLA }, g);
      sv("path", { d: "M" + (cx - 48) + " " + (cy + 14) + " H" + (cx + 48) + " L" + (cx + 58) + " " + (cy + 28) + " H" + (cx - 58) + " Z",
        style: "fill:var(--color-surface-container-high);stroke:var(--fig-strek);stroke-width:1.2" }, g);
    }
    function tjener(s, x, y) {
      var g = sv("g", { "aria-hidden": "true" }, s);
      sv("rect", { x: x, y: y, width: 34, height: 78, rx: 2, style: "fill:var(--color-surface-container-high);stroke:var(--fig-strek);stroke-width:1.2" }, g);
      [12, 22, 32].forEach(function (dy) { sv("path", { d: "M" + (x + 5) + " " + (y + dy) + " H" + (x + 29), style: "stroke:var(--fig-strek);stroke-width:1" }, g); });
      sv("circle", { cx: x + 17, cy: y + 60, r: 3, style: "fill:var(--fig-strek)" }, g);
    }
    function blokkpil(s, pts, linjer, tx, ty, str) {
      sv("polygon", { points: pts.map(function (p) { return p.join(","); }).join(" "),
        style: "fill:var(--color-tone-ok);stroke:var(--color-on-tone-ok);stroke-width:1.4" }, s);
      linjer.forEach(function (l, i) {
        var t = T(s, tx, ty + i * (str + 6), l, { str: str });
        t.style.fill = "var(--color-on-tone-ok)";
      });
    }
    function boks(s, x, y, w, h) {
      sv("rect", { x: x, y: y, width: w, height: h, rx: 18, style: "fill:none;stroke:var(--fig-strek);stroke-width:2.2" }, s);
    }
    function merke(s, x, y, n) {
      var g = sv("g", {}, s);
      sv("circle", { cx: x, cy: y, r: 13, style: "fill:var(--color-surface-container-lowest);stroke:var(--color-primary);stroke-width:2;stroke-dasharray:3 2" }, g);
      T(g, x, y, String(n), { fet: true, str: 16 });
    }

    /* Bred variant: viewBox 1000 × 360. Feltposisjoner (senter x, y, bredde) i viewBox-enheter. */
    var W = 1000, H = 360, SLOT = [[225, 80, 180], [475, 158, 180], [712, 78, 180], [712, 322, 180], [911, 140, 160]];
    var bred = hx("div", { style: "position:relative;width:100%" }, host);
    var sb = F.svg(bred, { w: W, h: H, oppg: oppg, tittel: "Passnøkkel-arkitektur" });
    T(sb, 55, 112, "Bruker", { str: 22 });
    person(sb, 55, 200);
    blokkpil(sb, [[108, 175], [310, 175], [310, 152], [352, 210], [310, 268], [310, 245], [108, 245]], ["Bruker autentiserer", "til klient"], 212, 197, 18);
    bue(sb, "M98 150 C140 55 312 50 362 142");
    boks(sb, 362, 100, 228, 220);
    T(sb, 476, 82, "Klient", { str: 22 });
    laptop(sb, 476, 258);
    blokkpil(sb, [[600, 175], [785, 175], [785, 152], [824, 210], [785, 268], [785, 245], [600, 245]], ["Klient autentiserer", "til tjener"], 694, 197, 18);
    bue(sb, "M832 150 C800 48 640 44 594 140");
    bue(sb, "M592 280 C640 348 790 350 830 288");
    boks(sb, 830, 100, 165, 220);
    T(sb, 995, 82, "Autentiseringstjenere", { str: 17, anker: "end" });
    tjener(sb, 838, 205); tjener(sb, 895, 205); tjener(sb, 952, 205);
    var lag = hx("div", { style: "position:absolute;inset:0;pointer-events:none" }, bred);

    /* Smal variant: viewBox 340 × 745, stående. */
    var smal = hx("div", { style: "width:100%;display:flex;flex-direction:column;align-items:center;gap:.6rem" }, host);
    var ss = F.svg(smal, { w: 340, h: 745, oppg: oppg, maks: 380, tittel: "Passnøkkel-arkitektur (stående)" });
    T(ss, 110, 16, "Bruker", { str: 20 });
    person(ss, 110, 82);
    blokkpil(ss, [[20, 128], [200, 128], [200, 205], [222, 205], [110, 242], [-2, 205], [20, 205]], ["Bruker autentiserer", "til klient"], 110, 152, 17);
    bue(ss, "M160 66 C318 70 330 220 268 260");
    merke(ss, 304, 160, 1);
    T(ss, 152, 254, "Klient", { str: 20, anker: "start" });
    boks(ss, 20, 268, 300, 172);
    merke(ss, 170, 300, 2);
    laptop(ss, 170, 390);
    blokkpil(ss, [[80, 450], [260, 450], [260, 522], [282, 522], [170, 560], [58, 522], [80, 522]], ["Klient autentiserer", "til tjener"], 170, 473, 17);
    bue(ss, "M300 612 C340 570 340 490 300 446");
    merke(ss, 322, 528, 3);
    bue(ss, "M40 444 C0 490 0 570 40 610");
    merke(ss, 18, 528, 4);
    T(ss, 170, 584, "Autentiseringstjenere", { str: 18 });
    boks(ss, 20, 602, 300, 138);
    merke(ss, 170, 630, 5);
    tjener(ss, 93, 652); tjener(ss, 153, 652); tjener(ss, 213, 652);
    var liste = hx("div", { style: "width:100%;display:flex;flex-direction:column;align-items:center;gap:.4rem" }, smal);

    var ph = SLOT.map(function (sl, i) { return F.felt(null, i, { etikett: String(i + 1) }); });
    var modus = null;
    function sett(m) {
      if (m === modus) return;
      modus = m;
      bred.style.display = m === "bred" ? "" : "none";
      smal.style.display = m === "bred" ? "none" : "flex";
      ph.forEach(function (p, i) {
        var sl = SLOT[i], et = p.querySelector(".fig-felt-et");
        if (m === "bred") {
          p.style.cssText = "position:absolute;pointer-events:auto;max-width:none;min-height:0;transform:translate(-50%,-50%);" +
            "left:" + (sl[0] / W * 100) + "%;top:" + (sl[1] / H * 100) + "%;width:" + (sl[2] / W * 100) + "%";
          if (et) et.style.display = "none";
          lag.appendChild(p);
        } else {
          p.style.cssText = "";
          if (et) et.style.display = "";
          liste.appendChild(p);
        }
      });
    }
    // ResizeObserver fanger også at kortet åpnes/lukkes; resize + setTimeout er reserve. Lytteren fjernes når figuren er byttet ut.
    var vist = false;
    function maal() {
      if (host.isConnected) vist = true;
      else if (vist) { window.removeEventListener("resize", maal); return; }
      var w = host.clientWidth;
      if (w) sett(w >= 700 ? "bred" : "smal");
    }
    sett("smal");
    if (window.ResizeObserver) new ResizeObserver(maal).observe(host);
    window.addEventListener("resize", maal);
    setTimeout(maal, 0);
  };

  /* ---------- H2025-28: PDCA-syklus + kapitteltabell ----------
     Kilde: in2120-2025-x-qa.pdf s. 17. Venstre: ring med ACT (øverst venstre), PLAN (øverst høyre), DO (nede høyre),
     CHECK (nede venstre), bokstavsirkler A/P/D/C i de indre hjørnene, «ISMS PDCA-syklus» i midten. Høyre: tabellen. */
  IN.FIGURER["H2025-28"] = function (host, oppg) {
    var c = F.celler(host, 2, { kol: 2 });
    var s = F.svg(c[0], { w: 340, h: 300, oppg: oppg, tittel: "ISMS PDCA-syklus" });
    sv("circle", { cx: 170, cy: 150, r: 112, style: "fill:none;stroke:" + TEAL + ";stroke-width:15" }, s);
    sv("circle", { cx: 170, cy: 150, r: 60, style: "fill:var(--color-tone-info);stroke:" + TEAL + ";stroke-width:2" }, s);
    ["ISMS", "PDCA-", "syklus"].forEach(function (l, i) { T(s, 170, 124 + i * 25, l, { str: 20 }); });
    [["ACT", 4, 4, "A", 116, 98], ["PLAN", 236, 4, "P", 224, 98], ["CHECK", 4, 216, "C", 116, 202], ["DO", 236, 216, "D", 224, 202]].forEach(function (b) {
      F.boks(s, b[1], b[2], 100, 80, b[0], { rolle: "funk", r: 1 });
      sv("circle", { cx: b[4], cy: b[5], r: 13, style: "fill:var(--color-surface-container-lowest);stroke:var(--fig-strek);stroke-width:1.4" }, s);
      T(s, b[4], b[5], b[3], { fet: true, str: 15 });
    });
    var t = oppg.figur && oppg.figur.tekst || [], rader = [];
    for (var i = 0; i < 5; i++) rader.push([t[i] || "", t[i + 5] || ""]);
    c[1].style.alignSelf = "center";
    F.tabell(c[1], { tittel: "Kapitlene i ISO/IEC 27001 ISMS - Krav", rader: rader });
  };

  /* ---------- H2025-37: nettsiden (bilde 1) og tavletegningen av nettverket (bilde 2) ----------
     Kilde: in2120-2025-x-qa.pdf s. 22. Bilde 1 som HTML-panel (skjermbilde, ikke SVG-kunst).
     Bilde 2 i to halvdeler (BOB INC | INTERNETT + Stines nett) så teksten er lesbar ved 360 px; halvdelene står side om side
     når figuren er bred, og under hverandre når den er smal. Linja fra FW går ut av høyre kant og inn i venstre kant.
     KJERSTI er koblet med sikksakk (trådløst), som på tavla. JØRGEN står rett over TOMAS. Krusedull øverst til høyre i INTERNETT-skyen. */
  IN.FIGURER["H2025-37"] = function (host, oppg) {
    var cap = "font-size:.8rem;color:var(--color-on-surface-variant);margin:.2rem 0 .35rem";
    hx("p", { style: cap, text: "Bilde 1: nettsiden" }, host);
    var web = hx("div", { "aria-label": "Skjermbilde av nettsiden",
      style: "border:1px solid var(--color-outline);border-radius:8px;background:var(--color-surface-container-lowest);color:var(--color-on-surface);padding:1rem .8rem;text-align:center;margin-bottom:1rem" }, host);
    hx("div", { style: "font-size:1.15rem;margin-bottom:.7rem", text: "Vi analyserer passordet ditt og forteller deg om det er sikkert" }, web);
    hx("div", { style: "font-weight:700;margin-bottom:.6rem", text: "Tast inn passordet ditt i boksen" }, web);
    hx("div", { style: "text-align:left;border:1px solid var(--color-outline-variant);border-radius:6px;padding:.6rem .8rem;max-width:30rem;margin:0 auto 1.1rem;font-size:.85rem;overflow-wrap:anywhere",
      text: "DettePassordetErLangtSomEtVondtÅr688AS%!@" }, web);
    hx("div", { style: "font-size:1.15rem", text: "Passordet ditt er sterkt, fortsett sånn!" }, web);

    hx("p", { style: cap, text: "Bilde 2: tegning av nettverket (tavle)" }, host);
    var c = F.celler(host, 2, { kol: 2 }), TUSJ = "var(--color-primary)", HAND = "font-family:'Segoe Print','Bradley Hand','Comic Sans MS',cursive;fill:" + TUSJ;
    function strek(s, d, ekstra) { return sv("path", { d: d, style: "fill:none;stroke:" + TUSJ + ";stroke-width:2;stroke-linejoin:round;stroke-linecap:round" + (ekstra || "") }, s); }
    function tekst(s, x, y, t, str, o) {
      var n = F.tekst(s, x, y, t, { anker: o && o.anker });
      n.setAttribute("style", HAND + ";font-size:" + (str || 18) + "px");
      return n;
    }
    function boks(s, x, y, w, h, t, str) {
      sv("rect", { x: x, y: y, width: w, height: h, rx: 2, style: "fill:none;stroke:" + TUSJ + ";stroke-width:2" }, s);
      if (t) tekst(s, x + w / 2, y + h / 2, t, str);
      return { x: x, y: y, w: w, h: h, cx: x + w / 2, cy: y + h / 2, b: y + h, r: x + w };
    }
    function halv(celle, tittel, desc) {
      var s = F.svg(celle, { w: 520, h: 352, tittel: tittel, desc: desc });   // plass til skyas buer nederst
      s.style.maxWidth = "520px";
      return s;
    }

    /* Halvdelene møtes uten mellomrom når de står side om side, så linja FW → INTERNETT er sammenhengende. */
    c[0].parentNode.style.columnGap = "0";
    c[0].style.alignItems = "flex-end"; c[1].style.alignItems = "flex-start";

    /* Venstre halvdel: BOB INC */
    var L = halv(c[0], "Tavletegning, venstre del: BOB INC",
      "Skyen BOB INC. BOB er koblet til EMMA under seg, og med en bølget linje merket WIFI til TERMINAL SERVER. KJERSTI, over til venstre, har en sikksakklinje (trådløs) ned mot BOB og wifi-forbindelsen. TERMINAL SERVER er koblet til SWITCH, som er koblet til FW ytterst i skyen. Over SWITCH står TOMAS, koblet til SWITCH, og rett over TOMAS står JØRGEN, koblet til TOMAS. Fra FW går en linje videre til INTERNETT.");
    strek(L, sky(262, 198, 236, 126, 15, 0.2));
    tekst(L, 150, 30, "BOB INC", 30);
    var kj = boks(L, 90, 96, 100, 34, "KJERSTI");
    var bob = boks(L, 18, 178, 58, 34, "BOB");
    var em = boks(L, 22, 252, 74, 32, "EMMA");
    var ts = boks(L, 128, 160, 60, 124);
    [["TERMINAL", 168], ["SERVER", 148]].forEach(function (p) {
      var t = tekst(L, p[1], ts.cy, p[0], 18);
      t.setAttribute("transform", "rotate(90 " + p[1] + " " + ts.cy + ")");
    });
    strek(L, sikksakk([kj.x + 8, kj.b], [bob.r - 2, bob.y - 2], 9, 5));
    strek(L, bolge(bob.r, ts.x, 195, 4, 3.5));
    tekst(L, 102, 172, "WIFI", 18);
    strek(L, "M" + 47 + " " + bob.b + " V" + em.y);
    var sw = boks(L, 226, 178, 92, 34, "SWITCH");
    strek(L, "M" + ts.r + " 195 H" + sw.x);
    var to = boks(L, 226, 108, 96, 38, "TOMAS", 19);
    strek(L, "M273 " + to.b + " V" + sw.y);
    var jo = boks(L, 228, 60, 90, 32, "JØRGEN");
    strek(L, "M273 " + jo.b + " V" + to.y);
    var fw = boks(L, 344, 174, 80, 42, "FW", 22);
    strek(L, "M" + sw.r + " 195 H" + fw.x);
    strek(L, "M" + fw.r + " 195 H520");

    /* Høyre halvdel: INTERNETT og Stines nett */
    var R = halv(c[1], "Tavletegning, høyre del: INTERNETT og Stines nett",
      "Linja fra Bobs FW kommer inn fra venstre til GUNNAR midt i skyen INTERNETT, som all trafikk går gjennom. Fra GUNNAR går linja til FW i høyre sky, som er koblet til SWITCH, som er koblet til STINE (serveren). Over SWITCH står FRANK, koblet til SWITCH, og over FRANK står MATIAS, koblet til FRANK.");
    strek(R, sky(104, 205, 88, 70, 9, 0.4));
    tekst(R, 96, 114, "INTERNETT", 21);
    strek(R, "M186 100 q6 6 0 12 q-6 6 0 12 q6 6 0 12 q-6 6 0 12");
    var gu = boks(R, 48, 180, 108, 34, "GUNNAR");
    strek(R, "M0 195 H" + gu.x);
    strek(R, sky(364, 184, 140, 146, 16, 0.1));
    var fw2 = boks(R, 232, 181, 46, 30, "FW");
    strek(R, "M" + gu.r + " 196 H" + fw2.x);
    var sw2 = boks(R, 298, 179, 92, 34, "SWITCH");
    strek(R, "M" + fw2.r + " 196 H" + sw2.x);
    var st = boks(R, 412, 177, 80, 38, "STINE", 19);
    strek(R, "M" + sw2.r + " 196 H" + st.x);
    var fr = boks(R, 300, 108, 84, 36, "FRANK");
    strek(R, "M342 " + fr.b + " V" + sw2.y);
    var ma = boks(R, 296, 58, 96, 32, "MATIAS");
    strek(R, "M342 " + ma.b + " V" + fr.y);
  };
})();
