import assert from "node:assert/strict"
import fs from "node:fs"
import {
  normalizePresentation,
  readPresentation,
  writePresentation,
} from "../src/assets/presentation.js"

const read = (path) => fs.readFileSync(new URL(`../public/${path}`, import.meta.url), "utf8")
const prefix = process.env.PATH_PREFIX ? `/${process.env.PATH_PREFIX}` : ""
const href = (path) => `${prefix}${path}`

const home = read("index.html")
const feed = read("feed.xml")
const jaHome = read("ja/index.html")
const jaFeed = read("ja/feed.xml")
const zhHome = read("zh/index.html")
const zhFeed = read("zh/feed.xml")
const style = read("assets/style.css")
const newStory = read("00-player-is-not-infinite/index.html")
const jaNewStory = read("ja/00-player-is-not-infinite/index.html")
const zhNewStory = read("zh/00-player-is-not-infinite/index.html")
const archivedStory = read("A-02-why-you-open-steam-and-close-it/index.html")
const zhOnlyStory = read("zh/F-26-friction-is-protection/index.html")

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
assert.match(jaHome, /class="presentation-switch"/)
assert.match(jaHome, />記事</)
assert.equal((jaHome.match(/class="story-card"/g) || []).length, 1)
assert.doesNotMatch(jaHome, /pagination-next/)
assert.match(jaFeed, /<feed[\s\S]*xml:lang="ja"/)
assert.match(jaFeed, /<updated>\d{4}-\d{2}-\d{2}T/)
assert.match(jaFeed, /<entry>/)
assert.match(jaHome, /<link rel="alternate" type="application\/rss\+xml" href="\/ja\/feed\.xml"/)
assert.match(jaHome, /<a class="site-title" href="\/ja\/"/)
assert.ok(jaHome.includes(`href="${href("/")}" lang="en"`))
assert.ok(jaHome.includes(`href="${href("/zh/")}" lang="zh-TW"`))
assert.ok(newStory.includes(`href="${href("/ja/00-player-is-not-infinite/")}" lang="ja"`))
assert.match(jaNewStory, /<link rel="alternate" hreflang="en"/)
assert.match(jaNewStory, /<link rel="alternate" hreflang="zh-TW"/)
assert.equal((home.match(/class="story-card"/g) || []).length, 1)
assert.doesNotMatch(home, /pagination-next/)
assert.doesNotMatch(home, /class="pagination-nav"/)
assert.doesNotMatch(home, /A-02-why-you-open-steam-and-close-it/)
assert.doesNotMatch(feed, /A-02-why-you-open-steam-and-close-it/)
assert.match(feed, /00-player-is-not-infinite/)
assert.match(archivedStory, /Why You Open Steam and Close It Five Minutes Later/)
assert.match(newStory, /Games &amp; Choice/)
assert.match(jaNewStory, /ゲームと選択/)
assert.match(zhNewStory, /遊戲與選擇/)
assert.match(zhHome, /關於 AI、無障礙、遊戲/)
assert.match(zhHome, /關於能動性的文章/)
assert.match(zhHome, /Bright Raven[\s\S]*研究並製作/)
assert.doesNotMatch(home, /Maida is a free, open-source tool/)
assert.doesNotMatch(home, /class="post-list"/)
assert.match(home, /class="presentation-switch"/)
assert.match(home, />Visual presentation</)
assert.match(home, /data-presentation="articles"/)
assert.match(home, /src="\/assets\/presentation\.js"/)
assert.match(home, /class="story-calligraphy" aria-hidden="true"/)
assert.equal((home.match(/class="story-card-calligraphy" aria-hidden="true"/g) || []).length, 1)
assert.match(zhHome, />視覺呈現</)
assert.match(zhHome, />文章</)
assert.equal((zhHome.match(/class="story-card"/g) || []).length, 1)
assert.doesNotMatch(zhHome, /pagination-next/)
assert.doesNotMatch(zhHome, /class="pagination-nav"/)
assert.doesNotMatch(style, /\.story-grid-rows-3:has\(\.story-row-1:is\(:hover/)
assert.doesNotMatch(style, /\.story-grid-rows-3:has\(/)
assert.match(style, /\.story-grid\s*\{[^}]*grid-template-rows:\s*repeat\(3, auto\)/s)
assert.match(style, /\.story-summary,\s*\.story-meta\s*\{[^}]*opacity:\s*1/s)
assert.doesNotMatch(style, /[0-9](?:dvh|svh|vh)\b/)
assert.doesNotMatch(style, /PMingLiU|MingLiU|(^|[,\s])serif(?=[,;\s])/m)
assert.doesNotMatch(style, /font-family:\s*monospace\b/)
assert.match(style, /body\s*\{[^}]*font-family:[^;]*"Noto Sans TC"[^;]*"Noto Sans JP"[^;]*sans-serif/s)
assert.match(style, /article code\s*\{[^}]*font-family:[^;]*"Noto Sans TC"[^;]*"Noto Sans JP"[^;]*monospace/s)
assert.match(style, /@media \(max-width: 800px\)[\s\S]*\.home-intro\s*\{[^}]*flex:\s*none/s)
assert.doesNotMatch(zhHome, />undefined</)
assert.ok(zhOnlyStory.includes(`<a href="${href("/")}" lang="en"`))
assert.doesNotMatch(zhOnlyStory, /<link rel="alternate" hreflang="en"/)
assert.match(zhOnlyStory, /<pre tabindex="0">/)

const values = new Map()
const storage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
}

assert.equal(normalizePresentation("calligraphy"), "calligraphy")
assert.equal(normalizePresentation("invalid"), "articles")
assert.equal(readPresentation(storage), "articles")
assert.equal(writePresentation(storage, "calligraphy"), "calligraphy")
assert.equal(readPresentation(storage), "calligraphy")
assert.equal(readPresentation({ getItem: () => { throw new Error("blocked") } }), "articles")
assert.doesNotThrow(() => writePresentation({ setItem: () => { throw new Error("blocked") } }, "articles"))

console.log("Akatsuki build verification passed")
