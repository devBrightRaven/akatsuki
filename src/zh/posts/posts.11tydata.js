import fs from "node:fs"

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
