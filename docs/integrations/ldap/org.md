---
id: org
title: LDAP Organizational Data
sidebar_label: Org Data
# prettier-ignore
description: Setting up ingestion of organizational data from LDAP
---

The Backstage catalog can be set up to ingest organizational data - users and
groups - directly from an LDAP compatible service. The result is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group) kind
entities that mirror your org setup.

## Supported vendors

Backstage in general supports OpenLDAP compatible vendors, as well as Active Directory and FreeIPA. If you are using a vendor that does not seem to be supported, please [file an issue](https://github.com/backstage/backstage/issues/new?assignees=&labels=enhancement&template=feature_template.md).

## Installation

The provider is not installed by default, therefore you have to add a dependency
to `@backstage/plugin-catalog-backend-module-ldap` to your backend package.

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-ldap
```

Next add the basic configuration to `app-config.yaml`

```yaml title="app-config.yaml"
catalog:
  providers:
    ldapOrg:
      default:
        target: ldaps://ds.example.net
        bind:
          dn: uid=ldap-reader-user,ou=people,ou=example,dc=example,dc=net
          secret: ${LDAP_SECRET}
        schedule:
          frequency: PT1H
          timeout: PT15M
```

Finally, updated your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-ldap'));
/* highlight-add-end */
```

## Configuration

The following configuration is a small example of how a setup could look for
importing groups and users from a corporate LDAP server.

Users and Groups can be configured for multiple `dn` entries as an array.

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
              description: l
            set:
              metadata.customField: 'hello'
        groups:
          - dn: ou=access,ou=groups,ou=example,dc=example,dc=net
            options:
              filter: (&(objectClass=some-group-class)(!(groupType=email)))
            map:
              description: l
            set:
              metadata.customField: 'hello'
```

These config blocks have a lot of options in them, so we will describe each "root" key within the block separately.

> NOTE:
>
> If you want to import users and groups from different LDAP servers, you can define multiple providers with different names.
> If they should come from the same server, you can define multiple users and groups blocks within the same provider using an array of users / groups.
> Entries coming from the same block will be able to detect group memberships based on the `memberOf` attribute.
>
> If you want only to import users or groups, you can omit the groups or users block.

### target

This is the URL of the targeted server, typically on the form
`ldaps://ds.example.net` for SSL enabled servers or `ldap://ds.example.net`
without SSL.

#### target.tls.keys

`keys` in TLS options specifies location of a file, that contains private keys
to establish connection with your LDAP server, in PEM format. See an example
for Google Secure LDAP Service below.

#### target.tls.certs

`certs` in TLS options specifies location of a file, that contains certificate
chains to establish connection with your LDAP server, in PEM format. See an
example for Google Secure LDAP Service below.

### bind

The bind block specifies how the plugin should bind (essentially, to
authenticate) towards the server. It has the following fields.

```yaml
dn: uid=ldap-reader-user,ou=people,ou=example,dc=example,dc=net
secret: ${LDAP_SECRET}
```

The `dn` is the full LDAP Distinguished Name for the user that the plugin
authenticates itself as. At this point, only regular user based authentication
is supported.

The `secret` is the password of the same user. In this example, it is given in
the form of an environment variable `LDAP_SECRET`, that has to be set when the
backend starts.

### users

The `users` block defines the settings that govern the reading and
interpretation of users. Its fields are explained in separate sections below.

#### users.dn

The DN under which users are stored, e.g.
`ou=people,ou=example,dc=example,dc=net`.

#### users.options

The search options to use when sending the query to the server, when reading all
users. All the options are shown below, with their default values, but they are
all optional.

```yaml
options:
  # One of 'base', 'one', or 'sub'.
  scope: one
  # The filter is the one that you commonly will want to specify explicitly. It
  # is a string on the standard LDAP query format. Use it to select out the set
  # of users that are of actual interest to ingest. For example, you may want
  # to filter out disabled users.
  filter: (uid=*)
  # The attribute selectors for each item, as passed to the LDAP server.
  attributes: ['*', '+']
  # This field is either 'false' to disable paging when reading from the
  # server, or an object on the form '{ pageSize: 100, pagePause: true }' that
  # specifies the details of how the paging shall work.
  paged: false
```

#### users.set

This optional piece lets you specify a number of JSON paths (on a.b.c form) and
hard coded values to set on those paths. This can be useful for example if you
want to hard code a namespace or similar on the generated entities.

```yaml
set:
  # Just an example; the key and value can be anything
  metadata.namespace: 'ldap'
```

#### users.map

Mappings from well known entity fields, to LDAP attribute names. This is where
you are able to define how to interpret the attributes of each LDAP result item,
and to move them into the corresponding entity fields. All the options are shown
below, with their default values, but they are all optional.

If you leave out an optional mapping, it will still be copied using that default
value. For example, even if you do not put in the field `displayName` in your
config, the provider will still copy the attribute `cn` into the entity field
`spec.profile.displayName`.

```yaml
map:
  # The name of the attribute that holds the relative
  # distinguished name of each entry.
  rdn: uid
  # The name of the attribute that shall be used for the value of
  # the metadata.name field of the entity.
  name: uid
  # The name of the attribute that shall be used for the value of
  # the metadata.description field of the entity.
  description: description
  # The name of the attribute that shall be used for the value of
  # the spec.profile.displayName field of the entity.
  displayName: cn
  # The name of the attribute that shall be used for the value of
  # the spec.profile.email field of the entity.
  email: mail
  # The name of the attribute that shall be used for the value of
  # the spec.profile.picture field of the entity.
  picture: <nothing, left out>
  # The name of the attribute that shall be used for the values of
  # the spec.memberOf field of the entity.
  memberOf: memberOf
```

### groups

The `groups` block defines the settings that govern the reading and
interpretation of groups. Its fields are explained in separate sections below.

#### groups.dn

The DN under which groups are stored, e.g.
`ou=people,ou=example,dc=example,dc=net`.

#### groups.options

The search options to use when sending the query to the server, when reading all
groups. All the options are shown below, with their default values, but they are
all optional.

```yaml
options:
  # One of 'base', 'one', or 'sub'.
  scope: one
  # The filter is the one that you commonly will want to specify explicitly. It
  # is a string on the standard LDAP query format. Use it to select out the set
  # of groups that are of actual interest to ingest. For example, you may want
  # to filter out disabled groups.
  filter: (&(objectClass=some-group-class)(!(groupType=email)))
  # The attribute selectors for each item, as passed to the LDAP server.
  attributes: ['*', '+']
  # This field is either 'false' to disable paging when reading from the
  # server, or an object on the form '{ pageSize: 100, pagePause: true }' that
  # specifies the details of how the paging shall work.
  paged: false
```

#### groups.set

This optional piece lets you specify a number of JSON paths (on a.b.c form) and
hard coded values to set on those paths. This can be useful for example if you
want to hard code a namespace or similar on the generated entities.

```yaml
set:
  # Just an example; the key and value can be anything
  metadata.namespace: 'ldap'
```

#### groups.map

Mappings from well known entity fields, to LDAP attribute names. This is where
you are able to define how to interpret the attributes of each LDAP result item,
and to move them into the corresponding entity fields. All of the options are
shown below, with their default values, but they are all optional.

If you leave out an optional mapping, it will still be copied using that default
value. For example, even if you do not put in the field `displayName` in your
config, the provider will still copy the attribute `cn` into the entity field
`spec.profile.displayName`. If the target field is optional, such as the display
name, the importer will accept missing attributes and just leave the target
field unset. If the target field is mandatory, such as the name of the entity,
validation will fail if the source attribute is missing.

```yaml
map:
  # The name of the attribute that holds the relative
  # distinguished name of each entry. This value is copied into a
  # well known annotation to be able to query by it later.
  rdn: cn
  # The name of the attribute that shall be used for the value of
  # the metadata.name field of the entity.
  name: cn
  # The name of the attribute that shall be used for the value of
  # the metadata.description field of the entity.
  description: description
  # The name of the attribute that shall be used for the value of
  # the spec.type field of the entity.
  type: groupType
  # The name of the attribute that shall be used for the value of
  # the spec.profile.displayName field of the entity.
  displayName: cn
  # The name of the attribute that shall be used for the value of
  # the spec.profile.email field of the entity.
  email: <nothing, left out>
  # The name of the attribute that shall be used for the value of
  # the spec.profile.picture field of the entity.
  picture: <nothing, left out>
  # The name of the attribute that shall be used for the values of
  # the spec.parent field of the entity.
  memberOf: memberOf
  # The name of the attribute that shall be used for the values of
  # the spec.children field of the entity.
  members: member
```

## Optional Vendor Configuration

In case the LDAP vendor isn't automatically detected by the module, an optional `vendor` configuration section is available which allows overriding the location for `dn` and `uuid` settings, and a case sensitivity setting.

#### vendor.dnAttributeName

Allows explicitly defining the name of the attribute that stores each entry's DN.

#### vendor.uuidAttributeName

Allows explicitly defining the name of the attribute that stores each entry's UUID.

#### vendor.dnCaseSensitive

Provides the ability to ignore case sensitivity issues with user/group mappings. If set to true, the ingestion will link user/members to groups whether their `dn`, `member`, or `memberOf` values have the right case or not.

```yaml
vendor:
  # Attribute name override for the distinguished name (DN) of an entry.
  dnAttributeName: dn
  # Attribute name override for the unique identifier (UUID) of an entry.
  uuidAttributeName: uuid
  # Attribute to force values provided from dn and members/memberOf values all to lowercase.
  # This is to resolve potential user/group mapping issues if case differences on dn strings.
  dnCaseSensitive: true
```

## Customize the Provider

In case you want to customize the ingested entities, the provider allows to pass
transformers for users and groups.

Transformers can be configured by extending `ldapOrgEntityProviderTransformsExtensionPoint`. Here is an example:

```ts title="packages/backend/src/index.ts"
import { createBackendModule } from '@backstage/backend-plugin-api';
import { ldapOrgEntityProviderTransformsExtensionPoint } from '@backstage/plugin-catalog-backend-module-ldap';
import { myUserTransformer, myGroupTransformer } from './transformers';

backend.add(
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'ldap-extensions',
    register(env) {
      env.registerInit({
        deps: {
          /* highlight-add-start */
          ldapTransformers: ldapOrgEntityProviderTransformsExtensionPoint,
          /* highlight-add-end */
        },
        async init({ ldapTransformers }) {
          /* highlight-add-start */
          ldapTransformers.setUserTransformer(myUserTransformer);
          ldapTransformers.setGroupTransformer(myGroupTransformer);
          /* highlight-add-end */
        },
      });
    },
  }),
);
```
