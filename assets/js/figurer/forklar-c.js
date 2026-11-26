/* ============================================================
   IN2120 guide · figurer/forklar-c.js
   Nye visuelle forklaringer (fase 5, punkt 3, kandidat 11–19) for teori-fanene. Ikke eksamensfigurer, ingen svarfelt.
   Hver figur er forankret i en lest kildeseksjon (se plan/figurer/FORKLARINGER.md) og følger kursets ord
   (plan/vranglaere.md). Bruker IN.fig (fig-felles.js) og temafargene fra styles.css (lys/mørk).
   Under hver figur: kildelinje og én dempet linje om eksamensvekt (eierens ønske), begge i samme lille grå stil.

   BRUK (i blokksidens skript):  IN.FORKLAR["ttp-hierarki"]("#fk-ttp-hierarki");

   Figurer i denne fila:
     ttp-hierarki   10-cyberops-ki · killchain  taktikk, teknikk, prosedyre = TTP
     skall-zt       09-nettverk · forsvar       skallmodell mot zero trust (PEP og PDP)
     faktorer       07-autentisering · faktorer vet, har, er (/gjør), MFA = to ulike kategorier
     xss-typer      04-angrep · vektorer        lagret og reflektert XSS
     ipsec-moduser  09-nettverk · ipsec         ESP i transport- og tunnelmodus
     nulldag        05-system · sarbarhet       tidslinje fra feil til installert rettelse
     ocsp-stifting  03-pki · revokering         OCSP uten og med stifting
     idporten       08-iam · oidc               ID-porten som IdP mellom tjenesten og eID-leverandørene
     aktorkart      04-angrep · aktorer         ressurser mot motiv, med glidende overganger
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FORKLAR = IN.FORKLAR || {};
  var NS = "http://www.w3.org/2000/svg";
  var DEMPET = "var(--color-on-surface-variant)";

  function sv(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function hx(tag, attrs, parent) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (attrs[k] == null) continue;
      if (k === "text") n.textContent = attrs[k]; else if (k === "html") n.innerHTML = attrs[k]; else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  /* Tekst med egen størrelse og farge (F.tekst setter størrelsen i style). */
  function T(parent, x, y, tekst, o) {
    o = o || {};
    var t = IN.fig.tekst(parent, x, y, tekst, { anker: o.anker, fet: o.fet, kursiv: o.kursiv });
    t.setAttribute("style", "font-size:" + (o.str || 13) + "px" + (o.farge ? ";fill:" + o.farge : "") +
      (o.halo ? ";paint-order:stroke;stroke:var(--color-surface-container-lowest);stroke-width:4px;stroke-linejoin:round" : ""));
    return t;
  }
  function linjer(parent, x, y, l, o) {
    o = o || {};
    var lh = o.lh || Math.round((o.str || 13) * 1.3);
    l.forEach(function (s, i) {
      var oo = {}; for (var k in o) oo[k] = o[k];
      if (o.forsteFet && i === 0) oo.fet = true;
      T(parent, x, y + (i - (l.length - 1) / 2) * lh, s, oo);
    });
  }
  function rekt(parent, x, y, w, h, o) {
    o = o || {};
    return sv("rect", { x: x, y: y, width: w, height: h, rx: o.r != null ? o.r : 6,
      style: "fill:" + (o.fyll || "var(--color-surface-container-lowest)") + ";stroke:" + (o.strek || "var(--color-outline)") +
        ";stroke-width:" + (o.sw || 1.4) + (o.stiplet ? ";stroke-dasharray:5 4" : "") + (o.opa != null ? ";fill-opacity:" + o.opa : "") }, parent);
  }
  var TONE = {
    ok: ["var(--color-tone-ok)", "var(--color-on-tone-ok)"],
    warn: ["var(--color-tone-warn)", "var(--color-on-tone-warn)"],
    fare: ["var(--color-tone-danger)", "var(--color-on-tone-danger)"],
    tung: ["var(--color-tone-heavy)", "var(--color-on-tone-heavy)"],
    info: ["var(--color-tone-info)", "var(--color-on-tone-info)"],
    varsel: ["var(--color-tone-caution)", "var(--color-on-tone-caution)"]
  };

  /* Ramme: <figure class="fig-vis"> med tegning, kildelinje og en dempet linje om eksamensvekt. */
  function ramme(host, id, kilde, vekt) {
    if (typeof host === "string") host = document.querySelector(host);
    if (!host) return null;
    while (host.firstChild) host.removeChild(host.firstChild);
    var fig = hx("figure", { class: "fig-vis fk-fig", "data-forklar": id }, host);
    var hh = hx("div", { class: "exam-fig-h" }, fig);
    var cap = hx("figcaption", { class: "small muted fig-vis-cap" }, fig);
    hx("span", { html: "Kilde: " + kilde + ". Egen tegning." }, cap);
    if (vekt) hx("span", { class: "fk-vekt", style: "display:block;margin-top:.15rem", text: "Eksamensvekt: " + vekt }, cap);
    return hh;
  }
  function lenke(url, tekst) { return '<a href="' + url + '" target="_blank" rel="noopener">' + tekst + "</a>"; }
  /* Livslinje i sekvensdiagram: aktørboks øverst og stiplet linje ned. */
  function aktor(s, x, y, w, l, bunn, tone) {
    rekt(s, x - w / 2, y, w, 40, { fyll: tone ? tone[0] : null, strek: tone ? tone[1] : null, sw: 1.3 });
    linjer(s, x, y + 20, l, { str: 12.5, fet: true, farge: tone ? tone[1] : null, lh: 15 });
    F().linje(s, [[x, y + 40], [x, bunn]], { stiplet: true, klasse: "fk-liv" });
  }
  function F() { return IN.fig; }
  /* Melding: pil fra x0 til x1 på høyde y, etikett (1–2 linjer) over pila. */
  function melding(s, x0, x1, y, l, o) {
    o = o || {};
    F().pil(s, [[x0, y], [x1, y]], { stiplet: o.stiplet });
    var lh = 14;
    l.forEach(function (t, i) {
      T(s, (x0 + x1) / 2, y - 10 - (l.length - 1 - i) * lh, t, { str: o.str || 12, kursiv: o.kursiv, farge: o.farge, fet: o.fet, halo: true });
    });
  }
  function nr(s, x, y, n) {
    sv("circle", { cx: x, cy: y, r: 9, style: "fill:var(--color-primary);stroke:none" }, s);
    T(s, x, y, String(n), { str: 11.5, fet: true, farge: "var(--color-on-primary)" });
  }

  /* ---------- ttp-hierarki: taktikk → teknikk → prosedyre ----------
     Kilde: MITRE ATT&CK FAQ, avsnittene «What are tactics / techniques / procedures?» (taktikk = «why», teknikk = «how»,
     prosedyre = «specific implementation»). Kurset (CO, t11) sier at taktikken er hva angriperen vil oppnå (delmålet):
     kursets ord brukes. Undertekniker (sub-techniques) finnes hos MITRE, men ikke i kurset: utelatt. Ingen tall på
     taktikker og teknikker, de endres mellom versjoner. Eksempelet er oppdiktet. */
  IN.FORKLAR["ttp-hierarki"] = function (host) {
    var hh = ramme(host, "ttp-hierarki", lenke("https://attack.mitre.org/resources/faq/", "MITRE ATT&amp;CK FAQ, «tactics», «techniques» og «procedures»") +
      " · kursets ord (CO, t11), oppdiktet eksempel",
      "middels – ATT&CK og CTI-nivåene var med i H2021 10.3 og H2024 36, men ATT&CK står ikke på 2026-lysarket.");
    if (!hh) return;
    var s = F().svg(hh, { w: 340, h: 368, maks: 480, tittel: "TTP: taktikk, teknikk og prosedyre",
      desc: "Tre nivåer ovenfra og ned. Taktikk: hva angriperen vil oppnå, et delmål, for eksempel å komme seg inn (Initial Access). Teknikk: hvordan delmålet nås, for eksempel phishing. Prosedyre: den konkrete måten én gruppe gjør det på, for eksempel falsk faktura med makro i vedlegget. Hvert nivå kan ha mange under seg. Sammen er de TTP, som hører til taktisk/operasjonelt CTI-nivå, ikke teknisk nivå." });
    var niv = [
      ["Taktikk", "hva vil angriperen oppnå? (delmålet)", "Eks.: komme seg inn (Initial Access)", TONE.tung, 6, 328],
      ["Teknikk", "hvordan nås delmålet?", "Eks.: phishing", TONE.info, 22, 296],
      ["Prosedyre", "den konkrete måten én gruppe gjør det på", ["Eks.: gruppe X sender falsk faktura", "med makro i vedlegget"], TONE.ok, 38, 264]
    ];
    niv.forEach(function (n, i) {
      var y = 8 + i * 92, hgt = i === 2 ? 84 : 68;
      rekt(s, n[4], y, n[5], hgt, { fyll: n[3][0], strek: n[3][1], sw: 1.4 });
      T(s, n[4] + 10, y + 16, n[0], { anker: "start", fet: true, str: 14.5, farge: n[3][1] });
      T(s, n[4] + 10, y + 36, n[1], { anker: "start", str: 12.5, farge: n[3][1] });
      var eks = Array.isArray(n[2]) ? n[2] : [n[2]];
      eks.forEach(function (e, j) { T(s, n[4] + 10, y + 55 + j * 15, e, { anker: "start", str: 12.5, kursiv: true, farge: n[3][1] }); });
      if (i < 2) {
        F().pil(s, [[170, y + hgt], [170, y + 92]]);
        T(s, 178, y + hgt + 12, "én av mange", { anker: "start", str: 11.5, kursiv: true, farge: DEMPET });
      }
    });
    rekt(s, 6, 290, 328, 72, { fyll: "none", strek: "var(--color-primary)", sw: 1.6, stiplet: true });
    linjer(s, 170, 326, ["Alle tre sammen = TTP: aktørens profil.", "CTI-nivå: taktisk/operasjonelt.",
      "Ikke teknisk nivå (IP-adresser, filhasher)."], { str: 12.5, lh: 17, forsteFet: true });
  };

  /* ---------- skall-zt: skallmodell mot zero trust ----------
     Kilde: NIST ZTA (SP 1800-35) ordliste (PDP = PE + PA, PEP håndhever, «trust is never granted implicitly») og
     Volume B «Architecture», forespørselsflyten I(1)–I(5) og løpende revurdering. Kursets ord (d09 s. 2–4): skallmodell,
     «stol aldri, verifiser alltid». PDP/PEP som i IAM-fanen. Kurset nevner ikke PE/PA: de står i parentes. */
  IN.FORKLAR["skall-zt"] = function (host) {
    var hh = ramme(host, "skall-zt", lenke("https://pages.nist.gov/zero-trust-architecture/glossary.html", "NIST ZTA-ordlista (PDP, PEP, PE, PA)") + " · " +
      lenke("https://pages.nist.gov/zero-trust-architecture/VolumeB/architecture.html", "NIST ZTA Volume B, «core components» og forespørselsflyten") + " · kursets ord (d09 s. 2–4)",
      "lav – lagdelt forsvar har bare vært et feilalternativ (H2023 9); zero trust, PEP og PDP er ikke spurt om (H2021–H2025).");
    if (!hh) return;
    var c = F().celler(hh, 2, { kol: 2 });

    var a = F().svg(c[0], { w: 340, h: 300, tittel: "Skallmodellen",
      desc: "Ett hardt ytre skall med brannmur. Innenfor står PC, tjener og database med fri ferdsel mellom seg. En angriper som kommer inn via phishing på PC-en, når derfra alt på innsiden." });
    T(a, 170, 14, "Skallmodellen: hardt skall, mykt innhold", { fet: true, str: 13.5 });
    rekt(a, 70, 34, 262, 210, { fyll: TONE.ok[0], strek: TONE.ok[1], sw: 5, r: 18 });
    T(a, 201, 48, "Innsiden: «stoler på alle her»", { str: 12, kursiv: true, farge: TONE.ok[1] });
    var pc = [120, 110], srv = [282, 110], db = [201, 200];
    [[pc, "PC"], [srv, "Tjener"], [db, "Database"]].forEach(function (b) {
      rekt(a, b[0][0] - 36, b[0][1] - 16, 72, 32, { sw: 1.3 });
      T(a, b[0][0], b[0][1], b[1], { str: 13 });
    });
    F().linje(a, [[pc[0] + 36, pc[1]], [srv[0] - 36, srv[1]]]);
    F().linje(a, [[pc[0], pc[1] + 16], [db[0] - 20, db[1] - 16]]);
    F().linje(a, [[srv[0], srv[1] + 16], [db[0] + 20, db[1] - 16]]);
    T(a, 201, 101, "fri ferdsel", { str: 11.5, kursiv: true, farge: TONE.ok[1] });
    // angriper utenfor
    rekt(a, 4, 92, 58, 36, { fyll: TONE.fare[0], strek: TONE.fare[1], sw: 1.4 });
    linjer(a, 33, 110, ["Angriper"], { str: 12, fet: true, farge: TONE.fare[1] });
    F().pil(a, [[62, 110], [pc[0] - 36, pc[1]]]);
    T(a, 33, 142, "phishing", { str: 11.5, kursiv: true, farge: TONE.fare[1] });
    F().pil(a, [[pc[0] - 22, pc[1] + 16], [db[0] - 36, db[1]]], { stiplet: true, klasse: "fk-fare" });
    F().pil(a, [[pc[0] + 20, pc[1] - 16], [pc[0] + 20, 76], [srv[0] - 10, 76], [srv[0] - 10, srv[1] - 16]], { stiplet: true, klasse: "fk-fare" });
    T(a, 201, 68, "når alt", { str: 11.5, kursiv: true, farge: TONE.fare[1], halo: true });
    T(a, 170, 268, "Ett lag: er skallet brutt,", { str: 12.5 });
    T(a, 170, 286, "når angriperen alt innenfor.", { str: 12.5 });

    var b = F().svg(c[1], { w: 340, h: 300, tittel: "Zero trust",
      desc: "Brukeren og enheten ber om en ressurs. Forespørselen går til PEP, som spør PDP (policymotor og policyadministrator). PDP avgjør per forespørsel og sier ja eller nei til PEP, som åpner eller stenger forbindelsen til ressursen. Det gjentas for hver forespørsel, også fra innsiden." });
    T(b, 170, 14, "Zero trust: stol aldri, verifiser alltid", { fet: true, str: 13.5 });
    rekt(b, 70, 34, 200, 66, { fyll: TONE.tung[0], strek: TONE.tung[1], sw: 1.5 });
    T(b, 170, 52, "PDP: avgjør", { fet: true, str: 13.5, farge: TONE.tung[1] });
    linjer(b, 170, 79, ["(policymotor +", "policyadministrator)"], { str: 12, farge: TONE.tung[1], lh: 15 });
    var py = 172;
    rekt(b, 4, py - 26, 82, 52, { sw: 1.3 });
    linjer(b, 45, py, ["Bruker", "+ enhet"], { str: 12.5, lh: 16 });
    rekt(b, 128, py - 22, 84, 44, { fyll: TONE.warn[0], strek: TONE.warn[1], sw: 2.2 });
    linjer(b, 170, py, ["PEP:", "håndhever"], { str: 12.5, fet: true, farge: TONE.warn[1], lh: 16 });
    rekt(b, 254, py - 22, 82, 44, { sw: 1.3 });
    T(b, 295, py, "Ressurs", { str: 12.5 });
    nr(b, 106, py + 16, 1);
    F().pil(b, [[86, py], [128, py]]);
    nr(b, 140, 122, 2);
    F().pil(b, [[156, py - 22], [156, 100]]);
    nr(b, 200, 122, 3);
    F().pil(b, [[184, 100], [184, py - 22]]);
    T(b, 194, 146, "ja/nei", { anker: "start", str: 11.5, kursiv: true });
    nr(b, 233, py + 16, 4);
    F().pil(b, [[212, py], [254, py]]);
    linjer(b, 170, 238, ["1 forespørsel · 2 PEP spør · 3 PDP svarer ·", "4 åpner bare denne forbindelsen.", "Gjentas for hver forespørsel, også på innsiden."], { str: 12, lh: 17 });
    T(b, 170, 290, "Minst mulig rettigheter, anta at noe er kompromittert.", { str: 11.5, kursiv: true, farge: DEMPET });
  };

  /* ---------- faktorer: vet, har, er (/gjør) ----------
     Kilde: NIST SP 800-63B-4 §3.1 (passord = «something you know», OTP, out-of-band og kryptografiske autentikatorer =
     «something you have») og §3.2.3 (biometri bare som del av MFA med en fysisk autentikator). Kurset (BA, t07) har
     vet/har/er (/gjør) og regner sekundærkanaler som SMS som «har»: kursets inndeling brukes. Lapp: vet eller har (t07). */
  IN.FORKLAR["faktorer"] = function (host) {
    var hh = ramme(host, "faktorer", lenke("https://pages.nist.gov/800-63-4/sp800-63b/authenticators/", "NIST SP 800-63B-4 §3.1 og §3.2.3") +
      " · kursets inndeling (BA, t07)",
      "middels – sjelden direkte; nærmest kommer autentiseringsenhetene i H2021 6.3 og 1-faktor i silo-domener (H2023 34).");
    if (!hh) return;
    var s = F().svg(hh, { w: 340, h: 330, maks: 480, tittel: "Tre autentiseringsfaktorer",
      desc: "Tre kolonner. Noe du vet: passord, PIN. Noe du har: kodebrikke, kort, telefon med BankID-app eller SMS. Noe du er: fingeravtrykk, ansikt, og stiplet: noe du gjør, som stemme og tastetrykk. To ulike kategorier gir MFA. Passord og PIN er to ganger vet, altså ikke MFA. Passord på lapp: vet eller har, begge godtas." });
    var kol = [["Noe du vet", ["passord", "PIN"], TONE.info], ["Noe du har", ["kodebrikke", "kort", "telefon:", "BankID-app, SMS"], TONE.warn],
      ["Noe du er", ["fingeravtrykk", "ansikt"], TONE.ok]];
    kol.forEach(function (k, i) {
      var x = 4 + i * 112, w = 108;
      rekt(s, x, 6, w, 32, { fyll: k[2][1], strek: k[2][1], sw: 1 });
      T(s, x + w / 2, 22, k[0], { fet: true, str: 13, farge: k[2][0] });
      rekt(s, x, 38, w, 132, { fyll: k[2][0], strek: k[2][1], sw: 1.2 });
      k[1].forEach(function (e, j) { T(s, x + w / 2, 56 + j * 19, e, { str: 12.5, farge: k[2][1] }); });
      if (i === 2) {
        rekt(s, x + 6, 104, w - 12, 58, { fyll: "none", strek: k[2][1], stiplet: true, sw: 1.2 });
        linjer(s, x + w / 2, 133, ["(/gjør:", "stemme,", "tastetrykk)"], { str: 12, kursiv: true, farge: k[2][1], lh: 15 });
      }
    });
    // MFA-klamme
    F().linje(s, [[58, 176], [58, 190], [282, 190], [282, 176]]);
    F().pil(s, [[170, 190], [170, 210]]);
    rekt(s, 40, 212, 260, 34, { fyll: TONE.tung[0], strek: TONE.tung[1], sw: 1.6 });
    T(s, 170, 229, "To ulike kategorier = MFA", { fet: true, str: 13.5, farge: TONE.tung[1] });
    linjer(s, 170, 280, ["Passord + PIN = to ganger «vet»: ikke MFA.", "Kort + PIN i minibanken = har + vet: MFA.",
      "Passord på lapp: «vet» eller «har», begge godtas."], { str: 12.5, lh: 18 });
  };

  /* ---------- xss-typer: lagret og reflektert ----------
     Kilde: OWASP «Types of Cross-Site Scripting» (Stored: lagres på tjeneren og hentes senere av offeret; Reflected:
     kommer med forespørselen og speiles i svaret uten å lagres). Kursets ord (t04): XSS rammer brukerne via tjeneren.
     OWASP nummererer typene ulikt (Type I/II): bare navnene brukes. DOM-basert XSS er utelatt (ikke i kurset). */
  IN.FORKLAR["xss-typer"] = function (host) {
    var hh = ramme(host, "xss-typer", lenke("https://community.owasp.org/Types_of_Cross-Site_Scripting", "OWASP: Types of Cross-Site Scripting, «Stored» og «Reflected»") +
      " · kursets ord (t04)",
      "middels – XSS dukker opp i vektor- og OWASP-oppgaver (H2022 3.6, H2023 30, H2024 25), men lagret mot reflektert er ikke spurt om direkte.");
    if (!hh) return;
    var c = F().celler(hh, 2, { kol: 2 }), X = [52, 170, 288];
    function oppsett(s, tittel) {
      T(s, 170, 12, tittel, { fet: true, str: 13.5 });
      aktor(s, X[0], 26, 92, ["Angriper"], 300, TONE.fare);
      aktor(s, X[1], 26, 96, ["Sårbart", "nettsted"], 300);
      aktor(s, X[2], 26, 92, ["Offerets", "nettleser"], 300, TONE.info);
    }
    var a = F().svg(c[0], { w: 340, h: 330, tittel: "Lagret XSS",
      desc: "1 Angriperen legger en kommentar med skript på det sårbare nettstedet, og nettstedet lagrer den. 2 Offeret åpner siden senere. 3 Nettstedet sender siden med skriptet. 4 Skriptet kjører i offerets nettleser med offerets rettigheter på siden, og kan for eksempel sende øktinformasjonskapselen til angriperen." });
    oppsett(a, "Lagret: skriptet ligger på siden");
    nr(a, 18, 92, 1); melding(a, X[0], X[1], 100, ["kommentar", "med <script>"]);
    rekt(a, X[1] - 46, 112, 92, 26, { fyll: TONE.warn[0], strek: TONE.warn[1], sw: 1 });
    T(a, X[1], 125, "lagres", { str: 12, farge: TONE.warn[1] });
    nr(a, 322, 158, 2); melding(a, X[2], X[1], 166, ["åpner siden", "senere"]);
    nr(a, 322, 202, 3); melding(a, X[1], X[2], 210, ["siden +", "skriptet"]);
    rekt(a, X[2] - 50, 222, 100, 46, { fyll: TONE.fare[0], strek: TONE.fare[1], sw: 1.4 });
    linjer(a, X[2], 245, ["4 kjører som", "om fra siden"], { str: 12, fet: true, farge: TONE.fare[1], lh: 15 });
    melding(a, X[2] - 50, X[0], 288, ["f.eks. øktcookie"], { stiplet: true, kursiv: true });
    T(a, 170, 318, "Rammer alle som åpner siden.", { str: 12.5, kursiv: true });

    var b = F().svg(c[1], { w: 340, h: 330, tittel: "Reflektert XSS",
      desc: "1 Angriperen sender offeret en lenke med skript i, for eksempel i en e-post. 2 Offeret klikker, og forespørselen med skriptet går til det sårbare nettstedet. 3 Nettstedet speiler skriptet tilbake i svaret, uten å lagre det. 4 Skriptet kjører i offerets nettleser som om det kom fra siden." });
    oppsett(b, "Reflektert: skriptet ligger i lenken");
    nr(b, 18, 92, 1); melding(b, X[0], X[2], 100, ["lenke med skript i (f.eks. e-post)"]);
    nr(b, 322, 138, 2); melding(b, X[2], X[1], 146, ["klikk: forespørsel", "med skriptet"]);
    nr(b, 322, 184, 3); melding(b, X[1], X[2], 192, ["svaret speiler", "skriptet"]);
    T(b, X[1], 208, "ikke lagret", { str: 11.5, kursiv: true, farge: DEMPET, halo: true });
    rekt(b, X[2] - 50, 222, 100, 46, { fyll: TONE.fare[0], strek: TONE.fare[1], sw: 1.4 });
    linjer(b, X[2], 245, ["4 kjører som", "om fra siden"], { str: 12, fet: true, farge: TONE.fare[1], lh: 15 });
    melding(b, X[2] - 50, X[0], 288, ["f.eks. øktcookie"], { stiplet: true, kursiv: true });
    T(b, 170, 318, "Rammer den som klikker på lenken.", { str: 12.5, kursiv: true });
  };

  /* ---------- ipsec-moduser: ESP i transport- og tunnelmodus ----------
     Kilde: RFC 4303 §3.1.1 og §3.1.2 (pakkeoppsett for IPv4: kryptert = nyttelast + ESP-hale, i tunnelmodus også det
     opprinnelige IP-hodet; integritet = ESP-hode til og med ESP-hale; ICV sist og ukryptert) og RFC 4301 §4.1
     (transport typisk vert–vert, tunnel når en sikkerhetsgateway er endepunkt). Kurset: IPsec ligger i IP-laget og har
     ingen port. AH er utelatt (kurset tegner ESP). */
  IN.FORKLAR["ipsec-moduser"] = function (host) {
    var hh = ramme(host, "ipsec-moduser", lenke("https://www.rfc-editor.org/rfc/rfc4303", "RFC 4303 §3.1.1–3.1.2") + " · " +
      lenke("https://www.rfc-editor.org/rfc/rfc4301", "RFC 4301 §4.1"),
      "middels – IPsec kommer i nedtrekk (H2023 10 ≈ H2024 9, H2023 30 = H2024 25), som regel om laget og tunnelmodus.");
    if (!hh) return;
    var s = F().svg(hh, { w: 340, h: 340, maks: 520, tittel: "ESP i transportmodus og tunnelmodus",
      desc: "Transportmodus: IP-hode, ESP-hode, TCP og data, ESP-hale, ICV. TCP og data pluss ESP-halen er kryptert, IP-hodet er synlig. Tunnelmodus: nytt IP-hode, ESP-hode, opprinnelig IP-hode, TCP og data, ESP-hale, ICV. Hele den opprinnelige pakken pluss ESP-halen er kryptert. I begge er integriteten beskyttet fra ESP-hodet til og med ESP-halen. Transport brukes typisk vert–vert, tunnel når en gateway er endepunkt, som i VPN." });
    function rad(y, tittel, felt) {
      T(s, 10, y - 34, tittel, { anker: "start", fet: true, str: 13.5 });
      var x = 10, pos = {};
      felt.forEach(function (f) {
        var kr = f.k, tone = kr ? TONE.tung : (f.ny ? TONE.warn : null);
        rekt(s, x, y, f.w, 44, { fyll: tone ? tone[0] : null, strek: tone ? tone[1] : null, sw: kr ? 1.6 : 1.2, r: 2 });
        linjer(s, x + f.w / 2, y + 22, f.l, { str: 12, farge: tone ? tone[1] : null, lh: 14, fet: !!kr });
        pos[f.id] = [x, x + f.w];
        x += f.w;
      });
      return pos;
    }
    function klamme(x0, x1, y, tekst, ned) {
      var d = ned ? 6 : -6;
      F().linje(s, [[x0 + 1, y], [x0 + 1, y + d], [x1 - 1, y + d], [x1 - 1, y]]);
      T(s, (x0 + x1) / 2, y + d + (ned ? 10 : -9), tekst, { str: 11.5, kursiv: true });
    }
    var p1 = rad(60, "Transportmodus (typisk vert–vert)", [
      { id: "ip", w: 58, l: ["IP-hode"] }, { id: "esp", w: 46, l: ["ESP-", "hode"] },
      { id: "nl", w: 136, l: ["TCP + data"], k: 1 }, { id: "hale", w: 44, l: ["ESP-", "hale"], k: 1 }, { id: "icv", w: 36, l: ["ICV"] }]);
    klamme(p1.nl[0], p1.hale[1], 104, "kryptert", true);
    klamme(p1.esp[0], p1.hale[1], 60, "integritet", false);
    T(s, 10, 142, "IP-hodet er synlig: alle ser hvem som snakker med hvem.", { anker: "start", str: 12, farge: DEMPET });

    var p2 = rad(214, "Tunnelmodus (gateway, VPN)", [
      { id: "ny", w: 58, l: ["Nytt", "IP-hode"], ny: 1 }, { id: "esp", w: 46, l: ["ESP-", "hode"] },
      { id: "oip", w: 74, l: ["Opprinnelig", "IP-hode"], k: 1 }, { id: "nl", w: 62, l: ["TCP +", "data"], k: 1 },
      { id: "hale", w: 44, l: ["ESP-", "hale"], k: 1 }, { id: "icv", w: 36, l: ["ICV"] }]);
    klamme(p2.oip[0], p2.hale[1], 258, "kryptert: hele den opprinnelige pakken", true);
    klamme(p2.esp[0], p2.hale[1], 214, "integritet", false);
    linjer(s, 170, 314, ["Bare gatewayenes adresser er synlige utenpå.", "IPsec ligger i IP-laget og har ingen port."], { str: 12, lh: 17, farge: DEMPET });
  };

  /* ---------- nulldag: tidslinje fra feil til installert rettelse ----------
     Kilde: NIST SP 800-40r4 §2.1 (ukjente sårbarheter som utnyttes = «zero-day attack»; risikoen øker når sårbarheten blir
     kjent; en rettelse kan komme dager, uker eller måneder etter kunngjøringen; installasjon må ofte vente på test og
     vedlikeholdsvindu). Kursets definisjon (d08 s. 4): leverandøren kjenner ikke til den, eller det finnes ingen
     tilgjengelig oppdatering. Kursets ord: nulldagssårbarhet. Rekkefølgen «kjent» og «angriper finner» kan byttes i
     virkeligheten; figuren viser det vanlige nulldagsløpet. */
  IN.FORKLAR["nulldag"] = function (host) {
    var hh = ramme(host, "nulldag", lenke("https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-40r4.pdf", "NIST SP 800-40r4 §2.1") +
      " · kursets definisjon (d08 s. 4)",
      "lav – nulldag gir sjelden egne oppgaver; begrepet dukker opp i påstander og bak CVSS-prioriteringen.");
    if (!hh) return;
    var s = F().svg(hh, { w: 340, h: 380, maks: 480, tittel: "Fra sårbarhet til installert rettelse",
      desc: "Tidslinje ovenfra og ned. 1 Feilen finnes i programvaren, men ingen vet om den. 2 En angriper finner den og utnytter den: nulldag, leverandøren vet ikke, ingen rettelse. 3 Sårbarheten blir kjent for leverandøren og offentlig, for eksempel med en CVE-ID. Fortsatt ingen rettelse, og risikoen øker. 4 Rettelsen publiseres. 5 Rettelsen er installert hos deg. Mellom 4 og 5 er sårbarheten kjent, og angripere utnytter ofte nettopp slike kjente sårbarheter." });
    var ax = 64, ys = [22, 92, 162, 240, 340];
    // bånd
    rekt(s, ax - 14, ys[1], 28, ys[3] - ys[1], { fyll: TONE.fare[1], strek: TONE.fare[1], sw: 0, r: 3 });
    rekt(s, ax - 14, ys[3], 28, ys[4] - ys[3], { fyll: TONE.varsel[1], strek: TONE.varsel[1], sw: 0, r: 3, opa: 0.75 });
    F().pil(s, [[ax, 8], [ax, 374]]);
    T(s, ax - 22, 372, "tid", { anker: "end", str: 11.5, kursiv: true, farge: DEMPET });
    var ev = [
      ["Feilen finnes", "ingen vet om den ennå"],
      ["Angriper finner og utnytter den", "nulldag: leverandøren vet ikke"],
      ["Sårbarheten blir kjent", "f.eks. CVE-ID; risikoen øker"],
      ["Rettelse publisert", "dager, uker eller måneder senere"],
      ["Rettelse installert hos deg", "etter test og vedlikeholdsvindu"]
    ];
    ev.forEach(function (e, i) {
      sv("circle", { cx: ax, cy: ys[i], r: 7, style: "fill:var(--color-surface-container-lowest);stroke:var(--color-on-surface);stroke-width:2" }, s);
      T(s, ax + 22, ys[i] - 8, (i + 1) + " " + e[0], { anker: "start", fet: true, str: 13 });
      T(s, ax + 22, ys[i] + 10, e[1], { anker: "start", str: 12, farge: DEMPET });
    });
    // båndetiketter til venstre (rotert)
    var t1 = T(s, 0, 0, "ingen rettelse finnes", { str: 12, fet: true, farge: TONE.fare[1] });
    t1.setAttribute("transform", "translate(30 " + ((ys[1] + ys[3]) / 2) + ") rotate(-90)");
    var t2 = T(s, 0, 0, "kjent, ikke tettet", { str: 12, fet: true, farge: TONE.varsel[1] });
    t2.setAttribute("transform", "translate(30 " + ((ys[3] + ys[4]) / 2) + ") rotate(-90)");
    rekt(s, ax + 16, 126, 254, 18, { fyll: TONE.fare[0], strek: "none", sw: 0, r: 3 });
    T(s, ax + 22, 135, "Nulldagssårbarhet: punkt 2 til 4", { anker: "start", str: 12, fet: true, farge: TONE.fare[1] });
    rekt(s, ax + 16, 270, 254, 34, { fyll: TONE.varsel[0], strek: "none", sw: 0, r: 3 });
    linjer(s, ax + 143, 287, ["Angripere utnytter ofte kjente", "sårbarheter som ikke er oppdatert"], { str: 12, farge: TONE.varsel[1], lh: 15 });
  };

  /* ---------- ocsp-stifting: uten og med stifting ----------
     Kilde: RFC 6960 §2 (klienten spør en OCSP-tjener om ett sertifikat; svaret er signert av CA-en eller en autorisert
     svarer og har status good/revoked/unknown og tidsfeltene thisUpdate/nextUpdate) og RFC 6066 §8 (status_request i
     ClientHello; tjeneren sender OCSP-svaret i CertificateStatus rett etter sertifikatet). Kurset (t03 O6c, O9b):
     personvernulempen ved OCSP og «must-staple». Utenfor 2026-lysarkene. */
  IN.FORKLAR["ocsp-stifting"] = function (host) {
    var hh = ramme(host, "ocsp-stifting", lenke("https://www.rfc-editor.org/rfc/rfc6960", "RFC 6960 §2") + " · " +
      lenke("https://datatracker.ietf.org/doc/html/rfc6066#section-8", "RFC 6066 §8 (status_request)") + " · t03 O6c og O9b · utenfor 2026-lysarkene",
      "lav – revokering har bare vært med som delspørsmål (X18, X24), og OCSP står ikke på 2026-lysarkene.");
    if (!hh) return;
    var c = F().celler(hh, 2, { kol: 2 }), X = [52, 170, 288];
    function oppsett(s, tittel) {
      T(s, 170, 12, tittel, { fet: true, str: 13.5 });
      aktor(s, X[0], 26, 92, ["Nettleser"], 262, TONE.info);
      aktor(s, X[1], 26, 92, ["Tjener"], 262);
      aktor(s, X[2], 26, 96, ["OCSP-tjener", "(CA)"], 262, TONE.tung);
    }
    var a = F().svg(c[0], { w: 340, h: 310, tittel: "OCSP uten stifting",
      desc: "1 Nettleseren starter TLS-håndtrykket. 2 Tjeneren sender sertifikatet. 3 Nettleseren spør selv CA-ens OCSP-tjener om status for serienummeret. 4 OCSP-tjeneren sender et signert svar: god, tilbakekalt eller ukjent. Ulempe: CA-en får vite hvilket nettsted brukeren besøker." });
    oppsett(a, "Uten stifting: nettleseren spør selv");
    nr(a, 18, 84, 1); melding(a, X[0], X[1], 92, ["ClientHello"]);
    nr(a, 18, 124, 2); melding(a, X[1], X[0], 132, ["sertifikat"]);
    nr(a, 18, 170, 3); melding(a, X[0], X[2], 178, ["status for serienr. …?"], { fet: true });
    nr(a, 18, 216, 4); melding(a, X[2], X[0], 224, ["signert svar: god / tilbakekalt"]);
    rekt(a, 6, 272, 328, 30, { fyll: TONE.fare[0], strek: TONE.fare[1], sw: 1 });
    T(a, 170, 287, "CA-en ser hvilket nettsted du besøker", { str: 12.5, fet: true, farge: TONE.fare[1] });

    var b = F().svg(c[1], { w: 340, h: 310, tittel: "OCSP med stifting",
      desc: "0 På forhånd henter tjeneren selv et signert og tidsstemplet OCSP-svar for sitt eget sertifikat. 1 Nettleseren sender ClientHello og ber om status. 2 Tjeneren sender sertifikatet med det stiftede OCSP-svaret. Nettleseren sjekker CA-signaturen og tiden. CA-en ser ikke besøket. Must-staple betyr at svaret må følge med." });
    oppsett(b, "Med stifting: tjeneren legger svaret ved");
    nr(b, 322, 84, 0); melding(b, X[1], X[2], 92, ["status for mitt?"]);
    melding(b, X[2], X[1], 130, ["signert, tidsstemplet"]);
    nr(b, 18, 170, 1); melding(b, X[0], X[1], 178, ["ClientHello +", "be om status"]);
    nr(b, 18, 216, 2); melding(b, X[1], X[0], 224, ["sertifikat +", "stiftet OCSP-svar"], { fet: true });
    rekt(b, 6, 272, 328, 30, { fyll: TONE.ok[0], strek: TONE.ok[1], sw: 1 });
    T(b, 170, 287, "CA-en ser ikke besøket · must-staple: svaret må med", { str: 12, fet: true, farge: TONE.ok[1] });
  };

  /* ---------- idporten: ID-porten som IdP mellom tjenesten og eID-leverandørene ----------
     Kilde: Digdir, «ID-porten OIDC guide» (tjenesten er relying party/klient, ID-porten er OpenID Provider; flyten
     /authorize → kode → /token → id_token; acr = idporten-loa-substantial/high; amr = MinID, BankID, Buypass,
     Commfides …). Kurset (IAM): IdP, SP, ID-porten, nivåene BETYDELIG og HØYT. Nettleseren bærer omdirigeringene,
     som i sp-oidc; figuren viser rollene, ikke de tolv meldingene. */
  IN.FORKLAR["idporten"] = function (host) {
    var hh = ramme(host, "idporten", lenke("https://docs.digdir.no/docs/idporten/oidc/oidc_guide_english", "Digdir: ID-porten OIDC guide (roller, flyt, acr og amr)") +
      " · kursets ord (IAM)",
      "lav – ID-modeller og eID er spurt om (H2021 7.1, H2022 9.1, H2024 30), men ID-portens mellomrolle har ikke vært egen oppgave.");
    if (!hh) return;
    var s = F().svg(hh, { w: 340, h: 392, maks: 520, tittel: "ID-porten mellom tjenestene og eID-leverandørene",
      desc: "Til venstre offentlige tjenester (SP), i midten ID-porten (IdP, OIDC), til høyre eID-leverandørene MinID (betydelig) og BankID, Buypass og Commfides (høyt). 1 Tjenesten sender brukeren til ID-porten og ber om nivå. 2 Brukeren velger eID i ID-portens vindu. 3 eID-leverandøren autentiserer brukeren. 4 ID-porten gir tjenesten et ID-token som ID-porten har signert, med nivået. Tjenesten har avtale bare med ID-porten og ser aldri eID-leverandøren direkte." });
    T(s, 46, 12, "Tjenester (SP)", { fet: true, str: 12.5 });
    T(s, 170, 12, "IdP (OIDC)", { fet: true, str: 12.5 });
    T(s, 338, 12, "eID-leverandør", { anker: "end", fet: true, str: 11.5 });
    ["NAV", "Skatteetaten", "Kommunen"].forEach(function (n, i) { rekt(s, 4, 30 + i * 46, 84, 36, { sw: 1.2 }); T(s, 46, 48 + i * 46, n, { str: 12.5 }); });
    rekt(s, 120, 46, 100, 86, { fyll: TONE.tung[0], strek: TONE.tung[1], sw: 2 });
    linjer(s, 170, 89, ["ID-porten", "signerer", "ID-tokenet"], { str: 12.5, farge: TONE.tung[1], lh: 17, forsteFet: true });
    [["MinID", "betydelig", TONE.info], ["BankID", "høyt", TONE.ok], ["Buypass", "høyt", TONE.ok], ["Commfides", "høyt", TONE.ok]].forEach(function (e, i) {
      var y = 26 + i * 36;
      rekt(s, 252, y, 84, 32, { fyll: e[2][0], strek: e[2][1], sw: 1.2 });
      linjer(s, 294, y + 16, [e[0], e[1]], { str: 11.5, farge: e[2][1], lh: 13, forsteFet: true });
    });
    // samleskinne fra tjenestene
    F().linje(s, [[88, 48], [100, 48], [100, 140], [88, 140]]);
    F().linje(s, [[88, 94], [100, 94]]);
    F().pil(s, [[100, 72], [120, 72]]);
    nr(s, 110, 58, 1);
    F().pil(s, [[120, 110], [100, 110]]);
    nr(s, 110, 124, 4);
    F().linje(s, [[252, 42], [240, 42], [240, 156], [252, 156]]);
    [78, 114].forEach(function (y) { F().linje(s, [[240, y], [252, y]]); });
    F().pil(s, [[220, 80], [240, 80]], { start: true });
    nr(s, 230, 66, 2); nr(s, 230, 96, 3);
    rekt(s, 4, 176, 332, 24, { fyll: TONE.warn[0], strek: "none", sw: 0, r: 4 });
    T(s, 170, 188, "Nettleseren bærer omdirigeringene, som i OIDC-figuren", { str: 12, kursiv: true, farge: TONE.warn[1] });
    var steg = [
      ["1", ["Tjenesten sender brukeren til ID-porten", "(/authorize) og ber om nivå."]],
      ["2", ["Brukeren velger eID i ID-portens vindu."]],
      ["3", ["eID-leverandøren autentiserer brukeren."]],
      ["4", ["Tjenesten får en kode, bytter den på /token og", "får et ID-token signert av ID-porten, med nivå."]]
    ];
    var y = 222;
    steg.forEach(function (st) {
      nr(s, 14, y, st[0]);
      st[1].forEach(function (l, j) { T(s, 30, y + j * 16, l, { anker: "start", str: 12.5 }); });
      y += 16 * st[1].length + 12;
    });
    T(s, 170, y + 8, "Tjenesten har avtale bare med ID-porten.", { str: 12.5, fet: true });
  };

  /* ---------- aktorkart: ressurser mot motiv ----------
     Kilde: ENISA Threat Landscape 2025 §4.4 «Threat groups converging» (grensene mellom hacktivisme, kriminalitet og
     statlig aktivitet viskes ut; faketivisme = statlige aktører bak hacktivist-masker; hacktivister tar i bruk
     løsepengevirus) og kapittel 6, 7 og 9 (kriminalitet, statlige aktører, hacktivisme). Kurset (t04, CO): tre nivåer
     amatør, cyberkriminell og APT, og innsidere. Kursets nivåer brukes; ENISAs «hacktivister» står inne i amatørfeltet
     ved ideologi. Myke felt, ikke skarpe bokser. */
  IN.FORKLAR["aktorkart"] = function (host) {
    var hh = ramme(host, "aktorkart", lenke("https://www.enisa.europa.eu/sites/default/files/2025-11/ENISA%20Threat%20Landscape%202025.pdf", "ENISA Threat Landscape 2025 §4.4, kap. 6, 7 og 9") +
      " · kursets tre nivåer (t04, CO)",
      "lav – trusselaktørene har ikke hatt egen oppgave i H2021–H2025, bare som del av andre oppgaver.");
    if (!hh) return;
    var s = F().svg(hh, { w: 340, h: 340, maks: 520, tittel: "Trusselaktører: ressurser mot motiv",
      desc: "Vannrett akse: ressurser og evne, fra lav til høy. Loddrett: motiv, ovenfra nysgjerrighet og selvhevdelse, ideologi, penger, og politikk, spionasje og sabotasje. Amatøren ligger til venstre øverst, med hacktivister ved ideologi. Den cyberkriminelle ligger i midten ved penger. APT, ofte statlig, ligger til høyre nederst ved politikk, og strekker seg inn i penger. Feltene overlapper: statlige aktører kan skjule seg bak hacktivister (faketivisme), og hacktivister tar i bruk løsepengevirus. Innsideren har lovlig tilgang og kan ha alle motiver, på alle ressursnivåer." });
    var x0 = 96, x1 = 334, rows = [["Nysgjerrighet,", "selvhevdelse"], ["Ideologi"], ["Penger"], ["Politikk,", "spionasje"]];
    var ry = [40, 92, 144, 196];
    rows.forEach(function (r, i) {
      F().linje(s, [[x0, ry[i]], [x1, ry[i]]], { stiplet: true, klasse: "fk-rutenett" }).style.opacity = ".35";
      linjer(s, x0 - 6, ry[i], r, { anker: "end", str: 12, lh: 14 });
    });
    F().pil(s, [[x0, 232], [x1, 232]]);
    T(s, (x0 + x1) / 2, 246, "ressurser og evne: lav → høy", { str: 12, kursiv: true });
    T(s, 6, 14, "Motiv", { anker: "start", fet: true, str: 12.5 });
    function felt(cx, cy, rx, ry2, tone, etikett) {
      sv("ellipse", { cx: cx, cy: cy, rx: rx, ry: ry2, style: "fill:" + tone[0] + ";fill-opacity:.7;stroke:" + tone[1] + ";stroke-width:1.2;stroke-dasharray:3 4" }, s);
      if (etikett) T(s, etikett[0], etikett[1], etikett[2], { fet: true, str: 13, farge: tone[1] });
    }
    felt(150, 62, 56, 44, TONE.info, [146, 48, "Amatør"]);
    felt(222, 140, 60, 30, TONE.warn, [222, 144, "Kriminell"]);
    felt(290, 178, 46, 52, TONE.tung, [292, 196, "APT"]);
    T(s, 150, 92, "hacktivister", { str: 12, kursiv: true, farge: TONE.info[1], halo: true });
    T(s, 292, 212, "(ofte statlig)", { str: 11.5, farge: TONE.tung[1] });
    // overlapp
    F().pil(s, [[276, 128], [196, 94]], { stiplet: true });
    T(s, 262, 110, "faketivisme", { str: 11.5, kursiv: true, halo: true });
    F().pil(s, [[150, 104], [176, 132]], { stiplet: true });
    T(s, 120, 124, "løsepenger", { str: 11.5, kursiv: true, halo: true });
    rekt(s, 6, 262, 328, 38, { fyll: "none", strek: TONE.fare[1], sw: 1.4, stiplet: true });
    linjer(s, 170, 281, ["Innsider: lovlig tilgang innenfor perimeteren,", "kan ha alle motiver, på alle nivåer"], { str: 12, lh: 15, farge: TONE.fare[1] });
    T(s, 170, 322, "Grensene er glidende: samme verktøy, ulike masker.", { str: 12, kursiv: true, farge: DEMPET });
  };
})();
