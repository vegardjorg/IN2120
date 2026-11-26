/* ============================================================
   IN2120 guide · stepplayer.js  (kopiert via IN2090 fra IN2010-guiden 2026-11-25)
   Generisk steg-spiller: Forrige / Spill / Neste / Nullstill,
   piltaster, autospill, presets + egen input, steg-teller,
   nivåstyrt forklaringsboks, synkronisert pseudokode. Klassisk script.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;

  /* opts:
     { generate(input)->steps, presets:{navn:input}, render(step,ctx),
       pseudo: handle, legend:[{cls,label}], speed, parseInput, inputLabel,
       inputAria (standard «Egen input»), customInput:false (skjul «Eget:»-feltet),
       countControl:{min,max,unit} (unit standard «elementer»),
       gjett: true|false (standard true når minst ett steg har spor),
       fit: true|false (standard true: skaler ned innhold som er bredere enn scenen),
       fitMin: tall (nedre grense for skaleringen, standard 0.7),
       kontroller: "auto"|true|false (standard "auto": Forrige/Neste/Spill av, «Steg x av y» og
         stegtipset skjules når gjeldende input bare gir ett steg; false skjuler dem alltid) }
     Når «Neste» er låst av et gjett, står en kort forklaring ved knappene (sp-lashint).
     Tilpasning til bredden: etter hver render måles barna i ctx.stage. Er et barn bredere enn scenen,
     får det CSS-zoom ned til fitMin. Er det fortsatt for bredt, scroller scenen og rammen viser et
     uttoningshint. ctx.width er scenens innerbredde (px), så render kan velge en smal tegning selv.
     Når bredden endres (rotasjon, fane vises), tegnes steget på nytt.
     «Gjett før neste»: et steg kan ha
       spor: { sporsmal (html | {eli5,normal,teknisk}), valg: [tekst], fasit: indeks | [indekser], forklaring? }
       spor: { sporsmal, tall: true, fasit: tall, toleranse?, forklaring? }
     Står studenten på steget FØR et steg med spor, vises spørsmålet, og «Neste», autospill og → er låst
     til studenten svarer eller trykker «Hopp over». Svar huskes per spiller (til ny input / Nullstill).
     Avkrysningen «Gjett før hvert steg» over spilleren lagres i in2120:gjett ("1"/"0"). */
  /* Stiler for breddetilpasningen. Legges inn én gang her, så alle sider får dem uten egen css
     (kan flyttes til styles.css ved neste opprydding). */
  function fitCss() {
    if (document.getElementById("sp-fit-css")) return;
    var st = document.createElement("style");
    st.id = "sp-fit-css";
    st.textContent =
      ".sp-frame{position:relative}" +
      ".sp-swipe{display:none}" +
      ".sp-frame.sp-overflow::after{content:\"\";position:absolute;top:1px;right:1px;width:2.2rem;height:calc(var(--sp-stage-h,100%) - 2px);" +
        "pointer-events:none;border-radius:0 var(--radius-lg,12px) 0 0;" +
        "background:linear-gradient(to right,transparent,var(--color-surface,#fff));transition:opacity .2s}" +
      ".sp-frame.sp-overflow.sp-at-end::after{opacity:0}" +
      ".sp-frame.sp-overflow .sp-swipe{display:block;padding:0 var(--d-sm,.5rem) .3rem;color:var(--color-on-surface-variant);text-align:right}" +
      ".sp-frame.sp-overflow.sp-at-end .sp-swipe{visibility:hidden}";
    (document.head || document.documentElement).appendChild(st);
  }

  IN.stepPlayer = function (host, opts) {
    fitCss();
    if (typeof host === "string") host = IN.qs(host);
    opts = opts || {};
    var speed = opts.speed || 900;
    var parseInput = opts.parseInput || function (s) {
      return s.split(",").map(function (x) { return parseInt(x.trim(), 10); })
              .filter(function (x) { return !isNaN(x); }).slice(0, 10);
    };

    var wrap = el("div", { class: "stepplayer" });

    // «Gjett før hvert steg» (vises bare når minst ett steg har spor)
    var GKEY = "in2120:gjett";
    var gjettOn = IN.store ? IN.store.get(GKEY, "1") !== "0" : true;
    var gTog = el("input", { type: "checkbox" });
    gTog.checked = gjettOn;
    var gRow = el("label", { class: "sp-gjett-tog small", hidden: true }, [gTog, el("span", { text: " Gjett før hvert steg" })]);
    gTog.addEventListener("change", function () { gjettOn = gTog.checked; if (IN.store) IN.store.set(GKEY, gjettOn ? "1" : "0"); if (steps.length) renderStep(); });
    wrap.appendChild(gRow);

    // Presets + egen input
    var presetRow = null;
    if (opts.presets) {
      presetRow = el("div", { class: "sp-presets" });
      presetRow.appendChild(el("span", { class: "lbl", text: "Eksempler:" }));
      Object.keys(opts.presets).forEach(function (navn) {
        presetRow.appendChild(el("button", {
          class: "btn sm", type: "button", text: navn,
          onclick: function () { setInput(opts.presets[navn]); }
        }));
      });
      wrap.appendChild(presetRow);
      // Egen linje: egen input (felt + Bruk samlet) og antall − / +
      var toolRow = el("div", { class: "sp-presets sp-tools" });
      if (opts.customInput !== false) {
        var fld = el("input", { type: "text", placeholder: opts.inputLabel || "f.eks. 5,1,4,2,8", "aria-label": opts.inputAria || "Egen input" });
        var go = el("button", { class: "btn sm", type: "button", text: "Bruk",
          onclick: function () { var v = parseInput(fld.value); if (v.length) setInput(v); } });
        fld.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); go.click(); } });
        toolRow.appendChild(el("span", { class: "sp-custom" }, [el("span", { class: "lbl", text: "Eget:" }), fld, go]));
      }
      // Flere / færre elementer (med fornuftige grenser)
      if (opts.countControl) {
        var cmin = opts.countControl.min || 3, cmax = opts.countControl.max || 9, cunit = opts.countControl.unit || "elementer";
        var cval = el("span", { class: "cval", "aria-live": "polite" });
        var bMinus = el("button", { class: "btn sm", type: "button", title: "Færre " + cunit, "aria-label": "Færre " + cunit, text: "−",
          onclick: function () { if (input && input.length > cmin) { input = input.slice(0, -1); regen(); countUpdate(); } } });
        var bPlus = el("button", { class: "btn sm", type: "button", title: "Flere " + cunit, "aria-label": "Flere " + cunit, text: "+",
          onclick: function () { if (input && input.length < cmax) { input = input.concat([1 + Math.floor(Math.random() * 9)]); regen(); countUpdate(); } } });
        countUpdate = function () {
          var n = input ? input.length : 0;
          cval.textContent = n + " " + cunit;
          bMinus.disabled = n <= cmin; bPlus.disabled = n >= cmax;
        };
        toolRow.appendChild(el("span", { class: "sp-count" }, [
          el("span", { class: "lbl", text: "Antall:" }), bMinus, cval, bPlus
        ]));
      }
      if (toolRow.childNodes.length) wrap.appendChild(toolRow);
    }

    var stage = el("div", { class: "sp-stage", tabindex: "0", role: "group", "aria-label": "Visualisering" });
    // Rammen rundt scenen har en diskret bunnlinje: hurtigtaster til venstre, «Steg x av y» til høyre.
    var counter = el("span", { class: "sp-counter", "aria-live": "polite" });
    var hint = el("span", { class: "sp-hint",
      html: (window.matchMedia && matchMedia("(hover: none)").matches)
        ? "Trykk «Neste» og «Forrige» for å gå steg for steg."
        : "Hold musa over demoen: <span class=\"kbd\">←</span> <span class=\"kbd\">→</span> for steg · <span class=\"kbd\">mellomrom</span> spill/pause" });
    var frame = el("div", { class: "sp-frame" }, [stage, el("div", { class: "sp-foot" }, [hint, counter])]);
    var swipe = el("span", { class: "sp-swipe small", "aria-hidden": "true", text: "Sveip sideveis for å se hele →" });
    frame.appendChild(swipe);
    wrap.appendChild(frame);

    // Kontroller
    // Rekkefølge (UI/UX A3, 2026-11-26): ← Forrige · Neste → (primær) · ▶ Spill av (sekundær, bare ikon på smal skjerm) · ↺ Nullstill
    var bPrev = el("button", { class: "btn sm", type: "button", html: "← Forrige", onclick: function () { step(-1); } });
    var bNext = el("button", { class: "btn primary sm sp-next", type: "button", html: "Neste →", onclick: function () { step(1); } });
    var playIc = el("span", { class: "sp-play-ic", "aria-hidden": "true", text: "▶" });
    var playTx = el("span", { class: "sp-play-tx", text: " Spill av" });
    var bPlay = el("button", { class: "btn sm sp-play", type: "button", title: "Spill av", "aria-label": "Spill av", onclick: togglePlay }, [playIc, playTx]);
    var bReset = el("button", { class: "btn sm", type: "button", text: "↺ Nullstill", onclick: function () { svar = {}; goto(0); } });
    var scope = IN.levelScope({ initial: opts.initial_level || null });
    var lockHint = el("p", { class: "sp-lashint small", hidden: true, text: "Svar på spørsmålet under, eller trykk «Hopp over», for å gå videre." });
    var controls = el("div", { class: "sp-controls" }, [bPrev, bNext, bPlay, bReset, scope.el]);
    wrap.appendChild(controls);
    wrap.appendChild(lockHint);
    /* Ett steg (eller kontroller:false): skjul stegkontrollene, så spilleren ikke ser ut som en animasjon */
    function stegKontroller() {
      var vis = opts.kontroller === false ? false : opts.kontroller === true ? true : steps.length > 1;
      [bPrev, bNext, bPlay, bReset, hint, counter].forEach(function (b) { b.hidden = !vis; });
      wrap.classList.toggle("sp-enkel", !vis);
    }
    function playLabel(on) {
      playIc.textContent = on ? "❚❚" : "▶";
      playTx.textContent = on ? " Pause" : " Spill av";
      bPlay.title = on ? "Pause" : "Spill av";
      bPlay.setAttribute("aria-label", on ? "Pause" : "Spill av");
    }

    var explain = el("div", { class: "sp-explain" });
    wrap.appendChild(explain);

    var gBox = el("div", { class: "sp-gjett", role: "group", "aria-label": "Gjett før neste steg", hidden: true });
    wrap.appendChild(gBox);

    if (opts.legend) {
      var lg = el("div", { class: "legend" });
      opts.legend.forEach(function (it) {
        lg.appendChild(el("span", { class: "item" }, [
          el("span", { class: "sw", style: "background:" + (it.color || cssVar(it.cls)) }),
          el("span", { text: it.label })
        ]));
      });
      wrap.appendChild(lg);
    }

    clear(host); host.appendChild(wrap);

    function cssVar(cls) {
      var map = { compare: "--c-compare", min: "--c-min", swap: "--c-swap", sorted: "--c-sorted", target: "--c-target", "default": "--c-default" };
      return "var(" + (map[cls] || "--c-default") + ")";
    }

    var steps = [], idx = 0, timer = null, input = null;
    var svar = {};   // steg-indeks med spor -> { ok, skip, v }
    // (countUpdate er satt over når countControl finnes – ikke overskriv den)
    var countUpdate = countUpdate || function () {};

    function setInput(inp) { input = inp.slice(); regen(); countUpdate(); }
    function regen() {
      steps = opts.generate(input) || [];
      svar = {};
      gRow.hidden = !gjettAktiv(true);
      goto(0);
    }
    /* ---------- Gjett før neste ---------- */
    function harSpor() { return steps.some(function (s) { return s && s.spor; }); }
    function gjettAktiv(ignorerBryter) {
      if (opts.gjett === false || !harSpor()) return false;
      return ignorerBryter ? true : gjettOn;
    }
    function nesteSpor() {
      var n = steps[idx + 1];
      return gjettAktiv() && n && n.spor ? n.spor : null;
    }
    function locked() { return !!nesteSpor() && !svar[idx + 1]; }
    function fasitTekst(sp) {
      if (sp.tall) return String(sp.fasit).replace(".", ",");
      return [].concat(sp.fasit).map(function (i) { return (sp.valg || [])[i]; }).join(" og ");
    }
    function vurderSvar(sp, v) {
      if (sp.tall) {
        var x = parseFloat(String(v).replace(",", ".").replace(/\s+/g, ""));
        return !isNaN(x) && Math.abs(x - +sp.fasit) <= (+sp.toleranse || 0) + 1e-9;
      }
      var f = [].concat(sp.fasit).slice().sort().join(","), g = [].concat(v).slice().sort().join(",");
      return f === g;
    }
    function svarPaa(v, skip) {
      var sp = nesteSpor(); if (!sp || svar[idx + 1]) return;
      svar[idx + 1] = skip ? { skip: true } : { ok: vurderSvar(sp, v), v: v };
      paintGjett(true);
      gBox.classList.remove("is-locked");
      bNext.disabled = idx >= steps.length - 1;
      bPlay.disabled = false;
      if (!bNext.disabled) bNext.focus();
    }
    function paintGjett(annonser) {
      clear(gBox);
      var sp = gjettAktiv() && steps[idx + 1] && steps[idx + 1].spor;
      gBox.classList.remove("is-right", "is-wrong");
      if (!sp) { gBox.hidden = true; return; }
      gBox.hidden = false;
      var a = svar[idx + 1], multi = Array.isArray(sp.fasit);
      gBox.appendChild(el("span", { class: "tagline", text: "Gjett før neste" }));
      gBox.appendChild(el("div", { class: "sp-gjett-q", html: IN.level.pick(sp.sporsmal, scope.get()) || "" }));
      var fb = el("div", { class: "sp-gjett-fb", "aria-live": "polite" });
      var ctl = el("div", { class: "sp-gjett-valg" });
      if (sp.tall) {
        var fld = el("input", { type: "text", inputmode: "decimal", class: "sp-gjett-tall", "aria-label": "Ditt svar (tall)", autocomplete: "off" });
        var ok = el("button", { class: "btn sm primary", type: "button", text: "Svar", onclick: function () { if (fld.value.trim()) svarPaa(fld.value); } });
        fld.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); ok.click(); } });
        if (a) { fld.value = a.v != null ? a.v : ""; fld.disabled = true; ok.disabled = true; }
        ctl.appendChild(fld); ctl.appendChild(ok);
      } else if (multi) {
        var boxes = [], fs = [].concat(sp.fasit);
        (sp.valg || []).forEach(function (t, i) {
          var c = el("input", { type: "checkbox", value: String(i) });
          if (a) { c.disabled = true; c.checked = a.v ? a.v.indexOf(i) >= 0 : false; }
          boxes.push(c);
          var st = a && !a.skip ? (fs.indexOf(i) >= 0 ? " is-right" : c.checked ? " is-wrong" : "") : "";
          ctl.appendChild(el("label", { class: "sp-gjett-opt" + st }, [c, el("span", { html: " " + t })]));
        });
        ctl.appendChild(el("button", { class: "btn sm primary", type: "button", text: "Svar", disabled: !!a,
          onclick: function () { var v = boxes.filter(function (b) { return b.checked; }).map(function (b) { return +b.value; }); if (v.length) svarPaa(v); } }));
      } else {
        (sp.valg || []).forEach(function (t, i) {
          var cls = "btn sm sp-gjett-btn";
          if (a && !a.skip) cls += i === +sp.fasit ? " is-right" : i === a.v ? " is-wrong" : "";
          ctl.appendChild(el("button", { class: cls, type: "button", html: t, disabled: !!a,
            "aria-pressed": a && a.v === i ? "true" : "false", onclick: function () { svarPaa(i); } }));
        });
      }
      gBox.appendChild(ctl);
      if (!a) {
        gBox.appendChild(el("div", { class: "sp-gjett-bar" }, [
          el("button", { class: "btn sm sp-gjett-hopp", type: "button", text: "Hopp over", onclick: function () { svarPaa(null, true); } }),
          el("span", { class: "small muted sp-gjett-las", text: "«Neste» åpnes når du har svart eller hoppet over." })
        ]));
      } else {
        if (a.ok) gBox.classList.add("is-right"); else if (!a.skip) gBox.classList.add("is-wrong");
        var msg = a.skip ? "Hoppet over. Riktig svar: <b>" + fasitTekst(sp) + "</b>."
          : a.ok ? "<b>Riktig.</b>" : "<b>Ikke riktig.</b> Riktig svar: <b>" + fasitTekst(sp) + "</b>.";
        var fx = sp.forklaring ? " " + IN.level.pick(sp.forklaring, scope.get()) : "";
        fb.innerHTML = msg + fx + (annonser ? " Trykk «Neste» for å se steget." : "");
      }
      gBox.appendChild(fb);
    }
    function goto(i) {
      stopPlay();
      idx = Math.max(0, Math.min(steps.length - 1, i));
      renderStep();
    }
    function step(d) { stopPlay(); if (d > 0 && locked()) return; if (idx + d >= 0 && idx + d < steps.length) { idx += d; renderStep(); } }

    function renderStep() {
      var s = steps[idx] || {};
      opts.render(s, { stage: stage, level: scope.get(), index: idx, total: steps.length, width: innerW() });
      fit();
      if (opts.pseudo && s.line != null) opts.pseudo.highlight(s.line);
      else if (opts.pseudo) opts.pseudo.clear();
      paintExplain(s);
      counter.textContent = "Steg " + (idx + 1) + " av " + steps.length;
      // Flytt fokus før knappen blir deaktivert, så tastaturbrukere ikke havner øverst på siden
      var atStart = idx === 0, atEnd = idx >= steps.length - 1;
      if (atEnd && document.activeElement === bNext) bPrev.focus();
      if (atStart && document.activeElement === bPrev && !atEnd) bNext.focus();
      bPrev.disabled = atStart;
      paintGjett(false);
      var lock = locked();
      if (lock && (document.activeElement === bNext || document.activeElement === bPlay)) {
        var first = gBox.querySelector("button, input");
        if (first) first.focus();
      }
      bNext.disabled = atEnd || lock;
      bPlay.disabled = lock;
      lockHint.hidden = !lock;
      stegKontroller();
      gBox.classList.toggle("is-locked", lock);
    }
    /* ---------- Tilpasning til bredden ---------- */
    var FIT = opts.fit !== false, FITMIN = +opts.fitMin || 0.7;
    var canZoom = typeof document !== "undefined" && "zoom" in document.documentElement.style;
    function innerW() {
      var w = stage.clientWidth;
      if (!w) return 0;
      var cs = getComputedStyle(stage);
      return w - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    }
    function fit() {
      frame.classList.remove("sp-overflow", "sp-at-end");
      var avail = innerW();
      if (!avail) return;
      var kids = Array.prototype.slice.call(stage.children);
      if (FIT && canZoom) {
        kids.forEach(function (k) {
          k.style.zoom = "";
          var need = Math.max(k.getBoundingClientRect().width, k.scrollWidth || 0);
          if (need > avail + 1) {
            var z = Math.max(FITMIN, Math.floor(avail / need * 1000) / 1000);
            k.style.zoom = String(z);
            k.classList.add("sp-zoomed");
          } else k.classList.remove("sp-zoomed");
        });
      }
      if (stage.scrollWidth > stage.clientWidth + 1) { frame.classList.add("sp-overflow"); frame.style.setProperty("--sp-stage-h", stage.offsetHeight + "px"); edge(); }
    }
    function edge() {
      frame.classList.toggle("sp-at-end", stage.scrollLeft + stage.clientWidth >= stage.scrollWidth - 2);
    }
    stage.addEventListener("scroll", edge, { passive: true });
    var lastW = -1, rzT = null;
    function onResize() {
      var w = stage.clientWidth;
      if (w === lastW) return;
      lastW = w;
      clearTimeout(rzT);
      rzT = setTimeout(function () { if (steps.length && stage.clientWidth) renderStep(); }, 120);
    }
    if (typeof ResizeObserver !== "undefined") new ResizeObserver(onResize).observe(stage);
    else window.addEventListener("resize", onResize);

    function paintExplain(s) {
      clear(explain);
      var txt = IN.level.pick(s.text, scope.get());
      if (s.tag) explain.appendChild(el("span", { class: "tagline", text: s.tag }));
      explain.appendChild(el("span", { html: txt || "" }));
      if (IN.symbolTips) IN.symbolTips(explain);
    }

    function togglePlay() {
      if (timer) stopPlay();
      else {
        if (idx >= steps.length - 1) goto(0);
        if (locked()) return;
        timer = setInterval(function () {
          if (idx >= steps.length - 1 || locked()) { stopPlay(); return; }
          idx++; renderStep();
          if (locked()) stopPlay();
        }, speed);
        playLabel(true);
      }
    }
    function stopPlay() {
      if (timer) { clearInterval(timer); timer = null; }
      playLabel(false);
    }

    stage.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === " ") { e.preventDefault(); togglePlay(); }
    });

    // Snarveier (piltaster / mellomrom): virker når pekeren er over demoen,
    // slik at vi ikke stjeler sidens egen scrolling når demoen bare ligger synlig lenger nede.
    // (Tastaturbrukere: fokusér scenen – egen handler over gjelder da.)
    var hovering = false;
    wrap.addEventListener("mouseenter", function () { hovering = true; });
    wrap.addEventListener("mouseleave", function () { hovering = false; });
    document.addEventListener("keydown", function (e) {
      if (e.defaultPrevented) return;
      if (!hovering) return;                            // bare når musa er over demoen
      if (wrap.offsetParent === null) return;           // demoen ligger i en skjult fane
      if (!steps.length) return;
      var ae = document.activeElement, tag = ae && ae.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (ae && ae.isContentEditable)) return;
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      else if (e.key === " " && tag !== "BUTTON" && tag !== "A") { e.preventDefault(); togglePlay(); }
    });

    // Nivåbytte (lokalt eller fra toppen): tegn forklaring + visualisering på nytt
    scope.onChange(function () { if (steps.length) renderStep(); });

    // Når fanen vises første gang (fra core.js tabs-event): sørg for layout
    var shown = false;
    // Hendelsen sendes på fane-panelet (som ligger utenfor host), så vi lytter der.
    var panelEl = (host.closest && host.closest("[data-panel]")) || host;
    panelEl.addEventListener("in:shown", function () { if (!shown && steps.length) { shown = true; renderStep(); } });

    // Init
    if (opts.initial) setInput(opts.initial);
    else if (opts.presets) setInput(opts.presets[Object.keys(opts.presets)[0]]);

    return {
      goto: goto, next: function () { step(1); }, prev: function () { step(-1); },
      setInput: setInput, get steps() { return steps; }, get index() { return idx; },
      get locked() { return locked(); },
      answer: function (v) { svarPaa(v); }, skip: function () { svarPaa(null, true); }
    };
  };
})();
