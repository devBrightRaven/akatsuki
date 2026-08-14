(function () {
  "use strict";

  if (window.__akatsukiConsentInitialized) return;
  window.__akatsukiConsentInitialized = true;

  const measurementId = "G-ZJKKRRTFXW";
  const preferenceKey = "br_ga4_consent_v1";
  const scriptSelector = 'script[data-br-ga4="true"]';
  let pageViewSent = false;
  let analyticsActive = false;
  let sessionPreference = null;
  const translations = {
    en: {
      title: "May we count this visit?",
      body: "An optional service counts basic page visits so Bright Raven can understand which pages are useful. Reading works without it; the privacy policy explains what the provider receives.",
      note: "You can change this later from Privacy choices.",
      allow: "Yes, that is okay",
      decline: "No thanks",
      close: "Close privacy choices",
      policy: "Read the privacy policy",
      currentGranted: "Current choice: visit measurement is on.",
      currentDenied: "Current choice: visit measurement is off.",
      undecided: "Current choice: visit measurement is not chosen yet.",
      savedGranted: "Visit measurement is on. You can change this choice at any time.",
      savedDenied: "Visit measurement is off. No measurement request was sent on this page.",
      savedWithdrawn: "Visit measurement is off. Data already sent cannot be retracted from this page."
    },
    ja: {
      title: "この訪問を数えてもよいですか？",
      body: "任意のサービスで基本的なページ閲覧を数え、Bright Raven が役立つページを把握します。許可しなくても読めます。提供事業者が受け取る情報はプライバシーポリシーに記載しています。",
      note: "後でフッターの「プライバシー設定」から変更できます。",
      allow: "はい、かまいません",
      decline: "許可しない",
      close: "プライバシー設定を閉じる",
      policy: "プライバシーポリシーを読む",
      currentGranted: "現在の選択：訪問計測はオンです。",
      currentDenied: "現在の選択：訪問計測はオフです。",
      undecided: "現在の選択：訪問計測はまだ選ばれていません。",
      savedGranted: "訪問計測をオンにしました。この選択はいつでも変更できます。",
      savedDenied: "訪問計測はオフです。このページでは計測リクエストを送信していません。",
      savedWithdrawn: "訪問計測をオフにしました。このページからすでに送信されたデータは取り消せません。"
    },
    zhHans: {
      title: "可以记录这次访问吗？",
      body: "可选服务会记录基本页面浏览，让 Bright Raven 了解哪些页面有帮助。不允许也能阅读；服务提供者会收到哪些信息，请参阅隐私政策。",
      note: "之后可以从页尾的“隐私选项”更改。",
      allow: "可以，没问题",
      decline: "不用，谢谢",
      close: "关闭隐私选项",
      policy: "阅读隐私政策",
      currentGranted: "目前选择：访问统计已开启。",
      currentDenied: "目前选择：访问统计已关闭。",
      undecided: "目前选择：尚未选择是否开启访问统计。",
      savedGranted: "访问统计已开启。你可以随时更改这个选择。",
      savedDenied: "访问统计已关闭。这个页面没有发送统计请求。",
      savedWithdrawn: "访问统计已关闭。这个页面已经发送的数据无法撤回。"
    },
    zhHant: {
      title: "可以記錄這次造訪嗎？",
      body: "選用服務會記錄基本頁面瀏覽，讓 Bright Raven 了解哪些頁面有幫助。不允許也能閱讀；服務提供者會收到哪些資訊，請見隱私政策。",
      note: "之後可以從頁尾的「隱私選項」變更。",
      allow: "可以，沒問題",
      decline: "不用，謝謝",
      close: "關閉隱私選項",
      policy: "閱讀隱私政策",
      currentGranted: "目前選擇：造訪統計已開啟。",
      currentDenied: "目前選擇：造訪統計已關閉。",
      undecided: "目前選擇：尚未選擇是否開啟造訪統計。",
      savedGranted: "造訪統計已開啟。你可以隨時變更這個選擇。",
      savedDenied: "造訪統計已關閉。這個頁面沒有送出統計請求。",
      savedWithdrawn: "造訪統計已關閉。這個頁面已經送出的資料無法撤回。"
    }
  };

  function languageKey() {
    const lang = (document.documentElement.lang || "en").toLowerCase();
    if (lang.startsWith("ja")) return "ja";
    if (lang.includes("hans") || lang === "zh-cn") return "zhHans";
    if (lang.includes("hant") || lang === "zh-tw" || lang === "zh-hk") return "zhHant";
    return "en";
  }

  function readPreference() {
    try {
      const value = JSON.parse(localStorage.getItem(preferenceKey));
      if (value && (value.status === "granted" || value.status === "denied")) return value.status;
    } catch (_error) {}
    return sessionPreference;
  }

  function writePreference(status) {
    sessionPreference = status;
    try {
      localStorage.setItem(preferenceKey, JSON.stringify({
        status,
        updatedAt: new Date().toISOString(),
        version: 1
      }));
    } catch (_error) {
      // Storage can be unavailable in hardened browsers. Consent remains valid for this page only.
    }
  }

  function deleteAnalyticsCookies() {
    const names = document.cookie
      .split(";")
      .map((entry) => entry.split("=")[0].trim())
      .filter((name) => name.startsWith("_ga"));
    const hostParts = location.hostname.split(".");
    const baseDomain = hostParts.length >= 2 ? `.${hostParts.slice(-2).join(".")}` : "";

    for (const name of names) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      if (baseDomain) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${baseDomain}; SameSite=Lax`;
      }
    }
  }

  function disableAnalytics() {
    analyticsActive = false;
    window[`ga-disable-${measurementId}`] = true;
    document.querySelectorAll(scriptSelector).forEach((script) => script.remove());
    if (Array.isArray(window.dataLayer)) window.dataLayer.length = 0;
    window.gtag = function () {};
    deleteAnalyticsCookies();
  }

  function enableAnalytics() {
    window[`ga-disable-${measurementId}`] = false;

    if (!analyticsActive) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });

      if (!document.querySelector(scriptSelector)) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        script.dataset.brGa4 = "true";
        document.head.append(script);
      }
      analyticsActive = true;
    }

    if (!pageViewSent) {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: location.href,
        page_path: `${location.pathname}${location.search}`
      });
      pageViewSent = true;
    }
  }

  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #br-consent-root, #br-consent-root * { box-sizing: border-box; }
      #br-consent-root {
        --brc-bg: var(--bg);
        --brc-surface: var(--surface);
        --brc-text: var(--text);
        --brc-muted: var(--text-muted);
        --brc-border: var(--border);
        --brc-focus: var(--link);
        position: relative;
        z-index: 2147483000;
        color: var(--brc-text);
        font-family: Arial, "Helvetica Neue", "PingFang TC", "Noto Sans TC", "Hiragino Sans", "Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif;
        letter-spacing: 0;
      }
      #br-consent-root [hidden] { display: none !important; }
      .br-consent-panel {
        position: fixed;
        right: max(0.75rem, env(safe-area-inset-right));
        bottom: max(0.75rem, env(safe-area-inset-bottom));
        left: max(0.75rem, env(safe-area-inset-left));
        width: min(52rem, calc(100% - 1.5rem));
        max-width: calc(100% - 1.5rem);
        max-height: calc(100% - max(0.75rem, env(safe-area-inset-top)) - max(0.75rem, env(safe-area-inset-bottom)));
        margin-inline: auto;
        padding: 1rem;
        border: 2px solid var(--brc-border);
        border-radius: 6px;
        background: var(--brc-bg);
        box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.24);
        overflow-y: auto;
        overflow-wrap: anywhere;
        overscroll-behavior: contain;
      }
      .br-consent-heading-row {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 1rem;
      }
      .br-consent-title {
        margin: 0;
        color: var(--brc-text);
        font: 700 1.125rem/1.35 Arial, "Helvetica Neue", "PingFang TC", "Noto Sans TC", "Hiragino Sans", "Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif;
        letter-spacing: 0;
      }
      .br-consent-announcement {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      .br-consent-copy, .br-consent-current, .br-consent-feedback, .br-consent-note {
        max-width: 72ch;
        margin: 0.65rem 0 0;
        color: var(--brc-text);
        font-size: 1rem;
        line-height: 1.55;
      }
      .br-consent-current, .br-consent-note { color: var(--brc-muted); }
      .br-consent-feedback { font-weight: 700; }
      .br-consent-policy {
        display: inline-block;
        min-height: 2.75rem;
        margin-top: 0.35rem;
        padding-block: 0.65rem;
        color: var(--link);
        text-decoration: underline;
        text-underline-offset: 0.18em;
      }
      .br-consent-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      .br-consent-button, .br-consent-close {
        min-height: 2.75rem;
        border: 2px solid var(--brc-border);
        border-radius: 4px;
        color: var(--brc-text);
        background: var(--brc-surface);
        font: 700 1rem/1.2 Arial, "Helvetica Neue", "PingFang TC", "Noto Sans TC", "Hiragino Sans", "Noto Sans JP", "Yu Gothic UI", Meiryo, sans-serif;
        letter-spacing: 0;
        cursor: pointer;
      }
      .br-consent-button {
        flex: 1 1 12rem;
        padding: 0.65rem 1rem;
      }
      .br-consent-button:hover, .br-consent-close:hover {
        color: var(--brc-bg);
        background: var(--brc-text);
      }
      .br-consent-button:focus-visible, .br-consent-close:focus-visible, .br-consent-policy:focus-visible {
        outline: 3px solid var(--brc-focus);
        outline-offset: 3px;
      }
      .br-consent-close {
        flex: 0 0 2.75rem;
        width: 2.75rem;
        padding: 0;
        font-size: 1.35rem;
      }
      @media (max-width: 36rem) {
        .br-consent-panel {
          max-height: min(18rem, 40%);
          padding: 0.625rem;
        }
        .br-consent-copy, .br-consent-current, .br-consent-feedback, .br-consent-note {
          margin-top: 0.35rem;
          font-size: 0.875rem;
          line-height: 1.35;
        }
        .br-consent-policy {
          margin-top: 0;
          padding-block: 0.5rem;
        }
        .br-consent-actions {
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        .br-consent-button {
          flex-basis: 6rem;
          padding: 0.5rem 0.625rem;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        #br-consent-root *, #br-consent-root *::before, #br-consent-root *::after {
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
          animation-duration: 0.01ms !important;
        }
      }
    `;
    document.head.append(style);
  }

  function buildInterface() {
    let text = translations[languageKey()];
    const root = document.getElementById("br-consent-root");
    if (!root) return;

    const panel = document.createElement("section");
    panel.className = "br-consent-panel";
    panel.setAttribute("aria-labelledby", "br-consent-title");
    panel.innerHTML = `
      <div class="br-consent-heading-row">
        <h2 class="br-consent-title" id="br-consent-title" tabindex="-1"></h2>
        <button class="br-consent-close" type="button" hidden><span aria-hidden="true">&times;</span></button>
      </div>
      <p class="br-consent-announcement" role="status" aria-live="polite" aria-atomic="true"></p>
      <p class="br-consent-copy"></p>
      <p class="br-consent-current" id="br-consent-current" hidden></p>
      <p class="br-consent-feedback" role="status" aria-atomic="true" hidden></p>
      <div class="br-consent-actions">
        <button class="br-consent-button" type="button" data-consent="denied"></button>
        <button class="br-consent-button" type="button" data-consent="granted"></button>
      </div>
      <a class="br-consent-policy" href="https://brightraven.world/privacy.html"></a>
      <p class="br-consent-note"></p>
    `;

    const title = panel.querySelector(".br-consent-title");
    const announcement = panel.querySelector(".br-consent-announcement");
    const copy = panel.querySelector(".br-consent-copy");
    const current = panel.querySelector(".br-consent-current");
    const feedback = panel.querySelector(".br-consent-feedback");
    const note = panel.querySelector(".br-consent-note");
    const policy = panel.querySelector(".br-consent-policy");
    const close = panel.querySelector(".br-consent-close");
    const decline = panel.querySelector('[data-consent="denied"]');
    const allow = panel.querySelector('[data-consent="granted"]');
    const privacyTriggers = Array.from(document.querySelectorAll("[data-open-privacy]"));
    let focusOrigin = null;
    let feedbackKey = null;

    function updateChoice() {
      const preference = readPreference();
      current.hidden = !preference;
      current.textContent = preference === "granted" ? text.currentGranted : preference === "denied" ? text.currentDenied : "";
      if (preference) {
        title.setAttribute("aria-describedby", "br-consent-current");
      } else {
        title.removeAttribute("aria-describedby");
      }
    }

    function announceChoice() {
      const preference = readPreference();
      const choice = preference === "granted"
        ? text.currentGranted
        : preference === "denied" ? text.currentDenied : text.undecided;
      announcement.textContent = `${text.title} ${choice}`;
    }

    function updateText() {
      text = translations[languageKey()];
      title.textContent = text.title;
      copy.textContent = text.body;
      note.textContent = text.note;
      policy.textContent = text.policy;
      close.setAttribute("aria-label", text.close);
      decline.textContent = text.decline;
      allow.textContent = text.allow;
      updateChoice();
      feedback.hidden = !feedbackKey;
      feedback.textContent = feedbackKey ? text[feedbackKey] : "";
      announceChoice();
    }

    updateText();
    new MutationObserver(updateText).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });

    function showPanel(fromTrigger, origin = null) {
      panel.hidden = false;
      close.hidden = !fromTrigger;
      updateChoice();
      if (fromTrigger) {
        focusOrigin = origin;
        title.focus();
      } else {
        focusOrigin = null;
      }
      announceChoice();
      window.dispatchEvent(new Event("akatsuki:privacychange"));
    }

    function hidePanel(returnFocus) {
      panel.hidden = true;
      feedbackKey = null;
      feedback.hidden = true;
      feedback.textContent = "";
      if (returnFocus) {
        const focusTarget = focusOrigin?.isConnected
          ? focusOrigin
          : privacyTriggers.find((trigger) => trigger.isConnected);
        focusTarget?.focus();
      }
      focusOrigin = null;
      window.dispatchEvent(new Event("akatsuki:privacychange"));
    }

    function finishChoice() {
      const focusTarget = focusOrigin?.isConnected
        ? focusOrigin
        : document.querySelector("#main");
      hidePanel(false);
      focusTarget?.focus({ preventScroll: true });
    }

    function choose(next) {
      const withdrawing = next === "denied" && pageViewSent;
      writePreference(next);
      if (next === "granted") enableAnalytics();
      else disableAnalytics();
      feedbackKey = next === "granted"
        ? "savedGranted"
        : withdrawing ? "savedWithdrawn" : "savedDenied";
      close.hidden = false;
      updateText();
      window.dispatchEvent(new Event("akatsuki:privacychange"));
      finishChoice();
    }

    decline.addEventListener("click", () => choose("denied"));
    allow.addEventListener("click", () => choose("granted"));
    document.querySelectorAll("[data-open-privacy]").forEach((trigger) => {
      trigger.addEventListener("click", () => showPanel(true, trigger));
    });
    close.addEventListener("click", () => hidePanel(true));
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !close.hidden) {
        event.preventDefault();
        hidePanel(true);
      }
    });

    root.append(panel);

    const preference = readPreference();
    if (preference === "granted") {
      enableAnalytics();
      hidePanel(false);
    } else if (preference === "denied") {
      disableAnalytics();
      hidePanel(false);
    } else {
      disableAnalytics();
      showPanel(false);
    }
  }

  function start() {
    addStyles();
    buildInterface();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
