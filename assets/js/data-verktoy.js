/* ============================================================
   IN2120 guide · data-verktoy.js
   Felles register over verktøyene som er vist i kurset (plan/foreleser-vektlegging.md § 6).
   Klassisk script, ingen DOM ved lasting. Leses av verktoy.html (viz-verktoy.js) og kan leses
   av blokksidene (4, 9, 10) og crash.

   Ramme (eierens beslutning 2026-11-26, «rett det mot eksamen»):
   - Annoterte utdata bare for forsvars- og administrasjonsutdata: nmap, Wireshark, sudo -l,
     iptables -L og Snort. Egne, oppdiktede data (192.0.2.0/24, 10.0.0.0/8).
   - Angrepsverktøyene (Hydra, unshadow, John, Hashcat, mimikatz, Metasploit, Burp/ZAP) bare på
     konseptnivå: hva, fase/MITRE, kjennetegn, forsvar, feller, eksamenskobling. Ingen kjørbare
     angrepskommandoer, ingen knekte passord, ingen oppskrifter. mimikatz vises bare via figuren H2024-24.

   IN.VERKTOY = {
     FASER, KAT, liste, get(id), forOppgave(key), alleOppgaver(), lenke(id), gjett, andre
   }
   verktøy = {
     id, navn, alias, kat (KAT.id), fase (FASER.id), rolle: "angrep"|"forsvar"|"begge",
     mitre: [{ id, navn, taktikk }], kurs: "d05 s. 26",
     kort, hva: { eli5, normal, teknisk }, kjenn: [html], forsvar?: [html],
     utdata?: [{ tittel, term, kommentar?, linjer: ["… [[n|felt]] …"], felt: [{ n, f, k }] }]
       [[n|tekst]] markerer et felt (indeks n i felt[]); k = indeks i kilder[].
     feller: [{ q, a }],
     eksamen: { spor: html, figurer: [key], oppgaver: [{ key, hva }] },
     kilder: [{ navn, url }]
   }
   gjett: [{ id, q, svar (verktøy-id eller tekst), valg: [tekst], answer, vis?: [linjer], tittel?, fig?: key, hvorfor }]
   Kildeliste: plan/sider/verktoy-kilder.md (lokal).
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});

  var FASER = [
    { id: "rekognosering", navn: "Rekognosering", kort: "Kartlegge nett, maskiner og tjenester" },
    { id: "innledende", navn: "Innledende tilgang", kort: "Første fot innenfor" },
    { id: "utvide", navn: "Utvide tilgangen", kort: "Mer tilgang enn du fikk først" },
    { id: "beskytte", navn: "Forsvar: beskytte", kort: "Stoppe trafikk som ikke skal fram" },
    { id: "oppdage", navn: "Forsvar: oppdage", kort: "Se og varsle når noe skjer" }
  ];
  var KAT = [
    { id: "kartlegging", navn: "Kartlegging og lytting" },
    { id: "passord", navn: "Passord" },
    { id: "rettigheter", navn: "Rettigheter og minnet" },
    { id: "utnytting", navn: "Utnytting og web" },
    { id: "forsvar", navn: "Brannmur og IDS" }
  ];

  var liste = [
    /* ===================== KARTLEGGING ===================== */
    {
      id: "nmap", navn: "nmap", alias: ["nmap", "n map", "network mapper"], kat: "kartlegging", fase: "rekognosering", rolle: "begge",
      mitre: [{ id: "T1046", navn: "Network Service Discovery", taktikk: "Discovery" }],
      kurs: "d05 s. 26–27, 31",
      kort: "Portskanner: hvilke maskiner svarer, hvilke porter er åpne, og hva kjører bak dem.",
      hva: {
        eli5: "<p>Tenk deg at du banker forsiktig på alle dørene i et hus. Noen dører åpnes, noen sier «ingen hjemme», og noen svarer ikke i det hele tatt. nmap gjør det samme med en datamaskin: den banker på hver port og skriver ned hvem som svarer.</p>",
        normal: "<p>nmap («Network Mapper») er kursets portskanner. Den lager en tabell over porter, tilstand (open, closed, filtered) og hvilken tjeneste som trolig kjører. Med <code>-sV</code> spør den tjenestene om versjon, og med <code>-O</code> gjetter den operativsystemet.</p><p>I pentesten hører den til rekognoseringen: du kartlegger før du velger hva du ser nærmere på. Forsvarere bruker det samme verktøyet for å se hva de selv viser utad.</p>",
        teknisk: "<p>Standard er de 1000 vanligste TCP-portene.</p><ul><li>Svarer porten med et «ja», er den <i>open</i>.</li><li>Svarer maskinen «ingen her» (RST), er den <i>closed</i>.</li><li>Kommer det ikke noe svar, er den <i>filtered</i>, som betyr at noe, typisk en brannmur, stopper probene.</li></ul><p>Uten <code>-sV</code> er SERVICE-kolonnen bare et oppslag på portnummeret, så den kan «lyve» når en tjeneste kjører på en annen port enn vanlig (d05 s. 26). Versjonsnummeret er broen videre til kjente sårbarheter (CVE), og derfor er en åpen port med gammel programvare det viktigste funnet i en skanning.</p>"
      },
      kjenn: ["Linjene <code>Nmap scan report for …</code> og <code>Host is up</code>", "Tabellen <code>PORT  STATE  SERVICE</code> med <code>21/tcp open ftp</code>", "<code>Not shown: … ports</code>, <code>MAC Address</code> og OS-gjetning nederst"],
      utdata: [{
        tittel: "Skanning med versjons- og OS-gjenkjenning", term: "kari@lab:~",
        linjer: [
          "$ nmap [[0|-sV]] [[1|-O]] [[2|192.0.2.25]]",
          "Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-20 10:14 CET",
          "Nmap scan report for [[2|192.0.2.25]]",
          "[[3|Host is up (0.00051s latency).]]",
          "[[4|Not shown: 996 closed tcp ports (reset)]]",
          "[[5|PORT]]     [[6|STATE]]    [[7|SERVICE]]    [[8|VERSION]]",
          "[[5|21/tcp]]   [[6|open]]     [[7|ftp]]        [[8|vsftpd 3.0.5]]",
          "[[5|22/tcp]]   [[6|open]]     [[7|ssh]]        [[8|OpenSSH 9.6p1 (protocol 2.0)]]",
          "[[5|80/tcp]]   [[6|open]]     [[7|http]]       [[8|Apache httpd 2.4.58]]",
          "[[5|8080/tcp]] [[9|filtered]] [[7|http-proxy]]",
          "[[10|MAC Address: 02:00:5E:10:00:25 (Unknown)]]",
          "[[11|Device type: general purpose]]",
          "[[11|Running: Linux 5.X|6.X]]",
          "[[11|OS details: Linux 5.0 - 6.2]]",
          "[[12|Network Distance: 1 hop]]",
          "",
          "Nmap done: 1 IP address (1 host up) scanned in 9.87 seconds"
        ],
        felt: [
          { n: "-sV", f: "Versjonsdeteksjon: nmap kobler til de åpne portene og leser hva tjenesten svarer, så VERSION-kolonnen fylles ut.", k: 4 },
          { n: "-O", f: "OS-gjenkjenning: nmap sammenligner hvordan maskinen svarer på spesielle prober med en database av fingeravtrykk.", k: 1 },
          { n: "Målet", f: "Adressen som skannes. Det kan også være et navn eller et helt nett. 192.0.2.0/24 er satt av til dokumentasjon, så det finnes ingen ekte maskin her. Skann bare det du har skriftlig lov til å teste (blokk 4).", k: 1 },
          { n: "Host is up", f: "Maskinen svarte i oppdagelsesfasen. Tallet i parentes er svartiden.", k: 5 },
          { n: "Not shown", f: "Porter i den vanligste tilstanden oppsummeres i én linje i stedet for å listes. «(reset)» er grunnen: maskinen svarte med RST, altså closed. 996 + 4 viste = de 1000 vanligste portene, som er standard.", k: 5 },
          { n: "PORT", f: "Portnummer og transportprotokoll (tcp eller udp).", k: 0 },
          { n: "STATE open", f: "<b>open</b>: et program tar imot forbindelser på porten.", k: 0 },
          { n: "SERVICE", f: "Navnet på tjenesten. Uten <code>-sV</code> er det bare et oppslag på portnummeret (21 = ftp). En tjeneste kan kjøre på en annen port enn vanlig, så navnet kan være feil: «portnummer kan lyve» (d05 s. 26).", k: 4 },
          { n: "VERSION", f: "Programvaren og versjonen som tjenesten selv oppga. Det er dette forsvareren sjekker mot kjente sårbarheter (CVE) og oppdaterer.", k: 4 },
          { n: "STATE filtered", f: "<b>filtered</b>: probene kommer ikke fram, typisk fordi en brannmur kaster dem. nmap kan ikke si om porten er åpen eller lukket. Det er ikke det samme som closed, der maskinen faktisk svarer «ingen her».", k: 0 },
          { n: "MAC Address", f: "Vises bare når målet står på samme lokale nett som skanneren, fordi nmap da finner maskinen med ARP. Navnet i parentes er produsenten slått opp fra starten av adressen (her ukjent). Over en ruter ser du ingen MAC-adresse.", k: 5 },
          { n: "OS-gjetning", f: "Device type er kategorien (general purpose, router, skriver …), Running er OS-familien, og OS details er den mer detaljerte gjetningen. Det er en gjetning, og den er mye sikrere når nmap finner minst én åpen og én lukket port.", k: 2 },
          { n: "Network Distance", f: "Antall hopp (rutere) mellom skanneren og målet. 1 hopp betyr samme nettsegment.", k: 2 }
        ]
      }],
      feller: [
        { q: "Betyr «filtered» at porten er lukket?", a: "Nei. closed betyr at maskinen svarer, men ingen lytter. filtered betyr at noe stopper probene, så nmap vet det ikke. Bak en filtered port kan det godt kjøre en tjeneste." },
        { q: "Kjører det en webtjener der SERVICE sier «http»?", a: "Ikke nødvendigvis. Uten -sV er SERVICE bare et oppslag på portnummeret. Først versjonsdeteksjonen snakker med tjenesten." },
        { q: "Er nmap et angrepsverktøy som bruker exploits?", a: "Nei, det kartlegger. På eksamen hører nmap til «kartlegging», ikke fuzzing eller injeksjon (H2023 28), og «angripe med NMAP» er et feil alternativ (H2024 37)." }
      ],
      eksamen: {
        spor: "Navngi programmet fra et skjermbilde der navnet er sladdet (H2025 14, ett ord), koble det til «finne åpne porter» (H2023 8) og plassere det under kartlegging (H2023 28).",
        figurer: ["H2025-14"],
        oppgaver: [
          { key: "H2025-14", hva: "Navngi programmet fra skjermbildet." },
          { key: "H2023-8", hva: "nmap = åpne porter." },
          { key: "H2023-28", hva: "nmap hører til kartlegging." },
          { key: "H2024-37", hva: "nmap utnytter ingen sårbarheter (feil alternativ)." }
        ]
      },
      kilder: [
        { navn: "Nmap Reference Guide: Port Scanning Basics", url: "https://nmap.org/book/man-port-scanning-basics.html" },
        { navn: "Nmap Reference Guide: Options Summary", url: "https://nmap.org/book/man-briefoptions.html" },
        { navn: "Nmap Network Scanning: OS Detection, Usage and Examples", url: "https://nmap.org/book/osdetect-usage.html" },
        { navn: "Nmap Reference Guide: Host Discovery", url: "https://nmap.org/book/man-host-discovery.html" },
        { navn: "Nmap Reference Guide: Service and Version Detection", url: "https://nmap.org/book/man-version-detection.html" },
        { navn: "Nmap Reference Guide: Output", url: "https://nmap.org/book/man-output.html" }
      ]
    },
    {
      id: "wireshark", navn: "Wireshark (og tcpdump)", alias: ["wireshark", "tcpdump"], kat: "kartlegging", fase: "rekognosering", rolle: "begge",
      mitre: [{ id: "T1040", navn: "Network Sniffing", taktikk: "Credential Access, Discovery" }],
      kurs: "d05 s. 28 (bare tekst)",
      kort: "Pakkeanalysator: fanger og viser trafikken på nettet, pakke for pakke.",
      hva: {
        eli5: "<p>Wireshark er som å ta opp alle samtalene i et rom og skrive dem ned: hvem sa noe, til hvem, når og hva. Snakker folk et språk alle forstår (ukryptert), kan du lese alt. Snakker de i kode (kryptert), ser du bare at noen snakket.</p>",
        normal: "<p>Wireshark er kursets eksempel på en <b>pakkeanalysator</b> (H2024 10). Den viser pakkene i en liste med nummer, tid, kilde, mål, protokoll, lengde og info. Et visningsfilter som <code>ftp</code> plukker ut det du leter etter. tcpdump gjør det samme på kommandolinja.</p><p>Å lese pakkestrømmen er et brudd på <b>konfidensialitet</b> (H2025 2). Forsvarere bruker det samme verktøyet til feilsøking og hendelseshåndtering.</p>",
        teknisk: "<p>Info-kolonnen er Wiresharks tolkning av innholdet. For klartekstprotokoller som FTP og Telnet står kommandoene rett der, også innloggingen. For TLS ser du bare håndtrykket og krypterte pakker. Derfor er kryptering forsvaret mot avlytting, ikke lengre passord.</p><p>Du ser bare trafikk som faktisk passerer nettverkskortet ditt. På et svitsjet nett er det din egen trafikk og kringkasting, med mindre noen står i midten (mann i midten, ARP-forfalskning, H2024 38).</p>"
      },
      kjenn: ["Kolonnene <code>No. Time Source Destination Protocol Length Info</code>", "Et visningsfilter øverst (<code>ftp</code>, <code>tcp.port == 21</code>)", "Ordet «pakkeanalysator» i oppgaveteksten"],
      utdata: [{
        tittel: "Pakkelista med visningsfilteret ftp", term: "Wireshark · eth0",
        kommentar: "Passordet er sladdet her. I en ekte FTP-økt står det i klartekst.",
        linjer: [
          "[[0|Filter: ftp]]",
          "[[1|No.]] [[2|Time]]     [[3|Source]]    [[4|Destination]] [[5|Protocol]] [[6|Length]] [[7|Info]]",
          "[[1|14]]  [[2|2.104133]] [[3|10.0.5.20]]   [[4|10.0.5.21]]     [[5|FTP]]      [[6|86]]     [[7|Response: 220 (vsFTPd 3.0.5)]]",
          "[[1|16]]  [[2|4.871920]] [[3|10.0.5.21]]   [[4|10.0.5.20]]     [[5|FTP]]      [[6|77]]     [[8|Request: USER kari]]",
          "[[1|18]]  [[2|4.872311]] [[3|10.0.5.20]]   [[4|10.0.5.21]]     [[5|FTP]]      [[6|100]]    [[7|Response: 331 Please specify the password.]]",
          "[[1|20]]  [[2|7.330145]] [[3|10.0.5.21]]   [[4|10.0.5.20]]     [[5|FTP]]      [[6|83]]     [[8|Request: PASS ██████████]]",
          "[[1|22]]  [[2|7.391002]] [[3|10.0.5.20]]   [[4|10.0.5.21]]     [[5|FTP]]      [[6|89]]     [[7|Response: 230 Login successful.]]"
        ],
        felt: [
          { n: "Visningsfilter", f: "Filteret avgjør hvilke av de fangede pakkene som vises. <code>ftp</code> viser bare FTP-kommandoene og -svarene. Andre eksempler: <code>tcp.port == 21</code>, <code>ip.addr == 10.0.5.20</code>.", k: 1 },
          { n: "No.", f: "Pakkens nummer i opptaket. Filteret endrer det ikke, derfor hopper tallene: pakkene imellom er TCP-kvitteringer som filteret skjuler.", k: 0 },
          { n: "Time", f: "Tidsstempelet til pakken, her sekunder siden opptaket startet (formatet kan endres).", k: 0 },
          { n: "Source", f: "Adressen pakken kommer fra. 10.0.5.20 er FTP-tjeneren (den sender svarene), 10.0.5.21 er klienten.", k: 0 },
          { n: "Destination", f: "Adressen pakken skal til.", k: 0 },
          { n: "Protocol", f: "Protokollen Wireshark har gjenkjent, med kort navn. FTP-kommandoene går over TCP port 21.", k: 0 },
          { n: "Length", f: "Lengden på hele pakken i byte, med Ethernet-, IP- og TCP-hodene i tillegg til FTP-teksten.", k: 0 },
          { n: "Info", f: "Wiresharks sammendrag av innholdet. Svarkodene er FTPs egne: 220 = klar, 331 = passord trengs, 230 = innlogget.", k: 0 },
          { n: "USER / PASS", f: "FTP sender brukernavn og passord ukryptert, så den som ser pakkene, leser dem rett i Info-kolonnen. Det er et brudd på konfidensialitet. Tiltaket er en kryptert protokoll (SFTP eller FTPS).", k: 0 }
        ]
      }],
      feller: [
        { q: "Er Wireshark et pakkefilter eller en brannmur?", a: "Nei, en pakkeanalysator. Den ser på trafikken, men stopper ingenting (H2024 10)." },
        { q: "Hvilket sikkerhetsmål brytes når noen leser pakkestrømmen?", a: "Konfidensialitet: noen leser noe de ikke skal. Ingenting endres eller stoppes (H2025 2)." },
        { q: "Kan Wireshark lese innholdet i HTTPS?", a: "Ikke uten nøklene. TLS krypterer innholdet, så du ser adresser, porter, håndtrykket og krypterte pakker." }
      ],
      eksamen: {
        spor: "Koble Wireshark til «undersøke nettverkspakker» (H2023 8), kalle det en pakkeanalysator (H2024 10) og si at avlesning bryter konfidensialitet (H2025 2).",
        figurer: [],
        oppgaver: [
          { key: "H2023-8", hva: "Wireshark = nettverkspakker." },
          { key: "H2024-10", hva: "Wireshark er en pakkeanalysator." },
          { key: "H2025-2", hva: "Lese pakkestrøm i Wireshark → konfidensialitet." }
        ]
      },
      kilder: [
        { navn: "Wireshark User's Guide: The Packet List Pane", url: "https://www.wireshark.org/docs/wsug_html_chunked/ChUsePacketListPaneSection.html" },
        { navn: "Wireshark User's Guide: Building Display Filter Expressions", url: "https://www.wireshark.org/docs/wsug_html_chunked/ChWorkBuildDisplayFilterSection.html" }
      ]
    },

    /* ===================== PASSORD (bare konsepter) ===================== */
    {
      id: "hydra", navn: "Hydra", alias: ["hydra"], kat: "passord", fase: "innledende", rolle: "angrep",
      mitre: [{ id: "T1110.001", navn: "Password Guessing", taktikk: "Credential Access" }],
      kurs: "d05 s. 34–35",
      kort: "Gjetter passord mot en innloggingstjeneste over nettet (online), fra en ordliste.",
      hva: {
        eli5: "<p>Hydra er som noen som står ved inngangsdøra og prøver nøkkel etter nøkkel fra et stort knippe. Det tar tid, og hvert forsøk merkes ved døra.</p>",
        normal: "<p>Hydra prøver mange passord mot en tjeneste som SSH eller FTP, gjerne fra en liste over vanlige passord. Det er <b>online</b> gjetting: hvert forsøk går til tjeneren, som kan sperre kontoen, forsinke svarene og logge forsøkene. Lysarkene viser det som en vei til innledende tilgang. Lysarket etter Hydra tar opp passordspraying (ett passord mot mange kontoer), som i ATT&amp;CK er en egen subteknikk (T1110.003).</p>",
        teknisk: "<p>Det som skiller online gjetting fra knekking (John, Hashcat), er hvor forsøkene skjer. Online går hvert gjett gjennom tjenesten, så forsvaret virker her og nå: kontosperring, forsinkelse, MFA og varsling på mange feilede innlogginger. Ved offline knekking har angriperen allerede hashene og kan prøve så fort maskinvaren tillater, uten at noen merker det.</p>"
      },
      kjenn: ["Mange innloggingsforsøk mot samme tjeneste i loggen, tett i tid og fra samme adresse (H2023 26)"],
      forsvar: ["Sterke, unike passord og MFA", "Kontosperring eller økende forsinkelse etter feilede forsøk", "Overvåke og varsle på mange feilede innlogginger"],
      feller: [
        { q: "Er Hydra et passordknekkeprogram som John?", a: "Nei. Hydra gjetter online mot en tjeneste. John og Hashcat knekker hasher offline." },
        { q: "Passordgjetting eller passordspraying?", a: "Gjetting: mange passord mot én konto. Spraying: ett eller få passord mot mange kontoer, som er vanskeligere å oppdage med kontosperring. H2023 26-fasiten kaller loggen passordspraying." }
      ],
      eksamen: {
        spor: "Ikke navngitt på eksamen H18–H25. Loggen fra et slikt angrep kommer i H2023 26 (hva har skjedd?).",
        figurer: [],
        oppgaver: [{ key: "H2023-26", hva: "Kjenn igjen angrepet fra innloggingsloggen." }]
      },
      kilder: [{ navn: "THC-Hydra, README", url: "https://github.com/vanhauser-thc/thc-hydra" }, { navn: "MITRE ATT&CK T1110.001 Password Guessing", url: "https://attack.mitre.org/techniques/T1110/001/" }]
    },
    {
      id: "unshadow", navn: "unshadow", alias: ["unshadow"], kat: "passord", fase: "utvide", rolle: "angrep",
      mitre: [{ id: "T1003.008", navn: "/etc/passwd and /etc/shadow", taktikk: "Credential Access" }],
      kurs: "d05 s. 40",
      kort: "Følger med John. Slår sammen /etc/passwd og /etc/shadow til én fil som et knekkeprogram kan lese.",
      hva: {
        eli5: "<p>Den ene lista har navnene på alle beboerne, og den andre har de hemmelige merkene deres. unshadow limer de to listene sammen til én, så det blir lettere å jobbe med dem.</p>",
        normal: "<p>På Linux ligger kontoene i <code>/etc/passwd</code>, som alle kan lese, mens passordhashene ligger i <code>/etc/shadow</code>, som bare root kan lese (d05 s. 40). unshadow kombinerer dem til én fil. Det er et forberedende steg før knekking, og det krever at noen allerede kan lese shadow-fila.</p>",
        teknisk: "<p>Hver linje i shadow-fila har brukernavnet, hashen og datofelter for passordets alder. Hashen har et prefiks som sier hvilken metode som er brukt (<code>$y$</code> = yescrypt, <code>$6$</code> = SHA-512-crypt), og deretter salt og hash. I passwd står det bare <code>x</code> der hashen før lå.</p><p>Poenget for forsvareren er at shadow-fila er grensen. Den som kan lese den, for eksempel gjennom en for vid sudo-rett (H2023 29), kan knekke passordene i ro og fred offline.</p>"
      },
      kjenn: ["Navnet på verktøyet som slår sammen passwd og shadow"],
      forsvar: ["Ingen sudo-rett til generelle filverktøy (cat, less) eller tolker", "Treg, saltet passordhash (yescrypt) og sterke passord gjør offline knekking dyrt"],
      feller: [
        { q: "Kan alle lese passordhashene på Linux?", a: "Nei. passwd er lesbar for alle, men hashene ligger i shadow, som krever root." },
        { q: "Knekker unshadow passordene?", a: "Nei, den bare forbereder fila. Knekkingen gjør John." }
      ],
      eksamen: {
        spor: "H2023 29 (misbruk av sudo): fasiten bruker kjeden les shadow → slå sammen → knekk. Svaret skal forklare hvorfor, ikke gi kommandoer.",
        figurer: [],
        oppgaver: [{ key: "H2023-29", hva: "Sudo-rett til å lese filer → passordhashene kan knekkes offline." }]
      },
      kilder: [
        { navn: "John the Ripper: EXAMPLES (unshadow)", url: "https://www.openwall.com/john/doc/EXAMPLES.shtml" },
        { navn: "shadow(5), Linux man-pages", url: "https://man7.org/linux/man-pages/man5/shadow.5.html" },
        { navn: "crypt(5), libxcrypt", url: "https://man.archlinux.org/man/crypt.5.en" },
        { navn: "MITRE ATT&CK T1003.008", url: "https://attack.mitre.org/techniques/T1003/008/" }
      ]
    },
    {
      id: "john", navn: "John the Ripper", alias: ["john", "john the ripper"], kat: "passord", fase: "utvide", rolle: "angrep",
      mitre: [{ id: "T1110.002", navn: "Password Cracking", taktikk: "Credential Access" }],
      kurs: "d05 s. 41–42",
      kort: "Knekker passordhasher offline. Kurset kaller den raskest på uttømmende søk og enklest å bruke.",
      hva: {
        eli5: "<p>John har en låst boks og et stort knippe nøkler hjemme hos seg selv. Han prøver nøkkel etter nøkkel i sitt eget tempo, og ingen ser at han prøver.</p>",
        normal: "<p>John the Ripper tar passordhasher og prøver kandidatpassord: lager hashen av hver kandidat og ser om den stemmer. Kandidatene kommer fra en ordliste, fra varianter av ordene i lista eller fra alle kombinasjoner av tegn. Det skjer <b>offline</b>, så det finnes ingen kontosperring som stopper det.</p><p>Parameteren som lager varianter av ordene i ordlista, heter <code>--rules</code> (H2024 8).</p>",
        teknisk: "<p>De viktigste modusene:</p><ul><li>ordliste, eventuelt med regler som lager varianter (store bokstaver, tall bak, bytte bokstaver mot tegn),</li><li>inkrementell (alle kombinasjoner av et tegnsett) og</li><li>single crack (gjetter ut fra brukernavn og navnefelt).</li></ul><p>Dokumentasjonen har også en fjerde, external, der brukeren selv definerer kandidatene. Salt hindrer at én utregning treffer mange brukere og gjør forhåndsberegnede tabeller verdiløse, men stopper ikke å knekke ett svakt passord. Det som hjelper, er lange passord og en bevisst treg hash.</p><p>Knekte passord lagres i en pot-fil, så de ikke knekkes på nytt.</p>"
      },
      kjenn: ["Navnet på parameteren som lager permutasjoner av ordlista: rules", "«Raskest på uttømmende søk, enklest å bruke» (d05 s. 42)"],
      forsvar: ["Lange passord (passfraser) og ingen gjenbruk", "Treg, saltet hash (yescrypt, bcrypt, Argon2)", "Beskytt hashene: shadow bare for root"],
      feller: [
        { q: "Hvilken John-parameter lager varianter av ordene i ordlista?", a: "rules. Ikke «wordspray», «permute» eller «all» (H2024 8)." },
        { q: "Stopper salt knekking?", a: "Nei, salt gjør at hver hash må angripes for seg og at forhåndsberegnede tabeller ikke virker. Et svakt passord knekkes fortsatt." },
        { q: "John eller Hashcat?", a: "Ifølge lysarkene: John raskest på uttømmende søk og enklest. Hashcat best på regelbasert knekking og maskeangrep, mer kontroll." }
      ],
      eksamen: {
        spor: "Koble programmet til «knekke passord» (H2023 8) og kunne navnet på parameteren rules (H2024 8). I H2023 29 er knekking steget etter at sudo-retten har gitt hashene.",
        figurer: [],
        oppgaver: [
          { key: "H2023-8", hva: "John the Ripper = knekke passord." },
          { key: "H2024-8", hva: "Parameteren som permuterer ordlista: rules." },
          { key: "H2023-29", hva: "Knekke hashene offline etter sudo-misbruk." }
        ]
      },
      kilder: [
        { navn: "John the Ripper: OPTIONS", url: "https://www.openwall.com/john/doc/OPTIONS.shtml" },
        { navn: "John the Ripper: MODES", url: "https://www.openwall.com/john/doc/MODES.shtml" },
        { navn: "John the Ripper: FAQ", url: "https://www.openwall.com/john/doc/FAQ.shtml" },
        { navn: "MITRE ATT&CK T1110.002 Password Cracking", url: "https://attack.mitre.org/techniques/T1110/002/" }
      ]
    },
    {
      id: "hashcat", navn: "Hashcat", alias: ["hashcat"], kat: "passord", fase: "utvide", rolle: "angrep",
      mitre: [{ id: "T1110.002", navn: "Password Cracking", taktikk: "Credential Access" }],
      kurs: "d05 s. 42 (bare tekst)",
      kort: "Knekker passordhasher offline, ofte på grafikkort. Kurset: best på regelbasert knekking og maskeangrep.",
      hva: {
        eli5: "<p>Hashcat er som John, men med en hel fabrikk av hjelpere (grafikkortet) og en plan for hvilke nøkler som er mest sannsynlige først, for eksempel «stor bokstav først og to tall til slutt».</p>",
        normal: "<p>Hashcat gjør det samme som John, men lysarkene sier den er best på regelbasert knekking og maskeangrep og gir mer kontroll, til gjengjeld er den mer komplisert (d05 s. 42).</p>",
        teknisk: "<p>Et maskeangrep er uttømmende søk der hver posisjon har sitt eget tegnsett, for eksempel stor bokstav, så små bokstaver, så sifre. Det bygger på hvordan folk faktisk lager passord og krymper søkerommet kraftig. Gjetter masken feil om mønsteret, blir passordet ikke funnet. Det er en god grunn til at passordregler som «stor bokstav og tall» gir mindre sikkerhet enn de ser ut til.</p>"
      },
      kjenn: ["«Best på regelbasert knekking / maskeangrep»", "Et knekkeprogram, ikke en VPN-løsning (H2024 10)"],
      forsvar: ["Lengde slår komplekse regler: lange passfraser", "Treg hash og salt"],
      feller: [
        { q: "Er Hashcat en VPN-løsning?", a: "Nei. I H2024 10 står Hashcat som feil alternativ for VPN. IPsec er svaret." }
      ],
      eksamen: {
        spor: "Bare som feil alternativ (H2024 10). Kunne skille Hashcat fra John med lysarkenes beskrivelse.",
        figurer: [],
        oppgaver: [{ key: "H2024-10", hva: "Hashcat er ikke en VPN-løsning." }]
      },
      kilder: [
        { navn: "hashcat wiki: Mask attack", url: "https://hashcat.net/wiki/doku.php?id=mask_attack" },
        { navn: "hashcat wiki: hashcat (moduser og valg)", url: "https://hashcat.net/wiki/doku.php?id=hashcat" }
      ]
    },

    /* ===================== RETTIGHETER ===================== */
    {
      id: "sudo", navn: "sudo (sudo -l)", alias: ["sudo", "sudo -l"], kat: "rettigheter", fase: "utvide", rolle: "begge",
      mitre: [{ id: "T1548.003", navn: "Sudo and Sudo Caching", taktikk: "Privilege Escalation" }],
      kurs: "d05 s. 36–40",
      kort: "Lar en bruker kjøre utvalgte kommandoer som en annen bruker, typisk root. sudo -l viser hva du har lov til.",
      hva: {
        eli5: "<p>sudo er som en lapp fra rektor: «Kari får låne nøkkelen til gymsalen.» sudo -l er å lese lappen. Står det «Kari får låne hovednøkkelen», kan hun åpne alle rom, ikke bare gymsalen.</p>",
        normal: "<p>sudo er administrasjonsverktøyet som gir avgrensede root-rettigheter. Kommandoen <code>sudo -l</code> lister hva brukeren din får kjøre, og som hvem. Lysarkene kaller misbruk av slike rettigheter «live off the land»: angriperen bruker verktøyene som allerede finnes (d05 s. 36).</p><p>Faren er regler som ser uskyldige ut. Et program som kan lese alle filer (cat), eller som kan starte andre programmer (tolker, redigeringsprogram, sidevisere), gir i praksis root.</p>",
        teknisk: "<p>Hver regel sier <i>hvem</i>, <i>hvor</i>, <i>som hvem</i> og <i>hva</i>. sudoers-manualen advarer selv: lar du en bruker kjøre et program som kan starte andre programmer, kan brukeren komme seg ut til et skall med sudo-rettighetene. Derfor skal en sudo-regel behandles som en root-tilgang: tillat bare konkrete kommandoer med faste argumenter, aldri tolker, skall, redigeringsprogram eller generelle filverktøy.</p><p>Det er nettopp de to eksamensoppgavene: python3 (H2022 4.4) og cat (H2023 29).</p>"
      },
      kjenn: ["<code>User … may run the following commands on …</code>", "<code>(root)</code> eller <code>(ALL : ALL)</code> foran et program", "<code>Matching Defaults entries</code> med env_reset og secure_path"],
      utdata: [{
        tittel: "Hva får kari kjøre som root?", term: "kari@lab01: ~",
        kommentar: "Egne data. Les reglene som en forsvarer: hvilken av de to linjene er farlig?",
        linjer: [
          "kari@lab01:~$ [[0|sudo -l]]",
          "Matching Defaults entries for kari on lab01:",
          "    [[1|env_reset]], [[2|mail_badpass]], [[3|secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin]], [[4|use_pty]]",
          "",
          "[[5|User kari may run the following commands on lab01:]]",
          "    [[6|(root)]] [[7|NOPASSWD:]] [[8|/usr/bin/systemctl restart nginx]]",
          "    [[9|(ALL : ALL)]] [[10|/usr/bin/less]]"
        ],
        felt: [
          { n: "sudo -l", f: "Lister hvilke kommandoer brukeren som spør, får kjøre på denne maskinen. Det endrer ingenting, så det er trygt å kjøre.", k: 0 },
          { n: "env_reset", f: "Kommandoen kjøres i et nytt, minimalt miljø i stedet for å arve brukerens miljøvariabler. Det hindrer at brukeren lurer root-kommandoen via egne variabler.", k: 1 },
          { n: "mail_badpass", f: "Sender e-post til administratoren når noen skriver feil passord til sudo.", k: 1 },
          { n: "secure_path", f: "Den faste PATH-en som brukes for sudo-kommandoer, så brukeren ikke kan legge en falsk «systemctl» først i sin egen sti.", k: 1 },
          { n: "use_pty", f: "Kommandoen kjøres i en egen pseudoterminal, så et ondsinnet program ikke kan skrive kommandoer inn i brukerens terminal.", k: 1 },
          { n: "may run", f: "Her starter selve reglene. Hver linje er én ting brukeren får gjøre.", k: 0 },
          { n: "(root)", f: "Som hvem kommandoen kjøres: her bare som root.", k: 1 },
          { n: "NOPASSWD:", f: "Brukeren slipper å skrive passordet sitt for denne kommandoen. Praktisk for faste driftsoppgaver, men da beskytter ikke passordet regelen hvis kontoen tas over.", k: 1 },
          { n: "Fast kommando", f: "Kommandoen med et fast argument: kari kan bare starte webtjeneren på nytt. Smal og grei regel, slik minste privilegium sier.", k: 1 },
          { n: "(ALL : ALL)", f: "Kommandoen kan kjøres som hvilken som helst bruker og gruppe, også root.", k: 1 },
          { n: "/usr/bin/less", f: "En sidevisning som kan lese hvilken som helst fil og starte andre programmer. Som root er det i praksis full root-tilgang. sudoers-manualen advarer mot nettopp slike regler. Dette er linja forsvareren skal fjerne.", k: 1 }
        ]
      }],
      feller: [
        { q: "Er sudo-rett til et «ufarlig» lese- eller hjelpeprogram greit?", a: "Nei. cat gir lesetilgang til alt, også shadow-fila (H2023 29). Tolker som python3 og programmer som kan starte andre programmer gir et root-skall (H2022 4.4)." },
        { q: "Kjører et program jeg starter selv, med root-rettigheter fordi jeg har sudo-rett?", a: "Nei. Uten sudo foran kjører programmet med dine egne rettigheter (H2023 22)." },
        { q: "Hva skal svaret på en «misbruk av sudo»-oppgave inneholde?", a: "Hvilken rett som gis, hva den gjør mulig (lese alt, starte skall), og konsekvensen (root eller passordhashene). Både H2022 4.4 og H2023 29 gir ett ekstra poeng (5 i stedet for 4) for tilnærmet fungerende kode eller pseudokode for ett av angrepene." }
      ],
      eksamen: {
        spor: "Les sudo -l fra et skjermbilde og forklar to måter retten kan misbrukes på (H2022 4.4: python3, H2023 29: cat), og vit at programmer uten sudo kjører med brukerens rettigheter (H2023 22).",
        figurer: ["H2022-4.4", "H2023-29"],
        oppgaver: [
          { key: "H2022-4.4", hva: "sudo-rett til python3." },
          { key: "H2023-29", hva: "sudo-rett til cat." },
          { key: "H2023-22", hva: "Hvilke rettigheter får et program startet uten sudo?" }
        ]
      },
      kilder: [
        { navn: "sudo(8), sudo.ws", url: "https://www.sudo.ws/docs/man/sudo.man/" },
        { navn: "sudoers(5), sudo.ws", url: "https://www.sudo.ws/docs/man/sudoers.man/" }
      ]
    },
    {
      id: "mimikatz", navn: "mimikatz", alias: ["mimikatz", "mimikats", "mimmikatz", "mimmikats"], kat: "rettigheter", fase: "utvide", rolle: "angrep",
      mitre: [{ id: "T1003.001", navn: "LSASS Memory", taktikk: "Credential Access" }, { id: "T1550.002", navn: "Pass the Hash", taktikk: "Lateral Movement" }],
      kurs: "d05 s. 45–46",
      kort: "Henter passordhasher, og noen ganger klartekstpassord, fra minnet på Windows. Krever administrator- eller debugrettigheter.",
      hva: {
        eli5: "<p>Windows husker hvem som er logget inn, så du slipper å skrive passordet hele tiden. mimikatz er et verktøy som leser denne hukommelsen. Men det slipper bare inn hvis det allerede har sjefsnøkkelen til maskinen.</p>",
        normal: "<p>mimikatz er kursets verktøy for <b>passorddumping</b>: det leser innloggingsdata fra minnet til Windows-prosessen som håndterer pålogging (LSASS). Utdataene viser brukernavn, domene, NTLM- og SHA1-hasher og av og til passordet i klartekst. Det krever administrator- eller debugrettigheter (d05 s. 45). Kiwi er den samme funksjonaliteten bygget inn i Metasploit.</p>",
        teknisk: "<p>En NTLM-hash kan brukes direkte til å logge på andre maskiner, uten å kjenne passordet: <b>pass the hash</b> (d05 s. 46, Impacket og psexec). Angriperen trenger aldri å knekke hashen, så det hjelper ikke at passordet er sterkt. Er samme passord brukt på mange maskiner, gir det samme NTLM-hash på alle (NTLM bruker ikke salt; ikke pensum), og den ene stjålne hashen åpner dem alle. Gode passord skal derfor heller ikke gjenbrukes. Mot dette virker minste privilegium (få lokale administratorer), unike lokale administratorpassord og beskyttelse av LSASS-prosessen.</p>"
      },
      kjenn: ["I skjermbildet (H2024 24) står kommandonavn på formen <code>modul::kommando</code>, som <code>privilege::debug</code> og <code>sekurlsa::logonpasswords</code>. Det er navnene du skal kjenne igjen i utdataene, ikke noe du skal kunne kjøre", "Svaret <code>Privilege '20' OK</code> (debugrettigheten ble gitt)", "Blokker med <code>msv</code>, <code>tspkg</code> og feltene NTLM, SHA1 og Password. Passordverdien er skjult her (<code>••••••••</code>)"],
      forsvar: ["Få administratorer, og ingen hverdagsbruk med admin-konto", "Unike lokale administratorpassord på hver maskin", "Ikke gjenbruk passord (pass the hash)"],
      feller: [
        { q: "Er svaret «kiwi»?", a: "Nei. H2024 24 sier at Kiwi bruker programmet, men svaret er mimikatz. Lysark d05 s. 45 viser Kiwi som modulen i Metasploit." },
        { q: "Kan mimikatz brukes av en vanlig bruker for å bli administrator?", a: "Nei, det krever allerede administrator- eller debugrettigheter. Det er et verktøy for å utvide tilgangen <i>etter</i> at du er admin på én maskin." },
        { q: "Hvorfor er en lekket NTLM-hash farlig selv om den ikke knekkes?", a: "Den kan brukes direkte til innlogging (pass the hash)." }
      ],
      eksamen: {
        spor: "Navngi programmet fra et skjermbilde (H2024 24, ett ord, «ikke kiwi») og koble det til «klartekstpassord fra minnet» (H2023 8).",
        figurer: ["H2024-24"],
        oppgaver: [
          { key: "H2024-24", hva: "Navngi programmet fra skjermbildet." },
          { key: "H2023-8", hva: "mimikatz = klartekstpassord fra minnet." }
        ]
      },
      kilder: [
        { navn: "mimikatz-wiki: module ~ sekurlsa", url: "https://github.com/gentilkiwi/mimikatz/wiki/module-~-sekurlsa" },
        { navn: "mimikatz-wiki: module ~ privilege", url: "https://github.com/gentilkiwi/mimikatz/wiki/module-~-privilege" },
        { navn: "MITRE ATT&CK T1003.001 LSASS Memory", url: "https://attack.mitre.org/techniques/T1003/001/" },
        { navn: "MITRE ATT&CK T1550.002 Pass the Hash", url: "https://attack.mitre.org/techniques/T1550/002/" }
      ]
    },

    /* ===================== UTNYTTING OG WEB ===================== */
    {
      id: "metasploit", navn: "Metasploit", alias: ["metasploit", "msfconsole"], kat: "utnytting", fase: "innledende", rolle: "angrep",
      mitre: [{ id: "T1190", navn: "Exploit Public-Facing Application", taktikk: "Initial Access" }, { id: "T1210", navn: "Exploitation of Remote Services", taktikk: "Lateral Movement" }],
      kurs: "d05 s. 45, 47, 49",
      kort: "Rammeverk med ferdige moduler for å utnytte kjente sårbarheter. Det mest kjente, og gratis.",
      hva: {
        eli5: "<p>Metasploit er en stor verktøykasse der hvert verktøy passer til én bestemt svakhet. Finner du ut at døra har en kjent feil, finnes det ofte allerede et verktøy for akkurat den feilen i kassa.</p>",
        normal: "<p>Metasploit er kursets eksempel på et rammeverk for å <b>utnytte sårbarheter</b> (d05 s. 49). Det har moduler</p><ul><li>for utnyttelse (exploit),</li><li>for kartlegging og hjelpeoppgaver (auxiliary),</li><li>for kode som kjører etter en vellykket utnyttelse (payload), og</li><li>for arbeid etter innbrudd (post).</li></ul><p>Kiwi, som henter passord fra minnet, er en del av Metasploit.</p>",
        teknisk: "<p>Kjeden i lysarkene går fra versjonsnummer (nmap -sV) til kjent sårbarhet (CVE, sårbarhetsskanner som OpenVAS) og videre til en modul som utnytter den. Lysarkene påpeker også at hver utnyttelse kan føre til driftsforstyrrelser, så en pentester kjører ikke flere exploits enn nødvendig og beveger seg heller sideveis med tilganger hen allerede har (d05 s. 47).</p><p>ATT&amp;CK-merkene: T1190 er utnyttelse av en tjeneste som vender ut mot nettet, for å komme inn (innledende tilgang). T1210 er utnyttelse av tjenester på det interne nettet, for å bevege seg sideveis etter innbruddet.</p><p>Forsvaret er det kjedelige: oppdater programvaren og fjern tjenester som ikke trengs, så det ikke finnes kjente sårbarheter å utnytte.</p>"
      },
      kjenn: ["Ledeteksten <code>msf6 &gt;</code> og oppstartsbildet med antall exploits, auxiliary og payloads", "Kiwi som del av Metasploit"],
      forsvar: ["Oppdater programvare (patch) og fjern unødvendige tjenester", "Sårbarhetsskanning av egne systemer"],
      feller: [
        { q: "Sårbarhetsskanner eller utnyttelsesrammeverk?", a: "OpenVAS og Nessus kartlegger sårbarheter. Metasploit utnytter dem." }
      ],
      eksamen: {
        spor: "Ikke spurt om på eksamen H18–H25. Kunne plassere det som rammeverk for utnyttelse, og vite at Kiwi er Metasploits modul for det samme som mimikatz (d05 s. 45). H2024 24 nevner bare at Kiwi bruker programmet.",
        figurer: [],
        oppgaver: [{ key: "H2024-24", hva: "Hintet: Kiwi bruker mimikatz." }]
      },
      kilder: [
        { navn: "Metasploit Documentation: Using Metasploit", url: "https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html" },
        { navn: "MITRE ATT&CK T1190 Exploit Public-Facing Application", url: "https://attack.mitre.org/techniques/T1190/" },
        { navn: "MITRE ATT&CK T1210 Exploitation of Remote Services", url: "https://attack.mitre.org/techniques/T1210/" }
      ]
    },
    {
      id: "burp", navn: "Burp Suite / ZAP", alias: ["burp", "burp suite", "zap", "owasp zap", "zaproxy"], kat: "utnytting", fase: "innledende", rolle: "begge",
      mitre: [{ id: "T1190", navn: "Exploit Public-Facing Application", taktikk: "Initial Access" }],
      kurs: "Ikke i lysarkene. Nevnt i fasiten til H2024 23.",
      kort: "Mellomtjener (proxy) mellom nettleseren og nettstedet: forespørslene kan stoppes, leses og endres før de sendes videre.",
      hva: {
        eli5: "<p>Tenk deg et brev du har skrevet og lagt i postkassa. Burp eller ZAP er som å ta brevet ut igjen på veien, endre det og sende det videre. Mottakeren ser bare brevet som kommer fram, ikke hva du hadde skrevet først.</p>",
        normal: "<p>Burp Suite og ZAP er proxyer for testing av webapplikasjoner. De står mellom nettleseren og tjeneren, så testeren kan stoppe en forespørsel, endre den og sende den videre. Ethvert filter som kjører i nettleseren (JavaScript), er da allerede passert.</p><p>Det er poenget i H2024 23: et filter som blokkerer «1==1» i nettleseren, beskytter ikke, fordi angriperen kontrollerer klienten. Full pott på den deloppgaven (3 p) krever begrunnelsen (brukeren kontrollerer klienten) og at omgåelsen skjer gjennom en proxy. Navnet Burp eller ZAP er ikke nødvendig.</p>",
        teknisk: "<p>Alt som kommer fra klienten, kan endres: skjemafelt, skjulte felt, informasjonskapsler og hoder. Sikkerhetskontroller må derfor ligge på tjeneren. Mot SQL-injeksjon er tiltaket parametriserte spørringer, ikke et filter som leter etter bestemte tegnstrenger, verken i nettleseren eller på tjeneren (blokk 4).</p><p>Forsvarere bruker de samme verktøyene til å teste sine egne applikasjoner. ZAP er åpen kildekode.</p>"
      },
      kjenn: ["«Proxy mellom nettleseren og tjeneren», «fange opp og endre forespørselen»"],
      forsvar: ["All validering og tilgangskontroll på tjeneren", "Parametriserte spørringer mot SQL-injeksjon"],
      feller: [
        { q: "Stopper et JavaScript-filter i nettleseren SQL-injeksjon?", a: "Nei. Angriperen kontrollerer klienten og kan sende forespørselen uten filteret, for eksempel gjennom en proxy (H2024 23)." }
      ],
      eksamen: {
        spor: "H2024 23 (6 p, fritekst): forklar hvorfor et klientfilter ikke hjelper. Full pott på deloppgave C (3 p) krever begrunnelsen (brukeren kontrollerer klienten) og at det skjer gjennom en proxy. Navnet Burp/ZAP trengs ikke.",
        figurer: [],
        oppgaver: [{ key: "H2024-23", hva: "Klientfilter mot SQL-injeksjon omgås med proxy." }]
      },
      kilder: [
        { navn: "PortSwigger: Burp Proxy, intercepting messages", url: "https://portswigger.net/burp/documentation/desktop/tools/proxy/intercept-messages" },
        { navn: "ZAP: Getting Started", url: "https://www.zaproxy.org/getting-started/" },
        { navn: "MITRE ATT&CK T1190 Exploit Public-Facing Application", url: "https://attack.mitre.org/techniques/T1190/" }
      ]
    },

    /* ===================== FORSVAR ===================== */
    {
      id: "iptables", navn: "iptables", alias: ["iptables", "ip-tables"], kat: "forsvar", fase: "beskytte", rolle: "forsvar",
      mitre: [],
      kurs: "d09 s. 45–50",
      kort: "Linux-brannmuren: regler i kjedene INPUT, FORWARD og OUTPUT som slipper gjennom (ACCEPT) eller kaster (DROP) pakker.",
      hva: {
        eli5: "<p>iptables er vakta ved porten med en liste. Vakta leser lista ovenfra og ned, og den første linja som passer på den som kommer, bestemmer: slipp inn eller send bort. Står ingen linje som passer, slipper denne vakta folk inn, så det lønner seg å skrive «alle andre: nei» nederst.</p>",
        normal: "<p>iptables er kursets Linux-brannmur (H2024 10). En regel legges til med <code>-A</code> i en kjede:</p><ul><li><code>INPUT</code> for trafikk til maskinen selv,</li><li><code>FORWARD</code> for trafikk som rutes gjennom den, og</li><li><code>OUTPUT</code> for trafikk maskinen selv sender.</li></ul><p>Regelen beskriver kilde (<code>-s</code>), mål (<code>-d</code>), protokoll (<code>-p</code>) og port (<code>--dport</code>), og ender med <code>-j ACCEPT</code> eller <code>-j DROP</code>.</p>",
        teknisk: "<p>Reglene leses ovenfra, og <b>første treff vinner</b>. Treffer ingen regel, bestemmer kjedens policy. Den er ACCEPT med mindre noen har endret den, derfor avslutter man med en eksplisitt DROP (d09). Et felt som ikke står i regelen, matcher alt. <code>--dport</code> virker bare sammen med <code>-p tcp</code> eller <code>-p udp</code>.</p><p>En tilstandsløs brannmur vurderer hver pakke for seg, så svarene tilbake må også slippes gjennom av en regel. <code>iptables -L -n -v</code> viser reglene med tellere, og tellerne viser hvilke regler som faktisk treffer.</p>"
      },
      kjenn: ["<code>iptables -A FORWARD … -j ACCEPT</code>", "<code>Chain INPUT (policy …)</code> og kolonnene target, prot, source, destination"],
      utdata: [
        {
          tittel: "Reglene: webtjeneren 10.0.1.10 får snakke med databasen 10.0.2.20 på port 5432", term: "root@fw01: ~",
          kommentar: "Egne data. Et tilstandsløst oppsett: svartrafikken må ha sin egen regel.",
          linjer: [
            "# iptables [[0|-A FORWARD]] [[1|-s 10.0.1.10]] [[2|-d 10.0.2.20]] [[3|-p tcp]] [[4|--dport 5432]] [[5|-j ACCEPT]]",
            "# iptables [[0|-A FORWARD]] [[1|-s 10.0.2.20]] [[2|-d 10.0.1.10]] [[3|-p tcp]] [[6|--sport 5432]] [[5|-j ACCEPT]]",
            "# iptables [[0|-A FORWARD]] [[7|-j DROP]]"
          ],
          felt: [
            { n: "-A FORWARD", f: "Legg regelen til <b>sist</b> i kjeden FORWARD, som gjelder trafikk som rutes gjennom brannmuren (ikke trafikk til brannmuren selv, det er INPUT). <code>-I</code> setter inn øverst.", k: 0 },
            { n: "-s", f: "Kildeadressen: pakken må komme fra denne adressen (eller dette nettet).", k: 0 },
            { n: "-d", f: "Måladressen: pakken må skulle til denne adressen.", k: 0 },
            { n: "-p tcp", f: "Protokollen. Uten den matcher regelen alle protokoller. Portvalgene (<code>--dport</code>, <code>--sport</code>) virker bare når protokollen er tcp eller udp.", k: 1 },
            { n: "--dport", f: "Målporten. 5432 er PostgreSQL. Klienten bruker en tilfeldig høy kildeport, så den står ikke i regelen.", k: 1 },
            { n: "-j ACCEPT", f: "Handlingen når regelen treffer: slipp pakken gjennom. Ingen flere regler sjekkes for denne pakken.", k: 0 },
            { n: "--sport", f: "Kildeporten. Svarene fra databasen kommer <i>fra</i> port 5432. En tilstandsløs brannmur husker ikke forbindelser, så uten denne regelen ville svarene bli stoppet av DROP-regelen under.", k: 1 },
            { n: "-j DROP", f: "Ingen -s, -d eller -p: regelen matcher alt som ikke traff reglene over, og kaster det stille. Uten den slipper policyen ACCEPT resten gjennom.", k: 0 }
          ]
        },
        {
          tittel: "Lista med tellere: iptables -L FORWARD -n -v --line-numbers", term: "root@fw01: ~",
          linjer: [
            "# iptables -L FORWARD [[0|-n]] [[1|-v]] [[2|--line-numbers]]",
            "[[3|Chain FORWARD]] [[4|(policy ACCEPT 0 packets, 0 bytes)]]",
            "[[2|num]]  [[5|pkts bytes]] [[6|target]] [[7|prot]] opt [[8|in]] [[8|out]] [[9|source]]     [[9|destination]]",
            "[[2|1]]     [[5|412  31K]] [[6|ACCEPT]] [[7|tcp]]  --  [[8|*]]  [[8|*]]   [[9|10.0.1.10]]  [[9|10.0.2.20]]   [[10|tcp dpt:5432]]",
            "[[2|2]]     [[5|398  52K]] [[6|ACCEPT]] [[7|tcp]]  --  [[8|*]]  [[8|*]]   [[9|10.0.2.20]]  [[9|10.0.1.10]]   [[10|tcp spt:5432]]",
            "[[2|3]]     [[5|37  2220]] [[6|DROP]]   [[7|all]]  --  [[8|*]]  [[8|*]]   [[11|0.0.0.0/0]]  [[11|0.0.0.0/0]]"
          ],
          felt: [
            { n: "-n", f: "Vis tall: adresser og porter oppgis som tall uten navneoppslag. Raskere og entydig.", k: 0 },
            { n: "-v", f: "Utfyllende visning med tellere og nettverksgrensesnitt.", k: 0 },
            { n: "num / --line-numbers", f: "Regelens plass i kjeden. Rekkefølgen er alt: første treff vinner.", k: 0 },
            { n: "Chain FORWARD", f: "Kjeden som listes.", k: 0 },
            { n: "policy ACCEPT", f: "Hva som skjer med pakker som ingen regel traff. 0 pakker her, fordi regel 3 fanger alt som er igjen. Policyen kan settes til DROP med <code>-P</code>.", k: 0 },
            { n: "pkts bytes", f: "Hvor mange pakker og byte som har truffet regelen (K = tusen). DROP-regelen har kastet 37 pakker: noe har prøvd seg på noe som ikke er tillatt.", k: 0 },
            { n: "target", f: "Handlingen (<code>-j</code>): ACCEPT eller DROP.", k: 0 },
            { n: "prot", f: "Protokollen (<code>-p</code>). «all» betyr at regelen ikke spør om protokoll.", k: 0 },
            { n: "in / out", f: "Nettverksgrensesnittet pakken kom inn på og går ut på. * betyr hvilket som helst.", k: 0 },
            { n: "source / destination", f: "Kilde- og måladressen fra <code>-s</code> og <code>-d</code>.", k: 0 },
            { n: "dpt / spt", f: "Målport (<code>--dport</code>) og kildeport (<code>--sport</code>) fra tcp-utvidelsen.", k: 1 },
            { n: "0.0.0.0/0", f: "Alle adresser: regelen oppga ingen kilde eller mål.", k: 0 }
          ]
        }
      ],
      feller: [
        { q: "Blokkerer iptables alt som ikke er tillatt?", a: "Ikke av seg selv. Standardpolicyen er ACCEPT, så du må avslutte med en eksplisitt DROP (eller sette policyen til DROP)." },
        { q: "Hvilken regel gjelder når to regler passer?", a: "Den øverste. Første treff vinner, også om en senere regel er mer presis (H2025 24)." },
        { q: "INPUT eller FORWARD?", a: "INPUT er trafikk til brannmuren selv. Trafikk mellom to andre maskiner gjennom brannmuren går i FORWARD (H2023 32, H2025 24)." },
        { q: "Er iptables en applikasjonsproxy?", a: "Nei, et pakkefilter som ser på adresser, protokoller og porter, ikke på innholdet i HTTP eller andre applikasjonsprotokoller (d09)." }
      ],
      eksamen: {
        spor: "Skriv én regel i riktig kjede (H2023 32), tolk et regelsett ovenfra med første treff (H2025 24), og vit at iptables er Linux-brannmuren (H2024 10).",
        figurer: ["H2023-32"],
        oppgaver: [
          { key: "H2023-32", hva: "Skriv regelen som åpner én tjeneste." },
          { key: "H2025-24", hva: "Slipper regelsettet trafikken gjennom?" },
          { key: "H2024-10", hva: "iptables er en Linux-brannmur." }
        ]
      },
      kilder: [
        { navn: "iptables(8), man-side", url: "https://ipset.netfilter.org/iptables.man.html" },
        { navn: "iptables-extensions(8), man-side (tcp: --dport/--sport)", url: "https://ipset.netfilter.org/iptables-extensions.man.html" }
      ]
    },
    {
      id: "snort", navn: "Snort", alias: ["snort"], kat: "forsvar", fase: "oppdage", rolle: "forsvar",
      mitre: [],
      kurs: "d09 s. 59–62",
      kort: "Signaturbasert IDS: regler beskriver mønstre i trafikken, og treff gir et varsel.",
      hva: {
        eli5: "<p>Snort er en vakt med et ark med beskrivelser: «si fra hvis noen i rød jakke går inn bakdøra». Vakta stopper ingen, men roper når beskrivelsen passer. Folk som ikke står på arket, merker den ikke.</p>",
        normal: "<p>Snort er kursets eksempel på en <b>signaturbasert IDS</b> (H2023 11). En regel har et hode og valg: <code>alert tcp kilde port -&gt; mål port (msg:\"…\"; sid:…; rev:…;)</code>. Treffer trafikken, skrives et varsel med meldingen, regelnummeret og adressene.</p>",
        teknisk: "<p>Hodet leses som en setning: handling, protokoll, kildeadresse og kildeport, retning, måladresse og målport. Pilen gir retningen, så ved utgående trafikk fra en tjener står tjenerens port på <i>venstre</i> side (H2025 20: SSH fra DC, port 22 som kildeport). Valgene i parentes er meldingen (msg), regelens unike nummer (sid, egne regler fra 1 000 000) og revisjon (rev).</p><p>Signaturbasert gjenkjenner bare det som står i reglene. Anomalibasert lærer normal trafikk og varsler på avvik (ofte maskinlæring, H2023 31).</p>"
      },
      kjenn: ["<code>alert tcp … -&gt; … (msg:…; sid:…; rev:…;)</code>", "Variabler som <code>$HOME_NET</code>", "Varsel på formen <code>[**] [1:1000003:1] melding [**]</code>"],
      utdata: [
        {
          tittel: "En regel: varsle om Telnet mot tjeneren 10.0.5.20", term: "/etc/snort/rules/local.rules",
          linjer: ["[[0|alert]] [[1|tcp]] [[2|any]] [[3|any]] [[4|->]] [[5|10.0.5.20]] [[6|23]] [[7|(msg:\"Telnet mot 10.0.5.20\";]] [[8|sid:1000003;]] [[9|rev:1;)]]"],
          felt: [
            { n: "alert", f: "Handlingen: lag et varsel og logg pakken. Eksamen bruker alert.", k: 0 },
            { n: "tcp", f: "Protokollen. Porter gir bare mening for tcp og udp.", k: 0 },
            { n: "Kilde-IP", f: "Venstre side av pilen: hvem pakken kommer fra. any = hvem som helst. Ofte en variabel som <code>$HOME_NET</code> eller <code>$EXTERNAL_NET</code>.", k: 0 },
            { n: "Kildeport", f: "Porten pakken sendes fra. En klient bruker en tilfeldig høy port, derfor any.", k: 0 },
            { n: "->", f: "Retningen: fra venstre (kilde) til høyre (mål).", k: 0 },
            { n: "Mål-IP", f: "Høyre side: maskinen pakken skal til.", k: 0 },
            { n: "Målport", f: "23 er Telnet, en klartekstprotokoll som ikke skal brukes.", k: 0 },
            { n: "msg", f: "Teksten som står i varselet. Den skal beskrive hva regelen fanger (H2023 31).", k: 1 },
            { n: "sid", f: "Regelens unike nummer. 0–999 999 er satt av til Snorts egne regler, så egne regler starter på 1 000 000.", k: 2 },
            { n: "rev", f: "Revisjonen av regelen. Økes når regelen endres.", k: 1 }
          ]
        },
        {
          tittel: "Varselet når regelen treffer (alert_fast-format)", term: "/var/log/snort/alert",
          linjer: ["[[0|11/20-10:52:07.415263]]  [**] [[1|[1:1000003:1]]] [[2|Telnet mot 10.0.5.20]] [**] [[3|[Priority: 0]]] [[4|{TCP}]] [[5|10.0.5.77:50412]] -> [[6|10.0.5.20:23]]"],
          felt: [
            { n: "Tidspunkt", f: "Måned/dag-time:minutt:sekund med mikrosekunder.", k: 3 },
            { n: "[gid:sid:rev]", f: "Hvilken regel som traff: generator (gid, 1 = vanlige tekstregler), regelnummeret sid og revisjonen rev.", k: 4 },
            { n: "Melding", f: "msg fra regelen.", k: 3 },
            { n: "Priority", f: "Prioriteten kommer fra regelens klassifisering (classtype, der 1 er mest alvorlig). Regelen over har ingen classtype.", k: 5 },
            { n: "{TCP}", f: "Protokollen i pakken.", k: 3 },
            { n: "Kilde", f: "Kildeadresse og kildeport: klienten med en tilfeldig høy port.", k: 3 },
            { n: "Mål", f: "Måladresse og målport: Telnet på tjeneren.", k: 3 }
          ]
        }
      ],
      feller: [
        { q: "Stopper Snort trafikken?", a: "Ikke som IDS: den varsler. En IPS (eller en brannmur) stopper." },
        { q: "Hvilken side står porten 22 på i en regel for utgående SSH fra en tjener?", a: "Venstre, som kildeport: tjeneren svarer fra port 22 (H2025 20). Feil retning gir null poeng." },
        { q: "Kan en signaturbasert IDS varsle om en ny, upatchet sårbarhet?", a: "Ja, hvis det finnes en signatur for den. Upatchet betyr ikke ukjent. Begge typene kan ha gitt alarmen (H2023 31)." }
      ],
      eksamen: {
        spor: "Kjenn igjen et regelsett som Snort (H2024 27), skriv en regel med riktig retning og port (H2025 20), tolk en regel og velg riktig melding (H2023 31), og vit at Snort er en signaturbasert IDS (H2023 11).",
        figurer: ["H2024-27"],
        oppgaver: [
          { key: "H2024-27", hva: "Hvilket program er regelsettet et eksempel på?" },
          { key: "H2025-20", hva: "Skriv en Snort-regel for SSH fra DC." },
          { key: "H2023-31", hva: "Signatur mot anomali, og meldingen til en regel." },
          { key: "H2023-11", hva: "Snort er en signaturbasert IDS." }
        ]
      },
      kilder: [
        { navn: "Snort 3 Rule Writing Guide: Rule Headers", url: "https://docs.snort.org/rules/headers/" },
        { navn: "Snort 3 Rule Writing Guide: General options (msg, rev)", url: "https://docs.snort.org/rules/options/general/" },
        { navn: "Snort 3 Rule Writing Guide: sid", url: "https://docs.snort.org/rules/options/general/sid" },
        { navn: "Snort 2.9 Users Manual: Output modules (alert_fast, konfigurasjonen)", url: "https://docs.huihoo.com/snort/2.9/node21.html" },
        { navn: "Snort 3 Rule Writing Guide: gid", url: "https://docs.snort.org/rules/options/general/gid" },
        { navn: "Snort 3 Rule Writing Guide: classtype", url: "https://docs.snort.org/rules/options/general/classtype" }
      ]
    }
  ];

  /* ---------- Øvingen «Hvilket verktøy er dette?» ----------
     Utdrag (vis) bare fra de annoterte, defensive utdataene. Angrepsverktøyene tas med beskrivelse
     eller eksamensfiguren (fig). answer = indeks i valg. */
  var gjett = [
    { id: "g-nmap", q: "Hvilket program har skrevet dette?", tittel: "kari@lab:~", vis: [
        "Nmap scan report for ██████████", "Host is up (0.0012s latency).", "Not shown: 998 closed tcp ports (reset)",
        "PORT    STATE SERVICE", "22/tcp  open  ssh", "443/tcp open  https"],
      valg: ["Wireshark", "nmap", "Snort", "iptables"], answer: 1, svar: "nmap",
      hvorfor: "Tabellen PORT / STATE / SERVICE og «Not shown» er nmap. Ordet «Nmap» i første linje ville vært sladdet på eksamen, som i H2025 14." },
    { id: "g-wireshark", q: "Hvilket program viser dette?", tittel: "eth0", vis: [
        "No. Time     Source     Destination Protocol Length Info", "41  3.20117  10.0.5.21  10.0.5.20   TELNET   69     Telnet Data ...",
        "42  3.20488  10.0.5.20  10.0.5.21   TCP      66     23 → 50412 [ACK]"],
      valg: ["nmap", "Snort", "Wireshark", "Hydra"], answer: 2, svar: "wireshark",
      hvorfor: "Pakkelista med No., Time, Source, Destination, Protocol, Length og Info er en pakkeanalysator (Wireshark). Snort skriver varsler med [**] og regelnummer, ikke en pakkeliste." },
    { id: "g-sudo", q: "Hvilken kommando har gitt dette svaret?", tittel: "per@lab02: ~", vis: [
        "User per may run the following commands on lab02:", "    (root) /usr/bin/apt update"],
      valg: ["iptables -L", "sudo -l", "unshadow", "nmap -O"], answer: 1, svar: "sudo",
      hvorfor: "«may run the following commands» er sudo -l: lista over hva brukeren får kjøre, og som hvem." },
    { id: "g-iptables", q: "Hvilket program har skrevet denne lista?", tittel: "root@fw01: ~", vis: [
        "Chain INPUT (policy ACCEPT)", "target  prot opt source        destination", "ACCEPT  tcp  --  10.0.9.0/24   0.0.0.0/0    tcp dpt:22",
        "DROP    all  --  0.0.0.0/0     0.0.0.0/0"],
      valg: ["iptables", "Snort", "nmap", "Metasploit"], answer: 0, svar: "iptables",
      hvorfor: "«Chain INPUT (policy …)» og kolonnene target, prot, source og destination er iptables -L." },
    { id: "g-snort", q: "Hvilket program er dette et regelsett for?", tittel: "local.rules", vis: [
        "alert udp $HOME_NET any -> any 53 (msg:\"DNS ut\"; sid:1000010; rev:1;)"],
      valg: ["iptables", "Wireshark", "Snort", "Hashcat"], answer: 2, svar: "snort",
      hvorfor: "Handlingen alert, retningspilen og valgene msg, sid og rev i parentes er en Snort-regel (H2024 27). En iptables-regel har -A, -s, -d og -j." },
    { id: "g-mimikatz", q: "Hva heter programmet i skjermbildet?", fig: "H2024-24",
      valg: ["kiwi", "John the Ripper", "mimikatz", "Hashcat"], answer: 2, svar: "mimikatz",
      hvorfor: "Kommandonavnene privilege::debug og sekurlsa::logonpasswords og blokkene med NTLM-hasher og et Password-felt (verdien er skjult her) kjennetegner mimikatz. H2024 24 sier at Kiwi bruker programmet, så svaret er ikke kiwi. Lysark d05 s. 45 viser Kiwi som modulen i Metasploit." },
    { id: "g-unshadow", q: "Hvilket verktøy slår sammen /etc/passwd og /etc/shadow til én fil som et knekkeprogram kan lese?",
      valg: ["sudo", "unshadow", "nmap", "Hydra"], answer: 1, svar: "unshadow",
      hvorfor: "unshadow følger med John the Ripper og gjør nettopp dette. Det krever at shadow-fila allerede kan leses, altså root-tilgang." },
    { id: "g-hydra", q: "Et program prøver passord fra en liste mot SSH-innloggingen på en maskin, over nettet. Hvilket av kursets verktøy er det?",
      valg: ["John the Ripper", "mimikatz", "Hydra", "Wireshark"], answer: 2, svar: "hydra",
      hvorfor: "Hydra gjetter online mot en tjeneste. John knekker hasher offline, uten å snakke med tjenesten." },
    { id: "g-john", q: "Du har kjørt unshadow og har én fil med brukernavn og passordhasher. Hvilket program knekker hashene på din egen maskin, uten å kontakte tjenesten?",
      valg: ["Hydra", "John the Ripper", "Wireshark", "Snort"], answer: 1, svar: "john",
      hvorfor: "John the Ripper knekker hasher offline, og unshadow følger med John. Hydra gjetter online mot tjenesten, Wireshark ser bare trafikk, og Snort er en IDS. Hashcat kunne også knekt hashene, men står ikke blant valgene." },
    { id: "g-hashcat", q: "Du har passordhashene og vil prøve en maske offline: stor forbokstav, seks små bokstaver og to sifre. Hvilket program gjør det?",
      valg: ["Hydra", "Hashcat", "Wireshark", "unshadow"], answer: 1, svar: "hashcat",
      hvorfor: "Hashcat er sterkest på regelbasert knekking som maskeangrep, og er mer komplisert, men gir mer kontroll (d05 s. 42). Hydra gjetter online, og unshadow slår bare sammen passwd og shadow. John kan også bruke masker, men står ikke blant valgene." },
    { id: "g-burp", q: "Du vil endre en forespørsel etter at nettleserens JavaScript-filter har kjørt, før den når tjeneren. Hva slags verktøy bruker du?",
      valg: ["En proxy som Burp eller ZAP", "En pakkeanalysator som Wireshark", "En IDS som Snort", "En portskanner som nmap"], answer: 0, svar: "burp",
      hvorfor: "En proxy står mellom nettleseren og tjeneren og kan endre forespørselen. Wireshark ser trafikken, men endrer den ikke (H2024 23)." },
    { id: "g-metasploit", q: "Skanningen viser en tjenesteversjon med en kjent sårbarhet. Du vil utnytte den med en ferdig modul. Hvilket rammeverk bruker du?",
      valg: ["OpenVAS", "Metasploit", "nmap", "Snort"], answer: 1, svar: "metasploit",
      hvorfor: "Metasploit har ferdige moduler som utnytter kjente sårbarheter. OpenVAS finner sårbarheter, men utnytter dem ikke, og nmap kartlegger porter og versjoner (d05 s. 48–49)." }
  ];

  var andre = [
    { navn: "nslookup og RIPE-databasen", hva: "Fra domenenavn til IP-adresse og hele adresseblokken til virksomheten (rekognosering).", kurs: "d05 s. 20" },
    { navn: "ftp-klient", hva: "Anonym innlogging på FTP uten passord kan lekke filer.", kurs: "d05 s. 33" },
    { navn: "OpenVAS / Nessus", hva: "Sårbarhetsskannere: kartlegger kjente sårbarheter ut fra versjonsnumre, men utnytter dem ikke.", kurs: "d05 s. 48" },
    { navn: "CVE-databasen", hva: "Fra versjonsnummer til kjent sårbarhet (f.eks. SMBv1-sårbarheten i H2024 27).", kurs: "d05 s. 48" },
    { navn: "Impacket / psexec", hva: "Pass the hash: logge på med selve hashen.", kurs: "d05 s. 46" },
    { navn: "Ettercap/Bettercap, Scapy/hping3", hva: "Ettercap og Bettercap for mann i midten (ARP-forfalskning), Scapy og hping3 for å lage falske pakker, i scenarioet i H2024 38.", kurs: "H2024 38" },
    { navn: "Sertifikatvisning i nettleseren", hva: "Lese X.509-feltene og sertifikatkjeden (blokk 3).", kurs: "d03 s. 32–33" }
  ];

  var byId = {};
  liste.forEach(function (t) { byId[t.id] = t; });
  var fane = {};
  KAT.forEach(function (k) { fane[k.id] = k.id; });

  IN.VERKTOY = {
    FASER: FASER, KAT: KAT, liste: liste, gjett: gjett, andre: andre,
    get: function (id) { return byId[id] || null; },
    fase: function (id) { for (var i = 0; i < FASER.length; i++) if (FASER[i].id === id) return FASER[i]; return null; },
    forOppgave: function (key) {
      return liste.filter(function (t) { return t.eksamen.oppgaver.some(function (o) { return o.key === key; }); });
    },
    alleOppgaver: function () {
      var out = [];
      liste.forEach(function (t) { t.eksamen.oppgaver.forEach(function (o) { if (out.indexOf(o.key) < 0) out.push(o.key); }); });
      return out;
    },
    lenke: function (id) {
      var t = byId[id];
      return t ? "verktoy.html#fane=" + fane[t.kat] + "&oppg=vt-" + t.id : "verktoy.html";
    }
  };
})();
