/* ============================================================
   IN2120 guide · viz-angrep.js
   Visualiseringer for blokk 4 (angrep og pentest). Klassisk script, lastes etter core.js.
   Alt er på konseptnivå og sett fra forsvareren: ingen kommandoer, ingen payloads.

   IN.angrep.faser(host)    pentestens sju stadier som klikkbar tidslinje (hva skjer, hva
                            forsvareren kan gjøre, eksamensoppgavene). Oppslag etter sorteringen.
   IN.angrep.sql(host)      «kode mot data»: samme inndata i en sammenlimt og en parametrisert
                            spørring. Bare egne ord og eksamensmønsteret fra H2024 23.
   IN.angrep.logg(host)     fire små logger med egne data; tellerne skiller mønstrene.

   Øvinger bygd på dra.js og ovelse.js (lastes før denne fila):
   IN.angrep.faserSort(host)      IN.sortTask: stadiene i rekkefølge (d05 s. 16)
   IN.angrep.bokser(host)         IN.matrise: boksfarge × hva testeren vet og hva det gir
   IN.angrep.phishing(host)       IN.bucketTask: meldinger → kursets fire phishingtyper
   IN.angrep.skadevare(host)      IN.matrise: skadevaretype × kjennetegn i definisjonen
   IN.angrep.rootkit(host)        IN.scenario: H2025 19 fra forsvarerens side
   IN.angrep.sudo(host)           IN.finnFeilen: sudoers-utdrag med to for vide regler
   Datene ligger i IN.angrep.DATA (for node-sjekk). Ingen egen lagring; widgetene lagrer selv.
   Stiler i assets/css/blokk-angrep.css.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;
  var A = (IN.angrep = IN.angrep || {});

  function host$(h) { return typeof h === "string" ? IN.qs(h) : h; }
  function reduced() {
    try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  }
  function lenke(key, tekst) {
    var id = "o-" + String(key).replace(/[^A-Za-z0-9_-]/g, "_");
    return el("a", { href: "#fane=eksamen&oppg=" + id, text: tekst || key.replace("-", " ") });
  }

  /* ---------- Pentestfasene ---------- */
  var FASER = [
    { navn: "Planlegging", kort: "Avtale",
      skjer: "Testeren og virksomheten avtaler mål (hvilke kjerneverdier testen skal prøve å ramme), omfang (hva som er med og ikke), tidsrom, kontaktperson ved driftsstans og boksfarge. Tillatelsen gis skriftlig, på forhånd, av noen med myndighet over systemet.",
      forsvar: "Velg kjerneverdiene som betyr mest (økonomi, sensitive data, tilgjengelighet). Sørg for at den som signerer faktisk har myndighet, og i forvaltningen hjemmel.",
      eks: [["H2022-3.3", "§ 204"], ["H2025-13", "§ 204"], ["H2022-4.3", "hvitboks"], ["H2023-4", "svartboks"], ["H2024-4", "gråboks"], ["H2025-4", "svartboks"]] },
    { navn: "Rekognosering", kort: "Finn ut mest mulig",
      skjer: "Først passiv innsamling fra åpne kilder (OSINT): nettsider, stillingsannonser, sosiale medier, offentlige registre over domener og IP-adresser. Deretter kartlegging av hvilke maskiner og tjenester som svarer.",
      forsvar: "Gjør OSINT på deg selv og begrens hva som ligger ute. Kartlegging gir trafikk og kan sees i logger og IDS; OSINT kan ikke sees.",
      eks: [["H2025-17", "OSINT-forkortelsen"], ["H2025-18", "hva og hvorfor OSINT"], ["H2025-14", "kartleggingsverktøy"], ["H2023-28", "kartlegging eller injeksjon"]] },
    { navn: "Innledende tilgang", kort: "Første fot innenfor",
      skjer: "Den første kontoen eller maskinen: via phishing, svake eller standard passord, eller en sårbar nettside. Dette er ofte det vanskeligste og mest tidkrevende stadiet, så oppdragsgiver gir gjerne en vanlig brukerkonto hvis testeren ikke kommer inn raskt.",
      forsvar: "Opplæring og en kultur der folk sier fra, flerfaktor og passnøkler, ingen standardpassord, parametriserte spørringer og servervalidering. Overvåk innloggingsforsøk.",
      eks: [["H2024-23", "SQL-injeksjon"], ["H2023-25", "injeksjoner"], ["H2023-26", "logganalyse"]] },
    { navn: "Utvide tilgangen", kort: "Mer tilgang",
      skjer: "Fra vanlig bruker til administrator eller root (privilegieeskalering), og fra én maskin til flere. Jo mer tilgang man har, jo lettere er det å få mer.",
      forsvar: "Minste privilegium. Behandle hver sudo-regel som root-tilgang. Sterke, unike passord, så stjålne hasher er lite verdt.",
      eks: [["H2022-4.4", "sudo med tolk"], ["H2023-29", "sudo med fil­leser"], ["H2023-22", "skadevarens rettigheter"]] },
    { navn: "Sikre fotfeste", kort: "Beholde tilgangen",
      skjer: "Vise at tilgangen kan beholdes over tid. En ondsinnet aktør bruker gjerne bakdører og rootkit for å være stille og vedvarende; pentesteren dokumenterer at det er mulig.",
      forsvar: "Deteksjon og respons: logger samlet utenfor maskinene, varsling på nye kontoer og tjenester. En maskin som har hatt rootkit, reinstalleres.",
      eks: [["H2025-19", "rootkit-scenario"]] },
    { navn: "Gevinst", kort: "Vis at det går",
      skjer: "Vise at kjerneverdiene kan rammes uten å gjøre skade: vise eller endre en avtalt fil, eller hente ut usensitive data, gjerne via en sidekanal som DNS-oppslag.",
      forsvar: "Følg med på uvanlig utgående trafikk, også DNS. Det testeren klarer her, er det en ekte angriper også kan.",
      eks: [] },
    { navn: "Rapport", kort: "Produktet",
      skjer: "Funnene beskrives med alvorlighet, hvordan de ble funnet og hva som bør gjøres. Rapporten er det kunden betaler for.",
      forsvar: "Prioriter og rett funnene, og test på nytt. Rapporten er et eget, siste stadium.",
      eks: [] }
  ];

  A.faser = function (host) {
    host = host$(host); if (!host) return null;
    clear(host);
    var wrap = el("div", { class: "an-tl" });
    var ol = el("ol", { class: "an-tl-row", role: "tablist", "aria-label": "Stadiene i en pentest" });
    var det = el("div", { class: "an-tl-det", role: "tabpanel", "aria-live": "polite" });
    var btns = FASER.map(function (f, i) {
      var b = el("button", { type: "button", class: "an-tl-b", role: "tab", "aria-selected": "false", tabindex: "-1" },
        [el("span", { class: "an-tl-n", text: String(i + 1) }), el("span", { class: "an-tl-t", text: f.navn })]);
      b.addEventListener("click", function () { set(i); });
      b.addEventListener("keydown", function (e) {
        var k = e.key, j = null;
        if (k === "ArrowRight") j = Math.min(FASER.length - 1, cur + 1);
        else if (k === "ArrowLeft") j = Math.max(0, cur - 1);
        else if (k === "Home") j = 0; else if (k === "End") j = FASER.length - 1;
        if (j != null) { e.preventDefault(); set(j); btns[j].focus(); }
      });
      ol.appendChild(el("li", null, [b]));
      return b;
    });
    var cur = 0;
    function set(i) {
      cur = i;
      btns.forEach(function (b, k) {
        b.classList.toggle("cur", k === i); b.classList.toggle("done", k < i);
        b.setAttribute("aria-selected", k === i ? "true" : "false"); b.tabIndex = k === i ? 0 : -1;
      });
      var f = FASER[i];
      clear(det);
      det.appendChild(el("p", { class: "an-tl-h" }, [el("b", { text: (i + 1) + " · " + f.navn }), el("span", { class: "muted", text: " · " + f.kort })]));
      det.appendChild(el("p", null, [el("span", { class: "an-k", text: "Hva skjer: " }), f.skjer]));
      det.appendChild(el("p", null, [el("span", { class: "an-k", text: "Forsvareren: " }), f.forsvar]));
      var p = el("p", { class: "small" }, [el("span", { class: "an-k", text: "Eksamen: " })]);
      if (!f.eks.length) p.appendChild(document.createTextNode("ingen egen oppgave H2021–H2025."));
      f.eks.forEach(function (e, k) {
        if (k) p.appendChild(document.createTextNode(" · "));
        p.appendChild(lenke(e[0]));
        p.appendChild(document.createTextNode(" (" + e[1] + ")"));
      });
      det.appendChild(p);
      var nav = el("div", { class: "btn-row" }, [
        el("button", { type: "button", class: "btn sm", text: "← Forrige", disabled: i === 0 ? "" : null, onclick: function () { set(Math.max(0, cur - 1)); } }),
        el("button", { type: "button", class: "btn sm primary", text: "Neste →", disabled: i === FASER.length - 1 ? "" : null, onclick: function () { set(Math.min(FASER.length - 1, cur + 1)); } })
      ]);
      det.appendChild(nav);
    }
    // Uttoningshint når tidslinja er bredere enn plassen (vises bare når den faktisk scroller)
    var scr = el("div", { class: "an-tl-scroll" }, [ol]);
    var sveip = el("p", { class: "small muted an-tl-sveip", hidden: true, text: "Sveip sidelengs for flere stadier." });
    function fade() {
      var max = scr.scrollWidth - scr.clientWidth;
      var kan = max > 2;
      scr.classList.toggle("an-fade-r", kan && scr.scrollLeft < max - 2);
      scr.classList.toggle("an-fade-l", kan && scr.scrollLeft > 2);
      sveip.hidden = !kan;
    }
    scr.addEventListener("scroll", fade, { passive: true });
    window.addEventListener("resize", fade);
    wrap.appendChild(scr);
    wrap.appendChild(sveip);
    wrap.appendChild(det);
    host.appendChild(wrap);
    set(0);
    fade();
    // Fanen kan være skjult ved oppstart (bredde 0): sjekk på nytt når tidslinja blir synlig
    if (window.ResizeObserver) new ResizeObserver(fade).observe(scr);
    return { set: set };
  };

  /* ---------- Kode mot data (SQL) ---------- */
  var SQL_PRE = "SELECT * FROM kunder WHERE epost = 'ola@example.no' AND passord = '";
  var SQL_POST = "'";
  var PARAM = "SELECT * FROM kunder WHERE epost = ? AND passord_hash = ?";
  var PRESET = [
    { navn: "kanelbolle7", v: "kanelbolle7", note: "vanlig passord" },
    { navn: "o'neill", v: "o'neill", note: "ufarlig tekst med anførselstegn" },
    { navn: "a' or 1==1", v: "a' or 1==1", note: "mønsteret fra H2024 23" }
  ];

  // Fargelegg brukerens tegn i den sammenlimte spørringen.
  // Vi starter inne i en tekststreng (etter det åpne anførselstegnet i malen).
  function klassifiser(s) {
    var inStr = true, out = [], brudd = -1;
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      if (c === "'") { out.push({ c: c, k: "q" }); if (inStr && brudd < 0) brudd = i; inStr = !inStr; }
      else out.push({ c: c, k: inStr ? "d" : "x" });
    }
    return { tegn: out, slutt: inStr, brudd: brudd };
  }

  A.sql = function (host) {
    host = host$(host); if (!host) return null;
    clear(host);
    var wrap = el("div", { class: "an-sql" });
    var ctl = el("div", { class: "btn-row" });
    var inp = el("input", { type: "text", maxlength: "40", value: "kanelbolle7", "aria-label": "Passordfeltet", spellcheck: "false", autocomplete: "off", class: "an-sql-in" });
    PRESET.forEach(function (p) {
      ctl.appendChild(el("button", { type: "button", class: "btn sm", title: p.note, text: p.navn, onclick: function () { spill(p.v); } }));
    });
    var playBtn = el("button", { type: "button", class: "btn sm primary", text: "Spill av", onclick: function () { spill(inp.value); } });
    ctl.appendChild(playBtn);
    wrap.appendChild(el("div", { class: "an-sql-fld" }, [el("label", { class: "small", text: "Passordfeltet i innloggingsskjemaet:" }), inp]));
    wrap.appendChild(ctl);

    var g = el("div", { class: "an-sql-g" });
    var L = el("div", { class: "an-sql-p" }), R = el("div", { class: "an-sql-p" });
    L.appendChild(el("p", { class: "an-pc-h", text: "Limt sammen (sårbar)" }));
    var lCode = el("pre", { class: "an-sql-code", "aria-live": "polite" });
    var lMsg = el("p", { class: "small an-sql-msg" });
    L.appendChild(lCode); L.appendChild(lMsg);
    R.appendChild(el("p", { class: "an-pc-h", text: "Parametrisert" }));
    var r1 = el("div", { class: "an-sql-step" }, [el("span", { class: "an-k", text: "1 · Struktur, sendes først" }), el("pre", { class: "an-sql-code" }, [el("span", { class: "t-k", text: PARAM })])]);
    var rVal = el("span", { class: "t-d" });
    var r2 = el("div", { class: "an-sql-step" }, [el("span", { class: "an-k", text: "2 · Verdier, sendes hver for seg" }),
      el("pre", { class: "an-sql-code" }, [el("span", { class: "an-slot", text: "?₁" }), " = ", el("span", { class: "t-d", text: "ola@example.no" }), "\n",
        el("span", { class: "an-slot", text: "?₂" }), " = hash(", rVal, ")"])]);
    var rMsg = el("p", { class: "small an-sql-msg" });
    R.appendChild(r1); R.appendChild(r2); R.appendChild(rMsg);
    g.appendChild(L); g.appendChild(R);
    wrap.appendChild(g);
    wrap.appendChild(el("div", { class: "an-legend small" }, [
      el("span", null, [el("span", { class: "t-k an-lg", text: "SELECT" }), " kode (strukturen)"]),
      el("span", null, [el("span", { class: "t-d an-lg", text: "abc" }), " data (brukerens tekst)"]),
      el("span", null, [el("span", { class: "t-x an-lg", text: "abc" }), " brukerens tekst tolket som kode"])
    ]));

    function tegnL(s) {
      clear(lCode);
      lCode.appendChild(el("span", { class: "t-k", text: SQL_PRE }));
      var r = klassifiser(s);
      r.tegn.forEach(function (t) {
        lCode.appendChild(el("span", { class: t.k === "d" ? "t-d" : t.k === "x" ? "t-x" : "t-q", text: t.c }));
      });
      lCode.appendChild(el("span", { class: r.slutt ? "t-k" : "t-rest", text: SQL_POST }));
      return r;
    }
    function tegnR(s) { rVal.textContent = s; }
    function melding(s, r) {
      if (!s.length) { lMsg.textContent = "Tomt felt: spørringen er uendret."; }
      else if (r.brudd < 0) lMsg.textContent = "Alt du skrev, ble liggende inne i tekststrengen. Her gikk det bra, men bare fordi teksten tilfeldigvis ikke inneholdt et anførselstegn.";
      else if (!/\bor\b/i.test(r.tegn.filter(function (t) { return t.k === "x"; }).map(function (t) { return t.c; }).join("")))
        lMsg.textContent = "Anførselstegnet avsluttet teksten for tidlig, og resten leses som SQL. Her blir det ugyldig SQL, så spørringen feiler. Poenget er det samme: brukerens tekst kan endre strukturen i en sammenlimt spørring, også når den er ufarlig.";
      else lMsg.innerHTML = "Anførselstegnet avsluttet tekststrengen, og resten av inndataene <b>leses som SQL</b>. Med «or» og noe som alltid er sant, blir hele betingelsen sann uten riktig passord." +
        (r.slutt ? "" : " Det siste anførselstegnet fra malen blir hengende; eksamen ser bort fra nøyaktig syntaks.");
      rMsg.textContent = s.length ? "Strukturen var ferdig før verdiene kom. Hele teksten er én verdi, også anførselstegnene: her er det bare et feil passord." : "Strukturen er den samme uansett hva som skrives.";
    }
    var timer = null;
    function vis(s) { var r = tegnL(s); tegnR(s); melding(s, r); }
    function spill(s) {
      if (timer) { clearInterval(timer); timer = null; }
      inp.value = s;
      if (reduced()) { r1.classList.add("cur"); r2.classList.add("cur"); vis(s); return; }
      var i = 0;
      r1.classList.add("cur"); r2.classList.remove("cur");
      vis(""); lMsg.textContent = "Skriver …"; rMsg.textContent = "Strukturen er sendt. Venter på verdiene …";
      timer = setInterval(function () {
        i++;
        var del = s.slice(0, i);
        var r = tegnL(del); tegnR(del);
        if (i >= s.length) {
          clearInterval(timer); timer = null;
          r2.classList.add("cur"); r1.classList.remove("cur");
          melding(s, r);
        }
      }, 140);
      if (!s.length) { clearInterval(timer); timer = null; vis(s); }
    }
    inp.addEventListener("input", function () { if (timer) { clearInterval(timer); timer = null; } r1.classList.remove("cur"); r2.classList.add("cur"); vis(inp.value); });
    host.appendChild(wrap);
    vis(inp.value);
    return { spill: spill };
  };

  /* ---------- Logganalyse: fire mønstre ---------- */
  var LOGGER = [
    { navn: "Logg A", linjer: [
      ["03:10:01", "203.0.113.9", "drift", "feil"], ["03:10:01", "203.0.113.9", "drift", "feil"], ["03:10:02", "203.0.113.9", "drift", "feil"],
      ["03:10:02", "203.0.113.9", "drift", "feil"], ["03:10:03", "203.0.113.9", "drift", "feil"], ["03:10:03", "203.0.113.9", "drift", "feil"]],
      svar: 0, hvorfor: "Mange forsøk mot én konto fra én adresse på sekunder: gjetting mot én bruker. Fører fort til kontosperring." },
    { navn: "Logg B", linjer: [
      ["02:14:01", "198.51.100.23", "anna", "feil"], ["02:14:02", "198.51.100.23", "bjørn", "feil"], ["02:14:02", "198.51.100.23", "jonas", "feil"],
      ["02:14:03", "198.51.100.23", "mari", "feil"], ["02:14:03", "198.51.100.23", "per", "feil"], ["02:14:04", "198.51.100.23", "siri", "feil"]],
      svar: 1, hvorfor: "Ett forsøk per bruker mot mange brukere fra samme adresse: passordspraying. Holder seg under sperregrensen." },
    { navn: "Logg C", linjer: [
      ["01:02:10", "192.0.2.77", "kasse1", "feil"], ["01:02:11", "192.0.2.77", "kasse1", "feil"], ["01:02:12", "192.0.2.77", "kasse1", "feil"],
      ["01:02:13", "192.0.2.77", "kasse1", "feil"], ["01:02:14", "192.0.2.77", "kasse1", "ok"], ["01:05:40", "192.0.2.77", "kasse1", "ok"]],
      svar: 2, hvorfor: "Feil, feil, feil og så ok på samme konto: gjetningen lyktes. Sperr kontoen, bytt passord og sjekk hva den har gjort." },
    { navn: "Logg D", linjer: [
      ["08:12:44", "10.0.4.21", "anna", "feil"], ["08:12:51", "10.0.4.21", "anna", "ok"], ["09:40:03", "10.0.7.88", "per", "feil"],
      ["09:40:09", "10.0.7.88", "per", "ok"], ["13:05:17", "10.0.2.14", "siri", "feil"], ["13:05:25", "10.0.2.14", "siri", "ok"]],
      svar: 3, hvorfor: "Spredte enkeltfeil fra ulike interne maskiner i arbeidstiden, hver fulgt av ok: folk som skriver feil." }
  ];
  var MONSTER = ["Gjetting mot én konto", "Passordspraying", "Mulig kompromittert konto", "Vanlig støy"];

  function tell(l) {
    var per = {}, ip = {}, okEtterFeil = false, feil = {};
    l.forEach(function (r) {
      per[r[2]] = (per[r[2]] || 0) + 1; ip[r[1]] = 1;
      if (r[3] === "feil") feil[r[2]] = (feil[r[2]] || 0) + 1;
      else if ((feil[r[2]] || 0) >= 3) okEtterFeil = true;
    });
    var brukere = Object.keys(per);
    var maks = brukere.reduce(function (m, b) { return Math.max(m, per[b]); }, 0);
    return { brukere: brukere.length, maks: maks, ip: Object.keys(ip).length, ok: okEtterFeil };
  }

  A.logg = function (host) {
    host = host$(host); if (!host) return null;
    clear(host);
    var wrap = el("div", { class: "an-logg" });
    var sel = el("div", { class: "btn-row", role: "group", "aria-label": "Velg logg" });
    var tw = el("div", { class: "table-wrap" });
    var cnt = el("div", { class: "pills an-logg-cnt" });
    var valg = el("div", { class: "btn-row", role: "group", "aria-label": "Hva er dette?" });
    var msg = el("p", { class: "an-logg-msg", "aria-live": "polite" });
    var cur = 0, lb = [];
    LOGGER.forEach(function (g, i) {
      var b = el("button", { type: "button", class: "btn sm", text: g.navn, "aria-pressed": "false", onclick: function () { set(i); } });
      lb.push(b); sel.appendChild(b);
    });
    MONSTER.forEach(function (m, i) {
      valg.appendChild(el("button", { type: "button", class: "btn sm", text: m, onclick: function () { svar(i); } }));
    });
    function set(i) {
      cur = i;
      lb.forEach(function (b, k) { b.setAttribute("aria-pressed", k === i ? "true" : "false"); });
      var g = LOGGER[i];
      clear(tw);
      var t = el("table", { class: "an-logg-t" }, [
        el("thead", null, [el("tr", null, ["Tid", "Kilde-IP", "Bruker", "Resultat"].map(function (h) { return el("th", { scope: "col", text: h }); }))]),
        el("tbody", null, g.linjer.map(function (r) {
          return el("tr", null, r.map(function (c, k) { return el("td", { class: k === 3 ? (c === "ok" ? "an-ok" : "an-feil") : (k < 2 ? "mono" : null), text: c }); }));
        }))
      ]);
      tw.appendChild(t);
      var c = tell(g.linjer);
      clear(cnt);
      [["antall brukere", c.brukere], ["forsøk per bruker (maks)", c.maks], ["kilde-IP-er", c.ip], ["ok etter mange feil", c.ok ? "ja" : "nei"]].forEach(function (p) {
        cnt.appendChild(el("span", { class: "pill" }, [el("span", { class: "k", text: p[0] + ": " }), String(p[1])]));
      });
      msg.textContent = "Hva viser loggen? Se på de to første tellerne.";
      msg.className = "an-logg-msg";
    }
    function svar(i) {
      var g = LOGGER[cur], rett = i === g.svar;
      msg.className = "an-logg-msg " + (rett ? "ok" : "feil");
      msg.textContent = (rett ? "Riktig. " : "Ikke helt: dette er «" + MONSTER[g.svar] + "». ") + g.hvorfor;
    }
    wrap.appendChild(sel); wrap.appendChild(tw); wrap.appendChild(cnt);
    wrap.appendChild(el("p", { class: "small muted", text: "Hva er dette?" }));
    wrap.appendChild(valg); wrap.appendChild(msg);
    wrap.appendChild(el("p", { class: "an-merk small" }, [
      el("b", { text: "Merk om " }), lenke("H2023-26", "H2023 26"), el("b", { text: ": " }),
      "loggen der ligner Logg A (mange passord mot én konto fra én adresse), men eksamensfasiten er «Passordspraying». " +
      "Fasiten er omdiskutert: definisjonen som brukes for Logg B, er ett passord mot mange kontoer. " +
      "Blant valgene i oppgaven er «Passordspraying» likevel det eneste passordangrepet. Se vurderingen under."
    ]));
    host.appendChild(wrap);
    set(0);
    return { set: set };
  };

  /* =====================================================================
     Øvinger (dra.js og ovelse.js)
     ===================================================================== */
  var KILDE_PENTEST = { ref: "Forelesning om pentesting (d05)", egneOrd: true };
  var KILDE_T04 = { ref: "Ukesoppgaver t04 og eksamen H2022–H2025", egneOrd: true };
  var D = (A.DATA = A.DATA || {});

  /* ---------- Stadiene i rekkefølge ---------- */
  D.faserSort = {
    id: "angrep-sort-faser",
    prompt: {
      eli5: "Et avtalt innbrudd skjer i en fast rekkefølge. Sett stegene i riktig rekkefølge, fra avtalen til rapporten.",
      normal: "Sett de sju stadiene i en penetrasjonstest i riktig rekkefølge.",
      teknisk: "Sett stadiene i kursets pentestmodell i rekkefølge, fra avtale til rapport. Ikke bland med Cyber Kill Chain."
    },
    items: [
      { id: "plan", html: "Planlegging", forklaring: {
        eli5: "Først blir alle enige om hva som er lov, og det skrives ned.",
        normal: "Mål, omfang, tidsrom, kontaktperson og boksfarge avtales, og tillatelsen gis <b>skriftlig og på forhånd</b> av noen med myndighet. Uten den er testen straffbar etter § 204.",
        teknisk: "Avtale om mål (hvilke kjerneverdier som skal prøves), omfang, tidsrom og boksfarge, med skriftlig tillatelse fra noen med myndighet over systemet, og i forvaltningen med hjemmel." } },
      { id: "rek", html: "Rekognosering", forklaring: "Finn ut mest mulig: først passivt fra åpne kilder (OSINT), så kartlegging av hvilke maskiner og tjenester som svarer. Kommer <i>før</i> innledende tilgang." },
      { id: "innl", html: "Innledende tilgang", forklaring: "Den første kontoen eller maskinen, for eksempel via phishing, et svakt passord eller en sårbar nettside. Ofte det tyngste stadiet, så oppdragsgiver gir gjerne en vanlig brukerkonto." },
      { id: "utv", html: "Utvide tilgangen", forklaring: "Fra vanlig bruker til administrator eller root, og fra én maskin til flere (privilegieeskalering)." },
      { id: "fot", html: "Sikre fotfeste", forklaring: "Vise at tilgangen kan beholdes over tid, slik en ondsinnet aktør ville gjort med bakdører og rootkit." },
      { id: "gev", html: "Gevinst", forklaring: "Vise at kjerneverdiene kan rammes uten å gjøre skade: endre en avtalt fil eller hente ut <i>usensitive</i> data." },
      { id: "rap", html: "Rapport", forklaring: "Et eget, siste stadium: funn, alvorlighet og tiltak. Rapporten er det kunden betaler for." }
    ],
    answer: ["plan", "rek", "innl", "utv", "fot", "gev", "rap"],
    oppsummering: "Huskeregel: avtale → finn ut → kom inn → få mer → bli værende → vis det → skriv det. Trykk på stadiene under for hva forsvareren kan gjøre i hvert av dem.",
    kilde: { ref: "Forelesning om pentesting (d05), lysark 16", egneOrd: true }
  };
  A.faserSort = function (host) { return IN.sortTask(host, D.faserSort, { instant: false }); };

  /* ---------- Boksfargene som matrise ---------- */
  var JN = ["Ja", "Nei"];
  D.bokser = {
    id: "angrep-mat-boks",
    sporsmal: {
      eli5: "Testeren kan få vite ingenting, litt eller alt på forhånd. Fyll ut hva det betyr for hver boksfarge.",
      normal: "Fyll ut tabellen: hva vet testeren på forhånd, og hva følger av det? «Vis fasit» viser hvorfor i hver celle.",
      teknisk: "Fyll ut tabellen. Boksfargen avtales i planleggingen og avgjør hvor tiden går, hvor realistisk testen er og hva den typisk finner."
    },
    rader: [
      "<span class=\"an-sw an-sw-svart\" aria-hidden=\"true\"></span>Svartboks",
      "<span class=\"an-sw an-sw-gra\" aria-hidden=\"true\"></span>Gråboks",
      "<span class=\"an-sw an-sw-hvit\" aria-hidden=\"true\"></span>Hvitboks"
    ],
    kolonner: [
      { navn: "Informasjon på forhånd", valg: ["Ingen", "Noe", "All relevant"] },
      { navn: "Likest en helt utenforstående angriper", valg: JN },
      { navn: "Mye av tiden går til kartlegging fra null", valg: JN },
      { navn: "Anbefalt når tid og budsjett er knapt", valg: JN },
      { navn: "Finner typisk flest feil for samme innsats", valg: JN }
    ],
    fasit: [
      ["Ingen", "Ja", "Ja", "Nei", "Nei"],
      ["Noe", "Nei", "Nei", "Ja", "Nei"],
      ["All relevant", "Nei", "Nei", "Ja", "Ja"]
    ],
    forklaring: {
      "0,0": "Bare navnet på virksomheten og avtalt tidsrom (H2023 4, H2025 4).",
      "1,0": "Noe, men ikke alt: for eksempel en nettverksskisse, IP-områdene eller en vanlig brukerkonto (H2024 4).",
      "2,0": "All relevant informasjon: full dokumentasjon og nettverkstegninger, ofte kildekode og kontoer (H2022 4.3).",
      "0,1": "Starter der en utenforstående starter. Men en ekte angriper har måneder, pentesteren har dager.",
      "1,1": "Testeren vet mer enn en helt utenforstående, men mindre enn ved hvitboks.",
      "2,1": "En ekte angriper har sjelden så mye informasjon.",
      "0,2": "Kartleggingen må gjøres fra null, og innledende tilgang er det tyngste stadiet. Derfor tar svartboks lengre tid.",
      "1,2": "Informasjonen sparer tid på kartlegging og innledende tilgang.",
      "2,2": "Kartet er gitt. Tiden kan brukes på å finne feil, og det er lettere å se hvor kart og terreng ikke stemmer.",
      "0,3": "Svartboks tar lengst tid og finner ofte færre feil innenfor samme budsjett.",
      "1,3": "Med lite tid og budsjett anbefales hvit- eller gråboks.",
      "2,3": "Med lite tid og budsjett anbefales hvit- eller gråboks.",
      "0,4": "Færre funn for samme innsats, fordi så mye tid går til kartlegging.",
      "1,4": "Et kompromiss: flere funn enn svartboks, men mindre oversikt enn hvitboks.",
      "2,4": "Mest effektiv, særlig i store nett. Faren er å bli blind av all informasjonen."
    }
  };
  A.bokser = function (host) { return IN.matrise(host, D.bokser); };

  /* ---------- Phishingtypene ---------- */
  D.phishing = {
    id: "angrep-dra-phish",
    prompt: {
      eli5: "Hvem er meldingen laget for, og er den en kopi av noe ekte? Legg hver melding i riktig type.",
      normal: "Legg hver melding i riktig phishingtype. Spør deg selv: hvem er den laget for, og er den en kopi av en melding mottakeren faktisk har fått?",
      teknisk: "Klassifiser etter målgruppe og innhold, ikke etter kanal. SMS og telefon er kanaler; typen avgjøres av hvem meldingen er tilpasset."
    },
    zones: [
      { id: "masse", label: "Masse-phishing", hint: "samme melding til mange" },
      { id: "spyd", label: "Spyd-phishing", hint: "tilpasset én person eller gruppe" },
      { id: "klone", label: "Klone-phishing", hint: "kopi av en ekte melding" },
      { id: "dir", label: "Direktørsvindel / whaling", hint: "toppledelse, autoritet, betaling" }
    ],
    items: [
      { id: "toll", html: "SMS til tusenvis av tilfeldige numre: «Pakken din venter, betal 29 kr i toll her.»",
        forklaring: "Samme tekst til mange, uten noe som passer akkurat deg. At den kommer som SMS, endrer ikke typen." },
      { id: "apple", html: "«Apple Pay-kontoen din er suspendert» til en som aldri har hatt Apple Pay.",
        forklaring: "Mottakeren har ikke tjenesten, så meldingen er verken en kopi av noe han har fått eller tilpasset ham (H2024 20)." },
      { id: "seminar", html: "Fra en ukjent avsender: «Hei Mari, fint innlegg på seminaret i IN1234 på torsdag», med lenke til en kollokviegruppe.",
        forklaring: "Innholdet er tilpasset én student: navn, emne og et konkret seminar. Det er det som gjør den til spyd (som i H2023 23)." },
      { id: "messe", html: "«Hei Jonas, takk for praten på bakerimessa, her er prislista vi snakket om», med vedlegg.",
        forklaring: "Bruker ekte detaljer om mottakeren. Et flettet navn alene hadde ikke vært nok; det er innholdet som er tilpasset." },
      { id: "faktura", html: "En nesten identisk kopi av fakturaen fra melleverandøren som kom i går, men med nytt kontonummer.",
        forklaring: "Mottakeren har faktisk fått originalen. Bare kontonummeret er byttet: klone." },
      { id: "pakke", html: "En kopi av en ekte pakkevarsling du fikk tidligere i uka, der bare lenken er byttet.",
        forklaring: "Klonen bygger på en ekte melding offeret har fått, med ny lenke eller nytt vedlegg." },
      { id: "sjef", html: "«Fra daglig leder»: betal denne fakturaen til en ny leverandør i dag, og ikke snakk med noen om det.",
        forklaring: "Angriperen utgir seg for en leder og bruker autoritet og hastverk for å få en betaling gjennom." },
      { id: "stemme", html: "En telefon der stemmen ligner finansdirektøren (deepfake), som ber regnskap overføre penger straks.",
        forklaring: "Kanalen er telefon og stemmen er falsk, men mønsteret er det samme: utgi seg for en leder for å få en betaling. Mottiltak: ring tilbake på et kjent nummer." },
      { id: "konsern", html: "E-post til konsernsjefen, skreddersydd med detaljer om et oppkjøp hun forhandler om.",
        forklaring: "Rettet <i>mot</i> en toppleder: whaling. Den er også tilpasset, men eksamen bruker direktørsvindel/whaling når toppledelsen er sentral." }
    ],
    answer: { toll: "masse", apple: "masse", seminar: "spyd", messe: "spyd", faktura: "klone", pakke: "klone", sjef: "dir", stemme: "dir", konsern: "dir" },
    godta: { konsern: ["spyd"] },
    oppsummering: {
      eli5: "Til alle: masse. Bare til deg: spyd. En kopi av noe ekte: klone. Sjefen er med i bildet: direktørsvindel eller whaling.",
      normal: "Kanalen (e-post, SMS, telefon) avgjør ikke typen. Kurset skiller på hvem meldingen er laget for, og om den kopierer en ekte melding. Hovedtiltaket er sikkerhetskultur og opplæring, og en rutine for å bekrefte betalingsendringer via en kjent kanal.",
      teknisk: "Kanalen avgjør ikke typen. Navn som smishing (SMS) og vishing (telefon) brukes ikke i kursmaterialet vi bygger på; der er SMS og telefon kanaler, og deepfake-stemme omtales som en egen vektor. Tekniske lag (filtrering, merking av ekstern avsender, passnøkler) kommer i tillegg til opplæring."
    },
    kilde: KILDE_T04
  };
  A.phishing = function (host) { return IN.bucketTask(host, D.phishing, { instant: false }); };

  /* ---------- Skadevaretypene som matrise ---------- */
  var SPRER = ["Av seg selv over nettet", "Via en vert (et annet program)", "Brukeren installerer den selv", "Ikke en del av definisjonen"];
  D.skadevare = {
    id: "angrep-mat-skadevare",
    sporsmal: {
      eli5: "Hver type har ett kjennetegn som gir den navnet. Fyll ut hva som hører til hvilken.",
      normal: "Fyll ut hva som er en del av <i>definisjonen</i> av hver type, slik kurset bruker dem. I praksis kan én skadevare være flere typer samtidig, men her spør vi om hva som gir navnet.",
      teknisk: "Fyll ut definisjonskjennetegnene. Typene beskriver hvordan skadevaren sprer seg, når den slår til, eller hva den gjør, så én fil kan ha flere roller."
    },
    rader: ["Virus", "Dataorm", "Trojaner", "Bakdør", "Logisk bombe", "Rootkit", "Løsepengevirus"],
    kolonner: [
      { navn: "Hvordan sprer den seg?", valg: SPRER },
      { navn: "Utløses av en betingelse, for eksempel en dato", valg: JN },
      { navn: "Skjuler prosesser, filer og spor", valg: JN },
      { navn: "Gir en vei forbi autentiseringen", valg: JN },
      { navn: "Krypterer data og krever betaling", valg: JN }
    ],
    fasit: [
      [SPRER[1], "Nei", "Nei", "Nei", "Nei"],
      [SPRER[0], "Nei", "Nei", "Nei", "Nei"],
      [SPRER[2], "Nei", null, "Nei", "Nei"],
      [SPRER[3], "Nei", null, "Ja", "Nei"],
      [SPRER[3], "Ja", "Nei", "Nei", "Nei"],
      [SPRER[3], "Nei", "Ja", null, "Nei"],
      [SPRER[3], "Nei", "Nei", "Nei", "Ja"]
    ],
    forklaring: {
      "0,0": "Et virus fletter sin egen kode inn i andre programmer og trenger en vert.",
      "1,0": "En orm sprer seg selv over nettet, uten vert og uten at noen klikker (Morris, SQL Slammer, Mirai).",
      "2,0": "Trojaneren utgir seg for å være, eller er faktisk, et nyttig program. Det som skiller, er forkledningen, ikke smitteveien.",
      "2,2": "Telles ikke: innholdet er skjult i et nyttig program, men å skjule prosesser og spor er rootkitets jobb.",
      "3,0": "En bakdør beskriver hva koden gjør, ikke hvordan den kom dit. Den kan være lagt inn av programmereren selv.",
      "3,2": "Telles ikke: bakdøren er skjult, men det er ikke den som skjuler andre prosesser.",
      "3,3": "En skjult vei forbi vanlig autentisering og tilgangskontroll, for eksempel et skjult passord (H2023 24).",
      "4,0": "Navnet sier når den slår til, ikke hvordan den kom inn.",
      "4,1": "Utløseren, en betingelse som en dato (fredag den 13.), er det som gjør den til en logisk bombe.",
      "5,0": "Navnet sier hva den gjør, ikke hvordan den kom inn.",
      "5,2": "Et rootkit skjuler prosesser, filer og spor, gjerne med høye rettigheter, så logger og antivirus på maskinen ser «ingenting» (H2025 19).",
      "5,3": "Telles ikke: et rootkit skjuler ofte en bakdør, men selve rootkitet er skjulingen.",
      "6,0": "Navnet sier hva den gjør. Noen løsepengevirus har også spredd seg som ormer, men det er ikke det som gir navnet.",
      "6,4": "Krypterer offerets data og krever betaling. Bryter først og fremst tilgjengelighet (T). Krypteringen er vanlig kryptografi, ikke SHA-256."
    }
  };
  A.skadevare = function (host) { return IN.matrise(host, D.skadevare); };

  /* ---------- Rootkit-scenario (H2025 19) ---------- */
  D.rootkit = {
    id: "angrep-scen-rootkit",
    tittel: "Du er sikkerhetssjef. Situasjonen er gjenfortalt fra H2025 19.",
    start: "funn",
    noder: {
      funn: {
        tekst: {
          eli5: "<p>Én datamaskin sender hemmelige pakker ut på nettet til faste tider, selv om ingen bruker den. Den gjør det fortsatt etter omstart. Alle filene ser ekte ut, og det første antivirusprogrammet finner ingenting. Et nytt antivirusprogram finner noe og fjerner det, men loggene sier at det aldri har kjørt.</p><p>Hva slags skadevare er dette?</p>",
          normal: "<p>Én bestemt maskin sender kryptert trafikk ut på Internett til faste tider, selv om ingen bruker den, og det fortsetter etter omstart. Systemfilene er bekreftet like produsentens, og antivirus finner ingenting. Et annet antivirusprogram finner og fjerner skadevaren, men loggene viser ingen spor av at den har kjørt, verken før eller etter.</p><p>Hva slags skadevare peker dette mot?</p>",
          teknisk: "<p>Én vert har periodisk kryptert utgående trafikk, uten brukere, og mønsteret overlever omstart. Systemfilene er verifisert mot produsentens, det første antivirusprogrammet er blindt, et annet finner og fjerner noe, og loggene er tomme før og etter.</p><p>Hvilken type skadevare forklarer at maskinen ikke ser seg selv?</p>"
        },
        valg: [
          { tekst: "Et rootkit", til: "forst", poeng: 1, kit: { K: "truet" },
            konsekvens: "Riktig (A, 1p). Ingen spor i logger, rene systemfiler og usynlig for ett antivirus er ledetrådene: noe skjuler seg for operativsystemet." },
          { tekst: "En dataorm", til: "forst", poeng: 0, kit: { K: "truet" },
            konsekvens: "Bare én maskin er rammet, og det som skiller her, er at skadevaren skjuler seg. Svaret på A er rootkit." },
          { tekst: "En logisk bombe", til: "forst", poeng: 0, kit: { K: "truet" },
            konsekvens: "Trafikken går til faste tider, men det viktigste er at maskinen ikke ser skadevaren. Svaret på A er rootkit." }
        ]
      },
      forst: {
        tekst: "<p>IT trenger maskinen og vil sette den rett i drift, siden antivirus har fjernet skadevaren. Hva gjør du først?</p>",
        valg: [
          { tekst: "Isoler maskinen, og undersøk om andre maskiner har samme trafikkmønster eller samme skadevare", til: "inngang", poeng: 2, kit: { K: "truet", T: "truet" },
            konsekvens: "Sensor gir 2 poeng for å sjekke spredning til resten av virksomheten. Maskinen er utilgjengelig en stund, men lekkasjen stopper." },
          { tekst: "Kjør det første antivirusprogrammet en gang til for å være sikker", til: "igjen", poeng: 0,
            konsekvens: "Det fant ingenting første gang heller. Et verktøy som kjører på en kompromittert maskin, ser bare det rootkitet slipper gjennom." },
          { tekst: "Blokker den utgående trafikken i brannmuren og la maskinen stå", til: "igjen", poeng: 0, kit: { K: "truet" },
            konsekvens: "Det kan stoppe lekkasjen fra denne maskinen, men du vet ikke om andre maskiner er rammet." },
          { tekst: "Gi maskinen tilbake til IT med en gang", til: "drift", poeng: -2, kit: { K: "brutt", I: "truet" },
            konsekvens: "En maskin du ikke kan stole på, er tilbake i produksjon, og ingen har sjekket om resten av nettet er rammet." }
        ]
      },
      igjen: {
        tekst: "<p>Du har fortsatt ikke svart på det viktigste spørsmålet i B: er dette bare én maskin?</p>",
        valg: [
          { tekst: "Undersøk nå om andre maskiner har samme mønster eller samme skadevare", til: "inngang", poeng: 1, kit: { K: "truet" },
            konsekvens: "Spredningen sjekkes, men senere enn den burde." },
          { tekst: "Gå videre til spørsmålet om drift", til: "drift", poeng: 0, kit: { K: "truet" },
            konsekvens: "Andre maskiner kan være rammet uten at noen vet det." }
        ]
      },
      inngang: {
        tekst: "<p>Ingen andre maskiner viser samme mønster så langt. Hva gjør du før du svarer IT?</p>",
        valg: [
          { tekst: "Finn ut hvordan skadevaren kom inn, og hva som er sendt ut", til: "drift", poeng: 1,
            konsekvens: "Sensor gir 1 poeng for inngangsveien. Da kan hullet tettes, og en eventuell datalekkasje håndteres." },
          { tekst: "Ingenting mer: spredningen er sjekket", til: "drift", poeng: 0,
            konsekvens: "Hullet skadevaren kom inn gjennom, er fortsatt åpent." }
        ]
      },
      drift: {
        tekst: "<p>IT spør igjen: kan maskinen tilbake i drift nå som skadevaren er borte?</p>",
        valg: [
          { tekst: "Nei. Den reinstalleres fra et kjent rent utgangspunkt før den settes i drift", til: "bra", poeng: 3, kit: { K: "ok", I: "ok", T: "ok" },
            konsekvens: "Riktig (C). Et rootkit er laget for å skjule, så det kan ligge igjen bakdører eller annen skadevare som heller ikke det nye antivirusprogrammet ser." },
          { tekst: "Ja, når det nye antivirusprogrammet ikke finner mer", til: "risiko", poeng: -2, kit: { K: "brutt", I: "truet" },
            konsekvens: "At antivirus ikke finner mer, er nettopp det rootkitet sørger for. Maskinen kan ikke stoles på." },
          { tekst: "Ja, etter at alle passord på maskinen er byttet", til: "risiko", poeng: -1, kit: { K: "truet", I: "truet" },
            konsekvens: "Nye passord hjelper ikke om det ligger en bakdør igjen, og nye passord kan fanges opp på en kompromittert maskin." }
        ]
      },
      bra: { slutt: true, oppsummering: {
        eli5: "<p>Godt gjort. Tyven var usynlig, så du kan ikke vite at alt er borte. Du sjekket resten av huset, fant døra han kom inn gjennom, og bygde rommet på nytt.</p>",
        normal: "<p>Godt håndtert: isolere, sjekke spredning (2p), finne inngangsveien (1p), og si nei til drift med begrunnelse (reinstallere 1p, begrunnelse 2p). Si «reinstallere» eksplisitt i fritekstsvaret.</p>",
        teknisk: "<p>Godt håndtert, i hendelseshåndteringens rekkefølge: inneslutning (isolere), analyse (spredning, inngangsvei, hva som er sendt ut), utrydding (reinstallering fra rent medium) og gjenoppretting. En maskin som har hatt rootkit, regnes som upålitelig til den er bygd opp på nytt.</p>" } },
      risiko: { slutt: true, oppsummering: "<p>Maskinen er tilbake i drift uten at noen vet hva rootkitet har etterlatt. Sensor krever at maskinen reinstalleres, med begrunnelsen at et rootkit skjuler, og at det kan være bakdører eller annen skadevare igjen.</p>" }
    },
    avslutt: { fritekst: {
      sporsmal: "Skriv svaret på C med egne ord, maks fem linjer: kan IT sette maskinen tilbake i drift?",
      sjekkliste: ["Svarer nei", "Sier at maskinen må reinstalleres fra et kjent rent utgangspunkt", "Begrunner: formålet med et rootkit er å skjule skadevare", "Nevner at det kan ligge igjen bakdører eller annen skadevare"]
    } }
  };
  A.rootkit = function (host) { return IN.scenario(host, D.rootkit); };

  /* ---------- Finn feilen: sudoers ---------- */
  D.sudo = {
    id: "angrep-feil-sudo",
    tittel: "/etc/sudoers (utdrag)",
    sporsmal: {
      eli5: "Driftsbrukeren skal bare ta sikkerhetskopi og se én loggfil. To av linjene gir ham i praksis nøkkelen til hele huset. Finn dem.",
      normal: "Brukeren <code>drift</code> skal bare kunne ta sikkerhetskopi og lese loggen til én app. To linjer gir i praksis root. Finn dem, og velg hvorfor.",
      teknisk: "Brukeren <code>drift</code> trenger to oppgaver: sikkerhetskopi og lesing av én applogg. Finn reglene som bryter minste privilegium og i praksis gir root."
    },
    linjer: [
      "# redigeres med visudo",
      "Defaults    env_reset",
      "root        ALL=(ALL:ALL) ALL",
      "%sudo       ALL=(ALL:ALL) ALL",
      "# drift: sikkerhetskopi og loggsjekk",
      "drift       ALL=(root) /usr/local/bin/ta-backup.sh",
      "drift       ALL=(root) /usr/bin/python3",
      "drift       ALL=(root) /usr/bin/cat",
      "drift       ALL=(root) /usr/local/bin/vis-applogg.sh"
    ],
    feil: [6, 7],
    grunner: [
      "Tolk: kan kjøre vilkårlig kode, også starte et skall som arver root",
      "Filleser: kan lese alle filer som root, også /etc/shadow (hashene kan knekkes offline)",
      "NOPASSWD mangler, så drift må oppgi passordet sitt hver gang",
      "Linja gir for lite: (root) betyr at drift ikke får kjøre programmet",
      "Programmer under /usr/bin kan ikke brukes med sudo"
    ],
    // Én grunn per feillinje (ovelse.js slår på grunnPerLinje av seg selv). Begge bryter minste privilegium.
    riktigGrunn: { 6: 0, 7: 1 },
    forklaring: {
      eli5: "<p>Linje 7 og 8 gir drift en hovednøkkel, ikke nøkkelen til vaskerommet. Et program som kan starte andre programmer eller lese alle filer, gir like mye som full tilgang.</p>",
      normal: "<p>Linje 7 gir sudo-tilgang til en <b>tolk</b>. En tolk kan kjøre hva som helst, også starte et skall, og det skallet arver root (H2022 4.4).</p><p>Linje 8 gir sudo-tilgang til et <b>filleseprogram</b>. Det kan lese <code>/etc/shadow</code>, så passordhashene kan hentes ut og knekkes offline, og andres filer og nøkler kan leses (H2023 29).</p><p>Tiltak: fjern begge linjene. Oppgavene dekkes allerede av de to skriptene med faste argumenter. Gå jevnlig gjennom sudo-oppsettet, og logg sudo-bruken.</p>",
      teknisk: "<p>Begge reglene bryter minste privilegium: et generelt verktøy med sudo er en root-tilgang. Linje 7 (tolk) gir vilkårlig kodekjøring som root; linje 8 (filleser) gir lesetilgang til alt, også <code>/etc/shadow</code>, og dermed offline knekking av hasher. Angriperen trenger ingen egen skadevare, bare systemets egne programmer.</p><p>Behandle hver sudo-regel som en root-tilgang: bare konkrete, egne skript med faste argumenter, som drift ikke selv kan endre. Gjennomgå og logg sudo-bruk, og bruk sterke, unike passord så stjålne hasher er lite verdt.</p>"
    },
    linjeForklaring: {
      2: "Normalt: root har alt.",
      3: "Administratorgruppen har alt, men må oppgi passordet sitt.",
      5: "Et eget skript for én oppgave. Trygt så lenge drift ikke kan endre skriptet.",
      6: "Tolk: kan starte et skall som arver root (H2022 4.4).",
      7: "Filleser: kan lese /etc/shadow og andres filer (H2023 29).",
      8: "Et eget skript med faste argumenter. Slik bør det se ut."
    }
  };
  A.sudo = function (host) { return IN.finnFeilen(host, D.sudo); };
})();
