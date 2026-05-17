# Akatsuki · Bright Raven 部落格

> 暁 / Dawn — 霧（Asagiri）散開後想通的時刻寫下來。

Bilingual essay blog about decision paralysis, agency, friction philosophy, and product constitution. Source for `blog.brightraven.world`.

## Family

Akatsuki 在 Bright Raven 認知工作流家族裡的位置：

| Stage | Product | 認知 moment |
|---|---|---|
| 1 | Maida | 每天的「選還是不選」|
| 2 | Asagiri | 每早霧中的十視角換位 |
| 3 | **Akatsuki** | **霧散後想通的時刻，寫下來** |
| 4 | Furikaeri | 每週回看寫下的東西 |
| 5 | Mandara | 在所有路徑中找位置 |

## Stack

- Eleventy 3.x
- Bilingual: English (`src/en/posts/`) + Chinese (`src/zh/posts/`)
- Content lives in vault, synced via `scripts/sync-from-vault.ps1`
- Markdown with `markdown-it-anchor` + `markdown-it-attrs`
- RSS via `@11ty/eleventy-plugin-rss`

## Workflow

```bash
npm install
npm run dev              # local preview (http://localhost:8080)
npm run build            # production build to public/
PATH_PREFIX=akatsuki npm run build   # build for GitHub Pages subpath
```

## Content source

文章在 vault：

```
D:\Obsidian\br-os-vault\4 BuildInPublic\bright-raven-world\blog\brightraven.world\
```

每次 build 前自動 sync。English 檔 `*.md` → `src/en/posts/`，Chinese 檔 `*.zh.md` → `src/zh/posts/`（`.zh.md` suffix 自動剝離）。

## Article series

| Prefix | Theme |
|---|---|
| A | 遊戲記憶 / 庫存焦慮 |
| B | Pile of shame / 罪惡感 |
| C | 演算法 / 個人化 |
| D | 心情 / 注意力 |
| E | 選擇焦慮 |
| F | 哲學 / 反推薦 |
| G | 產品憲法 / 容器邊界 |

A 到 F-25 是 closed 25-article series。F-26+ 跟 G 系列是後續延伸。

## Deploy

- **GitHub Pages**: 自動 deploy on push to `main`（見 `.github/workflows/deploy.yml`）。Preview at `https://devbrightraven.github.io/akatsuki/`
- **Cloudflare Pages** (future): 之後 DNS 切到 `blog.brightraven.world`，pathPrefix 自動為空。

## License

MIT — but article content is © Bertram (Bright Raven).
