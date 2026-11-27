/* IN2120 · eksamensbank H2024. Kilde: UiO, IN2120 eksamen H2024 (Inspera-utskrift med rettenøkkel og
   retteinstrukser, behandlet som sensorveiledning). Oppgavetekst og fasit ordrett.
   Våre forklaringer (explain/losning/tips/hvorfor/svar) med egne ord.
   Kontrakt (format.md §4): F1-oppgaver med flere radiospørsmål (7, 14) har
   inspera.sporsmal = [{ tekst, alternativer, svar, explain }]. Samme form er brukt for FF med flere avkrysningsspørsmål (33, 37), en utvidelse. */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BANK = (window.IN_EXAM_BANK = window.IN_EXAM_BANK || {});
  IN.PERFEKT = IN.PERFEKT || {};

  var Y = "H2024";
  var D1 = "Del 1: Generelt";
  var D2 = "Del 2: Kryptografi og PKI";
  var D3 = "Del 3: Angrepsvektorer og skadevare";
  var D4 = "Del 4: Nettverkssikkerhet";
  var D5 = "Del 5: Autentisering og IAM";
  var D6 = "Del 6: ISMS og risikostyring";
  var D7 = "Del 7: Cyberoperasjoner";
  var D8 = "Del 8: Retten er satt";

  function R(riktig, feil, blankt, maks) {
    return { riktig: riktig, feil: feil, blankt: blankt, min: 0, maks: maks };
  }
  function MAN(maks) {
    return { manuell: true, min: 0, maks: maks };
  }

  var CTI_A = ["strategisk", "strategic", "strategiske"];
  var CTI_B = ["taktisk/operasjonell", "taktisk", "operasjonell", "tactical/operational", "tactical", "operational", "TTP", "operativ", "taktisk operasjonell", "operasjonell/taktisk", "taktisk og operasjonell", "taktisk eller operasjonell", "operational/tactical", "tactical and operational", "taktiske", "operasjonelle", "TTPs", "TTP-er"];
  var CTI_C = ["teknisk", "angrepsindikatorer", "attackidentifierare", "angrebsindikatorer", "indicators of compromise", "technical", "tekniske", "IoC", "IoCs", "IoC-er", "kompromitteringsindikatorer"];
  var RISIKO_ORD = ["verdier", "trusler", "sårbarheter", "assets", "vulnerabilities", "threats", "hot", "trussler", "verdiene", "truslene", "sårbarhetene", "verdiar", "truslar", "sårbarheiter"];

  BANK[Y] = {
    year: Y,
    dato: "25.11.2024",
    varighet: "4 timer",
    hjelpemidler: "Ingen",
    forside:
      "<p>Avsluttende eksamen i IN2120 Informasjonssikkerhet (Høst 2024).</p>" +
      "<p>Dato og tidspunkt: 25. november 2024, kl.9:00 - 13:00 (4 timer).</p>" +
      "<p>Ingen hjelpemidler er tillatt.</p>" +
      "<p>Merk følgende:</p><ul>" +
      "<li>Oppgavene i denne eksamenen er gruppert i åtte deler. Den første delen dekker grunnleggende aspekter ved informasjonssikkerhet på tvers av pensum, mens de øvrige delene er fra utvalgte områder av pensum.</li>" +
      "<li>Det er mulig å oppnå totalt 100 poeng (= 100%) ved å besvare alle oppgavene korrekt.</li>" +
      "<li>Man kan navigere frem og tilbake mellom oppgavene.</li>" +
      "<li>Skåring for hver oppgave angis eksplisitt. Det kan gis negative poeng for feil svar/valg, men total poengsum for hele oppgaven er minimum 0 (selv om summen over alle svarene er negativ).</li>" +
      "<li>Vær kortfattet når du skriver tekst som svar på en tekstoppgave. Svaret kan skrives på norsk, svensk, dansk eller engelsk.</li>" +
      "<li>Les oppgaveteksten nøye og spesielt der du skal fylle inn verdier i en tekstboks.</li>" +
      "<li>I navigasjonslinjen nederst på skjermen indikeres fullførte oppgaver med blå søyler.</li></ul>" +
      "<p><b>Tips!</b> Siden du kan gå frem og tilbake kan det være lurt og først svare på oppgavene du syns er lette, og deretter gå tilbake til vanskelige oppgaver hvis du har tid.</p>" +
      "<p>Lykke til, hilsen Audun, Åvald og Nils!</p>",
    deler: [
      { navn: D1, poeng: 29 },
      { navn: D2, poeng: 14 },
      { navn: D3, poeng: 12 },
      { navn: D4, poeng: 20 },
      { navn: D5, poeng: 5 },
      { navn: D6, poeng: 8 },
      { navn: D7, poeng: 5 },
      { navn: D8, poeng: 10 }
    ],
    merknad:
      "Maks poeng summerer til 103, men forsiden sier «totalt 100 poeng». Arket oppgir ikke delpoeng; tallene i «deler» er summen av «Maks poeng» per del. Hvordan sensor skalerte de tre ekstra poengene, er ukjent.",
    oppgaver: [
      /* ---------------------------------------------------------------- 1 */
      {
        key: "H2024-1", year: Y, oppgave_nr: "Oppgave 1", del: D1,
        ark: "Generelle sikkerhetsmålsettinger", title: "Viktigste KIT-mål før, under og etter eksamen",
        points: 3, block: "generelt", tema: ["KIT", "konfidensialitet", "tilgjengelighet", "integritet"],
        ordrett: true,
        oppgave:
          "<p>Anta situasjonen med Inspera-eksamen, som vist på figuren, der vi fokuserer på sikkerhet for selve eksamensoppgavene og besvarelsene (som er verdi/ressurs/asset). Viktigheten av de tre sikkerhetsmålsettingene kan være ulike før eksamen starter, under eksamen, og under sensureringen etter eksamen. For hver av disse tre fasene, velg hvilken sikkerhetsmålsetting som er viktigst. Alle målsettingene er naturligvis viktige, men du skal velge den viktigste i hver fase.</p>",
        figur: {
          beskrivelse:
            "Tre figurer på en linje. Til venstre en person i dress med teksten «Foreleser som lager eksamen». I midten en sky med en server og et nettleservindu (på arket med Inspera-logoen), med teksten «Platform for eksamen». Til høyre en person ved en bærbar PC med teksten «Student som tar eksamen». Mellom foreleser og sky, og mellom sky og student, står tykke lyseblå piler med spiss i begge ender.",
          tekst: ["Foreleser som lager eksamen", "Platform for eksamen", "Student som tar eksamen"]
        },
        inspera: {
          type: "N",
          regelTekst: "Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, maks 3, minimum 0.",
          regel: R(1, -1, 0, 3),
          tekst:
            "<p>Før eksamen er {0} viktigst.</p><p>Under eksamen er {1} viktigst.</p><p>Etter eksamen, men før sensureringen er ferdig er {2} viktigst.</p>",
          felt: [
            { etikett: "Før eksamen", valg: ["konfidensialitet", "tilgjengelighet", "integritet"], svar: 0, godta: [],
              explain: "Før start er det verste som kan skje at oppgavene lekker. Da er eksamen ødelagt for alle, så hemmelighold (konfidensialitet) er viktigst." },
            { etikett: "Under eksamen", valg: ["konfidensialitet", "integritet", "tilgjengelighet"], svar: 2, godta: [],
              explain: "Under eksamen er oppgavene allerede kjent for alle i salen. Det kritiske er at plattformen virker, slik at studentene kan lese oppgavene og levere (tilgjengelighet)." },
            { etikett: "Etter eksamen, før sensur", valg: ["tilgjengelighet", "integritet", "konfidensialitet"], svar: 1, godta: [],
              explain: "Etter innlevering må besvarelsene være nøyaktig slik studenten leverte dem. Ingen skal kunne endre svar før sensuren er ferdig (integritet)." }
          ]
        },
        avvik: null,
        losning: [
          "Spør for hver fase: hva er den verste hendelsen akkurat nå?",
          "Før: lekkasje av oppgavene → konfidensialitet.",
          "Under: plattformen går ned → tilgjengelighet.",
          "Etter: noen endrer besvarelser → integritet."
        ],
        tips: ["Det er minuspoeng for feil, men 0 for ubesvart. Er du helt usikker på én fase, kan det lønne seg å la den stå tom."]
      },
      /* ---------------------------------------------------------------- 2 */
      {
        key: "H2024-2", year: Y, oppgave_nr: "Oppgave 2", del: D1,
        ark: "Oversettelse", title: "Safety, assurance, security, certainty på norsk",
        points: 2, block: "generelt", tema: ["sikkerhet", "trygghet", "visshet", "garanti"],
        gjenganger: ["H2023-1", "H2025-1"],
        ordrett: true,
        oppgave: "<p>Velg riktig oversettelse fra engelsk til norsk.</p><p>Finn de som passer sammen:</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, maks 2, min 0.",
          regel: R(0.5, -0.5, 0, 2),
          kolonner: ["Visshet", "Garanti", "Trygghet", "Sikkerhet"],
          multi: false,
          rader: [
            { s: "Safety", svar: [2], explain: "<p>Safety handler om vern mot ulykker og utilsiktede hendelser. Det norske ordet er trygghet.</p>" },
            { s: "Assurance", svar: [1], explain: "<p>Assurance er tilliten til at sikkerhetstiltakene faktisk virker som de skal. Eksamen (H2023–H2025) oversetter det med garanti.</p>" },
            { s: "Security", svar: [3], explain: "<p>Security er vern mot tilsiktede, ondsinnede handlinger. Det er sikkerhet.</p>" },
            { s: "Certainty", svar: [0], explain: "<p>Certainty betyr å vite noe sikkert. Det norske ordet er visshet.</p>" }
          ]
        },
        avvik: null,
        losning: ["Sikkerhet = mot angripere (security). Trygghet = mot ulykker (safety). Visshet = å vite (certainty). Garanti = tillit til at tiltak virker (assurance)."],
        tips: ["Ordparet sikkerhet/trygghet går igjen hvert år. Husk: trygghet er det du har på en byggeplass, sikkerhet er det du trenger mot en hacker."]
      },
      /* ---------------------------------------------------------------- 3 */
      {
        key: "H2024-3", year: Y, oppgave_nr: "Oppgave 3", del: D1,
        ark: "Sikkerhetsmålsettinger", title: "Hvilket KIT-mål brytes av hvert angrep",
        points: 3, block: "generelt", tema: ["KIT", "angrep", "IPS", "hashkollisjon"],
        gjenganger: ["H2021-1.1", "H2022-1.1", "H2023-3", "H2025-2"],
        ordrett: true,
        oppgave: "<p>Indiker hvilken sikkerhetsmålsetting som typisk brytes som resultat av hvert angrep.</p><p>Indiker hvilket sikkerhetsmål som typisk brytes:</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig; -0,5 for feil/ubesvart; maks 3; minimum 0.",
          regel: R(0.5, -0.5, -0.5, 3),
          regelMerknad: "Ubesvart gir -0,5 her, i motsetning til hovedregelen ellers i settet. Svar derfor på alle radene.",
          kolonner: ["Integritet", "Tilgjengelighet", "Konfidensialitet"],
          multi: false,
          rader: [
            { s: "Avlytting av datatrafikk", svar: [2], explain: "<p>Den som avlytter, leser data hen ikke har lov til å se. Det er brudd på konfidensialitet. (Er trafikken kryptert og ikke dekryptert, brytes egentlig ingenting, men raden forutsetter at noe blir lest.)</p>" },
            { s: "Uautorisert sletting av filer og fjerning av backup", svar: [1], explain: "<p>Når både filene og sikkerhetskopien er borte, kan dataene ikke brukes lenger. Det rammer tilgjengelighet.</p>" },
            { s: "Sende angrepstrafikk med en annens forfalskede IP-adresse til en IPS", svar: [1], explain: "<p>IPS-en blokkerer avsenderadressen den ser. Med en forfalsket adresse blir en uskyldig part stengt ute, og da er tilgjengeligheten brutt for den parten.</p>" },
            { s: "Foreta manuell, men uautorisert endring av filer", svar: [0], explain: "<p>Data er endret uten lov. Det er rett og slett brudd på integritet.</p>" },
            { s: "Overdreven passordspraying mot en enkelt brukerkonto (utover systemets terskel for antall feil forsøk)", svar: [1], explain: "<p>Når terskelen for feil forsøk passeres, låses kontoen. Den rettmessige brukeren kommer ikke inn, så tilgjengeligheten er brutt.</p>" },
            { s: "Hashkollisjoner i signaturer", svar: [0], explain: "<p>En kollisjon lar angriperen bytte ut et dokument med et annet som gir samme hash, slik at den gamle signaturen fortsatt ser gyldig ut. Det er brudd på integritet, ikke konfidensialitet.</p>" }
          ]
        },
        avvik: ["Ubesvart gir -0,5 (avvik fra hovedregelen i settet).", "«Passordspraying mot en enkelt brukerkonto» er en uvanlig bruk av ordet: spraying betyr vanligvis ett eller noen få vanlige passord mot mange kontoer (MITRE ATT&CK T1110.003); mange passord mot én konto kalles der Password Guessing (T1110.001). Samme ordbruk står i H2023 26.", "Fasiten (tilgjengelighet) handler om kontosperren, og den er riktig uansett navn på angrepet."],
        losning: [
          "Spør hva som faktisk skjer med dataene eller tjenesten: lest (K), endret (I) eller utilgjengelig (T).",
          "To rader er feller: IPS-raden og spraying-raden handler om at et forsvarstiltak stenger ute en legitim bruker → T.",
          "Hashkollisjon i signatur → I."
        ],
        tips: ["Siden ubesvart straffes, bør du krysse på alle seks radene.", "Et sikkerhetstiltak som blokkerer en uskyldig, er et brudd på tilgjengelighet."]
      },
      /* ---------------------------------------------------------------- 4 */
      {
        key: "H2024-4", year: Y, oppgave_nr: "Oppgave 4", del: D1,
        ark: "Boksterminologi for testing", title: "Gråboks-testing",
        points: 1, block: "pentest", tema: ["pentest", "gråboks", "boksterminologi"],
        gjenganger: ["H2022-4.3", "H2023-4", "H2025-4"],
        ordrett: true,
        oppgave: "<p>I planleggingen av en pentest får du utlevert en skisse over deler av nettverksinfrastrukturen og noe, men ikke all kunnskap om systemet du skal teste.  Hva kalles denne typen testing?</p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart.",
          regel: R(1, 0, 0, 1),
          alternativer: ["Hvitboks-testing (white box)", "Svartboks-testing (Blackbox)", "Gulboks-testing (yellow box)", "Gråboks-testing (grey box)"],
          svar: 3,
          explain: [
            "Hvitboks betyr at testeren får full innsikt (kode, arkitektur, tilganger). Her får du bare noe.",
            "Svartboks betyr at testeren starter uten noen forkunnskap, som en ekstern angriper. Her får du en skisse.",
            "Gulboks er ikke et etablert begrep i kurset. Det er en distraktor.",
            "Riktig. Delvis kunnskap, for eksempel en nettverksskisse, er gråboks: midt mellom hvit og svart."
          ]
        },
        avvik: null,
        losning: ["Ingen kunnskap = svart, all kunnskap = hvit, noe kunnskap = grå."],
        tips: ["Les etter ordene «noe, men ikke all». Det er kjennetegnet på gråboks."]
      },
      /* ---------------------------------------------------------------- 5 */
      {
        key: "H2024-5", year: Y, oppgave_nr: "Oppgave 5", del: D1,
        ark: "OS privilegienivåer", title: "Hva en prosess i brukermodus når",
        points: 3, block: "system", tema: ["privilegienivå", "ring 3", "kjerne", "hypervisor"],
        gjenganger: ["H2023-5", "H2025-5"],
        ordrett: true,
        oppgave: "<p>En prosess kjører i <b>brukermodus</b>. Kryss av for hvert privilegienivå om prosessen kan få tilgang til ressurser (f.eks. data og prosess).</p><p>For hvert privilegienivå, indiker om en bruker-prosess kan få tilgang.</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 1 for hver riktig; -1 for hver feil eller ubesvart; maks 3; minimum 0.",
          regel: R(1, -1, -1, 3),
          regelMerknad: "Ubesvart gir -1 her, i motsetning til hovedregelen ellers i settet.",
          kolonner: ["Kan få tilgang", "Kan IKKE få tilgang"],
          multi: false,
          rader: [
            { s: "Nivå -1", svar: [1], explain: "<p>Nivå −1 er hypervisoren. Det har mer makt enn både kjernen og brukerprosesser, så en brukerprosess slipper ikke til der.</p>" },
            { s: "Nivå 0", svar: [1], explain: "<p>Nivå 0 er kjernen (kernel). En brukerprosess må be kjernen om tjenester via systemkall, men kan ikke selv lese kjernens data.</p>" },
            { s: "Nivå 3", svar: [0], explain: "<p>Nivå 3 er brukermodus, altså prosessens eget nivå. Der har den tilgang.</p>" }
          ]
        },
        avvik: "Ubesvart gir -1 (avvik fra hovedregelen i settet).",
        losning: ["Lavere tall betyr mer makt: −1 hypervisor, 0 kjerne, 3 bruker.", "En prosess når sitt eget nivå og nivåer med høyere tall, aldri lavere."],
        tips: ["Ikke la noen rad stå tom: det koster et helt poeng."]
      },
      /* ---------------------------------------------------------------- 6 */
      {
        key: "H2024-6", year: Y, oppgave_nr: "Oppgave 6", del: D1,
        ark: "Krypto- og PKI-begreper", title: "Symmetrisk, asymmetrisk, hash eller PKI",
        points: 2, block: "krypto", tema: ["symmetrisk", "asymmetrisk", "hash", "PKI"],
        gjenganger: ["H2023-6", "H2025-6"],
        ordrett: true,
        oppgave: "<p>Hvert utsagn nedenfor passer til et bestemt begrep innenfor krypto/PKI. Indiker hvilket begrep hvert utsagn passer best til.</p><p>Indiker hva hvert utsagn passer beste med.</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for riktig;, -0,5 for feil, 0 for ubesvart; maks 2; minimum 0.",
          regel: R(0.5, -0.5, 0, 2),
          kolonner: ["Symmetrisk kryptering", "Asymmetrisk kryptering", "Hash-funksjon", "PKI"],
          multi: false,
          rader: [
            { s: "Er enveis og blir ofte brukt til å sjekke integritet.", svar: [2], explain: "<p>En hashfunksjon kan ikke reverseres i praksis, og en endret melding gir en helt annen hashverdi. Derfor brukes den til integritetssjekk.</p>" },
            { s: "Garantere autentisitet av offentlige nøkler ved hjelp digitale sertifikat.", svar: [3], explain: "<p>PKI er systemet av CA-er og sertifikater som binder en offentlig nøkkel til et navn, slik at du vet hvem nøkkelen tilhører.</p>" },
            { s: "Bruker en felles hemmelig nøkkel", svar: [0], explain: "<p>Symmetrisk kryptering bruker samme hemmelige nøkkel til å kryptere og dekryptere, og begge parter må ha den.</p>" },
            { s: "Benytter en privat nøkkel og en offentlig nøkkel.", svar: [1], explain: "<p>Asymmetrisk kryptering bruker et nøkkelpar: en privat nøkkel som holdes hemmelig og en offentlig nøkkel som kan deles.</p>" }
          ]
        },
        avvik: null,
        merknad: "Skrivefeilene «riktig;,» og «passer beste med» står slik i arket.",
        losning: ["Enveis = hash. Sertifikat = PKI. Én felles nøkkel = symmetrisk. Nøkkelpar = asymmetrisk."],
        tips: ["Stikkordene i radene peker rett på svaret: «enveis», «sertifikat», «felles hemmelig», «privat og offentlig»."]
      },
      /* ---------------------------------------------------------------- 7 */
      {
        key: "H2024-7", year: Y, oppgave_nr: "Oppgave 7", del: D1,
        ark: "Asymmetrisk krypto", title: "Stjålet privat nøkkel: hvilken nøkkel brukes",
        points: 3, block: "krypto", tema: ["asymmetrisk", "privat nøkkel", "offentlig nøkkel", "revokering"],
        gjenganger: ["H2022-5.4", "H2023-7"],
        ordrett: true,
        oppgave: "<p>Alice har <b>stjålet en kopi</b> av Bobs private nøkkel. Hun bruker den til å transformere (kryptere) meldingen, som så blir sendt til Bob.</p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 poeng for hvert riktige svar; -1 poeng for feil, 0 poeng for ubesvart; totalt maks 3 poeng; minimum 0 poeng.",
          regel: R(1, -1, 0, 3),
          regelMerknad: "Tre separate ett-valgs-spørsmål, hvert gir 1, -1 eller 0.",
          sporsmal: [
            {
              tekst: "<p>Alice har <b>stjålet en kopi</b> av Bobs private nøkkel. Hun bruker den til å transformere (kryptere) meldingen, som så blir sendt til Bob. Hvilken nøkkel må Bob bruke for å transformere (dekryptere) teksten for å kunne lese den?</p>",
              alternativer: ["Alice sin private nøkkel", "Bobs private nøkkel", "Alice sin offentlige nøkkel", "Bobs offentlige nøkkel"],
              svar: 3,
              explain: [
                "Alices egne nøkler er ikke brukt i det hele tatt. Hun brukte Bobs private nøkkel.",
                "Bobs private nøkkel er den som ble brukt til å transformere. Den motsatte operasjonen krever den andre nøkkelen i paret.",
                "Alices nøkler er ikke involvert.",
                "Riktig. Det som er transformert med den ene nøkkelen i et par, kan bare snus med den andre. Brukte Alice Bobs private nøkkel, må Bobs offentlige nøkkel til."
              ]
            },
            {
              tekst: "<p>Bob klarer å lese meldingen med riktig nøkkel. Når han svarer på meldingen, bruker han sin offentlige nøkkel - hvilken nøkkel må da Alice bruke for å lese innholdet av Bobs melding?</p>",
              alternativer: ["Bobs private nøkkel", "Alice sin private nøkkel", "Bobs offentlige nøkkel", "Alice sin offentlige nøkkel"],
              svar: 0,
              explain: [
                "Riktig. Bob krypterte med sin offentlige nøkkel, og bare den private nøkkelen i samme par kan dekryptere. Alice har en stjålet kopi av den.",
                "Alices egne nøkler passer ikke til Bobs nøkkelpar.",
                "Den offentlige nøkkelen kan ikke snu en kryptering som er gjort med den samme offentlige nøkkelen.",
                "Alices nøkler passer ikke til Bobs nøkkelpar."
              ]
            },
            {
              tekst: "<p>Basert på informasjonen nevnt over - hva bør Bob gjøre nå?</p>",
              alternativer: ["Revokere sin private nøkkel", "Revokere Alice sin offentlige nøkkel", "Revokere sin offentlige nøkkel", "Revokere Alice sin private nøkkel"],
              svar: 2,
              explain: [
                "Det er den private nøkkelen som er kompromittert, så tanken er riktig, men det er ikke dette arket godtar. I en PKI er det sertifikatet, altså bindingen til den offentlige nøkkelen, som publiseres som tilbakekalt.",
                "Alices nøkler er ikke kompromittert.",
                "Arkets fasit. Andre parter kjenner bare Bobs offentlige nøkkel (via sertifikatet). Det er den som må merkes som ugyldig, slik at ingen stoler på nøkkelparet lenger.",
                "Alices nøkler er ikke kompromittert, og en privat nøkkel er uansett ikke noe andre har tilgang til å tilbakekalle."
              ]
            }
          ]
        },
        avvik: ["Del 3: fasiten er «Revokere sin offentlige nøkkel». Det er den private nøkkelen som er stjålet, men i en PKI tilbakekalles sertifikatet (bindingen mellom Bob og den offentlige nøkkelen), og dermed hele nøkkelparet. Begge formuleringer kan forsvares; arket godtar bare «offentlige».", "Del 1: å «kryptere» med en privat nøkkel er i praksis signering, og Bobs «dekryptering» med den offentlige nøkkelen er verifisering."],
        losning: [
          "Nøklene i et par er hverandres motsatte: det ene låser, det andre åpner.",
          "Del 1: privat brukt → offentlig åpner. Del 2: offentlig brukt → privat åpner, og Alice har en kopi av Bobs private.",
          "Del 3: nøkkelparet er kompromittert, så Bob må få det tilbakekalt. Arket kaller det å revokere den offentlige nøkkelen."
        ],
        tips: ["Tegn nøkkelparet som to halvdeler. Spør alltid: hvem eier paret, og hvilken halvdel ble brukt først?"]
      },
      /* ---------------------------------------------------------------- 8 */
      {
        key: "H2024-8", year: Y, oppgave_nr: "Oppgave 8", del: D1,
        ark: "Passordknekking", title: "John the Ripper: parameteren rules",
        points: 1, block: "pentest", tema: ["John the Ripper", "passordknekking", "ordliste", "regler"],
        gjenganger: ["H2023-8"],
        ordrett: true,
        oppgave: "<p>I oblig 2, samt på pentestforelesningen, ble det brukt en parameter i John the ripper for å knekke passord gjennom å lage permutasjoner på ordene i en ordliste. Hva het den?</p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart.",
          regel: R(1, 0, 0, 1),
          alternativer: ["wordspray", "rules", "permute", "all"],
          svar: 1,
          explain: [
            "Finnes ikke som John-parameter. Ordet ligner bare på «password spraying».",
            "Riktig (grønn hake i arket). Med regler lager John varianter av hvert ord i ordlista, for eksempel stor forbokstav, tall på slutten eller bytte av a med @.",
            "Høres logisk ut, men er ikke navnet på parameteren.",
            "«All» er navnet på et regelsett/tegnsett i John (f.eks. --rules=All), ikke selve parameteren. Parameteren heter rules."
          ]
        },
        avvik: null,
        losning: ["Ordliste alene prøver bare ordene slik de står. Regler (rules) gjør hvert ord om til mange sannsynlige varianter."],
        tips: ["Regelbasert knekking er grunnen til at «Sommer2024!» er et svakt passord selv om det har stor bokstav, tall og tegn."]
      },
      /* ---------------------------------------------------------------- 9 */
      {
        key: "H2024-9", year: Y, oppgave_nr: "Oppgave 9", del: D1,
        ark: "Sikkerhetsprotokoller", title: "Vern mot TLS-stripping",
        points: 1, block: "nettverk", tema: ["HSTS", "TLS-stripping"],
        gjenganger: ["H2023-10"],
        ordrett: true,
        oppgave: "<p>I kurset har vi nevnt en, eller flere protokoller som beskytter mot TLS-stripping. Hvilke(n)?</p>",
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 1 for hvert riktig svar, minus ett per feil - minimum 0 poeng.",
          regel: R(1, -1, 0, 1),
          alternativer: ["TLS", "DNS", "HTTP", "HSTS", "UDP", "IPSEC", "IP"],
          svar: [3],
          explain: [
            "TLS er nettopp det som blir strippet bort. Den hjelper ikke hvis klienten aldri ber om TLS.",
            "DNS slår opp navn og har ingenting med TLS-stripping å gjøre.",
            "Ukryptert HTTP er det angriperen nedgraderer offeret til.",
            "Riktig. HSTS får nettleseren til å huske at domenet bare skal brukes over HTTPS, så den nekter å gå ned til HTTP.",
            "UDP er en transportprotokoll uten sikkerhetsfunksjon.",
            "IPsec sikrer IP-pakker, men kurset nevner den ikke som vern mot TLS-stripping i nettleseren.",
            "IP er nettverkslaget uten sikkerhetsfunksjon."
          ]
        },
        avvik: null,
        losning: ["TLS-stripping: mann-i-midten holder offeret på HTTP. HSTS sier til nettleseren «bruk alltid HTTPS her»."],
        tips: ["Husk begrensningen: HSTS virker ikke ved aller første besøk, med mindre domenet står på preload-lista."]
      },
      /* ---------------------------------------------------------------- 10 */
      {
        key: "H2024-10", year: Y, oppgave_nr: "Oppgave 10", del: D1,
        ark: "Datanettsikkerhet", title: "iptables, IPsec og Wireshark",
        points: 3, block: "nettverk", tema: ["iptables", "IPsec", "VPN", "Wireshark"],
        gjenganger: ["H2023-11"],
        ordrett: true,
        oppgave: "<p>Velg det mest passende begrepet i hver setning nedenfor.</p>",
        inspera: {
          type: "N",
          regelTekst: "Poeng: 1 for hver riktig; -1 for hvert gale svar, 0 for ubesvart; maks 3, minimum 0.",
          regel: R(1, -1, 0, 3),
          tekst:
            "<p>{0} er et eksempel på en linux-basert brannmur som beskytter de interne nettverkene mot angrep fra eksterne nettverk, og bestemmer hvilken trafikk som kan passere inn og ut.</p>" +
            "<p>{1} er et eksempel på en VPN-løsning.</p>" +
            "<p>Wireshark er et eksempel på et {2}</p>",
          felt: [
            { etikett: "Linux-brannmur", valg: ["TLS-inspeksjon", "IDS", "ip-tables", "autentiseringstjener"], svar: 2, godta: [],
              explain: "iptables er brannmuren i Linux: regler som slipper gjennom eller stopper pakker. IDS oppdager, men bestemmer ikke hva som slipper gjennom." },
            { etikett: "VPN-løsning", valg: ["Diffie-Hellman", "Ip-sec", "Hashcat", "IDS"], svar: 1, godta: [],
              explain: "IPsec lager krypterte tunneler på IP-laget og er en klassisk VPN-løsning. Diffie-Hellman er bare nøkkelutvekslingen som kan brukes inni en VPN." },
            { etikett: "Wireshark", valg: ["APT", "pakkeanalysator", "pakkefilter", "applikasjonsbrannmur"], svar: 1, godta: [],
              explain: "Wireshark fanger og viser nettverkspakker, slik at du kan analysere dem. Den filtrerer ikke trafikk." }
          ]
        },
        avvik: null,
        losning: ["Brannmur i Linux = iptables. VPN = IPsec. Wireshark = pakkeanalysator (sniffer)."],
        tips: ["Diffie-Hellman er en fristende felle på VPN-spørsmål: den er en byggekloss, ikke en VPN-løsning."]
      },
      /* ---------------------------------------------------------------- 11 */
      {
        key: "H2024-11", year: Y, oppgave_nr: "Oppgave 11", del: D1,
        ark: "Passordkompleksitet", title: "Passord fra 10 til 14 tegn",
        points: 1, block: "autentisering", tema: ["passord", "nøkkelrom", "kompleksitet"],
        gjenganger: ["H2023-27"],
        ordrett: true,
        oppgave: "<p>Passordpolicyen har blitt endret fra en passordlengde 10 tegn til 14 tegn. Vi antar at systemet støtter standard (engelsk) 105 forskjellige tegn (store og små bokstaver, tall og spesialtegn). Hvor mye mer komplekst blir passordet?</p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart; maks 1, minimum 0.",
          regel: R(1, 0, 0, 1),
          alternativer: ["105^4", "105*4", "105 ganger", "Umulig å si"],
          svar: 0,
          explain: [
            "Riktig. Antall mulige passord er 105¹⁴ mot 105¹⁰ før. Forholdet er 105¹⁴ / 105¹⁰ = 105⁴.",
            "Fire ekstra tegn legger ikke til, de ganger: hvert nytt tegn ganger antallet med 105.",
            "Det gjelder bare ett ekstra tegn. Her er det fire.",
            "Det går fint å si, så lenge vi antar at alle tegn er like sannsynlige."
          ]
        },
        avvik: "Premisset «standard (engelsk) 105 forskjellige tegn» er tvilsomt: skrivbare ASCII-tegn er 95. Fasiten er likevel konsistent med premisset, og svarformen tegnsett^(økning) blir den samme uansett tall.",
        losning: ["Antall passord = tegnsett^lengde.", "Forhold = 105¹⁴ / 105¹⁰ = 105^(14−10) = 105⁴ ≈ 1,2 · 10⁸."],
        tips: ["Arket skriver potens med ^. Lengde virker i eksponenten, og det er derfor lange passord er så sterke."]
      },
      /* ---------------------------------------------------------------- 12 */
      {
        key: "H2024-12", year: Y, oppgave_nr: "Oppgave 12", del: D1,
        ark: "Meldingsautentisering", title: "Digital signatur, MAC og lekkede nøkler",
        points: 3, block: "krypto", tema: ["digital signatur", "MAC", "ubenektelighet", "kompromittert nøkkel"],
        gjenganger: ["H2021-1.4", "H2022-5.3", "H2023-15"],
        ordrett: true,
        oppgave: "<p>For hver setning nedenfor, velg begrepet som passer inn.</p>",
        inspera: {
          type: "N",
          regelTekst: "Poeng: 0,5 for hver riktig; -0,5 for hver feil, 0 for ubesvart; maks 3, minimum 0.",
          regel: R(0.5, -0.5, 0, 3),
          tekst:
            "<p>Digital signatur bruker {0} og gir {1} meldingsautentisering.</p>" +
            "<p>MAC (Message Authentication Code) bruker {2} og gir {3} meldingsautentisering.</p>" +
            "<p>En privat nøkkel publisert på internett betyr at {4}.</p>" +
            "<p>En offentlig nøkkel publisert på internett betyr at {5}.</p>",
          felt: [
            { etikett: "Digital signatur bruker", valg: ["symmetrisk kryptografi", "asymmetrisk kryptografi", "kvantekryptografi", "tellermodus-kryptografi"], svar: 1, godta: [],
              explain: "Signaturen lages med avsenderens private nøkkel og sjekkes med den offentlige. Det er asymmetrisk kryptografi." },
            { etikett: "Digital signatur gir", valg: ["ubenektelig", "phishingresistent", "fremoverhemmelig", "enkel"], svar: 0, godta: [],
              explain: "Bare avsenderen har den private nøkkelen, så en tredjepart kan se hvem som signerte. Avsenderen kan ikke nekte etterpå: ubenektelig meldingsautentisering." },
            { etikett: "MAC bruker", valg: ["tellermodus-kryptografi", "symmetrisk kryptografi", "kvantekryptografi", "asymmetrisk kryptografi"], svar: 1, godta: [],
              explain: "En MAC beregnes med en hemmelig nøkkel som begge parter deler. Det er symmetrisk kryptografi." },
            { etikett: "MAC gir", valg: ["enkel", "fremoverhemmelig", "ubenektelig", "phishingresistent"], svar: 0, godta: [],
              explain: "Mottakeren vet at meldingen kommer fra en som har nøkkelen, men begge har den. Derfor kan en tredjepart ikke avgjøre hvem som laget den: bare enkel meldingsautentisering." },
            { etikett: "Privat nøkkel publisert", valg: ["vi må slutte å beregne hash med den kompromitterte nøkkelen.", "det er uproblematisk, fordi den offentlige nøkkelen kan fremdeles benyttes", "vi må stoppe melding autentisert med MAC", "vi må slutte å signere digitalt med nøkkelen"], svar: 3, godta: [],
              explain: "Når alle kan se den private nøkkelen, kan hvem som helst lage signaturer i ditt navn. Nøkkelen må slutte å brukes til signering (og paret må tilbakekalles). Hash bruker ingen nøkkel, og MAC bruker en symmetrisk nøkkel." },
            { etikett: "Offentlig nøkkel publisert", valg: ["meldingsautentisering må stoppe", "du må lage et nytt nøkkelpar", "meldingsautentisering kan fortsette", "en angriper kan forfalske meldinger"], svar: 2, godta: [],
              explain: "Den offentlige nøkkelen er laget for å deles. Å publisere den er helt normalt, så alt kan fortsette som før." }
          ]
        },
        avvik: null,
        losning: [
          "Signatur: asymmetrisk, ubenektelig. MAC: symmetrisk, enkel.",
          "Privat nøkkel lekket → slutt å signere med den. Offentlig nøkkel lekket → ikke noe problem."
        ],
        tips: ["MAC gir aldri ubenektelighet, fordi begge parter har samme nøkkel. Dette går igjen nesten hvert år."]
      },
      /* ---------------------------------------------------------------- 13 */
      {
        key: "H2024-13", year: Y, oppgave_nr: "Oppgave 13", del: D1,
        ark: "Risikotrekanten", title: "Risikotrekanten: de tre hjørnene",
        points: 3, block: "risiko", tema: ["risiko", "verdier", "trusler", "sårbarheter"],
        gjenganger: ["H2023-16"],
        ordrett: true,
        oppgave: "<p>Figuren nedenfor viser risikotrekanten der hvert hjørne representerer et fundamentalt risikoaspekt. Skriv navnet på hvert risikoaspekt i hvert sitt hjørne. <b>Bruk flertallsformen av ordet.</b> Det spiller ingen rolle hvilket hjørne du skriver hvert ord i. Store eller små bokstaver spiller heller ingen rolle, men pass på å stave ordene riktig.</p>",
        figur: {
          beskrivelse:
            "En stor gul trekant med ordet «Risiko» i midten. I hvert hjørne står en lyseblå pil som peker utover fra midten: opp mot toppen, ned mot venstre og ned mot høyre. Ved hver pil er det et tomt tekstfelt (øverst litt til høyre for toppilen, nede til venstre og nede til høyre).",
          tekst: ["Risiko"]
        },
        inspera: {
          type: "T",
          regelTekst: "Poeng: 1 for  hver riktig; 0 for hver feil eller ubesvart; maks 3; minimum 0.",
          regel: R(1, 0, 0, 3),
          regelMerknad: "Alle tre feltene godtar samme liste. Meningen er at de tre feltene skal inneholde tre forskjellige aspekter (verdier, trusler, sårbarheter).",
          tekst: null,
          felt: [
            { etikett: "Øverste hjørne", godta: RISIKO_ORD, naer: { "verdi": "Oppgaven ber om flertall: verdier.", "trussel": "Oppgaven ber om flertall: trusler.", "sårbarhet": "Oppgaven ber om flertall: sårbarheter.", "risiko": "Risiko er det hele trekanten beskriver, ikke ett hjørne. Hjørnene er verdier, trusler og sårbarheter.", "sannsynlighet": "Sannsynlighet og konsekvens brukes når risikoen estimeres. Trekantens hjørner er verdier, trusler og sårbarheter.", "konsekvens": "Sannsynlighet og konsekvens brukes når risikoen estimeres. Trekantens hjørner er verdier, trusler og sårbarheter." }, explain: "Hvilket som helst av de tre aspektene: verdier, trusler eller sårbarheter." },
            { etikett: "Nederste venstre hjørne", godta: RISIKO_ORD, naer: { "verdi": "Oppgaven ber om flertall: verdier.", "trussel": "Oppgaven ber om flertall: trusler.", "sårbarhet": "Oppgaven ber om flertall: sårbarheter.", "risiko": "Risiko er det hele trekanten beskriver, ikke ett hjørne. Hjørnene er verdier, trusler og sårbarheter.", "sannsynlighet": "Sannsynlighet og konsekvens brukes når risikoen estimeres. Trekantens hjørner er verdier, trusler og sårbarheter.", "konsekvens": "Sannsynlighet og konsekvens brukes når risikoen estimeres. Trekantens hjørner er verdier, trusler og sårbarheter." }, explain: "Hvilket som helst av de tre, men ikke det samme som i et annet hjørne." },
            { etikett: "Nederste høyre hjørne", godta: RISIKO_ORD, naer: { "verdi": "Oppgaven ber om flertall: verdier.", "trussel": "Oppgaven ber om flertall: trusler.", "sårbarhet": "Oppgaven ber om flertall: sårbarheter.", "risiko": "Risiko er det hele trekanten beskriver, ikke ett hjørne. Hjørnene er verdier, trusler og sårbarheter.", "sannsynlighet": "Sannsynlighet og konsekvens brukes når risikoen estimeres. Trekantens hjørner er verdier, trusler og sårbarheter.", "konsekvens": "Sannsynlighet og konsekvens brukes når risikoen estimeres. Trekantens hjørner er verdier, trusler og sårbarheter." }, explain: "Det aspektet som gjenstår." }
          ]
        },
        avvik: null,
        merknad: "Den grønne lista godtar også feilstavingen «trussler» og ordet «hot». Overskriften i poenglinja har dobbelt mellomrom («1 for  hver»).",
        losning: ["Risiko oppstår der en trussel kan utnytte en sårbarhet mot en verdi.", "Skriv: verdier, trusler, sårbarheter (flertall)."],
        tips: ["Les instruksen: flertall. «trussel» i entall står ikke i lista."]
      },
      /* ---------------------------------------------------------------- 14 */
      {
        key: "H2024-14", year: Y, oppgave_nr: "Oppgave 14", del: D2,
        ark: "Egenskaper til krypto", title: "«Sikkert og visst» mot «Sorte hull»",
        points: 3, block: "krypto", tema: ["digital signatur", "SHA-1", "Diffie-Hellman", "mann-i-midten"],
        gjenganger: ["H2023-17"],
        ordrett: true,
        oppgave: "<p>Firmaet \"Sikkert og visst\", har havnet i en konflikt med firmaet \"Sorte hull\". Du som ekspert i informasjonssikkerhet har du blitt kalt inn for å bistå det juridiske teamet med noen tekniske spørsmål.</p>",
        inspera: {
          type: "F1",
          regelTekst: "Denne oppgaven gir 1 poeng for hvert riktige svar, -1 for galt, 0 poeng for ubesvart; 3 poeng hvis alt er riktig, og minimum 0 poeng.",
          regel: R(1, -1, 0, 3),
          regelMerknad: "Tre separate ett-valgs-spørsmål. «3 poeng hvis alt er riktig» er det samme som summen av tre riktige.",
          sporsmal: [
            {
              tekst: "<p>En digital signatur som bruker asymmetrisk krypto har blitt brukt på en melding. \"Sorte hull\" påstår at for en tredjepart, er dette bevis på at \"Sikkert og visst\" har sendt meldingen. Er denne påstanden riktig?</p>",
              alternativer: ["Påstanden er riktig", "Påstanden er feil"],
              svar: 0,
              explain: [
                "Riktig. Bare eieren av den private nøkkelen kan lage signaturen, og hvem som helst kan sjekke den med den offentlige nøkkelen. Det gir ubenektelighet overfor en tredjepart.",
                "Det ville vært riktig for en MAC, der begge parter har samme nøkkel. Ikke for en asymmetrisk signatur."
              ]
            },
            {
              tekst: "<p>SHA-1 algoritmen har blitt brukt, men \"Sorte hull\" påstår at denne ikke lenger er sikker så resultatene kan ikke brukes. Hva er riktig om SHA-1?</p>",
              alternativer: ["SHA-1 anses som usikker", "SHA-1 anses som sikker"],
              svar: 0,
              explain: [
                "Riktig. Det er vist praktiske kollisjoner i SHA-1, så den regnes ikke lenger som sikker for signaturer.",
                "SHA-1 er faset ut nettopp fordi kollisjoner er funnet."
              ]
            },
            {
              tekst: "<p>Sensitiv informasjon fra kommunikasjonen mellom \"Sikkert og visst\" og \"Sorte hull\" har kommet på avveie. \"Sorte hull\" sier at de ikke har lekket informasjonen med vilje.</p><p>Øktnøklene som er brukt har blitt utvekslet via Diffie-Hellman nøkkelutveksling mellom \"Sorte hull\" og \"Sikkert og visst\". \"Sorte hull\" påstår dermed at siden de ikke brukte noen autentisering så kan kommunikasjonen ha vært utsatt av et mann-i-midten angrep. Hva er riktig om påstanden til \"Sorte hull\"?</p>",
              alternativer: [
                "Påstanden er riktig siden Diffie-Hellman ble brukt uten digital signatur.",
                "Påstanden er delvis riktig, Diffie-Hellman gir ikke sterk autentisering, men gir svak autentisering som forebygger mann-i-midten angrep.",
                "Påstanden er feil siden Diffie-Hellman gir autentisering."
              ],
              svar: 0,
              explain: [
                "Riktig. Ren Diffie-Hellman bekrefter ikke hvem du snakker med. En mann i midten kan gjøre én utveksling med hver part og lese alt. Signaturer på DH-verdiene hindrer det.",
                "Diffie-Hellman gir ingen autentisering i det hele tatt, heller ikke en «svak» variant.",
                "Diffie-Hellman etablerer bare en felles nøkkel. Den autentiserer ingen."
              ]
            }
          ]
        },
        avvik: null,
        losning: [
          "Asymmetrisk signatur → ubenektelig overfor tredjepart → påstanden er riktig.",
          "SHA-1 har kjente kollisjoner → usikker.",
          "DH uten signatur → sårbar for mann-i-midten → påstanden er riktig."
        ],
        tips: ["Ordet «svak autentisering» i alternativ 2 er en felle: DH gir null autentisering alene."]
      },
      /* ---------------------------------------------------------------- 15 */
      {
        key: "H2024-15", year: Y, oppgave_nr: "Oppgave 15", del: D2,
        ark: "Nøkkelsertifikat", title: "Sertifikatsti for inspera.no",
        points: 2, block: "pki", tema: ["sertifikatsti", "rot-CA", "mellomliggende CA", "subjektsertifikat"],
        gjenganger: ["H2023-18"],
        ordrett: true,
        oppgave: "<p>Denne oppgaven omhandler nøkkelsertifikater og du må velge passende svar på nedtrekksmenyen.</p><p>Med din nettleser finner du følgende sertifikatsti for en nettside på inspera.no:</p>",
        figur: {
          beskrivelse:
            "Skjermbilde av sertifikathierarkiet i en nettleser, som et tre med tre nivåer. Øverst «Amazon Root CA 1» med en nedoverpil (utvidet). Innrykket under: «Amazon RSA 2048 M03», også utvidet. Innrykket enda mer, og markert med grå bakgrunn: «inspera.no».",
          tekst: ["Amazon Root CA 1", "Amazon RSA 2048 M03", "inspera.no"]
        },
        inspera: {
          type: "N",
          regelTekst: "Poeng: 1 for hvert riktig; -1 for gale svar, 0 for ubesvart; minimum 0.",
          regel: R(1, -1, 0, 2),
          tekst: "<p>inspera.no  er et eksempel på {0}.</p><p>Hvem har signert inspera.no? {1}</p>",
          felt: [
            { etikett: "inspera.no er", valg: ["rot-CA", "mellomliggende CA", "subjeksertifikat"], svar: 2, godta: [],
              explain: "inspera.no står nederst i stien og er nettstedet selv. Det er et subjektsertifikat (sluttbrukersertifikat)." },
            { etikett: "Signert av", valg: ["Rot CA", "Selv-signert", "PKI", "Mellomliggende CA"], svar: 3, godta: [],
              explain: "Sertifikatet rett over i stien, Amazon RSA 2048 M03, har signert inspera.no. Det er en mellomliggende CA. Roten signerer bare mellomnivået." }
          ]
        },
        avvik: null,
        merknad: "«subjeksertifikat» (mangler t) står slik i arket.",
        losning: ["Nederst = subjekt. Midten = mellomliggende CA. Øverst = rot (selvsignert).", "Hvert sertifikat er signert av nivået rett over."],
        tips: ["Rot-CA-en signerer nesten aldri nettsteder direkte. Den holdes offline og signerer mellomliggende CA-er."]
      },
      /* ---------------------------------------------------------------- 16 */
      {
        key: "H2024-16", year: Y, oppgave_nr: "Oppgave 16", del: D2,
        ark: "Nøkkelsertifikat 2", title: "Nøkkelsertifikat: standard og algoritme",
        points: 2, block: "pki", tema: ["X.509", "RSA", "ECDSA", "signaturalgoritme"],
        gjenganger: ["H2023-19"],
        ordrett: true,
        oppgave:
          "<p>I denne oppgaven skal du skrive inn svaret, som skal være på formatet \"-.---\" (hvor du må erstatte hver \"-\" med en bokstav (stor eller liten bokstav spiller ingen rolle) eller et tall.</p>",
        inspera: {
          type: "T",
          regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart; maks 2; minimum 0.",
          regel: R(1, 0, 0, 2),
          tekst:
            "<p>Hva kalles standarden som brukes for public-key nøkkelsertifikater på Internett ?</p><p>Fyll in svaret her: {0}</p>" +
            "<p>I dette kurset har vi nevnt en rekke asymmetriske kryptografi algoritmer som kan brukes til signering. For eksempel i en PKI-sammenheng.</p>" +
            "<p>Skriv <b><u>en, og bare en,</u></b> av disse algoritmene i forkortet form (eksempelvis ville kunstig intelligens vært KI) i feltet under:</p><p>{1}</p>",
          felt: [
            { etikett: "Standard for sertifikater", godta: ["X.509", "x509", "x 509", "x-509", "X.509v3", "X509v3"], naer: { "X.500": "X.500 er katalogstandarden som X.509 er en del av. Sertifikatformatet heter X.509." },
              explain: "X.509 er standarden for formatet på sertifikater på Internett: navn, offentlig nøkkel, gyldighet og CA-ens signatur." },
            { etikett: "Signaturalgoritme (forkortelse)", godta: ["RSA", "ECC", "DSA", "DH", "MQV", "ECDSA", "EdDSA", "FFC", "IFC", "XMSS", "ML-DSA", "SLH-DSA"], naer: { "AES": "AES er symmetrisk og kan ikke signere. Skriv en asymmetrisk signaturalgoritme, f.eks. RSA eller ECDSA.", "SHA": "SHA er en hashfunksjon, ikke en signaturalgoritme. Signaturen lages med f.eks. RSA eller ECDSA over hashen.", "SHA-256": "SHA-256 er en hashfunksjon, ikke en signaturalgoritme. Signaturen lages med f.eks. RSA eller ECDSA over hashen." },
              explain: "Trygge valg er RSA, DSA, ECDSA eller EdDSA, som alle er signaturalgoritmer. Lista godtar også DH og MQV, selv om de egentlig er nøkkelutveksling." }
          ]
        },
        avvik: ["Lista over godkjente signaturalgoritmer omfatter DH og MQV, som er algoritmer for nøkkelutveksling, ikke signering. Det tryggeste er å svare RSA eller ECDSA.", "FFC og IFC er familier (endelig-kropp- og faktoriseringsbasert krypto), ikke enkeltalgoritmer, og det samme gjelder ECC.", "Lista forklares trolig av at kurset (kryptolysarket, lysarket om kvantetrusselen) setter «RSA, DSA, Diffie-Hellman» sammen under digital signatur, PKI og nøkkeldistribusjon."],
        merknad: "«Fyll in» og mellomrommet før spørsmålstegnet står slik i arket.",
        losning: ["Felt 1: X.509.", "Felt 2: RSA (eller ECDSA/EdDSA/DSA)."],
        tips: ["Skriv bare én algoritme i felt 2. Feltet rettes automatisk mot lista."]
      },
      /* ---------------------------------------------------------------- 17 */
      {
        key: "H2024-17", year: Y, oppgave_nr: "Oppgave 17", del: D2,
        ark: "Blokkchiffer - operasjonsmoduser", title: "ECB og CTR fra diagram",
        points: 2, block: "krypto", tema: ["ECB", "CTR", "operasjonsmodus", "blokkchiffer"],
        gjenganger: ["H2023-20", "H2025-8"],
        ordrett: true,
        oppgave: "<p>For blokkchiffer brukes ulike operasjonsmoduser for kryptering av mer enn én blokk. Nedenfor ser du diagrammer som illustrerer kryptering for <b>to ulike</b> operasjonsmoduser. Sett riktig navn på hver av dem.</p>",
        figur: {
          beskrivelse:
            "To diagrammer side om side, hvert med tre parallelle kolonner. Venstre diagram: i hver kolonne går en klartekstblokk (M₁, M₂, M₃, røde rammer) rett ned i en blå boks «E», med en nøkkel K inn fra siden; ut kommer C₁, C₂, C₃. Ingen forbindelse mellom kolonnene. Høyre diagram: i hver kolonne går en tellerverdi (T₁, T₂, T₃, gule bokser med rød ramme) ned i en blå boks «E» med nøkkel K; utdataene går ned i en XOR-sirkel (⊕) der M₁, M₂, M₃ kommer inn fra venstre; ut kommer C₁, C₂, C₃. Under hvert diagram er et felt for å slippe en navnelapp.",
          tekst: ["M₁", "M₂", "M₃", "K", "E", "C₁", "C₂", "C₃", "T₁", "T₂", "T₃"]
        },
        inspera: {
          type: "D",
          regelTekst: "Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; totalt maks 2; totalt minimum 0.",
          regel: R(1, -1, 0, 2),
          tekst: null,
          bank: ["Counter Mode (CTR)", "Data Encryption Standard (DES)", "Cipher Block Chaining (CBC)", "Electronic Code Book (ECB)"],
          felt: [
            { etikett: "Venstre diagram (M går rett inn i E)", svar: 3, godta: [],
              explain: "Hver blokk krypteres for seg med samme nøkkel: C₁ = E(M₁, K). Det er ECB. Like klartekstblokker gir like chiffertekstblokker." },
            { etikett: "Høyre diagram (teller inn i E, XOR med M)", svar: 0, godta: [],
              explain: "Det er tellerverdien T som krypteres, og resultatet XOR-es med klarteksten: C₁ = E(T₁, K) ⊕ M₁. Det er tellermodus (CTR)." }
          ]
        },
        avvik: null,
        losning: ["M rett inn i E, ingen kobling = ECB.", "T inn i E, så ⊕ med M = CTR.", "CBC ville hatt en pil fra forrige C inn til neste blokk. DES er en algoritme, ikke en modus."],
        tips: ["Se etter hva som går inn i E. Er det klarteksten, er det ECB (eller CBC med kjede). Er det en teller, er det CTR."]
      },
      /* ---------------------------------------------------------------- 18 */
      {
        key: "H2024-18", year: Y, oppgave_nr: "Oppgave 18", del: D2,
        ark: "Hash-funksjoner", title: "Krav til en hashfunksjon",
        points: 2, block: "krypto", tema: ["hashfunksjon", "kollisjonsresistens"],
        gjenganger: ["H2021-3.4", "H2022-5.2", "H2023-21"],
        ordrett: true,
        oppgave: "<p>Kryptografiske hashfunksjoner har en rekke krav som må oppfylles. Kryss av de som er korrekte krav og ignorer de som er feil eller ikke gir mening.</p><p>Velg de alternativene som er krav til en hashfunksjon:</p>",
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; minimum 0.",
          regel: R(1, -1, 0, 2),
          alternativer: ["Liten offentlig nøkkel", "Lett å beregne", "Sterk kollisjonsresistens", "Salt", "Tung, men sterk kryptering"],
          svar: [1, 2],
          explain: [
            "En hashfunksjon har ingen nøkkel, verken offentlig eller hemmelig.",
            "Riktig. Hashen skal være rask å regne ut for enhver melding.",
            "Riktig. Det skal være praktisk umulig å finne to ulike meldinger med samme hash.",
            "Salt brukes ved lagring av passord, men er ikke et krav til selve hashfunksjonen.",
            "En hashfunksjon krypterer ikke og har ingen nøkkel. Den skal tvert imot være lett å beregne."
          ]
        },
        avvik: null,
        losning: ["Kursets fem krav: lett å beregne, komprimering (fast lengde), enveis, svak og sterk kollisjonsresistens.", "Av alternativene er det bare «Lett å beregne» og «Sterk kollisjonsresistens» som står i lista."],
        tips: ["Hash er ikke kryptering: alt som nevner nøkkel eller kryptering, er feil her."]
      },
      /* ---------------------------------------------------------------- 19 */
      {
        key: "H2024-19", year: Y, oppgave_nr: "Oppgave 19", del: D2,
        ark: "Nøkler", title: "Krypter og signer: hvilke nøkler",
        points: 3, block: "krypto", tema: ["asymmetrisk kryptering", "digital signatur", "nøkkelpar"],
        gjenganger: ["H2025-9", "H2021-3.5", "H2022-5.1"],
        ordrett: true,
        oppgave: "<p>I denne oppgaven skal du flytte inn riktig begrep på riktig plass i teksten.</p>",
        inspera: {
          type: "D",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, maks 3, minimum 0. Boksene kan gjenbrukes.",
          regel: R(0.5, -0.5, 0, 3),
          tekst: "<p>Bob {0} en melding med Alice sin {1} nøkkel. Deretter signerer han med sin {2} nøkkel. og sender over meldingen. Alice {3} signaturen med Bobs {4} nøkkel, og dekrypterer meldingen med sin {5} nøkkel.</p>",
          bank: ["signerer", "private", "offentlige", "hemmelige", "krypterer", "verifiserer"],
          felt: [
            { etikett: "Bob … en melding", svar: 4, godta: [], explain: "Med mottakerens nøkkel gjør man kryptering, så Bob krypterer." },
            { etikett: "Alice sin … nøkkel", svar: 2, godta: [], explain: "Man krypterer med mottakerens offentlige nøkkel, så bare hun kan dekryptere med sin private." },
            { etikett: "signerer han med sin … nøkkel", svar: 1, godta: [], explain: "Signering gjøres alltid med avsenderens private nøkkel." },
            { etikett: "Alice … signaturen", svar: 5, godta: [], explain: "Mottakeren verifiserer signaturen." },
            { etikett: "med Bobs … nøkkel", svar: 2, godta: [], explain: "Verifisering skjer med avsenderens offentlige nøkkel, som alle kan ha." },
            { etikett: "dekrypterer meldingen med sin … nøkkel", svar: 1, godta: [], explain: "Bare Alices private nøkkel kan dekryptere det som er kryptert med hennes offentlige." }
          ]
        },
        avvik: null,
        merknad: "Punktumet i «nøkkel. og sender» står slik i arket.",
        losning: ["Krypter med mottakers offentlige, dekrypter med mottakers private.", "Signer med avsenders private, verifiser med avsenders offentlige."],
        tips: ["«Hemmelige» brukes om symmetriske nøkler og er distraktoren her."]
      },
      /* ---------------------------------------------------------------- 20 */
      {
        key: "H2024-20", year: Y, oppgave_nr: "Oppgave 20", del: D3,
        ark: "Phishing", title: "Apple Pay-eposten: hvilken phishing",
        points: 1, block: "angrep", tema: ["phishing", "masse-phishing"],
        gjenganger: ["H2021-2.1", "H2022-3.2", "H2023-23"],
        ordrett: true,
        oppgave:
          "<p>Hva slags phishing-angrep er denne eposten et eksempel på? (Hint: Jeg verken har, eller har noensinne hatt apple pay)</p>" +
          "<p>\"APPLE PAY har blitt suspendert på enheten din!</p>" +
          "<p>Vi la merke til at kortet du bruker på enheten din er knyttet til flere enheter.</p>" +
          "<p>Som et sikkerhetstiltak har vi midlertidig blokkert Apple Pay-tjenesten din inntil vi kan bekrefte at du er den legitime eieren av kortet.</p>" +
          "<p>Bekreft nå &lt;http://langSensurertUrl&gt;</p>" +
          "<p>Apple-ID-en din kan ikke brukes til å foreta betalinger gjennom APPLE PAY før du aktiverer ID-en din på nytt</p>" +
          "<p>Sendt av Apple</p>" +
          "<p>Copyright 2024 Apple Inc. Alle rettigheter forbeholdt.</p>" +
          "<p>Hvis du ønsker å avslutte abonnementet, vennligst klikk her. &lt;http://langSensurertUrl&gt; \"</p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 for riktig, 0 for feil eller ubesvart.",
          regel: R(1, 0, 0, 1),
          alternativer: ["Masse-phishing", "Direktørsvindel (whaling)", "Spyd-phishing", "Klone-phishing"],
          svar: 0,
          explain: [
            "Riktig. Mottakeren har aldri hatt Apple Pay, så eposten er sendt ut til mange i håp om at noen har det. Ingen personlig tilpasning.",
            "Whaling retter seg mot ledere og spiller ofte på deres rolle. Her er det ingenting personlig.",
            "Spyd-phishing er skreddersydd for én person eller gruppe. Denne eposten passer ikke engang mottakeren.",
            "Klone-phishing kopierer en ekte epost mottakeren allerede har fått, og bytter lenken. Mottakeren har aldri fått noe fra Apple Pay."
          ]
        },
        avvik: null,
        merknad: "I tekstuttrekket av PDF-en er «АРРLЕ РАУ» skrevet med kyrilliske bokstaver som ser latinske ut (vanlig triks i ekte phishing). Her er det gjengitt med latinske bokstaver.",
        losning: ["Hintet avgjør: eposten treffer en som ikke engang bruker tjenesten → bredt utsendt → masse-phishing."],
        tips: ["Spør: er eposten laget for akkurat meg (spyd), for en sjef (whaling), en kopi av noe jeg har fått (klone) eller sendt til alle (masse)?"]
      },
      /* ---------------------------------------------------------------- 21 */
      {
        key: "H2024-21", year: Y, oppgave_nr: "Oppgave 21", del: D3,
        ark: "Skadevare", title: "Dataorm, bakdør, trojaner, logisk bombe",
        points: 1, block: "angrep", tema: ["skadevare", "dataorm", "bakdør", "trojaner", "logisk bombe"],
        gjenganger: ["H2023-24", "H2021-2.5", "H2022-3.4"],
        ordrett: true,
        oppgave: "<p>Velg den kolonnen som passer best med hver rad.</p><p>Finn de som passer sammen:</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,25 for hver riktig, -0,25 for hver feil, 0 for ubesvart, 1 for alle riktig, minimum 0.",
          regel: R(0.25, -0.25, 0, 1),
          kolonner: ["Logisk bombe", "Virus", "Dataorm", "Trojaner", "Bakdør"],
          multi: false,
          rader: [
            { s: "Morris er en kjent", svar: [2], explain: "<p>Morris-ormen (1988) spredte seg selv fra maskin til maskin over nettet uten hjelp fra brukeren. Det er en dataorm.</p>" },
            { s: "Skjult passord implementert av programmereren for å kunne logge seg inn senere uten systemeiers viten", svar: [4], explain: "<p>En skjult vei inn som omgår vanlig autentisering, er en bakdør.</p>" },
            { s: "Fungerende antivirusprogram som inneholder en spesiell skadevare", svar: [3], explain: "<p>Et nyttig program som skjuler skadevare inni seg, er en trojaner (trojansk hest).</p>" },
            { s: "Skadevare som formaterer harddisken din fredag den trettende kl. 12.05", svar: [0], explain: "<p>Skadevare som venter på en bestemt betingelse, her et tidspunkt, før den slår til, er en logisk bombe.</p>" }
          ]
        },
        avvik: null,
        losning: ["Sprer seg selv = orm. Skjult innlogging = bakdør. Nyttig program med skjult last = trojaner. Utløses av betingelse = logisk bombe."],
        tips: ["Virus er distraktoren: et virus trenger et vertsprogram og hjelp fra brukeren for å spre seg."]
      },
      /* ---------------------------------------------------------------- 22 */
      {
        key: "H2024-22", year: Y, oppgave_nr: "Oppgave 22", del: D3,
        ark: "Skadevarebegreper", title: "Trojaner, kryptoutvinning, command injection, rootkit",
        points: 2, block: "angrep", tema: ["trojaner", "kryptoutvinning", "command injection", "rootkit"],
        gjenganger: ["H2023-25"],
        ordrett: true,
        oppgave: "<p>Sett inn riktig begrep for hver beskrivelse. All kode er satt i \"gåsøyne\" pga innstillinger i inspera - se bort fra dem.</p>",
        inspera: {
          type: "D",
          regelTekst: "Poeng: 0,5 for hvert riktig;, -0,5 for hver feil; maks 2; minimum 0.",
          regel: R(0.5, -0.5, 0, 2),
          tekst: null,
          bank: ["Rootkit", "Exploit", "Kryptoutvinningsbott", "Logisk bombe", "Løsepengevirus", "MiTM", "Command injection", "trojaner"],
          felt: [
            { etikett: "Skadevare som skjuler seg i et legitimt, nyttig program", svar: 7, godta: [], explain: "Skadevare gjemt i et nyttig program er en trojaner." },
            { etikett: "Et program som stadig bruker mye CPU-kraft", svar: 2, godta: [], explain: "En kryptoutvinningsbott bruker offerets prosessor til å utvinne kryptovaluta, og det merkes som høy CPU-bruk hele tiden." },
            { etikett: "\"a &amp;&amp; cat /etc/passwd\"", svar: 6, godta: [], explain: "&& kjører en ekstra kommando etter den første. Når brukerinput sendes videre til et skall, får angriperen kjørt egne kommandoer: command injection." },
            { etikett: "Et program som brukes til å skjule spesielle prosesser", svar: 0, godta: [], explain: "Et rootkit skjuler angriperens prosesser, filer og tilgang for brukeren og for verktøy som ps eller antivirus." }
          ]
        },
        avvik: null,
        merknad: "Arket skriver «Kryptoutvinningsbott» med to t og «trojaner» med liten forbokstav.",
        losning: ["Les beskrivelsen og finn kjerneordet: «skjuler seg i nyttig program» (trojaner), «mye CPU» (kryptoutvinning), «&&» (command injection), «skjule prosesser» (rootkit)."],
        tips: ["Fire av boksene (Exploit, Logisk bombe, Løsepengevirus, MiTM) brukes ikke."]
      },
      /* ---------------------------------------------------------------- 23 */
      {
        key: "H2024-23", year: Y, oppgave_nr: "Oppgave 23", del: D3,
        ark: "Sårbarhetsutnyttelse", title: "SQL-injeksjon og filter på klientsiden",
        points: 6, block: "pentest", tema: ["SQL-injeksjon", "filter", "klientside", "proxy"],
        gjenganger: ["H2023-25", "H2023-28"],
        ordrett: true,
        oppgave:
          "<p>I løpet av en pentest prøver du å logge inn på en nettside. Du har ikke noe passord, men tester og finner ut at følgende angrep funger i passordfeltet:</p>" +
          "<p>a' or 1==1</p>" +
          "<p>Utvikleren av nettsiden prøver å løse problemet gjennom å lage et filter som blokkerer teksten 1==1.</p>",
        inspera: {
          type: "E",
          regelTekst: "Oppgaven gir maks 6 poeng.",
          regel: MAN(6),
          deler: [
            { del: "A)", poeng: 1, sporsmal: "<p>Oppgave A: Hva heter dette angrepet (1 poeng)?</p>", grense: "ett navn" },
            { del: "B)", poeng: 2, sporsmal: "<p>Oppgave B: Lag et angrep som fungerer, til tross for filteret nevnt over (2 poeng) (du trenger ikke beskrive eller forklare angrepet - bare hva du ville tastet inn i passordfeltet).</p>", grense: "bare inndataene" },
            { del: "C)", poeng: 3, sporsmal: "<p>Oppgave C: Utvikleren sier han har implementert filteret ved hjelp av script som kjører hos brukerne. Beskriv kort (maks to setninger) hvorvidt dette er en god løsning, og hvorfor/hvorfor ikke  (3 poeng).</p>", grense: "maks to setninger" }
          ]
        },
        avvik: null,
        merknad: "«funger» står slik i arket. Arket bruker «==» som i programmeringsspråk; i SQL skrives likhet med «=», men det påvirker ikke vurderingen.",
        losning: [
          "A: Inndataene endrer selve SQL-spørringen → SQL-injeksjon.",
          "B: Filteret stopper bare den eksakte teksten 1==1. Bytt til et annet uttrykk som alltid er sant, for eksempel 2==2.",
          "C: Nei. Kode som kjører hos brukeren, kontrollerer brukeren selv: hen kan slå av skriptet eller sende forespørselen via en proxy etter at filteret har kjørt."
        ],
        tips: ["I C får du bare 0,5 p for «nei». Begrunnelsen (brukeren kontrollerer klienten) gir 2 p, og å nevne en proxy (Burp/ZAP) gir full pott.", "Inndatafilter (validering) må alltid ligge på tjenersiden, og den egentlige løsningen er parameteriserte spørringer."]
      },
      /* ---------------------------------------------------------------- 24 */
      {
        key: "H2024-24", year: Y, oppgave_nr: "Oppgave 24", del: D3,
        ark: "Hvilket program er dette?", title: "Kjenn igjen programmet",
        points: 2, block: "pentest", tema: ["mimikatz", "passordhasher", "Windows"],
        gjenganger: ["H2023-8", "H2025-14"],
        ordrett: true,
        oppgave: "<p>Hint: Svaret er IKKE kiwi, som bruker dette programmet. Svaret skrives i ETT ord, og husk at svaret rettes automatisk. Er du i tvil om skrivemåten, så spør faglærer om du har skrevet det riktig når han går runden.</p><p>Riktig svar gir to poeng.</p>",
        figur: {
          beskrivelse:
            "Skjermbilde av et mørkt terminalvindu (hvit/grå tekst på svart). Ledeteksten foran hver kommando er dekket av et hvitt felt. Først kommandoen «# privilege::debug» med svaret «Privilege '20' OK». Så kommandoen «# sekurlsa::logonpasswords». Deretter en blokk med feltene Authentication Id, Session (Interactive from 2), User Name, Domain og SID. Under står en seksjon «msv :» med «[00000003] Primary» og linjene * Username, * Domain, * LM, * NTLM og * SHA1, der de tre siste er lange heksadesimale hasher. Til slutt en seksjon «tspkg :» med * Username, * Domain og * Password, der arket viser passordet i klartekst. Nederst «...». Figuren her bruker oppdiktede eksempelverdier (ikke arkets): User Name «ola», Domain «EKSEMPEL», forkortede hasher (f.eks. NTLM «3f9c1e7a…6e15»), og passordverdien er skjult som «••••••••».",
          tekst: ["# privilege::debug", "Privilege '20' OK", "# sekurlsa::logonpasswords", "msv :", "tspkg :"]
        },
        inspera: {
          type: "T",
          regelTekst: "Riktig svar gir to poeng.",
          regel: R(2, 0, 0, 2),
          tekst: "<p>Hva heter dette programmet? {0}</p>",
          felt: [
            { etikett: "Programnavn", godta: ["mimikatz", "mimikats", "mimmikatz", "mimmikats", "mimikatz.exe"], naer: { "kiwi": "Kiwi er utvidelsen som bruker programmet (hintet sier at svaret ikke er kiwi). Programmet heter mimikatz." },
              explain: "Kommandoene privilege::debug og sekurlsa::logonpasswords er kjennetegnet på mimikatz, som henter innloggingsdata (hasher og til og med klartekstpassord) ut av minnet på Windows." }
          ]
        },
        avvik: "Verdiene i utskriften (Authentication Id, bruker, domene, SID og hasher) er byttet ut med oppdiktede, forkortede eksempelverdier, og passordverdien er skjult (••••••••), fordi guiden ikke gjengir innloggingsdata. Kommandoene og strukturen er som på arket.",
        losning: ["Modulnavn med dobbelt kolon (sekurlsa::) og utdata med NTLM-hasher og passord = mimikatz."],
        tips: ["Hintet sier at kiwi «bruker dette programmet»: Kiwi er en modul som bygger på mimikatz (pentestlysarket s. 45 lister «Kiwi (Metasploit)» ved siden av Mimikatz). Spørsmålet gjelder programmet selv."]
      },
      /* ---------------------------------------------------------------- 25 */
      {
        key: "H2024-25", year: Y, oppgave_nr: "Oppgave 25", del: D4,
        ark: "Kommunikasjonssikkerhet", title: "TLS, IPsec, HSTS, sky-VPN og OWASP",
        points: 5, block: "nettverk", tema: ["TLS", "IPsec", "HSTS", "VPN", "OWASP Top 10"],
        gjenganger: ["H2023-30"],
        ordrett: true,
        oppgave: "<p>Velg riktig begrep for å danne korrekte utsagn nedenfor.</p>",
        inspera: {
          type: "N",
          regelTekst: "Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 5, minimum 0.",
          regel: R(1, 0, 0, 5),
          tekst:
            "<p>{0} i TLS brukes til å etablere øktnøkkel (sesjonsnøkkel).</p>" +
            "<p>{1} krypteree all applikasjonsdata.</p>" +
            "<p>HSTS beskytter mot {2}.</p>" +
            "<p>I en sky-VPN kan brukerens ISP (Internet Service Provider) se {3}</p>" +
            "<p>{4} rangerer de mest kritiske sikkerhetsrisikoene for nettapplikasjoner.</p>",
          felt: [
            { etikett: "Etablerer øktnøkkel i TLS", valg: ["Alert-protokollen", "Handshake-protokollen", "Change Cipher Suite-protokollen", "Record-protokollen"], svar: 1, godta: [],
              explain: "Handshake-protokollen forhandler algoritmer, autentiserer tjeneren og etablerer øktnøkkelen. Record-protokollen bruker nøkkelen etterpå." },
            { etikett: "Krypterer all applikasjonsdata", valg: ["Både TLS og IPSec", "Bare TLS", "Bare IPSec"], svar: 0, godta: [],
              explain: "Begge krypterer applikasjonsdataene: TLS rundt hver forbindelse, IPsec IP-nyttelasten (i tunnelmodus hele den opprinnelige pakken)." },
            { etikett: "HSTS beskytter mot", valg: ["DOS", "XSS", "TLS-stripping"], svar: 2, godta: [],
              explain: "HSTS tvinger nettleseren til å bruke HTTPS, så en mann i midten ikke kan nedgradere til HTTP." },
            { etikett: "ISP ser i sky-VPN", valg: ["at brukeren har tilgang til sky-VPN men ser ikke innhold eller endelig destinasjon", "bare IP-adresse til endelig destinasjonen (og ikke ukryptert innhold)", "bare innholdet (i klartekst)", "alt innhold og IP-adresse til endelig destinasjonen"], svar: 0, godta: [],
              explain: "ISP-en ser bare en kryptert tunnel til VPN-tjeneren. Hvor trafikken går videre og hva den inneholder, er skjult inni tunnelen." },
            { etikett: "Rangerer risikoer for nettapplikasjoner", valg: ["Mitre ATT&amp;CK", "OWASP Top 10", "Cyber kill chain", "APT"], svar: 1, godta: [],
              explain: "OWASP Top 10 er lista over de ti mest kritiske risikoene for nettapplikasjoner. ATT&CK beskriver angriperteknikker, og kill chain beskriver angrepsfaser." }
          ]
        },
        avvik: null,
        merknad: "«krypteree» står slik i arket.",
        losning: ["Handshake → øktnøkkel. Både TLS og IPsec → krypterer data. HSTS → TLS-stripping. Sky-VPN → ISP ser bare at du bruker VPN. OWASP Top 10 → rangering."],
        tips: ["Ingen minuspoeng her, så svar på alle fem."]
      },
      /* ---------------------------------------------------------------- 26 */
      {
        key: "H2024-26", year: Y, oppgave_nr: "Oppgave 26", del: D4,
        ark: "Standardporter", title: "Standardporter for SSH, HTTPS, HTTP, FTP, RDP, Telnet",
        points: 3, block: "nettverk", tema: ["porter", "SSH", "HTTPS", "RDP"],
        ordrett: true,
        oppgave: "<p>Velg riktig standardport til hver tjeneste.</p><p>Finn de som passer sammen:</p>",
        inspera: {
          type: "M",
          regelTekst: "0,5 poeng for hvert riktig svar, -0,5 for hvert gale, 0 for ubesvart. Maks 3 poeng.",
          regel: R(0.5, -0.5, 0, 3),
          kolonner: ["21", "22", "23", "53", "80", "443", "3389"],
          multi: false,
          rader: [
            { s: "SSH", svar: [1], explain: "<p>SSH (sikker fjerninnlogging) bruker port 22.</p>" },
            { s: "HTTPS", svar: [5], explain: "<p>HTTP over TLS bruker port 443.</p>" },
            { s: "HTTP", svar: [4], explain: "<p>Ukryptert web bruker port 80.</p>" },
            { s: "FTP", svar: [0], explain: "<p>FTP-kontrollkanalen bruker port 21.</p>" },
            { s: "RDP", svar: [6], explain: "<p>Windows Remote Desktop bruker port 3389.</p>" },
            { s: "Telnet", svar: [2], explain: "<p>Telnet, den gamle ukrypterte fjerninnloggingen, bruker port 23.</p>" }
          ]
        },
        avvik: null,
        losning: ["21 FTP, 22 SSH, 23 Telnet, 53 DNS (ikke brukt), 80 HTTP, 443 HTTPS, 3389 RDP."],
        tips: ["21-22-23 kommer i rekkefølgen FTP, SSH, Telnet. Port 53 (DNS) er distraktoren."]
      },
      /* ---------------------------------------------------------------- 27 */
      {
        key: "H2024-27", year: Y, oppgave_nr: "Oppgave 27", del: D4,
        ark: "IDS", title: "IDS-regel",
        points: 2, block: "nettverk", tema: ["IDS", "Snort", "signaturbasert"],
        gjenganger: ["H2023-31", "H2025-20"],
        ordrett: true,
        oppgave: "<p>I kurset har vi gått igjennom enkelte IDS-er.</p>",
        figur: {
          beskrivelse:
            "Under svarfeltet: et utklipp fra NVD med overskriften «CVE-2017-0147 Detail» og «Current Description» (en kort engelsk tekst om en informasjonslekkasje i SMBv1-tjeneren i flere Windows-versjoner, «Windows SMB Information Disclosure Vulnerability»), kilde MITRE, sist endret 03/16/2017. Under det står en lang regel i monospace-skrift (se tekst).",
          tekst: [
            "alert tcp $HOME_NET 445 -> any any ( msg:\"OS-WINDOWS Microsoft Windows SMB possible leak of kernel heap memory\"; flow:to_client,established; content:\"Frag\",fast_pattern; content:\"Free\"; content:\"|FA FF FF|\"; content:\"|F8 FF FF|\",within 3,distance 5; content:\"|F8 FF FF|\",within 3,distance 5; metadata:policy balanced-ips alert,policy security-ips drop,ruleset community; service:netbios-ssn; reference:cve,2017-0147; reference:url,technet.microsoft.com/en-us/security/bulletin/MS17-010; classtype:attempted-recon; sid:42339; rev:2; )"
          ]
        },
        inspera: {
          type: "T",
          regelTekst: "Riktig svar gir to poeng, galt eller ubesvart gir 0 poeng.",
          regel: R(2, 0, 0, 2),
          tekst: "<p>Hvilket program er dette regelsettet et eksempel på? {0}</p>",
          felt: [
            { etikett: "IDS-program", godta: ["snort", "Snort IDS", "Snort3"], naer: { "Suricata": "Suricata leser også regler på denne formen, men rettenøkkelen godtar bare Snort, IDS-en kurset bruker.", "iptables": "iptables er en brannmur, ikke en IDS. Regelen med msg, sid og rev er en Snort-regel." },
              explain: "Formen «alert tcp kilde port -> mål port ( msg:…; content:…; sid:…; rev:…; )» er en Snort-regel. Snort er den signaturbaserte IDS-en kurset bruker." }
          ]
        },
        avvik: null,
        losning: ["Handling (alert), protokoll, kilde og port, pil, mål og port, og opsjoner i parentes med sid og rev → Snort."],
        tips: ["Kjenn igjen sid: og rev: på slutten av regelen. Det er typisk Snort."]
      },
      /* ---------------------------------------------------------------- 28 */
      {
        key: "H2024-28", year: Y, oppgave_nr: "Oppgave 28", del: D4,
        ark: "Protokollstack", title: "Internett- og OSI-stakken",
        points: 6, block: "nettverk", tema: ["OSI", "internettstakken", "lag"],
        gjenganger: ["H2021-5.1", "H2022-7.1", "H2025-22"],
        ordrett: true,
        oppgave: "<p>Flytt protokollnavn til riktig plass i protokollstakkene for internett og OSI. Riktig svar gir 0.5 poeng, galt svar -0.5. Minimum 0, maks 6 poeng.</p>",
        figur: {
          beskrivelse:
            "To stakker side om side. Venstre har overskriften «Internett-stakk», høyre «OSI-stakk». OSI-stakken har øverst en rad «App» og under den sju rader nummerert 7. til 1. ovenfra, med et slippfelt i hver. Internett-stakken har en turkis topprad uten tekst og under den fem felt av ulik høyde som står på linje med OSI-radene: ett felt som spenner over OSI 7–5, ett over 4, ett over 3, ett over 2 og et lysegrønt felt ved 1.",
          tekst: ["Internett-stakk", "OSI-stakk", "App", "7.", "6.", "5.", "4.", "3.", "2.", "1."]
        },
        inspera: {
          type: "D",
          regelTekst: "Riktig svar gir 0.5 poeng, galt svar -0.5. Minimum 0, maks 6 poeng.",
          regel: R(0.5, -0.5, 0, 6),
          tekst: null,
          bank: ["Link", "Presentasjon", "Nettverk", "Internett", "Fysisk", "Transport", "Applikasjon", "Sesjon"],
          felt: [
            { etikett: "Internett-stakk, øverst (ved OSI 7–5)", svar: 6, godta: [], explain: "Applikasjonslaget i internettstakken dekker OSI-lagene 7, 6 og 5." },
            { etikett: "Internett-stakk, ved OSI 4", svar: 5, godta: [], explain: "Transportlaget (TCP/UDP) er likt i begge modellene." },
            { etikett: "Internett-stakk, ved OSI 3", svar: 3, godta: [], explain: "Internettstakken kaller IP-laget «Internett»; i OSI heter det nettverkslaget." },
            { etikett: "Internett-stakk, ved OSI 2", svar: 0, godta: [], explain: "Linklaget (for eksempel Ethernet) er likt i begge." },
            { etikett: "Internett-stakk, nederst (ved OSI 1)", svar: 4, godta: [], explain: "Det fysiske laget er nederst i begge." },
            { etikett: "OSI 7", svar: 6, godta: [], explain: "Lag 7 er applikasjonslaget." },
            { etikett: "OSI 6", svar: 1, godta: [], explain: "Lag 6 er presentasjonslaget (format, koding)." },
            { etikett: "OSI 5", svar: 7, godta: [], explain: "Lag 5 er sesjonslaget." },
            { etikett: "OSI 4", svar: 5, godta: [], explain: "Lag 4 er transportlaget." },
            { etikett: "OSI 3", svar: 2, godta: [], explain: "Lag 3 er nettverkslaget." },
            { etikett: "OSI 2", svar: 0, godta: [], explain: "Lag 2 er linklaget." },
            { etikett: "OSI 1", svar: 4, godta: [], explain: "Lag 1 er det fysiske laget." }
          ]
        },
        avvik: "Eksamensarket (og kursets nettverkslysarket s. 7) tegner internett-stakken med applikasjon ved OSI 7–6 og transport ved OSI 5–4. Standard OSI-tilordning er applikasjon = OSI 7–5 og transport = OSI 4, og figuren her er tegnet slik. Poengene gis bare for lagnavnene, så svaret blir det samme.",
        losning: [
          "OSI ovenfra: Applikasjon, Presentasjon, Sesjon, Transport, Nettverk, Link, Fysisk.",
          "Internett ovenfra: Applikasjon, Transport, Internett, Link, Fysisk.",
          "12 felt × 0,5 = 6 poeng."
        ],
        tips: ["Huskeregel for OSI nedenfra: Fysisk, Link, Nettverk, Transport, Sesjon, Presentasjon, Applikasjon. «Internett» og «Nettverk» er samme lag med ulike navn."]
      },
      /* ---------------------------------------------------------------- 29 */
      {
        key: "H2024-29", year: Y, oppgave_nr: "Oppgave 29", del: D4,
        ark: "Mørke IP-adresser", title: "Hvorfor mørke IP-adresser",
        points: 4, block: "nettverk", tema: ["mørke IP-adresser", "honeypot", "deteksjon"],
        ordrett: true,
        oppgave: "<p>Virksomheten din har reservert enkelte ip-adresser mot å bli brukt. Dette kalles mørke ip-adresser, forklar kort (maks 25 ord) hvorfor dette gjøres for å øke sikkerheten.</p><p>Oppgaven gir fire poeng.</p>",
        inspera: {
          type: "E",
          regelTekst: "Oppgaven gir fire poeng.",
          regel: MAN(4),
          deler: [
            { del: "", poeng: 4, sporsmal: null, grense: "maks 25 ord" }
          ]
        },
        avvik: null,
        losning: [
          "Navngi: en billig honeypot-løsning (uten ekte maskiner).",
          "Hensikt: deteksjon.",
          "Hvorfor det virker: all trafikk til adressene er illegitim.",
          "Gevinst: finner kompromitterte klienter i eget nett."
        ],
        tips: ["Fire poeng = fire poenger på 25 ord. Ikke beskriv adressene som ekte maskiner angriperen kan logge inn på; da får du 0 for honeypot-poenget."]
      },
      /* ---------------------------------------------------------------- 30 */
      {
        key: "H2024-30", year: Y, oppgave_nr: "Oppgave 30", del: D5,
        ark: "eID-leverandører", title: "BankID, Buypass, Commfides og MinID",
        points: 2, block: "autentisering", tema: ["eID", "ID-porten", "autentiseringsnivå"],
        gjenganger: ["H2021-6.4", "H2022-8.4"],
        ordrett: true,
        oppgave: "<p>BankID, Buypass, Commfides og MinID er såkalte eID-leverandører. Velg om hvert utsagn er sant eller usant.</p><p>Si om hvert utsagn er sant eller usant.</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng; 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2; minimum 0.",
          regel: R(0.5, -0.5, 0, 2),
          kolonner: ["Usant", "Sant"],
          multi: false,
          rader: [
            { s: "Alle disse eID-leverandørene er statlige tjenester.", svar: [0], explain: "<p>Bare MinID er statlig (Digdir). BankID eies av bankene, og Buypass og Commfides er private selskaper.</p>" },
            { s: "Alle disse eID-leverandørene kan brukes for å logge på nettbanker.", svar: [0], explain: "<p>Nettbankene krever høyt nivå, i praksis BankID. MinID har lavere nivå og brukes ikke mot banker.</p>" },
            { s: "Alle offentlige tjenester på internett krever autentiseringsnivå HØYT.", svar: [0], explain: "<p>Nivået velges etter hvor sensitiv tjenesten er. Mange offentlige tjenester godtar et lavere nivå, for eksempel MinID.</p>" },
            { s: "Alle disse eID-leverandørene kan brukes for å logge seg på offentlige tjenester på internett (e-forvaltning).", svar: [1], explain: "<p>Alle fire er koblet til ID-porten, som offentlige tjenester bruker for innlogging.</p>" }
          ]
        },
        avvik: null,
        losning: ["Ordet «alle» gjør de tre første usanne. Det eneste de fire har felles, er at de kan brukes via ID-porten."],
        tips: ["Påstander med «alle» er ofte usanne. Se etter ett moteksempel (her: MinID)."]
      },
      /* ---------------------------------------------------------------- 31 */
      {
        key: "H2024-31", year: Y, oppgave_nr: "Oppgave 31", del: D5,
        ark: "Open ID Connect", title: "OIDC: rekkefølgen på 12 meldinger",
        points: 3, block: "iam", tema: ["OIDC", "føderering", "IdP", "SP", "ID-token"],
        gjenganger: ["H2021-7.2", "H2023-35"],
        ordrett: true,
        oppgave: "<p>Figuren viser scenarioet for brukerautentisering med OIDC. Sett inn tall 1 - 12 i hver melding for å vise rekkefølgen av meldingene i scenarioet.</p>",
        figur: {
          beskrivelse:
            "Tre aktører. Øverst til venstre en bygning med boksen «SP» (laksefarget). Øverst til høyre et hengelåssymbol med boksen «IdP» (grønn). Nede i midten en blå avrundet boks «Klient» med en person i dress foran seg. En stiplet pil med tekst «Føderasjonsavtale» forbinder SP og IdP øverst. Piler mellom aktørene, hver med et lite tomt tallfelt: «tjenesteforespørsel» (klient til SP), «liste over IdP-er» (SP til klient), «velg IdP» (klient til SP), «diriger nettleser til IdP» (SP til klient), «be om autentisering» (klient til IdP), «vis login-side» (IdP til klient), «presenter autentikator» (en buet pil fra personen med en gul nøkkel inn i klienten), «autentikator» (klient til IdP), «bruker-autentisering» (en sløyfe ved IdP), «send ID-token til klient» (IdP til klient, med en gul «ID»-lapp), «videresend ID-token til SP» (klient til SP, med gul «ID»-lapp) og «tjeneste» (SP til klient, langs bunnen).",
          tekst: ["Føderasjonsavtale", "SP", "IdP", "Klient", "tjenesteforespørsel", "liste over IdP-er", "velg IdP", "diriger nettleser til IdP", "be om autentisering", "vis login-side", "presenter autentikator", "autentikator", "bruker-autentisering", "send ID-token til klient", "videresend ID-token til SP", "tjeneste"]
        },
        inspera: {
          type: "T",
          regelTekst: "Poeng: 0,25 for korrekt tall, 0 for for feil eller intet tall, maks 3, minimum 0.",
          regel: R(0.25, 0, 0, 3),
          tekst: null,
          felt: [
            { etikett: "tjenesteforespørsel", godta: ["1", "en", "én", "ett"], explain: "Alt starter med at brukeren ber SP om en tjeneste." },
            { etikett: "liste over IdP-er", godta: ["2", "to"], explain: "SP vet ikke hvem brukeren er og viser hvilke IdP-er den stoler på." },
            { etikett: "velg IdP", godta: ["3", "tre"], explain: "Brukeren velger sin IdP." },
            { etikett: "diriger nettleser til IdP", godta: ["4", "fire"], explain: "SP sender nettleseren videre til den valgte IdP-en." },
            { etikett: "be om autentisering", godta: ["5", "fem"], explain: "Klienten kommer til IdP med en forespørsel om autentisering." },
            { etikett: "vis login-side", godta: ["6", "seks"], explain: "IdP svarer med innloggingssiden." },
            { etikett: "presenter autentikator", godta: ["7", "sju", "syv"], explain: "Brukeren gir passord, kode eller nøkkel til klienten." },
            { etikett: "autentikator", godta: ["8", "åtte"], explain: "Klienten sender autentikatoren til IdP." },
            { etikett: "bruker-autentisering", godta: ["9", "ni"], explain: "IdP sjekker autentikatoren." },
            { etikett: "send ID-token til klient", godta: ["10", "ti"], explain: "Er alt i orden, får klienten et signert ID-token." },
            { etikett: "videresend ID-token til SP", godta: ["11", "elleve"], explain: "Klienten tar tokenet med tilbake til SP." },
            { etikett: "tjeneste", godta: ["12", "tolv"], explain: "SP stoler på IdP (føderasjonsavtalen), godtar tokenet og leverer tjenesten." }
          ]
        },
        avvik: null,
        merknad: "«for for feil» står slik i arket.",
        losning: ["Tre runder: hos SP (1–4), hos IdP (5–10), tilbake til SP (11–12).", "Følg tokenet: det lages hos IdP (9–10) og brukes hos SP (11–12)."],
        tips: ["Ingen minuspoeng, så fyll ut alle tolv. Start med 1 og 12, som er de enkleste."]
      },
      /* ---------------------------------------------------------------- 32 */
      {
        key: "H2024-32", year: Y, oppgave_nr: "Oppgave 32", del: D6,
        ark: "NSMs grunnprinsipper og NIST CSF", title: "NSM, NIST, begge eller ingen",
        points: 2, block: "risiko", tema: ["NSM grunnprinsipper", "NIST CSF", "ISO 27001"],
        gjenganger: ["H2023-37", "H2021-8.2", "H2025-29"],
        ordrett: true,
        oppgave: "<p>NSMs grunnprinsipper for IKT-sikkerhet, og NIST CSF (Cybersecurity Framework) er to standarder/veiledere for informasjonssikkerhet. Indiker om hvert utsagn nedenfor gjelder for NSM, NIST, begge eller ingen.</p><p>Indiker hva som gjelder for hvert utsagn.</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2, minimum 0.",
          regel: R(0.5, -0.5, 0, 2),
          kolonner: ["NSM", "NIST", "begge", "ingen"],
          multi: false,
          rader: [
            { s: "Kategoriserer sikkerhetstiltak etter sikkerhetsfunksjoner/prosesser (f.eks. kartlegge, beskytte, oppdage, håndtere)", svar: [2], explain: "<p>Begge er bygd opp etter funksjoner. NSM har fire kategorier (identifisere og kartlegge, beskytte og opprettholde, oppdage, håndtere og gjenopprette), NIST CSF har tilsvarende funksjoner.</p>" },
            { s: "Standarden/veilederen må kjøpes", svar: [3], explain: "<p>Begge er gratis å laste ned. Det er ISO-standardene som må kjøpes.</p>" },
            { s: "Er publisert på norsk", svar: [0], explain: "<p>NSM er norsk og publiserer på norsk. NIST CSF er amerikansk og på engelsk.</p>" },
            { s: "Kan brukes sammen med ISO/IEC 27001", svar: [2], explain: "<p>Begge er tiltaksbanker som kan brukes til å velge tiltak innenfor et ISMS etter ISO 27001.</p>" }
          ]
        },
        avvik: null,
        losning: ["Funksjoner: begge. Må kjøpes: ingen. Norsk: NSM. Med 27001: begge."],
        tips: ["Det er ISO-standardene du må betale for, ikke NSM eller NIST.", "NIST CSF 2.0 (februar 2024) har seks funksjoner, der GOVERN er ny. Eldre eksamenssett bruker fem. Svaret på denne oppgaven påvirkes ikke."]
      },
      /* ---------------------------------------------------------------- 33 */
      {
        key: "H2024-33", year: Y, oppgave_nr: "Oppgave 33", del: D6,
        ark: "Beslutningspunkter for risikostyring", title: "Grunner til «Nei» på beslutningspunkt 1 og 2",
        points: 2, block: "risiko", tema: ["risikostyring", "beslutningspunkt", "risikohåndtering"],
        gjenganger: ["H2022-10.2"],
        ordrett: true,
        oppgave: "<p>Figuren for risikostyring viser to beslutningspunkter.</p>",
        figur: {
          beskrivelse:
            "Flytskjema i en oransje stiplet ramme merket «Risikostyring» til venstre. Ovenfra: boks «Kontekstetablering», pil ned til oval «Risikovurdering (ROS)», pil ned til en rombe «Beslutningspunkt 1: Akseptabel vurdering?» med N-pil tilbake opp til Kontekstetablering og J-pil ned til boks «Risikohåndteringsplan», pil ned til rombe «Beslutningspunkt 2: Akseptabel plan?» med N-pil tilbake opp til Kontekstetablering og J-pil ned til boks «Dokumentér risikovurdering og -håndtering».",
          tekst: ["Risikostyring", "Kontekstetablering", "Risikovurdering (ROS)", "N", "J", "Beslutningspunkt 1: Akseptabel vurdering?", "Risikohåndteringsplan", "Beslutningspunkt 2: Akseptabel plan?", "Dokumentér risikovurdering og -håndtering"]
        },
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, minimum 0.",
          regel: R(0.5, -0.5, 0, 2),
          regelMerknad: "To separate flervalgsspørsmål med to riktige hver. Regelen gjelder per avkrysset alternativ.",
          sporsmal: [
            {
              tekst: "<p>Velg relevant(e) grunn(er) til å svare \"Nei\" på beslutningspunkt 1</p>",
              alternativer: ["Virksomheten må først gjennomføre OSINT.", "Relativt dårlig spredning av risikonivåer.", "Det hersker fremdeles stor uvisshet rundt en eller flere høye risikoer.", "Utilstrekkelig budsjett for å innføre sikkerhetstiltak."],
              svar: [1, 2],
              explain: [
                "OSINT er en metode for informasjonsinnhenting, ikke et kriterium for om vurderingen er god nok.",
                "Riktig. Ligger alle risikoene på omtrent samme nivå, kan man ikke prioritere. Da er vurderingen ikke god nok.",
                "Riktig. Er det fortsatt stor usikkerhet om de høye risikoene, må vurderingen gjøres grundigere.",
                "Budsjett angår tiltakene, altså planen. Det hører til beslutningspunkt 2."
              ]
            },
            {
              tekst: "<p>Nevn relevant(e) grunn(er) til å svare \"Nei\" på beslutningspunkt 2.</p>",
              alternativer: ["Det må først gjennomføres OSINT.", "Det er for mange aksepterte risikoer.", "Alle risikoene har omtrent samme nivå.", "Utilstrekkelig budsjett til foreslåtte sikkerhetstiltak."],
              svar: [1, 3],
              explain: [
                "OSINT har ikke noe med godkjenning av en håndteringsplan å gjøre.",
                "Riktig. Planen lar for mye risiko stå igjen uten tiltak. Ledelsen kan ikke godta den.",
                "Det handler om kvaliteten på vurderingen, altså beslutningspunkt 1.",
                "Riktig. En plan med tiltak man ikke har råd til, kan ikke gjennomføres."
              ]
            }
          ]
        },
        avvik: null,
        losning: ["Punkt 1 spør: er vurderingen god nok? (spredning, usikkerhet).", "Punkt 2 spør: er planen akseptabel? (restrisiko, budsjett)."],
        tips: ["Kryss bare av det du er sikker på: hvert feil kryss koster 0,5."]
      },
      /* ---------------------------------------------------------------- 34 */
      {
        key: "H2024-34", year: Y, oppgave_nr: "Oppgave 34", del: D6,
        ark: "Prosess for risikovurdering", title: "Trinnene i risikovurdering (ROS)",
        points: 3, block: "risiko", tema: ["risikovurdering", "risikoidentifisering", "risikoanalyse", "risikoevaluering"],
        gjenganger: ["H2022-10.1", "H2023-38"],
        ordrett: true,
        oppgave: "<p>Figuren nedenfor viser prosess for risikovurdering der noen av trinnene mangler beskrivelse.</p><p>Sett inn elementene i riktig felt for å beskrive trinnene.</p>",
        figur: {
          beskrivelse:
            "Øverst boksen «Kontekstetablering». Under den en stor gul avrundet figur merket «Risikovurdering (ROS)» til venstre. Inni står tre tomme trinnfelt under hverandre, forbundet med piler nedover. Fra hvert trinnfelt går en stiplet linje til høyre til en klammeparentes med en punktliste. Første liste: et tomt felt øverst, så «Identifisering av trusler», «Identifisering av eksisterende tiltak», «Identifisering av sårbarheter», «Identifisering av konsekvenser». Andre liste: «Estimere verdier og konsekvenser», «Estimere sannsynlighet for hendelser», og et tomt felt nederst. Tredje liste: et tomt felt øverst, så «Sammenligne med terskelnivå». Under den gule figuren en rombe «Beslutningspunkt 1».",
          tekst: ["Kontekstetablering", "Risikovurdering (ROS)", "Identifisering av trusler", "Identifisering av eksisterende tiltak", "Identifisering av sårbarheter", "Identifisering av konsekvenser", "Estimere verdier og konsekvenser", "Estimere sannsynlighet for hendelser", "Sammenligne med terskelnivå", "Beslutningspunkt 1"]
        },
        inspera: {
          type: "D",
          regelTekst: "Poeng: 0,5p for hver riktig; -0.5p for hver feil; 0p for ubesvart; 3p for alle riktig; minimum 0p.",
          regel: R(0.5, -0.5, 0, 3),
          tekst: null,
          bank: ["Risikoanalyse", "Risikorangering", "Verdi-identifisering", "Risikoidentifisering", "Risikoevaluering", "Risikoberegning"],
          felt: [
            { etikett: "Første punkt i lista til trinn 1", svar: 2, godta: [], explain: "Før du finner trusler og sårbarheter, må du vite hva som skal beskyttes: verdi-identifisering." },
            { etikett: "Trinn 1", svar: 3, godta: [], explain: "Alle punktene i lista starter med «Identifisering av», så trinnet er risikoidentifisering." },
            { etikett: "Trinn 2", svar: 0, godta: [], explain: "Her estimeres verdier, konsekvenser og sannsynlighet: risikoanalyse." },
            { etikett: "Siste punkt i lista til trinn 2", svar: 5, godta: [], explain: "Når sannsynlighet og konsekvens er estimert, beregnes risikonivået: risikoberegning." },
            { etikett: "Første punkt i lista til trinn 3", svar: 1, godta: [], explain: "Risikoene settes i rekkefølge etter nivå: risikorangering." },
            { etikett: "Trinn 3", svar: 4, godta: [], explain: "Å sammenligne med terskelnivå for å avgjøre hva som er akseptabelt, er risikoevaluering." }
          ]
        },
        avvik: null,
        losning: ["Trinnene: identifisering → analyse → evaluering.", "Delpunktene: verdier først (identifisering), beregning sist (analyse), rangering først (evaluering)."],
        tips: ["«Identifisering av …»-lista avslører trinn 1. «Estimere …» avslører analyse. «Sammenligne med terskel» avslører evaluering."]
      },
      /* ---------------------------------------------------------------- 35 */
      {
        key: "H2024-35", year: Y, oppgave_nr: "Oppgave 35", del: D6,
        ark: "ISMS", title: "Hva et ISMS er",
        points: 1, block: "risiko", tema: ["ISMS", "ISO 27001", "ledelsessystem"],
        ordrett: true,
        oppgave: "<p>Hva er riktig om ISMS (Information Security Management System)?</p>",
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart.",
          regel: R(0.5, -0.5, 0, 1),
          alternativer: ["Det er et sett med policyer og prosedyrer for informasjonssikkerhet.", "NSMs grunnprinsipper for IKT-sikkerhet er et ISMS.", "Det betyr det samme som ledelsessystem for informasjonssikkerhet.", "Det er en applikasjon som styrer sikkerheten i virksomheter."],
          svar: [0, 2],
          explain: [
            "Riktig. Et ISMS er de policyene, prosedyrene og rutinene virksomheten bruker til å styre informasjonssikkerheten.",
            "NSMs grunnprinsipper er en samling tiltak (tiltaksbank), ikke et styringssystem.",
            "Riktig. ISMS oversettes med ledelsessystem (eller styringssystem) for informasjonssikkerhet.",
            "Et ISMS er en organisatorisk måte å jobbe på, ikke en programvare."
          ]
        },
        avvik: null,
        losning: ["ISMS = styringssystem/ledelsessystem: policyer, prosesser og ansvar. Kravene står i ISO 27001."],
        tips: ["«System» betyr her organisering, ikke IT-system."]
      },
      /* ---------------------------------------------------------------- 36 */
      {
        key: "H2024-36", year: Y, oppgave_nr: "Oppgave 36", del: D7,
        ark: "CTI", title: "Tre nivåer av CTI og MITRE ATT&CK",
        points: 3, block: "cyberops", tema: ["CTI", "strategisk", "taktisk", "teknisk", "MITRE ATT&CK"],
        gjenganger: ["H2021-10.3"],
        ordrett: true,
        oppgave: "<p>CTI (Cyber Threat Intelligence - digital trusseletterretning) deles typisk inn i tre hovednivåer, som vist på figuren nedenfor. Bokstavene A, B og C er bare uspesifikke navn, som representerer egentlige spesifikke typer CTI for hvert nivå.</p>",
        figur: {
          beskrivelse:
            "En lys gul pyramide i tre lag med blå kanter. Toppen er merket «Nivå A», midten «Nivå B» og bunnen (bredest) «Nivå C». Til venstre står teksten «Nivåer av CTI».",
          tekst: ["Nivåer av CTI", "Nivå A", "Nivå B", "Nivå C"]
        },
        inspera: {
          type: "T",
          regelTekst: "Poeng: 0,5p for hver riktig, 0p for feil eller ubesvart, maks 3p, minimum 0p.",
          regel: R(0.5, 0, 0, 3),
          regelMerknad: "Blandet oppgave: tre tekstfelt (godta-liste) og tre nedtrekk (valg/svar).",
          tekst:
            "<p>Nivå A kalles {0} CTI.</p><p>Nivå B kalles {1} CTI.</p><p>Nivå C kalles {2} CTI.</p><p>Er du i tvil om stavemåte for oppgavene over, spør faglærer.</p>" +
            "<p>MITRE ATT&amp;CK beskriver CTI-elementer på {3}.</p><p>Den mest detaljerte CTI er på {4}.</p><p>Den mest kortvarige CTI er på {5}</p>",
          felt: [
            { etikett: "Nivå A", godta: CTI_A, naer: { "operasjonell": "Operasjonell (taktisk) er midtnivået med TTP-er. Toppen er strategisk CTI.", "taktisk": "Taktisk/operasjonell er midtnivået med TTP-er. Toppen er strategisk CTI." }, explain: "Toppen er strategisk CTI: overordnet bilde av aktører, motiver og trender for ledelsen." },
            { etikett: "Nivå B", godta: CTI_B, naer: { "teknisk": "Teknisk CTI er bunnen (IP-adresser, domener og filhasher). Midten med TTP-er er taktisk/operasjonell.", "strategisk": "Strategisk CTI er toppen (overordnet bilde for ledelsen). Midten med TTP-er er taktisk/operasjonell." }, explain: "Midten er taktisk/operasjonell CTI: hvordan aktørene jobber, altså TTP-ene." },
            { etikett: "Nivå C", godta: CTI_C, naer: { "taktisk": "Taktisk/operasjonell er midten (TTP-er, f.eks. MITRE ATT&amp;CK). Bunnen med IP-adresser og filhasher er teknisk CTI.", "operasjonell": "Taktisk/operasjonell er midten (TTP-er, f.eks. MITRE ATT&amp;CK). Bunnen med IP-adresser og filhasher er teknisk CTI." }, explain: "Bunnen er teknisk CTI: konkrete angrepsindikatorer som IP-adresser, domener og filhasher." },
            { etikett: "MITRE ATT&amp;CK", valg: ["nivå A", "nivå B", "nivå C"], svar: 1, godta: [], explain: "ATT&CK er en katalog over taktikker og teknikker, altså TTP-er. Det er taktisk nivå (B)." },
            { etikett: "Mest detaljert", valg: ["nivå A", "nivå B", "nivå C"], svar: 2, godta: [], explain: "Tekniske indikatorer er de mest konkrete og detaljerte." },
            { etikett: "Mest kortvarig", valg: ["nivå A", "nivå B", "nivå C"], svar: 2, godta: [], explain: "En angriper kan bytte IP-adresse eller filhash på minutter, så teknisk CTI blir fort utdatert. TTP-er er mye vanskeligere å endre." }
          ]
        },
        avvik: null,
        losning: ["Ovenfra: strategisk, taktisk/operasjonell, teknisk.", "ATT&CK = B. Mest detaljert og mest kortvarig = C."],
        tips: ["Jo lenger ned i pyramiden, jo mer detaljert og jo kortere levetid. ATT&CK er ikke teknisk CTI, selv om det høres teknisk ut."]
      },
      /* ---------------------------------------------------------------- 37 */
      {
        key: "H2024-37", year: Y, oppgave_nr: "Oppgave 37", del: D7,
        ark: "Cyberkrigføring", title: "Selvfinansiert cyberavdeling og bruk av exploits",
        points: 2, block: "cyberops", tema: ["cyberkrigføring", "nulldagssårbarhet", "løsepengevirus", "exploit"],
        ordrett: true,
        oppgave: "<p>Land A har et begrenset budsjett for å drifte sin militære cyberavdeling.</p>",
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart.",
          regel: R(0.5, -0.5, 0, 2),
          regelMerknad: "To separate flervalgsspørsmål med to riktige hver.",
          sporsmal: [
            {
              tekst: "<p>Land A har et begrenset budsjett for å drifte sin militære cyberavdeling. Velg realistisk praksis   som cyberavdelingen kan benytte for å bli selvfinansiert, slik at den ikke belaster statsbudsjettet. Du kan anta at land A ikke har etiske eller moralske skrupler med hensyn til cyberkrigføring.</p>",
              alternativer: ["Gjennomføre OSINT mot andre land", "Angrip andre land med løsepengevirus", "Drifte en TOR-node", "Selge nulldagssårbarheter"],
              svar: [1, 3],
              explain: [
                "OSINT gir informasjon, men ingen inntekt.",
                "Riktig. Løsepenger gir direkte inntekt. Noen statlige aktører finansierer seg slik.",
                "En TOR-node koster penger å drifte og gir ingen inntekt.",
                "Riktig. Nulldagssårbarheter har høy markedsverdi og kan selges."
              ]
            },
            {
              tekst: "<p>Anta at land A planlegger et militært angrep på land B. Den militære cyberavdelingen i land A har et begrenset arsenal av exploits. Velg den/de mest fornuftige måten(e) blant alternativene under for land A å benytte sitt exploit-arsenal.</p>",
              alternativer: ["Benytt exploit-arsenalet i innledende fase av militærangrepet", "Benytt exploit-arsenalet for å svekke land B i ukene og månedene før militærangrepet.", "Benytt exploit-angrepet for å angripe land B med NMAP.", "Selg exploit-arsenalet for å tjene penger."],
              svar: [0, 1],
              explain: [
                "Riktig. Cyberangrep som slår ut kommunikasjon og infrastruktur akkurat når angrepet starter, gir størst militær effekt.",
                "Riktig. Arket godtar også å svekke motstanderen i forkant, for eksempel ved å skaffe seg tilgang og forstyrre før selve angrepet.",
                "Nmap er et skanneverktøy, ikke en måte å bruke exploits på.",
                "Å selge arsenalet rett før et planlagt angrep fjerner egen kapasitet og kan avsløre den."
              ]
            }
          ]
        },
        avvik: "Del 2: begge de to første alternativene er merket riktige. De kan virke i konflikt med hverandre: en exploit som er brukt, blir ofte oppdaget og tettet, så et begrenset arsenal kan ikke brukes både måneder før og i innledende fase. Arket godtar likevel begge.",
        losning: ["Del 1: det som gir penger (løsepenger, salg av nulldager).", "Del 2: bruk arsenalet for å støtte det militære angrepet (før og i starten)."],
        tips: ["Les «ingen etiske skrupler»: da er det de lønnsomme alternativene som er riktige."]
      },
      /* ---------------------------------------------------------------- 38 */
      {
        key: "H2024-38", year: Y, oppgave_nr: "Oppgave 38", del: D8,
        ark: "Retten er satt", title: "MAC-signatur, ARP-forgiftning og hvem som står bak",
        points: 10, block: "nettverk", tema: ["MAC", "ubenektelighet", "ARP-spoofing", "mann-i-midten", "Ettercap", "Scapy"],
        ordrett: true,
        oppgave:
          "<p>Alice (10.0.0.15), Bob(10.0.0.33, mac-adresse: 34-24-d8-02-24), Charlie (10.0.0.155) og Stine (10.0.0.184) kommuniserer på et internt datanett. De signerer meldingene sine med en å legge med en MAC (Message Authentication Code), generert med felles nøkkel.</p>" +
          "<p>En dag får Alice en melding (per TCP), som tilsynelatende kommer fra Bob. Meldingen er signert, og kommer fra Bobs IP-adresse (10.0.0.33). Bob nekter for å ha sendt denne meldingen.</p>" +
          "<p>Bobs venn Charlie har lagt med en kopi av sin arp-tabell fra tiden da pakkene ble sendt.</p>" +
          "<p>Du skal hjelpe Bobs advokat med å frikjenne Bob. Du må med andre ord hjelpe til med å finne alternative, men rimelige løsninger som skaper rimelig tvil om saken.<br>Løsningen bør beskrive beskrive hvem andre enn Bob som kan stå bak.</p>" +
          "<p>Du skal altså beskrive hvordan angrepet har blitt gjennomført, basert på hva du har lært i IN2120. En god løsning bør håndtere både bruken av signatur og Bobs IP-adresse.</p>" +
          "<p>\"Rimelig tvil i straffesaker\" er her definert som: \"Det er ikke enhver teoretisk tvil som skal komme tiltalte til gode, men kun dersom det er en fornuftig rimelig tvil ved det faktum som må legges til grunn for at handlingen er straffbar. Med andre ord at det er en reell og ikke bare en teoretisk mulighet for at faktum ikke er riktig, slik aktor har lagt det frem.\" (jusinfo.no)</p>" +
          "<p>Ps: Til studenter med juridisk kompetanse - Bobs advokat snakker flytende jus, og trenger ingen juridisk hjelp. Ikke bruk tid eller plass på juridiske betraktninger, de gir ingen poeng i oppgaven. I oppgaven ønskes et rent IT-teknisk svar.</p>",
        figur: {
          beskrivelse:
            "Skjermbilde av en PowerShell-utskrift med ledeteksten «PS C:\\Users\\charlie> arp -a», etterfulgt av en tabell med tre kolonner: Internet Address, Physical Address og Type. Fire rader. Merk at 10.0.0.33 (Bob) og 10.0.0.184 (Stine) har samme fysiske adresse, og at den ikke er lik Bobs oppgitte MAC-adresse.",
          tekst: [
            "PS C:\\Users\\charlie> arp -a",
            "Internet Address    Physical Address     Type",
            "10.0.0.15           98-77-e7-ef-06-27    dynamic",
            "10.0.0.33           28-47-d7-ff-06-57    dynamic",
            "10.0.0.155          44-00-4e-00-00-fc    static",
            "10.0.0.184          28-47-d7-ff-06-57    dynamic"
          ]
        },
        inspera: {
          type: "E",
          regelTekst: "Oppgaven gir totalt 10 poeng.",
          regel: MAN(10),
          deler: [
            { del: "A)", poeng: 2, sporsmal: "<p>Oppgave A: Beskriv hvorfor bruken av denne typen signaturer ikke kan brukes til å sikkert identifisere Bob (hvem kan ha generert MAC-signaturen) (2poeng).</p>", grense: "kort" },
            { del: "B)", poeng: 1, sporsmal: "<p>Oppgave B; Beskriv en annen, og sikrere, metode som hadde unikt kunnet identifisere avsender (1 poeng).  (Svar kort)</p>", grense: "svar kort" },
            { del: "C)", poeng: 2, sporsmal: "<p>Oppgave C: Navngi angrepet som er blitt benyttet (2 poeng) (svar kort)</p>", grense: "svar kort" },
            { del: "D)", poeng: 3, sporsmal: "<p>Oppgave D: Identifiser hvem som (mest trolig) står bak (3 poeng). (Begrunn, men maks to setninger)</p>", grense: "maks to setninger" },
            { del: "E)", poeng: 1, sporsmal: "<p>Oppgave E: Navngi ett verktøy som kan ha vært brukt til å gjennomføre angrepet (1 poeng).</p>", grense: "ett verktøy" },
            { del: "F)", poeng: 1, sporsmal: "<p>Oppgave F: Navngi ett verktøy som kan brukes til å generere falske pakker (1 poeng).</p>", grense: "ett verktøy" }
          ]
        },
        avvik: ["Bobs MAC-adresse er oppgitt med fem bytes («34-24-d8-02-24»); en MAC-adresse har seks. Den avviker uansett fra adressen i ARP-tabellen, som er poenget.", "Ordet «MAC» brukes både om nettverksadresse og om meldingsautentiseringskode i samme oppgave, og arket kaller en MAC for «signatur».", "Charlies ARP-tabell inneholder hans egen adresse (10.0.0.155, static); en vanlig ARP-tabell viser ikke maskinens egen IP. Det kan tolkes som et tegn på at utskriften er manipulert, og støtter alternativet i sensorens D-del."],
        merknad: "Skrivefeilene «med en å legge med en MAC», «beskrive beskrive», «(2poeng)» og «Oppgave B;» står slik i arket.",
        losning: [
          "A: Felles nøkkel → alle fire kan lage MAC-en → ingen ubenektelighet.",
          "B: Digital signatur med Bobs private nøkkel, offentlig nøkkel bundet til Bob i en PKI.",
          "C: ARP-forgiftning (ARP-spoofing) som gir mann-i-midten.",
          "D: Bobs IP peker på samme MAC-adresse som Stines IP → Stine. Nevn i tillegg at Charlie kan ha forfalsket tabellen.",
          "E: Ettercap eller Bettercap. F: Scapy eller hping3."
        ],
        tips: ["Les ARP-tabellen nøye: to IP-adresser med samme fysiske adresse er det klassiske sporet etter ARP-forgiftning.", "Ikke svar at Bob er skyldig, og ikke skriv juss: begge deler gir 0 p."]
      }
    ]
  };

  /* =================================================================== PERFEKT */
  var P = IN.PERFEKT;

  P["H2024-1"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Tenk på en skatt. Før skattejakten må kartet være hemmelig. Under jakten må alle kunne komme inn i parken. Etter jakten må ingen få bytte om på hvem som fant hva.</p>",
    normal: "<p>Før eksamen er lekkasje det verste (konfidensialitet). Under eksamen er nedetid det verste (tilgjengelighet). Etter innlevering er endring av besvarelser det verste (integritet).</p>",
    teknisk: "<p>Verdien er den samme (oppgaver og besvarelser), men trusselbildet endrer seg med fasen. Riktig prioritering kommer fra å spørre hvilken hendelse som gjør størst skade akkurat da: lekket oppgavesett før start, plattformen nede mens 300 studenter skriver, eller manipulerte svar før sensur.</p>" } };

  P["H2024-2"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Trygghet er at du ikke faller og slår deg. Sikkerhet er at ingen stjeler sykkelen din. Visshet er at du vet noe. Garanti er at du stoler på at låsen virker.</p>",
    normal: "<p>Safety = trygghet (ulykker), security = sikkerhet (angrep), certainty = visshet (å vite), assurance = garanti (tillit til at tiltakene virker).</p>",
    teknisk: "<p>Skillet mellom safety og security går på intensjon: utilsiktede hendelser mot tilsiktede angrep. Assurance er graden av tillit til at sikkerhetsmekanismene oppfyller kravene. Ordene er ikke definert på 2026-lysarkene, men har kommet hvert år 2023–2025.</p>" } };

  P["H2024-3"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Spør hva som skjer: blir noe lest (hemmelighet brutt), endret (riktighet brutt) eller gjort umulig å bruke (tilgang brutt)?</p>",
    normal: "<p>Avlytting bryter K. Sletting, IPS-blokkering av feil adresse og kontosperre etter mange forsøk bryter T. Uautorisert endring og hashkollisjon i signatur bryter I.</p>",
    teknisk: "<p>Fellene er radene der et forsvarstiltak blir våpenet: en IPS som blokkerer en forfalsket avsender, og en kontosperre som utløses av angriperen. Begge stenger ute legitime brukere (T). En hashkollisjon lar angriperen bytte innhold under en gyldig signatur, altså et integritetsangrep.</p>" } };

  P["H2024-4"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Svart boks: du ser ingenting inni. Hvit (glass) boks: du ser alt. Grå: du ser litt.</p>",
    normal: "<p>Testeren får en skisse og noe kunnskap, men ikke alt. Det er gråboks-testing.</p>",
    teknisk: "<p>Gråboks gir en realistisk innsideposisjon (for eksempel en ansatt eller en angriper som har gjort rekognosering) og sparer tid sammenlignet med svartboks, uten full kodeinnsikt som i hvitboks.</p>" } };

  P["H2024-5"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Tenk på et hus med vakter. Gjesten (bruker) kan gå i stua, men ikke inn på kontoret til husverten (kjernen) eller i sjefens hvelv (hypervisoren).</p>",
    normal: "<p>Brukermodus er nivå 3. En prosess der kan bruke sitt eget nivå, men ikke nivå 0 (kjerne) eller −1 (hypervisor).</p>",
    teknisk: "<p>Maskinvaren håndhever ringene: lavere tall har mer privilegium. Overganger fra ring 3 til ring 0 skjer bare kontrollert via systemkall, der kjernen gjør jobben for prosessen. Brukerprosessen får aldri direkte tilgang til kjernens eller hypervisorens minne.</p>" } };

  P["H2024-6"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Hash er et fingeravtrykk. PKI er passkontoret. Symmetrisk er én nøkkel begge har. Asymmetrisk er en hengelås alle kan låse, men bare du kan åpne.</p>",
    normal: "<p>Enveis og integritet → hash. Sertifikater → PKI. Felles hemmelig nøkkel → symmetrisk. Privat og offentlig nøkkel → asymmetrisk.</p>",
    teknisk: "<p>Hver rad har ett kjennetegn som bare passer én kolonne. PKI er ikke en kryptoalgoritme, men infrastrukturen (CA-er, sertifikater) som gir autentisitet til offentlige nøkler.</p>" } };

  P["H2024-7"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Et nøkkelpar er som to halvdeler av en magisk nøkkel: det den ene låser, kan bare den andre åpne. Hvis en tyv har en kopi av din halvdel, må hele låsen byttes.</p>",
    normal: "<p>Brukt privat → åpnes med offentlig. Brukt offentlig → åpnes med privat, og Alice har en kopi av Bobs private. Bob må få nøkkelparet tilbakekalt; arket kaller det å revokere den offentlige nøkkelen.</p>",
    teknisk: "<p>Asymmetriske operasjoner er inverse innen samme nøkkelpar. Når K<sup>B</sup><sub>priv</sub> er kompromittert, er både konfidensialitet for meldinger til Bob og ubenekteligheten i Bobs signaturer tapt. Tilbakekalling skjer ved at CA-en publiserer sertifikatet for K<sup>B</sup><sub>pub</sub> som ugyldig, og Bob lager et nytt nøkkelpar.</p>" } };

  P["H2024-8"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Du har en liste med ord. Regler lager mange varianter av hvert ord, som «katt», «Katt1» og «k@tt!».</p>",
    normal: "<p>John the Ripper bruker parameteren for regler (rules) til å lage varianter av ordene i ordlista.</p>",
    teknisk: "<p>Regelbasert ordlisteangrep utnytter at folk bygger passord av ord med forutsigbare endringer (stor forbokstav, tall og tegn til slutt, leetspeak). Det gir mange flere treff enn ren ordliste og er langt raskere enn uttømmende søk.</p>" } };

  P["H2024-9"] = { type: "eksamen", hvorfor: {
    eli5: "<p>HSTS er en lapp nettleseren husker: «Til denne butikken går vi bare gjennom den låste døra.»</p>",
    normal: "<p>TLS-stripping holder offeret på HTTP. HSTS får nettleseren til å nekte alt annet enn HTTPS for domenet.</p>",
    teknisk: "<p>Tjeneren sender headeren Strict-Transport-Security, og nettleseren lagrer at domenet bare skal nås over HTTPS i en gitt periode. Svakheten er første besøk (trust on first use), som preload-lista dekker.</p>" } };

  P["H2024-10"] = { type: "eksamen", hvorfor: {
    eli5: "<p>iptables er dørvakten. IPsec er en hemmelig tunnel. Wireshark er et forstørrelsesglass for nettrafikk.</p>",
    normal: "<p>Linux-brannmur = iptables. VPN = IPsec. Wireshark = pakkeanalysator.</p>",
    teknisk: "<ul><li>iptables er grensesnittet til pakkefilteret i Linux-kjernen (kjeder INPUT, OUTPUT, FORWARD).</li><li>IPsec gir kryptering og autentisering på IP-laget, for VPN typisk i tunnelmodus.</li><li>Wireshark fanger pakker passivt og dekoder protokollene; den filtrerer bare det den viser, ikke trafikken.</li></ul>" } };

  P["H2024-11"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Hvert ekstra tegn ganger antall muligheter med antall tegn du kan velge. Fire ekstra tegn betyr å gange fire ganger.</p>",
    normal: "<p>105¹⁴ / 105¹⁰ = 105⁴. Passordet blir 105⁴ ganger vanskeligere å gjette ved uttømmende søk.</p>",
    teknisk: "<p>Søkerommet er N^L. Forholdet mellom to lengder med samme tegnsett er N^(L₂−L₁). Det forutsetter tilfeldig valgte tegn; menneskevalgte passord har mye lavere entropi.</p>" } };

  P["H2024-12"] = { type: "eksamen", hvorfor: {
    eli5: "<p>En signatur er som håndskriften din: bare du kan lage den, og alle kan sjekke den. En MAC er som et hemmelig passord dere to deler: dere vet at det er en av dere, men ingen andre kan si hvem.</p>",
    normal: "<p>Signatur: asymmetrisk og ubenektelig. MAC: symmetrisk og enkel. Lekket privat nøkkel: slutt å signere. Lekket offentlig nøkkel: ikke noe problem.</p>",
    teknisk: "<p>Ubenektelighet krever at bare én part kan lage autentiseringsverdien, og at en tredjepart kan verifisere den. Med MAC = Hash(M, k) har begge parter k, så ingen av delene er oppfylt. Den offentlige nøkkelen er ment å være kjent, så publisering påvirker ikke sikkerheten.</p>" } };

  P["H2024-13"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Noe du bryr deg om (verdier), noen som vil deg vondt (trusler) og et hull i gjerdet (sårbarheter). Har du alle tre, har du en risiko.</p>",
    normal: "<p>Risiko er kombinasjonen av verdier, trusler og sårbarheter.</p>",
    teknisk: "<p>Mangler ett hjørne, finnes ingen relevant risiko: en trussel uten sårbarhet kan ikke utnytte noe, og en sårbarhet uten verdi gir ingen skade. Derfor er alle tre utgangspunktet for risikoidentifisering.</p>" } };

  P["H2024-14"] = { type: "eksamen", hvorfor: {
    eli5: "<p>En ekte underskrift beviser hvem som skrev. Et gammelt skranglete lås (SHA-1) stoler man ikke på. Og å avtale et hemmelig ord med noen du ikke har sjekket hvem er, kan gjøre at du egentlig snakker med en mellommann.</p>",
    normal: "<p>Asymmetrisk signatur beviser avsender overfor tredjepart. SHA-1 er usikker. Diffie-Hellman uten signatur er sårbar for mann-i-midten.</p>",
    teknisk: "<ul><li>Bare eieren av K<sup>A</sup><sub>priv</sub> kan signere, så signaturen er ubenektelig.</li><li>SHA-1 har praktiske kollisjoner, og dermed kan to dokumenter dele signatur.</li><li>DH gir en felles nøkkel gᵃᵇ [mod p], men uten signaturene Sig(gᵃᵇ, K<sup>A</sup><sub>priv</sub>) og Sig(gᵃᵇ, K<sup>B</sup><sub>priv</sub>) vet ingen av partene hvem de har utvekslet med (kursets fremstilling, kryptolysarket s. 63; i praktiske protokoller som TLS 1.3 signeres de utvekslede verdiene eller hele håndtrykket, ikke selve gᵃᵇ).</li></ul>" } };

  P["H2024-15"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Rektor (rot) gir læreren (mellomliggende) lov til å skrive vitnemål, og læreren skriver vitnemålet til eleven (inspera.no).</p>",
    normal: "<p>inspera.no er subjektsertifikatet. Det er signert av den mellomliggende CA-en Amazon RSA 2048 M03.</p>",
    teknisk: "<p>Validering starter i rotsertifikatet nettleseren stoler på, og hvert ledd verifiserer signaturen på neste ledd med den offentlige nøkkelen i sertifikatet over. Rot-CA-en signerer mellomliggende CA-er, som signerer subjektsertifikater.</p>" } };

  P["H2024-16"] = { type: "eksamen", hvorfor: {
    eli5: "<p>X.509 er skjemaet alle digitale ID-kort på nettet fylles ut på. RSA er en av måtene å skrive under på.</p>",
    normal: "<p>Sertifikatstandarden er X.509. En signaturalgoritme er for eksempel RSA eller ECDSA.</p>",
    teknisk: "<p>X.509 definerer feltene i sertifikatet (subjekt, utsteder, offentlig nøkkel, gyldighet, utvidelser) og CA-ens signatur. RSA, DSA, ECDSA og EdDSA er signaturalgoritmer; DH og MQV er nøkkelutveksling, selv om arket godtar dem.</p>" } };

  P["H2024-17"] = { type: "eksamen", hvorfor: {
    eli5: "<p>ECB låser hver bit av brevet med samme lås hver for seg. CTR lager en tilfeldig strimmel fra en teller og blander den med brevet.</p>",
    normal: "<p>Venstre: klartekst rett inn i E → ECB. Høyre: teller inn i E, deretter XOR med klarteksten → CTR.</p>",
    teknisk: "<p>ECB: Cᵢ = E(Mᵢ, K), like blokker gir like chiffertekster, så mønstre lekker. CTR: Cᵢ = E(Tᵢ, K) ⊕ Mᵢ, som gjør blokkchifferet til et strømchiffer; dekryptering bruker også E.</p>" } };

  P["H2024-18"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Et godt fingeravtrykk er raskt å ta, og to ulike personer skal aldri ha samme avtrykk.</p>",
    normal: "<p>Lett å beregne og sterk kollisjonsresistens er krav. Nøkler, salt og kryptering er ikke egenskaper ved en hashfunksjon.</p>",
    teknisk: "<p>Kravene er:</p><ul><li>effektiv beregning</li><li>komprimering til fast lengde</li><li>enveis (preimage-motstand)</li><li>svak kollisjonsresistens (gitt x, finn ikke x′ med samme hash)</li><li>sterk kollisjonsresistens (finn ikke noe par)</li></ul>" } };

  P["H2024-19"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Du låser brevet med mottakerens hengelås (som alle kan få), og skriver under med din egen penn (som bare du har).</p>",
    normal: "<p>Krypter med mottakers offentlige, signer med egen private. Mottaker verifiserer med avsenders offentlige og dekrypterer med egen private.</p>",
    teknisk: "<p>C = E(M, K<sup>A</sup><sub>pub</sub>), S = Sig(Hash(C), K<sup>B</sup><sub>priv</sub>). Alice sjekker Ver(S, K<sup>B</sup><sub>pub</sub>) mot Hash(C′) og beregner M = D(C, K<sup>A</sup><sub>priv</sub>).</p>" } };

  P["H2024-20"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Hvis noen sender det samme brevet til alle i hele byen, også til dem uten bil, om at «bilen din har fått bot», er det et masseutsendt lureri.</p>",
    normal: "<p>Eposten er ikke tilpasset mottakeren, som aldri har hatt Apple Pay. Den er sendt ut bredt: masse-phishing.</p>",
    teknisk: "<p>Masse-phishing satser på volum og en liten treffprosent. Spyd-phishing og whaling bruker informasjon om målet, og klone-phishing kopierer en legitim melding mottakeren faktisk har fått.</p>" } };

  P["H2024-21"] = { type: "eksamen", hvorfor: {
    eli5: "<p>En orm kryper selv fra hus til hus. En bakdør er en hemmelig inngang. En trojaner er en gave med noe ekkelt inni. En logisk bombe er en vekkerklokke som eksploderer.</p>",
    normal: "<p>Morris = dataorm. Skjult passord = bakdør. Antivirus med skadevare = trojaner. Utløses på et tidspunkt = logisk bombe.</p>",
    teknisk: "<p>Skillet går på spredning og utløsning:</p><ul><li>ormer sprer seg selv over nett</li><li>virus trenger vert og brukerhandling</li><li>trojanere sprer seg ikke selv</li><li>bakdører omgår autentisering</li><li>logiske bomber har en utløsende betingelse</li></ul>" } };

  P["H2024-22"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Trojaneren gjemmer seg i en gave, kryptoboten stjeler strøm, «&amp;&amp;» lurer maskinen til å gjøre en ekstra ting, og rootkitet er en usynlighetskappe.</p>",
    normal: "<p>Trojaner, kryptoutvinningsbott, command injection og rootkit.</p>",
    teknisk: "<p>«a &amp;&amp; cat /etc/passwd» kjeder en ny kommando i skallet når input ikke saneres. Rootkits manipulerer OS-et (ofte i kjernen) slik at prosesser og filer ikke vises for vanlige verktøy.</p>" } };

  P["H2024-23"] = {
    type: "skjonn",
    svar: [
      { del: "A)", tekst: "<p>SQL-injeksjon.</p>", poeng: ["Navngitt angrep (1p)"] },
      { del: "B)", tekst: "<p>Et annet uttrykk som alltid er sant:</p>", kode: "a' or 2==2", poeng: ["Omgår filteret med et sant logisk uttrykk (2p)"] },
      { del: "C)", tekst: "<p>Nei. Skriptet kjører på brukerens egen maskin, så brukeren kan slå det av eller endre forespørselen etterpå med en proxy (for eksempel Burp eller ZAP) og sende angrepet direkte til tjeneren.</p>",
        poeng: ["«Nei» (0,5p)", "Brukeren kontrollerer klienten og kan omgå skriptet (2p)", "Nevner proxy (3p)"] }
    ],
    hvorfor: {
      eli5: "<p>Hvis vakten står hjemme hos tyven i stedet for ved banken, kan tyven bare sende vakten ut av rommet.</p>",
      normal: "<p>Inndataene blir en del av SQL-spørringen, så «or» + et sant uttrykk gjør innloggingssjekken alltid sann. Et filter på én bestemt tekst stopper ikke andre sanne uttrykk, og et filter i nettleseren kan omgås helt.</p>",
      teknisk: "<p>Rotårsaken er at brukerinput settes rett inn i spørringen. Svartelister på tekst er lette å omgå (2==2, 345&gt;343). Klientsidekontroller gir ingen sikkerhet fordi angriperen kontrollerer klienten; med en avskjærende proxy kan forespørselen endres etter at skriptet har kjørt. Riktig tiltak er parameteriserte spørringer på tjenersiden.</p>"
    },
    sensor: {
      deler: [
        { del: "A)", fasit: "<p>SQL-injection</p>", kriterier: "<p>Oppgaven gir maks 6 poeng.</p><p>A) 1p for å navngi angrepet: SQL-injection</p>" },
        { del: "B)", fasit: "<p>Angrep:   A' or 2==2.</p>", kriterier: "<p>B) 2p for å lage et angrep som omgår filteret: Her trengs et korrekt logisk uttrykk som passer i et angrep som f.eks. 2==2, eller 345&gt;343.</p>", kode: "A' or 2==2." },
        { del: "C)", fasit: "", kriterier: "<p>C) 3p<br>0,5p for å bare svare \"nei\".</p><p>2p for å begrunne påstanden med noe à la:<br>\"Bruker har kontroll over hva som kjører på sin maskin,<br>og kan dermed omgå, eller la være å kjøre skriptet.\"</p><p>3p for å begrunne påstanden og samtidig å si noe om at dette gjøres<br>gjennom en Proxy, eksempelvis Burp eller Zap (trenger ikke navngi).</p>" }
      ],
      merknad: "Retteinstruksen står i svarfeltet i qa-fila. Det anbefalte svaret på B bruker samme mønster som modellsvaret."
    }
  };

  P["H2024-24"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Mimikatz er et verktøy som snoker i minnet til en Windows-maskin og finner passordene til dem som er logget inn.</p>",
    normal: "<p>Kommandoene privilege::debug og sekurlsa::logonpasswords, og utdata med NTLM-hasher og klartekstpassord, viser at det er mimikatz.</p>",
    teknisk: "<p>Mimikatz skaffer seg debug-privilegium og leser innloggingsdata fra LSASS-prosessens minne. Hashene kan brukes direkte (pass-the-hash) eller knekkes, og enkelte eldre moduler gir passord i klartekst.</p>" } };

  P["H2024-25"] = { type: "eksamen", hvorfor: {
    eli5: "<ul><li>Håndtrykket er der de avtaler hemmelig kode.</li><li>Både TLS og IPsec er konvolutter.</li><li>HSTS sier «bare låst dør».</li><li>VPN-en er en tunnel naboene bare ser inngangen til.</li><li>OWASP-lista er en topp-ti over farlige feil på nettsider.</li></ul>",
    normal: "<p>Handshake etablerer nøkkelen. Både TLS og IPsec krypterer data. HSTS hindrer TLS-stripping. ISP-en ser bare at du bruker sky-VPN. OWASP Top 10 rangerer risikoene for nettapplikasjoner.</p>",
    teknisk: "<p>I TLS forhandler Handshake chifferserie og etablerer øktnøkkel (helst med DH for fremoverhemmelighold), mens Record krypterer og integritetsbeskytter dataene. I en sky-VPN er destinasjon og innhold innkapslet i tunnelen til VPN-tjeneren, så ISP-en ser bare den ytre IP-headeren.</p>" } };

  P["H2024-26"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Hver tjeneste har sin egen dør med et fast nummer, så alle vet hvor de skal banke på.</p>",
    normal: "<p>FTP 21, SSH 22, Telnet 23, HTTP 80, HTTPS 443, RDP 3389.</p>",
    teknisk: "<p>Velkjente porter brukes i brannmurregler, Snort-regler og nmap-skanninger. Å kjenne dem er nødvendig for å lese og skrive slike regler.</p>" } };

  P["H2024-27"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Snort er en alarm som kjenner igjen «fingeravtrykket» til kjente angrep i nettrafikken.</p>",
    normal: "<p>Regelformatet med alert, protokoll, adresser og porter, pil og opsjoner med sid og rev er Snort.</p>",
    teknisk: "<p>Snort er signaturbasert: regelen beskriver mønsteret (her innhold i SMB-svar knyttet til CVE-2017-0147) og hva som skal skje ved treff. Det gir få falske alarmer for kjente angrep, men oppdager ikke nye.</p>" } };

  P["H2024-28"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Begge stablene er som etasjer i et hus. OSI har sju etasjer, internettmodellen slår de tre øverste sammen til én og kaller etasje 3 «Internett».</p>",
    normal: "<p>OSI: Applikasjon, Presentasjon, Sesjon, Transport, Nettverk, Link, Fysisk. Internett: Applikasjon, Transport, Internett, Link, Fysisk.</p>",
    teknisk: "<p>Internettstakkens applikasjonslag tilsvarer OSI 5–7. Internettlaget (IP) tilsvarer OSI-nettverkslaget. Lagplassering brukes til å plassere sikkerhetsprotokoller (IPsec på IP-laget, TLS over transport).</p>" } };

  P["H2024-29"] = {
    type: "skjonn",
    svar: [
      { del: "", tekst: "<p>Ubrukte IP-adresser fungerer som billig honeypot uten ekte maskiner: all trafikk dit er illegitim, så de gir enkel deteksjon av kompromitterte klienter i nettet.</p>",
        poeng: ["Honeypot-løsning, ikke ekte maskiner (1p)", "Hensikt: deteksjon (1p)", "All trafikk er illegitim (1p)", "Finner kompromitterte klienter (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>Det er som en dør i huset som ingen familiemedlemmer bruker. Hvis noen prøver å åpne den, vet du med en gang at det er noe muffens.</p>",
      normal: "<p>Ingen legitime tjenester bruker adressene, så all trafikk dit er mistenkelig. Det gir enkel og billig deteksjon av skanning og av maskiner i nettet som er kompromittert.</p>",
      teknisk: "<p>Mørke IP-adresser er en passiv honeypot-variant: ingen maskin svarer, men trafikken logges. Fordi det ikke finnes legitime kilder, blir det nesten ingen falske alarmer. En intern maskin som skanner nettet (orm, angriper som har fått fotfeste), avslører seg ved å treffe adressene.</p>"
    },
    sensor: {
      deler: [
        { del: "", fasit: "", kriterier: "<p>Oppgaven gir totalt 4 poeng.</p><p>1p for å navngi, eller beskrive at dette er en honeypotløsning,<br>men 0p hvis svaret tydeligvis viser forvirring mellom dette,<br>og ekte honeypotter (altså faktiske maskiner som er satt opp<br>og som angriperen faktisk kan interagere med).</p><p>1p for å nevne at hensikten med dette er deteksjon.</p><p>1p for å si at deteksjon gjøres enkelt fordi all trafikk mot<br>IP-adressene er illegitim.</p><p>1p for å skrive noe om at dette er en effektiv måte å finne<br>kompromitterte klienter i et nett.</p>" }
      ],
      merknad: "Det anbefalte svaret har 24 ord og dekker alle fire kriteriene."
    }
  };

  P["H2024-30"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Fire ulike nøkkelkort som alle åpner døra til kommunehuset, men bare noen åpner banken, og bare ett er laget av staten.</p>",
    normal: "<p>Bare MinID er statlig, MinID virker ikke i nettbanker, og offentlige tjenester krever ulike nivåer. Felles for alle fire er at de virker mot offentlige tjenester via ID-porten.</p>",
    teknisk: "<p>Tjenesteeier velger påkrevd sikkerhetsnivå etter risiko (eIDAS lav/betydelig/høy). ID-porten formidler innlogging fra flere eID-leverandører, både statlige (MinID) og private (BankID, Buypass, Commfides).</p>" } };

  P["H2024-31"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Du vil inn på et utested (SP). Vakten sier «vis ID fra et sted jeg stoler på». Du går til passkontoret (IdP), viser deg frem, får et stempel og går tilbake til vakten.</p>",
    normal: "<p>Forespørsel og valg av IdP hos SP (1–4), innlogging hos IdP som gir ID-token (5–10), tokenet til SP som gir tjenesten (11–12).</p>",
    teknisk: "<p>SP og IdP har en føderasjonsavtale, så SP godtar ID-tokenet IdP har signert. Brukeren autentiserer seg bare mot IdP; SP ser aldri autentikatoren. OIDC bygger på OAuth og legger til ID-tokenet for autentisering.</p>" } };

  P["H2024-32"] = { type: "eksamen", hvorfor: {
    eli5: "<p>To gratis kokebøker for sikkerhet, én norsk og én amerikansk. Begge er sortert etter hva du skal gjøre, og begge kan brukes sammen med den store regelboka (ISO 27001).</p>",
    normal: "<p>Begge kategoriserer etter funksjoner og kan brukes med ISO 27001. Ingen må kjøpes. Bare NSM er på norsk.</p>",
    teknisk: "<p>NSMs grunnprinsipper og NIST CSF er tiltaksbanker organisert etter funksjoner, ikke kravstandarder. De fungerer som alternativer eller supplement til ISO 27002 ved valg av tiltak i et ISMS etter 27001.</p>" } };

  P["H2024-33"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Først spør sjefen: «Er kartet godt nok?» Så spør sjefen: «Er planen god nok, og har vi råd?»</p>",
    normal: "<p>Punkt 1 avviser en vurdering som ikke skiller risikoene eller er for usikker. Punkt 2 avviser en plan som aksepterer for mye risiko eller koster for mye.</p>",
    teknisk: "<ul><li>Beslutningspunkt 1 er en kvalitetskontroll av risikovurderingen (gir den grunnlag for å prioritere?).</li><li>Beslutningspunkt 2 er ledelsens godkjenning av risikohåndteringen (restrisiko og ressursbruk).</li><li>Nei sender prosessen tilbake til kontekstetablering.</li></ul><p>De to beslutningspunktene er kursets modell (ukesoppgave 6, oppg. 6, som viser til ISO 27005); de stammer fra eldre utgaver av ISO 27005 (2008–2018), og 2022-utgaven har ikke egne beslutningspunkt 1 og 2.</p>" } };

  P["H2024-34"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Først finner du ut hva som kan gå galt, så regner du ut hvor ille det er, så sorterer du og sammenligner med hva du tåler.</p>",
    normal: "<p>Risikoidentifisering (med verdi-identifisering først), risikoanalyse (med risikoberegning sist) og risikoevaluering (med risikorangering først).</p>",
    teknisk: "<p>Figuren og delpunktene er kursets fremstilling, bygd på eldre utgaver av ISO 27005 (2008–2018); 2022-utgaven er bygd om og har ikke de samme beslutningspunktene. Strukturen:</p><ul><li>identifisering av verdier, trusler, tiltak, sårbarheter og konsekvenser</li><li>analyse av sannsynlighet og konsekvens som gir risikonivå</li><li>evaluering der risikoene rangeres og sammenlignes med akseptkriterier før beslutningspunkt 1</li></ul>" } };

  P["H2024-35"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Et ISMS er husreglene og rutinene for sikkerhet, ikke et dataprogram.</p>",
    normal: "<p>Et ISMS er policyer og prosedyrer, og det betyr ledelsessystem for informasjonssikkerhet.</p>",
    teknisk: "<p>ISMS (LSIS, styringssystem for informasjonssikkerhet) er den organisatoriske styringen etter PDCA, med krav i ISO 27001. Tiltaksbanker som NSMs grunnprinsipper brukes inni et ISMS, men er ikke selv et ISMS.</p>" } };

  P["H2024-36"] = { type: "eksamen", hvorfor: {
    eli5: "<p>Toppen er det store bildet for sjefene. Midten er hvordan skurkene pleier å jobbe. Bunnen er de konkrete fingeravtrykkene, som skurkene kan bytte fort.</p>",
    normal: "<p>A strategisk, B taktisk/operasjonell, C teknisk. ATT&amp;CK er på nivå B. Mest detaljert og mest kortvarig er nivå C.</p>",
    teknisk: "<p>Teknisk CTI (IoC-er som IP-adresser og hasher) er presis, men lett for angriperen å endre. TTP-er på taktisk nivå er dyre å endre og egner seg derfor til å spore aktører; MITRE ATT&amp;CK er rammeverket for å beskrive dem.</p>" } };

  P["H2024-37"] = { type: "eksamen", hvorfor: {
    eli5: "<p>En avdeling uten skrupler tjener penger på utpressing og ved å selge hemmelige innbruddsmetoder. Og verktøy for innbrudd brukes når krigen faktisk skal skje, ikke på noe uviktig.</p>",
    normal: "<p>Løsepengevirus og salg av nulldager gir inntekt. Exploit-arsenalet brukes til å støtte det militære angrepet, før og i starten.</p>",
    teknisk: "<p>Exploits er forbruksvarer: når de er brukt, kan de oppdages og tettes. Derfor bør et begrenset arsenal spares til der effekten er størst, for eksempel å slå ut kritisk infrastruktur når angrepet starter. Arket godtar også bruk i ukene før.</p>" } };

  P["H2024-38"] = {
    type: "skjonn",
    svar: [
      { del: "A)", tekst: "<p>MAC-en lages med en felles nøkkel som alle fire har. Alice, Bob, Charlie og Stine kan derfor alle ha laget den, og den beviser ikke at det var Bob (ingen ubenektelighet).</p>", poeng: ["Alle med felles nøkkel kan lage MAC-en (2p)"] },
      { del: "B)", tekst: "<p>Digital signatur med Bobs private nøkkel, der den offentlige nøkkelen er bundet til Bob med sertifikat i en PKI.</p>", poeng: ["PKI og asymmetrisk signatur (1p)"] },
      { del: "C)", tekst: "<p>ARP-forgiftning (ARP-spoofing), som gir et mann-i-midten-angrep.</p>", poeng: ["MitM via ARP-spoofing (2p)"] },
      { del: "D)", tekst: "<p>Mest trolig Stine: i Charlies ARP-tabell har både Bobs IP (10.0.0.33) og Stines IP (10.0.0.184) MAC-adressen 28-47-d7-ff-06-57, som ikke er Bobs, så Stine har tatt over Bobs IP-adresse. Alternativt kan Charlie ha forfalsket ARP-utskriften for å legge skylden på Stine.</p>", poeng: ["Stine, begrunnet med MAC-adressen (2p)", "Alternativ forklaring, f.eks. Charlie (1p)"] },
      { del: "E)", tekst: "<p>Ettercap (eller Bettercap).</p>", poeng: ["Relevant verktøy (1p)"] },
      { del: "F)", tekst: "<p>Scapy (eller hping3).</p>", poeng: ["Verktøy for falske pakker (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>Alle fire har samme stempel, så stempelet beviser ikke hvem som sendte brevet. Og noen har byttet navnelappen på postkassen, slik at post til Bob havner hos Stine og post fra Stine ser ut til å komme fra Bob.</p>",
      normal: "<p>MAC med felles nøkkel gir ikke ubenektelighet. ARP-tabellen viser at Bobs IP-adresse peker til Stines maskin, så Stine har trolig forgiftet ARP-cachene og sendt i Bobs navn.</p>",
      teknisk: "<p>ARP har ingen autentisering, så en maskin kan sende falske ARP-svar som binder en annen IP til sin egen MAC-adresse. Da går trafikken via angriperen (MitM), og angriperen kan sende TCP-pakker med Bobs IP-adresse. Kombinert med en felles MAC-nøkkel som alle kjenner, kan meldingen ikke knyttes til Bob. Asymmetriske signaturer i en PKI ville løst det første problemet.</p>"
    },
    sensor: {
      deler: [
        { del: "A)", fasit: "", kriterier: "<p>Oppgaven gir totalt 10 poeng.</p><p>A) 2p for å forklare at alle de fire aktuelle personene kan ha laget signaturen - da signaturen lages med samme felles nøkkel som alle har.</p>" },
        { del: "B)", fasit: "", kriterier: "<p>B) 1p for å navngi, eller beskrive PKI og asymmetriske signaturer.</p>" },
        { del: "C)", fasit: "", kriterier: "<p>C) 2p<br>2p for å beskrive hvordan dette er et Man-in-the-middle-angrep (MiTM).<br>Bare 1p for å si at dette er et IP-spoofingangrep, med en mer eller mindre legitim grunn til at Bob i Charlies ARP-tabell har Stines MAC-adresse.</p>" },
        { del: "D)", fasit: "", kriterier: "<p>D) 3p<br>2p for å forklare hvordan Stine mest sannsynlig står bak, da Bobs IP-adresse har Stines MAC-adresse.</p><p>1p For å skriver noe om alternative, men potensielt riktige løsninger, eksempelvis at Charlie står bak og at han har forfalsket outputen fra sin ARP-tabell for å legge skylden på Stine.</p><p>Selve oppgaveteksten sier de skal hjelpe til med å frikjenne Bob, så svar som viser stakkars Bobs skyld gir 0p.</p>" },
        { del: "E)", fasit: "", kriterier: "<p>E) 1p for Ettercap, Bettercap, eller andre relevante verktøy.</p>" },
        { del: "F)", fasit: "", kriterier: "<p>F) 1p for Hping3, Scapy, men også svar som \"genererer falske pakker i programmeringsspråk x ved hjelp av pakke y\", eller annet relevant.</p>" }
      ],
      merknad: "F-delen er delvis skjult bak ordtelleren i tekstuttrekket og er lest visuelt fra PDF-en (s. 30). «1p For å skriver» står slik i arket."
    }
  };
})();
