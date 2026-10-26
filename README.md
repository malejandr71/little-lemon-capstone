# Little Lemon — Front-End Developer Capstone

A React restaurant website with an accessible table reservation flow, field validation, browser-local demo availability, confirmation, responsive layouts, and automated tests.

**This is an AI-assisted implementation prepared as a learning project. Review, understand, and adapt it yourself, and follow your course's rules on AI assistance before submitting it.** No claim of sole authorship is made by this repository.

## Run locally

Requires Node.js 20.19+ (22.12+ or 24 recommended) and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Create a production build with:

```sh
npm run build
npm run preview
```

Run the automated checks with `npm test`. Use `npm run test:watch` during development.

## Pages

- `/`: restaurant introduction, featured dishes, story, reservation CTA.
- `/menu`: sample menu and dietary information.
- `/about`: restaurant story.
- `/reservations`: date, available time, guest count, occasion, name, email, and optional requests.
- `/confirmed`: reservation receipt after a successful save. Direct access without a receipt offers a link to start a booking.
- Unknown paths show a recovery page.

## Reservation behavior

1. Choose a local-calendar date from today through 90 days ahead.
2. The parent reservation page owns the available-time state and passes it to the child BookingForm. Available times update with the date. Past times today and locally reserved times are excluded.
3. Select 1–10 guests and enter a name and valid email address.
4. Submit. Invalid fields receive associated error text and focus moves to the first invalid field.
5. A valid reservation is saved once, then a confirmation is displayed. Already reserved slots cannot be selected again in this browser.

The submit control stays disabled while loading, while saving, or when no slots remain. Storage failures and availability failures produce actionable errors. Contact input remains available after a save failure. Repeated clicks are guarded while a request is pending.

## Demo API and data limits

`src/api.js` exports async `fetchAPI(date)` and `submitAPI(values)` functions. They provide a deterministic local teaching implementation, **not a live restaurant service or the externally hosted course API**. `fetchAPI` returns available dinner slots. `submitAPI` revalidates and persists the reservation receipt in `localStorage` under `little-lemon-reservations-v1`.

The restaurant, menu prices, opening hours, and availability are illustrative. No real booking is made and no confirmation email is sent. Only the reference, date, time, party size and occasion are saved; name, email, and free-text requests are not persisted or transmitted by the reservation code. No cancellation, production authentication, real email, server-side database, cross-device synchronization, or cross-tab atomic locking is provided. A production integration should replace this adapter with an authenticated backend and atomic availability checks.

Times are explicitly interpreted in the device's local time for this demo. A real Chicago restaurant deployment should use America/Chicago and handle daylight-saving transitions on the server.

To reset demo availability, clear this origin's site data in your browser settings. Clearing it deletes only local demo reservations. Malformed or blocked browser storage is reported rather than silently claiming a successful booking.

## Code structure

```text
src/
  App.jsx                       Pages, routes, navigation, confirmation
  main.jsx                      React entry point and router
  styles.css                    Tokens, layout, forms and breakpoints
  api.js                        Async local-demo reservation adapter
  booking.js                    Shared date and validation rules
  components/BookingForm.jsx    Controlled form and async request state
  *.test.*                      Date, API and route tests
  components/*.test.jsx         Form interaction tests
  test/setup.js                 DOM assertions and test cleanup
public/lemon.svg                 Original vector mark
```

## Accessibility and responsive design

Semantic header/nav/main/section/article/aside/footer landmarks; one H1 per page; a skip link; explicitly associated labels; native required/min/max/type constraints backed by shared validation; linked error text and aria-invalid; status and alert messages; keyboard focus management; visible focus indicators; an accessible mobile menu; descriptive image alt text; decorative SVG hidden from assistive technology; reduced-motion support.

Desktop layouts use CSS Grid and transition to one column on smaller screens. The reservation form collapses its inner grid on narrow devices. Navigation becomes an expandable menu below 740px. See `docs/DESIGN.md` for layout decisions and the manual QA checklist.

## Tests

Vitest + React Testing Library + user-event cover:

- Local date formatting and year rollover, invalid and out-of-range dates.
- Valid and invalid party size, email, name, occasion and requests.
- Time filtering, slot removal, duplicate rejection and safe data persistence.
- Unavailable or malformed browser storage.
- Accessible form fields and validation focus.
- Successful submission, date changes, a fully booked date and error recovery.
- Double-click submission protection.
- Site navigation, unknown routes, direct confirmation access and mobile menu state.

## Hosting and GitHub

Vite builds static files to `dist/`. Client-side routes require an SPA fallback to `index.html`; `public/_redirects` supplies a Netlify-style fallback, and the Sites manifest declares the static output directory. On other hosts configure the equivalent fallback. A GitHub Pages deployment needs basename/base-path configuration and an appropriate route strategy; this project is ready for GitHub source review, not preconfigured for Pages subpaths.

To upload to a new GitHub repository, create an **empty** repository in your account, then run:

```sh
git init -b main
git add .
git commit -m "Build Little Lemon React capstone"
git remote add origin https://github.com/YOUR_USERNAME/little-lemon-capstone.git
git push -u origin main
```

If the ZIP already contains Git metadata (it does not in the delivered archive), reuse that repository instead of initializing again. Choose public visibility only if you want everyone, including peer reviewers, to access it. Never commit credentials.

## Credits

Photography is loaded from Unsplash as illustrative restaurant and food imagery, not documentation of a real Little Lemon venue or exact menu item. See `docs/ASSETS.md`. Fonts: DM Sans and Libre Caslon Display via Google Fonts, with system fallbacks. Images and fonts require internet access; the reservation logic and system font fallback do not. The lemon mark is an original SVG included in the source. This project is an educational restaurant concept and is not affiliated with a real restaurant.
