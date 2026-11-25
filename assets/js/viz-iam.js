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
    var W = Math.max(560, 150 * P.length), mx = 70, colW = (W - 2 * mx) / Math.max(1, P.length - 1);
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

  function seq(host, cfg) {
    host = host$(host);
    if (!host) return null;
    var M = cfg.meldinger;
    return IN.stepPlayer(host, {
      initial: [1], customInput: false, speed: 1600,
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
        ctx.stage.appendChild(drawSeq(cfg, s.k));
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
    var placed = {}, sel = null;
    var wrap = el("div", { class: "iam-kat" });
    var chips = el("div", { class: "btn-row iam-chips", role: "group", "aria-label": "Ordninger som skal plasseres" });
    var tw = el("div", { class: "iam-tw" }), tab = el("table", { class: "iam-2x2" });
    var msg = el("p", { class: "iam-msg small", "aria-live": "polite" });
    var tools = el("div", { class: "btn-row" }, [
      el("button", { class: "btn sm", type: "button", text: "Vis fasit", onclick: function () { ORDNINGER.forEach(function (o, i) { placed[i] = true; }); sel = null; paint(); say("Alle ordningene er plassert.", ""); } }),
      el("button", { class: "btn sm", type: "button", text: "↺ Nullstill", onclick: function () { placed = {}; sel = null; paint(); say("Velg en ordning, og trykk på ruta der den hører hjemme.", ""); } })
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
        var td = el("td", {}, [list, b]);
        cells.push({ r: r, c: c, list: list, b: b, td: td });
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });
    tab.appendChild(tb); tw.appendChild(tab);
    function say(t, cls) { msg.className = "iam-msg small" + (cls ? " " + cls : ""); msg.innerHTML = t; }
    function drop(r, c) {
      if (sel == null) { say("Velg først en ordning i lista over tabellen.", ""); return; }
      var o = ORDNINGER[sel];
      if (o.r === r && o.c === c) {
        placed[sel] = true; sel = null; paint();
        say("<b>Riktig: " + esc(o.n) + ".</b> " + o.d, "ok");
      } else {
        var hint = o.c !== c ? "Se på navnerommet: forvalter én aktør identifikatorene, eller mange?" : "Se på autentiseringen: kan flere aktører autentisere den samme brukeren?";
        say("<b>Ikke der.</b> " + hint, "feil");
      }
    }
    function paint() {
      clear(chips);
      chips.appendChild(el("span", { class: "small muted", text: "Velg:" }));
      var left = 0;
      ORDNINGER.forEach(function (o, i) {
        if (placed[i]) return;
        left++;
        chips.appendChild(el("button", { class: "btn sm", type: "button", text: o.n, "aria-pressed": sel === i ? "true" : "false",
          onclick: function () { sel = sel === i ? null : i; paint(); if (sel != null) say("Hvor hører <b>" + esc(o.n) + "</b> hjemme? Trykk på ruta.", ""); } }));
      });
      if (!left) chips.appendChild(el("span", { class: "small", text: "Alle er plassert." }));
      cells.forEach(function (cl) {
        clear(cl.list);
        ORDNINGER.forEach(function (o, i) {
          if (placed[i] && o.r === cl.r && o.c === cl.c) cl.list.appendChild(el("span", { class: "iam-ok", text: o.n, title: o.d }));
        });
        cl.b.hidden = sel == null;
      });
    }
    wrap.appendChild(chips); wrap.appendChild(tw); wrap.appendChild(msg); wrap.appendChild(tools);
    clear(host); host.appendChild(wrap);
    say("Velg en ordning, og trykk på ruta der den hører hjemme.", "");
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
      s.addEventListener("change", function () { st[key] = +s.value; if (st.akt > st.maks) st.akt = st.maks; paint(); });
      return s;
    }
    var sMaks = mkSel("Maks klarering", "maks"), sAkt = mkSel("Aktuelt nivå for økten", "akt"), sObj = mkSel("Dokumentets gradering", "obj");
    var ctl = el("div", { class: "iam-blp-ctl" }, [
      el("label", { class: "fld" }, [el("span", { text: "Maks klarering" }), sMaks]),
      el("label", { class: "fld" }, [el("span", { text: "Aktuelt nivå (økten)" }), sAkt]),
      el("label", { class: "fld" }, [el("span", { text: "Dokumentets gradering" }), sObj])
    ]);
    var presets = el("div", { class: "btn-row" }, [el("span", { class: "small muted", text: "Eksempler:" })]);
    [["Major Dahl, aktuelt HEMMELIG", 2, 2, 1], ["Major Dahl, aktuelt KONFIDENSIELT", 2, 1, 2], ["Maks STRENGT HEMMELIG, aktuelt BEGRENSET", 3, 0, 3]].forEach(function (p) {
      presets.appendChild(el("button", { class: "btn sm", type: "button", text: p[0], onclick: function () { st.maks = p[1]; st.akt = p[2]; st.obj = p[3]; paint(); } }));
    });
    var verdict = el("div", { class: "iam-blp-v", "aria-live": "polite" });
    var tw = el("div", { class: "iam-tw" }), tab = el("table", { class: "iam-blp-t" });
    tw.appendChild(tab);
    function yes(b) { return b ? '<span class="iam-y">✓ ja</span>' : '<span class="iam-n">✗ nei</span>'; }
    function paint() {
      sMaks.value = String(st.maks); sAkt.value = String(st.akt); sObj.value = String(st.obj);
      IN.qsa("option", sAkt).forEach(function (o) { o.disabled = +o.value > st.maks; });
      var a = st.akt, o = st.obj, les = o <= a, skr = o >= a;
      verdict.innerHTML =
        "<p><b>Lese " + NIV[o] + "?</b> " + yes(les) + " · " + (les ? "graderingen er på eller under aktuelt nivå (" + NIV[a] + ")." : "det ville vært å lese opp. Ikke les opp.") + "</p>" +
        "<p><b>Skrive i " + NIV[o] + "?</b> " + yes(skr) + " · " + (skr ? "graderingen er på eller over aktuelt nivå, så ingenting lekker nedover." : "det ville vært å skrive ned. Ikke skriv ned.") + "</p>" +
        "<p><b>Redigere (lese og skrive)?</b> " + yes(les && skr) + " · " + (les && skr ? "bare mulig når graderingen er lik aktuelt nivå." : "krever at graderingen er lik aktuelt nivå.") + "</p>" +
        (a < st.maks ? '<p class="small muted">Brukeren har valgt et lavere nivå enn maks for denne økten. Reglene sjekkes mot det aktuelle nivået, ikke mot maks.</p>' : "");
      clear(tab);
      tab.appendChild(el("thead", {}, [el("tr", {}, ["Gradering", "Lese", "Skrive", "Redigere"].map(function (h) { return el("th", { scope: "col", text: h }); }))]));
      var tb = el("tbody");
      for (var i = NIV.length - 1; i >= 0; i--) {
        (function (i) {
          var tr = el("tr", { class: (i === a ? "akt" : "") + (i === o ? " obj" : ""), title: "Velg " + NIV[i] + " som dokumentets gradering" });
          tr.appendChild(el("th", { scope: "row", html: NIV[i] + (i === a ? ' <span class="tag">aktuelt</span>' : "") + (i === st.maks && i !== a ? ' <span class="tag">maks</span>' : "") }));
          tr.appendChild(el("td", { html: yes(i <= a) }));
          tr.appendChild(el("td", { html: yes(i >= a) }));
          tr.appendChild(el("td", { html: yes(i === a) }));
          tr.addEventListener("click", function () { st.obj = i; paint(); });
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
