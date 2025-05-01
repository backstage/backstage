---
'@backstage/plugin-catalog-backend-module-ldap': patch
---

Added the ability to configure disabling one side of the relations tree with LDAP.

Groups have a `member` attribute and users have a `memberOf` attribute, however these often can drift out of sync, leaving weird states in the Catalog as we collate these results together and deduplicate them.

You can chose to optionally disable one side of these relationships, or even both by providing config in `app-config.yaml` under either the `GroupConfig` or `UserConfig`:

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
            parsing:
              # this defaults to false, to disable use the following:
              skipMemberOf: true
        groups:
          - dn: ou=access,ou=groups,ou=example,dc=example,dc=net
            options:
              filter: (&(objectClass=some-group-class)(!(groupType=email)))
            map:
              description: l
            set:
              metadata.customField: 'hello'
            parsing:
              # this defaults to false, to disable use the following:
              skipMember: true
```
