import assert from "node:assert/strict"
import fs from "node:fs"

const read = (path) => fs.readFileSync(new URL(`../public/${path}`, import.meta.url), "utf8")
const prefix = process.env.PATH_PREFIX ? `/${process.env.PATH_PREFIX}` : ""
const href = (path) => `${prefix}${path}`
const siteUrl = "https://blog.brightraven.world"
const localePrefixes = { en: "", ja: "/ja", "zh-TW": "/zh" }
const navRoutes = {
  en: { latest: "/", series: "/series/", topics: "/topics/" },
  ja: { latest: "/ja/", series: "/ja/series/", topics: "/ja/topics/" },
  "zh-TW": { latest: "/zh/", series: "/zh/series/", topics: "/zh/topics/" },
}
const routes = [
  { file: "series/index.html", lang: "en", path: "/series/" },
  { file: "ja/series/index.html", lang: "ja", path: "/ja/series/" },
  { file: "zh/series/index.html", lang: "zh-TW", path: "/zh/series/" },
  { file: "topics/index.html", lang: "en", path: "/topics/" },
  { file: "ja/topics/index.html", lang: "ja", path: "/ja/topics/" },
  { file: "zh/topics/index.html", lang: "zh-TW", path: "/zh/topics/" },
]
const shellPages = {
  latest: { en: "index.html", ja: "ja/index.html", "zh-TW": "zh/index.html" },
  series: { en: "series/index.html", ja: "ja/series/index.html", "zh-TW": "zh/series/index.html" },
  topics: { en: "topics/index.html", ja: "ja/topics/index.html", "zh-TW": "zh/topics/index.html" },
  article: {
    en: "00-player-is-not-infinite/index.html",
    ja: "ja/00-player-is-not-infinite/index.html",
    "zh-TW": "zh/00-player-is-not-infinite/index.html",
  },
}
const seriesSlugs = [
  "00-player-is-not-infinite",
  "01-buying-is-easier-than-playing",
  "02-platforms-never-run-out-of-games",
]
const publicUrl = new URL("../public/", import.meta.url)
const draftRoutes = [
  { source: "../src/en/posts/", output: "" },
  { source: "../src/ja/posts/", output: "ja/" },
  { source: "../src/zh/posts/", output: "zh/" },
].flatMap(({ source, output }) =>
  fs.readdirSync(new URL(source, import.meta.url))
    .filter((file) => file.endsWith(".md"))
    .filter((file) => /^status:\s*draft\s*$/m.test(fs.readFileSync(new URL(file, new URL(source, import.meta.url)), "utf8")))
    .map((file) => `${output}${file.slice(0, -3)}/index.html`)
)

for (const route of draftRoutes) {
  assert.ok(!fs.existsSync(new URL(route, publicUrl)), `Draft article must not be generated: ${route}`)
}

const generatedHtml = fs
  .readdirSync(publicUrl, { recursive: true })
  .filter((path) => path.endsWith(".html"))
  .map((path) => ({
    path: path.replaceAll("\\", "/"),
    source: fs.readFileSync(new URL(path.replaceAll("\\", "/"), publicUrl), "utf8"),
  }))

