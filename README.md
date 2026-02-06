# Fluent Forms Hub - Frontend

React frontend for managing Fluent Forms submissions from multiple WordPress sites.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **HTTP Client:** Axios
- **Language:** TypeScript

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # Axios instance with auth
│   │   ├── auth.ts       # Auth API calls
│   │   ├── submissions.ts# Submissions API
│   │   ├── sites.ts      # Sites API
│   │   └── user.ts       # User API
│   ├── components/       # Reusable components
│   │   ├── Sidebar.tsx   # Navigation sidebar
│   │   ├── SubmissionTable.tsx
│   │   ├── ComposePopup.tsx    # Email composer
│   │   ├── ProtectedRoute.tsx  # Auth guard
│   │   └── settings/     # Settings components
│   │       └── ProfileSettings.tsx
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication state
│   ├── pages/
│   │   ├── LoginPage.tsx       # Login form
│   │   ├── SubmissionsList.tsx # Submissions list
│   │   ├── SubmissionDetail.tsx# Single submission view
│   │   └── SettingsPage.tsx    # User settings
│   ├── types/
│   │   └── index.ts      # TypeScript interfaces
│   ├── App.tsx           # Root component with routes
│   └── main.tsx          # Entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Features

- **Authentication**
  - Login/logout
  - Session-based token storage (clears on tab close)
  - Auto-logout after 30 minutes of inactivity

- **Submissions Management**
  - View all form submissions
  - Filter by site, form, status
  - Search submissions
  - View submission details
  - Update submission status

- **Email**
  - Send emails to contacts
  - Email composer popup
  - Email thread history

- **Settings**
  - Update email
  - Change password
  - Logout

- **Sites Management** (Admin only)
  - Add/edit WordPress sites
  - View sync status

## Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment (optional):**
   ```bash
   # Create .env file if needed
   VITE_API_BASE_URL=/api/v1
   ```

## Running

### Development

```bash
npm run dev
```

Starts dev server at http://localhost:5173

### Build for Production

```bash
npm run build
```

Output in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## API Proxy

In development, Vite proxies `/api/v1` requests to the backend at `http://localhost:8000`.

Configured in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api/v1': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

## Authentication Flow

1. User logs in via `LoginPage`
2. Token stored in `sessionStorage` (clears on tab close)
3. `AuthContext` manages auth state
4. `ProtectedRoute` guards authenticated pages
5. `client.ts` attaches token to all API requests
6. Auto-logout after 30 min inactivity

## Routes

| Path | Component | Auth Required |
|------|-----------|---------------|
| `/login` | LoginPage | No |
| `/` | SubmissionsList | Yes |
| `/submissions` | SubmissionsList | Yes |
| `/submissions/:id` | SubmissionDetail | Yes |
| `/settings` | SettingsPage | Yes |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `/api/v1` |
