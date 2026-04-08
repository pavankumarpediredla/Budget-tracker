# BudgetFlow

BudgetFlow is a simple full-stack budget management app built with React, Redux Toolkit, and Spring Boot. It is designed as a mobile-friendly web app that can be deployed free and used live.

## Stack

- Frontend: React + Redux Toolkit + Vite
- Backend: Spring Boot
- Deployment target:
  - frontend on Cloudflare Pages
  - backend on Render
  - database can be added later with Neon Postgres

## Features in this starter

- Login page
- Protected dashboard
- Budget summary cards
- Add income and expense transactions
- Recent transaction list
- Token-based demo auth flow

## Demo credentials

- Username: `demo`
- Password: `demo123`

## Run frontend

```bash
cd budget-tracker/frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5174`

## Mobile Demo Mode

The frontend is now PWA-ready:

- installable from mobile browser
- standalone app-like mode
- offline app shell caching
- home-screen icon and app manifest

After deployment, open the site on your phone and use:

- Chrome on Android: `Add to Home screen`
- Safari on iPhone: `Share` -> `Add to Home Screen`

## Run backend

```powershell
cd budget-tracker/backend
mvn spring-boot:run
```

Backend URL: `http://localhost:8081`

## API endpoints

- `POST /api/auth/login`
- `GET /api/budget/dashboard`
- `POST /api/budget/transactions`

## Next steps

- Add PostgreSQL or MySQL persistence
- Add signup and profile management
- Add categories, recurring budgets, and charts
- Add monthly reports and notifications

## Live Demo Deployment

Recommended quick demo deployment:

1. Frontend:
   - deploy `budget-tracker/frontend/dist` to Cloudflare Pages or Netlify
2. Backend:
   - deploy Spring Boot backend to Render
3. Set frontend env:
   - `VITE_API_BASE_URL=https://your-backend-url/api`