const home = read("index.html")
const feed = read("feed.xml")
const jaHome = read("ja/index.html")
const jaFeed = read("ja/feed.xml")
const zhHome = read("zh/index.html")
const zhFeed = read("zh/feed.xml")
const zhSeries = read("zh/series/index.html")
const zhTopics = read("zh/topics/index.html")
const style = read("assets/style.css")
const backToTopScript = read("assets/back-to-top.js")
const privacyConsentScript = read("assets/privacy-consent.js")
const themeUrl = new URL("../public/assets/theme.js", import.meta.url)
assert.ok(fs.existsSync(themeUrl), "Expected the built theme runtime")
const themeScript = fs.readFileSync(themeUrl, "utf8")
const newStory = read("00-player-is-not-infinite/index.html")
const jaNewStory = read("ja/00-player-is-not-infinite/index.html")
const zhNewStory = read("zh/00-player-is-not-infinite/index.html")
const buyingStory = read("01-buying-is-easier-than-playing/index.html")
const jaBuyingStory = read("ja/01-buying-is-easier-than-playing/index.html")
const zhBuyingStory = read("zh/01-buying-is-easier-than-playing/index.html")
const zhMaidaStory = read("zh/01-maida-decision-memory/index.html")
const platformStory = read("02-platforms-never-run-out-of-games/index.html")
const jaPlatformStory = read("ja/02-platforms-never-run-out-of-games/index.html")
const zhPlatformStory = read("zh/02-platforms-never-run-out-of-games/index.html")
const assertOrdered = (page, ...needles) => {
  let previous = -1
  for (const needle of needles) {
    const position = page.indexOf(needle)
    assert.ok(position > previous, `Expected ${needle} after the previous item`)
    previous = position
  }
}

for (const route of routes) {
  const page = read(route.file)
  assert.ok(page.includes(`<html lang="${route.lang}">`), `Expected ${route.file} to use ${route.lang}`)
  assert.ok(
    page.includes(`<link rel="canonical" href="${siteUrl}${route.path}">`),
    `Expected ${route.file} to self-canonicalize`,
  )
  for (const [lang, localePrefix] of Object.entries(localePrefixes)) {
    const alternatePath = `${localePrefix}${route.path.replace(/^\/(?:ja\/|zh\/)?/, "/")}`
    assert.ok(
      page.includes(`<link rel="alternate" hreflang="${lang}" href="${siteUrl}${alternatePath}">`),
      `Expected ${route.file} to include its ${lang} alternate`,
    )
  }
}

for (const [surface, pages] of Object.entries(shellPages)) {
  for (const [lang, file] of Object.entries(pages)) {
    const page = read(file)
    const contentNavigation = page.match(/<nav class="content-navigation"[\s\S]*?<\/nav>/)?.[0]
    assert.ok(contentNavigation, `Expected content navigation on ${file}`)
    for (const path of Object.values(navRoutes[lang])) {
      assert.ok(contentNavigation.includes(`href="${href(path)}"`), `Expected ${path} in ${file} navigation`)
    }
    assert.equal((contentNavigation.match(/<a\b/g) || []).length, 3, `Expected three content links on ${file}`)
    assert.match(page, /<button class="theme-trigger"[^>]*data-theme-trigger/)
    assert.match(page, /data-theme-menu[^>]*hidden/)
    assert.match(page, /value="auto"[\s\S]*value="light"[\s\S]*value="dark"/)
    assert.match(page, /<footer class="site-footer"[\s\S]*<button[^>]*data-open-privacy/)
    assert.match(page, /<button class="back-to-top"[^>]*\shidden\b/)
    assert.match(page, /<svg class="back-to-top-icon"[^>]*viewBox="0 0 64 64"/)
    assert.ok(surface, "Expected a named shell surface")
  }
}

for (const route of routes.filter(({ path }) => path.includes("/series/") && path !== "/zh/series/")) {
  const page = read(route.file)
  const expected = seriesSlugs.map((slug) => href(`${localePrefixes[route.lang]}/${slug}/`.replace("//", "/")))
  const actual = [...page.matchAll(/<li class="series-row"><a href="([^"]+)"/g)].map((match) => match[1])
  assert.deepEqual(actual, expected, `Expected stable Series order on ${route.file}`)
}

