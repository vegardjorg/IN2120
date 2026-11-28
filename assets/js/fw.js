/* ============================================================
   IN2120 guide · fw.js  (iptables: tolking, fargekoding, forklaring og steg for steg)

   IN.fw.parse(tekst) → { regler: [{ nr, kjede, p, s, d, dport, sport, j, raw }], policy: { KJEDE: "DROP" } }
       Tåler eksamensarkets skrivemåte: tankestrek (–A, -–dport), små bokstaver (accept/drop)
       og linjenummer foran («1  iptables …»).
   IN.fw.evaluer(regler, pakke, policy) → { hit, j, res }   første treff vinner, ellers policy
   IN.fw.dekker(a, b) → bool       regel a tar alle pakker regel b kan treffe (samme kjede)
   IN.fw.portNavn(port) → "SSH" | null   standardportene fra nettverkslysarket (s. 44)
   IN.fw.beskriv(regler, opts) → [{ nr, html, merk: [html] }]   hva hver regel gjør, med feller
   IN.fw.farge(root?)              fargekoder alle <pre> med iptables + IP-er og porter i teksten rundt
   IN.fw.steg(host, cfg)           steg for steg: én pakke nedover regelsettet (stepPlayer)
   IN.fw.eksamen(host, cfg, d)     «Hva gjør reglene?» + steg for steg (eksamenskortets Løsning, losViz)

   Fargene (fw.css): kjede, protokoll, port og ACCEPT/DROP har hver sin farge; hver IP-adresse får
   sin egen farge innenfor et område (eksamenskortet, en callout eller [data-fw-scope]), så samme
   adresse har samme farge i regler, pakker og forklaringer. Farge er aldri eneste signal:
   IP-er står i fet skrift, porter har tooltip med tjenesten, og ACCEPT/DROP står som ord.
   ============================================================ */
