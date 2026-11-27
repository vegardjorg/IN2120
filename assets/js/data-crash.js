/* ============================================================
   IN2120 guide · data-crash.js
   Register for crash course-løypa (crash.html): etapper i eksamensrekkefølge, steg vektet etter
   forventede eksamenspoeng. Registeret inneholder bare id-er som peker inn i de felles datakildene,
   ingen kopier:
     kort    → nøkler i eksamensbanken (window.IN_EXAM_BANK, «H2024-15»). Kortet bygges med
               IN.examBank.card, samme kort og samme lagring (in2120:insp:<key>) som blokksidene og eksamen.html.
     fig     → IN.FIGURER[key], tegnet uten svarfelt med IN.fig.vis(host, key, { husk: true })
               (huskeregelen fra IN.FIG_HUSK[key]).
     forklar → IN.FORKLAR[id] (figurer/forklar-a/b/c.js).
     les     → [side-id fra IN.PAGES, fane, lenketekst] for «Les mer»-lenken.
   Det eneste som er skrevet her, er de korte tekstene per steg (hvorfor, kjerne på tre nivåer,
   «dette må du kunne», feller). De bygger på blokksidene, plan/innhold/*.md, plan/vranglaere.md og
   plan/foreleser-vektlegging.md, skrevet med egne ord. Kilder: plan/sider/crash-kilder.md.

   Felt per steg:
     id, tittel, vekt (forventede poeng i H2026, sum 100), min ("E" | "S": korteste lengde steget er med i;
     Grundig tar med alt), tid (minutter lesing; kortenes tid regnes i crash.js),
     kort: { E: [...], S: [...], G: [...] } (kumulativt: Standard viser E+S, Grundig E+S+G).
   Hver banknøkkel står i nøyaktig ett steg (crash.js sjekker det i konsollen), så Grundig dekker hele banken.
   Vekt: snitt H2021–H2025 per blokk, med ekstra vekt på H2024–H2025 (plan/eksamensmonster.md),
   og rekkefølgen fra eksamensinfoen for 2026 (ni deler, én stor oppgave til slutt).
   Klassisk script. Lastes før crash.js.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  function t(e, n, k) { return { eli5: e, normal: n, teknisk: k }; }

  var LENGDER = [
    { id: "E", navn: "Ekspress", omtrent: "ca. 3 t", tekst: "Stegene som gir mest poeng per time, pluss det nye KI-stoffet, med én eller to eksamensoppgaver hver." },
    { id: "S", navn: "Standard", omtrent: "ca. 1 dag", tekst: "Alle stegene, med 3–5 eksamensoppgaver hver." },
    { id: "G", navn: "Grundig", omtrent: "flere dager", tekst: "Alle stegene og hele eksamensbanken (H2021–H2025)." }
  ];

  var ETAPPER = [
    /* ===================== 0 · SPILLEREGLER ===================== */
    { nr: 0, navn: "Spilleregler", hvor: "Før du begynner", steg: [
      { id: "0", tittel: "Slik ser eksamen ut, og slik rettes den", vekt: 0, min: "E", tid: 5,
        les: [["index", "", "Forsiden: slik ser eksamen ut"]],
        hvorfor: "Gir ingen poeng i seg selv, men bestemmer hvordan du henter poengene i resten.",
        kjerne: t(
          "<p>Eksamen er fire timer uten bøker eller notater. Den har ni deler. Del 1 har lette spørsmål fra hele pensum. Så kommer én del per tema. Helt til slutt kommer én stor oppgave. Svar på alt, og skriv kort.</p>",
          "<p>Eksamen 3. desember 2026 er i Inspera, 09:00–13:00, uten hjelpemidler. Den har ni deler og 100 poeng.</p><ul><li>Del 1 er generell og den letteste.</li><li>Del 2–9 tar for seg utvalgte temaer, og den siste oppgaven er stor.</li></ul><p>Det blir færre flervalg enn før og flere korte tekstsvar: H2025 hadde 55 poeng fritekst.</p>",
          "<p>Hver oppgave har sin egen poenglinje, typisk +0,5 per riktig, −0,5 per feil og 0 for blankt, med minst 0 per oppgave. Fritekst rettes manuelt etter sensors poengfordeling, for eksempel «2 p for prinsippet, 1 p for …». Fremgang i settet vises som blå søyler, og du kan gå fram og tilbake.</p>"),
        kunne: [
          "Ni deler, 100 poeng, 4 timer, ingen hjelpemidler. Ta de lette først og sett av tid til den store oppgaven til slutt (9–10 p).",
          "Feil valg kan gi minuspoeng, men hver oppgave gir minst 0. Faglærer sier: svar på alt.",
          "Står det «maks to setninger», skriv to vanlige setninger. Merk delsvarene A), B) … med blank linje imellom.",
          "Skriv aldri «se oppgave 2». Sensor retter oppgave for oppgave og ser ikke de andre svarene dine.",
          "Et hint i oppgaveteksten er ment brukt. Tolkningsspørsmål kan du stille faglærer i lokalet."
        ],
        feller: [
          "Les poenglinja: H2024 oppg. 3 og 5 ga minus for ubesvart, i strid med hovedregelen.",
          "Lange svar med innskutte ledd gir ikke flere poeng. Sensor ser etter bestemte ord og poeng."
        ],
        kort: { E: [], S: [], G: [] } }
    ] },

    /* ===================== 1 · DEL 1: GENERELT ===================== */
    { nr: 1, navn: "Del 1 · Generelt", hvor: "Først i settet, 10–40 p (13–40 p i H2023–H2025)", steg: [
      { id: "1a", tittel: "KIT-matrisen og sikkerhetsordene", vekt: 5, min: "E", tid: 5,
        les: [["grunnbegreper", "kit", "Blokk 1 → KIT og tjenestene"], ["grunnbegreper", "trygghet", "Sikkerhet, trygghet, visshet"]],
        hvorfor: "«Hvilket KIT-mål brytes?» har kommet alle fem år (H2021–H2025). Ordene sikkerhet, trygghet og visshet kom H2023–H2025.",
        kjerne: t(
          "<p>K: bare de som får lov, kan lese. I: ingen har endret noe i det skjulte. T: tingen virker når du trenger den. Spør deg selv: hva gikk galt for den som eier dataene?</p>",
          "<p>Konfidensialitet, integritet og tilgjengelighet (KIT) er de tre sikkerhetsmålene. I matrisene skal du finne hvilket mål hvert angrep bryter. Ofte er det bare ett. Sikkerhet (security) handler om vern mot tilsiktede handlinger, trygghet (safety) om vern mot ulykker og visshet (certainty) om å vite.</p>",
          "<p>Klassifiser etter <i>virkningen</i>, ikke etter teknikken: løsepengevirus bryter T, ikke K, selv om det krypterer. Hashkollisjon i en signatur bryter I. Avlytting av kryptert trafikk bryter ingenting før noen dekrypterer. Garanti (assurance) er tillit til at tiltakene virker.</p>"),
        kunne: [
          "K: bare de som har lov, får lese. I: data er korrekte og ikke endret uten lov. T: data og tjenester kan brukes når de trengs.",
          "DDoS og løsepengevirus bryter T. Lekker løsepengeviruset også data, kommer K i tillegg.",
          "Hashkollisjon i en signatur bryter I. En IPS som blokkerer en uskyldig bruker, bryter T.",
          "Sikkerhet = mot tilsiktede handlinger, trygghet = mot ulykker, visshet = å vite, garanti = tillit til at tiltak virker.",
          "NSM = Nasjonal sikkerhetsmyndighet. NCSC (Nasjonalt cybersikkerhetssenter) er NSMs enhet for hendelser."
        ],
        feller: [
          "«Løsepengevirus bryter K fordi det krypterer»: nei, dataene blir utilgjengelige (T).",
          "«Avlytting bryter K» når trafikken er kryptert og ikke blir dekryptert: ingen mål brytes."
        ],
        fig: ["H2023-1", "H2024-1"],
        kort: { E: ["H2025-2", "H2024-2"], S: ["H2024-3", "H2023-1", "H2024-1"], G: ["H2021-1.1", "H2022-1.1", "H2023-3", "H2025-1", "H2025-7"] } },

      { id: "1b", tittel: "Risikotrekanten og risikobegrepene", vekt: 3, min: "E", tid: 4,
        les: [["risiko", "begreper", "Blokk 6 → Risikobegreper"]],
        hvorfor: "Risikobegrepene sto i del 1 i H2021–H2024, og «risikotrekanten» er samme oppgave H2023 og H2024.",
        kjerne: t(
          "<p>Risiko trenger tre ting: noe verdifullt, noen som vil skade det, og et hull de kan komme gjennom. Mangler én av dem, er det ingen risiko.</p>",
          "<p>Risiko er en relevant kombinasjon av en trussel, en sårbarhet og en verdi: de tre hjørnene i risikotrekanten. En hendelse er et faktisk brudd på KIT. Risikonivå er hvor stor risikoen er, ut fra sannsynlighet og konsekvens.</p>",
          "<ul><li>Verdi: noe med krav til K, I eller T.</li><li>Trussel: mulig skadelig handling som kan utnytte en sårbarhet.</li><li>Sårbarhet: svakhet som gjør at angrepet ikke kan hindres.</li><li>Restrisiko: det som er igjen etter tiltak.</li></ul><p>«Risiko = sannsynlighet × konsekvens» er en formel for risiko<i>nivå</i>, ikke definisjonen av risiko.</p>"),
        kunne: [
          "Risikotrekanten: verdi, trussel og sårbarhet. Alle tre må være der for at det er en risiko.",
          "Hendelse = et brudd på ett eller flere KIT-mål. Restrisiko = risikoen som er igjen etter tiltak.",
          "Samsvar (compliance) betyr å oppfylle krav fra lov eller standard. Forsvarlig nivå får du gjennom risikovurdering."
        ],
        feller: [
          "Å blande trussel (det som kan skje) og sårbarhet (svakheten som gjør det mulig).",
          "Å kalle sannsynlighet × konsekvens for «risiko». Det er risikonivået."
        ],
        fig: ["H2024-13"],
        kort: { E: ["H2024-13"], S: ["H2022-1.2", "H2023-2"], G: ["H2021-1.2", "H2023-16"] } },

      { id: "1c", tittel: "Boksfarger og privilegienivåer", vekt: 4, min: "S", tid: 4,
        les: [["angrep", "pentest", "Blokk 4 → Pentest som metode"], ["system", "ringer", "Blokk 5 → Privilegienivåer"]],
        hvorfor: "Boksfargen i pentest har kommet hvert år fra H2022, og privilegienivåene H2023–H2025. Begge har stått i del 1 siden H2023.",
        kjerne: t(
          "<ul><li>Hvit boks: testeren får vite alt.</li><li>Svart boks: testeren får vite ingenting.</li><li>Grå: litt.</li></ul><p>I datamaskinen har programmene ulike nøkler: vanlige programmer har den svakeste, kjernen en sterkere og hypervisoren den sterkeste.</p>",
          "<ul><li>Svartboks: ingen forhåndsinformasjon, som en ekstern angriper.</li><li>Hvitboks: full dokumentasjon og kildekode.</li><li>Gråboks: noe informasjon, for eksempel en vanlig brukerkonto.</li><li>Privilegienivåer (ringer): 3 er bruker, 0 er kjerne og −1 er hypervisor. Lavere tall gir mer makt.</li></ul>",
          "<p>En prosess når sitt eget nivå og nivåer med høyere tall, aldri lavere.</p><ul><li>Brukerprosess (ring 3): bare ring 3.</li><li>Kjerneprosess (ring 0): ring 0, 1, 2 og 3.</li><li>Hypervisor (−1): alle.</li></ul><p>Pentest krever skriftlig tillatelse på forhånd, ellers er det datainnbrudd etter straffeloven § 204.</p>"),
        kunne: [
          "Svartboks = ingen informasjon. Hvitboks = full dokumentasjon. Gråboks = delvis informasjon.",
          "Ring 3 = brukermodus, ring 0 = kjerne, ring −1 = hypervisor. Lavere tall gir mer privilegium.",
          "En prosess kan nå eget nivå og høyere tall, men aldri lavere."
        ],
        feller: [
          "«Ring 3 har mest makt»: det er motsatt.",
          "Les overskriften nøye: H2025 oppg. 5 skrev «hypervisormodus» i overskriften og «bruker-prosess» i raden."
        ],
        kort: { E: ["H2025-4", "H2024-5"], S: ["H2023-5", "H2024-4"], G: ["H2022-4.3", "H2023-4", "H2025-5"] } }
    ] },

    /* ===================== 2 · KRYPTOGRAFI OG PKI ===================== */
    { nr: 2, navn: "Kryptografi og PKI", hvor: "Del 2, 10–15 p", steg: [
      { id: "2a", tittel: "Hvilken nøkkel? Signatur, MAC og asymmetrisk kryptering", vekt: 5, min: "E", tid: 6,
        les: [["krypto", "signatur", "Blokk 2 → Signatur"], ["krypto", "mac", "MAC"]],
        hvorfor: "Nøkkelvalget kom alle fem år, ofte med ordrett samme tekst. MAC mot signatur kom H2021–H2024.",
        kjerne: t(
          "<p>Skal du sende en hemmelighet, låser du med mottakerens åpne hengelås (offentlig nøkkel). Bare mottakeren har nøkkelen som åpner (privat nøkkel). Skal du signere, bruker du din egen private nøkkel, og alle kan sjekke med den offentlige.</p>",
          "<ul><li>Asymmetrisk kryptering: krypter med mottakers offentlige nøkkel, dekrypter med mottakers private.</li><li>Signatur: signer med avsenders private nøkkel, verifiser med avsenders offentlige.</li><li>En MAC bruker en felles hemmelig nøkkel. Derfor kan begge parter lage den, og den gir ikke ubenektelighet.</li></ul>",
          "<p>C = E(M, K<sup>B</sup><sub>pub</sub>), M = D(C, K<sup>B</sup><sub>priv</sub>). S = Sig(H, K<sup>A</sup><sub>priv</sub>), Ver(S, K<sup>A</sup><sub>pub</sub>) gir H, og H sammenlignes med Hash(M′). MAC = Hash(M, k) gir enkel meldingsautentisering. Signatur gir ubenektelig (sterk) dataautentisering. Ingen av dem gir konfidensialitet.</p>"),
        kunne: [
          "Kryptere til Bob: Bobs offentlige nøkkel. Bob dekrypterer med sin private nøkkel.",
          "Signere: avsenders private nøkkel. Verifisere: avsenders offentlige nøkkel.",
          "MAC: felles hemmelig nøkkel. Tredjepart kan ikke validere, og den gir ikke ubenektelighet.",
          "Stjålet privat nøkkel: tyven kan signere som eieren og lese det som sendes til eieren. Slutt å signere og tilbakekall nøkkelparet (arket: «revokere den offentlige nøkkelen», det vil si sertifikatet).",
          "Lekker en privat signaturnøkkel, kan eieren benekte signerte meldinger. Lekker den offentlige, skjer ingenting: den er offentlig."
        ],
        feller: [
          "«Man signerer med den offentlige nøkkelen»: nei, med den private.",
          "«MAC gir ubenektelighet» eller «signatur gir konfidensialitet»: begge er feil.",
          "H2022 6.1: «Alice kan signere til Charlie med sin egen nøkkel» er trivielt sant. Mange stryker det fordi det virker for lett."
        ],
        kort: { E: ["H2025-9", "H2024-12"], S: ["H2024-19", "H2023-15", "H2024-7"], G: ["H2021-1.4", "H2021-3.5", "H2022-5.1", "H2022-5.3", "H2022-5.4", "H2023-7"] } },

      { id: "2b", tittel: "Operasjonsmoduser: ECB, CBC og CTR", vekt: 3, min: "E", tid: 4,
        les: [["krypto", "moduser", "Blokk 2 → Moduser"]],
        hvorfor: "Diagramoppgaven om moduser kom H2021–H2025, ofte med samme figur.",
        kjerne: t(
          "<p>ECB krypterer hver bit for seg, så like biter blir like. Derfor ser du pingvinen gjennom krypteringen. CBC lenker bitene sammen. CTR lager en hemmelig strøm av tall og blander den med teksten.</p>",
          "<p>Se hva som går inn i E.</p><ul><li>ECB: bare M, ingen ⊕ og ingen piler mellom blokkene.</li><li>CBC: ⊕ med forrige chiffertekst <i>før</i> E, med IV i første blokk.</li><li>CTR: telleren går inn i E, og ⊕ med M kommer <i>etter</i> E.</li></ul><p>ECB er usikker fordi like klartekstblokker gir like chiffertekstblokker.</p>",
          "<p>CTR: C<sub>i</sub> = E(T<sub>i</sub>, K) ⊕ M<sub>i</sub> og M<sub>i</sub> = E(T<sub>i</sub>, K) ⊕ C<sub>i</sub>. CTR bruker bare E, også ved dekryptering. CBC: C<sub>1</sub> = E(IV ⊕ M<sub>1</sub>, K). IV-en skal være tilfeldig, men trenger ikke være hemmelig. XOR-regning: 1 ⊕ 1 = 0, 1 ⊕ 0 = 1.</p>"),
        kunne: [
          "ECB: bare M inn i E. Like blokker gir like chifferblokker (pingvinbildet).",
          "CBC: ⊕ før E, og C går videre til neste blokk. IV i første blokk.",
          "CTR: teller inn i E, ⊕ med M etter E. Blokkene er uavhengige, og bare E brukes.",
          "XOR bit for bit: like biter gir 0, ulike gir 1. 1101 ⊕ 0101 = 1000."
        ],
        feller: [
          "«CTR bruker D ved dekryptering»: nei, samme E(T, K) en gang til.",
          "«IV i CBC må være hemmelig»: nei, den skal være tilfeldig."
        ],
        fig: ["H2025-8", "H2022-5.5"],
        kort: { E: ["H2025-8"], S: ["H2024-17", "H2022-5.5"], G: ["H2021-3.2", "H2021-3.3", "H2023-20"] } },

      { id: "2c", tittel: "Hash, begrepsmatrisen og sterk krypto", vekt: 3, min: "S", tid: 5,
        les: [["krypto", "hash", "Blokk 2 → Hash"], ["krypto", "maal", "Styrke og nøkkelrom"]],
        hvorfor: "Hashpåstander kom H2021–H2024. Matrisen «symmetrisk, asymmetrisk, hash eller PKI» kom H2023–H2025. Kerckhoffs og Vigenère kom som fritekst i H2025.",
        kjerne: t(
          "<p>En hashfunksjon lager et kort fingeravtrykk av en hvilken som helst tekst. Du kan ikke gå tilbake fra fingeravtrykket til teksten, og to ulike tekster skal ikke få samme avtrykk.</p>",
          "<p>Hashkravene: lett å beregne, komprimerer til fast lengde, enveis, svak og sterk kollisjonsresistens. En hash har ingen nøkkel og er ikke kryptering. Kerckhoffs' prinsipp: bare nøkkelen skal være hemmelig, ikke algoritmen. Nøkkelrommet med n bit er 2<sup>n</sup> nøkler.</p>",
          "<ul><li>Svak kollisjonsresistens: gitt x er det vanskelig å finne y ≠ x med H(y) = H(x).</li><li>Sterk: vanskelig å finne noe par i det hele tatt.</li></ul><p>H(x) = x + 1 er ikke enveis. Vigenère med alfabet på 29 tegn og nøkkellengde K har 29<sup>K</sup> nøkler og knekkes med frekvensanalyse. AES har 128-, 192- eller 256-bit nøkler. «AES-512» finnes ikke.</p>"),
        kunne: [
          "Fem hashkrav: lett å beregne, komprimering, enveis, svak og sterk kollisjonsresistens.",
          "Hash brukes til integritetssjekk (f.eks. av nedlastinger), forutsatt at hashverdien selv er beskyttet.",
          "Én endret bit i input endrer omtrent halvparten av bitene i hashen. Å invertere er praktisk umulig, men teoretisk mulig.",
          "Symmetrisk: AES, DES, Caesar. Asymmetrisk: RSA, ECC, DH. Hash: SHA-2, SHA-3. PKI: sertifikater og CA-er.",
          "Kerckhoffs: bare nøkkelen skal være hemmelig. Nøkkelrom: n bit gir 2<sup>n</sup> nøkler, og N nøkler krever log<sub>2</sub>N bit."
        ],
        feller: [
          "«SHA-256 krypterer»: en hash har ingen nøkkel og er ikke kryptering.",
          "«Symmetrisk modus» er en distraktor (H2021 3.2). «AES-512» finnes ikke, men i H2025 6 var fasiten likevel symmetrisk kryptering."
        ],
        forklar: ["hashkrav"],
        kort: { E: ["H2025-6", "H2024-18"], S: ["H2025-10", "H2025-11", "H2025-3"], G: ["H2021-3.1", "H2021-3.4", "H2022-5.2", "H2023-21", "H2023-6", "H2024-6", "H2021-4.1"] } },

      { id: "2d", tittel: "Fremoverhemmelighold: DH mot hybrid kryptering", vekt: 3, min: "S", tid: 4,
        les: [["krypto", "dh", "Blokk 2 → Diffie–Hellman"], ["krypto", "asym", "Asymmetrisk og hybrid"]],
        hvorfor: "Kom H2021 (fritekst), H2023 og H2024 («Sikkert og visst» mot «Sorte hull») og H2025 (fritekst, 3 p).",
        kjerne: t(
          "<p>Med DH lager de to partene en ny hemmelighet hver gang og kaster den etterpå. Stjeler noen den faste nøkkelen senere, er de gamle hemmelighetene borte for alltid.</p>",
          "<p>Fremoverhemmelighold betyr at gamle øktnøkler forblir hemmelige selv om langtidsnøkkelen lekker senere. DH med nye verdier per økt gir det. Hybrid kryptering, der øktnøkkelen sendes kryptert med mottakers offentlige nøkkel, gir det ikke: den som senere får den private nøkkelen, kan dekryptere alle opptak.</p>",
          "<p>DH: A sender g<sup>a</sup> mod p, B sender g<sup>b</sup> mod p, og begge regner g<sup>ab</sup>. DH etablerer en felles symmetrisk nøkkel, men autentiserer ikke. Uten signatur er den sårbar for mann-i-midten. DH er ikke kvantesikker.</p>"),
        kunne: [
          "Fremoverhemmelighold: en senere lekket langtidsnøkkel avslører ikke gamle økter.",
          "DH (nye verdier per økt) gir fremoverhemmelighold. Hybrid kryptering gjør det ikke.",
          "DH uten signatur er sårbar for mann-i-midten.",
          "Fullt TLS 1.3-handtrykk bruker alltid flyktig (EC)DH og gir fremoverhemmelighold (nettverkslysarket s. 20). Statisk RSA-nøkkeltransport er fjernet. Bare gjenopptak med ren forhåndsdelt nøkkel (PSK) mangler det."
        ],
        feller: [
          "«Hybrid kryptering gir fremoverhemmelighold fordi øktnøkkelen er ny»: samme langtidsnøkkel beskytter alle øktnøklene.",
          "«DH krypterer» eller «DH autentiserer»: nei, DH etablerer en felles nøkkel."
        ],
        kort: { E: ["H2025-12"], S: ["H2024-14"], G: ["H2023-17", "H2021-5.3"] } },

      { id: "2e", tittel: "PKI: sertifikatsti, sertifikattyper og kryptoperioder", vekt: 4, min: "E", tid: 5,
        les: [["pki", "kjede", "Blokk 3 → Sertifikatkjeden"], ["pki", "kryptoperiode", "Kryptoperioder"]],
        hvorfor: "Sertifikatstien kom H2023 og H2024, X.509 H2023 og H2024, sertifikattype-matrisen H2021 og H2022 og kryptoperiodene H2021.",
        kjerne: t(
          "<p>Et sertifikat er et ID-kort for en nettside. Kortet er stemplet av en CA, som igjen er stemplet av en rot som alle stoler på fra før. Nettleseren sjekker stemplene fra roten og ned.</p>",
          "<p>Et X.509-sertifikat binder et navn til en offentlig nøkkel og er signert av en CA. Kjeden går fra en selvsignert rot-CA via mellomliggende CA til subjektsertifikatet. Rotsertifikatet ligger i nettleseren eller OS-et fra før. Sertifikatet inneholder aldri en privat nøkkel.</p>",
          "<ul><li>Subjektsertifikatet signeres med den mellomliggende CA-ens <i>private nøkkel</i>, ikke «av sertifikatet».</li><li>Kryptoperioden varer fra start av beskyttelsesperioden (kryptere med hemmelig/offentlig, signere med privat) til slutt av prosesseringsperioden (dekryptere med hemmelig/privat, validere med offentlig). Periodene overlapper, og en nøkkel kan brukes til beskyttelse og/eller prosessering.</li><li>Kompromittert nøkkel: all beskyttelse stopper, prosessering av gamle data kan tillates.</li><li>Et gyldig sertifikat gir autentisitet, ikke pålitelighet (tillitsforvirring).</li></ul>"),
        kunne: [
          "Sertifikatsti: rot-CA (selvsignert, i nettleseren) → mellomliggende CA → subjektsertifikat (f.eks. uio.no).",
          "Standarden for sertifikater er X.509. Sertifikatet har offentlig nøkkel, navn, gyldighet og CA-ens signatur.",
          "Beskyttelse: kryptere (hemmelig eller offentlig) og signere (privat). Prosessering: dekryptere (hemmelig eller privat) og validere (offentlig).",
          "Kompromittert nøkkel: stopp all beskyttelse straks. Dekryptering av gamle data kan fortsette.",
          "Selvsignert sertifikat uten tillit på forhånd gir ingen sikkerhet. Hengelåsen betyr autentisitet, ikke at nettstedet er ærlig."
        ],
        feller: [
          "«Sertifikatets nøkkel signerer subjektsertifikater»: det er CA-ens private nøkkel. Riktig svar på arket var «ingen».",
          "«Kompromittert privat nøkkel kan fortsatt signere»: nei, signering er beskyttelse og må stoppe."
        ],
        fig: ["H2024-15", "H2022-6.2"],
        kort: { E: ["H2024-15", "H2022-6.2"], S: ["H2024-16", "H2021-4.3", "H2022-6.1"], G: ["H2021-4.2", "H2021-4.4", "H2022-6.3", "H2022-6.4", "H2023-18", "H2023-19"] } }
    ] },

    /* ===================== 3 · ANGREPSVEKTORER OG SKADEVARE ===================== */
    { nr: 3, navn: "Angrepsvektorer og skadevare", hvor: "Del 3, 10–15 p", steg: [
      { id: "3a", tittel: "Phishing og skadevaretypene", vekt: 5, min: "E", tid: 5,
        les: [["angrep", "skadevare", "Blokk 4 → Skadevare"], ["angrep", "phishing", "Phishing"]],
        hvorfor: "Phishingtypen kom H2021–H2024, skadevarematrisen H2021–H2024, og «hvilke rettigheter får skadevaren» H2022 og H2023.",
        kjerne: t(
          "<p>Et virus trenger en vert og hjelp fra deg for å spre seg. En orm sprer seg selv. En trojaner later som den er snill. En logisk bombe venter på et bestemt tidspunkt. Phishing er falske meldinger som lurer deg.</p>",
          "<ul><li>Masse-phishing sendes til mange med samme tekst.</li><li>Spyd-phishing er rettet mot én person eller gruppe, hval-phishing mot ledere og klone-phishing kopierer en ekte melding.</li><li>Orm: sprer seg selv over nett.</li><li>Virus: fester seg til en vert.</li><li>Trojaner: ser nyttig ut, men gjør noe skadelig.</li><li>Bakdør: skjult vei inn.</li><li>Logisk bombe: utløses av en betingelse.</li></ul>",
          "<p>Skadevare får rettighetene til brukeren eller prosessen som kjører den. Med UAC av eller sudo uten passord kan den få administrator. Morris-ormen (1988) var en dataorm. Rootkit skjuler seg for OS, logger og antivirus. Løsepengevirus bryter T. Tiltaket er frakoblede sikkerhetskopier.</p>"),
        kunne: [
          "Phishing: masse (mange mottakere), spyd (målrettet), hval (ledere), klone (kopi av ekte melding).",
          "Orm sprer seg selv. Virus trenger en vert. Trojaner later som den er nyttig. Logisk bombe venter på en betingelse.",
          "Skadevare kjører med rettighetene til den som starter den. Minste privilegium begrenser skaden.",
          "Leveransekjedeangrep: angriperen går via en leverandør du stoler på."
        ],
        feller: [
          "Netflix- og Apple Pay-e-poster til mange mottakere er masse-phishing, ikke spyd-phishing.",
          "«En falsk antivirusapp» er en trojaner, selv om den også kan inneholde andre typer."
        ],
        fig: ["H2022-3.2", "H2023-22"],
        forklar: ["skadevaretre"],
        kort: { E: ["H2024-21", "H2024-20"], S: ["H2024-22", "H2023-24", "H2023-22"], G: ["H2021-2.1", "H2021-2.2", "H2021-2.3", "H2021-2.4", "H2021-2.5", "H2022-3.1", "H2022-3.2", "H2022-3.4", "H2022-3.5", "H2022-3.6", "H2023-23"] } },

      { id: "3b", tittel: "Injeksjon, filtre og rootkit (fritekst)", vekt: 4, min: "E", tid: 6,
        les: [["angrep", "sqli", "Blokk 4 → SQL-injeksjon og filtre"]],
        hvorfor: "Fritekst med mange poeng: SQL-injeksjon og klientfilter (H2024, 6 p), rootkit-scenario (H2025, 7 p) og ordfilter (H2025).",
        kjerne: t(
          "<p>SQL-injeksjon er å skrive inn noe som blir en del av kommandoen til databasen. Et filter i nettleseren hjelper ikke, for brukeren bestemmer selv over nettleseren sin.</p>",
          "<p>Ved SQL-injeksjon endrer inndata selve spørringen, for eksempel <code>A' or 2==2</code> som alltid er sant. Et filter som stopper bare én bestemt tekst, omgås med en annen tekst som betyr det samme. Validering på klientsiden gir ingen sikkerhet: brukeren kan slå av skriptet eller sende forespørselen via en proxy. Valider på tjeneren og bruk parametriserte spørringer.</p>",
          "<p>Rootkit: skadevare som skjuler seg for OS, logger og antivirus. Ved hendelsen: isoler maskinen, sjekk om skadevaren har spredt seg (sensor: 2 p), og finn ut hvordan den kom inn (1 p). Det holder ikke å fjerne den synlige skadevaren: reinstaller fra rent medium, siden et rootkit kan ha skjult bakdører.</p>"),
        kunne: [
          "SQL-injeksjon: inndata blir en del av spørringen. Eksempel som alltid er sant: <code>' or 2==2</code>.",
          "Filter på klientsiden er ikke et sikkerhetstiltak. Brukeren kontrollerer det som kjører hos brukeren.",
          "Svartelister omgås med varianter (store bokstaver, mellomrom, synonymer). Hvitelister er bedre.",
          "Rootkit: isoler, sjekk spredning, finn inngangen, og reinstaller fra rent medium.",
          "XSS (skripting på tvers av noder) er også injeksjon: angriperens skript havner i en side og kjører i offerets nettleser. Lagret XSS ligger på nettstedet, reflektert XSS kommer tilbake i svaret på en lenke offeret åpner."
        ],
        feller: [
          "H2024 23 C: bare «nei» ga 0,5 av 3 p. Begrunnelsen (brukeren kontrollerer klienten, proxy) gir resten.",
          "«Antiviruset fant ingenting, så maskinen er ren»: rootkitets formål er nettopp å skjule seg."
        ],
        forklar: ["xss-typer"],
        kort: { E: ["H2025-19"], S: ["H2024-23", "H2025-16"], G: ["H2023-25"] } },

      { id: "3c", tittel: "Pentestverktøy, OSINT, sudo og § 204", vekt: 4, min: "S", tid: 5,
        les: [["angrep", "sudo", "Blokk 4 → Sudo og logger"], ["angrep", "osint", "OSINT"]],
        hvorfor: "Programnavn kom H2023–H2025 (mimikatz, nmap), sudo-misbruk H2022 og H2023 (5 p), § 204 H2022 og H2025 og OSINT H2025.",
        kjerne: t(
          "<p>Pentesteren bruker de samme verktøyene som en angriper, men har lov. nmap finner åpne dører, John knekker passord, mimikatz henter passord fra Windows. Uten skriftlig lov er det straffbart.</p>",
          "<ul><li>nmap: portskanning og kartlegging.</li><li>John the Ripper og hashcat: passordknekking (ordliste og regler).</li><li>mimikatz: henter passordhasher og legitimasjon fra Windows-minnet.</li><li>Wireshark: fanger og viser nettverkstrafikk.</li><li>OSINT (open source intelligence) er etterretning fra åpne kilder i rekognoseringsfasen.</li></ul>",
          "<ul><li>Sudo-misbruk: har en bruker sudo på et program som kan starte et skall (python3, bash, vim), får brukeren et root-skall direkte. Sudo på et program som leser filer (cat) gir lesetilgang til alt, for eksempel /etc/shadow, og hashene kan så knekkes offline. Tiltak: minste privilegium.</li><li>Straffeloven § 204 (datainnbrudd): bot eller fengsel inntil 2 år. En pentest krever skriftlig tillatelse på forhånd.</li><li>Mange mislykkede innlogginger mot én konto fra én IP er passordgjetting (arket kaller det «passordspraying»).</li></ul>"),
        kunne: [
          "nmap = portskanning, John/hashcat = passordknekking, mimikatz = Windows-legitimasjon, Wireshark = trafikkfangst.",
          "OSINT = Open Source Intelligence: informasjon fra åpne kilder, brukt i rekognosering og til målrettet phishing.",
          "Sudo på python3, bash eller vim gir et root-skall direkte. Sudo på cat gir lesetilgang til alt, f.eks. /etc/shadow, og hashene kan knekkes offline. Minste privilegium hindrer det.",
          "§ 204: datainnbrudd straffes med bot eller fengsel inntil 2 år. Pentest krever skriftlig tillatelse på forhånd."
        ],
        feller: [
          "H2023 26: fasit er «passordspraying», selv om vanlig definisjon er ett passord mot mange kontoer. Kjenn begge.",
          "Å svare «hvitboks» når testeren ikke får noe informasjon (det er svartboks)."
        ],
        fig: ["H2023-29", "H2025-14"],
        kort: { E: ["H2025-14", "H2025-13"], S: ["H2023-29", "H2025-18", "H2024-24"], G: ["H2022-3.3", "H2022-4.4", "H2023-8", "H2023-26", "H2023-28", "H2024-8", "H2025-17"] } }
    ] },

    /* ===================== 4 · NETTVERKSSIKKERHET ===================== */
    { nr: 4, navn: "Nettverkssikkerhet", hvor: "Del 4, 10–20 p", steg: [
      { id: "4a", tittel: "Protokoll → lag, porter og kryptert eller ukryptert", vekt: 5, min: "E", tid: 5,
        les: [["nettverk", "lag", "Blokk 9 → Lag og porter"]],
        hvorfor: "«Protokoll → lag» kom H2021, H2022, H2024 og H2025. H2024 28 alene ga 6 p.",
        kjerne: t(
          "<p>Nettet er bygd i etasjer. Øverst er appen du bruker, nederst ledningen. Hver protokoll bor i én etasje. Noen protokoller låser innholdet (SSH), andre sender alt i klartekst (Telnet).</p>",
          "<p>Internettstakken ovenfra: applikasjon, transport, internett (IP), link, fysisk. OSI har sju lag: applikasjon, presentasjon, sesjon, transport, nettverk, link, fysisk. Internettets applikasjonslag dekker OSI 7–5. ARP ligger i linklaget, IP i internettlaget, TCP og UDP i transportlaget og HTTP i applikasjonslaget.</p>",
          "<ul><li>Kursets plassering av TLS: TLS Handshake i applikasjonslaget, TLS Record i transportlaget.</li><li>IPsec ligger i IP-laget og har ikke port.</li><li>Porter: 21 FTP, 22 SSH, 23 Telnet, 80 HTTP, 443 HTTPS, 3389 RDP.</li><li>Kryptert: SSH, RDP, HTTPS. Ukryptert: Telnet, HTTP, FTP, ARP.</li><li>Kursfiguren i H2025 22 har i tillegg «App» (brukerprogrammet, f.eks. Outlook) over applikasjonslaget.</li></ul>"),
        kunne: [
          "Internettstakken: applikasjon, transport, internett, link, fysisk. OSI: 7 applikasjon … 1 fysisk.",
          "ARP = link, IP = internett, TCP/UDP = transport, HTTP/Telnet/DNS = applikasjon. IPsec = IP-laget.",
          "TLS: Handshake i applikasjonslaget, Record i transportlaget (kursets inndeling).",
          "Porter: 21 FTP, 22 SSH, 23 Telnet, 80 HTTP, 443 HTTPS, 3389 RDP.",
          "Kryptert: SSH, RDP, HTTPS. Ukryptert: Telnet, HTTP, FTP, ARP."
        ],
        feller: [
          "«Hele TLS ligger i transportlaget»: kurset deler TLS på to lag.",
          "H2025 22: i figuren står fysisk til venstre og applikasjon til høyre. Les retningen før du drar."
        ],
        fig: ["H2025-22", "H2024-28"],
        kort: { E: ["H2025-22", "H2025-23"], S: ["H2024-28", "H2024-26"], G: ["H2021-5.1", "H2021-5.2", "H2022-7.1", "H2023-10"] } },

      { id: "4b", tittel: "TLS, HSTS, IPsec, VPN og Tor", vekt: 4, min: "S", tid: 5,
        les: [["nettverk", "tls", "Blokk 9 → TLS 1.3"], ["nettverk", "hsts", "Stripping og HSTS"], ["nettverk", "ipsec", "IPsec, VPN og Tor"]],
        hvorfor: "De fem nedtrekkene om TLS, IPsec, HSTS, sky-VPN og OWASP kom ordrett H2023 og H2024 (5 p). Tor kom H2022, HSTS H2024.",
        kjerne: t(
          "<p>TLS er en låst tunnel mellom nettleseren og nettsiden. En angriper kan prøve å lure deg over på en ulåst vei (stripping). HSTS er et skilt som sier «bruk alltid den låste veien hit». Tor pakker meldingen i flere lag, som en løk.</p>",
          "<ul><li>TLS 1.3 gir konfidensialitet, integritet og autentisering av tjeneren med sertifikat.</li><li>TLS-stripping nedgraderer HTTPS til HTTP.</li><li>HSTS sier at nettleseren bare skal bruke HTTPS mot domenet.</li><li>IPsec beskytter IP-pakker (ESP i transport- eller tunnelmodus) og brukes i VPN.</li><li>Tor krypterer i tre lag, ett for hver node.</li></ul>",
          "<p>HSTS virker ikke ved første besøk, med mindre domenet ligger i preload-listen. Tor: klienten krypterer med nøkkelen til utgangsnoden innerst og inngangsnoden ytterst. Hver node fjerner ett lag. Utgangsnoden ser klarteksten hvis forbindelsen ikke også er TLS-kryptert.</p>"),
        kunne: [
          "TLS-stripping: mann-i-midten nedgraderer til HTTP. HSTS hindrer det, men ikke ved første besøk uten preload.",
          "IPsec: ESP i transportmodus (bare nyttelasten) eller tunnelmodus (hele pakken pakkes inn). Brukes til VPN.",
          "Tor: tre lag kryptering. Innerste lag tilhører utgangsnoden, ytterste inngangsnoden.",
          "Fullt TLS 1.3-handtrykk bruker alltid flyktig (EC)DH og gir fremoverhemmelighold (nettverkslysarket s. 20). Statisk RSA-nøkkeltransport er fjernet. Bare gjenopptak med ren forhåndsdelt nøkkel (PSK) mangler det."
        ],
        feller: [
          "«HSTS beskytter alltid»: ikke første gang, uten preload.",
          "«Tor gjør trafikken kryptert helt fram»: etter utgangsnoden gjelder bare den krypteringen tjenesten selv bruker."
        ],
        fig: ["H2022-7.2"],
        forklar: ["ipsec-moduser"],
        kort: { E: ["H2024-25"], S: ["H2024-9", "H2022-7.2"], G: ["H2023-30", "H2024-10"] } },

      { id: "4c", tittel: "Brannmur og iptables", vekt: 4, min: "E", tid: 5,
        les: [["nettverk", "brannmur", "Blokk 9 → Brannmurer"]],
        hvorfor: "Brannmurtyper kom H2021–H2023. Å skrive en iptables-regel kom H2023, og å evaluere regler H2025.",
        kjerne: t(
          "<p>En brannmur er en dørvakt med en liste. Den leser lista ovenfra og gjør det første som passer. Står du ikke på lista, avgjør husregelen.</p>",
          "<p>En tilstandsløs brannmur ser på hver pakke for seg. En tilstandsbasert brannmur husker forbindelsene. En applikasjonsbrannmur forstår innholdet. I iptables leses reglene ovenfra, og første treff avgjør. Trafikk gjennom brannmuren går i FORWARD-kjeden, trafikk til brannmuren selv i INPUT.</p>",
          "<p>Treffer ingen regel, avgjør standardpolicyen (-P). Standard i iptables er ACCEPT, så legg inn eksplisitt DROP til slutt. Eksempel: <code>iptables -A FORWARD -p tcp -d 10.0.0.5 --dport 443 -j ACCEPT</code>. En regel lenger ned som aldri nås fordi en tidligere regel har droppet samme trafikk, betyr ingenting.</p>"),
        kunne: [
          "Første regel som treffer, avgjør. Rekkefølgen betyr alt.",
          "FORWARD = trafikk gjennom brannmuren, INPUT = til brannmuren, OUTPUT = fra brannmuren.",
          "Standardpolicy i iptables er ACCEPT hvis ingen setter den. Avslutt med DROP.",
          "Tilstandsløs (pakkefilter), tilstandsbasert (husker forbindelser), applikasjonsbrannmur (forstår innholdet)."
        ],
        feller: [
          "Å bruke INPUT-regelen på trafikk som går gjennom brannmuren til et annet nett.",
          "H2025 24 oppgir ikke standardpolicyen. Fasiten forutsetter DROP. Skriv antakelsen din."
        ],
        fig: ["H2023-32"],
        forklar: ["iptables-kjeder"],
        kort: { E: ["H2025-24"], S: ["H2023-32", "H2022-7.3"], G: ["H2021-5.4", "H2023-11"] } },

      { id: "4d", tittel: "IDS og Snort-regler", vekt: 5, min: "E", tid: 6,
        les: [["nettverk", "ids", "Blokk 9 → IDS og Snort"]],
        hvorfor: "IDS og Snort kom H2023, H2024 og H2025. H2025 hadde to fritekstoppgaver (5 p), og H2024 spurte om mørke IP-adresser (4 p).",
        kjerne: t(
          "<p>En IDS er en alarm. Signaturbasert alarm kjenner igjen kjente tyver. Anomalibasert alarm reagerer på alt som er uvanlig, også nye triks, men den hyler oftere uten grunn.</p>",
          "<ul><li>IDS oppdager, IPS blokkerer.</li><li>Signaturbasert IDS (som Snort) sammenligner trafikk med kjente mønstre og finner ikke nye angrep.</li><li>Anomalibasert IDS lærer hva som er normalt, ofte med maskinlæring, og kan finne ukjente angrep, men gir flere falske alarmer.</li><li>Mørke IP-adresser er ubrukte adresser og en billig honeypot-løsning (nettverkslysarket s. 71): all trafikk dit er illegitim, så de brukes til deteksjon.</li></ul>",
          "<p>Snort-regel: handling, protokoll, kilde-IP, kildeport, retning, mål-IP, målport, (opsjoner). Eksempel: <code>alert tcp 10.10.23.23 22 -&gt; any any (msg:\"SSH fra DC\"; sid:1000001; rev:1;)</code>. Sensor H2025: feil retning gir 0 p. Mangler «alert», «tcp» eller riktig port, trekkes det ett poeng.</p>"),
        kunne: [
          "IDS oppdager, IPS stopper. NIDS ser nettverket, HIDS ser én maskin.",
          "Signaturbasert: kjente mønstre, få falske alarmer, finner ikke nulldager. Anomalibasert: avvik fra normalen, ofte maskinlæring, flere falske alarmer.",
          "Snort: <code>alert tcp KILDE PORT -&gt; MÅL PORT (msg:\"…\"; sid:…;)</code>.",
          "Mørke IP-er = en billig honeypot-løsning. Formål: deteksjon. All trafikk dit er illegitim, så den avslører skanning og kompromitterte klienter i eget nett (H2024 29: 1 p for hvert av de fire punktene)."
        ],
        feller: [
          "Å bytte kilde og mål i Snort-regelen. Feil retning ga 0 p på H2025.",
          "H2025 20: fasiten har SSH-porten som kildeport. Les hvem som er klient og hvem som er tjener."
        ],
        fig: ["H2024-27"],
        forklar: ["nids-plassering", "nulldag"],
        kort: { E: ["H2025-20", "H2024-27"], S: ["H2025-21", "H2023-31"], G: ["H2024-29"] } }
    ] },

    /* ===================== 5 · AUTENTISERING OG IAM ===================== */
    { nr: 5, navn: "Autentisering og IAM", hvor: "Del 5, 5–8 p (mer i H2021–H2023)", steg: [
      { id: "5a", tittel: "Passord, salt og nøkkelrom", vekt: 2, min: "S", tid: 4,
        les: [["autentisering", "passord", "Blokk 7 → Passord, hash og salt"]],
        hvorfor: "Passordlagring kom H2021–H2023 og passordkompleksitet som regneoppgave H2023 og H2024.",
        kjerne: t(
          "<p>Passord lagres ikke som de er, men som et fingeravtrykk (hash). Salt er et tilfeldig krydder per bruker, så to like passord får ulike avtrykk. Lengre passord er mye vanskeligere å gjette.</p>",
          "<p>Lagre passord som saltet hash. Salt gjør forhåndsberegnede regnbuetabeller nytteløse og skjuler at to brukere har samme passord. Hvert passord kan fortsatt gjettes. Antall mulige passord er tegnsett<sup>lengde</sup>.</p>",
          "<p>Fra 4 til 6 siffer: 10<sup>6</sup>/10<sup>4</sup> = 10<sup>2</sup>, altså hundre ganger flere. Fra 10 til 14 tegn med 105 tegn: 105<sup>4</sup> ganger flere. Kurset anbefaler lange passord (minst 13 tegn), sjelden eller aldri bytte og ingen gjenbruk. NIST SP 800-63B-4 krever minst 15 tegn når passordet er eneste faktor og forbyr sammensetningsregler.</p>"),
        kunne: [
          "Saltet hash: hash(passord + salt). Salt stopper regnbuetabeller, ikke gjetting.",
          "Like hasher for to brukere avslører like passord, altså at salt mangler.",
          "Økning i lengde: forholdet er tegnsett<sup>økning</sup>. 4 → 6 siffer gir 10<sup>2</sup> = 100 ganger.",
          "Lengde slår kompleksitet. Bytt bare ved mistanke om lekkasje."
        ],
        feller: [
          "«Salt hindrer gjetting av svake passord»: nei, bare forhåndsberegning.",
          "«Bytt passord ofte og bruk spesialtegn» er ikke kursets råd."
        ],
        kort: { E: ["H2024-11"], S: ["H2023-27", "H2022-8.1"], G: ["H2021-6.1", "H2023-9"] } },

      { id: "5b", tittel: "Passnøkler, faktorer, garantinivå og biometri", vekt: 4, min: "E", tid: 6,
        les: [["autentisering", "fido", "Blokk 7 → FIDO og passnøkler"], ["autentisering", "biometri", "Biometri"]],
        hvorfor: "FIDO og passnøkler kom H2022, H2023 og H2025 (8 p i H2025). eID og garantinivå kom H2021, H2022, H2024 og H2025 (NIST AL3), biometri H2021 og H2022.",
        kjerne: t(
          "<p>En passnøkkel er en hemmelig nøkkel som bor i telefonen din og bare virker på den ekte nettsiden. En falsk side får ingenting. Fingeren din låser bare opp telefonen. Den sendes ikke til nettsiden.</p>",
          "<p>Faktorene er noe du vet, noe du har og noe du er. MFA krever minst to ulike kategorier. En passnøkkel (FIDO/WebAuthn) er et privat nøkkelpar per domene. Tjeneren sender en utfordring, autentikatoren signerer den med den private nøkkelen, og tjeneren verifiserer med den offentlige. Domenet er bundet inn, så passnøkler er phishingresistente.</p>",
          "<ul><li>Garantinivå: eIDAS har lav, betydelig og høy. NIST har AAL1–3. MinID er på nivå betydelig, BankID og Buypass på høy.</li><li>Synkroniserte passnøkler (via passordbanken) er ikke bundet til én enhet og regnes ikke som AAL3.</li><li>H2021 6.4 (RAU 2008 og NIST 800-63-3) er eldre stoff og ikke pensum i 2026.</li><li>Biometri: FMR = feilaktig match, FNMR = feilaktig ikke-match. Lav terskel gir høy FMR. EER er der de er like. PAD oppdager falske fingre.</li></ul>"),
        kunne: [
          "Faktorer: vet, har, er. MFA = minst to ulike kategorier.",
          "Passnøkkel: utfordring signeres med privat nøkkel per domene. Den offentlige nøkkelen ligger hos tjenesten. Phishingresistent.",
          "Garantinivå: eIDAS lav/betydelig/høy, NIST AAL1–3. MinID = betydelig, BankID og Buypass = høy.",
          "FMR = godtatte falske / alle falske forsøk. FNMR = avviste ekte / alle ekte forsøk. TMR = 1 − FNMR.",
          "Kurset bruker FMR og FNMR, ikke FAR og FRR. 1:1 = autentisering, 1:N = identifikasjon."
        ],
        feller: [
          "«SMS-kode er sterk tofaktor»: SMS er en relativt svak sekundærkanal.",
          "«Lav FMR betyr robust mot falske fingre»: det er PAD som håndterer presentasjonsangrep."
        ],
        fig: ["H2025-25"],
        forklar: ["faktorer", "garantinivaa-stiger"],
        kort: { E: ["H2025-25", "H2025-26"], S: ["H2025-27", "H2023-33", "H2024-30"], G: ["H2021-6.2", "H2021-6.3", "H2021-6.4", "H2022-8.2", "H2022-8.3", "H2022-8.4"] } },

      { id: "5c", tittel: "IAM: faser, føderering, OIDC/OAuth og tilgangsmodeller", vekt: 4, min: "S", tid: 6,
        les: [["iam", "faser", "Blokk 8 → IAM-faser og begreper"], ["iam", "oidc", "OIDC, FEIDE og ID-porten"], ["iam", "tk", "Tilgangskontrollmodeller"]],
        hvorfor: "IAM-fasene kom H2021–H2023 og OIDC-rekkefølgen H2021 og H2024. Mye IAM i H2021–H2023 (11–14 p), 3 p i H2024 og ingenting i H2025.",
        kjerne: t(
          "<p>Først skriver noen ned hvem som får gå hvor (autorisering). Når du så kommer til døra, sjekker vakten lista (tilgangskontroll). Med føderering kan ett ID-kort fra én utsteder brukes mange steder.</p>",
          "<ul><li>IAM har en konfigureringsfase (registrering, utstedelse av autentikator, autorisering) og en bruksfase (identifisering, autentisering, tilgangskontroll).</li><li>Autorisering er å <i>spesifisere</i> policyen.</li><li>Tilgangskontroll er å <i>håndheve</i> den.</li><li>Silo: tjenesten (SP) er sin egen identitetstilbyder.</li><li>Føderert: én IdP utsteder billetter som flere SP-er godtar.</li></ul>",
          "<ul><li>OAuth gir autorisering med et tilgangstoken.</li><li>OIDC bygger på OAuth og gir autentisering med et ID-token.</li><li>DAC: eieren bestemmer (ACL).</li><li>MAC: systemet bestemmer etter klarering og gradering (Bell-LaPadula: ikke les opp, ikke skriv ned, for konfidensialitet).</li><li>RBAC: roller.</li><li>ABAC: attributter for subjekt, objekt, handling og kontekst.</li></ul>"),
        kunne: [
          "Konfigureringsfase: registrering, autentikator, autorisering. Bruksfase: identifisering, autentisering, tilgangskontroll.",
          "Autorisering = spesifisere tilgangspolicy. Tilgangskontroll = håndheve den ved forespørsel.",
          "Identitet = et sett attributter i et domene. Identifikator = entydig navn i domenet.",
          "OAuth = autorisering (tilgangstoken). OIDC = autentisering (ID-token) bygd på OAuth.",
          "Bell-LaPadula: ikke les opp, ikke skriv ned. ABAC kan uttrykke de andre modellene."
        ],
        feller: [
          "«Autorisering skjer ved innlogging»: kurset sier at det er spesifiseringen i konfigureringsfasen.",
          "«OAuth er for innlogging»: OAuth gir tilgang, OIDC gir innlogging."
        ],
        fig: ["H2024-31", "H2023-14"],
        forklar: ["entitet-identitet", "rbac-dac"],
        kort: { E: ["H2024-31", "H2023-14"], S: ["H2023-34", "H2022-9.4", "H2023-35"], G: ["H2021-1.3", "H2021-7.1", "H2021-7.2", "H2021-7.3", "H2022-1.3", "H2022-9.1", "H2022-9.2", "H2022-9.3", "H2023-13"] } }
    ] },

    /* ===================== 6 · ISMS OG RISIKOSTYRING ===================== */
    { nr: 6, navn: "ISMS og risikostyring", hvor: "Del 6, 8–10 p", steg: [
      { id: "6a", tittel: "ISMS, ISO 27000, NSM og NIST CSF", vekt: 4, min: "S", tid: 5,
        les: [["risiko", "iso", "Blokk 6 → ISO 27000"], ["risiko", "rammeverk", "NIST CSF og NSM"]],
        hvorfor: "«NSM, NIST, begge eller ingen» kom H2023 og H2024, ISO 27k H2021, H2023 og H2025, og ISO 27001-kapitler med PDCA i H2025.",
        kjerne: t(
          "<p>Et ISMS er måten en virksomhet styrer sikkerheten sin på, som en fast rutine: planlegg, gjør, sjekk, forbedre. ISO 27001 sier hva rutinen må ha. ISO 27002 og NSM gir lister med tiltak du kan velge fra.</p>",
          "<ul><li>ISMS er et ledelsessystem for informasjonssikkerhet.</li><li>ISO/IEC 27001 er kravstandarden og den eneste som sertifiseres.</li><li>ISO 27002 er en tiltaksbank med 93 tiltak.</li><li>ISO 27005 handler om risikostyring, og 27000 er begreper.</li><li>NSMs grunnprinsipper og NIST CSF er rammeverk med tiltak. Ingen av dem er et ISMS.</li></ul>",
          "<ul><li>NSMs grunnprinsipper for IKT-sikkerhet har 4 kategorier (identifisere og kartlegge, beskytte og opprettholde, oppdage, håndtere og gjenopprette), 21 prinsipper og 118 tiltak.</li><li>NIST CSF 2.0 har 6 funksjoner: GOVERN (ny), IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER. Eksamen fram til H2025 brukte 5.</li><li>PDCA: Plan (kap. 4–7 i 27001), Do (8), Check (9), Act (10). Det er kursets og H2025 28s tilordning. Standarden selv krever ikke PDCA (det ble tatt ut i 2013-utgaven), og noen kilder legger kapittel 7 i Do. Svar som kurset på eksamen.</li></ul>"),
        kunne: [
          "ISO 27001 = krav til ISMS, sertifiserbar. 27002 = tiltaksbank. 27005 = risikostyring. 27000 = begreper.",
          "NSM: 4 kategorier, 21 prinsipper. NIST CSF 2.0: 6 funksjoner, der GOVERN er ny.",
          "PDCA i 27001: Plan = kap. 4–7, Do = 8, Check = 9, Act = 10 (kursets og H2025-fasitens tilordning; standarden selv tilordner ikke kapitlene).",
          "ISMS ≈ internkontroll. Ledelsen må forankre det."
        ],
        feller: [
          "«ISO 27002 kan sertifiseres» eller «NSM-prinsippene er et ISMS»: begge er feil.",
          "«NSM har fem kategorier som NIST»: NSM har fire."
        ],
        fig: ["H2025-28"],
        forklar: ["csf-nsm", "iso-familie"],
        kort: { E: ["H2025-28", "H2025-29"], S: ["H2024-32", "H2024-35"], G: ["H2021-8.1", "H2021-8.2", "H2021-8.3", "H2023-36", "H2023-37"] } },

      { id: "6b", tittel: "Risikovurdering, prosessen og risikoformelen", vekt: 6, min: "E", tid: 5,
        les: [["risiko", "vurdering", "Blokk 6 → Risikovurdering"], ["risiko", "prosess", "Prosessen"]],
        hvorfor: "Prosessfiguren kom H2022 og H2023, beslutningspunktene H2022 og H2024, ROS-trinnene H2024 og risikoformelen H2025.",
        kjerne: t(
          "<p>Først finner du ut hva som kan gå galt (identifisere). Så hvor ille og hvor sannsynlig det er (analysere). Så hva som må fikses først (evaluere). Til slutt gjør du noe med det (håndtere).</p>",
          "<p>Risikovurdering består av risikoidentifisering, risikoanalyse og risikoevaluering. Deretter kommer risikohåndtering: redusere, unngå, dele (overføre) eller akseptere risikoen. Etter vurderingen og etter håndteringen er det et beslutningspunkt: er resultatet godt nok, eller må vi gå en runde til? Beslutningspunktene er kursets figur, bygd på eldre utgaver av ISO/IEC 27005 (2008–2018). Utgaven fra 2022 har ikke egne beslutningspunkter. Svar etter kursets figur på eksamen.</p>",
          "<ul><li>Kvantitativt: risikonivå = sannsynlighet × konsekvens (produkt, i kroner per år).</li><li>Kvalitativt med logaritmiske nivåer: risikonivå = sannsynlighet + konsekvens (sum), fordi log(S × K) = log S + log K.</li><li>Identifisering starter med verdiene, analysen ender med beregningen, evalueringen starter med rangeringen.</li><li>Restrisikoen aksepteres av risikoeieren.</li><li>H2022 10.3 (ROI-beregningen) er eldre stoff og ikke pensum i 2026.</li></ul>"),
        kunne: [
          "Risikovurdering = identifisering → analyse → evaluering. Så følger håndtering.",
          "Håndtering: redusere, unngå, dele/overføre, akseptere. «Ignorere» er ikke et gyldig valg.",
          "Kvantitativ: S × K (produkt). Kvalitativ med logaritmiske nivåer: S + K (sum).",
          "Beslutningspunkt 1 (etter vurdering): er vurderingen god nok? Beslutningspunkt 2 (etter håndtering): er restrisikoen akseptabel? (Kursets figur, eldre 27005. Svar slik på eksamen.)"
        ],
        feller: [
          "«Kvalitativ risiko = S × K»: med logaritmiske nivåer summeres de.",
          "Å blande analyse (beregne nivå) og evaluering (rangere og sammenligne med akseptkriterier)."
        ],
        fig: ["H2024-34", "H2023-38"],
        kort: { E: ["H2025-30", "H2024-34"], S: ["H2024-33", "H2023-39"], G: ["H2022-10.1", "H2022-10.2", "H2022-10.3", "H2023-38"] } }
    ] },

    /* ===================== 7 · DE VARIERENDE DELENE ===================== */
    { nr: 7, navn: "De varierende delene", hvor: "2–3 deler à 5–9 p", steg: [
      { id: "7a", tittel: "Sikker utvikling: STRIDE og OWASP Top 10", vekt: 3, min: "S", tid: 5,
        les: [["risiko", "utvikling", "Blokk 6 → Sikker utvikling"]],
        hvorfor: "Egen del i H2021 (10 p, autorettet) og H2025 (9 p, fritekst). STRIDE kom H2021, H2022 og H2025. Ingen 2026-lysark, men læreboka er pensum.",
        kjerne: t(
          "<p>STRIDE er en huskeliste med seks måter et system kan angripes på. Hver bokstav bryter et bestemt sikkerhetsmål.</p>",
          "<p>STRIDE:</p><ul><li>Spoofing bryter autentisitet,</li><li>Tampering integritet,</li><li>Repudiation sporbarhet (ubenektelighet),</li><li>Information disclosure konfidensialitet,</li><li>Denial of service tilgjengelighet og</li><li>Elevation of privilege tilgangskontroll (autorisering).</li></ul><p>OWASP Top 10 er en liste over de mest kritiske sårbarhetene i nettapplikasjoner.</p>",
          "<p>Sensor H2025 31: 0,5 p for begrepet og 0,5 p for målet som brytes, per bokstav (6 p). Innebygd sikkerhet har sju faser: opplæring, krav, design, koding, test, produksjonssetting og forvaltning (eksamensordene i H2021 9.1 og H2022 4.1; Microsoft SDL kaller den siste «respons»). DevSecOps flytter sikkerheten tidlig inn i løpet («shift left»).</p>"),
        kunne: [
          "S → autentisitet, T → integritet, R → sporbarhet/ubenektelighet, I → konfidensialitet, D → tilgjengelighet, E → tilgangskontroll.",
          "OWASP Top 10: liste fra OWASP over de vanligste og mest kritiske sårbarhetene i nettapplikasjoner (f.eks. injeksjon, brutt tilgangskontroll).",
          "Sikkerhet bygges inn fra kravfasen, ikke testes inn til slutt."
        ],
        feller: [
          "Å nevne bare begrepene i STRIDE uten målet som brytes. Det er halve poengene.",
          "Repudiation bryter sporbarhet/ubenektelighet, ikke integritet."
        ],
        fig: ["H2021-9.1"],
        kort: { E: ["H2025-31"], S: ["H2025-32", "H2022-4.2"], G: ["H2021-9.1", "H2021-9.2", "H2021-9.3", "H2022-4.1"] } },

      { id: "7b", tittel: "Fysisk sikkerhet og HMS", vekt: 3, min: "S", tid: 4,
        les: [["grunnbegreper", "personell", "Blokk 1 → Personell og HMS"], ["grunnbegreper", "fysisk", "Fysisk skjerming"]],
        hvorfor: "Egen del i H2025 (9 p). Første forelesning, av den som også har eksamensforelesningen, handlet om dette.",
        kjerne: t(
          "<p>Liv og helse kommer først. Før en farlig jobb deler du den opp i små biter og spør: hva kan gå galt her, og hvordan hindrer vi det?</p>",
          "<p>SJA står for sikker jobbanalyse. Du deler en farlig arbeidsoppgave opp i trinn, vurderer risikoen for hvert trinn og bestemmer tiltak før arbeidet starter. TEMPEST handler om avlytting av elektromagnetisk stråling fra utstyr. Forsvar i dybden med flere lag kjøper tid og øker sjansen for å oppdage innbrudd.</p>",
          "<p>Arbeidsgiveren har HMS-ansvaret. Ved arbeid i høyden (lift, personløfter) må det være minst én person på bakken i tillegg til den som jobber, slik at noen kan varsle og hjelpe. Les oppgaveteksten nøye for antallet. Begge må ha gyldig opplæring i bruk av lift (1 av 4 p i H2025 36). Andre stikkord: tailgating og sluser, kald, varm og het reservelokasjon, sikkerhetsklarering for personell.</p>"),
        kunne: [
          "SJA = sikker jobbanalyse: del opp oppgaven, vurder risiko per trinn og bestem tiltak før start.",
          "TEMPEST = avlytting av elektromagnetisk stråling (og vern mot det).",
          "Fysisk sikkerhet: trygghet for folk, kontrollert adgang, skjerming av utstyr og kontinuitet i støttesystemer.",
          "Innsidere er vanskelige fordi de har lovlig tilgang. Tiltak: bakgrunnssjekk og sikkerhetsklarering."
        ],
        feller: [
          "SJA er ikke en generell risikoanalyse av hele virksomheten. Den gjelder én konkret jobb.",
          "Liv og helse går foran verdier og data."
        ],
        kort: { E: ["H2025-34", "H2025-33"], S: ["H2025-36", "H2025-35"], G: [] } },

      { id: "7c", tittel: "Cyberoperasjoner: kill chain, ATT&CK og CTI", vekt: 2, min: "S", tid: 4,
        les: [["cyberops", "killchain", "Blokk 10 → Kill chain og ATT&CK"], ["cyberops", "cti", "TTP og CTI"]],
        hvorfor: "Egen del i H2021 (10 p) og H2024 (5 p). Kill chain kom H2021 og H2023, CTI-nivåene H2024.",
        kjerne: t(
          "<p>Et angrep går i trinn, som en oppskrift: speide, lage våpenet, levere det, sette det i gang, installere seg, ta kontroll og nå målet. Stopper du ett trinn, stopper du angrepet.</p>",
          "<p>Cyber Kill Chain (Lockheed Martin) har sju trinn: rekognosering, bevæpning, overlevering, utførelse, installering, kommando og kontroll, og måloppnåelse. MITRE ATT&amp;CK beskriver taktikker (målet med et trinn) og teknikker (hvordan). APT er en avansert og vedvarende trusselaktør, ofte statlig.</p>",
          "<p>CTI (digital trusseletterretning) har tre nivåer.</p><ul><li>Strategisk: for ledelsen, langsiktige trender.</li><li>Taktisk/operasjonelt: TTP-er, der ATT&amp;CK hører hjemme.</li><li>Teknisk: IP-adresser og filhasher, som er mest kortvarig.</li></ul><p>Stuxnet var en cyberoperasjon mot iranske industrielle styresystemer.</p>"),
        kunne: [
          "Kill chain: rekognosering, bevæpning, overlevering, utførelse, installering, kommando og kontroll, måloppnåelse.",
          "ATT&amp;CK: taktikk = hvorfor (mål), teknikk = hvordan. TTP = taktikker, teknikker og prosedyrer.",
          "CTI: strategisk (ledelse), taktisk (TTP, ATT&amp;CK), teknisk (IP, hasher).",
          "APT: avansert (ressurssterk) og persistent (holder ut over tid)."
        ],
        feller: [
          "«Trinn 2 er levering»: trinn 2 er bevæpning, så kommer overlevering.",
          "«ATT&amp;CK er teknisk CTI»: det er taktisk nivå."
        ],
        fig: ["H2021-10.1", "H2024-36"],
        forklar: ["ttp-hierarki"],
        kort: { E: ["H2024-36"], S: ["H2023-12", "H2021-10.1"], G: ["H2021-10.2", "H2021-10.3", "H2024-37", "H2025-15"] } },

      { id: "7d", tittel: "Systemsikkerhet: minne, virtualisering og TPM", vekt: 2, min: "S", tid: 4,
        les: [["system", "virt", "Blokk 5 → Virtualisering og containere"], ["system", "minne", "Minne og bufferoverflyt"]],
        hvorfor: "Egen del i H2022 (10 p). Senere bare privilegienivåene i del 1 (steg 1c).",
        kjerne: t(
          "<p>En virtuell maskin er en hel datamaskin i en boks, med eget operativsystem. En container deler operativsystemet med de andre og er lettere. TPM er en liten safe på hovedkortet.</p>",
          "<p>Type 1-hypervisor kjører rett på maskinvaren, med gjesteoperativsystemene over. En type 2-hypervisor kjører oppå et vertsoperativsystem. Containere deler vertens kjerne via en containermotor (Docker). Bufferoverflyt på stakken kan overskrive returadressen. TPM lagrer nøkler og målinger, og UEFI står for sikker oppstart.</p>",
          "<p>Kjørbar fil → prosess: OS laster programmet inn i virtuelt minne og CPU-en kjører det. ASLR, NX og stakkanarifugler gjør bufferoverflyt vanskeligere å utnytte, men retter ikke feilen. Sikker oppstart sjekker signaturen på hvert trinn i oppstarten.</p>"),
        kunne: [
          "Type 1: maskinvare → hypervisor → gjeste-OS. Container: maskinvare → vert-OS → containermotor → containere.",
          "Bufferoverflyt på stakken overskriver returadressen.",
          "TPM: lagrer nøkler og målinger. UEFI sikker oppstart: sjekker signaturer i oppstartskjeden."
        ],
        feller: [
          "«ASLR fjerner bufferoverflyt»: den gjør utnyttelse vanskeligere, men retter ikke feilen.",
          "Å tegne containere med egen gjestekjerne. De deler vertens kjerne."
        ],
        fig: ["H2022-2.4", "H2022-2.5"],
        kort: { E: ["H2022-2.4"], S: ["H2022-2.6", "H2022-2.3"], G: ["H2022-2.1", "H2022-2.2", "H2022-2.5"] } },

      { id: "7e", tittel: "KI og sikkerhet (nytt i 2026)", vekt: 1, min: "E", tid: 8,
        les: [["cyberops", "ki", "Blokk 10 → KI i angrep og forsvar"], ["cyberops", "kisarbar", "Sårbarheter i KI og AI Act"]],
        hvorfor: "Ingen tidligere eksamen. Det er ny forelesning i 2026, og faglærer sier at eksamen kommer innom det meste av pensum. Regn med et kort spørsmål.",
        kjerne: t(
          "<p>KI kan brukes til å angripe (falske videoer), til å forsvare (finne rare mønstre i trafikken), og KI kan selv bli angrepet (noen lurer den med skjulte beskjeder).</p>",
          "<p>Kurset deler KI og cyber i tre:</p><ul><li>offensiv KI (deepfakes, skadevareproduksjon, automatiserte angrep),</li><li>defensiv KI (inntrengningsdeteksjon, analyse av skadevare, trusseletterretning) og</li><li>angrep mot KI.</li></ul><p>Angrepene mot KI er forgiftning av læringsdata, bakdør i modellen, synsbedrag (adversarial examples), leveransekjedeangrep, jailbreak og prompt injection.</p>",
          "<ul><li>Jailbreak: brukeren selv lurer modellen forbi reglene.</li><li>Prompt injection: modellen leser tredjeparts data med skjulte instruksjoner og følger dem, fordi den ikke skiller sikkert mellom instruksjon og data (OWASP har den som LLM01).</li><li>Forgiftning skjer under trening.</li><li>EUs KI-forordning (2024/1689) har fire nivåer:<ul><li>uakseptabel (forbudt)</li><li>høy (samsvarsvurdering)</li><li>begrenset (transparens, f.eks. chatteboter og deepfakes)</li><li>og minimal.</li></ul></li></ul>"),
        kunne: [
          "Tre møtepunkter: offensiv KI, defensiv KI og angrep mot KI.",
          "Forgiftning = trening (data). Synsbedrag, jailbreak og prompt injection = inferens (input).",
          "Jailbreak: brukeren omgår reglene. Prompt injection: skjulte instruksjoner i data modellen leser.",
          "AI Act: uakseptabel (sosial skåring, forbudt), høy (HR, kritisk infrastruktur), begrenset (chatteboter, deepfakes: må opplyse), minimal (spill, oversettelse).",
          "Klassifiserings-IDS kjenner bare klassene den er trent på. Anomalideteksjon (autoenkoder) kan fange det ukjente."
        ],
        feller: [
          "«Vi bygger en bedre deepfake-detektor»: lysarket kaller deteksjon et i praksis uløselig problem.",
          "Chatteboter er begrenset risiko, ikke høy. Sosial skåring er forbudt, ikke høy risiko."
        ],
        kort: { E: [], S: [], G: [] } }
    ] },

    /* ===================== 8 · DEN STORE OPPGAVEN ===================== */
    { nr: 8, navn: "Den store oppgaven til slutt", hvor: "Siste del, 9–10 p", steg: [
      { id: "8a", tittel: "Scenariet: hvem ser hva, og hvem står bak?", vekt: 8, min: "E", tid: 6,
        les: [["nettverk", "hvemser", "Blokk 9 → Hvem ser hva?"]],
        hvorfor: "H2024 («Retten er satt», 10 p) og H2025 («Bobs passord», 9 p) endte begge med ett stort scenario som binder krypto, nettverk og angrep sammen.",
        kjerne: t(
          "<p>Tegn en strek fra den som skriver til den som leser. Hemmeligheten er bare synlig i de to endene. Alle i midten ser bare en låst boks, med mindre noen har snudd veien om seg selv.</p>",
          "<p>Finn endepunktene der dataene er i klartekst: avsenderens maskin før TLS (en keylogger ser alt) og tjeneren som avslutter TLS. Alle mellom ser bare chiffertekst, så lenge TLS ikke er nedgradert (HSTS) eller omdirigert. ARP-forgiftning gjør noen til mann-i-midten på det lokale nettet, men de ser fortsatt bare TLS-trafikk.</p>",
          "<p>H2024: en MAC med felles nøkkel kan lages av alle som har nøkkelen, så den gir ikke ubenektelighet (2 p). Løsningen er digital signatur med en privat nøkkel bundet til personen i en PKI. Samme MAC-adresse for to IP-er i ARP-tabellen avslører ARP-forgiftning. Verktøy: Ettercap/Bettercap for ARP, Scapy/hping3 for å lage pakker. Gå gjennom hver person i oppgaven og si hva de ser og hvorfor.</p>"),
        kunne: [
          "Klartekst finnes bare i endepunktene: tastaturet før TLS og tjeneren etter TLS.",
          "Keylogger slår TLS, fordi den leser tastetrykkene før de krypteres.",
          "Avlytting av Wi-Fi, ruter-tilgang og mann-i-midten gir bare chiffertekst når TLS og HSTS virker.",
          "ARP-forgiftning: to IP-er med samme MAC-adresse i tabellen. Det gir mann-i-midten på lokalnettet.",
          "Felles nøkkel (MAC) gir ikke ubenektelighet. Digital signatur med privat nøkkel og PKI gjør det."
        ],
        feller: [
          "Å glemme noen av personene i scenariet. Sensor går gjennom dem én for én.",
          "Å si at den som ser trafikken, ser passordet, uten å sjekke om trafikken er kryptert."
        ],
        fig: ["H2025-37", "H2024-38"],
        forklar: ["arp-forgiftning"],
        kort: { E: ["H2025-37"], S: ["H2024-38"], G: [] } }
    ] }
  ];

  IN.CRASH = { lengder: LENGDER, etapper: ETAPPER };
})();
