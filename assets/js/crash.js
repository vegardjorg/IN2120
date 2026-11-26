/* ============================================================
   IN2120 guide · crash.js
   Crash course-løypa (crash.html). Leser registeret IN.CRASH (data-crash.js) og henter alt innhold
   fra de felles datakildene, uten kopier:
     eksamenskort  IN.examBank.items() + IN.examBank.card()  (samme kort, Inspera-lagring in2120:insp:<key>)
     figurer       IN.fig.vis(host, key, { husk: true })     (IN.FIGURER + IN.FIG_HUSK)
     forklaringer  IN.FORKLAR[id](host)                      (figurer/forklar-a/b/c.js)
     tekst         IN.explain (følger den globale nivålinja)
   Hvert steg bygges først når det åpnes (lazy), så siden er lett også med hele banken.

   Fremdrift (IN.progress, in2120:fremdrift:v1):
     crash:state         { len: "E"|"S"|"G" }
     crash:steg:<id>     { status: "ok"|"ovmer" }
     kort:crash:<cid>    egenvurderingen i kortet (core.js cardKey). For at fremdriften skal være den samme
                         på alle sider, speiles den hit fra den nyeste av kort:<side>:<cid> når kortet bygges,
                         og en endring her speiles til kort:<blokkside>:<cid> og kort:eksamen:<cid>.
     Et kort regnes som løst når den nyeste kort:*:<cid> har status ok, eller (uten egenvurdering) når
     insp:*:<key> har full pott.
   Klassisk script. Lastes etter core.js, inspera.js, bank.js, eksamensbanken, figurene og data-crash.js.
   ============================================================ */
