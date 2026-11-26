/* IN2120 · eksamensbank H2023. Kilde: UiO, IN2120 eksamen H2023 (Inspera-utskrift med rettenøkkel og
   retteinstrukser, behandlet som sensorveiledning). Oppgavetekst og fasit ordrett.
   Våre forklaringer (explain/losning/tips/hvorfor/svar) med egne ord.
   Kommandolinjer fra modellsvarene (oppg. 29 og 32) er beskrevet med ord, ikke gjengitt. */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BANK = (window.IN_EXAM_BANK = window.IN_EXAM_BANK || {});
  IN.PERFEKT = IN.PERFEKT || {};

  var Y = "H2023";
  var D1 = "Del 1: Generelt", D2 = "Del 2: Kryptografi og PKI", D3 = "Del 3: Angrepsvektorer og skadevare",
      D4 = "Del 4: Pentesting", D5 = "Del 5: Nettverkssikkerhet", D6 = "Del 6: Autentisering og IAM",
      D7 = "Del 7: ISMS og risikostyring";

  /* hvorfor for oppgaver uten eget fritekstsvar */
  function hv(nr, eli5, normal, teknisk) {
    IN.PERFEKT[Y + "-" + nr] = { type: "eksamen", hvorfor: { eli5: eli5, normal: normal, teknisk: teknisk } };
  }

  BANK[Y] = {
    year: Y, dato: "27.11.2023", varighet: "4 timer", hjelpemidler: "Ingen",
    forside:
      "<p>Avsluttende eksamen i IN2120 Informasjonssikkerhet (Høst 2023).</p>" +
      "<p>Dato og tidspunkt: 27. november 2023, kl.9:00 - 13:00 (4 timer).</p>" +
      "<p>Ingen hjelpemidler er tillatt.</p>" +
      "<p>Merk følgende:</p><ul>" +
      "<li>Oppgavene i denne eksamenen er gruppert i syv deler. Den første delen dekker grunnleggende aspekter ved informasjonssikkerhet på tvers av pensum, mens de øvrige seks delene er fra utvalgte områder av pensum.</li>" +
      "<li>Det er mulig å oppnå 40 poeng i den første delen av oppgavesettet, og ti poeng for hver av de neste seks delene - totalt 100 poeng (= 100%).</li>" +
      "<li>Man kan navigere frem og tilbake mellom oppgavene.</li>" +
      "<li>Skåring for hver oppgave angis eksplisitt. Det kan gis negative poeng for feil svar/valg, men total poengsum for hele oppgaven er minimum 0 (selv om summen over alle svarene er negativ).</li>" +
      "<li>Vær kortfattet når du skriver tekst som svar på en tekstoppgave. Svaret kan skrives på norsk eller engelsk.</li>" +
      "<li>Les oppgaveteksten nøye og spesielt der du skal fylle inn verdier i en tekstboks.</li>" +
      "<li>I navigasjonslinjen nederst på skjermen indikeres fullførte oppgaver med blå søyler.</li></ul>" +
      "<p>Tips! Siden du kan gå frem og tilbake kan det være lurt og først svare på oppgavene du syns er lette, og deretter gå tilbake til vanskelige oppgaver hvis du har tid.</p>" +
      "<p>Lykke til, hilsen Audun, Gudmund og Nils!</p>",
    deler: [
      { navn: D1, poeng: 40 }, { navn: D2, poeng: 10 }, { navn: D3, poeng: 10 }, { navn: D4, poeng: 10 },
      { navn: D5, poeng: 10 }, { navn: D6, poeng: 10 }, { navn: D7, poeng: 10 }
    ],
    merknad: "Maks poeng summerer til 100 (40 + 6 × 10), som forsiden sier. Oppgave 35 og 38 gir 0,5 p bonus når alt er riktig. Skrivefeil i arket er beholdt (f.eks. «Innstallering», «Bell-LaPaduala», «Autohority»). Sidene 29–31 i utskriften er blanke.",
    oppgaver: [

      /* ================= Del 1: Generelt ================= */
      {
        key: "H2023-1", year: Y, oppgave_nr: "Oppgave 1", del: D1,
        ark: "Begreper", title: "Sikkerhet, trygghet og visshet i bilder",
        points: 3, block: "generelt", tema: ["sikkerhet", "trygghet", "visshet", "security/safety"],
        gjenganger: ["H2024-2", "H2025-1"], ordrett: true,
        oppgave: "<p>Figuren nedenfor viser tre typer gjerder/grenser som gir enten sikkerhet (security), trygghet (safety) eller visshet (certainty). Sett inn tekstelementene i tilhørende riktig felt.</p><p><em>Poeng: 1 for hver riktig; 0 for feil/ubesvart; 3 for alle riktig; minimum 0.</em></p>",
        figur: {
          beskrivelse: "Tre fotografier side om side, hvert med et tomt slippfelt øverst til venstre i bildet og en bildetekst under. Venstre: en metallbolt med rundt hode slått ned i bakken (et grensemerke i landmåling). Midten: et byggestillas med plankegulv og rekkverk foran en husvegg. Høyre: et høyt gjerde med kveiler av piggtråd på toppen. Over bildene står de tre dra-boksene Visshet, Trygghet og Sikkerhet.",
          tekst: ["grensemerke", "stillas", "piggtrådgjerde"]
        },
        inspera: {
          type: "D", regelTekst: "Poeng: 1 for hver riktig; 0 for feil/ubesvart; 3 for alle riktig; minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
          tekst: null, bank: ["Visshet", "Trygghet", "Sikkerhet"],
          felt: [
            { etikett: "Felt i bildet «grensemerke»", svar: 0, explain: "Et grensemerke beskytter ikke mot noe. Det forteller hvor grensen går, altså gir det visshet (kunnskap)." },
            { etikett: "Felt i bildet «stillas»", svar: 1, explain: "Rekkverket på stillaset hindrer at noen faller ved et uhell. Vern mot ulykker er trygghet (safety)." },
            { etikett: "Felt i bildet «piggtrådgjerde»", svar: 2, explain: "Piggtråd skal stoppe noen som med vilje prøver å komme seg inn. Vern mot tilsiktede handlinger er sikkerhet (security)." }
          ]
        },
        avvik: null,
        losning: ["Spør deg: beskytter gjerdet mot noen som vil inn (sikkerhet), mot uhell (trygghet), eller sier det bare noe om hvor noe er (visshet)?"],
        tips: ["Ordene sikkerhet/trygghet/visshet er gitt hvert år H23–H25, men står ikke på 2026-lysarkene. Lær skillet tilsiktet / utilsiktet / kunnskap."]
      },
      {
        key: "H2023-2", year: Y, oppgave_nr: "Oppgave 2", del: D1,
        ark: "Kilder til krav om informasjonssikkerhet", title: "Forsvarlig nivå eller samsvar",
        points: 2, block: "risiko", tema: ["krav", "samsvar", "risikovurdering"], ordrett: true,
        oppgave: "<p>Risikovurdering og regelverk er to ulike kilder til krav om informasjonssikkerhet. For hver type krav, indiker om \"forsvarlig nivå\" eller \"samsvar\" avgjør om kravene er oppfylt.</p><p><em>Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; maks 2; minimum 0.</em></p><p><b>Indiker hva som avgjør om krav er oppfylt.</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; maks 2; minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
          kolonner: ["Forsvarlig nivå", "Samsvar"], multi: false,
          rader: [
            { s: "Krav om å begrense sikkerhetsrisiko", svar: [0], explain: "<p>Krav fra risikovurderingen er oppfylt når risikoen er senket til et nivå virksomheten kan forsvare. Det finnes ingen fasit å krysse av mot, bare et vurdert nivå.</p>" },
            { s: "Juridiske, lovbestemte, regulatoriske og kontraktsmessige krav", svar: [1], explain: "<p>Lover, forskrifter og kontrakter sier hva som skal være på plass. Enten følger du dem eller ikke, og det kalles samsvar (compliance).</p>" }
          ]
        },
        avvik: null,
        losning: ["Risikobaserte krav måles mot et akseptabelt nivå. Regelverk måles mot om du følger reglene."],
        tips: ["Kobling å huske: risiko → forsvarlig nivå, regelverk → samsvar."]
      },
      {
        key: "H2023-3", year: Y, oppgave_nr: "Oppgave 3", del: D1,
        ark: "Sikkerhetsmålsettinger", title: "Hvilket KIT-mål brytes av angrepet?",
        points: 3, block: "generelt", tema: ["KIT", "konfidensialitet", "integritet", "tilgjengelighet"],
        gjenganger: ["H2021-1.1", "H2022-1.1", "H2024-3", "H2025-2"], ordrett: true,
        oppgave: "<p>Indiker hvilken sikkerhetsmålsetting som typisk brytes som resultat av hvert angrep.</p><p><em>Poeng: 0,5 for hver riktig; 0 for feil/ubesvart; maks 3; minimum 0.</em></p><p><b>Indiker hvilket sikkerhetsmål som typisk brytes:</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 0,5 for hver riktig; 0 for feil/ubesvart; maks 3; minimum 0.",
          regel: { riktig: 0.5, feil: 0, blankt: 0, min: 0, maks: 3 },
          kolonner: ["Integritet", "Tilgjengelighet", "Konfidensialitet"], multi: false,
          rader: [
            { s: "DoS-angrep", svar: [1], explain: "<p>Tjenesten overbelastes og kan ikke brukes. Det rammer tilgjengelighet.</p>" },
            { s: "Skadevare genererer tilfeldig input i database", svar: [0], explain: "<p>Dataene blir feil eller endret uten lov. Det rammer integritet.</p>" },
            { s: "DDoS-angrep", svar: [1], explain: "<p>Samme mål som DoS, bare fra mange maskiner samtidig (ofte et botnett). Tilgjengelighet.</p>" },
            { s: "Knekke kryptering", svar: [2], explain: "<p>Den som knekker krypteringen kan lese det som skulle vært hemmelig. Konfidensialitet.</p>" },
            { s: "Avlytting av datatrafikk", svar: [2], explain: "<p>Avlytting av ukryptert trafikk lar uvedkommende lese innholdet. Konfidensialitet. (Er trafikken kryptert og ikke knekt, brytes ingenting.)</p>" },
            { s: "Løsepenge/krypto-virus", svar: [1], explain: "<p>Viruset krypterer dine egne data så du ikke får brukt dem. Det er tilgjengelighet, ikke konfidensialitet (lekker angriperen også dataene, rammes K i tillegg).</p>" }
          ]
        },
        avvik: null,
        losning: ["Still spørsmålet: blir noe lest (K), endret (I) eller gjort ubrukelig (T)?"],
        tips: ["Klassisk felle: løsepengevirus bryter T, ikke K, selv om det involverer kryptering."]
      },
      {
        key: "H2023-4", year: Y, oppgave_nr: "Oppgave 4", del: D1,
        ark: "Bokstyper for testing", title: "Pentest uten forkunnskap",
        points: 1, block: "pentest", tema: ["svartboks", "pentest"],
        gjenganger: ["H2022-4.3", "H2024-4", "H2025-4"], ordrett: true,
        oppgave: "<p>I planleggingen av en pentest får du ingen kunnskap om systemet du skal teste. Hva kalles denne typen testing?</p><p><em>Poeng: 1 for riktig; 0 for feil eller ubesvart.</em></p><p><b>Velg ett alternativ:</b></p>",
        inspera: {
          type: "F1", regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Svartboks-testing (Blackbox)", "Hvitboks-testing (white box)", "Gråboks-testing (grey box)", "Gulboks-testing (yellow box)"],
          svar: 0,
          explain: [
            "Riktig. Testeren ser systemet utenfra, som en ekstern angriper uten innsideinformasjon.",
            "Hvitboks betyr at testeren får full innsikt (kildekode, arkitektur, kontoer).",
            "Gråboks er en mellomting: noe informasjon, for eksempel en vanlig brukerkonto.",
            "Gulboks finnes ikke som begrep. Det er en distraktor."
          ]
        },
        avvik: null,
        losning: ["Ingen kunnskap = du ser ikke inn i boksen = svartboks."],
        tips: ["Spurt hvert år: svart (ingenting), grå (litt), hvit (alt)."]
      },
      {
        key: "H2023-5", year: Y, oppgave_nr: "Oppgave 5", del: D1,
        ark: "OS privilegienivåer", title: "Hva når en kjerneprosess?",
        points: 3, block: "system", tema: ["privilegienivå", "ring", "kjernemodus", "hypervisor"],
        gjenganger: ["H2024-5", "H2025-5"], ordrett: true,
        oppgave: "<p>En prosess kjører i kernelmodus. Kryss av hvert privilegienivå om prosessen kan få tilgang til ressurser (f.eks. data og prosess).</p><p><em>Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 3; minimum 0.</em></p><p><b>For hvert privilegienivå, indiker om en kernel-prosess kan få tilgang.</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 3; minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
          kolonner: ["Kan få tilgang", "Kan IKKE få tilgang"], multi: false,
          rader: [
            { s: "Nivå 0", svar: [0], explain: "<p>Kjernen kjører selv på nivå 0 og når sitt eget nivå.</p>" },
            { s: "Nivå 3", svar: [0], explain: "<p>Nivå 3 er brukermodus, som har mindre makt. Kjernen kan nå ressursene til brukerprosesser.</p>" },
            { s: "Nivå -1", svar: [1], explain: "<p>Nivå −1 er hypervisoren, som har mer makt enn kjernen i en virtuell maskin. Kjernen kan ikke nå den.</p>" }
          ]
        },
        avvik: null,
        losning: ["Lavere tall betyr mer makt. En prosess når sitt eget nivå og alle nivåer med høyere tall."],
        tips: ["Samme oppgave kommer med bruker- (H24) og hypervisorprosess (H25). Tegn ringene −1, 0, 3 og les av."]
      },
      {
        key: "H2023-6", year: Y, oppgave_nr: "Oppgave 6", del: D1,
        ark: "Krypto- og PKI-begreper", title: "Koble utsagn til kryptobegrep",
        points: 4, block: "krypto", tema: ["asymmetrisk", "symmetrisk", "hash", "PKI"],
        gjenganger: ["H2024-6", "H2025-6"], ordrett: true,
        oppgave: "<p>Hvert utsagn nedenfor passer til et bestemt begrep innenfor krypto/PKI. Indiker hvilket begrep hvert utsagn passer best til.</p><p><em>Poeng: 1 for hver riktig; 0 for hver feil/ubesvart; maks 4; minimum 0.</em></p><p><b>Indiker hva hvert utsagn passer beste med.</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 1 for hver riktig; 0 for hver feil/ubesvart; maks 4; minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 4 },
          kolonner: ["Asymmetrisk kryptering", "PKI", "Hash-funksjon", "Symmetrisk kryptering"], multi: false,
          rader: [
            { s: "Bruker en nøkkel for kryptering og en annen nøkkel for dekryptering", svar: [0], explain: "<p>To ulike nøkler (offentlig og privat) er kjennetegnet på asymmetrisk kryptering.</p>" },
            { s: "Garantere autentisitet av offentlige nøkler og forenkler nøkkeldistribusjonen", svar: [1], explain: "<p>PKI binder offentlige nøkler til navn med sertifikater signert av en CA, så du slipper å hente hver nøkkel på en sikker måte selv.</p>" },
            { s: "Er en-veis som betyr at det er praktisk umulig å finne tilbake til input av den", svar: [2], explain: "<p>Enveisegenskapen er et av kravene til en hashfunksjon.</p>" },
            { s: "Krypterer og dekrypter med samme nøkkel", svar: [3], explain: "<p>Én delt hemmelig nøkkel brukes begge veier i symmetrisk kryptering.</p>" }
          ]
        },
        avvik: null,
        losning: ["Se etter nøkkelordene: to nøkler, samme nøkkel, enveis, autentisitet av offentlige nøkler."],
        tips: ["Hash har ingen nøkkel og er ikke kryptering."]
      },
      {
        key: "H2023-7", year: Y, oppgave_nr: "Oppgave 7", del: D1,
        ark: "Asymmetrisk krypto", title: "Hvilken nøkkel krypterer og dekrypterer?",
        points: 2, block: "krypto", tema: ["asymmetrisk kryptering", "offentlig nøkkel", "privat nøkkel"],
        gjenganger: ["H2021-3.5", "H2022-5.1", "H2022-5.4", "H2024-7"], ordrett: true,
        oppgave: "<p>I denne oppgaven får du 1 poeng for hvert riktige svar; 0 poeng for hver feil eller ubesvart; totalt maks 2 poeng; minimum 0 poeng.</p>",
        inspera: {
          type: "F1", regelTekst: "I denne oppgaven får du 1 poeng for hvert riktige svar; 0 poeng for hver feil eller ubesvart; totalt maks 2 poeng; minimum 0 poeng.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 2 },
          sporsmal: [
            {
              tekst: "<p>Bob vil sende en kryptert melding til Alice ved hjelp av asymmetrisk krypto. Hvilken nøkkel bruker han?</p><p><b>Velg ett alternativ:</b></p>",
              alternativer: ["Bobs private nøkkel", "Bobs offentlige nøkkel", "Alice sin offentlige nøkkel", "Alice sin private nøkkel"],
              svar: 2,
              explain: [
                "Med Bobs private nøkkel lager han en signatur, ikke en hemmelig melding. Alle kan sjekke den med Bobs offentlige nøkkel.",
                "Da måtte Alice hatt Bobs private nøkkel for å lese. Den har bare Bob.",
                "Riktig. Han krypterer med mottakers offentlige nøkkel, så bare Alice (som har den private) kan lese.",
                "Alice sin private nøkkel har bare Alice. Bob har den ikke."
              ]
            },
            {
              tekst: "<p>Alice vil dekryptere meldingen fra Bob - da bruker hun hvilken nøkkel?</p><p><b>Velg ett alternativ</b></p>",
              alternativer: ["Alice sin offentlige nøkkel", "Alice sin private nøkkel", "Bobs private nøkkel", "Bobs offenlige nøkkel"],
              svar: 1,
              explain: [
                "Den offentlige nøkkelen kan alle ha. Kunne den dekryptere, ville krypteringen vært verdiløs.",
                "Riktig. Det som er kryptert med Alice sin offentlige nøkkel, åpnes bare med Alice sin private nøkkel.",
                "Alice har ikke Bobs private nøkkel, og den hører ikke til nøkkelparet som ble brukt.",
                "Bobs offentlige nøkkel hører ikke til nøkkelparet meldingen ble kryptert med."
              ]
            }
          ]
        },
        avvik: null,
        losning: ["Kryptering: mottakers offentlige nøkkel. Dekryptering: mottakers private nøkkel. C = E(M, K<sup>A</sup><sub>pub</sub>), M = D(C, K<sup>A</sup><sub>priv</sub>)."],
        tips: ["Ikke bland med signatur, der avsender bruker sin egen private nøkkel."]
      },
      {
        key: "H2023-8", year: Y, oppgave_nr: "Oppgave 8", del: D1,
        ark: "Programmer", title: "Verktøyene fra kurset",
        points: 4, block: "pentest", tema: ["nmap", "John the Ripper", "mimikatz", "Wireshark"],
        gjenganger: ["H2024-24", "H2025-14"], ordrett: true,
        oppgave: "<p>Her er noen programmer som er benyttet i kurset - plasser riktig program til riktig utsagn.</p><p><em>Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; maks 4; minimum 0.</em></p>",
        inspera: {
          type: "D", regelTekst: "Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; maks 4; minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
          tekst: "<p>Et mye brukt program for å finne ut av hvilke porter som er åpne på en maskin: {0}.</p><p>Vi har knekt passord ved hjelp av: {1}</p><p>Og vi har lastet ned klartekstpassord fra minne ved hjelp av: {2}</p><p>I tillegg til det har vi undersøkt nettverkspakker ved hjelp av: {3}</p>",
          bank: ["nmap", "mimikatz", "Wireshark", "John the ripper"],
          felt: [
            { etikett: "Åpne porter", svar: 0, explain: "nmap kartlegger maskiner og porter. Forsvarere bruker det for å se hva de selv eksponerer." },
            { etikett: "Knekke passord", svar: 3, explain: "John the Ripper prøver kandidatpassord mot lagrede passordhasher. Derfor trengs lange, unike passord og treg, saltet hashing." },
            { etikett: "Klartekstpassord fra minne", svar: 1, explain: "mimikatz henter innloggingshemmeligheter fra minnet i Windows. Forsvar: begrens administratorrettigheter og beskytt minnet til påloggingstjenesten." },
            { etikett: "Nettverkspakker", svar: 2, explain: "Wireshark fanger og viser nettverkspakker, nyttig både til feilsøking og til å se hva som går ukryptert." }
          ]
        },
        avvik: null,
        losning: ["Port = nmap, passordknekking = John, minne = mimikatz, pakker = Wireshark."],
        tips: ["Feil plassering gir −1, så la et felt stå tomt hvis du er usikker."]
      },
      {
        key: "H2023-9", year: Y, oppgave_nr: "Oppgave 9", del: D1,
        ark: "Passord", title: "«For like passord» – hva avslører det?",
        points: 1, block: "autentisering", tema: ["passordlagring", "hash", "klartekst"],
        gjenganger: ["H2021-6.1", "H2022-8.1"], ordrett: true,
        oppgave: "<p>Du må bytte passordet ditt. Det gamle passordet var \"JuleferienHytte2022\" som du endret til \"JuleferienHytte2023\".</p><p>Systemet sier at passordene er for like, hva vet du da om hvordan systemet lagrer passord?</p><p><em>Poeng: 1 for riktig; 0 for feil eller ubesvart.</em></p><p><b>Velg ett alternativ:</b></p>",
        inspera: {
          type: "F1", regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["MiTM", "Hashet", "Layered defense", "Klartekst"],
          svar: 3,
          explain: [
            "MiTM er et angrep (mann-i-midten), ikke en lagringsmåte.",
            "To nesten like passord gir helt ulike hasher. Fra hasher alene kan systemet ikke se direkte at passordene ligner.",
            "Lagdelt forsvar er en sikkerhetsstrategi, ikke en lagringsmåte.",
            "Riktig ifølge fasit. For å si at det nye ligner det gamle, må systemet ha det gamle passordet i lesbar form."
          ]
        },
        avvik: "Fasiten forutsetter at systemet sammenligner med det lagrede gamle passordet. Ved passordbytte skriver brukeren ofte inn det gamle passordet også, og da kan systemet sammenligne de to inntastede verdiene selv om det bare lagrer hasher. Et system som bare lagrer hasher, kan også lage varianter av det nye passordet (f.eks. 2023 → 2022) og hashe dem mot den lagrede hashen. Oppgaveteksten sier ikke noe om dette, så «Klartekst» er det forventede svaret.",
        losning: ["Hashfunksjoner sprer små endringer over hele utdataene. Likhet kan bare sjekkes direkte på lesbare passord."],
        tips: ["Riktig praksis er saltet, treg hashing. Da kan systemet ikke sammenligne med det lagrede passordet for å se om det ligner, bare sjekke om det er helt likt. Likhet kan det bare sjekke mot det du taster inn."]
      },
      {
        key: "H2023-10", year: Y, oppgave_nr: "Oppgave 10", del: D1,
        ark: "Sikkerhetsprotokoller", title: "Hvilke to er sikkerhetsprotokoller?",
        points: 2, block: "nettverk", tema: ["TLS", "IPsec", "protokoller"],
        gjenganger: ["H2024-9"], ordrett: true,
        oppgave: "<p>Vi har diskutert flere sikkerhetsprotokoller i kurset, der to er nevnt nedenfor. Indiker de to forkortelsene nedenfor som er sikkerhetsprotokoller.</p><p><em>Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; maks 2; minimum 0.</em></p><p><b>Velg to alternativer</b></p>",
        inspera: {
          type: "FF", regelTekst: "Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; maks 2; minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
          alternativer: ["IP", "UDP", "DNS", "TLS", "HTTP", "IPSEC"],
          svar: [3, 5],
          explain: [
            "IP adresserer og ruter pakker, uten kryptering eller autentisering.",
            "UDP er en enkel transportprotokoll uten sikkerhetsfunksjoner.",
            "Vanlig DNS er ukryptert navneoppslag.",
            "TLS gir kryptering og autentisering mellom applikasjoner (f.eks. i HTTPS).",
            "HTTP alene er ukryptert. Det er HTTPS (HTTP over TLS) som er sikret.",
            "IPsec sikrer trafikken på IP-laget, ofte brukt i VPN."
          ]
        },
        avvik: null,
        losning: ["Bare TLS og IPsec er laget for å gi konfidensialitet og integritet."],
        tips: ["Feil kryss gir −1. Kryss bare de to du er sikker på."]
      },
      {
        key: "H2023-11", year: Y, oppgave_nr: "Oppgave 11", del: D1,
        ark: "Datanettsikkerhet", title: "Brannmur, TLS-inspeksjon og Snort",
        points: 3, block: "nettverk", tema: ["brannmur", "TLS-inspeksjon", "IDS", "Snort"],
        gjenganger: ["H2024-10"], ordrett: true,
        oppgave: "<p>Velg det mest passende begrepet i hver setning nedenfor.</p><p><em>Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 3, minimum 0.</em></p>",
        inspera: {
          type: "N", regelTekst: "Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 3, minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
          tekst: "<p>En {0} er et sjekkpunkt som beskytter de interne nettverkene mot angrep fra eksterne nettverk, og bestemmer hvilken trafikk som kan passere inn og ut.</p><p>{1} brukes av noen organisasjonser for å lese kryptert HTTPS-trafikk som går inn og ut av organisasjonen ved å bryte krypteringen.</p><p>Snort er et eksempel på en {2}</p>",
          felt: [
            { etikett: "Sjekkpunkt", valg: ["TLS-inspeksjon", "IDS", "brannmur", "autentiseringstjener"], svar: 2, explain: "Brannmuren er den «digitale portvakten» som slipper gjennom eller stopper trafikk etter regler. En IDS bare varsler." },
            { etikett: "Lese HTTPS", valg: ["TLS-inspeksjon", "Anomalideteksjon", "Diffie-Hellman", "IDS"], svar: 0, explain: "Ved TLS-inspeksjon avslutter en mellomboks TLS-forbindelsen, ser på innholdet og krypterer på nytt videre." },
            { etikett: "Snort", valg: ["APT", "pakkefilter", "applikasjonsbrannmur", "signatur-basert IDS"], svar: 3, explain: "Snort sammenligner trafikk med regler (signaturer) og varsler ved treff." }
          ]
        },
        avvik: null,
        losning: ["Brannmur bestemmer, IDS oppdager, TLS-inspeksjon bryter opp kryptert trafikk for å se innholdet."],
        tips: ["Snort-regler er pensum. Kjenn oppbyggingen: handling, protokoll, kilde, port, retning, mål, port, (valg)."]
      },
      {
        key: "H2023-12", year: Y, oppgave_nr: "Oppgave 12", del: D1,
        ark: "Cyber Kill Chain", title: "Bevæpning og overlevering",
        points: 2, block: "cyberops", tema: ["cyber kill chain", "bevæpning", "overlevering"],
        gjenganger: ["H2021-10.1"], ordrett: true,
        oppgave: "<p>For hver beskrivelse nedenfor, velg hvilket steg i cyber-kill-chain som beskrivelsen passer til.</p><p><em>Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 2; minimum 0.</em></p>",
        inspera: {
          type: "F1", regelTekst: "Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 2; minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 2 },
          sporsmal: [
            {
              tekst: "<p>Som en del av en cyberoperasjon utvikler en trusselaktør en exploit-skadevare som utnytter en sårbarhet som ikke har blitt patchet i en tjeneste som virksomheten din har. Hvilket steg av cyber-kill chain er dette et eksempel på?</p><p><b>Velg ett alternativ:</b></p>",
              alternativer: ["Rekognisering", "Bevæpning", "Overlevering", "Utførelse av exploit", "Innstallering", "Kommando og kontroll", "Måloppnåelse"],
              svar: 1,
              explain: [
                "Rekognosering er å samle informasjon om målet, før noe lages.",
                "Riktig. Å lage selve angrepsverktøyet som passer til sårbarheten er bevæpning (trinn 2).",
                "Overlevering er å få verktøyet frem til målet, ikke å lage det.",
                "Utførelse skjer når koden kjører hos offeret.",
                "Installering er når skadevaren setter seg fast på målet.",
                "Kommando og kontroll er fjernstyringen etter installering.",
                "Måloppnåelse er det angriperen egentlig vil oppnå til slutt."
              ]
            },
            {
              tekst: "<p>Denne exploiten legges på en USB-minnepinne og en deltidsansatt bestikkes til å koble denne til maskinen til sjefen sin. Hva kalles steget når USB-en settes inn i maskinen?</p><p><b>Velg ett alternativ</b></p>",
              alternativer: ["Rekognisering", "Bevæpning", "Overlevering", "Utførelse av exploit", "Innstallering", "Kommando og kontroll", "Måloppnåelse"],
              svar: 2,
              explain: [
                "Rekognosering er allerede gjort.",
                "Verktøyet er allerede laget.",
                "Riktig. USB-pinnen er transportmiddelet som bringer verktøyet til målet.",
                "Utførelse er når koden faktisk kjører, et steg senere.",
                "Installering kommer etter utførelse.",
                "Kommando og kontroll kommer etter installering.",
                "Måloppnåelse er det siste trinnet."
              ]
            }
          ]
        },
        avvik: null,
        losning: ["Rekkefølgen: rekognosering, bevæpning, overlevering, utførelse, installering, kommando og kontroll, måloppnåelse."],
        tips: ["Felle: trinn 2 er bevæpning, ikke levering. Forsvaret kan bryte kjeden på hvert trinn, for eksempel med USB-kontroll mot overlevering."]
      },
      {
        key: "H2023-13", year: Y, oppgave_nr: "Oppgave 13", del: D1,
        ark: "ID-modeller", title: "Eduroam: hvilken ID-modell?",
        points: 1, block: "iam", tema: ["føderert identitet", "silo", "Eduroam"],
        gjenganger: ["H2021-7.1", "H2022-9.1"], ordrett: true,
        oppgave: "<p>Da jeg var i Stockholm tidligere i år logget mobilen min seg på Internett via Eduroam med UiO-brukeren min. Jeg hadde ikke gjort noe for å logge meg på, men standard-pålogging fra UiO fungerte. Hva sier det om ID-modellen som Eduroam bygger på?</p><p><em>Poeng: 1 for riktig; 0 for feil eller ubesvart.</em></p><p><b>Velg riktig ID-modell:</b></p>",
        inspera: {
          type: "F1", regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Silo", "NFC", "Føderert", "Bell-LaPaduala"],
          svar: 2,
          explain: [
            "I en silo har hver tjeneste sin egen brukerbase. Da måtte du hatt en egen konto i Stockholm.",
            "NFC er nærfeltskommunikasjon, ikke en ID-modell.",
            "Riktig. Universitetet i Stockholm stoler på at UiO har autentisert deg. Det er føderering.",
            "Bell-LaPadula er en tilgangskontrollmodell for konfidensialitet, ikke en ID-modell."
          ]
        },
        avvik: null,
        losning: ["Når en identitet fra ett domene godtas i et annet, er modellen føderert."],
        tips: ["Arket staver «Bell-LaPaduala» [sic]; modellen heter Bell-LaPadula."]
      },
      {
        key: "H2023-14", year: Y, oppgave_nr: "Oppgave 14", del: D1,
        ark: "IAM", title: "IAM-faser i figur",
        points: 3, block: "iam", tema: ["IAM", "konfigureringsfase", "bruksfase", "autorisering", "tilgangskontroll"],
        gjenganger: ["H2021-1.3", "H2022-1.3"], ordrett: true,
        oppgave: "<p>Figuren nedenfor viser faser og trinn for IAM (dentitets- og tilgangshåndering). Flytt elementene til riktig felt i figuren.</p><p><em>Poeng: 0,5 for hver riktig; 0 for ubesvart/feil; 3 for alle riktig; minimum 0.</em></p>",
        figur: {
          beskrivelse: "To store avrundede rammer side om side: venstre har overskriften «Konfigureringsfase», høyre «Bruksfase». To horisontale bånd går tvers over begge rammene: et turkis bånd øverst og et gult bånd nederst. I venstre ramme står tre tomme felt under hverandre, forbundet med piler nedover: øverst (i det turkise båndet), i midten (i det turkise båndet) og nederst (i det gule båndet, med en dobbeltpil fra midtfeltet). Midt i det turkise båndet, mellom rammene, er et tomt felt for båndets navn. Det gule båndet har den faste teksten «Tilgangshåndtering». I høyre ramme ligger en grønn boks med teksten «oppgi bruker-ID» og under den «oppgi / sjekk autentikator(er)», og et tomt felt til høyre i den grønne boksen for boksens navn. En pil går ned fra den grønne boksen til et tomt felt i det gule båndet. Seks dra-bokser over figuren.",
          tekst: ["Konfigureringsfase", "Bruksfase", "oppgi bruker-ID", "oppgi / sjekk autentikator(er)", "Tilgangshåndtering"]
        },
        inspera: {
          type: "D", regelTekst: "Poeng: 0,5 for hver riktig; 0 for ubesvart/feil; 3 for alle riktig; minimum 0.",
          regel: { riktig: 0.5, feil: 0, blankt: 0, min: 0, maks: 3 },
          tekst: null,
          bank: ["Brukerregistrering", "Tilgangskontroll", "Autentikatorklargjøring", "Identitetshåndtering", "Tilgangsautorisering", "Brukerautentisering"],
          felt: [
            { etikett: "Konfigureringsfase, øverst", svar: 0, explain: "Først registreres brukeren (identiteten opprettes)." },
            { etikett: "Konfigureringsfase, midten", svar: 2, explain: "Så får brukeren autentikatoren sin, for eksempel passord eller passnøkkel." },
            { etikett: "Konfigureringsfase, nederst (gult bånd)", svar: 4, explain: "Tilgangsautorisering er å spesifisere hva brukeren skal ha lov til. Det skjer i konfigureringsfasen." },
            { etikett: "Navn på det turkise båndet", svar: 3, explain: "Det øvre båndet samler alt som gjelder identiteten: registrering, autentikator og autentisering." },
            { etikett: "Grønn boks i bruksfasen", svar: 5, explain: "Å oppgi bruker-ID og sjekke autentikatoren er brukerautentisering." },
            { etikett: "Bruksfase, gult bånd", svar: 1, explain: "Tilgangskontroll håndhever den autoriserte policyen når brukeren ber om tilgang." }
          ]
        },
        avvik: null,
        losning: ["Konfigurering: registrering → autentikator → autorisering. Bruk: autentisering → tilgangskontroll."],
        tips: ["Felle: autorisering er å spesifisere policy (konfigurering), tilgangskontroll er å håndheve den (bruk)."]
      },
      {
        key: "H2023-15", year: Y, oppgave_nr: "Oppgave 15", del: D1,
        ark: "Meldingsautentisering", title: "Signatur, MAC og stjålet privatnøkkel",
        points: 3, block: "krypto", tema: ["MAC", "digital signatur", "ubenektelighet"],
        gjenganger: ["H2021-1.4", "H2022-5.3", "H2024-12"], ordrett: true,
        oppgave: "<p>For hver setning nedenfor, velg begrepet som passer inn.</p><p><em>Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 3, minimum 0.</em></p>",
        inspera: {
          type: "N", regelTekst: "Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 3, minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
          tekst: "<p>Digital signatur gir {0} meldingsautentisering.</p><p>MAC (Message Authentication Code) gir {1} meldingsautentisering.</p><p>Tap/tyveri av en privat nøkkel gir grunnlag for å {2}.</p>",
          felt: [
            { etikett: "Digital signatur", valg: ["ubenektelig", "fremoverhemmelig", "phishingresistent", "enkel"], svar: 0, explain: "Bare avsender har den private nøkkelen, og alle kan verifisere. Derfor kan avsender ikke nekte senere." },
            { etikett: "MAC", valg: ["phishingresistent", "fremoverhemmelig", "ubenektelig", "enkel"], svar: 3, explain: "Begge parter har den samme hemmelige nøkkelen, så en tredjepart kan ikke avgjøre hvem som laget MAC-en. Det gir bare enkel meldingsautentisering." },
            { etikett: "Stjålet privat nøkkel", valg: ["benekte en melding autentisert med MAC", "benekte en phishingresistent meldingsautentisering", "benekte en fremoverhemmelig meldingsautentisering", "benekte en digitalt signert melding"], svar: 3, explain: "Har nøkkelen kommet på avveie, kan eieren hevde at noen andre laget signaturen." }
          ]
        },
        avvik: null,
        losning: ["Ubenektelighet krever at bare én part har signeringsnøkkelen. Lekker den, faller ubenektelighet."],
        tips: ["MAC gir aldri ubenektelighet."]
      },
      {
        key: "H2023-16", year: Y, oppgave_nr: "Oppgave 16", del: D1,
        ark: "Risikotrekanten", title: "De tre hjørnene i risikotrekanten",
        points: 3, block: "risiko", tema: ["risiko", "verdi", "sårbarhet", "trussel"],
        gjenganger: ["H2024-13"], ordrett: true,
        oppgave: "<p>Figuren nedenfor viser risikotrekanten der hvert hjørne representerer et fundamentalt risikoaspekt. Skriv navnet på hvert risikoaspekt i hvert sitt hjørne. Det spiller ingen rolle hvilket hjørne du skriver hvert ord i. Store eller små bokstaver spiller heller ingen rolle, men pass på å stave ordene riktig.</p><p><em>Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 3; minimum 0.</em></p>",
        figur: {
          beskrivelse: "En stor gul trekant med ordet «Risiko» i midten og lyseblå piler fra midten ut mot hvert hjørne. Ved hvert hjørne (øverst, nede til venstre, nede til høyre) står et tomt tekstfelt.",
          tekst: ["Risiko"]
        },
        inspera: {
          type: "T", regelTekst: "Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 3; minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
          regelMerknad: "Rettenøkkelen godtar samme liste i alle tre hjørnene. Meningen er tre ulike aspekter: verdi, sårbarhet og trussel.",
          tekst: null,
          felt: [
            { etikett: "Hjørne øverst", godta: ["verdi", "verdier", "sårbarhet", "sårbarheter", "trussel", "trusel", "trusler", "trussler", "verdien", "verdiene", "sårbarheten", "sårbarhetene", "trusselen", "truslene", "asset", "assets", "vulnerability", "vulnerabilities", "threat", "threats"], explain: "Verdi: det som har krav til K, I eller T." },
            { etikett: "Hjørne nede til venstre", godta: ["verdi", "verdier", "sårbarhet", "sårbarheter", "trussel", "trusel", "trusler", "trussler", "verdien", "verdiene", "sårbarheten", "sårbarhetene", "trusselen", "truslene", "asset", "assets", "vulnerability", "vulnerabilities", "threat", "threats"], explain: "Trussel: noe eller noen som kan skade verdien ved å utnytte en sårbarhet." },
            { etikett: "Hjørne nede til høyre", godta: ["verdi", "verdier", "sårbarhet", "sårbarheter", "trussel", "trusel", "trusler", "trussler", "verdien", "verdiene", "sårbarheten", "sårbarhetene", "trusselen", "truslene", "asset", "assets", "vulnerability", "vulnerabilities", "threat", "threats"], explain: "Sårbarhet: en svakhet som trusselen kan utnytte, slik at angrepet ikke lett lar seg stoppe (t06)." }
          ]
        },
        avvik: null,
        losning: ["Risiko oppstår når en trussel kan utnytte en sårbarhet for å skade en verdi. Fjerner du ett hjørne, forsvinner risikoen."],
        tips: ["Listen godtar også stavemåtene «trusel» og «trussler». Skriv likevel riktig: trussel, sårbarhet, verdi."]
      },

      /* ================= Del 2: Kryptografi og PKI ================= */
      {
        key: "H2023-17", year: Y, oppgave_nr: "Oppgave 17", del: D2,
        ark: "Egenskaper til krypto", title: "«Sikkert og visst» mot «Sorte hull»",
        points: 3, block: "krypto", tema: ["MAC", "SHA-2", "fremoverhemmelighold", "hybrid kryptering"],
        gjenganger: ["H2024-14"], ordrett: true,
        oppgave: "<p>Denne oppgaven gir 1 poeng for hvert riktige svar, 0 poeng hvis feil eller ubesvart; 3 poeng hvis alt er riktig, og minimum 0 poeng.</p><p>Du har fått deg jobb i firmaet \"Sikkert og visst\", som har havnet i en konflikt med firmaet \"Sorte hull\". Som ekspert i informasjonssikkerhet har du blitt kalt inn for å bistå det juridiske teamet med noen tekniske spørsmål.</p>",
        inspera: {
          type: "F1", regelTekst: "Denne oppgaven gir 1 poeng for hvert riktige svar, 0 poeng hvis feil eller ubesvart; 3 poeng hvis alt er riktig, og minimum 0 poeng.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
          sporsmal: [
            {
              tekst: "<p>En meldingautentiseringskode (MAC) har blitt brukt på en melding. \"Sorte hull\" påstår at for en tredjepart er dette bevis på at \"Sikkert og visst\" har sendt meldingen. Er denne påstanden riktig?</p><p><b>Velg ett alternativ:</b></p>",
              alternativer: ["Påstanden er riktig", "Påstanden er feil"],
              svar: 1,
              explain: [
                "Begge firmaene har MAC-nøkkelen, så «Sorte hull» kunne like gjerne laget MAC-en selv.",
                "Riktig. MAC gir ikke ubenektelighet. En tredjepart kan ikke se hvem av de to som laget den."
              ]
            },
            {
              tekst: "<p>SHA-2 algoritmen har blitt brukt, men \"Sorte hull\" påstår at denne ikke lenger er sikker så resultatene kan ikke brukes. Hva er riktig om SHA-2?</p><p><b>Velg ett alternativ</b></p>",
              alternativer: ["SHA-2 anses som usikker", "SHA-2 anses som sikker"],
              svar: 1,
              explain: [
                "Det er SHA-1 (og MD5) som er knekt med praktiske kollisjoner, ikke SHA-2.",
                "Riktig. SHA-2 (f.eks. SHA-256) regnes fortsatt som sikker."
              ]
            },
            {
              tekst: "<p>Sensitiv informasjon fra kommunikasjonen mellom \"Sikkert og visst\" og \"Sorte hull\" har kommet til avveie. \"Sorte hull\" sier at de ikke har lekket informasjonen med vilje.</p><p>Øktnøklene som er brukt har blitt sendt fra \"Sikkert og visst\" til \"Sorte hull\" og har blitt kryptert med \"Sorte hull\" sin offentlige nøkkel. \"Sorte hull\" har blitt utsatt for et dataangrep hvor deres private nøkkel har blitt hentet ut. \"Sorte hull\" påstår dermed at en tredjepart kan ha kunne dekryptert all kommunikasjon. Hva er riktig om påstanden til \"Sorte hull\"?</p><p><b>Velg ett alternativ</b></p>",
              alternativer: [
                "Påstanden er feil siden asymmetrisk kryptering er det samme som Diffie-Hellman, så dette stemmer ikke.",
                "Påstanden er riktig siden måten øktnøkler utveksles ikke gir fremoverhemmelighold.",
                "Påstanden er feil siden man krypterer ikke med offentlige nøkler så dette stemmer ikke."
              ],
              svar: 1,
              explain: [
                "Asymmetrisk kryptering og Diffie-Hellman er ikke det samme. DH etablerer en felles nøkkel uten å sende den.",
                "Riktig. Alle øktnøklene er beskyttet av samme langtidsnøkkel. Den som har tatt opp trafikken og nå har privatnøkkelen, kan åpne alt bakover.",
                "Man krypterer nettopp med mottakers offentlige nøkkel."
              ]
            }
          ]
        },
        avvik: null,
        losning: ["MAC: ingen ubenektelighet. SHA-2: sikker. Hybrid kryptering av øktnøkler: ikke fremoverhemmelighold."],
        tips: ["H24 bruker samme historie med signatur, SHA-1 og DH. Der blir svarene motsatt, så forstå hvorfor."]
      },
      {
        key: "H2023-18", year: Y, oppgave_nr: "Oppgave 18", del: D2,
        ark: "Nøkkelsertifikat", title: "Sertifikatstien til uio.no",
        points: 2, block: "pki", tema: ["sertifikatsti", "rot-CA", "mellomliggende CA", "selvsignert"],
        gjenganger: ["H2024-15"], ordrett: true,
        oppgave: "<p>Denne oppgaven omhandler nøkkelsertifikater og du må velge passende svar på nedtrekksmenyen.</p><p><em>Poeng: 1 for hvert riktig; 0 for ubesvart eller feilt; maks 2; minimum 0.</em></p><p>Med din nettleser finner du følgende sertifikatsti for en nettside på uio.no:</p>",
        figur: {
          beskrivelse: "Utsnitt fra nettleserens sertifikatvisning som et tre med tre nivåer: øverst «USERTrust ECC Certification Authority», innrykket under den «GEANT OV ECC CA 4», og innrykket nederst «uio.no».",
          tekst: ["USERTrust ECC Certification Authority", "GEANT OV ECC CA 4", "uio.no"]
        },
        inspera: {
          type: "N", regelTekst: "Poeng: 1 for hvert riktig; 0 for ubesvart eller feilt; maks 2; minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 2 },
          tekst: "<p>GEANT OV RCC CA 4 er et eksempel på {0}.</p><p>Hvem har signert USERTrust ECC Certification Autohority? {1}</p>",
          felt: [
            { etikett: "GEANT OV RCC CA 4", valg: ["rot-CA", "subjeksertifikat", "mellomliggende CA"], svar: 2, explain: "Den står mellom roten og nettstedet: signert av roten, og signerer selv uio.no. Det er en mellomliggende CA." },
            { etikett: "Signert USERTrust", valg: ["Selv-signert", "PKI", "GEANT OV ECC CA 4"], svar: 0, explain: "USERTrust står øverst i stien og er rot-CA. Et rotsertifikat er signert av seg selv." }
          ]
        },
        avvik: "Arket har skrivefeil: «GEANT OV RCC CA 4» [sic] (figuren viser ECC), «subjeksertifikat» [sic] (subjektsertifikat) og «Autohority» [sic] (Authority). Gjengitt som de står; svaret påvirkes ikke.",
        losning: ["Øverst i stien: rot (selvsignert). I midten: mellomliggende CA. Nederst: subjektsertifikatet til nettstedet."],
        tips: ["Et selvsignert rotsertifikat er bare til å stole på fordi det ligger forhåndsinstallert i nettleseren."]
      },
      {
        key: "H2023-19", year: Y, oppgave_nr: "Oppgave 19", del: D2,
        ark: "Nøkkelsertifikat 2", title: "Standarden for sertifikater",
        points: 1, block: "pki", tema: ["X.509", "sertifikat"],
        gjenganger: ["H2024-16"], ordrett: true,
        oppgave: "<p>I denne oppgaven skal du skrive inn svaret, som skal være på formatet \"-.---\" (hvor du må erstatte hver \"-\" med en bokstav (stor eller liten bokstav spiller ingen rolle) eller et tall.</p><p><em>Poeng: 1 for riktig; 0 for feil eller ubesvart; maks 1; minimum 0.</em></p><p>Hva kalles standarden som brukes for public-key nøkkelsertifikater på internett ?</p>",
        inspera: {
          type: "T", regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart; maks 1; minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          tekst: "<p>Fyll in svaret her: {0}</p>",
          felt: [
            { etikett: "Standard", godta: ["X.509", "x509", "x 509", "x-509", "X.509v3", "X.509 versjon 3", "X.509 version 3", "X.509-sertifikat", "X.509-sertifikater"], explain: "X.509 er formatet for sertifikater i nettlesere og TLS." }
          ]
        },
        avvik: null,
        losning: ["Formatet «-.---» passer med X.509."],
        tips: ["Gjenbrukt ordrett i H24."]
      },
      {
        key: "H2023-20", year: Y, oppgave_nr: "Oppgave 20", del: D2,
        ark: "Blokkchiffer - operasjonsmoduser", title: "Gjenkjenn CTR og CBC i diagram",
        points: 2, block: "krypto", tema: ["CTR", "CBC", "ECB", "operasjonsmodus"],
        gjenganger: ["H2024-17", "H2025-8"], ordrett: true,
        oppgave: "<p>For blokkchiffer brukes ulike operasjonsmoduser for kryptering av mer enn én blokk. Nedenfor ser du diagrammer som illustrerer kryptering for <b>to ulike</b> operasjonsmoduser. Sett riktig navn på hver av dem.</p><p><em>Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; totalt maks 2; totalt minimum 0.</em></p>",
        figur: {
          beskrivelse: "To diagrammer side om side, hvert med tre kolonner (blokk 1–3) og et tomt slippfelt under. Venstre: øverst tellerverdiene T₁, T₂, T₃ og en nøkkel K ved hver; pil ned til en blå boks E; utdataene XOR-es (⊕) med M₁, M₂, M₃ som kommer inn fra siden; resultatet er C₁, C₂, C₃ nederst. Blokkene er uavhengige av hverandre. Høyre: øverst M₁, M₂, M₃; M₁ XOR-es med IV som kommer inn fra venstre, M₂ og M₃ XOR-es med forrige chiffertekstblokk (piler fra C₁ og C₂ bort og opp til neste ⊕); resultatet går inn i E med nøkkel K og gir C₁, C₂, C₃.",
          tekst: ["T₁", "T₂", "T₃", "K", "E", "M₁", "M₂", "M₃", "C₁", "C₂", "C₃", "IV"]
        },
        inspera: {
          type: "D", regelTekst: "Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; totalt maks 2; totalt minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
          tekst: null,
          bank: ["Cipher Block Chaining (CBC)", "Electronic Code Book (ECB)", "Counter Mode (CTR)"],
          felt: [
            { etikett: "Venstre diagram", svar: 2, explain: "Telleren T krypteres, og resultatet XOR-es med klarteksten: C₁ = E(T₁, K) ⊕ M₁. Det er CTR." },
            { etikett: "Høyre diagram", svar: 0, explain: "Klarteksten XOR-es med IV eller forrige chiffertekst før kryptering: C₁ = E(IV ⊕ M₁, K). Kjedingen er CBC." }
          ]
        },
        avvik: null,
        losning: ["Teller inn i E = CTR. IV og kjede fra forrige C = CBC. ECB ville hatt M rett inn i E uten noe annet."],
        tips: ["ECB er med som distraktor. Den er usikker fordi like klartekstblokker gir like chiffertekstblokker."]
      },
      {
        key: "H2023-21", year: Y, oppgave_nr: "Oppgave 21", del: D2,
        ark: "Hash-funksjoner", title: "H(x) = x + 1 som hashfunksjon",
        points: 2, block: "krypto", tema: ["hashfunksjon", "kollisjonsresistens", "enveis", "komprimering"],
        gjenganger: ["H2021-3.4", "H2022-5.2", "H2024-18"], ordrett: true,
        oppgave: "<p>En kollega av deg har implementert en funksjon H som legger 1 til hvert element fra input. For å illustrere: H(1)=2, H(3)=4, H(123) = 124 osv.</p><p>Du kan anta at hver input generer en unik output-verdi.</p><p>Ekte hash-funksjoner har et sett sikkerhetskrav som må oppfylles, og H oppfyller bare 2 av disse. Hvilke?</p><p><em>Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; maks 2; minimum 0.</em></p><p><b>Velg de 2 sikkerhetskravene for hashfunksjoner som H oppfyller</b></p>",
        inspera: {
          type: "FF", regelTekst: "Poeng: 1 for hver riktig; -1 for hver feil; 0 for ubesvart; maks 2; minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
          alternativer: ["Enveis-funksjon", "Kollisjonsresistent", "Lett å beregne", "Komprimering til fast størrelse"],
          svar: [1, 2],
          explain: [
            "Ikke oppfylt. Trekk fra 1, så har du input igjen.",
            "Oppfylt. Hver input gir sin egen output (gitt i oppgaven), så to ulike input kan aldri kollidere.",
            "Oppfylt. Å legge til 1 er trivielt å regne ut.",
            "Ikke oppfylt. Output er like lang som input (eller ett siffer lenger), ikke fast størrelse."
          ]
        },
        avvik: null,
        losning: ["Gå gjennom kravene ett for ett: lett å beregne, komprimering, enveis, kollisjonsresistens."],
        tips: ["Kollisjonsresistens følger direkte av setningen «hver input generer en unik output-verdi»."]
      },

      /* ================= Del 3: Angrepsvektorer og skadevare ================= */
      {
        key: "H2023-22", year: Y, oppgave_nr: "Oppgave 22", del: D3,
        ark: "Tilgang for skadevare", title: "Hvilke rettigheter får skadevaren?",
        points: 1, block: "angrep", tema: ["skadevare", "minste privilegium", "sudo"],
        gjenganger: ["H2022-3.1"], ordrett: true,
        oppgave: "<p>Du kjører uheldigvis skadevare på maskinen din med din bruker. Brukerkontoen din har fulle sudo-rettigheter på maskinen din, og kjører følgende kommando:</p><p>Hvilke rettigheter får skadevaren da?</p><p><em>Poeng: 1 for riktig, 0 for feil eller ubesvart.</em></p><p><b>Velg ett alternativ:</b></p>",
        figur: {
          beskrivelse: "Skjermbilde av et Linux-terminalvindu med tittelen «nilspw@in2120: ~». Ledeteksten er «nilspw@in2120:~$», og brukeren starter programmet «./skadevare» fra hjemmekatalogen, uten sudo foran.",
          tekst: ["nilspw@in2120: ~", "./skadevare"]
        },
        inspera: {
          type: "F1", regelTekst: "Poeng: 1 for riktig, 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["root", "administrator", "gjest", "bruker (nilspw)"],
          svar: 3,
          explain: [
            "Programmet ble ikke startet med forhøyede rettigheter. At kontoen kan bruke sudo, gir ikke prosessen root automatisk.",
            "Administrator er Windows-begrepet. Her kjører programmet som en vanlig Linux-bruker.",
            "Programmet får mer enn gjesterettigheter, nemlig alt brukeren selv har.",
            "Riktig. En prosess arver rettighetene til brukeren som starter den, her nilspw."
          ]
        },
        avvik: null,
        losning: ["Prosesser arver rettighetene til brukeren som starter dem. Forhøyede rettigheter må bes om eksplisitt."],
        tips: ["Skadevaren kan likevel gjøre stor skade med brukerens egne filer, og kan prøve å lure brukeren til å gi den mer. Minste privilegium: bruk ikke en konto med fulle sudo-rettigheter til daglig.", "Nyanse: har brukeren nettopp brukt sudo i samme terminal, kan skadevaren selv kalle sudo uten passord en kort stund (sudo husker passordet en periode)."]
      },
      {
        key: "H2023-23", year: Y, oppgave_nr: "Oppgave 23", del: D3,
        ark: "Phishing", title: "Hvilken type phishing?",
        points: 1, block: "angrep", tema: ["phishing", "spyd-phishing", "sosial manipulering"],
        gjenganger: ["H2021-2.1", "H2022-3.2", "H2024-20"], ordrett: true,
        oppgave: "<p>Hva slags phishing-angrep er dette (Se for deg at du som student får denne teksten i en epost i morgen (altså dagen etter eksamen i IN2120) fra et navn du ikke kjenner)?</p><p>\"Hei &lt;ditt navn&gt;,<br>Hvordan gikk eksamen i går? Jeg er ganske fornøyd selv, særlig de første oppgavene gikk greit. Beklager at jeg ikke har tatt kontakt med deg før, men jeg har ikke turt å ta kontakt på forelesningene i høst. Jeg så hvor flink du var i gruppetimene og lurte på om vi kunne samarbeide neste semester. Du finner mer detaljer om min bakgrunn her: https://&lt;langUrl&gt;.&lt;endaLengreUrl&gt;.&lt;noe&gt;\"</p><p><em>Poeng: 1 for riktig, 0 for feil eller ubesvart.</em></p><p><b>Velg ett alternativ:</b></p>",
        inspera: {
          type: "F1", regelTekst: "Poeng: 1 for riktig, 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Klone-phishing", "Direktørsvindel (whaling)", "Masse-phishing", "Spyd-phishing"],
          svar: 3,
          explain: [
            "Klone-phishing kopierer en ekte e-post du har fått før og bytter ut lenken eller vedlegget.",
            "Whaling retter seg mot ledere og toppsjefer, ikke mot en student.",
            "Masse-phishing er den samme generelle teksten til mange. Denne er skreddersydd.",
            "Riktig. Navnet ditt, emnet, eksamensdagen og gruppetimene viser at den er tilpasset deg."
          ]
        },
        avvik: null,
        losning: ["Personlig tilpasset med detaljer om mottakeren = spyd-phishing."],
        tips: ["Varseltegn: ukjent avsender, smiger og en lang, merkelig lenke. Sjekk domenet før du klikker."]
      },
      {
        key: "H2023-24", year: Y, oppgave_nr: "Oppgave 24", del: D3,
        ark: "Skadevare", title: "Skadevaretyper",
        points: 4, block: "angrep", tema: ["dataorm", "trojaner", "bakdør", "logisk bombe"],
        gjenganger: ["H2024-21", "H2021-2.5", "H2022-3.4"], ordrett: true,
        oppgave: "<p>Velg den kolonnen som passer best med hver rad.</p><p><em>Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 4 for alle riktig, minimum 0.</em></p><p><b>Finn de som passer sammen:</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 4 for alle riktig, minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
          kolonner: ["Trojaner", "Virus", "Bakdør", "Logisk bombe", "Dataorm"], multi: false,
          rader: [
            { s: "Morris er en kjent", svar: [4], explain: "<p>Morris-ormen (1988) spredte seg selv over nettet uten at noen måtte kjøre den. Det er kjennetegnet på en orm.</p>" },
            { s: "Fungerende antivirus som inneholder en spesiell skadevare", svar: [0], explain: "<p>Et nyttig program med skjult ondsinnet innhold er en trojaner.</p>" },
            { s: "Skjult passord implementert av programmereren for å kunne logge seg inn senere uten systemeiers viten", svar: [2], explain: "<p>En skjult vei inn forbi den vanlige autentiseringen er en bakdør.</p>" },
            { s: "Skadevare som formaterer harddisken din fredag den trettende kl. 12.05", svar: [3], explain: "<p>Skade som utløses av en betingelse (her et tidspunkt) er en logisk bombe.</p>" }
          ]
        },
        avvik: null,
        losning: ["Sprer seg selv = orm. Forkledd som nyttig = trojaner. Skjult innlogging = bakdør. Venter på en betingelse = logisk bombe."],
        tips: ["Virus trenger et vertsprogram og brukerhandling for å spre seg; orm gjør det på egen hånd."]
      },
      {
        key: "H2023-25", year: Y, oppgave_nr: "Oppgave 25", del: D3,
        ark: "Skadevarebegreper", title: "Injeksjon og rootkit",
        points: 3, block: "angrep", tema: ["SQL-injeksjon", "kommandoinjeksjon", "rootkit"],
        gjenganger: ["H2024-22"], ordrett: true,
        oppgave: "<p>Sett inn riktig begrep for hver beskrivelse. All kode er satt i \"gåsøyne\" pga innstillinger i inspera - se bort fra dem.</p><p><em>Poeng: 1 for hvert riktig;, -1 for hver feil; maks 3; minimum 0.</em></p>",
        inspera: {
          type: "D", regelTekst: "Poeng: 1 for hvert riktig;, -1 for hver feil; maks 3; minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
          tekst: null,
          bank: ["Rootkit", "Command injection", "MiTM", "SQL-injection"],
          felt: [
            { etikett: "\"aabbasdfj ' or 254 &gt; 55\"", svar: 3, explain: "Apostrofen avslutter en tekststreng i en SQL-spørring, og «or» med en alltid sann betingelse endrer logikken. Forsvar: parameteriserte spørringer." },
            { etikett: "\"a &amp;&amp; cat /etc/passwd\"", svar: 1, explain: "«&amp;&amp;» lenker på en ny skallkommando etter den forventede inndataen. Forsvar: ikke send brukerinndata til et skall, og valider mot en hviteliste." },
            { etikett: "Et program som brukes til å skjule spesielle prosesser:", svar: 0, explain: "Et rootkit skjuler angriperens prosesser, filer og tilgang for operativsystemet og administratoren." }
          ]
        },
        avvik: null,
        losning: ["Se etter tegnet som bryter ut av konteksten: apostrof (SQL) eller skalloperator (kommando)."],
        tips: ["MiTM er distraktoren. Felles for injeksjon: inndata tolkes som kode fordi data og kode blandes."]
      },
      {
        key: "H2023-26", year: Y, oppgave_nr: "Oppgave 26", del: D3,
        ark: "Logganalyse", title: "Hva viser loggen?",
        points: 1, block: "angrep", tema: ["logganalyse", "passordgjetting", "passordspraying"],
        ordrett: true,
        oppgave: "<p>En person fra IT-drift kommer løpende til deg - og sier \"Vi er under angrep, se på loggen!\" - hva er mest sannsynlig at har skjedd?</p><p><em>Ett poeng for riktig svar, ellers null.</em></p><p><b>Velg ett alternativ:</b></p>",
        figur: {
          beskrivelse: "En loggtabell med tre kolonner: Tid, IP og Trafikk (to delkolonner: bruker og passord). Åtte rader med tider fra 21.10.2023 - 20:48:00 til 20:48:03, altså flere forsøk per sekund. Alle rader har samme kilde og mål, «10.10.127.34 > 10.1.23.23», og samme bruker, «User:admin». Passordfeltet er forskjellig i hver rad.",
          tekst: ["Tid", "IP", "Trafikk", "21.10.2023 - 20:48:00", "10.10.127.34 > 10.1.23.23", "User:admin", "Pass:Admin", "Pass:admin", "Pass:Passw0rd", "Pass:eeeSSDF", "Pass:in2120", "Pass:Sommerferie", "Pass:Juleferie!", "Pass:Pentest"]
        },
        inspera: {
          type: "F1", regelTekst: "Ett poeng for riktig svar, ellers null.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Command-injection", "Falsk alarm", "Passordspraying", "SQL-injection"],
          svar: 2,
          explain: [
            "Det står ingen skallkommandoer i loggen, bare innloggingsforsøk.",
            "Åtte ulike passord mot samme konto i løpet av noen få sekunder fra én adresse er ikke normal bruk.",
            "Riktig ifølge fasit. Loggen viser automatisert passordgjetting mot admin-kontoen.",
            "Det er ingen SQL-syntaks (apostrof, or-betingelse) i feltene."
          ]
        },
        avvik: "Fasiten (og H24 3) kaller dette «passordspraying», men loggen viser mange passord mot én konto. Kurset selv (d05, lysarket «Passordspraying», og LF til pentest-ukesoppgaven) definerer passordspraying som ett passord mot mange brukere, og mange passord mot én bruker som bruteforce. MITRE ATT&CK skiller på samme måte (T1110.003 Password Spraying, T1110.001 Password Guessing). Velg likevel «Passordspraying» på eksamen: det er fasit, og det eneste passordangrepet blant alternativene.",
        losning: [
          "Les loggen: samme kilde, samme bruker, omtrent to nye passord i sekundet. Det er et automatisert gjetteangrep på innlogging.",
          "Sårbarheten er at innloggingen tillater ubegrenset mange forsøk, og at admin-kontoen er lett å gjette navnet på.",
          "Forsvar: begrens antall forsøk per konto og per kilde (forsinkelse eller midlertidig sperre), krev flerfaktor for administratorkontoer, overvåk og varsle på slike mønstre, og bruk lange, unike passord."
        ],
        tips: ["Merk deg fasitens bruk av ordet her. Kjenner du også kursets egen definisjon (ett passord mot mange brukere), kan du nevne forskjellen i en fritekstoppgave."]
      },

      /* ================= Del 4: Pentesting ================= */
      {
        key: "H2023-27", year: Y, oppgave_nr: "Oppgave 27", del: D4,
        ark: "Passordknekking", title: "PIN fra fire til seks siffer",
        points: 1, block: "autentisering", tema: ["nøkkelrom", "uttømmende søk", "PIN"],
        gjenganger: ["H2024-11"], ordrett: true,
        oppgave: "<p>Du knekker passord ved hjelp av uttømmende søk (I oppgaven benyttes bare tall - tenk koden til et vanlig betalingskort). Systemet har gått fra fire til seks tall. Hvor mye mer komplekst blir passordet?</p><p><em>Poeng: 1 for riktig; 0 for feil eller ubesvart; maks 1, minimum 0.</em></p><p><b>Velg ett alternativ:</b></p>",
        inspera: {
          type: "F1", regelTekst: "Poeng: 1 for riktig; 0 for feil eller ubesvart; maks 1, minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Umulig å si", "Hundre ganger", "95 Ganger", "10 ganger"],
          svar: 1,
          explain: [
            "Det er mulig: tegnsett og lengde er gitt.",
            "Riktig. 10⁶ / 10⁴ = 10² = 100.",
            "95 er antall skrivbare ASCII-tegn. Det gjelder ikke når bare siffer brukes.",
            "Ti ganger ville vært ett ekstra siffer, ikke to."
          ]
        },
        avvik: null,
        losning: ["Antall mulige koder = tegnsett<sup>lengde</sup>. Fire siffer: 10⁴. Seks siffer: 10⁶. Forholdet er 10² = 100."],
        tips: ["Generelt: økning i lengde med n gir tegnsett<sup>n</sup> ganger flere kandidater."]
      },
      {
        key: "H2023-28", year: Y, oppgave_nr: "Oppgave 28", del: D4,
        ark: "Matchende begrep", title: "Kartlegging og injeksjoner",
        points: 4, block: "pentest", tema: ["nmap", "kartlegging", "SQL-injeksjon", "kommandoinjeksjon"],
        gjenganger: ["H2024-23"], ordrett: true,
        oppgave: "<p>Denne oppgaven gir 1 poeng hvert riktig svar, -1 poeng for hvert gale svar, maks 4 poeng, minimum 0 poeng.</p><p>NB: at svarene er i \"gåsøyne\" er for å unngå konverteringer i inspera - se bort fra dem.</p><p><b>Finn de som passer sammen:</b></p>",
        inspera: {
          type: "M", regelTekst: "Denne oppgaven gir 1 poeng hvert riktig svar, -1 poeng for hvert gale svar, maks 4 poeng, minimum 0 poeng.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
          kolonner: ["Fuzzing", "Kartlegging", "Phishing", "Command-injection", "SQL-injection"], multi: false,
          rader: [
            { s: "nmap", svar: [1], explain: "<p>nmap brukes til å kartlegge maskiner, åpne porter og tjenester.</p>" },
            { s: "\"blah &amp;&amp; whoami\"", svar: [3], explain: "<p>Skalloperatoren lenker på en ekstra kommando etter inndataen. Det virker bare når applikasjonen sender inndata videre til et skall. Forsvar: unngå skallet og valider inndata.</p>" },
            { s: "\"ss' or 34 -lt 754\"", svar: [4], explain: "<p>Apostrofen lukker en tekststreng, og «or» legger til en betingelse. Det er mønsteret for SQL-injeksjon. Forsvar: parameteriserte spørringer.</p>" },
            { s: "\"a' or 1 == 1\"", svar: [4], explain: "<p>Samme mønster: apostrof og en alltid sann or-betingelse.</p>" }
          ]
        },
        avvik: "«-lt» er ikke SQL (det er skallets test-syntaks). «==» er ikke standard-SQL, selv om enkelte databaser (f.eks. SQLite) godtar det; standard-SQL bruker &lt; og =. Det som avslører SQL-injeksjonen i radene er apostrofen som lukker strengen pluss or-betingelsen.",
        losning: ["Verktøy for å finne porter = kartlegging. Skalloperator = kommandoinjeksjon. Apostrof + or = SQL-injeksjon."],
        tips: ["Feil gir −1. Kjenn igjen mønsteret, ikke den nøyaktige syntaksen."]
      },
      {
        key: "H2023-29", year: Y, oppgave_nr: "Oppgave 29", del: D4,
        ark: "Misbruk av sudo", title: "Feilkonfigurert sudo-rettighet",
        points: 5, block: "pentest", tema: ["sudo", "privilegieeskalering", "minste privilegium", "passordhasher"],
        gjenganger: ["H2022-4.4"], ordrett: true,
        oppgave: "<p>I løpet av en pentest har du funnet passordet til en bruker som kan logge inn på en maskin gjennom ssh. Du logger inn og sjekker rettigheter – se bildet under.</p><p>Nevn to måter å misbruke sudo-rettighetene du ser på bildet til å oppnå root-tilgang.</p><p>Du trenger ikke å gi uttømmende svar her, skriv en eller maks to setninger for hver måte du nevner.</p><p><em>Hver måte (tekst) gir 2 poeng, men det er mulig å oppnå totalt 5 poeng hvis du skriver en tilnærmet fungerende kode (pseudokode) for å gjennomføre ett av angrepene (altså den delen av angrepet som krever sudo).</em></p>",
        figur: {
          beskrivelse: "Skjermbilde av et Linux-terminalvindu med tittelen «ss@in2120: ~». Brukeren ss lister sine sudo-rettigheter. Utdataene viser først standardinnstillingene for brukeren (env_reset, mail_badpass, en secure_path med de vanlige systemkatalogene, use_pty) og deretter at brukeren ss kan kjøre programmet /usr/bin/cat som hvilken som helst bruker og gruppe, «(ALL : ALL) /usr/bin/cat». Med andre ord: brukeren kan lese hvilken som helst fil som root.",
          tekst: ["ss@in2120: ~", "User ss may run the following commands on in2120:", "(ALL : ALL) /usr/bin/cat"]
        },
        inspera: {
          type: "E", regelTekst: "Hver måte (tekst) gir 2 poeng, men det er mulig å oppnå totalt 5 poeng hvis du skriver en tilnærmet fungerende kode (pseudokode) for å gjennomføre ett av angrepene (altså den delen av angrepet som krever sudo).",
          regel: { min: 0, maks: 5 },
          regelMerknad: "Rettes manuelt: 2 p per måte (to måter) + 1 p for (pseudo)kode til den delen som krever sudo.",
          deler: [
            { del: "Måte 1", poeng: 2, grense: "en eller maks to setninger" },
            { del: "Måte 2", poeng: 2, grense: "en eller maks to setninger" },
            { del: "(Pseudo)kode", poeng: 1 }
          ]
        },
        avvik: "Modellsvaret har rekkefølgen på de to filene snudd i knekkesteget (passordfila skal først, skyggefila etterpå). Steget er uansett ikke en del av det som kreves for poeng.",
        losning: [
          "Sårbarheten: brukeren har fått lov til å kjøre et fillesingsprogram som root uten begrensning. Det betyr i praksis lesetilgang til alle filer på maskinen.",
          "Hvorfor det gir root: filer som bare root skal kunne lese, inneholder hemmeligheter. Den viktigste er fila med passordhashene. Hashene kan knekkes offline, og et knekt root- eller administratorpassord gir full tilgang.",
          "Andre hemmeligheter som blir lesbare: andre brukeres private SSH-nøkler, konfigurasjonsfiler med passord og lignende.",
          "Forsvar: gi sudo bare for det som trengs, aldri for generelle verktøy som kan lese eller skrive vilkårlige filer, kjør et program med faste argumenter i stedet, og gå gjennom sudo-oppsettet jevnlig."
        ],
        tips: ["To måter = to typer hemmeligheter som blir lesbare: passordhashene (knekkes offline) og andres private filer/nøkler.", "Mange vanlige verktøy gir mer makt enn de ser ut til når de kjøres med sudo. Det er derfor minste privilegium er så viktig her."]
      },

      /* ================= Del 5: Nettverkssikkerhet ================= */
      {
        key: "H2023-30", year: Y, oppgave_nr: "Oppgave 30", del: D5,
        ark: "Kommunikasjonssikkerhet", title: "TLS, IPsec, HSTS, sky-VPN og OWASP",
        points: 5, block: "nettverk", tema: ["TLS handshake", "IPsec", "HSTS", "VPN", "OWASP Top 10"],
        gjenganger: ["H2024-25"], ordrett: true,
        oppgave: "<p>Velg riktig begrep for å danne korrekte utsagn nedenfor.</p><p><em>Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 5, minimum 0.</em></p>",
        inspera: {
          type: "N", regelTekst: "Poeng: 1 for hver riktig; 0 for hver feil eller ubesvart; maks 5, minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 5 },
          tekst: "<p>{0} i TLS brukes til å etablere øktnøkkel (sesjonsnøkkel).</p><p>For {1} krypteres all applikasjonsdata.</p><p>HSTS beskytter mot {2}.</p><p>I en sky-VPN kan brukerens ISP (Internet Service Provider) se {3}</p><p>{4} rangerer de mest kritiske sikkerhetsrisikoene for nettapplikasjoner.</p>",
          felt: [
            { etikett: "Øktnøkkel i TLS", valg: ["Record-protokollen", "Handshake-protokollen", "Alert-protokollen", "Change Cipher Suite-protokollen"], svar: 1, explain: "Handshake forhandler algoritmer, autentiserer tjeneren og etablerer øktnøkkelen. Record bruker den etterpå." },
            { etikett: "All applikasjonsdata krypteres", valg: ["TLS (men ikke IPSec)", "både TLS og IPSec", "IPSec (men ikke TLS)"], svar: 1, explain: "Begge krypterer applikasjonsdataene. IPsec krypterer i tillegg transportlagshodene (i ESP)." },
            { etikett: "HSTS", valg: ["XSS", "TLS-stripping", "DOS"], svar: 1, explain: "HSTS får nettleseren til å nekte ukryptert HTTP mot domenet, så en mellommann ikke kan nedgradere til HTTP. Gjelder ikke første besøk, med mindre domenet er forhåndslastet." },
            { etikett: "Sky-VPN og ISP", valg: ["bare innholdet (i klartekst)", "alt innhold og IP-adresse til endelig destinasjonen", "bare IP-adresse til endelig destinasjonen (og ikke ukryptert innhold)", "at brukeren har tilgang til sky-VPN men ser ikke innhold eller endelig destinasjon"], svar: 3, explain: "ISP-en ser bare en kryptert tunnel til VPN-tjeneren. Innhold og endelig mål ligger inne i tunnelen." },
            { etikett: "Rangerer risiko for nettapplikasjoner", valg: ["Mitre ATT&CK", "Cyber kill chain", "OWASP Top 10", "APT"], svar: 2, explain: "OWASP Top 10 er listen over de mest kritiske risikoene for nettapplikasjoner. ATT&amp;CK beskriver angripernes teknikker." }
          ]
        },
        avvik: null,
        losning: ["Handshake lager nøkkelen, begge protokoller krypterer, HSTS stopper stripping, ISP ser bare VPN-tunnelen, OWASP rangerer webrisiko."],
        tips: ["OWASP Top 10 har ikke eget lysark i 2026, men kan komme fra boka. Lær i hvert fall hva listen er."]
      },
      {
        key: "H2023-31", year: Y, oppgave_nr: "Oppgave 31", del: D5,
        ark: "Inntrengingsdeteksjon", title: "Signatur- og anomalibasert IDS, Snort-regel",
        points: 3, block: "nettverk", tema: ["IDS", "anomalibasert", "signaturbasert", "Snort"],
        gjenganger: ["H2024-27", "H2025-20"], ordrett: true,
        oppgave: "<p>Firmaet \"Detekt i takt\" har spesialisert seg på inntrengingsdeteksjon (IDS), og bruker både signatur-basert og anomali-basert inntrengingsdeteksjon. I den forbindelse er det tre spørsmål du må svare på.</p><p><em>Poeng: 1 for hvert riktig; 0 for hver feil eller ubesvart; maks 3; minimum 0.</em></p>",
        inspera: {
          type: "F1", regelTekst: "Poeng: 1 for hvert riktig; 0 for hver feil eller ubesvart; maks 3; minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 3 },
          sporsmal: [
            {
              tekst: "<p>Hvilken IDS-type er ofte basert på maskinlæring?</p><p><b>Velg ett alternativ</b></p>",
              alternativer: ["Signatur-basert", "Anomali-basert"],
              svar: 1,
              explain: [
                "Signaturbasert IDS sammenligner med faste, kjente mønstre. Det trenger ingen læring.",
                "Riktig. Anomalibasert IDS lærer hva normal trafikk er og varsler ved avvik, ofte med maskinlæring."
              ]
            },
            {
              tekst: "<p>Det går en alarm fra en sårbarhet som nylig har blitt oppdaget men ikke blitt patchet. Hvilken type IDS kan ha generert alarmen?</p><p><b>Velg ett alternativ</b></p>",
              alternativer: [
                "Det må ha vært fra en anomali-basert siden sårbarheten ikke har blitt patchet",
                "Kan både ha vært fra anomali-basert og signatur-basert",
                "Dette er en kjent sårbarhet som betyr at det må ha vært signatur-basert"
              ],
              svar: 1,
              explain: [
                "At det ikke finnes en rettelse, betyr ikke at det ikke finnes en signatur. Signaturer kan finnes før rettelsen er installert.",
                "Riktig. Sårbarheten er kjent, så det kan finnes en signatur. Angrepet kan også gi uvanlig trafikk som en anomalibasert IDS fanger.",
                "En anomalibasert IDS kan også ha reagert, så «må» er for sterkt."
              ]
            },
            {
              tekst: "<p>\"Detekt i takt\" har tidligere laget følgende Snort signatur:</p><pre>alert tcp 1.2.3.4 any -&gt; 5.6.7.8 443 (msg \"\")</pre><p>Avdelingen for \"utvikling av nye signaturer\", som du nylig har begynt å jobbe i, har fått i oppdrag å lage mer beskrivende meldinger i signaturene. I dette tilfellet får man ingen informasjon (msg \"\"), og du har blitt bedt om å forbedre beskrivelsen. Du kan anta standard bruk av portnummer. Velg den mest passende meldingen som beskriver hva signaturen over gjør?</p><p><b>Velg ett alternativ:</b></p>",
              alternativer: ["\"Ukryptert trafikk til 5.6.7.8\"", "\"SSH til IP-adresse 5.6.7.8“", "\"HTTPS trafikk fra 5.6.7.8 til 1.2.3.4 \"", "\"HTTPS trafikk fra 1.2.3.4 til 5.6.7.8\""],
              svar: 3,
              explain: [
                "Port 443 er HTTPS, altså kryptert trafikk.",
                "SSH bruker port 22, ikke 443.",
                "Retningen er feil. Pilen går fra 1.2.3.4 til 5.6.7.8.",
                "Riktig. Kilde 1.2.3.4 (alle porter), pil mot 5.6.7.8 port 443, som er HTTPS."
              ]
            }
          ]
        },
        avvik: "Snort-regelen i arket har en syntaksfeil: i Snort skrives valget som msg:\"…\"; med kolon og avsluttende semikolon, ikke msg \"\". Det påvirker ikke svaret.",
        losning: ["Anomali = maskinlæring. Kjent sårbarhet = begge typer mulige. Les regelen: kilde → mål, port 443 = HTTPS."],
        tips: ["Snort-regelens oppbygging: handling protokoll kilde-IP kildeport -&gt; mål-IP målport (valg)."]
      },
      {
        key: "H2023-32", year: Y, oppgave_nr: "Oppgave 32", del: D5,
        ark: "Konfigurasjon av brannmur", title: "Åpne én tjeneste gjennom brannmuren",
        points: 2, block: "nettverk", tema: ["brannmur", "iptables", "segmentering", "FORWARD"],
        gjenganger: ["H2021-5.4", "H2022-7.3", "H2025-24"], ordrett: true,
        oppgave: "<p>Du er innleid som konsulent til firmaet \"Frem og tilbake\".</p><p>\"Frem og tilbake\" har i nettverket separert forretningslogikken inn i et eget indre segment, mens web-tjeneren står i det ytre segmentet.</p><p>Disse segmentene er separert med en dedikert brannmur, som for øyeblikket er stilt inn til å ikke slippe gjennom noe trafikk til det indre segmentet.</p><p>Dette har vist seg å være for restriktivt og du har derfor blitt bedt om å oppdatere brannmuren slik at trafikk fra web-tjeneren (i det ytre segment) til database-tjeneren (i det indre segmentet) skal slippes gjennom.</p><p>Du blir gitt følgende informasjon:</p><ul><li>Web-tjeneren har IP-adresse 1.2.3.1</li><li>Database-tjeneren har IP-adresse 5.6.7.1</li><li>Selve database-tjenesten kjører på port 1433 og det er kun trafikk til denne tjenesten som skal godtas.</li></ul><p>Brannmuren skal kun slippe gjennom denne trafikken og ikke noe annen trafikk.</p><p>Følgende diagram illustrerer denne nettverksarkitekturen:</p><p>Brannmuren som brukes er et mye brukt pakkefilter for Linux som du kjenner igjen fra både forelesning og oblig i IN2120. Du husker derimot ikke alle argumentene, så du slår dette opp og finner følgende informasjon om argumentene som kan være nyttig:</p><ul><li>-A &lt;liste&gt; hvor &lt;liste&gt; kan være: OUTPUT, INPUT eller FORWARD</li><li>-s &lt;IP-adresse&gt; spesifiserer IP-adressen(e) til avsender</li><li>-d &lt;IP-adresse&gt; spesifiserer IP-adressen(e) til mottaker</li><li>--sport &lt;portnummer&gt; spesifiserer portnummer til avsender</li><li>--dport &lt;portnummer&gt; spesifiserer portnummer til mottaker</li><li>-p &lt;proto&gt; spesifiserer protokoll brukt</li><li>-j &lt;result&gt; hvor &lt;result&gt; kan være DROP eller ACCEPT</li></ul><p>Gi kommando med riktige argumenter for å oppdatere brannmuren som beskrevet over.</p><p><em>Du får 2 poeng for helt riktig svar; 1 poeng for delvis riktig svar; 0 poeng i alle andre tilfeller. Merk at det ikke vil trekkes poeng for feil rekkefølge av argumentene.</em></p><p><b>Skriv kommando med riktige argumenter her:</b></p>",
        figur: {
          beskrivelse: "Nettverksdiagram. Øverst en sky merket «Internett» koblet til en ruter/svitsj. Ruteren sitter på kanten av én stiplet ramme som omslutter begge segmentene. I rammen er et ytre segment (tekst «Ytre segment») med fire tjenermaskiner; en av dem er merket «Web-tjener 1.2.3.1». Fra ytre segment går en kobling via et svitsjsymbol med rød etikett «Brannmur» til et indre segment (tekst «Indre segment») med tre tjenermaskiner; en av dem er merket «Database-tjener 5.6.7.1». Brannmuren står altså mellom de to segmentene, og trafikken mellom dem rutes gjennom den.",
          tekst: ["Internett", "Ytre segment", "Web-tjener 1.2.3.1", "Brannmur", "Database-tjener 5.6.7.1", "Indre segment"]
        },
        inspera: {
          type: "K", regelTekst: "Du får 2 poeng for helt riktig svar; 1 poeng for delvis riktig svar; 0 poeng i alle andre tilfeller. Merk at det ikke vil trekkes poeng for feil rekkefølge av argumentene.",
          regel: { min: 0, maks: 2 },
          regelMerknad: "Rettes manuelt: 2 p helt riktig, 1 p delvis riktig (se sensors instruks).",
          deler: [{ del: "", poeng: 2, grense: "én kommando" }]
        },
        avvik: "Modellsvaret mangler protokollangivelse. Et portfilter på destinasjonsport virker bare når protokollen (her TCP) er oppgitt i samme regel, ellers avvises regelen. Ta med protokollen i ditt svar.",
        losning: [
          "Brannmuren sitter mellom to segmenter, så trafikken går gjennom den og ikke til den. Regelen hører derfor hjemme i kjeden for videresendt trafikk (FORWARD), ikke INPUT eller OUTPUT.",
          "Regelen skal være så smal som mulig: kilde = web-tjeneren, mål = database-tjeneren, protokoll = TCP, destinasjonsport = databasetjenesten, handling = godta.",
          "Alt annet er allerede blokkert, så én godta-regel lagt til er nok. Det er minste privilegium på nettverksnivå: én kilde, ett mål, én tjeneste."
        ],
        tips: ["Spør deg: går trafikken til brannmuren, fra den, eller gjennom den?", "Hvis brannmuren også blokkerer trafikk ut av det indre segmentet, må svarene slippes tilbake, typisk med en tilstandsbasert regel for etablerte forbindelser tar seg av det; oppgaven spør ikke om det."]
      },

      /* ================= Del 6: Autentisering og IAM ================= */
      {
        key: "H2023-33", year: Y, oppgave_nr: "Oppgave 33", del: D6,
        ark: "Passnøkler", title: "Passnøkler sant/usant",
        points: 3, block: "autentisering", tema: ["passnøkler", "FIDO", "WebAuthn", "phishingresistens"],
        gjenganger: ["H2022-8.3", "H2025-25"], ordrett: true,
        oppgave: "<p>Phishingresistent autentisering med passnøkler (også kalt FIDO eller WebAuthn) er et aktuelt tema. Indiker om hvert av utsagnene nedenfor er sant eller usant.</p><p><em>Poeng; 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 3; minimum 0.</em></p><p><b>Si om hvert utsagn er sant eller usant.</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng; 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 3; minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
          kolonner: ["Sant", "Usant"], multi: false,
          rader: [
            { s: "En passnøkkel inneholder autentiseringstjenerens URL.", svar: [0], explain: "<p>Passnøkkelen er knyttet til domenet den ble laget for. Derfor virker den ikke på en falsk side med et annet domene.</p>" },
            { s: "Selv om phishingresistent autentisering gjør at brukeren advares om falske nettsider, kan brukeren i nettleseren velge å ignorere advarselen.", svar: [1], explain: "<p>Det er ingen advarsel å klikke forbi. Nettleseren tilbyr rett og slett ikke passnøkkelen til et feil domene.</p>" },
            { s: "Hver bruker har kun én passnøkkel som benyttes for ulike nettsteder.", svar: [1], explain: "<p>Det lages et eget nøkkelpar per nettsted (per konto).</p>" },
            { s: "En passnøkkel er en privat (asymmetrisk) kryptografisk nøkkel.", svar: [0], explain: "<p>Brukeren har den private nøkkelen, tjeneren har bare den offentlige.</p>" },
            { s: "Brukere som mister enheter der passnøkler er lagret må generere nye passnøkler.", svar: [1], explain: "<p>Passnøkler kan synkroniseres via en sky- eller passordtjeneste og gjenopprettes på en ny enhet.</p>" },
            { s: "Brukerautentisering med passnøkler foregår i to etapper, en lokal, og en online.", svar: [0], explain: "<p>Først låser brukeren opp passnøkkelen lokalt (PIN eller biometri), så signerer enheten en utfordring fra tjeneren.</p>" }
          ]
        },
        avvik: null,
        losning: ["Passnøkkel = privat nøkkel per domene, låst opp lokalt, brukt til å signere en utfordring online."],
        tips: ["Phishingresistens kommer fra domenebindingen, ikke fra brukerens årvåkenhet."]
      },
      {
        key: "H2023-34", year: Y, oppgave_nr: "Oppgave 34", del: D6,
        ark: "Identitetshåndtering", title: "Identitet, domener og føderering",
        points: 3, block: "iam", tema: ["identitet", "identitetsdomene", "silo", "føderert"],
        gjenganger: ["H2021-7.1", "H2022-9.1"], ordrett: true,
        oppgave: "<p>Si om utsagnene om identitetshåndtering er korrekt eller feil.</p><p><em>Poeng: 0,5 for hver korrekt; -0.5 for for hver feil; 0 for ubesvart; maks 3; minimum 0.</em></p><p><b>Velg korrekt eller feil for hvert utsagn:</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 0,5 for hver korrekt; -0.5 for for hver feil; 0 for ubesvart; maks 3; minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
          kolonner: ["Korrekt", "Feil"], multi: false,
          rader: [
            { s: "Identitet er et sett med attributter.", svar: [0], explain: "<p>Det er kursets definisjon: en identitet er et sett attributter om en entitet i et domene.</p>" },
            { s: "Identitetsdomene er et sett med attributter.", svar: [1], explain: "<p>Et identitetsdomene er området der identitetene er definert og identifikatorene er unike, ikke selv et sett attributter.</p>" },
            { s: "Silo-domener kan bare ha 1-faktorautentisering.", svar: [1], explain: "<p>En silo kan godt bruke flerfaktor. Silo sier bare at tjenesten og identitetstilbyderen er den samme.</p>" },
            { s: "Fødererte IAM-arkitekturer har alltid distribuerte identitetsdomener.", svar: [1], explain: "<p>Ikke alltid. En føderasjon kan bygge på én sentral identitetstilbyder.</p>" },
            { s: "Fødererte IAM-arkitekturer har alltid distribuert autentisering.", svar: [1], explain: "<p>Ikke alltid. Autentiseringen kan gjøres sentralt hos én identitetstilbyder som mange tjenester stoler på.</p>" },
            { s: "En bruker kan ha forskjellige identiteter i forskjellige domener.", svar: [0], explain: "<p>Samme person kan være student i ett domene og kunde i et annet, med ulike attributter.</p>" }
          ]
        },
        avvik: null,
        losning: ["Se etter ordet «alltid». Fødereringer finnes med både sentraliserte og distribuerte varianter."],
        tips: ["Identitet ≠ identifikator. Identifikatoren er det entydige navnet; identiteten er attributtene."]
      },
      {
        key: "H2023-35", year: Y, oppgave_nr: "Oppgave 35", del: D6,
        ark: "OAuth", title: "OAuth-flyten i riktig rekkefølge",
        points: 4, block: "iam", tema: ["OAuth", "tilgangstoken", "autorisering"],
        ordrett: true,
        oppgave: "<p>Figuren nedenfor viser en forenklet use-case med OAuth der brukeren autoriserer Photo Edit app for tilgang til sine bilder lagret på Google Photos. Skriv riktig meldingsnummer med tall fra 1 til 7 for hver melding.</p><p><em>Poeng: 0,5 for hver riktig; 0 for hver feil eller ubesvart; 4 for alle riktig (0,5 i bonus hvis alt riktig); minimum 0.</em></p>",
        figur: {
          beskrivelse: "Fire aktører: øverst til venstre «Ressurseier» (med et brukerikon merket «Bruker»), nede til venstre «Ressurstjener» (med en database merket «Google Photos»), øverst til høyre «Autoriseringstjener (og IdP)» og nede til høyre «Photo Edit online app». Sju piler, hver med et tomt tallfelt: (a) fra ressurseier skrått ned til appen: «jeg vil redigere mine bilder på Google Photos med Photo Edit»; (b) fra appen opp til autoriseringstjeneren: «bruker ønsker å redigere sine bilder fra Google Photos med Photo Edit»; (c) fra autoriseringstjeneren til ressurseier: «forespørsel fra deg (bruker) om du vil la Photo Edit få tilgang til dine bilder på Google Photos»; (d) fra ressurseier til autoriseringstjeneren, med et nøkkelsymbol: «godkjenner forespørsel med autentikator»; (e) fra autoriseringstjeneren ned til appen, med et token-symbol: «tilgangstoken som bevis på godkjent forespørsel»; (f) fra appen til ressurstjeneren, med token-symbol: «forespørsel om bilder med tilgangstoken»; (g) fra ressurstjeneren til appen: «Photo Edit får tilgang til brukerens bilder».",
          tekst: ["Ressurseier", "Bruker", "Ressurstjener", "Google Photos", "Autoriseringstjener (og IdP)", "Photo Edit online app"]
        },
        inspera: {
          type: "T", regelTekst: "Poeng: 0,5 for hver riktig; 0 for hver feil eller ubesvart; 4 for alle riktig (0,5 i bonus hvis alt riktig); minimum 0.",
          regel: { riktig: 0.5, feil: 0, blankt: 0, min: 0, maks: 4 },
          regelMerknad: "7 felt × 0,5 = 3,5. Alle sju riktige gir 0,5 i bonus, altså 4.",
          tekst: null,
          felt: [
            { etikett: "Bruker → app: «jeg vil redigere mine bilder på Google Photos med Photo Edit»", godta: ["1"], explain: "Alt starter med at brukeren ber appen om noe." },
            { etikett: "App → autoriseringstjener: «bruker ønsker å redigere sine bilder fra Google Photos med Photo Edit»", godta: ["2"], explain: "Appen har ikke tilgang og sender brukeren videre til autoriseringstjeneren." },
            { etikett: "Autoriseringstjener → ressurseier: «forespørsel fra deg (bruker) om du vil la Photo Edit få tilgang …»", godta: ["3"], explain: "Autoriseringstjeneren spør eieren om samtykke." },
            { etikett: "Ressurseier → autoriseringstjener: «godkjenner forespørsel med autentikator»", godta: ["4"], explain: "Eieren logger inn (autentiserer seg) og godkjenner." },
            { etikett: "Autoriseringstjener → app: «tilgangstoken som bevis på godkjent forespørsel»", godta: ["5"], explain: "Appen får et tilgangstoken, ikke brukerens passord." },
            { etikett: "App → ressurstjener: «forespørsel om bilder med tilgangstoken»", godta: ["6"], explain: "Appen viser frem tokenet til ressurstjeneren." },
            { etikett: "Ressurstjener → app: «Photo Edit får tilgang til brukerens bilder»", godta: ["7"], explain: "Ressurstjeneren sjekker tokenet og gir tilgang." }
          ]
        },
        avvik: "Poengregelen gir 0,5 p bonus når alt er riktig: 7 × 0,5 = 3,5, og maks er 4.",
        losning: ["Ønske → videresending → samtykkespørsmål → godkjenning → token → bruk av token → tilgang."],
        tips: ["OAuth gir autorisering (tilgangstoken). Det er OIDC oppå OAuth som gir autentisering (ID-token)."]
      },

      /* ================= Del 7: ISMS og risikostyring ================= */
      {
        key: "H2023-36", year: Y, oppgave_nr: "Oppgave 36", del: D7,
        ark: "27K-serien av sikkerhetsstandarder", title: "ISO 27000, 27001, 27002, 27005",
        points: 2, block: "risiko", tema: ["ISO 27001", "ISO 27002", "ISO 27005", "ISO 27000"],
        gjenganger: ["H2021-8.1", "H2025-28"], ordrett: true,
        oppgave: "<p>ISO/IEC publiserer 27K-serien med standarder for informasjonssikkerhet. Indiker hvilket nummer standarden har for hver beskrivelse av en standard nedenfor.</p><p><em>Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2; minimum 0.</em></p><p><b>Indiker riktig nummer for standard.</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2; minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          kolonner: ["27001", "27002", "27005", "27000"], multi: false,
          rader: [
            { s: "Risikostyring for informasjonssikkerhet", svar: [2], explain: "<p>27005 handler om risikostyring.</p>" },
            { s: "Generell beskrivelse av ISMS (styringssystem for informasjonssikkerhet)", svar: [3], explain: "<p>27000 gir oversikt og begreper for hele serien.</p>" },
            { s: "Tiltaksbank (beskrivelse av ulike sikkerhetstiltak)", svar: [1], explain: "<p>27002 er tiltaksbanken (93 tiltak i 2022-utgaven).</p>" },
            { s: "Krav til ISMS (styringssystem for informasjonssikkerhet)", svar: [0], explain: "<p>27001 er kravstandarden, og den man sertifiseres etter.</p>" }
          ]
        },
        avvik: null,
        losning: ["00 = oversikt, 01 = krav (sertifiserbar), 02 = tiltak, 05 = risiko."],
        tips: ["Felle: 27002 er ikke sertifiserbar."]
      },
      {
        key: "H2023-37", year: Y, oppgave_nr: "Oppgave 37", del: D7,
        ark: "NSMs grunnprinsipper og NIST CSF", title: "NSM, NIST, begge eller ingen",
        points: 2, block: "risiko", tema: ["NSM grunnprinsipper", "NIST CSF", "ISO 27001"],
        gjenganger: ["H2021-8.2", "H2024-32"], ordrett: true,
        oppgave: "<p>NSMs grunnprinsipper for IKT-sikkerhet, og NIST Cybersecurity Framework er to standarder/veiledere for informasjonssikkerhet. Indiker om hvert utsagn nedenfor gjelder for NSM, NIST, begge eller ingen.</p><p><em>Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2, minimum 0.</em></p><p><b>Indiker hva som gjelder for hvert utsagn.</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          kolonner: ["NSM", "NIST", "begge", "ingen"], multi: false,
          rader: [
            { s: "Kategoriserer sikkerhetstiltak etter styringsprosesser (f.eks. kartlegge, beskytte, oppdage, håndtere)", svar: [2], explain: "<p>NSM har fire kategorier (identifisere og kartlegge, beskytte og opprettholde, oppdage, håndtere og gjenopprette). NIST CSF har tilsvarende funksjoner.</p>" },
            { s: "Standarden/veilederen må kjøpes", svar: [3], explain: "<p>Begge er gratis. Det er ISO-standardene som må kjøpes.</p>" },
            { s: "Er publisert på norsk", svar: [0], explain: "<p>NSM er norsk. NIST CSF er amerikansk og på engelsk.</p>" },
            { s: "Kan brukes sammen med ISO/IEC 27001", svar: [2], explain: "<p>Begge kan brukes som tiltaksbank i et ISMS etter 27001.</p>" }
          ]
        },
        avvik: null,
        losning: ["Begge er gratis rammeverk med prosessinndeling. Bare NSM er på norsk."],
        tips: ["NIST CSF 2.0 har seks funksjoner (GOVERN er ny); eldre eksamener sier fem."]
      },
      {
        key: "H2023-38", year: Y, oppgave_nr: "Oppgave 38", del: D7,
        ark: "Prosess for risikostyring", title: "Risikostyringsprosessen i figur",
        points: 4, block: "risiko", tema: ["risikostyring", "risikovurdering", "risikohåndtering", "risikoeier"],
        gjenganger: ["H2022-10.1"], ordrett: true,
        oppgave: "<p>Figuren nedenfor viser prosess for risikostyring der trinnene mangler beskrivelse. Sett inn elementene i riktig felt for å beskrive trinnene.</p><p><em>Poeng: 0,5 for hver riktig; -0.5 for hver feil; 0 for ubesvart; 4 for alle riktig; minimum 0.</em></p>",
        figur: {
          beskrivelse: "Flytskjema under overskriften «Risikostyring for informasjonssikkerhet», innrammet med blå stiplet linje. Fire tomme hovedfelt under hverandre, forbundet med piler nedover. Mellom felt 2 og 3 står en rombe «Beslutningspunkt 1» med utgang J nedover og N tilbake opp til felt 1. Mellom felt 3 og 4 står «Beslutningspunkt 2» med J nedover og N tilbake opp. Til høyre for felt 1, 2 og 3 står hver sin boks med teksten «Består bl.a. av:» og et tomt felt, koblet til hovedfeltet med en klamme eller stiplet linje. Felt 2 er tegnet som en avrundet (pilleformet) boks. Sju dra-bokser over figuren.",
          tekst: ["Risikostyring for informasjonssikkerhet", "Består bl.a. av:", "Beslutningspunkt 1", "Beslutningspunkt 2", "J", "N"]
        },
        inspera: {
          type: "D", regelTekst: "Poeng: 0,5 for hver riktig; -0.5 for hver feil; 0 for ubesvart; 4 for alle riktig; minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 4 },
          regelMerknad: "7 felt × 0,5 = 3,5. Alle sju riktige gir 0,5 i bonus, altså 4.",
          tekst: null,
          bank: ["Kontekstetablering", "Bestem risikoeier", "Implementer sikkerhetstiltak", "Aksepter risiko", "Risikovurdering (ROS)", "Risikohåndteringsplan", "Risikoanalyse"],
          felt: [
            { etikett: "Hovedfelt 1", svar: 0, explain: "Prosessen starter med å fastsette rammene: omfang, kriterier og ansvar." },
            { etikett: "Består bl.a. av (ved felt 1)", svar: 1, explain: "Å bestemme hvem som eier risikoene er en del av konteksten." },
            { etikett: "Hovedfelt 2", svar: 4, explain: "Risikovurderingen (ROS) identifiserer, analyserer og evaluerer risikoene." },
            { etikett: "Består bl.a. av (ved felt 2)", svar: 6, explain: "Risikoanalysen (sannsynlighet og konsekvens) er en del av vurderingen." },
            { etikett: "Hovedfelt 3", svar: 5, explain: "Risikohåndteringsplanen sier hva som skal gjøres med hver risiko." },
            { etikett: "Består bl.a. av (ved felt 3)", svar: 3, explain: "Å akseptere en risiko er et av valgene i håndteringen." },
            { etikett: "Hovedfelt 4", svar: 2, explain: "Til slutt settes de valgte tiltakene i verk." }
          ]
        },
        avvik: "Poengregelen gir 0,5 p bonus når alt er riktig: 7 × 0,5 = 3,5, og maks er 4.",
        losning: ["Kontekst → vurdering → plan → tiltak. Beslutningspunktene sender deg tilbake hvis resultatet ikke er godt nok."],
        tips: ["Feil gir −0,5. Felt 1–4 følger ISO 27005-rekkefølgen."]
      },
      {
        key: "H2023-39", year: Y, oppgave_nr: "Oppgave 39", del: D7,
        ark: "Risikohåndtering", title: "Gyldige måter å håndtere risiko",
        points: 2, block: "risiko", tema: ["risikohåndtering", "redusere", "dele", "akseptere", "restrisiko"],
        ordrett: true,
        oppgave: "<p>Håndtering av risikoer er en del av risikostyring. For hvert utsagn nedenfor, indiker om det representerer en gyldig metode for å håndtere risiko.</p><p><em>Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2, minimum 0.</em></p><p><b>Indiker om hvert utsagn er en gyldig metode for risikohåndtering.</b></p>",
        inspera: {
          type: "M", regelTekst: "Poeng: 0,5 for hver riktig; -0,5 for hver feil; 0 for ubesvart; maks 2, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          kolonner: ["Nei", "Ja"], multi: false,
          rader: [
            { s: "Reduser risiko ved å implementere sikkerhetstiltak", svar: [1], explain: "<p>Å redusere med tiltak er den vanligste håndteringen.</p>" },
            { s: "Dele eller overføre risiko til andre, f.eks. med tjenesteutsetting eller cyberforsikring", svar: [1], explain: "<p>Deling eller overføring er en gyldig håndtering, selv om ansvaret ikke forsvinner helt.</p>" },
            { s: "Reduser risikonivået fra risikovurderingen ved å endre risikotabellen", svar: [0], explain: "<p>Å endre skalaen endrer bare tallet på papiret, ikke den faktiske risikoen.</p>" },
            { s: "Aksepter risikoen, som dermed representerer restrisiko", svar: [1], explain: "<p>Bevisst aksept er gyldig. Det som er igjen, er restrisiko.</p>" }
          ]
        },
        avvik: null,
        losning: ["De fire klassiske valgene: redusere, unngå, dele/overføre, akseptere."],
        tips: ["«Endre tabellen» er juks med målingen, ikke håndtering."]
      }
    ]
  };

  /* ================= Perfekt svar: hvorfor ================= */
  hv(1, "<p>En pinne i bakken sier bare hvor grensen går. Et rekkverk hindrer at du faller. Piggtråd stopper noen som vil inn.</p>",
    "<p>Sikkerhet handler om vern mot tilsiktede handlinger, trygghet om vern mot ulykker, og visshet om å vite noe sikkert.</p>",
    "<p>Skillet security/safety går på om trusselen er en aktør med vilje eller et uhell. Visshet (certainty) er kunnskapsdimensjonen. Den beskytter ikke, men gir grunnlag for å stole på noe. Begrepene er eksamensbaserte og står ikke på 2026-lysarkene.</p>");
  hv(2, "<p>Regler sjekker du med en sjekkliste. Risiko må du vurdere om er lav nok.</p>",
    "<p>Krav fra risikovurderingen er oppfylt når restrisikoen er på et forsvarlig nivå. Krav fra lov og kontrakt er oppfylt når du er i samsvar med dem.</p>",
    "<p>Et ISMS har to kilder til krav: egen risikovurdering (forsvarlighet, et skjønn) og regelverk (samsvar, compliance). Samsvar kan revideres mot konkrete krav, forsvarlighet må begrunnes.</p>");
  hv(3, "<p>Spør om noen leser det, endrer det, eller stopper deg fra å bruke det.</p>",
    "<p>Lese = konfidensialitet, endre = integritet, hindre bruk = tilgjengelighet. Løsepengevirus hindrer bruk og bryter T.</p>",
    "<p>Klassifiser etter effekten på verdien, ikke etter teknikken. Kryptering i løsepengevirus brukes mot eieren, så det er tilgjengeligheten som rammes. Avlytting bryter K bare når innholdet faktisk kan leses.</p>");
  hv(4, "<p>Du får en lukket svart boks og må finne ut alt selv.</p>",
    "<p>Svartboks: ingen forkunnskap. Gråboks: noe. Hvitboks: full innsikt.</p>",
    "<p>Svartboks simulerer en ekstern angriper og er realistisk, men dyr i tid. Hvitboks gir best dekning per time fordi testeren kan lese kode og konfigurasjon.</p>");
  hv(5, "<p>Sjefen kan gå inn i alle rom under seg, men ikke inn til styret over seg.</p>",
    "<p>Kjernen (ring 0) når ring 0 og ring 3, men ikke hypervisoren på ring −1.</p>",
    "<p>Maskinvaren håndhever ringene. Kode kan bare nå ressurser på samme eller mindre privilegerte nivå (høyere tall). Hypervisoren på −1 isolerer virtuelle maskiner fra hverandre, også fra gjestekjernen.</p>");
  hv(6, "<p>Én nøkkel til låsen, to ulike nøkler, en kvern du ikke kan reversere, og et register over hvem som eier hvilken lås.</p>",
    "<p>Symmetrisk: samme nøkkel. Asymmetrisk: nøkkelpar. Hash: enveis. PKI: sertifikater som binder offentlige nøkler til eiere.</p>",
    "<p>PKI løser distribusjonsproblemet for offentlige nøkler: n sertifikater og én tiltrodd rot i stedet for n(n−1) sikre utvekslinger.</p>");
  hv(7, "<p>Alle kan putte brev i Alice sin postkasse, men bare Alice har nøkkelen til å åpne den.</p>",
    "<p>Bob krypterer med Alice sin offentlige nøkkel. Alice dekrypterer med sin private nøkkel.</p>",
    "<p>C = E(M, K<sup>A</sup><sub>pub</sub>) og M = D(C, K<sup>A</sup><sub>priv</sub>). Konfidensialitet krever at bare mottaker kan dekryptere, derfor mottakers nøkkelpar. Signatur bruker avsenders private nøkkel.</p>");
  hv(8, "<p>Kart over dørene, en dirk for passord, en lommetyv for minnet og en mikrofon på kabelen.</p>",
    "<p>nmap finner åpne porter, John knekker passordhasher, mimikatz henter hemmeligheter fra minnet, Wireshark viser pakker.</p>",
    "<p>Verktøyene dekker hvert sitt trinn: kartlegging, knekking av hasher offline, uthenting av legitimasjon fra minnet og trafikkanalyse. Forsvareren bruker de samme verktøyene for å se systemet slik en angriper ser det.</p>");
  hv(9, "<p>Bare den som kan lese det gamle passordet, kan se at det nye ligner.</p>",
    "<p>Hasher av like passord ser helt forskjellige ut. Kan systemet si «for likt», har det mest sannsynlig det gamle passordet lesbart.</p>",
    "<p>Hashfunksjoner har lavineffekt, så likhet i input kan ikke sees i output. En direkte likhetssjekk mot et lagret passord forutsetter klartekst eller reversibel kryptering (et hash-system kan bare prøve varianter av det nye passordet mot den lagrede hashen). Begge er dårlig praksis. Riktig er saltet, treg hashing.</p>");
  hv(10, "<p>To av protokollene har lås, resten sender alt åpent.</p>",
    "<p>TLS og IPsec gir kryptering og integritet. IP, UDP, DNS og HTTP gjør det ikke.</p>",
    "<p>TLS sikrer mellom applikasjoner over TCP. IPsec sikrer på IP-laget (ESP/AH) og brukes ofte i VPN. De andre er grunnprotokoller uten egen sikkerhet.</p>");
  hv(11, "<p>Portvakten bestemmer hvem som slipper inn, en kontrollør åpner pakkene og en alarm piper ved kjente mønstre.</p>",
    "<p>Brannmur filtrerer trafikk. TLS-inspeksjon dekrypterer HTTPS i en mellomboks. Snort er en signaturbasert IDS.</p>",
    "<p>TLS-inspeksjon er et bevisst mann-i-midten-oppsett: klientene stoler på virksomhetens egen CA, slik at mellomboksen kan utstede sertifikater og lese trafikken.</p>");
  hv(12, "<p>Først lager tyven et brekkjern (bevæpning). Så får han det inn i huset (overlevering).</p>",
    "<p>Å lage exploiten er bevæpning. Å få den frem til målet, her via USB, er overlevering.</p>",
    "<p>Kill chain skiller mellom å bygge nyttelasten og å transportere den. Overlevering skjer før utførelse: koden kjører først når den åpnes eller starter automatisk.</p>");
  hv(13, "<p>Hjemmeuniversitetet går god for deg, så det andre universitetet slipper deg inn.</p>",
    "<p>Eduroam er føderert: identiteten og autentiseringen fra UiO godtas av andre institusjoner.</p>",
    "<p>I en føderasjon stoler tjenestetilbydere (her nettverket i Stockholm) på identitetstilbyderen (UiO) gjennom avtaler. Eduroam videresender autentiseringen til hjemmeinstitusjonen.</p>");
  hv(14, "<p>Først lager vi adgangskortet og bestemmer hvilke dører det åpner. Siden viser du kortet og døra sjekker.</p>",
    "<p>Konfigurering: registrering, autentikatorklargjøring og autorisering. Bruk: autentisering og tilgangskontroll.</p>",
    "<p>Identitetshåndtering omfatter registrering, autentikator og autentisering. Tilgangshåndtering omfatter autorisering (PAP: spesifisere policy) og tilgangskontroll (PDP/PEP: håndheve).</p>");
  hv(15, "<p>En signatur kan bare én person lage. Et felles hemmelig stempel kan begge lage.</p>",
    "<p>Signatur gir ubenektelig autentisering, MAC bare enkel. Stjeles privatnøkkelen, kan eieren benekte signerte meldinger.</p>",
    "<p>Ubenektelighet krever at bare avsender kan lage beviset og at en tredjepart kan sjekke det. MAC bruker en delt nøkkel og oppfyller ingen av delene overfor tredjepart.</p>");
  hv(16, "<p>Noe verdifullt, en svakhet og noen som vil utnytte den. Mangler én, er det ingen risiko.</p>",
    "<p>Risikotrekanten: verdi, sårbarhet og trussel.</p>",
    "<p>Risiko er en relevant kombinasjon av trussel, sårbarhet og verdi. Risikonivået (sannsynlighet og konsekvens) beregnes for slike kombinasjoner. Tiltak virker ved å fjerne eller svekke et hjørne.</p>");
  hv(17, "<p>Et felles stempel beviser ikke hvem som stemplet. Én hovednøkkel til alle skuffene er farlig hvis den stjeles.</p>",
    "<p>MAC gir ikke bevis overfor tredjepart. SHA-2 er sikker. Øktnøkler kryptert med én langtidsnøkkel gir ikke fremoverhemmelighold.</p>",
    "<p>Med hybrid nøkkeltransport avhenger alle øktnøkler av mottakers private nøkkel. Lekker den, kan tidligere opptak dekrypteres. Fremoverhemmelighold krever flyktig Diffie-Hellman, der øktnøkkelen aldri sendes og delnøklene slettes.</p>");
  hv(18, "<p>Toppsjefen har skrevet sin egen attest. Mellomlederen har attest fra toppsjefen.</p>",
    "<p>GEANT OV ECC CA 4 er en mellomliggende CA. USERTrust er rot-CA og er selvsignert.</p>",
    "<p>Validering starter i den tiltrodde roten i nettleserens rotlager og går nedover kjeden. Roten er selvsignert, så tilliten kommer fra at den er forhåndsinstallert, ikke fra signaturen.</p>");
  hv(19, "<p>Sertifikater har et felles skjema, så alle kan lese dem.</p>",
    "<p>Standarden er X.509.</p>",
    "<p>X.509 definerer feltene i sertifikatet (subjekt, utsteder, offentlig nøkkel, gyldighet, utvidelser) og CA-ens signatur over dem.</p>");
  hv(20, "<p>Venstre: hver blokk får sin egen nummererte maske. Høyre: hver blokk blandes med forrige.</p>",
    "<p>Venstre er CTR (teller krypteres og XOR-es med M). Høyre er CBC (M XOR-es med IV eller forrige C før E).</p>",
    "<p>CTR: C<sub>i</sub> = E(T<sub>i</sub>, K) ⊕ M<sub>i</sub>, parallelliserbar, bruker bare E. CBC: C<sub>1</sub> = E(IV ⊕ M<sub>1</sub>, K) og deretter kjeding, så like klartekstblokker gir ulike chiffertekster.</p>");
  hv(21, "<p>«Pluss én» er lett å regne og gir aldri samme svar for to tall, men er like lett å regne baklengs.</p>",
    "<p>H er lett å beregne og kollisjonsfri, men ikke enveis og komprimerer ikke.</p>",
    "<p>Kravene er lett å beregne, komprimering til fast lengde, enveis, svak og sterk kollisjonsresistens. En injektiv funksjon har ingen kollisjoner. Ekte hashfunksjoner komprimerer og har derfor kollisjoner, men de er praktisk umulige å finne.</p>");
  hv(22, "<p>Et program du starter, får de samme nøklene som du har i lomma, ikke nøklene i safen du kunne bedt om.</p>",
    "<p>Skadevaren kjører med rettighetene til brukeren nilspw. Root krever at rettighetene heves eksplisitt.</p>",
    "<p>En prosess arver bruker-ID-en til brukeren som starter den (unntak: setuid-programmer). Sudo-retten er en mulighet til å heve rettigheter, ikke noe prosessen har fra start. Skadevare med brukerens rettigheter kan likevel lese, endre og kryptere alt brukeren eier, så minste privilegium for kontoen begrenser skaden.</p>");
  hv(23, "<p>Et brev skrevet bare til deg, med ting som passer på deg, er lettere å tro på.</p>",
    "<p>E-posten er tilpasset deg (navn, emne, dato, gruppetimer). Det er spyd-phishing.</p>",
    "<p>Spyd-phishing bruker rekognosering om mottakeren for å bygge tillit. Masse-phishing sendes likt til mange, whaling retter seg mot ledere, og klone-phishing kopierer en ekte e-post.</p>");
  hv(24, "<p>En orm kryper av seg selv, en trojansk hest har soldater inni, en bakdør er en hemmelig dør, og en bombe venter på klokka.</p>",
    "<p>Morris = orm, antivirus med skjult skadevare = trojaner, skjult passord = bakdør, angrep på en bestemt dato = logisk bombe.</p>",
    "<p>Typene skilles på spredning (orm: selv, virus: via vertsfil), forkledning (trojaner), tilgang (bakdør) og utløser (logisk bombe).</p>");
  hv(25, "<p>Noen skriver en kommando der det bare skulle stått et navn, og systemet adlyder.</p>",
    "<p>Apostrof og or = SQL-injeksjon. Skalloperator = kommandoinjeksjon. Skjuler prosesser = rootkit.</p>",
    "<p>Injeksjon oppstår når inndata blandes inn i kode (en SQL-spørring eller en skallkommando) uten å skilles fra den. Parameteriserte spørringer og å unngå skallet fjerner sårbarheten. Rootkit opererer ofte på kjernenivå for å skjule seg for verktøyene som skulle avsløre det.</p>");
  hv(26, "<p>Noen prøver nøkkel etter nøkkel i samme dør, flere i sekundet.</p>",
    "<p>Loggen viser automatisert passordgjetting mot admin-kontoen. Fasiten kaller det passordspraying.</p>",
    "<p>Mønsteret (én kilde, én konto, mange passord, høy hastighet) er et gjetteangrep mot innlogging. Ordet passordspraying brukes ellers, også på pentest-lysarket (d05), om ett passord mot mange kontoer, men fasiten bruker det her. Mottiltak: begrensning av forsøk, flerfaktor og overvåking.</p>");
  hv(27, "<p>Hvert ekstra siffer gir ti ganger flere koder å prøve. To siffer gir hundre ganger.</p>",
    "<p>10⁶ / 10⁴ = 100.</p>",
    "<p>Antall kandidater er N<sup>L</sup> for tegnsett N og lengde L. Arbeidet ved uttømmende søk vokser med N for hvert ekstra tegn, derfor er lengde den mest effektive måten å gjøre passord sterkere på.</p>");
  hv(28, "<p>Et kart over dørene, en ekstra beskjed lagt til på slutten, og et spørsmål som alltid svarer ja.</p>",
    "<p>nmap = kartlegging. Skalloperator = kommandoinjeksjon. Apostrof + or-betingelse = SQL-injeksjon.</p>",
    "<p>Felles kjennetegn på injeksjon er et tegn som bryter ut av datakonteksten. Om resten er gyldig SQL- eller skallsyntaks, avgjør bare om angrepet ville virket, ikke hvilken type det er.</p>");

  IN.PERFEKT["H2023-29"] = {
    type: "skjonn",
    svar: [
      { del: "Måte 1", tekst: "<p>Sudo-retten lar brukeren lese hvilken som helst fil som root. Da kan passordhashene leses og knekkes offline, og et knekt passord til en administratorkonto gir root.</p>", poeng: ["Lese passordhashene med sudo-retten (1p)", "Knekke dem offline og logge inn som root/administrator (1p)"] },
      { del: "Måte 2", tekst: "<p>Den samme retten gir tilgang til andres private filer, for eksempel private SSH-nøkler eller konfigurasjonsfiler med passord, som kan brukes til å logge inn som en mer privilegert bruker.</p>", poeng: ["Lese andres beskyttede filer (1p)", "Bruke hemmeligheten (nøkkel/passord) til å få høyere tilgang (1p)"] },
      { del: "(Pseudo)kode", tekst: "<p>Gir 1 p: en kommando som bruker sudo-retten til å lese den beskyttede passordfila. Vi gjengir den ikke her.</p>", poeng: ["Tilnærmet fungerende kode for sudo-delen (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>Du har fått lov til å bruke sjefens lesebriller. Med dem kan du lese alle lappene i sjefens skuff, også den med koden til safen.</p>",
      normal: "<p>Å gi sudo for et program som leser filer, gir i praksis lesetilgang til hele systemet. Passordhasher og private nøkler blir tilgjengelige, og de kan brukes til å bli root. Riktig oppsett er minste privilegium: aldri sudo for generelle verktøy.</p>",
      teknisk: "<p>Sudo kjører programmet med root sin bruker-ID, så filrettighetene som skal beskytte hashfila og andres hjemmekataloger, gjelder ikke lenger. Hashene kan knekkes offline uten at systemet merker gjetningene. Mange tilsynelatende harmløse programmer gir slik makt når de kjøres med sudo. Forsvar: begrens sudo til spesifikke kommandoer med faste argumenter, bruk sterke saltede hasher og lange passord, og overvåk bruk av sudo.</p>"
    },
    sensor: {
      deler: [
        { del: "Modellsvar", fasit: "<p>Modellsvaret (i rødt i svarfeltet), beskrevet med ord: bruke sudo-rettigheten til å lese passordhashene (og passordfila) og knekke dem offline; alternativt lese alle andres filer. Ordrett, uten kommandolinjene:</p><p>«Det finnes flere måter dette kan gjøres på – det mest elegante er å laste ned passordhashene og knekke disse.» [Her følger en kommandolinje som med sudo kopierer skyggefila og tilsvarende passordfila til en midlertidig katalog.] «Du kan deretter knekke passordene (disse kommandoene trengs ikke å være med i besvareksen).» [Her følger to kommandolinjer for å slå sammen filene og knekke dem med John the Ripper.] «Du kan også lese alle andres filer - og eksempelvis finne passord eller ssh-nøkler»</p>", kriterier: "<p>Fra oppgaveteksten: «Hver måte (tekst) gir 2 poeng, men det er mulig å oppnå totalt 5 poeng hvis du skriver en tilnærmet fungerende kode (pseudokode) for å gjennomføre ett av angrepene (altså den delen av angrepet som krever sudo).»</p>" }
      ],
      merknad: "Modellsvaret har ingen poengfordeling utover oppgaveteksten. «besvareksen» [sic]. Kommandolinjene er beskrevet med ord. I knekkesteget i modellsvaret er rekkefølgen på de to filene snudd."
    }
  };

  hv(30, "<p>Håndtrykket lager den hemmelige koden. Begge låsene beskytter innholdet. HSTS nekter å gå ulåst. Internettleverandøren ser bare at du går inn i en tunnel. OWASP lister de vanligste svakhetene i nettsider.</p>",
    "<p>Handshake etablerer øktnøkkelen, TLS og IPsec krypterer begge applikasjonsdata, HSTS hindrer TLS-stripping, ISP ser bare VPN-tilkoblingen, OWASP Top 10 rangerer webrisiko.</p>",
    "<p>TLS Handshake (applikasjonslaget i kursets konvensjon) gjør nøkkelutveksling og tjenerautentisering. Record (transportlaget) krypterer. IPsec ESP krypterer hele IP-nyttelasten. HSTS er en HTTP-header som tvinger HTTPS for domenet, men beskytter ikke første besøk uten preload.</p>");
  hv(31, "<p>Én vakt har et album med kjente tyver, en annen merker når noe er rart. En kjent tyv kan fanges av begge.</p>",
    "<p>Anomalibasert bruker ofte maskinlæring. En kjent, upatchet sårbarhet kan fanges av begge typer. Regelen gjelder HTTPS fra 1.2.3.4 til 5.6.7.8.</p>",
    "<p>Signaturbasert IDS har få falske alarmer men ser bare kjente mønstre. Anomalibasert kan se nye angrep, men gir flere falske alarmer. En Snort-regel leses: handling, protokoll, kilde-IP, kildeport, retning, mål-IP, målport, deretter valg i parentes.</p>");

  IN.PERFEKT["H2023-32"] = {
    type: "eksamen",
    svar: [
      { del: "", tekst: "<p>Én regel lagt til i kjeden for videresendt trafikk (FORWARD), som godtar (ACCEPT) TCP-trafikk med kilde 1.2.3.1 og mål 5.6.7.1 på destinasjonsport 1433. Alt annet er allerede blokkert.</p>", poeng: ["Riktig kjede, kilde, mål, protokoll, destinasjonsport og handling (2p)", "Brannmurprogrammet og minst to riktige argumenter (1p)"] }
    ],
    hvorfor: {
      eli5: "<p>Vakten mellom to rom får en lapp: «Slipp gjennom bud fra webrommet til databasedøra nummer 1433, ingen andre.»</p>",
      normal: "<p>Brannmuren står mellom segmentene, så trafikken videresendes gjennom den. Regelen må ligge i FORWARD-kjeden og være så smal som mulig: én kilde, ett mål, én protokoll og én port.</p>",
      teknisk: "<p>INPUT og OUTPUT gjelder trafikk til og fra brannmuren selv. FORWARD gjelder trafikk som rutes gjennom den. Siden brannmuren ifølge oppgaven allerede blokkerer alt annet (policy DROP her; iptables’ egen standard er implisitt ACCEPT, d09), holder det med én ACCEPT-regel. Portfilteret krever at protokollen er oppgitt. Blokkerer brannmuren også trafikk ut, må svartrafikken fra databasen slippes tilbake, vanligvis med en tilstandsbasert regel for etablerte forbindelser, men oppgaven spør ikke om det.</p>"
    },
    sensor: {
      deler: [
        { del: "", fasit: "<p>Modellsvaret, beskrevet med ord: én regel lagt til i FORWARD-kjeden som tillater (ACCEPT) trafikk fra 1.2.3.1 til 5.6.7.1 på destinasjonsport 1433.</p>", kriterier: "<p>«Rekkefølge kan ignoreres her. For 1 poeng så forventes minst \"iptables\" og 2 riktige argumenter.»</p>" }
      ],
      merknad: "Modellsvaret mangler protokollangivelse. Portfilteret virker bare når protokollen (TCP) er oppgitt, så et fullstendig svar bør ha den med."
    }
  };

  hv(33, "<p>Hver nettside får sin egen nøkkel som bare passer der. På en falsk side passer den rett og slett ikke.</p>",
    "<p>Passnøkkelen er en privat nøkkel per domene. Den låses opp lokalt og brukes online. Den kan synkroniseres, og det er ingen advarsel å ignorere.</p>",
    "<p>FIDO2/WebAuthn knytter nøkkelparet til tjenerens domene (RP-ID). Nettleseren sjekker domenet før enheten signerer utfordringen, så phishingresistensen er teknisk, ikke avhengig av brukeren.</p>");
  hv(34, "<p>Du er «Kari, student» på universitetet og «Kari, kunde» i banken. To identiteter, samme person.</p>",
    "<p>Identitet er et sett attributter. Silo kan ha flerfaktor. Føderering betyr ikke alltid distribuert identitet eller autentisering.</p>",
    "<p>Et identitetsdomene er der identifikatorene er unike. En føderasjon kan ha sentralisert identitet og distribuert autentisering (som ID-porten) eller omvendt. Påstander med «alltid» er derfor feil.</p>");
  hv(35, "<p>Du ber en app redigere bildene dine. Appen spør vakten, vakten spør deg, du sier ja, appen får et adgangskort og viser det til bildearkivet.</p>",
    "<p>Rekkefølgen: forespørsel, videresending, samtykkespørsmål, godkjenning, token, bruk av token, tilgang.</p>",
    "<p>OAuth delegerer tilgang uten å dele passordet: autoriseringstjeneren autentiserer ressurseieren og utsteder et tilgangstoken med begrenset omfang. Ressurstjeneren validerer tokenet. OAuth gir autorisering, OIDC legger til autentisering.</p>");
  hv(36, "<p>Fire bøker i samme serie: ordboka, regelboka, oppskriftsboka og risikoboka.</p>",
    "<p>27000 oversikt, 27001 krav til ISMS, 27002 tiltaksbank, 27005 risikostyring.</p>",
    "<p>27001 er den normative kravstandarden med vedlegg A som peker til tiltakene i 27002. 27005 utdyper risikostyringen som 27001 krever.</p>");
  hv(37, "<p>To gratis oppskriftsbøker, én norsk og én amerikansk, som begge passer med den store ISO-boka.</p>",
    "<p>Begge kategoriserer etter prosesser og kan brukes med 27001. Ingen må kjøpes. Bare NSM er på norsk.</p>",
    "<p>NSM: 4 kategorier, 21 prinsipper, 118 tiltak. NIST CSF 2.0: 6 funksjoner med GOVERN. Begge er gratis tiltaksbanker som kan inngå i et ISMS etter ISO 27001.</p>");
  hv(38, "<p>Bestem rammene, finn og vurder risikoene, lag en plan og gjennomfør den. Er noe ikke bra nok, gå tilbake.</p>",
    "<p>Kontekstetablering (med risikoeier), risikovurdering (med risikoanalyse), risikohåndteringsplan (med aksept), implementering av tiltak.</p>",
    "<p>Prosessen følger ISO 27005. Beslutningspunkt 1 spør om vurderingen er god nok, beslutningspunkt 2 om restrisikoen kan aksepteres. Nei sender deg tilbake til et tidligere trinn.</p>");
  hv(39, "<p>Du kan sikre deg, forsikre deg, eller leve med det. Å viske ut tallet på termometeret hjelper ikke mot feberen.</p>",
    "<p>Redusere, dele og akseptere er gyldig. Å endre risikotabellen er det ikke.</p>",
    "<p>Risikohåndtering velger mellom redusere, unngå, dele/overføre og akseptere. Risikotabellen er målestokken. Endres den for å få pene tall, er risikoen den samme, bare dårligere beskrevet.</p>");
})();
