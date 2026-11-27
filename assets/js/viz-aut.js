/* ============================================================
   IN2120 guide · viz-aut.js
   Visualiseringer for blokk 7 (autentisering). Alt handler om forsvar:
   hvorfor lange passord, salt og trege hashfunksjoner hjelper, regnet ut som gjettetid.

   IN.vizAut.calc         rene regnefunksjoner (nøkkelrom, tid, leke-hash, leke-OTP, FMR/FNMR, EER)
   IN.vizAut.selfTest()   kontrollerer regnefunksjonene mot tallene i plan/innhold/08-autentisering.md
   IN.vizAut.noekkelrom(host)  regn først (IN.regnForst): A^L og tid ved 10^10/s, deretter kalkulatoren i <details>
   IN.vizAut.kalkulator(host)  kalkulator: tegnsett og lengde → N^L, tid, før/etter-forhold
   IN.vizAut.salt(host)        klartekst / hash / saltet hash med leke-hashen, «lekk databasen», gjettetid
   IN.vizAut.otp(host)         leke-OTP med klokke, vinduer og klokkedrift
   IN.vizAut.biometri(host)    regn først: FMR for en terskel, så terskelglider, FMR/FNMR-kurver og EER
   IN.vizAut.fido(host)        FIDO-registrering og -innlogging som sekvensdiagram (IN.stepPlayer med spor)
   IN.vizAut.nivaa(host)       IN.bucketTask: tjenester → garantinivå og eID → nivå, så oppslaget i <details>
   Klassisk script. Lastes etter core.js, stepplayer.js, dra.js og ovelse.js.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;
  var uid = 0;

  /* ---------- Tallformat (norsk: komma, smalt mellomrom) ---------- */
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻" };
  function sup(n) { return String(n).split("").map(function (c) { return SUP[c] || c; }).join(""); }
  function grp(s) { return String(s).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function dec(x, d) { var s = x.toFixed(d == null ? 1 : d); if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, ""); return s.replace(".", ","); }
  function sci(x) {
    if (!isFinite(x)) return "svært mange";
    if (x < 1e6) return grp(Math.round(x));
    var e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e);
    if (Math.round(m * 100) / 100 >= 10) { m /= 10; e += 1; }
    return dec(m, 2) + "·10" + sup(e);
  }
  var YEAR = 365.25 * 86400;
  function tid(s) {
    if (!isFinite(s)) return "uendelig lenge";
    if (s < 1) return "under ett sekund";
    if (s < 60) return dec(s, s < 10 ? 1 : 0) + " sekunder";
    if (s < 3600) return dec(s / 60, s < 600 ? 1 : 0) + " minutter";
    if (s < 86400) return dec(s / 3600, s < 36000 ? 1 : 0) + " timer";
    if (s < YEAR) return dec(s / 86400, s < 864000 ? 1 : 0) + " døgn";
    var y = s / YEAR;
    if (y < 10) return dec(y, 1) + " år";
    if (y < 1e7) return grp(Math.round(y)) + " år";
    return sci(y) + " år";
  }
  function rate(x) { return dec(x, 2).replace(",", "."); }   // biometrirater som i Inspera: punktum

  /* ---------- Regnefunksjoner ---------- */
  var HAS_BIG = typeof BigInt === "function";
  function bigPow(N, L) { var r = BigInt(1), b = BigInt(N); for (var i = 0; i < L; i++) r = r * b; return r; }
  function powStr(N, L) {
    if (HAS_BIG) { var s = bigPow(N, L).toString(); return s.length <= 24 ? grp(s) : sci(Math.pow(N, L)); }
    return sci(Math.pow(N, L));
  }
  function tegnverdi(c) {
    var k = c.charCodeAt(0);
    if (k >= 97 && k <= 122) return k - 96;      // a = 1 … z = 26
    if (k >= 48 && k <= 57) return k - 48;       // et siffer teller som sin verdi
    return null;
  }
  var calc = {
    keyspace: function (N, L) { return Math.pow(N, L); },
    keyspaceExact: function (N, L) { return HAS_BIG ? bigPow(N, L).toString() : String(Math.pow(N, L)); },
    sekunder: function (N, L, perSek) { return Math.pow(N, L) / perSek; },        // verste fall: hele rommet
    snitt: function (N, L, perSek) { return Math.pow(N, L) / perSek / 2; },       // i snitt: halvparten
    forhold: function (N1, L1, N2, L2) { return Math.pow(N2, L2) / Math.pow(N1, L1); },
    lekeHash: function (pw, salt) {
      var s = String(pw || "").toLowerCase(), deler = [], sum = 0;
      for (var i = 0; i < s.length; i++) { var v = tegnverdi(s[i]); if (v != null) { deler.push([s[i], v]); sum += v; } }
      var inn = (salt || 0) + sum, prod = inn * 37;
      return { deler: deler, sum: sum, inn: inn, prod: prod, hash: prod % 1000, tekst: ("00" + (prod % 1000)).slice(-3) };
    },
    vindu: function (sek) { return Math.floor(sek / 30); },
    otp: function (K, t) { return ("00" + ((K * t + 7) % 1000)).slice(-3); },
    rater: function (gen, imp, T) {
      var g = gen.filter(function (s) { return s >= T; }).length, f = imp.filter(function (s) { return s >= T; }).length;
      return { gAcc: g, iAcc: f, FNMR: (gen.length - g) / gen.length, TMR: g / gen.length, FMR: f / imp.length, TNMR: (imp.length - f) / imp.length };
    },
    eer: function (gen, imp) {
      var best = null, Ts = [];
      for (var T = 0; T <= 101; T++) {
        var r = calc.rater(gen, imp, T), d = Math.abs(r.FMR - r.FNMR);
        if (best == null || d < best.d - 1e-12) { best = { d: d, rate: (r.FMR + r.FNMR) / 2 }; Ts = [T]; }
        else if (Math.abs(d - best.d) < 1e-12 && Math.abs((r.FMR + r.FNMR) / 2 - best.rate) < 1e-12) Ts.push(T);
      }
      return { eer: best.rate, eksakt: best.d < 1e-12, fra: Ts[0], til: Ts[Ts.length - 1] };
    }
  };
  var GEN = [92, 88, 85, 81, 77, 74, 70, 66, 58, 45], IMP = [12, 20, 25, 31, 38, 44, 50, 57, 63, 71];
  calc.GEN = GEN; calc.IMP = IMP;

  /* ---------- Kontroll mot md-fila ---------- */
  function selfTest() {
    var out = [];
    function eq(navn, fikk, ventet) { out.push({ navn: navn, ok: fikk === ventet, fikk: fikk, ventet: ventet }); }
    function near(navn, fikk, ventet, rel) { out.push({ navn: navn, ok: Math.abs(fikk - ventet) <= Math.abs(ventet) * (rel || 0.01), fikk: fikk, ventet: ventet }); }
    eq("62^8 eksakt", calc.keyspaceExact(62, 8), "218340105584896");
    near("62^8 / 10^10 ≈ 21 834 s", calc.sekunder(62, 8, 1e10), 21834, 0.001);
    near("62^8 / 10^10 ≈ 6,1 timer", calc.sekunder(62, 8, 1e10) / 3600, 6.1, 0.01);
    near("snitt ≈ 3 timer", calc.snitt(62, 8, 1e10) / 3600, 3.03, 0.01);
    near("62^12 ≈ 3,23·10^21", calc.keyspace(62, 12), 3.23e21, 0.002);
    near("62^12 / 10^10 ≈ 10 200 år", calc.sekunder(62, 12, 1e10) / YEAR, 10200, 0.005);
    eq("62^12 / 62^8 = 62^4", calc.keyspaceExact(62, 4), "14776336");
    near("(95/26)^8 ≈ 31 769", calc.forhold(26, 8, 95, 8), 31769, 0.0005);
    eq("PIN 4 → 6 sifre = 100 (H2023 27)", calc.forhold(10, 4, 10, 6), 100);
    eq("PIN 5 → 7 sifre = 100 (quiz)", calc.forhold(10, 5, 10, 7), 100);
    eq("105^4 (H2024 11)", calc.keyspaceExact(105, 4), "121550625");
    near("95^10 / 28·10^9 ≈ 68 år (pentestlysarket)", calc.sekunder(95, 10, 28e9) / YEAR, 68, 0.01);
    near("26^7·10^2 ≈ 8·10^11", Math.pow(26, 7) * 100, 8.03e11, 0.005);
    near("26^7·10^2 / 28·10^9 ≈ 29 s", Math.pow(26, 7) * 100 / 28e9, 29, 0.02);
    eq("leke-hash «sol» uten salt = 702", calc.lekeHash("sol", 0).tekst, "702");
    eq("s + o + l = 46", calc.lekeHash("sol", 0).sum, 46);
    eq("leke-hash salt 4 = 850", calc.lekeHash("sol", 4).tekst, "850");
    eq("leke-hash salt 9 = 035", calc.lekeHash("sol", 9).tekst, "035");
    eq("10:00:15 → t = 1200", calc.vindu(10 * 3600 + 15), 1200);
    eq("OTP t = 1200 → 607", calc.otp(123, 1200), "607");
    eq("OTP t = 1199 → 484", calc.otp(123, 1199), "484");
    eq("OTP t = 1201 → 730", calc.otp(123, 1201), "730");
    [[50, 9, 0.1, 4, 0.4], [60, 8, 0.2, 2, 0.2], [70, 7, 0.3, 1, 0.1], [75, 5, 0.5, 0, 0]].forEach(function (r) {
      var x = calc.rater(GEN, IMP, r[0]);
      eq("T = " + r[0] + ": genuine godtatt", x.gAcc, r[1]);
      near("T = " + r[0] + ": FNMR", x.FNMR + 1, r[2] + 1, 1e-9);
      eq("T = " + r[0] + ": ikke-genuine godtatt", x.iAcc, r[3]);
      near("T = " + r[0] + ": FMR", x.FMR + 1, r[4] + 1, 1e-9);
    });
    var e = calc.eer(GEN, IMP);
    near("EER = 0.2", e.eer, 0.2, 1e-9);
    eq("EER-området inneholder T = 60", e.fra <= 60 && e.til >= 60, true);
    eq("Baklengs: 200 · 0.03 = 6", Math.round(200 * 0.03), 6);
    eq("Baklengs: 200 · 0.08 = 16", Math.round(200 * 0.08), 16);
    // Regn først (nøkkelrom): fasit A^L skiller seg fra fellen L^A
    eq("A^L ≠ L^A for 62 og 8", calc.keyspace(62, 8) !== Math.pow(8, 62), true);
    near("Tid 62^8 ved 10^10/s ≈ 21 834 s", calc.sekunder(62, 8, NR_FART), 21834, 0.001);
    // Regn først (biometri): standardoppgaven T = 65 og S ≥ T-fellen ved T = 71
    near("T = 65: FMR = 0.1", calc.rater(GEN, IMP, 65).FMR + 1, 1.1, 1e-9);
    near("T = 65: FNMR = 0.2", calc.rater(GEN, IMP, 65).FNMR + 1, 1.2, 1e-9);
    near("T = 71: FMR = 0.1 (71 ≥ 71 er match)", calc.rater(GEN, IMP, 71).FMR + 1, 1.1, 1e-9);
    // Garantinivå: eID-fasiten (lysarket om IAM) og situasjonene
    var nv = {}; EID.forEach(function (x) { nv[x.navn] = x.niv; });
    eq("MinID → BETYDELIG", nv.MinID, 1);
    eq("BankID, Buypass, Commfides, Foretaks-ID → HØYT", [nv.BankID, nv.Buypass, nv.Commfides, nv["Foretaks-ID"]].join(), "2,2,2,2");
    eq("SMS-PIN og Altinn-PIN → LAVT", [nv["SMS-PIN"], nv["Altinn-PIN"]].join(), "0,0");
    eq("Bare MinID er statlig", EID.filter(function (x) { return x.statlig; }).map(function (x) { return x.navn; }).join(), "MinID");
    eq("eID-brikkene har unike id-er", eidItems().map(function (x) { return x.id; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).length, EID.length);
    eq("Situasjoner per nivå 2/2/2", [0, 1, 2].map(function (n) { return NIV_SIT.filter(function (x) { return x.niv === n; }).length; }).join(), "2,2,2");
    // FIDO: spor peker på eksisterende steg og gyldig fasit
    Object.keys(SCEN).forEach(function (k) {
      var sc = SCEN[k];
      Object.keys(sc.spor || {}).forEach(function (i) {
        var q = sc.spor[i];
        eq("FIDO " + k + " spor på steg " + i, +i > 0 && +i < sc.steps.length && q.fasit >= 0 && q.fasit < q.valg.length, true);
      });
    });
    return out;
  }

  /* ---------- Små DOM-hjelpere ---------- */
  function row(cls, kids) { return el("div", { class: "aut-row" + (cls ? " " + cls : "") }, kids); }
  function lbl(text, ctrl) { return el("label", { class: "aut-lbl" }, [el("span", { text: text }), ctrl]); }
  function numInput(v, min, max, aria) { return el("input", { type: "number", value: String(v), min: String(min), max: String(max), class: "aut-num", "aria-label": aria }); }
  function host0(h) { return typeof h === "string" ? IN.qs(h) : h; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* =====================================================
     1. Nøkkelrom og gjettetid
     ===================================================== */
  var TEGN = [
    { id: "sma", navn: "a–z", n: 26 },
    { id: "store", navn: "A–Z", n: 26 },
    { id: "sifre", navn: "0–9", n: 10 },
    { id: "spes", navn: "spesialtegn (33)", n: 33 }
  ];
  var FART = [
    { v: 1e10, navn: "10¹⁰ per sekund (rask hash, eksempelet)" },
    { v: 28e9, navn: "28·10⁹ per sekund (rask hash, lysarket om pentesting)" },
    { v: 1e6, navn: "10⁶ per sekund (tregere hash)" },
    { v: 1e4, navn: "10⁴ per sekund (bevisst treg hash)" }
  ];
  var PRESETS = [
    { navn: "8 → 12 tegn, 62", a: { set: ["sma", "store", "sifre"], ekstra: 0, L: 8 }, b: { set: ["sma", "store", "sifre"], ekstra: 0, L: 12 }, fart: 0 },
    { navn: "26 → 95 tegn, 8 lang", a: { set: ["sma"], ekstra: 0, L: 8 }, b: { set: ["sma", "store", "sifre", "spes"], ekstra: 0, L: 8 }, fart: 0 },
    { navn: "PIN 4 → 6 (H2023 27)", a: { set: ["sifre"], ekstra: 0, L: 4 }, b: { set: ["sifre"], ekstra: 0, L: 6 }, fart: 0 },
    { navn: "10 → 14 tegn, 105 (H2024 11)", a: { set: ["sma", "store", "sifre", "spes"], ekstra: 10, L: 10 }, b: { set: ["sma", "store", "sifre", "spes"], ekstra: 10, L: 14 }, fart: 0 },
    { navn: "95¹⁰ (pentestlysarket)", a: { set: ["sma", "store", "sifre", "spes"], ekstra: 0, L: 8 }, b: { set: ["sma", "store", "sifre", "spes"], ekstra: 0, L: 10 }, fart: 1 }
  ];

  /* Regn først: studenten regner A^L og tiden før kalkulatoren åpnes.
     Fasit og vanlige feil er rene funksjoner (calc.nr*), så selfTest kan sjekke dem. */
  var NR_INN = [
    { navn: "A", etikett: "Tegn å velge mellom (N)", verdi: 36, min: 10, max: 105, steg: 1 },
    { navn: "L", etikett: "Lengde (L)", verdi: 10, min: 4, max: 16, steg: 1 }
  ];
  var NR_FART = 1e10;
  function tegnsettTekst(A) {
    return A === 26 ? " (a–z)" : A === 36 ? " (a–z og 0–9)" : A === 52 ? " (a–z og A–Z)" : A === 62 ? " (a–z, A–Z og 0–9)" :
      A === 95 ? " (alle skrivbare tegn)" : A === 10 ? " (bare sifre)" : A === 105 ? " (95 skrivbare og 10 andre, som i H2024 11)" : "";
  }
  function noekkelrom(host) {
    host = host0(host); if (!host) return;
    clear(host);
    var wrap = el("div", { class: "aut-viz aut-nr-regn" });
    var h1 = el("div"), h2 = el("div"), kalk = el("div");
    var det = el("details", { class: "aut-more" }, [el("summary", { text: "Kalkulator: før og etter en policyendring (åpne den etter at du har regnet)" }), kalk]);
    wrap.appendChild(el("h5", { class: "aut-h", text: "1. Hvor mange passord finnes?" }));
    wrap.appendChild(h1);
    wrap.appendChild(el("h5", { class: "aut-h", text: "2. Hvor lang tid tar det å prøve alle?" }));
    wrap.appendChild(h2);
    wrap.appendChild(det);
    host.appendChild(wrap);
    if (IN.regnForst) {
      var rf1 = IN.regnForst(h1, {
        id: "aut-nr-antall",
        opphav: { type: "egen", kilder: ["autentiseringslysarket s. 3–13"] },
        sporsmal: function (inn) {
          return "Et passord har nøyaktig <b>" + inn.L + "</b> tegn, og hvert tegn velges fritt blant <b>" + inn.A + "</b> mulige tegn" +
            tegnsettTekst(inn.A) + ". Hvor mange ulike passord finnes? Endre N og L med gliderne over for en ny oppgave.";
        },
        inndata: NR_INN,
        fasit: function (inn) { return calc.keyspace(inn.A, inn.L); },
        enhet: "passord",
        vanligeFeil: [
          { verdi: function (inn) { return Math.pow(inn.L, inn.A); }, hint: "Du har byttet om grunntall og eksponent (L<sup>N</sup>). Det er antall <i>tegn</i> opphøyd i <i>lengden</i>: N<sup>L</sup>." },
          { verdi: function (inn) { return inn.A * inn.L; }, hint: "Valgene for hver posisjon ganges med hverandre: N · N · … · N, L ganger. N · L ville betydd at hvert nytt tegn bare legger til N muligheter." },
          { verdi: function (inn) { return calc.keyspace(inn.A, inn.L) / 2; }, hint: "Det er hvor mange gjetninger som trengs i snitt. Spørsmålet gjelder alle mulige passord." },
          { verdi: function (inn) { return calc.keyspace(inn.A, inn.L - 1); }, hint: "Du har én faktor for lite: N<sup>L−1</sup>. Alle de L tegnene har N valg, også det første." },
          { test: function (svar, inn) { return inn.A !== 26 && IN.regnForst.naer(svar, Math.pow(26, inn.L), 0.02); }, hint: "Du har bare regnet med små bokstaver (26). Ta med hele tegnsettet N." }
        ],
        forklaring: function (inn) {
          var d = Math.floor(inn.L * Math.log10(inn.A)) + 1;
          return {
            eli5: "<p>For hvert tegn har du " + inn.A + " valg. To tegn gir " + inn.A + " · " + inn.A + " muligheter, og hvert nytt tegn ganger med " + inn.A + " igjen.</p>",
            normal: "<p>Hver av de " + inn.L + " posisjonene har " + inn.A + " valg, uavhengig av de andre. Antallet blir N<sup>L</sup> = " + inn.A + sup(inn.L) +
              ", et tall med " + d + " sifre. Ett tegn til ganger antallet med " + inn.A + ", mens et større tegnsett bare øker grunntallet. Derfor slår lengde tegnsett.</p>",
            teknisk: "<p>Antall mulige passord |K| = N<sup>L</sup> = " + inn.A + sup(inn.L) + " ≈ " + sci(calc.keyspace(inn.A, inn.L)) + ", altså log₂|K| = L · log₂N ≈ " +
              dec(inn.L * Math.log(inn.A) / Math.LN2, 1) + " bit. Det forutsetter at tegnene velges tilfeldig. Menneskevalgte passord ligger langt under dette, og angriperen starter med ordlister.</p>"
          };
        }
      });
      var rf2 = IN.regnForst(h2, {
        id: "aut-nr-tid",
        opphav: { type: "egen", kilder: ["autentiseringslysarket s. 3–13"] },
        sporsmal: function (inn) {
          return "Samme type passord: N = <b>" + inn.A + "</b> tegn og lengde L = <b>" + inn.L + "</b>. Angriperen har en lekket hash og prøver <b>10<sup>10</sup> gjetninger per sekund</b> (rask hashfunksjon). " +
            "Hvor lang tid tar det i verste fall å prøve alle passordene? Regn ut tiden og velg størrelsesorden.";
        },
        inndata: NR_INN,
        skjulInndata: true,
        svarform: "orden",
        trinn: IN.regnForst.tidstrinn(),
        fasit: function (inn) { return calc.sekunder(inn.A, inn.L, NR_FART); },
        fasitTekst: function (inn, f) { return "<b>" + IN.regnForst.tidstrinn()[IN.regnForst.trinnFor(f, IN.regnForst.tidstrinn())].tekst + "</b>: " + IN.regnForst.format(f) + " sekunder, det vil si " + tid(f) + ". I snitt (halvparten): " + tid(f / 2) + "."; },
        vanligeFeil: [
          { verdi: function (inn) { return calc.snitt(inn.A, inn.L, NR_FART); }, hint: "Det er tiden <i>i snitt</i> (halvparten av rommet). Spørsmålet gjelder verste fall: alle passordene." },
          { verdi: function (inn) { return calc.keyspace(inn.A, inn.L) * NR_FART; }, hint: "Du har ganget med farten. Antall passord <i>delt på</i> gjetninger per sekund gir sekunder." },
          { verdi: function (inn) { return Math.pow(inn.L, inn.A) / NR_FART; }, hint: "Du har byttet om grunntall og eksponent. Antallet er N<sup>L</sup>, ikke L<sup>N</sup>." },
          { verdi: function (inn) { return calc.keyspace(inn.A, inn.L); }, hint: "Det er antall passord. Del på 10<sup>10</sup> gjetninger per sekund for å få tiden." }
        ],
        forklaring: function (inn) {
          var s = calc.sekunder(inn.A, inn.L, NR_FART);
          return {
            eli5: "<p>Tell hvor mange passord det finnes, og del på hvor mange angriperen rekker per sekund. Det tar " + tid(s) + ".</p>",
            normal: "<p>Tid = antall passord / gjetninger per sekund = " + inn.A + sup(inn.L) + " / 10¹⁰ ≈ " + sci(s) + " s ≈ <b>" + tid(s) + "</b>. I snitt finnes passordet etter halvparten av tiden.</p>" +
              "<p>En bevisst treg hashfunksjon senker farten, og tiden går opp med samme faktor. Kalkulatoren under viser det.</p>",
            teknisk: "<p>T<sub>maks</sub> = N<sup>L</sup> / r og T<sub>snitt</sub> = N<sup>L</sup> / 2r, med r = 10¹⁰ gjetninger per sekund. Med en treg hash (for eksempel r = 10⁴) blir tiden 10⁶ ganger lenger. Salt endrer ikke dette tallet for én bruker, men tvinger angriperen til å gjøre jobben på nytt for hver bruker.</p>"
          };
        }
      });
      // «Samme type passord»: A og L følger hverandre i begge oppgavene.
      // Gliderne vises én gang, over begge spørsmålene (rf2 har skjulInndata).
      if (rf1 && rf2 && IN.regnForst.koble) IN.regnForst.koble([rf1, rf2]);
      if (rf1 && rf1.inndataEl) wrap.insertBefore(rf1.inndataEl, wrap.firstChild);
    }
    kalkulator(kalk);
  }

  function kalkulator(host) {
    host = host0(host); if (!host) return;
    var wrap = el("div", { class: "aut-viz aut-nr" });
    var pre = row("aut-presets", [el("span", { class: "aut-k", text: "Eksempler:" })]);
    wrap.appendChild(pre);
    var preNote = el("p", { class: "small muted", "aria-live": "polite" });
    wrap.appendChild(preNote);
    var preBtns = [], preValgt = 0;
    function visPreset() {
      preBtns.forEach(function (b, i) { b.setAttribute("aria-pressed", i === preValgt ? "true" : "false"); });
      preNote.textContent = preValgt >= 0 ? "Valgt eksempel: " + PRESETS[preValgt].navn + ". Endre tegnsett, lengde eller fart for å regne på egne tall."
        : "Egne tall. Trykk et eksempel for å hente tallene fra eksamen eller lysarket.";
    }

    function side(navn) {
      var boxes = {}, chk = el("div", { class: "aut-chk", role: "group", "aria-label": "Tegnsett " + navn });
      TEGN.forEach(function (t) {
        var c = el("input", { type: "checkbox" }); boxes[t.id] = c;
        chk.appendChild(el("label", { class: "aut-cb" }, [c, el("span", { text: t.navn })]));
      });
      var ekstra = numInput(0, 0, 200, "Ekstra tegn " + navn);
      var len = el("input", { type: "range", min: "1", max: "20", value: "8", "aria-label": "Lengde " + navn });
      var lenV = el("output", { class: "aut-big" });
      var out = el("div", { class: "aut-out" });
      var col = el("div", { class: "aut-col" }, [
        el("h5", { class: "aut-h", text: navn }),
        chk,
        row("", [lbl("Andre tegn (f.eks. æøå):", ekstra)]),
        row("", [lbl("Lengde L:", len), lenV]),
        out
      ]);
      return { col: col, boxes: boxes, ekstra: ekstra, len: len, lenV: lenV, out: out,
        N: function () { var n = 0; TEGN.forEach(function (t) { if (boxes[t.id].checked) n += t.n; }); return n + Math.max(0, +ekstra.value || 0); },
        L: function () { return +len.value; },
        set: function (p) { TEGN.forEach(function (t) { boxes[t.id].checked = p.set.indexOf(t.id) >= 0; }); ekstra.value = String(p.ekstra); len.value = String(p.L); } };
    }
    var A = side("Før"), B = side("Etter");
    wrap.appendChild(el("div", { class: "aut-cols" }, [A.col, B.col]));

    var fart = el("select", { class: "aut-sel", "aria-label": "Gjetninger per sekund" },
      FART.map(function (f, i) { return el("option", { value: String(i), text: f.navn }); }));
    wrap.appendChild(row("", [lbl("Angriperen prøver:", fart)]));
    var cmp = el("div", { class: "aut-cmp" });
    var bars = el("div", { class: "aut-bars", "aria-hidden": "true" });
    var fartTab = el("div", { class: "aut-farttab" });
    wrap.appendChild(cmp); wrap.appendChild(bars); wrap.appendChild(fartTab);

    PRESETS.forEach(function (p, i) {
      var b = el("button", { class: "btn sm", type: "button", text: p.navn, "aria-pressed": "false", onclick: function () { A.set(p.a); B.set(p.b); fart.value = String(p.fart); preValgt = i; paint(); } });
      preBtns.push(b); pre.appendChild(b);
    });
    function egne() { if (preValgt >= 0) { preValgt = -1; } paint(); }

    function paintSide(S, v) {
      var N = S.N(), L = S.L();
      S.lenV.textContent = L + " tegn";
      clear(S.out);
      if (!N) { S.out.appendChild(el("p", { class: "muted small", text: "Velg minst ett tegnsett." })); return null; }
      S.out.appendChild(el("p", { html: "Tegnsett N = <b>" + N + "</b>, lengde L = <b>" + L + "</b>" }));
      S.out.appendChild(el("p", { html: "Mulige passord N<sup>L</sup> = " + N + sup(L) + " = <b>" + powStr(N, L) + "</b>" }));
      S.out.appendChild(el("p", { html: "Prøve alle: <b>" + tid(calc.sekunder(N, L, v)) + "</b><br>I snitt (halvparten): <b>" + tid(calc.snitt(N, L, v)) + "</b>" }));
      return { N: N, L: L };
    }
    function paint() {
      visPreset();
      var v = FART[+fart.value].v;
      var a = paintSide(A, v), b = paintSide(B, v);
      clear(cmp); clear(bars); clear(fartTab);
      if (!a || !b) return;
      var f = calc.forhold(a.N, a.L, b.N, b.L), txt;
      if (a.N === b.N) {
        var d = b.L - a.L;
        txt = "Samme tegnsett: " + b.N + sup(b.L) + " / " + a.N + sup(a.L) + " = " + a.N + sup(d) +
          (d > 0 ? " = <b>" + powStr(a.N, d) + " ganger</b> så mange passord. Hvert ekstra tegn ganger med " + a.N + ", det legges ikke til." :
           d === 0 ? " = 1, altså ingen endring." : ", altså færre passord.");
      } else if (a.L === b.L) {
        txt = "Samme lengde: (" + b.N + "/" + a.N + ")" + sup(a.L) + " ≈ <b>" + sci(f) + " ganger</b> så mange passord.";
      } else {
        txt = b.N + sup(b.L) + " / " + a.N + sup(a.L) + " ≈ <b>" + sci(f) + " ganger</b> så mange passord.";
      }
      cmp.appendChild(el("p", { html: "<b>Etter / før:</b> " + txt }));
      // Søyler på log-skala: lengden viser antall sifre i N^L
      var la = a.L * Math.log10(a.N), lb = b.L * Math.log10(b.N), mx = Math.max(la, lb, 1);
      [["Før", la], ["Etter", lb]].forEach(function (x) {
        bars.appendChild(el("div", { class: "aut-barrow" }, [el("span", { class: "aut-barl", text: x[0] }),
          el("span", { class: "aut-bar", style: "width:" + Math.max(2, 100 * x[1] / mx).toFixed(1) + "%" }),
          el("span", { class: "aut-barv small muted", text: "ca. " + Math.round(x[1]) + " sifre" })]));
      });
      // Samme «Etter»-passord ved ulik hashfart: derfor hjelper en treg hashfunksjon
      var t = el("table", { class: "aut-tab" });
      t.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "Hashfart" }), el("th", { text: "Tid i snitt for «Etter»" })])]));
      var tb = el("tbody");
      FART.forEach(function (fv, i) {
        tb.appendChild(el("tr", { class: i === +fart.value ? "on" : "" }, [el("td", { text: fv.navn }), el("td", { text: tid(calc.snitt(b.N, b.L, fv.v)) })]));
      });
      t.appendChild(tb);
      fartTab.appendChild(el("p", { class: "small", html: "<b>Treg hash:</b> tjeneren merker ikke om én innlogging tar et millisekund lenger, men angriperen må betale den tiden for hver eneste gjetning. Går farten ned med en faktor, går tiden opp med samme faktor:" }));
      fartTab.appendChild(el("div", { class: "table-wrap" }, [t]));
    }
    [A, B].forEach(function (S) {
      IN.qsa("input", S.col).forEach(function (i) { i.addEventListener("input", egne); i.addEventListener("change", egne); });
    });
    fart.addEventListener("change", egne);
    A.set(PRESETS[0].a); B.set(PRESETS[0].b);
    clear(host); host.appendChild(wrap);
    paint();
  }

  /* =====================================================
     2. Lagring: klartekst, hash, saltet hash (leke-hash)
     ===================================================== */
  var VANLIGE = ["sol", "katt", "hund", "passord", "sommer", "1234"];
  function salt(host) {
    host = host0(host); if (!host) return;
    var mode = "salt", lekk = false;
    var users = [{ navn: "Kari", pw: "sol", salt: 4 }, { navn: "Ola", pw: "sol", salt: 9 }, { navn: "Per", pw: "katt", salt: 2731 }];
    var wrap = el("div", { class: "aut-viz aut-salt" });
    var modes = row("aut-seg", [el("span", { class: "aut-k", text: "Lagring:" })]);
    var mBtns = {};
    [["klar", "Klartekst"], ["hash", "Hash"], ["salt", "Saltet hash"]].forEach(function (m) {
      var b = el("button", { class: "btn sm", type: "button", text: m[1], "aria-pressed": "false", onclick: function () { mode = m[0]; paint(); } });
      mBtns[m[0]] = b; modes.appendChild(b);
    });
    var lekkBtn = el("button", { class: "btn sm aut-angrep", type: "button", "aria-pressed": "false", onclick: function () { lekk = !lekk; paint(); } });
    var lekkHint = el("span", { class: "small muted" });
    // Angrepet står på en egen rad, så det ikke ser ut som et fjerde lagringsvalg (demo-gjennomgang punkt 15).
    var angrep = row("aut-seg", [el("span", { class: "aut-k", text: "Angrep:" }), lekkBtn, lekkHint]);
    wrap.appendChild(modes);
    wrap.appendChild(angrep);
    wrap.appendChild(el("p", { class: "small muted", html: "Leke-hash (ikke sikker, bare for å vise prinsippet): H(x) = (summen av tegnverdiene × 37) mod 1000, der a = 1, …, z = 26 og et siffer teller som sin verdi. Med salt: H(salt ‖ passord) = ((salt + summen) × 37) mod 1000. Andre tegn enn a–z og 0–9 telles ikke." }));

    var ed = el("div", { class: "aut-users" });
    users.forEach(function (u, i) {
      var pw = el("input", { type: "text", value: u.pw, class: "aut-txt", maxlength: "20", autocomplete: "off", spellcheck: "false", "aria-label": "Passordet til " + u.navn });
      var sl = numInput(u.salt, 0, 4095, "Saltet til " + u.navn);
      pw.addEventListener("input", function () { u.pw = pw.value; paint(); });
      sl.addEventListener("input", function () { u.salt = Math.max(0, Math.min(4095, Math.floor(+sl.value || 0))); paint(); });
      ed.appendChild(row("aut-user", [el("b", { class: "aut-un", text: u.navn }), lbl("passord", pw), lbl("salt", sl)]));
    });
    wrap.appendChild(ed);
    var db = el("div"), calcBox = el("div", { class: "aut-calc" }), seen = el("div", { class: "aut-seen" });
    wrap.appendChild(db); wrap.appendChild(calcBox); wrap.appendChild(seen);

    // Innlogging
    var who = el("select", { class: "aut-sel", "aria-label": "Hvem logger inn" }, users.map(function (u, i) { return el("option", { value: String(i), text: u.navn }); }));
    var tryPw = el("input", { type: "text", value: "sol", class: "aut-txt", autocomplete: "off", spellcheck: "false", "aria-label": "Passord som tastes" });
    var loginOut = el("p", { class: "aut-login", "aria-live": "polite" });
    wrap.appendChild(el("h5", { class: "aut-h", text: "Innlogging" }));
    wrap.appendChild(row("", [lbl("Bruker:", who), lbl("taster:", tryPw)]));
    wrap.appendChild(loginOut);
    who.addEventListener("change", paint); tryPw.addEventListener("input", paint);

    // Gjettetid
    var W = numInput(1000000, 1, 1e12, "Antall ord i ordlista"), U = numInput(100000, 1, 1e10, "Antall brukere i databasen");
    var F = el("select", { class: "aut-sel", "aria-label": "Hashfart" }, FART.map(function (f, i) { return el("option", { value: String(i), text: f.navn }); }));
    var gOut = el("div", { class: "aut-gjett" });
    wrap.appendChild(el("h5", { class: "aut-h", text: "Regnestykket: hvorfor salt og treg hash hjelper" }));
    wrap.appendChild(row("", [lbl("Ord i ordlista:", W), lbl("Brukere:", U), lbl("Fart:", F)]));
    wrap.appendChild(gOut);
    [W, U].forEach(function (x) { x.addEventListener("input", paint); }); F.addEventListener("change", paint);

    function lagret(u) {
      if (mode === "klar") return u.pw;
      return calc.lekeHash(u.pw, mode === "salt" ? u.salt : 0).tekst;
    }
    function paint() {
      Object.keys(mBtns).forEach(function (k) { mBtns[k].setAttribute("aria-pressed", k === mode ? "true" : "false"); });
      lekkBtn.textContent = lekk ? "Databasen er lekket (trykk for å angre)" : "Lekk databasen";
      lekkBtn.setAttribute("aria-pressed", lekk ? "true" : "false");
      lekkHint.textContent = lekk ? "Tabellen og teksten under viser hva angriperen ser." : "Trykk for å se hva en angriper får ut av databasen.";
      // Databasen
      var vals = users.map(lagret), count = {};
      vals.forEach(function (v) { count[v] = (count[v] || 0) + 1; });
      var t = el("table", { class: "aut-tab" });
      var hr = [el("th", { text: "Bruker" })];
      if (mode === "salt") hr.push(el("th", { text: "Salt" }));
      hr.push(el("th", { text: mode === "klar" ? "Lagret passord" : mode === "hash" ? "Lagret H(passord)" : "Lagret H(salt ‖ passord)" }));
      t.appendChild(el("thead", {}, [el("tr", {}, hr)]));
      var tb = el("tbody");
      users.forEach(function (u, i) {
        var cells = [el("td", { text: u.navn })];
        if (mode === "salt") cells.push(el("td", { class: "mono", text: String(u.salt) }));
        cells.push(el("td", { class: "mono" + (count[vals[i]] > 1 && lekk ? " aut-same" : ""), text: vals[i] }));
        tb.appendChild(el("tr", {}, cells));
      });
      t.appendChild(tb);
      clear(db);
      db.appendChild(el("h5", { class: "aut-h", text: "Passorddatabasen" + (lekk ? " (slik angriperen ser den etter en lekkasje)" : "") }));
      db.appendChild(el("div", { class: "table-wrap" }, [t]));
      // Utregning
      clear(calcBox);
      if (mode !== "klar") users.forEach(function (u) {
        var h = calc.lekeHash(u.pw, mode === "salt" ? u.salt : 0);
        var parts = h.deler.map(function (d) { return d[0] + " = " + d[1]; }).join(", ");
        calcBox.appendChild(el("p", { class: "small mono", text: u.navn + ": " + (parts || "(ingen tellende tegn)") + " → sum " + h.sum +
          (mode === "salt" ? "; (" + u.salt + " + " + h.sum + ") · 37 = " + h.prod : "; " + h.sum + " · 37 = " + h.prod) + " → " + h.tekst }));
      });
      // Hva angriperen ser
      clear(seen);
      if (lekk) {
        var msg;
        if (mode === "klar") msg = "Alle passordene ligger åpent. Angriperen trenger ikke knekke noe, og kan prøve dem på andre tjenester der brukerne har gjenbrukt dem.";
        else {
          var dupl = Object.keys(count).filter(function (k) { return count[k] > 1; });
          var tab = {}; VANLIGE.forEach(function (p) { tab[calc.lekeHash(p, 0).tekst] = p; });
          var treff = users.filter(function (u, i) { return tab[vals[i]] != null; });
          msg = (dupl.length ? "Like lagrede verdier (" + dupl.join(", ") + ") avslører at noen har samme passord. " : "Ingen lagrede verdier er like. ") +
            (mode === "hash" ? "En ferdig tabell over hashene til vanlige passord (" + VANLIGE.map(function (p) { return "«" + p + "» → " + calc.lekeHash(p, 0).tekst; }).join(", ") + ") gir treff på " +
              (treff.length ? treff.map(function (u) { return u.navn; }).join(", ") : "ingen") + " uten noe regnearbeid etter lekkasjen." :
             "Den ferdige tabellen over usaltede hasher gir ingen treff, fordi hver bruker har sitt eget salt. Med salt fra 0 til 4095 måtte angriperen laget 4096 tabeller. Men en angriper som gjetter «sol» mot Karis salt, finner det likevel: salt stopper tabeller, ikke gjetting av svake passord.");
          if (mode === "salt" && dupl.length) msg += " (Leke-hashen har bare 1000 verdier, så to ulike innganger kan treffe samme verdi. En ekte hash har så mange mulige verdier at det ikke skjer i praksis.)";
        }
        seen.appendChild(el("p", { class: "aut-note", text: msg }));
      }
      // Innlogging
      var u = users[+who.value], forventet = lagret(u), fikk = mode === "klar" ? tryPw.value : calc.lekeHash(tryPw.value, mode === "salt" ? u.salt : 0).tekst;
      var ok = fikk === forventet;
      loginOut.className = "aut-login " + (ok ? "ok" : "nei");
      loginOut.innerHTML = (mode === "klar" ? "Tjeneren sammenligner det du tastet direkte med lagret passord. " :
        mode === "hash" ? "Tjeneren regner H(" + esc(tryPw.value) + ") = " + fikk + " og sammenligner med lagret " + forventet + ". " :
        "Tjeneren henter saltet " + u.salt + ", regner H(" + u.salt + " ‖ " + esc(tryPw.value) + ") = " + fikk + " og sammenligner med lagret " + forventet + ". ") +
        "<b>" + (ok ? "Godkjent." : "Avvist.") + "</b>";
      // Gjettetid
      var w = Math.max(1, +W.value || 1), n = Math.max(1, +U.value || 1), v = FART[+F.value].v;
      clear(gOut);
      gOut.appendChild(el("p", { html: "<b>Uten salt:</b> angriperen hasher hvert ord i lista én gang og sammenligner med alle brukerne samtidig: " + sci(w) + " hasher = <b>" + tid(w / v) + "</b>. Slike tabeller kan til og med lages før lekkasjen." }));
      gOut.appendChild(el("p", { html: "<b>Med salt:</b> hvert ord må hashes på nytt for hver bruker, fordi saltene er ulike: " + sci(w) + " · " + sci(n) + " = " + sci(w * n) + " hasher = <b>" + tid(w * n / v) + "</b>." }));
      gOut.appendChild(el("p", { html: "<b>Med salt og treg hash</b> (10⁴ per sekund): " + sci(w * n) + " / 10⁴ = <b>" + tid(w * n / 1e4) + "</b>. Én bestemt bruker med et svakt passord som står i lista, finnes likevel etter høyst " + tid(w / 1e4) + ", så lange og uvanlige passord trengs fortsatt." }));
    }
    clear(host); host.appendChild(wrap);
    paint();
  }

  /* =====================================================
     3. Leke-OTP
     ===================================================== */
  function hhmmss(s) { s = ((s % 86400) + 86400) % 86400; var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return [h, m, x].map(function (v) { return ("0" + v).slice(-2); }).join(":"); }
  function otp(host) {
    host = host0(host); if (!host) return;
    var now = 10 * 3600 + 15, drift = 0, K = 123, locked = null;
    var wrap = el("div", { class: "aut-viz aut-otp" });
    wrap.appendChild(el("p", { class: "small muted", text: "Leke-formel: OTP = (K · t + 7) mod 1000, der t er nummeret på 30-sekundersvinduet (sekunder siden midnatt / 30, avrundet ned). Ekte brikker bruker en kryptografisk funksjon, men ideen er den samme." }));
    var clock = el("input", { type: "time", step: "1", value: hhmmss(now), class: "aut-time", "aria-label": "Tjenerens klokke" });
    var kIn = numInput(K, 1, 999, "Hemmelig nøkkel K");
    var dr = el("input", { type: "range", min: "-90", max: "90", step: "5", value: "0", "aria-label": "Klokkedrift i brikken (sekunder)" });
    var drV = el("output", { class: "aut-big" });
    wrap.appendChild(row("", [lbl("Klokka:", clock),
      el("button", { class: "btn sm", type: "button", text: "− 30 s", onclick: function () { now -= 30; sync(); } }),
      el("button", { class: "btn sm", type: "button", text: "+ 30 s", onclick: function () { now += 30; sync(); } }),
      el("button", { class: "btn sm", type: "button", text: "+ 5 min", onclick: function () { now += 300; sync(); } }),
      lbl("Nøkkel K:", kIn)]));
    wrap.appendChild(row("", [lbl("Brikkens klokke går feil med:", dr), drV]));
    var lockBtn = el("button", { class: "btn sm", type: "button", "aria-pressed": "false", onclick: function () { locked = locked == null ? cur.kode : null; paint(); } });
    wrap.appendChild(row("", [lockBtn, el("span", { class: "small muted", text: "Skriv ned koden og flytt klokka for å se at en gammel kode ikke virker." })]));
    var cols = el("div", { class: "aut-cols" }), tl = el("div", { class: "aut-tl" }), res = el("p", { class: "aut-login", "aria-live": "polite" });
    wrap.appendChild(cols); wrap.appendChild(tl); wrap.appendChild(res);
    var cur = {};
    function sync() { now = ((now % 86400) + 86400) % 86400; clock.value = hhmmss(now); paint(); }
    clock.addEventListener("change", function () { var p = (clock.value || "").split(":"); if (p.length >= 2) { now = (+p[0]) * 3600 + (+p[1]) * 60 + (+(p[2] || 0)); paint(); } });
    kIn.addEventListener("input", function () { K = Math.max(1, Math.floor(+kIn.value || 1)); paint(); });
    dr.addEventListener("input", function () { drift = +dr.value; paint(); });
    function paint() {
      var tb = calc.vindu(now + drift), ts = calc.vindu(now), kode = calc.otp(K, tb);
      cur = { kode: kode };
      var tastet = locked != null ? locked : kode;
      drV.textContent = (drift > 0 ? "+" : drift < 0 ? "−" : "±") + Math.abs(drift) + " s";
      lockBtn.textContent = locked != null ? "Koden " + locked + " er skrevet ned (trykk for å slippe)" : "Skriv ned koden";
      lockBtn.setAttribute("aria-pressed", locked != null ? "true" : "false");
      clear(cols);
      cols.appendChild(el("div", { class: "aut-col" }, [el("h5", { class: "aut-h", text: "Brikken" }),
        el("p", { class: "mono", text: "klokke " + hhmmss(now + drift) + " → t = " + tb }),
        el("p", { class: "mono", text: "(" + K + " · " + tb + " + 7) mod 1000" }),
        el("p", { class: "aut-code", text: kode })]));
      var godta = [ts - 1, ts, ts + 1];
      cols.appendChild(el("div", { class: "aut-col" }, [el("h5", { class: "aut-h", text: "Tjeneren" }),
        el("p", { class: "mono", text: "klokke " + hhmmss(now) + " → t = " + ts }),
        el("p", { class: "mono", text: "godtar t − 1, t og t + 1" }),
        el("p", { class: "mono", text: godta.map(function (t) { return t + ": " + calc.otp(K, t); }).join(" · ") })]));
      clear(tl);
      for (var t = ts - 3; t <= ts + 3; t++) {
        var c = calc.otp(K, t), cls = "aut-win" + (godta.indexOf(t) >= 0 ? " ok" : "") + (t === tb ? " dev" : "") + (c === tastet ? " hit" : "");
        tl.appendChild(el("div", { class: cls }, [el("span", { class: "small", text: "t = " + t }), el("span", { class: "mono", text: c }),
          el("span", { class: "small muted", text: hhmmss(t * 30) })]));
      }
      var hit = godta.filter(function (t) { return calc.otp(K, t) === tastet; })[0];
      res.className = "aut-login " + (hit != null ? "ok" : "nei");
      res.innerHTML = "Brukeren taster <b class=\"mono\">" + tastet + "</b>. " + (hit != null ?
        "Tjeneren finner koden i vindu " + hit + (hit === ts ? " (nå)" : hit < ts ? " (forrige, brikken går litt etter)" : " (neste, brikken går litt før)") + " → <b>godkjent</b>." :
        (locked != null ? "Koden hører til et vindu tjeneren ikke godtar lenger → <b>avvist</b>. En kode som er fanget opp senere, er verdiløs." :
          "Klokkene har drevet mer enn ett vindu fra hverandre → <b>avvist</b>. Derfor må klokkene være synkrone."));
    }
    clear(host); host.appendChild(wrap);
    paint();
  }

  /* =====================================================
     4. Biometri: terskel, FMR/FNMR og EER
     ===================================================== */
  /* Regn først: FMR for en gitt terskel, før kurvene vises. */
  function bioSporsmal(inn) {
    return "Testen har ti genuine forsøk med skåringene <span class=\"mono\">" + GEN.join(", ") + "</span> og ti ikke-genuine med <span class=\"mono\">" + IMP.join(", ") +
      "</span>. Systemet gir match når <span class=\"mono\">S ≥ T</span>. Med terskel <b>T = " + inn.T + "</b>: hva er <b>FMR</b>? Svar som andel, for eksempel 0,3.";
  }
  function biometri(host) {
    host = host0(host); if (!host) return;
    clear(host);
    var wrap = el("div", { class: "aut-bio-regn" });
    var qHost = el("div"), vHost = el("div", { hidden: true });
    var vis = el("button", { class: "btn sm", type: "button", text: "Vis kurvene uten å regne", onclick: function () { apne(null); } });
    var visRad = row("", [vis, el("span", { class: "small muted", text: "Kurvene viser svaret, så regn først." })]);
    wrap.appendChild(qHost); wrap.appendChild(visRad); wrap.appendChild(vHost);
    host.appendChild(wrap);
    var kurve = null;
    function apne(T) {
      vHost.hidden = false; visRad.hidden = true;
      if (!kurve) kurve = bioKurve(vHost, T == null ? 60 : T);
      else if (T != null) kurve.settT(T);
    }
    if (!IN.regnForst) { apne(null); return; }
    IN.regnForst(qHost, {
      id: "aut-bio-fmr",
      opphav: { type: "egen", kilder: ["autentiseringslysarket s. 29–39"] },
      sporsmal: bioSporsmal,
      inndata: [{ navn: "T", etikett: "Terskel T", verdi: 65, min: 40, max: 80, steg: 1 }],
      rentTall: true,
      fasit: function (inn) { return calc.rater(GEN, IMP, inn.T).FMR; },
      toleranse: 0.001,
      fasitTekst: function (inn, f) {
        var r = calc.rater(GEN, IMP, inn.T);
        return "FMR = " + r.iAcc + "/10 = " + rate(f) + " (og FNMR = " + (10 - r.gAcc) + "/10 = " + rate(r.FNMR) + ")";
      },
      vanligeFeil: [
        { test: function (svar, inn) { var r = calc.rater(GEN, IMP, inn.T); return Math.abs(r.FNMR - r.FMR) > 1e-9 && Math.abs(svar - r.FNMR) < 1e-6; },
          hint: "Det er FNMR: andelen <i>genuine</i> som avvises. FMR er andelen <i>ikke-genuine</i> som slipper inn (S ≥ T)." },
        { test: function (svar, inn) { var r = calc.rater(GEN, IMP, inn.T); return Math.abs(r.TNMR - r.FMR) > 1e-9 && Math.abs(svar - r.TNMR) < 1e-6; },
          hint: "Det er TNMR = 1 − FMR, andelen ikke-genuine som avvises. FMR teller dem som feilaktig godtas." },
        { test: function (svar, inn) {
            var f = IMP.filter(function (s) { return s > inn.T; }).length / IMP.length, r = calc.rater(GEN, IMP, inn.T);
            return Math.abs(f - r.FMR) > 1e-9 && Math.abs(svar - f) < 1e-6; },
          hint: "Du har brukt S &gt; T. Regelen er S ≥ T, så en skåring på nøyaktig T regnes som match." },
        { test: function (svar, inn) { var r = calc.rater(GEN, IMP, inn.T); return r.iAcc > 0 && Math.abs(svar - r.iAcc) < 1e-6; },
          hint: "Det er antallet ikke-genuine som godtas. FMR er en andel: del på antall ikke-genuine forsøk (10)." },
        { test: function (svar, inn) { var r = calc.rater(GEN, IMP, inn.T); return r.FMR > 0 && Math.abs(svar - 100 * r.FMR) < 1e-6; },
          hint: "Det ser ut som prosent. Oppgi andelen, for eksempel 0,2 og ikke 20." }
      ],
      forklaring: function (inn) {
        var r = calc.rater(GEN, IMP, inn.T), over = IMP.filter(function (s) { return s >= inn.T; });
        return {
          eli5: "<p>Tell de falske forsøkene som kom over streken på " + inn.T + ": " + (over.length ? over.join(", ") : "ingen") + ". Det er " + r.iAcc + " av 10, altså " + rate(r.FMR) + ".</p>",
          normal: "<p>FMR = antall match blant ikke-genuine / antall ikke-genuine. Skåringer ≥ " + inn.T + " blant de ikke-genuine: " + (over.length ? over.join(", ") : "ingen") +
            ". FMR = " + r.iAcc + "/10 = <b>" + rate(r.FMR) + "</b>. Hever du T, synker FMR og FNMR stiger.</p>",
          teknisk: "<p>FMR(T) = |{S<sub>i</sub> ≥ T}| / n for de ikke-genuine, FNMR(T) = |{S<sub>g</sub> &lt; T}| / n for de genuine. Her FMR = " + rate(r.FMR) + " og FNMR = " + rate(r.FNMR) +
            ". FMR måler tilfeldige ikke-genuine forsøk, ikke forfalskninger. Det er PAD som skal stoppe en falsk finger.</p>"
        };
      },
      etter: function (node, inn) { apne(inn.T); }
    });
  }
  function bioKurve(host, T0) {
    host = host0(host); if (!host) return;
    var T = T0 == null ? 60 : T0, id = "aut-bio-" + (++uid);
    var wrap = el("div", { class: "aut-viz aut-bio" });
    var sl = el("input", { type: "range", min: "0", max: "100", value: String(T), "aria-label": "Terskel T" });
    var tv = el("output", { class: "aut-big" });
    var pre = row("aut-presets", [lbl("Terskel T:", sl), tv]);
    var tBtns = [50, 60, 70, 75].map(function (v) { var b = el("button", { class: "btn sm", type: "button", text: "T = " + v, "aria-pressed": "false", onclick: function () { T = v; sl.value = String(v); paint(); } }); b._T = v; pre.appendChild(b); return b; });
    wrap.appendChild(pre);
    var svgHost = el("div", { class: "aut-svg" }), stats = el("div"), note = el("p", { class: "aut-note", "aria-live": "polite" });
    wrap.appendChild(svgHost); wrap.appendChild(stats); wrap.appendChild(note);
    sl.addEventListener("input", function () { T = +sl.value; paint(); });
    var e = calc.eer(GEN, IMP);
    var X0 = 50, X1 = 630, xs = function (v) { return X0 + (X1 - X0) * v / 100; };
    function paint() {
      tv.textContent = String(T);
      tBtns.forEach(function (b) { b.setAttribute("aria-pressed", b._T === T ? "true" : "false"); });
      var r = calc.rater(GEN, IMP, T), s = [];
      s.push('<svg class="viz-svg" viewBox="0 0 660 330" role="img" aria-labelledby="' + id + '-t"><title id="' + id + '-t">Skåringer for genuine og ikke-genuine forsøk med terskel ' + T + "</title>");
      // akse
      s.push('<line class="aut-ax" x1="' + X0 + '" y1="140" x2="' + X1 + '" y2="140"/>');
      for (var a = 0; a <= 100; a += 10) s.push('<line class="aut-ax" x1="' + xs(a) + '" y1="140" x2="' + xs(a) + '" y2="145"/><text class="aut-tk" x="' + xs(a) + '" y="158" text-anchor="middle">' + a + "</text>");
      s.push('<text class="aut-rl" x="8" y="54">Genuine</text><text class="aut-rl" x="8" y="112">Ikke-</text><text class="aut-rl" x="8" y="125">genuine</text>');
      // EER-område og terskel
      if (e.eksakt) s.push('<rect class="aut-eerband" x="' + xs(e.fra - 0.5) + '" y="20" width="' + (xs(e.til + 0.5) - xs(e.fra - 0.5)) + '" height="300"/>');
      GEN.forEach(function (v) { var bad = v < T; s.push('<circle class="aut-g' + (bad ? " aut-bad" : "") + '" cx="' + xs(v) + '" cy="50" r="7"/><text class="aut-dl" x="' + xs(v) + '" y="35" text-anchor="middle">' + v + "</text>"); });
      IMP.forEach(function (v) { var bad = v >= T; s.push('<rect class="aut-i' + (bad ? " aut-bad" : "") + '" x="' + (xs(v) - 6) + '" y="104" width="12" height="12"/><text class="aut-dl" x="' + xs(v) + '" y="132" text-anchor="middle">' + v + "</text>"); });
      // kurver FMR(T) og FNMR(T)
      var Y0 = 310, Y1 = 180, ys = function (p) { return Y0 - (Y0 - Y1) * p; };
      s.push('<line class="aut-ax" x1="' + X0 + '" y1="' + Y0 + '" x2="' + X1 + '" y2="' + Y0 + '"/><line class="aut-ax" x1="' + X0 + '" y1="' + Y1 + '" x2="' + X0 + '" y2="' + Y0 + '"/>');
      s.push('<text class="aut-tk" x="' + (X0 - 6) + '" y="' + (Y1 + 4) + '" text-anchor="end">1</text><text class="aut-tk" x="' + (X0 - 6) + '" y="' + (Y0 + 4) + '" text-anchor="end">0</text>');
      var pf = [], pn = [];
      for (var t = 0; t <= 100; t++) { var q = calc.rater(GEN, IMP, t); pf.push(xs(t) + "," + ys(q.FMR)); pn.push(xs(t) + "," + ys(q.FNMR)); }
      s.push('<polyline class="aut-fmr" points="' + pf.join(" ") + '"/><polyline class="aut-fnmr" points="' + pn.join(" ") + '"/>');
      s.push('<text class="aut-fmrl" x="' + (X0 + 8) + '" y="' + (Y1 + 14) + '">FMR</text><text class="aut-fnmrl" x="' + (X1 - 8) + '" y="' + (Y1 + 14) + '" text-anchor="end">FNMR</text>');
      if (e.eksakt) s.push('<circle class="aut-eer" cx="' + xs((e.fra + e.til) / 2) + '" cy="' + ys(e.eer) + '" r="5"/><text class="aut-tk" x="' + (xs((e.fra + e.til) / 2) + 8) + '" y="' + (ys(e.eer) - 8) + '">EER = ' + rate(e.eer) + "</text>");
      s.push('<line class="aut-T" x1="' + xs(T) + '" y1="18" x2="' + xs(T) + '" y2="' + Y0 + '"/><text class="aut-Tl" x="' + xs(T) + '" y="14" text-anchor="middle">T = ' + T + "</text>");
      s.push("</svg>");
      svgHost.innerHTML = s.join("");
      clear(stats);
      var t2 = el("table", { class: "aut-tab" });
      t2.appendChild(el("thead", {}, [el("tr", {}, ["", "Godtatt (S ≥ T)", "Avvist", "Rate"].map(function (h) { return el("th", { text: h }); }))]));
      t2.appendChild(el("tbody", {}, [
        el("tr", {}, [el("th", { text: "Genuine (10)" }), el("td", { text: String(r.gAcc) }), el("td", { text: String(10 - r.gAcc) }),
          el("td", { html: "FNMR = " + (10 - r.gAcc) + "/10 = <b>" + rate(r.FNMR) + "</b>, TMR = " + rate(r.TMR) })]),
        el("tr", {}, [el("th", { text: "Ikke-genuine (10)" }), el("td", { text: String(r.iAcc) }), el("td", { text: String(10 - r.iAcc) }),
          el("td", { html: "FMR = " + r.iAcc + "/10 = <b>" + rate(r.FMR) + "</b>, TNMR = " + rate(r.TNMR) })])
      ]));
      stats.appendChild(el("div", { class: "table-wrap" }, [t2]));
      var eq = Math.abs(r.FMR - r.FNMR) < 1e-12;
      note.textContent = (eq ? "Her er FMR = FNMR = " + rate(r.FMR) + ": det er EER for denne testen. " : "") +
        (IMP.indexOf(T) >= 0 || GEN.indexOf(T) >= 0 ? "En skåring på nøyaktig " + T + " regnes som match, fordi regelen er S ≥ T. " : "") +
        "Røde merker ligger på feil side av terskelen. Flytt T opp: FMR synker og FNMR stiger. Flytt T ned: omvendt.";
    }
    clear(host); host.appendChild(wrap);
    paint();
    return { settT: function (v) { T = +v; sl.value = String(T); paint(); } };
  }

  /* =====================================================
     5. FIDO: registrering og innlogging (sekvensdiagram)
     ===================================================== */
  function t3(eli5, normal, teknisk) { return { eli5: eli5, normal: normal, teknisk: teknisk }; }
  var SCEN = {
    ekte: {
      parts: ["Jonas (bruker)", "Klient (mobil med passnøkler)", "fjellbank.no (offentlige nøkler)"],
      msgs: [
        { s: 1, f: 2, t: 1, l: "1  utfordring C = «7f3a…»" },
        { s: 2, f: 1, t: 0, l: "PIN eller fingeravtrykk?", cls: "lok" },
        { s: 2, f: 0, t: 1, l: "2  lokal autentikator", cls: "lok" },
        { s: 3, self: 1, l: "domene fjellbank.no ✓ · velger passnøkkel · signerer C", cls: "ok" },
        { s: 4, f: 1, t: 2, l: "3  signert respons R" },
        { s: 5, self: 2, l: "verifiserer R med offentlig nøkkel ✓", cls: "ok" }
      ],
      etapper: true,
      steps: [
        t3("Tre parter: Jonas, mobilen hans og banken. Mobilen har en egen nøkkel for banken, og banken har bare en lås som passer til den.",
           "Tre parter: brukeren, klienten (enheten som lagrer passnøklene) og autentiseringstjeneren, som bare har de offentlige nøklene.",
           "Klienten har én passnøkkel per tjener, en privat nøkkel bundet til tjenerens domenenavn. Tjeneren har bare den tilsvarende offentlige nøkkelen, så det finnes ingen delt hemmelighet å stjele hos tjeneren."),
        t3("Banken sender et tilfeldig tall som mobilen skal «skrive under på».",
           "Pil 1: tjeneren sender en ny, tilfeldig utfordring C. Den er ny hver gang, så et gammelt svar kan ikke brukes om igjen.",
           "Pil 1: challenge C. Ferskheten hindrer avspilling, og C blir det klienten signerer i steg 3."),
        t3("Mobilen spør om PIN eller fingeren din, så den vet at det er deg som holder den.",
           "Pil 2, første etappe (lokal): brukeren autentiserer seg til klienten med PIN eller biometri. Dette forlater aldri enheten.",
           "Første etappe er lokal: PIN-en eller malen sammenlignes i enheten og sendes ikke til tjeneren. Det er det som gjør at enheten «låses opp» for akkurat denne brukeren."),
        t3("Mobilen sjekker navnet på døra: står det fjellbank.no, finner den riktig nøkkel og skriver under.",
           "Klienten, ikke brukeren, sjekker at domenet er fjellbank.no, velger passnøkkelen for akkurat det domenet og signerer C.",
           "R = Sig(C, K<sup>Jonas</sup><sub>priv</sub>) med nøkkelen for fjellbank.no. Domenesjekken gjøres av klienten og kan ikke overstyres av brukeren. Det er kjernen i phishingresistensen."),
        t3("Mobilen sender underskriften til banken.",
           "Pil 3, andre etappe (online): klienten sender den signerte responsen R til tjeneren. Ingen hemmelighet sendes over nettet.",
           "Andre etappe er challenge–respons mellom klient og tjener. Den private nøkkelen forlater ikke klienten; bare signaturen sendes."),
        t3("Banken sjekker underskriften med låsen sin. Den passer, og Jonas er logget inn.",
           "Tjeneren verifiserer R med den offentlige nøkkelen den lagret ved registreringen. Stemmer den, er Jonas logget inn.",
           "Tjeneren sjekker Ver(R, K<sup>Jonas</sup><sub>pub</sub>) mot C. Lekker tjenerens database, får angriperen bare offentlige nøkler, som ikke kan brukes til å logge inn.")
      ]
    },
    falsk: {
      parts: ["Jonas (bruker)", "Klient (mobil med passnøkler)", "fjellbank-sikker.no (falsk side)", "fjellbank.no (ekte)"],
      msgs: [
        { s: 1, f: 3, t: 2, l: "utfordring C" },
        { s: 1, f: 2, t: 1, l: "1  videresender C" },
        { s: 2, f: 0, t: 1, l: "2  lokal autentikator", cls: "lok" },
        { s: 3, self: 1, l: "domene fjellbank-sikker.no: ingen passnøkkel ✗", cls: "bad" },
        { s: 4, f: 2, t: 0, l: "«Passnøkkel feilet, skriv passordet»", cls: "bad" }
      ],
      steps: [
        t3("Jonas har fått en melding med en lenke til en side som ser ut som banken, men heter noe annet.",
           "Phishing: en SMS lurer Jonas til fjellbank-sikker.no. Siden ser ut som banken og står mellom Jonas og den ekte banken.",
           "Angriperen stiller seg mellom brukeren og den ekte tjeneren og vil videresende det klienten produserer. Med passord eller engangskode hadde det virket."),
        t3("Den falske siden henter et tall fra den ekte banken og sender det videre til mobilen.",
           "Den falske siden henter bankens utfordring C og sender den videre til klienten.",
           "Den falske siden kan godt videresende en gyldig C. Problemet for angriperen kommer i neste steg."),
        t3("Jonas legger fingeren på mobilen som vanlig.",
           "Jonas autentiserer seg lokalt med fingeravtrykk, akkurat som på den ekte siden.",
           "Den lokale etappen ser lik ut for brukeren. Brukeren trenger ikke se forskjell på domenene."),
        t3("Mobilen leser navnet på døra: fjellbank-sikker.no. Den har ingen nøkkel med det navnet, så den skriver ikke under på noe.",
           "Klienten leter etter en passnøkkel for fjellbank-sikker.no og finner ingen. Den signerer ingenting, så angriperen får ikke noe å videresende.",
           "Passnøkkelen for fjellbank.no er bundet til det domenet, og klienten håndhever bindingen. Brukeren kan ikke velge å bruke den mot et annet domene. Phishingvernet hviler på klienten, ikke på brukerens årvåkenhet."),
        t3("Den falske siden prøver et triks: «Det virket ikke, skriv passordet i stedet.» Gjør Jonas det, har tyven vunnet likevel.",
           "Nedgradering: siden ber om passordet i stedet. Skriver Jonas det, er phishingvernet borte. Derfor bør kontoen ikke ha et passord som reserve.",
           "Restangrep: nedgradering til en svakere metode, skadevare på plattformen som bryter domenesjekken, DNS-angrep, eller phishing mot skykontoen som synkroniserer passnøklene. Phishingresistensen gjelder passnøkkelen, ikke alt rundt den.")
      ]
    },
    reg: {
      parts: ["Jonas (bruker)", "Klient (mobil)", "fjellbank.no"],
      msgs: [
        { s: 1, f: 0, t: 2, l: "logger inn på vanlig måte, ber om passnøkkel" },
        { s: 2, f: 2, t: 1, l: "utfordring + domene + bruker-ID" },
        { s: 3, f: 0, t: 1, l: "PIN eller fingeravtrykk", cls: "lok" },
        { s: 4, self: 1, l: "lager nytt nøkkelpar for fjellbank.no", cls: "ok" },
        { s: 5, f: 1, t: 2, l: "offentlig nøkkel (+ signert utfordring)" },
        { s: 6, self: 2, l: "lagrer offentlig nøkkel på kontoen", cls: "ok" }
      ],
      steps: [
        t3("Før Jonas kan bruke en passnøkkel, må mobilen og banken bli kjent. Det kalles registrering.",
           "Registrering: før passnøkkelen kan brukes, må den lages og kobles til kontoen. Uten registrering finnes ingenting å sammenligne med.",
           "Registreringen avgjør mye av sikkerheten: er den svak, hjelper en sterk metode senere lite. Det er kravkategori a) for garantinivå (fane 6)."),
        t3("Jonas logger inn slik han pleier og sier at han vil lage en passnøkkel.",
           "Jonas logger inn med en eksisterende metode og ber om å opprette en passnøkkel.",
           "Første passnøkkel opprettes typisk etter vanlig innlogging. Den innloggingen er ikke phishingresistent, så registreringen er et sårbart øyeblikk."),
        t3("Banken sender et tall og navnet sitt til mobilen.",
           "Tjeneren sender en utfordring, sitt domenenavn og en bruker-ID.",
           "Domenenavnet blir bundet til den nye nøkkelen. Det er denne bindingen klienten håndhever ved hver senere innlogging."),
        t3("Mobilen spør om PIN eller fingeren, så bare Jonas kan lage nøkkelen.",
           "Jonas bekrefter lokalt med PIN eller biometri.",
           "Samme lokale autentikator som ved innlogging. Den bestemmer hvem som senere kan låse opp passnøkkelen."),
        t3("Mobilen lager et nøkkelpar: en hemmelig nøkkel den beholder, og en lås den kan gi bort.",
           "Klienten lager et nytt nøkkelpar for akkurat fjellbank.no. Den private nøkkelen er passnøkkelen og blir i klienten (eller i passordbanken som synkroniserer den).",
           "Ett nytt par per tjener: K<sup>Jonas</sup><sub>priv</sub> lagres sammen med domenet, K<sup>Jonas</sup><sub>pub</sub> skal til tjeneren. For NIST AAL3 må nøkkelen være bundet til enheten og kan ikke synkroniseres."),
        t3("Mobilen sender låsen (den offentlige nøkkelen) til banken.",
           "Klienten sender den offentlige nøkkelen til tjeneren, sammen med svaret på utfordringen.",
           "Bare K<sup>Jonas</sup><sub>pub</sub> forlater klienten. Den er ikke hemmelig, så den kan sendes og lagres uten kryptering."),
        t3("Banken legger låsen i arkivet sitt. Neste gang kan den sjekke underskriften til mobilen.",
           "Tjeneren lagrer den offentlige nøkkelen på kontoen. Neste innlogging går som i «Innlogging, ekte side».",
           "Tjeneren har nå ingenting som kan brukes til å logge inn som Jonas. Det er derfor en databaselekkasje er langt mindre alvorlig enn med passordhasher.")
      ]
    }
  };
  /* «Gjett før neste»: spørsmålet på steg i vises når studenten står på steg i − 1. */
  function sp(sporsmal, valg, fasit, forklaring) { return { sporsmal: sporsmal, valg: valg, fasit: fasit, forklaring: forklaring }; }
  SCEN.ekte.spor = {
    2: sp("Neste steg er den lokale etappen. Hvor sjekkes PIN-en eller fingeravtrykket?",
      ["Hos fjellbank.no", "I klienten (mobilen)", "Både i mobilen og hos banken"], 1,
      "Første etappe er lokal: PIN eller biometri sammenlignes i klienten og sendes aldri til tjeneren."),
    3: sp("Hva gjør klienten før den signerer utfordringen C?",
      ["Ber Jonas se nøye på adresselinja", "Sender PIN-en til tjeneren for kontroll", "Sjekker at domenet er fjellbank.no og velger passnøkkelen for akkurat det domenet", "Signerer alt den får, sjekken skjer hos tjeneren"], 2,
      "Klienten, ikke brukeren, sjekker domenet. Det er kjernen i phishingresistensen."),
    4: sp("Hva sender klienten (autentikatoren) tilbake til tjeneren i steg 3?",
      ["Den private nøkkelen", "Den signerte responsen R", "PIN-en", "En hash av passordet"], 1,
      "Bare signaturen R over C sendes. Den private nøkkelen forlater aldri klienten, og ingen hemmelighet går over nettet."),
    5: sp("Hva bruker tjeneren for å sjekke R?",
      ["Den offentlige nøkkelen den lagret ved registreringen", "Jonas' private nøkkel", "En kopi av PIN-en"], 0,
      "Tjeneren har bare den offentlige nøkkelen. Den holder til å verifisere, men ikke til å lage en signatur.")
  };
  SCEN.falsk.spor = {
    1: sp("Den falske siden har fått en ekte utfordring C fra banken. Kan den sende C videre til mobilen?",
      ["Nei, C er kryptert slik at bare banken kan lese den", "Ja, C er ikke hemmelig, og den falske siden kan videresende den"], 1,
      "C er et tilfeldig tall, ikke en hemmelighet. Vernet ligger ikke i C, men i hva klienten gjør med den."),
    3: sp("Hvorfor virker ikke phishing her? Hva gjør klienten?",
      ["Signerer med nøkkelen for fjellbank.no, men banken avviser den", "Viser en advarsel som Jonas kan trykke seg forbi", "Finner ingen passnøkkel for fjellbank-sikker.no og signerer ingenting", "Ingenting, phishingvernet er at Jonas ser at adressen er feil"], 2,
      "Passnøkkelen er bundet til domenet fjellbank.no, og klienten håndhever bindingen. Angriperen får ingen signatur å videresende, og brukeren kan ikke overstyre det."),
    4: sp("Hva er angriperens beste mulighet etter at passnøkkelen ikke virket?",
      ["Lure Jonas over på en svakere metode, for eksempel passord", "Regne ut den private nøkkelen fra utfordringen C", "Bruke en signert respons fra et tidligere besøk på nytt"], 0,
      "Nedgradering. Gamle svar hjelper ikke fordi C er ny hver gang, og den private nøkkelen kan ikke regnes ut. Derfor bør kontoen helst ikke ha passord som reserve.")
  };
  SCEN.reg.spor = {
    4: sp("Hva lager klienten ved registreringen?",
      ["Ett nøkkelpar som brukes mot alle tjenester", "Et nytt nøkkelpar for akkurat fjellbank.no", "Et passord som sendes til banken"], 1,
      "Ett nytt par per tjener, bundet til tjenerens domene. Det er det som gjør at nøkkelen ikke virker mot en falsk side."),
    5: sp("Hva sendes til banken?",
      ["Den offentlige nøkkelen", "Den private nøkkelen", "PIN-en eller fingeravtrykket"], 0,
      "Bare den offentlige nøkkelen. Den er ikke hemmelig, så den kan sendes og lagres åpent."),
    6: sp("Bankens database lekker senere. Hva får angriperen om Jonas?",
      ["Passnøkkelen hans", "En hash som kan knekkes med ordliste", "Bare en offentlig nøkkel, som ikke kan brukes til å logge inn"], 2,
      "Tjeneren lagrer ingenting som kan brukes til å logge inn. Derfor er en lekkasje langt mindre alvorlig enn med passordhasher.")
  };

  function seqSvg(sc, upto, idn) {
    var n = sc.parts.length, W = 660, top = 66, dy = 46, shown = sc.msgs.filter(function (m) { return m.s <= upto; });
    var H = top + Math.max(1, sc.msgs.length) * dy + (sc.etapper ? 48 : 14);
    var xs = function (i) { return 20 + (W - 40) * (i + 0.5) / n; };
    var s = ['<svg class="viz-svg aut-seq-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Sekvensdiagram"><defs>' +
      '<marker id="' + idn + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="aut-mk"/></marker></defs>'];
    sc.parts.forEach(function (p, i) {
      var bw = (W - 40) / n - 12;
      // Navn på første linje og parentesen på andre, så lange navn ikke flyter inn i nabo-boksen (fire parter).
      var k = p.indexOf(" ("), l1 = k > 0 ? p.slice(0, k) : p, l2 = k > 0 ? p.slice(k + 1) : "";
      s.push('<rect class="aut-part" x="' + (xs(i) - bw / 2) + '" y="6" width="' + bw + '" height="44" rx="6"/>');
      s.push('<text class="aut-partl" x="' + xs(i) + '" y="' + (l2 ? 24 : 33) + '" text-anchor="middle">' + esc(l1) + "</text>");
      if (l2) s.push('<text class="aut-tk" x="' + xs(i) + '" y="41" text-anchor="middle">' + esc(l2) + "</text>");
      s.push('<line class="aut-life" x1="' + xs(i) + '" y1="50" x2="' + xs(i) + '" y2="' + (H - (sc.etapper ? 40 : 6)) + '"/>');
    });
    shown.forEach(function (m, k) {
      var y = top + 14 + sc.msgs.indexOf(m) * dy, cur = m.s === upto ? " cur" : "";
      if (m.self != null) {
        var x = xs(m.self), w = Math.min(300, 14 + m.l.length * 6.6), x0 = Math.max(6, Math.min(W - 6 - w, x - w / 2));
        s.push('<rect class="aut-self ' + (m.cls || "") + cur + '" x="' + x0 + '" y="' + (y - 16) + '" width="' + w + '" height="26" rx="5"/>');
        s.push('<text class="aut-msgl' + cur + '" x="' + (x0 + w / 2) + '" y="' + (y + 2) + '" text-anchor="middle">' + esc(m.l) + "</text>");
      } else {
        var x1 = xs(m.f), x2 = xs(m.t);
        s.push('<line class="aut-msg ' + (m.cls || "") + cur + '" x1="' + x1 + '" y1="' + y + '" x2="' + (x2 + (x2 > x1 ? -3 : 3)) + '" y2="' + y + '" marker-end="url(#' + idn + ')"/>');
        s.push('<text class="aut-msgl' + cur + '" x="' + ((x1 + x2) / 2) + '" y="' + (y - 7) + '" text-anchor="middle">' + esc(m.l) + "</text>");
      }
    });
    if (sc.etapper) {
      var yb = H - 30;
      [[0, 1, "1. etappe (lokal)"], [1, 2, "2. etappe (online)"]].forEach(function (b) {
        var a = xs(b[0]) + 6, c = xs(b[1]) - 6;
        s.push('<path class="aut-brace" d="M' + a + "," + (yb - 8) + " L" + a + "," + yb + " L" + c + "," + yb + " L" + c + "," + (yb - 8) + '"/>');
        s.push('<text class="aut-partl" x="' + ((a + c) / 2) + '" y="' + (yb + 18) + '" text-anchor="middle">' + b[2] + "</text>");
      });
    }
    s.push("</svg>");
    return s.join("");
  }
  function fido(host) {
    host = host0(host); if (!host || !IN.stepPlayer) return;
    var idn = "aut-arr-" + (++uid);
    return IN.stepPlayer(host, {
      presets: { "Innlogging, ekte side": ["ekte"], "Innlogging, falsk side": ["falsk"], "Registrering": ["reg"] },
      customInput: false,
      speed: 2200,
      generate: function (inp) {
        var sc = SCEN[inp[0]] || SCEN.ekte;
        // Etiketten følger pilnumrene i figuren («Pil 3»), ikke spillerens stegnummer, så de ikke kolliderer.
        function etikett(i) {
          if (!i) return "Oversikt";
          var ms = sc.msgs.filter(function (m) { return m.s === i; });
          for (var k = 0; k < ms.length; k++) { var mm = /^(\d+)\s+(.*)$/.exec(ms[k].l); if (mm) return "Pil " + mm[1] + ": " + mm[2]; }
          var l = ms.length ? ms[0].l.split(" · ")[0] : "";
          return l ? l.charAt(0).toUpperCase() + l.slice(1) : "Steg " + i;
        }
        return sc.steps.map(function (txt, i) { return { sc: sc, upto: i, text: txt, tag: etikett(i), spor: sc.spor && sc.spor[i] || undefined }; });
      },
      render: function (step, ctx) {
        clear(ctx.stage);
        var d = el("div", { class: "aut-seq" }); d.innerHTML = seqSvg(step.sc, step.upto, idn);
        ctx.stage.appendChild(d);
      }
    });
  }

  /* =====================================================
     6. Konsekvens → garantinivå
     ===================================================== */
  var NIVAA = [
    { k: "Liten", eidas: "Low", digdir: "LAVT", eks: "Melde fra om et hull i veien med navn", eid: [] },
    { k: "Betydelig", eidas: "Substantial", digdir: "BETYDELIG", eks: "Søke om parkeringstillatelse", eid: [] },
    { k: "Alvorlig", eidas: "High", digdir: "HØYT", eks: "Se sin egen barnevernssak", eid: [] }
  ];
  var EID = [
    { navn: "SMS-PIN", niv: 0, statlig: false, note: "for virksomheter" }, { navn: "Altinn-PIN", niv: 0, statlig: false, note: "for virksomheter" },
    { navn: "MinID", niv: 1, statlig: true }, { navn: "BankID", niv: 2, statlig: false }, { navn: "Buypass", niv: 2, statlig: false },
    { navn: "Commfides", niv: 2, statlig: false }, { navn: "Foretaks-ID", niv: 2, statlig: false, note: "for virksomheter" }
  ];
  var NIV_SONER = [
    { id: "lav", label: "Low / LAVT", hint: "liten konsekvens" },
    { id: "bet", label: "Substantial / BETYDELIG", hint: "betydelig konsekvens" },
    { id: "hoy", label: "High / HØYT", hint: "alvorlig konsekvens" }
  ];
  var NIV_ID = ["lav", "bet", "hoy"];
  /* Egne eksempler (Fjellvik kommune). Konsekvensen står i teksten, så nivået følger av regelen
     liten → Low, betydelig → Substantial, alvorlig → High (autentiseringslysarket s. 48). */
  var NIV_SIT = [
    { id: "hull", niv: 0, html: "Melde fra om et hull i veien med navnet ditt", forklaring: "Liten konsekvens: i verste fall sender noen en melding i ditt navn. Low / LAVT holder." },
    { id: "hall", niv: 0, html: "Bestille tid i kommunens idrettshall", forklaring: "Liten konsekvens: feil person kan reservere en time i ditt navn, og det rettes lett opp. Low / LAVT." },
    { id: "park", niv: 1, html: "Søke om parkeringstillatelse", forklaring: "Betydelig konsekvens: feil person kan få en tillatelse i ditt navn. Substantial / BETYDELIG, for eksempel MinID." },
    { id: "bygg", niv: 1, html: "Søke om byggetillatelse for en garasje på tomta di", forklaring: "Betydelig: feil person kan sette i gang en sak om eiendommen din, men den behandles og kan stanses. Substantial / BETYDELIG." },
    { id: "barnevern", niv: 2, html: "Se barnevernssaken din", forklaring: "Alvorlig: svært sensitive opplysninger om barn og familie. High / HØYT, for eksempel BankID." },
    { id: "helse", niv: 2, html: "Lese helsejournalen din", forklaring: "Alvorlig: helsedata er svært sensitive og kan ikke «tas tilbake» når de er lest. High / HØYT." }
  ];
  function bucketSpec(id, prompt, items, oppsummering, kilde) {
    var ans = {};
    items.forEach(function (it) { ans[it.id] = NIV_ID[it.niv]; });
    return { id: id, prompt: prompt, zones: NIV_SONER, items: items.map(function (it) { return { id: it.id, html: it.html, forklaring: it.forklaring }; }),
      answer: ans, oppsummering: oppsummering, kilde: kilde, opphav: { type: "egen", kilder: ["autentiseringslysarket s. 40–48"] } };
  }
  function eidItems() {
    return EID.map(function (e) {
      var nv = ["LAVT", "BETYDELIG", "HØYT"][e.niv];
      return { id: e.navn.toLowerCase().replace(/[^a-z]/g, ""), niv: e.niv, html: e.navn + (e.note ? " <span class=\"small muted\">(" + e.note + ")</span>" : ""),
        forklaring: e.navn + " holder " + nv + (e.statlig ? ". Den eneste statlige eID-en." : ".") };
    });
  }
  calc.nivSituasjoner = NIV_SIT; calc.nivEid = eidItems;
  function nivaa(host) {
    host = host0(host); if (!host) return;
    clear(host);
    var wrap = el("div", { class: "aut-niv-ov" });
    var h1 = el("div"), h2 = el("div"), oppslag = el("div");
    wrap.appendChild(el("h5", { class: "aut-h", text: "1. Hvilket nivå trenger tjenesten?" }));
    wrap.appendChild(h1);
    wrap.appendChild(el("h5", { class: "aut-h", text: "2. Hvilket nivå holder eID-en?" }));
    wrap.appendChild(h2);
    wrap.appendChild(el("details", { class: "aut-more" }, [el("summary", { text: "Oppslag: konsekvens → nivå og eID-er (åpne etter øvingene)" }), oppslag]));
    host.appendChild(wrap);
    if (IN.bucketTask) {
      IN.bucketTask(h1, bucketSpec("aut-niv-sit", {
        eli5: "Jo verre det er om noen later som de er deg, jo strengere sjekk. Legg hver tjeneste i nivået den trenger.",
        normal: "Fjellvik kommune lager nye nettjenester. Spør hva som skjer hvis feil person logger inn, og legg hver tjeneste i garantinivået den trenger.",
        teknisk: "Plasser tjenestene etter eIDAS-regelen: konsekvensen av en autentiseringsfeil (identitetstyveri) bestemmer nivået. Nivået skal ikke være høyere enn konsekvensen tilsier."
      }, NIV_SIT, "Nivået følger av konsekvensen hvis feil person kommer inn: liten → Low, betydelig → Substantial, alvorlig → High. Å kreve mer enn nødvendig er sløsing og gjør tjenesten tungvint.",
        { ref: "Lysarket brukerautentisering, s. 48 (eIDAS: konsekvens → nivå). Tjenestene er egne eksempler", egneOrd: true }), { instant: false });
      IN.bucketTask(h2, bucketSpec("aut-niv-eid", "Legg hver norske eID i det høyeste nivået den holder (Digdirs nivåer).", eidItems(),
        "BankID, Buypass, Commfides og Foretaks-ID holder HØYT, MinID holder BETYDELIG, og SMS-PIN og Altinn-PIN (for virksomheter) holder LAVT. Bare MinID er statlig (H2024 30). H2022 8.4 kaller MinIDs nivå «MODERAT» (ordet er ikke forklart i kursets kilder).",
        { ref: "Lysarket om IAM, s. 21–22 og 25", egneOrd: true }), { instant: false });
    }
    nivaaOppslag(oppslag);
  }
  function nivaaOppslag(host) {
    host = host0(host); if (!host) return;
    var sel = 1;
    var wrap = el("div", { class: "aut-viz aut-niv" });
    var bar = row("aut-seg", [el("span", { class: "aut-k", text: "Konsekvens hvis feil person logger inn:" })]);
    var btns = NIVAA.map(function (n, i) { var b = el("button", { class: "btn sm", type: "button", text: n.k, onclick: function () { sel = i; paint(); } }); bar.appendChild(b); return b; });
    var out = el("div");
    wrap.appendChild(bar); wrap.appendChild(out);
    function paint() {
      btns.forEach(function (b, i) { b.setAttribute("aria-pressed", i === sel ? "true" : "false"); });
      var n = NIVAA[sel], ok = EID.filter(function (e) { return e.niv >= sel; });
      clear(out);
      out.appendChild(el("p", { html: "eIDAS: <b>" + n.eidas + "</b> · Digdir: <b>" + n.digdir + "</b> · Eksempel fra Fjellvik kommune: " + n.eks + "." }));
      var lev = el("div", { class: "aut-chips" });
      EID.forEach(function (e) {
        var on = e.niv >= sel;
        lev.appendChild(el("span", { class: "aut-chip" + (on ? " on" : ""), title: on ? "Holder nivået" : "For lavt nivå",
          text: (on ? "✓ " : "✗ ") + e.navn + " (" + ["LAVT", "BETYDELIG", "HØYT"][e.niv] + (e.statlig ? ", statlig" : "") + (e.note ? ", " + e.note : "") + ")" }));
      });
      out.appendChild(el("p", { class: "small", text: "eID-er som holder nivået (" + ok.length + " av " + EID.length + "):" }));
      out.appendChild(lev);
      out.appendChild(el("p", { class: "small muted", text: sel === 2 ? "Høyt nivå koster mer for brukeren og tjenesten. Det velges fordi konsekvensen er alvorlig." :
        "En sterkere eID enn nivået krever, er lov å bruke, men å kreve mer enn konsekvensen tilsier, er sløsing." }));
    }
    clear(host); host.appendChild(wrap);
    paint();
  }


  /* ---------- Figur til øvingen ov-aut-5 (07-autentisering.html) ----------
     Gjenbruker IN.FIGURER["H2025-25"] (fig-h2025.js, uendret: fem plassholdere 0–4) og legger til felt 5,
     klammen «Lokal etappe» over bruker og klient (lysarket om passnøkler deler innloggingen i en lokal og en online etappe).
     Bred figur: klammen er en HTML-stripe over tegningen, like bred som bruker + klient (x 20–590 av 1000).
     Smal (stående) figur: klammen tegnes til høyre for bruker og klient, med merke 6, og feltet står sist i lista.
     Byttet mellom bred og smal gjøres av H2025-25-funksjonen; her følges det med en MutationObserver på stilen. */
  IN.FIGURER = IN.FIGURER || {};
  IN.FIGURER["ov-aut-5"] = function (host) {
    var tegn = IN.FIGURER["H2025-25"], F = IN.fig;
    if (!tegn || !F) return;
    tegn(host, { title: "Innlogging med passnøkler", figur: { beskrivelse:
      "Bruker til venstre, klient (bærbar PC) i midten og autentiseringstjenere til høyre. Felt 1 på den buede pila fra bruker til klient, " +
      "felt 2 inne i klienten, felt 3 på den buede pila fra tjenerne til klienten (øverst), felt 4 på den buede pila fra klienten til tjenerne (nederst), " +
      "felt 5 i tjenerboksen og felt 6 på en klamme over bruker og klient." } });
    var bred = host.children[0], smal = host.children[1];
    if (!bred || !smal) return;
    var ss = smal.querySelector("svg"), liste = smal.lastElementChild;
    if (ss) {
      var NS = ss.namespaceURI;
      ss.setAttribute("viewBox", "0 0 384 745");
      ss.style.maxWidth = "430px";
      var p = document.createElementNS(NS, "path");
      p.setAttribute("d", "M340 14 Q352 14 352 26 V428 Q352 440 340 440");
      p.setAttribute("style", "fill:none;stroke:var(--fig-strek);stroke-width:2.2");
      ss.appendChild(p);
      var g = document.createElementNS(NS, "g"), c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", 368); c.setAttribute("cy", 227); c.setAttribute("r", 13);
      c.setAttribute("style", "fill:var(--color-surface-container-lowest);stroke:var(--color-primary);stroke-width:2;stroke-dasharray:3 2");
      g.appendChild(c); ss.appendChild(g);
      F.tekst(g, 368, 227, "6", { fet: true, str: 16 });
    }
    var stripe = el("div", { style: "width:57%;margin-left:2%;display:flex;flex-direction:column;align-items:center;gap:4px;margin-bottom:2px" });
    var klamme = el("div", { "aria-hidden": "true", style: "align-self:stretch;height:12px;border:2.2px solid var(--fig-strek);border-bottom:0;border-radius:10px 10px 0 0" });
    stripe.appendChild(klamme);
    host.insertBefore(stripe, bred);
    var ph = F.felt(null, 5, { etikett: "6" }), et = ph.querySelector(".fig-felt-et");
    function sett() {
      var erBred = bred.style.display !== "none";
      stripe.style.display = erBred ? "flex" : "none";
      if (erBred) {
        ph.style.cssText = "max-width:none;min-height:0;width:31.6%";
        if (et) et.style.display = "none";
        stripe.insertBefore(ph, klamme);
      } else {
        ph.style.cssText = "";
        if (et) et.style.display = "";
        liste.appendChild(ph);
      }
    }
    sett();
    if (window.MutationObserver) new MutationObserver(sett).observe(bred, { attributes: true, attributeFilter: ["style"] });
  };

  IN.vizAut = { calc: calc, selfTest: selfTest, noekkelrom: noekkelrom, kalkulator: kalkulator, nivaaOppslag: nivaaOppslag, salt: salt, otp: otp, biometri: biometri, fido: fido, nivaa: nivaa,
    fmt: { sci: sci, tid: tid, grp: grp } };
})();
