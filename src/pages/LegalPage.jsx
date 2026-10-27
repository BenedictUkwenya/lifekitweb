import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// ── Company details (must match the Georgian business registry extract) ─────
const LEGAL_ENTITY = 'Rosclan LLC'
const COMPANY_ID = '400486755'
const LEGAL_ADDRESS =
  'Niko Ketskhoveli str. N16, entrance N1, floor 10, apt. N58, Gldani district, Tbilisi, Georgia'
const JURISDICTION = 'Georgia'
const CONTACT_EMAIL = 'hello@lifekithub.com'
const LAST_UPDATED = 'October 27, 2026'

const company = (
  <>
    {LEGAL_ENTITY}, a limited liability company registered in {JURISDICTION} (identification code {COMPANY_ID}),
    with its registered address at {LEGAL_ADDRESS}
  </>
)

const mail = <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#89273B] underline">{CONTACT_EMAIL}</a>

const PRIVACY = {
  title: 'Privacy Policy',
  intro: (
    <>
      This policy explains what information {company} (“LifeKit”, “we”, “us”), collects when you use the
      LifeKit mobile app, website and related services (the “Service”), how we use it, and the choices you have.
      {LEGAL_ENTITY} is the controller of your personal information. We do not sell your personal information and
      we do not show third-party advertising.
    </>
  ),
  sections: [
    {
      h: 'Information you give us',
      list: [
        'Account details: your name, email address and password (passwords are stored hashed by our authentication provider and are never visible to us).',
        'Profile details you choose to add: username, phone number, bio, job title, profile photo and country.',
        'Provider details: the services you list, their descriptions, prices, options, photos and availability.',
        'Activity on the Service: bookings, skill-swap requests, messages exchanged in booking chats, posts, comments, likes, community (group) content, reviews and ratings.',
        'Support and safety: support tickets, user reports, dispute reasons and any details you include.',
        'Prompts and content you submit to AI-powered features (for example the AI assistant, service generator or onboarding plan).',
      ],
    },
    {
      h: 'Information collected automatically',
      list: [
        'Approximate or precise location, only while you use the app and only if you grant permission. It is used to show nearby places, services and events. You can turn it off at any time in your device settings.',
        'Basic technical data needed to run the Service, such as your device platform (iOS, Android or web), language preference, and server logs (IP address, request time, errors) kept for security and troubleshooting.',
      ],
    },
    {
      h: 'Payments',
      p: (
        <>
          Card payments, wallet top-ups and provider payouts are processed by Stripe. Your full card number is sent
          directly to Stripe and never stored on our servers. We keep a record of transactions (amount, type, date,
          status) and your LifeKit wallet balance. Providers who receive payouts complete identity verification with
          Stripe Connect, under Stripe’s own privacy policy.
        </>
      ),
    },
    {
      h: 'How we use information',
      list: [
        'To create and secure your account and provide the Service, including bookings, payments, wallet, messaging and communities.',
        'To show your public profile, services, posts, reviews and ratings to other users.',
        'To send you service emails and in-app notifications (for example booking updates, password resets and receipts).',
        'To keep the community safe: reviewing reports, resolving disputes, and suspending accounts that break our Terms.',
        'To power optional AI features you choose to use.',
        'To understand aggregate usage (for example number of bookings per category) and improve the Service.',
        'To comply with legal, tax and accounting obligations.',
      ],
    },
    {
      h: 'Who we share information with',
      p: 'We share information only as needed to run the Service:',
      list: [
        'Other users: information you make public (profile, services, posts, reviews) and, for a booking, the details the other party needs to complete it.',
        'Supabase — database, authentication and file storage.',
        'Vercel — hosting of our servers and website.',
        'Stripe — payment processing and provider payouts.',
        'Google (Gemini API) — processes the text you submit to AI features in order to generate a response.',
        'Resend — delivery of transactional emails.',
        'OpenStreetMap (Overpass API) — receives map coordinates to look up nearby places; no account information is sent.',
        'Authorities or other parties when required by law, to enforce our Terms, or to protect the rights and safety of users and the public.',
        'A successor entity if LifeKit is involved in a merger, acquisition or sale of assets, subject to this policy.',
      ],
    },
    {
      h: 'How long we keep information',
      p: (
        <>
          We keep your information while your account is active. When you delete your account, we delete or
          anonymise your personal information within 30 days, except records we must keep for legal, tax,
          fraud-prevention or dispute purposes (such as transaction records), which are kept only as long as required.
        </>
      ),
    },
    {
      h: 'Your choices and rights',
      list: [
        'Access and update your profile at any time in the app.',
        'Delete your account in the app under Profile → Security → Delete account.',
        <>Request a copy of your data, correction, or deletion, or object to processing, by emailing {mail}. We respond within 30 days.</>,
        'Turn off location access and notifications in your device settings.',
        'Block or report other users from their posts or chats.',
      ],
      after: 'You may also lodge a complaint with the Personal Data Protection Service of Georgia or, depending on where you live (for example the EU/EEA or UK), with your local data-protection authority.',
    },
    {
      h: 'Security',
      p: 'We use encryption in transit (HTTPS), hashed passwords, secure on-device storage for login tokens, and access controls on our systems. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.',
    },
    {
      h: 'International transfers',
      p: 'Our service providers may process data in countries other than yours, including the United States and the EU. Where required, these transfers are protected by appropriate safeguards such as standard contractual clauses.',
    },
    {
      h: 'Children',
      p: <>The Service is not intended for anyone under 18, and we do not knowingly collect information from children. If you believe a child has given us information, contact {mail} and we will delete it.</>,
    },
    {
      h: 'Changes to this policy',
      p: 'We may update this policy from time to time. We will post the new version here and update the date above, and notify you in the app or by email for material changes.',
    },
    {
      h: 'Contact',
      p: <>Questions or requests about privacy: {mail}, or by post to {LEGAL_ENTITY}, {LEGAL_ADDRESS}.</>,
    },
  ],
}

