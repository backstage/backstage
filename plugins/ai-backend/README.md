# AI backend

The AI backend exposes managed AI sessions under `/api/ai/v1`. Add `@backstage/plugin-ai-backend` to the backend and register it with `backend.add(import('@backstage/plugin-ai-backend'))`. Configure the installation's models and credentials under `ai` using the `@backstage/ai-node` configuration schema.

Routes require Backstage user bearer credentials and the `ai.session.use` permission. This plugin does not enable cookie authentication. Model discovery returns only models allowed by their `ai.model.<provider>.<model>.use` permissions; each model segment is URI-encoded, with literal dots encoded as `%2E`. Dispatch checks that permission again. Audit reads require both session ownership and `ai.audit.read`.

- `GET /models` lists permitted models.
- `GET /sessions` lists the caller's sessions; pass the returned `nextCursor` as `cursor` to continue.
- `POST /sessions` accepts `{ "model": { "provider": "...", "modelId": "..." } }` and returns a session and root conversation ID.
- `GET /sessions/:sessionId` checks an existing session.
- `POST /sessions/:sessionId/conversations` accepts the same model object and creates a conversation.
- `GET /sessions/:sessionId/conversations/:conversationId` returns up to 100 recent text entries. `hasMore` indicates additional history; pagination of conversation history is not yet supported.
- `POST /sessions/:sessionId/conversations/:conversationId/messages` accepts `{ "content": "..." }` and returns an SSE stream. `partial` events contain text snapshots, `answer` contains the final answer, and `settled` reports the submission status, not an individual provider attempt outcome.
- `GET /sessions/:sessionId/audit` returns a session-scoped journal page. Pass `nextCursor` as `cursor` to continue.

Live output follows the submission; durable outcome observation requires the audit-read entitlement. A disconnected client stops receiving SSE; the admitted submission continues and settles. Reconnection without audit permission and selective cancellation of an already placed submission are not supported. Journal outcomes are session-scoped and cannot yet be attributed to individual submissions.

The backend's managed service and database are plugin-scoped. Other consuming plugins use their own instances; installation configuration supplies the same organization credentials and model catalog to each, but encrypted personal credentials are stored separately per plugin. Cross-plugin credential and journal hosting is not available.
