---
'@backstage/plugin-auth-backend': minor
---

CookieConfigurer can optionally return the `SameSite` cookie attribute.
CookieConfigurer now requires an additional argument `appOrigin` - the origin URL of the app - which is used to calculate the `SameSite` attribute.
defaultCookieConfigurer returns the `SameSite` attribute which defaults to `Lax`. In cases where an auth-backend is running on a different domain than the App, `SameSite=None` is used - but only for secure contexts. This is so that cookies can be included in third-party requests.
OAuthAdapterOptions has been modified to require additional arguments, `baseUrl`, `cookieConfigurer` and `cookieConfig`.
