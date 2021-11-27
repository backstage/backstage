---
'@backstage/backend-common': patch
---

Added a `Context` type for the backend, that can propagate an abort signal, a deadline, and contextual values through the call stack. The main entrypoint is the `Contexts` utility class that provides a root context creator and commonly used decorators.
