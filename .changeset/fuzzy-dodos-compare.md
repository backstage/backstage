---
'@backstage/plugin-auth-backend-module-github-provider': patch
---

Deprecated the GitHub username sign-in resolver in favor of the stable user ID resolver. GitHub user ID catalog lookups now require an exact match and handle candidates that differ only by letter casing.
