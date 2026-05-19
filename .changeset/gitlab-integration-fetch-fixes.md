---
'@backstage/integration': patch
---

Fixed two issues in the GitLab integration's fetch behavior:

- The internal fetch wrapper was passing `mode: 'same-origin'` on every request. This had no practical effect server-side, but would have caused cross-origin requests to be rejected when the integration is used from a browser. Requests now use the default fetch mode and work correctly in both browser and Node environments.
- When retries are configured, transient network errors (such as dropped connections or DNS hiccups) are now retried using the same `maxRetries` and exponential delay as retryable HTTP status codes. Previously, a thrown fetch error would propagate immediately on the first failure regardless of the retry configuration. Caller-initiated aborts continue to surface immediately without being retried.
