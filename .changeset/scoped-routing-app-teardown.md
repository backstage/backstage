---
'@backstage/frontend-defaults': patch
---

Apps now release their browser history listener when the React root unmounts, avoiding retained listeners when apps are repeatedly created and discarded in tests or development tooling.
