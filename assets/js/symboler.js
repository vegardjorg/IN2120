/* ============================================================
   IN2120 guide · symboler.js  (mekanismen er kopiert via IN2090 fra IN2010-guiden 2026-11-25)
   Symbolordliste for forklaringer og kode (IN.SYMBOLER) +
   en skanner som finner symbolene i ren tekst (IN.SYMBOLER.scan).
   Lastes rett etter core.js. Selve verktøytipset (IN.symbolTips) ligger i core.js,
   og pseudocode.js bruker skanneren i tokenizeren.

   Ordlisten følger kursets notasjon (plan/vranglaere.md og lysarkene): E(M, K), Hash(M), gᵃ mod p, ⊕,
   risikoformlene og biometriformlene. Hvert tips forklarer bokstavene og hvorfor formelen betyr noe.
   Ikke legg inn symboler kurset ikke bruker. core.js pakker i tillegg inn K<sup>X</sup><sub>priv|pub</sub>
   (id kpriv/kpub, arg = eieren) og g<sup>a</sup> (id dh), som er delt over flere tagger.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});

  /* Hvert symbol: vis (slik det står i teksten), navn (kort), txt (kort forklaring på kursnivå: hva hver
     bokstav betyr, og hvorfor formelen er viktig), eks (eksempel). Kildene står som kommentar
     (d02 = lysark 2, X18 = eksamen 2018, VL = plan/vranglaere.md). Fylt 2026-11-27 etter kartlegging
     av alle formler i guiden. En enkelt bokstav blir ALDRI et eget innslag (K = nøkkel i krypto, men
     konsekvens i risiko): bokstavene forklares bare inne i hele formelmønstre. */
  var S = {
    /* ---------- tegn ---------- */
    xor: { vis: "⊕", navn: "XOR (enten–eller)", txt: "Bit for bit: 1 når bitene er ulike, 0 når de er like. Viktig fordi XOR med samme verdi to ganger opphever seg, så samme nøkkel både krypterer og dekrypterer.", eks: "1 ⊕ 1 = 0, 1 ⊕ 0 = 1" }, // d02, VL
    konkat: { vis: "‖", navn: "sammenkjeding", txt: "Setter to verdier etter hverandre til én streng, for eksempel før de hashes.", eks: "salt ‖ passord = «x9Kq» + «hemmelig»" },
    gange: { vis: "×", navn: "ganger", txt: "Multiplikasjon.", eks: "0,5 per år × 200 000 kr = 100 000 kr per år" },
    omtrent: { vis: "≈", navn: "omtrent lik", txt: "Avrundet verdi, ofte en tilnærming til en toerpotens.", eks: "30! ≈ 2¹⁰⁸" },
    ulik: { vis: "≠", navn: "ikke lik", txt: "De to verdiene er forskjellige. I en hashsjekk betyr det at meldingen er endret.", eks: "H ≠ H′ → avvis meldingen" },
    merket: { vis: "′", navn: "merket (mottatt eller endret)", txt: "M′ eller H′ er den versjonen mottakeren fikk eller regnet ut selv, til forskjell fra originalen M eller H.", eks: "H′ = Hash(M′)" }, // d02
    mindreLik: { vis: "≤", navn: "mindre enn eller lik", txt: "Venstre side er høyst like stor som høyre side.", eks: "R ≤ 5" },
    storreLik: { vis: "≥", navn: "større enn eller lik", txt: "Venstre side er minst like stor som høyre side.", eks: "S ≥ T → godta" },
    inneholder: { vis: "⊃", navn: "inneholder", txt: "Det til venstre omfatter alt det til høyre.", eks: "KI ⊃ ML: all maskinlæring er KI" },

    /* ---------- symmetrisk krypto og moduser ---------- */
    kryptE: { vis: "C = E(M, K)", navn: "kryptering", txt: "E = krypteringsfunksjonen, M = meldingen (klarteksten), K = nøkkelen, C = chifferteksten. Uten K kan ingen gjøre C om til M igjen.", eks: "E(«hei», K) = «x7#q»" }, // d02
    kryptD: { vis: "M = D(C, K)", navn: "dekryptering", txt: "D = dekrypteringsfunksjonen, C = chifferteksten, K = nøkkelen, M = klarteksten tilbake. Symmetrisk: samme K som ved kryptering.", eks: "D(E(M, K), K) = M" }, // d02
    leke: { vis: "E(X, K) / D(Y, K)", navn: "lekechifferet", txt: "X = blokka inn, Y = blokka ut, K = nøkkelen. Samme oppsett som et ekte blokkchiffer, bare med bittesmå blokker.", eks: "" },
    ecb: { vis: "Cᵢ = E(Mᵢ, K)", navn: "ECB-modus", txt: "Hver klartekstblokk Mᵢ krypteres alene med nøkkelen K til chifferblokka Cᵢ. Svakheten: like blokker gir like chifferblokker, så mønstre lekker.", eks: "M₁ = M₃ gir C₁ = C₃" }, // d02, VL
    cbc: { vis: "Cᵢ = E(Cᵢ₋₁ ⊕ Mᵢ, K)", navn: "CBC-modus", txt: "Mᵢ = klartekstblokka, Cᵢ₋₁ = forrige chifferblokk (første gang IV, en tilfeldig startverdi), K = nøkkelen. Kjedingen gjør at like blokker gir ulik chiffertekst.", eks: "C₁ = E(IV ⊕ M₁, K)" }, // d02
    cbcD: { vis: "Mᵢ = D(Cᵢ, K) ⊕ Cᵢ₋₁", navn: "CBC-dekryptering", txt: "Dekrypter blokka med K, og XOR så bort forrige chifferblokk (IV for første blokk). Den XOR-en opphever XOR-en fra krypteringen.", eks: "M₁ = D(C₁, K) ⊕ IV" }, // d02
    ctr: { vis: "Cᵢ = E(Tᵢ, K) ⊕ Mᵢ", navn: "tellermodus (CTR)", txt: "Tᵢ = telleren, K = nøkkelen. E(Tᵢ, K) blir en nøkkelstrøm som XOR-es med klartekstblokka Mᵢ. Samme regnestykke dekrypterer (⊕ Cᵢ gir Mᵢ), og en teller må aldri gjenbrukes med samme K.", eks: "M₁ = E(T₁, K) ⊕ C₁" }, // d02
    ctrE: { vis: "E(T, K)", navn: "nøkkelstrøm i CTR", txt: "Telleren T kryptert med nøkkelen K. Resultatet brukes som engangsnøkkel for én blokk.", eks: "" },
    otp: { vis: "C = M ⊕ K", navn: "engangsnøkkel (OTP)", txt: "M = meldingen, K = en tilfeldig nøkkel like lang som M, C = chifferteksten. Perfekt hemmelig bare når K er ekte tilfeldig og brukes én gang.", eks: "0111 ⊕ 0101 = 0010" }, // d02
    otpTo: { vis: "M ⊕ K ⊕ K = M", navn: "XOR opphever seg", txt: "Samme nøkkel K (eller nøkkelstrøm U) XOR-et to ganger gir ingen endring. Derfor dekrypterer mottakeren med den samme nøkkelen eller nøkkelstrømmen.", eks: "C ⊕ K = M" }, // d02
    otpReuse: { vis: "C ⊕ C′ = M ⊕ M′", navn: "gjenbrukt engangsnøkkel", txt: "C og C′ er to chiffertekster laget med samme K. Nøkkelen faller bort, og angriperen sitter igjen med de to klartekstene XOR-et sammen. Derfor skal en engangsnøkkel aldri brukes to ganger.", eks: "(M ⊕ K) ⊕ (M′ ⊕ K) = M ⊕ M′" }, // d02, VL

    /* ---------- hash, MAC og signatur ---------- */
    hash: { vis: "H = Hash(M)", navn: "hashverdi", txt: "Hash = enveisfunksjonen, M = meldingen, H = et kort fingeravtrykk med fast lengde. Den minste endring i M gir en helt annen H.", eks: "Mottakeren regner H′ = Hash(M′)" }, // d02
    sjekk: { vis: "H =? H′", navn: "sammenlign hashverdier", txt: "«=?» betyr: sjekk om de er like. H kommer fra avsenderen, H′ har mottakeren regnet ut selv. Like: uendret. Ulike: endret eller falsk.", eks: "" }, // d02
    mac: { vis: "MAC = Hash(M, K)", navn: "MAC (meldingsautentiseringskode)", txt: "M = meldingen, K = en hemmelig nøkkel som begge parter deler. Bare den som kjenner K, kan lage riktig MAC, så mottakeren vet at M er uendret. Gir ikke ubenektelighet, fordi begge har K.", eks: "Mottakeren regner Hash(M′, K) og sammenligner" }, // d02
    hashRec: { vis: "Hash(Rec)", navn: "hash av sertifikatinnholdet", txt: "Rec = innholdet i sertifikatet (navn, offentlig nøkkel, gyldighet). CA-en signerer denne hashen.", eks: "" }, // d03
    saltHash: { vis: "H(salt ‖ passord)", navn: "saltet passordhash", txt: "salt = en tilfeldig verdi per bruker, lagret i klartekst ved siden av hashen. Like passord får ulik hash, og ferdige regnbuetabeller virker ikke.", eks: "" },
    sig: { vis: "S = Sig(H, privat nøkkel)", navn: "digital signatur", txt: "H = hashen av meldingen, signert med avsenderens private nøkkel (bare avsenderen har den). S = signaturen. Gir ekthet og ubenektelighet.", eks: "" }, // d02
    ver: { vis: "Ver(S, offentlig nøkkel)", navn: "verifisering av signatur", txt: "Mottakeren sjekker signaturen S med avsenderens offentlige nøkkel. Gir det H tilbake, og H er lik mottakerens egen Hash(M), er signaturen ekte.", eks: "" }, // d02
    kpriv: { vis: "K priv", navn: "privat nøkkel", txt: "Hevet bokstav = hvem nøkkelen tilhører, senket «priv» = privat. Holdes hemmelig av eieren og brukes til å signere og dekryptere.", eks: "" }, // d02
    kpub: { vis: "K pub", navn: "offentlig nøkkel", txt: "Hevet bokstav = hvem nøkkelen tilhører, senket «pub» = offentlig. Alle kan ha den og bruke den til å kryptere til eieren og sjekke eierens signatur.", eks: "" }, // d02

    /* ---------- Diffie–Hellman ---------- */
    dh: { vis: "gᵃ mod p", navn: "Diffie–Hellman", txt: "g = et offentlig grunntall, p = et offentlig primtall, a = Alices hemmelige tall. gᵃ mod p kan sendes åpent, fordi a i praksis ikke kan regnes ut fra den.", eks: "Alice sender gᵃ, Bob sender gᵇ, begge får gᵃᵇ" }, // d02
    dhSwap: { vis: "(gᵇ)ᵃ = gᵃᵇ", navn: "felles DH-nøkkel", txt: "Alice opphøyer Bobs verdi i sin hemmelige a, Bob gjør det samme med b. Begge ender på gᵃᵇ uten at den noen gang er sendt.", eks: "" }, // d02
    modp: { vis: "mod p", navn: "modulo p", txt: "Ta resten etter deling på p. Holder tallene små og gjør det vanskelig å regne baklengs.", eks: "17 mod 5 = 2" },

    /* ---------- nøkler og nøkkelrom ---------- */
    nn1: { vis: "n(n − 1)/2", navn: "antall symmetriske nøkler", txt: "n = antall deltakere. Hvert par trenger sin egen delte nøkkel, så tallet vokser kvadratisk. Det er grunnen til at man bruker asymmetrisk krypto (n nøkkelpar) eller et nøkkelsenter.", eks: "n = 100 gir 4950 nøkler" }, // d03
    log2: { vis: "log₂(N)", navn: "logaritme med grunntall 2", txt: "Hvor mange bit som trengs for N muligheter: 2 opphøyd i svaret gir N.", eks: "log₂(1024) = 10 bit" }, // d02
    pot2: { vis: "2ⁿ", navn: "nøkkelrom", txt: "n = nøkkellengden i bit, 2ⁿ = antall mulige nøkler. Uttømmende søk prøver i snitt halvparten. Hver ekstra bit dobler arbeidet.", eks: "AES-256: 2²⁵⁶ nøkler, i snitt 2²⁵⁵ forsøk" }, // d02
    kombi: { vis: "Aᴸ", navn: "antall passord eller nøkler", txt: "Grunntallet A = antall mulige tegn, eksponenten L = lengden. Lengden betyr mer enn tegnsettet.", eks: "62⁸ for 8 tegn blant a–z, A–Z og 0–9" },
    fak: { vis: "30! ≈ 2¹⁰⁸", navn: "nøkkelrom for substitusjon", txt: "30! = 30 · 29 · … · 1 måter å stokke alfabetet på. Et stort nøkkelrom hjelper likevel ikke, fordi frekvensanalyse knekker chifferet.", eks: "" }, // t02

    /* ---------- risiko ---------- */
    kvalR: { vis: "R = s + k", navn: "risiko (kvalitativ)", txt: "Her betyr s sannsynlighet og k konsekvens, ikke nøkkel. Begge er nivåer på en logaritmisk skala, så summen av nivåene tilsvarer produktet av sannsynlighet og konsekvens.", eks: "s = 3, k = 4 gir R = 7" }, // O3, X25
    kvantR: { vis: "R = S × K", navn: "risiko (kvantitativ)", txt: "Her betyr S sannsynlighet (hendelser per år) og K konsekvens i kroner, ikke nøkkel. R = forventet tap i kroner per år.", eks: "0,1 per år × 1 mill. kr = 100 000 kr per år" },
    logS: { vis: "s = 3 + log₁₀(S)", navn: "sannsynlighet som nivå", txt: "S = hendelser per år, s = nivået. Hvert nivå opp er ti ganger mer sannsynlig.", eks: "S = 1 per år gir s = 3" },
    logK: { vis: "k = log₁₀(K) − 2", navn: "konsekvens som nivå", txt: "K = tapet i kroner, k = nivået. Hvert nivå opp er ti ganger større tap.", eks: "K = 10 000 kr gir k = 2" },
    pot10: { vis: "10ˢ · 10ᵏ = 10ˢ⁺ᵏ", navn: "hvorfor nivåene legges sammen", txt: "Å gange potenser er det samme som å legge sammen eksponentene. Derfor gir nivå + nivå samme svar som sannsynlighet × kroner.", eks: "" },
    ale: { vis: "ALE = ARO × EF × AV", navn: "årlig forventet tap", txt: "ARO = hvor mange ganger per år, EF = andelen av verdien som tapes (0–1), AV = verdien. ALE = kroner per år, og kortformen er SLE × ARO. Brukes til å sammenligne med hva tiltaket koster.", eks: "2 × 0,25 × 400 000 = 200 000 kr per år" }, // X18–X19
    sle: { vis: "SLE = AV × EF", navn: "tap per hendelse", txt: "AV = verdien, EF = andelen som tapes ved én hendelse.", eks: "400 000 × 0,25 = 100 000 kr" }, // X18–X19
    roi: { vis: "ROI = (reduksjon − kostnad) / kostnad", navn: "avkastning på et tiltak", txt: "Reduksjon = hvor mye forventet tap går ned, kostnad = hva tiltaket koster. Over 0 betyr at tiltaket lønner seg.", eks: "(300 − 100) / 100 = 2" }, // X22

    /* ---------- biometri og tilgangskontroll ---------- */
    bioST: { vis: "S ≥ T", navn: "biometrisk avgjørelse", txt: "Her betyr S skåren (hvor lik prøven er malen) og T terskelen. Lik eller over T godtas. T styrer avveiningen mellom FMR og FNMR.", eks: "" }, // BA
    tmr: { vis: "TMR = 1 − FNMR", navn: "riktig godkjent", txt: "Andelen ekte brukere som slipper inn, er 1 minus andelen som feilaktig avvises.", eks: "FNMR = 0,03 gir TMR = 0,97" },
    tnmr: { vis: "TNMR = 1 − FMR", navn: "riktig avvist", txt: "Andelen bedragere som stoppes, er 1 minus andelen som feilaktig slipper inn.", eks: "" },
    eer: { vis: "FMR = FNMR", navn: "EER (likt feilnivå)", txt: "Terskelen der falsk godkjenning og falsk avvisning er like store. Brukes til å sammenligne systemer: lav EER er bedre.", eks: "" }, // BA
    match: { vis: "1:1 / 1:N", navn: "verifisering og identifisering", txt: "1:1 = sammenlign med én oppgitt identitet (verifisering). 1:N = søk gjennom alle N lagrede maler (identifisering).", eks: "" }, // BA
    blp: { vis: "L(o) ≤ L(økt)", navn: "Bell-LaPadula-regel", txt: "L = sikkerhetsnivået, o = objektet (filen), økt = subjektets nivå. Lesing krever L(o) ≤ L(økt): ikke lese opp. ∗-egenskapen: skriving krever L(o) ≥ L(økt): ikke skrive ned. Hindrer at hemmelig informasjon lekker nedover.", eks: "" }, // IAM
    cvss: { vis: "CVSS-skalaen", navn: "alvorlighetsgrad", txt: "0,1–3,9 lav, 4,0–6,9 middels, 7,0–8,9 høy og 9,0–10 kritisk.", eks: "" } // d08
  };

  /* Enkelttegn → id i S. */
  var CHAR = { "⊕": "xor", "‖": "konkat", "∥": "konkat", "×": "gange", "≈": "omtrent", "≠": "ulik",
    "′": "merket", "≤": "mindreLik", "≥": "storreLik", "⊃": "inneholder" };

  /* Mønstre som dekker flere tegn. Lengste treff på samme sted vinner (se scan).
     { id, re: /…/g, wrap?: 1 }  wrap = mønsteret har åpne/lukke-tegn med innhold mellom. */
  var MULTI = [
    { id: "otpReuse", re: /C\s*⊕\s*C[′']\s*=\s*M\s*⊕\s*M[′']/g },
    { id: "otpTo", re: /M\s*⊕\s*([KU])\s*⊕\s*\1\s*=\s*M/g },
    { id: "cbc", re: /C[₁-₉ᵢₙ]\s*=\s*E\(\s*(?:IV|C[₀-₉ᵢₙ₋]+)\s*⊕\s*M[₁-₉ᵢₙ]\s*,\s*K\s*\)/g },
    { id: "cbcD", re: /M[₁-₉ᵢ]\s*=\s*D\(\s*C[₁-₉ᵢ]\s*,\s*K\s*\)\s*⊕\s*(?:IV|C[₀-₉ᵢ₋]+)/g },
    { id: "ctr", re: /(?:[MC][₁-₉ᵢ]?\s*=\s*)?E\(\s*T[₁-₉ᵢ]?\s*,\s*K\s*\)\s*⊕\s*[MC][₁-₉ᵢ]?/g },
    { id: "ctrE", re: /E\(\s*T[₁-₉ᵢ]?\s*,\s*K\s*\)/g },
    { id: "ecb", re: /(?:C[₁-₉ᵢ]\s*=\s*)?E\(\s*M[₁-₉ᵢ]\s*,\s*K\s*\)/g },
    { id: "kryptE", re: /(?:C\s*=\s*)?E\(\s*M\s*,\s*[Kk]\s*\)/g },
    { id: "kryptD", re: /(?:M\s*=\s*)?D\(\s*C\s*,\s*[Kk]\s*\)/g },
    { id: "leke", re: /[ED]\(\s*[XY·]\s*,\s*K\s*\)/g },
    { id: "otp", re: /C\s*=\s*M\s*⊕\s*K(?![\w(])/g },
    { id: "mac", re: /MAC[′']?\s*=\s*Hash\(\s*M[′']?\s*,\s*[Kk]\s*\)/g },
    { id: "saltHash", re: /(?:Hash|H)\(\s*(?:salt|s)\s*[‖∥,]\s*passord\s*\)|Hash\(\s*passord\s*,\s*salt\s*\)/g },
    { id: "hashRec", re: /Hash\(\s*Rec[′']?\s*\)/g },
    { id: "hash", re: /(?:H[′']?\s*=\s*)?(?:Hash|H|h)\(\s*M[′']?\s*\)/g },
    { id: "sjekk", re: /H\s*=\?\s*H[′']/g },
    { id: "sig", re: /(?<![A-Za-zÆØÅæøå])[SR](?:_?A)?\s*=\s*Sig\(/g },
    { id: "ver", re: /(?<![A-Za-zÆØÅæøå])(?:H\s*=\s*)?Ver\(/g },
    { id: "dhSwap", re: /\(\s*g[ᵃᵇ]\s*\)[ᵃᵇ]/g },
    { id: "dh", re: /(?<![A-Za-zÆØÅæøå])g[ᵃᵇ]{1,2}(?:\s*\[?\s*mod\s+p\s*\]?)?/g },
    { id: "modp", re: /\[?(?<![A-Za-zÆØÅæøå])mod\s+p(?![A-Za-zÆØÅæøå])\]?/g },
    { id: "nn1", re: /(?<![A-Za-zÆØÅæøå])n\s*\(\s*n\s*[−-]\s*1\s*\)(?:\s*\/\s*2)?/g },
    { id: "log2", re: /log₂\s*(?:\([^)]{1,20}\)|\|K\||[A-Z])/g },
    { id: "fak", re: /30!\s*≈\s*2¹⁰⁸/g },
    { id: "pot2", re: /(?<![\d,])2(?:ⁿ|[⁰¹²³⁴⁵⁶⁷⁸⁹]+|\^(?:n|\d+))(?:\s*\/\s*2)?/g },
    { id: "kombi", re: /(?<![\d,])(?:26|29|62|95|105)(?:[ᴷᴸⁿ]|[⁰¹²³⁴⁵⁶⁷⁸⁹]+|\^(?:K|L|\d+))/g },
    { id: "pot10", re: /10ˢ\s*·\s*10ᵏ\s*=\s*10ˢ⁺ᵏ/g },
    { id: "logS", re: /(?<![A-Za-zÆØÅæøå])s\s*=\s*3\s*\+\s*log₁₀\s*\(?\s*S\s*\)?/g },
    { id: "logK", re: /(?<![A-Za-zÆØÅæøå])k\s*=\s*log₁₀\s*\(?\s*K\s*\)?\s*[−-]\s*2/g },
    { id: "ale", re: /ALE\s*=\s*(?:ARO\s*×\s*EF\s*×\s*AV|SLE\s*×\s*ARO|ARO\s*×\s*SLE)/g },
    { id: "sle", re: /SLE\s*=\s*AV\s*×\s*EF/g },
    { id: "roi", re: /ROI\s*=\s*\(\s*risikoreduksjon\s*[−-]\s*kostnad\s*\)\s*\/\s*kostnad/g },
    { id: "kvantR", re: /(?<![A-Za-zÆØÅæøå])R(?:isiko)?\s*=\s*S\s*[×·]\s*K(?![A-Za-zÆØÅæøå])/g },
    { id: "kvalR", re: /(?<![A-Za-zÆØÅæøå])R\s*=\s*[sS]\s*\+\s*[kK](?![A-Za-zÆØÅæøå])/g },
    { id: "tnmr", re: /TNMR\s*=\s*1\s*[−-]\s*FMR/g },
    { id: "tmr", re: /(?<!N)TMR\s*=\s*1\s*[−-]\s*FNMR/g },
    { id: "eer", re: /(?<!N)FMR\s*=\s*FNMR(?:\s*=\s*EER)?/g },
    { id: "bioST", re: /(?<![A-Za-zÆØÅæøå])S\s*[≥<]\s*T(?![A-Za-zÆØÅæøå])/g },
    { id: "match", re: /(?<![\d:])1\s*:\s*[1N](?![\d:A-Za-z])/g },
    { id: "blp", re: /L\(\s*o\s*\)\s*[≤≥]\s*L\(\s*økt\s*\)/g },
    { id: "cvss", re: /(?<![\d,])(?:0,1|4,0|7,0|9,0)\s*[–-]\s*(?:3,9|6,9|8,9|10(?:,0)?)(?![\d,])/g }
  ];

  function escRe(c) { return c.replace(/[\\^$.*+?()[\]{}|\/-]/g, "\\$&"); }
  /* Hurtigtest: finnes det i det hele tatt et kandidattegn i teksten? Bygges fra CHAR og MULTI. */
  function anyRe() {
    var parts = Object.keys(CHAR).map(escRe);
    MULTI.forEach(function (p) { parts.push(p.re.source); });
    return parts.length ? new RegExp(parts.join("|")) : null;
  }
  var ANY = anyRe();

  /* scan(text) → [{ i, n, id, open?, close?, single? }] sortert, uten overlapp. */
  function scan(text) {
    if (!text || !ANY || !ANY.test(text)) return [];
    var hits = [];
    MULTI.forEach(function (p) {
      p.re.lastIndex = 0;
      var m;
      while ((m = p.re.exec(text)) !== null) {
        var h = { i: m.index, n: m[0].length, id: p.id };
        if (p.wrap) { h.open = 1; h.close = 1; }
        hits.push(h);
        if (!m[0].length) p.re.lastIndex++;
      }
    });
    for (var i = 0; i < text.length; i++) {
      var id = CHAR[text.charAt(i)];
      if (id) hits.push({ i: i, n: 1, id: id, single: 1 });
    }
    // Lengste/første treff vinner; enkelttegn inne i et mønster forkastes.
    hits.sort(function (a, b) { return a.i - b.i || b.n - a.n; });
    var out = [], end = -1;
    hits.forEach(function (h) {
      if (h.i < end) return;
      out.push(h); end = h.i + h.n;
    });
    return out;
  }

  /* Oppslag for et treff: { vis, navn, txt, eks }. */
  function entry(id, arg) {
    var e = S[id];
    if (!e) return null;
    if ((id === "kpriv" || id === "kpub") && arg) {
      var priv = id === "kpriv", art = priv ? "priv" : "pub";
      return { vis: "K med " + arg + " over og " + art + " under", navn: (priv ? "privat" : "offentlig") + " nøkkel til " + arg,
        txt: "Hevet " + arg + " = hvem nøkkelen tilhører, senket «" + art + "» = " + (priv ? "privat" : "offentlig") + ". " +
          (priv ? "Bare " + arg + " har den. Den brukes til å signere og til å dekryptere det som er kryptert med den offentlige nøkkelen til " + arg + "."
                : "Alle kan ha den. Den brukes til å kryptere til " + arg + " og til å sjekke signaturer laget av " + arg + "."),
        eks: e.eks };
    }
    return e;
  }

  IN.SYMBOLER = { list: S, CHAR: CHAR, scan: scan, entry: entry };
})();