const zhSeriesLinks = [...zhSeries.matchAll(/<li class="series-row"><a href="([^"]+)"/g)].map((match) => match[1])
assert.deepEqual(
  zhSeriesLinks,
  [
    "/zh/00-player-is-not-infinite/",
    "/zh/01-buying-is-easier-than-playing/",
    "/zh/02-platforms-never-run-out-of-games/",
    "/zh/01-maida-decision-memory/",
  ],
  "Expected the Chinese Series page to include the Maida article after the Player series",
)
assert.match(zhSeries, /id="series-maida-reasons-to-open">值得打開的理由<\/h2>/)
assert.match(zhSeries, /href="\/zh\/01-maida-decision-memory\/">我做了一個連自己都不想用的選擇工具<\/a>/)

for (const route of routes.filter(({ path }) => path.includes("/topics/"))) {
  const page = read(route.file)
  const tags = [...page.matchAll(/<li class="topic-tag" data-topic-id="([^"]+)">/g)].map((match) => match[1])
  const articleLinks = [...page.matchAll(/<li class="topic-article-row">[\s\S]*?<h3><a href="([^"]+)"/g)].map((match) => match[1])
  const expected = route.lang === "zh-TW"
    ? [
        "/zh/01-maida-decision-memory/",
        "/zh/02-platforms-never-run-out-of-games/",
        "/zh/01-buying-is-easier-than-playing/",
        "/zh/00-player-is-not-infinite/",
      ]
    : seriesSlugs.map((slug) => href(`${localePrefixes[route.lang]}/${slug}/`.replace("//", "/")))
  assert.ok(tags.length > 0, `Expected Tags on ${route.file}`)
  assert.equal(new Set(tags).size, tags.length, `Expected unique Tags on ${route.file}`)
  assert.deepEqual(articleLinks, expected, `Expected one unique Article list on ${route.file}`)
  assert.doesNotMatch(page, /topic-map-node|topic-connections|<details/)
}

assert.match(zhTopics, /href="\/zh\/01-maida-decision-memory\/">我做了一個連自己都不想用的選擇工具<\/a>/)

assert.equal(
  fs.existsSync(new URL("assets/presentation.js", publicUrl)),
  false,
  "Expected the obsolete presentation runtime to be absent",
)
for (const { path, source } of generatedHtml) {
  assert.doesNotMatch(source, /presentation-switch|data-presentation|calligraphy|\/assets\/presentation\.js/)
  assert.doesNotMatch(source, /(?:googletagmanager\.com\/gtag\/js|google-analytics\.com\/analytics\.js)/i)
  assert.match(source, /src="\/assets\/privacy-consent\.js\?v=20260825a"/)
  assert.ok(path, "Expected a generated HTML path")
}

