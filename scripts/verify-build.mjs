import assert from "node:assert/strict"
import fs from "node:fs"

const read = (path) => fs.readFileSync(new URL(`../public/${path}`, import.meta.url), "utf8")
const prefix = process.env.PATH_PREFIX ? `/${process.env.PATH_PREFIX}` : ""
const href = (path) => `${prefix}${path}`
const assertLink = (html, path, rel) =>
  assert.ok(html.includes(`href="${href(path)}" rel="${rel}"`), `missing ${rel} link to ${href(path)}`)

const home = read("index.html")
const pageTwo = read("page/2/index.html")
const pageThree = read("page/3/index.html")
const zhHome = read("zh/index.html")
const zhPageFour = read("zh/page/4/index.html")
const firstStory = read("A-01-you-didnt-forget-the-game/index.html")
const zhOnlyStory = read("zh/F-26-friction-is-protection/index.html")

assert.match(home, /<meta name="description"/)
assert.equal((home.match(/class="story-card"/g) || []).length, 9)
assert.doesNotMatch(home, /class="post-list"/)
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

console.log("Akatsuki build verification passed")
