// Runs after `vite build`. The site is a React SPA, so the HTML Vite emits is
// an empty <div id="root">. Search engines cope, but AI crawlers (GPTBot,
// ClaudeBot, PerplexityBot…) don't run JavaScript and see a blank page.
//
// This writes, for each public route, an index.html with its own title,
// description, canonical URL and JSON-LD, plus the page's real text inside
// #root. React's createRoot replaces that text on load, so visitors still get
// the animated app; crawlers get the same words as readable HTML.
// It also writes llms.txt — a plain-text guide to LifeKit for AI assistants.
// All copy comes from src/locales/en.json so it stays in sync with the site.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://www.lifekithub.com'
const EMAIL = 'hello@lifekithub.com'
const t = JSON.parse(readFileSync(join(root, 'src/locales/en.json'), 'utf8').replace(/^\uFEFF/, ''))
const shell = readFileSync(join(dist, 'index.html'), 'utf8')

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`
const faqPairs = Object.keys(t.faq).filter((k) => /^q\d+$/.test(k)).map((q) => [t.faq[q], t.faq[`a${q.slice(1)}`]])

// ── Shared structured data ───────────────────────────────────────────────────
const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LifeKit',
  legalName: 'Rosclan LLC',
  url: SITE,
  logo: `${SITE}/icon-512.png`,
  email: EMAIL,
  address: { '@type': 'PostalAddress', addressLocality: 'Tbilisi', addressCountry: 'GE' },
  areaServed: { '@type': 'Country', name: 'Georgia' },
  description: t.footer.tagline,
}
const website = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'LifeKit', url: SITE, inLanguage: ['en', 'ka', 'ru'] }
const app = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'LifeKit',
  operatingSystem: 'iOS, Android',
  applicationCategory: 'LifestyleApplication',
  description: t.intro.text,
  url: SITE,
  inLanguage: ['en', 'ka', 'ru'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'LifeKit', url: SITE },
}
const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqPairs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

// ── Page bodies (plain semantic HTML) ────────────────────────────────────────
const nav = `<nav><a href="/">LifeKit</a> · <a href="/#explore">${esc(t.nav.explore)}</a> · <a href="/services">Services</a> · <a href="/providers">${esc(t.nav.forProviders)}</a> · <a href="/#about">${esc(t.nav.about)}</a></nav>`
const footer = `<footer><p>${esc(t.footer.tagline)}</p><p>${esc(t.footer.company)} Contact: <a href="mailto:${EMAIL}">${EMAIL}</a></p><p><a href="/privacy">${esc(t.footer.link8)}</a> · <a href="/terms">${esc(t.footer.link9)}</a> · <a href="/delete-account">Delete account</a></p></footer>`
const faqHtml = `<section id="faq"><h2>${esc(t.faq.title)}</h2>${faqPairs.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>`
const trustHtml = `<section id="trust"><h2>${esc(t.trust.title)}</h2><p>${esc(t.trust.intro)}</p>${[1, 2, 3, 4, 5].map((i) => `<h3>${esc(t.trust[`i${i}Title`])}</h3><p>${esc(t.trust[`i${i}Desc`])}</p>`).join('')}<p>${esc(t.trust.disclaimer)}</p></section>`

const home = `${nav}<main>
<header><h1>${esc(t.hero.titlePart1)} ${esc([t.hero.flipWord1, t.hero.flipWord2, t.hero.flipWord3, t.hero.flipWord4].join(', '))}.</h1><p>${esc(t.hero.subtitle)}</p><p>${esc(t.hero.note)}</p></header>
<section id="about"><h2>${esc(t.intro.title)}</h2><p>${esc(t.intro.text)}</p></section>
<section id="explore"><h2>${esc(t.features.title)}</h2>${[1, 2, 3, 4].map((i) => `<h3>${esc(t.features[`f${i}Title`])}</h3><p>${esc(t.features[`f${i}Desc`])}</p>`).join('')}<p>${esc(t.features.note)}</p><p><a href="/services">Browse the services currently offered on LifeKit</a></p></section>
<section><h2>${esc(t.process.title)}</h2><ol>${[1, 2, 3].map((i) => `<li><strong>${esc(t.process[`step${i}Title`])}</strong>: ${esc(t.process[`step${i}Desc`])}</li>`).join('')}</ol></section>
<section><h2>${esc(t.scenarios.title)}</h2>${[1, 2, 3].map((i) => `<h3>${esc(t.scenarios[`s${i}Title`])}</h3><p>${esc(t.scenarios[`s${i}Desc`])}</p>`).join('')}</section>
<section><h2>${esc(t.gracy.title)}</h2><p>${esc(t.gracy.text)}</p><p>${esc(t.gracy.note)}</p></section>
${trustHtml}
<section id="providers"><h2>${esc(t.providerCta.title)}</h2><p>${esc(t.providerCta.text)}</p><ul>${[1, 2, 3, 4].map((i) => `<li>${esc(t.providerCta[`p${i}`])}</li>`).join('')}</ul><p><a href="/providers">${esc(t.providerCta.learnMore)}</a></p></section>
${faqHtml}
<section><h2>${esc(t.finalCta.title1)}</h2><p>${esc(t.finalCta.subtitle)}</p></section>
</main>${footer}`

const providers = `${nav}<main>
<header><h1>${esc(t.providerHero.titlePart1)} ${esc(t.providerHero.titlePart2)}</h1><p>${esc(t.providerHero.subtitle)}</p><p>${esc(t.providerHero.note)}</p><p><a href="/register">${esc(t.providerHero.ctaPrimary)}</a></p></header>
<section><h2>${esc(t.bookings.title1)} ${esc(t.bookings.titleHighlight)}</h2><p>${esc(t.bookings.subtitle)}</p>${[1, 2, 3].map((i) => `<h3>${esc(t.bookings[`feature${i}Title`])}</h3><p>${esc(t.bookings[`feature${i}Desc`])}</p>`).join('')}</section>
<section><h2>${esc(t.aiTools.title)}</h2><p>${esc(t.aiTools.subtitle)}</p>${[1, 2, 3, 4, 5].map((i) => `<h3>${esc(t.aiTools[`tool${i}Title`])}</h3><p>${esc(t.aiTools[`tool${i}Desc`])}</p>`).join('')}</section>
${faqHtml}
<section><h2>${esc(t.providerFinalCta.title1)} ${esc(t.providerFinalCta.title2)}</h2><p>${esc(t.providerFinalCta.subtitle)}</p><p>${esc(t.providerFinalCta.note)}</p></section>
</main>${footer}`

const legal = (title, text) => `${nav}<main><h1>${esc(title)}</h1><p>${esc(text)}</p></main>${footer}`

const pages = [
  {
    path: '/',
    title: 'LifeKit — Your life, connected | Services, communities & places in Georgia',
    description: 'LifeKit is one app to discover local services, connect with people, join communities and explore places in Georgia. Book services, offer your skills or swap skills — with Gracy, your guide.',
    body: home,
    jsonld: [organization, website, app, faqPage],
  },
  {
    path: '/providers',
    title: 'LifeKit for Providers — List your services and get booked',
    description: 'Offer your services on LifeKit: list a service in minutes, get booked by people nearby, swap skills and use smart tools. 3% commission for your first 90 days.',
    body: providers,
    jsonld: [organization, faqPage],
  },
  { path: '/privacy', title: 'Privacy Policy · LifeKit', description: 'How LifeKit (Rosclan LLC) collects, uses and protects your personal data.', body: legal('Privacy Policy', 'How LifeKit collects, uses and protects your personal data.'), jsonld: [organization] },
  { path: '/terms', title: 'Terms of Service · LifeKit', description: 'The terms that apply when you use LifeKit to find, book or offer services.', body: legal('Terms of Service', 'The terms that apply when you use LifeKit to find, book or offer services.'), jsonld: [organization] },
  { path: '/delete-account', title: 'Delete your LifeKit account', description: 'How to delete your LifeKit account and what happens to your data.', body: legal('Delete your LifeKit account', 'How to delete your LifeKit account and what happens to your data.'), jsonld: [organization] },
]

// Shown only for the moment before the app's JavaScript loads (and to crawlers).
const PRERENDER_CSS = '<style>.prerender{max-width:760px;margin:0 auto;padding:32px 16px;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1f1f24}.prerender h1{font-size:2rem;line-height:1.2}.prerender h2{color:#89273B;margin-top:2em}.prerender a{color:#89273B}.prerender nav{font-weight:600}</style>'

const setMeta = (html, { path, title, description }) => {
  const url = `${SITE}${path === '/' ? '/' : path}`
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
}

for (const page of pages) {
  let html = setMeta(shell, page)
  html = html.replace('</head>', `${page.jsonld.map(ld).join('\n')}\n${PRERENDER_CSS}\n</head>`)
  html = html.replace('<div id="root"></div>', `<div id="root"><div class="prerender">${page.body}</div></div>`)
  const out = page.path === '/' ? join(dist, 'index.html') : join(dist, page.path.slice(1), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

// ── llms.txt ─────────────────────────────────────────────────────────────────
const llms = `# LifeKit

> ${t.footer.tagline} LifeKit is an app for iPhone and Android, built for people living in Georgia (the country, in the South Caucasus) — locals and newcomers alike. It is available in English, Georgian and Russian.

${t.intro.text}

## What you can do
${[1, 2, 3, 4].map((i) => `- ${t.features[`f${i}Title`]}: ${t.features[`f${i}Desc`]}`).join('\n')}
- Skill Swap: ${t.faq.a4}
- Gracy: ${t.gracy.text}

## How it works
${[1, 2, 3].map((i) => `${i}. ${t.process[`step${i}Title`]}: ${t.process[`step${i}Desc`]}`).join('\n')}

## Services currently on LifeKit
- [Service directory](${SITE}/services): every active service, grouped by category, with prices. Updated continuously.
- [Machine-readable directory](${SITE}/services.json): the same list as JSON.

## For service providers
- [LifeKit for Providers](${SITE}/providers): ${t.providerCta.text}
- Pricing: ${t.faq.a2}

## Trust & safety
${[1, 2, 3, 4, 5].map((i) => `- ${t.trust[`i${i}Title`]}: ${t.trust[`i${i}Desc`]}`).join('\n')}
- ${t.trust.disclaimer}

## FAQ
${faqPairs.map(([q, a]) => `- ${q} ${a}`).join('\n')}

## Company
- ${t.footer.company}
- Contact: ${EMAIL}
- [Privacy Policy](${SITE}/privacy) · [Terms of Service](${SITE}/terms)
`
writeFileSync(join(dist, 'llms.txt'), llms)

console.log(`prerendered ${pages.length} pages + llms.txt`)