const TERMS = {
  title: 'Terms of Service',
  intro: (
    <>
      These Terms govern your use of the LifeKit mobile app, website and related services (the “Service”) operated by{' '}
      {company} (“LifeKit”, “we”, “us”). By creating an account or using the Service you agree to these Terms
      and to our <Link to="/privacy" className="text-[#89273B] underline">Privacy Policy</Link>. If you do not agree,
      do not use the Service.
    </>
  ),
  sections: [
    {
      h: '1. What LifeKit is',
      p: 'LifeKit is a marketplace and community that connects people who need services (“Clients”) with independent people and businesses who offer them (“Providers”), and lets members swap skills, join communities and attend events. LifeKit is not a party to agreements between Clients and Providers and does not employ Providers. Providers are solely responsible for the services they offer and deliver.',
    },
    {
      h: '2. Your account',
      list: [
        'You must be at least 18 years old and able to form a binding contract.',
        'Provide accurate information and keep it up to date.',
        'Keep your password secure. You are responsible for activity on your account.',
        'One person per account; you may not transfer your account.',
      ],
    },
    {
      h: '3. Providers',
      list: [
        'Listings must accurately describe the service, price and any options, and must comply with applicable laws, licences and tax obligations.',
        'New and edited listings may be reviewed by LifeKit and can be approved, rejected or removed at our discretion.',
        'You must deliver booked services as described and at the agreed time, or cancel promptly.',
      ],
    },
    {
      h: '4. Bookings, wallet and payments',
      list: [
        'Payments are made from your LifeKit wallet, which you top up by card through Stripe. Wallet funds are not a bank deposit and do not earn interest.',
        'When a Client books, the price is held from the Client’s wallet and released to the Provider after the booking is completed and confirmed.',
        'LifeKit charges Providers a platform commission on completed paid bookings (currently 8%, or a reduced rate during promotional trial periods), deducted before funds are released. Current rates are shown in the app.',
        'Providers withdraw earnings through Stripe Connect and must complete Stripe’s verification. Payout timing depends on Stripe and your bank.',
        'Cancelled bookings are refunded to the Client’s wallet in accordance with the booking status and the cancellation rules shown in the app.',
        'Event tickets include a service fee shown at checkout.',
      ],
    },
    {
      h: '5. Disputes',
      p: 'If something goes wrong with a booking, either party can open a dispute in the app. Held funds stay frozen while LifeKit reviews the information both parties provide. LifeKit may decide to refund the Client or release payment to the Provider; this decision concerns the funds held on the platform and does not limit any other legal rights you may have.',
    },
    {
      h: '6. Subscriptions, boosts and paid features',
      p: 'Paid plans, boosts and AI tools are charged from your wallet at the price shown before purchase and give access for the stated period. Except where required by law, these purchases are non-refundable once the feature has been activated.',
    },
    {
      h: '7. Skill swaps',
      p: 'Skill swaps are exchanges of services between members without payment. Both members are responsible for agreeing the scope and delivering what they offered.',
    },
    {
      h: '8. Your content',
      p: 'You keep ownership of the content you post (profile, listings, photos, posts, comments, reviews, messages). You grant LifeKit a worldwide, non-exclusive, royalty-free licence to host, display, reproduce and distribute that content solely to operate and promote the Service. You confirm you have the rights to everything you post.',
    },
    {
      h: '9. Community rules',
      p: 'You must not:',
      list: [
        'post content that is illegal, hateful, harassing, threatening, sexually explicit, violent, or that infringes others’ rights;',
        'impersonate anyone, post false reviews, or manipulate ratings;',
        'spam, scam, or arrange payments outside LifeKit to avoid fees or protections;',
        'offer illegal, dangerous or regulated services without the required licences;',
        'attempt to access accounts or systems you are not authorised to, or interfere with the Service.',
      ],
      after: 'You can report content or users and block users in the app. We review reports and may remove content, and warn, suspend or permanently block accounts that break these rules — usually within 24 hours of a report, and at our discretion.',
    },
    {
      h: '10. AI features',
      p: 'Some features use artificial intelligence to generate suggestions, descriptions or answers. AI output may be inaccurate or incomplete; review it before relying on it or publishing it. You are responsible for content you choose to publish.',
    },
    {
      h: '11. Suspension and termination',
      p: 'You may stop using the Service and delete your account at any time in the app. We may suspend or terminate accounts that violate these Terms, create risk or legal exposure, or are inactive for an extended period. Any wallet balance that is lawfully yours will be made available for withdrawal, minus amounts owed or subject to an open dispute.',
    },
    {
      h: '12. Disclaimers',
      p: 'The Service is provided “as is” and “as available”. LifeKit does not guarantee the quality, safety, legality or timeliness of services offered by Providers, the accuracy of listings or reviews, or that the Service will be uninterrupted or error-free.',
    },
    {
      h: '13. Limitation of liability',
      p: 'To the maximum extent permitted by law, LifeKit is not liable for indirect, incidental, special or consequential damages, or for loss of profits or data, arising from your use of the Service or from dealings between users. Our total liability for any claim is limited to the greater of the fees you paid to LifeKit in the 12 months before the claim or USD 100. Nothing in these Terms limits liability that cannot be limited by law.',
    },
    {
      h: '14. Changes',
      p: 'We may update these Terms. We will post the new version here, update the date above, and notify you in the app or by email for material changes. Continuing to use the Service after changes take effect means you accept them.',
    },
    {
      h: '15. General',
      p: `These Terms are governed by the laws of ${JURISDICTION}, without regard to conflict-of-law rules, and disputes will be resolved by the courts of Tbilisi, ${JURISDICTION}. This does not take away any mandatory consumer protections you have under the laws of the country where you live. If any provision is found unenforceable, the rest remains in effect. Our failure to enforce a provision is not a waiver.`,
    },
    {
      h: '16. Contact',
      p: <>Questions about these Terms: {mail}, or by post to {LEGAL_ENTITY}, {LEGAL_ADDRESS}.</>,
    },
  ],
}

