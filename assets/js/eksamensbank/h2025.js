/* IN2120 · eksamensbank H2025. Kilde: UiO, IN2120 eksamen H2025 (Inspera-utskrift med rettenøkkel og
   retteinstrukser, behandlet som sensorveiledning). Oppgavetekst og fasit ordrett.
   Våre forklaringer (explain/losning/tips/hvorfor/svar) med egne ord. */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BANK = (window.IN_EXAM_BANK = window.IN_EXAM_BANK || {});
  IN.PERFEKT = IN.PERFEKT || {};

  var Y = "H2025";
  var D1 = "Del 1: Generelt",
    D2 = "Del 2: Kryptografi og PKI",
    D3 = "Del 3: Angrepsvektorer og skadevare",
    D4 = "Del 4: Nettverkssikkerhet",
    D5 = "Del 5: Autentisering og IAM",
    D6 = "Del 6: ISMS og risikostyring",
    D7 = "Del 7: Sikker utvikling",
    D8 = "Del 8: Fysisk sikkerhet",
    D9 = "Del 9: Bobs passord";

  BANK[Y] = {
    year: Y, dato: "16.12.2025", varighet: "4 timer", hjelpemidler: "Ingen",
    forside:
      "<p><strong>Informasjon om eksamenen</strong></p>" +
      "<p>Avsluttende eksamen i IN2120 Informasjonssikkerhet (Høst 2025).</p>" +
      "<p>Dato og tidspunkt: 16.desember 2025, kl.15:00 - 19:00 (4 timer).</p>" +
      "<p>Ingen hjelpemidler er tillatt.</p>" +
      "<p>Merk følgende:</p><ul>" +
      "<li>Oppgavene i denne eksamenen er gruppert i ni deler. Den første delen dekker grunnleggende aspekter ved informasjonssikkerhet på tvers av pensum, mens de øvrige delene er fra utvalgte områder av pensum.</li>" +
      "<li>Det er mulig å oppnå totalt 100 poeng (= 100%) ved å besvare alle oppgavene korrekt.</li>" +
      "<li>Man kan navigere frem og tilbake mellom oppgavene.</li>" +
      "<li>Skåring for hver oppgave angis eksplisitt. Det kan gis negative poeng for feil svar/valg, men total poengsum for hele oppgaven er minimum 0 (selv om summen over alle svarene er negativ).</li>" +
      "<li>Vær kortfattet når du skriver tekst som svar på en tekstoppgave. Svaret kan skrives på norsk, svensk, dansk eller engelsk.</li>" +
      "<li>Les oppgaveteksten nøye og spesielt der du skal fylle inn verdier i en tekstboks.</li>" +
      "<li>I navigasjonslinjen nederst på skjermen indikeres fullførte oppgaver med blå søyler.</li></ul>" +
      "<p><strong>Tips!</strong> Siden du kan gå frem og tilbake kan det være lurt og først svare på oppgavene du syns er lette, og deretter gå tilbake til vanskelige oppgaver hvis du har tid.</p>" +
      "<p><strong>Lykke til, hilsen Audun, Åvald og Nils!</strong></p>",
    slutt: "<p>Slutt på eksamen. Takk for nå, og ha god jul når du er ferdig med siste eksamen!</p>",
    deler: [
      { navn: D1, poeng: 13 }, { navn: D2, poeng: 15 }, { navn: D3, poeng: 15 },
      { navn: D4, poeng: 14 }, { navn: D5, poeng: 8 }, { navn: D6, poeng: 8 },
      { navn: D7, poeng: 9 }, { navn: D8, poeng: 9 }, { navn: D9, poeng: 9 }
    ],
    merknad: "Delpoeng er ikke oppgitt i arket; delsummene er summen av «Maks poeng». Sum = 100, som forsiden sier. 55 av 100 poeng rettes manuelt (fritekst).",
    oppgaver: []
  };
  var O = BANK[Y].oppgaver;
  function add(o) { o.year = Y; o.ordrett = true; if (o.avvik === undefined) o.avvik = null; O.push(o); }
  function P(key, obj) { IN.PERFEKT[Y + "-" + key] = obj; }

  /* =====================================================================
     DEL 1: GENERELT
     ===================================================================== */

  add({
    key: "H2025-1", oppgave_nr: "Oppgave 1", del: D1,
    ark: "Begrepsforståelse", title: "Usikkerhet, unøyaktighet, utrygghet, uvisshet",
    points: 2, block: "generelt", tema: ["sikkerhet", "trygghet", "visshet", "begreper"],
    gjenganger: ["H2023-1", "H2024-2"],
    oppgave: "<p>Velg begrepet som betegner sutuasjonen ved hvert utsagn. Hvert begrep skal velges bare én gang.</p>" +
      "<p>Poeng: 0,5p for riktig, -0,5p for feil, 0p for ubesvart, maks 2p, min 0p.</p><p><strong>Finn de som passer sammen:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5p for riktig, -0,5p for feil, 0p for ubesvart, maks 2p, min 0p.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Usikkerhet", "Unøyaktighet", "Utrygghet", "Uvisshet"],
      multi: false,
      rader: [
        { s: "Kjørehastighet = 200 km/t", svar: [2],
          explain: "<p>Så høy fart gir stor fare for ulykker. Det handler om <em>trygghet</em> (safety), altså vern mot utilsiktet skade, så situasjonen er <strong>utrygg</strong>. Det er ingen angriper her, derfor er det ikke usikkerhet i sikkerhetsfaglig betydning.</p>" },
        { s: "Knipse mynt og kron med sannsynliget p = 0,5", svar: [3],
          explain: "<p>Utfallet er rent tilfeldig, og du kan ikke vite det på forhånd. Det er mangel på <em>visshet</em> (certainty), altså <strong>uvisshet</strong>.</p>" },
        { s: "Passord = 123456", svar: [0],
          explain: "<p>Et passord som står øverst på alle gjettelister, kan en angriper knekke med en gang. Trusselen er en tilsiktet handling, og det er det kurset kaller <em>sikkerhet</em> (security). Situasjonen er altså <strong>usikker</strong>.</p>" },
        { s: "Måle avstand med øyemål", svar: [1],
          explain: "<p>Øyemål gir et omtrentlig tall, ikke et presist. Problemet er at målingen er <strong>unøyaktig</strong>. Det har ingenting med angrep, ulykker eller tilfeldighet å gjøre.</p>" }
      ]
    },
    losning: [
      "Spør for hver rad: finnes det en angriper (sikkerhet), en ulykke (trygghet), et tilfeldig utfall (visshet) eller et unøyaktig tall (nøyaktighet)?",
      "Hvert begrep brukes bare én gang, så du kan krysse ut etter hvert."
    ],
    tips: [
      "Sikkerhet/trygghet/visshet går igjen hvert år (H23 1, H24 2, H25 1). Lær forskjellen: sikkerhet mot tilsiktede handlinger, trygghet mot ulykker, visshet om å vite.",
      "Begrepsparet står ikke på lysarkene for 2026, men det har vært på eksamen tre år på rad."
    ],
    avvik: "Skrivefeil i arket («sutuasjonen», «sannsynliget») er beholdt ordrett. Påvirker ikke fasit."
  });
  P("1", {
    type: "eksamen",
    hvorfor: {
      eli5: "<ul><li>Kjører du veldig fort, kan du krasje: det er utrygt.</li><li>Kaster du en mynt, vet du ikke hva du får: det er uvisst.</li><li>Bruker du et passord alle kan gjette, kan en tyv komme inn: det er usikkert.</li><li>Måler du med øynene, blir tallet litt feil: det er unøyaktig.</li></ul>",
      normal: "<p>De fire ordene er negasjoner av fire ulike egenskaper. Sikkerhet handler om vern mot noen som vil skade med vilje, trygghet om vern mot uhell, visshet om at man vet utfallet, og nøyaktighet om hvor presis en måling er. Finn hvilken av disse som mangler i hver situasjon.</p>",
      teknisk: "<p>På norsk dekker ordet «sikkerhet» både security og safety, så eksamen tvinger deg til å skille dem.</p><ul><li>Security (sikkerhet) gjelder tilsiktede trusler med en aktør, som en angriper som gjetter 123456.</li><li>Safety (trygghet) gjelder utilsiktede hendelser, som en bilulykke.</li><li>Certainty (visshet) gjelder kunnskap om utfall; p = 0,5 betyr maksimal uvisshet for et binært utfall.</li><li>Accuracy (nøyaktighet) gjelder målefeil.</li></ul>"
    }
  });

  add({
    key: "H2025-2", oppgave_nr: "Oppgave 2", del: D1,
    ark: "Sikkerhetsmålsettinger", title: "Hvilket KIT-mål brytes?",
    points: 3, block: "generelt", tema: ["KIT", "konfidensialitet", "integritet", "tilgjengelighet"],
    gjenganger: ["H2021-1.1", "H2022-1.1", "H2023-3", "H2024-3"],
    oppgave: "<p>Indiker hvilken sikkerhetsmålsetting som typisk brytes som resultat av hvert angrep.</p>" +
      "<p><em>Poeng: 0,5p for hver riktig; -0,5p for feil, 0p for ubesvart; maks 3p; minimum 0p.</em></p>" +
      "<p><strong>Indiker hvilket sikkerhetsmål som typisk brytes:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5p for hver riktig; -0,5p for feil, 0p for ubesvart; maks 3p; minimum 0p.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Konfidensialitet", "Integritet", "Tilgjengelighet"],
      multi: false,
      rader: [
        { s: "Lese av pakkestrøm i wireshark", svar: [0],
          explain: "<p>Å lese andres trafikk betyr at noen uten lov ser dataene. Det er brudd på <strong>konfidensialitet</strong>. (Er trafikken kryptert og angriperen ikke kan dekryptere, brytes i praksis ingenting, men oppgaven spør om det som typisk skjer.)</p>" },
        { s: "Kryptovirus (AES-256)", svar: [2],
          explain: "<p>Løsepengevirus krypterer filene dine slik at <em>du</em> ikke får brukt dem. Det er brudd på <strong>tilgjengelighet</strong>. Krypteringen gjør ikke at noen andre får lest dataene. Felle: mange svarer K fordi det står «krypto».</p>" },
        { s: "DDoS-angrep", svar: [2],
          explain: "<p>Et tjenestenektangrep oversvømmer tjenesten så legitime brukere ikke slipper til: brudd på <strong>tilgjengelighet</strong>.</p>" },
        { s: "Hashkollisjoner i signaturer", svar: [1],
          explain: "<p>En signatur signerer hashen av meldingen. Finner noen en annen melding med samme hash, gjelder signaturen også for den falske meldingen. Da kan innhold byttes ut uten at det oppdages: brudd på <strong>integritet</strong> (og autentisitet), ikke konfidensialitet.</p>" },
        { s: "Installere en keylogger", svar: [0],
          explain: "<p>En keylogger registrerer det du skriver, for eksempel passord, og sender det til angriperen. Hemmelig informasjon lekker: brudd på <strong>konfidensialitet</strong>.</p>" },
        { s: "Endre eksamensbesvarelsen din etter at du har sendt den inn", svar: [1],
          explain: "<p>Innlevert besvarelse skal ikke kunne endres uten lov. Endring uten lov er brudd på <strong>integritet</strong>.</p>" }
      ]
    },
    losning: [
      "Spør: blir data lest av feil person (K), endret uten lov (I) eller gjort ubrukelige (T)?",
      "Kryptovirus og DDoS gir T; avlesing og keylogger gir K; hashkollisjon og etterendring gir I."
    ],
    tips: [
      "Klassiske feller: kryptovirus er T (ikke K), og hashkollisjon i signatur er I (ikke K).",
      "Rader som «DDoS», «kryptovirus» og «hashkollisjoner i signaturer» har gått igjen flere år."
    ]
  });
  P("2", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Tenk på dagboka di. Noen leser den: hemmeligheten er brutt (K). Noen skriver i den: innholdet er ødelagt (I). Noen låser den inne: du får ikke brukt den (T).</p>",
      normal: "<p>KIT er de tre sikkerhetsmålene. For hvert angrep spør du hva angriperen oppnår: lese (konfidensialitet), endre (integritet) eller hindre bruk (tilgjengelighet). Kryptovirus er lurt fordi ordet «krypto» får deg til å tenke på hemmelighold, men skaden er at eieren mister tilgang.</p>",
      teknisk: "<ul><li>Wireshark og keylogger gir uautorisert innsyn (K).</li><li>Kryptovirus og DDoS hindrer autorisert bruk (T); ved dobbel utpressing med datalekkasje kommer K i tillegg, men det er ikke det typiske målet her.</li><li>En kollisjon H(M) = H(M′) gjør at Sig(H, K<sup>A</sup><sub>priv</sub>) også validerer M′, så dataintegritet og dataautentisitet faller.</li><li>Å endre en innlevert besvarelse er en uautorisert modifikasjon (I).</li></ul>"
    }
  });

  add({
    key: "H2025-3", oppgave_nr: "Oppgave 3", del: D1,
    ark: "Krypteringsalgoritmer", title: "Symmetrisk eller asymmetrisk algoritme",
    points: 2, block: "krypto", tema: ["symmetrisk", "asymmetrisk", "AES", "RSA", "ECC", "Caesar"],
    oppgave: "<p>Angi om disse krypteringsalgoritmene er symmetriske eller asymmetriske</p>" +
      "<p>0.5 poeng for hvert riktig svar, -0.5 for gale, 0 for ubesvart. Maks 2 poeng, min 0.</p><p><strong>Finn de som passer sammen:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "0.5 poeng for hvert riktig svar, -0.5 for gale, 0 for ubesvart. Maks 2 poeng, min 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Symmetrisk", "Asymmetrisk"],
      multi: false,
      rader: [
        { s: "ECC", svar: [1], explain: "<p>Elliptisk kurve-kryptografi bruker et nøkkelpar (privat og offentlig) og er <strong>asymmetrisk</strong>. Den gir like god sikkerhet som RSA med mye kortere nøkler.</p>" },
        { s: "RSA", svar: [1], explain: "<p>RSA er det klassiske eksempelet på <strong>asymmetrisk</strong> krypto: offentlig nøkkel til kryptering og verifisering, privat nøkkel til dekryptering og signering.</p>" },
        { s: "AES", svar: [0], explain: "<p>AES er et blokkchiffer der samme hemmelige nøkkel brukes til å kryptere og dekryptere: <strong>symmetrisk</strong>.</p>" },
        { s: "Caesar", svar: [0], explain: "<p>Caesarchifferet forskyver hver bokstav like mange plasser. Forskyvningen er nøkkelen, og den samme brukes begge veier: <strong>symmetrisk</strong> (og helt usikkert, bare 25 mulige nøkler).</p>" }
      ]
    },
    losning: ["Én delt hemmelig nøkkel = symmetrisk (AES, Caesar). Nøkkelpar privat/offentlig = asymmetrisk (RSA, ECC)."],
    tips: ["Andre asymmetriske navn som kan dukke opp: Diffie-Hellman (nøkkelutveksling), DSA/ECDSA (signatur), ML-KEM og ML-DSA (postkvante)."]
  });
  P("3", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Symmetrisk er som en vanlig husnøkkel: samme nøkkel låser og låser opp, og begge må ha en kopi. Asymmetrisk er som en postkasse: alle kan putte brev inn (offentlig), men bare eieren har nøkkelen til å åpne (privat).</p>",
      normal: "<p>Symmetriske algoritmer (AES, Caesar) bruker én hemmelig nøkkel som begge parter deler. Asymmetriske algoritmer (RSA, ECC) bruker et nøkkelpar der den ene delen kan være offentlig. Symmetrisk er raskt; asymmetrisk løser problemet med å dele nøkler.</p>",
      teknisk: "<p>Symmetrisk: C = E(M, K) og M = D(C, K) med samme K. Asymmetrisk: C = E(M, K<sup>B</sup><sub>pub</sub>) og M = D(C, K<sup>B</sup><sub>priv</sub>). RSA bygger på at faktorisering er vanskelig, ECC på diskret logaritme på elliptiske kurver. Begge knekkes av en stor kvantedatamaskin, mens AES bare svekkes moderat.</p>"
    }
  });

  add({
    key: "H2025-4", oppgave_nr: "Oppgave 4", del: D1,
    ark: "Boksterminologi for testing", title: "Pentest uten informasjon: svartboks",
    points: 1, block: "pentest", tema: ["pentest", "svartboks", "hvitboks", "gråboks"],
    gjenganger: ["H2022-4.3", "H2023-4", "H2024-4"],
    oppgave: "<p>I planleggingen av en pentest får du ingen informasjon om systemet du skal teste Hva kalles denne typen testing?</p>" +
      "<p><em>Poeng: 1 for riktig; 0 for feil eller ubesvart.</em></p><p><strong>Velg ett alternativ:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: ["Hvitboks-testing (white box)", "Gulboks-testing (yellow box)", "Svartboks-testing (Blackbox)", "Gråboks-testing (grey box)"],
      svar: 2,
      explain: [
        "<p>Hvitboks betyr at testeren får full innsikt: kildekode, arkitektur, kontoer. Det motsatte av det oppgaven beskriver.</p>",
        "<p>«Gulboks» er ikke et etablert begrep i pentesting. Det er en distraktor.</p>",
        "<p>Riktig. <strong>Svartboks</strong>: du ser ikke inn i boksen og starter uten informasjon, slik en ekstern angriper ville gjort.</p>",
        "<p>Gråboks er en mellomting: testeren får noe informasjon, for eksempel en vanlig brukerkonto eller nettverkskart.</p>"
      ]
    },
    losning: ["Ingen informasjon = du ser ikke inn i boksen = svartboks."],
    tips: ["Boksoppgaven har kommet hvert år fra H22 med ulik farge (hvit, svart, grå, svart). Lær alle tre."]
  });
  P("4", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Tenk deg en eske du ikke kan se inn i. Du må prøve deg fram utenfra. Det er en svart boks.</p>",
      normal: "<p>Fargen sier hvor mye testeren vet på forhånd: svart = ingenting, grå = litt, hvit = alt. Svartboks etterligner en angriper utenfra, men tar lengre tid fordi testeren må kartlegge alt selv.</p>",
      teknisk: "<ul><li>Svartboks-testing starter med rekognosering (OSINT, portskanning) som en ekstern trusselaktør.</li><li>Hvitboks gir kildekode og konfigurasjon og finner flere feil per time, men simulerer ikke en uinformert angriper.</li><li>Gråboks ligner en innsider eller en angriper som allerede har en brukerkonto.</li></ul><p>Uansett boks krever pentest skriftlig avtale på forhånd (d05); uten samtykke er det innbrudd etter straffeloven § 204.</p>"
    }
  });

  add({
    key: "H2025-5", oppgave_nr: "Oppgave 5", del: D1,
    ark: "OS privilegienivåer", title: "Hypervisormodus: hvilke nivåer kan nås?",
    points: 1, block: "system", tema: ["privilegienivå", "ring", "hypervisor", "kjerne"],
    gjenganger: ["H2023-5", "H2024-5"],
    oppgave: "<p>En prosess kjører i <strong>hypervisormodus</strong>. Kryss av for hvert privilegienivå om prosessen kan få tilgang til ressurser (f.eks. data og prosess).</p>" +
      "<p><em>Poeng: 0.5p for hver riktig; -0.5p for feil, 0p for ubesvart; maks 1p; minimum 0p.</em></p>" +
      "<p><strong>For hvert privilegienivå, indiker om en bruker-prosess kan få tilgang.</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0.5p for hver riktig; -0.5p for feil, 0p for ubesvart; maks 1p; minimum 0p.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 1 },
      kolonner: ["Kan få tilgang", "Kan IKKE få tilgang"],
      multi: false,
      rader: [
        { s: "Nivå -1", svar: [0], explain: "<p>Hypervisoren kjører selv på nivå −1. En prosess når alltid sitt eget nivå: <strong>kan få tilgang</strong>.</p>" },
        { s: "Nivå 0", svar: [0], explain: "<p>Nivå 0 er OS-kjernen i en virtuell maskin. Hypervisoren har mer makt enn kjernen (lavere tall = mer privilegium), så den <strong>kan få tilgang</strong>.</p>" }
      ]
    },
    losning: [
      "Hypervisor = nivå −1, kjerne = 0, bruker = 3.",
      "En prosess kan nå sitt eget nivå og alle nivåer med høyere tall. Fra −1 når du både −1 og 0."
    ],
    tips: ["Les overskriften: prosessen kjører i hypervisormodus. Linja over tabellen sier «bruker-prosess», men fasit følger overskriften."],
    avvik: "Oppgaveteksten sier at prosessen kjører i «hypervisormodus», mens linja over tabellen sier «indiker om en bruker-prosess kan få tilgang». Fasit (begge «Kan få tilgang») stemmer med hypervisormodus. For en brukerprosess (nivå 3) ville svaret vært «Kan IKKE» for begge."
  });
  P("5", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Tenk på en bygning: vaktmesteren (hypervisor) har nøkkel til alle rom, også sjefens kontor (kjernen). Den som kjører i hypervisormodus kommer seg inn overalt.</p>",
      normal: "<p>Privilegienivåene er ringer: −1 hypervisor, 0 kjerne, 3 brukerprosesser. Jo lavere tall, desto mer makt. En prosess kan nå sitt eget nivå og alle nivåer «utenfor» (høyere tall). Hypervisoren på −1 når derfor både −1 og 0.</p>",
      teknisk: "<p>Maskinvarevirtualisering (f.eks. Intel VT-x) legger til en modus under ring 0, ofte kalt ring −1, der hypervisoren kontrollerer gjestenes kjerner. Kjernen i en gjest kjører i ring 0 og brukerprosesser i ring 3. Tilgang går bare fra lavere til høyere ringnummer; går man motsatt vei trengs et kontrollert kall (systemkall eller hyperkall).</p>"
    }
  });

  add({
    key: "H2025-6", oppgave_nr: "Oppgave 6", del: D1,
    ark: "Krypto- og PKI-begreper", title: "PKI, symmetrisk, asymmetrisk eller hash?",
    points: 2, block: "krypto", tema: ["PKI", "symmetrisk", "asymmetrisk", "hashfunksjon"],
    gjenganger: ["H2023-6", "H2024-6"],
    oppgave: "<p>Hvert utsagn nedenfor passer til et bestemt begrep innenfor krypto/PKI. Indiker hvilket begrep hvert utsagn passer best til.</p>" +
      "<p><em>Poeng: 0,5p for riktig;, -0,5p for feil, 0p for ubesvart; maks 2p; minimum 0p.</em></p>" +
      "<p><strong>Indiker hva hvert utsagn passer beste med.</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5p for riktig;, -0,5p for feil, 0p for ubesvart; maks 2p; minimum 0p.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["PKI", "Symmetrisk kryptering", "Asymmetrisk kryptering", "Hash-funksjon"],
      multi: false,
      rader: [
        { s: "AES-512 er et eksempel på", svar: [1], explain: "<p>AES er <strong>symmetrisk kryptering</strong>. Merk: AES finnes bare med 128-, 192- og 256-bits nøkler. «AES-512» finnes ikke, men fasit vil ha symmetrisk.</p>" },
        { s: "OS lagrer gjerne passord ved hjelp av", svar: [3], explain: "<p>Operativsystemet lagrer ikke passordet, men en saltet <strong>hash</strong> av det. Ved innlogging hashes det du skriver og sammenlignes med lagret verdi.</p>" },
        { s: "Deler offentlige nøkler", svar: [0], explain: "<p>Hele poenget med <strong>PKI</strong> er å distribuere offentlige nøkler på en pålitelig måte, bundet til navn i sertifikater signert av en CA.</p>" },
        { s: "Er den raskeste måten å kryptere store mengder data", svar: [1], explain: "<p><strong>Symmetrisk</strong> kryptering er mange ganger raskere enn asymmetrisk. Derfor brukes asymmetrisk bare til å etablere en symmetrisk øktnøkkel (hybrid kryptering).</p>" }
      ]
    },
    losning: ["AES = symmetrisk; passordlagring = hash; distribusjon av offentlige nøkler = PKI; store datamengder = symmetrisk."],
    tips: ["Hash er ikke kryptering: den har ingen nøkkel og kan ikke dekrypteres."],
    avvik: "«AES-512» finnes ikke (AES har 128/192/256-bits nøkler og 128-bits blokk). Fasit (symmetrisk kryptering) er likevel riktig for «AES». Skrivefeil «riktig;,» og «passer beste med» beholdt ordrett."
  });
  P("6", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>AES er en rask felles lås. Passord lagres som et «fingeravtrykk» (hash), ikke som selve passordet. PKI er telefonkatalogen for offentlige nøkler.</p>",
      normal: "<p>Symmetrisk kryptering (AES) er rask og brukes til selve dataene. Hashfunksjoner er enveis og brukes til passordlagring. PKI sørger for at du får riktig offentlig nøkkel til riktig navn via sertifikater.</p>",
      teknisk: "<ul><li>AES har 128-bits blokk og nøkler på 128, 192 eller 256 bit.</li><li>Passord lagres som Hash(passord, salt), helst med en bevisst treg funksjon.</li><li>Asymmetriske operasjoner er størrelsesordener tregere enn AES, så hybrid kryptering kombinerer dem.</li><li>PKI binder (domene)navn og offentlig nøkkel i X.509-sertifikater signert av en CA.</li></ul>"
    }
  });

  add({
    key: "H2025-7", oppgave_nr: "Oppgave 7", del: D1,
    ark: "NSM", title: "NSM: forkortelse og hendelsesenhet",
    points: 2, block: "generelt", tema: ["NSM", "NCSC", "NorCERT", "grunnprinsipper"],
    oppgave: "<p>A) Hva står forkortelsen NSM (og nå snakker vi om den norske organisasjonen som blant annet står bak grunnprinsippene) for? (Hint: Svaret er to ord, og kan skrives på bokmål eller nynorsk).</p>" +
      "<p>B) Hva heter NSMs nasjonale koordinerende enhet for sikkerhetshendelser med hensyn til deteksjon, hendelsesrespons og koordinering? Svar enten forkortelsen eller fullt navn (begge gir lik uttelling). Hint: NorCERT-funksjonen er en del av dette, men ikke i navnet.</p>" +
      "<p>Begge deloppgavene gir 1p for riktig svar, 0p for galt eller ubesvart, maks 2p, minimum 0p.</p>",
    inspera: {
      type: "T",
      regelTekst: "Begge deloppgavene gir 1p for riktig svar, 0p for galt eller ubesvart, maks 2p, minimum 0p.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 2 },
      tekst: "<p>A) Svar {0} her.</p><p>B) {1}</p>",
      felt: [
        { etikett: "A) NSM står for", godta: ["Nasjonal sikkerhetsmyndighet", "Nasjonalt tryggingsorgan", "Nasjonal sikkerhetsmyndighet (NSM)", "Nasjonalt tryggingsorgan (NSM)"], naer: { "NSM": "Det er forkortelsen selv. Svaret er hva den står for: Nasjonal sikkerhetsmyndighet." },
          explain: "<p><strong>Nasjonal sikkerhetsmyndighet</strong> (nynorsk: Nasjonalt tryggingsorgan) er direktoratet for forebyggende nasjonal sikkerhet og står bak NSMs grunnprinsipper for IKT-sikkerhet.</p>" },
        { etikett: "B) NSMs nasjonale enhet for hendelser", godta: ["NCSC", "Nasjonalt cybersikkerhetssenter", "National cyber security center", "National cyber security centre", "NCSC (Nasjonalt cybersikkerhetssenter)", "Nasjonalt cybersikkerhetssenter (NCSC)", "NSM NCSC", "NSM Nasjonalt cybersikkerhetssenter", "Norwegian National Cyber Security Centre", "Norwegian National Cyber Security Center", "National Cyber Security Centre (NCSC)"], naer: { "NorCERT": "NorCERT-funksjonen er en del av enheten, men ikke navnet (som hintet sier). Enheten heter NCSC, Nasjonalt cybersikkerhetssenter." },
          explain: "<p><strong>NCSC</strong> (Nasjonalt cybersikkerhetssenter) er NSMs senter for deteksjon, varsling og koordinering av hendelseshåndtering. Det tidligere NorCERT inngår i NCSC.</p>" }
      ]
    },
    losning: ["A: Nasjonal sikkerhetsmyndighet.", "B: NCSC, Nasjonalt cybersikkerhetssenter."],
    tips: ["Tekstfelt rettes automatisk mot en liste. Skriv det fulle, vanlige navnet og stav det nøyaktig."]
  });
  P("7", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>NSM er statens etat som passer på at Norge er trygt mot digitale og andre angrep. NCSC er «brannstasjonen» deres for dataangrep.</p>",
      normal: "<p>NSM (Nasjonal sikkerhetsmyndighet) gir råd og krav om sikkerhet, blant annet grunnprinsippene for IKT-sikkerhet. Når noe skjer, er det NCSC (Nasjonalt cybersikkerhetssenter) som oppdager, varsler og koordinerer håndteringen.</p>",
      teknisk: "<p>NSM er fagmyndighet for forebyggende nasjonal sikkerhet. NCSC er NSMs operative kapasitet for deteksjon, hendelsesrespons og koordinering, og har overtatt NorCERT-funksjonen (nasjonalt CERT). Grunnprinsippene for IKT-sikkerhet er NSMs tiltaksbank, sammenlignbar med NIST CSF og ISO/IEC 27002.</p>"
    }
  });

  /* =====================================================================
     DEL 2: KRYPTOGRAFI OG PKI
     ===================================================================== */

  add({
    key: "H2025-8", oppgave_nr: "Oppgave 8", del: D2,
    ark: "Blokkchiffer - operasjonsmoduser", title: "Gjenkjenn CBC, CTR og ECB",
    points: 3, block: "krypto", tema: ["blokkchiffer", "ECB", "CBC", "CTR", "operasjonsmodus"],
    gjenganger: ["H2023-20", "H2024-17"],
    oppgave: "<p>For blokkchiffer brukes ulike operasjonsmoduser for kryptering av mer enn én blokk. Nedenfor ser du diagrammer som illustrerer kryptering for <strong>tre ulike</strong> operasjonsmoduser. Sett riktig navn på hver av dem.</p>" +
      "<p><em>Poeng: 1p for hver riktig; -1p for feil; 0p for ubesvart; maks 3p; minimum 0p.</em></p>",
    figur: {
      beskrivelse: "Tre krypteringsdiagrammer side om side, hvert med tre blokker. Røde bokser = klartekst M₁, M₂, M₃ eller tellere; blå bokser merket «E» = krypteringsfunksjonen; mørke bokser med rød kant = chiffertekst C₁, C₂, C₃; en nøkkel K (blå nøkkel-ikon) med linje til alle E-boksene. " +
        "VENSTRE: M₁, M₂, M₃ øverst. M₁ går inn i en XOR-sirkel (⊕) sammen med «IV»; M₂ går inn i en XOR sammen med C₁ (pil fra C₁ opp til XOR-en), M₃ i en XOR med C₂. Resultatet går inn i E, ut kommer C₁, C₂, C₃. Svarfelt under diagrammet. " +
        "MIDTEN: Øverst tre gule bokser T₁, T₂, T₃ (tellere) som går inn i E (med K). Utgangen fra hver E går ned i en XOR-sirkel, der M₁, M₂, M₃ kommer inn fra venstre. Resultatet er C₁, C₂, C₃. Svarfelt under. " +
        "HØYRE: M₁, M₂, M₃ går rett inn i hver sin E (med K), og ut kommer C₁, C₂, C₃. Ingen XOR, ingen kobling mellom blokkene. Svarfelt under. " +
        "Over diagrammene står fire dra-bokser: «Electronic Code Book (ECB)», «Cipher Block Chaining (CBC)», «Output Feedback (OFB)», «Counter Mode (CTR)».",
      tekst: ["M₁", "M₂", "M₃", "IV", "K", "E", "C₁", "C₂", "C₃", "T₁", "T₂", "T₃"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 1p for hver riktig; -1p for feil; 0p for ubesvart; maks 3p; minimum 0p.",
      regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
      tekst: null,
      bank: ["Electronic Code Book (ECB)", "Cipher Block Chaining (CBC)", "Output Feedback (OFB)", "Counter Mode (CTR)"],
      felt: [
        { etikett: "Venstre diagram (IV og kjeding)", svar: 1,
          explain: "<p>IV i første blokk og forrige chiffertekst XOR-et inn i neste klartekst før E: <strong>CBC</strong>. C₁ = E(IV ⊕ M₁, K), C₂ = E(C₁ ⊕ M₂, K).</p>" },
        { etikett: "Midtre diagram (tellere T₁–T₃)", svar: 3,
          explain: "<p>Tellerverdier krypteres, og resultatet XOR-es med klarteksten: <strong>CTR</strong> (tellermodus). C₁ = E(T₁, K) ⊕ M₁.</p>" },
        { etikett: "Høyre diagram (hver blokk for seg)", svar: 0,
          explain: "<p>Hver klartekstblokk krypteres helt uavhengig med samme nøkkel: <strong>ECB</strong>. C₁ = E(M₁, K). Like klartekstblokker gir like chiffertekstblokker, derfor regnes ECB som usikker.</p>" }
      ]
    },
    losning: [
      "Se etter kjennetegn:<ul><li>IV + kjeding fra forrige C = CBC</li><li>tellere T inn i E og XOR etterpå = CTR</li><li>ingenting mellom blokkene = ECB</li></ul>",
      "OFB er en distraktor (ikke vist). Bruker du den, mister du 1 poeng."
    ],
    tips: ["Minuspoengene er like store som plusspoengene her (±1). Er du usikker på én, kan blankt lønne seg.", "Operasjonsmodus-diagram har kommet H23, H24 og H25."]
  });
  P("8", {
    type: "eksamen",
    hvorfor: {
      eli5: "<ul><li>ECB låser hver bit av brevet for seg, så like biter ser like ut.</li><li>CBC blander inn forrige låste bit før den neste låses, som en kjede.</li><li>CTR lager en hemmelig «støy» fra et telleverk og blander den med brevet.</li></ul>",
      normal: "<p>Operasjonsmoduser sier hvordan et blokkchiffer brukes på mange blokker.</p><ul><li>ECB krypterer hver blokk alene og lekker mønstre.</li><li>CBC kjeder blokkene ved å XOR-e inn forrige chiffertekst (første blokk med IV).</li><li>CTR krypterer en teller og XOR-er resultatet med klarteksten, så den fungerer som et strømchiffer.</li></ul>",
      teknisk: "<ul><li>ECB: Cᵢ = E(Mᵢ, K).</li><li>CBC: C₁ = E(IV ⊕ M₁, K) og videre med forrige Cᵢ₋₁ i stedet for IV; IV skal være tilfeldig, men trenger ikke være hemmelig.</li><li>CTR: Cᵢ = E(Tᵢ, K) ⊕ Mᵢ og Mᵢ = E(Tᵢ, K) ⊕ Cᵢ, så bare E brukes også ved dekryptering, og blokkene kan behandles parallelt.</li></ul><p>Tellerverdier må aldri gjenbrukes med samme nøkkel.</p>"
    }
  });

  add({
    key: "H2025-9", oppgave_nr: "Oppgave 9", del: D2,
    ark: "Nøkler", title: "Krypter og signer: hvilken nøkkel?",
    points: 3, block: "krypto", tema: ["asymmetrisk kryptering", "digital signatur", "privat nøkkel", "offentlig nøkkel"],
    gjenganger: ["H2024-19"],
    oppgave: "<p>I denne oppgaven skal du flytte inn riktig begrep på riktig plass i teksten.</p>" +
      "<p>Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, maks 3, minimum 0. Boksene kan gjenbrukes.</p>",
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, maks 3, minimum 0. Boksene kan gjenbrukes.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      tekst: "<p>Bob {0} en melding med Alice sin {1} nøkkel. Deretter signerer han med sin {2} nøkkel. og sender over meldingen. Alice {3} signaturen med Bobs {4} nøkkel, og dekrypterer meldingen med sin {5} nøkkel.</p>",
      bank: ["krypterer", "private", "signerer", "offentlige", "verifiserer", "hemmelige"],
      felt: [
        { etikett: "Bob … en melding", svar: 0, explain: "<p>Bob <strong>krypterer</strong> meldingen (Alice dekrypterer den til slutt).</p>" },
        { etikett: "Alice sin … nøkkel", svar: 3, explain: "<p>Man krypterer med mottakerens <strong>offentlige</strong> nøkkel, så bare Alice (med sin private) kan dekryptere.</p>" },
        { etikett: "signerer han med sin … nøkkel", svar: 1, explain: "<p>Man signerer med sin egen <strong>private</strong> nøkkel. Bare Bob har den, og derfor beviser signaturen at det var han.</p>" },
        { etikett: "Alice … signaturen", svar: 4, explain: "<p>Mottakeren <strong>verifiserer</strong> signaturen.</p>" },
        { etikett: "med Bobs … nøkkel", svar: 3, explain: "<p>Signaturen verifiseres med avsenderens <strong>offentlige</strong> nøkkel, som alle kan ha.</p>" },
        { etikett: "dekrypterer meldingen med sin … nøkkel", svar: 1, explain: "<p>Alice dekrypterer med sin <strong>private</strong> nøkkel, motstykket til den offentlige nøkkelen Bob krypterte med.</p>" }
      ]
    },
    losning: [
      "Kryptering: mottakers offentlige inn, mottakers private ut.",
      "Signatur: avsenders private inn, avsenders offentlige ut.",
      "«hemmelige» hører til symmetrisk krypto og er en distraktor; «signerer» står allerede i teksten."
    ],
    tips: ["Huskeregel: den som skal gjøre noe bare én person kan (dekryptere, signere), bruker den private nøkkelen."],
    avvik: "Punktumet i «… nøkkel. og sender over meldingen» står slik i arket og er beholdt."
  });
  P("9", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Alice har en åpen postkasse (offentlig nøkkel) og en nøkkel bare hun har (privat). Bob legger brevet i Alices postkasse. Så setter Bob sitt unike segl på (privat), og alle kan sjekke seglet mot Bobs offentlige mønster.</p>",
      normal: "<p>Asymmetrisk kryptering gir konfidensialitet: krypter med mottakers offentlige nøkkel, dekrypter med mottakers private. Digital signatur gir autentisitet og ubenektelighet: signer med avsenders private nøkkel, verifiser med avsenders offentlige.</p>",
      teknisk: "<p>C = E(M, K<sup>A</sup><sub>pub</sub>), S = Sig(H, K<sup>B</sup><sub>priv</sub>) der H = Hash(M). Alice beregner H = Ver(S, K<sup>B</sup><sub>pub</sub>) og sjekker H =? H′ der H′ = Hash(M′), og får M = D(C, K<sup>A</sup><sub>priv</sub>). Den vanlige feilen er å tro at man signerer med offentlig nøkkel; da kunne hvem som helst ha signert.</p>"
    }
  });

  add({
    key: "H2025-10", oppgave_nr: "Oppgave 10", del: D2,
    ark: "Kerckhoffs prinsipp", title: "Kerckhoffs' prinsipp",
    points: 3, block: "krypto", tema: ["Kerckhoffs", "nøkkel", "algoritme", "hemmelighold"],
    oppgave: "<p>Hva er Kerckhoffs' prinsipp?</p><p>Forklar kort med egne ord, skriv maks fem setninger.</p><p>Maks 3p.</p>",
    inspera: {
      type: "E",
      regelTekst: "Maks 3p.",
      regel: { min: 0, maks: 3 },
      deler: [{ del: "", poeng: 3, sporsmal: "<p>Hva er Kerckhoffs' prinsipp?</p>", grense: "maks fem setninger" }]
    },
    losning: [
      "Si hva prinsippet krever: systemet skal være sikkert selv om fienden kjenner alt unntatt nøkkelen.",
      "Si eksplisitt at nøkkelen må holdes hemmelig (gir det tredje poenget)."
    ],
    tips: ["Felle: prinsippet sier det motsatte av «hold algoritmen hemmelig». Hemmelig design er «security by obscurity».", "Kerckhoffs står ikke på lysarkene for 2026, men var på eksamen H25 (3 p)."]
  });
  P("10", {
    type: "skjonn",
    svar: [{ del: "", tekst: "<p>Kerckhoffs' prinsipp sier at et kryptosystem skal være sikkert selv om fienden kjenner alt om hvordan det virker, altså algoritmen og utstyret. Sikkerheten skal ikke hvile på at designet er hemmelig. Det eneste som må holdes hemmelig, er nøkkelen. Da kan algoritmen publiseres og granskes, og blir en nøkkel kjent, bytter man bare nøkkelen.</p>",
      poeng: ["Forstått prinsippet: sikkerheten skal ikke avhenge av hemmelig algoritme (2p)", "Nøkkelen må holdes hemmelig (1p)"] }],
    hvorfor: {
      eli5: "<p>Alle vet hvordan en hengelås virker, men det hjelper ikke uten nøkkelen. En god lås er trygg selv om tyven har sett tegningene.</p>",
      normal: "<p>Hvis sikkerheten krever at ingen kjenner algoritmen, faller alt den dagen noen lekker eller reverserer den. Med Kerckhoffs' prinsipp er det bare nøkkelen som er hemmelig. Algoritmen kan offentliggjøres og testes av mange, og en lekket nøkkel kan byttes.</p>",
      teknisk: "<p>Prinsippet (Auguste Kerckhoffs, 1883) er grunnlaget for moderne offentlig kryptografi: AES, RSA og SHA er åpne standarder, og styrken måles i størrelsen på nøkkelrommet. Hemmelig design er «security by obscurity». Shannon formulerte det samme som «fienden kjenner systemet».</p>"
    },
    sensor: {
      deler: [{ del: "",
        fasit: "<p>Kerckhoffs prinsipp lyder: «Utformingen av apparatet skal ikke kreve hemmelighold, og tap av apparatet til fienden skal ikke ødelegge sikkerheten for korrespondentene .»</p><p>Kryptografisk sikkerhet skal følgelig ikke være avhengig av algoritmen holdes hemmelig, kun krypteringsnøkkelen må holdes hemmelig.</p>",
        kriterier: "<p>To poeng for å ha forstått prinsippet, og ett poeng ekstra for å få nevne at kryptonøkler må være hemmelige.</p>" }],
      merknad: "Ordrett fra svarfeltet, også «avhengig av algoritmen holdes hemmelig» (et «at» mangler)."
    }
  });

  add({
    key: "H2025-11", oppgave_nr: "Oppgave 11", del: D2,
    ark: "Vigenèrechiffer", title: "Vigenère: nøkkelrom og svakhet",
    points: 3, block: "krypto", tema: ["Vigenère", "nøkkelrom", "frekvensanalyse", "klassisk krypto"],
    oppgave: "<p>Du skal sende en norsk bok over Internett og ønsker å kryptere den. Du velger, som i oblig1, å bruke Vigenèrechiffer.</p>" +
      "<p>A) Tall og spesialtegn holdes her utenfor, og det er ingen forskjell mellom store og små bokstaver. Hvor stort blir dette nøkkelrommet? (Du trenger selvsagt ikke regne det ut, men sett opp begrepet.) Denne delen gir ett poeng.</p>" +
      "<p>B) Hva er svakheten med denne type chiffer - kort sagt, hvordan kan det eventuelt knekkes?<br>Skriv maks tre linjer her. Denne delen gir maks to poeng.</p>",
    inspera: {
      type: "E",
      regelTekst: "Denne delen gir ett poeng. / Denne delen gir maks to poeng.",
      regel: { min: 0, maks: 3 },
      deler: [
        { del: "A)", poeng: 1, sporsmal: "<p>Hvor stort blir dette nøkkelrommet?</p>", grense: "uttrykk, ikke tall" },
        { del: "B)", poeng: 2, sporsmal: "<p>Hva er svakheten med denne type chiffer - kort sagt, hvordan kan det eventuelt knekkes?</p>", grense: "maks tre linjer" }
      ]
    },
    losning: [
      "A: Det norske alfabetet har 29 bokstaver. Hver av de K nøkkelbokstavene kan være hvilken som helst av dem: 29<sup>K</sup>.",
      "B: Frekvensanalyse. Finn nøkkellengden, del teksten i K strømmer som hver er et Caesarchiffer, og bruk bokstavfrekvenser (e er vanligst på norsk)."
    ],
    tips: ["Skriv 29 og ikke 26: oppgaven sier en norsk bok. 26<sup>K</sup> gir bare halvt poeng.", "Si at nøkkelrommet er et uttrykk med nøkkellengden K, ikke et fast tall."],
    avvik: "Sensorteksten sier at Vigenère «knekkes trivielt med frekvensanalyse». I praksis må nøkkellengden finnes først (f.eks. med Kasiski-metoden eller ved å se etter gjentakelser); deretter er hver posisjon et Caesarchiffer som knekkes med frekvensanalyse. Teksten godkjenner alle forklaringer av frekvensanalyse."
  });
  P("11", {
    type: "skjonn",
    svar: [
      { del: "A)", tekst: "<p>Norsk alfabet har 29 bokstaver (a–z, æ, ø, å). Med en nøkkel på K bokstaver blir nøkkelrommet 29<sup>K</sup>.</p>", poeng: ["29^K med forklaring (1p)"] },
      { del: "B)", tekst: "<p>Vigenère er bare K Caesarchiffer som gjentas. Når nøkkellengden K er funnet (f.eks. via gjentatte mønstre), kan hver K-te bokstav knekkes med frekvensanalyse, fordi bokstavfordelingen i norsk (mange e-er) skinner gjennom.</p>", poeng: ["Frekvensanalyse nevnt og forklart (2p)"] }
    ],
    hvorfor: {
      eli5: "<p>Vigenère flytter bokstavene med et kodeord som gjentas. Siden «e» er så vanlig på norsk, ser du etter bokstaven som dukker opp oftest på hver plass i kodeordet, og da kan du gjette deg fram.</p>",
      normal: "<p>Nøkkelrommet er antall mulige nøkler: 29 valg for hver av K posisjoner gir 29<sup>K</sup>. Svakheten er at nøkkelen gjentas. Når man vet nøkkellengden, kan man dele teksten i grupper som hver er forskjøvet like mye, og knekke dem med frekvensanalyse.</p>",
      teknisk: "<p>Vigenère er et polyalfabetisk substitusjonschiffer: Cᵢ = (Mᵢ + k<sub>i mod K</sub>) mod 29, der k<sub>j</sub> er nøkkelbokstav nr. j og K er nøkkellengden. Nøkkelrommet 29<sup>K</sup> kan være stort, men chifferet har dårlig spredning (diffusion): statistikken i klarteksten bevares innenfor hver nøkkelposisjon.</p><p>Kasiski-undersøkelse (avstand mellom gjentatte trigrammer) eller koinsidensindeks gir K; frekvensanalyse gir deretter hver nøkkelbokstav.</p><p>Med en tilfeldig nøkkel like lang som meldingen, brukt én gang, blir det en engangsnøkkel og ubrytbart.</p>"
    },
    sensor: {
      deler: [
        { del: "A)", fasit: "<p>A) Vigenérechifferet benytter et sett standard alfabeter som er forskjøvet, der første bokstav er lik hver bokstav i kodeordet. Anta alfabeter med 29 bokstaver og at kodeordet (nøkkellengden) har K bokstaver. Størrelsen på nøkkelrommet blir da 29^K.</p>",
          kriterier: "<p>Dette gir 1 poeng, siden oppgaven presiserer en norsk bok - så gi 0.5 poeng hvis de skriver 26^K og sier at det er 26 bokstaver (som jo er engelsk...) 1 poeng.</p>" },
        { del: "B)", fasit: "<p>B) Vigenèrechiffer knekkes trivielt med frekvensanalyse. Bokstaven 'e' utgjør for eks 15,38% av det norske språket, noe som gjør den til den mest frekvente bokstaven.</p>",
          kriterier: "<p>Godkjenn frekvensanalyse, samt alle forklaringer om hva frekvensnanalyse er, eller hvordan det kan gjøres. 2 poeng.</p>" }
      ],
      merknad: "Skrivefeil «Vigenérechifferet» og «frekvensnanalyse» beholdt ordrett. Se avvik om nøkkellengden."
    }
  });

  add({
    key: "H2025-12", oppgave_nr: "Oppgave 12", del: D2,
    ark: "Fremoverhemmelighold", title: "Fremoverhemmelighold: DH vs. hybrid kryptering",
    points: 3, block: "krypto", tema: ["fremoverhemmelighold", "Diffie-Hellman", "hybrid kryptering", "øktnøkkel"],
    gjenganger: ["H2021-5.3", "H2023-17"],
    oppgave: "<p>Forklar (på maks fem linjer) hvorfor Diffie-Hellman gir fremoverhemmelighold, og hvorfor hybrid kryptering ikke gjør det.</p>",
    inspera: {
      type: "E",
      regelTekst: "Maks poeng: 3",
      regel: { min: 0, maks: 3 },
      deler: [{ del: "", poeng: 3, sporsmal: "<p>Forklar hvorfor Diffie-Hellman gir fremoverhemmelighold, og hvorfor hybrid kryptering ikke gjør det.</p>", grense: "maks fem linjer" }]
    },
    losning: [
      "DH: ny, tilfeldig øktnøkkel for hver økt, laget av hemmelige delnøkler som slettes etterpå. Øktene er uavhengige av hverandre.",
      "Langtidsnøkkelen (brukt til å signere/autentisere) er aldri med i selve nøkkelen, så den kan ikke brukes til å finne gamle øktnøkler.",
      "Hybrid: alle øktnøkler sendes kryptert med mottakers samme offentlige nøkkel. Lekker den private nøkkelen senere, kan alle lagrede økter dekrypteres."
    ],
    tips: ["Sensor gir poeng for: øktnøkler, at de er uavhengige, og at én nøkkel ikke kan brukes til å utlede andre. Få med alle tre.", "Si også hvorfor hybrid ikke gir det; det er halve spørsmålet."],
    avvik: "Modellsvaret forklarer bare DH-delen (unike, uavhengige øktnøkler) og nevner verken hybrid kryptering eller at en langtidsnøkkel som lekker senere ikke avslører gamle økter. Det anbefalte svaret dekker begge."
  });
  P("12", {
    type: "skjonn",
    svar: [{ del: "", tekst: "<p>Med Diffie-Hellman lages en ny øktnøkkel g<sup>ab</sup> [mod p] for hver økt av tilfeldige delnøkler som slettes etterpå. Øktnøklene er derfor uavhengige, og én kan ikke brukes til å utlede en annen; langtidsnøkkelen brukes bare til å signere. Ved hybrid kryptering sendes hver øktnøkkel kryptert med mottakers faste offentlige nøkkel, så den som senere stjeler den private nøkkelen, kan dekryptere alle lagrede økter.</p>",
      poeng: ["Øktnøkler (1p)", "Uavhengige av hverandre (1p)", "Kan ikke utlede tidligere/senere nøkler (1p)"] }],
    hvorfor: {
      eli5: "<p>Med DH lager dere en ny engangsnøkkel hver gang og kaster den etterpå. Stjeler noen husnøkkelen din senere, hjelper det ikke å åpne de gamle boksene. Med hybrid ligger alle de gamle nøklene låst med samme hovednøkkel. Stjeles hovednøkkelen, kan alt åpnes.</p>",
      normal: "<p>Fremoverhemmelighold betyr at gamle økter forblir hemmelige selv om en langtidsnøkkel lekker senere. DH gir det fordi hver øktnøkkel lages av ferske, tilfeldige verdier som slettes. Hybrid kryptering gir det ikke fordi alle øktnøklene er beskyttet av den samme private nøkkelen.</p>",
      teknisk: "<p>Ephemeral DH: A sender gᵃ, B sender gᵇ, begge beregner g<sup>ab</sup> [mod p]; a og b slettes etter økta. Autentisering skjer med signatur, f.eks. S<sub>A</sub> = Sig(g<sup>ab</sup>, A<sub>priv</sub>), så langtidsnøkkelen inngår aldri i nøkkelmaterialet.</p><p>I hybrid kryptering er C<sub>K</sub> = E(K<sub>økt</sub>, K<sup>B</sup><sub>pub</sub>); med K<sup>B</sup><sub>priv</sub> kan en angriper som har lagret trafikken («lagre nå, dekrypter senere») hente ut hver K<sub>økt</sub>. Derfor fjernet TLS 1.3 RSA-nøkkeltransport; vanlige håndtrykk bruker (EC)DHE.</p>"
    },
    sensor: {
      deler: [{ del: "",
        fasit: "<p>Diffie-Hellman gir fremoverhemmelighold fordi den genererer unike øktnøkler for hver sesjon uavhengig av hverandre. Siden nøklene er uavhengig av hverandre, vil ikke en nøkkel kunne brukes til å utlede en annen.</p>",
        kriterier: "<p>Ett poeng for å nevne, eller beskrive øktnøkler. Ett poeng for å nevne eller beskrive at de skal være uavhengig av hverandre, og ett for å skrive noe om at nøklene derfor ikke kan brukes til å utlede tidligere eller senere nøkler og dermed sesjoner.</p>" }],
      merknad: "Modellsvaret sier ikke noe om hybrid kryptering eller om kompromittert langtidsnøkkel (se avvik)."
    }
  });

  /* =====================================================================
     DEL 3: ANGREPSVEKTORER OG SKADEVARE
     ===================================================================== */

  add({
    key: "H2025-13", oppgave_nr: "Oppgave 13", del: D3,
    ark: "Strafferamme ulovlig datainnbrudd", title: "Straffeloven § 204",
    points: 1, block: "pentest", tema: ["straffeloven § 204", "datainnbrudd", "lov"],
    gjenganger: ["H2022-3.3"],
    oppgave: "<p>I henhold til straffelovens § 204 – hva er strafferammen for gjennomføring av ulovlig datainnbrudd? (I denne oppgaven må svaret være helt korrekt - hvis korrekt svar er \"bøter og fengsel\" og du svarer \"bøter\" - så er svaret altså feil.)</p>" +
      "<p>Poeng: 1 for riktig, 0 for feil eller ubesvart.</p><p><strong>Velg ett alternativ:</strong></p>",
    inspera: {
      type: "F1",
      regelTekst: "Poeng: 1 for riktig, 0 for feil eller ubesvart.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      alternativer: ["Fengsel i inntil fem år", "Bøter eller fengsel i inntil ti år", "Bøter", "Bøter eller fengsel i inntil to år"],
      svar: 3,
      explain: [
        "<p>For strengt. § 204 har ikke fem års strafferamme.</p>",
        "<p>Ti år er langt over strafferammen for vanlig datainnbrudd.</p>",
        "<p>Ufullstendig. Paragrafen åpner også for fengsel, og oppgaven sier at delvis riktig er feil.</p>",
        "<p>Riktig. Straffeloven § 204 gir <strong>bot eller fengsel inntil 2 år</strong> for å skaffe seg uberettiget tilgang til et datasystem.</p>"
      ]
    },
    losning: ["§ 204: bot eller fengsel inntil 2 år."],
    tips: ["Derfor krever en pentest skriftlig tillatelse fra eieren på forhånd. God hensikt fritar ikke."]
  });
  P("13", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Å bryte seg inn i andres datamaskin er som å bryte seg inn i et hus: det er straffbart, og du kan få bot eller inntil to år i fengsel.</p>",
      normal: "<p>Straffeloven § 204 rammer den som bryter en beskyttelse eller på annen måte skaffer seg uberettiget tilgang til et datasystem. Strafferammen er bot eller fengsel inntil 2 år. Pentestere må derfor ha skriftlig avtale med eieren før de begynner.</p>",
      teknisk: "<p>§ 204 gjelder selve innbruddet, uavhengig av om noe blir stjålet eller ødelagt; da kan andre bestemmelser komme i tillegg. Ved pentest er det samtykket i avtalen (omfang, tidsrom, mål) som gjør handlingen lovlig. Går testeren utenfor avtalt omfang, er det igjen uberettiget tilgang.</p>"
    }
  });

  add({
    key: "H2025-14", oppgave_nr: "Oppgave 14", del: D3,
    ark: "Hvilket program er dette?", title: "Kjenn igjen programmet",
    points: 1, block: "pentest", tema: ["nmap", "portskanning", "verktøy"],
    gjenganger: ["H2023-8", "H2024-24"],
    oppgave: "<p>[Skjermbilde av programutdata, se figur]</p>",
    figur: {
      beskrivelse: "Skjermbilde av et Windows PowerShell-vindu (blå bakgrunn, hvit tekst). Programnavnet er sladdet med hvite felt på to steder (i første linje og foran «scan report» og «done»), og en URL er sladdet. Utdataene viser en portskanning av én maskin med OS-gjenkjenning. Til slutt ledeteksten «PS C:\\>».",
      tekst: [
        "Starting [sladdet] at 2022-09-11 13:30 Vest-Europa (sommertid)",
        "[sladdet] scan report for 192.168.211.129",
        "Host is up (0.00073s latency).",
        "Not shown: 997 filtered tcp ports (no-response)",
        "PORT   STATE SERVICE",
        "21/tcp open  ftp",
        "22/tcp open  ssh",
        "80/tcp open  http",
        "MAC Address: 00:0C:29:1B:96:3B (VMware)",
        "Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port",
        "Device type: general purpose",
        "Running: Linux 4.X|5.X",
        "OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5",
        "OS details: Linux 4.15 - 5.6",
        "Network Distance: 1 hop",
        "OS detection performed. Please report any incorrect results at https://[sladdet]/ .",
        "[sladdet] done: 1 IP address (1 host up) scanned in 47.07 seconds",
        "PS C:\\>"
      ]
    },
    inspera: {
      type: "T",
      regelTekst: "Riktig svar gir ettpoeng.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      tekst: "<p>Hva heter dette programmet? {0}</p><p>Hint: Svaret skrives i ETT ord, og husk at svaret rettes automatisk. Er du i tvil om skrivemåten, så spør faglærer om du har skrevet det riktig når han går runden.</p><p>Riktig svar gir ettpoeng.</p>",
      felt: [{ etikett: "Programmet", godta: ["nmap", "n map", "network mapper", "nmap (Network Mapper)", "Network Mapper (nmap)"], naer: { "Wireshark": "Wireshark fanger og viser nettverkstrafikk. Utdata med «scan report», portliste og OS-gjetting kommer fra portskanneren nmap." },
        explain: "<p><strong>nmap</strong> (Network Mapper) er portskanneren som viser åpne porter, tjenester, MAC-adresse og gjetter operativsystem. «scan report for», «Not shown: … filtered tcp ports» og «OS detection performed» er typiske nmap-linjer.</p>" }]
    },
    losning: ["Liste over porter med STATE/SERVICE + OS-gjenkjenning = portskanner = nmap."],
    tips: ["Kjenn igjen utdata fra verktøyene i kurset: nmap (porter), Wireshark (pakker), John the Ripper (passord), mimikatz (legitimasjon i Windows-minnet)."],
    avvik: "«ettpoeng» (særskriving mangler) er beholdt ordrett."
  });
  P("14", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Programmet banker på alle dørene (portene) til en datamaskin og forteller hvilke som er åpne. Det heter nmap.</p>",
      normal: "<p>nmap kartlegger nettverk: hvilke maskiner som svarer, hvilke porter som er åpne og hvilke tjenester som kjører (her ftp, ssh og http). Den kan også gjette operativsystem. Det brukes i rekognoseringsfasen av en pentest.</p>",
      teknisk: "<p>nmap sender pakker (f.eks. TCP SYN) til portene og tolker svarene: SYN/ACK = open, RST = closed, ingen svar = filtered. Med -O sammenligner den TCP/IP-stakkens oppførsel mot en database for å gjette OS, og advarselen i bildet kommer fordi den ikke fant både en åpen og en lukket port. MAC-adressen vises bare når målet er i samme lokalnett (1 hop).</p>"
    }
  });

  add({
    key: "H2025-15", oppgave_nr: "Oppgave 15", del: D3,
    ark: "Sentrifuger", title: "Sentrifugene",
    points: 1, block: "cyberops", tema: ["Stuxnet", "cyberoperasjon", "industrielle styresystemer"],
    oppgave: "<p>Hva heter skadevaren vi snakket om i kurset som ødela sentrifuger for å ødelegge det iranske atomprogrammet?</p><p>Poeng: 1p for riktig, 0p for galt eller ubesvart.</p>",
    inspera: {
      type: "T",
      regelTekst: "Poeng: 1p for riktig, 0p for galt eller ubesvart.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      tekst: "<p>Skriv svaret ditt {0} her.</p>",
      felt: [{ etikett: "Skadevaren", godta: ["Stuxnet", "stuxnett", "stuksnett", "stuksnet", "Stuxnet-ormen", "Stuxnet-orm", "Stuxnet worm", "Stuxnet-viruset"],
        explain: "<p><strong>Stuxnet</strong> var en orm som angrep styresystemene (Siemens PLS) for urananrikingssentrifuger i Natanz, fikk dem til å spinne feil og viste samtidig normale verdier til operatørene.</p>" }]
    },
    losning: ["Stuxnet."],
    tips: ["Stuxnet brukes ofte som eksempel på en statlig cyberoperasjon med fysisk ødeleggelse."]
  });
  P("15", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Stuxnet var et dataprogram som lurte maskiner i Iran til å snurre for fort, slik at de gikk i stykker, mens skjermene sa at alt var i orden.</p>",
      normal: "<p>Stuxnet (oppdaget 2010) er kjent som det første dataangrepet som ga fysisk ødeleggelse av industrianlegg. Det spredte seg blant annet via minnepinner inn i et isolert nett og var svært målrettet.</p>",
      teknisk: "<p>Stuxnet brukte flere nulldagssårbarheter i Windows, stjålne kodesigneringssertifikater og et rootkit for PLS-er. Det endret frekvensen på sentrifugenes motorer og spilte av opptak av normale måleverdier til operatørene. Det tilskrives statlige aktører og regnes som et skoleeksempel på en avansert, vedvarende trussel (APT).</p>"
    }
  });

  add({
    key: "H2025-16", oppgave_nr: "Oppgave 16", del: D3,
    ark: "Hack et filter", title: "Lur et ordfilter",
    points: 1, block: "angrep", tema: ["inputvalidering", "filteromgåelse"],
    gjenganger: ["H2024-23"],
    oppgave: "<p>I svarfeltet nedenfor er det implementert et filter som forhindrer deg å skrive mer enn to ord.</p>" +
      "<p>Du skal lure filteret - slik at du kan skrive og få frem hele setningen nedenfor:</p><p>\"Filteret kan lures\"</p>" +
      "<p>Du skal vise to måter å lure filteret, og det gir 1 poeng (du må gi to løsninger for å få poeng).</p>",
    inspera: {
      type: "E",
      regelTekst: "Du skal vise to måter å lure filteret, og det gir 1 poeng (du må gi to løsninger for å få poeng).",
      regel: { min: 0, maks: 1 },
      regelMerknad: "Alt eller ingenting: to løsninger gir 1 p, én løsning gir 0.",
      deler: [{ del: "", poeng: 1, sporsmal: "<p>Vis to måter å få fram «Filteret kan lures» forbi et filter som tillater maks to ord.</p>", grense: "maks to «ord» i feltet" }]
    },
    losning: [
      "Filteret teller ord ved å se etter mellomrom. Fjern eller bytt ut mellomrommene, så blir hele setningen ett «ord».",
      "Eksempler: understrek mellom ordene, eller stor forbokstav uten mellomrom (CamelCase)."
    ],
    tips: ["Poenget er generelt: et filter som sjekker formen på input (blokkliste) kan nesten alltid omgås med en annen skrivemåte. Det samme gjelder filtre mot SQL-injeksjon."]
  });
  P("16", {
    type: "skjonn",
    svar: [{ del: "", tekst: "<p>1) Filteret_kan_lures<br>2) FilteretKanLures</p>", poeng: ["To løsninger som får fram setningen (1p)"] }],
    hvorfor: {
      eli5: "<p>Filteret teller mellomrom for å finne ord. Fjerner du mellomrommene, ser hele setningen ut som ett langt ord.</p>",
      normal: "<p>Filteret definerer «ord» som tekst skilt av mellomrom. Bytter du mellomrom med understrek, bindestrek eller skriver ordene sammen med store forbokstaver, er setningen fortsatt lesbar, men filteret ser bare ett ord.</p>",
      teknisk: "<p>Dette er filteromgåelse: inputvalidering som bygger på en smal antakelse om formatet. Andre varianter er hardt mellomrom (U+00A0) eller andre Unicode-mellomrom som ordtelleren ikke kjenner igjen. Samme mønster gjelder for blokklister mot SQL-injeksjon og XSS, som kan omgås med alternativ koding eller store/små bokstaver. Robust forsvar er tillatelseslister og parameteriserte spørringer.</p>"
    },
    sensor: {
      deler: [{ del: "",
        fasit: "<p>FilteretKanLures.<br>Filteret_kan_lures.</p>",
        kriterier: "<p>Godta alle løsningen som får frem setningen - eksempelvis;<br>FilteretKanLures.<br>Filteret_kan_lures.<br>To løsninger gir 1 poeng, ett gir ingen.</p>" }],
      merknad: "«alle løsningen» er beholdt ordrett."
    }
  });

  add({
    key: "H2025-17", oppgave_nr: "Oppgave 17", del: D3,
    ark: "OSINT 1", title: "Hva står OSINT for?",
    points: 1, block: "pentest", tema: ["OSINT", "rekognosering"],
    oppgave: "<p>Hint: Det er en engelsk forkortelse, så du må svare på engelsk. Hvis du er i tvil om stavemåte - så spør faglærer.</p><p>Oppgaven gir ett poeng for riktig svar.</p>",
    inspera: {
      type: "T",
      regelTekst: "Oppgaven gir ett poeng for riktig svar.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      tekst: "<p>Hva er OSINT {0} forkortelse for?</p>",
      felt: [{ etikett: "OSINT", godta: ["Open Source Intelligence", "Open Source Inteligence", "Open Source Intelligense", "Open Source Inteligense", "OpenSource Intelligence", "Open SourceIntelligence", "Open Source Intelligence (OSINT)", "Open Source Intelligance"], naer: { "Open Source Information": "Siste ord er Intelligence (etterretning), ikke information: Open Source Intelligence." },
        explain: "<p><strong>Open Source Intelligence</strong>: etterretning basert på åpne, offentlig tilgjengelige kilder. «Open source» betyr her åpne kilder, ikke åpen kildekode.</p>" }]
    },
    losning: ["Open Source Intelligence."],
    tips: ["Lista godtar noen stavefeil i «Intelligence», men ikke norske svar. Svar på engelsk når hintet sier det."]
  });
  P("17", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>OSINT betyr å finne ut ting bare ved å lete der alle kan se, for eksempel på nettet.</p>",
      normal: "<p>Open Source Intelligence er informasjonsinnhenting fra åpne kilder: søkemotorer, nettsider, sosiale medier, offentlige registre og anbudsportaler.</p>",
      teknisk: "<p>OSINT er en etterretningsdisiplin på linje med HUMINT og SIGINT. I pentest og i cyber kill chain hører den til rekognoseringen: man kartlegger ansatte, e-postformat, domener, teknologi og leverandører uten å røre målets systemer, slik at aktiviteten ikke etterlater spor hos målet.</p>"
    }
  });

  add({
    key: "H2025-18", oppgave_nr: "Oppgave 18", del: D3,
    ark: "OSINT 2", title: "Hva er OSINT, og hvorfor brukes det?",
    points: 3, block: "pentest", tema: ["OSINT", "rekognosering", "phishing"],
    oppgave: "<p>Hva ER egentlig OSINT?</p><p>A) Forklar med egne ord hva OSINT er.</p><p>B) Gi to eksempler på hvorfor man bruker OSINT (altså hvilken nytte har man av det)</p><p>Oppgaven gir tre poeng.</p>",
    inspera: {
      type: "E",
      regelTekst: "Oppgaven gir tre poeng.",
      regel: { min: 0, maks: 3 },
      deler: [
        { del: "A)", poeng: 1, sporsmal: "<p>Forklar med egne ord hva OSINT er.</p>", grense: "kort" },
        { del: "B)", poeng: 2, sporsmal: "<p>Gi to eksempler på hvorfor man bruker OSINT (altså hvilken nytte har man av det)</p>", grense: "to eksempler" }
      ]
    },
    losning: ["A: innsamling og analyse av informasjon fra åpne kilder.", "B: to konkrete formål, f.eks. grunnlag for målrettet phishing og kartlegging av teknologien i virksomheten."],
    tips: ["Gi to klart forskjellige eksempler; sensor gir ett poeng per fornuftig målsetning."]
  });
  P("18", {
    type: "skjonn",
    svar: [
      { del: "A)", tekst: "<p>OSINT er å samle inn og analysere informasjon fra åpent tilgjengelige kilder, som søkemotorer, nettsider, sosiale medier og offentlige registre, uten å bryte seg inn noe sted.</p>", poeng: ["Beskriver hva OSINT er (1p)"] },
      { del: "B)", tekst: "<ol><li>Finne navn, roller og e-postadresser til ansatte for å lage troverdig, målrettet phishing (spyd-phishing).</li><li>Kartlegge hvilken teknologi virksomheten bruker, f.eks. fra stillingsannonser og DNS, for å finne mulige sårbarheter.</li></ol><p>(En forsvarer kan bruke det samme for å se hva virksomheten eksponerer.)</p>", poeng: ["Eksempel 1 (1p)", "Eksempel 2 (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>Før en tyv bryter seg inn, kan han lese på nettet hvem som jobber der og hvilke låser de har. Det er OSINT. Den som forsvarer seg, kan gjøre det samme for å se hva tyven ser.</p>",
      normal: "<p>OSINT er rekognosering uten å røre målet. Angripere og pentestere bruker det til å finne personer å lure og teknologi å angripe. Virksomheter bruker det til å se sin egen eksponering.</p>",
      teknisk: "<p>Typiske kilder er søkemotorer (også avanserte søkeoperatorer), virksomhetens nettsider, LinkedIn, Doffin/anbud, DNS- og sertifikatregistre og lekkede databaser. OSINT er passiv rekognosering: man angriper eller skanner ikke målet, og et besøk på nettsidene ser ut som vanlig trafikk, så det skiller seg ikke ut i målets IDS. Resultatet brukes i bevæpnings- og overleveringstrinnene i kill chain, f.eks. til spyd-phishing.</p>"
    },
    sensor: {
      deler: [
        { del: "A)", fasit: "<p>OSINT, eller åpen kildeanalyse, er at man samler inn og analyserer data fra åpne kilder - eksempelvis Internett.</p>", kriterier: "<p>A) Ett poeng for å beskrive hva osint er.</p>" },
        { del: "B)", fasit: "<p>Målsetningen kan være å hente inn informasjon til bruk i phishing, eller som informasjonsinnhenting for eksempelvis å finne ut av hva slags teknologi som brukes i en virksomhet</p>", kriterier: "<p>B) Ett for hver fornuftig målsetning de kommer opp med.</p>" }
      ],
      merknad: null
    }
  });

  add({
    key: "H2025-19", oppgave_nr: "Oppgave 19", del: D3,
    ark: "Skadevare", title: "Rootkit-scenario",
    points: 7, block: "angrep", tema: ["rootkit", "skadevare", "hendelseshåndtering", "reinstallering"],
    oppgave: "<p>Du er sikkerhetssjef i et selskap. I nettverksloggene sine har IT funnet ut at ên, og bare ên, spesifikk maskin sender kryptert datatrafikk ut på Internett til gitte tider av døgnet. Det er for tiden ingen som fysisk har tilgang til, eller bruker maskinen. Problemet viste seg å fortsette selv etter å ha rebootet maskinen. IT har undersøkt maskinen og har ikke funnet tegn til at den kjører noe annet enn standard OS-applikasjoner. De har verifisert at disse er identiske med filene som leveres fra produsenten. (De har gjort dette riktig, så filene er altså ikke manipulert). Antivirusløsningen deres finner ingen skadevare.</p>" +
      "<p>Maskinen fortsetter imidlertid å sende ut data. Du installerer en annen antivirusløsning - den finner og fjerner skadevaren. Du sjekker maskinens logger nøye, men finner ingen spor til at filen hverken kjører eller noensinne har kjørt (dette gjør du både før og etter at du installerte ny antivirusløsning, og svaret var identisk begge gangene).</p>" +
      "<p>IT trenger maskinen og ønsker å sette den tilbake i produksjon siden antivirusløsningen tross alt har fjernet viruset.</p>" +
      "<p>A) Hva kalles denne typen skadevare?</p><p>B) Hva bør du gjøre nå?</p><p>C) Kan IT sette maskinen tilbake i drift nå som skadevaren er borte? Begrunn svaret,</p>" +
      "<p>Svar maks en linje på oppgave A (1p), fem linjer på oppgave B (3p) og fem linjer på oppgave C (3p).</p>",
    inspera: {
      type: "E",
      regelTekst: "Svar maks en linje på oppgave A (1p), fem linjer på oppgave B (3p) og fem linjer på oppgave C (3p).",
      regel: { min: 0, maks: 7 },
      deler: [
        { del: "A)", poeng: 1, sporsmal: "<p>Hva kalles denne typen skadevare?</p>", grense: "maks en linje" },
        { del: "B)", poeng: 3, sporsmal: "<p>Hva bør du gjøre nå?</p>", grense: "maks fem linjer" },
        { del: "C)", poeng: 3, sporsmal: "<p>Kan IT sette maskinen tilbake i drift nå som skadevaren er borte? Begrunn svaret,</p>", grense: "maks fem linjer" }
      ]
    },
    losning: [
      "A: Skadevaren skjuler seg for OS, logger og antivirus: rootkit.",
      "B: Isoler maskinen, sjekk om skadevaren har spredt seg til andre maskiner (2p), og finn ut hvordan den kom inn (1p).",
      "C: Nei. Reinstaller fra rent medium; et rootkit kan ha skjult flere ting (bakdører), så maskinen kan ikke stoles på."
    ],
    tips: ["Sensor legger mest vekt på spredning (2p) i B og på begrunnelsen (2p) i C. Si «reinstallere» eksplisitt.", "Ledetråder til rootkit: ingen spor i logger, rene systemfiler og usynlig for ett antivirus."],
    avvik: "«ên» (to ganger) og «Begrunn svaret,» er beholdt ordrett."
  });
  P("19", {
    type: "skjonn",
    svar: [
      { del: "A)", tekst: "<p>Rootkit.</p>", poeng: ["Rootkit (1p)"] },
      { del: "B)", tekst: "<p>Isoler maskinen fra nettet og behandle det som en sikkerhetshendelse. Undersøk om skadevaren har spredt seg: let etter samme trafikkmønster og samme skadevare på andre maskiner i virksomheten. Analyser hvordan den kom inn (angrepsvektor) og hva som er sendt ut, så hullet kan tettes og en eventuell datalekkasje håndteres.</p>",
        poeng: ["Verifisere at skadevaren ikke er spredt til andre deler av virksomheten (2p)", "Analysere hvordan skadevaren kom inn (1p)"] },
      { del: "C)", tekst: "<p>Nei. Maskinen må reinstalleres fra et kjent rent utgangspunkt før den settes i drift. Et rootkit er laget for å skjule skadevare, og det at det lurte både logger og det første antivirusprogrammet viser at vi ikke kan stole på hva maskinen sier om seg selv. Det kan ligge igjen bakdører eller annen skadevare som det nye antivirusprogrammet heller ikke ser.</p>",
        poeng: ["Maskinen må reinstalleres (1p)", "Begrunnelse: rootkit skjuler, kan være bakdører/annen skadevare igjen (2p)"] }
    ],
    hvorfor: {
      eli5: "<p>En tyv har gjemt seg i huset og tatt bort alle spor. Du fant én av dem, men du vet ikke om det er flere eller om de har laget en hemmelig dør. Det tryggeste er å bygge rommet på nytt og sjekke resten av huset.</p>",
      normal: "<p>Et rootkit gjemmer skadevare ved å manipulere det operativsystemet viser: filer, prosesser og logger. Derfor fant IT ingenting. Når du først har funnet et rootkit, kan du ikke stole på maskinen lenger. Riktig håndtering er å isolere, sjekke spredning, finne inngangen og reinstallere.</p>",
      teknisk: "<p>Rootkits kan ligge i kjernen (nivå 0), i fastvare/oppstart eller under OS (hypervisor-rootkit), og avskjærer systemkall slik at de selv blir usynlige. At systemfilene er identiske med produsentens og at loggene er tomme, peker mot noe som skjuler seg under OS-nivå. Antivirus som kjører på det kompromitterte systemet, ser bare det rootkitet slipper gjennom. Hendelseshåndtering:</p><ul><li>inneslutning (isolasjon)</li><li>analyse (spredning, angrepsvektor, eksfiltrert data)</li><li>utryddelse (reinstallering, eventuelt flashing av fastvare)</li><li>gjenoppretting fra rene kilder</li></ul>"
    },
    sensor: {
      deler: [
        { del: "A)", fasit: "<p>A) Rootkit - ett poeng.</p>", kriterier: "" },
        { del: "B)", fasit: "", kriterier: "<p>B) Her bør de få med noe om å verifisere at skadevaren ikke er spredt til øvrige deler av virksomheten - to poeng.<br>De bør også skrive noe om å analysere hvordan skadevaren kom inn i systemet (ett poeng).</p>" },
        { del: "C)", fasit: "<p>Hensikten med rootkit, er å skjule skadevare. Selv om skadevaren nå tilsynelatende er borte, så kan det være bakdører eller annen skadevare der.</p>",
          kriterier: "<p>C) Her må de få med at maskinen må reinstalleres for å være sikker.<br>Ett poeng for å få med at maskinen må reinstalleres, og to poeng for begrunnelsen.</p>" }
      ],
      merknad: null
    }
  });

  /* =====================================================================
     DEL 4: NETTVERKSSIKKERHET
     ===================================================================== */

  add({
    key: "H2025-20", oppgave_nr: "Oppgave 20", del: D4,
    ark: "Snortregel", title: "Skriv en Snort-regel for SSH fra DC",
    points: 2, block: "nettverk", tema: ["Snort", "IDS", "SSH", "port 22"],
    gjenganger: ["H2023-31", "H2024-27"],
    oppgave: "<pre>alert tcp $HOME_NET 445 -&gt; any any ( msg:\"OS-WINDOWS Microsoft Windows SMB possible leak of kernel heap memory\"; flow:to_client,established; content:\"Frag\",fast_pattern; content:\"Free\"; content:\"|FA FF FF|\"; content:\"|F8 FF FF|\",within 3,distance 5; content:\"|F8 FF FF|\",within 3,distance 5; metadata:policy balanced-ips alert,policy security-ips drop,ruleset community; service:netbios-ssn; reference:cve,2017-0147; reference:url,technet.microsoft.com/en-us/security/bulletin/MS17-010; classtype:attempted-recon; sid:42339; rev:2; )</pre>" +
      "<p>Lag en snort-regel som generer en alarm for utgående TCP-basert SSH-trafikk fra domenekontrolleren 10.10.23.23. Husk å få med riktig portnummer for SSH (vi forutsetter at standardporten er i bruk).</p>" +
      "<p>Oppgaven gir maks to, minimum null poeng.</p>",
    inspera: {
      type: "E",
      regelTekst: "Oppgaven gir maks to, minimum null poeng.",
      regel: { min: 0, maks: 2 },
      deler: [{ del: "", poeng: 2, sporsmal: "<p>Lag en snort-regel som generer en alarm for utgående TCP-basert SSH-trafikk fra domenekontrolleren 10.10.23.23.</p>", grense: "én regel" }]
    },
    losning: [
      "Struktur: handling protokoll kilde-IP kildeport -&gt; mål-IP målport (opsjoner).",
      "Handling alert, protokoll tcp, kilde 10.10.23.23, port 22 (SSH), retning ut (-&gt;), mål any any.",
      "Legg til msg, sid og rev i parentesen."
    ],
    tips: [
      "Sensor trekker for manglende «alert», «tcp» eller feil/manglende port 22. Feil retning gir 0.",
      "Fasit setter 22 som kildeport. Vil du dekke tilfellet der DC selv er SSH-klient, ville porten stått på mottakersiden: alert tcp 10.10.23.23 any -&gt; any 22. Skriv gjerne den regelen som fasit viser, og nevn den andre i en setning."
    ],
    avvik: ["Fasit `alert tcp 10.10.23.23 22 -> any any` har SSH-porten som kildeport, altså trafikk der DC er SSH-tjener og svarer. Leses «utgående SSH-trafikk fra DC» som at DC starter SSH-forbindelser ut, ville 22 stått som målport (slik lysarkets eksempel har 22 på mottakersiden).", "Fasit mangler også «msg:» og «;» (sensorteksten sier at enkle syntaksfeil ses bort fra).", "Skrivefeil «generer» og «poeg» beholdt ordrett."]
  });
  P("20", {
    type: "skjonn",
    svar: [{ del: "", tekst: "<p>Regelen varsler (alert) på TCP-trafikk fra DC-en med SSH-port 22, på vei ut til hvem som helst:</p>",
      kode: "alert tcp 10.10.23.23 22 -> any any (msg:\"Utgaaende SSH-trafikk fra DC\"; sid:1000001; rev:1;)",
      poeng: ["alert, tcp, kilde 10.10.23.23, port 22 og riktig retning (2p)"] }],
    hvorfor: {
      eli5: "<p>Snort er en vakt som leser alle pakker. Regelen sier: «Rop ut hvis du ser SSH-pakker som går ut fra domenekontrolleren.»</p>",
      normal: "<p>En Snort-regel har et hode og en kropp. Hodet sier hva som skal skje (alert), hvilken protokoll (tcp), fra hvilken adresse og port, retningspilen, og til hvilken adresse og port. Kroppen i parentes har melding og ID. SSH bruker port 22.</p>",
      teknisk: "<p>Regelhode: &lt;handling&gt; &lt;protokoll&gt; &lt;kilde-IP&gt; &lt;kildeport&gt; -&gt; &lt;mål-IP&gt; &lt;målport&gt;. Opsjoner skilles med semikolon, f.eks. msg:\"…\"; sid:…; rev:…; (lokale regler bruker sid ≥ 1000000).</p><p>En TCP-forbindelse har én klientport (tilfeldig, høy) og én tjenerport (22 for SSH). Om 22 skal stå som kilde- eller målport avhenger av hvem som er SSH-tjener; fasit forutsetter at DC er tjeneren. Med «&lt;&gt;» kan man fange begge retninger.</p>"
    },
    sensor: {
      deler: [{ del: "",
        fasit: "<p>alert tcp 10.10.23.23 22 -&gt; any any (msg “Utgående SSH-trafikk mot DC“)</p>",
        kriterier: "<p>Det svaret gir to poeng, se bort fra enkle syntaksfeil (feil retning for trafikken er helt feil svar, og gir null poeng) og feil rekkefølge i brukte parametere. Trekk dem ett poeg for mangel på følgende ord: \"alert\", \"tcp\" og mangel på, eller bruk av feil portnr (som skal være 22).</p>",
        kode: "alert tcp 10.10.23.23 22 -> any any (msg “Utgående SSH-trafikk mot DC“)" }],
      merknad: "Meldingen i fasit sier «mot DC», selv om regelen gjelder trafikk fra DC. Se også avvik om kildeport/målport. I det anbefalte svaret er «å» skrevet som «aa» i kodefeltet for å unngå tegnsettproblemer i Snort-regler; «Utgående» er like gyldig."
    }
  });

  add({
    key: "H2025-21", oppgave_nr: "Oppgave 21", del: D4,
    ark: "IDS", title: "IDS og anomali-IDS under pentest",
    points: 3, block: "nettverk", tema: ["IDS", "anomalibasert", "pentest", "maskinlæring"],
    gjenganger: ["H2023-31"],
    oppgave: "<p>A) Hva er en IDS, og hva står forkortelsen for?</p><p>Skriv maks en setning (ett poeng)</p>" +
      "<p>B) Du setter opp en anomalibasert IDS-løsning i løpet av mars. I samme måned har virksomheten din en større pentest av nettet sitt.<br>Er det noe problem å gjøre dette samtidig?<br>Begrunn svaret ditt, skriv maks fem linjer tekst - denne delen av oppgaven gir maks to poeng.</p>",
    inspera: {
      type: "E",
      regelTekst: "Skriv maks en setning (ett poeng) / denne delen av oppgaven gir maks to poeng.",
      regel: { min: 0, maks: 3 },
      deler: [
        { del: "A)", poeng: 1, sporsmal: "<p>Hva er en IDS, og hva står forkortelsen for?</p>", grense: "maks en setning" },
        { del: "B)", poeng: 2, sporsmal: "<p>Er det noe problem å gjøre dette samtidig? Begrunn svaret ditt.</p>", grense: "maks fem linjer" }
      ]
    },
    losning: [
      "A: Intrusion Detection System – system som overvåker trafikk/hendelser og varsler om mulige angrep.",
      "B: Ja. En anomalibasert IDS lærer hva som er «normalt» i oppstartsperioden. Med pentest samtidig lærer den at angrepstrafikk er normalt, og senere ekte angrep gir ikke alarm."
    ],
    tips: ["Si «ja, det er et problem» tydelig (0,5 p), og forklar mekanismen: trening på angrepstrafikk → angrep blir normaltilstand → ingen alarm."]
  });
  P("21", {
    type: "skjonn",
    svar: [
      { del: "A)", tekst: "<p>IDS står for Intrusion Detection System (innbruddsdeteksjonssystem), et system som overvåker nettverk eller maskiner og varsler når det oppdager mulige angrep.</p>", poeng: ["Forkortelsen (0,5p)", "Forklaring (0,5p)"] },
      { del: "B)", tekst: "<p>Ja, det er et problem. En anomalibasert IDS bygger først en modell av normal trafikk og varsler senere om avvik. Hvis modellen trenes mens pentesten pågår, lærer den at portskanning, utnyttelse og annen angrepstrafikk er normalt. Da vil ekte angrep av samme type senere ikke gi alarm. Tren IDS-en før eller etter pentesten, eller hold pentest-trafikken utenfor treningsdataene.</p>",
        poeng: ["Sier at det er problematisk (0,5p)", "IDS-en trenes til at angrepstrafikk er vanlig (1p)", "Reelle angrep gir da ikke alarm (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>En vakthund lærer hva som er vanlig i huset den første måneden. Hvis innbruddstyver øver i huset den måneden, tror hunden at tyver hører til, og bjeffer ikke når ekte tyver kommer.</p>",
      normal: "<p>En anomalibasert IDS sammenligner trafikken med en lært modell av «normal adferd». Det den ser i læringsperioden, blir normalt. En pentest i samme periode lærer derfor IDS-en at angrep er normalt, og den mister evnen til å oppdage nettopp de angrepene.</p>",
      teknisk: "<p>Signaturbasert IDS (som Snort-regler) kjenner igjen kjente mønstre; anomalibasert IDS bruker ofte maskinlæring på trafikkdata og kan oppdage ukjente angrep. Treningsdata må være representative og rene. Pentest-trafikk i treningsdata er en form for forgiftning av modellen: terskelen for «sjelden» flyttes, og skanning, lateral bevegelse og C2-lignende trafikk blir del av baseline. Resultatet er falske negative senere.</p>"
    },
    sensor: {
      deler: [
        { del: "A)", fasit: "<p>A) Intrusion detection system - innbruddsdeteksjonssystem (godta begge). (0,5 poeng)</p>", kriterier: "<p>Godta enhver forklaring som gir mening på hva IDS er. (0,5 poeng).</p>" },
        { del: "B)", fasit: "<p>Kartlegging og skadevare vil da være normaltillstand for IDSen, og reelle angrep vil derfor ikke generere alarmer. (1 p)</p>",
          kriterier: "<p>B) Gi 0.5 poeng for å bare si at det er potensielt problematisk.<br>De bør skrive at et anomalibasert IDS da trenes opp til at angrepstrafikk er vanlig (1p).</p>" }
      ],
      merknad: "«normaltillstand» beholdt ordrett. Delpoengene i B summerer til 2,5, men delen gir maks 2."
    }
  });

  add({
    key: "H2025-22", oppgave_nr: "Oppgave 22", del: D4,
    ark: "Protokollstack", title: "Protokoll → lag i Internettstakken",
    points: 4, block: "nettverk", tema: ["Internettstakk", "lag", "TLS", "ARP", "IP", "UDP"],
    gjenganger: ["H2021-5.1", "H2021-5.2", "H2022-7.1", "H2024-28"],
    oppgave: "<p>I denne oppgaven skal du fylle ut enkelte protokoller du har vært borti i kurset på riktig sted i Internettstacken.</p>" +
      "<p>NB: Grunnet begrensninger i inspera står står nederste lag (fysisk) helt til venstre, og så går lagene oppover mot høyre. Kan være lurt å dobbeltsjekke at du ikke har tenkt feil.</p>" +
      "<p>Hvert riktig svar gir 0,5 poeng,  ubesvart gir 0, og hvert gale gir -0,5 poeng.</p><p><strong>Plasser protokollene på riktig nivå</strong></p>",
    figur: {
      beskrivelse: "Liggende stabel av seks fargede kolonner, merket «Internett-stakk» til høyre. Fra venstre: «Fysisk» (lys grønn), «Link» (lys blå, smal), «Internett» (lys blå, smal), «Transport» (lys blå), «Applikasjon» (lys blå), «App» (turkis). Teksten i kolonnene står rotert 90 grader. Stabelen er lagmodellen vippet på siden, med laveste lag til venstre.",
      tekst: ["Fysisk", "Link", "Internett", "Transport", "Applikasjon", "App", "Internett-stakk"]
    },
    inspera: {
      type: "M",
      regelTekst: "Hvert riktig svar gir 0,5 poeng,  ubesvart gir 0, og hvert gale gir -0,5 poeng.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 4 },
      kolonner: ["Fysisk", "Link", "Internett", "Transport", "Applikasjon", "App"],
      multi: false,
      rader: [
        { s: "TLS Record", svar: [3], explain: "<p>Kursets konvensjon: TLS Record-protokollen, som krypterer og beskytter datastrømmen, regnes til <strong>transportlaget</strong> (den ligger rett over TCP).</p>" },
        { s: "Outlook", svar: [5], explain: "<p>Outlook er ikke en protokoll, men et brukerprogram. Det hører til det øverste laget i kursets figur, <strong>App</strong> (brukerapplikasjonen).</p>" },
        { s: "UDP", svar: [3], explain: "<p>UDP er, som TCP, en <strong>transportprotokoll</strong> med portnummer.</p>" },
        { s: "TLS Handshake", svar: [4], explain: "<p>Kursets konvensjon: TLS Handshake, som forhandler algoritmer, autentiserer med sertifikat og etablerer nøkler, regnes til <strong>applikasjonslaget</strong>.</p>" },
        { s: "ARP", svar: [1], explain: "<p>ARP kobler IP-adresser til MAC-adresser i lokalnettet og hører til <strong>linklaget</strong>.</p>" },
        { s: "IP", svar: [2], explain: "<p>IP ruter pakker mellom nett: <strong>internettlaget</strong> (nettverkslaget).</p>" },
        { s: "HTTP", svar: [4], explain: "<p>HTTP er en <strong>applikasjonsprotokoll</strong> for nettsider.</p>" },
        { s: "Telnet", svar: [4], explain: "<p>Telnet er en <strong>applikasjonsprotokoll</strong> for fjerninnlogging (ukryptert, port 23).</p>" }
      ]
    },
    losning: [
      "Husk at fysisk står til venstre og App til høyre.",
      "Link: ARP. Internett: IP. Transport: UDP, TLS Record. Applikasjon: HTTP, Telnet, TLS Handshake. App: Outlook."
    ],
    tips: ["TLS er delt i kurset: Record = transport, Handshake = applikasjon. Det er spurt om flere år.", "Kursets stakk har et eget «App»-lag over applikasjonsprotokollene, for selve programmet brukeren kjører."],
    avvik: "Plasseringen av TLS Record i transportlaget og TLS Handshake i applikasjonslaget følger kurset (lysark d09). RFC 8446 plasserer ikke TLS-delene i noe lag, og mange andre kilder legger hele TLS over TCP. Svar som kurset på eksamen."
  });
  P("22", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Tenk på et brev: programmet du skriver i (Outlook), språket i brevet (HTTP), konvolutten med avsender og mottaker (TCP/UDP og IP), og postbilen i nabolaget (link). Hver protokoll har sin etasje.</p>",
      normal: "<p>Internettstakken har lagene fysisk, link, internett, transport og applikasjon, og kurset legger brukerprogrammet (App) øverst.</p><ul><li>ARP jobber i lokalnettet (link)</li><li>IP mellom nett (internett)</li><li>UDP/TCP mellom prosesser (transport)</li><li>HTTP/Telnet er applikasjonsprotokoller</li></ul><p>TLS deles i to: Record i transportlaget og Handshake i applikasjonslaget.</p>",
      teknisk: "<ul><li>ARP oversetter IPv4-adresse til MAC-adresse via kringkasting og har ingen autentisering (derav ARP-spoofing).</li><li>IP gir ruting og adressering mellom nett; UDP gir porter uten forbindelse.</li><li>TLS Record-laget fragmenterer, krypterer og MAC-beskytter data over TCP og oppfører seg som et sikkert transportlag.</li><li>Handshake-protokollen er meldinger som bæres av Record-laget og hører derfor høyere.</li><li>Kurset plasserer IPsec i IP-laget (uten port).</li></ul>"
    }
  });

  add({
    key: "H2025-23", oppgave_nr: "Oppgave 23", del: D4,
    ark: "Kryptert trafikk?", title: "Kryptert eller ukryptert protokoll",
    points: 3, block: "nettverk", tema: ["SSH", "Telnet", "HTTP", "FTP", "RDP", "ARP", "kryptering"],
    oppgave: "<p>Angi hvilke av disse protokollene som er henholdsvis kryptert, eller ikke kryptert.</p><p>Hvert riktig svar gir 0,5 poeng, hvert gale -0,5. 0 for ubesvart.</p><p><strong>Finn de som passer sammen:</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Hvert riktig svar gir 0,5 poeng, hvert gale -0,5. 0 for ubesvart.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      kolonner: ["Ukryptert", "Kryptert"],
      multi: false,
      rader: [
        { s: "SSH", svar: [1], explain: "<p>SSH (Secure Shell, port 22) er laget nettopp for <strong>kryptert</strong> fjerninnlogging og erstatter Telnet.</p>" },
        { s: "Telnet", svar: [0], explain: "<p>Telnet sender alt, også passord, i klartekst: <strong>ukryptert</strong>.</p>" },
        { s: "HTTP", svar: [0], explain: "<p>Vanlig HTTP er <strong>ukryptert</strong>. Kryptert variant er HTTPS (HTTP over TLS).</p>" },
        { s: "FTP", svar: [0], explain: "<p>FTP sender brukernavn, passord og filer i klartekst: <strong>ukryptert</strong>. Krypterte alternativer er SFTP og FTPS.</p>" },
        { s: "RDP", svar: [1], explain: "<p>Remote Desktop Protocol krypterer sesjonen (i dag normalt med TLS): <strong>kryptert</strong>.</p>" },
        { s: "ARP", svar: [0], explain: "<p>ARP-meldinger er <strong>ukrypterte</strong> og uautentiserte kringkastinger i lokalnettet. Derfor er ARP-spoofing mulig.</p>" }
      ]
    },
    losning: ["Kryptert: SSH, RDP. Ukryptert: Telnet, HTTP, FTP, ARP."],
    tips: ["Mange gamle protokoller (Telnet, FTP, HTTP) har en kryptert etterfølger: SSH, SFTP/FTPS, HTTPS."]
  });
  P("23", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Noen protokoller sender postkort som alle kan lese (Telnet, HTTP, FTP, ARP). Andre sender brev i en låst konvolutt (SSH, RDP).</p>",
      normal: "<p>De eldste internettprotokollene ble laget før kryptering var vanlig og sender alt i klartekst. SSH og RDP krypterer forbindelsen, så den som avlytter bare ser chiffertekst.</p>",
      teknisk: "<ul><li>SSH etablerer nøkler med DH, autentiserer tjeneren med en vertsnøkkel og krypterer kanalen.</li><li>RDP bruker normalt TLS (og kan bruke NLA for autentisering før økta).</li><li>Telnet (23), FTP (20/21) og HTTP (80) er klartekst, så passord kan leses med Wireshark.</li><li>ARP har verken kryptering eller autentisering på linklaget.</li></ul>"
    }
  });

  add({
    key: "H2025-24", oppgave_nr: "Oppgave 24", del: D4,
    ark: "Brannmurregler", title: "Slipper iptables-reglene trafikken gjennom?",
    points: 2, block: "nettverk", tema: ["iptables", "brannmur", "tilstandsløs", "FORWARD", "første treff"],
    gjenganger: ["H2023-32"],
    oppgave: "<p>I denne oppgaven skal du svare om trafikken slippes igjennom en  tilstandsløs brannmur med følgende regelsett:</p>" +
      "<pre>iptables –A FORWARD –s 131.234.142.33 -p tcp --dport 80 –j accept\niptables -A INPUT   -s 131.234.142.33 -j drop\niptables -A FORWARD -s 129.240.31.23 -p tcp -j drop\niptables -A FORWARD -s 129.240.31.23  -p tcp --dport 23 -j accept\niptables –A FORWARD –s 131.234.142.33 –p tcp -–dport 22 –j accept\niptables –A FORWARD –s 131.234.142.33 –j drop</pre>" +
      "<p><strong>Vil følgende trafikk slippes igjennom?</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Hvert riktig svar gir 0,25 poeng, hvert gale gir -0,25 og ubesvart gir 0 poeng. Minimum 0 poeng.",
      regel: { riktig: 0.25, feil: -0.25, blankt: 0, min: 0, maks: 2 },
      kolonner: ["Ja", "Nei"],
      multi: false,
      rader: [
        { s: "RDP-trafikk fra 131.234.142.33", svar: [1], explain: "<p>RDP bruker port 3389. Ikke port 80 (regel 1) eller 22 (regel 5), så den treffer siste regel «–s 131.234.142.33 –j drop»: <strong>Nei</strong>.</p>" },
        { s: "HTTPS-trafikk fra 131.234.142.33", svar: [1], explain: "<p>HTTPS er port 443. Bare 80 og 22 er åpnet for denne adressen, så siste regel dropper den: <strong>Nei</strong>.</p>" },
        { s: "SSH-trafikk fra 131.234.142.33", svar: [0], explain: "<p>SSH er TCP port 22, som treffer regel 5 (accept) før drop-regelen: <strong>Ja</strong>.</p>" },
        { s: "HTTP-trafikk fra 129.240.31.23", svar: [1], explain: "<p>All TCP fra 129.240.31.23 droppes av regel 3: <strong>Nei</strong>.</p>" },
        { s: "HTTP-trafikk fra 141.10.10.10", svar: [1], explain: "<p>Ingen regel nevner 141.10.10.10. Da avgjør standardpolicyen, og fasit forutsetter at den er DROP: <strong>Nei</strong>. (Med iptables' standardpolicy ACCEPT ville den sluppet gjennom, se avvik.)</p>" },
        { s: "HTTP-trafikk fra 131.234.142.33", svar: [0], explain: "<p>HTTP er TCP port 80, som treffer første regel (accept): <strong>Ja</strong>.</p>" },
        { s: "Telnet-trafikk fra 129.240.31.23", svar: [1], explain: "<p>Telnet (port 23) har en accept-regel (regel 4), men regel 3 dropper all TCP fra denne adressen først. Første treff vinner: <strong>Nei</strong>.</p>" },
        { s: "UDP-trafikk fra 129.240.31.23", svar: [1], explain: "<p>Regel 3 gjelder bare TCP, så UDP treffer ingen regel. Standardpolicyen avgjør, og fasit forutsetter DROP: <strong>Nei</strong>.</p>" }
      ]
    },
    losning: [
      "Trafikk gjennom brannmuren går i FORWARD-kjeden. INPUT-regelen (regel 2) gjelder trafikk til brannmuren selv og er irrelevant her.",
      "Reglene leses ovenfra; første regel som treffer, avgjør.",
      "Regel 4 (Telnet-accept) nås aldri, fordi regel 3 allerede har droppet all TCP fra samme adresse.",
      "Trafikk som ingen regel treffer, avgjøres av standardpolicyen; fasit forutsetter at den er DROP."
    ],
    tips: ["Lag deg en tabell: kilde, protokoll, port → første treff.", "Kjenn portene: HTTP 80, HTTPS 443, SSH 22, Telnet 23, RDP 3389."],
    avvik: ["Standardpolicyen for FORWARD er ikke oppgitt. iptables har ACCEPT som standard, så fasit «Nei» for HTTP fra 141.10.10.10 og UDP fra 129.240.31.23 (som ingen regel treffer) forutsetter at policyen er satt til DROP.", "Regelteksten bruker tankestrek (–A, –s, –j, -–dport) og små bokstaver (accept/drop), mens iptables krever bindestrek og ACCEPT/DROP; dette er beholdt ordrett og påvirker ikke fasit."]
  });
  P("24", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Brannmuren er en dørvakt med en liste. Han leser lista ovenfra og gjør det den første linja som passer sier. Står du ikke på lista i det hele tatt, slipper du ikke inn (i denne oppgaven).</p>",
      normal: "<p>En tilstandsløs brannmur vurderer hver pakke mot reglene i rekkefølge. Første treff bestemmer. Derfor betyr rekkefølgen alt: en bred drop-regel tidlig skygger for en smal accept-regel senere. Trafikk som ikke treffer noen regel, får standardpolicyen.</p>",
      teknisk: "<p>iptables har kjedene INPUT (til verten), OUTPUT (fra verten) og FORWARD (gjennom verten). Hver regel matcher på f.eks. -s (kilde), -p (protokoll) og --dport (målport), og -j angir mål (ACCEPT/DROP).</p><p>Standardpolicy settes med «iptables -P FORWARD DROP»; uten den er den ACCEPT, og det er vanlig å avslutte med en eksplisitt DROP. Tilstandsløs betyr at returtrafikk må tillates med egne regler.</p>"
    }
  });

  /* =====================================================================
     DEL 5: AUTENTISERING OG IAM
     ===================================================================== */

  add({
    key: "H2025-25", oppgave_nr: "Oppgave 25", del: D5,
    ark: "Passnøkler 1", title: "Passnøkkel-arkitektur",
    points: 3, block: "autentisering", tema: ["passnøkler", "FIDO", "challenge-respons", "autentikator"],
    gjenganger: ["H2022-8.3", "H2023-33"],
    oppgave: "<p>Figuren viser en enkel arkitektur for online brukerautentisering med passnøkler. Flytt tekstelementene til riktig plass i figuren.</p>" +
      "<p>Poeng: 0,5p for hver riktig, -0,5p for feil, 0p for ubesvart, 3p for alle riktig, minimum 0p.</p>",
    figur: {
      beskrivelse: "Figur fra venstre mot høyre. LENGST TIL VENSTRE: en blå person merket «Bruker». Fra brukeren går en stor lys grønn blokkpil mot høyre med teksten «Bruker autentiserer til klient», og en buet pil over den fra brukeren til klienten; på den buede pila står svarfelt 1. I MIDTEN: en avrundet boks merket «Klient» med en bærbar PC; inne i boksen, over PC-en, står svarfelt 2. Fra klienten går en stor lys grønn blokkpil mot høyre med teksten «Klient autentiserer til tjener». Over den går en buet pil fra tjenerne tilbake til klienten (høyre → venstre) med svarfelt 3. Under blokkpila går en buet pil fra klienten til tjenerne (venstre → høyre) med svarfelt 4. LENGST TIL HØYRE: en avrundet boks merket «Autentiseringstjenere» med tre tjenerskap; øverst i boksen står svarfelt 5. Over figuren står dra-boksene «Respons», «Offentlige nøkler», «Passnøkler», «Challenge», «Autentikator».",
      tekst: ["Bruker", "Klient", "Autentiseringstjenere", "Bruker autentiserer til klient", "Klient autentiserer til tjener"]
    },
    inspera: {
      type: "D",
      regelTekst: "Poeng: 0,5p for hver riktig, -0,5p for feil, 0p for ubesvart, 3p for alle riktig, minimum 0p.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
      regelMerknad: "Fem felt à 0,5 gir 2,5 p. Alle fem riktige gir 3 p (0,5 i bonus).",
      tekst: null,
      bank: ["Respons", "Offentlige nøkler", "Passnøkler", "Challenge", "Autentikator"],
      felt: [
        { etikett: "Buet pil fra Bruker til Klient", svar: 4, explain: "<p>Brukeren låser opp klienten med en <strong>autentikator</strong>: PIN, fingeravtrykk eller ansikt. Det skjer lokalt; ingenting av dette sendes til tjeneren.</p>" },
        { etikett: "Inne i Klient-boksen", svar: 2, explain: "<p>De private <strong>passnøklene</strong> ligger lagret i klienten (eller i en brikke koblet til den), én per nettsted.</p>" },
        { etikett: "Buet pil fra tjener til klient (øverst)", svar: 3, explain: "<p>Tjeneren sender en tilfeldig <strong>challenge</strong> (utfordring) til klienten, så svaret ikke kan gjenbrukes.</p>" },
        { etikett: "Buet pil fra klient til tjener (nederst)", svar: 0, explain: "<p>Klienten signerer challengen med den private passnøkkelen og sender <strong>respons</strong> tilbake.</p>" },
        { etikett: "I Autentiseringstjenere-boksen", svar: 1, explain: "<p>Tjeneren har bare de <strong>offentlige nøklene</strong>, som den bruker til å verifisere responsen. Lekker tjenerens database, er det ingen hemmeligheter å stjele.</p>" }
      ]
    },
    losning: [
      "Venstre del: bruker → klient med autentikator (lokal opplåsing).",
      "Midten: passnøklene (private) i klienten.",
      "Høyre del: challenge fra tjener, respons fra klient, offentlige nøkler hos tjeneren."
    ],
    tips: ["Retningen på pilene avslører challenge (tjener → klient) og respons (klient → tjener)."]
  });
  P("25", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Du låser opp telefonen med fingeren. Nettstedet gir telefonen en oppgave, og telefonen løser den med en hemmelig nøkkel som aldri forlater telefonen. Nettstedet har bare en «fasit» som kan sjekke svaret, men ikke lage det.</p>",
      normal: "<p>Med passnøkler skjer autentiseringen i to steg. Først autentiserer brukeren seg lokalt til klienten med en autentikator (PIN eller biometri). Deretter autentiserer klienten seg til tjeneren med challenge-respons: tjeneren sender en tilfeldig verdi, klienten signerer den med den private passnøkkelen, og tjeneren verifiserer med den offentlige nøkkelen.</p>",
      teknisk: "<p>FIDO2/WebAuthn: ved registrering lager klienten et nøkkelpar per domene og sender den offentlige nøkkelen til tjeneren. Ved innlogging sender tjeneren en challenge; klienten returnerer S = Sig(challenge + domenedata, K<sup>bruker</sup><sub>priv</sub>), og tjeneren sjekker S med K<sup>bruker</sup><sub>pub</sub>. Den private nøkkelen forlater aldri klienten, og den lokale autentikatoren (PIN/biometri) sendes aldri over nettet.</p>"
    }
  });

  add({
    key: "H2025-26", oppgave_nr: "Oppgave 26", del: D5,
    ark: "Passnøkler 2", title: "Phishing og phishingresistens",
    points: 2, block: "autentisering", tema: ["phishing", "passnøkler", "phishingresistens", "domenenavn"],
    oppgave: "<p>Velg riktig(e) svar på spørsmålene nedenfor. Hvert spørsmål kan ha flere enn ett riktig svar.</p>" +
      "<p>Poeng: 0.5p for hver riktig, -0.5p for feil, 0p for ubesvart, Maks 2p, minimium 0p.</p>",
    inspera: {
      type: "FF",
      regelTekst: "Poeng: 0.5p for hver riktig, -0.5p for feil, 0p for ubesvart, Maks 2p, minimium 0p.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      regelMerknad: "To delspørsmål med fire alternativer hver (se grupper). Regelen gjelder samlet for alle åtte alternativene.",
      grupper: [
        { sporsmal: "<p>1) Hva er en phishing-melding?</p><p><strong>Velg ett eller flere alternativer</strong></p>", fra: 0, til: 3 },
        { sporsmal: "<p>2) Hva gjør at autentisering med passnøkler regnes som phishingresistent?</p><p><strong>Velg ett eller flere alternativer.</strong></p>", fra: 4, til: 7 }
      ],
      alternativer: [
        "En melding som lurer brukeren til å utføre en handling som bryter sikkerheten",
        "En melding med reklame, enten den er ønsket eller uønsket.",
        "En melding med uønsket reklame, men som ellers ikke lurer brukeren..",
        "En melding med lenke til en falsk nettside som lurer brukeren til å oppgi brukernavn og autentikator(er).",
        "Under autentisering vil autentiseringstjeneren sjekke at passnøkkelen passer sammen med den offentlige nøkkelen.",
        "Under autentiseringen vil klienten sjekke at passnøkkelen inneholder domenenavnet til nettsiden som foretar brukerautentisering.",
        "Hver passnøkkel inneholder domenenavnet til nettsiden som foretar brukerautentisering.",
        "Under autentisering vil klienten sjekke at passnøkkelen passer sammen med den offentlige nøkkelen."
      ],
      svar: [0, 3, 5, 6],
      explain: [
        "<p>Riktig. Den generelle definisjonen: phishing lurer brukeren til en handling som bryter sikkerheten (klikke, installere, oppgi noe).</p>",
        "<p>Feil. Reklame er ikke phishing, verken ønsket eller uønsket.</p>",
        "<p>Feil. Uønsket reklame er spam. Phishing krever at brukeren blir lurt.</p>",
        "<p>Riktig. Det klassiske eksempelet: lenke til falsk innloggingsside som stjeler brukernavn og autentikator.</p>",
        "<p>Feil, ikke grunnen til phishingresistens. Tjeneren verifiserer med den offentlige nøkkelen, men det skjer også ved vanlig signaturbasert innlogging. Det hindrer ikke at brukeren lures til en falsk side.</p>",
        "<p>Riktig. Klienten (nettleseren) sjekker at domenet passnøkkelen er laget for, er det samme som nettstedet brukeren faktisk er på. På en falsk side finnes ingen passende passnøkkel.</p>",
        "<p>Riktig. Hver passnøkkel er bundet til domenenavnet den ble registrert for. Det er dette som gjør klientens sjekk mulig.</p>",
        "<p>Feil. Klienten har den private passnøkkelen; det er tjeneren som har den offentlige nøkkelen og verifiserer. Klienten gjør ingen slik sjekk.</p>"
      ]
    },
    losning: [
      "1): Phishing = lure brukeren (generelt) og falsk innloggingsside (konkret). Reklame/spam er ikke phishing.",
      "2): Domenebindingen: passnøkkelen inneholder domenet, og klienten sjekker det. Brukeren kan ikke lures, fordi det er klienten som sjekker, ikke mennesket."
    ],
    tips: ["Phishingresistens handler om hvem som sjekker adressen: med passord er det brukeren (som kan lures), med passnøkler er det klienten (som ikke kan lures)."],
    avvik: "«minimium» og dobbelt punktum i «lurer brukeren..» beholdt ordrett."
  });
  P("26", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>En svindler lager en falsk butikk som ser ekte ut. Et menneske kan bli lurt, men nøkkelen din er laget for én bestemt dør og passer ikke i den falske. Telefonen ser at adressen er feil og nekter.</p>",
      normal: "<p>Phishing lurer brukeren til å gjøre noe som skader sikkerheten, ofte å skrive inn passord på en falsk side. Passnøkler er bundet til domenenavnet. Når klienten skal logge inn, bruker den bare en passnøkkel som passer med domenet den faktisk er på, så en falsk side får ingenting.</p>",
      teknisk: "<p>I WebAuthn har hvert nøkkelpar et Relying Party ID (domenet). Nettleseren tar inn domenet til siden og signerer bare med en nøkkel registrert for nettopp det RP ID-et, og domenedataene inngår i det som signeres. En phishingside på et lignende domene får derfor verken signatur eller nøkkel. Verifisering med offentlig nøkkel på tjenersiden gir autentisering, men ikke phishingresistens i seg selv.</p>"
    }
  });

  add({
    key: "H2025-27", oppgave_nr: "Oppgave 27", del: D5,
    ark: "Passnøkler 3", title: "Synkroniserte passnøkler og NIST AL3",
    points: 3, block: "autentisering", tema: ["passnøkler", "passordbank", "synkronisering", "NIST SP 800-63-4", "AAL3"],
    oppgave: "<p>Oppgave 1. En bruker benytter en passordbank som støtter synkronisering av passnøkler mellom brukerens ulike enheter. Forklar kort et realistisk phishing-scenario som gjør at brukerens passnøkler kan bli stjålet eller misbrukt. Skriv maks tre setninger.</p><p>Poeng: 2p for et realistisk scenario.</p>" +
      "<p>Oppgave 2. NIST SP 800-63-4 \"Retningslinjer for digital identitet\" er en veileder for brukerautentisering i amerikansk e-forvaltning. Veilederen definerer tre \"Assurance Levels\" for autentisering, dvs. AL1, AL2, og AL3. For at en autentiseringsordninger med passnøkler skal tilfredsstille krav til AL3 (høyeste nivå), hva sier veilederen om synkronisering av passnøkler? Skriv maks tre setninger.</p><p>Poeng: 1p for korrekt beskrivelse.</p>",
    inspera: {
      type: "E",
      regelTekst: "Poeng: 2p for et realistisk scenario. / Poeng: 1p for korrekt beskrivelse.",
      regel: { min: 0, maks: 3 },
      deler: [
        { del: "Oppgave 1", poeng: 2, sporsmal: "<p>Forklar kort et realistisk phishing-scenario som gjør at brukerens passnøkler kan bli stjålet eller misbrukt.</p>", grense: "maks tre setninger" },
        { del: "Oppgave 2", poeng: 1, sporsmal: "<p>Hva sier veilederen om synkronisering av passnøkler for AL3?</p>", grense: "maks tre setninger" }
      ]
    },
    losning: [
      "1: Det svake punktet er innloggingen til passordbanken, som ikke beskyttes av passnøkler. Phish den, så får angriperen synkronisert passnøklene.",
      "2: På AL3 kan passnøkler ikke synkroniseres; nøkkelen må være bundet til én enhet, typisk en maskinvarebrikke."
    ],
    tips: ["Lysarket om utfordringer med passnøkler sier rett ut at tilgang til passnøkler i skyen til syvende og sist krever tradisjonell autentisering som ikke er phishingresistent."],
    avvik: "«autentiseringsordninger» (skal være entall) og «hver passnøkler» i fasit beholdt ordrett. Arket skriver «AL1–AL3»; NIST kaller dem AAL1–AAL3."
  });
  P("27", {
    type: "skjonn",
    svar: [
      { del: "Oppgave 1", tekst: "<p>Angriperen sender en e-post som ser ut til å komme fra passordbanken, med lenke til en falsk innloggingsside. Brukeren skriver inn hovedpassord og engangskode der, fordi innloggingen til passordbanken ikke selv er beskyttet med passnøkler. Angriperen logger så inn i passordbanken, får passnøklene synkronisert til sin egen enhet og kan logge inn som brukeren overalt.</p>", poeng: ["Realistisk scenario: phishing av autentikatorene til passordbanken (2p)"] },
      { del: "Oppgave 2", tekst: "<p>For AL3 kan passnøkler ikke synkroniseres. Den private nøkkelen må være bundet til én enhet og ikke kunne kopieres ut, typisk lagret i en maskinvarebrikke.</p>", poeng: ["Ingen synkronisering, enhetsbundet nøkkel (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>Passnøklene er trygge, men hvis de ligger i en safe i skyen, holder det at tyven lurer deg til å gi fra deg koden til safen. Det høyeste sikkerhetsnivået krever derfor at nøkkelen bare finnes på én fysisk dings.</p>",
      normal: "<p>Synkronisering gjør passnøkler praktiske, men flytter angrepsflaten til kontoen som synkroniserer dem. Den kontoen beskyttes ofte med passord og engangskode, som kan phishes. NIST krever derfor på høyeste nivå at nøkkelen ikke kan synkroniseres eller eksporteres.</p>",
      teknisk: "<p>Synkroniserte passnøkler er kopierbare og lagres kryptert i en skytjeneste; sikkerheten blir da aldri bedre enn autentiseringen til den tjenesten og gjenopprettingsrutinene. NIST SP 800-63-4 godtar synkroniserbare autentikatorer på AAL2, men AAL3 krever en ikke-eksporterbar privat nøkkel (enhetsbundet, typisk i maskinvare, f.eks. en FIDO-sikkerhetsnøkkel), slik at nøkkelen ikke kan finnes i mer enn én autentikator.</p>"
    },
    sensor: {
      deler: [
        { del: "Oppgave 1", fasit: "<p>Oppgave 1 (2p). Tilgang til passordbanken er ikke phishingresistent fordi den ikke kan benytte passnøkler (som ellers ville være lagret i passordbanken). Angriperen kan dermed sende phishing som lurer brukeren til å oppgi autentikator(er) til passordbanken.</p>", kriterier: "<p>Poeng: 2p for et realistisk scenario.</p>" },
        { del: "Oppgave 2", fasit: "<p>Oppgave 2 (1p). Passnøkler kan ikke synkroniseres. Dvs. at hver passnøkler kun er lagret i, og bundet til enheten, som typisk er en autentiseringsbrikke.</p>", kriterier: "<p>Poeng: 1p for korrekt beskrivelse.</p>" }
      ],
      merknad: null
    }
  });

  /* =====================================================================
     DEL 6: ISMS OG RISIKOSTYRING
     ===================================================================== */

  add({
    key: "H2025-28", oppgave_nr: "Oppgave 28", del: D6,
    ark: "ISMS", title: "ISO 27001-kapitler og PDCA",
    points: 4, block: "risiko", tema: ["ISO/IEC 27001", "ISMS", "PDCA", "NSM grunnprinsipper"],
    gjenganger: ["H2021-8.1", "H2023-36"],
    oppgave: "<p>Standarden <strong>ISO/IEC 27001 ISMS - Krav</strong> inneholder 10 kapitler, hvorav kapitlene 4 - 10 beskriver krav til ISMS. Tabellen viser titlene på alle kapitlene. ISMS tolkes ofte etter den velkjente PDCA-modellen (Plan Do Check Act) for kvalitetsforbedring, som vist på figuren.</p>" +
      "<p>Å tolke ISMS etter PDCA betyr å tilordne hvert av kapitlene 4 - 10 til en av PDCA-fasene. I tillegg er en av fasene naturlig for drift av sikkerhet basert på f.eks. NSMs grunnprinsipper for IKT-sikkerhet.</p>" +
      "<p><strong>Velg riktig PDCA-fase for hvert av kapitlene 4 - 10, samt for NSMs grunnprinsipper for IKT-sikkerhet.</strong></p>",
    figur: {
      beskrivelse: "Til venstre: en turkis ring (syklus) med en lyseblå sirkel i midten merket «ISMS PDCA-syklus». Fire blå bokser i hjørnene: øverst til venstre «ACT», øverst til høyre «PLAN», nederst til høyre «DO», nederst til venstre «CHECK». På ringen står små sirkler med bokstavene A, P, D, C ved hver sin boks (syklusen går P → D → C → A med klokka). Til høyre: en tabell med overskrift «Kapitlene i ISO/IEC 27001 ISMS - Krav» i to kolonner.",
      tekst: ["1 Omfang (dvs. virkeområde)", "2 Normative referanser", "3 Termer og definisjoner", "4 Organisasjonens kontekst", "5 Ledelse", "6 Planlegging", "7 Støtte", "8 Drift", "9 Prestasjonsevaluering", "10 Forbedring"]
    },
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5p for hver riktig, -0,5p for feil, 0p for ubesvart. Maks 4p, minimum 0p.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 4 },
      kolonner: ["P", "D", "C", "A"],
      multi: false,
      rader: [
        { s: "4 Organisasjonens kontekst", svar: [0], explain: "<p>Å forstå virksomheten, interessenter og omfang er grunnlaget for å etablere ISMS: <strong>P</strong>.</p>" },
        { s: "5 Ledelse", svar: [0], explain: "<p>Ledelsens forpliktelse, policy og roller må på plass når ISMS etableres: <strong>P</strong>.</p>" },
        { s: "6 Planlegging", svar: [0], explain: "<p>Risikovurdering, risikohåndtering og sikkerhetsmål er planlegging: <strong>P</strong>.</p>" },
        { s: "7 Støtte", svar: [0], explain: "<p>Ressurser, kompetanse, bevissthet, kommunikasjon og dokumentasjon er forutsetninger som etableres i planfasen: <strong>P</strong>. (Fristende å svare D, men kurset legger kapittel 4–7 i P.)</p>" },
        { s: "8 Drift", svar: [1], explain: "<p>Å gjennomføre risikovurderinger og tiltak i praksis er å utføre: <strong>D</strong>.</p>" },
        { s: "9 Prestasjonsevaluering", svar: [2], explain: "<p>Overvåking, måling, internrevisjon og ledelsens gjennomgang er å evaluere: <strong>C</strong>.</p>" },
        { s: "10 Forbedring", svar: [3], explain: "<p>Avvikshåndtering, korrigerende tiltak og kontinuerlig forbedring: <strong>A</strong>.</p>" },
        { s: "NSMs grunnprinsipper for IKT-sikkerhet", svar: [1], explain: "<p>Grunnprinsippene er konkrete sikkerhetstiltak som implementeres og driftes. Kurset plasserer den konkrete styrkingen av sikkerheten i <strong>D</strong>-fasen.</p>" }
      ]
    },
    losning: ["Plan = kapittel 4–7, Do = 8, Check = 9, Act = 10.", "NSMs grunnprinsipper (eller NIST CSF) er det man driver med i Do-fasen."],
    tips: ["Lær fordelingen 4-5-6-7 / 8 / 9 / 10. Kapittel 7 (Støtte) er fellen.", "Kapittel 1–3 (omfang, referanser, termer) har ingen krav og hører ikke til noen fase."],
    avvik: "ISO/IEC 27001 (2013 og 2022) gjør ingen normativ PDCA-tilordning av kapitlene; det er en tolkning, og mange veiledere legger kapittel 7 (Støtte) i Do. Fasiten her legger kapittel 4–7 i P. Svar som fasiten på eksamen."
  });
  P("28", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Først planlegger du (hvem er vi, hvem bestemmer, hva er planen, hva trenger vi). Så gjør du det. Så sjekker du om det virket. Så forbedrer du, og starter på nytt.</p>",
      normal: "<p>PDCA er en forbedringssyklus. ISO 27001 sine kapitler 4–7 handler om å etablere styringssystemet (Plan), 8 om å drifte det (Do), 9 om å evaluere det (Check) og 10 om å forbedre det (Act). Selve sikkerhetstiltakene, for eksempel fra NSMs grunnprinsipper, gjennomføres i Do.</p>",
      teknisk: "<p>ISO/IEC 27001 er kravstandarden for ISMS og den som sertifiseres. Den sier hva styringssystemet skal inneholde, men ikke hvilke tiltak; tiltakene hentes fra tiltaksbanker som ISO/IEC 27002 (som utdyper Vedlegg A i 27001), NSMs grunnprinsipper eller NIST CSF. God styring av Do-fasen forutsetter at P-, C- og A-kravene er oppfylt, ellers blir tiltakene tilfeldige og forbedres aldri.</p>"
    }
  });

  add({
    key: "H2025-29", oppgave_nr: "Oppgave 29", del: D6,
    ark: "NSMs grunnprinsipper og ISO27001", title: "NSM vs. ISO 27001",
    points: 2, block: "risiko", tema: ["NSM grunnprinsipper", "ISO/IEC 27001", "ISO/IEC 27002"],
    gjenganger: ["H2023-37", "H2024-32"],
    oppgave: "<p>NSMs grunnprinsipper for IKT-sikkerhet, og ISO27001 er to standarder/veiledere for informasjonssikkerhet. Indiker om hvert utsagn nedenfor gjelder for NSM, ISO27001, begge eller ingen.</p>" +
      "<p><em>Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2, minimum 0.</em></p><p><strong>Indiker hva som gjelder for hvert utsagn.</strong></p>",
    inspera: {
      type: "M",
      regelTekst: "Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2, minimum 0.",
      regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
      kolonner: ["NSM", "ISO27001", "begge", "ingen"],
      multi: false,
      rader: [
        { s: "Kategoriserer sikkerhetstiltak etter sikkerhetsfunksjoner/prosesser (f.eks. kartlegge, beskytte, oppdage, håndtere)", svar: [0],
          explain: "<p>NSMs grunnprinsipper er delt i fire kategorier: identifisere og kartlegge, beskytte og opprettholde, oppdage, håndtere og gjenopprette. ISO 27001 er strukturert etter styringssystemets kapitler: <strong>NSM</strong>.</p>" },
        { s: "Standarden/veilederen må kjøpes", svar: [1],
          explain: "<p>ISO-standarder selges (via Standard Norge). NSMs grunnprinsipper er gratis på nett: <strong>ISO27001</strong>.</p>" },
        { s: "Tilgang er avgrenset til offentlige myndigheter", svar: [3],
          explain: "<p>Begge kan brukes av hvem som helst, offentlig eller privat: <strong>ingen</strong>.</p>" },
        { s: "Kan brukes sammen med ISO/IEC 27002", svar: [2],
          explain: "<p>ISO 27002 er en tiltaksbank. Den brukes sammen med ISO 27001 (Vedlegg A bygger på den), og NSMs prinsipper kan kombineres med den eller kryssrefereres mot den: <strong>begge</strong>.</p>" }
      ]
    },
    losning: ["Funksjonskategorier = NSM. Må kjøpes = ISO 27001. Bare for myndigheter = ingen. Sammen med 27002 = begge."],
    tips: ["NSM: 4 kategorier, 21 prinsipper, 118 tiltak. NIST CSF 2.0: 6 funksjoner (GOVERN er ny)."]
  });
  P("29", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>NSM gir deg en gratis sjekkliste sortert etter hva du gjør (finne, beskytte, oppdage, rydde opp). ISO 27001 er en regelbok du må kjøpe, og som sier hvordan du styrer sikkerhetsarbeidet. Alle kan bruke begge.</p>",
      normal: "<p>NSMs grunnprinsipper er en gratis tiltaksbank organisert etter sikkerhetsfunksjoner, som NIST CSF. ISO 27001 er en kjøpt kravstandard for styringssystemet (ISMS). Ingen av dem er begrenset til myndigheter, og begge kan brukes sammen med tiltakskatalogen ISO 27002.</p>",
      teknisk: "<p>ISO/IEC 27001 er sertifiserbar og stiller krav til ISMS (kapittel 4–10) med tiltak i Vedlegg A; ISO/IEC 27002 utdyper disse tiltakene. NSMs grunnprinsipper (4 kategorier, 21 prinsipper, 118 tiltak) er en anbefaling, ikke en sertifiserbar standard, og er kryssreferert mot ISO 27002 og NIST CSF. I et ISMS etter 27001 kan NSMs tiltak brukes i Do-fasen.</p>"
    }
  });

  add({
    key: "H2025-30", oppgave_nr: "Oppgave 30", del: D6,
    ark: "Risikoanalyse", title: "Risikoformel: produkt og sum",
    points: 2, block: "risiko", tema: ["risikonivå", "sannsynlighet", "konsekvens", "kvantitativ", "kvalitativ"],
    oppgave: "<p>Oppgave 1: Angi korrekt matematisk formel (som tekst) for beregning av risikonivå når sannsynlighet og konsekvens uttrykkes kvantitativt. Hva kalles den matematiske operatoren?</p><p>Maks 1p.</p>" +
      "<p>Oppgave 2: Angi korrekt matematisk formel (som tekst) for beregning av risikonivå når sannsynlighet og konsekvens uttrykkes som (kvalitative) logaritmiske nivåer. Hva kalles den matematiske operatoren?</p><p>Maks 1p.</p>",
    inspera: {
      type: "E",
      regelTekst: "Maks 1p. / Maks 1p.",
      regel: { min: 0, maks: 2 },
      deler: [
        { del: "Oppgave 1", poeng: 1, sporsmal: "<p>Formel og operator når sannsynlighet og konsekvens uttrykkes kvantitativt.</p>", grense: "formel som tekst" },
        { del: "Oppgave 2", poeng: 1, sporsmal: "<p>Formel og operator når sannsynlighet og konsekvens uttrykkes som logaritmiske nivåer.</p>", grense: "formel som tekst" }
      ]
    },
    losning: ["Kvantitativt: R = S × K (produkt).", "Logaritmiske nivåer: R = S + K (sum), fordi log(S × K) = log S + log K."],
    tips: ["Felle: å svare produkt på begge. Med logaritmiske skalaer (nivå 1, 2, 3 … der hvert trinn er en faktor) blir multiplikasjon til addisjon."]
  });
  P("30", {
    type: "skjonn",
    svar: [
      { del: "Oppgave 1", tekst: "<p>Risikonivå = Sannsynlighet × Konsekvens. Operatoren er multiplikasjon (produkt).</p>", poeng: ["Formel eller «produkt» (1p)"] },
      { del: "Oppgave 2", tekst: "<p>Risikonivå = Sannsynlighet + Konsekvens. Operatoren er addisjon (sum).</p>", poeng: ["Formel eller «sum» (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>Har du tall i kroner og prosent, ganger du dem. Har du «trinn» der hvert trinn er ti ganger større, legger du trinnene sammen, for å legge sammen trinn er det samme som å gange de egentlige tallene.</p>",
      normal: "<p>Kvantitativ risiko bruker ekte tall, f.eks. 0,5 ganger per år × 100 000 kr, og da multipliserer man. Kvalitative skalaer er ofte logaritmiske: hvert nivå er en faktor (f.eks. ti) større enn det forrige. Da tilsvarer det å legge sammen nivåene å multiplisere de underliggende verdiene.</p>",
      teknisk: "<p>Med S = 10<sup>s</sup> og K = 10<sup>k</sup> blir S × K = 10<sup>s+k</sup>, så risikonivået på logaritmisk skala er r = s + k. Kursets eksempel har s, k ∈ [0, 5] og r ∈ [0, 10]. Merk at formlene gir risikonivå; selve risikoen er kombinasjonen av trussel, sårbarhet og verdi.</p>"
    },
    sensor: {
      deler: [
        { del: "Oppgave 1", fasit: "<p>Risikonivå = Sannsynlighet x Konsekvens<br>Produkt/multiplikativ</p>", kriterier: "<p>Kvantitativ: (1p) for minst ett av de to svarene nedenfor:</p>" },
        { del: "Oppgave 2", fasit: "<p>Risikonivå = Sannsynlighet + Konsekvens<br>Sum/additiv</p>", kriterier: "<p>Kvalitativ: (1p) for minst ett av de to svarene nedenfor:</p>" }
      ],
      merknad: null
    }
  });

  /* =====================================================================
     DEL 7: SIKKER UTVIKLING
     ===================================================================== */

  add({
    key: "H2025-31", oppgave_nr: "Oppgave 31", del: D7,
    ark: "STRIDE", title: "STRIDE: seks trusler og brutt mål",
    points: 6, block: "utvikling", tema: ["STRIDE", "trusselmodellering", "sikkerhetsmål"],
    gjenganger: ["H2021-9.2", "H2022-4.2"],
    oppgave: "<p>STRIDE er et hjelpemiddel for trusselmodellering ved programvareutvikling. Hver av de seks bokstavene i STRIDE er forbokstaven for et engelsk trusselbegrep. For hver av de seks bokstavene, nevn</p><ol><li>trusselbegrepet på engelsk eller norsk, og</li><li>hvilken sikkerhetmålsetting trusselen medfører brudd på (f.eks. brudd på konfidensielitet, integritet, tilgjengelighet, autentisering etc.).</li></ol><p>Maks 6p.</p>",
    inspera: {
      type: "E",
      regelTekst: "Maks 6p.",
      regel: { min: 0, maks: 6 },
      deler: [{ del: "", poeng: 6, sporsmal: "<p>For hver av de seks bokstavene: trusselbegrep og sikkerhetsmålsetting som brytes.</p>", grense: "seks linjer" }]
    },
    losning: [
      "S – Spoofing → autentisitet. T – Tampering → integritet. R – Repudiation → sporbarhet/ubenektelighet.",
      "I – Information disclosure → konfidensialitet. D – Denial of service → tilgjengelighet. E – Elevation of privilege → tilgangskontroll/autorisering."
    ],
    tips: ["Én linje per bokstav, med både begrep og mål. 0,5 p hver, så ett glemt mål koster.", "STRIDE står ikke på lysarkene for 2026, men kan komme fra boka."],
    avvik: "Skrivefeil «sikkerhetmålsetting» og «konfidensielitet» beholdt ordrett."
  });
  P("31", {
    type: "skjonn",
    svar: [{ del: "", tekst: "<p>S – Spoofing (forfalskning av identitet): brudd på autentisitet.<br>T – Tampering (tukling): brudd på integritet.<br>R – Repudiation (benekting): brudd på sporbarhet/ubenektelighet.<br>I – Information disclosure (datalekkasje): brudd på konfidensialitet.<br>D – Denial of service (tjenestenekt): brudd på tilgjengelighet.<br>E – Elevation of privilege (utvidede rettigheter): brudd på tilgangskontroll (policyen for autorisering omgås).</p>",
      poeng: ["0,5p per riktig begrep (6 × 0,5)", "0,5p per riktig brutt mål (6 × 0,5)"] }],
    hvorfor: {
      eli5: "<p>STRIDE er en huskeliste over seks måter noen kan lage trøbbel på: late som de er en annen, endre ting, nekte for det de gjorde, se hemmeligheter, ødelegge tjenesten og få mer makt enn de skal ha.</p>",
      normal: "<p>Hver STRIDE-trussel er det motsatte av et sikkerhetsmål. Spoofing angriper autentisitet, tampering integritet, repudiation sporbarhet, information disclosure konfidensialitet, denial of service tilgjengelighet og elevation of privilege tilgangskontrollen. Utviklere går gjennom hver komponent og spør hvilke av de seks som kan skje.</p>",
      teknisk: "<p>STRIDE (Microsoft) brukes på dataflytdiagrammer: hver prosess, datalager, dataflyt og tillitsgrense vurderes mot de seks kategoriene.</p><p>Repudiation handler om at en aktør kan nekte for en handling fordi logging/signatur mangler; motmiddelet er sporbarhet og ubenektelighet (f.eks. digital signatur og sikre logger).</p><p>Elevation of privilege betyr at en aktør får rettigheter utover det policyen spesifiserer; tilgangskontrollen håndhever ikke autoriseringen.</p>"
    },
    sensor: {
      deler: [{ del: "",
        fasit: "<p>S Spoofing (Identitetstyveri) Brudd på autentisitet<br>T Tampering (Tukling) Brudd på integritet<br>R Repudiation (Benekting) Brudd på sporbarhet<br>I Information disclosure (Datatyveri og -lekkasje) Brudd på konfidensialitet<br>D Denial of service (Tjenestenekt) Brudd på tilgjengelighet<br>E Elevation of privilege (Utvidede tilganger) Brudd på tilgangskontroll</p>",
        kriterier: "<p>For hver bokstav, 0,5p for begrepet til bokstaven, og 0,5p for sikkerhetsmålet som brytes.</p>" }],
      merknad: "I arket står fasit i to kolonner (S, T, R til venstre; I, D, E til høyre)."
    }
  });

  add({
    key: "H2025-32", oppgave_nr: "Oppgave 32", del: D7,
    ark: "OWASP Top 10", title: "Hva er OWASP Top 10?",
    points: 3, block: "utvikling", tema: ["OWASP Top 10", "nettapplikasjoner", "sårbarheter"],
    gjenganger: ["H2022-4.2", "H2023-30", "H2024-25"],
    oppgave: "<p>Gi en kort beskrivelser av OWASP Top 10, Når ble siste utgave publisert? Bruk maks fire setninger.</p>",
    inspera: {
      type: "E",
      regelTekst: "Maks poeng: 3",
      regel: { min: 0, maks: 3 },
      deler: [{ del: "", poeng: 3, sporsmal: "<p>Kort beskrivelse av OWASP Top 10, og når siste utgave ble publisert.</p>", grense: "maks fire setninger" }]
    },
    losning: ["Hva: rangert liste over de ti mest kritiske sikkerhetsrisikoene for nettapplikasjoner.", "Nytte: råd om hvordan risikoene kan reduseres.", "Når: siste utgave kom i november 2025."],
    tips: ["Få med alle tre punktene: rangering av risikoer, råd om tiltak og årstallet."],
    avvik: ["«en kort beskrivelser» og stor N i «Når» etter komma beholdt ordrett.", "Det som kom 6.11.2025, var release candidate 1 av OWASP Top 10:2025 (top10.owasp.org/2025); 2025-utgaven har blant annet de nye kategoriene A03 Software Supply Chain Failures og A10 Mishandling of Exceptional Conditions. Fasiten sier «november 2025», så skriv det på eksamen."]
  });
  P("32", {
    type: "skjonn",
    svar: [{ del: "", tekst: "<p>OWASP Top 10 er en liste fra den ideelle organisasjonen OWASP som rangerer de ti mest kritiske sikkerhetsrisikoene for nettapplikasjoner, basert på data og erfaringer fra bransjen. For hver risiko forklarer den hvordan sårbarheten oppstår, og gir råd om hvordan den kan forebygges og risikoen reduseres. Siste utgave ble publisert i november 2025.</p>",
      poeng: ["Rangerer de mest kritiske risikoene for nettapplikasjoner", "Gir råd om å redusere sårbarhet og risiko", "Siste utgave november 2025"] }],
    hvorfor: {
      eli5: "<p>OWASP Top 10 er en «topp ti over de farligste feilene» i nettsider, med tips om hvordan man unngår dem. Den oppdateres med noen års mellomrom; den nyeste kom i november 2025.</p>",
      normal: "<p>OWASP (Open Worldwide Application Security Project) samler data om sårbarheter i nettapplikasjoner og lager en rangert liste over de ti viktigste risikoene, med forklaring og tiltak. Den brukes som sjekkliste i utvikling og testing og som felles språk mellom utviklere og sikkerhetsfolk.</p>",
      teknisk: "<p>Listen kombinerer data om hvor ofte sårbarheter forekommer med vurderinger av utnyttbarhet og konsekvens. Kategorier som brutt tilgangskontroll, kryptografiske feil og injeksjon (SQL, kommando, XSS) har gått igjen i flere utgaver. Utgaven fra 2021 ble etterfulgt av 2025-utgaven, som ble lagt fram som utkast (release candidate) i november 2025; fasiten oppgir november 2025. Den er et bevissthetsdokument, ikke en fullstendig standard; til krav brukes f.eks. OWASP ASVS.</p>"
    },
    sensor: {
      deler: [{ del: "",
        fasit: "<p>–Rangerer de 10 mest kritiske sikkerhetsrisikoene for nettapplikasjoner<br>–Gir råd om hvordan sårbarhet og risiko kan reduseres<br>–Siste utgave fra november 2025</p>",
        kriterier: "<p>Opp til 3p for tilsvarende dekkende beskrivelse</p>" }],
      merknad: null
    }
  });

  /* =====================================================================
     DEL 8: FYSISK SIKKERHET
     ===================================================================== */

  add({
    key: "H2025-33", oppgave_nr: "Oppgave 33", del: D8,
    ark: "SJA", title: "Hva står SJA for?",
    points: 1, block: "fysisk", tema: ["SJA", "sikker jobbanalyse", "HMS"],
    oppgave: "",
    inspera: {
      type: "T",
      regelTekst: "Maks poeng: 1",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      regelMerknad: "Arket har ingen egen poenglinje; maks poeng er 1. Vi antar 1 p for riktig, 0 ellers.",
      tekst: "<p>Hva står forkortelsen SJA for {0} .</p>",
      felt: [{ etikett: "SJA", godta: ["sikker jobbanalyse", "sikker jobb analyse", "sikker jobbanalyse (SJA)", "Safe Job Analysis"],
        explain: "<p><strong>Sikker jobbanalyse</strong>: en systematisk gjennomgang av risiko før en farlig arbeidsoppgave.</p>" }]
    },
    losning: ["Sikker jobbanalyse."],
    tips: ["Skriv det norske navnet, «sikker jobbanalyse». Store og små bokstaver og orddeling spiller ingen rolle, men det engelske «job safety analysis» står ikke i godkjentlista på arket."]
  });
  P("33", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>SJA er en «tenk før du gjør»-plan før farlig arbeid.</p>",
      normal: "<p>Sikker jobbanalyse brukes før arbeidsoppgaver med fare for ulykker, som arbeid i høyden. Man går gjennom stegene i jobben og vurderer hva som kan gå galt.</p>",
      teknisk: "<p>SJA er et HMS-verktøy for risikovurdering på oppgavenivå: oppgaven brytes ned i deloppgaver, faremomenter identifiseres, risiko vurderes og tiltak bestemmes før arbeidet starter. Kurset bruker det som eksempel på trygghet (safety) i fysisk sikkerhet.</p>"
    }
  });

  add({
    key: "H2025-34", oppgave_nr: "Oppgave 34", del: D8,
    ark: "SJA - del 2", title: "Formål og metode med SJA",
    points: 3, block: "fysisk", tema: ["SJA", "risikovurdering", "arbeidsulykker"],
    oppgave: "<p>A) Hva er vitsen med SJA (1p)</p><p>B) Hvordan skal prosesesn med å lage en SJA gjøres?</p><p>Maks 3p.</p>",
    inspera: {
      type: "E",
      regelTekst: "Maks 3p.",
      regel: { min: 0, maks: 3 },
      deler: [
        { del: "A)", poeng: 1, sporsmal: "<p>Hva er vitsen med SJA (1p)</p>", grense: "kort" },
        { del: "B)", poeng: 2, sporsmal: "<p>Hvordan skal prosesesn med å lage en SJA gjøres?</p>", grense: "kort" }
      ]
    },
    losning: ["A: Forhindre arbeidsulykker.", "B: Del opp den farlige oppgaven i små deler, og analyser risikoen i hver del for å finne tiltak som reduserer den."],
    tips: ["Bruk ordet «risiko» i B. Uten det gir sensor maks to poeng."],
    avvik: "«prosesesn» beholdt ordrett. Fasit har en ulukket parentes."
  });
  P("34", {
    type: "skjonn",
    svar: [
      { del: "A)", tekst: "<p>Hensikten er å forhindre arbeidsulykker ved farlig arbeid.</p>", poeng: ["Forhindre ulykker (1p)"] },
      { del: "B)", tekst: "<p>Arbeidsoppgaven deles opp i mindre deloppgaver. For hver del identifiserer man faremomenter og vurderer risikoen, og bestemmer tiltak som reduserer risikoen før jobben starter.</p>", poeng: ["Oppdeling (1p)", "Risikoanalyse per del for å redusere risiko (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>Før du klatrer opp for å bytte en lyspære, deler du jobben i små steg og tenker på hva som kan gå galt i hvert steg, og hvordan du unngår det.</p>",
      normal: "<p>SJA skal forebygge ulykker. Metoden er å bryte en farlig oppgave ned i steg, finne farene i hvert steg, vurdere risikoen og bestemme tiltak, gjerne sammen med dem som skal gjøre jobben.</p>",
      teknisk: "<p>SJA er risikostyring i liten skala: identifisere faremomenter, vurdere risiko (sannsynlighet og konsekvens), dele opp oppgaven og identifisere tiltak. Strukturen er den samme som i informasjonssikkerhetens risikovurdering, men målet er trygghet (safety) for personer.</p>"
    },
    sensor: {
      deler: [
        { del: "A)", fasit: "<p>Hensikten med sikker jobbanalyse er å forhindre arbeidsulykker (1p).</p>", kriterier: "" },
        { del: "B)", fasit: "<p>En potensielt farlig arbeidsoppgave deles opp i små deler, hvor risikoen i hver deloppgave analyseres for å eventuelt finne måter å redusere risikoen for ulykker</p>",
          kriterier: "<p>(1p for å nevne oppdeling, 1p for å analysere risiko for å redusere risiko.<br>Risiko må nevnes, ikke bare skrive å forhindre ulykker - hvis ikke gir oppgaven maks to poeng.</p>" }
      ],
      merknad: null
    }
  });

  add({
    key: "H2025-35", oppgave_nr: "Oppgave 35", del: D8,
    ark: "Emisjonssikkerhet", title: "Emisjonssikkerhet",
    points: 1, block: "fysisk", tema: ["TEMPEST", "emisjonssikkerhet", "elektromagnetisk stråling"],
    oppgave: "<p>Hva heter NATO-spesifikasjonen læreboken beskriver for å avlytte elektromagnetisk stråling for å kunne gjenskape signaler?</p><p>Riktig svar gir 1p.</p>",
    inspera: {
      type: "T",
      regelTekst: "Riktig svar gir 1p.",
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
      tekst: "<p>Fyll inn ditt {0} her.</p>",
      felt: [{ etikett: "NATO-spesifikasjonen", godta: ["TEMPEST", "NATO TEMPEST", "TEMPEST-standarden", "TEMPEST-spesifikasjonen", "TEMPEST-standard"], naer: { "Van Eck": "Van Eck-avlytting er selve angrepsteknikken. NATO-spesifikasjonen heter TEMPEST.", "van Eck phreaking": "Van Eck-avlytting er selve angrepsteknikken. NATO-spesifikasjonen heter TEMPEST." },
        explain: "<p><strong>TEMPEST</strong> handler om at elektronisk utstyr lekker elektromagnetisk stråling som kan fanges opp og brukes til å gjenskape signalene, og om hvordan man skjermer mot det.</p>" }]
    },
    losning: ["TEMPEST."],
    tips: ["Skriv navnet på fenomenet, TEMPEST. Tiltak: skjerming, Faradaybur, fiber i stedet for kobber, avstand."]
  });
  P("35", {
    type: "eksamen",
    hvorfor: {
      eli5: "<p>Skjermer og kabler «hvisker» litt radiostøy. Med riktig utstyr kan noen utenfor fange opp hviskingen og se hva som er på skjermen. TEMPEST er navnet på dette og på beskyttelsen mot det.</p>",
      normal: "<p>Elektronisk utstyr sender ut utilsiktet elektromagnetisk stråling. TEMPEST er NATO-navnet på avlytting av slik stråling og på kravene til å skjerme mot den. Det er en form for sidekanal.</p>",
      teknisk: "<p>Kompromitterende emisjon (f.eks. fra skjermsignaler, tastaturer eller kobberkabler) kan rekonstrueres på avstand («van Eck-avlytting»). Mottiltak er:</p><ul><li>skjermede rom (Faradaybur)</li><li>TEMPEST-sertifisert utstyr</li><li>sonering/avstand</li><li>fiberkabler, som ikke stråler slik kobber gjør</li></ul>"
    }
  });

  add({
    key: "H2025-36", oppgave_nr: "Oppgave 36", del: D8,
    ark: "Bytte lyspære", title: "Arbeid i høyden: hvor mange trengs?",
    points: 4, block: "fysisk", tema: ["arbeid i høyden", "lift", "personløfter", "HMS"],
    oppgave: "<p>Du skal bytte en lyspære. Den er tre meter opp i luften, og det skal benyttes en lift (personløfter).</p>" +
      "<p>Bruk det du har lært i kurset til å besvare, og begrunne følgende spørsmål (bruk relevante regler som du har lært om i kurset og du kan se bort fra SJA):</p>" +
      "<p><em>\"Hvor mange IN2120-studenter trengs for å bytte en lyspære?\"</em></p><p>Ps: Du trenger ikke finne på en vits her.<br>PPs: Du får lov.</p><p>Maks 4p.</p>",
    inspera: {
      type: "E",
      regelTekst: "Maks 4p.",
      regel: { min: 0, maks: 4 },
      deler: [{ del: "", poeng: 4, sporsmal: "<p>\"Hvor mange IN2120-studenter trengs for å bytte en lyspære?\" Begrunn med regler fra kurset.</p>", grense: "kort" }]
    },
    losning: ["Minst to personer ved arbeid i høyden.", "Én av dem skal være på bakken.", "Begge skal ha opplæring i bruk av lift."],
    tips: ["Tre poenggivende momenter: to personer (2p), én på bakken (1p), begge med opplæring (1p)."]
  });
  P("36", {
    type: "skjonn",
    svar: [{ del: "", tekst: "<p>To. Ved arbeid i høyden med lift skal det alltid være minst to personer til stede: én i liften som bytter pæra og én på bakken som kan varsle og hjelpe (f.eks. nødsenke liften) hvis noe skjer. Begge må ha gyldig opplæring i bruk av liften.</p>",
      poeng: ["Minst to personer (2p)", "Én på bakken (1p)", "Begge har opplæring (1p)"] }],
    hvorfor: {
      eli5: "<p>Den ene står oppe og skrur, den andre står nede og passer på. Begge har lært å kjøre liften.</p>",
      normal: "<p>Arbeid i høyden kan gi alvorlige fallulykker. Regelen er minst to personer, der én er på bakken og kan tilkalle hjelp eller kjøre liften ned hvis den som er oppe blir skadet eller liften svikter. Begge må ha opplæring.</p>",
      teknisk: "<p>Kravene er personellsikkerhet i praksis:</p><ul><li>dobbel bemanning gir redundans (ingen alene i en farlig situasjon)</li><li>personen på bakken kan bruke nødbetjening og sikre området mot trafikk</li><li>opplæring er et krav for å betjene personløftere</li></ul><p>Tilsvarende prinsipp i informasjonssikkerhet er tomannsregel og funksjonsdeling.</p>"
    },
    sensor: {
      deler: [{ del: "",
        fasit: "<p>Det skal være minst to personer, hvorav minst en må være på bakken.<br>Begge må ha gyldig opplæring i bruken av lift.</p>",
        kriterier: "<p>Gi to poeng for å skrive at det må være to personer, ett poeng for å skrive at en må være på bakken, og ett poeng for å skrive at begge må ha opplæring.</p>" }],
      merknad: null
    }
  });

  /* =====================================================================
     DEL 9: BOBS PASSORD
     ===================================================================== */

  add({
    key: "H2025-37", oppgave_nr: "Oppgave 37", del: D9,
    ark: "Bobs passord", title: "Hvem får tak i Bobs passord?",
    points: 9, block: "nettverk", tema: ["TLS", "HSTS", "keylogger", "MitM", "ende-til-ende-kryptering"],
    oppgave: "<p>Bob er toppsjef for det store konsernet Bob Inc.</p>" +
      "<p>Bob er opptatt av passordsikkerhet, og bytter passord hvert sjette måned (du kan se helt bort fra evt trussel fra kvantedatamaskiner i denne oppgaven).</p>" +
      "<p>Bob har funnet Stines nettside som sjekker passordstyrke. Passordet sjekkes av et script som kjører på serveren som hoster nettsiden.</p>" +
      "<p>Nettsiden ser slik ut (forenklet - forutsett at nettsiden ser ut som en legitim fullstendig nettside) og Bob har tastet inn passordet sitt. Passordet til Bob er: \"DettePassordetErLangtSomEtVondtÅr688AS%!@\" Nettsiden er satt opp med TLS, og HSTS er implementert. Det er ikke første gang Bob bruker nettsiden med samme nettleser.</p>" +
      "<p>[Bilde av nettsiden, se figur]</p><p>Nettverket som benyttes ser slik ut:</p><p>[Tegning av nettverket, se figur]</p>" +
      "<p>Som vi ser av tegningen (nettverket er større, men vi fokuserer på denne delen) er Bob pålogget en terminalserver via wifi. Emma har en keylogger på Bobs maskin. Kjersti avlytter wifi-trafikken mellom Bob og terminalserveren. Tomas har foretatt et vellykket man in the middle-angrep, og står mellom terminalserveren og brannmuren i Bobs nett. Jørgen har hacket Tomas sin maskin, men er ikke admin på den.</p>" +
      "<p>Gunnar er systemadministrator hos teleleverandøren, og all trafikken går igjennom hans utstyr.</p>" +
      "<p>I nettverket til Stine (det er hennes server), er Frank MiTM mellom brannmuren og Stines server og Matias har hacket Franks maskin. Matias har fått root-tilgang på Franks maskin.</p>" +
      "<p><strong>Oppgave:</strong> Hvem, hvis noen av disse personene (bortsett fra Bob) kan nå ha få fatt i Bobs passord.<br>Begrunn svaret (både hvorfor, og hvorfor ikke) for hver person, og hvis begrunnelsen er lik for flere personer - så kan de selvsagt grupperes (person x, y og z har/ikke passordet fordi &lt;begrunnelse&gt;.)</p>" +
      "<p>Maks 9p.</p>",
    figur: {
      beskrivelse: "To bilder. BILDE 1 (nettsiden): overskrift «Vi analyserer passordet ditt og forteller deg om det er sikkert», under den «Tast inn passordet ditt i boksen», et tekstfelt som viser passordet i klartekst «DettePassordetErLangtSomEtVondtÅr688AS%!@», og under feltet teksten «Passordet ditt er sterkt, fortsett sånn!». " +
        "BILDE 2 (håndtegnet på tavle, blå tusj): to skyer forbundet via en midtsky. VENSTRE SKY merket «BOB INC»: boksen «BOB» med en bølget linje merket «WIFI» til en høy boks «TERMINAL SERVER»; under BOB en boks «EMMA» koblet til BOB; over til venstre en boks «KJERSTI» med en stiplet linje ned mot wifi-forbindelsen. Terminalserveren er koblet til «SWITCH», som er koblet til «FW» (brannmur) ytterst i skyen. Over switchen en boks «TOMAS» koblet til switchen, og over TOMAS en boks «JØRGEN» koblet til TOMAS. MIDTSKY merket «INTERNETT» med en boks «GUNNAR» som all trafikk går gjennom. HØYRE SKY: «FW» koblet til «SWITCH», som er koblet til «STINE» (serveren). Over switchen en boks «FRANK» koblet til switchen, og over FRANK en boks «MATIAS» koblet til FRANK.",
      tekst: ["Vi analyserer passordet ditt og forteller deg om det er sikkert", "Tast inn passordet ditt i boksen", "DettePassordetErLangtSomEtVondtÅr688AS%!@", "Passordet ditt er sterkt, fortsett sånn!", "BOB INC", "BOB", "WIFI", "EMMA", "KJERSTI", "TERMINAL SERVER", "SWITCH", "FW", "TOMAS", "JØRGEN", "INTERNETT", "GUNNAR", "FRANK", "MATIAS", "STINE"]
    },
    inspera: {
      type: "E",
      regelTekst: "Maks 9p.",
      regel: { min: 0, maks: 9 },
      deler: [{ del: "", poeng: 9, sporsmal: "<p>Hvem, hvis noen av disse personene (bortsett fra Bob) kan nå ha få fatt i Bobs passord? Begrunn for hver person.</p>", grense: "begrunn per person eller gruppe" }]
    },
    losning: [
      "Finn de to endepunktene der passordet finnes i klartekst: Bobs tastatur (før TLS) og Stines server (etter TLS).",
      "Emma (keylogger på Bobs maskin) får passordet: tastetrykkene fanges før de krypteres.",
      "Stine får passordet: serveren hennes terminerer TLS og scriptet leser passordet i klartekst.",
      "Alle mellom endepunktene (Kjersti, Tomas, Jørgen, Gunnar, Frank, Matias) ser bare TLS-kryptert trafikk. HSTS og at Bob har besøkt siden før hindrer nedgradering til HTTP.",
      "Jørgen og Matias har bare tilgang til det Tomas og Frank ser, altså chiffertekst."
    ],
    tips: [
      "Grupper personene etter begrunnelse, slik oppgaven foreslår.",
      "Nevn ende-til-ende-kryptering (TLS fra nettleser til server) eksplisitt; sensor gir eget poeng for det.",
      "Fellen: å tro at MitM betyr at man ser alt. Med TLS og HSTS gir en MitM bare chiffertekst, og et falskt sertifikat gir en feilmelding brukeren ikke kan klikke seg forbi.",
      "Bob er pålogget en terminalserver via wifi. Kjører nettleseren på terminalserveren, starter TLS der, og wifi-strekningen beskyttes av terminaløkta (RDP er kryptert, jf. H2025 23). Kjersti ser uansett bare chiffertekst."
    ],
    avvik: ["Modellsvaret sier «Jørgen vil potensielt plukke opp Franks signaler», men ifølge oppgaven har Jørgen hacket Tomas sin maskin (det er Matias som har hacket Frank). Konklusjonen (bare chiffertekst) er den samme.", "Poengfordelingen er tvetydig: Emma 3 p + Stine 3 p + «0,5 poeng for å nevne alle som ikke får tilgang … (totalt tre)» + «1 poeng for … ende-til endekryptering». Leses 0,5 p per person for de seks uten tilgang (= 3 p), blir summen 10 med ende-til-ende-poenget; leses «totalt tre» som tre grupper à 0,5 p, blir summen 8,5. Ingen lesning gir nøyaktig 9.", "Gunnar nevnes bare indirekte («Signalene går her gjennom Gunnars maskiner»)."]
  });
  P("37", {
    type: "skjonn",
    svar: [{ del: "", tekst:
      "<p><strong>Emma får passordet.</strong> Keyloggeren hennes sitter på Bobs maskin og registrerer tastetrykkene før de blir kryptert av TLS, altså i klartekst.</p>" +
      "<p><strong>Stine får passordet.</strong> Hun eier serveren, og TLS-forbindelsen ender (termineres) der. Scriptet som sjekker passordstyrken må få passordet i klartekst, så hun kan lese det.</p>" +
      "<p><strong>Kjersti, Tomas, Jørgen, Gunnar, Frank og Matias får ikke passordet.</strong> TLS gir ende-til-ende-kryptering fra Bobs nettleser til Stines server, så alt de kan avlytte på veien (wifi, MitM i Bobs nett, teleleverandørens utstyr, MitM i Stines nett) er chiffertekst.</p><p>HSTS og at Bob har brukt siden før med samme nettleser gjør at nettleseren bare godtar HTTPS med gyldig sertifikat, så Tomas og Frank kan ikke nedgradere til HTTP eller lure inn et falskt sertifikat.</p><p>Jørgen (uten admin på Tomas' maskin) og Matias (root på Franks maskin) kan i beste fall se det Tomas og Frank ser, altså chiffertekst.</p>",
      poeng: ["Emma (1p) + keylogger virker før TLS (2p)", "Stine (1p) + serveren terminerer TLS og ser klartekst (2p)", "De andre ser bare kryptert tekst (0,5p-poster)", "Ende-til-ende-kryptering nevnt (1p)"] }],
    hvorfor: {
      eli5: "<p>Bob skriver et hemmelig brev, legger det i en låst boks og sender det til Stine. Emma kikker over skulderen mens han skriver, så hun ser det. Stine har nøkkelen til boksen, så hun ser det. Alle postbudene på veien ser bare den låste boksen.</p>",
      normal: "<p>TLS krypterer fra nettleseren til serveren. Passordet finnes derfor i klartekst bare i hver ende: på Bobs maskin før kryptering (der keyloggeren er) og på Stines server etter dekryptering. Alle som sitter på veien, uansett om de avlytter, er mann-i-midten eller har hacket en mann-i-midten, ser bare kryptert trafikk. HSTS hindrer at noen tvinger forbindelsen over på ukryptert HTTP.</p>",
      teknisk: "<ul><li>TLS Handshake autentiserer serveren med et sertifikat og etablerer øktnøkler; Record-laget krypterer og integritetsbeskytter data.</li><li>En MitM uten serverens private nøkkel eller et sertifikat nettleseren stoler på, kan bare videresende chiffertekst.</li><li>HSTS (lagret fra tidligere besøk) gjør at nettleseren nekter HTTP og ikke lar brukeren overstyre sertifikatfeil, så TLS-stripping ikke virker.</li><li>Keyloggeren angriper endepunktet før kryptering, og serveren er det andre endepunktet: der kan eieren lese passordet (tillitsforvirring: en gyldig TLS-forbindelse sier ingenting om at mottakeren er ærlig).</li><li>Passordbytte hvert halvår hjelper ikke når Bob selv gir passordet til en tredjepart.</li></ul>"
    },
    sensor: {
      deler: [{ del: "",
        fasit: "<p>Denne oppgaven inneholder mange personer...</p>" +
          "<p>Emma, som har en keylogger vil kunne fange opp passordet - da en keylogger fungerer før TLS slår inn.</p>" +
          "<p>Kjerstis avlytting av åpne wifi-signaler plukker uansett bare opp TLS-kryptert tekst.</p>" +
          "<p>Frank og Tomas sine tilgang (MitM), ser også bare kryptert tekst. Signalene går her gjennom Gunnars maskiner, og blir helt tilsvarende.</p>" +
          "<p>Jørgen vil potensielt plukke opp Franks signaler, men vil bare se samme krypterte teksten som Frank får.<br>Matias har root- og vil plukke opp Franks signaler, men Frank har som kjent ikke det ukrypterte passordet...</p>" +
          "<p>Stine eier serveren, og siden serveren dekrypterer - så vil hun kunne plukke opp passordet til Bob.</p>",
        kriterier: "<p>Oppgaven gir 1 poeng for å si at Emma kan finne passordet, og to poeng til for å begrunne med at tastetrykkene jo kommer før TLS-kryptering.</p>" +
          "<p>Videre gis 1 poeng for å navngi Stine, og 2 til for å begrunne (terminering av TLS, eller på annen måte si at serveren ser teksten i klartekst ).</p>" +
          "<p>0,5 poeng for å nevne alle som ikke får tilgang til passordet (totalt tre) hvis de nevner noe om at disse personene uansett bare får tilgang til kryptert tekst (enten nevner TLS, eller sier noe om ende til ende-kryptering),</p>" +
          "<p>1 poeng for å si nevne ende-til endekryptering, enten med ord eller forklaring.</p>" }],
      merknad: "Se avvik: Jørgen/Frank er byttet om i modellsvaret, og poengpostene summerer ikke entydig til 9."
    }
  });
})();
