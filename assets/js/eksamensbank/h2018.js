/* IN2120 · eksamensbank H2018. Kilde: UiO, IN2120 eksamen H2018 (Inspera-utskrift med rettenøkkel og
   modellsvar i svarfeltene, behandlet som sensorveiledning; eierens beslutning 2026-11-25: qa-fila = sensorfil).
   28 sider, lest visuelt (grønne haker og grønne tall i parentes). Oppgavetekst og fasit ordrett (engelsk, som arket).
   Våre forklaringer (explain/losning/tips/hvorfor/svar) med egne ord. */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BANK = (window.IN_EXAM_BANK = window.IN_EXAM_BANK || {});
  IN.PERFEKT = IN.PERFEKT || {};

  var Y = "H2018";
  var D1 = "Part 1: General Security",
    D2 = "Part 2: Cryptography",
    D3 = "Part 3: Key Management",
    D4 = "Part 4: Communication Security",
    D5 = "Part 5: Computer Security",
    D6 = "Part 6: Risk Management",
    D7 = "Part 7: User Authentication",
    D8 = "Part 8: Identity & Access Management",
    D9 = "Part 9: Network Perimeter Security",
    D10 = "Part 10: Application Security";

  /* Fast tips for tema som ikke står på 2026-lysarkene (plan/vranglaere.md E). */
  var UTENFOR = "Utenfor pensum H2026: ";

  function hv(key, eli5, normal, teknisk) {
    IN.PERFEKT[key] = IN.PERFEKT[key] || { type: "eksamen" };
    IN.PERFEKT[key].hvorfor = { eli5: eli5, normal: normal, teknisk: teknisk };
  }
  /* Perfekt svar (vårt) + sensortekst (arkets modellsvar ordrett) for K/E. */
  function P(key, svar, deler, merknad) {
    IN.PERFEKT[key] = IN.PERFEKT[key] || { type: "eksamen" };
    IN.PERFEKT[key].svar = svar;
    IN.PERFEKT[key].sensor = { deler: deler, merknad: merknad || "" };
  }

  var O = [];

  /* ============================ PART 1: GENERAL SECURITY ============================ */

  O.push({
    key: "H2018-1.1", year: Y, oppgave_nr: "Oppgave 1.1", del: D1,
    ark: "1.1 ISO27000", title: "Definisjonen av informasjonssikkerhet (ISO 27000)",
    points: 2, block: "generelt", tema: ["informasjonssikkerhet", "KIT", "ISO 27000", "definisjon"],
    ordrett: true,
    oppgave: "<p>Write the definition (approximately) of <strong>information security</strong> according to ISO27000.<br><em>Points: max 2 total score</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 2 total score",
      regel: { min: 0, maks: 2 },
      regelMerknad: "Manuell retting. Arket gir bare maks 2; poengfordelingen i sjekklisten er vår egen.",
      deler: [{ del: "", poeng: 2, grense: "én setning" }]
    },
    avvik: null,
    losning: [
      "ISO 27000 definerer informasjonssikkerhet som at konfidensialitet, integritet og tilgjengelighet til informasjon blir ivaretatt (bevart).",
      "Nevn alle tre målene og at det er informasjon de gjelder. Standarden legger til at også andre egenskaper som autentisitet og ubenektelighet kan inngå, men det kreves ikke her."
    ],
    tips: ["Én setning holder: «Bevaring av konfidensialitet, integritet og tilgjengelighet til informasjon.»", "KIT-definisjonen er den samme i alle årganger; 2019, 2020 og senere spør om KIT på andre måter."]
  });
  P("H2018-1.1",
    [{ del: "", tekst: "<p>Informasjonssikkerhet er å bevare (ivareta) konfidensialitet, integritet og tilgjengelighet til informasjon.</p>", poeng: ["Nevner konfidensialitet, integritet og tilgjengelighet (1,5p)", "Som egenskaper ved informasjon som skal bevares (0,5p)"] }],
    [{ del: "", fasit: "<p>Preservation of confidentiality, integrity and availability of information</p>", kriterier: "<p>Points: max 2 total score</p>" }],
    "Arket har bare modellsvaret i svarfeltet, ingen poengfordeling. Fordelingen 1,5 + 0,5 i vårt svar er vårt eget forslag.");
  hv("H2018-1.1",
    "<p>Tenk på en dagbok. Den er trygg når bare du kan lese den, når ingen har skrevet i den bak ryggen din, og når du finner den når du trenger den.</p>",
    "<p>Informasjonssikkerhet handler om tre mål for informasjon: konfidensialitet (bare de som har lov får se), integritet (informasjonen er korrekt og uendret) og tilgjengelighet (den kan brukes når den trengs). ISO 27000 sier at sikkerheten er å bevare disse tre.</p>",
    "<p>ISO/IEC 27000 er ordboka for 27000-familien. Definisjonen er bevisst kort: informasjonssikkerhet er ivaretakelse av K, I og T for informasjon, eventuelt også egenskaper som autentisitet, sporbarhet og ubenektelighet. Det er et mål, ikke et tiltak: tiltakene (brannmur, kryptering osv.) er midler for å nå disse målene.</p>");

  O.push({
    key: "H2018-1.2", year: Y, oppgave_nr: "Oppgave 1.2", del: D1,
    ark: "1.2 Integrity", title: "Definisjonen av integritet (ISO 27000)",
    points: 1, block: "generelt", tema: ["integritet", "ISO 27000", "definisjon"],
    ordrett: true,
    oppgave: "<p>Write the definition (approximately) of <strong>integrity</strong> according to ISO27000.<br><em>Points: max 1</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 1",
      regel: { min: 0, maks: 1 },
      regelMerknad: "Manuell retting.",
      deler: [{ del: "", poeng: 1, grense: "én setning" }]
    },
    avvik: null,
    losning: ["ISO 27000: integritet er egenskapen å være nøyaktig og fullstendig.", "Med egne ord: informasjonen er korrekt og ikke endret uten lov."],
    tips: ["Kurset sier det samme med andre ord: data er korrekte og ikke endret av uvedkommende. Begge formuleringene bør gi poeng."]
  });
  P("H2018-1.2",
    [{ del: "", tekst: "<p>Integritet er egenskapen at informasjonen er nøyaktig og fullstendig, altså korrekt og ikke endret uten lov.</p>", poeng: ["Nøyaktig (korrekt) og fullstendig (1p)"] }],
    [{ del: "", fasit: "<p>The property of accuracy and completeness</p>", kriterier: "<p>Points: max 1</p>" }]);
  hv("H2018-1.2",
    "<p>En oppskrift har integritet når ingen har byttet ut sukker med salt og ingen har revet ut en side.</p>",
    "<p>Integritet betyr at informasjonen er riktig (nøyaktig) og hel (fullstendig). Brudd på integritet er når noen endrer, legger til eller sletter noe uten lov, eller når feil sniker seg inn.</p>",
    "<p>«Nøyaktig» dekker at innholdet ikke er endret, «fullstendig» at ingenting mangler eller er slettet. Integritet sikres teknisk med for eksempel MAC eller digital signatur (som oppdager endring) og tilgangskontroll (som hindrer uautorisert skriving). Kryptering alene gir ikke integritet.</p>");

  O.push({
    key: "H2018-1.3", year: Y, oppgave_nr: "Oppgave 1.3", del: D1,
    ark: "1.3 Availability", title: "Største trussel mot tilgjengelighet",
    points: 1, block: "generelt", tema: ["tilgjengelighet", "DDoS", "tjenestenekt"],
    ordrett: true,
    oppgave: "<p>Which is the most relevant <strong>threat against availability</strong>?<br><em>Points: 1 for correct, 0 for wrong, 0 for no selection</em></p><p><strong>Select one alternative:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Points: 1 for correct, 0 for wrong, 0 for no selection",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: ["SQL injection", "Cryptanalysis", "Phishing email", "DDoS attack", "Zero-day exploit"],
      svar: 3,
      explain: [
        "<p>Feil. SQL-injeksjon brukes oftest til å lese eller endre data i databasen (K og I).</p>",
        "<p>Feil. Kryptoanalyse prøver å finne klartekst eller nøkkel, altså et angrep på konfidensialitet.</p>",
        "<p>Feil. Phishing lurer brukere til å gi fra seg passord eller kjøre skadevare; det rammer først og fremst konfidensialitet.</p>",
        "<p>Riktig. Et distribuert tjenestenektangrep oversvømmer tjenesten slik at legitime brukere ikke kommer til: direkte angrep på <strong>tilgjengelighet</strong>.</p>",
        "<p>Feil. En nulldagsutnyttelse kan gi hva som helst, men den er ikke spesielt knyttet til tilgjengelighet.</p>"
      ]
    },
    avvik: null,
    losning: ["Tilgjengelighet = tjenesten kan brukes når den trengs.", "Det angrepet som har som mål å hindre bruk, er (D)DoS."],
    tips: ["Samme spørsmål kom i INF3510 2017 og IN2120 2019: svaret er alltid DDoS."]
  });
  hv("H2018-1.3",
    "<p>Hvis tusen personer stiller seg i døra til butikken uten å kjøpe noe, kommer ingen ekte kunder inn. Det er et DDoS-angrep.</p>",
    "<p>Et DDoS-angrep sender så mye trafikk eller så mange forespørsler fra mange maskiner (ofte et botnett) at tjenesten ikke klarer å svare legitime brukere. Målet er nettopp å ødelegge tilgjengeligheten.</p>",
    "<p>De andre alternativene kan i noen tilfeller også gå ut over tilgjengeligheten (en nulldag kan krasje en tjeneste), men hovedeffekten deres er å lese eller endre data. DDoS er det eneste der hindret bruk er selve formålet, derfor «most relevant».</p>");

  O.push({
    key: "H2018-1.4", year: Y, oppgave_nr: "Oppgave 1.4", del: D1,
    ark: "1.4 Authentication", title: "De to mest abstrakte formene for autentisering",
    points: 2, block: "generelt", tema: ["autentisering", "entitetsautentisering", "dataautentisering"],
    ordrett: true,
    oppgave: "<p>Select the two (2) <strong>most abstract categories of authentication</strong>.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      alternativer: ["User authentication", "Data authentication", "Token-based authentication", "Entity authentication", "Knowledge-based authentication", "Server authentication"],
      svar: [1, 3],
      explain: [
        "<p>Feil. Brukerautentisering er en underkategori av entitetsautentisering (brukeren er én type entitet).</p>",
        "<p>Riktig. <strong>Dataautentisering</strong> (meldingsautentisering) bekrefter hvor data kommer fra og at de ikke er endret.</p>",
        "<p>Feil. «Tokenbasert» er en autentiseringsfaktor (noe du har) for brukerautentisering, altså mye mer konkret.</p>",
        "<p>Riktig. <strong>Entitetsautentisering</strong> bekrefter identiteten til en part (person, system, tjener) i en kommunikasjon.</p>",
        "<p>Feil. «Kunnskapsbasert» er en faktor (noe du vet), ikke en hovedkategori.</p>",
        "<p>Feil. Tjenerautentisering er en underkategori av entitetsautentisering, akkurat som brukerautentisering.</p>"
      ]
    },
    avvik: null,
    losning: ["Øverst i hierarkiet: autentisering av en part (entitet) og autentisering av data (melding).", "Bruker- og tjenerautentisering er typer entitetsautentisering; kunnskap og token er faktorer for brukerautentisering."],
    tips: ["Tegn et lite tre: autentisering → entitet (bruker, tjener, …) og data. Alt annet er lenger ned."]
  });
  hv("H2018-1.4",
    "<p>Du kan sjekke <em>hvem</em> du snakker med (er dette virkelig mamma på telefonen?), eller sjekke <em>hvor et brev kommer fra</em> (er det virkelig mammas håndskrift?). Det er de to store typene.</p>",
    "<p>Entitetsautentisering bekrefter identiteten til en part, for eksempel en bruker som logger inn eller en tjener med sertifikat. Dataautentisering bekrefter at en melding kommer fra den den sier, og at den ikke er endret, for eksempel med MAC eller digital signatur. Bruker-, tjener-, token- og kunnskapsbasert autentisering er alle spesialtilfeller.</p>",
    "<p>Skillet er om det som autentiseres er en part i sanntid (entitet, ofte med utfordring–svar) eller et dataobjekt som kan sjekkes senere (data). Dataautentisering gir samtidig integritet: en endret melding feiler kontrollen. Brukerautentisering bruker faktorene vet/har/er; tjenerautentisering bruker typisk sertifikat og privat nøkkel.</p>");

  O.push({
    key: "H2018-1.5", year: Y, oppgave_nr: "Oppgave 1.5", del: D1,
    ark: "1.5 Phishing", title: "Phishing: sårbarheten og to tiltak",
    points: 3, block: "angrep", tema: ["phishing", "sosial manipulering", "opplæring", "e-postfiltrering"],
    gjenganger: ["H2021-2.1"],
    ordrett: true,
    oppgave: "<p>Answer the two question on <strong>phishing</strong>.<br><em>Points: max 3</em></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 3",
      regel: { min: 0, maks: 3 },
      regelMerknad: "Manuell retting. Arket fordeler ikke poengene mellom de to spørsmålene; vi antar 1 for sårbarheten og 2 for tiltakene (ett per tiltak).",
      deler: [
        { del: "A)", poeng: 1, sporsmal: "<p><strong>Which \"vulnerability\" is mainly exploited by phishing attacks?</strong></p>", grense: "én setning" },
        { del: "B)", poeng: 2, sporsmal: "<p><strong>Propose two (2) security methods to prevent phishing attacks.</strong></p>", grense: "to tiltak" }
      ]
    },
    avvik: null,
    losning: ["A) Sårbarheten er mennesket: vi er nysgjerrige, stoler på avsendere og klarer ikke alltid å skille falske e-poster fra ekte.", "B) To tiltak, f.eks. bevisstgjøring/opplæring og e-postfiltrering (fjerne lenker, skanne eller fjerne vedlegg)."],
    tips: ["«Vulnerability» står i anførselstegn fordi mennesket ikke er en teknisk sårbarhet. Svar «mennesker» og forklar kort hvorfor.", "Andre godkjente tiltak i dag: phishingresistent autentisering (passnøkler), avsenderkontroll (SPF/DKIM/DMARC), varsling av ekstern avsender."]
  });
  P("H2018-1.5",
    [
      { del: "A)", tekst: "<p>Mennesket. Brukere er nysgjerrige og godtroende og klarer ikke alltid å skille en falsk e-post fra en ekte.</p>", poeng: ["Mennesket/brukeren som sårbarhet (1p)"] },
      { del: "B)", tekst: "<p>1) Bevisstgjøring og opplæring av brukerne (f.eks. phishing-øvelser). 2) Filtrering av e-post: fjerne eller omskrive lenker og skanne eller fjerne vedlegg.</p>", poeng: ["Første tiltak, f.eks. opplæring (1p)", "Andre tiltak, f.eks. e-postfiltrering (1p)"] }
    ],
    [
      { del: "A)", fasit: "<p>Vulnerability: \"Humans\".<br>Humans are curious and can not distinguish between phishing and harmless emails.</p>", kriterier: "<p>Points: max 3</p>" },
      { del: "B)", fasit: "<p>Awareness training, email filtering (removal of links, scanning/removing attachments)</p>", kriterier: "<p>Points: max 3</p>" }
    ],
    "Poenglinja gjelder hele oppgaven (maks 3). Fordelingen 1 + 2 er vår antakelse.");
  hv("H2018-1.5",
    "<p>En svindler som ringer på døra og sier han er fra strømselskapet, prøver ikke å dirke opp låsen. Han prøver å få deg til å åpne selv. Phishing gjør det samme på e-post.</p>",
    "<p>Phishing utnytter mennesker, ikke tekniske feil: nysgjerrighet, tillit, tidspress og frykt. Derfor virker det best å kombinere tiltak mot mennesket (opplæring, øvelser) med tekniske tiltak som stopper e-posten eller lenken før brukeren må ta stilling (filtrering, skanning av vedlegg).</p>",
    "<p>Tekniske filtre fanger mye, men aldri alt, og opplæring gjør brukerne bedre, men aldri feilfrie. Derfor brukes forsvar i dybden: filtrering og avsenderverifisering først, bevisste brukere deretter, og til slutt tiltak som begrenser skaden om noen likevel klikker (f.eks. phishingresistent autentisering som passnøkler, minste privilegium).</p>");

  O.push({
    key: "H2018-1.6", year: Y, oppgave_nr: "Oppgave 1.6", del: D1,
    ark: "1.6 GDPR", title: "Hvilke data beskytter GDPR?",
    points: 1, block: "lov", tema: ["GDPR", "personopplysninger", "personvern"],
    ordrett: true,
    oppgave: "<p>What type of data protected by the <strong>GDPR regulation</strong>?<br><em>Points: max 1</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 1",
      regel: { min: 0, maks: 1 },
      regelMerknad: "Manuell retting.",
      deler: [{ del: "", poeng: 1, grense: "noen ord" }]
    },
    avvik: null,
    losning: ["GDPR beskytter personopplysninger: opplysninger som kan knyttes til en identifisert eller identifiserbar fysisk person."],
    tips: [UTENFOR + "GDPR-innhold står ikke på 2026-lysarkene (sist på eksamen i 2019). Kunne likevel at GDPR gjelder personopplysninger.", "Spørsmålet har en grammatisk feil i arket («What type of data protected …»)."]
  });
  P("H2018-1.6",
    [{ del: "", tekst: "<p>Personopplysninger: opplysninger som kan knyttes til en identifisert eller identifiserbar fysisk person.</p>", poeng: ["Personopplysninger / personidentifiserende data (1p)"] }],
    [{ del: "", fasit: "<p>Personal identifying information</p>", kriterier: "<p>Points: max 1</p>" }]);
  hv("H2018-1.6",
    "<p>GDPR passer på opplysninger om deg som person: navnet ditt, adressen, helsa di og alt annet som kan pekes tilbake på deg.</p>",
    "<p>EUs personvernforordning (GDPR) gjelder behandling av personopplysninger, altså alle opplysninger som direkte eller indirekte kan knyttes til en levende person. Anonyme data som ikke kan føres tilbake til noen, faller utenfor.</p>",
    "<p>«Identifiserbar» er nøkkelordet: også et IP-nummer eller en kombinasjon av alder, postnummer og yrke kan være personopplysninger hvis de sammen peker ut én person. Særlige kategorier (helse, religion, biometri brukt til identifikasjon osv.) har strengere regler, men er ikke forbudt å behandle.</p>");

  /* ============================ PART 2: CRYPTOGRAPHY ============================ */

  O.push({
    key: "H2018-2.1", year: Y, oppgave_nr: "Oppgave 2.1", del: D2,
    ark: "2.1 Diffie-Hellman", title: "Diffie-Hellman: navn og formål",
    points: 1, block: "krypto", tema: ["Diffie-Hellman", "nøkkelutveksling", "nøkkeletablering"],
    gjenganger: ["H2025-12"],
    ordrett: true,
    oppgave: "<p>Which security protocol is usually associated with the names \"<strong>Diffie</strong>\" and \"<strong>Hellman</strong>\"? What is the purpose of this protocol?<br><em>Points: max 1</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 1",
      regel: { min: 0, maks: 1 },
      regelMerknad: "Manuell retting. Arket fordeler ikke poenget mellom navn og formål; vi gir 0,5 + 0,5.",
      deler: [{ del: "", poeng: 1, grense: "to setninger" }]
    },
    avvik: "Modellsvaret skriver «DHE» om Diffie-Hellman-nøkkelutveksling generelt. DHE betyr strengt tatt den efemære (flyktige) varianten; navnet på protokollen er Diffie-Hellman-nøkkelutveksling (DH).",
    losning: ["Protokollen: Diffie-Hellman-nøkkelutveksling (DH).", "Formål: to parter kommer fram til en felles hemmelig (symmetrisk) nøkkel over en usikker kanal uten å sende selve nøkkelen."],
    tips: ["DH krypterer ikke og autentiserer ikke. Uten signatur er den sårbar for mann-i-midten.", "Med en ny DH-utveksling per økt får man fremoverhemmelighold."]
  });
  P("H2018-2.1",
    [{ del: "", tekst: "<p>Diffie-Hellman-nøkkelutveksling (DH). Formålet er at to parter blir enige om en felles hemmelighet (f.eks. en symmetrisk nøkkel) over en usikker kanal, uten at hemmeligheten selv sendes.</p>", poeng: ["Diffie-Hellman-nøkkelutveksling (0,5p)", "Felles hemmelig nøkkel over usikker kanal (0,5p)"] }],
    [{ del: "", fasit: "<p>DHE: Diffie Hellman key exchange<br>Two parties securely exchange a common secret (e.g. symmetric key) over an insecure channel</p>", kriterier: "<p>Points: max 1</p>" }],
    "Fordelingen 0,5 + 0,5 er vår antakelse.");
  hv("H2018-2.1",
    "<p>To venner blander hver sin hemmelige farge inn i en felles malingsspann alle kan se. Når de bytter blandingene og tilsetter sin hemmelige farge igjen, ender begge med samme farge. Den som bare så blandingene, klarer ikke å lage den.</p>",
    "<p>Diffie-Hellman lar Alice og Bob regne seg fram til den samme hemmelige verdien ved å sende hverandre offentlige verdier. Den felles hemmeligheten brukes deretter som (grunnlag for) en symmetrisk øktnøkkel. En som avlytter, ser bare de offentlige verdiene.</p>",
    "<p>Alice velger hemmelig a og sender gᵃ [mod p]; Bob velger b og sender gᵇ [mod p]. Begge beregner gᵃᵇ = (gᵇ)ᵃ = (gᵃ)ᵇ [mod p]. Å finne gᵃᵇ fra gᵃ og gᵇ er like vanskelig som det diskrete logaritmeproblemet. Utvekslingen er ikke autentisert i seg selv, så en mann-i-midten kan kjøre to separate utvekslinger; derfor signeres DH-verdiene i f.eks. TLS.</p>");

  O.push({
    key: "H2018-2.2", year: Y, oppgave_nr: "Oppgave 2.2", del: D2,
    ark: "2.2 Hash Functions I", title: "Egenskaper ved kryptografiske hashfunksjoner",
    points: 2, block: "krypto", tema: ["hashfunksjon", "enveis", "kollisjonsresistens"],
    gjenganger: ["H2021-3.4", "H2022-5.2", "H2024-18"],
    ordrett: true,
    oppgave: "<p>Select the properties of (good) <strong>cryptographic hash functions</strong>.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for now selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for now selection, max 2 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      alternativer: ["Bijective", "Confidential", "Collision resistance", "One way", "Assymetric"],
      svar: [2, 3],
      explain: [
        "<p>Feil. En bijektiv funksjon har en entydig invers. En hashfunksjon komprimerer vilkårlig lange inndata til en fast lengde, så mange inndata gir samme hash; den kan ikke være bijektiv.</p>",
        "<p>Feil. En hash har ingen nøkkel og gir ingen konfidensialitet. Hvem som helst kan beregne den.</p>",
        "<p>Riktig. <strong>Kollisjonsresistens</strong>: det skal være praktisk umulig å finne to ulike inndata med samme hash.</p>",
        "<p>Riktig. <strong>Enveis</strong>: det skal være praktisk umulig å finne inndata fra en gitt hashverdi.</p>",
        "<p>Feil. «Asymmetrisk» gjelder kryptering med nøkkelpar. Hashfunksjoner har ingen nøkler.</p>"
      ]
    },
    avvik: null,
    losning: ["Kursets krav: lett å beregne, komprimering, enveis, svak og sterk kollisjonsresistens.", "Av alternativene er bare enveis og kollisjonsresistens blant kravene."],
    tips: ["Arket staver «for now selection» og «Assymetric»: skrivefeil i originalen.", "Enveis betyr praktisk, ikke teoretisk, umulig å invertere."]
  });
  hv("H2018-2.2",
    "<p>En hashfunksjon er som en kjøttkvern: det er lett å lage kjøttdeig av en biff, men umulig å lage biffen igjen fra deigen. Og to ulike biffer skal aldri gi helt lik deig.</p>",
    "<p>En god kryptografisk hashfunksjon er enveis (du kan ikke regne deg tilbake fra hashen) og kollisjonsresistent (du finner ikke to inndata med samme hash). Den har ingen nøkkel, så den er verken konfidensiell eller asymmetrisk, og den kan ikke være bijektiv fordi den komprimerer.</p>",
    "<p>Kollisjoner må finnes (duebolprinsippet: uendelig mange inndata, 2<sup>n</sup> utdata), men skal være praktisk umulige å finne; bursdagsparadokset gir et generisk angrep på ca. 2<sup>n/2</sup> forsøk. Enveis (preimage-resistens) sikrer at H(M) ikke avslører M. Disse egenskapene er grunnlaget for at hash kan brukes i signaturer, MAC og passordlagring.</p>");

  O.push({
    key: "H2018-2.3", year: Y, oppgave_nr: "Oppgave 2.3", del: D2,
    ark: "2.3 Hash Functions II", title: "To bruksområder for hashfunksjoner",
    points: 2, block: "krypto", tema: ["hashfunksjon", "HMAC", "digital signatur", "passordlagring"],
    ordrett: true,
    oppgave: "<p>Name two (2) common <strong>applications of cryptographic hash functions</strong>.<br><em>Points: max 2</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 2",
      regel: { min: 0, maks: 2 },
      regelMerknad: "Manuell retting. Ett poeng per bruksområde (vår antakelse; arket gir bare maks 2).",
      deler: [{ del: "", poeng: 2, grense: "to bruksområder" }]
    },
    avvik: null,
    losning: ["Nevn to av: HMAC (meldingsautentisering), digital signatur (signerer hashen), passordlagring (lagre hash, ikke passord), utfordring–svar-protokoller."],
    tips: ["Andre gode svar: integritetssjekk av nedlastede filer, nøkkelavledning."]
  });
  P("H2018-2.3",
    [{ del: "", tekst: "<p>1) Digital signatur: man signerer hashen av meldingen i stedet for hele meldingen. 2) Passordlagring: tjeneren lagrer en (saltet) hash av passordet, ikke passordet selv.</p>", poeng: ["Første bruksområde (1p)", "Andre bruksområde (1p)"] }],
    [{ del: "", fasit: "<p>HMAC, Digital signature, password storage, challenge response protocols</p>", kriterier: "<p>Points: max 2</p>" }],
    "Fordelingen 1 + 1 er vår antakelse.");
  hv("H2018-2.3",
    "<p>Et fingeravtrykk er lite, men passer bare til én person. En hash er et slikt fingeravtrykk av data, og det kan brukes overalt der man vil sjekke at noe er det samme som før.</p>",
    "<p>Fordi hashen er kort og endrer seg fullstendig ved den minste endring, brukes den til å representere data: i digitale signaturer (signer hashen), i HMAC (hash med hemmelig nøkkel), til passordlagring (sammenlign hasher, ikke passord) og i utfordring–svar (svar med hash av utfordring og hemmelighet).</p>",
    "<p>I signaturer gir hashen effektivitet: S = Sig(Hash(M), K<sup>A</sup><sub>priv</sub>) i stedet for å signere hele M. HMAC er Hash(M, k) med nøkkelen bakt inn, som gir enkel meldingsautentisering. Til passord brukes saltede og bevisst langsomme hasher, slik at gjetting blir dyr og regnbuetabeller nytteløse.</p>");

  O.push({
    key: "H2018-2.4", year: Y, oppgave_nr: "Oppgave 2.4", del: D2,
    ark: "2.4 Digital Signature", title: "Hvilke nøkler brukes i en digital signatur?",
    points: 2, block: "krypto", tema: ["digital signatur", "privat nøkkel", "offentlig nøkkel"],
    gjenganger: ["H2021-3.5", "H2022-5.1"],
    ordrett: true,
    oppgave: "<p>Which keys are involved in the process of generating and verifying a digital signature?<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      alternativer: ["Symmetric key generated by the recipient", "Public key of the sender", "Public key of the recipient", "Private key of the recipient", "Private key of the sender", "Symmetric key generated by the sender"],
      svar: [1, 4],
      explain: [
        "<p>Feil. Digitale signaturer bruker ikke symmetriske nøkler (det ville vært en MAC).</p>",
        "<p>Riktig. Mottakeren verifiserer signaturen med <strong>avsenderens offentlige nøkkel</strong>.</p>",
        "<p>Feil. Mottakerens offentlige nøkkel brukes til å <em>kryptere</em> til mottakeren, ikke til signatur.</p>",
        "<p>Feil. Mottakerens private nøkkel brukes til å dekryptere, ikke til signatur.</p>",
        "<p>Riktig. Avsenderen signerer med sin egen <strong>private nøkkel</strong>, som bare hen har.</p>",
        "<p>Feil. Symmetriske nøkler hører til MAC og symmetrisk kryptering.</p>"
      ]
    },
    avvik: null,
    losning: ["Signere: avsenderens private nøkkel.", "Verifisere: avsenderens offentlige nøkkel.", "Mottakerens nøkler er ikke med."],
    tips: ["Signatur bruker bare avsenderens nøkkelpar; kryptering bruker bare mottakerens. Ikke bland dem."]
  });
  hv("H2018-2.4",
    "<p>Bare du har ditt eget stempel (privat nøkkel), men alle har et bilde av stempelet ditt (offentlig nøkkel) og kan sjekke at avtrykket er ekte.</p>",
    "<p>En digital signatur lages med avsenderens private nøkkel og kontrolleres med avsenderens offentlige nøkkel. Mottakeren trenger ingen egen nøkkel for dette. Derfor kan hvem som helst verifisere, og avsenderen kan ikke senere nekte (ubenektelighet).</p>",
    "<p>Med kursets notasjon: S = Sig(H, K<sup>A</sup><sub>priv</sub>) der H = Hash(M), og mottakeren beregner H = Ver(S, K<sup>A</sup><sub>pub</sub>) og sjekker at den stemmer med H′ = Hash(M′). Asymmetrisk kryptering er speilbildet: C = E(M, K<sup>B</sup><sub>pub</sub>) med mottakerens nøkler.</p>");

  O.push({
    key: "H2018-2.5", year: Y, oppgave_nr: "Oppgave 2.5", del: D2,
    ark: "2.5 MAC + Digital Signature", title: "MAC, digital signatur, begge eller ingen",
    points: 3, block: "krypto", tema: ["MAC", "digital signatur", "ubenektelighet", "hash"],
    gjenganger: ["H2021-1.4", "H2022-5.3", "H2023-15", "H2024-12"],
    ordrett: true,
    oppgave: "<p>Please selected for each property, if it applies to <strong>Message Authentication Codes</strong> (MAC), <strong>Digital Signature</strong> (DSig), both (MAC + DSig) or none of these two.<br>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3 total score</p><p><strong>Please match the values:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3 total score",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["MAC", "DSig", "Both", "None"],
      multi: false,
      rader: [
        { s: "Confidentiality", svar: [3], explain: "<p>Ingen av dem krypterer meldingen; den sendes i klartekst ved siden av MAC-en eller signaturen: <strong>None</strong>.</p>" },
        { s: "Authenticity", svar: [2], explain: "<p>Begge bekrefter hvor meldingen kommer fra og at den ikke er endret: <strong>Both</strong>.</p>" },
        { s: "Non-Repudiation", svar: [1], explain: "<p>Bare signaturen: bare avsenderen har den private nøkkelen. Med MAC har begge parter samme nøkkel, så avsenderen kan nekte: <strong>DSig</strong>.</p>" },
        { s: "Using Symmetric Crypto", svar: [0], explain: "<p>MAC bruker en delt hemmelig (symmetrisk) nøkkel: <strong>MAC</strong>.</p>" },
        { s: "Using Asymmetric Crypto", svar: [1], explain: "<p>Signatur bruker et nøkkelpar (privat/offentlig): <strong>DSig</strong>.</p>" },
        { s: "Using Hash Functions", svar: [2], explain: "<p>Begge hasher meldingen: HMAC er Hash(M, k), og signaturen lages over Hash(M): <strong>Both</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Felles: autentisitet (og integritet), bruker hash.", "Bare MAC: symmetrisk. Bare signatur: asymmetrisk og ubenektelighet.", "Ingen: konfidensialitet."],
    tips: ["Arket skriver «Please selected» (skrivefeil).", "MAC gir aldri ubenektelighet, og ingen av dem gir konfidensialitet. Disse to radene er de klassiske fellene."]
  });
  hv("H2018-2.5",
    "<p>En MAC er et hemmelig håndtrykk mellom to venner; en signatur er en håndskrift alle kan sjekke. Begge viser hvem som sendte brevet, men ingen av dem legger brevet i en lukket konvolutt.</p>",
    "<p>MAC og digital signatur gir begge dataautentisering: mottakeren vet hvem som sendte, og at meldingen er uendret. MAC bruker en delt symmetrisk nøkkel, så begge kunne ha laget den, og ingen tredjepart kan avgjøre hvem. Signaturen bruker avsenderens private nøkkel og gir derfor også ubenektelighet. Begge bygger på hash, og ingen av dem skjuler innholdet.</p>",
    "<p>MAC = Hash(M, k): mottakeren beregner MAC′ og sjekker MAC = MAC′. Signatur: S = Sig(Hash(M), K<sup>A</sup><sub>priv</sub>), verifisert med K<sup>A</sup><sub>pub</sub>. Konfidensialitet krever kryptering i tillegg. Kurset kaller MAC «enkel» og signatur «ubenektelig» meldingsautentisering.</p>");

  /* ============================ PART 3: KEY MANAGEMENT ============================ */

  O.push({
    key: "H2018-3.1", year: Y, oppgave_nr: "Oppgave 3.1", del: D3,
    ark: "3.1 Crypto period", title: "Kryptoperioder: beskyttelse og prosessering",
    points: 3, block: "pki", tema: ["kryptoperiode", "beskyttelsesperiode", "prosesseringsperiode"],
    gjenganger: ["H2021-4.3"],
    ordrett: true,
    oppgave: "<p>Select the statements on <strong>crypto periods</strong> that are true.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 3 total score</em></p><p><strong>Select one or more alternatives</strong></p>",
    figur: {
      beskrivelse: "Tre vannrette fargefelt over hverandre mellom to loddrette streker (start til venstre, slutt til høyre). Øverst et gult felt «Protection Period» med dobbeltpil, fra venstre strek til litt over midten. I midten et grønt felt «Processing Period» med dobbeltpil, som starter et stykke inn fra venstre (etter starten av beskyttelsesperioden) og går helt til høyre strek. Nederst et blått felt «Cryptoperiod» med dobbeltpil over hele bredden.",
      tekst: ["Protection Period", "Processing Period", "Cryptoperiod"]
    },
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 3 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      alternativer: [
        "The total crypto period is always less than 1 year.",
        "For digital signatures: signature creation is allowed in the (complete) processing period",
        "The processing period can continue after the protection period.",
        "For digital signatures: signature verification is allowed in the (complete) processing period.",
        "The crypto period is equal to the lifetime of the associated crytographic algorithm",
        "The crypto period is depended of the key length."
      ],
      svar: [2, 3, 5],
      explain: [
        "<p>Feil. Kryptoperioden avhenger av nøkkeltype og bruk; en rotnøkkel eller en signaturverifiseringsnøkkel kan ha mange års kryptoperiode.</p>",
        "<p>Feil. Signering er <em>beskyttelse</em> og skjer bare i beskyttelsesperioden med den private nøkkelen. Prosesseringsperioden fortsetter etter at signering skal ha stoppet.</p>",
        "<p>Riktig. Figuren viser det: prosesseringsperioden (dekryptere, verifisere) slutter etter beskyttelsesperioden, slik at data som ble beskyttet sent, fortsatt kan behandles.</p>",
        "<p>Riktig. Verifisering er <em>prosessering</em> med den offentlige nøkkelen og er tillatt i hele prosesseringsperioden.</p>",
        "<p>Feil. En algoritme lever mye lenger enn hver enkelt nøkkel; kryptoperioden gjelder én bestemt nøkkel.</p>",
        "<p>Riktig. Lengre nøkkel tåler mer kryptoanalyse, så den kan brukes lenger. Nøkkellengde er en av faktorene som avgjør kryptoperioden.</p>"
      ]
    },
    avvik: null,
    losning: ["Kryptoperiode = fra start av beskyttelsesperioden til slutt av prosesseringsperioden.", "Beskyttelse = kryptere eller signere. Prosessering = dekryptere eller verifisere.", "Prosesseringen kan vare lenger enn beskyttelsen; lengden avhenger blant annet av nøkkellengde og sensitivitet."],
    tips: ["Skrivefeil i arket: «crytographic», «depended of».", "Signering skjer i beskyttelsesperioden, verifisering i prosesseringsperioden. Den sammenhengen er gjenganger."]
  });
  hv("H2018-3.1",
    "<p>Et stempel for «betalt» brukes bare mens butikken er åpen (beskyttelse), men kvitteringene med stempelet kan sjekkes i mange år etterpå (prosessering).</p>",
    "<p>En nøkkel har en godkjent brukstid, kryptoperioden. Den deles i beskyttelsesperioden (nøkkelen brukes til å kryptere eller signere) og prosesseringsperioden (nøkkelen brukes til å dekryptere eller verifisere). Prosesseringen kan fortsette etter at beskyttelsen er over. Hvor lang perioden er, avhenger av blant annet nøkkellengde, hvor sensitive dataene er og hvor mye data nøkkelen beskytter.</p>",
    "<p>For et signaturnøkkelpar gjelder beskyttelsesperioden den private nøkkelen (signering) og prosesseringsperioden den offentlige (verifisering). For en symmetrisk krypteringsnøkkel er begge periodene på samme nøkkel. Korte kryptoperioder begrenser skaden ved kompromittering og mengden chiffertekst en angriper kan analysere, men gir mer nøkkelhåndtering; lengden er en avveining.</p>");

  O.push({
    key: "H2018-3.2", year: Y, oppgave_nr: "Oppgave 3.2", del: D3,
    ark: "3.2 Key distribution", title: "Nøkkeldistribusjon per nøkkeltype",
    points: 3, block: "pki", tema: ["nøkkeldistribusjon", "symmetrisk nøkkel", "offentlig nøkkel", "privat nøkkel"],
    ordrett: true,
    oppgave: "<p>Select for each key type the correct statement that applys for <strong>key distribution</strong> of the specific key type.<br><em>Points: 1 for each correct, -1 for wrong, 0 for no selecion, max 3 total score</em></p><p><strong>Select the correct statement.</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selecion, max 3 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Confidentiality required", "Authenticity required", "Keys are not distributed", "None of the other statements"],
      multi: false,
      rader: [
        { s: "Symmetric keys", svar: [0], explain: "<p>En symmetrisk nøkkel er en delt hemmelighet. Lekker den under distribusjon, er alt den beskytter avslørt, så distribusjonen må være konfidensiell: <strong>Confidentiality required</strong>.</p>" },
        { s: "Asymmetric public keys", svar: [1], explain: "<p>En offentlig nøkkel kan alle få se, men mottakeren må vite at den virkelig tilhører riktig eier. Distribusjonen krever autentisitet (det er det sertifikater og PKI gir): <strong>Authenticity required</strong>.</p>" },
        { s: "Asymmetric private keys", svar: [2], explain: "<p>Den private nøkkelen skal bare eieren ha. Den lages helst der den skal brukes og sendes aldri: <strong>Keys are not distributed</strong>.</p>" }
      ]
    },
    avvik: "Strengt tatt krever distribusjon av symmetriske nøkler både konfidensialitet og autentisitet (mottakeren må vite hvem nøkkelen er delt med). Matrisen tillater bare ett valg per rad, og fasiten velger konfidensialitet, som er det som skiller symmetriske nøkler fra offentlige.",
    losning: ["Symmetrisk: hemmelig, må distribueres konfidensielt.", "Offentlig: ikke hemmelig, men må være autentisk (sertifikat).", "Privat: distribueres ikke."],
    tips: ["Skrivefeil i arket: «applys», «selecion».", "Dette er grunnen til at PKI finnes: den løser autentisk distribusjon av offentlige nøkler."]
  });
  hv("H2018-3.2",
    "<p>En husnøkkel må gis i hemmelighet. Et telefonnummer kan alle se, men du vil være sikker på at det virkelig er nummeret til personen. Tannbørsten din deler du ikke i det hele tatt.</p>",
    "<p>Hver nøkkeltype har sitt krav ved distribusjon. Symmetriske nøkler må holdes hemmelige på veien. Offentlige nøkler er ikke hemmelige, men må være ekte, ellers kan en angriper sette inn sin egen nøkkel (mann-i-midten). Private nøkler skal ikke distribueres i det hele tatt.</p>",
    "<p>For n parter krever symmetrisk nøkkeldistribusjon n(n−1)/2 konfidensielle distribusjoner. Med asymmetrisk krypto trengs bare autentiske distribusjoner av offentlige nøkler, og med en PKI reduseres det til én autentisk distribusjon av rotnøkkelen per part, fordi sertifikatene (signert av CA) gir autentisiteten for resten.</p>");

  O.push({
    key: "H2018-3.3", year: Y, oppgave_nr: "Oppgave 3.3", del: D3,
    ark: "3.3 Certificates + PKI", title: "Sertifikater og nettleser-PKI",
    points: 3, block: "pki", tema: ["sertifikat", "CA", "nettleser-PKI", "tillitsforvirring", "rot-CA"],
    gjenganger: ["H2022-6.3"],
    ordrett: true,
    oppgave: "<p>Please select the statements on <strong>certificates</strong> and <strong>browser PKIs</strong> (Public Key Infrastructure) that are true.<br><em>Points: 1 for each correct, -1 for wrong, 0 for no selection, max 3</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selection, max 3",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      alternativer: [
        "A CA verifies the ownership of a domain before signing a certificate request.",
        "Certificate Transparency allows automatic issuing of certificates.",
        "Certificates allow the user to detect phishing Web sites.",
        "For an extended validation certificate (EV), the requester must prove the honest intention of the Web site.",
        "A certificate contains the common name of the subject; for the Web: the server's host name.",
        "Certificates ensure authentic exchange of private keys.",
        "The trust model is based not on one, but on many root CAs."
      ],
      svar: [0, 4, 6],
      explain: [
        "<p>Riktig. Før CA-en signerer, må søkeren bevise at hen kontrollerer domenet (domenevalidering).</p>",
        "<p>Feil. Certificate Transparency er offentlige logger over utstedte sertifikater, slik at feilutstedelser kan oppdages. Automatisk utstedelse er noe annet (f.eks. ACME-protokollen).</p>",
        "<p>Feil. Også phishing-nettsteder kan få gyldige sertifikater for sitt eget domene. Sertifikatet bekrefter bare domenenavnet, ikke at nettstedet er ærlig (tillitsforvirring).</p>",
        "<p>Feil. EV krever grundigere kontroll av at organisasjonen finnes og er den den sier, men ingen kan bevise «ærlige hensikter».</p>",
        "<p>Riktig. Sertifikatet binder subjektets navn til en offentlig nøkkel; på nettet er navnet tjenerens vertsnavn (domenet).</p>",
        "<p>Feil. Sertifikater inneholder offentlige nøkler. Private nøkler skal aldri utveksles.</p>",
        "<p>Riktig. Nettleseren og operativsystemet har en liste med mange rot-CA-er, og et sertifikat fra hvilken som helst av dem godtas.</p>"
      ]
    },
    avvik: null,
    losning: ["Sertifikat = signert binding mellom (domene)navn og offentlig nøkkel.", "CA sjekker domenekontroll før signering. Nettleser-PKI har mange rot-CA-er.", "Sertifikat gir autentisitet, ikke pålitelighet, og har aldri private nøkler."],
    tips: [UTENFOR + "Certificate Transparency og EV-sertifikater står ikke på 2026-lysarkene (bare i t03 fra 2025). Resten (binding navn–nøkkel, mange rot-CA-er, tillitsforvirring) er pensum.", "Utskriften har en liten ekstra strek etter haken ved alternativ 5; det er en utskriftsfeil, ikke en ekstra markering."]
  });
  hv("H2018-3.3",
    "<p>Et sertifikat er som et ID-kort for en nettside: det viser at nettstedet virkelig heter det det sier. Men et ID-kort sier ingenting om personen er ærlig.</p>",
    "<p>En CA signerer sertifikater som binder et domenenavn til en offentlig nøkkel, etter å ha sjekket at søkeren kontrollerer domenet. Nettleseren stoler på mange rot-CA-er samtidig. Et gyldig sertifikat bekrefter bare navnet, så det avslører ikke phishing-sider, og sertifikater inneholder aldri private nøkler.</p>",
    "<p>Nettleser-PKI er en modell med mange uavhengige rotankre, der kjeden rot → mellomliggende → subjekt valideres. Svakheten er at den svakeste CA-en kan utstede for ethvert domene; Certificate Transparency gjør slike feilutstedelser synlige i etterkant. Kurset kaller misforståelsen «sertifikat = pålitelig nettsted» for tillitsforvirring.</p>");

  O.push({
    key: "H2018-3.4", year: Y, oppgave_nr: "Oppgave 3.4", del: D3,
    ark: "3.4 OCSP", title: "Formålet med OCSP",
    points: 1, block: "pki", tema: ["OCSP", "revokering", "sertifikatstatus"],
    ordrett: true,
    oppgave: "<p>What is the purpose of the <strong>OCSP protocol</strong>?<br><em>Points: 1 for correct, 0 for wrong, 0 for no selection</em></p><p><strong>Select one alternative:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Points: 1 for correct, 0 for wrong, 0 for no selection",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: ["Requesting a CAA DNS entry.", "Checking if a certificate is still valid.", "Requesting a certificate.", "Revocation of certificates."],
      svar: 1,
      explain: [
        "<p>Feil. CAA er en DNS-post som sier hvilke CA-er som får utstede for domenet; den slås opp med DNS, ikke OCSP.</p>",
        "<p>Riktig. OCSP (Online Certificate Status Protocol) spør CA-ens tjener om et bestemt sertifikat fortsatt er gyldig eller er tilbakekalt.</p>",
        "<p>Feil. Sertifikater bestilles med en sertifikatforespørsel til CA-en, ikke med OCSP.</p>",
        "<p>Feil. Selve tilbakekallingen gjøres av CA-en. OCSP brukes til å <em>sjekke</em> statusen etterpå.</p>"
      ]
    },
    avvik: null,
    losning: ["OCSP = nettbasert statussjekk av ett sertifikat: gyldig, tilbakekalt eller ukjent."],
    tips: [UTENFOR + "OCSP og revokering står ikke på 2026-lysarkene (bare t03 fra 2025).", "Distraktoren «Revocation of certificates» er nær, men OCSP tilbakekaller ikke; den spør om status."]
  });
  hv("H2018-3.4",
    "<p>Før du godtar et førerkort, kan du ringe politiet og spørre: «Er dette kortet fortsatt gyldig, eller er det inndratt?» OCSP er den telefonen.</p>",
    "<p>Et sertifikat kan bli tilbakekalt før det går ut, for eksempel hvis den private nøkkelen er stjålet. OCSP lar en klient spørre en tjener hos CA-en om statusen til ett bestemt sertifikat i sanntid, i stedet for å laste ned en hel tilbakekallingsliste (CRL).</p>",
    "<p>OCSP-svaret er signert av CA-en (eller en OCSP-responder den har delegert til), og sier «good», «revoked» eller «unknown». Ulempene er personvern (CA-en ser hvilke sider du besøker) og hva nettleseren skal gjøre hvis svaret uteblir; OCSP-stifting, der tjeneren legger ved et ferskt OCSP-svar i TLS-handtrykket, løser begge delvis.</p>");

  /* ============================ PART 4: COMMUNICATION SECURITY ============================ */

  O.push({
    key: "H2018-4.1", year: Y, oppgave_nr: "Oppgave 4.1", del: D4,
    ark: "4.1 TLS I", title: "TLS: hvilke påstander er sanne?",
    points: 4, block: "nettverk", tema: ["TLS", "sertifikat", "handtrykk", "øktnøkkel", "integritet"],
    ordrett: true,
    oppgave: "<p>Select the statements on <strong>TLS</strong> that are true.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 4 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 4 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
      alternativer: [
        "If activated, TLS secures all TCP connections originated from that computer.",
        "Client and server must authenticate inside a TLS connection.",
        "The subject of the server certificate must be equal to the server’s host name entered in the browser.",
        "The algorithms used inside a session are negotiated between client and server.",
        "HTTP and HTTPS can be offered on the same TCP port.",
        "TLS ensures integrity of transferred data.",
        "For exchange of session keys, RSA is more secure than DH.",
        "The session key is created from random numbers, that are exchanged during the TLS handshake."
      ],
      svar: [2, 3, 5, 7],
      explain: [
        "<p>Feil. TLS er ikke en maskinbryter; hver applikasjon må selv bruke TLS for sine forbindelser. Å sikre all trafikk fra en maskin er noe en VPN gjør.</p>",
        "<p>Feil. Bare tjeneren må vanligvis autentisere seg (sertifikat). Klientautentisering er valgfri, og på nettet logger brukeren ofte inn senere med passord.</p>",
        "<p>Riktig. Nettleseren sjekker at navnet i sertifikatet stemmer med vertsnavnet i adressefeltet; ellers kommer en advarsel.</p>",
        "<p>Riktig. I handtrykket sender klienten hvilke chifferserier den støtter, og tjeneren velger.</p>",
        "<p>Feil (etter fasiten). I praksis lytter HTTP på port 80 og HTTPS på 443. Teknisk finnes oppgradering på samme port, men det er ikke vanlig bruk.</p>",
        "<p>Riktig. TLS Record beskytter hver post med integritetskontroll (MAC eller autentisert kryptering), så endringer oppdages.</p>",
        "<p>Feil. Nøkkeltransport med RSA gir ikke fremoverhemmelighold. (Efemær) DH er tryggere, og TLS 1.3 har fjernet RSA-nøkkeltransport.</p>",
        "<p>Riktig. Klient og tjener bidrar med tilfeldige verdier i handtrykket, og øktnøklene avledes fra disse og den felles hemmeligheten.</p>"
      ]
    },
    avvik: null,
    losning: ["Sant: sertifikatnavn = vertsnavn, algoritmer forhandles, TLS gir integritet, øktnøkkel fra tilfeldige tall i handtrykket.", "Usant: TLS sikrer ikke alt fra maskinen, krever ikke klientautentisering, RSA er ikke sikrere enn DH."],
    tips: ["Påstanden om at RSA-nøkkelutveksling er tryggere enn DH er en felle: det er motsatt på grunn av fremoverhemmelighold."]
  });
  hv("H2018-4.1",
    "<p>TLS er som en sikker telefonlinje som to apper setter opp hver gang de snakker. De blir enige om hvilket språk de skal kode samtalen på, sjekker ID-en til den ene parten og lager en ny hemmelig kode for akkurat denne samtalen.</p>",
    "<p>TLS beskytter én forbindelse mellom en klient og en tjener. I handtrykket forhandles algoritmer, tjeneren viser et sertifikat som må passe med vertsnavnet, og partene lager øktnøkler fra tilfeldige verdier. Deretter gir TLS konfidensialitet og integritet for dataene. TLS gjelder bare de applikasjonene som bruker det, og klientautentisering er valgfri.</p>",
    "<p>Kurset deler TLS i Handshake (applikasjonslaget: forhandling, sertifikatvalidering, nøkkeletablering) og Record (transportlaget: kryptering og integritet per post). Med efemær DH avledes øktnøklene fra gᵃᵇ og de tilfeldige verdiene fra begge parter, noe som gir fremoverhemmelighold. RSA-nøkkeltransport krypterer hemmeligheten med tjenerens offentlige nøkkel og mister fremoverhemmelighold.</p>");

  O.push({
    key: "H2018-4.2", year: Y, oppgave_nr: "Oppgave 4.2", del: D4,
    ark: "4.2 TLS II", title: "To problemer med TLS",
    points: 2, block: "nettverk", tema: ["TLS", "svake algoritmer", "PKI", "protokollangrep"],
    ordrett: true,
    oppgave: "<p>Name two (2) <strong>challenges/problems with TLS</strong>.<br><em>Points: max 2</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 2",
      regel: { min: 0, maks: 2 },
      regelMerknad: "Manuell retting. Ett poeng per problem (vår antakelse; arket gir bare maks 2).",
      deler: [{ del: "", poeng: 2, grense: "to problemer" }]
    },
    avvik: null,
    losning: ["Nevn to av: gamle/knekte algoritmer (RC4, SHA-1), avhengighet av en sårbar nettleser-PKI (CA-er og sertifikater), sårbarheter og angrep på selve protokollen (FREAK, Logjam, BEAST, DROWN …)."],
    tips: ["Andre gode svar: TLS-stripping (første besøk uten HSTS), brukere som klikker forbi sertifikatadvarsler, TLS-inspeksjon."]
  });
  P("H2018-4.2",
    [{ del: "", tekst: "<p>1) TLS hviler på nettleser-PKI-en: én kompromittert eller uforsiktig CA kan utstede falske sertifikater for hvilket som helst domene. 2) Gamle og svake algoritmer og protokollversjoner (f.eks. RC4, SHA-1, SSL) må støttes for kompatibilitet og har gitt nedgraderingsangrep.</p>", poeng: ["Første problem (1p)", "Andre problem (1p)"] }],
    [{ del: "", fasit: "<p>Old/broken algorithms (e.g. RC4, SHA-1); relying on (vulnerable) browser PKI/CA/certificate system; vulnerabilities/attacks in/on protocol (e.g. FREAK, Logjam, BEAST, DROWN, ...)</p>", kriterier: "<p>Points: max 2</p>" }],
    "Fordelingen 1 + 1 er vår antakelse.");
  hv("H2018-4.2",
    "<p>En sikker lås hjelper lite hvis noen av nøklesmedene du stoler på, lager nøkler til hvem som helst, eller hvis låsen fortsatt kan byttes til en gammel og dårlig modell.</p>",
    "<p>TLS er ikke sterkere enn delene det bygger på. Det stoler på mange CA-er, det har måttet støtte eldre og svakere algoritmer, og selve protokollen har hatt feil som er utnyttet i navngitte angrep. Derfor er nye versjoner (TLS 1.3) strammet inn.</p>",
    "<p>Nedgraderingsangrep (FREAK, Logjam) lurer partene til å velge svak eksportkryptografi; BEAST utnyttet forutsigbar IV i CBC i TLS 1.0; DROWN brukte en tjener som fortsatt støttet SSLv2 til å angripe TLS-økter med samme RSA-nøkkel. TLS 1.3 fjernet RSA-nøkkeltransport, svake chiffer og de fleste valgmuligheter for å stenge slike veier.</p>");

  O.push({
    key: "H2018-4.3", year: Y, oppgave_nr: "Oppgave 4.3", del: D4,
    ark: "4.3 TLS III", title: "Porten for HTTP over TLS",
    points: 1, block: "nettverk", tema: ["HTTPS", "port 443", "TLS"],
    gjenganger: ["H2024-26"],
    ordrett: true,
    oppgave: "<p>Which <strong>TCP port</strong> is reserved for \"HTTP over TLS\"?<br><em>Points: 1 for correct answer.</em></p>",
    inspera: {
      type: "T",
      regelTekst: "Points: 1 for correct answer.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      tekst: "<p>Answer: {0}.</p>",
      felt: [{ etikett: "TCP-port", godta: ["443", "port 443", "TCP 443", "TCP/443", "TCP port 443"], explain: "<p>HTTPS (HTTP over TLS) har standardporten <strong>443</strong>. Vanlig HTTP bruker 80.</p>" }]
    },
    avvik: null,
    losning: ["HTTPS = port 443."],
    tips: ["Kunne de vanligste portene: 22 SSH, 23 Telnet, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS, 3389 RDP."]
  });
  hv("H2018-4.3",
    "<p>Et portnummer er som et dørnummer i en blokk: alle vet at den sikre nettsidedøra er nummer 443.</p>",
    "<p>Velkjente tjenester har faste portnumre slik at klienten vet hvor den skal koble seg til. HTTP over TLS (HTTPS) er registrert på TCP-port 443.</p>",
    "<p>IANA registrerer velkjente porter (0–1023). Port 443 er satt av til HTTPS, der TLS-handtrykket starter rett etter at TCP-forbindelsen er opprettet. HTTP/3 bruker også 443, men over UDP (QUIC).</p>");

  O.push({
    key: "H2018-4.4", year: Y, oppgave_nr: "Oppgave 4.4", del: D4,
    ark: "4.4 VPN", title: "Sky-VPN: hva skjules for nettleverandøren?",
    points: 2, block: "nettverk", tema: ["VPN", "sky-VPN", "ISP", "personvern"],
    gjenganger: ["H2023-30", "H2024-25"],
    ordrett: true,
    oppgave: "<p>Let's assume the user <em>U</em> is using the Cloud VPN service <em>C</em> and is accessing a service <em>S</em> using a unencrypted TCP connection.<br>What type of information is <strong>hidden from the user’s ISP</strong>?<br><em>Point: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Point: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      alternativer: ["The IP address of U.", "The content of the connection.", "The IP address of S.", "The IP address of C."],
      svar: [1, 2],
      explain: [
        "<p>Feil. Det er brukerens egen ISP; den har tildelt adressen og ser den alltid.</p>",
        "<p>Riktig. Mellom U og C er alt kryptert i VPN-tunnelen, så ISP-en ser ikke innholdet (selv om forbindelsen til S er ukryptert, er den det først etter C).</p>",
        "<p>Riktig. Den indre pakken med S som mål ligger kryptert inne i tunnelen. ISP-en ser bare pakker til C.</p>",
        "<p>Feil. ISP-en må rute pakkene til VPN-tjenesten, så adressen til C er synlig.</p>"
      ]
    },
    avvik: null,
    losning: ["ISP-en ser: U ↔ C (ytre adresser) og mengden trafikk.", "ISP-en ser ikke: innhold og hvem det egentlig kommuniseres med (S)."],
    tips: ["Bakdelen: VPN-leverandøren C ser nå alt ISP-en tidligere så, og siden forbindelsen til S er ukryptert, ser C også innholdet."]
  });
  hv("H2018-4.4",
    "<p>Du sender alle brevene dine i en forseglet konvolutt til et postkontor (VPN-tjenesten), som åpner den og sender brevet videre. Postmannen i ditt nabolag ser bare at du skriver til postkontoret, ikke hvem brevet egentlig er til eller hva det står.</p>",
    "<p>En sky-VPN lager en kryptert tunnel fra brukeren til VPN-tjenesten. Brukerens ISP ser bare at U snakker med C. Hvem U egentlig besøker (S) og hva som sendes, er skjult inne i tunnelen. Fra C til S går trafikken slik den ellers ville gått, her ukryptert.</p>",
    "<p>Den ytre IP-pakken har kilde U og mål C; den indre (kryptert) har mål S. ISP-en kan fortsatt se tidspunkter og mengder (trafikkanalyse). Tilliten flyttes fra ISP-en til VPN-leverandøren, som ser alt ukryptert innhold på vei til S.</p>");

  O.push({
    key: "H2018-4.5", year: Y, oppgave_nr: "Oppgave 4.5", del: D4,
    ark: "4.5 TOR", title: "Tor: hva vet hver node?",
    points: 1, block: "nettverk", tema: ["Tor", "løkruting", "anonymitet"],
    gjenganger: ["H2022-7.2"],
    ordrett: true,
    oppgave: "<p>Which statement is true for <strong>TOR networks</strong>?<br><em>Points: 1 for correct, 0 for wrong, 0 for no selection</em></p><p><strong>Select one alternative:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Points: 1 for correct, 0 for wrong, 0 for no selection",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: [
        "Only connections to server that have a TOR proxy installed is possible.",
        "The first node along a connection knows the start- and endpoint of that connection (i.e. client and server).",
        "Each node in the network knows the previous and next node along a connection but no other peers.",
        "Each node in the network adds one layer of encryption."
      ],
      svar: 2,
      explain: [
        "<p>Feil. Utgangsnoden kobler seg til vanlige tjenere på Internett; tjeneren trenger ikke Tor.</p>",
        "<p>Feil. Inngangsnoden kjenner klienten, men ikke målet. Bare klienten vet hele veien.</p>",
        "<p>Riktig. Hver node fjerner sitt lag og ser bare hvor pakken kom fra og hvor den skal videre. Ingen enkelt node ser både start og mål.</p>",
        "<p>Feil. Det er klienten som legger på alle lagene (ett per node). Hver node <em>fjerner</em> ett lag.</p>"
      ]
    },
    avvik: null,
    losning: ["Klienten krypterer i tre lag, ett for hver node.", "Hver node skreller av sitt lag og ser bare forrige og neste hopp."],
    tips: ["Felle: «hver node legger på et lag». Lagene legges på av klienten og fjernes av nodene."]
  });
  hv("H2018-4.5",
    "<p>Du legger et brev i tre konvolutter inni hverandre. Første bud åpner den ytterste og ser bare navnet på neste bud. Det samme gjør neste. Ingen av budene vet både hvem som sendte og hvem som til slutt får brevet.</p>",
    "<p>Tor (løkruting) sender trafikken via tre noder. Klienten krypterer pakken i tre lag, ett for hver node. Hver node fjerner sitt lag og vet bare hvilken node pakken kom fra og hvilken den skal til. Inngangsnoden kjenner klienten, utgangsnoden kjenner målet, men ingen kjenner begge.</p>",
    "<p>Klienten forhandler en nøkkel med hver av de tre nodene og bygger en krets. Utgående celle: E(E(E(data, K<sub>C</sub>), K<sub>B</sub>), K<sub>A</sub>), der A er inngangsnoden. Anonymiteten bygger på at nodene ikke samarbeider. Trafikken fra utgangsnoden til tjeneren er ukryptert med mindre applikasjonen selv bruker TLS.</p>");

  /* ============================ PART 5: COMPUTER SECURITY ============================ */

  O.push({
    key: "H2018-5.1", year: Y, oppgave_nr: "Oppgave 5.1", del: D5,
    ark: "5.1 Virtualization", title: "Plattformvirtualisering: hvilke påstander er sanne?",
    points: 3, block: "system", tema: ["virtualisering", "hypervisor", "isolasjon"],
    ordrett: true,
    oppgave: "<p>Select the statements on <strong>platform virtualization</strong> that are true.<br><em>Points: 1 for each correct, -1 for wrong, 0 for no answer, max 3 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no answer, max 3 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      alternativer: [
        "Platform virtualization helps in malware protection.",
        "Guest VMs on the same host system must have the same OS.",
        "The hypervisor is always running on top of the host OS.",
        "The hypervisor offers virtual hardware interfaces to the VMs.",
        "Platform virtualization reduces the energy demand.",
        "A guest OS can access another guest OS, which is located on the same host system."
      ],
      svar: [0, 3, 4],
      explain: [
        "<p>Riktig. VM-ene er isolert fra hverandre, så skadevare i én VM holdes der, og en infisert VM kan rulles tilbake til et øyeblikksbilde.</p>",
        "<p>Feil. Hver VM har sin egen virtuelle maskinvare og kan kjøre et helt annet OS (f.eks. Linux og Windows side om side).</p>",
        "<p>Feil. Det gjelder bare type 2. En type 1-hypervisor kjører rett på maskinvaren uten vert-OS.</p>",
        "<p>Riktig. Hypervisoren gir hver VM virtuell maskinvare (CPU, minne, disk, nettverkskort), og gjestene tror de kjører på ekte maskinvare.</p>",
        "<p>Riktig (etter fasiten). Flere tjenere samles på færre fysiske maskiner, som gir bedre utnyttelse og lavere energibruk totalt.</p>",
        "<p>Feil. VM-ene er nettopp isolert fra hverandre. At én gjest når en annen, er en sårbarhet (VM-utbrudd), ikke en egenskap.</p>"
      ]
    },
    avvik: "«Reduces the energy demand» er en driftsfordel ved konsolidering, ikke en sikkerhetsegenskap, og gjelder samlet bruk, ikke hver maskin. «Helps in malware protection» gjelder isolasjon og tilbakerulling; virtualisering hindrer ikke infeksjon. Fasiten regner begge som sanne.",
    losning: ["Sant: isolasjon hjelper mot skadevare, hypervisoren gir virtuell maskinvare, konsolidering sparer energi.", "Usant: samme OS kreves ikke, hypervisoren kjører ikke alltid på vert-OS (type 1), gjester når ikke hverandre."],
    tips: ["Type 1 = rett på maskinvaren (ring −1). Type 2 = som et program på et vert-OS."]
  });
  hv("H2018-5.1",
    "<p>En hypervisor er som en huseier som deler et stort hus i leiligheter. Hver leietaker har sitt eget kjøkken og innredning og ser ikke inn hos naboen. Det er billigere å varme opp ett hus enn mange.</p>",
    "<p>Plattformvirtualisering lar flere virtuelle maskiner kjøre på samme fysiske maskin. Hypervisoren gir hver VM virtuell maskinvare og holder dem isolert, så de kan ha ulike operativsystemer og ikke se hverandre. Isolasjonen begrenser skadevare, og samling av mange tjenere på få maskiner sparer energi.</p>",
    "<p>Type 1-hypervisor kjører direkte på maskinvaren (privilegienivå −1), gjeste-OS i ring 0 og applikasjoner i ring 3. Type 2 kjører som et program over et vert-OS. Sikkerhetsgevinsten er isolasjon og øyeblikksbilder; risikoen er at en feil i hypervisoren kan gi utbrudd fra én VM til alle.</p>");

  O.push({
    key: "H2018-5.2", year: Y, oppgave_nr: "Oppgave 5.2", del: D5,
    ark: "5.2 Ring Allocation", title: "Ringnumre i type 1-virtualisering",
    points: 3, block: "system", tema: ["privilegienivå", "ring", "hypervisor", "type 1"],
    gjenganger: ["H2022-2.4", "H2025-5"],
    ordrett: true,
    oppgave: "<p>Enter the <strong>protection ring numbers</strong> for the \"Type 1 VM Architecture\" (see figure above).<br><em>Points: 1 for each correct, 0 for wrong, 0 for no answer</em></p>",
    figur: {
      beskrivelse: "Lagdiagram for type 1-virtualisering. Øverst fire små turkise bokser «App.» side om side. Under en stiplet linje to oransje bokser «Guest OS VM». Under ny stiplet linje en bred gul boks «Hypervisor». Under ny stiplet linje en bred lys laksefarget boks «Hardware». Ingen felt i figuren; tallfeltene står under.",
      tekst: ["App.", "Guest OS VM", "Hypervisor", "Hardware"]
    },
    inspera: {
      type: "T",
      regelTekst: "Points: 1 for each correct, 0 for wrong, 0 for no answer",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
      tekst: "<p>Application: {0}</p><p>Guest OS VM: {1}</p><p>Hypervisor: {2}</p>",
      felt: [
        { etikett: "Application", godta: ["3", "ring 3", "tre", "three"], explain: "<p>Applikasjoner kjører i brukermodus, <strong>ring 3</strong>, med minst privilegier.</p>" },
        { etikett: "Guest OS VM", godta: ["0", "ring 0", "null", "zero"], explain: "<p>Gjeste-OS-kjernen tror den eier maskinen og kjører i <strong>ring 0</strong> (kjernemodus).</p>" },
        { etikett: "Hypervisor", godta: ["-1", "−1", "- 1", "ring −1", "minus 1", "minus én", "minus en", "minus one"], explain: "<p>Type 1-hypervisoren trenger enda mer makt enn gjeste-kjernene og kjører på <strong>ring −1</strong> (maskinvarestøttet virtualisering).</p>" }
      ]
    },
    avvik: null,
    losning: ["Lavere tall = mer privilegier.", "App 3, gjeste-OS 0, hypervisor −1."],
    tips: ["Skriv minus som vanlig bindestrek: «-1».", "Ring 1 og 2 brukes nesten ikke i praksis."]
  });
  hv("H2018-5.2",
    "<p>Tenk på en bygning med vakter: gjesten (appen) har minst lov, husverten (gjeste-OS) mer, og eieren av hele kvartalet (hypervisoren) har mest. Jo lavere nummer, jo mer makt.</p>",
    "<p>Prosessorens privilegienivåer kalles ringer. Applikasjoner kjører i ring 3, OS-kjernen i ring 0. Når en type 1-hypervisor skal styre flere gjeste-OS som hver tror de kjører i ring 0, trengs et enda mer privilegert nivå: ring −1.</p>",
    "<p>Maskinvarestøttet virtualisering (Intel VT-x, AMD-V) innførte en egen rotmodus for hypervisoren, kalt ring −1. Gjeste-kjernene kan da kjøre ufortrødent i ring 0, mens privilegerte instruksjoner fanges opp av hypervisoren. En prosess kan bare nå sitt eget nivå og nivåer med høyere tall.</p>");

  O.push({
    key: "H2018-5.3", year: Y, oppgave_nr: "Oppgave 5.3", del: D5,
    ark: "5.3 TPM", title: "TPM: tre tjenester og BitLocker",
    points: 4, block: "system", tema: ["TPM", "målt oppstart", "forsegling", "attestering", "BitLocker"],
    gjenganger: ["H2022-2.6"],
    ordrett: true,
    oppgave: "<p>TPM (Trusted Platform Module) is a hardware chip which supports three (3) main security services on computing platforms.</p>",
    figur: {
      beskrivelse: "Produktbilde av to TPM-brikker (firkantede kretsbrikker med kontakter langs kantene), den ene sett ovenfra med påskrift om TPM 2.0, den andre fra undersiden. Bildet er bare illustrasjon; ingen felt.",
      tekst: ["TPM 2.0"]
    },
    inspera: {
      type: "K",
      regelTekst: "Points: max 3 / Points: max 1",
      regel: { min: 0, maks: 4 },
      regelMerknad: "Manuell retting: A) maks 3 (ett poeng per tjeneste, vår antakelse), B) maks 1.",
      deler: [
        { del: "A)", poeng: 3, sporsmal: "<p>List these three main <strong>TPM-supported services</strong>:<br><em>Points: max 3</em></p>", grense: "tre tjenester" },
        { del: "B)", poeng: 1, sporsmal: "<p>Which of these services is used by the Windows Bitlocker <strong>disk encryption</strong> application?<br><em>Points: max 1</em></p>", grense: "én tjeneste" }
      ]
    },
    avvik: null,
    losning: ["A) Målt (autentisert) oppstart, forseglet lagring (sealed storage) og fjernattestering.", "B) BitLocker bruker forseglet lagring: disknøkkelen frigis bare når oppstarten måles som uendret."],
    tips: ["2026-lysarkene nevner nøyaktig de samme tre: målt oppstart, attestering og forsegling av nøkler, med BitLocker som eksempel.", "Ikke bland målt oppstart (registrerer) med sikker oppstart i UEFI (stopper ukjent kode)."]
  });
  P("H2018-5.3",
    [
      { del: "A)", tekst: "<p>1) Målt (autentisert) oppstart: hver komponent som startes, måles inn i TPM-ens registre. 2) Forseglet lagring: data eller nøkler krypteres slik at de bare kan pakkes ut i en bestemt, målt tilstand. 3) Fjernattestering: TPM-en signerer målingene så en tredjepart kan kontrollere oppstartstilstanden.</p>", poeng: ["Målt/autentisert oppstart (1p)", "Forseglet lagring (1p)", "Fjernattestering (1p)"] },
      { del: "B)", tekst: "<p>Forseglet lagring: BitLocker forsegler disknøkkelen i TPM-en, som bare frigir den når oppstarten er uendret.</p>", poeng: ["Forseglet lagring (1p)"] }
    ],
    [
      { del: "A)", fasit: "<p>– Authenticated/measured boot,<br>– Sealed Storage / Encryption<br>– Remote attestation</p>", kriterier: "<p>Points: max 3</p>" },
      { del: "B)", fasit: "<p>– Sealed Storage / Encryption</p>", kriterier: "<p>Points: max 1</p>" }
    ],
    "Fordelingen ett poeng per tjeneste i A) er vår antakelse.");
  hv("H2018-5.3",
    "<p>TPM-en er en liten safe på hovedkortet med en dagbok. Den skriver ned alt som starter (målt oppstart), låser bare opp safen hvis dagboken ser normal ut (forsegling), og kan vise dagboken med sitt eget stempel til andre (attestering).</p>",
    "<p>En TPM er en sikkerhetsbrikke som måler oppstarten, kan forsegle hemmeligheter til en bestemt systemtilstand og kan attestere tilstanden overfor andre. BitLocker forsegler disknøkkelen i TPM-en: hvis noen har tuklet med oppstarten, stemmer ikke målingene, og nøkkelen frigis ikke.</p>",
    "<p>Målingene lagres i PCR-registre som bare kan utvides (hash av gammel verdi og ny måling), aldri skrives fritt. Forsegling knytter dekryptering til bestemte PCR-verdier. Attestering signerer PCR-verdiene med en nøkkel som bare finnes i TPM-en. Målt oppstart registrerer, mens UEFI sikker oppstart stopper kode med ugyldig signatur; de utfyller hverandre.</p>");

  /* ============================ PART 6: RISK MANAGEMENT ============================ */

  O.push({
    key: "H2018-6.1", year: Y, oppgave_nr: "Oppgave 6.1", del: D6,
    ark: "6.1 Risk Assessment", title: "Rekkefølgen i risikovurdering (ISO 27005)",
    points: 3, block: "risiko", tema: ["risikovurdering", "ISO 27005", "risikoidentifisering", "risikoestimering", "risikoevaluering"],
    ordrett: true,
    oppgave: "<p>What is the order of tasks in the <strong>risk assessment</strong> process acording to ISO 27005? Enter the numbers 1, 2 and 3 accordingly.<br><em>Points: 3 total score for all answers correct, 0 if any error</em></p>",
    inspera: {
      type: "T",
      regelTekst: "Points: 3 total score for all answers correct, 0 if any error",
      regel: { riktig: 0, feil: 0, blankt: 0, min: 0, maks: 3, alleRiktig: 3 },
      regelMerknad: "Alt eller ingenting: alle tre tall riktige gir 3, ellers 0. Arket har tekstfelt der tallet skrives inn foran hvert trinn.",
      tekst: "<p>{0}. Risk Estimation</p><p>{1}. Risk Evaluation</p><p>{2}. Risk Identification</p>",
      felt: [
        { etikett: "Risk Estimation", godta: ["2"], explain: "<p>Når risikoene er funnet, anslås sannsynlighet og konsekvens for hver: estimering er <strong>2</strong>.</p>" },
        { etikett: "Risk Evaluation", godta: ["3"], explain: "<p>Til slutt sammenlignes de estimerte risikoene med akseptkriteriene og prioriteres: evaluering er <strong>3</strong>.</p>" },
        { etikett: "Risk Identification", godta: ["1"], explain: "<p>Først må man finne hva som kan gå galt (verdier, trusler, sårbarheter): identifisering er <strong>1</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["1) Identifisere risikoene, 2) estimere (analysere) dem, 3) evaluere dem mot akseptkriteriene."],
    tips: [UTENFOR + "ISO 27005-trinnene som egen pugg er ikke på 2026-lysarkene, men logikken (finn → anslå → prioriter) går igjen i all risikostyring.", "Arket staver «acording» (skrivefeil). Radene står i en annen rekkefølge enn trinnene."]
  });
  hv("H2018-6.1",
    "<p>Før en fjelltur finner du først ut hva som kan skje (snøskred, tåke), så hvor sannsynlig og hvor ille hvert er, og til slutt bestemmer du hva som er for farlig.</p>",
    "<p>Risikovurdering etter ISO 27005 har tre trinn. Identifisering finner risikoene (verdier, trusler, sårbarheter, eksisterende tiltak). Estimering (analyse) anslår sannsynlighet og konsekvens. Evaluering sammenligner med akseptkriteriene og bestemmer hvilke risikoer som må behandles først.</p>",
    "<p>ISO 27005 plasserer risikovurdering (identifisering + analyse/estimering + evaluering) mellom kontekstetablering og risikobehandling, med kommunikasjon og overvåking som løpende aktiviteter rundt. Nyere utgaver kaller trinn 2 «risk analysis». Rekkefølgen er logisk: man kan ikke anslå en risiko man ikke har funnet, eller prioritere en man ikke har anslått.</p>");

  O.push({
    key: "H2018-6.2", year: Y, oppgave_nr: "Oppgave 6.2", del: D6,
    ark: "6.2 Risk Identification", title: "Hva identifiseres i risikoidentifisering?",
    points: 2, block: "risiko", tema: ["risikoidentifisering", "verdier", "trusler", "sårbarheter", "eksisterende tiltak"],
    gjenganger: ["H2024-13"],
    ordrett: true,
    oppgave: "<p>Which elements are identified in the process step of <strong>risk identification</strong>?<br><em>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 2 total score",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      alternativer: ["Vulnerabilities", "Likelihood of incidents", "Risk levels", "Risk mitigation strategies", "Assets", "Threats", "Value of assets", "Existing controls"],
      svar: [0, 4, 5, 7],
      explain: [
        "<p>Riktig. <strong>Sårbarheter</strong> som truslene kan utnytte, kartlegges i identifiseringen.</p>",
        "<p>Feil. Sannsynligheten for hendelser anslås i neste trinn, estimering.</p>",
        "<p>Feil. Risikonivået (av sannsynlighet og konsekvens) fastsettes i estimeringen og brukes i evalueringen.</p>",
        "<p>Feil. Strategier for å redusere risiko hører til risikobehandlingen, som kommer etter hele risikovurderingen.</p>",
        "<p>Riktig. Først finner man <strong>verdiene</strong> som skal beskyttes.</p>",
        "<p>Riktig. <strong>Trusler</strong> mot verdiene identifiseres.</p>",
        "<p>Feil. Å sette verdi på verdiene er en vurdering, og den brukes når konsekvensen anslås i estimeringen. Identifiseringen lister bare hvilke verdier som finnes.</p>",
        "<p>Riktig. <strong>Eksisterende tiltak</strong> kartlegges, så man ikke foreslår noe som allerede finnes, og så sårbarhetene vurderes riktig.</p>"
      ]
    },
    avvik: null,
    losning: ["Identifiser: verdier, trusler, eksisterende tiltak, sårbarheter.", "Estimer: verdien av verdiene (konsekvens), sannsynlighet, risikonivå. Behandle: tiltak og strategier."],
    tips: ["Tommelregel: det som er et tall eller en vurdering (sannsynlighet, nivå, verdi), hører ikke til identifiseringen."]
  });
  hv("H2018-6.2",
    "<p>Først lager du en liste: hva har jeg (verdier), hva kan skade det (trusler), hvor er jeg svak (sårbarheter), og hva har jeg allerede gjort (tiltak). Å regne ut hvor mye det er verdt og hvor farlig det er, kommer etterpå.</p>",
    "<p>Risikoidentifisering er kartlegging: hvilke verdier finnes, hvilke trusler finnes mot dem, hvilke sårbarheter kan utnyttes, og hvilke tiltak er allerede på plass. Verdsetting, sannsynlighet og risikonivå er vurderinger som gjøres i estimeringen, og strategier for å redusere risikoen kommer i behandlingen etter hele vurderingen.</p>",
    "<p>En risiko kan skrives som et scenario: en trussel utnytter en sårbarhet i en verdi til tross for eksisterende tiltak. Identifiseringen finner byggesteinene i scenarioet; estimeringen setter sannsynlighet og konsekvens på det (der verdien av verdien inngår i konsekvensen); evalueringen sammenligner risikonivået med akseptkriteriene.</p>");

  O.push({
    key: "H2018-6.3", year: Y, oppgave_nr: "Oppgave 6.3", del: D6,
    ark: "6.3 Threat Tree", title: "Trusseltre for tyveri av informasjonskapsler",
    points: 2, block: "risiko", tema: ["trusseltre", "angrepstre", "XSS", "avlytting", "cookie"],
    ordrett: true,
    oppgave: "<p>Below you see a <strong>threat tree</strong> with one node already filled. Move the four (4) terms below the tree to right position inside the tree.<br><em>Points: 2 total score for all answers correct, 0 if any error</em></p><p><strong>Move the terms to the tree nodes</strong></p>",
    figur: {
      beskrivelse: "Trusseltre med ett tomt felt øverst (rotnoden). Under det står «OR», og to greiner går ned til hver sin svarte prikk merket «AND». Fra venstre prikk går to greiner til to tomme felt. Fra høyre prikk går to greiner: venstre til et tomt felt, høyre til et ferdig utfylt felt «XSS Attack». Under treet står de fire begrepene som skal dras inn.",
      tekst: ["OR", "AND", "AND", "XSS Attack"]
    },
    inspera: {
      type: "D",
      regelTekst: "Points: 2 total score for all answers correct, 0 if any error",
      regel: { riktig: 0, feil: 0, blankt: 0, min: 0, maks: 2, alleRiktig: 2 },
      regelMerknad: "Alt eller ingenting: alle fire felt riktige gir 2, ellers 0.",
      tekst: null,
      bank: ["XSS Vulnerability", "Eavesdropping", "Unencrypted Connection", "Cookie Theft"],
      felt: [
        { etikett: "Rotnoden (øverst)", svar: 3, godta: [], explain: "<p>Det angriperen vil oppnå, står øverst: <strong>Cookie Theft</strong>. De to greinene under (OR) er to alternative veier.</p>" },
        { etikett: "Venstre AND, venstre felt", svar: 2, godta: [], explain: "<p>Første vei: forbindelsen er ukryptert (<strong>Unencrypted Connection</strong>) …</p>" },
        { etikett: "Venstre AND, høyre felt", svar: 1, godta: [], explain: "<p>… <em>og</em> angriperen avlytter den (<strong>Eavesdropping</strong>). Begge må være oppfylt, derfor AND.</p>" },
        { etikett: "Høyre AND, venstre felt (ved siden av «XSS Attack»)", svar: 0, godta: [], explain: "<p>Andre vei: nettstedet har en XSS-sårbarhet (<strong>XSS Vulnerability</strong>) <em>og</em> angriperen utfører XSS-angrepet som leser informasjonskapselen.</p>" }
      ]
    },
    avvik: "Rekkefølgen innenfor en AND-gren har ingen logisk betydning, men øvingen retter etter feltplasseringen på arket. Bytter du de to bladene under venstre AND, gir øvingen 0 selv om treet er logisk likt.",
    losning: ["Topp: Cookie Theft. OR mellom to veier.", "Vei 1: Unencrypted Connection AND Eavesdropping.", "Vei 2: XSS Vulnerability AND XSS Attack."],
    tips: [UTENFOR + "Trusseltrær står ikke på 2026-lysarkene. Prinsippet (mål øverst, OR = ett av, AND = alle) er likevel lett å resonnere seg fram til."]
  });
  hv("H2018-6.3",
    "<p>For å komme inn i huset kan tyven enten finne en åpen dør <em>og</em> gå inn, eller finne et vindu som er av hasp <em>og</em> klatre inn. Målet står øverst, veiene står under.</p>",
    "<p>Et trusseltre har angriperens mål i roten. Under en OR-node holder det at én av greinene lykkes; under en AND-node må alle greinene lykkes. Her kan informasjonskapselen stjeles enten ved å avlytte en ukryptert forbindelse, eller ved å utnytte en XSS-sårbarhet med et XSS-angrep.</p>",
    "<p>Trusseltrær (angrepstrær) bryter ned et mål i delmål og viser billigste eller mest sannsynlige vei. Sannsynligheter kan regnes oppover: for AND multipliseres de (uavhengige hendelser), for OR blir det 1 − ∏(1 − p). Tiltak plasseres der de kutter flest greiner; her stopper HTTPS (og Secure-flagget) vei 1, og HttpOnly-flagget og utdatakoding vei 2.</p>");

  O.push({
    key: "H2018-6.4", year: Y, oppgave_nr: "Oppgave 6.4", del: D6,
    ark: "6.4 Risk Estimation", title: "Årlig forventet tap (ALE)",
    points: 3, block: "risiko", tema: ["risikoestimering", "ALE", "kvantitativ risikoanalyse", "ARO"],
    gjenganger: ["H2022-10.3"],
    ordrett: true,
    oppgave: "<p>The following values are the result of a <strong>risk estimation</strong> analysis:</p><ul><li>Annualized Rate of Occurance: ARO = 10</li><li>Asset Value: AV = 5000 $</li></ul>",
    inspera: {
      type: "T",
      regelTekst: "Point: 1 for correct, 0 for wrong answer (each of the three questions)",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Hvert av de tre spørsmålene har poenglinja «Point: 1 for correct, 0 for wrong answer». De to første er radioknapper på arket (her nedtrekk). Arkets fasit krysser av «Qualitative» og enheten «$». Øvingen godtar arkets svar, men viser det faglig riktige (kvantitativ, $ / year) som fasit. Se avvik.",
      tekst: "<p>How is this type of analysis called? {0}</p><p>You have to calculate the Annualized Loss Expectancy (ALE) for the given case. What is the unit for the ALE? {1}</p><p>Calculate the ALE (enter just the number; without any unit if there is any).<br>ALE = {2}</p>",
      felt: [
        { etikett: "Type analyse", valg: ["Relative/semi-quantitative", "Qualitative", "Quantitative"], svar: 2, godta: [1], explain: "<p>Sannsynlighet og verdi er tall med enheter (hendelser per år, dollar), og tapet regnes ut med en formel: det er <strong>kvantitativ</strong> analyse. Arkets fasit sier «Qualitative», som må være en feil; begge godtas.</p>" },
        { etikett: "Enhet for ALE", valg: ["(no unit, plain number)", "%", "$", "$ / year"], svar: 3, godta: [2], explain: "<p>ARO er hendelser per år og AV er dollar, så ALE blir <strong>dollar per år</strong> (forventet tap per år). Arkets fasit sier «$»; begge godtas.</p>" },
        { etikett: "Verdi for ALE", godta: ["50000", "50 000", "50,000", "50.000"], explain: "<p>ALE = ARO × AV = 10 × 5000 = <strong>50000</strong> ($ per år), når hele verdien tapes ved hver hendelse.</p>" }
      ]
    },
    avvik: "Arkets fasit krysser av «Qualitative» for analysetypen. En analyse med tallverdier i dollar og hendelser per år, regnet ut med en formel, er kvantitativ; øvingen viser «Quantitative» som riktig og godtar «Qualitative». Enheten er hakket av som «$», mens ALE strengt tatt er $ per år; begge godtas. Fasitverdien 50000 = ARO × AV forutsetter at hele verdien tapes ved hver hendelse (eksponeringsfaktor 1); den vanlige formen er ALE = ARO × SLE med SLE = AV × EF.",
    losning: ["Kvantitativ analyse (tall med enheter og formel).", "ARO = 10 per år, AV = 5000 $.", "ALE = 10 × 5000 = 50000 $ per år (arket: skriv bare tallet)."],
    tips: [UTENFOR + "ALE/ARO-formelen står ikke på 2026-lysarkene. 2026 bruker kvalitative skalaer, der risikonivået er summen av logaritmiske nivåer for sannsynlighet og konsekvens.", "Arket staver «Occurance» (skrivefeil)."]
  });
  hv("H2018-6.4",
    "<p>Hvis noen knuser et vindu til 5000 kroner ti ganger i året, taper du i snitt 50 000 kroner i året. Det er ALE.</p>",
    "<p>ALE er forventet tap per år. Her skjer hendelsen 10 ganger per år (ARO = 10) og verdien er 5000 $, så ALE = 50 000 $ per år. Siden både hyppighet og verdi er målbare tall og tapet regnes ut, er det en kvantitativ risikoanalyse.</p>",
    "<p>Standardformen er SLE = AV × EF (tap per hendelse) og ALE = SLE × ARO. Oppgaven gir ingen EF, så fasiten antar at hele verdien går tapt hver gang. ALE brukes til kost/nytte: et tiltak som koster mindre per år enn reduksjonen i ALE, lønner seg. Kvalitativ analyse bruker skalaer som lav/middels/høy; semikvantitativ bruker tallskalaer uten fysisk enhet.</p>");

  /* ============================ PART 7: USER AUTHENTICATION ============================ */

  O.push({
    key: "H2018-7.1", year: Y, oppgave_nr: "Oppgave 7.1", del: D7,
    ark: "7.1 Authentication Factors", title: "Autentiseringsfaktorer og to-faktor",
    points: 2, block: "autentisering", tema: ["autentiseringsfaktorer", "to-faktor", "kunnskap", "besittelse", "biometri"],
    ordrett: true,
    oppgave: "",
    inspera: {
      type: "K",
      regelTekst: "Points: 0.5 for each correct answer, 0 for wrong, 0 for no answer / Points: 0.5 for correct answer, 0 for wrong, 0 for no answer",
      regel: { min: 0, maks: 2 },
      regelMerknad: "Manuell retting: A) 0,5 per faktor (maks 1,5), B) 0,5. Sum maks 2.",
      deler: [
        { del: "A)", poeng: 1.5, sporsmal: "<p>Name the three (3) general credential categories (called <strong>authentication factors</strong>)<br><em>Points: 0.5 for each correct answer, 0 for wrong, 0 for no answer</em></p>", grense: "tre faktorer" },
        { del: "B)", poeng: 0.5, sporsmal: "<p>Give an example for a wide-spread commercial <strong>2-factor authentication system</strong> and name the involved factors.<br><em>Points: 0.5 for correct answer, 0 for wrong, 0 for no answer</em></p>", grense: "ett eksempel med faktorene" }
      ]
    },
    avvik: null,
    losning: ["A) Noe du vet (kunnskap), noe du har (besittelse), noe du er (biometri).", "B) F.eks. minibank: kort (har) + PIN (vet). Husk å navngi faktorene."],
    tips: ["To faktorer må være av ulik type. Passord + sikkerhetsspørsmål er to ting du vet, altså ikke to-faktor.", "B spør også etter faktorene: et systemnavn alene er et halvt svar."]
  });
  P("H2018-7.1",
    [
      { del: "A)", tekst: "<p>Noe du vet (kunnskap, f.eks. passord), noe du har (besittelse, f.eks. kort eller mobil), noe du er (biometri, f.eks. fingeravtrykk).</p>", poeng: ["Kunnskap (0,5p)", "Besittelse (0,5p)", "Biometri (0,5p)"] },
      { del: "B)", tekst: "<p>Minibank: bankkortet (noe du har) og PIN-koden (noe du vet).</p>", poeng: ["Gyldig eksempel med to ulike faktorer navngitt (0,5p)"] }
    ],
    [
      { del: "A)", fasit: "<p>Knowledge, Ownership, Inherence (Biometrics)</p>", kriterier: "<p>Points: 0.5 for each correct answer, 0 for wrong, 0 for no answer</p>" },
      { del: "B)", fasit: "<p>ATM (card + PIN), Google (password + phone), ...</p>", kriterier: "<p>Points: 0.5 for correct answer, 0 for wrong, 0 for no answer</p>" }
    ]);
  hv("H2018-7.1",
    "<p>For å komme inn i en hemmelig klubb må du kanskje kunne passordet (vet), vise medlemskortet (har) eller bli gjenkjent av vakten (er). To av dem samtidig er mye tryggere enn ett.</p>",
    "<p>Autentiseringsfaktorene er kunnskap (noe du vet), besittelse (noe du har) og biometri (noe du er). To-faktor kombinerer to ulike faktorer, slik at en angriper må stjele to forskjellige ting. Minibank (kort + PIN) og innlogging med passord + kode på mobilen er vanlige eksempler.</p>",
    "<p>Poenget med flere faktorer er at de kompromitteres på ulike måter: et passord kan phishes, et kort kan stjeles, men sjelden begge samtidig. Faktorene må være uavhengige, og kurset regner SMS som en relativt svak sekundærkanal. Passnøkler kombinerer besittelse (enheten) med kunnskap eller biometri (opplåsing av enheten).</p>");

  O.push({
    key: "H2018-7.2", year: Y, oppgave_nr: "Oppgave 7.2", del: D7,
    ark: "7.2 Password Storage", title: "Tiltak for sikker passordlagring",
    points: 2, block: "autentisering", tema: ["passordlagring", "hashing", "salting", "tilgangskontroll", "regnbuetabell"],
    gjenganger: ["H2021-6.1", "H2022-8.1"],
    ordrett: true,
    oppgave: "<p>Select the relevant <em>security method</em> for implementing each requirement in <strong>password databases</strong>.<br><em>Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select the relevant security method:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection, max 2 total score",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Salting", "Access Control", "Complex password", "Hashing"],
      multi: false,
      rader: [
        { s: "Passwords are not readable in the database", svar: [3], explain: "<p>Databasen inneholder bare hashverdier, ikke selve passordene: <strong>Hashing</strong>.</p>" },
        { s: "Only authorized enties can read the password database", svar: [1], explain: "<p>Hvem som får lese databasen, styres av rettigheter: <strong>Access Control</strong>.</p>" },
        { s: "Pre-computed hash tables can not be used to crack passwords", svar: [0], explain: "<p>Et unikt salt per bruker gjør forhåndsberegnede tabeller (regnbuetabeller) ubrukelige: <strong>Salting</strong>.</p>" },
        { s: "Attackers can not crack a salted and hashed password in the database", svar: [2], explain: "<p>Med databasen i hende kan angriperen fortsatt gjette passord og hashe dem med saltet. Bare et sterkt (langt, komplekst) passord gjør gjettingen umulig i praksis: <strong>Complex password</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Hashing: passordene står ikke i klartekst.", "Tilgangskontroll: bare autoriserte får lese databasen.", "Salting: stopper forhåndsberegnede tabeller.", "Sterkt passord: tåler gjetting selv om databasen er stjålet."],
    tips: ["Arket skriver «enties» (skrivefeil for «entities»).", "Salt stopper ikke gjetting av ett passord; det stopper bare forhåndsberegning og at like passord gir like hasher.", "2026-kurset legger vekt på lengde mer enn kompleksitet (minst 13 tegn)."]
  });
  hv("H2018-7.2",
    "<p>Du låser passordboka inne (tilgangskontroll), skriver passordene i en kode ingen kan lese (hashing), gir hver side sitt eget krydder så ingen ferdige kodebøker virker (salt), og velger et passord som er for vanskelig å gjette (sterkt passord).</p>",
    "<p>Fire lag beskytter lagrede passord. Hashing gjør at databasen ikke viser passordene. Tilgangskontroll hindrer uvedkommende i å lese den. Salting gjør at angriperen ikke kan bruke ferdige tabeller og må angripe hver bruker for seg. Og hvis databasen likevel stjeles, er det bare passordets styrke som hindrer at det blir gjettet.</p>",
    "<p>Med salt s lagres (s, Hash(s ∥ passord)). En angriper med databasen kan kjøre ordbok- og rå kraft-angrep per bruker, så kostnaden per gjetning bør gjøres høy med en langsom hash (bcrypt, scrypt, Argon2). Lengde (og kompleksitet) øker søkerommet. Regnbuetabeller blir nytteløse fordi hver bruker har sitt eget salt.</p>");

  O.push({
    key: "H2018-7.3", year: Y, oppgave_nr: "Oppgave 7.3", del: D7,
    ark: "7.3 Biometrics", title: "Biometri: fordel og ulemper",
    points: 3, block: "autentisering", tema: ["biometri", "FNMR", "personvern", "brukervennlighet"],
    ordrett: true,
    oppgave: "<p>Name one (1) advantage and two (2) disadvantages/problems/challenges of <strong>biometric authentication</strong>.<br>Points: 1 for each correct answer, 0 for wrong answer, 0 for no answer, max 3 total score</p>",
    inspera: {
      type: "K",
      regelTekst: "Points: 1 for each correct answer, 0 for wrong answer, 0 for no answer, max 3 total score",
      regel: { min: 0, maks: 3 },
      regelMerknad: "Manuell retting: 1 poeng per riktig svar (én fordel + to ulemper), maks 3.",
      deler: [
        { del: "Advantage", poeng: 1, sporsmal: "<p><strong>Advantage</strong></p>", grense: "én fordel" },
        { del: "Disadvantages/Problems/Challenges", poeng: 2, sporsmal: "<p><strong>Disadvantages/Problems/Challenges</strong></p>", grense: "to ulemper" }
      ]
    },
    avvik: null,
    losning: ["Fordel: enkelt, ingenting å huske eller miste.", "Ulemper (to av): falske avvisninger (FNMR), ytelse, personlig sikkerhet (tvang, skade), personvern (kan avsløre sykdom), virker ikke for alle (funksjonsnedsettelser)."],
    tips: ["Kurset kaller falsk avvisning FNMR og falsk aksept FMR. Arket skriver «false negative rate».", "At et biometrisk kjennetegn ikke kan byttes ut slik et passord kan, er også et sterkt ulempe-svar (ikke i arkets liste, men faglig riktig)."]
  });
  P("H2018-7.3",
    [
      { del: "Advantage", tekst: "<p>Lett å bruke: brukeren har alltid med seg kjennetegnet og kan verken glemme eller miste det.</p>", poeng: ["Gyldig fordel (1p)"] },
      { del: "Disadvantages/Problems/Challenges", tekst: "<p>1) Feilrater: legitime brukere kan bli avvist (høy FNMR). 2) Personvern: biometriske data kan avsløre helseopplysninger (f.eks. sykdom).</p>", poeng: ["Første ulempe (1p)", "Andre ulempe (1p)"] }
    ],
    [
      { del: "Advantage", fasit: "<p>Easy to use, can not loose/forget authorization credentials, ...</p>", kriterier: "<p>Points: 1 for each correct answer, 0 for wrong answer, 0 for no answer, max 3 total score</p>" },
      { del: "Disadvantages/Problems/Challenges", fasit: "<p>High false negative rate, low performance, threat for personal safety (e.g. cut finger), threat for privacy (e.g. reveal illness), usability (e.g. handicapped persons)</p>", kriterier: "<p>Points: 1 for each correct answer, 0 for wrong answer, 0 for no answer, max 3 total score</p>" }
    ],
    "Arket skriver «loose» (skrivefeil for «lose»).");
  hv("H2018-7.3",
    "<p>Fingeren din glemmer du aldri hjemme. Men en skitten eller skadet finger kan gjøre at telefonen ikke kjenner deg igjen, og hvis noen får en kopi av fingeravtrykket ditt, kan du ikke bestille en ny finger.</p>",
    "<p>Biometri er bekvemt: det finnes ikke noe å huske eller miste. Ulempene er at målingen aldri er helt sikker (ekte brukere avvises, og av og til godtas feil person), at den kan være treg, at dataene kan avsløre noe om helsen, at noen kan tvinges eller skades for å bruke det, og at ikke alle kan bruke det.</p>",
    "<p>Biometri sammenligner en måling med en mal og godtar når likhetsskåren S er minst terskelen T. Terskelen er en avveining mellom FMR (falsk match) og FNMR (falsk ikke-match); der de er like, ligger EER. Biometri er derfor sannsynlighetsbasert, i motsetning til eksakt sammenligning av passord. Lokal lagring av malen (f.eks. i telefonens sikre område) reduserer personvernrisikoen.</p>");

  O.push({
    key: "H2018-7.4", year: Y, oppgave_nr: "Oppgave 7.4", del: D7,
    ark: "7.4 Authentication Tokens", title: "Autentiseringstokener: sant eller usant",
    points: 3, block: "autentisering", tema: ["token", "OTP", "klokkebasert", "tellerbasert", "utfordring–svar"],
    gjenganger: ["H2021-6.3"],
    ordrett: true,
    oppgave: "<p>Please select for the following statements on <strong>authentication tokens</strong>, if they are true or not.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection.</em></p><p><strong>Please match the values:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Poenglinja har ingen maks; tre rader à 1 gir maks 3. Minimum 0 følger av forsiden.",
      kolonner: ["True", "False"],
      multi: false,
      rader: [
        { s: "The response generated by a \"Challenge Response Based Tokens\" can be captured and used at a later time.", svar: [1], explain: "<p>Usant. Tjeneren sender en ny, tilfeldig utfordring hver gang, så et oppfanget svar passer ikke til neste utfordring. Det er nettopp vernet mot gjenspilling.</p>" },
        { s: "When authenticating with a \"Counter-based OTP Token\", the user must enter the counter value.", svar: [1], explain: "<p>Usant. Tokenet og tjeneren holder hver sin teller og teller opp selv. Brukeren taster bare inn engangskoden.</p>" },
        { s: "\"Clock-based OTP Tokens\" must have the same internal time like the authentication server.", svar: [0], explain: "<p>Sant (etter fasiten). Koden avledes fra tiden, så tokenet og tjeneren må ha (tilnærmet) samme tid. I praksis godtar tjeneren et lite tidsvindu og kompenserer for at klokka i tokenet driver.</p>" }
      ]
    },
    avvik: null,
    losning: ["Utfordring–svar: nytt svar for hver utfordring, så gjenspilling virker ikke: usant.", "Tellerbasert: brukeren taster ikke telleren: usant.", "Klokkebasert: må ha samme tid som tjeneren (innenfor et lite vindu): sant."],
    tips: ["«Same internal time» er sant i den forstand at klokkene må være synkronisert; tjeneren tåler et lite avvik."]
  });
  hv("H2018-7.4",
    "<p>En kodebrikke er som et armbåndsur som viser et nytt tall hvert minutt. Banken har et likt ur, så urene må gå likt. En annen brikke teller bare hvor mange ganger knappen er trykket, og banken teller med. En tredje får et nytt spørsmål fra banken hver gang, så et gammelt svar er verdiløst.</p>",
    "<p>Autentiseringstokener lager engangskoder fra en hemmelig nøkkel de deler med tjeneren. Klokkebaserte tokener bruker tiden og må gå i takt med tjeneren. Tellerbaserte tokener bruker en teller som både tokenet og tjeneren holder selv, så brukeren trenger ikke vite den. Utfordring–svar-tokener regner ut svaret på en ny utfordring fra tjeneren hver gang, så et oppfanget svar kan ikke brukes senere.</p>",
    "<p>Klokkebasert OTP: kode avledet av MAC(K, tidsintervall); tjeneren godtar et lite vindu rundt nåtid og lagrer driften. Tellerbasert: MAC(K, teller), med resynkronisering hvis tokenet er trykket uten innlogging. Utfordring–svar: MAC(K, utfordring) med ny tilfeldig utfordring hver gang. Alle disse bruker en delt symmetrisk nøkkel, som tjeneren må beskytte.</p>");

  /* ============================ PART 8: IDENTITY & ACCESS MANAGEMENT ============================ */

  O.push({
    key: "H2018-8.1", year: Y, oppgave_nr: "Oppgave 8.1", del: D8,
    ark: "8.1 Phases in Identity & Access Management", title: "Fasene i identitets- og tilgangsstyring",
    points: 3, block: "iam", tema: ["IAM", "registrering", "provisjonering", "autorisering", "identifisering", "autentisering", "tilgangskontroll"],
    gjenganger: ["H2021-1.3", "H2022-1.3", "H2023-14"],
    ordrett: true,
    oppgave: "<p>The diagram shows that the configuration phase and the operation phase of <strong>Identity &amp; Access Management</strong> (IAM) consists of steps which represent specific activities. Match each activity in the left column with the corresponding step in the diagram.<br><em>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3</em></p><p><strong>Match activity with step number:</strong></p>",
    figur: {
      beskrivelse: "To avrundede rammer side om side: «Configuration phase» med trinn 1, 2 og 3 under hverandre, og «Operation phase» med trinn 4, 5 og 6 under hverandre, med piler nedover. Et grønt bånd «Identity Management» går over trinn 1, 2, 4 og 5; et gult bånd «Access Management» over trinn 3 og 6. Båndetikettene står i midten mellom rammene. Trinnene har bare nummer, ingen navn.",
      tekst: ["Configuration phase", "Operation phase", "Identity Management", "Access Management", "1", "2", "3", "4", "5", "6"]
    },
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["1", "2", "3", "4", "5", "6"],
      multi: false,
      rader: [
        { s: "Access Control", svar: [5], explain: "<p>Siste trinn i bruksfasen: policyen håndheves ved hver forespørsel: <strong>6</strong>.</p>" },
        { s: "Authentication", svar: [4], explain: "<p>Etter at brukeren har sagt hvem hen er, bevises det: <strong>5</strong>.</p>" },
        { s: "Authorization", svar: [2], explain: "<p>Siste trinn i konfigureringen er å spesifisere hva brukeren får lov til (tilgangspolicyen); det hører til tilgangsstyringen: <strong>3</strong>.</p>" },
        { s: "Self Identification", svar: [3], explain: "<p>Første trinn i bruksfasen: brukeren oppgir identiteten sin (brukernavn): <strong>4</strong>.</p>" },
        { s: "Provisioning", svar: [1], explain: "<p>Etter registreringen får brukeren en konto og en autentikator (f.eks. passord): <strong>2</strong>.</p>" },
        { s: "Registration", svar: [0], explain: "<p>Alt starter med at brukeren registreres og får en identitet: <strong>1</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Konfigurering: 1 registrering, 2 provisjonering, 3 autorisering.", "Bruk: 4 selvidentifisering, 5 autentisering, 6 tilgangskontroll.", "Identitetsstyring = 1, 2, 4, 5. Tilgangsstyring = 3, 6."],
    tips: ["Gjenganger hvert år. Husk parene: registrering ↔ identifisering, provisjonering ↔ autentisering, autorisering ↔ tilgangskontroll.", "Autorisering = spesifisere policy (konfigurering). Tilgangskontroll = håndheve den (bruk)."]
  });
  hv("H2018-8.1",
    "<p>På et treningssenter blir du først registrert, så får du et kort, og det bestemmes hvilke rom du får gå inn i. Hver gang du kommer, sier du hvem du er, viser kortet og blir sluppet inn i de rommene du har lov til.</p>",
    "<p>IAM har en konfigureringsfase og en bruksfase med tre trinn hver. Konfigurering: registrering (identitet opprettes), provisjonering (konto og autentikator utstedes) og autorisering (tilgangspolicyen spesifiseres). Bruk: selvidentifisering (brukernavn), autentisering (bevis) og tilgangskontroll (policyen håndheves). Trinn 1, 2, 4 og 5 er identitetsstyring, trinn 3 og 6 tilgangsstyring.</p>",
    "<p>Hvert trinn i bruksfasen speiler et trinn i konfigureringen: identifisering bruker identiteten fra registreringen, autentisering sjekker mot autentikatoren fra provisjoneringen, og tilgangskontrollen håndhever policyen fra autoriseringen. Feil i et konfigureringstrinn (svak identitetssjekk ved registrering, for vide rettigheter) kan ikke rettes opp i bruksfasen. Livsløpet omfatter også endring og avvikling (deprovisjonering).</p>");

  O.push({
    key: "H2018-8.2", year: Y, oppgave_nr: "Oppgave 8.2", del: D8,
    ark: "8.2 Federation I", title: "Rekkefølgen i føderert innlogging",
    points: 2, block: "iam", tema: ["føderering", "IdP", "SP", "SAML", "SSO"],
    gjenganger: ["H2021-7.2", "H2024-31"],
    ordrett: true,
    oppgave: "<p>Order the steps in a typical <strong>federated Web authentication</strong> scenario by entering the numbers 1 to 5.<br><em>Points: 2 total score for all correct, 0 if any error</em></p>",
    inspera: {
      type: "T",
      regelTekst: "Points: 2 total score for all correct, 0 if any error",
      regel: { riktig: 0, feil: 0, blankt: 0, min: 0, maks: 2, alleRiktig: 2 },
      regelMerknad: "Alt eller ingenting: alle fem tall riktige gir 2, ellers 0. Arket har tekstfelt der tallet skrives inn foran hvert trinn.",
      tekst: "<ul><li>{0}. User authenticates to the Identity Provider.</li><li>{1}. User is redirected to the Service Provider.</li><li>{2}. User is redirected to the Identity Provider.</li><li>{3}. User gets access to ressource at the Service Provider.</li><li>{4}. User accesses a resource at the Service Provider.</li></ul>",
      felt: [
        { etikett: "User authenticates to the Identity Provider.", godta: ["3"], explain: "<p>Hos IdP-en logger brukeren inn: <strong>3</strong>.</p>" },
        { etikett: "User is redirected to the Service Provider.", godta: ["4"], explain: "<p>IdP-en sender brukeren tilbake til SP med en signert påstand om hvem brukeren er: <strong>4</strong>.</p>" },
        { etikett: "User is redirected to the Identity Provider.", godta: ["2"], explain: "<p>SP-en kjenner ikke brukeren og sender hen videre til IdP-en: <strong>2</strong>.</p>" },
        { etikett: "User gets access to ressource at the Service Provider.", godta: ["5"], explain: "<p>SP-en verifiserer påstanden og slipper brukeren inn: <strong>5</strong>.</p>" },
        { etikett: "User accesses a resource at the Service Provider.", godta: ["1"], explain: "<p>Alt starter med at brukeren prøver å nå tjenesten: <strong>1</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["1) Bruker går til SP. 2) Sendes til IdP. 3) Logger inn hos IdP. 4) Sendes tilbake til SP med påstand. 5) Får tilgang."],
    tips: ["Arket skriver «ressource» (skrivefeil).", "Brukeren logger aldri inn hos SP-en selv; passordet ses bare av IdP-en."]
  });
  hv("H2018-8.2",
    "<p>Du vil inn på en konsert. Vakten sier: «Gå til billettluka og vis legitimasjon.» Der får du et armbånd. Vakten ser armbåndet og slipper deg inn, uten å ha sett legitimasjonen din selv.</p>",
    "<p>I føderert innlogging stoler tjenesten (SP) på en identitetsleverandør (IdP). Brukeren prøver å nå tjenesten, blir sendt til IdP-en, logger inn der, og blir sendt tilbake med en signert påstand (sikkerhetsbillett). SP-en sjekker påstanden og gir tilgang.</p>",
    "<p>I SAML-nettleserflyten skjer omdirigeringene via brukerens nettleser: SP lager en autentiseringsforespørsel, IdP autentiserer og returnerer en signert påstand som SP verifiserer med IdP-ens offentlige nøkkel. Fordelen er enkel pålogging og at SP-en aldri ser passordet; risikoen er at IdP-en blir et enkelt feilpunkt og et attraktivt mål.</p>");

  O.push({
    key: "H2018-8.3", year: Y, oppgave_nr: "Oppgave 8.3", del: D8,
    ark: "8.3 Federation II", title: "Eduroam: hvilken type føderering?",
    points: 1, block: "iam", tema: ["føderering", "Eduroam", "distribuert identitet"],
    gjenganger: ["H2023-13", "H2022-9.1"],
    ordrett: true,
    oppgave: "<p>Select the <strong>federation type</strong> of the eduroam system.<br><em>Points: 1 for correct, 0 for wrong, 0 for no selection</em></p><p><strong>Select an alternative:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Points: 1 for correct, 0 for wrong, 0 for no selection",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: [
        "Distributed Identity + Distributed Authentication",
        "Centralized Identity + Centralized Authentication",
        "Centralized Identity + Distributed Authentication",
        "Distributed Identity + Centralized Authentication"
      ],
      svar: 0,
      explain: [
        "<p>Riktig etter fasiten. Hver institusjon eier sine brukere (distribuert identitet), og autentiseringen skjer hos mange institusjoner (distribuert autentisering); føderasjonen knytter dem sammen.</p>",
        "<p>Feil. Det ville vært én aktør som både eier alle identitetene og autentiserer alle, som tysk eID.</p>",
        "<p>Feil. Det finnes ikke ett felles navnerom for identitetene; hver institusjon har sitt eget (bruker@institusjon). Kurset bruker ID-porten som eksempel på denne kombinasjonen.</p>",
        "<p>Feil etter fasiten. Merk likevel at 2026-lysarkene plasserer FEIDE og Eduroam i nettopp denne ruten. Se avvik.</p>"
      ]
    },
    avvik: "Arkets fasit sier «Distributed Identity + Distributed Authentication». 2026-lysarkene for IAM (D09 IAM, PDF-side med «Føderert identitetshåndtering – eksempler») sier at FEIDE og Eduroam har distribuert navnerom, men sentralisert autentisering, fordi en bruker bare kan autentiseres av hjemmeinstitusjonen. Øvingen retter etter arket. På eksamen 2026 bør du følge lysarkene og gjerne begrunne kort.",
    losning: ["Arket: distribuert identitet + distribuert autentisering (hver institusjon eier og autentiserer sine brukere).", "2026-lysarkene: distribuert identitet (navnerom) + sentralisert autentisering (bare hjemmeinstitusjonen kan autentisere brukeren)."],
    tips: ["Dette er et kjent sted der eldre fasit og dagens lysark sier ulikt. Les begrunnelsen og velg det lysarkene sier i 2026."]
  });
  hv("H2018-8.3",
    "<p>Hver skole har sin egen elevliste og sin egen vakt som sjekker elevkortene. Når en elev besøker en annen skole, ringer vakten der til elevens egen skole og spør: «Er dette en av deres?»</p>",
    "<p>I Eduroam eier hver institusjon sine egne brukere, så identitetene er distribuert. Brukeren autentiseres alltid hos sin egen institusjon. Om det kalles distribuert eller sentralisert autentisering, avhenger av perspektivet: fra føderasjonen sett skjer det hos mange institusjoner (arkets svar); for hver enkelt bruker skjer det bare ett sted (lysarkenes svar).</p>",
    "<p>Eduroam bruker et hierarki av RADIUS-tjenere: besøkt institusjon videresender forespørselen via nasjonale tjenere til brukerens hjeminstitusjon, som autentiserer. Klassifiseringen i 2×2-matrisen (navnerom × autentisering) er altså uklar for føderasjoner, og det forklarer at fasit og lysark spriker.</p>");

  O.push({
    key: "H2018-8.4", year: Y, oppgave_nr: "Oppgave 8.4", del: D8,
    ark: "8.4 Access Control", title: "Rollebasert tilgangskontroll: Carys rettigheter",
    points: 4, block: "iam", tema: ["RBAC", "DAC", "tilgangsmatrise", "roller"],
    gjenganger: ["H2021-7.3"],
    ordrett: true,
    oppgave: "<p>Above you see an <strong>access control policy</strong>.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 4 total score</em></p>",
    figur: {
      beskrivelse: "Til venstre fire brukere med piler til roller: John → R1; Cary → R1 og R2; Mary → R2; Walter → R3 og R4. Til høyre en tilgangsmatrise med overskriften «Objects» over kolonnene O1–O4 og etiketten «Roles» ved radene R1–R4 (hjørnecellen: «Columns→ ↓Rows»). R1: r,w | - | x | r. R2: r | - | r | r,w. R3: - | x | - | -. R4: r,w | x | x | x.",
      tekst: ["John", "Cary", "Mary", "Walter", "R1", "R2", "R3", "R4", "O1", "O2", "O3", "O4", "Roles", "Objects", "Columns→", "↓Rows"]
    },
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 4 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
      sporsmal: [
        {
          tekst: "<p>What type(s) of access control principle(s) is/are illustrated?</p><p><strong>Select one or more alternatives:</strong></p>",
          alternativer: ["Role-based (RBAC)", "Mandatory (MAC)", "Attribute-based (ABAC)", "Discretionary (DAC)"],
          svar: [0, 3],
          explain: [
            "<p>Riktig. Brukere får rettigheter gjennom roller: <strong>rollebasert</strong> tilgangskontroll.</p>",
            "<p>Feil. Det er ingen klareringer eller graderinger i figuren (MAC = obligatorisk tilgangskontroll, f.eks. Bell-LaPadula).</p>",
            "<p>Feil. Det er ingen attributter eller regler i figuren, bare roller og en matrise.</p>",
            "<p>Riktig etter fasiten. Tilgangsmatrisen (rad = subjekt, kolonne = objekt, celle = rettigheter) er den klassiske måten å vise <strong>DAC</strong> på. Se avvik.</p>"
          ]
        },
        {
          tekst: "<p>To which file(s) can Cary append further data (i.e. add data at the end of file)?</p><p><strong>Select one or more alternatives</strong></p>",
          alternativer: ["O1", "O2", "O3", "O4"],
          svar: [0, 3],
          explain: [
            "<p>Riktig. Å legge til data krever skriverett (w). Cary har R1, og R1 har r,w på O1.</p>",
            "<p>Feil. Verken R1 eller R2 har noen rettighet på O2 (bare R3 og R4 har x).</p>",
            "<p>Feil. R1 har x og R2 har r på O3, ingen w.</p>",
            "<p>Riktig. Cary har R2, og R2 har r,w på O4.</p>"
          ]
        }
      ]
    },
    avvik: "Om figuren viser DAC, kan diskuteres. En tilgangsmatrise er en representasjon som brukes i DAC, men her er radene roller, og det står ingenting om at eiere selv kan dele rettigheter (det som kjennetegner DAC). Fasiten krysser av både RBAC og DAC; øvingen følger fasiten.",
    losning: ["Prinsipp: RBAC (brukere → roller → rettigheter), og etter fasiten DAC (tilgangsmatrisen).", "Cary har R1 og R2. Å legge til data krever w: O1 (via R1) og O4 (via R2)."],
    tips: ["Slå sammen rettighetene fra alle rollene brukeren har. Én rolle med w holder.", "«Append» er skriving: se etter w, ikke r eller x."]
  });
  hv("H2018-8.4",
    "<p>På en skole har lærerne én rolle og bibliotekarene en annen. Hver rolle har noen nøkler. Cary er både lærer og bibliotekar, så Cary får nøklene til begge rollene.</p>",
    "<p>I RBAC tildeles rettigheter til roller, og brukere får roller. Brukerens rettigheter er summen av rettighetene til alle rollene hen har. Cary har R1 og R2; R1 gir skriving på O1 og R2 gir skriving på O4. Tilgangsmatrisen viser hvilke rettigheter hver rolle har på hvert objekt.</p>",
    "<p>RBAC kobler brukere til roller og roller til rettigheter, slik at endringer skjer på rollenivå. Tilgangsmatrisen (subjekt × objekt → rettigheter) er en generell representasjon; lagret per kolonne gir den tilgangslister (ACL). DAC kjennetegnes av at eieren selv deler rettigheter, MAC av at systemet bestemmer ut fra klarering og gradering, og ABAC av regler over attributter.</p>");

  /* ============================ PART 9: NETWORK PERIMETER SECURITY ============================ */

  O.push({
    key: "H2018-9.1", year: Y, oppgave_nr: "Oppgave 9.1", del: D9,
    ark: "9.1 Firewall", title: "Brannmurer: hvilke påstander er sanne?",
    points: 2, block: "nettverk", tema: ["brannmur", "tilstandsbasert", "pakkefilter", "proxy", "iptables"],
    gjenganger: ["H2021-5.4", "H2022-7.3"],
    ordrett: true,
    oppgave: "<p>Select the statements on <strong>firewalls</strong> that are true:<br><em>Points: 1 for each correct, -1 for wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selection, max 2 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      alternativer: [
        "Stateful packet filters can correlate a DNS response to a prior DNS request.",
        "A packet filter operates on the OSI layers 3 and 2.",
        "A application layer proxy can handle all protocols on top of TCP.",
        "A network firewall completely separates two networks.",
        "The Linux iptables is an implementation of an application layer proxy.",
        "In proxy mode, the client makes a TCP connection to the firewall and the firewall creates a second TCP connection to the server."
      ],
      svar: [0, 5],
      explain: [
        "<p>Riktig. Et tilstandsbasert pakkefilter husker utgående forespørsler (også UDP som DNS) og slipper bare inn svar som passer til en forespørsel.</p>",
        "<p>Feil. Et pakkefilter ser på IP-hodet (lag 3) og porter i TCP/UDP-hodet (lag 4), ikke lag 2.</p>",
        "<p>Feil. En applikasjonsproxy må forstå hver protokoll den skal filtrere, så den håndterer bare protokollene den er laget for.</p>",
        "<p>Feil. En brannmur skiller ikke nettene helt; den slipper gjennom trafikk etter reglene sine. Full adskillelse ville vært et luftgap.</p>",
        "<p>Feil. iptables er et (tilstandsbasert) pakkefilter i Linux-kjernen, ikke en applikasjonsproxy.</p>",
        "<p>Riktig. I proxymodus avslutter brannmuren klientens TCP-forbindelse og åpner en egen forbindelse mot tjeneren, slik at den kan inspisere innholdet.</p>"
      ]
    },
    avvik: null,
    losning: ["Sant: tilstandsbasert filter kobler DNS-svar til forespørsel; proxy gir to TCP-forbindelser.", "Usant: pakkefilter er lag 3–4, ikke 2; proxy kan ikke alle protokoller; brannmur skiller ikke nettene helt; iptables er pakkefilter."],
    tips: ["Arket skriver «A application layer proxy» (grammatikkfeil i originalen).", "Jo høyere i protokollstakken brannmuren ser, jo mer kan den oppdage, men jo mer må den forstå av hver protokoll."]
  });
  hv("H2018-9.1",
    "<p>En enkel dørvakt sjekker bare adressen på konvolutten. En smartere vakt husker hvem som sendte brev ut, og slipper bare inn svarene. Den smarteste tar imot brevet selv, leser det og sender et nytt brev videre.</p>",
    "<p>Et pakkefilter vurderer pakker ut fra hodefeltene (adresser, porter, protokoll). Et tilstandsbasert filter husker forbindelser og forespørsler og godtar bare trafikk som hører til, også svar på DNS-spørringer. En proxy-brannmur avslutter forbindelsen og lager en ny mot tjeneren, så den kan se og filtrere innholdet på applikasjonslaget, men bare for protokoller den forstår.</p>",
    "<p>For UDP finnes ingen forbindelse, så det tilstandsbaserte filteret lager en pseudoforbindelse ut fra adresser og porter, med tidsavbrudd. iptables er Linux-kjernens pakkefilter med tilstandssporing. Proxyen gir innholdsinspeksjon, men trenger egen logikk per protokoll og blir lett en flaskehals.</p>");

  O.push({
    key: "H2018-9.2", year: Y, oppgave_nr: "Oppgave 9.2", del: D9,
    ark: "9.2 TLS Inspection", title: "TLS-inspeksjon i brannmuren",
    points: 2, block: "nettverk", tema: ["TLS-inspeksjon", "proxy", "rotsertifikat", "mann-i-midten"],
    gjenganger: ["H2023-11"],
    ordrett: true,
    oppgave: "<p>Mark the statements on <strong>TLS inspection</strong> that are true.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Poenglinja har ingen maks; to riktige alternativer gir maks 2. Minimum 0 følger av forsiden.",
      alternativer: [
        "Requires an additional root certificate installed on clients.",
        "Always creates a browser warning that, however, is ignored by most users",
        "Two TLS connections are created: Client to Proxy and Proxy to Server",
        "Works only with outdated TLS versions"
      ],
      svar: [0, 2],
      explain: [
        "<p>Riktig. Proxyen lager sertifikater for tjenerne fortløpende, signert av sin egen CA. Klienten godtar dem bare hvis det ekstra rotsertifikatet er installert.</p>",
        "<p>Feil. Når rotsertifikatet er installert på klienten, stoler nettleseren på proxyens sertifikater, og det kommer ingen advarsel.</p>",
        "<p>Riktig. Proxyen er en kontrollert mann-i-midten: én TLS-forbindelse mot klienten og én mot tjeneren, med klartekst imellom.</p>",
        "<p>Feil. TLS-inspeksjon virker med alle versjoner, også nyere, så lenge klienten stoler på proxyens rotsertifikat.</p>"
      ]
    },
    avvik: null,
    losning: ["Proxyen avslutter TLS mot klienten (med eget sertifikat) og åpner ny TLS mot tjeneren.", "Klienten må ha proxyens rotsertifikat; da kommer ingen advarsel, og alle TLS-versjoner kan inspiseres."],
    tips: ["Ulempen: proxyen ser alt i klartekst og må selv validere tjenernes sertifikater riktig, ellers svekkes sikkerheten for alle."]
  });
  hv("H2018-9.2",
    "<p>Det er som en tolk som sitter mellom to personer: du snakker hemmelig med tolken, og tolken snakker hemmelig med den andre. Du stoler på tolken fordi arbeidsgiveren har godkjent hen (rotsertifikatet).</p>",
    "<p>Ved TLS-inspeksjon bryter proxyen (brannmuren) den krypterte forbindelsen i to: én TLS-forbindelse mellom klient og proxy, og én mellom proxy og tjener. Mot klienten viser proxyen et sertifikat den har laget selv, signert med sin egen CA, som organisasjonen har installert som rotsertifikat på klientene. Derfor kommer det ingen advarsel, og proxyen kan se innholdet og lete etter skadevare.</p>",
    "<p>Proxyen må validere tjenerens ekte sertifikat på klientens vegne; gjør den det dårlig, mister klienten beskyttelsen. Sertifikatfesting (pinning) i apper bryter med inspeksjonen. Nyere TLS-versjoner gjør passiv dekryptering umulig, men aktiv mann-i-midten med et klarert rotsertifikat virker fortsatt.</p>");

  O.push({
    key: "H2018-9.3", year: Y, oppgave_nr: "Oppgave 9.3", del: D9,
    ark: "9.3 IDS", title: "Anomali- eller signaturdeteksjon?",
    points: 3, block: "nettverk", tema: ["IDS", "anomalideteksjon", "signaturdeteksjon", "falske alarmer"],
    gjenganger: ["H2023-31"],
    ordrett: true,
    oppgave: "<p>The two main techniques used in <strong>Intrusion Detection Systems</strong> (IDS) are Signature-Based Detection and Anomaly-Based Detection respectively. Select the <em>relevant IDS technique</em> for each property in the left column below.<br><em>Points: 1 for each correct, -1 for wrong, 0 for no selection, max 3 total score</em></p><p><strong>Select the relevant IDS technique for each property:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selection, max 3 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Anomaly Detection", "Signature Detection"],
      multi: false,
      rader: [
        { s: "Based on learning normal behaviour", svar: [0], explain: "<p>Anomalideteksjon lærer først hva normal atferd er, og varsler om avvik: <strong>Anomaly Detection</strong>.</p>" },
        { s: "Can only detect known attacks", svar: [1], explain: "<p>Signaturer finnes bare for angrep man har sett før: <strong>Signature Detection</strong>.</p>" },
        { s: "Generates relatively many false intrusion alarms", svar: [0], explain: "<p>Alt uvanlig, også legitim ny atferd, utløser alarm: <strong>Anomaly Detection</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Anomali: lærer normal atferd, kan finne ukjente angrep, mange falske alarmer.", "Signatur: bare kjente angrep, få falske alarmer."],
    tips: ["Anomali = «avvik fra normalen», signatur = «ligner kjent angrep». Resten følger av det."]
  });
  hv("H2018-9.3",
    "<p>En vakt med en liste over kjente tyver (signatur) stopper bare dem som står på lista. En vakt som kjenner alle de vanlige gjestene (anomali), reagerer på alle nye ansikter, også de som er helt ufarlige.</p>",
    "<p>Signaturdeteksjon sammenligner trafikken med mønstre fra kjente angrep: få falske alarmer, men ser ikke nye angrep. Anomalideteksjon lærer hva som er normalt og varsler om avvik: kan finne ukjente angrep, men gir mange falske alarmer.</p>",
    "<p>Signaturer må oppdateres når nye angrep blir kjent, og varianter kan unngå dem. Anomalimodeller (statistikk, maskinlæring) kan forgiftes hvis angriperen er til stede mens normalen læres, og normalen endrer seg over tid. I praksis kombineres begge.</p>");

  O.push({
    key: "H2018-9.4", year: Y, oppgave_nr: "Oppgave 9.4", del: D9,
    ark: "9.4 DMZ", title: "Brannmurregler i en DMZ-arkitektur",
    points: 2, block: "nettverk", tema: ["DMZ", "brannmur", "regelsett", "tilstandsbasert"],
    ordrett: true,
    oppgave: "<p>Above you see a common <strong>DMZ-based network architecture</strong>. Asume a typical firewall configuration. Select for the following firewall rules, if they apply to the internal or the external firewall (or both or none of them).</p><p>\"Incoming\" means \"from Internet to DMZ\" or \"from \"DMZ to Internal\"; \"outgoing\" the opposite direction.<br><em>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection</em></p><p><strong>Please match the values:</strong></p>",
    figur: {
      beskrivelse: "Nettverksskisse: en sky «Internet» kobles til en loddrett nettlinje med «External Router / Firewall». Fra linja går en vannrett buss til venstre, merket «DMZ (Demilitarized Zone)», med tre tjenere: «DNS Server», «Web Server» og «Email Server». Lenger ned på den loddrette linja sitter «Internal Router / Firewall», og bak den en vannrett buss «Internal Networks» med to arbeidsstasjoner («Workstations»), «Production Systems» og «DB Server».",
      tekst: ["Internet", "External Router / Firewall", "DMZ (Demilitarized Zone)", "DNS Server", "Web Server", "Email Server", "Internal Router / Firewall", "Internal Networks", "Workstations", "Production Systems", "DB Server"]
    },
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Poenglinja har ingen maks; fire rader à 0,5 gir maks 2. Minimum 0 følger av forsiden.",
      kolonner: ["Internal", "External", "Both", "None"],
      multi: false,
      rader: [
        { s: "Block incoming connections to port 80 (HTTP)", svar: [0], explain: "<p>Webtjeneren står i DMZ-en og skal nås fra Internett, så den ytre brannmuren må slippe inn port 80. Den indre brannmuren skal blokkere innkommende tilkoblinger fra DMZ-en til det interne nettet: <strong>Internal</strong>.</p>" },
        { s: "Allow outgoing connections to port 80 (HTTP)", svar: [2], explain: "<p>Interne brukere skal kunne surfe; forbindelsene deres går ut gjennom begge brannmurene: <strong>Both</strong>.</p>" },
        { s: "Activate stateful filtering", svar: [2], explain: "<p>Begge brannmurene må slippe tilbake svar på tillatte forbindelser uten å åpne for alt, så begge bør filtrere tilstandsbasert: <strong>Both</strong>.</p>" },
        { s: "Allow incoming connections to port 25 (SMTP)", svar: [1], explain: "<p>E-posttjeneren i DMZ-en skal ta imot e-post (SMTP) fra Internett, og bare den ytre brannmuren må slippe det inn: <strong>External</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Ytre brannmur slipper inn til DMZ-tjenestene (f.eks. 25 og 80).", "Indre brannmur blokkerer innkommende til det interne nettet.", "Utgående surfing og tilstandsbasert filtrering: begge."],
    tips: ["Arket skriver «Asume» (skrivefeil).", "Tenk deg en pakke og følg den: hvilke brannmurer passerer den?"]
  });
  hv("H2018-9.4",
    "<p>DMZ-en er som en resepsjon mellom gaten og kontorene. Besøkende slipper inn i resepsjonen (ytre dør), men ikke videre inn på kontorene (indre dør). De ansatte kan gå ut gjennom begge dørene.</p>",
    "<p>I en DMZ-arkitektur står tjenester som skal nås fra Internett (web, e-post, DNS) mellom to brannmurer. Den ytre brannmuren slipper inn trafikk til disse tjenestene. Den indre brannmuren beskytter det interne nettet og slipper ikke inn tilkoblinger fra DMZ-en. Trafikk fra interne brukere ut på nettet, og svarene på den, må gjennom begge brannmurene.</p>",
    "<p>Hvis en tjener i DMZ-en blir kompromittert, står angriperen fortsatt utenfor den indre brannmuren. Derfor skal regelsettet for den indre være strengt: helst bare tilkoblinger fra innsiden og ut. Å blokkere innkommende port 80 på den ytre ville stengt webtjeneren.</p>");

  O.push({
    key: "H2018-9.5", year: Y, oppgave_nr: "Oppgave 9.5", del: D9,
    ark: "9.5 Attack detection", title: "Lokkesystem for å studere angripere",
    points: 1, block: "nettverk", tema: ["honeypot", "honningkrukke", "angrepsdeteksjon"],
    ordrett: true,
    oppgave: "<p>What is a system called that appears to the outside like a normal, valuable network ressource, but has the only pupose to <strong>lure attackers</strong> and analyse their behaviour?<br><em>Points: max 1 total score</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 1 total score",
      regel: { min: 0, maks: 1 },
      regelMerknad: "Manuell retting.",
      deler: [{ del: "", poeng: 1, grense: "ett ord" }]
    },
    avvik: null,
    losning: ["Honeypot (honningkrukke)."],
    tips: ["Arket skriver «pupose» og «ressource» (skrivefeil).", "Siden en honeypot ikke har noen legitime brukere, er all trafikk til den mistenkelig, og det gjør den nyttig for deteksjon."]
  });
  P("H2018-9.5",
    [{ del: "", tekst: "<p>En honeypot (honningkrukke).</p>", poeng: ["Honeypot (1p)"] }],
    [{ del: "", fasit: "<p>Honeypot</p>", kriterier: "<p>Points: max 1 total score</p>" }]);
  hv("H2018-9.5",
    "<p>En honeypot er som en falsk pengeskuff satt ut for å fange tyver: den har ingen ekte penger, men et kamera som filmer alle som prøver seg.</p>",
    "<p>En honeypot (honningkrukke) er et system eller en tjeneste som ser ut som et verdifullt mål, men som ikke brukes til noe annet. Fordi ingen legitime brukere skal dit, er all trafikk et tegn på angrep, og man kan studere angriperens metoder uten å risikere ekte data.</p>",
    "<p>Honeypots finnes med lav interaksjon (emulerer tjenester, lite risiko) og høy interaksjon (ekte systemer, mer informasjon, mer risiko). De må isoleres slik at angriperen ikke kan bruke dem som springbrett. Ubrukte («mørke») IP-adresser kan fungere som en billig variant: all trafikk dit er mistenkelig.</p>");

  /* ============================ PART 10: APPLICATION SECURITY ============================ */

  O.push({
    key: "H2018-10.1", year: Y, oppgave_nr: "Oppgave 10.1", del: D10,
    ark: "10.1 Botnet", title: "Typiske angrep fra botnett",
    points: 2, block: "angrep", tema: ["botnett", "DDoS", "spam", "skadevare"],
    ordrett: true,
    oppgave: "<p>What are the most common attacks executed by a <strong>botnet</strong>?<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      alternativer: ["SQL Injection", "DDoS", "Sending SPAM", "XSS"],
      svar: [1, 2],
      explain: [
        "<p>Feil. SQL-injeksjon utnytter en sårbarhet i én webapplikasjon og trenger ikke mange maskiner.</p>",
        "<p>Riktig. Mange maskiner som sender trafikk samtidig, er nettopp det et distribuert tjenestenektangrep trenger.</p>",
        "<p>Riktig. Søppelpost sendes fra mange ulike adresser for å komme rundt filtre og svartelister.</p>",
        "<p>Feil. XSS er en sårbarhet i webapplikasjoner, ikke noe som trenger et botnett.</p>"
      ]
    },
    avvik: null,
    losning: ["De to klassiske: DDoS og spam.", "SQL-injeksjon og XSS er angrep på webapplikasjoner, ikke typisk botnettbruk."],
    tips: ["Tenk: hva krever mange maskiner med ulike IP-adresser? Det er det botnett brukes til."]
  });
  hv("H2018-10.1",
    "<p>Et botnett er en hær av zombie-datamaskiner som en skurk styrer. En hær er god til å stå tusen stykker i døra samtidig (DDoS) og til å dele ut millioner av reklameflygeblad fra forskjellige steder (spam).</p>",
    "<p>Et botnett er mange infiserte maskiner som styres fra en kommando- og kontrolltjener. Styrken er antallet og at maskinene har ulike IP-adresser. Det gjør dem ideelle til DDoS-angrep og til å sende spam som er vanskelig å blokkere.</p>",
    "<p>Botnett styres sentralt (C2-tjener) eller via P2P for å tåle nedtaking. Mirai (2016) brukte et stort antall IoT-enheter med standardpassord til svært store DDoS-angrep. Botnett leies også ut som tjeneste til andre kriminelle.</p>");

  O.push({
    key: "H2018-10.2", year: Y, oppgave_nr: "Oppgave 10.2", del: D10,
    ark: "10.2 Web Security", title: "Innlogging som omgår passordsjekken",
    points: 3, block: "angrep", tema: ["SQL-injeksjon", "webapplikasjon", "innlogging"],
    gjenganger: ["H2024-23"],
    ordrett: true,
    oppgave: "<p>Assume a Web login, where the user can enter an email address and a password. The entered parameters (<em>&lt;email&gt;</em> and <em>&lt;passwd&gt;</em>) are forwarded to the following SQL statement inside the Web application:</p><pre><code>SELECT userid FROM user WHERE email = '&lt;email&gt;' AND passwd = '&lt;passwd&gt;';</code></pre><p>If the SQL result is not empty, the user is authenticated.<br>An attacker enters as email:</p><pre><code>admin@company.com</code></pre><p>and as password:</p><pre><code>••••••••</code></pre><p><em>[Passordfeltet er maskert her. På arket er det en inndata som starter med en apostrof, slik at strengen avsluttes, og deretter legger til en OR-betingelse som alltid er sann.]</em></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 2 / Points: max 1",
      regel: { min: 0, maks: 3 },
      regelMerknad: "Manuell retting: A) maks 2, B) maks 1.",
      deler: [
        { del: "A)", poeng: 2, sporsmal: "<p>What will happen?<br><em>Points: max 2</em></p>", grense: "to setninger" },
        { del: "B)", poeng: 1, sporsmal: "<p>What is the name of this type of attack?<br><em>Points: max 1</em></p>", grense: "navnet" }
      ]
    },
    avvik: null,
    losning: ["A) Apostrofen avslutter passordstrengen, og OR-betingelsen som alltid er sann, gjør hele WHERE-uttrykket sant for alle rader. Spørringen returnerer alle userid-er (ikke tomt), og angriperen blir autentisert (som admin) uten å kunne passordet.", "B) SQL-injeksjon."],
    tips: ["Passordfeltet i arkets inndata er maskert her; poenget er at inndata endrer selve SQL-setningen.", "AND binder sterkere enn OR: (email = … AND passwd = …) OR (alltid sant) er sant for alle rader.", "Tiltak: parametriserte spørringer (prepared statements), ikke filtrering av enkelttegn."]
  });
  P("H2018-10.2",
    [
      { del: "A)", tekst: "<p>Inndata bryter ut av passordstrengen og legger til en betingelse som alltid er sann. WHERE-uttrykket blir derfor sant for alle rader, spørringen returnerer hele userid-kolonnen, og siden resultatet ikke er tomt, blir angriperen autentisert (som admin) uten å kunne passordet.</p>", poeng: ["WHERE blir alltid sann / passordsjekken omgås (1p)", "Resultatet er ikke tomt, angriperen autentiseres som admin (1p)"] },
      { del: "B)", tekst: "<p>SQL-injeksjon.</p>", poeng: ["SQL-injeksjon (1p)"] }
    ],
    [
      { del: "A)", fasit: "<p>The WHERE statement is evaluated to \"TRUE\", SQL statement returns the complete userid table and the attacker is authenticated as admin.</p>", kriterier: "<p>Points: max 2</p>" },
      { del: "B)", fasit: "<p>SQL injection</p>", kriterier: "<p>Points: max 1</p>" }
    ],
    "Fordelingen 1 + 1 i A) er vår antakelse. Passordinndata fra arket er maskert.");
  hv("H2018-10.2",
    "<p>Tenk deg en vakt som leser lappen din høyt som en ordre: «Slipp inn hvis e-posten er ___ og passordet er ___.» Skriver du noe i passordfeltet som endrer selve ordren til «… eller slipp inn uansett», slipper du inn uten passord.</p>",
    "<p>Applikasjonen limer brukerens tekst rett inn i SQL-setningen. Tegn i inndata kan da endre betydningen av setningen: en apostrof avslutter strengen, og en OR-betingelse som alltid er sann, gjør hele WHERE-uttrykket sant. Spørringen gir da treff, og applikasjonen tror innloggingen lyktes. Dette heter SQL-injeksjon.</p>",
    "<p>Fordi AND binder sterkere enn OR, blir uttrykket (email = 'admin@…' AND passwd = '…') OR (alltid sant), som er sant for alle rader. Applikasjonen tolker «minst én rad» som vellykket innlogging. Rotårsaken er at data og kode blandes; løsningen er parametriserte spørringer der inndata aldri tolkes som SQL, pluss minste privilegium for databasebrukeren.</p>");

  O.push({
    key: "H2018-10.3", year: Y, oppgave_nr: "Oppgave 10.3", del: D10,
    ark: "10.3 Data protection", title: "Hva krever GDPR?",
    points: 3, block: "lov", tema: ["personvern", "GDPR", "dataminimering", "lagringsbegrensning", "innsynsrett"],
    ordrett: true,
    oppgave: "<p>Mark those statements that are demanded by the <strong>GDPR regulation</strong>.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 3 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 3 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      alternativer: [
        "All personal identifying data must be anonymized.",
        "The user must be informed which algorithms are used for encryption.",
        "It is forbidden to store process highly sensitive data (e.g. medical data).",
        "Stored data must be erased when it is not required any more.",
        "Only data necessary for the given purpose can be processed.",
        "The user can request an overview of all his/her stored data from a service."
      ],
      svar: [3, 4, 5],
      explain: [
        "<p>Feil. GDPR regulerer behandling av personopplysninger; den krever ikke at alt anonymiseres (da ville GDPR ikke gjelde dataene lenger).</p>",
        "<p>Feil. Den registrerte har krav på informasjon om behandlingen, men ikke om hvilke krypteringsalgoritmer som brukes.</p>",
        "<p>Feil. Særlige kategorier som helseopplysninger har strengere vilkår, men behandling er ikke forbudt (f.eks. i helsetjenesten).</p>",
        "<p>Riktig. <strong>Lagringsbegrensning</strong>: data skal slettes når formålet ikke lenger krever dem.</p>",
        "<p>Riktig. <strong>Dataminimering</strong>: bare det som er nødvendig for formålet.</p>",
        "<p>Riktig. <strong>Innsynsrett</strong>: den registrerte kan be om å få se hvilke opplysninger som er lagret.</p>"
      ]
    },
    avvik: null,
    losning: ["Sant: slette når ikke lenger nødvendig, bare nødvendige data, rett til innsyn.", "Usant: ikke krav om anonymisering av alt, ikke krav om å oppgi algoritmer, sensitive data er ikke forbudt."],
    tips: [UTENFOR + "GDPR-prinsippene står ikke på 2026-lysarkene.", "Arket skriver «store process» (trolig «store or process»)."]
  });
  hv("H2018-10.3",
    "<p>Gir du telefonnummeret ditt til en pizzabutikk for levering, skal de bare be om det de trenger, slette det når de ikke trenger det mer, og vise deg hva de har lagret hvis du spør.</p>",
    "<p>Personvernforordningen bygger på noen prinsipper: bare samle inn det som trengs (dataminimering), bare bruke det til formålet (formålsbegrensning), og slette det når det ikke lenger trengs (lagringsbegrensning). Den registrerte har rettigheter, blant annet innsyn. Sensitive data er ikke forbudt, men har strengere vilkår, og hvilke tekniske tiltak som brukes, bestemmer virksomheten.</p>",
    "<p>GDPR art. 5 lister prinsippene (lovlighet og åpenhet, formålsbegrensning, dataminimering, riktighet, lagringsbegrensning, integritet og konfidensialitet, ansvarlighet). Art. 9 setter vilkår for særlige kategorier som helse. Art. 15 gir innsynsrett. Art. 32 krever sikkerhet tilpasset risikoen og nevner kryptering og pseudonymisering som mulige tiltak.</p>");

  O.push({
    key: "H2018-10.4", year: Y, oppgave_nr: "Oppgave 10.4", del: D10,
    ark: "10.4 OWASP", title: "OWASP Topp 10",
    points: 2, block: "utvikling", tema: ["OWASP Topp 10", "injeksjon", "autentisering"],
    gjenganger: ["H2022-4.2", "H2025-32"],
    ordrett: true,
    oppgave: "<p>Select attacks/threats/vulnerabilities that are included in the <strong>OWASP Top 10</strong> list.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      alternativer: ["Broken Authentication", "Injection", "Trojan horse", "Open TCP port"],
      svar: [0, 1],
      explain: [
        "<p>Riktig. Broken Authentication sto på 2017-lista som gjaldt da eksamen ble gitt (i 2021 omdøpt til Identification and Authentication Failures).</p>",
        "<p>Riktig. Injection sto øverst på 2017-lista og er fortsatt med.</p>",
        "<p>Feil. En trojansk hest er skadevare, ikke en sårbarhet i webapplikasjoner.</p>",
        "<p>Feil. En åpen TCP-port er ikke i seg selv en sårbarhet, og ikke en kategori på lista.</p>"
      ]
    },
    avvik: null,
    losning: ["OWASP Topp 10 handler om risikoer i webapplikasjoner: injeksjon og ødelagt autentisering er med.", "Skadevare og åpne porter er ikke kategorier på lista."],
    tips: [UTENFOR + "OWASP Topp 10 har ingen egne 2026-lysark.", "Gjeldende liste da eksamen ble gitt, var 2017-utgaven. Nyere utgaver har andre navn og plasseringer."]
  });
  hv("H2018-10.4",
    "<p>OWASP Topp 10 er en «verstingliste» over de vanligste feilene i nettsider, omtrent som en liste over de vanligste grunnene til innbrudd i hus.</p>",
    "<p>OWASP lager med noen års mellomrom en liste over de ti viktigste sikkerhetsrisikoene i webapplikasjoner. Injeksjon og ødelagt autentisering er klassiske kategorier. En trojansk hest (skadevare) og en åpen port er sikkerhetstemaer, men ikke risikoer i selve webapplikasjonen.</p>",
    "<p>Lista bygger på data fra mange organisasjoner og en spørreundersøkelse. I 2017-utgaven sto injeksjon på førsteplass og ødelagt autentisering på andreplass; senere utgaver har slått sammen og omdøpt kategorier (autentisering heter nå Identification and Authentication Failures).</p>");

  /* ============================ SETT SAMMEN ============================ */

  BANK["H2018"] = {
    year: "H2018", dato: "11.12.2018", varighet: "4 timer", hjelpemidler: "Ingen",
    forside: "<p><strong>University of Oslo - Faculty of Mathematics and Natural Sciences</strong></p><p><strong>Digital exam in IN2120 \"Informasjonssikkerhet\" (Autumn 2018)</strong></p><p><strong>Date and time: 11 December 2018, 14:30h - 18:30h</strong></p><p><strong>Permitted materials: None</strong></p><p>Please regard the following directions:</p><ul><li>The exam contains 44 questions with a total of 100 points (= 100 %).</li><li>The questions are grouped under 10 parts that correspond approximately to 10 of the lectures in this course.</li><li>Each question states explicitly the marking scheme. <strong>There can be negative points for incorrect answers/selections.</strong> However, the overall score for the total question is always at least 0 points (even if the sum over all answers is negative).</li><li>Be concise. When answering a question, it is often sufficient to write a single expression or sentence to describe each concept that the question asks for.</li><li>In the navigation bar on the bottom of the screen, blue bars indicate completed questions/parts.</li><li>Answers can be written in English or in Norwegian.</li></ul>",
    deler: [
      { navn: D1, poeng: 10 }, { navn: D2, poeng: 10 }, { navn: D3, poeng: 10 }, { navn: D4, poeng: 10 },
      { navn: D5, poeng: 10 }, { navn: D6, poeng: 10 }, { navn: D7, poeng: 10 }, { navn: D8, poeng: 10 },
      { navn: D9, poeng: 10 }, { navn: D10, poeng: 10 }
    ],
    merknad: "Inspera-utskrift med rettenøkkel (28 sider) lest visuelt. 44 oppgaver, 10 deler à 10 poeng, sum = 100. Eksamen var på engelsk. Arket kaller delen med oppgave 9.1–9.5 «Part 10: Network Perimeter Security» (skrivefeil, to deler heter Part 10); her heter den Part 9.",
    oppgaver: O
  };
})();
