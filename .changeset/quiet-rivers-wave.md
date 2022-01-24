---
'@backstage/plugin-auth-backend': patch
---

Running the `auth-backend` on multiple domains, perhaps different domains depending on the `auth.environment`, was previously not possible as the `domain` name of the cookie was taken from `backend.baseUrl`. This prevented any cookies to be set in the start of the auth flow as the domain of the cookie would not match the domain of the callbackUrl configured in the OAuth app. This change checks if a provider supports custom `callbackUrl`'s to be configured in the application configuration and uses the domain from that, allowing the `domain`'s to match and the cookie to be set.
