/* ============================================================
   IN2120 guide · figurer/fig-h2023.js
   Eksamensfigurene fra H2023, tegnet på nytt med IN.fig (API øverst i fig-felles.js).
   Kilde: UiO, IN2120 eksamen H2023 (eksamen/in2120-2023-x-qa.pdf). Kontrollliste: plan/figurer/INVENTAR-h2023.md.

   Mal (én funksjon per oppgave; key = oppgavens key i assets/js/eksamensbank/h2023.js):
     IN.FIGURER["H2023-n"] = function (host, oppg) { … };
   Regler: tro mot arket (samme elementer, piler, etiketter, plassering), ikke røp svaret,
   tål flere kall (ingen global tilstand), temafarger via CSS-variabler.

   Lokale hjelpere (bare i denne fila):
     flate(host, { w, h, min?, maks?, oppg, tittel?, desc? }) → { plate, svg, w, h }
       SVG i en posisjonert plate, så svarfelt kan legges OPPÅ tegningen der arket har dem.
       min (px): plata blir aldri smalere enn dette; da ruller figuren vannrett i sin egen boks
       (siden ruller ikke). Brukes for brede diagrammer som ellers får for liten tekst ved 360 px.
     plass(f, i, x, y, w) → div.fig-felt: plassholder for felt i, venstre kant x, midtlinje y, bredde w (viewBox-enheter).
     E(tag, attrs, parent): rått SVG-element. attrs.style kan bruke CSS-variabler (fill: var(--…)).
     blokkPil(parent, x0, y0, x1, y1, { b, hb, hl, dobbel, fyll }): tykk «blokkpil» som på arket.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FIGURER = IN.FIGURER || {};
  var F = IN.fig;
  if (!F) return;
  var NS = "http://www.w3.org/2000/svg";

  function E(tag, a, p) {
    var n = document.createElementNS(NS, tag);
    for (var k in a || {}) if (a[k] != null) n.setAttribute(k, a[k]);
    if (p) p.appendChild(n);
    return n;
  }
  function H(tag, a, p) {
    var n = document.createElement(tag);
    for (var k in a || {}) {
      if (a[k] == null) continue;
      if (k === "text") n.textContent = a[k]; else n.setAttribute(k, a[k]);
    }
    if (p) p.appendChild(n);
    return n;
  }

  var CSS =
    ".h23-rull{overflow-x:auto;max-width:100%;padding-bottom:2px}" +
    ".h23-plate{position:relative;margin:0 auto;width:100%}" +
    ".h23-plate>.fig-tegning{max-width:none}" +
    ".h23-plate>.fig-felt{position:absolute;min-height:1.7rem;max-width:none;justify-content:flex-start;transform:translateY(-50%)}" +
    ".h23-plate>.fig-felt .insp-t,.h23-plate>.fig-felt .insp-sel{min-width:0;width:100%;max-width:none}" +
    ".h23-plate>.fig-felt .insp-sel{padding-left:3px;padding-right:0}" +
    ".h23-tre{border:1px solid var(--color-outline);border-radius:4px;max-width:34rem;margin:.4rem auto;font-size:.95rem;overflow:hidden}" +
    ".h23-tre>div{padding:.45rem .6rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".h23-tre>div:first-child{background:var(--color-surface-container-high)}" +
    ".h23-tre .h23-pil{display:inline-block;width:1.1em;color:var(--color-on-surface-variant);font-size:.75em}";

  function stil(host) {
    if (host.querySelector && host.querySelector("style.h23-stil")) return;
    H("style", { class: "h23-stil", text: CSS }, host);
  }

  function flate(host, o) {
    stil(host);
    var ytre = host;
    if (o.min) { ytre = H("div", { class: "h23-rull", tabindex: "0", role: "group", "aria-label": (o.tittel || "Figur") + " (kan rulles sidelengs)" }, host); }
    var plate = H("div", { class: "h23-plate" }, ytre);
    if (o.min) plate.style.minWidth = o.min + "px";
    plate.style.maxWidth = (o.maks || Math.round(o.w * 1.05)) + "px";
    var svg = F.svg(plate, { w: o.w, h: o.h, oppg: o.oppg, tittel: o.tittel, desc: o.desc });
    return { plate: plate, svg: svg, w: o.w, h: o.h };
  }

  function plass(f, i, x, y, w) {
    var ph = F.felt(f.plate, i);
    ph.style.left = (x / f.w * 100) + "%";
    ph.style.top = (y / f.h * 100) + "%";
    ph.style.width = (w / f.w * 100) + "%";
    return ph;
  }

  function blokkPil(p, x0, y0, x1, y1, o) {
    o = o || {};
    var dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var b = (o.b || 12) / 2, hb = (o.hb || 26) / 2, hl = o.hl || 14;
    function P(t, s) { return (x0 + ux * t + nx * s).toFixed(1) + "," + (y0 + uy * t + ny * s).toFixed(1); }
    var pts = o.dobbel
      ? [P(0, 0), P(hl, hb), P(hl, b), P(L - hl, b), P(L - hl, hb), P(L, 0), P(L - hl, -hb), P(L - hl, -b), P(hl, -b), P(hl, -hb)]
      : [P(0, b), P(L - hl, b), P(L - hl, hb), P(L, 0), P(L - hl, -hb), P(L - hl, -b), P(0, -b)];
    return E("polygon", { points: pts.join(" "),
      style: "fill:" + (o.fyll || "var(--color-secondary-container)") + ";stroke:var(--color-on-surface-variant);stroke-width:1.2;stroke-linejoin:round" }, p);
  }

  /* F.tekst med str som faktisk virker: .fig-txt i figurer.css setter font-size: 17px, som overstyrer
     SVG-attributtet font-size. Her settes størrelsen som inline style. */
  function tx(p, x, y, t, o) {
    var n = F.tekst(p, x, y, t, o);
    if (o && o.str) n.style.fontSize = o.str + "px";
    return n;
  }

  function rekt(p, x, y, w, h, st, rx) {
    return E("rect", { x: x, y: y, width: w, height: h, rx: rx || 0, style: st }, p);
  }
  var HVIT = "fill:var(--color-surface-container-lowest);stroke:var(--color-outline);stroke-width:1.2";

  /* ---------- H2023-1: tre bilder (grensemerke, stillas, piggtrådgjerde), felt øverst til venstre i hvert ----------
     Kilde: s. 2. Fotografiene er tegnet som enkle motiver; bildeteksten under som på arket. */
  IN.FIGURER["H2023-1"] = function (host, oppg) {
    stil(host);
    var c = F.celler(host, 3), W = 300, Hh = 250, BH = 215;
    var tekster = ["grensemerke", "stillas", "piggtrådgjerde"];
    var beskr = [
      "Bilde: en metallbolt med rundt hode slått ned i bakken (grensemerke).",
      "Bilde: et byggestillas med plankegulv og rekkverk foran en husvegg.",
      "Bilde: et høyt gjerde med kveiler av piggtråd på toppen."
    ];
    var STREK = "stroke:var(--color-on-surface-variant);stroke-width:1.4";
    var MET = "fill:var(--color-outline-variant);" + STREK;

    function motiv(s, i) {
      // bakgrunn (himmel / vegg) og bildekant
      rekt(s, 0, 0, W, BH, "fill:var(--color-tone-info);stroke:var(--color-outline);stroke-width:1");
      if (i === 0) {
        rekt(s, 30, 70, 240, 70, "fill:var(--color-surface-container-lowest);opacity:.8");
        [60, 100, 200, 240].forEach(function (x) { rekt(s, x, 85, 14, 40, "fill:var(--color-outline-variant)"); });
        rekt(s, 0, 160, W, BH - 160, "fill:var(--color-tone-ok)");
        E("path", { d: "M70 215 Q110 175 150 182 Q195 172 235 215 Z", style: "fill:var(--color-tone-caution);" + STREK }, s);
        rekt(s, 141, 92, 18, 100, MET, 3);
        E("ellipse", { cx: 150, cy: 92, rx: 44, ry: 12, style: MET }, s);
        rekt(s, 106, 66, 88, 26, MET);
        E("ellipse", { cx: 150, cy: 66, rx: 44, ry: 12, style: MET }, s);
        E("line", { x1: 106, y1: 66, x2: 106, y2: 92, style: STREK }, s);
        E("line", { x1: 194, y1: 66, x2: 194, y2: 92, style: STREK }, s);
      } else if (i === 1) {
        rekt(s, 0, 0, W, BH, "fill:var(--color-surface-container-high)");
        var ROR = "stroke:var(--color-on-surface-variant);stroke-width:4;stroke-linecap:round";
        var TYN = "stroke:var(--color-on-surface-variant);stroke-width:2";
        [20, 150, 280].forEach(function (x) { E("line", { x1: x, y1: 0, x2: x, y2: BH, style: ROR }, s); });
        [70, 140, 205].forEach(function (y) {
          rekt(s, 6, y, W - 12, 9, "fill:var(--color-tone-caution);stroke:var(--color-on-surface-variant);stroke-width:1");
          E("line", { x1: 6, y1: y - 28, x2: W - 6, y2: y - 28, style: TYN }, s);
          E("line", { x1: 6, y1: y - 14, x2: W - 6, y2: y - 14, style: TYN }, s);
        });
        E("line", { x1: 20, y1: 140, x2: 150, y2: 79, style: TYN }, s);
        E("line", { x1: 150, y1: 205, x2: 280, y2: 149, style: TYN }, s);
      } else {
        rekt(s, 0, 150, W, BH - 150, "fill:var(--color-tone-ok)");
        var GJ = "stroke:var(--color-on-surface);stroke-width:1";
        for (var x = 8; x < W; x += 12) E("line", { x1: x, y1: 70, x2: x, y2: BH, style: GJ }, s);
        [70, 120, 170].forEach(function (y) { E("line", { x1: 0, y1: y, x2: W, y2: y, style: "stroke:var(--color-on-surface);stroke-width:2.5" }, s); });
        [30, 140, 250].forEach(function (x) { rekt(s, x, 55, 12, BH - 55, "fill:var(--color-on-surface)"); });
        for (var k = 0; k < 9; k++) {
          E("ellipse", { cx: 8 + k * 36, cy: 42, rx: 22, ry: 26, style: "fill:none;stroke:var(--color-on-surface-variant);stroke-width:1.6" }, s);
        }
      }
      E("title", {}, s).textContent = beskr[i];
    }

    tekster.forEach(function (t, i) {
      var f = flate(c[i], { w: W, h: Hh, maks: 340, oppg: oppg, tittel: "Bilde " + (i + 1) + ": " + t, desc: beskr[i] });
      motiv(f.svg, i);
      tx(f.svg, W / 2, BH + 20, t, { str: 19 });
      plass(f, i, 8, 26, 165);
    });
  };

  /* ---------- H2023-14: IAM-faser (to rammer, to bånd, seks svarfelt) ----------
     Kilde: s. 9. Turkist bånd øverst (navnefelt mellom rammene), gult bånd «Tilgangshåndtering» nederst. */
  IN.FIGURER["H2023-14"] = function (host, oppg) {
    var f = flate(host, { w: 1000, h: 420, min: 660, maks: 1000, oppg: oppg }), s = f.svg;
    var BAND = "stroke:var(--color-on-surface-variant);stroke-width:1.2;stroke-dasharray:5 4";
    rekt(s, 10, 58, 980, 185, "fill:var(--color-tone-info);" + BAND, 16);
    rekt(s, 10, 272, 980, 115, "fill:var(--color-tone-warn);" + BAND, 16);
    var RAMME = "fill:none;stroke:var(--color-on-surface);stroke-width:3";
    rekt(s, 30, 38, 262, 374, RAMME, 30);
    rekt(s, 520, 38, 462, 374, RAMME, 30);
    tx(s, 161, 18, "Konfigureringsfase", { str: 24 });
    tx(s, 751, 18, "Bruksfase", { str: 24 });

    // venstre ramme: tre felt
    var VY = [80, 166, 300];
    VY.forEach(function (y) { rekt(s, 46, y, 230, 58, HVIT); });
    blokkPil(s, 161, 140, 161, 164, { b: 16, hb: 30, hl: 11 });
    blokkPil(s, 161, 226, 161, 298, { b: 16, hb: 30, hl: 14, dobbel: true });

    // navnefelt for det turkise båndet
    rekt(s, 304, 124, 206, 62, HVIT);
    // tekst i det gule båndet
    tx(s, 407, 330, "Tilgangshåndtering", { str: 24 });

    // høyre: grønn boks
    rekt(s, 536, 70, 432, 156, "fill:var(--color-tone-ok);stroke:var(--color-on-surface-variant);stroke-width:1.2;stroke-dasharray:5 4", 14);
    rekt(s, 550, 84, 214, 56, HVIT);
    tx(s, 657, 112, "oppgi bruker-ID", { str: 22 });
    blokkPil(s, 657, 141, 657, 160, { b: 14, hb: 26, hl: 9 });
    rekt(s, 550, 161, 214, 60, HVIT);
    tx(s, 657, 178, "oppgi / sjekk", { str: 22 });
    tx(s, 657, 204, "autentikator(er)", { str: 22 });
    rekt(s, 774, 118, 184, 54, HVIT);
    blokkPil(s, 657, 222, 657, 298, { b: 16, hb: 30, hl: 14 });
    rekt(s, 550, 300, 214, 58, HVIT);

    plass(f, 0, 56, 109, 210);
    plass(f, 1, 56, 195, 210);
    plass(f, 2, 56, 329, 210);
    plass(f, 3, 314, 155, 186);
    plass(f, 4, 782, 145, 168);
    plass(f, 5, 560, 329, 194);
  };

  /* ---------- H2023-16: risikotrekanten ----------
     Kilde: s. 10. Gul trekant med «Risiko» i midten og lyseblå blokkpiler ut mot hjørnene. Tre tomme
     tekstfelt inne i trekanten ved hjørnene (topp, nede til venstre, nede til høyre). Eksempelsvarene og
     den grønne svarlista i utskriften tegnes ikke. */
  IN.FIGURER["H2023-16"] = function (host, oppg) {
    var f = flate(host, { w: 600, h: 440, maks: 600, oppg: oppg }), s = f.svg;
    E("polygon", { points: "300,12 25,425 575,425", style: "fill:var(--color-tone-warn);stroke:var(--color-on-surface);stroke-width:2.2;stroke-linejoin:round" }, s);
    var BLA = "var(--color-tone-info)";
    blokkPil(s, 300, 135, 300, 36, { b: 26, hb: 46, hl: 34, fyll: BLA });
    blokkPil(s, 150, 378, 58, 418, { b: 24, hb: 44, hl: 30, fyll: BLA });
    blokkPil(s, 450, 378, 542, 418, { b: 24, hb: 44, hl: 30, fyll: BLA });
    tx(s, 300, 262, "Risiko", { str: 46 });
    plass(f, 0, 222, 162, 156);
    plass(f, 1, 98, 345, 150);
    plass(f, 2, 352, 345, 150);
  };

  /* ---------- H2023-18: sertifikatsti i nettleseren (tre nivåer) ---------- */
  IN.FIGURER["H2023-18"] = function (host, oppg) {
    stil(host);
    var tre = H("div", { class: "h23-tre", role: "tree", "aria-label": "Sertifikatsti for uio.no" }, host);
    [["USERTrust ECC Certification Authority", 0, true], ["GEANT OV ECC CA 4", 1, true], ["uio.no", 2, false]].forEach(function (r) {
      var d = H("div", { role: "treeitem", "aria-level": String(r[1] + 1) }, tre);
      d.style.paddingLeft = (0.6 + r[1] * 1.3 + (r[2] ? 0 : 1.1)) + "em";
      if (r[2]) H("span", { class: "h23-pil", "aria-hidden": "true", text: "▼" }, d);
      d.appendChild(document.createTextNode(r[0]));
    });
  };

  /* ---------- H2023-20: to operasjonsmoduser (venstre: teller, høyre: kjede), felt under hvert ----------
     Kilde: s. 13. Én nøkkel K ved hver blokk (ikke felles nøkkellinje). Ingen modusnavn. */
  IN.FIGURER["H2023-20"] = function (host, oppg) {
    var W = 310, Hh = 205, MW = 40, MH = 30, EW = 56, EH = 38, CY = 166, c = F.celler(host, 2);
    function nokkel(s, x, y) {
      F.nokkel(s, x, y, { str: 0.8 });
      tx(s, x + 11, y + 20, "K", { anker: "start", kursiv: true });
    }

    (function () {
      var s = F.svg(c[0], { w: W, h: Hh, tittel: "Venstre diagram",
        desc: "T1, T2 og T3 øverst, hver med en nøkkel K ved siden av. Begge går inn i en E. Utgangen fra E XOR-es med M1, M2 og M3, som kommer inn fra venstre. Resultatet er C1, C2 og C3. Blokkene er uavhengige." });
      var cols = [70, 170, 270], EY = 58, XY = 130;
      cols.forEach(function (cx, i) {
        F.boks(s, cx - 34, 4, MW, MH, "T_" + (i + 1), { rolle: "teller" });
        F.pil(s, [[cx - 14, 4 + MH], [cx - 14, EY]]);
        nokkel(s, cx + 16, 4);
        F.pil(s, [[cx + 16, 38], [cx + 16, EY]]);
        F.boks(s, cx - EW / 2, EY, EW, EH, "E", { rolle: "funk" });
        F.pil(s, [[cx, EY + EH], [cx, XY - 10]]);
        F.xor(s, cx, XY, 10);
        F.boks(s, cx - 62, XY - MH / 2, 36, MH, "M_" + (i + 1), { rolle: "klar" });
        F.pil(s, [[cx - 26, XY], [cx - 10, XY]]);
        F.pil(s, [[cx, XY + 10], [cx, CY]]);
        F.boks(s, cx - MW / 2, CY, MW, MH, "C_" + (i + 1), { rolle: "chiffer" });
      });
      F.felt(c[0], 0);
    })();

    (function () {
      var s = F.svg(c[1], { w: W, h: Hh, tittel: "Høyre diagram",
        desc: "M1, M2 og M3 øverst. M1 XOR-es med IV fra venstre, M2 med C1 og M3 med C2. Resultatet går inn i E sammen med en nøkkel K, og ut kommer C1, C2 og C3. Fra C3 går en linje videre ut til høyre." });
      var cols = [72, 162, 252], XY = 50, EY = 94;
      cols.forEach(function (cx, i) {
        F.boks(s, cx - MW / 2, 4, MW, MH, "M_" + (i + 1), { rolle: "klar" });
        F.pil(s, [[cx, 4 + MH], [cx, XY - 10]]);
        F.xor(s, cx, XY, 10);
        nokkel(s, cx + 22, 40);
        F.pil(s, [[cx + 22, 74], [cx + 22, EY]]);
        F.pil(s, [[cx, XY + 10], [cx, EY]]);
        F.boks(s, cx - EW / 2, EY, EW, EH, "E", { rolle: "funk" });
        F.pil(s, [[cx, EY + EH], [cx, CY]]);
        F.boks(s, cx - MW / 2, CY, MW, MH, "C_" + (i + 1), { rolle: "chiffer" });
        var kx = cx + 47;
        if (i < 2) F.pil(s, [[cx + MW / 2, CY + MH / 2], [kx, CY + MH / 2], [kx, XY], [cols[i + 1] - 10, XY]]);
        else F.pil(s, [[cx + MW / 2, CY + MH / 2], [kx, CY + MH / 2], [kx, XY], [W - 3, XY]]);
      });
      tx(s, cols[0] - 30, XY, "IV", { anker: "end", kursiv: true });
      F.pil(s, [[cols[0] - 28, XY], [cols[0] - 10, XY]]);
      F.felt(c[1], 1);
    })();
  };

  /* ---------- H2023-22: terminal ---------- */
  IN.FIGURER["H2023-22"] = function (host) {
    F.terminal(host, ["nilspw@in2120:~$ ./skadevare█", "", ""], { tittel: "nilspw@in2120: ~" });
  };

  /* ---------- H2023-26: loggtabell ---------- */
  IN.FIGURER["H2023-26"] = function (host) {
    var tider = ["00", "00", "01", "01", "02", "02", "03", "03"];
    var pass = ["Admin", "admin", "Passw0rd", "eeeSSDF", "in2120", "Sommerferie", "Juleferie!", "Pentest"];
    F.tabell(host, {
      hode: ["Tid", "IP", "Trafikk", ""],
      rader: tider.map(function (t, i) { return ["21.10.2023 - 20:48:" + t, "10.10.127.34 &gt; 10.1.23.23", "User:admin", "Pass:" + pass[i]]; })
    });
  };

  /* ---------- H2023-29: terminal med sudo -l ---------- */
  IN.FIGURER["H2023-29"] = function (host) {
    F.terminal(host, [
      "ss@in2120:~$ sudo -l",
      "Matching Defaults entries for ss on in2120:",
      "    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/",
      "local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin, use_pty",
      "",
      "User ss may run the following commands on in2120:",
      "    (ALL : ALL) /usr/bin/cat",
      "ss@in2120:~$ █"
    ], { tittel: "ss@in2120: ~" });
  };

  /* ---------- H2023-32: nettverk med brannmur mellom ytre og indre segment ----------
     Kilde: s. 22. ÉN stiplet ramme rundt begge segmentene; ruteren sitter på kanten av rammen. */
  IN.FIGURER["H2023-32"] = function (host, oppg) {
    var f = flate(host, { w: 740, h: 360, min: 500, maks: 800, oppg: oppg }), s = f.svg;
    var LED = "fill:none;stroke:var(--color-on-tone-warn);stroke-width:2.4";
    function tjener(cx, topp) {
      var g = E("g", {}, s);
      rekt(g, cx - 17, topp, 34, 68, "fill:var(--color-surface-container-high);stroke:var(--color-on-surface-variant);stroke-width:1.2", 2);
      [8, 13, 18, 23].forEach(function (d) { E("line", { x1: cx - 10, y1: topp + d, x2: cx + 10, y2: topp + d, style: "stroke:var(--color-on-surface-variant);stroke-width:1" }, g); });
      E("title", {}, g).textContent = "Tjener";
    }
    function svitsj(cx, cy, navn) {
      var g = E("g", {}, s);
      rekt(g, cx - 28, cy - 11, 56, 22, "fill:var(--color-tone-info);stroke:var(--color-on-tone-info);stroke-width:1.4", 4);
      F.pil(g, [[cx - 16, cy - 4], [cx + 14, cy - 4]]);
      F.pil(g, [[cx + 16, cy + 4], [cx - 14, cy + 4]]);
      E("title", {}, g).textContent = navn;
    }
    // sky
    E("path", { d: "M95 70 Q70 70 72 52 Q62 30 90 28 Q100 8 130 14 Q150 0 172 16 Q200 10 204 34 Q222 46 204 62 Q200 76 175 72 Q150 84 125 74 Q110 80 95 70 Z",
      style: "fill:var(--color-surface-container-lowest);stroke:var(--color-on-surface-variant);stroke-width:1.4" }, s);
    tx(s, 138, 44, "Internett", { fet: true, str: 20 });
    // én stiplet ramme rundt begge segmentene
    rekt(s, 15, 98, 710, 250, "fill:none;stroke:var(--color-on-surface);stroke-width:2;stroke-dasharray:9 6", 20);
    // ledninger
    E("path", { d: "M206 42 H400 V87", style: LED }, s);
    E("path", { d: "M400 109 V172 M58 172 H400 M400 172 V196", style: LED }, s);
    [58, 128, 198, 268].forEach(function (x) { E("path", { d: "M" + x + " 172 V200", style: LED }, s); tjener(x, 200); });
    E("path", { d: "M400 218 V312 H700", style: LED }, s);
    [560, 640, 700].forEach(function (x) { E("path", { d: "M" + x + " 312 V280", style: LED }, s); tjener(x, 212); });
    svitsj(400, 98, "Ruter/svitsj");
    svitsj(400, 207, "Brannmur");
    tx(s, 130, 136, "Ytre segment", { fet: true, str: 19 });
    tx(s, 410, 190, "Brannmur", { fet: true, str: 19, anker: "start", klasse: "h23-rod" }).style.fill = "var(--fig-klar)";
    tx(s, 198, 290, "Web-tjener", { str: 18 });
    tx(s, 198, 311, "1.2.3.1", { str: 18 });
    tx(s, 560, 162, "Database-tjener", { str: 18 });
    tx(s, 560, 184, "5.6.7.1", { str: 18 });
    tx(s, 560, 333, "Indre segment", { fet: true, str: 19 });
  };

  /* ---------- H2023-35: OAuth-flyt med sju meldinger, tallfelt på hver pil ----------
     Kilde: s. 25. Plasseringen av pilene og feltene følger arket (ikke svarrekkefølgen). */
  IN.FIGURER["H2023-35"] = function (host, oppg) {
    var f = flate(host, { w: 1100, h: 410, min: 760, maks: 1100, oppg: oppg }), s = f.svg, T = 19;
    function aktor(x, y, w, h, l1, l2, fyll, rx) {
      rekt(s, x, y, w, h, "fill:" + fyll + ";stroke:var(--color-on-surface-variant);stroke-width:1.4", rx || 0);
      tx(s, x + w / 2, y + h / 2 - 12, l1, { str: 21 });
      tx(s, x + w / 2, y + h / 2 + 13, l2, { str: 21 });
    }
    function token(cx, cy) {
      var g = E("g", {}, s);
      E("polygon", { points: [[cx - 15, cy], [cx - 8, cy - 12], [cx + 8, cy - 12], [cx + 15, cy], [cx + 8, cy + 12], [cx - 8, cy + 12]].join(" "),
        style: "fill:var(--color-tone-warn);stroke:var(--color-on-surface);stroke-width:1.2" }, g);
      tx(g, cx, cy, "T", { str: 15 });
      E("title", {}, g).textContent = "Token";
    }
    // Ressurseier med brukerikon og mobil
    E("circle", { cx: 62, cy: 28, r: 15, style: "fill:var(--color-on-tone-info)" }, s);
    E("path", { d: "M30 74 Q32 48 62 46 Q92 48 94 74 Z", style: "fill:var(--color-on-tone-info)" }, s);
    rekt(s, 98, 36, 18, 32, "fill:var(--color-on-surface-variant)", 3);
    tx(s, 104, 18, "Bruker", { str: 18, anker: "start" });
    aktor(15, 80, 125, 62, "Ressurs-", "eier", "var(--color-tone-ok)");
    // Google Photos-database og ressurstjener
    tx(s, 78, 188, "Google", { str: 20 });
    tx(s, 78, 212, "Photos", { str: 20 });
    var db = "fill:var(--color-tone-info);stroke:var(--color-on-tone-info);stroke-width:1.4";
    rekt(s, 52, 236, 52, 52, db);
    [288, 270, 253].forEach(function (y) { E("ellipse", { cx: 78, cy: y, rx: 26, ry: 8, style: db }, s); });
    E("ellipse", { cx: 78, cy: 236, rx: 26, ry: 8, style: db }, s);
    aktor(20, 310, 125, 62, "Ressurs-", "tjener", "var(--color-tone-ok)");
    // Autoriseringstjener (sekskant) med OAuth-logo og skjold
    E("polygon", { points: "765,110 790,72 915,72 940,110 915,148 790,148", style: "fill:var(--color-tone-warn);stroke:var(--color-on-surface-variant);stroke-width:1.4" }, s);
    tx(s, 852, 98, "Autoriserings-", { str: 21 });
    tx(s, 852, 124, "tjener (og IdP)", { str: 21 });
    E("circle", { cx: 830, cy: 34, r: 24, style: "fill:var(--color-on-surface)" }, s);
    tx(s, 830, 34, "OAuth", { str: 13 }).style.fill = "var(--color-surface)";
    E("path", { d: "M872 14 L892 8 L912 14 V34 Q912 52 892 60 Q872 52 872 34 Z", style: "fill:var(--color-surface-container-lowest);stroke:var(--color-on-surface);stroke-width:2" }, s);
    rekt(s, 884, 30, 16, 13, "fill:var(--color-on-surface)", 2);
    E("path", { d: "M887 30 V25 Q892 18 897 25 V30", style: "fill:none;stroke:var(--color-on-surface);stroke-width:2" }, s);
    // Photo Edit online app med blyantikon
    aktor(790, 312, 150, 70, "Photo Edit", "online app", "var(--color-tone-info)", 18);
    rekt(s, 955, 322, 52, 50, "fill:var(--color-tone-info);stroke:var(--color-on-surface-variant);stroke-width:1.2", 8);
    E("path", { d: "M968 360 L972 348 L992 328 L999 335 L979 355 Z", style: "fill:var(--color-on-surface)" }, s);

    // (c) autoriseringstjener → ressurseier
    F.pil(s, [[765, 96], [141, 96]]);
    tx(s, 445, 46, "forespørsel fra deg (bruker) om du vil la Photo Edit", { str: T });
    tx(s, 445, 72, "få tilgang til dine bilder på Google Photos", { str: T });
    // (d) ressurseier → autoriseringstjener, med nøkkel
    F.pil(s, [[141, 126], [767, 126]]);
    var nk = E("g", { transform: "translate(256 126) rotate(-90)" }, s);
    F.nokkel(nk, 0, 0, { str: 1 });
    tx(s, 315, 146, "godkjenner forespørsel med autentikator", { str: T, anker: "start" });
    // (a) ressurseier → app (skrå)
    F.pil(s, [[70, 143], [790, 318]]);
    var ang = Math.atan2(318 - 143, 790 - 70) * 180 / Math.PI;
    var ta = tx(s, 470, 222, "jeg vil redigere mine bilder på Google Photos med Photo Edit", { str: T });
    ta.setAttribute("transform", "rotate(" + ang.toFixed(1) + " 470 222)");
    // (b) app → autoriseringstjener (opp)
    F.pil(s, [[882, 312], [882, 149]]);
    ["bruker ønsker å", "redigere sine bilder", "fra Google Photos", "med Photo Edit"].forEach(function (l, i) {
      tx(s, 892, 168 + i * 25, l, { str: T, anker: "start" });
    });
    // (e) autoriseringstjener → app (ned), med token
    F.pil(s, [[836, 149], [836, 312]]);
    tx(s, 806, 184, "tilgangstoken som bevis på", { str: T, anker: "end" });
    tx(s, 806, 210, "godkjent forespørsel", { str: T, anker: "end" });
    token(836, 222);
    // (f) app → ressurstjener, med token
    F.pil(s, [[790, 328], [146, 328]]);
    tx(s, 385, 312, "forespørsel om bilder med tilgangstoken", { str: T });
    token(612, 328);
    // (g) ressurstjener → app
    F.pil(s, [[146, 362], [790, 362]]);
    tx(s, 460, 382, "Photo Edit får tilgang til brukerens bilder", { str: T });

    // tallfelt (indeks = rekkefølgen i oppgaven: a, b, c, d, e, f, g)
    var FW = 54;
    plass(f, 0, 118, 160, FW);
    plass(f, 1, 855, 288, FW);
    plass(f, 2, 680, 96, FW);
    plass(f, 3, 186, 126, FW);
    plass(f, 4, 809, 176, FW);
    plass(f, 5, 636, 328, FW);
    plass(f, 6, 186, 362, FW);
  };

  /* ---------- H2023-38: risikostyringsprosessen (som H2022-10.1) ----------
     Kilde: s. 27. Blå stiplet ramme, fire hovedfelt (felt 2 pilleformet), to beslutningspunkt med J ned og
     N tilbake til felt 1, tre «Består bl.a. av:»-bokser med klamme. Ingen trinnavn. */
  IN.FIGURER["H2023-38"] = function (host, oppg) {
    var f = flate(host, { w: 980, h: 480, min: 660, maks: 980, oppg: oppg }), s = f.svg;
    tx(s, 340, 18, "Risikostyring for informasjonssikkerhet", { fet: true, str: 24 });
    rekt(s, 12, 40, 962, 432, "fill:none;stroke:var(--color-primary);stroke-width:3;stroke-dasharray:8 5", 4);
    var GRONN = "fill:var(--color-surface-container-lowest);stroke:var(--color-on-tone-ok);stroke-width:2";
    function hoved(y, x0, x1) { rekt(s, x0, y, x1 - x0, 50, GRONN); rekt(s, x0 + 24, y + 3, x1 - x0 - 48, 44, HVIT, 3); }
    hoved(76, 85, 382);
    // felt 2: pilleformet med gule ender
    rekt(s, 77, 149, 324, 52, "fill:var(--color-tone-warn);stroke:var(--color-on-tone-info);stroke-width:2.4", 26);
    rekt(s, 108, 152, 262, 46, HVIT, 3);
    hoved(280, 81, 400);
    hoved(414, 77, 410);
    function romb(cx, cy, n) {
      E("polygon", { points: [cx, cy - 22, cx + 24, cy, cx, cy + 22, cx - 24, cy].join(" "), style: "fill:var(--color-tone-ok);stroke:var(--color-on-tone-ok);stroke-width:1.6" }, s);
      tx(s, cx + 40, cy, "Beslutningspunkt " + n, { str: 24, anker: "start" });
      tx(s, cx - 34, cy - 18, "N", { str: 20, fet: true });
      tx(s, cx + 15, cy + 28, "J", { str: 18, fet: true });   // over boksen under, ikke inni den
    }
    var CX = 237;
    F.pil(s, [[CX, 126], [CX, 149]]);
    F.pil(s, [[CX, 201], [CX, 217]]);
    romb(CX, 239, 1);
    F.pil(s, [[CX, 261], [CX, 280]]);
    F.pil(s, [[CX, 330], [CX, 346]]);
    romb(CX, 368, 2);
    F.pil(s, [[CX, 390], [CX, 414]]);
    // N-løkker tilbake til felt 1
    F.pil(s, [[CX - 24, 239], [48, 239], [48, 106], [85, 106]]);
    F.pil(s, [[CX - 24, 368], [34, 368], [34, 90], [85, 90]]);

    // «Består bl.a. av:»-bokser med klamme
    function klamme(x, y0, y1) {
      var m = (y0 + y1) / 2;
      E("path", { d: "M" + (x + 26) + " " + y0 + " Q" + x + " " + y0 + " " + x + " " + (y0 + 20) + " V" + (m - 8) + " Q" + x + " " + m + " " + (x - 12) + " " + m +
        " Q" + x + " " + m + " " + x + " " + (m + 8) + " V" + (y1 - 20) + " Q" + x + " " + y1 + " " + (x + 26) + " " + y1, style: "fill:none;stroke:var(--color-on-surface);stroke-width:1.4" }, s);
      return m;
    }
    function bestaar(lx, ly, bx, by, bw) {
      tx(s, lx, ly, "Består bl.a. av:", { str: 24, anker: "start" });
      rekt(s, bx, by, bw, 50, "fill:var(--color-surface-container-lowest);stroke:var(--color-on-tone-ok);stroke-width:1.6", 3);
    }
    var m1 = klamme(432, 56, 150);
    F.linje(s, [[382, 101], [420, 101]]);
    bestaar(462, 58, 448, 80, 258);
    var m2 = klamme(668, 152, 232);
    F.linje(s, [[401, 175], [656, m2]], { stiplet: true });
    bestaar(688, 150, 684, 168, 262);
    var m3 = klamme(522, 258, 352);
    F.linje(s, [[400, 305], [510, m3]], { stiplet: true });
    bestaar(574, 262, 560, 282, 262);
    void m1;

    plass(f, 0, 114, 101, 240);
    plass(f, 1, 458, 105, 238);
    plass(f, 2, 116, 175, 246);
    plass(f, 3, 694, 193, 242);
    plass(f, 4, 110, 305, 262);
    plass(f, 5, 570, 307, 242);
    plass(f, 6, 106, 439, 276);
  };
})();
