import rssPlugin from "@11ty/eleventy-plugin-rss"
import markdownIt from "markdown-it"
import markdownItAnchor from "markdown-it-anchor"
import markdownItAttrs from "markdown-it-attrs"

export default function (eleventyConfig) {
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
  eleventyConfig.addFilter("translation", function (currentUrl, otherLang, postsEn = [], postsZh = [], fallbackToHome = true) {
    if (!currentUrl) return null
    const isZhTarget = otherLang === "zh" || otherLang === "zh-TW"
    const targetUrl = isZhTarget
      ? currentUrl.startsWith("/zh/")
        ? currentUrl
        : "/zh" + currentUrl
      : currentUrl.startsWith("/zh/")
        ? currentUrl.replace(/^\/zh/, "") || "/"
        : currentUrl

    if (targetUrl === "/" || targetUrl === "/zh/") return targetUrl

    const targetPosts = isZhTarget ? postsZh : postsEn
    const paginationMatch = targetUrl.match(/^\/(?:zh\/)?page\/(\d+)\/$/)
    if (paginationMatch) {
      const targetPageExists = Number(paginationMatch[1]) <= Math.ceil(targetPosts.length / 9)
      if (targetPageExists) return targetUrl
      return fallbackToHome ? (isZhTarget ? "/zh/" : "/") : null
    }

    if (targetPosts.some((post) => post.url === targetUrl)) return targetUrl

    return fallbackToHome ? (isZhTarget ? "/zh/" : "/") : null
  })

  // Filter draft posts in production
  eleventyConfig.addCollection("postsEn", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/en/posts/*.md")
      .filter((p) => p.data.draft !== true)
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999))
  })

  eleventyConfig.addCollection("postsZh", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/zh/posts/*.md")
      .filter((p) => p.data.draft !== true)
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999))
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
