---
'@backstage/plugin-catalog-backend-module-ldap': minor
---

Moved from `ldapjs` dependency to `ldapts`

### Breaking Changes

**Type Migration**

Custom transformers must now accept `Entry` from ldapts instead of `SearchEntry`
from ldapjs The Entry type provides direct property access without need for
`.object()` or `.raw()` methods.

If you have custom user or group transformers, update the signature from:

```typescript
(vendor: LdapVendor, config: UserConfig, entry: SearchEntry) =>
  Promise<UserEntity | undefined>;
```

to

```typescript
(vendor: LdapVendor, config: UserConfig, entry: Entry) =>
  Promise<UserEntity | undefined>;
```

**Search Options**

Updated LDAP search configuration `typesOnly: false` → `attributeValues: true`
This inverts the boolean logic: ldapjs used negative form while ldapts uses
positive form. Both achieve the same result: retrieving attribute values rather
than just attribute names.

Update LDAP search options in configuration from

```yaml
options:
  typesOnly: false
```

to

```yaml
options:
  attributeValues: true
```
