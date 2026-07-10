import assert from "node:assert/strict"
import fs from "node:fs"

const read = (path) => fs.readFileSync(new URL(`../public/${path}`, import.meta.url), "utf8")

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
assert.match(home, /href="\/page\/2\/" rel="next"/)
assert.equal((pageTwo.match(/class="story-card"/g) || []).length, 9)
assert.match(pageTwo, /href="\/" rel="prev"/)
assert.match(pageTwo, /href="\/page\/3\/" rel="next"/)
assert.equal((pageThree.match(/class="story-card"/g) || []).length, 7)
assert.doesNotMatch(pageThree, /pagination-next/)
assert.doesNotMatch(zhHome, />undefined</)
assert.equal((zhPageFour.match(/class="story-card"/g) || []).length, 3)
assert.match(zhPageFour, /<a href="\/" lang="en"/)
assert.doesNotMatch(zhPageFour, /<link rel="alternate" hreflang="en"/)
assert.match(firstStory, /rel="next"/)
assert.match(zhOnlyStory, /<a href="\/" lang="en"/)
assert.doesNotMatch(zhOnlyStory, /<link rel="alternate" hreflang="en"/)
assert.match(zhOnlyStory, /<pre tabindex="0">/)

console.log("Akatsuki build verification passed")
