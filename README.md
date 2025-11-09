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

## Setup Steps

### Step 1: Create a Test Page (Protected Route)

Create `app/dashboard/page.tsx`:

```tsx
export default function DashboardPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Protected Dashboard</h1>
      <p>If you see this, authentication passed!</p>
    </div>
  );
}
```

### Step 2: Create a Login Page

Create `app/login/page.tsx`:

```tsx
'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Simulate setting auth token
    document.cookie = 'auth-token=fake-token-123; path=/';
    router.push('/dashboard');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login Page</h1>
      <button 
        onClick={handleLogin}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer'
        }}
      >
        Login
      </button>
    </div>
  );
}
```

### Step 3: Update Middleware for Testing

Update `middleware.ts` to include test scenarios:

```typescript
// Add this helper function for testing
function shouldSimulateError(request: NextRequest): { status: number; message: string } | null {
  const { searchParams } = request.nextUrl;
  
  // Allow testing with ?simulate=401, ?simulate=403, etc.
  const simulate = searchParams.get('simulate');
  
  if (simulate === '401') {
    return { status: 401, message: 'Your session has expired' };
  }
  if (simulate === '403') {
    return { status: 403, message: 'You do not have permission to access this resource' };
  }
  if (simulate === '429') {
    return { status: 429, message: 'Too many requests. Please try again later' };
  }
  if (simulate === '500') {
    return { status: 500, message: 'Service temporarily unavailable' };
  }
  
  return null;
}

// In your middleware function, add this before the token check:
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for certain paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/auth-error' ||
    pathname === '/login'
  ) {
    return NextResponse.next();
  }

  // TEST MODE: Check for simulated errors
  const simulatedError = shouldSimulateError(request);
  if (simulatedError) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth-error';
    url.searchParams.delete('simulate'); // Remove simulate param
    url.searchParams.set('status', simulatedError.status.toString());
    url.searchParams.set('message', simulatedError.message);
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Rest of your existing middleware code...
}
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

## Manual Testing Checklist

### Visual Tests

- [ ] Dialog appears centered on screen
- [ ] Overlay has semi-transparent black background
- [ ] Correct icon colors:
  - 401: Yellow/Orange lock icon
  - 403: Red warning triangle
  - Others: Gray info icon
- [ ] Dialog has smooth fade-in animation
- [ ] Text is readable and properly formatted
- [ ] Buttons have hover effects

### Functional Tests

- [ ] "Login" button redirects to `/login` (401)
- [ ] "Go Home" button redirects to `/` (403, others)
- [ ] "Contact Support" button shows (403)
- [ ] "Retry" button redirects to returnUrl (others)
- [ ] Status code displays correctly
- [ ] Message displays correctly
- [ ] Query parameters are properly encoded/decoded

### Responsive Tests

- [ ] Dialog is responsive on mobile (< 640px)
- [ ] Dialog is responsive on tablet (640px - 1024px)
- [ ] Dialog is responsive on desktop (> 1024px)
- [ ] Buttons stack properly on small screens

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

### Test 10: Very Long Messages

**Steps:**

1. Navigate with a very long message parameter

**Expected Result:**

- Dialog expands vertically to accommodate message
- Dialog remains centered and readable

```

## Common Issues & Solutions

### Issue 1: Redirect Loop

**Solution:** Ensure `/auth-error` and `/login` are excluded in middleware matcher

### Issue 2: Query Parameters Not Showing

**Solution:** Check URL encoding in middleware redirect

### Issue 3: Cookies Not Persisting

**Solution:** Verify cookie path and domain settings

### Issue 4: Middleware Not Running

**Solution:** Check middleware.ts is in project root and matcher config is correct

---

## Production Testing

Before deploying:

1. **Remove test simulation code** from middleware
2. **Connect to real auth API** - Replace mock `validateAuth` function
3. **Test with real auth tokens**
4. **Test token expiration scenarios**
5. **Verify error messages are user-friendly**
6. **Test on staging environment first**

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