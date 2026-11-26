/* ============================================================
   IN2120 guide · inspera.js
   Øving på oppgavetypene fra Inspera-eksamenen, med eksamens egen poengregel.

   IN.inspera(host, oppg, opts?) → { score(), reset(), check(), maks, key }
     oppg = en oppgave fra eksamensbanken (plan/format.md § 3–4), med oppg.inspera = {
       type: "M"|"F1"|"FF"|"D"|"N"|"T"|"H"|"K"|"E", regelTekst, regel: { riktig, feil, blankt, min, maks, alleRiktig?, sekvens? }, … }
       alleRiktig: poeng når alle enheter er riktige (uten den: maks). sekvens: «justert skåring», poeng per trinn i
       den lengste rekken av svar i riktig innbyrdes rekkefølge (erstatter riktig/feil/blankt). Se plan/format.md § 4.
     Hver enhet (rad i M, avkrysset alternativ i FF, felt i D/N/T, hele svaret i F1/H) gir riktig/feil/blankt.
     Summen kappes til [min, maks]. K/E rettes ikke automatisk: skriv svaret, trykk «Vurder svaret mitt»,
     kryss av punktene i sjekklisten (se sjekkliste() under) og få en egenvurdert poengsum. Perfekt svar og
     sensorveiledningen vises i øvingen etter vurderingen. Egenvurdering sender in:insp med manual: true.
     opts: { onScore: fn({key, score, maks, manual}), compact: bool, iKort: bool, straks?: false }
       «Svar med en gang» (IN.svarStraks, bryteren i nivålinja): ✓/✗ per felt med en gang det er besvart, før retting.
       Slås av med opts.straks === false eller data-straks="av" på <body>/en forelder (eksamen.html: helt sett).
       Utenfor kort får øvingen en synlig tittel h5.insp-tittel (oppg.title og poeng), se tittel() under.
       Poenglinja er én kort linje (arkets tekst) i en lukket <details> med «Slik retter øvingen».
       Type M: hver avkrysning ligger i label.insp-m-o som fyller cella. Under 560 px stables matrisen
       (viz.css): én blokk per rad, valgene som knapperad. Lagring og retting er uendret.
       Etter retting (M): rader som ble feil eller ubesvart, får grønn ramme og «✓ riktig» på riktig valg og
       forklaringen som én linje under raden. «Fasit og forklaring» er da en lukket <details> (i kort: ingen liste,
       og forklaringen står under hver rad). Huskeregelen (IN.FIG_HUSK) står utenfor lista, så den alltid syns.
       Resultatlinja: «2 av 3 poeng · 2 riktig · 1 galt · 0 ubesvart». Knapper: «Rett som på eksamen» · «↺ Nullstill».
       iKort: øvingen står i fanen «Oppgave» i et eksamenskort (bank.js). Da viser den ikke perfekt svar og
       sensorveiledningen selv, men knapper som åpner fanene «Løsning» og «Sensorveiledning» i samme kort
       (card._show). Finnes ikke kortet eller fanen, vises de i øvingen som før. «Fasit og forklaring»
       (automatisk rettet) blir en overskrift i stedet for <details>.
     Returnerer også vurder(), status() (null til oppgaven er rettet/vurdert, ellers {score, maks, manual})
     og sjekkliste (K/E). IN.inspera.sjekkliste(oppg) gir sjekklisten uten DOM.
     Lagring K/E: in2120:insp:<key> = { h, a: [tekst …], c: vurdert, k: [avkrysset …] }.
   IN.insperaFig(host, oppg): figuren fra arket. Tegnet SVG via IN.FIGURER[key](node, oppg) hvis den finnes
     (hjelpere i assets/js/figurer/fig-felles.js, IN.fig), ellers figur.beskrivelse som tekst.
     Svarfelt i figuren (D/N/T): tegnefunksjonen legger plassholdere med IN.fig.felt(htmlNode, i)
     (div.fig-felt[data-felt=i]). Figuren får data-fig-key=<key>. IN.inspera leter etter figuren med samme
     key i de tre nærmeste forfedrene til sin host, og flytter felt nr. i (units[i].inputs) inn i plassholderen.
     Rekkefølgen er likegyldig: tegnes figuren etter øvingen (eller på nytt), kaller insperaFig øvingens
     wrap._figPlasser(). Felt uten plassholder står i lista under som før. Lagring/retting/markering er uendret
     (feltene har egne change/input-lyttere, siden de ikke lenger ligger inni øvingens wrap).
   Lagring: in2120:insp:<key> (svar + fingeravtrykk av oppgaven). Fremdrift: insp:<side>:<key>.
   Klassisk script. Lastes etter core.js.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, qsa = IN.qsa;
  IN.FIGURER = IN.FIGURER || {};
  var uid = 0;

  function num(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
  function sgn(x) { return (x > 0 ? "+" : x < 0 ? "−" : "±") + num(Math.abs(x)); }
  function norm(s) { return String(s == null ? "" : s).toLowerCase().replace(/\s+/g, " ").replace(/^\s+|\s+$/g, ""); }
  function arr(v) { return v == null ? [] : [].concat(v); }
  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function html(node, v) { node.innerHTML = v == null ? "" : String(v); return node; }
  /* ✓/✗/– ved et svarfelt (D/N/T: rett etter feltet) eller i et alternativ (F1/FF: sist i labelen). */
  var SYM = { right: "✓", wrong: "✗", blank: "–" };
  function symNode(n, state) {
    if (!SYM[state]) { if (n._sm && n._sm.parentNode) n._sm.parentNode.removeChild(n._sm); return null; }
    var s = n._sm || (n._sm = el("span", { "aria-hidden": "true" }));
    s.className = "insp-sm is-" + state; s.textContent = SYM[state];
    return s;
  }
  function symI(lab, state) { var s = symNode(lab, state); if (s && s.parentNode !== lab) lab.appendChild(s); }
  function symEtter(node, state) { var s = symNode(node, state); if (s && node.parentNode && s.previousSibling !== node) node.parentNode.insertBefore(s, node.nextSibling); }

  /* ---------- Figur fra arket ---------- */
  IN.insperaFig = function (host, o) {
    var f = o.figur, draw = IN.FIGURER[o.key];
    if (!f && !draw) return null;
    var fig = el("figure", { class: "exam-fig insp-fig", "data-fig-key": String(o.key || "") });
    var tegnet = false;
    if (draw) {
      var h = el("div", { class: "exam-fig-h" }); fig.appendChild(h);
      try { draw(h, o); tegnet = !!h.firstChild; } catch (e) { if (window.console) console.error(e); IN.clear(h); }
    }
    if (tegnet) {
      fig.classList.add("har-tegning");
      fig.appendChild(el("figcaption", { class: "small muted", text: o.year && o.oppgave_nr ? "Figuren fra eksamensarket, tegnet på nytt." : (o.figurTekst || "Figur laget for øvingen.") }));
    } else {
      if (!f) return null;
      if (draw) IN.clear(fig);
      var box = el("div", { class: "insp-figtxt" });
      box.appendChild(el("p", { class: "small muted", html: "<b>Figur på arket</b> (beskrevet med ord):" }));
      if (f.beskrivelse) box.appendChild(html(el("div"), f.beskrivelse));
      if (f.tekst && f.tekst.length) box.appendChild(el("ul", { class: "small" }, f.tekst.map(function (t) { return html(el("li"), t); })));
      fig.appendChild(box);
    }
    host.appendChild(fig);
    // Finnes øvingen allerede (eller figuren tegnes på nytt), flytt feltene inn i plassholderne nå.
    if (tegnet && fig.querySelector(".fig-felt")) {
      var w = naerMed(host, '.insp[data-key="' + attrEsc(o.key) + '"]');
      if (w && w._figPlasser) w._figPlasser();
    }
    return fig;
  };
  function attrEsc(s) { return String(s == null ? "" : s).replace(/["\\]/g, "\\$&"); }
  /* Første treff for sel i host eller én av de tre nærmeste forfedrene (samme oppgavekort). */
  function naerMed(host, sel) {
    for (var a = host, n = 0; a && n < 4; a = a.parentNode, n++) {
      if (a.matches && a.matches(sel)) return a;
      var f = a.querySelector && a.querySelector(sel);
      if (f) return f;
    }
    return null;
  }

  /* ---------- Sjekkliste for egenvurdering av K/E ----------
     sjekkliste(o) → { kilde: "egen"|"svar"|"sensor"|"blandet"|"fallback", grupper: [{ del, poeng, nivaa, items }], punkter: [..flat..] }
       item = { punkt (html), poeng, nokkelord?: [..], del }
     1) o.inspera.sjekkliste = [{ punkt, poeng, nokkelord?, del? }] brukes som den er.
     2) Ellers per del (o.inspera.deler): punktene i vårt fullpoengssvar (IN.PERFEKT[key].svar[].poeng, «… (1p)»),
        så sensors retteinstruks (sensor.deler[].kriterier, deretter fasit): «X poeng for …», «… (Xp)», tallord
        («Ett poeng for …»), og punkt-/nummerlister. Punkter uten tall deler det som er igjen av delens poeng.
        Overstiger summen delens poeng og ett punkt alene gir full pott, er punktene trinn (høyeste teller).
     3) Ingen punkter i en del: ett punkt «Dekker svaret hovedpoengene i perfekt svar?» med delens poeng.
        Ingen punkter i noen del: ett slikt punkt for hele oppgaven. */
  var TALLORD = { en: 1, ett: 1, "én": 1, to: 2, tre: 3, fire: 4, fem: 5, seks: 6 };
  var NUMRE = "(\\d+(?:[.,]\\d+)?|ett|én|en|to|tre|fire|fem|seks)";
  function tall(s) { s = String(s).toLowerCase(); return TALLORD[s] != null ? TALLORD[s] : parseFloat(s.replace(",", ".")); }
  function r2(x) { return Math.round(x * 100) / 100; }
  function plain(h) {
    return String(h == null ? "" : h)
      .replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|li|div|h\d|tr)>/gi, "\n").replace(/<li[^>]*>/gi, "\n")
      .replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&gt;/g, ">").replace(/&lt;/g, "<")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function lines(h) { return plain(h).split(/\n+/).map(function (x) { return x.replace(/\s+/g, " ").trim(); }).filter(Boolean); }
  function trimPunkt(s) { if (/^\s*\(/.test(s) && s.indexOf(")") < 0) s = s.replace(/^\s*\(/, ""); return s.replace(/^[\s,;:–-]+/, "").replace(/[\s,;:]+(og|eller)?\s*$/i, "").trim(); }

  // Vårt fullpoengssvar: «Navngitt angrep (1p)», «Emma (1p) + keylogger … (2p)»
  function fraSvar(list) {
    return arr(list).map(function (s) {
      var txt = String(s), p = 0, har = false;
      txt = txt.replace(/\s*\((\d+(?:[.,]\d+)?)\s*p(?:oeng)?\)/gi, function (m, n) { p += tall(n); har = true; return ""; });
      return { punkt: txt.trim(), poeng: har ? p : null };
    }).filter(function (x) { return x.punkt; });
  }
  // Sensors retteinstruks (ordrett tekst, ren tekst ut)
  function fraSensor(h) {
    var out = [];
    lines(h).forEach(function (ln) {
      if (/oppgaven gir (maks|totalt)\s+\d/i.test(ln) && !/poeng for|p for/i.test(ln.replace(/oppgaven gir (maks|totalt)[^.]*\./i, ""))) return;
      if (/^[A-Za-z]\)\s*\d+(?:[.,]\d+)?\s*p(oeng)?\.?$/i.test(ln)) return;       // «C) 3p» er bare delens total
      var hale = new RegExp("\\(" + NUMRE + "\\s*(?:p|poeng)\\)\\.?\\s*$", "i").exec(ln);
      var re = new RegExp("(^|[\\s(])" + NUMRE + "\\s*(?:(?:p|poeng)(?![a-zæøå])|(?=\\s+(?:til\\s+)?for\\b))", "gi"), m, hits = [];
      while ((m = re.exec(ln))) {
        var før = ln.slice(Math.max(0, m.index - 14), m.index + m[1].length).toLowerCase();
        if (/(maks|totalt|opp til|gir oppgaven)\s*$/.test(før)) continue;
        hits.push({ at: m.index + m[1].length, p: tall(m[2]) });
      }
      if (hale && hits.length <= 1) {
        var t = trimPunkt(ln.slice(0, hale.index).replace(/^[A-Za-z]\)\s*/, ""));
        if (t) { out.push({ punkt: esc(t), poeng: tall(hale[1]) }); return; }
      }
      hits.forEach(function (h0, i) {
        var a = i === 0 ? 0 : h0.at, b = i + 1 < hits.length ? hits[i + 1].at : ln.length;
        var t = trimPunkt(ln.slice(a, b).replace(/^[A-Za-z]\)\s*/, ""));
        if (t) out.push({ punkt: esc(t), poeng: h0.p });
      });
    });
    out = out.filter(function (x) { return x.poeng > 0; });   // «0p hvis …» er trekk, ikke et punkt
    if (out.length) return out;
    // Punktlister og nummererte krav uten poengtall
    lines(h).forEach(function (ln) {
      var b = /^(?:[–\-•*]\s*|\d+[.)]\s+)(.+)$/.exec(ln);
      if (b) out.push({ punkt: esc(b[1].trim()), poeng: null });
    });
    return out.length > 1 ? out : [];
  }
  function fordel(items, P, utenRest) {
    var kjent = 0, ukjent = 0;
    items.forEach(function (x) { if (x.poeng != null) kjent += x.poeng; else ukjent++; });
    if (P == null) P = kjent || null;
    var rest = P != null ? Math.max(0, P - kjent) : 0;
    items.forEach(function (x) { if (x.poeng == null) x.poeng = ukjent ? r2(rest / ukjent) : 0; });
    // Alle punkter har tall, men summen når ikke delens poeng: resten som eget punkt, så full pott er mulig
    if (!utenRest && !ukjent && P != null && kjent < P - 1e-9 && items.length && items[0].punkt !== FALLBACK)
      items.push({ punkt: "Resten: dekker svaret ellers hovedpoengene i perfekt svar?", poeng: r2(P - kjent), del: items[0].del, nokkelord: [] });
    var sum = items.reduce(function (s, x) { return s + x.poeng; }, 0), topp = Math.max.apply(null, items.map(function (x) { return x.poeng; }));
    return { poeng: P, nivaa: P != null && sum > P + 1e-9 && topp >= P - 1e-9 && items.length > 1 };
  }
  function velg(list, del, n) {
    list = arr(list);
    var hit = list.filter(function (x) { return (x.del || "") === (del || ""); });
    if (hit.length) return hit;
    if (n === 1 && list.length === 1) return list;
    return [];
  }
  var FALLBACK = "Dekker svaret hovedpoengene i perfekt svar?";
  function sjekkliste(o) {
    var q = o.inspera || {}, pf = (o.key && IN.PERFEKT && IN.PERFEKT[o.key]) || o.perfekt || {};
    var deler = q.deler && q.deler.length ? q.deler : [{ del: "", poeng: o.points != null ? +o.points : null }];
    var total = q.regel && q.regel.maks != null ? q.regel.maks : (o.points != null ? +o.points : null);
    var grupper = [], kilde = "fallback";
    function delPoeng(d) { var x = deler.filter(function (y) { return (y.del || "") === (d || ""); })[0]; return x && x.poeng != null ? +x.poeng : null; }
    if (q.sjekkliste && q.sjekkliste.length) {
      kilde = "egen";
      q.sjekkliste.forEach(function (it) {
        var d = it.del || "", g = grupper.filter(function (x) { return x.del === d; })[0];
        if (!g) { g = { del: d, poeng: d ? delPoeng(d) : null, items: [] }; grupper.push(g); }
        g.items.push({ punkt: it.punkt, poeng: it.poeng != null ? +it.poeng : null, nokkelord: arr(it.nokkelord), del: d });
      });
      if (grupper.length === 1 && !grupper[0].del) grupper[0].poeng = total;
      grupper.forEach(function (g) { var f = fordel(g.items, g.poeng, true); g.poeng = f.poeng; g.nivaa = f.nivaa; });
    } else {
      var sv = pf.sensor || null, sDeler = sv ? (sv.deler && sv.deler.length ? sv.deler : (sv.fasit || sv.kriterier ? [sv] : [])) : [];
      var brukt = {};
      deler.forEach(function (d) {
        var dn = d.del || "", items = [], k = null;
        velg(pf.svar, dn, deler.length).forEach(function (s) { items = items.concat(fraSvar(s.poeng)); });
        if (items.length) k = "svar";
        else {
          velg(sDeler, dn, deler.length).forEach(function (s) { var it = fraSensor(s.kriterier); if (!it.length) it = fraSensor(s.fasit); items = items.concat(it); });
          if (items.length) k = "sensor";
        }
        if (k) brukt[k] = true;
        var P = d.poeng != null ? +d.poeng : (deler.length === 1 ? total : null);
        if (!items.length) items = [{ punkt: FALLBACK, poeng: P != null ? P : 0 }];
        items.forEach(function (x) { x.del = dn; x.nokkelord = []; });
        var f = fordel(items, P);
        grupper.push({ del: dn, poeng: f.poeng, nivaa: f.nivaa, items: items, auto: !!k });
      });
      if (!grupper.some(function (g) { return g.auto; })) {
        grupper = [{ del: "", poeng: total, nivaa: false, items: [{ punkt: FALLBACK, poeng: total != null ? total : 0, nokkelord: [], del: "" }] }];
      } else kilde = brukt.svar && !brukt.sensor ? "svar" : brukt.sensor && !brukt.svar ? "sensor" : "blandet";
    }
    var punkter = [];
    grupper.forEach(function (g) { g.items.forEach(function (it) { punkter.push(it); }); });
    return { kilde: kilde, grupper: grupper, punkter: punkter, maks: total };
  }

  /* Perfekt svar + sensorveiledningen (ordrett) inne i øvingen, vist etter egenvurderingen. */
  function oppgNr(o) {
    var m = /oppgave\s*([\d.]+\w*)/i.exec(o.oppgave_nr || "");
    if (m) return m[1];
    m = /-([\d.]+\w*)$/.exec(o.key || "");
    return m ? m[1] : "";
  }
  function perfektNode(o) {
    var pf = (o.key && IN.PERFEKT && IN.PERFEKT[o.key]) || o.perfekt || null;
    if (!pf) return null;
    var prose = function (v) { var s = String(v); return /^\s*</.test(s) ? s : "<p>" + s + "</p>"; };
    var det = el("details", { class: "insp-pf", open: "" });
    det.appendChild(el("summary", { text: "Perfekt svar og sensorveiledningen" }));
    if (pf.svar && pf.svar.length) {
      var ours = el("div", { class: "insp-pf-ours" });
      ours.appendChild(el("p", { class: "insp-pf-h", html: "<b>Perfekt svar</b> " + (pf.type === "skjonn" ? '<span class="muted small">(ett eksempel, sensor vurderer etter skjønn)</span>' : '<span class="muted small">(vårt fullpoengssvar)</span>') }));
      pf.svar.forEach(function (s) {
        var b = el("div", { class: "insp-pf-del" });
        if (s.del) b.appendChild(el("div", { class: "insp-pf-dl", text: s.del }));
        if (s.tekst) b.appendChild(html(el("div"), prose(s.tekst)));
        arr(s.kode).forEach(function (k) { if (typeof k === "string") b.appendChild(el("pre", { class: "et-pf-pre", text: k })); });
        arr(s.formel).forEach(function (k) { b.appendChild(el("pre", { class: "et-pf-pre et-formel", text: String(k) })); });
        if (s.etter) b.appendChild(html(el("div"), prose(s.etter)));
        ours.appendChild(b);
      });
      det.appendChild(ours);
    }
    var sv = pf.sensor, parts = sv ? (sv.deler && sv.deler.length ? sv.deler : (sv.fasit || sv.kriterier ? [sv] : [])) : [];
    if (parts.length || (sv && sv.merknad)) {
      var sb = el("div", { class: "insp-pf-sensor" });
      sb.appendChild(el("p", { class: "insp-pf-h", html: "<b>Sensorveiledningen sier (ordrett)</b>" }));
      var nr = oppgNr(o), y = o.year || (o.key ? String(o.key).split("-")[0] : "");
      sb.appendChild(el("p", { class: "insp-pf-src small muted", text: (sv && sv.kilde) || ("Kilde: sensorveiledning IN2120" + (y ? " " + y : "") + (nr ? ", oppgave " + nr : "")) }));
      if (parts.length) {
        var bq = el("blockquote", { class: "sensor" });
        parts.forEach(function (p) {
          var w = el("div", { class: "insp-pf-del" });
          if (p.del) w.appendChild(el("div", { class: "insp-pf-dl", text: p.del }));
          if (p.fasit && p.fasit !== p.kriterier) w.appendChild(html(el("div"), prose(p.fasit)));
          if (typeof p.kode === "string") w.appendChild(el("pre", { class: "et-pf-pre", text: p.kode }));
          if (p.kriterier) w.appendChild(Array.isArray(p.kriterier) ? el("ul", {}, p.kriterier.map(function (x) { return html(el("li"), x); })) : html(el("div", { class: "insp-pf-krit" }), prose(p.kriterier)));
          bq.appendChild(w);
        });
        sb.appendChild(bq);
      }
      if (sv && sv.merknad) sb.appendChild(el("p", { class: "small", html: "<b>Merk:</b> " + sv.merknad }));
      det.appendChild(sb);
    }
    return det.childNodes.length > 1 ? det : null;
  }

  /* I et eksamenskort: knapper som åpner fanene «Løsning» og «Sensorveiledning» i samme kort i stedet for å
     gjenta perfekt svar og sensorveiledningen. Uten kort (eller uten fanen) vises perfektNode som før. */
  function kortLenker(o, wrap) {
    var pf = (o.key && IN.PERFEKT && IN.PERFEKT[o.key]) || o.perfekt || null;
    if (!pf) return null;
    var sv = pf.sensor, parts = sv ? (sv.deler && sv.deler.length ? sv.deler : (sv.fasit || sv.kriterier ? [sv] : [])) : [];
    var harSv = pf.svar && pf.svar.length, harSensor = pf.type !== "mock" && (parts.length || (sv && sv.merknad));
    if (!harSv && !harSensor) return null;
    var box = el("div", { class: "insp-kort-lenker" }), inline = null;
    box.appendChild(el("p", { class: "small muted insp-kort-txt", text: "Sammenlign med:" }));
    function knapp(fane, tekst) {
      return el("button", { class: "btn sm insp-gaa t-" + fane, type: "button", "data-vis": fane, text: tekst, onclick: function () {
        var card = wrap.closest && wrap.closest("details.examtask");
        if (card && card._show && card._show(fane, true)) return;
        if (!inline) { inline = perfektNode(o); if (inline) box.parentNode.insertBefore(inline, box.nextSibling); }
        box.hidden = true;
      } });
    }
    if (harSv) box.appendChild(knapp("losning", "Perfekt svar (Løsning)"));
    if (harSensor) box.appendChild(knapp("sensor", "Sensors retteinstrukser (Sensorveiledning)"));
    return box;
  }

  /* Fast kolonneoverskrift i matrisen (brei skjerm): stå rett under toppmenyen og nivålinja. */
  var stickBundet = false;
  function stickTop() {
    var h = 0;
    ["topnav", "levelbar"].forEach(function (id) {
      var n = document.getElementById(id);
      if (n && window.getComputedStyle(n).position === "sticky") h = Math.max(h, (parseFloat(window.getComputedStyle(n).top) || 0) + n.offsetHeight);
    });
    if (h) document.documentElement.style.setProperty("--insp-stick-top", Math.round(h) + "px");
  }
  function bindStick() {
    if (stickBundet) return;
    stickBundet = true;
    stickTop();
    window.addEventListener("resize", stickTop);
    if (document.readyState !== "complete") window.addEventListener("load", stickTop);
  }

  /* ---------- Hovedrenderer ---------- */
  IN.inspera = function (host, o, opts) {
    if (typeof host === "string") host = IN.qs(host);
    if (!host || !o || !o.inspera) return null;
    opts = opts || {};
    var q = o.inspera, t = q.type, id = "insp" + (++uid);
    var r = q.regel || {}, rr = r.riktig != null ? r.riktig : 1, rf = r.feil || 0, rb = r.blankt || 0;
    var maks = r.maks != null ? r.maks : (o.points != null ? +o.points : null), min = r.min != null ? r.min : 0;
    var manual = t === "K" || t === "E";
    var key = o.key || id, storeKey = "in2120:insp:" + key;
    var fpr = hash(JSON.stringify(q));
    var units = [];          // { id, kind, get(), right(v), blank(v), mark(state), fasit, explain, label }
    var checked = false;

    var wrap = el("div", { class: "insp insp-" + t + (opts.compact ? " insp-compact" : ""), "data-key": key });

    // Opphav: eksamensoppgave (banken: year + oppgave_nr) eller øving laget for guiden (o.opphav, se IN.opphavTekst).
    var fraEksamen = !!(o.year && o.oppgave_nr);
    if (!fraEksamen && !opts.utenOpphav) {
      wrap.appendChild(el("p", { class: "insp-opphav small", html: IN.opphavTekst(o.opphav) }));
    }

    // Poenglinja: én kort linje. «Arket» bare for eksamensoppgaver (ordrett fra arket).
    // Forklaringen «Slik retter øvingen» vises bare når den sier noe mer enn poenglinja.
    if (!manual) {
      var viTxt = (r.sekvens != null
        ? "Slik retter øvingen (justert skåring): " + num(r.sekvens) + " poeng per trinn i den lengste rekken av svar som står i riktig rekkefølge. Feil trinn imellom trekker ikke"
        : "Slik retter øvingen: riktig " + sgn(rr) + ", galt " + (rf ? sgn(rf) : "0") +
          ", ubesvart " + (rb ? sgn(rb) : "0") + " per " + (t === "M" ? "rad" : t === "FF" ? "avkrysset alternativ" : (t === "F1" || t === "H") ? "oppgave" : "felt")) +
        (r.alleRiktig != null ? ". Alle riktig gir " + num(r.alleRiktig) : "") +
        ". Aldri under " + num(min) + (maks != null ? ", høyst " + num(maks) : "") + " poeng.";
      var arkTxt = q.regelTekst ? String(q.regelTekst).replace(/^\s*Poeng\s*:\s*/i, "") : null;
      var poengHtml = (arkTxt
        ? "<b>" + (fraEksamen ? "Poeng på eksamensarket:" : "Poeng:") + "</b> " + arkTxt
        : "<b>Poeng:</b> riktig " + sgn(rr) + ", galt " + (rf ? sgn(rf) : "0") + ", ubesvart " + (rb ? sgn(rb) : "0") +
          ". Aldri under " + num(min) + (maks != null ? ", høyst " + num(maks) : "") + ".");
      // «Velg 3 …» er en instruks og står synlig. Andre merknader (retting, distraktorer) står i <details>.
      var mkInstruks = q.regelMerknad && /^\s*velg\b/i.test(plain(q.regelMerknad));
      var merMk = q.regelMerknad && !mkInstruks;
      // Øvingen retter annerledes enn arket bare ved justert skåring (sekvens) eller «alle riktig».
      var avviker = r.sekvens != null || (r.alleRiktig != null && !(arkTxt && /alle/i.test(arkTxt)));
      var rl;
      if (avviker || merMk) {
        rl = el("details", { class: "insp-regel small" });
        rl.appendChild(el("summary", { html: poengHtml + ' <span class="insp-regel-mer">' + (avviker ? "slik retter øvingen" : "mer om rettingen") + "</span>" }));
        if (avviker) rl.appendChild(el("p", { class: "insp-regel-vi muted", text: viTxt }));
        if (merMk) rl.appendChild(el("p", { class: "insp-regel-mk muted", html: q.regelMerknad }));
      } else {
        rl = el("p", { class: "insp-regel small", html: poengHtml });
      }
      wrap.appendChild(rl);
      if (mkInstruks) wrap.appendChild(el("p", { class: "insp-regel-mk small", html: q.regelMerknad }));
    }

    var body = el("div", { class: "insp-body" });
    wrap.appendChild(body);

    function choiceInput(type, name, value, label) {
      var inp = el("input", { type: type, name: name, value: String(value) });
      var lab = el("label", { class: "insp-opt" }, [inp, html(el("span"), label)]);
      return { inp: inp, lab: lab };
    }

    /* --- M: matrise --- */
    if (t === "M") {
      var tw = el("div", { class: "table-wrap insp-mwrap" }), tab = el("table", { class: "insp-m" });
      var hr = el("tr", {}, [el("th", { scope: "col", class: "insp-m-s", text: "" })]);
      (q.kolonner || []).forEach(function (k) { hr.appendChild(html(el("th", { scope: "col" }), k)); });
      hr.appendChild(el("th", { class: "insp-m-st", "aria-label": "Resultat" }));
      tab.appendChild(el("thead", {}, [hr]));
      var tb = el("tbody");
      (q.rader || []).forEach(function (row, ri) {
        var tr = el("tr"), name = id + "-r" + ri, inputs = [], tds = [], rts = [];
        var rth = html(el("th", { scope: "row", class: "insp-m-s" }), row.s);
        tr.appendChild(rth);
        (q.kolonner || []).forEach(function (k, ci) {
          var inp = el("input", { type: q.multi ? "checkbox" : "radio", name: name, value: String(ci),
            "aria-label": (row.s || "").replace(/<[^>]+>/g, "") + ": " + String(k).replace(/<[^>]+>/g, "") });
          inputs.push(inp);
          // Labelen fyller cella (stort trykkmål). Kolonnenavnet vises som knappetekst når matrisen stables (≤ 560 px).
          // «✓ riktig» (insp-m-rt) vises på riktig valg i rader som ble feil eller ubesvart (B2).
          var rt = el("span", { class: "insp-m-rt", "aria-hidden": "true", text: "✓ riktig", hidden: true });
          var td = el("td", {}, [el("label", { class: "insp-m-o" }, [inp, html(el("span", { class: "insp-m-k", "aria-hidden": "true" }), k), rt])]);
          tds.push(td); rts.push(rt); tr.appendChild(td);
        });
        var st = el("td", { class: "insp-m-st" }); tr.appendChild(st);
        // Forklaringen som én linje under raden: i radteksten på brei skjerm, som egen celle nederst når matrisen stables.
        var exW = el("div", { class: "insp-m-ex insp-m-ex-w small", hidden: true });
        var exN = el("td", { class: "insp-m-ex insp-m-ex-n small", hidden: true, "aria-hidden": "true" });
        rth.appendChild(exW); tr.appendChild(exN);
        tb.appendChild(tr);
        units.push({
          label: row.s, explain: row.explain, svar: row.svar, multiM: !!q.multi, matrise: true,
          fasit: row.svar == null ? null : arr(row.svar).map(function (i) { return q.kolonner[i]; }).join(" + "),
          get: function () { return inputs.filter(function (x) { return x.checked; }).map(function (x) { return +x.value; }); },
          set: function (v) { inputs.forEach(function (x) { x.checked = arr(v).indexOf(+x.value) >= 0; }); },
          isBlank: function (v) { return !v.length; },
          isRight: function (v) { var s = arr(row.svar).slice().sort().join(","); return v.slice().sort().join(",") === s; },
          mark: function (state, v) {
            tr.className = state ? "is-" + state : "";
            var sv = arr(row.svar), vis = state === "wrong" || state === "blank", valgt = arr(v);
            IN.clear(st);
            if (state) {
              st.appendChild(document.createTextNode(state === "right" ? "✓" : state === "wrong" ? "✗" : "–"));
              var fas = sv.map(function (i) { return String(q.kolonner[i]).replace(/<[^>]+>/g, ""); }).join(" + ");
              st.appendChild(el("span", { class: "qz-sr", text: state === "right" ? " Riktig." : (state === "wrong" ? " Feil." : " Ubesvart.") + " Riktig: " + fas + "." }));
            }
            tds.forEach(function (td, ci) {
              var f = vis && sv.indexOf(ci) >= 0;
              td.classList.toggle("is-fasit", f);
              td.classList.toggle("is-feilvalg", state === "wrong" && valgt.indexOf(ci) >= 0 && sv.indexOf(ci) < 0);
              rts[ci].hidden = !f;
            });
            var ex = state && row.explain && (vis || opts.iKort) ? row.explain : null;
            [exW, exN].forEach(function (n) { html(n, ex); n.hidden = !ex; });
          },
          inputs: inputs
        });
      });
      tab.appendChild(tb); tw.appendChild(tab); body.appendChild(tw);
      bindStick();
    }

    /* --- FF med flere spørsmål: sporsmal[] med svar: [idx …], én enhet per alternativ --- */
    if (t === "FF" && q.sporsmal && q.sporsmal.length) {
      q.sporsmal.forEach(function (sq, si) {
        var grp = el("div", { class: "insp-sq" }), nm = id + "-q" + si, ex3 = arr(sq.explain);
        if (sq.tekst) grp.appendChild(html(el("div", { class: "insp-sq-t" }), sq.tekst));
        var lst = el("div", { class: "insp-alts" });
        (sq.alternativer || []).forEach(function (a, ai) {
          var c = choiceInput("checkbox", nm, ai, a); lst.appendChild(c.lab);
          units.push({
            label: a, explain: ex3[ai], svar: sq.svar, ff: true,
            fasit: sq.svar == null ? null : (arr(sq.svar).indexOf(ai) >= 0 ? "skal krysses av" : "skal ikke krysses av"),
            get: function () { return c.inp.checked; },
            set: function (v) { c.inp.checked = !!v; },
            isBlank: function (v) { return !v; },
            isRight: function () { return arr(sq.svar).indexOf(ai) >= 0; },
            mark: function (state) { c.lab.className = "insp-opt" + (state ? " is-" + state : ""); symI(c.lab, state); },
            inputs: [c.inp]
          });
        });
        grp.appendChild(lst); body.appendChild(grp);
      });
    }

    /* --- F1 / H med flere radioknapp-spørsmål: sporsmal[] --- */
    if ((t === "F1" || t === "H") && q.sporsmal && q.sporsmal.length) {
      q.sporsmal.forEach(function (sq, si) {
        var grp = el("div", { class: "insp-sq" }), nm = id + "-q" + si, its = [];
        if (sq.tekst) grp.appendChild(html(el("div", { class: "insp-sq-t" }), sq.tekst));
        var lst = el("div", { class: "insp-alts" });
        (sq.alternativer || []).forEach(function (a, ai) { var c = choiceInput("radio", nm, ai, a); lst.appendChild(c.lab); its.push(c); });
        grp.appendChild(lst); body.appendChild(grp);
        var ex2 = arr(sq.explain);
        units.push({
          label: sq.tekst ? String(sq.tekst).replace(/<[^>]+>/g, "").slice(0, 90) : "Spørsmål " + (si + 1),
          explain: sq.svar != null ? (ex2[sq.svar] || (ex2.length === 1 ? ex2[0] : null)) : null, svar: sq.svar,
          fasit: sq.svar == null ? null : sq.alternativer[sq.svar],
          get: function () { for (var i = 0; i < its.length; i++) if (its[i].inp.checked) return i; return null; },
          set: function (v) { its.forEach(function (c, i) { c.inp.checked = i === v; }); },
          isBlank: function (v) { return v == null; },
          isRight: function (v) { return v === sq.svar || arr(sq.godta).indexOf(v) >= 0; },
          mark: function (state, v) { its.forEach(function (c, i) { var s = state && (i === v || i === sq.svar) ? (i === sq.svar ? "right" : "wrong") : ""; c.lab.className = "insp-opt" + (s ? " is-" + s : ""); symI(c.lab, s); }); },
          inputs: its.map(function (c) { return c.inp; })
        });
      });
    }

    /* --- F1 / H / FF: alternativer --- */
    if ((t === "F1" || t === "H" || t === "FF") && !(q.sporsmal && q.sporsmal.length)) {
      var multi = t === "FF", name = id + "-a", list = el("div", { class: "insp-alts" }), items = [];
      (q.alternativer || []).forEach(function (a, ai) {
        // grupper: [{ sporsmal, fra, til }] gir overskrift før alternativ nr. fra (samme poengregel for alle)
        arr(q.grupper).forEach(function (g) { if (g.fra === ai && g.sporsmal) list.appendChild(html(el("div", { class: "insp-sq-t insp-grp" }), g.sporsmal)); });
        var c = choiceInput(multi ? "checkbox" : "radio", name, ai, a);
        list.appendChild(c.lab); items.push(c);
      });
      body.appendChild(list);
      var ex = arr(q.explain);
      if (multi) {
        // Én enhet per alternativ; bare avkryssede teller (riktig eller galt). Ubesvart: ingen avkrysning i det hele tatt.
        items.forEach(function (c, ai) {
          units.push({
            label: q.alternativer[ai], explain: ex[ai], svar: q.svar, ff: true,
            fasit: q.svar == null ? null : (arr(q.svar).indexOf(ai) >= 0 ? "skal krysses av" : "skal ikke krysses av"),
            get: function () { return c.inp.checked; },
            set: function (v) { c.inp.checked = !!v; },
            isBlank: function (v) { return !v; },
            isRight: function () { return arr(q.svar).indexOf(ai) >= 0; },
            mark: function (state) { c.lab.className = "insp-opt" + (state ? " is-" + state : ""); symI(c.lab, state); },
            inputs: [c.inp]
          });
        });
      } else {
        units.push({
          label: "Svaret", explain: q.svar != null ? ex[q.svar] : null, svar: q.svar,
          fasit: q.svar == null ? null : q.alternativer[q.svar],
          get: function () { for (var i = 0; i < items.length; i++) if (items[i].inp.checked) return i; return null; },
          set: function (v) { items.forEach(function (c, i) { c.inp.checked = i === v; }); },
          isBlank: function (v) { return v == null; },
          isRight: function (v) { return v === q.svar || arr(q.godta).indexOf(v) >= 0; },
          mark: function (state, v) { items.forEach(function (c, i) { var s = state && (i === v || i === q.svar) ? (i === q.svar ? "right" : "wrong") : ""; c.lab.className = "insp-opt" + (s ? " is-" + s : ""); symI(c.lab, s); }); },
          inputs: items.map(function (c) { return c.inp; })
        });
      }
    }

    /* --- N / D / T: felt i tekst eller figur --- */
    if (t === "N" || t === "D" || t === "T") {
      var felt = q.felt || [], nodes = [];
      felt.forEach(function (f, fi) {
        var valg = f.valg || q.bank || [], node;
        // Tekstfelt eller nedtrekk per felt: T-felt med valg + svar blir nedtrekk, N/D-felt uten valg (og uten felles bank) blir tekstfelt.
        var harValg = valg.length > 0;
        var tx = t === "T" ? !(harValg && f.svar != null) : !harValg;
        if (tx) {
          node = el("input", { type: "text", class: "insp-t", "data-insp-felt": fi, autocomplete: "off", spellcheck: "false", "aria-label": f.etikett || ("Felt " + (fi + 1)) });
        } else {
          node = el("select", { class: "insp-sel", "data-insp-felt": fi, "aria-label": f.etikett || ("Felt " + (fi + 1)) },
            [el("option", { value: "", text: "Velg …" })].concat(valg.map(function (v, vi) { return el("option", { value: String(vi), text: String(v).replace(/<[^>]+>/g, "") }); })));
        }
        nodes.push(node);
        units.push({
          label: f.etikett || ("Felt " + (fi + 1)), explain: f.explain, svar: tx ? f.godta : f.svar,
          fasit: tx ? (f.godta ? f.godta.join(" / ") : null) : (f.svar == null ? null : valg[f.svar]),
          get: function () { return tx ? node.value : (node.value === "" ? null : +node.value); },
          set: function (v) { node.value = v == null ? "" : String(v); },
          isBlank: function (v) { return tx ? !norm(v) : v == null; },
          isRight: function (v) {
            if (tx) { var n = norm(v); return arr(f.godta).some(function (g) { return norm(g) === n; }); }
            return v === f.svar || arr(f.godta).indexOf(v) >= 0;
          },
          mark: function (state) { node.classList.remove("is-right", "is-wrong", "is-blank"); if (state) node.classList.add("is-" + state); symEtter(node, state); },
          inputs: [node]
        });
        // Feltet kan flyttes inn i figuren (utenfor wrap), så det lagrer selv.
        node.addEventListener("change", function () { if (!checked) persist(); });
        if (tx) node.addEventListener("input", function () { if (!checked) persist(); });
      });
      var rader = [];
      if (q.tekst) {
        // {0}, {1} … i den ordrette teksten byttes med feltene
        var tx = el("div", { class: "insp-tekst" });
        // Tegnsetting rett etter feltet («{0}.») holdes på samme linje som feltet (span.insp-slot er nowrap).
        tx.innerHTML = String(q.tekst).replace(/\{(\d+)\}([.,:;!?)»”]*)/g, function (m, i, tegn) { return '<span class="insp-slot" data-i="' + i + '"></span>' + (tegn ? '<span class="insp-tegn">' + tegn + "</span>" : ""); });
        qsa(".insp-slot", tx).forEach(function (s) {
          var n = nodes[+s.getAttribute("data-i")]; if (!n) return;
          s.appendChild(n); s.style.whiteSpace = "nowrap";
          var nx = s.nextSibling; if (nx && nx.nodeType === 1 && nx.classList.contains("insp-tegn")) s.appendChild(nx);
        });
        body.appendChild(tx);
        // Felt som ikke står i teksten, listes under
        nodes.forEach(function (n, i) { if (!n.parentNode) { rader[i] = el("p", { class: "insp-felt" }, [html(el("span", { class: "insp-et" }), (felt[i].etikett || "Felt " + (i + 1)) + ": "), n]); body.appendChild(rader[i]); } });
      } else {
        var fl = el("div", { class: "insp-felter" });
        nodes.forEach(function (n, i) { rader[i] = el("p", { class: "insp-felt" }, [html(el("span", { class: "insp-et" }), (felt[i].etikett || "Felt " + (i + 1)) + ": "), n]); fl.appendChild(rader[i]); });
        body.appendChild(fl);
      }
      // Felt i figuren: plassholder div.fig-felt[data-felt=i] i figuren med samme key (se insperaFig).
      var figPlasser = function () {
        var fig = naerMed(host, '.insp-fig[data-fig-key="' + attrEsc(key) + '"]'), igjen = 0;
        rader.forEach(function (rad, i) {
          if (!rad) return;
          var ph = fig && fig.querySelector('.fig-felt[data-felt="' + i + '"]');
          if (ph) { if (nodes[i].parentNode !== ph) ph.appendChild(nodes[i]); rad.hidden = true; }
          else { if (nodes[i].parentNode !== rad) rad.appendChild(nodes[i]); rad.hidden = false; igjen++; }
        });
        if (fl) fl.hidden = !igjen;
        wrap.classList.toggle("insp-felt-i-figur", rader.some(function (r) { return r && r.hidden; }));
      };
      wrap._figPlasser = figPlasser;
      figPlasser();
      if (t === "D" && q.bank && q.bank.length) body.insertBefore(el("p", { class: "insp-bank small muted", html: "<b>Ordene du kan velge mellom (på eksamen drar du dem inn):</b> " + q.bank.map(function (b) { return '<span class="insp-chip">' + b + "</span>"; }).join(" ") }), body.firstChild);
    }

    /* --- K / E: manuelt rettet, med sjekkliste for egenvurdering --- */
    var sj = null, vurdert = false, vurd = null, checks = [], egen = null, hintNodes = [];
    if (manual) {
      var deler = q.deler && q.deler.length ? q.deler : [{ del: "", poeng: o.points }];
      deler.forEach(function (d, di) {
        var box = el("div", { class: "insp-del" });
        var head = (d.del ? "<b>" + d.del + "</b> " : "") + (d.poeng != null ? '<span class="et-p">(' + num(d.poeng) + "p)</span>" : "") + (d.grense ? ' <span class="muted small">· ' + d.grense + "</span>" : "");
        if (head) box.appendChild(el("p", { class: "insp-del-h", html: head }));
        if (d.sporsmal) box.appendChild(html(el("div", { class: "insp-del-q" }), d.sporsmal));
        var ta = el("textarea", { class: "insp-ta", rows: t === "K" ? "2" : "5", spellcheck: "false", "aria-label": "Ditt svar" + (d.del ? " " + d.del : "") });
        box.appendChild(ta);
        body.appendChild(box);
        units.push({ manual: true, del: d.del || "", get: function () { return ta.value; }, set: function (v) { ta.value = v || ""; }, isBlank: function (v) { return !norm(v); }, inputs: [ta] });
      });
      sj = sjekkliste(o);
      body.appendChild(el("p", { class: "insp-man small muted", html: "Rettes ikke automatisk. Skriv svaret, trykk <b>«Vurder svaret mitt»</b> og kryss av det svaret ditt dekker. " +
        (opts.iKort ? "Perfekt svar og sensors retteinstrukser står i fanene <b>«Løsning»</b> og <b>«Sensorveiledning»</b>." : "Da ser du også <b>«Perfekt svar»</b> og sensors retteinstrukser.") }));
    }

    /* --- Knapper, resultat og fasit --- */
    var bar = el("div", { class: "insp-bar" });
    var res = el("div", { class: "insp-res", "aria-live": "polite" });
    var fasitBox = el("div", { class: "insp-fasit" });
    if (!manual) {
      bar.appendChild(el("button", { class: "btn primary sm", type: "button", text: "Rett som på eksamen", onclick: function () { check(true); } }));
      bar.appendChild(el("button", { class: "btn sm", type: "button", text: "↺ Nullstill", onclick: function () { reset(); } }));
    } else {
      bar.appendChild(el("button", { class: "btn primary sm insp-vurder", type: "button", text: "Vurder svaret mitt", onclick: function () { vurder(true); } }));
      bar.appendChild(el("button", { class: "btn sm", type: "button", text: "↺ Nullstill", onclick: function () { reset(); } }));
      vurd = el("div", { class: "insp-vurd", hidden: true, tabindex: "-1" });
    }
    wrap.appendChild(bar); wrap.appendChild(res); if (vurd) wrap.appendChild(vurd); wrap.appendChild(fasitBox);
    host.appendChild(wrap);
    if (!opts.iKort) tittel();

    /* Synlig tittel (oppgavetittel og poeng) utenfor eksamenskort, så to oppgaver på rad blir to enheter.
       Står spørsmålsteksten rett foran verten (p, pre, .ov-tekst eller en callout som ikke er et eksempel),
       settes tittelen foran den. Ellers øverst i verten. I eksamenskortet har kortet allerede tittelen. */
    function tittel() {
      if (host._inspTittel && host._inspTittel.parentNode) host._inspTittel.parentNode.removeChild(host._inspTittel);
      var pts = maks != null ? maks : (o.points != null ? +o.points : null);
      var h = el("h5", { class: "insp-tittel", "data-for": key }, [
        html(el("span", { class: "insp-tittel-t" }), o.title || "Inspera-oppgave"),
        pts != null ? el("span", { class: "insp-tittel-p", text: num(pts) + " poeng" }) : null
      ]);
      function prompt(e) {
        if (!e || e.id || e.querySelector && e.querySelector("[id]")) return false;
        var tg = e.tagName;
        if (tg === "P" || tg === "PRE") return !/\binsp-/.test(e.className);
        if (e.classList.contains("ov-tekst")) return true;
        if (e.classList.contains("callout")) { var lb = e.querySelector(".lbl"); return !(lb && /^\s*eksempel\s*$/i.test(lb.textContent)); }
        return false;
      }
      var anchor = null, p = host.previousElementSibling;
      for (var i = 0; i < 2 && prompt(p); i++) { anchor = p; p = p.previousElementSibling; }
      if (anchor) anchor.parentNode.insertBefore(h, anchor); else host.insertBefore(h, wrap);
      host._inspTittel = h;
      wrap.classList.add("insp-har-tittel");
    }

    /* ---------- Egenvurdering (K/E) ---------- */
    function allText() { return units.map(function (u) { return u.get() || ""; }).join("\n"); }
    function textFor(del) {
      var u = units.filter(function (x) { return x.del === del; });
      return u.length && del ? u.map(function (x) { return x.get() || ""; }).join("\n") : allText();
    }
    function egenScore() {
      if (!sj) return null;
      var p = 0, i = 0;
      sj.grupper.forEach(function (g) {
        var s = 0, hi = 0;
        g.items.forEach(function (it) { if (checks[i]) { s += it.poeng; hi = Math.max(hi, it.poeng); } i++; });
        if (g.nivaa) s = hi;
        if (g.poeng != null) s = Math.min(g.poeng, s);
        p += s;
      });
      if (maks != null) p = Math.min(maks, p);
      return Math.round(Math.max(0, p) * 100) / 100;
    }
    function paintHints() {
      var i = 0;
      sj.grupper.forEach(function (g) {
        var txt = norm(textFor(g.del));
        g.items.forEach(function (it) {
          var h = hintNodes[i++]; if (!h) return;
          var miss = it.nokkelord && it.nokkelord.length && !it.nokkelord.some(function (k) { return txt.indexOf(norm(k)) >= 0; });
          h.hidden = !miss;
          h.textContent = miss ? "Nevnte du " + it.nokkelord.slice(0, 3).map(function (k) { return "«" + k + "»"; }).join(" eller ") + "?" : "";
        });
      });
    }
    function paintEgen() {
      egen = egenScore();
      var s = IN.qs(".insp-egen", vurd);
      if (s) s.innerHTML = "<b>Egenvurdert: " + num(egen) + (maks != null ? " av " + num(maks) : "") + " poeng</b>" +
        ' <span class="muted small">(din egen vurdering, ikke automatisk retting)</span>';
      wrap.setAttribute("data-egen-score", String(egen));
    }
    function report() {
      if (IN.progress && maks) IN.progress.solved("insp", key, egen, maks);
      if (opts.onScore) opts.onScore({ key: key, score: egen, maks: maks, manual: true });
      try { document.dispatchEvent(new CustomEvent("in:insp", { detail: { key: key, score: egen, maks: maks, manual: true } })); } catch (e) {}
    }
    function buildVurd() {
      IN.clear(vurd); hintNodes = [];
      var fs = el("fieldset", { class: "insp-sj" });
      fs.appendChild(el("legend", { text: "Hva dekker svaret ditt?" }));
      var kildeTxt = { egen: "", svar: "Punktene er hentet fra vårt fullpoengssvar.", sensor: "Punktene er hentet ordrett fra sensorveiledningen.", blandet: "Punktene er hentet fra vårt fullpoengssvar og (ordrett) fra sensorveiledningen.", fallback: "" }[sj.kilde] || "";
      fs.appendChild(el("p", { class: "small muted insp-sj-intro", text: "Kryss av det svaret ditt faktisk dekker. Sammenlign med perfekt svar og sensorveiledningen " + (opts.iKort ? "(knappene under åpner fanene i kortet). " : "under. ") + kildeTxt }));
      if (!norm(allText())) fs.appendChild(el("p", { class: "small insp-sj-tom", text: "Du har ikke skrevet noe ennå. Skriv et svar først, så blir vurderingen ærligere." }));
      var i = 0;
      sj.grupper.forEach(function (g) {
        var grp = el("div", { class: "insp-sj-grp" + (g.nivaa ? " is-nivaa" : "") });
        if (g.del || sj.grupper.length > 1) grp.appendChild(el("p", { class: "insp-sj-h", html: (g.del ? "<b>" + g.del + "</b> " : "") + (g.poeng != null ? '<span class="et-p">(' + num(g.poeng) + "p)</span>" : "") }));
        if (g.nivaa) grp.appendChild(el("p", { class: "small muted insp-sj-niv", text: "Trinnvis: bare det høyeste nivået du krysser av, teller." }));
        g.items.forEach(function (it) {
          var n = i++;
          var inp = el("input", { type: "checkbox", value: String(n) });
          inp.checked = !!checks[n];
          inp.addEventListener("change", function () { checks[n] = inp.checked; paintEgen(); persist(); report(); });
          var hint = el("span", { class: "insp-hint small", hidden: true, "aria-live": "polite" });
          hintNodes[n] = hint;
          var txt = el("span", { class: "insp-sj-txt" }, [html(el("span"), it.punkt), " ", el("span", { class: "et-p", text: "(" + num(it.poeng) + "p)" }), hint]);
          grp.appendChild(el("label", { class: "insp-sj-opt" }, [inp, txt]));
        });
        fs.appendChild(grp);
      });
      vurd.appendChild(fs);
      vurd.appendChild(el("p", { class: "insp-egen", "aria-live": "polite" }));
      var pfn = opts.iKort ? kortLenker(o, wrap) : perfektNode(o);
      if (pfn) vurd.appendChild(pfn);
      paintHints();
      paintEgen();
    }
    function vurder(user) {
      if (!manual) return null;
      var first = !vurdert;
      vurdert = true;
      if (first || !vurd.firstChild) buildVurd(); else paintHints();
      vurd.hidden = false;
      persist();
      if (user) { report(); try { vurd.focus({ preventScroll: false }); } catch (e) {} }
      return { score: egen, maks: maks, manual: true };
    }
    if (manual) wrap.addEventListener("input", function (e) { if (vurdert && e.target.tagName === "TEXTAREA") paintHints(); });

    function score() {
      if (manual) return { score: vurdert ? egenScore() : null, maks: maks, manual: true };
      var p = 0, c = { right: 0, wrong: 0, blank: 0, unknown: 0 }, ffAny = false;
      units.forEach(function (u) { if (u.ff && !u.isBlank(u.get())) ffAny = true; });
      units.forEach(function (u) {
        var v = u.get();
        if (u.svar == null) { c.unknown++; return; }
        if (u.isBlank(v)) { if (!u.ff) { c.blank++; p += rb; } return; }
        if (u.multiM) {
          // Matrise med avkrysning: hver avkrysset boks gir riktig/feil (som FF), valgfritt minst regel.minPerRad per rad.
          var rs = 0, sv = arr(u.svar);
          v.forEach(function (i) { rs += sv.indexOf(i) >= 0 ? rr : rf; });
          if (r.minPerRad != null) rs = Math.max(r.minPerRad, rs);
          p += rs;
          if (u.isRight(v)) c.right++; else c.wrong++;
          return;
        }
        if (u.isRight(v)) { c.right++; p += rr; } else { c.wrong++; p += rf; }
      });
      if (units.length && units[0].ff && !ffAny) { c.blank++; p += rb; }
      // regel.sekvens («Justert skåring», H2021 9.1/10.1): poeng = sekvens × lengden av den lengste rekken av svar som
      // står i riktig innbyrdes rekkefølge (feil trinn imellom teller ikke, ingen minus). riktig/feil/blankt brukes ikke da.
      var seqLen = null;
      if (r.sekvens != null) {
        var ranks = [];
        units.forEach(function (u) {
          var v = u.get();
          if (u.svar == null || u.isBlank(v)) return;
          for (var i = 0; i < units.length; i++) if (units[i].svar != null && units[i].isRight(v)) { ranks.push(i); return; }
        });
        var best = [];   // lengste strengt stigende delfølge (O(n²), n ≤ ~10)
        ranks.forEach(function (x, i) { best[i] = 1; for (var j = 0; j < i; j++) if (ranks[j] < x) best[i] = Math.max(best[i], best[j] + 1); });
        seqLen = best.length ? Math.max.apply(null, best) : 0;
        p = r.sekvens * seqLen;
      }
      // «X for alle riktig»: alle enheter riktige (og ingen FF-alternativer glemt) gir maks, også når summen er lavere.
      var missed = units.filter(function (u) { return u.ff && u.svar != null && u.isRight() && !u.get(); }).length;
      // regel.alleRiktig gir verdien eksplisitt (H2021 8.2: 5); uten den gjelder maks.
      var alle = r.alleRiktig != null ? +r.alleRiktig : maks;
      if (alle != null && c.right > 0 && !c.wrong && !c.blank && !c.unknown && !missed) p = Math.max(p, alle);
      var raw = p;
      p = Math.max(min, p); if (maks != null) p = Math.min(maks, p);
      return { score: Math.round(p * 100) / 100, raw: raw, maks: maks, counts: c, manual: false, sekvens: seqLen };
    }

    function persist() {
      var a = units.map(function (u) { return u.get(); });
      var rec = { h: fpr, a: a, c: checked };
      if (manual) { rec.c = vurdert; rec.k = sj ? sj.punkter.map(function (x, i) { return !!checks[i]; }) : []; }
      IN.store.set(storeKey, JSON.stringify(rec));
    }
    function restore() {
      try {
        var s = JSON.parse(IN.store.get(storeKey, "null"));
        if (!s || s.h !== fpr || !Array.isArray(s.a) || s.a.length !== units.length) return;
        units.forEach(function (u, i) { u.set(s.a[i]); });
        if (manual) {
          if (sj && Array.isArray(s.k) && s.k.length === sj.punkter.length) checks = s.k.map(Boolean);
          if (s.c) vurder(false);
          return;
        }
        if (s.c) check(false);
      } catch (e) {}
    }

    function check(report) {
      if (manual) return vurder(!!report);
      checked = true;
      var sc = score();
      units.forEach(function (u) {
        var v = u.get(), st = u.svar == null ? "" : u.isBlank(v) ? (u.ff ? "" : "blank") : u.isRight(v) ? "right" : "wrong";
        if (u.ff && u.svar != null && u.isBlank(v) && u.isRight()) st = "missed"; // skulle vært krysset av
        u.mark(st, v);
      });
      var c = sc.counts;
      // B1: én resultatlinje, «2 av 3 poeng · 2 riktig · 1 galt · 0 ubesvart». Regelen står i <details> øverst.
      res.innerHTML = '<p class="insp-sum ov-reslinje"><b>' + num(sc.score) + (maks != null ? " av " + num(maks) : "") + " poeng</b> · " +
        c.right + " riktig · " + c.wrong + " galt · " + c.blank + " ubesvart" +
        (sc.sekvens != null ? ' <span class="muted">(justert skåring: ' + sc.sekvens + " trinn" + " i riktig rekkefølge)</span>" : "") +
        (sc.raw < min ? ' <span class="muted">(summen ble ' + num(sc.raw) + ", men en oppgave gir aldri under " + num(min) + ")</span>" : "") +
        (c.unknown ? ' <span class="muted">' + c.unknown + " enhet(er) uten kjent fasit telles ikke.</span>" : "") + "</p>";
      // Fasit og forklaring per enhet
      IN.clear(fasitBox);
      // B2: i matrisen (M) står fasiten og forklaringen i raden. Lista blir en lukket <details>, og faller bort i eksamenskortet.
      var erM = t === "M";
      if (!(erM && opts.iKort)) {
        // I eksamenskortet: ingen <details> inne i kortet, bare en liten overskrift
        var det = opts.iKort ? el("div", { class: "insp-fasit-d" }, [el("h4", { class: "et-h", text: "Fasit og forklaring" })])
          : el("details", erM ? { class: "insp-fasit-d" } : { class: "insp-fasit-d", open: "" }, [el("summary", { text: erM ? "Fasit og forklaring for alle radene" : "Fasit og forklaring" })]);
        var ul = el("ul", { class: "insp-fasit-l" });
        units.forEach(function (u) {
          if (u.ff && !u.isRight() && !u.get() && !u.explain) return;
          var li = el("li");
          var head = (u.label && units.length > 1 ? "<b>" + u.label + "</b> → " : "") + (u.fasit == null ? '<span class="muted">fasit ukjent</span>' : "<b>" + u.fasit + "</b>");
          li.appendChild(el("div", { html: head }));
          if (u.explain) li.appendChild(html(el("div", { class: "insp-ex small" }), u.explain));
          ul.appendChild(li);
        });
        det.appendChild(ul);
        fasitBox.appendChild(det);
      }
      // Huskeregel for figuren (IN.FIG_HUSK[key], se figurer/fig-husk.js). Vises først etter retting, så den ikke røper svaret.
      // Står utenfor fasitlista, så den syns også når lista er lukket.
      var husk = IN.FIG_HUSK && IN.FIG_HUSK[key];
      if (husk) fasitBox.appendChild(el("div", { class: "fig-husk" }, [
        el("p", { class: "fig-husk-t", html: "<b>Huskeregel" + (husk.tittel ? ": " + husk.tittel : "") + "</b>" }),
        html(el("div", { class: "fig-husk-x small" }), husk.tekst || "")
      ]));
      persist();
      if (report) {
        if (IN.progress && sc.maks) IN.progress.solved("insp", key, sc.score, sc.maks);
        if (opts.onScore) opts.onScore({ key: key, score: sc.score, maks: sc.maks, manual: false });
        try { document.dispatchEvent(new CustomEvent("in:insp", { detail: { key: key, score: sc.score, maks: sc.maks, manual: false } })); } catch (e) {}
      }
      return sc;
    }

    function reset() {
      checked = false;
      units.forEach(function (u) { u.set(u.ff ? false : null); if (u.mark) u.mark(""); });
      IN.clear(res); IN.clear(fasitBox);
      if (manual) { vurdert = false; checks = []; egen = null; if (vurd) { IN.clear(vurd); vurd.hidden = true; } wrap.removeAttribute("data-egen-score"); }
      try { localStorage.removeItem(storeKey); } catch (e) {}
      if (opts.onScore) opts.onScore({ key: key, score: null, maks: maks, manual: manual });
      try { document.dispatchEvent(new CustomEvent("in:insp", { detail: { key: key, score: null, maks: maks, manual: manual } })); } catch (e) {}
    }

    /* ---------- «Svar med en gang» (IN.svarStraks, bryteren i nivålinja) ----------
       På: hvert felt får ✓/✗ og is-right/is-wrong så snart det er besvart (M: når raden er valgt, D/T/F1/FF:
       ved valg, N og tekstfelt i T: ved blur/Enter). M viser fasit og forklaring i raden (som B2), de andre
       typene en liste «Fasit og forklaring for det du har svart» under knappene. Ingen poengsum før
       «Rett som på eksamen». Av: som før. Aldri for K/E, etter retting eller under et helt sett
       (data-straks="av" på <body> eller en forelder, eller opts.straks === false). Lagring og poeng er uendret. */
    var live = el("span", { class: "qz-sr", "aria-live": "polite" });
    wrap.appendChild(live);
    function straksAv() {
      return opts.straks === false || !!(IN.svarStraks && IN.svarStraks.laast && IN.svarStraks.laast()) ||
        !!(wrap.closest && wrap.closest('[data-straks="av"]')) || !!(host.closest && host.closest('[data-straks="av"]'));
    }
    function straks() { return !manual && !checked && !straksAv() && !!(IN.svarStraks && IN.svarStraks.get()); }
    function straksState(u) {
      var v = u.get();
      if (u.svar == null || u.isBlank(v)) return "";
      if (u.multiM) {   // avkrysningsmatrise: galt så snart en gal boks er krysset, riktig når alle riktige er krysset
        var sv = arr(u.svar);
        if (v.some(function (i) { return sv.indexOf(i) < 0; })) return "wrong";
        return v.length >= sv.length ? "right" : "";
      }
      return u.isRight(v) ? "right" : "wrong";
    }
    function straksListe() {
      if (checked) return;
      IN.clear(fasitBox);
      if (!straks() || t === "M") return;
      var ul = el("ul", { class: "insp-fasit-l" }), n = 0;
      units.forEach(function (u) {
        var st = straksState(u); if (!st) return;
        n++;
        var li = el("li", { class: "is-" + st });
        li.appendChild(el("div", { html: '<span class="insp-sm is-' + st + '" aria-hidden="true">' + SYM[st] + "</span> " +
          (u.label && units.length > 1 ? "<b>" + u.label + "</b> → " : "") + "<b>" + u.fasit + "</b>" }));
        if (u.explain) li.appendChild(html(el("div", { class: "insp-ex small" }), u.explain));
        ul.appendChild(li);
      });
      if (n) fasitBox.appendChild(el("div", { class: "insp-fasit-d insp-straks" }, [
        el("p", { class: "insp-straks-h small muted", text: "Fasit for det du har svart (poengene får du når du retter):" }), ul]));
    }
    function straksEn(u, si) {
      if (checked || manual) return;
      var st = straks() ? straksState(u) : "", v = u.get(), sig = st + "|" + JSON.stringify(v);
      u.mark(st, v);
      straksListe();
      if (si && st && u._straksSig !== sig) live.textContent = st === "right" ? "Riktig." :
        "Feil." + (u.fasit != null ? " Riktig: " + plain(u.fasit).replace(/\s+/g, " ").trim() + "." : "");
      u._straksSig = sig;
    }
    var varKoblet = false;
    function straksAlle(e) {
      if (wrap.isConnected) varKoblet = true;
      else if (e && varKoblet) { document.removeEventListener("in:svar-straks", straksAlle); return; }   // kortet er fjernet (nytt år i eksamen.html)
      if (checked || manual) return;
      units.forEach(function (u) { u._straksSig = null; straksEn(u, false); });
    }
    if (!manual) {
      units.forEach(function (u) {
        u.inputs.forEach(function (inp) {
          var tekst = inp.tagName === "INPUT" && inp.type === "text";
          inp.addEventListener("change", function () { straksEn(u, true); });
          if (tekst) {
            // Tekstfelt: tilbakemelding ved blur (change) eller Enter, ikke for hvert tastetrykk. Skriver du igjen, forsvinner merket.
            inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); straksEn(u, true); } });
            inp.addEventListener("input", function () { if (straks() && u._straksSig) { u._straksSig = null; u.mark("", u.get()); straksListe(); } });
          }
        });
      });
      // Alltid: eksamen.html kan bytte modus (data-straks på <body>) mens kortene står åpne. core.js sender da in:svar-straks.
      document.addEventListener("in:svar-straks", straksAlle);
    }

    // Lagre underveis (uten å rette)
    wrap.addEventListener("change", function () { if (!checked) persist(); });
    wrap.addEventListener("input", function (e) { if (e.target.tagName === "TEXTAREA" || e.target.type === "text") { if (!checked) persist(); } });
    restore();
    straksAlle();

    return { key: key, maks: maks, manual: manual, score: score, check: check, reset: reset, node: wrap,
      vurder: function () { return vurder(true); }, sjekkliste: sj,
      status: function () {
        if (manual) return vurdert ? { score: egenScore(), maks: maks, manual: true } : null;
        return checked ? { score: score().score, maks: maks, manual: false } : null;
      } };
  };
  IN.inspera.sjekkliste = sjekkliste;
})();
