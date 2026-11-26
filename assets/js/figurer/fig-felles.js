/* ============================================================
   IN2120 guide · figurer/fig-felles.js
   Felles hjelpere for å tegne eksamensfigurer på nytt (IN.fig). Stil: assets/css/figurer.css.
   Lastes etter core.js og før fig-h20XX.js. Klassisk script, ingen moduler.

   TEGNEFUNKSJON (i fig-h20XX.js):
     IN.FIGURER["H2025-8"] = function (host, oppg) { … };
       host = tom <div class="exam-fig-h"> i <figure class="insp-fig">. Tegn alt inn i host.
       Må tåle å kalles flere ganger (nytt host hver gang). Ingen global tilstand.
       oppg.figur.beskrivelse blir <title>/<desc> via IN.fig.svg(…, { oppg }).

   ETIKETTER: "M_1" → M med senket 1, "C_{12}" → C med senket 12, "x^2" → hevet 2. Vanlig tekst ellers.

   SVG (alle mål i viewBox-enheter; svg-en skalerer til bredden, maks bredde via opts.maks i px):
     IN.fig.svg(parent, { w, h, oppg?, tittel?, desc?, maks?, klasse? }) → svg
       Lager <svg viewBox="0 0 w h" role="img"> med <title>/<desc> og en pilspiss-markør med unik id.
     IN.fig.g(parent, klasse?) → <g>
     IN.fig.boks(parent, x, y, w, h, etikett, { rolle?, kursiv?, klasse?, r? }) → { g, x, y, w, h, cx, cy, topp, bunn, venstre, hoyre }
       rolle: "klar" (klartekst: hul boks, tykk kant) | "chiffer" (chiffertekst: fylt mørk boks) |
              "funk" (funksjon som E/D/H: fylt temafarge, fet) | "teller" (teller/IV/nonce: tonet fyll, stiplet indre kant) |
              "noytral" (standard: tynn kant) | "uthev" (tonet, tykk kant). kursiv: standard true unntatt funk/noytral.
     IN.fig.tekst(parent, x, y, tekst, { anker?: "middle"|"start"|"end", kursiv?, fet?, str?, klasse? }) → <text>
       y er midtlinja (dominant-baseline: central).
     IN.fig.pil(parent, punkter, { stiplet?, klasse?, start? }) → <path>   punkter = [[x,y], …], spiss i siste punkt
       (start: true gir spiss i begge ender).
     IN.fig.linje(parent, punkter, { stiplet?, klasse? }) → <path>       som pil, uten spiss
     IN.fig.brutt(parent, y, x0, x1, kryss, { gap? }) → linje fra x0 til x1 på høyde y, brutt ±gap rundt hver x i kryss
       (som nøkkellinja på arket, som «hopper over» datalinjene).
     IN.fig.xor(parent, cx, cy, r?) → <g>  (sirkel med kryss, ⊕)
     IN.fig.nokkel(parent, x, y, { etikett?: "K", str? }) → <g>  nøkkelsymbol, (x, y) = toppen av hodet, høyde ≈ 40·str.
       Etiketten står til venstre for nøkkelen.
     IN.fig.panel(parent, x, y, w, h, overskrift?) → <g>  ramme med overskrift (gruppe/del av figuren)

   HTML-BLOKKER (for programutdata, kode og tabeller; ikke SVG-kunst):
     IN.fig.celler(host, n, { kol?: n, klasse? }) → [celle, …]
       Rutenett med n HTML-celler (div.fig-celle). Står side om side når figuren er bred nok, stables
       vertikalt når figuren er smalere enn 700 px (container query; da står hver celle i full bredde, maks 340 px).
       Lag SVG-er som er lesbare ved ca. 220 px bredde: viewBox ~310 bred, tekst 17 (standard). Tegn én SVG per celle, og legg
       svarfeltet under med IN.fig.felt(celle, i).
     IN.fig.terminal(host, tekst | [linjer], { tittel?, klasse? }) → div.fig-term (tittellinje + <pre>)
     IN.fig.kode(host, tekst, { tittel?, klasse? }) → div.fig-kode (<pre><code>)
     IN.fig.tabell(host, { hode?: [..], rader: [[..], ..], klasse?, tittel? }) → <table class="fig-tab">
       Celleverdi: streng (HTML) eller { felt: i } for et svarfelt i cella, eller { html, klasse }.

   SVARFELT I FIGUREN (D/N/T):
     IN.fig.felt(forelder, indeks, { etikett? }) → div.fig-felt[data-felt=indeks]
       Legger en plassholder for oppgavens felt nr. indeks (0-basert, samme rekkefølge som inspera.felt)
       i et HTML-element (f.eks. en celle fra IN.fig.celler, eller et { felt: i } i IN.fig.tabell).
       inspera.js flytter feltet dit (select/input). Lagring, retting og markering er uendret. Felt uten
       plassholder står i lista under figuren som før. Ikke legg plassholdere inni SVG (ingen foreignObject).
       etikett: kort synlig merkelapp foran feltet (bare hvis arket har det), ellers bare feltet.

   GJENBRUK I FORKLARINGER (teori- og øvingsfaner, aldri eksamensfanen):
     IN.fig.vis(host, key, { lenke?: true, husk?: false, tekst?: html }) → <figure> | null
       Tegner IN.FIGURER[key] (eneste tegning, felles datakilde; oppgaven hentes fra IN_EXAM_BANK) uten svarfelt:
       plassholderne .fig-felt fjernes, ingen øving, ingen fasit. Bildetekst «Fra eksamen H20XX oppg. n» som
       lenker til eksamenskortet på blokksiden (#fane=eksamen&oppg=o-<key>, . → _; core.js åpner fanen og kortet).
       husk: true viser IN.FIG_HUSK[key] under figuren (bare der forklaringen handler om nettopp det skillet).
       tekst: kort egen merknad (html) i bildeteksten, f.eks. et avvik mot 2026-pensum.
       host: element eller selektor. Figuren får data-fig-vis=<key> (ikke data-fig-key, så inspera.js aldri
       flytter øvingsfelt inn i den). Kan kalles flere ganger.
     IN.fig.side(key) → "02-krypto.html" (blokksiden der eksamenskortet står), IN.fig.dyplenke(key) → href.

   EKSEMPEL:
     IN.FIGURER["H20XX-n"] = function (host, oppg) {
       var F = IN.fig, c = F.celler(host, 2);
       var s = F.svg(c[0], { w: 300, h: 200, oppg: oppg, tittel: "Venstre diagram" });
       var m = F.boks(s, 20, 10, 40, 30, "M_1", { rolle: "klar" });
       var e = F.boks(s, 20, 80, 56, 40, "E", { rolle: "funk" });
       F.pil(s, [[m.cx, m.bunn], [m.cx, e.topp]]);
       F.felt(c[0], 0);
     };
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FIGURER = IN.FIGURER || {};
  var NS = "http://www.w3.org/2000/svg", seq = 0;

  function s(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null && attrs[k] !== false) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, attrs, parent) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (attrs[k] == null || attrs[k] === false) continue;
      if (k === "text") n.textContent = attrs[k]; else if (k === "html") n.innerHTML = attrs[k]; else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  function plain(x) { var d = document.createElement("div"); d.innerHTML = String(x == null ? "" : x); return (d.textContent || "").replace(/\s+/g, " ").trim(); }
  function svgRoot(n) { while (n && n.nodeName.toLowerCase() !== "svg") n = n.parentNode; return n; }
  function d(punkter) { return punkter.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" "); }

  /* "M_1" / "C_{12}" / "x^2" → tspans. Hevet/senket med dy (baseline-shift virker ikke i Firefox). */
  function fyllTekst(t, tekst) {
    // Forskyvning måles i grunn-em; dy i en liten tspan er i dens egen em (70 %).
    var re = /([_^])(\{[^}]*\}|.)/g, last = 0, m, cur = 0;
    tekst = String(tekst);
    function del(txt, maal, liten) {
      var dyBase = maal - cur, dy = Math.round(dyBase / (liten ? 0.7 : 1) * 1000) / 1000;
      var sp = s("tspan", { dy: dy ? dy + "em" : null, "font-size": liten ? "70%" : null }, t);
      sp.textContent = txt;
      cur = maal;
    }
    while ((m = re.exec(tekst))) {
      if (m.index > last) del(tekst.slice(last, m.index), 0, false);
      var inn = m[2].charAt(0) === "{" ? m[2].slice(1, -1) : m[2];
      del(inn, m[1] === "_" ? 0.3 : -0.45, true);
      last = re.lastIndex;
    }
    if (last < tekst.length || cur) del(tekst.slice(last), 0, false);
    return t;
  }

  var F = (IN.fig = {});

  F.svg = function (parent, o) {
    o = o || {};
    var id = "fig" + (++seq);
    var svg = s("svg", { viewBox: "0 0 " + o.w + " " + o.h, class: "fig-tegning" + (o.klasse ? " " + o.klasse : ""),
      role: "img", "aria-labelledby": id + "-t " + id + "-d", preserveAspectRatio: "xMidYMid meet" });
    if (o.maks) svg.style.maxWidth = o.maks + "px";
    var desc = o.desc != null ? o.desc : (o.oppg && o.oppg.figur && o.oppg.figur.beskrivelse) || "";
    s("title", { id: id + "-t" }, svg).textContent = o.tittel || (o.oppg && o.oppg.title) || "Figur";
    s("desc", { id: id + "-d" }, svg).textContent = plain(desc);
    var defs = s("defs", {}, svg);
    var mk = s("marker", { id: id + "-pil", viewBox: "0 0 10 10", refX: "9.5", refY: "5", markerWidth: "8", markerHeight: "8",
      markerUnits: "userSpaceOnUse", orient: "auto-start-reverse" }, defs);
    s("path", { d: "M0 0 L10 5 L0 10 z", fill: "currentColor" }, mk);
    svg._pil = id + "-pil";
    if (parent) parent.appendChild(svg);
    return svg;
  };

  F.g = function (parent, klasse) { return s("g", { class: klasse || null }, parent); };

  F.tekst = function (parent, x, y, tekst, o) {
    o = o || {};
    var cls = ["fig-txt"];
    if (o.kursiv) cls.push("fig-kursiv");
    if (o.fet) cls.push("fig-fet");
    if (o.klasse) cls.push(o.klasse);
    var t = s("text", { x: x, y: y, "text-anchor": o.anker || "middle", "dominant-baseline": "central",
      class: cls.join(" "), style: o.str ? "font-size:" + o.str + "px" : null }, parent); // style, ikke attributt: .fig-txt i css overstyrer attributtet
    return fyllTekst(t, tekst);
  };

  F.boks = function (parent, x, y, w, hh, etikett, o) {
    o = o || {};
    var rolle = o.rolle || "noytral";
    var g = s("g", { class: "fig-boks fig-r-" + rolle + (o.klasse ? " " + o.klasse : "") }, parent);
    s("rect", { x: x, y: y, width: w, height: hh, rx: o.r != null ? o.r : 2, class: "fig-boks-r" }, g);
    if (rolle === "teller") s("rect", { x: x + 3, y: y + 3, width: w - 6, height: hh - 6, rx: 1, class: "fig-boks-inn" }, g);
    var kursiv = o.kursiv != null ? o.kursiv : !(rolle === "funk" || rolle === "noytral");
    if (etikett != null && etikett !== "") F.tekst(g, x + w / 2, y + hh / 2, etikett, { kursiv: kursiv, fet: rolle === "funk" || rolle === "chiffer", klasse: "fig-boks-t", str: o.str });
    return { g: g, x: x, y: y, w: w, h: hh, cx: x + w / 2, cy: y + hh / 2, topp: y, bunn: y + hh, venstre: x, hoyre: x + w };
  };

  F.linje = function (parent, punkter, o) {
    o = o || {};
    return s("path", { d: d(punkter), class: "fig-strek" + (o.stiplet ? " fig-stiplet" : "") + (o.klasse ? " " + o.klasse : ""), fill: "none" }, parent);
  };

  F.pil = function (parent, punkter, o) {
    o = o || {};
    var p = F.linje(parent, punkter, o), root = svgRoot(parent);
    if (root && root._pil) {
      p.setAttribute("marker-end", "url(#" + root._pil + ")");
      if (o.start) p.setAttribute("marker-start", "url(#" + root._pil + ")");
    }
    return p;
  };

  F.brutt = function (parent, y, x0, x1, kryss, o) {
    var gap = (o && o.gap) || 5, xs = (kryss || []).slice().sort(function (a, b) { return a - b; }), a = x0, g = s("g", {}, parent);
    xs.forEach(function (x) {
      if (x - gap > a && x < x1) F.linje(g, [[a, y], [x - gap, y]], o);
      a = Math.max(a, x + gap);
    });
    if (a < x1) F.linje(g, [[a, y], [x1, y]], o);
    return g;
  };

  F.xor = function (parent, cx, cy, r) {
    r = r || 10;
    var g = s("g", { class: "fig-xor" }, parent);
    s("circle", { cx: cx, cy: cy, r: r, class: "fig-xor-c" }, g);
    F.linje(g, [[cx - r, cy], [cx + r, cy]]);
    F.linje(g, [[cx, cy - r], [cx, cy + r]]);
    s("title", {}, g).textContent = "XOR (⊕)";
    return g;
  };

  F.nokkel = function (parent, x, y, o) {
    o = o || {};
    var k = o.str || 1, g = s("g", { class: "fig-nokkel", transform: "translate(" + x + " " + y + ") scale(" + k + ")" }, parent);
    s("title", {}, g).textContent = "Nøkkel" + (o.etikett ? " " + o.etikett : "");
    s("path", { class: "fig-nokkel-f", d: "M0 0 a8 8 0 1 1 -0.01 0 z M-2.2 14 h4.4 v22 l-2.2 3 l-2.2 -3 z M2.2 24 h4.5 v3.4 h-4.5 z M2.2 30 h3.5 v3.4 h-3.5 z", transform: "translate(0 0)" }, g);
    // hull i hodet
    s("circle", { cx: 0, cy: 6, r: 2.6, class: "fig-nokkel-hull" }, g);
    if (o.etikett) F.tekst(g, -11, 22, o.etikett, { anker: "end", kursiv: true });
    return g;
  };

  F.panel = function (parent, x, y, w, hh, overskrift) {
    var g = s("g", { class: "fig-panel" }, parent);
    s("rect", { x: x, y: y, width: w, height: hh, rx: 6, class: "fig-panel-r" }, g);
    if (overskrift) F.tekst(g, x + 8, y + 12, overskrift, { anker: "start", fet: true, klasse: "fig-panel-t" });
    return g;
  };

  /* ---------- HTML-blokker ---------- */
  F.celler = function (host, n, o) {
    o = o || {};
    var box = h("div", { class: "fig-celler" + (o.klasse ? " " + o.klasse : "") }, host), out = [];
    var grid = h("div", { class: "fig-celler-grid" }, box);
    grid.style.setProperty("--fig-kol", String(o.kol || n));
    for (var i = 0; i < n; i++) out.push(h("div", { class: "fig-celle", "data-celle": String(i) }, grid));
    return out;
  };

  F.felt = function (forelder, indeks, o) {
    o = o || {};
    if (forelder && forelder.namespaceURI === NS) throw new Error("IN.fig.felt: plassholderen må ligge i HTML, ikke i SVG");
    var ph = h("div", { class: "fig-felt", "data-felt": String(indeks) });
    if (o.etikett) h("span", { class: "fig-felt-et", html: o.etikett }, ph);
    if (forelder) forelder.appendChild(ph);
    return ph;
  };

  F.terminal = function (host, tekst, o) {
    o = o || {};
    var box = h("div", { class: "fig-term" + (o.klasse ? " " + o.klasse : "") }, host);
    var bar = h("div", { class: "fig-term-bar", "aria-hidden": "true" }, box);
    h("span", { class: "fig-term-prikker" }, bar);
    if (o.tittel) h("span", { class: "fig-term-tittel", text: o.tittel }, bar);
    h("pre", { class: "fig-term-pre", text: Array.isArray(tekst) ? tekst.join("\n") : String(tekst) }, box);
    if (o.tittel) box.setAttribute("aria-label", o.tittel);
    return box;
  };

  F.kode = function (host, tekst, o) {
    o = o || {};
    var box = h("div", { class: "fig-kode" + (o.klasse ? " " + o.klasse : "") }, host);
    if (o.tittel) h("div", { class: "fig-kode-tittel", text: o.tittel }, box);
    var pre = h("pre", {}, box);
    h("code", { text: String(tekst) }, pre);
    return box;
  };

  F.tabell = function (host, o) {
    o = o || {};
    var wrap = h("div", { class: "fig-tab-wrap" }, host);
    var t = h("table", { class: "fig-tab" + (o.klasse ? " " + o.klasse : "") }, wrap);
    if (o.tittel) h("caption", { html: o.tittel }, t);
    function celle(tr, v, tag) {
      var c = h(tag, tag === "th" ? { scope: "col" } : {}, tr);
      if (v && typeof v === "object" && v.felt != null) F.felt(c, v.felt, { etikett: v.etikett });
      else if (v && typeof v === "object") { c.innerHTML = v.html == null ? "" : v.html; if (v.klasse) c.className = v.klasse; }
      else c.innerHTML = v == null ? "" : String(v);
    }
    if (o.hode) { var tr = h("tr", {}, h("thead", {}, t)); o.hode.forEach(function (v) { celle(tr, v, "th"); }); }
    var tb = h("tbody", {}, t);
    (o.rader || []).forEach(function (r) { var tr2 = h("tr", {}, tb); r.forEach(function (v) { celle(tr2, v, "td"); }); });
    return t;
  };
  /* ---------- Gjenbruk i forklaringer (IN.fig.vis) ---------- */
  // Blokk (oppg.block) → blokksiden der eksamenskortet står (samme filter som examBank-kallene på 01–10).
  var SIDE = { generelt: "01-grunnbegreper.html", fysisk: "01-grunnbegreper.html", lov: "01-grunnbegreper.html",
    krypto: "02-krypto.html", pki: "03-pki.html", angrep: "04-angrep.html", pentest: "04-angrep.html",
    system: "05-system.html", risiko: "06-risiko.html", utvikling: "06-risiko.html",
    autentisering: "07-autentisering.html", iam: "08-iam.html", nettverk: "09-nettverk.html", cyberops: "10-cyberops-ki.html" };

  function finnOppg(key) {
    var bank = window.IN_EXAM_BANK || {}, y = String(key).split("-")[0], kand = bank[y] ? [y] : Object.keys(bank);
    for (var i = 0; i < kand.length; i++) {
      var l = (bank[kand[i]] && bank[kand[i]].oppgaver) || [];
      for (var j = 0; j < l.length; j++) if (l[j].key === key) return l[j];
    }
    return null;
  }
  F.side = function (key) { var o = finnOppg(key); return (o && SIDE[o.block]) || ""; };
  F.dyplenke = function (key) {
    var side = F.side(key), here = location.pathname.split("/").pop() || "index.html";
    return (side && side !== here ? side : "") + "#fane=eksamen&oppg=o-" + String(key).replace(/[^A-Za-z0-9_-]/g, "_");
  };

  F.vis = function (host, key, o) {
    o = o || {};
    if (typeof host === "string") host = document.querySelector(host);
    var draw = IN.FIGURER[key], oppg = finnOppg(key);
    if (!host || !draw || !oppg) { if (window.console) console.warn("IN.fig.vis: mangler figur eller oppgave for " + key); return null; }
    while (host.firstChild) host.removeChild(host.firstChild);
    var fig = h("figure", { class: "exam-fig insp-fig har-tegning fig-vis", "data-fig-vis": String(key) }, host);
    var hh = h("div", { class: "exam-fig-h" }, fig);
    try { draw(hh, oppg); } catch (e) { if (window.console) console.error(e); host.removeChild(fig); return null; }
    if (!hh.firstChild) { host.removeChild(fig); return null; }
    // Ingen svarfelt i en forklaring: fjern plassholderne (og celler/rader som da står tomme beholdes som de er).
    Array.prototype.slice.call(hh.querySelectorAll(".fig-felt")).forEach(function (n) { n.parentNode.removeChild(n); });
    var nr = String(oppg.oppgave_nr != null ? oppg.oppgave_nr : String(key).replace(/^[HV]\d{4}-/, "")).replace(/^\s*oppgave\s*/i, "");
    var aar = oppg.year || String(key).split("-")[0];
    var cap = h("figcaption", { class: "small muted fig-vis-cap" }, fig);
    var etikett = "Fra eksamen " + aar + " oppg. " + nr;
    if (o.lenke === false) h("span", { text: etikett }, cap);
    else h("a", { href: F.dyplenke(key), text: etikett, title: "Åpne eksamensoppgaven" + (oppg.title ? ": " + plain(oppg.title) : "") }, cap);
    h("span", { text: " · tegnet på nytt, uten svarfelt" }, cap);
    if (o.tekst) h("span", { class: "fig-vis-merk", html: " · " + o.tekst }, cap);
    var husk = o.husk && IN.FIG_HUSK && IN.FIG_HUSK[key];
    if (husk) {
      var hb = h("div", { class: "fig-husk fig-vis-husk" }, fig);
      h("p", { class: "fig-husk-t small", html: "<b>Huskeregel: " + husk.tittel + "</b>" }, hb);
      h("div", { class: "small", html: husk.tekst }, hb);
    }
    return fig;
  };
})();
