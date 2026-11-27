/* ============================================================
   IN2120 guide · viz-iam.js
   Visualiseringer for blokk 8 (IAM). Klassisk script, lastes etter core.js og stepplayer.js.

   IN.iam.seq(host, cfg)      sekvensdiagram i en stegspiller.
     cfg = { parter: ["Bruker", …], pre: [{ fra, til, tekst }], intro: tekst | {eli5,normal,teknisk},
             meldinger: [{ nr?, fra, til, tekst, merke?, stiplet?, forkl: tekst | {eli5,normal,teknisk},
                           spor?: { sporsmal, valg, fasit, forklaring? } }],
             slutt?: tekst | {…} (ekstra sluttsteg), aria }
     fra/til er indekser i parter. fra === til gir en løkke (intern handling).
     spor gis videre til stegspilleren: spørsmålet vises på steget før meldingen («gjett før neste»).
   IN.iam.modeller(host)       silo og føderert side om side (bryter).
   IN.iam.kategorier(host)     2×2-tabellen navnerom × autentisering: plasser ordningene.
   IN.iam.blp(host)            Bell-LaPadula: velg maks og aktuelt nivå og dokumentets gradering.
   IN.iam.abac(host)           ABAC-policy: velg attributter og se beslutningen.
   Ingen lagring. Stiler i assets/css/blokk-iam.css.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;
  var SVGNS = "http://www.w3.org/2000/svg";

  function sv(tag, attrs, text) {
    var n = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k) && attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function host$(h) { return typeof h === "string" ? IN.qs(h) : h; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

  /* ---------- Sekvensdiagram ---------- */
  function drawSeq(cfg, k) {
    var P = cfg.parter, M = cfg.meldinger, pre = cfg.pre || [];
    var W = seqW(cfg), mx = 70, colW = (W - 2 * mx) / Math.max(1, P.length - 1);
    var top = 12, boxH = 40, y0 = top + boxH + 22 + pre.length * 26, dy = 36;
    var H = y0 + M.length * dy + 14;
    var X = function (i) { return mx + i * colW; };
    var svg = sv("svg", { viewBox: "0 0 " + W + " " + H, class: "iam-seq", role: "img",
      "aria-label": cfg.aria || "Sekvensdiagram", style: "min-width:" + Math.min(W, 640) + "px" });

    // Livslinjer og parter
    P.forEach(function (p, i) {
      svg.appendChild(sv("line", { x1: X(i), y1: top + boxH, x2: X(i), y2: H - 6, class: "seq-life" }));
      var bw = Math.min(colW - 10, 132);
      svg.appendChild(sv("rect", { x: X(i) - bw / 2, y: top, width: bw, height: boxH, rx: 6, class: "seq-party" }));
      var lines = String(p).split("\n");
      lines.forEach(function (ln, li) {
        svg.appendChild(sv("text", { x: X(i), y: top + boxH / 2 + 4 + (li - (lines.length - 1) / 2) * 14, class: "seq-plbl", "text-anchor": "middle" }, ln));
      });
    });
    // Forhåndsbetingelser (stiplet, uten nummer)
    pre.forEach(function (p, pi) {
      var y = top + boxH + 20 + pi * 26, x1 = X(p.fra), x2 = X(p.til);
      svg.appendChild(sv("line", { x1: x1, y1: y, x2: x2, y2: y, class: "seq-pre" }));
      svg.appendChild(sv("text", { x: (x1 + x2) / 2, y: y - 5, class: "seq-pretxt", "text-anchor": "middle" }, p.tekst));
    });
    // Meldinger 1 … k
    M.forEach(function (m, i) {
      if (i >= k) return;
      var y = y0 + i * dy + 18, cur = i === k - 1;
      var g = sv("g", { class: "seq-msg" + (cur ? " cur" : " done") + (m.stiplet ? " dash" : "") });
      var nr = m.nr != null ? String(m.nr) : String(i + 1);
      if (m.fra === m.til) {
        var x = X(m.fra), w = 34;
        g.appendChild(sv("path", { d: "M" + x + " " + (y - 12) + " h" + w + " v16 h-" + (w - 6), class: "seq-line" }));
        g.appendChild(sv("polygon", { points: (x) + "," + (y + 4) + " " + (x + 8) + "," + (y) + " " + (x + 8) + "," + (y + 8), class: "seq-head" }));
        // Teksten står til venstre for nummeret, så løkka på siste livslinje ikke går ut av bildet
        g.appendChild(sv("text", { x: x - 30, y: y, class: "seq-txt", "text-anchor": "end" }, m.tekst));
        g.appendChild(numBadge(x - 14, y - 4, nr));
      } else {
        var a = X(m.fra), b = X(m.til), dir = b > a ? 1 : -1;
        g.appendChild(sv("line", { x1: a, y1: y, x2: b - dir * 8, y2: y, class: "seq-line" }));
        g.appendChild(sv("polygon", { points: b + "," + y + " " + (b - dir * 9) + "," + (y - 5) + " " + (b - dir * 9) + "," + (y + 5), class: "seq-head" }));
        var tx = sv("text", { x: (a + b) / 2, y: y - 6, class: "seq-txt", "text-anchor": "middle" }, m.tekst);
        g.appendChild(tx);
        g.appendChild(numBadge(a - dir * 14, y, nr));
        if (m.merke) {
          var mxp = b - dir * 26;
          g.appendChild(sv("rect", { x: mxp - 13, y: y + 3, width: 26, height: 15, rx: 4, class: "seq-merke" }));
          g.appendChild(sv("text", { x: mxp, y: y + 14, class: "seq-merketxt", "text-anchor": "middle" }, m.merke));
        }
      }
      svg.appendChild(g);
    });
    return svg;
  }
  function numBadge(x, y, nr) {
    var g = sv("g", { class: "seq-nr" });
    g.appendChild(sv("circle", { cx: x, cy: y, r: 10 }));
    g.appendChild(sv("text", { x: x, y: y + 4, "text-anchor": "middle" }, nr));
    return g;
  }

  /* Smal skjerm: vertikal meldingsliste (avsender → mottaker: melding) i stedet for diagrammet,
     som ellers måtte skaleres så mye at teksten ble uleselig. Samme meldinger 1 … k, siste uthevet. */
  // Lista brukes når diagrammet måtte skaleres under 75 % (teksten ville blitt under ca. 9 px).
  var SMAL = 0.75;
  function seqW(cfg) { return Math.max(560, 150 * cfg.parter.length); }
  function partNavn(p) { return String(p).replace(/-\n/g, "").replace(/\n/g, " "); }
  function drawListe(cfg, k) {
    var P = cfg.parter, M = cfg.meldinger, pre = cfg.pre || [];
    var box = el("div", { class: "iam-liste", role: "group", "aria-label": cfg.aria || "Sekvensdiagram som liste" });
    box.appendChild(el("p", { class: "iam-l-parter small" }, [el("span", { class: "muted", text: "Parter: " })].concat(
      P.map(function (p, i) { return el("span", { class: "iam-l-part", text: partNavn(p) + (i < P.length - 1 ? " · " : "") }); }))));
    pre.forEach(function (p) {
      box.appendChild(el("p", { class: "iam-l-pre small", html: "<b>" + esc(partNavn(P[p.fra])) + "</b> ⇢ <b>" + esc(partNavn(P[p.til])) + "</b>: " + esc(p.tekst) }));
    });
    var ol = el("ol", { class: "iam-l-ol" });
    // Alle meldinger tegnes fra start; de som ikke er nådd, er skjult (visibility), så lista ikke vokser.
    M.forEach(function (m, i) {
      var cur = i === k - 1, nr = m.nr != null ? String(m.nr) : String(i + 1);
      var hvem = m.fra === m.til ? "<b>" + esc(partNavn(P[m.fra])) + "</b> (internt)"
        : "<b>" + esc(partNavn(P[m.fra])) + "</b> " + (m.stiplet ? "⇢" : "→") + " <b>" + esc(partNavn(P[m.til])) + "</b>";
      var li = el("li", { class: "iam-l-msg" + (i >= k ? " skjult" : cur ? " cur" : " done") + (m.stiplet ? " dash" : ""), "aria-current": cur ? "step" : null, "aria-hidden": i >= k ? "true" : null }, [
        el("span", { class: "iam-l-nr", "aria-hidden": "true", text: nr }),
        el("span", { class: "iam-l-body" }, [
          el("span", { class: "iam-l-hvem", html: hvem }),
          el("span", { class: "iam-l-txt", html: esc(m.tekst) + (m.merke ? ' <span class="iam-l-merke">' + esc(m.merke) + "</span>" : "") })
        ])
      ]);
      ol.appendChild(li);
    });
    box.appendChild(ol);
    return box;
  }

  function seq(host, cfg) {
    host = host$(host);
    if (!host) return null;
    var M = cfg.meldinger;
    return IN.stepPlayer(host, {
      initial: [1], customInput: false, speed: 1600, navTopp: true, fastHoyde: true,
      generate: function () {
        var st = [{ k: 0, tag: "Start", text: cfg.intro || "Partene i protokollen." }];
        M.forEach(function (m, i) {
          var nr = m.nr != null ? m.nr : i + 1;
          var steg = { k: i + 1, tag: "Melding " + nr, text: m.forkl || esc(m.tekst) };
          if (m.spor) steg.spor = m.spor;
          st.push(steg);
        });
        if (cfg.slutt) st.push({ k: M.length, tag: "Oppsummering", text: cfg.slutt });
        return st;
      },
      render: function (s, ctx) {
        ctx.stage.classList.add("iam-stage");
        clear(ctx.stage);
        var smal = ctx.width > 0 && ctx.width < SMAL * seqW(cfg);
        ctx.stage.classList.toggle("iam-smal", smal);
        ctx.stage.appendChild(smal ? drawListe(cfg, s.k) : drawSeq(cfg, s.k));
      }
    });
  }

  /* ---------- Silo og føderert ---------- */
  function modeller(host) {
    host = host$(host);
    if (!host) return null;
    var wrap = el("div", { class: "iam-modeller" });
    var bar = el("div", { class: "btn-row", role: "group", "aria-label": "Velg modell" });
    var fig = el("div", { class: "iam-fig" });
    var cap = el("p", { class: "small" });
    var cur = "silo";
    function btn(id, t) {
      var b = el("button", { class: "btn sm", type: "button", text: t, onclick: function () { cur = id; paint(); } });
      b._id = id; bar.appendChild(b); return b;
    }
    btn("silo", "Silo"); btn("foderert", "Føderert");
    function paint() {
      IN.qsa("button", bar).forEach(function (b) { b.setAttribute("aria-pressed", b._id === cur ? "true" : "false"); });
      clear(fig);
      var W = 600, H = 230, svg = sv("svg", { viewBox: "0 0 " + W + " " + H, class: "iam-mod", role: "img",
        "aria-label": cur === "silo" ? "Silomodell: tre tjenester, hver med egen innlogging" : "Føderert modell: tre tjenester stoler på én IdP" });
      var ux = 70, uy = 115;
      svg.appendChild(sv("circle", { cx: ux, cy: uy - 18, r: 12, class: "mod-user" }));
      svg.appendChild(sv("path", { d: "M" + (ux - 20) + " " + (uy + 22) + " q20 -34 40 0", class: "mod-user" }));
      svg.appendChild(sv("text", { x: ux, y: uy + 42, "text-anchor": "middle", class: "mod-t" }, "Bruker"));
      var ys = [40, 115, 190], names = ["Nettbutikk", "Bibliotek", "Treningsapp"];
      if (cur === "silo") {
        ys.forEach(function (y, i) {
          svg.appendChild(sv("line", { x1: ux + 26, y1: uy, x2: 380, y2: y, class: "mod-l" }));
          svg.appendChild(sv("text", { x: (ux + 26 + 380) / 2, y: (uy + y) / 2 - 6, "text-anchor": "middle", class: "mod-s" }, "bruker-ID + passord " + (i + 1)));
          svg.appendChild(sv("rect", { x: 380, y: y - 22, width: 190, height: 44, rx: 6, class: "mod-box" }));
          svg.appendChild(sv("text", { x: 475, y: y - 3, "text-anchor": "middle", class: "mod-t" }, names[i]));
          svg.appendChild(sv("text", { x: 475, y: y + 13, "text-anchor": "middle", class: "mod-s" }, "SP og IdP i ett"));
        });
        cap.innerHTML = "<b>Silo:</b> hver tjeneste er både SP og IdP. Tre tjenester gir tre bruker-ID-er og tre autentikatorer (identitetsoverlast). Til gjengjeld deler tjenestene ingenting om brukeren.";
      } else {
        svg.appendChild(sv("rect", { x: 190, y: 93, width: 120, height: 44, rx: 6, class: "mod-box idp" }));
        svg.appendChild(sv("text", { x: 250, y: 112, "text-anchor": "middle", class: "mod-t" }, "IdP"));
        svg.appendChild(sv("text", { x: 250, y: 128, "text-anchor": "middle", class: "mod-s" }, "autentiserer"));
        svg.appendChild(sv("line", { x1: ux + 26, y1: uy, x2: 190, y2: uy, class: "mod-l" }));
        svg.appendChild(sv("text", { x: (ux + 26 + 190) / 2, y: uy - 7, "text-anchor": "middle", class: "mod-s" }, "én autentikator"));
        ys.forEach(function (y, i) {
          svg.appendChild(sv("line", { x1: 310, y1: uy, x2: 400, y2: y, class: "mod-l tok" }));
          svg.appendChild(sv("rect", { x: 335, y: (uy + y) / 2 - 9, width: 26, height: 15, rx: 4, class: "seq-merke" }));
          svg.appendChild(sv("text", { x: 348, y: (uy + y) / 2 + 2, "text-anchor": "middle", class: "seq-merketxt" }, "ID"));
          svg.appendChild(sv("rect", { x: 400, y: y - 22, width: 170, height: 44, rx: 6, class: "mod-box" }));
          svg.appendChild(sv("text", { x: 485, y: y - 3, "text-anchor": "middle", class: "mod-t" }, names[i]));
          svg.appendChild(sv("text", { x: 485, y: y + 13, "text-anchor": "middle", class: "mod-s" }, "SP: tar imot ID-token"));
        });
        cap.innerHTML = "<b>Føderert:</b> SP og IdP er ulike aktører. IdP-en autentiserer og sender et signert ID-token, som alle tre tjenestene godtar. Én autentikator holder, men IdP-en blir et felles feilpunkt og ser hvor brukeren logger inn.";
      }
      fig.appendChild(svg);
    }
    wrap.appendChild(bar); wrap.appendChild(fig); wrap.appendChild(cap);
    clear(host); host.appendChild(wrap);
    paint();
    return { paint: paint };
  }

  /* ---------- 2×2: navnerom × autentisering ---------- */
  // r: autentisering (0 = sentralisert, 1 = distribuert), c: navnerom (0 = sentralisert, 1 = distribuert)
  var ORDNINGER = [
    { n: "Tysk eID", r: 0, c: 0, d: "Én statlig aktør forvalter både identifikatorene og autentiseringen." },
    { n: "Aadhaar", r: 0, c: 0, d: "Indias nasjonale ID: ett nummer per person, og staten står for autentiseringen." },
    { n: "FEIDE", r: 0, c: 1, d: "Hver institusjon har sitt eget navnerom (distribuert), men du kan bare autentiseres av hjemmeinstitusjonen din (sentralisert)." },
    { n: "Eduroam", r: 0, c: 1, d: "Som FEIDE: mange institusjoner med hvert sitt navnerom, men bare hjemmeinstitusjonen kan autentisere deg. 2026-lysarket plasserer den her." },
    { n: "ID-porten", r: 1, c: 0, d: "Fødselsnummeret er ett felles navnerom, men flere eID-leverandører kan utføre autentiseringen (BankID, Buypass, Commfides, MinID)." },
    { n: "Altinn", r: 1, c: 0, d: "Logger inn med fødselsnummer via ID-porten: sentralisert navnerom og flere eID-leverandører." },
    { n: "HelseID", r: 1, c: 0, d: "Helsepersonell har identitet i ett felles navnerom, og flere aktører kan autentisere." },
    { n: "Logg inn med Google / Apple / Microsoft", r: 1, c: 1, d: "Hver leverandør forvalter sitt eget navnerom og autentiserer sine egne brukere. Brukeren velger leverandør." },
    { n: "Europeisk eID (planlagt)", r: 1, c: 1, d: "Hvert land har sitt eget navnerom og sine egne IdP-er, og innloggingen går via landenes eIDAS-portaler." }
  ];
  var RAD = ["Sentralisert autentisering", "Distribuert autentisering"], KOL = ["Sentralisert navnerom", "Distribuert navnerom"];
  function kategorier(host) {
    host = host$(host);
    if (!host) return null;
    var placed = {}, sel = null, cSel = null, rSel = null, panelMsg = null, sist = null, feilRute = null, order = [];
    var START = "Trykk på en ordning, og velg så navnerom og autentisering i panelet som åpnes. Du kan også trykke «Plasser her» i tabellen.";
    var wrap = el("div", { class: "iam-kat" });
    var chips = el("div", { class: "btn-row iam-chips", role: "group", "aria-label": "Ordninger som skal plasseres" });
    var tw = el("div", { class: "iam-tw" }), tab = el("table", { class: "iam-2x2" });
    var msg = el("p", { class: "iam-msg small", "aria-live": "polite" });
    function stokk() {
      order = ORDNINGER.map(function (o, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = order[i]; order[i] = order[j]; order[j] = x; }
    }
    var tools = el("div", { class: "btn-row" }, [
      el("button", { class: "btn", type: "button", text: "Vis fasit", onclick: function () { ORDNINGER.forEach(function (o, i) { placed[i] = true; }); sel = cSel = rSel = panelMsg = sist = null; paint(); say("Alle ordningene er plassert.", ""); } }),
      el("button", { class: "btn", type: "button", text: "↺ Nullstill", onclick: function () { placed = {}; sel = cSel = rSel = panelMsg = sist = null; stokk(); paint(); say(START, ""); } })
    ]);
    var cells = [];
    tab.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "" })].concat(KOL.map(function (k) { return el("th", { scope: "col", text: k }); })))]));
    var tb = el("tbody");
    RAD.forEach(function (rn, r) {
      var tr = el("tr", {}, [el("th", { scope: "row", text: rn })]);
      KOL.forEach(function (kn, c) {
        var list = el("div", { class: "iam-cell-l" });
        var b = el("button", { class: "iam-cell-b", type: "button", text: "Plasser her", "aria-label": "Plasser i " + rn.toLowerCase() + ", " + kn.toLowerCase(),
          onclick: function () { drop(r, c); } });
        var td = el("td", { "data-kol": kn }, [list, b]);
        cells.push({ r: r, c: c, list: list, b: b, td: td });
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    tab.appendChild(tb); tw.appendChild(tab);
    function say(t, cls) { msg.className = "iam-msg small" + (cls ? " " + cls : ""); msg.innerHTML = t; }
    function hintFor(o, r, c) {
      return o.c !== c ? "Se på navnerommet: forvalter én aktør identifikatorene, eller mange?" : "Se på autentiseringen: kan flere aktører autentisere den samme brukeren?";
    }
    /* Prøv å plassere valgt ordning i (autentisering r, navnerom c). Returnerer true ved riktig. */
    function proev(r, c) {
      var o = ORDNINGER[sel];
      if (o.r === r && o.c === c) {
        placed[sel] = true;
        sist = { i: sel, html: "<b>Riktig.</b> " + esc(o.n) + " har " + KOL[c].toLowerCase() + " og " + RAD[r].toLowerCase() + ". " + o.d };
        sel = cSel = rSel = panelMsg = null;
        return true;
      }
      panelMsg = "Ikke der. " + hintFor(o, r, c);
      return false;
    }
    function drop(r, c) {
      if (sel == null) { say("Velg først en ordning i lista over tabellen.", ""); return; }
      var o = ORDNINGER[sel];
      if (proev(r, c)) { feilRute = null; say("<b>Riktig.</b> " + esc(o.n) + ". " + o.d, "ok"); }
      else {
        say("<b>Ikke der.</b> " + hintFor(o, r, c), "feil");
        feilRute = r + "," + c;
        setTimeout(function () { feilRute = null; cells.forEach(function (cl) { cl.td.classList.remove("iam-cell-feil"); }); }, 1400);
      }
      paint();
    }
    function vurder() {
      if (cSel != null && rSel != null) { var ok = proev(rSel, cSel); if (!ok) cSel = rSel = null; }
      else panelMsg = null;
      if (sel == null) say("", ""); /* riktig: kvitteringen står der ordningen sto */
      paint(true);
    }
    function panel() {
      var o = ORDNINGER[sel];
      var p = el("div", { class: "iam-pick", role: "group", "aria-label": "Plasser «" + o.n + "»" });
      function rad(navn, cur, on) {
        var row = el("div", { class: "iam-pick-r" }, [el("span", { class: "iam-pick-l", text: navn })]);
        ["Sentralisert", "Distribuert"].forEach(function (t, i) {
          row.appendChild(el("button", { type: "button", class: "btn sm", text: t, "aria-pressed": cur === i ? "true" : "false", onclick: function () { on(i); } }));
        });
        return row;
      }
      p.appendChild(rad("Navnerom", cSel, function (i) { cSel = i; vurder(); }));
      p.appendChild(rad("Autentisering", rSel, function (i) { rSel = i; vurder(); }));
      p.appendChild(panelMsg ? el("p", { class: "iam-pick-msg feil", text: panelMsg }) : el("p", { class: "iam-pick-msg muted", text: "Velg både navnerom og autentisering." }));
      return p;
    }
    function paint(fokus) {
      clear(chips);
      chips.appendChild(el("span", { class: "small muted", text: "Velg:" }));
      var left = 0;
      order.forEach(function (i) {
        var o = ORDNINGER[i];
        if (placed[i]) {
          if (sist && sist.i === i) chips.appendChild(el("p", { class: "iam-kvitt small", tabindex: "-1", html: sist.html }));
          return;
        }
        left++;
        chips.appendChild(el("button", { class: "btn sm", type: "button", text: o.n, "aria-pressed": sel === i ? "true" : "false",
          onclick: function () { sel = sel === i ? null : i; cSel = rSel = panelMsg = null; sist = null; paint(sel != null); if (sel != null) say("Hvor hører <b>" + esc(o.n) + "</b> hjemme? Velg i panelet, eller trykk «Plasser her» i tabellen.", ""); } }));
        if (sel === i) chips.appendChild(panel());
      });
      if (!left) chips.appendChild(el("span", { class: "small", text: "Alle er plassert." }));
      if (fokus) {
        var f = chips.querySelector(".iam-pick .btn[aria-pressed=false]") || chips.querySelector(".iam-kvitt");
        if (f) f.focus({ preventScroll: true });
      }
      cells.forEach(function (cl) {
        clear(cl.list);
        ORDNINGER.forEach(function (o, i) {
          if (placed[i] && o.r === cl.r && o.c === cl.c) cl.list.appendChild(el("span", { class: "iam-ok", text: o.n, title: o.d }));
        });
        cl.b.hidden = sel == null;
        cl.td.classList.toggle("iam-cell-feil", feilRute === cl.r + "," + cl.c);
      });
    }
    wrap.appendChild(chips); wrap.appendChild(msg); wrap.appendChild(tw); wrap.appendChild(tools);
    clear(host); host.appendChild(wrap);
    say(START, "");
    stokk();
    paint();
    return { paint: paint };
  }

  /* ---------- Bell-LaPadula ---------- */
  var NIV = ["BEGRENSET", "KONFIDENSIELT", "HEMMELIG", "STRENGT HEMMELIG"];
  function blp(host) {
    host = host$(host);
    if (!host) return null;
    var st = { maks: 2, akt: 2, obj: 1 };
    var wrap = el("div", { class: "iam-blp" });
    function mkSel(lbl, key) {
      var s = el("select", { "aria-label": lbl });
      NIV.forEach(function (n, i) { s.appendChild(el("option", { value: String(i), text: n })); });
      s.addEventListener("change", function () { st[key] = +s.value; klemt = st.akt > st.maks; if (klemt) st.akt = st.maks; paint(); });
      return s;
    }
    var sMaks = mkSel("Maks klarering", "maks"), sAkt = mkSel("Aktuelt nivå for økten", "akt"), sObj = mkSel("Dokumentets gradering", "obj");
    var ctl = el("div", { class: "iam-blp-ctl" }, [
      el("label", { class: "fld" }, [el("span", { text: "Maks klarering" }), sMaks]),
      el("label", { class: "fld" }, [el("span", { text: "Aktuelt nivå (økten)" }), sAkt]),
      el("label", { class: "fld" }, [el("span", { text: "Dokumentets gradering" }), sObj])
    ]);
    var klemt = false;
    var presets = el("div", { class: "btn-row" }, [el("span", { class: "small muted", text: "Eksempler:" })]);
    var PRE = [["Major Dahl, aktuelt HEMMELIG", 2, 2, 1], ["Major Dahl, aktuelt KONFIDENSIELT", 2, 1, 2], ["Maks STRENGT HEMMELIG, aktuelt BEGRENSET", 3, 0, 3]];
    var preBtns = PRE.map(function (p) {
      var b = el("button", { class: "btn sm", type: "button", text: p[0], "aria-pressed": "false", onclick: function () { st.maks = p[1]; st.akt = p[2]; st.obj = p[3]; klemt = false; paint(); } });
      b._p = p; presets.appendChild(b); return b;
    });
    var verdict = el("div", { class: "iam-blp-v", "aria-live": "polite" });
    var tw = el("div", { class: "iam-tw" }), tab = el("table", { class: "iam-blp-t" });
    tw.appendChild(tab);
    function yes(b) { return b ? '<span class="iam-y">✓ ja</span>' : '<span class="iam-n">✗ nei</span>'; }
    function paint() {
      sMaks.value = String(st.maks); sAkt.value = String(st.akt); sObj.value = String(st.obj);
      IN.qsa("option", sAkt).forEach(function (o) { o.disabled = +o.value > st.maks; });
      var a = st.akt, o = st.obj, les = o <= a, skr = o >= a;
      preBtns.forEach(function (b) { var p = b._p; b.setAttribute("aria-pressed", p[1] === st.maks && p[2] === a && p[3] === o ? "true" : "false"); });
      verdict.innerHTML = (klemt ? '<p class="small"><b>Merk:</b> aktuelt nivå kan ikke være over maks, så det er satt ned til ' + NIV[st.maks] + ".</p>" : "") +
        "<p><b>Lese " + NIV[o] + "?</b> " + yes(les) + " · " + (les ? "graderingen er på eller under aktuelt nivå (" + NIV[a] + ")." : "graderingen er over aktuelt nivå, og det ville vært å lese opp. Ikke les opp.") + "</p>" +
        "<p><b>Skrive i " + NIV[o] + "?</b> " + yes(skr) + " · " + (skr ? "graderingen er på eller over aktuelt nivå, så ingenting lekker nedover." : "graderingen er under aktuelt nivå, og det ville vært å skrive ned. Ikke skriv ned.") + "</p>" +
        "<p><b>Redigere (lese og skrive)?</b> " + yes(les && skr) + " · " + (les && skr ? "bare mulig når graderingen er lik aktuelt nivå." : "krever at graderingen er lik aktuelt nivå.") + "</p>" +
        (a < st.maks ? '<p class="small muted">Brukeren har valgt et lavere nivå enn maks for denne økten. Reglene sjekkes mot det aktuelle nivået, ikke mot maks.</p>' : "");
      clear(tab);
      tab.appendChild(el("thead", {}, [el("tr", {}, ["Gradering", "Lese", "Skrive", "Redigere"].map(function (h) { return el("th", { scope: "col", text: h }); }))]));
      var tb = el("tbody");
      for (var i = NIV.length - 1; i >= 0; i--) {
        (function (i) {
          var tr = el("tr", { class: (i === a ? "akt" : "") + (i === o ? " obj" : ""), title: "Velg " + NIV[i] + " som dokumentets gradering" });
          // Knapp i radoverskriften: raden kan velges med tastatur (Tab + Enter/Mellomrom), ikke bare med trykk på raden
          var rb = el("button", { type: "button", class: "iam-rad-b", "aria-pressed": i === o ? "true" : "false", "data-niv": String(i), text: NIV[i],
            "aria-label": "Velg " + NIV[i] + " som dokumentets gradering" });
          var rth = el("th", { scope: "row" }, [rb]);
          if (i === a) rth.insertAdjacentHTML("beforeend", ' <span class="tag">aktuelt</span>');
          if (i === st.maks && i !== a) rth.insertAdjacentHTML("beforeend", ' <span class="tag">maks</span>');
          tr.appendChild(rth);
          tr.appendChild(el("td", { html: yes(i <= a) }));
          tr.appendChild(el("td", { html: yes(i >= a) }));
          tr.appendChild(el("td", { html: yes(i === a) }));
          tr.addEventListener("click", function () {
            var fokus = document.activeElement === rb;
            st.obj = i; klemt = false; paint();
            if (fokus) { var nb = tab.querySelector('.iam-rad-b[data-niv="' + i + '"]'); if (nb) nb.focus(); }
          });
          tb.appendChild(tr);
        })(i);
      }
      tab.appendChild(tb);
    }
    wrap.appendChild(ctl); wrap.appendChild(presets); wrap.appendChild(verdict); wrap.appendChild(tw);
    wrap.appendChild(el("p", { class: "small muted", text: "Trykk på en rad for å velge den som dokumentets gradering. Raden med merket «aktuelt» er nivået økten kjører på." }));
    clear(host); host.appendChild(wrap);
    paint();
    return { paint: paint, state: st };
  }

  /* ---------- ABAC ---------- */
  function abac(host) {
    host = host$(host);
    if (!host) return null;
    var F = [
      { k: "rolle", kat: "Subjekt", lbl: "subjekt.rolle", v: ["lege", "sykepleier"] },
      { k: "savd", kat: "Subjekt", lbl: "subjekt.avdeling", v: ["kirurgi", "medisin"] },
      { k: "oavd", kat: "Objekt", lbl: "objekt.avdeling", v: ["kirurgi", "medisin"] },
      { k: "tid", kat: "Kontekst", lbl: "kontekst.tid", v: ["kl. 14 (på vakt)", "kl. 03 (ikke på vakt)"] },
      { k: "modus", kat: "Forespørsel", lbl: "forespørsel.modus", v: ["les", "skriv"] }
    ];
    var st = { rolle: 0, savd: 0, oavd: 0, tid: 0, modus: 0 };
    var wrap = el("div", { class: "iam-abac" });
    wrap.appendChild(el("p", { class: "mono iam-abac-pol", text: "TILLAT hvis subjekt.rolle = lege OG subjekt.avdeling = objekt.avdeling OG kontekst.tid er i vakta OG forespørsel.modus = les" }));
    var ctl = el("div", { class: "iam-blp-ctl" });
    F.forEach(function (f) {
      var s = el("select", { "aria-label": f.lbl });
      f.v.forEach(function (v, i) { s.appendChild(el("option", { value: String(i), text: v })); });
      s.addEventListener("change", function () { st[f.k] = +s.value; paint(); });
      ctl.appendChild(el("label", { class: "fld" }, [el("span", { html: f.lbl + ' <span class="tag">' + f.kat + "</span>" }), s]));
    });
    var out = el("div", { class: "iam-blp-v", "aria-live": "polite" });
    function ok(b) { return b ? '<span class="iam-y">✓</span>' : '<span class="iam-n">✗</span>'; }
    function paint() {
      var c = [
        ["Rollen er lege", st.rolle === 0, "subjektattributt"],
        ["Samme avdeling som journalen", st.savd === st.oavd, "subjekt- og objektattributt"],
        ["Forespørselen kommer i vakta", st.tid === 0, "kontekstattributt"],
        ["Tilgangsmodus er lesing", st.modus === 0, "forespørselsattributt"]
      ];
      var all = c.every(function (x) { return x[1]; });
      out.innerHTML = "<ul class=\"iam-abac-l\">" + c.map(function (x) { return "<li>" + ok(x[1]) + " " + x[0] + ' <span class="small muted">(' + x[2] + ")</span></li>"; }).join("") + "</ul>" +
        "<p><b>Beslutning: " + (all ? '<span class="iam-y">tilgang</span>' : '<span class="iam-n">avslag</span>') + "</b>" +
        (all ? "" : " · én betingelse som ikke holder, er nok til avslag.") + "</p>";
    }
    wrap.appendChild(ctl); wrap.appendChild(out);
    clear(host); host.appendChild(wrap);
    paint();
    return { paint: paint };
  }

  IN.iam = { seq: seq, modeller: modeller, kategorier: kategorier, blp: blp, abac: abac, NIV: NIV };
})();
