import fs from "node:fs"

// Extract title from the first H1 in the markdown body, since the
// vault articles use H1 as their title rather than a frontmatter field.
function extractTitleFromInput(inputPath) {
  try {
    const content = fs.readFileSync(inputPath, "utf-8")
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : ""
  } catch {
    return ""
  }
}

export default {
  eleventyComputed: {
    title: (data) => extractTitleFromInput(data.page.inputPath),
  },
}
