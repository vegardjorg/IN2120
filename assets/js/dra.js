/* ============================================================
   IN2120 guide · dra.js  (portert fra IN2090-guiden 2026-11-25; eies nå av 2120)
   Dra-og-slipp-øvinger: IN.dragTask(host, spec, opts) med tre innganger
     IN.sortTask   (host, spec, opts)  mode "sort":   sett brikkene i riktig rekkefølge
     IN.bucketTask (host, spec, opts)  mode "bucket": legg brikkene i riktig bøtte
     IN.matchTask  (host, spec, opts)  mode "match":  koble hver brikke til én plass (plass til én)
   Alle tre returnerer handle-en fra IN.dragTask (se nederst), eller null hvis spec mangler brikker.

   Bruk: «trykk og trykk» er hovedmåten. Trykk på en brikke (den blir valgt, aria-pressed), og trykk
   så på en bøtte eller en plass. Dra med Pointer Events kommer i tillegg (grepet ☰ har
   touch-action: none, så siden ellers kan rulles). Tastatur: Tab til brikken, Mellomrom/Enter velger,
   piltastene flytter målet (eller brikken ved sortering), Mellomrom/Enter slipper, Esc angrer.
   Alt+↑/↓ flytter direkte ved sortering. Hvert flytt meldes i en aria-live-region.

   Oppfører seg som IN.quiz/IN.tfTest i core.js: følger «Svar med en gang» (IN.svarStraks),
   har «Sjekk svar» og «↺ Nullstill», poenglinje, forklaring per brikke og kildelinje.

   spec: {
     id,                       lagringsnøkkel og fremdrifts-id (uten id: lagring med utledet id, ingen fremdrift)
     mode: "sort" | "bucket" | "match"   (settes av inngangene over)
     prompt: html | {eli5, normal, teknisk},
     render?: fn(node)         egen figur under oppgaveteksten
     items: [{ id, html | {eli5,normal,teknisk}, forklaring?: html | {eli5,normal,teknisk} }]
                               (explain er gammelt alias for forklaring)
     zones: [{ id, label: html, hint?: html }]          (bucket/match)
     answer: { itemId: zoneId } (bucket/match) | [itemId, …] (sort) | fn(spec) → et av dem,
     godta?: { itemId: [zoneId | plassindeks (0-basert, sort)] }   også godtatte plasser
     forklaring?: { itemId: html | nivåobjekt }   (alternativ til items[].forklaring; alias explain)
     oppsummering?: html | nivåobjekt   vises under knappene etter «Sjekk svar»
     regel?: { riktig: 1, feil: 0, blankt: 0, min: 0, maks: antall·riktig }
                               eksamensregel som i inspera.js: hver brikke gir riktig/feil/blankt,
                               alle riktige gir maks, summen kappes til [min, maks]. Summen vises.
     kilde?: { ref, egneOrd } | [...]  (samme form som i IN.quiz),
     poolLabel?: "Ikke plassert"
   }
   opts: { instant?: true/false (udefinert = global bryter), lock?, note?, side? (lagringsside),
           report?: fn(counts, poeng), result?: fn(counts) → html | node, shuffle?: false (sortering),
           onCheck?: fn({ counts, poeng }), checkLabel?, resetLabel?, cls? }
   report erstatter den innebygde fremdriftsrapporteringen. onCheck kalles i tillegg til den (og til
   report), hver gang oppgaven rapporteres: ved «Sjekk svar», og når alle brikker er plassert med
   «Svar med en gang» på. Ikke ved gjenoppretting fra lagring (bruk handle.checked() da).

   Etter «Sjekk svar» viser gale brikker «✗ → riktig plass». Et trykk (eller Mellomrom/Enter) på en gal brikke
   folder ut forklaringen i selve brikken (aria-expanded); et nytt trykk folder den sammen. Lista «Forklaring per
   brikke» er en lukket <details> under knappene (alle forklaringene, for den som vil lese dem samlet).
   Telleren øverst er bare fremdrift («3 av 6 plassert»). Resultatet står i én linje under knappene:
   «2 av 3 poeng · 2 riktig · 1 galt · 0 ubesvart» (uten regel: «2 av 3 riktig · 1 galt · 0 ubesvart»), og
   regelen i en lukket <details> «Slik retter øvingen». opts.checkLabel som begynner med «Sjekk» blir «Sjekk svar».
   Nivåbytte tegner oppgavetekst, brikker og forklaringer på nytt.

   Lagring: in2120:dra:<side>:<id>  { s: tilstand, c: sjekket, h: fingeravtrykk }. Uten spec.id utledes id fra
   host-id, ellers fra nærmeste forelder med id + «~» + løpenummer blant .dra der (bare lagring; fremdrift krever id).
   Fremdrift: IN.progress.solved("dra", id, poeng, maks) med regel, ellers (riktige, totalt).

   Handle: { el, check(), reset(), counts(), poeng() → {poeng, raa, maks, min} | null,
             checked() → bool   (sjekket; også etter gjenoppretting fra lagring, false etter reset),
             state(), place(id, zoneId|null), move(id, idx) }   (place/move er for tester)
   Rene funksjoner for node-tester: IN.dragTask.logic.{normalize, grade, skaar, …}.
   Klassisk script. Lastes etter core.js. Ingen DOM ved lasting.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var POOL = "__pool", uidN = 0;

  /* ---------------- Rene hjelpere (testbare uten DOM) ---------------- */
  function hash(s) {
    var h = 5381;
    s = String(s);
    for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  function rng(seed) {                       // mulberry32
    var a = parseInt(hash(seed), 36) >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(v) {
    if (v == null) return "";
    if (typeof v === "object" && !v.nodeType) return IN.level && IN.level.pick ? IN.level.pick(v) : (v.normal || "");
    return v;
  }
  function plainText(html) {
    return String(html == null ? "" : html).replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  }
  function num(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
  function sgn(x) { return (x > 0 ? "+" : x < 0 ? "−" : "±") + num(Math.abs(x)); }

  /* Normaliser spec: fasit (key) og godtatte alternativer (alt) per brikke. */
  function normalize(spec) {
    var mode = spec.mode === "sort" || spec.mode === "match" ? spec.mode : "bucket";
    var ex = spec.forklaring || spec.explain || {};
    var items = (spec.items || []).map(function (it) {
      var f = it.forklaring != null ? it.forklaring : it.explain != null ? it.explain : ex[it.id];
      return { id: String(it.id), html: it.html, explain: f == null ? "" : f };
    });
    var zones = mode === "sort" ? [] : (spec.zones || []).map(function (z) { return { id: String(z.id), label: z.label, hint: z.hint || null }; });
    var ans = typeof spec.answer === "function" ? spec.answer(spec) : spec.answer;
    var key = {}, alt = {};
    if (mode === "sort") {
      var ord = (ans || items.map(function (it) { return it.id; })).map(String);
      ord.forEach(function (id, i) { key[id] = i; });
    } else {
      items.forEach(function (it) { key[it.id] = ans && ans[it.id] != null ? String(ans[it.id]) : null; });
    }
    var g = spec.godta || {};
    Object.keys(g).forEach(function (id) {
      var a = [].concat(g[id]).filter(function (x) { return x != null; }).map(function (x) { return mode === "sort" ? +x : String(x); });
      if (a.length) alt[String(id)] = a;
    });
    return { mode: mode, items: items, zones: zones, key: key, alt: alt, id: String(spec.id || ""), regel: spec.regel || null };
  }
  function fingerprint(ns) {
    return hash(ns.mode + "|" + ns.items.map(function (it) { return it.id + "=" + JSON.stringify(it.html); }).join(";") + "|" +
      ns.zones.map(function (z) { return z.id + "=" + JSON.stringify(z.label); }).join(";") + "|" + JSON.stringify(ns.key) + "|" + JSON.stringify(ns.alt));
  }
  /* Startrekkefølge ved sortering: stokket med fast frø, og aldri lik fasiten. */
  function startOrder(ns, shuffle) {
    var ids = ns.items.map(function (it) { return it.id; });
    if (shuffle === false) return ids;
    var r = rng(ns.id + "|" + ids.join(",")), a = ids.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    var same = a.every(function (id, k) { return ns.key[id] === k; });
    if (same && a.length > 1) a.push(a.shift());
    return a;
  }
  function emptyState(ns, shuffle) {
    if (ns.mode === "sort") return { order: startOrder(ns, shuffle) };
    var p = {};
    ns.items.forEach(function (it) { p[it.id] = null; });
    return { place: p };
  }
  /* Gyldig lagret tilstand? (alle brikker kjent, gyldige bøtter, sortering = permutasjon) */
  function validState(ns, s) {
    if (!s || typeof s !== "object") return false;
    if (ns.mode === "sort") {
      if (!Array.isArray(s.order) || s.order.length !== ns.items.length) return false;
      return ns.items.every(function (it) { return s.order.indexOf(it.id) >= 0; });
    }
    if (!s.place || typeof s.place !== "object") return false;
    var zid = ns.zones.map(function (z) { return z.id; });
    return ns.items.every(function (it) { var v = s.place[it.id]; return v == null || zid.indexOf(v) >= 0; });
  }
  function valueOf(ns, s, id) {
    if (ns.mode === "sort") return s.order.indexOf(id);
    var v = s.place[id];
    return v == null ? null : v;
  }
  function isRight(ns, id, v) {
    if (v == null) return false;
    if (v === ns.key[id]) return true;
    return !!(ns.alt[id] && ns.alt[id].indexOf(v) >= 0);
  }
  /* Telling i samme form som answerSet: { right, wrong, blank, answered, total, detail } */
  function grade(ns, s) {
    var c = { right: 0, wrong: 0, blank: 0, answered: 0, total: ns.items.length, detail: [] };
    ns.items.forEach(function (it) {
      var v = valueOf(ns, s, it.id), ans = v != null && v !== -1, ok = ans && isRight(ns, it.id, v);
      c.detail.push({ id: it.id, answered: ans, value: ans ? v : undefined, right: ok });
      if (!ans) c.blank++;
      else { c.answered++; if (ok) c.right++; else c.wrong++; }
    });
    return c;
  }
  /* Eksamensregel (som inspera.js): riktig/feil/blankt per enhet, alle riktige gir maks,
     summen kappes til [min, maks]. regel = null gir null. */
  function skaar(c, regel) {
    if (!regel) return null;
    var rr = regel.riktig != null ? +regel.riktig : 1, rf = +regel.feil || 0, rb = +regel.blankt || 0;
    var maks = regel.maks != null ? +regel.maks : c.total * rr, min = regel.min != null ? +regel.min : 0;
    var p = c.right * rr + c.wrong * rf + c.blank * rb;
    if (c.total && c.right === c.total) p = Math.max(p, maks);
    var raa = p;
    p = Math.min(maks, Math.max(min, p));
    return { poeng: Math.round(p * 100) / 100, raa: Math.round(raa * 100) / 100, maks: maks, min: min, rr: rr, rf: rf, rb: rb };
  }
  function regelTekst(regel, enhet) {
    var s = skaar({ right: 0, wrong: 0, blank: 0, total: 0 }, regel);
    return "Slik retter øvingen: riktig " + sgn(s.rr) + ", galt " + (s.rf ? sgn(s.rf) : "0") + ", ubesvart " +
      (s.rb ? sgn(s.rb) : "0") + " per " + (enhet || "brikke") + ". Aldri under " + num(s.min) +
      (regel.maks != null ? ", høyst " + num(s.maks) : "") + " poeng.";
  }
  /* Regelteksten uten «Slik retter øvingen: » (den står i <summary>). */
  function regelUten(t) { t = String(t).replace(/^Slik retter øvingen:\s*/, ""); return t.charAt(0).toUpperCase() + t.slice(1); }
  /* B5: lagringsid uten spec.id: host-id, ellers nærmeste forelder med id + løpenummer blant øvingene der. */
  function autoId(host, node, sel) {
    if (host.id) { var j = Array.prototype.indexOf.call(host.querySelectorAll(sel), node); return j > 0 ? host.id + "~" + j : host.id; }
    for (var a = host.parentNode; a && a.nodeType === 1; a = a.parentNode) {
      if (a.id) { var i = Array.prototype.indexOf.call(a.querySelectorAll(sel), node); return i >= 0 ? a.id + "~" + i : null; }
    }
    return null;
  }
  /* Flytt i en rekkefølge: id til plass idx (etter at den er tatt ut). */
  function moveTo(order, id, idx) {
    var a = order.filter(function (x) { return x !== id; });
    idx = Math.max(0, Math.min(a.length, idx));
    a.splice(idx, 0, id);
    return a;
  }
  /* Legg brikke i bøtte. match: plass til én, den som lå der bytter plass med den nye. */
  function placeIn(ns, s, id, zone) {
    var p = {};
    Object.keys(s.place).forEach(function (k) { p[k] = s.place[k]; });
    var from = p[id] == null ? null : p[id];
    var to = zone === POOL ? null : zone;
    if (ns.mode === "match" && to != null) {
      Object.keys(p).forEach(function (k) { if (k !== id && p[k] === to) p[k] = from; });
    }
    p[id] = to;
    return { place: p };
  }

  /* ---------------- Komponenten ---------------- */
  IN.dragTask = function (host, spec, opts) {
    if (typeof host === "string") host = IN.qs ? IN.qs(host) : document.querySelector(host);
    if (!host || !spec || !spec.items || !spec.items.length) return null;
    if (host._draOff) host._draOff();
    while (host.firstChild) host.removeChild(host.firstChild);
    opts = opts || {};
    if (IN.stripSitat) IN.stripSitat(spec);
    var el = IN.el, ns = normalize(spec), mode = ns.mode, uid = "dra" + (++uidN);
    var follow = opts.instant == null;
    var side = opts.side || (IN.pageId ? IN.pageId() : "index");
    var storeKey = null;   // settes når wrap står i host (B5: id utledes fra host-id når spec.id mangler)
    var fp = fingerprint(ns);
    var st = emptyState(ns, opts.shuffle), checked = false, reported = false, open = {};
    var flyttet = false;   // sorteringsmodus: ✓/✗ underveis først etter første flytt (stokkingen alene røper ingenting)
    var sel = null, kb = null, target = null;   // kb: { from } når brikken er løftet med tastaturet
    var drag = null, suppressClick = false;
    var itemById = {}, zoneById = {};
    ns.items.forEach(function (it) { itemById[it.id] = it; });
    ns.zones.forEach(function (z) { zoneById[z.id] = z; });
    var poolLabel = spec.poolLabel || "Ikke plassert";

    function persist() { if (storeKey && IN.store) IN.store.set(storeKey, JSON.stringify({ s: st, c: checked, h: fp, m: flyttet })); }
    function instant() { return follow ? !!(IN.svarStraks && IN.svarStraks.get() && !(IN.svarStraks.laast && IN.svarStraks.laast())) : !!opts.instant; }
    function locked() { return !!(opts.lock && checked); }
    function counts() { return grade(ns, st); }
    function feedbackOn() { return checked || (instant() && (mode !== "sort" || flyttet)); }
    // I sorteringsmodus er alle linjene «plassert» fra start. Med svar med en gang ville riktig plass
    // («→ plass 4») for hver linje røpt hele svaret før du har flyttet noe. Der viser vi bare ✓/✗
    // underveis; fasitplassene og forklaringene kommer først ved «Sjekk svar».
    function revealKey() { return checked || mode !== "sort"; }
    function stateOf(id) {                    // "" | "right" | "wrong" | "blank"
      if (!feedbackOn()) return "";
      var v = valueOf(ns, st, id);
      if (v == null || v === -1) return checked ? "blank" : "";
      return isRight(ns, id, v) ? "right" : "wrong";
    }
    function zoneName(z) { return z === POOL || z == null ? poolLabel : plainText(zoneById[z] ? pick(zoneById[z].label) : z); }
    function keyText(id) {
      if (mode === "sort") {
        var k = "plass " + (ns.key[id] + 1);
        if (ns.alt[id]) k += " (også godtatt: " + ns.alt[id].map(function (x) { return "plass " + (x + 1); }).join(", ") + ")";
        return k;
      }
      var t = zoneName(ns.key[id]);
      if (ns.alt[id]) t += " (også godtatt: " + ns.alt[id].map(zoneName).join(", ") + ")";
      return t;
    }
    function itemText(id) { return plainText(pick(itemById[id].html)); }

    /* ---- Grunnstruktur ---- */
    var wrap = el("div", { class: "qz dra ov dra-" + mode + (opts.cls ? " " + opts.cls : "") });
    var live = el("span", { class: "qz-live", "aria-live": "polite" });
    function say(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }
    var head = el("div", { class: "qz-head" }), sw = null;
    if (follow) {
      sw = el("button", { class: "qz-switch qz-switch-lokal", type: "button", title: "Samme bryter som «Svar med en gang» øverst på siden", role: "switch", "aria-checked": "false",
        onclick: function () { if (IN.svarStraks.laast && IN.svarStraks.laast()) { if (typeof IN.svarStraks.onLaast === "function") IN.svarStraks.onLaast(sw); return; } IN.svarStraks.set(!instant()); } }, [
        el("span", { class: "qz-track", "aria-hidden": "true" }, el("span", { class: "qz-thumb" })),
        el("span", { text: "Svar med en gang" })]);
      head.appendChild(sw);
    } else if (opts.note) head.appendChild(el("span", { class: "qz-note", html: opts.note }));
    var score = el("span", { class: "qz-score" });
    head.appendChild(score);

    var promptEl = spec.prompt ? el("div", { class: "dra-prompt" }) : null;
    function paintPrompt() {
      if (!promptEl) return;
      var v = pick(spec.prompt);
      promptEl.innerHTML = "";
      if (v && v.nodeType) promptEl.appendChild(v); else promptEl.innerHTML = String(v);
      if (IN.symbolTips) IN.symbolTips(promptEl);
    }
    paintPrompt();
    // B1: regelen står i en lukket <details> under resultatlinja
    var regelEl = ns.regel ? el("details", { class: "ov-regel-d" }, [el("summary", { text: "Slik retter øvingen" }),
      el("p", { class: "ov-regel", text: regelUten(regelTekst(ns.regel)) })]) : null;
    var extra = null;
    if (spec.render) { extra = el("div", { class: "dra-extra" }); try { spec.render(extra); } catch (e) { if (window.console) console.error("[dra] render", e); } }
    var hintId = uid + "-hint";
    // M6: to varianter av hjelpeteksten. Kort for berøring (.dra-hint-t), med dra og tastatur for mus
    // (.dra-hint-k). CSS velger etter pekeren (STIL nederst og ovelse.css). aria-describedby peker på
    // muse-/tastaturvarianten, som skjermlesere leser selv om den er skjult.
    var hint = el("div", { class: "dra-hint" }, [
      el("span", { class: "dra-hint-t", text: mode === "sort"
        ? "Trykk på en linje, så på plassen den skal til, eller bruk ↑ ↓."
        : "Trykk på en brikke, så på " + (mode === "match" ? "plassen" : "bøtta") + " den hører til." }),
      el("span", { class: "dra-hint-k", id: hintId, text: mode === "sort"
        ? "Klikk på en linje og så på plassen den skal til, eller dra den. Tastatur: Mellomrom løfter, ↑/↓ flytter, Mellomrom slipper, Esc angrer. Alt+↑/↓ flytter direkte."
        : "Klikk på en brikke og så på " + (mode === "match" ? "plassen" : "bøtta") + " den hører til, eller dra den. Tastatur: Mellomrom velger, piltastene velger " + (mode === "match" ? "plass" : "bøtte") + ", Mellomrom slipper, Esc angrer." })]);
    var board = el("div", { class: "dra-board" });

    /* ---- Brikker ---- */
    var chips = {};
    ns.items.forEach(function (it) {
      var mark = el("span", { class: "qz-mark", "aria-hidden": "true" });
      var fas = el("span", { class: "dra-fasit", hidden: true });
      var sr = el("span", { class: "qz-sr" });
      var pos = mode === "sort" ? el("span", { class: "dra-pos", "aria-hidden": "true" }) : null;
      var lbl = el("span", { class: "dra-lbl", html: pick(it.html) });
      // B3: forklaringen ligger i brikken og foldes ut med et trykk på en gal brikke etter «Sjekk svar»
      var xp = el("span", { class: "dra-chip-x", hidden: true });
      var b = el("button", { class: "dra-chip", type: "button", "aria-pressed": "false", "aria-describedby": hintId, "data-item": it.id }, [
        el("span", { class: "dra-grip", "aria-hidden": "true", text: "☰" }), pos, lbl,
        el("span", { class: "dra-valgt", "aria-hidden": "true", text: "Valgt" }), mark, fas, sr, xp].filter(Boolean));
      b._mark = mark; b._fas = fas; b._sr = sr; b._pos = pos; b._lbl = lbl; b._xp = xp; b._xpFilled = false;
      b.addEventListener("click", function () { onChipClick(it.id); });
      b.addEventListener("keydown", function (e) { onChipKey(e, it.id); });
      // Mellomrom aktiverer knapper på keyup. Vi har allerede håndtert tasten i keydown.
      b.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Spacebar") e.preventDefault(); });
      b.addEventListener("pointerdown", function (e) { onPointerDown(e, it.id, b); });
      chips[it.id] = b;
    });

    /* ---- Bøtter / plasser / liste ---- */
    var zoneEls = {}, zoneOrder = [], sortList = null;
    function mkZone(id, label, hintHtml, cls) {
      var cnt = el("span", { class: "dra-cnt" });
      var zl = el("span", { class: "dra-zlbl", html: pick(label) });
      var btn = el("button", { class: "dra-zbtn", type: "button", "data-dz": id },
        [zl, el("span", { class: "dra-here", "aria-hidden": "true", text: "Legg her" }), cnt]);
      btn.addEventListener("click", function (e) { e.stopPropagation(); onZoneClick(id); });
      var body = el("div", { class: "dra-zbody" });
      var empty = el("span", { class: "dra-empty", "aria-hidden": "true", text: id === POOL ? "Alle brikkene er plassert." : mode === "match" ? "Trykk for å plassere" : "Tom" });
      var zone = el("div", { class: "dra-zone " + cls, "data-dz": id }, [btn, hintHtml ? el("div", { class: "dra-zhint", html: pick(hintHtml) }) : null, body, empty].filter(Boolean));
      zone.addEventListener("click", function (e) {
        if (e.target.closest && e.target.closest(".dra-chip")) return;
        onZoneClick(id);
      });
      zone._btn = btn; zone._cnt = cnt; zone._body = body; zone._empty = empty; zone._label = plainText(pick(label));
      zoneEls[id] = zone; zoneOrder.push(id);
      return zone;
    }
    if (mode === "sort") {
      sortList = el("ol", { class: "dra-sortlist", "aria-label": "Rekkefølge" });
      // Med en valgt linje viser en strek (mus) hvor den havner hvis du klikker på linja du peker på.
      var clearPreview = function () {
        Array.prototype.forEach.call(sortList.children, function (li) { li.classList.remove("drop-before", "drop-after"); });
      };
      sortList.addEventListener("pointerover", function (e) {
        if (e.pointerType !== "mouse" || !sel || kb || drag || locked()) return;
        var li = e.target.closest && e.target.closest(".dra-row");
        clearPreview();
        if (!li || li.contains(chips[sel])) return;
        var over = li.querySelector(".dra-chip").getAttribute("data-item");
        li.classList.add(st.order.indexOf(over) < st.order.indexOf(sel) ? "drop-before" : "drop-after");
      });
      sortList.addEventListener("pointerleave", function () { if (!drag) clearPreview(); });
      sortList.addEventListener("click", function () { if (!drag) clearPreview(); });
      board.appendChild(sortList);
    } else {
      board.appendChild(mkZone(POOL, poolLabel, null, "dra-pool"));
      var zwrap = el("div", { class: mode === "match" ? "dra-slots" : "dra-zones" });
      ns.zones.forEach(function (z) { zwrap.appendChild(mkZone(z.id, z.label, z.hint, mode === "match" ? "dra-slot" : "dra-bucket")); });
      board.appendChild(zwrap);
    }

    /* ---- Forklaring per brikke ---- */
    var expList = el("ol", { class: "qz-list dra-exps" });
    var expDet = el("details", { class: "dra-exps-d", hidden: true }, [el("summary", { class: "dra-exphead", text: "Forklaring per brikke" }), expList]);
    var expRows = {};
    var expOrder = mode === "sort"
      ? ns.items.slice().sort(function (a, b) { return ns.key[a.id] - ns.key[b.id]; })
      : ns.items;
    expOrder.forEach(function (it, i) {
      var li = el("li", { class: "qz-item" });
      var num = el("span", { class: "qz-num", "aria-hidden": "true", text: i + 1 });
      var body = el("div", { class: "qz-body" });
      var pr = el("div", { class: "qz-prompt" });
      var exp = el("div", { class: "qz-exp", hidden: true });
      body.appendChild(el("div", { class: "dra-exprow" }, [pr]));
      body.appendChild(exp);
      li.appendChild(num); li.appendChild(body);
      expList.appendChild(li);
      expRows[it.id] = { li: li, num: num, pr: pr, exp: exp, filled: false, it: it };
    });
    function fillExp(r) {
      r.filled = true;
      r.exp.innerHTML = "";
      var v = pick(r.it.explain);
      if (v && v.nodeType) r.exp.appendChild(v);
      else if (v) r.exp.appendChild(el("div", { class: "qz-exp-txt", html: String(v) }));
      if (IN.symbolTips) IN.symbolTips(r.exp);
    }

    /* ---- Knapper, resultat, kilde ---- */
    // A2: primærknappen heter alltid «Sjekk svar» («Sjekk», «Sjekk plasseringen» o.l. fra kalleren normaliseres).
    var checkLabel = opts.checkLabel && !/^\s*sjekk\b/i.test(opts.checkLabel) ? opts.checkLabel : "Sjekk svar";
    var bCheck = el("button", { class: "btn primary", type: "button", text: checkLabel, onclick: function () { doCheck(); } });
    var bReset = el("button", { class: "btn", type: "button", text: opts.resetLabel || "↺ Nullstill", onclick: function () { doReset(); } });
    var foot = el("div", { class: "qz-foot" }, [bCheck, bReset]);
    var res = el("div", { class: "qz-result" });
    var refs = IN.kildeRefs && !spec.opphav ? IN.kildeRefs(spec.kilde) : null, kildeEl = null, fnEl = null;   // opphav erstatter kildelinja
    if (refs) {
      kildeEl = el("p", { class: "qz-kilde" }, "Kilde: ");
      refs.forEach(function (r, i) {
        if (i) kildeEl.appendChild(document.createTextNode("; "));
        kildeEl.appendChild(el("span", { title: r.vis !== r.ref ? r.ref : null, text: r.vis + (r.egneOrd ? " *" : "") }));
      });
      if (refs.some(function (r) { return r.egneOrd; })) fnEl = el("p", { class: "qz-kilde-fn", text: "* formulert med egne ord" });
    }
    /* ---- M7: klebrig linje nederst når en brikke er valgt og bøttene er utenfor skjermen ---- */
    var quick = null, quickT = null, quickB = null, quickRaf = null;
    if (mode !== "sort") {
      quickT = el("p", { class: "dra-quick-t" });
      quickB = el("div", { class: "dra-quick-b" });
      quick = el("div", { class: "dra-quick", role: "group", "aria-label": "Velg " + (mode === "match" ? "plass" : "bøtte"), hidden: true }, [quickT, quickB]);
      ns.zones.forEach(function (z) {
        var qb = el("button", { class: "btn sm", type: "button", "data-qz": z.id, html: pick(z.label) });
        qb.addEventListener("click", function () { onZoneClick(z.id); });
        quickB.appendChild(qb);
      });
      var qx = el("button", { class: "btn sm dra-quick-x", type: "button", text: "✕ Angre valget", onclick: function () { deselect("Valget er angret."); } });
      quickB.appendChild(qx);
    }
    function zonesVisible() {
      var h = window.innerHeight || document.documentElement.clientHeight;
      return ns.zones.some(function (z) {
        var r = zoneEls[z.id]._btn.getBoundingClientRect();
        return r.height > 0 && r.top >= 0 && r.bottom <= h;
      });
    }
    function paintQuick() {
      if (!quick) return;
      var on = !!sel && !locked() && !(drag && drag.on) && wrap.isConnected && !moveBarOn() && !zonesVisible();
      if (on) {
        quickT.innerHTML = "";
        quickT.appendChild(el("b", { text: "Valgt: " }));
        quickT.appendChild(document.createTextNode(itemText(sel) + " →"));
        Array.prototype.forEach.call(quickB.children, function (b) {
          var z = b.getAttribute("data-qz");
          if (z) b.classList.toggle("primary", st.place[sel] === z);
        });
      }
      quick.hidden = !on;
    }
    function onScrollQuick() {
      if (!quick || quickRaf) return;
      quickRaf = window.requestAnimationFrame(function () { quickRaf = null; paintQuick(); });
    }

    [head, spec.opphav && IN.opphavEl ? IN.opphavEl(spec.opphav) : null, promptEl, extra, hint, board, foot, res, regelEl, expDet, kildeEl, fnEl, quick, live].forEach(function (x) { if (x) wrap.appendChild(x); });
    host.appendChild(wrap);
    // B5: lagre også uten spec.id. Nøkkelen utledes fra host-id (eller nærmeste forelder med id + løpenummer).
    var lagId = spec.id ? String(spec.id) : autoId(host, wrap, ".dra");
    storeKey = lagId ? "in2120:dra:" + side + ":" + lagId : null;
    if (storeKey && IN.store) {
      try {
        var saved = JSON.parse(IN.store.get(storeKey, "null"));
        if (saved && saved.h === fp && validState(ns, saved.s)) { st = saved.s; checked = !!saved.c; flyttet = !!saved.m; }
      } catch (e) {}
    }

    /* ---------------- Tegning ---------------- */
    function paintChip(id) {
      var b = chips[id], s = stateOf(id), isSel = sel === id;
      b.className = "dra-chip" + (isSel ? " sel" : "") + (s === "right" ? " correct" : s === "wrong" ? " wrong" : "") +
        (drag && drag.id === id && drag.on ? " is-dragging" : "") + (kb && isSel ? " is-lifted" : "");
      b._mark.textContent = s === "right" ? "✓" : s === "wrong" ? "✗" : "";
      b.setAttribute("aria-pressed", isSel ? "true" : "false");
      b.disabled = locked();
      if (s === "wrong" && revealKey()) { b._fas.hidden = false; b._fas.textContent = "→ " + (mode === "sort" ? "plass " + (ns.key[id] + 1) : zoneName(ns.key[id])); }
      else { b._fas.hidden = true; b._fas.textContent = ""; }
      b._sr.textContent = s === "right" ? " Riktig." : s === "wrong" ? (revealKey() ? " Feil. Riktig: " + keyText(id) + "." : " Feil plass.") : "";
      var kanX = canExplain(id), xOpen = kanX && !!open[id];
      b.classList.toggle("har-x", kanX);
      b.classList.toggle("x-open", xOpen);
      if (kanX) b.setAttribute("aria-expanded", xOpen ? "true" : "false"); else b.removeAttribute("aria-expanded");
      if (xOpen && !b._xpFilled) {
        b._xpFilled = true;
        var v = pick(itemById[id].explain);
        b._xp.innerHTML = "";
        if (v && v.nodeType) b._xp.appendChild(v); else b._xp.innerHTML = String(v);
        if (IN.symbolTips) IN.symbolTips(b._xp);
      }
      b._xp.hidden = !xOpen;
    }
    /* Gal brikke etter «Sjekk svar» med forklaring: et trykk folder ut forklaringen i brikken. */
    function canExplain(id) { return checked && stateOf(id) === "wrong" && !!pick(itemById[id].explain); }
    function toggleX(id) {
      open[id] = !open[id];
      paint();
      say(open[id] ? "Forklaring: " + plainText(pick(itemById[id].explain)) : "Forklaringen er skjult.");
    }
    function paintBoard() {
      if (mode === "sort") {
        st.order.forEach(function (id, i) {
          var b = chips[id], li = b.parentNode && b.parentNode.tagName === "LI" ? b.parentNode : el("li", { class: "dra-row" });
          if (b.parentNode !== li) li.appendChild(b);
          li.className = "dra-row";
          if (sortList.children[i] !== li) sortList.insertBefore(li, sortList.children[i] || null);
          b._pos.textContent = String(i + 1);
          b.setAttribute("aria-label", (i + 1) + " av " + st.order.length + ": " + itemText(id));
        });
        return;
      }
      zoneOrder.forEach(function (z) {
        var zone = zoneEls[z], ids = ns.items.filter(function (it) { var v = st.place[it.id]; return z === POOL ? v == null : v === z; })
          .map(function (it) { return it.id; });
        // Flytt bare når innholdet faktisk er endret (å flytte en fokusert brikke tar fokuset bort).
        // «Flytt til»-raden kan ligge i bøtta: tell bare brikkene.
        var cur = Array.prototype.filter.call(zone._body.children, function (c) { return c.hasAttribute("data-item"); })
          .map(function (c) { return c.getAttribute("data-item"); });
        if (cur.join("\u0001") !== ids.join("\u0001")) ids.forEach(function (id) { zone._body.appendChild(chips[id]); });
        zone._cnt.textContent = String(ids.length);
        zone._empty.hidden = ids.length > 0;
        zone._btn.setAttribute("aria-label", zone._label + ", " + ids.length + (ids.length === 1 ? " brikke" : " brikker") + (sel ? ". Trykk for å legge " + itemText(sel) + " her." : ""));
        zone._btn.disabled = locked();
        var cls = "dra-zone " + (z === POOL ? "dra-pool" : mode === "match" ? "dra-slot" : "dra-bucket");
        if (sel && !locked()) cls += " can-drop" + (z === (st.place[sel] == null ? POOL : st.place[sel]) ? " is-home" : "");
        if (target === z) cls += " is-target";
        if (drag && drag.on && drag.over === z) cls += " is-over";
        zone.className = cls;
      });
    }
    function paintExp() {
      var any = false;
      expOrder.forEach(function (it) {
        var r = expRows[it.id], s = stateOf(it.id);
        var show = !!s && revealKey();
        r.li.hidden = !show;
        if (!show) return;
        any = true;
        r.li.className = "qz-item is-" + s;
        r.num.textContent = s === "right" ? "✓" : s === "wrong" ? "✗" : "–";
        var v = valueOf(ns, st, it.id);
        var du = v == null || v === -1 ? "ikke plassert" : mode === "sort" ? "plass " + (v + 1) : zoneName(v);
        r.pr.innerHTML = "";
        r.pr.appendChild(el("span", { class: "dra-explbl", html: pick(it.html) }));
        r.pr.appendChild(el("span", { class: "dra-expkey", text: " → " + keyText(it.id) }));
        if (s !== "right") r.pr.appendChild(el("span", { class: "dra-expdu", text: " (du: " + du + ")" }));
        var has = !!pick(it.explain);
        if (has && !r.filled) fillExp(r);
        r.exp.hidden = !has;
      });
      expDet.hidden = !any;
    }
    function poeng() { return skaar(counts(), ns.regel); }
    /* B1: telleren øverst er en ren fremdriftsteller. Resultatet står bare i resultatlinja under knappene. */
    function scoreHtml(c) {
      if (mode === "sort") return c.total + " linjer";
      return c.answered + " av " + c.total + " plassert";
    }
    /* «Flytt til»-raden under valgt brikke: ↑/↓ ved sortering, én knapp per bøtte ellers.
       Spart skrolling på mobil (bøttene ligger ofte under skjermkanten). Bare for trykk-valg,
       ikke når brikken er løftet med tastaturet (der styrer piltastene). Med flere enn MAX_BAR
       bøtter tar den klebrige linja nederst (M7) over. */
    var moveBar = el("div", { class: "dra-moveto", role: "group", "aria-label": "Flytt valgt brikke" });
    moveBar.addEventListener("click", function (e) { e.stopPropagation(); });
    var MAX_BAR = 8, noFocus = false;
    function mvBtn(k, text, label, disabled, fn) {
      return el("button", { class: "btn dra-mv", type: "button", "data-k": k, "aria-label": label || null, disabled: disabled || null,
        onclick: function () {
          var id = sel;
          if (!id) return;
          noFocus = true;
          try { fn(id); } finally { noFocus = false; }
          var again = moveBar.querySelector('[data-k="' + k + '"]:not(:disabled)');
          if (again && moveBar.isConnected) again.focus({ preventScroll: true });
          else if (mode !== "sort") focusNextPool();
          else if (chips[id]) chips[id].focus({ preventScroll: true });
        } }, text);
    }
    function focusNextPool() {
      var next = ns.items.filter(function (it) { return st.place[it.id] == null; })[0];
      if (next && chips[next.id] && !chips[next.id].disabled) chips[next.id].focus({ preventScroll: true });
    }
    function moveBarOn() { return !!sel && !kb && !locked() && !(drag && drag.on) && (mode === "sort" || ns.zones.length <= MAX_BAR); }
    function paintMoveBar() {
      if (!moveBarOn()) { if (moveBar.parentNode) moveBar.parentNode.removeChild(moveBar); return; }
      var id = sel, chip = chips[id], txt = itemText(id);
      while (moveBar.firstChild) moveBar.removeChild(moveBar.firstChild);
      if (mode === "sort") {
        var i = st.order.indexOf(id), n = st.order.length;
        moveBar.appendChild(mvBtn("opp", "↑ Opp", "Flytt " + txt + " opp", i === 0, function (x) { moveSort(x, st.order.indexOf(x) - 1, true); }));
        moveBar.appendChild(mvBtn("ned", "↓ Ned", "Flytt " + txt + " ned", i === n - 1, function (x) { moveSort(x, st.order.indexOf(x) + 1, true); }));
        moveBar.appendChild(mvBtn("ferdig", "Ferdig", null, false, function () { deselect(txt + " lagt på plass " + (st.order.indexOf(id) + 1) + "."); }));
        if (moveBar.parentNode !== chip.parentNode) chip.parentNode.appendChild(moveBar);
        return;
      }
      var cur = st.place[id] == null ? POOL : st.place[id];
      zoneOrder.forEach(function (z) {
        if (z === cur) return;
        moveBar.appendChild(mvBtn(z, (z === POOL ? "↩ " : "→ ") + zoneName(z), (z === POOL ? "Legg tilbake: " : "Legg i ") + zoneName(z), false,
          function (x) { place(x, z); }));
      });
      if (chip.nextSibling !== moveBar) chip.parentNode.insertBefore(moveBar, chip.nextSibling);
    }

    function paint() {
      if (sw) sw.setAttribute("aria-checked", instant() ? "true" : "false");
      paintBoard();
      paintMoveBar();
      ns.items.forEach(function (it) { paintChip(it.id); });
      paintExp();
      score.innerHTML = scoreHtml(counts());
      bCheck.disabled = locked();
      bReset.disabled = false;
      if (checked) paintResult();
      paintQuick();
    }

    /* ---------------- Handlinger ---------------- */
    function focusChip(id) {
      if (noFocus) return;   // «Flytt til»-knappene styrer fokus selv (og skal ikke rulle siden til bøtta)
      var ae = document.activeElement;
      var inside = !ae || wrap.contains(ae) || ae === document.body;
      if (inside && chips[id] && !chips[id].disabled) { try { chips[id].focus({ preventScroll: false }); } catch (e) { chips[id].focus(); } }
    }
    function flash(id) {
      var b = chips[id];
      b.classList.remove("dra-moved"); void b.offsetWidth; b.classList.add("dra-moved");
    }
    function afterMove(id, msg) {
      flyttet = true;
      persist();
      var s = stateOf(id);
      paint();
      flash(id);
      say(msg + (s === "right" ? " Riktig." : s === "wrong" ? (revealKey() ? " Feil. Riktig: " + keyText(id) + "." : " Feil plass.") : ""));
      var c = counts();
      if (instant() && !checked && !reported && c.answered === c.total && mode !== "sort") { reported = true; report(); }
    }
    function select(id, viaKb) {
      if (locked()) return;
      sel = id;
      if (viaKb) {
        kb = mode === "sort" ? { from: st.order.indexOf(id) } : { from: st.place[id] == null ? POOL : st.place[id] };
        target = mode === "sort" ? null : kb.from;
      } else { kb = null; target = null; }
      paint();
      say(itemText(id) + " valgt. " + (mode === "sort"
        ? (viaKb ? "Flytt med pil opp og ned, slipp med Mellomrom." : "Trykk på linja den skal ta plassen til, eller bruk Opp og Ned under den.")
        : (viaKb ? "Velg " + (mode === "match" ? "plass" : "bøtte") + " med piltastene, slipp med Mellomrom." : "Trykk på " + (mode === "match" ? "plassen" : "en bøtte") + ", eller bruk knappene under brikken.")));
    }
    function deselect(msg) {
      sel = null; kb = null; target = null;
      paint();
      if (msg) say(msg);
    }
    function place(id, zone) {
      if (locked()) return;
      var was = st.place[id] == null ? POOL : st.place[id];
      st = placeIn(ns, st, id, zone);
      sel = null; kb = null; target = null;
      if (was === zone) { paint(); say(itemText(id) + " ligger fortsatt i " + zoneName(zone) + "."); return; }
      afterMove(id, itemText(id) + " lagt i " + zoneName(zone) + ".");
      focusChip(id);
    }
    function moveSort(id, idx, keepSel) {
      if (locked()) return;
      st = { order: moveTo(st.order, id, idx) };
      if (!keepSel) { sel = null; kb = null; }
      afterMove(id, itemText(id) + " flyttet til plass " + (st.order.indexOf(id) + 1) + " av " + st.order.length + ".");
      focusChip(id);
    }
    function onChipClick(id) {
      if (suppressClick) { suppressClick = false; return; }
      if (locked()) return;
      if (!sel && canExplain(id)) { toggleX(id); return; }
      if (sel === id) { deselect("Valget er angret."); return; }
      if (mode === "sort" && sel) { var to = st.order.indexOf(id); moveSort(sel, to); return; }
      select(id, false);
    }
    function onZoneClick(z) {
      if (locked() || !sel) return;
      if (mode === "sort") return;
      place(sel, z);
    }
    function isAct(e) { return e.key === " " || e.key === "Spacebar" || e.key === "Enter"; }
    function onChipKey(e, id) {
      if (locked()) return;
      var k = e.key;
      if (mode === "sort" && e.altKey && (k === "ArrowUp" || k === "ArrowDown")) {
        e.preventDefault();
        var i = st.order.indexOf(id), j = i + (k === "ArrowUp" ? -1 : 1);
        if (j < 0 || j >= st.order.length) { say(j < 0 ? "Allerede først." : "Allerede sist."); return; }
        sel = null; kb = null;
        moveSort(id, j);
        return;
      }
      if (k === "Escape" || k === "Esc") {
        if (!sel) return;
        e.preventDefault();
        if (kb && mode === "sort" && sel === id && st.order.indexOf(id) !== kb.from) {
          var from = kb.from; sel = null; kb = null;
          st = { order: moveTo(st.order, id, from) }; persist(); paint(); focusChip(id);
          say("Angret. " + itemText(id) + " er tilbake på plass " + (from + 1) + ".");
          return;
        }
        deselect("Valget er angret.");
        return;
      }
      if (isAct(e)) {
        e.preventDefault();
        if (!sel && canExplain(id)) { toggleX(id); return; }
        if (sel === id && kb) {                     // slipp
          if (mode === "sort") { deselect(itemText(id) + " lagt på plass " + (st.order.indexOf(id) + 1) + "."); }
          else place(id, target || POOL);
          return;
        }
        if (sel && sel !== id && mode === "sort") { moveSort(sel, st.order.indexOf(id)); return; }
        if (sel === id) { deselect("Valget er angret."); return; }
        select(id, true);
        return;
      }
      if (sel === id && kb && /^Arrow/.test(k)) {
        e.preventDefault();
        var fwd = k === "ArrowDown" || k === "ArrowRight";
        if (mode === "sort") {
          var a = st.order.indexOf(id), b2 = a + (fwd ? 1 : -1);
          if (b2 < 0 || b2 >= st.order.length) { say(b2 < 0 ? "Allerede først." : "Allerede sist."); return; }
          st = { order: moveTo(st.order, id, b2) };
          flyttet = true;
          persist(); paint(); focusChip(id);
          say("Plass " + (b2 + 1) + " av " + st.order.length + ".");
          return;
        }
        var ti = zoneOrder.indexOf(target || POOL);
        ti = (ti + (fwd ? 1 : -1) + zoneOrder.length) % zoneOrder.length;
        target = zoneOrder[ti];
        paint();
        var n = ns.items.filter(function (it) { var v = st.place[it.id]; return target === POOL ? v == null : v === target; }).length;
        say("Mål: " + zoneName(target) + ", " + n + (n === 1 ? " brikke" : " brikker") + ". Mellomrom slipper.");
      }
    }

    /* ---------------- Dra med Pointer Events ---------------- */
    var raf = null;
    function onPointerDown(e, id, b) {
      if (locked() || (e.button != null && e.button !== 0)) return;
      var onGrip = !!(e.target && e.target.closest && e.target.closest(".dra-grip"));
      // Berøring utenfor grepet: la siden rulle (trykk blir et vanlig klikk)
      if (!onGrip && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      drag = { id: id, b: b, pid: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, on: false, over: null, idx: null, grip: onGrip };
      if (onGrip) e.preventDefault();
      b.addEventListener("pointermove", onPointerMove);
      b.addEventListener("pointerup", onPointerUp);
      b.addEventListener("pointercancel", onPointerCancel);
      try { b.setPointerCapture(e.pointerId); } catch (er) {}
    }
    function startDrag() {
      drag.on = true;
      var r = drag.b.getBoundingClientRect();
      drag.dx = drag.x0 - r.left; drag.dy = drag.y0 - r.top;
      var g = drag.b.cloneNode(true);
      g.removeAttribute("id"); g.setAttribute("aria-hidden", "true");
      g.className = "dra-chip dra-ghost sel";
      g.style.width = r.width + "px";
      document.body.appendChild(g);
      drag.ghost = g;
      sel = drag.id; kb = null; target = null;
      paint();
      say(itemText(drag.id) + " løftet.");
      tick();
    }
    function hitZone(x, y) {
      var t = document.elementFromPoint(x, y);
      var z = t && t.closest ? t.closest("[data-dz]") : null;
      return z && wrap.contains(z) ? z.getAttribute("data-dz") : null;
    }
    function sortIndex(y) {
      var idx = 0;
      st.order.forEach(function (id) {
        if (id === drag.id) return;
        var r = chips[id].getBoundingClientRect();
        if (y > r.top + r.height / 2) idx++;
      });
      return idx;
    }
    function track() {
      if (!drag || !drag.on) return;
      drag.ghost.style.transform = "translate(" + Math.round(drag.x - drag.dx) + "px," + Math.round(drag.y - drag.dy) + "px)";
      if (mode === "sort") {
        var idx = sortIndex(drag.y);
        if (idx !== drag.idx) {
          drag.idx = idx;
          Array.prototype.forEach.call(sortList.children, function (li) { li.classList.remove("drop-before", "drop-after"); });
          var others = st.order.filter(function (x) { return x !== drag.id; });
          if (idx < others.length) chips[others[idx]].parentNode.classList.add("drop-before");
          else if (others.length) chips[others[others.length - 1]].parentNode.classList.add("drop-after");
        }
      } else {
        var z = hitZone(drag.x, drag.y);
        if (z !== drag.over) { drag.over = z; paintBoard(); }
      }
    }
    function tick() {
      if (!drag || !drag.on) { raf = null; return; }
      var edge = 56, h = window.innerHeight, v = 0;
      if (drag.y < edge) v = -Math.ceil((edge - drag.y) / 4);
      else if (drag.y > h - edge) v = Math.ceil((drag.y - (h - edge)) / 4);
      if (v) { window.scrollBy(0, v); track(); }
      raf = window.requestAnimationFrame(tick);
    }
    function onPointerMove(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      drag.x = e.clientX; drag.y = e.clientY;
      if (!drag.on) {
        if (Math.abs(drag.x - drag.x0) + Math.abs(drag.y - drag.y0) < 6) return;
        startDrag();
      }
      e.preventDefault();
      track();
    }
    function endDrag() {
      if (!drag) return null;
      var b = drag.b;
      b.removeEventListener("pointermove", onPointerMove);
      b.removeEventListener("pointerup", onPointerUp);
      b.removeEventListener("pointercancel", onPointerCancel);
      try { b.releasePointerCapture(drag.pid); } catch (er) {}
      if (drag.ghost && drag.ghost.parentNode) drag.ghost.parentNode.removeChild(drag.ghost);
      if (sortList) Array.prototype.forEach.call(sortList.children, function (li) { li.classList.remove("drop-before", "drop-after"); });
      if (raf) { window.cancelAnimationFrame(raf); raf = null; }
      var d = drag; drag = null;
      return d;
    }
    function onPointerUp(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var d = endDrag();
      if (!d.on) return;                       // bare et trykk: det vanlige klikket tar seg av det
      suppressClick = true; setTimeout(function () { suppressClick = false; }, 400);
      if (mode === "sort") { moveSort(d.id, d.idx == null ? st.order.indexOf(d.id) : d.idx); return; }
      if (d.over) place(d.id, d.over);
      else deselect("Ikke flyttet.");
    }
    function onPointerCancel() {
      if (!drag) return;
      var d = endDrag();
      if (d && d.on) deselect("Avbrutt.");
    }

    /* ---------------- Sjekk, nullstill, fremdrift ---------------- */
    function report() {
      var c = counts(), p = poeng();
      if (opts.report) opts.report(c, p);
      else if (IN.progress && spec.id) {
        if (p && p.maks) IN.progress.solved("dra", spec.id, p.poeng, p.maks);
        else IN.progress.solved("dra", spec.id, c.right, c.total);
      }
      if (typeof opts.onCheck === "function") {
        try { opts.onCheck({ counts: c, poeng: p }); } catch (e) { if (window.console) console.error("[dra] onCheck", e); }
      }
    }
    function paintResult() {
      while (res.firstChild) res.removeChild(res.firstChild);
      if (!checked) return;
      var c = counts(), p = poeng();
      if (opts.result) { var x = opts.result(c, p); if (typeof x === "string") res.innerHTML = x; else if (x) res.appendChild(x); return; }
      // B1: én resultatlinje, «2 av 3 poeng · 2 riktig · 1 galt · 0 ubesvart»
      var linje = p ? "<b>" + num(p.poeng) + " av " + num(p.maks) + " poeng</b> · " + c.right + " riktig"
        : "<b>" + c.right + " av " + c.total + " riktig</b>";
      linje += " · " + c.wrong + " galt" + (mode === "sort" ? "" : " · " + c.blank + " ubesvart");
      if (p && p.raa < p.min) linje += ' <span class="muted">(summen ble ' + num(p.raa) + ", men en oppgave gir aldri under " + num(p.min) + ")</span>";
      res.appendChild(el("p", { class: "ov-sum ov-reslinje", html: linje }));
      if (ns.items.some(function (it) { return canExplain(it.id); }))
        res.appendChild(el("p", { class: "dra-xhint", text: "Trykk på en gal brikke for å se forklaringen." }));
      if (spec.oppsummering) {
        var o = el("div", { class: "ov-oppsum dra-oppsum" });
        var v = pick(spec.oppsummering);
        if (v && v.nodeType) o.appendChild(v); else o.innerHTML = String(v);
        res.appendChild(o);
        if (IN.symbolTips) IN.symbolTips(o);
      }
    }
    function doCheck() {
      checked = true; sel = null; kb = null; target = null;
      open = {};
      persist(); paint(); report();
      var c = counts(), p = poeng();
      say(c.right + " av " + c.total + " riktig. " + c.wrong + " galt" + (c.blank ? ", " + c.blank + " ikke plassert" : "") + "." +
        (p ? " " + num(p.poeng) + " av " + num(p.maks) + " poeng." : ""));
      return { counts: c, poeng: p };
    }
    function doReset() {
      st = emptyState(ns, opts.shuffle); checked = false; reported = false; open = {}; flyttet = false; sel = null; kb = null; target = null;
      persist();
      while (res.firstChild) res.removeChild(res.firstChild);
      paint(); say("Nullstilt.");
    }

    if (checked) paintResult();
    function onPref() { if (!wrap.isConnected) { if (host._draOff) host._draOff(); return; } paint(); }
    function onDocKey(e) { if ((e.key === "Escape" || e.key === "Esc") && sel && !wrap.contains(document.activeElement)) deselect("Valget er angret."); }
    var dead = false;
    function onLevel() {
      if (dead) return;
      if (wrap.isConnected === false) { if (host._draOff) host._draOff(); return; }
      paintPrompt();
      ns.items.forEach(function (it) { chips[it.id]._lbl.innerHTML = pick(it.html); chips[it.id]._xpFilled = false; expRows[it.id].filled = false; });
      paint(); paintResult();
    }
    document.addEventListener("in:svar-straks", onPref);
    document.addEventListener("keydown", onDocKey);
    window.addEventListener("in:level", onLevel);
    if (quick) { window.addEventListener("scroll", onScrollQuick, { passive: true }); window.addEventListener("resize", onScrollQuick); }
    host._draOff = function () {
      dead = true;
      if (quick) { window.removeEventListener("scroll", onScrollQuick); window.removeEventListener("resize", onScrollQuick); quick.hidden = true; }
      document.removeEventListener("in:svar-straks", onPref);
      document.removeEventListener("keydown", onDocKey);
      window.removeEventListener("in:level", onLevel);
      endDrag();
      host._draOff = null;
    };
    paint();

    return {
      el: wrap, check: doCheck, reset: doReset, counts: counts, poeng: poeng,
      checked: function () { return checked; },
      state: function () { return JSON.parse(JSON.stringify(st)); },
      // For tester: flytt direkte uten å gå via DOM
      place: function (id, zone) { if (mode !== "sort") place(String(id), zone == null ? POOL : String(zone)); },
      move: function (id, idx) { if (mode === "sort") moveSort(String(id), idx); }
    };
  };

  /* Stil som hører til M6/M7 (tastaturlinja og den klebrige bøttelinja). Legges inn én gang, så
     dra.js virker uten endring i ovelse.css. Kan flyttes dit senere. */
  var STIL = ".dra-hint>span{display:block}.dra-hint-k{display:none!important}" +
    "@media (hover:hover) and (pointer:fine){.dra-hint-k{display:block!important}.dra-hint>.dra-hint-t{display:none}}" +
    ".dra-quick{position:fixed;left:0;right:0;bottom:0;z-index:900;max-height:45vh;overflow-y:auto;box-sizing:border-box;" +
    "padding:.5rem 16px calc(.5rem + env(safe-area-inset-bottom,0px));background:var(--color-surface-container-high,var(--color-surface,#fff));" +
    "color:var(--color-on-surface);border-top:1px solid var(--color-outline-variant);box-shadow:var(--elevation,0 -2px 8px rgba(0,0,0,.2));font-size:var(--text-sm)}" +
    ".dra-quick[hidden]{display:none}.dra-quick-t{margin:0 0 .35rem;overflow-wrap:anywhere}" +
    ".dra-quick-b{display:flex;flex-wrap:wrap;gap:.35rem}.dra-quick-b .btn{min-height:44px;text-align:left;white-space:normal}";
  function stil() {
    if (typeof document === "undefined" || document.getElementById("dra-js-stil")) return;
    var s = document.createElement("style");
    s.id = "dra-js-stil"; s.textContent = STIL;
    (document.head || document.documentElement).appendChild(s);
  }
  var _dragTask = IN.dragTask;
  IN.dragTask = function (host, spec, opts) { stil(); return _dragTask(host, spec, opts); };

  IN.sortTask = function (host, spec, opts) { spec = spec || {}; spec.mode = "sort"; return IN.dragTask(host, spec, opts); };
  IN.bucketTask = function (host, spec, opts) { spec = spec || {}; spec.mode = "bucket"; return IN.dragTask(host, spec, opts); };
  IN.matchTask = function (host, spec, opts) { spec = spec || {}; spec.mode = "match"; return IN.dragTask(host, spec, opts); };

  // Rene funksjoner for tester (node) og testsiden
  IN.dragTask.POOL = POOL;
  IN.dragTask.logic = { normalize: normalize, grade: grade, skaar: skaar, regelTekst: regelTekst, emptyState: emptyState,
    startOrder: startOrder, placeIn: placeIn, moveTo: moveTo, isRight: isRight, validState: validState,
    fingerprint: fingerprint, plainText: plainText };
})();
