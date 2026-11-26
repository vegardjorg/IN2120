/* IN2120 · eksamensbank H2019. Kilde: UiO, IN2120 eksamen H2019 (eksamen/in2120-2019-x-qa.pdf, Inspera-utskrift
   med rettenøkkel: grønne haker, grønne tall i parentes og grønne modellsvar i svarfeltene; behandlet som
   sensorveiledning etter eierens beslutning). 28 sider, tekstlag + visuell kontroll av hakene.
   Settet er på engelsk: oppgavetekst, alternativer og fasit står ordrett på engelsk.
   Våre forklaringer (explain/losning/tips/hvorfor/svar) med egne ord, på norsk. */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BANK = (window.IN_EXAM_BANK = window.IN_EXAM_BANK || {});
  IN.PERFEKT = IN.PERFEKT || {};

  var Y = "H2019";
  var D1 = "Part 1: General Security",
    D2 = "Part 2: Cryptography",
    D3 = "Part 3: Key Management",
    D4 = "Part 4: Network Security",
    D5 = "Part 5: Incident Response",
    D6 = "Part 6: Risk Management",
    D7 = "Part 7: User Authentication",
    D8 = "Part 8: Identity & Access Management",
    D9 = "Part 9: Ethical Hacking",
    D10 = "Part 10: Application Security";

  var UTE = "Utenfor pensum H2026: ";
  var FORSIDE_MIN = "Poenglinja sier ikke noe om maks/minimum; forsidens hovedregel (summen for hele oppgaven er minst 0) og arkets «Maximum marks» er lagt til grunn.";

  function rg(riktig, feil, maks) { return { riktig: riktig, feil: feil, blankt: 0, min: 0, maks: maks }; }
  function hv(key, eli5, normal, teknisk) {
    IN.PERFEKT[key] = IN.PERFEKT[key] || { type: "eksamen" };
    IN.PERFEKT[key].hvorfor = { eli5: eli5, normal: normal, teknisk: teknisk };
  }

  var O = [];

  /* ============================ PART 1: GENERAL SECURITY ============================ */

  O.push({
    key: "H2019-1.1", year: Y, oppgave_nr: "Oppgave 1.1", del: D1,
    ark: "1.1 Information Security", title: "KIT etter ISO 27000 pluss én egenskap",
    points: 2, block: "generelt", tema: ["KIT", "ISO 27000", "autentisitet", "ubenektelighet"],
    ordrett: true,
    oppgave: "<p>Write the names (not the abbreviations) of the three (3) properties of <strong>information security</strong> according to the standard ISO 27000. Name one (1) additional property of information security (also according to the standard).</p><p><em>Points: max 2 total score</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 2 total score",
      regel: { min: 0, maks: 2 },
      regelMerknad: "Manuell retting. Arket oppgir ingen poengfordeling; trolig om lag 1,5 for de tre egenskapene og 0,5 for den ekstra (vår antakelse).",
      deler: [{ del: "", poeng: 2, grense: "fire ord" }]
    },
    avvik: "Fasiten nevner «privacy» som ekstra egenskap. ISO 27000 nevner i sin definisjon autentisitet, ansvarlighet (accountability), ubenektelighet og pålitelighet (reliability), ikke personvern. Svar heller med en av disse fire.",
    losning: ["Konfidensialitet, integritet, tilgjengelighet (skriv navnene, ikke «KIT»/«CIA»).", "Én ekstra egenskap fra standarden: f.eks. autentisitet eller ubenektelighet."],
    tips: ["Oppgaven sier «not the abbreviations»: skriv ordene fullt ut.", "Tryggeste ekstra egenskap er autentisitet eller ubenektelighet (non-repudiation)."]
  });
  IN.PERFEKT["H2019-1.1"] = {
    type: "eksamen",
    svar: [{ del: "", tekst: "<p>Confidentiality (konfidensialitet), integrity (integritet) og availability (tilgjengelighet). Ekstra egenskap: authenticity (autentisitet), alternativt non-repudiation (ubenektelighet).</p>",
      poeng: ["Konfidensialitet, integritet og tilgjengelighet skrevet fullt ut (1,5p)", "Én ekstra egenskap fra standarden, f.eks. autentisitet eller ubenektelighet (0,5p)"] }],
    sensor: {
      deler: [{ del: "", fasit: "<p>- Confidentiality, Integrity, Availability<br>- privacy, non-repudiation, authentication, or ...</p>", kriterier: "<p>Points: max 2 total score</p>" }],
      merknad: "Modellsvaret står grønt i svarfeltet. Poengfordelingen i svarfeltet over (1,5 + 0,5) er vår antakelse; arket sier bare «max 2». «privacy» og «authentication» er fasitens ord; standarden bruker «authenticity»."
    }
  };
  hv("H2019-1.1",
    "<p>En dagbok er trygg når bare du kan lese den, når ingen har skrevet i den, og når den ligger der du trenger den. I tillegg vil du vite at det faktisk er din dagbok.</p>",
    "<p>ISO 27000 definerer informasjonssikkerhet som å bevare konfidensialitet, integritet og tilgjengelighet. Standarden sier at også andre egenskaper kan inngå, for eksempel autentisitet, ansvarlighet, ubenektelighet og pålitelighet. Én av disse holder som ekstra egenskap.</p>",
    "<p>KIT er de tre kjernemålene. Autentisitet (at en entitet eller avsender er den den utgir seg for) og ubenektelighet (at avsenderen ikke kan nekte for en handling i ettertid) bygger på integritet og knyttes til identitet. Merk at oppgaven ber om navnene, ikke forkortelser.</p>");

  O.push({
    key: "H2019-1.2", year: Y, oppgave_nr: "Oppgave 1.2", del: D1,
    ark: "1.2 Confidentiality", title: "Definisjon av konfidensialitet og et tiltak",
    points: 2, block: "generelt", tema: ["konfidensialitet", "ISO 27000", "kryptering", "tilgangskontroll"],
    ordrett: true,
    oppgave: "<p>Write the definition (approximately) of <strong>confidentiality</strong> according to ISO 27000 and give an example for a typical security control to ensure this property.</p><p><em>Points: max 2</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 2",
      regel: { min: 0, maks: 2 },
      regelMerknad: "Manuell retting. Trolig 1 for definisjonen og 1 for tiltaket (vår antakelse).",
      deler: [{ del: "", poeng: 2, grense: "to setninger" }]
    },
    avvik: "Modellsvaret i arket har bare definisjonen og mangler eksempelet på et tiltak som oppgaven også ber om. Ta med et tiltak, f.eks. kryptering eller tilgangskontroll.",
    losning: ["Definisjon: informasjon gjøres ikke tilgjengelig for eller avsløres til uautoriserte personer, entiteter eller prosesser.", "Tiltak: kryptering (av lagrede eller overførte data) eller tilgangskontroll."],
    tips: ["Bruk ordet «uautorisert»: det er kjernen i definisjonen.", "Ett konkret tiltak holder; ikke list opp mange."]
  });
  IN.PERFEKT["H2019-1.2"] = {
    type: "eksamen",
    svar: [{ del: "", tekst: "<p>Konfidensialitet: informasjon gjøres ikke tilgjengelig for, og avsløres ikke til, uautoriserte individer, entiteter eller prosesser. Typisk tiltak: kryptering av data (f.eks. TLS for data som overføres), eller tilgangskontroll på filer og databaser.</p>",
      poeng: ["Definisjon: ikke avslørt for uautoriserte (1p)", "Et relevant tiltak, f.eks. kryptering eller tilgangskontroll (1p)"] }],
    sensor: {
      deler: [{ del: "", fasit: "<p>Information is not disclosed to unauthorized entities.</p>", kriterier: "<p>Points: max 2</p>" }],
      merknad: "Arkets modellsvar har bare definisjonen; eksempelet på tiltak mangler. Fordelingen 1 + 1 er vår antakelse."
    }
  };
  hv("H2019-1.2",
    "<p>Et brev er konfidensielt når bare den det er skrevet til, kan lese det. En lukket konvolutt eller en hemmelig kode passer på det.</p>",
    "<p>Konfidensialitet betyr at informasjon ikke avsløres for noen som ikke har lov til å se den. Typiske tiltak er kryptering, som gjør data uleselige uten nøkkel, og tilgangskontroll, som hindrer uvedkommende i å åpne dataene.</p>",
    "<p>ISO 27000 formulerer det som at informasjon ikke gjøres tilgjengelig eller avsløres for uautoriserte individer, entiteter eller prosesser. Kryptering beskytter også når data havner hos feil part (stjålet disk, avlyttet trafikk), mens tilgangskontroll virker så lenge dataene er inne i systemet som håndhever policyen.</p>");

  O.push({
    key: "H2019-1.3", year: Y, oppgave_nr: "Oppgave 1.3", del: D1,
    ark: "1.3 Availability", title: "Trussel mot og tiltak for tilgjengelighet",
    points: 2, block: "generelt", tema: ["tilgjengelighet", "DDoS", "lastbalansering"],
    gjenganger: ["H2018-1.3"],
    ordrett: true,
    oppgave: "",
    inspera: {
      type: "F1",
      regelTekst: "Points: 1 for correct, 0 for wrong, 0 for no selection",
      regel: rg(1, 0, 2),
      regelMerknad: "To separate radioknapp-spørsmål med samme poenglinje; hvert spørsmål er én enhet.",
      sporsmal: [
        { tekst: "Which is the most relevant <strong>threat against availability</strong>?<br><em>Points: 1 for correct, 0 for wrong, 0 for no selection</em><br><strong>Select one alternative:</strong>",
          alternativer: ["Phishing email", "Zero-day exploit", "SQL injection", "DDoS attack", "Cryptanalysis"], svar: 3,
          explain: [
            "<p>Phishing er en angrepsvektor for å lure til seg passord eller få noen til å kjøre skadevare. Det rammer først og fremst konfidensialitet.</p>",
            "<p>En nulldagssårbarhet kan brukes til mye, men den er ikke spesielt knyttet til tilgjengelighet.</p>",
            "<p>SQL-injeksjon brukes typisk til å lese eller endre data i databasen (K og I).</p>",
            "<p>Riktig. Et DDoS-angrep oversvømmer tjenesten slik at legitime brukere ikke slipper til: et direkte angrep på tilgjengelighet.</p>",
            "<p>Kryptanalyse prøver å knekke kryptering, altså å bryte konfidensialitet.</p>"
          ] },
        { tekst: "What is the most relevant <strong>security control for ensuring availability</strong>?<br><em>Points: 1 for correct, 0 for wrong, 0 for no selection</em><br><strong>Select one alternative</strong>",
          alternativer: ["Load balancing", "Blockchain", "User authentication", "Awareness training", "Encryption"], svar: 0,
          explain: [
            "<p>Riktig. Lastbalansering fordeler trafikken på flere tjenere, så tjenesten tåler mer last og overlever at én tjener faller ut.</p>",
            "<p>Blokkjede gir en manipulasjonssikker logg (integritet), ikke tilgjengelighet.</p>",
            "<p>Brukerautentisering avgjør hvem som slipper inn; det beskytter K og I, men holder ikke tjenesten oppe.</p>",
            "<p>Opplæring reduserer menneskelige feil, men er ikke det mest direkte tiltaket for tilgjengelighet.</p>",
            "<p>Kryptering beskytter konfidensialitet. Den kan til og med gjøre data utilgjengelige hvis nøkkelen mistes.</p>"
          ] }
      ]
    },
    avvik: null,
    losning: ["Tilgjengelighet = tjenesten og dataene kan brukes når de trengs.", "Trussel: DDoS. Tiltak: lastbalansering (redundans)."],
    tips: ["DDoS som trussel mot tilgjengelighet er en gjenganger fra eldre sett.", "Spør deg: hvilket alternativ handler om å holde tjenesten oppe? Bare ett gjør det."]
  });
  hv("H2019-1.3",
    "<p>Hvis tusen falske kunder stiller seg i kø i butikken, kommer ikke de ekte kundene fram. Flere kasser åpne fordeler køen.</p>",
    "<p>DDoS sender så mye trafikk at tjenesten ikke rekker å svare ekte brukere. Lastbalansering fordeler forespørslene på flere tjenere og gir redundans, så tjenesten fortsatt svarer. De andre alternativene beskytter eller angriper konfidensialitet og integritet.</p>",
    "<p>Tilgjengelighet handler om kapasitet og redundans. Et DDoS-angrep bruker mange kilder (ofte et botnett) for å tømme båndbredde eller ressurser hos målet. Lastbalansering sprer lasten og fjerner enkeltpunkter for feil; mot store angrep kombineres den gjerne med filtrering hos leverandøren.</p>");

  O.push({
    key: "H2019-1.4", year: Y, oppgave_nr: "Oppgave 1.4", del: D1,
    ark: "1.4 Authentication", title: "Data- eller entitetsautentisering?",
    points: 2, block: "generelt", tema: ["dataautentisering", "entitetsautentisering", "digital signatur", "HMAC", "TLS"],
    ordrett: true,
    oppgave: "<p>Please mark in every row if it describes an example or application of <strong>data authentication</strong> or <strong>entity authentication</strong>.</p><p><em>Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection</em></p><p><strong>Please match the values:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection",
      regel: rg(0.5, -0.5, 2),
      regelMerknad: FORSIDE_MIN,
      kolonner: ["entity authentication", "data authentication"],
      multi: false,
      rader: [
        { s: "The integrity of a contract is protected by a digital signature.", svar: [1], explain: "<p>Signaturen beviser hvem dokumentet kommer fra og at det ikke er endret. Det er en melding/et dokument som autentiseres: <strong>dataautentisering</strong>.</p>" },
        { s: "TLS record protocol uses HMAC for protecting the payload.", svar: [1], explain: "<p>HMAC-en følger hver post med data og viser at innholdet kommer fra den andre parten og ikke er endret: <strong>dataautentisering</strong>.</p>" },
        { s: "User logs in using username and password.", svar: [0], explain: "<p>Her bevises hvem brukeren er, i sanntid: <strong>entitetsautentisering</strong>.</p>" },
        { s: "TLS server authenticates using a certificate.", svar: [0], explain: "<p>Tjeneren beviser identiteten sin (at den har privatnøkkelen til sertifikatet) under handtrykket: <strong>entitetsautentisering</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Entitetsautentisering: hvem er det jeg snakker med nå (bruker, tjener)?", "Dataautentisering: hvor kommer denne meldingen/dataen fra, og er den uendret (signatur, MAC)?"],
    tips: ["Signatur og MAC/HMAC er alltid dataautentisering. Innlogging og sertifikatbasert tjenerautentisering er entitetsautentisering."]
  });
  hv("H2019-1.4",
    "<p>Å se legitimasjonen til personen foran deg er å sjekke hvem det er (entitet). Å sjekke at et brev har riktig segl og ikke er åpnet, er å sjekke selve brevet (data).</p>",
    "<p>Entitetsautentisering bekrefter identiteten til en part som deltar i kommunikasjonen nå, for eksempel en bruker som logger inn eller en tjener i TLS-handtrykket. Dataautentisering bekrefter opphavet og integriteten til en melding, for eksempel med digital signatur eller HMAC.</p>",
    "<p>Dataautentisering kan sjekkes i ettertid (en signert kontrakt kan verifiseres om ti år), mens entitetsautentisering er knyttet til et tidspunkt og en sesjon. I TLS gir handtrykket entitetsautentisering av tjeneren via sertifikatet, og Record-protokollen gir dataautentisering av hver post med MAC (eller AEAD i nyere versjoner).</p>");

  O.push({
    key: "H2019-1.5", year: Y, oppgave_nr: "Oppgave 1.5", del: D1,
    ark: "1.5 GDPR", title: "GDPR: sant eller usant",
    points: 2, block: "lov", tema: ["GDPR", "personvern", "innsynsrett"],
    ordrett: true,
    oppgave: "<p>Mark the statements that are true for the EU <strong>GDPR regulation</strong>.</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total",
      regel: rg(1, -1, 2),
      alternativer: [
        "The GDPR applies only to EU citizens.",
        "The GDPR gives users the right to request all information about them stored by a company/organization.",
        "The GDPR forbids unauthorized processing of personal identifying information.",
        "The GDPR requires security controls for protecting business secrets."
      ],
      svar: [1, 2],
      explain: [
        "<p>Feil. GDPR beskytter personer som befinner seg i EU/EØS uansett statsborgerskap, og gjelder virksomheter som behandler slike personopplysninger.</p>",
        "<p>Riktig. Den registrerte har innsynsrett: rett til å få vite hvilke opplysninger om seg som behandles.</p>",
        "<p>Riktig. All behandling av personopplysninger må ha et lovlig grunnlag; behandling uten det er forbudt.</p>",
        "<p>Feil. GDPR handler om personopplysninger, ikke forretningshemmeligheter.</p>"
      ]
    },
    avvik: null,
    losning: ["GDPR = personopplysninger og de registrertes rettigheter.", "Innsynsrett og krav om lovlig grunnlag er sant. «Bare EU-borgere» og «forretningshemmeligheter» er feil."],
    tips: [UTE + "GDPR er ikke på 2026-lysarkene (plan/vranglaere.md E). Sist spurt om som egen oppgave i H2019.", "«only» i et påstandsalternativ er ofte et tegn på at det er feil."]
  });
  hv("H2019-1.5",
    "<p>Opplysninger om deg er dine. Du kan spørre en butikk hva den vet om deg, og den kan ikke bruke opplysningene uten en god grunn.</p>",
    "<p>GDPR er EUs personvernforordning, også innført i Norge. Den gir de registrerte rettigheter, blant annet innsyn, og krever at all behandling av personopplysninger har et lovlig grunnlag. Den gjelder personer i EU/EØS, ikke bare EU-borgere, og den handler ikke om forretningshemmeligheter.</p>",
    "<p>Forordningen gjelder behandling av personopplysninger om personer i EU/EØS, også når virksomheten er utenfor EU. Behandling krever et av de lovlige grunnlagene (f.eks. samtykke, avtale, rettslig plikt). Den krever også egnede sikkerhetstiltak, men for personopplysninger, ikke for virksomhetens egne hemmeligheter.</p>");

  /* ============================ PART 2: CRYPTOGRAPHY ============================ */

  O.push({
    key: "H2019-2.1", year: Y, oppgave_nr: "Oppgave 2.1", del: D2,
    ark: "2.1 Symmetric Encryption", title: "AES: sant eller usant",
    points: 2, block: "krypto", tema: ["AES", "blokkmodus", "nøkkelstørrelse", "symmetrisk kryptering"],
    ordrett: true,
    oppgave: "<p>Mark the statements about <strong>AES</strong> that are true.</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total",
      regel: rg(1, -1, 2),
      alternativer: [
        "AES can be used in different modes, which have different security properties.",
        "AES can be used with 2 different keys: one for encrypting and one for decrypting.",
        "AES can only encrypt messages up to the block size.",
        "AES can be used with different key sizes."
      ],
      svar: [0, 3],
      explain: [
        "<p>Riktig. AES brukes i moduser som ECB, CBC og CTR. ECB lekker mønstre, mens CBC og CTR ikke gjør det.</p>",
        "<p>Feil. AES er symmetrisk: samme nøkkel krypterer og dekrypterer. To ulike nøkler er asymmetrisk kryptografi.</p>",
        "<p>Feil. Én blokk er 128 bit, men en modus lenker blokkene sammen slik at meldinger av vilkårlig lengde kan krypteres.</p>",
        "<p>Riktig. AES finnes med 128, 192 og 256 bits nøkkel.</p>"
      ]
    },
    avvik: null,
    losning: ["AES: symmetrisk blokkchiffer, 128-bit blokk, nøkkel 128/192/256 bit.", "Lange meldinger krypteres med en modus (CBC, CTR …)."],
    tips: ["«AES-512» og «to nøkler» er klassiske distraktorer."],
    gjenganger: ["H2021-3.2"]
  });
  hv("H2019-2.1",
    "<p>AES er en lås der samme nøkkel låser og låser opp. Du kan velge en kort eller lang nøkkel, og du kan låse et langt brev bit for bit på ulike måter.</p>",
    "<p>AES er et symmetrisk blokkchiffer: samme nøkkel brukes begge veier. Det krypterer 128 bit om gangen, men en modus (CBC, CTR o.l.) gjør at hele meldinger kan krypteres. Modusene har ulike egenskaper, og nøkkelen kan være 128, 192 eller 256 bit.</p>",
    "<p>Blokkstørrelsen er fast på 128 bit; antall runder avhenger av nøkkelstørrelsen (10, 12 eller 14). Valg av modus avgjør sikkerheten for lengre meldinger:</p><ul><li>ECB gir samme chiffertekst for like klartekstblokker,</li><li>CBC trenger en tilfeldig IV,</li><li>og CTR gjør blokkchifferet om til et strømchiffer der bare E brukes, også ved dekryptering.</li></ul>");

  O.push({
    key: "H2019-2.2", year: Y, oppgave_nr: "Oppgave 2.2", del: D2,
    ark: "2.2 Asymmetric Encryption", title: "Hvilke nøkler brukes ved RSA-kryptering?",
    points: 2, block: "krypto", tema: ["RSA", "asymmetrisk kryptering", "offentlig nøkkel", "privat nøkkel"],
    gjenganger: ["H2023-7", "H2024-7", "H2025-9"],
    ordrett: true,
    oppgave: "<p>Which keys are involved in the overall process of <strong>encrypting and decrypting using RSA</strong>?</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score",
      regel: rg(1, -1, 2),
      alternativer: ["Symmetric key generated by the recipient", "Symmetric key generated by the sender", "Public key of the recipient", "Private key of the sender", "Public key of the sender", "Private key of the recipient"],
      svar: [2, 5],
      explain: [
        "<p>Feil. Ren RSA-kryptering bruker ingen symmetrisk nøkkel.</p>",
        "<p>Feil ifølge fasit. Ved ren RSA-kryptering er det ingen symmetrisk nøkkel. (Ved hybrid kryptering lager avsenderen en øktnøkkel, se avvik.)</p>",
        "<p>Riktig. Avsenderen krypterer med mottakerens offentlige nøkkel: C = E(M, K<sup>B</sup><sub>pub</sub>).</p>",
        "<p>Feil. Avsenderens private nøkkel brukes til å signere, ikke til å kryptere til noen andre.</p>",
        "<p>Feil. Avsenderens offentlige nøkkel brukes til å verifisere avsenderens signatur, ikke ved kryptering til mottakeren.</p>",
        "<p>Riktig. Bare mottakeren har sin private nøkkel og kan dekryptere: M = D(C, K<sup>B</sup><sub>priv</sub>).</p>"
      ]
    },
    avvik: "Leser man «the overall process» som hybrid kryptering (slik RSA brukes i praksis), er også «Symmetric key generated by the sender» med. Fasiten tolker oppgaven som ren RSA-kryptering og merker bare mottakerens nøkkelpar.",
    losning: ["Kryptering til B: B sin offentlige nøkkel. Dekryptering: B sin private nøkkel.", "Avsenderens nøkkelpar brukes bare ved signering."],
    tips: ["Krypter med mottakers offentlige, signer med egen private. Ikke bland dem."]
  });
  hv("H2019-2.2",
    "<p>Mottakeren deler ut åpne hengelåser som alle kan klikke igjen, men bare mottakeren har nøkkelen som åpner dem.</p>",
    "<p>Ved asymmetrisk kryptering bruker avsenderen mottakerens offentlige nøkkel til å kryptere, og mottakeren bruker sin egen private nøkkel til å dekryptere. Avsenderens nøkler er ikke involvert, og ren RSA-kryptering bruker ingen symmetrisk nøkkel.</p>",
    "<p>C = E(M, K<sup>B</sup><sub>pub</sub>) og M = D(C, K<sup>B</sup><sub>priv</sub>). Avsenderens nøkkelpar hører til signering: S = Sig(H, K<sup>A</sup><sub>priv</sub>), verifisert med K<sup>A</sup><sub>pub</sub>. I praksis krypteres store data med en symmetrisk øktnøkkel som så krypteres med RSA (hybrid kryptering), men oppgaven spør om RSA-delen.</p>");

  O.push({
    key: "H2019-2.3", year: Y, oppgave_nr: "Oppgave 2.3", del: D2,
    ark: "2.3 MAC + Digital Signature", title: "MAC, digital signatur, begge eller ingen",
    points: 3, block: "krypto", tema: ["MAC", "digital signatur", "ubenektelighet", "integritet"],
    gjenganger: ["H2018-2.5", "H2020-2.1", "H2021-1.4", "H2022-5.3", "H2023-15", "H2024-12"],
    ordrett: true,
    oppgave: "<p>Please select for each property, if it applies to <strong>Message Authentication Codes</strong> (MAC), <strong>Digital Signature</strong> (DSig), both (MAC + DSig) or none of these two.</p><p>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3 total score</p><p><strong>Please match the values:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3 total score",
      regel: rg(0.5, -0.5, 3),
      kolonner: ["MAC", "DSig", "Both", "None"],
      multi: false,
      rader: [
        { s: "It ensure confidentiality of the message.", svar: [3], explain: "<p>Verken MAC eller signatur krypterer meldingen; den sendes i klartekst ved siden av: <strong>None</strong>.</p>" },
        { s: "It ensures integrity of the message.", svar: [2], explain: "<p>Begge oppdager at meldingen er endret: <strong>Both</strong>.</p>" },
        { s: "It ensures non-repudiation of the message.", svar: [1], explain: "<p>Bare avsenderen har privatnøkkelen, så hen kan ikke nekte for signaturen: <strong>DSig</strong>. Med MAC har begge parter samme nøkkel.</p>" },
        { s: "Only the recipient (and the sender) can authenticate the message origin.", svar: [0], explain: "<p>Bare de som har den delte hemmelige nøkkelen kan sjekke en MAC: <strong>MAC</strong>.</p>" },
        { s: "The implementation is based on hash functions.", svar: [2], explain: "<p>MAC (f.eks. HMAC) er en hash med nøkkel, og signaturen lages over en hash av meldingen: <strong>Both</strong>.</p>" },
        { s: "Any party can authenticate the message origin.", svar: [1], explain: "<p>Alle med avsenderens offentlige nøkkel kan verifisere: <strong>DSig</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Integritet og hash: begge. Konfidensialitet: ingen.", "Ubenektelighet og «alle kan verifisere»: signatur. «Bare mottaker og avsender»: MAC."],
    tips: ["Arket skriver «It ensure confidentiality» (skrivefeil i originalen).", "MAC gir aldri ubenektelighet, og ingen av dem gir konfidensialitet."]
  });
  hv("H2019-2.3",
    "<p>En MAC er et hemmelig håndtrykk mellom to venner: bare de to kan sjekke det. En signatur er en håndskrift alle har en prøve av: alle kan sjekke den, og bare én kan lage den.</p>",
    "<p>Både MAC og signatur beskytter integritet og bygger på hashfunksjoner, men ingen av dem skjuler innholdet. Med MAC deler avsender og mottaker nøkkelen, så bare de kan verifisere, og ingen tredjepart kan avgjøre hvem av dem som laget den. Signaturen lages med en privatnøkkel bare avsenderen har, så alle kan verifisere og avsenderen kan ikke nekte.</p>",
    "<p>MAC = Hash(M, k) med delt nøkkel k gir enkel meldingsautentisering. S = Sig(Hash(M), K<sup>A</sup><sub>priv</sub>) verifiseres med K<sup>A</sup><sub>pub</sub> og gir ubenektelig meldingsautentisering. Konfidensialitet krever kryptering i tillegg.</p>");

  O.push({
    key: "H2019-2.4", year: Y, oppgave_nr: "Oppgave 2.4", del: D2,
    ark: "2.4 Hash functions", title: "Bruk av hashfunksjoner, og når rask hash er en ulempe",
    points: 3, block: "krypto", tema: ["hashfunksjon", "passordlagring", "digital signatur", "treg hash"],
    gjenganger: ["H2021-3.4", "H2022-5.2"],
    ordrett: true,
    oppgave: "<p><em>Overall score: max 3 points</em></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection (begge spørsmålene). Overall score: max 3 points",
      regel: rg(1, -1, 3),
      regelMerknad: "To avkrysningsgrupper; hvert alternativ er én enhet. Maks 3 for hele oppgaven.",
      sporsmal: [
        { tekst: "Mark common <strong>application(s) of cryptographic hash functions</strong>.<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection</em><br><strong>Select one or more alternatives:</strong>",
          alternativer: ["Password storage", "Digital signature", "Key exchange", "Asymmetric encryption"], svar: [0, 1],
          explain: [
            "<p>Riktig. Passord lagres som (saltet) hash, ikke i klartekst.</p>",
            "<p>Riktig. Det er hashen av meldingen som signeres.</p>",
            "<p>Feil. Nøkkelutveksling (f.eks. Diffie-Hellman) bygger på modulær aritmetikk, ikke på hashing som hovedverktøy.</p>",
            "<p>Feil. Asymmetrisk kryptering bruker et nøkkelpar; en hash har ingen nøkkel og kan ikke dekrypteres.</p>"
          ] },
        { tekst: "In which of these application(s) is the <strong>fast computation</strong> of hash functions a disadvantage?<br><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection</em><br><strong>Select one or more alternatives</strong>",
          alternativer: ["Digital signature", "Key exchange", "Password storage", "Asymmetric encryption"], svar: [2],
          explain: [
            "<p>Feil. For signaturer er det en fordel at hashen er rask å beregne.</p>",
            "<p>Feil. Ikke et sted der rask hash er en ulempe.</p>",
            "<p>Riktig. En rask hash lar angriperen prøve milliarder av passordgjetninger per sekund mot en stjålet passordfil. Derfor brukes bevisst trege funksjoner (scrypt, bcrypt, Argon2).</p>",
            "<p>Feil. Ikke et sted der rask hash er en ulempe.</p>"
          ] }
      ]
    },
    avvik: null,
    losning: ["Bruk: passordlagring og digital signatur.", "Rask hash er en ulempe bare for passordlagring (gjør gjetting billig)."],
    tips: ["Treg hash er et passordtiltak; for signaturer og integritet vil vi ha rask hash."]
  });
  hv("H2019-2.4",
    "<p>Et fingeravtrykk av en tekst er nyttig for å sjekke at teksten er den samme. Men hvis det tar et øyeblikk å lage avtrykket, kan en tyv prøve millioner av passord veldig fort.</p>",
    "<p>Hashfunksjoner brukes til passordlagring og digitale signaturer (der hashen av meldingen signeres). For passord er det en ulempe at hashen er rask, fordi den som har stjålet passordfila, da kan teste svært mange gjetninger. Derfor brukes trege passordhasher.</p>",
    "<p>Signaturalgoritmer signerer Hash(M) for effektivitet og fordi signaturen da får fast lengde; der er fart bra. Ved passordlagring er angrepet offline gjetting: kostnaden per gjetning er nøyaktig én hashberegning, så funksjoner som scrypt og Argon2 gjør hver beregning dyr i tid og minne. Hash er verken kryptering eller nøkkelutveksling.</p>");

  /* ============================ PART 3: KEY MANAGEMENT ============================ */

  O.push({
    key: "H2019-3.1", year: Y, oppgave_nr: "Oppgave 3.1", del: D3,
    ark: "3.1 Crypto Period", title: "Kryptoperiode: sant eller usant",
    points: 2, block: "pki", tema: ["kryptoperiode", "signaturnøkkel", "kryptanalyse"],
    gjenganger: ["H2018-3.1", "H2020-3.1", "H2021-4.3"],
    ordrett: true,
    oppgave: "<p>Mark the statements on the <strong>crypto period</strong> of cryptographic keys that are true?</p><p><em>Point: 1 for each correct, -1 for each incorrect, 0 for no selection, max 2 total score.</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Point: 1 for each correct, -1 for each incorrect, 0 for no selection, max 2 total score.",
      regel: rg(1, -1, 2),
      alternativer: [
        "The length of the crypto period should be adjusted according to sensitivity of the information.",
        "For very sensitive applications the crypto period should always be very short.",
        "For digital signatures, the period for signing and verifying is always the same.",
        "The crypto period limits cryptanalytic attacks."
      ],
      svar: [0, 3],
      explain: [
        "<p>Riktig. Jo mer sensitiv informasjonen er, desto mer bør det tas hensyn til hvor lenge nøkkelen brukes.</p>",
        "<p>Feil. «Always» er for absolutt. Svært korte perioder betyr hyppig nøkkelbytte og mer distribusjon, som i seg selv gir risiko; perioden må veies.</p>",
        "<p>Feil. Privatnøkkelen brukes til å signere i en begrenset periode, men offentlig nøkkel må kunne verifisere gamle signaturer lenge etterpå.</p>",
        "<p>Riktig. En begrenset periode begrenser hvor mye chiffertekst angriperen får per nøkkel, og hvor lenge et angrep kan pågå.</p>"
      ]
    },
    avvik: null,
    losning: ["Kryptoperioden tilpasses sensitivitet og risiko.", "Signering og verifisering har ulike perioder.", "En begrenset periode begrenser kryptanalyse og skaden ved en kompromittert nøkkel."],
    tips: ["Påstander med «always» er sjelden sanne i nøkkelhåndtering."]
  });
  hv("H2019-3.1",
    "<p>Du bytter lås på døra med jevne mellomrom, ofte hvis huset er verdifullt. Men bytter du hver dag, blir det mange nøkler å dele ut, og det er også en risiko.</p>",
    "<p>Kryptoperioden er tiden en nøkkel er godkjent for bruk. Den bør tilpasses hvor sensitiv informasjonen er, og den begrenser hvor mye en angriper kan analysere. For signaturnøkler er perioden for å signere kortere enn perioden for å verifisere.</p>",
    "<p>Kurset deler kryptoperioden i beskyttelsesperiode (nøkkelen brukes til å beskytte data) og prosesseringsperiode (nøkkelen brukes til å dekryptere eller verifisere). For et signaturnøkkelpar slutter signeringen tidlig, mens verifiseringen kan fortsette i årevis. En kortere periode reduserer mengden data per nøkkel og skaden ved kompromittering, men øker kostnad og risiko ved nøkkelbytte.</p>");

  O.push({
    key: "H2019-3.2", year: Y, oppgave_nr: "Oppgave 3.2", del: D3,
    ark: "3.2 Key distribution", title: "Krav ved distribusjon av hver nøkkeltype",
    points: 3, block: "pki", tema: ["nøkkeldistribusjon", "symmetrisk nøkkel", "offentlig nøkkel", "privat nøkkel"],
    gjenganger: ["H2018-3.2"],
    ordrett: true,
    oppgave: "<p>Select for each key type the correct statement for <strong>key distribution</strong> of the specific key type.</p><p><em>Points: 1 for each correct, -1 for wrong, 0 for no selection, max 3 total score</em></p><p><strong>Select the correct statement.</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selection, max 3 total score",
      regel: rg(1, -1, 3),
      kolonner: ["Confidentiality during distribution required", "Authenticity of key source required", "Keys are usually not distributed", "None of the other statements"],
      multi: false,
      rader: [
        { s: "Symmetric keys", svar: [0], explain: "<p>En symmetrisk nøkkel er hemmelig, så den må holdes konfidensiell under distribusjon: <strong>Confidentiality during distribution required</strong>. (Autentisitet er også viktig, men det særegne kravet her er konfidensialitet.)</p>" },
        { s: "Asymmetric public keys", svar: [1], explain: "<p>Offentlige nøkler kan alle se, men du må vite at nøkkelen virkelig tilhører den den utgir seg for: <strong>Authenticity of key source required</strong>. Det er dette sertifikater løser.</p>" },
        { s: "Asymmetric private keys", svar: [2], explain: "<p>Privatnøkkelen lages og blir hos eieren: <strong>Keys are usually not distributed</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Symmetrisk: hemmelig, krever konfidensialitet.", "Offentlig: krever autentisitet (sertifikat).", "Privat: distribueres normalt ikke."],
    tips: ["Én avkrysning per rad. Velg kravet som skiller nøkkeltypene fra hverandre."]
  });
  hv("H2019-3.2",
    "<p>En felles husnøkkel må gis i hånden i hemmelighet. Et telefonnummer kan alle se, men du må vite at nummeret virkelig er bestemorens. Dagboknøkkelen din gir du ikke til noen.</p>",
    "<p>Symmetriske nøkler er hemmelige og må distribueres konfidensielt. Offentlige nøkler kan være åpne, men mottakeren må kunne stole på at nøkkelen hører til riktig eier (autentisitet). Private nøkler forlater normalt ikke eieren.</p>",
    "<p>Med n parter trengs n(n−1)/2 symmetriske nøkler som alle må fordeles over hemmelige og autentiske kanaler. Offentlige nøkler kan sendes åpent, men en angriper kan bytte dem ut (mann-i-midten), så de bindes til eieren med et sertifikat signert av en CA. Privatnøkkelen genereres helst der den skal brukes, f.eks. i et smartkort eller en HSM.</p>");

  O.push({
    key: "H2019-3.3", year: Y, oppgave_nr: "Oppgave 3.3", del: D3,
    ark: "3.3 Certificates + PKI", title: "Sertifikater og nettleser-PKI: sant eller usant",
    points: 3, block: "pki", tema: ["sertifikat", "nettleser-PKI", "rot-CA", "domenevalidering", "EV", "tillitsforvirring"],
    gjenganger: ["H2018-3.3"],
    ordrett: true,
    oppgave: "<p>Please select the statements on <strong>certificates</strong> and <strong>browser PKIs</strong> (Public Key Infrastructure) that are true.</p><p><em>Points: 1 for each correct, -1 for wrong, 0 for no selection, max 3</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selection, max 3",
      regel: rg(1, -1, 3),
      alternativer: [
        "For an extended-validation certificate (EV), the requester must prove the honest intention of the Web site.",
        "Certificates allow the user to detect phishing Web sites.",
        "If a single CA is compromised, any company on the Internet can be spoofed.",
        "A CA verifies the ownership of a domain before signing a certificate request.",
        "Certificates ensure authentic exchange of private keys.",
        "The trust model is based not on one, but on many root CAs."
      ],
      svar: [2, 3, 5],
      explain: [
        "<p>Feil. EV krever grundigere kontroll av hvem organisasjonen er (juridisk identitet), ikke at hensikten er ærlig. Ingen CA kan bevise ærlighet.</p>",
        "<p>Feil. Phishing-nettsteder får lett gyldige sertifikater for sine egne domener. Sertifikatet viser bare hvem domenet tilhører, ikke om nettstedet er til å stole på (tillitsforvirring).</p>",
        "<p>Riktig. Nettleseren stoler like mye på alle rot-CA-er i lageret, og hver av dem kan utstede sertifikat for hvilket som helst domene.</p>",
        "<p>Riktig. Før CA-en signerer, kontrollerer den at søkeren styrer domenet (domenevalidering).</p>",
        "<p>Feil. Sertifikater binder <em>offentlige</em> nøkler til et navn. Private nøkler skal aldri utveksles.</p>",
        "<p>Riktig. Nettlesere og operativsystemer har et lager med mange rot-CA-er.</p>"
      ]
    },
    avvik: null,
    losning: ["Nettleser-PKI har mange likeverdige rot-CA-er: én kompromittert CA kan forfalske alle.", "CA kontrollerer domeneeierskap; sertifikatet sier hvem, ikke om nettstedet er ærlig.", "Sertifikater gjelder offentlige nøkler."],
    tips: ["Tillitsforvirring: et gyldig sertifikat betyr ikke et pålitelig nettsted.", "EV-sertifikater er bare i ukesoppgavene fra 2025, ikke på 2026-lysarkene (plan/vranglaere.md E); resten av oppgaven er pensum."]
  });
  hv("H2019-3.3",
    "<p>Et sertifikat er som et navneskilt med stempel fra et kontor. Stempelet sier hvem som eier butikken, ikke at butikken er ærlig. Og hvis ett av mange stempelkontorer blir lurt, kan noen lage falske skilt for hvem som helst.</p>",
    "<p>I nettleser-PKI-en stoler nettleseren på mange rot-CA-er. En CA sjekker at søkeren eier domenet før den signerer. Sertifikatet binder et domenenavn til en offentlig nøkkel; det sier ingenting om nettstedet er ærlig, så det hindrer ikke phishing. Hvis én CA kompromitteres, kan den utstede gyldige sertifikater for alle domener.</p>",
    "<p>Alle rot-CA-er i lageret er likestilte, så sikkerheten til hele systemet bestemmes av den svakeste CA-en (jf. DigiNotar 2011). Domenevalidering skjer typisk ved at søkeren legger ut en verdi i DNS eller på nettstedet. EV legger på kontroll av organisasjonens juridiske identitet, men nettlesere har siden sluttet å fremheve EV visuelt.</p>");

  O.push({
    key: "H2019-3.4", year: Y, oppgave_nr: "Oppgave 3.4", del: D3,
    ark: "3.4 Trust in PKI", title: "Sertifikatkjede: rot-CA og mellomliggende CA",
    points: 2, block: "pki", tema: ["sertifikatkjede", "rot-CA", "mellomliggende CA", "rotlager"],
    gjenganger: ["H2021-4.4", "H2023-18", "H2024-15"],
    ordrett: true,
    oppgave: "<p>A browser opens the web page \"https://example.com\". As part of the TLS connection the browser receives a server certificate. This certificate is signed by the CA \"X\". The certificate of \"X\" again is signed by the CA \"Y\". Mark the statements that are true for this scenario.</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total",
      regel: rg(1, -1, 2),
      alternativer: [
        "The certificate of example.com contains a reference to the CA \"Y\".",
        "The CA \"X\" is called root CA.",
        "The certificate \"Y\" must be stored in the \"certificate root store\" of the browser (or the OS), in order to trust the certificate of example.com.",
        "The CA \"X\" is called intermediate CA."
      ],
      svar: [2, 3],
      explain: [
        "<p>Feil. Sertifikatet for example.com peker bare på utstederen sin, X. Det er X sitt sertifikat som peker på Y.</p>",
        "<p>Feil. X er selv signert av Y, så X er ikke rot.</p>",
        "<p>Riktig. Kjeden må ende i et rotsertifikat nettleseren allerede stoler på. I scenariet er Y toppen av kjeden, så Y må ligge i rotlageret.</p>",
        "<p>Riktig. En CA som er signert av en annen CA og selv signerer sertifikater, er en mellomliggende CA.</p>"
      ]
    },
    avvik: null,
    losning: ["Kjeden: example.com ← X ← Y.", "X er mellomliggende, Y er rot og må ligge i rotlageret.", "Hvert sertifikat peker bare på sin egen utsteder."],
    tips: ["Påstanden om rotlageret forutsetter at Y er toppen av kjeden (selvsignert), slik scenariet antyder."]
  });
  hv("H2019-3.4",
    "<p>Du stoler på en lærer fordi rektor har ansatt henne, og du stoler på rektor fordi du kjenner skolen. Læreren viser til rektor, ikke til skolestyret.</p>",
    "<p>Nettleseren følger kjeden fra tjenerens sertifikat via X til Y. Validering lykkes bare hvis kjeden ender i et rotsertifikat som ligger i nettleserens eller operativsystemets rotlager. X, som er signert av en annen CA, er en mellomliggende CA. Hvert sertifikat har bare utstederen sin i seg.</p>",
    "<p>Feltet «issuer» i et X.509-sertifikat navngir den direkte utstederen. Tjeneren sender normalt sitt eget sertifikat og mellomliggende sertifikater; rotsertifikatet (selvsignert) må klienten ha fra før. Validering starter fra roten: Y sin nøkkel verifiserer X, og X sin nøkkel verifiserer example.com.</p>");

  /* ============================ PART 4: NETWORK SECURITY ============================ */

  O.push({
    key: "H2019-4.1", year: Y, oppgave_nr: "Oppgave 4.1", del: D4,
    ark: "4.1 TLS", title: "TLS: sant eller usant",
    points: 3, block: "nettverk", tema: ["TLS", "sertifikat", "chifferserie", "DH", "RSA", "integritet"],
    gjenganger: ["H2018-4.1"],
    ordrett: true,
    oppgave: "<p>Select the statements on <strong>TLS</strong> that are true.</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 3 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 3 total score",
      regel: rg(1, -1, 3),
      alternativer: [
        "TLS ensures integrity of transferred data.",
        "The subject of the server certificate must be equal to the server’s host name entered in the browser.",
        "Client and server must authenticate inside a TLS connection.",
        "For exchange of session keys, RSA is more secure than DH.",
        "The algorithms used inside a session are negotiated between client and server.",
        "HTTP and HTTPS can be offered on the same TCP port."
      ],
      svar: [0, 1, 4],
      explain: [
        "<p>Riktig. Hver post i TLS Record er beskyttet med MAC (eller AEAD), så endringer oppdages.</p>",
        "<p>Riktig. Navnet i sertifikatet må stemme med vertsnavnet brukeren skrev inn, ellers advarer nettleseren. (I dag står navnet i feltet Subject Alternative Name.)</p>",
        "<p>Feil. Tjeneren autentiseres nesten alltid, men klientautentisering med sertifikat er valgfri og sjelden brukt.</p>",
        "<p>Feil. Det er omvendt: (flyktig) DH gir fremoverhemmelighold, det gjør ikke RSA-nøkkeltransport. TLS 1.3 har fjernet RSA-nøkkeltransport.</p>",
        "<p>Riktig. Klient og tjener blir enige om chifferserie (algoritmer) i handtrykket.</p>",
        "<p>Feil ifølge fasit. HTTP og HTTPS bruker vanligvis ulike porter (80 og 443).</p>"
      ]
    },
    avvik: null,
    losning: ["Sant: integritet, sertifikatnavn = vertsnavn, algoritmer forhandles.", "Usant: klienten må ikke autentiseres, RSA er ikke sikrere enn DH, ikke samme port."],
    tips: ["Vanlig felle: «RSA er sikrere enn DH». DH gir fremoverhemmelighold, se også vranglære C13."]
  });
  hv("H2019-4.1",
    "<p>TLS er en forseglet konvolutt med et gyldig navneskilt på avsenderen. Du sjekker at navnet på skiltet er det samme som adressen du ville til, og dere avtaler sammen hvilken lås som brukes.</p>",
    "<p>TLS gir konfidensialitet og integritet for data og autentiserer tjeneren med sertifikat. Nettleseren sjekker at navnet i sertifikatet stemmer med vertsnavnet. Klient og tjener forhandler om algoritmer. Klientautentisering er valgfri, DH er å foretrekke framfor RSA-nøkkeltransport, og HTTP og HTTPS går på ulike porter.</p>",
    "<p>I handtrykket velges chifferserie, tjeneren sender sertifikatkjeden, og partene etablerer øktnøkler. Med flyktig (EC)DH som er signert av tjeneren, får man fremoverhemmelighold; med RSA-nøkkeltransport kan den som senere får tjenerens privatnøkkel, dekryptere gamle opptak. Record-protokollen bruker øktnøklene til kryptering og MAC/AEAD.</p>");

  O.push({
    key: "H2019-4.2", year: Y, oppgave_nr: "Oppgave 4.2", del: D4,
    ark: "4.2 VPN", title: "Sky-VPN og Tor: hvem kjenner hvem?",
    points: 2, block: "nettverk", tema: ["VPN", "Tor", "inngangsnode", "utgangsnode", "anonymitet"],
    gjenganger: ["H2018-4.4", "H2018-4.5", "H2022-7.2"],
    ordrett: true,
    oppgave: "<p>Assume the following situation: a client accesses a server trough either a cloud <strong>VPN</strong> or the <strong>TOR</strong> network. Mark the statements that are true (here \"knowing\" means \"can learn the IP address when looking at the network communication\").</p><p><em>Point: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Point: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score",
      regel: rg(1, -1, 2),
      alternativer: [
        "When using TOR, the entry-node does not know the exit-node.",
        "When using a cloud VPN, the VPN provider knows the client.",
        "When using TOR, the entry-node knows the server.",
        "When using a cloud VPN, the user's ISP knows the server."
      ],
      svar: [0, 1],
      explain: [
        "<p>Riktig. Inngangsnoden ser bare klienten og den midterste noden. Hvem utgangsnoden er, ligger kryptert inne i løken.</p>",
        "<p>Riktig. Klienten kobler direkte til VPN-tjeneren, så leverandøren ser klientens IP-adresse (og også hvilke tjenere den besøker).</p>",
        "<p>Feil. Det er bare utgangsnoden som ser tjeneren.</p>",
        "<p>Feil. Internettleverandøren ser bare den krypterte tunnelen til VPN-tjeneren, ikke den endelige tjeneren.</p>"
      ]
    },
    avvik: null,
    losning: ["Tor: inngang kjenner klienten, utgang kjenner tjeneren, ingen node kjenner begge.", "Sky-VPN: leverandøren kjenner begge; ISP-en ser bare VPN-tjeneren."],
    tips: ["Arket skriver «trough» (skrivefeil i originalen).", "Forskjellen å huske: VPN flytter tilliten til én leverandør, Tor sprer den på tre noder."]
  });
  hv("H2019-4.2",
    "<p>Med VPN gir du brevet til ett budfirma som leverer det for deg: firmaet vet både hvem du er og hvor brevet skal. Med Tor går brevet gjennom tre bud, og hvert bud vet bare hvem det fikk brevet fra og hvem det skal gi det til.</p>",
    "<p>En sky-VPN lager en kryptert tunnel fra klienten til leverandøren, som sender trafikken videre. Leverandøren ser både klient og tjener, mens internettleverandøren bare ser tunnelen. I Tor går trafikken gjennom tre noder; inngangsnoden kjenner klienten, utgangsnoden kjenner tjeneren, og ingen enkelt node kjenner begge.</p>",
    "<p>Tor bruker løkruting: klienten krypterer i tre lag med nøkler den deler med hver node, og hver node fjerner ett lag og ser bare neste hopp. Dermed kjenner inngangsnoden ikke utgangsnoden. Med VPN er anonymiteten mot tjeneren bare så god som tilliten til VPN-leverandøren, som har hele bildet.</p>");

  O.push({
    key: "H2019-4.3", year: Y, oppgave_nr: "Oppgave 4.3", del: D4,
    ark: "4.3 Firewall", title: "Brannmurer: sant eller usant",
    points: 2, block: "nettverk", tema: ["brannmur", "tilstandsbasert pakkefilter", "applikasjonsportner", "OSI-lag"],
    gjenganger: ["H2018-9.1", "H2021-5.4", "H2022-7.3"],
    ordrett: true,
    oppgave: "<p>Select the statements on <strong>firewalls</strong> that are true.</p><p><em>Points: 1 for each correct, -1 for wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selection, max 2 total score",
      regel: rg(1, -1, 2),
      alternativer: [
        "Stateful packet filters can correlate a DNS response to a prior DNS request.",
        "A packet filter operates on the OSI layers 3 (network) and 4 (transport).",
        "A application level gateway can always handle all protocols on top of TCP.",
        "A network firewall blocks all traffic between two networks."
      ],
      svar: [0, 1],
      explain: [
        "<p>Riktig. Et tilstandsbasert filter husker forespørselen og slipper bare inn svar som hører til den.</p>",
        "<p>Riktig. Pakkefilteret ser på IP-adresser (lag 3) og porter/protokoll (lag 4).</p>",
        "<p>Feil. En applikasjonsportner må forstå hver protokoll den skal håndtere, så den støtter bare de protokollene den har en proxy for.</p>",
        "<p>Feil. En brannmur slipper gjennom tillatt trafikk etter regelsettet; ellers ville nettene vært frakoblet.</p>"
      ]
    },
    avvik: null,
    losning: ["Pakkefilter: lag 3 og 4. Tilstandsbasert: husker forbindelser og kobler svar til forespørsler.", "Applikasjonsportner: bare protokoller den forstår. Brannmur: filtrerer, blokkerer ikke alt."],
    tips: ["«always» og «all» er røde flagg i påstandsoppgaver."]
  });
  hv("H2019-4.3",
    "<p>En portvakt som husker at du gikk ut for å hente pizza, slipper inn pizzabudet etterpå. En portvakt som åpner esker, må vite hva som skal være i hver type eske.</p>",
    "<ul><li>Et pakkefilter ser på adresser og porter (lag 3 og 4).</li><li>Et tilstandsbasert pakkefilter husker forespørsler og kan derfor slippe inn bare svarene som hører til, f.eks. DNS-svar.</li><li>En applikasjonsportner må forstå hver protokoll og håndterer derfor ikke alt.</li><li>En brannmur filtrerer trafikk etter regler; den blokkerer ikke alt.</li></ul>",
    "<p>For UDP (som DNS) finnes ingen forbindelse i protokollen, så filteret lager en pseudoforbindelse fra adresser og porter i forespørselen og godtar bare svar som matcher innen en tidsfrist. Applikasjonsportnere (proxyer) tolker protokollen på lag 7 og kan inspisere innhold, men krever støtte per protokoll.</p>");

  O.push({
    key: "H2019-4.4", year: Y, oppgave_nr: "Oppgave 4.4", del: D4,
    ark: "4.4 IDS", title: "Signaturbasert eller anomalibasert IDS",
    points: 1, block: "nettverk", tema: ["IDS", "signaturbasert", "anomalibasert"],
    gjenganger: ["H2018-9.3", "H2023-31", "H2025-21"],
    ordrett: true,
    oppgave: "<p>The two main techniques used in <strong>Intrusion Detection Systems</strong> (IDS) are Signature-Based Detection and Anomaly-Based Detection respectively. Select the <em>relevant IDS technique</em> for each property in the left column below.</p><p><em>Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection</em></p><p><strong>Select the relevant IDS technique for each property:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection",
      regel: rg(0.5, -0.5, 1),
      regelMerknad: FORSIDE_MIN,
      kolonner: ["Signature Detection", "Anomaly Detection"],
      multi: false,
      rader: [
        { s: "Based on learning normal behaviour", svar: [1], explain: "<p>Anomalibasert IDS lærer hva som er normalt og varsler om avvik: <strong>Anomaly Detection</strong>.</p>" },
        { s: "Can only detect known attacks", svar: [0], explain: "<p>Signaturbasert IDS sammenligner med kjente mønstre og ser ikke nye angrep: <strong>Signature Detection</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Signatur: kjente angrep, få falske alarmer.", "Anomali: lærer normal atferd, kan oppdage nye angrep, men gir flere falske alarmer."],
    tips: ["Gjenganger: anomali = «normal atferd», signatur = «kjente angrep»."]
  });
  hv("H2019-4.4",
    "<p>En vakt med en plakat over kjente tyver kjenner bare igjen dem på plakaten. En vakt som kjenner alle kundene sine, reagerer på alt som er uvanlig, også nye tyver.</p>",
    "<p>Signaturbasert deteksjon ser etter kjente mønstre og fanger derfor bare kjente angrep. Anomalibasert deteksjon lærer hva som er normal trafikk og varsler om avvik; den kan fange nye angrep, men gir flere falske positive.</p>",
    "<p>Signaturregler (f.eks. i Snort) beskriver konkrete kjennetegn ved et angrep. Anomalideteksjon bygger en modell av normal atferd i en læringsperiode, og avvik over en terskel gir alarm. Hvis angrep pågikk i læringsperioden, kan de bli en del av «normalen».</p>");

  O.push({
    key: "H2019-4.5", year: Y, oppgave_nr: "Oppgave 4.5", del: D4,
    ark: "4.5 DMZ", title: "Hva hører hjemme i DMZ og hva internt?",
    points: 2, block: "nettverk", tema: ["DMZ", "brannmur", "nettverkssegmentering"],
    ordrett: true,
    oppgave: "<p>In the case of two firewalls with a so-called <strong>DMZ (Demilitarized Zone)</strong> between them, servers/systems can be connected to either the DMZ or to internal networks. Select the <em>typical location</em> for connecting the servers/systems in the left column below.</p><p><em>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select correct placement of each type of system:</strong></p>",
    figur: {
      beskrivelse: "Nettverkskart. Øverst til venstre en sky merket «Internet». En tykk blå linje går fra skyen til høyre og ned til en brannmur (murstein) merket «External Router / Firewall». Under brannmuren går linjen videre ned til en vannrett blå linje merket «DMZ (Demilitarized Zone)», som går mot venstre; fra den henger tre bokser med «?». Linjen fortsetter ned til en ny brannmur merket «Internal Router / Firewall», og videre ned til en vannrett blå linje mot høyre merket «Internal Networks», med tre bokser med «?» over linjen.",
      tekst: ["Internet", "External Router / Firewall", "DMZ (Demilitarized Zone)", "Internal Router / Firewall", "Internal Networks", "?"]
    },
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 2 total score",
      regel: rg(0.5, -0.5, 2),
      kolonner: ["DMZ", "Internal Networks"],
      multi: false,
      rader: [
        { s: "Database Server", svar: [1], explain: "<p>Databasen har de verdifulle dataene og skal ikke nås direkte fra Internett: <strong>Internal Networks</strong>. Webtjeneren i DMZ snakker med den gjennom den indre brannmuren.</p>" },
        { s: "Email server", svar: [0], explain: "<p>E-posttjeneren må ta imot e-post fra Internett: <strong>DMZ</strong>.</p>" },
        { s: "Web Server", svar: [0], explain: "<p>Webtjeneren skal være nåbar fra Internett: <strong>DMZ</strong>.</p>" },
        { s: "Workstation", svar: [1], explain: "<p>Arbeidsstasjoner tilbyr ingen tjenester utad og skal beskyttes best: <strong>Internal Networks</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["DMZ: tjenester som må nås fra Internett (web, e-post).", "Internt: det som ikke skal nås utenfra (database, arbeidsstasjoner)."],
    tips: ["Tommelfingerregel: skal Internett snakke direkte med den? Ja → DMZ. Nei → internt."]
  });
  hv("H2019-4.5",
    "<p>Et hotell har en resepsjon der hvem som helst kan komme inn, og et kontor bak som bare de ansatte bruker. Resepsjonen er DMZ; kassaskapet står på kontoret.</p>",
    "<p>Med to brannmurer får man en DMZ mellom dem. Der står tjenester som må være nåbare fra Internett, som web- og e-posttjenere. Bak den indre brannmuren står det som skal skjermes: databaser og arbeidsstasjoner. Blir en tjener i DMZ kompromittert, står det fortsatt en brannmur mellom angriperen og det interne nettet.</p>",
    "<p>Den ytre brannmuren slipper bare inn trafikk til tjenestene i DMZ (f.eks. TCP 443 og 25). Den indre brannmuren slipper bare inn den trafikken tjenestene i DMZ trenger, f.eks. fra webtjeneren til databaseporten. Dette er forsvar i dybden: to lag med regler mellom Internett og de viktigste verdiene.</p>");

  /* ============================ PART 5: INCIDENT RESPONSE ============================ */

  var UTE_IR = UTE + "hendelsesrespons med faser er ikke på 2026-lysarkene (plan/vranglaere.md E; nevnt i O3/KI uten faser). Sist på eksamen H2020.";

  O.push({
    key: "H2019-5.1", year: Y, oppgave_nr: "Oppgave 5.1", del: D5,
    ark: "5.1 Incident Response", title: "Hendelsesrespons: sant eller usant",
    points: 2, block: "cyberops", tema: ["hendelsesrespons", "SIEM", "SOC"],
    gjenganger: ["H2020-9.1"],
    ordrett: true,
    oppgave: "<p>Mark the statements on <strong>incident response</strong> that are true.</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total",
      regel: rg(1, -1, 2),
      alternativer: [
        "Incident response shall reduce negative consequences of an incident.",
        "As incident response reacts on unexpected events, it can not be planned.",
        "Incident response is a reaction to unexpected events.",
        "Incident response is a proactive process (like SIEM or SOC)."
      ],
      svar: [0, 2],
      explain: [
        "<p>Riktig. Målet er å begrense skaden og komme raskt tilbake til normal drift.</p>",
        "<p>Feil. Selv om hendelsen er uventet, skal responsen planlegges på forhånd: plan, roller, team og øvelser.</p>",
        "<p>Riktig. Hendelsesrespons settes i gang når noe uventet har skjedd.</p>",
        "<p>Feil. Respons er reaktiv. Overvåking i SIEM/SOC er det som oppdager hendelser og trigger responsen.</p>"
      ]
    },
    avvik: null,
    losning: ["Hendelsesrespons er en reaksjon på uventede hendelser og skal redusere konsekvensene.", "Den kan og bør planlegges på forhånd."],
    tips: [UTE_IR, "Samme påstander kom igjen i H2020 9.1."]
  });
  hv("H2019-5.1",
    "<p>Brannvesenet rykker ut når det brenner, ikke før. Men de øver på forhånd og vet nøyaktig hva de skal gjøre når alarmen går.</p>",
    "<p>Hendelsesrespons er reaksjonen på en uventet sikkerhetshendelse, og målet er å redusere konsekvensene. Den er reaktiv, men den skal planlegges i forkant med plan, ansvar og øvelser. Overvåking i SIEM eller SOC er det som oppdager hendelser og setter i gang responsen.</p>",
    "<p>En god responsevne krever forberedelse: hendelseshåndteringsplan, definert team, kontaktlister, logging og sikkerhetskopier. Selve responsen følger faser (analyse, skadebegrensning, utryddelse, gjenoppretting) og avsluttes med læring. Uten planlegging blir responsen improvisert, tregere og dyrere.</p>");

  O.push({
    key: "H2019-5.2", year: Y, oppgave_nr: "Oppgave 5.2", del: D5,
    ark: "5.2 Incident Response Phases I", title: "Rekkefølgen på fasene i hendelsesrespons",
    points: 2, block: "cyberops", tema: ["hendelsesrespons", "faser", "skadebegrensning", "gjenoppretting"],
    ordrett: true,
    oppgave: "<p>What is typical order of <strong>phases in incident response</strong>?</p><p><em>Points: 2 for correct, 0 for wrong, 0 for no selection</em></p><p><strong>Select one alternative:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Points: 2 for correct, 0 for wrong, 0 for no selection",
      regel: rg(2, 0, 2),
      alternativer: [
        "Analysis - Containment - Eradiction - Normalisation",
        "Eradiction - Analysis - Normalisation - Containment",
        "Normalisation - Containment - Analysis - Eradiction",
        "Containment - Normalisation - Eradiction - Analysis"
      ],
      svar: 0,
      explain: [
        "<p>Riktig. Først forstå hva som skjer (analyse), så hindre spredning (skadebegrensning), så fjerne årsaken (utryddelse), og til slutt gå tilbake til normal drift (gjenoppretting).</p>",
        "<p>Feil. Man kan ikke fjerne noe før man har analysert hva det er.</p>",
        "<p>Feil. Normal drift kommer til slutt, ikke først.</p>",
        "<p>Feil. Analysen kan ikke komme sist, og normal drift før utryddelse betyr at angriperen fortsatt er inne.</p>"
      ]
    },
    avvik: null,
    losning: ["Analyse → skadebegrensning → utryddelse → gjenoppretting (normalisering)."],
    tips: [UTE_IR, "Arket skriver «Eradiction» (skrivefeil for «Eradication», utryddelse)."]
  });
  hv("H2019-5.2",
    "<p>Når det lekker fra et rør: finn ut hvor det lekker, steng vannet, bytt røret, og skru vannet på igjen.</p>",
    "<p>Fasene følger en logisk rekkefølge: analyse (hva skjer og hvor omfattende), skadebegrensning (hindre spredning), utryddelse (fjerne skadevare og årsak) og gjenoppretting (tilbake til normal drift).</p>",
    "<p>Skadebegrensning før utryddelse er viktig: isolerer man ikke først, kan skadevaren spre seg mens man rydder. Gjenoppretting til slutt sikrer at man ikke tar i bruk systemer der angriperen fortsatt har fotfeste. Etterpå kommer evaluering og læring.</p>");

  O.push({
    key: "H2019-5.3", year: Y, oppgave_nr: "Oppgave 5.3", del: D5,
    ark: "5.3 Incident Response Phases II", title: "Løsepengevirus: hvilken fase hører tiltaket til?",
    points: 6, block: "cyberops", tema: ["hendelsesrespons", "løsepengevirus", "faser", "sikkerhetskopi"],
    gjenganger: ["H2020-9.2"],
    ordrett: true,
    oppgave: "<p>Consider the incident from the workshop: \"ransomware has encrypted important data from the research department and is requesting 100.000 $ in bitcoin\".</p><p>Select for each measure to which <strong>phase in incident response</strong> it belongs.</p><p><em>Points: 1 for each correct, -1 for wrong, 0 for no selection, max 6 total score</em></p><p><strong>Please match the values:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selection, max 6 total score",
      regel: rg(1, -1, 6),
      kolonner: ["Analysis", "(none of these)", "Containment", "Eradiction", "Normalisation"],
      multi: false,
      rader: [
        { s: "Performing backups before attack", svar: [1], explain: "<p>Sikkerhetskopier tas før hendelsen, som forberedelse, ikke som en del av responsen: <strong>(none of these)</strong>.</p>" },
        { s: "Unplugging infected computers from network", svar: [2], explain: "<p>Å koble fra nettet hindrer spredning: <strong>Containment</strong> (skadebegrensning).</p>" },
        { s: "Restoring data from backup", svar: [4], explain: "<p>Tilbake til normal drift med dataene fra sikkerhetskopien: <strong>Normalisation</strong> (gjenoppretting).</p>" },
        { s: "Collecting log files from IDS systems", svar: [0], explain: "<p>Logger samles for å forstå hva som har skjedd: <strong>Analysis</strong>.</p>" },
        { s: "Erasing hard drives of infected computers", svar: [3], explain: "<p>Å slette diskene fjerner skadevaren: <strong>Eradiction</strong> (utryddelse).</p>" },
        { s: "Payment of ransom", svar: [1], explain: "<p>Å betale løsepenger er ingen fase i hendelsesrespons (og anbefales normalt ikke): <strong>(none of these)</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Analyse: samle logger. Skadebegrensning: koble fra nett. Utryddelse: slette disker. Gjenoppretting: gjenopprette fra kopi.", "Ingen fase: sikkerhetskopi før angrepet (forberedelse) og betaling av løsepenger."],
    tips: [UTE_IR, "Med −1 per feil og 6 rader koster gjetting mye. Samme case kom igjen i H2020 9.2.", "Arket skriver «Eradiction» (skrivefeil for «Eradication»)."]
  });
  hv("H2019-5.3",
    "<p>Hvis noen har låst skuffene dine: se hva som er skjedd, steng døra så det ikke sprer seg, kast de ødelagte skuffene, og hent fram kopien du hadde gjemt. Å betale tyven er ikke en del av ryddeplanen.</p>",
    "<p>Hvert tiltak plasseres i fasen der det gjøres: logger samles i analysen, maskiner kobles fra i skadebegrensningen, diskene slettes i utryddelsen, og data gjenopprettes i gjenopprettingen. Sikkerhetskopiering før angrepet er forberedelse, og betaling av løsepenger er ingen responsfase.</p>",
    "<p>Løsepengevirus bryter først og fremst tilgjengelighet. Isolering stopper krypteringen fra å spre seg til flere maskiner og delte disker. Sletting og reinstallasjon fjerner fotfestet; gjenoppretting fra frakoblede sikkerhetskopier gir dataene tilbake uten å betale. Sikkerhetskopiene må tas før hendelsen og helst være utenfor rekkevidde for skadevaren.</p>");

  /* ============================ PART 6: RISK MANAGEMENT ============================ */

  O.push({
    key: "H2019-6.1", year: Y, oppgave_nr: "Oppgave 6.1", del: D6,
    ark: "6.1 Threat Tree", title: "Trusseltre: plasser fire noder",
    points: 3, block: "risiko", tema: ["trusseltre", "AND", "OR", "privilegieeskalering"],
    gjenganger: ["H2018-6.3"],
    ordrett: true,
    oppgave: "<p>Below you see a <strong>threat tree</strong> with one node already filled. Move the four (4) terms below the tree to right position inside the tree.</p><p><em>Points: 3 total score for all answers correct, 0 if any error</em></p><p><strong>Move the terms to the tree nodes</strong></p>",
    figur: {
      beskrivelse: "Trusseltre med tre nivåer. Øverst én tom rotnode (svarfelt 1 av 4). Fra roten går to piler ned til to svarte prikker, med teksten «OR» mellom pilene under roten. Venstre prikk har teksten «AND» på venstre side og to piler ned til to tomme noder (svarfelt 2 til venstre og 3 til høyre). Høyre prikk har «AND» på høyre side og to piler ned til to noder: tomt svarfelt 4 til venstre og den ferdig utfylte noden «Remote login as user» (lysere boks) til høyre. Under treet står de fire begrepene som skal dras inn.",
      tekst: ["OR", "AND", "AND", "Remote login as user"]
    },
    inspera: {
      type: "D",
      regelTekst: "Points: 3 total score for all answers correct, 0 if any error",
      regel: { riktig: 0, feil: 0, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Alt eller ingenting: 3 poeng bare når alle fire feltene er riktige, ellers 0 (enhetene gir 0 hver; alle riktige gir maks).",
      tekst: null,
      bank: ["Privilege Escalation Vulnerability", "Weak root password", "Remote root login possible", "Run remote command as root"],
      felt: [
        { etikett: "Rotnoden (øverst)", svar: 3, godta: [], explain: "<p>Roten er angriperens mål, som begge greinene fører til: <strong>Run remote command as root</strong>.</p>" },
        { etikett: "Venstre AND-grein, venstre node", svar: 1, godta: [], explain: "<p>Første vei til målet: logge inn som root direkte. Det krever et svakt rotpassord <em>og</em> at rotinnlogging over nett er tillatt. Fasiten har <strong>Weak root password</strong> her.</p>" },
        { etikett: "Venstre AND-grein, høyre node", svar: 2, godta: [], explain: "<p>Den andre betingelsen for direkte rotinnlogging: <strong>Remote root login possible</strong>.</p>" },
        { etikett: "Høyre AND-grein, venstre node", svar: 0, godta: [], explain: "<p>Andre vei: logge inn som vanlig bruker (allerede utfylt) <em>og</em> utnytte en sårbarhet for å bli root: <strong>Privilege Escalation Vulnerability</strong>.</p>" }
      ]
    },
    avvik: "Under en AND-node er rekkefølgen på barna logisk likegyldig, så «Weak root password» og «Remote root login possible» kunne byttet plass uten at treet ble feil. Fasiten viser bare én plassering, og øvingen godtar bare den.",
    losning: ["Roten er målet: Run remote command as root.", "OR: to alternative veier. Venstre AND: svakt rotpassord og fjern rotinnlogging mulig.", "Høyre AND: innlogging som bruker (gitt) og en sårbarhet for privilegieeskalering."],
    tips: [UTE + "trusseltrær (AND/OR) er ikke på 2026-lysarkene (plan/vranglaere.md E). Sist på eksamen H2019.", "Start med noden som allerede er gitt: hva trengs i tillegg for å nå målet fra den?"]
  });
  hv("H2019-6.1",
    "<p>For å komme inn i et låst rom kan du enten ha både nøkkelen og koden til døra, eller krype inn gjennom et vindu og så låse opp innenfra. Treet viser alle veiene til målet.</p>",
    "<p>Et trusseltre har angriperens mål som rot. En OR-node betyr at én av greinene holder, en AND-node at alle barna må være oppfylt. Her kan angriperen kjøre kommandoer som root enten ved å logge rett inn som root (svakt rotpassord AND fjern rotinnlogging tillatt) eller ved å logge inn som vanlig bruker AND utnytte en sårbarhet for privilegieeskalering.</p>",
    "<p>Trusseltrær brukes til å finne alle angrepsveier og til å velge tiltak: det holder å bryte én betingelse under hver AND for å stenge den veien, mens en OR krever at alle greinene stenges. Å forby rotinnlogging over nett stenger venstre grein uansett passord; patching stenger høyre.</p>");

  var ALE_TEKST = "<p>The following values are the result of a <strong>risk estimation</strong> analysis:</p><ul><li>Annualized Rate of Occurence: ARO = 12</li><li>Exposure Factor: EF = 1 (100%)</li><li>Asset Value: AV = 2000 $</li></ul>";
  var UTE_ALE = UTE + "ALE = ARO × EF × AV er bare i gamle sett; 2026 (O3/t06) bruker kvalitativ skala (plan/vranglaere.md E).";

  O.push({
    key: "H2019-6.2", year: Y, oppgave_nr: "Oppgave 6.2", del: D6,
    ark: "6.2 Risk Estimation I", title: "Kvantitativ analyse og enheten for ALE",
    points: 2, block: "risiko", tema: ["kvantitativ risikoanalyse", "ALE", "ARO", "EF", "AV"],
    gjenganger: ["H2018-6.4"],
    ordrett: true,
    oppgave: ALE_TEKST,
    inspera: {
      type: "F1",
      regelTekst: "Point: 1 for correct, -1 for wrong answer, 0 for no selection",
      regel: rg(1, -1, 2),
      regelMerknad: "To radioknapp-spørsmål med samme poenglinje; hvert er én enhet. Minimum 0 for hele oppgaven (forsiden).",
      sporsmal: [
        { tekst: "How is this type of analysis called?<br><em>Point: 1 for correct, -1 for wrong answer, 0 for no selection</em>", alternativer: ["Quantitative", "Qualitative"], svar: 0,
          explain: ["<p>Riktig. Verdiene er tall (frekvens, andel og beløp), og risikoen regnes ut: kvantitativ analyse.</p>", "<p>Feil. Kvalitativ analyse bruker nivåer som lav/middels/høy, ikke kroner og frekvenser.</p>"] },
        { tekst: "You have to calculate the Annualized Loss Expectancy (ALE) for the given case. What is the unit for the ALE?<br><em>Point: 1 for correct, -1 for wrong answer, 0 for no selection</em>", alternativer: ["(no unit, plain number)", "$", "%"], svar: 1,
          explain: ["<p>Feil. ALE er et beløp.</p>", "<p>Riktig ifølge fasit. ALE er et forventet tap i penger (strengt tatt $ per år).</p>", "<p>Feil. Prosent er enheten for EF, ikke ALE.</p>"] }
      ]
    },
    avvik: "Fasiten sier enheten er «$». Strengt tatt er ALE et forventet tap per år ($/år), siden ARO er antall per år. Velg «$» på denne oppgaven; det er det nærmeste alternativet.",
    losning: ["Tallverdier og beregning → kvantitativ.", "ALE er et pengebeløp (per år)."],
    tips: [UTE_ALE, "Arket skriver «Occurence» (skrivefeil i originalen)."]
  });
  hv("H2019-6.2",
    "<p>Hvis sykkelen din blir stjålet tolv ganger i året og hver sykkel koster 2000 kroner, kan du regne ut hvor mye du taper i året. Det er et tall i penger.</p>",
    "<p>Når risikoen uttrykkes med tall som frekvens, andel og verdi, og resultatet regnes ut, er analysen kvantitativ. ALE (forventet årlig tap) er et pengebeløp per år.</p>",
    "<p>ALE = SLE × ARO, der SLE = AV × EF er tapet per hendelse. Enheten blir valuta (per år, fordi ARO er per år). Kvalitativ analyse bruker i stedet ordinale nivåer og en risikomatrise.</p>");

  O.push({
    key: "H2019-6.3", year: Y, oppgave_nr: "Oppgave 6.3", del: D6,
    ark: "6.3 Risk Estimation II", title: "Regn ut ALE",
    points: 1, block: "risiko", tema: ["ALE", "SLE", "ARO", "kvantitativ risikoanalyse"],
    gjenganger: ["H2018-6.4"],
    ordrett: true,
    oppgave: ALE_TEKST + "<p>Calculate the Annualized Loss Expectancy (ALE) (enter just the number; without any unit if there is any).</p><p><em>Point: 1 for correct</em></p>",
    inspera: {
      type: "T",
      regelTekst: "Point: 1 for correct",
      regel: rg(1, 0, 1),
      tekst: "<p>ALE = {0}</p>",
      felt: [{ etikett: "ALE", godta: ["24000"], explain: "<p>SLE = AV × EF = 2000 × 1 = 2000. ALE = SLE × ARO = 2000 × 12 = <strong>24000</strong>.</p>" }]
    },
    avvik: null,
    losning: ["SLE = AV × EF = 2000 $ × 1 = 2000 $.", "ALE = SLE × ARO = 2000 $ × 12 = 24000 $ (per år)."],
    tips: [UTE_ALE, "Skriv bare tallet, uten enhet og uten mellomrom (fasiten godtar «24000»)."]
  });
  hv("H2019-6.3",
    "<p>En sykkel til 2000 som blir helt borte tolv ganger i året, koster deg 2000 ganger tolv: 24 000 i året.</p>",
    "<p>Først tapet per hendelse: verdien ganger andelen som går tapt, 2000 × 1 = 2000. Så ganger man med antall hendelser per år: 2000 × 12 = 24000.</p>",
    "<p>ALE = ARO × EF × AV = 12 × 1 × 2000 = 24000 ($ per år). ALE kan brukes til å vurdere om et tiltak lønner seg: et tiltak som koster mindre per år enn reduksjonen i ALE, er økonomisk forsvarlig.</p>");

  O.push({
    key: "H2019-6.4", year: Y, oppgave_nr: "Oppgave 6.4", del: D6,
    ark: "6.4 Risk Analysis", title: "Kvalitativ eller kvantitativ risikoanalyse",
    points: 2, block: "risiko", tema: ["kvalitativ risikoanalyse", "kvantitativ risikoanalyse", "risikomatrise"],
    ordrett: true,
    oppgave: "<p>Select for each statement whether it is true for <strong>qualitative</strong> or <strong>quantitative</strong> risk-analysis methods.</p><p><em>Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection, max 2 total</em></p><p><strong>Please match the values:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection, max 2 total",
      regel: rg(0.5, -0.5, 2),
      kolonner: ["Qualitative", "Quantitative"],
      multi: false,
      rader: [
        { s: "The input parameters are easy to estimate.", svar: [0], explain: "<p>Det er lettere å si «middels sannsynlighet» enn å anslå en nøyaktig frekvens og et beløp: <strong>Qualitative</strong>.</p>" },
        { s: "The risk levels are obtained with a look-up table.", svar: [0], explain: "<p>Risikonivået slås opp i en risikomatrise: <strong>Qualitative</strong>.</p>" },
        { s: "The resulting risk levels are absolute.", svar: [1], explain: "<p>Resultatet er et tall i penger per år, ikke en rangering: <strong>Quantitative</strong>.</p>" },
        { s: "The risk levels are obtained with computation.", svar: [1], explain: "<p>Risikoen regnes ut, f.eks. ALE = ARO × EF × AV: <strong>Quantitative</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Kvalitativ: enkle nivåer som input, oppslag i tabell, relative nivåer.", "Kvantitativ: tall som input, beregning, absolutte verdier."],
    tips: ["2026-kurset (O3) bruker kvalitative nivåer der sannsynlighet og konsekvens på logaritmisk skala summeres; skillet kvalitativ/kvantitativ er fortsatt nyttig."]
  });
  hv("H2019-6.4",
    "<p>«Litt farlig, ganske farlig, veldig farlig» er lett å si, og du slår opp i en tabell hva du skal gjøre. Å si nøyaktig hvor mange kroner du taper i året er vanskeligere, men gir et presist tall.</p>",
    "<p>Kvalitative metoder bruker grove nivåer som er lette å anslå, og risikonivået finnes i en oppslagstabell (risikomatrise). Resultatet er relativt. Kvantitative metoder bruker tall og beregner risikoen, og gir absolutte verdier som et pengebeløp per år.</p>",
    "<ul><li>Kvantitative metoder ser presise ut, men inputverdiene (frekvens, eksponeringsfaktor) er ofte usikre anslag, så presisjonen kan være falsk.</li><li>Kvalitative metoder er raske og lette å kommunisere, men et risikonivå som «høy» kan ikke sammenlignes direkte med hva et tiltak koster.</li></ul><p>(At 2026-kurset summerer sannsynlighets- og konsekvensnivå på logaritmisk skala, er en egen regel for å finne nivået, se tipset.)</p>");

  O.push({
    key: "H2019-6.5", year: Y, oppgave_nr: "Oppgave 6.5", del: D6,
    ark: "6.5 Risk Identification", title: "Rekkefølgen i risikoidentifisering",
    points: 2, block: "risiko", tema: ["risikoidentifisering", "trussel", "sårbarhet", "konsekvens"],
    ordrett: true,
    oppgave: "<p>What is most logical order in <strong>risk identification</strong>? Enter the numbers 1, 2 and 3 accordingly.</p><p><em>Points: 2 total for all answers correct, 0 total if any error</em></p>",
    inspera: {
      type: "T",
      regelTekst: "Points: 2 total for all answers correct, 0 total if any error",
      regel: { riktig: 0, feil: 0, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Alt eller ingenting: 2 poeng bare når alle tre tallene er riktige, ellers 0.",
      tekst: "<p>{0} Identify exploitable vulnerabilities</p><p>{1} Identify a relevant threat</p><p>{2} Identify impact</p>",
      felt: [
        { etikett: "Identify exploitable vulnerabilities", godta: ["2"], explain: "<p>Når trusselen er kjent, finner man sårbarhetene den kan utnytte: <strong>2</strong>.</p>" },
        { etikett: "Identify a relevant threat", godta: ["1"], explain: "<p>Man starter med en relevant trussel: <strong>1</strong>.</p>" },
        { etikett: "Identify impact", godta: ["3"], explain: "<p>Til slutt: hva blir konsekvensen hvis trusselen utnytter sårbarheten: <strong>3</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["1 trussel → 2 sårbarhet som kan utnyttes → 3 konsekvens."],
    tips: ["Rekkefølgen følger risikobegrepet: en trussel utnytter en sårbarhet og gir en konsekvens for en verdi."]
  });
  hv("H2019-6.5",
    "<p>Først spør du: hvem kan komme og ta noe? Så: hvor kommer de inn? Og til slutt: hva mister jeg da?</p>",
    "<p>Risikoidentifisering går logisk fra trussel til sårbarhet til konsekvens. En trussel er bare relevant hvis det finnes en sårbarhet den kan utnytte, og konsekvensen avhenger av hvilken verdi som rammes.</p>",
    "<p>Kurset definerer risiko som kombinasjonen av trussel, sårbarhet og verdi. Identifiseringen bygger opp denne kombinasjonen trinn for trinn; deretter følger estimering (sannsynlighet og konsekvens) og evaluering mot akseptkriterier.</p>");

  /* ============================ PART 7: USER AUTHENTICATION ============================ */

  O.push({
    key: "H2019-7.1", year: Y, oppgave_nr: "Oppgave 7.1", del: D7,
    ark: "7.1 Authentication Factors", title: "Autentiseringsfaktorer og et tofaktorsystem",
    points: 4, block: "autentisering", tema: ["autentiseringsfaktorer", "2FA", "noe du vet", "noe du har", "noe du er"],
    ordrett: true,
    oppgave: "<p>Name the three (3) general credential categories (called <strong>authentication factors</strong>) and give one example for each of them</p><p><em>Points: 0.5 for each correct factor, 0.5 for each correct example, 0 for wrong/no answer, max 3 total</em></p><p>Give one (1) example of a wide-spread commercial <strong>2-factor authentication system</strong> and name the involved factors.</p><p><em>Points: 1 for correct answer, 0 for wrong, 0 for no answer</em></p>",
    inspera: {
      type: "E",
      regelTekst: "Points: 0.5 for each correct factor, 0.5 for each correct example, 0 for wrong/no answer, max 3 total · Points: 1 for correct answer, 0 for wrong, 0 for no answer",
      regel: { min: 0, maks: 4 },
      regelMerknad: "Manuell retting. To svarfelt: faktorer med eksempler (3) og tofaktorsystem (1). Delbetegnelsene 1 og 2 er våre.",
      deler: [
        { del: "1.", poeng: 3, sporsmal: "<p>Name the three (3) general credential categories (called authentication factors) and give one example for each of them</p>", grense: "tre linjer" },
        { del: "2.", poeng: 1, sporsmal: "<p>Give one (1) example of a wide-spread commercial 2-factor authentication system and name the involved factors.</p>", grense: "én linje" }
      ]
    },
    avvik: null,
    losning: ["Noe du vet (passord, PIN), noe du har (token, kort), noe du er (fingeravtrykk, ansikt).", "Tofaktor: bankkort i minibank = kort (har) + PIN (vet)."],
    tips: ["I tofaktordelen må du både gi systemet og navngi de to faktorene.", "To passord er ikke tofaktor: begge er «noe du vet»."],
    gjenganger: ["H2018-7.1", "H2021-6.1"]
  });
  IN.PERFEKT["H2019-7.1"] = {
    type: "eksamen",
    svar: [
      { del: "1.", tekst: "<p>Kunnskap (noe du vet): passord eller PIN. Eierskap (noe du har): sikkerhetstoken, f.eks. kodebrikke eller smartkort. Iboende (noe du er): fingeravtrykk eller ansiktsgjenkjenning.</p>",
        poeng: ["Kunnskap (0,5p) + eksempel (0,5p)", "Eierskap (0,5p) + eksempel (0,5p)", "Iboende/biometri (0,5p) + eksempel (0,5p)"] },
      { del: "2.", tekst: "<p>Minibank: bankkortet (eierskap) og PIN-koden (kunnskap).</p>", poeng: ["System og begge faktorene navngitt (1p)"] }
    ],
    sensor: {
      deler: [
        { del: "1.", fasit: "<p>– Knowledge-based, ex.: password, PIN<br>– Ownership-based, ex.: security token<br>– Inherence-based, ex.: face recognition, iris<br>- (also OK: Secondary channel, ex.: SMS)</p>", kriterier: "<p>Points: 0.5 for each correct factor, 0.5 for each correct example, 0 for wrong/no answer, max 3 total</p>" },
        { del: "2.", fasit: "<p>e.g. ATM: knowledge (PIN) + ownership (card)</p>", kriterier: "<p>Points: 1 for correct answer, 0 for wrong, 0 for no answer</p>" }
      ],
      merknad: "Modellsvarene står grønt i de to svarfeltene. «also OK: Secondary channel» betyr at sekundærkanal (SMS) også godtas som kategori."
    }
  };
  hv("H2019-7.1",
    "<p>For å komme inn kan du vise noe du vet (et hemmelig ord), noe du har (en nøkkel) eller noe du er (ansiktet ditt). Minibanken krever både kortet og koden, så en tyv trenger begge.</p>",
    "<p>De tre faktorene er kunnskap (passord, PIN), eierskap (token, smartkort) og iboende egenskaper (biometri som fingeravtrykk eller ansikt). Tofaktorautentisering kombinerer to ulike faktorer, for eksempel bankkort og PIN i minibanken.</p>",
    "<p>Poenget med flere faktorer er at de angripes på ulike måter: et passord kan phishes, et kort kan stjeles, men å få begge krever to ulike angrep. Kurset nevner også sekundærkanal (f.eks. kode på SMS), som fasiten godtar; SMS regnes som relativt svak.</p>");

  O.push({
    key: "H2019-7.2", year: Y, oppgave_nr: "Oppgave 7.2", del: D7,
    ark: "7.2 Password Handling", title: "Stjålet passordfil: hva gjør knekking vanskeligere?",
    points: 3, block: "autentisering", tema: ["passordhash", "salt", "treg hash", "scrypt", "passordkompleksitet"],
    gjenganger: ["H2021-6.1", "H2022-8.1", "H2023-9"],
    ordrett: true,
    oppgave: "<p>Please answer the following questions on <strong>password handling</strong>.</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 3 total score</em></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 3 total score",
      regel: rg(1, -1, 3),
      regelMerknad: "To avkrysningsgrupper; hvert alternativ er én enhet. Maks 3 for hele oppgaven.",
      sporsmal: [
        { tekst: "Image the following situation: an attacker has stolen a password file containing hashed passwords. Which of the following methods can make <strong>brute force attacks</strong> on a specific password inside this file more difficult?",
          alternativer: ["Access control for the password file", "Complex password", "Salting", "Using \"slow\" hash functions (e.g. scrypt)"], svar: [1, 3],
          explain: [
            "<p>Feil. Fila er allerede stjålet, så tilgangskontroll hjelper ikke lenger.</p>",
            "<p>Riktig. Et langt og uforutsigbart passord gir et mye større søkerom.</p>",
            "<p>Feil. Salt hindrer forhåndsberegnede tabeller og at mange passord angripes samtidig, men gjetting på <em>ett bestemt</em> passord blir ikke tregere.</p>",
            "<p>Riktig. Hver gjetning koster mer tid og minne, så angriperen rekker færre forsøk.</p>"
          ] },
        { tekst: "Which of the following methods can be influenced by the user (i.e. the owner of the password)?",
          alternativer: ["Using \"slow\" hash functions (e.g. scrypt)", "Access control for the password file", "Complex password", "Salting"], svar: [2],
          explain: [
            "<p>Feil. Valg av hashfunksjon gjøres av systemet.</p>",
            "<p>Feil. Tilgangskontroll på fila styres av systemet/administratoren.</p>",
            "<p>Riktig. Brukeren velger selv passordet.</p>",
            "<p>Feil. Salting gjøres av systemet ved lagring.</p>"
          ] }
      ]
    },
    avvik: null,
    losning: ["Mot gjetting på ett passord i en stjålet fil: sterkt passord og treg hash.", "Salt hjelper mot regnbuetabeller og massetesting, ikke mot ett målrettet passord.", "Brukeren styrer bare passordet selv."],
    tips: ["Vranglære C21: salt gjør ikke et svakt passord vanskeligere å gjette.", "Arket skriver «Image the following situation» (skrivefeil for «Imagine»)."]
  });
  hv("H2019-7.2",
    "<p>Tyven har tatt med seg låsen hjem og prøver nøkler i ro og mak. Det hjelper ikke å låse døra til rommet der låsen lå. Det som hjelper, er en lås med veldig mange mulige nøkler og en lås som er treg å prøve.</p>",
    "<p>Når passordfila er stjålet, kan angriperen gjette offline. Et komplekst passord gir flere muligheter å prøve, og en treg hashfunksjon gjør hvert forsøk dyrt. Salt hindrer forhåndsberegnede tabeller, men gjør ikke ett bestemt passord vanskeligere. Av tiltakene er det bare passordet brukeren selv bestemmer.</p>",
    "<p>Kostnaden ved å knekke ett passord er omtrent størrelsen på søkerommet ganger kostnaden per hash. Kompleksitet øker det første, scrypt/Argon2 det andre. Salt gjør at samme passord gir ulik hash hos ulike brukere, så angriperen må gjette per bruker og kan ikke bruke regnbuetabeller, men for én bestemt bruker er saltet kjent og endrer ikke antall forsøk.</p>");

  O.push({
    key: "H2019-7.3", year: Y, oppgave_nr: "Oppgave 7.3", del: D7,
    ark: "7.3 Biometric Authentication", title: "Fingeravtrykk eller ansikt: hva er best?",
    points: 2, block: "autentisering", tema: ["biometri", "fingeravtrykk", "ansiktsgjenkjenning", "presentasjonsangrep"],
    gjenganger: ["H2021-6.2", "H2022-8.2"],
    ordrett: true,
    oppgave: "<p>Compare the two <strong>biometric authentication</strong> methods <em>face recognition</em> and <em>fingerprint scan</em>. For each criterion mark the method that is <em>better</em> or <em>more secure</em>.</p><p><em>Points: 0.5 for each correct answer, -0.5 for each wrong, 0 for no selection</em></p><p><strong>Please mark the \"better\" / \"more secure\" method:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct answer, -0.5 for each wrong, 0 for no selection",
      regel: rg(0.5, -0.5, 2),
      regelMerknad: FORSIDE_MIN,
      kolonner: ["Finger", "Face"],
      multi: false,
      rader: [
        { s: "Uniqueness", svar: [0], explain: "<p>Fingeravtrykk er mer særpreget; selv eneggede tvillinger har ulike avtrykk, mens ansiktene ligner: <strong>Finger</strong>.</p>" },
        { s: "Permanence", svar: [0], explain: "<p>Ansiktet endrer seg med alder, vekt og skjegg; fingeravtrykket er stabilt gjennom livet: <strong>Finger</strong>.</p>" },
        { s: "Circumvention (e.g. presentation attacks)", svar: [0], explain: "<p>Ifølge fasiten er fingeravtrykk vanskeligere å lure. Et bilde av ansiktet er lett å skaffe; en falsk finger krever et avtrykk og mer arbeid: <strong>Finger</strong>.</p>" },
        { s: "Universality", svar: [1], explain: "<p>Nesten alle har et ansikt som kan avbildes, mens noen mangler lesbare fingeravtrykk (slitasje, skader): <strong>Face</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Finger vinner på særpreg, permanens og motstand mot forfalskning.", "Ansikt vinner på universalitet."],
    tips: ["Kurset kaller kravene universalitet, særpreg/entydighet, permanens/varighet og beskyttelse mot forfalskning (vranglære D8)."]
  });
  hv("H2019-7.3",
    "<p>Fingeravtrykket ditt er helt ditt eget og endrer seg ikke, men ikke alle har tydelige fingeravtrykk. Ansiktet har alle, men det forandrer seg, og et bilde av det er lett å få tak i.</p>",
    "<p>Biometriske metoder vurderes etter krav som universalitet (alle har egenskapen), særpreg (den skiller personer), permanens (den er stabil) og motstand mot forfalskning. Fasiten mener fingeravtrykk er best på de tre siste og ansikt på universalitet.</p>",
    "<p>Presentasjonsangrep (falsk finger, bilde, maske) håndteres med PAD (deteksjon av presentasjonsangrep), og FMR sier ingenting om denne robustheten. Moderne 3D-ansiktsgjenkjenning med dybdesensor er langt vanskeligere å lure enn enkle 2D-løsninger, så vurderingen av «circumvention» avhenger av utstyret.</p>");

  O.push({
    key: "H2019-7.4", year: Y, oppgave_nr: "Oppgave 7.4", del: D7,
    ark: "7.4 Authentication Tokens", title: "Fordelen med kode fra autentiseringstoken",
    points: 1, block: "autentisering", tema: ["OTP", "engangspassord", "token"],
    ordrett: true,
    oppgave: "<p>What is the main advantage of passwords/PINs generated by an <strong>authentication token</strong> compared to \"normal\" passwords/PINs?</p><p><em>Points: max 1</em></p><p><strong>Enter text here</strong></p>",
    inspera: {
      type: "K",
      regelTekst: "Points: max 1",
      regel: { min: 0, maks: 1 },
      deler: [{ del: "", poeng: 1, grense: "én setning" }]
    },
    avvik: null,
    losning: ["Koden er ny ved hvert forsøk (engangspassord), så en stjålet eller avlyttet kode kan ikke brukes igjen."],
    tips: ["Bruk ordet «engangspassord» (one-time password) og si hvorfor det hjelper: gjenbruk er umulig."]
  });
  IN.PERFEKT["H2019-7.4"] = {
    type: "eksamen",
    svar: [{ del: "", tekst: "<p>Koden er forskjellig for hvert autentiseringsforsøk (engangspassord), så en kode som blir avlyttet eller phishet, kan ikke brukes på nytt senere.</p>", poeng: ["Ny kode for hvert forsøk / engangspassord (1p)"] }],
    sensor: {
      deler: [{ del: "", fasit: "<p>The password/PIN is different for every authentication attempt (\"one time password\")</p>", kriterier: "<p>Points: max 1</p>" }],
      merknad: null
    }
  };
  hv("H2019-7.4",
    "<p>En billett som bare gjelder én gang, er verdiløs for den som finner den etterpå.</p>",
    "<p>Et token lager en ny kode hver gang (engangspassord). Om noen ser eller stjeler koden, kan den ikke brukes igjen, i motsetning til et vanlig passord som er det samme hver gang.</p>",
    "<p>Tokens lager koden fra en hemmelig nøkkel og enten et klokkeslett (tidsbasert), en teller eller en utfordring fra tjeneren. Det beskytter mot gjenbruk av avlyttede koder, men ikke helt mot sanntids-phishing, der angriperen bruker koden straks; passnøkler er phishing-resistente.</p>");

  /* ============================ PART 8: IDENTITY & ACCESS MANAGEMENT ============================ */

  O.push({
    key: "H2019-8.1", year: Y, oppgave_nr: "Oppgave 8.1", del: D8,
    ark: "8.1 Phases in Identity & Access Management", title: "IAM-faser: aktivitet til steg 1–6",
    points: 3, block: "iam", tema: ["IAM", "konfigureringsfase", "bruksfase", "autorisering", "tilgangskontroll"],
    gjenganger: ["H2018-8.1", "H2020-1.2", "H2021-1.3", "H2022-1.3", "H2023-14"],
    ordrett: true,
    oppgave: "<p>The diagram shows that the configuration phase and the operation phase of <strong>Identity &amp; Access Management</strong> (IAM) consists of steps which represent specific activities. Match each activity in the left column with the corresponding step in the diagram.</p><p><em>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3</em></p><p><strong>Match activity with step number:</strong></p>",
    figur: {
      beskrivelse: "To loddrette avrundede rammer med overskriftene «Configuration phase» (venstre) og «Operation phase» (høyre). Tvers over ligger to stiplede bånd: øverst et grønt bånd merket «Identity Management» i midten, under et gult bånd merket «Access Management». Venstre ramme har grå bokser 1 og 2 i det grønne båndet og boks 3 i det gule; piler 1 → 2 → 3. Høyre ramme har lilla bokser 4 og 5 i det grønne båndet og boks 6 i det gule; piler 4 → 5 → 6.",
      tekst: ["Configuration phase", "Operation phase", "Identity Management", "Access Management", "1", "2", "3", "4", "5", "6"]
    },
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3",
      regel: rg(0.5, -0.5, 3),
      kolonner: ["1", "2", "3", "4", "5", "6"],
      multi: false,
      rader: [
        { s: "Access Control", svar: [5], explain: "<p>Håndheving av policyen når brukeren ber om en ressurs, i bruksfasen og tilgangsdelen: <strong>6</strong>.</p>" },
        { s: "Authentication", svar: [4], explain: "<p>Brukeren beviser identiteten sin i bruksfasen: <strong>5</strong>.</p>" },
        { s: "Access Authorization", svar: [2], explain: "<p>Policyen spesifiseres i konfigureringsfasen, i tilgangsdelen: <strong>3</strong>.</p>" },
        { s: "Self Identification", svar: [3], explain: "<p>Brukeren oppgir først hvem hen er (bruker-ID): <strong>4</strong>.</p>" },
        { s: "Provisioning of credentials", svar: [1], explain: "<p>Etter registreringen får brukeren en autentikator (passord, token): <strong>2</strong>.</p>" },
        { s: "Registration of identities", svar: [0], explain: "<p>Alt starter med at identiteten registreres: <strong>1</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Konfigurering: 1 registrering, 2 klargjøring av autentikator, 3 tilgangsautorisering.", "Bruk: 4 identifisering, 5 autentisering, 6 tilgangskontroll."],
    tips: ["Speilbildet: registrering ↔ identifisering, autentikator ↔ autentisering, autorisering ↔ tilgangskontroll.", "Autorisering = spesifisere policy (konfigurering). Tilgangskontroll = håndheve den (bruk)."]
  });
  hv("H2019-8.1",
    "<p>Først blir du medlem av treningssenteret, får et kort, og de bestemmer hvilke rom du får gå i. Hver gang du kommer, sier du hvem du er, viser kortet, og døra slipper deg inn bare der du har lov.</p>",
    "<p>IAM har en konfigureringsfase (registrering, klargjøring av autentikator, tilgangsautorisering) og en bruksfase (identifisering, autentisering, tilgangskontroll). De to første stegene i hver fase hører til identitetshåndtering, det siste til tilgangshåndtering.</p>",
    "<p>Kurset skiller autorisering, som er å spesifisere tilgangspolicyen i konfigureringsfasen, fra tilgangskontroll, som er å håndheve den ved hver forespørsel. Identifisering og autentisering må komme før tilgangskontroll, fordi systemet må vite hvem som spør før det kan slå opp hva vedkommende har lov til.</p>");

  O.push({
    key: "H2019-8.2", year: Y, oppgave_nr: "Oppgave 8.2", del: D8,
    ark: "8.2 Federation I", title: "Føderert webinnlogging: rekkefølgen",
    points: 2, block: "iam", tema: ["føderering", "IdP", "SP", "omdirigering"],
    gjenganger: ["H2018-8.2"],
    ordrett: true,
    oppgave: "<p>Order the steps in a typical <strong>federated Web authentication</strong> scenario by entering the numbers 1 to 5.</p><p><em>Points: 2 total score for all correct, 0 if any error</em></p>",
    inspera: {
      type: "T",
      regelTekst: "Points: 2 total score for all correct, 0 if any error",
      regel: { riktig: 0, feil: 0, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Alt eller ingenting: 2 poeng bare når alle fem tallene er riktige, ellers 0.",
      tekst: "<ul><li>{0}. User authenticates to the Identity Provider.</li><li>{1}. User is redirected to the Service Provider.</li><li>{2}. User is redirected to the Identity Provider.</li><li>{3}. User gets access to the resource at the Service Provider.</li><li>{4}. User tries to access a resource at the Service Provider.</li></ul>",
      felt: [
        { etikett: "User authenticates to the Identity Provider", godta: ["3"], explain: "<p>Hos IdP-en logger brukeren inn: <strong>3</strong>.</p>" },
        { etikett: "User is redirected to the Service Provider", godta: ["4"], explain: "<p>Med sikkerhetsbilletten sendes brukeren tilbake til SP: <strong>4</strong>.</p>" },
        { etikett: "User is redirected to the Identity Provider", godta: ["2"], explain: "<p>SP-en kan ikke autentisere selv og sender brukeren til IdP-en: <strong>2</strong>.</p>" },
        { etikett: "User gets access to the resource at the Service Provider", godta: ["5"], explain: "<p>SP-en godtar billetten og gir tilgang: <strong>5</strong>.</p>" },
        { etikett: "User tries to access a resource at the Service Provider", godta: ["1"], explain: "<p>Det hele starter med at brukeren vil bruke en tjeneste: <strong>1</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["1 prøver tjenesten hos SP → 2 sendes til IdP → 3 logger inn hos IdP → 4 sendes tilbake til SP → 5 får tilgang."],
    tips: ["Samme oppgave som H2018 8.2. Tenk «Logg inn med …»-knappen: tjeneste → innlogging et annet sted → tilbake."]
  });
  hv("H2019-8.2",
    "<p>Du vil inn på en fest, men vakten sender deg til billettluka. Der viser du legitimasjon og får et armbånd. Så går du tilbake til vakten, som slipper deg inn fordi han stoler på armbåndet.</p>",
    "<p>Ved føderert innlogging stoler tjenesten (SP) på en identitetstilbyder (IdP). Brukeren prøver tjenesten, blir sendt til IdP-en, logger inn der, sendes tilbake med en sikkerhetsbillett, og SP-en gir tilgang.</p>",
    "<p>Omdirigeringene går via nettleseren. IdP-en utsteder en signert påstand (f.eks. SAML-assertion eller ID-token i OIDC) som SP-en verifiserer med IdP-ens offentlige nøkkel. SP-en ser aldri brukerens passord; tilliten bygger på en avtale mellom SP og IdP.</p>");

  O.push({
    key: "H2019-8.3", year: Y, oppgave_nr: "Oppgave 8.3", del: D8,
    ark: "8.3 Federation II", title: "Fødereringstypen til ID-porten",
    points: 1, block: "iam", tema: ["ID-porten", "føderering", "sentralisert identitet", "distribuert autentisering"],
    gjenganger: ["H2018-8.3", "H2021-7.1", "H2023-13"],
    ordrett: true,
    oppgave: "<p>Select the <strong>federation type</strong> of the Norwegian \"ID-porten\" system.</p><p><em>Points: 1 for correct, 0 for wrong, 0 for no selection</em></p><p><strong>Select an alternative:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Points: 1 for correct, 0 for wrong, 0 for no selection",
      regel: rg(1, 0, 1),
      alternativer: ["Centralized Identity + Distributed Authentication", "Distributed Identity + Distributed Authentication", "Distributed Identity + Centralized Authentication", "Centralized Identity + Centralized Authentication"],
      svar: 0,
      explain: [
        "<p>Riktig. Alle tjenestene bruker samme identitet (fødselsnummeret), mens autentiseringen gjøres av flere eID-leverandører (MinID, BankID, Buypass, Commfides).</p>",
        "<p>Feil. Identiteten er felles for alle tjenestene, ikke distribuert.</p>",
        "<p>Feil. Det er omvendt: identiteten er felles, autentiseringen er spredt på flere leverandører.</p>",
        "<p>Feil. Autentiseringen gjøres ikke av én enkelt instans; brukeren velger blant flere eID-er.</p>"
      ]
    },
    avvik: null,
    losning: ["Sentralisert identitet: fødselsnummeret er felles for alle offentlige tjenester.", "Distribuert autentisering: flere eID-leverandører."],
    tips: ["Vranglære C31: ID-porten har sentralisert identitet og distribuert autentisering."]
  });
  hv("H2019-8.3",
    "<p>Alle i Norge har ett personnummer som alle etatene bruker. Men du kan bevise at du er deg på flere måter: med BankID, MinID eller andre.</p>",
    "<p>ID-porten bruker én felles identitet for alle offentlige tjenester (fødselsnummeret), mens selve autentiseringen kan gjøres med ulike eID-er fra ulike leverandører. Derfor er identiteten sentralisert og autentiseringen distribuert.</p>",
    "<p>Fødereringstypen beskrives langs to akser: hvem som eier identitetene (én felles eller flere domener) og hvem som autentiserer (én instans eller flere). ID-porten formidler autentiseringen fra flere eID-leverandører, som er godkjent på ulike garantinivåer, til tjenestene, som alle bruker samme identifikator.</p>");

  O.push({
    key: "H2019-8.4", year: Y, oppgave_nr: "Oppgave 8.4", del: D8,
    ark: "8.4 Access Control I", title: "MAC, RBAC, ABAC eller DAC",
    points: 2, block: "iam", tema: ["DAC", "MAC", "RBAC", "ABAC", "tilgangskontrollmodeller"],
    gjenganger: ["H2021-7.3"],
    ordrett: true,
    oppgave: "<p>Mark for each statement appropriate access control method.</p><p><em>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection</em></p><p><strong>Please match the values:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection",
      regel: rg(0.5, -0.5, 2),
      regelMerknad: FORSIDE_MIN,
      kolonner: ["MAC", "RBAC", "ABAC", "DAC"],
      multi: false,
      rader: [
        { s: "The owner of an object can authorize access to his/her object", svar: [3], explain: "<p>Eieren bestemmer selv: <strong>DAC</strong> (skjønnsmessig tilgangskontroll).</p>" },
        { s: "Each user receives one or more roles", svar: [1], explain: "<p>Rettigheter knyttes til roller: <strong>RBAC</strong>.</p>" },
        { s: "Is used typically in military contexts", svar: [0], explain: "<p>Systemet bestemmer ut fra klarering og gradering: <strong>MAC</strong> (obligatorisk tilgangskontroll).</p>" },
        { s: "Is the most flexible models; all other model can be implemented using this", svar: [2], explain: "<p>Attributter kan uttrykke eier, rolle og klarering: <strong>ABAC</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["DAC: eier bestemmer. RBAC: roller. MAC: militært, klarering/gradering. ABAC: mest fleksibel."],
    tips: ["Ikke forveksle MAC som tilgangskontroll (mandatory) med MAC som meldingsautentiseringskode.", "Arket skriver «most flexible models; all other model» (grammatikk som i originalen)."]
  });
  hv("H2019-8.4",
    "<p>I DAC bestemmer du selv hvem som får låne sykkelen din. I RBAC får du nøkler etter jobben din. I MAC bestemmer et regelverk med hemmelighetsgrader alt. I ABAC kan regelen bygge på hva som helst: rolle, tid, sted.</p>",
    "<p>DAC lar eieren av en ressurs bestemme tilgangen. RBAC tildeler rettigheter via roller. MAC brukes i militære sammenhenger, der systemet håndhever tilgang ut fra klarering og gradering. ABAC bruker attributter og er så fleksibel at de andre modellene kan uttrykkes med den.</p>",
    "<p>DAC realiseres typisk med tilgangskontrollister. MAC bygger på merker: klarering på subjekter og gradering på objekter, f.eks. etter Bell-LaPadula (ikke les opp, ikke skriv ned). ABAC evaluerer regler over attributter ved subjekt, objekt, handling og kontekst, så en rolle eller en klarering kan bare være ett attributt blant flere.</p>");

  O.push({
    key: "H2019-8.5", year: Y, oppgave_nr: "Oppgave 8.5", del: D8,
    ark: "8.5 Access Control II", title: "Tilgangskontroll for et dokumentlager i en bedrift",
    points: 2, block: "iam", tema: ["DAC", "RBAC", "ABAC", "MAC", "valg av modell"],
    ordrett: true,
    oppgave: "<p>Your task is the development of an <strong>access control system</strong> for a new document storage system for your company. Which access control measures are reasonable?</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total",
      regel: rg(1, -1, 2),
      alternativer: ["DAC", "RBAC", "ABAC", "MAC"],
      svar: [0, 1],
      explain: [
        "<p>Riktig. I et dokumentlager er det naturlig at den som lager et dokument, kan dele det med andre.</p>",
        "<p>Riktig. Tilgang etter rolle (avdeling, stilling) passer godt i en bedrift.</p>",
        "<p>Ikke markert i fasiten. ABAC kan brukes, men er mer komplekst enn nødvendig for et vanlig dokumentlager. Se avvik.</p>",
        "<p>Feil. MAC med klareringer og graderinger er for rigid for en vanlig bedrift; det hører til militære og graderte miljøer.</p>"
      ]
    },
    avvik: "Fasiten merker bare DAC og RBAC. ABAC kan også forsvares (den er mest fleksibel og kan uttrykke både DAC og RBAC), men den er ikke markert. Med −1 for feil koster det å krysse av for ABAC på denne oppgaven.",
    losning: ["Vanlig bedrift: eier deler egne dokumenter (DAC) og tilgang etter rolle (RBAC).", "MAC er for rigid; ABAC er ikke med i fasiten."],
    tips: ["Tenk på hvordan delte disker fungerer i praksis: eieren deler, og avdelinger har rollebaserte mapper."]
  });
  hv("H2019-8.5",
    "<p>På et kontor kan du dele dine egne dokumenter med kolleger, og alle på økonomiavdelingen får se økonomimappa. Hemmelighetsstempler som i Forsvaret trengs ikke.</p>",
    "<p>For et dokumentlager i en vanlig bedrift er DAC (eieren deler sine dokumenter) og RBAC (tilgang etter rolle) naturlige valg. MAC er for strengt og tungvint utenfor militære og graderte miljøer. Fasiten tar ikke med ABAC.</p>",
    "<p>Mange dokumentsystemer kombinerer RBAC for grunnstrukturen (grupper og mapper) med DAC for deling av enkeltdokumenter. ABAC gir finere kontroll (f.eks. tid, sted, dokumentklassifisering), men krever et apparat for attributter og regler. MAC tar fra brukerne muligheten til å dele, noe som sjelden passer i en bedrift.</p>");

  /* ============================ PART 9: ETHICAL HACKING ============================ */

  O.push({
    key: "H2019-9.1", year: Y, oppgave_nr: "Oppgave 9.1", del: D9,
    ark: "9.1 Ethical Hacking", title: "Etisk hacker eller ulovlig hacker?",
    points: 2, block: "pentest", tema: ["etisk hacking", "pentest", "straffeloven § 204", "avtale", "rapport"],
    gjenganger: ["H2022-3.3", "H2025-13"],
    ordrett: true,
    oppgave: "<p>What separates an <strong>ethical hacker</strong> from an illegal hacker?</p><p><em>Points: max 2</em></p><p><strong>Fill in your answer here</strong></p>",
    inspera: {
      type: "E",
      regelTekst: "Points: max 2",
      regel: { min: 0, maks: 2 },
      regelMerknad: "Manuell retting etter skjønn. Arket oppgir ingen poengfordeling.",
      deler: [{ del: "", poeng: 2, grense: "to til fire setninger" }]
    },
    avvik: null,
    losning: ["Etisk: skriftlig avtale/tillatelse på forhånd, leter etter alle sårbarheter, skriver rapport, mål = bedre sikkerhet.", "Ulovlig: ingen tillatelse, går første/enkleste vei inn, ingen rapport, mål = skade, stjele, presse."],
    tips: ["Nevn tillatelsen først: uten skriftlig tillatelse er det straffbart etter straffeloven § 204, uansett hensikt.", "2026-lysarkene (d05) skiller også på motivasjon og praksis: pentesteren vil finne alle feil, angriperen én eller to veier inn og vil være usynlig."]
  });
  IN.PERFEKT["H2019-9.1"] = {
    type: "eksamen",
    svar: [{ del: "", tekst: "<p>Den etiske hackeren har skriftlig avtale og tillatelse fra eieren på forhånd, prøver å finne alle sårbarheter innenfor avtalt omfang og leverer en rapport med funn og anbefalinger. Målet er å forbedre sikkerheten. Den ulovlige hackeren har ingen tillatelse (handlingen er straffbar etter straffeloven § 204), tar den første eller enkleste veien inn, vil helst ikke bli oppdaget, og er ute etter å skade, stjele data eller presse offeret.</p>",
      poeng: ["Tillatelse/avtale vs. ingen tillatelse (1p)", "Mål og praksis: finne alt + rapport for å forbedre vs. skade/stjele/presse (1p)"] }],
    sensor: {
      deler: [{ del: "", fasit: "<p>Ethical Hacker: has a contract with the company, checks for all vulnerabilities, writes a report. Goal is to improve security. Motivation: professional<br>Illegal Hacker: has no contract, use first or easiest way in, writes no report. Goal is to do damage, extract information or blackmail / make service unavailable. Motivation: criminal</p>", kriterier: "<p>Points: max 2</p>" }],
      merknad: "Poengfordelingen i vårt svar (1 + 1) er vår antakelse; arket sier bare «max 2»."
    }
  };
  hv("H2019-9.1",
    "<p>En låsesmed som eieren har bedt om å teste låsene, prøver alle dørene og skriver ned hva som må fikses. En innbruddstyv finner én åpen dør, går inn i det stille og tar det han vil ha.</p>",
    "<p>Forskjellen ligger i tillatelse, mål og framgangsmåte. Den etiske hackeren (pentesteren) har skriftlig avtale på forhånd, leter etter alle svakheter og rapporterer dem for å bedre sikkerheten. Den ulovlige hackeren har ingen tillatelse, tar enkleste vei inn og er ute etter vinning eller skade.</p>",
    "<ul><li>Juridisk er tillatelsen avgjørende: å skaffe seg tilgang til et datasystem ved å bryte en beskyttelse eller på annen uberettiget måte er straffbart etter straffeloven § 204 (bot eller fengsel inntil 2 år), også med god hensikt.</li><li>Avtalen definerer omfang, tidsrom og metoder.</li><li>Praktisk er pentesten bredere og kortere (dager til uker), mens en angriper kan bruke måneder på å være usynlig og etablere varig tilgang.</li></ul>");

  O.push({
    key: "H2019-9.2", year: Y, oppgave_nr: "Oppgave 9.2", del: D9,
    ark: "9.2 Attack Phases", title: "Fasene i et angrep: rekkefølgen",
    points: 2, block: "pentest", tema: ["angrepsfaser", "rekognosering", "skanning", "fotfeste"],
    ordrett: true,
    oppgave: "<p>What is the typical <strong>order of steps</strong> when <strong>attacking a system</strong>? Enter a number between 1 and 4 for each step.</p><p><em>Points: 2 for all correct, 0 for any error</em></p>",
    inspera: {
      type: "T",
      regelTekst: "Points: 2 for all correct, 0 for any error",
      regel: { riktig: 0, feil: 0, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "Alt eller ingenting: 2 poeng bare når alle fire tallene er riktige, ellers 0.",
      tekst: "<p>{0} Gain access</p><p>{1} Information gathering</p><p>{2} Scanning for weakness</p><p>{3} Maintain access</p>",
      felt: [
        { etikett: "Gain access", godta: ["3"], explain: "<p>Sårbarheten utnyttes for å komme inn: <strong>3</strong>.</p>" },
        { etikett: "Information gathering", godta: ["1"], explain: "<p>Først samles informasjon om målet (rekognosering): <strong>1</strong>.</p>" },
        { etikett: "Scanning for weakness", godta: ["2"], explain: "<p>Så skannes målet for svakheter: <strong>2</strong>.</p>" },
        { etikett: "Maintain access", godta: ["4"], explain: "<p>Til slutt sikres tilgangen, f.eks. med bakdør: <strong>4</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["1 informasjonsinnhenting → 2 skanning etter svakheter → 3 skaffe tilgang → 4 beholde tilgang."],
    tips: ["2026-lysarkene (d05) deler en pentest/et angrep i planlegging, rekognosering, innledende tilgang, utvide tilgang, sikre fotfeste, gevinst og rapport. Rekkefølgen er den samme logikken som her.", "Sammenlign med Cyber Kill Chain (H2021 10.1), som starter med rekognosering og bevæpning."]
  });
  hv("H2019-9.2",
    "<p>En innbruddstyv finner først ut hvem som bor i huset, så går han rundt og ser etter åpne vinduer, så klatrer han inn, og til slutt lar han et vindu stå på gløtt så han kan komme tilbake.</p>",
    "<p>Et angrep går fra å samle informasjon om målet, via skanning etter svakheter, til å utnytte en svakhet for å komme inn, og til slutt å sikre at man kan komme tilbake.</p>",
    "<p>Rekognosering kan være passiv (åpne kilder) eller aktiv. Skanning kartlegger åpne porter, tjenester og versjoner. Innledende tilgang skjer med en utnyttelse eller stjålne legitimasjoner, og persistens etableres med bakdører eller ekstra kontoer. Pentestere følger samme faser, men innenfor en avtale og med rapport til slutt.</p>");

  O.push({
    key: "H2019-9.3", year: Y, oppgave_nr: "Oppgave 9.3", del: D9,
    ark: "9.3 Reverse Engineering", title: "Reversering: begrep til definisjon",
    points: 3, block: "pentest", tema: ["reversering", "disassemblering", "dekompilering", "statisk analyse", "dynamisk analyse"],
    ordrett: true,
    oppgave: "<p>Pair the keyword with its correct definition.</p><p><em>Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection, max 3 total</em></p><p><strong>Please match the values:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for wrong, 0 for no selection, max 3 total",
      regel: rg(0.5, -0.5, 3),
      kolonner: ["Instruction", "Decompile", "Register", "Static analysis", "Disassemble", "Dynamic analysis"],
      multi: false,
      rader: [
        { s: "Turn machine code into assembly language", svar: [4], explain: "<p>Maskinkode oversettes én til én til assemblerkode: <strong>Disassemble</strong>.</p>" },
        { s: "Analysing code without running program", svar: [3], explain: "<p>Koden leses uten å kjøre: <strong>Static analysis</strong>.</p>" },
        { s: "A single operation by the processor", svar: [0], explain: "<p>Én operasjon prosessoren utfører: <strong>Instruction</strong>.</p>" },
        { s: "Analysing code and behaviour by running program", svar: [5], explain: "<p>Programmet kjøres og atferden observeres: <strong>Dynamic analysis</strong>.</p>" },
        { s: "Small memory unit", svar: [2], explain: "<p>En liten, rask lagringsplass i prosessoren: <strong>Register</strong>.</p>" },
        { s: "Turn executable file into high-level language", svar: [1], explain: "<p>Fra kjørbar fil tilbake til (en tilnærming av) høynivåkode: <strong>Decompile</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Disassemble → assembler. Decompile → høynivåspråk.", "Statisk: uten å kjøre. Dynamisk: ved å kjøre.", "Instruksjon: én operasjon. Register: liten minneenhet."],
    tips: [UTE + "reversering er ikke på 2026-lysarkene (plan/vranglaere.md E). Sist på eksamen H2019.", "Statisk analyse nevnes i 2026 (d08) som tiltak mot bufferoverflyt, så skillet statisk/dynamisk er fortsatt nyttig."]
  });
  hv("H2019-9.3",
    "<p>Å disassemblere er å oversette maskinens tallkode til en liste med enkle kommandoer. Å dekompilere er å prøve å gjenskape den opprinnelige oppskriften. Statisk analyse er å lese oppskriften; dynamisk analyse er å lage maten og se hva som skjer.</p>",
    "<p>En disassembler gjør maskinkode om til assembler; en dekompilator prøver å gjenskape høynivåkode. Statisk analyse undersøker koden uten å kjøre den, dynamisk analyse kjører den og observerer atferden. En instruksjon er én prosessoroperasjon, og et register er en liten lagringsenhet i prosessoren.</p>",
    "<p>Reversering brukes til å analysere skadevare og finne sårbarheter i lukket programvare. Disassemblering er mekanisk og nøyaktig, mens dekompilering må gjette på variabelnavn og struktur som gikk tapt ved kompilering. Dynamisk analyse (f.eks. i en sandkasse eller debugger) avslører atferd som er skjult eller kryptert i den statiske koden.</p>");

  O.push({
    key: "H2019-9.4", year: Y, oppgave_nr: "Oppgave 9.4", del: D9,
    ark: "9.4 Buffer Overflow", title: "Bufferoverflyt: sant eller usant",
    points: 3, block: "system", tema: ["bufferoverflyt", "stakk", "returadresse", "inputvalidering"],
    gjenganger: ["H2020-5.2", "H2022-2.3"],
    ordrett: true,
    oppgave: "<p>Select for the statements about <strong>buffer overflow</strong> if they are true and false.</p><p><em>Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3 total</em></p>",
    inspera: {
      type: "M",
      regelTekst: "Points: 0.5 for each correct, -0.5 for each wrong, 0 for no selection, max 3 total",
      regel: rg(0.5, -0.5, 3),
      kolonner: ["True", "False"],
      multi: false,
      rader: [
        { s: "32-bit sytems are vulnerable to this exploit, but not 64-bit systems.", svar: [1], explain: "<p>Bufferoverflyt skyldes manglende lengdesjekk i programmet, ikke ordlengden: <strong>False</strong>.</p>" },
        { s: "Most buffer overflows are caused by user input.", svar: [0], explain: "<p>Typisk skriver programmet input (fra bruker eller nett) inn i en buffer uten å sjekke lengden: <strong>True</strong>.</p>" },
        { s: "A stack overflow overwrites more memory locations than intended by the system.", svar: [0], explain: "<p>Data skrives forbi bufferens slutt og overskriver nabominnet på stakken: <strong>True</strong>.</p>" },
        { s: "By filling an array with non-ASCII characters a stack overflow is triggered.", svar: [1], explain: "<p>Det er mengden data, ikke tegntypen, som gir overflyt: <strong>False</strong>.</p>" },
        { s: "An attacker can crash a program using this exploit.", svar: [0], explain: "<p>Overskrevne data eller returadresser får programmet til å krasje (tjenestenekt): <strong>True</strong>.</p>" },
        { s: "An attacker can divert the execution path using this exploit.", svar: [0], explain: "<p>Ved å overskrive returadressen kan angriperen styre hvor programmet hopper: <strong>True</strong>.</p>" }
      ]
    },
    avvik: null,
    losning: ["Sant: forårsaket av input, overskriver mer minne enn tiltenkt, kan krasje, kan styre programflyten.", "Usant: bare 32-bit, og ikke-ASCII-tegn som årsak."],
    tips: ["Arket skriver «sytems» (skrivefeil i originalen). «stack overflow» betyr her stakkbasert bufferoverflyt.", "Mottiltak i 2026 (d08): NX, stakk-kanarifugler, ASLR og sikrere språk/statisk analyse. De gjør utnyttelse vanskeligere, men retter ikke feilen (vranglære C37)."]
  });
  hv("H2019-9.4",
    "<p>Et glass kan bare romme så mye vann. Heller du i mer, renner det over og søler på papirene ved siden av. En slu person kan helle slik at sølet skriver en ny beskjed på papiret.</p>",
    "<p>En bufferoverflyt skjer når et program skriver mer data inn i en buffer enn den har plass til, typisk fra input som ikke er lengdesjekket. Dataene overskriver nabominnet. Det kan krasje programmet, eller angriperen kan overskrive returadressen og styre programflyten. Det gjelder både 32- og 64-bit, og det er lengden, ikke tegntypen, som avgjør.</p>",
    "<p>På stakken ligger lokale variabler, lagret rammepeker og returadresse etter hverandre. Skrives det forbi en lokal buffer, kan returadressen erstattes slik at funksjonen hopper til angriperens kode eller eksisterende kode (return-oriented programming). NX hindrer kjøring på stakken, kanarifugler oppdager overskriving før retur, og ASLR gjør adressene vanskelige å gjette.</p>");

  /* ============================ PART 10: APPLICATION SECURITY ============================ */

  var USIKKER_UTV = "OWASP Top 10 og DevSecOps har ingen egne 2026-lysark (plan/vranglaere.md E), men kan dekkes av boka; d08 nevner DevSecOps som mottiltak.";

  O.push({
    key: "H2019-10.1", year: Y, oppgave_nr: "Oppgave 10.1", del: D10,
    ark: "10.1 OWASP", title: "Hva står på OWASP Top 10?",
    points: 2, block: "utvikling", tema: ["OWASP Top 10", "injeksjon", "brukket autentisering"],
    gjenganger: ["H2018-10.4", "H2020-10.2", "H2022-4.2", "H2025-32"],
    ordrett: true,
    oppgave: "<p>Select attacks/threats/vulnerabilities that are included in the <strong>OWASP Top 10</strong> list.</p><p><em>Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for each wrong, 0 for no selection, max 2 total score",
      regel: rg(1, -1, 2),
      alternativer: ["Trojan horse", "Injection", "Open TCP port", "Broken Authentication"],
      svar: [1, 3],
      explain: [
        "<p>Feil. En trojaner er skadevare, ikke en sårbarhet i nettapplikasjoner.</p>",
        "<p>Riktig. Injeksjon (f.eks. SQL-injeksjon) har vært på lista i alle versjoner.</p>",
        "<p>Feil. En åpen port er et nettverksforhold, ikke en applikasjonssårbarhet på lista.</p>",
        "<p>Riktig. Var nr. 2 i 2017-lista; fra 2021 heter kategorien «Identification and Authentication Failures».</p>"
      ]
    },
    avvik: null,
    losning: ["OWASP Top 10 handler om sårbarheter i nettapplikasjoner: injeksjon og svak autentisering er med.", "Skadevare og nettverksporter er ikke med."],
    tips: ["Usikkert pensum H2026: " + USIKKER_UTV, "Navnene endres mellom versjoner; gjenkjenn kategoriene, ikke nummeret."]
  });
  hv("H2019-10.1",
    "<p>OWASP Top 10 er en liste over de vanligste hullene i nettsider, ikke en liste over virus eller åpne dører i nettverket.</p>",
    "<p>OWASP Top 10 lister de viktigste sikkerhetsrisikoene i nettapplikasjoner. Injeksjon og svak autentisering har vært med lenge. Trojanere (skadevare) og åpne TCP-porter (nettverk) hører ikke til lista.</p>",
    "<p>Lista oppdateres med noen års mellomrom og kategoriene slås sammen og får nye navn; f.eks. ble «Broken Authentication» til «Identification and Authentication Failures» i 2021, og XSS ble slått inn under injeksjon. Felles for kategoriene er at de er feil i applikasjonens design, kode eller konfigurasjon.</p>");

  O.push({
    key: "H2019-10.2", year: Y, oppgave_nr: "Oppgave 10.2", del: D10,
    ark: "10.2 Web Security", title: "Kommentarfelt på en nettside: hvilket angrep?",
    points: 2, block: "angrep", tema: ["XSS", "lagret XSS", "inputvalidering"],
    gjenganger: ["H2020-10.3"],
    ordrett: true,
    oppgave: "<p>A Web page allows visitors to leave comments, which can be read later by other users. Which attack might be possible through this feature (if not implemented correctly)?</p><p><em>Points: 2 for correct, 0 for wrong, 0 for no selection</em></p><p><strong>Select one alternative:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Points: 2 for correct, 0 for wrong, 0 for no selection",
      regel: rg(2, 0, 2),
      alternativer: ["SQL Injection", "DDoS", "XSS", "Broken Authentication"],
      svar: 2,
      explain: [
        "<p>Ikke fasitens svar. SQL-injeksjon er mulig hvis kommentaren settes rett inn i en SQL-spørring, men det typiske angrepet når andre brukere <em>leser</em> innholdet, er XSS.</p>",
        "<p>Feil. Kommentarfunksjonen gir ikke i seg selv tjenestenekt.</p>",
        "<p>Riktig. Lagret XSS: en kommentar med skript lagres og kjøres i nettleseren til alle som leser den.</p>",
        "<p>Feil. Autentisering har ingenting med kommentarfeltet å gjøre.</p>"
      ]
    },
    avvik: null,
    losning: ["Innhold fra én bruker vises til andre → lagret XSS."],
    tips: ["Nøkkelordet er «read later by other users»: det peker på lagret XSS. Samme oppgave kom igjen i H2020 10.3."]
  });
  hv("H2019-10.2",
    "<p>Noen skriver en lapp på oppslagstavla. Hvis lappen kan inneholde en skjult instruks som alle som leser den, adlyder, kan den som skrev lappen, styre leserne.</p>",
    "<p>Når innhold fra én bruker lagres og vises til andre uten at det renses, kan en angriper legge inn et skript. Skriptet kjøres i nettleseren til alle som leser kommentaren. Det er lagret XSS.</p>",
    "<p>Skriptet kjører med nettstedets opphav i offerets nettleser, så det kan lese informasjonskapsler som ikke er HttpOnly, utføre handlinger på vegne av brukeren eller vise falske skjemaer. Mottiltak er kontekstriktig koding av utdata, inputvalidering og Content Security Policy.</p>");

  O.push({
    key: "H2019-10.3", year: Y, oppgave_nr: "Oppgave 10.3", del: D10,
    ark: "10.3 Cloud Security", title: "Skysikkerhet: sant eller usant",
    points: 2, block: "utvikling", tema: ["sky", "SaaS", "IaaS", "flerleietaker", "tilgjengelighet", "personvern"],
    gjenganger: ["H2020-10.4"],
    ordrett: true,
    oppgave: "<p>Mark the statements regarding <strong>cloud computing security</strong> that are true.</p><p><em>Points: 1 for each correct, -1 for wrong, 0 for no selection, max 2 total</em></p><p><strong>Select one or more alternatives:</strong></p>",
    inspera: {
      type: "FF",
      regelTekst: "Points: 1 for each correct, -1 for wrong, 0 for no selection, max 2 total",
      regel: rg(1, -1, 2),
      alternativer: [
        "The use of multi-tenant environments increases the security.",
        "Office 365 is an example of Infrastructure-as-a-Service (IaaS).",
        "Storage of data in international data centers can be in conflict to data protection laws.",
        "Cloud computing offers the possibility for increased availability."
      ],
      svar: [2, 3],
      explain: [
        "<p>Feil. Flere kunder på samme infrastruktur gir nye risikoer (lekkasje mellom leietakere), ikke mer sikkerhet.</p>",
        "<p>Feil. Office 365 er ferdig programvare levert som tjeneste: SaaS.</p>",
        "<p>Riktig. Lagring i land utenfor EU/EØS kan komme i konflikt med personvernregler for overføring av personopplysninger.</p>",
        "<p>Riktig. Skyleverandører har redundans på tvers av datasentre og kan skalere kapasiteten.</p>"
      ]
    },
    avvik: null,
    losning: ["Sant: personvernkonflikt ved internasjonal lagring, mulighet for høyere tilgjengelighet.", "Usant: flerleietaker øker ikke sikkerheten; Office 365 er SaaS."],
    tips: [UTE + "sky (IaaS/SaaS) er ikke på 2026-lysarkene (plan/vranglaere.md E). Sist på eksamen H2020."]
  });
  hv("H2019-10.3",
    "<p>Å leie leilighet i en stor blokk gir vaktmester og reservestrøm, men du deler vegger med fremmede. Og hvis blokka står i et annet land, gjelder kanskje andre regler for tingene dine.</p>",
    "<p>Skyen kan gi høyere tilgjengelighet gjennom redundans, men flerleietakermiljøer gir også nye risikoer. Lagring i utenlandske datasentre kan bryte med personvernregler. Office 365 er programvare som tjeneste (SaaS), ikke infrastruktur (IaaS).</p>",
    "<ul><li>I IaaS leier kunden virtuelle maskiner og drifter alt fra operativsystemet og opp; i SaaS leverer leverandøren hele applikasjonen.</li><li>Flerleietaker betyr delt maskinvare og programvare, så isolasjonen mellom kunder blir en kritisk kontroll.</li><li>Overføring av personopplysninger ut av EU/EØS krever et gyldig overføringsgrunnlag.</li></ul>");

  O.push({
    key: "H2019-10.4", year: Y, oppgave_nr: "Oppgave 10.4", del: D10,
    ark: "10.4 DevSecOps", title: "DevSecOps: fordeler og shift-left",
    points: 4, block: "utvikling", tema: ["DevSecOps", "shift-left", "innebygd sikkerhet"],
    gjenganger: ["H2022-4.1"],
    ordrett: true,
    oppgave: "<p>Name one <strong>technical</strong> and one <strong>business benefit</strong> of DevSecOps.</p><p><em>Points: max 2</em></p><p>Explain (shortly) the meaning of <strong>Shift-Left</strong> in DevSecOps.</p><p><em>Points: max 2</em></p>",
    inspera: {
      type: "E",
      regelTekst: "Points: max 2 · Points: max 2",
      regel: { min: 0, maks: 4 },
      regelMerknad: "Manuell retting, to svarfelt à maks 2. Delbetegnelsene 1 og 2 er våre.",
      deler: [
        { del: "1.", poeng: 2, sporsmal: "<p>Name one technical and one business benefit of DevSecOps.</p>", grense: "to korte punkter" },
        { del: "2.", poeng: 2, sporsmal: "<p>Explain (shortly) the meaning of Shift-Left in DevSecOps.</p>", grense: "én til to setninger" }
      ]
    },
    avvik: null,
    losning: ["Teknisk: feil fanges tidlig og er mindre og enklere å rette.", "Forretning: raskere levering av funksjonalitet, mindre tid brukt på brannslukking.", "Shift-left: flytte sikkerhetsarbeidet tidligere (til venstre) i utviklingsløpet, i stedet for å rette sårbarheter i drift."],
    tips: ["Usikkert pensum H2026: " + USIKKER_UTV, "Hold delene adskilt: én teknisk og én forretningsmessig fordel, ikke to av samme slag."]
  });
  IN.PERFEKT["H2019-10.4"] = {
    type: "eksamen",
    svar: [
      { del: "1.", tekst: "<p>Teknisk: sårbarheter oppdages tidlig, mens de er små og enkle å rette, og problemer løses raskere når de oppstår. Forretning: raskere og tryggere levering av ny funksjonalitet, og mer tid til å skape verdi i stedet for å rette feil i drift.</p>",
        poeng: ["Én teknisk fordel (1p)", "Én forretningsmessig fordel (1p)"] },
      { del: "2.", tekst: "<p>Shift-left betyr å flytte sikkerhetsarbeidet tidlig i utviklingsløpet (til venstre på tidslinja): sikkerhet bygges inn i krav, design, koding og testing, i stedet for at sårbarheter i koden fjernes i driftsfasen.</p>",
        poeng: ["Sikkerhet tidlig, i utviklingsfasen (1p)", "I motsetning til å rette sårbarheter i drift (1p)"] }
    ],
    sensor: {
      deler: [
        { del: "1.", fasit: "<p>technical: e.g. less complex problems to fix, faster resolution of issues when they arise<br>business: e.g. faster delivery of features, more time available to add value</p>", kriterier: "<p>Points: max 2</p>" },
        { del: "2.", fasit: "<p>Shift-left means integrating security in the development phase in contrast to removing vulnerabilities in code during the operations phase.</p>", kriterier: "<p>Points: max 2</p>" }
      ],
      merknad: "Fordelingen 1 + 1 innen hver del er vår antakelse; arket sier bare «max 2» per del."
    }
  };
  hv("H2019-10.4",
    "<p>Det er mye billigere å flytte en vegg på tegningen enn etter at huset er bygd. Shift-left betyr å tenke på sikkerhet mens man tegner, ikke etter at folk har flyttet inn.</p>",
    "<p>DevSecOps bygger sikkerhet inn i hele utviklings- og driftsløpet. Teknisk gir det mindre og enklere feil å rette, fordi de oppdages tidlig. For virksomheten gir det raskere levering og mer tid til å lage verdi. Shift-left betyr at sikkerhetsarbeidet flyttes tidlig i løpet, til utviklingen, i stedet for å rette sårbarheter i drift.</p>",
    "<p>«Venstre» viser til tidslinja krav → design → koding → test → drift. Konkrete grep er trusselmodellering i design, statisk analyse og avhengighetssjekk i byggeløpet, og automatiske sikkerhetstester før utrulling. Kostnaden ved å rette en feil øker jo senere den oppdages.</p>");

  /* ============================ SETT SAMMEN ============================ */

  BANK["H2019"] = {
    year: "H2019", dato: "11.12.2019", varighet: "4 timer", hjelpemidler: "Translation of security terms",
    forside: "<p><strong>University of Oslo - Faculty of Mathematics and Natural Sciences</strong><br><strong>Digital exam in IN2120 \"Informasjonssikkerhet\" (Autumn 2019)</strong></p><p><strong>Date and time:</strong> 11 December 2019, 09:00h - 13:00h</p><p><strong>Permitted materials:</strong> Translation of security terms</p><p>Please regard the following directions:</p><ul><li>The exam contains 43 questions with a total of 100 points (= 100 %).</li><li>The questions are grouped under 10 parts that correspond approximately to 10 of the lectures in this course.</li><li>Each question states explicitly the marking scheme. There can be negative points for incorrect answers/selections. However, the overall score for the total question is always at least 0 points (even if the sum over all answers is negative).</li><li>Be concise. When answering a question, it is often sufficient to write a single expression or sentence to describe each concept that the question asks for.</li><li>In the navigation bar on the bottom of the screen, blue bars indicate completed questions/parts.</li><li>Answers can be written in English or in Norwegian.</li></ul>",
    deler: [
      { navn: D1, poeng: 10 }, { navn: D2, poeng: 10 }, { navn: D3, poeng: 10 }, { navn: D4, poeng: 10 },
      { navn: D5, poeng: 10 }, { navn: D6, poeng: 10 }, { navn: D7, poeng: 10 }, { navn: D8, poeng: 10 },
      { navn: D9, poeng: 10 }, { navn: D10, poeng: 10 }
    ],
    merknad: "Settet er på engelsk (eksamen gis bare på norsk fra H2020). 43 oppgaver, 10 deler à 10 poeng, sum «Maximum marks» = 100, som forsiden sier. Utskriften har tekstlag; hakene i rettenøkkelen er kontrollert visuelt side for side. Flere temaer er utenfor pensum H2026 (GDPR, hendelsesrespons, trusseltre/ALE, reversering, sky); det står i tipsene på hver oppgave.",
    oppgaver: O
  };
})();
