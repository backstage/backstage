---
'@backstage/plugin-ai-backend': minor
---

Added a new `@backstage/plugin-ai-backend` package: a backend plugin that exposes the managed AI service over HTTP. Authenticated users create their own AI sessions and conversations, submit messages that stream partial and final answers as server-sent events, and read their conversation transcripts and per-session audit trails. Every route runs under the caller's user credentials and requires the `ai.session.use` permission, model dispatch is authorized per attempt against the installation's model catalog, and audit reads additionally require `ai.audit.read`; one user can never read or drive another user's session.
