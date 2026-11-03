# Production deployment

Every push to `main` runs `.github/workflows/firebase-hosting-merge.yml` and deploys Firebase Hosting and Cloud Functions to project `brain-3bc3a` (the production site at `snapkodex.com`). Pull requests continue to use the separate Hosting preview workflow.

## GitHub Actions credentials

In the GitHub repository, open **Settings → Secrets and variables → Actions** and make sure the repository secret `FIREBASE_SERVICE_ACCOUNT_BRAIN_3BC3A` contains the JSON key for a Google Cloud service account that is allowed to deploy this project. Do not commit the JSON key to the repository or send it in chat.

The earlier deployment errors identify missing permissions for the deployment identity. A project owner should grant it:

- **Cloud Functions Admin** (`roles/cloudfunctions.admin`) on project `brain-3bc3a` so it can deploy HTTPS functions and set their invocation policy.
- **Service Account User** (`roles/iam.serviceAccountUser`) on the function runtime account `539536929675-compute@developer.gserviceaccount.com` so it can deploy functions as that account.
- Permission to update the `AUTOBLOG_API_KEY` secret policy (`secretmanager.secrets.setIamPolicy`), for example **Secret Manager Admin** (`roles/secretmanager.admin`) on that secret. The deploy also needs to ensure the runtime account can access the secret.

Google Cloud may report additional missing build or runtime permissions the first time the service account deploys Gen 2 functions. Grant only the roles named by the resulting error to this deployer account or the relevant service account. The functions deploy role requirements are documented in the [Google Cloud Functions IAM roles guide](https://docs.cloud.google.com/functions/docs/reference/iam/roles).

The workflow uses Google Application Default Credentials through `google-github-actions/auth` and Firebase CLI, which Firebase recommends for CI deployments. See [Firebase CLI CI authentication](https://firebase.google.com/docs/cli#use_the_cli_with_ci_systems).
