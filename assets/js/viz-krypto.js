/* ============================================================
   IN2120 guide · viz-krypto.js
   Visualiseringer for blokk 2 (kryptografi). Alle tall regnes ut her.

   IN.krypto.E(x, k), .D(y, k)        lekechifferet (4 bit): E = (x ⊕ k) rotert én plass mot venstre
   IN.krypto.sha256(tekst) → hex       ekte SHA-256 (UTF-8), uten nettkall
   IN.krypto.modpow(g, e, p)
   IN.krypto.nokkelrom(host)           to IN.regnForst: snitt for n bit, og A^L (Vigenère)
   IN.krypto.xorOv(host)               regn selv C = M ⊕ K (8 bit), KR.xorSjekk er ren
   IN.krypto.xor(host)                 stegspiller: OTP og nøkkelgjenbruk (med spor)
   IN.krypto.bitflipp(host)            bit-flipping i strømchiffer (beløp 5 kr)
   IN.krypto.moduser(host)             stegspiller: ECB, CBC, CTR (kryptering og dekryptering), med spor
   IN.krypto.pingvin(host)             klartekst / ECB / CTR som 8×8-bilde
   IN.krypto.hashTest(host)            IN.matrise: x + 1, x mod 16 og SHA-256 mot de fem kravene
   IN.krypto.skred(host)               SHA-256 av to tekster og antall bit som er ulike
   IN.krypto.mac(host)                 stegspiller: MAC-flyt (ærlig, Mallory, dommer), med spor
   IN.krypto.hybrid(host)              stegspiller: hybrid kryptering og lekket privatnøkkel
   IN.krypto.lekk(host)                hybrid mot DH når langtidsnøkkelen lekker (forutsi først)
   IN.krypto.dh(host)                  stegspiller: Diffie–Hellman med p = 23, g = 5 (regn gᵃ og gᵃᵇ som spor)
   IN.krypto.signatur(host)            stegspiller: signaturflyt med hash
   IN.krypto.mekanismer(host)          IN.matrise: kryptering, hash, MAC, signatur × K, I, autentisitet, ubenektelighet, nøkkel
   IN.krypto.pqc(host)                 IN.bucketTask: rammes av kvantedatamaskin, og hva erstatter
   Klassisk script. Lastes etter core.js, stepplayer.js, dra.js og ovelse.js.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;
  var KR = (IN.krypto = IN.krypto || {});

  /* ---------- Hjelpere ---------- */
  function bits(n, w) { var s = (n >>> 0).toString(2); while (s.length < (w || 4)) s = "0" + s; return s; }
  function pb(s) { return parseInt(s, 2); }
  function rotl4(x) { return ((x << 1) | (x >> 3)) & 15; }
  function rotr4(x) { return ((x >> 1) | ((x & 1) << 3)) & 15; }
  KR.bits = bits; KR.rotl4 = rotl4; KR.rotr4 = rotr4;
  KR.E = function (x, k) { return rotl4((x ^ k) & 15); };
  KR.D = function (y, k) { return (rotr4(y) ^ k) & 15; };
  KR.modpow = function (g, e, p) { var r = 1; for (var i = 0; i < e; i++) r = (r * g) % p; return r; };
  var SUB = "₀₁₂₃₄₅₆₇₈₉", SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  function sub(n) { return String(n).split("").map(function (c) { return /\d/.test(c) ? SUB[+c] : c === "i" ? "ᵢ" : c === "−" ? "₋" : c; }).join(""); }
  function sup(n) { return String(n).replace(/-/g, "⁻").split("").map(function (c) { return /\d/.test(c) ? SUP[+c] : c; }).join(""); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function host$(h) { return typeof h === "string" ? IN.qs(h) : h; }
  var KPRIV = function (e) { return "K<sup>" + e + "</sup><sub>priv</sub>"; };
  var KPUB = function (e) { return "K<sup>" + e + "</sup><sub>pub</sub>"; };
  function toggleBtn(label, on, fn) {
    var b = el("button", { class: "btn sm", type: "button", text: label, "aria-pressed": on ? "true" : "false" });
    b.addEventListener("click", function () { var v = b.getAttribute("aria-pressed") !== "true"; b.setAttribute("aria-pressed", v ? "true" : "false"); fn(v); });
    return b;
  }
  function player(host, opts) {
    host = host$(host); if (!host) return null;
    host.classList.add("kr-host");
    // stepPlayer kaller render(steg, ctx); tegnefunksjonene her tar (stage, steg, ctx).
    var draw = opts.render;
    opts.render = function (s, ctx) { draw(ctx.stage, s, ctx); };
    return IN.stepPlayer(host, opts);
  }

  /* ---------- SHA-256 (FIPS 180-4), for UTF-8-tekst ---------- */
  var KS = [];
  (function () {
    var n = 2, c = 0;
    function frac(x) { return ((x - Math.floor(x)) * 4294967296) >>> 0; }
    while (c < 64) {
      var prime = true;
      for (var d = 2; d * d <= n; d++) if (n % d === 0) { prime = false; break; }
      if (prime) { KS.push(frac(Math.pow(n, 1 / 3))); c++; }
      n++;
    }
  })();
  function utf8(s) {
    var out = [], i, c;
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) { c = 0x10000 + ((c - 0xd800) << 10) + (s.charCodeAt(++i) - 0xdc00); }
      if (c < 0x80) out.push(c);
      else if (c < 0x800) out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
      else if (c < 0x10000) out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
      else out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
  }
  KR.sha256 = function (str) {
    var m = utf8(String(str)), L = m.length * 8;
    m.push(0x80);
    while (m.length % 64 !== 56) m.push(0);
    var hi = Math.floor(L / 4294967296), lo = L >>> 0;
    m.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255, (lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
    var w = new Array(64);
    for (var off = 0; off < m.length; off += 64) {
      for (var t = 0; t < 16; t++) w[t] = (m[off + 4 * t] << 24) | (m[off + 4 * t + 1] << 16) | (m[off + 4 * t + 2] << 8) | m[off + 4 * t + 3];
      for (t = 16; t < 64; t++) {
        var s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
        var s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
        w[t] = (w[t - 16] + s0 + w[t - 7] + s1) | 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (t = 0; t < 64; t++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + KS[t] + w[t]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + mj) | 0;
        h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
      H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
    }
    return H.map(function (x) { var s = (x >>> 0).toString(16); while (s.length < 8) s = "0" + s; return s; }).join("");
  };
  function hexBitDiff(a, b) {
    var n = 0;
    for (var i = 0; i < a.length; i++) { var x = parseInt(a[i], 16) ^ parseInt(b[i], 16); while (x) { n += x & 1; x >>= 1; } }
    return n;
  }
  KR.hexBitDiff = hexBitDiff;

  /* ---------- Tallformat ---------- */
  function grupper(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function vit(log10) {   // 10^log10 som «3,4 · 10³⁸» eller vanlig tall
    if (log10 < 15) { var v = Math.pow(10, log10); return grupper(Math.round(v)); }
    var e = Math.floor(log10), m = Math.pow(10, log10 - e);
    if (m >= 9.95) { m = 1; e++; }
    return String(m.toFixed(1)).replace(".", ",") + " · 10" + sup(e);
  }
  function tid(log10s) {
    var s = Math.pow(10, log10s);
    if (log10s < -3) return "under ett millisekund";
    if (s < 1) return "under ett sekund";
    if (s < 120) return "ca. " + Math.round(s) + " sekunder";
    if (s < 7200) return "ca. " + Math.round(s / 60) + " minutter";
    if (s < 2 * 86400) return "ca. " + Math.round(s / 3600) + " timer";
    if (s < 2 * 31557600) return "ca. " + Math.round(s / 86400) + " døgn";
    var ly = log10s - Math.log10(31557600);
    return "ca. " + vit(ly) + " år";
  }
  KR.tid = tid; KR.vit = vit;

  /* ======================================================
     Nøkkelrom: regn først (IN.regnForst)
     ====================================================== */
  var L10_2 = Math.log10(2);
  KR.nokkelSnitt = function (n) { return Math.pow(2, n - 1); };
  KR.nokkelAlf = function (A, L) { return Math.pow(A, L); };
  KR.nokkelrom = function (host) {
    host = host$(host); if (!host || !IN.regnForst) return;
    clear(host);
    var h1 = el("div"), h2 = el("div");
    host.appendChild(el("p", { class: "kr-oppg", html: "<b>a)</b> Fullt nøkkelsøk med n-bits nøkkel" }));
    host.appendChild(h1);
    host.appendChild(el("p", { class: "kr-oppg", html: "<b>b)</b> Nøkkel som et kodeord (som Vigenère)" }));
    host.appendChild(h2);

    IN.regnForst(h1, {
      id: "krypto-nokkelrom-bit",
      sporsmal: function (inn) {
        return "En nøkkel har <b>" + inn.n + " bit</b>. Hvor mange nøkler må en angriper <b>i snitt</b> prøve ved fullt nøkkelsøk?";
      },
      inndata: [
        { navn: "n", etikett: "Antall bit n", verdi: 56, min: 8, max: 128, steg: 1 },
        { navn: "v", etikett: "Angriperen prøver 10<sup>v</sup> nøkler per sekund, v =", verdi: 12, min: 6, max: 15, steg: 1 }
      ],
      fasit: function (inn) { return KR.nokkelSnitt(inn.n); },
      enhet: "nøkler",
      fasitTekst: function (inn) { return "2" + sup(inn.n - 1) + " = 2" + sup(inn.n) + "/2 ≈ " + vit((inn.n - 1) * L10_2) + " nøkler"; },
      vanligeFeil: [
        { verdi: function (inn) { return Math.pow(2, inn.n); }, hint: "Det er antall mulige nøkler, 2<sup>n</sup>. I snitt finner angriperen nøkkelen etter halvparten." },
        { verdi: function (inn) { return inn.n * inn.n; }, hint: "Nøkkelrommet er 2<sup>n</sup>, ikke n²." },
        { verdi: function (inn) { return 2 * inn.n; }, hint: "Nøkkelrommet er 2<sup>n</sup> (2 opphøyd i n), ikke 2 · n." },
        { verdi: function (inn) { return inn.n / 2; }, hint: "n er antall bit. Antall nøkler er 2<sup>n</sup>, og snittet er halvparten av det." }
      ],
      forklaring: function (inn) {
        var t = tid((inn.n - 1) * L10_2 - inn.v);
        return {
          eli5: "<p>Hver bit kan være 0 eller 1, så hver ny bit dobler antall nøkler. Med " + inn.n + " bit blir det 2 · 2 · … · 2 = 2" + sup(inn.n) + ". En tyv som prøver alle, treffer i snitt etter halvparten. Med 10" + sup(inn.v) + " forsøk i sekundet tar det " + t + ".</p>",
          normal: "<p>Med n bit finnes 2<sup>n</sup> nøkler, og i snitt må angriperen prøve halvparten: 2<sup>n</sup>/2 = 2<sup>n−1</sup>. Her er det 2" + sup(inn.n - 1) + " ≈ " + vit((inn.n - 1) * L10_2) + ".</p><p>Med 10" + sup(inn.v) + " nøkler per sekund tar det i snitt <b>" + t + "</b>. Én bit mer dobler tiden.</p>",
          teknisk: "<p>|K| = 2<sup>n</sup>, og forventet antall forsøk ved uttømmende søk er |K|/2 = 2<sup>n−1</sup> ≈ " + vit((inn.n - 1) * L10_2) + ". Tid i snitt: 2<sup>n−1</sup> / 10" + sup(inn.v) + " s, altså " + t + ".</p><p>Stort nøkkelrom er nødvendig, men ikke nok: algoritmen må også tåle kryptanalyse. Substitusjonschiffer og Vigenère knekkes med frekvensanalyse uansett nøkkelrom.</p>"
        };
      }
    });

    IN.regnForst(h2, {
      id: "krypto-nokkelrom-alf",
      sporsmal: function (inn) {
        return "Nøkkelen er et kodeord på <b>" + inn.L + "</b> tegn, og hvert tegn velges fritt blant <b>" + inn.A + "</b> tegn" + (inn.A === 29 ? " (det norske alfabetet)" : inn.A === 26 ? " (det engelske alfabetet)" : "") + ". Hvor mange ulike nøkler finnes?";
      },
      inndata: [
        { navn: "A", etikett: "Tegn å velge mellom", verdi: 29, min: 26, max: 95, steg: 1 },
        { navn: "L", etikett: "Lengde på kodeordet", verdi: 5, min: 1, max: 12, steg: 1 }
      ],
      fasit: function (inn) { return KR.nokkelAlf(inn.A, inn.L); },
      enhet: "nøkler",
      fasitTekst: function (inn) { return inn.A + sup(inn.L) + " = " + vit(inn.L * Math.log10(inn.A)) + " nøkler (≈ 2" + sup(Math.round(inn.L * Math.log2(inn.A))) + ")"; },
      vanligeFeil: [
        { verdi: function (inn) { return Math.pow(26, inn.L); }, hint: "Du har bare regnet med 26 tegn. Bruk antallet i oppgaven: det norske alfabetet har 29 (med æ, ø og å), og 26<sup>K</sup> ga halv uttelling i H2025 11." },
        { verdi: function (inn) { return Math.pow(inn.L, inn.A); }, hint: "Grunntall og eksponent er byttet om. Det er antall tegn opphøyd i lengden." },
        { verdi: function (inn) { return inn.A * inn.L; }, hint: "Valgene for hver posisjon ganges med hverandre: A · A · … · A, ikke A · L." },
        { verdi: function (inn) { return Math.pow(inn.A, inn.L) / 2; }, hint: "Det er snittet for et fullt søk. Spørsmålet gjelder alle nøklene." }
      ],
      forklaring: function (inn) {
        var bitv = String(Math.round(inn.L * Math.log2(inn.A) * 10) / 10).replace(".", ",");
        return {
          eli5: "<p>Første tegn har " + inn.A + " valg, andre tegn har " + inn.A + " valg, og slik fortsetter det. Til sammen " + inn.A + " ganget med seg selv " + inn.L + " ganger.</p>",
          normal: "<p>Hver av de " + inn.L + " posisjonene har " + inn.A + " valg, så nøkkelrommet er " + inn.A + sup(inn.L) + ". Det tilsvarer omtrent " + bitv + " bit.</p><p>For Vigenère hjelper det lite: angriperen finner først kodeordlengden og tar så frekvensanalyse på hvert alfabet for seg.</p>",
          teknisk: "<p>|K| = A<sup>L</sup> = " + inn.A + sup(inn.L) + ", og nøkkelstørrelsen er L · log₂A ≈ " + bitv + " bit. Vigenère knekkes likevel uten å prøve alle nøklene, fordi hver forskyvning bevarer bokstavfrekvensene i sitt alfabet.</p>"
        };
      }
    });
  };

  /* ======================================================
     XOR og engangsnøkkel
     ====================================================== */
  function bitRow(label, s, opts) {
    opts = opts || {};
    var row = el("div", { class: "kr-bitrow" + (opts.cls ? " " + opts.cls : "") });
    row.appendChild(el("span", { class: "kr-bitlbl", html: label }));
    for (var i = 0; i < s.length; i++) {
      var c = s[i], cls = "kr-bit" + (c === "1" ? " one" : c === "0" ? " zero" : " unk") + (opts.hl === i ? " hl" : "") + (opts.strike ? " strike" : "");
      row.appendChild(el("span", { class: cls, text: c }));
    }
    if (opts.note) row.appendChild(el("span", { class: "kr-bitnote small", html: opts.note }));
    return row;
  }
  function partial(s, n) { return s.slice(0, n) + "????".slice(0, Math.max(0, s.length - n)); }

  KR.genXor = function (inp) {
    var M = "1011", K = "0110", M2 = "1110", C = bits(pb(M) ^ pb(K)), C2 = bits(pb(M2) ^ pb(K));
    var steps = [], reuse = inp[0] === "reuse";
    steps.push({ n: 0, text: "Klartekst M = " + M + " og nøkkel K = " + K + ". Vi XOR-er én kolonne om gangen: like biter gir 0, ulike gir 1." });
    for (var i = 1; i <= 4; i++) {
      var a = M[i - 1], b = K[i - 1];
      steps.push({ n: i, hl: i - 1, text: "Kolonne " + i + ": " + a + " ⊕ " + b + " = " + (a === b ? "0 (like)" : "1 (ulike)") + "." });
    }
    steps.push({ n: 4, spor: {
      sporsmal: "Bob har C = " + C + " og samme nøkkel K = " + K + ". Hva får han når han regner C ⊕ K?",
      valg: [M + " (= M)", K + " (= K)", "0000"], fasit: 0,
      forklaring: "M ⊕ K ⊕ K = M: XOR med samme nøkkel to ganger opphever seg." },
      text: "C = M ⊕ K = <b class=\"mono\">" + C + "</b>. Dekryptering er samme operasjon: " + C + " ⊕ " + K + " = " + bits(pb(C) ^ pb(K)) + " = M. Det virker fordi M ⊕ K ⊕ K = M." });
    if (reuse) {
      steps.push({ n: 4, two: true, text: "Samme nøkkel brukes igjen på M′ = " + M2 + ": C′ = " + M2 + " ⊕ " + K + " = <b class=\"mono\">" + C2 + "</b>. Eve ser både C og C′." });
      steps.push({ n: 4, two: true, x: true, spor: {
        sporsmal: "Eve kjenner ikke K, men hun XOR-er de to chiffertekstene: C ⊕ C′. Hva får hun?",
        valg: ["M ⊕ M′: nøkkelen faller bort", "Nøkkelen K", "Bare tilfeldig støy, ingenting nyttig"], fasit: 0,
        forklaring: "C ⊕ C′ = (M ⊕ K) ⊕ (M′ ⊕ K) = M ⊕ M′, fordi K ⊕ K = 0000." },
        text: "Eve regner C ⊕ C′ = " + C + " ⊕ " + C2 + " = <b class=\"mono\">" + bits(pb(C) ^ pb(C2)) + "</b>. Nøkkelen faller bort: C ⊕ C′ = M ⊕ K ⊕ M′ ⊕ K = M ⊕ M′." });
      steps.push({ n: 4, two: true, x: true, done: true, text: "Kontroll: M ⊕ M′ = " + M + " ⊕ " + M2 + " = " + bits(pb(M) ^ pb(M2)) + ". Eve vet nå hvilke biter som er ulike i de to meldingene, uten å kjenne K. Kjenner hun den ene meldingen, får hun den andre." });
    }
    steps.forEach(function (s) { s.M = M; s.K = K; s.C = C; s.M2 = M2; s.C2 = C2; });
    return steps;
  };
  KR.vizXor = function (stage, s) {
    clear(stage);
    var box = el("div", { class: "kr-bits" });
    box.appendChild(bitRow("M", s.M, { hl: s.hl }));
    box.appendChild(bitRow("K", s.K, { hl: s.hl, strike: s.x }));
    box.appendChild(bitRow("C = M ⊕ K", partial(s.C, s.n), { hl: s.hl, cls: "res" }));
    if (s.two) {
      box.appendChild(el("hr", { class: "kr-sep" }));
      box.appendChild(bitRow("M′", s.M2));
      box.appendChild(bitRow("C′ = M′ ⊕ K", s.C2, { cls: "res", strike: s.x }));
    }
    if (s.x) {
      box.appendChild(el("hr", { class: "kr-sep" }));
      box.appendChild(bitRow("C ⊕ C′", bits(pb(s.C) ^ pb(s.C2)), { cls: "bad" }));
      if (s.done) box.appendChild(bitRow("M ⊕ M′", bits(pb(s.M) ^ pb(s.M2)), { cls: "bad", note: "samme: nøkkelen er borte" }));
    }
    stage.appendChild(box);
  };
  KR.xor = function (host) {
    return player(host, {
      presets: { "Engangsnøkkel": ["otp"], "Gjenbruk av nøkkelen": ["reuse"] }, customInput: false,
      generate: KR.genXor, render: KR.vizXor
    });
  };

  /* ---------- Regn selv: C = M ⊕ K ----------
     KR.xorSjekk(svar, M, K) → { gyldig, ok, fasit, feil: [posisjoner], hint }   (ren, testbar) */
  var XOR_OPPG = [["10110010", "01101100"], ["11100001", "10101010"], ["00111100", "01010101"], ["10011001", "11110000"], ["01011110", "00110011"]];
  KR.xorSjekk = function (svar, M, K) {
    var w = M.length, s = String(svar || "").replace(/[\s·.,_-]/g, "");
    var f = bits(pb(M) ^ pb(K), w);
    if (!new RegExp("^[01]{" + w + "}$").test(s)) return { gyldig: false, ok: false, fasit: f, feil: [], hint: "Skriv nøyaktig " + w + " biter (bare 0 og 1)." };
    var feil = [];
    for (var i = 0; i < w; i++) if (s[i] !== f[i]) feil.push(i);
    var hint = "";
    if (feil.length) {
      var and = bits(pb(M) & pb(K), w), or = bits(pb(M) | pb(K), w), xnor = bits(~(pb(M) ^ pb(K)) & ((1 << w) - 1), w);
      if (s === xnor) hint = "Du har snudd regelen: like biter gir <b>0</b>, ulike gir <b>1</b>.";
      else if (s === or) hint = "Det er OR. XOR gir 0 når begge bitene er 1.";
      else if (s === and) hint = "Det er AND. XOR gir 1 når nøyaktig én av bitene er 1.";
      else hint = feil.length + " av " + w + " biter er feil. Ta én kolonne om gangen: like biter gir 0, ulike gir 1.";
    }
    return { gyldig: true, ok: !feil.length, fasit: f, feil: feil, hint: hint };
  };
  KR.xorOv = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var nr = 0, forsok = 0, vist = false, M, K;
    var wrap = el("div", { class: "kr-xov" });
    var q = el("p", { class: "kr-xov-q" });
    var rows = el("div", { class: "kr-bits" });
    var fid = "kr-xov-" + Math.random().toString(36).slice(2, 7);
    var inp = el("input", { id: fid, type: "text", class: "kr-xov-in mono", inputmode: "numeric", autocomplete: "off", spellcheck: "false", maxlength: "11", placeholder: "8 biter" });
    var bS = el("button", { class: "btn primary sm", type: "button", text: "Sjekk" });
    var bV = el("button", { class: "btn sm", type: "button", text: "Vis svar", disabled: "" });
    var bN = el("button", { class: "btn sm", type: "button", text: "Ny oppgave" });
    var fb = el("p", { class: "kr-xov-fb", role: "status", "aria-live": "polite" });
    wrap.appendChild(q); wrap.appendChild(rows);
    wrap.appendChild(el("div", { class: "kr-ctl" }, [el("label", { for: fid, html: "C = M ⊕ K =" }), inp, bS, bV, bN]));
    wrap.appendChild(fb);
    host.appendChild(wrap);
    function tegn(res) {
      clear(rows);
      rows.appendChild(bitRow("M", M));
      rows.appendChild(bitRow("K", K));
      if (!vist) { rows.appendChild(bitRow("C = M ⊕ K", "????????".slice(0, M.length), { cls: "res" })); return; }
      var f = bits(pb(M) ^ pb(K), M.length), r = bitRow("C = M ⊕ K", f, { cls: "res" });
      if (res && res.feil) res.feil.forEach(function (i) { var c = r.children[i + 1]; if (c) c.classList.add("wrong"); });
      rows.appendChild(r);
    }
    function ny() {
      var o = XOR_OPPG[nr % XOR_OPPG.length]; M = o[0]; K = o[1];
      forsok = 0; vist = false; inp.value = ""; inp.disabled = false; bS.disabled = false; bV.disabled = true;
      inp.removeAttribute("aria-invalid");
      q.innerHTML = "Regn chifferteksten selv før du ser svaret. Like biter gir 0, ulike gir 1.";
      fb.className = "kr-xov-fb"; fb.innerHTML = "";
      tegn();
    }
    function avslutt(res, riktig) {
      vist = true; inp.disabled = true; bS.disabled = true; bV.disabled = true;
      tegn(res);
      var f = bits(pb(M) ^ pb(K), M.length);
      fb.className = "kr-xov-fb " + (riktig ? "ok" : "bad");
      fb.innerHTML = (riktig ? "<b>Riktig.</b> " : "<b>Fasit:</b> C = <span class=\"mono\">" + f + "</span>. " + (res && res.feil && res.feil.length ? "Bitene du hadde feil, er markert. " : "")) +
        "Kontroll: C ⊕ K = " + f + " ⊕ " + K + " = " + bits(pb(f) ^ pb(K), M.length) + " = M. Trykk «Ny oppgave» for en til.";
      if (IN.progress && !riktig) { try { IN.progress.solved("regn", "krypto-xor", 0, 1); } catch (e) {} }
    }
    function sjekk() {
      if (vist) return;
      var res = KR.xorSjekk(inp.value, M, K);
      if (!res.gyldig) { inp.setAttribute("aria-invalid", "true"); fb.className = "kr-xov-fb"; fb.innerHTML = res.hint; return; }
      inp.removeAttribute("aria-invalid");
      forsok++; bV.disabled = false;
      if (res.ok) {
        if (IN.progress) { try { IN.progress.solved("regn", "krypto-xor", forsok === 1 ? 1 : 0.5, 1); } catch (e) {} }
        avslutt(res, true); return;
      }
      if (forsok >= 2) { avslutt(res, false); return; }
      fb.className = "kr-xov-fb bad";
      fb.innerHTML = "<b>Ikke riktig.</b> " + res.hint + " Ett forsøk igjen.";
    }
    bS.addEventListener("click", sjekk);
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); sjekk(); } });
    bV.addEventListener("click", function () { if (!vist && forsok) avslutt(KR.xorSjekk(inp.value, M, K), false); });
    bN.addEventListener("click", function () { nr++; ny(); });
    ny();
  };

  /* ---------- Bit-flipping ---------- */
  KR.bitflipp = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var M = 5, S = pb("10110010"), C = M ^ S, flip = 0;
    var wrap = el("div", { class: "kr-flip" });
    var info = el("p", { class: "small muted", html: "Alice sender beløpet M = 5 kr som 8 bit, kryptert med nøkkelstrømmen " + bits(S, 8) + ". Klikk på en bit i chifferteksten for å snu den slik Mallory kan." });
    var rows = el("div", { class: "kr-bits" });
    var out = el("p", { class: "kr-flip-out" });
    var reset = el("button", { class: "btn sm", type: "button", text: "↺ Nullstill", onclick: function () { flip = 0; paint(); } });
    wrap.appendChild(info); wrap.appendChild(rows); wrap.appendChild(el("div", { class: "btn-row" }, [reset])); wrap.appendChild(out);
    host.appendChild(wrap);
    function paint() {
      clear(rows);
      rows.appendChild(bitRow("M (5 kr)", bits(M, 8)));
      rows.appendChild(bitRow("nøkkelstrøm", bits(S, 8)));
      rows.appendChild(bitRow("C", bits(C, 8), { cls: "res" }));
      var C2 = C ^ flip, cs = bits(C2, 8);
      var r = el("div", { class: "kr-bitrow res" });
      r.appendChild(el("span", { class: "kr-bitlbl", text: "C hos Bob" }));
      for (var i = 0; i < 8; i++) {
        (function (i) {
          var mask = 1 << (7 - i), on = (flip & mask) !== 0;
          r.appendChild(el("button", { type: "button", class: "kr-bit " + (cs[i] === "1" ? "one" : "zero") + (on ? " flipped" : ""), text: cs[i], "aria-label": "Snu bit " + (i + 1), "aria-pressed": on ? "true" : "false",
            onclick: function () { flip ^= mask; paint(); } }));
        })(i);
      }
      rows.appendChild(r);
      var Mb = C2 ^ S;
      rows.appendChild(bitRow("Bob får", bits(Mb, 8), { cls: flip ? "bad" : "ok" }));
      out.innerHTML = flip
        ? "Bob dekrypterer til <b>" + Mb + " kr</b> i stedet for 5 kr. Hver bit Mallory snur i C, snus i klarteksten. Ingen alarm går, fordi kryptering ikke sjekker integritet."
        : "Bob dekrypterer til <b>" + Mb + " kr</b>. Prøv å snu den første biten: da blir det " + ((C ^ 128) ^ S) + " kr.";
    }
    paint();
  };

  /* ======================================================
     Operasjonsmoduser: ECB, CBC, CTR
     ====================================================== */
  var MODE_K = pb("0111"), MODE_IV = pb("1010"), MODE_T = [1, 2, 3, 4];
  var MODE_NAVN = { ECB: "ECB", CBC: "CBC", CTR: "CTR", "CBC-D": "CBC dekryptering", "CTR-D": "CTR dekryptering", "ECB-D": "ECB dekryptering" };

  /* Beregner alle verdiene for en modus. Returnerer blokker med feltene som tegnes. */
  KR.modeCalc = function (mode, Ms, k, iv) {
    k = k == null ? MODE_K : k; iv = iv == null ? MODE_IV : iv;
    var enc = [], prev = iv;
    Ms.forEach(function (m, i) {
      var b = { i: i, M: m };
      if (mode.indexOf("ECB") === 0) { b.ein = m; b.x = m ^ k; b.eout = rotl4(b.x); b.C = b.eout; }
      if (mode.indexOf("CBC") === 0) { b.prev = prev; b.ein = prev ^ m; b.x = b.ein ^ k; b.eout = rotl4(b.x); b.C = b.eout; prev = b.C; }
      if (mode.indexOf("CTR") === 0) { b.T = MODE_T[i]; b.ein = b.T; b.x = b.T ^ k; b.eout = rotl4(b.x); b.C = b.eout ^ m; }
      enc.push(b);
    });
    if (/-D$/.test(mode)) {
      enc.forEach(function (b, i) {
        if (mode === "ECB-D") { b.r = rotr4(b.C); b.dout = b.r ^ k; b.M2 = b.dout; }
        if (mode === "CBC-D") { b.r = rotr4(b.C); b.dout = b.r ^ k; b.prevD = i === 0 ? iv : enc[i - 1].C; b.M2 = b.dout ^ b.prevD; }
        if (mode === "CTR-D") { b.M2 = b.eout ^ b.C; }
      });
    }
    return enc;
  };

  var curMode = "ECB";
  KR.genMode = function (inp) {
    var mode = inp[0], Ms = inp.slice(1).map(function (s) { return typeof s === "number" ? s : pb(s); });
    curMode = mode;
    var B = KR.modeCalc(mode, Ms), steps = [], show = {};
    function snap(text, extra) {
      var s = { mode: mode, B: B, show: JSON.parse(JSON.stringify(show)), text: text };
      for (var k in extra || {}) s[k] = extra[k];
      steps.push(s);
    }
    function on(i, f) { show[i + ":" + f] = 1; }
    var kb = bits(MODE_K), n = B.length;
    var intro = {
      ECB: "ECB: hver blokk krypteres for seg med samme nøkkel, C" + sub("i") + " = E(M" + sub("i") + ", K). Lekechifferet: E(X, K) = (X ⊕ K) rotert én plass mot venstre. K = " + kb + ".",
      CBC: "CBC: forrige chifferblokk XOR-es inn i neste klartekstblokk før E. Første blokk bruker IV = " + bits(MODE_IV) + " (tilfeldig, men ikke hemmelig). K = " + kb + ".",
      CTR: "CTR (tellermodus): telleren T" + sub("i") + " krypteres, og resultatet XOR-es med M" + sub("i") + ". C" + sub("i") + " = E(T" + sub("i") + ", K) ⊕ M" + sub("i") + ". K = " + kb + ".",
      "ECB-D": "ECB dekryptering: hver chifferblokk dekrypteres for seg med D. D(Y, K) = Y rotert én plass mot høyre, så ⊕ K.",
      "CBC-D": "CBC dekryptering: D først, så XOR med forrige chifferblokk (eller IV for første blokk). M" + sub("i") + " = D(C" + sub("i") + ", K) ⊕ C" + sub("i−1") + ".",
      "CTR-D": "CTR dekryptering: samme regnestykke som ved kryptering. Telleren krypteres med E (ikke D!), og resultatet XOR-es med C" + sub("i") + "."
    };
    B.forEach(function (b, i) { on(i, "top"); if (mode === "CTR") on(i, "side"); if (mode === "CTR-D") on(i, "side"); });
    if (mode === "CBC") on(0, "iv");
    if (mode === "CBC-D") on(0, "iv");
    snap(intro[mode]);
    B.forEach(function (b, i) {
      var j = sub(i + 1), jm = sub(i);
      if (mode === "ECB") {
        on(i, "ein"); on(i, "x"); snap("Blokk " + (i + 1) + ": M" + j + " ⊕ K = " + bits(b.M) + " ⊕ " + kb + " = " + bits(b.x) + ".");
        on(i, "eout"); on(i, "out"); snap("Roter " + bits(b.x) + " én plass mot venstre: C" + j + " = <b class=\"mono\">" + bits(b.C) + "</b>.");
      }
      if (mode === "CBC") {
        on(i, "ein");
        snap("Blokk " + (i + 1) + ": " + (i ? "C" + jm : "IV") + " ⊕ M" + j + " = " + bits(b.prev) + " ⊕ " + bits(b.M) + " = " + bits(b.ein) + ". Dette går inn i E.");
        on(i, "x"); snap("Inne i E: " + bits(b.ein) + " ⊕ K = " + bits(b.x) + ".");
        on(i, "eout"); on(i, "out"); if (i + 1 < n) on(i + 1, "chain");
        snap("Roter mot venstre: C" + j + " = <b class=\"mono\">" + bits(b.C) + "</b>." + (i + 1 < n ? " C" + j + " føres videre til XOR-en foran neste E." : ""));
      }
      if (mode === "CTR") {
        on(i, "x"); snap("Blokk " + (i + 1) + ": E(T" + j + ", K): " + bits(b.T) + " ⊕ " + kb + " = " + bits(b.x) + ".");
        on(i, "eout"); snap("Roter mot venstre: E(T" + j + ", K) = " + bits(b.eout) + ". Dette er nøkkelstrømmen for blokk " + (i + 1) + ".");
        on(i, "out"); snap("XOR med klarteksten: C" + j + " = " + bits(b.eout) + " ⊕ " + bits(b.M) + " = <b class=\"mono\">" + bits(b.C) + "</b>.");
      }
      if (mode === "ECB-D") {
        on(i, "x"); snap("Blokk " + (i + 1) + ": roter C" + j + " = " + bits(b.C) + " mot høyre: " + bits(b.r) + ".");
        on(i, "eout"); on(i, "out"); snap("⊕ K: " + bits(b.r) + " ⊕ " + kb + " = <b class=\"mono\">" + bits(b.M2) + "</b> = M" + j + ".");
      }
      if (mode === "CBC-D") {
        on(i, "x"); snap("Blokk " + (i + 1) + ": inne i D roteres C" + j + " = " + bits(b.C) + " mot høyre: " + bits(b.r) + ".");
        on(i, "eout"); snap("⊕ K gir D(C" + j + ", K) = " + bits(b.dout) + ". Vi er ikke ferdige: XOR kommer etter D.");
        on(i, "side"); on(i, "out"); if (i + 1 < n) on(i + 1, "chain");
        snap("XOR med " + (i ? "forrige chifferblokk C" + jm : "IV") + ": " + bits(b.dout) + " ⊕ " + bits(b.prevD) + " = <b class=\"mono\">" + bits(b.M2) + "</b> = M" + j + ".",
          i === 0 ? { spor: { sporsmal: "D(C₁, K) = " + bits(b.dout) + ". Hva må XOR-es inn for å få M₁?", valg: ["IV", "Nøkkelen K", "C₂"], fasit: 0,
            forklaring: "Ved kryptering ble IV XOR-et inn før E. Baklengs: D først, så XOR med det samme, IV for første blokk og forrige chifferblokk ellers." } } : null);
      }
      if (mode === "CTR-D") {
        on(i, "x"); on(i, "eout"); snap("Blokk " + (i + 1) + ": E(T" + j + ", K) = (" + bits(b.T) + " ⊕ " + kb + ") rotert = " + bits(b.eout) + ". Samme nøkkelstrøm som ved kryptering.",
          i === 0 ? { spor: { sporsmal: "Vi skal dekryptere i CTR. Hvilken funksjon brukes på telleren T₁?", valg: ["E (kryptering)", "D (dekryptering)", "Ingen, T₁ XOR-es rett med C₁"], fasit: 0,
            forklaring: "E(T₁, K) gir den samme nøkkelstrømmen som ved kryptering, og den XOR-es av igjen. D brukes aldri i CTR (H2021 3.3)." } } : null);
        on(i, "out"); snap("XOR med chifferteksten: " + bits(b.eout) + " ⊕ " + bits(b.C) + " = <b class=\"mono\">" + bits(b.M2) + "</b> = M" + j + ".");
      }
    });
    // Sluttsteg: like blokker
    var same = [];
    for (var a = 0; a < n; a++) for (var b2 = a + 1; b2 < n; b2++) if (B[a].M === B[b2].M) same.push([a, b2]);
    if (!/-D$/.test(mode)) {
      if (same.length) {
        var p = same[0], leak = B[p[0]].C === B[p[1]].C;
        snap(leak
          ? "M" + sub(p[0] + 1) + " og M" + sub(p[1] + 1) + " er like, og C" + sub(p[0] + 1) + " og C" + sub(p[1] + 1) + " ble like: chifferteksten avslører mønsteret i klarteksten. Det er derfor ECB regnes som usikker."
          : "M" + sub(p[0] + 1) + " og M" + sub(p[1] + 1) + " er like, men C" + sub(p[0] + 1) + " = " + bits(B[p[0]].C) + " og C" + sub(p[1] + 1) + " = " + bits(B[p[1]].C) + " er ulike. " + (mode === "CBC" ? "Kjedingen skjuler mønsteret." : "Telleren gir hver blokk sin egen nøkkelstrøm."),
          { same: p, leak: leak, sporFlytt: {
            sporsmal: "M" + sub(p[0] + 1) + " og M" + sub(p[1] + 1) + " er like. Hva skjer med C" + sub(p[0] + 1) + " og C" + sub(p[1] + 1) + " i " + MODE_NAVN[mode] + "?",
            valg: ["De blir like: mønsteret i klarteksten synes", "De blir ulike: mønsteret skjules"], fasit: leak ? 0 : 1,
            forklaring: mode === "ECB" ? "I ECB er E(·, K) en fast tabell: samme blokk inn gir alltid samme blokk ut." : mode === "CBC" ? "I CBC går C" + sub(p[1]) + " ⊕ M" + sub(p[1] + 1) + " inn i E, ikke M alene, så like klartekstblokker gir ulik inndata." : "I CTR får hver blokk sin egen teller og dermed sin egen nøkkelstrøm." } });
      } else snap("Ferdig. Prøv like blokker, for eksempel 1001 1001 1100, for å se forskjellen på modusene.");
    } else snap("Ferdig: klarteksten er gjenvunnet. " + (mode === "CTR-D" ? "Legg merke til at D aldri ble brukt." : mode === "CBC-D" ? "XOR-en kommer etter D, og det er forrige chifferblokk som XOR-es inn." : ""));
    // Spørsmålet om like blokker stilles før chifferblokken for den andre like blokken vises.
    var last = steps[steps.length - 1];
    if (last && last.sporFlytt) {
      var key = last.same[1] + ":out";
      for (var si = 0; si < steps.length; si++) if (steps[si].show[key]) { steps[si].spor = last.sporFlytt; break; }
      delete last.sporFlytt;
    }
    return steps;
  };

  function svgEl(tag, attrs, text) {
    var n = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  KR.vizMode = function (stage, s) {
    clear(stage);
    var B = s.B, n = B.length, mode = s.mode, W = 200, x00 = 40;
    var before = mode === "CBC";                 // XOR før boksen
    var after = mode === "CTR" || mode === "CTR-D" || mode === "CBC-D";
    var dec = /-D$/.test(mode), boxName = (mode === "ECB-D" || mode === "CBC-D") ? "D" : "E";
    var H = before ? 290 : after ? 260 : 200;
    var svg = svgEl("svg", { viewBox: "0 0 " + (x00 + n * W + 20) + " " + H, class: "kr-mode-svg", role: "img", "aria-label": MODE_NAVN[mode] + " med " + n + " blokker" });
    var defs = svgEl("defs", {});
    var mk = svgEl("marker", { id: "kr-arr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
    mk.appendChild(svgEl("path", { d: "M0,0 L10,5 L0,10 z", class: "kr-arrhead" }));
    defs.appendChild(mk); svg.appendChild(defs);
    function sh(i, f) { return !!s.show[i + ":" + f]; }
    function val(i, f, v) { return sh(i, f) ? bits(v) : "?"; }
    function line(pts, cls) { svg.appendChild(svgEl("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), class: "kr-ln" + (cls ? " " + cls : ""), "marker-end": "url(#kr-arr)" })); }
    function text(x, y, t, cls, anchor) { svg.appendChild(svgEl("text", { x: x, y: y, class: "kr-t" + (cls ? " " + cls : ""), "text-anchor": anchor || "middle" }, t)); }
    function xorAt(cx, cy) {
      svg.appendChild(svgEl("circle", { cx: cx, cy: cy, r: 11, class: "kr-xor" }));
      svg.appendChild(svgEl("line", { x1: cx - 11, y1: cy, x2: cx + 11, y2: cy, class: "kr-xorl" }));
      svg.appendChild(svgEl("line", { x1: cx, y1: cy - 11, x2: cx, y2: cy + 11, class: "kr-xorl" }));
    }
    function box(cx, y, i, inner) {
      svg.appendChild(svgEl("rect", { x: cx - 52, y: y, width: 104, height: 54, rx: 4, class: "kr-box" + (boxName === "E" && dec ? " kr-box-e" : "") }));
      text(cx, y + 16, boxName, "kr-boxname");
      text(cx, y + 32, inner[0], "kr-small");
      text(cx, y + 46, inner[1], "kr-small");
      svg.appendChild(svgEl("line", { x1: cx + 70, y1: y + 27, x2: cx + 54, y2: y + 27, class: "kr-ln", "marker-end": "url(#kr-arr)" }));
      text(cx + 74, y + 31, "K", "kr-key", "start");
    }
    B.forEach(function (b, i) {
      var x0 = x00 + i * W, cx = x0 + 90, j = sub(i + 1), jm = sub(i);
      var highlight = s.same && s.same.indexOf(i) >= 0 ? (s.leak ? " kr-same" : " kr-diff") : "";
      if (mode === "ECB" || mode === "ECB-D") {
        var topL = mode === "ECB" ? "M" + j + " = " + bits(b.M) : "C" + j + " = " + bits(b.C);
        text(cx, 18, topL, "kr-val" + (mode === "ECB" ? highlight : ""));
        line([[cx, 24], [cx, 58]]);
        box(cx, 60, i, mode === "ECB" ? ["⊕K: " + val(i, "x", b.x), "rot ←: " + val(i, "eout", b.eout)] : ["rot →: " + val(i, "x", b.r), "⊕K: " + val(i, "eout", b.dout)]);
        line([[cx, 114], [cx, 160]]);
        text(cx, 180, (mode === "ECB" ? "C" + j + " = " : "M" + j + " = ") + val(i, "out", mode === "ECB" ? b.C : b.M2), "kr-val kr-out" + (mode === "ECB" ? highlight : ""));
      }
      if (before) {
        text(cx, 18, "M" + j + " = " + bits(b.M), "kr-val" + (highlight ? " kr-same-m" : ""));
        line([[cx, 24], [cx, 67]]);
        xorAt(cx, 80);
        if (i === 0) {
          text(x0 + 2, 52, "IV = " + bits(MODE_IV), "kr-val kr-small", "start");
          line([[x0 + 20, 58], [x0 + 20, 80], [cx - 13, 80]]);
        } else if (sh(i, "chain")) {
          line([[cx - W + 36, 262], [x0 + 20, 262], [x0 + 20, 80], [cx - 13, 80]], "kr-chain");
        } else {
          svg.appendChild(svgEl("polyline", { points: (cx - W + 36) + ",262 " + (x0 + 20) + ",262 " + (x0 + 20) + ",80 " + (cx - 13) + ",80", class: "kr-ln kr-ghost" }));
        }
        line([[cx, 91], [cx, 138]]);
        text(cx + 6, 118, val(i, "ein", b.ein), "kr-small kr-mid", "start");
        box(cx, 140, i, ["⊕K: " + val(i, "x", b.x), "rot ←: " + val(i, "eout", b.eout)]);
        line([[cx, 194], [cx, 244]]);
        text(cx, 266, "C" + j + " = " + val(i, "out", b.C), "kr-val kr-out" + highlight);
      }
      if (after) {
        var top = mode === "CBC-D" ? "C" + j + " = " + bits(b.C) : "T" + j + " = " + bits(b.T);
        text(cx, 18, top, "kr-val");
        line([[cx, 24], [cx, 58]]);
        if (mode === "CBC-D") box(cx, 60, i, ["rot →: " + val(i, "x", b.r), "⊕K: " + val(i, "eout", b.dout)]);
        else box(cx, 60, i, ["⊕K: " + val(i, "x", b.x), "rot ←: " + val(i, "eout", b.eout)]);
        line([[cx, 114], [cx, 147]]);
        xorAt(cx, 160);
        if (mode === "CTR" || mode === "CTR-D") {
          var sideL = mode === "CTR" ? "M" + j + " = " + bits(b.M) : "C" + j + " = " + bits(b.C);
          text(x0 + 2, 140, sideL, "kr-val kr-small" + (mode === "CTR" && highlight ? " kr-same-m" : ""), "start");
          line([[x0 + 20, 146], [x0 + 20, 160], [cx - 13, 160]]);
        } else if (i === 0) {
          text(x0 + 2, 132, "IV = " + bits(MODE_IV), "kr-val kr-small", "start");
          line([[x0 + 20, 138], [x0 + 20, 160], [cx - 13, 160]], sh(i, "side") ? "" : "kr-ghost");
        } else {
          line([[cx - W + 52, 14], [x0 + 20, 14], [x0 + 20, 160], [cx - 13, 160]], sh(i, "side") ? "kr-chain" : "kr-ghost");
        }
        line([[cx, 171], [cx, 214]]);
        var outV = mode === "CTR" ? b.C : b.M2, outN = mode === "CTR" ? "C" : "M";
        text(cx, 236, outN + j + " = " + val(i, "out", outV), "kr-val kr-out" + (mode === "CTR" ? highlight : ""));
      }
    });
    stage.appendChild(el("p", { class: "kr-mode-name", text: MODE_NAVN[mode] + (boxName === "E" && dec ? " · bare E brukes" : "") }));
    var sc = el("div", { class: "kr-svgwrap" }); sc.appendChild(svg); stage.appendChild(sc);
  };
  KR.moduser = function (host) {
    return player(host, {
      presets: {
        "ECB": ["ECB", "1001", "1001", "1100"], "CBC": ["CBC", "1001", "1001", "1100"], "CTR": ["CTR", "1001", "1001", "1100"],
        "ECB dekryptering": ["ECB-D", "1001", "1001", "1100"], "CBC dekryptering": ["CBC-D", "1001", "1001", "1100"], "CTR dekryptering": ["CTR-D", "1001", "1001", "1100"]
      },
      inputLabel: "klartekst, f.eks. 1001 1001 1100", inputAria: "Egne klartekstblokker på 4 bit",
      parseInput: function (str) {
        var m = String(str).match(/[01]{4}/g) || [];
        return m.length ? [curMode].concat(m.slice(0, 4)) : [];
      },
      generate: KR.genMode, render: KR.vizMode,
      legend: [{ label: "like chifferblokker (lekker mønster)", color: "var(--color-on-tone-danger)" }, { label: "like klartekstblokker, ulike chifferblokker", color: "var(--color-on-tone-ok)" }]
    });
  };

  /* ---------- Pingvinen ---------- */
  var BILDE = [
    "00111100",
    "01111110",
    "11011011",
    "11111111",
    "11100111",
    "01111110",
    "00111100",
    "00011000"
  ];
  KR.pingvin = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var bg = pb("0000"), fg = pb("1111"), k = MODE_K;
    var px = [];
    BILDE.forEach(function (r) { for (var i = 0; i < 8; i++) px.push(r[i] === "1" ? fg : bg); });
    // CTR: nøkkelstrøm fra SHA-256 (4 bit per blokk) som stand-in for et ekte 128-bits blokkchiffer
    var strom = "";
    for (var c = 0; strom.length < 64; c++) strom += KR.sha256("teller " + c + " nøkkel " + bits(k));
    var ecb = px.map(function (v) { return KR.E(v, k); });
    var ctr = px.map(function (v, i) { return parseInt(strom[i], 16) ^ v; });
    function grid(title, vals, note) {
      var g = el("div", { class: "kr-pv" });
      g.appendChild(el("div", { class: "kr-pv-t", html: "<b>" + title + "</b>" }));
      var cells = el("div", { class: "kr-pv-grid", role: "img", "aria-label": title });
      vals.forEach(function (v) { cells.appendChild(el("span", { class: "kr-pv-c", style: "background:hsl(210,25%," + (12 + v * 5.4) + "%)", title: bits(v) })); });
      g.appendChild(cells);
      g.appendChild(el("div", { class: "small muted", html: note }));
      return g;
    }
    var row = el("div", { class: "kr-pv-row" });
    row.appendChild(grid("Klartekst", px, "To verdier: " + bits(bg) + " og " + bits(fg) + "."));
    row.appendChild(grid("ECB", ecb, bits(bg) + " → " + bits(KR.E(bg, k)) + " og " + bits(fg) + " → " + bits(KR.E(fg, k)) + " hver gang. Figuren synes."));
    row.appendChild(grid("CTR", ctr, "Hver piksel får sin egen nøkkelstrøm. Figuren forsvinner."));
    host.appendChild(row);
    host.appendChild(el("p", { class: "small muted", text: "Hver piksel er én 4-bits blokk. ECB bruker lekechifferet med K = 0111. I CTR-bildet kommer nøkkelstrømmen fra SHA-256 i stedet, fordi en 4-bits teller går rundt etter 16 blokker og da gjentar seg, akkurat som en gjenbrukt engangsnøkkel." }));
  };

  /* ======================================================
     Hash
     ====================================================== */
  /* Hvilke hashkrav holder? (IN.matrise) */
  var JN = ["Ja", "Nei"];
  KR.hashFasit = [
    ["Ja", "Nei", "Nei", "Ja", "Ja"],     // x + 1 (H2023 21: premisset «unik output»)
    ["Ja", "Ja", "Nei", "Nei", "Nei"],    // x mod 16
    ["Ja", "Ja", "Ja", "Ja", "Ja"]        // SHA-256
  ];
  KR.hashTest = function (host) {
    host = host$(host); if (!host || !IN.matrise) return;
    clear(host);
    var x = 19, y = x % 16;
    return IN.matrise(host, {
      id: "krypto-hashkrav",
      sporsmal: {
        eli5: "Holder disse «fingeravtrykk-maskinene» kravene? Velg Ja eller Nei i hver rute, og trykk «Sjekk».",
        normal: "Hvilke av de fem hashkravene oppfyller hver funksjon? x er et ikke-negativt heltall.",
        teknisk: "Vurder de fem kravene for hver funksjon (x ∈ ℕ). For x + 1 gjelder premisset fra H2023 21: hver inndata gir unik verdi."
      },
      rader: ["H(x) = x + 1", "H(x) = x mod 16", "SHA-256"],
      kolonner: [
        { navn: "Lett å beregne", valg: JN },
        { navn: "Komprimering (fast lengde)", valg: JN },
        { navn: "Enveis", valg: JN },
        { navn: "Svak kollisjonsresistens", valg: JN },
        { navn: "Sterk kollisjonsresistens", valg: JN }
      ],
      fasit: KR.hashFasit,
      forklaring: {
        "0,0": "Én addisjon.",
        "0,1": "H(9) = 10 har to sifre, H(999 999) = 1 000 000 har sju. Lengden vokser med x.",
        "0,2": "Fra y = 20 finner du straks x = 20 − 1 = 19.",
        "0,3": "Hver x gir sin egen verdi, så det finnes ingen annen x′ med samme hash (H2023 21).",
        "0,4": "Ingen kollisjoner i det hele tatt, så heller ikke noe par å finne. Fasiten i H2023 21 krysser av for kollisjonsresistent.",
        "1,0": "Én divisjon med rest.",
        "1,1": "Alltid et tall fra 0 til 15, altså 4 bit.",
        "1,2": "Fra y = " + y + " er x = " + y + " en gyldig inndata med en gang.",
        "1,3": "Gitt x = " + x + ": x′ = " + (x + 16) + " gir samme verdi, H(" + (x + 16) + ") = " + ((x + 16) % 16) + ".",
        "1,4": "H(3) = H(19) = 3. Et par er trivielt å finne.",
        "2,0": "Rask å regne ut, også for store filer.",
        "2,1": "Alltid 256 bit, uansett lengde på inndata.",
        "2,2": "Praktisk umulig å invertere. Teoretisk finnes det inverser, men de kan ikke finnes.",
        "2,3": "Regnes som sikker (SHA-2-familien).",
        "2,4": "Kollisjoner finnes fordi uendelig mange inndata deles på 2²⁵⁶ verdier, men ingen kan finne dem i praksis."
      },
      regel: { riktig: 1, feil: -0.5, blankt: 0, min: 0 }
    });
  };

  KR.skred = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var texts = ["Overfør 100 kr til Ola", "Overfør 1000 kr til Ola", "Overfør 100 kr til Kari"];
    var a = el("input", { type: "text", value: texts[0], "aria-label": "Tekst A", class: "kr-txt" });
    var b = el("input", { type: "text", value: texts[1], "aria-label": "Tekst B", class: "kr-txt" });
    var pre = el("div", { class: "btn-row" }, [el("span", { class: "small muted", text: "B = " })].concat(texts.slice(1).map(function (t) {
      return el("button", { class: "btn sm", type: "button", text: "«" + t + "»", onclick: function () { b.value = t; paint(); } });
    })));
    var out = el("div", { class: "kr-skred" });
    host.appendChild(el("div", { class: "kr-ctl" }, [el("label", {}, [el("span", { text: "A " }), a])]));
    host.appendChild(el("div", { class: "kr-ctl" }, [el("label", {}, [el("span", { text: "B " }), b])]));
    host.appendChild(pre); host.appendChild(out);
    function hx(h, other) {
      return h.split("").map(function (c, i) { return c === other[i] ? c : "<b>" + c + "</b>"; }).join("");
    }
    function paint() {
      var ha = KR.sha256(a.value), hb = KR.sha256(b.value), d = hexBitDiff(ha, hb);
      out.innerHTML = "<p class=\"mono kr-hex\">SHA-256(A) = " + ha + "</p><p class=\"mono kr-hex\">SHA-256(B) = " + hx(hb, ha) + "</p>" +
        "<p><b>" + d + " av 256 bit</b> er ulike (" + Math.round(d / 2.56) + " %). " + (d === 0 ? "Tekstene er like, og da er hashen lik." : "En liten endring i teksten endrer omtrent halvparten av bitene, ikke alle.") + " Hashen har alltid 256 bit, uansett hvor lang teksten er.</p>";
    }
    a.addEventListener("input", paint); b.addEventListener("input", paint);
    paint();
  };

  /* ======================================================
     Sekvensdiagram (felles for MAC, hybrid, DH og signatur)
     step: { lanes: [navn], rows: [{ act: lane, t } | { from, to, t }], n: antall synlige rader }
     ====================================================== */
  KR.vizSeq = function (stage, s) {
    clear(stage);
    var L = s.lanes.length;
    var g = el("div", { class: "kr-seq", style: "grid-template-columns:repeat(" + L + ",minmax(0,1fr))" });
    s.lanes.forEach(function (n) { g.appendChild(el("div", { class: "kr-lane", html: n })); });
    s.rows.forEach(function (r, ri) {
      var vis = ri < s.n, cur = ri === s.n - 1;
      var cls = (vis ? "" : " kr-hid") + (cur ? " kr-cur" : "") + (r.cls ? " " + r.cls : "");
      if (r.act != null) {
        var cells = [].concat(r.act);
        for (var c = 0; c < L; c++) {
          var k = cells.indexOf(c);
          g.appendChild(el("div", { class: "kr-act" + (k >= 0 ? cls : " kr-empty"), html: k >= 0 && vis ? ([].concat(r.t)[k] || [].concat(r.t)[0]) : "" }));
        }
      } else {
        var lo = Math.min(r.from, r.to), hi = Math.max(r.from, r.to);
        for (var c2 = 0; c2 < lo; c2++) g.appendChild(el("div", { class: "kr-act kr-empty" }));
        var m = el("div", { class: "kr-msg" + cls + (r.to < r.from ? " left" : ""), style: "grid-column:" + (lo + 1) + " / " + (hi + 2) });
        m.appendChild(el("span", { class: "kr-msg-t", html: vis ? r.t : "" }));
        m.appendChild(el("span", { class: "kr-msg-ar", "aria-hidden": "true" }));
        g.appendChild(m);
        for (var c3 = hi + 1; c3 < L; c3++) g.appendChild(el("div", { class: "kr-act kr-empty" }));
      }
    });
    stage.appendChild(g);
  };
  function seqSteps(lanes, rows, intro) {
    var steps = [{ lanes: lanes, rows: rows, n: 0, text: intro }];
    rows.forEach(function (r, i) { var st = { lanes: lanes, rows: rows, n: i + 1, text: r.why || "" }; if (r.spor) st.spor = r.spor; steps.push(st); });
    return steps;
  }

  /* ---------- MAC ---------- */
  KR.genMac = function (inp) {
    var k = MODE_K, M = pb("1001"), mac = KR.E(M, k), kb = bits(k);
    function hashTxt(m) { return "Hash(" + bits(m) + ", K): " + bits(m) + " ⊕ " + kb + " = " + bits(m ^ k) + ", rotert = " + bits(KR.E(m, k)); }
    var v = inp[0];
    if (v === "mallory") {
      var M2 = pb("1000"), mac2 = KR.E(M2, k);
      return seqSteps(["Alice", "Mallory", "Bob"], [
        { act: [0, 2], t: ["Har K = " + kb, "Har K = " + kb], why: "Alice og Bob deler den hemmelige nøkkelen K. Mallory har den ikke." },
        { act: 0, t: "MAC = " + hashTxt(M), why: "Alice regner MAC-en av M = " + bits(M) + " med nøkkelen." },
        { from: 0, to: 1, t: "(" + bits(M) + ", " + bits(mac) + ")", why: "Meldingen går i klartekst sammen med MAC-en. Mallory fanger den opp." },
        { act: 1, t: "Endrer M til " + bits(M2) + ". Kan ikke lage ny MAC uten K, så hun lar " + bits(mac) + " stå.", cls: "bad", why: "Uten K kan Mallory ikke regne en gyldig MAC for den nye meldingen." },
        { from: 1, to: 2, t: "(" + bits(M2) + ", " + bits(mac) + ")", cls: "bad", why: "Bob mottar M′ = " + bits(M2) + "." },
        { act: 2, t: "MAC′ = " + hashTxt(M2), why: "Bob regner MAC′ = Hash(M′, K) med sin kopi av nøkkelen." },
        { act: 2, t: bits(mac) + " ≠ " + bits(mac2) + " ✗ korrupt melding", cls: "bad",
          spor: { sporsmal: "Bob fikk MAC = " + bits(mac) + " og regnet MAC′ av den endrede meldingen. Hva gjør han?", valg: ["Godtar meldingen", "Forkaster den som korrupt"], fasit: 1,
            forklaring: "MAC′ = " + bits(mac2) + " ≠ " + bits(mac) + ". Uten K kunne ikke Mallory lage en MAC som passer til den nye meldingen." },
          why: "MAC ≠ MAC′, så Bob forkaster meldingen. (Lekechifferet kan regnes baklengs; en ekte MAC kan ikke det.)" }
      ], "Mallory vil endre meldingen underveis.");
    }
    var rows = [
      { act: [0, 1], t: ["Har K = " + kb, "Har K = " + kb], why: "Alice og Bob deler den hemmelige nøkkelen K. MAC er symmetrisk krypto." },
      { act: 0, t: "MAC = " + hashTxt(M), why: "Alice regner MAC = Hash(M, K) av M = " + bits(M) + "." },
      { from: 0, to: 1, t: "(" + bits(M) + ", " + bits(mac) + ")", why: "M går i klartekst. MAC gir ingen konfidensialitet." },
      { act: 1, t: "MAC′ = " + hashTxt(M), why: "Bob regner MAC′ = Hash(M′, K) av meldingen han fikk." },
      { act: 1, t: bits(mac) + " = " + bits(mac) + " ✓ autentisk", cls: "ok", why: "MAC = MAC′: meldingen er uendret og kommer fra noen som har K. Bob vet at det ikke var ham selv, altså Alice." }
    ];
    if (v === "dommer") {
      return seqSteps(["Alice", "Bob", "Dommer"], rows.concat([
        { from: 1, to: 2, t: "«Alice sendte (" + bits(M) + ", " + bits(mac) + ")!»", why: "Bob vil bevise for en tredjepart at Alice sendte meldingen." },
        { act: 2, t: "Uten K kan dommeren ikke sjekke noe. Med K vet hun bare at Alice <i>eller</i> Bob laget MAC-en.", cls: "bad",
          spor: { sporsmal: "Kan dommeren avgjøre at det var Alice og ikke Bob som laget MAC-en?", valg: ["Ja, MAC-en stemmer, altså var det Alice", "Nei, Bob har samme nøkkel og kunne laget den selv"], fasit: 1,
            forklaring: "MAC gir enkel meldingsautentisering, ikke ubenektelighet. Se cella «MAC × Ubenektelighet» i matrisen i fanen Signatur." },
          why: "Begge har samme nøkkel, så Bob kunne ha laget MAC-en selv. MAC gir enkel meldingsautentisering, ikke ubenektelighet." }
      ]), "Kan en dommer avgjøre hvem som laget MAC-en?");
    }
    return seqSteps(["Alice", "Bob"], rows, "MAC = Hash(M, K). Leke-MAC: samme regnestykke som lekechifferet, (M ⊕ K) rotert.");
  };
  KR.mac = function (host) {
    return player(host, { presets: { "Ærlig": ["ok"], "Mallory endrer M": ["mallory"], "Dommer": ["dommer"] }, customInput: false, generate: KR.genMac, render: KR.vizSeq });
  };

  /* ---------- Hybrid kryptering ---------- */
  KR.genHybrid = function () {
    var r = [
      { act: 2, t: "Nøkkelpar " + KPRIV("B") + " og " + KPUB("B"), why: "Bob har et nøkkelpar. Den offentlige nøkkelen ligger i et sertifikat (PKI), så Alice vet at den er Bobs." },
      { act: 0, t: "Lager tilfeldig øktnøkkel K", why: "Alice lager en ny symmetrisk øktnøkkel for denne økta." },
      { act: 0, t: "K* = E(K, " + KPUB("B") + ")", why: "Øktnøkkelen kapsles inn med <b>mottakerens offentlige</b> nøkkel. Bare Bob kan åpne den." },
      { from: 0, to: 2, t: "K*", why: "K* sendes over nettet. Eve kan ikke lese den nå, men hun kan lagre den." },
      { act: 1, t: "Lagrer K*", why: "En avlytter som lagrer alt, venter på sjansen." },
      { act: 2, t: "K = D(K*, " + KPRIV("B") + ")", why: "Bob pakker ut øktnøkkelen med sin private nøkkel." },
      { from: 0, to: 2, t: "C = E(M, K) (AES, raskt)", why: "Dataene krypteres symmetrisk med K. Det er raskt, og derfor brukes asymmetrisk krypto bare på den lille nøkkelen." },
      { act: 1, t: "Lagrer C", why: "Eve lagrer også chifferteksten." },
      { act: 1, t: "To år senere: stjeler " + KPRIV("B"), cls: "bad", why: "Langtidsnøkkelen lekker." },
      { act: 1, t: "K = D(K*, " + KPRIV("B") + "), så M = D(C, K)", cls: "bad", why: "Med den stjålne nøkkelen åpner Eve K* og deretter C. Det gjelder alle gamle økter som ble beskyttet av samme nøkkel: hybrid kryptering gir ikke fremoverhemmelighold." }
    ];
    return seqSteps(["Alice", "Eve (avlytter)", "Bob"], r, "Hybrid kryptering: asymmetrisk for å sende øktnøkkelen, symmetrisk for dataene.");
  };
  KR.hybrid = function (host) {
    return player(host, { generate: KR.genHybrid, render: KR.vizSeq, presets: { "Hybrid kryptering": ["h"] }, customInput: false });
  };

  /* Lekket langtidsnøkkel: studenten forutsier konsekvensen før den vises */
  KR.lekkValg = ["Alle tre kan dekrypteres", "Ingen av dem kan dekrypteres", "Bare den siste økta kan dekrypteres"];
  KR.lekkFasit = { hybrid: 0, dh: 1 };
  KR.lekk = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var mode = "hybrid", svar = { hybrid: null, dh: null };
    var bH = el("button", { class: "btn sm", type: "button", text: "Hybrid kryptering" });
    var bD = el("button", { class: "btn sm", type: "button", text: "Signert DH" });
    var bR = el("button", { class: "btn sm", type: "button", text: "↺ Før lekkasjen" });
    var list = el("ul", { class: "kr-okter" });
    var q = el("div", { class: "kr-lekk-q", role: "group", "aria-label": "Forutsi hva som skjer" });
    var note = el("p", { class: "small", "aria-live": "polite" });
    host.appendChild(el("div", { class: "btn-row" }, [el("span", { class: "small muted", text: "Løsning:" }), bH, bD]));
    host.appendChild(list); host.appendChild(q); host.appendChild(note);
    host.appendChild(el("div", { class: "btn-row" }, [bR]));
    function paint() {
      var leaked = svar[mode] != null, riktig = svar[mode] === KR.lekkFasit[mode];
      bH.setAttribute("aria-pressed", mode === "hybrid" ? "true" : "false");
      bD.setAttribute("aria-pressed", mode === "dh" ? "true" : "false");
      bR.hidden = !leaked;
      clear(list);
      for (var i = 1; i <= 3; i++) {
        var bad = leaked && mode === "hybrid";
        list.appendChild(el("li", { class: leaked ? (bad ? "bad" : "ok") : "", html: (leaked ? (bad ? "✗ " : "✓ ") : "") + "Økt " + i + ": " + (mode === "hybrid" ? "øktnøkkel K" + sub(i) + " sendt som E(K" + sub(i) + ", K<sup>B</sup><sub>pub</sub>)" : "nøkkel g<sup>ab</sup> mod p med nye a og b, slettet etterpå") + (leaked ? (bad ? " – kan dekrypteres nå" : " – fortsatt hemmelig") : "") + ". Eve har lagret trafikken." }));
      }
      clear(q);
      if (!leaked) {
        q.appendChild(el("p", { class: "kr-lekk-sp", html: "<b>Forutsi:</b> Bobs langtidsnøkkel " + KPRIV("B") + " blir stjålet. " + (mode === "dh" ? "Den ble bare brukt til å signere DH-verdiene. " : "") + "Hva skjer med de tre gamle øktene?" }));
        var row = el("div", { class: "btn-row" });
        KR.lekkValg.forEach(function (t, i) {
          row.appendChild(el("button", { class: "btn sm", type: "button", text: t, onclick: function () { svar[mode] = i; paint(); } }));
        });
        q.appendChild(row);
        note.className = "small muted";
        note.innerHTML = "Svar først, så vises konsekvensen.";
        return;
      }
      note.className = "small " + (riktig ? "kr-ok" : "kr-bad");
      note.innerHTML = (riktig ? "<b>Riktig.</b> " : "<b>Ikke riktig.</b> Du svarte «" + KR.lekkValg[svar[mode]] + "». ") +
        (mode === "hybrid" ? "Alle gamle økter faller: hver øktnøkkel ble sendt kryptert med den samme nøkkelen som nå er stjålet. Hybrid kryptering gir ikke fremoverhemmelighold." :
          "Langtidsnøkkelen ble bare brukt til å signere. Øktnøklene ble aldri sendt, og a og b er slettet. Tyven kan utgi seg for eieren i <i>nye</i> økter, men ikke lese gamle. Det er fremoverhemmelighold.");
    }
    bH.addEventListener("click", function () { mode = "hybrid"; paint(); });
    bD.addEventListener("click", function () { mode = "dh"; paint(); });
    bR.addEventListener("click", function () { svar[mode] = null; paint(); });
    paint();
  };

  /* ---------- Diffie–Hellman ---------- */
  var DH_P = 23, DH_G = 5;
  function kjede(g, e, p) {   // g¹, g², … gᵉ mod p
    var r = 1, out = [];
    for (var i = 1; i <= e; i++) { r = (r * g) % p; out.push(g + sup(i) + " = " + r); }
    return out.join(", ");
  }
  KR.genDh = function (inp) {
    var p = DH_P, g = DH_G, a = inp[0], b = inp[1], e = inp[2], sign = !!inp[3];
    var bad = [a, b].concat(e != null ? [e] : []).filter(function (x) { return !(x >= 1 && x <= p - 2); });
    if (bad.length) return [{ lanes: ["Alice", "Bob"], rows: [], n: 0, text: "De hemmelige tallene må være mellom 1 og " + (p - 2) + ". Skriv for eksempel 6, 9 (eller 6, 9, 3 med Mallory)." }];
    var md = KR.modpow, A = md(g, a, p), Bv = md(g, b, p);
    var pub = "p = " + p + ", g = " + g;
    function calc(base, ex, who) { return who + " = " + base + sup(ex) + " mod " + p + " = <b>" + md(base, ex, p) + "</b>"; }
    if (e == null) {
      var KA = md(Bv, a, p), KB = md(A, b, p);
      return seqSteps(["Alice", "Eve ser", "Bob"], [
        { act: [0, 1, 2], t: [pub, pub, pub], why: "p og g er offentlige. Alle, også Eve, kjenner dem." },
        { act: [0, 2], t: ["Velger hemmelig a = " + a, "Velger hemmelig b = " + b], why: "Delnøklene a og b er private og sendes aldri." },
        { act: 0, t: calc(g, a, "g<sup>a</sup>"), why: "Alice regner g<sup>a</sup> mod p: " + kjede(g, a, p) + ".",
          spor: { sporsmal: "Alice har a = " + a + ". Regn g<sup>a</sup> mod p = " + g + "<sup>" + a + "</sup> mod " + p + ". (Tips: gang med " + g + " og ta mod " + p + " for hvert steg.)", tall: true, fasit: A,
            forklaring: kjede(g, a, p) + " (mod " + p + ")." } },
        { from: 0, to: 2, t: "g<sup>a</sup> mod p = " + A, why: "Den offentlige verdien sendes åpent." },
        { act: 2, t: calc(g, b, "g<sup>b</sup>"), why: "Bob regner g<sup>b</sup> mod p: " + kjede(g, b, p) + "." },
        { from: 2, to: 0, t: "g<sup>b</sup> mod p = " + Bv, why: "Også denne går åpent." },
        { act: 1, t: "Ser " + A + " og " + Bv + ", men ikke a, b eller nøkkelen", why: "For å finne a fra " + A + " må Eve løse diskret logaritme. Med p = 23 går det å prøve alt, men med ekte størrelser (tusenvis av bit) er det håpløst." },
        { act: [0, 2], t: [calc(Bv, a, "(g<sup>b</sup>)<sup>a</sup>"), calc(A, b, "(g<sup>a</sup>)<sup>b</sup>")],
          spor: { sporsmal: "Alice fikk g<sup>b</sup> mod p = " + Bv + " fra Bob og har a = " + a + ". Regn den felles nøkkelen (g<sup>b</sup>)<sup>a</sup> mod p = " + Bv + "<sup>" + a + "</sup> mod " + p + ".", tall: true, fasit: KA,
            forklaring: kjede(Bv, a, p) + " (mod " + p + "). Bob får det samme med (g<sup>a</sup>)<sup>b</sup> = " + A + "<sup>" + b + "</sup> mod " + p + "." },
          why: "Alice regner (g<sup>b</sup>)<sup>a</sup>: " + kjede(Bv, a, p) + ". Bob regner (g<sup>a</sup>)<sup>b</sup>: " + kjede(A, b, p) + "." },
        { act: [0, 2], t: ["K<sup>AB</sup> = " + KA + (KA === KB ? " ✓" : ""), "K<sup>AB</sup> = " + KB + (KA === KB ? " ✓" : "")], cls: "ok", why: "Begge får g<sup>ab</sup> mod p = " + KA + ", en felles symmetrisk nøkkel som aldri ble sendt. Slettes a og b etter økta, kan ingen regne den ut senere." }
      ], "Diffie–Hellman med p = " + p + " og g = " + g + ". Velg egne hemmelige tall i feltet «Eget:» (a, b eller a, b, e).");
    }
    var E = md(g, e, p), KA2 = md(E, a, p), KM1 = md(A, e, p), KB2 = md(E, b, p), KM2 = md(Bv, e, p);
    var rows = [
      { act: [0, 1, 2], t: [pub, pub, pub], why: "Offentlige parametere." },
      { act: [0, 1, 2], t: ["Velger a = " + a, "Velger e = " + e, "Velger b = " + b], why: "Mallory sitter mellom Alice og Bob og har sitt eget hemmelige tall e." },
      { from: 0, to: 1, t: "g<sup>a</sup> = " + A, why: "Alice sender g<sup>a</sup> mod p = " + A + ", men Mallory fanger den opp." },
      { from: 1, to: 2, t: "g<sup>e</sup> = " + E, cls: "bad", why: "Mallory sender sin egen g<sup>e</sup> mod p = " + E + " videre til Bob, som tror den er fra Alice." },
      { from: 2, to: 1, t: "g<sup>b</sup> = " + Bv, why: "Bob svarer med g<sup>b</sup> mod p = " + Bv + "." },
      { from: 1, to: 0, t: "g<sup>e</sup> = " + E, cls: "bad", why: "Alice får også Mallorys verdi." },
      { act: [0, 1], t: ["Nøkkel = " + E + sup(a) + " mod " + p + " = <b>" + KA2 + "</b>", "Med Alice: " + A + sup(e) + " mod " + p + " = <b>" + KM1 + "</b>"], cls: "bad",
        spor: { sporsmal: "Alice tror " + E + " kom fra Bob. Hvem deler hun nøkkelen " + E + "<sup>" + a + "</sup> mod " + p + " med?", valg: ["Bob", "Mallory", "Både Bob og Mallory"], fasit: 1,
          forklaring: "Verdien " + E + " er g<sup>e</sup> fra Mallory, så Alice og Mallory får samme nøkkel. DH alene sier ikke hvem man snakker med." },
        why: "Alice og Mallory får samme nøkkel " + KA2 + "." },
      { act: [1, 2], t: ["Med Bob: " + Bv + sup(e) + " mod " + p + " = <b>" + KM2 + "</b>", "Nøkkel = " + E + sup(b) + " mod " + p + " = <b>" + KB2 + "</b>"], cls: "bad", why: "Bob og Mallory får samme nøkkel " + KB2 + "." }
    ];
    if (!sign) {
      rows.push({ act: 1, t: "Har to nøkler (" + KM1 + " og " + KM2 + "): dekrypterer, leser og krypterer på nytt", cls: "bad", why: "Mann-i-midten: DH alene autentiserer ingen. Mallory kan lese og endre alt uten at Alice eller Bob merker det." });
      return seqSteps(["Alice", "Mallory", "Bob"], rows, "Mann-i-midten. Mallory velger e = " + e + ".");
    }
    rows.push({ from: 0, to: 1, t: "S<sup>A</sup> = Sig(" + KA2 + ", " + KPRIV("A") + ")", why: "Autentisert DH: Alice signerer nøkkelen sin med sin private nøkkel." });
    rows.push({ act: 1, t: "Kan ikke lage Sig(" + KB2 + ", " + KPRIV("A") + ") uten Alices private nøkkel", why: "Mallory kan bare videresende Alices signatur uendret." });
    rows.push({ from: 1, to: 2, t: "S<sup>A</sup> (gjelder " + KA2 + ")", why: "Bob får signaturen." });
    rows.push({ act: 2, t: "Ver(S<sup>A</sup>, " + KPUB("A") + ") gir " + KA2 + ", men min nøkkel er " + KB2 + ": " + (KA2 === KB2 ? "like" : "✗ avvis"), cls: KA2 === KB2 ? "" : "ok", why: KA2 === KB2 ? "Med disse tallene ble nøklene tilfeldigvis like. Prøv en annen e." : "Signaturen passer ikke med Bobs nøkkel. Bob avbryter, og angrepet er avslørt." });
    return seqSteps(["Alice", "Mallory", "Bob"], rows, "Mallory prøver igjen, men nå signerer partene DH-nøkkelen.");
  };
  KR.dh = function (host) {
    return player(host, {
      presets: { "a = 6, b = 9": [6, 9], "Mallory (e = 3)": [6, 9, 3], "Mallory + signatur": [6, 9, 3, 1] },
      inputLabel: "a, b (eller a, b, e)", inputAria: "Hemmelige tall a, b og eventuelt Mallorys e",
      parseInput: function (s) { return String(s).split(/[,;\s]+/).map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); }).slice(0, 3); },
      generate: KR.genDh, render: KR.vizSeq
    });
  };

  /* ---------- Digital signatur ---------- */
  KR.genSig = function (inp) {
    var v = inp[0], M = "Overfør 100 kr til Ola", M2 = "Overfør 1000 kr til Ola";
    var h = function (t) { return KR.sha256(t).slice(0, 12) + "…"; };
    var H = h(M);
    var start = [
      { act: 0, t: "M = «" + M + "»", why: "Alice vil sende en melding som alle kan sjekke at er fra henne." },
      { act: 0, t: "H = Hash(M) = " + H, why: "Asymmetriske operasjoner er tunge, så Alice signerer hashen (SHA-256, de første tegnene vises)." },
      { act: 0, t: "S = Sig(H, " + KPRIV("A") + ")", why: "Signaturen lages med <b>avsenderens private</b> nøkkel. Bare Alice har den." }
    ];
    if (v === "mallory") {
      return seqSteps(["Alice", "Mallory", "Bob"], start.concat([
        { from: 0, to: 1, t: "(M, S)", why: "Mallory fanger opp meldingen." },
        { act: 1, t: "Endrer til M′ = «" + M2 + "», beholder S", cls: "bad", why: "Uten Alices private nøkkel kan hun ikke lage ny S." },
        { from: 1, to: 2, t: "(M′, S)", cls: "bad", why: "Bob mottar den endrede meldingen." },
        { act: 2, t: "H = Ver(S, " + KPUB("A") + ") = " + H, why: "Bob henter H ut av signaturen med Alices offentlige nøkkel." },
        { act: 2, t: "H′ = Hash(M′) = " + h(M2), why: "Bob hasher meldingen han fikk." },
        { act: 2, t: "H ≠ H′ ✗ avvis", cls: "bad", why: "Hashene er ulike, så meldingen er endret. Signaturen beskytter integriteten." }
      ]), "Mallory endrer beløpet underveis.");
    }
    if (v === "nokkel") {
      var Hm = h(M2);
      return seqSteps(["Alice", "Mallory", "Bob"], [
        { act: 1, t: "Lager eget nøkkelpar " + KPRIV("M") + ", " + KPUB("M"), why: "Mallory vil utgi seg for Alice." },
        { from: 1, to: 2, t: "«Her er Alices offentlige nøkkel»: " + KPUB("M"), cls: "bad", why: "Uten PKI har Bob ingen måte å vite hvem nøkkelen egentlig tilhører." },
        { act: 1, t: "S = Sig(Hash(M′), " + KPRIV("M") + "), M′ = «" + M2 + "»", why: "Mallory signerer sin egen melding med sin egen private nøkkel." },
        { from: 1, to: 2, t: "(M′, S)", cls: "bad", why: "Sendes som om den var fra Alice." },
        { act: 2, t: "Ver(S, " + KPUB("M") + ") = " + Hm + " = Hash(M′) ✓", cls: "bad", why: "Regnestykket stemmer, men Bob har verifisert med feil nøkkel. Signaturen beviser bare at eieren av nøkkelen signerte." },
        { act: 2, t: "Løsning: sertifikat fra en CA binder " + KPUB("A") + " til navnet Alice", cls: "ok", why: "Derfor trengs PKI: den offentlige nøkkelen må være autentisk, ikke hemmelig." }
      ], "Mallory bytter ut den offentlige nøkkelen.");
    }
    var rows = start.concat([
      { from: 0, to: 1, t: "(M, S)", why: "Meldingen sendes sammen med signaturen. M er ikke kryptert: signatur gir ingen konfidensialitet." },
      { act: 1, t: "Henter " + KPUB("A") + " fra Alices sertifikat", why: "Bob trenger en autentisk kopi av Alices offentlige nøkkel (PKI)." },
      { act: 1, t: "H = Ver(S, " + KPUB("A") + ") = " + H, why: "Verifisering med <b>avsenderens offentlige</b> nøkkel gir H." },
      { act: 1, t: "H′ = Hash(M′) = " + H, why: "Bob hasher meldingen han mottok, M′." },
      { act: 1, t: "H = H′ ✓ gyldig", cls: "ok", why: "Like hasher: meldingen er uendret og signert med Alices private nøkkel." }
    ]);
    if (v === "dommer") {
      return seqSteps(["Alice", "Bob", "Dommer"], rows.concat([
        { from: 1, to: 2, t: "(M, S)", why: "Bob viser fram meldingen og signaturen." },
        { act: 2, t: "Ver(S, " + KPUB("A") + ") = Hash(M) ✓ Alice signerte", cls: "ok",
          spor: { sporsmal: "Kan dommeren avgjøre at det var Alice som signerte?", valg: ["Ja, med Alices offentlige nøkkel", "Nei, Bob kunne laget signaturen selv"], fasit: 0,
            forklaring: "Bare Alice har " + KPRIV("A") + ", og alle kan verifisere med " + KPUB("A") + ". Det er ubenektelighet." },
          why: "Dommeren kan sjekke det samme som Bob med Alices offentlige nøkkel. Bob kunne ikke ha laget S selv. Det er ubenektelighet, i motsetning til MAC. (Den er relativ: Alice kan hevde at nøkkelen ble stjålet.)" }
      ]), "Kan en tredjepart sjekke signaturen?");
    }
    return seqSteps(["Alice", "Bob"], rows, "Digital signatur: signer hashen med privat nøkkel, verifiser med offentlig.");
  };
  KR.signatur = function (host) {
    return player(host, { presets: { "Ærlig": ["ok"], "Mallory endrer M": ["mallory"], "Mallory bytter nøkkel": ["nokkel"], "Dommer": ["dommer"] }, customInput: false, generate: KR.genSig, render: KR.vizSeq });
  };

  /* ---------- Mekanisme × egenskap (IN.matrise) ---------- */
  var NOK = ["Ingen", "Delt hemmelig", "Privat + offentlig"];
  KR.mekFasit = [
    ["Ja", "Nei", "Nei", "Nei", "Delt hemmelig"],        // symmetrisk kryptering
    ["Ja", "Nei", "Nei", "Nei", "Privat + offentlig"],   // asymmetrisk kryptering
    ["Nei", "Nei", "Nei", "Nei", "Ingen"],               // hash
    ["Nei", "Ja", "Ja", "Nei", "Delt hemmelig"],         // MAC
    ["Nei", "Ja", "Ja", "Ja", "Privat + offentlig"]      // digital signatur
  ];
  KR.mekBrytere = [
    { navn: "Hash-verdien kommer over en egen, sikker kanal",
      endrer: function (f) { f[2][1] = "Ja"; return f; },
      forklaring: { "2,1": "Når angriperen ikke kan bytte ut hash-verdien, avslører en ny utregning hos mottakeren at meldingen er endret." } },
    { navn: "Fire kolleger deler samme MAC-nøkkel (som H2024 38)",
      endrer: function (f) { f[3][2] = "Nei"; return f; },
      forklaring: { "3,2": "Alle fire kan lage gyldige MAC-er, så mottakeren vet bare at det var en av de andre tre, ikke hvem. Bruk PKI og signatur i stedet." } },
    { navn: "Avsenderens private nøkkel er stjålet (som H2023 15)",
      endrer: function (f) { f[4][1] = ["Ja", "Nei"]; f[4][2] = "Nei"; f[4][3] = "Nei"; return f; },
      forklaring: {
        "4,1": "Endringer gjort av andre enn tyven oppdages fortsatt, men tyven kan signere en endret melding selv. Begge svar godtas.",
        "4,2": "Tyven kan signere falske meldinger i eierens navn.",
        "4,3": "Eieren kan nå benekte signerte meldinger: «nøkkelen var stjålet». Ubenektelighet er relativ."
      } }
  ];
  KR.mekanismer = function (host) {
    host = host$(host); if (!host || !IN.matrise) return;
    clear(host);
    return IN.matrise(host, {
      id: "krypto-mekanismer",
      sporsmal: {
        eli5: "Hva gir hver mekanisme? Velg Ja eller Nei, og hvilken nøkkel den trenger. Bryterne under endrer situasjonen.",
        normal: "Fyll ut hvilke sikkerhetsegenskaper hver mekanisme gir alene, og hvilken nøkkeltype den bruker. Bryterne endrer forutsetningene, og fasiten følger med.",
        teknisk: "Mekanisme × egenskap, brukt alene og riktig. «Autentisitet» = mottakeren vet hvem som laget meldingen (dataautentisering). «Ubenektelighet» = en tredjepart kan avgjøre det. Bryterne endrer forutsetningene."
      },
      rader: ["Symmetrisk kryptering (AES)", "Asymmetrisk kryptering (mottakers offentlige nøkkel)", "Hash (SHA-256)", "MAC", "Digital signatur"],
      kolonner: [
        { navn: "Konfidensialitet", valg: JN },
        { navn: "Integritet (oppdager endring)", valg: JN },
        { navn: "Autentisitet (hvem sendte)", valg: JN },
        { navn: "Ubenektelighet", valg: JN },
        { navn: "Nøkkeltype", valg: NOK }
      ],
      fasit: KR.mekFasit,
      forklaring: {
        "0,0": "Bare den som har den hemmelige nøkkelen, kan lese.",
        "0,1": "Kryptering oppdager ikke endringer: snur Mallory en bit i C, snus samme bit i klarteksten (bit-flipping i fanen Symmetrisk).",
        "0,2": "Kryptering alene sier ikke hvem som laget chifferteksten, og den kan være endret underveis. Det trengs en MAC eller signatur i tillegg.",
        "1,0": "Bare mottakeren har den private nøkkelen som åpner.",
        "1,1": "Kryptering beskytter ikke mot endring.",
        "1,2": "Alle har mottakerens offentlige nøkkel, så hvem som helst kan ha laget chifferteksten.",
        "1,4": "Krypter med mottakers offentlige, dekrypter med mottakers private.",
        "2,0": "En hash skjuler ikke meldingen, og den sendes i klartekst.",
        "2,1": "Alle kan regne ut en hash. Mallory endrer meldingen og regner bare ut en ny hash.",
        "2,2": "Uten nøkkel sier hashen ingenting om hvem som laget den.",
        "2,4": "Hashfunksjoner har ingen nøkkel.",
        "3,0": "M går i klartekst ved siden av MAC-en (H2022 5.3: «Ingen»).",
        "3,1": "Uten K kan ikke Mallory lage en MAC som passer til en endret melding. Se «Mallory endrer M» i fanen MAC.",
        "3,2": "Bare den andre nøkkelinnehaveren kan ha laget den. Kurset kaller det enkel meldingsautentisering.",
        "3,3": "Begge har samme nøkkel, så Bob kunne laget MAC-en selv. Se «Dommer» i fanen MAC.",
        "3,4": "MAC er symmetrisk krypto: MAC = Hash(M, K).",
        "4,0": "Meldingen går i klartekst ved siden av S.",
        "4,1": "Bob sammenligner Ver(S, " + KPUB("A") + ") med Hash(M′).",
        "4,2": "Bare Alice har " + KPRIV("A") + ".",
        "4,3": "Alle kan verifisere med den offentlige nøkkelen, også en dommer. Bob kan ikke ha laget S.",
        "4,4": "Signer med avsenders private, verifiser med avsenders offentlige."
      },
      regel: { riktig: 1, feil: -0.5, blankt: 0, min: 0 },
      brytere: KR.mekBrytere
    });
  };

  /* ---------- Postkvante: hvem rammes, og hva erstatter dem (IN.bucketTask) ---------- */
  KR.pqcSpec = {
    id: "krypto-pqc-sorter",
    prompt: {
      eli5: "En stor kvantedatamaskin kan dirke opp noen låser, men ikke alle. Legg hver algoritme i riktig gruppe.",
      normal: "Legg hver algoritme i riktig gruppe: rammes den av en stor kvantedatamaskin, rammes den lite, eller er den en postkvantealgoritme som erstatter de sårbare?",
      teknisk: "Klassifiser etter kvantetrussel: tradisjonell asymmetrisk (kan knekkes), symmetrisk og hash (lite påvirket, lengre nøkler holder), og NIST-standardene etter bruksområde (nøkkeletablering eller signatur)."
    },
    zones: [
      { id: "knekkes", label: "Kan knekkes av kvantedatamaskin" },
      { id: "lite", label: "Lite påvirket (lengre nøkkel eller hash holder)" },
      { id: "kem", label: "Postkvante: erstatter til nøkkeletablering" },
      { id: "sig", label: "Postkvante: erstatter til signatur" }
    ],
    items: [
      { id: "rsa", html: "RSA", forklaring: "Tradisjonell asymmetrisk. Faktorisering kan løses av en stor kvantedatamaskin." },
      { id: "dh", html: "Diffie–Hellman", forklaring: "Diskret logaritme kan løses av en kvantedatamaskin. Erstattes av ML-KEM til nøkkeletablering." },
      { id: "dsa", html: "DSA (signatur)", forklaring: "Lysarket nevner DSA sammen med RSA og DH som tradisjonell asymmetrisk krypto som kan knekkes. Erstattes av ML-DSA eller SLH-DSA." },
      { id: "ecc", html: "ECC", forklaring: "Tradisjonell asymmetrisk krypto, som RSA. Faller på samme måte." },
      { id: "aes", html: "AES-256", forklaring: "Symmetrisk. Rammes lite; lang nøkkel holder." },
      { id: "sha", html: "SHA-256", forklaring: "Hash. Rammes lite; lengre hash (SHA-512) gir mer margin." },
      { id: "mlkem", html: "ML-KEM (FIPS 203)", forklaring: "«Kyber». Gitterbasert nøkkelinnkapsling, til nøkkeletablering." },
      { id: "mldsa", html: "ML-DSA (FIPS 204)", forklaring: "«Dilithium». Gitterbasert digital signatur." },
      { id: "slhdsa", html: "SLH-DSA (FIPS 205)", forklaring: "«SPHINCS+». Hashbasert digital signatur." }
    ],
    answer: { rsa: "knekkes", dh: "knekkes", dsa: "knekkes", ecc: "knekkes", aes: "lite", sha: "lite", mlkem: "kem", mldsa: "sig", slhdsa: "sig" },
    regel: { riktig: 1, feil: -0.5, blankt: 0, min: 0 },
    oppsummering: "Kvantetrusselen rammer tradisjonell asymmetrisk krypto: RSA, DSA, ECC og DH. Nøkkelutveksling flyttes til ML-KEM, signaturer til ML-DSA eller SLH-DSA. AES og SHA-2 beholdes med lang nøkkel og hash. Ikke bland KEM (nøkkelinnkapsling) og DSA (signatur).",
    kilde: { ref: "Forelesning om kryptografi (d02), lysark om postkvantekrypto", egneOrd: true }
  };
  KR.pqc = function (host) {
    host = host$(host); if (!host || !IN.bucketTask) return;
    clear(host);
    return IN.bucketTask(host, KR.pqcSpec, { instant: false });
  };
})();
