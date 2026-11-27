/* ============================================================
   IN2120 guide · viz-risiko.js
   Visualiseringer for blokk 6 (risiko, styring og sikker utvikling).

   IN.risiko.data                 Smuldre Bakeri R1–R5 (kvalitativt og kvantitativt) og kontrolltallene
   IN.risiko.kontroll()           regner alt på nytt og sammenligner med tallene i innholdsfila → [avvik]
   IN.risiko.regn                 rene formler for «regn først»: risiko(inn), roi(inn) (node-testbare)
   IN.risiko.matrise(host, opts)  risikomatrise 6 × 6 med terskelglider, plassering og piler før → etter
                                  opts.handling: true gir fire håndteringsknapper for R1
   IN.risiko.kvalitativ(host)     tabell R = s + k, med største konsekvensaspekt
   IN.risiko.kvantitativ(host)    tabell R = S × K, tiltak og ROI, og koblingen R = 1 + log₁₀(kr/år)
   IN.risiko.regnRisiko(host)     IN.regnForst: R = S × K med glidere, vanlige feil (glemt S, ganget med år, ett aspekt)
   IN.risiko.regnRoi(host)        IN.regnForst: ROI = (reduksjon − kostnad) / kostnad, vanlige feil
   IN.risiko.prosessSort(host)    IN.sortTask: de seks stegene i risikostyringsprosessen (ISO 27005-figuren)
   IN.risiko.prosess(host)        klikkbar fasitfigur (kontekst → ROS → punkt 1 → plan → punkt 2 → tiltak)
   IN.risiko.ros(host)            de tre trinnene i risikovurderingen
   IN.risiko.stride(host)         dataflyt for «Kantinekortet» med STRIDE-bokstaver
   IN.risiko.strideSort(host)     IN.bucketTask: tolv trusler til STRIDE-kategori
   IN.risiko.livssyklus(host)     IN.sortTask: de 7 fasene i innebygd sikkerhet
   IN.risiko.livssyklusAkt(host)  IN.bucketTask: aktivitet til fase
   IN.risiko.cmmi(host)           IN.sortTask: CMMI-nivåene 0–5
   IN.risiko.trekant(host)        risikotrekanten med hjørner som kan slås av
   IN.risiko.domener(host)        ISO 27002:2022-domenene som stablet stolpe
   Øvingene krever dra.js og ovelse.js (lastes før denne fila).
   Klassisk script. Lastes etter core.js. Egen lagring: ingen (dra.js lagrer øvingene).
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;
  var NS = "http://www.w3.org/2000/svg";

  function qsHost(h) { return typeof h === "string" ? IN.qs(h) : h; }
  /* Opphavslinje for øvingene (o.opphav / spec.opphav, se IN.opphavTekst i core.js) */
  var UTV = "Sikker utvikling har ingen lysark i 2026, men har vært på eksamen flere år";
  var OPPHAV = {
    regnSk: { type: "egen", variantAv: ["H2022-10.3"], kilder: ["t06 oppg. 2"] },
    regnRoi: { type: "egen", variantAv: ["H2022-10.3"], kilder: ["ism s. 5"] },
    prosessSort: { type: "egen", variantAv: ["H2023-38", "H2022-10.1"], kilder: ["t06 oppg. 6"] },
    strideSort: { type: "egen", variantAv: ["H2021-9.2", "H2022-4.2", "H2025-31"], merknad: UTV },
    livssyklus: { type: "egen", variantAv: ["H2021-9.1", "H2022-4.1"], merknad: UTV },
    livssyklusAkt: { type: "egen", variantAv: ["H2022-4.1"], merknad: UTV },
    cmmi: { type: "egen", variantAv: ["H2021-8.3"], kilder: ["ism s. 36"] }
  };
  function svg(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  /* Norsk tallformat: mellomrom som tusenskille, komma som desimaltegn */
  function fmt(x, dec) {
    if (dec == null) dec = 0;
    var neg = x < 0, v = Math.abs(x), s = v.toFixed(dec), parts = s.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    var out = parts.join(",");
    if (dec > 0) out = out.replace(/,?0+$/, "");
    return (neg ? "−" : "") + out;
  }
  function near(a, b) { return Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)); }

  /* ---------- Data: Smuldre Bakeri ---------- */
  var RISKS = [
    { id: "R1", navn: "Løsepengevirus på ordre/kasse", kit: "T, I", s: 2, aspekterK: [{ n: "tapt salg", k: 4 }],
      freq: 0.1, freqTxt: "0,1 (hvert 10. år)",
      kr: [{ n: "tapt salg", v: 200000 }, { n: "gjenoppretting", v: 100000 }, { n: "ekstra arbeid", v: 50000 }],
      etter: { k: 3, tiltak: "daglig frakoblet backup" } },
    { id: "R2", navn: "Fakturasvindel via falsk e-post", kit: "I", s: 3, aspekterK: [{ n: "tapt beløp", k: 3 }],
      freq: 1.0, freqTxt: "1,0 (hvert år)",
      kr: [{ n: "tapt beløp", v: 60000 }, { n: "håndtering", v: 10000 }],
      etter: { s: 2, tiltak: "rutinen «ring alltid leverandøren ved nytt kontonummer» og opplæring" } },
    { id: "R3", navn: "DDoS mot nettbutikken i julen", kit: "T", s: 2, aspekterK: [{ n: "tapt julesalg", k: 2 }],
      freq: 0.2, freqTxt: "0,2 (hvert 5. år)", kr: [{ n: "tapt salg", v: 20000 }] },
    { id: "R4", navn: "Lekkasje av kunderegister", kit: "K", s: 2,
      aspekterK: [{ n: "økonomi", k: 2 }, { n: "omdømme", k: 3 }, { n: "juridisk", k: 3 }],
      freq: 0.1, freqTxt: "0,1 (hvert 10. år)",
      kr: [{ n: "bot", v: 100000 }, { n: "varsling/håndtering", v: 30000 }, { n: "tapt salg", v: 70000 }] },
    { id: "R5", navn: "Tapt mobil/PC med e-post og regnskap", kit: "K, T", s: 3, aspekterK: [{ n: "utstyr og tid", k: 2 }],
      freq: 0.8, freqTxt: "0,8", kr: [{ n: "utstyr", v: 15000 }, { n: "gjenoppretting", v: 5000 }] }
  ];
  var TILTAK = [
    { id: "R2", navn: "Rutine og opplæring", kost: 15000, nyFreq: 0.2 },
    { id: "R1", navn: "Frakoblet backup", kost: 20000, nyK: 80000, nyKTxt: "én dags tap pluss gjenoppretting" }
  ];
  /* Tallene slik de står i innholdsfila (plan/innhold/07-risiko.md, fane 5). Koden regner alt på nytt og sammenligner. */
  var FASIT = {
    R: { R1: 6, R2: 6, R3: 4, R4: 5, R5: 5 },
    Retter: { R1: 5, R2: 5 },
    K: { R1: 350000, R2: 70000, R3: 20000, R4: 200000, R5: 20000 },
    risiko: { R1: 35000, R2: 70000, R3: 4000, R4: 20000, R5: 16000 },
    sum: 145000,
    tiltak: { R2: { ny: 14000, red: 56000, roi: 41000 / 15000 }, R1: { ny: 8000, red: 27000, roi: 0.35 } },
    logR: { R1: 5.54, R2: 5.85 },
    eksC: { S: 0.25, K: 1200000, risiko: 300000, roi: 3 }
  };

  function kvalK(r) { return Math.max.apply(null, r.aspekterK.map(function (a) { return a.k; })); }
  function kvalR(r) { return r.s + kvalK(r); }
  function etterPos(r) { return r.etter ? { s: r.etter.s != null ? r.etter.s : r.s, k: r.etter.k != null ? r.etter.k : kvalK(r) } : null; }
  function kvantK(r) { return r.kr.reduce(function (a, x) { return a + x.v; }, 0); }
  function kvantRisk(r) { return r.freq * kvantK(r); }
  function byId(id) { for (var i = 0; i < RISKS.length; i++) if (RISKS[i].id === id) return RISKS[i]; return null; }
  function tiltakCalc(t) {
    var r = byId(t.id), gammel = kvantRisk(r);
    var ny = (t.nyFreq != null ? t.nyFreq : r.freq) * (t.nyK != null ? t.nyK : kvantK(r));
    var red = gammel - ny;
    return { r: r, gammel: gammel, ny: ny, red: red, roi: (red - t.kost) / t.kost };
  }
  function roi(red, kost) { return (red - kost) / kost; }
  /* Kalibreringen: ett nivå = × 10. s = 3 + log₁₀(frekvens), k = log₁₀(kr) − 2, så s + k = 1 + log₁₀(kr/år). */
  function logS(f) { return 3 + Math.log10(f); }
  function logK(kr) { return Math.log10(kr) - 2; }

  function kontroll() {
    var avvik = [];
    function chk(navn, fikk, ventet) { if (!near(fikk, ventet)) avvik.push(navn + ": regnet " + fikk + ", tabellen sier " + ventet); }
    RISKS.forEach(function (r) {
      chk(r.id + " R = s + k", kvalR(r), FASIT.R[r.id]);
      chk(r.id + " K (sum)", kvantK(r), FASIT.K[r.id]);
      chk(r.id + " S × K", kvantRisk(r), FASIT.risiko[r.id]);
      // Kalibreringen skal gi de samme nivåene som den kvalitative tabellen
      chk(r.id + " s fra frekvens", Math.round(logS(r.freq)), r.s);
      chk(r.id + " k fra kroner", Math.round(logK(kvantK(r))), kvalK(r));
      var e = etterPos(r);
      if (e) chk(r.id + " R etter tiltak", e.s + e.k, FASIT.Retter[r.id]);
    });
    chk("Sum kr/år", RISKS.reduce(function (a, r) { return a + kvantRisk(r); }, 0), FASIT.sum);
    TILTAK.forEach(function (t) {
      var c = tiltakCalc(t), f = FASIT.tiltak[t.id];
      chk(t.id + " ny risiko", c.ny, f.ny); chk(t.id + " reduksjon", c.red, f.red); chk(t.id + " ROI", c.roi, f.roi);
    });
    ["R1", "R2"].forEach(function (id) {
      var v = 1 + Math.log10(kvantRisk(byId(id)));
      if (Math.abs(v - FASIT.logR[id]) > 0.005) avvik.push(id + " 1 + log₁₀: regnet " + v.toFixed(3) + ", tabellen sier " + FASIT.logR[id]);
    });
    var c = FASIT.eksC;
    chk("Eksempel C risiko", 0.25 * (800000 + 400000), c.risiko);
    chk("Eksempel C ROI", roi(200000, 50000), c.roi);
    if (avvik.length && window.console) console.error("[viz-risiko] Avvik mot innholdsfila:", avvik);
    return avvik;
  }
  function kontrollLinje(host) {
    var a = kontroll();
    host.appendChild(el("p", { class: "rk-kontroll small " + (a.length ? "is-bad" : "is-ok"),
      html: a.length ? "<b>Kontroll feilet:</b> " + a.join("; ") :
        "Kontroll: tallene over er regnet av siden og stemmer med tabellene i innholdet." }));
  }

  /* ---------- Risikomatrise ---------- */
  function matrise(host, opts) {
    host = qsHost(host); if (!host) return null;
    opts = opts || {};
    var C = 58, X0 = 64, Y0 = 16, N = 6, W = X0 + N * C + 16, H = Y0 + N * C + 54;
    var st = { grense: 5, visEtter: false, mode: opts.handling ? "handling" : "fasit", valgt: null, plassert: {}, handling: null, rute: null };
    var wrap = el("div", { class: "rk-matrise" });
    var ctl = el("div", { class: "rk-ctl" });
    var slider = el("input", { type: "range", min: "4", max: "7", step: "1", value: "5", "aria-label": "Akseptgrense" });
    var gOut = el("b", { text: "5" });
    ctl.appendChild(el("label", { class: "rk-slider" }, [el("span", { text: "Akseptgrense R ≤ " }), gOut, slider]));
    var modeBtns = {};
    if (!opts.handling) {
      [["fasit", "Vis R1–R5"], ["plasser", "Plasser selv"]].forEach(function (m) {
        var b = el("button", { type: "button", class: "btn sm", text: m[1], onclick: function () { st.mode = m[0]; st.valgt = null; st.rute = null; paint(); } });
        modeBtns[m[0]] = b; ctl.appendChild(b);
      });
      var pil = el("button", { type: "button", class: "btn sm", text: "Piler før → etter tiltak", onclick: function () { st.visEtter = !st.visEtter; paint(); } });
      ctl.appendChild(pil);
    }
    wrap.appendChild(ctl);
    var chips = el("div", { class: "rk-chips", role: "group", "aria-label": "Velg risiko" });
    wrap.appendChild(chips);
    var hBtns = {};
    if (opts.handling) {
      var hb = el("div", { class: "rk-ctl", role: "group", "aria-label": "Håndter R1" });
      hb.appendChild(el("span", { class: "small muted", text: "Håndter R1:" }));
      [["redusere", "Redusere"], ["overfore", "Dele/overføre"], ["unnga", "Unngå"], ["akseptere", "Akseptere"], [null, "Tilbake"]].forEach(function (h) {
        var b = el("button", { type: "button", class: "btn sm", text: h[1], onclick: function () { st.handling = h[0]; paint(); } });
        hBtns[String(h[0])] = b; hb.appendChild(b);
      });
      wrap.appendChild(hb);
    }
    /* Klikkbart område: stiplet ramme og hint over matrisen (mønster: KR.bitflipp, .kr-klikkrad / .kr-klikkhint) */
    var hint = el("p", { class: "rk-klikkhint" });
    var svgHost = el("div", { class: "rk-svgwrap rk-klikkrad" });
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "rk-svg", role: "group",
      "aria-label": "Risikomatrise med sannsynlighet loddrett og konsekvens vannrett. Hver rute er en knapp." });
    svgHost.appendChild(hint); svgHost.appendChild(s); wrap.appendChild(svgHost);
    var info = el("div", { class: "rk-info", "aria-live": "polite" });
    wrap.appendChild(info);
    clear(host); host.appendChild(wrap);

    slider.addEventListener("input", function () { st.grense = +slider.value; paint(); });

    function cellX(k) { return X0 + k * C; }
    function cellY(sv) { return Y0 + (N - 1 - sv) * C; }
    function sone(sum) { return sum <= st.grense ? "ok" : sum === st.grense + 1 ? "warn" : "bad"; }
    function vurd(sum) { return sum <= st.grense ? (sum === st.grense ? "akseptabel (på grensen)" : "akseptabel") : "uakseptabel"; }

    function dotsFor() {
      // Returnerer [{id, s, k, kind: "for"|"etter"|"plassert", cls}]
      var out = [];
      if (st.mode === "plasser") {
        Object.keys(st.plassert).forEach(function (id) { var p = st.plassert[id]; out.push({ id: id, s: p.s, k: p.k, kind: "for" }); });
        return out;
      }
      RISKS.forEach(function (r) {
        var k = kvalK(r);
        if (st.mode === "handling" && r.id === "R1" && st.handling) {
          if (st.handling === "redusere") { out.push({ id: "R1", s: r.s, k: k, kind: "gammel" }); out.push({ id: "R1", s: r.s, k: 3, kind: "etter" }); }
          else if (st.handling === "overfore") { out.push({ id: "R1", s: r.s, k: k, kind: "gammel" }); out.push({ id: "R1", s: r.s, k: 3, kind: "etter", tag: "forsikret" }); }
          else if (st.handling === "unnga") out.push({ id: "R1", s: r.s, k: k, kind: "fjernet" });
          else if (st.handling === "akseptere") out.push({ id: "R1", s: r.s, k: k, kind: "rest" });
          return;
        }
        out.push({ id: r.id, s: r.s, k: k, kind: st.visEtter && r.etter ? "gammel" : "for" });
        if (st.visEtter && r.etter) { var e = etterPos(r); out.push({ id: r.id, s: e.s, k: e.k, kind: "etter" }); }
      });
      return out;
    }

    function paint() {
      gOut.textContent = String(st.grense); slider.value = String(st.grense);
      Object.keys(modeBtns).forEach(function (m) { modeBtns[m].setAttribute("aria-pressed", st.mode === m ? "true" : "false"); });
      if (pil) { pil.setAttribute("aria-pressed", st.visEtter ? "true" : "false"); pil.disabled = st.mode === "plasser"; }
      Object.keys(hBtns).forEach(function (h) { hBtns[h].setAttribute("aria-pressed", String(st.handling) === h ? "true" : "false"); });
      hint.textContent = st.mode === "plasser" ? (st.valgt ? "Klikk ruta der " + st.valgt + " hører hjemme" : "Velg først en risiko over, og klikk så en rute")
        : "Klikk en rute for å se risikonivået R = s + k for den";
      // Brikker
      clear(chips);
      if (st.mode === "plasser") {
        chips.appendChild(el("span", { class: "small muted", text: "Velg en risiko og klikk ruta der den hører hjemme:" }));
        RISKS.forEach(function (r) {
          var done = !!st.plassert[r.id];
          chips.appendChild(el("button", { type: "button", class: "btn sm rk-chip" + (done ? " is-done" : ""), "aria-pressed": st.valgt === r.id ? "true" : "false", "data-id": r.id,
            text: r.id + (done ? " ✓" : ""), title: r.navn, onclick: function () {
              st.valgt = r.id; paint();
              var b = chips.querySelector('[data-id="' + r.id + '"]'); if (b) b.focus(); } }));
        });
        chips.appendChild(el("button", { type: "button", class: "btn sm", text: "↺ Nullstill", onclick: function () { st.plassert = {}; st.valgt = null; info.innerHTML = ""; paint(); } }));
      }
      // SVG
      while (s.firstChild) s.removeChild(s.firstChild);
      var defs = svg("defs", {});
      var mk = svg("marker", { id: "rk-arrow-" + uidM, viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
      mk.appendChild(svg("path", { d: "M0,0 L10,5 L0,10 z", class: "rk-arrowhead" }));
      defs.appendChild(mk); s.appendChild(defs);
      for (var sv = 0; sv < N; sv++) for (var k = 0; k < N; k++) {
        var sel = st.mode !== "plasser" && st.rute === sv + ":" + k;
        var sum = sv + k, g = svg("g", { class: "rk-cell rk-" + sone(sum) + (st.feil === sv + ":" + k ? " rk-cell-feil" : "") + (sel ? " is-sel" : ""), "data-s": sv, "data-k": k,
          tabindex: "0", role: "button", "aria-pressed": sel ? "true" : "false", "aria-label": "Sannsynlighet " + sv + ", konsekvens " + k + ", R = " + sum });
        g.appendChild(svg("rect", { x: cellX(k), y: cellY(sv), width: C, height: C }));
        g.appendChild(svg("text", { x: cellX(k) + 5, y: cellY(sv) + 13, class: "rk-sum" }, String(sum)));
        (function (sv2, k2) {
          g.addEventListener("click", function () { cellClick(sv2, k2); });
          g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); cellClick(sv2, k2); } });
        })(sv, k);
        s.appendChild(g);
      }
      // Akser
      for (var i = 0; i < N; i++) {
        s.appendChild(svg("text", { x: cellX(i) + C / 2, y: Y0 + N * C + 16, class: "rk-ax", "text-anchor": "middle" }, String(i)));
        s.appendChild(svg("text", { x: X0 - 10, y: cellY(i) + C / 2 + 4, class: "rk-ax", "text-anchor": "end" }, String(i)));
      }
      s.appendChild(svg("text", { x: X0 + N * C / 2, y: Y0 + N * C + 38, class: "rk-axt", "text-anchor": "middle" }, "Konsekvens k"));
      var yl = svg("text", { x: 14, y: Y0 + N * C / 2, class: "rk-axt", "text-anchor": "middle", transform: "rotate(-90 14 " + (Y0 + N * C / 2) + ")" }, "Sannsynlighet s");
      s.appendChild(yl);
      // Terskellinja: trapp mellom s + k = grense og grense + 1
      var pts = [];
      for (var kk = 0; kk < N; kk++) {
        var smax = Math.min(N - 1, st.grense - kk), y = smax < 0 ? Y0 + N * C : Y0 + (N - 1 - smax) * C;
        pts.push(cellX(kk) + "," + y, cellX(kk + 1) + "," + y);
      }
      s.appendChild(svg("polyline", { points: pts.join(" "), class: "rk-terskel" }));
      s.appendChild(svg("text", { x: X0 + N * C - 4, y: Y0 + N * C - 6, class: "rk-terskel-l", "text-anchor": "end" }, "grønt: R ≤ " + st.grense));
      // Prikker
      var dots = dotsFor(), perCell = {};
      dots.forEach(function (d) { var key = d.s + ":" + d.k; (perCell[key] = perCell[key] || []).push(d); });
      var pos = {};
      Object.keys(perCell).forEach(function (key) {
        var list = perCell[key], n = list.length;
        list.forEach(function (d, j) {
          var p = { x: cellX(d.k) + C / 2 + (j - (n - 1) / 2) * 19, y: cellY(d.s) + C / 2 + 6 };
          pos[d.id + ":" + d.kind] = p;
          d._p = p;
        });
      });
      // Piler først (under prikkene)
      dots.forEach(function (d) {
        if (d.kind !== "etter") return;
        var a = pos[d.id + ":gammel"]; if (!a) return;
        var b = d._p, dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1, r = 11;
        s.appendChild(svg("line", { x1: a.x + dx / len * r, y1: a.y + dy / len * r, x2: b.x - dx / len * r, y2: b.y - dy / len * r,
          class: "rk-pil", "marker-end": "url(#rk-arrow-" + uidM + ")" }));
      });
      dots.forEach(function (d) {
        var g = svg("g", { class: "rk-dot rk-dot-" + d.kind });
        g.appendChild(svg("circle", { cx: d._p.x, cy: d._p.y, r: 10 }));
        g.appendChild(svg("text", { x: d._p.x, y: d._p.y + 3.5, "text-anchor": "middle" }, d.id.replace("R", "")));
        if (d.kind === "fjernet") g.appendChild(svg("path", { d: "M" + (d._p.x - 9) + "," + (d._p.y - 9) + " L" + (d._p.x + 9) + "," + (d._p.y + 9), class: "rk-x" }));
        if (d.tag) g.appendChild(svg("text", { x: d._p.x, y: d._p.y - 14, "text-anchor": "middle", class: "rk-tag" }, d.tag));
        if (d.kind === "rest") g.appendChild(svg("text", { x: d._p.x, y: d._p.y - 14, "text-anchor": "middle", class: "rk-tag" }, "restrisiko"));
        g.appendChild(svg("title", {}, d.id + " " + byId(d.id).navn));
        s.appendChild(g);
      });
      paintInfo();
    }
    var uidM = ++matrise._n;

    function paintInfo() {
      if (st.mode === "plasser") return;
      var h = "";
      if (st.mode === "handling") {
        var r1 = byId("R1"), k1 = kvalK(r1);
        var txt = {
          "null": "R1 (løsepengevirus) ligger på s = " + r1.s + ", k = " + k1 + ", altså R = " + (r1.s + k1) + ". Den er " + vurd(r1.s + k1) + " med grensen " + st.grense + ". Velg en av de fire måtene å håndtere den på.",
          redusere: "<b>Redusere:</b> daglig frakoblet backup gjør at bakeriet mister høyst én dags ordre. Konsekvensen går fra 4 til 3, og R = " + (r1.s + 3) + " (" + vurd(r1.s + 3) + ").",
          overfore: "<b>Dele/overføre:</b> en cyberforsikring dekker deler av tapet, så konsekvensen for bakeriet går ned (her fra 4 til 3). Ansvaret overfor kundene blir likevel hos bakeriet. R = " + (r1.s + 3) + ".",
          unnga: "<b>Unngå:</b> bakeriet slutter med aktiviteten, for eksempel stenger nettbutikken og tar bare bestillinger på telefon. Da finnes ikke risikoen lenger, men heller ikke inntekten.",
          akseptere: "<b>Akseptere:</b> risikoen beholdes som restrisiko. Med R = " + (r1.s + k1) + " og grense " + st.grense + " er det bare forsvarlig hvis ledelsen bevisst velger det og skriver det ned."
        };
        h = txt[String(st.handling)];
        h += '<br><span class="muted small">Ikke gyldig: å «endre risikotabellen» så tallet blir lavere. Det flytter målestokken, ikke risikoen.</span>';
      } else {
        var rows = RISKS.map(function (r) {
          var R = kvalR(r), e = etterPos(r), z = sone(R);
          return "<li><b>" + r.id + "</b> " + r.navn + ": s " + r.s + " + k " + kvalK(r) + " = <b>" + R + "</b> → <span class=\"rk-v rk-v-" + z + "\">" + vurd(R) + "</span>" +
            (st.visEtter && e ? ". Etter tiltak (" + r.etter.tiltak + "): R = " + (e.s + e.k) + " → <span class=\"rk-v rk-v-" + sone(e.s + e.k) + "\">" + vurd(e.s + e.k) + "</span>" : "") + "</li>";
        });
        h = "<ul class=\"rk-list\">" + rows.join("") + "</ul>";
      }
      info.innerHTML = h;
    }

    function cellClick(sv, k) {
      if (st.mode !== "plasser") {
        st.rute = sv + ":" + k; paint();
        var here = RISKS.filter(function (r) { return r.s === sv && kvalK(r) === k; }).map(function (r) { return r.id; });
        info.innerHTML = "Ruta s = " + sv + ", k = " + k + " gir R = " + (sv + k) + ", som er <b>" + vurd(sv + k) + "</b> med grensen " + st.grense + "." +
          (here.length ? " Her ligger " + here.join(" og ") + "." : "") + ' <a href="#" class="rk-back">Vis lista igjen</a>';
        var back = IN.qs(".rk-back", info);
        if (back) back.addEventListener("click", function (ev) { ev.preventDefault(); st.rute = null; paint(); });
        refocus(sv, k);
        return;
      }
      if (!st.valgt) { info.innerHTML = "Velg først en risiko (R1–R5) over matrisen."; return; }
      var r = byId(st.valgt), ok = r.s === sv && kvalK(r) === k;
      if (ok) {
        st.feil = null;
        st.plassert[r.id] = { s: sv, k: k };
        info.innerHTML = "<b>Riktig.</b> " + r.id + " (" + r.navn + ") har s = " + r.s + " og k = " + kvalK(r) +
          (r.aspekterK.length > 1 ? " (største av aspektene " + r.aspekterK.map(function (a) { return a.n + " " + a.k; }).join(", ") + ")" : "") + ", så R = " + kvalR(r) + ".";
        st.valgt = null;
        if (Object.keys(st.plassert).length === RISKS.length) info.innerHTML += " Alle fem er plassert. Bytt til «Vis R1–R5» og slå på pilene for å se tiltakene.";
      } else {
        var hint = r.s !== sv ? "Sannsynligheten stemmer ikke." : "Konsekvensen stemmer ikke.";
        if (r.aspekterK.length > 1 && r.s === sv) hint += " Kvalitativt tar du det <b>største</b> aspektet, ikke summen.";
        info.innerHTML = "<b>Ikke der.</b> " + hint + " Se tabellen for " + r.id + ".";
        /* Feil rute blinker rødt, så feilen syns der man trykket (meldingen står under matrisen) */
        st.feil = sv + ":" + k;
        setTimeout(function () { st.feil = null; var c = s.querySelector(".rk-cell-feil"); if (c) c.classList.remove("rk-cell-feil"); }, 1400);
      }
      paint();
      refocus(sv, k);
    }
    /* paint() tegner rutene på nytt, så fokus settes tilbake på ruta som ble valgt (tastatur) */
    function refocus(sv, k) {
      var c = s.querySelector('.rk-cell[data-s="' + sv + '"][data-k="' + k + '"]');
      if (c && c.focus) c.focus();
    }

    paint();
    return { paint: paint, state: st };
  }
  matrise._n = 0;

  /* ---------- Tabeller ---------- */
  function table(head, rows, cls) {
    var t = el("table", { class: "rk-table" + (cls ? " " + cls : "") });
    var thead = el("thead"), tr = el("tr");
    head.forEach(function (h) { tr.appendChild(el("th", { scope: "col", html: h })); });
    thead.appendChild(tr); t.appendChild(thead);
    var tb = el("tbody");
    rows.forEach(function (r) {
      var row = el("tr", r.cls ? { class: r.cls } : {});
      (r.cells || r).forEach(function (c) { row.appendChild(el("td", { html: String(c) })); });
      tb.appendChild(row);
    });
    t.appendChild(tb);
    return el("div", { class: "table-wrap" }, [t]);
  }

  function kvalitativ(host) {
    host = qsHost(host); if (!host) return;
    clear(host);
    var g = 5;
    /* Maks fire kolonner (ui-ux-regler punkt 6): nummer og navn i én kolonne, R og vurdering i én */
    host.appendChild(table(["Risiko (KIT)", "s", "k (største aspekt)", "R = s + k og vurdering (R ≤ 5)"], RISKS.map(function (r) {
      var R = kvalR(r), kTxt = r.aspekterK.length > 1 ?
        kvalK(r) + " <span class=\"muted small\">(" + r.aspekterK.map(function (a) { return a.n + " " + a.k; }).join(", ") + " → maks " + kvalK(r) + ")</span>" :
        kvalK(r) + " <span class=\"muted small\">(" + r.aspekterK[0].n + ")</span>";
      return { cls: R > g ? "rk-row-bad" : "", cells: ["<b>" + r.id + "</b> " + r.navn + " (" + r.kit + ")", r.s, kTxt, "<b>" + R + "</b>: " + (R > g ? "uakseptabel" : R === g ? "akseptabel (på grensen)" : "akseptabel")] };
    })));
    var etter = RISKS.filter(function (r) { return r.etter; }).map(function (r) {
      var e = etterPos(r), hva = r.etter.k != null ? "k " + kvalK(r) + " → " + e.k : "s " + r.s + " → " + e.s;
      return "<li><b>" + r.id + "</b> med " + r.etter.tiltak + ": " + hva + ", så R = " + e.s + " + " + e.k + " = <b>" + (e.s + e.k) + "</b> (akseptabel).</li>";
    });
    host.appendChild(el("p", { class: "small", html: "<b>Etter tiltak:</b>" }));
    host.appendChild(el("ul", { class: "small", html: etter.join("") }));
  }

  function kvantitativ(host) {
    host = qsHost(host); if (!host) return;
    clear(host);
    var sum = 0;
    var rows = RISKS.map(function (r) {
      var K = kvantK(r), R = kvantRisk(r); sum += R;
      return [r.id, r.freqTxt, r.kr.map(function (x) { return fmt(x.v) + " " + x.n; }).join(" + ") + " = <b>" + fmt(K) + "</b>", "<b>" + fmt(R) + "</b>"];
    });
    rows.push({ cls: "rk-row-sum", cells: ["Sum", "", "", "<b>" + fmt(sum) + " kr/år</b>"] });
    host.appendChild(table(["#", "Sannsynlighet per år", "Konsekvens (sum av aspekter, kr)", "Risiko = S × K (kr/år)"], rows));

    host.appendChild(el("p", { class: "small", html: "<b>Tiltak og ROI</b> = (risikoreduksjon − kostnad) / kostnad:" }));
    var ul = el("ul", { class: "small rk-steps" });
    TILTAK.forEach(function (t) {
      var c = tiltakCalc(t), r = c.r;
      var nyTxt = t.nyFreq != null ? fmt(t.nyFreq, 2) + " × " + fmt(kvantK(r)) : fmt(r.freq, 2) + " × " + fmt(t.nyK) + " (" + t.nyKTxt + ")";
      ul.appendChild(el("li", { html: "<b>" + r.id + "</b>, " + t.navn.toLowerCase() + ", koster " + fmt(t.kost) + " per år. Ny risiko = " + nyTxt + " = " + fmt(c.ny) +
        ". Reduksjon = " + fmt(c.gammel) + " − " + fmt(c.ny) + " = " + fmt(c.red) +
        ". ROI = (" + fmt(c.red) + " − " + fmt(t.kost) + ") / " + fmt(t.kost) + " = " + fmt(c.red - t.kost) + " / " + fmt(t.kost) + " ≈ <b>" + fmt(c.roi, 2) + "</b>." }));
    });
    host.appendChild(ul);
    host.appendChild(el("p", { class: "small", text: "Begge tiltakene lønner seg (ROI > 0). Tiltaket mot R2 gir mest igjen per krone." }));

    // Koblingen mellom skalaene
    host.appendChild(el("p", { class: "small", html: "<b>Sammenhengen mellom skalaene.</b> Med «ett nivå = × 10» er s = 3 + log₁₀(frekvens) og k = log₁₀(kroner) − 2. Da blir s + k = 1 + log₁₀(risiko i kr/år). Siden regner det ut for hver risiko:" }));
    host.appendChild(table(["#", "s = 3 + log₁₀(S)", "k = log₁₀(K) − 2", "1 + log₁₀(S × K) → kvalitativ R"], RISKS.map(function (r) {
      var sL = logS(r.freq), kL = logK(kvantK(r)), RL = 1 + Math.log10(kvantRisk(r));
      return [r.id, fmt(sL, 2) + " → " + Math.round(sL), fmt(kL, 2) + " → " + Math.round(kL), fmt(RL, 2) + " → <b>" + kvalR(r) + "</b>"];
    })));
    host.appendChild(el("p", { class: "small muted", text: "R1 og R2 får begge nivå 6 kvalitativt, men kronebeløpene (35 000 og 70 000) skiller dem. R1 havner på 6 fordi k = 3,54 rundes opp til 4. Kvalitativ vurdering er grov." }));
    kontrollLinje(host);
  }

  /* ---------- Regn først: kvantitativ risiko og ROI (IN.regnForst) ----------
     Rene formler i REGN, så de kan testes i node. ALE/SLE/ARO er gamle sett (H2018–H2019) og ikke 2026-pensum.
     Her heter det R = S × K: sannsynlighet (hendelser per år) × konsekvens (kroner per hendelse). */
  var REGN = {
    risiko: function (inn) { return (inn.A + inn.B) / inn.N; },
    roi: function (inn) { return (inn.G - inn.Ny - inn.C) / inn.C; }
  };
  function regnRisiko(host) {
    host = qsHost(host); if (!host || !IN.regnForst) return null;
    return IN.regnForst(host, {
      id: "risiko-regn-sk",
      opphav: OPPHAV.regnSk,
      rentTall: true,
      sporsmal: function (inn) {
        return {
          eli5: "<p>Nettbutikken til Smuldre bryter sammen omtrent én gang hvert <b>" + inn.N + ".</b> år. Hver gang taper bakeriet <b>" + fmt(inn.A) +
            " kr</b> i salg og bruker <b>" + fmt(inn.B) + " kr</b> på å få alt opp igjen. Hvor mye koster dette i snitt <i>per år</i>?</p>",
          normal: "<p>En hendelse skjer i snitt én gang hvert <b>" + inn.N + ".</b> år. Hver gang gir den <b>" + fmt(inn.A) + " kr</b> i tapt fortjeneste og <b>" +
            fmt(inn.B) + " kr</b> i gjenoppretting. Regn ut den kvantitative risikoen i kroner per år.</p>",
          teknisk: "<p>Frekvens: én hendelse per " + inn.N + " år. Konsekvensaspekter per hendelse: tapt fortjeneste " + fmt(inn.A) + " kr og gjenoppretting " +
            fmt(inn.B) + " kr. Beregn R = S × K i kr/år (H2022 10.3-stil).</p>"
        };
      },
      inndata: [
        { navn: "N", etikett: "Én hendelse hvert … år", verdi: 4, min: 2, max: 10, steg: 1 },
        { navn: "A", etikett: "Tapt fortjeneste (kr)", verdi: 800000, min: 100000, max: 1000000, steg: 100000 },
        { navn: "B", etikett: "Gjenoppretting (kr)", verdi: 400000, min: 50000, max: 500000, steg: 50000 }
      ],
      fasit: REGN.risiko,
      enhet: "kr per år",
      fasitTekst: function (inn, f) { return fmt(f) + " kr per år"; },
      vanligeFeil: [
        { verdi: function (inn) { return inn.A + inn.B; },
          hint: "Det er konsekvensen av <i>én</i> hendelse. Du har glemt å gange med sannsynligheten, altså hvor mange hendelser det blir per år. (I gamle eksamenssett het denne frekvensen ARO.)" },
        { verdi: function (inn) { return inn.N * (inn.A + inn.B); },
          hint: "Du har ganget med antall år. «Én gang hvert N. år» betyr S = 1/N hendelser per år, ikke N." },
        { verdi: function (inn) { return Math.max(inn.A, inn.B) / inn.N; },
          hint: "Du har tatt det største aspektet. Det gjør man kvalitativt. Kvantitativt summeres kronene." },
        { verdi: function (inn) { return inn.A / inn.N; },
          hint: "Du har bare tatt med tapt fortjeneste. Kvantitativt <b>summeres</b> konsekvensaspektene." },
        { verdi: function (inn) { return inn.B / inn.N; },
          hint: "Du har bare tatt med gjenopprettingen. Kvantitativt <b>summeres</b> konsekvensaspektene." }
      ],
      forklaring: function (inn) {
        var S = 1 / inn.N, K = inn.A + inn.B, R = K / inn.N;
        return {
          eli5: "<p>Del det som skjer på årene: " + fmt(K) + " kr hvert " + inn.N + ". år blir " + fmt(R) + " kr per år i snitt.</p>",
          normal: "<p>S = 1/" + inn.N + " = " + fmt(S, 3) + " per år. K = " + fmt(inn.A) + " + " + fmt(inn.B) + " = " + fmt(K) + " kr (kvantitativt summeres aspektene). " +
            "R = S × K = " + fmt(S, 3) + " × " + fmt(K) + " ≈ <b>" + fmt(R) + " kr per år</b>.</p>" +
            "<p class=\"small muted\">På eksamen (H2022) skulle sannsynligheten skrives med punktum, for eksempel 0.25.</p>",
          teknisk: "<p>R = S × K = (1/" + inn.N + ") · (" + fmt(inn.A) + " + " + fmt(inn.B) + ") ≈ " + fmt(R) + " kr/år. Produktet er forventet årlig tap. " +
            "Den gamle formelen ALE = ARO × SLE uttrykker det samme, men er ikke 2026-pensum.</p>"
        };
      }
    });
  }
  function regnRoi(host) {
    host = qsHost(host); if (!host || !IN.regnForst) return null;
    return IN.regnForst(host, {
      id: "risiko-regn-roi",
      opphav: OPPHAV.regnRoi,
      rentTall: true,
      sporsmal: function (inn) {
        var t = "Risikoen er <b>" + fmt(inn.G) + " kr per år</b>. Et tiltak koster <b>" + fmt(inn.C) + " kr per år</b>, og etter tiltaket er risikoen <b>" + fmt(inn.Ny) + " kr per år</b>.";
        return {
          eli5: "<p>" + t + " Hvor mye får bakeriet igjen for hver krone tiltaket koster? Regn ut ROI.</p>",
          normal: "<p>" + t + " Regn ut ROI for tiltaket.</p>",
          teknisk: "<p>" + t + " Beregn ROI = (risikoreduksjon − kostnad) / kostnad.</p>"
        };
      },
      inndata: [
        { navn: "G", etikett: "Risiko før (kr/år)", verdi: 300000, min: 200000, max: 600000, steg: 20000 },
        { navn: "Ny", etikett: "Risiko etter (kr/år)", verdi: 100000, min: 20000, max: 180000, steg: 20000 },
        { navn: "C", etikett: "Kostnad (kr/år)", verdi: 50000, min: 30000, max: 150000, steg: 10000 }
      ],
      fasit: REGN.roi,
      fasitTekst: function (inn, f) { return "ROI = " + fmt(f, 2); },
      vanligeFeil: [
        { verdi: function (inn) { return (inn.G - inn.Ny) / inn.C; },
          hint: "Du har delt reduksjonen på kostnaden uten å trekke fra kostnaden først. ROI = (reduksjon − kostnad) / kostnad." },
        { verdi: function (inn) { return inn.G - inn.Ny - inn.C; },
          hint: "Det er netto gevinst i kroner. ROI er et forholdstall, så del på kostnaden." },
        { verdi: function (inn) { return (inn.G - inn.C) / inn.C; },
          hint: "Du har brukt hele risikoen før tiltaket. Det er <b>reduksjonen</b> (før − etter) som teller." },
        { verdi: function (inn) { return (inn.G - inn.Ny - inn.C) / (inn.G - inn.Ny); },
          hint: "Du har delt på reduksjonen. Del på <b>kostnaden</b>." },
        { test: function (svar, inn) { var f = REGN.roi(inn); return f !== 0 && IN.regnForst.naer(svar, f * 100, 0.02); },
          hint: "Det ser ut som prosent. Oppgi ROI som forholdstall, for eksempel 3 og ikke 300." }
      ],
      forklaring: function (inn) {
        var red = inn.G - inn.Ny, r = REGN.roi(inn);
        var dom = r > 0 ? "Tiltaket lønner seg." : r === 0 ? "Tiltaket går akkurat i null." : "Tiltaket lønner seg ikke: det koster mer enn det sparer.";
        return {
          eli5: "<p>Tiltaket sparer " + fmt(red) + " kr og koster " + fmt(inn.C) + " kr. Det som er igjen, " + fmt(red - inn.C) + " kr, delt på prisen gir " + fmt(r, 2) + ". " + dom + "</p>",
          normal: "<p>Reduksjon = " + fmt(inn.G) + " − " + fmt(inn.Ny) + " = " + fmt(red) + ". ROI = (" + fmt(red) + " − " + fmt(inn.C) + ") / " + fmt(inn.C) +
            " = <b>" + fmt(r, 2) + "</b>. " + dom + "</p>",
          teknisk: "<p>ROI = (ΔR − C) / C = (" + fmt(red) + " − " + fmt(inn.C) + ") / " + fmt(inn.C) + " ≈ " + fmt(r, 2) +
            ". Formelen står ikke i H2022-arket, men fasiten der (4) stemmer med den. ROI &lt; 0 betyr at tiltaket koster mer enn risikoen det fjerner.</p>"
        };
      }
    });
  }

  /* ---------- Prosessfiguren ---------- */
  var PROSESS = {
    kontekst: { t: "Kontekstetablering", s: "Planlegging, risikokriterier (akseptgrense) og valg av risikoeier.",
      b: "Smuldre: daglig leder er risikoeier, og akseptgrensen er R ≤ 5 på skalaen 0–10." },
    eier: { t: "Bestem risikoeier", s: "Hører til kontekstetableringen.", b: "Smuldre: daglig leder eier risikoen. Hun har budsjettet og kan godta restrisiko." },
    ros: { t: "Risikovurdering (ROS)", s: "Identifisering → analyse → evaluering.",
      b: "Smuldre: finner R1–R5, anslår s og k for hver og sammenligner R med grensen 5." },
    analyse: { t: "Risikoanalyse", s: "Del av risikovurderingen: anslå sannsynlighet og konsekvens og beregn risikonivået.",
      b: "Smuldre: R1 får s = 2 og k = 4, altså R = 6." },
    bp1: { t: "Beslutningspunkt 1", s: "Er vurderingen god nok til å rangere risikoene?", diamond: true,
      b: "Smuldre, første forsøk: alle fem fikk R = 6. Dårlig spredning gir <b>Nei</b>. Skalaene kalibreres på nytt (× 10 per steg), og nå blir nivåene 4, 5, 5, 6, 6. Da blir svaret <b>Ja</b>.",
      nei: [["Dårlig spredning: nesten alle risikoer har samme nivå", "Kalibrer sannsynlighets- og konsekvensskalaene på nytt"],
            ["Stor uvisshet rundt én eller flere høye risikoer", "Skaff mer informasjon eller en ekspertvurdering"]] },
    plan: { t: "Risikohåndteringsplan", s: "Redusere, dele/overføre, unngå eller akseptere hver risiko.",
      b: "Smuldre: redusere R1 (backup) og R2 (rutine), akseptere R3–R5 som restrisiko, vurdere cyberforsikring for R4." },
    aksepter: { t: "Aksepter risiko", s: "Del av planen: risikoene som beholdes, er restrisiko.", b: "Smuldre: R3 (4), R4 (5) og R5 (5) ligger innenfor grensen og aksepteres." },
    bp2: { t: "Beslutningspunkt 2", s: "Godtar ledelsen planen?", diamond: true,
      b: "Smuldre: tiltakene koster 15 000 + 20 000 = 35 000 kr per år. Med forsikringspremien i tillegg sprenger planen budsjettet, så svaret blir <b>Nei</b>. Forsikringen strykes, og tiltakene mot R1 og R2 beholdes. Da blir svaret <b>Ja</b>.",
      nei: [["For dyr eller for ambisiøs plan, eller budsjettet strekker ikke til", "Ledelsen kan bevisst heve akseptgrensen (revidere kriteriene, t06 6b), velge færre tiltak eller gi mer budsjett"],
            ["For mange aksepterte risikoer eller for høy restrisiko", "Senk akseptgrensen eller legg til tiltak"],
            ["Kostnadsanslaget er misvisende", "Regn kostnadene på nytt"]] },
    impl: { t: "Implementer sikkerhetstiltak", s: "Tiltakene i planen innføres.", b: "Smuldre: backup og bekreftelsesrutine er på plass før julesalget." }
  };
  function prosess(host) {
    host = qsHost(host); if (!host) return;
    clear(host);
    var W = 600, H = 468, LX = 90, LW = 230, cx = LX + LW / 2, RX = 380, RW = 190, BH = 44;
    var rows = { kontekst: 14, ros: 92, bp1: 176, plan: 262, bp2: 346, impl: 418 };
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "rk-svg rk-proc", role: "group", "aria-label": "Risikostyringsprosessen" });
    var defs = svg("defs", {}), mk = svg("marker", { id: "rk-parr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
    mk.appendChild(svg("path", { d: "M0,0 L10,5 L0,10 z", class: "rk-arrowhead" })); defs.appendChild(mk); s.appendChild(defs);
    var nodes = {};
    function line(x1, y1, x2, y2, cls, arrow) { s.appendChild(svg("line", { x1: x1, y1: y1, x2: x2, y2: y2, class: cls || "rk-flow", "marker-end": arrow === false ? null : "url(#rk-parr)" })); }
    function poly(points, cls) { s.appendChild(svg("polyline", { points: points, class: cls || "rk-flow", "marker-end": "url(#rk-parr)" })); }
    function label(x, y, t, anchor) { s.appendChild(svg("text", { x: x, y: y, class: "rk-flowlbl", "text-anchor": anchor || "middle" }, t)); }
    function box(id, x, y, w, h) {
      var g = svg("g", { class: "rk-node", tabindex: "0", role: "button", "aria-label": PROSESS[id].t });
      g.appendChild(svg("rect", { x: x, y: y, width: w, height: h, rx: 4 }));
      g.appendChild(svg("text", { x: x + w / 2, y: y + h / 2 + 5, "text-anchor": "middle" }, PROSESS[id].t));
      hook(g, id); s.appendChild(g);
    }
    function diamond(id, y) {
      var hw = 92, hh = 32, cy = y + hh;
      var g = svg("g", { class: "rk-node rk-diamond", tabindex: "0", role: "button", "aria-label": PROSESS[id].t });
      g.appendChild(svg("polygon", { points: cx + "," + y + " " + (cx + hw) + "," + cy + " " + cx + "," + (y + 2 * hh) + " " + (cx - hw) + "," + cy }));
      g.appendChild(svg("text", { x: cx, y: cy + 5, "text-anchor": "middle" }, PROSESS[id].t));
      hook(g, id); s.appendChild(g);
      return { top: y, cy: cy, bottom: y + 2 * hh, left: cx - hw };
    }
    function hook(g, id) {
      nodes[id] = g;
      g.addEventListener("click", function () { show(id); });
      g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); show(id); } });
    }
    // Hovedkolonnen
    box("kontekst", LX, rows.kontekst, LW, BH);
    line(cx, rows.kontekst + BH, cx, rows.ros);
    box("ros", LX, rows.ros, LW, BH);
    line(cx, rows.ros + BH, cx, rows.bp1);
    var d1 = diamond("bp1", rows.bp1);
    line(cx, d1.bottom, cx, rows.plan); label(cx + 12, d1.bottom + 15, "Ja", "start");
    box("plan", LX, rows.plan, LW, BH);
    var d2 = diamond("bp2", rows.bp2 - 14);
    line(cx, rows.plan + BH, cx, d2.top);
    line(cx, d2.bottom, cx, rows.impl); label(cx + 12, d2.bottom + 12, "Ja", "start");
    box("impl", LX, rows.impl, LW, BH);
    // Nei-piler tilbake
    poly(d1.left + "," + d1.cy + " 50," + d1.cy + " 50," + (rows.ros + BH / 2) + " " + LX + "," + (rows.ros + BH / 2), "rk-flow rk-nei");
    label(66, d1.cy - 6, "Nei");
    poly(d2.left + "," + d2.cy + " 24," + d2.cy + " 24," + (rows.kontekst + BH / 2) + " " + LX + "," + (rows.kontekst + BH / 2), "rk-flow rk-nei");
    label(40, d2.cy - 6, "Nei");
    // Underbokser
    [["eier", "kontekst"], ["analyse", "ros"], ["aksepter", "plan"]].forEach(function (p) {
      var y = rows[p[1]];
      line(LX + LW, y + BH / 2, RX, y + BH / 2, "rk-flow rk-sub", false);
      box(p[0], RX, y + 4, RW, BH - 8);
    });
    var svgWrap = el("div", { class: "rk-svgwrap" }, [s]);
    host.appendChild(svgWrap);
    var info = el("div", { class: "rk-info", "aria-live": "polite" });
    host.appendChild(info);
    function show(id) {
      Object.keys(nodes).forEach(function (k) { nodes[k].classList.toggle("is-sel", k === id); });
      var p = PROSESS[id], h = "<p><b>" + p.t + ".</b> " + p.s + "</p><p>" + p.b + "</p>";
      if (p.nei) {
        h += "<p class=\"small\"><b>Typiske grunner til «Nei» (ukesoppgave t06):</b></p><ul class=\"small\">" +
          p.nei.map(function (n) { return "<li>" + n[0] + ". <i>Gjør så:</i> " + n[1] + ".</li>"; }).join("") + "</ul>";
      }
      info.innerHTML = h;
    }
    info.innerHTML = '<p class="small muted">Klikk en boks for Smuldre-steget, eller en rombe for grunnene til «Nei».</p>';
  }

  function ros(host) {
    host = qsHost(host); if (!host) return;
    clear(host);
    var steg = [
      ["Risikoidentifisering", "Verdier, trusler, eksisterende tiltak, sårbarheter og mulige konsekvenser", "Smuldre lister kunderegisteret, kassene, nettbutikken og betalingsrutinen, og finner R1–R5."],
      ["Risikoanalyse", "Anslå sannsynlighet og konsekvens og beregn risikonivået", "R4: s = 2, største konsekvensaspekt 3, altså R = 5."],
      ["Risikoevaluering", "Ranger risikoene og sammenlign med akseptgrensen", "R1 og R2 (6) er over grensen 5. R3–R5 er innenfor."]
    ];
    var row = el("ol", { class: "rk-ros" });
    steg.forEach(function (x) {
      row.appendChild(el("li", { html: "<b>" + x[0] + "</b><span class=\"small\">" + x[1] + "</span><span class=\"small muted\">" + x[2] + "</span>" }));
    });
    host.appendChild(row);
  }

  /* ---------- Sorter prosessen (IN.sortTask) ---------- */
  function prosessSort(host) {
    host = qsHost(host); if (!host || !IN.sortTask) return null;
    var nei1 = PROSESS.bp1.nei.map(function (n) { return n[0].toLowerCase(); }).join(", eller ");
    var nei2 = PROSESS.bp2.nei.map(function (n) { return n[0].toLowerCase(); }).join("; ");
    return IN.sortTask(host, {
      id: "risiko-prosess-sort",
      opphav: OPPHAV.prosessSort,
      prompt: {
        eli5: "Bakeriet skal finne ut hva som er farlig og hva de skal gjøre med det. Sett stegene i den rekkefølgen de skjer, fra øverst til nederst.",
        normal: "Sett stegene i risikostyringsprosessen i riktig rekkefølge, slik eksamensfiguren viser dem (ISO 27005).",
        teknisk: "Ordne hovedkolonnen i prosessfiguren (ISO 27005, H2022 10.1 og H2023 38), med de to beslutningspunktene der de hører hjemme."
      },
      items: [
        { id: "kontekst", html: "Kontekstetablering", forklaring: "Prosessen starter med planlegging, risikokriterier (akseptgrense) og valg av risikoeier. " + PROSESS.kontekst.b },
        { id: "ros", html: "Risikovurdering (identifisering → analyse → evaluering)", forklaring: "Vurderingen trenger akseptgrensen fra konteksten for å kunne evaluere. " + PROSESS.ros.b },
        { id: "bp1", html: "Beslutningspunkt: er vurderingen god nok?",
          forklaring: { eli5: "Før man lager en plan, sjekker man at målingen gir mening.", normal: "Dette punktet vurderer resultatet av risikovurderingen, så det kommer rett etter den. «Nei» hvis: " + nei1 + ".",
            teknisk: "Punkt 1 kvalitetssikrer vurderingen før planen lages. «Nei» hvis: " + nei1 + ". Da gjøres vurderingen om." } },
        { id: "plan", html: "Risikohåndteringsplan", forklaring: "Når vurderingen er godkjent, velger man redusere, dele/overføre, unngå eller akseptere for hver risiko. " + PROSESS.plan.b },
        { id: "bp2", html: "Beslutningspunkt: godtar ledelsen planen?",
          forklaring: { eli5: "Sjefen må si ja til planen før man bruker penger på den.", normal: "Dette punktet vurderer planen, så det kommer etter den. Budsjett og restrisiko hører hjemme her.",
            teknisk: "Punkt 2 er ledelsens godkjenning av planen. «Nei» hvis: " + nei2 + "." } },
        { id: "impl", html: "Implementer sikkerhetstiltak", forklaring: "Tiltakene innføres til slutt, etter et «Ja» i punkt 2. " + PROSESS.impl.b }
      ],
      answer: ["kontekst", "ros", "bp1", "plan", "bp2", "impl"],
      oppsummering: {
        eli5: "Huskeregel: regler → måle → sjekke målingen → plan → sjefen sier ja → gjøre det.",
        normal: "Hvert beslutningspunkt står rett etter det det vurderer: punkt 1 etter vurderingen, punkt 2 etter planen. «Nei» sender prosessen tilbake. Fasitfiguren under viser også underboksene og Nei-pilene.",
        teknisk: "Felle (H2022 10.2, H2024 33): dårlig spredning og stor uvisshet gir «Nei» i punkt 1, mens budsjett og restrisiko gir «Nei» i punkt 2. «Må først gjennomføre OSINT» er et feil svaralternativ i begge."
      }
    }, { instant: false });
  }

  /* ---------- STRIDE på Kantinekortet ---------- */
  var STRIDE = {
    S: { en: "Spoofing", no: "identitetstyveri / forfalskning", mal: "autentisitet", tiltak: "MFA eller passnøkkel på admin",
      ex: "Angriperen logger inn som kantinesjefen med et lekket passord.", el: ["admin", "f-admin"] },
    T: { en: "Tampering", no: "tukling", mal: "integritet", tiltak: "Tjeneren sjekker beløpet mot betalingskvitteringen",
      ex: "En student endrer belop=50 til belop=500 i påfyllingskallet.", el: ["f-app", "f-bet"] },
    R: { en: "Repudiation", no: "benekting", mal: "sporbarhet / ubenektelighet", tiltak: "Logg som ikke kan endres, per adminhandling",
      ex: "Kantinesjefen gir seg selv kreditt og sier «det var ikke meg».", el: ["admin", "api"] },
    I: { en: "Information disclosure", no: "datalekkasje", mal: "konfidensialitet", tiltak: "Tilgangskontroll per bruker og færre felt i svaret",
      ex: "API-et returnerer alle kortnumrene i /api/kort.", el: ["api", "db"] },
    D: { en: "Denial of service", no: "tjenestenekt", mal: "tilgjengelighet", tiltak: "Rate-begrensning",
      ex: "En bot sender 10 000 påfyllingsforsøk i minuttet i lunsjen.", el: ["f-app", "api"] },
    E: { en: "Elevation of privilege", no: "utvidede tilganger", mal: "autorisasjon / tilgangskontroll", tiltak: "Tjeneren sjekker rollen ved hvert kall",
      ex: "En vanlig bruker kaller /admin/saldo fordi bare menyen skjuler lenken.", el: ["f-app", "api"] }
  };
  var ELEM = {
    app: "Mobilappen (studenten). Ekstern part utenfor tillitsgrensen.",
    admin: "Adminpanelet (kantinesjefen). Ekstern part med høye rettigheter.",
    api: "REST-API-et. Prosessen som tar imot alle kall og må sjekke alt på nytt.",
    db: "Databasen med saldo og kortnumre.",
    bet: "Betalingsleverandøren. Ekstern part.",
    "f-app": "Dataflyten app → API (påfylling og oppslag). Den krysser tillitsgrensen.",
    "f-admin": "Dataflyten admin → API.",
    "f-db": "Dataflyten API ↔ database.",
    "f-bet": "Dataflyten API ↔ betaling (kvittering for betalt beløp)."
  };
  function stride(host) {
    host = qsHost(host); if (!host) return;
    clear(host);
    var W = 640, H = 300;
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "rk-svg rk-dfd", role: "group", "aria-label": "Dataflytdiagram for Kantinekortet" });
    var defs = svg("defs", {}), mk = svg("marker", { id: "rk-sarr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
    mk.appendChild(svg("path", { d: "M0,0 L10,5 L0,10 z", class: "rk-arrowhead" })); defs.appendChild(mk); s.appendChild(defs);
    var parts = {};
    function hook(g, id) {
      parts[id] = g; g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
      g.addEventListener("click", function () { pickEl(id); });
      g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); pickEl(id); } });
    }
    function flow(id, d, lx, ly, txt) {
      var g = svg("g", { class: "rk-dflow", "aria-label": txt });
      g.appendChild(svg("path", { d: d, class: "rk-dflow-hit" }));
      g.appendChild(svg("path", { d: d, class: "rk-dflow-line", "marker-end": "url(#rk-sarr)", "marker-start": "url(#rk-sarr)" }));
      g.appendChild(svg("text", { x: lx, y: ly, "text-anchor": "middle", class: "rk-flowlbl" }, txt));
      hook(g, id); s.appendChild(g);
    }
    function ext(id, x, y, w, h, t1, t2) {
      var g = svg("g", { class: "rk-delm rk-ext", "aria-label": t1 });
      g.appendChild(svg("rect", { x: x, y: y, width: w, height: h }));
      g.appendChild(svg("text", { x: x + w / 2, y: y + h / 2 - 2, "text-anchor": "middle" }, t1));
      if (t2) g.appendChild(svg("text", { x: x + w / 2, y: y + h / 2 + 14, "text-anchor": "middle", class: "rk-sub-t" }, t2));
      hook(g, id); s.appendChild(g);
    }
    // Tillitsgrense
    s.appendChild(svg("line", { x1: 182, y1: 10, x2: 182, y2: 290, class: "rk-trust" }));
    s.appendChild(svg("text", { x: 188, y: 24, class: "rk-trust-l" }, "tillitsgrense"));
    // Flyter (tegnes først)
    flow("f-app", "M150,85 L246,135", 196, 96, "påfylling");
    flow("f-admin", "M150,215 L246,170", 196, 212, "adminkall");
    flow("f-db", "M354,130 L440,82", 400, 92, "saldo");
    flow("f-bet", "M354,170 L440,214", 400, 210, "betaling");
    // Elementer
    ext("app", 14, 60, 136, 50, "Mobilapp", "student");
    ext("admin", 14, 190, 136, 50, "Adminpanel", "kantinesjef");
    var gp = svg("g", { class: "rk-delm rk-proc-c", "aria-label": "REST-API" });
    gp.appendChild(svg("circle", { cx: 300, cy: 150, r: 56 }));
    gp.appendChild(svg("text", { x: 300, y: 155, "text-anchor": "middle" }, "REST-API"));
    hook(gp, "api"); s.appendChild(gp);
    var gd = svg("g", { class: "rk-delm rk-store", "aria-label": "Database" });
    gd.appendChild(svg("rect", { x: 440, y: 50, width: 180, height: 44, class: "rk-hit" }));
    gd.appendChild(svg("line", { x1: 440, y1: 50, x2: 620, y2: 50 }));
    gd.appendChild(svg("line", { x1: 440, y1: 94, x2: 620, y2: 94 }));
    gd.appendChild(svg("text", { x: 530, y: 77, "text-anchor": "middle" }, "Database (saldo, kortnr.)"));
    hook(gd, "db"); s.appendChild(gd);
    ext("bet", 440, 192, 180, 48, "Betalingsleverandør");
    host.appendChild(el("div", { class: "rk-svgwrap" }, [s]));

    var letters = el("div", { class: "rk-letters", role: "group", "aria-label": "STRIDE-bokstaver" });
    var lb = {};
    "STRIDE".split("").forEach(function (L) {
      var b = el("button", { type: "button", class: "btn rk-letter", html: "<b>" + L + "</b> <span class=\"small\">" + STRIDE[L].en + "</span>", onclick: function () { pickL(L); } });
      lb[L] = b; letters.appendChild(b);
    });
    host.appendChild(letters);
    var info = el("div", { class: "rk-info", "aria-live": "polite" });
    host.appendChild(info);
    function mark(elIds, Ls) {
      Object.keys(parts).forEach(function (k) { parts[k].classList.toggle("is-sel", elIds.indexOf(k) >= 0); });
      Object.keys(lb).forEach(function (k) { lb[k].classList.toggle("is-on", Ls.indexOf(k) >= 0); lb[k].setAttribute("aria-pressed", Ls.indexOf(k) >= 0 ? "true" : "false"); });
    }
    function rowHtml(L) {
      var x = STRIDE[L];
      return "<li><b>" + L + " – " + x.en + "</b> (" + x.no + ") bryter <b>" + x.mal + "</b>. " + x.ex + " <i>Tiltak:</i> " + x.tiltak + ".</li>";
    }
    function pickEl(id) {
      var Ls = "STRIDE".split("").filter(function (L) { return STRIDE[L].el.indexOf(id) >= 0; });
      mark([id], Ls);
      info.innerHTML = "<p>" + ELEM[id] + "</p>" + (Ls.length ? "<ul class=\"small\">" + Ls.map(rowHtml).join("") + "</ul>" :
        "<p class=\"small muted\">Ingen av eksempeltruslene i tabellen er knyttet hit, men elementet kan likevel ha trusler. Gå gjennom alle seks bokstavene.</p>");
    }
    function pickL(L) {
      mark(STRIDE[L].el, [L]);
      info.innerHTML = "<ul class=\"small\">" + rowHtml(L) + "</ul><p class=\"small muted\">Elementene der trusselen ligger, er markert i figuren.</p>";
    }
    info.innerHTML = '<p class="small muted">Klikk en boks, en pil eller en bokstav.</p>';
  }

  /* ---------- Klassifiser trusler etter STRIDE (IN.bucketTask) ---------- */
  var STRIDE_OPPG = [
    ["epost", "En e-post som ser ut til å komme fra daglig leder, ber regnskapsmedarbeideren betale en faktura", "S",
      "Avsenderen later som han er en annen. Det er forfalsket identitet, og det bryter autentisitet."],
    ["wifi", "Et falskt trådløst nett med samme navn som bakeriets lokker de ansatte til å koble seg på", "S",
      "Nettet utgir seg for å være et annet. Også det er spoofing."],
    ["ordre", "Noen endrer antallet i en ordre mens den er på vei mellom nettleseren og tjeneren", "T",
      "Uautorisert endring av data underveis er tukling, og det bryter integritet."],
    ["minne", "Et program endrer innholdet i minnet til en kjørende prosess", "T",
      "Endring av data i minnet er tukling, selv om det senere kan gi mer makt (H2022 4.2)."],
    ["kunde", "En kunde påstår at han aldri bestilte 40 kaker, og bakeriet har ingen logg som viser hvem som bestilte", "R",
      "Ingen kan bevise hvem som gjorde hva. Det er benekting, og det bryter sporbarhet og ubenektelighet."],
    ["logg", "En innbruddstyv sletter loggene for å skjule hva han gjorde", "R",
      "Formålet er å skjule hvem som gjorde hva, altså benekting. Selve slettingen er også tukling, så T godtas."],
    ["feilmld", "En feilmelding på nettsiden viser hele kundetabellen med adresser", "I",
      "Data havner hos noen som ikke skal se dem. Det er datalekkasje, og det bryter konfidensialitet."],
    ["backup", "En ukryptert minnepinne med sikkerhetskopien blir borte på bussen", "I",
      "Kopien kan leses av den som finner den. Det bryter konfidensialitet."],
    ["flom", "Tusenvis av falske bestillinger i minuttet gjør at nettbutikken stopper", "D",
      "Tjenesten blir utilgjengelig for ekte kunder. Det er tjenestenekt."],
    ["syn", "En SYN-flom fyller opp tilkoblingstabellen til tjeneren", "D",
      "Halvåpne tilkoblinger tar opp ressursene, og tjenesten stopper. Det bryter tilgjengelighet."],
    ["admin", "En bedriftskunde skriver adressen til adminsiden direkte og får åpnet den", "E",
      "Kunden får tilgang han ikke er autorisert for, fordi tjeneren ikke sjekker rollen. Det bryter tilgangskontrollen."],
    ["rett", "En vanlig ansatt gir seg selv administratorrettigheter gjennom en feil i kassaprogrammet", "E",
      "Mer makt enn policyen gir, altså utvidede tilganger."]
  ];
  function strideSort(host) {
    host = qsHost(host); if (!host || !IN.bucketTask) return null;
    var answer = {}, items = STRIDE_OPPG.map(function (x) { answer[x[0]] = x[2]; return { id: x[0], html: x[1], forklaring: x[3] }; });
    return IN.bucketTask(host, {
      id: "risiko-stride-bucket",
      opphav: OPPHAV.strideSort,
      prompt: {
        eli5: "Hver av disse er en måte noen kan lage trøbbel for Smuldre på. Legg hver av dem i den STRIDE-bokstaven som passer best.",
        normal: "Klassifiser hver trussel mot Smuldre Bakeri i STRIDE-kategorien som passer best.",
        teknisk: "Klassifiser truslene etter STRIDE. Spør hva angriperen oppnår: falsk identitet, endrede data, umulig å bevise hvem, lekkede data, stanset tjeneste eller mer makt."
      },
      zones: "STRIDE".split("").map(function (L) { return { id: L, label: "<b>" + L + "</b> " + STRIDE[L].en, hint: STRIDE[L].no }; }),
      items: items,
      answer: answer,
      godta: { logg: ["T"] },
      oppsummering: {
        eli5: "To trusler per bokstav. Spør deg selv hva den slemme personen får til.",
        normal: "Hver bokstav bryter sitt mål: S autentisitet, T integritet, R sporbarhet, I konfidensialitet, D tilgjengelighet og E tilgangskontroll. Det er nettopp det H2025 31 spør om.",
        teknisk: "Grensetilfeller: sletting av logger er både T og R (formålet avgjør), og minneendring er T selv om den kan føre til E (H2022 4.2)."
      }
    }, { instant: false });
  }

  /* ---------- Livssyklus: rekkefølge og aktiviteter (IN.sortTask, IN.bucketTask) ---------- */
  var FASER = [
    ["opplaering", "Opplæring", "Utviklerne lærer sikker koding og vanlige sårbarheter.", "Den kommer før kravene: folk må kunne sikkerhet før de kan stille krav."],
    ["krav", "Krav", "Sikkerhetskrav og risikovurdering.", "Man må vite hva systemet skal tåle før det kan tegnes."],
    ["design", "Design", "Trusselmodellering med STRIDE og vurdering av angrepsflaten.", "Feil i tegningen er billigst å rette før noe er kodet."],
    ["koding", "Koding", "Statisk analyse og kodegjennomgang.", "Koden skrives etter designet og leses mens den skrives."],
    ["test", "Test", "Finne sårbarheter som slapp gjennom design og koding: fuzzing og pentest.", "Programmet må finnes før det kan kjøres og angripes."],
    ["prod", "Produksjonssetting", "Rutiner for patching og hendelseshåndtering.", "Rutinene må være klare idet systemet går i drift."],
    ["forv", "Forvaltning", "Drift, oppdateringer og respons på hendelser.", "Siste fase varer så lenge systemet er i bruk."]
  ];
  function livssyklus(host) {
    host = qsHost(host); if (!host || !IN.sortTask) return null;
    return IN.sortTask(host, {
      id: "risiko-livssyklus-sort",
      prompt: {
        eli5: "Et program bygges i sju steg, og sikkerheten skal være med i alle. Sett stegene i riktig rekkefølge.",
        normal: "Sett de 7 fasene i innebygd informasjonssikkerhet i riktig rekkefølge (H2021 9.1).",
        teknisk: "Ordne fasene i den sikre utviklingslivssyklusen, fra før første kodelinje til drift."
      },
      items: FASER.map(function (f, i) {
        return { id: f[0], html: f[1], forklaring: "Fase " + (i + 1) + ". " + f[2] + " " + f[3] };
      }),
      answer: FASER.map(function (f) { return f[0]; }),
      oppsummering: {
        eli5: "Lær først, så bestem hva programmet skal tåle, så tegn, skriv, test, sett i drift og pass på det.",
        normal: "Opplæring → krav → design → koding → test → produksjonssetting → forvaltning. DevSecOps dekker fasene fra krav til forvaltning, men ikke opplæring (H2022 4.1).",
        teknisk: "«Shift left» betyr å flytte sikkerheten tidlig i tidslinjen, mot krav og design. Sikker smidig legger sikkerhetskrav inn i hver sprint. Verken den eller DevSecOps dekker opplæring."
      },
      opphav: OPPHAV.livssyklus
    }, { instant: false });
  }
  var AKTIVITETER = [
    ["kurs", "Kurs i sikker koding for utviklerne", "opplaering", "Kurset gir utviklerne kunnskapen før prosjektet starter. Det er opplæring, som DevSecOps ikke dekker."],
    ["skrav", "Skrive ned sikkerhetskrav til påfyllingen", "krav", "Å bestemme hva løsningen skal tåle, er kravfasen. Ingenting er tegnet eller kodet ennå."],
    ["trussel", "Trusselmodellering med STRIDE på dataflytdiagrammet", "design", "Dataflytdiagrammet er tegningen av løsningen. STRIDE brukes på tegningen, altså i design."],
    ["flate", "Vurdere angrepsflaten før noe er kodet", "design", "«Før noe er kodet» peker på design: man ser på hvilke innganger løsningen får, ut fra tegningen."],
    ["statisk", "Statisk analyse av kildekoden", "koding", "Statisk analyse leser koden uten å kjøre den, så den hører til koding. Felle: det er ikke test."],
    ["review", "Kodegjennomgang før innsjekk", "koding", "En kollega leser koden før den sjekkes inn. Koden leses mens den skrives, så det er koding."],
    ["fuzz", "Fuzzing av API-et", "test", "Fuzzing kjører programmet og sender det tilfeldig eller ødelagt input. Programmet kjøres, så det er test."],
    ["pentest", "Avtalt pentest før lansering", "test", "Pentesteren angriper det ferdige programmet før det lanseres. Det er test, ikke drift."],
    ["patch", "Lage rutiner for patching og hendelseshåndtering", "prod", "Rutinene lages idet systemet settes i drift, altså i produksjonssettingen. Å bruke dem senere er forvaltning (H2022 4.1)."],
    ["drift", "Rulle ut oppdateringer i drift", "forv", "Systemet er allerede i bruk, og oppdateringene rulles ut etter rutinene. Det er forvaltning."]
  ];
  function livssyklusAkt(host) {
    host = qsHost(host); if (!host || !IN.bucketTask) return null;
    var navn = {}, fork = {};
    FASER.forEach(function (f) { navn[f[0]] = f[1]; fork[f[0]] = f[2]; });
    var answer = {};
    return IN.bucketTask(host, {
      id: "risiko-livssyklus-akt",
      prompt: {
        eli5: "Hvert arbeid hører til et av de sju stegene. Legg det der det skjer.",
        normal: "Legg hver aktivitet i fasen den hører til (som H2022 4.1).",
        teknisk: "Plasser aktivitetene i livssyklusen. Skill mellom å lese koden (koding) og å kjøre programmet (test)."
      },
      zones: FASER.map(function (f) { return { id: f[0], label: f[1] }; }),
      items: AKTIVITETER.map(function (a) { answer[a[0]] = a[2]; return { id: a[0], html: a[1], forklaring: a[3] }; }),
      answer: answer,
      oppsummering: "Felle: statisk analyse hører til koding, ikke test. Rutiner for patching og hendelseshåndtering lages i produksjonssettingen (H2022 4.1).",
      opphav: OPPHAV.livssyklusAkt
    }, { instant: false });
  }

  /* ---------- CMMI-nivåene i rekkefølge (IN.sortTask) ---------- */
  var CMMI = [
    ["Fraværende", "Brannslukking og kaos, ingen tiltak før noe går galt", "Smuldre hadde vært her hvis ingen tenkte på sikkerhet i det hele tatt."],
    ["Initiell", "Tilfeldige tiltak", "Smuldre i dag: noen har antivirus, noen tar backup, men ingen har bestemt det."],
    ["Ledet", "Noen risikovurderinger gjøres", "Smuldre vurderer risikoen for nettbutikken før julesalget, men ikke resten."],
    ["Definert", "Ledelsesforankring og policyer", "Daglig leder vedtar policy for oppdatering, egen innlogging og nattlig frakoblet backup."],
    ["Kvantifisert", "Helhetlig risikostyring", "Alle risikoene vurderes etter samme skala, med akseptgrense og tiltak som følges opp."],
    ["Optimaliserende", "Sikkerheten måles og forbedres jevnlig", "Smuldre måler for eksempel tiden fra en sårbarhet er kjent til den er patchet, og forbedrer rutinen."]
  ];
  function cmmi(host) {
    host = qsHost(host); if (!host || !IN.sortTask) return null;
    return IN.sortTask(host, {
      id: "risiko-cmmi-sort",
      prompt: {
        eli5: "Hvor flinke er bakeriet til sikkerhet? Sorter trinnene fra «helt uten» øverst til «best» nederst.",
        normal: "Sorter CMMI-nivåene for sikkerhetsmodenhet fra lavest (0) øverst til høyest (5) nederst.",
        teknisk: "Ordne modenhetsnivåene 0–5 (ism s. 36). H2021 8.3 spurte om nivåene for ledelsesforankring og helhetlig risikostyring."
      },
      items: CMMI.map(function (c, i) {
        return { id: "n" + i, html: c[1], forklaring: "Nivå " + i + " " + c[0] + ". " + c[2] };
      }),
      answer: CMMI.map(function (c, i) { return "n" + i; }),
      oppsummering: {
        eli5: "Smuldre er på trinn 1 i dag. Med regler fra sjefen kommer de til trinn 3.",
        normal: "0 fraværende, 1 initiell, 2 ledet, 3 definert, 4 kvantifisert, 5 optimaliserende. Smuldre er på nivå 1 i dag. Policy og ledelsesforankring gir nivå 3, helhetlig risikostyring nivå 4.",
        teknisk: "Felle: «tilfeldige tiltak» er nivå 1, ikke 0. Nivå 0 er brannslukking uten tiltak. Ledelsesforankring er det som skiller nivå 3 fra nivå 2 (H2021 8.3)."
      },
      opphav: OPPHAV.cmmi
    }, { instant: false });
  }

  /* ---------- Risikotrekant ---------- */
  function trekant(host) {
    host = qsHost(host); if (!host) return;
    clear(host);
    var on = { v: true, t: true, s: true };
    var H = { v: ["Verdier", "driftskontoen og betalingsrutinen", "ingen penger å stjele"],
              t: ["Trusler", "svindleren som sender falske fakturaer", "ingen som prøver svindel"],
              s: ["Sårbarheter", "ingen rutine for å bekrefte nytt kontonummer", "bekreftelsesrutinen er innført"] };
    var P = { v: [160, 32], t: [44, 222], s: [276, 222] };
    /* Navnet står utenfor sirkelen (Sårbarheter er for langt til å stå inni), sirkelen viser på/av med tegn og tekst */
    var NAVN = { v: { x: 190, y: 37, a: "start" }, t: { x: 44, y: 266, a: "middle" }, s: { x: 276, y: 266, a: "middle" } };
    var svgN = svg("svg", { viewBox: "0 0 320 278", class: "rk-svg rk-tri", role: "group", "aria-label": "Risikotrekanten. Hvert hjørne er en av/på-knapp." });
    var tri = svg("polygon", { points: [P.v, P.t, P.s].map(function (p) { return p.join(","); }).join(" "), class: "rk-tri-p" });
    svgN.appendChild(tri);
    var mid = svg("text", { x: 160, y: 160, "text-anchor": "middle", class: "rk-tri-mid" }, "RISIKO");
    svgN.appendChild(mid);
    var gs = {}, paa = {};
    Object.keys(P).forEach(function (k) {
      var g = svg("g", { class: "rk-corner", tabindex: "0", role: "button", "aria-pressed": "true", "aria-label": H[k][0] });
      g.appendChild(svg("circle", { cx: P[k][0], cy: P[k][1], r: 22 }));
      paa[k] = svg("text", { x: P[k][0], y: P[k][1] + 4, "text-anchor": "middle", class: "rk-corner-paa" }, "✓ på");
      g.appendChild(paa[k]);
      g.appendChild(svg("text", { x: NAVN[k].x, y: NAVN[k].y, "text-anchor": NAVN[k].a, class: "rk-corner-navn" }, H[k][0]));
      g.addEventListener("click", function () { on[k] = !on[k]; paint(); });
      g.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); on[k] = !on[k]; paint(); } });
      gs[k] = g; svgN.appendChild(g);
    });
    var info = el("div", { class: "rk-info", "aria-live": "polite" });
    /* Klikkbart område: stiplet ramme og hint (mønster: KR.bitflipp, .kr-klikkrad / .kr-klikkhint) */
    host.appendChild(el("div", { class: "rk-svgwrap rk-narrow rk-klikkrad" }, [
      el("p", { class: "rk-klikkhint", text: "Klikk et hjørne for å slå det av eller på" }), svgN]));
    host.appendChild(info);
    function paint() {
      var all = on.v && on.t && on.s;
      Object.keys(gs).forEach(function (k) {
        gs[k].classList.toggle("is-off", !on[k]);
        gs[k].setAttribute("aria-pressed", on[k] ? "true" : "false");
        paa[k].textContent = on[k] ? "✓ på" : "✗ av";
      });
      mid.setAttribute("class", "rk-tri-mid" + (all ? "" : " is-off"));
      info.innerHTML = "<ul class=\"small\">" + Object.keys(H).map(function (k) {
        return "<li><b>" + H[k][0] + ":</b> " + (on[k] ? H[k][1] : "<s>" + H[k][1] + "</s> → " + H[k][2]) + "</li>";
      }).join("") + "</ul><p>" + (all ? "Alle tre hjørnene finnes, så risikoen R2 «fakturasvindel» er der." :
        "Minst ett hjørne mangler, så risikoen forsvinner. Det er derfor tiltak mot sårbarheter virker.") + "</p>";
    }
    paint();
  }

  /* ---------- ISO 27002-domener ---------- */
  function domener(host) {
    host = qsHost(host); if (!host) return;
    clear(host);
    var D = [["Organisatoriske", 37, "5.x"], ["Personell", 8, "6.x"], ["Fysiske", 14, "7.x"], ["Teknologiske", 34, "8.x"]];
    var tot = D.reduce(function (a, d) { return a + d[1]; }, 0);
    var bar = el("div", { class: "rk-stack", role: "img", "aria-label": "ISO 27002: " + D.map(function (d) { return d[0] + " " + d[1]; }).join(", ") + ", til sammen " + tot });
    D.forEach(function (d, i) {
      bar.appendChild(el("div", { class: "rk-seg rk-seg" + i, style: "flex:" + d[1], title: d[0] + ": " + d[1], html: "<b>" + d[1] + "</b>" }));
    });
    host.appendChild(bar);
    host.appendChild(el("p", { class: "small", html: D.map(function (d, i) { return '<span class="rk-key rk-seg' + i + '"></span>' + d[0] + " (" + d[2] + ") " + d[1]; }).join(" · ") + " · til sammen <b>" + tot + "</b> tiltak" }));
  }

  /* Figur til øvingen ov-risiko-8 på 06-risiko.html: samme prosessfigur som H2023 38 (fig-h2023.js), med svarfelt. */
  IN.FIGURER = IN.FIGURER || {};
  IN.FIGURER["ov-risiko-8"] = function (h, o) {
    if (!IN.FIGURER["H2023-38"]) return;
    return IN.FIGURER["H2023-38"](h, o);
  };

  IN.risiko = {
    data: { risks: RISKS, tiltak: TILTAK, fasit: FASIT, faser: FASER, cmmi: CMMI, stride: STRIDE_OPPG },
    kontroll: kontroll, fmt: fmt, regn: REGN,
    matrise: matrise, kvalitativ: kvalitativ, kvantitativ: kvantitativ,
    regnRisiko: regnRisiko, regnRoi: regnRoi,
    prosess: prosess, prosessSort: prosessSort, ros: ros,
    stride: stride, strideSort: strideSort,
    livssyklus: livssyklus, livssyklusAkt: livssyklusAkt,
    cmmi: cmmi, trekant: trekant, domener: domener
  };
})();
