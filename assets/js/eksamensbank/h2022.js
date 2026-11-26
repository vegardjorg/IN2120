/* IN2120 · eksamensbank H2022. Kilde: UiO, IN2120 eksamen H2022 (Inspera-utskrift med rettenøkkel og
   retteinstrukser, behandlet som sensorveiledning). Oppgavetekst og fasit ordrett.
   Våre forklaringer (explain/losning/tips/hvorfor/svar) med egne ord. */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var BANK = (window.IN_EXAM_BANK = window.IN_EXAM_BANK || {});
  IN.PERFEKT = IN.PERFEKT || {};

  var D1 = "Del 1: Generelt",
    D2 = "Del 2: Systemsikkerhet",
    D3 = "Del 3: Angrepsvektorer og skadevare",
    D4 = "Del 4: Innebygd informasjonssikkerhet og pentesting",
    D5 = "Del 5: Kryptografi",
    D6 = "Del 6: Nøkkelhåndtering og PKI",
    D7 = "Del 7: Nettverkssikkerhet",
    D8 = "Del 8: Brukerautentisering",
    D9 = "Del 9: Identitets- og tilgangshåndtering",
    D10 = "Del 10: Risikostyring";

  var OWASP = ["1. Brudd på tilgangskontroll", "2. Kryptografiske feil", "3. Injeksjon", "4. Usikkert design",
    "5. Feilkonfigurert sikkerhet", "6. Sårbare og utdaterte komponenter", "7. Feil i identifisering og autentisering",
    "8. Feil i (data og programvare) integritet", "9. Utilstrekkelig logging og overvåking"];

  BANK["H2022"] = {
    year: "H2022", dato: "9.12.2022", varighet: "4 timer", hjelpemidler: "Ingen",
    forside:
      "<p><strong>Informasjon om eksamen</strong></p>" +
      "<p>Avsluttende eksamen i IN2120 Informasjonssikkerhet (Høst 2022).</p>" +
      "<p>Dato og tidspunkt: 9. desember 2022, kl.15:00 - 19:00 (4 timer).</p>" +
      "<p>Ingen hjelpemidler er tillatt.</p>" +
      "<p>Merk følgende:</p><ul>" +
      "<li>Oppgavene i denne eksamen er gruppert under 10 deler som tilsvarer omtrent 10 av forelesningene i dette emnet.</li>" +
      "<li>Det er mulig å oppnå 10 poeng for hver del, totalt 100 poeng (= 100%).</li>" +
      "<li>Man kan navigere frem og tilbake mellom oppgavene.</li>" +
      "<li>Skåring for hver oppgave angis eksplisitt. Det kan gis negative poeng for feil svar/valg, men total poengsum for hele oppgaven er minimum 0 (selv om summen over alle svarene er negativ).</li>" +
      "<li>Vær kortfattet når du skriver tekst som svar på en tekstoppgave. Svaret kan skrives på norsk eller engelsk.</li>" +
      "<li>I navigasjonslinjen nederst på skjermen indikeres fullførte oppgaver med blå søyler.</li></ul>" +
      "<p>Lykke til!</p>",
    deler: [
      { navn: D1, poeng: 10 }, { navn: D2, poeng: 10 }, { navn: D3, poeng: 10 }, { navn: D4, poeng: 10 },
      { navn: D5, poeng: 10 }, { navn: D6, poeng: 10 }, { navn: D7, poeng: 10 }, { navn: D8, poeng: 10 },
      { navn: D9, poeng: 10 }, { navn: D10, poeng: 10 }
    ],
    merknad: "Maks poeng summerer til 100 (10 per del). I tre oppgaver (7.3, 9.2, 10.1) stemmer ikke poeng per enhet ganget med antall riktige enheter med «Maks poeng». Se avvik i hver av dem.",
    oppgaver: [

      /* ================= DEL 1 ================= */
      {
        key: "H2022-1.1", year: "H2022", oppgave_nr: "Oppgave 1.1", del: D1,
        ark: "1.1 Sikkerhetsmålsettinger", title: "Hvilket KIT-mål brytes av angrepet?",
        points: 3, block: "generelt", tema: ["KIT", "sikkerhetsmål", "angrep"],
        gjenganger: ["H2021-1.1", "H2023-3", "H2024-3", "H2025-2"], ordrett: true,
        oppgave: "<p>Indiker hvilken sikkerhetsmålsetting som typisk brytes som resultat av hvert angrep.<br>Poeng: 0,5 for hver riktig, -0,5 for for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.</p><p><strong>Finn de som passer sammen:</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
          kolonner: ["Integritet", "Tilgjengelighet", "Konfidensialitet"], multi: false,
          rader: [
            { s: "Vandalisering av nettside", svar: [0], explain: "<p>Innholdet på siden blir endret uten lov. Det er et brudd på integriteten.</p>" },
            { s: "Løsepenge/krypto-virus", svar: [1], explain: "<p>Dataene blir låst inne, så eieren ikke får brukt dem. Det rammer tilgjengeligheten. Krypteringen gjør ikke at noen andre får lese dataene.</p>" },
            { s: "Keylogger/tastaturlogger", svar: [2], explain: "<p>Programmet fanger opp det du skriver, også passord, og gir det til angriperen. Hemmelig informasjon lekker, altså konfidensialitet.</p>" },
            { s: "Kryptoanalyse", svar: [2], explain: "<p>Målet med kryptoanalyse er å finne klarteksten eller nøkkelen uten å ha lov. Lykkes det, kan hemmelige data leses, og det bryter konfidensialiteten.</p>" },
            { s: "DDoS-angrep", svar: [1], explain: "<p>Tjenesten oversvømmes av trafikk og blir utilgjengelig for vanlige brukere. Det rammer tilgjengeligheten.</p>" },
            { s: "Passordcracking", svar: [2], explain: "<p>Noen finner passord de ikke skal kjenne. En hemmelighet blir kjent, så konfidensialiteten er brutt.</p>" }
          ]
        },
        avvik: null,
        losning: ["Spør for hver rad: blir noe lest (K), endret (I) eller gjort utilgjengelig (T)?",
          "Vandalisering endrer. Løsepengevirus og DDoS gjør utilgjengelig. De tre andre avslører hemmeligheter."],
        tips: ["Løsepengevirus er T, ikke K. Krypteringen låser data, den lekker dem ikke.", "Ett mål per rad her, selv om flere kan rammes i praksis. Velg det typiske."]
      },
      {
        key: "H2022-1.2", year: "H2022", oppgave_nr: "Oppgave 1.2", del: D1,
        ark: "1.2 Begreper", title: "Risikobegreper: verdi, trussel, sårbarhet …",
        points: 3, block: "risiko", tema: ["risikobegreper", "verdi", "trussel", "sårbarhet", "hendelse"],
        gjenganger: ["H2021-1.2"], ordrett: true,
        oppgave: "<p>For hver beskrivelse, angi hvilket begrep som representerer beskrivelsen, ved å velge blant begrepene Hendelse, Konsekvens, Risiko, Sårbarhet, Trussel, Verdi, og Risiko,. Poeng: 0,5 for hver riktig, -0,5 for for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.</p><p><strong>Angi riktig sikkerhetsbegrep:</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
          kolonner: ["Risiko", "Konsekvens", "Sårbarhet", "Hendelse", "Trussel", "Verdi"], multi: false,
          rader: [
            { s: "Har krav om konfidensialitet, integritet, og/eller tilgjengelighet", svar: [5], explain: "<p>Noe som skal beskyttes fordi det har krav til K, I eller T, er en verdi.</p>" },
            { s: "Brudd på konfidensialitet, integritet og/eller tilgjengelighet", svar: [3], explain: "<p>Når et av KIT-målene faktisk blir brutt, har det skjedd en (sikkerhets)hendelse.</p>" },
            { s: "Tapt omsetning som følge av et cyberangrep", svar: [1], explain: "<p>Tapet er det hendelsen fører til. Det er konsekvensen.</p>" },
            { s: "Skadelig aktivitet som kan utnytte sårbarheter og forårsake en sikkerhetshendelse", svar: [4], explain: "<p>En trussel er den mulige skadelige aktiviteten som kan utnytte en svakhet.</p>" },
            { s: "At en type angrep ikke kan forhindres", svar: [2], explain: "<p>En svakhet som gjør at et angrep ikke kan stoppes, er en sårbarhet.</p>" },
            { s: "Kombinasjon av trussel, sårbarheter og verdier", svar: [0], explain: "<p>Kurset beskriver risiko som en relevant kombinasjon av trussel, sårbarheter og verdier. Sannsynlighet og konsekvens brukes til å måle risikonivået.</p>" }
          ]
        },
        avvik: "Oppgaveteksten lister «Risiko» to ganger («… Verdi, og Risiko,»), skrivefeil i arket. Det er seks begreper.",
        losning: ["Verdi = det som har KIT-krav. Trussel = det som kan skje. Sårbarhet = svakheten. Hendelse = bruddet. Konsekvens = følgen. Risiko = kombinasjonen."],
        tips: ["Ikke bland risiko og risikonivå: risiko er kombinasjonen, nivået måles med sannsynlighet og konsekvens."]
      },
      {
        key: "H2022-1.3", year: "H2022", oppgave_nr: "Oppgave 1.3", del: D1,
        ark: "1.3 Identitets- og tilgangshåndtering", title: "IAM-trinn i hvert begrep",
        points: 4, block: "iam", tema: ["IAM", "konfigureringsfase", "bruksfase", "autorisering", "tilgangskontroll"],
        gjenganger: ["H2021-1.3", "H2023-14"], ordrett: true,
        oppgave: "<p>Identitets- og tilgangshåndtering (IAM: Identity and Access Management) består av trinn.<br>For hvert begrep nedenfor, indiker alle IAM-trinn begrepet består av.<br>Poeng: 0,2 poeng for hver riktig, -0,2 for hver feil, 0 for ubesvart, 4 for alle riktig, minimum 0.<br>Skåring for hvert begrep er minst 0 poeng.</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,2 poeng for hver riktig, -0,2 for hver feil, 0 for ubesvart, 4 for alle riktig, minimum 0. Skåring for hvert begrep er minst 0 poeng.",
          regel: { riktig: 0.2, feil: -0.2, blankt: 0, min: 0, maks: 4, minPerRad: 0 },
          regelMerknad: "I Inspera er dette seks grupper med avkrysningsbokser («Velg ett eller flere trinn»), én per begrep (FF-type). Hver avkrysset boks er en enhet: 20 riktige bokser × 0,2 = 4. Minimum 0 gjelder både per begrep (rad) og for hele oppgaven.",
          kolonner: ["Registrer", "Klargjør", "Autoriser", "Gi bruker-ID", "Gi autentikator", "Tilgangskontroll"], multi: true,
          rader: [
            { s: "Brukerautentisering", svar: [3, 4], explain: "<p>Ved innlogging oppgir brukeren bruker-ID og autentikator, og systemet sjekker dem. Det er brukerautentisering i bruksfasen.</p>" },
            { s: "Identitetshåndtering", svar: [0, 1, 3, 4], explain: "<p>Identitetsdelen går gjennom begge faser: registrering og klargjøring av autentikator i konfigureringsfasen, og å oppgi bruker-ID og autentikator i bruksfasen.</p>" },
            { s: "Tilgangshåndtering", svar: [2, 5], explain: "<p>Tilgangsdelen er autorisering (spesifisere hva brukeren får lov til) og tilgangskontroll (håndheve det ved hver forespørsel).</p>" },
            { s: "Konfigureringsfasen", svar: [0, 1, 2], explain: "<p>Alt som settes opp på forhånd: registrere brukeren, klargjøre autentikatoren og autorisere tilgang.</p>" },
            { s: "Bruksfasen", svar: [3, 4, 5], explain: "<p>Det som skjer hver gang brukeren vil inn: oppgi ID, oppgi autentikator, og så tilgangskontroll.</p>" },
            { s: "IAM", svar: [0, 1, 2, 3, 4, 5], explain: "<p>IAM er helheten, så alle seks trinnene hører med.</p>" }
          ]
        },
        avvik: null,
        losning: ["Tegn IAM-figuren: konfigureringsfase (registrer, klargjør, autoriser) og bruksfase (gi bruker-ID, gi autentikator, tilgangskontroll).",
          "Del den på tvers: identitetshåndtering er de fire identitetstrinnene, tilgangshåndtering er autoriser + tilgangskontroll.",
          "Brukerautentisering = de to «gi»-trinnene i bruksfasen. IAM = alle seks."],
        tips: ["Autorisering = å spesifisere policy (konfigureringsfasen). Tilgangskontroll = å håndheve den (bruksfasen).", "Minimum 0 per begrep: et feilkryss koster bare innenfor sin egen rad."]
      },

      /* ================= DEL 2 ================= */
      {
        key: "H2022-2.1", year: "H2022", oppgave_nr: "Oppgave 2.1", del: D2,
        ark: "2.1 Filer, prosess , CPU og minnet", title: "Fra kjørbar fil til prosess",
        points: 2, block: "system", tema: ["prosess", "kjørbar fil", "minne", "CPU"], ordrett: true,
        oppgave: "<p>Velg riktig ord i hvert utsagn nedenfor.<br>Poeng 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "N",
          regelTekst: "Poeng 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          tekst: "<p>En {0} inneholder instruksjoner som vill bli utført av CPU når filen kjøres.<br>Når den startes opprettes en {1}.<br>Da vil en del av {2} allokeres, relevante deler vil lastes inn i det, og instruksjoner den inneholder vil kjøres i {3}.</p>",
          felt: [
            { etikett: "Felt 1", valg: ["kjørbar fil", "minneadresse", "prosess", "CPU"], svar: 0, godta: [], explain: "<p>Det er den kjørbare fila som lagrer instruksjonene på disken.</p>" },
            { etikett: "Felt 2", valg: ["prosess", "CPU", "kjørbar fil"], svar: 0, godta: [], explain: "<p>Når programmet startes, lager operativsystemet en prosess, altså et program som kjører.</p>" },
            { etikett: "Felt 3", valg: ["kjørbar fil", "CPU", "prosess", "minnet"], svar: 3, godta: [], explain: "<p>Prosessen får sitt eget område i minnet, og koden og dataene lastes inn der.</p>" },
            { etikett: "Felt 4", valg: ["prosess", "CPU", "kjørbar fil", "minnet"], svar: 1, godta: [], explain: "<p>Instruksjonene utføres av prosessoren, CPU-en.</p>" }
          ]
        },
        avvik: null,
        losning: ["Fil på disk → startes → blir prosess → får minne → CPU utfører instruksjonene."],
        tips: ["Les setningene som en historie i tid. Hvert felt er neste steg."]
      },
      {
        key: "H2022-2.2", year: "H2022", oppgave_nr: "Oppgave 2.2", del: D2,
        ark: "2.2 Prosesser og minnet", title: "Virtuelt minne: sant eller usant",
        points: 1, block: "system", tema: ["virtuelt minne", "bufferoverflyt"], ordrett: true,
        oppgave: "<p>Indiker om utsagnene nedenfor er sanne eller usanne.<br>Poen 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 1 for begge riktig, minimum 0.</p>",
        inspera: {
          type: "F1",
          regelTekst: "Poen 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 1 for begge riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 1 },
          sporsmal: [
            { tekst: "To prosesser kan <strong>ikke</strong> ha samme virtuelle minneadresse.", alternativer: ["Usant", "Sant"], svar: 0,
              explain: ["<p>Riktig. Hver prosess har sitt eget virtuelle adresserom, så to prosesser kan godt bruke samme virtuelle adresse. Operativsystemet kobler dem til ulike fysiske adresser.</p>", "<p>Nei. Nettopp fordi adresserommene er separate, kan samme virtuelle adresse brukes i flere prosesser.</p>"] },
            { tekst: "Virtuelle minneområder fjerner buffer-overflow sårbarheten", alternativer: ["Usant", "Sant"], svar: 0,
              explain: ["<p>Riktig. Virtuelt minne skiller prosesser fra hverandre, men en bufferoverflyt skjer inne i én prosess. Feilen i koden er der fortsatt.</p>", "<p>Nei. Isolasjon mellom prosesser retter ikke en programmeringsfeil inne i en prosess.</p>"] }
          ]
        },
        avvik: null,
        losning: ["Virtuelt minne gir hver prosess sitt eget «kart». Samme adresse i to kart peker til ulike steder.", "Bufferoverflyt skjer innenfor ett kart, så isolasjonen hjelper ikke."],
        tips: ["Ord som «fjerner» og «forhindrer» i påstander om tiltak mot bufferoverflyt er nesten alltid feil."]
      },
      {
        key: "H2022-2.3", year: "H2022", oppgave_nr: "Oppgave 2.3", del: D2,
        ark: "2.3 Buffer overflow", title: "Bufferoverflyt: hvilken del av stakken?",
        points: 1, block: "system", tema: ["bufferoverflyt", "stakk", "returadresse"], ordrett: true,
        oppgave: "<p>I en prosess som kjører har følgende skjedd:</p><ul><li>Prosessen starter med å kjøre <strong>main()</strong> metoden, og det opprettes en ramme på stakken i minnet for den.</li><li>I <strong>main()</strong>-metoden gjøres det et kall til en metode kalt <strong>A()</strong> som starter og det opprettes en ny ramme for <strong>A()</strong> på toppen av stakken.</li><li>I <strong>A()</strong>-metoden gjøres det et kall til en metode <strong>B()</strong> og det opprettes en ny ramme for <strong>B()</strong> på toppen av stakken.</li></ul><p><strong>B()</strong> metoden inneholder et array kalt <strong>buffer</strong> som har plass til 10 elementer.<br>Diagrammet nedenfor viser hvordan stakken ser ut når metode <strong>B()</strong> kjører. Programmet har en bufferoverflow-sårbarhet som kan utnyttes gjennom å overskrive <strong>buffer,</strong> og angrepskoden som angriperen ønsker å kjøre ligger et annet sted i minnet. Klikk på den delen av minnet i figuren som angriper må overskrive  for å få kjørt angrepskoden.<br>Poeng: 1 for riktig, 0 for feil.</p><p><strong>Klikk på delen av bildet som man ønsker å overskrive for å få kjørt angrepskoden.</strong></p>",
        figur: {
          beskrivelse: "Stakkdiagram. Til venstre står «Høy adresse» øverst og «Lav adresse» nederst. En stor oransje boks med overskriften «STACK» inneholder tre lyseblå rammer under hverandre: «main() ramme» øverst, «A() ramme» i midten og «B() ramme» nederst. Inne i B()-rammen står tre felt fra topp til bunn: «Returadresse», «Forrige rammepeker» og et felt med «buffer[9]», «…», «buffer[0]». Til høyre for bufferfeltet går en pil oppover med teksten «Skriver oppover». Under den oransje boksen er en hvit boks «ledig minne», med en oransje pil fra stakken ned mot den.",
          tekst: ["Høy adresse", "STACK", "main() ramme", "A() ramme", "B() ramme", "Returadresse", "Forrige rammepeker", "buffer[9]", "…", "buffer[0]", "Skriver oppover", "Lav adresse", "ledig minne"]
        },
        inspera: {
          type: "H",
          regelTekst: "Poeng: 1 for riktig, 0 for feil.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Returadresse", "Forrige rammepeker", "buffer[9] … buffer[0]", "main() ramme", "A() ramme", "ledig minne"],
          svar: 0,
          explain: [
            "<p>Riktig. Returadressen bestemmer hvor programmet fortsetter når B() er ferdig. Derfor er den det kritiske feltet å beskytte.</p>",
            "<p>Rammepekeren ligger på veien, men den styrer ikke hvor programmet fortsetter etter B().</p>",
            "<p>Bufferet er der dataene skrives inn. Det er startpunktet, ikke det kritiske feltet.</p>",
            "<p>main()-rammen ligger mye lenger opp og er ikke det som styrer returen fra B().</p>",
            "<p>A()-rammen ligger over B(). Det er returadressen i B()-rammen som brukes først.</p>",
            "<p>Ledig minne ligger under stakken. Bufferet skriver oppover, bort fra dette området.</p>"
          ]
        },
        avvik: null,
        losning: ["Bufferet fylles nedenfra og opp, mot høyere adresser.", "Skrives det for mye, går det ut over feltene som ligger over: først forrige rammepeker, så returadressen.", "Returadressen styrer hvor programmet fortsetter når B() er ferdig. Den er det kritiske feltet."],
        tips: ["Tiltak som stakk-kanarifugl, NX og ASLR finnes nettopp for å beskytte returadressen og gjøre utnyttelse vanskeligere. De retter ikke selve feilen."]
      },
      {
        key: "H2022-2.4", year: "H2022", oppgave_nr: "Oppgave 2.4", del: D2,
        ark: "2.4 Virtualisering", title: "Type 1-virtualisering: lagene",
        points: 2, block: "system", tema: ["virtualisering", "hypervisor", "type 1"], ordrett: true,
        oppgave: "<p>Her brukes type 1 (native) virtualisering. Vis arkitekturen ved å dra de rette elementene til rett plass.<br>Poeng: 0,5 for hver riktig, -0,5 for hver feil, 2 for alle riktig, minimum 0.</p>",
        figur: {
          beskrivelse: "Fire fargede felt stablet loddrett (ett element skal dras inn i hvert): øverst turkis, så gult, så lilla/grått, nederst mørk rosa. Over figuren ligger seks dra-bokser i to rader: «Kontainer», «Hypervisor», «Gjeste-OS» / «Maskinvare», «App», «Docker Engine». To av dem er distraktorer.",
          tekst: ["Kontainer", "Hypervisor", "Gjeste-OS", "Maskinvare", "App", "Docker Engine"]
        },
        inspera: {
          type: "D",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for hver feil, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          regelMerknad: "Poenglinja nevner ikke ubesvart; vi antar 0.",
          tekst: null,
          bank: ["Kontainer", "Hypervisor", "Gjeste-OS", "Maskinvare", "App", "Docker Engine"],
          felt: [
            { etikett: "Øverste lag (turkis)", svar: 4, godta: [], explain: "<p>Øverst kjører applikasjonene.</p>" },
            { etikett: "Lag 2 (gult)", svar: 2, godta: [], explain: "<p>Hver virtuell maskin har sitt eget gjeste-OS.</p>" },
            { etikett: "Lag 3 (lilla)", svar: 1, godta: [], explain: "<p>I type 1 ligger hypervisoren rett på maskinvaren, uten vert-OS imellom.</p>" },
            { etikett: "Nederste lag (rosa)", svar: 3, godta: [], explain: "<p>Nederst er den fysiske maskinvaren.</p>" }
          ]
        },
        avvik: null,
        losning: ["Type 1 («bare metal»): Maskinvare → Hypervisor → Gjeste-OS → App.", "Kontainer og Docker Engine hører til neste oppgave og er distraktorer her."],
        tips: ["Type 1 har ikke vert-OS. Type 2 har vert-OS under hypervisoren."]
      },
      {
        key: "H2022-2.5", year: "H2022", oppgave_nr: "Oppgave 2.5", del: D2,
        ark: "2.5 Kontainer", title: "Kontainerarkitektur: lagene",
        points: 2, block: "system", tema: ["kontainer", "Docker", "vert-OS"], ordrett: true,
        oppgave: "<p>Her brukes kontainer (Docker Engine). Vis arkitekturen ved å dra de rette elementene til rett plass.<br>Poeng: 0,5 poeng for hver riktig, -0,5 for hver feil, 2 for alle riktig, minimum 0.</p>",
        figur: {
          beskrivelse: "Fire fargede felt stablet loddrett: øverst turkis, så lilla/grått, så gult, nederst mørk rosa. Over figuren ligger fire dra-bokser: «Vert-OS», «Maskinvare», «Kontainer» / «Docker Engine».",
          tekst: ["Vert-OS", "Maskinvare", "Kontainer", "Docker Engine"]
        },
        inspera: {
          type: "D",
          regelTekst: "Poeng: 0,5 poeng for hver riktig, -0,5 for hver feil, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          regelMerknad: "Poenglinja nevner ikke ubesvart; vi antar 0.",
          tekst: null,
          bank: ["Vert-OS", "Maskinvare", "Kontainer", "Docker Engine"],
          felt: [
            { etikett: "Øverste lag (turkis)", svar: 2, godta: [], explain: "<p>Øverst kjører kontainerne med appen og det den trenger.</p>" },
            { etikett: "Lag 2 (lilla)", svar: 3, godta: [], explain: "<p>Docker Engine starter og styrer kontainerne.</p>" },
            { etikett: "Lag 3 (gult)", svar: 0, godta: [], explain: "<p>Alle kontainerne deler ett vert-OS (samme kjerne).</p>" },
            { etikett: "Nederste lag (rosa)", svar: 1, godta: [], explain: "<p>Nederst er maskinvaren.</p>" }
          ]
        },
        avvik: null,
        losning: ["Maskinvare → Vert-OS → Docker Engine → Kontainer."],
        tips: ["Kontainere har ikke eget gjeste-OS. De deler kjernen til vert-OS-et, og derfor er isolasjonen svakere enn med virtuelle maskiner."]
      },
      {
        key: "H2022-2.6", year: "H2022", oppgave_nr: "Oppgave 2.6", del: D2,
        ark: "2.6 Sikker oppstart", title: "TPM eller UEFI?",
        points: 2, block: "system", tema: ["TPM", "UEFI", "sikker oppstart", "tiltrodd beregning"], ordrett: true,
        oppgave: "<p>Tema i denne oppgaven er sikker oppstart. Velg riktig svar for hvert utsagn.<br>Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.<br><strong>Finn de som passer sammen. \"Bare TPM\" betyr at det er sant for TPM men ikke UEFI. \"Bare UEFI\" betyr at det er sant for UEFI men ikke TPM. \"Begge\" betyr at det er sant for både TPM og UEFI, mens \"Ingen\" betyr at det hverken er sant for TPM eller UEFI.</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          kolonner: ["Begge", "Bare TPM", "Ingen", "Bare UEFI"], multi: false,
          rader: [
            { s: "Tillitskjede basert på sertifikat i firmware", svar: [3], explain: "<p>UEFI sjekker digitale signaturer på hvert steg i oppstarten med nøkler/sertifikater lagret i firmware. Slik bygges en tillitskjede.</p>" },
            { s: "Kan brukes til å støtte autentisering", svar: [1], explain: "<p>TPM er en sikkerhetsbrikke som kan lagre nøkler og utføre kryptooperasjoner, f.eks. for å bevise maskinens identitet eller beskytte innloggingsnøkler.</p>" },
            { s: "Erstatter BIOS", svar: [3], explain: "<p>UEFI er etterfølgeren til BIOS og styrer oppstarten i moderne maskiner.</p>" },
            { s: "Kan brukes for å bedre sikkerhet ved oppstart", svar: [0], explain: "<p>Begge brukes i tiltrodd beregning: UEFI sjekker signaturer, og TPM kan måle og lagre hva som ble startet.</p>" }
          ]
        },
        avvik: null,
        losning: ["UEFI = firmware som starter maskinen og sjekker signaturer (erstatter BIOS).", "TPM = egen sikkerhetsbrikke for nøkler og målinger.", "Sikker oppstart bruker begge."],
        tips: ["UEFI er programvare i firmware. TPM er maskinvare (en brikke)."]
      },

      /* ================= DEL 3 ================= */
      {
        key: "H2022-3.1", year: "H2022", oppgave_nr: "Oppgave 3.1", del: D3,
        ark: "3.1 Tilgang for skadevare", title: "Skadevare med UAC av",
        points: 1, block: "angrep", tema: ["skadevare", "UAC", "rettigheter"], gjenganger: ["H2023-22"], ordrett: true,
        oppgave: "<p>Du kjører uheldigvis skadevare på maskinen din med din administratorbruker.  Du har slått av UAC (User Account Control) på maskinen din – Hvilke rettigheter får skadevaren da?<br>Poeng: 1 for riktig, 0 for feil eller ubesvart.</p><p><strong>Velg ett alternativ:</strong></p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 for riktig, 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Administrator", "Power user", "Bruker", "Gjest"],
          svar: 0,
          explain: [
            "<p>Riktig. Et program kjører med rettighetene til brukeren som starter det. Uten UAC er det ingen sperre som holder administratorrettighetene tilbake.</p>",
            "<p>Nei. Programmet får ikke et mellomnivå. Det arver brukerens fulle rettigheter.</p>",
            "<p>Det ville vært nærmere svaret med UAC på: da kjører programmer med vanlige rettigheter til du godkjenner. Men UAC er slått av.</p>",
            "<p>Nei. Gjest er en egen, svært begrenset konto som ikke er brukt her.</p>"
          ]
        },
        avvik: null,
        losning: ["Programmer arver rettighetene til den som kjører dem.", "UAC er det som ellers ville krevd godkjenning først. Uten UAC: full administrator."],
        tips: ["Bruk vanlig brukerkonto til daglig. Da får skadevare færre rettigheter."]
      },
      {
        key: "H2022-3.2", year: "H2022", oppgave_nr: "Oppgave 3.2", del: D3,
        ark: "3.2 Phishing", title: "Hvilken type phishing (Netflix-e-post)?",
        points: 1, block: "angrep", tema: ["phishing", "masse-phishing"], gjenganger: ["H2021-2.1", "H2023-23", "H2024-20"], ordrett: true,
        oppgave: "<p>Hva slags phishing-angrep er dette? Se bildet under (zoom inn og ut ved å trykke Ctrl + (pluss) og Ctrl – (minus). Bruk + og – tastene på det numeriske tastaturet). PS: Jeg verken har, eller har noensinne hatt Netflix.<br>Poeng: 1 for riktig, 0 for feil eller ubesvart.</p><p><strong>Velg ett alternativ:</strong></p>",
        figur: {
          beskrivelse: "Skjermbilde av en norsk e-post som utgir seg for å være fra Netflix. Den starter med en generell hilsen til «kunde» (ikke mottakerens navn), sier at kontoinformasjonen kan mangle eller være feil og må oppdateres straks, og truer med at kontoen begrenses hvis det ikke skjer innen 24 timer. Så står «Bare klikk på URL-en nedenfor:» og en hilsen fra «Netflix-tjenester», deretter en stor rød knapp med teksten «Klikk her», og nederst en liten bunntekst med et telefonnummer og en kildekode.",
          tekst: ["Klikk her"]
        },
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 for riktig, 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Masse-phishing", "Klone-phishing", "Direktørsvindel (whaling)", "Spyd-phishing"],
          svar: 0,
          explain: [
            "<p>Riktig. E-posten er generell («kjære kunde»), og den kom til en som aldri har hatt Netflix. Den er sendt ut i stort antall i håp om at noen biter på.</p>",
            "<p>Klone-phishing er en kopi av en ekte e-post mottakeren faktisk har fått før. Mottakeren har aldri hatt Netflix, så det finnes ingen original.</p>",
            "<p>Whaling retter seg mot toppledere med skreddersydd innhold. Her er det ingenting om mottakerens rolle.</p>",
            "<p>Spyd-phishing er tilpasset én bestemt person, med navn og detaljer. Denne e-posten er helt generell.</p>"
          ]
        },
        avvik: null,
        losning: ["Se etter tegn på tilpasning: navn, rolle, tidligere e-post. Ingen finnes.", "Mottakeren er ikke engang kunde. Da er e-posten sendt bredt ut: masse-phishing."],
        tips: ["Spyd = én person, whaling = toppleder, klone = kopi av ekte e-post, masse = alle."]
      },
      {
        key: "H2022-3.3", year: "H2022", oppgave_nr: "Oppgave 3.3", del: D3,
        ark: "3.3 Strafferamme ulovlig datainnbrudd", title: "Strafferamme i straffeloven § 204",
        points: 1, block: "pentest", tema: ["straffeloven § 204", "datainnbrudd", "lov"], gjenganger: ["H2025-13"], ordrett: true,
        oppgave: "<p>I henhold til straffelovens § 204 – hva er strafferammen for gjennomføring av ulovlig datainnbrudd? (I denne oppgaven må svaret være helt korrekt - hvis korrekt svar er \"bøter og fengsel\" og du svarer \"bøter\" - så er svaret altså feil.)<br>Poeng: 1 for riktig, 0 for feil eller ubesvart.</p><p><strong>Velg ett alternativ:</strong></p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 for riktig, 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Bøter", "Bøter eller fengsel i inntil to år", "Fengsel i inntil fem år", "Bøter eller fengsel i inntil ti år"],
          svar: 1,
          explain: [
            "<p>Ufullstendig. Bøter er bare en del av strafferammen, og oppgaven krever hele svaret.</p>",
            "<p>Riktig. § 204 setter strafferammen til bot eller fengsel i inntil to år.</p>",
            "<p>For strengt for § 204.</p>",
            "<p>For strengt for § 204.</p>"
          ]
        },
        avvik: null,
        losning: ["§ 204 (datainnbrudd): bot eller fengsel inntil 2 år."],
        tips: ["Derfor krever en pentest skriftlig tillatelse på forhånd. Uten den er testen datainnbrudd."]
      },
      {
        key: "H2022-3.4", year: "H2022", oppgave_nr: "Oppgave 3.4", del: D3,
        ark: "3.4 Skadevare", title: "Skadevaretyper",
        points: 4, block: "angrep", tema: ["skadevare", "orm", "trojaner", "bakdør", "virus"], gjenganger: ["H2021-2.5", "H2023-24", "H2024-21"], ordrett: true,
        oppgave: "<p>Velg den kolonnen som passer best med hver rad. Det gis ett poeng for hvert svar, 0 for blanke og minus ett for hvert gale.<br>Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 4 for alle riktig, minimum 0.</p><p><strong>Finn de som passer sammen:</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 4 for alle riktig, minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 4 },
          kolonner: ["Dataorm", "Trojaner", "Bakdør", "Løsepengevirus", "Virus"], multi: false,
          rader: [
            { s: "Maskerer seg som legitime programmer som faktisk (eller tilsynelatende) har nyttige funksjoner.", svar: [1], explain: "<p>Som den trojanske hesten: ser nyttig ut, men har skjult skadelig innhold.</p>" },
            { s: "Infiserer andre programmer ved at skadelig kode legges til og flettes inn i andre programmer.", svar: [4], explain: "<p>Et virus trenger et vertsprogram og fester seg i andre programmer.</p>" },
            { s: "SQL-slammer er en", svar: [0], explain: "<p>SQL Slammer spredte seg selv over nettet fra maskin til maskin uten hjelp fra brukere. Det er en dataorm.</p>" },
            { s: "En skjult metode for å omgå normal autentisering og tilgangskontroll", svar: [2], explain: "<p>En bakdør er en skjult vei inn som går utenom vanlig innlogging.</p>" }
          ]
        },
        avvik: null,
        losning: ["Trojaner = forkledd, virus = trenger vert, orm = sprer seg selv over nett, bakdør = skjult inngang. Løsepengevirus er distraktor."],
        tips: ["±1 per rad: hopp over raden hvis du er usikker."]
      },
      {
        key: "H2022-3.5", year: "H2022", oppgave_nr: "Oppgave 3.5", del: D3,
        ark: "3.5 Løsepengevirus", title: "Løsepengevirus: sant eller usant",
        points: 1, block: "angrep", tema: ["løsepengevirus", "hash", "administratorrettigheter"], ordrett: true,
        oppgave: "<p>I denne oppgaven kommer to utsagn, velg om de sanne eller usanne.<br>Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, maks 1, minimum 0.</p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, maks 1, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 1 },
          sporsmal: [
            { tekst: "Mange løsepengevirus krypterer offerets systemer ved hjelp av av SHA-256", alternativer: ["Sant", "Usant"], svar: 1,
              explain: ["<p>Nei. SHA-256 er en hashfunksjon, ikke et krypteringschiffer.</p>", "<p>Riktig. SHA-256 er enveis og har ingen nøkkel, så den kan ikke kryptere noe som senere skal dekrypteres.</p>"] },
            { tekst: "Et viktig sikkerhetstiltak mot løsepengevirus i virksomheter er å ikke gi brukerne administratorrettigheter", alternativer: ["Usant", "Sant"], svar: 1,
              explain: ["<p>Nei. Færre rettigheter er et av de viktigste tiltakene.</p>", "<p>Riktig. Uten administratorrettigheter får skadevaren mindre tilgang og har vanskeligere for å ramme systemfiler og spre seg.</p>"] }
          ]
        },
        avvik: null,
        losning: ["Hash ≠ kryptering. Løsepengevirus bruker ekte krypteringsalgoritmer.", "Minst mulig rettigheter begrenser skaden."],
        tips: ["En hashverdi kan ikke «dekrypteres». Det er en klassisk felle."]
      },
      {
        key: "H2022-3.6", year: "H2022", oppgave_nr: "Oppgave 3.6", del: D3,
        ark: "3.6 Angrepsvektorer", title: "Angrepsvektor for hvert angrep",
        points: 2, block: "angrep", tema: ["angrepsvektorer", "drive-by", "phishing", "orm", "XSS"], ordrett: true,
        oppgave: "<p>I første kolonne står enkelte former for angrep, velg den angrepsvektoren som beskriver angripet best.<br>Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p><p><strong>Finn de som passer sammen:</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          kolonner: ["Falske nettsider", "Leveransekjedeangrep", "Drive-by-angrep", "Automatisk spredning av skadevare", "Phishing"], multi: false,
          rader: [
            { s: "Nettside som sender skadevare automatisk til klienten uten brukerinteraksjon", svar: [2], explain: "<p>Det holder å besøke siden. Det er nettopp et drive-by-angrep.</p>" },
            { s: "Dataorm", svar: [3], explain: "<p>En orm sprer seg selv fra maskin til maskin uten at noen gjør noe.</p>" },
            { s: "XSS-angrep", svar: [2], explain: "<p>Ved XSS havner skadelig skript i en ellers ekte nettside og kjører i nettleseren til den som besøker den. Fasiten plasserer det under drive-by.</p>" },
            { s: "Overbevise noen til å installere en keylogger", svar: [4], explain: "<p>Å lure en person til å gjøre noe skadelig selv er sosial manipulering, her phishing.</p>" }
          ]
        },
        avvik: null,
        losning: ["Spør: må offeret gjøre noe (phishing), holder det å besøke (drive-by), eller skjer det helt av seg selv (orm)?"],
        tips: ["Falske nettsider og leveransekjedeangrep er distraktorer her."]
      },

      /* ================= DEL 4 ================= */
      {
        key: "H2022-4.1", year: "H2022", oppgave_nr: "Oppgave 4.1", del: D4,
        ark: "4.1 Innebygd informasjonssikkerhet", title: "Faser i innebygd sikkerhet",
        points: 2, block: "utvikling", tema: ["innebygd sikkerhet", "7 faser", "DevSecOps"], gjenganger: ["H2021-9.1"], ordrett: true,
        oppgave: "<p>Vi har beskrevet livssyklusen for innebygd informasjonssikkerhet som en prosess av 7 faser.<br>Velg riktig fase for hver av aktivtene under.<br>Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "N",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          tekst: "<p>Mål med {0} å avdekke sårbarheter som ikke har blitt oppdaget i design- eller kodefasene.<br>Statisk analyse og kode gjennomgang brukes i {1} .<br>Prosedyrer for patching og hendelseshåndtering utvikles i {2}.<br>Fasen {3} er ikke med i DevSecOps.</p>",
          felt: [
            { etikett: "Felt 1", valg: ["Opplæring", "Design", "Koding", "Produksjonssetting", "Krav", "Forvaltning", "Test"], svar: 6, godta: [], explain: "<p>Testfasen skal finne det som slapp gjennom design og koding.</p>" },
            { etikett: "Felt 2", valg: ["Forvaltning", "Opplæring", "Test", "Koding", "Krav", "Produksjonssetting", "Design"], svar: 3, godta: [], explain: "<p>Statisk analyse og kodegjennomgang gjøres på kildekoden mens den skrives, altså i kodefasen.</p>" },
            { etikett: "Felt 3", valg: ["Krav", "Test", "Opplæring", "Koding", "Forvaltning", "Produksjonssetting", "Design"], svar: 5, godta: [], explain: "<p>Før systemet settes i drift, lages planene for patching og håndtering av hendelser. Fasiten legger dette i produksjonssetting.</p>" },
            { etikett: "Felt 4", valg: ["Forvaltning", "Koding", "Produksjonssetting", "Opplæring", "Test", "Krav", "Design"], svar: 3, godta: [], explain: "<p>DevSecOps er en løkke av tekniske steg. Opplæring ligger utenfor løkka.</p>" }
          ]
        },
        avvik: null,
        losning: ["De sju fasene: opplæring, krav, design, koding, test, produksjonssetting, forvaltning.", "Test finner sårbarheter, koding har statisk analyse, produksjonssetting forbereder patching og hendelseshåndtering, opplæring er ikke med i DevSecOps-løkka."],
        tips: ["Felt 3 er lett å svare «Forvaltning» på. Men prosedyrene lages før drift og brukes i forvaltning.", "Sikker utvikling (7 faser, DevSecOps) står ikke på 2026-lysarkene."]
      },
      {
        key: "H2022-4.2", year: "H2022", oppgave_nr: "Oppgave 4.2", del: D4,
        ark: "4.2 Trusselmodellering og applikasjonssikkerhet", title: "STRIDE og OWASP Top 10",
        points: 2, block: "utvikling", tema: ["STRIDE", "OWASP Top 10", "SSRF", "injeksjon"], gjenganger: ["H2021-9.2", "H2025-31", "H2025-32"], ordrett: true,
        oppgave: "<p>Tema for denne oppgaven er trusselmodellering gjennom bruk av STRIDE og OWASP top 10.<br>Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "N",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          tekst: "<p>Vi har diskutert bruk av STRIDE for trusselmodellering. En angriper som gjør endringer i minnet til en prosess den ikke skal ha rettigheter til er i STRIDE en del av trusselkategori {0} og er et brudd på {1}.</p><p>OWASP top 10 kan være en god kilde for trusselmodellering for applikasjonssikkerhet. Her rangeres de 10 mest kritiske sikkerhetsrisikoene  Siste versjon kom ut i 2021 som vi tar utgangspunkt i her.</p><p>En angriper får tjener-applikasjon til å gjøre forespørsel til et domene spesifisert av angriper. Hvilket av OWASP top 10 er dette et eksempel på? {2}</p><p>Manipulert input-data sendes til en applikasjon som en del av en forespørsel/kommando som lurer applikasjonen til å utføre utilsiktede eller uautoriserte handlinger. Hvilke av OWAPS top 10 er dette et eksempel på? {3}</p>",
          felt: [
            { etikett: "STRIDE-kategori", valg: ["Spoofing", "Tampering", "Repudiation", "Informasjon disclosure", "Denial of service", "Elevation of priveilege"], svar: 1, godta: [], explain: "<p>Å endre noe man ikke har lov til å endre er tampering (manipulering).</p>" },
            { etikett: "Brutt mål", valg: ["Konfidensialitet", "Tilgjengelighet", "Integritet"], svar: 2, godta: [], explain: "<p>Uautorisert endring bryter integriteten.</p>" },
            { etikett: "OWASP (forespørsel til angripers domene)", valg: OWASP.concat(["10. Server side request forgery (SSRF)"]), svar: 9, godta: [], explain: "<p>Når tjeneren lures til å sende forespørsler dit angriperen bestemmer, er det SSRF.</p>" },
            { etikett: "OWASP (manipulert input)", valg: OWASP.concat(["10. Server-side request forgery (SSRF)"]), svar: 2, godta: [], explain: "<p>Input som blir tolket som kommando eller spørring, er injeksjon (f.eks. SQL-injeksjon).</p>" }
          ]
        },
        avvik: "Oppgaven bygger på OWASP Top 10 fra 2021 (SSRF = nr. 10, injeksjon = nr. 3). En nyere utgave kom i november 2025 (jf. H2025 32), med endret rekkefølge; der er SSRF ikke lenger egen kategori. Svar etter 2021-lista på denne oppgaven.",
        losning: ["STRIDE: hver bokstav bryter én egenskap. T(ampering) bryter integritet.", "SSRF = tjeneren gjør forespørsler for angriperen. Injeksjon = input tolkes som kode eller kommando."],
        tips: ["STRIDE → mål: Spoofing–autentisitet, Tampering–integritet, Repudiation–ubenektelighet, Information disclosure–konfidensialitet, DoS–tilgjengelighet, Elevation of privilege–tilgangskontroll (som i fasiten for H2021 9.2 og H2025 31).", "OWASP Top 10 og STRIDE står ikke på 2026-lysarkene.", "Arket skriver «Informasjon disclosure» og «priveilege» – skrivefeil i originalen, gjengitt ordrett."]
      },
      {
        key: "H2022-4.3", year: "H2022", oppgave_nr: "Oppgave 4.3", del: D4,
        ark: "4.3 Bokser", title: "Pentest med full dokumentasjon",
        points: 1, block: "pentest", tema: ["pentest", "hvitboks"], gjenganger: ["H2023-4", "H2024-4", "H2025-4"], ordrett: true,
        oppgave: "<p>I planleggingen av en pentest får du utlevert all systemdokumentasjon om et system. Dette inkluderer fulle nettverkstegninger. Hva kalles denne typen testing?<br>Poeng: 1 for riktig, 0 for feil eller ubesvart.</p><p><strong>Velg ett alternativ:</strong></p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 1 for riktig, 0 for feil eller ubesvart.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Gulboks-testing (yellow box)", "Hvitboks-testing (white box)", "Gråboks-testing (grey box)", "Svartboks-testing (Blackbox)"],
          svar: 1,
          explain: [
            "<p>Begrepet brukes ikke om pentest. Det er en distraktor.</p>",
            "<p>Riktig. Testeren ser alt inni «boksen»: dokumentasjon, nettverkstegninger og ofte kildekode.</p>",
            "<p>Gråboks betyr delvis innsikt, f.eks. en vanlig brukerkonto. Her får testeren alt.</p>",
            "<p>Svartboks betyr ingen forhåndskunnskap, som en ekstern angriper.</p>"
          ]
        },
        avvik: null,
        losning: ["All informasjon → hvitboks. Delvis → gråboks. Ingen → svartboks."],
        tips: ["Tenk på boksen som systemet: kan du se inn i den?"]
      },
      {
        key: "H2022-4.4", year: "H2022", oppgave_nr: "Oppgave 4.4", del: D4,
        ark: "4.4 Misbruk av sudo", title: "Sudo-rettigheter som privilegieeskalering",
        points: 5, block: "pentest", tema: ["sudo", "privilegieeskalering", "minste privilegium"], gjenganger: ["H2023-29"], ordrett: false,
        oppgave: "<p>I løpet av en pentest har du funnet passordet til en bruker som kan logge inn på en maskin gjennom ssh. Du logger inn og sjekker rettigheter – se bildet under.</p><p>Nevn to måter å misbruke sudo-rettighetene du ser på bildet til å oppnå et root-shell.<br>Du trenger ikke å gi uttømmende svar her, skriv en - eller maks to setninger for hver måte du nevner. Hver måte (tekst) gir 2 poeng, men det er mulig å oppnå totalt 5 poeng hvis du skriver en tilnærmet fungerende kode (pseudokode) for å gjennomføre ett av angrepene.</p>",
        figur: {
          beskrivelse: "Skjermbilde av et terminalvindu. En bruker logger inn på en Ubuntu-maskin over SSH og lister sine sudo-rettigheter. Den siste delen av utskriften viser at brukeren kan kjøre én kommando som root via sudo: Python-tolkeren (/usr/bin/python3).",
          tekst: ["(root) /usr/bin/python3"]
        },
        inspera: {
          type: "E",
          regelTekst: "Hver måte (tekst) gir 2 poeng, men det er mulig å oppnå totalt 5 poeng hvis du skriver en tilnærmet fungerende kode (pseudokode) for å gjennomføre ett av angrepene.",
          regel: { riktig: 2, feil: 0, blankt: 0, min: 0, maks: 5 },
          regelMerknad: "Manuell retting: 2 p per beskrevet måte, inntil 1 p ekstra for tilnærmet fungerende kode.",
          deler: [{ del: "Svar", poeng: 5, sporsmal: null, grense: "en til to setninger per måte" }]
        },
        avvik: "Guiden beskriver måtene sensoren godtar med egne ord, men gjengir ikke kommandoer eller kode. Ekstrapoenget for kode dekkes derfor ikke. Sensorteksten finnes i qa-fila (s. 16).",
        losning: ["Se hvilken kommando brukeren får kjøre som root: en tolk for et fullt programmeringsspråk.",
          "En tolk kan kjøre hvilken som helst kode. Får den kjøre som root, kan brukeren i praksis gjøre alt root kan.",
          "Prinsippet: sudo-regler som gir root-tilgang til tolker, skall eller redigeringsprogram, gir full root-tilgang."],
        tips: ["Les sudo-listen og spør: kan dette programmet starte andre programmer eller skrive til vilkårlige filer? Da er det en eskaleringsvei.", "Forsvaret er minste privilegium: gi sudo bare til smale, faste kommandoer."]
      },

      /* ================= DEL 5 ================= */
      {
        key: "H2022-5.1", year: "H2022", oppgave_nr: "Oppgave 5.1", del: D5,
        ark: "5.1 Digital signatur", title: "Nøkler for signering og verifisering",
        points: 2, block: "krypto", tema: ["digital signatur", "privat nøkkel", "offentlig nøkkel"], gjenganger: ["H2021-3.5"], ordrett: true,
        oppgave: "<p>Alice ønsker å sende en digitalt signert melding til Bob slik at en tredjepart (f.eks. en dommer) kan verifisere signaturen. Velg riktig eier og type nøkkel for signering og verifisering.<br>Poeng: 0,5 for hvert riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "N",
          regelTekst: "Poeng: 0,5 for hvert riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          tekst: "<p>For å signere meldingen må Alice bruke {0} {1} nøkkel.<br>For å verifisere den digitale signaturen må Bob bruke {2} {3} nøkkel.</p>",
          felt: [
            { etikett: "Eier (signering)", valg: ["Bobs", "sin egen", "dommerens"], svar: 1, godta: [], explain: "<p>Signaturen skal knyttes til Alice, så hun bruker sin egen nøkkel.</p>" },
            { etikett: "Type (signering)", valg: ["symmetriske", "private", "offentlige"], svar: 1, godta: [], explain: "<p>Bare Alice har den private nøkkelen, så bare hun kan lage signaturen: S = Sig(H, K<sup>A</sup><sub>priv</sub>).</p>" },
            { etikett: "Eier (verifisering)", valg: ["dommerens", "Alices", "sin egen"], svar: 1, godta: [], explain: "<p>Bob sjekker signaturen mot avsenderens nøkkel, altså Alices.</p>" },
            { etikett: "Type (verifisering)", valg: ["private", "symmetriske", "offentlige"], svar: 2, godta: [], explain: "<p>Alices offentlige nøkkel kan alle få, også dommeren. Derfor kan en tredjepart verifisere.</p>" }
          ]
        },
        avvik: null,
        losning: ["Signere: avsenderens private nøkkel.", "Verifisere: avsenderens offentlige nøkkel."],
        tips: ["Symmetrisk nøkkel er feil: da kunne Bob også ha laget «signaturen», og dommeren kunne ikke skille dem (det er MAC)."]
      },
      {
        key: "H2022-5.2", year: "H2022", oppgave_nr: "Oppgave 5.2", del: D5,
        ark: "5.2 Hashfunksjoner", title: "Hashfunksjoner: sant eller usant",
        points: 2, block: "krypto", tema: ["hashfunksjon", "MD5", "SHA-1", "SHA-2"], gjenganger: ["H2021-3.4", "H2023-21", "H2024-18"], ordrett: true,
        oppgave: "<p>Her er fire utsagn om hashfunksjoner - velg om de er sanne eller usanne?<br>Poeng: 0.5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "F1",
          regelTekst: "Poeng: 0.5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          sporsmal: [
            { tekst: "Når man har hashsverdien av en streng er det enkelt å finne tilbake til strengen.", alternativer: ["Sant", "Usant"], svar: 1,
              explain: ["<p>Nei. En hashfunksjon skal være enveis.</p>", "<p>Riktig. Enveis betyr at det er praktisk umulig å finne inndataene fra hashverdien.</p>"] },
            { tekst: "Hashfunksjoner kan brukes til å kryptere og dekryptere tekst", alternativer: ["Sant", "Usant"], svar: 1,
              explain: ["<p>Nei. En hash har ingen nøkkel og kan ikke reverseres.</p>", "<p>Riktig. Hashing er ikke kryptering: det finnes ingen nøkkel og ingen dekryptering.</p>"] },
            { tekst: "MD5 er en sikrere hashfunksjon enn SHA-1", alternativer: ["Sant", "Usant"], svar: 1,
              explain: ["<p>Nei. MD5 er eldre, har kortere hash (128 bit) og ble knekt først.</p>", "<p>Riktig. MD5 (128 bit) er svakere enn SHA-1 (160 bit). Begge regnes nå som usikre.</p>"] },
            { tekst: "SHA-512 er sikrere enn SHA-256", alternativer: ["Usant", "Sant"], svar: 1,
              explain: ["<p>Nei. Begge er SHA-2, men SHA-512 gir lengre hash.</p>", "<p>Riktig. Lengre hashverdi gir større motstand mot kollisjoner og invertering.</p>"] }
          ]
        },
        avvik: null,
        losning: ["Enveis → usant. Ingen nøkkel → usant. MD5 svakest → usant. Lengre SHA-2 → sant."],
        tips: ["Rekkefølgen Sant/Usant bytter i siste spørsmål. Les knappene."]
      },
      {
        key: "H2022-5.3", year: "H2022", oppgave_nr: "Oppgave 5.3", del: D5,
        ark: "5.3 MAC og Digital Signatur", title: "MAC eller digital signatur?",
        points: 3, block: "krypto", tema: ["MAC", "digital signatur", "ubenektelighet"], gjenganger: ["H2021-1.4", "H2023-15", "H2024-12"], ordrett: true,
        oppgave: "<p>For hver egenskap, angi hvilken mekanisme som har egenskapen, ved å velge blant mekanismene MAC (Message Authentication Code), DigSig (Digital Signatur), Begge (både MAC og DigSig) eller Ingen (hverken MAC eller DigSig).<br><em>Poeng: 0,5 for hver riktig, -0.5 for for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.</em></p><p><strong>Angi mekanismen som passer til hver egenskap</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig, -0.5 for for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
          kolonner: ["MAC", "DigSig", "Begge", "Ingen"], multi: false,
          rader: [
            { s: "Mottager kan autentisere meldingen", svar: [2], explain: "<p>Med MAC har mottakeren den delte nøkkelen. Med signatur har mottakeren avsenderens offentlige nøkkel. Begge virker.</p>" },
            { s: "Tredjeparter kan autentisere meldingen", svar: [1], explain: "<p>Bare signatur: alle kan få avsenderens offentlige nøkkel. En MAC krever den hemmelige nøkkelen, som tredjeparten ikke har.</p>" },
            { s: "Mekanismen beskytter konfidensialitet", svar: [3], explain: "<p>Ingen av dem skjuler innholdet. Meldingen sendes i klartekst ved siden av koden eller signaturen.</p>" },
            { s: "Mekanismen beskytter integritet", svar: [2], explain: "<p>Begge avslører om meldingen er endret.</p>" },
            { s: "Mekanismen benytter en symmetrisk kryptoalgoritme", svar: [0], explain: "<p>MAC bruker én delt hemmelig nøkkel, altså symmetrisk.</p>" },
            { s: "Mekanismen benytter an asymmetrisk kryptoalgoritme", svar: [1], explain: "<p>Signatur bruker et nøkkelpar (privat og offentlig), altså asymmetrisk.</p>" }
          ]
        },
        avvik: null,
        losning: ["Felles: integritet og autentisering for mottaker.", "Forskjell: signatur er asymmetrisk og kan sjekkes av tredjepart (ubenektelighet). MAC er symmetrisk.", "Ingen av dem gir konfidensialitet."],
        tips: ["MAC gir ikke ubenektelighet: begge parter har nøkkelen."]
      },
      {
        key: "H2022-5.4", year: "H2022", oppgave_nr: "Oppgave 5.4", del: D5,
        ark: "5.4 Asymmetrisk kryptering", title: "Nøkler ved asymmetrisk kryptering",
        points: 1, block: "krypto", tema: ["asymmetrisk kryptering", "mottakers nøkler"], gjenganger: ["H2023-7", "H2024-7"], ordrett: true,
        oppgave: "<p>Hvilke nøkler benyttes i forbindelse med <strong>asymmetrisk kryptering og dekryptering</strong> av en hemmelig melding som skal sendes fra en avsender til en mottager?<br><em>Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 1 for alle riktig, minimum 0.</em></p><p><strong>Velg ett eller flere alternativer</strong></p>",
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 1 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 1 },
          alternativer: ["Privat nøkkel til mottager", "Private nøkkel til avsender", "Offentlig nøkkel til avsender", "Offentlig nøkkel til mottager"],
          svar: [0, 3],
          explain: [
            "<p>Riktig. Mottakeren dekrypterer med sin private nøkkel: M = D(C, K<sup>B</sup><sub>priv</sub>).</p>",
            "<p>Nei. Avsenderens private nøkkel brukes til å signere, ikke til å kryptere en hemmelig melding.</p>",
            "<p>Nei. Avsenderens offentlige nøkkel brukes når noen skal sende til avsenderen eller sjekke hans signatur.</p>",
            "<p>Riktig. Avsenderen krypterer med mottakerens offentlige nøkkel: C = E(M, K<sup>B</sup><sub>pub</sub>).</p>"
          ]
        },
        avvik: null,
        losning: ["Hemmelig melding til B: krypter med Bs offentlige nøkkel, B dekrypterer med sin private."],
        tips: ["Kryptering bruker mottakerens nøkler. Signering bruker avsenderens."]
      },
      {
        key: "H2022-5.5", year: "H2022", oppgave_nr: "Oppgave 5.5", del: D5,
        ark: "5.5 Tellermodus", title: "Tellermodus med 4-bits blokker",
        points: 2, block: "krypto", tema: ["tellermodus", "CTR", "XOR"], gjenganger: ["H2021-3.2", "H2021-3.3"], ordrett: true,
        oppgave: "<p>Anta et blokkchiffer som benyttes i tellermodus, slik som vist på figuren, der blokkstørrelsen og nøkkellengden er 4 bits (som et lekeeksempel). Anta følgende parametre:</p>",
        figur: {
          beskrivelse: "To halvdeler side om side. Venstre, «Kryptering»: tre søyler. I hver søyle går en gul telleboks (T₁, T₂, T₃) og en nøkkel K ned i en blå boks «E». Fra E går en pil ned til en XOR-sirkel (⊕). Inn fra venstre i XOR kommer klartekstblokken (M₁, M₂, M₃), og ut nederst kommer chifferblokken (C₁, C₂, C₃, mørke bokser). Høyre, «Dekryptering»: samme oppsett med T₁–T₃, K og boksen «E» (også her E, ikke D), men inn i XOR kommer C₁–C₃ fra venstre og ut kommer M₁–M₃.",
          tekst: ["T₁", "T₂", "T₃", "K", "E", "M₁", "M₂", "M₃", "C₁", "C₂", "C₃", "Kryptering", "Dekryptering"]
        },
        inspera: {
          type: "T",
          regelTekst: "1 poeng for hvert riktige svar, 0 for feil svar, maks 2, minimum 0 poeng.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 2 },
          tekst: "<p>a) Kryptering<br>Hemmelig nøkkel K = 0111<br>Telleverdi T<sub>1</sub> = 0001<br>Kryptert telleverdi E(T<sub>1</sub>,K) = 1101<br>Klartekstblokk M<sub>1</sub>= 0101</p><p>Skriv chifferblokk C<sub>1</sub>: {0} .</p><p>b) Dekryptering<br>Hemmelig nøkkel K = 0111<br>Telleverdi T<sub>2</sub> = 0002<br>Kryptert telleverdi E(T<sub>2</sub>,K) = 0011<br>Chiffertekstblokk C<sub>2</sub>= 1100</p><p>Skriv klartekstblokk M<sub>2</sub>: {1}</p>",
          felt: [
            { etikett: "C₁", godta: ["1000"], explain: "<p>C₁ = E(T₁, K) ⊕ M₁ = 1101 ⊕ 0101 = 1000.</p>" },
            { etikett: "M₂", godta: ["1111"], explain: "<p>M₂ = E(T₂, K) ⊕ C₂ = 0011 ⊕ 1100 = 1111.</p>" }
          ]
        },
        avvik: "«Telleverdi T2 = 0002» er ikke en gyldig 4-bits streng (skulle trolig vært 0010). Det påvirker ikke svaret, fordi E(T₂, K) er oppgitt.",
        losning: [
          "Kryptering: C₁ = E(T₁, K) ⊕ M₁. Den krypterte telleverdien er oppgitt: 1101.",
          "XOR bit for bit (likt → 0, ulikt → 1): 1⊕0 = 1, 1⊕1 = 0, 0⊕0 = 0, 1⊕1 = 0. C₁ = 1000.",
          "Dekryptering: M₂ = E(T₂, K) ⊕ C₂. Den krypterte telleverdien er 0011.",
          "0⊕1 = 1, 0⊕1 = 1, 1⊕0 = 1, 1⊕0 = 1. M₂ = 1111.",
          "Kontroll: 1111 ⊕ 0011 = 1100 = C₂. Stemmer."
        ],
        tips: ["Nøkkelen K og telleverdien trengs ikke i regningen når E(T, K) er oppgitt. De er bare med for helhetens skyld.", "I tellermodus brukes E også ved dekryptering. Ingen D."]
      },

      /* ================= DEL 6 ================= */
      {
        key: "H2022-6.1", year: "H2022", oppgave_nr: "Oppgave 6.1", del: D6,
        ark: "6.1 PKI", title: "Stjålet privat nøkkel – hva kan tyven?",
        points: 3, block: "pki", tema: ["privat nøkkel", "kompromittering", "signatur", "dekryptering"], ordrett: true,
        oppgave: "<p>Våre venner Alice og Bob kommuniserer begge med Charlie, og kommunikasjonen krypteres ved hjelp av offentlig/private nøkkelpar. Anta at alle meldinger kan ses, mottas og sendes på tvers av alle parter (som i en lokal wifi - alle parter kan altså se all kommunikasjon som går mellom alle parter) uavhengig av hvem kommunikasjonen faktisk er ment for. <strong>Anta at Alice har stjålet Bobs private nøkkel</strong> - hvilke utsagn er da korrekte?</p><p>Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.</p><p><strong>Velg ett eller flere alternativer</strong></p>",
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
          alternativer: [
            "Bob kan lese (dekryptere) meldinger sendt fra Charlie til Alice.",
            "Alice kan lese (dekryptere) meldinger sendt fra Bob til Charlie.",
            "Alice kan lese (dekryptere) meldinger sendt fra Charlie til Bob.",
            "Alice kan signere forfalskede meldinger fra Bob til Charlie.",
            "Alice kan signere forfalskede meldinger fra Charlie til Bob.",
            "Alice kan signere meldinger fra Alice til Charlie."
          ],
          svar: [2, 3, 5],
          explain: [
            "<p>Nei. Meldinger til Alice er kryptert med Alices offentlige nøkkel. Bob har ikke Alices private nøkkel.</p>",
            "<p>Nei. Meldinger til Charlie er kryptert med Charlies offentlige nøkkel. Bobs private nøkkel hjelper ikke.</p>",
            "<p>Riktig. Meldinger til Bob er kryptert med Bobs offentlige nøkkel, og Alice har nå den tilhørende private nøkkelen.</p>",
            "<p>Riktig. Med Bobs private nøkkel kan Alice lage signaturer som ser ut som Bobs.</p>",
            "<p>Nei. Da trengte hun Charlies private nøkkel.</p>",
            "<p>Riktig, men av en triviell grunn: Alice har alltid kunnet signere med sin egen private nøkkel. Tyveriet endrer ikke det.</p>"
          ]
        },
        avvik: null,
        losning: ["Bobs private nøkkel brukes til to ting: dekryptere det som sendes til Bob og signere som Bob.", "Alice kan derfor lese meldinger til Bob og forfalske signaturer fra Bob.", "Siste alternativ er alltid sant. Les alle alternativene uten å tenke på tyveriet først."],
        tips: ["±1 per kryss. Velg bare det du er sikker på."]
      },
      {
        key: "H2022-6.2", year: "H2022", oppgave_nr: "Oppgave 6.2", del: D6,
        ark: "6.2 Sertifikater", title: "Rot-, mellomliggende og subjektsertifikat",
        points: 3, block: "pki", tema: ["rotsertifikat", "mellomliggende CA", "subjektsertifikat"], gjenganger: ["H2021-4.4"], ordrett: true,
        oppgave: "<p>For hver beskrivelse, angi riktig sertifikat (der Ingen også er et alternativ).<br>Poeng: 0,5 for hver riktig, -0.5 for for hver feil, 0 for ubesvart, 3 for alle eriktig, minimum 0.</p><p><strong>Velg riktig sertifikat</strong></p>",
        figur: {
          beskrivelse: "Tre like trær side om side. Hvert tre har én svart prikk øverst (rot), to sirkler med prikk i midten under den (mellomliggende); den venstre peker til to åpne sirkler (subjekt), den høyre til én, altså tre subjekter per tre. Pilene går nedover fra rot til mellomliggende og videre til subjekt. Til høyre står tre etiketter på samme høyde som nivåene: «Rotsertifikater», «Mellomliggende sertifikater», «Subjektsertifikater».",
          tekst: ["Rotsertifikater", "Mellomliggende sertifikater", "Subjektsertifikater"]
        },
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig, -0.5 for for hver feil, 0 for ubesvart, 3 for alle eriktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
          kolonner: ["Rotsertifikater", "Mellomliggende sertifikater", "Subjektsertifikater", "Ingen"], multi: false,
          rader: [
            { s: "Inneholder webtjeners offentlige nøkkel", svar: [2], explain: "<p>Webtjenerens sertifikat er et subjektsertifikat (nederst i treet), og det binder domenenavnet til den offentlige nøkkelen.</p>" },
            { s: "Inneholder webtjeners private nøkkel", svar: [3], explain: "<p>Ingen. Et sertifikat inneholder aldri en privat nøkkel. Den holdes hemmelig hos eieren.</p>" },
            { s: "Er signert av webtjener", svar: [3], explain: "<p>Ingen. Webtjeneren er ikke en CA og signerer ikke sertifikater.</p>" },
            { s: "Er selvsignert", svar: [0], explain: "<p>Rotsertifikatet signeres med rot-CA-ens egen private nøkkel.</p>" },
            { s: "Er signert av rot-CA (ikke selvsignert)", svar: [1], explain: "<p>Mellomliggende CA-sertifikater signeres av rot-CA-en.</p>" },
            { s: "Brukes til signering av subjektsertifikater", svar: [3], explain: "<p>Ingen. Det er den mellomliggende CA-ens private nøkkel som signerer, ikke et sertifikat. Et sertifikat inneholder bare offentlig nøkkel.</p>" }
          ]
        },
        avvik: null,
        losning: ["Rot = selvsignert. Mellomliggende = signert av rot. Subjekt = webtjenerens offentlige nøkkel.", "Fellene: private nøkler står aldri i sertifikater, og sertifikater signerer ikke noe."],
        tips: ["Rød merknad i fasiten (siste rad): «Husk at subjektsertifikat signeres av privat nøkkel, ikke av sertifikat, fra mellomliggende CA.»"]
      },
      {
        key: "H2022-6.3", year: "H2022", oppgave_nr: "Oppgave 6.3", del: D6,
        ark: "6.3 PKI og tillit", title: "PKI og tillit: fire korrekte utsagn",
        points: 2, block: "pki", tema: ["PKI", "tillit", "tillitsforvirring", "rot-CA"], ordrett: true,
        oppgave: "<p>Angi 4 korrekte utsagn om PKI og tillit.<br>Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p><p><strong>Velg ett eller flere alternativer</strong></p>",
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          alternativer: [
            "Selv-signering av rot-sertifikater gir en garanti for at rot-sertifikatet er autentisk.",
            "PKI gjør det mulig å utveksle private nøkler mellom klient og server.",
            "Et server-sertifikat gir en garanti for at nettsidens domenenavn er autentisk.",
            "Server-sertifikater gjør det mulig for klient å autentisere tjener ved opprettelse av en øktnøkkel.",
            "Korrekt validering av et server-sertifikat gir en garanti for at nettsiden er pålitelig.",
            "En CA sjekker identiteten til eieren av et domene før det utstedes serversertifikat for domenet.",
            "Tillitsmodellen for internett-PKI har flere enn bare én rot-CA.",
            "Server-sertifikater gjør det umulig å spoofe nettsider."
          ],
          svar: [2, 3, 5, 6],
          explain: [
            "<p>Nei. Hvem som helst kan selvsignere. Tilliten til en rot kommer fra at den er installert på forhånd (f.eks. i nettleseren), ikke fra signaturen.</p>",
            "<p>Nei. Private nøkler skal aldri utveksles. PKI distribuerer offentlige nøkler.</p>",
            "<p>Riktig. Sertifikatet binder domenenavnet til en offentlig nøkkel og gir autentisitet for navnet.</p>",
            "<p>Riktig. I TLS bruker klienten sertifikatet til å sjekke at det er den riktige tjeneren den etablerer øktnøkkel med.</p>",
            "<p>Nei. Sertifikatet sier hvem du snakker med, ikke at de er til å stole på. Å tro det er tillitsforvirring.</p>",
            "<p>Riktig. CA-en kontrollerer at søkeren faktisk har kontroll over domenet før den utsteder.</p>",
            "<p>Riktig. Nettlesere og operativsystemer har mange rot-CA-er installert.</p>",
            "<p>Nei. Phishing-sider kan ha gyldige sertifikater for sine egne, lignende domenenavn.</p>"
          ]
        },
        avvik: null,
        losning: ["Sertifikat = autentisk domenenavn + offentlig nøkkel, utstedt etter kontroll, med mange røtter.", "Ikke: pålitelighet, utveksling av private nøkler, garanti fra selvsignering, eller umulig spoofing."],
        tips: ["«Gir garanti for at nettsiden er pålitelig» er tillitsforvirring. Det er alltid feil."]
      },
      {
        key: "H2022-6.4", year: "H2022", oppgave_nr: "Oppgave 6.4", del: D6,
        ark: "6.4 Sertifikat for uio.no.", title: "Hva kan sertifikatet for uio.no brukes til?",
        points: 2, block: "pki", tema: ["X.509", "nøkkelbruk", "ECDSA"], ordrett: true,
        oppgave: "<p>Bildet viser utdrag av tjener-sertifikatet for uio.no. Forstørr bildet for å gjøre det leselig (zoom inn og ut ved å trykke Ctrl + (pluss) og Ctrl – (minus). Bruk + og – tastene på det numeriske tastaturet).</p><p>Angi hvilke utsagn nedenfor som er korrekt vedrørende sertifikatet.<br>Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p><p><strong>Velg opp til 2 alternativer</strong></p>",
        figur: {
          beskrivelse: "To skjermbilder side om side fra nettleserens sertifikatvisning. Øverst tre faner: «uio.no», «GEANT OV ECC CA 4» og «USERTrust ECC Certification Authority» (sertifikatkjeden). Venstre del: Subject Name (land NO, Oslo, organisasjon Universitetet i Oslo, Common Name uio.no), Issuer Name (land NL, GEANT Vereniging, GEANT OV ECC CA 4), Validity (Not Before / Not After, ett års gyldighet fra oktober 2022), Subject Alt Names (bl.a. uio.no og www.uio.no) og Public Key Info (Algorithm: Elliptic Curve, Key Size 256, Curve P-256, Public Value som en lang heksadesimal streng). Høyre del: Miscellaneous (Serial Number, Signature Algorithm ECDSA with SHA-256, Version 3), Fingerprints (SHA-256 og SHA-1), Basic Constraints (Certificate Authority: No), Key Usages (Purposes: Digital Signature), Extended Key Usages (Server Authentication, Client Authentication), Subject Key ID, Authority Key ID og CRL Endpoints.",
          tekst: ["uio.no", "GEANT OV ECC CA 4", "USERTrust ECC Certification Authority", "Elliptic Curve", "P-256", "ECDSA with SHA-256", "Digital Signature", "Server Authentication, Client Authentication"]
        },
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
          regelMerknad: "«Velg opp til 2 alternativer».",
          alternativer: [
            "Sertifikatet kan brukes til å validere digital signatur.",
            "Sertifikatet inneholder tjenerens private nøkkel.",
            "Sertifikated kan brukes til å dekryptere.",
            "Sertifikatet inneholder tjenerens offentlige nøkkel.",
            "Sertifikatet kan brukes til å kryptere.",
            "Sertifikatet kan brukes til å lage digital signatur."
          ],
          svar: [0, 3],
          explain: [
            "<p>Riktig. Nøkkelbruken er «Digital Signature», og med den offentlige nøkkelen i sertifikatet kan alle validere tjenerens signaturer.</p>",
            "<p>Nei. Private nøkler står aldri i sertifikater.</p>",
            "<p>Nei. Dekryptering krever en privat nøkkel, og den står ikke i sertifikatet.</p>",
            "<p>Riktig. Hele poenget med sertifikatet er å binde uio.no til tjenerens offentlige nøkkel (her en EC-nøkkel, P-256).</p>",
            "<p>Nei. Nøkkelen er en EC-nøkkel som bare er godkjent for digital signatur, ikke for kryptering.</p>",
            "<p>Nei. Å lage signaturer krever den private nøkkelen. Med sertifikatet kan man bare sjekke dem.</p>"
          ]
        },
        avvik: null,
        losning: ["Se på «Public Key Info» og «Key Usages»: offentlig EC-nøkkel, bruk = Digital Signature.", "Med offentlig nøkkel + signaturbruk kan man bare validere signaturer."],
        tips: ["Et sertifikat kan aldri lage signaturer eller dekryptere. Begge deler krever privat nøkkel."]
      },

      /* ================= DEL 7 ================= */
      {
        key: "H2022-7.1", year: "H2022", oppgave_nr: "Oppgave 7.1", del: D7,
        ark: "7.1 Internettstakken", title: "Protokoll → lag i internettstakken",
        points: 4, block: "nettverk", tema: ["internettstakken", "TLS", "IPsec", "QUIC"], gjenganger: ["H2021-5.1", "H2021-5.2", "H2024-28", "H2025-22"], ordrett: true,
        oppgave: "<p>Her skal du matche protokoll/utsagn mot riktig lag i internett-stakken (0,5 poeng for riktig svar, -0,5 for feil svar, 0 poeng for å ikke svare).<br>Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, 4 for alle riktig, minimum 0.</p><p><strong>Finn riktig lag i internettstakken</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, 4 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 4 },
          kolonner: ["Transportlaget", "Applikasjonslaget", "Internettlaget", "Ingen av gitt lag"], multi: false,
          rader: [
            { s: "HTTP protokollen", svar: [1], explain: "<p>HTTP er protokollen mellom nettleser og webtjener, altså applikasjonslaget.</p>" },
            { s: "TCP protokollen", svar: [0], explain: "<p>TCP gir pålitelig forbindelse mellom porter: transportlaget.</p>" },
            { s: "Laget du finner IP-sec", svar: [2], explain: "<p>IPsec beskytter IP-pakkene selv og ligger i internettlaget (IP-laget). Den har ikke port.</p>" },
            { s: "TLS-record protokollen", svar: [0], explain: "<p>Kurset plasserer TLS Record, som krypterer selve datastrømmen, i transportlaget.</p>" },
            { s: "QUIC protokollen", svar: [0], explain: "<p>QUIC er en transportprotokoll (bygget på UDP) som erstatter TCP for bl.a. HTTP/3.</p>" },
            { s: "TLS-handshake protokollen", svar: [1], explain: "<p>Kurset plasserer TLS Handshake, som forhandler nøkler og sjekker sertifikater, i applikasjonslaget.</p>" },
            { s: "UDP protokollen", svar: [0], explain: "<p>UDP er transportlaget, uten forbindelse.</p>" },
            { s: "FTP protokollen", svar: [1], explain: "<p>FTP er filoverføring for brukere: applikasjonslaget.</p>" }
          ]
        },
        avvik: null,
        losning: ["Applikasjon: HTTP, FTP, TLS Handshake. Transport: TCP, UDP, QUIC, TLS Record. Internett: IPsec."],
        tips: ["TLS deles i to i kurset: Handshake = applikasjonslaget, Record = transportlaget."]
      },
      {
        key: "H2022-7.2", year: "H2022", oppgave_nr: "Oppgave 7.2", del: D7,
        ark: "7.2 TOR og VPN", title: "Tor: hvilken nøkkel i hvert lag?",
        points: 3, block: "nettverk", tema: ["Tor", "løkruting", "VPN"], ordrett: true,
        oppgave: "<p>Ola og Kari kommuniserer over TOR-nettverket, hvor 3 VPN forbindelser som ligger oppå hverandre brukes. Det er satt opp en forbindelse mellom Ola og Kari som bruker TOR-nodene A, B og C som vist under:</p><p>Ola skal sende en (internett)-pakke til Kari. Hvis hvordan TOR-pakken er bygd opp gjennom hvilken nøkkel som brukes for kryptering av hvert av de 3 VPN-lagene.<br>Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.</p>",
        figur: {
          beskrivelse: "Øverst en kjede fra venstre mot høyre: Ola (personikon) ↔ datamaskin A ↔ datamaskin B ↔ datamaskin C ↔ Kari (personikon), med dobbeltpiler mellom hvert ledd. Under ligger fire dra-bokser: «Nøkkel delt med Kari», «Nøkkel delt med C», «Nøkkel delt med A», «Nøkkel delt med B». Svarfiguren er tre avrundede bokser inni hverandre som en løk: ytterst blå, så grønn, så rosa, og innerst en grå boks med teksten «Pakke til Kari». Øverst i hver farget boks er et felt for en nøkkel.",
          tekst: ["Ola", "A", "B", "C", "Kari", "Pakke til Kari", "Nøkkel delt med Kari", "Nøkkel delt med C", "Nøkkel delt med A", "Nøkkel delt med B"]
        },
        inspera: {
          type: "D",
          regelTekst: "Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 3 for alle riktig, minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 3 },
          tekst: null,
          bank: ["Nøkkel delt med Kari", "Nøkkel delt med C", "Nøkkel delt med A", "Nøkkel delt med B"],
          felt: [
            { etikett: "Ytterste lag (blått)", svar: 2, godta: [], explain: "<p>A er første node. A skreller av ytterste lag, så det må være kryptert med nøkkelen Ola deler med A.</p>" },
            { etikett: "Midterste lag (grønt)", svar: 3, godta: [], explain: "<p>B er neste node og skreller av neste lag med nøkkelen delt med B.</p>" },
            { etikett: "Innerste lag (rosa)", svar: 1, godta: [], explain: "<p>C er siste node. Den fjerner siste lag og sender pakken videre til Kari.</p>" }
          ]
        },
        avvik: "«Hvis hvordan» i oppgaveteksten er skrivefeil i arket for «Vis hvordan».",
        losning: ["Ola krypterer innenfra og ut: først for C, så for B, så for A.", "Hver node fjerner bare sitt eget lag og ser bare forrige og neste ledd."],
        tips: ["«Nøkkel delt med Kari» er distraktor: Tor-lagene er mellom Ola og nodene. Ende-til-ende-kryptering til Kari er noe annet (f.eks. TLS inni)."]
      },
      {
        key: "H2022-7.3", year: "H2022", oppgave_nr: "Oppgave 7.3", del: D7,
        ark: "7.3 Brannmurer og inntrengningsdeteksjon", title: "Brannmur eller IDS?",
        points: 3, block: "nettverk", tema: ["brannmur", "IDS", "tilstandsbasert"], gjenganger: ["H2021-5.4", "H2025-24"], ordrett: true,
        oppgave: "<p>Velg hvilke alternativer som er riktig (hvert utsagn kan ha flere riktige svar).<br>Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, 3 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "FF",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ubesvart, 3 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
          regelMerknad: "To spørsmål med egne avkrysningsbokser. Her slått sammen til én liste; alternativ 1–2 hører til første spørsmål, 3–6 til andre (se grupper).",
          grupper: [
            { sporsmal: "Kan brukes til å filtrere ut uønskede nettverkspakker", fra: 0, til: 1 },
            { sporsmal: "Vi ønsker å akseptere (bare) pakker som er en del av en eksisterende TCP-sesjon i en viss retning. Hvilke løsninger kan brukes?", fra: 2, til: 5 }
          ],
          alternativer: ["Inntrengningsdeteksjon (IDS)", "Brannmur", "Applikasjonsbrannmur", "Signatur-basert deteksjon", "Tilstandsløs brannmur", "Tillstandsbasert brannmur"],
          svar: [1, 2, 5],
          explain: [
            "<p>Nei. En IDS oppdager og varsler, men stopper ikke pakker. Det gjør en IPS.</p>",
            "<p>Riktig. Å slippe gjennom eller stoppe pakker etter regler er brannmurens jobb.</p>",
            "<p>Riktig ifølge fasiten. En applikasjonsbrannmur (proxy) avslutter og følger selve forbindelsene, så den kjenner tilstanden.</p>",
            "<p>Nei. Signaturbasert deteksjon er en IDS-metode som ser etter kjente angrepsmønstre. Den sporer ikke sesjoner.</p>",
            "<p>Nei. En tilstandsløs brannmur ser hver pakke for seg og husker ikke forbindelser.</p>",
            "<p>Riktig. En tilstandsbasert brannmur husker hvilke forbindelser som er etablert, og i hvilken retning.</p>"
          ]
        },
        avvik: "Med 0,5 per riktig avkrysning gir de tre riktige boksene bare 1,5 p, mens «Maks poeng» er 3. Arket sier ikke hvordan Inspera skalerte dette (trolig 1 p per riktig boks, eller også poeng for riktig blanke bokser).",
        losning: ["Filtrering = brannmur. IDS bare oppdager.", "Å følge TCP-sesjoner krever tilstand: tilstandsbasert brannmur, og en applikasjonsbrannmur som følger forbindelsene."],
        tips: ["IDS oppdager, IPS stopper. Tilstandsløs = pakke for pakke."]
      },

      /* ================= DEL 8 ================= */
      {
        key: "H2022-8.1", year: "H2022", oppgave_nr: "Oppgave 8.1", del: D8,
        ark: "8.1 Passordsikkerhet", title: "Tiltak for passorddatabasen",
        points: 2, block: "autentisering", tema: ["passord", "hashing", "salt", "regnbuetabell"], gjenganger: ["H2021-6.1", "H2023-9"], ordrett: true,
        oppgave: "<p>Velg riktig sikkerhetstiltak i en kolonne til høyre for å dekke hvert sikkerhetskrav i venstre kolonne.<br>Poeng: 0,5 for hver riktig, -0.5 for for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p><p><strong>Angi riktig sikkerhetstiltak for hvert krav</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig, -0.5 for for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          kolonner: ["Tilgangskontroll", "Salting", "Komplekse passord", "Hashing"], multi: false,
          rader: [
            { s: "Kun autoriserte skal kunne lese passorddatabasen.", svar: [0], explain: "<p>Hvem som får lese en fil, styres med tilgangskontroll.</p>" },
            { s: "Det skal være svært vanskelig å cracke et saltet passord fra databasen.", svar: [2], explain: "<p>Saltet er der allerede. Det som gjenstår mot gjetting, er at passordet selv er langt og vanskelig å gjette.</p>" },
            { s: "Passord skal ikke ligge i klartekst i passorddatabasen.", svar: [3], explain: "<p>Man lagrer hashverdien i stedet for passordet.</p>" },
            { s: "Det skal ikke være mulig å benytte forhåndsgenererte hash-tabeller for å cracke passord i databasen.", svar: [1], explain: "<p>Et tilfeldig salt per bruker gjør forhåndsberegnede tabeller (regnbuetabeller) verdiløse.</p>" }
          ]
        },
        avvik: null,
        losning: ["Lese-tilgang → tilgangskontroll. Ikke klartekst → hashing. Ikke forhåndstabeller → salting. Vanskelig å gjette selv med salt → sterke passord."],
        tips: ["Salt stopper ikke gjetting av ett og ett passord. Det stopper bare ferdigberegnede tabeller."]
      },
      {
        key: "H2022-8.2", year: "H2022", oppgave_nr: "Oppgave 8.2", del: D8,
        ark: "8.2 Biometris system", title: "Biometri: TMR, TNMR, FMR, FNMR",
        points: 2, block: "autentisering", tema: ["biometri", "FMR", "FNMR", "terskel"], gjenganger: ["H2021-6.2"], ordrett: true,
        oppgave: "<p>Statistiske egenskaper ved et biometrisk system reflekterer systemets kvalitet, som illustrert i figuren over.<br>Et biometrisk system blir testet med 100 genuine brukere som forsøker å logge inn på egen konto, og 100 ikke-genuine brukere som forsøker å logge inn på en annen konto enn sin egen.<br>Anta at 96 genuine brukere og 6 ikke-genuine brukere blir godtatt.<br>Oppgi følgende rater som et desimaltall (bruk punktum som skille melliom heltall og desimaltall).<br>Merk at ratene ikke har noen sammenheng med størrelsen på feltene i figuren over.</p>",
        figur: {
          beskrivelse: "Diagram med tittelen «Statistiske egenskaper ved et biometrisk system». Loddrett akse: «sannsynlighet p (frekvens)». Vannrett akse: «skåring S». To klokkeformede kurver: til venstre «Skåringsfordeling for ikke-genuine brukere», til høyre (lavere og bredere) «Skåringsfordeling for genuine brukere». En loddrett strek ved terskelen T deler aksen i «non-match» (pil mot venstre) og «match» (pil mot høyre). Der kurvene overlapper, er to små skraverte områder: til venstre for T under genuin-kurven, merket «FNMR», og til høyre for T under ikke-genuin-kurven, merket «FMR».",
          tekst: ["Statistiske egenskaper ved et biometrisk system", "sannsynlighet p (frekvens)", "Skåringsfordeling for ikke-genuine brukere", "non-match", "match", "Skåringsfordeling for genuine brukere", "FNMR", "T", "FMR", "skåring S"]
        },
        inspera: {
          type: "T",
          regelTekst: "Poeng: 0.5 for riktig, 0 for feil eller ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: 0, blankt: 0, min: 0, maks: 2 },
          tekst: "<p>TMR (True Match Rate): {0}</p><p>TNMR (True Non-Match Rate): {1}</p><p>FMR (False Match Rate): {2}</p><p>FNMR (Nalse Non-Match Rate): {3}</p>",
          felt: [
            { etikett: "TMR", godta: ["0.96"], explain: "<p>96 av 100 genuine godtas: 96/100 = 0.96.</p>" },
            { etikett: "TNMR", godta: ["0.94"], explain: "<p>6 av 100 ikke-genuine godtas, så 94 avvises: 94/100 = 0.94.</p>" },
            { etikett: "FMR", godta: ["0.06"], explain: "<p>Ikke-genuine som feilaktig godtas: 6/100 = 0.06.</p>" },
            { etikett: "FNMR", godta: ["0.04"], explain: "<p>Genuine som feilaktig avvises: 4/100 = 0.04.</p>" }
          ]
        },
        avvik: "«Nalse Non-Match Rate» er skrivefeil i arket for «False Non-Match Rate».",
        losning: [
          "Genuine: 100 forsøk, 96 godtatt, 4 avvist. Ikke-genuine: 100 forsøk, 6 godtatt, 94 avvist.",
          "TMR = 96/100 = 0.96. FNMR = 4/100 = 0.04 (= 1 − TMR).",
          "FMR = 6/100 = 0.06. TNMR = 94/100 = 0.94 (= 1 − FMR)."
        ],
        tips: ["«Match» = godtatt. «False» = feil person/feil avgjørelse. Del alltid på antallet i riktig gruppe.", "Bruk punktum, ikke komma. Bare 0.96 osv. står i godkjentlista."]
      },
      {
        key: "H2022-8.3", year: "H2022", oppgave_nr: "Oppgave 8.3", del: D8,
        ark: "8.3 FIDO-autentisering", title: "FIDO2: elementer og rekkefølge",
        points: 5, block: "autentisering", tema: ["FIDO2", "passnøkkel", "utfordring–respons"], gjenganger: ["H2023-33", "H2025-25"], ordrett: true,
        oppgave: "<p>Figuren nedenfor viser scenario for brukerautentisering med FIDO 2.0-protokollen. Sett inn elementene i riktig felt, samt tallene 1,2,3 (i de små feltene) for å indikere rekkefølgen på meldingene.<br>Poeng: 0,5 for riktig, -0.5 for feil, 0 for ubesvart, 5 for alle riktig, minimum 0.</p>",
        figur: {
          beskrivelse: "Figur med tittelen «Brukerautentisering med FIDO 2.0». Tre aktører fra venstre: «Bruker» (personikon), «FIDO-enhet» (boks med mobil, sikkerhetsnøkkel, eID-kort, bærbar PC og en nøkkel) og «Autentiseringstjener» (boks med tjener, nøkkel og et skilt «PKI»). Øverst to vannrette piler med felt: én mellom Bruker og FIDO-enhet, én mellom FIDO-enhet og Autentiseringstjener. Mellom Bruker og FIDO-enhet: et felt og et lite tallfelt, pil mot høyre. Mellom FIDO-enhet og tjener: en pil mot venstre med et lite tallfelt og et felt, og under den en pil mot høyre med et felt og et lite tallfelt. Under FIDO-enheten og under tjeneren står ett felt hver. Dra-bokser: «Utfordring», «Respons», «Autentiseringsetappe 1», «3», «Offentlig FIDO-nøkkel», «2», «Autentiseringsetappe 2», «1», «Privat FIDO-nøkkel», «Autentikator(er)».",
          tekst: ["Brukerautentisering med FIDO 2.0", "Bruker", "FIDO-enhet", "Autentiseringstjener", "PKI"]
        },
        inspera: {
          type: "D",
          regelTekst: "Poeng: 0,5 for riktig, -0.5 for feil, 0 for ubesvart, 5 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 5 },
          tekst: null,
          bank: ["Utfordring", "Respons", "Autentiseringsetappe 1", "3", "Offentlig FIDO-nøkkel", "2", "Autentiseringsetappe 2", "1", "Privat FIDO-nøkkel", "Autentikator(er)"],
          felt: [
            { etikett: "Øverste pil, Bruker ↔ FIDO-enhet", svar: 2, godta: [], explain: "<p>Første etappe er mellom brukeren og enheten: brukeren låser opp enheten lokalt.</p>" },
            { etikett: "Øverste pil, FIDO-enhet ↔ Autentiseringstjener", svar: 6, godta: [], explain: "<p>Andre etappe er mellom enheten og tjeneren, over nettet.</p>" },
            { etikett: "Pil Bruker → FIDO-enhet", svar: 9, godta: [], explain: "<p>Brukeren viser autentikator(er) til enheten, f.eks. PIN eller fingeravtrykk.</p>" },
            { etikett: "Tallfelt ved pil Bruker → FIDO-enhet", svar: 5, godta: [], explain: "<p>Steg 2: når enheten har fått utfordringen, låser brukeren den opp.</p>" },
            { etikett: "Tallfelt ved pil tjener → enhet", svar: 7, godta: [], explain: "<p>Steg 1: tjeneren starter med å sende en utfordring.</p>" },
            { etikett: "Pil tjener → FIDO-enhet", svar: 0, godta: [], explain: "<p>Tjeneren sender en tilfeldig utfordring.</p>" },
            { etikett: "Pil FIDO-enhet → tjener", svar: 1, godta: [], explain: "<p>Enheten sender tilbake responsen: utfordringen signert med den private nøkkelen.</p>" },
            { etikett: "Tallfelt ved pil FIDO-enhet → tjener", svar: 3, godta: [], explain: "<p>Steg 3: responsen sendes til slutt.</p>" },
            { etikett: "Under FIDO-enheten", svar: 8, godta: [], explain: "<p>Den private FIDO-nøkkelen forlater aldri enheten.</p>" },
            { etikett: "Under Autentiseringstjeneren", svar: 4, godta: [], explain: "<p>Tjeneren har bare den offentlige nøkkelen og sjekker signaturen med den.</p>" }
          ]
        },
        avvik: "Tallene i de tre små feltene er klippet bort i det synlige bildet (bare grønne haker vises). Plasseringen 1 (ved Utfordring), 2 (ved Autentikator(er)) og 3 (ved Respons) er lest fra PDF-ens tekstlag, der tallene står ved feltene. Den stemmer med protokollens logikk.",
        losning: ["Etappe 1 = bruker ↔ enhet (lokalt). Etappe 2 = enhet ↔ tjener (nett).",
          "Rekkefølge: 1 tjener sender utfordring, 2 bruker låser opp enheten med autentikator, 3 enheten sender respons.",
          "Privat nøkkel på enheten, offentlig nøkkel på tjeneren."],
        tips: ["Tjeneren lagrer bare offentlige nøkler. Lekker databasen, er ingen hemmeligheter tapt.", "Dette er grunnlaget for passnøkler i dagens pensum."]
      },
      {
        key: "H2022-8.4", year: "H2022", oppgave_nr: "Oppgave 8.4", del: D8,
        ark: "8.4 Rammerk for e-Autentisering", title: "Nivå HØY og MODERAT",
        points: 1, block: "autentisering", tema: ["garantinivå", "eID", "BankID", "MinID"], gjenganger: ["H2021-6.4", "H2024-30"], ordrett: true,
        oppgave: "<p>Rammeverk for e-Autentisering og uavviselighet definerer autentiseringsnivåer for bruk i e-Forvaltning (online tjenester til innbyggere) i Norge. Ulike autentiseringsløsninger gir ulike autentiseringsnivåer.</p>",
        inspera: {
          type: "N",
          regelTekst: "Poeng: 0,5 for hver riktig, -0.5 for feil, 0 for ubesvart, 1 for begge riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 1 },
          tekst: "<p>Gi et eksempel på en løsning som gir nivå HØY: {0}.<br>Gi et eksempel på en løsning som bare gir nivå MODERAT: {1}</p>",
          felt: [
            { etikett: "Nivå HØY", valg: ["MinID", "BankID", "FIDO", "Biometri"], svar: 1, godta: [], explain: "<p>BankID gir høyt nivå i offentlige tjenester.</p>" },
            { etikett: "Bare nivå MODERAT", valg: ["MinID", "BankID", "Biometri", "FIDO"], svar: 0, godta: [], explain: "<p>MinID gir et lavere nivå og holder ikke til de mest sensitive tjenestene.</p>" }
          ]
        },
        avvik: null,
        losning: ["BankID = høyt. MinID = lavere (moderat/betydelig)."],
        tips: ["RAU-rammeverket er erstattet av eIDAS-nivåene lav/betydelig/høy i dagens pensum (RAU står ikke på 2026-lysarkene). Svar etter nivånavnet oppgaven bruker."]
      },

      /* ================= DEL 9 ================= */
      {
        key: "H2022-9.1", year: "H2022", oppgave_nr: "Oppgave 9.1", del: D9,
        ark: "9.1 Identitetsføderering", title: "Sentralisert eller distribuert ID og autentisering",
        points: 3, block: "iam", tema: ["føderering", "silo", "ID-porten", "OIDC"], gjenganger: ["H2021-7.1", "H2023-13"], ordrett: true,
        oppgave: "<p>I et domene for identitetsføderering kan forvaltning av identiteter være sentralisert eller distribusert, og forvaltning av autentisering kan være sentralisert eller distribuert. Angi alle mulige riktige alternativer for hvert tilfelle nedenfor. Merk at flere altarnativer er mulig.</p><p>Poeng: 0,2 for hver riktig, -0,2 for hver feil, 0 for ubesvart 3 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,2 for hver riktig, -0,2 for hver feil, 0 for ubesvart 3 for alle riktig, minimum 0.",
          regel: { riktig: 0.2, feil: -0.2, blankt: 0, min: 0, maks: 3 },
          regelMerknad: "I Inspera er dette seks grupper med avkrysningsbokser (FF-type). Hver avkrysset boks er en enhet: 15 riktige bokser × 0,2 = 3. Kolonneetikettene varierer litt i arket («distr. Aut.», «sentr. Aud»).",
          kolonner: ["sentr. ID", "distr. ID", "sentr. Aut", "distr. Aut"], multi: true,
          rader: [
            { s: "OpenID Connect-protokollen (OIDC) støtter:", svar: [0, 1, 2, 3], explain: "<p>OIDC er bare en protokoll for å sende identitetsbilletter. Den kan brukes uansett hvordan identitet og autentisering er organisert.</p>" },
            { s: "ID-porten har følgende karakteristikker:", svar: [0, 3], explain: "<p>Identiteten er sentral (fødselsnummeret fra Folkeregisteret), men autentiseringen gjøres av flere leverandører (BankID, MinID, Buypass …).</p>" },
            { s: "ID-føderering på Internett med fb, google og twitter etc. har følgende karakteristikker:", svar: [1, 3], explain: "<p>Hver tjeneste har sine egne identiteter og autentiserer selv. Ingen sentral part styrer det.</p>" },
            { s: "Silo-modellen for identitetshåndtering har følgende karakteritikker;", svar: [0, 2], explain: "<p>I siloen er SP og IdP samme enhet, og den styrer både identitet og autentisering alene.</p>" },
            { s: "FIDO-autentisering kan brukes sammen med følgende:", svar: [0, 1, 2, 3], explain: "<p>FIDO er en autentiseringsmetode og kan brukes i alle organiseringsformer.</p>" },
            { s: "Hvis myndighetene i et land bruker personnummer (social security number) for e-Autentisering, så kreves følgende:", svar: [0], explain: "<p>Personnummer tildeles av én sentral myndighet, så identiteten er sentralisert. Autentiseringen kan organiseres på ulike måter, og fasiten krever bare sentr. ID.</p>" }
          ]
        },
        avvik: null,
        losning: ["Skill mellom hvem som eier identiteten og hvem som sjekker innloggingen.", "Protokoller og metoder (OIDC, FIDO) passer overalt. Modeller (silo, ID-porten, sosial innlogging) har bestemte kombinasjoner."],
        tips: ["ID-porten: sentral ID, distribuert autentisering. Det er et typisk eksamenspoeng."]
      },
      {
        key: "H2022-9.2", year: "H2022", oppgave_nr: "Oppgave 9.2", del: D9,
        ark: "9.2 SP og IdP", title: "Hva gjør SP og IdP?",
        points: 2, block: "iam", tema: ["SP", "IdP", "sikkerhetsbillett", "føderering"], ordrett: true,
        oppgave: "<p>Indiker hvilke(n) funksjon(er) som utføres henholdsvis av SP (Service Provider) og IdP (Identity Provider) som del av identitetsføderering.</p><p>Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 1 for hver riktig, -1 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 1, feil: -1, blankt: 0, min: 0, maks: 2 },
          regelMerknad: "I Inspera er dette to grupper med avkrysningsbokser (FF-type). Arket staver «Tylbyr tjenester» i IdP-gruppen.",
          kolonner: ["Tilbyr tjenester", "Autentiserer bruker", "Genererer sikkerhetsbillett", "Tar imot sikkerhetsbillett"], multi: true,
          rader: [
            { s: "SP utfører:", svar: [0, 3], explain: "<p>SP-en tilbyr tjenesten og tar imot billetten fra IdP-en som bevis på hvem brukeren er.</p>" },
            { s: "IdP utfører:", svar: [1, 2], explain: "<p>IdP-en autentiserer brukeren og lager sikkerhetsbilletten.</p>" }
          ]
        },
        avvik: "Fire riktige bokser × 1 p = 4, men «Maks poeng» er 2. Trolig gir hver rad (SP/IdP) 1 p når begge boksene er riktige; arket sier ikke hvordan Inspera skalerte.",
        losning: ["IdP: autentiserer og lager billett. SP: tilbyr tjeneste og godtar billett."],
        tips: ["SP = Relying Party: den stoler på IdP-en og autentiserer ikke selv."]
      },
      {
        key: "H2022-9.3", year: "H2022", oppgave_nr: "Oppgave 9.3", del: D9,
        ark: "9.3 MAC-modellen", title: "MAC-modellen: lese og skrive",
        points: 2, block: "iam", tema: ["MAC", "Bell-LaPadula", "klarering", "gradering"], ordrett: true,
        oppgave: "<p>MAC-modellen (Mandatory Access Control) for tilgangskontroll definerer tilgangsrettigheter basert på merker/labler, som kalles sikkerhetsklarering for brukere/subjekter og sikkerhetsgradering for data/objekter.<br>I MAC-modellen har brukere en fastsatt maks klarering, og velger en (lik eller lavere) aktuell klarering for hver økt. Angi for hvert tilfelle nedenfor hvilke(t) graderingsnivå(er) brukeren kan aksessere med enten LESE eller SKRIVE. Flere valg er mulig i hvert tilfelle.<br>Poeng: 0,2 for hver riktig, -0,2 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,2 for hver riktig, -0,2 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.2, feil: -0.2, blankt: 0, min: 0, maks: 2 },
          regelMerknad: "I Inspera er dette fire grupper med avkrysningsbokser (FF-type). 10 riktige bokser × 0,2 = 2.",
          kolonner: ["BEGRENSET", "KONFIDENSIELT", "HEMMELIG", "STRENGT HEMMELIG"], multi: true,
          rader: [
            { s: "Hva kan en bruker LESE som har maks klarering HEMMELIG og aktuell klarering HEMMELIG?", svar: [0, 1, 2], explain: "<p>Ikke les opp: man kan lese på aktuelt nivå og under.</p>" },
            { s: "Hva kan en bruker SKRIVE som har maks klarering HEMMELIG og aktuell klarering HEMMELIG?", svar: [2, 3], explain: "<p>Ikke skriv ned: man kan skrive på aktuelt nivå og over, så hemmelig informasjon ikke lekker til lavere nivåer.</p>" },
            { s: "Hva kan en bruker LESE som har maks klarering HEMMELIG, og aktuelt klarering KONFIDENSIELT?", svar: [0, 1], explain: "<p>Det er den aktuelle klareringen som gjelder i økta: KONFIDENSIELT og nedover.</p>" },
            { s: "Hva kan en bruker SKRIVE som har maks klarering HEMMELIG og aktuell klarering KONFIDENSIELT?", svar: [1, 2, 3], explain: "<p>Fra aktuelt nivå KONFIDENSIELT og oppover. Ved å senke økta kan brukeren skrive til et lavere nivå enn maks.</p>" }
          ]
        },
        avvik: null,
        losning: ["Bruk alltid den aktuelle klareringen.", "Les: likt eller lavere (ikke les opp). Skriv: likt eller høyere (ikke skriv ned)."],
        tips: ["Modellen (Bell-LaPadula) beskytter konfidensialitet, ikke integritet.", "Å skrive oppover virker rart, men det lekker ingenting: informasjonen går til et strengere nivå."]
      },
      {
        key: "H2022-9.4", year: "H2022", oppgave_nr: "Oppgave 9.4", del: D9,
        ark: "9.4 Attributtbasert tilgangskontroll", title: "ABAC-kategorier",
        points: 3, block: "iam", tema: ["ABAC", "attributter", "policy"], ordrett: true,
        oppgave: "<p>ABAC (Attribute Based Access Control) er en generell modell for tilgangskontroll som kan være basert på ulike kategorier med policyer/regler, funksjoner og attributter, som vist i figuren nedenfor. Tilordne hver policy/funksjon/attributt til riktig kategori i figuren.<br>Poeng: 0,5 for riktig, -0,5 for feil, 0 for ingen tilordning, 3 for alle riktig, minimum 0.</p>",
        figur: {
          beskrivelse: "ABAC-figur. Til venstre en person, «Subjekt-bruker», med en stiplet pil «forespørsel:» mot en sekskant i midten, «ABAC-funksjoner» (med tannhjul). Fra sekskanten går en stiplet pil «tilgang» mot en sylinder til høyre, «Objekt-ressurser». Røde stiplede piler går inn i sekskanten fra fire bokser: «AC-policyer» (grønn, over), «Kontekstattributter» (sky, oppe til høyre), «Subjektattributter» (grønn, under til venstre) og «Objektattributter» (oransje, under til høyre). «Forespørsels-attributter» (rosa parallellogram) står ved forespørsel-pila, uten rød pil. Hver av de fem boksene og sekskanten har ett felt. Dra-bokser: «MAC», «Beslutning», «Gradering», «Tidspunkt», «Klarering», «Tilgangsmodus».",
          tekst: ["AC-policyer", "Kontekstattributter", "Forespørsels-attributter", "ABAC-funksjoner", "Subjektattributter", "Objektattributter", "Subjekt-bruker", "Objekt-ressurser", "forespørsel:", "tilgang"]
        },
        inspera: {
          type: "D",
          regelTekst: "Poeng: 0,5 for riktig, -0,5 for feil, 0 for ingen tilordning, 3 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 3 },
          tekst: null,
          bank: ["MAC", "Beslutning", "Gradering", "Tidspunkt", "Klarering", "Tilgangsmodus"],
          felt: [
            { etikett: "AC-policyer", svar: 0, godta: [], explain: "<p>MAC (Mandatory Access Control) er en tilgangspolicy, og ABAC kan uttrykke den. Her betyr MAC ikke meldingsautentiseringskode.</p>" },
            { etikett: "Kontekstattributter", svar: 3, godta: [], explain: "<p>Tidspunktet sier noe om situasjonen, ikke om subjekt eller objekt.</p>" },
            { etikett: "Forespørsels-attributter", svar: 5, godta: [], explain: "<p>Forespørselen sier hva brukeren vil gjøre: lese, skrive osv. Det er tilgangsmodusen.</p>" },
            { etikett: "ABAC-funksjoner", svar: 1, godta: [], explain: "<p>Funksjonen tar en beslutning (tillat/avvis) ut fra policy og attributter.</p>" },
            { etikett: "Subjektattributter", svar: 4, godta: [], explain: "<p>Klarering er merket på brukeren (subjektet).</p>" },
            { etikett: "Objektattributter", svar: 2, godta: [], explain: "<p>Gradering er merket på dataene (objektet).</p>" }
          ]
        },
        avvik: null,
        losning: ["Subjekt → klarering, objekt → gradering, forespørsel → tilgangsmodus, kontekst → tidspunkt, policy → MAC, funksjon → beslutning."],
        tips: ["MAC betyr Mandatory Access Control her. Se på konteksten."]
      },

      /* ================= DEL 10 ================= */
      {
        key: "H2022-10.1", year: "H2022", oppgave_nr: "Oppgave 10.1", del: D10,
        ark: "10.1 Prosess for risikostyring", title: "Prosessen for risikostyring",
        points: 4, block: "risiko", tema: ["risikostyring", "risikovurdering", "håndteringsplan"], gjenganger: ["H2023-38"], ordrett: true,
        oppgave: "<p>Figuren nedenfor viser prosess for risikostyring der trinnene mangler beskrivelse. Sett inn elementene i riktig felt for å beskrive trinnene.<br>Poeng: 0,5 for riktig, -0.5 for feil, 0 for ubesvart, 4 for alle riktig , minimum 0.</p>",
        figur: {
          beskrivelse: "Flytdiagram med tittelen «Risikostyring for informasjonssikkerhet», i en blå stiplet ramme. Fire trinn under hverandre: trinn 1 (boks), trinn 2 (avrundet gul boks), et grønt rutersymbol «Beslutningspunkt 1» med utgangene N (pil tilbake opp til trinn 1) og J (ned), trinn 3 (boks), et rutersymbol «Beslutningspunkt 2» med N (pil tilbake opp til trinn 1) og J (ned), og trinn 4 (boks). Til høyre for trinn 1, 2 og 3 står en klamme «Består bl.a. av:» med ett felt hver. Til sammen sju felt. Dra-bokser: «Risikoanalyse», «Implementer sikkerhetstiltak», «Risikoreduksjon», «Risikovurdering», «Håndteringsplan», «Risikokriterier», «Planlegging».",
          tekst: ["Risikostyring for informasjonssikkerhet", "Består bl.a. av:", "Beslutningspunkt 1", "Beslutningspunkt 2", "N", "J"]
        },
        inspera: {
          type: "D",
          regelTekst: "Poeng: 0,5 for riktig, -0.5 for feil, 0 for ubesvart, 4 for alle riktig , minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 4 },
          tekst: null,
          bank: ["Risikoanalyse", "Implementer sikkerhetstiltak", "Risikoreduksjon", "Risikovurdering", "Håndteringsplan", "Risikokriterier", "Planlegging"],
          felt: [
            { etikett: "Trinn 1", svar: 6, godta: [], explain: "<p>Først planlegges arbeidet: omfang, kontekst og kriterier.</p>" },
            { etikett: "Trinn 1 består bl.a. av", svar: 5, godta: [], explain: "<p>I planleggingen bestemmer man risikokriteriene, altså hva som er akseptabel risiko.</p>" },
            { etikett: "Trinn 2", svar: 3, godta: [], explain: "<p>Så vurderes risikoen.</p>" },
            { etikett: "Trinn 2 består bl.a. av", svar: 0, godta: [], explain: "<p>Risikovurdering omfatter blant annet risikoanalysen (å finne og anslå risikoene).</p>" },
            { etikett: "Trinn 3", svar: 4, godta: [], explain: "<p>Ut fra vurderingen lages en plan for hvordan risikoene skal håndteres.</p>" },
            { etikett: "Trinn 3 består bl.a. av", svar: 2, godta: [], explain: "<p>Håndteringsplanen sier blant annet hvordan risiko skal reduseres.</p>" },
            { etikett: "Trinn 4", svar: 1, godta: [], explain: "<p>Til slutt settes tiltakene ut i livet.</p>" }
          ]
        },
        avvik: "Figuren har sju felt × 0,5 = 3,5 p, men «Maks poeng» er 4. Arket sier ikke hvordan Inspera skalerte.",
        losning: ["Planlegging (risikokriterier) → Risikovurdering (risikoanalyse) → BP1 → Håndteringsplan (risikoreduksjon) → BP2 → Implementer sikkerhetstiltak."],
        tips: ["Risikoanalyse er en del av risikovurderingen, ikke omvendt."]
      },
      {
        key: "H2022-10.2", year: "H2022", oppgave_nr: "Oppgave 10.2", del: D10,
        ark: "10.2 Beslutningspunkter", title: "Beslutningspunkt 1 eller 2?",
        points: 2, block: "risiko", tema: ["beslutningspunkt", "restrisiko", "risikostyring"], gjenganger: ["H2024-33"], ordrett: true,
        oppgave: "<p>Til venstre beskrives noen utsagn vedrørende risikostyring som er relevante enten for beslutningspunkt 1 eller for beslytningspunkt 2 i henhold til figuren for risikostyring i forrige oppgave [<a href=\"06-risiko.html#fane=eksamen&amp;oppg=o-H2022-10_1\">figuren i oppgave 10.1</a>]. Velg hvilket beslutningspunkt som er relevant for hvert utsagn.<br>Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.</p><p><strong>Velg riktig beslutningspunkt</strong></p>",
        inspera: {
          type: "M",
          regelTekst: "Poeng: 0,5 for hver riktig, -0,5 for hver feil, 0 for ubesvart, 2 for alle riktig, minimum 0.",
          regel: { riktig: 0.5, feil: -0.5, blankt: 0, min: 0, maks: 2 },
          kolonner: ["Punkt 1", "Punkt 2"], multi: false,
          rader: [
            { s: "Dårlig spredning av risikoer", svar: [0], explain: "<p>Punkt 1 spør om vurderingen er god nok. Ligger alle risikoene på samme nivå, er det vanskelig å prioritere, og vurderingen bør gjøres om.</p>" },
            { s: "Passe restrisiko, men utilstrekkelig budsjett for sikkerhetstiltak", svar: [1], explain: "<p>Punkt 2 spør om håndteringsplanen kan godtas. En plan uten penger kan ikke gjennomføres.</p>" },
            { s: "For stor uvisshet rundt risikoer", svar: [0], explain: "<p>Er det for mye usikkerhet, er vurderingen ikke god nok. Gå tilbake før en plan lages.</p>" },
            { s: "For høy restrisiko i henhold til kriterier", svar: [1], explain: "<p>Restrisiko er det som er igjen etter planlagte tiltak. Den vurderes i punkt 2.</p>" }
          ]
        },
        avvik: "«Forrige oppgave» er oppgave 10.1, der prosessfiguren står. Lenken i hakeparentes er lagt til av guiden.",
        losning: ["Punkt 1 (etter risikovurdering): er vurderingen god nok?", "Punkt 2 (etter håndteringsplan): er restrisikoen og planen akseptabel?"],
        tips: ["Ordet «restrisiko» eller «budsjett for tiltak» peker mot punkt 2."]
      },
      {
        key: "H2022-10.3", year: "H2022", oppgave_nr: "Oppgave 10.3", del: D10,
        ark: "10.3 Kvantitativ risikovurdering", title: "Kvantitativ risiko og ROI",
        points: 4, block: "risiko", tema: ["kvantitativ risiko", "sannsynlighet", "konsekvens", "ROI"], ordrett: true,
        oppgave: "<p>Denne oppgaven ser på kvantitativ risikovurdering. En risiko er vurdert slik at hendelsen vil inntreffe gjennomsnittlig en gang hvert andre år.  Som følge av hendelsen forventes tapt fortjeneste på NOK 1 000 000  og utgifter til gjenoppretting på NOK 500 000.</p>",
        inspera: {
          type: "T",
          regelTekst: "Poeng: 1 for riktig. 0 for feil eller ubesvart, 4 for alle riktig, minimum 0.",
          regel: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: 4 },
          tekst: "<p>Oppgi hendelsens sannsynlighet som desimaltall (med punktum) mellom 0 og 1: {0}</p><p>Oppgi kvantitativ konsekvens i NOK: {1} .</p><p>Oppgi kvantitativ risiko som tap per år i NOK: {2} .</p><p>Et sikkerhetstiltak som koster NOK 100 000 forventes å redusere den kvantitativ risikoen med NOK 500 000.</p><p>Oppgi ROI (Return on Investment) for sikkerhetstiltaket: {3}</p>",
          felt: [
            { etikett: "Sannsynlighet", godta: ["0.5"], explain: "<p>Én gang hvert andre år = 1/2 = 0.5 per år.</p>" },
            { etikett: "Konsekvens (NOK)", godta: ["1500000"], explain: "<p>Tapt fortjeneste + gjenoppretting = 1 000 000 + 500 000 = 1 500 000.</p>" },
            { etikett: "Risiko (NOK per år)", godta: ["750000"], explain: "<p>Sannsynlighet × konsekvens = 0.5 × 1 500 000 = 750 000.</p>" },
            { etikett: "ROI", godta: ["4"], explain: "<p>(Gevinst − kostnad) / kostnad = (500 000 − 100 000) / 100 000 = 4.</p>" }
          ]
        },
        avvik: "ROI-formelen står ikke i oppgaven. Fasiten 4 stemmer med (risikoreduksjon − kostnad) / kostnad. Ren risikoreduksjon / kostnad ville gitt 5. Godkjentlistene har ingen mellomrom eller tusenskille, så bare «1500000» og «750000» godtas.",
        losning: [
          "Sannsynlighet per år: 1 gang per 2 år = 0.5.",
          "Konsekvens: 1 000 000 + 500 000 = 1 500 000 NOK.",
          "Kvantitativ risiko = sannsynlighet × konsekvens = 0.5 × 1 500 000 = 750 000 NOK per år.",
          "Nettogevinst av tiltaket: 500 000 − 100 000 = 400 000 NOK.",
          "ROI = nettogevinst / kostnad = 400 000 / 100 000 = 4."
        ],
        tips: ["Skriv tall uten mellomrom og med punktum som desimaltegn.", "Kvantitativt brukes produktet sannsynlighet × konsekvens. Med logaritmiske nivåer (kvalitativt) summeres de i stedet.", "ROI og kvantitativ risiko i kroner står ikke på 2026-lysarkene, men ISM-arket nevner balansen mellom ressursbruk og risikoreduksjon."]
      }
    ]
  };

  /* ================= PERFEKT SVAR / HVORFOR ================= */
  function P(key, eli5, normal, teknisk) {
    IN.PERFEKT[key] = { type: "eksamen", hvorfor: { eli5: "<p>" + eli5 + "</p>", normal: "<p>" + normal + "</p>", teknisk: "<p>" + teknisk + "</p>" } };
  }

  P("H2022-1.1",
    "Er en hemmelighet sladret, ødelagt eller låst inne? Det avgjør hvilket mål som er brutt.",
    "Konfidensialitet brytes når uvedkommende får se noe. Integritet brytes når noe endres uten lov. Tilgjengelighet brytes når rettmessige brukere ikke kommer til.",
    "Se på hva angrepet gjør med dataene. Avlytting og lekkasje gir K. Endring og forfalskning gir I. Tjenestenekt og løsepengevirus som låser data gir T. Løsepengevirus er T selv om det også kan lekke data, fordi hovedeffekten er at data blir utilgjengelige.");
  P("H2022-1.2",
    "Gullet er verdien. Tyven er trusselen. Et åpent vindu er sårbarheten. Innbruddet er hendelsen, og det du taper er konsekvensen.",
    "Risiko er kombinasjonen av en trussel, sårbarhetene den kan utnytte og verdiene som kan rammes. Hvor stor risikoen er (risikonivået), måles med sannsynlighet og konsekvens. En hendelse skjer når en trussel utnytter en sårbarhet mot en verdi.",
    "Begrepene henger sammen i en kjede: trussel → utnytter sårbarhet → hendelse → rammer verdi → konsekvens. Risiko er selve kombinasjonen trussel–sårbarhet–verdi; risikonivået er en funksjon av sannsynlighet og konsekvens for hendelsen (t06). Når du skal plassere et utsagn, spør du hvilket ledd i kjeden det beskriver.");
  P("H2022-1.3",
    "Først får du et medlemskort og en nøkkel. Senere viser du kortet i døra og slipper inn der du har lov.",
    "IAM har en konfigureringsfase (registrere, klargjøre, autorisere) og en bruksfase (bruker-ID, autentikator, tilgangskontroll). Brukerautentisering er en del av identitetshåndteringen; tilgangshåndtering er autorisering og tilgangskontroll.",
    "Identitetshåndtering: registrering, klargjøring, og i bruksfasen å oppgi ID og autentikator. Brukerautentisering: bare de to bruksstegene ID og autentikator. Tilgangshåndtering: autorisering (å fastsette policy) i konfigureringsfasen og tilgangskontroll i bruksfasen. Autorisering betyr å bestemme reglene, ikke å sjekke dem.");
  P("H2022-2.1",
    "En oppskrift i en bok (fil) blir til kokkens arbeid (prosess) på kjøkkenbenken (minnet) med kokken (CPU).",
    "En kjørbar fil på disk lastes inn i minnet av operativsystemet og blir en prosess. Prosessens instruksjoner utføres av CPU-en.",
    "Lasteren kopierer kode og data fra filen til prosessens virtuelle adresserom. Deretter planlegger OS-et prosessen på CPU-en. Skillet mellom fil (statisk) og prosess (kjørende instans) er grunnlaget for isolasjon og tilgangskontroll.");
  P("H2022-2.2",
    "Hvert program tror det har sitt eget hus, men vaktmesteren (OS-et) bestemmer hvor husene faktisk står.",
    "Virtuelt minne gir hver prosess sitt eget adresserom. OS-et og maskinvaren oversetter til fysiske adresser, og prosesser kan ikke fritt lese hverandres minne.",
    "Sidetabellene styres av kjernen, og MMU-en håndhever dem. Derfor kan ikke en vanlig prosess styre oversettelsen selv. Isolasjonen er en sikkerhetsmekanisme, ikke bare en minneteknikk.");
  P("H2022-2.3",
    "Det er lappen som sier hvor programmet skal gå tilbake etterpå. Skriver noen over lappen, går programmet feil vei.",
    "Ved bufferoverflyt på stakken skriver angriperen forbi en buffer og over returadressen. Da hopper programmet til angriperens valgte sted når funksjonen returnerer.",
    "Lokale variabler ligger under lagret rammepeker og returadresse i stakkrammen. Overflyt skriver mot høyere adresser og treffer returadressen. Mottiltak er blant annet stakkkanarier, ikke-kjørbar stakk og ASLR.");
  P("H2022-2.4",
    "Flere leiligheter (gjeste-OS) i én bygård, med en vaktmester (hypervisor) rett på grunnmuren (maskinvaren).",
    "Type 1-hypervisor kjører direkte på maskinvaren. Over den kjører gjeste-OS-ene, og appene kjører i gjeste-OS-ene.",
    "En type 1-hypervisor (bare metal) har ikke noe vert-OS under seg, i motsetning til type 2. Hver VM har sin egen kjerne, så isolasjonen er sterkere enn for kontainere.");
  P("H2022-2.5",
    "Kontainere er rom i samme leilighet: de deler kjøkkenet (vert-OS-kjernen).",
    "Kontainere kjører på en kontainermotor (Docker Engine) over et felles vert-OS og maskinvare. De har ikke egne gjeste-OS.",
    "Alle kontainere deler vertskjernen og isoleres med kjernemekanismer som navnerom og cgroups. Det gjør dem lettere enn VM-er, men et kjernehull rammer alle kontainerne.");
  P("H2022-2.6",
    "UEFI er den som starter maskinen og sjekker hvem som får starte. TPM er en liten safe som husker målinger og passer på nøkler.",
    "UEFI står for oppstarten og kan gjøre sikker oppstart (Secure Boot). TPM er en sikker brikke som lagrer nøkler og måler oppstarten.",
    "Secure Boot i UEFI sjekker signaturer på oppstartskomponenter og stopper usignert kode. TPM lagrer målinger i PCR-registre (målt oppstart) og kan forsegle nøkler til en kjent tilstand. Begge brukes sammen for en pålitelig oppstartskjede.");
  P("H2022-3.1",
    "Hvis vaktene (UAC) er sendt hjem, får inntrengeren gå rett inn med sjefens nøkler.",
    "Uten UAC kjører en administratorbruker programmer med fulle rettigheter. Skadevare arver da administratorrettighetene.",
    "UAC lar en administrator normalt kjøre med begrenset token og krever bekreftelse før heving. Uten den får skadevare som brukeren starter, administratorrettigheter direkte. Det bryter prinsippet om minste privilegium.");
  P("H2022-3.2",
    "Samme lokkemat sendes til tusenvis, i håp om at noen biter.",
    "Masse-phishing sendes bredt og er ikke tilpasset en bestemt person, som en generell Netflix-e-post.",
    "Spear-phishing er rettet mot en bestemt person med tilpasset innhold. Hvalfangst (whaling) retter seg mot ledere. En generisk e-post fra en stor tjeneste til mange mottakere er masse-phishing.");
  P("H2022-3.3",
    "Å bryte seg inn i andres datamaskin er straffbart, og loven sier hvor strengt.",
    "Straffeloven § 204 gjelder innbrudd i datasystem. Strafferammen er bøter eller fengsel i inntil to år.",
    "§ 204 rammer den som bryter en beskyttelse eller skaffer seg tilgang på annen uberettiget måte. Merk at selve forsøket på å skaffe seg tilgang uten lov også kan være straffbart.");
  P("H2022-3.4",
    "Trojaneren lurer deg til å slippe den inn. Viruset gjemmer seg i andre filer. Ormen sprer seg selv. Bakdøra er en hemmelig inngang.",
    "Trojaner = ser nyttig ut men er skadelig. Virus = trenger en vertsfil. Orm = sprer seg selv over nett. Bakdør = skjult tilgang.",
    "Skillet går på spredning og forkledning. Virus krever at vertsprogrammet kjøres. Orm sprer seg uten brukerens hjelp. Trojaner sprer seg ikke selv, men forkler seg. Bakdør er en funksjon (skjult tilgang) og kan installeres av hvilken som helst av de andre.");
  P("H2022-3.5",
    "Løsepengevirus låser tingene dine og krever penger for nøkkelen.",
    "Løsepengevirus krypterer eller låser data og bryter dermed først og fremst tilgjengeligheten. En hashfunksjon som SHA-256 kan ikke kryptere, fordi den er enveis og uten nøkkel. Minste privilegium (ingen administratorrettigheter for vanlige brukere) begrenser hva løsepengeviruset når.",
    "Moderne varianter kombinerer kryptering med trussel om publisering (dobbel utpressing), men kjernen er tap av tilgjengelighet. Gode sikkerhetskopier som angriperen ikke når, og å ikke gi brukerne administratorrettigheter, er blant de viktigste mottiltakene.");
  P("H2022-3.6",
    "Noen ganger går du i en felle på en nettside, noen ganger kommer ormen av seg selv, og noen ganger blir du lurt i en e-post.",
    "Angrepsvektoren er veien angrepet kommer inn: drive-by (besøk på infisert nettside), automatisk spredning (orm) eller phishing (lurer brukeren).",
    "Drive-by utnytter sårbarheter i nettleser eller tillegg uten at brukeren gjør noe annet enn å besøke siden. Automatisk spredning utnytter nettverkstjenester. Phishing utnytter mennesket. Klassifiser etter første inngang.");
  P("H2022-4.1",
    "Sikkerhet bygges inn i hvert steg, fra tegning til ferdig hus og opplæring av de som bor der.",
    "Innebygd sikkerhet (security by design) legger inn sikkerhetsaktiviteter i alle de sju fasene: opplæring, krav, design, koding, test, produksjonssetting og forvaltning.",
    "Kodeanalyse hører til koding, penetrasjonstest til test, herding og konfigurasjon til produksjonssetting, og bevisstgjøring til opplæring. Feil funnet tidlig er billigere å rette.");
  P("H2022-4.2",
    "STRIDE er en sjekkliste over måter noe kan gå galt på. OWASP-lista er de vanligste feilene i nettsider.",
    "Tampering (manipulasjon) bryter integritet. I OWASP Top 10 fra 2021, som oppgaven bruker, var SSRF nr. 10 og injeksjon nr. 3.",
    "Hver STRIDE-trussel motsvarer en sikkerhetsegenskap: Spoofing–autentisitet, Tampering–integritet, Repudiation–ubenektelighet (også kalt uavviselighet), Information disclosure–konfidensialitet, DoS–tilgjengelighet, Elevation of privilege–tilgangskontroll. SSRF får tjeneren til å sende forespørsler angriperen velger. Injeksjon blander data og kommando.");
  P("H2022-4.3",
    "Testeren får hele tegningen av huset før hun prøver å bryte seg inn.",
    "Hvitbokstest betyr at testeren har full innsikt (kildekode, dokumentasjon). Svartboks: ingen innsikt. Gråboks: delvis.",
    "Hvitboks lar testeren lete målrettet og finne mer på kort tid. Svartboks ligner mer på en ekstern angriper. Valget avhenger av formålet med testen.");

  IN.PERFEKT["H2022-4.4"] = {
    type: "skjonn",
    svar: [
      { del: "Svar", tekst: "<p>Brukeren får kjøre Python-tolken som root, og en tolk kan kjøre hvilken som helst kode. Sensorveiledningen godtar blant annet disse måtene (beskrevet på overordnet nivå):</p><ol><li><b>Start et skall fra tolken.</b> Koden kjører som root, så et skall startet fra den blir et root-shell.</li><li><b>Gi deg selv varig root-tilgang.</b> Skriv som root til systemfilene som styrer rettigheter, for eksempel ved å legge brukeren din inn i sudoers-fila eller opprette en ny bruker med root-rettigheter.</li><li><b>Hent passordhashene.</b> Les /etc/shadow som root og knekk root-passordet offline.</li></ol><p>Mottiltak: gi aldri sudo-tilgang til tolker, skall eller redigeringsprogram, tillat bare bestemte kommandoer med faste argumenter (minste privilegium), og logg bruken av sudo.</p>", poeng: ["Nevnt én konkret måte (f.eks. skall fra tolken)", "Nevnt en annen konkret måte (f.eks. sudoers/ny root-bruker eller passordhasher)"] }
    ],
    hvorfor: {
      eli5: "<p>Får du låne sjefens nøkkel for å åpne én dør, men nøkkelen passer i alle dører, kan du gå hvor du vil.</p>",
      normal: "<p>Hevede rettigheter for ett formål kan misbrukes hvis programmet kan mer enn formålet krever. Derfor skal regler for hevede rettigheter være så smale som mulig.</p>",
      teknisk: "<p>Privilegieeskalering skjer når en mekanisme for kontrollert heving (som sudo-regler) gir mer makt enn tiltenkt. Forsvaret er minste privilegium: smale regler, ingen programmer som kan starte vilkårlige underprosesser, revisjon og logging. Dette er en konfigurasjonssvakhet, ikke en programfeil.</p>"
    },
    sensor: {
      deler: [],
      merknad: "Sensorens modellsvar (qa-fila s. 16) har konkrete kommandoer og gjengis ikke ordrett. Måtene over er de samme som sensoren godtar, beskrevet med egne ord uten kode. Ekstrapoenget for tilnærmet fungerende kode dekkes ikke her."
    }
  };

  P("H2022-5.1",
    "Bare Alice har stempelet sitt (privat nøkkel), men alle kan sjekke stempelet med et bilde av det (offentlig nøkkel).",
    "Alice signerer med sin egen private nøkkel. Bob verifiserer med Alices offentlige nøkkel.",
    "Signaturen er S = Sig(H, K<sup>A</sup><sub>priv</sub>) der H = Hash(M). Verifisering: H = Ver(S, K<sup>A</sup><sub>pub</sub>), og sammenlign med H′ = Hash(M′). Fordi bare Alice har den private nøkkelen, gir signaturen autentisering av opphav og ubenektelighet.");
  P("H2022-5.2",
    "En hashfunksjon er en kvern: lett å male, umulig å sette sammen igjen.",
    "Hashfunksjoner har ingen nøkkel, gir fast lengde ut, og det skal være praktisk umulig å finne inndata fra hashverdien eller to inndata med samme hash.",
    "Egenskapene er enveis (preimage-motstand), svak og sterk kollisjonsmotstand. Hashing alene gir ikke konfidensialitet eller autentisering av opphav, fordi alle kan regne ut hashen. Kombinert med nøkkel (MAC) eller signatur får man autentisering.");
  P("H2022-5.3",
    "En MAC er et felles hemmelig håndtrykk mellom to venner. En signatur er en personlig underskrift alle kan sjekke.",
    "Begge gir integritet og autentisering av opphav. Bare digital signatur gir ubenektelighet, fordi MAC bruker en delt nøkkel.",
    "Med MAC kunne begge parter laget koden, så ingen tredjepart kan avgjøre hvem som sendte. Signatur bruker en privat nøkkel bare avsender har. MAC er raskere (symmetrisk). Ingen av dem gir konfidensialitet.");
  P("H2022-5.4",
    "Alle kan legge et brev i Bobs postkasse (offentlig nøkkel), men bare Bob har nøkkelen til å åpne den (privat nøkkel).",
    "Ved asymmetrisk kryptering krypterer avsender med mottakerens offentlige nøkkel, og mottaker dekrypterer med sin private nøkkel.",
    "C = E(M, K<sup>B</sup><sub>pub</sub>) og M = D(C, K<sup>B</sup><sub>priv</sub>). I praksis krypteres en symmetrisk sesjonsnøkkel asymmetrisk (hybrid kryptering), fordi asymmetrisk kryptering er treg.");
  P("H2022-5.5",
    "Du lager en hemmelig strøm av biter fra en teller, og blander den med meldingen.",
    "I CTR-modus krypteres en teller, og resultatet XOR-es med klarteksten: C<sub>i</sub> = E(T<sub>i</sub>, K) ⊕ M<sub>i</sub>.",
    "CTR gjør en blokkchiffer til en strømchiffer. Telleren må aldri gjentas med samme nøkkel, ellers lekker XOR av to klartekster. Blokkene kan regnes parallelt, og dekryptering bruker samme E-funksjon.");
  P("H2022-6.1",
    "Den som stjeler stempelet ditt, kan stemple i ditt navn og lese brev som er låst til deg.",
    "Med den private nøkkelen kan tyven signere som eieren og dekryptere det som er kryptert til eieren.",
    "Den private nøkkelen gir både signeringsevne og dekrypteringsevne. Sertifikatet må tilbakekalles (CRL/OCSP). Tyven kan ikke lage nye sertifikater fra CA-en eller endre det eksisterende sertifikatet.");
  P("H2022-6.2",
    "Bestefar (rot) går god for far (mellomliggende), som går god for barnet (subjekt).",
    "Rot-CA-en signerer seg selv og den mellomliggende CA-en. Den mellomliggende CA-en signerer subjektsertifikatet med sin private nøkkel.",
    "Sertifikater signeres med private nøkler, ikke med sertifikater. Kjeden verifiseres ved å sjekke hver signatur med den offentlige nøkkelen i sertifikatet ett nivå opp, helt til et rotsertifikat som ligger i tillitslageret.");
  P("H2022-6.3",
    "Du stoler på et ID-kort fordi du stoler på den som laget det.",
    "PKI flytter tillit: du stoler på en offentlig nøkkel fordi en CA du allerede stoler på, har signert den.",
    "Tillit til rotsertifikatet må etableres utenfor PKI-en (forhåndsinstallert). Et sertifikat sier hvem en nøkkel tilhører, ikke at eieren er ærlig. Tillit til en CA er tillit til at den sjekker identitet, ikke til innholdet på nettstedet.");
  P("H2022-6.4",
    "Sertifikatet er et ID-kort for nettstedet, så nettleseren vet at den snakker med riktig sted.",
    "TLS-sertifikatet brukes til å autentisere tjeneren. Nøkkelen i det brukes til å verifisere tjenerens signatur, ikke til å kryptere; krypteringsnøkkelen for økta avtales på annen måte.",
    "Nøkkelen i dette sertifikatet brukes bare til å verifisere tjenerens signatur i TLS-håndtrykket (Key Usage: Digital Signature, EC-nøkkel). Øktnøkkelen avtales med (EC)DH, ikke ved å kryptere med sertifikatnøkkelen. Sertifikatet sier ingenting om at nettstedet er trygt eller fritt for skadevare.");
  P("H2022-7.1",
    "Hver protokoll har sin etasje i huset.",
    "HTTP, FTP og TLS-håndtrykket er på applikasjonslaget. TCP, UDP, QUIC og TLS-record er på transportlaget. IPsec er på internettlaget.",
    "Kursets inndeling legger TLS-handshake i applikasjonslaget og TLS-record i transportlaget. QUIC går over UDP men gir transporttjenester. IPsec beskytter IP-pakker og hører til internettlaget.");
  P("H2022-7.2",
    "Meldingen pakkes som en løk: ytterste lag åpnes først av første node.",
    "I Tor krypteres meldingen lagvis. Det ytterste laget er for inngangsnoden (A), midten for mellomnoden (B), og det innerste for utgangsnoden (C).",
    "Klienten avtaler en sesjonsnøkkel med hver node. Hver node fjerner ett lag og ser bare forrige og neste hopp. Derfor vet ingen enkelt node både hvem som sender og hvor trafikken går.");
  P("H2022-7.3",
    "Brannmuren er dørvakten som stopper folk. IDS er alarmen som bare varsler.",
    "Brannmurer filtrerer trafikk. En tilstandsbasert brannmur husker forbindelser, og en applikasjonsbrannmur forstår innholdet. En IDS oppdager, men stopper ikke.",
    "Tilstandsløs pakkefiltrering ser én pakke om gangen. Tilstandsbasert filtrering holder en tabell over aktive forbindelser. IDS kan være signaturbasert eller anomalibasert, og blir til IPS hvis den også blokkerer.");
  P("H2022-8.1",
    "Lås skapet, ikke skriv passordet på lappen, strø salt så alle lapper blir ulike, og velg vanskelige passord.",
    "Tilgangskontroll begrenser hvem som leser databasen. Hashing hindrer klartekst. Salt hindrer forhåndsberegnede tabeller. Sterke passord gjør gjetting vanskelig.",
    "Med unikt salt må angriperen angripe hvert passord for seg. Det hjelper ikke mot ordbokangrep på ett svakt passord. Derfor trengs både salt, sterke passord og helst en treg hashfunksjon.");
  P("H2022-8.2",
    "Av 100 ekte brukere slapp 96 inn, og av 100 inntrengere slapp 6 inn.",
    "TMR og FNMR regnes av genuine forsøk, TNMR og FMR av ikke-genuine forsøk. TMR + FNMR = 1 og TNMR + FMR = 1.",
    "Terskelen T avveier FMR mot FNMR: høyere terskel gir lavere FMR (sikrere) men høyere FNMR (mer brysomt). Her: TMR = 0.96, FNMR = 0.04, FMR = 0.06, TNMR = 0.94.");
  P("H2022-8.3",
    "Tjeneren gir deg en gåte. Du låser opp nøkkelen din med fingeren, og nøkkelen svarer på gåten.",
    "FIDO2 bruker utfordring–respons: tjeneren sender en utfordring, brukeren låser opp enheten, og enheten signerer utfordringen med en privat nøkkel. Tjeneren verifiserer med den offentlige nøkkelen.",
    "Etappe 1 er lokal (PIN/biometri mot enheten), etappe 2 går over nettet (signatur mot tjeneren). Den private nøkkelen forlater aldri enheten, og nøklene er bundet til nettstedets opphav. Det gjør FIDO motstandsdyktig mot phishing og databaselekkasjer.");
  P("H2022-8.4",
    "Til de viktigste dørene trenger du den sterkeste nøkkelen.",
    "BankID gir høyt nivå. MinID gir et lavere nivå.",
    "Nivået avhenger av hvor sikkert identiteten ble sjekket ved utstedelse og hvor sterk autentiseringen er. Dagens pensum bruker eIDAS-nivåene lav, betydelig og høy.");
  P("H2022-9.1",
    "Hvem gir deg navnet (identitet), og hvem sjekker at det er deg (autentisering)? Det kan være én eller mange.",
    "Identitet og autentisering kan hver for seg være sentralisert eller distribuert. Protokoller som OIDC og metoder som FIDO passer til alle kombinasjoner.",
    "ID-porten: sentral identitet (fødselsnummer), distribuert autentisering (flere eID-leverandører). Silo: én part gjør alt. Sosial innlogging: mange uavhengige leverandører, hver med egne identiteter.");
  P("H2022-9.2",
    "Billettkontoret (IdP) sjekker hvem du er og gir deg en billett. Konsertlokalet (SP) slipper deg inn på billetten.",
    "IdP autentiserer brukeren og lager sikkerhetsbilletten. SP tilbyr tjenesten og tar imot billetten.",
    "SP stoler på IdP-en (tillitsforhold avtalt på forhånd) og verifiserer billettens signatur. Slik slipper SP-en å håndtere passord selv.");
  P("H2022-9.3",
    "Du får lese det som er like hemmelig eller mindre hemmelig enn deg, men bare skrive til samme eller høyere nivå, så hemmeligheter ikke siver ned.",
    "I MAC-modellen (Bell-LaPadula) gjelder: ikke les opp, ikke skriv ned, regnet fra aktuell klarering.",
    "Den enkle sikkerhetsegenskapen hindrer lesing over aktuelt nivå. *-egenskapen hindrer skriving under aktuelt nivå. Ved å velge lavere aktuell klarering kan brukeren skrive til lavere nivåer, men da også bare lese lavere.");
  P("H2022-9.4",
    "Dørvakten ser på hvem du er, hva du vil inn i, hva du vil gjøre og hva klokka er, og så bestemmer han.",
    "ABAC tar en beslutning ut fra subjekt-, objekt-, forespørsels- og kontekstattributter og en policy.",
    "Klarering er et subjektattributt, gradering et objektattributt, tilgangsmodus et forespørselsattributt og tidspunkt et kontekstattributt. ABAC er generell nok til å uttrykke MAC, DAC og RBAC som policyer.");
  P("H2022-10.1",
    "Først legger du en plan, så ser du hva som kan gå galt, så bestemmer du hva du gjør, og til slutt gjør du det.",
    "Risikostyring: planlegging (med risikokriterier), risikovurdering (med risikoanalyse), håndteringsplan (med risikoreduksjon), og implementering av tiltak.",
    "Beslutningspunktene gir tilbakeløkker: er vurderingen god nok, og er restrisikoen akseptabel? Hvis ikke går man tilbake. Prosessen er syklisk og gjentas over tid.");
  P("H2022-10.2",
    "Først sjekker du om kartet er godt nok. Så sjekker du om planen holder.",
    "Beslutningspunkt 1 gjelder kvaliteten på risikovurderingen. Beslutningspunkt 2 gjelder om håndteringsplanen og restrisikoen kan godtas.",
    "Uvisshet og dårlig spredning er svakheter i vurderingen (punkt 1). Restrisiko og budsjett er egenskaper ved planen (punkt 2).");
  P("H2022-10.3",
    "Skjer noe vondt annethvert år og koster 1,5 millioner, taper du i snitt 750 000 i året. Et tiltak til 100 000 som sparer 500 000: trekker du fra prisen, tjener du 400 000, altså fire ganger det tiltaket kostet.",
    "Kvantitativ risiko = sannsynlighet per år × konsekvens. ROI = (gevinst − kostnad) / kostnad.",
    "P = 0.5, K = 1 500 000, R = 750 000 NOK per år. ROI = (500 000 − 100 000) / 100 000 = 4. Kvantitative tall gir sammenlignbare beslutninger, men bygger på usikre anslag.");
})();
