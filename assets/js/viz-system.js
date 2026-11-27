/* ============================================================
   IN2120 guide · viz-system.js
   Visualiseringer for blokk 5 (systemsikkerhet). Klassisk script, lastes etter core.js og stepplayer.js.

   IN.vizSystem(host)        velger modus fra data-modus på holderen (ringer|stakk|lag|oppstart|kanal|cvss)
   IN.sysRinger(host)        privilegienivåene −1, 0, (1, 2), 3: hva når en prosess? Tabell som H2023–H2025 5,
                             og «Angriper eskalerer»
   IN.sysStakk(host)         bufferoverflyt på konseptnivå: stakkrammen fylles (stegspiller), kanarifugl, NX og
                             ASLR, og virtuelt minne for to prosesser. Ingen utnyttelseskode.
   IN.sysLag(host)           lagene i tradisjonell, type 1, type 2 og container. Plasser bokser med
                             IN.bucketTask (dra.js), sjekk, og «Angrep fra gjest»
   IN.sysOppstart(host)      UEFI-sikker oppstart med PK/db/dbx, TPM-logg (målt oppstart), BitLocker og attestering
   IN.sysKanal(host)         sorter scenarioer: sidekanal, skjult kanal eller ingen. Gjett først, så båndbreddekalkulator
   IN.sysCvss(host)          CVSS-skalaen med fire bånd, flyten CVE → NVD → virksomhet, og prioritering
   IN.sysSjekk()             selvtest av tallene og fasitene, gir [{navn, ok, fikk, ventet}]
   Lagring (bare valg i modusene): in2120:viz-system:<modus> via IN.store.
   Data og fasit følger plan/innhold/05-system.md. Alle eksempler er egne.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;
  var SVGNS = "http://www.w3.org/2000/svg";

  function host$(h) { return typeof h === "string" ? IN.qs(h) : h; }
  function H(tag, cls, html) { var n = el(tag, cls ? { class: cls } : {}); if (html != null) n.innerHTML = html; return n; }
  function S(tag, attrs, text) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function btn(text, fn, cls) { return el("button", { class: "btn sm" + (cls ? " " + cls : ""), type: "button", html: text, onclick: fn }); }
  // Kontrollrad i en øving (Sjekk svar / ↺ Nullstill): samme størrelse som øvingsmotorene (ovelse.js, dra.js, core-quiz)
  function kbtn(text, fn, cls) { return el("button", { class: "btn" + (cls ? " " + cls : ""), type: "button", html: text, onclick: fn }); }
  function press(b, on) { b.setAttribute("aria-pressed", on ? "true" : "false"); }
  function skey(m) { return "in2120:viz-system:" + m; }
  function sget(m, d) { return IN.store ? IN.store.get(skey(m), d) : d; }
  function sset(m, v) { if (IN.store) IN.store.set(skey(m), v); }
  function komma(x, des) { return (des != null ? x.toFixed(des) : String(x)).replace(".", ","); }
  function nivaTekst(n) { return n < 0 ? "−" + Math.abs(n) : String(n); }
  function hex8(x) { var s = (x >>> 0).toString(16); while (s.length < 8) s = "0" + s; return "0x" + s; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function rnd32() { return Math.floor(Math.random() * 4294967296) >>> 0; }
  /* Opphavslinje for øvingene i modusene (IN.opphavEl i core.js) */
  var OPPHAV = {
    ringer: { type: "egen", variantAv: ["H2025-5", "H2024-5", "H2023-5"], kilder: ["systemlysarket s. 7–8"], merknad: "Tabellen er bygd som på eksamen, med egen Sjekk-knapp" },
    lag: { type: "egen", variantAv: ["H2022-2.4", "H2022-2.5"], kilder: ["systemlysarket s. 13–17"] },
    kanal: { type: "egen", variantAv: ["H2021-2.2"], kilder: ["systemlysarket s. 24–25"] },
    cvss: { type: "egen", kilder: ["systemlysarket s. 4–5"] }
  };
  function opphav(w, m) { var p = IN.opphavEl ? IN.opphavEl(OPPHAV[m]) : null; if (p) w.appendChild(p); }

  /* =====================================================================
     Rene funksjoner (brukes også av IN.sysSjekk)
     ===================================================================== */
  // En prosess på nivå p når nivå m hvis m >= p (eget nivå og alle med høyere tall = mindre makt).
  function kanNaa(p, m) { return m >= p; }
  function cvssKat(x) {
    x = Math.round(x * 10) / 10;
    if (x <= 0) return { id: "ingen", navn: "Ingen kategori på systemlysarket" };
    if (x < 4) return { id: "lav", navn: "Lav" };
    if (x < 7) return { id: "middels", navn: "Middels" };
    if (x < 9) return { id: "hoy", navn: "Høy" };
    return { id: "kritisk", navn: "Kritisk" };
  }
  function kanalTid(bitPerSek, bits) { return bitPerSek > 0 ? bits / bitPerSek : Infinity; }
  function varighet(sek) {
    if (!isFinite(sek)) return "aldri (0 bit/s)";
    if (sek < 120) return komma(Math.round(sek * 10) / 10) + " sekunder";
    if (sek < 7200) return komma(Math.round(sek / 6) / 10) + " minutter";
    if (sek < 172800) return komma(Math.round(sek / 360) / 10) + " timer";
    return komma(Math.round(sek / 8640) / 10) + " døgn";
  }

  /* =====================================================================
     1 · Privilegienivåer (ringer)
     ===================================================================== */
  var RINGER = [
    { n: 3, navn: "Applikasjoner (brukermodus)", r: 158 },
    { n: 2, navn: "som regel ubrukt", r: 128, ubrukt: true },
    { n: 1, navn: "som regel ubrukt", r: 102, ubrukt: true },
    { n: 0, navn: "OS-kjerne (kjernemodus)", r: 74 },
    { n: -1, navn: "Hypervisor", r: 42 }
  ];
  var MODI = [
    { id: "hyp", n: -1, navn: "Prosess i hypervisormodus" },
    { id: "kjerne", n: 0, navn: "… i kjernemodus" },
    { id: "bruker", n: 3, navn: "… i brukermodus" }
  ];
  var TABNIV = [-1, 0, 3];

  function lock(g, x, y) {
    var l = S("g", { class: "sys-lock", transform: "translate(" + (x - 5) + "," + (y - 7) + ")" });
    l.appendChild(S("path", { d: "M2 6 V4 a3 3 0 0 1 6 0 V6", fill: "none", "stroke-width": "1.6" }));
    l.appendChild(S("rect", { x: 0, y: 6, width: 10, height: 8, rx: 1.5 }));
    g.appendChild(l);
  }

  IN.sysRinger = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "sys-viz" });
    opphav(w, "ringer");
    var modus = null, ovFirst = true, sjekket = false, angriper = null;
    var svar = {};   // nivå → "kan" | "ikke"

    var bRow = el("div", { class: "sys-row", role: "group", "aria-label": "Velg prosessens modus" });
    var mBtn = {};
    MODI.forEach(function (m) {
      var b = btn(m.navn, function () { velg(m.id); });
      press(b, false); mBtn[m.id] = b; bRow.appendChild(b);
    });
    w.appendChild(bRow);

    var ovLbl = el("label", { class: "sys-lbl" });
    var ovCb = el("input", { type: "checkbox" });
    ovCb.checked = true;   // øvemodus fra start: fargene viser ikke fasiten før tabellen er fylt ut
    ovCb.addEventListener("change", function () { ovFirst = ovCb.checked; sjekket = false; paint(); });
    ovLbl.appendChild(ovCb); ovLbl.appendChild(document.createTextNode(" Øv først: skjul fargene til jeg trykker «Sjekk svar»"));
    w.appendChild(ovLbl);

    var lay = el("div", { class: "sys-lay" });
    var svgBox = el("div", { class: "sys-svg sys-ringsvg" });
    var side = el("div", { class: "sys-side" });
    lay.appendChild(svgBox); lay.appendChild(side);
    w.appendChild(lay);

    var tab = el("table", { class: "sys-tab" });
    var tbody = el("tbody");
    tab.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "Nivå" }), el("th", { text: "Kan få tilgang" }), el("th", { text: "Kan IKKE få tilgang" })])]));
    tab.appendChild(tbody);
    var ctl = el("div", { class: "sys-row" }, [
      kbtn("Sjekk svar", function () { sjekket = true; paint(); }, "primary"),
      kbtn("Angriper eskalerer", eskaler),
      kbtn("↺ Nullstill", function () { modus = null; angriper = null; svar = {}; sjekket = false; paint(); })
    ]);
    var out = el("div", { class: "sys-out", "aria-live": "polite" });
    side.appendChild(el("div", { class: "table-wrap" }, [tab]));
    side.appendChild(ctl);
    side.appendChild(out);
    host.appendChild(w);

    function cur() { return MODI.filter(function (m) { return m.id === modus; })[0] || null; }
    function velg(id) { modus = id; svar = {}; sjekket = false; if (angriper != null && id !== "bruker" && id !== "kjerne") angriper = null; paint(); sset("ringer", id); }

    function eskaler() {
      if (angriper === null) {
        angriper = 3; modus = "bruker"; svar = {}; sjekket = false; paint();
        out.className = "sys-out nei";
        out.innerHTML = "<p class=\"sys-modusbytte\"><b>Modus byttet til brukermodus (nivå 3).</b> Ringene viser nå svaret, også i øvemodus.</p><p>Skadevare i nettleseren kjører på <b>nivå 3</b>. Den når bare sitt eget nivå. Trykk igjen for å la den utnytte en feil i en driver i kjernen.</p>";
      } else if (angriper === 3) {
        angriper = 0; modus = "kjerne"; svar = {}; sjekket = false; paint();
        out.className = "sys-out nei";
        out.innerHTML = "<p class=\"sys-modusbytte\"><b>Modus byttet til kjernemodus (nivå 0).</b></p><p>Privilegieeskalering: en exploit flytter angriperen fra nivå 3 til <b>nivå 0</b>. Nå når den nivå 0, 1, 2 og 3 i denne maskinen, men fortsatt ikke hypervisoren på −1. Det ville krevd en ny feil (en «VM-flukt», ordet står ikke på systemlysarket).</p>";
      } else {
        out.className = "sys-out";
        out.innerHTML = "<p>Angriperens mål er nivå 0 eller −1 (systemlysarket s. 8). Her stopper den på 0. Trykk «↺ Nullstill» for å starte på nytt.</p>";
      }
    }

    function paint() {
      var m = cur();
      for (var id in mBtn) press(mBtn[id], id === modus);
      var vis = m && (!ovFirst || sjekket || angriper != null);
      // SVG
      clear(svgBox);
      var svg = S("svg", { viewBox: "0 0 340 340", class: "viz-svg", role: "img",
        "aria-label": "Privilegieringer fra −1 innerst til 3 ytterst" + (m ? ". Valgt: " + m.navn : "") });
      var cx = 170, cy = 170;
      RINGER.forEach(function (rg) {
        var st = "";
        if (vis) st = rg.n === m.n ? " eget" : kanNaa(m.n, rg.n) ? " ok" : " nei";
        svg.appendChild(S("circle", { cx: cx, cy: cy, r: rg.r, class: "sys-ring sys-ring-" + (rg.n < 0 ? "m1" : rg.n) + (rg.ubrukt ? " ubrukt" : "") + st }));
      });
      RINGER.forEach(function (rg, i) {
        var inner = RINGER[i + 1] ? RINGER[i + 1].r : 0;
        var mid = rg.n === -1 ? 0 : (rg.r + inner) / 2;
        var y = cy - mid + (rg.n === -1 ? -4 : 4);
        svg.appendChild(S("text", { x: cx, y: y, "text-anchor": "middle", class: "sys-ring-n" }, nivaTekst(rg.n)));
        if (rg.n === 3 || rg.n === 0 || rg.n === -1) {
          svg.appendChild(S("text", { x: cx, y: y + 12, "text-anchor": "middle", class: "sys-ring-l" }, rg.n === -1 ? "Hypervisor" : rg.n === 0 ? "OS-kjerne" : "Applikasjoner"));
        }
        if (vis && !kanNaa(m.n, rg.n)) lock(svg, cx - mid - (rg.n === -1 ? 0 : 0), cy + (rg.n === -1 ? 18 : 0));
      });
      if (angriper != null) {
        var ar = RINGER.filter(function (rg) { return rg.n === angriper; })[0];
        var inner2 = angriper === 3 ? 128 : 42;
        var yy = cy + (ar.r + inner2) / 2;
        svg.appendChild(S("circle", { cx: cx, cy: yy, r: 7, class: "sys-angriper" }));
        svg.appendChild(S("text", { x: cx + 12, y: yy + 4, class: "sys-angriper-l" }, "angriper"));
      }
      svgBox.appendChild(svg);

      // Tabell
      clear(tbody);
      TABNIV.forEach(function (n) {
        var tr = el("tr");
        var fasit = m ? (kanNaa(m.n, n) ? "kan" : "ikke") : null;
        tr.appendChild(el("th", { text: "Nivå " + nivaTekst(n) }));
        ["kan", "ikke"].forEach(function (v) {
          var td = el("td");
          var inp = el("input", { type: "radio", name: "sys-r-" + n + "-" + (host.id || "x"), "aria-label": "Nivå " + nivaTekst(n) + ": " + (v === "kan" ? "kan" : "kan ikke") });
          inp.checked = svar[n] === v;
          inp.disabled = !m;
          inp.addEventListener("change", function () { svar[n] = v; sjekket = false; paintOut(); });
          td.appendChild(inp);
          if (sjekket && m && svar[n] === v) td.className = v === fasit ? "ok" : "nei";
          if (sjekket && m && svar[n] == null && v === fasit) td.className = "fasit";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      paintOut();
    }
    function paintOut() {
      var m = cur();
      if (angriper != null && !sjekket) return;
      if (!m) { out.className = "sys-out"; out.innerHTML = "<p>Velg en modus over. Fyll gjerne ut tabellen før du sjekker.</p>"; return; }
      if (!sjekket) {
        out.className = "sys-out";
        out.innerHTML = "<p>" + m.navn.replace("…", "Prosess") + " kjører på nivå <b>" + nivaTekst(m.n) + "</b>." +
          (ovFirst ? " Fargene er skjult i øvemodus. Fyll ut tabellen og trykk «Sjekk svar»." : " Grønt = når, tykk kant = eget nivå, rødt med lås = når ikke.") + "</p>";
        return;
      }
      var riktig = 0, feil = 0, blank = 0;
      TABNIV.forEach(function (n) {
        var f = kanNaa(m.n, n) ? "kan" : "ikke";
        if (svar[n] == null) blank++; else if (svar[n] === f) riktig++; else feil++;
      });
      out.className = "sys-out " + (feil || blank ? "nei" : "ok");
      out.innerHTML = "<p><b>" + riktig + " av 3 riktig</b>" + (feil ? ", " + feil + " feil" : "") + (blank ? ", " + blank + " ubesvart" : "") + "</p>" +
        "<p><b>Regelen:</b> en prosess når sitt eget nivå og alle nivåer med <i>høyere</i> tall (mindre makt), aldri et nivå med lavere tall (systemlysarket s. 8).</p>" +
        (blank ? "<p class=\"sys-note\">Husk: i H2024 5 ga ubesvart −1. La aldri en rad stå tom.</p>" : "");
    }

    var lagret = sget("ringer", null);
    modus = MODI.some(function (m) { return m.id === lagret; }) ? lagret : null;
    paint();
  };

  /* =====================================================================
     2 · Stakk og bufferoverflyt (konseptnivå)
     ===================================================================== */
  var STAKK_BASE = 0xbffff6e0;   // adressen til navn[0] uten ASLR (egen leketøysverdi)
  var RET_A = 0x080491a6;        // returadresse tilbake til A() (egen leketøysverdi)

  function stakkFelt(kanari) {
    // Fra lav til høy adresse, 4 byte per felt.
    var f = [
      { id: "b0", navn: "navn[0..3]", type: "buf" },
      { id: "b1", navn: "navn[4..7]", type: "buf" }
    ];
    if (kanari) f.push({ id: "kan", navn: "kanarifugl", type: "kan" });
    f.push({ id: "rfp", navn: "forrige rammepeker", type: "rfp" });
    f.push({ id: "ret", navn: "returadresse", type: "ret" });
    return f;
  }

  var UTFALL_VALG = [
    ["kanari", "Kanarifuglen er endret, og programmet avsluttes før returadressen brukes"],
    ["krasj", "Feil oppførsel eller krasj, men angriperen styrer ikke hoppet"],
    ["aslr", "Hoppet treffer feil minne fordi stakken er flyttet (ASLR)"],
    ["nx", "CPU-en nekter å kjøre kode på stakken (NX)"],
    ["kapret", "Programmet fortsetter i angriperens kode"]
  ];

  IN.sysStakk = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "sys-viz" });
    var vern = { kanari: true, nx: false, aslr: false };
    try { var lv = JSON.parse(sget("stakk", "null")); if (lv) { vern.kanari = !!lv.kanari; vern.nx = !!lv.nx; vern.aslr = !!lv.aslr; } } catch (e) {}
    var kjoring = { base: STAKK_BASE, kanariVerdi: 0x5be0c41d };
    var curInput = null, player = null;

    w.appendChild(H("p", "sys-note", "Funksjonen <span class=\"sys-mono\">les_navn()</span> i «Bibliotekkiosk» kopierer input inn i <span class=\"sys-mono\">navn[8]</span> uten å sjekke lengden. Velg et eksempel eller skriv egen input (høyst 24 tegn), og gå steg for steg. Slå tiltakene av og på."));
    var vRow = el("div", { class: "sys-row", role: "group", "aria-label": "Mottiltak" });
    var vBtn = {};
    // Tilstanden står i knappeteksten («på»/«av»), ikke bare i fargen (aria-pressed).
    function vernTekst(id, navn) { return navn + ": " + (vern[id] ? "på" : "av"); }
    [["kanari", "Kanarifugl"], ["nx", "NX"], ["aslr", "ASLR"]].forEach(function (p) {
      var b = btn(vernTekst(p[0], p[1]), function () {
        vern[p[0]] = !vern[p[0]]; press(b, vern[p[0]]); b.textContent = vernTekst(p[0], p[1]);
        sset("stakk", JSON.stringify(vern)); nyKjoring(true);
      });
      press(b, vern[p[0]]); vBtn[p[0]] = b; vRow.appendChild(b);
    });
    vRow.appendChild(btn("↻ Kjør programmet på nytt", function () { nyKjoring(true); }));
    w.appendChild(vRow);
    var vStatus = el("p", { class: "sys-note sys-vernstatus", "aria-live": "polite" });
    w.appendChild(vStatus);
    var sp = el("div", { class: "sys-sp" });
    w.appendChild(sp);

    function vernStatusTekst() {
      return "kanarifugl " + (vern.kanari ? "på" : "av") + ", NX " + (vern.nx ? "på" : "av") + " og ASLR " + (vern.aslr ? "på" : "av");
    }
    function nyKjoring(melding) {
      kjoring.kanariVerdi = rnd32();
      kjoring.base = vern.aslr ? ((0xbf000000 + Math.floor(Math.random() * 0x00f00000)) & 0xfffffff0) >>> 0 : STAKK_BASE;
      if (player && curInput) player.setInput(curInput);
      vStatus.innerHTML = (melding ? "<b>Programmet startet på nytt</b> med " : "Programmet kjører med ") + vernStatusTekst() +
        ". Ny kanariverdi: <span class=\"sys-mono\">" + hex8(kjoring.kanariVerdi) + "</span>" +
        (vern.aslr ? ", stakken på <span class=\"sys-mono\">" + hex8(kjoring.base) + "</span>." : ".") +
        (melding ? " Avspillingen begynner fra første steg." : "");
      if (melding) { vStatus.classList.remove("endret"); void vStatus.offsetWidth; vStatus.classList.add("endret"); }
    }

    function generate(input) {
      curInput = input.slice();
      var tegn = input.slice(0, 24), n = tegn.length;
      var felt = stakkFelt(vern.kanari), cap = felt.length * 4;
      var steps = [];
      var fylt = {};   // id → tekst som er skrevet dit
      function snap(extra) {
        var s = { felt: felt, fylt: JSON.parse(JSON.stringify(fylt)), vern: { kanari: vern.kanari, nx: vern.nx, aslr: vern.aslr }, base: kjoring.base, kanariVerdi: kjoring.kanariVerdi, n: n };
        for (var k in extra) s[k] = extra[k];
        return s;
      }
      steps.push(snap({ tag: "Kall", text: {
        eli5: "B() får en ny side i notatblokka (stakken). Øverst på siden står hvor programmet skal fortsette etterpå.",
        normal: "B() kalles. Rammen legges på stakken: returadressen (hvor programmet skal fortsette i A()), forrige rammepeker" + (vern.kanari ? ", kanarifuglen" : "") + " og bufferet <span class=\"sys-mono\">navn[8]</span>.",
        teknisk: "Stakken vokser mot lavere adresser når nye rammer legges på, men bufferet fylles mot <i>høyere</i> adresser. Derfor ligger returadressen «over» bufferet, i skriveretningen." +
          (vern.kanari ? " Kanarifuglen er en tilfeldig verdi som velges ved programstart." : "") } }));
      var skrevet = 0;
      for (var i = 0; i < felt.length && skrevet < n; i++) {
        var f = felt[i], bit = tegn.slice(skrevet, skrevet + 4).join("");
        skrevet += Math.min(4, n - (i * 4));
        fylt[f.id] = bit;
        var over = f.type !== "buf";
        var t;
        if (!over) t = { eli5: "Bokstavene får plass i navneruta.", normal: "Byte " + (i * 4) + "–" + (i * 4 + 3) + " havner i " + f.navn + ". Det er innenfor bufferet.", teknisk: "Ingen overflyt ennå: " + Math.min(n, (i + 1) * 4) + " av 8 byte i bufferet er brukt." };
        else if (f.type === "kan") t = { eli5: "Navnet er for langt. Det skriver over den lille lappen (kanarifuglen).", normal: "<b>Overflyt:</b> byte " + (i * 4) + "–" + (i * 4 + 3) + " skriver over kanarifuglen. Ingen merker det ennå.", teknisk: "Kanarifuglen oppdager ingenting i det den overskrives. Sjekken skjer først ved retur (systemlysarket s. 11)." };
        else if (f.type === "rfp") t = { eli5: "Navnet renner videre over i neste felt.", normal: "<b>Overflyt:</b> forrige rammepeker overskrives. Den ligger bare i veien. Det er returadressen angriperen er ute etter.", teknisk: "Rammepekeren er ikke målet (H2022 2.3). En ødelagt rammepeker gir som regel feil eller krasj senere." };
        else t = { eli5: "Nå er adressen der programmet skal fortsette, skrevet over.", normal: "<b>Returadressen overskrives.</b> Når B() er ferdig, hopper programmet til den adressen som nå står der, i stedet for tilbake til A().", teknisk: "Dette er det kritiske feltet (H2022 2.3). Den som styrer innholdet, styrer hvor programmet fortsetter." };
        var st = snap({ tag: over ? "Overflyt" : "Kopier", skriver: f.id, text: t });
        if (i === 2) st.spor = {
          sporsmal: { eli5: "Navneruta er full, men det kommer flere bokstaver. Hvilket felt blir skrevet over først?", normal: "Bufferet på 8 byte er fullt, og inputen fortsetter. Hvilket felt overskrives først?", teknisk: "Byte 8–11 skrives til neste adresse over bufferet. Hvilket felt ligger der i denne rammen?" },
          valg: ["Kanarifuglen", "Forrige rammepeker", "Returadressen"],
          fasit: vern.kanari ? 0 : 1,
          forklaring: vern.kanari
            ? "Kanarifuglen ligger rett over bufferet, mellom lokale variabler og returadressen. En sammenhengende overflyt må derfor gjennom den først."
            : "Uten kanarifugl ligger forrige rammepeker rett over bufferet, og returadressen like over den."
        };
        steps.push(st);
      }
      if (n > cap) steps[steps.length - 1].text.normal += " Resten av inputen renner videre opp i A()-rammen.";
      var slutt = snap(utfall(felt, fylt, n));
      if (n > 8) slutt.spor = {
        sporsmal: { eli5: "B() er ferdig og skal gå tilbake. Hva skjer nå, med tiltakene som er slått på?", normal: "B() returnerer. Hva skjer med tiltakene som er på (" + vernListe() + ")?", teknisk: "Funksjonsepilogen kjører. Hvilket utfall gir denne kombinasjonen av overskrevne felt og tiltak (" + vernListe() + ")?" },
        valg: UTFALL_VALG.map(function (u) { return u[1]; }),
        fasit: UTFALL_VALG.map(function (u) { return u[0]; }).indexOf(slutt.res),
        forklaring: "Rekkefølgen teller: kanarifuglen sjekkes før returadressen brukes, så den stopper først. Er returadressen ikke rørt, styrer ikke angriperen hoppet. ASLR gjør den hardkodede adressen feil, og NX nekter kjøring på stakken."
      };
      steps.push(slutt);
      return steps;
    }

    function vernListe() {
      var p = [];
      if (vern.kanari) p.push("kanarifugl"); if (vern.nx) p.push("NX"); if (vern.aslr) p.push("ASLR");
      return p.length ? p.join(", ") : "ingen";
    }

    function utfall(felt, fylt, n) {
      var kanariRort = vern.kanari && fylt.kan != null, retRort = fylt.ret != null, rfpRort = fylt.rfp != null;
      if (n <= 8) return { tag: "Retur", res: "ok", text: { eli5: "Alt fikk plass. Programmet fortsetter som vanlig.", normal: "B() returnerer til A() som normalt. Ingen overflyt: inputen var " + n + " byte, og bufferet har plass til 8.", teknisk: "Feilen (manglende lengdesjekk) finnes likevel i koden. Den viser seg bare ved lang nok input." } };
      if (kanariRort) return { tag: "Retur", res: "kanari", text: { eli5: "Lappen er ødelagt. Postmannen nekter å sende pakken, og programmet stopper.", normal: "<b>Kanarifugl endret – programmet avsluttes.</b> Sjekken før retur ser at verdien er endret, og programmet avsluttes før den falske returadressen brukes. Tilgjengeligheten rammes, men angriperen får ikke kontroll.", teknisk: "For å komme forbi må angriperen skrive tilbake nøyaktig riktig kanariverdi (2³² muligheter for 32 bit). Kanarifuglen <i>oppdager</i> overskrivingen. Den hindrer ikke at den skjer." } };
      if (!retRort) return { tag: "Retur", res: "krasj", text: { eli5: "Noe er ødelagt, men ikke adressen. Programmet blir forvirret og krasjer trolig.", normal: "Bare rammepekeren er ødelagt" + (rfpRort ? "" : "") + ". Programmet oppfører seg feil eller krasjer, men angriperen styrer ikke hoppet her.", teknisk: "Det viser hvorfor returadressen er målet: å treffe bare rammepekeren gir uforutsigbar oppførsel, ikke kontroll." } };
      if (vern.aslr) return { tag: "Retur", res: "aslr", text: { eli5: "Tyven skrev en adresse han hadde lært utenat, men huset er flyttet. Pakken havner i et tomt rom.", normal: "Returadressen er overskrevet med angriperens hardkodede adresse " + hex8(STAKK_BASE) + ", men med <b>ASLR</b> ligger stakken på " + hex8(kjoring.base) + " denne gangen. Hoppet går til tomt eller feil minne, og programmet krasjer.", teknisk: "ASLR stokker adressene til stakk, heap og biblioteker for hver kjøring. Angriperen må gjette. Feilen er fortsatt der, så et krasj (tjenestenekt) er mulig." } };
      if (vern.nx) return { tag: "Retur", res: "nx", text: { eli5: "Adressen peker til navneruta, men det er forbudt å sende pakker derfra.", normal: "Programmet hopper til bufferet på stakken, men stakken er merket <b>ikke-kjørbar (NX)</b>. CPU-en nekter å kjøre kode der, og programmet stoppes.", teknisk: "NX stopper kode som ligger <i>på stakken</i>. Den stopper ikke at angriperen hopper til kode som allerede finnes, for eksempel i et bibliotek (return-to-libc/ROP, ikke pensum). Derfor kombineres NX med ASLR." } };
      return { tag: "Retur", res: "kapret", text: { eli5: "Pakken sendes dit tyven skrev. Han bestemmer hva som skjer nå.", normal: "<b>Ingen tiltak stoppet det:</b> programmet fortsetter på adressen angriperen skrev inn, der angriperens data ligger. Angriperen har tatt over prosessen med prosessens rettigheter.", teknisk: "Kjører prosessen som root eller i kjernen, får angriperen de privilegiene (fane 1). Den egentlige rettingen er lengdesjekk, for eksempel <span class=\"sys-mono\">fgets(navn, sizeof navn, stdin)</span>, eller et språk med grensesjekk." } };
    }

    function render(st, ctx) {
      var stage = ctx.stage;
      clear(stage);
      if (!st.felt) return;
      var box = el("div", { class: "sys-stakk" });
      var col = el("div", { class: "sys-stakk-col" });
      col.appendChild(H("div", "sys-adr-h", "Høy adresse"));
      col.appendChild(H("div", "sys-fr sys-fr-ytre", "<b>main()</b>-ramme"));
      col.appendChild(H("div", "sys-fr sys-fr-ytre", "<b>A()</b>-ramme" + (st.n > st.felt.length * 4 ? " <span class=\"sys-varsel\">(også overskrevet)</span>" : "")));
      col.appendChild(H("div", "sys-fr-h", "<b>B()</b>-ramme"));
      st.felt.slice().reverse().forEach(function (f) {
        var idx = st.felt.indexOf(f);
        var adr = hex8(st.base + idx * 4);
        var verdi;
        if (st.fylt[f.id] != null) verdi = "«" + esc(st.fylt[f.id]) + "»";
        else if (f.type === "kan") verdi = hex8(st.kanariVerdi);
        else if (f.type === "ret") verdi = hex8(RET_A) + " (tilbake til A())";
        else if (f.type === "rfp") verdi = "peker til A()-rammen";
        else verdi = "";
        var cls = "sys-fr sys-fr-" + f.type + (st.fylt[f.id] != null ? (f.type === "buf" ? " fylt" : " over") : "") + (st.skriver === f.id ? " aktiv" : "");
        // Tillegget står på egen linje og er reservert i alle steg, så raden ikke blir høyere når det kommer.
        if (f.type === "ret") verdi += "<span class=\"sys-fr-til" + (st.fylt.ret != null ? "" : " sp-skjult") + "\">→ angriperens adresse " + hex8(STAKK_BASE) + "</span>";
        var r = el("div", { class: cls });
        r.appendChild(H("span", "sys-fr-adr sys-mono", adr));
        r.appendChild(H("span", "sys-fr-n", f.navn));
        r.appendChild(H("span", "sys-fr-v sys-mono", verdi));
        col.appendChild(r);
      });
      col.appendChild(H("div", "sys-adr-h", "Lav adresse · bufferet fylles oppover ↑"));
      box.appendChild(col);
      var res = el("div", { class: "sys-stakk-res" });
      res.appendChild(H("div", "sys-k", "Tiltak"));
      res.appendChild(H("div", "sys-chip" + (st.vern.kanari ? " pa" : ""), "Kanarifugl " + (st.vern.kanari ? "på" : "av")));
      res.appendChild(H("div", "sys-chip" + (st.vern.nx ? " pa" : ""), "NX " + (st.vern.nx ? "på (stakken ikke-kjørbar)" : "av")));
      res.appendChild(H("div", "sys-chip" + (st.vern.aslr ? " pa" : ""), "ASLR " + (st.vern.aslr ? "på (stakken på " + hex8(st.base) + ")" : "av (stakken alltid på " + hex8(STAKK_BASE) + ")")));
      {
        var TXT = { ok: ["ok", "Normal retur til A()"], kanari: ["stopp", "Kanarifugl endret – programmet avsluttes"], krasj: ["stopp", "Feil oppførsel eller krasj"],
          aslr: ["stopp", "ASLR: hoppet treffer feil minne"], nx: ["stopp", "NX: stakken er ikke-kjørbar"], kapret: ["nei", "Programmet fortsetter i angriperens kode"] };
        // Resultatet har plass fra første steg («Retur: ?»), så knappene og tiltakene ikke flytter seg.
        var t = st.res ? TXT[st.res] : ["venter", "Retur: ?"];
        res.appendChild(H("div", "sys-res sys-res-" + t[0], "<b>" + t[1] + "</b>"));
      }
      box.appendChild(res);
      stage.appendChild(box);
    }

    player = IN.stepPlayer(sp, {
      presets: {
        "8 tegn (får plass)": "Kari2026".split(""),
        "12 tegn": "AAAAAAAAAAAA".split(""),
        "20 tegn": "AAAAAAAAAAAAAAAAAAAA".split("")
      },
      inputLabel: "skriv et navn, f.eks. Ingrid",
      inputAria: "Egen input til navn-bufferet",
      parseInput: function (s) { return String(s).split("").slice(0, 24); },
      generate: generate,
      render: render,
      speed: 1200, navTopp: true, fastHoyde: true
    });
    nyKjoring();

    // Virtuelt minne
    w.appendChild(H("h5", "sys-h", "Virtuelt minne: isolasjon mellom prosesser, ikke inne i dem"));
    var vm = el("div", { class: "sys-vm" });
    [["Nettleseren", "0x1F3000"], ["Passordbanken", "0x7A2000"]].forEach(function (p) {
      var c = el("div", { class: "sys-vm-col" });
      c.appendChild(H("div", "sys-k", p[0]));
      c.appendChild(H("div", "sys-vm-r", "virtuell adresse <span class=\"sys-mono\">0x0804A000</span>"));
      c.appendChild(H("div", "sys-vm-pil", "↓ CPU-en oversetter"));
      c.appendChild(H("div", "sys-vm-r sys-vm-fys", "fysisk ramme <span class=\"sys-mono\">" + p[1] + "</span>"));
      vm.appendChild(c);
    });
    w.appendChild(vm);
    w.appendChild(H("p", "sys-note", "Samme virtuelle adresse i to prosesser peker til to ulike fysiske steder, så nettleseren kan ikke lese minnet til passordbanken (systemlysarket s. 9). En bufferoverflyt skjer derimot <i>inne i én prosess</i>, i dens eget minne. Virtuelt minne hjelper ikke mot den (H2022 2.2)."));
    var kart = el("div", { class: "sys-kart" });
    kart.appendChild(H("div", "sys-k", "Minnekartet til én 32-bits prosess (4 GB virtuelt), fra høy til lav adresse"));
    [["Stakk", "lese/skrive", "rw"], ["Ledig minne", "", "fri"], ["Felles biblioteker", "lese/kjøre", "rx"], ["Ledig minne", "", "fri"], ["Data og heap", "lese/skrive", "rw"], ["Kodesegment", "lese/kjøre", "rx"]].forEach(function (r) {
      kart.appendChild(H("div", "sys-kart-r sys-kart-" + r[2], "<span>" + r[0] + "</span><span class=\"sys-note\">" + r[1] + "</span>"));
    });
    w.appendChild(kart);
    host.appendChild(w);
  };

  /* =====================================================================
     3 · Lag: tradisjonell, type 1, type 2, container
     ===================================================================== */
  var LAG = {
    trad: { navn: "Tradisjonell", lag: ["App", "OS", "Maskinvare"], niv: ["3", "0", ""], kilde: "systemlysarket s. 13" },
    type1: { navn: "Type 1", lag: ["App", "Gjeste-OS", "Hypervisor", "Maskinvare"], niv: ["3", "0", "−1", ""], kilde: "systemlysarket s. 14, H2022 2.4" },
    type2: { navn: "Type 2", lag: ["App", "Gjeste-OS", "Hypervisor", "Verts-OS", "Maskinvare"], niv: ["3", "3", "3", "0", ""], kilde: "systemlysarket s. 15, X16 28" },
    cont: { navn: "Container", lag: ["Container", "Docker Engine", "Verts-OS", "Maskinvare"], niv: ["–", "–", "0", ""], kilde: "systemlysarket s. 16–17, H2022 2.5" }
  };
  var LAG_BANK = ["App", "Gjeste-OS", "Hypervisor", "OS", "Verts-OS", "Docker Engine", "Container", "Binaries/biblioteker", "Maskinvare"];

  // Fasit for én arkitektur som dra.js-oppgave: hver boks i banken hører til ett lag eller til «Brukes ikke her».
  function lagSpec(fane) {
    var L = LAG[fane], n = L.lag.length;
    var zones = L.lag.map(function (x, i) {
      return { id: "l" + i, label: "Lag " + (i + 1) + (i === 0 ? " · topp" : i === n - 1 ? " · bunn" : "") };
    });
    zones.push({ id: "ubrukt", label: "Brukes ikke her" });
    var answer = {}, items = LAG_BANK.map(function (navn, k) {
      var i = L.lag.indexOf(navn), id = "b" + k;
      answer[id] = i >= 0 ? "l" + i : "ubrukt";
      return { id: id, html: esc(navn), forklaring: i >= 0
        ? "Lag " + (i + 1) + " fra toppen" + (L.niv[i] ? ", nivå " + L.niv[i] : "") + "."
        : "Ikke et eget lag i stabelen for " + L.navn.toLowerCase() + "." };
    });
    var niv = L.lag.map(function (x, i) { return L.niv[i] && L.niv[i] !== "–" ? x + " " + L.niv[i] : null; }).filter(Boolean).join(" · ");
    return { items: items, zones: zones, answer: answer, poolLabel: "Banken",
      oppsummering: "<p>" + forklarLag(fane) + "</p><p class=\"sys-note\">Nivåtall: " + esc(niv) + " (" + L.kilde + ").</p>" };
  }

  IN.sysLag = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "sys-viz" });
    var fane = sget("lag", "type1"); if (!LAG[fane]) fane = "type1";
    var angrep = false, task = null;
    // «Angrep fra gjest» er en av/på-bryter: teksten sier tilstanden, og den slås av ved bytte av arkitektur.
    var aBtn = btn("Angrep fra gjest: av", function () { angrep = !angrep; paintSide(); });
    press(aBtn, false);

    var tRow = el("div", { class: "sys-row", role: "group", "aria-label": "Velg arkitektur" });
    var tBtn = {};
    Object.keys(LAG).forEach(function (k) {
      var b = btn(LAG[k].navn, function () { fane = k; angrep = false; sset("lag", k); bygg(); paintSide(); });
      tBtn[k] = b; tRow.appendChild(b);
    });
    w.appendChild(tRow);
    w.appendChild(H("p", "sys-note", "Ikke alle boksene skal brukes. Legg dem du ikke trenger, i «Brukes ikke her»."));
    var lay = el("div", { class: "sys-lay" });
    var taskHost = el("div", { class: "sys-lagdra" });
    var side = el("div", { class: "sys-side" });
    lay.appendChild(taskHost); lay.appendChild(side);
    w.appendChild(lay);
    w.appendChild(el("div", { class: "sys-row" }, [
      btn("Vis fasit", function () {
        if (!task) return;
        var sp = lagSpec(fane);
        sp.items.forEach(function (it) { task.place(it.id, sp.answer[it.id]); });
        task.check();
      }),
      aBtn
    ]));
    var out = el("div", { class: "sys-out", "aria-live": "polite" });
    w.appendChild(out);
    host.appendChild(w);

    function bygg() {
      for (var k in tBtn) press(tBtn[k], k === fane);
      if (!IN.bucketTask) { clear(taskHost); taskHost.appendChild(H("p", "sys-note", "Øvingen trenger dra.js.")); task = null; return; }
      var sp = lagSpec(fane);
      sp.prompt = "<b>" + LAG[fane].navn + "</b>: legg boksene i stabelen fra toppen og ned.";
      sp.opphav = OPPHAV.lag;
      task = IN.bucketTask(taskHost, sp, { instant: false, checkLabel: "Sjekk svar", cls: "sys-lagoppg" });
    }
    function paintSide() {
      press(aBtn, angrep); aBtn.textContent = "Angrep fra gjest: " + (angrep ? "på" : "av");
      clear(side);
      side.appendChild(H("div", "sys-k", "Sikkerhetsmål for virtualisering (systemlysarket s. 19)"));
      if (!angrep) side.appendChild(H("p", "sys-note sys-plass", "Slå på «Angrep fra gjest» under figuren for å se om hvert mål holder for " + LAG[fane].navn.toLowerCase() + "."));
      var maal = maalStatus(fane, angrep);
      ["Gjestene kan ikke nå eller påvirke hverandre", "Gjestene kan ikke påvirke hypervisoren", "Gjestene kan ikke oppdage at de er virtualisert"].forEach(function (t, i) {
        side.appendChild(H("div", "sys-maal " + maal[i][0], "<b>" + (i + 1) + ".</b> " + t + (maal[i][1] ? "<br><span class=\"sys-note\">" + maal[i][1] + "</span>" : "")));
      });
      if (angrep) {
        side.appendChild(angrepFig(fane));
        out.className = "sys-out " + (fane === "cont" ? "nei" : "ok");
        out.innerHTML = "<p>" + angrepTekst(fane) + "</p>";
      } else { out.className = "sys-out"; out.innerHTML = ""; }
    }
    bygg(); paintSide();
    return { task: function () { return task; }, fane: function () { return fane; } };
  };

  function forklarLag(f) {
    return {
      trad: "Uten virtualisering: OS-et på nivå 0 rett på maskinvaren, appene på nivå 3.",
      type1: "Hypervisoren kjører rett på maskinvaren på −1. Gjeste-OS-ene kjører på 0, slik de er laget for. Det finnes ikke noe verts-OS.",
      type2: "Verts-OS-et ligger rett over maskinvaren på nivå 0. Hypervisoren er et vanlig program på verts-OS-et. Figuren på systemlysarket s. 15 setter hypervisor, gjeste-OS og apper på nivå 3.",
      cont: "Ingen gjeste-OS: Docker Engine kjører på verts-OS-et, og hver container har appen og bibliotekene sine. Nivåtall for containerlagene vises ikke her, bare verts-OS-et (0)."
    }[f];
  }
  function angrepTekst(f) {
    return {
      trad: "Ingen gjester. Prosessene skilles bare av OS-et og privilegienivåene (fane 1).",
      type1: "Skadevare i VM 1 prøver å nå VM 2. Den stoppes av hypervisoren på −1, som styrer hvilket fysisk minne hver gjest får.",
      type2: "Skadevare i en gjest prøver å nå naboen. Hypervisoren skiller gjestene, men den er selv et program på verts-OS-et.",
      cont: "Skadevare i container A går via den <b>felles kjernen</b> mot container B. Delt kjerne = svakere isolasjon (systemlysarket s. 17)."
    }[f];
  }
  function maalStatus(f, angrep) {
    if (!angrep) return [["", ""], ["", ""], ["", ""]];
    if (f === "trad") return [["gra", "Ingen gjester i denne arkitekturen."], ["gra", ""], ["gra", ""]];
    if (f === "cont") return [["nei", "Svakere: en kjernefeil kan la én container nå en annen."], ["gra", "Ingen hypervisor, men verts-kjernen er felles."], ["gra", "Ikke vist i scenarioet."]];
    return [["ok", "Stoppet ved hypervisoren."], ["ok", f === "type1" ? "Gjesten på nivå 0 når ikke hypervisoren på −1." : "Gjeste-OS-et kjører på nivå 3 (systemlysarket s. 15) og når ikke naboen."], ["gra", "Ikke vist i scenarioet. Viktig fordi skadevare ofte oppfører seg pent i en analyse-VM."]];
  }
  function angrepFig(f) {
    var cont = f === "cont";
    var fig = el("div", { class: "sys-angrep" + (cont ? " delt" : "") });
    var a = cont ? "Container A" : "VM 1", b = cont ? "Container B" : "VM 2";
    fig.appendChild(H("span", "sys-angrep-g ond", a));
    fig.appendChild(H("span", "sys-angrep-pil", cont ? "⇢ felles kjerne ⇢" : "→ ✕ hypervisor"));
    fig.appendChild(H("span", "sys-angrep-g" + (cont ? " truffet" : ""), b));
    if (f === "trad") { clear(fig); fig.appendChild(H("span", "sys-note", "Ingen nabo å angripe.")); }
    return fig;
  }

  /* =====================================================================
     4 · Sikker oppstart, TPM og BitLocker
     ===================================================================== */
  var BOOT = [
    { id: "start", navn: "Startknapp" },
    { id: "uefi", navn: "CPU kjører UEFI-kode fra firmware (flash)", hash: "3f9a" },
    { id: "verif", navn: "Verifiser signaturen på UEFI-driverne", hash: "b71c" },
    { id: "last", navn: "Last driverne i minnet", hash: "0e4d" },
    { id: "kjor", navn: "Kjør driverne, de laster OS-et", hash: "9a22" },
    { id: "os", navn: "OS-et overtar", hash: "c5f0" },
    { id: "login", navn: "Login" }
  ];
  var SCEN = {
    normal: { navn: "Normal oppstart", tekst: "Oppstartslasteren er signert av en nøkkel i db." },
    usignert: { navn: "Usignert laster (rootkit)", tekst: "Et rootkit har byttet oppstartslasteren med en usignert fil." },
    svarteliste: { navn: "Svartelistet laster", tekst: "Lasteren er signert, men er en kjent sårbar versjon som står i dbx." },
    av: { navn: "Sikker oppstart slått av", tekst: "Sikker oppstart er slått av i oppsettet, og en endret laster startes." }
  };

  IN.sysOppstart = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "sys-viz" });
    var scen = sget("oppstart", "normal"); if (!SCEN[scen]) scen = "normal";
    var attest = null;

    var row = el("div", { class: "sys-row", role: "group", "aria-label": "Velg scenario" });
    row.appendChild(H("span", "sys-lbl", "Scenario:"));
    var sBtn = {};
    Object.keys(SCEN).forEach(function (k) {
      var b = btn(SCEN[k].navn, function () { scen = k; attest = null; sset("oppstart", scen); paint(); });
      sBtn[k] = b; row.appendChild(b);
    });
    w.appendChild(row);
    var aRow = el("div", { class: "sys-row" });
    aRow.appendChild(btn("Attester", function () { attest = true; paint(); }));
    aRow.appendChild(H("span", "sys-note", "Maskinen sender TPM-signerte målinger til VPN-tjeneren, som sammenligner dem med forventede verdier."));
    w.appendChild(aRow);
    var scTxt = H("p", "sys-note", "");
    w.appendChild(scTxt);
    var lay = el("div", { class: "sys-boot" });
    w.appendChild(lay);
    w.appendChild(H("p", "sys-poeng", "Sikker oppstart stopper. Målt oppstart registrerer."));
    var out = el("div", { class: "sys-out", "aria-live": "polite" });
    w.appendChild(out);
    host.appendChild(w);

    function paint() {
      for (var k in sBtn) press(sBtn[k], k === scen);
      scTxt.textContent = SCEN[scen].tekst;
      clear(lay);
      var stopp = scen === "usignert" || scen === "svarteliste";
      // Venstre: tillitsankeret
      var anker = el("div", { class: "sys-boot-col" });
      anker.appendChild(H("div", "sys-k", "Tillitsanker"));
      anker.appendChild(H("div", "sys-liste pk", "<b>PK</b> (plattformnøkkel) beskytter db og dbx mot endring"));
      anker.appendChild(H("div", "sys-liste db" + (scen === "normal" || scen === "usignert" ? " brukt" : ""), "<b>db</b> · godkjente nøkler<br><span class=\"sys-note\">Microsoft UEFI CA · Lerkedal IT</span>"));
      anker.appendChild(H("div", "sys-liste dbx" + (scen === "svarteliste" ? " brukt" : ""), "<b>dbx</b> · svarteliste<br><span class=\"sys-note\">hash av laster v1.2 (sårbar)</span>"));
      lay.appendChild(anker);
      // Midten: flyten og TPM-loggen
      var flyt = el("ol", { class: "sys-flyt" });
      var logg = [];
      var avbrutt = false;
      BOOT.forEach(function (b) {
        var st = "ok", merk = "";
        if (avbrutt) st = "gra";
        else if (b.id === "verif") {
          if (scen === "usignert") { st = "nei"; merk = "Feil signatur: ikke signert av noen nøkkel i db → <b>Avbryt oppstart</b>"; avbrutt = true; }
          else if (scen === "svarteliste") { st = "nei"; merk = "Hashen står i dbx → <b>Avbryt oppstart</b>"; avbrutt = true; }
          else if (scen === "av") { st = "warn"; merk = "Ingen sjekk: sikker oppstart er slått av"; }
          else merk = "Signaturen stemmer med en nøkkel i db";
        }
        flyt.appendChild(H("li", "sys-flyt-r " + st, "<span>" + b.navn + "</span>" + (merk ? "<span class=\"sys-note\">" + merk + "</span>" : "")));
        if (b.hash && st !== "gra" && !(avbrutt && b.id === "verif")) {
          var endret = scen === "av" && b.id === "last";
          logg.push({ navn: b.navn, h: endret ? "7d13" : b.hash, endret: endret });
        }
      });
      var mid = el("div", { class: "sys-boot-col sys-boot-mid" });
      mid.appendChild(H("div", "sys-k", "UEFI-sikker oppstart (systemlysarket s. 21)"));
      mid.appendChild(flyt);
      mid.appendChild(H("div", "sys-k", "TPM-logg (målt oppstart)"));
      var lg = el("div", { class: "sys-logg" });
      if (!logg.length) lg.appendChild(H("span", "sys-note", "Tom."));
      logg.forEach(function (x) { lg.appendChild(H("span", "sys-hash sys-mono" + (x.endret ? " nei" : " ok"), x.h + "…")); });
      if (stopp) lg.appendChild(H("span", "sys-note", "Resten rekker ikke å skje."));
      mid.appendChild(lg);
      lay.appendChild(mid);
      // Høyre: BitLocker og attestering
      var hoyre = el("div", { class: "sys-boot-col" });
      hoyre.appendChild(H("div", "sys-k", "BitLocker (forsegling)"));
      var avvik = logg.some(function (x) { return x.endret; });
      if (stopp) hoyre.appendChild(H("div", "sys-laas gra", "– OS-et starter ikke"));
      else if (avvik) hoyre.appendChild(H("div", "sys-laas nei", "Låst: målingene avviker. Gjenopprettingsnøkkel kreves"));
      else hoyre.appendChild(H("div", "sys-laas ok", "Åpnet: målingene stemmer, disken låses opp"));
      hoyre.appendChild(H("div", "sys-k", "Attestering til kommunens VPN-tjener"));
      if (attest) {
        if (stopp) hoyre.appendChild(H("div", "sys-laas gra", "Maskinen startet ikke, ingen attestering"));
        else hoyre.appendChild(H("div", "sys-laas " + (avvik ? "nei" : "ok"), avvik ? "Avvist: TPM-signerte målinger avviker fra forventet" : "Godkjent: TPM-signerte målinger stemmer"));
      } else hoyre.appendChild(H("div", "sys-note", "Trykk «Attester»."));
      lay.appendChild(hoyre);

      out.className = "sys-out" + (stopp ? " nei" : avvik ? " nei" : " ok");
      out.innerHTML = {
        normal: "<p>Hvert steg verifiseres mot db, og TPM-en måler hvert steg. Alt stemmer, så BitLocker-nøkkelen frigis.</p>",
        usignert: "<p>Sikker oppstart <b>stopper</b> den usignerte lasteren. TPM-en ville bare ha registrert den. Det er forskjellen mellom de to.</p>",
        svarteliste: "<p>En gyldig signatur er ikke nok: dbx overstyrer. Det er slik kjente sårbare lastere stoppes.</p>",
        av: "<p>Ingen sjekk stopper lasteren, men TPM-en har <b>målt</b> den. Målingen avviker, så forseglingen holder BitLocker-nøkkelen tilbake, og attesteringen avslører avviket.</p>"
      }[scen];
    }
    paint();
  };

  /* =====================================================================
     5 · Sidekanal eller skjult kanal
     ===================================================================== */
  var KORT = [
    { id: "tid", medium: "tid", s: "En forsker måler at innloggingen på kiosk.lerkedal.no svarer 0,8 ms raskere når første tegn i passordet er feil enn når det er riktig.", svar: "side", hvem: "Offeret lekker uten å vite det. Angriperen måler.", hvorfor: "Ulik behandlingstid lekker utilsiktet." },
    { id: "vifte", medium: "vifte", s: "Skadevare på en air-gappet maskin setter viftehastigheten høyt for «1» og lavt for «0». En mobil i rommet tar opp lyden.", svar: "skjult", hvem: "En innsider (skadevaren) sender med vilje.", hvorfor: "Viften er ikke laget for kommunikasjon, men brukes bevisst (systemlysarket s. 25)." },
    { id: "dns", medium: "DNS", s: "Skadevare sender 4f7a1c.data.eksempel-angriper.net som DNS-oppslag.", svar: "skjult", hvem: "En innsider (skadevaren) sender med vilje.", hvorfor: "Data skjules i DNS-oppslag for å komme forbi brannmuren." },
    { id: "antenne", medium: "stråling", s: "En antenne utenfor bygget fanger opp stråling fra en skjerm og gjenskaper bildet.", svar: "side", hvem: "Offeret lekker uten å vite det. Angriperen måler.", hvorfor: "Elektromagnetisk stråling lekker utilsiktet (TEMPEST, lysarket om fysisk sikkerhet s. 30)." },
    { id: "wifi", medium: "nett", s: "Angriperen setter opp et falskt Wi-Fi-punkt og videresender trafikken.", svar: "ingen", hvem: "Ingen lekkasje via bieffekt. Angriperen går aktivt inn i forbindelsen.", hvorfor: "Det er MitM, ikke en kanal av noen av typene." },
    { id: "volum", medium: "volum", s: "Én app har tilgang til kontaktene og en annen har nettilgang. De «snakker» ved å endre og lese av telefonens volum.", svar: "skjult", hvem: "To apper samarbeider med vilje.", hvorfor: "Volumet er ikke laget for å sende data mellom apper (systemlysarket s. 25)." },
    { id: "strom", medium: "strøm", s: "En angriper måler strømforbruket til et betalingskort mens det signerer.", svar: "side", hvem: "Offeret (kortet) lekker uten å vite det.", hvorfor: "Strømforbruk er en sidekanal (systemlysarket s. 24)." },
    { id: "tor", medium: "nett", s: "En bruker setter opp en kryptert forbindelse gjennom Tor.", svar: "ingen", hvem: "Ingen angriper og ingen lekkasje.", hvorfor: "Tor er et anonymiseringsnettverk, ikke et angrep." }
  ];
  // Gjett først: størrelsesorden for tiden. maks i sekunder (siste trinn uten øvre grense).
  var GJETT = [{ maks: 60, tekst: "Under ett minutt" }, { maks: 3600, tekst: "Minutter" }, { maks: 86400, tekst: "Timer" }, { maks: Infinity, tekst: "Døgn eller mer" }];
  function gjettTrinn(sek) { for (var i = 0; i < GJETT.length; i++) if (sek < GJETT[i].maks) return i; return GJETT.length - 1; }
  var KOL = [{ id: "side", navn: "Sidekanal (utilsiktet)" }, { id: "skjult", navn: "Skjult kanal (bevisst)" }, { id: "ingen", navn: "Ingen / annet" }];

  IN.sysKanal = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "sys-viz" });
    var valg = {}, sjekket = false;
    opphav(w, "kanal");
    w.appendChild(H("p", "sys-note", "Plasser hvert kort med knappene. Spør deg selv: ville noen at informasjonen skulle komme ut?"));
    var pool = el("div", { class: "sys-pool" });
    var kols = el("div", { class: "sys-kols" });
    w.appendChild(pool);
    w.appendChild(kols);
    w.appendChild(el("div", { class: "sys-row" }, [
      kbtn("Sjekk svar", function () { sjekket = true; paint(); }, "primary"),
      kbtn("↺ Nullstill", function () { valg = {}; sjekket = false; paint(); })
    ]));
    var out = el("div", { class: "sys-out", "aria-live": "polite" });
    w.appendChild(out);

    // Gjett først (egen knapperad), så verktøyet
    w.appendChild(H("h5", "sys-h", "Hvor lang tid tar en skjult kanal?"));
    var gjett = el("div", { class: "sys-gjett" });
    gjett.appendChild(H("p", "", "<b>Gjett først.</b> Skadevare lekker en AES-256-nøkkel (256 bit) gjennom en skjult kanal på 0,5 bit/s. Hvor lang tid tar det?"));
    var gRow = el("div", { class: "sys-row", role: "group", "aria-label": "Ditt gjett" });
    var gOut = el("div", { class: "sys-out", "aria-live": "polite" });
    var gBtn = GJETT.map(function (g, i) {
      var b = btn(g.tekst, function () { svarGjett(i); });
      press(b, false); gRow.appendChild(b); return b;
    });
    gjett.appendChild(gRow); gjett.appendChild(gOut);
    w.appendChild(gjett);
    var verktoy = el("div", { class: "sys-verktoy", hidden: true });
    verktoy.appendChild(H("p", "sys-note", "<b>Verktøy:</b> prøv andre tall. Dette er en kalkulator, ikke en oppgave."));
    function svarGjett(i) {
      var t = kanalTid(0.5, 256), fasit = gjettTrinn(t), ok = i === fasit;
      gBtn.forEach(function (b, k) { press(b, k === i); b.disabled = true; });
      gOut.className = "sys-out " + (ok ? "ok" : "nei");
      gOut.innerHTML = "<p><b>" + (ok ? "Riktig." : "Ikke riktig. Riktig er «" + GJETT[fasit].tekst + "».") + "</b> 256 bit / 0,5 bit/s = 512 s, altså " + varighet(t) + ".</p>";
      verktoy.hidden = false;
    }
    var bps = el("input", { type: "number", class: "sys-num", min: "0.01", step: "0.1", value: "0.5", "aria-label": "Bit per sekund" });
    var storr = el("select", { class: "sys-sel", "aria-label": "Hemmelighetens størrelse" });
    [["128", "AES-128-nøkkel (128 bit)"], ["256", "AES-256-nøkkel (256 bit)"], ["64", "passord på 8 tegn (64 bit)"], ["2048", "RSA-2048-modul (2048 bit)"]].forEach(function (p, i) {
      var o = el("option", { value: p[0], text: p[1] }); if (i === 1) o.selected = true; storr.appendChild(o);
    });
    var kalk = el("div", { class: "sys-out", "aria-live": "polite" });
    function regn() {
      var b = parseFloat(String(bps.value).replace(",", ".")), n = +storr.value;
      if (!(b > 0)) { kalk.className = "sys-out nei"; kalk.innerHTML = "<p>Skriv et positivt tall for bit per sekund.</p>"; return; }
      var t = kanalTid(b, n);
      kalk.className = "sys-out";
      kalk.innerHTML = "<p class=\"sys-mono\">" + n + " bit / " + komma(b) + " bit/s = " + komma(Math.round(t * 10) / 10) + " s</p><p>Det tar <b>" + varighet(t) + "</b>. Lav båndbredde er ingen trøst for små hemmeligheter.</p>";
    }
    bps.addEventListener("input", regn); storr.addEventListener("change", regn);
    verktoy.appendChild(el("div", { class: "sys-row" }, [el("label", { class: "sys-lbl" }, ["Bit per sekund: ", bps]), el("label", { class: "sys-lbl" }, ["Hemmelighet: ", storr])]));
    verktoy.appendChild(kalk);
    w.appendChild(verktoy);
    host.appendChild(w);
    regn();

    function kort(k) {
      var v = valg[k.id];
      var ok = sjekket && v === k.svar, nei = sjekket && v != null && v !== k.svar;
      var c = el("div", { class: "sys-kort" + (ok ? " ok" : "") + (nei ? " nei" : "") });
      c.appendChild(H("span", "sys-kort-m", k.medium));
      c.appendChild(H("p", "", k.s.replace(/(\S+\.(?:no|net))/g, "<span class=\"sys-mono\">$1</span>")));
      var r = el("div", { class: "sys-row sys-kort-b" });
      KOL.forEach(function (col) {
        var b = btn(col.id === "side" ? "Sidekanal" : col.id === "skjult" ? "Skjult kanal" : "Ingen", function () { valg[k.id] = col.id; sjekket = false; paint(); });
        press(b, v === col.id); r.appendChild(b);
      });
      c.appendChild(r);
      if (sjekket && v != null) c.appendChild(H("p", "sys-note", (ok ? "Riktig. " : "Riktig svar: " + KOL.filter(function (x) { return x.id === k.svar; })[0].navn + ". ") + "<b>Hvem sender?</b> " + k.hvem + " " + k.hvorfor));
      return c;
    }
    function paint() {
      clear(pool); clear(kols);
      var rest = KORT.filter(function (k) { return valg[k.id] == null; });
      if (rest.length) { pool.appendChild(H("div", "sys-k", "Usortert (" + rest.length + ")")); rest.forEach(function (k) { pool.appendChild(kort(k)); }); }
      KOL.forEach(function (col) {
        var c = el("div", { class: "sys-kol sys-kol-" + col.id });
        c.appendChild(H("div", "sys-k", col.navn));
        KORT.filter(function (k) { return valg[k.id] === col.id; }).forEach(function (k) { c.appendChild(kort(k)); });
        kols.appendChild(c);
      });
      if (sjekket) {
        var r = KORT.filter(function (k) { return valg[k.id] === k.svar; }).length;
        out.className = "sys-out " + (r === KORT.length ? "ok" : "nei");
        out.innerHTML = "<p><b>" + r + " av " + KORT.length + " riktig</b></p>" +
          "<p><b>Sidekanal:</b> utilsiktet lekkasje fra den fysiske implementasjonen.</p>" +
          "<p><b>Skjult kanal:</b> en mekanisme som ikke er laget for kommunikasjon, men brukes bevisst til det.</p>" +
          "<p class=\"small muted\">Systemlysarket s. 24–25</p>";
      } else { out.className = "sys-out"; out.innerHTML = ""; }
    }
    paint();
  };

  /* =====================================================================
     6 · CVSS og prioritering
     ===================================================================== */
  var CVSS_KORT = [
    { id: "xss", s: "XSS i intranettets søkefelt", cvss: 5.4 },
    { id: "ver", s: "Versjonsnummer vises i en feilmelding", cvss: 3.1 },
    { id: "vpn", s: "Fjernkjøring av kode i VPN-gatewayen, ingen innlogging nødvendig", cvss: 9.8 },
    { id: "lpe", s: "Privilegieeskalering fra bruker til kjerne i Linux-kjernen", cvss: 7.8 }
  ];
  var BAND = [
    { id: "lav", navn: "Lav", fra: 0.1, til: 3.9 }, { id: "middels", navn: "Middels", fra: 4.0, til: 6.9 },
    { id: "hoy", navn: "Høy", fra: 7.0, til: 8.9 }, { id: "kritisk", navn: "Kritisk", fra: 9.0, til: 10 }
  ];

  IN.sysCvss = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var w = el("div", { class: "sys-viz" });
    var v = parseFloat(sget("cvss", "7.0")); if (!(v >= 0 && v <= 10)) v = 7.0;

    var skala = el("div", { class: "sys-skala", "aria-hidden": "true" });
    skala.appendChild(el("span", { class: "sys-band sys-band-ingen", style: "flex: 0 0 4px", title: "0,0" }));
    BAND.forEach(function (b) { skala.appendChild(el("span", { class: "sys-band sys-band-" + b.id, style: "flex: " + Math.round((b.til - b.fra + 0.1) * 10) + " 1 0", text: b.navn })); });
    var mark = el("span", { class: "sys-mark" });
    skala.appendChild(mark);
    w.appendChild(skala);
    var akse = el("div", { class: "sys-akse", "aria-hidden": "true" });
    [0, 4, 7, 9, 10].forEach(function (x) { akse.appendChild(el("span", { style: "left:" + (x * 10) + "%", text: komma(x, 1) })); });
    w.appendChild(akse);
    var sl = el("input", { type: "range", min: "0", max: "10", step: "0.1", value: String(v), class: "sys-range", "aria-label": "CVSS-skår" });
    var res = el("div", { class: "sys-out", "aria-live": "polite" });
    sl.addEventListener("input", function () { v = parseFloat(sl.value); sset("cvss", String(v)); paintSkala(); });
    w.appendChild(el("label", { class: "sys-lbl sys-range-l" }, ["CVSS-skår: ", sl]));
    w.appendChild(res);

    function paintSkala() {
      var k = cvssKat(v), x = Math.round(v * 10) / 10;
      mark.style.left = (x * 10) + "%";
      var grense = [3.9, 4.0, 6.9, 7.0, 8.9, 9.0].some(function (g) { return Math.abs(g - x) < 0.001; });
      res.className = "sys-out sys-kat-" + k.id;
      res.innerHTML = "<p><b class=\"sys-mono\">" + komma(x, 1) + "</b> = <b>" + k.navn + "</b>" +
        (k.id === "ingen" ? ". Systemlysarket starter Lav på 0,1. I CVSS-standarden heter 0,0 «None», men det er ikke pensum." : "") +
        (grense ? " <span class=\"sys-varsel\">Grensetilfelle: Lav 0,1–3,9 · Middels 4,0–6,9 · Høy 7,0–8,9 · Kritisk 9,0–10.</span>" : "") + "</p>";
    }
    paintSkala();

    w.appendChild(H("h5", "sys-h", "Fra funn til retting (systemlysarket s. 5)"));
    var flyt = el("ol", { class: "sys-cveflyt" });
    ["Oppdage og rapportere", "CVE: registrer, lag CVE-ID", "NVD: retningslinjer, CVSS-skår", "Virksomhet: prioriter og fjern"].forEach(function (t) { flyt.appendChild(H("li", "", t)); });
    w.appendChild(flyt);

    w.appendChild(H("h5", "sys-h", "Prioriter mandagens fire varsler"));
    opphav(w, "cvss");
    w.appendChild(H("p", "sys-note", "Flytt kortene i rekkefølgen driftsgruppen bør ta dem, viktigst øverst. Skårene vises når du sjekker. Sårbarhetene er oppdiktet."));
    var rek = ["xss", "ver", "vpn", "lpe"], sjekket = false;
    var liste = el("ol", { class: "sys-prio" });
    var pOut = el("div", { class: "sys-out", "aria-live": "polite" });
    w.appendChild(liste);
    w.appendChild(el("div", { class: "sys-row" }, [
      kbtn("Sjekk svar", function () { sjekket = true; paintPrio(); }, "primary"),
      kbtn("↺ Nullstill", function () { rek = ["xss", "ver", "vpn", "lpe"]; sjekket = false; paintPrio(); })
    ]));
    w.appendChild(pOut);
    host.appendChild(w);

    function kortAv(id) { return CVSS_KORT.filter(function (k) { return k.id === id; })[0]; }
    function fasit() { return CVSS_KORT.slice().sort(function (a, b) { return b.cvss - a.cvss; }).map(function (k) { return k.id; }); }
    function flytt(i, d) { var j = i + d; if (j < 0 || j >= rek.length) return; var t = rek[i]; rek[i] = rek[j]; rek[j] = t; sjekket = false; paintPrio(); }
    function paintPrio() {
      clear(liste);
      var f = fasit();
      rek.forEach(function (id, i) {
        var k = kortAv(id), ok = sjekket && f[i] === id, nei = sjekket && f[i] !== id;
        var li = el("li", { class: "sys-prio-r" + (ok ? " ok" : "") + (nei ? " nei" : "") });
        li.appendChild(H("span", "sys-prio-s", k.s + (sjekket ? " <span class=\"sys-note\">CVSS " + komma(k.cvss, 1) + " · " + cvssKat(k.cvss).navn + "</span>" : "")));
        var up = btn("↑", function () { flytt(i, -1); }), dn = btn("↓", function () { flytt(i, 1); });
        up.setAttribute("aria-label", "Flytt opp: " + k.s); dn.setAttribute("aria-label", "Flytt ned: " + k.s);
        up.disabled = i === 0; dn.disabled = i === rek.length - 1;
        li.appendChild(el("span", { class: "sys-prio-b" }, [up, dn]));
        liste.appendChild(li);
      });
      if (sjekket) {
        var r = rek.filter(function (id, i) { return f[i] === id; }).length;
        pOut.className = "sys-out " + (r === 4 ? "ok" : "nei");
        pOut.innerHTML = "<p><b>" + r + " av 4 på riktig plass</b></p>" +
          "<p><b>Rekkefølge:</b> fjernkjøring i VPN (Kritisk) → privilegieeskalering (Høy) → XSS (Middels) → versjonsnummer (Lav).</p>" +
          "<p><b>Husk:</b> CVSS måler alvorlighet, ikke risikoen akkurat for dere. Om sårbarheten finnes hos dere, og hva systemet beskytter, må vurderes i tillegg.</p>";
      } else { pOut.className = "sys-out"; pOut.innerHTML = ""; }
    }
    paintPrio();
  };

  /* =====================================================================
     Velger og selvtest
     ===================================================================== */
  var MODUS = { ringer: "sysRinger", stakk: "sysStakk", lag: "sysLag", oppstart: "sysOppstart", kanal: "sysKanal", cvss: "sysCvss" };
  IN.vizSystem = function (host) {
    host = host$(host); if (!host) return;
    var m = host.getAttribute("data-modus");
    if (MODUS[m]) IN[MODUS[m]](host);
  };

  IN.sysSjekk = function () {
    var r = [];
    function t(navn, fikk, ventet) { r.push({ navn: navn, ok: JSON.stringify(fikk) === JSON.stringify(ventet), fikk: fikk, ventet: ventet }); }
    t("kjerne når [−1, 0, 3]", TABNIV.map(function (n) { return kanNaa(0, n); }), [false, true, true]);
    t("bruker når [−1, 0, 3]", TABNIV.map(function (n) { return kanNaa(3, n); }), [false, false, true]);
    t("hypervisor når [−1, 0, 3]", TABNIV.map(function (n) { return kanNaa(-1, n); }), [true, true, true]);
    t("CVSS-grenser", [0, 0.1, 3.9, 4.0, 6.9, 7.0, 8.9, 9.0, 10].map(function (x) { return cvssKat(x).id; }),
      ["ingen", "lav", "lav", "middels", "middels", "hoy", "hoy", "kritisk", "kritisk"]);
    t("256 bit ved 0,5 bit/s", kanalTid(0.5, 256), 512);
    t("gjett: 512 s er «Minutter»", GJETT[gjettTrinn(512)].tekst, "Minutter");
    t("Bygg stablene: type 1 bøtter", (function () { var a = lagSpec("type1").answer; return LAG_BANK.map(function (x, k) { return a["b" + k]; }); })(),
      ["l0", "l1", "l2", "ubrukt", "ubrukt", "ubrukt", "ubrukt", "ubrukt", "l3"]);
    t("stakkfelt med kanarifugl", stakkFelt(true).map(function (f) { return f.id; }), ["b0", "b1", "kan", "rfp", "ret"]);
    t("H22 2.4 type 1 fra topp", LAG.type1.lag, ["App", "Gjeste-OS", "Hypervisor", "Maskinvare"]);
    t("H22 2.5 container fra topp", LAG.cont.lag, ["Container", "Docker Engine", "Verts-OS", "Maskinvare"]);
    t("kanalkort: 3 side, 3 skjult, 2 ingen", ["side", "skjult", "ingen"].map(function (s) { return KORT.filter(function (k) { return k.svar === s; }).length; }), [3, 3, 2]);
    return r;
  };
})();
