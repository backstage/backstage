---
'@backstage/frontend-test-utils': patch
---

Isolated extension rendering now selects attached sub-pages using the app's route matching. The URL selects content at the supplied mount path, and parent index redirects preserve the query string and fragment.