(function () {
  "use strict";
  var IN = (window.IN = window.IN || {});
  var FW = (IN.fw = IN.fw || {});

  /* ---------- Standardporter (nettverkslysarket s. 44, «Standardporter kjente tjenester») ---------- */
  var TJ = [
    { navn: "HTTP", port: 80, p: "tcp" }, { navn: "HTTPS", port: 443, p: "tcp" },
    { navn: "SSH", port: 22, p: "tcp" }, { navn: "Telnet", port: 23, p: "tcp" },
    { navn: "FTP", port: 21, p: "tcp" }, { navn: "SMTP", port: 25, p: "tcp" },
    { navn: "DNS", port: 53, p: "udp" }, { navn: "SMB", port: 445, p: "tcp" },
    { navn: "RDP", port: 3389, p: "tcp" }
  ];
  FW.TJENESTER = TJ;
  FW.portNavn = function (port) {
    for (var i = 0; i < TJ.length; i++) if (String(TJ[i].port) === String(port)) return TJ[i].navn;
    return null;
  };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  // Tankestreker og minustegn fra arket → bindestrek
  function norm(t) { return String(t).replace(/[‐-―−]/g, "-"); }
  function flagg(t) { return norm(t).replace(/^-{2,}/, "--"); }

  /* ---------- Tolking ---------- */
  FW.parse = function (tekst) {
    var regler = [], policy = {};
    String(tekst || "").split(/\r?\n/).forEach(function (linje) {
      var l = norm(linje).trim(), nr = null;
      var m = l.match(/^(\d+)[.)]?\s+(?=iptables\b)/);
      if (m) { nr = +m[1]; l = l.slice(m[0].length); }
      if (!/^iptables\b/.test(l)) return;
      var t = l.split(/\s+/).slice(1), r = { nr: nr, raw: linje.trim() };
      for (var k = 0; k < t.length; k++) {
        var f = flagg(t[k]), v = t[k + 1];
        if (f === "-A" || f === "--append") { r.kjede = String(v || "").toUpperCase(); k++; }
        else if (f === "-P" || f === "--policy") { policy[String(v || "").toUpperCase()] = String(t[k + 2] || "").toUpperCase(); r = null; break; }
        else if (f === "-s" || f === "--source") { r.s = v; k++; }
        else if (f === "-d" || f === "--destination") { r.d = v; k++; }
        else if (f === "-p" || f === "--protocol") { r.p = String(v || "").toLowerCase(); k++; }
        else if (f === "--dport" || f === "--destination-port") { r.dport = /^\d+$/.test(v) ? +v : v; k++; }
        else if (f === "--sport" || f === "--source-port") { r.sport = /^\d+$/.test(v) ? +v : v; k++; }
        else if (f === "-j" || f === "--jump") { r.j = String(v || "").toUpperCase(); k++; }
        else if (f === "-i" || f === "-o") { r[f.slice(1)] = v; k++; }
        else (r.ukjent = r.ukjent || []).push(t[k]);
      }
      if (r) regler.push(r);
    });
    regler.forEach(function (r, i) { if (r.nr == null) r.nr = i + 1; });
    return { regler: regler, policy: policy };
  };

  /* ---------- Treff ---------- */
  function ipInt(ip) {
    var p = String(ip).split(".");
    if (p.length !== 4) return null;
    var n = 0;
    for (var i = 0; i < 4; i++) { if (!/^\d{1,3}$/.test(p[i]) || +p[i] > 255) return null; n = n * 256 + (+p[i]); }
    return n;
  }
  function cidr(v) {
    var d = String(v).split("/"), a = ipInt(d[0]);
    return a == null ? null : { a: a, bits: d[1] == null ? 32 : +d[1] };
  }
  function iSammeNett(a, b, bits) { if (bits <= 0) return true; var div = Math.pow(2, 32 - bits); return Math.floor(a / div) === Math.floor(b / div); }
  function ipTreff(rv, pv) {
    if (pv == null) return false;
    var r = cidr(rv), p = ipInt(pv);
    if (!r || p == null) return String(rv) === String(pv);
    return iSammeNett(r.a, p, r.bits);
  }
  function portOmr(v) { var m = String(v).match(/^(\d+):(\d+)$/); return m ? [+m[1], +m[2]] : /^\d+$/.test(String(v)) ? [+v, +v] : null; }
  function portTreff(rv, pv) {
    if (pv == null) return false;
    var o = portOmr(rv);
    return o ? +pv >= o[0] && +pv <= o[1] : String(rv) === String(pv);
  }
  var FELT = [
    { k: "kjede", f: "-A", navn: "kjede" }, { k: "p", f: "-p", navn: "protokoll" },
    { k: "s", f: "-s", navn: "kilde" }, { k: "d", f: "-d", navn: "mål" },
    { k: "dport", f: "--dport", navn: "målport" }
  ];
  FW.FELT = FELT;
  function felt(r, pk, k) {
    if (r[k] == null) return "any";
    if (k === "s" || k === "d") return ipTreff(r[k], pk[k]) ? "ja" : "nei";
    if (k === "dport") return portTreff(r[k], pk.dport) ? "ja" : "nei";
    return String(r[k]).toUpperCase() === String(pk[k] || "").toUpperCase() ? "ja" : "nei";
  }
  FW.felt = felt;
  FW.evaluer = function (regler, pk, policy) {
    for (var i = 0; i < regler.length; i++) {
      var res = FELT.map(function (f) { return felt(regler[i], pk, f.k); });
      if (res.indexOf("nei") < 0) return { hit: i, j: regler[i].j, res: res };
    }
    return { hit: -1, j: policy || "ACCEPT", res: null };
  };
  // a dekker b: hver pakke som treffer b, treffer også a
  FW.dekker = function (a, b) {
    if (String(a.kjede) !== String(b.kjede)) return false;
    if (a.p != null && a.p !== b.p) return false;
    var ok = ["s", "d"].every(function (k) {
      if (a[k] == null) return true;
      if (b[k] == null) return false;
      var x = cidr(a[k]), y = cidr(b[k]);
      if (!x || !y) return String(a[k]) === String(b[k]);
      return x.bits <= y.bits && iSammeNett(x.a, y.a, x.bits);
    });
    if (!ok) return false;
    if (a.dport == null) return true;
    if (b.dport == null) return false;
    var oa = portOmr(a.dport), ob = portOmr(b.dport);
    return oa && ob ? oa[0] <= ob[0] && oa[1] >= ob[1] : String(a.dport) === String(b.dport);
  };

  /* ---------- Fargeskjema ---------- */
  var ANT_IP = 5;
  function kartFor(sc) { if (!sc._fwKart) sc._fwKart = { n: 0, ip: {} }; return sc._fwKart; }
  function ipNr(ip, kart) {
    var key = String(ip);
    if (!kart) return 0;
    if (kart.ip[key] == null) kart.ip[key] = kart.n++ % ANT_IP;
    return kart.ip[key];
  }
  function sp(cls, txt, extra) { return "<span class=\"" + cls + "\"" + (extra || "") + ">" + esc(txt) + "</span>"; }
  function ipH(ip, kart) { return sp("fw-ip fw-ip-" + ipNr(ip, kart), ip); }
  function portTittel(port) {
    var n = FW.portNavn(port);
    return n ? "Port " + port + " = " + n + " (standardport)" : "Port " + port;
  }
  function portH(port) { return sp("fw-port", port, " title=\"" + esc(portTittel(port)) + "\""); }
  function portMedNavn(port) { var n = FW.portNavn(port); return portH(port) + (n ? " (" + esc(n) + ")" : ""); }
  function jH(j) { var u = String(j || "").toUpperCase(); return sp(u === "ACCEPT" ? "fw-acc" : u === "DROP" || u === "REJECT" ? "fw-drop" : "fw-k", u); }
  function kjedeH(k) { return sp("fw-k", k); }
  function protoH(p) { return sp("fw-p", String(p).toUpperCase()); }
  FW.html = { ip: ipH, port: portH, portNavn: portMedNavn, j: jH, kjede: kjedeH, proto: protoH };

  /* Én regellinje som farget HTML. Tekstene står slik de er (også tankestreker og små bokstaver). */
  function fargLinje(linje, kart) {
    if (!/iptables/.test(linje)) return esc(linje);
    var deler = linje.split(/(\s+)/), forrige = null, ut = [];
    deler.forEach(function (t) {
      if (t === "" || /^\s+$/.test(t)) { ut.push(t); return; }
      var f = flagg(t);
      if (/^-{1,2}[A-Za-z][\w-]*$/.test(f)) { ut.push(sp("fw-f", t)); forrige = f; return; }
      var h;
      if (forrige === "-A" || forrige === "--append" || forrige === "-P" || forrige === "--policy") h = sp("fw-k", t);
      else if (forrige === "-P2") h = jH(t);
      else if (forrige === "-p" || forrige === "--protocol") h = sp("fw-p", t);
      else if (forrige === "-s" || forrige === "-d" || forrige === "--source" || forrige === "--destination") h = ipH(t, kart);
      else if (forrige === "--dport" || forrige === "--sport" || forrige === "--destination-port" || forrige === "--source-port") h = portH(t);
      else if (forrige === "-j" || forrige === "--jump") h = sp(/^accept$/i.test(t) ? "fw-acc" : /^(drop|reject)$/i.test(t) ? "fw-drop" : "fw-k", t);
      else if (t === "iptables") h = sp("fw-cmd", t);
      else if (/^\d+[.)]?$/.test(t) && !ut.join("").replace(/\s+/g, "")) h = sp("fw-nr", t);
      else h = esc(t);
      ut.push(h);
      forrige = forrige === "-P" || forrige === "--policy" ? "-P2" : null;
    });
    return ut.join("");
  }
  FW.fargLinje = fargLinje;

  /* ---------- Hva gjør reglene? ---------- */
  var KJEDE_TXT = { FORWARD: "gjennom brannmuren", INPUT: "til brannmuren selv", OUTPUT: "fra brannmuren selv" };
  FW.beskriv = function (regler, opts) {
    opts = opts || {};
    var kart = opts.kart || null;
    var hovedkjede = opts.kjede || (regler.some(function (r) { return r.kjede === "FORWARD"; }) ? "FORWARD" : null);
    var ut = regler.map(function (r, i) {
      var subj = r.p ? (r.dport == null ? "All " + protoH(r.p) : protoH(r.p)) : (r.dport == null ? "All trafikk" : "Trafikk");
      var h = subj;
      if (r.s != null) h += " fra " + ipH(r.s, kart);
      if (r.d != null) h += " til " + ipH(r.d, kart);
      if (r.dport != null) h += (r.d != null ? " på" : " til") + " port " + portMedNavn(r.dport);
      h += " → " + jH(r.j);
      var merk = [];
      if (hovedkjede && r.kjede && r.kjede !== hovedkjede)
        merk.push("Kjeden " + kjedeH(r.kjede) + " gjelder bare pakker " + (KJEDE_TXT[r.kjede] || "i en annen kjede") +
          ". Trafikk " + (KJEDE_TXT[hovedkjede] || "") + " møter aldri denne regelen.");
      for (var a = 0; a < i; a++) {
        if (FW.dekker(regler[a], r)) {
          merk.push(regler[a].j !== r.j
            ? "Nås aldri: regel " + regler[a].nr + " tar alle slike pakker først og gir " + jH(regler[a].j) + ". Første treff vinner."
            : "Overflødig: regel " + regler[a].nr + " tar alle slike pakker først og gir samme resultat.");
          break;
        }
      }
      if (r.dport != null && !r.p) merk.push("Mangler <span class=\"mono\">-p tcp</span> eller <span class=\"mono\">-p udp</span>: iptables godtar ikke <span class=\"mono\">--dport</span> uten protokoll.");
      return { nr: r.nr, kjede: r.kjede, html: h, merk: merk };
    });
    return ut;
  };
  function beskrivListe(regler, opts) {
    var ol = document.createElement("ol");
    ol.className = "fw-besk";
    FW.beskriv(regler, opts).forEach(function (b) {
      var li = document.createElement("li");
      li.innerHTML = "<span class=\"fw-besk-nr\">" + esc(b.nr) + "</span><span class=\"fw-besk-t\">" + kjedeH(b.kjede || "?") +
        " <span class=\"fw-besk-k\">(" + esc(KJEDE_TXT[b.kjede] || "") + ")</span>: " + b.html +
        (b.merk.length ? "<span class=\"fw-besk-m\">" + b.merk.join(" ") + "</span>" : "") + "</span>";
      ol.appendChild(li);
    });
    var pol = opts && opts.policy;
    if (pol) {
      var li = document.createElement("li");
      li.className = "fw-besk-pol";
      li.innerHTML = "<span class=\"fw-besk-nr\">–</span><span class=\"fw-besk-t\">Ingen regel traff → standardpolicy " + jH(pol) +
        (opts.policyMerk ? "<span class=\"fw-besk-m\">" + opts.policyMerk + "</span>" : "") + "</span>";
      ol.appendChild(li);
    }
    return ol;
  }
  FW.beskrivListe = beskrivListe;

  /* ---------- Fargekoding på siden ---------- */
  // Et eksplisitt [data-fw-scope] går foran kortet/calloutet det omslutter (regelsett + spiller deler farger)
  function scopeOf(n) {
    if (!n.closest) return n.parentNode || document.body;
    return n.closest("[data-fw-scope]") || n.closest(".examtask, .callout") || n.parentNode || document.body;
  }
  FW.kart = function (n) { return kartFor(scopeOf(n)); };
  var IP_RE = /(^|[^\d.])(\d{1,3}(?:\.\d{1,3}){3}(?:\/\d{1,2})?)(?![\d.]*\d)/g;
  var PORT_RE = /\b((?:mål)?port(?:en|ene)?|port nr\.?)(\s+)(\d{1,5})\b/gi;
  var HOPP = /^(PRE|SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CODE|svg)$/i;
  function fargTekst(sc, kart) {
    var w = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT, {
      acceptNode: function (t) {
        if (!/\d/.test(t.nodeValue)) return NodeFilter.FILTER_REJECT;
        for (var p = t.parentNode; p && p !== sc; p = p.parentNode) {
          if (HOPP.test(p.nodeName) || (p.classList && (p.classList.contains("fw-ip") || p.classList.contains("fw-port") || p.classList.contains("fw-sp") || p.classList.contains("fw-besk")))) return NodeFilter.FILTER_REJECT;
          if (p.hasAttribute && p.hasAttribute("data-fw-nei")) return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var noder = [], t;
    while ((t = w.nextNode())) noder.push(t);
    noder.forEach(function (n) {
      var s = n.nodeValue;
      IP_RE.lastIndex = 0; PORT_RE.lastIndex = 0;
      if (!IP_RE.test(s) && !PORT_RE.test(s)) return;
      var h = esc(s)
        .replace(IP_RE, function (m, pre, ip) { return pre + ipH(ip, kart); })
        .replace(PORT_RE, function (m, ord, ws, port) { return ord + ws + portH(port); });
      var span = document.createElement("span");
      span.innerHTML = h;
      var frag = document.createDocumentFragment();
      while (span.firstChild) frag.appendChild(span.firstChild);
      n.parentNode.replaceChild(frag, n);
    });
  }
  var obs = typeof WeakMap === "function" ? new WeakMap() : null;
  function folg(sc, kart) {
    if (!obs || obs.has(sc) || !window.MutationObserver) return;
    var tid = null;
    var mo = new MutationObserver(function () {
      if (tid) return;
      tid = setTimeout(function () { tid = null; fargScope(sc, kart); }, 60);
    });
    obs.set(sc, mo);
    mo.observe(sc, { childList: true, subtree: true });
  }
  function fargScope(sc, kart) {
    IN.qsa("pre:not([data-fw])", sc).forEach(function (pre) { if (/iptables/.test(pre.textContent)) fargPre(pre, kart); });
    fargTekst(sc, kart);
  }
  function fargPre(pre, kart) {
    pre.setAttribute("data-fw", "");
    pre.classList.add("fw-pre");
    pre.innerHTML = pre.textContent.split("\n").map(function (l) { return fargLinje(l, kart); }).join("\n");
  }
  FW.farge = function (root) {
    root = root || document;
    var sett = [];
    IN.qsa("pre:not([data-fw])", root).forEach(function (pre) {
      if (!/iptables/.test(pre.textContent)) return;
      var sc = scopeOf(pre);
      fargPre(pre, kartFor(sc));
      if (sett.indexOf(sc) < 0) sett.push(sc);
    });
    IN.qsa("[data-fw-scope]", root).forEach(function (sc) { if (sett.indexOf(sc) < 0) sett.push(sc); });
    sett.forEach(function (sc) { var k = kartFor(sc); fargTekst(sc, k); folg(sc, k); });
  };
  // Hele siden ved lasting, og nye regelsett (eksamenskort, faner som bygges senere) når de dukker opp
  function start() {
    FW.farge(document);
    if (!window.MutationObserver) return;
    var tid = null;
    new MutationObserver(function () {
      if (tid) return;
      tid = setTimeout(function () { tid = null; FW.farge(document); }, 120);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();

  /* ---------- Steg for steg ---------- */
  function pakkeH(pk, kart) {
    var n = FW.portNavn(pk.dport);
    return protoH(pk.p) + " fra " + ipH(pk.s, kart) + (pk.d ? " til " + ipH(pk.d, kart) : "") +
      (pk.dport != null ? ", målport " + portH(pk.dport) + (n ? " (" + esc(n) + ")" : "") : "");
  }
  function tjTekst(pk) {
    var n = FW.portNavn(pk.dport);
    return n ? n + " bruker " + String(pk.p).toUpperCase() + " og standardport " + pk.dport + "." : "";
  }
  // Hva et felt sammenlignes med, som tekst (kort)
  function sml(r, pk, f, ok, kart) {
    var k = f.k, rv = r[k], pv = pk[k];
    if (k === "kjede") return "kjede " + kjedeH(rv) + (ok ? " = " : " ≠ ") + "pakkens " + kjedeH(pv || "?");
    if (k === "p") return "<span class=\"mono\">-p</span> " + protoH(rv) + (ok ? " = " : " ≠ ") + protoH(pv || "?");
    if (k === "s" || k === "d") return "<span class=\"mono\">" + f.f + "</span> " + ipH(rv, kart) + (ok ? " = " : " ≠ ") + (pv ? ipH(pv, kart) : "(ingen)");
    if (k === "dport") return "<span class=\"mono\">--dport</span> " + portMedNavn(rv) + (ok ? " = " : " ≠ ") + (pv != null ? portMedNavn(pv) : "(ingen)");
    return esc(k);
  }

  FW.steg = function (host, cfg) {
    host = typeof host === "string" ? IN.qs(host) : host;
    if (!host || !IN.stepPlayer) return null;
    var el = IN.el;
    IN.clear(host);
    host.classList.add("fw-sp");
    var kart = cfg.kart || FW.kart(host);
    var tolket = cfg.tekst ? FW.parse(cfg.tekst) : null;
    var grunn = cfg.regler || (tolket ? tolket.regler : []);
    var kjede = cfg.kjede || "FORWARD";
    var pol = cfg.policy || (tolket && tolket.policy[kjede]) || "ACCEPT";

    // Kontroller: standardpolicy, brytere, pakkebygger
    var ctl = el("div", { class: "fw-ctl small" });
    host.appendChild(ctl);
    var polNavn = "fwpol" + Math.random().toString(36).slice(2, 8);
    var polRad = el("div", { class: "fw-ctl-rad", role: "radiogroup", "aria-label": "Standardpolicy for " + kjede });
    polRad.appendChild(el("span", { class: "fw-ctl-l", text: "Standardpolicy:" }));
    var polA = el("input", { type: "radio", name: polNavn, value: "ACCEPT" }), polD = el("input", { type: "radio", name: polNavn, value: "DROP" });
    (pol === "DROP" ? polD : polA).checked = true;
    polRad.appendChild(el("label", {}, [polA, el("span", { html: " " + jH("ACCEPT") + " <span class=\"muted\">(iptables' standard)</span>" })]));
    polRad.appendChild(el("label", {}, [polD, el("span", { html: " " + jH("DROP") + (cfg.dropMerk ? " <span class=\"muted\">(" + esc(cfg.dropMerk) + ")</span>" : "") })]));
    ctl.appendChild(polRad);
    var fjern = null, flytt = null;
    if (cfg.brytere) {
      var br = el("div", { class: "fw-ctl-rad" });
      if (grunn.some(function (r) { return r.siste; })) { fjern = el("input", { type: "checkbox" }); br.appendChild(el("label", {}, [fjern, document.createTextNode(" Fjern den siste regelen (DROP)")])); }
      if (cfg.flytt) { flytt = el("input", { type: "checkbox" }); br.appendChild(el("label", {}, [flytt, document.createTextNode(" Flytt regel " + cfg.flytt + " øverst")])); }
      ctl.appendChild(br);
    }
    function regelsett() {
      var r = grunn.slice();
      if (flytt && flytt.checked) { var x = r.splice(cfg.flytt - 1, 1)[0]; r.unshift(x); }
      if (fjern && fjern.checked) r = r.filter(function (x) { return !x.siste; });
      return r;
    }
    function policy() { return polD.checked ? "DROP" : "ACCEPT"; }

    // Pakkebygger
    var ips = [], mal = [];
    function leggTil(a, v) { if (v != null && a.indexOf(String(v)) < 0 && ipInt(String(v).split("/")[0]) != null && String(v).indexOf("/") < 0) a.push(String(v)); }
    grunn.forEach(function (r) { leggTil(ips, r.s); leggTil(mal, r.d); });
    Object.keys(cfg.pakker || {}).forEach(function (k) { leggTil(ips, cfg.pakker[k].s); leggTil(mal, cfg.pakker[k].d); });
    var ANNEN = cfg.annenIp || "198.51.100.7";
    leggTil(ips, ANNEN);
    var selS = el("select", { "aria-label": "Kildeadresse" }), selD = null, selP = el("select", { "aria-label": "Protokoll" }), selT = el("select", { "aria-label": "Tjeneste og målport" });
    ips.forEach(function (ip) { selS.appendChild(el("option", { value: ip, text: ip + (ip === ANNEN && grunn.every(function (r) { return r.s !== ip; }) ? " (ukjent)" : "") })); });
    ["tcp", "udp"].forEach(function (p) { selP.appendChild(el("option", { value: p, text: p.toUpperCase() })); });
    TJ.forEach(function (t) { selT.appendChild(el("option", { value: String(t.port), text: t.navn + " (" + t.port + ")" })); });
    var ekstraPorter = [];
    grunn.forEach(function (r) { if (r.dport != null && !FW.portNavn(r.dport) && /^\d+$/.test(String(r.dport)) && ekstraPorter.indexOf(+r.dport) < 0) ekstraPorter.push(+r.dport); });
    ekstraPorter.forEach(function (p) { selT.appendChild(el("option", { value: String(p), text: "Port " + p })); });
    var bygg = el("div", { class: "fw-ctl-rad fw-bygg" });
    bygg.appendChild(el("span", { class: "fw-ctl-l", text: "Egen pakke:" }));
    bygg.appendChild(el("label", {}, [document.createTextNode("Kilde "), selS]));
    if (mal.length) {
      selD = el("select", { "aria-label": "Måladresse" });
      mal.concat(["10.0.0.99"]).forEach(function (ip) { selD.appendChild(el("option", { value: ip, text: ip })); });
      bygg.appendChild(el("label", {}, [document.createTextNode("Mål "), selD]));
    }
    bygg.appendChild(el("label", {}, [document.createTextNode("Protokoll "), selP]));
    bygg.appendChild(el("label", {}, [document.createTextNode("Tjeneste "), selT]));
    ctl.appendChild(bygg);
    var stdLinje = el("p", { class: "fw-std", "aria-live": "polite" });
    ctl.appendChild(stdLinje);

    function egenPakke() {
      return { kjede: kjede, p: selP.value, s: selS.value, d: selD ? selD.value : null, dport: +selT.value,
        navn: (FW.portNavn(selT.value) || "Trafikk") + " fra " + selS.value };
    }
    function synk(pk) {
      if (pk.s && !Array.prototype.some.call(selS.options, function (o) { return o.value === pk.s; })) selS.appendChild(el("option", { value: pk.s, text: pk.s }));
      selS.value = pk.s; selP.value = pk.p;
      if (pk.dport != null && !Array.prototype.some.call(selT.options, function (o) { return o.value === String(pk.dport); })) selT.appendChild(el("option", { value: String(pk.dport), text: "Port " + pk.dport }));
      if (pk.dport != null) selT.value = String(pk.dport);
      if (selD && pk.d) selD.value = pk.d;
      visStd(pk);
    }
    function visStd(pk) {
      var n = FW.portNavn(pk.dport);
      stdLinje.innerHTML = n ? "Standardport: " + portH(pk.dport) + " = " + esc(n) + " (" + String(TJ.filter(function (t) { return t.navn === n; })[0].p).toUpperCase() + ", nettverkslysarket)" : "Port " + esc(pk.dport) + " er ikke en av standardportene i lysarket.";
    }

    var presets = {};
    Object.keys(cfg.pakker || {}).forEach(function (k) { presets[(cfg.pakker[k].etikett || k + ")") + " " + cfg.pakker[k].kort] = [k]; });
    var w = el("div", { class: "nt-sp fw-spiller" });
    host.appendChild(w);
    var cur = null, egen = null;

    var sp = IN.stepPlayer(w, {
      presets: presets, customInput: false, navTopp: true, fastHoyde: true,
      legend: [{ label: "✔ feltet passer", color: "var(--fw-acc)" }, { label: "✘ feltet passer ikke", color: "var(--fw-drop)" }, { label: "– ikke oppgitt = hva som helst", color: "var(--color-outline)" }],
      generate: function (inp) {
        cur = inp;
        var pk = inp[0] === "*" ? egen : cfg.pakker[inp[0]];
        if (!pk) return [];
        if (inp[0] !== "*") synk(pk); else visStd(pk);
        var rs = regelsett(), po = policy(), steps = [], ev = FW.evaluer(rs, pk, po);
        var navn = pk.navn ? esc(pk.navn) : pakkeH(pk, kart);
        steps.push({ pk: pk, rs: rs, at: -1, po: po, text: {
          eli5: "En pakke står foran dørvakten. Hun leser listen ovenfra, og den første linjen som passer, bestemmer.",
          normal: "Pakken: <b>" + navn + "</b>. " + esc(tjTekst(pk)) + " Den skal " + (KJEDE_TXT[pk.kjede] || "") + ", altså kjeden " + kjedeH(pk.kjede) + ". Reglene leses ovenfra, og første regel der alle oppgitte felt passer, bestemmer.",
          teknisk: "Pakken (" + pakkeH(pk, kart) + ") havner i kjeden " + kjedeH(pk.kjede) + ". En tilstandsløs brannmur ser bare på denne ene pakken. iptables sjekker reglene i rekkefølge; et felt som ikke står i regelen, matcher alt." } });
        for (var i = 0; i < rs.length; i++) {
          var r = rs[i], res = FELT.map(function (f) { return felt(r, pk, f.k); });
          var ok = res.indexOf("nei") < 0;
          var sjekket = FELT.filter(function (f, k) { return res[k] !== "any"; });
          var detaljer = sjekket.map(function (f) { var k = FELT.indexOf(f); return (res[k] === "ja" ? "✔ " : "✘ ") + sml(r, pk, f, res[k] === "ja", kart); });
          var forste = FELT.filter(function (f, k) { return res[k] === "nei"; })[0];
          var feilKjede = res[0] === "nei";
          var txt;
          if (ok) {
            var senere = [];
            for (var j = i + 1; j < rs.length; j++) if (FW.evaluer([rs[j]], pk).hit === 0) senere.push(rs[j]);
            var skygge = senere.filter(function (x) { return x.j !== r.j; })[0];
            txt = {
              eli5: "Linje " + r.nr + " passer på pakken. Dørvakten slutter å lese og sier " + (r.j === "ACCEPT" ? "«kom inn»" : "«nei»") + ".",
              normal: "Regel " + r.nr + " passer: " + detaljer.join(", ") + ". Resultat: " + jH(r.j) + ". Reglene under blir aldri lest for denne pakken." +
                (skygge ? " Regel " + skygge.nr + " ville også passet og gitt " + jH(skygge.j) + ", men første treff vinner." : ""),
              teknisk: "Regel " + r.nr + " matcher (" + detaljer.join(", ") + "), og målet <span class=\"mono\">-j</span> " + jH(r.j) + " er avsluttende." +
                (skygge ? " Regel " + skygge.nr + " (" + jH(skygge.j) + ") er skygget for denne pakken." : " Rekkefølgen av unntak og hovedregler avgjør resultatet.")
            };
          } else if (feilKjede) {
            txt = {
              eli5: "Linje " + r.nr + " er for en annen dør. Hun hopper over den.",
              normal: "Regel " + r.nr + " gjelder kjeden " + kjedeH(r.kjede) + " (pakker " + (KJEDE_TXT[r.kjede] || "") + "). Denne pakken går i " + kjedeH(pk.kjede) + ", så regelen hoppes over.",
              teknisk: "Regel " + r.nr + " står i " + kjedeH(r.kjede) + ". Videresendt trafikk møter bare FORWARD, så regelen kan aldri treffe denne pakken."
            };
          } else {
            txt = {
              eli5: "Linje " + r.nr + " passer ikke. Hun leser videre.",
              normal: "Regel " + r.nr + " passer ikke: " + sml(r, pk, forste, false, kart) + ". Les videre.",
              teknisk: "Regel " + r.nr + " matcher ikke: " + detaljer.join(", ") + ". Neste regel."
            };
          }
          steps.push({ pk: pk, rs: rs, at: i, res: res, ok: ok, po: po, text: txt });
          if (ok) break;
        }
        if (ev.hit < 0) {
          var slipper = po === "ACCEPT";
          steps.push({ pk: pk, rs: rs, at: rs.length, implicit: true, po: po, text: {
            eli5: "Ingen linje passet. Da gjelder husregelen: " + (slipper ? "«slipp inn». Derfor bør siste linje være «alle andre: nei»." : "«ingen kommer inn uten å stå på listen»."),
            normal: "Ingen regel traff. Da avgjør standardpolicyen " + jH(po) + ", så pakken " + (slipper ? "<b>slipper gjennom</b>." : "<b>stoppes</b>.") +
              (slipper ? " Med en eksplisitt DROP til slutt (eller policy DROP) hadde den blitt stoppet." : (cfg.dropMerk ? " (" + esc(cfg.dropMerk) + ".)" : "")),
            teknisk: "Ingen regel matchet, og kjedens policy gjelder (<span class=\"mono\">iptables -P " + esc(pk.kjede) + " " + po + "</span>). " +
              (slipper ? "Uten egen policy er den ACCEPT (nettverkslysarket s. 48); en eksplisitt DROP sist gir minste privilegium." : "Policy DROP gir «alt som ikke er tillatt, er forbudt».")
          } });
        }
        if (steps[1]) steps[1].spor = {
          sporsmal: {
            eli5: "Les listen ovenfra selv. Slipper dørvakten inn pakken?",
            normal: "Les reglene ovenfra og finn første treff. Hva blir resultatet for pakken?",
            teknisk: "Kjede " + esc(pk.kjede) + ", første treff vinner, standardpolicy " + po + " uten treff. Resultat?"
          },
          valg: ["ACCEPT", "DROP"], fasit: ev.j === "DROP" ? 1 : 0,
          forklaring: ev.hit >= 0 ? "Regel " + rs[ev.hit].nr + " er den første der alle oppgitte felt passer." : "Ingen regel passer, og standardpolicyen er " + po + "."
        };
        return steps;
      },
      render: function (s, ctx) {
        IN.clear(ctx.stage);
        var box = el("div", { class: "nt-scene fw-scene" });
        box.appendChild(el("p", { class: "fw-pk", html: "<b>Pakke:</b> " + pakkeH(s.pk, kart) + " <span class=\"muted small\">(kjede " + esc(s.pk.kjede) + ")</span>" }));
        var smal = ctx.width > 0 && ctx.width < 460;
        // Bare kolonnene som minst én regel bruker (kjeden vises alltid)
        var VIS = FELT.filter(function (f) { return f.k === "kjede" || s.rs.some(function (r) { return r[f.k] != null; }); });
        var liste = el(smal ? "ol" : "table", { class: smal ? "fw-kort" : "fw-tab", "aria-label": "Reglene, leses ovenfra" });
        if (!smal) liste.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "#" })].concat(VIS.map(function (f) { return el("th", { class: "mono", text: f.f }); })).concat([el("th", { class: "mono", text: "-j" })]))]));
        var tb = smal ? liste : el("tbody");
        function celle(r, f, i) {
          var v = r[f.k];
          if (v == null) return smal ? null : "<span class=\"fw-any\">–</span>";
          var h = f.k === "kjede" ? kjedeH(v) : f.k === "p" ? protoH(v) : f.k === "dport" ? portH(v) : ipH(v, kart);
          var st = null;
          if (i === s.at && s.res) st = s.res[FELT.indexOf(f)];
          else if (i < s.at) st = felt(r, s.pk, f.k);
          var mark = st === "ja" ? "<span class=\"fw-mk fw-mk-ja\" aria-label=\"passer\">✔</span>" : st === "nei" ? "<span class=\"fw-mk fw-mk-nei\" aria-label=\"passer ikke\">✘</span>" : "";
          return (smal ? "<span class=\"fw-l\">" + f.f + "</span> " : "") + h + mark;
        }
        s.rs.forEach(function (r, i) {
          var cls = i === s.at ? (s.ok ? "fw-hit" : "fw-cur") : i < s.at ? "fw-done" : "";
          if (smal) {
            var li = el("li", { class: cls });
            li.appendChild(el("span", { class: "fw-nr mono", text: String(r.nr) }));
            VIS.forEach(function (f) { var c = celle(r, f, i); if (c) li.appendChild(el("span", { class: "fw-b mono" + (i < s.at ? " fw-dim" : ""), html: c })); });
            li.appendChild(el("span", { class: "fw-b mono", html: "-j " + jH(r.j) }));
            tb.appendChild(li);
          } else {
            var tr = el("tr", { class: cls });
            tr.appendChild(el("td", { class: "mono", text: String(r.nr) }));
            VIS.forEach(function (f) { tr.appendChild(el("td", { class: "mono" + (i < s.at ? " fw-dim" : ""), html: celle(r, f, i) })); });
            tr.appendChild(el("td", { class: "mono", html: jH(r.j) }));
            tb.appendChild(tr);
          }
        });
        // Policy-raden står alltid nederst (markert når den avgjør)
        var polTxt = "Ingen treff → policy " + jH(s.po);
        if (smal) tb.appendChild(el("li", { class: "fw-polrad" + (s.implicit ? " fw-hit" : ""), html: "<span class=\"fw-nr mono\">–</span><span class=\"fw-b\">" + polTxt + "</span>" }));
        else tb.appendChild(el("tr", { class: "fw-polrad" + (s.implicit ? " fw-hit" : "") }, [el("td", { class: "mono", text: "–" }), el("td", { colspan: String(VIS.length + 1), html: polTxt })]));
        if (!smal) liste.appendChild(tb);
        var tw = el("div", { class: "table-wrap" }, [liste]);
        box.appendChild(tw);
        var verdict = s.ok ? s.rs[s.at].j : s.implicit ? s.po : null;
        var hvorfor = s.ok ? " (regel " + s.rs[s.at].nr + ")" : s.implicit ? " (standardpolicy)" : "";
        box.appendChild(el("p", { class: "fw-verdict " + (!verdict ? "fw-venter" : verdict === "ACCEPT" ? "fw-ok" : "fw-bad"),
          html: "Resultat: " + (verdict ? jH(verdict) + "<span class=\"muted small\">" + hvorfor + "</span>" : "<b>?</b>") }));
        ctx.stage.appendChild(box);
      }
    });
    function rerun() { if (cur) sp.setInput(cur); }
    function egenEndret() { egen = egenPakke(); sp.setInput(["*"]); }
    [polA, polD].forEach(function (x) { x.addEventListener("change", rerun); });
    if (fjern) fjern.addEventListener("change", rerun);
    if (flytt) flytt.addEventListener("change", rerun);
    [selS, selP].concat(selD ? [selD] : []).forEach(function (x) { x.addEventListener("change", egenEndret); });
    // Tjeneste velger også protokollen den bruker (DNS → UDP); protokollen kan endres etterpå
    selT.addEventListener("change", function () { var n = FW.portNavn(selT.value); TJ.forEach(function (t) { if (t.navn === n) selP.value = t.p; }); egenEndret(); });
    if (!Object.keys(cfg.pakker || {}).length) egenEndret();
    return sp;
  };

  /* Eksamenskortets Løsning (losViz): «Hva gjør reglene?» + steg for steg med oppgavens regelsett */
  FW.eksamen = function (host, cfg) {
    var el = IN.el, kart = FW.kart(host);
    var t = cfg.tekst ? FW.parse(cfg.tekst) : { regler: cfg.regler || [], policy: {} };
    host.appendChild(el("h5", { class: "fw-h", text: "Hva gjør reglene?" }));
    host.appendChild(beskrivListe(t.regler, { kart: kart, policy: cfg.policy, policyMerk: cfg.policyMerk }));
    if (!IN.stepPlayer) return;
    host.appendChild(el("h5", { class: "fw-h", text: "Én pakke om gangen" }));
    if (cfg.intro) host.appendChild(el("p", { class: "small muted", html: cfg.intro }));
    var sh = el("div");
    host.appendChild(sh);
    FW.steg(sh, { regler: t.regler, pakker: cfg.pakker, policy: cfg.policy, dropMerk: cfg.dropMerk, kart: kart, kjede: cfg.kjede });
  };
})();
