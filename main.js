(function () {
  var C = window.KENCOOLIE || {};
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (attrs[k] !== undefined && attrs[k] !== "") n.setAttribute(k, attrs[k]); }
    if (text !== undefined) n.textContent = text;
    return n;
  }
  function ext(a) { a.target = "_blank"; a.rel = "noopener"; return a; }
  function has(v) { return typeof v === "string" && v.trim() !== ""; }

  /* Socials */
  var socials = (C.socials || []).filter(function (s) { return s && has(s.url); });
  ["header-socials", "nav-socials", "footer-socials"].forEach(function (id) {
    var ul = document.getElementById(id); if (!ul) return;
    socials.forEach(function (s) { var li = el("li"); li.appendChild(ext(el("a", { href: s.url }, s.label))); ul.appendChild(li); });
  });
  var ig = socials.filter(function (s) { return /instagram/i.test(s.url); })[0];

  function emptyState(title, body, linkText, linkUrl) {
    var box = el("div", { "class": "empty" });
    box.appendChild(el("span", { "class": "k" }, title));
    box.appendChild(el("p", null, body));
    if (linkUrl) box.appendChild(ext(el("a", { "class": "btn outline btn-small", href: linkUrl }, linkText)));
    return box;
  }

  /* Mixes */
  function embedFor(url) {
    try {
      var u = new URL(url), h = u.hostname.replace(/^www\./, "");
      if (h === "mixcloud.com") return { src: "https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=" + encodeURIComponent(u.pathname), h: 120 };
      if (h === "soundcloud.com" || h === "on.soundcloud.com") return { src: "https://w.soundcloud.com/player/?url=" + encodeURIComponent(url) + "&color=%23cb9d13&visual=false&show_comments=false", h: 166 };
      var id = null;
      if (h === "youtu.be") id = u.pathname.slice(1);
      if (h === "youtube.com" || h === "m.youtube.com") id = u.searchParams.get("v");
      if (id) return { src: "https://www.youtube.com/embed/" + id, ratio: true };
    } catch (e) {}
    return null;
  }
  var mixList = document.getElementById("mix-list");
  var mixes = (C.mixes || []).filter(function (m) { return m && has(m.url); });
  if (mixes.length) {
    mixes.forEach(function (m) {
      var card = el("div", { "class": "mix" });
      if (has(m.title)) card.appendChild(el("h3", null, m.title));
      var e = embedFor(m.url);
      if (e) {
        var f = el("iframe", { src: e.src, title: m.title || "Kencoolie mix", loading: "lazy", allow: "autoplay; encrypted-media; fullscreen" });
        if (e.ratio) f.style.aspectRatio = "16 / 9"; else f.height = e.h;
        card.appendChild(f);
      } else {
        card.appendChild(ext(el("a", { "class": "open", href: m.url }, "Listen")));
      }
      mixList.appendChild(card);
    });
  } else {
    mixList.appendChild(emptyState("First mix drops soon", "New sets are being recorded now. Follow along to hear them first.", ig ? "Follow on Instagram" : "", ig ? ig.url : ""));
  }
  var mp = C.mixProfile || {};
  if (has(mp.url)) document.getElementById("mix-more").appendChild(ext(el("a", { "class": "btn outline", href: mp.url }, "All mixes on " + (mp.label || "Mixcloud"))));

  /* Playlists */
  var plList = document.getElementById("playlist-list");
  var pls = (C.playlists || []).filter(function (p) { return p && has(p.title); });
  if (pls.length) {
    pls.forEach(function (p) {
      var card = el("article", { "class": "pl" });
      card.appendChild(el("h3", null, p.title));
      if (has(p.note)) card.appendChild(el("p", null, p.note));
      var links = el("div", { "class": "links" });
      if (has(p.spotify)) links.appendChild(ext(el("a", { href: p.spotify }, "Spotify")));
      if (has(p.apple)) links.appendChild(ext(el("a", { href: p.apple }, "Apple Music")));
      if (has(p.soundcloud)) links.appendChild(ext(el("a", { href: p.soundcloud }, "SoundCloud")));
      if (links.children.length) card.appendChild(links);
      plList.appendChild(card);
    });
  } else {
    plList.appendChild(emptyState("Playlists coming soon", "Afrobeats, Amapiano and Dancehall playlists for every part of the night.", ig ? "Follow for the drop" : "", ig ? ig.url : ""));
  }

  /* Reviews */
  var rvList = document.getElementById("review-list");
  var rvs = (C.reviews || []).filter(function (r) { return r && has(r.quote); });
  if (rvs.length) {
    rvs.forEach(function (r) {
      var fig = el("figure", { "class": "review" });
      fig.appendChild(el("span", { "class": "stars", "aria-label": "5 stars" }, "★★★★★"));
      fig.appendChild(el("blockquote", null, "“" + r.quote + "”"));
      var cap = el("figcaption");
      if (has(r.name)) cap.appendChild(el("b", null, r.name));
      if (has(r.event)) cap.appendChild(document.createTextNode((has(r.name) ? " · " : "") + r.event));
      fig.appendChild(cap);
      rvList.appendChild(fig);
    });
  } else {
    rvList.appendChild(emptyState("Booked Kencoolie?", "Share how the night went. Your review helps the next host decide.", "", ""));
  }
  if (has(C.reviewLink)) document.getElementById("review-cta").appendChild(ext(el("a", { "class": "btn outline", href: C.reviewLink }, "Leave a review")));

  /* Email */
  if (has(C.email)) document.getElementById("email-text").textContent = C.email;
  var copyBtn = document.getElementById("copy-email");
  copyBtn.addEventListener("click", function () {
    var t = document.getElementById("email-text");
    var done = function () { copyBtn.textContent = "Copied"; setTimeout(function () { copyBtn.textContent = "Copy"; }, 1600); };
    var fallback = function () { var r = document.createRange(); r.selectNodeContents(t); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); };
    try { navigator.clipboard.writeText(t.textContent).then(done, fallback); } catch (e) { fallback(); }
  });

  /* Header on scroll */
  var header = document.getElementById("site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* Slide-out menu */
  var nav = document.getElementById("site-nav"), toggle = document.getElementById("menu-toggle");
  function setNav(open) {
    nav.setAttribute("data-open", open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  }
  toggle.addEventListener("click", function () { setNav(nav.getAttribute("data-open") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setNav(false); });

  /* Form: real submit on Netlify, notice in previews */
  var inFrame = false; try { inFrame = window.self !== window.top; } catch (e) { inFrame = true; }
  document.getElementById("booking-form").addEventListener("submit", function (e) {
    if (inFrame) {
      e.preventDefault();
      var s = document.getElementById("form-status");
      s.textContent = "Preview only. The form sends once the site is live.";
      s.hidden = false;
    }
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
