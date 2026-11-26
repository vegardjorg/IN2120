/* IN2120 · eksamensbank H2020. Kilde: UiO, IN2120 eksamen H2020 (hjemmeeksamen; Inspera-utskrift med rettenøkkel
   og «Svarforslag», behandlet som sensorveiledning; eksamen/in2120-2020-x-qa.pdf, 30 sider, lest visuelt).
   Oppgavetekst og fasit ordrett. Våre forklaringer (explain/losning/tips/hvorfor/svar) med egne ord. */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BANK = (window.IN_EXAM_BANK = window.IN_EXAM_BANK || {});
  IN.PERFEKT = IN.PERFEKT || {};

  var Y = "H2020";
  var D1 = "Del 1: Generelt",
    D2 = "Del 2: Kryptografi",
    D3 = "Del 3: Nøkkelhåndtering og PKI",
    D4 = "Del 4: Nettverkssikkerhet",
    D5 = "Del 5: Systemsikkerhet",
    D6 = "Del 6: IS-ledelse og menneskelige faktorer",
    D7 = "Del 7: Risikostyring",
    D8 = "Del 8: Identitets- og tilgangshåndtering",
    D9 = "Del 9: Hendelsesrespons",
    D10 = "Del 10: Applikasjons- og sky-sikkerhet";

  var R05 = "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.";

  function hv(key, eli5, normal, teknisk) {
    IN.PERFEKT[key] = IN.PERFEKT[key] || { type: "eksamen" };
    IN.PERFEKT[key].hvorfor = { eli5: eli5, normal: normal, teknisk: teknisk };
  }

  var FIG_EKSAMEN = {
    beskrivelse: "Vannrett illustrasjon i tre deler forbundet med to lyseblå dobbeltpiler. Til venstre en mann i dress med teksten «Foreleser som lager eksamen» under. I midten en lys sky med et tjenerskap og et nettleservindu med logoen «Inspera», med teksten «Platform for online eksamen» under. Til høyre en student ved en bærbar PC med teksten «Student som tar eksamen» under.",
    tekst: ["Foreleser som lager eksamen", "Inspera", "Platform for online eksamen", "Student som tar eksamen"]
  };

  var O = [];

  /* ============================ DEL 1: GENERELT ============================ */

  O.push({
    key: "H2020-1.1", year: Y, oppgave_nr: "Oppgave 1.1", del: D1,
    ark: "1.1 Generelle sikkerhetsmål", title: "KIT før og under nettbasert eksamen (fritekst)",
    points: 6, block: "generelt", tema: ["KIT", "konfidensialitet", "integritet", "tilgjengelighet", "verdi"],
    gjenganger: ["H2024-1"],
    ordrett: true,
    oppgave: "<ol><li>Nevn de tre generelle sikkerhetsmålene (security goals) for informasjonssikkerhet.</li><li>Anta situasjonen med online eksamen, som vist på figuren, der vi fokuserer på sikkerhet for selve eksamensoppgavene (som er verdi/ressurs/asset). Viktigheten av de tre sikkerhetsmålene fra (1) kan være forskjellig før eksamen starter, og under eksamen. For hvert av de tre sikkerhetsmålene, si om sikkerhetsmålet er viktigst <strong>før</strong> eller <strong>under</strong> eksamen, eller om sikkerhetsmålet er omtrent <strong>like viktig</strong> både før og under eksamen. Begrunn svarene kort. Skriv f.eks. \"X er viktigst før eksamen starter fordi ...\", \"Y er viktigst under eksamen fordi ...\", eller \"Z er omtrent like viktig både før og under eksamen fordi ...\". Du må erstatte X, Y og Z med navn på sikkerhetsmål.</li></ol><p><em>Poeng: 1 for hvert korrekt navn på sikkerhetsmål, 1 for hvert fornuftige svar under (2), maks 6, minimum 0.</em></p><p><strong>Skriv ditt svar her</strong></p>",
    figur: FIG_EKSAMEN,
    inspera: {
      type: "E",
      regelTekst: "Poeng: 1 for hvert korrekt navn på sikkerhetsmål, 1 for hvert fornuftige svar under (2), maks 6, minimum 0.",
      regel: { riktig: 6, feil: 0, blankt: 0, min: 0, maks: 6 },
      regelMerknad: "Manuell retting: 3 poeng for de tre navnene, 3 poeng for tre begrunnede vurderinger. Sensor godtar en annen vurdering hvis begrunnelsen er god.",
      deler: [
        { del: "1.", poeng: 3, sporsmal: "<p>Nevn de tre generelle sikkerhetsmålene (security goals) for informasjonssikkerhet.</p>", grense: "tre ord" },
        { del: "2.", poeng: 3, sporsmal: "<p>For hvert av de tre sikkerhetsmålene, si om sikkerhetsmålet er viktigst før eller under eksamen, eller om det er omtrent like viktig både før og under eksamen. Begrunn kort.</p>", grense: "én setning per mål" }
      ]
    },
    avvik: null,
    losning: [
      "1. Konfidensialitet, integritet og tilgjengelighet (KIT).",
      "2. Tenk på hva som skjer med eksamensoppgavene i hver fase: før eksamen er de hemmelige, under eksamen må de være tilgjengelige for alle studentene.",
      "Konfidensialitet viktigst før (lekkasje gir juks), tilgjengelighet viktigst under (nede plattform stopper eksamen), integritet like viktig i begge faser (endrede oppgaver er alvorlig uansett).",
      "Hver vurdering må ha et «fordi …». Uten begrunnelse får du ikke poenget."
    ],
    tips: [
      "Sensor godtar andre vurderinger med god begrunnelse, så det viktigste er at begrunnelsen henger sammen med målet (lese, endre, bruke).",
      "Samme figur brukes i 7.2. H2024 oppgave 1 spør nesten det samme (før, under og etter eksamen)."
    ]
  });
  IN.PERFEKT["H2020-1.1"] = {
    type: "skjonn",
    svar: [
      { del: "1.", tekst: "<p>Konfidensialitet, integritet og tilgjengelighet.</p>", poeng: ["Konfidensialitet (1p)", "Integritet (1p)", "Tilgjengelighet (1p)"] },
      { del: "2.", tekst: "<p>Konfidensialitet er viktigst før eksamen starter fordi oppgavene som lekker før start, lar noen forberede seg på akkurat dem (juks).</p><p>Integritet er omtrent like viktig både før og under eksamen fordi endrede oppgaver gir feil eksamen uansett når endringen skjer.</p><p>Tilgjengelighet er viktigst under eksamen fordi studentene ikke kan levere hvis oppgavene ikke kan nås mens eksamen pågår.</p>", poeng: ["Konfidensialitet med begrunnelse (1p)", "Integritet med begrunnelse (1p)", "Tilgjengelighet med begrunnelse (1p)"] }
    ],
    sensor: {
      deler: [
        { del: "1.", fasit: "<p>1. Konfidensialitet, Integritet og Tilgjengelighet.</p>", kriterier: "<p>1 poeng for hvert KIT sikkerhetsmål (til sammen 3 poeng).</p>" },
        { del: "2.", fasit: "<p>2. Viktighetsvurdering</p><p>Konfidensialitet av eksamensspørsmålene er viktigst før eksamen, fordi brudd på konfidensialitet ville gjøre det mulig å jukse. Men en annen vurdering med en god begrunnelse er også OK.<br>Integritet er omtrent like viktig både før og under eksamen, fordi brudd på integritet ville være alvorlig i begge faser. Men en annen vurdering med en god begrunnelse er også OK.<br>Tilgjengelighet er viktigst under eksamen, fordi brudd på tilgjengelighet ville medføre at studentene ikke kunne gjennomføre eksamen. Men en annen vurdering med en god begrunnelse er også OK.</p>", kriterier: "<p>1 poeng for hver fornuftige vurdering med god begrunnelse (til sammen 3 poeng).</p>" }
      ],
      merknad: "«Svarforslag for oppgave 1.1» står under svarfeltet i qa-fila (s. 2), med poengfordelingen nederst."
    }
  };
  hv("H2020-1.1",
    "<p>Et prøveark i en skuff skal ingen se før prøven. Når prøven er i gang, er det viktigste at alle faktisk får arket. Og arket må aldri være skrevet om av noen andre, verken før eller under.</p>",
    "<p>De tre målene er konfidensialitet, integritet og tilgjengelighet. Hvor viktig hvert mål er, avhenger av fasen. Før start er hemmelighold avgjørende, fordi lekkede oppgaver gir juks. Under eksamen må oppgavene være tilgjengelige for alle. Integritet betyr at oppgavene er riktige, og det er like viktig hele tiden.</p>",
    "<p>Kravet til hvert KIT-mål for en verdi er ikke fast. Det kan endre seg over livsløpet til verdien. Eksamensoppgavene har høyt konfidensialitetskrav fram til publisering, og så faller kravet til nesten null når alle studentene har dem. Tilgjengelighetskravet gjør det motsatte: lavt før (foreleser kan vente litt), svært høyt i det tidsvinduet eksamen varer. Integritetskravet er høyt i begge faser. Slike vurderinger styrer hvilke tiltak som er viktigst når.</p>");

  O.push({
    key: "H2020-1.2", year: Y, oppgave_nr: "Oppgave 1.2", del: D1,
    ark: "1.2 Trinn i IAM", title: "IAM: konfigureringsfase og bruksfase",
    points: 3, block: "iam", tema: ["IAM", "konfigureringsfase", "bruksfase", "autorisering", "tilgangskontroll"],
    gjenganger: ["H2021-1.3", "H2022-1.3", "H2023-14"],
    ordrett: true,
    oppgave: "<p>Tilordne trinnene til riktig felt i diagrammet for IAM (identitets- og tilgangshåndtering).<br><em>Poeng: 0,5 poeng for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 3, minimum 0.</em><br><strong>Flytt trinnene nederst slik at de ligger over riktig felt.</strong></p>",
    figur: {
      beskrivelse: "To avrundede rammer side om side. Venstre ramme har overskriften «Konfigureringsfase», høyre «Bruksfase». Hver ramme har tre bokser under hverandre (felt 1–3 til venstre, felt 4–6 til høyre) med en lyseblå blokkpil nedover mellom boksene. Under diagrammet ligger seks dra-bokser.",
      tekst: ["Konfigureringsfase", "Bruksfase"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 poeng for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      tekst: null,
      bank: ["Autentisering", "Klargjøring av autentikatorer", "Tilgangskontroll", "Oppgi identitet", "Registrer ny identitet", "Tilgangsautorisering"],
      felt: [
        { etikett: "Konfigureringsfase, boks 1 (øverst)", svar: 4, godta: [], explain: "<p>Først må brukeren finnes i systemet: <strong>Registrer ny identitet</strong>.</p>" },
        { etikett: "Konfigureringsfase, boks 2", svar: 1, godta: [], explain: "<p>Så får brukeren noe å bevise identiteten med, for eksempel et passord eller en nøkkel: <strong>Klargjøring av autentikatorer</strong>.</p>" },
        { etikett: "Konfigureringsfase, boks 3 (nederst)", svar: 5, godta: [], explain: "<p>Til slutt bestemmes hva brukeren skal få lov til, det vil si at policyen spesifiseres: <strong>Tilgangsautorisering</strong>.</p>" },
        { etikett: "Bruksfase, boks 1 (øverst)", svar: 3, godta: [], explain: "<p>Ved bruk sier brukeren først hvem hen er: <strong>Oppgi identitet</strong>.</p>" },
        { etikett: "Bruksfase, boks 2", svar: 0, godta: [], explain: "<p>Deretter bevises påstanden med autentikatoren: <strong>Autentisering</strong>.</p>" },
        { etikett: "Bruksfase, boks 3 (nederst)", svar: 2, godta: [], explain: "<p>Når brukeren ber om en ressurs, håndhever systemet policyen: <strong>Tilgangskontroll</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Konfigureringsfasen gjøres én gang: registrere, klargjøre autentikator, autorisere (spesifisere policy).", "Bruksfasen gjentas: oppgi identitet, autentisere, tilgangskontroll (håndheve policy)."],
    tips: [
      "Hvert steg i bruksfasen speiler et steg i konfigureringsfasen: registrering ↔ oppgi identitet, autentikator ↔ autentisering, autorisering ↔ tilgangskontroll.",
      "Utskriften viser tydelig at overskriften «Bruksfase» er lagt over et eldre «Driftsfase». Det er samme fase."
    ]
  });
  hv("H2020-1.2",
    "<p>Du melder deg inn i et bibliotek, får et lånekort, og de bestemmer hva du får låne. Senere sier du navnet ditt, viser kortet, og bibliotekaren sjekker at du har lov til å låne boka.</p>",
    "<p>IAM har en konfigureringsfase og en bruksfase. I konfigureringsfasen blir brukeren registrert, får en autentikator og blir autorisert. I bruksfasen oppgir brukeren identiteten sin, autentiserer seg og blir kontrollert mot policyen hver gang hen ber om noe.</p>",
    "<p>Kurset skiller mellom autorisering og tilgangskontroll. Autorisering er å spesifisere tilgangspolicy, og det gjøres på forhånd av en administrator. Tilgangskontroll er å håndheve policyen ved hver forespørsel i bruksfasen. Identifisering og autentisering må komme før tilgangskontrollen, fordi systemet må vite sikkert hvem som spør før det kan slå opp rettighetene.</p>");

  O.push({
    key: "H2020-1.3", year: Y, oppgave_nr: "Oppgave 1.3", del: D1,
    ark: "1.3 Begreper", title: "Trussel, sårbarhet, hendelse og verdi i én setning",
    points: 1, block: "risiko", tema: ["risiko", "trussel", "trusselscenario"],
    gjenganger: ["H2021-1.2", "H2022-1.2"],
    ordrett: true,
    oppgave: "<p>Angi riktig begrep som passer til beskrivelsen:</p><p>\"En angriper kan utnytte en sårbarhet og forårsake en hendelse som vil ha en konsekvens på verdier.\"</p><p><em>Poeng: 1 for riktig, 0 for feil, 0 for intet valg, maks 1, minimum 0.</em></p><p><strong>Velg ett alternativ:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Poeng: 1 for riktig, 0 for feil, 0 for intet valg, maks 1, minimum 0.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: ["Trusselscenario", "Risiko", "Trussel", "Cyberangrep"],
      svar: 1,
      explain: [
        "<p>Fristende, men fasit sier nei. Setningen beskriver ikke bare et scenario for hva angriperen gjør. Den kobler trussel, sårbarhet og konsekvens for verdier, og det er definisjonen av risiko.</p>",
        "<p>Riktig. Risiko er kombinasjonen av en trussel, sårbarheter den kan utnytte, og verdiene som rammes. Setningen nevner alle tre og i tillegg konsekvensen.</p>",
        "<p>Feil. En trussel er bare den skadelige aktiviteten. Setningen tar med mer enn det: sårbarheten og konsekvensen for verdiene.</p>",
        "<p>Feil. Et cyberangrep er en hendelse som faktisk skjer. Setningen beskriver noe som <em>kan</em> skje.</p>"
      ]
    },
    avvik: null,
    losning: ["Se etter hvor mange av byggesteinene setningen nevner: trussel (angriper), sårbarhet, hendelse og konsekvens for verdier.", "Når alle er med og det står «kan», er det risiko."],
    tips: ["Ordet «kan» skiller risiko (mulig) fra hendelse og angrep (faktisk skjedd).", "Ikke bland risiko med risikonivå, som er hvor stor risikoen er (sannsynlighet og konsekvens)."]
  });
  hv("H2020-1.3",
    "<p>Et hus med et vindu som ikke kan låses, i et nabolag med tyver, er en risiko. Det er ikke et innbrudd ennå, men alt som trengs for et innbrudd, er der.</p>",
    "<p>Risiko er kombinasjonen av en trussel (her angriperen), en sårbarhet trusselen kan utnytte, og verdier som får en konsekvens. Setningen i oppgaven nevner alle disse og beskriver noe som kan skje, ikke noe som har skjedd.</p>",
    "<p>Begrepene bygger på hverandre: en trussel utnytter en sårbarhet, det gir en hendelse, og hendelsen har konsekvens for verdier. Risiko er hele denne kjeden sett på forhånd. Risikonivået er et mål på hvor stor risikoen er, som en funksjon av sannsynlighet og konsekvens. «Trusselscenario» brukes om beskrivelsen av hva angriperen gjør, mens risiko også tar med sårbarheten og verdiene som rammes.</p>");

  /* ============================ DEL 2: KRYPTOGRAFI ============================ */

  O.push({
    key: "H2020-2.1", year: Y, oppgave_nr: "Oppgave 2.1", del: D2,
    ark: "2.1 MAC og Digital Signatur", title: "MAC, digital signatur, begge eller ingen?",
    points: 3, block: "krypto", tema: ["MAC", "digital signatur", "integritet", "konfidensialitet"],
    gjenganger: ["H2021-1.4", "H2022-5.3", "H2024-12"],
    ordrett: true,
    oppgave: "<p>For hver egenskap, angi hvilken mekanisme som har egenskapen, ved å velge blant mekanismene MAC (Message Authentication Code), DigSig (Digital Signatur), Begge (både MAC og DigSig) eller Ingen (hverken MAC eller DigSig).<br><em>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</em></p><p><strong>Angi mekanismen som passer til hver egenskap</strong></p>",
    inspera: {
      type: "M",
      regelTekst: R05,
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["MAC", "DigSig", "Begge", "Ingen"],
      multi: false,
      rader: [
        { s: "Mottager kan autentisere meldingen", svar: [2], explain: "<p>Med MAC har mottakeren den delte nøkkelen og kan regne ut koden på nytt. Med signatur bruker mottakeren avsenderens offentlige nøkkel. <strong>Begge</strong>.</p>" },
        { s: "Tredjeparter kan autentisere meldingen", svar: [1], explain: "<p>Bare signaturen kan sjekkes av alle, fordi den offentlige nøkkelen er offentlig. En tredjepart har ikke MAC-nøkkelen. <strong>DigSig</strong>.</p>" },
        { s: "Mekanismen beskytter konfidensialitet", svar: [3], explain: "<p>Ingen av dem krypterer meldingen. Meldingen sendes i klartekst sammen med koden eller signaturen. <strong>Ingen</strong>.</p>" },
        { s: "Mekanismen beskytter integritet", svar: [2], explain: "<p>En endring i meldingen gir en annen hash, så både MAC-en og signaturen avslører den. <strong>Begge</strong>.</p>" },
        { s: "Mekanismen benytter en symmetrisk kryptoalgoritme", svar: [0], explain: "<p>MAC bygger på en hemmelig nøkkel som begge parter deler, altså symmetrisk krypto. <strong>MAC</strong>.</p>" },
        { s: "Mekanismen benytter an asymmetrisk kryptoalgoritme", svar: [1], explain: "<p>Signaturen lages med en privat nøkkel og sjekkes med den tilhørende offentlige, altså asymmetrisk krypto. <strong>DigSig</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["MAC: delt hemmelig nøkkel, symmetrisk, bare de som har nøkkelen kan sjekke.", "Signatur: privat nøkkel signerer, offentlig nøkkel sjekker, alle kan sjekke.", "Begge gir integritet og autentisering for mottakeren, ingen gir konfidensialitet."],
    tips: ["Konfidensialitet er alltid «Ingen» i MAC/signatur-matriser.", "Arket skriver «an asymmetrisk» og «for for», skrivefeil i originalen, gjengitt ordrett."]
  });
  hv("H2020-2.1",
    "<p>En MAC er et hemmelig stempel bare du og vennen din har. En signatur er en underskrift som alle kan sammenligne med en prøve. Ingen av dem legger brevet i en lukket konvolutt.</p>",
    "<p>Både MAC og digital signatur gir integritet og lar mottakeren sjekke hvem meldingen kom fra. MAC bruker en hemmelig nøkkel som begge parter deler (symmetrisk), så en tredjepart kan ikke sjekke den. Signaturen bruker avsenderens private nøkkel, og alle med den offentlige nøkkelen kan sjekke den (asymmetrisk). Ingen av dem skjuler innholdet.</p>",
    "<p>MAC = Hash(M, k) med en nøkkel k som begge parter kjenner. Fordi begge kan lage den samme koden, kan en tredjepart verken sjekke den eller vite hvem som laget den. Det gir enkel meldingsautentisering uten ubenektelighet. Signaturen S = Sig(H, K<sup>A</sup><sub>priv</sub>) kan bare lages av A og sjekkes av alle med K<sup>A</sup><sub>pub</sub>. Det gir ubenektelig meldingsautentisering. Konfidensialitet krever kryptering i tillegg.</p>");

  O.push({
    key: "H2020-2.2", year: Y, oppgave_nr: "Oppgave 2.2", del: D2,
    ark: "2.2 Postkvantekrypto", title: "Hva betyr postkvantekrypto?",
    points: 1, block: "krypto", tema: ["postkvantekrypto", "kvantedatamaskin"],
    ordrett: true,
    oppgave: "<p>Hva betyr begrepet \"postkvantekrypto\"?<br><em>Poeng: 1 for riktig svar. 0 for feil svar, 0 for intet valg, maks 1, minimum 0.</em></p><p><strong>Velg ett alternativ:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Poeng: 1 for riktig svar. 0 for feil svar, 0 for intet valg, maks 1, minimum 0.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: ["Kryptoalgoritmer som ikke kan knekkes med kvantecomputere.", "Å benytte kvantecomputere til å knekke kryptoalgoritmer.", "Kryptoalgoritmer som kan knekkes med kvantekomputere.", "Kryptoalgoritmer som benytter kvantecomputere."],
      svar: 0,
      explain: [
        "<p>Riktig. Postkvantekrypto er vanlige algoritmer som kjører på vanlige datamaskiner, men som er laget for å stå imot angrep fra kvantedatamaskiner.</p>",
        "<p>Feil. Det beskriver kvantekryptanalyse, altså angrepet, ikke forsvaret.</p>",
        "<p>Feil. Det er motsatt: det er dagens asymmetriske algoritmer (RSA, DH) som kan knekkes med kvantedatamaskiner.</p>",
        "<p>Feil. Det ligner mer på kvantekryptografi. Postkvantealgoritmer trenger ingen kvantedatamaskin.</p>"
      ]
    },
    avvik: null,
    losning: ["«Post» = etter: krypto som fortsatt holder etter at store kvantedatamaskiner finnes."],
    tips: ["Postkvante er pensum i 2026 (NIST-standardene ML-KEM, ML-DSA og SLH-DSA). Vit at det er RSA, DH og elliptiske kurver som trues, mens symmetrisk krypto og hash rammes lite.", "Arket skriver både «kvantecomputere» og «kvantekomputere», gjengitt ordrett."]
  });
  hv("H2020-2.2",
    "<p>Tenk deg at det snart kommer en supernøkkel som åpner mange av dagens låser. Postkvantekrypto er nye låser som er laget slik at supernøkkelen ikke passer.</p>",
    "<p>En stor kvantedatamaskin vil kunne knekke dagens asymmetriske algoritmer som RSA og Diffie-Hellman. Postkvantekrypto er nye algoritmer som kjører på vanlige maskiner, men som er laget for å tåle angrep fra kvantedatamaskiner.</p>",
    "<p>RSA bygger på at faktorisering er vanskelig, og DH bygger på at diskret logaritme er vanskelig. Begge problemene kan løses effektivt av en kvantedatamaskin (Shors algoritme). Postkvantealgoritmer bygger på andre matematiske problemer, for eksempel gitterproblemer, som det ikke er kjent noen effektiv kvantealgoritme for. Symmetriske algoritmer og hashfunksjoner svekkes bare moderat og holder med lange nok nøkler.</p>");

  O.push({
    key: "H2020-2.3", year: Y, oppgave_nr: "Oppgave 2.3", del: D2,
    ark: "2.3 Kryptoalgoritmer", title: "AES, RSA, begge eller ingen?",
    points: 3, block: "krypto", tema: ["AES", "RSA", "symmetrisk", "asymmetrisk", "nøkkelstørrelse"],
    gjenganger: ["H2025-3"],
    ordrett: true,
    oppgave: "<p>For hver egenskap, angi hvilken kryptoalgoritme som har egenskapen, ved å velge blant alternativene AES, RSA, Begge (både AES og RSA) eller Ingen (hverken AES eller RSA).<br><em>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</em></p><p><strong>Angi korrekt alternativ:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: R05,
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Begge", "Ingen", "AES", "RSA"],
      multi: false,
      rader: [
        { s: "Nøkkelstørrelse typisk under 1000 bit", svar: [2], explain: "<p>AES har nøkler på 128, 192 eller 256 bit. RSA trenger minst 2048 bit for å være sikker i dag. <strong>AES</strong>.</p>" },
        { s: "Asymmetrisk kryptoalgoritme", svar: [3], explain: "<p>RSA har et nøkkelpar med privat og offentlig nøkkel. <strong>RSA</strong>.</p>" },
        { s: "Kan potensielt knekkes med kvantecomputere", svar: [3], explain: "<p>RSA hviler på faktorisering, som en stor kvantedatamaskin kan gjøre effektivt. AES svekkes bare litt og holder med 256-bit nøkkel. <strong>RSA</strong>.</p>" },
        { s: "Kan benyttes for digital signatur", svar: [3], explain: "<p>Signatur krever et nøkkelpar der bare én part kan signere og alle kan sjekke. <strong>RSA</strong>.</p>" },
        { s: "Symmetrisk kryptoalgoritme", svar: [2], explain: "<p>AES bruker samme hemmelige nøkkel til kryptering og dekryptering. <strong>AES</strong>.</p>" },
        { s: "Kan benyttes for MAC", svar: [2], explain: "<p>En MAC bruker en delt hemmelig nøkkel, og en blokkchiffer som AES kan brukes til å lage den. <strong>AES</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["AES: symmetrisk, korte nøkler (128–256 bit), kan brukes til MAC.", "RSA: asymmetrisk, lange nøkler (2048 bit og mer), signatur, trues av kvantedatamaskiner."],
    tips: ["Ingen rader har svaret «Begge» eller «Ingen» her. Det er greit: kolonnene er distraktorer.", "«AES-512» finnes ikke. AES har 128-bit blokk og nøkler på 128, 192 eller 256 bit."]
  });
  hv("H2020-2.3",
    "<p>AES er en lås der du og vennen din har like nøkler. RSA er en postkasse der alle kan legge inn brev, men bare eieren har nøkkelen for å åpne den.</p>",
    "<p>AES er symmetrisk: samme nøkkel brukes begge veier, og nøklene er korte (128–256 bit). Den kan også brukes til MAC. RSA er asymmetrisk med et nøkkelpar, trenger mye lengre nøkler og kan brukes til signatur. Kvantedatamaskiner truer RSA, men knapt AES.</p>",
    "<p>Nøkkellengden henger sammen med det beste kjente angrepet. For AES er det uttømmende søk, så 128 bit gir 2¹²⁸ nøkler. For RSA finnes faktoriseringsalgoritmer som er mye raskere enn å prøve alle tall, så nøkkelen må være 2048–3072 bit for tilsvarende styrke. Shors algoritme ville faktorisere effektivt og knekke RSA helt, mens Grovers algoritme bare halverer den effektive nøkkellengden til AES.</p>");

  O.push({
    key: "H2020-2.4", year: Y, oppgave_nr: "Oppgave 2.4", del: D2,
    ark: "2.4 Diffie-Hellman", title: "Diffie-Hellman: tre korrekte utsagn",
    points: 3, block: "krypto", tema: ["Diffie-Hellman", "nøkkeletablering", "kvante", "autentisering"],
    gjenganger: ["H2025-12"],
    ordrett: true,
    oppgave: "<p>Angi 3 korrekte utsagn om Diffie-Hellman-algoritmen.<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, maks 3, minimum 0.</em></p><p><strong>Velg 3 alternativer</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, maks 3, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Velg 3 alternativer.",
      alternativer: ["Brukes for å etablere/utveksle symmetriske nøkler.", "Regnes ikke lenger som sikker.", "Brukes for å etablere/utveksle asymmetriske nøkler.", "Brukes til å krypere.", "Kan potensielt knekkes med kvantecomputere.", "Støtter ikke autentisering."],
      svar: [0, 4, 5],
      explain: [
        "<p>Riktig. Partene ender opp med en felles hemmelighet som brukes som (grunnlag for) en symmetrisk øktnøkkel.</p>",
        "<p>Feil. DH med store nok parametre er fortsatt i bruk overalt, blant annet i TLS 1.3.</p>",
        "<p>Feil. Resultatet er én felles hemmelig verdi, ikke et nøkkelpar.</p>",
        "<p>Feil. DH etablerer bare en nøkkel. Selve krypteringen gjøres etterpå med en symmetrisk algoritme.</p>",
        "<p>Riktig. DH hviler på diskret logaritme, som en stor kvantedatamaskin kan løse effektivt.</p>",
        "<p>Riktig. Ren DH sier ingenting om hvem den andre parten er, og er derfor sårbar for mann-i-midten. Autentisering må legges til, for eksempel med signatur.</p>"
      ]
    },
    avvik: null,
    losning: ["DH gir en felles symmetrisk nøkkel, ikke kryptering og ikke nøkkelpar.", "Ren DH har ingen autentisering, og den kan knekkes av kvantedatamaskiner."],
    tips: ["Med −1 for feil lønner det seg ikke å krysse av mer enn tre.", "Arket skriver «krypere», skrivefeil i originalen."]
  });
  hv("H2020-2.4",
    "<p>To personer blander hver sin hemmelige farge inn i en felles startfarge og bytter blandingene. Begge ender med samme sluttfarge, men den som bare så blandingene, klarer ikke å finne den. Men ingen av dem vet sikkert hvem de byttet med.</p>",
    "<p>Diffie-Hellman lar to parter bli enige om en felles hemmelig nøkkel over en åpen kanal. Nøkkelen brukes etterpå til symmetrisk kryptering. DH krypterer ikke selv, lager ikke nøkkelpar og autentiserer ikke partene. Uten signatur kan en mann i midten lure begge. En kvantedatamaskin vil kunne knekke DH.</p>",
    "<p>A sender gᵃ [mod p] og B sender gᵇ [mod p]. Begge regner ut gᵃᵇ = (gᵇ)ᵃ = (gᵃ)ᵇ [mod p]. En avlytter ser gᵃ og gᵇ, men må løse diskret logaritme for å finne a eller b. Det er praktisk umulig på vanlige maskiner, men ikke med Shors algoritme. Fordi ingen av verdiene er bundet til en identitet, kan en angriper kjøre én DH med A og en annen med B. Autentisert DH signerer verdiene, for eksempel S<sub>A</sub> = Sig(gᵃᵇ, A<sub>priv</sub>).</p>");

  /* ======================== DEL 3: NØKKELHÅNDTERING OG PKI ======================== */

  O.push({
    key: "H2020-3.1", year: Y, oppgave_nr: "Oppgave 3.1", del: D3,
    ark: "3.1 Kryptoperioder", title: "Beskyttelsesperiode eller prosesseringsperiode?",
    points: 3, block: "pki", tema: ["kryptoperiode", "beskyttelsesperiode", "prosesseringsperiode"],
    gjenganger: ["H2021-4.3"],
    ordrett: true,
    oppgave: "<p>Ved anvendelse av kryptonøkler skiller man mellom beskyttelsesperioden (protection period) og prosesseringsperioden (processing period), der de to periodene kan være delvis overlappende.</p><p>For hver nøkkelanvendelse, angi hvilken periode den tilhører ved å velge blant alternativene Beskyttelse (for beskyttelsesperioden) og Prosessering (for prosesseringsperioden).<br><em>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</em></p><p><strong>Velg riktig periode for hver nøkkelanvendelse:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: R05,
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Prosessering", "Beskyttelse"],
      multi: false,
      rader: [
        { s: "Dekryptering med asymmetrisk nøkkel.", svar: [0], explain: "<p>Dekryptering er å behandle data som allerede er beskyttet. <strong>Prosessering</strong>.</p>" },
        { s: "Kryptering med symmetrisk nøkkel.", svar: [1], explain: "<p>Kryptering er å legge beskyttelse på data. <strong>Beskyttelse</strong>.</p>" },
        { s: "Dekryptering med symmetrisk nøkkel.", svar: [0], explain: "<p>Dekryptering behandler beskyttede data. <strong>Prosessering</strong>.</p>" },
        { s: "Lage digital signatur med asymmetrisk nøkkel.", svar: [1], explain: "<p>Signering legger beskyttelse (integritet og opphav) på data. <strong>Beskyttelse</strong>.</p>" },
        { s: "Verifisere digital signatur med asymmetrisk nøkkel.", svar: [0], explain: "<p>Verifisering behandler data som allerede er signert. <strong>Prosessering</strong>.</p>" },
        { s: "Kryptering med asymmetrisk nøkkel.", svar: [1], explain: "<p>Kryptering legger beskyttelse på data, uansett om nøkkelen er symmetrisk eller asymmetrisk. <strong>Beskyttelse</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Spør: legger operasjonen på beskyttelse (kryptere, signere) eller bruker den beskyttede data (dekryptere, verifisere)?", "Legge på = beskyttelse. Bruke = prosessering. Typen nøkkel spiller ingen rolle."],
    tips: ["Prosesseringsperioden kan vare lenger enn beskyttelsesperioden: gamle data må kunne dekrypteres og signaturer sjekkes også etter at nøkkelen ikke lenger brukes til å beskytte nye data.", "Kryptoperioden går fra starten av beskyttelsesperioden til slutten av prosesseringsperioden."]
  });
  hv("H2020-3.1",
    "<p>Et stempel brukes til å forsegle nye brev bare en stund. Men brevene som allerede er forseglet, må kunne sjekkes mye lenger, kanskje i mange år.</p>",
    "<p>Beskyttelsesperioden er tiden en nøkkel brukes til å legge beskyttelse på data: kryptere og signere. Prosesseringsperioden er tiden nøkkelen brukes til å behandle beskyttede data: dekryptere og verifisere. Periodene kan overlappe, og prosessering fortsetter ofte etter at beskyttelsen er stoppet.</p>",
    "<p>Skillet gjør det mulig å fase ut en nøkkel uten å miste tilgang til gamle data. Når beskyttelsesperioden er over, lages ingen nye chiffertekster eller signaturer med nøkkelen. Den kan fortsatt brukes til å dekryptere arkiverte data eller verifisere gamle signaturer til prosesseringsperioden er over. For et asymmetrisk par betyr det at privatnøkkelen i signering og den offentlige nøkkelen i kryptering hører til beskyttelse, mens motpartene hører til prosessering.</p>");

  O.push({
    key: "H2020-3.2", year: Y, oppgave_nr: "Oppgave 3.2", del: D3,
    ark: "3.2 Bruk av asymmetriske nøkler", title: "Hvilken nøkkel til signatur og kryptering?",
    points: 2, block: "krypto", tema: ["asymmetrisk kryptering", "digital signatur", "privat nøkkel", "offentlig nøkkel"],
    gjenganger: ["H2021-3.5", "H2022-5.1", "H2022-5.4", "H2023-7", "H2024-19", "H2025-9"],
    ordrett: true,
    oppgave: "<p>Det brukes ulike typer asymmetriske kryptonøkler for kryptering/dekryptering, og for å lage/verifisere digitale signaturer.<br>For hver funksjon, angi hvilken nøkkeltype som benyttes ved å velge blant alternativene.<br><em>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</em></p><p><strong>Velg riktig nøkkeltype</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Mottagers private nøkkel", "Avsenders offentlig nøkkel", "Avsenders private nøkkel", "Mottagers offentlige nøkkel"],
      multi: false,
      rader: [
        { s: "Verifisere DigSig", svar: [1], explain: "<p>Alle skal kunne sjekke signaturen, så den sjekkes med <strong>avsenders offentlige nøkkel</strong>.</p>" },
        { s: "Lage DigSig", svar: [2], explain: "<p>Bare avsender skal kunne signere, så signaturen lages med <strong>avsenders private nøkkel</strong>.</p>" },
        { s: "Kryptering", svar: [3], explain: "<p>Alle skal kunne sende hemmelige meldinger til mottakeren, så det krypteres med <strong>mottakers offentlige nøkkel</strong>.</p>" },
        { s: "Dekryptering", svar: [0], explain: "<p>Bare mottakeren skal kunne lese, så det dekrypteres med <strong>mottakers private nøkkel</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Signatur: avsender eier begge nøklene. Lage med privat, verifisere med offentlig.", "Kryptering: mottaker eier begge nøklene. Kryptere med offentlig, dekryptere med privat."],
    tips: ["Spør: hvem er det som bare én person skal kunne gjøre? Den handlingen bruker den private nøkkelen.", "Man signerer aldri med en offentlig nøkkel."]
  });
  hv("H2020-3.2",
    "<p>Kryptering er en postkasse: alle kan legge inn brev (offentlig), men bare eieren har nøkkelen til å åpne (privat). Signatur er et personlig stempel: bare eieren har stempelet (privat), men alle har et bilde av det å sammenligne med (offentlig).</p>",
    "<p>Ved kryptering brukes mottakerens nøkkelpar: mottakerens offentlige nøkkel krypterer, og bare mottakerens private nøkkel dekrypterer. Ved signatur brukes avsenderens nøkkelpar: avsenderens private nøkkel signerer, og alle verifiserer med avsenderens offentlige nøkkel.</p>",
    "<p>Kryptering: C = E(M, K<sup>B</sup><sub>pub</sub>) og M = D(C, K<sup>B</sup><sub>priv</sub>). Signatur: S = Sig(H, K<sup>A</sup><sub>priv</sub>) med H = Hash(M), og mottakeren sjekker at Ver(S, K<sup>A</sup><sub>pub</sub>) = Hash(M′). Regelen er at den private nøkkelen brukes til det som bare én part skal kunne gjøre: lese hemmeligheter (mottaker) eller lage signaturer (avsender).</p>");

  O.push({
    key: "H2020-3.3", year: Y, oppgave_nr: "Oppgave 3.3", del: D3,
    ark: "3.3 PKI og sertifikater", title: "Sertifikater og PKI: fem korrekte utsagn",
    points: 5, block: "pki", tema: ["sertifikat", "rotsertifikat", "PKI", "DNSSEC", "nettleser-PKI"],
    gjenganger: ["H2022-6.3"],
    ordrett: true,
    oppgave: "<p>Angi 5 korrekte utsagn om sertifikater.<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet svar, maks 5, minimum 0.</em></p><p><strong>Velg 5 alternativer</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet svar, maks 5, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 5 },
      regelMerknad: "Velg 5 alternativer.",
      alternativer: [
        "Validering av et server-sertifikat avhenger av et rot-sertifikat.",
        "Servere genererer server-sertifikater ved å bruke et rot-sertifikat.",
        "Et server-sertifikat inneholder serverens private nøkkel.",
        "Et server-sertifikat inneholder serverens offentlige nøkkel.",
        "Rot-sertifikater kan valideres med selv-sertifisering.",
        "Server-sertifikatet beskytter nøkkelens konfidensialitet.",
        "Rot-sertifikater trenger ikke konfidensialitet.",
        "Server-sertifikatet beskytter nøkkelens integritet/autentisitet.",
        "PKI for DNSSEC (Domain Name System Security Extensions) har mange rot-sertifikater.",
        "PKI for Internett/nettlesere har mange rot-sertifikater."
      ],
      svar: [0, 3, 6, 7, 9],
      explain: [
        "<p>Riktig. Kjeden valideres fra en rot som klienten stoler på fra før, ned til serversertifikatet.</p>",
        "<p>Feil. Serversertifikatet utstedes og signeres av en CA, ikke av serveren selv, og serveren har ikke rot-CA-ens private nøkkel.</p>",
        "<p>Feil. Et sertifikat er offentlig og inneholder aldri en privat nøkkel.</p>",
        "<p>Riktig. Sertifikatet binder serverens navn til serverens offentlige nøkkel.</p>",
        "<p>Feil ifølge fasit. Et rotsertifikat er selvsignert, men den egensignaturen beviser ingenting: hvem som helst kan lage en. Roten må være kjent og stolt på på forhånd (for eksempel ved at den ligger i nettleseren).</p>",
        "<p>Feil. Sertifikatet og nøkkelen i det er offentlige. Det er ingenting å holde hemmelig.</p>",
        "<p>Riktig. Rotsertifikatet inneholder bare den offentlige nøkkelen og kan deles fritt. Det som trengs, er integritet: at det er det ekte rotsertifikatet.</p>",
        "<p>Riktig. CA-ens signatur gjør at ingen kan endre navnet eller nøkkelen i sertifikatet uten at det oppdages.</p>",
        "<p>Feil. DNSSEC har én felles rot (rotsonen i DNS), ikke mange.</p>",
        "<p>Riktig. Nettlesere og operativsystemer leveres med mange rotsertifikater fra mange CA-er.</p>"
      ]
    },
    avvik: null,
    losning: ["Sertifikatet = offentlig nøkkel + navn + CA-signatur. Ingen privat nøkkel, ingen konfidensialitet.", "Det beskytter integritet og autentisitet til den offentlige nøkkelen.", "Validering starter i en rot du stoler på. Nettleser-PKI har mange røtter, DNSSEC har én."],
    tips: ["Fem riktige av ti med −1 for feil: kryss bare av det du er sikker på.", "Selvsignert betyr ikke validert. Tillit til roten må komme fra noe annet enn signaturen."]
  });
  hv("H2020-3.3",
    "<p>Et sertifikat er som et ID-kort for en nettside. Kortet er ikke hemmelig, men det må være ekte. Du stoler på kortet fordi det er utstedt av noen du allerede stoler på.</p>",
    "<p>Et serversertifikat inneholder serverens navn og offentlige nøkkel, signert av en CA. Signaturen beskytter integritet og autentisitet, ikke konfidensialitet. For å validere sertifikatet går klienten kjeden opp til et rotsertifikat som den stoler på fra før. Nettlesere har mange slike røtter, mens DNSSEC har én.</p>",
    "<p>Validering betyr å sjekke hver signatur i kjeden med nøkkelen i sertifikatet over, helt til en rot i tillitslageret. Roten er selvsignert, og den signaturen gir ingen sikkerhet i seg selv, fordi en angriper kan lage et like selvsignert sertifikat. Tilliten kommer fra at roten er distribuert på en sikker måte på forhånd. Derfor trenger roten integritet ved distribusjon, men ikke konfidensialitet. Mange røtter (nettleser-PKI) gir mange CA-er som hver kan utstede sertifikat for et hvilket som helst domene.</p>");

  /* ============================ DEL 4: NETTVERKSSIKKERHET ============================ */

  O.push({
    key: "H2020-4.1", year: Y, oppgave_nr: "Oppgave 4.1", del: D4,
    ark: "4.1 TLS", title: "TLS: tre korrekte utsagn",
    points: 3, block: "nettverk", tema: ["TLS", "handshake", "sesjonsnøkkel", "serversertifikat", "MitM"],
    ordrett: true,
    oppgave: "<p>Angi 3 korrekte utsagn om TLS.<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet svar, maks 3, minimum 0.</em></p><p><strong>Velg 3 alternativer</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet svar, maks 3, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Velg 3 alternativer.",
      alternativer: [
        "En asymmetrisk sesjonsnøkkel brukes for for kryptering under TLS Record Protocol",
        "TLS inneholder tiltak mot man-in-the-middle angrep.",
        "Serveren autentiserer klienten med server-sertifikatet under TLS hand-shake.",
        "Klienten autentiserer serveren med server-sertifikatet under TLS-hand-shake.",
        "Klienten mottar server-sertifikatet fra CA (Certificate Authority) under TLS hand-shake.",
        "Sesjonsnøkkelen genereres under TLS hand-shake."
      ],
      svar: [1, 3, 5],
      explain: [
        "<p>Feil. Sesjonsnøkkelen er symmetrisk. Asymmetrisk krypto brukes bare i handshake.</p>",
        "<p>Riktig. Serverautentisering med sertifikat (og signerte nøkkelutvekslinger) skal hindre at noen setter seg i midten.</p>",
        "<p>Feil. Serversertifikatet beviser serverens identitet overfor klienten, ikke omvendt.</p>",
        "<p>Riktig. Klienten sjekker sertifikatkjeden og at serveren har den tilhørende private nøkkelen.</p>",
        "<p>Feil. Serveren sender sertifikatet selv. Klienten kontakter ikke CA-en under handshake.</p>",
        "<p>Riktig. Handshake etablerer den felles hemmeligheten som sesjonsnøklene avledes fra.</p>"
      ]
    },
    avvik: null,
    losning: ["Handshake: autentisere serveren med sertifikat og etablere sesjonsnøkkel.", "Record: krypterer dataene med den symmetriske sesjonsnøkkelen."],
    tips: ["Sertifikatet kommer fra serveren, ikke fra CA-en.", "Arket skriver «for for», skrivefeil i originalen."]
  });
  hv("H2020-4.1",
    "<p>Først viser butikken deg et ID-kort som noen du stoler på har stemplet, og dere blir enige om et hemmelig språk. Deretter snakker dere bare det hemmelige språket.</p>",
    "<p>TLS har to deler. I handshake sender serveren sertifikatet sitt, klienten sjekker det, og partene etablerer en felles symmetrisk sesjonsnøkkel. I Record-protokollen krypteres og integritetsbeskyttes dataene med sesjonsnøkkelen. Serverautentiseringen er det som hindrer mann-i-midten.</p>",
    "<p>Serveren sender sertifikatkjeden sin i handshake. Klienten validerer kjeden mot rotsertifikatene den har, og sjekker at navnet stemmer med domenet. Serveren beviser at den har privatnøkkelen ved å signere handshake-data. Nøkkelutvekslingen (i et fullt TLS 1.3-handshake flyktig (EC)DH) gir en felles hemmelighet som symmetriske nøkler avledes fra. Klientautentisering med klientsertifikat finnes, men er valgfritt og bruker klientens eget sertifikat.</p>");

  O.push({
    key: "H2020-4.2", year: Y, oppgave_nr: "Oppgave 4.2", del: D4,
    ark: "4.2 Brannmurer og soner", title: "DMZ, internt nett eller begge?",
    points: 3, block: "nettverk", tema: ["DMZ", "brannmur", "soner", "IDS"],
    ordrett: true,
    oppgave: "<p>Et nettverk med to brannmurer kan ha en såkalt <strong>DMZ (Demilitarized Zone)</strong> mellom dem og <strong>interne nett</strong> bak den interne brannmuren, som vist på figuren. Forskjellige nettverkselementer kan plasseres i DMZ, i interne nett, eller i begge soner. Indiker typisk plassering av nettverkselementer i de to sonene.<br><em>Poeng: 0,5 for korrekt, -0,5 for feil, 0 for intet valg, maks 3, minimum 0.</em></p><p><strong>Velg riktig alternativ for typisk plassering av nettverkselementer:</strong></p>",
    figur: {
      beskrivelse: "Nettverkskart med blå linjer. Øverst til venstre en sky «Internet» koblet til «External Router / Firewall» (murvegg-ikon). Under den går linjen ned til «Internal Router / Firewall». Mellom de to brannmurene går en vannrett linje til venstre merket «DMZ (Demilitarized Zone)» med tre bokser med «?». Under den interne brannmuren går en vannrett linje til høyre merket «Internal Networks» med tre bokser med «?».",
      tekst: ["Internet", "External Router / Firewall", "DMZ (Demilitarized Zone)", "Internal Router / Firewall", "Internal Networks", "?"]
    },
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for korrekt, -0,5 for feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["DMZ", "Internt nett", "Begge"],
      multi: false,
      rader: [
        { s: "Database-server", svar: [1], explain: "<p>Databasen har de mest verdifulle dataene og skal ikke nås direkte fra Internett. Den står bak den interne brannmuren: <strong>Internt nett</strong>.</p>" },
        { s: "Email-server", svar: [0], explain: "<p>E-posttjeneren må ta imot e-post fra Internett og står derfor i <strong>DMZ</strong>.</p>" },
        { s: "Web-server", svar: [0], explain: "<p>Den offentlige nettsiden skal nås fra Internett: <strong>DMZ</strong>.</p>" },
        { s: "Arbeidsstasjon", svar: [1], explain: "<p>De ansattes maskiner skal ikke nås utenfra: <strong>Internt nett</strong>.</p>" },
        { s: "DNS-server", svar: [0], explain: "<p>DNS-tjeneren som svarer på spørsmål om virksomhetens domene fra Internett, står i <strong>DMZ</strong> ifølge fasit. (Mange har i tillegg en intern DNS, men det er ikke svaret her.)</p>" },
        { s: "IDS (Intrusion Detection System)", svar: [2], explain: "<p>Angrep kan skje i begge soner, så sensorer plasseres typisk både i DMZ og internt: <strong>Begge</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Tjenester som må nås fra Internett (web, e-post, DNS) står i DMZ.", "Det som bare brukes internt eller er mest verdifullt (database, arbeidsstasjoner) står internt.", "Overvåking (IDS) trengs begge steder."],
    tips: ["Tommelregel: kommer forespørselen utenfra? Da står tjeneren i DMZ.", "Eldre sett (2017 og 2019) har nesten samme matrise."]
  });
  hv("H2020-4.2",
    "<p>Et kontorbygg har en resepsjon der besøkende slipper inn, og en låst kontordel bak en ekstra dør. Det besøkende skal bruke, står i resepsjonen. Arkivet og de ansattes pulter står bak den ekstra døra. Vektere går runder begge steder.</p>",
    "<p>DMZ er en sone mellom den ytre og den indre brannmuren. Her står tjenester som må nås fra Internett: web, e-post og ekstern DNS. Blir en av dem kompromittert, står angriperen fortsatt utenfor det interne nettet. Databaser og arbeidsstasjoner står internt. IDS plasseres i begge soner for å oppdage angrep der de skjer.</p>",
    "<p>Den ytre brannmuren slipper bare trafikk fra Internett til bestemte porter på tjenerne i DMZ. Den indre brannmuren slipper nesten ingenting fra DMZ inn til det interne nettet, bare det som trengs (for eksempel at webtjeneren når databasen på én port). Slik blir en kompromittert DMZ-tjener ikke en direkte vei inn. IDS-sensorer i begge soner ser ulike deler av trafikken, så de utfyller hverandre.</p>");

  O.push({
    key: "H2020-4.3", year: Y, oppgave_nr: "Oppgave 4.3", del: D4,
    ark: "4.3 IDS", title: "Signaturbasert, anomalibasert, begge eller ingen?",
    points: 4, block: "nettverk", tema: ["IDS", "signaturbasert", "anomalibasert", "TLS"],
    gjenganger: ["H2023-31", "H2025-21"],
    ordrett: true,
    oppgave: "<p>IDS (Intrusion Detection System) brukes for å detektere mulige angrep i nettverk.<br>To hovedtyper IDS er <strong>signaturbasert</strong> og <strong>anomalibasert</strong>. Angi om egenskapene gjelder for henholdsvis signaturbasert IDS, anomalibasert IDS, for begge, eller for ingen av dem.<br><em>Poeng: 1 for hver korrekt, -1 for for hver feil, 0 for intet valg, maks 4, minimum 0.</em></p><p><strong>Velg IDS-type som har hver egenskap:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for for hver feil, 0 for intet valg, maks 4, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
      kolonner: ["Ingen", "Begge", "Anomalibasert", "Signaturbasert"],
      multi: false,
      rader: [
        { s: "Dekrypterer TLS-trafikk", svar: [0], explain: "<p>En IDS lytter passivt og har ikke nøklene. Å se inn i TLS krever TLS-inspeksjon i en proxy eller brannmur: <strong>Ingen</strong>.</p>" },
        { s: "Oppdages ikke av angriper", svar: [1], explain: "<p>Begge typer kan lytte passivt på nettet uten å sende noe, så angriperen merker dem ikke: <strong>Begge</strong>.</p>" },
        { s: "Detekterer ukjente angrep", svar: [2], explain: "<p>Anomalibasert IDS slår alarm på alt som avviker fra normal trafikk, også angrep ingen har sett før: <strong>Anomalibasert</strong>.</p>" },
        { s: "Detekterer kjente angrep", svar: [3], explain: "<p>Signaturbasert IDS sammenligner trafikken med mønstre fra kjente angrep: <strong>Signaturbasert</strong>.</p>" }
      ]
    },
    avvik: "Fasiten setter bare «Signaturbasert» på «Detekterer kjente angrep». En anomalibasert IDS kan også slå ut på et kjent angrep hvis det gir unormal trafikk, men det er ikke det den er laget for. Svar som fasiten: kjent = signatur, ukjent = anomali.",
    losning: ["Signatur = kjente mønstre, oppdager kjente angrep, få falske alarmer.", "Anomali = avvik fra normalen, kan oppdage ukjente angrep, flere falske alarmer.", "Ingen av dem dekrypterer TLS. Begge kan være usynlige for angriperen."],
    tips: ["Med −1 for feil og 1 for riktig per rad: «kjent → signatur, ukjent → anomali» er den sikre regelen.", "Arket skriver «for for», skrivefeil i originalen."]
  });
  hv("H2020-4.3",
    "<p>En signaturbasert vakt har en mappe med bilder av kjente tyver. En anomalibasert vakt kjenner alle som pleier å komme, og reagerer på alt som er rart. Ingen av vaktene kan se hva som ligger i en låst koffert.</p>",
    "<p>Signaturbasert IDS leter etter kjente mønstre, så den finner kjente angrep. Anomalibasert IDS lærer hva som er normalt og varsler om avvik, så den kan finne nye angrep, men gir flere falske alarmer. Begge lytter passivt og kan være usynlige for angriperen. Ingen av dem dekrypterer TLS.</p>",
    "<p>En signatur er en regel som matcher bestemte bytes, porter eller sekvenser (Snort-regler er eksempler). Det gir lav falsk positiv-rate, men et nulldagsangrep uten signatur slipper gjennom. Anomalideteksjon bygger en statistisk modell av normal trafikk og varsler når noe avviker, for eksempel uvanlige volumer eller tidspunkter. Begge ser bare klartekst. Kryptert innhold kan de bare vurdere ut fra metadata som adresser, porter og mengder.</p>");

  /* ============================ DEL 5: SYSTEMSIKKERHET ============================ */

  O.push({
    key: "H2020-5.1", year: Y, oppgave_nr: "Oppgave 5.1", del: D5,
    ark: "5.1 Privilegienivåer", title: "Ring 3 til ring −3 med type 1-virtualisering",
    points: 3, block: "system", tema: ["privilegienivå", "ring", "hypervisor", "UEFI", "Intel ME", "virtualisering"],
    gjenganger: ["H2022-2.4", "H2023-5", "H2025-5"],
    ordrett: true,
    oppgave: "<p>Forskjellige funksjoner har ulike privilegienivåer i et system. Anta et system basert på Intel mikroprosessor med Type-1 virtualisering (native). Privilegienivåene er angitt fra Ring -3 (størst/høyest privilegie) til Ring 3 (minst/lavest privilegie). Tilordne hver systemfunksjon til riktig privilegienivå i diagrammet. Merk at Intel ikke offisielt spesifiserer Ring -3 og -2 som privilegienivåer, men i figuren representerer de hva som i praksis er privilegienivåer for visse funksjoner.<br><em>Poeng: 0,5 poeng for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 3, minimum 0.</em><br><strong>Flytt hver funksjon over feltet for riktig privilegienivå.</strong></p>",
    figur: {
      beskrivelse: "Til høyre en loddrett stabel av felt med nivåetiketter til høyre i hvert felt, ovenfra og ned: «Ring 3» (felt 1), «Ring 2» og «Ring 1» i samme høye felt (felt 2), «Ring 0» (felt 3), «Ring -1» (felt 4), «Ring -2» (felt 5), «Ring -3» (felt 6). Til venstre seks dra-bokser.",
      tekst: ["Ring 3", "Ring 2", "Ring 1", "Ring 0", "Ring -1", "Ring -2", "Ring -3"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 poeng for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      tekst: null,
      bank: ["Applikasjoner", "Gjesteoperativsystem (Guest OS)", "Hypervisor", "(Ingen funksjoner)", "Intel ME (Management Engine)", "UEFI/BIOS"],
      felt: [
        { etikett: "Ring 3", svar: 0, godta: [], explain: "<p>Vanlige programmer kjører med minst privilegium: <strong>Applikasjoner</strong>.</p>" },
        { etikett: "Ring 2 og Ring 1", svar: 3, godta: [], explain: "<p>Moderne operativsystemer bruker bare ring 0 og ring 3, så ring 1 og 2 står tomme: <strong>(Ingen funksjoner)</strong>.</p>" },
        { etikett: "Ring 0", svar: 1, godta: [], explain: "<p>Med type 1-virtualisering kjører gjestens kjerne i ring 0, fordi hypervisoren har tatt nivået under: <strong>Gjesteoperativsystem (Guest OS)</strong>.</p>" },
        { etikett: "Ring -1", svar: 2, godta: [], explain: "<p>Hypervisoren kjører i maskinvarens egen hypervisormodus, under gjestekjernene: <strong>Hypervisor</strong>.</p>" },
        { etikett: "Ring -2", svar: 5, godta: [], explain: "<p>Fastvaren som starter maskinen og har en egen modus (SMM) under hypervisoren: <strong>UEFI/BIOS</strong>.</p>" },
        { etikett: "Ring -3", svar: 4, godta: [], explain: "<p>Management Engine er en egen prosessor i brikkesettet som kjører uavhengig av hovedprosessoren og har tilgang til alt: <strong>Intel ME</strong>.</p>" }
      ]
    },
    avvik: "Utenfor pensum H2026 (delvis): systemsikkerhetslysarket 2026 går bare ned til nivå −1 (hypervisor). Ring −2 (UEFI/BIOS) og ring −3 (Intel ME) er ikke med, og arket sier selv at Intel ikke definerer dem offisielt.",
    losning: ["Lavere tall = mer makt.", "Ring 3 apper, ring 1–2 tomme, ring 0 gjeste-OS, ring −1 hypervisor.", "Under det: ring −2 UEFI/BIOS (fastvare), ring −3 Intel ME (egen prosessor)."],
    tips: ["Ring −2 og −3 er ikke med i 2026-lysarkene, som går ned til nivå −1 (hypervisormodus). Lær ring 3, 0 og −1 sikkert.", "Uten virtualisering ligger operativsystemet selv i ring 0. Med type 1 er det gjestens kjerne som er der."]
  });
  hv("H2020-5.1",
    "<p>Tenk på en bygning. Gjestene (apper) er i øverste etasje med minst nøkler. Hver leilighetseier (gjeste-OS) styrer sin etasje. Vaktmesteren (hypervisor) har nøkler til alle leilighetene. Under ham er den som bygde huset (fastvaren), og under der igjen en skjult kontrollsentral som ser alt (Intel ME).</p>",
    "<p>Ringene viser hvor mye makt en programvare har. Jo lavere tall, desto mer makt. Apper kjører i ring 3. Ring 1 og 2 brukes ikke. Med type 1-virtualisering kjører gjestenes operativsystemer i ring 0 og hypervisoren i ring −1. UEFI/BIOS og Intel ME har i praksis enda mer makt og plasseres i ring −2 og −3.</p>",
    "<p>En prosess kan bare nå sitt eget nivå og nivåer med høyere tall. Type 1-hypervisoren bruker prosessorens maskinvarestøtte for virtualisering (−1), så gjestekjernene kan kjøre i ring 0 uten å kunne nå hverandre. Systemstyringsmodus (SMM) i fastvaren kan avbryte alt over seg og kalles derfor «ring −2». Intel ME er en separat mikrokontroller med egen fastvare og tilgang til minne og nettverk, uavhengig av hovedprosessoren. Derfor kalles den «ring −3». Kompromittering så langt nede er nesten umulig å oppdage fra operativsystemet.</p>");

  O.push({
    key: "H2020-5.2", year: Y, oppgave_nr: "Oppgave 5.2", del: D5,
    ark: "5.2 Buffer Overflow", title: "Bufferoverflyt: fire korrekte utsagn",
    points: 4, block: "system", tema: ["bufferoverflyt", "fuzzing", "exploit", "ASLR"],
    gjenganger: ["H2022-2.3"],
    ordrett: true,
    oppgave: "<p>Angi 4 korrekte utsagn om \"Buffer Overflow\".<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, maks 4, minimum 0.</em></p><p><strong>Velg 4 alternativer:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, maks 4, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
      regelMerknad: "Velg 4 alternativer.",
      alternativer: [
        "Buffer Overflow kan oppdages med fuzzing (en måte å teste programvare).",
        "Buffer Overflow brukes typisk som del av en exploit (skadevare).",
        "Buffer Overflow er en form for DDoS angrep.",
        "Buffer Overflow kan forhindres med ASLR (Address Space Layout Randomization).",
        "Buffer Overflow er når data sendes raskere enn en prosess klarer å motta.",
        "Buffer Overflow er når minnet er oppbrukt.",
        "Buffer Overflow skjer ved å skrive mere data til en variabel enn den har plass til.",
        "Buffer Overflow er en bug (feil i programvare)."
      ],
      svar: [0, 1, 6, 7],
      explain: [
        "<p>Riktig. Fuzzing sender mengder av tilfeldig eller for lang input til programmet. Krasjer det, kan det skyldes en bufferoverflyt.</p>",
        "<p>Riktig. En exploit utnytter sårbarheten for å overskrive minne og få kjørt angriperens kode.</p>",
        "<p>Feil. En bufferoverflyt kan få et program til å krasje, men det er en programfeil, ikke et distribuert tjenestenektangrep.</p>",
        "<p>Feil. ASLR gjør det vanskeligere å utnytte en overflyt fordi angriperen ikke vet hvor koden ligger i minnet, men selve feilen er der fortsatt.</p>",
        "<p>Feil. Det beskriver overbelastning av en mottaker, ikke at en variabel får for mye data.</p>",
        "<p>Feil. Tomt minne er noe annet. En overflyt skjer når én buffer får mer enn den er laget for.</p>",
        "<p>Riktig. Dette er selve definisjonen: dataene renner over grensen til bufferen og overskriver det som ligger ved siden av.</p>",
        "<p>Riktig. Overflyten skyldes manglende lengdesjekk i koden, altså en programfeil.</p>"
      ]
    },
    avvik: null,
    losning: ["Definisjon: mer data enn plassen i bufferen, en programfeil.", "Den oppdages med fuzzing og utnyttes av exploits.", "ASLR, NX og kanarifugler gjør utnyttelse vanskeligere, men retter ikke feilen."],
    tips: ["«Forhindre» er et farlig ord. ASLR gjør angrep vanskeligere, men hindrer ikke at overflyten skjer. Fasiten er derfor riktig når den ikke merker ASLR-utsagnet (eldre analyser har kalt det en fasitfeil).", "Arket kaller en exploit «skadevare». Mer presist er en exploit koden som utnytter sårbarheten."]
  });
  hv("H2020-5.2",
    "<p>Du heller en hel liter melk i et glass som bare tar en halv. Resten renner over og ødelegger det som ligger ved siden av. En slem person kan helle med vilje og bestemme hva som blir ødelagt.</p>",
    "<p>En bufferoverflyt skjer når et program skriver mer data inn i en buffer enn den har plass til, fordi koden ikke sjekker lengden. Det er en programfeil. Angripere bruker den i exploits for å overskrive minne og få kjørt egen kode. Fuzzing kan avsløre feilen. ASLR og lignende tiltak gjør det vanskeligere å utnytte den, men fjerner den ikke.</p>",
    "<p>På stakken ligger lokale variabler rett ved siden av returadressen. Kopieres for lang input inn i en lokal buffer uten lengdesjekk, kan returadressen overskrives slik at funksjonen hopper til angriperens kode. NX hindrer kjøring fra stakken, kanarifugler oppdager at returadressen er endret, og ASLR gjør adressene uforutsigbare. Alle tre gjør utnyttelse vanskeligere, men den egentlige rettingen er å sjekke lengden i koden.</p>");

  O.push({
    key: "H2020-5.3", year: Y, oppgave_nr: "Oppgave 5.3", del: D5,
    ark: "5.3 Sikkerhetsevaluering", title: "TCSEC eller Common Criteria?",
    points: 3, block: "system", tema: ["TCSEC", "Common Criteria", "sikkerhetsevaluering", "TCB"],
    ordrett: true,
    oppgave: "<p>For hver karakteristikk, angi hvilken standard for sikkerhetsevaluering som har karakteristikken, ved å velge blant TSEC (Trusted Computer Security Evaluation Criteria), Common Criteria, Begge eller Ingen (hverken TCSEC eller Common Criteria).<br><em>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</em></p><p><strong>Angi standard for sikkerhetsevaluering som passer til karakteristikk:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: R05,
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["TCSEC", "Common Criteria", "Begge", "Ingen"],
      multi: false,
      rader: [
        { s: "Passer for sikkerhetsevaluering av operativsystemer.", svar: [2], explain: "<p>TCSEC ble laget nettopp for operativsystemer, og Common Criteria kan evaluere alle typer produkter, også operativsystemer: <strong>Begge</strong>.</p>" },
        { s: "Passer for sikkerhetsevaluering av alle slags systemer.", svar: [1], explain: "<p>Common Criteria er generell: produsenten beskriver selv hva som skal evalueres. <strong>Common Criteria</strong>.</p>" },
        { s: "Publisert på 1980-tallet.", svar: [0], explain: "<p>TCSEC («Orange Book») kom fra det amerikanske forsvaret på 1980-tallet: <strong>TCSEC</strong>.</p>" },
        { s: "Publisert på 1990-tallet.", svar: [1], explain: "<p>Common Criteria ble utviklet på 1990-tallet og ble ISO-standard (15408) i 1999: <strong>Common Criteria</strong>.</p>" },
        { s: "Publisert på 2000-tallet.", svar: [3], explain: "<p>Ingen av dem ble først publisert på 2000-tallet: <strong>Ingen</strong>.</p>" },
        { s: "Definerte begrepet TCB (Trusted Computing Base).", svar: [0], explain: "<p>TCB, de delene av systemet som sikkerheten hviler på, er et begrep fra <strong>TCSEC</strong>.</p>" }
      ]
    },
    avvik: "Utenfor pensum H2026: TCSEC og Common Criteria har ingen 2026-lysark og var sist på eksamen i 2020.",
    losning: ["TCSEC: 1980-tallet, USA, operativsystemer, definerte TCB.", "Common Criteria: 1990-tallet, internasjonal, alle slags produkter, også operativsystemer."],
    tips: ["TCSEC og Common Criteria er ikke i 2026-pensum (ingen lysark). Lær bare hovedskillet hvis du har tid.", "Arket skriver «TSEC» i oppgaveteksten, men «TCSEC» i kolonnen. Skrivefeil i originalen."]
  });
  hv("H2020-5.3",
    "<p>TCSEC er en gammel prøve som bare fantes for én type bil. Common Criteria er en nyere prøve som kan brukes på alle slags kjøretøy, også den gamle typen.</p>",
    "<p>TCSEC (Orange Book) kom på 1980-tallet og var laget for å evaluere operativsystemer. Den innførte begrepet TCB. Common Criteria kom på 1990-tallet, er internasjonal og kan brukes på alle slags IT-produkter, også operativsystemer.</p>",
    "<p>TCSEC hadde faste klasser (D, C1, C2, B1–B3, A1) som kombinerte krav til funksjonalitet og tillit, med fokus på konfidensialitet i flerbrukeroperativsystemer. Common Criteria skiller funksjonelle krav fra garantikrav: produsenten beskriver sikkerhetsmålet (Security Target), og evalueringen gir et garantinivå (EAL1–EAL7). Derfor passer den for alle typer produkter.</p>");

  /* ======================== DEL 6: IS-LEDELSE OG MENNESKELIGE FAKTORER ======================== */

  O.push({
    key: "H2020-6.1", year: Y, oppgave_nr: "Oppgave 6.1", del: D6,
    ark: "6.1 Standarder for informasjonssikkerhet", title: "ISO 27001, 27002, begge eller ingen?",
    points: 3, block: "risiko", tema: ["ISO 27001", "ISO 27002", "ISMS", "sertifisering"],
    gjenganger: ["H2021-8.1", "H2023-36"],
    ordrett: true,
    oppgave: "<p>For hver karakteristikk, angi hvilken internasjonal standard for informasjonssikkerhet som har karakteristikken, ved å velge blant ISO 27001 Ledelsessystem for informasjonssikkerhet (Information Security Management System - ISMS), ISO 27002 Tiltak for informasjonssikring (Code of practice for information security controls), Begge eller Ingen (hverken ISO 27001 eller ISO 27002).<br><em>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</em></p><p><strong>Angi standard for informasjonssikkerhet som passer til karakteristikk:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: R05,
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Den fjerde kolonnen har ingen overskrift i utskriften. Oppgaveteksten sier at valget er «Ingen».",
      kolonner: ["ISO 27001", "ISO 27002", "Begge", "Ingen"],
      multi: false,
      rader: [
        { s: "Obligatorisk for alle norske foretak.", svar: [3], explain: "<p>Ingen av standardene er påbudt for alle. Virksomheter velger selv å følge dem eller å sertifisere seg: <strong>Ingen</strong>.</p>" },
        { s: "Beskriver detaljerte sikkerhetstiltak.", svar: [1], explain: "<p>27002 er tiltaksbanken med beskrivelse av hvert tiltak: <strong>ISO 27002</strong>.</p>" },
        { s: "Grunnlag for sertifisering av foretak.", svar: [0], explain: "<p>27001 er kravstandarden som en virksomhet kan sertifiseres mot: <strong>ISO 27001</strong>.</p>" },
        { s: "Beskriver organisering av arbeidet med informasjonssikkerhet.", svar: [0], explain: "<p>27001 beskriver styringssystemet: ledelse, roller, risikovurdering og forbedring: <strong>ISO 27001</strong>.</p>" },
        { s: "Startet som britisk standard på 1990-tallet.", svar: [2], explain: "<p>Begge stammer fra den britiske standarden BS 7799 fra 1990-tallet (del 1 ble 27002, del 2 ble 27001): <strong>Begge</strong>.</p>" },
        { s: "Beskriver hvordan systemsikkerhet kan evalueres.", svar: [3], explain: "<p>Evaluering av produkter er Common Criteria sitt område, ikke ISO 27001/27002: <strong>Ingen</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["27001: styringssystemet (ISMS), krav, sertifisering.", "27002: tiltakene, beskrevet i detalj.", "Begge kom fra BS 7799. Ingen av dem er påbudt eller evaluerer produkter."],
    tips: ["27001 = «hvordan styre», 27002 = «hvilke tiltak».", "Evaluering av produkter (TCSEC, Common Criteria) står i 5.3. Ikke bland dem."]
  });
  hv("H2020-6.1",
    "<p>27001 er reglene for hvordan en skole skal drives: hvem bestemmer, hvordan man planlegger og forbedrer seg. 27002 er en stor oppslagsbok med konkrete tips: lås dører, ta sikkerhetskopi, lær opp elevene.</p>",
    "<p>ISO 27001 beskriver et styringssystem for informasjonssikkerhet (ISMS) og er standarden virksomheter sertifiseres mot. ISO 27002 er en katalog med detaljerte sikkerhetstiltak. Begge kom fra britiske BS 7799. Ingen av dem er obligatorisk for alle norske virksomheter, og ingen av dem handler om å evaluere produkter.</p>",
    "<p>27001 stiller krav til ledelsens forankring, risikovurdering og risikobehandling og en kontinuerlig forbedringssyklus (PDCA). Vedlegget lister tiltakene fra 27002, og virksomheten må begrunne hvilke den bruker. 27002 gir veiledning for hvert tiltak. BS 7799 del 1 (tiltak) ble ISO 17799 og senere 27002. Del 2 (ISMS-krav) ble 27001.</p>");

  O.push({
    key: "H2020-6.2", year: Y, oppgave_nr: "Oppgave 6.2", del: D6,
    ark: "6.2 NSMs Grunnprinsipper for IKT-sikkerhet", title: "NSMs grunnprinsipper: tre korrekte utsagn",
    points: 3, block: "risiko", tema: ["NSM", "grunnprinsipper", "ISO 27002", "ISMS"],
    gjenganger: ["H2021-8.2", "H2023-37", "H2024-32", "H2025-29"],
    ordrett: true,
    oppgave: "<p>Angi 3 korrekte utsagn om <strong>NSMs Grunnprinsipper for IKT-sikkerhet</strong>.<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet svar, maks 3, minimum 0.</em></p><p><strong>Velg 3 alternativer</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet svar, maks 3, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Velg 3 alternativer.",
      alternativer: [
        "Gir en norsk beskrivelse av sikkerhetstiltak tilsvarende ISO 27002.",
        "Beskriver hvordan effekten av sikkerhetstiltak kan måles.",
        "Er relevant for alle norske virksomheter.",
        "Oversetter \"ISMS\" som \"Styringssystem for informasjonssikkerhet\".",
        "Gir en norsk beskrivelse av ISMS (Informastion Security Management System) tilsvarende ISO 27001.",
        "Er obligatorisk for alle statlige virksomheter i Norge."
      ],
      svar: [0, 2, 3],
      explain: [
        "<p>Riktig. Grunnprinsippene er en tiltaksbank, slik ISO 27002 er.</p>",
        "<p>Feil. De beskriver hva som bør gjøres, ikke hvordan man måler effekten.</p>",
        "<p>Riktig. De er laget for alle virksomheter i Norge, offentlige og private.</p>",
        "<p>Riktig. NSM bruker det norske uttrykket «styringssystem for informasjonssikkerhet» for ISMS.</p>",
        "<p>Feil. Grunnprinsippene er tiltak, ikke et styringssystem slik 27001 beskriver.</p>",
        "<p>Feil. De er anbefalinger, ikke påbudt.</p>"
      ]
    },
    avvik: null,
    losning: ["NSMs grunnprinsipper ≈ ISO 27002 (tiltak), ikke 27001 (ISMS).", "Anbefalt for alle norske virksomheter, ikke påbudt.", "Bruker ordet «styringssystem for informasjonssikkerhet» om ISMS."],
    tips: ["2026-versjonen: 4 kategorier, 21 grunnprinsipper og 118 tiltak.", "Arket skriver «Informastion», skrivefeil i originalen."]
  });
  hv("H2020-6.2",
    "<p>NSMs grunnprinsipper er en norsk sjekkliste med gode råd for å beskytte datasystemer. Alle kan bruke den, men ingen er tvunget.</p>",
    "<p>NSMs grunnprinsipper for IKT-sikkerhet er en norsk tiltaksbank, omtrent som ISO 27002. De passer for alle norske virksomheter, men er anbefalinger og ikke påbudt. De er ikke et styringssystem som ISO 27001, og de måler ikke effekten av tiltak. NSM oversetter ISMS med «styringssystem for informasjonssikkerhet».</p>",
    "<p>Grunnprinsippene er ordnet etter sikkerhetsfunksjoner (identifisere og kartlegge, beskytte og opprettholde, oppdage, håndtere og gjenopprette), slik NIST CSF også er det. Hvert prinsipp har konkrete tiltak. Et styringssystem (ISMS) er rammen rundt: hvordan ledelsen velger, følger opp og forbedrer tiltakene. Derfor hører grunnprinsippene sammen med 27002, ikke 27001.</p>");

  O.push({
    key: "H2020-6.3", year: Y, oppgave_nr: "Oppgave 6.3", del: D6,
    ark: "6.3 Sikkerhetskultur", title: "Svakheter i sikkerhetskulturen og tiltak (fritekst)",
    points: 4, block: "angrep", tema: ["sikkerhetskultur", "phishing", "avviksrapportering", "opplæring"],
    ordrett: true,
    oppgave: "<p>Tenk deg følgende scenario:</p><p><em>Din bedrift er i en sektor som typisk er utsatt for IT-sikkerhetstrusler. Policyer for informasjonssikkerhet fins, men ledelsen har ikke informert ansatte om disse. På pub etter jobben enn dag nevner en kollega at han av og til klikker på lenker og åpner vedlegg i phishing-eposter for moro skyld. Du syns det er dumt å gjøre, men sier intet fordi du ikke ville kritisere ham. Din kollegas holdning til phishing-eposter gjør det urolig, så dagen etter snakker du med IT-drift om hva man bør gjøre hvis man blir lurt av phishing epost. Du får til svar at man bare bør slette phishing-eposter, og at man gjerne kan ta kontakt hvis man tror man er blitt lurt og det faktisk har skjedd noe.</em></p><p>Beskriv kort 4 relevante svakheter ved sikkerhetskulturen, og relevante tiltak eller endringer som burde innføres for å bedre sikkerhetskulturen vedrørende disse svakhetene.</p><p><em>Poeng: 0,5 for hver relevante svakhet og 0.5 for hvert relevante tiltak eller hver relevante endring. Maks 4 poeng, minimum 0.</em></p><p><strong>Skriv ditt svar her</strong></p>",
    inspera: {
      type: "E",
      regelTekst: "Poeng: 0,5 for hver relevante svakhet og 0.5 for hvert relevante tiltak eller hver relevante endring. Maks 4 poeng, minimum 0.",
      regel: { riktig: 4, feil: 0, blankt: 0, min: 0, maks: 4 },
      regelMerknad: "Manuell retting: fire svakheter à 0,5 og fire tiltak à 0,5.",
      deler: [
        { del: "Svar", poeng: 4, sporsmal: "<p>Beskriv kort 4 relevante svakheter ved sikkerhetskulturen, og relevante tiltak eller endringer som burde innføres for å bedre sikkerhetskulturen vedrørende disse svakhetene.</p>", grense: "fire par svakhet → tiltak, én linje hver" }
      ]
    },
    avvik: null,
    losning: [
      "Les scenarioet setning for setning og finn én svakhet per aktør: ledelsen, kollegaen, deg selv og IT-drift.",
      "Gi hver svakhet et tiltak som retter nettopp den (par svakhet → tiltak).",
      "Ledelsen informerer ikke → ledelsen må vise at sikkerhet er viktig og informere om policyene.",
      "Kollegaen klikker for moro skyld → opplæring i risiko og i at det er et sikkerhetsavvik.",
      "Du sier ikke fra → kultur der man sier fra til hverandre.",
      "IT-drift vil bare høre om det når noe har skjedd → ordning for avviksrapportering der ingen er redd for å melde."
    ],
    tips: [
      "Sikkerhetskultur som fritekst har ingen egen forelesning i 2026, men pentestlysarket nevner kultur og opplæring som forsvar mot sosial manipulering, og at folk ikke skal være redde for å si fra.",
      "Arket skriver «enn dag» og «gjør det urolig», skrivefeil i originalen."
    ]
  });
  IN.PERFEKT["H2020-6.3"] = {
    type: "skjonn",
    svar: [
      { del: "Svar", tekst: "<ol><li><b>Svakhet:</b> Ledelsen har ikke fortalt de ansatte om sikkerhetspolicyene. <b>Tiltak:</b> Ledelsen informerer om policyene og viser selv at sikkerhet er viktig.</li><li><b>Svakhet:</b> Kollegaen skjønner ikke risikoen ved å klikke på lenker og vedlegg i phishing-e-post, eller at det er et sikkerhetsavvik. <b>Tiltak:</b> Opplæring i phishing og i hva som er et avvik.</li><li><b>Svakhet:</b> Du sier ikke fra til kollegaen. <b>Tiltak:</b> Bygge en kultur der det er normalt å si fra til hverandre om sikkerhetsfeil.</li><li><b>Svakhet:</b> IT-drift vil bare ha beskjed når noe faktisk har skjedd, så forsøk og klikk blir ikke meldt. <b>Tiltak:</b> Innføre en ordning for avviksrapportering der alle klikk meldes, uten at noen blir straffet for å melde.</li></ol>", poeng: ["Fire relevante svakheter (4 × 0,5p)", "Fire relevante tiltak eller endringer (4 × 0,5p)"] }
    ],
    sensor: {
      deler: [
        { del: "Svar", fasit: "<p>Svarforslag til oppgave 6.3.</p><p>Relevante svakheter ved sikkerhetskulturen</p><ul><li>Ledelsen sørger ikke for ansatte er oppmerksomme på sikkerhetspolicyene.</li><li>Kollegaen forstår ikke risikoen ved å klikke på lenker og åpne vedlegg i phishing eposter.</li><li>Kollegaen forstår ikke at det faktisk er et sikkerhetsavvik å klikke på lenker og åpne vedlegg i phishing eposter.</li><li>Du forstår ikke at det er viktig å påpeke svakheter i sikkerhetskulturen hos kollegaer.</li><li>Kollegaene forstår ikke risikoen ved å diskutere digital sikkerhet for virksomheten på pub</li></ul><p>Tiltak for forbedring er:</p><ul><li>Ledelsen må vise at informasjonssikkerhet er viktig</li><li>Ansatte må bli informert om sikkerhetspolicyer.</li><li>Ansatte må få opplæring i sikkerhetskultur.</li><li>Ansatte må si fra til hverandre når de gjør sikkerhetsfeil.</li><li>Det må innføres en ordning for avviksrapportering.</li><li>Ansatte må ikke være redd for avviksrapportering.</li></ul>", kriterier: "<p>Poeng: 0,5 for hver relevante svakhet og 0.5 for hvert relevante tiltak eller hver relevante endring. Maks 4 poeng, minimum 0.</p>" }
      ],
      merknad: "Svarforslaget står i qa-fila s. 20, etter overskriften «Del 7: Risikostyring». Kriteriene er poenglinja i oppgaven. Svarforslaget har fem svakheter og seks tiltak å velge blant. Det nevner ikke svaret fra IT-drift direkte; i vårt svar er det knyttet til tiltaket om avviksrapportering."
    }
  };
  hv("H2020-6.3",
    "<p>I et fotballag vet ingen hva treneren har bestemt, én spiller tuller med ballen i eget mål, de andre tør ikke si noe, og keeperen vil bare høre om det når det har blitt mål. Laget må snakke sammen og si fra tidlig.</p>",
    "<p>Sikkerhetskultur handler om holdninger og vaner. Her svikter flere: ledelsen informerer ikke om policyene, kollegaen skjønner ikke risikoen ved phishing, du sier ikke fra, og IT-drift vil bare ha beskjed når skaden har skjedd. Tiltakene er tydelig ledelse, informasjon og opplæring, en kultur der man sier fra, og en enkel avviksrapportering uten straff.</p>",
    "<p>Menneskelige svakheter kan bare delvis dekkes av teknikk. Phishing lykkes når de ansatte ikke kjenner risikoen og ikke melder fra. Tidlig melding er avgjørende: et klikk som meldes med en gang, kan stoppes før skadevaren sprer seg, mens et klikk som skjules, blir oppdaget sent. Derfor må rapportering være enkel og trygg, og ledelsen må vise at sikkerhet prioriteres. Ellers følger ingen policyene, uansett hvor gode de er på papiret.</p>");

  /* ============================ DEL 7: RISIKOSTYRING ============================ */

  O.push({
    key: "H2020-7.1", year: Y, oppgave_nr: "Oppgave 7.1", del: D7,
    ark: "7.1 Beslutningspunkter i risikostyring", title: "Beslutningspunkt 1 og 2: grunn til «Nei» og forbedring (fritekst)",
    points: 4, block: "risiko", tema: ["risikostyring", "beslutningspunkt", "risikovurdering", "risikobehandlingsplan"],
    gjenganger: ["H2022-10.2", "H2024-33"],
    ordrett: true,
    oppgave: "<p>Figuren for risikostyring viser to beslutningspunkter.</p><p><strong>Beslutningspunkt 1:</strong></p><ul><li>Nevn en relevant grunn til å svare \"Nei\" på beslutningspunkt 1.</li><li>Nevn en relevant endring/forbedring som gjør at man kan svare \"Ja\".</li></ul><p><strong>Beslutningspunkt 2:</strong></p><ul><li>Nevn en relevant grunn til å svare \"Nei\" på beslutningspunkt 2.</li><li>Nevn en relevant endring/forbedring som gjør at man kan svare \"Ja\".</li></ul><p><em>Poeng: 1 poeng for relevant grunn og 1 poeng for relevant endring/forbedring under hvert beslutningspunkt. Maks 4 poeng, minimum 0.</em></p><p><strong>Skriv ditt svar her</strong></p>",
    figur: {
      beskrivelse: "Flytdiagram. Øverst en boks «Risikostyring», så en blå stiplet ramme rundt prosessen. Inne i rammen, ovenfra og ned: grønn boks «Planlegging», avrundet boks «Risikovurdering», en grønn rombe med «Nei» til venstre (pil tilbake til «Planlegging») og «Ja» nedover, med teksten «Beslutningspunkt 1: Er vurdering akseptabel?» til høyre. Så boksen «Risikobehandlingssplan» (sic), en ny rombe med «Nei» (pil tilbake til «Planlegging») og «Ja», og teksten «Beslutningspunkt 2: Er behandlingsplan akseptabel?». Nederst i rammen boksen «Akseptert gjenværende risiko». Under rammen boksen «Gjennomfør risikobehandlingsplan».",
      tekst: ["Risikostyring", "Planlegging", "Risikovurdering", "Nei", "Ja", "Beslutningspunkt 1:", "Er vurdering akseptabel?", "Risikobehandlingssplan", "Beslutningspunkt 2:", "Er behandlingsplan akseptabel?", "Akseptert gjenværende risiko", "Gjennomfør risikobehandlingsplan"]
    },
    inspera: {
      type: "E",
      regelTekst: "Poeng: 1 poeng for relevant grunn og 1 poeng for relevant endring/forbedring under hvert beslutningspunkt. Maks 4 poeng, minimum 0.",
      regel: { riktig: 4, feil: 0, blankt: 0, min: 0, maks: 4 },
      regelMerknad: "Manuell retting: 1 for grunn og 1 for forbedring per beslutningspunkt.",
      deler: [
        { del: "Beslutningspunkt 1", poeng: 2, sporsmal: "<p>Nevn en relevant grunn til å svare \"Nei\" på beslutningspunkt 1. Nevn en relevant endring/forbedring som gjør at man kan svare \"Ja\".</p>", grense: "to korte setninger" },
        { del: "Beslutningspunkt 2", poeng: 2, sporsmal: "<p>Nevn en relevant grunn til å svare \"Nei\" på beslutningspunkt 2. Nevn en relevant endring/forbedring som gjør at man kan svare \"Ja\".</p>", grense: "to korte setninger" }
      ]
    },
    avvik: null,
    losning: [
      "Beslutningspunkt 1 gjelder kvaliteten på risikovurderingen: er den god nok til å bygge på?",
      "Nei fordi risikonivåene er dårlig spredt eller det er stor usikkerhet om høye risikoer → rekalibrere skalaene eller vurdere de usikre risikoene grundigere.",
      "Beslutningspunkt 2 gjelder behandlingsplanen: kan vi leve med den?",
      "Nei fordi tiltakene koster mer enn budsjettet, eller for mange eller for få risikoer er akseptable → endre budsjett eller tiltak, eller justere akseptgrensen."
    ],
    tips: ["Par alltid grunn og forbedring: forbedringen skal rette akkurat den grunnen du nevnte.", "Svarforslaget kaller punkt 1 «Er risikovurderingen tilfredsstillende», mens figuren sier «Er vurdering akseptabel?». Samme spørsmål."]
  });
  IN.PERFEKT["H2020-7.1"] = {
    type: "skjonn",
    svar: [
      { del: "Beslutningspunkt 1", tekst: "<p><b>Grunn til «Nei»:</b> Det er stor usikkerhet om én eller flere av de høye risikoene, så vi vet ikke om de er riktig vurdert.<br><b>Forbedring:</b> Vurdere disse risikoene grundigere (mer informasjon, flere fagfolk) før man går videre.</p>", poeng: ["Relevant grunn (1p)", "Relevant forbedring (1p)"] },
      { del: "Beslutningspunkt 2", tekst: "<p><b>Grunn til «Nei»:</b> De foreslåtte tiltakene koster mer enn budsjettet tillater.<br><b>Forbedring:</b> Øke budsjettet eller velge færre eller billigere tiltak.</p>", poeng: ["Relevant grunn (1p)", "Relevant forbedring (1p)"] }
    ],
    sensor: {
      deler: [
        { del: "Beslutningspunkt 1", fasit: "<p>Beslutningspunkt 1: Er risikovurderingen tilfredsstillende. Grunner for å svare \"Nei\":</p><ul><li>Relativt dårlig spredning av risikonivåer. Dette kan forbedres med rekalibrering av sannsynlighet eller konsekvensnivåer.</li><li>Det hersker fremdeles stor uvisshet rundt en eller flere høye risikoer.<br>Dette kan forbedres ved å gjøre en mer grundig vurdering av disse risikoene.</li></ul>", kriterier: "<p>Poeng: 1 poeng for relevant grunn og 1 poeng for relevant endring/forbedring under hvert beslutningspunkt. Maks 4 poeng, minimum 0.</p>" },
        { del: "Beslutningspunkt 2", fasit: "<p>Beslutningspunkt 2: Er behandlingsplanen akseptabel. Grunner for å svare \"Nei\":</p><ul><li>Utilstrekkelig budsjett til foreslåtte tiltak. Kan forbedres ved å øke budsjettet eller redusere tiltak.</li><li>For mange risikoer som ikke er akseptable. Dette kan forbedres ved å heve nivået for akseptabel risiko.</li><li>For mange risikoer som er akseptable. Dette kan forbedres ved å senke nivået for akseptabel risiko.</li></ul>", kriterier: "<p>Poeng: 1 poeng for relevant grunn og 1 poeng for relevant endring/forbedring under hvert beslutningspunkt. Maks 4 poeng, minimum 0.</p>" }
      ],
      merknad: "«Svarforslag for oppgave 7.1» står i qa-fila s. 21. Kriteriene er poenglinja i oppgaven."
    }
  };
  hv("H2020-7.1",
    "<p>Før du drar på tur, sjekker du først om værmeldingen er til å stole på. Er den ikke det, sjekker du på nytt. Så lager du en pakkeliste. Blir lista for dyr eller for tung, endrer du den før du drar.</p>",
    "<p>Beslutningspunkt 1 spør om risikovurderingen er god nok. Nei kan skyldes at nesten alle risikoene fikk samme nivå, eller at man er usikker på de høye risikoene. Da justerer man skalaene eller vurderer på nytt. Beslutningspunkt 2 spør om behandlingsplanen er akseptabel. Nei kan skyldes at tiltakene er for dyre, eller at akseptgrensen er satt feil. Da endrer man budsjett, tiltak eller grense.</p>",
    "<p>Risikostyringsprosessen (som i ISO 27005) har to kontrollpunkter med tilbakekobling. Det første sikrer at vurderingen skiller godt mellom risikoer og at usikkerheten om de viktigste er lav nok til å prioritere tiltak. Det andre sikrer at planen er gjennomførbar (kostnad mot budsjett) og at den gjenværende risikoen er akseptabel for ledelsen. Akseptgrensen er et ledelsesvalg: er den for streng, blir planen for dyr. Er den for slapp, blir for mye risiko stående. Begge «Nei» sender prosessen tilbake til planleggingen.</p>");

  O.push({
    key: "H2020-7.2", year: Y, oppgave_nr: "Oppgave 7.2", del: D7,
    ark: "7.2 Trusselmodellering", title: "Trusselscenario før og under eksamen (fritekst)",
    points: 6, block: "risiko", tema: ["trusselmodellering", "trusselscenario", "konsekvens", "KIT"],
    ordrett: true,
    oppgave: "<p>Anta situasjonen med online eksamen, som vist på figuren. der vi fokuserer på sikkerhet for selve eksamensoppgavene (som er verdi/ressurs/asset).</p><ol><li>Beskriv kort en relevant trussel mot <strong>ett av</strong> de tre generelle sikkerhetsmålene X,Y eller Z <strong>før</strong> eksamen starter, og en relevant konsekvens. Skriv f.eks. <em>\"Angriper kan gjøre Scenario A som fører til brudd på X før eksamen. En konsekvens vil være K\"</em>. Du må erstatte \"Scenario A\" med en kort beskrivelse av hva angriperen gjør (uten detaljer, maks 10 ord), erstatte \"X\" med navnet på sikkerhetsmålet, og erstatte \"K\" med en kort beskrivelse av relevant konsekvens (maks 10 ord).</li><li>Beskriv kort en relevant trussel mot <strong>ett av</strong> de tre generelle sikkerhetsmålene X,Y eller Z <strong>under</strong> eksamen, og en relevant konsekvens. Skriv f.eks. <em>\"Angriper kan gjøre Scenario B som fører til brudd på Y under eksamen. En konsekvens vil være L\"</em>. Du må erstatte \"Scenario B\" med en kort beskrivelse av hva angriperen gjør (uten detaljer, maks 10 ord), erstatte \"Y\" med navnet på sikkerhetsmålet, og erstatte \"L\" med en kort beskrivelse av relevant konsekvens (maks 10 ord).</li></ol><p><em>For begge situasjoner (før og under eksamen) gis 1 poeng for et fornuftig trusselscenario, 1 poeng for relevant sikkerhetsmål, 1 poeng for en relevant konsekvens, maks 6 poeng, minimum 0.</em></p><p><strong>Skriv ditt svar her</strong></p>",
    figur: FIG_EKSAMEN,
    inspera: {
      type: "E",
      regelTekst: "For begge situasjoner (før og under eksamen) gis 1 poeng for et fornuftig trusselscenario, 1 poeng for relevant sikkerhetsmål, 1 poeng for en relevant konsekvens, maks 6 poeng, minimum 0.",
      regel: { riktig: 6, feil: 0, blankt: 0, min: 0, maks: 6 },
      regelMerknad: "Manuell retting: scenario, sikkerhetsmål og konsekvens gir 1 poeng hver, både før og under eksamen.",
      deler: [
        { del: "1.", poeng: 3, sporsmal: "<p>En relevant trussel mot ett av sikkerhetsmålene <strong>før</strong> eksamen starter, og en relevant konsekvens.</p>", grense: "én setning etter malen, maks 10 ord per del" },
        { del: "2.", poeng: 3, sporsmal: "<p>En relevant trussel mot ett av sikkerhetsmålene <strong>under</strong> eksamen, og en relevant konsekvens.</p>", grense: "én setning etter malen, maks 10 ord per del" }
      ]
    },
    avvik: null,
    losning: [
      "Bruk malen fra oppgaven ordrett, og fyll inn tre ting: hva angriperen gjør, hvilket mål som brytes, og hva konsekvensen blir.",
      "Før eksamen: tenk konfidensialitet (oppgavene lekker).",
      "Under eksamen: tenk tilgjengelighet (plattformen går ned).",
      "Hold deg under 10 ord per del. Detaljer gir ikke ekstra poeng."
    ],
    tips: ["Sammenhengen med 1.1 er nyttig: målet som er viktigst i en fase, gir det mest naturlige trusselscenarioet.", "Andre fornuftige scenarioer godtas, for eksempel at noen endrer oppgavene (integritet)."]
  });
  IN.PERFEKT["H2020-7.2"] = {
    type: "skjonn",
    svar: [
      { del: "1.", tekst: "<p>Angriper kan stjele foreleserens innloggingsdetaljer og lese oppgavene, som fører til brudd på konfidensialitet før eksamen. En konsekvens vil være at noen jukser og at eksamen må lages på nytt.</p>", poeng: ["Fornuftig trusselscenario (1p)", "Relevant sikkerhetsmål: konfidensialitet (1p)", "Relevant konsekvens (1p)"] },
      { del: "2.", tekst: "<p>Angriper kan overbelaste eksamensplattformen med et DDoS-angrep, som fører til brudd på tilgjengelighet under eksamen. En konsekvens vil være at studentene ikke får levert og eksamen må holdes på nytt.</p>", poeng: ["Fornuftig trusselscenario (1p)", "Relevant sikkerhetsmål: tilgjengelighet (1p)", "Relevant konsekvens (1p)"] }
    ],
    sensor: {
      deler: [
        { del: "1.", fasit: "<p>1) Angriper kan stjele foreleserens passord og få tilgang til eksamensspøsrmålene før eksamen, som medfører brudd på konfidensialitet. Konsekvensen er juks, som kan anses som skade på rettssikkerheten. Om bruddet blir kjent vil det skade universitetets omdømme. Andre fornuftige scenarioer er også OK.</p>", kriterier: "<p>For begge situasjoner (før og under eksamen) gis 1 poeng for et fornuftig trusselscenario, 1 poeng for relevant sikkerhetsmål, 1 poeng for en relevant konsekvens, maks 6 poeng, minimum 0.</p>" },
        { del: "2.", fasit: "<p>2) Angriper kan kjøre et DDoS angrep mot Inspera under eksamen, slik at ingen får tilgang til eksamen, som vil medføre brudd på tilgjengelighet. Konsekvensen kan anses som brudd på studentenes rettssikkerhet, og vil medføre kostnader med ny organisering av eksamen. Andre fornuftige scenarioer er også OK.</p>", kriterier: "<p>For begge situasjoner (før og under eksamen) gis 1 poeng for et fornuftig trusselscenario, 1 poeng for relevant sikkerhetsmål, 1 poeng for en relevant konsekvens, maks 6 poeng, minimum 0.</p>" }
      ],
      merknad: "«Svarforslag for oppgave 7.2» står i qa-fila s. 22, etter overskriften «Del 8». «eksamensspøsrmålene» er en skrivefeil i originalen, gjengitt ordrett."
    }
  };
  hv("H2020-7.2",
    "<p>Før prøven kan noen snike seg til å se prøvearket. Da er det ikke rettferdig. Under prøven kan noen låse døra til klasserommet. Da får ingen skrevet prøven.</p>",
    "<p>Et trusselscenario sier hva en angriper gjør, hvilket sikkerhetsmål som brytes, og hva konsekvensen blir. Før eksamen er det naturlig å tenke på lekkasje av oppgavene (konfidensialitet), som gir juks. Under eksamen er det naturlig å tenke på at plattformen slås ut (tilgjengelighet), slik at studentene ikke får gjennomført.</p>",
    "<p>Trusselmodellering kobler en trusselaktør og en handling til en verdi og et brutt KIT-mål, og vurderer konsekvensen for virksomheten. Her er verdien eksamensoppgavene. Konsekvensene går ut over selve dataene: juks og en avlyst eksamen rammer rettssikkerheten til studentene, koster penger å rette opp og skader omdømmet. Det er konsekvenser for virksomheten man vurderer i risikoanalysen, ikke bare det tekniske bruddet.</p>");

  /* ======================== DEL 8: IDENTITETS- OG TILGANGSHÅNDTERING ======================== */

  O.push({
    key: "H2020-8.1", year: Y, oppgave_nr: "Oppgave 8.1", del: D8,
    ark: "8.1 Autorisering", title: "Hva er tilgangsautorisering?",
    points: 1, block: "iam", tema: ["autorisering", "tilgangskontroll", "IAM"],
    ordrett: true,
    oppgave: "<p>Hva er tilgangsautorisering?<br><em>Poeng: 1 for riktig, 0 for feil, 0 for intet valg, maks 1, minimum 0.</em></p><p><strong>Velg ett alternativ:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Poeng: 1 for riktig, 0 for feil, 0 for intet valg, maks 1, minimum 0.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: ["Brukeren autentiserer seg.", "Systemet gir tilgang til ressurs ved forespørsel fra brukeren.", "Brukeren mottar autentifikator.", "Brukerens tilgangsrettigheter spesifiseres."],
      svar: 3,
      explain: [
        "<p>Feil. Det er autentisering, et steg i bruksfasen.</p>",
        "<p>Feil, og den vanligste fellen. Å gi eller nekte tilgang ved en forespørsel er tilgangskontroll, altså å håndheve policyen.</p>",
        "<p>Feil. Det er klargjøring av autentikator i konfigureringsfasen.</p>",
        "<p>Riktig. Autorisering er å bestemme og spesifisere hva brukeren skal få lov til, og det gjøres på forhånd.</p>"
      ]
    },
    avvik: null,
    losning: ["Autorisering = spesifisere rettigheter (konfigureringsfasen).", "Tilgangskontroll = håndheve dem ved forespørsel (bruksfasen)."],
    tips: ["I dagligtale brukes «autorisering» ofte om at systemet slipper deg inn. Kurset bruker det strengere skillet, og det er det som gir poeng."]
  });
  hv("H2020-8.1",
    "<p>Autorisering er når foreldrene skriver en liste over hvilke rom barnevakten får gå inn i. Tilgangskontroll er når døra faktisk sjekker lista hver gang barnevakten prøver å gå inn.</p>",
    "<p>Autorisering betyr å spesifisere hvilke rettigheter en bruker skal ha. Det gjøres i konfigureringsfasen av noen med myndighet. Når brukeren senere ber om en ressurs, sjekker tilgangskontrollen forespørselen mot rettighetene. Det er bruksfasen.</p>",
    "<p>Skillet følger ISO-terminologien som kurset bruker. Policyen administreres et sted (PAP), avgjørelser tas mot den (PDP) og håndheves ved ressursen (PEP). Autorisering hører til administrasjonen av policyen, mens avgjørelse og håndheving ved forespørsel er tilgangskontroll. Å kalle håndhevingen «autorisering» blander de to fasene.</p>");

  O.push({
    key: "H2020-8.2", year: Y, oppgave_nr: "Oppgave 8.2", del: D8,
    ark: "8.2 Identitetshåndtering", title: "Identitet, domener og føderering: korrekt eller feil",
    points: 3, block: "iam", tema: ["identitet", "identitetsdomene", "silo", "føderering"],
    gjenganger: ["H2022-9.1", "H2023-34"],
    ordrett: true,
    oppgave: "<p>Si om utsagnene om identitetshåndtering er korrekt eller feil.<br><em>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</em></p><p><strong>Velg korrekt eller feil for hvert utsagn:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: R05,
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Korrekt", "Feil"],
      multi: false,
      rader: [
        { s: "Fødererte IAM-arkitekturer har alltid distribuert autentisering.", svar: [1], explain: "<p>Ikke alltid. I mange føderasjoner gjøres autentiseringen sentralt hos én identitetstilbyder. <strong>Feil</strong>.</p>" },
        { s: "Silo-domener kan bare ha 1-faktorautentisering.", svar: [1], explain: "<p>En silo kan bruke så mange faktorer den vil. Arkitekturen sier ingenting om antall faktorer. <strong>Feil</strong>.</p>" },
        { s: "Identitet er et sett med attributter.", svar: [0], explain: "<p>Kursets definisjon: en identitet er et sett attributter om en entitet innenfor et domene. <strong>Korrekt</strong>.</p>" },
        { s: "Identitetsdomene er et sett med attributter.", svar: [1], explain: "<p>Et domene er området der identitetene gjelder og identifikatorene er unike, ikke selve attributtene. <strong>Feil</strong>.</p>" },
        { s: "Fødererte IAM-arkitekturer har alltid distribuerte identitetsdomener.", svar: [1], explain: "<p>Ikke alltid. Det finnes føderasjoner med ett sentralt identitetsdomene som mange tjenester stoler på. <strong>Feil</strong>.</p>" },
        { s: "En bruker kan ha forskjellige identiteter i forskjellige domener.", svar: [0], explain: "<p>Samme person kan være student i ett domene og kunde i et annet, med ulike attributter. <strong>Korrekt</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Identitet = sett attributter. Domene = der identitetene gjelder.", "En person kan ha mange identiteter i mange domener.", "Utsagn med «alltid» og «bare» om silo og føderering er feil."],
    tips: ["Ord som «alltid» og «bare» er nesten alltid feil i slike påstander om arkitekturer.", "Eksempel fra eldre sett: ID-porten har sentralisert identitet og distribuert autentisering."]
  });
  hv("H2020-8.2",
    "<p>Du er «Ola, elev i 9B» på skolen og «Ola, keeper» på fotballaget. Det er to identiteter i to ulike klubber, men du er den samme personen.</p>",
    "<p>En identitet er et sett attributter om en entitet i et domene. Domenet er området der identitetene gjelder. En person kan derfor ha flere identiteter i flere domener. Føderering betyr at tjenester stoler på identiteter fra en annen part, men det sier ikke at autentisering eller identitetsdomener alltid er spredt. En silo kan bruke flerfaktor.</p>",
    "<p>Fødererte arkitekturer kan kombinere sentral eller distribuert identitet med sentral eller distribuert autentisering. Et eksempel er en nasjonal innloggingsløsning der én tilbyder har identitetsregisteret mens flere eID-leverandører autentiserer. Derfor er «alltid»-påstandene feil. Antall faktorer er en egenskap ved autentiseringsmetoden, ikke ved om arkitekturen er silo eller føderert.</p>");

  O.push({
    key: "H2020-8.3", year: Y, oppgave_nr: "Oppgave 8.3", del: D8,
    ark: "8.3 Fordeler ved silo/føderert IAM", title: "Fordel ved silo, føderert, like gode eller irrelevant?",
    points: 3, block: "iam", tema: ["silo", "føderering", "SP", "personvern", "brukervennlighet"],
    gjenganger: ["H2021-7.1"],
    ordrett: true,
    oppgave: "<p>For hvert fordel, angi om det er en fordel ved Silo-IAM, fordel ved Føderert IAM, fordel ved Begge, eller Ingen fordel for noen (hverken ved Silo-IAM eller Føderert IAM).<br><em>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</em></p><p><strong>Velg riktig alternativ om fordel ved IAM-arkitekturer:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: R05,
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Fordel ved Silo-IAM", "Irrelevant", "Like gode", "Fordel ved Føderert IAM"],
      multi: false,
      rader: [
        { s: "Enkelt for SP (tjenstetilbyder) å håndtere identiteter.", svar: [3], explain: "<p>I en føderasjon tar identitetstilbyderen seg av identitetene, så tjenestetilbyderen slipper: <strong>Fordel ved Føderert IAM</strong>.</p>" },
        { s: "Kan bruke 2-faktorautentisering.", svar: [2], explain: "<p>Begge arkitekturene kan bruke flerfaktor: <strong>Like gode</strong>.</p>" },
        { s: "Enkelt for SP (tjenstetilbyder) å sette opp IAM-løsning.", svar: [0], explain: "<p>En silo trenger ingen avtaler eller tillitsforhold med andre parter. Tjenestetilbyderen lager alt selv: <strong>Fordel ved Silo-IAM</strong>.</p>" },
        { s: "Personvern ved at SPer (tjenestetilbydere) vanskelig kan dele data om brukere.", svar: [0], explain: "<p>I siloer har brukeren ulike identiteter hos hver tjeneste, så det er vanskelig å koble data: <strong>Fordel ved Silo-IAM</strong>.</p>" },
        { s: "Kan benyttes som digital signatur.", svar: [1], explain: "<p>Signatur er en kryptografisk mekanisme og har ingenting med valget av IAM-arkitektur å gjøre: <strong>Irrelevant</strong>.</p>" },
        { s: "God brukervennlighet.", svar: [3], explain: "<p>Med føderering logger brukeren inn med én identitet og slipper mange passord: <strong>Fordel ved Føderert IAM</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Silo: enkelt å sette opp, bedre personvern (ingen felles identifikator).", "Føderert: SP slipper å håndtere identiteter, bedre brukervennlighet.", "Flerfaktor: begge. Signatur: irrelevant."],
    tips: ["Skill mellom å <em>sette opp</em> løsningen (enklest i silo) og å <em>håndtere identitetene</em> over tid (enklest i føderasjon).", "Arket skriver «For hvert fordel» og «tjenstetilbyder», skrivefeil i originalen."]
  });
  hv("H2020-8.3",
    "<p>Silo er som at hver butikk har sitt eget kundekort: lett for butikken å lage, og butikkene vet ikke om hverandre. Føderert er som å vise samme bankkort overalt: enkelt for deg, og butikkene slipper å lage egne kort.</p>",
    "<p>I en silo har hver tjeneste sin egen brukerdatabase. Det er enkelt å sette opp og gir godt personvern, fordi tjenestene ikke deler identitet. I en føderasjon stoler tjenestene på en felles identitetstilbyder. Det gir én innlogging for brukeren og mindre identitetsarbeid for tjenestene. Flerfaktor går i begge, og digital signatur har ingenting med arkitekturen å gjøre.</p>",
    "<p>Siloen krever ingen tillitsavtaler, men hver SP må registrere brukere, lagre autentikatorer og håndtere tilbakestilling selv, og brukeren får mange passord. Føderering flytter dette til identitetstilbyderen, men krever avtaler og protokoller (SAML, OIDC), og en felles identifikator gjør det lettere å koble data på tvers av tjenester. Garantinivået for autentiseringen (for eksempel flerfaktor) kan være like høyt i begge.</p>");

  O.push({
    key: "H2020-8.4", year: Y, oppgave_nr: "Oppgave 8.4", del: D8,
    ark: "8.4 MAC med ABAC", title: "MAC som ABAC: klarering, gradering og Bell-LaPadula",
    points: 3, block: "iam", tema: ["MAC", "ABAC", "klarering", "gradering", "Bell-LaPadula"],
    gjenganger: ["H2021-7.3", "H2022-9.3", "H2022-9.4"],
    ordrett: true,
    oppgave: "<p>MAC (Mandatory Access Control) kan implementeres som ABAC (Attribute-Based Access Control. Velg fra nedtrekksmenyene for å angi hvordan det kan gjøres.<br><em>Poeng: 1 for hver riktig, -1 for hver feil, 0 for intet valg, maks 3, minimum 0.</em></p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng: 1 for hver riktig, -1 for hver feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      tekst: "<p>Spesifiser subjekt-attributt som {0}</p><p>Spesifiser objekt-attributt som {1}</p><p>Spesifiser policy som {2}</p>",
      felt: [
        { etikett: "Subjekt-attributt", valg: ["Sikkerhetsklarering", "Navn", "ACL (Access Control List)", "Rolle"], svar: 0, godta: [], explain: "<p>I MAC har hver bruker (subjekt) et merke som sier hvor hemmelig informasjon hen er klarert for: <strong>Sikkerhetsklarering</strong>.</p>" },
        { etikett: "Objekt-attributt", valg: ["\"No read up\" (ikke les oppover)", "Sikkerhetsgradering (klassifiseringsnivå)", "Attributtlabel", "\"No write down\" (ikke skriv nedover)"], svar: 1, godta: [], explain: "<p>Hvert dokument (objekt) har et merke for hvor hemmelig det er: <strong>Sikkerhetsgradering (klassifiseringsnivå)</strong>. «No read up» og «No write down» er regler i policyen, ikke attributter.</p>" },
        { etikett: "Policy", valg: ["Silo-Modell", "Føderert modell", "Bell-LaPadula modell", "DAC-modell"], svar: 2, godta: [], explain: "<p>Regelen som sammenligner klarering og gradering er <strong>Bell-LaPadula modell</strong>: ikke les oppover, ikke skriv nedover.</p>" }
      ]
    },
    avvik: null,
    losning: ["Subjekt: klarering. Objekt: gradering. Policy: Bell-LaPadula.", "ABAC-regelen sammenligner de to attributtene etter BLP-reglene."],
    tips: ["Silo og føderert er IAM-arkitekturer, ikke tilgangspolicyer. DAC er motsatsen til MAC.", "Arket mangler en sluttparentes etter «(Attribute-Based Access Control», gjengitt ordrett."]
  });
  hv("H2020-8.4",
    "<p>Hver person har et adgangskort med en farge, og hvert rom har et skilt med en farge. En fast regel sier hvilke farger som passer sammen, og ingen kan endre regelen selv.</p>",
    "<p>MAC kan uttrykkes med ABAC ved å gi subjektet attributtet sikkerhetsklarering og objektet attributtet sikkerhetsgradering. Policyen er Bell-LaPadula: et subjekt kan ikke lese objekter med høyere gradering enn egen klarering, og kan ikke skrive til objekter med lavere gradering.</p>",
    "<p>ABAC er generell nok til å uttrykke de andre modellene, fordi en regel kan bruke hvilke attributter som helst. For MAC er attributtene klarering (subjekt) og gradering (objekt), med nivåer som BEGRENSET &lt; KONFIDENSIELT &lt; HEMMELIG &lt; STRENGT HEMMELIG. Bell-LaPadula har to regler: ss-egenskapen (ikke les opp) og ∗-egenskapen (ikke skriv ned). Sammen hindrer de at hemmelig informasjon flyter nedover, så modellen beskytter konfidensialitet.</p>");

  /* ============================ DEL 9: HENDELSESRESPONS ============================ */

  O.push({
    key: "H2020-9.1", year: Y, oppgave_nr: "Oppgave 9.1", del: D9,
    ark: "9.1 Aspekter ved hendelsesrespons", title: "Hva er hendelsesrespons?",
    points: 2, block: "risiko", tema: ["hendelsesrespons", "konsekvensreduksjon"],
    ordrett: true,
    oppgave: "<p>Angi hvilke utsagn om <strong>hendelsesrespons</strong> som er korrekt.<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 2, minimum 0.</em></p><p><strong>Velg to alternativer:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Velg to alternativer.",
      alternativer: [
        "Ettersom hendelsesrespons reagerer på uventede hendelser, kan det ikke planlegges.",
        "Hendelsesrespons er en proaktiv prosess som skal forhindre hendelser.",
        "Hendelsesrespons skal redusere negative konsekvenser av en hendelse.",
        "Hendelsesrespons er en reaksjon på uventede hendelser."
      ],
      svar: [2, 3],
      explain: [
        "<p>Feil. Nettopp fordi hendelsene er uventede, må responsen planlegges og øves på forhånd.</p>",
        "<p>Feil. Å forhindre hendelser er forebyggende sikkerhet. Respons skjer etter at noe har skjedd.</p>",
        "<p>Riktig. Målet er å begrense skaden og komme raskt tilbake til normal drift.</p>",
        "<p>Riktig. Responsen settes i gang når en hendelse inntreffer.</p>"
      ]
    },
    avvik: "Lite i pensum H2026: hendelsesrespons nevnes bare kort i 2026-kildene og har ingen egen forelesning.",
    losning: ["Hendelsesrespons er reaktiv (etter hendelsen) og skal begrense konsekvensene.", "Den må likevel planlegges på forhånd."],
    tips: ["Hendelsesrespons som eget tema med faser er ikke på 2026-lysarkene. Det nevnes bare kort.", "Samme påstander kom i 2019 (5.1)."]
  });
  hv("H2020-9.1",
    "<p>Et brannvesen kan ikke hindre at det begynner å brenne, men det øver på forhånd så det kan slokke raskt og redde mest mulig når brannen kommer.</p>",
    "<p>Hendelsesrespons er det man gjør når en sikkerhetshendelse har skjedd. Den er reaktiv og skal redusere skaden. Selv om man ikke vet når hendelsen kommer, må responsen planlegges og øves på forhånd. Å hindre hendelser er forebygging, ikke respons.</p>",
    "<p>Forebyggende, oppdagende og korrigerende tiltak utfyller hverandre. Hendelsesrespons er korrigerende: den starter når noe er oppdaget, og skal begrense konsekvensen og gjenopprette normal drift. En god plan sier hvem som gjør hva, hvem som skal varsles, og hvilke beslutninger som må tas raskt (for eksempel å koble maskiner fra nettet). Uten plan går dyrebar tid tapt.</p>");

  O.push({
    key: "H2020-9.2", year: Y, oppgave_nr: "Oppgave 9.2", del: D9,
    ark: "9.2 Trinn i hendelsesrespons", title: "Løsepengevirus: hvilken fase hører aktiviteten til?",
    points: 8, block: "risiko", tema: ["hendelsesrespons", "løsepengevirus", "skadebegrensning", "utryddelse", "gjenoppretting"],
    ordrett: true,
    oppgave: "<p>Anta casen fra workshopen: <em>\"Troll er blitt utsatt for et løsepengevirus, og ber om 100.000 $ i kryptovaluta\"</em>. Responsaktiviteter tilhører en av fasene som kan være: Sortering (Triage), Analyse, Skadebegrensning (Containment), Utryddelse (Eradication), Gjenoppretting (Restoring and Normalisation), eller Ingen av fasene.</p><p>Angi <strong>hvilken fase</strong> i hendelsesrespons hver aktivitet tilhører.<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 8, minimum 0.</em></p><p><strong>Velg korrekt fase for hver aktivitet:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 8, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 8, alleRiktig: 8 },
      regelMerknad: "Utskriften har åtte rader, men to av dem står uten tekst (fasit Sortering og Skadebegrensning). Øvingen viser de seks radene som har tekst. Alle seks riktig gir 8 poeng, så full pott er mulig. Den siste kolonnen mangler overskrift i utskriften. Oppgaveteksten sier at den er «Ingen av fasene».",
      kolonner: ["Sortering", "Analyse", "Skadebegrensning", "Utryddelse", "Gjenoppretting", "Ingen"],
      multi: false,
      rader: [
        { s: "Betaling av løsepenger.", svar: [5], explain: "<p>Å betale er ikke en del av noen fase i responsprosessen, og det gir ingen garanti for å få dataene tilbake: <strong>Ingen</strong>.</p>" },
        { s: "Koble infiserte computere fra nettverket.", svar: [2], explain: "<p>Å isolere de infiserte maskinene hindrer at viruset sprer seg videre: <strong>Skadebegrensning</strong>.</p>" },
        { s: "Slette harddisker på infiserte computere.", svar: [3], explain: "<p>Skadevaren fjernes helt ved å slette diskene: <strong>Utryddelse</strong>.</p>" },
        { s: "Ta rutinemessige sikkerhetskopier.", svar: [5], explain: "<p>Sikkerhetskopier tas på forhånd, som forebygging. Det er ikke en responsaktivitet etter hendelsen: <strong>Ingen</strong>.</p>" },
        { s: "Gjenopprette data fra sikkerhetskopi.", svar: [4], explain: "<p>Dataene hentes tilbake og driften normaliseres: <strong>Gjenoppretting</strong>.</p>" },
        { s: "Samle loggfiler fra IDS-systemer.", svar: [1], explain: "<p>Loggene brukes til å finne ut hva som har skjedd og hvordan: <strong>Analyse</strong>.</p>" }
      ]
    },
    avvik: "To av de åtte radene står uten tekst i qa-utskriften (fasit: én i «Sortering», én i «Skadebegrensning»), og den sjette kolonnen mangler overskrift. Vi har bare de seks radene med tekst. Maks på arket er 8 (1 per rad), så øvingen gir 8 når alle seks er riktige (regel.alleRiktig). Utenfor pensum H2026: fasene i hendelsesrespons står ikke på 2026-lysarkene.",
    losning: ["Isolere = skadebegrensning. Slette/rense = utryddelse. Hente tilbake = gjenoppretting. Samle logger = analyse.", "Det som skjer før hendelsen (rutinemessig sikkerhetskopi) eller ikke er respons (betale løsepenger), er «Ingen»."],
    tips: ["Fasene i hendelsesrespons er ikke på 2026-lysarkene. Rekkefølgen er likevel lett å huske: sortere, analysere, begrense, utrydde, gjenopprette.", "Med −1 per feil rad lønner det seg ikke å gjette på faser du er usikker på.", "2019 (5.3) hadde samme case med seks rader."]
  });
  hv("H2020-9.2",
    "<p>Når det brenner i et hus: først finner du ut hvor ille det er og hva som brant (analyse). Så lukker du dørene så det ikke sprer seg (skadebegrensning). Så slokker du helt og fjerner det som er ødelagt (utryddelse). Til slutt pusser du opp og flytter inn igjen (gjenoppretting).</p>",
    "<p>Hendelsesrespons går gjennom faser. Sortering avgjør hva som er viktigst. Analyse finner ut hva som skjedde, for eksempel fra logger. Skadebegrensning stopper spredning ved å isolere maskiner. Utryddelse fjerner skadevaren, for eksempel ved å slette diskene. Gjenoppretting henter tilbake data og normal drift. Sikkerhetskopier tatt på forhånd og betaling av løsepenger hører ikke til noen fase.</p>",
    "<p>Rekkefølgen har en grunn. Uten analyse vet man ikke hvilke maskiner som er rammet. Uten skadebegrensning sprer viruset seg mens man rydder. Uten utryddelse blir gjenopprettede data kryptert på nytt. Å gjenopprette fra sikkerhetskopi forutsetter at kopien ble tatt før angrepet og ligger utenfor angriperens rekkevidde. Å ta slike kopier er et forebyggende tiltak, ikke en del av responsen. Betaling av løsepenger finansierer angriperen og gir ingen sikker gjenoppretting.</p>");

  /* ======================== DEL 10: APPLIKASJONS- OG SKY-SIKKERHET ======================== */

  O.push({
    key: "H2020-10.1", year: Y, oppgave_nr: "Oppgave 10.1", del: D10,
    ark: "10.1 Sikker smidig", title: "Hva betyr sikker smidig utvikling?",
    points: 2, block: "utvikling", tema: ["sikker smidig", "smidig utvikling", "sikkerhetskrav"],
    gjenganger: ["H2021-9.3"],
    ordrett: true,
    oppgave: "<p>Angi hvilke utsagn om <strong>sikker smidig programvareutvikling</strong> som er korrekt.<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 2, minimum 0.</em></p><p><strong>Velg to alternativer:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Velg to alternativer.",
      alternativer: [
        "Sikker smidig betyr at sikkerhetsløsningene som utvikles er smidige.",
        "Sikker smidig betyr smidig programvareutvikling som inkluderer krav til sikkerhet.",
        "Sikker smidig er typisk mindre smidig en tradisjonell smidig programvareutvikling.",
        "Sikker smidig betyr at programvaren som utvikles er både sikker og smidig."
      ],
      svar: [1, 2],
      explain: [
        "<p>Feil. «Smidig» beskriver utviklingsprosessen, ikke produktet.</p>",
        "<p>Riktig. Det er vanlig smidig utvikling der sikkerhetskrav og sikkerhetsaktiviteter er bygget inn.</p>",
        "<p>Riktig. Sikkerhetsaktivitetene (krav, gjennomgang, testing) tar tid og legger på noe fast struktur, så prosessen blir litt mindre smidig.</p>",
        "<p>Feil. Programvare er ikke «smidig». Ordet gjelder hvordan den utvikles.</p>"
      ]
    },
    avvik: "Utenfor pensum H2026 (usikkert): sikker smidig utvikling har ingen 2026-lysark, men kan komme fra boka.",
    losning: ["Smidig = prosessen. Sikker smidig = smidig prosess med sikkerhetskrav, og derfor litt mindre smidig."],
    tips: ["Sikker smidig utvikling har ingen 2026-lysark. Det kan likevel komme fra boka (usikkert).", "Arket skriver «mindre smidig en», skrivefeil i originalen."]
  });
  hv("H2020-10.1",
    "<p>Et lag som bygger lego litt om gangen og viser fram etter hver runde, jobber smidig. Hvis de også må sjekke at hver del er festet godt før de går videre, blir de tryggere, men litt tregere.</p>",
    "<p>Smidig utvikling beskriver en prosess med korte runder og hyppige leveranser. Sikker smidig betyr at sikkerhetskrav og sikkerhetsaktiviteter tas med i prosessen. Det koster litt fleksibilitet, så prosessen blir typisk noe mindre smidig. Ordet sier ingenting om at produktet er «smidig».</p>",
    "<p>I smidig utvikling prioriteres funksjonalitet i hver sprint, og sikkerhet blir lett glemt. Sikker smidig legger inn sikkerhetskrav i produktkøen, trusselmodellering av nye funksjoner, kodegjennomgang og sikkerhetstesting som en del av «ferdig»-definisjonen. Disse faste aktivitetene gir mer struktur enn ren smidig utvikling, og det er derfor den beskrives som mindre smidig.</p>");

  O.push({
    key: "H2020-10.2", year: Y, oppgave_nr: "Oppgave 10.2", del: D10,
    ark: "10.2 OWASP", title: "Hva står på OWASP Top 10?",
    points: 2, block: "utvikling", tema: ["OWASP Top 10", "injeksjon", "autentisering"],
    gjenganger: ["H2022-4.2", "H2025-32"],
    ordrett: true,
    oppgave: "<p>Angi to trusler / sårbarheter / risikoer som er inkludert i <strong>OWASP Top 10</strong>-listen..<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 2, minimum 0.</em></p><p><strong>Velg to alternativer:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Velg to alternativer.",
      alternativer: ["Broken Authentication", "Open TCP port", "Trojan horse", "Injection"],
      svar: [0, 3],
      explain: [
        "<p>Riktig. Svak håndtering av innlogging og økter var på lista i 2017-versjonen (i 2021-versjonen heter kategorien «Identification and Authentication Failures»).</p>",
        "<p>Feil. En åpen port er et nettverkstema, ikke en svakhet i selve webapplikasjonen.</p>",
        "<p>Feil. En trojaner er skadevare, ikke en sårbarhet i en webapplikasjon.</p>",
        "<p>Riktig. Injeksjon (for eksempel SQL-injeksjon) har vært med i alle utgavene av lista, under litt ulike navn.</p>"
      ]
    },
    avvik: "Utenfor lysarkene H2026: OWASP har ingen 2026-lysark (men ble spurt om i 2025). Svaralternativene følger 2017-utgaven av lista.",
    losning: ["OWASP Top 10 er de vanligste sårbarhetene i webapplikasjoner.", "Nettverk (åpne porter) og skadevare (trojanere) hører ikke hjemme der."],
    tips: ["OWASP har ingen 2026-lysark, men ble spurt om i 2025. Kjenn injeksjon, ødelagt tilgangskontroll og autentiseringsfeil.", "Navnene endres mellom utgavene. Svaret her følger 2017-lista."]
  });
  hv("H2020-10.2",
    "<p>OWASP Top 10 er en liste over de vanligste feilene folk gjør når de lager nettsider, som å la hvem som helst skrive inn kommandoer i et skjema eller å ha en dårlig lås på innloggingen.</p>",
    "<p>OWASP Top 10 lister de viktigste sikkerhetsrisikoene for webapplikasjoner. Injeksjon og svak autentisering er klassiske eksempler. En åpen TCP-port og en trojaner er ikke svakheter i applikasjonskoden, og står derfor ikke på lista.</p>",
    "<p>Injeksjon oppstår når data fra brukeren tolkes som kode, for eksempel i en SQL-spørring. Riktig forsvar er parameteriserte spørringer. Autentiseringsfeil omfatter svake passordregler, dårlig økthåndtering og manglende beskyttelse mot gjetting. Lista oppdateres med noen års mellomrom, og kategoriene slås sammen og får nye navn.</p>");

  O.push({
    key: "H2020-10.3", year: Y, oppgave_nr: "Oppgave 10.3", del: D10,
    ark: "10.3 Web-sikkerhet", title: "Kommentarfelt som leses av andre: hvilket angrep?",
    points: 2, block: "angrep", tema: ["XSS", "lagret XSS", "webapplikasjon"],
    ordrett: true,
    oppgave: "<p>En webside lar besøkende legge igjen kommentarer, som kan leses senere av andre brukere.<br>Hvilket angrep mot andre brukere kan være mulig gjennom denne funksjonen (hvis den implementeres feil)?</p><p><em>Poeng: 2 for riktig, 0 for feil, 0 for intet svar, maks 2, minimum 0.</em></p><p><strong>Velg ett alternativ:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Poeng: 2 for riktig, 0 for feil, 0 for intet svar, maks 2, minimum 0.",
      regel: { riktig: 2, feil: 0, blankt: 0, min: 0, maks: 2 },
      alternativer: ["XSS", "DDoS", "SQL Injection", "Broken Authentication"],
      svar: 0,
      explain: [
        "<p>Riktig. Hvis kommentaren vises uten å bli renset, kan en angriper legge inn skript som kjører i nettleseren til alle som leser den (lagret XSS).</p>",
        "<p>Feil. DDoS retter seg mot tjeneren, ikke mot de andre brukerne via kommentarene.</p>",
        "<p>Feil. SQL-injeksjon angriper databasen på tjeneren, ikke de andre brukerne.</p>",
        "<p>Feil. Det handler om svak innlogging, ikke om innhold som vises til andre.</p>"
      ]
    },
    avvik: null,
    losning: ["Nøkkelordene er «mot andre brukere» og «leses senere»: innhold fra én bruker kjøres hos andre. Det er lagret XSS."],
    tips: ["XSS er med i 2026 under angrepsvektorer (skripting på tvers av nettsteder).", "Samme oppgave kom i 2019 (10.2)."]
  });
  hv("H2020-10.3",
    "<p>Tenk deg en oppslagstavle der alle kan henge opp lapper. Hvis noen henger opp en lapp med en skjult felle, går fella av hos alle som leser lappen senere.</p>",
    "<p>Hvis nettsiden viser kommentarene uten å rense dem, kan en angriper skrive en kommentar som inneholder skript. Skriptet lagres og kjøres i nettleseren til hver bruker som senere leser kommentaren. Det kalles lagret XSS, og det rammer de andre brukerne, ikke tjeneren.</p>",
    "<p>Ved lagret XSS sendes skriptet til tjeneren, lagres i databasen og bakes inn i siden som andre får. Nettleseren deres kan ikke skille det fra sidens egen kode, så skriptet kjører med sidens rettigheter og kan for eksempel lese øktinformasjon. Forsvaret er å kode utdata riktig for konteksten (HTML-koding) og å begrense hva skript får gjøre, for eksempel med en innholdssikkerhetspolicy.</p>");

  O.push({
    key: "H2020-10.4", year: Y, oppgave_nr: "Oppgave 10.4", del: D10,
    ark: "10.4 Sky-sikkerhet", title: "Skysikkerhet: fire korrekte utsagn",
    points: 4, block: "utvikling", tema: ["sky", "IaaS", "GDPR", "flerleietaker", "DevSecOps"],
    ordrett: true,
    oppgave: "<p>Angi fire utsagn om sky-sikkerhet som er korrekte.<br><em>Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 4, minimum 0.</em></p><p><strong>Velg 4 alternativer:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for hver feil, 0 for intet valg, maks 4, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
      regelMerknad: "Velg 4 alternativer.",
      alternativer: [
        "DevSecOps betyr at skyleverandøren monitorerer sikkerheten i kundenes skyløsninger.",
        "Sky-tjenester gir muligheten for økt tilgjengelighet.",
        "Kunder som kjøper IaaS (Infrastructure-as-a-Service) kan styre platformen med Intel ME (Management Engine).",
        "Skyleverandører kan utføre hendelsesrespons for kundene.",
        "Lagring av data i internasjonale datasentre kan være i strid med GDPR.",
        "IAM (identitets- og tilgangshåndtering) for skyløsninger må fødereres med skyleverandøren.",
        "Sikkerheten øker med flere leietakere/kunder på samme sky-platform.",
        "Skyleverandøren har teknisk sett tilgang til alle kundenes data."
      ],
      svar: [1, 3, 4, 7],
      explain: [
        "<p>Feil. DevSecOps er en måte å utvikle og drifte programvare på, der sikkerhet bygges inn i hele kjeden. Det handler ikke om at leverandøren overvåker kundene.</p>",
        "<p>Riktig. Skyleverandører har reservekapasitet og flere datasentre, så tjenesten kan holdes oppe også når noe feiler.</p>",
        "<p>Feil. Management Engine ligger under hypervisoren og styres av leverandøren. En IaaS-kunde får bare virtuelle maskiner.</p>",
        "<p>Riktig. Mange leverandører tilbyr overvåking og hendelseshåndtering som en tjeneste.</p>",
        "<p>Riktig. Personopplysninger kan bare overføres ut av EU/EØS på bestemte vilkår.</p>",
        "<p>Feil. Kunden kan ha egen IAM. Føderering er en mulighet, ikke et krav.</p>",
        "<p>Feil. Flere leietakere på samme plattform gir flere mulige angripere og mulige lekkasjer mellom kundene, ikke mer sikkerhet.</p>",
        "<p>Riktig. Leverandøren har kontroll over maskinvaren og plattformen, så den har teknisk sett tilgang, med mindre kunden krypterer med nøkler leverandøren ikke har.</p>"
      ]
    },
    avvik: "Utenfor pensum H2026: sky (IaaS), DevSecOps og GDPR-innhold har ingen 2026-lysark.",
    losning: ["Sky gir tilgjengelighet og kan gi hendelsesrespons som tjeneste.", "Ulempene: leverandøren har teknisk tilgang, og lagring utenfor EU/EØS kan bryte GDPR.", "Flerleietaker øker risikoen, og Intel ME er aldri kundens."],
    tips: ["Sky og GDPR er ikke i 2026-pensum. Bruk oppgaven mest som øvelse i å avvise «alltid/må»-påstander.", "Arket skriver «platformen» og «sky-platform», gjengitt ordrett."]
  });
  hv("H2020-10.4",
    "<p>Å bruke skyen er som å leie et rom i et stort hotell. Hotellet har strøm og vakter døgnet rundt, så du er sjelden uten rom. Men hotellet har nøkkel til rommet ditt, du deler bygning med mange fremmede, og hotellet kan ligge i et land med andre regler.</p>",
    "<p>Skytjenester kan gi høy tilgjengelighet, og leverandøren kan hjelpe med hendelsesrespons. Men leverandøren har teknisk tilgang til dataene, og lagring i datasentre utenfor EU/EØS kan være i strid med GDPR. Flere kunder på samme plattform gjør det ikke sikrere, og en IaaS-kunde styrer ikke maskinvaren.</p>",
    "<p>I IaaS styrer kunden operativsystem og programvare i virtuelle maskiner, mens leverandøren styrer hypervisor, fastvare og maskinvare. Flerleietaker betyr at isolasjonen i hypervisoren er det eneste skillet mellom kundene, så feil der kan gi lekkasje mellom dem. Leverandøren kan i prinsippet lese alt som ikke er kryptert med nøkler kunden selv kontrollerer. Overføring av personopplysninger til land utenfor EU/EØS krever et gyldig overføringsgrunnlag.</p>");

  /* ============================ SETT SAMMEN ============================ */

  BANK["H2020"] = {
    year: "H2020", dato: "02.12.2020", varighet: "2 timer", hjelpemidler: "Alle hjelpemidler (hjemmeeksamen)",
    forside: "<p><strong>Avsluttende online digital eksam i IN2120 Informasjonssikkerhet (Høst 2020).</strong></p><p><strong>Dato og tidspunkt: 2. desember 2020, kl.10:00 - 12:00 (2 timer).</strong></p><p><strong>Alle hjelpemidler er tillatt (lærebok, nettressurser, notater osv.).</strong></p><p><strong>Det er ikke tillatt å samarbeide eller kommunisere med andre om oppgavene under eksamen.</strong></p><p>Forøvrig gjelder informasjonen på nettsiden om eksamensavvikling ved MN-fakultetet høsten 2020.<br>Man kan trekkes ut til samtale for å kontrollere eierskap til sin besvarelse. Samtalen har ikke innvirkning på sensuren/karakteren, men kan lede til at instituttet oppretter fuskesak.</p><p>For generell brukerstøtte gå til websiden for brukerstøtte for hjemmeeksamen.</p><p>Ved uklarheter om oppgavene i denne eksamen kan man stille spørsmål direkte til faglærer via zoom. Lenker til zoom står på emnets infoside om trøsterunde (lecturer's round).</p><ul><li>Oppgavene i denne eksamen er gruppert under 10 deler som tilsvarer omtrent 10 av forelesningene i dette emnet, i alt 31 oppgaver med totalt 100 poeng (= 100%).</li><li>Man kan navigere frem og tilbake mellom oppgavene.</li><li>Skåring for hver oppgave angis eksplisitt. Det kan gis negative poeng for feil svar/valg, men total poengsum for hele oppgaven kan ikke være negativ (selv om summen over alle svarene er negativ).</li><li>Vær kortfattet. Når du skriver tekst som svar på en oppgave, er det ofte tilstrekkelig å skrive et enkelt uttrykk eller setning for å beskrive hvert konsept det spørres om.</li><li>I navigasjonslinjen nederst på skjermen indikerer blå søyler fullførte oppgaver/deler.</li><li>Svarene kan skrives på norsk eller engelsk.</li><li>Oversettelser av fagtermer for norsk-engelsk og engelsk-norsk fins på emnesiden.</li></ul>",
    deler: [
      { navn: D1, poeng: 10 }, { navn: D2, poeng: 10 }, { navn: D3, poeng: 10 }, { navn: D4, poeng: 10 },
      { navn: D5, poeng: 10 }, { navn: D6, poeng: 10 }, { navn: D7, poeng: 10 }, { navn: D8, poeng: 10 },
      { navn: D9, poeng: 10 }, { navn: D10, poeng: 10 }
    ],
    merknad: "Hjemmeeksamen (2 timer, alle hjelpemidler). 31 oppgaver, 10 deler à 10 poeng, sum «Maks poeng» = 100. I 9.2 mangler to av åtte rader tekst i utskriften (se avvik der).",
    oppgaver: O
  };
})();
