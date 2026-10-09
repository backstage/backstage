---
'@backstage/core-components': patch
---

Fixed the sign-in page getting stuck after a failed sign-in attempt when using the redirect flow: the error is now removed from the URL once it has been shown, and clicking "Sign In" starts a new sign-in attempt instead of doing nothing.