assert.match(home, /<meta name="description"/)
for (const xmlFeed of [feed, jaFeed, zhFeed]) {
  assert.match(xmlFeed, /^<\?xml version="1\.0" encoding="utf-8"\?>/)
  assert.doesNotMatch(xmlFeed, /<!DOCTYPE html>|<html\b/)
}
assert.match(home, /<link rel="icon" href="data:,">/)
assert.match(home, /Notes on AI, accessibility, games/)
assert.match(home, /ESSAYS ON AGENCY/)
assert.match(home, /Bright Raven[\s\S]*studies and builds tools/)
assert.match(home, />EN<\/a>[\s\S]*>JA<\/a>[\s\S]*>繁<\/a>/)
assert.match(jaHome, /<html lang="ja">/)
assert.match(jaHome, /AI、アクセシビリティ、ゲーム/)
assert.match(jaHome, /主体性をめぐるエッセイ/)
assert.match(jaHome, /Bright Raven[\s\S]*研究し、ツールをつくっています/)
assert.match(jaHome, /class="latest-shell"/)
assert.equal((jaHome.match(/class="latest-item"/g) || []).length, 3)
assert.match(jaHome, /<time datetime="2026-08-05">2026年8月5日<\/time> · [^·]+ · \d+ 分で読めます/)
assertOrdered(jaHome, 'datetime="2026-08-05"', 'datetime="2026-08-01"', 'datetime="2026-07-30"')
assert.doesNotMatch(jaHome, /pagination-next/)
assert.match(jaFeed, /<feed[\s\S]*xml:lang="ja"/)
assert.match(jaFeed, /<updated>\d{4}-\d{2}-\d{2}T/)
assert.match(jaFeed, /<entry>/)
assert.match(jaHome, /<link rel="alternate" type="application\/rss\+xml" href="\/ja\/feed\.xml"/)
assert.match(jaHome, /<a class="site-title" href="\/ja\/"/)
assert.ok(jaHome.includes(`href="${href("/")}" lang="en"`))
assert.ok(jaHome.includes(`href="${href("/zh/")}" lang="zh-TW"`))
assert.ok(newStory.includes(`href="${href("/ja/00-player-is-not-infinite/")}" lang="ja"`))
assert.ok(buyingStory.includes(`href="${href("/ja/01-buying-is-easier-than-playing/")}" lang="ja"`))
assert.ok(platformStory.includes(`href="${href("/ja/02-platforms-never-run-out-of-games/")}" lang="ja"`))
assert.match(jaPlatformStory, /<link rel="alternate" hreflang="en"/)
assert.match(zhPlatformStory, /<link rel="alternate" hreflang="ja"/)
assert.match(jaBuyingStory, /<link rel="alternate" hreflang="en"/)
assert.match(zhBuyingStory, /<link rel="alternate" hreflang="ja"/)
assert.match(jaNewStory, /<link rel="alternate" hreflang="en"/)
assert.match(jaNewStory, /<link rel="alternate" hreflang="zh-TW"/)
assert.equal((home.match(/class="latest-item"/g) || []).length, 3)
assert.match(home, /<time datetime="2026-08-05">Aug 5, 2026<\/time> · [^·]+ · \d+ min read/)
assertOrdered(home, 'datetime="2026-08-05"', 'datetime="2026-08-01"', 'datetime="2026-07-30"')
assert.doesNotMatch(home, /pagination-next/)
assert.doesNotMatch(home, /class="pagination-nav"/)
assert.doesNotMatch(home, /A-02-why-you-open-steam-and-close-it/)
assert.doesNotMatch(feed, /A-02-why-you-open-steam-and-close-it/)
assert.match(feed, /00-player-is-not-infinite/)
assert.match(feed, /01-buying-is-easier-than-playing/)
assert.match(feed, /02-platforms-never-run-out-of-games/)
assert.match(newStory, /Games &amp; Choice/)
assert.match(jaNewStory, /ゲームと選択/)
assert.match(zhNewStory, /遊戲與選擇/)
assert.match(zhMaidaStory, /遊戲與選擇/)
assert.match(zhMaidaStory, /<span>系列<\/span> <a href="\/zh\/series\/">值得打開的理由<\/a>/)
assert.match(zhHome, /關於 AI、無障礙、遊戲/)
assert.match(zhHome, /關於能動性的文章/)
assert.match(zhHome, /Bright Raven[\s\S]*研究並製作/)
assert.equal((zhHome.match(/class="latest-item"/g) || []).length, 4)
const maidaShelf = zhHome.match(/<section class="latest-shell series-shelf"[\s\S]*?<\/section>/)?.[0]
assert.ok(maidaShelf, "Expected a separate Maida redesign shelf on the Chinese homepage")
assert.match(maidaShelf, /<h1 id="maida-redesign-title">值得打開的理由<\/h1>/)
assert.match(maidaShelf, /href="\/zh\/01-maida-decision-memory\/"/)
assert.match(maidaShelf, /<time datetime="2026-09-20">2026年9月20日<\/time> · 遊戲與選擇 · \d+ 分鐘/)
assert.doesNotMatch(zhFeed, /01-maida-decision-memory/)
assert.doesNotMatch(home, /Maida is a free, open-source tool/)
assert.doesNotMatch(home, /class="post-list"/)
assert.doesNotMatch(home, /presentation-switch|data-presentation|presentation\.js/)
assert.ok(
  home.indexOf('localStorage.getItem("akatsuki-theme")') < home.indexOf('<link rel="stylesheet"'),
  "Expected the theme bootstrap before the stylesheet",
)
assert.match(home, /!\["auto", "light", "dark"\]\.includes\(saved\)/)
assert.equal((home.match(/data-theme-trigger/g) || []).length, 1)
assert.equal((home.match(/data-theme-menu/g) || []).length, 1)
assert.equal((home.match(/name="akatsuki-theme"/g) || []).length, 3)
assert.match(home, /src="\/assets\/theme\.js"/)
assert.match(themeScript, /const storageKey = "akatsuki-theme"/)
assert.match(themeScript, /new Set\(\["auto", "light", "dark"\]\)/)
assert.match(themeScript, /mode === "auto" \? \(media\.matches \? "dark" : "light"\) : mode/)
assert.match(themeScript, /media\.addEventListener\("change"/)
assert.match(themeScript, /documentElement\.style\.colorScheme = theme/)
assert.match(home, /data-open-privacy/)
assert.match(privacyConsentScript, /querySelectorAll\("\[data-open-privacy\]"\)/)
assert.match(privacyConsentScript, /let focusOrigin = null;/)
assert.match(privacyConsentScript, /trigger\.addEventListener\("click", \(\) => showPanel\(true, trigger\)\);/)
assert.match(privacyConsentScript, /const focusTarget = focusOrigin\?\.isConnected[\s\S]*focusTarget\?\.focus\(\);/)
assert.match(
  privacyConsentScript,
  /if \(preference\) \{\s*title\.setAttribute\("aria-describedby", "br-consent-current"\);\s*\} else \{\s*title\.removeAttribute\("aria-describedby"\);\s*\}/,
)
assert.doesNotMatch(privacyConsentScript, /toggleAttribute\("aria-describedby"/)
assert.match(privacyConsentScript, /class="br-consent-feedback" role="status"/)
assert.match(privacyConsentScript, /close\.hidden = false;[\s\S]*updateText\(\);/)
assert.match(privacyConsentScript, /if \(window\.__akatsukiConsentInitialized\) return;/)
assert.match(privacyConsentScript, /window\.__akatsukiConsentInitialized = true;/)
assert.match(privacyConsentScript, /Domain=\.brightraven\.world/)
assert.doesNotMatch(privacyConsentScript, /localStorage\.(?:getItem|setItem)\(/)
assert.match(privacyConsentScript, /return readCookie\(\) === status;/)
assert.match(privacyConsentScript, /let pageViewSent = false;[\s\S]*let analyticsActive = false;/)
assert.match(privacyConsentScript, /function disableAnalytics\(\) \{[\s\S]*ga-disable-[\s\S]*script\.remove\(\)[\s\S]*deleteAnalyticsCookies\(\);[\s\S]*\}/)
assert.match(privacyConsentScript, /function enableAnalytics\(\) \{[\s\S]*if \(!analyticsActive\)[\s\S]*createElement\("script"\)[\s\S]*googletagmanager\.com\/gtag\/js[\s\S]*\}/)
assert.match(privacyConsentScript, /decline\.addEventListener\("click", \(\) => choose\("denied"\)\)/)
assert.match(privacyConsentScript, /allow\.addEventListener\("click", \(\) => choose\("granted"\)\)/)
assert.match(privacyConsentScript, /if \(preference === "granted"\) \{[\s\S]*enableAnalytics\(\)[\s\S]*\} else if \(preference === "denied"\) \{[\s\S]*disableAnalytics\(\)/)
assert.match(
  privacyConsentScript,
  /if \(!analyticsActive\) \{[\s\S]*window\.gtag\("config"[\s\S]*analyticsActive = true;/,
)
assert.match(
  privacyConsentScript,
  /if \(!pageViewSent\) \{[\s\S]*window\.gtag\("event", "page_view"[\s\S]*pageViewSent = true;/,
)
assert.match(privacyConsentScript, /max-height:\s*calc\(100%[^;]+;[\s\S]*overflow-y:\s*auto;/)
assert.doesNotMatch(privacyConsentScript, /br-consent-manage/)
assert.doesNotMatch(home, /aria-modal=|role="dialog"/)
assertOrdered(home, "</header>", 'id="br-consent-root"', '<main id="main"')
assert.doesNotMatch(home, /<body[^>]*id="top"/)
assert.match(home, /<header[^>]*id="top"[^>]*tabindex="-1"/)
assert.match(home, /<button class="back-to-top"[^>]*aria-label="Back to top"[^>]*hidden/)
assert.doesNotMatch(home, /<a class="back-to-top"/)
assert.match(jaHome, /class="back-to-top"[^>]*aria-label="ページ上部へ"/)
assert.match(zhHome, /class="back-to-top"[^>]*aria-label="回到頁首"/)
assert.match(home, /class="back-to-top-icon" viewBox="0 0 64 64"/)
assert.match(home, /src="\/assets\/back-to-top\.js"/)
assert.match(home, /\/assets\/style\.css\?v=20260809-1/)
assert.match(home, /No newsletter\. Follow by RSS, or come back whenever you like\./)
assert.match(jaHome, /ニュースレターは配信していません。RSSで購読するか、また読みたくなったときにお越しください。/)
assert.match(zhHome, /不寄電子報。你可以透過 RSS 追蹤，或想起來時再回來看看。/)
assert.equal((zhHome.match(/class="latest-item"/g) || []).length, 4)
assertOrdered(zhHome, 'id="maida-redesign-title"', 'datetime="2026-09-20"', 'datetime="2026-08-05"', 'datetime="2026-08-01"', 'datetime="2026-07-30"')
assert.doesNotMatch(zhHome, /pagination-next/)
assert.doesNotMatch(zhHome, /class="pagination-nav"/)
assert.doesNotMatch(style, /[0-9](?:dvh|svh|vh)\b/)
assert.doesNotMatch(style, /PMingLiU|MingLiU|(^|[,\s])serif(?=[,;\s])/m)
assert.doesNotMatch(style, /font-family:\s*monospace\b/)
assert.doesNotMatch(style, /font-style:\s*italic/)
assert.match(style, /\.series-group \+ \.series-group\s*\{[^}]*border-top: 1px solid var\(--color-line\)/s)
assert.match(style, /em,\s*i\s*\{[^}]*font-style:\s*normal/s)
assert.match(style, /\.back-to-top\s*\{[^}]*position:\s*fixed[^}]*width:\s*64px[^}]*height:\s*64px/s)
assert.match(style, /\.back-to-top\[hidden\]\s*\{[^}]*display:\s*none/s)
assert.match(style, /\.back-to-top-icon\s*\{[^}]*width:\s*52px[^}]*height:\s*52px/s)
assert.match(backToTopScript, /control\.hidden = window\.scrollY <= window\.innerHeight/)
assert.match(backToTopScript, /addEventListener\("scroll", update, \{ passive: true \}\)/)
assert.match(backToTopScript, /window\.scrollTo\(\{[\s\S]*top:\s*0,[\s\S]*prefers-reduced-motion/s)
assert.match(style, /:root\[data-theme="dark"\]/)
assert.doesNotMatch(style, /@media \(prefers-color-scheme:\s*dark\)[\s\S]{0,80}:root\s*\{/)
assert.match(style, /body\s*\{[^}]*font-family:[^;]*"Noto Sans TC"[^;]*"Noto Sans JP"[^;]*sans-serif/s)
assert.match(style, /article code\s*\{[^}]*font-family:[^;]*"Noto Sans TC"[^;]*"Noto Sans JP"[^;]*monospace/s)
assert.doesNotMatch(zhHome, />undefined</)

console.log("Akatsuki build verification passed")
