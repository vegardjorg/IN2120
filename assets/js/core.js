/* ============================================================
   IN2120 guide · core.js  (kopiert fra IN2090-guiden 2026-11-25, opprinnelig IN2010; eies nå av 2120)
   Navigasjon, faner, DOM-hjelpere, quiz. Klassisk script.
   Alt henger på window.IN. Ingen avhengigheter, virker fra file://.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});

  /* ---------- DOM-hjelpere ---------- */
  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, k)) continue;
        var v = attrs[k];
        if (v == null) continue;
        if (k === "class" || k === "className") e.className = v;
        else if (k === "html") e.innerHTML = v;
        else if (k === "text") e.textContent = v;
        else if (k === "dataset") { for (var d in v) e.dataset[d] = v[d]; }
        else if (k.slice(0, 2) === "on" && typeof v === "function") e.addEventListener(k.slice(2), v);
        else if (v === true) e.setAttribute(k, "");
        else if (v !== false) e.setAttribute(k, v);
      }
    }
    if (children != null) append(e, children);
    return e;
  }
  function append(parent, child) {
    if (child == null) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(parent, c); }); return; }
    if (typeof child === "string" || typeof child === "number")
      parent.appendChild(document.createTextNode(String(child)));
    else parent.appendChild(child);
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  IN.el = el; IN.qs = qs; IN.qsa = qsa; IN.clear = clear; IN.append = append;

  /* ---------- Sider / navigasjon ---------- */
  IN.PAGES = [
    /* ready:false = vises nedtonet i menyen som «kommer», uten lenke. Sett true når siden er bygget. */
    { id: "index",         href: "index.html",               label: "Forside",                ready: true },
    { id: "eksamen",       href: "eksamen.html",             label: "Øv på et helt sett",     ready: true },
    { id: "grunnbegreper", href: "01-grunnbegreper.html",    label: "1 · Grunnbegreper og fysisk", ready: true },
    { id: "krypto",        href: "02-krypto.html",           label: "2 · Kryptografi",        ready: true },
    { id: "pki",           href: "03-pki.html",              label: "3 · PKI",                ready: true },
    { id: "angrep",        href: "04-angrep.html",           label: "4 · Angrep og pentest",  ready: true },
    { id: "system",        href: "05-system.html",           label: "5 · Systemsikkerhet",    ready: true },
    { id: "risiko",        href: "06-risiko.html",           label: "6 · Risiko og styring",  ready: true },
    { id: "autentisering", href: "07-autentisering.html",    label: "7 · Autentisering",      ready: true },
    { id: "iam",           href: "08-iam.html",              label: "8 · IAM",                ready: true },
    { id: "nettverk",      href: "09-nettverk.html",         label: "9 · Nettverk",          ready: true },
    { id: "cyberops",      href: "10-cyberops-ki.html",      label: "10 · Cyberops og KI",    ready: true },
    { id: "verktoy",       href: "verktoy.html",             label: "Verktøyene",             ready: true },
    { id: "crash",         href: "crash.html",               label: "Crash course",           ready: true }
  ];

  function buildNav() {
    var host = qs("#topnav");
    if (!host) return;
    var active = document.body.getAttribute("data-page");
    var row = el("div", { class: "nav-row" });
    var inner = el("div", { class: "nav-inner" });
    // Merket står utenfor den rullbare lenkeraden, så det aldri rulles ut av syne når aktiv side sentreres.
    row.appendChild(el("a", { class: "nav-brand", href: "index.html",
      html: 'IN<span>2120</span>' }));
    IN.PAGES.forEach(function (p) {
      if (p.id === "index") return; // merket forside = brand
      var cls = "navlink" + (p.id === active ? " active" : "") + (p.ready ? "" : " kommer");
      inner.appendChild(el("a", {
        class: cls, href: p.ready ? p.href : null,
        // Menyen viser bare navnet («Sortering»), ikke blokknummeret – kortere og nok til å finne fram.
        "aria-current": p.id === active ? "page" : null, text: String(p.label).replace(/^\d+\s*·\s*/, "")
      }));
    });
    // Temaknapp ligger helt ute til siden (utenfor lenkeraden), med luft, så den ikke er i veien for menyen.
    row.appendChild(inner);
    clear(host);
    host.appendChild(row);
    host.appendChild(buildThemeToggle());

    // Vis vannrett scroll-hint (uttoning) på menyen bare når lenkene faktisk er bredere enn plassen.
    function syncNavScroll() {
      var over = inner.scrollWidth > inner.clientWidth + 2;
      inner.classList.toggle("scroll-x", over);
      // Uttoning bare på den siden der det finnes flere lenker
      inner.classList.toggle("fade-l", over && inner.scrollLeft > 2);
      inner.classList.toggle("fade-r", over && inner.scrollLeft + inner.clientWidth < inner.scrollWidth - 2);
    }
    syncNavScroll();
    // Mobil: rull aktiv side inn i menyen, så man ser hvor man er
    var act = qs(".navlink.active", inner);
    // Kjøres på nytt når skrift og layout er ferdig lastet – ellers kan aktiv lenke havne delvis utenfor.
    function centerActive() {
      if (!act || inner.scrollWidth <= inner.clientWidth) return;
      var ar = act.getBoundingClientRect(), ir = inner.getBoundingClientRect();
      inner.scrollLeft += (ar.left - ir.left) - (inner.clientWidth - ar.width) / 2;
      syncNavScroll();
    }
    centerActive();
    if (document.readyState !== "complete") window.addEventListener("load", centerActive);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(centerActive);
    window.addEventListener("resize", syncNavScroll);
    inner.addEventListener("scroll", syncNavScroll);
  }

  /* ---------- Tema (lys/mørk/system) ---------- */
  function currentTheme() { return document.documentElement.getAttribute("data-theme") || "system"; }
  function applyTheme(mode) {
    if (mode === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
    IN.store.set("in-theme", mode);
  }
  function themeIcon(mode) { return mode === "dark" ? "🌙" : mode === "light" ? "☀️" : "🖥️"; }
  function themeLabel(mode) {
    return "Tema: " + (mode === "dark" ? "mørkt" : mode === "light" ? "lyst" : "som systemet") + ". Trykk for å bytte.";
  }
  function buildThemeToggle() {
    // Lyst er standard (settes i <head> på hver side). Mørkt og «som systemet» velges aktivt.
    var modes = ["light", "dark", "system"];
    var btn = el("button", {
      class: "theme-toggle", type: "button", title: "Bytt tema (lys → mørk → som systemet)",
      "aria-label": themeLabel(currentTheme()), text: themeIcon(currentTheme())
    });
    btn.addEventListener("click", function () {
      var next = modes[(modes.indexOf(currentTheme()) + 1) % modes.length];
      applyTheme(next); btn.textContent = themeIcon(next);
      btn.setAttribute("aria-label", themeLabel(next));
    });
    return btn;
  }
  IN.applyTheme = applyTheme;

  /* ---------- Forklaringsnivå (5-åring / Normalt / Teknisk) ---------- */
  IN.LEVELS = [
    { id: "eli5",    label: "Som for en 5-åring", short: "5-åring" },
    { id: "normal",  label: "Normalt",            short: "Normalt" },
    { id: "teknisk", label: "Teknisk",            short: "Teknisk" }
  ];
  var levelListeners = [];
  function levelGet() {
    var l = document.documentElement.getAttribute("data-level");
    return (l === "eli5" || l === "normal" || l === "teknisk") ? l : "normal";
  }
  function levelSet(id) {
    if (id !== "eli5" && id !== "normal" && id !== "teknisk") return;
    document.documentElement.setAttribute("data-level", id);
    IN.store.set("in-level", id);
    levelListeners.forEach(function (fn) { try { fn(id); } catch (e) {} });
    try { window.dispatchEvent(new CustomEvent("in:level", { detail: id })); } catch (e) {}
  }
  IN.level = {
    get: levelGet,
    set: levelSet,
    onChange: function (fn) { levelListeners.push(fn); return fn; },
    // Velg riktig variant ut fra et objekt {eli5?, normal?, teknisk?} eller en ren streng.
    pick: function (val, lvl) {
      lvl = lvl || levelGet();
      if (val == null) return "";
      if (typeof val === "string") return val;
      return val[lvl] != null ? val[lvl]
        : val.normal != null ? val.normal
        : val.teknisk != null ? val.teknisk
        : val.eli5 != null ? val.eli5 : "";
    }
  };

  /* Lokal nivåbryter: følger toppen ("auto") til et nivå velges lokalt.
     Returnerer { el, get(), onChange(fn), setLocal(v|null) }. */
  IN.levelScope = function (opts) {
    opts = opts || {};
    var local = opts.initial || null; // null = auto (følg toppen)
    var listeners = [];
    var ctrl = el("div", { class: "level-mini", role: "group", "aria-label": "Forklaringsnivå for dette feltet" });
    var btns = {};
    IN.LEVELS.forEach(function (L) {
      var b = el("button", { class: "seg-btn", type: "button", "data-lv": L.id, text: L.short, title: L.label });
      b.addEventListener("click", function () { setLocal(L.id); });
      btns[L.id] = b; ctrl.appendChild(b);
    });
    var reset = el("button", { class: "seg-btn reset", type: "button", title: "Følg toppnivået igjen", "aria-label": "Tilbake til nivået øverst på siden", text: "↺", hidden: true });
    reset.addEventListener("click", function () { setLocal(null); });
    ctrl.appendChild(reset);
    function eff() { return local || levelGet(); }
    function sync() {
      var e = eff();
      IN.LEVELS.forEach(function (L) {
        var on = L.id === e;
        btns[L.id].classList.toggle("on", on);
        btns[L.id].setAttribute("aria-pressed", on ? "true" : "false");
      });
      reset.hidden = (local == null);
      ctrl.classList.toggle("pinned", local != null);
    }
    function fire() { sync(); listeners.forEach(function (fn) { try { fn(eff()); } catch (e) {} }); }
    function setLocal(v) { local = v; fire(); }
    levelListeners.push(function () { if (local == null) fire(); });
    sync();
    return { el: ctrl, get: eff, onChange: function (fn) { listeners.push(fn); return fn; }, setLocal: setLocal };
  };

  /* Nivåstyrt tekstblokk. Følger nivået øverst på siden; egen lokal bryter bare med noSwitch: false.
     variants: { eli5?, normal?, teknisk? } (streng-HTML eller DOM-node). opts: { label, initial, noSwitch } */
  IN.explain = function (host, variants, opts) {
    if (typeof host === "string") host = qs(host);
    opts = opts || {};
    var block = el("div", { class: "explain-block" });
    var scope = IN.levelScope({ initial: opts.initial || null });
    // Standard (IN2010 F8): ingen lokal nivåbryter, teksten følger nivået øverst på siden (én global,
    // høyst én lokal per demo). Lokal bryter bare når kallet ber om det med noSwitch: false.
    var withSwitch = opts.noSwitch === false;
    // «Nivå:» var bare en merkelapp for bryteren; uten bryter sier den ingenting.
    var label = opts.label && !(!withSwitch && /^nivå:?$/i.test(String(opts.label).trim())) ? opts.label : null;
    var bar = el("div", { class: "explain-bar" }, [
      label ? el("span", { class: "explain-label", text: label }) : null,
      withSwitch ? scope.el : null
    ]);
    var bodyEl = el("div", { class: "explain-body" });
    if (label || withSwitch) block.appendChild(bar);
    block.appendChild(bodyEl);
    function paint() {
      var v = IN.level.pick(variants, scope.get());
      clear(bodyEl);
      if (v == null || v === "") { bodyEl.appendChild(el("p", { class: "muted small", text: "(ingen forklaring på dette nivået)" })); return; }
      if (v && v.nodeType) bodyEl.appendChild(v);
      else bodyEl.innerHTML = String(v);
      IN.symbolTips(bodyEl);
    }
    scope.onChange(paint); paint();
    clear(host); host.appendChild(block);
    return { el: block, paint: paint, scope: scope };
  };

  function buildLevelBar() {
    var nav = qs("#topnav");
    if (!nav) return;
    var bar = qs("#levelbar");
    if (!bar) {
      bar = el("div", { id: "levelbar" });
      nav.parentNode.insertBefore(bar, nav.nextSibling);
    }
    var cur = levelGet();
    var group = el("div", { class: "level-seg", role: "radiogroup", "aria-label": "Forklaringsnivå" });
    IN.LEVELS.forEach(function (L) {
      var b = el("button", {
        class: "seg-btn" + (L.id === cur ? " on" : ""), type: "button", role: "radio",
        "aria-checked": L.id === cur ? "true" : "false", "data-level-id": L.id,
        html: '<span class="seg-full">' + L.label + '</span><span class="seg-short">' + L.short + '</span>'
      });
      b.addEventListener("click", function () { levelSet(L.id); });
      group.appendChild(b);
    });
    /* «Svar med en gang» (IN.svarStraks) for hele siden: quiz, sant/usant, dra og Inspera følger den.
       <body data-straks="av"> (eksamen.html i eksamensmodus): bryteren er låst (🔒, aria-disabled) og står av, så den
       ikke lekker fasit midt i en simulert eksamen. Trykk på den låste bryteren kaller IN.svarStraks.onLaast() hvis
       siden har satt den (eksamen.html: bekreftelsesdialog «Bytte til øvingsmodus?»). Attributtet kan endres mens
       siden er åpen: da sendes in:svar-straks, og alt som følger bryteren (også inspera.js) tegner seg på nytt. */
    var sw = el("button", { class: "qz-switch level-straks", type: "button", role: "switch", "aria-checked": "false",
      onclick: function () {
        if (IN.svarStraks.laast()) { if (typeof IN.svarStraks.onLaast === "function") IN.svarStraks.onLaast(sw); return; }
        IN.svarStraks.set(!IN.svarStraks.get());
      } }, [
      el("span", { class: "qz-track", "aria-hidden": "true" }, el("span", { class: "qz-thumb" })),
      el("span", { class: "level-laas", "aria-hidden": "true", text: "🔒" }),
      el("span", { class: "seg-full", text: "Svar med en gang" }),
      el("span", { class: "seg-short", text: "Svar straks" })]);
    function syncSw() {
      var laast = IN.svarStraks.laast();
      sw.setAttribute("aria-checked", !laast && IN.svarStraks.get() ? "true" : "false");
      sw.classList.toggle("is-laast", laast);
      if (laast) sw.setAttribute("aria-disabled", "true"); else sw.removeAttribute("aria-disabled");
      sw.title = laast ? "Låst i eksamensmodus: du får svaret når du retter. Trykk for å bytte til øvingsmodus."
        : "Vis om svaret er riktig med en gang du svarer (quiz, sant/usant, dra og Inspera-oppgaver)";
    }
    syncSw();
    document.addEventListener("in:svar-straks", syncSw);
    if (window.MutationObserver && document.body) new MutationObserver(function () { straksEvent(IN.svarStraks.get() && !IN.svarStraks.laast()); })
      .observe(document.body, { attributes: true, attributeFilter: ["data-straks"] });
    var inner = el("div", { class: "level-inner" }, [
      el("span", { class: "level-label", text: "Forklaringsnivå" }),
      group,
      el("span", { class: "level-hint muted small" }),
      sw
    ]);
    clear(bar); bar.appendChild(inner);

    function syncButtons(id) {
      qsa(".seg-btn", group).forEach(function (b) {
        var on = b.getAttribute("data-level-id") === id;
        b.classList.toggle("on", on);
        b.setAttribute("aria-checked", on ? "true" : "false");
      });
      var hints = { eli5: "Mest detaljert – hvert steg forklart.", normal: "Balansert forklaring.", teknisk: "Kort og presist, med kjøretid." };
      qs(".level-hint", bar).textContent = hints[id] || "";
    }
    syncButtons(cur);
    levelListeners.push(syncButtons);
    // piltaster i segmentbryteren
    group.addEventListener("keydown", function (ev) {
      var dir = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      ev.preventDefault();
      var ids = IN.LEVELS.map(function (L) { return L.id; });
      var ni = (ids.indexOf(levelGet()) + dir + ids.length) % ids.length;
      levelSet(ids[ni]);
      qsa(".seg-btn", group)[ni].focus();
    });
  }

  /* ---------- Faner (tabs) ---------- */
  // Markup: container med .tabs (knapper med [data-tab=id]) og paneler [data-panel=id].
  IN.tabs = function (root) {
    root = root || document;
    var bar = qs(".tabs", root);
    if (!bar) return;
    var btns = qsa('[data-tab]', bar);
    var panels = qsa('[data-panel]', root);

    function activate(id, push) {
      btns.forEach(function (b) {
        var on = b.getAttribute("data-tab") === id;
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach(function (p) {
        p.hidden = p.getAttribute("data-panel") !== id;
      });
      if (push) {
        try { history.replaceState(null, "", "#fane=" + id); } catch (e) {
          location.hash = "fane=" + id;
        }
      }
      // la demoer o.l. reagere på at de blir synlige
      var panel = panels.filter(function (p) { return p.getAttribute("data-panel") === id; })[0];
      if (panel) panel.dispatchEvent(new CustomEvent("in:shown", { bubbles: true }));
      // Fanelinja scroller vannrett på mobil: hold aktiv fane synlig
      if (bar.scrollWidth > bar.clientWidth) {
        var ab = btns.filter(function (b) { return b.getAttribute("data-tab") === id; })[0];
        if (ab) {
          var br = ab.getBoundingClientRect(), rr = bar.getBoundingClientRect();
          if (br.left < rr.left || br.right > rr.right) bar.scrollLeft += br.left - rr.left - 16;
        }
      }
    }

    btns.forEach(function (b, i) {
      b.setAttribute("role", "tab");
      b.addEventListener("click", function () { activate(b.getAttribute("data-tab"), true); });
      b.addEventListener("keydown", function (ev) {
        var dir = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        ev.preventDefault();
        var ni = (i + dir + btns.length) % btns.length;
        btns[ni].focus(); activate(btns[ni].getAttribute("data-tab"), true);
      });
    });
    panels.forEach(function (p) { p.setAttribute("role", "tabpanel"); });

    var fromHash = (location.hash.match(/fane=([\w-]+)/) || [])[1];
    var ids = btns.map(function (b) { return b.getAttribute("data-tab"); });

    // B6 (UI/UX 2026-11-26): nederst i hvert panel «↑ Til fanene» og «Neste: <fane> →».
    // Fane-id-er og lenker endres ikke. Lenka legges til her og flyttes sist i panelet igjen etter lasting
    // (sidens egne skript fyller vertene inne i panelet).
    function toBar(id) {
      var top = bar.getBoundingClientRect().top + window.pageYOffset - (IN.stickyH ? IN.stickyH() : 0) - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      var b = btns.filter(function (x) { return x.getAttribute("data-tab") === id; })[0];
      if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } }
    }
    var bunner = [];
    panels.forEach(function (p) {
      var id = p.getAttribute("data-panel"), i = ids.indexOf(id);
      if (i < 0 || p.querySelector(":scope > .tab-bunn")) return;
      var nx = ids[i + 1], nb = nx && btns[i + 1];
      var nav = el("nav", { class: "tab-bunn", "aria-label": "Bytt fane" }, [
        el("button", { class: "btn tab-opp", type: "button", text: "↑ Til fanene", onclick: function () { toBar(id); } }),
        nx ? el("button", { class: "btn tab-neste", type: "button", "data-neste": nx,
          text: "Neste: " + (nb.textContent || "").replace(/\s+/g, " ").trim() + " →",
          onclick: function () { activate(nx, true); toBar(nx); } }) : null
      ]);
      p.appendChild(nav);
      bunner.push(nav);
    });
    function bunnSist() { bunner.forEach(function (n) { var p = n.parentNode; if (p && p.lastElementChild !== n) p.appendChild(n); }); }
    if (document.readyState === "complete") setTimeout(bunnSist, 0); else window.addEventListener("load", bunnSist);
    var start = (fromHash && ids.indexOf(fromHash) >= 0) ? fromHash : ids[0];
    activate(start, false);

    // Dyplenke til en eksamensoppgave: #fane=<fane>&oppg=<element-id eller kanonisk nøkkel, f.eks. H2023-2>.
    // Fanen i kortet: &demo=1 → «Steg for steg», &perfekt=1 (eller &svar=1) → «Løsning»,
    // &vis=oppgave|demo|losning|sensor → den fanen. Fokus flyttes til toppen av kortet.
    // Oppgavekortene bygges av sidens eget skript, så vi venter til siden er lastet,
    // åpner kortet og ruller dit.
    function reveal() {
      var m = location.hash.match(/oppg=([\w-]+)/);
      if (!m) return;
      var vis = IN.examTabFromHash(location.hash), focused = false;
      try { history.scrollRestoration = "manual"; } catch (e) {}
      var go = function () {
        var t = document.getElementById(m[1]) || qs('details.examtask[data-key="' + m[1] + '"]');
        if (!t) return;
        // Uten fane= i lenken (eller med feil fane): bytt til fanen som faktisk inneholder kortet.
        var pan = t.closest && t.closest("[data-panel]");
        if (pan && pan.hidden && panels.indexOf(pan) >= 0) activate(pan.getAttribute("data-panel"), false);
        var card = t.matches && t.matches("details") ? t : t.querySelector("details.examtask");
        if (card) {
          card.open = true;
          // Andre kjøring (etter 450 ms) skal ikke ta fanen tilbake hvis leseren allerede har byttet
          if (vis && !focused && card._show && (card._tabs || []).indexOf(vis) >= 0) card._show(vis, false);
          var head = qs("summary", card);
          if (head && !focused) { try { head.focus({ preventScroll: true }); } catch (e) { head.focus(); } }
          focused = true;
        }
        var top = t.getBoundingClientRect().top + window.pageYOffset - IN.stickyH(); // under de faste linjene
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      };
      // To ganger: demoene over kan endre høyde rett etter lasting
      // Lenker kan også ha et tekstfragment (:~:text=…). Nettleseren ruller da selv til teksten
      // litt etter lasting og midtstiller den. Ruller siden uten at leseren har gjort noe i det første
      // halvannet sekundet, legger vi kortet tilbake under de faste linjene.
      var settle = function () {
        var user = false, tm = null, evs = ["wheel", "touchstart", "keydown", "pointerdown"];
        var mark = function () { user = true; };
        var onScroll = function () { if (!user) { clearTimeout(tm); tm = setTimeout(go, 120); } };
        evs.forEach(function (e) { window.addEventListener(e, mark, { passive: true }); });
        window.addEventListener("scroll", onScroll, { passive: true });
        setTimeout(function () {
          window.removeEventListener("scroll", onScroll);
          evs.forEach(function (e) { window.removeEventListener(e, mark); });
        }, 1500);
      };
      var run = function () { setTimeout(go, 60); setTimeout(function () { go(); settle(); }, 450); };
      if (document.readyState === "complete") run();
      else window.addEventListener("load", run);
    }
    reveal();
    IN.revealOppg = reveal;

    window.addEventListener("hashchange", function () {
      var h = (location.hash.match(/fane=([\w-]+)/) || [])[1];
      if (h && ids.indexOf(h) >= 0) activate(h, false);
      reveal();
    });
    return { activate: activate };
  };

  /* ---------- Felles motor for sant/usant og flervalg ----------
     Én motor og ett design for IN.tfTest og IN.quiz:
       topp:  bryter «Svar med en gang» + poeng
       liste: nummererte punkter, svarknapper og nedtrekket «Forklaring» under hvert punkt
       bunn:  «Sjekk svar» + «↺ Nullstill»
     Bryteren er én global innstilling for alle sett og sider (localStorage in2120:svar-straks,
     standard av). Regel for begge: du kan alltid endre svaret (unntak: lock etter sjekk).
     Når tilbakemelding vises (bryteren på, eller etter «Sjekk svar»), blir valget grønt/rødt
     med ✓/✗, riktig svar markeres, og et galt valg åpner forklaringen sin.
     «Sjekk svar» åpner forklaringen under alle gale punkter og lukker de andre. */
  var STRAKS_KEY = "in2120:svar-straks", qzN = 0;
  function straksEvent(on) { try { document.dispatchEvent(new CustomEvent("in:svar-straks", { detail: !!on })); } catch (e) {} }
  IN.svarStraks = {
    KEY: STRAKS_KEY,
    get: function () { return IN.store.get(STRAKS_KEY, "0") === "1"; },
    set: function (on) { IN.store.set(STRAKS_KEY, on ? "1" : "0"); straksEvent(on); },
    // Låst: <body data-straks="av"> (eksamen.html i eksamensmodus). Da gir ingen øving tilbakemelding før retting.
    laast: function () { return !!(document.body && document.body.getAttribute("data-straks") === "av"); },
    onLaast: null
  };

  /* ---------- Bekreftelsesdialog ----------
     IN.bekreft({ tittel, tekst (html), ja, nei, retur? }) → Promise<boolean>. <dialog> med showModal: resten av siden er
     inert, Tab går i ring mellom knappene (fokusfelle), Esc og «nei» gir false. Fokus går tilbake til retur (eller
     elementet som hadde fokus). Uten <dialog>-støtte: window.confirm som reserve. */
  IN.bekreft = function (o) {
    o = o || {};
    var retur = o.retur || document.activeElement;
    if (typeof HTMLDialogElement !== "function") return Promise.resolve(window.confirm((o.tittel ? o.tittel + " " : "") + (o.tekst || "").replace(/<[^>]+>/g, "")));
    return new Promise(function (resolve) {
      var tid = "bk" + (++qzN);
      var nei = el("button", { class: "btn", type: "button", text: o.nei || "Avbryt", value: "nei" });
      var ja = el("button", { class: "btn primary", type: "button", text: o.ja || "OK", value: "ja" });
      var d = el("dialog", { class: "in-dialog", "aria-labelledby": tid + "-t", "aria-describedby": tid + "-x" }, [
        el("h2", { class: "in-dialog-t", id: tid + "-t", text: o.tittel || "Er du sikker?" }),
        el("div", { class: "in-dialog-x", id: tid + "-x", html: o.tekst || "" }),
        el("div", { class: "in-dialog-k" }, [ja, nei])]);
      var svar = false, ferdig = false;
      function lukk(v) { svar = v; if (d.open) d.close(); }
      ja.addEventListener("click", function () { lukk(true); });
      nei.addEventListener("click", function () { lukk(false); });
      d.addEventListener("cancel", function () { svar = false; });            // Esc
      d.addEventListener("keydown", function (e) {                            // fokusfelle: Tab i ring
        if (e.key !== "Tab") return;
        var f = [ja, nei], i = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      });
      d.addEventListener("close", function () {
        if (ferdig) return; ferdig = true;
        if (d.parentNode) d.parentNode.removeChild(d);
        try { if (retur && retur.focus) retur.focus(); } catch (e) {}
        resolve(svar);
      });
      document.body.appendChild(d);
      d.showModal();
      (o.fokusNei ? nei : ja).focus();
    });
  };
  window.addEventListener("storage", function (e) { if (e.key === STRAKS_KEY) straksEvent(e.newValue === "1"); });
  function plain(html) { var d = document.createElement("div"); d.innerHTML = html; return (d.textContent || "").trim(); }

  /* ---------- Kildehenvisning på et punkt (sant/usant, flervalg) ----------
     kilde: { ref: "Forelesning 3 (Sortering 1), lysark 14", egneOrd: true, kort?: "…" } eller en array av slike.
     Vises som «Kilde: Forelesning 3, lysark 14 *» under forklaringen. Parenteser i ref tas bort i visningen
     (full ref står i title), med mindre kort er satt. egneOrd: false (ordrett fra eksamen) gir ingen stjerne.
     Et felt «sitat» blir ALDRI vist: det slettes her. Ordrette sitater fra forelesninger, ukesoppgaver og
     lærebok skal ikke ligge i repoet i det hele tatt. */
  function stripSitat(o, depth) {
    if (!o || typeof o !== "object" || o.nodeType || (depth || 0) > 6) return o;
    if (Array.isArray(o)) { o.forEach(function (x) { stripSitat(x, (depth || 0) + 1); }); return o; }
    if (Object.prototype.hasOwnProperty.call(o, "sitat")) delete o.sitat;
    Object.keys(o).forEach(function (k) { var v = o[k]; if (v && typeof v === "object" && !v.nodeType) stripSitat(v, (depth || 0) + 1); });
    return o;
  }
  IN.stripSitat = stripSitat;
  function kildeRefs(k) {
    if (!k || typeof k !== "object") return null;          // streng/false = eksamensmerke i tfTest, ikke kildelinje
    var out = [];
    (Array.isArray(k) ? k : [k]).forEach(function (r) {
      if (typeof r === "string") r = { ref: r };
      if (!r || typeof r !== "object") return;
      stripSitat(r);
      if (!r.ref) return;
      var ref = String(r.ref);
      var vis = r.kort ? String(r.kort) : ref.replace(/\s*\([^)]*\)/g, "").replace(/\s{2,}/g, " ").trim();
      out.push({ ref: ref, vis: vis || ref, egneOrd: r.egneOrd !== false, eksamen: r.eksamen });
    });
    return out.length ? out : null;
  }
  function kildeLineEl(refs) {
    var p = el("p", { class: "qz-kilde" }, "Kilde: ");
    refs.forEach(function (r, i) {
      if (i) p.appendChild(document.createTextNode("; "));
      p.appendChild(el("span", { title: r.vis !== r.ref ? r.ref : null, text: r.vis + (r.egneOrd ? " *" : "") }));
    });
    return p;
  }
  IN.kildeRefs = kildeRefs;

  /* spec: { kind: "tf"|"mc", storeKey, progressId,
             items: [{ id, prompt (html), tag?: {text, cls, title}, render?: fn(node),
                       choices: [{ label (html), value }], key, keyLabel (html), explain: html | fn(node),
                       src?: [{ ref, vis, egneOrd }] (kildelinje, se kildeRefs) }] }
     opts: se IN.tfTest / IN.quiz */
  function answerSet(host, spec, o) {
    if (host._qzOff) host._qzOff();
    clear(host);
    o = o || {};
    var items = spec.items, mc = spec.kind === "mc", uid = "qz" + (++qzN);
    var follow = o.instant == null;                 // følger den globale bryteren
    var answers = {}, checked = false, open = {}, reported = false, cur = 0;
    var foldStat = null;
    var revealed = {};   // «Vis fasit» uten å svare (flashcard). Lagres ikke, og teller ikke som svar.
    function has(id) { return answers[id] != null; }
    // Forklaringen (med «Riktig svar: …») er tilgjengelig først når punktet er besvart, sjekket eller vist med «Vis fasit»
    function earned(it) { return has(it.id) || checked || !!revealed[it.id]; }
    // it.alt: andre svar sensor også godtok (f.eks. to radantall). Teller som riktig.
    function isRight(it, v) { return v === it.key || (it.alt && it.alt.indexOf(v) >= 0); }
    /* Lagrede svar er knyttet til punktets plass i lista (id = indeks). Et fingeravtrykk per punkt
       (tekst + alternativer + fasit) sørger for at et gammelt svar bare hentes tilbake når punktet er
       helt uendret (portert fra IN2010-guiden). Lagring uten fingeravtrykk forkastes. */
    function fp(it) {
      var s = String(it.prompt) + "|" + it.choices.map(function (c) { return String(c.value); }).join(",") + "|" + String(it.key), h = 5381;
      for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
      return h.toString(36);
    }
    var fps = {};
    items.forEach(function (it) { fps[it.id] = fp(it); });
    if (spec.storeKey) {
      try {
        var saved = JSON.parse(IN.store.get(spec.storeKey, "null"));
        if (saved && saved.a && typeof saved.a === "object" && saved.h && typeof saved.h === "object") {
          var savedN = 0, kept = 0;
          Object.keys(saved.a).forEach(function () { savedN++; });
          items.forEach(function (it) {
            var v = saved.a[it.id];
            if (v === undefined) return;
            if (saved.h[it.id] === fps[it.id] && it.choices.some(function (c) { return c.value === v; })) { answers[it.id] = v; kept++; }
          });
          checked = !!saved.c && kept === savedN && Object.keys(saved.h).length === items.length;
        }
      } catch (e) {}
    }
    function persist() {
      if (!spec.storeKey) return;
      var h = {}; Object.keys(fps).forEach(function (k) { h[k] = fps[k]; });
      IN.store.set(spec.storeKey, JSON.stringify({ a: answers, c: checked, h: h }));
    }
    function instant() { return follow ? IN.svarStraks.get() && !IN.svarStraks.laast() : !!o.instant; }
    // "" (ingen tilbakemelding) | "right" | "wrong" | "blank" (ubesvart etter sjekk)
    function state(it) {
      if (!(instant() || checked)) return "";
      if (!has(it.id)) return checked ? (o.blank ? "wrong" : "blank") : "";
      return isRight(it, answers[it.id]) ? "right" : "wrong";
    }
    function counts() {
      var c = { right: 0, wrong: 0, blank: 0, answered: 0, total: items.length, detail: [] };
      items.forEach(function (it) {
        var ok = has(it.id) && isRight(it, answers[it.id]);
        c.detail.push({ id: it.id, answered: has(it.id), value: has(it.id) ? answers[it.id] : undefined, right: ok });
        if (!has(it.id)) c.blank++;
        else { c.answered++; if (ok) c.right++; else c.wrong++; }
      });
      return c;
    }

    var wrap = el("div", { class: "qz " + (mc ? "qz-mc" : "qz-tf") + (o.cls ? " " + o.cls : "") });
    var live = el("span", { class: "qz-live", "aria-live": "polite" });
    function say(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }
    var head = el("div", { class: "qz-head" }), sw = null;
    if (follow) {
      sw = el("button", { class: "qz-switch qz-switch-lokal", type: "button", title: "Samme bryter som «Svar med en gang» øverst på siden", role: "switch", "aria-checked": "false",
        onclick: function () { if (IN.svarStraks.laast && IN.svarStraks.laast()) { if (typeof IN.svarStraks.onLaast === "function") IN.svarStraks.onLaast(sw); return; } IN.svarStraks.set(!instant()); } }, [
        el("span", { class: "qz-track", "aria-hidden": "true" }, el("span", { class: "qz-thumb" })),
        el("span", { text: "Svar med en gang" })]);
      head.appendChild(sw);
    } else if (o.note) head.appendChild(el("span", { class: "qz-note", html: o.note }));
    var score = el("span", { class: "qz-score" });
    head.appendChild(score);
    var list = el("ol", { class: "qz-list" + (o.pager ? " qz-paged" : "") });

    var rows = items.map(function (it, pos) {
      var li = el("li", { class: "qz-item" });
      var num = el("span", { class: "qz-num", "aria-hidden": "true", text: pos + 1 });
      var body = el("div", { class: "qz-body" });
      var prompt = el("div", { class: "qz-prompt", html: it.prompt });
      if (it.tag) prompt.appendChild(el("span", { class: "tag blokk" + (it.tag.cls ? " " + it.tag.cls : ""), text: it.tag.text, title: it.tag.title || null }));
      body.appendChild(prompt);
      if (it.render) { var extra = el("div", { class: "qz-extra" }); body.appendChild(extra); it.render(extra); }
      var group = el("div", { class: "qz-choices", role: "group",
        "aria-label": (mc ? "Svaralternativer, spørsmål " : "Svar på påstand ") + (pos + 1) });
      var btns = it.choices.map(function (c) {
        var mark = el("span", { class: "qz-mark", "aria-hidden": "true" });
        var b = el("button", { class: "qz-choice", type: "button", "aria-pressed": "false",
          onclick: function () { choose(it, c.value); } }, [mark, el("span", { class: "qz-lbl", html: c.label })]);
        b._v = c.value; b._mark = mark;
        group.appendChild(b);
        return b;
      });
      var expId = uid + "-x" + pos;
      var togTxt = el("span"), togCaret = el("span", { class: "qz-caret", "aria-hidden": "true", text: "▾" });
      var tog = el("button", { class: "qz-exp-btn", type: "button", "aria-expanded": "false", "aria-controls": expId,
        onclick: function () {
          if (!earned(it)) { revealed[it.id] = true; open[it.id] = true; paint(); say("Riktig svar: " + plain(it.keyLabel) + "."); return; }
          open[it.id] = !open[it.id]; paint();
        } }, [togTxt, togCaret]);
      var exp = el("div", { class: "qz-exp", id: expId, hidden: true });
      var sr = el("span", { class: "qz-sr" });
      // Flervalg: knappen ligger høyrestilt i spørsmålslinja (flyter), så den ikke tar en egen rad.
      // Sant/usant: i samme rad som svarknappene.
      if (mc) { tog.classList.add("qz-exp-float"); prompt.insertBefore(tog, prompt.firstChild); body.appendChild(el("div", { class: "qz-ctl" }, [group])); }
      else body.appendChild(el("div", { class: "qz-ctl" }, [group, tog]));
      body.appendChild(exp);
      body.appendChild(sr);
      li.appendChild(num); li.appendChild(body);
      list.appendChild(li);
      return { it: it, li: li, num: num, btns: btns, tog: tog, togTxt: togTxt, togCaret: togCaret, exp: exp, sr: sr, pos: pos, filled: false };
    });

    function fill(r) {
      r.filled = true;
      r.exp.appendChild(el("p", { class: "qz-key", html: "Riktig svar: <b>" + r.it.keyLabel + "</b>" }));
      if (typeof r.it.explain === "function") { var h = el("div"); r.exp.appendChild(h); r.it.explain(h); }
      else if (r.it.explain) r.exp.appendChild(el("div", { class: "qz-exp-txt", html: r.it.explain }));
      if (r.it.src) r.exp.appendChild(kildeLineEl(r.it.src));
      IN.symbolTips(r.exp);
    }
    function paintItem(r) {
      var it = r.it, st = state(it), sel = has(it.id) ? answers[it.id] : null, locked = !!(o.lock && checked);
      r.li.className = "qz-item" + (st ? " is-" + st : "") + (has(it.id) ? " answered" : "");
      r.num.textContent = st === "right" ? "✓" : st === "wrong" ? "✗" : st === "blank" ? "–" : String(r.pos + 1);
      r.btns.forEach(function (b) {
        var isSel = b._v === sel, cls = "qz-choice" + (isSel ? " sel" : ""), mk = "";
        if (st && isSel) { if (st === "right") { cls += " correct"; mk = "✓"; } else if (st === "wrong") { cls += " wrong"; mk = "✗"; } }
        if (st === "wrong" && !isSel && b._v === it.key) { cls += " iskey"; mk = "✓"; }
        if (!st && revealed[it.id] && b._v === it.key) { cls += " iskey"; mk = "✓"; }   // «Vis fasit» uten svar
        b.className = cls; b._mark.textContent = mk;
        b.setAttribute("aria-pressed", isSel ? "true" : "false");
        b.disabled = locked;
      });
      var key = plain(it.keyLabel);
      r.sr.textContent = st === "right" ? "Riktig." : st === "blank" ? "Ikke besvart." :
        st === "wrong" ? (has(it.id) ? "Ikke riktig. " : "Blankt, teller som galt. ") + "Riktig svar: " + key + "." : "";
      var canExp = !(o.lock && !checked), got = earned(it);
      var isOpen = canExp && got && !!open[it.id];
      r.tog.hidden = !canExp;
      r.togTxt.textContent = got ? (it.explain ? "Forklaring" : "Fasit") : "Vis fasit";
      r.togCaret.textContent = got ? "▾" : "";
      r.tog.classList.toggle("qz-peek", !got);
      if (got) r.tog.setAttribute("aria-expanded", isOpen ? "true" : "false"); else r.tog.removeAttribute("aria-expanded");
      if (got) r.tog.removeAttribute("aria-label");
      else r.tog.setAttribute("aria-label", "Vis fasit for " + (mc ? "spørsmål " : "påstand ") + (r.pos + 1));
      if (isOpen && !r.filled) fill(r);
      r.exp.hidden = !isOpen;
    }
    function scoreHtml(c) {
      if (checked) return '<b class="ok">✓ ' + c.right + ' riktig</b> · <b class="no">✗ ' + c.wrong + " galt</b>" +
        (c.blank ? ' · <span class="' + (o.blank ? "no" : "muted") + '">' + c.blank + (o.blank ? (c.blank === 1 ? " blank" : " blanke") : " ubesvart") + "</span>" : "") +
        " · " + c.right + "/" + c.total;
      return c.answered + " av " + c.total + " besvart" + (instant() && c.answered ? ' · <b class="ok">' + c.right + " riktig</b>" : "");
    }
    function paint() {
      if (sw) sw.setAttribute("aria-checked", instant() ? "true" : "false");
      rows.forEach(paintItem);
      var cc = counts();
      score.innerHTML = scoreHtml(cc);
      if (foldStat) foldStat.textContent = checked ? " · " + cc.right + " av " + cc.total + " riktig" : cc.answered ? " · " + cc.answered + " besvart" : "";
      bCheck.disabled = !!(o.lock && checked);
      if (o.pager) paintPager();
    }
    function report() {
      var c = counts();
      if (o.report) { o.report(c); return; }
      if (IN.progress && spec.progressId) IN.progress.solved(mc ? "quiz" : "tf", spec.progressId, c.right, c.total);
    }
    function choose(it, v) {
      if (o.lock && checked) return;
      if (v == null) delete answers[it.id]; else answers[it.id] = v;
      persist();
      var st = state(it);
      if (st === "wrong") open[it.id] = true;
      paint();
      if (st === "right") say("Riktig.");
      else if (st === "wrong") say("Ikke riktig. Riktig svar: " + plain(it.keyLabel) + ".");
      // Fremdrift i straks-modus: første gang alle er besvart (deretter ved «Sjekk svar»)
      if (instant() && !checked && !reported && counts().answered === items.length) { reported = true; report(); }
    }
    function doCheck() {
      checked = true;
      rows.forEach(function (r) { open[r.it.id] = state(r.it) === "wrong"; });
      persist(); paint(); report();
      var c = counts();
      clear(res);
      if (o.result) { var x = o.result(c); if (typeof x === "string") res.innerHTML = x; else append(res, x); }
      else say(c.right + " av " + c.total + " riktig. " + c.wrong + " galt" + (c.blank ? ", " + c.blank + " ubesvart" : "") + ".");
    }
    function doReset() {
      if (o.onReset) { o.onReset(); return; }
      answers = {}; checked = false; open = {}; revealed = {}; reported = false; cur = 0;
      persist(); clear(res); paint(); say("Nullstilt.");
    }

    var bCheck = el("button", { class: "btn primary", type: "button", text: o.checkLabel || "Sjekk svar", onclick: doCheck });
    var bReset = el("button", { class: "btn", type: "button", text: o.resetLabel || "↺ Nullstill", onclick: doReset });
    var foot = el("div", { class: "qz-foot" }, [bCheck, bReset]);
    var res = el("div", { class: "qz-result", "aria-live": o.result ? "polite" : null });

    // Bla-modus (én oppgave om gangen, med prikker for oversikt)
    var dots = [], pgLbl = null, dotRow = null, pnav = null;
    function go(j) { cur = (j + rows.length) % rows.length; paint(); }
    function paintPager() {
      rows.forEach(function (r, j) { r.li.hidden = j !== cur; });
      pgLbl.textContent = "Oppgave " + (cur + 1) + " av " + rows.length;
      dots.forEach(function (d, j) {
        var it = rows[j].it, st = state(it);
        d.className = "qz-dot" + (st ? " is-" + st : "") + (has(it.id) ? " answered" : "") + (j === cur ? " cur" : "");
        d.textContent = st === "right" ? "✓" : st === "wrong" ? "✗" : String(j + 1);
        d.setAttribute("aria-label", "Oppgave " + (j + 1) + (st === "right" ? ", riktig" : st === "wrong" ? ", feil" : has(it.id) ? ", besvart" : ""));
        d.setAttribute("aria-current", j === cur ? "true" : "false");
      });
    }
    if (o.pager) {
      dotRow = el("div", { class: "qz-dots", role: "group", "aria-label": "Velg oppgave" });
      dots = rows.map(function (r, j) { var d = el("button", { class: "qz-dot", type: "button", onclick: function () { go(j); } }); dotRow.appendChild(d); return d; });
      pgLbl = el("span", { class: "qz-pg" });
      pnav = el("div", { class: "qz-pnav" }, [
        el("button", { class: "btn", type: "button", text: "← Forrige", onclick: function () { go(cur - 1); } }), pgLbl,
        el("button", { class: "btn", type: "button", text: "Neste →", onclick: function () { go(cur + 1); } })]);
    }

    // Én fotnote per sett når minst ett punkt har en kilde formulert med egne ord
    var fn = items.some(function (it) { return it.src && it.src.some(function (r) { return r.egneOrd; }); })
      ? el("p", { class: "qz-kilde-fn", text: "* formulert med egne ord" }) : null;
    [o.opphav && IN.opphavEl ? IN.opphavEl(o.opphav) : null, head, dotRow, list, pnav, foot, res, fn, live].forEach(function (x) { if (x) wrap.appendChild(x); });
    // o.fold: settet ligger i en lukket <details> («Sant eller usant? · 7 påstander»), med status i oppsummeringen
    if (o.fold) {
      foldStat = el("span", { class: "qz-fold-st" });
      var fold = el("details", { class: "qz-fold" }, [
        el("summary", { class: "qz-fold-sum" }, [
          el("span", { class: "qz-fold-t", text: o.foldTitle || (mc ? "Flervalg" : "Sant eller usant?") }),
          el("span", { class: "qz-fold-n", text: " · " + items.length + (mc ? " spørsmål" : items.length === 1 ? " påstand" : " påstander") }),
          foldStat]),
        wrap]);
      host.appendChild(fold);
    } else host.appendChild(wrap);
    if (checked) rows.forEach(function (r) { open[r.it.id] = state(r.it) === "wrong"; });
    function onPref() { if (!wrap.isConnected) { host._qzOff && host._qzOff(); return; } paint(); }
    document.addEventListener("in:svar-straks", onPref);
    host._qzOff = function () { document.removeEventListener("in:svar-straks", onPref); host._qzOff = null; };
    paint();
    return { check: doCheck, reset: doReset, counts: counts, el: wrap };
  }

  /* ---------- Flervalg ----------
     IN.quiz(host, questions, opts?)
     questions: [{ q (html), options: [html…], answer: idx, explain: html | fn(node), render?: fn(node),
                   kilde?: { ref, egneOrd } | [...] (kildelinje under forklaringen, se kildeRefs) }]
     opts: { id?, pager?: én om gangen med prikker, inline?: alternativene på rad, cls? }
     Fremdrift: quiz:<side>:<id>. Svar lagres i in2120:quiz:<side>:<id> når quizen har id. */
  IN.quiz = function (host, questions, opts) {
    if (typeof host === "string") host = qs(host);
    if (!host || !questions || !questions.length) return;
    opts = opts || {};
    var qid = opts.id || host.id;
    if (!qid) {
      var pan = host.closest && host.closest("[data-panel]");
      var pre = pan ? pan.getAttribute("data-panel") + "-" : "";
      IN.quiz._n = IN.quiz._n || {};
      IN.quiz._n[pre] = (IN.quiz._n[pre] || 0) + 1;
      qid = pre + "quiz" + IN.quiz._n[pre];
    }
    var items = questions.map(function (item, i) {
      if (item && item.sitat) delete item.sitat;
      var alt = item.godta ? [].concat(item.godta).filter(function (x) { return x !== item.answer; }) : null;
      return { id: i, prompt: item.q, render: item.render || null, explain: item.explain || "", src: kildeRefs(item.kilde),
        choices: item.options.map(function (opt, oi) { return { label: opt, value: oi }; }),
        key: item.answer, alt: alt && alt.length ? alt : null,
        keyLabel: item.options[item.answer] + (alt && alt.length ? " (også godtatt: " + alt.map(function (x) { return item.options[x]; }).join(", ") + ")" : "") };
    });
    // Øvrige valg (instant, lock, note, result, report, checkLabel …) går rett videre til answerSet, som i tfTest
    var o = {};
    for (var ok in opts) if (Object.prototype.hasOwnProperty.call(opts, ok)) o[ok] = opts[ok];
    o.cls = (opts.inline ? "qz-inline" : "") + (opts.cls ? " " + opts.cls : "");
    return answerSet(host, { kind: "mc", items: items, progressId: qid,
      storeKey: (opts.id || host.id) ? "in2120:quiz:" + IN.pageId() + ":" + qid : null }, o);
  };

  /* ---------- Sant/usant ----------
     IN.tfTest(host, items, opts?)
     items: [{ s: "påstand (html)", answer: true|false, explain: "html", blokk?, tema?, kilde? }]
       kilde: eksamen påstanden er fra (ellers årstallet i teksten, f.eks. «(H2022)»; false = aldri merke).
       kilde kan også være et kildeobjekt { ref, egneOrd, eksamen? } eller en array av dem: da vises
       «Kilde: …» under forklaringen, og eksamensmerket hentes fra eksamen (streng | false) eller fra
       et årstall i ref («Eksamen H2021, oppgave 3»). Teksten i påstanden brukes da ikke til merket.
       Påstander fra eksamen sorteres først.
     opts: { id?: lagringsnøkkel in2120:tf:<id> og fremdrift tf:<side>:<id>, shuffle?,
             blank?: egen «Blankt»-knapp, og blankt teller som galt ved sjekk,
             instant?: true/false låser modus og skjuler bryteren (udefinert = global bryter),
             lock?: svarene låses etter sjekk, og forklaringene vises først etter sjekk,
             note?: html i topplinja når bryteren er skjult,
             checkLabel?, resetLabel?, onReset?: fn (erstatter vanlig nullstilling),
             report?: fn(counts) (erstatter vanlig fremdrift), result?: fn(counts) → html | node under knappene,
             labels?: ["JA","NEI"] (standard Sant/Usant), keepOrder?: arkets rekkefølge (ingen eksamen-først-sortering) }
     Et punkt kan ha render: fn(node) som tegner noe under påstanden (f.eks. SQL). */
  IN.tfTest = function (host, items, opts) {
    if (typeof host === "string") host = qs(host);
    if (!host || !items || !items.length) return;
    opts = opts || {};
    function kildeOf(it, refs) {
      if (refs) {
        for (var a = 0; a < refs.length; a++) if (refs[a].eksamen !== undefined) return refs[a].eksamen || null;
        for (var b = 0; b < refs.length; b++) { var mr = /\b([HV]20\d\d)\b/.exec(refs[b].ref); if (mr) return mr[1]; }
        return null;
      }
      if (it.kilde !== undefined) return it.kilde || null;   // kilde: false = aldri eksamensmerke
      var m = /\b([HV]20\d\d)\b/.exec((it.s || "") + " " + (it.explain || ""));
      return m ? m[1] : null;
    }
    var norm = items.map(function (it, i) {
      if (it && it.sitat) delete it.sitat;
      var refs = kildeRefs(it.kilde);
      return { s: it.s, answer: !!it.answer, explain: it.explain || "", blokk: it.blokk || null, tema: it.tema || null, kilde: kildeOf(it, refs), src: refs, render: it.render || null, _id: i };
    });
    var order = opts.keepOrder ? norm.slice() : norm.filter(function (it) { return it.kilde; }).concat(norm.filter(function (it) { return !it.kilde; }));
    if (opts.shuffle) for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
    // opts.labels: ["JA", "NEI"] for eksamensoppgaver som spør JA/NEI
    var lbl = opts.labels || ["Sant", "Usant"];
    var choices = [{ label: lbl[0], value: true }, { label: lbl[1], value: false }];
    if (opts.blank) choices.push({ label: "Blankt", value: null });
    var list = order.map(function (it) {
      return { id: it._id, prompt: it.s, render: it.render, explain: it.explain, src: it.src, choices: choices, key: it.answer, keyLabel: it.answer ? lbl[0] : lbl[1],
        tag: it.kilde ? { text: it.kilde, cls: "tf-eks", title: "Fra eksamen " + it.kilde } :
          it.tema ? { text: it.tema } : it.blokk ? { text: "Blokk " + it.blokk } : null };
    });
    // Sant/usant under «Test deg selv» (vert #tf-<fane>) ligger i en lukket <details> (eierens beslutning C3, 2026-11-26).
    // opts.fold: true tvinger det fram, false slår det av. Øvinger med lock/instant/labels (eksamensformat) foldes ikke.
    var o2 = {};
    for (var ok2 in opts) if (Object.prototype.hasOwnProperty.call(opts, ok2)) o2[ok2] = opts[ok2];
    if (o2.fold == null) o2.fold = !!(host.id && /^tf-/.test(host.id) && !opts.lock && opts.instant == null && !opts.labels);
    return answerSet(host, { kind: "tf", items: list, progressId: opts.id || host.id,
      storeKey: opts.id ? "in2120:tf:" + opts.id : null }, o2);
  };

  /* ---------- Eksamensoppgave (utvidbart kort) ----------
     data: {
       year: "H2023", title: "Gnome sort", points: 10, oppgave_nr: "Oppgave 5",
       oppgave:  html,                      // oppgavetekst (ordrett fra arket når ordrett: true)
       losning:  html | [ "steg", ... ],    // løsningsgjennomgang (sensorveiledning, parafrasert)
       kjerne:   html,                      // kjernepoeng / hvorfor (valgfritt)
       tips:     html | [ "tips", ... ],    // eksamenstips
       open:     false                      // start åpen?
     }
     Native <details> med én fanerad inni (se under) – virker fra file://, tastaturvennlig, ingen avhengigheter. */
  function htmlFromListish(v, ordered) {
    if (v == null) return "";
    if (Array.isArray(v)) {
      if (!v.length) return "";
      var tag = ordered ? "ol" : "ul";
      return "<" + tag + ">" + v.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</" + tag + ">";
    }
    if (v.nodeType) return v;
    return String(v);
  }
  /* Kortet (design portert fra IN2010, plan/gjennomgang/design-eksamenskort.md der):
       <details.examtask data-key>
         summary.et-head:  år · oppgave · poeng | tittel | statusbrikke | pil   (lik lukket og åpen)
         .examtask-body:   én fanerad (WAI-ARIA): Oppgave | Steg for steg | Løsning | Sensorveiledning
                           med fast fargekode (t-oppgave/t-demo/t-losning/t-sensor), ett panel om gangen,
                           og en bunnlinje med kildelinje + «Hvordan gikk det?».
     Fanene bygges først når de vises. Oppgave er valgt når kortet åpnes.
     Steg for steg finnes bare med demo, Sensorveiledning bare med perfekt.sensor (ikke mock).
     opts: { variant: "flat" (ingen ytre kant), insp: API fra IN.inspera (øvingen i Oppgave-fanen) }
     Statusbrikken: Inspera-poengene («1,5 / 2 p», også egenvurdert K/E) når oppgaven er rettet/vurdert
     (lytter på in:insp {key, score, maks, manual}), ellers egenvurderingen «Hvordan gikk det?».
     card._show(id[, fokus]) bytter fane (dyplenker: &demo=1, &perfekt=1/&svar=1, &vis=<fane>). */
  var TABDEF = {
    oppgave: { long: "Oppgave", short: "Oppgave" },
    demo:    { long: "Steg for steg", short: "Steg" },
    losning: { long: "Løsning", short: "Løsning" },
    sensor:  { long: "Sensorveiledning", short: "Sensor" }
  };
  IN.EXAM_TABS = TABDEF;
  // Fanen en dyplenke ber om: &vis=oppgave|demo|losning|sensor, &demo=1, &perfekt=1 / &svar=1
  IN.examTabFromHash = function (h) {
    h = String(h == null ? location.hash : h);
    return (h.match(/[#&]vis=(oppgave|demo|losning|sensor)\b/) || [])[1] ||
      (/[#&]demo=1\b/.test(h) ? "demo" : /[#&](svar|perfekt)=1\b/.test(h) ? "losning" : null);
  };
  function fmtP(x) { return String(Math.round(x * 100) / 100).replace(".", ","); }
  var etUid = 0;
  IN.examTask = function (host, data, opts) {
    if (typeof host === "string") host = qs(host);
    if (!host) return;
    var d = data || {};
    opts = opts || {};
    var n = ++etUid;
    var card = el("details", { class: "examtask" + (opts.variant === "flat" ? " et-flat" : "") });
    if (d.id) card.id = d.id;
    if (d.key) card.dataset.key = d.key;
    var base = "etk" + n;

    var pf = d.perfekt || (d.key && IN.PERFEKT[d.key]) || null;
    if (pf) stripSitat(pf);
    var type = pf ? (pf.type || "eksamen") : null;
    if (pf && ["eksamen", "skjonn", "mock"].indexOf(type) < 0) { if (window.console) console.warn("perfekt: ukjent type", type, d.key); type = "eksamen"; }
    var demos = d.demo ? (Array.isArray(d.demo) ? d.demo : [d.demo]) : [];
    if (d.deler) demos = demos.filter(function (x) { return !x.del || d.deler.indexOf(x.del) >= 0; });

    // Toppen
    var chip = el("span", { class: "et-status" });
    var nr = String(d.oppgave_nr || "").replace(/\s*\(mock\)\s*$/i, "").replace(/^Oppgave\s*/i, "Oppgave ");
    card.appendChild(el("summary", { class: "et-head" }, [
      el("span", { class: "et-meta" }, [
        d.year ? el("span", { class: "et-year", text: d.year }) : null,
        nr ? el("span", { class: "et-nr", text: nr }) : null,
        d.points != null ? el("span", { class: "et-pts", text: (isFinite(+d.points) ? fmtP(+d.points) : d.points) + " p" }) : null
      ]),
      el("span", { class: "et-title", text: d.title || "Eksamensoppgave" }),
      chip,
      el("span", { class: "et-chev", "aria-hidden": "true" })
    ]));

    // Fanene som finnes for dette kortet
    var hasLos = d.losning != null && d.losning !== "" && !(Array.isArray(d.losning) && !d.losning.length);
    var order = ["oppgave"];
    if (demos.length) order.push("demo");
    if (pf || hasLos || d.kjerne || d.tips) order.push("losning");
    if (pf && pf.sensor && type !== "mock") order.push("sensor");
    if (pf && pf.sensor && type === "mock" && window.console) console.warn("perfekt: «sensor» ignoreres på mock-oppgaver (" + (d.key || d.title) + ")");

    var body = el("div", { class: "examtask-body" });
    var bar = el("div", { class: "et-tabs", role: "tablist", "aria-label": "Deler av oppgaven" });
    var btns = {}, panes = {}, built = {};
    order.forEach(function (id, i) {
      var tid = base + "-t-" + id, pid = base + "-p-" + id;
      var b = el("button", { class: "et-fane t-" + id, type: "button", role: "tab", id: tid, "aria-controls": pid,
        "aria-selected": i ? "false" : "true", tabindex: i ? "-1" : "0", "data-fane": id },
        [el("span", { class: "et-fane-l", text: TABDEF[id].long }),
         el("span", { class: "et-fane-s", text: TABDEF[id].short, "aria-hidden": "true" })]);
      var p = el("div", { class: "et-pane et-content t-" + id, role: "tabpanel", id: pid, "aria-labelledby": tid, tabindex: "0", "data-fane": id });
      p.hidden = i > 0;
      b.addEventListener("click", function () { show(id, false); });
      bar.appendChild(b); btns[id] = b; panes[id] = p;
    });
    bar.addEventListener("keydown", function (e) {
      var cur = order.indexOf(curTab);
      var nx = e.key === "ArrowRight" ? cur + 1 : e.key === "ArrowLeft" ? cur - 1 : e.key === "Home" ? 0 : e.key === "End" ? order.length - 1 : null;
      if (nx == null) return;
      e.preventDefault();
      show(order[(nx + order.length) % order.length], true);
    });
    var curTab = order[0], resetOnOpen = false, builders = null;
    function show(id, focus) {
      if (!btns[id]) return false;
      resetOnOpen = false;
      curTab = id;
      if (!card.open) card.open = true;
      order.forEach(function (k) {
        var on = k === id;
        btns[k].setAttribute("aria-selected", on ? "true" : "false");
        btns[k].setAttribute("tabindex", on ? "0" : "-1");
        panes[k].hidden = !on;
      });
      if (!built[id]) {
        built[id] = true;
        try { if (builders && builders[id]) builders[id](panes[id]); IN.symbolTips(panes[id]); }
        catch (e) { panes[id].appendChild(el("p", { class: "muted small", text: "Kunne ikke vise denne delen." })); if (window.console) console.error(e); }
      }
      if (focus) btns[id].focus();
      if ((id === "losning" || id === "sensor") && self && self._vis) self._vis();   // B8: vurdert mot løsningen
      // Fanerada kan rulle sidelengs på mobil: hold valgt fane synlig
      if (bar.scrollWidth > bar.clientWidth) {
        var br = btns[id].getBoundingClientRect(), rr = bar.getBoundingClientRect();
        if (br.left < rr.left || br.right > rr.right) bar.scrollLeft += br.left - rr.left - 16;
      }
      return true;
    }
    // Oppgave er valgt når kortet åpnes (men ikke når en dyplenke nettopp har valgt en annen fane)
    card.addEventListener("toggle", function () {
      if (!card.open) resetOnOpen = true;
      else if (resetOnOpen && curTab !== order[0]) show(order[0], false);
    });

    // Oppgave (bygges med en gang): oppgavetekst (i banken også figur og Inspera-øving) + avvik som én varsellinje
    var src = el("div", { class: "et-src" });
    var kl = kildeLinje(d); if (kl) src.appendChild(kl);
    var op = panes.oppgave;
    setContent(op, htmlFromListish(d.oppgave, false));
    if (d.poengkilde === "sv") {
      var stars = qsa(".et-p", op);
      stars.forEach(function (p) { p.textContent = p.textContent.replace(/p\)\s*$/, "p*)"); });
      if (stars.length) src.appendChild(el("p", { class: "et-fn", text: "* Poengene per deloppgave er hentet fra sensorveiledningen. Eksamensarket viser bare totalen." }));
    }
    if (d.avvik) {
      var av = el("div", { class: "et-avvik", role: "note" });
      var items = Array.isArray(d.avvik) ? d.avvik : [d.avvik];
      av.appendChild(el("b", { text: "⚠ Avvik fra eksamensarket:" }));
      if (items.length === 1) { av.appendChild(document.createTextNode(" ")); av.appendChild(el("span", { html: String(items[0]).replace(/^\s*<p>([\s\S]*)<\/p>\s*$/, "$1") })); }
      else av.appendChild(el("ul", null, items.map(function (x) { return el("li", { html: String(x) }); })));
      // I banken står avviket rett under oppgaveteksten og figuren, over Inspera-øvingen
      var ins = qs(".bank-insp", op);
      if (ins && ins.parentNode) ins.parentNode.insertBefore(av, ins); else op.appendChild(av);
    }
    built.oppgave = true;

    builders = {
      demo: function (p) { demoPane(p, d, demos, pf); },
      losning: function (p) {
        var los = htmlFromListish(d.losning, true);
        if (pf) {
          buildPerfekt(p, d, pf, type);
          if (hasLos) {
            p.appendChild(el("h4", { class: "et-h", text: "Kort fortalt" }));
            p.appendChild(setContent(el("div", { class: "et-kort" }), los));
          }
        } else if (hasLos) p.appendChild(setContent(el("div", { class: "et-kort" }), los));
        if (d.kjerne || d.tips) {
          p.appendChild(el("h4", { class: "et-h", text: "Husk til eksamen" }));
          if (d.kjerne) p.appendChild(setContent(el("div", { class: "et-husk" }), htmlFromListish(d.kjerne, false)));
          if (d.tips) p.appendChild(setContent(el("div", { class: "et-husk" }), htmlFromListish(d.tips, false)));
        }
      },
      sensor: function (p) { buildSensor(p, d, pf, type, order.indexOf("losning") >= 0); }
    };

    order.forEach(function (k) { body.appendChild(panes[k]); });
    body.insertBefore(bar, body.firstChild);
    IN.symbolTips(op);

    // Bunnlinje: kilde til venstre, «Hvordan gikk det?» til høyre (lik i alle faner)
    var self = selfAssess(card, d, opts.insp);
    body.appendChild(el("div", { class: "et-foot" }, [src.firstChild ? src : null, self]));
    card.appendChild(body);
    host.appendChild(card);

    // Statusbrikken i toppen: Inspera-poeng (rettet eller egenvurdert), ellers lagret «Hvordan gikk det?»
    var insp = opts.insp && opts.insp.status ? opts.insp.status() : null;
    function paintStatus() {
      clear(chip);
      chip.removeAttribute("title");
      if (insp && insp.score != null) {
        var full = insp.maks != null && insp.score >= insp.maks - 1e-9;
        chip.className = "et-status poeng" + (full ? " ok" : "") + (insp.manual ? " egen" : "");
        chip.title = insp.manual ? "Egenvurdert mot sjekklisten" : "Rettet med eksamensregelen";
        chip.appendChild(el("span", { class: "et-sr", text: insp.manual ? "Egenvurdert: " : "Poeng: " }));
        chip.appendChild(document.createTextNode(fmtP(insp.score) + (insp.maks != null ? " / " + fmtP(insp.maks) : "") + " p"));
        return;
      }
      var r = IN.progress && IN.progress.get(cardKey(card, d)), s = r && r.status;
      chip.className = "et-status" + (s === "ok" || s === "ovmer" ? " " + s : "");
      if (s === "ok" || s === "ovmer") {
        chip.appendChild(el("span", { class: "et-sr", text: "Status: " }));
        chip.appendChild(document.createTextNode(s === "ok" ? "✓ Fikk det til" : "↻ Øv mer"));
      }
    }
    document.addEventListener("in:progress", function (e) {
      var k = e.detail && e.detail.key;
      if (card.isConnected && (!k || k === cardKey(card, d))) paintStatus();
    });
    document.addEventListener("in:insp", function (e) {
      var x = e.detail || {};
      if (!card.isConnected || !d.key || x.key !== d.key) return;
      insp = x.score == null ? null : { score: x.score, maks: x.maks, manual: !!x.manual };
      paintStatus();
    });
    paintStatus();
    if (d.open) card.open = true;
    card._show = show;
    card._tabs = order.slice();
    return card;
  };

  /* ---------- Eksamenskort: kildelinje, avvik, steg-demo, perfekt svar ----------
     Nye (valgfrie) felt på IN.examTask (se plan/gjennomgang/wp0-format.md):
       key: "H2023-2"            kanonisk nøkkel → data-key på kortet, IN.PERFEKT[key], dyplenke #oppg=H2023-2
       kilde: "…" | false        egen kildelinje (streng) / ingen kildelinje (false). Standard: «Oppgavetekst: UiO, IN2120, H2023, oppgave 2»
       ark: "Innsetting i heap"  oppgavens tittel på eksamensarket
       ordrett: true | false     oppgaveteksten er ordrett fra arket / omskrevet
       avvik: html | [html]      «Avvik fra eksamensarket: … fordi …», rett under oppgaven
       poengkilde: "sv"          deloppgavepoengene kommer fra sensorveiledningen (stjerne + fotnote)
       demo: {…} | [{…}]         innebygd steg-demo med eksamensinputen, se IN.mountExamDemo
       perfekt: {…}              «Perfekt svar» (ellers IN.PERFEKT[key])
       deler: ["(a)", "(b)"]     vis bare disse deloppgavene i demo og perfekt svar */
  IN.PERFEKT = IN.PERFEKT || {};
  function oppgNr(d) {
    // Punktnummer som «2.3» og «1b» beholdes (IN2120-arkene nummererer slik)
    var m = String(d.oppgave_nr || "").match(/\d+(?:\.\d+)*[a-z]?/);
    if (m) return m[0];
    m = String(d.key || "").match(/-(\d+(?:\.\d+)*[a-z]?)/);
    return m ? m[1] : null;
  }
  function examYear(d) {
    var y = d.year || String(d.key || "").split("-")[0];
    return /^[HV]20\d\d$/.test(y || "") ? y : null;
  }
  function kildeLinje(d) {
    if (d.kilde === false) return null;
    var hasNew = typeof d.kilde === "string" || d.ark || d.ordrett != null || d.key;
    if (!hasNew) return null;
    var txt = typeof d.kilde === "string" ? d.kilde : null;
    if (!txt) {
      var y = examYear(d), nr = oppgNr(d);
      if (y) txt = "Oppgavetekst: UiO, IN2120, " + y + (nr ? ", oppgave " + nr : "");
    }
    var bits = [];
    if (txt) bits.push(el("span", { class: "et-kilde-src", text: txt }));
    if (d.ark) bits.push(el("span", { class: "et-kilde-ark", text: "«" + d.ark + "»" }));
    if (d.ordrett != null) bits.push(el("span", { class: "et-kilde-mode", text: d.ordrett ? "ordrett" : "omskrevet" }));
    if (!bits.length) return null;
    var p = el("p", { class: "et-kilde" });
    bits.forEach(function (b, i) { if (i) p.appendChild(document.createTextNode(" · ")); p.appendChild(b); });
    return p;
  }
  // Streng/array → HTML med avsnitt (ren tekst får <p>)
  function proseHTML(v) {
    if (v == null) return "";
    if (v.nodeType) return v;
    if (Array.isArray(v)) return v.length ? "<ul>" + v.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>" : "";
    var s = String(v);
    return /^\s*</.test(s) ? s : "<p>" + s + "</p>";
  }
  function setContent(node, v) {
    if (v == null) return node;
    if (v.nodeType) node.appendChild(v); else node.innerHTML = String(v);
    return node;
  }
  function normAns(v) { return String(v == null ? "" : v).replace(/\s+/g, " ").replace(/\s*,\s*/g, ", ").trim(); }
  function demoWant(demo, pf) {
    if (demo.fasit != null) return String(demo.fasit);
    if (!pf || !pf.svar) return null;
    var s = pf.svar.filter(function (x) { return x.fasitVerdi != null && (!demo.del || x.del === demo.del); })[0];
    return s ? String(s.fasitVerdi) : null;
  }

  /* Fanen «Steg for steg»: demoen monteres når fanen vises første gang. Flere demoer får en liten
     knapperad (.et-demo-tabs / .et-demo-pane) øverst i fanen. Inne i kortet viser demoen ikke
     «Kjøretid og minne» og «Koden, linje for linje» (iKort). */
  function demoPane(host, d, demos, pf) {
    var ctx = { perfekt: pf, iKort: true };
    var lead = demos.length > 1 ? d.demoLabel : demos[0].label;
    if (lead) host.appendChild(el("p", { class: "et-lead", text: lead }));
    if (demos.length === 1) { IN.mountExamDemo(host, demos[0], ctx); return; }
    var tabs = el("div", { class: "et-demo-tabs", role: "group", "aria-label": "Velg deloppgave" });
    var panes = demos.map(function (dm, i) {
      var pane = el("div", { class: "et-demo-pane" }); pane.hidden = i > 0;
      var done = false;
      function mount() { if (!done) { done = true; IN.mountExamDemo(pane, dm, ctx); } }
      var b = el("button", { class: "btn sm", type: "button", "aria-pressed": i === 0 ? "true" : "false",
        text: dm.tab || dm.label || dm.del || ("Demo " + (i + 1)) });
      b.addEventListener("click", function () {
        IN.qsa("button", tabs).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        panes.forEach(function (p) { p.el.hidden = p.el !== pane; });
        mount();
      });
      tabs.appendChild(b);
      return { el: pane, mount: mount };
    });
    host.appendChild(tabs);
    panes.forEach(function (p) { host.appendChild(p.el); });
    panes[0].mount();
  }

  function algoOf(k) {
    if (!k) return null;
    if (typeof k === "string") return (IN.algos && IN.algos[k]) || null;
    return k.lines ? k : null;
  }
  function codeBlock(host, k, opts) {
    var algo = algoOf(k);
    if (algo && IN.pseudo && IN.pseudo.render) { IN.pseudo.render(host, algo, opts || { tooltips: false }); return; }
    if (typeof k === "string") { host.appendChild(el("pre", { class: "et-pf-pre", text: k })); return; }
    if (algo) host.appendChild(el("pre", { class: "et-pf-pre", text: ["Procedure " + algo.name + "(" + (algo.params || "") + ")"].concat(algo.lines.map(function (l) { return new Array((l.indent || 0) + 1).join("  ") + l.code; })).join("\n") }));
  }
  /* IN2120: ekstra deler i et svar eller en sensordel.
       kode: "openssl …" | [..]   (ren tekst: kommandoer, protokoll, verktøyutdata; vises i monospace)
       formel: "K = g^(ab) mod p" (ren tekst, utregning steg for steg)
       tabell: { kolonner: [..], rader: [[..]], tittel? }  (enkel HTML-tabell)
     sql/sqlBlock er beholdt som alias for kode, så kopierte komponenter (bank.js) virker uendret. */
  function sqlBlock(host, src) {
    var box = el("div", { class: "et-pf-code" });
    host.appendChild(box);
    box.appendChild(el("pre", { class: "et-pf-pre", text: String(src) }));
    return box;
  }
  IN.sqlBlock = IN.kodeBlock = sqlBlock;
  function simpleTable(host, t) {
    var wrap = el("div", { class: "table-wrap" }), tab = el("table", { class: "cmp-table" });
    if (t.tittel) host.appendChild(el("p", { class: "small", html: "<b>" + t.tittel + "</b>" }));
    var thead = el("thead"), tr = el("tr");
    (t.kolonner || []).forEach(function (k) { tr.appendChild(el("th", { html: String(k) })); });
    thead.appendChild(tr); tab.appendChild(thead);
    var tb = el("tbody");
    (t.rader || []).forEach(function (r) { var row = el("tr"); r.forEach(function (c) { row.appendChild(el("td", { html: String(c) })); }); tb.appendChild(row); });
    tab.appendChild(tb); wrap.appendChild(tab); host.appendChild(wrap);
  }
  IN.simpleTable = simpleTable;
  function richParts(host, p) {
    [].concat(p.kode || [], p.sql || []).forEach(function (s) { sqlBlock(host, s); });
    [].concat(p.formel || []).forEach(function (s) { host.appendChild(el("pre", { class: "et-pf-pre et-formel", text: String(s) })); });
    if (p.tabell) [].concat(p.tabell).forEach(function (t) { simpleTable(host, t); });
  }
  IN.richParts = richParts;
  function listOrText(v, cls) {
    if (v == null || v === "") return null;
    if (Array.isArray(v)) return el("ul", { class: cls || null }, v.map(function (x) { return el("li", { html: String(x) }); }));
    return el("div", { class: cls || null, html: proseHTML(v) });
  }
  function filterDeler(arr, deler) {
    if (!arr) return [];
    if (!deler) return arr;
    return arr.filter(function (x) { return !x.del || deler.indexOf(x.del) >= 0; });
  }
  function buildPerfekt(host, d, pf, type) {
    var deler = d.deler || pf.deler || null;
    var ours = el("div", { class: "et-pf-ours" });
    // Ingen overskrift «Vårt fullpoengssvar»: fanen heter «Løsning».
    if (type === "skjonn") ours.appendChild(el("p", { class: "et-pf-note", text: "Sensor vurderer denne oppgaven etter skjønn. Det finnes ikke ett fasitsvar, så dette er ett eksempel på et svar som dekker kriteriene." }));
    if (type === "mock") ours.appendChild(el("p", { class: "et-pf-note", text: "Dette er en øvingsoppgave laget for guiden, ikke en eksamensoppgave. Svaret og poengfordelingen er et anslag, ikke en sensorveiledning." }));
    if (pf.intro) ours.appendChild(el("div", { class: "et-pf-intro", html: proseHTML(pf.intro) }));
    filterDeler(pf.svar, deler).forEach(function (sv) {
      var box = el("div", { class: "et-pf-del" });
      if (sv.del) box.appendChild(el("div", { class: "et-pf-dl", text: sv.del }));
      var main = el("div", { class: "et-pf-main" });
      if (sv.tekst) main.appendChild(el("div", { class: "et-pf-txt", html: proseHTML(sv.tekst) }));
      if (sv.kode) { var ch = el("div", { class: "et-pf-code" }); main.appendChild(ch); codeBlock(ch, sv.kode); }
      richParts(main, sv);
      if (sv.fig) {
        var fig = el("figure", { class: "exam-fig et-pf-fig" }), fh = el("div", { class: "exam-fig-h" });
        fig.appendChild(fh);
        var draw = typeof sv.fig === "function" ? sv.fig : sv.fig.draw;
        if (sv.fig.cap) fig.appendChild(el("figcaption", { html: sv.fig.cap }));
        main.appendChild(fig);
        try { draw(fh); } catch (e) { if (window.console) console.error(e); }
      }
      if (sv.etter) main.appendChild(el("div", { class: "et-pf-txt", html: proseHTML(sv.etter) }));
      if (sv.kjoretid) main.appendChild(el("p", { class: "et-pf-kt", html: "<b>Kjøretid:</b> " + sv.kjoretid }));
      if (sv.poeng) main.appendChild(el("p", { class: "et-pf-poeng", html: "<b>Gir poeng for:</b> " + (Array.isArray(sv.poeng) ? sv.poeng.join("; ") : sv.poeng) }));
      if (sv.hvorfor) { var hh = el("div", { class: "et-pf-why" }); main.appendChild(hh); IN.explain(hh, sv.hvorfor, { label: "Hvorfor dette gir full pott:", noSwitch: true }); }
      box.appendChild(main);
      ours.appendChild(box);
    });
    if (pf.hvorfor) { var wh = el("div", { class: "et-pf-why" }); ours.appendChild(wh); IN.explain(wh, pf.hvorfor, { label: "Hvorfor dette gir full pott:", noSwitch: true }); }
    if (type === "mock" && pf.anslag) {
      var an = el("div", { class: "et-pf-anslag" }, [el("div", { class: "et-pf-anslag-lbl", text: "Et anslag over poengfordelingen" })]);
      var al = listOrText(pf.anslag); if (al) an.appendChild(al);
      ours.appendChild(an);
    }
    host.appendChild(ours);
  }
  /* Fanen «Sensorveiledning»: kildelinje øverst, så sensorveiledningen ordrett med en sitatlinje. */
  function buildSensor(host, d, pf, type, harLosning) {
    var sv = pf && pf.sensor, deler = d.deler || pf.deler || null;
    if (!sv) return;
    var y = examYear(d), nr = oppgNr(d);
    var src = sv.kilde || ("Kilde: sensorveiledning IN2120" + (y ? " " + y : "") + (nr ? ", oppgave " + nr : ""));
    host.appendChild(el("p", { class: "et-pf-src", text: src }));
    host.appendChild(el("p", { class: "et-lead", text: "Ordrett fra sensorveiledningen." + (harLosning ? " Anbefalt løsning står under «Løsning»." : "") }));
    var bq = el("blockquote", { class: "sensor" });
    function sensorPart(p) {
      var w = el("div", { class: "et-sv-del" });
      if (p.del) w.appendChild(el("div", { class: "et-sv-dl", text: p.del }));
      // Skjønnsoppgaver (f.eks. ER-tegning): sensors løsning vises som et eksempel, ikke som fasit
      if (type === "skjonn" && (p.fasit || p.er)) w.appendChild(el("div", { class: "et-sv-eks muted small", text: "Sensors eksempel (ett av flere mulige svar):" }));
      if (type === "skjonn" && p.fasit) w.appendChild(el("div", { class: "et-sv-fasit", html: proseHTML(p.fasit) }));
      if (type === "skjonn" && p.er) richParts(w, { er: p.er });
      if (type !== "skjonn" && p.fasit) w.appendChild(el("div", { class: "et-sv-fasit", html: proseHTML(p.fasit) }));
      if (type !== "skjonn" && p.kode) { var ch = el("div", { class: "et-pf-code" }); w.appendChild(ch); codeBlock(ch, p.kode, { tooltips: false }); }
      if (type !== "skjonn") richParts(w, p);
      if (type !== "skjonn" && p.etter) w.appendChild(el("div", { class: "et-sv-fasit", html: proseHTML(p.etter) }));
      var kr = listOrText(p.kriterier, "et-sv-krit"); if (kr) w.appendChild(kr);
      return w;
    }
    if (sv.deler && sv.deler.length) filterDeler(sv.deler, deler).forEach(function (p) { bq.appendChild(sensorPart(p)); });
    else bq.appendChild(sensorPart(sv));
    host.appendChild(bq);
    if (sv.merknad) host.appendChild(el("p", { class: "et-pf-merknad", html: "<b>Merk:</b> " + sv.merknad }));
  }

  /* ---------- Motorer for innebygde demoer ----------
     IN.registerEngine(navn, {
       viz: "vizHeap",            navnet på IN-funksjonen som tegner ett steg (slås opp når demoen monteres)
       file: "assets/js/…",       filen som definerer viz (brukes i feilmeldingen)
       host: "heapviz",           klasse på spillerens vert (sidens CSS for scenen)
       render(s, ctx, demo),      valgfri egen tegnefunksjon (ellers IN[viz](ctx.stage, s))
       scheme: "group" | "ops",   linjekoder når demoen har flere pseudokoder (se mountExamDemo)
       customInput, parseInput,   standard for «Eget:»-feltet
       answer(lastStep) → tekst   sluttilstanden som sammenlignes med fullpoengssvaret
     }) */
  IN.ENGINES = IN.ENGINES || {};
  IN.registerEngine = function (name, def) { IN.ENGINES[name] = def; return def; };
  function joinArr(a) { return (a || []).map(String).join(", "); }
  IN.joinArr = joinArr;
  /* IN2010-motorene (bars, search, buckets, heap, median, tree, hash, graph, list) er fjernet.
     2120 registrerer sine egne motorer i viz-*-filene, f.eks.
       IN.registerEngine("dh", { viz: "vizDh", file: "assets/js/viz-krypto.js", host: "dh-host", customInput: false });
     Se BYGGEGUIDE.md for feltene. */

  function resolveGen(g) {
    if (typeof g === "function") return g;
    if (typeof g !== "string") return null;
    if (g.indexOf(".") < 0) return (IN.gen && IN.gen[g]) || null;
    var o = IN; g.split(".").forEach(function (p) { o = o && o[p]; });
    return typeof o === "function" ? o : null;
  }
  function lastOf(steps) { return steps && steps.length ? steps[steps.length - 1] : null; }
  function demoAnswer(demo, eng, last) {
    if (!last) return null;
    if (typeof demo.svar === "function") return demo.svar(last);
    if (last.svar != null) return last.svar;
    return eng && eng.answer ? eng.answer(last) : null;
  }
  /* Sjekk at demoens sluttilstand på eksamensinputen er lik fullpoengssvaret. → { ok, got, want } | null */
  IN.checkExamDemo = function (demo, pf) {
    var eng = IN.ENGINES[demo.engine], gen = resolveGen(demo.gen), want = demoWant(demo, pf);
    if (!gen || want == null || demo.input == null) return null;
    var got = demoAnswer(demo, eng, lastOf(gen(demo.input.slice ? demo.input.slice() : demo.input)));
    if (got == null) return null;
    return { ok: normAns(got) === normAns(want), got: normAns(got), want: normAns(want) };
  };

  /* IN.mountExamDemo(host, demo, { perfekt, iKort })   iKort: true inne i eksamenskortet (se demoPane)
     demo: {
       engine: "heap",                 navn i IN.ENGINES
       gen: "heapInsert" | "heapGen.median" | fn,   generator (IN.gen[navn], sti i IN, eller funksjon)
       input: [3, 5, 10, 8, 4, 2, 7],  eksamensinputen (array, slik stepPlayer krever)
       inputNavn: "H2023 (a)",         navn på eksempelknappen (standard «Oppgavens input»)
       presets: { navn: input } | false,
       pseudo: "heapInsert" | algo | ["a", "b"],   pseudokode(r) som følger demoen
       calls / callLine,               kall-linjer for flere pseudokoder (group: calls[k] = kode; ops: callLine[a] = kode)
       scheme: "group" | "ops",        linjekoder ved flere pseudokoder (standard fra motoren, ellers group)
       legend, label, del: "(a)",      fargeforklaring, tittel, deloppgaven demoen hører til
       fasit: "2, 4, 3, …", svar: fn(lastStep),   overstyr sammenligningen (ellers perfekt.svar[del].fasitVerdi)
       customInput, parseInput, inputLabel, countControl
     } */
  IN.mountExamDemo = function (host, demo, ctx) {
    if (typeof host === "string") host = qs(host);
    if (!host || !demo) return null;
    ctx = ctx || {};
    function fail(msg) { host.appendChild(el("p", { class: "muted small et-demo-err", text: msg })); return null; }
    try {
      if (!IN.stepPlayer) return fail("Steg-demoen kan ikke vises: stepplayer.js er ikke lastet på denne siden.");
      var eng = IN.ENGINES[demo.engine];
      if (!eng) return fail("Steg-demoen kan ikke vises: ukjent motor «" + demo.engine + "».");
      if (eng.viz && typeof IN[eng.viz] !== "function") return fail("Steg-demoen kan ikke vises: " + (eng.file || eng.viz) + " er ikke lastet på denne siden.");
      var gen = resolveGen(demo.gen);
      if (!gen) return fail("Steg-demoen kan ikke vises: fant ikke generatoren «" + demo.gen + "».");
      var draw = eng.render ? function (s, c) { eng.render(s, c, demo); } : function (s, c) { IN[eng.viz](c.stage, s); };

      var keys = demo.pseudo == null ? [] : (Array.isArray(demo.pseudo) ? demo.pseudo : [demo.pseudo]);
      var algos = keys.map(algoOf).filter(Boolean);
      var multi = algos.length > 1, scheme = demo.scheme || eng.scheme || "group";

      var playerEl = el("div", { class: eng.host || "" });
      var check = el("p", { class: "et-demo-check", role: "status" }); check.hidden = true;
      var left = el("div", { class: "et-demo-left" }, [playerEl, check]);
      var right = el("div", { class: "et-demo-pc" + (multi ? " hs-pcs" : "") }, [el("h4", { class: "et-demo-h", text: "Pseudokode (følger demoen)" })]);
      var handle = null;
      var det = null;
      var iKort = !!ctx.iKort;   // inne i eksamenskortet: ingen «Koden, linje for linje» og ingen «Kjøretid og minne»
      if (algos.length && IN.pseudo && IN.pseudo.render) {
        if (!iKort) det = el("details", { class: "card et-demo-lines" }, [el("summary", { html: "<b>Koden, linje for linje</b> (" + algos.map(function (a) { return plainEsc(a.name); }).join(", ") + ")" })]);
        var hs = algos.map(function (a) {
          var box = el("div", { class: "hs-pc" }), pc = el("div");
          if (multi) box.appendChild(el("h5", { class: "hs-pc-title", text: a.title || a.name }));
          box.appendChild(pc); right.appendChild(box);
          var hd = IN.pseudo.render(pc, a, { head: !multi });
          if (!iKort) {
            var bo = IN.pseudo.bigO && IN.pseudo.bigO(a, { compact: true }); if (bo) box.appendChild(bo);
            var ex = el("div");
            if (multi) det.appendChild(el("h5", { style: "margin:.8rem 0 .3rem", text: a.title || a.name }));
            det.appendChild(ex);
            if (IN.pseudo.explainer) IN.pseudo.explainer(ex, a, {});
          }
          return { box: box, hd: hd };
        });
        if (!multi) handle = hs[0].hd;
        else {
          var calls = demo.calls || {}, callLine = demo.callLine || {};
          var on = function (i, l) { if (hs[i]) { hs[i].hd.highlight(l); hs[i].box.classList.add("on"); } };
          var off = function () { hs.forEach(function (h) { h.hd.clear(); h.box.classList.remove("on"); }); };
          handle = {
            highlight: function (code) {
              off(); right.classList.add("has-on");
              if (scheme === "ops") {
                var a = Math.floor(code / 100) - 1; on(a, code % 100);
                var cl = callLine[a + 1]; if (cl) on(Math.floor(cl / 100) - 1, cl % 100);
              } else {
                var caller = Math.floor(code / 1000), c = code % 1000, k = Math.floor(c / 100);
                on(k, c % 100);
                var cc = caller || calls[k]; if (cc != null && cc !== 0) on(Math.floor(cc / 100), cc % 100);
              }
            },
            clear: function () { off(); right.classList.remove("has-on"); }
          };
        }
      }
      host.appendChild(el("div", { class: "grid cols-2 et-demo-grid" }, algos.length ? [left, right] : [left]));
      if (det) host.appendChild(det);

      var want = demoWant(demo, ctx.perfekt), cur = null;
      var inputKey = JSON.stringify(demo.input);
      function paintCheck(s, c) {
        if (want == null) return;
        var atEnd = c.index === c.total - 1 && JSON.stringify(cur) === inputKey;
        var got = atEnd ? demoAnswer(demo, eng, s) : null;
        var ok = got != null && normAns(got) === normAns(want);
        check.hidden = !ok;
        if (ok) check.textContent = "✓ Samme sluttilstand som i fullpoengssvaret" + (demo.del ? " " + demo.del : "") + ": " + normAns(want);
      }
      var presets = null;
      if (demo.presets !== false) {
        presets = {};
        presets[demo.inputNavn || "Oppgavens input"] = demo.input;
        if (demo.presets) for (var pk in demo.presets) presets[pk] = demo.presets[pk];
      }
      var custom = demo.customInput != null ? demo.customInput : (demo.parseInput ? true : (eng.customInput != null ? eng.customInput : true));
      var player = IN.stepPlayer(playerEl, {
        generate: function (inp) { cur = inp; return gen(inp); },
        presets: presets, initial: demo.input,
        render: function (s, c) { draw(s, c); paintCheck(s, c); },
        pseudo: handle, legend: demo.legend || eng.legend || null,
        customInput: custom, parseInput: demo.parseInput || eng.parseInput, inputLabel: demo.inputLabel,
        countControl: demo.countControl || null
      });
      var res = IN.checkExamDemo(demo, ctx.perfekt);
      if (res && !res.ok && window.console) console.error("Eksamensdemo (" + (demo.label || demo.gen) + "): sluttilstanden «" + res.got + "» er ikke lik fullpoengssvaret «" + res.want + "».");
      return player;
    } catch (e) {
      if (window.console) console.error(e);
      return fail("Steg-demoen kunne ikke startes.");
    }
  };
  function plainEsc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* Egenvurdering nederst i hvert eksamenskort → kort:<side>:<id> {status:"ok"|"ovmer"}.
     Id-en hentes når den trengs: kortets egen id, ellers nærmeste forelder med id. */
  function cardKey(card, d) {
    var id = card.id || ((card.parentElement && card.parentElement.closest("[id]")) || {}).id;
    if (!id) id = "t-" + String((d.year || "") + "-" + (d.title || "")).toLowerCase().replace(/[^a-z0-9æøå]+/g, "-");
    return "kort:" + IN.pageId() + ":" + id;   // nøkkel inne i fremdriftsregisteret (in2120:fremdrift:v1), ikke egen localStorage-nøkkel
  }
  /* B8 (UI/UX 2026-11-26): «Hvordan gikk det?» vises først når kortet er rettet eller vurdert:
       - etter «Rett som på eksamen» / «Vurder svaret mitt» i kortets Inspera-øving (in:insp med poeng),
       - når Løsning eller Sensorveiledning er åpnet (kort uten automatisk retting vurderes mot løsningen),
       - eller når en egenvurdering allerede er lagret.
     Ved automatisk retting forhåndsmarkeres «✓ Fikk det til» ved full pott og ellers «↻ Må øve mer».
     Valget kan endres, og det blir stående når øvingen nullstilles. */
  function selfAssess(card, d, inspApi) {
    var wrap = el("div", { class: "et-self", role: "group", "aria-label": "Hvordan gikk oppgaven?" });
    function key() { return cardKey(card, d); }
    var bOk = el("button", { class: "btn sm et-self-ok", type: "button", text: "✓ Fikk det til" });
    var bOv = el("button", { class: "btn sm et-self-ov", type: "button", text: "↻ Må øve mer" });
    var vist = !!(inspApi && inspApi.status && inspApi.status());
    function paint() {
      var r = IN.progress && IN.progress.get(key()), s = r && r.status;
      bOk.setAttribute("aria-pressed", s === "ok" ? "true" : "false");
      bOv.setAttribute("aria-pressed", s === "ovmer" ? "true" : "false");
      wrap.hidden = !(vist || s === "ok" || s === "ovmer");
    }
    wrap._vis = function () { if (!vist) { vist = true; paint(); } };
    document.addEventListener("in:insp", function (e) {
      var x = e.detail || {};
      if (!card.isConnected || !d.key || x.key !== d.key) return;
      if (x.score == null) { vist = false; paint(); return; }
      vist = true;
      if (!x.manual && IN.progress && x.maks != null) IN.progress.set(key(), { status: x.score >= x.maks - 1e-9 ? "ok" : "ovmer" });
      paint();
    });
    function pick(s) {
      if (!IN.progress) return;
      var r = IN.progress.get(key());
      IN.progress.set(key(), { status: r && r.status === s ? null : s });   // trykk igjen = angre
      paint();
    }
    bOk.addEventListener("click", function () { pick("ok"); });
    bOv.addEventListener("click", function () { pick("ovmer"); });
    wrap.appendChild(el("span", { class: "et-self-q muted small", text: "Hvordan gikk det?" }));
    wrap.appendChild(bOk); wrap.appendChild(bOv);
    card.addEventListener("toggle", function () { if (card.open) paint(); });
    document.addEventListener("in:progress", function (e) { var k = e.detail && e.detail.key; if (!k || k === key()) paint(); });
    setTimeout(paint, 0);
    return wrap;
  }
  IN._selfAssess = selfAssess;

  /* ---------- Oppgavetekst med figurer og merkede deloppgaver ----------
     IN.oppg({ intro: html, figs: [{ draw: fn(host), cap: html, cls: "code"|"wide" }],
               parts: [ { t: html, p: 2 } | { note: html } | "html" ], outro: html })
     Returnerer en DOM-node som kan brukes som examTask.oppgave. Deloppgavene merkes (a), (b), …
     ({ note } er en mellomtekst uten bokstav). figsAfter: figurer etter deloppgavene. */
  IN.partsHTML = function (parts) {
    return '<ol class="et-parts">' + parts.map(function (x) {
      if (x && x.note != null) return '<li class="et-note">' + x.note + "</li>";
      var o = typeof x === "string" ? { t: x } : x;
      return "<li>" + o.t + (o.p != null ? ' <span class="et-p">(' + o.p + "p)</span>" : "") + "</li>";
    }).join("") + "</ol>";
  };
  IN.oppg = function (d) {
    var wrap = el("div", { class: "et-oppg" });
    function html(h) { if (h) { var x = el("div"); x.innerHTML = h; wrap.appendChild(x); } }
    function figs(list) {
      if (!list || !list.length) return;
      var row = el("div", { class: "exam-figs" });
      list.forEach(function (f) {
        var fig = el("figure", { class: "exam-fig" + (f.cls ? " " + f.cls : "") }), h = el("div", { class: "exam-fig-h" });
        fig.appendChild(h);
        if (f.cap) fig.appendChild(el("figcaption", { html: f.cap }));
        row.appendChild(fig);
        // Tegnes med en gang: motorene måler ikke DOM-en, så verten trenger ikke være montert ennå
        try { f.draw(h); } catch (e) { if (window.console) console.error(e); }
      });
      wrap.appendChild(row);
    }
    html(d.intro);
    figs(d.figs);
    if (d.parts && d.parts.length) html(IN.partsHTML(d.parts));
    figs(d.figsAfter);   // figurer som deloppgavene viser til «under»
    html(d.outro);
    return wrap;
  };

  /* Monter en liste av eksamensoppgaver i samme vert. */
  IN.examTasks = function (host, arr) {
    if (typeof host === "string") host = qs(host);
    if (!host || !arr) return;
    clear(host);
    arr.forEach(function (d) { IN.examTask(host, d); });
  };

  /* ---------- Generelle tooltips: alle elementer med data-tip ----------
     Deler den flytende boksen #pc-tip med pseudokodelinjene, så bare én vises om gangen.
     Desktop: hover/fokus. Mobil (ingen hover): trykk for å vise, trykk igjen, utenfor
     eller scroll for å lukke. Teksten settes som ren tekst (textContent). */
  IN.tips = function (root) {
    var tip = document.getElementById("pc-tip");
    if (!tip) {
      tip = el("div", { id: "pc-tip", class: "pc-tip", role: "tooltip" });
      tip.hidden = true;
      document.body.appendChild(tip);
    }
    var st = IN.tips._st || (IN.tips._st = { current: null, shownAt: 0 });
    function show(t) {
      tip.textContent = t.getAttribute("data-tip");
      tip.hidden = false;
      var r = t.getBoundingClientRect();
      var tw = tip.getBoundingClientRect().width;
      var vw = document.documentElement.clientWidth;
      var left = window.pageXOffset + r.left;
      var maxLeft = window.pageXOffset + vw - tw - 10;
      if (left > maxLeft) left = Math.max(window.pageXOffset + 8, maxLeft);
      tip.style.left = left + "px";
      tip.style.top = (window.pageYOffset + r.bottom + 6) + "px";
      st.current = t; st.shownAt = Date.now();
    }
    function hide() { tip.hidden = true; st.current = null; }
    qsa("[data-tip]", root || document).forEach(function (t) {
      if (t._tipBound) return;
      t._tipBound = true;
      t.classList.add("has-tip");
      if (!t.hasAttribute("tabindex")) t.setAttribute("tabindex", "0");
      t.addEventListener("mouseenter", function () { show(t); });
      t.addEventListener("mouseleave", hide);
      t.addEventListener("focus", function () { show(t); });
      t.addEventListener("blur", hide);
      // På touch kommer mouseenter rett før click – ikke lukk det som nettopp åpnet seg.
      t.addEventListener("click", function () {
        if (st.current === t && Date.now() - st.shownAt > 400) hide(); else show(t);
      });
    });
    if (!st.docBound) {
      st.docBound = true;
      document.addEventListener("click", function (e) {
        if (st.current && !st.current.contains(e.target)) hide();
      });
      window.addEventListener("scroll", function () { if (st.current) hide(); }, { passive: true });
    }
  };

  /* ---------- Symbolforklaringer: ⌊x⌋, ∈, |V|, |E| … (ordlista ligger i symboler.js) ----------
     IN.symbolTips(root) pakker symboler i forklaringstekst inn i <span class="sym" data-sym="…">.
     Går bare gjennom TEKSTNODER (aldri innerHTML), og hopper over kode, kbd, knapper, lenker,
     skjemafelt, SVG og alt som alt er pakket. Pseudokode pakkes av tokenizeren (pseudocode.js).
     Ett felles tips (#sym-tip) med delegerte lyttere på document, så ingen lyttere per symbol:
     hover (mus), fokus (tastatur: første forekomst av hvert symbol per boks får tabindex), trykk (touch).
     Tipset legges OVER symbolet, så det ikke kolliderer med linjetipset (#pc-tip) under pseudokodelinja. */
  var SYM_BOX = ".sp-explain, .callout, .explain-body, .et-content, .et-pf-body, .qz-exp, .qz-prompt, .pc-exp-body, .bigo-why";
  var SYM_SKIP = "code, kbd, pre, samp, a, button, input, textarea, select, label, svg, script, style, .sym, .pseudo, .parsons, .kbd, .tagline, [contenteditable]";
  var symSt = { tip: null, cur: null, at: 0, ptr: "mouse", bound: false };
  IN.symbolTips = function (root) {
    var SY = IN.SYMBOLER;
    if (!SY || !root) return;
    symTipBind();
    if (symSt.cur && !symSt.cur.isConnected) symHide();      // steget ble tegnet på nytt under tipset
    var inBox = root.nodeType === 1 && (root.matches(SYM_BOX) || root.closest(SYM_BOX));
    var boxes = inBox ? [root] : qsa(SYM_BOX, root);
    boxes.forEach(function (box) {
      var seen = {}, todo = [], n;
      qsa(".sym[tabindex]", box).forEach(function (s) { seen[s.getAttribute("data-sym") + (s.getAttribute("data-arg") || "")] = 1; });
      var w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT, null);
      while ((n = w.nextNode())) {
        var hits = SY.scan(n.nodeValue);
        if (hits.length && !(n.parentNode.closest && n.parentNode.closest(SYM_SKIP))) todo.push([n, hits]);
      }
      todo.forEach(function (t) {
        var tn = t[0], text = tn.nodeValue, frag = document.createDocumentFragment(), pos = 0;
        t[1].forEach(function (h) {
          if (h.i > pos) frag.appendChild(document.createTextNode(text.slice(pos, h.i)));
          var s = el("span", { class: "sym", "data-sym": h.id, "data-arg": h.arg || null, text: text.substr(h.i, h.n) });
          var k = h.id + (h.arg || "");
          if (!seen[k]) { seen[k] = 1; s.tabIndex = 0; }
          frag.appendChild(s);
          pos = h.i + h.n;
        });
        if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
        tn.parentNode.replaceChild(frag, tn);
      });
    });
  };
  function symShow(s) {
    var e = IN.SYMBOLER && IN.SYMBOLER.entry(s.getAttribute("data-sym"), s.getAttribute("data-arg"));
    if (!e) return;
    var t = symSt.tip;
    if (!t) { t = symSt.tip = el("div", { id: "sym-tip", class: "pc-tip sym-tip", role: "tooltip" }); document.body.appendChild(t); }
    clear(t);
    t.appendChild(el("span", { class: "sym-tip-h" }, [el("b", { text: e.vis }), " – " + e.navn]));
    t.appendChild(el("span", { class: "sym-tip-t", text: e.txt }));
    if (e.eks) t.appendChild(el("span", { class: "sym-tip-e", text: "Eksempel: " + e.eks }));
    t.hidden = false;
    if (symSt.cur && symSt.cur !== s) symSt.cur.removeAttribute("aria-describedby");
    symSt.cur = s; symSt.at = Date.now();
    s.setAttribute("aria-describedby", "sym-tip");
    // Plassering: sentrert over symbolet, holdt innenfor skjermen; under hvis det ikke er plass over.
    t.style.left = "0px"; t.style.top = "0px";
    var r = s.getBoundingClientRect(), tr = t.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    var left = Math.max(8, Math.min(r.left + r.width / 2 - tr.width / 2, vw - tr.width - 8));
    var top = r.top - tr.height - 6;
    if (top < IN.stickyH()) top = r.bottom + 6;
    t.style.left = (window.pageXOffset + left) + "px";
    t.style.top = (window.pageYOffset + top) + "px";
  }
  function symHide() {
    if (symSt.tip) symSt.tip.hidden = true;
    if (symSt.cur) symSt.cur.removeAttribute("aria-describedby");
    symSt.cur = null;
  }
  function symTipBind() {
    if (symSt.bound) return;
    symSt.bound = true;
    function symOf(e) { var x = e.target; return x && x.closest ? x.closest(".sym") : null; }
    document.addEventListener("pointerdown", function (e) { symSt.ptr = e.pointerType || "mouse"; }, true);
    document.addEventListener("pointerover", function (e) {
      if (e.pointerType !== "mouse") return;
      var s = symOf(e); if (s && s !== symSt.cur) symShow(s);
    });
    document.addEventListener("pointerout", function (e) {
      if (e.pointerType !== "mouse") return;
      var s = symOf(e);
      if (s && s === symSt.cur && !(e.relatedTarget && s.contains(e.relatedTarget))) symHide();
    });
    document.addEventListener("focusin", function (e) { var s = symOf(e); if (s) symShow(s); else if (symSt.cur) symHide(); });
    document.addEventListener("focusout", function (e) { var s = symOf(e); if (s && s === symSt.cur) symHide(); });
    // Touch: trykk viser, nytt trykk (eller trykk utenfor / scroll) skjuler. Mus: klikk viser.
    document.addEventListener("click", function (e) {
      var s = symOf(e);
      if (!s) { if (symSt.cur) symHide(); return; }
      if (symSt.ptr !== "mouse" && symSt.cur === s && Date.now() - symSt.at > 400) symHide(); else symShow(s);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && symSt.cur) symHide(); });
    document.addEventListener("dragstart", symHide);
    window.addEventListener("scroll", function () { if (symSt.cur) symHide(); }, { passive: true });
    window.addEventListener("resize", function () { if (symSt.cur) symHide(); });
  }

  /* ---------- Småverktøy ---------- */
  IN.store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Fremdrift: felles register for alle sider (localStorage) ----------
     Nøkler: kort:<side>:<kort-id> {status:"ok"|"ovmer"} · quiz|tf|parsons|del1:<side>:<id> {score,max,best,last}
     crash:… brukes av løypesiden. Alle endringer sender document-hendelsen "in:progress" {key, rec}.
     Domenet (vegardjorg.github.io) deles med andre repoer, derfor prefikset in2120:. */
  IN.pageId = function () { return (document.body && document.body.getAttribute("data-page")) || "index"; };
  (function () {
    var KEY = "in2120:fremdrift:v1";
    /* Lagret fremdrift kan være skrevet av en eldre versjon eller være ødelagt: hver post må være et
       vanlig objekt med endelige tall, ellers ryddes den bort (portert fra IN2010-guiden). */
    var NUMS = ["t", "score", "best", "max", "last"];
    function cleanRec(r) {
      if (!r || typeof r !== "object" || Array.isArray(r)) return null;
      NUMS.forEach(function (p) {
        if (r[p] == null) return;
        var n = typeof r[p] === "number" ? r[p] : parseFloat(r[p]);
        if (isFinite(n)) r[p] = n; else delete r[p];
      });
      if (r.status != null && typeof r.status !== "string") delete r.status;
      return r;
    }
    function cleanAll(o) {
      var out = {};
      if (!o || typeof o !== "object" || Array.isArray(o)) return out;
      Object.keys(o).forEach(function (k) { var r = cleanRec(o[k]); if (r) out[k] = r; });
      return out;
    }
    function load() { try { return cleanAll(JSON.parse(IN.store.get(KEY, "{}"))); } catch (e) { return {}; } }
    function save(all) { IN.store.set(KEY, JSON.stringify(all)); }
    function emit(key, rec) { try { document.dispatchEvent(new CustomEvent("in:progress", { detail: { key: key, rec: rec } })); } catch (e) {} }
    IN.progress = {
      KEY: KEY,
      get: function (k) { return load()[k] || null; },
      all: load,
      set: function (k, patch) {
        var a = load(), rec = a[k] || {};
        Object.keys(patch || {}).forEach(function (p) { if (patch[p] === null) delete rec[p]; else rec[p] = patch[p]; });
        rec.t = Date.now(); a[k] = rec; save(a); emit(k, rec); return rec;
      },
      /* Løst oppgave/test: score og max er beste forsøk (målt som andel), last er siste andel */
      solved: function (kind, id, score, max) {
        if (!id || !max) return null;
        var k = kind + ":" + IN.pageId() + ":" + id, old = load()[k] || {};
        var r = score / max, oldR = old.max ? (old.best != null ? old.best : old.score || 0) / old.max : -1;
        var patch = { last: Math.round(r * 1000) / 1000 };
        if (r >= oldR) { patch.score = score; patch.best = score; patch.max = max; }
        return IN.progress.set(k, patch);
      },
      clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} emit(null, null); },
      exportCode: function () { try { return btoa(unescape(encodeURIComponent(JSON.stringify(load())))); } catch (e) { return ""; } },
      importCode: function (s) {
        try {
          var raw = JSON.parse(decodeURIComponent(escape(atob(String(s).replace(/\s+/g, "")))));
          if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
          var o = cleanAll(raw), a = load();
          Object.keys(o).forEach(function (k) {   // nyeste vinner per nøkkel
            if (!a[k] || (o[k].t || 0) >= (a[k].t || 0)) a[k] = o[k];
          });
          save(a); emit(null, null); return true;
        } catch (e) { return false; }
      }
    };
  })();

  /* Høyden på de faste linjene øverst (meny + ev. nivålinje) når de står fast, + litt luft */
  // skip: et element som ikke skal telles med (en fast linje som plasserer seg selv, må ikke måle seg selv)
  IN.stickyH = function (skip) {
    var h = 0;
    // Faste linjer: toppmenyen, nivålinja og sidelokale linjer merket med data-sticky (f.eks. crash-sidens fremdriftslinje)
    [qs("#topnav"), qs("#levelbar")].concat(qsa("[data-sticky]")).forEach(function (n) {
      if (!n || n === skip) return;
      var cs = getComputedStyle(n);
      if (cs.position === "sticky" || cs.position === "fixed") h = Math.max(h, (parseFloat(cs.top) || 0) + n.offsetHeight);
    });
    return h + 8;
  };

  /* Eksamensmerker i sidehodet: <span class="badge" data-go="fane" data-card="h2021-9">.
     Ett felles oppsett for alle sider: lenke-rolle, tastatur, og hopp via #fane=…&oppg=…
     (data-card kan utelates; da brukes #exam-<fane> hvis den finnes, ellers bare fanen). */
  function initBadges() {
    qsa(".badge[data-go]").forEach(function (b) {
      b.setAttribute("role", "link"); b.setAttribute("tabindex", "0");
      function go() {
        var fane = b.getAttribute("data-go"), c = b.getAttribute("data-card");
        var id = c ? "exam-" + c : (document.getElementById("exam-" + fane) ? "exam-" + fane : "");
        var h = "#fane=" + fane + (id ? "&oppg=" + id : "");
        if (location.hash !== h) location.hash = h;      // hashchange → fane + reveal
        else if (IN.revealOppg) IN.revealOppg();
      }
      b.addEventListener("click", go);
      b.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  /* Lenke til samme #fane=…&oppg=… som allerede står i adressen gir ingen hashchange:
     kjør hoppet likevel, så lenken alltid gjør noe. */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#fane="]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var href = a.getAttribute("href"), i = href.indexOf("#");
    var page = href.slice(0, i), here = location.pathname.split("/").pop() || "index.html";
    if (page && page !== here) return;
    if (href.slice(i) === location.hash && IN.revealOppg) { e.preventDefault(); IN.revealOppg(); }
  });

  /* Kom du fra crash course-løypa (#…&fra=crash&steg=9d)? Vis «← Tilbake til løypa»
     så lenge du er i denne fanen/økta (sessionStorage), til du lukker den. */
  function initCrashReturn() {
    var KEY = "in2120:crash-retur", m = location.hash.match(/fra=crash(?:&steg=([\w-]+))?/), steg;
    try {
      if (IN.pageId() === "crash") { sessionStorage.removeItem(KEY); return; }
      if (m) sessionStorage.setItem(KEY, m[1] || "");
      steg = sessionStorage.getItem(KEY);
    } catch (e) { steg = m ? (m[1] || "") : null; }
    if (steg == null) return;
    var chip = el("div", { class: "crash-ret", role: "navigation", "aria-label": "Crash course" });
    chip.appendChild(el("a", { class: "crash-ret-a", href: "crash.html" + (steg ? "#steg=" + steg : ""),
      text: "← Tilbake til løypa" + (steg ? " · steg " + steg : "") }));
    chip.appendChild(el("button", { class: "crash-ret-x", type: "button", "aria-label": "Skjul tilbake-knappen", text: "×",
      onclick: function () { try { sessionStorage.removeItem(KEY); } catch (e) {} chip.remove(); } }));
    document.body.appendChild(chip);
    document.body.classList.add("has-crash-ret");
  }

  /* ---------- Melding om ny versjon (samme oppførsel som IN2010/IN2090) ----------
     Siden kjenner sin egen versjon fra ?v= på core.js. versjon.js lastes som <script> med ?t=<tid>
     (ikke fetch, så det virker uten server), og setter IN.SISTE_VERSJON. Sjekkes 3 s etter lasting,
     når fanen blir synlig igjen og hvert 30. minutt (høyst én gang i minuttet). Er den nyere, vises
     «Det finnes en ny versjon av guiden.» med «Oppdater». Ved bump: python -I plan/bump-versjon.py. */
  function initVersionCheck() {
    var s = document.querySelector('script[src*="core.js"]'), src = s && s.getAttribute("src") || "";
    var m = src.match(/^(.*?)core\.js\?v=([\w-]+)/);
    if (!m || /\/plan\//.test(location.pathname)) return;
    var egen = m[2], base = m[1], DISMISS = "in2120:ny-versjon-skjult", last = 0, shown = null, tag = null;
    function check() {
      if (Date.now() - last < 60000) return;
      last = Date.now();
      if (tag) tag.remove();
      tag = document.createElement("script");
      tag.src = base + "versjon.js?t=" + Date.now();
      tag.onload = function () {
        var v = typeof IN.SISTE_VERSJON === "string" ? IN.SISTE_VERSJON : null;
        if (!v || v <= egen || v === shown) return;      // samme eller eldre
        var skjult = null; try { skjult = sessionStorage.getItem(DISMISS); } catch (e) {}
        if (skjult === v) return;
        show(v);
      };
      tag.onerror = function () { if (tag) tag.remove(); tag = null; };
      document.head.appendChild(tag);
    }
    function show(v) {
      shown = v;
      var old = qs(".ny-versjon"); if (old) old.remove();
      var box = el("div", { class: "ny-versjon", role: "status" });
      var go = el("button", { class: "btn primary sm", type: "button", text: "Oppdater" });
      go.addEventListener("click", function () {
        go.disabled = true; go.textContent = "Henter …";
        // Over http(s): hent siden forbi nettleserens mellomlager først, så lastes den inn med de nye
        // filene. Bare en oppfrisking av mellomlageret; fra file:// lastes siden rett inn på nytt.
        if (/^https?:$/.test(location.protocol) && window.fetch) {
          fetch(location.href.split("#")[0], { cache: "reload" }).catch(function () {})
            .then(function () { location.reload(); });
        } else location.reload();
      });
      var x = el("button", { class: "ny-versjon-x", type: "button", "aria-label": "Skjul meldingen", text: "×",
        onclick: function () { try { sessionStorage.setItem(DISMISS, v); } catch (e) {} box.remove(); } });
      box.appendChild(el("span", { text: "Det finnes en ny versjon av guiden." }));
      box.appendChild(go); box.appendChild(x);
      document.body.appendChild(box);
    }
    setTimeout(check, 3000);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") check(); });
    setInterval(function () { if (document.visibilityState === "visible") check(); }, 30 * 60000);
  }

  /* ---------- «Husk»-lister (fra IN2010, F1b) ----------
     Tre eller flere callouts rett etter hverandre blir én nøytral liste med små merkelapper.
     Alt innhold beholdes: merkelappen blir en liten etikett + uthevet tittel, teksten står uendret. */
  var HUSK_T = { felle: "Felle", sensor: "Sensor", begrep: "Begrep", snarvei: "Eksamen", uni: "Teknisk", eli5: "5-åring", eksempel: "Eksempel" };
  var HUSK_STRIP = /^(vanlig\s+felle|felle|universitetsnivå|teknisk|snarvei på eksamen|snarvei|vårt råd|eksempel|5-åring|som for en 5-åring)\s*[:·–-]?\s*/i;
  IN.huskLists = function (root) {
    var seen = [];
    qsa(".callout", root || document).forEach(function (c) {
      if (seen.indexOf(c) >= 0 || c.closest(".examtask, .husk, .et-card")) return;
      var run = [c], n = c.nextElementSibling;
      while (n && n.classList.contains("callout")) { run.push(n); n = n.nextElementSibling; }
      run.forEach(function (x) { seen.push(x); });
      // Bare korte, rene tekstcallouts: et eksempel med tabell, figur eller widget skal stå for seg selv.
      var foldable = function (x) { return !x.querySelector("table, pre, figure, svg, canvas, button, input, ol, ul, [id^='viz'], [data-viz]") && x.textContent.length < 420; };
      if (run.length < 3 || !run.every(foldable)) return;
      var ul = el("ul");
      run.forEach(function (x) {
        var kind = Object.keys(HUSK_T).filter(function (k) { return x.classList.contains(k); })[0] || "eksempel";
        var li = el("li", { class: kind });
        if (x.id) li.id = x.id;
        var lbl = x.querySelector(":scope > .lbl");
        var title = lbl ? lbl.textContent.replace(HUSK_STRIP, "").trim() : "";
        if (lbl) lbl.parentNode.removeChild(lbl);
        li.appendChild(el("span", { class: "t " + (kind === "snarvei" ? "raad" : kind), text: HUSK_T[kind] }));
        if (title) li.appendChild(el("b", { text: title.charAt(0).toUpperCase() + title.slice(1) + (/[.?!:]$/.test(title) ? " " : ". ") }));
        while (x.firstChild) li.appendChild(x.firstChild);
        ul.appendChild(li);
      });
      var box = el("div", { class: "husk" }, [el("h4", { text: "Husk" }), ul]);
      c.parentNode.insertBefore(box, c);
      run.forEach(function (x) { x.parentNode.removeChild(x); });
    });
  };

  /* ---------- Oppstart ---------- */
  function boot() {
    IN.huskLists(document);
    buildNav();
    buildLevelBar();
    IN.tabs(document);
    initBadges();
    initCrashReturn();
    initVersionCheck();
    // Genererte sant/usant-påstander (data-tf.js): <div data-tf-gen="sortering"></div>
    qsa("[data-tf-gen]").forEach(function (host) {
      var sek = host.getAttribute("data-tf-gen");
      var items = IN.TF_GEN && IN.TF_GEN[sek];
      if (items && items.length) IN.tfTest(host, items, { id: "gen-" + sek });
    });
    // Symbolforklaringer i statisk tekst (.callout o.l.) og det sidens egne skript har tegnet ved oppstart
    setTimeout(function () { IN.symbolTips(document); }, 0);
    window.addEventListener("load", function () { IN.symbolTips(document); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* ---------- Opphav: hvor en øving kommer fra ----------
     Brukes av inspera.js (og andre øvinger) for oppgaver som IKKE er eksamensoppgaver.
     op = { type: "egen" | "ukesoppgave" | "oblig-type", variantAv: "H2025-1", kilder: ["d01 s. 30", "t01 oppg. 2"] }
     Gir én linje, f.eks. «Laget for guiden, ikke en eksamensoppgave. Variant av H2025 oppgave 1. Bygger på d01 s. 30.» */
  var BLOKK_SIDE = {
    generelt: "grunnbegreper", fysisk: "grunnbegreper", lov: "angrep",
    krypto: "krypto", pki: "pki", angrep: "angrep", pentest: "angrep", system: "system",
    risiko: "risiko", utvikling: "risiko", autentisering: "autentisering", iam: "iam",
    nettverk: "nettverk", cyberops: "cyberops", ki: "cyberops"
  };
  IN.eksamenLenke = function (key) {
    var m = /^H(\d{4})-(.+)$/.exec(String(key || "")), bank = window.IN_EXAM_BANK || {};
    if (!m) return null;
    var tekst = "H" + m[1] + " oppgave " + m[2], sett = bank["H" + m[1]], oppg = null;
    (sett && sett.oppgaver || []).forEach(function (o) { if (o.key === key) oppg = o; });
    var side = oppg && BLOKK_SIDE[oppg.block], p = side && IN.PAGES.filter(function (x) { return x.id === side; })[0];
    if (!p) return esc(tekst);
    return '<a href="' + p.href + "#fane=eksamen&amp;oppg=o-" + String(key).replace(/[^A-Za-z0-9_-]/g, "_") + '">' + esc(tekst) + "</a>";
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  /* Kildeforkortelser i opphav.kilder → lesbar tekst (d01a s. 20 → «lysark 1a (2026) s. 20»). */
  var KILDE_NAVN = { ism: "ISMS-lysarkene", ba: "lysarkene om brukerautentisering", iam: "IAM-lysarkene",
    co: "lysarkene om cyberoperasjoner", ki: "lysarkene om KI-sikkerhet" };
  /* Gir HTML (escapet tekst, eller lenke for H2025-1). */
  IN.kildeNavn = function (k) {
    k = String(k || "").trim();
    var m = /^d0*(\d+)([a-z]?)(.*)$/.exec(k);
    if (m) return esc("lysark " + m[1] + m[2] + " (2026)" + m[3]);
    m = /^t0*(\d+)(.*)$/.exec(k);
    if (m) return esc("ukesoppgave " + m[1] + m[2]);
    m = /^([a-z]+)(.*)$/.exec(k);
    if (m && KILDE_NAVN[m[1]]) return esc(KILDE_NAVN[m[1]] + m[2]);
    m = /^H(\d{4})-(.+)$/.exec(k);
    if (m) return IN.eksamenLenke(k) || esc(k);
    return esc(k);
  };
  IN.opphavTekst = function (op) {
    op = op || {};
    var s = op.type === "ukesoppgave" ? "<b>Bygger på en ukesoppgave</b>, ikke en eksamensoppgave."
      : op.type === "eksamen" ? "<b>Gjenfortalt eksamensoppgave</b>."
      : "<b>Laget for guiden</b>, ikke en eksamensoppgave" + (op.type === "oblig-type" ? " (samme oppgavetype som i en oblig)." : ".");
    var v = [].concat(op.variantAv || []).map(function (k) { return IN.eksamenLenke(k); }).filter(Boolean);
    if (v.length) s += (op.type === "eksamen" ? " Fra " + v.join(", ").replace(/, ([^,]*)$/, " og $1") + "." : " Samme format som " + v.join(", ").replace(/, ([^,]*)$/, " og $1") + ".");
    if (op.kilder && op.kilder.length) {
      // Samme lysarksett to ganger → «… s. 2–15 og 23» i stedet for å gjenta navnet.
      var ut = [], forrige = null;
      op.kilder.map(IN.kildeNavn).forEach(function (k) {
        var m = /^(.*) s\. (.+)$/.exec(k);
        if (m && forrige && forrige.navn === m[1]) { forrige.sider.push(m[2]); return; }
        forrige = m ? { navn: m[1], sider: [m[2]] } : null;
        ut.push(forrige || k);
      });
      s += " Bygger på " + ut.map(function (x) {
        return typeof x === "string" ? x : x.navn + " s. " + x.sider.join(", ").replace(/, ([^,]*)$/, " og $1");
      }).join(", ") + ".";
    }
    if (op.merknad) s += " " + esc(op.merknad) + (/[.!?]$/.test(op.merknad) ? "" : ".");
    return s;
  };
  /* Opphavslinje som element, for øvinger utenfor inspera.js (matrise, scenario, dra, quiz, sant/usant). */
  IN.opphavEl = function (op) {
    if (!op) return null;
    var p = document.createElement("p");
    p.className = "insp-opphav small";
    p.innerHTML = IN.opphavTekst(op);
    return p;
  };

  /* ---------- Gjennomgående case: kort kontekst der caset brukes ----------
     Folk hopper mellom fanene, så et eksempel som bygger på et case fra en annen fane trenger en linje om hva caset er.
     Siden definerer window.IN_CASER = { fjellbekk: { navn: "Fjellbekk barnehage", kort: "40 barn …", fane: "trygghet", fanenavn: "Trygghet" } }
     og skriver <p class="case-ctx" data-case="fjellbekk"></p> (eller med egen tekst inni) rett under overskriften.
     Linja fylles ved lasting: «Caset: Fjellbekk barnehage. 40 barn … Mer om caset i fanen Trygghet.» Lenka utelates i caset sin egen fane. */
  IN.caseLinjer = function (root) {
    var C = window.IN_CASER || {};
    Array.prototype.forEach.call((root || document).querySelectorAll(".case-ctx[data-case]"), function (p) {
      if (p._caseFylt) return;
      var c = C[p.getAttribute("data-case")];
      if (!c) return;
      p._caseFylt = true;
      var panel = p.closest && p.closest("[data-panel]"), her = panel && panel.getAttribute("data-panel") === c.fane;
      var egen = p.innerHTML.trim();
      p.innerHTML = "<b>Caset: " + esc(c.navn) + ".</b> " + (egen || esc(c.kort)) +
        (c.fane && !her ? ' <a href="#fane=' + esc(c.fane) + (c.anker ? "&amp;til=" + esc(c.anker) : "") + '">Mer om caset' + (c.fanenavn ? " i fanen " + esc(c.fanenavn) : "") + "</a>" : "");
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { IN.caseLinjer(); });
  else IN.caseLinjer();
})();
