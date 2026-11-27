/* viz-dhfarge.js — Diffie–Hellman som fargeblanding (IN2120, blokk 2).
   IN.dhFarge(host): stegspiller i 14 små steg. Hvert steg har
     1) en handlingsflate som viser det som skjer akkurat nå (velge, blande, sende, sammenligne),
     2) en kunnskapstabell «Hvem kjenner hva?» med én kolonne for Alice, Bob og Eve, der hver celle
        er en fargeprøve (kjent) eller et stiplet «?» (ukjent). Nye celler i steget er markert.
   Fargemodellen: en bøtte er en liste med like store deler maling, og fargen er snittet av delene.
   Oppskriftsstripa viser delene, så det synes at Alice og Bob får de samme tre delene
   (gul + a + b, bare i ulik rekkefølge), mens Eve får gul to ganger.
   Selvtest: IN.dhFarge.sjekk(). */
(function () {
  "use strict";
  var IN = window.IN, el = IN.el;

  var GUL = { navn: "gul", hex: "#f5d90a" };
  var ALICE = [
    { navn: "oransje", hex: "#ff5a1f" }, { navn: "rød", hex: "#d7263d" },
    { navn: "lilla", hex: "#7b3fa0" }, { navn: "grønn", hex: "#2e9b4a" }
  ];
  var BOB = [
    { navn: "turkis", hex: "#3fc1c9" }, { navn: "blå", hex: "#2f6fd6" },
    { navn: "rosa", hex: "#e26fb0" }, { navn: "svart", hex: "#222222" }
  ];
  var PERS = [
    { id: "alice", navn: "Alice" },
    { id: "bob", navn: "Bob" },
    { id: "eve", navn: "Eve", sub: "lytter" }
  ];

  function rgb(hex) { return [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16); }); }
  function hex(c) { return "#" + c.map(function (v) { var s = Math.round(v).toString(16); return s.length < 2 ? "0" + s : s; }).join(""); }
  function farge(deler) {
    var s = [0, 0, 0];
    deler.forEach(function (d) { var c = rgb(d.hex); s[0] += c[0]; s[1] += c[1]; s[2] += c[2]; });
    return hex(s.map(function (v) { return v / deler.length; }));
  }
  function navnListe(deler) { return deler.map(function (d) { return d.navn; }).join(" + "); }

  /* ---------- Byggeklosser ---------- */
  // Fargeprøve (sirkel). str: "s" (tabell), "m", "l" (handlingsflaten)
  function prove(hexv, navn, str, ekstra) {
    return el("span", { class: "dhf-pr dhf-pr-" + (str || "m") + (ekstra ? " " + ekstra : ""), role: "img",
      "aria-label": navn, title: navn, style: "background:" + hexv });
  }
  function ukjent(str) { return el("span", { class: "dhf-pr dhf-pr-" + (str || "s") + " dhf-ukj", role: "img", "aria-label": "ukjent", text: "?" }); }
  // Fargeprøve med tekst under
  function figur(hexv, navn, under, opt) {
    opt = opt || {};
    var f = el("div", { class: "dhf-fig" + (opt.feil ? " feil" : "") + (opt.ny ? " ny" : "") });
    f.appendChild(prove(hexv, navn, opt.str || "l", opt.hemmelig ? "hemmelig" : ""));
    f.appendChild(el("div", { class: "dhf-fig-t", html: under }));
    return f;
  }
  function op(tegn) { return el("span", { class: "dhf-op", "aria-hidden": "true", text: tegn }); }
  // Oppskriftsstripe: én like bred del per malingsdel, i rekkefølgen de ble helt oppi
  function stripe(deler, tittel, opt) {
    opt = opt || {};
    var w = el("div", { class: "dhf-oppskrift" + (opt.feil ? " feil" : "") });
    w.appendChild(el("div", { class: "dhf-opp-h", html: tittel }));
    var bar = el("div", { class: "dhf-opp-bar", role: "img", "aria-label": "Oppskrift: " + navnListe(deler) });
    deler.forEach(function (d) {
      bar.appendChild(el("span", { class: "dhf-opp-del", style: "background:" + d.hex }));
    });
    w.appendChild(bar);
    var lbl = el("div", { class: "dhf-opp-lbl", "aria-hidden": "true" });
    deler.forEach(function (d) { lbl.appendChild(el("span", { text: d.navn })); });
    w.appendChild(lbl);
    return w;
  }

  /* ---------- Data per valg ---------- */
  function lagVerdier(a, b) {
    var A = [GUL, a], B = [GUL, b], KA = [GUL, b, a], KB = [GUL, a, b], EVE = [GUL, a, GUL, b];
    return {
      a: a, b: b, A: A, B: B, KA: KA, KB: KB, EVE: EVE,
      rader: {
        g: { navn: "Startfarge", sym: "g", hex: GUL.hex, fnavn: "gul", status: "off" },
        a: { navn: "Alices hemmelige", sym: "a", hex: a.hex, fnavn: a.navn, status: "hem" },
        b: { navn: "Bobs hemmelige", sym: "b", hex: b.hex, fnavn: b.navn, status: "hem" },
        A: { navn: "Alices blanding", sym: "A = g<sup>a</sup>", hex: farge(A), fnavn: navnListe(A), status: "off" },
        B: { navn: "Bobs blanding", sym: "B = g<sup>b</sup>", hex: farge(B), fnavn: navnListe(B), status: "off" },
        K: { navn: "Felles farge", sym: "K = g<sup>ab</sup>", hex: farge(KA), fnavn: navnListe(KB), status: "hem" },
        E: { navn: "Eves forsøk", sym: "A·B = g<sup>a+b</sup>", hex: farge(EVE), fnavn: navnListe(EVE), status: "feil" }
      }
    };
  }

  // Hvem kjenner hva etter hvert steg (kumulativt). Nøkkel = rad, verdi = personer.
  var KJENNER = [
    {},
    { g: "abe" },
    { g: "abe", a: "a" },
    { g: "abe", a: "a", b: "b" },
    { g: "abe", a: "a", b: "b", A: "a" },
    { g: "abe", a: "a", b: "b", A: "a", B: "b" },
    { g: "abe", a: "a", b: "b", A: "a", B: "b" },
    { g: "abe", a: "a", b: "b", A: "abe", B: "b" },
    { g: "abe", a: "a", b: "b", A: "abe", B: "abe" },
    { g: "abe", a: "a", b: "b", A: "abe", B: "abe", K: "a" },
    { g: "abe", a: "a", b: "b", A: "abe", B: "abe", K: "ab" },
    { g: "abe", a: "a", b: "b", A: "abe", B: "abe", K: "ab" },
    { g: "abe", a: "a", b: "b", A: "abe", B: "abe", K: "ab", E: "e" },
    { g: "abe", a: "a", b: "b", A: "abe", B: "abe", K: "ab", E: "e" }
  ];
  var RADER = ["g", "a", "b", "A", "B", "K", "E"];
  function harRad(i, r) { return r !== "E" || i >= 12; }
  function kjenner(i, r, p) { return (KJENNER[i][r] || "").indexOf(p.charAt(0)) >= 0; }
  function ny(i, r, p) { return kjenner(i, r, p) && (i === 0 || !kjenner(i - 1, r, p)); }

  /* ---------- Stegene ---------- */
  function generate(inp) {
    var v = lagVerdier(ALICE[+inp[0] || 0], BOB[+inp[1] || 0]);
    var a = v.a.navn, b = v.b.navn;
    var S = [
      { tag: "Utgangspunktet", vis: "scene",
        text: {
          eli5: "Alice og Bob vil finne på en <b>hemmelig farge</b> som bare de to kjenner. Problemet: de kan bare snakke sammen over en linje der <b>Eve</b> hører og ser alt som sendes. Tabellen under viser hva hver av dem vet. Akkurat nå vet ingen noe.",
          normal: "Alice og Bob skal bli enige om en felles hemmelighet over en åpen kanal. Eve er en <b>passiv avlytter</b>: hun ser alt som sendes, men endrer ingenting. Tabellen «Hvem kjenner hva?» følger med gjennom alle stegene.",
          teknisk: "Mål: etablere en felles hemmelighet K over en usikret kanal uten å ha delt noen hemmelighet på forhånd. Trusselmodellen her er en passiv avlytter (Eve). Aktiv mann-i-midten kommer til slutt." } },
      { tag: "Offentlig startfarge", vis: "felles",
        text: {
          eli5: "Først blir Alice og Bob enige om en startfarge, <b>gul</b>. De sier det høyt over linja, så Eve hører det også. Det gjør ingenting: startfargen er ikke hemmelig.",
          normal: "Startfargen <b>gul</b> avtales åpent. Alle tre kjenner den nå, også Eve. Sikkerheten skal ikke hvile på at startfargen er hemmelig.",
          teknisk: "De offentlige parametrene er primtallet p og generatoren g (gul). De er kjent for alle, ofte på forhånd som standardiserte grupper." } },
      { tag: "Alice velger en hemmelig farge", vis: "velg", hvem: "alice",
        text: {
          eli5: "Alice velger en farge i hemmelighet: <b>" + a + "</b>. Hun viser den aldri til noen, ikke engang til Bob.",
          normal: "Alice velger en privat farge, <b>" + a + "</b>. Den forlater aldri Alice. Se tabellen: bare Alice har den.",
          teknisk: "Alice trekker et tilfeldig privat tall a. Det sendes aldri. I TLS 1.3 lages en ny a for hver økt (efemær DH)." } },
      { tag: "Bob velger en hemmelig farge", vis: "velg", hvem: "bob",
        text: {
          eli5: "Bob gjør det samme og velger <b>" + b + "</b>. Nå har hver av dem en farge som bare de selv kjenner.",
          normal: "Bob velger sin private farge, <b>" + b + "</b>. Alice kjenner ikke Bobs farge, og Bob kjenner ikke Alices.",
          teknisk: "Bob trekker sitt private tall b. Ingen av partene kjenner den andres private tall, og det trenger de heller ikke." } },
      { tag: "Alice blander", vis: "bland", hvem: "alice",
        text: {
          eli5: "Alice heller sin hemmelige " + a + " oppi en bøtte gul og rører. Blandingen får en ny farge. Stripa under viser hva som er i bøtta: én del gul og én del " + a + ".",
          normal: "Alice blander gul + " + a + " og får sin <b>blanding</b>. Å blande er lett. Blandingen skal sendes åpent, så det viktige er at den ikke røper " + a + ".",
          teknisk: "Alice regner A = g<sup>a</sup> mod p. Det er raskt å regne ut, selv med svært store tall." } },
      { tag: "Bob blander", vis: "bland", hvem: "bob",
        text: {
          eli5: "Bob gjør det samme: gul + " + b + ". Nå har begge en blandingsbøtte.",
          normal: "Bob blander gul + " + b + " og får sin blanding. Hver av dem har nå tre ting: gul, sin hemmelige farge og sin blanding.",
          teknisk: "Bob regner B = g<sup>b</sup> mod p." } },
      { tag: "Blandingen kan ikke skilles", vis: "enveis",
        text: {
          eli5: "Det er lett å blande maling, men det går ikke å skille den ut igjen. Ser du bare blandingen, vet du ikke hvilken farge som ble helt oppi. Derfor tør Alice og Bob å sende blandingene åpent.",
          normal: "Blanding er en <b>enveisoperasjon</b>: lett den ene veien, praktisk umulig tilbake. Merk at bildet halter litt: med ekte maling kunne man kanskje gjettet seg fram. Med matematikken finnes det ingen kjent rask måte.",
          teknisk: "Å finne a fra A = g<sup>a</sup> mod p er det <b>diskrete logaritmeproblemet</b>. Med store nok p (og riktig valgt gruppe) finnes ingen kjent effektiv algoritme på vanlige datamaskiner. (En stor kvantedatamaskin kan løse det med Shors algoritme, derfor er DH ikke kvantesikker.)" } },
      { tag: "Alice sender blandingen sin", vis: "send", hvem: "alice",
        text: {
          eli5: "Alice sender blandingsbøtta til Bob over linja. Eve ser bøtta på veien og lager seg en kopi. Se tabellen: nå har både Bob og Eve Alices blanding.",
          normal: "A sendes i klartekst. Bob og Eve får den. Eve har nå gul og Alices blanding, men ikke " + a + ".",
          teknisk: "A sendes åpent (i TLS 1.3 i key_share i ClientHello). Eve kjenner nå p, g og A." } },
      { tag: "Bob sender blandingen sin", vis: "send", hvem: "bob",
        text: {
          eli5: "Bob sender sin blanding til Alice. Eve tar en kopi av den også. Eve har nå sett alt som er sendt: gul og begge blandingene.",
          normal: "B sendes i klartekst. Eve har nå alt som gikk over linja, men ingen av de hemmelige fargene.",
          teknisk: "B sendes åpent (key_share i ServerHello). Eve kjenner p, g, A og B, alt som er offentlig." } },
      { tag: "Alice blander inn sin hemmelige farge", vis: "fellesA",
        spor: { sporsmal: "Alice har fått Bobs blanding. Hva gjør hun nå for å lage den felles fargen?",
          valg: ["Heller sin hemmelige farge oppi Bobs blanding", "Sender sin hemmelige farge til Bob", "Blander sin egen blanding med Bobs blanding"],
          fasit: 0, forklaring: "Alice bruker Bobs blanding og sin egen hemmelige farge. Hun sender aldri noe hemmelig." },
        text: {
          eli5: "Alice tar Bobs blanding og heller sin hemmelige " + a + " oppi. Stripa viser innholdet: gul, " + b + " (fra Bob) og " + a + ".",
          normal: "Alice blander Bobs blanding (gul + " + b + ") med sin hemmelige " + a + ". Resultatet er den <b>felles fargen</b>, men det vet hun ikke før Bob har gjort det samme.",
          teknisk: "Alice regner K = B<sup>a</sup> = (g<sup>b</sup>)<sup>a</sup> mod p." } },
      { tag: "Bob blander inn sin hemmelige farge", vis: "fellesB",
        spor: { sporsmal: "Bob heller sin " + b + " oppi Alices blanding. Får han samme farge som Alice?",
          valg: ["Ja, samme farge", "Nei, de blandet i ulik rekkefølge"],
          fasit: 0, forklaring: "Bøttene inneholder de samme tre delene. Rekkefølgen spiller ingen rolle." },
        text: {
          eli5: "Bob heller sin " + b + " oppi Alices blanding. Han får <b>nøyaktig samme farge</b> som Alice!",
          normal: "Bob blander Alices blanding (gul + " + a + ") med sin hemmelige " + b + ". Han får samme farge som Alice uten at noen av dem har sendt sin hemmelige farge.",
          teknisk: "Bob regner K = A<sup>b</sup> = (g<sup>a</sup>)<sup>b</sup> mod p. Siden (g<sup>b</sup>)<sup>a</sup> = (g<sup>a</sup>)<sup>b</sup> = g<sup>ab</sup> mod p, får begge samme K." } },
      { tag: "Hvorfor ble fargene like?", vis: "sammenlign",
        text: {
          eli5: "Se på stripene: begge bøttene har én del gul, én del " + a + " og én del " + b + ". Alice helte " + a + " oppi sist, Bob helte " + b + " oppi sist. Når alt er rørt sammen, blir fargen den samme.",
          normal: "Begge bøttene har de samme tre delene: gul + " + a + " + " + b + ". Bare rekkefølgen er ulik, og rekkefølgen spiller ingen rolle for blandingen. Det er hele trikset i Diffie–Hellman.",
          teknisk: "Eksponentiering kommuterer: (g<sup>a</sup>)<sup>b</sup> = (g<sup>b</sup>)<sup>a</sup> = g<sup>ab</sup> mod p. I praksis sendes K gjennom en nøkkelavledningsfunksjon (KDF) som gir de symmetriske øktnøklene." } },
      { tag: "Hva kan Eve gjøre?", vis: "eve",
        spor: { sporsmal: "Eve blander de to blandingene hun har sett (Alices og Bobs). Får hun den felles fargen?",
          valg: ["Ja", "Nei"], fasit: 1,
          forklaring: "Eve får gul to ganger. Hun mangler en av de hemmelige fargene, og den kan hun ikke skille ut av blandingene." },
        text: {
          eli5: "Eve heller de to blandingene hun så sammen. Men stripa viser at hun får <b>to deler gul</b>. Fargen hennes blir feil. For å få riktig farge måtte hun hatt " + a + " eller " + b + ", og dem kan hun ikke skille ut.",
          normal: "Eve har gul, Alices blanding og Bobs blanding. Blander hun blandingene, får hun gul to ganger, og fargen blir en annen enn Alice og Bobs. Hun trenger én av de hemmelige fargene, og den kan hun ikke skille ut (steg 6).",
          teknisk: "A · B = g<sup>a</sup> · g<sup>b</sup> = g<sup>a+b</sup> ≠ g<sup>ab</sup> mod p. For å få g<sup>ab</sup> må Eve løse Diffie–Hellman-problemet, og den kjente veien går via diskret logaritme." } },
      { tag: "Oppsummering", vis: "slutt",
        text: {
          eli5: "Alice og Bob har en felles hemmelig farge, og den ble aldri sendt. Eve så alt som ble sendt, men har bare spørsmålstegn der det hemmelige står. Etterpå kaster Alice og Bob de hemmelige fargene sine.",
          normal: "Les tabellen: Alice og Bob kjenner K. Eve kjenner bare det offentlige (gul og begge blandingene) og mangler a, b og K. Etter økta slettes a og b. Da kan ingen regne ut K igjen senere, selv om en langtidsnøkkel lekker: det er <b>fremoverhemmelighold</b>. Men DH alene sier ikke <i>hvem</i> du snakker med: en aktiv angriper kan bytte ut blandingene (mann-i-midten, se øvingen under).",
          teknisk: "Passiv avlytter: får p, g, A, B, men ikke K. Efemære a og b slettes etter økta → fremoverhemmelighold. DH gir ingen autentisering: mot aktiv MitM må DH-verdiene (eller hele håndtrykket) signeres, som i TLS 1.3 og IKE." } }
    ];
    return S.map(function (s, i) { s.i = i; s.v = v; return s; });
  }

  /* ---------- Blandeanimasjon ----------
     Viser én blanding i faser: tom bøtte → hver ingrediens helles oppi som et eget lag (lagene ligger
     hver for seg) → det røres rundt til fargen er jevn → resultatet vises. Spilles av automatisk når
     steget vises. Fasene kan også velges for hånd (knappene under bøtta), og «Spill igjen» starter på nytt.
     Med prefers-reduced-motion vises sluttfasen direkte, og fasene kan trykkes gjennom.
     opt: { ingred: [{ navn, hex, deler, under, hemmelig }], bottenavn, resultat: { hex, navn, under, feil } } */
  var ROLIG = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function blandAnim(opt) {
    var ing = opt.ingred, alle = [];
    ing.forEach(function (x) { alle = alle.concat(x.deler); });
    var mix = farge(alle), N = ing.length;
    // Fasene: 0 tom, 1..N helt oppi, N+1 røres, N+2 ferdig
    var FASER = [{ k: "Tom bøtte", t: "Bøtta er tom." }];
    ing.forEach(function (x, i) {
      FASER.push({ k: (i + 1) + " · " + x.navn, t: (i + 1) + ". <b>" + x.navn + "</b> helles oppi." +
        (x.deler.length > 1 ? " Den er selv en blanding av " + navnListe(x.deler) + "." : "") });
    });
    FASER.push({ k: (N + 1) + " · rør", t: (N + 1) + ". Det røres rundt. Lagene flyter sammen." });
    FASER.push({ k: "✓ ferdig", t: "Ferdig: <b>" + opt.resultat.under + "</b>. Delene kan ikke skilles ut igjen." });
    var SISTE = FASER.length - 1, ROR = N + 1;

    var w = el("div", { class: "dhf-anim" });
    // Ingrediensene øverst
    var irad = el("div", { class: "dhf-likn dhf-ingr" }), ifig = [];
    ing.forEach(function (x, i) {
      if (i) irad.appendChild(op("+"));
      var f = figur(x.hex, x.navn, x.under, { hemmelig: x.hemmelig, str: "m" });
      f.appendChild(el("span", { class: "dhf-helt", "aria-hidden": "true", text: "↓ helles oppi" }));
      ifig.push(f); irad.appendChild(f);
    });
    w.appendChild(irad);
    // Bøtta og resultatet
    var brad = el("div", { class: "dhf-likn dhf-brad" });
    var bwrap = el("div", { class: "dhf-fig" });
    var botte = el("div", { class: "dhf-botte", role: "img", "aria-label": opt.bottenavn });
    var lagbox = el("div", { class: "dhf-lagbox" }), lag = [];
    ing.forEach(function (x) {
      var l = el("div", { class: "dhf-lag", style: "background:" + x.hex });
      l.setAttribute("data-h", Math.round(84 * x.deler.length / alle.length));
      lag.push(l); lagbox.appendChild(l);
    });
    botte.appendChild(lagbox);
    botte.appendChild(el("div", { class: "dhf-ror", "aria-hidden": "true" }));
    bwrap.appendChild(botte);
    bwrap.appendChild(el("div", { class: "dhf-fig-t", text: opt.bottenavn }));
    brad.appendChild(bwrap);
    var pil = op("=");
    var res = figur(opt.resultat.hex, opt.resultat.navn, opt.resultat.under, { feil: opt.resultat.feil, ny: true });
    brad.appendChild(pil); brad.appendChild(res);
    w.appendChild(brad);
    var tekst = el("p", { class: "dhf-akt-t dhf-fase-t" });
    w.appendChild(tekst);
    // Oppskriftsstripa fylles etter hvert
    var str = stripe(alle, "I bøtta:"), deler = IN.qsa(".dhf-opp-del", str), lbl = IN.qsa(".dhf-opp-lbl span", str);
    w.appendChild(str);
    // Fasevelger
    var kn = el("div", { class: "dhf-faser", role: "group", "aria-label": "Faser i blandingen" }), fk = [];
    FASER.forEach(function (f, i) {
      var b = el("button", { type: "button", class: "dhf-fase", text: f.k });
      b.addEventListener("click", function () { stopp(); vis(i); });
      fk.push(b); kn.appendChild(b);
    });
    var igjen = el("button", { type: "button", class: "dhf-fase dhf-igjen", text: "↻ Spill igjen" });
    igjen.addEventListener("click", function () { spill(); });
    kn.appendChild(igjen);
    w.appendChild(kn);

    var tid = null;
    function stopp() { if (tid) { clearTimeout(tid); tid = null; } }
    function vis(p) {
      var oppi = Math.min(p, N);              // antall ingredienser i bøtta
      var rort = p >= ROR;
      lag.forEach(function (l, i) {
        l.style.height = i < oppi ? l.getAttribute("data-h") + "%" : "0%";
        l.style.background = rort ? mix : ing[i].hex;
      });
      botte.classList.toggle("rorer", p === ROR);
      botte.classList.toggle("rort", rort);
      ifig.forEach(function (f, i) { f.classList.toggle("aktiv", p === i + 1); f.classList.toggle("oppi", i < oppi); });
      var n = 0; ing.forEach(function (x, i) { if (i < oppi) n += x.deler.length; });
      deler.forEach(function (d, i) { d.classList.toggle("tom", i >= n); });
      lbl.forEach(function (d, i) { d.classList.toggle("tom", i >= n); });
      var ferdig = p === SISTE;
      pil.classList.toggle("skjult", !ferdig); res.classList.toggle("skjult", !ferdig);
      tekst.innerHTML = FASER[p].t;
      fk.forEach(function (b, i) { b.setAttribute("aria-pressed", i === p ? "true" : "false"); });
    }
    function spill() {
      stopp();
      if (ROLIG) { vis(SISTE); return; }
      var p = 0; vis(0);
      (function neste() {
        var d = p === 0 ? 500 : p === ROR ? 1500 : 1100;   // ms: tom bøtte, helling, røring
        tid = setTimeout(function () {
          if (!w.isConnected) { tid = null; return; }       // steget er byttet ut
          p++; vis(p);
          if (p < SISTE) neste(); else tid = null;
        }, d);
      })();
    }
    vis(SISTE);                // riktig sluttbilde også før animasjonen starter
    tid = setTimeout(spill, 60);   // start etter at steget er satt inn (et klikk på en fase før det avbryter)
    return w;
  }

  /* ---------- Handlingsflaten ---------- */
  function handling(s) {
    var v = s.v, R = v.rader, w = el("div", { class: "dhf-akt", "aria-live": "off" });
    function person(id) { return id === "alice" ? "Alice" : id === "bob" ? "Bob" : "Eve"; }
    function rad(barn) { var r = el("div", { class: "dhf-likn" }); barn.forEach(function (x) { r.appendChild(x); }); return r; }
    switch (s.vis) {
      case "scene":
        w.appendChild(linje(null));
        w.appendChild(el("p", { class: "dhf-akt-t", text: "Alt som går over linja, ser Eve." }));
        break;
      case "felles":
        w.appendChild(linje(prove(GUL.hex, "gul", "m")));
        w.appendChild(el("p", { class: "dhf-akt-t", html: "Startfargen <b>gul</b> sies høyt. Alle tre får den." }));
        break;
      case "velg":
        var h = s.hvem === "alice" ? v.a : v.b;
        w.appendChild(rad([figur(h.hex, h.navn, person(s.hvem) + "s hemmelige: <b>" + h.navn + "</b>", { hemmelig: true, ny: true })]));
        w.appendChild(el("p", { class: "dhf-akt-t", text: "Holdes hemmelig. Sendes aldri." }));
        break;
      case "bland":
        var hs = s.hvem === "alice" ? v.a : v.b, rr = s.hvem === "alice" ? R.A : R.B;
        w.appendChild(blandAnim({ bottenavn: person(s.hvem) + "s bøtte",
          ingred: [{ navn: "gul", hex: GUL.hex, deler: [GUL], under: "gul (offentlig)" },
                   { navn: hs.navn, hex: hs.hex, deler: [hs], under: hs.navn + " (hemmelig)", hemmelig: true }],
          resultat: { hex: rr.hex, navn: rr.fnavn, under: person(s.hvem) + "s blanding" } }));
        break;
      case "enveis":
        w.appendChild(rad([figur(R.A.hex, R.A.fnavn, "Alices blanding"), op("→"),
          el("div", { class: "dhf-fig" }, [el("div", { class: "dhf-likn dhf-gjett" }, [ukjent("m"), op("+"), ukjent("m")]),
            el("div", { class: "dhf-fig-t", text: "Hvilke farger?" })])]));
        w.appendChild(el("p", { class: "dhf-akt-t", text: "Blande: lett. Skille ut igjen: praktisk umulig." }));
        break;
      case "send":
        var rs = s.hvem === "alice" ? R.A : R.B;
        w.appendChild(linje(prove(rs.hex, rs.fnavn, "m"), s.hvem === "alice" ? "→" : "←"));
        w.appendChild(el("p", { class: "dhf-akt-t", html: person(s.hvem) + " sender blandingen sin til " + (s.hvem === "alice" ? "Bob" : "Alice") + ". Eve tar en kopi." }));
        break;
      case "fellesA":
        w.appendChild(blandAnim({ bottenavn: "Alices bøtte",
          ingred: [{ navn: "Bobs blanding", hex: R.B.hex, deler: v.B, under: "Bobs blanding (mottatt)" },
                   { navn: v.a.navn, hex: v.a.hex, deler: [v.a], under: v.a.navn + " (hemmelig)", hemmelig: true }],
          resultat: { hex: R.K.hex, navn: R.K.fnavn, under: "felles farge" } }));
        break;
      case "fellesB":
        w.appendChild(blandAnim({ bottenavn: "Bobs bøtte",
          ingred: [{ navn: "Alices blanding", hex: R.A.hex, deler: v.A, under: "Alices blanding (mottatt)" },
                   { navn: v.b.navn, hex: v.b.hex, deler: [v.b], under: v.b.navn + " (hemmelig)", hemmelig: true }],
          resultat: { hex: R.K.hex, navn: R.K.fnavn, under: "felles farge" } }));
        break;
      case "sammenlign":
        w.appendChild(rad([figur(farge(v.KA), R.K.fnavn, "Alice"), op("="), figur(farge(v.KB), R.K.fnavn, "Bob")]));
        w.appendChild(stripe(v.KA, "Alices bøtte:"));
        w.appendChild(stripe(v.KB, "Bobs bøtte:"));
        w.appendChild(el("p", { class: "dhf-akt-t", text: "Samme tre deler, ulik rekkefølge → samme farge." }));
        break;
      case "eve":
        w.appendChild(blandAnim({ bottenavn: "Eves bøtte",
          ingred: [{ navn: "Alices blanding", hex: R.A.hex, deler: v.A, under: "Alices blanding (kopi)" },
                   { navn: "Bobs blanding", hex: R.B.hex, deler: v.B, under: "Bobs blanding (kopi)" }],
          resultat: { hex: R.E.hex, navn: R.E.fnavn, under: "Eves forsøk", feil: true } }));
        w.appendChild(stripe(v.KB, "Til sammenligning, Alice og Bobs bøtte (felles farge):"));
        w.appendChild(el("p", { class: "dhf-akt-t", text: "Eve får gul to ganger og mangler en hemmelig farge, så fargen blir feil." }));
        break;
      case "slutt":
        w.appendChild(rad([figur(R.K.hex, R.K.fnavn, "Alice og Bob: <b>felles farge</b>"), op("≠"),
          figur(R.E.hex, R.E.fnavn, "Eve: bare feil forsøk", { feil: true })]));
        w.appendChild(el("p", { class: "dhf-akt-t", html: "Eve mangler: " + v.a.navn + " (a), " + v.b.navn + " (b) og den felles fargen (K)." }));
        break;
    }
    return w;
  }
  // Linja mellom Alice og Bob, med Eve under. ting = fargeprøve som er på vei (valgfritt)
  function linje(ting, retning) {
    var w = el("div", { class: "dhf-linje" });
    w.appendChild(el("div", { class: "dhf-ende", text: "Alice" }));
    var mid = el("div", { class: "dhf-kanal" });
    var str = el("div", { class: "dhf-streng" });
    if (ting) {
      var b = el("div", { class: "dhf-pakke" + (retning === "←" ? " venstre" : retning === "→" ? " hoyre" : "") });
      if (retning === "→") b.appendChild(el("span", { class: "dhf-ret", "aria-hidden": "true", text: "→" }));
      b.insertBefore(ting, b.firstChild);
      if (retning === "←") b.insertBefore(el("span", { class: "dhf-ret", "aria-hidden": "true", text: "←" }), b.firstChild);
      str.appendChild(b);
    }
    mid.appendChild(str);
    mid.appendChild(el("div", { class: "dhf-eve", html: "Eve lytter" + (ting ? " og tar en kopi" : "") }));
    w.appendChild(mid);
    w.appendChild(el("div", { class: "dhf-ende", text: "Bob" }));
    return w;
  }

  /* ---------- Kunnskapstabellen ---------- */
  var STATUS = { off: "offentlig", hem: "hemmelig", feil: "feil" };
  function tabell(s) {
    var i = s.i, R = s.v.rader;
    var t = el("table", { class: "dhf-tab" });
    t.appendChild(el("caption", { text: "Hvem kjenner hva?" }));
    var hr = el("tr");
    hr.appendChild(el("th", { scope: "col", class: "dhf-tab-rad", text: "" }));
    PERS.forEach(function (p) {
      hr.appendChild(el("th", { scope: "col", class: "dhf-tab-p dhf-p-" + p.id, html: p.navn + (p.sub ? '<span class="dhf-sub">' + p.sub + "</span>" : "") }));
    });
    t.appendChild(el("thead", {}, [hr]));
    var tb = el("tbody");
    RADER.forEach(function (r) {
      if (!harRad(i, r)) return;
      var d = R[r], tr = el("tr", { class: "dhf-r-" + d.status });
      var th = el("th", { scope: "row", class: "dhf-tab-rad" });
      th.appendChild(el("span", { class: "dhf-rn", text: d.navn }));
      th.appendChild(el("span", { class: "dhf-rs", html: d.sym + ' <span class="dhf-st dhf-st-' + d.status + '">' + STATUS[d.status] + "</span>" }));
      tr.appendChild(th);
      PERS.forEach(function (p) {
        var kj = kjenner(i, r, p.id), n = ny(i, r, p.id);
        var td = el("td", { class: "dhf-c" + (n ? " ny" : "") + (kj ? "" : " ukj") });
        if (kj) td.appendChild(prove(d.hex, d.fnavn, "s", r === "E" ? "feil" : ""));
        else td.appendChild(ukjent("s"));
        if (n) td.appendChild(el("span", { class: "dhf-ny", text: "ny" }));
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    var w = el("div", { class: "dhf-tabw" });
    w.appendChild(t);
    return w;
  }

  function render(s, ctx) {
    var st = ctx.stage; IN.clear(st);
    var g = el("div", { class: "dhf2" });
    // Stegteksten står i scenen, rett over bildet, så tekst, bilde og tabell sees sammen.
    // (Spillerens egen forklaringsboks er skjult for denne verten i CSS.)
    var v = el("div", { class: "dhf-venstre" });
    var tx = el("div", { class: "dhf-tekst", "aria-live": "polite" });
    tx.appendChild(el("div", { class: "dhf-tag", text: s.tag }));
    tx.appendChild(el("div", { html: IN.level.pick(s.text, ctx.level) || "" }));
    v.appendChild(tx);
    v.appendChild(handling(s));
    g.appendChild(v);
    g.appendChild(tabell(s));
    st.appendChild(g);
  }

  IN.dhFarge = function (host) {
    host = typeof host === "string" ? IN.qs(host) : host; if (!host) return null;
    host.classList.add("dhf-host");
    var valg = [0, 0], api = null;
    var kontroll = el("div", { class: "dhf-valg" });
    function velgRad(navn, liste, i) {
      var r = el("div", { class: "dhf-vr", role: "group", "aria-label": navn + "s hemmelige farge" });
      r.appendChild(el("span", { class: "small", text: navn + "s hemmelige farge:" }));
      liste.forEach(function (f, k) {
        var b = el("button", { class: "dhf-sw", type: "button", title: f.navn, "aria-label": f.navn,
          "aria-pressed": k === 0 ? "true" : "false", style: "background:" + f.hex });
        b.addEventListener("click", function () {
          valg[i] = k;
          IN.qsa(".dhf-sw", r).forEach(function (x, j) { x.setAttribute("aria-pressed", j === k ? "true" : "false"); });
          if (api) { var at = api.index; api.setInput(valg); api.goto(at); }
        });
        r.appendChild(b);
      });
      return r;
    }
    kontroll.appendChild(velgRad("Alice", ALICE, 0));
    kontroll.appendChild(velgRad("Bob", BOB, 1));
    host.appendChild(kontroll);
    var spHost = el("div"); host.appendChild(spHost);
    api = IN.stepPlayer(spHost, { generate: generate, render: render, initial: [0, 0], customInput: false });
    return api;
  };

  // Selvtest: blandingen er uavhengig av rekkefølgen, Eves blanding er ulik, og tabellen er konsistent
  IN.dhFarge.sjekk = function () {
    var ut = [];
    ALICE.forEach(function (a) { BOB.forEach(function (b) {
      ut.push({ navn: a.navn + "/" + b.navn, ok: farge([GUL, b, a]) === farge([GUL, a, b]) && farge([GUL, a, GUL, b]) !== farge([GUL, a, b]) });
    }); });
    var hemmeligOk = KJENNER.every(function (k) { return !/e/.test(k.a || "") && !/e/.test(k.b || "") && !/e/.test(k.K || ""); });
    ut.push({ navn: "Eve kjenner aldri a, b eller K", ok: hemmeligOk });
    ut.push({ navn: "14 steg med tabell for hvert", ok: generate([0, 0]).length === KJENNER.length });
    return ut;
  };
})();
