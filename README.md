This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Testing Guide: Auth Error Handler with Middleware

## Prerequisites

### 1. Install dependencies

```bash
npm install classnames
# or
yarn add classnames
```

### 2. File structure

```
project-root/
├── middleware.ts
├── app/
│   └── auth-error/
│       ├── page.tsx
│       └── AuthError.module.css
└── components/
    ├── AuthErrorDialog.tsx
    └── AuthErrorDialog.module.css
```

---

## Testing Scenarios

### Test 1: 401 Unauthorized (No Token)

**Steps:**

1. Clear cookies (open DevTools → Application → Cookies → Delete all)
2. Navigate to: `http://localhost:3000/dashboard`

**Expected Result:**

- Redirected to `/auth-error?status=401&message=Authentication+required&returnUrl=/dashboard`
- Dialog shows "Authentication Required" with a Lock icon
- "Login" button is displayed

---

### Test 2: 401 With Query String (Simulated)

**Steps:**

1. Navigate to: `http://localhost:3000/dashboard?simulate=401`

**Expected Result:**

- Redirected to `/auth-error?status=401&message=Your+session+has+expired&returnUrl=/dashboard`
- Dialog shows "Authentication Required"
- Message: "Your session has expired"

---

### Test 3: 403 Forbidden (Simulated)

**Steps:**

1. Navigate to: `http://localhost:3000/dashboard?simulate=403`

**Expected Result:**

- Redirected to `/auth-error?status=403&message=You+do+not+have+permission...&returnUrl=/dashboard`
- Dialog shows "Access Denied" with a Warning triangle icon
- Two buttons: "Go Home" and "Contact Support"

---

### Test 4: 429 Rate Limited (Simulated)

**Steps:**

1. Navigate to: `http://localhost:3000/dashboard?simulate=429`

**Expected Result:**

- Redirected to `/auth-error?status=429&message=Too+many+requests...&returnUrl=/dashboard`
- Dialog shows "Error" with Info icon
- Two buttons: "Go Home" and "Retry"

---

### Test 5: 500 Server Error (Simulated)

**Steps:**

1. Navigate to: `http://localhost:3000/dashboard?simulate=500`

**Expected Result:**

- Redirected to `/auth-error?status=500&message=Service+temporarily+unavailable&returnUrl=/dashboard`
- Dialog shows "Error" with Info icon
- Two buttons: "Go Home" and "Retry"

---

### Test 6: Direct URL Access

**Steps:**

1. Manually navigate to: `http://localhost:3000/auth-error?status=403&message=Custom+error+message&returnUrl=/some-page`

**Expected Result:**

- Dialog displays with status 403
- Shows "Custom error message"
- Buttons work correctly

---

### Test 7: Return URL Functionality

**Steps:**

1. Navigate to: `http://localhost:3000/dashboard?simulate=401`
2. Click "Login" button
3. Login with test credentials
4. Should redirect back to `/dashboard`

**Expected Result:**

- After login, user is redirected to the original page they tried to access

---

## Testing with Browser DevTools

### Network Tab

1. Open DevTools → Network tab
2. Navigate to protected route
3. Check for redirect (307) responses
4. Verify redirect URL contains correct query parameters

### Console Tab

1. Check for any errors or warnings
2. Verify no CORS issues
3. Check cookie operations

### Application Tab

1. Check Cookies section
2. Verify `auth-token` cookie is set/unset correctly
3. Check cookie expiration and path

---

## Testing Edge Cases

### Test 8: Missing Query Parameters

**Steps:**

1. Navigate to: `http://localhost:3000/auth-error` (no query params)

**Expected Result:**

- Dialog shows default values: status=401, message="Authentication error occurred"

---

### Test 9: Special Characters in Message

**Steps:**

1. Navigate to: `http://localhost:3000/auth-error?status=500&message=Error:%20Cannot%20connect%20to%20DB%20%26%20Cache`

**Expected Result:**

- Message displays correctly with special characters decoded

---

## Quick Test Commands

```bash
# Start dev server
npm run dev

# Test different scenarios quickly
open http://localhost:3000/dashboard?simulate=401
open http://localhost:3000/dashboard?simulate=403
open http://localhost:3000/dashboard?simulate=429
open http://localhost:3000/dashboard?simulate=500

# Test without auth token (delete cookies first)
open http://localhost:3000/dashboard
```