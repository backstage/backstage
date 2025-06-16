---
'@backstage/plugin-catalog-backend-module-ldap': patch
---

Added the ability to configure disabling one side of the relations tree with LDAP.

Groups have a `member` attribute and users have a `memberOf` attribute, however these can drift out of sync in some LDAP installations, leaving weird states in the Catalog as we collate these results together and deduplicate them.

You can chose to optionally disable one side of these relationships, or even both by setting the respective mapping to `null` in your `app-config.yaml` for your groups and/or users:

```yaml
catalog:
  providers:
    ldapOrg:
      default:
        target: ldaps://ds.example.net
        bind:
          dn: uid=ldap-reader-user,ou=people,ou=example,dc=example,dc=net
          secret: ${LDAP_SECRET}
        users:
          - dn: ou=people,ou=example,dc=example,dc=net
            options:
              filter: (uid=*)
            map:
              # this ensures that outgoing memberships from users is ignored
              memberOf: null
        groups:
          - dn: ou=access,ou=groups,ou=example,dc=example,dc=net
            options:
              filter: (&(objectClass=some-group-class)(!(groupType=email)))
            map:
              description: l
            set:
              metadata.customField: 'hello'
            map:
              # this ensures that outgoing memberships from groups is ignored
              members: null
```
