/* ============================================================
   IN2120 guide · viz-verktoy.js
   Visninger for verktoy.html, bygget på registeret IN.VERKTOY (data-verktoy.js).

   IN.verktoy.utdata(host, id, i?)   annotert terminal: feltene er knapper i teksten. Pek/fokus viser
                                     forklaringen i én infolinje, trykk fester den. Piltaster, Home/End, Esc.
                                     «Alle feltene (N)» lister alt med kilde. Gjenbrukbar på blokksidene.
   IN.verktoy.seksjon(host, id)      hele verktøykortet (id vt-<id>): merker, eksamenslinje, tre nivåer,
                                     kjennetegn, utdata, eksamensfigurer (IN.fig.vis), forsvar, feller
   IN.verktoy.kort(host, id)         kompakt kort med lenke til verktøysiden (for blokksider og crash)
   IN.verktoy.oversikt(host)         tabell: verktøy, fase, MITRE, eksamen
   IN.verktoy.faser(host)            bucketTask «Hvor i angrepet eller forsvaret?»
   IN.verktoy.gjett(host)            IN.quiz «Hvilket verktøy er dette?» (lagres)
   IN.verktoy.eksamen(host)          alle eksamenskortene som bruker et verktøy, med filter per verktøy
   IN.verktoy.badges(host)           merkene øverst, fra eksamensbanken
   Klassisk script. Lastes etter core.js, dra.js, bank.js, fig-felles.js og data-verktoy.js.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el;

  function V() { return IN.VERKTOY; }
  function host$(h) { return typeof h === "string" ? IN.qs(h) : h; }
  function domId(key) { return "o-" + String(key).replace(/[^A-Za-z0-9_-]/g, "_"); }
  function yearKey(y) { var m = /^([HV])(\d{4})$/.exec(y || ""); return m ? +m[2] * 2 + (m[1] === "H" ? 1 : 0) : 0; }
  function plain(html) { var d = document.createElement("div"); d.innerHTML = html || ""; return (d.textContent || "").trim(); }

  /* Oppslag i eksamensbanken: key → { ex, y, o } */
  var bankIdx = null;
  function bank(key) {
    if (!bankIdx) {
      bankIdx = {};
      if (IN.examBank && IN.examBank.items) IN.examBank.items().forEach(function (x) { bankIdx[x.o.key] = x; });
    }
    return bankIdx[key] || null;
  }
  function pts(x) { return x && x.o.points != null ? String(x.o.points).replace(".", ",") + "p" : ""; }
  function oppgLenke(key, side) {
    var x = bank(key), nr = String(key).replace(/^[HV]\d{4}-/, ""), y = String(key).split("-")[0];
    var a = el("a", { class: "vt-oppg", href: (side || "") + "#fane=eksamen&oppg=" + domId(key),
      title: x && x.o.title ? plain(x.o.title) : null });
    a.appendChild(el("b", { text: y + " " + nr }));
    if (x && x.o.title) a.appendChild(document.createTextNode(" · " + plain(x.o.title)));
    if (x && x.o.points != null) a.appendChild(el("span", { class: "pts", text: " · " + pts(x) }));
    return a;
  }

  /* ---------- Annotert utdata ---------- */
  var RE = /\[\[(\d+)\|(.*?)\]\](?!\])/g;
  var nUt = 0;
  IN.verktoy = {};

  IN.verktoy.utdata = function (host, id, i) {
    host = host$(host);
    var t = V().get(id), u = t && t.utdata && t.utdata[i || 0];
    if (!host || !u) return null;
    var nr = ++nUt;
    var wrap = el("figure", { class: "vt-ut" });
    if (u.tittel) wrap.appendChild(el("figcaption", { class: "vt-ut-t", text: u.tittel }));
    var box = el("div", { class: "fig-term vt-term" });
    var bar = el("div", { class: "fig-term-bar", "aria-hidden": "true" }, [el("span", { class: "fig-term-prikker" })]);
    if (u.term) bar.appendChild(el("span", { class: "fig-term-tittel", text: u.term }));
    box.appendChild(bar);
    var pre = el("pre", { class: "fig-term-pre vt-pre", role: "group", "aria-label": (u.tittel || t.navn) + ". Feltene er knapper: velg ett for å se hva det betyr." });
    box.appendChild(pre);
    wrap.appendChild(box);

    var info = el("div", { class: "vt-info", "aria-live": "polite", id: "vt-info-" + nr });
    var tom = "<span class=\"muted\">Pek på eller trykk på et uthevet felt for å se hva det betyr.</span>";
    info.innerHTML = tom;
    wrap.appendChild(info);

    var knapper = [], festet = null;
    u.linjer.forEach(function (ln, li) {
      if (li) pre.appendChild(document.createTextNode("\n"));
      var last = 0, m;
      RE.lastIndex = 0;
      while ((m = RE.exec(ln))) {
        if (m.index > last) pre.appendChild(document.createTextNode(ln.slice(last, m.index)));
        var fi = +m[1], f = u.felt[fi];
        var b = el("button", { type: "button", class: "vt-f", "data-f": String(fi), tabindex: "-1",
          "aria-pressed": "false", "aria-describedby": info.id, text: m[2],
          title: f ? f.n : null });
        knapper.push(b);
        pre.appendChild(b);
        last = m.index + m[0].length;
      }
      if (last < ln.length) pre.appendChild(document.createTextNode(ln.slice(last)));
    });
    if (knapper.length) knapper[0].tabIndex = 0;

    function vis(fi) {
      var f = u.felt[fi];
      if (!f) { info.innerHTML = tom; return; }
      var k = t.kilder[f.k];
      info.innerHTML = "<b>" + f.n + "</b>: " + f.f + (k ? ' <a class="vt-kilde small" href="' + k.url + '" target="_blank" rel="noopener">Kilde: ' + k.navn + "</a>" : "");
    }
    function marker(fi, on) {
      knapper.forEach(function (b) { b.classList.toggle("vt-on", on && b.getAttribute("data-f") === String(fi)); });
    }
    function settFest(fi) {
      festet = fi;
      knapper.forEach(function (b) { b.setAttribute("aria-pressed", fi != null && b.getAttribute("data-f") === String(fi) ? "true" : "false"); });
      if (fi == null) { marker(null, false); info.innerHTML = tom; } else { marker(fi, true); vis(fi); }
    }
    function forhånd(fi) { marker(fi, true); vis(fi); }
    function tilbake() { if (festet != null) { marker(festet, true); vis(festet); } else { marker(null, false); info.innerHTML = tom; } }

    knapper.forEach(function (b, bi) {
      var fi = +b.getAttribute("data-f");
      b.addEventListener("mouseenter", function () { forhånd(fi); });
      b.addEventListener("mouseleave", tilbake);
      b.addEventListener("focus", function () {
        knapper.forEach(function (x) { x.tabIndex = -1; }); b.tabIndex = 0;
        if (festet == null) forhånd(fi);
      });
      b.addEventListener("blur", function () { if (!pre.contains(document.activeElement)) tilbake(); });
      b.addEventListener("click", function () { settFest(festet === fi ? null : fi); });
      b.addEventListener("keydown", function (ev) {
        var n = null;
        if (ev.key === "ArrowRight" || ev.key === "ArrowDown") n = (bi + 1) % knapper.length;
        else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") n = (bi - 1 + knapper.length) % knapper.length;
        else if (ev.key === "Home") n = 0;
        else if (ev.key === "End") n = knapper.length - 1;
        else if (ev.key === "Escape") { ev.preventDefault(); settFest(null); return; }
        if (n == null) return;
        ev.preventDefault();
        knapper[n].focus();
        if (festet != null) settFest(+knapper[n].getAttribute("data-f"));
      });
    });

    var cap = el("p", { class: "vt-cap small muted", html: (u.kommentar ? u.kommentar + " " : "") +
      "Utdataene er laget for guiden (dokumentasjonsadresser og oppdiktede navn). Feltforklaringene bygger på verktøyets egen dokumentasjon." });
    wrap.appendChild(cap);

    var det = el("details", { class: "vt-alle" });
    det.appendChild(el("summary", { text: "Alle feltene (" + u.felt.length + ")" }));
    var dl = el("dl", { class: "vt-dl" });
    u.felt.forEach(function (f) {
      var k = t.kilder[f.k];
      dl.appendChild(el("dt", { text: f.n }));
      dl.appendChild(el("dd", { html: f.f + (k ? ' <a class="vt-kilde small" href="' + k.url + '" target="_blank" rel="noopener">Kilde: ' + k.navn + "</a>" : "") }));
    });
    det.appendChild(dl);
    wrap.appendChild(det);
    host.appendChild(wrap);
    return wrap;
  };

  /* ---------- Merker (fase, MITRE, kurs) ---------- */
  function merker(t) {
    var f = V().fase(t.fase), d = el("div", { class: "vt-tags" });
    var rolle = { angrep: "Angrepsverktøy", forsvar: "Forsvarsverktøy", begge: "Brukes av begge sider" }[t.rolle];
    d.appendChild(el("span", { class: "vt-tag vt-rolle vt-" + t.rolle, text: rolle }));
    if (f) d.appendChild(el("span", { class: "vt-tag vt-fase", title: f.kort, text: f.navn }));
    t.mitre.forEach(function (m) {
      d.appendChild(el("a", { class: "vt-tag vt-mitre", href: "https://attack.mitre.org/techniques/" + m.id.replace(".", "/") + "/",
        target: "_blank", rel: "noopener", title: "MITRE ATT&CK, taktikk: " + m.taktikk, text: m.id + " " + m.navn }));
    });
    if (t.kurs) d.appendChild(el("span", { class: "vt-tag vt-kurs", text: "Kurs: " + t.kurs }));
    return d;
  }

  function eksamenCallout(t, side) {
    var c = el("div", { class: "callout snarvei vt-eks" });
    c.appendChild(el("span", { class: "lbl", text: "Hva eksamen spør om" }));
    c.appendChild(el("p", { html: t.eksamen.spor }));
    if (t.eksamen.oppgaver.length) {
      var ul = el("ul", { class: "vt-oppgl" });
      t.eksamen.oppgaver.forEach(function (o) {
        var li = el("li");
        li.appendChild(oppgLenke(o.key, side));
        li.appendChild(el("span", { class: "small muted", text: " · " + o.hva }));
        ul.appendChild(li);
      });
      c.appendChild(ul);
    }
    return c;
  }

  /* ---------- Hele verktøykortet ---------- */
  IN.verktoy.seksjon = function (host, id) {
    host = host$(host);
    var t = V().get(id);
    if (!host || !t) return null;
    var sec = el("article", { class: "vt-sek", id: "vt-" + t.id });
    sec.appendChild(el("h3", { text: t.navn }));
    sec.appendChild(merker(t));
    sec.appendChild(el("p", { class: "vt-kort", html: t.kort }));
    sec.appendChild(eksamenCallout(t));
    var ex = el("div", { class: "vt-hva" });
    sec.appendChild(ex);
    IN.explain(ex, t.hva, { label: "Forklaring:" });

    var kj = el("div", { class: "vt-kjenn" });
    kj.appendChild(el("h4", { text: "Slik kjenner du det igjen" }));
    var ul = el("ul");
    t.kjenn.forEach(function (k) { ul.appendChild(el("li", { html: k })); });
    kj.appendChild(ul);
    sec.appendChild(kj);

    (t.utdata || []).forEach(function (u, i) {
      if (i === 0) sec.appendChild(el("h4", { text: "Utdataene, felt for felt" }));
      var h = el("div"); sec.appendChild(h); IN.verktoy.utdata(h, t.id, i);
    });

    t.eksamen.figurer.forEach(function (key) {
      if (!IN.fig || !IN.fig.vis || !IN.FIGURER || !IN.FIGURER[key]) return;
      var h = el("div", { class: "vt-fig" });
      sec.appendChild(h);
      IN.fig.vis(h, key, { husk: t.id === "sudo" });
    });

    if (t.forsvar && t.forsvar.length) {
      var fd = el("div", { class: "vt-forsvar" });
      fd.appendChild(el("h4", { text: "Forsvaret" }));
      var fu = el("ul");
      t.forsvar.forEach(function (k) { fu.appendChild(el("li", { html: k })); });
      fd.appendChild(fu);
      sec.appendChild(fd);
    }

    if (t.feller.length) {
      var fc = el("div", { class: "callout felle" });
      fc.appendChild(el("span", { class: "lbl", text: "Feller" }));
      t.feller.forEach(function (f) {
        var d = el("details", { class: "grense" });
        d.appendChild(el("summary", { html: f.q }));
        d.appendChild(el("p", { html: f.a }));
        fc.appendChild(d);
      });
      sec.appendChild(fc);
    }

    var kl = el("details", { class: "vt-kilder small" });
    kl.appendChild(el("summary", { text: "Kilder (" + t.kilder.length + ")" }));
    var kul = el("ul");
    t.kilder.forEach(function (k) { kul.appendChild(el("li", {}, [el("a", { href: k.url, target: "_blank", rel: "noopener", text: k.navn })])); });
    kl.appendChild(kul);
    sec.appendChild(kl);
    host.appendChild(sec);
    return sec;
  };

  /* Kompakt kort for andre sider: navn, fase, eksamenslinje og lenke hit. */
  IN.verktoy.kort = function (host, id) {
    host = host$(host);
    var t = V().get(id);
    if (!host || !t) return null;
    var here = location.pathname.split("/").pop() || "index.html";
    var c = el("div", { class: "vt-mini" });
    c.appendChild(el("p", {}, [el("b", { text: t.navn }), document.createTextNode(" · " + t.kort)]));
    c.appendChild(merker(t));
    c.appendChild(el("p", { class: "small", html: "<b>Eksamen:</b> " + t.eksamen.spor }));
    c.appendChild(el("a", { class: "small", href: here === "verktoy.html" ? "#fane=" + t.kat + "&oppg=vt-" + t.id : V().lenke(t.id), text: "Mer om " + t.navn + " på verktøysiden →" }));
    host.appendChild(c);
    return c;
  };

  /* ---------- Oversiktstabell ---------- */
  IN.verktoy.oversikt = function (host) {
    host = host$(host);
    if (!host) return;
    var wrap = el("div", { class: "table-wrap" });
    var tb = el("table", { class: "vt-tab" });
    tb.appendChild(el("thead", {}, [el("tr", {}, ["Verktøy", "Fase", "MITRE ATT&CK", "På eksamen"].map(function (s) { return el("th", { scope: "col", text: s }); }))]));
    var body = el("tbody");
    V().liste.forEach(function (t) {
      var f = V().fase(t.fase);
      var aar = [];
      t.eksamen.oppgaver.forEach(function (o) { var y = o.key.split("-")[0]; if (aar.indexOf(y) < 0) aar.push(y); });
      aar.sort(function (a, b) { return yearKey(b) - yearKey(a); });
      body.appendChild(el("tr", {}, [
        el("th", { scope: "row" }, [el("a", { href: "#fane=" + t.kat + "&oppg=vt-" + t.id, text: t.navn })]),
        el("td", { text: f ? f.navn : "" }),
        el("td", { text: t.mitre.length ? t.mitre.map(function (m) { return m.id; }).join(", ") : "–" }),
        el("td", { text: aar.length ? aar.join(", ") : "–" })
      ]));
    });
    tb.appendChild(body);
    wrap.appendChild(tb);
    host.appendChild(wrap);
    host.appendChild(el("p", { class: "small muted", text: "Fasene er pentestfasene fra d05 s. 16 (de tre som verktøyene hører til), pluss forsvarssiden. iptables og Snort er forsvarsverktøy og har ingen ATT&CK-teknikk." }));
  };

  /* ---------- Bøtteøving: fase ---------- */
  IN.verktoy.faser = function (host) {
    if (!IN.bucketTask) return null;
    var godta = { wireshark: ["oppdage"], metasploit: ["utvide"], burp: ["rekognosering"] };
    var answer = {}, items = [];
    V().liste.forEach(function (t) {
      answer[t.id] = t.fase;
      var f = V().fase(t.fase);
      items.push({ id: t.id, html: "<b>" + t.navn + "</b>", forklaring: t.navn + " hører til <b>" + f.navn + "</b>: " + t.kort });
    });
    return IN.bucketTask(host, {
      id: "verktoy-faser",
      prompt: "Legg hvert verktøy der det hører hjemme: i en fase av pentesten, eller på forsvarssiden.",
      items: items,
      zones: V().FASER.map(function (f) { return { id: f.id, label: f.navn, hint: f.kort }; }),
      answer: answer,
      godta: godta,
      kilde: { ref: "Pentestfasene: d05 s. 16. Brannmur og IDS: d09.", egneOrd: true },
      opphav: { type: "egen", kilder: ["d05 s. 16", "d09 s. 36–71"] }
    });
  };

  /* ---------- «Hvilket verktøy er dette?» ---------- */
  function figUtenSvar(node, key) {
    var x = bank(key), draw = IN.FIGURER && IN.FIGURER[key];
    if (!x || !draw) return;
    var fig = el("figure", { class: "exam-fig insp-fig har-tegning vt-gfig" });
    var hh = el("div", { class: "exam-fig-h" });
    fig.appendChild(hh);
    node.appendChild(fig);
    try { draw(hh, x.o); } catch (e) { if (window.console) console.error(e); }
    Array.prototype.slice.call(hh.querySelectorAll(".fig-felt")).forEach(function (n) { n.parentNode.removeChild(n); });
    fig.appendChild(el("figcaption", { class: "small muted", text: "Skjermbildet fra eksamen " + key.split("-")[0] + ", tegnet på nytt." }));
  }
  IN.verktoy.gjett = function (host) {
    host = host$(host);
    if (!host) return null;
    var qs = V().gjett.map(function (g) {
      var t = V().get(g.svar);
      return {
        q: g.q,
        options: g.valg,
        answer: g.answer,
        render: g.vis ? function (node) { IN.fig.terminal(node, g.vis, { tittel: g.tittel || "" }); }
          : g.fig ? function (node) { figUtenSvar(node, g.fig); } : null,
        explain: g.hvorfor + (t ? ' <a href="#fane=' + t.kat + "&oppg=vt-" + t.id + '">Les om ' + t.navn + " →</a>" : "")
      };
    });
    return IN.quiz(host, qs, { id: "verktoy-hvilket",
      opphav: { type: "egen", variantAv: ["H2025-14", "H2024-24"], kilder: ["d05 s. 25–47", "d09 s. 36–71"] } });
  };

  /* ---------- Eksamenskortene ---------- */
  IN.verktoy.eksamen = function (host) {
    host = host$(host);
    if (!host || !IN.examBank) return;
    var keys = V().alleOppgaver();
    var all = IN.examBank.items().filter(function (x) { return keys.indexOf(x.o.key) >= 0; });
    if (!all.length) { host.appendChild(el("p", { class: "muted", text: "Fant ingen av oppgavene i eksamensbanken." })); return; }
    var sum = el("p", { class: "bank-sum small" });
    host.appendChild(sum);
    var bar = el("div", { class: "bank-years vt-filter", role: "group", "aria-label": "Vis oppgaver for verktøy" });
    host.appendChild(bar);
    var list = el("div", { class: "bank-list" });
    host.appendChild(list);
    var wraps = [];
    var years = [];
    all.forEach(function (x) { if (years.indexOf(x.y) < 0) years.push(x.y); });
    years.forEach(function (y) {
      var sec = el("section", { class: "bank-year" });
      var ex = null;
      sec.appendChild(el("h3", { class: "bank-yh", text: y }));
      var cards = el("div", { class: "bank-cards" });
      sec.appendChild(cards);
      all.filter(function (x) { return x.y === y; }).forEach(function (x) {
        ex = x.ex;
        var w = el("div", { class: "vt-kortw" });
        w._verk = V().forOppgave(x.o.key).map(function (t) { return t.id; });
        w._pts = +x.o.points || 0;
        w._sec = sec;
        cards.appendChild(w);
        IN.examBank.card(w, x);
        wraps.push(w);
      });
      list.appendChild(sec);
    });
    function num(n) { return String(Math.round(n * 100) / 100).replace(".", ","); }
    function paint(sel) {
      IN.qsa("button", bar).forEach(function (b) { b.setAttribute("aria-pressed", b._v === sel ? "true" : "false"); });
      var n = 0, p = 0;
      wraps.forEach(function (w) {
        var on = sel === "*" || w._verk.indexOf(sel) >= 0;
        w.hidden = !on;
        if (on) { n++; p += w._pts; }
      });
      IN.qsa(".bank-year", list).forEach(function (s) {
        s.hidden = !wraps.some(function (w) { return w._sec === s && !w.hidden; });
      });
      var t = sel === "*" ? null : V().get(sel);
      sum.innerHTML = "<b>" + n + " oppgaver</b>" + (t ? " der " + t.navn + " inngår" : " der et av verktøyene inngår") + ", til sammen " + num(p) + " poeng.";
    }
    [["*", "Alle"]].concat(V().liste.filter(function (t) { return t.eksamen.oppgaver.length; }).map(function (t) { return [t.id, t.navn]; })).forEach(function (pp) {
      var b = el("button", { class: "btn sm", type: "button", text: pp[1], onclick: function () { paint(pp[0]); } });
      b._v = pp[0];
      bar.appendChild(b);
    });
    paint("*");
    // En dyplenke til et skjult kort: vis alle igjen
    window.addEventListener("hashchange", function () {
      var m = location.hash.match(/oppg=([\w-]+)/), c = m && document.getElementById(m[1]);
      if (c && host.contains(c) && c.closest(".vt-kortw[hidden]")) paint("*");
    });
  };

  /* ---------- Merkene øverst ---------- */
  IN.verktoy.badges = function (host, keys) {
    host = host$(host);
    if (!host) return;
    keys.forEach(function (key) {
      var x = bank(key);
      if (!x) return;
      var a = el("a", { class: "badge", href: "#fane=eksamen&oppg=" + domId(key) });
      a.appendChild(el("b", { text: x.y }));
      a.appendChild(document.createTextNode(" · " + plain(x.o.title) + " · "));
      a.appendChild(el("span", { class: "pts", text: pts(x) }));
      host.appendChild(a);
    });
  };
})();
