---
'@backstage/plugin-techdocs-backend': patch
---

Fixed a memory leak in the TechDocs cache middleware that produced a `MaxListenersExceededWarning` when keep-alive connections were used. Response lifecycle handling is now tied to each request rather than the reused connection socket.
