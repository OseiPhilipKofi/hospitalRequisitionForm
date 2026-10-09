# Emergency Requisition Frontend

I built this React single-page app for the Hospital Emergency Requisition Platform. It uses Vite for local development and production builds, React Router for navigation, and Tailwind CSS for the responsive interface.

## Requirements

- Node.js 18 or newer
- npm
- The PHP API running locally for sign-in and live platform data

## Install and run

From the project root on Windows, run `start-frontend.cmd`. The script installs dependencies if `node_modules` is missing, then starts Vite.

To run the commands yourself:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. For API-backed workflows, also start the PHP service with `start-api.cmd` in a separate terminal. The development proxy forwards frontend requests from `/api` to `http://127.0.0.1:8080` and removes the `/api` prefix before sending them to PHP.

If the API runs on a different address or port, update the proxy target in `vite.config.js`. If you change the Vite origin or port, add that exact origin to `cors_origins` in `../api/config.php`.

## Build and preview

Create the optimized production bundle:

```powershell
npm run build
```

Vite writes the static output to `dist`. Preview that bundle locally with:

```powershell
npm run preview
```

For deployment, serve the contents of `dist` through the chosen web server or hosting platform and configure history fallback so routes such as `/contact` and `/dashboard/admin/activity` return `index.html`. Configure the production API base/proxy and API CORS allowlist for the deployed origins.

## Pages and roles

The public site contains Home, About, General Services, Policy, Contact, Sign in, and Register pages. Approved users have role-specific protected workspaces:

- **Emergency Unit**: requisitions and Drug/Non-Drug catalogue.
- **Store Personnel**: inventory and completed review logs.
- **Hospital Administrator**: pending request approvals, registration and role review, inventory management, and activity history.

The frontend routes users to the interface that matches their role. Authorization is also enforced by the API, which is the security boundary for protected data and changes.

## Contact page

The contact page offers direct phone, email, SMS, WhatsApp, and message-form actions. Submitting the form prepares a message in the visitor's email application; it does not send mail through a server. The contact entries and phone extensions in `src/pages/public/Contact.jsx` are the current project directory values (`.local` email addresses and extensions 2210, 3341, and 1001). Replace them with the hospital's verified contact details before publishing the site.

## Frontend details

- `src/App.jsx` defines public and protected routes.
- `src/auth/AuthContext.jsx` restores the signed-in user and provides login, registration, and logout actions.
- `src/components/ProtectedRoute.jsx` guards role-specific page navigation.
- `src/components/layout/` contains the public shell and role-aware dashboard navigation.
- `src/pages/` contains the public pages and Unit, Store, and Administrator views.
- `src/api/client.js` sends JSON requests to the API and attaches the stored bearer token.
- `src/index.css`, `tailwind.config.js`, and `postcss.config.js` define global styling and the Tailwind build.

The API issues a JWT on sign-in. The frontend stores it in browser `localStorage` and sends it as a bearer token on API calls; signing out removes it. Production deployments should use HTTPS, protect the site against cross-site scripting, and keep dependencies and hosting configuration current.

## Troubleshooting

- If sign-in or data requests fail, check that the API is running at `http://127.0.0.1:8080` and that `GET /health` responds.
- If the browser reports a CORS error, add the exact frontend origin (scheme, host, and port) to the API's `cors_origins` setting.
- If a protected page sends you back to a public page, sign in with an approved account for the role required by that route.
- If Tailwind classes appear missing in production, check the configured source patterns in `tailwind.config.js` and rebuild.
