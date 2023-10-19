---
'@backstage/plugin-permission-node': minor
---

Experimental release of the DelegatedPermissionPolicy which allows policy authors to compose their policy with behaviours
exported by plugin authors. When creating a policy, you can supply an array of DecisionDelegates that will be evaluated
by the policy upon a Permission request. If a match is found then the check is delegated to the DecisionDelegate, otherwise
it fall backs to a behaviour defined by the policy author.

```typescript
class ExamplePermissionPolicy extends DelegatedPermissionPolicy {
  constructor() {
    super(delegates);
  }

  async handleUndelegated(): Promise<PolicyDecision> {
    return {
      result: AuthorizeResult.DENY,
    };
  }
}
```
