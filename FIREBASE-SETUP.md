# Firebase setup for Snap Kodex contact form

## Architecture (static site — no build step)

This site stays **plain HTML, CSS, and JS**. There is **no** `npm install`, bundler, or Firebase SDK hosted on your server.

| What you upload | What runs in the browser |
|-----------------|--------------------------|
| `js/firebase-config.js` | Thin config (~20 lines) |
| `js/contact-form.js` | Form handler |
| `js/admin.js` | Admin inbox + login |

Firebase **App, Firestore, and Auth** load at runtime from Google's CDN:

`https://www.gstatic.com/firebasejs/12.15.0/`

Your server only serves the three small `.js` files above. **Do not** copy `firebase` from `node_modules` into `production/`.

`firestore.rules` is pasted/deployed in the **Firebase Console** only — not served as a public web file.

## 1. Enable Firestore

1. Open [Firebase Console](https://console.firebase.google.com/) → project **brain-3bc3a**.
2. Go to **Build → Firestore Database**.
3. Create a database if one does not exist (production mode is fine once rules are deployed).

## 2. Enable Email/Password authentication

1. Go to **Build → Authentication → Sign-in method**.
2. Enable **Email/Password**.
3. Save.

## 3. Create an admin user

1. In **Authentication → Users**, click **Add user**.
2. Use email **`hello@snapkodex.com`** (the only account allowed to read inbox data in Firestore rules).
3. Set a strong password and store it securely.

## 4. Deploy Firestore security rules

Copy `production/firestore.rules` into your Firebase project and deploy:

```bash
firebase deploy --only firestore:rules
```

Or paste the rules manually in **Firestore → Rules** in the console and click **Publish**.

## 5. API key HTTP referrers (required for contact form)

The browser API key must allow your site origins or writes will fail with **permission-denied**.

1. [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Open the **Browser key** used by Firebase (same project).
3. Under **Application restrictions** → **HTTP referrers**, add:

```
http://localhost/*
http://127.0.0.1/*
https://snapkodex.com/*
https://www.snapkodex.com/*
```

4. Save. Wait a few minutes for changes to propagate.

**Local testing:** use `http://localhost:PORT` — `http://127.0.0.1:PORT` is blocked unless you add the referrer above.

## 6. Verify

- Submit the contact form on the homepage; a document should appear under `snapkodex/inbox/messages`.
- Open `/admin.html`, sign in with the admin user, and confirm messages load.

## Admin page

- URL: `https://snapkodex.com/admin.html` (not linked from public navigation).
- Blocked in `robots.txt`; uses `noindex, nofollow` meta tags.
