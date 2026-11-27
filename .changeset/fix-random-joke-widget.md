---
'@backstage/plugin-home': patch
---

The `HomePageRandomJoke` widget now shows jokes from a built-in list. It used to load jokes from `official-joke-api.appspot.com`, which is down, so the widget showed a loading message forever. The `dad` category is removed from the widget settings, because it had no jokes. A widget that is set to `dad` now shows jokes from all categories.
