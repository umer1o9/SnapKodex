# Snap Kodex Blog integration

The public `/blog` page reads published articles from AutoBlog Studio through a Firebase HTTPS function. The delivery key is stored in Firebase Secret Manager and is never included in website files.

## Configure the integration

1. In AutoBlog Studio, open **Websites**, select the Snap Kodex website, and copy its **Website ID**.
2. In Firebase Console, open **Project settings → Usage and billing**. Cloud Functions deployment requires the project to be on the Blaze plan. Cloud Functions includes a no-cost usage tier, but usage beyond Firebase's current free quotas is billed.
3. From this project directory, set the delivery key in Firebase Secret Manager:

   ```sh
   firebase functions:secrets:set AUTOBLOG_API_KEY --project brain-3bc3a
   ```

   Enter the website-specific delivery key at the secure prompt. Do not put it in a source file, browser code, or chat.

4. Deploy Hosting and Functions:

   ```sh
   firebase deploy --only hosting,functions --project brain-3bc3a
   ```

   On the first deployment, the Firebase CLI prompts for `AUTOBLOG_SITE_ID`; enter the Website ID from step 1. It is a configuration value, not a secret.

## Routes

- `/blog` — paginated listing, 12 articles per page.
- `/blog/{slug}` — server-rendered published article with canonical and social metadata; unavailable or unpublished slugs return HTTP 404.
- `/api/blog` — listing proxy used by the browser; the API key remains in the function.
- `/sitemap.xml` — dynamically includes static pages and all currently published article URLs.

The detail API and sitemap are fetched on request, with no long-lived article cache. The sitemap response is cached for five minutes.
