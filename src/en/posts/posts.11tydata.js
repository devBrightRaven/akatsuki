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

function extractDescriptionFromInput(inputPath) {
  try {
    const content = fs.readFileSync(inputPath, "utf-8")
    const match = content.match(/^#\s+.+\r?\n(?:\r?\n)+([\s\S]*?)(?:\r?\n\r?\n|$)/m)
    return match ? match[1].replace(/\s+/g, " ").trim() : ""
  } catch {
    return ""
  }
}

function displayTitleFromInput(inputPath) {
  return extractTitleFromInput(inputPath).replace(/^\d+\s*·\s*/, "")
}

export default {
  eleventyComputed: {
    title: (data) => extractTitleFromInput(data.page.inputPath),
    displayTitle: (data) => displayTitleFromInput(data.page.inputPath),
    description: (data) => data.summary || extractDescriptionFromInput(data.page.inputPath),
    storyNumber: (data) => data.order !== undefined && data.order !== null
      ? String(data.order).padStart(2, "0")
      : data.page.fileSlug.match(/^[A-Z]-\d+/)?.[0].replace("-", "") || "—",
  },
}
