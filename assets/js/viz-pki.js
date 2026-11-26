/* ============================================================
   IN2120 guide · viz-pki.js
   Visualiseringer for blokk 3 (nøkkelhåndtering og PKI). Klassisk script, lastes etter core.js og stepplayer.js.

   IN.pkiTilstander(host)        bøtteoppgave (IN.bucketTask): tilstand → lov bruk, og «slett» mot «overskriv»
   IN.pkiTidslinje(host)         kryptoperiode: beskyttelse og prosessering, med «kompromittert her»
   IN.pkiTyveri(host)            scenario (IN.scenario): «Alice har Bobs private nøkkel», konsekvens og tiltak først
   IN.pkiDistribusjon(host)      to IN.regnForst med glider for n: n(n−1)/2 og n(n−1), stolper for alle tre etterpå
   IN.pkiFelter(host)            X.509-feltene: fyll ut først (IN.bucketTask), så generering (stegspiller med spor)
                                 og hva signaturen dekker
   IN.pkiKjede(host, opts?)      hovedviz: klikkbar sertifikatkjede, validering steg for steg, scenarioer,
                                 statussjekk (OCSP / stifting / ingen) og oppgavemodus
                                 opts: { scen: [id …] (utvalg), start: id, status: "ocsp"|"stifting"|"ingen" }
   IN.pkiCaa(host)               scenario (IN.scenario): CAA-recorden i DNS, ærlig og kompromittert CA
   IN.pkiModeller(host)          tillitsmodeller med «kompromitter en node», og tillitsforvirring
   IN.pkiSjekk()                 selvtest av tallene (brukes i node-test), gir [{navn, ok, fikk, ventet}]
   Lagring bare via dra.js og ovelse.js (in2120:dra:…, in2120:scen:pki-…). Krever dra.js og ovelse.js lastet.
   Data og fasit følger plan/innhold/03-pki.md.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;
  var SVGNS = "http://www.w3.org/2000/svg";
  var uid = 0;

  function host$(h) { return typeof h === "string" ? IN.qs(h) : h; }
  function H(tag, cls, html) { var n = el(tag, cls ? { class: cls } : {}); if (html != null) n.innerHTML = html; return n; }
  function S(tag, attrs, text) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function btn(text, fn, cls) { return el("button", { class: "btn sm" + (cls ? " " + cls : ""), type: "button", html: text, onclick: fn }); }
  function press(b, on) { b.setAttribute("aria-pressed", on ? "true" : "false"); }
  function K(eier, art) { return "K<sup>" + eier + "</sup><sub>" + art + "</sub>"; }
  function copy(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- Datoer (ISO-strenger, UTC) ---------- */
  function dnum(s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function fmt(s) { var p = s.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function within(dato, fra, til) { var x = dnum(dato); return x >= dnum(fra) && x <= dnum(til); }

  /* ---------- Regning ---------- */
  function modpow(b, e, m) { var r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e = Math.floor(e / 2); } return r; }
  function dist(n) { return { sym: n * (n - 1) / 2, utenPki: n * (n - 1), medPki: n }; }
  function tall(x) { return String(x).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  /* =====================================================================
     1 · NIST-tilstander
     ===================================================================== */
  var TILST = [
    { id: "gen", navn: "Generert", fase: "pre", lov: [], txt: "Nøkkelen finnes, men er ikke tatt i bruk. Ingenting skal beskyttes eller prosesseres ennå." },
    { id: "akt", navn: "Aktivert", fase: "op", lov: ["krypter", "signer", "dekrypter", "valider"], txt: "Den eneste tilstanden der nøkkelen kan <b>beskytte</b> (kryptere eller signere). Avhengig av nøkkeltypen kan den også prosessere (t03 O5)." },
    { id: "sus", navn: "Suspendert", fase: "op", lov: ["dekrypter", "valider"], txt: "Midlertidig stoppet. Bare prosessering: gamle data kan dekrypteres eller valideres, men ingenting nytt beskyttes." },
    { id: "deakt", navn: "Deaktivert", fase: "post", lov: ["dekrypter", "valider"], txt: "Perioden for beskyttelse er over. Gamle data skal fortsatt kunne leses og verifiseres." },
    { id: "komp", navn: "Kompromittert", fase: "post", lov: ["dekrypter", "valider"], txt: "Noen uvedkommende har, eller kan ha, nøkkelen. All beskyttelse stopper straks, og brukerne varsles. Prosessering av gamle data kan tillates hvis risikoen og policyen gir rom for det (d03 s. 23)." },
    { id: "dest", navn: "Destruert", fase: "slutt", lov: [], txt: "Nøkkelen finnes ikke lenger, verken i minnet eller på disk. Ingen bruk er mulig." }
  ];
  var FASER = [
    { id: "pre", navn: "Pre-operasjonell" }, { id: "op", navn: "Operasjonell" },
    { id: "post", navn: "Post-operasjonell" }, { id: "slutt", navn: "Slutt" }
  ];

  // Hvilken bøtte en tilstand hører til: begge (4 lovlige operasjoner), bare prosessering, eller ingen bruk
  function tilstGruppe(t) { return t.lov.length === 4 ? "begge" : t.lov.length ? "pros" : "ingen"; }
  function faseNavn(id) { return FASER.filter(function (f) { return f.id === id; })[0].navn; }
  var TILST_OPPG = {
    id: "pki-tilstander",
    opphav: { type: "egen", kilder: ["d03 s. 24–26"] },
    prompt: {
      eli5: "En nøkkel går gjennom seks tilstander. Legg hver tilstand i boksen som sier hva nøkkelen da får brukes til.",
      normal: "Legg hver NIST-tilstand i riktig bøtte: hva er lov å gjøre med nøkkelen i den tilstanden?",
      teknisk: "Klassifiser de seks NIST-tilstandene (SP 800-57, d03 s. 24) etter tillatt bruk. Beskytte = kryptere eller signere. Prosessere = dekryptere eller validere."
    },
    zones: [
      { id: "begge", label: "Beskytte og/eller prosessere", hint: "kryptere, signere, dekryptere, validere" },
      { id: "pros", label: "Bare prosessere", hint: "dekryptere eller validere gamle data" },
      { id: "ingen", label: "Ingen bruk" }
    ],
    items: TILST.map(function (t) {
      return { id: t.id, html: t.navn, forklaring: "<b>" + faseNavn(t.fase) + " fase.</b> " + t.txt };
    }),
    answer: (function () { var a = {}; TILST.forEach(function (t) { a[t.id] = tilstGruppe(t); }); return a; })(),
    regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
    oppsummering: {
      eli5: "<p>Bare når nøkkelen er aktivert, kan den lage noe nytt. Ellers kan den bare åpne eller sjekke det gamle, eller ingenting.</p>",
      normal: "<p>Bare <b>Aktivert</b> kan beskytte. Suspendert, deaktivert og kompromittert kan bare prosessere gamle data. Generert og destruert gir ingen bruk.</p><p>Vanlig vei: Generert → Aktivert → Deaktivert → Destruert. Aktivert kan midlertidig gå til Suspendert og tilbake. Fra Generert, Aktivert, Suspendert og Deaktivert kan nøkkelen bli Kompromittert. Kompromittert ender i Destruert (NIST SP 800-57 avsn. 7.2, d03 s. 24).</p>",
      teknisk: "<p>Fasene: pre-operasjonell (generert), operasjonell (aktivert, suspendert), post-operasjonell (deaktivert, kompromittert) og destruert. Beskyttelse er bare lov i aktivert tilstand. For kompromittert tillates prosessering bare hvis risikoen og policyen gir rom for det (d03 s. 23–24).</p>"
    },
    kilde: { ref: "d03 s. 23–24 (NIST SP 800-57)", egneOrd: true }
  };

  IN.pkiTilstander = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "pki-viz" });
    var oppg = el("div");
    w.appendChild(oppg);

    // Slett mot overskriv
    w.appendChild(H("h5", "pki-h", "Destruering: slett eller overskriv?"));
    var disk = { mappe: true, kurv: false, sektor: true, nuller: false };
    var diskOut = el("div", { class: "pki-disk" });
    var diskMsg = H("p", "pki-out");
    var row = el("div", { class: "pki-row" }, [
      btn("Slett fila", function () { if (disk.mappe) { disk.mappe = false; disk.kurv = true; } paintDisk("slett"); }),
      btn("Tøm papirkurven", function () { disk.kurv = false; paintDisk("toem"); }),
      btn("Overskriv sektorene", function () { disk.mappe = false; disk.kurv = false; disk.sektor = false; disk.nuller = true; paintDisk("over"); }),
      btn("↺ Nullstill", function () { disk = { mappe: true, kurv: false, sektor: true, nuller: false }; paintDisk(""); })
    ]);
    w.appendChild(row); w.appendChild(diskOut); w.appendChild(diskMsg);
    host.appendChild(w);
    if (IN.bucketTask) IN.bucketTask(oppg, TILST_OPPG, { instant: false });

    function paintDisk(sist) {
      clear(diskOut);
      var key = "K<sub>arkiv</sub> = 9f3a…c71e";
      [["Mappa /nokler", disk.mappe ? key : "–"], ["Papirkurven", disk.kurv ? key : "–"],
       ["Disksektorene", disk.sektor ? key + " <span class=\"muted small\">(kan hentes ut med verktøy)</span>" : (disk.nuller ? "00 00 00 00 … (overskrevet)" : "–")]
      ].forEach(function (r) { diskOut.appendChild(H("div", "pki-disk-r", "<span class=\"pki-k\">" + r[0] + "</span> <span class=\"mono\">" + r[1] + "</span>")); });
      var m = {
        "": "Nøkkelen ligger i mappa. Prøv å slette den.",
        slett: "Fila er bare flyttet til papirkurven. Nøkkelen er ikke destruert.",
        toem: "Papirkurven er tom, men bitene ligger igjen i disksektorene til de blir skrevet over. Fortsatt ikke destruert.",
        over: "Sektorene er overskrevet. Nå er nøkkelen destruert. Degaussing og fysisk ødeleggelse av mediet virker også (d03 s. 26)."
      };
      diskMsg.innerHTML = m[sist] || "";
      diskMsg.className = "pki-out " + (disk.nuller ? "ok" : sist ? "nei" : "");
    }
    paintDisk("");
  };

  /* =====================================================================
     2 · Kryptoperiode-tidslinje
     ===================================================================== */
  var NTYPER = {
    sym: { navn: "Symmetrisk kryptering (AES)", besk: "begge parter, hemmelig nøkkel K", pros: "begge parter, samme hemmelige nøkkel K",
      bOp: "kryptere", pOp: "dekryptere" },
    asym: { navn: "Asymmetrisk kryptering til Bob", besk: "avsenderen, " + K("B", "pub"), pros: "Bob, " + K("B", "priv"),
      bOp: "kryptere til Bob", pOp: "dekryptere hos Bob" },
    sig: { navn: "Digital signatur (Bob signerer)", besk: "Bob, " + K("B", "priv"), pros: "alle mottakerne, " + K("B", "pub"),
      bOp: "signere", pOp: "validere" }
  };
  var TL = { fra: "2026-01-01", bTil: "2027-12-31", pTil: "2037-12-31", ar0: 2026, ar1: 2038 };

  IN.pkiTidslinje = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "pki-viz" });
    var typ = "sig", komp = false, mnd = 17;
    var sel = el("select", { class: "pki-sel", "aria-label": "Nøkkeltype" });
    Object.keys(NTYPER).forEach(function (k) { var o = el("option", { value: k, text: NTYPER[k].navn }); if (k === typ) o.selected = true; sel.appendChild(o); });
    sel.addEventListener("change", function () { typ = sel.value; paint(); });
    var cb = el("input", { type: "checkbox" });
    cb.addEventListener("change", function () { komp = cb.checked; rng.disabled = !komp; paint(); });
    var rng = el("input", { type: "range", min: "0", max: "143", value: String(mnd), disabled: "disabled", "aria-label": "Tidspunkt for kompromittering" });
    rng.addEventListener("input", function () { mnd = +rng.value; paint(); });
    w.appendChild(el("div", { class: "pki-row" }, [el("label", { class: "pki-lbl" }, [el("span", { class: "pki-k", text: "Nøkkeltype:" }), sel])]));
    w.appendChild(el("div", { class: "pki-row" }, [el("label", { class: "pki-lbl" }, [cb, el("span", { text: "Kompromittert her:" })]), rng]));
    var fig = el("div", { class: "pki-svg" });
    var out = H("div", "pki-out");
    w.appendChild(fig); w.appendChild(out);
    host.appendChild(w);

    function mndDato(m) { var y = 2026 + Math.floor(m / 12), mm = (m % 12) + 1; return y + "-" + (mm < 10 ? "0" : "") + mm + "-01"; }
    function paint() {
      var T = NTYPER[typ];
      var W = 640, x0 = 20, x1 = 620, t0 = Date.UTC(TL.ar0, 0, 1), t1 = Date.UTC(TL.ar1, 0, 1);
      function X(iso) { return x0 + (x1 - x0) * (dnum(iso) - t0) / (t1 - t0); }
      var svg = S("svg", { viewBox: "0 0 " + W + " 170", class: "viz-svg", role: "img", "aria-label": "Tidslinje for beskyttelses- og prosesseringsperioden" });
      var kd = komp ? mndDato(mnd) : null, kx = kd ? X(kd) : null;
      var bS = X(TL.fra), bE = X(TL.bTil), pE = X(TL.pTil);
      // Beskyttelse
      svg.appendChild(S("text", { x: x0, y: 22, class: "pki-tl-l" }, "Beskyttelse: " + T.bOp));
      var bCut = kx != null && kx < bE ? Math.max(bS, kx) : bE;
      svg.appendChild(S("rect", { x: bS, y: 30, width: Math.max(0, bCut - bS), height: 18, rx: 3, class: "pki-tl-b" }));
      if (bCut < bE) svg.appendChild(S("rect", { x: bCut, y: 30, width: bE - bCut, height: 18, rx: 3, class: "pki-tl-stopp" }));
      // Prosessering
      svg.appendChild(S("text", { x: x0, y: 76, class: "pki-tl-l" }, "Prosessering: " + T.pOp));
      var pCut = kx != null ? Math.max(bS, Math.min(pE, kx)) : pE;
      svg.appendChild(S("rect", { x: bS, y: 84, width: Math.max(0, pCut - bS), height: 18, rx: 3, class: "pki-tl-p" }));
      if (pCut < pE) svg.appendChild(S("rect", { x: pCut, y: 84, width: pE - pCut, height: 18, rx: 3, class: "pki-tl-dash" }));
      // Akse
      svg.appendChild(S("line", { x1: x0, y1: 126, x2: x1, y2: 126, class: "pki-ax" }));
      for (var y = TL.ar0; y <= TL.ar1; y += 2) {
        var xx = X(y + "-01-01");
        svg.appendChild(S("line", { x1: xx, y1: 122, x2: xx, y2: 130, class: "pki-ax" }));
        svg.appendChild(S("text", { x: xx, y: 144, "text-anchor": "middle", class: "pki-tk" }, String(y)));
      }
      svg.appendChild(S("text", { x: x0, y: 164, class: "pki-tk" }, "Kryptoperiode: " + fmt(TL.fra) + "–" + fmt(TL.pTil)));
      if (kx != null) {
        svg.appendChild(S("line", { x1: kx, y1: 26, x2: kx, y2: 108, class: "pki-tl-k" }));
        svg.appendChild(S("text", { x: Math.min(kx + 4, W - 120), y: 118, class: "pki-tl-kl" }, "kompromittert " + fmt(kd)));
      }
      clear(fig); fig.appendChild(svg);
      var h = "<p><b>Beskyttelse</b> (" + fmt(TL.fra) + "–" + fmt(TL.bTil) + "): " + T.besk + ".<br><b>Prosessering</b> (" + fmt(TL.fra) + "–" + fmt(TL.pTil) + "): " + T.pros + ".</p>";
      if (kd) {
        var etterB = dnum(kd) > dnum(TL.bTil);
        h += etterB
          ? "<p class=\"nei\">Kompromittert " + fmt(kd) + ", etter at beskyttelsesperioden var over. Det er ingenting nytt å stoppe, men varsle brukerne. Gamle data kan bare prosesseres videre hvis risikoen og policyen tillater det (stiplet).</p>"
          : "<p class=\"nei\">Kompromittert " + fmt(kd) + ": all beskyttelse (" + T.bOp + ") stopper samme dag, og brukerne varsles. Prosessering av gamle data (stiplet) er bare lov hvis risikoen og policyen tillater det.</p>";
        if (typ === "sig") h += "<p class=\"small\">Etter " + fmt(kd) + " kan angriperen lage signaturer som ser like ekte ut. Signaturer uten klarert tidsstempel fra før den datoen kan ikke lenger stoles på.</p>";
      } else {
        h += "<p class=\"small muted\">Prosesseringsperioden er lengre: et vedtak eller et arkiv skal kunne sjekkes eller leses i mange år etter at nøkkelen sluttet å beskytte. Datoene er et oppdiktet eksempel og like for alle typene; NIST foreslår for eksempel ≤ 2 år beskyttelse og ≤ 3 år ekstra prosessering for symmetriske datakrypteringsnøkler (SP 800-57 tabell 1).</p>";
      }
      out.innerHTML = h;
    }
    paint();
  };

  /* =====================================================================
     2b · Alice har Bobs private nøkkel (som H2022 6.1)
     ===================================================================== */
  var RETN = [
    { fra: "A", til: "B" }, { fra: "B", til: "A" }, { fra: "B", til: "C" },
    { fra: "C", til: "B" }, { fra: "A", til: "C" }, { fra: "C", til: "A" }
  ];
  var NAVN = { A: "Alice", B: "Bob", C: "Charlie" };
  function tyveri(r) {
    // Alice har K^A_priv (sin egen) og K^B_priv (stjålet).
    var har = ["A", "B"];
    var les = r.fra === "A" ? "selv" : (har.indexOf(r.til) >= 0 ? "ja" : "nei");
    var sig = har.indexOf(r.fra) >= 0 ? (r.fra === "A" ? "selv" : "ja") : "nei";
    var lesT = les === "selv" ? "Alice skrev meldingen selv, så hun kjenner innholdet. Tyveriet endrer ingenting."
      : les === "ja" ? "Meldingen er kryptert med " + K(r.til, "pub") + ", og Alice har " + K(r.til, "priv") + (r.til === "A" ? " (sin egen)." : " (stjålet).")
      : "Meldingen er kryptert med " + K(r.til, "pub") + ". Bare " + K(r.til, "priv") + " åpner den, og den har ikke Alice.";
    var sigT = sig === "selv" ? "Hun har alltid kunnet signere med sin egen " + K("A", "priv") + ". Trivielt sant."
      : sig === "ja" ? "Med den stjålne " + K("B", "priv") + " lager hun signaturer som ser ut som Bobs."
      : "For å signere som " + NAVN[r.fra] + " trenger hun " + K(r.fra, "priv") + ", og den har hun ikke.";
    return { les: les, sig: sig, lesT: lesT, sigT: sigT };
  }
  // Oppsummeringstabellen (alle seks retninger), bygd fra tyveri() så den alltid stemmer med fasiten
  function tyveriTabell() {
    var h = "<div class=\"table-wrap\"><table class=\"pki-tab pki-tyv\"><thead><tr><th>Melding</th><th>Kan Alice lese den?</th><th>Kan Alice signere som avsenderen?</th></tr></thead><tbody>";
    function ord(v) { return v === "nei" ? "<span class=\"nei\">Nei</span>" : v === "selv" ? "<span class=\"ok\">Ja (trivielt)</span>" : "<span class=\"ok\">Ja</span>"; }
    RETN.forEach(function (r) { var a = tyveri(r); h += "<tr><th>" + NAVN[r.fra] + " → " + NAVN[r.til] + "</th><td>" + ord(a.les) + "</td><td>" + ord(a.sig) + "</td></tr>"; });
    return h + "</tbody></table></div>";
  }
  // Ett ja/nei-spørsmål i scenarioet. Fasiten hentes fra tyveri(), så selvtesten dekker den.
  function tyvSp(r, hva, tekst, til, kit) {
    var a = tyveri(r), v = hva === "les" ? a.les : a.sig, ja = v !== "nei", forkl = hva === "les" ? a.lesT : a.sigT;
    return { tekst: tekst, valg: [
      { tekst: "Ja", til: til, poeng: ja ? 1 : -1, kit: kit, konsekvens: (ja ? "<b>Riktig.</b> " : "<b>Nei.</b> ") + forkl },
      { tekst: "Nei", til: til, poeng: ja ? -1 : 1, kit: kit, konsekvens: (ja ? "<b>Jo.</b> " : "<b>Riktig.</b> ") + forkl }
    ] };
  }
  function tyveriScenario() {
    return {
      id: "pki-tyveri",
      opphav: { type: "egen", kilder: ["d03 s. 23"], merknad: "Samme situasjon som H2022 oppgave 6.1, men som scenario" },
      tittel: "Alice har stjålet Bobs private nøkkel " + K("B", "priv") + ". Alle ser all trafikk. Svar før du ser forklaringen.",
      start: "cb",
      noder: {
        cb: tyvSp({ fra: "C", til: "B" }, "les", {
          eli5: "<p>Charlie sender Bob et brev i en boks som bare Bobs nøkkel åpner. Alice har en kopi av Bobs nøkkel. Kan hun åpne boksen?</p>",
          normal: "<p>Charlie sender en melding til Bob, kryptert med " + K("B", "pub") + ". Kan Alice lese den?</p>",
          teknisk: "<p>Charlie → Bob: c = E(m, " + K("B", "pub") + "). Alice har " + K("A", "priv") + " og " + K("B", "priv") + ". Kan hun finne m?</p>"
        }, "bc", { K: "brutt" }),
        bc: tyvSp({ fra: "B", til: "C" }, "les", "<p>Bob svarer Charlie, kryptert med " + K("C", "pub") + ". Kan Alice lese svaret?</p>", "sigB"),
        sigB: tyvSp({ fra: "B", til: "C" }, "sig", "<p>Kan Alice lage en melding til Charlie som ser ut til å være signert av Bob?</p>", "sigC", { I: "brutt" }),
        sigC: tyvSp({ fra: "C", til: "A" }, "sig", "<p>Kan Alice lage en melding som ser ut til å være signert av Charlie?</p>", "sigA"),
        sigA: tyvSp({ fra: "A", til: "C" }, "sig", "<p>Kan Alice signere en melding fra seg selv til Charlie? (Fellen fra H2022 6.1.)</p>", "tiltak"),
        tiltak: { tekst: "<p>Bob oppdager tyveriet. Hva gjør han først?</p>", valg: [
          { tekst: "Slutter å signere med " + K("B", "priv") + ", varsler mottakerne og ber CA-en tilbakekalle sertifikatet", til: "nytt", poeng: 2, kit: { I: "truet" },
            konsekvens: "<b>Riktig.</b> Signering er beskyttelse og må stoppe straks, og brukerne varsles (d03 s. 23). Tilbakekallingen (t03 O9a; RFC 5280) trekker bindingen mellom Bob og nøkkelparet tilbake, så nye forfalskninger kan avvises." },
          { tekst: "Fortsetter som før til sertifikatet går ut av seg selv", til: "nytt", poeng: -1, kit: { I: "brutt" },
            konsekvens: "<b>Nei.</b> Fram til utløpsdatoen kan Alice signere som Bob, og alle godtar det. Utløpsdatoen kommer for sent (t03 O9a)." },
          { tekst: "Bytter passordet på fila der nøkkelen ligger", til: "nytt", poeng: -1, kit: { I: "brutt" },
            konsekvens: "<b>Nei.</b> Alice har allerede en kopi av selve nøkkelen. Et nytt passord på Bobs fil endrer ingenting for hennes kopi." }
        ] },
        nytt: { tekst: "<p>Hva gjør Bob med nøkkelparet etterpå?</p>", valg: [
          { tekst: "Lager et nytt nøkkelpar og får et nytt sertifikat", til: "slutt", poeng: 1, kit: { I: "ok" },
            konsekvens: "<b>Riktig.</b> Det gamle paret er kompromittert og skal ikke beskytte noe mer. Gamle meldinger kan fortsatt dekrypteres med det gamle paret hvis policyen tillater det." },
          { tekst: "Beholder paret og ber Charlie fortsette å kryptere til " + K("B", "pub"), til: "slutt", poeng: -1, kit: { K: "brutt" },
            konsekvens: "<b>Nei.</b> Da kan Alice lese alt nytt som sendes til Bob også. Kryptering til Bob er beskyttelse med en kompromittert nøkkel." }
        ] },
        slutt: { slutt: true, oppsummering: {
          eli5: "<p>Med Bobs nøkkel kan Alice åpne det som sendes <b>til</b> Bob, og stemple som om hun var Bob. Hun kan ikke åpne det Bob sender til andre. Bob må slutte å bruke nøkkelen og få en ny.</p>" + tyveriTabell(),
          normal: "<p>Lese: bare det som sendes <b>til</b> Bob (og til Alice selv). Signere: bare <b>som</b> Bob (og som Alice selv). Det Bob sender til Charlie, er kryptert med Charlies nøkkel. Tiltak: stopp beskyttelse, varsle, tilbakekall sertifikatet og lag nytt nøkkelpar.</p>" + tyveriTabell(),
          teknisk: "<p>" + K("B", "priv") + " gir D(·) for alt kryptert med " + K("B", "pub") + " og Sig(·) i Bobs navn. Det gir ikke " + K("C", "priv") + ". I H2022 6.1 er riktige alternativer 3, 4 og 6. Alternativ 6 (Alice signerer som seg selv) er trivielt sant, og det er lett å overse (H2021 4.4, H2022 6.2). Signaturer uten klarert tidsstempel fra før kompromitteringen kan ikke lenger stoles på.</p>" + tyveriTabell()
        } }
      }
    };
  }
  IN.pkiTyveri = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "pki-viz" });
    host.appendChild(w);
    if (IN.scenario) IN.scenario(w, tyveriScenario());
  };

  /* =====================================================================
     3 · Distribusjonsproblemet (regn først)
     ===================================================================== */
  function distStolper(node, n) {
    var r = dist(n), maks = r.utenPki, out = el("div", { class: "pki-bars", "aria-label": "Antall distribusjoner for n = " + n });
    [["Symmetrisk", "n(n−1)/2 = " + n + "·" + (n - 1) + "/2", r.sym, "hemmelige (konfidensialitet)"],
     ["Offentlig, uten PKI", "n(n−1) = " + n + "·" + (n - 1), r.utenPki, "autentiske"],
     ["Med PKI", "n = " + n, r.medPki, "én rotnøkkel per node"]].forEach(function (x) {
      var pct = Math.max(0.6, 100 * x[2] / maks);
      out.appendChild(H("div", "pki-barrow", "<span class=\"pki-k\">" + x[0] + "</span><span class=\"pki-bar\" style=\"width:" + pct.toFixed(1) + "%\"></span>" +
        "<span class=\"mono\">" + x[1] + " = <b>" + tall(x[2]) + "</b></span><span class=\"muted small\">" + x[3] + "</span>"));
    });
    node.appendChild(out);
  }
  var DIST_OPPG = [
    { id: "pki-dist-sym", enhet: "nøkler", n: 12, opphav: { type: "egen", kilder: ["d03 s. 28"] },
      sporsmal: function (inn) { return "<b>" + inn.n + "</b> noder skal kunne kommunisere hemmelig to og to med <b>symmetrisk</b> krypto. Hvor mange hemmelige nøkler må distribueres?"; },
      fasit: function (inn) { return dist(inn.n).sym; },
      feil: [
        { f: function (n) { return n * (n - 1); }, hint: "Du har telt hvert par to ganger. A–B og B–A deler samme nøkkel, så del på 2. n(n−1) er antallet for offentlige nøkler uten PKI." },
        { f: function (n) { return n * n; }, hint: "n² tar med at hver node har en nøkkel med seg selv, og teller hvert par to ganger." },
        { f: function (n) { return n * (n + 1) / 2; }, hint: "Du har tatt med «par» der en node snakker med seg selv. Det er n−1 andre noder, ikke n+1." },
        { f: function (n) { return n; }, hint: "n er antallet med PKI (én rotnøkkel per node). Symmetrisk trengs én nøkkel per par." }
      ],
      forklaring: function (inn) { var n = inn.n; return {
        eli5: "<p>Hvert par venner trenger sin egen hemmelige nøkkel. Med " + n + " venner har hver av dem " + (n - 1) + " andre å snakke med. Da teller du hvert par to ganger, så du deler på 2.</p>",
        normal: "<p>Antall par blant " + n + " noder er n(n−1)/2 = " + n + "·" + (n - 1) + "/2 = <b>" + tall(dist(n).sym) + "</b>. Hver nøkkel må distribueres <b>hemmelig</b>, fordi den gir konfidensialitet (d03 s. 28).</p>",
        teknisk: "<p>Kombinasjoner: C(n, 2) = n(n−1)/2 = " + tall(dist(n).sym) + ". Veksten er kvadratisk. Offentlige nøkler uten PKI krever n(n−1) = " + tall(dist(n).utenPki) + " <i>autentiske</i> overføringer, og med PKI holder én autentisk rotnøkkel per node: n = " + n + " (d03 s. 28).</p>"
      }; } },
    { id: "pki-dist-pub", enhet: "overføringer", n: 10, opphav: { type: "egen", kilder: ["d03 s. 28"] },
      sporsmal: function (inn) { return "Nå bruker de <b>" + inn.n + "</b> nodene offentlige nøkler, men <b>uten PKI</b>. Hver node må få en autentisk kopi av den offentlige nøkkelen til hver av de andre. Hvor mange autentiske overføringer trengs?"; },
      fasit: function (inn) { return dist(inn.n).utenPki; },
      feil: [
        { f: function (n) { return n * (n - 1) / 2; }, hint: "Det er antallet symmetriske nøkler. Her får A en kopi av Bs nøkkel og B en kopi av As, så hvert par gir to overføringer." },
        { f: function (n) { return n; }, hint: "n er antallet <i>med</i> PKI: én rotnøkkel per node. Uten PKI må hver node få alle de andres nøkler." },
        { f: function (n) { return n * n; }, hint: "En node trenger ikke å få sin egen nøkkel overført. Det er n−1 andre per node." }
      ],
      forklaring: function (inn) { var n = inn.n; return {
        eli5: "<p>Hver av de " + n + " må få telefonnummeret til de " + (n - 1) + " andre fra en kilde de stoler på. Det blir " + n + " ganger " + (n - 1) + ".</p>",
        normal: "<p>Hver node trenger n−1 offentlige nøkler: n(n−1) = " + n + "·" + (n - 1) + " = <b>" + tall(dist(n).utenPki) + "</b>. De må ikke være hemmelige, men de må være <b>autentiske</b>. Med PKI holder det med én rotnøkkel per node: " + n + ".</p>",
        teknisk: "<p>Uten PKI: n(n−1) = " + tall(dist(n).utenPki) + " autentiske distribusjoner. Med PKI flyttes problemet til én autentisk rotnøkkel per klient, forhåndsinstallert i nettleseren, så veksten blir lineær (d03 s. 28).</p>"
      }; } }
  ];
  IN.pkiDistribusjon = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "pki-viz" });
    host.appendChild(w);
    if (!IN.regnForst) return;
    DIST_OPPG.forEach(function (d) {
      var sub = el("div", { class: "pki-regn" });
      w.appendChild(sub);
      IN.regnForst(sub, {
        id: d.id, opphav: d.opphav, rentTall: true, sporsmal: d.sporsmal, fasit: d.fasit, toleranse: 0, enhet: d.enhet,
        inndata: [{ navn: "n", etikett: "Antall noder n", verdi: d.n, min: 2, max: 100, steg: 1 }],
        vanligeFeil: d.feil.map(function (x) { return { verdi: function (inn) { return x.f(inn.n); }, hint: x.hint }; }),
        forklaring: d.forklaring,
        etter: function (node, inn) { distStolper(node, inn.n); }
      });
    });
  };

  /* =====================================================================
     3b · Sertifikatfelter: generering og hva signaturen dekker
     ===================================================================== */
  var RSA = { n: 33, d: 7, e: 3, h: 5 };   // leke-RSA, ikke kursstoff
  var FELT = [
    { id: "ver", navn: "Version", v: "3", hEndret: 17, ny: "1", hvorfor: "Version sier hvilken X.509-versjon sertifikatet følger. Versjon 3 har plass til Extensions." },
    { id: "ser", navn: "Serial Number", v: "0x4F2A…", hEndret: 26, ny: "0x4F2B…", hvorfor: "CA-en gir hvert sertifikat et unikt serienummer. Det er serienummeret som oppgis når sertifikatet tilbakekalles (t03 O9a; RFC 5280)." },
    { id: "alg", navn: "Algorithm Identifier", v: "ecdsa-with-SHA256", hEndret: 23, ny: "md5WithRSA", hvorfor: "Algorithm Identifier sier hvilken signaturalgoritme CA-en brukte (d03 s. 31; H2024 16 spør etter en slik algoritme)." },
    { id: "iss", navn: "Issuer", v: "Fjellvik TLS CA 2", hEndret: 11, ny: "Fjellvik TLS CA 3", hvorfor: "Issuer er navnet på CA-en som utstedte og signerte sertifikatet. Det skal være lik Subject i sertifikatet over i kjeden." },
    { id: "sub", navn: "Subject (navn + offentlig nøkkel)", v: "bibliotek.lerkedal.no · ECC P-256 04:9B:…", hEndret: 20, ny: "bibliotek.lerkedal.no · 04:E1:… (angriperens nøkkel)", hvorfor: "Subject har navnet og den <b>offentlige</b> nøkkelen. Det er denne bindingen sertifikatet garanterer (d03 s. 31)." },
    { id: "val", navn: "Validity", v: "15.09.2026–14.12.2026", hEndret: 8, ny: "15.09.2026–14.12.2027", hvorfor: "Validity er perioden sertifikatet er gyldig. Den er dekket av signaturen, så den kan ikke forlenges i ettertid." },
    { id: "ext", navn: "Extensions", v: "SAN bibliotek.lerkedal.no · keyUsage digitalSignature · CA = false", hEndret: 29, ny: "SAN … · CA = true", hvorfor: "Extensions har blant annet alternative domenenavn (SAN), lov bruk av nøkkelen og om subjektet er en CA." }
  ];
  function sigOf(h) { return modpow(h, RSA.d, RSA.n); }
  function verOf(s) { return modpow(s, RSA.e, RSA.n); }

  function kortTabell(opts) {
    // opts: { rec: bool, sig: "tom"|"S", endret: id|null, klikk: fn(id) }
    var tab = el("table", { class: "pki-tab pki-cert" + (opts.rec ? " rec" : "") });
    var tb = el("tbody");
    FELT.forEach(function (f) {
      var endret = opts.endret === f.id;
      var tr = el("tr", { class: "pki-f" + (endret ? " endret" : "") + (opts.rec ? " i-rec" : "") });
      var th = H("th", null, f.navn);
      var td = H("td", "mono", endret ? f.ny : f.v);
      if (opts.klikk) {
        var b = btn(endret ? "Angre" : "Endre", function () { opts.klikk(f.id); }, "pki-mini");
        b.setAttribute("aria-label", (endret ? "Angre endring i " : "Endre ") + f.navn);
        td.appendChild(document.createTextNode(" ")); td.appendChild(b);
      }
      tr.appendChild(th); tr.appendChild(td); tb.appendChild(tr);
    });
    var trS = el("tr", { class: "pki-f pki-sigrad" });
    trS.appendChild(H("th", null, "Digital Signature"));
    var tdS = H("td", "mono", opts.sig === "S" ? "S = " + sigOf(RSA.h) + " <span class=\"muted small\">(ekte: 30:45:…)</span>" : "<span class=\"muted\">(tom)</span>");
    if (opts.klikk) {
      var bs = btn("Endre", function () { opts.klikk("sig"); }, "pki-mini");
      tdS.appendChild(document.createTextNode(" ")); tdS.appendChild(bs);
    }
    trS.appendChild(tdS); tb.appendChild(trS);
    tab.appendChild(tb);
    return tab;
  }

  // Fyll-ut-oppgaven: verdiene skal i riktig felt. To distraktorer hører ikke hjemme i sertifikatet.
  var FELT_OPPG = {
    id: "pki-felter",
    opphav: { type: "egen", kilder: ["d03 s. 31", "d03 s. 34"] },
    prompt: {
      eli5: "Sertifikatet for bibliotek.lerkedal.no er tomt. Legg hver opplysning i riktig felt. To av lappene hører ikke hjemme i sertifikatet i det hele tatt.",
      normal: "Fyll ut X.509-sertifikatet for bibliotek.lerkedal.no: legg hver verdi i feltet den hører til. To verdier står ikke i et sertifikat.",
      teknisk: "Plasser verdiene i X.509-feltene (d03 s. 31). Signaturfeltet holder S = Sig(Hash(Rec), " + K("CA", "priv") + "). To verdier skal i «Står ikke i sertifikatet»."
    },
    zones: FELT.map(function (f) { return { id: f.id, label: f.navn }; }).concat([
      { id: "sig", label: "Digital Signature" },
      { id: "ikke", label: "Står ikke i sertifikatet" }
    ]),
    items: FELT.map(function (f) {
      return { id: "v-" + f.id, html: "<span class=\"mono\">" + f.v + "</span>", forklaring: f.hvorfor };
    }).concat([
      { id: "v-sig", html: "<span class=\"mono\">Sig(Hash(Rec), " + K("CA", "priv") + ")</span>",
        forklaring: "CA-en signerer hashen av alle de andre feltene med sin private nøkkel (d03 s. 34). Selve nøkkelen står ikke der, bare signaturen." },
      { id: "x-priv", html: "Bibliotekets private nøkkel",
        forklaring: "Private nøkler står aldri i et sertifikat. Bare den offentlige nøkkelen står i Subject (H2021 4.4, H2022 6.4)." },
      { id: "x-capriv", html: "Den private nøkkelen til Fjellvik TLS CA 2",
        forklaring: "CA-en <i>bruker</i> sin private nøkkel til å signere, men den står ikke i sertifikatet. Felle: «brukes til signering av subjektsertifikater» → ingen sertifikater (H2021 4.4, H2022 6.2)." }
    ]),
    answer: (function () {
      var a = { "v-sig": "sig", "x-priv": "ikke", "x-capriv": "ikke" };
      FELT.forEach(function (f) { a["v-" + f.id] = f.id; });
      return a;
    })(),
    regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 5 },
    oppsummering: "<p>Signaturen dekker alle feltene unntatt seg selv. Sertifikatet binder navnet og den <b>offentlige</b> nøkkelen sammen. Ingen private nøkler står i det. Under ser du hvordan CA-en lager signaturen, og hva som skjer hvis noen endrer et felt.</p>",
    kilde: { ref: "d03 s. 31 og 34", egneOrd: true }
  };

  IN.pkiFelter = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "pki-viz" });
    var oppg = el("div");
    w.appendChild(oppg);
    // Fasitdelen (generering og validering) bygges først når studenten har sjekket svaret, eller ber om det.
    var gate = el("div", { class: "pki-gate" });
    var gateTxt = H("p", "pki-note", "Fyll ut feltene og trykk «Sjekk svar». Da vises det ferdige sertifikatet, hvordan CA-en signerer det, og hva signaturen dekker.");
    var bVis = btn("Vis fasit uten å sjekke", function () { aapne(); });
    gate.appendChild(gateTxt); gate.appendChild(el("div", { class: "pki-row" }, [bVis]));
    w.appendChild(gate);
    var fasit = el("div", { class: "pki-fasit", hidden: true });
    w.appendChild(fasit);
    host.appendChild(w);

    var bygd = false;
    function aapne() {
      gate.hidden = true; fasit.hidden = false;
      if (!bygd) { bygd = true; byggFasit(); }
    }
    var h = IN.bucketTask ? IN.bucketTask(oppg, FELT_OPPG, {
      instant: false,
      report: function (c, p) {
        if (IN.progress && IN.progress.solved) {
          if (p && p.maks) IN.progress.solved("dra", FELT_OPPG.id, p.poeng, p.maks);
          else IN.progress.solved("dra", FELT_OPPG.id, c.right, c.total);
        }
        aapne();
      }
    }) : null;
    // Allerede sjekket i en tidligere økt (lagret tilstand): vis fasitdelen med en gang.
    if (!h || (h.el && h.el.querySelector(".ov-sum"))) aapne();

    function byggFasit() {
      var gen = el("div", { class: "pki-sp" });
      fasit.appendChild(H("h5", "pki-h", "CA-en lager sertifikatet"));
      fasit.appendChild(gen);
      fasit.appendChild(H("h5", "pki-h", "Nettleseren validerer: hva dekker signaturen?"));
      var val = el("div");
      fasit.appendChild(val);

      var S1 = sigOf(RSA.h);
      var STEG = [
        { rec: false, sig: "tom", vis: "", text: { eli5: "Her er alle opplysningene om nettstedet, men ingen stempel ennå.",
            normal: "Sertifikatet for bibliotek.lerkedal.no med de åtte feltene. Signaturfeltet er tomt.",
            teknisk: "Feltene fra d03 s. 31. Subject har navnet og den <b>offentlige</b> nøkkelen. Den private nøkkelen er ikke med, og blir aldri det." } },
        { rec: true, sig: "tom", vis: "Rec = de sju første feltene",
          spor: { sporsmal: "Hvilke felt samler CA-en i recorden Rec som skal signeres?", valg: ["Alle unntatt signaturfeltet", "Bare Subject (navn og offentlig nøkkel)", "Alle, også signaturfeltet"], fasit: 0,
            forklaring: "Rec er alle feltene unntatt signaturen. Derfor kan ingen av dem endres uten at det oppdages." },
          text: { eli5: "Alt unntatt stempelfeltet legges i én bunke.",
            normal: "Steg 1: CA-en samler alle feltene unntatt signaturen i en record Rec.",
            teknisk: "Rec omfatter også Validity, Issuer og Extensions. Derfor kan ingen av dem endres uten at signaturen slutter å stemme." } },
        { rec: true, sig: "tom", vis: "H = Hash(Rec) = " + RSA.h, text: { eli5: "Bunken kjøres gjennom en kvern som lager et kort fingeravtrykk.",
            normal: "Steg 2: H = Hash(Rec). I leketøyet her sier vi at H = " + RSA.h + ".",
            teknisk: "Hashen gjør at signaturen blir kort uansett hvor stor recorden er. Endres én bit i Rec, blir H en helt annen verdi." } },
        { rec: true, sig: "tom", vis: "S = Sig(H, " + K("CA", "priv") + ") = " + RSA.h + "<sup>" + RSA.d + "</sup> mod " + RSA.n + " = " + S1,
          spor: { sporsmal: "Hvilken nøkkel signerer H?", valg: ["Bibliotekets private nøkkel", "Den private nøkkelen til Fjellvik TLS CA 2", "Den offentlige nøkkelen til Fjellvik TLS CA 2"], fasit: 1,
            forklaring: "Utstederens (CA-ens) private nøkkel signerer. Nettleseren sjekker med CA-ens offentlige nøkkel." },
          text: {
            eli5: "Kontoret stempler fingeravtrykket med sitt hemmelige stempel.",
            normal: "Steg 3: S = Sig(H, " + K("CA", "priv") + "). Det er CA-ens private nøkkel som signerer, ikke subjektets og ikke «sertifikatet».",
            teknisk: "Leke-RSA i stedet for ECDSA, for å vise prinsippet. Fjellvik TLS CA 2: modul 33, privat eksponent 7, offentlig eksponent 3 (3 · 7 = 21 ≡ 1 mod 20). " + RSA.h + "<sup>7</sup> mod 33 = " + S1 + ". d03 skriver det som Sig[H, Kpriv(CA)]." } },
        { rec: true, sig: "S", vis: "S legges inn i signaturfeltet", text: { eli5: "Stempelet festes på arket. Nå er sertifikatet ferdig.",
            normal: "Steg 4: S legges til recorden. Sertifikatet er ferdig og kan sendes til hvem som helst.",
            teknisk: "Signaturfeltet selv er ikke med i Rec. Det kan ikke dekke seg selv." } }
      ];
      IN.stepPlayer(gen, {
        initial: [0], customInput: false,
        generate: function () { return STEG; },
        render: function (st, ctx) {
          var stage = ctx.stage;
          clear(stage);
          var box = el("div", { class: "pki-genstage" });
          box.appendChild(kortTabell({ rec: st.rec, sig: st.sig }));
          if (st.vis) box.appendChild(H("p", "pki-calc mono", st.vis));
          box.appendChild(H("p", "pki-note", "Privat nøkkel: finnes ikke i sertifikatet."));
          stage.appendChild(box);
        }
      });

      var endret = null;
      function paintVal() {
        clear(val);
        val.appendChild(H("p", "small muted", "Endre ett felt, slik en angriper ville gjort, og se hva nettleseren regner ut. Tallene er leke-RSA, ikke ekte størrelser."));
        val.appendChild(el("div", { class: "table-wrap" }, [kortTabell({ rec: true, sig: "S", endret: endret === "sig" ? null : endret,
          klikk: function (id) { endret = endret === id ? null : id; paintVal(); } })]));
        var out = H("div", "pki-out");
        if (endret === "sig") {
          out.innerHTML = "<p><b>Signaturfeltet</b> dekkes ikke av seg selv. Alle de andre feltene dekkes. Bytter angriperen ut S, stemmer Ver(S′, " + K("CA", "pub") +
            ") ikke med Hash(Rec), og uten " + K("CA", "priv") + " kan han ikke lage en S′ som passer.</p>";
        } else {
          var f = FELT.filter(function (x) { return x.id === endret; })[0];
          var hP = f ? f.hEndret : RSA.h, ver = verOf(S1), ok = ver === hP;
          out.innerHTML = "<p class=\"mono\">Ver(S, " + K("CA", "pub") + ") = " + S1 + "<sup>" + RSA.e + "</sup> mod " + RSA.n + " = " + ver + "</p>" +
            "<p class=\"mono\">H′ = Hash(Rec′) = " + hP + (f ? " <span class=\"muted\">(" + f.navn + " er endret)</span>" : "") + "</p>" +
            "<p class=\"" + (ok ? "ok" : "nei") + "\"><b>" + ver + (ok ? " = " : " ≠ ") + hP + "</b>: " +
            (ok ? "sertifikatet godtas ✓. Ingen felt er endret." : "sertifikatet avvises ✗. Signaturen dekker " + f.navn + ", så endringen avsløres.") + "</p>";
        }
        val.appendChild(out);
      }
      paintVal();
    }
  };

  /* =====================================================================
     4 · Sertifikatkjeden (hovedviz)
     ===================================================================== */
  var BASE = {
    store: [
      { navn: "Fjellvik Root R1", key: "R1" }, { navn: "Nordkapp Root CA", key: "NK" },
      { navn: "Polar Trust Root G2", key: "PT" }, { navn: "Havbris Global Root", key: "HB" }
    ],
    certs: [
      { rolle: "Rotsertifikat", kort: "R1", subject: "Fjellvik Root R1", issuer: "Fjellvik Root R1", from: "2020-01-01", to: "2044-12-31",
        key: "R1", signedBy: "R1", ca: true, alg: "ECC P-384", sigalg: "ecdsa-with-SHA384", serial: "0x01" },
      { rolle: "Mellomliggende CA-sertifikat", kort: "CA2", subject: "Fjellvik TLS CA 2", issuer: "Fjellvik Root R1", from: "2024-03-01", to: "2031-02-28",
        key: "CA2", signedBy: "R1", ca: true, alg: "ECC P-256", sigalg: "ecdsa-with-SHA384", serial: "0x2B" },
      { rolle: "Subjektsertifikat", kort: "bib", subject: "bibliotek.lerkedal.no", issuer: "Fjellvik TLS CA 2", from: "2026-09-15", to: "2026-12-14",
        key: "BIB", signedBy: "CA2", ca: false, alg: "ECC P-256", sigalg: "ecdsa-with-SHA256", serial: "0x4F2A" }
    ],
    date: "2026-12-03", url: "bibliotek.lerkedal.no"
  };
  var NOKKEL = { R1: "Fjellvik Root R1", R1x: "en ukjent «Fjellvik Root R1» (annen nøkkel)", CA2: "Fjellvik TLS CA 2", CA3: "Fjellvik TLS CA 3", BIB: "bibliotek.lerkedal.no", PH: "bibliotek-lerkedal.no" };
  var REVOK = { dato: "2026-11-01", grunn: "nøkkelkompromittering" };
  var SCEN = [
    { id: "ok", navn: "1 · Alt i orden", f: function () {} },
    { id: "utlopt-subj", navn: "2 · Utløpt subjekt", f: function (D) { D.date = "2026-12-20"; } },
    { id: "utlopt-ca", navn: "3 · Utløpt mellomliggende", f: function (D) { D.certs[1].to = "2026-11-30"; } },
    { id: "revok-ca", navn: "4 · Tilbakekalt mellomliggende", status: true, f: function (D) { D.certs[1].revoked = copy(REVOK); } },
    { id: "feil-utsteder", navn: "5 · Feil utsteder", f: function (D) { D.certs[2].issuer = "Fjellvik TLS CA 3"; D.certs[2].signedBy = "CA3"; } },
    { id: "endret", navn: "6 · Endret felt", f: function (D) { D.certs[2].tampered = "Validity"; D.certs[2].to = "2027-12-14"; } },
    { id: "ukjent-rot", navn: "7 · Ukjent rot", f: function (D) { D.certs[0].key = "R1x"; D.certs[0].signedBy = "R1x"; D.certs[1].signedBy = "R1x"; } },
    { id: "feil-domene", navn: "8 · Feil domene", f: function (D) { D.url = "bibliotek-lerkedal.no"; } },
    { id: "phishing", navn: "8b · Phishing med ekte sertifikat", f: function (D) {
        D.url = "bibliotek-lerkedal.no"; D.certs[2].subject = "bibliotek-lerkedal.no"; D.certs[2].key = "PH"; D.certs[2].serial = "0x7C11"; D.certs[2].from = "2026-11-20"; D.certs[2].to = "2027-02-18"; } },
    { id: "revok-subj", navn: "Tilbakekalt subjekt", status: true, f: function (D) { D.certs[2].revoked = copy(REVOK); } }
  ];
  var FORVENTET = { "ok": null, "utlopt-subj": "7", "utlopt-ca": "4", "revok-ca": "4b", "feil-utsteder": "5", "endret": "6",
    "ukjent-rot": "1", "feil-domene": "8", "phishing": null, "revok-subj": "7b" };

  function lagData(id) {
    var D = copy(BASE), sc = SCEN.filter(function (s) { return s.id === id; })[0] || SCEN[0];
    sc.f(D);
    return D;
  }

  // Valideringsstegene for en kjede D med statusmetode m ("ocsp" | "stifting" | "ingen")
  function stegFor(D, m) {
    var r = D.certs[0], c = D.certs[1], s = D.certs[2], out = [];
    function add(id, kort, q, ok, ja, nei, skip) { out.push({ id: id, kort: kort, q: q, ok: !!ok, ja: ja, nei: nei, skip: !!skip }); }
    function status(id, kort, cert, utsteder) {
      if (m === "ingen") { add(id, kort, "Status: er «" + cert.subject + "» tilbakekalt?", true, "Ikke sjekket (statussjekk er slått av).", "", true); return; }
      var rev = cert.revoked && dnum(cert.revoked.dato) <= dnum(D.date);
      var kilde = m === "ocsp" ? "Nettleseren spurte " + utsteder + " (OCSP)." : "Et ferskt, signert statussvar fra " + utsteder + " fulgte med fra tjeneren (stifting).";
      add(id, kort, "Status: er «" + cert.subject + "» tilbakekalt?", !rev, "Nei. " + kilde,
        rev ? "Ja: tilbakekalt " + fmt(cert.revoked.dato) + ", grunn: " + cert.revoked.grunn + ". " + kilde : "");
    }
    var iLager = D.store.filter(function (x) { return x.navn === r.subject; })[0];
    var rotOk = !!iLager && iLager.key === r.key && r.issuer === r.subject && r.signedBy === r.key;
    add("1", 0, "Finnes «" + r.subject + "» i nettleserens rotlager?", rotOk,
      "Ja. Roten er tillitsanker. Selvsignaturen sjekkes ikke mot noe over seg: tilliten er at roten ligger i lageret.",
      iLager ? "Nei. Sertifikatet heter «" + r.subject + "» og er selvsignert, men nøkkelen er ikke den som ligger i lageret. Selvsignert, men ikke i lageret: det gir ingen sikkerhet."
        : "Nei. Roten finnes ikke i lageret.");
    add("2", 1, "Issuer på «" + c.subject + "» = Subject på roten?", c.issuer === r.subject,
      "Ja: «" + c.issuer + "».", "Nei: Issuer er «" + c.issuer + "», men roten heter «" + r.subject + "».");
    add("3", 1, "Ver(S<sub>CA2</sub>, " + K("R1", "pub") + ") = Hash(Rec<sub>CA2</sub>)?", c.signedBy === r.key && !c.tampered,
      "Ja. Signaturen er laget med rotens private nøkkel, og ingen felt er endret.",
      c.tampered ? "Nei. Et felt er endret etter signeringen." : "Nei. Signaturen er laget med en annen privat nøkkel.");
    add("4", 1, fmt(D.date) + " innenfor " + fmt(c.from) + "–" + fmt(c.to) + ", og CA = true?", within(D.date, c.from, c.to) && c.ca,
      "Ja.", !c.ca ? "Nei: sertifikatet er ikke markert som CA." : (dnum(D.date) < dnum(c.from) ? "Nei: ikke gyldig før " + fmt(c.from) + "." : "Nei: gyldig til " + fmt(c.to) + "."));
    status("4b", 1, c, r.subject);
    add("5", 2, "Issuer på «" + s.subject + "» = «" + c.subject + "»?", s.issuer === c.subject,
      "Ja.", "Nei: Issuer er «" + s.issuer + "». Issuer stemmer ikke med Subject i sertifikatet over.");
    add("6", 2, "Ver(S<sub>bib</sub>, " + K("CA2", "pub") + ") = Hash(Rec<sub>bib</sub>)?", s.signedBy === c.key && !s.tampered,
      "Ja. Signaturen er laget med den private nøkkelen til " + c.subject + ".",
      s.tampered ? "Nei. Feltet " + s.tampered + " er endret, så Hash(Rec′) ≠ Ver(S, " + K("CA2", "pub") + ")."
        : "Nei. Signaturen er laget med en annen privat nøkkel (" + (NOKKEL[s.signedBy] || s.signedBy) + ").");
    add("7", 2, fmt(D.date) + " innenfor " + fmt(s.from) + "–" + fmt(s.to) + "?", within(D.date, s.from, s.to),
      "Ja.", dnum(D.date) < dnum(s.from) ? "Nei: ikke gyldig før " + fmt(s.from) + "." : "Nei: gyldig til " + fmt(s.to) + ".");
    status("7b", 2, s, c.subject);
    add("8", 2, "Domenet i adresselinjen = «" + s.subject + "»?", D.url === s.subject,
      "Ja: " + D.url + ".", "Nei: adresselinjen viser «" + D.url + "», men sertifikatet gjelder «" + s.subject + "».");
    return out;
  }
  function forsteFeil(steg) { for (var i = 0; i < steg.length; i++) if (!steg[i].ok) return i; return -1; }

  IN.pkiKjede = function (host, opts) {
    host = host$(host); if (!host) return;
    opts = opts || {};
    clear(host);
    var scenListe = opts.scen ? SCEN.filter(function (s) { return opts.scen.indexOf(s.id) >= 0; }) : SCEN.filter(function (s) { return s.id !== "revok-subj"; });
    var st = { scen: opts.start || scenListe[0].id, D: null, m: opts.status || "ocsp", pos: 0, force: false, valgt: 2, oppg: null, gjett: null };
    st.D = lagData(st.scen);

    var w = el("div", { class: "pki-viz pki-kjede" });
    // Scenarioknapper
    var scRow = el("div", { class: "pki-row pki-scen", role: "group", "aria-label": "Scenario" });
    scRow.appendChild(el("span", { class: "pki-k", text: "Scenario:" }));
    var scBtn = {};
    scenListe.forEach(function (s) {
      var b = btn(s.navn, function () { velg(s.id); });
      scBtn[s.id] = b; scRow.appendChild(b);
    });
    w.appendChild(scRow);
    // Dato, adresse, statusmetode
    var dato = el("input", { type: "date", class: "pki-inp", "aria-label": "Dagens dato" });
    var adr = el("input", { type: "text", class: "pki-inp pki-adr mono", spellcheck: "false", "aria-label": "Adresselinjen" });
    dato.addEventListener("change", function () { if (/^\d{4}-\d{2}-\d{2}$/.test(dato.value)) { st.D.date = dato.value; nullstill(); } });
    adr.addEventListener("change", function () { st.D.url = adr.value.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim().toLowerCase().replace(/[^a-z0-9.\-æøå]/g, "").slice(0, 80); nullstill(); });
    w.appendChild(el("div", { class: "pki-row" }, [
      el("label", { class: "pki-lbl" }, [el("span", { class: "pki-k", text: "I dag:" }), dato]),
      el("label", { class: "pki-lbl" }, [el("span", { class: "pki-k", text: "Adresselinje: https://" }), adr])
    ]));
    var mRow = el("div", { class: "pki-row", role: "group", "aria-label": "Statussjekk" });
    mRow.appendChild(el("span", { class: "pki-k", text: "Statussjekk:" }));
    var mBtn = {};
    [["ocsp", "OCSP (nettleseren spør CA-en)"], ["stifting", "OCSP-stifting"], ["ingen", "Ingen sjekk"]].forEach(function (p) {
      var b = btn(p[1], function () { st.m = p[0]; nullstill(); }); mBtn[p[0]] = b; mRow.appendChild(b);
    });
    w.appendChild(mRow);
    var mNote = H("p", "pki-note");
    w.appendChild(mNote);

    // Rotlager + kjede
    var lay = el("div", { class: "pki-lay" });
    var lager = el("div", { class: "pki-lager" });
    var kjede = el("div", { class: "pki-chain" });
    lay.appendChild(lager); lay.appendChild(kjede);
    w.appendChild(lay);

    // Kontroller
    var bNeste = btn("Valider ett steg →", function () { neste(); }, "primary");
    var bAlle = btn("Valider alt", function () { alle(); });
    var bTving = btn("Tving videre", function () { st.force = true; neste(); });
    var bNy = btn("↺ Start på nytt", function () { nullstill(); });
    var bOppg = btn("Oppgave: finn feilen", function () { oppgave(); });
    w.appendChild(el("div", { class: "pki-row pki-ctl" }, [bNeste, bAlle, bTving, bNy, bOppg]));
    var oppgTxt = H("p", "pki-out");
    w.appendChild(oppgTxt);
    var liste = el("ol", { class: "pki-steps" });
    w.appendChild(liste);
    var msg = H("div", "pki-out pki-msg", "");
    w.appendChild(msg);
    var detalj = el("div", { class: "pki-detalj" });
    w.appendChild(detalj);
    host.appendChild(w);

    function velg(id) { st.scen = id; st.D = lagData(id); st.oppg = null; st.gjett = null; oppgTxt.innerHTML = "";
      var sc = SCEN.filter(function (s) { return s.id === id; })[0];
      if (sc && sc.status && st.m === "ingen" && !opts.status) st.m = "ocsp";
      nullstill(); }
    function nullstill() { st.pos = 0; st.force = false; paint(); }
    function steg() { return stegFor(st.D, st.m); }
    function neste() {
      var S2 = steg(), ff = forsteFeil(S2);
      if (st.pos >= S2.length) return;
      if (!st.force && ff >= 0 && st.pos > ff) return;
      st.pos++; paint();
    }
    function alle() {
      var S2 = steg(), ff = forsteFeil(S2);
      st.pos = (st.force || ff < 0) ? S2.length : ff + 1; paint();
    }
    function oppgave() {
      var kand = scenListe.filter(function (s) { return FORVENTET[s.id]; });
      if (!kand.length) return;
      var s = kand[Math.floor(Math.random() * kand.length)];
      st.scen = s.id; st.D = lagData(s.id); st.oppg = s.id; st.gjett = null;
      if (s.status && st.m === "ingen") st.m = "ocsp";
      st.pos = 0; st.force = false;
      oppgTxt.innerHTML = "<b>Oppgave:</b> et ukjent scenario er lastet. Se på kortene, datoen og adresselinjen, og klikk på steget du tror feiler. Så valideres kjeden.";
      oppgTxt.className = "pki-out";
      paint();
    }
    function gjett(i) {
      if (!st.oppg || st.gjett != null) return;
      var S2 = steg(), ff = forsteFeil(S2);
      st.gjett = i; st.pos = ff + 1;
      var sc = SCEN.filter(function (s) { return s.id === st.oppg; })[0];
      var rett = S2[i].id === S2[ff].id;
      oppgTxt.innerHTML = (rett ? "<b>Riktig.</b> " : "<b>Ikke helt.</b> Du valgte steg " + S2[i].id + ", men ") + "steg " + S2[ff].id + " feiler. Scenarioet var «" + sc.navn + "».";
      oppgTxt.className = "pki-out " + (rett ? "ok" : "nei");
      paint();
    }

    function kortState(k, S2, ff) {
      var idx = []; S2.forEach(function (s, i) { if (s.kort === k) idx.push(i); });
      var forste = idx[0], siste = idx[idx.length - 1];
      for (var j = 0; j < idx.length; j++) if (idx[j] < st.pos && !S2[idx[j]].ok) return "bad";
      if (ff >= 0 && ff < forste && st.pos > ff) return "grey";
      if (st.pos > siste) return "ok";
      return "";
    }

    function paint() {
      var D = st.D, S2 = steg(), ff = forsteFeil(S2);
      Object.keys(scBtn).forEach(function (k) { press(scBtn[k], !st.oppg && k === st.scen); });
      Object.keys(mBtn).forEach(function (k) { press(mBtn[k], k === st.m); });
      dato.value = D.date; adr.value = D.url;
      var subj = D.certs[2];
      mNote.innerHTML = st.m === "ocsp" ? "OCSP: nettleseren spør CA-en om status. <b>CA-en ser da at du besøker " + D.url + "</b>. Det er personvernproblemet (t03 O9b). I dag spør nettleserne sjelden CA-en direkte: CRL er påbudt og OCSP valgfritt (CA/B Forum 2024). Kursets modell er fra t03."
        : st.m === "stifting" ? "Stifting: tjeneren legger ved et ferskt statussvar som CA-en (eller dens OCSP-responder) har signert. Nettleseren slipper å spørre, og CA-en ser ikke hvor du surfer (t03 O6c, O9b)."
        : "Ingen statussjekk: et tilbakekalt sertifikat blir ikke oppdaget.";
      mNote.innerHTML += " <span class=\"muted small\">Statussjekk står i t03 (2025), ikke på 2026-lysarket.</span>";

      // Rotlager
      clear(lager);
      lager.appendChild(H("div", "pki-lager-h", "Nettleserens rotlager"));
      var rot = D.certs[0];
      D.store.forEach(function (x) {
        var treff = x.navn === rot.subject, ekte = treff && x.key === rot.key;
        lager.appendChild(H("div", "pki-lager-r" + (ekte ? " treff" : treff ? " mismatch" : ""), x.navn + (ekte ? " <span class=\"small\">← roten i kjeden</span>" : treff ? " <span class=\"small\">← samme navn, annen nøkkel</span>" : "")));
      });

      // Kjeden
      clear(kjede);
      D.certs.forEach(function (c, k) {
        if (k > 0) {
          var signer = NOKKEL[c.signedBy] || c.signedBy;
          kjede.appendChild(H("div", "pki-pil", "↓ signert med den private nøkkelen til " + signer));
        }
        var ks = kortState(k, S2, ff);
        var kort = el("button", { type: "button", class: "pki-card " + ks + (st.valgt === k ? " valgt" : ""), "aria-pressed": st.valgt === k ? "true" : "false",
          onclick: function () { st.valgt = k; paint(); } });
        var tag = ks === "ok" ? "✓" : ks === "bad" ? "✗" : ks === "grey" ? "arver ingen tillit" : "";
        kort.innerHTML = "<span class=\"pki-card-r\">" + c.rolle + (tag ? " · <b>" + tag + "</b>" : "") + "</span>" +
          "<span class=\"pki-card-s\">" + c.subject + "</span>" +
          "<span class=\"pki-card-m\">Issuer: " + c.issuer + (k === 0 && c.issuer === c.subject ? " (selvsignert)" : "") + "</span>" +
          "<span class=\"pki-card-m\">Gyldig " + fmt(c.from) + "–" + fmt(c.to) + " · CA = " + (c.ca ? "true" : "false") + "</span>" +
          (c.tampered ? "<span class=\"pki-card-m pki-varsel\">Feltet " + c.tampered + " er endret etter signering</span>" : "") +
          (c.revoked && st.m !== "ingen" && dnum(c.revoked.dato) <= dnum(D.date) ? "<span class=\"pki-card-m pki-varsel\">Status: tilbakekalt " + fmt(c.revoked.dato) + " (" + c.revoked.grunn + ")</span>" : "") +
          (k === 2 && st.m === "stifting" ? "<span class=\"pki-card-m pki-stift " + (c.revoked && dnum(c.revoked.dato) <= dnum(D.date) ? "nei" : "ok") + "\">Stift: statussvar " + fmt(D.date) + " 06:00 · " +
            (c.revoked && dnum(c.revoked.dato) <= dnum(D.date) ? "revokert" : "gyldig") + "</span>" : "");
        kjede.appendChild(kort);
      });

      // Stegliste
      clear(liste);
      var stoppet = !st.force && ff >= 0 && st.pos > ff;
      S2.forEach(function (s, i) {
        var cls = "", ikon = "·", tekst = "";
        if (i < st.pos) {
          if (s.skip) { cls = "skip"; ikon = "–"; tekst = s.ja; }
          else if (s.ok) { cls = "ok"; ikon = "✓"; tekst = s.ja; }
          else { cls = "bad"; ikon = "✗"; tekst = s.nei; }
          if (st.force && ff >= 0 && i > ff) tekst += " <span class=\"muted small\">(tvunget videre: tilliten er allerede brutt)</span>";
        } else if (stoppet) { cls = "grey"; ikon = "·"; tekst = "arver ingen tillit"; }
        var li = el("li", { class: "pki-step " + cls + (st.gjett === i ? " gjett" : "") });
        var hode = "<span class=\"pki-ikon\" aria-hidden=\"true\">" + ikon + "</span><span class=\"pki-snr\">Steg " + s.id + "</span> " + s.q;
        if (st.oppg && st.gjett == null) {
          var b = el("button", { type: "button", class: "pki-stepbtn", html: hode, onclick: function () { gjett(i); } });
          li.appendChild(b);
        } else li.appendChild(H("div", "pki-step-q", hode));
        if (tekst) li.appendChild(H("div", "pki-step-a", tekst));
        liste.appendChild(li);
      });

      // Knapper
      bNeste.disabled = !!(st.oppg && st.gjett == null) || st.pos >= S2.length || stoppet;
      bAlle.disabled = bNeste.disabled;
      bTving.hidden = !stoppet || ff >= S2.length - 1;

      // Melding
      var ferdig = st.pos >= S2.length && (ff < 0 || st.force);
      var h = "";
      if (ff >= 0 && st.pos > ff) {
        h = "<p class=\"nei\"><b>Valideringen feiler i steg " + S2[ff].id + ".</b> Nettleseren godtar ikke sertifikatet" + (S2[ff].kort < 2 ? ", og alt under leddet som feilet, arver ingen tillit." : ".") + "</p>";
        if (st.scen === "feil-utsteder" && !st.force) h += "<p class=\"small muted\">Prøv «Tving videre»: også steg 6 feiler, fordi signaturen er laget med en annen privat nøkkel.</p>";
      } else if (ferdig) {
        h = st.scen === "phishing" && D.url === "bibliotek-lerkedal.no"
          ? "<p class=\"ok\"><b>Alle steg er grønne for bibliotek-lerkedal.no.</b> Sertifikatet er ekte og gyldig for <i>det</i> domenet. Men det er ikke biblioteket: domenenavnet er autentisk, nettstedet er upålitelig. Det er tillitsforvirring, og bare en bruker som kjenner det riktige navnet, kan oppdage det (fane 5).</p>"
          : "<p class=\"ok\"><b>Alle steg er grønne.</b> Domenenavnet er autentisk. Det sier ingenting om hvorvidt nettstedet er pålitelig.</p>";
        var rev = D.certs.some(function (c) { return c.revoked && dnum(c.revoked.dato) <= dnum(D.date); });
        if (st.m === "ingen" && rev) h += "<p class=\"nei\"><b>Alt ble grønt selv om et sertifikat er tilbakekalt.</b> Derfor trengs revokeringssjekk.</p>";
      }
      msg.innerHTML = h;

      // Detalj for valgt kort
      clear(detalj);
      var c = D.certs[st.valgt], over = st.valgt > 0 ? D.certs[st.valgt - 1] : null;
      detalj.appendChild(H("h5", "pki-h", "Feltene i «" + c.subject + "»"));
      var tab = el("table", { class: "pki-tab pki-cert" }), tb = el("tbody");
      var issOk = over ? c.issuer === over.subject : c.issuer === c.subject;
      var rader = [
        ["Version", "3"], ["Serial Number", c.serial], ["Algorithm Identifier", c.sigalg],
        ["Issuer", c.issuer + " <span class=\"small " + (issOk ? "ok" : "nei") + "\">" + (over ? (issOk ? "= Subject i kortet over ✓" : "≠ Subject i kortet over («" + over.subject + "») ✗") : (issOk ? "= Subject: selvsignert" : "")) + "</span>", "iss"],
        ["Subject", c.subject + " · " + c.alg + " (offentlig nøkkel)", "sub"],
        ["Validity", fmt(c.from) + "–" + fmt(c.to), "val"],
        ["Extensions", "CA = " + (c.ca ? "true" : "false") + (st.valgt === 2 ? " · SAN " + c.subject + " · keyUsage digitalSignature" : " · keyUsage keyCertSign")],
        ["Digital Signature", "laget med den private nøkkelen til " + (NOKKEL[c.signedBy] || c.signedBy)]
      ];
      rader.forEach(function (r) {
        var tr = el("tr", { class: r[2] === "iss" || r[2] === "sub" ? "hl" : "" });
        tr.appendChild(H("th", null, r[0])); tr.appendChild(H("td", "mono", r[1]));
        if (st.valgt === 2 && (r[2] === "val" || r[2] === "sub") && !st.oppg) {
          var b = btn(c.tampered ? "Angre endring" : "Endre", function () { endre(r[2]); }, "pki-mini");
          tr.lastChild.appendChild(document.createTextNode(" ")); tr.lastChild.appendChild(b);
        }
        tb.appendChild(tr);
      });
      tab.appendChild(tb);
      detalj.appendChild(el("div", { class: "table-wrap" }, [tab]));
      detalj.appendChild(H("p", "pki-note", "Privat nøkkel: finnes ikke i sertifikatet."));
    }
    function endre(felt) {
      var s = st.D.certs[2];
      if (s.tampered) { st.D = lagData(st.scen); }
      else if (felt === "val") { s.tampered = "Validity"; s.to = "2027-12-14"; }
      else { s.tampered = "Subject"; s.subject = "admin.lerkedal.no"; }
      nullstill();
    }
    paint();
    return { velg: velg, steg: steg };
  };

  /* =====================================================================
     6b · CAA
     ===================================================================== */
  var CAA_DNS = "lerkedal.no.  CAA  0 issue \"fjellvik.no\"";
  var CAA_SCEN = {
    id: "pki-caa",
    opphav: { type: "ukesoppgave", kilder: ["t03 oppg. 6b"] },
    tittel: "Du jobber med sertifikatutstedelse. I DNS står: <code>" + CAA_DNS + "</code>",
    start: "nordkapp",
    noder: {
      nordkapp: {
        tekst: {
          eli5: "<p>Du jobber i Nordkapp CA. Noen vil ha et sertifikat for bibliotek.lerkedal.no og kan vise at de styrer domenet. Men lerkedal.no har en lapp i DNS: «bare Fjellvik får lage sertifikater for meg». Hva gjør du?</p>",
          normal: "<p>Du jobber i <b>Nordkapp CA</b>. En søker ber om et sertifikat for bibliotek.lerkedal.no og består domenevalideringen. Hva gjør Nordkapp?</p>",
          teknisk: "<p>Nordkapp CA får en forespørsel for bibliotek.lerkedal.no. Søkeren kontrollerer domenet. CAA-recorden for lerkedal.no har bare <code>issue \"fjellvik.no\"</code>. Hva gjør Nordkapp?</p>"
        },
        valg: [
          { tekst: "Avslår: CAA-recorden sier at bare Fjellvik får utstede for lerkedal.no", til: "fjellvik", poeng: 1,
            konsekvens: "<b>Riktig.</b> Domeneeieren har skrevet i DNS hvilke CA-er som får utstede, og Nordkapp står ikke der (t03 O6b). Recorden på lerkedal.no gjelder også underdomenet bibliotek.lerkedal.no." },
          { tekst: "Utsteder: søkeren har jo vist at den kontrollerer domenet", til: "fjellvik", poeng: -1, kit: { I: "truet" },
            konsekvens: "<b>Nei.</b> Domenekontroll er ikke nok når CAA-recorden utelukker Nordkapp. Sertifikatet ville vært feilutstedt." },
          { tekst: "Spør Fjellvik om lov til å utstede", til: "fjellvik", poeng: -1,
            konsekvens: "<b>Nei.</b> CAA er ikke en avtale mellom CA-er. Det er domeneeieren som bestemmer, i sin egen DNS-record, og der står bare Fjellvik." }
        ]
      },
      fjellvik: {
        tekst: "<p>Søkeren går i stedet til <b>Fjellvik</b>. Hva gjør Fjellvik?</p>",
        valg: [
          { tekst: "Sjekker at søkeren kontrollerer domenet, og utsteder", til: "komp", poeng: 1,
            konsekvens: "<b>Riktig.</b> CAA tillater Fjellvik, men CA-en må fortsatt identifisere søkeren riktig før den utsteder (t03 O7b)." },
          { tekst: "Utsteder uten videre, fordi CAA-recorden nevner Fjellvik", til: "komp", poeng: -1, kit: { I: "truet" },
            konsekvens: "<b>Nei.</b> CAA sier bare <i>hvem</i> som får utstede. Den sier ingenting om hvem søkeren er. Uten domenevalidering kunne hvem som helst fått sertifikatet." },
          { tekst: "Avslår, fordi CAA-policyen ikke er lagret hos Fjellvik", til: "komp", poeng: -1, kit: { T: "truet" },
            konsekvens: "<b>Nei.</b> CAA ligger alltid i domenets DNS, ikke hos CA-en (t03 O6b). Fjellvik er tillatt." }
        ]
      },
      komp: {
        tekst: "<p>En angriper har tatt kontroll over Nordkapp CA og utsteder et sertifikat for bibliotek.lerkedal.no, selv om CAA sier nei. Hva gjelder nå?</p>",
        valg: [
          { tekst: "CAA stoppet ikke dette. Utstedelsen må oppdages i ettertid, for eksempel gjennom sertifikattransparens, og så må sertifikatet tilbakekalles", til: "slutt", poeng: 2, kit: { K: "truet", I: "truet" },
            konsekvens: "<b>Riktig.</b> CAA virker bare når CA-en følger regelen. t03 O6a sier at CAA og CT <i>sammen</i> motvirker falske sertifikater. At CT gjør utstedelsen synlig i ettertid, er vår presisering og lærebokstoff." },
          { tekst: "Nettleseren slår opp CAA-recorden og avviser sertifikatet", til: "slutt", poeng: -1, kit: { K: "brutt", I: "brutt" },
            konsekvens: "<b>Nei.</b> CAA sjekkes av CA-en når den utsteder, ikke av nettleseren. Sertifikatet har en gyldig kjede og godtas. (RFC 8659; står ikke i kurskildene.)" },
          { tekst: "Ingenting kan skje: CAA gjør det umulig å utstede", til: "slutt", poeng: -1, kit: { K: "brutt", I: "brutt" },
            konsekvens: "<b>Nei.</b> CAA er en regel i DNS, ikke en teknisk sperre. En kompromittert CA kan ignorere den." }
        ]
      },
      slutt: { slutt: true, oppsummering: {
        eli5: "<p>CAA er en lapp i DNS som sier hvilke kontorer som får lage sertifikater for domenet. Ærlige kontorer følger lappen. Et kontor som er hacket, bryr seg ikke, og da må juksen oppdages etterpå.</p>",
        normal: "<p>CAA: domeneeieren skriver i DNS hvilke CA-er som får utstede (t03 O6b). En ærlig CA sjekker recorden og avslår om den ikke står der. CAA hindrer ikke en kompromittert CA som ignorerer regelen (RFC 8659), selv om t03 O6a sier at CA-autorisering forhindrer det. På eksamen kan t03-svaret ventes, men vit begrensningen. Derfor trengs CT i tillegg, så feilutstedelser kan oppdages og sertifikatene tilbakekalles (t03 O6a).</p>",
        teknisk: "<p>CAA (CA-autorisering) er en DNS-record på domenet, med <code>issue</code>-verdier for CA-ene som får utstede. Kontrollen skjer hos CA-en ved utstedelse. Mot en CA som ignorerer CAA hjelper bare at utstedelsen blir synlig og oppdages (CT), og deretter tilbakekalling eller at CA-en fjernes fra rotlagrene. Detaljene om CT og hvem som sjekker CAA, er lærebokstoff og står ikke i kildene.</p>"
      } }
    }
  };
  IN.pkiCaa = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "pki-viz" });
    w.appendChild(H("p", "pki-dns mono", CAA_DNS));
    host.appendChild(w);
    if (IN.scenario) IN.scenario(w, CAA_SCEN);
  };

  /* =====================================================================
     5 · Tillitsmodeller
     ===================================================================== */
  // kind: rot (selvsignert rot), ca (CA-signert mellomliggende), subj (CA-signert subjekt), selv (selvsignert subjekt), bro
  // anker: tillitsanker (ring). Kanter: "A>B" (A signerer B), "A<>B" (begge veier).
  var MODELLER = [
    { id: "enkelt", navn: "Enkelt hierarki", eks: "f.eks. DNSSEC",
      noder: { R: [180, 28, "rot", 1, "Rot"], A: [100, 100, "ca", 0, "CA 1"], B: [260, 100, "ca", 0, "CA 2"],
        a1: [60, 172, "subj", 0, "a1"], a2: [140, 172, "subj", 0, "a2"], b1: [220, 172, "subj", 0, "b1"], b2: [300, 172, "subj", 0, "b2"] },
      kanter: ["R>A", "R>B", "A>a1", "A>a2", "B>b1", "B>b2"],
      tekst: "Fordeler: enkel struktur som passer i strengt organiserte, lukkede nett, for eksempel militære. Ulemper: alle må stole på samme rot, en kompromittert rot gir totalt sammenbrudd, og modellen skalerer ikke til åpne nett (d03 s. 39)." },
    { id: "toveis", navn: "Toveis-hierarki", eks: "",
      noder: { R: [180, 28, "rot", 0, "Rot"], A: [100, 100, "ca", 1, "CA 1"], B: [260, 100, "ca", 1, "CA 2"],
        a1: [60, 172, "subj", 0, "a1"], a2: [140, 172, "subj", 0, "a2"], b1: [220, 172, "subj", 0, "b1"], b2: [300, 172, "subj", 0, "b2"] },
      kanter: ["R<>A", "R<>B", "A>a1", "A>a2", "B>b1", "B>b2"],
      tekst: "Forenklet skisse: CA-ene i treet sertifiserer hverandre begge veier, ikke bare ovenfra og ned." },
    { id: "silo", navn: "Silo-hierarkier", eks: "Internett-PKI, RPKI, ICAO PKD",
      noder: { R1: [60, 28, "rot", 1, "Rot 1"], R2: [180, 28, "rot", 1, "Rot 2"], R3: [300, 28, "rot", 1, "Rot 3"],
        C1: [60, 100, "ca", 0, "CA"], C2: [180, 100, "ca", 0, "CA"], C3: [300, 100, "ca", 0, "CA"],
        s1: [30, 172, "subj", 0, ""], s2: [90, 172, "subj", 0, ""], s3: [150, 172, "subj", 0, ""], s4: [210, 172, "subj", 0, ""], s5: [270, 172, "subj", 0, ""], s6: [330, 172, "subj", 0, ""] },
      kanter: ["R1>C1", "R2>C2", "R3>C3", "C1>s1", "C1>s2", "C2>s3", "C2>s4", "C3>s5", "C3>s6"],
      tekst: "Nettleseren har noen hundre uavhengige røtter installert, og nye kommer med programvareoppdateringer (d03 s. 41). Fordel: brukervennlig og automatisk. Ulemper: rotlageret er svakt beskyttet, brukere klikker forbi advarsler, og én kompromittert CA truer hele systemet (t03 O3b)." },
    { id: "kryss", navn: "Kryss-sertifisert (mesh)", eks: "",
      noder: { A: [70, 40, "rot", 1, "CA A"], B: [290, 40, "rot", 1, "CA B"], C: [180, 120, "rot", 1, "CA C"],
        a1: [30, 110, "subj", 0, ""], a2: [100, 120, "subj", 0, ""], b1: [260, 120, "subj", 0, ""], b2: [330, 110, "subj", 0, ""], c1: [150, 188, "subj", 0, ""], c2: [210, 188, "subj", 0, ""] },
      kanter: ["A<>B", "B<>C", "A<>C", "A>a1", "A>a2", "B>b1", "B>b2", "C>c1", "C>c2"],
      tekst: "Forenklet skisse: CA-ene sertifiserer hverandre på kryss, så brukere under én CA kan godta sertifikater fra de andre." },
    { id: "bro", navn: "PKI med bro-CA", eks: "",
      noder: { X: [180, 100, "bro", 0, "Bro-CA"], R1: [60, 40, "rot", 1, "Rot 1"], R2: [300, 40, "rot", 1, "Rot 2"], R3: [180, 165, "rot", 1, "Rot 3"],
        s1: [25, 110, "subj", 0, ""], s2: [90, 115, "subj", 0, ""], s3: [270, 115, "subj", 0, ""], s4: [335, 110, "subj", 0, ""], s5: [110, 195, "subj", 0, ""], s6: [250, 195, "subj", 0, ""] },
      kanter: ["X<>R1", "X<>R2", "X<>R3", "R1>s1", "R1>s2", "R2>s3", "R2>s4", "R3>s5", "R3>s6"],
      tekst: "Forenklet skisse: én bro-CA kryss-sertifiserer med hver rot, i stedet for at alle røtter kryss-sertifiserer med alle." },
    { id: "bruker", navn: "Brukersentrisk", eks: "PGP, «web of trust»",
      noder: { u1: [180, 28, "selv", 1, "Ola"], u2: [300, 70, "selv", 1, "Kari"], u3: [300, 160, "selv", 1, "Per"], u4: [180, 195, "selv", 1, "Lise"], u5: [60, 160, "selv", 1, "Nils"], u6: [60, 70, "selv", 1, "Mia"] },
      kanter: ["u1>u2", "u2>u3", "u1>u6", "u6>u5", "u3>u4", "u5>u4"],
      tekst: "Hver bruker er sin egen rot og har sin egen offentlige nøkkelring. Hun signerer andres nøkler når hun er overbevist om at de er ekte, og kan godta nøkler som er signert av noen hun stoler på (d03 s. 40)." },
    { id: "ustrukt", navn: "Ustrukturert", eks: "",
      noder: { R: [60, 40, "rot", 1, "Rot"], C: [170, 70, "ca", 0, "CA"], u: [290, 40, "selv", 1, "Bruker"], s1: [100, 160, "subj", 0, ""], s2: [220, 170, "subj", 0, ""], u2: [320, 150, "selv", 1, "Bruker"] },
      kanter: ["R>C", "C>s1", "C>u", "u>s2", "u2>s2", "R>s1"],
      tekst: "Forenklet skisse: en blanding av CA-er og brukere uten fast struktur." }
  ];
  function spred(m, fra) {
    var ut = {}; ut[fra] = true; var ko = [fra];
    while (ko.length) {
      var x = ko.shift();
      m.kanter.forEach(function (k) {
        var bi = k.indexOf("<>") >= 0, p = k.split(bi ? "<>" : ">");
        var maal = p[0] === x ? p[1] : (bi && p[1] === x ? p[0] : null);
        if (maal && !ut[maal]) { ut[maal] = true; ko.push(maal); }
      });
    }
    return ut;
  }
  IN.pkiModeller = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "pki-viz" });
    var mid = "enkelt", komp = null, id = "pkiar" + (++uid);
    var tabs = el("div", { class: "pki-row pki-scen", role: "group", "aria-label": "Tillitsmodell" }), tb = {};
    MODELLER.forEach(function (m) { var b = btn(m.navn, function () { mid = m.id; komp = null; paint(); }); tb[m.id] = b; tabs.appendChild(b); });
    w.appendChild(tabs);
    var fig = el("div", { class: "pki-svg pki-modell" }), info = H("div", "pki-out"), lg = el("div", { class: "legend pki-legend" });
    [["rot", "selvsignert rot"], ["ca", "CA-signert mellomliggende"], ["subj", "CA-signert subjekt"], ["selv", "selvsignert subjekt"], ["bro", "bro-CA"], ["anker", "tillitsanker (ring)"], ["bad", "mister tillit"]].forEach(function (x) {
      lg.appendChild(H("span", "item", "<span class=\"pki-sw pki-sw-" + x[0] + "\"></span>" + x[1]));
    });
    w.appendChild(H("p", "small muted", "Klikk på en node for å kompromittere den. Alt den kan signere seg fram til, blir rødt. Tegningene er forenklede skisser, ikke kopier av lysarket."));
    w.appendChild(fig); w.appendChild(lg); w.appendChild(info);
    host.appendChild(w);

    function paint() {
      var m = MODELLER.filter(function (x) { return x.id === mid; })[0];
      Object.keys(tb).forEach(function (k) { press(tb[k], k === mid); });
      var ber = komp ? spred(m, komp) : {};
      var svg = S("svg", { viewBox: "0 0 360 215", class: "viz-svg", role: "img", "aria-label": m.navn });
      var defs = S("defs");
      var mk = S("marker", { id: id, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
      mk.appendChild(S("path", { d: "M0,0 L10,5 L0,10 z", class: "pki-arh" }));
      defs.appendChild(mk); svg.appendChild(defs);
      var R = 11;
      m.kanter.forEach(function (k) {
        var bi = k.indexOf("<>") >= 0, p = k.split(bi ? "<>" : ">"), a = m.noder[p[0]], b = m.noder[p[1]];
        var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / L, uy = dy / L;
        var at = { x1: (a[0] + ux * (R + 2)).toFixed(1), y1: (a[1] + uy * (R + 2)).toFixed(1), x2: (b[0] - ux * (R + 3)).toFixed(1), y2: (b[1] - uy * (R + 3)).toFixed(1),
          class: "pki-edge" + (ber[p[0]] && ber[p[1]] ? " bad" : ""), "marker-end": "url(#" + id + ")" };
        if (bi) at["marker-start"] = "url(#" + id + ")";
        svg.appendChild(S("line", at));
      });
      Object.keys(m.noder).forEach(function (n) {
        var v = m.noder[n];
        var g = S("g", { class: "pki-node" + (ber[n] ? " bad" : "") + (komp === n ? " komp" : ""), tabindex: "0", role: "button",
          "aria-label": (v[4] || n) + (ber[n] ? ", mister tillit" : "") + ". Klikk for å kompromittere." });
        if (v[3]) g.appendChild(S("circle", { cx: v[0], cy: v[1], r: R + 4, class: "pki-anker" }));
        g.appendChild(S("circle", { cx: v[0], cy: v[1], r: R, class: "pki-n pki-n-" + v[2] }));
        if (v[4]) g.appendChild(S("text", { x: v[0], y: v[1] + R + 13, "text-anchor": "middle", class: "pki-nl" }, v[4]));
        g.appendChild(S("title", null, v[4] || "subjekt"));
        g.addEventListener("click", function () { komp = komp === n ? null : n; paint(); });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); komp = komp === n ? null : n; paint(); } });
        svg.appendChild(g);
      });
      clear(fig); fig.appendChild(svg);
      var antall = Object.keys(ber).length, tot = Object.keys(m.noder).length;
      var h = "<p><b>" + m.navn + "</b>" + (m.eks ? " (" + m.eks + ")" : "") + ". " + m.tekst + "</p>";
      if (komp) {
        h += "<p class=\"nei\">" + antall + " av " + tot + " noder mister tillit.";
        if (mid === "enkelt" && m.noder[komp][2] === "rot") h += " Roten er kompromittert: totalt sammenbrudd.";
        h += "</p>";
        if (mid === "silo") h += "<p class=\"nei small\"><b>Men:</b> i tegningen rammes bare én silo. I nettleseren kan hver rot og CA utstede for <i>alle</i> domener, så angriperen kan lage sertifikater som godtas også for domener i de andre siloene. Det svakeste leddet bestemmer.</p>";
      }
      info.innerHTML = h;
    }
    paint();

    // Tillitsforvirring
    w.appendChild(H("h5", "pki-h", "Tillitsforvirring: hvilken er pålitelig?"));
    var tf = el("div", { class: "pki-tf2" });
    ["lerkedalsparebank.no", "lerkedal-sparebank.no"].forEach(function (d) {
      tf.appendChild(H("div", "pki-browser", "<span class=\"pki-lock\" aria-hidden=\"true\">🔒</span> <span class=\"mono\">https://" + d + "</span><br><span class=\"small ok\">Sertifikatet er gyldig · kjeden er i orden</span><br><span class=\"small muted\">Lerkedal Sparebank · Logg inn</span>"));
    });
    w.appendChild(tf);
    var svar = H("p", "pki-out");
    w.appendChild(el("div", { class: "pki-row" }, [
      btn("Venstre", function () { gi("nei", "Det er riktignok bankens ekte domene, men det vet du bare fordi du kjenner navnet. Sertifikatet sier det ikke."); }),
      btn("Høyre", function () { gi("nei", "Høyre er svindlerens domene. Sertifikatet er likevel helt ekte for det domenet."); }),
      btn("Sertifikatet kan ikke avgjøre det", function () { gi("ok", "Riktig. Begge har ekte, gyldige sertifikater. Et sertifikat gir <b>autentisitet</b> for domenenavnet, ikke <b>pålitelighet</b>. Valideringen er syntaktisk, ikke semantisk (d03 s. 42–43). Bare en bruker som vet at banken heter lerkedalsparebank.no, oppdager svindelen."); })
    ]));
    w.appendChild(svar);
    function gi(c, t) { svar.className = "pki-out " + c; svar.innerHTML = t; }
  };

  /* =====================================================================
     Selvtest av tallene (node-test)
     ===================================================================== */
  IN.pkiSjekk = function () {
    var r = [];
    function eq(navn, fikk, ventet) { r.push({ navn: navn, ok: fikk === ventet, fikk: fikk, ventet: ventet }); }
    eq("n=8 symmetrisk", dist(8).sym, 28); eq("n=8 uten PKI", dist(8).utenPki, 56); eq("n=8 med PKI", dist(8).medPki, 8);
    eq("n=100 symmetrisk", dist(100).sym, 4950); eq("n=100 uten PKI", dist(100).utenPki, 9900); eq("n=100 med PKI", dist(100).medPki, 100);
    eq("n=10 symmetrisk", dist(10).sym, 45);
    eq("3·7 mod 20", (RSA.e * RSA.d) % 20, 1);
    eq("5^2", 5 * 5, 25); eq("5^4 mod 33", modpow(5, 4, 33), 31); eq("25·5 mod 33", (25 * 5) % 33, 26); eq("31·26", 31 * 26, 806);
    eq("S = 5^7 mod 33", sigOf(5), 14); eq("14^3", 14 * 14 * 14, 2744); eq("Ver = 14^3 mod 33", verOf(14), 5);
    FELT.forEach(function (f) { r.push({ navn: "H′ ≠ H for " + f.navn, ok: f.hEndret !== RSA.h && verOf(sigOf(RSA.h)) !== f.hEndret, fikk: f.hEndret, ventet: "≠ 5" }); });
    eq("Validity endret gir H′ = 8", FELT[5].hEndret, 8);
    SCEN.forEach(function (s) {
      var D = lagData(s.id), S2 = stegFor(D, "ocsp"), ff = forsteFeil(S2);
      eq("scenario " + s.id + " feiler i", ff < 0 ? null : S2[ff].id, FORVENTET[s.id]);
    });
    var Di = lagData("revok-ca"), Si = stegFor(Di, "ingen");
    eq("revok-ca uten sjekk: alt grønt", forsteFeil(Si), -1);
    var Df = lagData("feil-utsteder"), Sf = stegFor(Df, "ocsp");
    eq("feil-utsteder: steg 6 feiler også", Sf.filter(function (x) { return x.id === "6"; })[0].ok, false);
    eq("03.12.2026 innenfor subjektet", within("2026-12-03", "2026-09-15", "2026-12-14"), true);
    eq("20.12.2026 utenfor subjektet", within("2026-12-20", "2026-09-15", "2026-12-14"), false);
    eq("03.12.2026 utenfor CA 2 til 30.11.2026", within("2026-12-03", "2024-03-01", "2026-11-30"), false);
    // Alice-tabellen (H2022 6.1)
    var forv = { "A>B": ["selv", "selv"], "B>A": ["ja", "ja"], "B>C": ["nei", "ja"], "C>B": ["ja", "nei"], "A>C": ["selv", "selv"], "C>A": ["ja", "nei"] };
    RETN.forEach(function (x) { var t = tyveri(x), f = forv[x.fra + ">" + x.til]; eq("tyveri " + x.fra + "→" + x.til, t.les + "/" + t.sig, f[0] + "/" + f[1]); });
    // Tilstander som bøtteoppgave
    var tf = { gen: "ingen", akt: "begge", sus: "pros", deakt: "pros", komp: "pros", dest: "ingen" };
    Object.keys(tf).forEach(function (k) { eq("tilstand " + k + " i bøtte", TILST_OPPG.answer[k], tf[k]); });
    // Feltoppgaven: hver verdi har en bøtte som finnes
    var soner = {}; FELT_OPPG.zones.forEach(function (z) { soner[z.id] = true; });
    eq("felter: alle brikker har gyldig bøtte", FELT_OPPG.items.filter(function (it) { return !soner[FELT_OPPG.answer[it.id]]; }).length, 0);
    eq("felter: private nøkler står ikke i sertifikatet", FELT_OPPG.answer["x-priv"] + "/" + FELT_OPPG.answer["x-capriv"], "ikke/ikke");
    eq("felter: Validity-verdien i Validity", FELT_OPPG.answer["v-val"], "val");
    // Regn først: fasit og at ingen vanlig feil faller sammen med fasiten for n = 4..100
    eq("regn sym n=8", DIST_OPPG[0].fasit({ n: 8 }), 28); eq("regn sym n=12", DIST_OPPG[0].fasit({ n: 12 }), 66);
    eq("regn uten PKI n=10", DIST_OPPG[1].fasit({ n: 10 }), 90);
    var kolli = 0;
    DIST_OPPG.forEach(function (d) { for (var n = 4; n <= 100; n++) d.feil.forEach(function (f) { if (f.f(n) === d.fasit({ n: n })) kolli++; }); });
    eq("regn: vanlige feil ≠ fasit", kolli, 0);
    // Scenarioene: alle overganger finnes, og ja/nei-fasiten følger tyveri()
    [tyveriScenario(), CAA_SCEN].forEach(function (sc) {
      var brutt = 0;
      Object.keys(sc.noder).forEach(function (k) { (sc.noder[k].valg || []).forEach(function (v) { if (!sc.noder[v.til]) brutt++; }); });
      eq("scenario " + sc.id + ": alle overganger finnes", brutt, 0);
    });
    var TS = tyveriScenario().noder;
    [["cb", "C", "B", "les"], ["bc", "B", "C", "les"], ["sigB", "B", "C", "sig"], ["sigC", "C", "A", "sig"], ["sigA", "A", "C", "sig"]].forEach(function (q) {
      var a = tyveri({ fra: q[1], til: q[2] }), ja = (q[3] === "les" ? a.les : a.sig) !== "nei";
      eq("tyveri-scenario " + q[0], TS[q[0]].valg[0].poeng > 0, ja);
    });
    eq("tyveri-scenario: C→B kan leses", TS.cb.valg[0].poeng, 1);
    eq("tyveri-scenario: B→C kan ikke leses", TS.bc.valg[1].poeng, 1);
    eq("caa: Nordkapp avslår", CAA_SCEN.noder.nordkapp.valg[0].poeng, 1);
    // Tillitsmodeller: rot i enkelt hierarki river alt
    eq("enkelt: rot kompromittert", Object.keys(spred(MODELLER[0], "R")).length, 7);
    eq("silo: én rot", Object.keys(spred(MODELLER[2], "R1")).length, 4);
    return r;
  };
})();
