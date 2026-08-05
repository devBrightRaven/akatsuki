import rssPlugin from "@11ty/eleventy-plugin-rss"
import markdownIt from "markdown-it"
import markdownItAnchor from "markdown-it-anchor"
import markdownItAttrs from "markdown-it-attrs"

export default function (eleventyConfig) {
  const shelfPostSlugs = new Set([
    "00-player-is-not-infinite",
    "01-buying-is-easier-than-playing",
    "02-platforms-never-run-out-of-games",
  ])

  // Markdown engine with anchor links and attribute support
  const md = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
  })
    .use(markdownItAnchor, {
      level: [2, 3],
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true,
      }),
    })
    .use(markdownItAttrs)

  const renderFence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) =>
    renderFence(...args).replace("<pre>", '<pre tabindex="0">')

  eleventyConfig.setLibrary("md", md)

  // RSS feed
  eleventyConfig.addPlugin(rssPlugin)

  // Pass through static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" })

  // Date filter (yyyy-mm-dd)
  eleventyConfig.addFilter("isoDate", (d) =>
    new Date(d).toISOString().split("T")[0]
  )

  eleventyConfig.addFilter("localizedDate", (d, lang = "en") => {
    const locale = { en: "en-US", ja: "ja-JP", "zh-TW": "zh-TW" }[lang] ?? "en-US"
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: lang === "en" ? "short" : "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(d))
  })

  // Reading time (rough estimate: 200 wpm English, 400 chars/min Chinese)
  eleventyConfig.addFilter("readingTime", (text) => {
    if (!text) return ""
    const cjkChars = (text.match(/[一-鿿]/g) || []).length
    const enWords = text.replace(/[一-鿿]/g, "").split(/\s+/).length
    const minutes = Math.max(
      1,
      Math.ceil(cjkChars / 400 + enWords / 200)
    )
    return minutes
  })

  // Language switcher: find translation of current page
  eleventyConfig.addFilter("translation", function (currentUrl, otherLang, postsEn = [], postsJa = [], postsZh = [], fallbackToHome = true) {
    if (!currentUrl) return null
    const targetLang = otherLang === "zh" ? "zh-TW" : otherLang
    const localePrefix = { en: "", ja: "/ja", "zh-TW": "/zh" }
    const homeUrl = { en: "/", ja: "/ja/", "zh-TW": "/zh/" }
    const targetPosts = { en: postsEn, ja: postsJa, "zh-TW": postsZh }[targetLang]
    if (!targetPosts || !(targetLang in localePrefix)) return null

    const unprefixedUrl = currentUrl.replace(/^\/(?:ja|zh)(?=\/)/, "") || "/"
    const targetUrl = localePrefix[targetLang] + unprefixedUrl

    if (targetUrl === homeUrl[targetLang]) return targetUrl

    const paginationMatch = targetUrl.match(/^\/(?:(?:ja|zh)\/)?page\/(\d+)\/$/)
    if (paginationMatch) {
      const targetPageExists = Number(paginationMatch[1]) <= Math.ceil(targetPosts.length / 9)
      if (targetPageExists) return targetUrl
      return fallbackToHome ? homeUrl[targetLang] : null
    }

    if (targetPosts.some((post) => post.url === targetUrl)) return targetUrl

    return fallbackToHome ? homeUrl[targetLang] : null
  })

  // Keep every published URL available, but only place reviewed entries on
  // the main shelf, in feeds, and in previous/next navigation.
  eleventyConfig.addCollection("allPostsEn", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/en/posts/*.md")
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  })

  eleventyConfig.addCollection("allPostsZh", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/zh/posts/*.md")
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  })

  eleventyConfig.addCollection("allPostsJa", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/ja/posts/*.md")
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  })

  eleventyConfig.addCollection("postsEn", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/en/posts/*.md")
      .filter((p) => shelfPostSlugs.has(p.fileSlug))
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  })

  eleventyConfig.addCollection("postsZh", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/zh/posts/*.md")
      .filter((p) => shelfPostSlugs.has(p.fileSlug))
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  })

  eleventyConfig.addCollection("postsJa", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/ja/posts/*.md")
      .filter((p) => shelfPostSlugs.has(p.fileSlug))
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  })

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
    pathPrefix: process.env.PATH_PREFIX ? `/${process.env.PATH_PREFIX}/` : "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  }
}
