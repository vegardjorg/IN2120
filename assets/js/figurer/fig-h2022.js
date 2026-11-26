/* ============================================================
   IN2120 guide · figurer/fig-h2022.js
   Eksamensfigurene fra H2022, tegnet på nytt med IN.fig (API øverst i fig-felles.js).
   Kilde: UiO, IN2120 eksamen H2022 (eksamen/in2120-2022-x.qa.pdf). Kontrollliste: plan/figurer/INVENTAR-h2022.md.

   Mal (én funksjon per oppgave; key = oppgavens key i assets/js/eksamensbank/h2022.js):
     IN.FIGURER["H2022-n"] = function (host, oppg) {
       var F = IN.fig;
       var s = F.svg(host, { w: 300, h: 200, oppg: oppg });
       // … bokser, piler, tekst. Svarfelt i figuren: F.felt(htmlNode, i) (i HTML, ikke i SVG).
     };
   Regler: tro mot arket (samme elementer, piler, etiketter, plassering), ikke røp svaret,
   tål flere kall (ingen global tilstand), temafarger via CSS-klassene i figurer.css.

   Lokale hjelpere (bare i denne fila, all stil som inline style-attributter):
     lag(host, W, H, { oppg, tittel, maks }) → { wrap, svg, W, H }: SVG i en relativ ramme, slik at
       svarfelt kan legges oppå tegningen med ovFelt(L, i, x, y, w, h, minRem) (mål i viewBox-enheter).
     T(parent, x, y, tekst, o): F.tekst med o.str som virker (CSS-klassen .fig-txt overstyrer attributtet).
     hd(tag, style, parent, tekst): HTML-element med inline stil.
   H2022-2.3 er en hotspot-oppgave (type H): klikkflatene i tegningen krysser av riktig radioknapp
   i øvingen (samme rekkefølge som inspera.alternativer). Lista under figuren virker som før.
   H2022-10.2 har ikke figur-felt i banken og gjenbruker derfor ikke figuren fra 10.1.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FIGURER = IN.FIGURER || {};
  var F = IN.fig;
  if (!F) return;
  var NS = "http://www.w3.org/2000/svg";

  /* ---------- Lokale hjelpere ---------- */
  function sv(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function hd(tag, style, parent, tekst) {
    var n = document.createElement(tag);
    if (style) n.setAttribute("style", style);
    if (tekst != null) n.textContent = tekst;
    if (parent) parent.appendChild(n);
    return n;
  }
  function T(parent, x, y, tekst, o) {
    o = o || {};
    var t = F.tekst(parent, x, y, tekst, o);
    if (o.str) t.style.fontSize = o.str + "px";
    if (o.mono) t.style.fontFamily = "var(--font-mono, ui-monospace, Consolas, monospace)";
    if (o.farge) t.style.fill = o.farge;
    return t;
  }
  /* Tekst med deler: [[tekst, { kursiv, mono }], …] */
  function Tdeler(parent, x, y, deler, o) {
    o = o || {};
    var t = T(parent, x, y, "", o);
    while (t.firstChild) t.removeChild(t.firstChild);
    deler.forEach(function (d) {
      var sp = sv("tspan", {}, t);
      sp.textContent = d[0];
      var st = "";
      if (d[1] && d[1].kursiv) st += "font-style:italic;";
      if (d[1] && d[1].mono) st += "font-family:var(--font-mono, ui-monospace, Consolas, monospace);";
      if (st) sp.setAttribute("style", st);
    });
    return t;
  }
  function stil(n, st) { n.setAttribute("style", st); return n; }
  function pc(v, tot) { return (Math.round(v / tot * 10000) / 100) + "%"; }

  function lag(host, W, H, o) {
    o = o || {};
    var wrap = hd("div", "position:relative;width:100%;max-width:" + (o.maks || W * 1.6) + "px;margin:0 auto", host);
    var svg = F.svg(wrap, { w: W, h: H, oppg: o.oppg, tittel: o.tittel, desc: o.desc });
    return { wrap: wrap, svg: svg, W: W, H: H };
  }
  /* Svarfelt oppå tegningen: midtstilt i rektangelet (x, y, w, h), minst minRem bredt. */
  function ovFelt(L, i, x, y, w, h, minRem) {
    var d = hd("div", "position:absolute;display:flex;align-items:center;justify-content:center;" +
      "left:" + pc(x + w / 2, L.W) + ";top:" + pc(y, L.H) + ";width:" + pc(w, L.W) + ";height:" + pc(h, L.H) +
      ";min-width:" + (minRem || 5.5) + "rem;transform:translateX(-50%)", L.wrap);
    var f = F.felt(d, i);
    f.style.minHeight = "1.7rem";
    f.style.maxWidth = "none";
    return d;
  }
  /* Felt i en HTML-flyt: flex-basis b (f.eks. "4.6rem" for små tallfelt). */
  function hFelt(parent, i, b, grow) {
    var d = hd("div", "display:flex;align-items:center;flex:" + (grow ? "1 1 " : "0 0 ") + b + ";min-width:" + (grow ? "5rem" : b), parent);
    var f = F.felt(d, i);
    f.style.minHeight = "1.9rem";
    f.style.maxWidth = "none";
    return d;
  }
  function person(s, cx, top, o) {
    o = o || {};
    var g = sv("g", {}, s);
    var st = o.fyll ? "fill:" + o.fyll + ";stroke:none" : "fill:none;stroke:currentColor;stroke-width:2.4";
    stil(sv("circle", { cx: cx, cy: top + 11, r: 10 }, g), st);
    stil(sv("path", { d: "M" + (cx - 18) + " " + (top + 46) + " Q" + (cx - 18) + " " + (top + 25) + " " + cx + " " + (top + 25) +
      " Q" + (cx + 18) + " " + (top + 25) + " " + (cx + 18) + " " + (top + 46) + (o.fyll ? " Z" : "") }, g), st);
    if (o.haar) stil(sv("path", { d: "M" + (cx - 10) + " " + (top + 12) + " Q" + (cx - 12) + " " + (top + 26) + " " + (cx - 15) + " " + (top + 28) +
      " M" + (cx + 10) + " " + (top + 12) + " Q" + (cx + 12) + " " + (top + 26) + " " + (cx + 15) + " " + (top + 28) }, g), st);
    return g;
  }
  function rodMarkor(s) {
    var id = s._pil + "-rod", defs = s.querySelector("defs");
    var mk = sv("marker", { id: id, viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "11", markerHeight: "11",
      markerUnits: "userSpaceOnUse", orient: "auto" }, defs);
    sv("path", { d: "M0 0 L10 5 L0 10 z", fill: "#e5534b" }, mk);
    return id;
  }
  function graaMarkor(s) {
    var id = s._pil + "-graa", defs = s.querySelector("defs");
    var mk = sv("marker", { id: id, viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "14", markerHeight: "14",
      markerUnits: "userSpaceOnUse", orient: "auto" }, defs);
    stil(sv("path", { d: "M0 0 L10 5 L0 10 z" }, mk), "fill:var(--color-on-surface-variant)");
    return id;
  }

  /* ---------- H2022-2.3: stakken (hotspot) ----------
     Kilde s. 7. Klikkflater i samme rekkefølge som inspera.alternativer:
     0 Returadresse, 1 Forrige rammepeker, 2 buffer, 3 main() ramme, 4 A() ramme, 5 ledig minne.
     Alle felt i B() har samme utseende (arkets grå farge er fasitmarkeringen og tegnes ikke). */
  IN.FIGURER["H2022-2.3"] = function (host, oppg) {
    var W = 420, H = 440, key = oppg.key;
    var s = F.svg(host, { w: W, h: H, oppg: oppg, tittel: "Stakken mens B() kjører", maks: 560 });
    T(s, 6, 22, "Høy adresse", { anker: "start" });
    T(s, 6, 420, "Lav adresse", { anker: "start" });
    // STACK (oransje) og ledig minne
    stil(sv("rect", { x: 120, y: 8, width: 292, height: 368 }, s), "fill:#f0904a;fill-opacity:.45;stroke:currentColor;stroke-width:1.6");
    stil(sv("rect", { x: 120, y: 376, width: 292, height: 56 }, s), "fill:var(--fig-bg);stroke:currentColor;stroke-width:1.6");
    T(s, 266, 28, "STACK");
    function ramme(y, h) {
      stil(sv("rect", { x: 138, y: y, width: 256, height: h }, s), "fill:var(--fig-bg);stroke:none");
      return stil(sv("rect", { x: 138, y: y, width: 256, height: h }, s), "fill:#6ec3f0;fill-opacity:.35;stroke:currentColor;stroke-width:1.4"); }
    ramme(46, 44); ramme(100, 44); ramme(154, 212);
    Tdeler(s, 266, 68, [["main()", { mono: true }], ["  ramme", null]]);
    Tdeler(s, 266, 122, [["A()", { mono: true }], ["  ramme", null]]);
    Tdeler(s, 266, 172, [["B()", { mono: true }], ["  ramme", null]]);
    F.boks(s, 156, 188, 200, 36, "", {});
    T(s, 166, 206, "Returadresse", { anker: "start", kursiv: true });
    F.boks(s, 156, 224, 200, 36, "", {});
    T(s, 166, 242, "Forrige rammepeker", { anker: "start", kursiv: true });
    F.boks(s, 156, 266, 200, 74, "", {});
    T(s, 166, 284, "buffer[9]", { anker: "start", kursiv: true, mono: true });
    T(s, 166, 303, "…", { anker: "start" });
    T(s, 166, 322, "buffer[0]", { anker: "start", kursiv: true, mono: true });
    F.pil(s, [[374, 336], [374, 272]]);
    T(s, 388, 354, "Skriver oppover", { anker: "end", str: 16 });
    // oransje blokkpil ned fra stakken mot ledig minne
    stil(sv("path", { d: "M258 370 h16 v10 h8 l-16 14 l-16 -14 h8 z" }, s), "fill:#e87a2e;stroke:currentColor;stroke-width:.8");
    T(s, 266, 414, "ledig minne");

    // Klikkflater
    var flater = [
      [156, 188, 200, 36, "Returadresse"], [156, 224, 200, 36, "Forrige rammepeker"], [156, 266, 200, 74, "buffer[9] … buffer[0]"],
      [138, 46, 256, 44, "main() ramme"], [138, 100, 256, 44, "A() ramme"], [120, 376, 292, 56, "ledig minne"]
    ];
    var rects = [];
    function finnInsp() {
      for (var a = host, n = 0; a && n < 7; a = a.parentNode, n++) {
        var f = a.querySelector && a.querySelector('.insp[data-key="' + key + '"]');
        if (f) return f;
      }
      return null;
    }
    function radio(insp, i) { return insp && insp.querySelector('.insp-alts input[type="radio"][value="' + i + '"]'); }
    function synk() {
      var insp = finnInsp();
      rects.forEach(function (r, i) {
        var inp = radio(insp, i), valgt = !!(inp && inp.checked);
        stil(r, "cursor:pointer;outline:none;" + (valgt ? "fill:var(--color-primary);fill-opacity:.16;stroke:var(--color-primary);stroke-width:3" : "fill:transparent;stroke:none"));
      });
    }
    function velg(i) {
      var inp = radio(finnInsp(), i);
      if (inp && !inp.disabled) inp.click();
      synk();
    }
    var gFlater = sv("g", {}, s);
    flater.forEach(function (f, i) {
      var r = sv("rect", { x: f[0], y: f[1], width: f[2], height: f[3], tabindex: "0", role: "button", "aria-label": "Velg: " + f[4] }, gFlater);
      sv("title", {}, r).textContent = f[4];
      r.addEventListener("click", function () { velg(i); });
      r.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); velg(i); } });
      r.addEventListener("focus", function () { r.style.stroke = "var(--color-primary)"; r.style.strokeWidth = "3"; r.style.strokeDasharray = "4 3"; });
      r.addEventListener("blur", synk);
      rects.push(r);
    });
    synk();
    // Øvingen lages etter figuren: koble på endringer (radioknapper, «Nullstill») når den finnes.
    setTimeout(function () {
      var insp = finnInsp();
      if (!insp) return;
      insp.addEventListener("change", synk);
      insp.addEventListener("click", function () { setTimeout(synk, 0); });
      synk();
    }, 0);
    hd("p", "margin:.3rem 0 0;font-size:var(--text-xs, .75rem);text-align:center;color:var(--color-on-surface-variant)", host,
      "Klikk på en del av figuren (eller velg i lista under).");
  };

  /* ---------- H2022-2.4 og 2.5: fire fargede lag (felt i hvert lag, ovenfra og ned) ---------- */
  var LAGFARGE = {
    turkis: ["rgba(64,240,190,.55)", "turkis"], gul: ["rgba(255,250,110,.55)", "gult"],
    lilla: ["rgba(200,165,190,.55)", "lilla/grått"], rosa: ["rgba(205,45,115,.85)", "mørk rosa"]
  };
  function lagStabel(host, rekke, tittel) {
    var box = hd("div", "display:flex;flex-direction:column;gap:.7rem;max-width:26rem;margin:0 auto;width:100%", host);
    box.setAttribute("role", "group");
    box.setAttribute("aria-label", tittel);
    rekke.forEach(function (navn, i) {
      var c = LAGFARGE[navn];
      var lagd = hd("div", "background:" + c[0] + ";border:2px solid #3f51a0;padding:.55rem 1.4rem;display:flex;justify-content:center", box);
      lagd.setAttribute("aria-label", "Lag " + (i + 1) + " ovenfra (" + c[1] + ")");
      lagd.setAttribute("title", c[1]);
      var f = F.felt(lagd, i);
      f.style.maxWidth = "none";
      f.style.background = "var(--color-surface-container-lowest)";
      f.style.borderRadius = "4px";
    });
  }
  IN.FIGURER["H2022-2.4"] = function (host) { lagStabel(host, ["turkis", "gul", "lilla", "rosa"], "Type 1-virtualisering: fire lag"); };
  IN.FIGURER["H2022-2.5"] = function (host) { lagStabel(host, ["turkis", "lilla", "gul", "rosa"], "Kontainerarkitektur: fire lag"); };

  /* ---------- H2022-3.2: e-posten (stilisert, samme rekkefølge som skjermbildet) ---------- */
  IN.FIGURER["H2022-3.2"] = function (host) {
    var kort = hd("div", "border:1px solid var(--color-outline);border-radius:8px;background:var(--color-surface-container-lowest);" +
      "color:var(--color-on-surface);padding:1rem 1.2rem;max-width:40rem;margin:0 auto;font-family:Arial, Helvetica, sans-serif;font-size:.95rem;line-height:1.45", host);
    kort.setAttribute("role", "img");
    kort.setAttribute("aria-label", "Skjermbilde av e-posten");
    var p = function (t, st) { return hd("p", "margin:0 0 .7rem;" + (st || ""), kort, t); };
    p("Kjære kunde,");
    p("Noe av kontoinformasjonen din kan mangle eller være feil. Oppdater kontoinformasjonen din umiddelbart slik at du kan fortsette å nyte alle fordelene med Netflix-kontoen din.");
    p("Hvis du ikke oppdaterer informasjonen din innen 24 timer, begrenser vi hva du kan gjøre med Netfix-kontoen din.");
    p("Bare klikk på URL-en nedenfor:", "margin-bottom:1.6rem");
    p("Takk for din interesse.");
    p("Hilsen,");
    p("Netflix-tjenester");
    var knapp = hd("div", "text-align:center;margin:.6rem 0 2.2rem", kort);
    hd("span", "display:inline-block;background:#d50000;color:#fff;font-weight:700;text-decoration:underline;padding:1rem 3.5rem;border-radius:3px;font-size:1.05rem", knapp, "Klikk her");
    var fot = hd("div", "font-size:.75rem;line-height:1.4", kort);
    hd("p", "margin:0 0 .4rem", fot, "Har du noen spørsmål? Ring 800 050 701");
    hd("p", "margin:0 0 .4rem", fot, "International BV");
    hd("p", "margin:0", fot, "Netflix sendte denne meldingen til et medlems e-post.");
    hd("p", "margin:0", fot, "SRC: 15973_cs_NO");
  };

  /* ---------- H2022-4.4: terminalen ---------- */
  IN.FIGURER["H2022-4.4"] = function (host) {
    F.terminal(host, [
      "PS C:\\Users\\nilsp> ssh silje@192.168.211.129",
      "silje@192.168.211.129's password:",
      "Welcome to Ubuntu 22.04.1 LTS (GNU/Linux 5.15.0-47-generic x86_64)",
      "",
      " * Documentation:  https://help.ubuntu.com",
      " * Management:     https://landscape.canonical.com",
      " * Support:        https://ubuntu.com/advantage",
      "",
      "11 updates can be applied immediately.",
      "To see these additional updates run: apt list --upgradable",
      "",
      "Last login: Tue Sep 13 12:52:01 2022 from 192.168.211.1",
      "silje@in:~$ sudo -l",
      "[sudo] password for silje:",
      "Matching Defaults entries for silje on in:",
      "    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin,",
      "    use_pty",
      "",
      "User silje may run the following commands on in:",
      "    (root) /usr/bin/python3",
      "silje@in:~$"
    ], { tittel: "silje@in: ~" });
    // Lange linjer (secure_path) brytes i stedet for å kreve vannrett rulling; innrykket på arket beholdes.
    var pre = host.querySelector("pre");
    if (pre) { pre.style.whiteSpace = "pre-wrap"; pre.style.overflowWrap = "anywhere"; pre.style.overflowX = "visible"; }
  };

  /* ---------- H2022-5.5: tellermodus, kryptering og dekryptering ----------
     Kilde s. 20. Begge halvdeler bruker E. T₁–T₃ (gul teller) og nøkkel K inn i E, E → ⊕, inn fra venstre M (C), ut C (M). */
  IN.FIGURER["H2022-5.5"] = function (host) {
    var c = F.celler(host, 2, { kol: 2 });
    function halv(celle, inn, ut, rolleInn, rolleUt, navn, desc) {
      var W = 315, H = 222, s = F.svg(celle, { w: W, h: H, tittel: navn, desc: desc });
      [95, 185, 275].forEach(function (cx, i) {
        var n = i + 1;
        F.boks(s, cx - 34, 6, 34, 28, "T_" + n, { rolle: "teller" });
        F.nokkel(s, cx + 14, 4, { str: 0.62 });
        T(s, cx + 30, 22, "K", { anker: "start", kursiv: true });
        F.pil(s, [[cx - 17, 34], [cx - 17, 52]]);
        F.pil(s, [[cx + 14, 30], [cx + 14, 52]]);
        F.boks(s, cx - 36, 52, 72, 40, "E", { rolle: "funk" });
        F.pil(s, [[cx, 92], [cx, 110]]);
        F.xor(s, cx, 120, 10);
        F.boks(s, cx - 64, 105, 36, 30, inn + "_" + n, { rolle: rolleInn });
        F.pil(s, [[cx - 28, 120], [cx - 10, 120]]);
        F.pil(s, [[cx, 130], [cx, 152]]);
        F.boks(s, cx - 18, 152, 36, 30, ut + "_" + n, { rolle: rolleUt });
      });
      T(s, 175, 206, navn);
    }
    halv(c[0], "M", "C", "klar", "chiffer", "Kryptering",
      "Kryptering: T1, T2 og T3 går sammen med nøkkelen K inn i hver sin E. Utgangen XOR-es med M1, M2 og M3 fra venstre, og ut kommer C1, C2 og C3.");
    halv(c[1], "C", "M", "chiffer", "klar", "Dekryptering",
      "Dekryptering: T1, T2 og T3 går sammen med nøkkelen K inn i hver sin E (også her E). Utgangen XOR-es med C1, C2 og C3 fra venstre, og ut kommer M1, M2 og M3.");
  };

  /* ---------- H2022-6.2: tre sertifikattrær ----------
     Kilde s. 22: rot → to mellomliggende; venstre mellomliggende → to subjekter, høyre → ett (tre subjekter per tre). */
  IN.FIGURER["H2022-6.2"] = function (host, oppg) {
    var s = F.svg(host, { w: 500, h: 182, oppg: oppg, tittel: "Tre sertifikattrær", maks: 640 });
    var st = "stroke:currentColor;stroke-width:2.4";
    function kant(x0, y0, x1, y1, r0, r1) {
      var dx = x1 - x0, dy = y1 - y0, l = Math.sqrt(dx * dx + dy * dy);
      F.pil(s, [[x0 + dx / l * r0, y0 + dy / l * r0], [x1 - dx / l * (r1 + 1), y1 - dy / l * (r1 + 1)]]);
    }
    [50, 150, 250].forEach(function (cx) {
      var rot = [cx, 22], m = [[cx - 17, 86], [cx + 17, 86]], sub = [[cx - 32, 152], [cx, 152], [cx + 32, 152]];
      stil(sv("circle", { cx: rot[0], cy: rot[1], r: 12 }, s), "fill:currentColor");
      m.forEach(function (p) {
        stil(sv("circle", { cx: p[0], cy: p[1], r: 11 }, s), "fill:var(--fig-bg);" + st);
        stil(sv("circle", { cx: p[0], cy: p[1], r: 4.5 }, s), "fill:currentColor");
        kant(rot[0], rot[1], p[0], p[1], 12, 11);
      });
      sub.forEach(function (p) { stil(sv("circle", { cx: p[0], cy: p[1], r: 12 }, s), "fill:var(--fig-bg);" + st); });
      kant(m[0][0], m[0][1], sub[0][0], sub[0][1], 11, 12);
      kant(m[0][0], m[0][1], sub[1][0], sub[1][1], 11, 12);
      kant(m[1][0], m[1][1], sub[2][0], sub[2][1], 11, 12);
    });
    T(s, 312, 22, "Rotsertifikater", { anker: "start", str: 21 });
    // «Mellomliggende sertifikater» på én linje når figuren er bred nok (viewBox utvides), ellers to linjer.
    var m1 = T(s, 312, 76, "Mellomliggende", { anker: "start", str: 21 });
    var m2 = T(s, 312, 98, "sertifikater", { anker: "start", str: 21 });
    var sist = null;
    function tilpass() {
      var b = s.getBoundingClientRect().width, bred = b >= 520;
      if (!b || bred === sist) return;
      sist = bred;
      s.setAttribute("viewBox", "0 0 " + (bred ? 600 : 500) + " 182");
      m1.textContent = bred ? "Mellomliggende sertifikater" : "Mellomliggende";
      m1.setAttribute("y", bred ? 86 : 76);
      m2.style.display = bred ? "none" : "";
    }
    if (window.ResizeObserver) new ResizeObserver(tilpass).observe(s);
    tilpass();
    T(s, 312, 152, "Subjektsertifikater", { anker: "start", str: 21 });
  };

  /* ---------- H2022-6.4: sertifikatvisningen (to sider) ---------- */
  IN.FIGURER["H2022-6.4"] = function (host) {
    var c = F.celler(host, 2, { kol: 2 });
    function side(celle) {
      celle.style.alignSelf = "start";
      var p = hd("div", "width:100%;border:1px solid var(--color-outline);border-radius:6px;background:var(--color-surface-container-lowest);" +
        "padding:.7rem .8rem;font-size:.78rem;line-height:1.35;color:var(--color-on-surface);align-self:stretch", celle);
      return p;
    }
    function seksjon(p, navn, rader, kritisk) {
      var sek = hd("div", "border-top:1px solid var(--color-outline-variant);padding:.5rem 0 .4rem;display:grid;grid-template-columns:minmax(6.5rem,max-content) minmax(0,1fr);column-gap:.7rem;row-gap:.15rem", p);
      var h = hd("div", "grid-column:1;text-align:right;font-weight:700;margin-bottom:.25rem", sek);
      if (kritisk) hd("span", "display:inline-block;width:1em;height:1em;line-height:1em;border-radius:50%;background:var(--color-on-surface);color:var(--color-surface-container-lowest);text-align:center;font-size:.7rem;margin-right:.3rem;vertical-align:.05em", h, "!");
      h.appendChild(document.createTextNode(navn));
      hd("div", "grid-column:2", sek);
      rader.forEach(function (r) {
        hd("div", "grid-column:1;text-align:right;font-weight:600", sek, r[0]);
        hd("div", "grid-column:2;overflow-wrap:anywhere" + (r[2] ? ";color:var(--color-primary)" : ""), sek, r[1]);
      });
    }
    var v = side(c[0]);
    hd("div", "font-size:1rem;margin:.1rem 0 .5rem", v, "Certificate");
    var faner = hd("div", "display:flex;flex-wrap:wrap;gap:.2rem .7rem;margin-bottom:.4rem;white-space:nowrap", v);
    hd("span", "color:var(--color-primary);border-bottom:2px solid var(--color-primary);padding:0 .4rem .2rem", faner, "uio.no");
    hd("span", "padding:0 0 .2rem", faner, "GEANT OV ECC CA 4");
    hd("span", "padding:0 0 .2rem", faner, "USERTrust ECC Certification Authority");
    seksjon(v, "Subject Name", [["Country", "NO"], ["State/Province", "Oslo"], ["Organization", "Universitetet i Oslo"], ["Common Name", "uio.no"]]);
    seksjon(v, "Issuer Name", [["Country", "NL"], ["Organization", "GEANT Vereniging"], ["Common Name", "GEANT OV ECC CA 4", true]]);
    seksjon(v, "Validity", [["Not Before", "Tue, 25 Oct 2022 00:00:00 GMT"], ["Not After", "Wed, 25 Oct 2023 23:59:59 GMT"]]);
    seksjon(v, "Subject Alt Names", [["DNS Name", "uio.no"], ["DNS Name", "www-int.uio.no"], ["DNS Name", "www.uio.no"]]);
    seksjon(v, "Public Key Info", [["Algorithm", "Elliptic Curve"], ["Key Size", "256"], ["Curve", "P-256"], ["Public Value", "04:88:04:D6:7E:5A:70:82:8D:21:C3:0F:FF:13:C2:5C:2A:04:22:6A:06:4F:…"]]);
    var h = side(c[1]);
    seksjon(h, "Miscellaneous", [["Serial Number", "00:B2:56:FC:31:86:45:68:67:42:B0:A9:07:09:6E:F5:5A"], ["Signature Algorithm", "ECDSA with SHA-256"], ["Version", "3"], ["Download", "PEM (cert) PEM (chain)", true]]);
    seksjon(h, "Fingerprints", [["SHA-256", "A8:4F:BB:E3:C9:66:B5:38:B7:E8:A4:E7:3F:5F:E0:85:13:80:49:9A:D1:68:…"], ["SHA-1", "36:78:D0:FF:51:2C:8A:72:D7:3D:6D:03:93:58:BA:87:6C:62:F4:6D"]]);
    seksjon(h, "Basic Constraints", [["Certificate Authority", "No"]], true);
    seksjon(h, "Key Usages", [["Purposes", "Digital Signature"]], true);
    seksjon(h, "Extended Key Usages", [["Purposes", "Server Authentication, Client Authentication"]]);
    seksjon(h, "Subject Key ID", [["Key ID", "BF:D7:11:0A:40:56:9D:6D:7A:24:FC:E0:51:D9:BE:6A:F0:F7:63:7F"]]);
    seksjon(h, "Authority Key ID", [["Key ID", "ED:B4:A0:33:6A:1B:08:91:B6:BD:FA:41:92:BD:9A:AB:AB:63:F4:53"]]);
    seksjon(h, "CRL Endpoints", []);
  };

  /* ---------- H2022-7.2: Tor-kjeden og løken (felt øverst i hvert lag, ytterst → innerst) ---------- */
  IN.FIGURER["H2022-7.2"] = function (host, oppg) {
    var s = F.svg(host, { w: 520, h: 118, oppg: oppg, tittel: "Ola, A, B, C og Kari", maks: 640 });
    person(s, 34, 8);
    T(s, 34, 100, "Ola", { str: 20 });
    person(s, 486, 8, { haar: true });
    T(s, 486, 100, "Kari", { str: 20 });
    [["A", 152], ["B", 260], ["C", 368]].forEach(function (m) {
      var x = m[1];
      stil(sv("rect", { x: x - 30, y: 12, width: 60, height: 42, rx: 2 }, s), "fill:var(--fig-bg);stroke:currentColor;stroke-width:5");
      stil(sv("path", { d: "M" + x + " 54 v12 M" + (x - 18) + " 68 h36" }, s), "fill:none;stroke:currentColor;stroke-width:5");
      T(s, x, 34, m[0], { fet: true, str: 22 });
    });
    [[62, 112], [192, 220], [300, 328], [408, 456]].forEach(function (p) {
      var pl = F.pil(s, [[p[0], 36], [p[1], 36]], { start: true });
      pl.style.strokeWidth = "3";
    });
    var lok = hd("div", "max-width:26rem;margin:.8rem auto 0;width:100%", host);
    lok.setAttribute("role", "group");
    lok.setAttribute("aria-label", "Pakken som løk: tre lag rundt «Pakke til Kari»");
    // Dekkende temafarger (ikke gjennomsiktige, så lagene ikke blandes til beige): blått, grønt, rosa som arket.
    var farger = [["var(--color-tone-info)", "ytterst, blått"], ["var(--color-tone-ok)", "midten, grønt"], ["var(--color-tone-danger)", "innerst, rosa"]];
    var forelder = lok;
    farger.forEach(function (fa, i) {
      var lag_ = hd("div", "background:" + fa[0] + ";border:1.5px solid var(--color-on-surface);border-radius:1.4rem;padding:.7rem .8rem .8rem;display:flex;flex-direction:column;gap:.7rem", forelder);
      lag_.setAttribute("aria-label", "Lag " + (i + 1) + " (" + fa[1] + ")");
      var f = F.felt(lag_, i);
      f.style.maxWidth = "none";
      f.style.background = "var(--color-surface-container-lowest)";
      f.style.borderRadius = "4px";
      forelder = lag_;
    });
    hd("div", "background:#6b6b6b;color:#fff;border:1px solid #333;border-radius:.8rem;padding:1.2rem 1rem;font-size:1.5rem", forelder, "Pakke til Kari");
  };

  /* ---------- H2022-8.2: skåringsfordelingene ---------- */
  IN.FIGURER["H2022-8.2"] = function (host, oppg) {
    var W = 480, H = 318, s = F.svg(host, { w: W, h: H, oppg: oppg, tittel: "Statistiske egenskaper ved et biometrisk system", maks: 680 });
    var OX = 122, OY = 262, TX = 300;
    function kurve(mu, sigV, sigH, topp, x0, x1) {
      var pts = [];
      for (var x = x0; x <= x1; x += 2) pts.push([x, OY - topp * Math.exp(-Math.pow((x - mu) / (x < mu ? sigV : sigH), 2) / 2)]);
      return pts;
    }
    // Ikke-genuin: høy og smal med lang hale mot høyre; genuin: lavere og bredere (som på arket).
    var ikke = kurve(196, 30, 52, 150, OX, 372), gen = kurve(352, 50, 56, 88, 232, 472);
    var defs = s.querySelector("defs"), pid = s._pil + "-skr";
    var pat = sv("pattern", { id: pid, width: "6", height: "6", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
    stil(sv("line", { x1: 0, y1: 0, x2: 0, y2: 6 }, pat), "stroke:currentColor;stroke-width:1.2");
    function flate(pts) {
      var d = "M" + pts[0][0] + " " + OY + " " + pts.map(function (p) { return "L" + p[0] + " " + p[1]; }).join(" ") + " L" + pts[pts.length - 1][0] + " " + OY + " Z";
      stil(sv("path", { d: d }, s), "fill:url(#" + pid + ");stroke:none");
    }
    flate(gen.filter(function (p) { return p[0] <= TX; }));
    flate(ikke.filter(function (p) { return p[0] >= TX; }));
    [ikke, gen].forEach(function (pts) { stil(F.linje(s, pts), "stroke:#4a6fb5;stroke-width:1.8"); });
    F.pil(s, [[OX, OY], [OX, 70]]);
    F.pil(s, [[OX, OY], [W - 6, OY]]);
    T(s, W / 2, 16, "Statistiske egenskaper ved et biometrisk system", { fet: true, str: 17 });
    Tdeler(s, 4, 112, [["sannsynlighet ", null], ["p", { kursiv: true }]], { anker: "start", str: 16 });
    T(s, 4, 132, "(frekvens)", { anker: "start", str: 17 });
    T(s, 136, 46, "Skåringsfordeling", { anker: "start", str: 17 });
    T(s, 136, 64, "for ikke-genuine", { anker: "start", str: 17 });
    T(s, 136, 82, "brukere", { anker: "start", str: 17 });
    T(s, 400, 132, "Skåringsfordeling", { str: 17 });
    T(s, 400, 150, "for genuine brukere", { str: 17 });
    F.linje(s, [[TX, 88], [TX, OY + 8]]).style.strokeWidth = "2";
    T(s, TX - 6, 98, "non-match", { anker: "end", str: 17 });
    T(s, TX + 6, 98, "match", { anker: "start", str: 17 });
    var g = graaMarkor(s);
    stil(sv("path", { d: "M" + (TX - 12) + " 116 H" + (TX - 70), "marker-end": "url(#" + g + ")" }, s), "fill:none;stroke:var(--color-on-surface-variant);stroke-width:1.6");
    stil(sv("path", { d: "M" + (TX + 10) + " 116 H" + (TX + 40), "marker-end": "url(#" + g + ")" }, s), "fill:none;stroke:var(--color-on-surface-variant);stroke-width:1.6");
    T(s, TX, 282, "T", { kursiv: true, str: 18 });
    T(s, 256, 300, "FNMR", { str: 16 });
    T(s, 344, 300, "FMR", { str: 16 });
    F.linje(s, [[262, 290], [288, 254]], { stiplet: true }).style.strokeWidth = "1";
    F.linje(s, [[338, 290], [312, 256]], { stiplet: true }).style.strokeWidth = "1";
    Tdeler(s, W - 8, 286, [["skåring ", null], ["S", { kursiv: true }]], { anker: "end", str: 17 });
  };

  /* ---------- H2022-8.3: FIDO 2.0 (10 felt: etapper øverst, meldinger på pilene, tallfelt inntil pilene, nøkler under) ---------- */
  IN.FIGURER["H2022-8.3"] = function (host) {
    var rot = hd("div", "color:var(--color-on-surface);font-size:1rem;display:flex;flex-direction:column;gap:.7rem;width:100%", host);
    hd("div", "text-align:center;font-weight:700;font-size:1.05rem", rot, "Brukerautentisering med FIDO 2.0");
    function spiss(parent, mot) {
      var s = sv("svg", { viewBox: "0 0 10 12", width: "10", height: "12", "aria-hidden": "true" }, parent);
      s.setAttribute("style", "flex:0 0 auto;display:block");
      stil(sv("path", { d: mot === "v" ? "M10 0 L0 6 L10 12 z" : "M0 0 L10 6 L0 12 z" }, s), "fill:currentColor");
    }
    function strek(parent, venstre, hoyre, b) {
      var d = hd("div", "display:flex;align-items:center;flex:1 1 " + (b || "1rem") + ";min-width:1.2rem", parent);
      if (venstre) spiss(d, "v");
      hd("div", "flex:1;height:2px;background:currentColor", d);
      if (hoyre) spiss(d, "h");
      return d;
    }
    function stopp(parent) { hd("div", "flex:0 0 3px;width:3px;height:1.5rem;background:currentColor", parent); }
    // Øverst: etappene (dobbeltpiler med endestreker)
    var r1 = hd("div", "display:flex;flex-wrap:wrap;gap:.5rem 1.5rem", rot);
    [0, 1].forEach(function (i) {
      var seg = hd("div", "display:flex;align-items:center;gap:.3rem;flex:1 1 15rem", r1);
      seg.setAttribute("aria-label", i ? "Pil mellom FIDO-enhet og Autentiseringstjener" : "Pil mellom Bruker og FIDO-enhet");
      stopp(seg); strek(seg, true, false); hFelt(seg, i, "11rem", true); strek(seg, false, true); stopp(seg);
    });
    // Midten: aktørene og meldingene
    var r2 = hd("div", "display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.6rem .5rem", rot);
    var kB = hd("div", "display:flex;flex-direction:column;align-items:center;flex:0 0 auto", r2);
    hd("div", "", kB, "Bruker");
    var sb = F.svg(kB, { w: 48, h: 56, tittel: "Bruker", desc: "Personikon" });
    sb.style.width = "3rem";
    person(sb, 24, 6, { fyll: "#3d6fc2" });
    var segA = hd("div", "display:flex;align-items:center;gap:.3rem;flex:1 1 10rem", r2);
    strek(segA, false, false, ".6rem"); hFelt(segA, 2, "7rem", true); hFelt(segA, 3, "4.6rem"); strek(segA, false, true, ".8rem");

    var kF = hd("div", "display:flex;flex-direction:column;align-items:center;gap:.3rem;flex:0 0 8.6rem", r2);
    hd("div", "", kF, "FIDO-enhet");
    var sf = F.svg(kF, { w: 130, h: 96, tittel: "FIDO-enhet", desc: "Boks med mobil, sikkerhetsnøkkel, eID-kort, bærbar PC og en nøkkel" });
    sf.style.width = "8.5rem";
    stil(sv("rect", { x: 2, y: 2, width: 126, height: 92, rx: 10 }, sf), "fill:var(--fig-bg);stroke:currentColor;stroke-width:2");
    stil(sv("rect", { x: 12, y: 10, width: 22, height: 40, rx: 4 }, sf), "fill:#5a8fd6;stroke:currentColor;stroke-width:1");
    stil(sv("rect", { x: 44, y: 10, width: 42, height: 14, rx: 3 }, sf), "fill:#2c3e8f");
    stil(sv("circle", { cx: 74, cy: 17, r: 4 }, sf), "fill:#e8b923");
    stil(sv("rect", { x: 44, y: 30, width: 44, height: 24, rx: 3 }, sf), "fill:#4fb3e0");
    T(sf, 66, 42, "eID", { fet: true, str: 13, farge: "#fff" });
    stil(sv("path", { d: "M14 60 h42 l4 22 h-50 z M6 82 h60 v5 h-60 z" }, sf), "fill:#9aa3ad;stroke:currentColor;stroke-width:1");
    F.nokkel(sf, 104, 54, { str: 0.62 });
    F.felt(hd("div", "width:8.6rem;display:flex", kF), 8).style.maxWidth = "none";

    var segB = hd("div", "display:flex;flex-direction:column;gap:.5rem;flex:1 1 12rem", r2);
    var bt = hd("div", "display:flex;align-items:center;gap:.3rem", segB);
    strek(bt, true, false, ".8rem"); hFelt(bt, 4, "4.6rem"); hFelt(bt, 5, "7rem", true); strek(bt, false, false, ".6rem");
    var bb = hd("div", "display:flex;align-items:center;gap:.3rem", segB);
    strek(bb, false, false, ".6rem"); hFelt(bb, 6, "7rem", true); hFelt(bb, 7, "4.6rem"); strek(bb, false, true, ".8rem");

    var kT = hd("div", "display:flex;flex-direction:column;align-items:center;gap:.3rem;flex:0 0 9.8rem", r2);
    hd("div", "font-size:.95rem;white-space:nowrap", kT, "Autentiseringstjener");
    var st = F.svg(kT, { w: 110, h: 96, tittel: "Autentiseringstjener", desc: "Boks med tjener, nøkkel og et skilt PKI" });
    st.style.width = "7.5rem";
    stil(sv("rect", { x: 2, y: 2, width: 106, height: 92, rx: 10 }, st), "fill:var(--fig-bg);stroke:currentColor;stroke-width:2");
    stil(sv("rect", { x: 40, y: 8, width: 30, height: 46, rx: 2 }, st), "fill:#9aa3ad;stroke:currentColor;stroke-width:1");
    stil(sv("path", { d: "M45 16 h20 M45 22 h20 M45 28 h20" }, st), "stroke:currentColor;stroke-width:1.2");
    F.nokkel(st, 20, 52, { str: 0.62 });
    stil(sv("path", { d: "M72 62 L56 72 M72 62 L88 72" }, st), "stroke:currentColor;stroke-width:1.2;fill:none");
    stil(sv("circle", { cx: 72, cy: 61, r: 3.5 }, st), "fill:currentColor");
    stil(sv("rect", { x: 46, y: 72, width: 54, height: 18 }, st), "fill:var(--fig-bg);stroke:currentColor;stroke-width:1.4");
    T(st, 73, 81, "PKI", { str: 14 });
    F.felt(hd("div", "width:8.6rem;display:flex", kT), 9).style.maxWidth = "none";
  };

  /* ---------- H2022-9.4: ABAC (felt i fem bokser + sekskanten; fire røde piler, ingen fra forespørselsattributtene) ---------- */
  IN.FIGURER["H2022-9.4"] = function (host, oppg) {
    var L = lag(host, 460, 412, { oppg: oppg, tittel: "ABAC-modellen", maks: 760 }), s = L.svg;
    var rod = rodMarkor(s), gr = graaMarkor(s);
    var kant = "stroke:currentColor;stroke-width:1.4";
    // Forespørsels-attributter (rosa parallellogram), lavere enn AC-policyer: rett over «forespørsel:»-pila som på arket
    stil(sv("polygon", { points: "4,42 140,42 154,136 18,136" }, s), "fill:#f4a6a6;fill-opacity:.45;" + kant);
    T(s, 79, 58, "Forespørsels-", { str: 17 });
    T(s, 79, 75, "attributter", { str: 17 });
    // AC-policyer (grønn)
    stil(sv("rect", { x: 164, y: 8, width: 136, height: 94 }, s), "fill:#b5d98a;fill-opacity:.5;" + kant);
    T(s, 232, 26, "AC-policyer", { str: 18 });
    // Kontekstattributter (sky)
    var cx = 386, cy = 56, rx = 70, ry = 48, n = 11, pts = [];
    for (var k = 0; k <= n; k++) { var a = Math.PI * 2 * k / n; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (k = 1; k <= n; k++) {
      var dx = pts[k][0] - pts[k - 1][0], dy = pts[k][1] - pts[k - 1][1], r = Math.sqrt(dx * dx + dy * dy) * 0.6;
      d += " A" + r.toFixed(1) + " " + r.toFixed(1) + " 0 0 1 " + pts[k][0].toFixed(1) + " " + pts[k][1].toFixed(1);
    }
    stil(sv("path", { d: d + " Z" }, s), "fill:#c9d7f2;fill-opacity:.45;" + kant);
    T(s, cx, 28, "Kontekst-", { str: 17 });
    T(s, cx, 44, "attributter", { str: 17 });
    // Subjekt-bruker, forespørsel
    person(s, 34, 150, { fyll: "#3d6fc2" });
    T(s, 34, 220, "Subjekt-", { str: 17 });
    T(s, 34, 239, "bruker", { str: 17 });
    T(s, 58, 160, "forespørsel:", { anker: "start", str: 17 });
    stil(sv("path", { d: "M62 186 H148", "marker-end": "url(#" + gr + ")" }, s), "fill:none;stroke:var(--color-on-surface-variant);stroke-width:3.5;stroke-dasharray:8 5");
    // ABAC-funksjoner (sekskant) med tannhjul
    stil(sv("polygon", { points: "174,134 292,134 312,190 292,246 174,246 154,190" }, s), "fill:#fff6a8;fill-opacity:.55;" + kant);
    T(s, 233, 151, "ABAC-funksjoner", { str: 16 });
    [[294, 236, 9, "#3d8fd6"], [314, 224, 5, "#9cc8e8"], [308, 250, 5, "#e6e07a"]].forEach(function (g) {
      stil(sv("circle", { cx: g[0], cy: g[1], r: g[2] }, s), "fill:" + g[3] + ";stroke:" + g[3] + ";stroke-width:" + (g[2] * 0.6) + ";stroke-dasharray:" + (g[2] * 0.35) + " " + (g[2] * 0.35));
      stil(sv("circle", { cx: g[0], cy: g[1], r: g[2] * 0.35 }, s), "fill:#222");
    });
    // tilgang → Objekt-ressurser (sylinder)
    T(s, 318, 168, "tilgang", { anker: "start", str: 17 });
    stil(sv("path", { d: "M314 190 H372", "marker-end": "url(#" + gr + ")" }, s), "fill:none;stroke:var(--color-on-surface-variant);stroke-width:3.5;stroke-dasharray:8 5");
    stil(sv("path", { d: "M376 164 V226 A40 9 0 0 0 456 226 V164" }, s), "fill:#f4b6d8;fill-opacity:.45;" + kant);
    stil(sv("ellipse", { cx: 416, cy: 164, rx: 40, ry: 9 }, s), "fill:#f4b6d8;fill-opacity:.6;" + kant);
    T(s, 416, 196, "Objekt-", { str: 17 });
    T(s, 416, 213, "ressurser", { str: 17 });
    // Subjekt- og objektattributter
    stil(sv("rect", { x: 46, y: 300, width: 170, height: 104, rx: 10 }, s), "fill:#3ee8a0;fill-opacity:.4;" + kant);
    T(s, 131, 318, "Subjektattributter", { str: 17 });
    stil(sv("rect", { x: 244, y: 300, width: 170, height: 104, rx: 10 }, s), "fill:#ffb070;fill-opacity:.45;" + kant);
    T(s, 329, 318, "Objektattributter", { str: 17 });
    // Fire røde stiplede piler inn i sekskanten
    var rs = "fill:none;stroke:#e5534b;stroke-width:3;stroke-dasharray:7 5";
    [["M232 104 Q232 120 233 132"], ["M360 104 Q330 122 292 136"], ["M131 298 Q140 270 196 248"], ["M329 298 Q322 270 272 248"]].forEach(function (p) {
      stil(sv("path", { d: p[0], "marker-end": "url(#" + rod + ")" }, s), rs);
    });
    // Felt: 0 AC-policyer, 1 Kontekst, 2 Forespørsels, 3 ABAC-funksjoner, 4 Subjekt, 5 Objekt
    ovFelt(L, 0, 174, 44, 116, 46, 6);
    ovFelt(L, 1, 330, 60, 112, 40, 6);
    ovFelt(L, 2, 24, 88, 116, 42, 6);
    ovFelt(L, 3, 172, 168, 122, 44, 6.5);
    ovFelt(L, 4, 58, 336, 146, 50, 6.5);
    ovFelt(L, 5, 256, 336, 146, 50, 6.5);
  };

  /* ---------- H2022-10.1: prosessen for risikostyring (4 trinnfelt + 3 «Består bl.a. av:»-felt) ---------- */
  IN.FIGURER["H2022-10.1"] = function (host, oppg) {
    var L = lag(host, 400, 458, { oppg: oppg, tittel: "Risikostyring for informasjonssikkerhet", maks: 620 }), s = L.svg;
    T(s, 200, 15, "Risikostyring for informasjonssikkerhet", { fet: true, str: 17 });
    stil(sv("rect", { x: 3, y: 32, width: 394, height: 420 }, s), "fill:none;stroke:#2f5fd0;stroke-width:2.5;stroke-dasharray:7 4");
    var SX = 42, SW = 186, SH = 46, MX = SX + SW / 2, gronn = "fill:none;stroke:#7cb342;stroke-width:2";
    function trinn(y) {
      stil(sv("rect", { x: SX, y: y, width: SW, height: SH }, s), "fill:var(--fig-bg);" + "stroke:#7cb342;stroke-width:2");
      stil(sv("path", { d: "M" + (SX + 10) + " " + y + " v" + SH + " M" + (SX + SW - 10) + " " + y + " v" + SH }, s), gronn);
    }
    function diamant(cy, navn) {
      stil(sv("polygon", { points: MX + "," + (cy - 20) + " " + (MX + 22) + "," + cy + " " + MX + "," + (cy + 20) + " " + (MX - 22) + "," + cy }, s),
        "fill:#c5e1a5;fill-opacity:.6;stroke:#7cb342;stroke-width:1.6");
      T(s, MX + 30, cy, navn, { anker: "start", str: 16 });
    }
    function klamme(x, y0, y1) {
      var ym = (y0 + y1) / 2;
      stil(sv("path", { d: "M" + (x + 8) + " " + y0 + " Q" + x + " " + y0 + " " + x + " " + (y0 + 8) + " V" + (ym - 6) + " Q" + x + " " + ym + " " + (x - 7) + " " + ym +
        " Q" + x + " " + ym + " " + x + " " + (ym + 6) + " V" + (y1 - 8) + " Q" + x + " " + y1 + " " + (x + 8) + " " + y1 }, s), "fill:none;stroke:currentColor;stroke-width:1.3");
      return ym;
    }
    function bestaar(y, i, stiplet) {
      T(s, 254, y, "Består bl.a. av:", { anker: "start", str: 15 });
      var ym = klamme(246, y - 6, y + 52);
      F.linje(s, [[SX + SW, ym], [239, ym]], { stiplet: stiplet }).style.strokeWidth = "1";
      ovFelt(L, i, 256, y + 12, 136, 38, 6);
    }
    // Trinn 1
    trinn(52); ovFelt(L, 0, SX + 12, 52, SW - 24, SH, 7);
    bestaar(52, 1, false);
    F.pil(s, [[MX, 98], [MX, 122]]);
    // Trinn 2 (avrundet, gul)
    stil(sv("rect", { x: SX, y: 122, width: SW, height: SH, rx: 23 }, s), "fill:#fff59d;fill-opacity:.55;stroke:#2f3f9f;stroke-width:2");
    ovFelt(L, 2, SX + 16, 122, SW - 32, SH, 7);
    bestaar(128, 3, true);
    F.pil(s, [[MX, 168], [MX, 190]]);
    // Beslutningspunkt 1
    diamant(210, "Beslutningspunkt 1");
    T(s, MX - 30, 196, "N", { str: 15 });
    T(s, MX + 10, 240, "J", { str: 15 });
    F.pil(s, [[MX - 22, 210], [20, 210], [20, 86], [SX, 86]]);
    F.pil(s, [[MX, 230], [MX, 254]]);
    // Trinn 3
    trinn(254); ovFelt(L, 4, SX + 12, 254, SW - 24, SH, 7);
    bestaar(260, 5, true);
    F.pil(s, [[MX, 300], [MX, 322]]);
    // Beslutningspunkt 2
    diamant(342, "Beslutningspunkt 2");
    T(s, MX - 30, 328, "N", { str: 15 });
    T(s, MX + 10, 372, "J", { str: 15 });
    F.pil(s, [[MX - 22, 342], [11, 342], [11, 70], [SX, 70]]);
    F.pil(s, [[MX, 362], [MX, 386]]);
    // Trinn 4
    trinn(386); ovFelt(L, 6, SX + 12, 386, SW - 24, SH, 7);
  };
  // H2022-10.2 viser til figuren i 10.1, men har ikke figur-felt i banken. Ingen alias her (se rapport/inventar).
})();
