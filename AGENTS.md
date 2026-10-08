# Agent instructions

This repository is an **Astro** landing page for [One9x Pages](https://one9x.com),
a static host, with a waitlist form that posts to One9x Forms. Everything below
is specific to this repo; the general platform docs are at
<https://one9x.com/docs> and as markdown at <https://one9x.com/llms.txt>.

## The one thing to know

| | |
| --- | --- |
| Build | `npm run build` |
| Output folder | `dist` |
| Needs `--spa` | no — never pass it |
| Error page | `--error 404:/404.html` |
| Live demo | <https://astro-landing.one9x.app/> |

## Deploying

**Prefer the MCP server over the shell.** The One9x CLI is itself an MCP server —
`one9x mcp` speaks MCP over stdin/stdout — so a deploy is one tool call with no
shell glue. Register it once:

```sh
claude mcp add one9x -- one9x mcp
```

Then use the `release` tool with `dir: dist`, `site: <the site>`.

Without MCP, the same thing in the shell:

```sh
SITE_URL=https://<the site>.one9x.app npm run build
one9x pages release ./dist --site <the site> --error 404:/404.html --deploy
```

Leave `--deploy` off to stage instead: the release uploads and gets its own
preview URL at `v<n>--<site>.one9x.app`, and production keeps serving what it
serves now. `one9x pages deploy --site <site> --to v<n>` publishes it later, and
the same command with an earlier `v<n>` is how a rollback works.

**CI does this already.** `.github/workflows/deploy.yml` deploys on every push
once two settings exist (Settings → Secrets and variables → Actions): the
variable `ONE9X_SITE` and the secret `ONE9X_TOKEN`. Until `ONE9X_SITE` is set the
job is skipped, not failed. Prefer letting CI deploy over deploying by hand.

## The waitlist form

`src/components/WaitlistForm.astro` is a plain HTML form posting to
`/_one9x/forms/waitlist`, the form endpoint every Pages site answers itself. It
is the markup the dashboard generates for a form named `waitlist` with one
required Email field named `email`, captcha on, plus a hidden `_next=/thanks`.

- **It needs a one-time dashboard step** before it accepts anything: the site's
  Forms settings → turn on "Accept form submissions" → New form `waitlist` → one Email
  field named `email`, required → captcha on. Until then every post is a 404.
  You cannot do this from the repo; tell the user to do it (the README has the
  steps and the JSON Schema).
- **Field names are the contract.** A post containing a field the dashboard does
  not define is refused. Never rename `email` or add an input without the user
  adding the matching field in the dashboard first.
- **Keep the control fields exactly as they are:** the hidden `_gotcha`
  honeypot, the `<altcha-widget auto="onsubmit" challenge="/_one9x/captcha/challenge">`
  INSIDE the form, and `<script type="module" src="/_one9x/altcha.js">`. Do not
  add JavaScript that submits the form; it posts on its own.
- `_next` must be a same-site path. Anything else is ignored.
- It does not work under `npm run dev` — `/_one9x/` only exists on Pages. Test
  on a preview URL.
- Submissions are read in the dashboard (the form's own page) or from the API;
  see <https://one9x.com/docs/widgets.md>.

## Rules for this repo

- Astro's default output is static. Do NOT add an adapter or set `output: 'server'` — either produces a build that needs a runtime.
- `site` in `astro.config.mjs` comes from `SITE_URL`. CI sets it to `https://<ONE9X_SITE>.one9x.app`, or to the repo variable `SITE_URL` once the user links a custom domain. It is baked into canonical and social-card URLs.
- Product name, tagline and description live in `src/site.ts`; the accent colour is `--accent` in `src/layouts/Layout.astro`. Change them there, not page by page.
- Never pass `--spa`. Astro writes a real HTML file per route.
- No external requests: no web fonts, CDNs or analytics unless the user asks — and if they do, `src/pages/privacy.astro` must say so.

## General

- The site name is a DNS label (lowercase letters, digits, hyphens) and becomes
  `<name>.one9x.app`. Create it before deploying: `one9x pages create <name>`. A
  release will not create one.
- Dot-paths are never uploaded — `.git`, `.env`, anything starting with a dot.
  `.well-known` is the one exception. A top-level `_one9x/` folder is also left
  out: that path belongs to the platform.
- `--exclude` globs are single-segment `path.Match`. `**` is not supported and
  matches nothing rather than erroring.
- Pages serves **paths, not routes**: `/about` is served `/about/index.html`. A
  build that wrote `about.html` instead 404s on every internal link while the
  homepage works.
- Re-deploying unchanged content is free and safe — the version id is a content
  hash, so an identical build produces an identical version and uploads nothing.
- Nothing here needs a server. If a change would require one, it is the wrong
  change for this repo.
