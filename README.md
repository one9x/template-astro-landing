# Astro landing page on One9x Pages

A one-page launch site with a working waitlist, wired to deploy to
[One9x Pages](https://one9x.com) on every push. **Use this template**, rename
the product, and you have a page that collects sign-ups — with no backend, no
form service to sign up for, and no API key.

Live demo: **[astro-landing.one9x.app](https://astro-landing.one9x.app/)**

- Hero, features, how-it-works, quotes, FAQ and a closing call to action
- A waitlist form that posts to One9x Forms, with a spam check that runs in the
  visitor's browser and is served from your own domain
- A thank-you page, a privacy page to start from, and a 404
- Light and dark, readable on a phone, no JavaScript of its own, no external
  requests

```sh
npm run build
one9x pages release ./dist --site mysite --error 404:/404.html --deploy
```

No `--spa`: the build writes a real HTML file per route, so an unmatched path
genuinely is a 404 and says so.

## Make it yours

| What | Where |
| --- | --- |
| Product name, tagline, description | `src/site.ts` |
| The colour of every button and link | `--accent` at the top of `src/layouts/Layout.astro` |
| Features, steps, quotes, FAQ | the arrays at the top of `src/pages/index.astro` |
| The product sketch beside the headline | the `<figure class="mock">` in `src/pages/index.astro` — swap in a screenshot when you have one |
| Logo and favicon | the `<svg class="mark">` in `Layout.astro`, and `public/favicon.svg` |
| Social card | `public/og.png`, 1200×630 |

Then delete what only the template needs:

- the `<aside class="template-note">` bar at the top of `Layout.astro`
- the placeholder quotes in `index.astro` — replace them with real ones, or
  remove the section; an empty one reads worse than none
- the footer line `Deployed on One9x Pages` in `Layout.astro`, if you like.
  It is one `<p class="credit">`, and nothing depends on it

`src/pages/privacy.astro` describes what this template collects (one email
address) and nothing more. It is a starting point, not legal advice — edit it
before launch, and again whenever the site starts collecting something else.

## Turn on the waitlist

The form in `src/components/WaitlistForm.astro` posts to
`/_one9x/forms/waitlist`. Every site on One9x Pages answers that path itself, so
there is nothing to deploy — but forms are **off until you turn them on**, and
the form has to exist. Once, in the dashboard at
[portal.one9x.com](https://portal.one9x.com):

1. Open the site's **Forms** settings.
2. Turn on **Accept form submissions**.
3. **New form**, named `waitlist`.
4. Add one field: type **Email**, name `email`, **required**.
5. Leave **Require a captcha** on, and save.

Or paste this into the form's JSON Schema editor instead of steps 4–5:

```json
{
  "type": "object",
  "properties": { "email": { "type": "string", "title": "Email", "format": "email" } },
  "required": ["email"],
  "additionalProperties": false
}
```

Sign-ups appear on the form's own page in the dashboard, newest first. Submit
the form once yourself after the first deploy and check it arrives.

**What a visitor sees.** They press the button, the spam check solves in well
under a second, and they land on `/thanks`. If the email is not valid they get
a page saying which field was wrong. Every plan includes a Forms plan — 250
submissions a month on Free; over it, submissions are kept but locked until you
upgrade or the month turns. The limits are in the
[Forms docs](https://one9x.com/docs/widgets).

**Before you turn it on**, a visitor can fill the form in but the submit fails
with a 404 — so turn it on before you share the link.

**Under `npm run dev` it does nothing.** `/_one9x/` only exists on Pages, so
locally the spam check says "Verification failed" and nothing is sent. Use a
preview URL (any pull request gets one) to test it for real.

**If you change the form**, keep it in step with the dashboard: `name="email"` is
the contract, and a post with a field the dashboard does not know is refused.
Add a field in the dashboard first, then add the matching input. Keep the
`_gotcha` input, the `<altcha-widget>` inside the form and the `altcha.js`
script as they are.

## Turn on the deploy workflow

`.github/workflows/deploy.yml` is already here. It needs two settings, both
under **Settings → Secrets and variables → Actions**:

| | Name | Value |
| --- | --- | --- |
| Variable | `ONE9X_SITE` | the site to deploy to |
| Secret | `ONE9X_TOKEN` | `one9x tokens create "github actions"` |

Create the site first:

```sh
one9x pages create mysite
```

Until `ONE9X_SITE` exists the job is **skipped**, not failed — a fresh copy of
this template should not open with a red X.

Once both are set: a pull request stages a release and comments the preview
URL, and a push to `main` publishes.

## Custom domain

The workflow builds with `SITE_URL=https://<ONE9X_SITE>.one9x.app`, which is
what goes into canonical links and the social card. Once you
[link a domain](https://one9x.com/docs/domains), add a third repo variable,
`SITE_URL`, set to `https://yourdomain.com`. For a local build you mean to
ship, set it in the environment: `SITE_URL=https://yourdomain.com npm run build`.

## Local development

```sh
npm install
npm run dev
```

## Docs

- [Forms](https://one9x.com/docs/widgets) — fields, limits, the captcha, and
  reading submissions from the API
- [Astro on One9x Pages](https://one9x.com/docs/frameworks/astro)
- [GitHub Actions](https://one9x.com/docs/github-actions)

## License

MIT
