/* viz-dhfarge.js — Diffie–Hellman som fargeblanding (IN2120, blokk 2).
   IN.dhFarge(host): stegspiller med tre kolonner (Alice · det alle ser · Bob).
   Blanding = likt antall deler av hver farge (snitt i RGB). Rekkefølgen spiller ingen rolle,
   akkurat som (g^a)^b = (g^b)^a. Eve kan bare blande de offentlige bøttene, og det gir feil farge. */
(function () {
  "use strict";
  var IN = window.IN, el = IN.el;

  var GUL = { navn: "gul", hex: "#f5d90a" };
  var ALICE = [
    { navn: "oransje", hex: "#ff5a1f" }, { navn: "rød", hex: "#d7263d" },
    { navn: "lilla", hex: "#7b3fa0" }, { navn: "grønn", hex: "#2e9b4a" }
  ];
  var BOB = [
    { navn: "turkis", hex: "#3fc1c9" }, { navn: "blå", hex: "#2f6fd6" },
    { navn: "rosa", hex: "#e26fb0" }, { navn: "svart", hex: "#222222" }
  ];

  function rgb(hex) { return [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16); }); }
  function hex(c) { return "#" + c.map(function (v) { var s = Math.round(v).toString(16); return s.length < 2 ? "0" + s : s; }).join(""); }
  // Bøtte = liste av fargedeler. Blandingen er snittet av alle delene.
  function farge(deler) {
    var s = [0, 0, 0];
    deler.forEach(function (d) { var c = rgb(d.hex); s[0] += c[0]; s[1] += c[1]; s[2] += c[2]; });
    return hex(s.map(function (v) { return v / deler.length; }));
  }

  // Én bøtte som SVG (sylinder med farget innhold), med tekst under.
  function botte(fyll, tekst, opt) {
    opt = opt || {};
    var w = 64, h = 58, svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" aria-hidden="true">' +
      '<path d="M4 12 V44 A28 8 0 0 0 60 44 V12" fill="' + fyll + '" stroke="var(--color-on-surface)" stroke-width="1.5"/>' +
      '<ellipse cx="32" cy="12" rx="28" ry="8" fill="var(--color-surface-container-lowest)" stroke="var(--color-on-surface)" stroke-width="1.5"/>' +
      '<ellipse cx="32" cy="19" rx="25" ry="5" fill="' + fyll + '" opacity=".9"/></svg>';
    var b = el("div", { class: "dhf-b" + (opt.hemmelig ? " hemmelig" : "") + (opt.ny ? " ny" : "") + (opt.feil ? " feil" : "") });
    b.innerHTML = svg;
    b.appendChild(el("div", { class: "dhf-bt", html: tekst }));
    return b;
  }
  function pil(tekst) { return el("div", { class: "dhf-pil", html: tekst }); }

  function generate(inp) {
    var a = ALICE[+inp[0] || 0], b = BOB[+inp[1] || 0];
    var A = [GUL, a], B = [GUL, b], KA = [GUL, b, a], KB = [GUL, a, b], EVE = [GUL, a, GUL, b];
    var base = { a: a, b: b, A: A, B: B, KA: KA, KB: KB, EVE: EVE };
    var S = [
      { n: 1, tag: "Offentlig startfarge",
        text: {
          eli5: "Alice og Bob vil lage en hemmelig farge som bare de to kjenner, men alle kan se på. De starter med samme <b>gule</b> maling, og den vet alle om.",
          normal: "Alice og Bob blir enige om en felles startfarge, <b>gul</b>. Den er offentlig: Eve, som lytter på nettet, kjenner den også.",
          teknisk: "Offentlige parametre: primtallet p og generatoren g (gul). De sendes i klartekst og kan gjerne være kjent på forhånd." } },
      { n: 2, tag: "Hemmelige farger",
        text: {
          eli5: "Hver av dem velger en hemmelig farge som de ikke viser til noen: Alice tar " + a.navn + ", Bob tar " + b.navn + ".",
          normal: "Alice velger en privat farge (" + a.navn + ") og Bob en annen (" + b.navn + "). Disse forlater aldri maskinen deres.",
          teknisk: "Alice trekker et tilfeldig privat tall a og Bob et tilfeldig b. a og b sendes aldri. I TLS 1.3 lages nye a og b for hver økt (efemær DH)." } },
      { n: 3, tag: "Bland",
        text: {
          eli5: "Begge heller sin hemmelige farge oppi en bøtte gul maling og rører. Nå har hver sin blandingsbøtte.",
          normal: "Alice blander gul + " + a.navn + ", Bob blander gul + " + b.navn + ". Blandingen er lett å lage, men svært vanskelig å skille ad igjen.",
          teknisk: "Alice regner A = g<sup>a</sup> mod p, Bob regner B = g<sup>b</sup> mod p. Å gå baklengs fra A til a er det diskrete logaritmeproblemet." } },
      { n: 4, tag: "Bytt bøtter i full offentlighet",
        text: {
          eli5: "De sender blandingsbøttene til hverandre. Eve ser begge bøttene på veien, men hun ser ikke de hemmelige fargene.",
          normal: "Blandingene sendes over nettet. Eve ser gul og begge blandingene, men ikke " + a.navn + " eller " + b.navn + ".",
          teknisk: "A og B sendes i klartekst (i TLS 1.3 i key_share i ClientHello og ServerHello). Eve kjenner p, g, A og B." } },
      { n: 5, tag: "Bland inn din egen hemmelige farge",
        text: {
          eli5: "Alice heller sin " + a.navn + " oppi Bobs bøtte, og Bob heller sin " + b.navn + " oppi Alices bøtte. Se: de får <b>nøyaktig samme farge</b>!",
          normal: "Alice: (gul + " + b.navn + ") + " + a.navn + ". Bob: (gul + " + a.navn + ") + " + b.navn + ". Begge bøttene inneholder gul + " + a.navn + " + " + b.navn + ", bare blandet i ulik rekkefølge, og derfor blir fargen lik.",
          teknisk: "Alice regner B<sup>a</sup> = (g<sup>b</sup>)<sup>a</sup> mod p og Bob regner A<sup>b</sup> = (g<sup>a</sup>)<sup>b</sup> mod p. Begge får g<sup>ab</sup> mod p, den felles hemmeligheten som nøkler avledes fra." } },
      { n: 6, tag: "Hva kan Eve gjøre?",
        text: {
          eli5: "Eve prøver å helle de to bøttene hun så sammen. Men da får hun altfor mye gul, og fargen blir feil. For å få riktig farge måtte hun skilt ut den hemmelige fargen, og det går ikke.",
          normal: "Eve kan blande de offentlige bøttene, men da får hun gul to ganger og en annen farge enn Alice og Bob. Hun må få tak i én av de hemmelige fargene, og det er det vanskelige problemet. Men merk: ingenting her beviser <i>hvem</i> som sendte bøttene, så en mann-i-midten kan bytte dem (se demoen under).",
          teknisk: "A · B = g<sup>a+b</sup> ≠ g<sup>ab</sup>. Eve må løse diskret logaritme (eller Diffie–Hellman-problemet) for å få g<sup>ab</sup>. DH gir konfidensialitet mot passive avlyttere, men ingen autentisering: mot aktiv MitM må A og B signeres." } }
    ];
    return S.map(function (s) { for (var k in base) s[k] = base[k]; return s; });
  }

  function render(s, ctx) {
    var st = ctx.stage; IN.clear(st);
    var g = el("div", { class: "dhf" });
    var colA = el("div", { class: "dhf-col" }), colM = el("div", { class: "dhf-col dhf-mid" }), colB = el("div", { class: "dhf-col" });
    colA.appendChild(el("div", { class: "dhf-h", text: "Alice" }));
    colM.appendChild(el("div", { class: "dhf-h", html: "Offentlig <span class=\"muted\">(Eve ser alt her)</span>" }));
    colB.appendChild(el("div", { class: "dhf-h", text: "Bob" }));
    var n = s.n;

    colM.appendChild(botte(GUL.hex, "felles: gul", { ny: n === 1 }));
    if (n >= 2) {
      colA.appendChild(botte(s.a.hex, "hemmelig: " + s.a.navn, { hemmelig: true, ny: n === 2 }));
      colB.appendChild(botte(s.b.hex, "hemmelig: " + s.b.navn, { hemmelig: true, ny: n === 2 }));
    }
    if (n === 3) {
      colA.appendChild(botte(farge(s.A), "gul + " + s.a.navn, { ny: true }));
      colB.appendChild(botte(farge(s.B), "gul + " + s.b.navn, { ny: true }));
    }
    if (n >= 4) {
      var rad = el("div", { class: "dhf-rad" });
      rad.appendChild(botte(farge(s.A), "fra Alice: gul + " + s.a.navn, { ny: n === 4 }));
      rad.appendChild(botte(farge(s.B), "fra Bob: gul + " + s.b.navn, { ny: n === 4 }));
      colM.appendChild(rad);
      colM.appendChild(pil("Alice → Bob &nbsp;·&nbsp; Bob → Alice"));
    }
    if (n >= 5) {
      colA.appendChild(pil("+ " + s.a.navn + " i Bobs bøtte"));
      colA.appendChild(botte(farge(s.KA), "<b>felles hemmelighet</b>", { ny: n === 5 }));
      colB.appendChild(pil("+ " + s.b.navn + " i Alices bøtte"));
      colB.appendChild(botte(farge(s.KB), "<b>felles hemmelighet</b>", { ny: n === 5 }));
    }
    if (n >= 6) {
      colM.appendChild(pil("Eve blander de to offentlige bøttene"));
      colM.appendChild(botte(farge(s.EVE), "Eves gjetning: <b>feil farge</b>", { feil: true, ny: true }));
    }
    g.appendChild(colA); g.appendChild(colM); g.appendChild(colB);
    st.appendChild(g);
    if (n >= 5) st.appendChild(el("p", { class: "small dhf-ok", html: farge(s.KA) === farge(s.KB)
      ? "Alice og Bob har samme farge (" + farge(s.KA) + "), selv om ingen av dem noen gang sendte sin hemmelige farge."
      : "Fargene burde vært like." }));
  }

  IN.dhFarge = function (host) {
    host = typeof host === "string" ? IN.qs(host) : host; if (!host) return null;
    host.classList.add("dhf-host");
    var valg = [0, 0], api = null;
    var kontroll = el("div", { class: "dhf-valg" });
    function velgRad(navn, liste, i) {
      var r = el("div", { class: "dhf-vr", role: "group", "aria-label": navn + "s hemmelige farge" });
      r.appendChild(el("span", { class: "small", text: navn + "s hemmelige farge:" }));
      liste.forEach(function (f, k) {
        var b = el("button", { class: "dhf-sw", type: "button", title: f.navn, "aria-label": f.navn,
          "aria-pressed": k === 0 ? "true" : "false", style: "background:" + f.hex });
        b.addEventListener("click", function () {
          valg[i] = k;
          IN.qsa(".dhf-sw", r).forEach(function (x, j) { x.setAttribute("aria-pressed", j === k ? "true" : "false"); });
          if (api) { var at = api.index; api.setInput(valg); api.goto(at); }
        });
        r.appendChild(b);
      });
      return r;
    }
    kontroll.appendChild(velgRad("Alice", ALICE, 0));
    kontroll.appendChild(velgRad("Bob", BOB, 1));
    host.appendChild(kontroll);
    var spHost = el("div"); host.appendChild(spHost);
    api = IN.stepPlayer(spHost, { generate: generate, render: render, initial: [0, 0], customInput: false });
    return api;
  };

  // Selvtest: blandingen er uavhengig av rekkefølgen, og Eves blanding er ulik.
  IN.dhFarge.sjekk = function () {
    var ut = [];
    ALICE.forEach(function (a) { BOB.forEach(function (b) {
      ut.push({ navn: a.navn + "/" + b.navn, ok: farge([GUL, b, a]) === farge([GUL, a, b]) && farge([GUL, a, GUL, b]) !== farge([GUL, a, b]) });
    }); });
    return ut;
  };
})();
