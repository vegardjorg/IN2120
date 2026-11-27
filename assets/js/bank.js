/* ============================================================
   IN2120 guide · bank.js
   Eksamensbanken på blokksidene.

   IN.examBank(host, { block: "krypto" | ["iam","autentisering"], years?: ["H2024", …], tema?: "RSA",
                       typer?: ["M","F1"] (bare disse Inspera-typene) })
     Henter oppgavene fra window.IN_EXAM_BANK (filene i assets/js/eksamensbank/), nyeste år først,
     med årsfilter. Hvert kort (IN.examTask) har fanene Oppgave (oppgaveteksten, figuren via IN.insperaFig
     og Inspera-øvingen via IN.inspera med iKort), Løsning (IN.PERFEKT[key]) og Sensorveiledning (sensors
     fasit og retteinstrukser, ordrett). Statusbrikken viser Inspera-poengene (opts.insp = øvingens API).
     Dyplenker: #o-<key> (. → _) åpner kortet, også med &vis=losning|sensor|oppgave (eller &perfekt=1).
   IN.examBank.items(filter) → [{ ex, y, o }] på tvers av år (til eksamen.html).
   Format: plan/format.md. Klassisk script, lastes etter core.js og inspera.js.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;

  function num(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
  function yearKey(y) { var m = /^([HV])(\d{4})$/.exec(y || ""); return m ? +m[2] * 2 + (m[1] === "H" ? 1 : 0) : 0; }

  /* ---------- Eksamensbanken for én blokk ---------- */
  function collect(opts) {
    var bank = window.IN_EXAM_BANK || {}, blocks = [].concat(opts.block || []), out = [];
    Object.keys(bank).forEach(function (y) {
      var ex = bank[y];
      (ex.oppgaver || []).forEach(function (o) {
        if (blocks.length && blocks.indexOf(o.block) < 0) return;
        if (opts.years && opts.years.indexOf(ex.year || y) < 0) return;
        if (opts.typer && opts.typer.indexOf(o.inspera && o.inspera.type) < 0) return;
        if (opts.tema && !(o.tema || []).some(function (t) { return t.toLowerCase() === opts.tema.toLowerCase(); })) return;
        out.push({ ex: ex, y: ex.year || y, o: o });
      });
    });
    return out.sort(function (a, b) { return yearKey(b.y) - yearKey(a.y); });
  }

  IN.SPRAK_MERKNAD = "Settet ble gitt på engelsk, og teksten står ordrett. Fra H2020 er eksamen på norsk.";
  function oppgaveNode(x) {
    var o = x.o, wrap = el("div", { class: "bank-oppg" }), api = null;
    if (x.ex && x.ex.sprak === "engelsk" && !x.utenSprak) wrap.appendChild(el("p", { class: "bank-sprak small muted", text: IN.SPRAK_MERKNAD }));
    if (o.oppgave) { var t = el("div", { class: "bank-otekst" }); t.innerHTML = o.oppgave; wrap.appendChild(t); }
    if (IN.insperaFig) IN.insperaFig(wrap, o);
    if (o.inspera && IN.inspera) {
      var d = el("div", { class: "bank-insp" });
      wrap.appendChild(d);
      api = IN.inspera(d, o, { iKort: true });
    }
    return { node: wrap, insp: api };
  }
  /* Ett kort for { ex, y, o } inn i host */
  function card(host, x) {
    var o = x.o, data = {};
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) data[k] = o[k];
    data.id = "o-" + String(o.key).replace(/[^A-Za-z0-9_-]/g, "_");
    var on = oppgaveNode(x);
    data.oppgave = on.node;
    return IN.examTask(host, data, { insp: on.insp });
  }

  IN.examBank = function (host, opts) {
    if (typeof host === "string") host = IN.qs(host);
    if (!host) return null;
    opts = opts || {};
    var all = collect(opts);
    clear(host);
    if (!all.length) {
      host.appendChild(el("p", { class: "muted", text: "Ingen eksamensoppgaver i banken for denne blokken ennå." }));
      return null;
    }
    var years = [];
    all.forEach(function (x) { if (years.indexOf(x.y) < 0) years.push(x.y); });
    var pts = all.reduce(function (s, x) { return s + (+x.o.points || 0); }, 0);
    host.appendChild(el("p", { class: "bank-sum small", html: "<b>" + all.length + " oppgaver</b> fra " + years.length +
      (years.length === 1 ? " eksamen" : " eksamener") + " (" + years.join(", ") + "), til sammen " + num(pts) + " poeng." }));

    var bar = el("div", { class: "bank-years", role: "group", "aria-label": "Vis år" });
    var list = el("div", { class: "bank-list" });
    host.appendChild(bar); host.appendChild(list);
    var built = {};
    function paint(sel) {
      IN.qsa("button", bar).forEach(function (b) { b.setAttribute("aria-pressed", b._y === sel ? "true" : "false"); });
      IN.qsa(".bank-year", list).forEach(function (s) { s.hidden = sel !== "*" && s._y !== sel; });
    }
    [["*", "Alle år"]].concat(years.map(function (y) { return [y, y]; })).forEach(function (p) {
      var b = el("button", { class: "btn sm", type: "button", text: p[1], onclick: function () { paint(p[0]); } });
      b._y = p[0]; bar.appendChild(b);
    });

    years.forEach(function (y) {
      var items = all.filter(function (x) { return x.y === y; }), ex = items[0].ex;
      var sec = el("section", { class: "bank-year" }); sec._y = y;
      var meta = [ex.dato, ex.varighet].filter(Boolean).join(" · ");
      sec.appendChild(el("h3", { class: "bank-yh", html: y + (meta ? ' <span class="muted small">' + meta + "</span>" : "") }));
      var cards = el("div", { class: "bank-cards" });
      sec.appendChild(cards);
      items.forEach(function (x) { card(cards, x); });
      list.appendChild(sec);
      built[y] = true;
    });
    paint("*");

    // Dyplenke: #o-H2024-2_3 åpner kortet (&vis=<fane> / &perfekt=1 åpner fanen)
    var h = (location.hash || "").slice(1).split("&")[0], c = h && document.getElementById(h);
    if (c && c.tagName === "DETAILS" && host.contains(c)) {
      c.open = true;
      var vis = IN.examTabFromHash && IN.examTabFromHash(location.hash);
      if (vis && c._show && (c._tabs || []).indexOf(vis) >= 0) c._show(vis, false);
      setTimeout(function () { c.scrollIntoView({ block: "start" }); }, 0);
    }
    return { count: all.length, years: years };
  };

  /* Alle oppgaver på tvers av år, med samme filter (til eksamen.html). */
  IN.examBank.items = function (filter) { return collect(filter || {}); };
  /* Ett eksamenskort for { ex, y, o } (samme kort som på blokksidene). */
  IN.examBank.card = function (host, x) { return card(host, x); };
})();
