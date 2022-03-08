---
'@backstage/plugin-permission-common': minor
---

**BREAKING**: Split `PermissionAuthorizer#authorize` method and adjust associated parameter and return types.

To migrate, replace any calls to `authorize` expected to return a conditional decision with calls to `policyDecision`, and ensure the permission being supplied is of type `ResourcePermission`.

Previously the `authorize` method would be guaranteed to return a definitive decision (ALLOW or DENY) for non-resource permissions, or resource permissions supplied with a resource ref. For resource permissions supplied without a resource ref, it may return a definitive or conditional decision, leaving the caller to apply the conditions afterwards.

To make the behavior more understandable, this functionality is now split into two methods. The `authorize` method now accepts either a `Permission` of a type other than `ResourcePermission`, or a `ResourcePermission` with a resource ref, and is guaranteed to return a definitive decision. This is the method that should be used in the vast majority of cases. The newly-introduced `policyDecision` method accepts a `ResourcePermission` without a resource ref, and returns either a definitive or conditional decision. This method should be used only when a caller wants to apply conditions independently, for example by converting them to database query clauses.

Along with the method split, the types `AuthorizeRequest` and `AuthorizeDecision` have been removed, and a generic `Batch` type has been introduced to wrap batches of queries and decisions for both `authorize` and `policyDecision` in a consistent envelope. The `AuthorizeQuery` and `AuthorizeDecision` types have been narrowed to reflect the restrictions and guarantees described above.
