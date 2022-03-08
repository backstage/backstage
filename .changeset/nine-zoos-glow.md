---
'@backstage/plugin-permission-backend': minor
---

**BREAKING**: Introduce separate endpoint for conditional decisions.

Previously the /authorize POST endpoint would be guaranteed to return a definitive decision (ALLOW or DENY) for non-resource permissions, or resource permissions supplied with a resource ref. For resource permissions supplied without a resource ref, it may return a definitive or conditional decision, leaving the caller to apply the conditions afterwards.

To make the behavior of the API more understandable, this functionality is now split into two endpoints. The /authorize POST endpoint accepts a non-resource permission, or a resource permission with a resource ref, and is guaranteed to return a definitive decision. This is the endpoint that should be used in the vast majority of cases. The newly-introduced /policy-decision endpoint accepts a resource permission without a resource ref, and returns either a definitive or conditional decision. This endpoint should be used only when a caller wants to apply conditions independently, for example by converting them to database query clauses.
