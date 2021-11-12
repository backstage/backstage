---
'@backstage/backend-common': patch
---

Make sure that server builder `start()` propagates errors (such as failing to bind to the required port) properly and doesn't resolve the promise prematurely.

After this change, the backend logger will be able to actually capture the error as it happens:

```
2021-11-11T10:54:21.334Z backstage info Initializing http server
2021-11-11T10:54:21.335Z backstage error listen EADDRINUSE: address already in use :::7000 code=EADDRINUSE errno=-48 syscall=listen address=:: port=7000
```
