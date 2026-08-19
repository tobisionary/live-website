# vizit.com

The site is a static, multi-file HTML project deployed on Vercel from `main`.
Every push to `main` triggers a production deploy.

## What actually gets served

Vercel serves the **multi-file sources** at the repo root. `index.html` is the
home page, `blog.html` is `/blog`, and so on — with `cleanUrls: true`, the `.html`
extension is dropped from the public URL.

`vizit-site.html` is a single-file build of the whole site (every page, stylesheet
and script inlined into one 1.9 MB document). `vercel.json` still contains rewrites
pointing at it, but they never fire: Vercel checks the filesystem before applying a
rewrite, so a real file always wins. The bundle is therefore deployed but unused.
It is only reachable directly at `/vizit-site`.

## Blog URLs

Articles live at `/blog/<slug>`. That path is a **rewrite** to
`/blog-article?slug=<slug>`, so the address bar keeps the pretty URL. Two
consequences worth remembering when editing `blog-article.html`:

- Its links and assets must be **root-absolute** (`/css/…`, `/js/…`, `/demo`).
  A relative path resolves against `/blog/` and 404s.
- `getSlug()` reads the slug from the path as well as from `?slug=`, because a
  rewrite means the query string never reaches the browser.

`/blog-article?slug=<slug>` still serves directly, so older inbound links work.

Article content lives in `js/blog-data.js` as a seed array, cached per-visitor in
`localStorage` under the key at the top of that file. **Bump that key whenever you
change the seed**, or returning visitors keep the old cached copy.

## Rebuilding the single-file bundle

`tools/build-single-file.js` regenerates `vizit-site.html` from the sources. It is
not a plain Node script — it expects injected helpers (`readFile`, `saveFile`, `ls`,
`replaceText`, `log`) and uses top-level `await`, so it needs a small harness to run.

Since the bundle is not currently served, rebuilding it is optional; keep it in sync
if you intend to use it.

## Layout

| Path | Role |
|---|---|
| `*.html` (root) | the deployed pages |
| `solutions/` | the 11 solutions pages |
| `css/`, `js/` | shared stylesheets and scripts |
| `assets/` | images, logos, award badges, gated PDFs |
| `fonts/` | Source Serif 4 |
| `js/blog-data.js` | blog article store |
| `blog-cms.html` | internal post editor (browser-local only; edits are not saved to the repo) |
| `tools/` | the bundler and the router that ships inside the bundle |
| `_archive/`, `uploads/` | superseded material, kept for reference |

`.vercelignore` keeps `_archive/`, `uploads/`, `tools/` and docs out of the
deployment. Everything else at the root is public.

## Redirects

`vercel.json` redirects the legacy paths (`/platform`, `/api`, `/partners`,
`/support`, `/case-study/*`, …) to their current pages. Their old stub files were
deleted from the repo, so these redirects are the only thing keeping those URLs alive.

## One tradeoff

Pages render their blog content client-side from `js/blog-data.js`, so search
engines and LLM crawlers see the article shell rather than the body copy. Fine for
the rest of the site, which is static HTML; worth revisiting if organic search on
blog articles matters.
