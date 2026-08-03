# Android admin app and enquiry notifications

The release is a Progressive Web App, so a separate Play Store package is not required.

1. Open `https://YOUR-DOMAIN/admin` in Android Chrome and sign in.
2. Chrome menu → **Add to Home screen** → **Install**.
3. Open the installed Yone Admin app and press **Enable enquiry notifications** in the sidebar.
4. Allow notifications when Android asks.

For push notifications, generate VAPID keys with `npx web-push generate-vapid-keys` and set the three VAPID environment variables in Netlify. HTTPS is required. Notifications contain a generic enquiry alert; complete private buyer details remain inside the authenticated admin dashboard.
