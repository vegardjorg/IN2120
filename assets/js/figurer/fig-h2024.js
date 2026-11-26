/* ============================================================
   IN2120 guide · figurer/fig-h2024.js
   Eksamensfigurene fra H2024, tegnet på nytt med IN.fig (API øverst i fig-felles.js).
   Kilde: UiO, IN2120 eksamen H2024 (eksamen/in2120-2024-x-qa.pdf). Kontrollliste: plan/figurer/INVENTAR-h2024.md.
   Regler: tro mot arket (samme elementer, piler, etiketter, plassering), ikke røp svaret,
   tål flere kall (ingen global tilstand), temafarger via CSS-variabler.
   ============================================================ */

(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FIGURER = IN.FIGURER || {};
  var F = IN.fig;
  if (!F) return;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- Lokale hjelpere ---------- */
  /* IN.fig.tekst med str: .fig-txt { font-size: 17px } i figurer.css slår presentasjonsattributtet font-size,
     så størrelsen settes inline i stedet. */
  function tekst(parent, x, y, txt, o) {
    var t = F.tekst(parent, x, y, txt, o);
    if (o && o.str) t.style.fontSize = o.str + "px";
    return t;
  }
  function S(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function H(tag, style, parent, text) {
    var n = document.createElement(tag);
    if (style) n.setAttribute("style", style);
    if (text != null) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  /* Fyll/strek med temavariabler (virker i lys og mørk modus). */
  function farge(n, fyll, strek, bredde) {
    n.setAttribute("style", "fill:" + (fyll || "none") + ";stroke:" + (strek || "var(--color-on-surface)") + ";stroke-width:" + (bredde || 1.5));
    return n;
  }
  var GUL = "var(--color-tone-warn)", BLA = "var(--color-tone-info)", GRONN = "var(--color-tone-ok)",
    LAKS = "var(--color-tone-caution)", STREK = "var(--color-on-surface)", BAKGRUNN = "var(--fig-bg)";

  /* Tegning med svarfelt lagt oppå (absolutt plassert i %). min: minste bredde i px (vannrett rulling inni
     figuren under det, ikke på siden). */
  function overlegg(host, W, Hh, o) {
    o = o || {};
    var ytre = H("div", "width:100%;" + (o.min ? "overflow-x:auto;" : ""), host);
    var wrap = H("div", "position:relative;width:100%;margin:0 auto;" + (o.maks ? "max-width:" + o.maks + "px;" : "") + (o.min ? "min-width:" + o.min + "px;" : ""), ytre);
    var svg = F.svg(wrap, { w: W, h: Hh, oppg: o.oppg, tittel: o.tittel, desc: o.desc });
    svg.style.maxWidth = "none";
    return { wrap: wrap, svg: svg, W: W, H: Hh };
  }
  /* Smalt svarfelt med sentrum i (x, y), bredde w (viewBox-enheter). Tekstfeltet (.insp-t) har min-width 9em i viz.css;
     det overstyres inline når inspera.js flytter feltet inn. */
  function nal(ov, i, x, y, w) {
    var boks = H("div", "position:absolute;left:" + (x / ov.W * 100) + "%;top:" + (y / ov.H * 100) + "%;width:" + (w / ov.W * 100) +
      "%;transform:translate(-50%,-50%);", ov.wrap);
    var ph = F.felt(boks, i);
    ph.style.minHeight = "0";
    function smal() {
      Array.prototype.forEach.call(ph.querySelectorAll(".insp-t"), function (n) {
        n.style.minWidth = "0"; n.style.width = "100%"; n.style.padding = "2px 3px"; n.style.textAlign = "center";
      });
    }
    if (window.MutationObserver) new MutationObserver(smal).observe(ph, { childList: true });
    return ph;
  }
  /* Tykk dobbeltpil (blokkpil) fra x0 til x1 på høyde y. */
  function blokkDobbel(s, x0, x1, y, t) {
    var a = 14, b = 6;
    var p = [[x0, y], [x0 + a, y - t / 2 - b], [x0 + a, y - t / 2], [x1 - a, y - t / 2], [x1 - a, y - t / 2 - b], [x1, y],
      [x1 - a, y + t / 2 + b], [x1 - a, y + t / 2], [x0 + a, y + t / 2], [x0 + a, y + t / 2 + b]];
    return farge(S("polygon", { points: p.map(function (q) { return q.join(","); }).join(" ") }, s), BLA, "var(--color-primary)", 1.4);
  }
  /* Blokkpil med spiss i (tx, ty), fra (fx, fy). */
  function blokkPil(s, fx, fy, tx, ty, t) {
    var dx = tx - fx, dy = ty - fy, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, hl = t * 1.3, hw = t;
    function P(along, side) { return [fx + ux * along + nx * side, fy + uy * along + ny * side]; }
    var p = [P(0, -t / 2), P(L - hl, -t / 2), P(L - hl, -hw), P(L, 0), P(L - hl, hw), P(L - hl, t / 2), P(0, t / 2)];
    return farge(S("polygon", { points: p.map(function (q) { return q[0].toFixed(1) + "," + q[1].toFixed(1); }).join(" ") }, s), BLA, STREK, 1.4);
  }
  function person(s, cx, top, k, slips) {
    var g = S("g", { transform: "translate(" + cx + " " + top + ") scale(" + (k || 1) + ")" }, s);
    farge(S("circle", { cx: 0, cy: 12, r: 11 }, g), "var(--color-tone-caution)", STREK, 1.3);
    farge(S("path", { d: "M-20 52 Q-20 27 0 26 Q20 27 20 52 Z" }, g), "var(--color-primary)", STREK, 1.3);
    if (slips) farge(S("path", { d: "M-3 27 L3 27 L2 44 L0 48 L-2 44 Z" }, g), "var(--fig-klar)", "none");
    return g;
  }

  /* ---------- H2024-1: foreleser ⇄ eksamensplattform ⇄ student (s. 2) ----------
     Arket: tre figurer på linje med tykke lyseblå dobbeltpiler. Generisk sky med server og nettleservindu (ingen logo). */
  IN.FIGURER["H2024-1"] = function (host, oppg) {
    var W = 490, Hh = 190, s = F.svg(host, { w: W, h: Hh, oppg: oppg, maks: 640 });
    // Foreleser (person i dress med slips)
    person(s, 60, 22, 1.25, true);
    // Sky med server og nettleservindu
    farge(S("path", { d: "M170 112 Q150 110 156 90 Q150 66 178 64 Q184 36 214 42 Q234 22 258 38 Q288 30 296 56 Q318 62 306 86 Q316 108 292 112 Z" }, s), BAKGRUNN, "var(--color-outline)", 1.4);
    farge(S("rect", { x: 186, y: 52, width: 26, height: 52, rx: 2 }, s), "var(--color-surface-container-high)", STREK, 1.3);
    for (var i = 0; i < 4; i++) S("line", { x1: 190, x2: 208, y1: 60 + i * 8, y2: 60 + i * 8, style: "stroke:var(--color-on-surface);stroke-width:1" }, s);
    farge(S("rect", { x: 220, y: 48, width: 70, height: 50, rx: 3 }, s), "var(--color-tone-info)", STREK, 1.3);
    S("line", { x1: 220, x2: 290, y1: 57, y2: 57, style: "stroke:var(--color-on-surface);stroke-width:1" }, s);
    // Student ved bærbar PC
    person(s, 442, 22, 1.25, false);
    farge(S("path", { d: "M372 72 L400 72 L406 98 L376 98 Z" }, s), "var(--color-surface-container-high)", STREK, 1.3);
    farge(S("path", { d: "M366 98 L412 98 L416 104 L362 104 Z" }, s), "var(--color-surface-container-high)", STREK, 1.3);
    // Dobbeltpiler
    blokkDobbel(s, 100, 150, 80, 12);
    blokkDobbel(s, 312, 358, 80, 12);
    [[60, ["Foreleser som", "lager eksamen"]], [230, ["Platform for eksamen"]], [440, ["Student som", "tar eksamen"]]].forEach(function (e) {
      e[1].forEach(function (l, j) { tekst(s, e[0], 142 + j * 22, l, { str: 18 }); });
    });
  };

  /* ---------- H2024-13: risikotrekanten (s. 9) ----------
     Gul trekant, «Risiko» i midten, tre lyseblå blokkpiler ut mot hjørnene, tekstfelt ved hver pil (som på arket). */
  IN.FIGURER["H2024-13"] = function (host, oppg) {
    var ov = overlegg(host, 420, 330, { oppg: oppg, maks: 560 }), s = ov.svg;
    farge(S("polygon", { points: "210,6 8,322 412,322" }, s), GUL, STREK, 2);
    blokkPil(s, 210, 108, 210, 22, 26);
    blokkPil(s, 92, 248, 32, 312, 24);
    blokkPil(s, 328, 248, 388, 312, 24);
    tekst(s, 210, 200, "Risiko", { str: 30 });
    nal(ov, 0, 262, 132, 150);
    nal(ov, 1, 112, 262, 150);
    nal(ov, 2, 308, 262, 150);
  };

  /* ---------- H2024-15: sertifikatsti i nettleseren (s. 11) ----------
     Tre nivåer med innrykk; de to øverste utvidet (▾), nederste markert grått. */
  IN.FIGURER["H2024-15"] = function (host) {
    var box = H("div", "border:1px solid var(--color-outline);background:var(--color-surface-container-lowest);color:var(--color-on-surface);max-width:34rem;margin:.4rem auto;padding:.3rem 0;font-family:'Segoe UI',system-ui,sans-serif;", host);
    box.setAttribute("role", "tree");
    box.setAttribute("aria-label", "Sertifikatsti");
    [["Amazon Root CA 1", 0, true], ["Amazon RSA 2048 M03", 1, true], ["inspera.no", 2, false]].forEach(function (r, i) {
      var rad = H("div", "padding:.45rem .7rem .45rem " + (0.7 + r[1] * 1.3) + "rem;" + (i === 2 ? "background:var(--color-surface-container-high);" : ""), box);
      rad.setAttribute("role", "treeitem");
      if (r[2]) H("span", "color:var(--color-on-surface-variant);font-size:.7em;margin-right:.45rem;", rad, "▼");
      else H("span", "display:inline-block;width:1.1rem;", rad);
      H("span", "", rad, r[0]);
    });
  };

  /* ---------- H2024-17: to operasjonsmoduser (s. 12) ----------
     Venstre: M → E (nøkkel K til høyre for hver blokk) → C, ingen kobling. Høyre: T → E (K) → ⊕ ← M → C.
     Ett slippfelt under hvert diagram. Ingen modusnavn. */
  IN.FIGURER["H2024-17"] = function (host) {
    var W = 310, Hh = 190, MW = 36, MH = 28, EW = 68, EH = 38, EY = 50, CY = 152, c = F.celler(host, 2);
    function nokkel(s, cx) {
      F.nokkel(s, cx + 22, 8, { str: 0.62 });
      tekst(s, cx + 36, 30, "K", { anker: "start", kursiv: true, str: 15 });
      F.pil(s, [[cx + 22, 34], [cx + 22, EY]]);
    }
    (function () {
      var s = F.svg(c[0], { w: W, h: Hh, tittel: "Venstre diagram",
        desc: "Tre kolonner. M1, M2 og M3 går rett ned i hver sin E, med nøkkelen K inn ved siden av. Ut kommer C1, C2 og C3. Ingen forbindelse mellom kolonnene." });
      [55, 155, 255].forEach(function (cx, i) {
        var m = F.boks(s, cx - 34, 6, MW, MH, "M_" + (i + 1), { rolle: "klar" });
        F.pil(s, [[m.cx, m.bunn], [m.cx, EY]]);
        nokkel(s, cx);
        F.boks(s, cx - EW / 2, EY, EW, EH, "E", { rolle: "funk" });
        F.pil(s, [[cx, EY + EH], [cx, CY]]);
        F.boks(s, cx - MW / 2, CY, MW, MH, "C_" + (i + 1), { rolle: "chiffer" });
      });
      F.felt(c[0], 0);
    })();
    (function () {
      var s = F.svg(c[1], { w: W, h: Hh, tittel: "Høyre diagram",
        desc: "Tre kolonner. T1, T2 og T3 går ned i hver sin E, med nøkkelen K inn ved siden av. Utgangen fra E XOR-es med M1, M2 og M3, som kommer inn fra venstre. Ut kommer C1, C2 og C3." });
      var XY = 120;
      [62, 160, 256].forEach(function (cx, i) {
        var t = F.boks(s, cx - 34, 6, MW, MH, "T_" + (i + 1), { rolle: "teller" });
        F.pil(s, [[t.cx, t.bunn], [t.cx, EY]]);
        nokkel(s, cx);
        F.boks(s, cx - EW / 2, EY, EW, EH, "E", { rolle: "funk" });
        F.pil(s, [[cx, EY + EH], [cx, XY - 10]]);
        F.xor(s, cx, XY, 10);
        F.boks(s, cx - 58, XY - MH / 2, MW, MH, "M_" + (i + 1), { rolle: "klar" });
        F.pil(s, [[cx - 22, XY], [cx - 10, XY]]);
        F.pil(s, [[cx, XY + 10], [cx, CY]]);
        F.boks(s, cx - MW / 2, CY, MW, MH, "C_" + (i + 1), { rolle: "chiffer" });
      });
      F.felt(c[1], 1);
    })();
  };

  /* ---------- H2024-24: terminalutskrift (s. 17) ----------
     Eierbeslutning 2026-11-25: nøytrale, oppdiktede verdier (ikke kildens demoverdier). Ledeteksten er dekket
     av felt som på arket. Programnavnet står ikke i figuren. */
  IN.FIGURER["H2024-24"] = function (host) {
    var V = {
      auth: "0 ; 412345 (00000000:00064ab9)", user: "ola", domain: "EKSEMPEL",
      sid: "S-1-5-21-1111111111-2222222222-3333333333-1001",
      lm: "aad3b435b51404eeaad3b435b51404ee", ntlm: "3f9c1e7a52b04d6e8a1f0c27d94b6e15",
      sha1: "6b1e0d9a4c7f23e85a90b4d1c6e2f7a83d05c9b1", pw: "Sommer2024!"
    };
    var dekk = "██████████";
    F.terminal(host, [
      dekk + " # privilege::debug",
      "Privilege '20' OK",
      "",
      dekk + " # sekurlsa::logonpasswords",
      "",
      "Authentication Id : " + V.auth,
      "Session           : Interactive from 2",
      "User Name         : " + V.user,
      "Domain            : " + V.domain,
      "SID               : " + V.sid,
      "        msv :",
      "         [00000003] Primary",
      "         * Username : " + V.user,
      "         * Domain   : " + V.domain,
      "         * LM       : " + V.lm,
      "         * NTLM     : " + V.ntlm,
      "         * SHA1     : " + V.sha1,
      "        tspkg :",
      "         * Username : " + V.user,
      "         * Domain   : " + V.domain,
      "         * Password : " + V.pw,
      "..."
    ]);
  };

  /* ---------- H2024-27: NVD-utklipp og IDS-regel (s. 19) ---------- */
  IN.FIGURER["H2024-27"] = function (host, oppg) {
    var nvd = H("div", "border:1px solid var(--color-outline-variant);border-radius:6px;padding:.6rem .8rem;margin:.4rem 0;background:var(--color-surface-container-lowest);color:var(--color-on-surface);", host);
    var ttl = H("div", "font-weight:700;font-size:1.25rem;display:flex;align-items:center;gap:.2rem;", nvd);
    // Generisk insektikon foran overskriften (som på arket; egen enkel tegning, ikke kopi av nettstedets ikon)
    var bug = document.createElementNS(NS, "svg");
    bug.setAttribute("viewBox", "0 0 20 20"); bug.setAttribute("aria-hidden", "true");
    bug.setAttribute("style", "width:1.1em;height:1.1em;flex:0 0 auto;");
    S("path", { d: "M3 5 L6 7.5 M17 5 L14 7.5 M2 11 H6 M18 11 H14 M3 17 L6 14.5 M17 17 L14 14.5 M8 4 L7 2 M12 4 L13 2", style: "fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round" }, bug);
    S("ellipse", { cx: 10, cy: 5.5, rx: 3, ry: 2.3, style: "fill:currentColor" }, bug);
    S("ellipse", { cx: 10, cy: 12, rx: 4.3, ry: 6, style: "fill:currentColor" }, bug);
    ttl.appendChild(bug);
    H("span", "", ttl, "CVE-2017-0147 Detail");
    H("div", "font-weight:700;font-size:1.05rem;margin-top:.25rem;", nvd, "Current Description");
    H("p", "font-size:.85rem;margin:.3rem 0;", nvd, "The SMBv1 server in Microsoft Windows Vista SP2; Windows Server 2008 SP2 and R2 SP1; Windows 7 SP1; Windows 8.1; Windows Server 2012 Gold and R2; Windows RT 8.1; and Windows 10 Gold, 1511, and 1607; and Windows Server 2016 allows remote attackers to obtain sensitive information from process memory via a crafted packets, aka \"Windows SMB Information Disclosure Vulnerability.\"");
    var src = H("div", "font-size:.85rem;", nvd); H("b", "", src, "Source: "); src.appendChild(document.createTextNode("MITRE"));
    var mod = H("div", "font-size:.85rem;", nvd); H("b", "", mod, "Description Last Modified: "); mod.appendChild(document.createTextNode("03/16/2017"));
    H("div", "font-size:.85rem;color:var(--color-primary);text-decoration:underline;", nvd, "+View Analysis Description");
    var regel = (oppg && oppg.figur && oppg.figur.tekst && oppg.figur.tekst[0]) || "";
    var k = F.kode(host, regel);
    var pre = k.querySelector("pre");
    if (pre) { pre.style.whiteSpace = "pre-wrap"; pre.style.overflowWrap = "anywhere"; pre.style.fontVariantLigatures = "none"; }
  };

  /* ---------- H2024-28: internett- og OSI-stakken (s. 20) ----------
     12 slippfelt: 0–4 i internettstakken ovenfra, 5–11 i OSI 7–1. Ingen lagnavn.
     Eierbeslutning 2026-11-25: tegnet faglig riktig (øverste felt over OSI 7–5, neste over 4). Arket har 7–6 og 5–4. */
  IN.FIGURER["H2024-28"] = function (host) {
    var spenn = [3, 1, 1, 1, 1];
    var kant = "1.5px solid var(--color-on-surface)";
    var grid = H("div", "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:auto 2.6rem repeat(7,minmax(2.7rem,auto));max-width:30rem;margin:.4rem auto;", host);
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", "Internett-stakk og OSI-stakk");
    H("div", "grid-column:1;grid-row:1;text-align:center;font-size:1.15rem;padding:.2rem;", grid, "Internett-stakk");
    H("div", "grid-column:2;grid-row:1;text-align:center;font-size:1.15rem;padding:.2rem;", grid, "OSI-stakk");
    H("div", "grid-column:1;grid-row:2;border:" + kant + ";background:#00f5c8;background:color-mix(in srgb,#00d9b0 60%,var(--color-surface-container-lowest));", grid);
    H("div", "grid-column:2;grid-row:2;border:" + kant + ";border-left:0;display:flex;align-items:center;justify-content:center;font-size:1.15rem;", grid, "App");
    var rad = 3;
    spenn.forEach(function (n, i) {
      var celle = H("div", "grid-column:1;grid-row:" + rad + " / span " + n + ";border:" + kant + ";border-top:0;display:flex;align-items:center;justify-content:center;padding:.25rem .35rem;background:" +
        (i === 4 ? "var(--color-tone-ok)" : "var(--color-tone-info)") + ";", grid);
      F.felt(celle, i).style.minHeight = "0";
      rad += n;
    });
    for (var j = 0; j < 7; j++) {
      var o = H("div", "grid-column:2;grid-row:" + (3 + j) + ";border:" + kant + ";border-top:0;border-left:0;display:flex;align-items:center;gap:.35rem;padding:.25rem .35rem;", grid);
      H("span", "font-size:1.1rem;min-width:1.4rem;", o, (7 - j) + ".");
      F.felt(o, 5 + j).style.minHeight = "0";
    }
  };

  /* ---------- H2024-31: OIDC-meldingsflyt (s. 23) ----------
     Koordinater som på arket (viewBox 1110 × 600). Tallfeltene ligger ved hver pil som på arket. Under 700 px
     rulles figuren vannrett inni seg selv (for liten tekst ellers). Feltrekkefølgen (0–11) følger banken. */
  IN.FIGURER["H2024-31"] = function (host, oppg) {
    var ov = overlegg(host, 1110, 600, { oppg: oppg, min: 700, maks: 1000 }), s = ov.svg, T = 24;
    function t(x, y, txt, anker) { tekst(s, x, y, txt, { str: T, anker: anker || "start" }); }
    function idLapp(cx, cy) {
      farge(S("rect", { x: cx - 22, y: cy - 16, width: 44, height: 32, rx: 6 }, s), GUL, STREK, 1.4);
      tekst(s, cx, cy, "ID", { str: 22 });
    }
    // Føderasjonsavtale: stiplet dobbeltpil mellom SP og IdP
    F.pil(s, [[198, 62], [198, 30], [868, 30], [868, 62]], { stiplet: true, start: true });
    farge(S("rect", { x: 425, y: 14, width: 200, height: 32 }, s), BAKGRUNN, "none");
    t(525, 30, "Føderasjonsavtale", "middle");
    // SP: bygning + boks
    var b = S("g", {}, s);
    farge(S("path", { d: "M126 92 L176 66 L226 92 Z" }, b), GRONN, STREK, 1.4);
    farge(S("rect", { x: 132, y: 92, width: 88, height: 48 }, b), LAKS, STREK, 1.4);
    [142, 160, 186, 204].forEach(function (x) { farge(S("rect", { x: x, y: 100, width: 8, height: 14 }, b), BAKGRUNN, STREK, 1); farge(S("rect", { x: x, y: 120, width: 8, height: 14 }, b), BAKGRUNN, STREK, 1); });
    farge(S("rect", { x: 110, y: 145, width: 128, height: 78 }, s), LAKS, STREK, 1.6);
    tekst(s, 174, 184, "SP", { str: 28 });
    // IdP: skjold med hengelås + boks
    farge(S("path", { d: "M868 72 L902 84 Q902 128 868 146 Q834 128 834 84 Z" }, s), BAKGRUNN, STREK, 3);
    farge(S("rect", { x: 856, y: 104, width: 24, height: 20, rx: 2 }, s), STREK, STREK, 1);
    farge(S("path", { d: "M861 104 V97 a7 7 0 0 1 14 0 V104" }, s), "none", STREK, 2.4);
    farge(S("rect", { x: 812, y: 152, width: 118, height: 70 }, s), GRONN, STREK, 1.6);
    tekst(s, 871, 187, "IdP", { str: 28 });
    // Klient + person + nøkkel
    farge(S("rect", { x: 405, y: 395, width: 192, height: 92, rx: 24 }, s), BLA, STREK, 1.6);
    tekst(s, 501, 441, "Klient", { str: 28 });
    person(s, 458, 492, 1.6, true);
    farge(S("path", { transform: "translate(32 6)", d: "M560 512 a12 12 0 1 1 0.1 0 Z M584 506 h46 v10 h-6 v8 h-6 v-8 h-8 v6 h-6 v-6 h-20 Z" }, s), GUL, STREK, 1.4);
    // Pilene
    F.pil(s, [[492, 395], [492, 125], [240, 125]]);                 // tjenesteforespørsel
    t(250, 103, "tjenesteforespørsel");
    F.pil(s, [[238, 160], [465, 160], [465, 393]]);                 // liste over IdP-er
    t(250, 182, "liste over IdP-er");
    F.pil(s, [[430, 395], [242, 198]]);                             // velg IdP
    t(330, 218, "velg", "middle"); t(330, 250, "IdP", "middle");
    F.pil(s, [[240, 228], [405, 403]]);                             // diriger nettleser til IdP
    t(262, 312, "diriger", "middle"); t(276, 344, "nettleser", "middle"); t(290, 376, "til IdP", "middle");
    F.pil(s, [[527, 395], [527, 125], [826, 125]]);                 // be om autentisering
    t(552, 103, "be om autentisering");
    F.pil(s, [[812, 160], [563, 160], [563, 393]]);                 // vis login-side
    t(590, 182, "vis login-side");
    S("path", { d: "M488 532 Q526 534 522 492", class: "fig-strek", "marker-end": "url(#" + s._pil + ")", style: "stroke:var(--color-outline);stroke-width:5" }, s); // presenter autentikator
    t(570, 566, "presenter autentikator");
    F.pil(s, [[582, 398], [826, 232]]);                             // autentikator
    t(668, 372, "autentikator");
    F.pil(s, [[930, 165], [975, 165], [975, 212], [932, 212]]);     // bruker-autentisering
    t(1048, 246, "bruker-", "middle"); t(1012, 278, "autentisering", "middle");
    F.pil(s, [[880, 222], [880, 452], [599, 452]]);                 // send ID-token til klient
    idLapp(676, 452);
    t(708, 476, "send ID-token"); t(708, 508, "til klient");
    F.pil(s, [[405, 452], [125, 452], [125, 225]]);                 // videresend ID-token til SP
    idLapp(125, 348);
    t(128, 476, "videresend"); t(128, 508, "ID-token til SP");
    F.pil(s, [[110, 195], [16, 195], [16, 552], [415, 552], [415, 489]]); // tjeneste
    t(166, 575, "tjeneste");
    // Tallfeltene (bankens rekkefølge)
    [[492, 326], [440, 262], [360, 298], [240, 268], [512, 192], [568, 276], [548, 540], [686, 330], [1000, 190], [880, 410], [312, 452], [357, 552]]
      .forEach(function (p, i) { nal(ov, i, p[0], p[1], 52); });
  };

  /* ---------- H2024-33: risikostyring med to beslutningspunkter (s. 25) ---------- */
  IN.FIGURER["H2024-33"] = function (host, oppg) {
    var W = 580, Hh = 402, T = 22, cx = 300, s = F.svg(host, { w: W, h: Hh, oppg: oppg, maks: 700 });
    farge(S("rect", { x: 4, y: 6, width: 572, height: 390, rx: 4, "stroke-dasharray": "8 5" }, s), "none", "var(--color-on-tone-caution)", 2.2);
    tekst(s, 16, 200, "Risikostyring", { anker: "start", str: T });
    function boks(x0, x1, y, h, txt, fyll, r) {
      farge(S("rect", { x: x0, y: y, width: x1 - x0, height: h, rx: r || 0 }, s), fyll, STREK, 1.5);
      tekst(s, (x0 + x1) / 2, y + h / 2, txt, { str: T });
    }
    function rombe(cyy) { farge(S("polygon", { points: [[cx, cyy - 22], [cx + 22, cyy], [cx, cyy + 22], [cx - 22, cyy]].join(" ") }, s), GRONN, STREK, 1.5); }
    boks(200, 400, 30, 36, "Kontekstetablering", BLA);
    F.pil(s, [[cx, 66], [cx, 90]]);
    boks(180, 420, 90, 36, "Risikovurdering (ROS)", GUL, 18);
    F.pil(s, [[cx, 126], [cx, 148]]);
    rombe(170);
    F.pil(s, [[cx - 22, 170], [185, 170], [185, 54], [200, 54]]);
    tekst(s, cx - 30, 158, "N", { anker: "end", str: T });
    tekst(s, 335, 158, "Beslutningspunkt 1:", { anker: "start", str: T });
    tekst(s, 335, 184, "Akseptabel vurdering?", { anker: "start", str: T });
    F.pil(s, [[cx, 192], [cx, 215]]);
    tekst(s, cx + 8, 204, "J", { anker: "start", str: T });
    boks(180, 420, 215, 36, "Risikohåndteringsplan", BLA);
    F.pil(s, [[cx, 251], [cx, 273]]);
    rombe(295);
    F.pil(s, [[cx - 22, 295], [170, 295], [170, 40], [200, 40]]);
    tekst(s, cx - 30, 283, "N", { anker: "end", str: T });
    tekst(s, 335, 283, "Beslutningspunkt 2:", { anker: "start", str: T });
    tekst(s, 335, 309, "Akseptabel plan?", { anker: "start", str: T });
    F.pil(s, [[cx, 317], [cx, 345]]);
    tekst(s, cx + 8, 330, "J", { anker: "start", str: T });
    boks(70, 530, 345, 36, "Dokumentér risikovurdering og -håndtering", BLA);
  };

  /* ---------- H2024-34: trinnene i risikovurdering (s. 26) ----------
     HTML: tre trinnfelt i en gul avrundet figur, stiplet linje til en klamme med punktliste per trinn.
     Felt: 0 = første punkt trinn 1, 1 = trinn 1, 2 = trinn 2, 3 = siste punkt trinn 2, 4 = første punkt trinn 3, 5 = trinn 3. */
  IN.FIGURER["H2024-34"] = function (host) {
    /* Flytlinja går loddrett gjennom midten av trinnfeltene: Kontekstetablering, linja, trinnene og
       Beslutningspunkt 1 står på samme x. Bred: etiketten til venstre, punktlista til høyre for trinnet.
       Smal (< 34rem): etiketten over, punktlista under trinnet, til høyre for linja. */
    var LIN = "1.5px solid var(--color-on-surface)";
    var rot = H("div", "max-width:46rem;margin:.4rem auto;color:var(--color-on-surface);", host);
    var toppRad = H("div", "position:relative;height:2.3rem;", rot);
    var kontekst = H("div", "position:absolute;top:0;transform:translateX(-50%);white-space:nowrap;padding:.3rem .8rem;border:2px solid var(--color-on-surface);background:var(--color-tone-info);font-size:1.1rem;", toppRad, "Kontekstetablering");
    var linje1 = H("div", "height:1rem;border-left:" + LIN + ";", rot);
    var ros = H("div", "", rot);
    var rygg = H("div", "position:absolute;top:0;bottom:0;width:0;border-left:" + LIN + ";", ros);
    var etikett = H("div", "", ros, "Risikovurdering (ROS)");
    var kol = H("div", "", ros);
    var trinn = [
      { felt: 1, liste: [{ felt: 0 }, "Identifisering av trusler", "Identifisering av eksisterende tiltak", "Identifisering av sårbarheter", "Identifisering av konsekvenser"] },
      { felt: 2, liste: ["Estimere verdier og konsekvenser", "Estimere sannsynlighet for hendelser", { felt: 3 }] },
      { felt: 5, liste: [{ felt: 4 }, "Sammenligne med terskelnivå"] }
    ];
    function spiss(parent, stil) {
      return H("div", "position:absolute;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid var(--color-on-surface);" + stil, parent);
    }
    var rader = trinn.map(function (tr, i) {
      var rad = H("div", "", kol);
      var steg = H("div", "", rad);
      if (i) spiss(steg, "top:-8.5px;left:50%;margin-left:-5px;");
      F.felt(steg, tr.felt).style.minHeight = "0";
      var strek = H("div", "", rad);
      var ul = H("ul", "", rad);
      tr.liste.forEach(function (p) {
        var li = H("li", "margin:.12rem 0 .12rem .6rem;font-size:1rem;", ul);
        if (typeof p === "string") li.textContent = p;
        else F.felt(li, p.felt).style.minHeight = "0";
      });
      return { rad: rad, steg: steg, strek: strek, ul: ul };
    });
    var linje2 = H("div", "position:relative;height:1.1rem;border-left:" + LIN + ";", rot);
    spiss(linje2, "bottom:-1px;left:-5.75px;");
    var s = F.svg(rot, { w: 260, h: 46, tittel: "Beslutningspunkt 1", desc: "Rombe: Beslutningspunkt 1" });
    farge(S("polygon", { points: "4,23 130,2 256,23 130,44" }, s), GRONN, STREK, 1.5);
    tekst(s, 130, 23, "Beslutningspunkt 1", { str: 19 });

    /* Bredden måles på figuren (rammen rundt), ikke på rot: rot kan vokse med innholdet. */
    var modus = null, ro = window.ResizeObserver ? new ResizeObserver(function () { lag(); }) : null, fulgt = null;
    function lag() {
      var ramme = rot.closest ? rot.closest("figure") || host : host;
      if (ro && ramme !== fulgt) { fulgt = ramme; ro.observe(ramme); }
      var b = ramme.clientWidth || rot.clientWidth;
      var smal = b > 0 && b < 620;
      if (smal === modus) return;
      modus = smal;
      var PAD = smal ? ".6rem" : "1.2rem", LAB = smal ? "0rem" : "8.5rem", GAP = smal ? "0rem" : "1rem", BOKS = smal ? "10rem" : "11rem";
      var X = "(2px + " + PAD + " + " + LAB + " + " + GAP + " + " + BOKS + " / 2)";   // flytlinja målt fra venstre kant av rot
      kontekst.style.left = "calc(" + X + ")";
      linje1.style.marginLeft = linje2.style.marginLeft = "calc(" + X + " - .75px)";
      ros.setAttribute("style", "position:relative;border:2px solid var(--color-on-tone-heavy);border-radius:3rem;background:var(--color-tone-warn);padding:1rem " + PAD + ";display:flex;flex-wrap:" + (smal ? "wrap" : "nowrap") + ";align-items:center;gap:" + (smal ? ".5rem 0" : "0 " + GAP) + ";");
      rygg.style.left = "calc(" + X + " - 2px - .75px)";
      etikett.setAttribute("style", smal
        ? "flex:0 0 100%;position:relative;font-size:1.1rem;text-align:left;padding-left:calc(" + BOKS + " / 2 + .8rem);"
        : "flex:0 0 " + LAB + ";position:relative;font-size:1.1rem;text-align:center;");
      kol.setAttribute("style", "flex:1 1 " + (smal ? "100%" : "0") + ";min-width:0;display:flex;flex-direction:column;gap:" + (smal ? ".9rem" : "1rem") + ";");
      rader.forEach(function (r) {
        r.rad.setAttribute("style", "display:flex;flex-wrap:" + (smal ? "wrap" : "nowrap") + ";align-items:center;gap:.3rem 0;");
        r.steg.setAttribute("style", "position:relative;flex:0 0 " + BOKS + ";box-sizing:border-box;border:1.5px solid var(--color-outline);border-radius:4px;background:var(--color-surface-container-lowest);padding:.25rem;");
        r.strek.setAttribute("style", smal ? "display:none;" : "flex:0 0 1.2rem;border-top:1.5px dashed var(--color-on-surface);");
        r.ul.setAttribute("style", "flex:1 1 " + (smal ? "100%" : "0") + ";min-width:0;margin:0" + (smal ? " 0 0 calc(" + BOKS + " / 2 + .8rem)" : "") + ";padding:.1rem 0 .1rem .9rem;border-left:1.5px solid var(--color-on-surface);border-radius:.6rem 0 0 .6rem;list-style:disc;");
      });
      var BW = smal ? "min(16rem, 2 * " + X + ")" : "16rem";
      s.style.width = "calc(" + BW + ")"; s.style.maxWidth = "none";
      s.style.margin = "0 0 0 calc(" + X + " - " + BW + " / 2)";
    }
    lag();
    if (ro) ro.observe(rot);
    else window.addEventListener("resize", lag);
  };

  /* ---------- H2024-36: tre nivåer av CTI (s. 27) ---------- */
  IN.FIGURER["H2024-36"] = function (host, oppg) {
    var s = F.svg(host, { w: 420, h: 245, oppg: oppg, maks: 520 });
    function lag(pts, txt, y) {
      farge(S("polygon", { points: pts }, s), GUL, "var(--color-primary)", 2.2);
      tekst(s, 215, y, txt);
    }
    lag("215,8 140,100 290,100", "Nivå A", 70);
    lag("130,110 300,110 345,170 85,170", "Nivå B", 140);
    lag("78,178 352,178 400,238 30,238", "Nivå C", 208);
    tekst(s, 10, 84, "Nivåer av", { anker: "start" });
    tekst(s, 10, 106, "CTI", { anker: "start" });
  };

  /* ---------- H2024-38: utskrift av arp -a (s. 29) ----------
     Arket viser teksten som et dokumentutklipp; tegnet som tekstblokk med linjene fra figur.tekst. */
  IN.FIGURER["H2024-38"] = function (host, oppg) {
    var linjer = (oppg && oppg.figur && oppg.figur.tekst) || [];
    F.kode(host, linjer.join("\n"));
  };
})();
