/* IN2120 · eksamensbank H2021. Kilde: UiO, IN2120 eksamen H2021 (Inspera-utskrift med rettenøkkel og
   retteinstrukser, behandlet som sensorveiledning; bilde-PDF lest visuelt, 29 sider).
   Oppgavetekst og fasit ordrett. Våre forklaringer (explain/losning/tips/hvorfor/svar) med egne ord. */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BANK = (window.IN_EXAM_BANK = window.IN_EXAM_BANK || {});
  IN.PERFEKT = IN.PERFEKT || {};

  var Y = "H2021";
  var D1 = "Del 1: Generelt",
    D2 = "Del 2: Angrepsvektorer og skadevare",
    D3 = "Del 3: Kryptografi",
    D4 = "Del 4: Nøkkelhåndtering og PKI",
    D5 = "Del 5: Nettverkssikkerhet",
    D6 = "Del 6: Brukerautentisering",
    D7 = "Del 7: Identitets- og tilgangshåndtering",
    D8 = "Del 8: Ledelse av informasjonssikkerhet",
    D9 = "Del 9: Innebygd informasjonssikkerhet",
    D10 = "Del 10: Cyberoperasjoner";

  var JUSTERT =
    "Justert skåring for denne oppgaven er basert på lengden av sekvensen med trinn i riktig rekkefølge.\n" +
    "Hvis det f.eks. er spesifisert 5 trinn i riktig rekkefølge gir det 2.5 poeng.\n" +
    "Eventuell spesifisering av feil trinn imellom har ingen negativ betydning.\n" +
    "Det gis ikke minuspoeng for feilplassert spesifisering av trinn.";

  function hv(key, eli5, normal, teknisk) {
    IN.PERFEKT[key] = IN.PERFEKT[key] || { type: "eksamen" };
    IN.PERFEKT[key].hvorfor = { eli5: eli5, normal: normal, teknisk: teknisk };
  }

  var O = [];

  /* ============================ DEL 1: GENERELT ============================ */

  O.push({
    key: "H2021-1.1", year: Y, oppgave_nr: "Oppgave 1.1", del: D1,
    ark: "1.1 Sikkerhetsmålsettinger", title: "Hvilket sikkerhetsmål brytes?",
    points: 3, block: "generelt", tema: ["KIT", "systemintegritet", "dataintegritet", "personvern"],
    gjenganger: ["H2022-1.1", "H2023-3", "H2024-3", "H2025-2"],
    ordrett: true,
    oppgave: "<p>For hver angrepsbeskrivelse, angi på hvilken målsetting (eller ingen) det medfører brudd. Poeng: 0,5 for hver korrekt, -0,5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</p><p><strong>Angi målsettingen det medfører brudd på:</strong></p>",
    figur: {
      beskrivelse: "Øverst til venstre en blå likesidet trekant med hvit innside. Langs venstre side står «Konfidensialitet», langs høyre side «Integritet» og langs grunnlinjen «Tilgjengelighet» (hvit tekst på blått). Inne i trekanten står «Informasjons-sikkerhet» i svart. Til høyre for trekanten, adskilt, en blå avrundet stolpe med hvit tekst «Personvern».",
      tekst: ["Konfidensialitet", "Integritet", "Tilgjengelighet", "Informasjons-sikkerhet", "Personvern"]
    },
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0,5 for for hver feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Systemintegritet", "Personvern", "Konfidensialitet", "Ingen", "Dataintegritet", "Tilgjengelighet"],
      multi: false,
      rader: [
        { s: "Angriper endrer konfigurering av webtjener", svar: [0], explain: "<p>Konfigurasjonen er en del av selve systemet, ikke dataene det behandler. Når noen endrer den uten lov, er systemet ikke lenger slik eieren satte det opp: brudd på <strong>systemintegritet</strong>.</p>" },
        { s: "Angriper blokkerer overføring av en melding", svar: [5], explain: "<p>Meldingen kommer aldri fram. Ingen har lest eller endret den, men den kan ikke brukes når den trengs: brudd på <strong>tilgjengelighet</strong>.</p>" },
        { s: "Angriper avlytter kryptert trafikk", svar: [3], explain: "<p>Angriperen ser bare chiffertekst og kan ikke lese innholdet. Så lenge ingenting dekrypteres, er ingen mål brutt: <strong>Ingen</strong>. Sammenlign med raden der angriperen klarer å dekryptere.</p>" },
        { s: "Angriper avskjærer en melding, endrer innholdet, og videresender meldingen", svar: [4], explain: "<p>Innholdet i meldingen er endret uten lov. Det er dataene, ikke systemet, som er tuklet med: brudd på <strong>dataintegritet</strong>.</p>" },
        { s: "Angriper avlytter en kryptert forbindelse og klarer å dekryptere data", svar: [2], explain: "<p>Nå leser angriperen innholdet, altså får en uvedkommende se data: brudd på <strong>konfidensialitet</strong>.</p>" },
        { s: "Angriper får tilgang til anonymiserte persondata, og klarer å de-anonymisere persondataene", svar: [1], explain: "<p>Dataene var anonymisert nettopp for å beskytte enkeltpersoner. Når angriperen kobler dem tilbake til personer, er det <strong>personvernet</strong> som brytes.</p>" }
      ]
    },
    avvik: null,
    losning: [
      "Spør deg: hva var det angriperen fikk til? Lese (K), endre (I), hindre bruk (T)?",
      "Skill mellom dataintegritet (innholdet i data endres) og systemintegritet (systemet selv, f.eks. konfigurasjon, endres).",
      "Kryptert trafikk som bare avlyttes gir ingen brudd; først dekryptering gir brudd på K.",
      "Personvern er eget mål her fordi det gjelder data om personer, f.eks. de-anonymisering."
    ],
    tips: ["Avlytting av kryptert trafikk uten dekryptering er en klassisk felle: svaret er «Ingen».", "Denne matrisen kommer igjen hvert år med nye rader. Øv på å stille de tre spørsmålene lese/endre/hindre."]
  });
  hv("H2021-1.1",
    "<p>Tenk på et brev. Hvis noen leser det, er hemmeligheten borte. Hvis noen skriver om det, stemmer det ikke lenger. Hvis noen kaster det, kommer det aldri fram. Og hvis noen bare ser en forseglet konvolutt, har ingenting skjedd ennå.</p>",
    "<p>Hver rad beskriver ett angrep. Finn hva angriperen faktisk oppnår: leser data (konfidensialitet), endrer data (dataintegritet), endrer systemet (systemintegritet), hindrer bruk (tilgjengelighet) eller kobler data til personer (personvern). Avlytting av chiffertekst uten dekryptering bryter ingenting.</p>",
    "<p>Oppgaven deler integritet i data- og systemintegritet og legger personvern til KIT. Et brudd krever at et mål faktisk er krenket, ikke bare at et angrep er forsøkt. Derfor er avlytting av kryptert trafikk «Ingen», mens vellykket dekryptering er brudd på konfidensialitet. De-anonymisering bryter personvernet fordi anonymiseringen var tiltaket som skulle hindre at data kan knyttes til en person.</p>");

  O.push({
    key: "H2021-1.2", year: Y, oppgave_nr: "Oppgave 1.2", del: D1,
    ark: "1.2 Begreper", title: "Risikobegreper: trussel, sårbarhet, verdi …",
    points: 3, block: "risiko", tema: ["trussel", "sårbarhet", "verdi", "risiko", "hendelse"],
    gjenganger: ["H2022-1.2"],
    ordrett: true,
    oppgave: "<p>For hver beskrivelse, angi hvilket begrep som representerer beskrivelsen, ved å velge blant begrepene Trussel, Sårbarhet, Verdi, Risiko, Hendelse eller Ingen. Poeng: 0,5 for hver korrekt, -0,5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</p><p><strong>Angi riktig sikkerhetsbegrep:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0,5 for for hver feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Ingen", "Sårbarhet", "Verdi", "Risiko", "Hendelse", "Trussel"],
      multi: false,
      rader: [
        { s: "Kombinasjon av trussel, sårbarheter og verdier", svar: [3], explain: "<p>Kurset definerer <strong>risiko</strong> nettopp som en relevant kombinasjon av trussel, sårbarhet(er) og verdier. (Risiko<em>nivå</em> er noe annet: hvor stor risikoen er.)</p>" },
        { s: "Brudd på konfidensialitet, integritet og/eller tilgjengelighet", svar: [4], explain: "<p>Når et KIT-mål faktisk er brutt, har det skjedd en sikkerhets<strong>hendelse</strong>.</p>" },
        { s: "Skadelig aktivitet som kan utnytte sårbarheter og forårsake en sikkerhetshendelse", svar: [5], explain: "<p>En <strong>trussel</strong> er den skadelige aktiviteten som kan utnytte en svakhet. Den er mulig, ikke nødvendigvis inntruffet.</p>" },
        { s: "Har krav om konfidensialitet, integritet, og/eller tilgjengelighet", svar: [2], explain: "<p>En <strong>verdi</strong> er det vi vil beskytte, og kjennetegnes ved at den har krav til K, I eller T.</p>" },
        { s: "At en type angrep ikke kan forhindres", svar: [1], explain: "<p>En <strong>sårbarhet</strong> er en svakhet som gjør at et angrep ikke kan hindres.</p>" },
        { s: "Angrep som ikke detekteres", svar: [0], explain: "<p>Et uoppdaget angrep er ikke i seg selv noen av de fem begrepene (det kan være en hendelse eller ikke, avhengig av om noe ble brutt). Riktig er <strong>Ingen</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Lær én setning per begrep: verdi har KIT-krav, trussel kan utnytte sårbarhet, sårbarhet gjør at angrep ikke hindres, hendelse er brudd på KIT, risiko er kombinasjonen.", "Rader som ikke passer noen av definisjonene er «Ingen»."],
    tips: ["Ikke bland risiko (kombinasjonen) med risikonivå (sannsynlighet og konsekvens).", "H2022 1.2 har fem identiske rader – denne er verdt å kunne utenat."]
  });
  hv("H2021-1.2",
    "<p>Huset ditt er verdien. En innbruddstyv er trusselen. Et vindu som ikke kan låses er sårbarheten. Muligheten for at tyven bruker vinduet til å ta tingene dine er risikoen. Et faktisk innbrudd er hendelsen.</p>",
    "<p>Hver beskrivelse er nesten en ordrett definisjon fra kurset. Verdi = har KIT-krav. Trussel = skadelig aktivitet som kan utnytte sårbarheter. Sårbarhet = svakhet som gjør at angrep ikke kan hindres. Hendelse = brudd på K, I eller T. Risiko = kombinasjonen trussel–sårbarhet–verdi. «Angrep som ikke detekteres» passer ingen av dem.</p>",
    "<p>Begrepene henger sammen i en kjede: en trussel utnytter en sårbarhet i en verdi, og hvis det lykkes, får vi en hendelse. Risiko er hele kombinasjonen før noe har skjedd. At et angrep ikke oppdages, sier noe om deteksjonsevne, men er ikke selv et av disse begrepene, så «Ingen» er riktig.</p>");

  O.push({
    key: "H2021-1.3", year: Y, oppgave_nr: "Oppgave 1.3", del: D1,
    ark: "1.3 IAM", title: "IAM: konfigureringsfase og bruksfase",
    points: 3, block: "iam", tema: ["IAM", "konfigureringsfase", "bruksfase", "autorisering", "tilgangskontroll"],
    gjenganger: ["H2022-1.3", "H2023-14"],
    ordrett: true,
    oppgave: "<p>Tilordne trinnene til riktig felt i diagrammet for IAM (identitets- og tilgangshåndtering). Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 3, minimum 0.</p>",
    figur: {
      beskrivelse: "To avrundede rammer side om side. Venstre ramme har overskriften «Konfigureringsfase» og inneholder tre bokser under hverandre (felt 1–3): mellom boks 1 og 2 en lyseblå pil nedover, mellom boks 2 og 3 en lyseblå dobbeltpil (opp og ned). Høyre ramme har overskriften «Bruksfase» og tre bokser under hverandre (felt 4–6) med lyseblå piler nedover mellom dem. Over diagrammet ligger seks dra-bokser.",
      tekst: ["Konfigureringsfase", "Bruksfase"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      tekst: null,
      bank: ["Klargjør autentikator", "Tilgangskontroll", "Oppgi bruker-ID", "Oppgi autentikator", "Brukerregistrering", "Tilgangsautorisering"],
      felt: [
        { etikett: "Konfigureringsfase, boks 1 (øverst)", svar: 4, godta: [], explain: "<p>Alt starter med at brukeren blir registrert og får en identitet: <strong>Brukerregistrering</strong>.</p>" },
        { etikett: "Konfigureringsfase, boks 2", svar: 0, godta: [], explain: "<p>Deretter får brukeren noe å bevise identiteten med, f.eks. passord eller nøkkel: <strong>Klargjør autentikator</strong>.</p>" },
        { etikett: "Konfigureringsfase, boks 3 (nederst)", svar: 5, godta: [], explain: "<p>Til slutt i konfigureringsfasen bestemmes hva brukeren skal få lov til, altså tilgangspolicyen spesifiseres: <strong>Tilgangsautorisering</strong>. Dobbeltpila kan tyde på at dette og klargjøring av autentikator ikke har fast innbyrdes rekkefølge, men fasiten plasserer tilgangsautorisering nederst.</p>" },
        { etikett: "Bruksfase, boks 1 (øverst)", svar: 2, godta: [], explain: "<p>Ved innlogging sier brukeren først hvem hen er: <strong>Oppgi bruker-ID</strong> (identifisering).</p>" },
        { etikett: "Bruksfase, boks 2", svar: 3, godta: [], explain: "<p>Så beviser brukeren det: <strong>Oppgi autentikator</strong> (autentisering).</p>" },
        { etikett: "Bruksfase, boks 3 (nederst)", svar: 1, godta: [], explain: "<p>Når brukeren ber om en ressurs, håndhever systemet policyen: <strong>Tilgangskontroll</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Konfigureringsfasen gjøres én gang på forhånd: registrere, gi autentikator, autorisere (spesifisere policy).", "Bruksfasen gjentas ved hver bruk: oppgi ID, oppgi autentikator, tilgangskontroll (håndheve policy)."],
    tips: ["Autorisering = spesifisere policy (konfigurering). Tilgangskontroll = håndheve den (bruk). Ikke bytt dem om.", "Speilbildet hjelper: registrering ↔ oppgi ID, klargjør autentikator ↔ oppgi autentikator, autorisering ↔ tilgangskontroll."]
  });
  hv("H2021-1.3",
    "<p>Først blir du medlem av treningssenteret, får et kort, og de bestemmer hvilke rom du får gå inn i. Senere, hver gang du kommer, sier du hvem du er, viser kortet, og døra slipper deg bare inn der du har lov.</p>",
    "<p>IAM har to faser. I konfigureringsfasen registreres brukeren, får en autentikator og blir autorisert (policy settes). I bruksfasen oppgir brukeren ID, beviser den med autentikatoren, og tilgangskontrollen håndhever policyen. Hvert steg i bruksfasen speiler et steg i konfigureringsfasen.</p>",
    "<p>Kurset skiller skarpt mellom</p><ul><li>autorisering (å spesifisere tilgangspolicy, gjort av en administrator i konfigureringsfasen) og</li><li>tilgangskontroll (å håndheve policyen ved hver forespørsel i bruksfasen).</li></ul><p>Identifisering (oppgi bruker-ID) og autentisering (oppgi autentikator) kommer før tilgangskontrollen, fordi systemet må vite hvem som spør før det kan slå opp hva vedkommende har lov til.</p>");

  O.push({
    key: "H2021-1.4", year: Y, oppgave_nr: "Oppgave 1.4", del: D1,
    ark: "1.4 Meldingsautentisering", title: "MAC vs. digital signatur: hvem kan validere?",
    points: 1, block: "krypto", tema: ["MAC", "digital signatur", "meldingsautentisering"],
    gjenganger: ["H2022-5.3", "H2023-15", "H2024-12"],
    ordrett: true,
    oppgave: "<p>Angi hva som er korrekt for meldings/data-autentisering med MAC (Message Authentication Code) og digital signatur.<br>Poeng: 0,5 for riktig, -0,5 for feil, 0 for intet valg, maks 1, minimum 0.</p><p><strong>Angi det som er korrekt</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for intet valg, maks 1, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 1 },
      alternativer: ["Digital signatur kan valideres av mottager", "MAC kan valideres av mottager", "MAC er sterkere enn digital signatur.", "MAC kan valideres av tredjeparter"],
      svar: [0, 1],
      explain: [
        "<p>Riktig. Mottakeren validerer signaturen med avsenderens offentlige nøkkel.</p>",
        "<p>Riktig. Mottakeren har den samme hemmelige nøkkelen som avsenderen og kan regne ut MAC-en på nytt og sammenligne.</p>",
        "<p>Feil. Det er omvendt: digital signatur gir i tillegg ubenektelighet, så den er den sterkeste formen for dataautentisering.</p>",
        "<p>Feil. En tredjepart har ikke den hemmelige nøkkelen og kan derfor ikke sjekke MAC-en. Og selv om den fikk nøkkelen, kunne den ikke vite hvem av de to partene som laget MAC-en.</p>"
      ]
    },
    avvik: null,
    losning: ["MAC: delt hemmelig nøkkel – bare de som har nøkkelen kan validere.", "Signatur: privat nøkkel signerer, offentlig nøkkel validerer – alle kan validere, også tredjeparter."],
    tips: ["MAC gir ikke ubenektelighet: begge parter har samme nøkkel."]
  });
  hv("H2021-1.4",
    "<p>En MAC er som et hemmelig håndtrykk mellom to venner: de to kjenner det igjen, men ingen andre kan sjekke det. En signatur er som en håndskrift alle har en prøve av: hvem som helst kan sammenligne.</p>",
    "<p>Med MAC deler avsender og mottaker én hemmelig nøkkel. Mottakeren kan validere, men en tredjepart kan ikke. Med digital signatur signerer avsender med sin private nøkkel, og alle med den offentlige nøkkelen kan validere. Derfor er signatur sterkere, ikke svakere.</p>",
    "<ul><li>MAC = Hash(M, k) med en symmetrisk nøkkel k som begge parter kjenner. Validering er å regne ut MAC′ og sjekke MAC = MAC′. Fordi begge kan lage den samme MAC-en, kan ingen tredjepart avgjøre hvem som laget den, så MAC gir bare enkel meldingsautentisering.</li><li>Signaturen S = Sig(H, K<sup>A</sup><sub>priv</sub>) kan bare lages av A, men valideres av alle med K<sup>A</sup><sub>pub</sub>; det gir ubenektelig meldingsautentisering.</li></ul>");

  /* ==================== DEL 2: ANGREPSVEKTORER OG SKADEVARE ==================== */

  O.push({
    key: "H2021-2.1", year: Y, oppgave_nr: "Oppgave 2.1", del: D2,
    ark: "2.1 Phishing", title: "Typer phishing",
    points: 2, block: "angrep", tema: ["phishing", "spydphishing", "hvalphishing", "klonephishing"],
    gjenganger: ["H2022-3.2", "H2023-23", "H2024-20"],
    ordrett: true,
    oppgave: "<p>For hver beskrivelse, angi riktig type phishing ved å velge blant massephishing, spydphishing, hvalphishing, og klonephishing. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi riktig type phishing</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Massephishing", "Spydphishing", "Klonephishing", "Hvalphishing"],
      multi: false,
      rader: [
        { s: "Du mottar phishing-epost som er irrelevant for deg", svar: [0], explain: "<p>Samme e-post sendes til mange uten tilpasning, så den treffer ofte ikke deg: <strong>massephishing</strong>.</p>" },
        { s: "Du mottar phishing-epost som er relevant for deg", svar: [1], explain: "<p>Angriperen har undersøkt deg og skreddersydd e-posten: <strong>spydphishing</strong>.</p>" },
        { s: "Du mottar phishing-epost som ligner en tidligere epost fra en kollega", svar: [2], explain: "<p>En ekte e-post er kopiert og endret (f.eks. lenke eller vedlegg byttet ut): <strong>klonephishing</strong>.</p>" },
        { s: "Du er direktør og mottar phishing-epost om å autorisere en stor betaling", svar: [3], explain: "<p>Målrettet mot en toppleder – «den store fisken»: <strong>hvalphishing</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Masse = alle får det samme. Spyd = tilpasset deg. Klone = kopi av ekte e-post. Hval = toppleder."],
    tips: ["Hvalphishing er en spesiell form for spydphishing; velg hval når målet er en leder."]
  });
  hv("H2021-2.1",
    "<p>Massephishing er å kaste et stort garn. Spydphishing er å sikte på én bestemt fisk. Hvalphishing er å sikte på den største fisken. Klonephishing er å lage en kopi av et brev du allerede har fått, men med en farlig lenke.</p>",
    "<p>Typen avgjøres av hvem som er målet og hvordan e-posten er laget: likt til mange (masse), tilpasset en person (spyd), kopi av en tidligere ekte e-post (klone), eller rettet mot en toppleder, ofte om penger (hval).</p>",
    "<p>Jo mer målrettet angrepet er, desto mer rekognosering krever det, og desto høyere er treffsikkerheten. Klonephishing utnytter tilliten til en melding mottakeren har sett før. Hvalphishing kombinerer målretting med en mottaker som har myndighet til å godkjenne betalinger eller tilganger.</p>");

  O.push({
    key: "H2021-2.2", year: Y, oppgave_nr: "Oppgave 2.2", del: D2,
    ark: "2.2 Angrepstyper", title: "Sidekanal, skjult kanal eller MitM?",
    points: 2, block: "angrep", tema: ["sidekanal", "skjult kanal", "MitM", "Tor"],
    ordrett: true,
    oppgave: "<p>For hver beskrivelse, angi korrekt type angrep ved å velge blant Sidekekanal, Skjult kanal, MitM (Man-in-the-Middel) eller Ingen. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi agrepstype som passer</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Skjult kanal", "Ingen", "MitM", "Sidekanal"],
      multi: false,
      rader: [
        { s: "Å sette opp en kryptert forbindelse gjennom TOR (The Onion Router)", svar: [1], explain: "<p>Tor er et anonymiseringsnettverk, ikke et angrep i seg selv: <strong>Ingen</strong>.</p>" },
        { s: "Å opptre som både avsender og mottager i en kryptert forbindelse", svar: [2], explain: "<p>Angriperen står i midten og later som han er mottaker overfor avsenderen og avsender overfor mottakeren: <strong>MitM</strong>.</p>" },
        { s: "Måle variasjon av tidsbruk ved kryptering med ulike nøkkelverdier", svar: [3], explain: "<p>Tidsbruken lekker utilsiktet informasjon om nøkkelen fra den fysiske implementasjonen: <strong>sidekanal</strong>.</p>" },
        { s: "Kalle funksjoner i et system med ulike tidsbruk med hensikt at det kan måles utenfor systemet", svar: [0], explain: "<p>Her lages tidsvariasjonen med vilje for å sende informasjon ut av systemet. En mekanisme misbrukes bevisst til kommunikasjon: <strong>skjult kanal</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Sidekanal = utilsiktet lekkasje som angriperen måler.", "Skjult kanal = bevisst misbruk for å kommunisere ut.", "Begge kan bruke tid – forskjellen er om lekkasjen er tilsiktet."],
    tips: ["Arket skriver «Sidekekanal», «Man-in-the-Middel» og «agrepstype» – skrivefeil i originalen, gjengitt ordrett."]
  });
  hv("H2021-2.2",
    "<p>En sidekanal er som å gjette hva naboen lager til middag ut fra lukten: de mente ikke å fortelle deg det. En skjult kanal er som å blinke med lyset i et avtalt mønster for å sende en beskjed i hemmelighet.</p>",
    "<p>Sidekanal: informasjon lekker utilsiktet fra en implementasjon, f.eks. via tid eller strømforbruk, og angriperen måler den. Skjult kanal: noen bruker bevisst en mekanisme som ikke er laget for kommunikasjon til å sende data ut. MitM: angriperen setter seg mellom to parter og spiller begge roller. Tor er et anonymiseringsverktøy, ikke et angrep.</p>",
    "<ul><li>Raden med tidsmåling ved ulike nøkler er et klassisk tidsangrep (sidekanal): kryptoalgoritmen bruker ulik tid avhengig av nøkkelbits.</li><li>Raden der funksjoner kalles med vilje for å gi målbar tid utenfor systemet, er en tidsbasert skjult kanal: avsenderen er en innsider (f.eks. skadevare) som koder data i tidsbruken.</li><li>MitM i en kryptert forbindelse betyr at angriperen etablerer to separate krypterte forbindelser, noe autentisering (sertifikater) skal hindre.</li></ul>");

  O.push({
    key: "H2021-2.3", year: Y, oppgave_nr: "Oppgave 2.3", del: D2,
    ark: "2.3 Leveransekjedeangrep", title: "Leveransekjedeangrep: sant eller usant",
    points: 2, block: "angrep", tema: ["leveransekjedeangrep", "tredjepart"],
    ordrett: true,
    oppgave: "<p>Angi hva som er korrekt om leveransekjedeangrep.<br>Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p>",
    figur: {
      beskrivelse: "Vannrett figur. Til venstre et bilde av en hettekledd person merket «Trusselaktør». En oransje pil går til en stiplet blå ramme merket «Leverandør» (fabrikkikon) med en databasesylinder «Verdier» og en gul eksplosjonsstjerne «Hendelse». Fra leverandøren går en svart pil merket «tjenester/produkter» og en blå linje merket «Tillitsforhold» til en heltrukken blå ramme til høyre merket «Virksomhet» (bygningsikon). En oransje pil går fra leverandørens verdier inn til virksomhetens databasesylinder «Verdier», som også har en gul stjerne «Hendelse».",
      tekst: ["Trusselaktør", "Leverandør", "Verdier", "Hendelse", "Tillitsforhold", "tjenester/produkter", "Virksomhet", "Verdier", "Hendelse"]
    },
    inspera: {
      type: "F1",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Fire separate sant/usant-spørsmål (radioknapper); hvert spørsmål er én enhet i poengregelen.",
      sporsmal: [
        { tekst: "Leveransekjedeangrep er angrep mot en virksomhet basert på kompromitterte tjenester/produkter levert av en tredjepart.", alternativer: ["Sant", "Usant"], svar: 0, explain: ["<p>Sant. Angriperen går via en leverandør som virksomheten stoler på, og når fram gjennom produktet eller tjenesten som leveres.</p>", "<p>Feil valg. Det er nettopp dette et leveransekjedeangrep er.</p>"] },
        { tekst: "Leverandør er som regel erstatningsansvarlig for virksomhetens tap som følge av leveransekjedeangrep.", alternativer: ["Sant", "Usant"], svar: 1, explain: ["<p>Feil valg. Avtaler begrenser som regel leverandørens ansvar.</p>", "<p>Usant. Avtaler begrenser som regel leverandørens ansvar, så virksomheten må normalt bære tapet selv.</p>"] },
        { tekst: "Leverandør lider som regel størst konsekvenser ved leveransekjedeangrep.", alternativer: ["Sant", "Usant"], svar: 1, explain: ["<p>Feil valg. Det er kundene som rammes hardest.</p>", "<p>Usant. Det er kundene (virksomhetene) som rammes av hendelsen i sine egne systemer, og de er ofte mange.</p>"] },
        { tekst: "Leverandør har best grunnlag for å vurdere konsekvenser ved leveransekjedeangrep.", alternativer: ["Sant", "Usant"], svar: 1, explain: ["<p>Feil valg. Leverandøren kjenner ikke virksomhetens verdier.</p>", "<p>Usant. Bare virksomheten kjenner sine egne verdier og hvor ille det er om de rammes. Leverandøren ser ikke det.</p>"] }
      ]
    },
    avvik: null,
    losning: ["Angrepet kommer inn via tillitsforholdet til leverandøren.", "Konsekvensen og ansvaret ligger i praksis hos virksomheten, som også best kan vurdere egne verdier."],
    tips: ["Figuren viser to hendelser: én hos leverandøren og én hos virksomheten. Det er virksomhetens verdier som er målet."]
  });
  hv("H2021-2.3",
    "<p>En tyv vil inn i et hus, men døra er godt låst. I stedet gjemmer han seg i varebilen som leverer mat. Huseieren slipper inn varebilen fordi hun stoler på leverandøren – og det er hun som mister tingene sine.</p>",
    "<p>Et leveransekjedeangrep rammer en virksomhet gjennom en kompromittert leverandør. Virksomheten stoler på leveransen og slipper den inn. Det er virksomheten som får skaden, som best kjenner hva skaden betyr, og som vanligvis ikke får tapet dekket av leverandøren.</p>",
    "<p>Angrepet utnytter tillitsforholdet: produkter eller tjenester fra leverandøren får tilgang innenfor virksomhetens perimeter. Konsekvensvurdering krever kunnskap om virksomhetens verdier og KIT-krav, og det har bare virksomheten. Leverandørkontrakter har typisk ansvarsbegrensninger, så restrisikoen må styres av kunden selv, f.eks. gjennom krav til leverandøren og egne tiltak.</p>");

  O.push({
    key: "H2021-2.4", year: Y, oppgave_nr: "Oppgave 2.4", del: D2,
    ark: "2.4 Løsepengevirus", title: "Tiltak mot løsepengevirus",
    points: 2, block: "angrep", tema: ["løsepengevirus", "sikkerhetskopi", "personvern", "cyberforsikring"],
    ordrett: true,
    oppgave: "<p>For hver beskrivelse, angi hva som er korrekt om tiltak for å forhindre eller respondere mot løsepengevirus. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "To avkrysningsgrupper med tre alternativer hver; hvert alternativ er én enhet i poengregelen.",
      sporsmal: [
        { tekst: "Kan forhindre/mitigere (konsekvens av) tap av data", alternativer: ["Sikkerhetskopi av data", "Anonymisering av persondata", "Cyberforsikring for å betale løsepenger"], svar: [0, 2], explain: [
          "<p>Riktig. Med en sikkerhetskopi kan dataene gjenopprettes uten å betale.</p>",
          "<p>Feil. Anonymisering gjør ikke at du får dataene tilbake når de er kryptert.</p>",
          "<p>Riktig ifølge fasit. Forsikringen kan betale løsepengene, og hvis angriperen leverer nøkkelen, får man dataene tilbake. (Å betale anbefales vanligvis ikke, men spørsmålet er om tiltaket kan mitigere konsekvensen.)</p>"
        ] },
        { tekst: "Kan forhindre/miitigere (konsekvens av) brudd på personvern", alternativer: ["Sikkerhetskopi av data", "Anonymisering av persondata", "Cyberforsikring for å betale løsepenger"], svar: [1, 2], explain: [
          "<p>Feil. En sikkerhetskopi gir dataene tilbake, men hindrer ikke at angriperen allerede har kopiert og kan lekke persondataene.</p>",
          "<p>Riktig. Er persondataene anonymisert, er det ingen personer å identifisere selv om dataene lekker.</p>",
          "<p>Riktig ifølge fasit, men tvilsomt. Å betale løsepenger kan i beste fall få angriperen til å love at data ikke publiseres; data som er stjålet, er likevel ute. Se avvik.</p>"
        ] }
      ]
    },
    avvik: "Fasiten merker «Cyberforsikring for å betale løsepenger» som tiltak som kan mitigere brudd på personvern. Det er tvilsomt fordi data som allerede er stjålet ikke blir hemmelige igjen av at løsepenger betales; i beste fall kjøper man et løfte fra angriperen (jf. eksamensmønster § 7).",
    losning: ["Tap av data: sikkerhetskopi (og ifølge fasit forsikring som betaler for nøkkelen).", "Personvern: anonymisering (og ifølge fasit forsikring).", "Sikkerhetskopi hjelper mot tap, ikke mot lekkasje."],
    tips: ["Skill mellom tilgjengelighet (dataene er låst) og konfidensialitet/personvern (dataene er stjålet). Løsepengevirus bryter først og fremst tilgjengelighet."]
  });
  hv("H2021-2.4",
    "<p>Hvis noen låser dagboka di inne, hjelper det å ha en kopi hjemme. Men hvis noen har lest og kopiert dagboka, hjelper ikke kopien din – da hjelper det bare om det ikke stod navn i den.</p>",
    "<p>Løsepengevirus kan gi to typer skade: dataene blir utilgjengelige (tap av data), og dataene kan bli stjålet og lekket (personvern). Sikkerhetskopi løser det første. Anonymisering demper det andre. Fasiten sier at cyberforsikring som betaler løsepenger hjelper mot begge, men for personvern er det et svakt argument.</p>",
    "<p>Moderne løsepengeangrep kombinerer ofte kryptering av data (brudd på T) med eksfiltrering og trussel om publisering (brudd på K og personvern).</p><ul><li>Sikkerhetskopi gjenoppretter T, men gjør ingenting med K.</li><li>Anonymisering reduserer konsekvensen av en lekkasje fordi data ikke kan knyttes til personer.</li><li>Betaling av løsepenger kan i beste fall gi dekrypteringsnøkkel; at det reverserer en lekkasje, er en tvilsom antakelse.</li></ul>");

  O.push({
    key: "H2021-2.5", year: Y, oppgave_nr: "Oppgave 2.5", del: D2,
    ark: "2.5 Skadevare", title: "Virus, orm, trojaner eller drive-by-script",
    points: 2, block: "angrep", tema: ["skadevare", "virus", "orm", "trojaner", "drive-by"],
    gjenganger: ["H2022-3.4", "H2023-24", "H2024-21"],
    ordrett: true,
    oppgave: "<p>For hver karakteristikk, angi riktig type skadevare. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi riktig type skadevare</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Virus", "Orm", "Trojaner", "Drive-by-script"],
      multi: false,
      rader: [
        { s: "Utføres automatisk uten brukermedvirkning", svar: [3], explain: "<p>Et drive-by-script kjører i nettleseren bare ved at du besøker siden, uten at du klikker på noe: <strong>Drive-by-script</strong>.</p>" },
        { s: "Integreres som del av legitim programvare", svar: [0], explain: "<p>Et <strong>virus</strong> infiserer andre programmer ved å legge inn kopi av seg selv i dem.</p>" },
        { s: "Har både en nyttig og en skadelig funksjon", svar: [2], explain: "<p>En <strong>trojaner</strong> ser nyttig ut (og kan være det), men har en skjult skadelig funksjon.</p>" },
        { s: "Spres automatisk uten brukermedvirkning", svar: [1], explain: "<p>En <strong>orm</strong> sprer seg selv over nettverket uten at noen må kjøre eller dele den.</p>" }
      ]
    },
    avvik: null,
    losning: ["Virus: snylter på andre programmer.", "Orm: sprer seg selv.", "Trojaner: nyttig fasade, skadelig innhold.", "Drive-by: kjøres bare ved besøk."],
    tips: ["Legg merke til forskjellen på «utføres automatisk» (drive-by) og «spres automatisk» (orm)."]
  });
  hv("H2021-2.5",
    "<p>Et virus er en blindpassasjer som gjemmer seg i en annen bil. En orm kjører selv fra by til by. En trojaner er en gave med noe farlig inni. Et drive-by-script er en felle du går i bare ved å gå forbi.</p>",
    "<p>Typene skilles på hvordan de kommer inn og sprer seg. Virus fester seg til legitim programvare. Ormer sprer seg selv via nettverket. Trojanere later som de er nyttige. Drive-by-script kjører automatisk når du besøker en ondsinnet nettside.</p>",
    "<p>Virus trenger et vertsprogram og brukerhandling (kjøring av programmet) for å spre seg. Ormer utnytter sårbarheter i nettverkstjenester og replikerer uten brukerhandling. Trojanere avhenger av at brukeren selv installerer dem. Drive-by-angrep utnytter sårbarheter i nettleseren eller tillegg slik at kode kjøres uten at brukeren gjør noe annet enn å laste siden.</p>");

  /* ============================ DEL 3: KRYPTOGRAFI ============================ */

  O.push({
    key: "H2021-3.1", year: Y, oppgave_nr: "Oppgave 3.1", del: D3,
    ark: "3.1 Betingelser for sterk krypto", title: "Hva kreves for sterk kryptografi?",
    points: 2, block: "krypto", tema: ["sterk krypto", "Kerckhoffs", "nøkkelrom", "kryptanalyse"],
    ordrett: true,
    oppgave: "<p>Angi nødvendige betingelser for å oppnå sterk kryptografi. Poeng: 1 for hver korrekt, -1 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi korrekte betingelser</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 1 for hver korrekt, -1 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      alternativer: ["Algoritmens design må holdes hemmelig", "Algoritmen må være resistent mot kryptanalyse", "Algoritmen må være resistent mot kvantecomputere", "Algoritmen må beholde statistiske ujevnheter fra klartekst til chiffertekst", "Nøkkelrommet må være tilstrekkelig stort"],
      svar: [1, 4],
      explain: [
        "<p>Feil. Kerckhoffs' prinsipp sier det motsatte: algoritmen skal kunne være kjent, bare nøkkelen skal være hemmelig.</p>",
        "<p>Riktig. Det må ikke finnes snarveier som knekker chifferet raskere enn å prøve alle nøkler.</p>",
        "<p>Feil. Det er ønskelig, men ikke en nødvendig betingelse; dagens sterke symmetriske algoritmer rammes lite, og mange sterke algoritmer i dag er ikke kvanteresistente.</p>",
        "<p>Feil. Det er motsatt: chifferteksten skal skjule statistiske mønstre (forvirring og spredning). Ujevnheter er nettopp det kryptanalyse utnytter.</p>",
        "<p>Riktig. Er nøkkelrommet lite, kan angriperen bare prøve alle nøklene (uttømmende søk).</p>"
      ]
    },
    avvik: null,
    losning: ["To ting må holde: ingen snarvei (kryptanalyse virker ikke) og ingen brute force (nøkkelrommet er stort nok)."],
    tips: ["Kerckhoffs: bare nøkkelen skal være hemmelig. «Design må holdes hemmelig» er alltid feil.", "Med −1 for feil lønner det seg ikke å gjette her."]
  });
  hv("H2021-3.1",
    "<p>En god lås må både være umulig å dirke opp, og ha så mange mulige nøkler at det ikke går å prøve alle. Det gjør ikke noe om alle vet hvordan låsen er bygd.</p>",
    "<p>Sterk krypto krever to ting: algoritmen må stå imot kryptanalyse (ingen smarte snarveier), og nøkkelrommet må være så stort at det ikke går å prøve alle nøkler. Algoritmen trenger ikke være hemmelig, og den skal skjule mønstre i klarteksten, ikke beholde dem.</p>",
    "<p>Sikkerheten til et chiffer måles mot de to generelle angrepene:</p><ul><li>uttømmende nøkkelsøk (forsvares med stort nøkkelrom, f.eks. 2¹²⁸ nøkler) og</li><li>kryptanalyse som utnytter struktur eller statistikk (forsvares med god forvirring og spredning).</li></ul><p>Kerckhoffs' prinsipp sier at sikkerheten bare skal hvile på nøkkelen. Kvanteresistens er et ekstra krav for asymmetrisk krypto, ikke en generell nødvendig betingelse.</p>");

  O.push({
    key: "H2021-3.2", year: Y, oppgave_nr: "Oppgave 3.2", del: D3,
    ark: "3.2 Sikker krypteringsmodus", title: "Pingvinbildene: ECB vs. tellermodus",
    points: 2, block: "krypto", tema: ["ECB", "CTR", "tellermodus", "blokkmodus"],
    gjenganger: ["H2022-5.5", "H2023-20", "H2024-17", "H2025-8"],
    ordrett: true,
    oppgave: "<p>Diagrammet viser eksempel på kryptering med sikker og usikker krypteringsmodus. Tilordne krypteringsmodus (som kan være reelle eller ikke) til riktig felt i diagrammet. Poeng: 1 for hver korrekt tilordning, -1 for hver feil tilordning, maks 2, minimum 0</p>",
    figur: {
      beskrivelse: "Fire bilder på rad. 1) Linux-pingvinen Tux i farger (svart, hvit, gul) med etiketten «Klartekst» under. 2) Samme bilde kryptert: et grått, stripete bilde der pingvinens omriss tydelig vises (konturer av hode, kropp og føtter er synlige). Under det et dra-felt. 3) Et bilde med jevn, fargerik støy uten noe synlig mønster. Under det et dra-felt. 4) Ikke noe bilde, bare teksten «Ingen» over et dra-felt. Øverst tre dra-bokser.",
      tekst: ["Klartekst", "Ingen"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 1 for hver korrekt tilordning, -1 for hver feil tilordning, maks 2, minimum 0",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Tre felt à 1 poeng gir 3, men maks er 2; summen kappes til 2.",
      tekst: null,
      bank: ["Symmetrisk modus", "ECB-modus", "Tellermodus"],
      felt: [
        { etikett: "Under bilde 2 (pingvinen er synlig)", svar: 1, godta: [], explain: "<p>I ECB krypteres hver blokk for seg med samme nøkkel, så like klartekstblokker gir like chiffertekstblokker. Mønsteret i bildet blir stående: <strong>ECB-modus</strong> (usikker).</p>" },
        { etikett: "Under bilde 3 (bare støy)", svar: 2, godta: [], explain: "<p>I tellermodus er hver blokk XOR-et med E(T, K) for en ny tellerverdi, så like blokker gir ulik chiffertekst og mønsteret forsvinner: <strong>Tellermodus</strong> (sikker).</p>" },
        { etikett: "Ingen", svar: 0, godta: [], explain: "<p>«Symmetrisk modus» er ikke en ekte krypteringsmodus; symmetrisk er en type krypto, ikke en blokkmodus. Den hører under <strong>Ingen</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Mønster synlig ⇒ ECB. Bare støy ⇒ en sikker modus (her tellermodus).", "«Symmetrisk modus» finnes ikke ⇒ Ingen."],
    tips: ["Pingvinbildet er standardeksempelet på hvorfor ECB er usikker."]
  });
  hv("H2021-3.2",
    "<p>Tenk deg at du bytter hver farge i et bilde med en ny, men alltid den samme nye fargen for samme gamle farge. Da ser du fortsatt pingvinen, bare i rare farger. Det er ECB. Tellermodus blander inn noe nytt for hver bit av bildet, så alt blir bare snø.</p>",
    "<p>ECB krypterer hver blokk uavhengig med samme nøkkel. Like blokker gir like resultater, så mønstre i klarteksten synes i chifferteksten. Tellermodus krypterer en teller som endres for hver blokk og XOR-er resultatet med klarteksten, så mønstrene forsvinner. «Symmetrisk modus» er ikke en modus.</p>",
    "<ul><li>ECB: C₁ = E(M₁, K). Fordi funksjonen er deterministisk, gir Mᵢ = Mⱼ alltid Cᵢ = Cⱼ, og store ensfargede flater i bildet blir like chiffertekstblokker.</li><li>CTR: C₁ = E(T₁, K) ⊕ M₁ der telleren T er unik per blokk; nøkkelstrømmen er dermed forskjellig for hver blokk, og like klartekstblokker gir ulike chiffertekstblokker. Det gir et resultat som ser ut som tilfeldig støy.</li></ul>");

  O.push({
    key: "H2021-3.3", year: Y, oppgave_nr: "Oppgave 3.3", del: D3,
    ark: "3.3 Tellermodus", title: "Dekryptering i tellermodus",
    points: 2, block: "krypto", tema: ["CTR", "tellermodus", "XOR", "dekryptering"],
    gjenganger: ["H2022-5.5", "H2023-20", "H2024-17"],
    ordrett: true,
    oppgave: "<p>Diagrammet viser prinsipp for dekryptering av en chiffertekstblokk i tellermodus. Tilordne funksjoner (som kan være reelle eller ikke) til riktig felt i diagrammet. Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 2, minimum 0.</p>",
    figur: {
      beskrivelse: "Overskrift «Dekryptering med tellermodus». Øverst et felt med rød ramme (felt A). Til høyre for det et blått nøkkelikon merket «K». Fra felt A og fra nøkkelen går to piler ned i en mørkeblå boks (felt B). Fra felt B går en pil ned til et XOR-symbol (⊕). Fra venstre går en pil fra et felt med rød ramme (felt C) inn i XOR-symbolet. Fra XOR-symbolet går en pil ned til et felt med rød ramme (felt D). Til høyre, adskilt, teksten «Ingen» over et eget felt (felt E). Over figuren fem dra-bokser.",
      tekst: ["Dekryptering med tellermodus", "K", "Ingen"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Fem felt à 0,5 gir 2,5, men maks er 2; summen kappes til 2.",
      tekst: null,
      bank: ["Klartekst", "Chiffertekst", "D (Decrypt)", "Teller", "E (Encrypt)"],
      felt: [
        { etikett: "Felt A (øverst, går inn i boksen sammen med K)", svar: 3, godta: [], explain: "<p>Det som krypteres sammen med nøkkelen, er telleren: <strong>Teller</strong>.</p>" },
        { etikett: "Felt B (boksen som tar inn teller og K)", svar: 4, godta: [], explain: "<p>Også ved dekryptering brukes <strong>E (Encrypt)</strong>: vi lager den samme nøkkelstrømmen E(T, K) som ved kryptering.</p>" },
        { etikett: "Felt C (inn i XOR fra venstre)", svar: 1, godta: [], explain: "<p>Ved dekryptering er det <strong>chifferteksten</strong> som XOR-es med nøkkelstrømmen.</p>" },
        { etikett: "Felt D (ut av XOR, nederst)", svar: 0, godta: [], explain: "<p>Resultatet av XOR-en er <strong>klarteksten</strong>.</p>" },
        { etikett: "Ingen", svar: 2, godta: [], explain: "<p>D (Decrypt) brukes ikke i tellermodus i det hele tatt, så den hører under <strong>Ingen</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Nøkkelstrøm: E(T, K) – samme ved kryptering og dekryptering.", "M₁ = E(T₁, K) ⊕ C₁.", "D brukes ikke."],
    tips: ["Den vanligste feilen er å sette D i boksen. I CTR brukes bare E."]
  });
  hv("H2021-3.3",
    "<p>Tenk deg et sjablongark med hull. Du legger det over et brev for å skjule det, og legger det samme arket over igjen for å få brevet fram. Du lager arket på samme måte begge ganger – du trenger aldri et «omvendt» ark.</p>",
    "<p>I tellermodus krypteres telleren med nøkkelen for å lage en nøkkelstrøm. Klarteksten XOR-es med nøkkelstrømmen for å få chiffertekst. For å dekryptere lager man den samme nøkkelstrømmen (igjen med E) og XOR-er den med chifferteksten. XOR to ganger med det samme gir tilbake originalen, så D trengs ikke.</p>",
    "<p>Kryptering: C₁ = E(T₁, K) ⊕ M₁. Dekryptering: M₁ = E(T₁, K) ⊕ C₁, fordi (E(T₁, K) ⊕ M₁) ⊕ E(T₁, K) = M₁. Blokkchifferet brukes bare i retningen E, som en nøkkelstrømgenerator. Det gjør tellermodus til et strømchiffer bygd på et blokkchiffer, og blokkene kan behandles parallelt.</p>");

  O.push({
    key: "H2021-3.4", year: Y, oppgave_nr: "Oppgave 3.4", del: D3,
    ark: "3.4 Hashfunksjoner", title: "Hashfunksjoner: sant eller usant",
    points: 2, block: "krypto", tema: ["hashfunksjon", "kollisjonsresistens", "enveis"],
    gjenganger: ["H2022-5.2", "H2023-21", "H2024-18"],
    ordrett: true,
    oppgave: "<p>Angi hva som er korrekt for sikre hashfunksjoner.<br>Poeng: 0,5 for riktig, -0,5 for feil, 0 for intet valg, maks 2, minimum 0.</p>",
    inspera: {
      type: "F1",
      regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Fire separate sant/usant-spørsmål (radioknapper); hvert spørsmål er én enhet i poengregelen.",
      sporsmal: [
        { tekst: "Hashfunksjoner er teoretisk mulig å invertere", alternativer: ["Sant", "Usant"], svar: 0, explain: ["<p>Sant. Med uendelig tid kan man prøve alle inndata til man finner en som gir hashen. Det er praktisk umulig, men ikke teoretisk umulig.</p>", "<p>Feil valg. Inversjon er praktisk umulig, men teoretisk mulig ved å prøve alt.</p>"] },
        { tekst: "Det er praktisk mulig å finne to datasett som gir samme hashverdi", alternativer: ["Sant", "Usant"], svar: 1, explain: ["<p>Feil valg. Da ville hashfunksjonen ikke vært kollisjonsresistent.</p>", "<p>Usant. For en sikker hashfunksjon skal det være praktisk umulig å finne en kollisjon (sterk kollisjonsresistens). Kollisjoner finnes, men skal ikke kunne finnes.</p>"] },
        { tekst: "Hashverdien har alltid samme størrelse uansett inndatasett", alternativer: ["Sant", "Usant"], svar: 0, explain: ["<p>Sant. En hashfunksjon komprimerer inndata av vilkårlig lengde til en fast lengde, f.eks. 256 bit.</p>", "<p>Feil valg. Fast utdatalengde er et av kravene til en hashfunksjon.</p>"] },
        { tekst: "Endring av en enkelt bit i inndatasettet gjør at alle bits i hasverdien endres", alternativer: ["Sant", "Usant"], svar: 1, explain: ["<p>Feil valg. Omtrent halvparten av bitene endres.</p>", "<p>Usant. Omtrent halvparten av bitene endres. Hvis alle endret seg, ville utdata bare være inversen og lett å forutsi.</p>"] }
      ]
    },
    avvik: null,
    losning: ["Teoretisk mulig, praktisk umulig å invertere.", "Fast lengde ut.", "Omtrent halvparten av bitene endres ved én endret bit."],
    tips: ["«Alle bits endres» er en gjenganger-felle. Riktig er omtrent halvparten.", "Arket skriver «hasverdien» – skrivefeil i originalen."]
  });
  hv("H2021-3.4",
    "<p>En hashfunksjon er som en kjøttkvern: det er lett å lage kjøttdeig, men du får ikke biffen tilbake. Uansett hvor stor biffen er, kommer det ut en like stor porsjon. Bytter du ett krydder, ser halve porsjonen annerledes ut.</p>",
    "<p>En sikker hash har fast utdatalengde, er enveis (praktisk umulig å finne inndata fra hash, men teoretisk mulig ved å prøve alt) og er kollisjonsresistent (praktisk umulig å finne to inndata med samme hash). En liten endring i inndata gir en helt annerledes hash, der omtrent halvparten av bitene er endret.</p>",
    "<p>Kursets fem krav: lett å beregne, komprimering til fast lengde, enveis, svak og sterk kollisjonsresistens. Siden mange inndata avbildes på få utdata, finnes kollisjoner alltid (duehullprinsippet) – kravet er at de ikke kan finnes i praksis. Lavineffekten betyr at hver utdatabit endres med sannsynlighet omtrent ½; at alle bitene snus ville være like forutsigbart som at ingen gjør det.</p>");

  O.push({
    key: "H2021-3.5", year: Y, oppgave_nr: "Oppgave 3.5", del: D3,
    ark: "3.5 Digital signatur", title: "Hvilke nøkler brukes ved signering?",
    points: 2, block: "krypto", tema: ["digital signatur", "privat nøkkel", "offentlig nøkkel"],
    gjenganger: ["H2022-5.1"],
    ordrett: true,
    oppgave: "<p>Alice ønsker å sende en digitalt signert melding til Bob. Velg riktig eier og type nøkkel for signering og validering. Poeng: 0,5 for hvert korrekte valg, -0,5 for hvert feil valg, maks 2, minimum 0.</p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng: 0,5 for hvert korrekte valg, -0,5 for hvert feil valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      tekst: "<p>For å signere meldingen må Alice bruke {0} {1} nøkkel.</p><p>For å validere den digitale signaturen må Bob bruke {2} {3} nøkkel.</p>",
      felt: [
        { etikett: "Eier av signeringsnøkkel", valg: ["Bobs", "sin egen", "dommerens"], svar: 1, godta: [], explain: "<p>Alice signerer med <strong>sin egen</strong> nøkkel – det er det som binder signaturen til henne.</p>" },
        { etikett: "Type signeringsnøkkel", valg: ["offentlige", "symmetriske", "private"], svar: 2, godta: [], explain: "<p>Signering gjøres med den <strong>private</strong> nøkkelen, som bare Alice har.</p>" },
        { etikett: "Eier av valideringsnøkkel", valg: ["dommerens", "sin egen", "Alices"], svar: 2, godta: [], explain: "<p>Bob må bruke <strong>Alices</strong> nøkkel for å sjekke at det var hun som signerte.</p>" },
        { etikett: "Type valideringsnøkkel", valg: ["offentlige", "private", "symmetriske"], svar: 0, godta: [], explain: "<p>Validering gjøres med Alices <strong>offentlige</strong> nøkkel, som alle kan få tak i.</p>" }
      ]
    },
    avvik: null,
    losning: ["Signere: avsenderens private nøkkel.", "Validere: avsenderens offentlige nøkkel."],
    tips: ["Ikke bland med kryptering: der brukes mottakerens offentlige nøkkel.", "Denne teksten er identisk med H2022 5.1."]
  });
  hv("H2021-3.5",
    "<p>Alice har et personlig stempel som bare hun har (privat). Alle har fått et bilde av hvordan stempelet ser ut (offentlig). Bob sammenligner stempelet på brevet med bildet av Alices stempel.</p>",
    "<p>En digital signatur skal bevise hvem som sendte meldingen. Derfor må den lages med noe bare avsender har: Alices private nøkkel. Alle andre, også Bob, validerer med Alices offentlige nøkkel.</p>",
    "<p>Signering: S = Sig(H, K<sup>A</sup><sub>priv</sub>) der H = Hash(M). Validering: Bob beregner H′ = Hash(M′) og sjekker at Ver(S, K<sup>A</sup><sub>pub</sub>) = H′. Fordi bare Alice har K<sup>A</sup><sub>priv</sub>, gir dette ubenektelighet. En symmetrisk nøkkel ville bare gitt MAC-egenskaper.</p>");

  /* ======================== DEL 4: NØKKELHÅNDTERING OG PKI ======================== */

  O.push({
    key: "H2021-4.1", year: Y, oppgave_nr: "Oppgave 4.1", del: D4,
    ark: "4.1 Nøkkelstørrelse", title: "Nøkkelrom: antall nøkler og bitlengde",
    points: 2, block: "krypto", tema: ["nøkkelstørrelse", "nøkkelrom", "AES", "RSA"],
    ordrett: true,
    oppgave: "<p>Poeng for svar på spørsmålene: 0,5 for riktig, -0,5 for feil, maks 2, minimum 0.</p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng for svar på spørsmålene: 0,5 for riktig, -0,5 for feil, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Blandet oppgave: felt {0} og {1} er tekstfelt (heltall, sjekkes mot godta), felt {2} og {3} er nedtrekk. Poenglinja sier ikke noe om ubesvart; forsidens hovedregel (0 for ubesvart) er lagt til grunn.",
      tekst: "<p>Anta et chiffer med krypteringsnøkler med størrelse 8 bits. Hvor mange ulike nøkler fins det? Svar med et heltall: {0}.</p><p>Anta et chiffer med krypteringsnøkler der det fins 1024 forskjellige nøkler. Hva er nøkkelstørrelsen i antall bits.  Svar med et heltall: {1}.</p><p>Hva er typisk nøkkelstørrelse for AES-algoritmen? Velg: {2},</p><p>Hva er typisk nøkkelstørrelse for RSA-algoritmen? Velg: {3}</p>",
      felt: [
        { etikett: "Antall nøkler ved 8 bit", godta: ["256", "2^8", "2⁸", "256 nøkler", "to hundre og femtiseks"], explain: "<p>Hver bit kan være 0 eller 1, så 8 bit gir 2⁸ = <strong>256</strong> ulike nøkler.</p>" },
        { etikett: "Bitlengde ved 1024 nøkler", godta: ["10", "10 bit", "10 bits", "ti"], explain: "<p>Nøkkelstørrelsen er log₂ av antall nøkler: log₂(1024) = <strong>10</strong>, fordi 2¹⁰ = 1024.</p>" },
        { etikett: "Typisk AES-nøkkel", valg: ["128 bits", "1024 bits", "8 bits"], svar: 0, godta: [], explain: "<p>AES har 128-, 192- eller 256-bits nøkler; <strong>128 bits</strong> er den minste og vanligste.</p>" },
        { etikett: "Typisk RSA-nøkkel", valg: ["8 bits", "1024 bits", "128 bits"], svar: 1, godta: [], explain: "<p>Av alternativene er <strong>1024 bits</strong> riktig. RSA trenger mye lengre nøkler enn symmetriske chiffer for samme sikkerhet. I dag anbefales minst 2048 bit; se avvik.</p>" }
      ]
    },
    avvik: "Fasiten bruker 1024 bit som typisk RSA-nøkkelstørrelse. Det var vanlig tidligere, men regnes i dag som for kort (2048 bit eller mer anbefales). Svaret er likevel det eneste rimelige blant alternativene.",
    losning: ["Antall nøkler = 2^n: 2⁸ = 256.", "Bitlengde = log₂(antall): log₂(1024) = 10.", "AES: 128 bit. RSA: langt større (blant valgene 1024)."],
    tips: ["Kunne potensene 2⁸ = 256 og 2¹⁰ = 1024 utenat.", "Asymmetriske nøkler må være mye lengre enn symmetriske for samme sikkerhet."]
  });
  hv("H2021-4.1",
    "<p>En kodelås med 8 brytere som hver kan stå av eller på har 256 kombinasjoner. Vil du ha 1024 kombinasjoner, trenger du 10 brytere.</p>",
    "<p>Med n bit finnes 2^n forskjellige nøkler, så 8 bit gir 256. Motsatt er nøkkelstørrelsen log₂ av antall nøkler, så 1024 nøkler gir 10 bit. AES bruker typisk 128-bits nøkler, mens RSA trenger mye lengre nøkler (her 1024 bit) fordi angrepene på RSA er smartere enn å prøve alle nøkler.</p>",
    "<p>Kurset definerer nøkkelstørrelse som log₂(N) bit der N er antall mulige nøkler. 2⁸ = 256 og log₂(1024) = 10. For symmetriske chiffer er beste angrep i prinsippet uttømmende søk, så 128 bit gir om lag 2¹²⁷ forsøk i snitt. RSA kan angripes ved faktorisering, som er langt raskere enn å prøve alle tall, så nøkkelen må være mye lengre for tilsvarende styrke.</p>");

  O.push({
    key: "H2021-4.2", year: Y, oppgave_nr: "Oppgave 4.2", del: D4,
    ark: "4.2 Nøkkelkompromittering", title: "Hva kan en kompromittert nøkkel fortsatt brukes til?",
    points: 2, block: "pki", tema: ["nøkkelkompromittering", "kryptoperiode", "prosesseringsperiode"],
    ordrett: true,
    oppgave: "<p>Ved mistanke om nøkkelkompromittering kan visse kryptografiske funksjoner fremdeles tillates, Velg riktig alternativ. Poeng: 1 for hvert korrekte valg, -1 for hvert feil valg, maks 2, minimum 0.</p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng: 1 for hvert korrekte valg, -1 for hvert feil valg, maks 2, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      tekst: "<p>Ved kompromittering av hemmelig symmetrisk nøkkel kan nøkkelen fremdeles benyttes til {0}.</p><p>Ved kompromittering av privat asymmetrisk nøkkel kan nøkkelen fremdeles benyttes til {1}</p>",
      felt: [
        { etikett: "Hemmelig symmetrisk nøkkel", valg: ["dekryptering", "validering", "kryptering", "signering"], svar: 0, godta: [], explain: "<p>Ny data skal ikke lenger krypteres med en lekket nøkkel, men gamle data som allerede er kryptert med den, må fortsatt kunne leses: <strong>dekryptering</strong>.</p>" },
        { etikett: "Privat asymmetrisk nøkkel", valg: ["dekryptering", "kryptering", "signering", "validering"], svar: 0, godta: [], explain: "<p>Signering må stoppe (angriperen kan forfalske), men eiere må fortsatt kunne dekryptere gamle meldinger som er kryptert til dem: <strong>dekryptering</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Beskyttelse (kryptere, signere) stopper når nøkkelen er kompromittert.", "Prosessering av gamle data (dekryptere) kan fortsette, slik at man ikke mister tilgang til egne data."],
    tips: ["Tenk beskyttelsesperiode vs. prosesseringsperiode: kompromittering avslutter beskyttelsen, ikke prosesseringen."]
  });
  hv("H2021-4.2",
    "<p>Har noen kopiert nøkkelen til dagbokskrinet ditt, slutter du å legge nye hemmeligheter i det. Men du bruker fortsatt nøkkelen til å åpne skrinet og hente ut det som ligger der.</p>",
    "<p>Når en nøkkel kan være lekket, må den ikke brukes til å beskytte noe nytt: ikke kryptere og ikke signere. Men data som allerede er kryptert med nøkkelen, må fortsatt kunne dekrypteres, ellers mister eieren dataene sine. Derfor er dekryptering tillatt for begge nøkkeltypene.</p>",
    "<p>Kurset deler kryptoperioden i</p><ul><li>beskyttelsesperiode (kryptere med hemmelig/offentlig nøkkel, signere med privat) og</li><li>prosesseringsperiode (dekryptere med hemmelig/privat nøkkel, validere med offentlig).</li></ul><p>Ved kompromittering avsluttes beskyttelsesperioden umiddelbart, mens prosesseringen av eksisterende chiffertekst kan fortsette. For den private nøkkelen er validering ikke aktuelt (det gjøres med den offentlige), og kryptering gjøres ikke med privat nøkkel.</p>");

  O.push({
    key: "H2021-4.3", year: Y, oppgave_nr: "Oppgave 4.3", del: D4,
    ark: "4.3 Kryptoperioder", title: "Kryptoperioder: hvilken nøkkel brukes når?",
    points: 3, block: "pki", tema: ["kryptoperiode", "beskyttelsesperiode", "prosesseringsperiode"],
    ordrett: true,
    oppgave: "<p>For hver periode, angi hvilken type nøkkel det gjelder. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</p><p><strong>Angi hvilken type nøkkel det gjelder</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["hemmelig nøkkel", "offentlig nøkkel", "privat nøkkel"],
      multi: false,
      rader: [
        { s: "Beskyttelsesperiode for symmetrisk kryptering/dekryptering", svar: [0], explain: "<p>Symmetrisk krypto har bare én nøkkel, den <strong>hemmelige</strong>, som både krypterer og dekrypterer.</p>" },
        { s: "Prosesseringsperiode for symmetrisk kryptering/dekryptering", svar: [0], explain: "<p>Samme nøkkel brukes til å dekryptere: <strong>hemmelig nøkkel</strong>.</p>" },
        { s: "Beskyttelsesperiode for asymmetrisk signatur/validering", svar: [2], explain: "<p>Beskyttelsen er å lage signaturen, og det gjøres med den <strong>private</strong> nøkkelen.</p>" },
        { s: "Prosesseringsperiode for asymmetrisk signatur/validering", svar: [1], explain: "<p>Prosesseringen er å validere signaturer, og det gjøres med den <strong>offentlige</strong> nøkkelen.</p>" },
        { s: "Beskyttelsesperiode for asymmetrisk kryptering/dekryptering", svar: [1], explain: "<p>Beskyttelsen er å kryptere, og det gjøres med mottakerens <strong>offentlige</strong> nøkkel.</p>" },
        { s: "Prosesseringsperiode for asymmetrisk kryptering/dekryptering", svar: [2], explain: "<p>Prosesseringen er å dekryptere, og det gjøres med den <strong>private</strong> nøkkelen.</p>" }
      ]
    },
    avvik: null,
    losning: ["Beskyttelse = lage noe beskyttet (kryptere eller signere). Prosessering = bruke det (dekryptere eller validere).", "Symmetrisk: alltid hemmelig nøkkel.", "Signatur: privat beskytter, offentlig prosesserer. Kryptering: offentlig beskytter, privat prosesserer."],
    tips: ["Legg merke til at signatur og kryptering har motsatte roller for privat og offentlig nøkkel."]
  });
  hv("H2021-4.3",
    "<p>«Beskyttelse» er når du låser noe ned. «Prosessering» er når du senere åpner det eller sjekker det. For hver slags lås spør du: hvilken nøkkel låser, og hvilken åpner?</p>",
    "<ul><li>Beskyttelsesperioden er tiden en nøkkel brukes til å beskytte data (kryptere eller signere).</li><li>Prosesseringsperioden er tiden den brukes til å behandle beskyttede data (dekryptere eller validere).</li></ul><p>For symmetrisk krypto er det samme hemmelige nøkkel i begge. For signatur beskytter den private og prosesserer den offentlige; for asymmetrisk kryptering er det omvendt.</p>",
    "<p>Kryptoperioden strekker seg fra starten av beskyttelsesperioden til slutten av prosesseringsperioden, og prosesseringen kan vare lenger enn beskyttelsen (gamle data må kunne leses eller valideres). For asymmetriske nøkkelpar har de to nøklene derfor ulike perioder: for signatur er den private nøkkelens periode kortest, for kryptering er den offentlige nøkkelens periode kortest.</p>");

  O.push({
    key: "H2021-4.4", year: Y, oppgave_nr: "Oppgave 4.4", del: D4,
    ark: "4.4 Sertifikater", title: "Rot-, mellomliggende og subjektsertifikater",
    points: 3, block: "pki", tema: ["sertifikat", "rot-CA", "mellomliggende CA", "selvsignert"],
    gjenganger: ["H2022-6.2"],
    ordrett: true,
    oppgave: "<p>For hver beskrivelse, angi riktig sertifikat (der Ingen også er et alternativ). Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</p><p><strong>Velg riktig sertifikat</strong></p>",
    figur: {
      beskrivelse: "Tre like trær side om side. Hvert tre har øverst en fylt svart sirkel (rot), som har to piler ned til hver sin sirkel med en svart prikk i midten (mellomliggende), som igjen har piler ned til tomme sirkler på nederste rad (subjekter; tre per tre). Til høyre står etikettene, én per nivå: «Rotsertifikater», «Mellomliggende sertifikater», «Subjektsertifikater».",
      tekst: ["Rotsertifikater", "Mellomliggende sertifikater", "Subjektsertifikater"]
    },
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Rotsertifikater", "Mellomliggende sertifikater", "Subjektsertifikater", "Ingen"],
      multi: false,
      rader: [
        { s: "Inneholder webtjeners offentlige nøkkel", svar: [2], explain: "<p>Webtjeneren er subjektet nederst i kjeden; dens offentlige nøkkel står i <strong>subjektsertifikatet</strong>.</p>" },
        { s: "Inneholder webtjeners private nøkkel", svar: [3], explain: "<p>Et sertifikat inneholder aldri en privat nøkkel – det er et offentlig dokument: <strong>Ingen</strong>.</p>" },
        { s: "Er signert av webtjener", svar: [3], explain: "<p>Webtjeneren signerer ikke sertifikater; dens sertifikat er signert av en CA: <strong>Ingen</strong>.</p>" },
        { s: "Er selvsignert", svar: [0], explain: "<p>Roten har ingen over seg, så <strong>rotsertifikatet</strong> er signert med sin egen private nøkkel.</p>" },
        { s: "Er signert av rot-CA (ikke selvsignert)", svar: [1], explain: "<p>Rot-CA signerer de <strong>mellomliggende sertifikatene</strong>, som igjen signerer subjektsertifikatene.</p>" },
        { s: "Brukes til signering av subjektsertifikater", svar: [3], explain: "<p>Det er den mellomliggende CA-ens <em>private nøkkel</em> som signerer, ikke et sertifikat. Sertifikatet har bare den offentlige nøkkelen: <strong>Ingen</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Sertifikater inneholder offentlige nøkler, aldri private.", "Rot = selvsignert. Mellomliggende = signert av rot. Subjekt = signert av mellomliggende.", "Signering gjøres med private nøkler, ikke med sertifikater."],
    tips: ["Den siste raden er en klassisk felle: «sertifikatet signerer» er feil, svaret er Ingen."]
  });
  hv("H2021-4.4",
    "<p>Et sertifikat er som et pass: det viser navnet ditt og et bilde (din offentlige nøkkel), og det er stemplet av den som utstedte det. Passet inneholder ikke husnøkkelen din, og passet selv stempler ingen andre pass – det gjør kontoret, med stempelet sitt.</p>",
    "<p>I et PKI-hierarki er roten selvsignert, mellomliggende CA-er er signert av roten, og subjektsertifikater (f.eks. for en webtjener) er signert av en mellomliggende CA. Et sertifikat inneholder bare den offentlige nøkkelen, og signering gjøres med en privat nøkkel som ikke står i noe sertifikat.</p>",
    "<p>Et X.509-sertifikat binder et navn til en offentlig nøkkel, og bindingen er signert med utstederens private nøkkel. Validering starter i et rotsertifikat man stoler på fra før (selvsignert, så tilliten må komme utenfra, f.eks. fra nettleserens lager) og går ned gjennom kjeden. Formuleringen «sertifikat brukes til signering» er feil fordi sertifikatet bare kan brukes til å <em>validere</em> signaturer; den private nøkkelen som lager dem, holdes hemmelig hos CA-en.</p>");

  /* ============================ DEL 5: NETTVERKSSIKKERHET ============================ */

  O.push({
    key: "H2021-5.1", year: Y, oppgave_nr: "Oppgave 5.1", del: D5,
    ark: "5.1 Internettstakken", title: "Lagene i internettstakken",
    points: 2, block: "nettverk", tema: ["internettstakken", "protokollag"],
    gjenganger: ["H2022-7.1", "H2024-28", "H2025-22"],
    ordrett: true,
    oppgave: "<p>Tilordne protokolltypene til riktig lag i internettstakken. Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 3, minimum 0</p>",
    figur: {
      beskrivelse: "En loddrett stabel av rektangler. Øverst et turkis felt med teksten «Apper». Under det fire lyseblå felt (dra-felt 1–4 ovenfra og ned). Nederst et lysegrønt felt med teksten «Fysisk lag». Over figuren fire dra-bokser.",
      tekst: ["Apper", "Fysisk lag"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, maks 3, minimum 0",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Poenglinja sier «maks 3», men «Maks poeng» er 2, og fire felt à 0,5 gir høyst 2. Vi bruker 2.",
      tekst: null,
      bank: ["Internettprotokollen", "Applikasjonsprotokoller", "Transportprotokoller", "Linkprotokoller"],
      felt: [
        { etikett: "Felt 1 (rett under «Apper»)", svar: 1, godta: [], explain: "<p>Rett under appene ligger <strong>applikasjonsprotokollene</strong> (f.eks. HTTP, SMTP, DNS).</p>" },
        { etikett: "Felt 2", svar: 2, godta: [], explain: "<p>Deretter <strong>transportprotokollene</strong> (TCP, UDP), som gir ende-til-ende-forbindelse mellom programmer via porter.</p>" },
        { etikett: "Felt 3", svar: 0, godta: [], explain: "<p>Så <strong>Internettprotokollen</strong> (IP), som ruter pakker mellom maskiner via IP-adresser.</p>" },
        { etikett: "Felt 4 (rett over «Fysisk lag»)", svar: 3, godta: [], explain: "<p>Nederst før det fysiske laget ligger <strong>linkprotokollene</strong> (f.eks. Ethernet, Wi-Fi), som flytter rammer på ett nettsegment.</p>" }
      ]
    },
    avvik: "Poenglinja sier «maks 3», mens «Maks poeng» er 2. Med fire felt à 0,5 er 2 det høyeste som kan oppnås, så «maks 3» er en feil i arket.",
    losning: ["Ovenfra: applikasjon, transport, internett (IP), link – mellom «Apper» og «Fysisk lag»."],
    tips: ["Huskeregel: A-T-I-L ovenfra (applikasjon, transport, IP, link)."]
  });
  hv("H2021-5.1",
    "<p>Å sende en pakke: du skriver brevet (applikasjon), legger det i en konvolutt med navn på mottakeren i huset (transport), skriver gateadressen (IP), og postbilen kjører det til neste postkontor (link) på veien (fysisk).</p>",
    "<p>Internettstakken har fra toppen: applikasjonslaget (protokoller som HTTP), transportlaget (TCP/UDP), internettlaget (IP) og linklaget (f.eks. Ethernet). Under ligger det fysiske laget og over ligger appene.</p>",
    "<p>Hvert lag pakker inn data fra laget over med sin egen header. Transportlaget adresserer prosesser med porter, IP-laget adresserer maskiner og ruter mellom nett, og linklaget leverer rammer innen ett lokalt nett med MAC-adresser. Sikkerhetsprotokoller finnes på flere lag (se oppgave 5.2), og plasseringen bestemmer hva de kan beskytte.</p>");

  O.push({
    key: "H2021-5.2", year: Y, oppgave_nr: "Oppgave 5.2", del: D5,
    ark: "5.2 Sikkerhetsprotokoller", title: "Sikkerhetsprotokoll per lag",
    points: 2, block: "nettverk", tema: ["TLS", "IPsec", "protokollag"],
    gjenganger: ["H2022-7.1", "H2024-28", "H2025-22"],
    ordrett: true,
    oppgave: "<p>Velg riktig eksempel på sikkerhetsprotokoll for hvert lag i internettstakken. Poeng: 0,5 for hvert korrekte valg, -0,5 for hvert feil valg, maks 2, minimum 0.</p><p><strong>Velg riktig sikkerhetsprotokoll</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hvert korrekte valg, -0,5 for hvert feil valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["TLS Record", "Ingen", "IPSec", "TLS Handshake"],
      multi: false,
      rader: [
        { s: "Transportlaget", svar: [0], explain: "<p>Kurset plasserer <strong>TLS Record</strong>, som krypterer og integritetsbeskytter datastrømmen, i transportlaget.</p>" },
        { s: "Applikasjonslaget", svar: [3], explain: "<p><strong>TLS Handshake</strong> (forhandling, autentisering og nøkkeletablering) plasseres i applikasjonslaget i kurset.</p>" },
        { s: "Linklaget", svar: [1], explain: "<p>Ingen av de oppgitte protokollene ligger i linklaget (der finnes f.eks. WPA for Wi-Fi), så svaret er <strong>Ingen</strong>.</p>" },
        { s: "IP-laget", svar: [2], explain: "<p><strong>IPsec</strong> beskytter IP-pakker og ligger i IP-laget. Den har ingen port.</p>" }
      ]
    },
    avvik: null,
    losning: ["TLS deles i to: Handshake i applikasjonslaget, Record i transportlaget.", "IPsec i IP-laget.", "Linklaget: ingen av alternativene."],
    tips: ["Lagplasseringen av TLS følger kursets konvensjon; den kommer igjen i H22, H24 og H25."]
  });
  hv("H2021-5.2",
    "<p>Sikkerhet kan legges på ulike steder: rundt selve innholdet i brevet, rundt konvolutten eller rundt hele lastebilen. TLS og IPsec er slike lag med beskyttelse på ulike nivåer.</p>",
    "<p>I kurset ligger TLS Handshake i applikasjonslaget og TLS Record i transportlaget, mens IPsec ligger i IP-laget. Ingen av alternativene hører til linklaget.</p>",
    "<ul><li>TLS Handshake utveksler meldinger som selv bæres av TLS Record, og den gjør applikasjonsnære oppgaver (sertifikatvalidering, valg av chiffer, nøkkeletablering) – derfor plasserer kurset den i applikasjonslaget.</li><li>TLS Record kapsler inn en pålitelig byte-strøm over TCP og gir konfidensialitet og integritet til strømmen; kurset regner den til transportlaget.</li><li>IPsec (AH/ESP) beskytter hver IP-pakke og ligger derfor i IP-laget, uavhengig av porter.</li></ul>");

  O.push({
    key: "H2021-5.3", year: Y, oppgave_nr: "Oppgave 5.3", del: D5,
    ark: "5.3 Perfekt fremoverhemmelighold", title: "Perfekt fremoverhemmelighold (fritekst)",
    points: 4, block: "nettverk", tema: ["fremoverhemmelighold", "TLS 1.3", "DH", "TLS 1.2"],
    gjenganger: ["H2023-17", "H2025-12"],
    ordrett: true,
    oppgave: "<p>a) Nevn en sikkerhetsprotokoll for nøkkelutveksling/nøkkeletablering som støtter perfekt fremoverhemmelighold/fremoversikkerhet (perfect forward secrecy)?<br>b) Hva menes med perfekt fremoverhemmelighold?<br>c) Hvordan oppnås perfekt fremoverhemmelighold?<br>d) Nevn en sikkerhetsprotokoll som ikke støttet perfekt fremoverhemmelighold, og si hvorfor ikke (dvs. hvordan den etablerer øktnøkler/sesjonsnøkler).</p><p>Poeng: maks 4, minimum 0.</p><p><strong>Skriv besvarelsen nedenfor</strong></p>",
    inspera: {
      type: "E",
      regelTekst: "Poeng: maks 4, minimum 0.",
      regel: { riktig: 4, feil: 0, blankt: 0, min: 0, maks: 4 },
      regelMerknad: "Manuell retting. Poengfordelingen står i sensorteksten: a) 1, b) 0,5 + 0,5, c) 1, d) 0,5 + 0,5.",
      deler: [
        { del: "a)", poeng: 1, sporsmal: "<p>Nevn en sikkerhetsprotokoll for nøkkelutveksling/nøkkeletablering som støtter perfekt fremoverhemmelighold/fremoversikkerhet (perfect forward secrecy)?</p>", grense: "ett navn" },
        { del: "b)", poeng: 1, sporsmal: "<p>Hva menes med perfekt fremoverhemmelighold?</p>", grense: "én til to setninger" },
        { del: "c)", poeng: 1, sporsmal: "<p>Hvordan oppnås perfekt fremoverhemmelighold?</p>", grense: "én setning" },
        { del: "d)", poeng: 1, sporsmal: "<p>Nevn en sikkerhetsprotokoll som ikke støttet perfekt fremoverhemmelighold, og si hvorfor ikke (dvs. hvordan den etablerer øktnøkler/sesjonsnøkler).</p>", grense: "to setninger" }
      ]
    },
    avvik: "Sensorteksten sier at SSL ikke støttet perfekt fremoverhemmelighold. SSL 3.0 hadde likevel DHE-chifferserier som opsjon (RFC 6101), akkurat som TLS 1.2; poenget er at standardvalget var RSA-nøkkeltransport. Svar som fasiten på eksamen.",
    losning: ["a) TLS 1.3 (efemær DH i fullt handtrykk).", "b) Langtidsnøkkelen kan lekke senere uten at gamle øktnøkler avsløres.", "c) Ny, flyktig DH-utveksling per økt; DH-verdiene slettes etterpå.", "d) SSL / TLS 1.2 med RSA-nøkkeltransport: øktnøkkel(frøet) sendes kryptert med tjenerens offentlige nøkkel."],
    tips: ["Nevn begge halvdelene i b): hva som lekker (langtidsnøkkelen, senere) og hva som forblir hemmelig (tidligere øktnøkler).", "I d) må du si <em>hvorfor</em>: nøkkeltransport med offentlig nøkkel gjør at den private nøkkelen åpner alle gamle økter."]
  });
  IN.PERFEKT["H2021-5.3"] = {
    type: "eksamen",
    svar: [
      { del: "a)", tekst: "<p>TLS 1.3 (der et fullt handtrykk etablerer nøkkelen med Diffie-Hellman med flyktige verdier).</p>", poeng: ["Protokoll med fremoverhemmelighold, f.eks. TLS 1.3 (1p)"] },
      { del: "b)", tekst: "<p>Det handler om at tjenerens private langtidsnøkkel kan bli kompromittert en gang i framtiden. Fremoverhemmelighold betyr at øktnøkler som ble etablert før det, likevel forblir hemmelige, så gammel trafikk som angriperen har tatt opp, ikke kan dekrypteres.</p>", poeng: ["Scenario: langtidsnøkkelen lekker senere (0,5p)", "Tidligere øktnøkler forblir hemmelige (0,5p)"] },
      { del: "c)", tekst: "<p>Ved å etablere hver øktnøkkel med en ny (flyktig) Diffie-Hellman-utveksling, der DH-verdiene slettes etter økta. Langtidsnøkkelen brukes bare til å signere/autentisere utvekslingen, ikke til å transportere nøkkelen.</p>", poeng: ["Med DH (Diffie-Hellman) (1p)"] },
      { del: "d)", tekst: "<p>SSL (og TLS 1.2 når RSA-nøkkeltransport ble valgt, siden DH bare var en opsjon). Klienten laget hemmeligheten som øktnøkkelen avledes fra, og sendte den kryptert med tjenerens offentlige nøkkel. Den som senere får tjenerens private nøkkel, kan dekryptere denne hemmeligheten i opptak av gammel trafikk og dermed finne alle gamle øktnøkler.</p>", poeng: ["Protokoll uten fremoverhemmelighold, f.eks. SSL / TLS 1.2 (0,5p)", "Hvorfor: øktnøkkel(frø) sendt kryptert med tjenerens offentlige nøkkel (0,5p)"] }
    ],
    sensor: {
      deler: [
        { del: "a)", fasit: "<p>1 poeng for: f.eks. En sikkerhetsprotokoll som gir perfekt fremoverhemmelighold er f.eks. TLS (1.3)</p>", kriterier: "<p>1 poeng for: f.eks. En sikkerhetsprotokoll som gir perfekt fremoverhemmelighold er f.eks. TLS (1.3)</p>" },
        { del: "b)", fasit: "<p>0,5 poeng for: Dreier seg om tilfellet der servers private nøkkel (langtidsnøkkel) blir kompromittert en gang i fremtiden<br>0,5 poeng for: Tidligere øktnøkler som er utvekslet/etablert ved hjelp av langtidsnøkkelen forblir hemmelige fremover i tid, dvs blir ikke kompromittert, selv om langtidsnøkkel blir lekket.</p>", kriterier: "<p>0,5 poeng for: Dreier seg om tilfellet der servers private nøkkel (langtidsnøkkel) blir kompromittert en gang i fremtiden<br>0,5 poeng for: Tidligere øktnøkler som er utvekslet/etablert ved hjelp av langtidsnøkkelen forblir hemmelige fremover i tid, dvs blir ikke kompromittert, selv om langtidsnøkkel blir lekket.</p>" },
        { del: "c)", fasit: "<p>1 poeng for: f.eks. med DH (Diffie-Hellman)</p>", kriterier: "<p>1 poeng for: f.eks. med DH (Diffie-Hellman)</p>" },
        { del: "d)", fasit: "<p>0,5 poeng for: f.eks. I TLS 1.2 var DH bare en opsjon for nøkkeletablering, slik at TLS 1.2 ikke alltid støttet perfekt fremoverhemmelighold. SSL er en tidligere versjon av TLS som ikke støttet perfekt fremoverhemmelighold.<br>0,5 poeng for: Fordi hemmelig (frø-verdi for) øktnøkkel ble oversendt kryptert med tjeners offentlige nøkkel.</p>", kriterier: "<p>0,5 poeng for: f.eks. I TLS 1.2 var DH bare en opsjon for nøkkeletablering, slik at TLS 1.2 ikke alltid støttet perfekt fremoverhemmelighold. SSL er en tidligere versjon av TLS som ikke støttet perfekt fremoverhemmelighold.<br>0,5 poeng for: Fordi hemmelig (frø-verdi for) øktnøkkel ble oversendt kryptert med tjeners offentlige nøkkel.</p>" }
      ],
      merknad: "Sensorteksten står i svarfeltet i arket og er både modellsvar og poengfordeling; den er gjengitt likt i fasit og kriterier. Sidefoten på denne siden i PDF-en sier «16/30» mens resten sier «/29» (uten betydning for innholdet)."
    }
  };
  hv("H2021-5.3",
    "<p>Tenk deg at du og en venn hver gang dere snakker, lager en ny engangskode sammen og kaster den etterpå. Selv om noen senere stjeler nøkkelringen din, finnes ikke de gamle kodene noe sted, så gamle samtaler forblir hemmelige.</p>",
    "<p>Fremoverhemmelighold betyr at gamle økter forblir hemmelige selv om tjenerens private langtidsnøkkel lekker senere. Det oppnås med en ny Diffie-Hellman-utveksling for hver økt (TLS 1.3 gjør dette i fullt handtrykk; bare gjenopptak med ren forhåndsdelt nøkkel, PSK, mangler det).</p><p>Eldre protokoller som SSL og TLS 1.2 med RSA-nøkkeltransport sendte øktnøkkelens hemmelighet kryptert med tjenerens offentlige nøkkel; da åpner den private nøkkelen alle gamle økter.</p>",
    "<p>Ved hybrid kryptering (nøkkeltransport) avhenger alle øktnøkler av én langtidsnøkkel: K<sub>økt</sub> kan hentes fra opptak med D(C, K<sup>S</sup><sub>priv</sub>). Med flyktig DH velger partene nye a og b per økt, utveksler gᵃ og gᵇ [mod p], og beregner gᵃᵇ [mod p]. Etter økta slettes a og b. Langtidsnøkkelen brukes bare til å signere DH-verdiene (mot mann-i-midten), så å stjele den senere gir ingen informasjon om gᵃᵇ.</p>");

  O.push({
    key: "H2021-5.4", year: Y, oppgave_nr: "Oppgave 5.4", del: D5,
    ark: "5.4 Brannmurer", title: "Typer brannmur",
    points: 2, block: "nettverk", tema: ["brannmur", "tilstandsløs", "tilstandsbasert", "applikasjonsbrannmur", "TLS-inspeksjon", "HSTS"],
    gjenganger: ["H2022-7.3", "H2023-32", "H2025-24"],
    ordrett: true,
    oppgave: "<p>For hver egenskap, angi riktig type brannmur (der Ingen er et alternativ). Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi riktig type brannmur</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Tilstandsbasert pakkefilter", "Tilstandsløst pakkefilter", "Ingen", "Applikasjonsbrannmur"],
      multi: false,
      rader: [
        { s: "Kan støtte HSTS", svar: [2], explain: "<p>HSTS er en mekanisme mellom nettleser og nettsted (en HTTP-header som tvinger HTTPS). Det er ikke en brannmurfunksjon: <strong>Ingen</strong>.</p>" },
        { s: "Har statiske regler", svar: [1], explain: "<p>Et <strong>tilstandsløst pakkefilter</strong> ser på hver pakke for seg mot en fast regelliste.</p>" },
        { s: "Lager dynamiske regler", svar: [0], explain: "<p>Et <strong>tilstandsbasert pakkefilter</strong> husker forbindelser og slipper automatisk inn svartrafikk – i praksis regler som lages underveis.</p>" },
        { s: "Kan støtte TLS-inspeksjon", svar: [3], explain: "<p>For å se inn i TLS-trafikk må brannmuren forstå applikasjonslaget og terminere TLS: <strong>applikasjonsbrannmur</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Tilstandsløs: faste regler per pakke.", "Tilstandsbasert: husker forbindelser, dynamiske regler.", "Applikasjonsbrannmur: forstår innholdet, kan gjøre TLS-inspeksjon.", "HSTS er ikke brannmur."],
    tips: ["HSTS dukker opp som distraktor flere steder – det er nettleser/tjener, ikke nettverksutstyr."]
  });
  hv("H2021-5.4",
    "<p>En tilstandsløs portvakt har en fast liste og sjekker hver person for seg. En tilstandsbasert portvakt husker hvem som gikk ut, og slipper dem inn igjen. En applikasjonsportvakt åpner til og med koffertene og ser hva som ligger i dem.</p>",
    "<p>Tilstandsløse pakkefiltre har statiske regler og vurderer hver pakke alene. Tilstandsbaserte pakkefiltre holder oversikt over forbindelser og lager dynamiske regler for svartrafikk. Applikasjonsbrannmurer forstår protokollene på applikasjonslaget og kan derfor inspisere TLS-trafikk. HSTS er en nettlesermekanisme, ikke en brannmuregenskap.</p>",
    "<ul><li>Et tilstandsbasert filter har en forbindelsestabell: når en utgående TCP-forbindelse åpnes, legges en midlertidig regel inn som tillater de tilhørende svarpakkene.</li><li>TLS-inspeksjon krever at brannmuren opptrer som en kontrollert mann-i-midten med eget CA-sertifikat installert hos klientene, noe bare en proxy på applikasjonsnivå kan.</li><li>HSTS er en HTTP-respons-header fra tjeneren som nettleseren lagrer.</li></ul>");

  /* ============================ DEL 6: BRUKERAUTENTISERING ============================ */

  O.push({
    key: "H2021-6.1", year: Y, oppgave_nr: "Oppgave 6.1", del: D6,
    ark: "6.1 Passordcracking", title: "Passordlagring og knekking",
    points: 2, block: "autentisering", tema: ["passordlagring", "hash", "salt", "regnbuetabell"],
    gjenganger: ["H2022-8.1", "H2023-9"],
    ordrett: true,
    oppgave: "<p>Passord lagres på forskjellige måter i passorddatabaser. Hvis en slik database blir lekket vil angripere forsøke å cracke (avdekke) passordene. For hver lagringsmåte (som kan være reel eller ikke), angi hvordan passord kan crackes. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi hvordan passord kan crackes</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Vanskelig å cracke", "Uten hashtabell", "Ingen", "Med hashtabell"],
      multi: false,
      rader: [
        { s: "Lagret som hashverdi", svar: [3], explain: "<p>Usaltede hasher kan slås opp i ferdigberegnede tabeller over passord og hasher: <strong>med hashtabell</strong>.</p>" },
        { s: "Lagret som salt", svar: [2], explain: "<p>Et salt alene er bare en tilfeldig verdi og er ikke en måte å lagre passord på: <strong>Ingen</strong>.</p>" },
        { s: "Lagret i klartekst", svar: [1], explain: "<p>Passordet står der rett ut; det trengs ingen tabell: <strong>uten hashtabell</strong>.</p>" },
        { s: "Lagret som saltet hashverdi", svar: [0], explain: "<p>Saltet gjør ferdigberegnede tabeller ubrukelige, så angriperen må gjette hvert passord for seg: <strong>vanskelig å cracke</strong>. (Svake passord kan likevel gjettes.)</p>" }
      ]
    },
    avvik: null,
    losning: ["Klartekst: ingenting å knekke.", "Hash: slå opp i tabell.", "Saltet hash: tabeller virker ikke, må gjette per passord.", "«Salt» alene er ikke en lagringsmåte."],
    tips: ["Salt hindrer regnbuetabeller, ikke gjetting av svake passord."]
  });
  hv("H2021-6.1",
    "<p>Står passordet rett i lista, kan tyven bare lese det. Står det bare som et «fingeravtrykk», kan tyven slå opp i en stor bok over kjente fingeravtrykk. Er det blandet med en tilfeldig ingrediens først, virker ikke boka, og tyven må prøve seg fram for hvert passord.</p>",
    "<p>Klartekst gir passordet direkte. En vanlig hash kan knekkes med en hashtabell (ferdigberegnet liste over hasher av vanlige passord). Med saltet hash har hvert passord sitt eget salt, så ferdige tabeller virker ikke og knekking blir vanskelig. «Lagret som salt» er ikke en reell lagringsmåte.</p>",
    "<p>Salt er en tilfeldig verdi per bruker som lagres sammen med Hash(salt, passord). Fordi like passord da gir ulike hasher, må en angriper beregne nye hasher for hvert salt; forhåndsberegnede regnbuetabeller blir verdiløse. Saltet stopper likevel ikke ordbokangrep mot ett enkelt svakt passord, så sterke passord og helst langsomme hashfunksjoner trengs i tillegg.</p>");

  O.push({
    key: "H2021-6.2", year: Y, oppgave_nr: "Oppgave 6.2", del: D6,
    ark: "6.2 Biometrisk system", title: "Biometri: terskel, EER, PAD og FMR/FNMR",
    points: 3, block: "autentisering", tema: ["biometri", "FMR", "FNMR", "EER", "PAD", "terskel"],
    gjenganger: ["H2022-8.2"],
    ordrett: true,
    oppgave: "<p>Poeng for hvert svar: 0,5 for riktig, -0,5 for feil, maks 3, minimum 0.</p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng for hvert svar: 0,5 for riktig, -0,5 for feil, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Blandet oppgave: felt {0}–{3} er nedtrekk, felt {4} og {5} er tekstfelt (heltall, sjekkes mot godta). Ubesvart er ikke nevnt i poenglinja; forsidens hovedregel (0) er lagt til grunn.",
      tekst: "<p>Når terskelverdien for match (for å bli godtatt) heves, vil FMR {0}.</p><p>Et ideelt biometrisk system er når {1}.</p><p>PAD (Presentation Attack Detection) er å {2}.</p><p>Å oppdage forfalskning av biometri er {3} lav EER (Equal Error Rate).</p><p>Anta at et biometrisk system har blitt testet med 100 genuine brukere, og 100 ikke-genuine brukere. Testingen viste at systemet hadde FMR =  0,05, og FNMR = 0,07.</p><p>Hvor mange ikke-genuine brukere ble godtatt? Svar med heltall: {4}.</p><p>Hvor mange genuine brukere ble avvist? Svar med heltall: {5}.</p>",
      felt: [
        { etikett: "FMR når terskelen heves", valg: ["forblir uendret", "øke", "minske"], svar: 2, godta: [], explain: "<p>Høyere terskel betyr at det kreves likere prøver for match, så færre ikke-genuine slipper gjennom: FMR vil <strong>minske</strong> (mens FNMR øker).</p>" },
        { etikett: "Ideelt system", valg: ["FMR = FNMR = EER = 0", "FMR = FNMR", "FMR = 0", "FNMR = 0"], svar: 0, godta: [], explain: "<p>Ideelt slipper ingen falske gjennom og ingen ekte avvises, så begge feilratene og dermed EER er null: <strong>FMR = FNMR = EER = 0</strong>.</p>" },
        { etikett: "PAD er å", valg: ["oppdage forsøk på forfalskning av biometri", "oppdage når en genuin bruker blir feilaktig avvist", "oppdage når en ikke-genuin bruker blir feilaktig godtatt"], svar: 0, godta: [], explain: "<p>Et presentasjonsangrep er f.eks. en falsk finger eller et bilde av ansiktet. PAD skal <strong>oppdage forsøk på forfalskning av biometri</strong>.</p>" },
        { etikett: "Oppdage forfalskning og EER", valg: ["enkelt med", "vanskelig på tross av"], svar: 1, godta: [], explain: "<p>EER sier hvor godt systemet skiller ulike ekte personer, ikke om prøven er falsk. Forfalskning kan derfor være <strong>vanskelig på tross av</strong> lav EER.</p>" },
        { etikett: "Antall ikke-genuine godtatt", godta: ["5", "fem", "5 brukere"], explain: "<p>FMR = godtatte ikke-genuine / antall ikke-genuine, så 0,05 × 100 = <strong>5</strong>.</p>" },
        { etikett: "Antall genuine avvist", godta: ["7", "sju", "syv", "7 brukere"], explain: "<p>FNMR = avviste genuine / antall genuine, så 0,07 × 100 = <strong>7</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Høyere terskel ⇒ lavere FMR, høyere FNMR.", "Ideelt: alle feilrater null.", "PAD = oppdage falske prøver; lav EER hjelper ikke mot det.", "FMR × ikke-genuine = 0,05 × 100 = 5. FNMR × genuine = 0,07 × 100 = 7."],
    tips: ["Bruk kursets navn FMR/FNMR (ikke FAR/FRR).", "Lav FMR sier ingenting om robusthet mot falske fingre – det er PAD sin jobb."]
  });
  hv("H2021-6.2",
    "<p>Tenk på en dørvakt som sammenligner ansiktet ditt med et bilde. Er han streng, slipper færre fremmede inn, men oftere blir også ekte gjester avvist. Og en god ansiktssammenligning hjelper ikke om noen holder opp en maske – det må oppdages på en annen måte.</p>",
    "<p>FMR er andelen falske som feilaktig godtas, FNMR andelen ekte som feilaktig avvises. Hever man terskelen, går FMR ned og FNMR opp. EER er punktet der de er like. PAD oppdager forfalskede prøver, og det er et eget problem som lav EER ikke løser. Tallene: 5 % av 100 ikke-genuine = 5 godtatt, 7 % av 100 genuine = 7 avvist.</p>",
    "<p>Systemet beregner en score S og godtar når S ≥ T. Øker T, krymper området av ikke-genuine scorer over T (FMR ↓) og området av genuine scorer under T vokser (FNMR ↑). EER er der kurvene krysser. FMR og FNMR måles mot ekte biometri fra andre personer, så de sier ingenting om angrep med kunstige prøver; derfor trengs PAD (deteksjon av presentasjonsangrep) som eget lag.</p>");

  O.push({
    key: "H2021-6.3", year: Y, oppgave_nr: "Oppgave 6.3", del: D6,
    ark: "6.3 Autentiseringsenheter", title: "Typer autentiseringsenheter",
    points: 3, block: "autentisering", tema: ["OTP", "FIDO", "BankID", "sekundærkanal", "smartkort"],
    ordrett: true,
    oppgave: "<p>For hver karakteristikk, angi tilhørende type autentiseringsenhet. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</p><p><strong>Angi type autentiseringsenhet</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["OTP-brikke", "Pass og ID-kort", "Online-enhete", "Sekundærkanal"],
      multi: false,
      rader: [
        { s: "Brukes i FIDO-løsninger", svar: [2], explain: "<p>FIDO-nøkler kobles til maskinen (USB, NFC) og kommuniserer direkte med nettleseren under autentiseringen: <strong>online-enhet</strong>.</p>" },
        { s: "Har som regel klokke", svar: [0], explain: "<p>Mange <strong>OTP-brikker</strong> lager engangskoden ut fra tiden, og trenger derfor en klokke.</p>" },
        { s: "Brukes i BankID på mobil", svar: [3], explain: "<p>BankID på mobil bruker mobilen som en egen kanal ved siden av nettleseren: <strong>sekundærkanal</strong>.</p>" },
        { s: "Brukes i BankID", svar: [0], explain: "<p>Klassisk BankID brukte en kodebrikke som viser engangskoder: <strong>OTP-brikke</strong>.</p>" },
        { s: "Blir autentisert av leser/terminal", svar: [1], explain: "<p>Elektroniske <strong>pass og ID-kort</strong> leses av en leser, som sjekker at kortet er ekte.</p>" },
        { s: "Brukes for overføring av autorisasjonskode/mønster til bruker", svar: [3], explain: "<p>En kode sendt til brukeren via f.eks. SMS eller app går over en <strong>sekundærkanal</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["OTP-brikke: klokke, klassisk BankID.", "Pass/ID-kort: autentiseres av leser.", "Online-enhet: FIDO-nøkkel koblet til maskinen.", "Sekundærkanal: mobil/SMS, BankID på mobil."],
    tips: ["Kolonnen heter «Online-enhete» i arket (avkuttet «Online-enheter»).", "En sekundærkanal er en annen kommunikasjonsvei enn den du logger inn gjennom."]
  });
  hv("H2021-6.3",
    "<p>Noen ganger viser en liten dings deg en kode (OTP-brikke). Noen ganger stikker du et kort i en leser (pass/ID-kort). Noen ganger kobler du en nøkkel rett i datamaskinen (online-enhet). Og noen ganger får du en melding på telefonen ved siden av (sekundærkanal).</p>",
    "<p>Enhetene skilles på hvordan de snakker med systemet. OTP-brikker viser koder brukeren taster inn, ofte basert på klokke (gammel BankID). Pass og ID-kort leses av en terminal. Online-enheter, som FIDO-nøkler, kommuniserer direkte med datamaskinen. Sekundærkanal er en separat kanal, typisk mobilen, brukt i BankID på mobil og til å sende koder til brukeren.</p>",
    "<ul><li>OTP-brikker er offline: de deler en hemmelighet med tjeneren og bruker tid eller teller for å lage koder; brukeren er overføringskanalen.</li><li>Online-enheter (FIDO/passnøkler) gjør en kryptografisk utfordring–svar-utveksling direkte med nettleseren, som også binder svaret til domenet.</li><li>Sekundærkanaler bruker en uavhengig kanal (mobilnett, app) slik at en angriper må kompromittere to kanaler.</li></ul>");

  O.push({
    key: "H2021-6.4", year: Y, oppgave_nr: "Oppgave 6.4", del: D6,
    ark: "6.4 Rammeverk for e-autentisering", title: "NIST, eIDAS og RAU",
    points: 2, block: "autentisering", tema: ["garantinivå", "NIST SP 800-63-3", "eIDAS", "RAU"],
    gjenganger: ["H2022-8.4", "H2024-30"],
    ordrett: true,
    oppgave: "<p>Tre rammeverk for e-autentisering er<br>- NIST SP800-63-3, USA 2017<br>- eIDAS, EU 2014<br>- RAU (Rammeverk for autentiserinig og uavviselighet), Norge 2008</p><p>For hver karakteristikk, angi tilhørende rammeverk for e-autentisering. Poeng: 0,5 for hver korrekt, -0,5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi tilhørende rammeverk for e-autentisering</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0,5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["NIST, USA 2017", "RAU, Norge 2008", "eIDAS, EU 2014"],
      multi: false,
      rader: [
        { s: "Beskriver krav til ID-føderering", svar: [0], explain: "<p>NIST SP 800-63-3 har en egen del om føderering (FAL, federation assurance level): <strong>NIST</strong>.</p>" },
        { s: "Beskriver 3 kategorier krav til autentiseringsløsninger", svar: [2], explain: "<p><strong>eIDAS</strong> stiller krav i tre kategorier og har tre nivåer. Kurset (BA-lysarket, D08 s. 46) navngir kategoriene slik: ID-registrering og autentikatorhåndtering, autentiseringsmetode og fødereringssikkerhet.</p>" },
        { s: "Beskriver ikke krav til registrering av ID", svar: [1], explain: "<p><strong>RAU</strong> stilte krav til selve autentiseringsløsningen, men ikke til registreringen av identiteten.</p>" },
        { s: "Definerer 4 autentiseringsnivåer", svar: [1], explain: "<p><strong>RAU</strong> hadde fire sikkerhetsnivåer. NIST og eIDAS har tre.</p>" }
      ]
    },
    avvik: null,
    losning: ["NIST 800-63-3: tre deler (identitet, autentisering, føderering).", "eIDAS: tre kategorier krav, tre nivåer.", "RAU: fire nivåer, ikke krav til registrering."],
    tips: ["RAU og NIST SP 800-63-3 er ikke lenger på 2026-lysarkene (2026 viser eIDAS og 800-63-4); kunne tallene 3 og 4 likevel.", "Arket skriver «autentiserinig» – skrivefeil i originalen."]
  });
  hv("H2021-6.4",
    "<p>Tre land har laget hver sin regelbok for hvor trygg en innlogging må være. Den norske fra 2008 hadde fire trinn og brydde seg ikke om hvordan du fikk ID-en din. Den amerikanske sier også noe om hvordan flere tjenester kan dele én innlogging. Den europeiske deler kravene i tre grupper.</p>",
    "<p>NIST SP 800-63-3 dekker identitetsregistrering, autentisering og føderering (derav krav til ID-føderering). eIDAS stiller krav i tre kategorier (ID-registrering og autentikatorhåndtering, autentiseringsmetode, fødereringssikkerhet) og har tre nivåer (lav, betydelig, høy). RAU (Norge 2008) hadde fire nivåer og stilte ikke krav til registrering av ID.</p>",
    "<p>Garantinivå (level of assurance) uttrykker hvor stor tillit man kan ha til at den som autentiseres, er den hen sier.</p><ul><li>NIST 800-63-3 skiller IAL (identitet), AAL (autentisering) og FAL (føderering).</li><li>eIDAS kombinerer tre kategorier krav i tre nivåer.</li><li>Kurset (BA-lysarket) deler dem i ID-registrering og autentikatorhåndtering, autentiseringsmetode og fødereringssikkerhet.</li><li>Selve gjennomføringsforordningen (EU) 2015/1502 deler kravene i fire avsnitt, men på eksamen gjelder kursets tre.</li><li>RAU var et eldre norsk rammeverk med fire nivåer som bare så på autentiseringsløsningen.</li></ul>");

  /* ==================== DEL 7: IDENTITETS- OG TILGANGSHÅNDTERING ==================== */

  O.push({
    key: "H2021-7.1", year: Y, oppgave_nr: "Oppgave 7.1", del: D7,
    ark: "7.1 ID-modeller", title: "Silo eller føderert?",
    points: 2, block: "iam", tema: ["silo", "føderert", "ID-porten", "IdP", "SP"],
    gjenganger: ["H2022-9.1", "H2023-13", "H2023-34"],
    ordrett: true,
    oppgave: "<p>To modeller for identitetshåndterinig er silo-modellen og fødert modell.</p><p>For hver karakteristikk, angi tilhørende modell for identitetshåndtering. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi tilhørende modell for identitetshåndtering</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Silo", "Føderert"],
      multi: false,
      rader: [
        { s: "Gjøre at bruker får mange passord", svar: [0], explain: "<p>I <strong>silo</strong>-modellen har hver tjeneste sin egen brukerdatabase, så brukeren får ett passord per tjeneste.</p>" },
        { s: "Gjør det lett å dele informasjon om brukere", svar: [1], explain: "<p>I <strong>føderert</strong> modell sender IdP-en informasjon om brukeren til mange SP-er, så deling blir enkelt (på godt og vondt for personvernet).</p>" },
        { s: "SP og IdP er samme entitet", svar: [0], explain: "<p>I <strong>silo</strong> er tjenesten selv også identitetsleverandør.</p>" },
        { s: "Benyttes i ID-porten", svar: [1], explain: "<p>ID-porten er en felles innloggingstjeneste som mange offentlige tjenester stoler på: <strong>føderert</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Silo: hver tjeneste sin egen ID og autentisering; SP = IdP; mange passord.", "Føderert: én IdP, mange SP-er stoler på den; lett å dele info; ID-porten."],
    tips: ["Arket skriver «identitetshåndterinig» og «fødert» – skrivefeil i originalen."]
  });
  hv("H2021-7.1",
    "<p>Silo er som å ha et eget medlemskort for hver butikk. Føderert er som å bruke ett ID-kort som alle butikkene godtar.</p>",
    "<p>I silomodellen er tjenesteleverandøren (SP) også identitetsleverandør (IdP), så brukeren må ha konto og passord hos hver tjeneste. I føderert modell autentiserer brukeren seg hos én IdP, og flere SP-er godtar billetten. Det gir færre passord og enklere deling av brukerinformasjon, som i ID-porten.</p>",
    "<p>Føderering bygger på en tillitsavtale: SP-ene stoler på sikkerhetsbilletter (f.eks. SAML-assertions eller OIDC ID-tokens) som IdP-en signerer. Fordelen er enkel pålogging og sentral kontroll; ulempen er at IdP-en blir et attraktivt mål og kan se hvilke tjenester brukeren bruker, og at attributter lett deles mellom SP-er.</p>");

  O.push({
    key: "H2021-7.2", year: Y, oppgave_nr: "Oppgave 7.2", del: D7,
    ark: "7.2 Open ID Connect", title: "OIDC: meldingene i riktig rekkefølge",
    points: 6, block: "iam", tema: ["OIDC", "OpenID Connect", "IdP", "SP", "ID-token", "føderering"],
    gjenganger: ["H2024-31", "H2023-35"],
    ordrett: true,
    oppgave: "<p>Figuren viser scenarioet for brukerautentisering med OIDC. Sett inn tall 1 - 12 i hver melding for å vise rekkefølgen av meldingene i scenarioet.</p><p>Poeng: 0,5 for korrekt tall, 0 for for feil tall, 0 for intet valg, maks 6, minimum 0.</p>",
    figur: {
      beskrivelse: "Øverst logoen «OpenID Connect» med teksten «Federation Agreement» under; fra den går en pil til venstre ned til et IdP-ikon (hånd på kort) og en pil til høyre ned til et SP-ikon (bygning). Under ikonene en rosa boks «IdP» til venstre og en rosa boks «SP» til høyre. I midten nederst en blå avrundet boks «Nettleser» med en person (dress) ved siden av. Tolv meldinger, hver med en svart sirkel der tallet skal stå (her listet omtrent ovenfra og ned i figuren, ikke i rekkefølge): «be om autentisering»: pil fra Nettleser opp og til venstre til IdP. «tjenesteforespørsel»: pil fra Nettleser opp til SP. «vis login-side»: pil fra IdP ned til Nettleser. «liste over IdP-er»: pil fra SP ned til Nettleser. «bruker autentiseres»: løkke fra IdP til seg selv på venstre side. «velg IdP»: pil fra Nettleser skrått opp til SP. «send autentikator»: pil fra Nettleser skrått opp til IdP, med grønt nøkkelikon. «diriger nettleser til IdP»: pil fra SP skrått ned til Nettleser. «token til nettleser»: pil fra IdP ned og til høyre til Nettleser, med rød boks «Token» og gul hengelås. «videresend token til SP»: pil fra Nettleser til høyre og opp til SP, med rød boks «Token» og hengelås. «presenter autentikator»: gul bøyd pil fra personen til Nettleser, med et grønt nøkkelikon. «tjeneste»: pil fra SP ned rundt høyre side og tilbake til Nettleser. I utskriften er tekstfeltene forskjøvet bort fra sirklene (se avvik).",
      tekst: ["OpenID Connect", "Federation Agreement", "IdP", "SP", "Nettleser", "Token", "be om autentisering", "tjenesteforespørsel", "vis login-side", "liste over IdP-er", "bruker autentiseres", "velg IdP", "send autentikator", "diriger nettleser til IdP", "token til nettleser", "videresend token til SP", "presenter autentikator", "tjeneste"]
    },
    inspera: {
      type: "T",
      regelTekst: "Poeng: 0,5 for korrekt tall, 0 for for feil tall, 0 for intet valg, maks 6, minimum 0.",
      regel: { riktig: 0.5, feil: 0, blankt: 0, min: 0, maks: 6 },
      tekst: null,
      felt: [
        { etikett: "tjenesteforespørsel (Nettleser → SP)", godta: ["1", "en", "én", "ett"], explain: "<p>Alt starter med at brukeren vil bruke tjenesten: nettleseren ber SP om tjenesten (<strong>1</strong>).</p>" },
        { etikett: "liste over IdP-er (SP → Nettleser)", godta: ["2", "to"], explain: "<p>SP vet ikke hvem brukeren er og svarer med en liste over IdP-er den stoler på (<strong>2</strong>).</p>" },
        { etikett: "velg IdP (Nettleser → SP)", godta: ["3", "tre"], explain: "<p>Brukeren velger hvilken IdP hen vil logge inn med (<strong>3</strong>).</p>" },
        { etikett: "diriger nettleser til IdP (SP → Nettleser)", godta: ["4", "fire"], explain: "<p>SP sender nettleseren videre (omdirigering) til den valgte IdP-en (<strong>4</strong>).</p>" },
        { etikett: "be om autentisering (Nettleser → IdP)", godta: ["5", "fem"], explain: "<p>Nettleseren følger omdirigeringen og ber IdP-en om autentisering (<strong>5</strong>).</p>" },
        { etikett: "vis login-side (IdP → Nettleser)", godta: ["6", "seks"], explain: "<p>IdP-en svarer med en innloggingsside (<strong>6</strong>).</p>" },
        { etikett: "presenter autentikator (bruker → Nettleser)", godta: ["7", "sju", "syv"], explain: "<p>Brukeren taster inn passord eller bruker nøkkel/enhet (<strong>7</strong>).</p>" },
        { etikett: "send autentikator (Nettleser → IdP)", godta: ["8", "åtte"], explain: "<p>Nettleseren sender autentikatoren til IdP-en (<strong>8</strong>).</p>" },
        { etikett: "bruker autentiseres (IdP)", godta: ["9", "ni"], explain: "<p>IdP-en sjekker autentikatoren mot det den har lagret (<strong>9</strong>).</p>" },
        { etikett: "token til nettleser (IdP → Nettleser)", godta: ["10", "ti"], explain: "<p>Etter vellykket autentisering lager IdP-en et signert ID-token og sender det til nettleseren (<strong>10</strong>).</p>" },
        { etikett: "videresend token til SP (Nettleser → SP)", godta: ["11", "elleve"], explain: "<p>Nettleseren tar tokenet med tilbake til SP (<strong>11</strong>).</p>" },
        { etikett: "tjeneste (SP → Nettleser)", godta: ["12", "tolv"], explain: "<p>SP validerer tokenet (IdP-ens signatur) og leverer tjenesten (<strong>12</strong>).</p>" }
      ]
    },
    avvik: ["I den flatede PDF-en er tekstfeltene forskjøvet bort fra sirklene i figuren, så det går ikke å lese direkte hvilket godtatt tall (grønne parenteser (1)–(12)) som hører til hvilken melding.", "Felt som står ved riktig melding: (9) ved «bruker autentiseres» og (8) ved «send autentikator».", "Resten av tilordningen er tatt fra den tilsvarende figuren i H2024 31 (litt andre etiketter), der feltene står på plass (1 tjenesteforespørsel … 12 tjeneste), og stemmer med OIDC-flyten i kurset. Hvert felt godtar ett tall, og alle tallene 1–12 forekommer én gang."],
    losning: ["Del i tre: hos SP (1–4), hos IdP (5–10), tilbake til SP (11–12).", "SP: forespørsel, liste, valg, omdirigering.", "IdP: be om aut., login-side, bruker presenterer, sendes, sjekkes, token tilbake.", "SP: token videresendes, tjeneste leveres."],
    tips: ["Nettleseren er budbringer mellom SP og IdP – SP og IdP snakker ikke direkte sammen i denne flyten.", "Tilsvarende figur i H2024 31 (litt andre etiketter; der 0,25 p per tall)."]
  });
  hv("H2021-7.2",
    "<p>Du vil inn på en klubb (SP). Dørvakten sier: «Hvem kan gå god for deg?» og peker på noen kontorer. Du går til ett kontor (IdP), viser legitimasjon, får en forseglet lapp, går tilbake og viser lappen. Da slipper du inn.</p>",
    "<p>OIDC går i tre runder. Først hos SP: brukeren ber om tjenesten, får en liste over IdP-er, velger én og blir sendt videre. Så hos IdP: nettleseren ber om autentisering, får login-side, brukeren gir autentikatoren som sendes og sjekkes, og IdP-en gir et token til nettleseren. Til slutt tilbake til SP: tokenet videresendes og SP leverer tjenesten.</p>",
    "<p>OIDC er et autentiseringslag på OAuth 2.0. IdP-en (OpenID Provider) utsteder et ID-token signert med sin private nøkkel; SP-en (Relying Party) validerer det med IdP-ens offentlige nøkkel i henhold til føderasjonsavtalen.</p><p>I kursets forenklede scenario går all kommunikasjon via nettleseren med omdirigeringer, så SP aldri ser brukerens autentikator. (I den vanlige autorisasjonskodeflyten i OIDC-spesifikasjonen får nettleseren bare en kode, og SP henter ID-tokenet direkte fra IdP-en.)</p><p>Hengelåsen på tokenet i figuren markerer at det er beskyttet (signert) slik at nettleseren ikke kan endre det.</p>");

  O.push({
    key: "H2021-7.3", year: Y, oppgave_nr: "Oppgave 7.3", del: D7,
    ark: "7.3 Tilgangskontroll", title: "RBAC, MAC, ABAC eller DAC",
    points: 2, block: "iam", tema: ["RBAC", "MAC", "ABAC", "DAC", "tilgangskontrollmodeller"],
    gjenganger: ["H2022-9.3", "H2022-9.4"],
    ordrett: true,
    oppgave: "<p>Fire modeller for tilgangskontroll er ABAC, DAB, MAC og RBAC.</p><p>For hver karakteristikk, angi tilhørende modell for tilgangskontroll. Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.</p><p><strong>Angi riktig modell</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["RBAC", "MAC", "ABAC", "DAC"],
      multi: false,
      rader: [
        { s: "Egner seg når det er et fast sett med jobbfunksjoner", svar: [0], explain: "<p>Jobbfunksjoner blir roller, og tilgang gis til rollene: <strong>RBAC</strong>.</p>" },
        { s: "Brukes i Windows/Linux", svar: [3], explain: "<p>Filrettigheter i Windows og Linux settes av eieren av fila (ACL / rwx): <strong>DAC</strong>.</p>" },
        { s: "Er en generell modell", svar: [2], explain: "<p><strong>ABAC</strong> bruker vilkårlige attributter og kan uttrykke de andre modellene.</p>" },
        { s: "Støtter spesielle krav i militære systemer", svar: [1], explain: "<p><strong>MAC</strong> med klareringer og graderinger (f.eks. Bell-LaPadula) ble laget for militære krav til konfidensialitet.</p>" }
      ]
    },
    avvik: null,
    losning: ["RBAC: roller. DAC: eier bestemmer (Windows/Linux). ABAC: generell, attributter. MAC: systemet bestemmer etter merker (militært)."],
    tips: ["Arket skriver «DAB» i innledningen, men kolonnen heter DAC.", "MAC betyr her Mandatory Access Control, ikke Message Authentication Code."]
  });
  hv("H2021-7.3",
    "<p>DAC: du bestemmer selv hvem som får låne sykkelen din. MAC: militæret bestemmer ut fra stempler på papirene. RBAC: alle med jobben «kokk» får gå inn på kjøkkenet. ABAC: reglene kan bruke hva som helst, som tid på døgnet, avdeling og alder.</p>",
    "<p>RBAC passer når tilganger følger faste jobbfunksjoner (roller). DAC lar eieren av en ressurs bestemme tilgangen, slik filrettigheter fungerer i Windows og Linux. MAC lar systemet avgjøre ut fra klareringer og graderinger, som i militære systemer. ABAC er den mest generelle modellen fordi den bruker vilkårlige attributter.</p>",
    "<ul><li>DAC realiseres med tilgangskontrollister per objekt, styrt av eieren.</li><li>MAC (f.eks. BLP med «no read up» og «no write down») håndheves av systemet og kan ikke overstyres av brukeren, og støtter konfidensialitet.</li><li>RBAC samler tillatelser i roller og tildeler brukere roller.</li><li>ABAC evaluerer regler over attributter for subjekt, objekt, handling og miljø, og kan derfor emulere både roller (rolle som attributt) og merker (klarering som attributt).</li></ul>");

  /* ==================== DEL 8: LEDELSE AV INFORMASJONSSIKKERHET ==================== */

  O.push({
    key: "H2021-8.1", year: Y, oppgave_nr: "Oppgave 8.1", del: D8,
    ark: "8.1 ISO/IEC-standarder", title: "ISO/IEC 27001 vs. 27002",
    points: 3, block: "risiko", tema: ["ISO 27001", "ISO 27002", "ISMS", "tiltaksbank", "sertifisering"],
    gjenganger: ["H2023-36", "H2025-28"],
    ordrett: true,
    oppgave: "<p>To prominente standarder for ledelse av informasjonssikkerhet er ISO/IEC 27001 og 27002.</p><p>For hver karakteristikk, angi tilhørende standard (eventuelt begge eller ingen). Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</p><p><strong>Angi tilhørende standard</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["ISO/IEC 27001", "ISO/IEC 27002", "Begge", "Ingen"],
      multi: false,
      rader: [
        { s: "Beskriver tiltaksbank for sikkerhet", svar: [1], explain: "<p><strong>27002</strong> er tiltaksbanken: en katalog med sikkerhetstiltak og veiledning.</p>" },
        { s: "Beskriver ISMS", svar: [0], explain: "<p><strong>27001</strong> stiller kravene til et styringssystem for informasjonssikkerhet (ISMS).</p>" },
        { s: "Er gratis", svar: [3], explain: "<p>ISO-standarder må kjøpes: <strong>Ingen</strong>.</p>" },
        { s: "Kommer opprinnelig fra BSI (British Standard)", svar: [2], explain: "<p>Begge stammer fra den britiske standarden BS 7799 (del 1 ble 27002, del 2 ble 27001): <strong>Begge</strong>.</p>" },
        { s: "Er obligatorisk i norsk statlig forvaltning", svar: [3], explain: "<p>Forvaltningen skal ha internkontroll (styringssystem) for informasjonssikkerhet, men ISO-standardene er ikke påbudt: <strong>Ingen</strong>.</p>" },
        { s: "Danner grunnlag for sertiifisering av virksomheter", svar: [0], explain: "<p>Det er kravstandarden <strong>27001</strong> virksomheter sertifiseres mot.</p>" }
      ]
    },
    avvik: null,
    losning: ["27001: krav til ISMS, sertifiserbar.", "27002: tiltaksbank, veiledende.", "Begge: fra BS 7799, må kjøpes, ingen er obligatoriske."],
    tips: ["«27002 er sertifiserbar» er en klassisk felle.", "Arket skriver «sertiifisering» – skrivefeil i originalen."]
  });
  hv("H2021-8.1",
    "<p>27001 er som regelboka for hvordan en klubb skal styres, og det er den revisoren sjekker. 27002 er en stor verktøykasse med ting klubben kan bruke. Begge kom fra en britisk bok, og begge koster penger.</p>",
    "<p>ISO/IEC 27001 beskriver krav til et ISMS og er standarden virksomheter sertifiseres etter. ISO/IEC 27002 er en tiltaksbank med veiledning. Begge har opphav i britisk standard (BS 7799), ingen av dem er gratis, og ingen av dem er obligatoriske i norsk statlig forvaltning.</p>",
    "<ul><li>27001 er en kravstandard («skal»-krav) for å etablere, drifte og forbedre et ISMS etter en PDCA-syklus, med et vedlegg som lister tiltakene.</li><li>27002 utdyper de samme tiltakene med veiledning, men er ikke selv sertifiserbar.</li><li>Norsk forvaltning har krav om internkontroll/styringssystem, og Digdir bruker begrepet internkontroll om omtrent det samme som ISMS (ISM-arket), men 27001 er ikke lovpålagt.</li></ul>");

  O.push({
    key: "H2021-8.2", year: Y, oppgave_nr: "Oppgave 8.2", del: D8,
    ark: "8.2 Rammeverk for cybersikkerhet", title: "NIST CSF og NSMs grunnprinsipper",
    points: 5, block: "risiko", tema: ["NIST CSF", "NSM grunnprinsipper", "kategorier"],
    gjenganger: ["H2023-37", "H2024-32"],
    ordrett: true,
    oppgave: "<p>Figuren viser NIST og NSM sine rammeverk for cybersikkerhet som beskriver kategorier med sikkerhetstiltak/prinsipper i en logisk rekkefølge fra venstre mot høyre. Tilordne kategoriene til riktig felt i diagrammet for NIST og NSM sine rammeverk. Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, 5 for alle riktig, minimum 0.</p>",
    figur: {
      beskrivelse: "To horisontale trediagrammer under hverandre. Øverst overskriften «NIST Cyber Security Framework» med en vannrett grå linje og fem loddrette greiner ned til fem felt i rad (felt N1–N5, fra venstre). Feltene har fargede rammer: turkis, lilla, gul, rød, grønn. Under det overskriften «NSM Grunnprinsipper for IKT-sikkerhet» med tilsvarende linje og fire felt i rad (felt S1–S4, fra venstre). Over figuren ni dra-bokser.",
      tekst: ["NIST Cyber Security Framework", "NSM Grunnprinsipper for IKT-sikkerhet"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, 5 for alle riktig, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 5, alleRiktig: 5 },
      regelMerknad: "Ni felt à 0,5 gir 4,5; alle riktige gir 5 (0,5 i bonus, regel.alleRiktig).",
      tekst: null,
      bank: ["Identifisere og kartlegge", "Recover", "Identify", "Respond", "Håndtere og gjenopprette", "Detect", "Beskytte og opprettholde", "Protect", "Oppdage"],
      felt: [
        { etikett: "NIST felt 1 (lengst til venstre)", svar: 2, godta: [], explain: "<p>NIST starter med å forstå hva som skal beskyttes: <strong>Identify</strong>.</p>" },
        { etikett: "NIST felt 2", svar: 7, godta: [], explain: "<p>Så beskytte det: <strong>Protect</strong>.</p>" },
        { etikett: "NIST felt 3", svar: 5, godta: [], explain: "<p>Så oppdage angrep som kommer gjennom: <strong>Detect</strong>.</p>" },
        { etikett: "NIST felt 4", svar: 3, godta: [], explain: "<p>Så håndtere hendelsen: <strong>Respond</strong>.</p>" },
        { etikett: "NIST felt 5 (lengst til høyre)", svar: 1, godta: [], explain: "<p>Til slutt komme tilbake til normal drift: <strong>Recover</strong>.</p>" },
        { etikett: "NSM felt 1 (lengst til venstre)", svar: 0, godta: [], explain: "<p>NSM starter likt: <strong>Identifisere og kartlegge</strong>.</p>" },
        { etikett: "NSM felt 2", svar: 6, godta: [], explain: "<p>Så <strong>Beskytte og opprettholde</strong>.</p>" },
        { etikett: "NSM felt 3", svar: 8, godta: [], explain: "<p>Så <strong>Oppdage</strong>.</p>" },
        { etikett: "NSM felt 4 (lengst til høyre)", svar: 4, godta: [], explain: "<p>NSM slår sammen respons og gjenoppretting: <strong>Håndtere og gjenopprette</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["NIST (2021-versjon, fem funksjoner): Identify, Protect, Detect, Respond, Recover.", "NSM (fire kategorier): Identifisere og kartlegge, Beskytte og opprettholde, Oppdage, Håndtere og gjenopprette."],
    tips: ["NIST CSF 2.0 (på 2026-lysarkene) har en sjette funksjon, GOVERN, som omslutter de andre. Kan du få samme oppgave i dag, vil NIST-raden kunne ha seks felt.", "NSM har fire kategorier fordi respons og gjenoppretting er slått sammen."]
  });
  hv("H2021-8.2",
    "<p>Brannvern i en bygning: finn ut hva som kan brenne (identifiser), sett opp brannmurer og slukkere (beskytt), ha røykvarslere (oppdag), slukk brannen (håndter) og bygg opp igjen (gjenopprett).</p>",
    "<p>Begge rammeverkene ordner tiltak i samme logiske rekkefølge. NIST CSF har fem funksjoner: Identify, Protect, Detect, Respond, Recover. NSMs grunnprinsipper har fire kategorier: identifisere og kartlegge, beskytte og opprettholde, oppdage, og håndtere og gjenopprette (respons og gjenoppretting slått sammen).</p>",
    "<p>Rekkefølgen følger livsløpet til en hendelse: kjenn verdiene og risikoen, reduser sannsynligheten, oppdag det som likevel skjer, begrens skaden og gjenopprett. NSMs prinsipper (4 kategorier, 21 prinsipper) er inspirert av NIST CSF. NIST CSF 2.0 (2024) la til GOVERN (styring) som en overordnet sjette funksjon.</p>");

  O.push({
    key: "H2021-8.3", year: Y, oppgave_nr: "Oppgave 8.3", del: D8,
    ark: "8.3 Modenhetsnivåer", title: "CMMI-modenhetsnivå",
    points: 2, block: "risiko", tema: ["CMMI", "modenhet", "ledelsesforankring", "risikobasert styring"],
    ordrett: true,
    oppgave: "<p>CMMI (Capability Maturity Model Integration) definerer modenhetsnivåer for styring og ledelse av informasjonssikkerhet. Velg riktig nivå ut i fra beskrivelsen.<br>Poeng: 1 for hver korrekt, 0 for feil, maks 2, minimum 0.</p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng: 1 for hver korrekt, 0 for feil, maks 2, minimum 0.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 2 },
      tekst: "<p>Ledelsesforankring forventes fra modenhetsnivå {0}.</p><p>Risikobasert styring og ledelse forventes fra modenhetsnivå {1}.</p>",
      felt: [
        { etikett: "Ledelsesforankring", valg: ["5: Optimalisert", "4: Systematisert", "3: Formalisert", "2: Fragmentert", "1: Tilfeldig", "0: Fraværende"], svar: 2, godta: [], explain: "<p>Når sikkerhetsarbeidet er formalisert med policyer, er det også forankret i ledelsen: <strong>3: Formalisert</strong>.</p>" },
        { etikett: "Risikobasert styring", valg: ["5: Optimalisert", "4: Systematisert", "3: Formalisert", "2: Fragmentert", "1: Tilfeldig", "0: Fraværende"], svar: 1, godta: [], explain: "<p>Helhetlig, risikobasert styring er neste trinn: <strong>4: Systematisert</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["0 kaos, 1 tilfeldige tiltak, 2 noen risikovurderinger, 3 ledelsesforankring og policyer, 4 helhetlig risikostyring, 5 målbart og stadig forbedret."],
    tips: ["2026-lysarket bruker andre nivånavn (1 Initiell, 2 Ledet, 3 Definert, 4 Kvantifisert, 5 Optimaliserende), men samme innhold: ledelsesforankring på 3 og helhetlig risikostyring på 4."]
  });
  hv("H2021-8.3",
    "<p>Tenk på en trapp: nederst er det bare brannslukking. Litt høyere gjør man noen ting tilfeldig. På trinn 3 har sjefen bestemt at dette er viktig og skrevet regler. På trinn 4 styres alt ut fra hvor stor risikoen er. På toppen måles og forbedres det hele tiden.</p>",
    "<p>CMMI beskriver modenhet i trinn fra 0 til 5. Ledelsesforankring og policyer kommer på nivå 3 (Formalisert). Helhetlig risikobasert styring kommer på nivå 4 (Systematisert).</p>",
    "<p>Modenhetsnivåene beskriver hvor systematisk og forutsigbar styringen av sikkerhet er. Nivå 3 kjennetegnes av definerte prosesser og policyer forankret i ledelsen. Nivå 4 legger til at tiltak prioriteres ut fra risikovurderinger for hele virksomheten. Nivå 5 legger til måling og kontinuerlig forbedring. Navnene på nivåene varierer mellom kilder.</p>");

  /* ==================== DEL 9: INNEBYGD INFORMASJONSSIKKERHET ==================== */

  O.push({
    key: "H2021-9.1", year: Y, oppgave_nr: "Oppgave 9.1", del: D9,
    ark: "9.1 Syklus for innebygd informasjonssikkehet", title: "De 7 fasene i innebygd sikkerhet",
    points: 4, block: "utvikling", tema: ["innebygd sikkerhet", "SDL", "utviklingssyklus"],
    gjenganger: ["H2022-4.1"],
    ordrett: true,
    oppgave: "<p>Figuren viser 7 faser i syklus for innebygd informasjonssikkerhet. Tilordne fasene til riktig felt i figuren. Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, 4 for alle riktig, minimum 0.</p>",
    figur: {
      beskrivelse: "Overskrift «Syklus for innebygd informasjonssikkerhet». Sju pilformede (chevron) felt i rad fra venstre mot høyre, med fargene rød, blå, oliven, mørkeblå, grønn, grågrønn og rosa. Over hvert felt et nummer i sirkel: 1 til 7. I hvert felt et dra-felt. Over figuren sju dra-bokser.",
      tekst: ["Syklus for innebygd informasjonssikkerhet", "1", "2", "3", "4", "5", "6", "7"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, 4 for alle riktig, minimum 0.",
      regel: { riktig: 0.5, feil: 0, blankt: 0, min: 0, maks: 4, alleRiktig: 4, sekvens: 0.5 },
      regelMerknad: "Under oppgaven står «Justert skåring»: poeng = 0,5 × lengden av den lengste sekvensen med trinn i riktig rekkefølge (5 trinn gir 2,5), feil trinn imellom teller ikke negativt, og det gis ikke minuspoeng. Alle sju riktige gir 4 (0,5 i bonus). Øvingen retter slik (regel.sekvens og regel.alleRiktig).<br><br>" + JUSTERT.replace(/\n/g, "<br>"),
      tekst: null,
      bank: ["Test", "Koding", "Krav", "Produksjonssetting", "Design", "Opplæring", "Forvaltning"],
      felt: [
        { etikett: "Fase 1", svar: 5, godta: [], explain: "<p>Først må utviklerne kunne sikkerhet: <strong>Opplæring</strong>.</p>" },
        { etikett: "Fase 2", svar: 2, godta: [], explain: "<p>Sikkerhetskrav fastsettes tidlig: <strong>Krav</strong>.</p>" },
        { etikett: "Fase 3", svar: 4, godta: [], explain: "<p>Kravene blir til en sikker arkitektur (her hører trusselmodellering hjemme): <strong>Design</strong>.</p>" },
        { etikett: "Fase 4", svar: 1, godta: [], explain: "<p>Designet implementeres med sikre kodevaner: <strong>Koding</strong>.</p>" },
        { etikett: "Fase 5", svar: 0, godta: [], explain: "<p>Koden testes for sårbarheter: <strong>Test</strong>.</p>" },
        { etikett: "Fase 6", svar: 3, godta: [], explain: "<p>Systemet settes i drift: <strong>Produksjonssetting</strong>.</p>" },
        { etikett: "Fase 7", svar: 6, godta: [], explain: "<p>Etter lansering må sårbarheter rettes og hendelser håndteres: <strong>Forvaltning</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Opplæring → Krav → Design → Koding → Test → Produksjonssetting → Forvaltning."],
    tips: ["Opplæring kommer først – før selve utviklingen.", "Temaet er ikke på 2026-lysarkene, men kan komme fra boka.", "Arket skriver «informasjonssikkehet» i tittelen."]
  });
  hv("H2021-9.1",
    "<p>Å bygge et trygt hus: først lærer snekkerne om brannsikkerhet, så skriver man hva huset må tåle, tegner det, bygger det, tester det, flytter inn, og vedlikeholder det.</p>",
    "<p>Syklusen følger vanlig programvareutvikling, men med sikkerhet i hver fase: opplæring, krav, design, koding, test, produksjonssetting og forvaltning. Poengene gis etter hvor lang sekvens du har i riktig rekkefølge.</p>",
    "<p>Innebygd sikkerhet (inspirert av Microsofts SDL) flytter sikkerhetsarbeidet tidlig i livsløpet, fordi feil er billigere å rette jo tidligere de oppdages.</p><ul><li>Opplæring er en forutsetning.</li><li>Krav og design (med trusselmodellering, f.eks. STRIDE) styrer hva som skal bygges.</li><li>Koding og test (statisk/dynamisk analyse, pentest) fanger feil.</li><li>Produksjonssetting og forvaltning dekker sikker konfigurasjon, sårbarhetshåndtering og hendelsesrespons.</li></ul>");

  O.push({
    key: "H2021-9.2", year: Y, oppgave_nr: "Oppgave 9.2", del: D9,
    ark: "9.2 STRIDE", title: "STRIDE: hvilken egenskap brytes?",
    points: 3, block: "utvikling", tema: ["STRIDE", "trusselmodellering"],
    gjenganger: ["H2022-4.2", "H2025-31"],
    ordrett: true,
    oppgave: "<p>STRIDE er en modell utviklet av Microsoft for trusselmodellering som er ment å bruke under programvareutvikling. Hver bokstav i STRIDE er forbokstaven for en type trussel. Velg hva hver type trussel betyr (der noen betydninger er irrelevante).<br>Poeng: 0,5 for hver korrekt, -0,5  for feil, maks 3, minimum 0.</p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0,5  for feil, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      tekst: "<p>Spoofing (identitetstyveri) er brudd på {0}</p><p>Tampering (tukling/kompromittering) er brudd på {1}</p><p>Repudiation (avvising) er brudd på {2}</p><p>Information disclosure (datatyveri og lekkasje) er brudd på {3}</p><p>Denial of service (tjenestenekt) er brudd på {4}</p><p>Elevation of privilege (utvidet tilgang) er brudd på {5}</p>",
      felt: [
        { etikett: "Spoofing", valg: ["autentisitet", "autorisering", "integritet", "konfidensialitet", "sikkerhetskultur", "tilgangskontroll", "tilgjengelighet", "uavviselighet/sporbarhet/regnskapelighet"], svar: 0, godta: [], explain: "<p>Å utgi seg for å være en annen bryter <strong>autentisitet</strong>.</p>" },
        { etikett: "Tampering", valg: ["autentisitet", "autorisering", "integritet", "konfidensialitet", "sikkerhetskultur", "tilgangskontroll", "tilgjengelighet", "uavviselighet/sporbarhet/regnskapelighet"], svar: 2, godta: [], explain: "<p>Å endre data eller kode uten lov bryter <strong>integritet</strong>.</p>" },
        { etikett: "Repudiation", valg: ["autentisitet", "autorisering", "intgritet", "konfidensialitet", "sikkerhetskultur", "tilgangskontroll", "tilgjengelighet", "uavviselighet/sporbarhet/regnskapelighet"], svar: 7, godta: [], explain: "<p>Å kunne nekte for en handling bryter <strong>uavviselighet/sporbarhet/regnskapelighet</strong> (kurset sier også ubenektelighet).</p>" },
        { etikett: "Information disclosure", valg: ["autentisitet", "autorisering", "integritet", "konfidensialitet", "sikkerhetskultur", "tilgangskontroll", "tilgjengelighet", "uavviselighet/sporbarhet/regnskapelighet"], svar: 3, godta: [], explain: "<p>Lekkasje av data bryter <strong>konfidensialitet</strong>.</p>" },
        { etikett: "Denial of service", valg: ["autentisitet", "autorisering", "integritet", "konfidensialitet", "sikkerhetskultur", "tilgangskontroll", "tilgjengelighet", "uavviselighet/sporbarhet/regnskapelighet"], svar: 6, godta: [], explain: "<p>Tjenestenekt bryter <strong>tilgjengelighet</strong>.</p>" },
        { etikett: "Elevation of privilege", valg: ["autentisitet", "autorisering", "integritet", "konfidensialitet", "sikkerhetskultur", "tilgangskontroll", "tilgjengelighet", "uavviselighet/sporbarhet/regnskapelighet"], svar: 5, godta: [], explain: "<p>Å skaffe seg rettigheter man ikke har fått, betyr at <strong>tilgangskontrollen</strong> (håndhevingen av policyen) er omgått. Autorisering – å spesifisere policyen – er ikke brutt.</p>" }
      ]
    },
    avvik: null,
    losning: ["S → autentisitet, T → integritet, R → uavviselighet, I → konfidensialitet, D → tilgjengelighet, E → tilgangskontroll."],
    tips: ["E er fella: velg tilgangskontroll, ikke autorisering. Policyen er riktig spesifisert; det er håndhevingen som svikter.", "Distraktorene «sikkerhetskultur» og «autorisering» er aldri riktige her.", "Repudiation-lista i arket skriver «intgritet»."]
  });
  hv("H2021-9.2",
    "<p>Seks måter å lure et system på: late som du er en annen, endre noe, nekte for det du gjorde, lese det du ikke skal, ødelegge for alle andre, og snike deg til mer makt enn du har fått.</p>",
    "<p>Hver STRIDE-trussel bryter én egenskap: Spoofing – autentisitet, Tampering – integritet, Repudiation – uavviselighet (ubenektelighet), Information disclosure – konfidensialitet, Denial of service – tilgjengelighet, Elevation of privilege – tilgangskontroll.</p>",
    "<p>STRIDE brukes i designfasen: for hvert element i et dataflytdiagram spør man hvilke av de seks truslene som gjelder, og hvilke tiltak som ivaretar den tilhørende egenskapen (autentisering, integritetsbeskyttelse, logging/signatur, kryptering, kapasitet og redundans, og streng tilgangskontroll). Fasiten bruker tilgangskontroll for E i tråd med kursets skille: autorisering er å spesifisere rettigheter, tilgangskontroll er å håndheve dem.</p>");

  O.push({
    key: "H2021-9.3", year: Y, oppgave_nr: "Oppgave 9.3", del: D9,
    ark: "9.3 Sikker programvareutvikling", title: "Sikker smidig vs. DevOps",
    points: 3, block: "utvikling", tema: ["sikker smidig", "DevOps", "DevSecOps", "shift left"],
    ordrett: true,
    oppgave: "<p>Sikker Smidig og DevOps er to modeller for sikker programvareutvikling.</p><p>For hver karakteristikk, angi tilhørende modell (eventuelt begge eller ingen). Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.</p><p><strong>Finn de som passer sammen:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver korrekt, -0.5 for for hver feil, 0 for intet valg, maks 3, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Sikker smidig", "DevOps", "Begge", "Ingen"],
      multi: false,
      rader: [
        { s: "Dekker opplæring i informasjonssikkerhet", svar: [3], explain: "<p>Ifølge fasiten dekker ingen av modellene opplæring (det gjør derimot syklusen for innebygd sikkerhet i 9.1): <strong>Ingen</strong>.</p>" },
        { s: "Dekker forvaltning", svar: [1], explain: "<p>DevOps slår sammen utvikling (Dev) og drift (Ops), og dekker dermed forvaltning: <strong>DevOps</strong>.</p>" },
        { s: "Fokuserer på \"shift left\"", svar: [1], explain: "<p>«Shift left» – å flytte sikkerhetstesting tidlig og automatisere den i byggløpet – er et kjennetegn ved (Sec)DevOps: <strong>DevOps</strong>.</p>" },
        { s: "Må være skybasert", svar: [1], explain: "<p>Fasiten sier <strong>DevOps</strong>. Det er tvilsomt: DevOps er tett knyttet til sky og kontinuerlig leveranse, men ikke et absolutt krav. Se avvik.</p>" },
        { s: "Fokuserer på sikkerhet", svar: [2], explain: "<p>Oppgaven presenterer begge som modeller for <em>sikker</em> utvikling: <strong>Begge</strong>.</p>" },
        { s: "Har sprintsyklus som sentralt begrep", svar: [0], explain: "<p>Smidig utvikling er organisert i sprinter: <strong>Sikker smidig</strong>.</p>" }
      ]
    },
    avvik: "Fasiten merker «Må være skybasert» for DevOps. Det er tvilsomt fordi DevOps er en arbeidsform (utvikling og drift sammen, automatisert leveranse) som også kan brukes uten sky (jf. vranglære D20).",
    losning: ["Sikker smidig: sprinter.", "DevOps: drift/forvaltning, shift left, (ifølge fasit) sky.", "Begge: sikkerhet. Ingen: opplæring."],
    tips: ["Temaet er ikke på 2026-lysarkene.", "Lær fasitens svar på «skybasert», men vær klar over at det kan diskuteres."]
  });
  hv("H2021-9.3",
    "<p>Sikker smidig er å bygge i korte runder (sprinter) og tenke sikkerhet i hver runde. DevOps er at de som bygger og de som drifter jobber som ett lag, så sikkerheten følger med helt til programmet er i bruk.</p>",
    "<ul><li>Sikker smidig bygger sikkerhet inn i smidig utvikling med sprintsykluser.</li><li>DevOps forener utvikling og drift og dekker dermed også forvaltning; sikkerheten flyttes tidlig og automatiseres («shift left»).</li></ul><p>Begge fokuserer på sikkerhet. Ifølge fasiten dekker ingen opplæring, og DevOps må være skybasert.</p>",
    "<p>I sikker smidig legges sikkerhetsaktiviteter (krav, trusselmodellering, gjennomgang) inn i hver sprint. DevSecOps automatiserer sikkerhetssjekker i CI/CD-løpet (statisk analyse, avhengighetsskanning) og fortsetter i drift med overvåking og retting. Kravet om sky i fasiten bør leses som at DevOps typisk bygger på skyplattformer og infrastruktur som kode.</p>");

  /* ============================ DEL 10: CYBEROPERASJONER ============================ */

  O.push({
    key: "H2021-10.1", year: Y, oppgave_nr: "Oppgave 10.1", del: D10,
    ark: "10.1 Cyber Kill Chain", title: "Cyber Kill Chain: 7 trinn",
    points: 4, block: "cyberops", tema: ["Cyber Kill Chain", "Lockheed Martin"],
    gjenganger: ["H2023-12"],
    ordrett: true,
    oppgave: "<p>Figuren viser 7 trinn i Cyber Kill Chain. Tilordne trinn til riktig felt i figuren. Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, 4 for alle riktig, minimum 0.</p>",
    figur: {
      beskrivelse: "Overskrift «Cyber Kill Chain». En stor oransje-gul pil som går skrått nedover fra øvre venstre til nedre høyre hjørne. Langs pila står sju dra-felt i trapp nedover mot høyre, hvert med et nummer i sirkel over seg: 1 til 7. Over figuren sju dra-bokser.",
      tekst: ["Cyber Kill Chain", "1", "2", "3", "4", "5", "6", "7"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 for hver korrekt tilordning, -0,5 for hver feil tilordning, 4 for alle riktig, minimum 0.",
      regel: { riktig: 0.5, feil: 0, blankt: 0, min: 0, maks: 4, alleRiktig: 4, sekvens: 0.5 },
      regelMerknad: "Under oppgaven står «Justert skåring»: poeng = 0,5 × lengden av den lengste sekvensen med trinn i riktig rekkefølge, feil trinn imellom teller ikke negativt, og det gis ikke minuspoeng. Alle sju riktige gir 4 (0,5 i bonus). Øvingen retter slik (regel.sekvens og regel.alleRiktig).<br><br>" + JUSTERT.replace(/\n/g, "<br>"),
      tekst: null,
      bank: ["Overlevering", "Kommando og kontroll", "Rekognosering", "Aksjon", "Bevæpning", "Installering", "Utførelse av exploit"],
      felt: [
        { etikett: "Trinn 1", svar: 2, godta: [], explain: "<p>Angriperen kartlegger målet: <strong>Rekognosering</strong>.</p>" },
        { etikett: "Trinn 2", svar: 4, godta: [], explain: "<p>Angriperen lager angrepsverktøyet, f.eks. et dokument med skadelig kode: <strong>Bevæpning</strong>.</p>" },
        { etikett: "Trinn 3", svar: 0, godta: [], explain: "<p>Våpenet leveres til målet, f.eks. via e-post: <strong>Overlevering</strong>.</p>" },
        { etikett: "Trinn 4", svar: 6, godta: [], explain: "<p>Sårbarheten utnyttes og koden kjører: <strong>Utførelse av exploit</strong>.</p>" },
        { etikett: "Trinn 5", svar: 5, godta: [], explain: "<p>Skadevare legges inn for å bli værende: <strong>Installering</strong>.</p>" },
        { etikett: "Trinn 6", svar: 1, godta: [], explain: "<p>Skadevaren kontakter angriperen for å få ordre: <strong>Kommando og kontroll</strong>.</p>" },
        { etikett: "Trinn 7", svar: 3, godta: [], explain: "<p>Angriperen gjør det hen kom for, f.eks. stjeler data: <strong>Aksjon</strong> (måloppnåelse).</p>" }
      ]
    },
    avvik: null,
    losning: ["Rekognosering → Bevæpning → Overlevering → Utførelse → Installering → Kommando og kontroll → Aksjon."],
    tips: ["Trinn 2 er bevæpning, ikke levering – vanlig felle.", "Lysarkene 2026 kaller trinn 7 «måloppnåelse»."]
  });
  hv("H2021-10.1",
    "<p>En innbruddstyv: speider på huset, lager et dirkesett, går til døra, dirker opp låsen, gjemmer en ekstra nøkkel, holder kontakt med kompisen ute, og tar til slutt med seg sølvtøyet.</p>",
    "<p>Cyber Kill Chain deler et målrettet angrep i sju trinn: rekognosering, bevæpning, overlevering, utførelse av exploit, installering, kommando og kontroll, og aksjon. Poeng gis etter hvor lang sekvens som står i riktig rekkefølge.</p>",
    "<p>Modellen fra Lockheed Martin brukes for å planlegge forsvar: for hvert trinn finnes tiltak for å oppdage og bryte kjeden. Bevæpning skjer hos angriperen før noe kontakt med målet, så de to første trinnene er vanskelige å se for forsvareren, mens overlevering og senere trinn gir spor (e-postfiltre, endepunktsdeteksjon, trafikk til C2-tjenere).</p>");

  O.push({
    key: "H2021-10.2", year: Y, oppgave_nr: "Oppgave 10.2", del: D10,
    ark: "10.2 APT", title: "«Kill» og APT: avansert og persistent",
    points: 4, block: "cyberops", tema: ["APT", "Cyber Kill Chain", "trusselaktør"],
    ordrett: true,
    oppgave: "<p>Velg riktig utsagn i hver setning,<br>Poeng: 1 for riktig, -1 for feil, maks 4, minimum 0.</p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng: 1 for riktig, -1 for feil, maks 4, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
      tekst: "<p>\"Kill\" i Cyber Kill Chain betyr at {0}.</p><p>En APT (Advanced Persistent Threat) er en {1}.</p><p>En APT er \"avansert\" fordi {2}.</p><p>En APT er \"persistent\" fordi {3}</p>",
      felt: [
        { etikett: "«Kill» betyr at", valg: ["Angriperen kan drepe/skade (kille) offeret på denne måten", "Forsvarerne kan potensielt stoppe (kille) angrepet på hvert trinn"], svar: 1, godta: [], explain: "<p>Navnet kommer fra forsvarssiden: bryter man ett ledd, stopper hele angrepet. Riktig: <strong>Forsvarerne kan potensielt stoppe (kille) angrepet på hvert trinn</strong>.</p>" },
        { etikett: "En APT er en", valg: ["trusselflate som er avansert", "gruppering med en aktivitetsprofil for cyberangrep"], svar: 1, godta: [], explain: "<p>En APT er en aktør – en gruppe med kjennetegn ved hvordan den angriper: <strong>gruppering med en aktivitetsprofil for cyberangrep</strong>. Trusselflate er noe ved målet, ikke ved angriperen.</p>" },
        { etikett: "«Avansert» fordi", valg: ["rikelige ressurser for angrep er tilgjengelige", "kun avanserte teknikker brukes"], svar: 0, godta: [], explain: "<p>Avansert handler om ressursene (penger, folk, nulldagssårbarheter), ikke at bare avanserte teknikker brukes – APT-er bruker gjerne enkel phishing når det virker. Riktig: <strong>rikelige ressurser for angrep er tilgjengelige</strong>.</p>" },
        { etikett: "«Persistent» fordi", valg: ["trusselaktøren har tålmodighet", "trusselflaten er vanskelig å minske"], svar: 0, godta: [], explain: "<p>Persistent betyr at aktøren holder på lenge og prøver igjen: <strong>trusselaktøren har tålmodighet</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Kill = forsvarerne kan bryte kjeden.", "APT = gruppering/aktør.", "Avansert = mye ressurser. Persistent = tålmodig."],
    tips: ["Svarene i APT-spørsmålene handler alltid om aktøren, aldri om trusselflaten.", "Med −1 for feil bør du ikke gjette blindt."]
  });
  hv("H2021-10.2",
    "<p>«Kill chain» betyr at hvis du bryter én lenke i en kjede, faller den fra hverandre. En APT er som en tålmodig og rik innbruddsbande som kan holde på i måneder.</p>",
    "<p>«Kill» i Cyber Kill Chain viser til at forsvareren kan stoppe angrepet på hvert trinn. En APT er en gruppering med en kjent angrepsprofil. Den er avansert fordi den har rikelig med ressurser, og persistent fordi den er tålmodig og holder ut over lang tid.</p>",
    "<p>APT-er er ofte statlige eller statsstøttede aktører. Ressursene gir tilgang til egne verktøy og nulldagssårbarheter, men de velger likevel den enkleste metoden som virker. Persistensen viser seg både i lange kampanjer og i at de etablerer varig tilstedeværelse i målnettet. Trusseletterretning (CTI) beskriver dem med TTP-er (taktikker, teknikker og prosedyrer).</p>");

  O.push({
    key: "H2021-10.3", year: Y, oppgave_nr: "Oppgave 10.3", del: D10,
    ark: "10.3 MITRE ATT&CK", title: "MITRE ATT&CK: teknikk og taktikk",
    points: 2, block: "cyberops", tema: ["MITRE ATT&CK", "taktikk", "teknikk", "TTP"],
    ordrett: true,
    oppgave: "<p>MITRE ATT&amp;CK beskriver såkalte teknikker og taktikker. Velg riktig utsagn i hver setning relatert til MITRE ATT&amp;CK.<br>Poeng: 1 for riktig, -1 for feil, maks 2, minimum 0.</p>",
    inspera: {
      type: "N",
      regelTekst: "Poeng: 1 for riktig, -1 for feil, maks 2, minimum 0.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
      tekst: "<p>En \"teknikk\" beskriver {0}.</p><p>En taktikk beskriver {1}.</p>",
      felt: [
        { etikett: "Teknikk", valg: ["hvordan en angriper oppnår et (del)mål", "hvordan en trussel kan forhindres"], svar: 0, godta: [], explain: "<p>En teknikk er <em>hvordan</em>: <strong>hvordan en angriper oppnår et (del)mål</strong>. ATT&amp;CK beskriver angriperen, ikke forsvaret.</p>" },
        { etikett: "Taktikk", valg: ["et sett med teknikker som kombineres for å stoppe en trussel", "et (del)mål for angriperen"], svar: 1, godta: [], explain: "<p>En taktikk er <em>hva</em> angriperen vil oppnå: <strong>et (del)mål for angriperen</strong>, f.eks. «initial tilgang» eller «eksfiltrering».</p>" }
      ]
    },
    avvik: null,
    losning: ["Taktikk = hva (delmålet). Teknikk = hvordan (måten delmålet nås)."],
    tips: ["Begge distraktorene handler om forsvar («forhindres», «stoppe»); ATT&CK beskriver angriperens atferd.", "ATT&CK hører til taktisk/operasjonell CTI (TTP), ikke teknisk."]
  });
  hv("H2021-10.3",
    "<p>Taktikken er målet: «komme inn i huset». Teknikken er måten: «dirke opp bakdøra» eller «klatre inn vinduet».</p>",
    "<p>MITRE ATT&amp;CK er en kunnskapsbase over angriperatferd. Taktikker er angriperens delmål (kolonnene i matrisen), og teknikker er måtene å nå hvert delmål på (cellene under hver kolonne).</p>",
    "<p>ATT&amp;CK organiserer observert atferd hos ekte aktører som TTP-er:</p><ul><li>taktikker (hvorfor/hva – delmål som rekognosering, initial tilgang, persistens, eksfiltrering),</li><li>teknikker (hvordan) og</li><li>prosedyrer (konkrete gjennomføringer).</li></ul><p>Forsvarere bruker den til å kartlegge hvilke teknikker de kan oppdage, men selve modellen beskriver angriperens handlinger, ikke tiltakene.</p>");

  /* ============================ SETT SAMMEN ============================ */

  BANK["H2021"] = {
    year: "H2021", dato: "03.12.2021", varighet: "4 timer", hjelpemidler: "Ingen",
    forside: "<p><strong>Avsluttende eksam i IN2120 Informasjonssikkerhet (Høst 2021).</strong></p><p><strong>Dato og tidspunkt: 3. desember 2021, kl.9:00 - 13:00 (4 timer).</strong></p><p><strong>Ingen hjelpemidler er tillatt.</strong></p><p>Merk følgende:</p><ul><li>Oppgavene i denne eksamen er gruppert under 10 deler som tilsvarer omtrent 10 av forelesningene i dette emnet.</li><li>Det er mulig å oppnå 10 poeng for hver del, totalt 100 poeng (= 100%).</li><li>Man kan navigere frem og tilbake mellom oppgavene.</li><li>Skåring for hver oppgave angis eksplisitt. Det kan gis negative poeng for feil svar/valg, men total poengsum for hele oppgaven er minimum 0 (selv om summen over alle svarene er negativ).</li><li>Vær kortfattet når du skriver tekst som svar på en tekstoppgave. Svaret kan skrives på norsk eller engelsk.</li><li>I navigasjonslinjen nederst på skjermen indikeres fullførte oppgaver med blå søyler.</li></ul><p><strong>Lykke til!</strong></p>",
    deler: [
      { navn: D1, poeng: 10 }, { navn: D2, poeng: 10 }, { navn: D3, poeng: 10 }, { navn: D4, poeng: 10 },
      { navn: D5, poeng: 10 }, { navn: D6, poeng: 10 }, { navn: D7, poeng: 10 }, { navn: D8, poeng: 10 },
      { navn: D9, poeng: 10 }, { navn: D10, poeng: 10 }
    ],
    merknad: "Bilde-PDF (29 sider) lest visuelt. 38 oppgaver, 10 deler à 10 poeng, sum «Maks poeng» = 100. Inspera-løpenummer 1–38 tilsvarer arkets nummer 1.1–10.3 i samme rekkefølge.",
    oppgaver: O
  };
})();
