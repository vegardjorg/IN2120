/* ============================================================
   IN2120 guide · viz-nett.js
   Visualiseringer for blokk 9 (nettverk). Klassisk script, lastes etter core.js og stepplayer.js.

   Øvingene bruker dra.js (IN.bucketTask), ovelse.js (IN.matrise, IN.scenario) og «gjett før neste»
   (spor) i stepplayer.js. Alle id-er er prefikset «nett-».

   IN.nettStakk(host)                       dra protokoller til riktig lag (IN.bucketTask)
   IN.nettStakkFigur(host)                  internettstakken og OSI side om side (statisk fasitfigur)
   IN.nettInnkapsling(host, steg, opts?)    pakke som bygges hode for hode (stegspiller; steg kan ha spor)
   IN.nettSekvens(host, { roller, varianter, legend? })
                                            sekvensdiagram med livslinjer; meldinger kan ha spor
   IN.nettNokkeltyveri(host)                «stjel privatnøkkelen i 2027»: efemær DH mot RSA-transport
   IN.nettBrannmur(host, { regler, pakker }) iptables-regler pakke for pakke, gjett ACCEPT/DROP først
   IN.nettDmz(host)                         plasser tjenester i Internett / DMZ / indre nett (IN.bucketTask)
   IN.nettDmzFigur(host)                    DMZ-topologi med porter som slippes (statisk fasitfigur)
   IN.nettSnort(host)                       Snort-regelens deler (klikk for forklaring)
   IN.nettSnortBygger(host)                 bygg en regel og test den mot eksempelpakker
   IN.nettSnortTreff(regel, pakke) → bool   ren funksjon (testbar i node)
   IN.nettAnomali(host)                     trafikkgraf med terskel, gjett før «tren under pentest»
   IN.nettIdsHendelser(host)                signatur eller anomali: gir hendelsen alarm? (spor)
   IN.nettTor(host)                         løkruting: ett skall per node (spor)
   IN.nettAnonym(host)                      hvem ser hva ved sky-VPN og Tor (to IN.matrise, bryter for TLS)
   IN.nettHvemSer(host)                     hvem ser passordet: figur + IN.matrise med scenariobrytere
   IN.nettLagmodell(host)                   egg, løk og zero trust mot en angriper inn via phishing (spor)
   IN.nettForsvar(host)                     brannmurtyper, IDS og IPS sammenlignet (IN.matrise)
   IN.nettScenarioPentest(host)             IDS-alarmer under en avtalt pentest (IN.scenario)
   IN.nettScenarioBob(host)                 Bobs passord, H2025 37, fra forsvarersiden (IN.scenario)
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var el = IN.el, clear = IN.clear;

  function host$(h) { return typeof h === "string" ? IN.qs(h) : h; }
  function pick(v, lvl) { return IN.level.pick(v, lvl); }
  function H(tag, cls, html) { var n = el(tag, cls ? { class: cls } : {}); if (html != null) n.innerHTML = html; return n; }
  function wrapPlayer(host) {
    var w = el("div", { class: "nt-sp" });
    host.appendChild(w);
    return w;
  }

  /* ---------- Protokollstakken: dra til riktig lag ---------- */
  IN.nettStakk = function (host) {
    host = host$(host); if (!host || !IN.bucketTask) return null;
    clear(host);
    return IN.bucketTask(host, {
      id: "nett-stakk",
      opphav: { type: "egen", variantAv: ["H2025-22", "H2024-28"], kilder: ["nettverkslysarket s. 3–9"] },
      prompt: {
        eli5: "Hver protokoll hører hjemme i én etasje i stakken. Legg hver brikke i riktig etasje. Programmet du bruker, står over hele stakken.",
        normal: "Legg hver protokoll i laget den hører til i internettstakken, slik kursets fasit plasserer dem. Programmer står over stakken («App»).",
        teknisk: "Plasser protokollene etter laget de lager hode i og tjener, etter fasitkonvensjonen fra H2021–H2025 (H2022 7.1, H2025 22). TLS er delt i to."
      },
      zones: [
        { id: "prog", label: "App (over stakken)", hint: "programmer" },
        { id: "app", label: "Applikasjon", hint: "OSI 5–7" },
        { id: "tr", label: "Transport", hint: "OSI 4" },
        { id: "inet", label: "Internett", hint: "OSI 3" },
        { id: "link", label: "Link", hint: "OSI 2" },
        { id: "fys", label: "Fysisk", hint: "OSI 1" }
      ],
      items: [
        { id: "http", html: "HTTP", forklaring: "Protokollen nettleseren og webtjeneren snakker: applikasjonslaget." },
        { id: "https", html: "HTTPS", forklaring: {
          eli5: "HTTPS er vanlig HTTP som sendes i en låst boks. Selve språket programmet snakker, er fortsatt HTTP.",
          normal: "HTTPS er HTTP over TLS, med egen port (443). Det programmet snakker, er HTTP i applikasjonslaget; krypteringen gjør TLS Record rett over TCP.",
          teknisk: "HTTPS er ikke en egen protokoll i et eget lag, men HTTP som går gjennom TLS. Fordi TLS hører til en bestemt applikasjon, får HTTPS sin egen port (443). Kurset regner den som applikasjonsprotokoll." } },
        { id: "ssh", html: "SSH", forklaring: "Kryptert fjerninnlogging på port 22: en applikasjonsprotokoll." },
        { id: "dns", html: "DNS", forklaring: "Navneoppslag er en applikasjonstjeneste (port 53), som regel over UDP." },
        { id: "dnssec", html: "DNSSEC", forklaring: {
          normal: "DNSSEC er en utvidelse av DNS med digitale signaturer på svarene. DNS er en applikasjonstjeneste, så DNSSEC hører også til applikasjonslaget.",
          teknisk: "DNSSEC gir integritet og autentisitet for DNS-data (signaturer og en egen PKI, se blokk 3), men ingen konfidensialitet. Den ligger der DNS ligger: i applikasjonslaget." } },
        { id: "tlsh", html: "TLS Handshake", forklaring: "Kurset legger Handshake i applikasjonslaget, sammen med HTTP (nettverkslysarket s. 12). Den forhandler algoritmer og etablerer øktnøkkelen." },
        { id: "tlsr", html: "TLS Record", forklaring: "Record sitter rett over TCP og regnes til transportlaget. Den krypterer med nøkkelen Handshake etablerte." },
        { id: "tcp", html: "TCP", forklaring: "TCP leverer til riktig program via porter og sørger for at alt kommer fram i riktig rekkefølge. Det er transportlaget, men uten kryptografi." },
        { id: "udp", html: "UDP", forklaring: "Transport med porter, uten garantert levering. Ingen kryptografi, så ingen sikkerhetsprotokoll." },
        { id: "quic", html: "QUIC", forklaring: "Fasiten i H2022 7.1 plasserte QUIC i transportlaget." },
        { id: "ip", html: "IP", forklaring: "IP gir maskinene adresser og ruter pakkene mellom nett. Det er internettlaget, under porter og TCP." },
        { id: "ipsec", html: "IPsec", forklaring: "Beskytter hele IP-pakken og har derfor ingen port: internettlaget." },
        { id: "arp", html: "ARP", forklaring: "Kobler IP-adresse til MAC-adresse i lokalnettet: linklaget." },
        { id: "wpa", html: "WPA2 / WPA3", forklaring: {
          eli5: "WPA låser bare strekningen mellom maskinen og den trådløse ruteren. Etter ruteren er låsen borte.",
          normal: "WPA2 og WPA3 krypterer rammene på radiolinken mellom maskinen og aksesspunktet. Det er beskyttelse i linklaget. Merk: wifi-sikkerhet står ikke i 2026-lysarkene, så dette er vanlig lærebokplassering og ikke en kursfasit.",
          teknisk: "Beskyttelsen gjelder ett hopp: fra aksesspunktet og videre er trafikken ikke lenger WPA-kryptert. Derfor trengs TLS eller IPsec for vern hele veien. Wifi-sikkerhet er ikke pensum i 2026 (ingen eksamenstreff)." } },
        { id: "outlook", html: "Outlook (e-postprogram)", forklaring: "Et program, ikke en protokoll. Det står over stakken («App»)." },
        { id: "fiber", html: "Fiberkabel", forklaring: "Selve mediet signalene går i: det fysiske laget." }
      ],
      answer: { http: "app", https: "app", ssh: "app", dns: "app", dnssec: "app", tlsh: "app", tlsr: "tr", tcp: "tr", udp: "tr",
        quic: "tr", ip: "inet", ipsec: "inet", arp: "link", wpa: "link", outlook: "prog", fiber: "fys" },
      oppsummering: {
        eli5: "Det lure: TLS bor i to etasjer. Håndtrykket er oppe hos programmene, og selve låsingen rett over TCP.",
        normal: "<p>Fellene:</p><ul><li>TLS er delt (Handshake i applikasjon, Record i transport),</li><li>IPsec har ingen port fordi den ligger under transportlaget,</li><li>og Outlook er et program over stakken.</li></ul>",
        teknisk: "<p>Fasitkonvensjonen: Handshake i applikasjonslaget, Record i transportlaget, IPsec i internettlaget. Sikkerhetsprotokoller per lag:</p><ul><li>applikasjon (SSH, DNSSEC, TLS Handshake),</li><li>transport (TLS Record),</li><li>internett (IPsec),</li><li>link (WPA, utenfor 2026-pensum).</li></ul>"
      },
      kilde: { ref: "nettverkslysarket s. 7–12; fasit H2022 7.1 og H2025 22", egneOrd: true }
    }, { instant: false });
  };

  /* ---------- Protokollstakken (statisk fasitfigur) ---------- */
  IN.nettStakkFigur = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var g = el("div", { class: "nt-stakk", role: "img", "aria-label": "Internettstakken med fem lag ved siden av OSI-modellen med sju lag" });
    g.appendChild(H("div", "nt-sh nt-c1", "Internettstakken"));
    g.appendChild(H("div", "nt-sh nt-c2", "OSI"));
    g.appendChild(H("div", "nt-sh nt-c3", "Eksempler"));
    var app = H("div", "nt-lag nt-app nt-c1", "App <span class=\"muted small\">(over stakken)</span>");
    app.style.gridRow = "2"; g.appendChild(app);
    var appX = H("div", "nt-ex nt-c3", "Outlook, nettleseren"); appX.style.gridRow = "2"; g.appendChild(appX);
    var osi = ["7 Applikasjon", "6 Presentasjon", "5 Sesjon", "4 Transport", "3 Nettverk", "2 Link", "1 Fysisk"];
    osi.forEach(function (t, i) { var n = H("div", "nt-osi nt-c2", t); n.style.gridRow = String(3 + i); g.appendChild(n); });
    var inet = [
      { t: "Applikasjon", r: "3 / span 3", ex: "HTTP, FTP, SMTP, Telnet, SSH, DNS, <b>TLS Handshake</b>", k: "a" },
      { t: "Transport", r: "6", ex: "TCP, UDP, QUIC, <b>TLS Record</b>", k: "t" },
      { t: "Internett", r: "7", ex: "IP, <b>IPsec</b>", k: "i" },
      { t: "Link", r: "8", ex: "ARP", k: "l" },
      { t: "Fysisk", r: "9", ex: "mediet: kabel, fiber, radio", k: "f" }
    ];
    inet.forEach(function (L) {
      var n = H("div", "nt-lag nt-c1 nt-k-" + L.k, L.t); n.style.gridRow = L.r; g.appendChild(n);
      var x = H("div", "nt-ex nt-c3", L.ex); x.style.gridRow = L.r; g.appendChild(x);
    });
    host.appendChild(g);
  };

  /* ---------- Innkapsling (stegspiller) ----------
     steg: [{ deler: [{ t, c }], text: {eli5, normal, teknisk} | "html" }]
     c: "data" | "app" | "tls" | "tcp" | "ip" | "link" | "ipsec" | "laas" */
  function pakkeRad(deler) {
    var row = el("div", { class: "nt-pakke" });
    deler.forEach(function (d) {
      var s = H("span", "nt-del nt-d-" + (d.c || "data") + (d.ny ? " nt-ny" : ""), d.t);
      row.appendChild(s);
    });
    return row;
  }
  IN.nettInnkapsling = function (host, steg, opts) {
    host = host$(host); if (!host || !IN.stepPlayer) return null;
    opts = opts || {};
    var w = wrapPlayer(host);
    return IN.stepPlayer(w, {
      initial: [1], customInput: false,
      generate: function () { return steg; },
      render: function (s, ctx) {
        clear(ctx.stage);
        var box = el("div", { class: "nt-scene" });
        if (s.over) box.appendChild(H("p", "nt-over small muted", s.over));
        box.appendChild(pakkeRad(s.deler || []));
        if (opts.note) box.appendChild(H("p", "nt-note small muted", opts.note));
        ctx.stage.appendChild(box);
      },
      legend: opts.legend
    });
  };

  /* ---------- Sekvensdiagram ----------
     cfg: { roller: ["Klient", "Tjener"], varianter: { navn: [melding, …] }, notat? }
     melding: { fra, til, t, sub?, laas?, kind?: "ok"|"bad"|"note", ved?: rolle-indeks (note), text }
     Steg i viser meldingene 0 … i; den siste er uthevet. */
  IN.nettSekvens = function (host, cfg) {
    host = host$(host); if (!host || !IN.stepPlayer) return null;
    var roller = cfg.roller, n = roller.length, w = wrapPlayer(host);
    var presets = {};
    Object.keys(cfg.varianter).forEach(function (k) { presets[k] = [k]; });
    function pct(i) { return ((i + 0.5) / n) * 100; }
    return IN.stepPlayer(w, {
      presets: presets, customInput: false, legend: cfg.legend,
      generate: function (inp) {
        var msgs = cfg.varianter[inp[0]] || [];
        return msgs.map(function (m, i) { return { msgs: msgs, i: i, text: m.text, spor: m.spor || null, tag: (i + 1) + ". " + String(m.t).replace(/<[^>]+>/g, "") }; });
      },
      render: function (s, ctx) {
        clear(ctx.stage);
        var d = el("div", { class: "nt-seq", style: "--nt-n:" + n });
        var head = el("div", { class: "nt-seq-head" });
        roller.forEach(function (r) { head.appendChild(H("div", "nt-seq-rolle", r)); });
        d.appendChild(head);
        var body = el("div", { class: "nt-seq-body" });
        roller.forEach(function (r, i) { var ll = el("span", { class: "nt-seq-ll", "aria-hidden": "true" }); ll.style.left = pct(i) + "%"; body.appendChild(ll); });
        s.msgs.forEach(function (m, i) {
          var row = el("div", { class: "nt-seq-row" + (i > s.i ? " nt-later" : "") + (i === s.i ? " nt-cur" : "") });
          if (i > s.i) { row.setAttribute("aria-hidden", "true"); }
          if (m.kind === "note" || m.fra == null) {
            var a = m.ved != null ? [].concat(m.ved) : [0, n - 1];
            var lo = Math.min.apply(null, a), hi = Math.max.apply(null, a);
            var note = H("div", "nt-seq-note" + (m.kind === "bad" ? " nt-bad" : m.kind === "ok" ? " nt-ok" : ""), (m.laas ? "🔒 " : "") + m.t + (m.sub ? '<span class="nt-sub">' + m.sub + "</span>" : ""));
            var l = (lo / n) * 100, wdt = ((hi - lo + 1) / n) * 100;
            note.style.left = l + "%"; note.style.width = wdt + "%";
            row.appendChild(note);
          } else {
            var lo2 = Math.min(m.fra, m.til), hi2 = Math.max(m.fra, m.til);
            var arr = el("div", { class: "nt-seq-arr " + (m.til > m.fra ? "nt-r" : "nt-l") + (m.kind ? " nt-" + m.kind : "") + (m.laas ? " nt-laas" : "") });
            arr.style.left = pct(lo2) + "%"; arr.style.width = (pct(hi2) - pct(lo2)) + "%";
            arr.appendChild(H("span", "nt-seq-lbl", (m.laas ? "🔒 " : "") + m.t + (m.sub ? '<span class="nt-sub">' + m.sub + "</span>" : "")));
            arr.appendChild(el("span", { class: "nt-seq-line", "aria-hidden": "true" }));
            row.appendChild(arr);
          }
          body.appendChild(row);
        });
        d.appendChild(body);
        ctx.stage.appendChild(d);
      }
    });
  };

  /* ---------- Etterspill: stjel privatnøkkelen ---------- */
  IN.nettNokkeltyveri = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var stjalet = false;
    var out = el("div", { class: "nt-tyveri", "aria-live": "polite" });
    var btn = el("button", { class: "btn sm primary", type: "button", text: "Stjel tjenerens privatnøkkel i 2027" });
    function paint() {
      clear(out);
      var rader = [
        { navn: "TLS 1.3 med efemær DH", fh: true,
          for: "Øktnøkkelen kommer fra gᵃᵇ mod p. Privatnøkkelen brukes bare til å <i>signere</i> (CertificateVerify).",
          etter: "Tyven kan nå utgi seg for å være tjeneren i nye økter, men de lagrede øktene fra 2026 forblir låst: a og b er slettet, og ingen kan regne ut gᵃᵇ igjen." },
        { navn: "Gammel SSL / TLS 1.2 med RSA-nøkkeltransport", fh: false,
          for: "Klienten lager frøet til øktnøkkelen og sender det kryptert med tjenerens offentlige nøkkel.",
          etter: "Tyven dekrypterer frøet i hver lagret økt med privatnøkkelen, regner ut øktnøklene og leser all gammel trafikk." }
      ];
      rader.forEach(function (r) {
        var b = el("div", { class: "nt-ty-rad" + (stjalet ? (r.fh ? " nt-ok" : " nt-bad") : "") });
        b.appendChild(H("p", "nt-ty-h", "<b>" + r.navn + "</b>"));
        b.appendChild(H("p", "small", r.for));
        if (stjalet) b.appendChild(H("p", "small", (r.fh ? "🔒 <b>Gamle økter: fortsatt hemmelige.</b> " : "🔓 <b>Gamle økter: åpnet.</b> ") + r.etter));
        out.appendChild(b);
      });
      btn.textContent = stjalet ? "Spol tilbake til 2026" : "Stjel tjenerens privatnøkkel i 2027";
    }
    btn.addEventListener("click", function () { stjalet = !stjalet; paint(); });
    host.appendChild(el("div", { class: "btn-row" }, [btn]));
    host.appendChild(out);
    paint();
  };

  /* ---------- Brannmur: regelevaluering ----------
     regler: [{ nr, kjede, p, s, d, dport, j, tekst }]
     pakker: { "a": { kjede, p, s, d, dport, navn } } */
  var FELT = [["kjede", "kjede"], ["p", "-p"], ["s", "-s"], ["d", "-d"], ["dport", "--dport"]];
  function treff(r, pk, f) {
    if (r[f] == null) return "any";
    return String(r[f]) === String(pk[f]) ? "ja" : "nei";
  }
  function pakkeKort(pk) { return pk.p.toUpperCase() + " " + pk.s + " → " + pk.d + ":" + pk.dport; }
  IN.nettBrannmur = function (host, cfg) {
    host = host$(host); if (!host || !IN.stepPlayer) return null;
    clear(host);
    var fjern5 = el("input", { type: "checkbox" }), flytt2 = el("input", { type: "checkbox" });
    var tools = el("div", { class: "nt-fw-tools small" }, [
      el("label", {}, [fjern5, document.createTextNode(" Fjern den siste regelen (DROP)")]),
      el("label", {}, [flytt2, document.createTextNode(" Flytt regel 2 øverst")])
    ]);
    host.appendChild(tools);
    function regelsett() {
      var r = cfg.regler.slice();
      if (flytt2.checked) { var two = r.splice(1, 1)[0]; r.unshift(two); }
      if (fjern5.checked) r = r.filter(function (x) { return !x.siste; });
      return r;
    }
    var presets = {};
    Object.keys(cfg.pakker).forEach(function (k) { presets[k + ") " + cfg.pakker[k].kort] = [k]; });
    var w = wrapPlayer(host), cur = null;
    var sp = IN.stepPlayer(w, {
      presets: presets, customInput: false, navTopp: true, fastHoyde: true,
      legend: [{ label: "feltet passer", color: "var(--nt-ok)" }, { label: "feltet passer ikke", color: "var(--nt-bad)" }, { label: "ikke oppgitt i regelen = hva som helst", color: "var(--color-outline)" }],
      generate: function (inp) {
        cur = inp;
        var pk = cfg.pakker[inp[0]], rs = regelsett(), steps = [];
        steps.push({ pk: pk, rs: rs, at: -1, text: {
          eli5: "En pakke står i køen foran dørvakten. Hun skal lese listen ovenfra.",
          normal: "Pakken: <b>" + pk.navn + "</b>. Reglene leses ovenfra, og første regel der alle oppgitte felt passer, bestemmer.",
          teknisk: "Pakken rutes gjennom brannmuren og havner derfor i kjeden FORWARD. iptables sjekker reglene i rekkefølge; et felt som ikke står i regelen, matcher alt." } });
        var hit = -1;
        for (var i = 0; i < rs.length; i++) {
          var r = rs[i], res = FELT.map(function (f) { return treff(r, pk, f[0]); });
          var ok = res.indexOf("nei") < 0;
          var feil = FELT.filter(function (f, k) { return res[k] === "nei"; }).map(function (f) { return f[1]; });
          steps.push({ pk: pk, rs: rs, at: i, res: res, ok: ok, text: ok ? {
            eli5: "Linje " + r.nr + " passer på pakken. Dørvakten slutter å lese og sier " + (r.j === "ACCEPT" ? "«kom inn»" : "«nei»") + ".",
            normal: "Regel " + r.nr + " treffer: alle oppgitte felt passer. Resultat: <b>" + r.j + "</b>. Reglene under blir aldri lest for denne pakken.",
            teknisk: "Regel " + r.nr + " matcher, og målet <code>-j " + r.j + "</code> er avsluttende. Første treff vinner, så rekkefølgen av unntak og hovedregler avgjør resultatet." } : {
            eli5: "Linje " + r.nr + " passer ikke. Hun leser videre.",
            normal: "Regel " + r.nr + " treffer ikke: " + feil.join(", ") + " passer ikke. Gå videre.",
            teknisk: "Regel " + r.nr + " matcher ikke (" + feil.join(", ") + "). " + (res[0] === "nei" ? "Feil kjede: en INPUT-regel ser aldri videresendt trafikk." : "Neste regel.") } });
          if (ok) { hit = i; break; }
        }
        if (hit < 0) steps.push({ pk: pk, rs: rs, at: rs.length, implicit: true, text: {
          eli5: "Ingen linje passet. Denne dørvakten slipper da folk inn. Derfor bør siste linje være «alle andre: nei».",
          normal: "Ingen regel traff. iptables har implisitt ACCEPT, så pakken <b>slipper gjennom</b>. Med en eksplisitt DROP til slutt hadde den blitt stoppet.",
          teknisk: "Ingen regel matchet, og standardpolicy ACCEPT gjelder (nettverkslysarket s. 48). En eksplisitt <code>-j DROP</code> sist gir minste privilegium. Merk: H2025 24-fasiten antar at trafikk uten treff blir stoppet." } });
        // Gjett før svaret: spørsmålet vises på første steg, før regel 1 sjekkes
        var dom = hit >= 0 ? rs[hit].j : "ACCEPT";
        if (steps[1]) steps[1].spor = {
          sporsmal: {
            eli5: "Les listen ovenfra selv. Slipper dørvakten inn pakken <span class=\"mono\">" + pakkeKort(pk) + "</span>?",
            normal: "Les reglene ovenfra og finn første treff. Hva blir resultatet for <span class=\"mono\">" + pakkeKort(pk) + "</span>?",
            teknisk: "Kjede " + pk.kjede + ", første treff vinner, implisitt ACCEPT uten treff. Resultat for <span class=\"mono\">" + pakkeKort(pk) + "</span>?"
          },
          valg: ["ACCEPT", "DROP"], fasit: dom === "DROP" ? 1 : 0,
          forklaring: hit >= 0 ? "Regel " + rs[hit].nr + " er den første der alle oppgitte felt passer." : "Ingen regel passer, og iptables har implisitt ACCEPT."
        };
        return steps;
      },
      render: function (s, ctx) {
        clear(ctx.stage);
        var box = el("div", { class: "nt-scene" });
        var pk = s.pk;
        box.appendChild(H("p", "nt-fw-pk", "<b>Pakke:</b> <span class=\"mono\">" + pk.p.toUpperCase() + " " + pk.s + " → " + pk.d + ":" + pk.dport + "</span> <span class=\"muted small\">(kjede " + pk.kjede + ")</span>"));
        // Smal scene: hver regel som en kompakt linje med felt-brikker i stedet for en tabell (409 px).
        if (ctx.width > 0 && ctx.width < 440) {
          var liste = el("ol", { class: "nt-fw-kort", "aria-label": "Regler, leses ovenfra" });
          s.rs.forEach(function (r, i) {
            var li = el("li", { class: i === s.at ? (s.ok ? "nt-hit" : "nt-cur") : i < s.at ? "nt-done" : "" });
            li.appendChild(H("span", "nt-fw-nr mono", String(r.nr)));
            FELT.forEach(function (f, k) {
              if (r[f[0]] == null) return;
              var cls = "nt-fw-b mono";
              if (i === s.at && s.res) cls += " nt-m-" + s.res[k];
              else if (i < s.at) cls += " nt-m-" + treff(r, pk, f[0]) + " nt-dim";
              li.appendChild(H("span", cls, "<span class=\"nt-fw-l\">" + f[1] + "</span> " + String(r[f[0]])));
            });
            li.appendChild(H("span", "nt-fw-b mono nt-j-" + r.j.toLowerCase(), "-j " + r.j));
            liste.appendChild(li);
          });
          box.appendChild(liste);
        } else {
        var tw = el("div", { class: "table-wrap" }), t = el("table", { class: "nt-fw" });
        var hr = el("tr", {}, [H("th", null, "#")].concat(FELT.map(function (f) { return H("th", "mono", f[1]); })).concat([H("th", "mono", "-j")]));
        t.appendChild(el("thead", {}, [hr]));
        var tb = el("tbody");
        s.rs.forEach(function (r, i) {
          var tr = el("tr", { class: i === s.at ? (s.ok ? "nt-hit" : "nt-cur") : i < s.at ? "nt-done" : "" });
          tr.appendChild(H("td", "mono", String(r.nr)));
          FELT.forEach(function (f, k) {
            var v = r[f[0]] == null ? "–" : String(r[f[0]]);
            var cls = "mono";
            if (i <= s.at && s.res && i === s.at) cls += " nt-m-" + s.res[k];
            else if (i < s.at) { var rr = treff(r, pk, f[0]); cls += " nt-m-" + rr + " nt-dim"; }
            tr.appendChild(H("td", cls, v));
          });
          tr.appendChild(H("td", "mono nt-j-" + r.j.toLowerCase(), r.j));
          tb.appendChild(tr);
        });
        t.appendChild(tb); tw.appendChild(t); box.appendChild(tw);
        }
        // Resultatlinja står i alle steg («?» til svaret er klart), så høyden ikke endrer seg.
        var verdict = null;
        if (s.ok) verdict = s.rs[s.at].j;
        if (s.implicit) verdict = "ACCEPT (implisitt)";
        box.appendChild(H("p", "nt-verdict " + (!verdict ? "nt-venter" : /ACCEPT/.test(verdict) ? "nt-ok" : "nt-bad"), "Resultat: <b>" + (verdict || "?") + "</b>"));
        ctx.stage.appendChild(box);
      }
    });
    function rerun() { if (cur) sp.setInput(cur); }
    fjern5.addEventListener("change", rerun); flytt2.addEventListener("change", rerun);
    return sp;
  };

  /* ---------- DMZ: plasser tjenestene ---------- */
  IN.nettDmz = function (host) {
    host = host$(host); if (!host || !IN.bucketTask) return null;
    clear(host);
    return IN.bucketTask(host, {
      id: "nett-dmz",
      opphav: { type: "egen", kilder: ["nettverkslysarket s. 36–55", "ukesoppgaven om nettverkssikkerhet, oppg. 7"] },
      prompt: {
        eli5: "En borg har forgård og tronsal. Det besøkende må nå, står i forgården (DMZ). Det verdifulle står innerst. Hvor hører hver ting hjemme?",
        normal: "Virksomheten har en ytre brannmur mot Internett, en DMZ og en indre brannmur foran det indre nettet. Plasser hver maskin eller tjeneste der den bør stå.",
        teknisk: "Arkitektur som på nettverkslysarket s. 41: ytre brannmur, DMZ (eksponert segment) og indre brannmur foran indre segment. Plasser etter hvem som må nå tjenesten, og hva et kompromiss koster."
      },
      zones: [
        { id: "ute", label: "Internett", hint: "utenfor ytre brannmur" },
        { id: "dmz", label: "DMZ", hint: "mellom ytre og indre brannmur" },
        { id: "inne", label: "Indre nett", hint: "bak indre brannmur" }
      ],
      items: [
        { id: "web", html: "Offentlig webtjener", forklaring: "Må nås av alle utenfra. Den står i DMZ, så et kompromiss ikke gir direkte vei inn til det indre nettet." },
        { id: "epost", html: "E-posttjener som tar imot post utenfra", forklaring: "Andre e-posttjenere må nå den (port 25). Derfor DMZ." },
        { id: "dns", html: "Offentlig DNS-tjener", forklaring: "Svarer på oppslag fra Internett (port 53). DMZ, som på lysarket." },
        { id: "db", html: "Database med kundedata", forklaring: {
          normal: "Skal aldri nås direkte utenfra. Den står i det indre nettet, og den indre brannmuren slipper bare inn webtjeneren på databaseporten.",
          teknisk: "Indre segment. Typisk regel i den indre brannmuren: web → database på databaseporten, alt annet DROP (ukeoppgave nettverk, oppgave 7). Da må angriperen gjennom to lag." } },
        { id: "fil", html: "Intern filtjener", forklaring: "Bare de ansatte skal bruke den, og ingen utenfra trenger å nå den. Da hører den til det indre nettet, ikke DMZ." },
        { id: "pc", html: "Ansattes arbeidsstasjoner", forklaring: "Skal ikke kunne nås utenfra. Indre nett, bak begge brannmurene." },
        { id: "kunde", html: "Kundenes nettlesere", forklaring: "Virksomheten eier dem ikke og kan ikke stole på dem. De er ute på Internett." },
        { id: "skann", html: "Ukjent maskin som skanner portene dine", forklaring: "Står ute på Internett. En NIDS utenfor gatewayen ser forsøkene, også dem brannmuren stopper." }
      ],
      answer: { web: "dmz", epost: "dmz", dns: "dmz", db: "inne", fil: "inne", pc: "inne", kunde: "ute", skann: "ute" },
      oppsummering: {
        eli5: "Det gjestene må nå, står i forgården. Det verdifulle står innerst, bak en port til.",
        normal: "Tommelfingerregel: må tjenesten nås utenfra, står den i DMZ. Alt annet står i det indre nettet. Da blir et innbrudd i DMZ ikke et innbrudd i hele nettet.",
        teknisk: "Den ytre brannmuren slipper inn bare 80/443 til web, 25 til e-post og 53 til DNS. Den indre slipper nesten ingenting inn, kanskje web → database. NIDS står utenfor, i DMZ og i det indre nettet, så alarmene kan sammenstilles."
      },
      kilde: { ref: "nettverkslysarket s. 39–41; ukesoppgaven om nettverkssikkerhet, oppg. 7", egneOrd: true }
    }, { instant: false });
  };

  /* ---------- DMZ-topologi (statisk fasitfigur) ---------- */
  IN.nettDmzFigur = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var t = el("div", { class: "nt-dmz", role: "img", "aria-label": "Internett, ytre brannmur, DMZ med web, e-post og DNS, indre brannmur, indre nett med arbeidsstasjoner og database. NIDS utenfor, i DMZ og i indre nett." });
    function sone(navn, ting, cls) {
      var s = el("div", { class: "nt-sone " + (cls || "") });
      s.appendChild(H("div", "nt-sone-h", navn));
      s.appendChild(H("div", "nt-sone-b small", ting));
      return s;
    }
    function mur(navn, slipp) {
      return el("div", { class: "nt-mur" }, [H("div", "nt-mur-h", "🧱 " + navn), H("div", "nt-mur-b small", slipp)]);
    }
    t.appendChild(sone("Internett", "Alle, også angripere · <b>NIDS</b> utenfor gatewayen ser alle forsøk", "nt-ute"));
    t.appendChild(mur("Ytre brannmur", "Slipper inn: <span class=\"mono\">80/443 → web</span>, <span class=\"mono\">25 → e-post</span>, <span class=\"mono\">53 → DNS</span>. Alt annet: DROP"));
    t.appendChild(sone("DMZ", "Webtjener · e-posttjener · DNS-tjener · <b>NIDS</b>", "nt-dmzs"));
    t.appendChild(mur("Indre brannmur", "Nesten ingenting inn. Kanskje <span class=\"mono\">web → database</span> på databaseporten"));
    t.appendChild(sone("Indre nett", "Arbeidsstasjoner · database · <b>NIDS</b> · jumphost for administrasjon", "nt-inne"));
    host.appendChild(t);
  };

  /* ---------- Snort ---------- */
  IN.nettSnort = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var deler = [
      { t: "alert", c: "h", f: "Handling: lag et varsel. (Andre handlinger finnes, men eksamen bruker alert.)" },
      { t: "tcp", c: "p", f: "Protokoll. Port gir bare mening for tcp og udp." },
      { t: "192.168.40.12", c: "s", f: "Kilde-IP: maskinen som sender pakken." },
      { t: "any", c: "s", f: "Kildeport: en klient bruker en tilfeldig høy port, så her står any." },
      { t: "->", c: "r", f: "Retning: fra venstre (kilde) til høyre (mål)." },
      { t: "any", c: "d", f: "Mål-IP: hvilken som helst maskin." },
      { t: "3389", c: "d", f: "Målport: RDP." },
      { t: "(msg:\"Utgående RDP\"; sid:1000102; rev:1;)", c: "o", f: "Valg: meldingen i varselet, sid = regelens unike nummer (egne regler fra 1 000 000), rev = revisjon." }
    ];
    var wrap = el("div", { class: "nt-snort-klikk" });
    wrap.appendChild(H("span", "nt-klikkhint", "Klikk på en del av regelen"));
    var row = el("ul", { class: "nt-snort mono", "aria-label": "Snort-regelen, del for del" });
    var info = H("p", "nt-snort-info small", "Ingen del valgt ennå. Klikk på en del av regelen for å se hva den betyr.");
    info.setAttribute("aria-live", "polite");
    deler.forEach(function (d, i) {
      var li = el("li");
      var b = el("button", { type: "button", class: "nt-sn nt-sn-" + d.c, text: d.t, "aria-pressed": "false",
        title: "Klikk for å se hva denne delen betyr", "aria-label": "Del " + (i + 1) + " av " + deler.length + ": " + d.t });
      b.addEventListener("click", function () {
        IN.qsa(".nt-sn", row).forEach(function (x) { x.classList.remove("on"); x.setAttribute("aria-pressed", "false"); });
        b.classList.add("on"); b.setAttribute("aria-pressed", "true");
        info.innerHTML = "<b class=\"mono\">" + d.t.replace(/</g, "&lt;") + "</b>: " + d.f;
      });
      li.appendChild(b);
      row.appendChild(li);
    });
    wrap.appendChild(row);
    host.appendChild(wrap);
    host.appendChild(info);
  };

  /* ---------- Snort-bygger: bygg en regel og test den ----------
     Konseptnivå: bare hodet (protokoll, adresser, porter, retning), ingen innholdssignaturer. */
  function snIpOk(r, v) { return r === "any" || String(r) === String(v); }
  function snSide(rIp, rPort, ip, port) { return snIpOk(rIp, ip) && snIpOk(rPort, port); }
  IN.nettSnortTreff = function (r, p) {
    if (r.proto !== p.proto) return false;
    var fram = snSide(r.s, r.sp, p.s, p.sp) && snSide(r.d, r.dp, p.d, p.dp);
    if (r.dir === "<>") return fram || (snSide(r.s, r.sp, p.d, p.dp) && snSide(r.d, r.dp, p.s, p.sp));
    return fram;
  };
  IN.nettSnortTreff.PAKKER = [
    { id: "p1", proto: "tcp", s: "192.168.40.12", sp: "51515", d: "10.0.0.9", dp: "3389", navn: "192.168.40.12 starter RDP mot 10.0.0.9" },
    { id: "p2", proto: "tcp", s: "10.0.0.9", sp: "3389", d: "192.168.40.12", dp: "51515", navn: "svaret fra RDP-tjeneren" },
    { id: "p10", proto: "tcp", s: "192.168.40.12", sp: "52000", d: "10.0.0.9", dp: "445", navn: "192.168.40.12 åpner en fildeling (SMB)" },
    { id: "p3", proto: "tcp", s: "192.168.40.30", sp: "40000", d: "10.0.0.9", dp: "3389", navn: "en annen maskin starter RDP" },
    { id: "p4", proto: "tcp", s: "10.10.23.23", sp: "50123", d: "198.51.100.7", dp: "22", navn: "domenekontrolleren starter SSH ut" },
    { id: "p5", proto: "tcp", s: "198.51.100.7", sp: "22", d: "10.10.23.23", dp: "50123", navn: "svaret fra SSH-tjeneren" },
    { id: "p11", proto: "tcp", s: "10.10.23.23", sp: "50300", d: "10.0.0.9", dp: "445", navn: "domenekontrolleren mot en fildeling" },
    { id: "p8", proto: "tcp", s: "192.168.40.30", sp: "51000", d: "198.51.100.7", dp: "22", navn: "en vanlig klient starter SSH ut" },
    { id: "p6", proto: "tcp", s: "203.0.113.5", sp: "44321", d: "192.168.40.7", dp: "23", navn: "Telnet inn mot 192.168.40.7" },
    { id: "p12", proto: "tcp", s: "192.168.40.7", sp: "23", d: "203.0.113.5", dp: "44321", navn: "svaret fra Telnet-tjeneren" },
    { id: "p13", proto: "tcp", s: "192.168.40.12", sp: "52100", d: "192.168.40.7", dp: "22", navn: "SSH mot 192.168.40.7" },
    { id: "p9", proto: "tcp", s: "203.0.113.5", sp: "44322", d: "10.0.0.9", dp: "23", navn: "Telnet inn mot en annen maskin" },
    { id: "p7", proto: "udp", s: "192.168.40.12", sp: "53000", d: "10.0.0.53", dp: "53", navn: "DNS-oppslag fra 192.168.40.12" }
  ];
  IN.nettSnortTreff.OPPGAVER = [
    { navn: "Utgående RDP fra 192.168.40.12", vil: ["p1"],
      tips: "Kilden (192.168.40.12) står til venstre for pilen, og RDP-porten 3389 er målporten. Svarpakken har 3389 som kildeport og treffer derfor ikke en regel med én retning." },
    { navn: "Utgående SSH fra domenekontrolleren 10.10.23.23", vil: ["p4"],
      tips: "Samme form som i H2025 20: domenekontrolleren som kilde, 22 som målport. Fasiten der skrev 22 som kildeport (trafikk fra serveren), og retteinstruksen til sensor gir 0 poeng for feil retning. Skriv maskinen som kilde, og si gjerne i én setning hvorfor 22 står på målsiden." },
    { navn: "All Telnet inn mot 192.168.40.7", vil: ["p6"],
      tips: "Hvem som helst kan være kilden, så kilde-IP og kildeport er any. Målet er 192.168.40.7 på port 23." }
  ];
  IN.nettSnortBygger = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var PK = IN.nettSnortTreff.PAKKER, OP = IN.nettSnortTreff.OPPGAVER;
    var IPS = ["any", "192.168.40.12", "192.168.40.7", "10.10.23.23", "10.0.0.9"];
    var PORTER = ["any", "22", "23", "53", "3389"];
    var regel = { proto: "tcp", s: "any", sp: "any", dir: "->", d: "any", dp: "any" };
    var oppg = 0, lost = {};
    var bar = el("div", { class: "btn-row", role: "group", "aria-label": "Velg oppgave" });
    var obtn = OP.map(function (o, i) {
      var b = el("button", { class: "btn sm", type: "button", text: o.navn, onclick: function () { oppg = i; paint(); } });
      bar.appendChild(b); return b;
    });
    function sel(felt, valg, aria) {
      var s = el("select", { class: "nt-sb-sel mono", "aria-label": aria }, valg.map(function (v) { return el("option", { value: v, text: v }); }));
      s.value = regel[felt];
      s.addEventListener("change", function () { regel[felt] = s.value; paint(); });
      return s;
    }
    var line = el("div", { class: "nt-sb-regel mono" }, [
      H("span", "nt-sb-fast", "alert"),
      sel("proto", ["tcp", "udp"], "Protokoll"),
      sel("s", IPS, "Kilde-IP"), sel("sp", PORTER, "Kildeport"),
      sel("dir", ["->", "<>"], "Retning"),
      sel("d", IPS, "Mål-IP"), sel("dp", PORTER, "Målport"),
      H("span", "nt-sb-fast", "(msg:\"Min regel\"; sid:1000001; rev:1;)")
    ]);
    var oppgTxt = el("p", { class: "nt-sb-oppg" });
    var tw = el("div", { class: "table-wrap" });
    var res = el("p", { class: "nt-sb-res", role: "status", "aria-live": "polite" });
    host.appendChild(bar); host.appendChild(oppgTxt); host.appendChild(line); host.appendChild(tw); host.appendChild(res);
    function paint() {
      obtn.forEach(function (b, i) { b.setAttribute("aria-pressed", i === oppg ? "true" : "false"); });
      var o = OP[oppg];
      oppgTxt.innerHTML = "<b>Oppgave:</b> lag en regel som varsler om <b>" + o.navn.charAt(0).toLowerCase() + o.navn.slice(1) + "</b>, og ingenting annet. Pakkene med ★ skal gi alarm.";
      var fp = 0, fn = 0, rows = PK.map(function (p) {
        var t = IN.nettSnortTreff(regel, p), vil = o.vil.indexOf(p.id) >= 0;
        if (t && !vil) fp++; if (!t && vil) fn++;
        return "<tr" + (vil ? " class=\"nt-sb-vil\"" : "") + "><td>" + (vil ? "<span class=\"nt-sb-stjerne\" aria-hidden=\"true\">★ </span><span class=\"qz-sr\">Skal gi alarm: </span>" : "") + p.navn +
          "<br><span class=\"mono small\">" + p.proto.toUpperCase() + " " + p.s + ":" + p.sp + " → " + p.d + ":" + p.dp + "</span></td>" +
          "<td class=\"" + (t ? "nt-alarm" : "muted") + "\">" + (t ? "🔔 alarm" : "ingen") + "</td>" +
          "<td class=\"" + (t === vil ? "nt-m-ja" : "nt-m-nei") + "\">" + (t === vil ? "✓" : vil ? "bom" : "falsk alarm") + "</td></tr>";
      });
      tw.innerHTML = "<table class=\"nt-fw nt-sn-tab\"><thead><tr><th>Pakke (★ = skal gi alarm)</th><th>Regelen din</th><th>Mot oppgaven</th></tr></thead><tbody>" + rows.join("") + "</tbody></table>";
      if (!fp && !fn) {
        res.className = "nt-sb-res nt-ok";
        res.innerHTML = "<b>Regelen treffer akkurat det oppgaven ber om.</b> " + o.tips;
        if (!lost[oppg] && IN.progress) { lost[oppg] = true; try { IN.progress.solved("snort", "nett-snort-" + (oppg + 1), 1, 1); } catch (e) {} }
      } else {
        res.className = "nt-sb-res nt-bad";
        var d = [];
        if (fp) d.push(fp + " falsk" + (fp > 1 ? "e" : "") + " alarm" + (fp > 1 ? "er" : ""));
        if (fn) d.push(fn + " bom (★ uten alarm)");
        res.innerHTML = "<b>Ikke ennå:</b> " + d.join(" og ") + "." + (regel.dir === "<>" && fp ? " Med <span class=\"mono\">&lt;&gt;</span> treffer regelen begge retninger, også svarpakkene." : "") +
          (regel.proto === "udp" && o.vil.length ? " Oppgaven gjelder TCP." : "");
      }
    }
    paint();
  };

  /* ---------- Anomalibasert IDS ---------- */
  IN.nettAnomali = function (host) {
    host = host$(host); if (!host) return;
    clear(host);
    var dager = ["man", "tir", "ons", "tor", "fre", "lør", "søn"], verdi = [52, 48, 57, 140, 50, 22, 18];
    var pentest = false;
    var svgNS = "http://www.w3.org/2000/svg";
    var W = 420, Hh = 190, pad = 28, maxV = 180;
    var box = el("div", { class: "nt-anom" });
    var btn = el("button", { class: "btn sm", type: "button" });
    var txt = el("p", { class: "small", "aria-live": "polite" });
    function y(v) { return Hh - pad - (v / maxV) * (Hh - 2 * pad); }
    function paint() {
      clear(box);
      var terskel = pentest ? 165 : 90;
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 " + W + " " + Hh); svg.setAttribute("class", "nt-anom-svg");
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", "Antall forbindelser mot tjeneren per dag. Torsdag har en topp på 140. Terskelen er " + terskel + ".");
      var bw = (W - 2 * pad) / dager.length;
      dager.forEach(function (d, i) {
        var v = verdi[i], x = pad + i * bw + bw * 0.18, over = v > terskel;
        var r = document.createElementNS(svgNS, "rect");
        r.setAttribute("x", x); r.setAttribute("y", y(v)); r.setAttribute("width", bw * 0.64); r.setAttribute("height", Hh - pad - y(v));
        r.setAttribute("rx", "2"); r.setAttribute("class", over ? "nt-bar-over" : "nt-bar");
        svg.appendChild(r);
        var tl = document.createElementNS(svgNS, "text");
        tl.setAttribute("x", x + bw * 0.32); tl.setAttribute("y", Hh - pad + 14); tl.setAttribute("text-anchor", "middle"); tl.setAttribute("class", "nt-ax");
        tl.textContent = d; svg.appendChild(tl);
        var tv = document.createElementNS(svgNS, "text");
        tv.setAttribute("x", x + bw * 0.32); tv.setAttribute("y", y(v) - 4); tv.setAttribute("text-anchor", "middle"); tv.setAttribute("class", "nt-ax");
        tv.textContent = v; svg.appendChild(tv);
      });
      var ln = document.createElementNS(svgNS, "line");
      ln.setAttribute("x1", pad); ln.setAttribute("x2", W - pad); ln.setAttribute("y1", y(terskel)); ln.setAttribute("y2", y(terskel));
      ln.setAttribute("class", "nt-terskel"); svg.appendChild(ln);
      var lt = document.createElementNS(svgNS, "text");
      lt.setAttribute("x", W - pad); lt.setAttribute("y", y(terskel) - 5); lt.setAttribute("text-anchor", "end"); lt.setAttribute("class", "nt-ax nt-terskel-t");
      lt.textContent = "terskel for alarm: " + terskel; svg.appendChild(lt);
      box.appendChild(svg);
      btn.textContent = pentest ? "Tren på en rolig uke i stedet" : "Tren modellen mens en pentest pågår";
      txt.innerHTML = pentest
        ? "Modellen lærte «normalt» i en uke med kartlegging og angrepstrafikk. Da ble terskelen så høy at torsdagens topp <b>ikke gir alarm</b>. Den har lært at angrep er normalt (H2025 21 B)."
        : "Modellen er trent på en vanlig uke. Torsdagens topp på 140 forbindelser ligger langt over terskelen og <b>gir alarm</b>, selv om ingen signatur finnes for angrepet.";
    }
    btn.addEventListener("click", function () { pentest = !pentest; paint(); });
    // Gjett først: vis pentest-varianten først når studenten har svart
    var gjett = el("div", { class: "nt-gjett", role: "group", "aria-label": "Gjett før du ser svaret" });
    var gFb = el("p", { class: "small", "aria-live": "polite" });
    function svar(ja) {
      clear(gjett);
      gFb.innerHTML = (ja ? "<b>Ikke riktig.</b> " : "<b>Riktig.</b> ") + "Når angrepstrafikken er med i treningsdataene, blir den en del av «normalt», og terskelen havner over toppen. Se selv:";
      gjett.appendChild(gFb);
      btn.hidden = false; pentest = true; paint();
    }
    gjett.appendChild(H("p", "small", "<b>Gjett først:</b> Modellen trenes i stedet i en uke da det pågår en pentest med mye kartlegging. Gir en topp som torsdagens alarm etterpå?"));
    gjett.appendChild(el("div", { class: "btn-row" }, [
      el("button", { class: "btn sm", type: "button", text: "Ja, toppen gir fortsatt alarm", onclick: function () { svar(true); } }),
      el("button", { class: "btn sm", type: "button", text: "Nei, den gir ikke alarm", onclick: function () { svar(false); } })
    ]));
    btn.hidden = true;
    host.appendChild(box);
    host.appendChild(el("div", { class: "btn-row" }, [btn]));
    host.appendChild(txt);
    host.appendChild(gjett);
    paint();
  };

  /* ---------- Signatur eller anomali: gir hendelsen alarm? ---------- */
  IN.nettIdsHendelser = function (host) {
    host = host$(host); if (!host || !IN.stepPlayer) return null;
    var w = wrapPlayer(host);
    var V = ["Signaturbasert IDS (som Snort)", "Anomalibasert IDS", "Ingen av dem"];
    var H5 = [
      { t: "Kjent angrep mot en kjent, upatchet sårbarhet", d: "Det finnes en signatur for angrepet, og det gir uvanlig trafikk mot tjeneren.", a: [true, true],
        f: { eli5: "Begge alarmene piper: tyven står på plakaten, og han oppfører seg rart.", normal: "Angrepet er kjent, så en signatur finnes. Det gir også avvik fra normal trafikk. Begge typer kan varsle (H2023 31).", teknisk: "Signatur: treff på kjent mønster. Anomali: avvik fra lært baseline. De utelukker ikke hverandre (H2023 31)." } },
      { t: "Nytt angrep uten signatur (nulldag)", d: "Ingen har sett angrepet før. Det gir mange flere forbindelser mot databasen enn vanlig.", a: [false, true],
        f: { eli5: "Tyven er ikke på plakaten, men han oppfører seg rart, så bare den ene alarmen piper.", normal: "Signaturbasert kjenner bare igjen det den har signatur for. Anomalibasert ser avviket.", teknisk: "Styrken til anomalideteksjon: ukjente angrep. Ulempen kommer i neste hendelse." } },
      { t: "Legitim endring: backupen er flyttet til natt", d: "Driftsavdelingen kjører nå backup kl. 02. Det gir plutselig mye trafikk, men alt er lovlig.", a: [false, true],
        f: { eli5: "Ingen tyv, men den ene alarmen piper likevel fordi natta ser annerledes ut. Det er en falsk alarm.", normal: "Anomalibasert varsler om avvik, også når avviket er ufarlig: en falsk alarm. Den gir typisk flere falske alarmer enn signaturbasert.", teknisk: "Falsk positiv. Modellen må trenes på nytt når nettet endrer seg." } },
      { t: "Kjent skadevare, sendt ukryptert, i et vanlig mønster", d: "Skadevaren har en kjent signatur. Den lastes ned over http, i en mengde og på en tid som ligner vanlig trafikk.", a: [true, false],
        f: { eli5: "Tyven står på plakaten, men oppfører seg helt vanlig. Bare plakat-alarmen piper.", normal: "Signaturen treffer på innholdet. Trafikkmønsteret er normalt, så anomalibasert ser ingenting.", teknisk: "Signaturbasert trenger ofte å se innholdet. Her er det synlig." } },
      { t: "Den samme skadevaren, men over HTTPS", d: "Nå lastes den ned over TLS, uten TLS-inspeksjon, fortsatt i et vanlig mønster.", a: [false, false],
        f: { eli5: "Tyven har på seg maske og oppfører seg vanlig. Ingen alarm piper.", normal: "TLS skjuler innholdet, så signaturen finner ingenting å treffe på (nettverkslysarket s. 59). Mønsteret er normalt, så anomalibasert er også stille.", teknisk: "TLS gjør signaturbasert IDS mindre effektiv. Motmidler: TLS-inspeksjon i proxyen, eller HIDS på endepunktet der innholdet er dekryptert." } },
      { t: "Etter trening under pentest", d: "Anomali-IDS-en ble trent i mars mens en pentest pågikk. I april kartlegger en ekte angriper nettet på samme måte. Ingen signatur passer.", a: [false, false],
        f: { eli5: "Vakthunden lærte at tyver hører til i huset, så den bjeffer ikke.", normal: "Modellen lærte at kartlegging er normalt, og varsler ikke om den nå. Ingen signatur passer heller (H2025 21).", teknisk: "Forgiftet baseline gir falske negative. Tren på en periode du vet er ren." } }
    ];
    var steg = [{ k: -1, text: {
      eli5: "To slags alarmer: den ene har bilder av kjente tyver, den andre vet hvordan en vanlig dag ser ut. Tenk over hvilken som piper før du ser svaret.",
      normal: "For hver hendelse ser du først hva som skjer, med «?» for alarmene. Tenk over om den signaturbaserte, den anomalibaserte, begge eller ingen gir alarm, og trykk «Neste» for svaret.",
      teknisk: "Signaturbasert: kjente mønstre, ofte i innholdet. Anomalibasert: avvik fra lært normal oppførsel, ofte med maskinlæring. Forutsi alarmen for hver hendelse." } }];
    H5.forEach(function (h, i) {
      var fasit = []; if (h.a[0]) fasit.push(0); if (h.a[1]) fasit.push(1); if (!fasit.length) fasit.push(2);
      // To steg per hendelse: først hendelsen med «?», så svaret. Spørsmålet (testmodus) kommer før svaret.
      steg.push({ k: i, skjul: true, tag: (i + 1) + ". " + h.t, text: "Hvem gir alarm, signaturbasert, anomalibasert, begge eller ingen? Trykk «Neste» for svaret." });
      steg.push({ k: i, text: h.f, tag: (i + 1) + ". " + h.t + ": svar",
        spor: { sporsmal: "<b>Hendelse " + (i + 1) + ": " + h.t + ".</b> " + h.d + " Hvem gir alarm? Kryss av alt som passer.", valg: V, fasit: fasit } });
    });
    return IN.stepPlayer(w, {
      initial: [1], customInput: false, navTopp: true, fastHoyde: true,
      generate: function () { return steg; },
      render: function (s, ctx) {
        clear(ctx.stage);
        var box = el("div", { class: "nt-scene nt-ih" });
        if (s.k < 0) {
          box.appendChild(H("p", "small muted", "Seks hendelser. For hver ser du først hendelsen, så hvilke alarmer som går."));
        } else {
          var h = H5[s.k];
          box.appendChild(H("p", "nt-ih-t", "<b>Hendelse " + (s.k + 1) + ": " + h.t + "</b>"));
          box.appendChild(H("p", "small", h.d));
          ["Signaturbasert", "Anomalibasert"].forEach(function (n, j) {
            box.appendChild(H("p", "nt-ih-r", "<span class=\"nt-ih-n\">" + n + "</span> " + (s.skjul ? "<span class=\"muted\">?</span>" : h.a[j] ? "<span class=\"nt-alarm\">🔔 alarm</span>" : "<span class=\"muted\">ingen alarm</span>")));
          });
        }
        ctx.stage.appendChild(box);
      }
    });
  };

  /* ---------- Tor-løk ---------- */
  IN.nettTor = function (host) {
    host = host$(host); if (!host || !IN.stepPlayer) return null;
    var w = wrapPlayer(host);
    var noder = ["Nora", "X (inngang)", "Y (midt)", "Z (utgang)", "Petter"];
    var steg = [
      { pos: 0, lag: 3, ser: "Nora bygger pakken innenfra og ut: først laget for Z, så for Y, ytterst for X.",
        text: { eli5: "Nora legger brevet i tre låste esker inni hverandre. Den ytterste kan bare X åpne.", normal: "Nora krypterer tre ganger: innerst med nøkkelen hun deler med Z, så Y, ytterst X.", teknisk: "Avsenderen forhandler en nøkkel med hver node og krypterer lag for lag innenfra og ut. Ytterste lag tilhører første hopp." } },
      { pos: 1, lag: 2, ser: "X ser: Noras IP-adresse og at neste hopp er Y. Ikke mål, ikke innhold.",
        spor: { sporsmal: "X skreller av det ytterste laget. Hva får X vite?", valg: ["Noras IP-adresse og at neste hopp er Y", "At Petter er målet", "Innholdet i meldingen"], fasit: 0,
          forklaring: "Under det ytterste laget ligger to lag til. X kjenner bare forrige og neste hopp." },
        text: { eli5: "X åpner den ytterste esken. Inni står bare «send til Y».", normal: "Inngangsnoden skreller av sitt lag. Den kjenner Nora, men ikke hvem hun snakker med.", teknisk: "Inngangsnoden kjenner forrige hopp (brukeren) og neste hopp (Y). Målet ligger fortsatt under to lag." } },
      { pos: 2, lag: 1, ser: "Y ser: at pakken kom fra X og skal til Z. Verken Nora eller Petter.",
        text: { eli5: "Y åpner sin eske og ser «send til Z». Y vet ikke hvem som sendte eller hvem som skal ha det.", normal: "Midtnoden kjenner bare naboene sine.", teknisk: "Midtnoden binder ikke sammen kilde og mål; det er derfor det trengs minst tre hopp." } },
      { pos: 3, lag: 0, ser: "Z ser: målet (Petter) og, hvis forbindelsen er http, innholdet. Ikke Nora.",
        spor: { sporsmal: "Z skreller av det innerste Tor-laget. Hva ser Z?", valg: ["Noras IP-adresse", "Målet (Petter), og innholdet hvis forbindelsen er http", "Ingenting, alt er fortsatt kryptert"], fasit: 1,
          forklaring: "Det innerste laget er kryptert med nøkkelen Nora deler med Z, ikke med Petter. Bare TLS i tillegg skjuler innholdet for Z." },
        text: { eli5: "Z åpner den siste esken og leverer brevet til Petter. Z vet ikke at det kom fra Nora.", normal: "Utgangsnoden ser destinasjonen. Uten TLS ser den også innholdet.", teknisk: "Det innerste Tor-laget er kryptert med nøkkelen delt med Z, ikke med mottakeren. Ende-til-ende-vern mot Z krever TLS i tillegg." } },
      { pos: 4, lag: 0, ser: "Petter får pakken fra Z. Han ser Zs IP-adresse, ikke Noras.",
        text: { eli5: "Petter får brevet, men ser bare at Z kom med det.", normal: "Mottakeren ser utgangsnoden som avsender.", teknisk: "Ingen enkelt node kjenner både kilde og mål. Petter deler ingen Tor-nøkkel med Nora." } }
    ];
    var farge = ["nt-tx", "nt-ty", "nt-tz"];
    return IN.stepPlayer(w, {
      initial: [1], customInput: false, fastHoyde: true,
      generate: function () { return steg; },
      render: function (s, ctx) {
        clear(ctx.stage);
        var box = el("div", { class: "nt-scene" });
        var vei = el("div", { class: "nt-tor-vei" });
        noder.forEach(function (nn, i) { vei.appendChild(H("span", "nt-tor-n" + (i === s.pos ? " on" : ""), nn)); });
        box.appendChild(vei);
        var inner = H("span", "nt-tor-last", "til Petter: data");
        for (var k = 0; k < s.lag; k++) {
          var lagNr = k; // 0 = Z (innerst), 1 = Y, 2 = X (ytterst)
          var skall = el("span", { class: "nt-tor-skall " + farge[2 - lagNr] });
          skall.appendChild(H("span", "nt-tor-k", "🔒 " + ["Z", "Y", "X"][lagNr]));
          skall.appendChild(inner);
          inner = skall;
        }
        box.appendChild(el("div", { class: "nt-tor-pk" }, [inner]));
        box.appendChild(H("p", "nt-tor-ser small", s.ser));
        ctx.stage.appendChild(box);
      }
    });
  };

  /* ---------- Hvem ser hva: VPN og Tor (to matriser) ---------- */
  var JN = ["Ja", "Nei"];
  var SE_KOL = [
    { navn: "Ser innholdet", valg: JN },
    { navn: "Ser din IP-adresse", valg: JN },
    { navn: "Ser hvilket nettsted", valg: JN }
  ];
  IN.nettAnonym = function (host) {
    host = host$(host); if (!host || !IN.matrise) return null;
    clear(host);
    var hV = el("div", { class: "nt-mod" }), hT = el("div", { class: "nt-mod" });
    // Hver matrise får sin egen mellomtittel, så de to øvingene ikke flyter sammen
    host.appendChild(el("h5", { class: "nt-mod-h", text: "1. Sky-VPN: hvem ser hva?" }));
    host.appendChild(hV);
    host.appendChild(el("h5", { class: "nt-mod-h", text: "2. Tor: hvem ser hva?" }));
    host.appendChild(hT);
    var vpn = IN.matrise(hV, {
      id: "nett-mat-vpn",
      opphav: { type: "egen", kilder: ["nettverkslysarket s. 26–35"] },
      sporsmal: {
        eli5: "Du går på nett gjennom en låst gang til en VPN-tjeneste. Hvem kan se hva? Kryss av, og trykk «Sjekk svar».",
        normal: "Du bruker en sky-VPN og besøker et nettsted med TLS (https). Fyll ut hva hver aktør ser, og trykk «Sjekk svar». Prøv så bryteren.",
        teknisk: "Tunnel fra klient til VPN-tjenesten, TLS ende til ende til nettstedet. Hva ser hver aktør av innhold, kildeadresse og mål?"
      },
      rader: ["Internett-leverandøren (ISP)", "VPN-tilbyderen", "Nettstedet (målet)"],
      kolonner: SE_KOL,
      fasit: [["Nei", "Ja", "Nei"], ["Nei", "Ja", "Ja"], ["Ja", "Nei", "Ja"]],
      forklaring: {
        "0,0": "Alt mellom deg og VPN-tjenesten er kryptert i tunnelen.",
        "0,1": "ISP-en kobler deg til nettet, så den kjenner adressen din.",
        "0,2": "ISP-en ser bare at du snakker med VPN-tjenesten.",
        "1,0": "TLS går ende til ende gjennom tunnelen, så tilbyderen ser bare chiffertekst.",
        "1,1": "Tunnelen starter hos deg, så tilbyderen kjenner adressen din.",
        "1,2": "Tilbyderen sender trafikken videre og må kjenne målet. Du har flyttet tilliten fra ISP til tilbyderen.",
        "2,0": "Nettstedet er endepunktet der TLS termineres.",
        "2,1": "Nettstedet ser VPN-tjenestens adresse, ikke din.",
        "2,2": "Det er nettstedet selv."
      },
      brytere: [{ navn: "Nettstedet bruker ikke TLS (http)", endrer: function (f) { f[1][0] = "Ja"; return f; },
        forklaring: { "1,0": "Uten TLS slutter krypteringen i VPN-tjenesten. Derfra går trafikken i klartekst, og tilbyderen kan lese den." } }]
    });
    var tor = IN.matrise(hT, {
      id: "nett-mat-tor",
      opphav: { type: "egen", kilder: ["nettverkslysarket s. 26–35"] },
      sporsmal: {
        eli5: "Nå sender du gjennom tre stasjoner med tre låste esker. Hvem ser hva?",
        normal: "Du bruker Tor (inngang, midt, utgang) og besøker et nettsted med TLS. Fyll ut, sjekk, og prøv bryteren.",
        teknisk: "Tre lag løkkryptering mellom klient og utgangsnode, TLS ende til ende. Hva ser hver aktør?"
      },
      rader: ["Internett-leverandøren (ISP)", "Inngangsnoden", "Midtnoden", "Utgangsnoden", "Nettstedet (målet)"],
      kolonner: SE_KOL,
      fasit: [["Nei", "Ja", "Nei"], ["Nei", "Ja", "Nei"], ["Nei", "Nei", "Nei"], ["Nei", "Nei", "Ja"], ["Ja", "Nei", "Ja"]],
      forklaring: {
        "0,2": "ISP-en ser at du bruker Tor, men ikke hvor du skal. Går du via sky-VPN først, skjules Tor-bruken for ISP, men da ser VPN-tilbyderen den.",
        "1,1": "Inngangsnoden får pakken rett fra deg.",
        "1,2": "Under laget den skreller av, ligger to lag til. Den kjenner bare neste hopp.",
        "2,1": "Midtnoden kjenner bare naboene sine, inngangs- og utgangsnoden.",
        "2,2": "Midtnoden kjenner verken kilde eller mål.",
        "3,0": "Med TLS ser utgangsnoden bare chiffertekst.",
        "3,1": "Utgangsnoden ser midtnoden som avsender.",
        "3,2": "Utgangsnoden leverer pakken og må kjenne målet.",
        "4,1": "Nettstedet ser utgangsnodens adresse.",
        "4,0": "Nettstedet terminerer TLS."
      },
      brytere: [{ navn: "Nettstedet bruker ikke TLS (http)", endrer: function (f) { f[3][0] = "Ja"; return f; },
        forklaring: { "3,0": "Det innerste Tor-laget er kryptert med nøkkelen delt med utgangsnoden. Uten TLS leser utgangsnoden innholdet." } }]
    });
    return { vpn: vpn, tor: tor };
  };

  /* ---------- Hvem ser passordet? Figur + matrise ---------- */
  IN.nettHvemSer = function (host) {
    host = host$(host); if (!host) return null;
    clear(host);
    var stasjoner = ["Idas PC", "Wifi hjemme", "Hjemmeruter", "Teleoperatør", "Internett", "skole.example"];
    var folk = [
      { navn: "Ola", rolle: "skjermopptaker", pos: 0 },
      { navn: "Kari", rolle: "avlytter wifi", pos: 1 },
      { navn: "Per", rolle: "mann i midten", pos: 2 },
      { navn: "Even", rolle: "root på Pers maskin", pos: 2 },
      { navn: "Teleoperatøren", rolle: "frakter trafikken", pos: 3 },
      { navn: "Sara", rolle: "drifter tjeneren", pos: 5 }
    ];
    var vei = el("div", { class: "nt-hs", role: "img", "aria-label": "Veien fra Idas PC via wifi, hjemmeruter, teleoperatør og Internett til skole.example, med personene plassert langs veien" });
    stasjoner.forEach(function (st, i) {
      var col = el("div", { class: "nt-hs-col" });
      col.appendChild(H("div", "nt-hs-st", st));
      col.appendChild(H("div", "nt-hs-link" + (i === stasjoner.length - 1 ? " nt-hs-end" : " nt-hs-noy"), ""));
      folk.filter(function (p) { return p.pos === i; }).forEach(function (p) {
        col.appendChild(H("div", "nt-hs-p", "<b>" + p.navn + "</b><span class=\"small\">" + p.rolle + "</span>"));
      });
      vei.appendChild(col);
    });
    host.appendChild(vei);
    var mh = el("div");
    host.appendChild(mh);
    if (!IN.matrise) return null;
    var STED = ["Før krypteringen", "På strekningen", "Etter dekrypteringen"];
    return IN.matrise(mh, {
      id: "nett-mat-hvemser",
      opphav: { type: "egen", kilder: ["nettverkslysarket s. 10–25"], merknad: "Samme tankegang som Bobs passord i H2025 37, med andre personer" },
      sporsmal: {
        eli5: "Ida skriver passordet sitt. Hvem kan lese det? Finn først ut hvor hver person står: før låsen, på veien eller etter at låsen er åpnet.",
        normal: "Ida logger inn på https://skole.example. HSTS er satt, og det er ikke første besøk. Fyll ut begge kolonnene for hver person, og trykk «Sjekk». Prøv så bryterne.",
        teknisk: "TLS fra Idas nettleser til tjeneren, HSTS husket. Plasser hver aktør relativt til TLS-endepunktene, og avgjør om de ser klarteksten."
      },
      rader: ["Ola (skjermopptaker på Idas PC)", "Kari (avlytter Idas wifi)", "Per (mann i midten mellom ruteren og teleoperatøren)", "Even (har hacket Pers maskin som root)", "Teleoperatøren", "Sara (drifter skole.example-tjeneren)"],
      kolonner: [{ navn: "Hvor står personen?", valg: STED }, { navn: "Ser passordet?", valg: JN }],
      fasit: [[STED[0], "Ja"], [STED[1], "Nei"], [STED[1], "Nei"], [STED[1], "Nei"], [STED[1], "Nei"], [STED[2], "Ja"]],
      forklaring: {
        "0,1": "Opptakeren fanger det Ida skriver før nettleseren krypterer.",
        "1,1": "TLS krypterer allerede i nettleseren. Wifi-avlytteren ser bare chiffertekst.",
        "2,1": "HSTS og et tidligere besøk gjør at nettleseren aldri prøver http, og Per kan ikke vise et gyldig sertifikat. Han ser bare chiffertekst.",
        "3,1": "Even får aldri mer enn Per har, og Per har bare chiffertekst.",
        "4,1": "Teleoperatøren står på strekningen.",
        "5,1": "TLS termineres på tjeneren, så passordet ligger i klartekst der."
      },
      brytere: [
        { navn: "Første besøk uten HSTS: Per stripper TLS", endrer: function (f) { f[1][1] = "Ja"; f[2][1] = "Ja"; f[3][1] = "Ja"; return f; },
          forklaring: { "1,1": "Kari står mellom Ida og Per, der trafikken nå går over http.", "2,1": "Per holder Ida på http og snakker https med tjeneren selv. Ida sender passordet til ham i klartekst.", "3,1": "Even får alt Per får, og Per ser klarteksten.", "4,1": "Teleoperatøren står etter Per, der Per selv bruker https mot tjeneren: bare chiffertekst." } },
        { navn: "Ingen TLS i det hele tatt (http)", endrer: function (f) { for (var r = 0; r < f.length; r++) f[r][1] = "Ja"; return f; },
          forklaring: { "1,1": "Uten kryptering ser alle på strekningen alt.", "2,1": "Uten kryptering ser alle på strekningen alt.", "3,1": "Per ser alt, og Even får det Per får.", "4,1": "Uten kryptering ser alle på strekningen alt." } }
      ]
    });
  };

  /* ---------- Egg, løk og zero trust (stegspiller med spor) ---------- */
  IN.nettLagmodell = function (host) {
    host = host$(host); if (!host || !IN.stepPlayer) return null;
    var w = wrapPlayer(host);
    var modeller = [
      { navn: "Egg (skall)", sjekk: ["Ytre brannmur", "Elev-PC (innsiden)", "Elevregisteret"], stopp: null },
      { navn: "Løk (lagdelt)", sjekk: ["Ytre brannmur", "Elev-PC (innsiden)", "Indre brannmur + NIDS", "Elevregisteret"], stopp: 2 },
      { navn: "Zero trust", sjekk: ["Ytre brannmur", "Elev-PC (innsiden)", "Krav om gyldig identitet", "Elevregisteret"], stopp: 2 }
    ];
    var steg = [
      { t: 0, text: { eli5: "En tyv vil inn til arkivet med elevopplysninger.", normal: "Angriperen sender en phishing-e-post til en elev.", teknisk: "Utgangspunkt: angriperen er utenfor perimeteren, og den ytre brannmuren slipper ikke inn uønsket trafikk." } },
      { t: 1, text: { eli5: "Eleven trykker på lenken. Nå er tyven inne i huset uten å ha gått forbi vakten ved porten.", normal: "Phishingen gir fotfeste på en elev-PC. Den ytre brannmuren ble aldri utfordret: trafikken gikk ut fra innsiden.", teknisk: "Fotfeste på innsiden. Perimeterforsvaret hjelper ikke lenger; spørsmålet er hva som hindrer lateral bevegelse." } },
      { t: 2, spor: { sporsmal: "Angriperen har fotfeste på en elev-PC og prøver å nå elevregisteret. I hvilke modeller lykkes han? Kryss av alt som passer.", valg: ["Egg (skall)", "Løk (lagdelt)", "Zero trust"], fasit: [0],
          forklaring: "Bare egget har en flat innside uten flere kontroller." },
        text: { eli5: "I egget er alt mykt inni: tyven går rett til arkivet. I løken møter han en ny dør med vakt. I zero trust må han vise kort, og det har han ikke.", normal: "Egg: flatt innside, elev-PC når elevregisteret direkte. Løk: indre brannmur stopper, og NIDS i sonen varsler. Zero trust: forespørselen uten gyldig identitet avvises allerede ved første forsøk.", teknisk: "Lagdelt forsvar gjør at ett brutt lag ikke er nok. Zero trust går lenger: hver forespørsel autentiseres og autoriseres uansett nettverksplassering, med minste privilegium. Lateral bevegelse blir dyr." } },
      { t: 3, text: { eli5: "Bare i egget fikk tyven tak i arkivet.", normal: "Bare skallmodellen tapte dataene.", teknisk: "Konklusjon: «innsiden er trygg» er antakelsen som gjør skallmodellen sårbar for phishing og innsidere." } }
    ];
    return IN.stepPlayer(w, {
      initial: [1], customInput: false,
      generate: function () { return steg; },
      render: function (s, ctx) {
        clear(ctx.stage);
        var g = el("div", { class: "nt-forsvar" });
        modeller.forEach(function (m) {
          var col = el("div", { class: "nt-fv-col" });
          col.appendChild(H("div", "nt-fv-h", m.navn));
          var naa = s.t === 0 ? -1 : s.t === 1 ? 1 : (m.stopp == null ? m.sjekk.length - 1 : m.stopp);
          m.sjekk.forEach(function (c, i) {
            var cls = "nt-fv-c";
            if (i === naa) cls += (m.stopp === i ? " nt-stopp" : i === m.sjekk.length - 1 ? " nt-tapt" : " nt-her");
            else if (i < naa && i > 0) cls += " nt-forbi";
            col.appendChild(H("div", cls, (i === naa ? (m.stopp === i ? "⛔ " : "🔴 ") : "") + c));
          });
          g.appendChild(col);
        });
        ctx.stage.appendChild(g);
      }
    });
  };

  /* ---------- Verktøyene i lagene: sammenligning ---------- */
  IN.nettForsvar = function (host) {
    host = host$(host); if (!host || !IN.matrise) return null;
    clear(host);
    var SV = ["Ser bare hodene: angrep på en tillatt port slipper gjennom",
      "Varsler bare: noen må reagere",
      "Falske alarmer kan blokkere legitim trafikk",
      "Ser ikke inn i kryptert trafikk uten å bryte TLS"];
    return IN.matrise(host, {
      id: "nett-mat-forsvar",
      opphav: { type: "egen", kilder: ["nettverkslysarket s. 36–71"] },
      sporsmal: {
        eli5: "Fem vakter med ulike jobber. Hvem kan stoppe noen selv, hvem leser brevene, og hvem husker hvem som har vært innom?",
        normal: "Sammenlign verktøyene som brukes i lagdelt forsvar: stopper verktøyet trafikk selv, kan det lese innholdet (brukerdataene), og husker det forbindelser (økter)? Fyll ut, og trykk «Sjekk svar». Celler merket som ikke telt, har ingen fasit i kurset.",
        teknisk: "Sammenlign pakkefilter, tilstandsbasert brannmur, applikasjonsbrannmur/proxy, IDS og IPS etter inngrep, innsyn i nyttelast, tilstand og typisk svakhet."
      },
      rader: ["Pakkefilter (tilstandsløs brannmur)", "Tilstandsbasert brannmur", "Applikasjonsbrannmur / proxy", "IDS (for eksempel Snort)", "IPS"],
      kolonner: [
        { navn: "Stopper selv", valg: JN },
        { navn: "Leser innhold", valg: JN },
        { navn: "Husker økter", valg: JN },
        { navn: "Typisk svakhet", valg: SV }
      ],
      fasit: [
        ["Ja", "Nei", "Nei", SV[0]],
        ["Ja", "Nei", "Ja", SV[0]],
        ["Ja", "Ja", "Ja", SV[3]],
        ["Nei", "Ja", null, [SV[1], SV[3]]],
        ["Ja", "Ja", null, SV[2]]
      ],
      forklaring: {
        "0,1": "Et pakkefilter ser bare hodene i transport- og internettlaget: adresse, port og protokoll.",
        "0,2": "Tilstandsløst: hver pakke vurderes alene, så svarpakker trenger egne regler.",
        "0,3": "Er porten tillatt, slipper innholdet gjennom, uansett hva det er.",
        "1,2": "Den husker hver forbindelse og godtar pakker som hører til en kjent økt (H2022 7.3).",
        "1,3": "Den ser fortsatt bare hodene.",
        "2,1": "Den leser brukerdataene og kan for eksempel stoppe én tjeneste, men ikke resten av HTTPS-trafikken.",
        "2,2": "En proxy holder selv begge forbindelsene, så den må kjenne øktene.",
        "2,3": "For å lese HTTPS må den bryte TLS (TLS-inspeksjon). Ellers ser den bare chiffertekst.",
        "3,0": "En IDS oppdager og varsler. Den griper ikke inn selv.",
        "3,1": "En signaturbasert IDS trenger ofte å se innholdet, og TLS gjør den derfor svakere.",
        "3,2": "Ikke telt: kurset sier ikke noe om dette.",
        "3,3": "Begge godtas: den varsler bare, og den ser ikke innholdet i TLS-trafikk.",
        "4,0": "En IPS legger inn regler og blokkerer selv.",
        "4,2": "Ikke telt: kurset sier ikke noe om dette.",
        "4,3": "Falske alarmer stopper legitim trafikk, og en angriper kan forfalske avsenderen så en uskyldig blir blokkert. Det rammer tilgjengeligheten."
      },
      regel: { riktig: 1, feil: 0, blankt: 0, min: 0 }
    });
  };

  /* ---------- Scenario: IDS-alarmer under en avtalt pentest ---------- */
  IN.nettScenarioPentest = function (host) {
    host = host$(host); if (!host || !IN.scenario) return null;
    clear(host);
    return IN.scenario(host, {
      id: "nett-scen-pentest",
      opphav: { type: "egen", kilder: ["pentestlysarket s. 6", "nettverkslysarket s. 56–71"] },
      tittel: "Du er på vakt i sikkerhetsteamet. Denne uka er det avtalt pentest.",
      start: "alarm",
      noder: {
        alarm: {
          tekst: {
            eli5: "<p>Denne uka har firmaet leid inn folk som skal prøve å bryte seg inn, med lov og skriftlig avtale. Tirsdag morgen piper alarmen: noen kartlegger nettet. Det kommer fra adressen testerne sa de skulle bruke.</p>",
            normal: "<p>Virksomheten har en avtalt pentest denne uka: skriftlig avtale, tidsrom mandag–fredag 08–16, og testerne går ut fra én oppgitt IP-adresse. Tirsdag kl. 10.15 gir NIDS-en en rekke alarmer om kartlegging av det indre nettet fra den adressen.</p>",
            teknisk: "<p>Avtalt pentest: skriftlig omfang, tidsvindu man–fre 08–16 og én oppgitt kildeadresse. Tirsdag 10.15: NIDS-alarmer om skanning av det indre segmentet fra testernes adresse.</p>"
          },
          valg: [
            { tekst: "Sjekk alarmene mot avtalen: kildeadresse, tidsrom og hvilke systemer som er med", til: "sjekk", poeng: 2,
              konsekvens: "Alarmene passer med avtalen. Du har bekreftet det mot noe skriftlig i stedet for å anta." },
            { tekst: "Slå av alarmene resten av uka, det er jo pentest", til: "blind", poeng: -2, kit: { K: "truet", I: "truet" },
              konsekvens: "Overvåkingen er blind hele uka. En ekte angriper kan gjemme seg i støyen." },
            { tekst: "Blokker adressen med IPS-en med en gang", til: "blokk", poeng: 0, kit: { T: "truet" },
              konsekvens: "Testen stopper opp, og kunden får mindre igjen for den. Kontakt testlederen før du griper inn i en avtalt test." }
          ]
        },
        blokk: {
          tekst: "<p>Testlederen ringer: testen har stoppet. Hva gjør du?</p>",
          valg: [
            { tekst: "Opphev blokkeringen innenfor avtalens tidsrom, og sjekk videre alarmer mot avtalen", til: "sjekk", poeng: 1, kit: { T: "ok" },
              konsekvens: "Testen fortsetter, og du kontrollerer fortsatt hver alarm mot avtalen." },
            { tekst: "Legg testernes adresse på en permanent hviteliste i IDS-en", til: "hvit", poeng: -2, kit: { T: "ok", I: "truet" },
              konsekvens: "Etter testen varsles aldri trafikk fra den adressen. Blir den misbrukt senere, ser ingen det." }
          ]
        },
        sjekk: {
          tekst: "<p>Kl. 14.40 kommer nye alarmer: innloggingsforsøk mot lønnssystemet fra en annen intern maskin. Lønnssystemet står ikke i avtalen, og adressen er ikke testernes.</p>",
          valg: [
            { tekst: "Behandle det som en ekte hendelse: ring testlederen for å utelukke testen, og følg hendelsesrutinen", til: "ekte", poeng: 2, kit: { K: "truet" },
              konsekvens: "Testlederen bekrefter at det ikke er dem. Du startet håndteringen tidlig." },
            { tekst: "Anta at testerne har gått litt utenfor avtalen", til: "antatt", poeng: -2, kit: { K: "brutt" },
              konsekvens: "Det var en ekte angriper som brukte pentest-uka som dekke. Lønnsdata er lekket." }
          ]
        },
        ekte: {
          tekst: "<p>Hendelsen er under kontroll. En kollega vil nå trene den nye anomalibaserte IDS-en på trafikken fra denne uka, «siden den er så variert».</p>",
          valg: [
            { tekst: "Nei: tren på en periode uten pentest og uten kjente angrep", til: "bra", poeng: 2, kit: { K: "ok", I: "ok", T: "ok" },
              konsekvens: "Modellen lærer ekte normal trafikk og varsler om kartlegging senere." },
            { tekst: "Ja, mer variasjon gir en bedre modell", til: "forgiftet", poeng: -2, kit: { I: "truet" },
              konsekvens: "Modellen lærer at kartlegging og innloggingsforsøk er normalt, og varsler ikke om dem senere (H2025 21)." }
          ]
        },
        bra: { slutt: true, oppsummering: "<p>Godt håndtert. Under en pentest er alarmene forventet, men bare innenfor avtalen. Alt utenfor omfang, tidsrom eller testernes adresse behandles som ekte. En anomalibasert IDS trenes aldri mens det pågår test eller angrep.</p>" },
        forgiftet: { slutt: true, oppsummering: "<p>Hendelsen ble håndtert, men IDS-en er nå trent på angrepstrafikk. Den har lært at kartlegging er normalt, og ekte angrep av samme type gir ikke alarm senere.</p>" },
        antatt: { slutt: true, oppsummering: "<p>En pentest er ikke en grunn til å anta at alle alarmer er testerne. Det som ligger utenfor avtalen, skal behandles som ekte til det motsatte er bekreftet.</p>" },
        blind: { slutt: true, oppsummering: "<p>Uten overvåking er det umulig å skille testerne fra en ekte angriper. Alarmene skal sjekkes mot avtalen, ikke slås av.</p>" },
        hvit: { slutt: true, oppsummering: "<p>Testen kom i gang igjen, men den permanente hvitelisten er et nytt hull. Unntak for testere skal være tidsbegrenset og følge avtalen.</p>" }
      },
      avslutt: { fritekst: {
        sporsmal: "Skriv kort hvordan sikkerhetsteamet bør håndtere IDS-alarmer under en avtalt pentest.",
        sjekkliste: [
          "Hver alarm sjekkes mot den skriftlige avtalen: omfang, tidsrom og testernes adresser",
          "Alarmer utenfor avtalen behandles som ekte hendelser",
          "Teamet har en kontaktperson hos testerne og tar kontakt før de griper inn",
          "Overvåkingen slås ikke av, og testerne hvitelistes ikke permanent",
          "En anomalibasert IDS trenes ikke på trafikk fra pentesten"
        ]
      } }
    });
  };

  /* ---------- Scenario: Bobs passord (H2025 37), forsvarersiden ---------- */
  IN.nettScenarioBob = function (host) {
    host = host$(host); if (!host || !IN.scenario) return null;
    clear(host);
    return IN.scenario(host, {
      id: "nett-scen-bob",
      opphav: { type: "eksamen", variantAv: "H2025-37", kilder: ["nettverkslysarket s. 10–25"], merknad: "Spørsmålene om tiltak etterpå er laget for guiden" },
      tittel: "Du er sikkerhetsrådgiver i Bob Inc. Situasjonen er den fra H2025 oppgave 37.",
      start: "hvem",
      noder: {
        hvem: {
          tekst: {
            eli5: "<p>Bob har skrevet det ekte passordet sitt på en nettside som sier om passordet er sterkt. Siden har lås (TLS og HSTS), og Bob har vært der før.</p><ul><li>Emma har et program på Bobs PC som tar opp alle tastetrykk.</li><li>Kjersti lytter på wifi.</li><li>Tomas og Frank står midt i ledningen, og Jørgen og Matias har brutt seg inn hos dem.</li><li>Gunnar driver telefonselskapets utstyr.</li><li>Stine eier nettsiden.</li></ul><p>Bob spør: «Hvem kan ha passordet mitt nå?»</p>",
            normal: "<p>Bob har tastet inn sitt ekte passord på Stines side for å sjekke passordstyrke. Siden har TLS og HSTS, og Bob har brukt den før med samme nettleser.</p><ul><li>Emma har keylogger på Bobs maskin.</li><li>Kjersti avlytter wifi.</li><li>Tomas er mann i midten i Bobs nett, og Jørgen har hacket Tomas' maskin (uten admin).</li><li>Gunnar driver teleleverandørens utstyr.</li><li>Frank er mann i midten i Stines nett, og Matias har root på Franks maskin.</li><li>Stine eier serveren.</li></ul><p>Bob spør: «Hvem kan ha passordet mitt nå?»</p>",
            teknisk: "<p>TLS fra Bobs nettleser til Stines server, HSTS husket fra tidligere besøk. Aktører:</p><ul><li>keylogger på klienten (Emma),</li><li>passiv avlytting av wifi (Kjersti),</li><li>MitM i begge nett (Tomas, Frank),</li><li>kompromitterte MitM-maskiner (Jørgen uten admin, Matias med root),</li><li>teleoperatør (Gunnar) og</li><li>servereieren (Stine).</li></ul><p>Hvem har klarteksten?</p>"
          },
          valg: [
            { tekst: "Emma og Stine", til: "tiltak", poeng: 3, kit: { K: "brutt" },
              konsekvens: "Riktig. Emma fanger tastene før TLS krypterer. Stine eier serveren der TLS termineres og scriptet leser passordet i klartekst. Alle de andre står på strekningen og ser bare chiffertekst." },
            { tekst: "Bare Stine: keyloggeren ser jo bare krypterte data", til: "tiltak", poeng: 0, kit: { K: "brutt" },
              konsekvens: "Ikke riktig. Keyloggeren sitter før krypteringen og ser tastetrykkene i klartekst. Emma har passordet også." },
            { tekst: "Emma, Stine, Tomas og Frank: en mann i midten ser alt", til: "tiltak", poeng: -1, kit: { K: "brutt" },
              konsekvens: "Nei. Med TLS ser en mann i midten bare chiffertekst. HSTS og et tidligere besøk gjør at Tomas og Frank verken kan nedgradere til http eller få Bob til å godta et falskt sertifikat. Bare Emma og Stine har passordet." },
            { tekst: "Ingen: TLS og HSTS beskytter passordet", til: "tiltak", poeng: -1, kit: { K: "brutt" },
              konsekvens: "Nei. TLS beskytter bare på veien. Emma (før krypteringen) og Stine (etter dekrypteringen) har passordet." }
          ]
        },
        tiltak: {
          tekst: "<p>Passordet er kompromittert. Hva gjør du først?</p>",
          valg: [
            { tekst: "Bytt passordet fra en annen, ren maskin, og la IT undersøke og rense Bobs maskin", til: "logg", poeng: 2, kit: { K: "truet" },
              konsekvens: "Emma får ikke med seg det nye passordet, og keyloggeren blir funnet og fjernet." },
            { tekst: "Bytt passordet med en gang fra Bobs egen maskin", til: "logg", poeng: 0, kit: { K: "brutt" },
              konsekvens: "Keyloggeren fanger det nye passordet også. Byttet hjelper ikke mot Emma før maskinen er renset." },
            { tekst: "Vent til det planlagte passordbyttet om seks måneder", til: "vent", poeng: -2, kit: { K: "brutt", I: "truet" },
              konsekvens: "Emma og Stine kan bruke passordet i et halvt år. Faste bytter hjelper ikke når passordet allerede er gitt bort." }
          ]
        },
        logg: {
          tekst: "<p>Det nye passordet er satt. Hva mer bør gjøres?</p>",
          valg: [
            { tekst: "Gå gjennom innloggingsloggene for Bobs konto bakover i tid, og slå på flerfaktorautentisering", til: "laer", poeng: 2, kit: { K: "ok", I: "ok" },
              konsekvens: "Du ser om passordet er misbrukt, og et stjålet passord alene er ikke lenger nok." },
            { tekst: "Be Stine slette passordet fra serveren sin", til: "laer", poeng: 0,
              konsekvens: "Du kan ikke kontrollere om hun gjør det. Gå ut fra at passordet er kjent, og sjekk loggene." }
          ]
        },
        laer: {
          tekst: "<p>Hvordan hindrer dere at dette skjer igjen?</p>",
          valg: [
            { tekst: "Regel: ekte passord skrives aldri inn på andres nettsider. Bruk passordbehandler og flerfaktor", til: "bra", poeng: 2,
              konsekvens: "Et passord som aldri forlater virksomhetens egne systemer, kan ikke leses av en fremmed servereier." },
            { tekst: "Krev at alle nettsider de ansatte bruker, har TLS og HSTS", til: "halv", poeng: 0,
              konsekvens: "Stines side hadde allerede begge. TLS sier ingenting om hvem som står i den andre enden, eller om din egen maskin er ren." }
          ]
        },
        bra: { slutt: true, oppsummering: "<p>Godt håndtert. Kjernen: TLS gir ende-til-ende-kryptering mellom nettleseren og serveren, så passordet finnes i klartekst bare i endene. Den som sitter før krypteringen (keylogger) eller eier serveren, kan lese det. Alle på strekningen ser bare chiffertekst.</p>" },
        halv: { slutt: true, oppsummering: "<p>Delvis. Hendelsen er ryddet opp, men tiltaket for framtiden treffer ikke problemet: en gyldig TLS-forbindelse sier ingenting om at mottakeren er ærlig.</p>" },
        vent: { slutt: true, oppsummering: "<p>Passordet er kjent for to personer, og keyloggeren sitter fortsatt på Bobs maskin. Et kompromittert passord byttes med en gang, fra en maskin du vet er ren.</p>" }
      },
      avslutt: { fritekst: {
        sporsmal: "Skriv svaret på H2025 37 slik du ville gjort på eksamen (9 p): hvem kan få Bobs passord, og hvorfor eller hvorfor ikke, per person eller gruppe.",
        sjekkliste: [
          "Emma får passordet: keyloggeren fanger tastetrykkene før TLS krypterer (1 + 2 p)",
          "Stine får passordet: serveren hennes terminerer TLS og ser klarteksten (1 + 2 p)",
          "Kjersti, Tomas, Jørgen, Gunnar, Frank og Matias ser bare TLS-kryptert tekst (0,5 p-poster)",
          "Ende-til-ende-kryptering er nevnt, med ord eller forklaring (1 p)",
          "HSTS og «ikke første besøk» forklarer hvorfor Tomas og Frank ikke kan strippe TLS",
          "Jørgen og Matias får aldri mer enn det Tomas og Frank har"
        ]
      } }
    });
  };
})();
