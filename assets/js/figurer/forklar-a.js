/* ============================================================
   IN2120 guide · figurer/forklar-a.js
   Nye visuelle forklaringer (fase 5, punkt 3) for teori-fanene. Ikke eksamensfigurer, ingen svarfelt.
   Hver figur er forankret i en lest kildeseksjon (se plan/figurer/FORKLARINGER.md) og følger kursets ord
   (plan/vranglaere.md). Bruker IN.fig (fig-felles.js) og temafargene fra styles.css (lys/mørk).

   BRUK (i blokksidens skript):  IN.FORKLAR["csf-nsm"]("#fk-csf-nsm");
     host = element eller selektor. Tegner <figure class="fig-vis"> med figur og kildelinje. Kan kalles flere ganger.

   Figurer i denne fila:
     csf-nsm       06-risiko · rammeverk  NIST CSF 2.0-hjulet og NSMs fire kategorier
     iso-familie   06-risiko · iso        ISO/IEC 27000-familien, bare 27001 sertifiseres
     skadevaretre  04-angrep · skadevare  tre spørsmål om spredning, pluss når og hva
     hashkrav      02-krypto · hash       enveis, svak og sterk kollisjonsresistens
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  IN.FORKLAR = IN.FORKLAR || {};
  var NS = "http://www.w3.org/2000/svg";

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
  /* Tekst med egen farge: F.tekst setter størrelsen i style, så fargen legges til der. */
  function T(parent, x, y, tekst, o) {
    o = o || {};
    var t = IN.fig.tekst(parent, x, y, tekst, { anker: o.anker, fet: o.fet, kursiv: o.kursiv });
    t.setAttribute("style", "font-size:" + (o.str || 13) + "px" + (o.farge ? ";fill:" + o.farge : ""));
    return t;
  }
  /* Flere linjer sentrert rundt y. */
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
        ";stroke-width:" + (o.sw || 1.4) + (o.stiplet ? ";stroke-dasharray:5 4" : "") }, parent);
  }
  /* Fargepar (fyll, tekst) som følger lys/mørk modus. */
  var TONE = {
    forebygg: ["var(--color-tone-ok)", "var(--color-on-tone-ok)"],
    oppdag: ["var(--color-tone-warn)", "var(--color-on-tone-warn)"],
    korriger: ["var(--color-tone-danger)", "var(--color-on-tone-danger)"],
    styr: ["var(--color-tone-heavy)", "var(--color-on-tone-heavy)"],
    info: ["var(--color-tone-info)", "var(--color-on-tone-info)"]
  };

  /* Felles ramme: <figure class="fig-vis"> med tegning og kildelinje. */
  function ramme(host, id, kilde) {
    if (typeof host === "string") host = document.querySelector(host);
    if (!host) return null;
    while (host.firstChild) host.removeChild(host.firstChild);
    var fig = hx("figure", { class: "fig-vis fk-fig", "data-forklar": id }, host);
    var hh = hx("div", { class: "exam-fig-h" }, fig);
    hx("figcaption", { class: "small muted fig-vis-cap", html: "Kilde: " + kilde + ". Egen tegning." }, fig);
    return hh;
  }
  function lenke(url, tekst) { return '<a href="' + url + '" target="_blank" rel="noopener" style="font-weight:400">' + tekst + "</a>"; }

  /* ---------- csf-nsm: NIST CSF 2.0 som hjul, og NSMs fire kategorier ----------
     Kilde: NIST CSWP 29 §2 og fig. 2 (GOVERN i midten «because it informs how an organization will implement the other
     five Functions»), NSMs grunnprinsipper v2.1 («fordelt på fire kategorier»). Fargene (forebyggende/oppdagende/korrigerende)
     er kursets kobling (ism s. 19), ikke NISTs. Rekkefølgen med klokka følger fig. 2. */
  IN.FORKLAR["csf-nsm"] = function (host) {
    var hh = ramme(host, "csf-nsm", lenke("https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf", "NIST CSWP 29 (CSF 2.0) §2 og fig. 2") +
      " · " + lenke("https://nsm.no/getfile.php/1313975-1717589722/NSM/Filer/Dokumenter/Veiledere/NSMs%20Grunnprinsipper%20for%20IKT-sikkerhet%20v2.1.pdf", "NSMs grunnprinsipper v2.1, «fire kategorier»") +
      " · fargene etter kurset (ism s. 19)");
    if (!hh) return;
    var F = IN.fig, c = F.celler(hh, 2, { kol: 2 });

    /* Venstre: hjulet */
    var s = F.svg(c[0], { w: 340, h: 330, tittel: "NIST CSF 2.0: seks funksjoner som hjul",
      desc: "GOVERN i midten. Rundt, med klokka fra toppen: IDENTIFY og PROTECT (forebyggende), DETECT (oppdagende), RESPOND og RECOVER (korrigerende). Eksamenssettene H2021–H2025 har bare de fem ytre funksjonene." });
    var cx = 170, cy = 140, R = 128, r = 50;
    function p(rad, a) { var v = a * Math.PI / 180; return (cx + rad * Math.cos(v)).toFixed(1) + " " + (cy + rad * Math.sin(v)).toFixed(1); }
    [["IDENTIFY", "ID", "forebygg"], ["PROTECT", "PR", "forebygg"], ["DETECT", "DE", "oppdag"], ["RESPOND", "RS", "korriger"], ["RECOVER", "RC", "korriger"]].forEach(function (f, i) {
      var m = -90 + i * 72, a0 = m - 36, a1 = m + 36, tone = TONE[f[2]];
      sv("path", { d: "M" + p(R, a0) + " A" + R + " " + R + " 0 0 1 " + p(R, a1) + " L" + p(r, a1) + " A" + r + " " + r + " 0 0 0 " + p(r, a0) + " Z",
        style: "fill:" + tone[0] + ";stroke:var(--color-surface-container-lowest);stroke-width:4" }, s);
      var v = m * Math.PI / 180, tx = cx + 90 * Math.cos(v), ty = cy + 90 * Math.sin(v);
      T(s, tx, ty - 8, f[0], { fet: true, str: 13.5, farge: tone[1] });
      T(s, tx, ty + 10, f[1], { str: 12, farge: tone[1] });
    });
    sv("circle", { cx: cx, cy: cy, r: r - 4, style: "fill:" + TONE.styr[0] + ";stroke:var(--color-tertiary);stroke-width:2" }, s);
    T(s, cx, cy - 8, "GOVERN", { fet: true, str: 13.5, farge: TONE.styr[1] });
    T(s, cx, cy + 10, "GV · ny i 2.0", { str: 12, farge: TONE.styr[1] });
    // Forklaring av fargene
    [["Forebyggende", "forebygg", 8], ["Oppdagende", "oppdag", 122], ["Korrigerende", "korriger", 226]].forEach(function (l) {
      rekt(s, l[2], 280, 14, 14, { fyll: TONE[l[1]][0], strek: TONE[l[1]][1], sw: 1, r: 3 });
      T(s, l[2] + 20, 287, l[0], { anker: "start", str: 12.5 });
    });
    T(s, cx, 314, "Eksamen H2021–H2025: 5 funksjoner, uten GOVERN", { str: 12, kursiv: true, farge: "var(--color-on-surface-variant)" });

    /* Høyre: NSMs fire kategorier, med hvilken NIST-funksjon de svarer til */
    var n = F.svg(c[1], { w: 340, h: 330, tittel: "NSMs grunnprinsipper: fire kategorier",
      desc: "1 Identifisere og kartlegge svarer til IDENTIFY. 2 Beskytte og opprettholde svarer til PROTECT. 3 Oppdage svarer til DETECT. 4 Håndtere og gjenopprette dekker både RESPOND og RECOVER. GOVERN har ingen egen kategori hos NSM." });
    T(n, 170, 16, "NSMs grunnprinsipper: 4 kategorier", { fet: true, str: 14 });
    [[["1 Identifisere og", "kartlegge"], "≈ IDENTIFY", "forebygg"], [["2 Beskytte og", "opprettholde"], "≈ PROTECT", "forebygg"],
      [["3 Oppdage"], "≈ DETECT", "oppdag"], [["4 Håndtere og", "gjenopprette"], "≈ RESPOND + RECOVER", "korriger"]].forEach(function (k, i) {
      var x = 6 + (i % 2) * 168, y = 34 + Math.floor(i / 2) * 104, tone = TONE[k[2]];
      rekt(n, x, y, 160, 92, { fyll: tone[0], strek: tone[1], sw: 1.2 });
      linjer(n, x + 80, y + 34, k[0], { str: 13.5, fet: true, farge: tone[1], lh: 18 });
      T(n, x + 80, y + 72, k[1], { str: 12, kursiv: true, farge: tone[1] });
    });
    rekt(n, 6, 250, 328, 64, { fyll: "none", strek: "var(--color-tertiary)", stiplet: true });
    linjer(n, 170, 282, ["GOVERN har ingen egen NSM-kategori.", "Kategori 4 dekker to NIST-funksjoner,", "så NSM har 4, ikke 5 eller 6."], { str: 12, lh: 17 });
  };

  /* ---------- iso-familie: 27000 i midten, bare 27001 sertifiseres ----------
     Kilde: ISO-sidene for 27000:2018 («overview of information security management systems»), 27001:2022 («defines
     requirements an ISMS must meet»), 27002:2022 (veiledning, «cannot be certified to») og 27005:2022 («guidance on
     managing information security risks»). Kurset (ism s. 8–18) sier det samme. */
  IN.FORKLAR["iso-familie"] = function (host) {
    var hh = ramme(host, "iso-familie", "ISO-sidene for " + lenke("https://committee.iso.org/standard/73906.html", "27000:2018") + ", " +
      lenke("https://committee.iso.org/standard/27001", "27001:2022") + ", " + lenke("https://committee.iso.org/standard/75652.html", "27002:2022") +
      " og " + lenke("https://committee.iso.org/standard/80585.html", "27005:2022") + " (sammendragene)");
    if (!hh) return;
    var F = IN.fig;
    var s = F.svg(hh, { w: 340, h: 320, maks: 460, tittel: "ISO/IEC 27000-familien",
      desc: "27001 øverst: krav til ISMS, den eneste som sertifiseres. 27000 i midten: begreper og oversikt, brukt av alle. Nederst 27002, tiltaksbank med 93 tiltak, og 27005, risikostyring. Begge er veiledning og støtter 27001." });
    // eiker fra 27000 til de andre
    [[170, 88], [81, 222], [259, 222]].forEach(function (q) { F.linje(s, [[170, 152], q], { stiplet: true }); });
    // 27001
    rekt(s, 70, 30, 200, 58, { fyll: TONE.forebygg[0], strek: TONE.forebygg[1], sw: 2.4 });
    linjer(s, 170, 59, ["ISO/IEC 27001", "Krav til ISMS"], { str: 14, forsteFet: true, farge: TONE.forebygg[1], lh: 19 });
    rekt(s, 196, 6, 104, 22, { fyll: TONE.forebygg[1], strek: TONE.forebygg[1], r: 11 });
    T(s, 248, 17, "✓ sertifiseres", { str: 12, fet: true, farge: TONE.forebygg[0] });
    // 27000
    rekt(s, 100, 126, 140, 52, { fyll: TONE.info[0], strek: TONE.info[1], sw: 1.2 });
    linjer(s, 170, 152, ["27000", "Begreper og oversikt"], { str: 13, forsteFet: true, farge: TONE.info[1], lh: 18 });
    // 27002 og 27005
    [[6, ["27002", "Tiltaksbank", "93 tiltak (2022)", "veiledning"]], [184, ["27005", "Risikostyring", "for informasjonssikkerhet", "veiledning"]]].forEach(function (b) {
      rekt(s, b[0], 222, 150, 76, { sw: 1.4 });
      linjer(s, b[0] + 75, 260, b[1], { str: 12.5, forsteFet: true, lh: 17 });
    });
    // piler opp til 27001
    F.pil(s, [[22, 222], [22, 59], [68, 59]]);
    F.pil(s, [[318, 222], [318, 59], [272, 59]]);
    T(s, 27, 196, "tiltak", { anker: "start", str: 12, kursiv: true });
    T(s, 313, 196, "risiko", { anker: "end", str: 12, kursiv: true });
    T(s, 170, 312, "Bare 27001 sertifiseres. Ingen er obligatorisk for alle.", { str: 12, kursiv: true, farge: "var(--color-on-surface-variant)" });
  };

  /* ---------- skadevaretre: tre spørsmål om spredning, pluss når og hva ----------
     Kilde: NIST SP 800-83r1 §2.1 (virus: «inserting copies of itself into host programs», orm: «self-replicating,
     self-contained … without user intervention», trojaner: «appearing to be benign … hidden malicious purpose», og at
     de fleste er «blended attacks») og §2.2 (bakdør, rootkit, bots som bakdørtype). Logisk bombe: NIST-ordlista
     (CNSSI 4009). Løsepengevirus: CISA. Kursets ord: dataorm, bott, løsepengevirus. */
  IN.FORKLAR["skadevaretre"] = function (host) {
    var hh = ramme(host, "skadevaretre", lenke("https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-83r1.pdf", "NIST SP 800-83r1 §2.1–2.2") +
      " · " + lenke("https://csrc.nist.gov/glossary/term/logic_bomb", "NIST-ordlista: logic bomb") + " · " +
      lenke("https://www.cisa.gov/stopransomware/ransomware-101", "CISA: Ransomware 101") + " · kursets ord");
    if (!hh) return;
    var F = IN.fig;
    var s = F.svg(hh, { w: 340, h: 470, maks: 480, tittel: "Tre spørsmål som skiller skadevaretypene",
      desc: "Del 1, hvordan sprer den seg: Sprer den seg selv over nettet uten vert og uten klikk? Ja: dataorm. Nei: fletter den koden sin inn i et annet program? Ja: virus. Nei: installerer offeret den selv fordi den ser nyttig ut? Ja: trojaner. Del 2, når slår den til: når en betingelse er oppfylt, logisk bombe. Del 3, hva gjør den: bakdør, rootkit, løsepengevirus, bott. Én fil kan ha flere av egenskapene." });
    var dempet = "var(--color-on-surface-variant)";
    T(s, 6, 12, "1 · Hvordan sprer den seg?", { anker: "start", fet: true, str: 14 });
    var sp = [[["Sprer den seg selv over nettet,", "uten vert og uten klikk?"], "Dataorm"],
      [["Fletter den koden sin inn i", "et annet program (en vert)?"], "Virus"],
      [["Installerer offeret den selv", "fordi den ser nyttig ut?"], "Trojaner"]];
    sp.forEach(function (q, i) {
      var y = 30 + i * 70;
      rekt(s, 6, y, 222, 46, { fyll: TONE.info[0], strek: TONE.info[1], sw: 1.2 });
      linjer(s, 117, y + 23, q[0], { str: 12.5, farge: TONE.info[1], lh: 17 });
      F.pil(s, [[228, y + 23], [256, y + 23]]);
      T(s, 242, y + 13, "ja", { str: 12, kursiv: true });
      rekt(s, 258, y + 6, 76, 34, { fyll: TONE.korriger[0], strek: TONE.korriger[1], sw: 2 });
      T(s, 296, y + 23, q[1], { fet: true, str: 13.5, farge: TONE.korriger[1] });
      if (i < 2) {
        F.pil(s, [[117, y + 46], [117, y + 70]]);
        T(s, 124, y + 58, "nei", { anker: "start", str: 12, kursiv: true });
      }
    });
    F.linje(s, [[117, 216], [117, 230]], { stiplet: true });
    T(s, 124, 226, "nei: se på 2 og 3", { anker: "start", str: 12, kursiv: true, farge: dempet });

    T(s, 6, 252, "2 · Når slår den til?", { anker: "start", fet: true, str: 14 });
    rekt(s, 6, 264, 328, 34, { fyll: TONE.oppdag[0], strek: TONE.oppdag[1], sw: 1.2 });
    T(s, 16, 281, "Logisk bombe: når en betingelse er oppfylt", { anker: "start", str: 12.5, farge: TONE.oppdag[1] });

    T(s, 6, 318, "3 · Hva gjør den?", { anker: "start", fet: true, str: 14 });
    [["Bakdør", "skjult vei forbi autentiseringen"], ["Rootkit", "skjuler prosesser, filer og spor"],
      ["Løsepengevirus", "krypterer data, krever betaling"], ["Bott", "botnett eller kryptoutvinning"]].forEach(function (r, i) {
      var y = 330 + i * 26;
      rekt(s, 6, y, 328, 22, { fyll: TONE.styr[0], strek: "none", r: 4 });
      T(s, 14, y + 11, r[0], { anker: "start", fet: true, str: 12.5, farge: TONE.styr[1] });
      T(s, 120, y + 11, r[1], { anker: "start", str: 12, farge: TONE.styr[1] });
    });
    linjer(s, 170, 450, ["Én fil kan svare ja på flere spørsmål: en trojaner", "kan ha med seg en bakdør og et rootkit."], { str: 12, kursiv: true, farge: dempet, lh: 16 });
  };

  /* ---------- hashkrav: enveis, svak og sterk kollisjonsresistens ----------
     Kilde: NIST SP 800-107r1 §4.1: preimage resistance («also called the one-way property»), second preimage resistance
     («given an input x … find a second input x′») og collision resistance («two different inputs x and x′»). Kurset
     (d02 s.38–45) bruker enveis, svak og sterk kollisjonsresistens. Notasjonen Hash(x) = y følger Begrep-boksen på fanen. */
  IN.FORKLAR["hashkrav"] = function (host) {
    var hh = ramme(host, "hashkrav", lenke("https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-107r1.pdf", "NIST SP 800-107r1 §4.1") +
      " (NIST: preimage, second preimage og collision resistance; kurset: enveis, svak og sterk kollisjonsresistens)");
    if (!hh) return;
    var F = IN.fig, c = F.celler(hh, 3, { kol: 3 });
    var GITT = TONE.info, FINN = TONE.oppdag;
    var NOYT = ["var(--color-surface-container-lowest)", "var(--color-on-surface)"];
    function inn(s, x, y, t, finn) {   // finn: true = må finnes, false = gitt, "lik" = samme verdi (følger av resten)
      var tone = finn === "lik" ? NOYT : finn ? FINN : GITT, st = finn === true;
      rekt(s, x, y, 64, 38, { fyll: tone[0], strek: finn === "lik" ? "var(--color-outline)" : tone[1], sw: st ? 2 : 1.4, stiplet: st });
      T(s, x + 32, y + 19, t, { kursiv: finn !== "lik", fet: true, str: finn === "lik" ? 14 : 17, farge: tone[1] });
      return { x: x + 64, y: y + 19 };
    }
    function hashBoks(s) { F.boks(s, 128, 62, 64, 40, "Hash", { rolle: "funk", str: 15 }); }
    function figur(celle, tittel, desc, oppsett, tekst) {
      var s = F.svg(celle, { w: 310, h: 186, tittel: tittel, desc: desc });
      T(s, 155, 16, tittel, { fet: true, str: 16 });
      oppsett(s);
      linjer(s, 155, 160, tekst, { str: 14, lh: 19 });
    }
    figur(c[0], "Enveis", "Gitt hashverdien y. Angriperen må finne en x med Hash(x) = y.", function (s) {
      var a = inn(s, 30, 63, "x ?", true); F.pil(s, [[a.x, a.y], [128, a.y]]); hashBoks(s);
      F.pil(s, [[192, 82], [222, 82]]); inn(s, 224, 63, "y", false);
    }, ["Gitt y: finn en x", "med Hash(x) = y."]);
    figur(c[1], "Svak kollisjonsresistens", "Gitt x. Angriperen må finne en annen x′ med samme hash som x.", function (s) {
      var a = inn(s, 30, 36, "x", false), b = inn(s, 30, 92, "x′ ?", true);
      F.pil(s, [[a.x, a.y], [110, a.y], [128, 74]]); F.pil(s, [[b.x, b.y], [110, b.y], [128, 90]]); hashBoks(s);
      F.pil(s, [[192, 82], [222, 82]]); inn(s, 224, 63, "samme", "lik");
    }, ["Gitt x: finn en annen x′", "med samme hash."]);
    figur(c[2], "Sterk kollisjonsresistens", "Ingenting er gitt. Angriperen kan velge begge inndata fritt: finn et hvilket som helst par x ≠ x′ med samme hash.", function (s) {
      var a = inn(s, 30, 36, "x ?", true), b = inn(s, 30, 92, "x′ ?", true);
      F.pil(s, [[a.x, a.y], [110, a.y], [128, 74]]); F.pil(s, [[b.x, b.y], [110, b.y], [128, 90]]); hashBoks(s);
      F.pil(s, [[192, 82], [222, 82]]); inn(s, 224, 63, "samme", "lik");
    }, ["Finn et hvilket som helst", "par x ≠ x′ med samme hash."]);
    // Felles forklaring av fargene
    var leg = hx("p", { class: "small", style: "margin:.5rem 0 0;text-align:center" }, hh);
    leg.innerHTML = '<span style="display:inline-block;width:.9em;height:.9em;vertical-align:-.1em;border-radius:2px;background:' + GITT[0] + ';border:1px solid ' + GITT[1] + '"></span> gitt · ' +
      '<span style="display:inline-block;width:.9em;height:.9em;vertical-align:-.1em;border-radius:2px;background:' + FINN[0] + ';border:1.5px dashed ' + FINN[1] + '"></span> det angriperen må finne. ' +
      "Jo mer angriperen kan velge fritt, desto lettere er angrepet: derfor er sterk kollisjonsresistens vanskeligst å oppfylle.";
  };
})();