export default function LegalPage({ type }) {
  const doc = type === 'terms' ? TERMS : PRIVACY

  useEffect(() => {
    document.title = `${doc.title} · LifeKit`
    window.scrollTo(0, 0)
  }, [doc.title])

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-gray-800">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight text-[#89273B]">LifeKit</Link>
          <nav className="flex gap-5 text-sm">
            <Link to="/privacy" className={type === 'privacy' ? 'text-[#89273B] font-semibold' : 'text-gray-500 hover:text-gray-900'}>Privacy</Link>
            <Link to="/terms" className={type === 'terms' ? 'text-[#89273B] font-semibold' : 'text-gray-500 hover:text-gray-900'}>Terms</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Last updated {LAST_UPDATED}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">{doc.title}</h1>
        <p className="mt-6 text-base leading-relaxed text-gray-600">{doc.intro}</p>

        {doc.sections.map((s) => (
          <section key={s.h} className="mt-10">
            <h2 className="text-lg font-bold text-gray-900">{s.h}</h2>
            {s.p && <p className="mt-3 leading-relaxed text-gray-600">{s.p}</p>}
            {s.list && (
              <ul className="mt-3 space-y-2 list-disc pl-5 text-gray-600 leading-relaxed marker:text-[#89273B]">
                {s.list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
            {s.after && <p className="mt-3 leading-relaxed text-gray-600">{s.after}</p>}
          </section>
        ))}
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} {LEGAL_ENTITY} · LifeKit · <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gray-700">{CONTACT_EMAIL}</a>
      </footer>
    </div>
  )
}