(function () {
  "use strict";
  var IN = window.IN || {};
  var el = IN.el, qs = IN.qs, qsa = IN.qsa;
  var C = IN.CRASH;

  function warn(m, e) { if (window.console) console.warn("crash: " + m, e || ""); }
  function safe(host, name, fn) {
    try { return fn(); } catch (e) {
      warn(name, e);
      if (host) host.appendChild(el("p", { class: "cr-mangler small", text: "Denne delen kunne ikke vises (" + name + ")." }));
      return null;
    }
  }
  function num(x) { return String(Math.round(x * 10) / 10).replace(".", ","); }

  /* ---------- Oppslag ---------- */
  var PAGE = {};
  (IN.PAGES || []).forEach(function (p) { PAGE[p.id] = p; });
  // Samme kobling blokk → side som forsiden (forside.js BLOCK2PAGE)
  var BLOCK2PAGE = { generelt: "grunnbegreper", fysisk: "grunnbegreper", lov: "angrep", krypto: "krypto", pki: "pki",
    angrep: "angrep", pentest: "angrep", system: "system", risiko: "risiko", utvikling: "risiko",
    autentisering: "autentisering", iam: "iam", nettverk: "nettverk", cyberops: "cyberops", ki: "cyberops" };
  var BANK = {};      // key → { ex, y, o }
  var CID2KEY = {};   // o-H2024-2_3 → H2024-2.3
  safe(null, "eksamensbanken", function () {
    IN.examBank.items({}).forEach(function (x) { BANK[x.o.key] = x; CID2KEY[cid(x.o.key)] = x.o.key; });
  });
  function cid(key) { return "o-" + String(key).replace(/[^A-Za-z0-9_-]/g, "_"); }
  function blockPage(key) { var x = BANK[key]; return (x && BLOCK2PAGE[x.o.block]) || null; }

  var STEPS = [], STEP = {};
  C.etapper.forEach(function (e) { e.steg.forEach(function (s) { s.etappe = e; STEPS.push(s); STEP[s.id] = s; }); });
  var LORDER = { E: 0, S: 1, G: 2 };
  var LEN = {}; C.lengder.forEach(function (l) { LEN[l.id] = l; });

  // Kontroll: hver banknøkkel i nøyaktig ett steg, og alle finnes
  (function () {
    var seen = {};
    STEPS.forEach(function (s) {
      ["E", "S", "G"].forEach(function (t) {
        (s.kort[t] || []).forEach(function (k) {
          if (!BANK[k]) warn("ukjent banknøkkel " + k + " i steg " + s.id);
          if (seen[k]) warn("banknøkkel " + k + " står i både " + seen[k] + " og " + s.id);
          seen[k] = s.id;
        });
      });
    });
    var miss = Object.keys(BANK).filter(function (k) { return !seen[k]; });
    if (miss.length) warn("banknøkler uten steg: " + miss.join(", "));
  })();

  /* ---------- Lagring ---------- */
  var P = IN.progress;
  function getLen() { var r = P.get("crash:state"); return r && LEN[r.len] ? r.len : null; }
  function curLen() { return getLen() || "E"; }
  function setLen(l) { P.set("crash:state", { len: l }); }
  function stepStatus(id) { var r = P.get("crash:steg:" + id); return (r && r.status) || null; }
  function inLen(s, l) { return LORDER[s.min] <= LORDER[l || curLen()]; }
  // Kortene steget viser i lengden l (kumulativt) og de ekstra
  function cardsFor(s, l) {
    l = l || curLen();
    var vis = [], ekstra = [];
    ["E", "S", "G"].forEach(function (t) { (s.kort[t] || []).forEach(function (k) { if (!BANK[k]) return; (LORDER[t] <= LORDER[l] ? vis : ekstra).push(k); }); });
    return { vis: vis, ekstra: ekstra };
  }

  /* Kanonisk status for et eksamenskort på tvers av sider */
  function cardStatus(key, all) {
    all = all || P.all();
    var c = cid(key), suf = ":" + c, best = null, ins = null;
    Object.keys(all).forEach(function (k) {
      var r = all[k];
      if (k.indexOf("kort:") === 0 && k.slice(-suf.length) === suf && k.split(":").length === 3) {
        if (!best || (r.t || 0) > (best.t || 0)) best = r;
      } else if (k.indexOf("insp:") === 0 && k.slice(-key.length - 1) === ":" + key && r.max) {
        var q = (r.best != null ? r.best : r.score || 0) / r.max;
        if (ins == null || q > ins) ins = q;
      }
    });
    if (best) return best.status || null;   // nyeste egenvurdering (også en angret) vinner
    if (ins != null) return ins >= 1 - 1e-9 ? "ok" : "ovmer";
    return null;
  }

  var syncing = false;
  function mirrorFromCrash(k, rec) {
    var c = k.slice("kort:crash:".length), key = CID2KEY[c];
    if (!key) return;
    var targets = ["kort:eksamen:" + c], bp = blockPage(key);
    if (bp) targets.push("kort:" + bp + ":" + c);
    syncing = true;
    try { targets.forEach(function (t) { P.set(t, { status: (rec && rec.status) || null }); }); }
    finally { syncing = false; }
  }
  /* Når kortet bygges: kort:crash, kort:eksamen og kort:<blokkside> får den nyeste statusen */
  function adoptToCrash(key) {
    var s = cardStatus(key), c = cid(key), bp = blockPage(key);
    var keys = ["kort:crash:" + c, "kort:eksamen:" + c].concat(bp ? ["kort:" + bp + ":" + c] : []);
    syncing = true;
    try {
      keys.forEach(function (k) {
        var r = P.get(k);
        if (((r && r.status) || null) !== s && (r || s)) P.set(k, { status: s });
      });
    } finally { syncing = false; }
  }

  /* ---------- Poeng og neste steg ---------- */
  function stepScore(s, l, all) {
    if (stepStatus(s.id) === "ok") return 1;
    var v = cardsFor(s, l).vis;
    if (!v.length) return 0;
    var ok = v.filter(function (k) { return cardStatus(k, all) === "ok"; }).length;
    return ok / v.length;
  }
  function cardMin(key) {
    var t = BANK[key].o.inspera && BANK[key].o.inspera.type;
    return t === "K" || t === "E" || !t ? 8 : 4;   // fritekst tar lengre tid
  }
  function stepMin(s, l) { return s.tid + cardsFor(s, l).vis.reduce(function (a, k) { return a + cardMin(k); }, 0); }
  function lenMin(l) { return STEPS.filter(function (s) { return inLen(s, l); }).reduce(function (a, s) { return a + stepMin(s, l); }, 0); }
  function fmtMin(m) { var h = Math.floor(m / 60), r = Math.round(m % 60 / 5) * 5; return h ? h + " t" + (r ? " " + r + " min" : "") : r + " min"; }
  function summary() {
    var l = curLen(), all = P.all(), got = 0, max = 0, done = 0, n = 0, next = null;
    STEPS.forEach(function (s) {
      if (!inLen(s, l)) return;
      n++; max += s.vekt;
      var sc = stepScore(s, l, all); got += s.vekt * sc;
      if (stepStatus(s.id) === "ok") done++; else if (!next) next = s;
    });
    return { l: l, got: got, max: max, done: done, n: n, next: next, pct: max ? Math.round(100 * got / max) : (n ? Math.round(100 * done / n) : 0) };
  }

  /* ---------- Sidehodet: lengde, fremdrift, start ---------- */
  var host = qs("#crash");
  if (!host || !C) return;
  var top = el("section", { class: "card cr-top ck-top", "aria-label": "Din løype" });
  var headline = el("p", { class: "cr-headline" });
  var bigbar = el("div", { class: "cr-bar big", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": "100", "aria-label": "Andel av forventede eksamenspoeng dekket" }, [el("span")]);
  var sub = el("p", { class: "cr-sub small muted" });
  var lenBox = el("div", { class: "cr-len", role: "group", "aria-label": "Velg lengde på løypa" });
  var lenTxt = el("p", { class: "cr-len-txt small" });
  var goBtn = el("button", { class: "btn primary cr-go-lg", type: "button" });
  var queueH = el("h2", { class: "cr-h", text: "Må øves mer" });
  var queue = el("ul", { class: "cr-qlist" });
  C.lengder.forEach(function (L) {
    var b = el("button", { class: "btn cr-len-btn", type: "button", "data-len": L.id },
      [el("b", { text: L.navn }), el("span", { text: L.omtrent })]);
    b.addEventListener("click", function () { setLen(L.id); });
    lenBox.appendChild(b);
  });
  goBtn.addEventListener("click", function () { var s = summary().next; if (s) openStep(s.id, true); else location.href = "eksamen.html"; });
  top.appendChild(headline); top.appendChild(bigbar); top.appendChild(sub);
  top.appendChild(lenBox); top.appendChild(lenTxt);
  top.appendChild(el("div", { class: "cr-actions" }, [goBtn]));
  top.appendChild(queueH); top.appendChild(queue);
  host.appendChild(top);

  /* ---------- Den faste linja ---------- */
  var stick = el("div", { class: "cr-stick", "data-sticky": "", role: "region", "aria-label": "Fremdrift i løypa" });
  var sBar = el("div", { class: "cr-bar", "aria-hidden": "true" }, [el("span")]);
  var sPct = el("span", { class: "cr-stick-pct" });
  var sAb = el("span", { class: "cr-stick-ab muted" });
  var sGo = el("button", { class: "btn sm primary cr-stick-go", type: "button" });
  var sLen = el("select", { class: "cr-stick-len", "aria-label": "Lengde på løypa" });
  C.lengder.forEach(function (L) { sLen.appendChild(el("option", { value: L.id, text: L.navn })); });
  sLen.addEventListener("change", function () { setLen(sLen.value); });
  sGo.addEventListener("click", function () { var s = summary().next; if (s) openStep(s.id, true); else location.href = "eksamen.html"; });
  stick.appendChild(el("div", { class: "cr-stick-in" }, [el("div", { class: "cr-stick-prog" }, [sBar, sPct, sAb]), sLen, sGo]));
  var mainEl = qs("#main");
  if (mainEl && mainEl.parentNode) mainEl.parentNode.insertBefore(stick, mainEl);
  function placeStick() { try { stick.style.top = (IN.stickyH(stick) - 8) + "px"; } catch (e) {} }
  window.addEventListener("resize", placeStick);
  setTimeout(placeStick, 0); setTimeout(placeStick, 400);

  /* ---------- Etappene og stegene ---------- */
  var stepEls = {}, etEls = [];
  var route = el("div", { class: "ck-route" });
  host.appendChild(route);
  C.etapper.forEach(function (E) {
    var sec = el("section", { class: "cr-etappe ck-etappe", id: "etappe-" + E.nr });
    var pts = el("span", { class: "cr-pts" });
    sec.appendChild(el("div", { class: "cr-ehead" }, [
      el("h2", {}, [el("span", { class: "cr-enr", text: String(E.nr) }), document.createTextNode(E.navn)]),
      el("span", { class: "small muted", text: E.hvor }), pts]));
    var eb = el("div", { class: "cr-bar", "aria-hidden": "true" }, [el("span")]);
    var ec = el("span", { class: "cr-ecount small muted" });
    sec.appendChild(el("div", { class: "cr-ebar-row" }, [eb, ec]));
    var list = el("div", { class: "cr-steps" });
    E.steg.forEach(function (s) { var d = stepNode(s); list.appendChild(d); stepEls[s.id] = d; });
    sec.appendChild(list);
    route.appendChild(sec);
    etEls.push({ E: E, sec: sec, bar: eb, count: ec, pts: pts });
  });

  function stepNode(s) {
    var d = el("details", { class: "cr-step ck-step", id: "steg-" + s.id });
    var ico = el("span", { class: "cr-sico", "aria-hidden": "true" });
    var stat = el("span", { class: "cr-sstat" });
    var meta = el("span", { class: "cr-smeta small" });
    d.appendChild(el("summary", { class: "cr-ssum" }, [ico, el("span", { class: "cr-sid", text: s.id }),
      el("span", { class: "cr-stit", text: s.tittel }), meta, stat]));
    var body = el("div", { class: "cr-sbody" });
    d.appendChild(body);
    d._s = s; d._ico = ico; d._meta = meta; d._stat = stat; d._body = body; d._built = null;
    d.addEventListener("toggle", function () {
      if (d.open && d._built !== curLen()) build(d);
      if (d.open) { try { history.replaceState(null, "", "#steg=" + s.id); } catch (e) {} P.set("crash:state", { sist: s.id }); }
    });
    return d;
  }

  function lesHref(l, s) {
    var p = PAGE[l[0]], h = p ? p.href : "index.html";
    return h + "#" + (l[1] ? "fane=" + l[1] + "&" : "") + "fra=crash&steg=" + s.id;
  }

  function build(d) {
    var s = d._s, b = d._body, l = curLen();
    IN.clear(b);
    d._built = l;
    if (s.hvorfor) b.appendChild(el("p", { class: "ck-hvorfor small" }, [el("b", { text: "Hvorfor: " }), document.createTextNode(s.hvorfor)]));
    if (!inLen(s, l)) b.appendChild(el("p", { class: "ck-utenfor small muted", text: "Steget er ikke med i " + LEN[l].navn + ". Ta det hvis du har tid." }));

    var kj = el("div", { class: "cr-kjerne" });
    b.appendChild(kj);
    safe(kj, "forklaring", function () { IN.explain(kj, s.kjerne); });

    if (s.kunne && s.kunne.length) {
      b.appendChild(el("h3", { class: "cr-h", text: "Dette må du kunne" }));
      var ul = el("ul", { class: "ck-kunne" });
      s.kunne.forEach(function (t) { ul.appendChild(el("li", { html: t })); });
      b.appendChild(ul);
    }
    if (s.feller && s.feller.length) {
      var fb = el("div", { class: "ck-feller", role: "note" }, [el("b", { text: "Feller" })]);
      var fu = el("ul");
      s.feller.forEach(function (t) { fu.appendChild(el("li", { html: t })); });
      fb.appendChild(fu); b.appendChild(fb);
    }
    (s.forklar || []).forEach(function (id) {
      var f = el("div", { class: "ck-forklar" });
      b.appendChild(f);
      safe(f, "forklaringsfigur " + id, function () { IN.FORKLAR[id](f); });
    });
    var figs = (s.fig || []).filter(function (k) { return IN.FIGURER && IN.FIGURER[k]; });
    if (figs.length) {
      var fd = el("details", { class: "ck-husk" }, [el("summary", { html: "Eksamensfigurer med huskeregel <span class=\"muted small\">(" + figs.length + ", røper svaret)</span>" })]);
      var fh = el("div", { class: "ck-figs" });
      fd.appendChild(fh);
      fd.addEventListener("toggle", function () {
        if (!fd.open || fh.childNodes.length) return;
        figs.forEach(function (k) { var w = el("div", { class: "ck-fig" }); fh.appendChild(w); safe(w, "figur " + k, function () { IN.fig.vis(w, k, { husk: true }); }); });
      });
      b.appendChild(fd);
    }

    var cs = cardsFor(s, l);
    if (cs.vis.length || cs.ekstra.length) {
      var pts = cs.vis.reduce(function (a, k) { return a + (+BANK[k].o.points || 0); }, 0);
      b.appendChild(el("h3", { class: "cr-h", html: "Eksamensoppgaver" + (cs.vis.length ? " <span class=\"muted small\">(" + cs.vis.length + ", " + num(pts) + " p)</span>" : "") }));
      var ch = el("div", { class: "ck-cards bank-cards" });
      b.appendChild(ch);
      cs.vis.forEach(function (k) { mountCard(ch, k); });
      if (cs.ekstra.length) {
        var xd = el("details", { class: "cr-ekstra" }, [el("summary", { text: "Flere eksamensoppgaver om dette (" + cs.ekstra.length + ")" })]);
        var xh = el("div", { class: "ck-cards bank-cards" });
        xd.appendChild(xh);
        xd.addEventListener("toggle", function () { if (xd.open && !xh.childNodes.length) cs.ekstra.forEach(function (k) { mountCard(xh, k); }); });
        b.appendChild(xd);
      }
    }

    // Begrepstips og symboler i det som nettopp er tegnet (begrep-tips.js kobler seg på IN.symbolTips)
    if (IN.symbolTips) setTimeout(function () { IN.symbolTips(b); }, 0);

    // Ferdig / øv mer / neste
    var bOk = el("button", { class: "btn ck-done", type: "button", text: "✓ Ferdig med steget" });
    var bOv = el("button", { class: "btn ck-ovmer", type: "button", text: "↻ Må øve mer" });
    var bNx = el("button", { class: "btn primary ck-next", type: "button", text: "Neste steg →" });
    function pick(v) { P.set("crash:steg:" + s.id, { status: stepStatus(s.id) === v ? null : v }); }
    bOk.addEventListener("click", function () { var was = stepStatus(s.id) === "ok"; pick("ok"); if (!was) { var n = nextAfter(s); if (n) { d.open = false; openStep(n.id, true); } } });
    bOv.addEventListener("click", function () { pick("ovmer"); });
    bNx.addEventListener("click", function () { var n = nextAfter(s); if (n) openStep(n.id, true); else location.href = "eksamen.html"; });
    d._bOk = bOk; d._bOv = bOv; d._bNx = bNx;
    b.appendChild(el("div", { class: "cr-actions ck-stepbar", role: "group", "aria-label": "Steg " + s.id }, [bOk, bOv, bNx]));

    if (s.les && s.les.length) {
      var lp = el("p", { class: "cr-lesmer small" }, [el("span", { class: "muted", text: "Les mer: " })]);
      s.les.forEach(function (x, i) {
        if (i) lp.appendChild(document.createTextNode(" · "));
        lp.appendChild(el("a", { href: lesHref(x, s), text: x[2] }));
      });
      b.appendChild(lp);
    }
    paintStep(d);
  }

  function mountCard(h, key) {
    safe(h, "eksamenskort " + key, function () {
      adoptToCrash(key);
      IN.examBank.card(h, BANK[key]);
    });
  }

  function nextAfter(s) {
    var i = STEPS.indexOf(s), l = curLen();
    for (var j = i + 1; j < STEPS.length; j++) if (inLen(STEPS[j], l) && stepStatus(STEPS[j].id) !== "ok") return STEPS[j];
    for (j = 0; j < i; j++) if (inLen(STEPS[j], l) && stepStatus(STEPS[j].id) !== "ok") return STEPS[j];
    return null;
  }

  function openStep(id, scroll) {
    var d = stepEls[id];
    if (!d) return;
    if (!d.open) d.open = true;
    else if (d._built !== curLen()) build(d);
    if (scroll) setTimeout(function () {
      var y = d.getBoundingClientRect().top + window.pageYOffset - IN.stickyH();
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      var sm = d.querySelector("summary"); if (sm) try { sm.focus({ preventScroll: true }); } catch (e) {}
    }, 30);
  }

  /* ---------- Maling ---------- */
  function paintStep(d, all, l) {
    var s = d._s; l = l || curLen(); all = all || P.all();
    var st = stepStatus(s.id), cs = cardsFor(s, l);
    var ok = cs.vis.filter(function (k) { return cardStatus(k, all) === "ok"; }).length;
    var ov = cs.vis.filter(function (k) { return cardStatus(k, all) === "ovmer"; }).length;
    d._ico.className = "cr-sico" + (st === "ok" ? " ok" : st === "ovmer" ? " q" : ok ? " half" : "");
    d._ico.textContent = st === "ok" ? "✓" : st === "ovmer" ? "↻" : "";
    d._stat.textContent = st === "ok" ? "Ferdig" : st === "ovmer" ? "Må øve mer" : "Ikke ferdig";
    var inl = inLen(s, l);
    d.classList.toggle("cr-ekstra-steg", !inl);
    IN.clear(d._meta);
    if (s.vekt) d._meta.appendChild(el("span", { class: "cr-pts", text: "≈ " + s.vekt + " p" }));
    d._meta.appendChild(el("span", { class: "muted", text: fmtMin(stepMin(s, l)) }));
    if (cs.vis.length) d._meta.appendChild(el("span", { class: "muted", text: ok + "/" + cs.vis.length + " oppg." + (ov ? " · " + ov + " ↻" : "") }));
    if (!inl) d._meta.appendChild(el("span", { class: "cr-min", text: s.min === "S" ? "Standard" : "Grundig" }));
    if (d._bOk) {
      d._bOk.setAttribute("aria-pressed", st === "ok" ? "true" : "false");
      d._bOv.setAttribute("aria-pressed", st === "ovmer" ? "true" : "false");
      d._bNx.textContent = nextAfter(s) ? "Neste steg →" : "Øv på et helt sett →";
    }
  }

  var raf = 0;
  function paintSoon() { if (!raf) raf = (window.requestAnimationFrame || setTimeout)(function () { raf = 0; paint(); }); }
  function paint() {
    var all = P.all(), S = summary(), l = S.l, L = LEN[l];
    qsa(".cr-len-btn", lenBox).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-len") === l ? "true" : "false"); });
    sLen.value = l;
    lenTxt.textContent = L.tekst + " Beregnet tid: " + fmtMin(lenMin(l)) + ".";
    var fresh = !getLen() && !S.done && S.got === 0;
    top.classList.toggle("is-fresh", fresh);
    headline.textContent = fresh ? "Velg lengde, og start løypa." :
      "Du har dekket " + num(S.got) + " av ≈ " + S.max + " forventede eksamenspoeng.";
    bigbar.firstChild.style.width = S.pct + "%";
    bigbar.setAttribute("aria-valuenow", String(S.pct));
    sub.textContent = S.done + " av " + S.n + " steg ferdige i " + L.navn + ". Poengene er vektet etter eksamenene H2021–H2025: et steg teller fullt når du merker det ferdig, ellers etter andelen eksamensoppgaver du har fått til.";
    goBtn.textContent = S.next ? (fresh ? "Start løypa →" : "Fortsett: " + S.next.id + " " + S.next.tittel + " →") : "Alt ferdig. Øv på et helt sett →";
    sBar.firstChild.style.width = S.pct + "%";
    sPct.textContent = S.pct + " %";
    sAb.textContent = S.done + "/" + S.n + " steg";
    sGo.textContent = S.next ? "Neste: " + S.next.id + " →" : "Helt sett →";

    // Repetisjonskø
    IN.clear(queue);
    var q = STEPS.filter(function (s) {
      if (stepStatus(s.id) === "ovmer") return true;
      return inLen(s, l) && cardsFor(s, l).vis.some(function (k) { return cardStatus(k, all) === "ovmer"; });
    });
    queueH.hidden = queue.hidden = !q.length;
    q.forEach(function (s) {
      var n = cardsFor(s, l).vis.filter(function (k) { return cardStatus(k, all) === "ovmer"; }).length;
      var a = el("a", { href: "#steg=" + s.id, text: s.id + " " + s.tittel });
      a.addEventListener("click", function (e) { e.preventDefault(); openStep(s.id, true); });
      queue.appendChild(el("li", {}, [a, n ? el("span", { class: "cr-pts", text: n + " oppg. ↻" }) : null]));
    });

    etEls.forEach(function (x) {
      var st = x.E.steg.filter(function (s) { return inLen(s, l); }), v = 0, g = 0, dn = 0;
      st.forEach(function (s) { v += s.vekt; g += s.vekt * stepScore(s, l, all); if (stepStatus(s.id) === "ok") dn++; });
      x.sec.classList.toggle("cr-utenfor", !st.length);
      x.pts.textContent = v ? "≈ " + v + " p" : "";
      x.bar.firstChild.style.width = (v ? Math.round(100 * g / v) : (st.length ? Math.round(100 * dn / st.length) : 0)) + "%";
      x.count.textContent = st.length ? dn + "/" + st.length + " steg" : "ikke med i " + L.navn;
    });
    Object.keys(stepEls).forEach(function (id) {
      var d = stepEls[id];
      if (d._built && d._built !== l) { if (d.open) build(d); else { d._built = null; IN.clear(d._body); } }
      paintStep(d, all, l);
    });
  }

  document.addEventListener("in:progress", function (e) {
    var k = e.detail && e.detail.key;
    if (k && !syncing && k.indexOf("kort:crash:") === 0) mirrorFromCrash(k, e.detail.rec);
    paintSoon();
  });
  window.addEventListener("storage", function (e) { if (!e.key || e.key === P.KEY) paintSoon(); });

  /* ---------- Flytt og nullstill ---------- */
  var tools = el("details", { class: "cr-transfer ck-tools card" }, [el("summary", { text: "Flytt eller nullstill fremdriften" })]);
  var tb = el("div", { class: "cr-transfer-body" });
  var code = el("textarea", { class: "cr-code", rows: "3", "aria-label": "Fremdriftskode", placeholder: "Lim inn en fremdriftskode her" });
  var res = el("p", { class: "small", role: "status", "aria-live": "polite" });
  tb.appendChild(el("p", { class: "small muted", text: "Koden inneholder all fremdrift i guiden (løypa, eksamenskortene og øvingene), så du kan flytte den til en annen nettleser." }));
  tb.appendChild(code);
  tb.appendChild(el("div", { class: "btn-row" }, [
    el("button", { class: "btn", type: "button", text: "Lag kode", onclick: function () { code.value = P.exportCode(); code.select(); res.textContent = "Koden er laget. Kopier den."; } }),
    el("button", { class: "btn", type: "button", text: "Hent fra kode", onclick: function () {
      res.textContent = code.value.trim() && P.importCode(code.value) ? "Fremdriften er hentet." : "Koden kunne ikke leses."; } }),
    el("button", { class: "btn cr-reset", type: "button", text: "↺ Nullstill løypa", onclick: function () {
      if (!window.confirm("Nullstille lengdevalget og «ferdig»/«øv mer» på stegene? Eksamenskortene og svarene dine beholdes.")) return;
      var a = P.all();
      Object.keys(a).forEach(function (k) { if (k.indexOf("crash:") === 0) delete a[k]; });
      IN.store.set(P.KEY, JSON.stringify(a));
      try { document.dispatchEvent(new CustomEvent("in:progress", { detail: { key: null, rec: null } })); } catch (e) {}
      res.textContent = "Løypa er nullstilt.";
    } })
  ]));
  tb.appendChild(res);
  tools.appendChild(tb);
  host.appendChild(tools);

  /* ---------- Start ---------- */
  paint();
  function fromHash() {
    var m = (location.hash || "").match(/steg=([\w-]+)/);
    if (m && stepEls[m[1]]) openStep(m[1], true);
  }
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
