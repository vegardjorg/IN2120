/* blokkvekt.js — stolper for eksamensvekt øverst på blokksidene (IN2120).
   Finner <p class="blokk-vekt"> og legger til de samme stolpene som forsiden viser per blokk:
   poeng per år H2021–H2025 fra eksamensbanken, i samme skala som forsiden (høyeste år i alle blokker = full høyde).
   Lastes etter eksamensbank/*.js. Samme block → side-kobling som forside.js (BLOCK2PAGE). */
(function () {
  "use strict";
  var IN = window.IN, BANK = window.IN_EXAM_BANK || {};
  if (!IN || !IN.el) return;
  var BLOCK2PAGE = {
    generelt: "grunnbegreper", fysisk: "grunnbegreper", lov: "angrep",
    krypto: "krypto", pki: "pki", angrep: "angrep", pentest: "angrep", system: "system",
    risiko: "risiko", utvikling: "risiko", autentisering: "autentisering", iam: "iam",
    nettverk: "nettverk", cyberops: "cyberops", ki: "cyberops"
  };
  function yearKey(y) { var m = /^H(\d{4})$/.exec(y); return m ? +m[1] : 0; }
  function num(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }

  function bygg() {
    var host = document.querySelector(".blokk-vekt");
    var side = IN.pageId ? IN.pageId() : "";
    if (!host || !side) return;
    var YEARS = Object.keys(BANK).filter(function (y) { return yearKey(y) >= 2021; }).sort(function (a, b) { return yearKey(a) - yearKey(b); });
    if (!YEARS.length) return;
    var pts = {}, tot = {}, maks = 0;   // pts[side][år]
    YEARS.forEach(function (y) {
      (BANK[y].oppgaver || []).forEach(function (o) {
        var p = BLOCK2PAGE[o.block], v = +o.points || 0;
        tot[y] = (tot[y] || 0) + v;
        if (!p) return;
        pts[p] = pts[p] || {}; pts[p][y] = (pts[p][y] || 0) + v;
      });
    });
    Object.keys(pts).forEach(function (p) { YEARS.forEach(function (y) { maks = Math.max(maks, pts[p][y] || 0); }); });
    var mine = pts[side] || {};
    var spark = IN.el("span", { class: "bv-spark", role: "img",
      "aria-label": "Poeng per år: " + YEARS.map(function (y) {
        return y + " " + num(mine[y] || 0) + " p (" + Math.round((mine[y] || 0) / tot[y] * 100) + " %)";
      }).join(", ") });
    YEARS.forEach(function (y) {
      var v = mine[y] || 0, i = IN.el("i", { title: y + ": " + num(v) + " p, " + Math.round(v / tot[y] * 100) + " % av eksamen" });
      i.style.height = Math.max(v ? 8 : 0, Math.round(v / (maks || 1) * 100)) + "%";
      spark.appendChild(IN.el("span", { class: "bv-sparkc" }, [i, IN.el("b", { text: y.slice(3) })]));
    });
    host.appendChild(spark);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bygg); else bygg();
})();
