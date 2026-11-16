---
'@backstage/plugin-home': patch
---

The `HomePageRandomJoke` widget now uses `https://api.app-jokes.workers.dev`, because the old host is down. It shows a built-in joke when the request fails, instead of loading forever. Set a different API with the `baseUrl` prop, or with `baseUrl` in the `home-page-widget:home/random-joke` extension config.
