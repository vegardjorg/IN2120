/* ============================================================
   IN2120 guide · viz-grunn.js
   Visualiseringer for blokk 1 (grunnbegreper, fysisk sikkerhet og lov).
   Felles eksempel: «Fjellbekk barnehage» (egne navn og data).

   IN.vizGrunn.gjerder(host)    «tre gjerder»: klikk ordet til figuren (sikkerhet, trygghet, visshet, garanti)
   IN.vizGrunn.kit(host)        angrep × K/I/T (IN.matrise), med avlyttingen som brytere (ukryptert, kryptert, dekryptert senere)
   IN.vizGrunn.tiltak(host)     kontrolltype-rutenett: type (forebyggende/oppdagende/korrigerende) × ISO 27002-domene
   IN.vizGrunn.sja(host)        SJA-skjema studenten fyller ut selv, så forslag og sjekkliste til egenvurdering
   IN.vizGrunn.bemanning(host)  arbeid i høyden: hvem står hvor, sjekk mot reglene
   IN.vizGrunn.dybde(host)      forsvar i dybden som tidslinje (IN.stepPlayer, «tatt eller ikke?» gjettes ved hvert lag)
   IN.vizGrunn.backup(host)     tabell over kald, varm/inaktiv og varm/aktiv, og IN.scenario: velg billigste reserve som holder
   IN.vizGrunn.lov(host)        § 204-sjekk for pentest som beslutningstre
   Klassisk script. Lastes etter core.js, stepplayer.js og ovelse.js.
   Lagring: in2120:grunn:sja (SJA-skjemaet), in2120:scen:grunn-backup (via IN.scenario).
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;
  var NS = "http://www.w3.org/2000/svg";
  var uid = 0;

  function H(h) { return typeof h === "string" ? IN.qs(h) : h; }
  function S(tag, attrs, kids) {
    var n = document.createElementNS(NS, tag);
    attrs = attrs || {};
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) {
      if (k === "text") n.textContent = attrs[k];
      else if (attrs[k] != null) n.setAttribute(k, String(attrs[k]));
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function btn(text, on, cls) { return el("button", { class: "btn sm" + (cls ? " " + cls : ""), type: "button", text: text, onclick: on }); }
  function num(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
  function press(b, on) { b.setAttribute("aria-pressed", on ? "true" : "false"); }
  function svgBox(w, h, label) {
    return S("svg", { viewBox: "0 0 " + w + " " + h, width: "100%", role: "img", "aria-label": label, class: "gr-svg", preserveAspectRatio: "xMidYMid meet" });
  }

  /* =========================================================
     1 · Tre gjerder
     ========================================================= */
  var FIG = [
    { id: "a", navn: "Piggtrådgjerde rundt et lager", svar: "Sikkerhet",
      why: "Gjerdet er rettet mot noen som vil inn med vilje. Det finnes en motstander, så det er sikkerhet.", mot: true, vite: false },
    { id: "b", navn: "Rekkverk rundt hemsen i lekerommet", svar: "Trygghet",
      why: "Rekkverket skal hindre at noen faller. Ingen faller med vilje, så det er vern mot ulykke: trygghet.", mot: false, vite: false },
    { id: "c", navn: "Oppmålingsbolt med koordinater i hjørnet av tomta", svar: "Visshet",
      why: "Bolten stopper ingen. Den gjør bare at man vet nøyaktig hvor grensen går: visshet.", mot: false, vite: true },
    { id: "d", navn: "Testrapport om at døra tåler ti minutters innbruddsforsøk", svar: "Garanti",
      why: "Rapporten gir begrunnet tillit til at låsen (et sikkerhetstiltak) virker som tenkt: garanti (assurance).", mot: false, vite: false }
  ];
  function drawFig(id) {
    var s = svgBox(160, 100, "");
    if (id === "a") {
      s.appendChild(S("rect", { x: 92, y: 26, width: 56, height: 44, class: "gr-fill" }));
      s.appendChild(S("path", { d: "M88 28 L120 10 L152 28", class: "gr-ln" }));
      for (var i = 0; i < 5; i++) s.appendChild(S("line", { x1: 12 + i * 34, y1: 40, x2: 12 + i * 34, y2: 88, class: "gr-ln gr-thick" }));
      [50, 64, 78].forEach(function (y) {
        s.appendChild(S("line", { x1: 8, y1: y, x2: 152, y2: y, class: "gr-ln" }));
        for (var x = 20; x < 150; x += 17) s.appendChild(S("path", { d: "M" + (x - 3) + " " + (y - 3) + " L" + (x + 3) + " " + (y + 3) + " M" + (x - 3) + " " + (y + 3) + " L" + (x + 3) + " " + (y - 3), class: "gr-ln gr-acc" }));
      });
      s.appendChild(S("line", { x1: 0, y1: 90, x2: 160, y2: 90, class: "gr-ln" }));
    } else if (id === "b") {
      s.appendChild(S("rect", { x: 20, y: 44, width: 120, height: 8, class: "gr-fill" }));
      s.appendChild(S("line", { x1: 26, y1: 52, x2: 26, y2: 92, class: "gr-ln gr-thick" }));
      s.appendChild(S("line", { x1: 134, y1: 52, x2: 134, y2: 92, class: "gr-ln gr-thick" }));
      s.appendChild(S("line", { x1: 20, y1: 20, x2: 140, y2: 20, class: "gr-ln gr-acc gr-thick" }));
      for (var j = 0; j < 9; j++) s.appendChild(S("line", { x1: 24 + j * 14, y1: 20, x2: 24 + j * 14, y2: 44, class: "gr-ln gr-acc" }));
      s.appendChild(S("circle", { cx: 70, cy: 26, r: 5, class: "gr-ln" }));
      s.appendChild(S("path", { d: "M70 31 L70 40 M64 35 L76 35 M70 40 L66 44 M70 40 L74 44", class: "gr-ln" }));
      for (var k = 0; k < 4; k++) s.appendChild(S("line", { x1: 100 + k * 8, y1: 52 + k * 10, x2: 108 + k * 8, y2: 52 + k * 10, class: "gr-ln" }));
      s.appendChild(S("line", { x1: 0, y1: 92, x2: 160, y2: 92, class: "gr-ln" }));
    } else if (id === "c") {
      s.appendChild(S("rect", { x: 0, y: 58, width: 160, height: 42, class: "gr-fill" }));
      s.appendChild(S("circle", { cx: 80, cy: 72, r: 12, class: "gr-ln gr-acc gr-thick" }));
      s.appendChild(S("path", { d: "M80 60 L80 84 M68 72 L92 72", class: "gr-ln gr-acc" }));
      s.appendChild(S("path", { d: "M10 72 L64 72 M96 72 L150 72", class: "gr-ln gr-dash" }));
      s.appendChild(S("text", { x: 80, y: 30, class: "gr-t", "text-anchor": "middle", text: "N 59,9431" }));
      s.appendChild(S("text", { x: 80, y: 46, class: "gr-t", "text-anchor": "middle", text: "Ø 10,7202" }));
    } else {
      s.appendChild(S("rect", { x: 18, y: 10, width: 64, height: 84, class: "gr-fill" }));
      s.appendChild(S("rect", { x: 64, y: 46, width: 10, height: 18, rx: 2, class: "gr-ln" }));
      s.appendChild(S("circle", { cx: 116, cy: 50, r: 30, class: "gr-ln gr-acc gr-thick" }));
      s.appendChild(S("circle", { cx: 116, cy: 50, r: 24, class: "gr-ln gr-acc" }));
      s.appendChild(S("text", { x: 116, y: 47, class: "gr-t gr-acct", "text-anchor": "middle", text: "TESTET" }));
      s.appendChild(S("text", { x: 116, y: 60, class: "gr-t gr-acct", "text-anchor": "middle", text: "10 min" }));
    }
    return s;
  }
  function gjerder(host) {
    host = H(host); if (!host) return;
    var root = el("div", { class: "gr-viz gr-gjerder" });
    var START = "Trykk på et ord, og velg så figuren i panelet som åpnes. Du kan også trykke rett på feltet under en figur.";
    var info = el("p", { class: "gr-note", text: START });
    var live = el("p", { class: "gr-live", "aria-live": "polite" });
    var pool = el("div", { class: "gr-row gr-pool", role: "group", "aria-label": "Ord du kan plassere" });
    var grid = el("div", { class: "gr-figs" });
    var tabHost = el("div");
    var ORD3 = ["Sikkerhet", "Trygghet", "Visshet"];
    var valgt = null, ord = [], placed = {}, panelMsg = null, sist = null, tomFig = null;
    /* Ordene i tilfeldig rekkefølge, så de ikke står i samme rekkefølge som figurene */
    function stokk() {
      ord = ORD3.slice();
      for (var i = ord.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = ord[i]; ord[i] = ord[j]; ord[j] = x; }
    }
    root.appendChild(info); root.appendChild(live); root.appendChild(pool); root.appendChild(grid); root.appendChild(tabHost);
    root.appendChild(el("div", { class: "gr-row" }, [el("button", { class: "btn", type: "button", text: "↺ Nullstill", onclick: function () { valgt = null; placed = {}; panelMsg = sist = tomFig = null; stokk(); info.textContent = START; paint(); } })]));

    function synlig(f) { return !(f.id === "d" && ord.indexOf("Garanti") < 0); }
    var HINT = "Spør deg selv: finnes det en motstander? Handler det om å vite noe? Eller om tillit til et tiltak?";
    /* Legg valgt ord på figuren f. Riktig lukker panelet og gir kvittering der ordet sto. */
    function plasser(f) {
      var w = valgt;
      placed[f.id] = w; tomFig = null;
      if (w === f.svar) {
        valgt = null; panelMsg = null;
        var tre = ["a", "b", "c"].every(function (id) { var g = FIG.filter(function (x) { return x.id === id; })[0]; return placed[id] === g.svar; });
        var neste = "";
        if (tre && ord.indexOf("Garanti") < 0) { ord.push("Garanti"); neste = " Trinn to: en fjerde figur og et fjerde ord dukker opp."; info.textContent = "Trinn to: en fjerde figur og et fjerde ord dukker opp."; }
        else info.textContent = "Riktig.";
        var alle = FIG.every(function (x) { return placed[x.id] === x.svar; });
        sist = { w: w, html: "<b>Riktig.</b> «" + f.navn + "» er " + w.toLowerCase() + "." + neste + (alle ? " Alle riktig. Oppsummeringen står under figurene." : "") };
        live.textContent = "Riktig. " + f.navn + " er " + w.toLowerCase() + "." + neste;
      } else {
        panelMsg = "Ikke «" + f.navn.toLowerCase() + "». " + HINT;
        info.textContent = "Ikke riktig. Prøv et annet ord.";
        live.textContent = panelMsg;
      }
    }
    function velg(w) { valgt = valgt === w ? null : w; panelMsg = null; sist = null; tomFig = null; paint(valgt != null); }
    function panel() {
      var p = el("div", { class: "gr-pick", role: "group", "aria-label": "Plasser «" + valgt + "»" });
      var r = el("div", { class: "gr-pick-r" }, [el("span", { class: "gr-pick-l", text: "Figur" })]);
      FIG.forEach(function (f) {
        if (!synlig(f) || placed[f.id] === f.svar) return;
        var b = el("button", { type: "button", class: "btn sm gr-pick-b", text: f.navn, onclick: function () { plasser(f); paint(true); } });
        press(b, false); r.appendChild(b);
      });
      p.appendChild(r);
      p.appendChild(panelMsg ? el("p", { class: "gr-pick-msg", text: panelMsg }) : el("p", { class: "gr-pick-msg muted", text: "Hvilken figur hører «" + valgt + "» til?" }));
      return p;
    }
    function paint(fokus) {
      clear(pool);
      ord.forEach(function (w) {
        var used = FIG.some(function (f) { return placed[f.id] === w && w === f.svar; });
        var b = btn(w, function () { velg(w); }, "gr-word");
        press(b, valgt === w); if (used) { b.disabled = true; b.classList.add("gr-used"); }
        pool.appendChild(b);
        if (valgt === w) pool.appendChild(panel());
        if (sist && sist.w === w) pool.appendChild(el("p", { class: "gr-kvitt", tabindex: "-1", html: sist.html }));
      });
      if (fokus) {
        var fb = pool.querySelector(".gr-pick .btn") || pool.querySelector(".gr-kvitt");
        if (fb) fb.focus({ preventScroll: true });
      }
      clear(grid);
      FIG.forEach(function (f) {
        if (!synlig(f)) return;
        var p = placed[f.id], ok = p && p === f.svar;
        var fig = el("figure", { class: "gr-fig" + (ok ? " ok" : p ? " nei" : "") });
        fig.appendChild(drawFig(f.id));
        fig.appendChild(el("figcaption", { class: "small", text: f.navn }));
        var slot = el("button", { class: "gr-slot", type: "button", "aria-label": "Felt for " + f.navn + (p ? ": " + p : ": tomt"),
          text: p ? (ok ? "✓ " : "✗ ") + p : "…",
          onclick: function () {
            if (ok) return;
            if (!valgt) { tomFig = f.id; info.textContent = "Velg et ord først."; paint(); return; }
            plasser(f); paint();
          } });
        fig.appendChild(slot);
        if (ok) fig.appendChild(el("p", { class: "gr-why small", text: f.why }));
        else if (tomFig === f.id) fig.appendChild(el("p", { class: "gr-why small", text: "Velg et ord først (over figurene)." }));
        else if (p) fig.appendChild(el("p", { class: "gr-why small", text: "Ikke riktig. " + HINT }));
        grid.appendChild(fig);
      });
      clear(tabHost);
      var alle = FIG.every(function (f) { return placed[f.id] === f.svar; });
      if (alle) {
        var t = el("table", { class: "gr-tab" });
        t.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "Figur" }), el("th", { text: "Ord" }), el("th", { text: "Handler ordet om en motstander?" }), el("th", { text: "Handler det om å vite?" })])]));
        var tb = el("tbody");
        FIG.forEach(function (f) {
          tb.appendChild(el("tr", {}, [el("td", { text: f.navn }), el("td", { html: "<b>" + f.svar + "</b>" }),
            el("td", { class: f.mot ? "gr-ja" : "", text: f.mot ? "ja" : "nei" }), el("td", { class: f.vite ? "gr-ja" : "", text: f.vite ? "ja" : "nei" })]));
        });
        t.appendChild(tb);
        tabHost.appendChild(el("p", { class: "gr-note", html: "<b>Alle riktig.</b> To spørsmål skiller begrepene. Bare sikkerhet har en motstander, og bare visshet handler om å vite. Garanti handler om tillit til at et tiltak virker." }));
        tabHost.appendChild(el("div", { class: "table-wrap" }, [t]));
      }
    }
    stokk();
    paint();
    clear(host); host.appendChild(root);
  }

  /* =========================================================
     2 · Angrep × K/I/T (IN.matrise). Avlyttingen i første rad har to brytere.
     Fasit følger eksamensradene (ett mål per rad). Der et annet mål kan forsvares,
     godtas begge svar og forklaringen sier hvorfor.
     ========================================================= */
  var JN = ["Ja", "Nei"], BEGGE = ["Ja", "Nei"];
  var KIT_RADER = [
    { s: "Angriper tar opp trafikken mellom barnehagens foreldreapp og tjeneren", f: ["Ja", "Nei", "Nei"],
      x: { "0": "Trafikken er ukryptert, så angriperen leser passord og meldinger i klartekst. Bare lesing: K." } },
    { s: "Løsepengevirus krypterer alle filene på filserveren", f: ["Nei", BEGGE, "Ja"],
      x: { "0": "Krypteringen gir ingen andre lesetilgang. Lekker angriperen dataene i tillegg (dobbel utpressing), kommer K inn, men det står ikke i raden.",
           "1": "Filene endres, så I kan argumenteres for, men eksamen har alltid bare godtatt T (H2022 1.1, H2023 3, H2025 2). Her godtas derfor bare T.",
           "2": "Eieren får ikke brukt sine egne data. Det er T, selv om ordet «kryptovirus» høres ut som K." } },
    { s: "Noen endrer kontonummeret på en faktura før den betales", f: ["Nei", "Ja", "Nei"],
      x: { "1": "Data er endret uten lov." } },
    { s: "DDoS fra et botnett mot bestillingssiden", f: ["Nei", "Nei", "Ja"],
      x: { "2": "Legitime brukere slipper ikke til." } },
    { s: "Tastaturlogger på resepsjonens PC", f: ["Ja", "Nei", "Nei"],
      x: { "0": "Passord og tekst lekker til angriperen." } },
    { s: "Brukerkontoen sperres etter 50 gjettede passord", f: ["Nei", "Nei", "Ja"],
      x: { "0": "Ingen har lest noe. Sperren stoppet gjettingen.",
           "2": "Den rettmessige brukeren stenges ute. Sperren er et tiltak, men virkningen er et T-brudd (H2024 3)." } },
    { s: "Angriper finner to kontrakter med samme hash og bytter ut den signerte", f: ["Nei", "Ja", "Nei"],
      x: { "0": "Ingenting blir lest.", "1": "Signaturen ser gyldig ut, men dekker nå falskt innhold (H2024 3, H2025 2)." } },
    { s: "Angriper sletter både databasen og sikkerhetskopien", f: ["Nei", "Nei", "Ja"],
      x: { "2": "Dataene kan ikke brukes lenger (H2024 3)." } },
    { s: "Passordhasher lekker og knekkes med ordliste", f: ["Ja", "Nei", "Nei"],
      x: { "0": "Hemmelighetene blir kjent for angriperen." } },
    { s: "Angriper endrer brannmurkonfigurasjonen på ruteren", f: [BEGGE, "Ja", BEGGE],
      x: { "0": "Endringen kan åpne for et senere K-brudd eller stenge trafikk (T), men det er følgebrudd.",
           "1": "Det som er brutt nå, er I: systemintegritet, systemet er ikke lenger slik eieren satte det opp (H2021 1.1)." } },
    { s: "Strømbrudd tar ned serverrommet", f: ["Nei", "Nei", "Ja"],
      x: { "2": "Tjenestene kan ikke brukes. Her finnes ingen angriper, så det er et trygghetsproblem, men T brytes likevel." } }
  ];
  // Eksamensformatet (H2024 3 o.l.): ett valg per rad blant K, I, T og Ingen. Hovedsvaret er målet med «Ja»
  // i KIT_RADER; der tabellen godtar begge svar for et mål (BEGGE), godtas dette målet også, men bare når det
  // er et reelt alternativ. Løsepengevirus gir bare T, som på eksamen (faktasjekk VG-01). Følgebrudd (brannmurraden: K, T)
  // godtas ikke i eksamensformatet.
  var KIT_EKSTRA = {};
  function kitSvar(r, i) {
    var hoved = ["K", "I", "T"].filter(function (m, k) { return r.f[k] === "Ja"; });
    var svar = hoved.length ? hoved : ["Ingen"];
    return svar.concat(KIT_EKSTRA[i] || []);
  }
  function kitSpec() {
    var forkl = {};
    KIT_RADER.forEach(function (r, i) {
      forkl[String(i)] = Object.keys(r.x).sort().map(function (k) { return r.x[k]; }).join(" ");
    });
    return {
      id: "grunn-kit-matrise",
      opphav: { type: "egen", variantAv: ["H2024-3", "H2025-2"], kilder: ["d01a s. 20"] },
      sporsmal: {
        eli5: "<p>Velg det målet angrepet ødelegger. K: noen leser det de ikke skal. I: noe blir endret eller falskt. T: noe kan ikke brukes. Ingen: ingenting av dette skjer. Bryterne under endrer hvordan avlyttingen i første rad skjer.</p>",
        normal: "<p>Velg ett mål per rad, slik som på eksamen. Spør hva angriperen <i>oppnår</i>: lese (K), endre eller forfalske (I) eller stenge ute (T). Velg «Ingen» hvis ingen av dem brytes.</p><ul><li>Poengregel som i H2024 3 (−0,5 for feil eller blankt); andre år har hatt andre regler.</li><li>Eksamen H22–H25 har bare K, I og T; H2021 1.1 hadde også «ingen». «Ingen» er med her for å øve på avlyttingsbryterne.</li><li>Bryterne endrer forutsetningen for avlyttingen i første rad.</li></ul>",
        teknisk: "<p>Velg målet som brytes direkte. Eksamensmatrisen har ett riktig mål per rad («Ingen» bare i H2021 1.1), så følgebrudd som angrepet <i>kan</i> føre til senere, teller ikke. Bryterne viser at avlytting er K bare når innholdet faktisk leses (H2021 1.1).</p>"
      },
      rader: KIT_RADER.map(function (r) { return r.s; }),
      radvalg: { valg: ["K", "I", "T", "Ingen"], navn: "Mål" },
      fasit: KIT_RADER.map(kitSvar),
      forklaring: forkl,
      // Samme regel som KIT-matrisen i H2024 3: 0,5 for riktig, −0,5 for feil eller blankt, aldri under 0.
      regel: { riktig: 0.5, feil: -0.5, blankt: -0.5, min: 0, maks: KIT_RADER.length * 0.5 },
      brytere: [
        { navn: "Trafikken er TLS-kryptert, og angriperen har ingen nøkkel",
          endrer: function (f) { f[0] = ["Ingen"]; return f; },
          forklaring: { "0": "Angriperen ser bare chiffertekst. Ingenting er lest, endret eller stengt, så svaret er Ingen (H2021 1.1)." } },
        { navn: "Nøkkelen som dekrypterer opptaket, blir kjent senere",
          endrer: function (f) { f[0] = ["K"]; return f; },
          forklaring: { "0": "Når opptaket dekrypteres, leses innholdet, og K brytes i det øyeblikket. Fremoverhemmelighold (forward secrecy) skal hindre at en langtidsnøkkel som stjeles senere, gir denne nøkkelen." } }
      ]
    };
  }
  function kit(host) {
    host = H(host); if (!host) return null;
    clear(host);
    return IN.matrise(host, kitSpec());
  }

  /* =========================================================
     3 · Kontrolltype-rutenett
     ========================================================= */
  var TYPER = ["Forebyggende", "Oppdagende", "Korrigerende"];
  var NIST = ["Beskytte", "Oppdage", "Respondere og gjenopprette"];
  var DOMENER = ["Organisatorisk", "Personell", "Fysisk", "Teknologisk"];
  var TILTAK = [
    { s: "Policy som forbyr deling av passord", t: 0, d: 0 },
    { s: "Halvårlig gjennomgang av hvem som har tilgang", t: 1, d: 0, extra: "ISO 27002 merker 5.18 (tilgangsrettigheter) som forebyggende. Selve gjennomgangen avdekker feil tilganger, så hovedtypen her er oppdagende." },
    { s: "Beredskapsplan med varslingsliste", t: 2, d: 0 },
    { s: "Bakgrunnssjekk og ID-kontroll av nyansatte", t: 0, d: 1 },
    { s: "Ansatte melder fra om mistenkelig oppførsel hos kolleger", t: 1, d: 1 },
    { s: "Inndra tilganger og adgangskort straks etter at en ansatt har misbrukt dem", t: 2, d: 1 },
    { s: "Adgangskort med PIN og sluse inn til datarommet", t: 0, d: 2 },
    { s: "Overvåkingskamera og innbruddsalarm", t: 1, d: 2, extra: "Kameraet kan også virke avskrekkende, altså litt forebyggende. Hovedtypen er oppdagende." },
    { s: "Slukkeanlegg som slår inn ved brann i serverrommet", t: 2, d: 2, extra: "Brannvarsleren er oppdagende. Selve slukkingen begrenser skaden: korrigerende." },
    { s: "Brannmur og kryptering av bærbare", t: 0, d: 3 },
    { s: "IDS og logganalyse", t: 1, d: 3 },
    { s: "Gjenoppretting fra sikkerhetskopi", t: 2, d: 3 }
  ];
  /* Mobilvennlig (eierens ønske 2026-11-26): tiltakene står i tilfeldig rekkefølge. Trykk på et tiltak, så åpnes
     et lite velgepanel rett under det: domene (4) og type (3). Svaret og hintet vises i panelet, og et riktig
     plassert tiltak etterlater en kort kvittering der det sto. Rutenettet under fylles som oversikt; å trykke
     rett i ei rute virker fortsatt (feil rute blinker rødt, med melding rett over rutenettet).
     Tilleggsforklaringen (extra) står i rutenettet som «Hvorfor?» (lukket på smal skjerm, åpen på PC). */
  function tiltak(host) {
    host = H(host); if (!host) return;
    var root = el("div", { class: "gr-viz gr-tiltak" });
    var nist = false, valgt = null, plass = {}, feil = 0, dSel = null, tSel = null, panelMsg = null, sist = null, feilRute = null, order = [];
    var START = "Trykk på et tiltak, og velg så domene og type i panelet som åpnes. Du kan også trykke rett i ei rute i rutenettet.";
    function stokk() {
      order = TILTAK.map(function (t, n) { return n; });
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = order[i]; order[i] = order[j]; order[j] = x; }
    }
    var bN = btn("Vis NIST CSF", function () { nist = !nist; press(bN, nist); paint(); }); press(bN, false);
    var bR = btn("↺ Nullstill", function () { valgt = null; plass = {}; feil = 0; dSel = tSel = panelMsg = sist = null; stokk(); gridMsg.textContent = ""; paint(); });
    var msg = el("p", { class: "gr-note", text: START });
    var live = el("p", { class: "gr-live", "aria-live": "polite" });
    var pool = el("div", { class: "gr-row gr-pool", role: "group", "aria-label": "Tiltak" });
    var gridMsg = el("p", { class: "gr-note gr-gridmsg", "aria-live": "polite" });
    var gridHost = el("div", { class: "table-wrap gr-gridwrap" });
    var sveip = el("p", { class: "gr-note gr-sveip", hidden: true, text: "Rutenettet er bredere enn skjermen. Sveip sideveis for å se alle tre typene." });
    root.appendChild(el("div", { class: "gr-row" }, [bN, bR])); root.appendChild(msg); root.appendChild(live); root.appendChild(pool);
    root.appendChild(gridMsg); root.appendChild(sveip); root.appendChild(gridHost);
    function smal() { return !!(window.matchMedia && window.matchMedia("(max-width: 700px)").matches); }
    /* Uttoningshint på den siden der rutenettet har mer innhold (som menyen i styles.css) */
    function fade() {
      var over = gridHost.scrollWidth > gridHost.clientWidth + 1;
      gridHost.classList.toggle("fade-r", over && gridHost.scrollLeft + gridHost.clientWidth < gridHost.scrollWidth - 2);
      gridHost.classList.toggle("fade-l", over && gridHost.scrollLeft > 2);
      sveip.hidden = !over;
    }
    gridHost.addEventListener("scroll", fade, { passive: true });
    window.addEventListener("resize", fade);
    if (window.ResizeObserver) new ResizeObserver(fade).observe(gridHost); /* også når fanen blir synlig */

    function hintFor(t, d) {
      return t.d !== d ? "Domenet stemmer ikke. Er det en regel (organisatorisk), noe rettet mot folk (personell), noe i den fysiske verden eller noe i IT-systemet?" :
        "Typen stemmer ikke. Virker tiltaket før hendelsen (forebyggende), under eller like etter (oppdagende), eller etterpå (korrigerende)?";
    }
    function riktigTekst(t, d, k) { return "«" + t.s + "» er " + TYPER[k].toLowerCase() + " og " + DOMENER[d].toLowerCase() + "."; }
    /* Prøv å plassere valgt tiltak i (domene d, type k). Returnerer true ved riktig. */
    function proev(d, k) {
      var n = valgt, t = TILTAK[n];
      if (t.d === d && t.t === k) {
        plass[n] = true;
        sist = { n: n, html: "<b>Riktig.</b> " + riktigTekst(t, d, k) + (t.extra ? ' <span class="gr-sub">' + t.extra + "</span>" : "") };
        live.textContent = "Riktig. " + riktigTekst(t, d, k);
        valgt = null; dSel = tSel = panelMsg = null;
        return true;
      }
      feil++;
      panelMsg = "Ikke der. " + hintFor(t, d);
      live.textContent = panelMsg;
      return false;
    }
    function velg(n) {
      valgt = valgt === n ? null : n; dSel = tSel = panelMsg = null; sist = null;
      paint(valgt != null);
    }
    function panel() {
      var p = el("div", { class: "gr-pick", role: "group", "aria-label": "Plasser «" + TILTAK[valgt].s + "»" });
      function rad(navn, liste, cur, sub, on) {
        var r = el("div", { class: "gr-pick-r" }, [el("span", { class: "gr-pick-l", text: navn })]);
        liste.forEach(function (x, i) {
          var b = el("button", { type: "button", class: "btn sm gr-pick-b", onclick: function () { on(i); } },
            [el("span", { text: x })].concat(sub ? [el("span", { class: "gr-sub", text: sub[i] })] : []));
          press(b, cur === i); r.appendChild(b);
        });
        return r;
      }
      p.appendChild(rad("Domene", DOMENER, dSel, null, function (i) { dSel = i; vurder(); }));
      p.appendChild(rad("Type", TYPER, tSel, nist ? NIST : null, function (i) { tSel = i; vurder(); }));
      p.appendChild(panelMsg ? el("p", { class: "gr-pick-msg", text: panelMsg }) : el("p", { class: "gr-pick-msg muted", text: "Velg både domene og type." }));
      return p;
    }
    function vurder() {
      if (dSel != null && tSel != null) { proev(dSel, tSel); if (valgt != null) dSel = tSel = null; }
      else panelMsg = null;
      paint(true);
    }
    function paint(fokus) {
      clear(pool);
      order.forEach(function (n) {
        var t = TILTAK[n];
        if (plass[n]) {
          if (sist && sist.n === n) pool.appendChild(el("p", { class: "gr-kvitt", tabindex: "-1", html: sist.html }));
          return;
        }
        var b = btn(t.s, function () { velg(n); }, "gr-word");
        press(b, valgt === n); pool.appendChild(b);
        if (valgt === n) pool.appendChild(panel());
      });
      if (Object.keys(plass).length === TILTAK.length) pool.appendChild(el("p", { class: "gr-note", html: "<b>Alle plassert</b> med " + feil + " feilplassering" + (feil === 1 ? "" : "er") + " underveis." }));
      if (fokus) {
        var f = pool.querySelector(".gr-pick .btn[aria-pressed=false]") || pool.querySelector(".gr-kvitt");
        if (f) f.focus({ preventScroll: true });
      }
      clear(gridHost);
      var tab = el("table", { class: "gr-grid" });
      var hr = el("tr", {}, [el("th", { text: "" })]);
      TYPER.forEach(function (ty, k) { hr.appendChild(el("th", { scope: "col", html: ty + (nist ? '<span class="gr-sub">' + NIST[k] + "</span>" : "") })); });
      tab.appendChild(el("thead", {}, [hr]));
      var tb = el("tbody");
      DOMENER.forEach(function (dm, d) {
        var tr = el("tr", {}, [el("th", { scope: "row", text: dm })]);
        TYPER.forEach(function (ty, k) {
          var inne = TILTAK.map(function (t, n) { return { t: t, n: n }; }).filter(function (x) { return plass[x.n] && x.t.t === k && x.t.d === d; });
          var cell = el("td");
          var b = el("button", { type: "button", class: "gr-cell" + (feilRute === d + "," + k ? " gr-cell-feil" : ""), "aria-label": dm + ", " + ty.toLowerCase(),
            onclick: function () { drop(d, k); } });
          inne.forEach(function (x) { b.appendChild(el("span", { class: "gr-placed", text: x.t.s })); });
          if (!inne.length) b.appendChild(el("span", { class: "gr-empty", text: "…" }));
          cell.appendChild(b);
          inne.forEach(function (x) {
            if (!x.t.extra) return;
            var det = el("details", { class: "gr-extra" }, [el("summary", { text: "Hvorfor?" }), el("span", { class: "gr-sub", text: x.t.extra })]);
            if (!smal()) det.open = true;
            cell.appendChild(det);
          });
          tr.appendChild(cell);
        });
        tb.appendChild(tr);
      });
      tab.appendChild(tb); gridHost.appendChild(tab);
      fade();
    }
    function drop(d, k) {
      if (valgt == null) { gridMsg.textContent = "Velg et tiltak først (over rutenettet)."; return; }
      var t = TILTAK[valgt];
      if (proev(d, k)) { gridMsg.textContent = "Riktig. " + riktigTekst(t, d, k); feilRute = null; }
      else {
        gridMsg.textContent = panelMsg;
        feilRute = d + "," + k;
        setTimeout(function () { feilRute = null; var c = gridHost.querySelector(".gr-cell-feil"); if (c) c.classList.remove("gr-cell-feil"); }, 1400);
      }
      paint();
    }
    stokk();
    paint();
    clear(host); host.appendChild(root);
    fade();
    if (window.requestAnimationFrame) requestAnimationFrame(fade);
  }

  /* =========================================================
     4 · SJA som studenten fyller ut selv, så forslag og sjekkliste (egenvurdering).
     Samme sjekklistemønster som IN.scenario (avslutt.fritekst.sjekkliste) og inspera.js.
     Lagring: in2120:grunn:sja  { r: [[delsteg, fare, risiko, tiltak] ×4], f: fritekst, k: [kryss], v: vist }
     ========================================================= */
  var SJA = [
    { steg: "1 Hente og plassere personløfteren", fare: "Løfteren velter på ujevnt gulv", risiko: "middels", tiltak: "Sjekk underlaget, sett ut støttebeina" },
    { steg: "2 Kjøre opp", fare: "Klemfare mot takbjelken", risiko: "lav", tiltak: "Én på bakken følger med og varsler" },
    { steg: "3 Bytte lysrøret", fare: "Fall, glasskår, strøm", risiko: "middels", tiltak: "Sele festet i kurven, slå av kursen, vernebriller" },
    { steg: "4 Kjøre ned og rydde", fare: "Barn kommer inn i gymsalen", risiko: "lav", tiltak: "Stenge salen, sette opp sperrebånd" }
  ];
  var SJA_SJEKK = [
    "Oppgaven er delt i delsteg i rekkefølge, fra å hente utstyret til å rydde etterpå",
    "Hvert delsteg har minst én fare",
    "Risikoen er vurdert for hvert delsteg (hvor sannsynlig og hvor alvorlig)",
    "Hvert delsteg har et tiltak som er på plass før steget starter",
    "Fallfaren er dekket: sele festet i kurven, personløfter framfor stige",
    "Strømmen til lysrøret er slått av før byttet",
    "Barn og andre holdes unna arbeidsområdet",
    "Formålet: å forhindre arbeidsulykker",
    "Metoden: dele opp oppgaven og vurdere <b>risikoen</b> i hver del for å redusere den (uten ordet risiko gir sensor høyst 2 av 3)"
  ];
  var SJA_KEY = "in2120:grunn:sja";
  /* Skjemaet har tre rader (delsteg 1, 3 og 4 i forslaget). Delsteget er gitt, faren velges fra en liste,
     risikoen fra lav/middels/høy, og bare tiltaket skrives. Lagringsformen er uendret (fire rader à
     [delsteg, fare, risiko, tiltak]); rad 2 og kolonnen delsteg brukes ikke av skjemaet. */
  var SJA_RADER = [0, 2, 3];
  var SJA_FARER = [SJA[2].fare, SJA[0].fare, SJA[3].fare, SJA[1].fare];
  function sjaTom() { return { r: SJA.map(function () { return ["", "", "", ""]; }), f: "", k: [], v: false }; }
  function sjaLes() {
    var t = sjaTom();
    try {
      var s = JSON.parse(IN.store.get(SJA_KEY, "null"));
      if (s && Array.isArray(s.r) && s.r.length === SJA.length) {
        t.r = s.r.map(function (row) { return [0, 1, 2, 3].map(function (i) { return String((row && row[i]) || ""); }); });
        t.f = String(s.f || ""); t.k = Array.isArray(s.k) ? s.k : []; t.v = !!s.v;
      }
    } catch (e) {}
    return t;
  }
  var SJA_MODELL = {
    eli5: "<p><b>SJA</b> betyr sikker jobbanalyse. Før en farlig jobb deler man den i små biter og tenker på hva som kan gå galt i hver bit, og hva man gjør for å hindre det. Målet er at ingen skal skade seg.</p>",
    normal: "<p><b>SJA</b> = sikker jobbanalyse. <b>Formål:</b> forhindre arbeidsulykker. <b>Metode:</b> dele opp oppgaven og vurdere <b>risikoen</b> i hver del, med tiltak som reduserer den før arbeidet starter.</p>",
    teknisk: "<p><b>SJA</b> er risikovurdering i liten skala. Oppgaven brytes ned i steg, hvert steg får fare, en grov vurdering av sannsynlighet og konsekvens, og tiltak som senker risikoen før steget utføres. H2025 34 ga 1 p for formålet og 1 + 1 p for metoden (dele opp, og analysere risiko for å redusere den).</p>"
  };
  function sja(host) {
    host = H(host); if (!host) return null;
    var st = sjaLes(), uidS = "gr-sja" + (++uid);
    function lagre() { try { IN.store.set(SJA_KEY, JSON.stringify(st)); } catch (e) {} }
    var root = el("div", { class: "ov gr-sjaform" });
    var op = IN.opphavEl && IN.opphavEl({ type: "egen", variantAv: ["H2025-34"], kilder: ["d01b s. 8"] });
    if (op) root.appendChild(op);
    root.appendChild(el("p", { class: "gr-task on", html: "<b>Arbeidsoppgave:</b> skifte et lysrør 4,5 m oppe i taket i gymsalen, med personløfter. Tre av de fire delstegene er gitt (delsteg 2, kjøre opp, står i forslaget). På eksamen deler du opp selv. Velg fare og risiko for hvert steg, skriv et tiltak, og se forslaget etterpå." }));

    var t = el("div", { class: "gr-sjat" });
    var radEl = [];
    SJA_RADER.forEach(function (r, n) {
      var navn = SJA[r].steg.replace(/^\d+\s*/, "");
      var rad = el("fieldset", { class: "gr-sjar" }, [el("legend", { html: "<b>Delsteg " + (r + 1) + ":</b> " + navn })]);
      function felt(k, ctl, ekstra) { rad.appendChild(el("label", { class: "gr-sjaf" + (ekstra ? " " + ekstra : "") }, [el("span", { class: "gr-sjak", text: k }), ctl])); }
      var fare = el("select", { class: "ov-sel" }, [el("option", { value: "", text: "velg fare" })].concat(SJA_FARER.map(function (v) { return el("option", { value: v, text: v }); })));
      fare.value = st.r[r][1];
      fare.addEventListener("change", function () { st.r[r][1] = fare.value; lagre(); });
      felt("Fare", fare, "gr-sjaf-fare");
      var ris = el("select", { class: "ov-sel" }, ["", "lav", "middels", "høy"].map(function (v) { return el("option", { value: v, text: v || "–" }); }));
      ris.value = st.r[r][2];
      ris.addEventListener("change", function () { st.r[r][2] = ris.value; lagre(); });
      felt("Risiko", ris);
      var tilt = el("input", { type: "text", class: "ov-sel gr-inp", placeholder: n === 0 ? "hva gjør dere før steget?" : "" });
      tilt.value = st.r[r][3];
      tilt.addEventListener("input", function () { st.r[r][3] = tilt.value; lagre(); });
      felt("Tiltak", tilt);
      radEl.push({ el: rad, r: r });
      t.appendChild(rad);
    });
    root.appendChild(t);

    var fid = uidS + "-fri";
    var fri = el("div", { class: "ov-fri" });
    fri.appendChild(el("label", { for: fid, class: "ov-fri-q", text: "Hva er formålet med SJA, og hva er metoden? (som H2025 34, 3 p)" }));
    var ta = el("textarea", { id: fid, class: "ov-ta", rows: "3", spellcheck: "true" });
    ta.value = st.f;
    ta.addEventListener("input", function () { st.f = ta.value; lagre(); });
    fri.appendChild(ta);
    root.appendChild(fri);

    var vis = el("div", { class: "gr-sja-vis", hidden: true });
    var bVis = el("button", { class: "btn primary", type: "button", text: "Vis forslag og sjekkliste", onclick: function () { st.v = true; lagre(); paint(true); } });
    var bTom = el("button", { class: "btn", type: "button", text: "↺ Tøm skjemaet", onclick: function () {
      st = sjaTom(); lagre();
      IN.qsa("input[type=text], select", t).forEach(function (x) { x.value = ""; });
      radEl.forEach(function (x) { x.el.classList.remove("ok", "nei"); });
      ta.value = ""; paint(false);
    } });
    root.appendChild(el("div", { class: "qz-foot" }, [bVis, bTom]));
    root.appendChild(vis);

    function paint(fokus) {
      clear(vis); vis.hidden = !st.v; bVis.hidden = st.v;
      radEl.forEach(function (x) {
        var valgt = st.r[x.r][1], ok = valgt === SJA[x.r].fare;
        x.el.classList.toggle("ok", st.v && ok); x.el.classList.toggle("nei", st.v && !!valgt && !ok);
      });
      if (!st.v) return;
      var h = el("p", { class: "gr-b", tabindex: "-1", text: "Forslag: SJA for lysrøret" });
      vis.appendChild(h);
      var mt = el("table", { class: "gr-tab" });
      mt.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "Steg" }), el("th", { text: "Fare" }), el("th", { text: "Risiko" }), el("th", { text: "Tiltak" })])]));
      var mb = el("tbody");
      SJA.forEach(function (r) {
        mb.appendChild(el("tr", {}, [el("td", { text: r.steg }), el("td", { text: r.fare }), el("td", { class: "gr-r-" + r.risiko, text: r.risiko }), el("td", { text: r.tiltak })]));
      });
      mt.appendChild(mb);
      vis.appendChild(el("div", { class: "table-wrap" }, [mt]));
      vis.appendChild(el("p", { class: "small muted", text: "Grønn kant på et delsteg i skjemaet: du valgte samme fare som forslaget. Risikonivåene er grove skjønnsvurderinger. Andre delsteg og tiltak kan være like gode, så lenge sjekklisten under er dekket." }));
      vis.appendChild(el("div", { class: "gr-out on", html: IN.level && IN.level.pick ? IN.level.pick(SJA_MODELL) : SJA_MODELL.normal }));
      var cnt = el("p", { class: "ov-fri-n", role: "status", "aria-live": "polite" });
      var fs = el("fieldset", { class: "ov-sjekk" }, [el("legend", { text: "Sjekk svaret ditt selv: kryss av det du fikk med" })]);
      function tell() {
        var a = SJA_SJEKK.filter(function (_, i) { return st.k[i]; }).length;
        cnt.textContent = "Du har krysset av " + a + " av " + SJA_SJEKK.length + ".";
        if (IN.progress && IN.progress.solved) IN.progress.solved("sja", "grunn-sja", a, SJA_SJEKK.length);
      }
      SJA_SJEKK.forEach(function (txt, i) {
        var cb = el("input", { type: "checkbox" });
        cb.checked = !!st.k[i];
        cb.addEventListener("change", function () { st.k[i] = cb.checked; lagre(); tell(); });
        fs.appendChild(el("label", { class: "ov-sjekk-o" }, [cb, el("span", { html: txt })]));
      });
      vis.appendChild(fs); vis.appendChild(cnt);
      cnt.textContent = "Du har krysset av " + SJA_SJEKK.filter(function (_, i) { return st.k[i]; }).length + " av " + SJA_SJEKK.length + ".";
      vis.appendChild(el("p", { class: "small muted", text: "Bemanningen (minst to, én på bakken, begge med opplæring) er en egen regel for arbeid i høyden. Den øves under." }));
      if (fokus) { try { h.focus({ preventScroll: false }); } catch (e) { h.focus(); } }
    }
    paint(false);
    window.addEventListener("in:level", function () { if (st.v && root.isConnected) paint(false); });
    clear(host); host.appendChild(root);
    return { el: root, tilstand: function () { return JSON.parse(JSON.stringify(st)); } };
  }

  /* Bemanning ved arbeid i høyden */
  function bemanning(host) {
    host = H(host); if (!host) return;
    var P = [{ navn: "Tarjei", kurs: true }, { navn: "Ola (vikar)", kurs: false }, { navn: "Ingrid", kurs: true }];
    var pos = ["", "", ""];
    var root = el("div", { class: "gr-viz" });
    root.appendChild(el("p", { class: "gr-note", text: "Et kamera skal monteres på en mast 5 meter oppe, med personløfter. Hvem står hvor?" }));
    var rows = el("div", { class: "gr-ppl" }), out = el("ul", { class: "gr-check", "aria-live": "polite" });
    P.forEach(function (p, n) {
      var sel = el("select", { class: "gr-sel", "aria-label": "Plassering for " + p.navn, onchange: function () { pos[n] = sel.value; check(); } },
        [el("option", { value: "", text: "ikke med" }), el("option", { value: "kurv", text: "i kurven" }), el("option", { value: "bakke", text: "på bakken" })]);
      rows.appendChild(el("label", { class: "gr-lbl" }, [el("span", { html: "<b>" + p.navn + "</b> " + (p.kurs ? "(har kurs i personløfter)" : "(har ikke kurs)") }), sel]));
    });
    function check() {
      var med = P.filter(function (p, n) { return pos[n]; });
      var kurv = pos.filter(function (x) { return x === "kurv"; }).length, bakke = pos.filter(function (x) { return x === "bakke"; }).length;
      var regler = [
        { ok: med.length >= 2, t: "Minst to personer til stede" },
        { ok: bakke >= 1, t: "Minst én på bakken" },
        { ok: kurv >= 1, t: "Noen i kurven til å gjøre jobben" },
        { ok: med.length > 0 && med.every(function (p) { return p.kurs; }), t: "Alle som deltar, har opplæring" }
      ];
      clear(out);
      regler.forEach(function (r) { out.appendChild(el("li", { class: r.ok ? "ok" : "nei", text: (r.ok ? "✓ " : "✗ ") + r.t })); });
      var alle = regler.every(function (r) { return r.ok; });
      out.appendChild(el("li", { class: alle ? "ok gr-b" : "gr-b", text: alle ? "Lovlig bemanning etter lysarkets regler." : "Ikke godkjent ennå." }));
    }
    root.appendChild(rows); root.appendChild(out); check();
    clear(host); host.appendChild(root);
  }

  /* =========================================================
     5 · Forsvar i dybden som tidslinje (stepPlayer)
     input = [ytterdør, kjellerdør, serverskap, kryptert disk] som 1/0
     ========================================================= */
  var LAG = ["Ytterdør med kodelås", "Låst kjellerdør", "Låst serverskap", "Kryptert disk"];
  var PER_LAG = 3, VAKT = 8;
  function dybdeSteps(inp) {
    var on = [0, 1, 2, 3].map(function (n) { return !!inp[n]; });
    var fys = [0, 1, 2].filter(function (n) { return on[n]; });
    var steps = [], t = 0, ferdig = fys.length * PER_LAG;
    steps.push({ t: 0, pos: -1, on: on, tag: "t = 0 min",
      text: { eli5: "Tyven kommer til den første døra. Alarmen begynner å pipe, og vakta setter seg i bilen.",
              normal: "Tyven starter på det ytterste laget. Alarmen går, og vakta er " + VAKT + " minutter unna.",
              teknisk: "Deteksjon skjer ved første lag. Fra nå av er det et kappløp: tiden lagene kjøper (her " + PER_LAG + " min per lag, oppdiktede tall) mot responstiden (" + VAKT + " min)." } });
    var caught = false;
    /* «Tatt eller ikke?» gjettes før hvert lag vises (stepplayer: spor på steget som viser utfallet) */
    function sporLag(n, k, tatt) {
      var t0 = k * PER_LAG, t1 = (k + 1) * PER_LAG;
      return {
        sporsmal: { eli5: "Tyven begynner på «" + LAG[n].toLowerCase() + "» etter " + t0 + " minutter. Det tar " + PER_LAG + " minutter, og vakta kommer etter " + VAKT + ". Hva tror du skjer?",
                    normal: "Tyven begynner på «" + LAG[n].toLowerCase() + "» ved t = " + t0 + " min. Laget tar " + PER_LAG + " min, og vakta er der ved t = " + VAKT + " min. Kommer tyven gjennom, eller blir hen tatt her?",
                    teknisk: "Lag " + (k + 1) + " forserest fra t = " + t0 + " til t = " + t1 + " min, og responstiden er " + VAKT + " min. Tatt eller gjennom?" },
        valg: ["Tyven kommer gjennom laget før vakta", "Vakta tar tyven ved dette laget"],
        fasit: tatt ? 1 : 0,
        forklaring: tatt ? "Tyven trenger til t = " + t1 + " min for å komme gjennom, men vakta er der ved t = " + VAKT + " min." :
          "Tyven er gjennom ved t = " + t1 + " min, før vakta kommer ved t = " + VAKT + " min."
      };
    }
    fys.forEach(function (n, k) {
      var tNext = (k + 1) * PER_LAG;
      if (!caught && VAKT < tNext) {
        caught = true;
        steps.push({ t: VAKT, pos: k - 0.5, on: on, vakt: true, caught: true, tag: "t = " + VAKT + " min", spor: sporLag(n, k, true),
          text: { eli5: "Vakta kommer mens tyven fortsatt holder på med «" + LAG[n].toLowerCase() + "». Tyven blir tatt.",
                  normal: "Vakta kommer etter " + VAKT + " minutter. Tyven er fortsatt i gang med «" + LAG[n].toLowerCase() + "», så angrepet stoppes.",
                  teknisk: "Summen av forsinkelser (" + ferdig + " min) er større enn responstiden (" + VAKT + " min). Det er hele poenget med forsvar i dybden: lagene trenger ikke være umulige å forsere, bare trege nok til at noen rekker å reagere." } });
      }
      if (caught) return;
      steps.push({ t: tNext, pos: k, on: on, tag: "t = " + tNext + " min", spor: sporLag(n, k, false),
        text: { eli5: "Tyven kom seg forbi «" + LAG[n].toLowerCase() + "».", normal: "Tyven er gjennom «" + LAG[n].toLowerCase() + "» etter " + tNext + " minutter.",
                teknisk: "Lag " + (k + 1) + " forsinket angriperen " + PER_LAG + " minutter. Gjenstår før vakta kommer: " + Math.max(0, VAKT - tNext) + " min." } });
    });
    if (!caught) {
      var krypt = on[3];
      steps.push({ t: ferdig, pos: fys.length, on: on, stolen: true, tag: "t = " + ferdig + " min",
        spor: { sporsmal: { eli5: "Tyven er forbi alle dørene og tar med seg disken. Kan tyven lese det som står på den?",
                            normal: "Tyven kommer seg gjennom alle de fysiske lagene før vakta og tar disken. Kan tyven lese dataene?",
                            teknisk: "Alle fysiske lag er forsert før responsen. Er konfidensialiteten til dataene på disken brutt?" },
                valg: ["Ja, dataene kan leses", "Nei, de er uleselige for tyven"], fasit: krypt ? 1 : 0,
                forklaring: krypt ? "Disken er kryptert. Krypteringen stopper ikke tyveriet, men gjør dataene verdiløse for tyven." : "Disken er ikke kryptert, så ingenting begrenser konsekvensen for K." },
        text: { eli5: "Tyven kom seg ut med disken før vakta kom." + (krypt ? " Men disken er låst med en hemmelig kode, så tyven kan ikke lese den." : " Og disken er ikke låst, så tyven kan lese alt."),
                normal: "Tyven når serveren etter " + ferdig + " minutter, før vakta (" + VAKT + " min). " + (krypt ? "Disken er kryptert, så innholdet er uleselig: K holder, men serveren er borte, så T er brutt." : "Disken er ukryptert: både K og T er brutt."),
                teknisk: "Forsinkelsen (" + ferdig + " min) er mindre enn responstiden (" + VAKT + " min). " + (krypt ? "Krypteringen hindrer ikke tyveriet, men reduserer konsekvensen: dataene er verdiløse for tyven. Tilgjengeligheten må reddes av et korrigerende tiltak, for eksempel sikkerhetskopi." : "Uten kryptering er det ingenting igjen som begrenser konsekvensen for konfidensialiteten.") } });
      steps.push({ t: VAKT, pos: fys.length, on: on, vakt: true, stolen: true, tag: "t = " + VAKT + " min",
        text: { eli5: "Vakta kommer, men for sent.", normal: "Vakta kommer etter " + VAKT + " minutter, men tyven er allerede borte.",
                teknisk: "Responsen kom etter at angrepet var fullført. Legg til et lag, flytt deteksjonen tidligere eller kort ned responstiden." } });
    }
    return steps;
  }
  function dybde(host) {
    host = H(host); if (!host) return;
    host.classList.add("gr-sp");
    IN.stepPlayer(host, {
      presets: { "Alle fire lag": [1, 1, 1, 1], "Uten serverskap": [1, 1, 0, 1], "Uten kryptering": [1, 1, 1, 0], "Bare ytterdør": [1, 0, 0, 0] },
      customInput: false,
      generate: dybdeSteps,
      render: function (s, ctx) {
        var stage = ctx.stage; clear(stage);
        var W = 520, Hh = 250, svg = svgBox(W, Hh, "Lagene rundt serveren og tidslinjen");
        var cx = 150, cy = 120, KORTN = ["Ytterdør", "Kjellerdør", "Serverskap", "Kryptert"];
        function R(n) { return 110 - n * 26; }
        for (var n = 0; n < 4; n++) {
          var r = R(n), on = s.on[n];
          svg.appendChild(S("rect", { x: cx - r, y: cy - r, width: 2 * r, height: 2 * r * 0.98, rx: 6,
            class: "gr-ring" + (on ? "" : " off") + (n === 3 ? " krypt" : "") }));
          svg.appendChild(S("text", { x: cx - r + 5, y: cy - r + 13, class: "gr-t gr-ringt" + (on ? "" : " off"), text: KORTN[n] }));
        }
        svg.appendChild(S("rect", { x: cx - 10, y: cy - 6, width: 20, height: 22, rx: 2, class: "gr-srv" }));
        // Tyven: utenfor (pos −1), forbi lag nr. pos i rekken av fysiske lag, eller ved serveren
        var fysOn = [0, 1, 2].filter(function (k) { return s.on[k]; });
        var tx;
        if (s.caught) tx = cx - R(fysOn[Math.round(s.pos + 0.5)]) - 7;
        else if (s.pos < 0) tx = cx - R(fysOn.length ? fysOn[0] : 0) - 7;
        else if (s.pos >= fysOn.length) tx = cx - 20;
        else tx = cx - R(fysOn[s.pos]) + 10;
        svg.appendChild(S("circle", { cx: tx, cy: cy + 4, r: 7, class: "gr-thief" + (s.caught ? " caught" : "") }, [S("title", { text: s.caught ? "tyven, tatt" : "tyven" })]));
        // tidslinje
        var x0 = 290, x1 = 505, max = 12, y = 120;
        function X(t) { return x0 + (x1 - x0) * t / max; }
        svg.appendChild(S("line", { x1: x0, y1: y, x2: x1, y2: y, class: "gr-ln" }));
        for (var m = 0; m <= max; m += 3) {
          svg.appendChild(S("line", { x1: X(m), y1: y - 4, x2: X(m), y2: y + 4, class: "gr-ln" }));
          svg.appendChild(S("text", { x: X(m), y: y + 18, class: "gr-t", "text-anchor": "middle", text: m }));
        }
        svg.appendChild(S("text", { x: x0, y: y + 34, class: "gr-t", text: "minutter etter alarmen" }));
        var tot = fysOn.length * PER_LAG;
        svg.appendChild(S("rect", { x: X(0), y: y - 30, width: X(tot) - X(0), height: 10, class: "gr-bar-thief" }));
        svg.appendChild(S("text", { x: X(0), y: y - 36, class: "gr-t", text: "tyven trenger " + tot + " min" }));
        svg.appendChild(S("line", { x1: X(VAKT), y1: y - 60, x2: X(VAKT), y2: y + 6, class: "gr-vakt" }));
        svg.appendChild(S("text", { x: X(VAKT), y: y - 64, class: "gr-t gr-vaktt", "text-anchor": "middle", text: "vakta (" + VAKT + " min)" }));
        svg.appendChild(S("line", { x1: X(s.t), y1: y - 8, x2: X(s.t), y2: y + 8, class: "gr-now" }));
        var res = s.caught ? "Tyven ble tatt" : s.stolen ? (s.on[3] ? "Disken stjålet, men kryptert" : "Disken stjålet, ukryptert") : "";
        svg.appendChild(S("circle", { cx: x0 + 6, cy: 236, r: 6, class: "gr-thief" }));
        svg.appendChild(S("text", { x: x0 + 18, y: 240, class: "gr-t", text: "tyven · tallene er oppdiktet" }));
        if (res) svg.appendChild(S("text", { x: x0, y: 200, class: "gr-t gr-res" + (s.caught ? " ok" : s.on[3] ? " warn" : " nei"), text: res }));
        stage.appendChild(svg);
      }
    });
  }

  /* =========================================================
     6 · Backuplokasjon: tabell over typene, så IN.scenario der studenten velger
     billigste reserve som holder for tre virksomheter. Poeng: 2 billigste som holder,
     0 holder men dyrere enn nødvendig, −1 for treg (T brutt).
     ========================================================= */
  var BACKUP_TYPER = [
    { navn: "Kald (cold)", har: "Strøm, ellers lite", tid: "kan ta måneder", kost: 1 },
    { navn: "Varm/inaktiv (warm)", har: "Strøm og utstyr", tid: "timer til dager", kost: 2 },
    { navn: "Varm/aktiv (hot)", har: "Full operasjonell reserve", tid: "minutter til timer", kost: 3 }
  ];
  /* rett: indeks for billigste som holder. Lavere indeks = for treg, høyere = dyrere enn nødvendig. */
  var BACKUP_RUNDER = [
    { id: "butikk", til: "bhg", rett: 1,
      tekst: "<p><b>1 av 3 · Nettbutikk.</b> Butikken tåler et par dager nede, men ikke uker. Hvilken reserve velger du?</p>" },
    { id: "bhg", til: "bank", rett: 0,
      tekst: "<p><b>2 av 3 · Fjellbekk barnehage.</b> Serveren i kjelleren har fravær og vaktlister. Barnehagen kan drive med papirlister i flere måneder. Hvilken reserve velger du?</p>" },
    { id: "bank", til: "slutt", rett: 2,
      tekst: "<p><b>3 av 3 · Nettbank.</b> Banken må være i drift igjen innen en time. Hvilken reserve velger du?</p>" }
  ];
  function backupSpec() {
    var noder = {};
    BACKUP_RUNDER.forEach(function (r) {
      noder[r.id] = { tekst: r.tekst, valg: BACKUP_TYPER.map(function (ty, i) {
        var kons, p, kit;
        if (i === r.rett) { p = 2; kit = { T: "ok" }; kons = "Riktig. " + ty.navn + " er den billigste som holder. Tid til drift er " + ty.tid + "."; }
        else if (i < r.rett) { p = -1; kit = { T: "brutt" }; kons = "For treg: " + ty.navn.toLowerCase() + " tar " + ty.tid + " å få i drift. Virksomheten er nede lenger enn den tåler, så T er brutt."; }
        else { p = 0; kit = { T: "ok" }; kons = "Holder, men du betaler for mer enn nødvendig. " + BACKUP_TYPER[r.rett].navn + " hadde vært nok."; }
        return { tekst: ty.navn + " · " + ty.tid, til: r.til, poeng: p, kit: kit, konsekvens: kons };
      }) };
    });
    noder.slutt = { slutt: true, oppsummering: {
      eli5: "<p>Jo fortere du må være i gang igjen, jo dyrere reserve. Den som kan vente lenge, klarer seg med et tomt rom med strøm.</p>",
      normal: "<p>Valget er en avveining mellom kostnad og hvor fort man er i drift igjen. Finn først hvor lenge virksomheten tåler å være nede, og velg så den billigste typen som er rask nok: barnehagen kald, nettbutikken varm/inaktiv og nettbanken varm/aktiv.</p>",
      teknisk: "<p>Backuplokasjonene er korrigerende tiltak for T. Kravet er hvor lang nedetid virksomheten tåler. En kald reserve har bare strøm, så utstyr må skaffes og settes opp. En varm/inaktiv har utstyret klart. En varm/aktiv er en full operasjonell reserve og koster mest. Tidene er lysarkets grove intervaller.</p>"
    } };
    return {
      id: "grunn-backup",
      opphav: { type: "egen", kilder: ["d01b s. 34"] },
      tittel: "Velg den billigste reserven (backuplokasjonen) som holder for hver virksomhet. Panelet viser om tilgjengeligheten (T) holder.",
      kit: ["T"],
      start: BACKUP_RUNDER[0].id,
      noder: noder
    };
  }
  function backup(host) {
    host = H(host); if (!host) return null;
    clear(host);
    var t = el("table", { class: "gr-tab" });
    t.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "Type" }), el("th", { text: "Har" }), el("th", { text: "Tid til drift" }), el("th", { text: "Kostnad" })])]));
    var tb = el("tbody");
    BACKUP_TYPER.forEach(function (ty) {
      tb.appendChild(el("tr", {}, [el("td", { html: "<b>" + ty.navn + "</b>" }), el("td", { text: ty.har }), el("td", { text: ty.tid }),
        el("td", { html: "<span class=\"gr-kost\" aria-label=\"" + ["lav", "middels", "høy"][ty.kost - 1] + "\">" + "●●●".slice(0, ty.kost) + "<span class=\"off\">" + "●●●".slice(ty.kost) + "</span></span>" })]));
    });
    t.appendChild(tb);
    host.appendChild(el("div", { class: "table-wrap" }, [t]));
    var sc = el("div");
    host.appendChild(sc);
    return IN.scenario(sc, backupSpec());
  }

  /* =========================================================
     8 · § 204-sjekk for pentest
     ========================================================= */
  var SPM = [
    { q: "Har du tillatelse?", nei: "Ikke en lovlig pentest. Får testen tilgang ved å bryte en beskyttelse eller på annen uberettiget måte, er det straffbart etter straffeloven § 204 (bot eller fengsel inntil 2 år). God hensikt hjelper ikke." },
    { q: "Er tillatelsen skriftlig?", nei: "Ikke godkjent: tillatelsen skal alltid være skriftlig. Et muntlig ja er ikke nok." },
    { q: "Ble den gitt før testen startet?", nei: "Ikke godkjent: tillatelsen skal være på plass på forhånd." },
    { q: "Har den som ga den, myndighet over systemet?", nei: "Ikke godkjent: bare den som har myndighet over systemet, kan gi lov. Ellers er tilgangen uberettiget." }
  ];
  var SCEN = [
    { k: "a) Tarjei tester appen uten å spørre", a: [false] },
    { k: "b) Leverandøren sier «ja, bare gjør det» på telefon", a: [true, false] },
    { k: "c) Styreren signerer for leverandørens system", a: [true, true, true, false] },
    { k: "d) Leverandøren signerer en avtale en uke før testen", a: [true, true, true, true] }
  ];
  function lov(host) {
    host = H(host); if (!host) return;
    var root = el("div", { class: "gr-viz gr-lov" });
    var row = el("div", { class: "gr-row", role: "group", "aria-label": "Scenario" }), tree = el("ol", { class: "gr-tree" }), out = el("p", { class: "gr-out", "aria-live": "polite" });
    var cur = null, egen = null;
    var bs = SCEN.map(function (s, n) { var b = btn(s.k, function () { cur = n; egen = null; paint(); }); row.appendChild(b); return b; });
    var bE = btn("Svar selv", function () { cur = null; egen = []; paint(); }); row.appendChild(bE);
    function paint() {
      bs.forEach(function (b, m) { press(b, m === cur); }); press(bE, egen != null);
      var a = cur != null ? SCEN[cur].a : (egen || []);
      clear(tree);
      SPM.forEach(function (sp, n) {
        var st = n < a.length ? (a[n] ? "ja" : "nei") : "";
        var li = el("li", { class: "gr-node " + (st === "ja" ? "ok" : st === "nei" ? "nei" : n === a.length && egen != null && (n === 0 || a[n - 1]) ? "now" : "off") });
        li.appendChild(el("span", { class: "gr-q", text: sp.q }));
        if (st) li.appendChild(el("span", { class: "gr-ans", text: st === "ja" ? " Ja" : " Nei" }));
        if (egen != null && n === a.length && (n === 0 || a[n - 1])) {
          li.appendChild(btn("Ja", function () { egen.push(true); paint(); }));
          li.appendChild(btn("Nei", function () { egen.push(false); paint(); }));
        }
        if (st === "nei") li.appendChild(el("p", { class: "small", text: sp.nei }));
        tree.appendChild(li);
      });
      var stop = a.indexOf(false) >= 0, fullt = a.length === 4 && !stop;
      out.className = "gr-out " + (fullt ? "ok" : stop ? "nei" : "");
      out.innerHTML = fullt ? "<b>Lovlig pentest</b>, så lenge testen holder seg innenfor det avtalen beskriver." :
        stop ? "<b>Ikke en lovlig pentest.</b> Treet stopper ved første nei." : (cur == null && egen == null ? "Velg et scenario, eller svar selv." : "Svar på neste spørsmål.");
    }
    root.appendChild(row); root.appendChild(tree); root.appendChild(out); paint();
    clear(host); host.appendChild(root);
  }

  IN.vizGrunn = {
    gjerder: gjerder, kit: kit, tiltak: tiltak, sja: sja, bemanning: bemanning,
    dybde: dybde, backup: backup, lov: lov,
    _data: { FIG: FIG, KIT_RADER: KIT_RADER, kitSpec: kitSpec, TILTAK: TILTAK, SJA: SJA, SJA_SJEKK: SJA_SJEKK,
             dybdeSteps: dybdeSteps, BACKUP_TYPER: BACKUP_TYPER, BACKUP_RUNDER: BACKUP_RUNDER, backupSpec: backupSpec }
  };
})();
