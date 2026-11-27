/* ============================================================
   IN2120 guide · figurer/forklar-b.js
   Nye visuelle forklaringer (fase 5, punkt 3) for teorifanene, tegnet med IN.fig (fig-felles.js).
   Ingen eksamensfigurer og ingen svarfelt. Hver figur har en dempet kildelinje under seg.
     IN.FORKLAR["id"] = function (host) { … }   host = element eller selektor (tømmes først)
   Figurer i denne fila (kilder og avvik: plan/figurer/FORKLARINGER.md):
     iptables-kjeder    09-nettverk · brannmur   INPUT, FORWARD og OUTPUT etter rutingsbeslutningen
     arp-forgiftning    09-nettverk · hvemser    ARP-forgiftning som sekvens
     nids-plassering    09-nettverk · ids        NIDS-sensorer og IPS inline
     garantinivaa-stiger 07-autentisering · mfa  eIDAS og NIST AAL side om side (ikke 1:1)
     rbac-dac           08-iam · tk              RBAC (brukere → roller → tillatelser) og DAC (ACL)
     entitet-identitet  08-iam · faser           én entitet, tre identiteter, én identifikator per domene
   Lastes etter fig-felles.js og fig-husk.js. Klassisk script, ingen moduler.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FORKLAR = IN.FORKLAR || {};
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, parent) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (attrs[k] == null) continue;
      if (k === "text") n.textContent = attrs[k]; else if (k === "html") n.innerHTML = attrs[k]; else n.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(n);
    return n;
  }
  function sv(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  /* Ramme: <figure class="fig-vis fig-forklar"> med tegneflate og kildelinje. */
  function ramme(host, id, kilde) {
    if (typeof host === "string") host = document.querySelector(host);
    if (!host) return null;
    while (host.firstChild) host.removeChild(host.firstChild);
    var fig = el("figure", { class: "fig-vis fig-forklar", "data-forklar": id }, host);
    var tegn = el("div", { class: "fig-forklar-h" }, fig);
    var cap = el("figcaption", { class: "small muted fig-vis-cap" }, fig);
    el("span", { text: "Kilde: " }, cap);
    kilde.forEach(function (k, i) {
      if (i) el("span", { text: "; " }, cap);
      if (k.url) el("a", { href: k.url, text: k.navn, target: "_blank", rel: "noopener" }, cap);
      else el("span", { text: k.navn }, cap);
    });
    el("span", { text: ". Egen tegning." }, cap);
    return tegn;
  }

  /* Tonet flate (temafarger fra styles.css, følger lys/mørk). tone: info | ok | warn | danger | caution | null */
  function flate(p, x, y, w, h, tone, o) {
    o = o || {};
    var st = "fill:" + (tone ? "var(--color-tone-" + tone + ")" : "var(--fig-bg)") +
      ";stroke:" + (o.kant || "var(--color-outline)") + ";stroke-width:" + (o.sw || 1.3) +
      (o.stiplet ? ";stroke-dasharray:5 4" : "");
    return sv("rect", { x: x, y: y, width: w, height: h, rx: o.r != null ? o.r : 5, style: st }, p);
  }
  /* Tekst med valgfri farge. linjer: streng eller [strenger], lh = linjeavstand. */
  function txt(p, x, y, linjer, o) {
    o = o || {};
    var F = IN.fig, ut = [];
    (Array.isArray(linjer) ? linjer : [linjer]).forEach(function (l, i) {
      var t = F.tekst(p, x, y + i * (o.lh || 15), l, { anker: o.anker, fet: o.fet, kursiv: o.kursiv, str: o.str || 12.5 });
      if (o.farge) t.style.fill = o.farge;
      if (o.halo) { t.style.paintOrder = "stroke"; t.style.stroke = "var(--fig-bg)"; t.style.strokeWidth = "5px"; t.style.strokeLinejoin = "round"; }
      ut.push(t);
    });
    return ut;
  }
  function tone(navn) { return "var(--color-on-tone-" + navn + ")"; }
  var DEMPET = "var(--color-on-surface-variant)";

  /* ---------- #2 iptables: INPUT, FORWARD, OUTPUT ---------- */
  IN.FORKLAR["iptables-kjeder"] = function (host) {
    var h = ramme(host, "iptables-kjeder", [
      { navn: "netfilter Packet Filtering HOWTO §6", url: "https://iptables.org/documentation/HOWTO/packet-filtering-HOWTO-6.html" },
      { navn: "kursets nettverkslysarket" }]);
    if (!h) return;
    var F = IN.fig, s = F.svg(h, { w: 340, h: 478, maks: 520, tittel: "Pakkens vei gjennom iptables-kjedene",
      desc: "En pakke kommer inn på et grensesnitt. Rutingsbeslutningen avgjør kjeden: pakker til brannmuren selv går til INPUT og videre til et program på brannmuren. Pakker til en annen maskin går til FORWARD og ut på et annet grensesnitt. Pakker som brannmuren selv lager, går gjennom OUTPUT. Eksempel fra H2023 32: web-tjener til database går gjennom brannmuren, altså FORWARD." });
    flate(s, 60, 8, 220, 32, null);
    txt(s, 170, 24, "Pakke inn på et grensesnitt", { str: 12.5 });
    F.pil(s, [[170, 40], [170, 62]]);
    var r = F.boks(s, 40, 62, 260, 46, "", { rolle: "funk", r: 6 });
    txt(r.g, 170, 77, ["Rutingsbeslutning", "Hvem er pakken til?"], { str: 12.5, lh: 16, farge: "var(--fig-funk-t)" });
    F.pil(s, [[82, 108], [82, 148]]);
    F.pil(s, [[258, 108], [258, 148]]);
    // Kjedene
    function kjede(x, y, navn, under) {
      var b = F.boks(s, x, y, 140, 50, "", { rolle: "uthev", r: 6 });
      txt(b.g, x + 70, y + 17, navn, { str: 14, fet: true, farge: tone("info") });
      txt(b.g, x + 70, y + 35, under, { str: 12, farge: tone("info") });
      return b;
    }
    kjede(12, 148, "INPUT", "til brannmuren selv");
    kjede(188, 148, "FORWARD", "gjennom brannmuren");
    F.pil(s, [[82, 198], [82, 226]]);
    flate(s, 12, 226, 140, 46, null);
    txt(s, 82, 241, ["Program på brann-", "muren (f.eks. sshd)"], { str: 12, lh: 15 });
    F.pil(s, [[82, 272], [82, 300]]);
    txt(s, 90, 286, "svar og egne pakker", { str: 12, anker: "start", farge: DEMPET });
    kjede(12, 300, "OUTPUT", "fra brannmuren selv");
    F.pil(s, [[82, 350], [82, 396]]);
    F.pil(s, [[258, 198], [258, 396]]);
    txt(s, 266, 300, ["til en annen", "maskin"], { str: 12, anker: "start", farge: DEMPET, lh: 14 });
    flate(s, 12, 396, 316, 32, null);
    txt(s, 170, 412, "Ut på et grensesnitt", { str: 12.5 });
    // Eksempel
    txt(s, 12, 448, ["H2023 32: web-tjeneren (ytre segment) til databasen", "(indre segment) går gjennom brannmuren: FORWARD."],
      { str: 12, anker: "start", lh: 16, farge: DEMPET });
  };

  /* ---------- #5 ARP-forgiftning ---------- */
  IN.FORKLAR["arp-forgiftning"] = function (host) {
    var h = ramme(host, "arp-forgiftning", [
      { navn: "MITRE ATT&CK T1557.002 (ARP Cache Poisoning)", url: "https://attack.mitre.org/techniques/T1557/002/" },
      { navn: "kursets nettverkslysarket" }]);
    if (!h) return;
    var F = IN.fig, s = F.svg(h, { w: 340, h: 362, maks: 540, tittel: "ARP-forgiftning i et lokalnett",
      desc: "Ruteren kringkaster: hvem har 10.1.1.3? Angriperen (10.1.1.4) svarer først med sin egen MAC-adresse. Ruterens ARP-tabell kobler da 10.1.1.3 til angriperens MAC. Pakker til offeret går til angriperen, som sender dem videre og kan lese og endre dem: mann i midten. ARP har ingen autentisering." });
    var X = [54, 170, 286];
    var hode = [["Ruteren", "10.1.1.1", "MAC …-01"], ["Angriperen", "10.1.1.4", "MAC …-04"], ["Offeret", "10.1.1.3", "MAC …-03"]];
    hode.forEach(function (hd, i) {
      flate(s, X[i] - 52, 6, 104, 54, i === 1 ? "danger" : null);
      txt(s, X[i], 20, hd[0], { str: 12.5, fet: true, farge: i === 1 ? tone("danger") : null });
      txt(s, X[i], 36, [hd[1], hd[2]], { str: 12, lh: 13, farge: i === 1 ? tone("danger") : null });
      F.linje(s, [[X[i], 60], [X[i], 300]], { stiplet: true });
    });
    function melding(y, fra, til, tekst, o) {
      o = o || {};
      F.pil(s, [[X[fra], y], [X[til] + (til > fra ? -2 : 2), y]], { stiplet: o.stiplet });
      txt(s, o.tx != null ? o.tx : (X[fra] + X[til]) / 2, y - 12, tekst, { str: 12, fet: o.fet, farge: o.farge, halo: true });
    }
    melding(92, 0, 2, "1  «Hvem har 10.1.1.3?» (til alle)", { tx: 170 });
    melding(134, 1, 0, "2  «10.1.1.3 er …-04»", { fet: true, farge: "var(--color-error)", tx: 112 });
    txt(s, 180, 128, ["falskt svar,", "kommer først"], { str: 12, lh: 14, anker: "start", farge: "var(--color-error)", halo: true });
    flate(s, 4, 166, 148, 38, "warn");
    txt(s, 78, 179, ["Ruterens ARP-tabell:", "10.1.1.3 → …-04"], { str: 12, lh: 14, farge: tone("warn") });
    melding(236, 0, 1, "3  pakker til 10.1.1.3", { tx: 112 });
    melding(278, 1, 2, "4  sendt videre", { tx: 228 });
    txt(s, 228, 292, "kan leses og endres", { str: 12, farge: "var(--color-error)", halo: true });
    txt(s, 4, 324, ["ARP har ingen autentisering: alle kan svare, og svaret", "lagres. Angriperen er nå mann i midten i lokalnettet."],
      { str: 12, anker: "start", lh: 16, farge: DEMPET });
  };

  /* ---------- #6 Plassering av NIDS og IPS ---------- */
  IN.FORKLAR["nids-plassering"] = function (host) {
    var h = ramme(host, "nids-plassering", [
      { navn: "NIST SP 800-94 §4.2.2 og fig. 4-2/4-3", url: "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-94.pdf" },
      { navn: "kursets nettverkslysarket" }]);
    if (!h) return;
    var F = IN.fig, s = F.svg(h, { w: 340, h: 430, maks: 540, tittel: "Hvor NIDS- og IPS-sensorene står",
      desc: "Nettet fra Internett og innover: ytre brannmur, DMZ, indre brannmur og indre segment. En passiv NIDS-sensor utenfor gatewayen ser alle forsøk utenfra. En passiv NIDS i DMZ får en kopi av trafikken fra en speilport og varsler. En IPS står inline foran det indre segmentet: trafikken går gjennom den, så den kan blokkere." });
    var cx = 95;
    function sensor(y, linjer, t) {
      flate(s, 190, y, 146, 16 + linjer.length * 14, t || null, { r: 6 });
      txt(s, 263, y + 15, linjer, { str: 12, lh: 14, fet: false, farge: t ? tone(t) : null });
    }
    // Internett
    flate(s, 30, 6, 130, 30, null, { r: 15 });
    txt(s, cx, 21, "Internett", { str: 12.5, fet: true });
    F.linje(s, [[cx, 36], [cx, 78]]);
    sv("circle", { cx: cx, cy: 52, r: 4, style: "fill:var(--fig-strek)" }, s);
    F.linje(s, [[cx + 4, 52], [190, 52]], { stiplet: true });
    sensor(30, ["NIDS utenfor gatewayen:", "ser alle forsøk utenfra"]);
    // Ytre brannmur
    var b1 = F.boks(s, 30, 78, 130, 30, "", { rolle: "funk", r: 4 });
    txt(b1.g, cx, 93, "Ytre brannmur", { str: 12.5, farge: "var(--fig-funk-t)" });
    F.linje(s, [[cx, 108], [cx, 130]]);
    // DMZ
    flate(s, 14, 130, 162, 46, null, { r: 6, sw: 1.6 });
    txt(s, cx, 145, ["DMZ", "web, e-post"], { str: 12, lh: 16 });
    F.linje(s, [[176, 153], [190, 153]], { stiplet: true });
    sensor(132, ["NIDS i DMZ: kopi fra", "speilport, varsler"]);
    F.linje(s, [[cx, 176], [cx, 200]]);
    var b2 = F.boks(s, 30, 200, 130, 30, "", { rolle: "funk", r: 4 });
    txt(b2.g, cx, 215, "Indre brannmur", { str: 12.5, farge: "var(--fig-funk-t)" });
    F.linje(s, [[cx, 230], [cx, 254]]);
    // IPS inline
    flate(s, 30, 254, 130, 34, "danger", { r: 6, kant: "var(--color-error)", sw: 2 });
    txt(s, cx, 271, "IPS (inline)", { str: 12.5, fet: true, farge: tone("danger") });
    F.linje(s, [[160, 271], [190, 271]], { stiplet: false });
    sensor(250, ["Trafikken går gjennom", "sensoren: kan blokkere"], "danger");
    F.linje(s, [[cx, 288], [cx, 312]]);
    flate(s, 14, 312, 162, 46, null, { r: 6, sw: 1.6 });
    txt(s, cx, 327, ["Indre segment", "klienter, database"], { str: 12, lh: 16 });
    // Tegnforklaring
    F.linje(s, [[14, 386], [44, 386]]);
    txt(s, 52, 386, "trafikken går gjennom", { str: 12, anker: "start", farge: DEMPET });
    F.linje(s, [[184, 386], [214, 386]], { stiplet: true });
    txt(s, 222, 386, "sensoren får en kopi", { str: 12, anker: "start", farge: DEMPET });
    txt(s, 14, 410, "IDS oppdager og varsler. IPS kan blokkere.", { str: 12, anker: "start", farge: DEMPET });
  };

  /* ---------- #7 eIDAS og NIST AAL side om side ---------- */
  IN.FORKLAR["garantinivaa-stiger"] = function (host) {
    var h = ramme(host, "garantinivaa-stiger", [
      { navn: "eIDAS art. 8 og EU 2015/1502 vedlegg 2.2.1 og 2.3.1", url: "https://eur-lex.europa.eu/eli/reg_impl/2015/1502/oj/eng" },
      { navn: "NIST SP 800-63B-4 §2 (AAL)", url: "https://pages.nist.gov/800-63-4/sp800-63b/aal" },
      { navn: "kursets BA-lysark" }]);
    if (!h) return;
    var F = IN.fig, s = F.svg(h, { w: 340, h: 384, maks: 540, tittel: "Garantinivå i eIDAS og NIST 800-63-4",
      desc: "To stiger side om side, uten likhetstegn mellom dem. eIDAS: Low (minst én faktor, for eksempel SMS-PIN for virksomheter), Substantial (minst to faktorer fra ulike kategorier, for eksempel MinID), High (i tillegg vern mot kopiering og angripere med høyt angrepspotensial, for eksempel BankID). NIST: AAL1 (én faktor holder), AAL2 (to faktorer, et phishingresistent valg må tilbys), AAL3 (kryptografisk og phishingresistent, privatnøkkelen kan ikke kopieres ut)." });
    var kol = [
      { x: 6, tittel: "eIDAS (EU)", nivaa: [
        ["High", ["+ vern mot kopiering og", "høyt angrepspotensial"], "BankID, Buypass (HØYT)"],
        ["Substantial", ["minst to faktorer fra", "ulike kategorier"], "MinID (BETYDELIG)"],
        ["Low", ["minst én faktor"], "SMS-PIN for virksomheter (LAVT)"]] },
      { x: 178, tittel: "NIST SP 800-63-4", nivaa: [
        ["AAL3", ["kryptografisk, phishing-", "resistent, nøkkelen kan", "ikke kopieres ut"], null],
        ["AAL2", ["to faktorer; et phishing-", "resistent valg må tilbys"], null],
        ["AAL1", ["én faktor holder", "(MFA bør tilbys)"], null]] }];
    var T = ["warn", "info", "ok"];
    kol.forEach(function (k) {
      txt(s, k.x + 78, 16, k.tittel, { str: 13, fet: true });
      k.nivaa.forEach(function (n, i) {
        var y = 32 + i * 92, innrykk = i * 8; // trappetrinn: høyeste nivå øverst og bredest
        flate(s, k.x + innrykk / 2, y, 156 - innrykk, 82, T[i], { r: 6 });
        var c = k.x + 78;
        txt(s, c, y + 15, n[0], { str: 13, fet: true, farge: tone(T[i]) });
        txt(s, c, y + 33, n[1], { str: 12, lh: 14, farge: tone(T[i]) });
        if (n[2]) txt(s, c, y + 70, n[2], { str: 12, kursiv: true, farge: tone(T[i]) });
      });
    });
    // Ikke likhetstegn: skillelinje med ≠
    F.linje(s, [[170, 32], [170, 302]], { stiplet: true });
    flate(s, 160, 156, 20, 22, null, { r: 4 });
    txt(s, 170, 167, "≠", { str: 15, fet: true });
    txt(s, 6, 324, ["Stigene har hver sine krav og kan ikke byttes 1:1.", "Phishingresistens er et uttrykt krav bare i NIST.", "Nivået velges etter konsekvensen, ikke «høyest mulig»."],
      { str: 12, anker: "start", lh: 16, farge: DEMPET });
  };

  /* ---------- #9 RBAC og DAC ---------- */
  IN.FORKLAR["rbac-dac"] = function (host) {
    var h = ramme(host, "rbac-dac", [
      { navn: "NIST RBAC-modellen (Ferraiolo mfl. 2001, §3.1 Core RBAC)", url: "https://csrc.nist.gov/projects/role-based-access-control" },
      { navn: "NIST-ordlisten: discretionary access control", url: "https://csrc.nist.gov/glossary/term/discretionary_access_control" },
      { navn: "kursets IAM-lysark" }]);
    if (!h) return;
    var F = IN.fig, c = F.celler(h, 2);
    // RBAC
    var s = F.svg(c[0], { w: 310, h: 262, maks: 400, tittel: "RBAC: tilgang via roller",
      desc: "Brukerne Kari, Ola og Per er tildelt roller: Kari er lege, Ola og Per er sykepleiere. Rollene har tillatelser, altså en operasjon på et objekt: lege kan lese journal og skrive resept, sykepleier kan lese journal og lese vaktliste. I en økt aktiverer Kari rollen lege, vanligvis én rolle om gangen." });
    txt(s, 155, 12, "RBAC: tilgang via roller", { str: 13, fet: true });
    txt(s, 44, 34, "Brukere", { str: 12, farge: DEMPET });
    txt(s, 148, 34, "Roller", { str: 12, farge: DEMPET });
    txt(s, 257, 34, "Tillatelser", { str: 12, farge: DEMPET });
    var U = [["Kari", 62], ["Ola", 106], ["Per", 150]], R = [["Lege", 76], ["Sykepleier", 134]],
      P = [["les journal", 62], ["skriv resept", 106], ["les vaktliste", 150]];
    U.forEach(function (u) { flate(s, 8, u[1] - 14, 72, 28, null); txt(s, 44, u[1], u[0], { str: 12.5 }); });
    R.forEach(function (r) { flate(s, 106, r[1] - 15, 84, 30, "info", { r: 15 }); txt(s, 148, r[1], r[0], { str: 12.5, fet: true, farge: tone("info") }); });
    P.forEach(function (p) { flate(s, 210, p[1] - 14, 94, 28, "ok"); txt(s, 257, p[1], p[0], { str: 12, farge: tone("ok") }); });
    [[62, 76], [106, 134], [150, 134]].forEach(function (a) { F.linje(s, [[80, a[0]], [106, a[1]]]); });
    [[76, 62], [76, 106], [134, 62], [134, 150]].forEach(function (a) { F.linje(s, [[190, a[0]], [210, a[1]]]); });
    flate(s, 8, 178, 296, 46, null, { stiplet: true });
    txt(s, 156, 193, ["Økt: Kari logger inn og aktiverer «Lege»", "(vanligvis én rolle om gangen)"], { str: 12, lh: 15 });
    txt(s, 8, 246, "Tillatelse = en operasjon på et objekt.", { str: 12, anker: "start", farge: DEMPET });
    // DAC
    var d = F.svg(c[1], { w: 310, h: 262, maks: 400, tittel: "DAC: eieren bestemmer",
      desc: "Objektet rapport.docx har en tilgangskontrolliste (ACL): Kari er eier og kan lese og skrive, Ola kan lese. Kari endrer ACL-en etter eget skjønn. Når Ola ber om å lese, sjekkes forespørselen mot ACL-en." });
    txt(d, 155, 12, "DAC: eieren bestemmer", { str: 13, fet: true });
    flate(d, 168, 34, 136, 30, null, { sw: 1.8 });
    txt(d, 236, 49, "rapport.docx", { str: 12.5, fet: true });
    flate(d, 168, 70, 136, 72, "info");
    txt(d, 236, 84, "ACL", { str: 12, fet: true, farge: tone("info") });
    txt(d, 176, 104, ["Kari (eier): les, skriv", "Ola: les"], { str: 12, anker: "start", lh: 18, farge: tone("info") });
    sv("line", { x1: 236, y1: 64, x2: 236, y2: 70, style: "stroke:var(--fig-strek);stroke-width:1.6" }, d);
    flate(d, 8, 50, 92, 30, null); txt(d, 54, 65, "Kari (eier)", { str: 12.5 });
    flate(d, 8, 124, 92, 30, null); txt(d, 54, 139, "Ola", { str: 12.5 });
    F.pil(d, [[100, 65], [166, 94]]);
    txt(d, 88, 100, "endrer ACL-en", { str: 12, anker: "start", farge: DEMPET, halo: true });
    F.pil(d, [[100, 139], [166, 126]], { stiplet: true });
    txt(d, 128, 156, "ber om å lese", { str: 12, farge: DEMPET });
    txt(d, 8, 192, ["Systemet sjekker forespørselen mot", "ACL-en ved objektet. Eieren kan gi", "bort tilgang etter eget skjønn."],
      { str: 12, anker: "start", lh: 16, farge: DEMPET });
  };

  /* ---------- #10 Entitet, identitet og identifikator ---------- */
  IN.FORKLAR["entitet-identitet"] = function (host) {
    var h = ramme(host, "entitet-identitet", [
      { navn: "NIST SP 800-63-4, ordliste (digital identity, identifier)", url: "https://pages.nist.gov/800-63-4/sp800-63/glossary" },
      { navn: "kursets IAM-lysark" }]);
    if (!h) return;
    var F = IN.fig, s = F.svg(h, { w: 340, h: 404, maks: 540, tittel: "Én entitet, flere identiteter",
      desc: "Entiteten Nora, en person, har tre identiteter i tre domener. Hos UiO er identifikatoren brukernavnet, og attributtene er blant annet navn, e-post og studieprogram. Hos Skatteetaten er identifikatoren fødselsnummeret, og attributtene er navn, adresse og inntekt. Hos banken er identifikatoren kundenummeret, og attributtene er navn, kontoer og lån." });
    flate(s, 100, 6, 140, 46, null, { sw: 2 });
    txt(s, 170, 20, "Entitet", { str: 12, farge: DEMPET });
    txt(s, 170, 37, "Nora (en person)", { str: 13, fet: true });
    F.linje(s, [[170, 52], [170, 64], [20, 64], [20, 300]]);
    var D = [["Identitet hos UiO", "brukernavn", "navn, e-post, studieprogram"],
      ["Identitet hos Skatteetaten", "fødselsnummer", "navn, adresse, inntekt"],
      ["Identitet hos banken", "kundenummer", "navn, kontoer, lån"]];
    D.forEach(function (dd, i) {
      var y = 76 + i * 88;
      F.pil(s, [[20, y + 38], [38, y + 38]]);
      flate(s, 40, y, 294, 76, null, { r: 8, sw: 1.5 });
      txt(s, 52, y + 15, dd[0], { str: 12.5, fet: true, anker: "start" });
      flate(s, 50, y + 27, 274, 22, "info", { r: 4 });
      txt(s, 58, y + 38, "Identifikator: " + dd[1], { str: 12, anker: "start", fet: true, farge: tone("info") });
      txt(s, 52, y + 62, "Attributter: " + dd[2], { str: 12, anker: "start" });
    });
    txt(s, 6, 352, ["Identitet = et sett attributter i ett domene.", "Identifikatoren er det entydige navnet der.", "Samme entitet, tre identiteter."],
      { str: 12, anker: "start", lh: 16, farge: DEMPET });
  };
})();
