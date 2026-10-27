---
'@backstage/integration': patch
---

Fixed an issue where reading files from GitHub could fail or read the wrong branch when the branch name contained special characters such as an ampersand or a plus sign. The branch name is now correctly encoded in the request URL.
