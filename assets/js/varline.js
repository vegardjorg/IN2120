/* ============================================================
   IN2120 guide · varline.js  (kopiert via IN2090 fra IN2010-guiden 2026-11-25)
   Variabellinje: én diskret rad øverst i demofeltet som viser
   variablene i pseudokoden (i = 3 · j = 2 · key = 5 · n = 8).
   En variabel som peker på en plass, får en liten prikk i samme
   farge som søyla/cella/noden den peker på. En verdi som endret
   seg siden forrige steg, er uthevet. Knappen «Variabler» skjuler
   og viser linja i alle demoer på alle sider (localStorage).
   Klassisk script. Lastes etter core.js og før viz-*.js.

   Bruk fra en visualisering (se plan/gjennomgang/variabellinje.md):
     var vl = IN.varLine.attach(stage);   // gjenbrukes mellom stegene
     IN.varLine.clearStage(stage);         // tøm alt UNNTATT linja
     vl.update(step.vars, step.varsPrev, { frame: step.frame, dot: function (v) { … } });
     … tegn resten av steget i stage …

   vars: [{ name, value, idx?, row?, cls? }]  (eller [navn, verdi]-par)
     idx  – plassen variabelen peker på (gir prikk; utenfor gyldig område gir ingen prikk)
     cls  – tilstanden prikken skal ha (compare, swap, min, target, sorted, part, stale,
            used, default, …). Mangler den, spør linja opts.dot(v).
     value undefined/null vises som «–» (ikke satt ennå / utenfor løkka).
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var KEY = "in2120:vis-variabler";
  var uid = 0;

  function readOn() {
    try { return localStorage.getItem(KEY) !== "0"; } catch (e) { return true; }
  }
  var on = readOn();

  function fmt(v) {
    if (v === undefined || v === null || v === "") return "–";
    if (typeof v === "number") return v < 0 ? "−" + Math.abs(v) : String(v);
    return String(v);
  }
  function norm(v) {
    if (Array.isArray(v)) return { name: v[0], value: v[1] };
    return v || {};
  }

  function paintAll() {
    var all = document.querySelectorAll(".vl");
    for (var z = 0; z < all.length; z++) paint(all[z]);
  }
  function paint(root) {
    root.classList.toggle("is-off", !on);
    var b = root.querySelector(".vl-tog");
    if (b) {
      b.setAttribute("aria-expanded", on ? "true" : "false");
      b.firstChild.textContent = "Variabler ";
      b.lastChild.textContent = on ? "▾" : "▸";
      b.title = on ? "Skjul variabellinja" : "Vis variabellinja";
    }
  }
  function setOn(v) {
    on = !!v;
    try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) { /* privat modus: gjelder bare denne visningen */ }
    paintAll();
  }
  window.addEventListener("storage", function (e) {
    if (e.key === KEY) { on = readOn(); paintAll(); }
  });

  function VarLine(host, opts) {
    opts = opts || {};
    var id = "vl-" + (++uid);
    var root = document.createElement("div");
    root.className = "vl";
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", "Variabler");
    var tog = document.createElement("button");
    tog.type = "button";
    tog.className = "vl-tog";
    tog.setAttribute("aria-controls", id);
    tog.appendChild(document.createTextNode("Variabler "));
    var arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    tog.appendChild(arrow);
    tog.addEventListener("click", function () { setOn(!on); });
    // Mellomrom på knappen skal ikke starte autospill i steg-spilleren
    tog.addEventListener("keydown", function (e) { if (e.key === " " || e.key === "Enter") e.stopPropagation(); });
    var body = document.createElement("span");
    body.className = "vl-body";
    body.id = id;
    body.setAttribute("aria-live", "off");
    root.appendChild(tog);
    root.appendChild(body);
    paint(root);
    if (host) host.insertBefore(root, host.firstChild);

    function update(vars, prev, ctx) {
      ctx = ctx || {};
      var dot = ctx.dot || opts.dot;
      var before = {};
      (prev || []).forEach(function (p) { p = norm(p); before[p.name] = fmt(p.value); });
      var hadPrev = !!prev;
      while (body.firstChild) body.removeChild(body.firstChild);
      if (ctx.frame) {
        var fr = document.createElement("span");
        fr.className = "vl-frame";
        fr.textContent = ctx.frame;
        body.appendChild(fr);
      }
      (vars || []).forEach(function (v) {
        v = norm(v);
        var shown = fmt(v.value);
        var it = document.createElement("span");
        it.className = "vl-item";
        if (hadPrev && before[v.name] !== shown) it.classList.add("is-changed");
        var cls = v.cls;
        if (cls === undefined && v.idx != null && dot) cls = dot(v);
        if (cls) {
          var d = document.createElement("i");
          d.className = "vl-dot is-" + cls;
          d.setAttribute("aria-hidden", "true");
          it.appendChild(d);
        }
        var nm = document.createElement("span");
        nm.className = "vl-n";
        nm.textContent = v.name;
        it.appendChild(nm);
        it.appendChild(document.createTextNode(" = "));
        var val = document.createElement("b");
        val.className = "vl-v";
        val.textContent = shown;
        it.appendChild(val);
        body.appendChild(it);
      });
    }
    return { el: root, update: update };
  }

  /* IN.varLine(host, opts) → { el, update(vars, prev, ctx) } – ny linje øverst i host. */
  IN.varLine = function (host, opts) { return VarLine(host, opts); };

  /* Linja som hører til et demofelt. Gjenbrukes mellom stegene, så fokus på knappen
     overlever at visualiseringen tegnes på nytt. */
  IN.varLine.attach = function (stage, opts) {
    var inst = stage.__vl;
    if (!inst || inst.el.parentNode !== stage) { inst = VarLine(stage, opts); stage.__vl = inst; }
    else if (stage.firstChild !== inst.el) stage.insertBefore(inst.el, stage.firstChild);
    return inst;
  };
  /* Tøm demofeltet, men behold variabellinja (brukes i stedet for IN.clear(stage)). */
  IN.varLine.clearStage = function (stage) {
    var keep = stage.__vl && stage.__vl.el;
    for (var c = stage.lastChild; c; ) {
      var p = c.previousSibling;
      if (c !== keep) stage.removeChild(c);
      c = p;
    }
  };
  /* Fjern linja fra et demofelt (steg uten variabler). */
  IN.varLine.detach = function (stage) {
    if (stage.__vl && stage.__vl.el.parentNode === stage) stage.removeChild(stage.__vl.el);
  };
  /* Etter generering: hvert steg får varsPrev = variablene i steget før (for uthevingen). */
  IN.varLine.link = function (steps) {
    for (var z = 0; z < steps.length; z++) steps[z].varsPrev = z ? (steps[z - 1].vars || null) : null;
    return steps;
  };
  /* Forklaringer til løkkespennene (viz-bars: step.ranges), til bruk i legend-lista til steg-spilleren:
     legend: [...].concat(IN.varLine.legend(["for", "while", "call"])) */
  var LINE = "var(--color-on-surface-variant)";
  var SPENN = {
    "for": { label: "for-løkkas spenn", color: "linear-gradient(" + LINE + ", " + LINE + ") center / 100% 1px no-repeat" },
    "while": { label: "while-løkkas spenn (stiplet)", color: "repeating-linear-gradient(90deg, " + LINE + " 0 3px, transparent 3px 5px) center / 100% 1px no-repeat" },
    "call": { label: "kallets område (tykk)", color: "linear-gradient(" + LINE + ", " + LINE + ") center / 100% 2px no-repeat" }
  };
  IN.varLine.legend = function (kinds) {
    return (kinds || []).filter(function (k) { return SPENN[k]; }).map(function (k) { return { cls: "spenn-" + k, label: SPENN[k].label, color: SPENN[k].color }; });
  };
  IN.varLine.isOn = function () { return on; };
  IN.varLine.setOn = setOn;
  IN.varLine.fmt = fmt;
})();
