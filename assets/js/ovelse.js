/* ============================================================
   IN2120 guide · ovelse.js
   Fire felles øvingswidgeter. Klassisk script, lastes etter core.js (stil: ovelse.css).
   All tekst merket «tekst» kan være html-streng eller nivåobjekt {eli5, normal, teknisk}
   (velges med IN.level.pick, og tegnes på nytt når nivået byttes).
   Tilbakemelding går til en synlig aria-live-region. Alt kan brukes med tastatur.

   ---------------------------------------------------------------------------------------
   IN.regnForst(host, o) → handle    «Regn først»-kalkulator
     o = {
       id?,                      fremdrift: IN.progress.solved("regn", id, 1|0, 1)
       sporsmal: tekst | fn(inndata) → tekst,
       fasit: tall | fn(inndata) → tall,
       toleranse?: 0.02          relativ (|svar − fasit| ≤ toleranse·|fasit|)
       toleranseAbs?: tall        absolutt (|svar − fasit| ≤ toleranseAbs). Gitt alene erstatter den den
                                  relative; gitt sammen med toleranse holder det at én av dem stemmer.
                                  Gjelder også vanligeFeil[].verdi.
       enhet?: "passord"          vises bak feltet, og fjernes hvis studenten skriver den
       fasitTekst?: tekst | fn(inndata, fasit)   egen visning av fasiten (standard: formatert tall)
       vanligeFeil?: [{ verdi: tall | fn(inndata), hint: tekst } | { test: fn(svar, inndata) → bool, hint }],
       forklaring?: tekst | fn(inndata) → tekst,
       inndata?: [{ navn, etikett, verdi, min?, max?, steg?, type?: "range"|"number" }]
                                  glider (min og max gitt) eller tallfelt; endring gir ny oppgave.
                                  Glideverdien vises med tusenskille («10 000»); egen visning med format?: fn(v) → tekst
       onInndata?: fn(inndata, navn)   kalles etter hver endring av inndata (glider, felt eller settInndata).
                                  Setter en lytter inndata tilbake i samme widget, kalles ikke lytterne på nytt.
       etter?: fn(node, inndata)  kalles når svaret vises; node er en tom plass under forklaringen
       forsok?: 2                 antall forsøk før fasit vises
       rentTall?: false           true: svaret er et rent tall (ingen ^), og feltet får inputmode="decimal"
                                  (talltastatur på telefon). Ellers vanlig tastatur, så ^, ·10^ og e kan skrives,
                                  og på berøringsskjerm vises hjelpetastene «^» og «·10^» ved feltet.
       skjulInndata?: true | [navn]   tegn ikke inndatagliderne (alle, eller bare de navngitte). For koblede
                                  widgeter (IN.regnForst.koble): gliderne vises én gang, i den andre widgeten.
                                  handle.inndataEl er glidergruppen (eller null), og kan flyttes av kalleren.
       svarform?: "tall" | "orden"
                                  "orden": studenten velger størrelsesorden i en knapperad (44 px) i stedet for
                                  å skrive et tall. Krever trinn:
       trinn?: [{ maks: tall, tekst }, …, { tekst }]   stigende øvre grenser; siste trinn har ingen maks.
                                  Et tall x havner i første trinn med x < maks. Fasiten er trinnet fasit(inndata)
                                  havner i (fasit er fortsatt et tall, f.eks. sekunder). toleranse og enhet brukes ikke.
                                  vanligeFeil virker per trinn: { verdi } slår til når verdien havner i det valgte
                                  trinnet (og det ikke er fasittrinnet); { trinn: i } slår til på trinn i;
                                  { test: fn(trinnIndeks, inndata) } får trinnindeksen som svar.
                                  Standard fasitTekst er trinnets tekst. IN.regnForst.tidstrinn() gir trinnene
                                  sekunder, minutter, timer, dager, år, tusener av år, lenger enn universets alder.
     }
     Godtar «218 340 105 584 896», «2,18·10^14», «2.18e14», «62^8», «2**8», «10¹²», «(26+10)^8».
     Svaret er skjult til studenten har sjekket et tall. «Vis fasit» blir aktiv etter første forsøk.
     Tipslinja («Desimalkomma …») vises bare ved første tall-widget på siden, eller etter et ugyldig svar.
     handle: { el, sjekk(tekst) → {status, verdi}, visSvar(), nullstill(), settInndata(navn, v),
               inndata(), fasit(), tilstand() → {forsok, vist, riktig}, lytt(fn(inndata, navn)),
               inndataEl, velg(i) (orden: marker trinn i), fasitTrinn() → indeks | null (orden) }
       Med svarform "orden" tar sjekk() en trinnindeks eller trinnteksten (uten argument: valgt trinn),
       og verdi i svaret er trinnindeksen.
     IN.regnForst.trinnFor(x, trinn) → indeks     IN.regnForst.tidstrinn() → [{maks, tekst}] (sekunder)
     IN.regnForst.parse(tekst) → tall | NaN     IN.regnForst.format(tall) → html
     IN.regnForst.tall(x, des = 2) → «10 000», «1 234,5», «−3»   (tusenskille som i format: smalt hardt
                                  mellomrom U+202F, som parse godtar; desimalkomma; aldri 10-potens; for etiketter)
     IN.regnForst.koble([handle, …], navn?: [navn])   deler inndata: endring i én settes i de andre
                                  (alle felles navn, eller bare navn). Hver widget må ha inndata med samme navn.

   ---------------------------------------------------------------------------------------
   IN.matrise(host, o) → handle      Sammenligningsmatrise som fylles ut
     o = {
       id?, sporsmal?: tekst,
       rader: [tekst], kolonner: [{ navn: tekst, valg: ["Ja", "Nei", …] }],
       fasit: [[verdi | [godtatte verdier] | null]]   (verdi er en av kolonnens valg; null = telles ikke)
       forklaring?: { "r,k": tekst }   vises i cellen etter «Sjekk svar»
       regel?: { riktig, feil, blankt, min, maks }   eksamensregel per celle (som inspera.js)
       brytere?: [{ navn, endrer: fn(fasit) → fasit, forklaring?: { "r,k": tekst }, pa?: bool }]
                                  varianter; aktive brytere brukes i rekkefølge på en kopi av fasit
     }
     Celle: knappegruppe (radioknapper) når kolonnen har ≤ 3 valg, ellers nedtrekksliste.
     Knapper: «Sjekk svar», «Vis fasit», «↺ Nullstill». Resultatlinje under knappene, regelen i lukket <details>.
     Fremdrift: solved("matrise", id, poeng|riktige, maks|totalt).
     handle: { el, sett(r, k, verdi), hent(r, k), sjekk() → {right, wrong, blank, total, poeng},
               visFasit(), nullstill(), bryter(i, på), fasit() → aktiv fasit }

     Modus «ett valg per rad» (KIT-matrisen fra eksamen): gi radvalg i stedet for kolonner.
       radvalg: { valg: ["K", "I", "T", "Ingen"], multi?: false, navn?: "Svar" (kolonneoverskrift) }
       fasit: [valgindeks | [godtatte indekser] | null]   per rad (multi: [indekser] = nøyaktig det settet)
              (en valgtekst i stedet for indeks godtas også)
       forklaring?: { "r": tekst }  ("r,0" går også)    regel teller per rad, f.eks.
              { riktig: 0.5, feil: -0.5, blankt: 0, min: 0 }
     Hver rad får en knapperad (aria-pressed). Uten multi: ett trykk velger, nytt trykk på samme fjerner.
     Med multi: rada er riktig bare når nøyaktig fasitsettet er valgt; tom rad er ubesvart.
     handle som over, men sett(r, v) og hent(r) → indeks | [indekser] | null, celle(r).
     brytere[].endrer får og gir fasitlista per rad.

   ---------------------------------------------------------------------------------------
   IN.scenario(host, o) → handle     Forgrenet scenariotrener
     o = {
       id?,                       lagring in2120:scen:<id>, fremdrift solved("scen", id, poeng, beste)
       tittel?: tekst, start: nodeId,
       kitStart?: { K: "ok", I: "ok", T: "ok" },
       kit?: false | ["T", …]    false skjuler KIT-panelet; en liste viser bare de målene (standard alle tre).
                                  handle.kit() gir fortsatt alle tre.
       noder: { id: { tekst, valg?: [{ tekst, til: nodeId, konsekvens?: tekst,
                                        kit?: { K|I|T: "ok"|"truet"|"brutt"|annen tekst }, poeng?: tall }],
                      slutt?: true, oppsummering?: tekst } },
       avslutt?: { fritekst?: { sporsmal: tekst, sjekkliste: [tekst] } }
     }
     Viser sti, konsekvensen av siste valg og et KIT-panel. «← Ett steg tilbake» og «↺ Start på nytt».
     På sluttnoden: oppsummering av valgene, poeng mot beste mulige sti, og ev. fritekst med
     sjekkliste studenten krysser av selv.
     handle: { el, velg(i), tilbake(), omstart(), node() → id, sti() → [valgindeks], kit(), poeng(),
               beste() → høyeste mulige poeng }

   ---------------------------------------------------------------------------------------
   IN.finnFeilen(host, o) → handle   «Finn feilen» i en konfigurasjon
     o = {
       id?, sporsmal?: tekst, tittel?: "sudoers"   (filnavn over kodeblokka)
       linjer: [html],            linjene i konfigurasjonen (vises monospace, nummerert)
       feil: [indeks …],          linjene som er feil (0-basert)
       grunner: [tekst],          mulige begrunnelser
       riktigGrunn: indeks | { linjeindeks: grunnindeks },
       grunnPerLinje?: bool       én grunnvelger per valgt linje. Standard: på når riktigGrunn er et
                                  objekt med ulike grunner for feillinjene, ellers av (én felles velger).
       forklaring?: tekst,
       linjeForklaring?: { indeks: tekst }   vises ved linjene når svaret er vist
       forsok?: 2
     }
     Studenten trykker linja (eller linjene) som er feil og velger hvorfor. ↑/↓ flytter mellom linjer.
     Knapper: «Sjekk svar», «Vis fasit», «↺ Nullstill». Riktig linje og riktig grunn gir 2 poeng; én av dem gir 1. Fremdrift: solved("feil", id, p, 2).
     Per linje: grunnpoenget krever riktig grunn på hver feillinje (og at alle feillinjene er valgt).
     handle: { el, velgLinje(i), velgGrunn(i, linje?), sjekk() → {linje, grunn, poeng, grunner?},
               visSvar(), nullstill(), perLinje() → bool, grunnFor(linje) → indeks | null }
       velgGrunn(i, linje) setter grunnen for den linja (per linje; uten linje: sist valgte linje).
       sjekk().grunner = { linjeindeks: true|false } for feillinjene i per-linje-modus.
   ---------------------------------------------------------------------------------------
   Lagring: scenario (in2120:scen:<id>), regnForst (in2120:regn:<side>:<id>), matrise (in2120:matrise:<side>:<id>)
   og finnFeilen (in2120:feil:<side>:<id>). Uten o.id brukes host-id eller widgetens nummer i host-id-en; uten
   noen id lagres ingenting. Posten har et fingeravtrykk av oppgaven og forkastes når oppgaven endres.
   Ingen fetch, ingen moduler.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, uidN = 0;

  /* ---------------- Felles hjelpere ---------------- */
  function pick(v) {
    if (v == null) return "";
    if (typeof v === "object" && !v.nodeType) return IN.level.pick(v);
    return v;
  }
  function put(node, v) {                     // sett tekst/nivåobjekt/node inn i node
    while (node.firstChild) node.removeChild(node.firstChild);
    v = pick(v);
    if (v && v.nodeType) node.appendChild(v);
    else node.innerHTML = v == null ? "" : String(v);
    if (IN.symbolTips) { try { IN.symbolTips(node); } catch (e) {} }
    return node;
  }
  function plain(h) { return String(h == null ? "" : h).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim(); }
  function num(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
  function sgn(x) { return (x > 0 ? "+" : x < 0 ? "−" : "±") + num(Math.abs(x)); }
  function hash(s) { var h = 5381; s = String(s); for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function arr(v) { return v == null ? [] : [].concat(v); }
  function resolve(host) { return typeof host === "string" ? IN.qs(host) : host; }
  /* Live-region som også er synlig: tømmes og fylles, så skjermlesere leser endringen. */
  function feedback(cls) { var n = el("div", { class: "ov-fb" + (cls ? " " + cls : ""), role: "status", "aria-live": "polite" }); n._base = n.className; return n; }
  function setFb(node, tone, v) {
    node.className = (node._base || "ov-fb") + (tone ? " is-" + tone : "");
    node._tone = tone || "";
    put(node, v);
  }
  function fbRec(node) { return { t: node._tone || "", h: node.innerHTML }; }
  /* B5: lagring av svar. Nøkkel in2120:<type>:<side>:<id>, der id er o.id, ellers host-id, ellers nærmeste
     forelder med id + «~» + løpenummer blant øvingene av samme type der. Posten har fingeravtrykket h. */
  function autoId(host, node, sel) {
    if (host.id) { var j = Array.prototype.indexOf.call(host.querySelectorAll(sel), node); return j > 0 ? host.id + "~" + j : host.id; }
    for (var a = host.parentNode; a && a.nodeType === 1; a = a.parentNode) {
      if (a.id) { var i = Array.prototype.indexOf.call(a.querySelectorAll(sel), node); return i >= 0 ? a.id + "~" + i : null; }
    }
    return null;
  }
  function lager(type, o, host, wrap, sel, fp) {
    var id = o.id ? String(o.id) : autoId(host, wrap, sel);
    if (!id || !IN.store) return null;
    var key = "in2120:" + type + ":" + (IN.pageId ? IN.pageId() : "index") + ":" + id;
    return {
      key: key,
      hent: function () { try { var s = JSON.parse(IN.store.get(key, "null")); return s && s.h === fp ? s : null; } catch (e) { return null; } },
      sett: function (rec) { rec.h = fp; try { IN.store.set(key, JSON.stringify(rec)); } catch (e) {} },
      fjern: function () { try { localStorage.removeItem(key); } catch (e) {} }
    };
  }
  function fpAv(x) { return hash(JSON.stringify(x, function (k, v) { return typeof v === "function" ? String(v) : v; })); }
  /* Opphavslinje (o.opphav, se IN.opphavTekst i core.js) */
  function opEl(o) { return o && o.opphav && IN.opphavEl ? IN.opphavEl(o.opphav) : null; }
  /* B1: regelen i en lukket <details> under resultatlinja */
  function regelDetails(regel, enhet) {
    var t = regelTekst(regel, enhet).replace(/^Slik retter øvingen:\s*/, "");
    return el("details", { class: "ov-regel-d" }, [el("summary", { text: "Slik retter øvingen" }),
      el("p", { class: "ov-regel", text: t.charAt(0).toUpperCase() + t.slice(1) })]);
  }
  /* Kjør fn når nivået byttes, så lenge el er i dokumentet. */
  function onLevel(root, fn) {
    var h = function () {
      if (root.isConnected === false && root._ovSeen) { window.removeEventListener("in:level", h); return; }
      fn();
    };
    window.addEventListener("in:level", h);
    return h;
  }
  /* Eksamensregel per enhet, samme semantikk som inspera.js og dra.js */
  function skaar(c, regel) {
    if (!regel) return null;
    var rr = regel.riktig != null ? +regel.riktig : 1, rf = +regel.feil || 0, rb = +regel.blankt || 0;
    var maks = regel.maks != null ? +regel.maks : c.total * rr, min = regel.min != null ? +regel.min : 0;
    var p = c.right * rr + c.wrong * rf + c.blank * rb;
    if (c.total && c.right === c.total) p = Math.max(p, maks);
    var raa = p;
    p = Math.min(maks, Math.max(min, p));
    return { poeng: Math.round(p * 100) / 100, raa: Math.round(raa * 100) / 100, maks: maks, min: min, rr: rr, rf: rf, rb: rb };
  }
  function regelTekst(regel, enhet) {
    var s = skaar({ right: 0, wrong: 0, blank: 0, total: 0 }, regel);
    return "Slik retter øvingen: riktig " + sgn(s.rr) + ", galt " + (s.rf ? sgn(s.rf) : "0") + ", ubesvart " +
      (s.rb ? sgn(s.rb) : "0") + " per " + enhet + ". Aldri under " + num(s.min) + (regel.maks != null ? ", høyst " + num(s.maks) : "") + " poeng.";
  }
  function solved(kind, id, s, m) { if (id && IN.progress && m) { try { IN.progress.solved(kind, id, s, m); } catch (e) {} } }

  /* ---------------- Tall: tolking og visning ---------------- */
  var SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };
  var SUPR = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
  /* Tolk et tall slik studenter skriver det. Gir NaN hvis teksten ikke er et regnestykke. */
  function parseTall(s, enhet) {
    if (s == null) return NaN;
    s = String(s).trim();
    if (enhet) { var en = String(enhet).toLowerCase(); if (s.toLowerCase().slice(-en.length) === en) s = s.slice(0, -en.length).trim(); }
    s = s.replace(/^[≈~=]+/, "").trim();
    // hevet skrift: 10¹² → 10^12
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, function (m) { return "^" + m.split("").map(function (c) { return SUP[c]; }).join(""); });
    s = s.replace(/[   \s]+/g, function (m, i, all) {
      // mellomrom mellom sifre er tusenskille; ellers bare luft
      return /\d/.test(all.charAt(i - 1)) && /\d/.test(all.charAt(i + m.length)) ? "" : " ";
    });
    s = s.replace(/\s+/g, "");
    s = s.replace(/\*\*/g, "^").replace(/[·×⋅x]/g, "*").replace(/−/g, "-").replace(/÷/g, "/");
    // desimalkomma: «1.234,5» → 1234.5, «2,18» → 2.18
    if (s.indexOf(",") >= 0 && s.indexOf(".") >= 0) s = s.replace(/\./g, "").replace(/,/g, ".");
    else s = s.replace(/,/g, ".");
    if (!s || !/^[0-9.eE+\-*/^()]+$/.test(s)) return NaN;
    var i = 0;
    function peek() { return s.charAt(i); }
    function number() {
      var m = /^(\d+\.?\d*|\.\d+)(e[+\-]?\d+)?/i.exec(s.slice(i));
      if (!m) throw 0;
      i += m[0].length;
      return parseFloat(m[0]);
    }
    function factor() {
      var c = peek();
      if (c === "-") { i++; return -factor(); }
      if (c === "+") { i++; return factor(); }
      if (c === "(") { i++; var v = expr(); if (peek() !== ")") throw 0; i++; return v; }
      return number();
    }
    function power() {
      var b = factor();
      if (peek() === "^") { i++; return Math.pow(b, power()); }   // høyreassosiativ
      return b;
    }
    function term() {
      var v = power();
      while (peek() === "*" || peek() === "/") { var op = s.charAt(i++), r = power(); v = op === "*" ? v * r : v / r; }
      return v;
    }
    function expr() {
      var v = term();
      while (peek() === "+" || peek() === "-") { var op = s.charAt(i++), r = term(); v = op === "+" ? v + r : v - r; }
      return v;
    }
    try { var v = expr(); if (i !== s.length) return NaN; return isFinite(v) ? v : NaN; } catch (e) { return NaN; }
  }
  function tusen(intStr) { return intStr.replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function sup(n) { return String(n).split("").map(function (c) { return SUPR[c] || c; }).join(""); }
  /* Norsk visning: «218 340 105 584 896 ≈ 2,18 · 10¹⁴», «0,25», «4,4 · 10³¹» */
  function formatTall(x) {
    if (!isFinite(x)) return String(x);
    var a = Math.abs(x);
    if (a !== 0 && (a >= 1e6 || a < 1e-3)) {
      var e = Math.floor(Math.log10(a)), m = x / Math.pow(10, e);
      if (Math.abs(m) >= 9.995) { m /= 10; e++; }
      var sci = String(Math.round(m * 100) / 100).replace(".", ",") + " · 10" + sup(e);
      if (Number.isInteger(x) && a < 1e21) return tusen(String(x)) + " ≈ " + sci;
      return sci;
    }
    var r = Math.round(x * 1e4) / 1e4, p = String(r).split(".");
    return (p[0].charAt(0) === "-" ? "−" + tusen(p[0].slice(1)) : tusen(p[0])) + (p[1] ? "," + p[1] : "");
  }
  /* Enkel visning for etiketter: tusenskille og desimalkomma, aldri 10-potens. */
  function tallTekst(x, des) {
    x = +x;
    if (!isFinite(x)) return String(x);
    var f = Math.pow(10, des == null ? 2 : des), r = Math.round(Math.abs(x) * f) / f, p = String(r).split(".");
    if (/e/.test(p[0])) return (x < 0 ? "−" : "") + String(r);
    return (x < 0 && r !== 0 ? "−" : "") + tusen(p[0]) + (p[1] ? "," + p[1] : "");
  }
  /* Størrelsesorden: første trinn med x < maks (siste trinn har ingen maks). */
  function trinnFor(x, trinn) {
    trinn = arr(trinn);
    if (!isFinite(x)) return x > 0 ? trinn.length - 1 : 0;
    for (var i = 0; i < trinn.length - 1; i++) if (trinn[i].maks == null || x < +trinn[i].maks) return i;
    return trinn.length - 1;
  }
  var tipsVist = false;   // tipslinja vises bare ved første tall-widget på siden
  function naer(a, b, tol) {
    if (!isFinite(a) || !isFinite(b)) return false;
    if (b === 0) return Math.abs(a) <= tol;
    return Math.abs(a - b) <= tol * Math.abs(b);
  }

  /* ====================================================================
     IN.regnForst
     ==================================================================== */
  IN.regnForst = function (host, o) {
    host = resolve(host);
    if (!host || !o) return null;
    o = o || {};
    var uid = "ovr" + (++uidN), tol = o.toleranse != null ? +o.toleranse : 0.02, maxTry = o.forsok || 2;
    var tolAbs = o.toleranseAbs != null && isFinite(+o.toleranseAbs) ? Math.abs(+o.toleranseAbs) : null;
    var brukRel = o.toleranse != null || tolAbs == null;
    function godt(a, b) {
      if (!isFinite(a) || !isFinite(b)) return false;
      return (tolAbs != null && Math.abs(a - b) <= tolAbs + 1e-12 * Math.max(1, Math.abs(b))) || (brukRel && naer(a, b, tol));
    }
    var lyttere = typeof o.onInndata === "function" ? [o.onInndata] : [], iLytter = false;   // vakt mot sløyfer
    var visV = {};
    var inn = {};
    arr(o.inndata).forEach(function (d) { inn[d.navn] = +d.verdi; });
    var st = { forsok: 0, vist: false, riktig: false };

    var wrap = el("div", { class: "ov ov-regn" });
    var q = el("div", { class: "ov-q", id: uid + "-q" });
    var ctl = null, ctlInputs = {};
    var skjul = o.skjulInndata === true ? null : arr(o.skjulInndata).map(String);
    var synlig = o.skjulInndata === true ? [] : arr(o.inndata).filter(function (d) { return skjul.indexOf(String(d.navn)) < 0; });
    var orden = o.svarform === "orden" && arr(o.trinn).length > 1;
    if (synlig.length) {
      ctl = el("div", { class: "ov-inn", role: "group", "aria-label": "Endre oppgaven" });
      synlig.forEach(function (d) {
        var id = uid + "-i-" + d.navn, range = d.type ? d.type === "range" : (d.min != null && d.max != null);
        var inp = el("input", { id: id, type: range ? "range" : "number", min: d.min, max: d.max, step: d.steg || 1, value: String(d.verdi) });
        visV[d.navn] = function (v) { return d.format ? String(d.format(v)) : tallTekst(v); };
        var out = range ? el("output", { class: "ov-inn-v", for: id, text: visV[d.navn](+d.verdi) }) : null;
        inp.addEventListener(range ? "input" : "change", function () {
          var v = parseFloat(inp.value);
          if (!isFinite(v)) return;
          settInndata(d.navn, v, true);
        });
        ctlInputs[d.navn] = { inp: inp, out: out };
        ctl.appendChild(el("div", { class: "ov-inn-f" }, [el("label", { for: id, html: pick(d.etikett) || d.navn }), inp, out].filter(Boolean)));
      });
    }
    var fid = uid + "-svar";
    // A2: «Sjekk svar» · «Vis fasit» · «↺ Nullstill»
    var bSjekk = el("button", { class: "btn primary", type: "button", text: "Sjekk svar", onclick: function () { sjekk(); } });
    var bVis = el("button", { class: "btn", type: "button", text: "Vis fasit", disabled: true, onclick: function () { visSvar(); } });
    var bReset = el("button", { class: "btn", type: "button", text: "↺ Nullstill", onclick: function () { nullstill(false, true); } });
    var input = null, row, tips = null, keys = null, trinnB = [], valgt = null, laster = true, lag = null;
    if (orden) {
      var trinnRad = el("div", { class: "ov-orden", role: "group", "aria-labelledby": uid + "-q" });
      o.trinn.forEach(function (t, i) {
        var b = el("button", { class: "ov-orden-b", type: "button", "aria-pressed": "false", onclick: function () { velg(valgt === i ? null : i); persist(); } });
        put(b, t.tekst);
        trinnB.push(b); trinnRad.appendChild(b);
      });
      row = el("div", { class: "ov-svarrad ov-svarrad-orden" }, [
        el("span", { class: "ov-svar-l", text: "Ditt svar" }), trinnRad, el("div", { class: "ov-orden-k" }, [bSjekk, bVis, bReset])]);
    } else {
      var ren = !!o.rentTall;
      var ia = { id: fid, type: "text", class: "ov-num", autocomplete: "off", spellcheck: "false", autocapitalize: "off",
        "aria-describedby": uid + "-q " + uid + "-tips", placeholder: ren ? "f.eks. 0,25" : "f.eks. 2,18·10^14" };
      if (ren) ia.inputmode = "decimal";
      input = el("input", ia);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); sjekk(); } });
      input.addEventListener("input", function () { persist(); });
      if (!ren) {
        keys = el("span", { class: "ov-taster", role: "group", "aria-label": "Hjelpetaster" });
        ["^", "·10^"].forEach(function (k) {
          var b = el("button", { class: "ov-tast", type: "button", text: k, "aria-label": k === "^" ? "Skriv opphøyd i (^)" : "Skriv ganger ti opphøyd i (·10^)" });
          b.addEventListener("pointerdown", function (e) { e.preventDefault(); });   // behold fokus og tastaturet
          b.addEventListener("click", function () { settInn(k); });
          keys.appendChild(b);
        });
      }
      row = el("div", { class: "ov-svarrad" }, [
        el("label", { for: fid, class: "ov-svar-l", text: "Ditt svar" }), input, keys,
        o.enhet ? el("span", { class: "ov-enhet", html: pick(o.enhet) }) : null, el("span", { class: "ov-knapper" }, [bSjekk, bVis, bReset])].filter(Boolean));
      tips = el("p", { class: "ov-tips", id: uid + "-tips", text: ren ? "Desimalkomma går fint, for eksempel 0,25." : "Desimalkomma, mellomrom som tusenskille, 10^12, 62^8 og 1e12 går fint." });
      if (tipsVist) tips.hidden = true; else tipsVist = true;
    }
    function settInn(k) {
      var a = input.selectionStart != null ? input.selectionStart : input.value.length, b = input.selectionEnd != null ? input.selectionEnd : a;
      input.value = input.value.slice(0, a) + k + input.value.slice(b);
      try { input.focus(); input.setSelectionRange(a + k.length, a + k.length); } catch (e) {}
    }
    function velg(i) {
      if (st.vist) return;
      valgt = i == null || !(i >= 0 && i < trinnB.length) ? null : i;
      trinnB.forEach(function (b, j) { b.setAttribute("aria-pressed", String(j === valgt)); });
    }
    function fasitTrinn() { return orden ? trinnFor(fasit(), o.trinn) : null; }
    var fb = feedback();
    var losn = el("div", { class: "ov-losn", hidden: true });
    var losnFasit = el("p", { class: "ov-fasit" });
    var losnFork = el("div", { class: "ov-fork" });
    var etterHost = el("div", { class: "ov-etter" });
    losn.appendChild(losnFasit); losn.appendChild(losnFork); losn.appendChild(etterHost);
    [opEl(o), q, ctl, row, tips, fb, losn].forEach(function (x) { if (x) wrap.appendChild(x); });
    host.appendChild(wrap); wrap._ovSeen = true;

    function fasit() { return typeof o.fasit === "function" ? +o.fasit(inn) : +o.fasit; }
    function paintQ() { put(q, typeof o.sporsmal === "function" ? o.sporsmal(inn) : o.sporsmal); }
    function paintLosn() {
      var f = fasit();
      var ft = o.fasitTekst ? (typeof o.fasitTekst === "function" ? o.fasitTekst(inn, f) : o.fasitTekst) : null;
      losnFasit.innerHTML = "<b>Fasit:</b> ";
      var span = el("span"); put(span, ft || (orden ? pick(o.trinn[fasitTrinn()].tekst) : formatTall(f) + (o.enhet ? " " + pick(o.enhet) : "")));
      losnFasit.appendChild(span);
      put(losnFork, typeof o.forklaring === "function" ? o.forklaring(inn) : o.forklaring);
    }
    function matchFeil(v) {
      var fe = arr(o.vanligeFeil);
      for (var i = 0; i < fe.length; i++) {
        var f = fe[i];
        if (f.test) { try { if (f.test(v, inn)) return f; } catch (e) {} continue; }
        if (orden) {
          var ft = fasitTrinn();
          if (v === ft) continue;
          if (f.trinn != null && +f.trinn === v) return f;
          if (f.verdi != null && trinnFor(typeof f.verdi === "function" ? +f.verdi(inn) : +f.verdi, o.trinn) === v) return f;
          continue;
        }
        if (f.verdi != null) {
          var fv = typeof f.verdi === "function" ? +f.verdi(inn) : +f.verdi;
          if (godt(v, fv)) return f;
        }
      }
      return null;
    }
    function reveal(riktig) {
      st.vist = true;
      paintLosn();
      losn.hidden = false;
      bVis.disabled = true;
      wrap.classList.toggle("is-right", !!riktig);
      wrap.classList.toggle("is-wrong", !riktig);
      while (etterHost.firstChild) etterHost.removeChild(etterHost.firstChild);
      if (o.etter) { try { o.etter(etterHost, inn); } catch (e) { if (window.console) console.error("[regnForst] etter", e); } }
    }
    function sjekkOrden(arg) {
      if (arg != null) {
        var ix = typeof arg === "number" ? arg : -1;
        if (typeof arg === "string") o.trinn.forEach(function (t, j) { if (ix < 0 && (plain(pick(t.tekst)) === arg.trim() || String(j) === arg.trim())) ix = j; });
        if (!st.vist) velg(ix);
      }
      if (st.vist && st.riktig) return { status: "ferdig", verdi: valgt };
      if (valgt == null) {
        setFb(fb, "warn", "Velg en størrelsesorden først, og trykk «Sjekk svar».");
        return { status: "ugyldig", verdi: null };
      }
      var v = valgt, ft = fasitTrinn();
      st.forsok++;
      bVis.disabled = st.vist;
      if (v === ft) {
        st.riktig = true;
        setFb(fb, "right", "<b>Riktig.</b> Svaret er «" + plain(pick(o.trinn[v].tekst)) + "»" + (st.forsok > 1 ? " (forsøk " + st.forsok + ")" : ""));
        if (!st.vist) solved("regn", o.id, st.forsok === 1 ? 1 : 0.5, 1);
        reveal(true);
        markerTrinn();
        return { status: "riktig", verdi: v };
      }
      var f = matchFeil(v);
      var msg = "<b>Ikke riktig.</b> " + (f ? pick(f.hint) : (v < ft ? "Fasiten er en høyere størrelsesorden." : "Fasiten er en lavere størrelsesorden.") + " Regn ut tallet og sammenlign.");
      if (st.forsok >= maxTry && !st.vist) {
        setFb(fb, "wrong", msg + " Her er fasiten.");
        solved("regn", o.id, 0, 1);
        reveal(false);
        markerTrinn();
      } else setFb(fb, "wrong", msg + (st.vist ? "" : " Du har " + (maxTry - st.forsok) + " forsøk igjen."));
      return { status: f ? "vanlig-feil" : "feil", verdi: v, hint: f ? pick(f.hint) : null };
    }
    function markerTrinn() {
      var ft = fasitTrinn();
      trinnB.forEach(function (b, j) {
        b.classList.toggle("is-right", j === ft);
        b.classList.toggle("is-wrong", j === valgt && j !== ft);
        b.setAttribute("aria-disabled", "true");
      });
    }
    function sjekk(tekst) {
      var r = orden ? sjekkOrden(tekst) : sjekkTall(tekst);
      persist();
      return r;
    }
    function sjekkTall(tekst) {
      if (tekst != null) input.value = String(tekst);
      if (st.vist && st.riktig) return { status: "ferdig", verdi: parseTall(input.value, plain(pick(o.enhet))) };
      var v = parseTall(input.value, plain(pick(o.enhet)));
      if (!isFinite(v)) {
        setFb(fb, "warn", "Skriv et tall eller et regnestykke, for eksempel <b>62^8</b> eller <b>2,18·10^14</b>.");
        input.setAttribute("aria-invalid", "true");
        if (tips) tips.hidden = false;
        return { status: "ugyldig", verdi: NaN };
      }
      input.removeAttribute("aria-invalid");
      st.forsok++;
      bVis.disabled = st.vist;
      if (godt(v, fasit())) {
        st.riktig = true;
        setFb(fb, "right", "<b>Riktig.</b> " + formatTall(v) + (st.forsok > 1 ? " (forsøk " + st.forsok + ")" : ""));
        if (!st.vist) solved("regn", o.id, st.forsok === 1 ? 1 : 0.5, 1);
        reveal(true);
        return { status: "riktig", verdi: v };
      }
      var f = matchFeil(v);
      var msg = (f ? "<b>Ikke riktig.</b> " + pick(f.hint) : "<b>Ikke riktig.</b> Se på regnestykket en gang til.");
      if (st.forsok >= maxTry && !st.vist) {
        setFb(fb, "wrong", msg + " Her er fasiten.");
        solved("regn", o.id, 0, 1);
        reveal(false);
      } else setFb(fb, "wrong", msg + (st.vist ? "" : " Du har " + (maxTry - st.forsok) + " forsøk igjen."));
      return { status: f ? "vanlig-feil" : "feil", verdi: v, hint: f ? pick(f.hint) : null };
    }
    function visSvar() {
      if (st.vist) return;
      if (!st.forsok) { setFb(fb, "warn", "Prøv å regne selv først, og trykk «Sjekk svar»."); return; }
      setFb(fb, "", "Fasiten vises under.");
      solved("regn", o.id, 0, 1);
      reveal(false);
      if (orden) markerTrinn();
      persist();
    }
    /* B5: svar, forsøk, inndata og tilbakemelding lagres (in2120:regn:<side>:<id>). Fremdrift som før (bare med o.id). */
    function persist() {
      if (laster || !lag) return;
      lag.sett({ inn: kopiInn(), svar: orden ? valgt : (input ? input.value : ""), st: { forsok: st.forsok, vist: st.vist, riktig: st.riktig }, fb: fbRec(fb) });
    }
    function restore() {
      var rec = lag && lag.hent();
      if (!rec) return;
      if (rec.inn) Object.keys(rec.inn).forEach(function (n) {
        if (!Object.prototype.hasOwnProperty.call(inn, n) || !isFinite(+rec.inn[n])) return;
        inn[n] = +rec.inn[n];
        var c = ctlInputs[n];
        if (c) { c.inp.value = String(inn[n]); if (c.out) c.out.textContent = visV[n] ? visV[n](inn[n]) : tallTekst(inn[n]); }
      });
      paintQ();
      if (orden) { if (typeof rec.svar === "number") velg(rec.svar); }
      else if (input && typeof rec.svar === "string") input.value = rec.svar;
      if (rec.st) {
        st = { forsok: +rec.st.forsok || 0, vist: !!rec.st.vist, riktig: !!rec.st.riktig };
        bVis.disabled = st.vist || !st.forsok;
        if (st.vist) { reveal(st.riktig); if (orden) markerTrinn(); }
      }
      if (rec.fb && rec.fb.h) setFb(fb, rec.fb.t, rec.fb.h);
    }
    function nullstill(stille, bruker) {
      st = { forsok: 0, vist: false, riktig: false };
      if (input) { input.value = ""; input.removeAttribute("aria-invalid"); }
      valgt = null;
      trinnB.forEach(function (b) { b.setAttribute("aria-pressed", "false"); b.removeAttribute("aria-disabled"); b.classList.remove("is-right", "is-wrong"); });
      losn.hidden = true; bVis.disabled = true;
      wrap.classList.remove("is-right", "is-wrong");
      while (etterHost.firstChild) etterHost.removeChild(etterHost.firstChild);
      setFb(fb, "", stille ? "" : bruker ? "Nullstilt." : "Ny oppgave.");
      persist();
    }
    function settInndata(navn, v, fraUi) {
      inn[navn] = +v;
      var c = ctlInputs[navn];
      if (c) { if (!fraUi) c.inp.value = String(v); if (c.out) c.out.textContent = visV[navn] ? visV[navn](+v) : tallTekst(v); }
      paintQ();
      nullstill();
      if (lyttere.length && !iLytter) {
        iLytter = true;
        try {
          lyttere.forEach(function (f) { try { f(kopiInn(), navn); } catch (e) { if (window.console) console.error("[regnForst] onInndata", e); } });
        } finally { iLytter = false; }
      }
    }
    function kopiInn() { var c = {}; Object.keys(inn).forEach(function (k) { c[k] = inn[k]; }); return c; }
    paintQ();
    lag = lager("regn", o, host, wrap, ".ov-regn", fpAv({ q: o.sporsmal, f: o.fasit, t: o.trinn, s: o.svarform, i: arr(o.inndata).map(function (d) { return d.navn; }) }));
    restore();
    laster = false;
    onLevel(wrap, function () { paintQ(); if (st.vist) paintLosn(); });
    return {
      el: wrap, sjekk: sjekk, visSvar: visSvar, nullstill: function () { nullstill(false, true); }, settInndata: function (n, v) { settInndata(n, v, false); },
      inndata: kopiInn,
      fasit: fasit, tilstand: function () { return { forsok: st.forsok, vist: st.vist, riktig: st.riktig }; },
      feedback: function () { return fb.textContent; },
      lytt: function (f) { if (typeof f === "function") lyttere.push(f); },
      inndataEl: ctl, velg: function (i) { if (orden) velg(i); }, fasitTrinn: fasitTrinn
    };
  };
  IN.regnForst.koble = function (handles, navn) {
    handles = arr(handles).filter(function (h) { return h && h.lytt && h.settInndata; });
    var bare = navn ? arr(navn).map(String) : null;
    handles.forEach(function (h) {
      h.lytt(function (inn, n) {
        if (bare && bare.indexOf(n) < 0) return;
        handles.forEach(function (o2) {
          if (o2 === h) return;
          var c = o2.inndata();
          if (Object.prototype.hasOwnProperty.call(c, n) && c[n] !== inn[n]) o2.settInndata(n, inn[n]);
        });
      });
    });
    return handles;
  };
  IN.regnForst.trinnFor = trinnFor;
  IN.regnForst.tidstrinn = function () {
    var M = 60, T = 3600, D = 86400, AAR = 31557600;
    return [
      { maks: M, tekst: "sekunder" }, { maks: T, tekst: "minutter" }, { maks: D, tekst: "timer" },
      { maks: AAR, tekst: "dager" }, { maks: 1000 * AAR, tekst: "år" }, { maks: 13.8e9 * AAR, tekst: "tusener av år" },
      { tekst: "lenger enn universets alder" }
    ];
  };
  IN.regnForst.tall = tallTekst;
  IN.regnForst.parse = parseTall;
  IN.regnForst.format = formatTall;
  IN.regnForst.naer = naer;

  /* ====================================================================
     IN.matrise
     ==================================================================== */
  IN.matrise = function (host, o) {
    host = resolve(host);
    if (!host || !o || !o.rader || !(o.kolonner || (o.radvalg && o.radvalg.valg))) return null;
    var rv = o.radvalg && arr(o.radvalg.valg).length ? o.radvalg : null, multi = !!(rv && rv.multi);
    var kolonner = rv ? [{ navn: rv.navn || "Svar", valg: arr(rv.valg) }] : o.kolonner;
    var uid = "ovm" + (++uidN), R = o.rader.length, K = kolonner.length;
    function rvIdx(v) {                   // valgindeks fra indeks eller valgtekst; -1 hvis ukjent
      if (typeof v === "number") return v >= 0 && v < kolonner[0].valg.length ? v : -1;
      for (var i = 0; i < kolonner[0].valg.length; i++) if (String(kolonner[0].valg[i]) === String(v) || plain(pick(kolonner[0].valg[i])) === String(v)) return i;
      return isFinite(+v) && String(v).trim() !== "" ? rvIdx(+v) : -1;
    }
    function rvNorm(v) {                  // fasit for en rad → indeks | [indekser] | null
      if (v == null) return null;
      if (Array.isArray(v)) return v.map(rvIdx).filter(function (i) { return i >= 0; });
      var i = rvIdx(v); return i < 0 ? null : i;
    }
    function nsort(a, b) { return a - b; }
    var brytere = arr(o.brytere).map(function (b) { return { b: b, pa: !!b.pa }; });
    var checked = false, revealed = false;
    var wrap = el("div", { class: "ov ov-mat" + (rv ? " ov-mat-rv" : "") });
    var q = o.sporsmal ? el("div", { class: "ov-q" }) : null;
    var regelEl = o.regel ? regelDetails(o.regel, rv ? "rad" : "celle") : null;
    var brWrap = null, laster = true, lag = null;
    if (brytere.length) {
      brWrap = el("div", { class: "ov-brytere", role: "group", "aria-label": "Varianter" });
      brytere.forEach(function (x, i) {
        var btn = el("button", { class: "qz-switch ov-bryter", type: "button", role: "switch", "aria-checked": x.pa ? "true" : "false",
          onclick: function () { bryter(i, !x.pa); } }, [
          el("span", { class: "qz-track", "aria-hidden": "true" }, el("span", { class: "qz-thumb" })),
          el("span", { class: "ov-bryter-l" })]);
        x.btn = btn;
        brWrap.appendChild(btn);
      });
    }
    var tw = el("div", { class: "ov-mat-wrap" });
    var tab = el("table", { class: "ov-mat-t" });
    var hr = el("tr", {}, [el("td", { class: "ov-mat-c0" })]);
    var colHead = kolonner.map(function (k) { var th = el("th", { scope: "col" }); hr.appendChild(th); return th; });
    tab.appendChild(el("thead", {}, [hr]));
    var tb = el("tbody"), rowHead = [], cells = [];
    o.rader.forEach(function (rn, r) {
      var tr = el("tr");
      var th = el("th", { scope: "row", class: "ov-mat-c0" }); rowHead.push(th); tr.appendChild(th);
      cells.push([]);
      kolonner.forEach(function (k, c) {
        var td = el("td", { class: "ov-cell" });
        var lab = el("span", { class: "ov-cell-k", "aria-hidden": "true" });   // kolonnenavn på smal skjerm
        var ctlEl, get, set, inputs = [], btns = null;
        var aria = function () { return plain(pick(rn)) + ", " + plain(pick(k.navn)); };
        if (rv) {
          ctlEl = el("div", { class: "ov-rv", role: "group" });
          var valgt = [];
          var vis = function () {
            btns.forEach(function (b, i) { var on = valgt.indexOf(i) >= 0; b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("on", on); });
          };
          btns = k.valg.map(function (v, i) {
            var b = el("button", { type: "button", class: "ov-rv-b", "aria-pressed": "false", "data-v": String(i) });
            b.addEventListener("click", function () {
              var j = valgt.indexOf(i);
              if (multi) { if (j >= 0) valgt.splice(j, 1); else valgt.push(i); }
              else valgt = j >= 0 ? [] : [i];
              vis(); onEdit(r, c);
            });
            ctlEl.appendChild(b);
            return b;
          });
          inputs = btns;
          get = function () { return !valgt.length ? null : multi ? valgt.slice().sort(nsort) : valgt[0]; };
          set = function (v) {
            valgt = v == null ? [] : arr(v).map(rvIdx).filter(function (i, j, a) { return i >= 0 && a.indexOf(i) === j; });
            if (!multi) valgt = valgt.slice(0, 1);
            vis();
          };
        } else if (k.valg.length <= 3) {
          ctlEl = el("div", { class: "ov-seg", role: "radiogroup" });
          var name = uid + "-" + r + "-" + c;
          k.valg.forEach(function (v) {
            var inp = el("input", { type: "radio", name: name, value: String(v) });
            inp.addEventListener("change", function () { onEdit(r, c); });
            inputs.push(inp);
            ctlEl.appendChild(el("label", { class: "ov-seg-o" }, [inp, el("span", { text: plain(pick(v)) })]));
          });
          get = function () { for (var i = 0; i < inputs.length; i++) if (inputs[i].checked) return k.valg[i]; return null; };
          set = function (v) { inputs.forEach(function (x, i) { x.checked = v != null && String(k.valg[i]) === String(v); }); };
        } else {
          ctlEl = el("select", { class: "ov-sel" }, [el("option", { value: "", text: "–" })].concat(k.valg.map(function (v, i) { return el("option", { value: String(i), text: plain(pick(v)) }); })));
          ctlEl.addEventListener("change", function () { onEdit(r, c); });
          inputs.push(ctlEl);
          get = function () { return ctlEl.value === "" ? null : k.valg[+ctlEl.value]; };
          set = function (v) { var i = -1; k.valg.forEach(function (x, j) { if (v != null && String(x) === String(v)) i = j; }); ctlEl.value = i < 0 ? "" : String(i); };
        }
        var mark = el("span", { class: "ov-cell-m", "aria-hidden": "true" });
        var sr = el("span", { class: "qz-sr" });
        var ex = el("div", { class: "ov-cell-x", hidden: true });
        td.appendChild(lab); td.appendChild(ctlEl); td.appendChild(mark); td.appendChild(sr); td.appendChild(ex);
        tr.appendChild(td);
        cells[r].push({ td: td, lab: lab, ctl: ctlEl, get: get, set: set, mark: mark, sr: sr, ex: ex, aria: aria, k: k, btns: btns });
      });
      tb.appendChild(tr);
    });
    tab.appendChild(tb); tw.appendChild(tab);
    var bSjekk = el("button", { class: "btn primary", type: "button", text: "Sjekk svar", onclick: function () { sjekk(); } });
    var bFasit = el("button", { class: "btn", type: "button", text: "Vis fasit", onclick: function () { visFasit(); } });
    var bReset = el("button", { class: "btn", type: "button", text: "↺ Nullstill", onclick: function () { nullstill(); } });
    var foot = el("div", { class: "qz-foot" }, [bSjekk, bFasit, bReset]);
    var fb = feedback();
    [opEl(o), q, brWrap, tw, foot, fb, regelEl].forEach(function (x) { if (x) wrap.appendChild(x); });
    host.appendChild(wrap); wrap._ovSeen = true;

    function deep(a) { return JSON.parse(JSON.stringify(a)); }
    function aktivFasit() {
      var f = deep(o.fasit || []);
      brytere.forEach(function (x) { if (x.pa && x.b.endrer) { var n = x.b.endrer(f); if (n) f = n; } });
      return f;
    }
    function forklaring(r, c) {
      var key = r + "," + c, v = o.forklaring && o.forklaring[key];
      if (rv && v == null && o.forklaring) v = o.forklaring[String(r)];
      brytere.forEach(function (x) {
        var bf = x.b.forklaring; if (!x.pa || !bf) return;
        if (bf[key] != null) v = bf[key]; else if (rv && bf[String(r)] != null) v = bf[String(r)];
      });
      return v;
    }
    function fasitCelle(f, r, c) {
      if (rv) return f[r] === undefined ? null : rvNorm(f[r]);
      var v = f[r] && f[r][c]; return v === undefined ? null : v;
    }
    function erRiktig(fv, v) {
      if (rv && multi) {
        var a = arr(fv).slice().sort(nsort), b = arr(v).slice().sort(nsort);
        return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
      }
      if (rv) return arr(fv).some(function (x) { return x === v; });
      return arr(fv).some(function (x) { return String(x) === String(v); });
    }
    function fasitTekst(fv) {
      if (!rv) return arr(fv).map(function (x) { return plain(pick(x)); }).join(" / ");
      var t = arr(fv).map(function (i) { return plain(pick(kolonner[0].valg[i])); });
      return multi ? (t.length ? t.join(" + ") : "ingen") : t.join(" / ");
    }
    function paintText() {
      if (q) put(q, o.sporsmal);
      kolonner.forEach(function (k, c) { put(colHead[c], k.navn); });
      o.rader.forEach(function (rn, r) {
        put(rowHead[r], rn);
        cells[r].forEach(function (cell) {
          cell.lab.textContent = plain(pick(cell.k.navn));
          cell.ctl.setAttribute("aria-label", cell.aria());
          if (cell.btns) cell.btns.forEach(function (b, i) { put(b, cell.k.valg[i]); });
        });
      });
      brytere.forEach(function (x) { put(IN.qs(".ov-bryter-l", x.btn), x.b.navn); });
    }
    function telling() {
      var f = aktivFasit(), c = { right: 0, wrong: 0, blank: 0, total: 0 };
      for (var r = 0; r < R; r++) for (var k = 0; k < K; k++) {
        var fv = fasitCelle(f, r, k); if (fv == null) continue;
        c.total++;
        var v = cells[r][k].get();
        if (v == null) c.blank++; else if (erRiktig(fv, v)) c.right++; else c.wrong++;
      }
      c.poeng = skaar(c, o.regel);
      return c;
    }
    function clearMarks() {
      cells.forEach(function (row) { row.forEach(function (cell) {
        cell.td.className = "ov-cell"; cell.mark.textContent = ""; cell.sr.textContent = ""; cell.ex.hidden = true; cell.ex.innerHTML = "";
      }); });
    }
    function paintMarks() {
      var f = aktivFasit();
      for (var r = 0; r < R; r++) for (var k = 0; k < K; k++) {
        var cell = cells[r][k], fv = fasitCelle(f, r, k), v = cell.get();
        if (fv == null) { cell.td.className = "ov-cell"; continue; }
        var s = v == null ? "blank" : erRiktig(fv, v) ? "right" : "wrong";
        cell.td.className = "ov-cell is-" + s;
        cell.mark.textContent = s === "right" ? "✓" : s === "wrong" ? "✗" : "–";
        var fasitTxt = fasitTekst(fv);
        cell.sr.textContent = s === "right" ? " Riktig." : " " + (s === "wrong" ? "Feil" : "Ubesvart") + ". Fasit: " + fasitTxt + ".";
        var ex = forklaring(r, k);
        var head = s === "right" ? "" : "<b>Fasit: " + fasitTxt + ".</b> ";
        if (ex || head) { cell.ex.hidden = false; put(cell.ex, head + (pick(ex) || "")); }
        else cell.ex.hidden = true;
      }
    }
    /* B1: «2 av 3 poeng · 2 riktig · 1 galt · 0 ubesvart» (uten regel: «2 av 3 riktig · 1 galt · 0 ubesvart») */
    function sumTekst(c) {
      var p = c.poeng;
      return (p ? "<b>" + num(p.poeng) + " av " + num(p.maks) + " poeng</b> · " + c.right + " riktig" : "<b>" + c.right + " av " + c.total + " riktig</b>") +
        " · " + c.wrong + " galt · " + c.blank + " ubesvart" +
        (p && p.raa < p.min ? " (summen ble " + num(p.raa) + ", men aldri under " + num(p.min) + ")" : "");
    }
    function onEdit() {
      if (checked) { checked = false; revealed = false; clearMarks(); setFb(fb, "", "Endret. Trykk «Sjekk svar» på nytt."); }
      persist();
    }
    /* B5: valgene (som indekser), sjekket/vist og brytere lagres (in2120:matrise:<side>:<id>). */
    function cellIdx(cell) {
      var v = cell.get();
      if (rv || v == null) return v;
      var i = cell.k.valg.indexOf(v);
      return i < 0 ? null : i;
    }
    function persist() {
      if (laster || !lag) return;
      lag.sett({ v: cells.map(function (row) { return row.map(cellIdx); }), c: checked, f: revealed,
        b: brytere.map(function (x) { return x.pa; }), fb: fbRec(fb) });
    }
    function restore() {
      var rec = lag && lag.hent();
      if (!rec || !Array.isArray(rec.v) || rec.v.length !== R) return;
      rec.v.forEach(function (row, r) {
        if (!Array.isArray(row)) return;
        row.forEach(function (v, k) {
          var cell = cells[r][k]; if (!cell || v == null) return;
          cell.set(rv ? v : cell.k.valg[v]);
        });
      });
      if (Array.isArray(rec.b)) brytere.forEach(function (x, i) { x.pa = !!rec.b[i]; x.btn.setAttribute("aria-checked", x.pa ? "true" : "false"); });
      revealed = !!rec.f;
      if (rec.c) sjekk(true);
      else if (rec.fb && rec.fb.h) setFb(fb, rec.fb.t, rec.fb.h);
    }
    function sjekk(stille) {
      checked = true;
      paintMarks();
      var c = telling();
      setFb(fb, c.right === c.total ? "right" : c.right ? "warn" : "wrong", (revealed ? "Fasiten er fylt inn. " : "") + sumTekst(c));
      if (!revealed && !stille) {
        if (c.poeng) solved("matrise", o.id, c.poeng.poeng, c.poeng.maks); else solved("matrise", o.id, c.right, c.total);
      }
      persist();
      return { right: c.right, wrong: c.wrong, blank: c.blank, total: c.total, poeng: c.poeng ? c.poeng.poeng : null, maks: c.poeng ? c.poeng.maks : null };
    }
    function visFasit() {
      var f = aktivFasit();
      for (var r = 0; r < R; r++) for (var k = 0; k < K; k++) {
        var fv = fasitCelle(f, r, k); if (fv != null) cells[r][k].set(rv && multi ? fv : arr(fv)[0]);
      }
      revealed = true;
      return sjekk(true);
    }
    function nullstill() {
      checked = false; revealed = false;
      cells.forEach(function (row) { row.forEach(function (cell) { cell.set(null); }); });
      clearMarks();
      setFb(fb, "", "Nullstilt.");
      if (lag) lag.fjern();
    }
    function bryter(i, pa) {
      var x = brytere[i]; if (!x) return;
      x.pa = !!pa;
      x.btn.setAttribute("aria-checked", x.pa ? "true" : "false");
      var var_ = plain(pick(x.b.navn)) + (x.pa ? " på." : " av.");
      if (checked) {
        paintMarks();
        var c = telling();
        setFb(fb, c.right === c.total ? "right" : c.right ? "warn" : "wrong", "Variant: " + var_ + " Fasiten er endret. " + sumTekst(c));
      } else setFb(fb, "", "Variant: " + var_);
      persist();
    }
    paintText();
    lag = lager("matrise", o, host, wrap, ".ov-mat", fpAv({ r: o.rader, k: kolonner, f: o.fasit, rv: !!rv, m: multi }));
    restore();
    laster = false;
    onLevel(wrap, function () { paintText(); if (checked) paintMarks(); });
    return {
      el: wrap,
      sett: function (r, k, v) { if (rv) { v = k; k = 0; } cells[r][k].set(v); onEdit(); },
      hent: function (r, k) { return cells[r][rv ? 0 : k].get(); },
      sjekk: function () { return sjekk(false); }, visFasit: visFasit, nullstill: nullstill, bryter: bryter,
      fasit: aktivFasit, feedback: function () { return fb.textContent; },
      celle: function (r, k) { return cells[r][rv ? 0 : k].td; }
    };
  };

  /* ====================================================================
     IN.scenario
     ==================================================================== */
  var KIT = [["K", "Konfidensialitet"], ["I", "Integritet"], ["T", "Tilgjengelighet"]];
  function kitTone(v) {
    v = String(v || "").toLowerCase();
    if (v === "ok" || v === "intakt" || v === "gjenopprettet") return "ok";
    if (v === "brutt") return "danger";
    if (v === "truet" || v === "risiko" || v === "redusert" || v === "usikker") return "warn";
    return "";
  }
  function kitOrd(v) {
    var m = { ok: "Intakt", brutt: "Brutt", truet: "Truet" };
    v = String(v || "ok");
    return m[v.toLowerCase()] || (v.charAt(0).toUpperCase() + v.slice(1));
  }
  IN.scenario = function (host, o) {
    host = resolve(host);
    if (!host || !o || !o.noder || !o.noder[o.start]) return null;
    var uid = "ovs" + (++uidN);
    var storeKey = o.id ? "in2120:scen:" + o.id : null;
    var fp = hash(Object.keys(o.noder).map(function (k) { var n = o.noder[k]; return k + ":" + arr(n.valg).map(function (v) { return v.til; }).join(","); }).join("|"));
    var sti = [], fritekst = "", kryss = [];
    var fri = o.avslutt && o.avslutt.fritekst;

    // Beste mulige poengsum fra en node (DFS med vakt mot sykler)
    var memo = {};
    function best(id, seen) {
      if (memo[id] != null) return memo[id];
      var n = o.noder[id]; if (!n || n.slutt || !arr(n.valg).length) return 0;
      seen = seen || {}; if (seen[id]) return 0; seen[id] = true;
      var b = -Infinity;
      n.valg.forEach(function (v) { b = Math.max(b, (+v.poeng || 0) + best(v.til, seen)); });
      seen[id] = false;
      memo[id] = b === -Infinity ? 0 : b;
      return memo[id];
    }
    function replay(p) {          // → { node, steg: [{node, valg, v}], kit, poeng } eller null
      var cur = o.start, steps = [], kit = {}, pts = 0;
      KIT.forEach(function (k) { kit[k[0]] = (o.kitStart && o.kitStart[k[0]]) || "ok"; });
      for (var i = 0; i < p.length; i++) {
        var n = o.noder[cur], v = n && arr(n.valg)[p[i]];
        if (!v || !o.noder[v.til]) return null;
        steps.push({ node: cur, valg: p[i], v: v });
        if (v.kit) Object.keys(v.kit).forEach(function (k) { kit[k] = v.kit[k]; });
        pts += +v.poeng || 0;
        cur = v.til;
      }
      return { node: cur, steg: steps, kit: kit, poeng: pts };
    }
    if (storeKey) {
      try {
        var s = JSON.parse(IN.store.get(storeKey, "null"));
        if (s && s.h === fp && Array.isArray(s.sti) && replay(s.sti)) {
          sti = s.sti; fritekst = s.f || ""; kryss = Array.isArray(s.k) ? s.k : [];
        }
      } catch (e) {}
    }
    function persist() { if (storeKey) IN.store.set(storeKey, JSON.stringify({ h: fp, sti: sti, f: fritekst, k: kryss })); }

    var wrap = el("div", { class: "ov ov-scen" });
    var tittel = o.tittel ? el("p", { class: "ov-scen-tittel" }) : null;
    var stiEl = el("ol", { class: "ov-sti", "aria-label": "Valgene dine så langt" });
    var kitVis = o.kit === false ? [] : Array.isArray(o.kit) ?
      KIT.filter(function (k) { return o.kit.map(function (x) { return String(x).toUpperCase(); }).indexOf(k[0]) >= 0; }) : KIT;
    var kitEl = kitVis.length ? el("div", { class: "ov-kit" + (kitVis.length < 3 ? " ov-kit-n" + kitVis.length : ""), role: "group", "aria-label": "KIT-status" }) : null;
    var kitCells = {};
    kitVis.forEach(function (k) {
      var v = el("span", { class: "ov-kit-v" });
      var c = el("div", { class: "ov-kit-c" }, [el("span", { class: "ov-kit-k", title: k[1], text: k[0] }), el("span", { class: "ov-kit-n", text: k[1] }), v]);
      kitCells[k[0]] = { c: c, v: v };
      kitEl.appendChild(c);
    });
    var kons = feedback("ov-kons");
    var nodeH = el("div", { class: "ov-node", tabindex: "-1", id: uid + "-node" });
    var valgEl = el("div", { class: "ov-valg", role: "group", "aria-labelledby": uid + "-node" });
    var slutt = el("div", { class: "ov-slutt", hidden: true });
    var bTilbake = el("button", { class: "btn", type: "button", text: "← Ett steg tilbake", onclick: function () { tilbake(); } });
    var bOm = el("button", { class: "btn", type: "button", text: "↺ Start på nytt", onclick: function () { omstart(); } });
    var foot = el("div", { class: "qz-foot" }, [bTilbake, bOm]);
    [tittel, opEl(o), kitEl, stiEl, kons, nodeH, valgEl, slutt, foot].forEach(function (x) { if (x) wrap.appendChild(x); });
    host.appendChild(wrap); wrap._ovSeen = true;
    var lastReported = null;

    function paint(fokus) {
      var r = replay(sti);
      if (!r) { sti = []; r = replay(sti); }
      if (tittel) put(tittel, o.tittel);
      // KIT
      kitVis.forEach(function (k) {
        var v = r.kit[k[0]], t = kitTone(v);
        kitCells[k[0]].c.className = "ov-kit-c" + (t ? " is-" + t : "");
        kitCells[k[0]].v.textContent = kitOrd(v);
      });
      // Sti
      while (stiEl.firstChild) stiEl.removeChild(stiEl.firstChild);
      r.steg.forEach(function (s, i) {
        var li = el("li", { class: "ov-sti-s" + ((+s.v.poeng || 0) > 0 ? " is-right" : (+s.v.poeng || 0) < 0 ? " is-wrong" : "") });
        put(li, s.v.tekst);
        li.insertBefore(el("span", { class: "ov-sti-n", text: (i + 1) + ". " }), li.firstChild);
        stiEl.appendChild(li);
      });
      stiEl.hidden = !r.steg.length;
      // Konsekvens av siste valg
      var last = r.steg[r.steg.length - 1];
      if (last && last.v.konsekvens) {
        var p = +last.v.poeng || 0;
        setFb(kons, p > 0 ? "right" : p < 0 ? "wrong" : "info", last.v.konsekvens);
      } else setFb(kons, "", "");
      // Noden
      var n = o.noder[r.node];
      put(nodeH, n.tekst);
      while (valgEl.firstChild) valgEl.removeChild(valgEl.firstChild);
      var erSlutt = !!n.slutt || !arr(n.valg).length;
      arr(n.valg).forEach(function (v, i) {
        var b = el("button", { class: "ov-valg-b", type: "button", onclick: function () { velg(i); } });
        put(b, v.tekst);
        valgEl.appendChild(b);
      });
      valgEl.hidden = erSlutt;
      bTilbake.disabled = !sti.length;
      paintSlutt(r, n, erSlutt);
      if (fokus) { try { nodeH.focus({ preventScroll: true }); } catch (e) { nodeH.focus(); } }
    }
    function paintSlutt(r, n, erSlutt) {
      while (slutt.firstChild) slutt.removeChild(slutt.firstChild);
      slutt.hidden = !erSlutt;
      if (!erSlutt) return;
      var b = best(o.start);
      slutt.appendChild(el("p", { class: "ov-slutt-h", html: "<b>Slutt.</b> Du fikk " + num(r.poeng) + " poeng" + (b > 0 ? " av " + num(b) + " mulige" : "") + "." }));
      if (n.oppsummering) slutt.appendChild(put(el("div", { class: "ov-oppsum" }), n.oppsummering));
      var ol = el("ol", { class: "ov-sum-l", "aria-label": "Oppsummering av valgene" });
      r.steg.forEach(function (s) {
        var p = +s.v.poeng || 0;
        var li = el("li", { class: p > 0 ? "is-right" : p < 0 ? "is-wrong" : "" });
        var t = el("div", { class: "ov-sum-v" }); put(t, s.v.tekst);
        t.appendChild(el("span", { class: "ov-sum-p", text: " (" + sgn(p) + ")" }));
        li.appendChild(t);
        if (s.v.konsekvens) li.appendChild(put(el("div", { class: "ov-sum-k" }), s.v.konsekvens));
        ol.appendChild(li);
      });
      slutt.appendChild(ol);
      if (fri) {
        var fid = uid + "-fri";
        var box = el("div", { class: "ov-fri" });
        box.appendChild(put(el("label", { for: fid, class: "ov-fri-q" }), fri.sporsmal));
        var ta = el("textarea", { id: fid, class: "ov-ta", rows: "4", spellcheck: "true" });
        ta.value = fritekst;
        ta.addEventListener("input", function () { fritekst = ta.value; persist(); });
        box.appendChild(ta);
        var liste = arr(fri.sjekkliste);
        if (liste.length) {
          var cnt = el("p", { class: "ov-fri-n", role: "status", "aria-live": "polite" });
          var fs = el("fieldset", { class: "ov-sjekk" }, [el("legend", { text: "Sjekk svaret ditt selv: kryss av det du fikk med" })]);
          var tell = function () {
            var a = liste.filter(function (_, i) { return kryss[i]; }).length;
            cnt.textContent = "Du har krysset av " + a + " av " + liste.length + ".";
          };
          liste.forEach(function (t, i) {
            var cb = el("input", { type: "checkbox" });
            cb.checked = !!kryss[i];
            cb.addEventListener("change", function () { kryss[i] = cb.checked; persist(); tell(); });
            var lab = put(el("label", { class: "ov-sjekk-o" }), t);
            lab.insertBefore(cb, lab.firstChild);
            fs.appendChild(lab);
          });
          box.appendChild(fs); box.appendChild(cnt); tell();
        }
        slutt.appendChild(box);
      }
      var key = sti.join(",");
      if (o.id && lastReported !== key) {
        lastReported = key;
        if (b > 0) solved("scen", o.id, Math.max(0, r.poeng), b); else solved("scen", o.id, 1, 1);
      }
    }
    function velg(i) {
      var r = replay(sti), n = o.noder[r.node];
      if (!n || !arr(n.valg)[i]) return false;
      sti = sti.concat([i]); persist(); paint(true);
      return true;
    }
    function tilbake() { if (!sti.length) return; sti = sti.slice(0, -1); persist(); paint(true); setFb(kons, "info", "Ett steg tilbake. Velg på nytt."); }
    function omstart() { sti = []; fritekst = ""; kryss = []; lastReported = null; persist(); paint(true); setFb(kons, "info", "Startet på nytt."); }
    paint(false);
    onLevel(wrap, function () { paint(false); });
    return {
      el: wrap, velg: velg, tilbake: tilbake, omstart: omstart,
      node: function () { return replay(sti).node; }, sti: function () { return sti.slice(); },
      kit: function () { return replay(sti).kit; }, poeng: function () { return replay(sti).poeng; },
      beste: function () { return best(o.start); }, feedback: function () { return kons.textContent; }
    };
  };

  /* ====================================================================
     IN.finnFeilen
     ==================================================================== */
  IN.finnFeilen = function (host, o) {
    host = resolve(host);
    if (!host || !o || !o.linjer) return null;
    var uid = "ovf" + (++uidN), maxTry = o.forsok || 2;
    var feil = arr(o.feil).map(Number).sort(function (a, b) { return a - b; });
    var valgt = {}, grunn = null, forsok = 0, vist = false, ferdig = false;
    var rgObj = o.riktigGrunn != null && typeof o.riktigGrunn === "object";
    var perLinje = o.grunnPerLinje != null ? !!o.grunnPerLinje : rgObj && (function () {
      var u = {};
      feil.forEach(function (l) { var g = o.riktigGrunn[l]; if (g != null) u[+g] = true; });
      return Object.keys(u).length > 1;
    })();
    var grunnPer = {}, sist = null;   // per linje: { linjeindeks: grunnindeks }, sist valgte linje
    var laster = true, lag = null;
    var wrap = el("div", { class: "ov ov-feil" + (perLinje ? " ov-feil-pl" : "") });
    var q = o.sporsmal ? el("div", { class: "ov-q" }) : null;
    var steg1 = el("p", { class: "ov-steg", id: uid + "-s1", text: feil.length > 1 ? "1. Trykk på linjene som er feil." : "1. Trykk på linja som er feil." });
    var kode = el("div", { class: "ov-kode", role: "group", "aria-labelledby": uid + "-s1" });
    if (o.tittel) kode.appendChild(el("div", { class: "ov-kode-t", text: plain(pick(o.tittel)) }));
    var lines = o.linjer.map(function (l, i) {
      var b = el("button", { class: "ov-linje", type: "button", "aria-pressed": "false", "data-i": String(i) }, [
        el("span", { class: "ov-linje-n", "aria-hidden": "true", text: String(i + 1) }),
        el("code", { class: "ov-linje-k", html: l }),
        el("span", { class: "ov-linje-m", "aria-hidden": "true" })]);
      b.setAttribute("aria-label", "Linje " + (i + 1) + ": " + plain(l));
      b.addEventListener("click", function () { velgLinje(i); });
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var j = Math.max(0, Math.min(lines.length - 1, i + d));
        lines[j].b.focus();
      });
      var x = el("div", { class: "ov-linje-x", hidden: true });
      kode.appendChild(b); kode.appendChild(x);
      return { b: b, x: x };
    });
    var steg2 = el("p", { class: "ov-steg", id: uid + "-s2", text: perLinje ? "2. Hvorfor er hver valgt linje feil?" : "2. Hvorfor er det feil?" });
    var grp = perLinje ? el("div", { class: "ov-grunner-pl" }) :
      el("div", { class: "ov-grunner", role: "radiogroup", "aria-labelledby": uid + "-s2" });
    var gInputs = perLinje ? [] : arr(o.grunner).map(function (g, i) {
      var inp = el("input", { type: "radio", name: uid + "-g", value: String(i) });
      inp.addEventListener("change", function () { if (ferdig) return; grunn = i; persist(); });
      var lab = el("label", { class: "ov-grunn" }, [inp, el("span")]);
      grp.appendChild(lab);
      return { inp: inp, lab: lab, txt: lab.lastChild, g: g };
    });
    var bSjekk = el("button", { class: "btn primary", type: "button", text: "Sjekk svar", onclick: function () { sjekk(); } });
    var bVis = el("button", { class: "btn", type: "button", text: "Vis fasit", disabled: true, onclick: function () { visSvar(); } });
    var bReset = el("button", { class: "btn", type: "button", text: "↺ Nullstill", onclick: function () { nullstill(); } });
    var foot = el("div", { class: "qz-foot" }, [bSjekk, bVis, bReset]);
    var fb = feedback();
    var fork = el("div", { class: "ov-losn", hidden: true });
    [opEl(o), q, steg1, kode, steg2, grp, foot, fb, fork].forEach(function (x) { if (x) wrap.appendChild(x); });
    host.appendChild(wrap); wrap._ovSeen = true;

    function valgtListe() { return Object.keys(valgt).filter(function (k) { return valgt[k]; }).map(Number).sort(function (a, b) { return a - b; }); }
    function riktigGrunn(linje) {
      var rg = o.riktigGrunn;
      if (rg != null && typeof rg === "object") return rg[linje] != null ? +rg[linje] : null;
      return rg == null ? null : +rg;
    }
    function paintText() {
      if (q) put(q, o.sporsmal);
      gInputs.forEach(function (g) { put(g.txt, g.g); });
      if (perLinje) paintPL();
      if (vist || ferdig) paintSvar();
    }
    /* Per linje: én blokk med begrunnelser for hver valgt linje (og hver feillinje når svaret vises). */
    function paintPL() {
      while (grp.firstChild) grp.removeChild(grp.firstChild);
      var vis = valgtListe();
      if (vist) feil.forEach(function (l) { if (vis.indexOf(l) < 0) vis.push(l); });
      vis.sort(function (a, b) { return a - b; });
      if (!vis.length) { grp.appendChild(el("p", { class: "ov-pl-tom", text: "Trykk på en linje først. Da kommer begrunnelsene for den her." })); return; }
      vis.forEach(function (l) {
        var hid = uid + "-pl-" + l, erFeil = feil.indexOf(l) >= 0, rg = riktigGrunn(l);
        var head = el("p", { class: "ov-pl-h", id: hid }, [el("span", { text: "Linje " + (l + 1) + ": " }), el("code", { html: o.linjer[l] })]);
        if (vist && !erFeil) head.appendChild(el("span", { class: "ov-pl-ok", text: " (er i orden)" }));
        if (vist && erFeil && !valgt[l]) head.appendChild(el("span", { class: "ov-pl-ok", text: " (ikke valgt)" }));
        var blk = el("div", { class: "ov-pl", role: "radiogroup", "aria-labelledby": hid }, [head]);
        arr(o.grunner).forEach(function (g, i) {
          var inp = el("input", { type: "radio", name: uid + "-g-" + l, value: String(i) });
          inp.checked = grunnPer[l] === i;
          inp.disabled = ferdig || !valgt[l];
          inp.addEventListener("change", function () { if (ferdig) return; grunnPer[l] = i; sist = l; persist(); });
          var tone = !vist ? "" : (erFeil && rg === i) ? " is-right" : grunnPer[l] === i ? " is-wrong" : "";
          var lab = el("label", { class: "ov-grunn" + tone }, [inp, put(el("span"), g)]);
          blk.appendChild(lab);
        });
        grp.appendChild(blk);
      });
    }
    function velgLinje(i) {
      if (ferdig) return;
      if (feil.length > 1) valgt[i] = !valgt[i];
      else { var was = !!valgt[i]; valgt = {}; valgt[i] = !was; }
      lines.forEach(function (l, j) { l.b.setAttribute("aria-pressed", valgt[j] ? "true" : "false"); l.b.classList.toggle("sel", !!valgt[j]); });
      if (perLinje) {
        Object.keys(grunnPer).forEach(function (k) { if (!valgt[k]) delete grunnPer[k]; });
        sist = valgt[i] ? i : (sist != null && valgt[sist] ? sist : null);
        paintPL();
      }
      persist();
    }
    function velgGrunn(i, linje) {
      if (ferdig) return false;
      if (perLinje) {
        var l = linje != null ? +linje : sist;
        if (l == null || !valgt[l]) return false;
        grunnPer[l] = i; sist = l; paintPL(); persist();
        return true;
      }
      grunn = i; gInputs.forEach(function (g, j) { g.inp.checked = j === i; });
      persist();
      return true;
    }
    function vurder() {
      var v = valgtListe();
      var linjeOk = v.length === feil.length && v.every(function (x, i) { return x === feil[i]; });
      if (perLinje) {
        var grunner = {};
        feil.forEach(function (l) { grunner[l] = !!valgt[l] && grunnPer[l] != null && grunnPer[l] === riktigGrunn(l); });
        var ok = feil.every(function (l) { return grunner[l]; });
        return { linje: linjeOk, grunn: ok, poeng: (linjeOk ? 1 : 0) + (ok ? 1 : 0), valgt: v, grunner: grunner };
      }
      var grunnOk = grunn != null && feil.every(function (l) { return riktigGrunn(l) === grunn; });
      return { linje: linjeOk, grunn: grunnOk, poeng: (linjeOk ? 1 : 0) + (grunnOk ? 1 : 0), valgt: v };
    }
    function paintSvar() {
      lines.forEach(function (l, i) {
        var erFeil = feil.indexOf(i) >= 0;
        l.b.classList.toggle("is-wrong", erFeil);
        l.b.classList.toggle("is-miss", !erFeil && !!valgt[i]);
        IN.qs(".ov-linje-m", l.b).textContent = erFeil ? "feil" : valgt[i] ? "ok" : "";
        var lf = o.linjeForklaring && o.linjeForklaring[i];
        if (lf) { l.x.hidden = false; put(l.x, lf); } else l.x.hidden = true;
      });
      gInputs.forEach(function (g, i) {
        var ok = feil.some(function (l) { return riktigGrunn(l) === i; });
        g.lab.className = "ov-grunn" + (ok ? " is-right" : grunn === i ? " is-wrong" : "");
      });
      if (perLinje) paintPL();
      put(fork, o.forklaring);
      fork.hidden = !o.forklaring;
    }
    function avslutt(r, stille) {
      ferdig = true; vist = true;
      bSjekk.disabled = true; bVis.disabled = true;
      lines.forEach(function (l) { l.b.setAttribute("aria-disabled", "true"); });
      gInputs.forEach(function (g) { g.inp.disabled = true; });
      paintSvar();
      if (!stille) solved("feil", o.id, r ? r.poeng : 0, 2);
      persist();
    }
    function sjekk() {
      if (ferdig) return vurder();
      var v = valgtListe();
      var mangler = perLinje ? v.filter(function (l) { return grunnPer[l] == null; }) : [];
      if (!v.length || (!perLinje && grunn == null) || mangler.length) {
        setFb(fb, "warn", !v.length ? "Trykk først på linja du mener er feil." :
          mangler.length ? "Velg også en begrunnelse for linje " + mangler.map(function (l) { return l + 1; }).join(" og ") + "." : "Velg også en begrunnelse.");
        return { linje: false, grunn: false, poeng: 0, ufullstendig: true };
      }
      forsok++;
      var r = vurder();
      bVis.disabled = false;
      var flere = feil.length > 1;
      if (r.linje && r.grunn) {
        setFb(fb, "right", "<b>Riktig.</b> " + (flere ? "Riktige linjer" : "Riktig linje") + " og riktig begrunnelse" + (perLinje && flere ? " for hver" : "") + " (2 av 2).");
        avslutt(r); return r;
      }
      var msg;
      if (perLinje) {
        var galeG = feil.filter(function (l) { return valgt[l] && !r.grunner[l]; }).map(function (l) { return l + 1; });
        msg = r.linje ? "<b>" + (flere ? "Riktige linjer" : "Riktig linje") + "</b>, men begrunnelsen holder ikke for linje " + galeG.join(" og ") + "." :
          r.grunn ? "<b>Riktige begrunnelser</b> for feillinjene, men du har også valgt en linje som er i orden." :
          galeG.length < feil.filter(function (l) { return valgt[l]; }).length ? "<b>Ikke helt.</b> Noen begrunnelser stemmer, men ikke alle linjene er riktige." :
          "<b>Ikke riktig.</b> Les linjene en gang til.";
      } else msg = r.linje ? "<b>Riktig linje</b>, men begrunnelsen holder ikke." :
        r.grunn ? "<b>Riktig begrunnelse</b>, men den hører til en annen linje." : "<b>Ikke riktig.</b> Les linjene en gang til.";
      if (forsok >= maxTry) { setFb(fb, "wrong", msg + " (" + r.poeng + " av 2) Her er svaret."); avslutt(r); }
      else { setFb(fb, r.poeng ? "warn" : "wrong", msg + " Prøv igjen (" + (maxTry - forsok) + " forsøk igjen)."); persist(); }
      return r;
    }
    function visSvar() {
      if (ferdig) return;
      setFb(fb, "", "Svaret vises under.");
      avslutt(null);
    }
    function nullstill() {
      valgt = {}; grunn = null; grunnPer = {}; sist = null; forsok = 0; vist = false; ferdig = false;
      bSjekk.disabled = false; bVis.disabled = true;
      lines.forEach(function (l) {
        l.b.removeAttribute("aria-disabled"); l.b.setAttribute("aria-pressed", "false");
        l.b.className = "ov-linje"; IN.qs(".ov-linje-m", l.b).textContent = ""; l.x.hidden = true;
      });
      gInputs.forEach(function (g) { g.inp.disabled = false; g.inp.checked = false; g.lab.className = "ov-grunn"; });
      fork.hidden = true;
      if (perLinje) paintPL();
      setFb(fb, "", "Nullstilt.");
      if (lag) lag.fjern();
    }
    /* B5: valgte linjer, begrunnelser, forsøk og om svaret er vist lagres (in2120:feil:<side>:<id>). */
    function persist() {
      if (laster || !lag) return;
      lag.sett({ v: valgtListe(), g: grunn, gp: grunnPer, n: forsok, vist: vist, ferdig: ferdig, fb: fbRec(fb) });
    }
    function restore() {
      var rec = lag && lag.hent();
      if (!rec || !Array.isArray(rec.v)) return;
      valgt = {};
      rec.v.forEach(function (i) { if (i >= 0 && i < lines.length) valgt[i] = true; });
      lines.forEach(function (l, j) { l.b.setAttribute("aria-pressed", valgt[j] ? "true" : "false"); l.b.classList.toggle("sel", !!valgt[j]); });
      grunn = rec.g != null && rec.g >= 0 && rec.g < gInputs.length ? +rec.g : null;
      gInputs.forEach(function (g, j) { g.inp.checked = j === grunn; });
      grunnPer = {};
      if (rec.gp && typeof rec.gp === "object") Object.keys(rec.gp).forEach(function (k) { if (valgt[k]) grunnPer[k] = +rec.gp[k]; });
      forsok = +rec.n || 0;
      if (forsok) bVis.disabled = false;
      if (perLinje) paintPL();
      if (rec.ferdig) avslutt(null, true);
      if (rec.fb && rec.fb.h) setFb(fb, rec.fb.t, rec.fb.h);
    }
    paintText();
    lag = lager("feil", o, host, wrap, ".ov-feil", fpAv({ l: o.linjer, f: o.feil, g: o.grunner, rg: o.riktigGrunn }));
    restore();
    laster = false;
    onLevel(wrap, paintText);
    return { el: wrap, velgLinje: velgLinje, velgGrunn: velgGrunn, sjekk: sjekk, visSvar: visSvar, nullstill: nullstill,
      feedback: function () { return fb.textContent; }, linje: function (i) { return lines[i].b; },
      perLinje: function () { return perLinje; },
      grunnFor: function (l) { return perLinje ? (grunnPer[l] != null ? grunnPer[l] : null) : grunn; } };
  };

  IN.ovelse = { skaar: skaar, regelTekst: regelTekst, parseTall: parseTall, formatTall: formatTall };
})();
