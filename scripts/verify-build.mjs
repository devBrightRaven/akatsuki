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
const assertLink = (html, path, rel) =>
  assert.ok(html.includes(`href="${href(path)}" rel="${rel}"`), `missing ${rel} link to ${href(path)}`)

const home = read("index.html")
const feed = read("feed.xml")
const pageTwo = read("page/2/index.html")
const pageThree = read("page/3/index.html")
const jaHome = read("ja/index.html")
const jaFeed = read("ja/feed.xml")
const zhHome = read("zh/index.html")
const zhFeed = read("zh/feed.xml")
const style = read("assets/style.css")
const zhPageFour = read("zh/page/4/index.html")
const firstStory = read("A-01-you-didnt-forget-the-game/index.html")
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
assert.doesNotMatch(jaHome, /class="presentation-switch"/)
assert.match(jaFeed, /<feed[\s\S]*xml:lang="ja"/)
assert.match(jaFeed, /<updated>\d{4}-\d{2}-\d{2}T/)
assert.match(jaHome, /<link rel="alternate" type="application\/rss\+xml" href="\/ja\/feed\.xml"/)
assert.match(jaHome, /<a class="site-title" href="\/ja\/"/)
assert.ok(jaHome.includes(`href="${href("/")}" lang="en"`))
assert.ok(jaHome.includes(`href="${href("/zh/")}" lang="zh-TW"`))
assert.ok(firstStory.includes(`href="${href("/ja/")}" lang="ja"`))
assert.equal((home.match(/class="story-card"/g) || []).length, 9)
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
assert.equal((home.match(/class="story-card-calligraphy" aria-hidden="true"/g) || []).length, 9)
assert.match(zhHome, />視覺呈現</)
assert.match(zhHome, />文章</)
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
assertLink(home, "/page/2/", "next")
assert.equal((pageTwo.match(/class="story-card"/g) || []).length, 9)
assertLink(pageTwo, "/", "prev")
assertLink(pageTwo, "/page/3/", "next")
assert.equal((pageThree.match(/class="story-card"/g) || []).length, 7)
assert.doesNotMatch(pageThree, /pagination-next/)
assert.doesNotMatch(zhHome, />undefined</)
assert.equal((zhPageFour.match(/class="story-card"/g) || []).length, 3)
assert.ok(zhPageFour.includes(`<a href="${href("/")}" lang="en"`))
assert.doesNotMatch(zhPageFour, /<link rel="alternate" hreflang="en"/)
assert.match(firstStory, /rel="next"/)
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
