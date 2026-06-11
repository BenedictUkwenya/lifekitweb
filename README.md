# LifeKit — Provider Web

The provider portal for LifeKit, built with React + Vite. Providers can sign in,
manage their service listings, and onboard onto the platform.

## Tech stack

- React 19 + Vite
- React Router
- i18next (English, Georgian, Russian)
- Tailwind CSS v4
- framer-motion + GSAP (ScrollTrigger) + Lenis for animations

## Environment variables

Create a `.env` file (see `.env` is gitignored):

```
VITE_API_URL=https://lifekitbackend.vercel.app
```

For local development against a local backend, use:

```
VITE_API_URL=http://localhost:3000
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
