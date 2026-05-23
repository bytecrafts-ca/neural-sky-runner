(function () {
  "use strict";

  var STORAGE = "daily_brief_settings_v2";
  var screens = {};
  var state = null;
  var widgetDetails = {};
  var lastFocusedBeforeModal = null;

  var LOCATIONS = [
    { id: "nyc", name: "New York", lat: 40.7128, lon: -74.0060, tz: "America/New_York" },
    { id: "london", name: "London", lat: 51.5072, lon: -0.1276, tz: "Europe/London" },
    { id: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503, tz: "Asia/Tokyo" },
    { id: "dubai", name: "Dubai", lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai" },
    { id: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093, tz: "Australia/Sydney" }
  ];

  var MODULES = [
    { key: "weather", title: "Weather", source: "Open-Meteo" },
    { key: "stocks", title: "US Stock Market", source: "Guardian Business (US market filter)" },
    { key: "world", title: "World", source: "Guardian World" }
  ];

  state = loadState();

  function defaultState() {
    return {
      locationId: "nyc",
      useAutoLocation: true,
      autoLocation: null,
      enabled: { weather: true, stocks: true, world: true },
      cache: {},
      lastRefresh: null
    };
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var base = defaultState();
      return {
        locationId: parsed.locationId || base.locationId,
        useAutoLocation: parsed.useAutoLocation !== false,
        autoLocation: parsed.autoLocation || null,
        enabled: Object.assign(base.enabled, parsed.enabled || {}),
        cache: parsed.cache || {},
        lastRefresh: parsed.lastRefresh || null
      };
    } catch (e) {
      return defaultState();
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }

  function $(id) { return document.getElementById(id); }

  function collectScreens() {
    document.querySelectorAll(".screen").forEach(function (el) {
      if (el.id) screens[el.id] = el;
    });
  }

  function showScreen(id) {
    Object.keys(screens).forEach(function (k) { screens[k].classList.add("hidden"); });
    if (screens[id]) screens[id].classList.remove("hidden");
    if (id === "home") renderHome();
    if (id === "settings") renderSettings();
    if (id === "location") renderLocation();
  }

  function focusFirst(container) {
    var root = container || document;
    var el = root.querySelector(".focusable:not([disabled]):not(.hidden)");
    if (el) el.focus();
  }

  function moveFocus(direction) {
    var scope = document.querySelector(".overlay:not(.hidden), .screen:not(.hidden)");
    if (!scope) return;
    var list = Array.from(scope.querySelectorAll(".focusable:not([disabled]):not(.hidden)"));
    if (!list.length) return;
    var idx = list.indexOf(document.activeElement);
    if (idx < 0) { list[0].focus(); return; }
    var next = (direction === "up" || direction === "left")
      ? (idx > 0 ? idx - 1 : list.length - 1)
      : (idx < list.length - 1 ? idx + 1 : 0);
    list[next].focus();
    list[next].scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function formatTime(ts) {
    if (!ts) return "--";
    var d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function stripHtml(value) {
    return String(value == null ? "" : value)
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function currentLocation() {
    if (state.useAutoLocation && state.autoLocation) return state.autoLocation;
    return LOCATIONS.find(function (x) { return x.id === state.locationId; }) || LOCATIONS[0];
  }

  function renderHome() {
    var loc = currentLocation();
    var eCount = Object.keys(state.enabled).filter(function (k) { return state.enabled[k]; }).length;
    var locLabel = state.useAutoLocation ? ("Auto: " + loc.name) : ("Manual: " + loc.name);
    $("home-meta").textContent = locLabel + " · Modules " + eCount + " · Updated " + formatTime(state.lastRefresh);
  }

  function renderSettings() {
    var list = $("settings-list");
    list.innerHTML = "";
    MODULES.forEach(function (m) {
      var on = !!state.enabled[m.key];
      var btn = document.createElement("button");
      btn.className = "card focusable";
      btn.setAttribute("data-action", "toggle-module");
      btn.setAttribute("data-module", m.key);
      btn.innerHTML =
        '<div class="name">' + m.title + '</div>' +
        '<div class="meta">Source: ' + m.source + '</div>' +
        '<div class="status"><span class="pill ' + (on ? "ok" : "warn") + '">' + (on ? "Enabled" : "Disabled") + '</span></div>';
      list.appendChild(btn);
    });
    focusFirst(list);
  }

  function renderLocation() {
    var list = $("location-list");
    list.innerHTML = "";

    var autoBtn = document.createElement("button");
    autoBtn.className = "card focusable";
    autoBtn.setAttribute("data-action", "toggle-auto-location");
    autoBtn.innerHTML =
      '<div class="name">Use Current Location</div>' +
      '<div class="meta">Get weather for where your glasses are.</div>' +
      '<div class="status"><span class="pill ' + (state.useAutoLocation ? "ok" : "warn") + '">' +
      (state.useAutoLocation ? "Enabled" : "Disabled") + "</span></div>";
    list.appendChild(autoBtn);

    LOCATIONS.forEach(function (loc) {
      var active = !state.useAutoLocation && loc.id === state.locationId;
      var btn = document.createElement("button");
      btn.className = "card focusable";
      btn.setAttribute("data-action", "set-location");
      btn.setAttribute("data-location", loc.id);
      btn.innerHTML =
        '<div class="name">' + loc.name + '</div>' +
        '<div class="meta">Lat ' + loc.lat.toFixed(2) + " · Lon " + loc.lon.toFixed(2) + '</div>' +
        '<div class="status"><span class="pill ' + (active ? "ok" : "warn") + '">' + (active ? "Selected" : "Set") + '</span></div>';
      list.appendChild(btn);
    });
    focusFirst(list);
  }

  async function fetchJSON(url, timeoutMs) {
    var ctl = new AbortController();
    var timer = setTimeout(function () { ctl.abort(); }, timeoutMs || 7000);
    try {
      var res = await fetch(url, { cache: "no-store", signal: ctl.signal });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function cacheModule(key, data, live) {
    state.cache[key] = { data: data, sourceOk: !!live, timestamp: Date.now() };
    saveState();
  }

  function getCached(key) { return state.cache[key] || null; }

  function fallbackData(key) {
    if (key === "weather") {
      var loc = currentLocation();
      return { location: loc.name, temp: "--", wind: "--", high: "--", low: "--", condition: "Unavailable" };
    }
    if (key === "stocks") return {
      summary: "Market data unavailable",
      lines: ["No live feed right now."],
      details: ["No live feed right now. Try refreshing in a few minutes."]
    };
    if (key === "world") return {
      summary: "World update unavailable",
      lines: ["No live feed right now."],
      details: ["No live feed right now. Try refreshing in a few minutes."]
    };
    return null;
  }

  async function detectAutoLocation() {
    if (!state.useAutoLocation || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async function (pos) {
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;
      var name = "Current Location";
      try {
        var geo = await fetchJSON(
          "https://geocoding-api.open-meteo.com/v1/reverse?latitude=" + encodeURIComponent(lat) +
          "&longitude=" + encodeURIComponent(lon) + "&language=en&format=json", 7000
        );
        if (geo && geo.results && geo.results.length) {
          var g = geo.results[0];
          name = g.name + (g.country ? ", " + g.country : "");
        }
      } catch (e) {}
      state.autoLocation = { id: "auto", name: name, lat: lat, lon: lon, tz: "auto" };
      saveState();
      renderHome();
      if (!screens.brief.classList.contains("hidden")) refreshBrief();
      if (!screens.location.classList.contains("hidden")) renderLocation();
    }, function () {
      // silently keep manual fallback
    }, { timeout: 12000, maximumAge: 300000 });
  }

  async function loadWeather() {
    var loc = currentLocation();
    var url = "https://api.open-meteo.com/v1/forecast?latitude=" + encodeURIComponent(loc.lat) +
      "&longitude=" + encodeURIComponent(loc.lon) +
      "&current=temperature_2m,weathercode,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=2";
    var data = await fetchJSON(url, 7000);
    return {
      location: loc.name,
      temp: data.current && data.current.temperature_2m,
      wind: data.current && data.current.wind_speed_10m,
      high: data.daily && data.daily.temperature_2m_max && data.daily.temperature_2m_max[0],
      low: data.daily && data.daily.temperature_2m_min && data.daily.temperature_2m_min[0],
      condition: "Code " + (data.current && data.current.weathercode)
    };
  }

  async function loadStockBrief() {
    var url = "https://content.guardianapis.com/search?section=business&q=Wall%20Street%20OR%20S%26P%20500%20OR%20Nasdaq%20OR%20Dow%20Jones%20OR%20US%20stocks&show-fields=headline,trailText&order-by=newest&page-size=10&api-key=test";
    var data = await fetchJSON(url, 7000);
    var items = (data.response && data.response.results) ? data.response.results : [];
    var usFiltered = items.filter(function (x) {
      var t = (x.webTitle || "").toLowerCase();
      return t.indexOf("wall street") >= 0 ||
        t.indexOf("s&p") >= 0 ||
        t.indexOf("dow") >= 0 ||
        t.indexOf("nasdaq") >= 0 ||
        t.indexOf("us stock") >= 0 ||
        t.indexOf("federal reserve") >= 0 ||
        t.indexOf("treasury") >= 0;
    });
    var selected = (usFiltered.length ? usFiltered : items).slice(0, 5);
    var normalized = selected.map(function (x) {
      var title = (x.fields && x.fields.headline) || x.webTitle || "US market update";
      var detail = stripHtml((x.fields && x.fields.trailText) || "");
      return { title: title, detail: detail };
    });
    var lines = normalized.map(function (x) { return x.title; });
    var details = normalized.map(function (x) {
      return x.detail ? (x.title + " — " + x.detail) : x.title;
    });
    var summary = lines.length ? lines[0] : "No market update right now.";
    return { summary: summary, lines: lines, details: details };
  }

  async function loadWorldBrief() {
    var url = "https://content.guardianapis.com/search?section=world&show-fields=headline,trailText&order-by=newest&page-size=5&api-key=test";
    var data = await fetchJSON(url, 7000);
    var items = (data.response && data.response.results) ? data.response.results : [];
    var selected = items.slice(0, 5);
    var normalized = selected.map(function (x) {
      var title = (x.fields && x.fields.headline) || x.webTitle || "World update";
      var detail = stripHtml((x.fields && x.fields.trailText) || "");
      return { title: title, detail: detail };
    });
    var lines = normalized.map(function (x) { return x.title; });
    var details = normalized.map(function (x) {
      return x.detail ? (x.title + " — " + x.detail) : x.title;
    });
    var summary = lines.length ? lines[0] : "No world update right now.";
    return { summary: summary, lines: lines, details: details };
  }

  function moduleCard(widgetId, title, source, main, sub, lines, detailLines, statusClass, statusText, ts, icon) {
    widgetDetails[widgetId] = {
      title: title,
      source: source,
      main: main,
      sub: sub,
      lines: lines || [],
      detailLines: detailLines || lines || [],
      statusText: statusText,
      timestamp: ts
    };
    var linesHtml = (lines || []).map(function (line) {
      return '<div class="widget-line">' + escapeHtml(line) + "</div>";
    }).join("");
    return (
      '<button class="widget-card focusable" tabindex="0" data-action="open-widget" data-widget-id="' + widgetId + '">' +
      '<div class="widget-top">' +
      '<div class="widget-title">' + escapeHtml((icon || "•") + " " + title) + "</div>" +
      '<div class="status"><span class="pill ' + statusClass + '">' + statusText + "</span> · " + formatTime(ts) + "</div>" +
      "</div>" +
      '<div class="widget-main">' + escapeHtml(main) + "</div>" +
      '<div class="widget-sub">' + escapeHtml(sub + " · Source: " + source) + "</div>" +
      (linesHtml ? '<div class="widget-list-lines">' + linesHtml + "</div>" : "") +
      "</button>"
    );
  }

  function summaryCard(weather, stocks, world) {
    var weatherLine = weather ? (weather.temp + "°C in " + weather.location + ", H/L " + weather.high + "/" + weather.low) : "Weather unavailable";
    var marketLine = stocks ? stocks.summary : "Market update unavailable";
    var worldLine = world ? world.summary : "World update unavailable";
    widgetDetails.summary = {
      title: "Today at a Glance",
      source: "Daily Brief synthesis",
      main: "What matters now",
      sub: "Weather + US stocks + world",
      lines: [weatherLine, "Market: " + marketLine, "World: " + worldLine],
      detailLines: [weatherLine, "Market: " + marketLine, "World: " + worldLine],
      statusText: "Summary",
      timestamp: Date.now()
    };
    return (
      '<button class="widget-card focusable" tabindex="0" data-action="open-widget" data-widget-id="summary">' +
      '<div class="widget-top"><div class="widget-title">🧠 Today at a Glance</div>' +
      '<div class="status"><span class="pill ok">Summary</span></div></div>' +
      '<div class="widget-main">What matters now</div>' +
      '<div class="widget-sub">Text brief generated from live modules</div>' +
      '<div class="widget-list-lines">' +
      '<div class="widget-line">• ' + weatherLine + "</div>" +
      '<div class="widget-line">• Market: ' + marketLine + "</div>" +
      '<div class="widget-line">• World: ' + worldLine + "</div>" +
      "</div></button>"
    );
  }

  function openWidget(widgetId) {
    var d = widgetDetails[widgetId];
    if (!d) return;
    lastFocusedBeforeModal = document.activeElement;
    $("widget-modal-title").textContent = d.title;
    $("widget-modal-meta").textContent = "Source: " + d.source + " · " + d.statusText + " · Updated " + formatTime(d.timestamp);
    $("widget-modal-main").textContent = d.main || "";
    $("widget-modal-sub").textContent = d.sub || "";
    var lines = $("widget-modal-lines");
    lines.innerHTML = "";
    (d.detailLines || d.lines || []).forEach(function (line) {
      var div = document.createElement("div");
      div.className = "widget-line";
      div.textContent = line;
      lines.appendChild(div);
    });
    $("widget-modal").classList.remove("hidden");
    focusFirst($("widget-modal-panel"));
  }

  async function refreshBrief() {
    var list = $("brief-list");
    widgetDetails = {};
    list.innerHTML = '<div class="card"><div class="name">Refreshing brief...</div><div class="meta">Loading selected modules with fallback safety.</div></div>';
    $("brief-time").textContent = formatTime(Date.now());

    var loaders = { weather: loadWeather, stocks: loadStockBrief, world: loadWorldBrief };
    var enabledModules = MODULES.filter(function (m) { return state.enabled[m.key]; });

    var results = await Promise.all(enabledModules.map(async function (mod) {
      var cache = getCached(mod.key);
      try {
        var live = await loaders[mod.key]();
        cacheModule(mod.key, live, true);
        return { mod: mod, payload: getCached(mod.key) };
      } catch (e) {
        if (cache) return { mod: mod, payload: cache };
        var fb = fallbackData(mod.key);
        cacheModule(mod.key, fb, false);
        return { mod: mod, payload: getCached(mod.key) };
      }
    }));

    var weatherData = null;
    var stockData = null;
    var worldData = null;
    var sections = [];

    results.forEach(function (entry) {
      var mod = entry.mod;
      var payload = entry.payload;
      var sourceOk = !!payload.sourceOk;
      var statusClass = sourceOk ? "ok" : "warn";
      var statusText = sourceOk ? "Live" : "Fallback";

      if (mod.key === "weather") {
        weatherData = payload.data;
        sections.push(moduleCard(
          "weather",
          "Weather",
          mod.source,
          (payload.data.temp !== "--" ? payload.data.temp + "°C" : "--"),
          payload.data.location + " · H/L " + payload.data.high + "/" + payload.data.low + "°C",
          ["Wind " + payload.data.wind + " km/h", payload.data.condition],
          ["Wind " + payload.data.wind + " km/h", payload.data.condition, "Tap refresh for latest local conditions."],
          statusClass, statusText, payload.timestamp, "☀️"
        ));
      } else if (mod.key === "stocks") {
        stockData = payload.data;
        sections.push(moduleCard(
          "stocks",
          "Stock Market",
          mod.source,
          payload.data.summary,
          "US market pulse",
          payload.data.lines || [],
          payload.data.details || payload.data.lines || [],
          statusClass, statusText, payload.timestamp, "📈"
        ));
      } else if (mod.key === "world") {
        worldData = payload.data;
        sections.push(moduleCard(
          "world",
          "World",
          mod.source,
          payload.data.summary,
          "Global developments",
          payload.data.lines || [],
          payload.data.details || payload.data.lines || [],
          statusClass, statusText, payload.timestamp, "🌍"
        ));
      }
    });

    if (!sections.length) {
      sections.push('<div class="card"><div class="name">No modules enabled</div><div class="meta">Enable modules in Brief Settings.</div></div>');
    } else {
      sections.unshift(summaryCard(weatherData, stockData, worldData));
    }

    list.innerHTML = sections.join("") + '<div class="note">Live first, graceful fallback second. Every widget is keyboard-focusable and scrollable.</div>';
    state.lastRefresh = Date.now();
    saveState();
    $("brief-time").textContent = formatTime(state.lastRefresh);
  }

  function openBrief() {
    showScreen("brief");
    refreshBrief().then(function () { focusFirst($("brief-list")); });
  }

  function onAction(action, el) {
    if (!action) return;
    if (action === "open-brief") { openBrief(); return; }
    if (action === "open-settings") { showScreen("settings"); return; }
    if (action === "open-location") { showScreen("location"); return; }
    if (action === "open-about") { showScreen("about"); focusFirst(screens.about); return; }
    if (action === "refresh-brief") { refreshBrief(); return; }
    if (action === "open-widget") {
      openWidget(el.getAttribute("data-widget-id"));
      return;
    }
    if (action === "close-widget") {
      $("widget-modal").classList.add("hidden");
      if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
        lastFocusedBeforeModal.focus();
      }
      return;
    }

    if (action === "toggle-module") {
      var key = el.getAttribute("data-module");
      state.enabled[key] = !state.enabled[key];
      saveState();
      renderSettings();
      return;
    }

    if (action === "set-location") {
      state.useAutoLocation = false;
      state.locationId = el.getAttribute("data-location");
      saveState();
      renderLocation();
      return;
    }

    if (action === "toggle-auto-location") {
      state.useAutoLocation = !state.useAutoLocation;
      saveState();
      if (state.useAutoLocation) detectAutoLocation();
      renderLocation();
      renderHome();
      return;
    }

    if (action === "back-home") {
      var target = el.getAttribute("data-screen") || "home";
      showScreen(target);
      focusFirst(screens[target]);
      return;
    }
  }

  function dispatchAction(target) {
    if (!target) return;
    if (target.nodeType === 3 && target.parentElement) target = target.parentElement;
    var t = target.closest ? target.closest("[data-action]") : null;
    if (!t) return;
    onAction(t.dataset.action, t);
  }

  function onKey(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      moveFocus("up");
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      moveFocus("down");
      return;
    }
    if (e.key === "Enter") {
      var f = document.activeElement;
      if (f && f.dataset && f.dataset.action) {
        e.preventDefault();
        onAction(f.dataset.action, f);
      }
      return;
    }
    if (e.key === "Escape") {
      if (!$("widget-modal").classList.contains("hidden")) {
        e.preventDefault();
        $("widget-modal").classList.add("hidden");
        if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === "function") {
          lastFocusedBeforeModal.focus();
        }
        return;
      }
      var visible = document.querySelector(".screen:not(.hidden)");
      if (visible && visible.id !== "home") {
        e.preventDefault();
        showScreen("home");
        focusFirst(screens.home);
      }
    }
  }

  function init() {
    collectScreens();
    showScreen("home");
    focusFirst(screens.home);
    detectAutoLocation();
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", function (e) { dispatchAction(e.target); });
    document.addEventListener("pointerup", function (e) { dispatchAction(e.target); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
