/* ============================================================
   IN2120 guide · forside.js
   Bygger forsiden (index.html) fra eksamensbanken (window.IN_EXAM_BANK) og IN.PAGES:
   kom i gang-boksen, eksamensflyten, temaer med hyppighet, oppgavekartet og blokkortene.
   Alle tall regnes ut her, så de følger banken når den endres. Klassisk script, lastes etter
   core.js og eksamensbankfilene. Ingen lagring av egen: fremdrift leses fra IN.progress
   (in2120:fremdrift:v1, skrevet av eksamenskortene på blokksidene).
   ============================================================ */
(function () {
  "use strict";
  var IN = window.IN, el = IN.el, qs = IN.qs;
  var BANK = window.IN_EXAM_BANK || {};
  var EXAM_DATE = new Date(2026, 11, 3);   // 3.12.2026 (CLAUDE.md)

  /* ---------- Sider ---------- */
  var PAGE = {};
  IN.PAGES.forEach(function (p) { PAGE[p.id] = p; });
  function ready(id) { return !!(PAGE[id] && PAGE[id].ready); }
  function pageName(id) { return PAGE[id] ? String(PAGE[id].label).replace(/^\d+\s*·\s*/, "") : id; }
  function pageNo(id) { var m = PAGE[id] && /^(\d+)\s*·/.exec(PAGE[id].label); return m ? m[1] : ""; }
  /* Bankens block → blokksiden som viser kortet (samme valg som IN.examBank-kallene på sidene).
     «lov» (straffeloven § 204) vises både på 01 og 04; vi lenker og teller den under 04. */
  var BLOCK2PAGE = {
    generelt: "grunnbegreper", fysisk: "grunnbegreper", lov: "angrep",
    krypto: "krypto", pki: "pki", angrep: "angrep", pentest: "angrep", system: "system",
    risiko: "risiko", utvikling: "risiko", autentisering: "autentisering", iam: "iam",
    nettverk: "nettverk", cyberops: "cyberops", ki: "cyberops"
  };
  var BLOCK_PAGES = IN.PAGES.filter(function (p) { return /^\d+\s*·/.test(p.label); }).map(function (p) { return p.id; });
  var DESC = {
    grunnbegreper: "KIT-målene, sikkerhet/trygghet/visshet, risikobegreper, lov og fysisk sikkerhet.",
    krypto: "Symmetrisk og asymmetrisk, moduser, hash, MAC, signatur og Diffie–Hellman.",
    pki: "Nøkkelhåndtering, kryptoperioder, X.509, CA-kjeder og tillit.",
    angrep: "Phishing, skadevare, angrepsvektorer, pentest, verktøy og § 204.",
    system: "Privilegienivåer, virtualisering, TPM, sikker oppstart og sidekanaler.",
    risiko: "ISMS, ISO 27k, NSM og NIST CSF, risikovurdering og sikker utvikling.",
    autentisering: "Passord og salt, faktorer, passnøkler, biometri og garantinivåer.",
    iam: "IAM-faser, identitet, føderering, OAuth/OIDC og tilgangskontrollmodeller.",
    nettverk: "Protokoll og lag, TLS, IPsec/VPN, brannmur/iptables og IDS/Snort.",
    cyberops: "Cyberoperasjoner, kill chain, trusseletterretning og KI."
  };

  /* ---------- Banken ---------- */
  function yearKey(y) { var m = /^H(\d{4})$/.exec(y); return m ? +m[1] : 0; }
  // Forsiden (vekter, linjal, oppgavekart) bygger på dagens format H2021–. H2018–H2020 er ekstra øving
  // på blokksidene og i «Øv på et helt sett», men teller ikke i vektingen (eldre pensum og format).
  var YEARS = Object.keys(BANK).filter(function (y) { return /^H\d{4}$/.test(y) && yearKey(y) >= 2021; })
    .sort(function (a, b) { return yearKey(a) - yearKey(b); });
  var ALL = [];
  YEARS.forEach(function (y) {
    (BANK[y].oppgaver || []).forEach(function (o, i) {
      ALL.push({ y: y, o: o, i: i, page: BLOCK2PAGE[o.block] || null, type: (o.inspera && o.inspera.type) || "" });
    });
  });
  function isFree(t) { return t === "E" || t === "K"; }
  function num(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
  function sum(list) { return list.reduce(function (s, x) { return s + (+x.o.points || 0); }, 0); }
  function range(a) {
    if (!a.length) return "";
    var lo = Math.min.apply(null, a), hi = Math.max.apply(null, a);
    return lo === hi ? num(lo) : num(lo) + "–" + num(hi);
  }
  function shortY(y) { return "H" + y.slice(3); }
  function nrOf(o) { return String(o.key).replace(/^H\d{4}-/, ""); }
  /* Dyplenke til kortet på blokksiden: samme id som bank.js gir kortet («.» → «_») */
  function cardId(key) { return "o-" + String(key).replace(/[^A-Za-z0-9_-]/g, "_"); }
  function oppgHref(page, key) { return PAGE[page].href + "#fane=eksamen&oppg=" + cardId(key); }
  function status(x) {
    var r = x.page && IN.progress && IN.progress.get("kort:" + x.page + ":" + cardId(x.o.key));
    return r && r.status;
  }

  var TOTAL = sum(ALL);
  var PTS = {};       // PTS[page][year] = poeng
  var CNT = {};       // CNT[page] = antall oppgaver
  BLOCK_PAGES.forEach(function (p) { PTS[p] = {}; CNT[p] = 0; });
  ALL.forEach(function (x) {
    if (!x.page || !PTS[x.page]) return;
    PTS[x.page][x.y] = (PTS[x.page][x.y] || 0) + (+x.o.points || 0);
    CNT[x.page]++;
  });
  function pagePts(p) { return YEARS.reduce(function (s, y) { return s + (PTS[p][y] || 0); }, 0); }
  var BY_WEIGHT = BLOCK_PAGES.slice().sort(function (a, b) { return pagePts(b) - pagePts(a); });

  /* ---------- Fakta i hodet ---------- */
  (function () {
    var host = qs("#a4-facts");
    if (!host) return;
    var last = YEARS.length ? BANK[YEARS[YEARS.length - 1]] : {};
    var counts = YEARS.map(function (y) { return (BANK[y].oppgaver || []).length; });
    var facts = [
      ["Eksamen", EXAM_DATE.getDate() + "." + (EXAM_DATE.getMonth() + 1) + "." + EXAM_DATE.getFullYear() + " kl. 09:00"],
      ["Tid", "4 timer"],
      ["Sted", "Silurveien"],
      ["Hjelpemidler", String(last.hjelpemidler || "ingen").toLowerCase()],
      ["Format", "Inspera, 9 deler, 100 poeng (d13 s. 9)" + (counts.length ? "; eldre sett hadde " + range(counts) + " oppgaver" : "")]
    ];
    facts.forEach(function (f) { host.appendChild(el("dt", { text: f[0] })); host.appendChild(el("dd", { text: f[1] })); });
  })();

  /* ---------- Kom i gang ---------- */
  (function () {
    var host = qs("#crash-box");
    if (!host) return;
    host.classList.add("crash-box-mini", "fs-start");
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var days = Math.round((EXAM_DATE - today) / 864e5);
    var when = days > 1 ? days + " dager til eksamen." : days === 1 ? "Eksamen er i morgen." : days === 0 ? "Eksamen er i dag." : "";
    var txt = el("div", { class: "crash-box-txt" });
    txt.appendChild(el("p", {}, [el("b", { text: "Kom i gang. " }), when ? el("span", { class: "fs-days", text: when + " " }) : null,
      "Løs et helt sett på tid, og se hvor poengene forsvinner. Start så med de tyngste blokkene:"]));
    var heavy = el("p", { class: "fs-heavy" });
    BY_WEIGHT.filter(ready).slice(0, 4).forEach(function (p, i) {
      if (i) heavy.appendChild(document.createTextNode(" · "));
      heavy.appendChild(el("a", { href: PAGE[p].href + "#fane=eksamen", text: pageName(p) }));
      heavy.appendChild(el("span", { class: "fs-soft", text: " " + num(pagePts(p)) + " p" }));
    });
    txt.appendChild(heavy);
    var prog = el("p", { class: "fs-prog", "aria-live": "polite" });
    txt.appendChild(prog);
    host.appendChild(txt);
    if (ready("eksamen")) host.appendChild(el("a", { class: "btn cr-go", href: PAGE.eksamen.href, text: "Øv på et helt sett →" }));
    function paint() {
      var ok = 0, ov = 0;
      ALL.forEach(function (x) { var s = status(x); if (s === "ok") ok++; else if (s === "ovmer") ov++; });
      prog.textContent = ok || ov
        ? "Fremdrift: " + ok + " av " + ALL.length + " eksamensoppgaver merket «Fikk det til»" + (ov ? ", " + ov + " «Øv mer»." : ".")
        : "";
      prog.hidden = !(ok || ov);
    }
    paint();
    document.addEventListener("in:progress", function () { paint(); paintMap(); });
    window.addEventListener("storage", function (e) { if (!e.key || (IN.progress && e.key === IN.progress.KEY)) { paint(); paintMap(); } });
  })();

  /* ---------- Slik ser eksamen ut ---------- */
  var TYPEGROUPS = [
    { id: "m", name: "Matrise", types: ["M"] },
    { id: "f", name: "Flervalg", types: ["F1", "FF", "H"] },
    { id: "i", name: "Innfyll og dra", types: ["N", "T", "D"] },
    { id: "e", name: "Fritekst", types: ["K", "E"] }
  ];
  function domPage(list) {   // blokksiden med flest poeng i en liste oppgaver
    var acc = {}, best = null;
    list.forEach(function (x) { if (x.page) acc[x.page] = (acc[x.page] || 0) + (+x.o.points || 0); });
    Object.keys(acc).forEach(function (p) { if (!best || acc[p] > acc[best]) best = p; });
    return best;
  }
  (function () {
    var host = qs("#exam-flow");
    if (!host || !YEARS.length) return;

    // Linjalen: delene i ett sett, bredde = poeng, farge = blokken med flest poeng i delen
    var bar = el("div", { class: "fs-yearbar", role: "group", "aria-label": "Velg eksamen" });
    var ruler = el("div", { class: "a4-ruler" });
    var parts = el("ol", { class: "fs-delnames" });
    host.appendChild(bar); host.appendChild(ruler); host.appendChild(parts);
    function show(y) {
      IN.qsa("button", bar).forEach(function (b) { b.setAttribute("aria-pressed", b._y === y ? "true" : "false"); });
      IN.clear(ruler); IN.clear(parts);
      var ex = BANK[y], deler = ex.deler || [];
      var mine = ALL.filter(function (x) { return x.y === y; });
      var line = el("div", { class: "a4-bar" });
      var tot = deler.reduce(function (s, d) { return s + (+d.poeng || 0); }, 0);
      deler.forEach(function (d, i) {
        var list = mine.filter(function (x) { return x.o.del === d.navn; });
        var p = domPage(list), free = sum(list.filter(function (x) { return isFree(x.type); }));
        var name = String(d.navn).replace(/^Del\s*\d+:\s*/, "");
        var seg = el("span", { class: "a4-seg fs-c-" + (p || "none"), title: d.navn + " · " + num(d.poeng) + " p" + (free ? " (" + num(free) + " p fritekst)" : "") });
        seg.style.flexGrow = d.poeng;
        if (d.poeng >= 8) seg.appendChild(el("span", { text: String(i + 1) }));
        line.appendChild(seg);
        parts.appendChild(el("li", { class: "fs-c-" + (p || "none") }, [
          el("span", { class: "fs-sw", "aria-hidden": "true" }),
          el("span", { text: name }),
          el("span", { class: "fs-soft", text: " " + num(d.poeng) + " p" + (free ? ", " + num(free) + " fritekst" : "") })
        ]));
      });
      ruler.appendChild(line);
      ruler.appendChild(el("div", { class: "a4-scale", "aria-hidden": "true" }));
      ruler.appendChild(el("div", { class: "a4-scale-n", "aria-hidden": "true" },
        [el("span", { text: "0" }), el("span", { text: num(tot / 2) }), el("span", { text: num(tot) + " p" })]));
      if (ex.merknad && tot !== 100) ruler.appendChild(el("p", { class: "fs-note", text: "Merk: " + ex.merknad }));
    }
    YEARS.slice().reverse().forEach(function (y) {
      var b = el("button", { class: "btn sm", type: "button", text: y, onclick: function () { show(y); } });
      b._y = y; bar.appendChild(b);
    });
    show(YEARS[YEARS.length - 1]);

    // Fasene i settet (fra plan/eksamensmonster.md § 1 og § 3; tallene fra banken)
    var d1 = YEARS.map(function (y) { var d = (BANK[y].deler || [])[0]; return d ? +d.poeng : null; }).filter(function (v) { return v != null; });
    var nDeler = YEARS.map(function (y) { return (BANK[y].deler || []).length; });
    var scen = YEARS.filter(function (y) { var d = BANK[y].deler || []; return d.length && !/Del\s*\d+:\s*(Generelt|Kryptografi|Angrep|Nettverk|Autentisering|ISMS|Risiko|Cyber|Sikker|Fysisk|Bruker|Identitet|Ledelse|Innebygd|Nøkkel|System|Pentest)/i.test(d[d.length - 1].navn); });
    var FLOW = [
      { part: "Start", name: "Forsiden", pts: "les den",
        text: "4 timer, ingen hjelpemidler. Poengregelen står på hver oppgave, og du kan gå fram og tilbake mellom oppgavene." },
      { part: "Del 1", name: "Generelt", pts: range(d1) + " p",
        text: "Grunnbegreper på tvers av pensum: KIT-mål brutt per angrep, sikkerhet/trygghet/visshet, risikobegreper, boksfarger i pentest, privilegienivåer.",
        page: "grunnbegreper" },
      { part: "Del 2 og utover", name: "Én del per tema", pts: range(nDeler.map(function (n) { return n - 1; })) + " deler",
        text: "Kryptografi og PKI, angrep og skadevare, nettverk, autentisering og IAM, ISMS og risiko, og noen år sikker utvikling, fysisk sikkerhet eller cyberoperasjoner.",
        anchor: "eo-temaer" }
    ];
    if (scen.length) FLOW.push({ part: "Sist", name: "Scenario", pts: scen.map(function (y) { var d = BANK[y].deler; return shortY(y) + " " + num(d[d.length - 1].poeng) + " p"; }).join(", "),
      text: "De siste årene ender settet med en historie (" + scen.map(function (y) { var d = BANK[y].deler; return "«" + String(d[d.length - 1].navn).replace(/^Del\s*\d+:\s*/, "") + "»"; }).join(", ") +
        ") der du forklarer hva som skjedde, med fagord fra flere blokker." });
    var ol = el("ol", { class: "a4-parts fs-flow" });
    FLOW.forEach(function (f) {
      var body = el("div", { class: "a4-pbody" }, el("p", { text: f.text }));
      if (f.page && ready(f.page)) body.appendChild(el("div", { class: "a4-links" }, el("a", { href: PAGE[f.page].href + "#fane=eksamen", text: pageName(f.page) + " → eksamensoppgaver" })));
      if (f.anchor) body.appendChild(el("div", { class: "a4-links" }, el("a", { href: "#" + f.anchor, text: "Se temaene under ↓" })));
      ol.appendChild(el("li", { class: "a4-part fs-part" }, [
        el("div", { class: "a4-pname" }, [
          el("span", { class: "a4-pk" }, [el("span", { text: f.part }), el("span", { class: "a4-pts", text: f.pts })]),
          el("h3", { text: f.name })
        ]),
        body
      ]));
    });
    host.appendChild(ol);

    // Oppgavetypene per år: poeng per gruppe
    var mix = el("div", { class: "fs-mix" });
    mix.appendChild(el("h3", { text: "Oppgavetypene, poeng per år" }));
    var legend = el("p", { class: "fs-mixleg" });
    TYPEGROUPS.forEach(function (g) {
      legend.appendChild(el("span", { class: "fs-t-" + g.id }, [el("span", { class: "fs-sw", "aria-hidden": "true" }), g.name]));
    });
    mix.appendChild(legend);
    YEARS.forEach(function (y) {
      var mine = ALL.filter(function (x) { return x.y === y; }), tot = sum(mine);
      var row = el("div", { class: "fs-mixrow" });
      var b = el("div", { class: "fs-mixbar", role: "img" });
      var lab = [];
      TYPEGROUPS.forEach(function (g) {
        var p = sum(mine.filter(function (x) { return g.types.indexOf(x.type) >= 0; }));
        if (!p) return;
        var s = el("span", { class: "fs-t-" + g.id, title: g.name + ": " + num(p) + " p" });
        s.style.flexGrow = p;
        if (p >= 9) s.appendChild(el("span", { text: num(p) }));
        b.appendChild(s);
        lab.push(g.name + " " + num(p) + " p");
      });
      b.setAttribute("aria-label", y + ": " + lab.join(", ") + " (av " + num(tot) + ")");
      var free = sum(mine.filter(function (x) { return isFree(x.type); }));
      row.appendChild(el("span", { class: "fs-mixy", text: y }));
      row.appendChild(b);
      row.appendChild(el("span", { class: "fs-mixf", text: num(free) + " p fritekst" }));
      mix.appendChild(row);
    });
    host.appendChild(mix);
  })();

  /* ---------- Temaene ---------- */
  (function () {
    var host = qs("#exam-topics");
    if (!host) return;
    var n = YEARS.length;
    var head = qs("#eo-temaer-sub");
    if (head) head.textContent = "Sum eksamenspoeng " + (n ? shortY(YEARS[0]) + "–" + shortY(YEARS[n - 1]) : "") + " (" + num(TOTAL) + " p i alt). " +
      "Prikkene: hvor mange av de " + n + " settene som hadde oppgaver fra blokken. Søylene: poeng per år.";
    var maxY = 0;
    BLOCK_PAGES.forEach(function (p) { YEARS.forEach(function (y) { maxY = Math.max(maxY, PTS[p][y] || 0); }); });
    BY_WEIGHT.forEach(function (p) {
      var tot = pagePts(p);
      if (!tot) return;
      var hits = YEARS.filter(function (y) { return PTS[p][y]; }).length;
      var dots = el("span", { class: "a4-dots", role: "img", "aria-label": hits + " av " + n + " eksamener" });
      for (var d = 0; d < n; d++) dots.appendChild(el("i", { class: d < hits ? "on" : null }));
      var often = hits === n ? "Hvert år" : hits === n - 1 ? "Nesten hvert år" : hits + " av " + n + " år";
      var spark = el("span", { class: "fs-spark fs-c-" + p, role: "img",
        "aria-label": YEARS.map(function (y) { return shortY(y) + " " + num(PTS[p][y] || 0) + " p"; }).join(", ") });
      YEARS.forEach(function (y) {
        var v = PTS[p][y] || 0, i = el("i", { title: shortY(y) + ": " + num(v) + " p" });
        i.style.height = Math.max(v ? 8 : 0, Math.round(v / (maxY || 1) * 100)) + "%";
        spark.appendChild(el("span", { class: "fs-sparkc" }, [i, el("b", { text: shortY(y).slice(1) })]));
      });
      // Hyppigste stikkord (tema) i blokkens oppgaver
      var tags = {};
      ALL.forEach(function (x) { if (x.page === p) (x.o.tema || []).forEach(function (t) { var k = String(t); tags[k] = (tags[k] || 0) + 1; }); });
      var top = Object.keys(tags).filter(function (t) { return tags[t] > 1; })
        .sort(function (a, b) { return tags[b] - tags[a] || (a < b ? -1 : 1); }).slice(0, 6);
      var free = sum(ALL.filter(function (x) { return x.page === p && isFree(x.type); }));
      var title = ready(p) ? el("a", { href: PAGE[p].href, text: pageName(p) }) : el("span", { text: pageName(p) });
      host.appendChild(el("div", { class: "a4-topic fs-topic fs-c-" + p }, [
        el("div", { class: "a4-tname" }, [
          el("h3", {}, title),
          el("span", { class: "a4-freq" }, [dots, el("span", { text: often })]),
          el("span", { class: "a4-pts", text: num(tot) + " p · " + Math.round(tot / TOTAL * 100) + " %" })
        ]),
        el("div", { class: "a4-tbody fs-tbody" }, [
          spark,
          el("div", {}, [
            el("p", {}, [CNT[p] + " oppgaver" + (free ? ", " + num(free) + " p fritekst" : "") + ". ",
              top.length ? el("span", { class: "a4-tip-txt" }, [el("b", { text: "Går igjen: " }), top.join(", ") + "."]) : null]),
            ready(p) ? el("div", { class: "a4-links" }, el("a", { href: PAGE[p].href + "#fane=eksamen", text: "Eksamensoppgavene (" + CNT[p] + ")" })) : null
          ])
        ])
      ]));
    });
  })();

  /* ---------- Regler: tall fra banken ---------- */
  (function () {
    var auto = ALL.filter(function (x) { return !isFree(x.type); });
    var neg = auto.filter(function (x) { var r = x.o.inspera && x.o.inspera.regel; return r && r.feil < 0; });
    var blank = auto.filter(function (x) { var r = x.o.inspera && x.o.inspera.regel; return r && r.blankt < 0; });
    var a = qs("#fs-rule-neg");
    if (a) a.textContent = neg.length + " av " + auto.length + " automatisk rettede oppgaver " +
      (YEARS.length ? shortY(YEARS[0]) + "–" + shortY(YEARS[YEARS.length - 1]) : "") + " ga minuspoeng for feil.";
    var b = qs("#fs-rule-blank");
    if (b) b.textContent = blank.length
      ? "Unntak: " + blank.map(function (x) { return shortY(x.y) + " " + nrOf(x.o); }).join(" og ") + " ga minus også for ubesvart."
      : "";
  })();

  /* ---------- Oppgavekartet ---------- */
  var mapCells = [];
  (function () {
    var host = qs("#task-map");
    if (!host) return;
    var legend = el("div", { class: "fs-legend", role: "group", "aria-label": "Fremhev en blokk" });
    var active = null;
    function hilite(p) {
      active = active === p ? null : p;
      host.classList.toggle("fs-dim", !!active);
      mapCells.forEach(function (c) { c.a.classList.toggle("fs-on", c.x.page === active); });
      IN.qsa("button", legend).forEach(function (bt) { bt.setAttribute("aria-pressed", bt._p === active ? "true" : "false"); });
    }
    BLOCK_PAGES.forEach(function (p) {
      if (!CNT[p]) return;
      var bt = el("button", { type: "button", class: "fs-lg fs-c-" + p, "aria-pressed": "false", onclick: function () { hilite(p); } },
        [el("span", { class: "fs-sw", "aria-hidden": "true" }), (pageNo(p) ? pageNo(p) + " " : "") + pageName(p)]);
      bt._p = p; legend.appendChild(bt);
    });
    legend.appendChild(el("span", { class: "fs-lg fs-lg-free" }, [el("span", { class: "fs-sw fs-free", "aria-hidden": "true" }), "Fritekst (rettes av sensor)"]));
    host.appendChild(legend);

    YEARS.slice().reverse().forEach(function (y) {
      var mine = ALL.filter(function (x) { return x.y === y; });
      var free = sum(mine.filter(function (x) { return isFree(x.type); }));
      var row = el("div", { class: "fs-row" });
      row.appendChild(el("div", { class: "fs-rowh" }, [
        el("h3", { text: y }),
        el("span", { class: "fs-soft", text: mine.length + " oppg. · " + num(sum(mine)) + " p" + (free ? " · " + num(free) + " fritekst" : "") })
      ]));
      var ol = el("ol", { class: "fs-cells" });
      mine.forEach(function (x) {
        var o = x.o, nr = nrOf(o), fr = isFree(x.type);
        var label = y + " oppgave " + nr + ": " + (o.title || o.ark || "") + ", " + num(o.points) + " p" +
          (x.page ? ", " + pageName(x.page) : "") + (fr ? ", fritekst" : "");
        var cls = "fs-cell fs-c-" + (x.page || "none") + (fr ? " fs-free" : "");
        var kids = [el("span", { class: "fs-nr", text: nr }), el("span", { class: "fs-p", text: num(o.points) })];
        var a = x.page && ready(x.page)
          ? el("a", { class: cls, href: oppgHref(x.page, o.key), title: label, "aria-label": label }, kids)
          : el("span", { class: cls + " fs-nolink", title: label }, kids);
        a.style.setProperty("--fs-w", Math.min(10, +o.points || 0));
        ol.appendChild(el("li", {}, a));
        mapCells.push({ a: a, x: x, label: label });
      });
      row.appendChild(ol);
      host.appendChild(row);
    });
    paintMap();
  })();
  function paintMap() {
    mapCells.forEach(function (c) {
      var s = status(c.x);
      c.a.classList.toggle("fs-ok", s === "ok");
      c.a.classList.toggle("fs-ov", s === "ovmer");
      var l = c.label + (s === "ok" ? " (fikk det til)" : s === "ovmer" ? " (øv mer)" : "");
      c.a.setAttribute("title", l);
      if (c.a.tagName === "A") c.a.setAttribute("aria-label", l);
    });
  }

  /* ---------- Fanefargene i eksamenskortet ---------- */
  (function () {
    var host = qs("#fs-tabs");
    if (!host || !IN.EXAM_TABS) return;
    ["oppgave", "demo", "losning", "sensor"].forEach(function (id) {
      if (!IN.EXAM_TABS[id]) return;
      host.appendChild(el("span", { class: "fs-tab fs-tab-" + id, text: IN.EXAM_TABS[id].long }));
    });
  })();

  /* ---------- Blokkene ---------- */
  (function () {
    var host = qs("#block-cards");
    if (!host) return;
    BLOCK_PAGES.forEach(function (p) {
      if (!ready(p)) return;   // ready:false lenkes ikke
      var pts = pagePts(p);
      host.appendChild(el("a", { class: "fs-block fs-c-" + p, href: PAGE[p].href }, [
        el("span", { class: "fs-bhead" }, [el("span", { class: "a4-bn", text: pageNo(p) }), el("b", { text: pageName(p) })]),
        el("span", { class: "fs-bdesc", text: DESC[p] || "" }),
        el("span", { class: "fs-bpts", text: pts ? num(pts) + " eksamenspoeng · " + CNT[p] + " oppg." : "Ingen eksamensoppgaver ennå" })
      ]));
    });
  })();

  /* Til testing (headless): antall celler og lenker */
  IN.forside = { cells: mapCells.length, tasks: ALL.length, total: TOTAL };
})();
