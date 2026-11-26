/* ============================================================
   IN2120 guide · figurer/fig-husk.js
   Huskeregler for eksamensfigurene: en kort, enkel ting å huske som skiller figuren fra lignende figurer
   (f.eks. CBC, CTR og ECB). Vises i «Fasit og forklaring» etter retting (IN.inspera), aldri før,
   så den ikke røper svaret.
     IN.FIG_HUSK["H2025-8"] = { tittel: "kort navn", tekst: "html, 1–3 setninger eller en kort liste" };
   Figurer som ligner hverandre på tvers av år deler samme regel (samme objekt eller samme kjernetekst),
   så studenten lærer én ting. Kilder per påstand: plan/figurer/HUSK-kilder.md.
   ============================================================ */
(function () {
  "use strict";
  var IN = window.IN = window.IN || {};
  IN.FIG_HUSK = IN.FIG_HUSK || {};
  var H = IN.FIG_HUSK;

  H["H2025-8"] = { tittel: "se hva som går inn i E", tekst:
    "<ul><li><b>ECB:</b> bare M inn i E, ingen ⊕ og ingen piler mellom blokkene.</li>" +
    "<li><b>CBC:</b> ⊕ <i>før</i> E, og C går videre til neste ⊕ (kjede). IV i første blokk.</li>" +
    "<li><b>CTR:</b> teller (T) inn i E, ⊕ med M <i>etter</i> E. Blokkene er uavhengige.</li></ul>" };

  H["H2024-28"] = { tittel: "applikasjon = OSI 7–5", tekst:
    "<p>Internettstakkens applikasjonslag dekker OSI 7, 6 og 5 (applikasjon, presentasjon, sesjon); transport er OSI 4.</p>" +
    "<p><b>Merk:</b> eksamensarket og lysark d09 (s. 7) tegner feltene over OSI 7–6 og 5–4. " +
    "Standard OSI-tilordning er 7–5 og 4, og figuren her er tegnet slik. Poengene gis bare for lagnavnene.</p>" };

  /* ---------- Gruppe: operasjonsmoduser (H2021-3.2, H2021-3.3, H2022-5.5, H2023-20, H2024-17, H2025-8) ---------- */
  var MODUS = H["H2025-8"];
  var CTR_DEKR = "<p><b>Dekryptering i CTR:</b> samme E(T, K) en gang til, og ⊕ med C gir M. " +
    "CTR bruker aldri D, verken ved kryptering eller dekryptering.</p>";
  H["H2023-20"] = MODUS;
  H["H2024-17"] = MODUS;
  H["H2021-3.3"] = { tittel: MODUS.tittel, tekst: MODUS.tekst + CTR_DEKR };
  H["H2022-5.5"] = { tittel: MODUS.tittel, tekst: MODUS.tekst + CTR_DEKR +
    "<p><b>XOR bit for bit:</b> like bit gir 0, ulike gir 1. Kryptering: C = E(T, K) ⊕ M. Dekryptering: M = E(T, K) ⊕ C.</p>" };
  H["H2021-3.2"] = { tittel: MODUS.tittel, tekst: MODUS.tekst +
    "<p><b>På bildet:</b> i ECB gir like klartekstblokker like chiffertekstblokker, så omrisset blir stående. " +
    "CBC og CTR gir bare støy. Et navn som ikke er en ekte modus (ECB, CBC, CTR, OFB, CFB), hører til «Ingen».</p>" };

  /* ---------- Gruppe: internettstakken (H2021-5.1, H2025-22; H2024-28 over) ---------- */
  var STAKK = "<p>Internettstakken ovenfra: <b>A</b>pplikasjon – <b>T</b>ransport – <b>I</b>nternett (IP) – <b>L</b>ink, " +
    "med fysisk lag under og selve appen (programmet brukeren kjører) over.</p>" +
    "<p>Internettstakkens applikasjonslag dekker OSI 7, 6 og 5 (applikasjon, presentasjon, sesjon); transport er OSI 4. " +
    "(Lysark d09 s. 7 tegner applikasjon over OSI 7–6 og transport over 5–4; standard tilordning er 7–5 og 4.)</p>" +
    "<p>Kjennetegn:</p><ul><li>portnummer = transport (TCP, UDP)</li><li>IP-adresse = internett</li><li>MAC-adresse = link (Ethernet, ARP)</li></ul>";
  H["H2021-5.1"] = { tittel: "A-T-I-L ovenfra", tekst: STAKK };
  H["H2025-22"] = { tittel: "A-T-I-L ovenfra", tekst: STAKK +
    "<p><b>Kursets konvensjon for TLS:</b> TLS Record = transport, TLS Handshake = applikasjon. " +
    "<b>Les retningen:</b> på dette arket står fysisk lag til venstre og App til høyre.</p>" };

  /* ---------- Gruppe: sertifikatkjeden (H2021-4.4, H2022-6.2, H2023-18, H2024-15) ---------- */
  var SERT = { tittel: "les kjeden nedenfra", tekst:
    "<ul><li><b>Subjektsertifikat</b> (nederst, f.eks. nettstedet): signert av CA-en rett over.</li>" +
    "<li><b>Mellomliggende CA:</b> signert av roten, og signerer selv subjektsertifikatene.</li>" +
    "<li><b>Rotsertifikat</b> (øverst): selvsignert. Det stoles på fordi det ligger forhåndsinstallert.</li></ul>" +
    "<p>Et sertifikat inneholder bare en <b>offentlig</b> nøkkel. Det er CA-ens <i>private</i> nøkkel som signerer, aldri et sertifikat.</p>" };
  H["H2021-4.4"] = SERT;
  H["H2022-6.2"] = SERT;
  H["H2023-18"] = SERT;
  H["H2024-15"] = SERT;

  H["H2022-6.4"] = { tittel: "Public Key Info + Key Usages", tekst:
    "<p>Se i to felt: <b>Public Key Info</b> (hvilken offentlig nøkkel, her en EC-nøkkel for ECDSA) og " +
    "<b>Key Usages</b> (hva nøkkelen får brukes til). «Digital Signature» betyr at nøkkelen brukes til å <i>validere</i> signaturer.</p>" +
    "<p>Et sertifikat har bare offentlig nøkkel, så det kan aldri <i>lage</i> en signatur eller <i>dekryptere</i>: begge krever privat nøkkel.</p>" };

  /* ---------- Gruppe: føderert innlogging og OAuth (H2021-7.2, H2024-31, H2023-35) ---------- */
  var FLYT = { tittel: "følg tokenet", tekst:
    "<ul><li><b>OIDC (autentisering):</b> SP → IdP → SP. Nettleseren/klienten er budbringer: SP sender den til IdP, " +
    "IdP autentiserer brukeren og lager et <i>ID-token</i>, som videresendes til SP. Første og siste melding går mellom bruker og SP.</li>" +
    "<li><b>OAuth (autorisering):</b> ressurseier, autoriseringstjener, ressurstjener og app. Eieren samtykker hos autoriseringstjeneren, " +
    "appen får et <i>tilgangstoken</i> og bruker det hos ressurstjeneren.</li></ul>" +
    "<p>Nummerer ved å spørre: hvor lages tokenet, og hvor brukes det?</p>" };
  H["H2021-7.2"] = FLYT;
  H["H2024-31"] = FLYT;
  H["H2023-35"] = FLYT;

  /* ---------- Gruppe: FIDO2 og passnøkler (H2022-8.3, H2025-25) ---------- */
  var FIDO = { tittel: "lokalt først, så challenge–respons", tekst:
    "<ul><li><b>Bruker → enhet/klient (lokalt):</b> autentikatoren (PIN, fingeravtrykk, ansikt) låser opp nøkkelen. Den sendes aldri over nettet.</li>" +
    "<li><b>Tjener → klient:</b> en tilfeldig challenge (utfordring). <b>Klient → tjener:</b> responsen, signert med den private nøkkelen.</li>" +
    "<li><b>Privat</b> nøkkel (passnøkkel) ligger i enheten, <b>offentlig</b> nøkkel hos tjeneren.</li></ul>" +
    "<p>Rekkefølge: challenge → lokal opplåsing → respons. Pilretningen skiller challenge fra respons.</p>" };
  H["H2022-8.3"] = FIDO;
  H["H2025-25"] = FIDO;

  /* ---------- Gruppe: IAM-faser (H2021-1.3, H2023-14) ---------- */
  var IAM = { tittel: "speilbildet: konfigurering ↔ bruk", tekst:
    "<p>Hvert trinn i konfigureringsfasen (én gang, på forhånd) har et speilbilde i bruksfasen (hver gang):</p>" +
    "<ul><li>brukerregistrering ↔ oppgi bruker-ID</li>" +
    "<li>klargjør autentikator ↔ oppgi autentikator (brukerautentisering)</li>" +
    "<li>tilgangsautorisering ↔ tilgangskontroll</li></ul>" +
    "<p>Autorisering = <i>spesifisere</i> policy (konfigurering). Tilgangskontroll = <i>håndheve</i> den (bruk). " +
    "Registrering, autentikator og autentisering hører til identitetshåndtering; autorisering og tilgangskontroll til tilgangshåndtering.</p>" };
  H["H2021-1.3"] = IAM;
  H["H2023-14"] = IAM;

  /* ---------- Gruppe: risikostyringsprosessen (H2022-10.1, H2023-38, H2024-33, H2024-34) ---------- */
  var RISIKO = { tittel: "kontekst → vurdering → plan → tiltak", tekst:
    "<ol><li><b>Kontekstetablering / planlegging:</b> kriterier, omfang, risikoeier.</li>" +
    "<li><b>Risikovurdering (ROS)</b> = identifisering (verdier, trusler, sårbarheter) → analyse (sannsynlighet og konsekvens gir risikonivå) " +
    "→ evaluering (ranger og sammenlign med kriteriene).</li>" +
    "<li><b>Beslutningspunkt 1:</b> er <i>vurderingen</i> god nok? (spredning, usikkerhet) Nei → tilbake.</li>" +
    "<li><b>Risikohåndteringsplan:</b> redusere, akseptere …</li>" +
    "<li><b>Beslutningspunkt 2:</b> er <i>planen</i> akseptabel? (restrisiko, budsjett) Nei → tilbake.</li>" +
    "<li><b>Implementer sikkerhetstiltak.</b> (H2024-figuren ender i «dokumentér risikovurdering og -håndtering».)</li></ol>" +
    "<p>Analyse er en del av vurderingen, ikke omvendt.</p>" +
    "<p><b>Merk:</b> beslutningspunktene er kursets figur, bygd på eldre utgaver av ISO/IEC 27005 (2008–2018). " +
    "Utgaven fra 2022 har ikke egne beslutningspunkter. Svar etter kursets figur på eksamen.</p>" };
  H["H2022-10.1"] = RISIKO;
  H["H2023-38"] = RISIKO;
  H["H2024-33"] = RISIKO;
  H["H2024-34"] = RISIKO;

  /* ---------- Gruppe: risikotrekanten (H2023-16, H2024-13) ---------- */
  var TREKANT = { tittel: "verdi, trussel, sårbarhet", tekst:
    "<p>Risiko krever alle tre hjørnene: en <b>trussel</b> som utnytter en <b>sårbarhet</b> for å skade en <b>verdi</b>. " +
    "Fjern ett hjørne, og risikoen forsvinner.</p><p>Tre ulike ord, og les instruksen om entall eller flertall.</p>" };
  H["H2023-16"] = TREKANT;
  H["H2024-13"] = TREKANT;

  /* ---------- Gruppe: sikkerhetsmål (H2021-1.1, H2024-1) ---------- */
  var KIT = "<p>Spør hva angriperen får til, eller hva som er verst akkurat nå:</p>" +
    "<ul><li><b>leser</b> noe hen ikke skal → konfidensialitet</li>" +
    "<li><b>endrer</b> noe → integritet (dataintegritet når innholdet endres, systemintegritet når selve systemet eller konfigurasjonen endres)</li>" +
    "<li><b>hindrer bruk</b> → tilgjengelighet</li></ul>" +
    "<p>Avlyttet chiffertekst som ikke blir dekryptert, bryter ingen av dem.</p>";
  H["H2021-1.1"] = { tittel: "lese, endre eller hindre?", tekst: KIT +
    "<p>Personvern er eget mål når data om personer avsløres, f.eks. ved de-anonymisering.</p>" };
  H["H2024-1"] = { tittel: "lese, endre eller hindre?", tekst: KIT };

  /* ---------- Gruppe: virtualisering og kontainer (H2022-2.4, H2022-2.5) ---------- */
  var VIRT = { tittel: "hva ligger rett over maskinvaren?", tekst:
    "<ul><li><b>Type 1-virtualisering:</b> maskinvare → hypervisor → gjeste-OS → app. Ingen vert-OS.</li>" +
    "<li><b>Type 2:</b> maskinvare → vert-OS → hypervisor → gjeste-OS → app.</li>" +
    "<li><b>Kontainer:</b> maskinvare → vert-OS → kontainermotor (Docker Engine) → kontainere. " +
    "Ingen gjeste-OS: kontainerne deler kjernen til vert-OS-et.</li></ul>" };
  H["H2022-2.4"] = VIRT;
  H["H2022-2.5"] = VIRT;

  /* ---------- Gruppe: kjenn igjen verktøyet (H2024-24, H2025-14, H2024-27) ---------- */
  var VERKTOY = { tittel: "kjenn igjen signaturlinjen", tekst:
    "<ul><li><b>mimikatz:</b> kommandoer på formen <code>modul::kommando</code> (privilege::debug, sekurlsa::logonpasswords), " +
    "og utdata med NTLM-hasher og passord hentet fra Windows-minnet.</li>" +
    "<li><b>nmap:</b> «… scan report for …», tabell med PORT / STATE / SERVICE, MAC-adresse og OS-gjenkjenning.</li>" +
    "<li><b>Snort:</b> regel på formen <code>handling protokoll kilde port -&gt; mål port ( msg:…; content:…; sid:…; rev:…; )</code>.</li></ul>" };
  H["H2024-24"] = VERKTOY;
  H["H2025-14"] = VERKTOY;
  H["H2024-27"] = VERKTOY;

  /* ---------- Gruppe: sudo og rettigheter i terminalen (H2022-4.4, H2023-29, H2023-22) ---------- */
  var SUDO = { tittel: "les linjen etter «may run»", tekst:
    "<p>I <code>sudo -l</code> står svaret i siste linje: <code>(root)</code> eller <code>(ALL : ALL)</code> foran et program betyr " +
    "at du kan kjøre <i>det programmet</i> som root.</p>" +
    "<ul><li>Tolk, skall eller editor (python3, bash, vim) → du kan starte et root-skall.</li>" +
    "<li>Fillesing (cat) → du kan lese alt, f.eks. passordhashene, og knekke dem offline.</li>" +
    "<li>Uten <code>sudo</code> foran kommandoen kjører programmet med brukerens egne rettigheter.</li></ul>" };
  H["H2022-4.4"] = SUDO;
  H["H2023-29"] = SUDO;
  H["H2023-22"] = SUDO;

  /* ---------- Enkeltfigurer ---------- */
  H["H2021-2.3"] = { tittel: "angrepet går gjennom tillitsforholdet", tekst:
    "<p>Følg pilene: angriperen kommer inn hos <b>leverandøren</b>, og skaden når <b>virksomheten</b> gjennom produktet eller tjenesten den stoler på. " +
    "Målet er virksomhetens verdier, og det er virksomheten som bærer tapet og best kjenner egne verdier.</p>" };

  H["H2021-8.2"] = { tittel: "kjenn → beskytt → oppdag → reager", tekst:
    "<p>Begge rammeverkene følger samme logikk fra venstre: finn ut hva du har, beskytt det, oppdag angrep, håndter og gjenopprett.</p>" +
    "<ul><li><b>NIST CSF:</b> fem funksjoner, Identify, Protect, Detect, Respond, Recover (CSF 2.0 legger til Govern rundt dem).</li>" +
    "<li><b>NSM:</b> fire kategorier, fordi håndtering og gjenoppretting er slått sammen: identifisere og kartlegge, " +
    "beskytte og opprettholde, oppdage, håndtere og gjenopprette.</li></ul>" };

  H["H2021-9.1"] = { tittel: "opplæring før alt", tekst:
    "<p>Syklusen er vanlig utvikling med sikkerhet i hvert steg, men den starter med <b>opplæring</b>: " +
    "opplæring → krav → design → koding → test → produksjonssetting → forvaltning.</p>" +
    "<p>Microsofts SDL har de samme sju stegene; der heter det siste respons.</p>" };

  H["H2021-10.1"] = { tittel: "lag våpenet før du sender det", tekst:
    "<ol><li>Rekognosering</li><li><b>Bevæpning</b> (våpenet lages hos angriperen)</li><li><b>Overlevering</b> (sendes til målet)</li>" +
    "<li>Utførelse av exploit</li><li>Installering</li><li>Kommando og kontroll</li><li>Aksjon (lysarkene 2026: måloppnåelse)</li></ol>" +
    "<p>Par å huske: bevæpning før overlevering, exploit før installering, kommando og kontroll før aksjon.</p>" };

  H["H2022-2.3"] = { tittel: "returadressen styrer hoppet", tekst:
    "<p>Bufferet fylles mot høyere adresser (oppover i figuren). Over bufferet ligger forrige rammepeker og så <b>returadressen</b>. " +
    "Returadressen bestemmer hvor kjøringen fortsetter når funksjonen er ferdig, så det er den angriperen må overskrive.</p>" };

  H["H2022-3.2"] = { tittel: "hvor tilpasset er e-posten?", tekst:
    "<ul><li><b>Masse-phishing:</b> generell tekst («kjære kunde») sendt til mange.</li>" +
    "<li><b>Spyd-phishing:</b> tilpasset én bestemt person (navn, detaljer).</li>" +
    "<li><b>Direktørsvindel (whaling):</b> spyd-phishing mot en toppleder.</li>" +
    "<li><b>Klone-phishing:</b> kopi av en ekte e-post mottakeren har fått før, med falsk lenke eller vedlegg.</li></ul>" };

  H["H2022-7.2"] = { tittel: "innerst = siste node", tekst:
    "<p>Avsenderen pakker lagene innenfra og ut, i motsatt rekkefølge av ruten: innerste lag for siste node, ytterste for første. " +
    "Hver node skreller bare sitt eget lag og kjenner bare forrige og neste ledd. Mottakeren har ingen av Tor-lagnøklene.</p>" };

  H["H2022-8.2"] = { tittel: "match = godtatt, false = feil avgjørelse", tekst:
    "<ul><li>Venstre kurve: ikke-genuine (feil person). Andelen over terskelen T godtas feilaktig: <b>FMR</b>.</li>" +
    "<li>Høyre kurve: genuine. Andelen under T avvises feilaktig: <b>FNMR</b>.</li>" +
    "<li>TMR = 1 − FNMR (del på antall genuine), TNMR = 1 − FMR (del på antall ikke-genuine).</li></ul>" +
    "<p>Flytter du T, går den ene feilraten opp og den andre ned.</p>" };

  H["H2022-9.4"] = { tittel: "hvem beskriver attributtet?", tekst:
    "<ul><li>den som ber om tilgang → <b>subjektattributt</b> (f.eks. klarering)</li>" +
    "<li>ressursen → <b>objektattributt</b> (f.eks. gradering)</li>" +
    "<li>handlingen → <b>forespørselsattributt</b> (tilgangsmodus: lese, skrive)</li>" +
    "<li>situasjonen → <b>kontekstattributt</b> (tidspunkt, sted)</li></ul>" +
    "<p>Reglene er <b>AC-policyer</b> (her betyr MAC Mandatory Access Control), og sekskanten er <b>funksjonen</b> som tar beslutningen.</p>" };

  H["H2023-1"] = { tittel: "vilje, uhell eller kunnskap?", tekst:
    "<ul><li>Hindrer noen som <i>vil</i> inn → <b>sikkerhet</b> (security)</li>" +
    "<li>Hindrer <i>uhell</i> → <b>trygghet</b> (safety)</li>" +
    "<li>Sier bare hvor grensen går → <b>visshet</b> (certainty)</li></ul>" };

  H["H2023-26"] = { tittel: "hvilken kolonne varierer?", tekst:
    "<p>Se hva som er likt og ulikt fra rad til rad. Samme kilde og samme bruker, men nytt passord hvert brøkdels sekund, " +
    "betyr automatisert passordgjetting mot én konto.</p>" +
    "<p><b>Kursets ord:</b> fasiten kaller dette passordspraying. Den vanlige definisjonen (MITRE ATT&amp;CK) er det omvendte: " +
    "ett eller noen få passord mot <i>mange</i> kontoer.</p>" };

  H["H2023-32"] = { tittel: "til, fra eller gjennom brannmuren?", tekst:
    "<p>Trafikk <b>gjennom</b> brannmuren (mellom to segmenter) → <code>FORWARD</code>. Trafikk <b>til</b> brannmuren selv → <code>INPUT</code>. " +
    "Trafikk <b>fra</b> den → <code>OUTPUT</code>.</p>" +
    "<p>Gjør regelen så smal som mulig: kilde, mål, protokoll og destinasjonsport.</p>" };

  H["H2024-36"] = { tittel: "nedover = mer detaljert, kortere levetid", tekst:
    "<ul><li><b>Strategisk</b> (toppen): hvem og hvorfor, for ledelsen.</li>" +
    "<li><b>Taktisk/operasjonell</b> (midten): hvordan aktøren jobber, altså TTP-er. MITRE ATT&amp;CK hører hjemme her.</li>" +
    "<li><b>Teknisk</b> (bunnen): konkrete indikatorer som IP-adresser og hasher. Mest detaljert og kortest levetid.</li></ul>" +
    "<p>Andre kilder deler nivåene litt ulikt; følg kurset.</p>" };

  H["H2024-38"] = { tittel: "to IP-er, samme MAC = ARP-forgiftning", tekst:
    "<p>Les ARP-tabellen: står to IP-adresser med samme fysiske adresse (MAC-adresse), svarer én maskin for begge. " +
    "Det er sporet etter ARP-forgiftning (mann-i-midten).</p>" +
    "<p>En MAC (meldingsautentiseringskode) med felles nøkkel kan lages av alle som har nøkkelen, så den gir ikke ubenektelighet. Det krever digital signatur.</p>" };

  H["H2025-28"] = { tittel: "4–7 P, 8 D, 9 C, 10 A", tekst:
    "<ul><li>Plan = kapittel 4–7 (kontekst, ledelse, planlegging, støtte)</li><li>Do = 8 (drift)</li>" +
    "<li>Check = 9 (prestasjonsevaluering)</li><li>Act = 10 (forbedring)</li></ul>" +
    "<p>Tiltakssett som NSMs grunnprinsipper brukes i driften: Do.</p>" +
    "<p><b>Merk:</b> ISO 27001 sier ikke selv hvilken fase hvert kapittel hører til. Noen kilder legger kapittel 7 i Do; følg kurset (P).</p>" };

  H["H2025-37"] = { tittel: "klartekst bare i endepunktene", tekst:
    "<p>Med TLS er passordet i klartekst bare der krypteringen starter og slutter: på maskinen der det tastes inn (før kryptering, f.eks. en keylogger) " +
    "og på tjeneren som tar imot og dekrypterer. Alle på veien imellom (wifi-avlytting, mann-i-midten, teleleverandør) ser bare chiffertekst.</p>" +
    "<p>HSTS hindrer at brukeren klikker seg forbi et falskt sertifikat, så en mann-i-midten kan ikke lure seg inn.</p>" };
})();
