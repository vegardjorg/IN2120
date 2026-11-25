/* ============================================================
   IN2120 guide · symboler.js  (mekanismen er kopiert via IN2090 fra IN2010-guiden 2026-11-25)
   Symbolordliste for forklaringer og kode (IN.SYMBOLER) +
   en skanner som finner symbolene i ren tekst (IN.SYMBOLER.scan).
   Lastes rett etter core.js. Selve verktøytipset (IN.symbolTips) ligger i core.js,
   og pseudocode.js bruker skanneren i tokenizeren.

   Ordlisten er TOM med vilje. Den fylles fra plan/vranglaere.md (kursets notasjon:
   kryptonotasjon som E_K(M), h(M), g^a mod p, ⊕) når notasjonen er verifisert mot lysarkene.
   Ikke legg inn symboler kurset ikke bruker.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});

  /* Hvert symbol: vis (slik det står i teksten), navn (kort), txt (én linje på kursnivå), eks (eksempel).
     Eksempel på formen (fylles senere):
       join: { vis: "⋈", navn: "naturlig join", txt: "…", eks: "…" } */
  var S = {};

  /* Enkelttegn → id i S, f.eks. { "⋈": "join", "σ": "select" }. */
  var CHAR = {};

  /* Mønstre som dekker flere tegn. Rekkefølgen teller (første treff på samme sted vinner).
     { id, re: /…/g, wrap?: 1 }  wrap = mønsteret har åpne/lukke-tegn med innhold mellom (f.eks. X⁺ har ikke det). */
  var MULTI = [];

  function escRe(c) { return c.replace(/[\\^$.*+?()[\]{}|\/-]/g, "\\$&"); }
  /* Hurtigtest: finnes det i det hele tatt et kandidattegn i teksten? Bygges fra CHAR og MULTI. */
  function anyRe() {
    var parts = Object.keys(CHAR).map(escRe);
    MULTI.forEach(function (p) { parts.push(p.re.source); });
    return parts.length ? new RegExp(parts.join("|")) : null;
  }
  var ANY = anyRe();

  /* scan(text) → [{ i, n, id, open?, close?, single? }] sortert, uten overlapp. */
  function scan(text) {
    if (!text || !ANY || !ANY.test(text)) return [];
    var hits = [];
    MULTI.forEach(function (p) {
      p.re.lastIndex = 0;
      var m;
      while ((m = p.re.exec(text)) !== null) {
        var h = { i: m.index, n: m[0].length, id: p.id };
        if (p.wrap) { h.open = 1; h.close = 1; }
        hits.push(h);
        if (!m[0].length) p.re.lastIndex++;
      }
    });
    for (var i = 0; i < text.length; i++) {
      var id = CHAR[text.charAt(i)];
      if (id) hits.push({ i: i, n: 1, id: id, single: 1 });
    }
    // Lengste/første treff vinner; enkelttegn inne i et mønster forkastes.
    hits.sort(function (a, b) { return a.i - b.i || b.n - a.n; });
    var out = [], end = -1;
    hits.forEach(function (h) {
      if (h.i < end) return;
      out.push(h); end = h.i + h.n;
    });
    return out;
  }

  /* Oppslag for et treff: { vis, navn, txt, eks }. */
  function entry(id) { return S[id] || null; }

  IN.SYMBOLER = { list: S, CHAR: CHAR, scan: scan, entry: entry };
})();
