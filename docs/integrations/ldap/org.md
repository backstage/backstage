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

## Installation

1. Install this plugin into your backend package using your package manager of
   choice.

```bash
cd packages/backend                                       # Go to your backend package from your project root
yarn add @backstage/plugin-catalog-backend-module-ldap    # Install this plugin
```

Then, follow the steps below to set it up.

### Automatic Setup

Set up this plugin automatically by running `yarn setup-ldap`. You will be
guided through the installation process by an interactive prompt, asking you
questions about your organization's LDAP setup. Particularly, it will ask you
the following questions:

1.  **The LDAP plugin does not appear to be installed in your software catalog.
    Would you like to add it?** Answering _yes_ updates your backend's catalog
    plugin to import and use the LDAP plugin. (Step 1 of
    [manual installation](#manual-installation))

2.  **The LDAP plugin does not appear to be set up in your application config.
    Would you like to add it?** Answering _yes_ updates the `app-config.yaml` at
    the root of your Backstage project after receiving more information from you
    in subsequent prompts. Namely,

    1. Your LDAP service host: this is a fully qualified URL starting with
       `ldap://` or `ldaps://` which Backstage will communicate with.
    2. The **bind DN** used to connect to your LDAP service: this is effectively
       a connection string that identifies a user against the LDAP service. We
       do not require a password or a secret, because we suggest passing this in
       via an environment variable when starting Backstage.
    3. The **base DN** when searching for users in your LDAP service: this is a
       string representing a location in your LDAP tree from which to start
       searching for users.
    4. The **filter string** to use when searching for users in your LDAP
       service: this is a string representing LDAP filters that identify _user_
       records in your LDAP service.
    5. The **base DN** when searching for groups in your LDAP service: this is a
       string representing a location in your LDAP tree from which to start
       searching for groups.
    6. The **filter string** to use when searching for groups in your LDAP
       service: this is a string representing LDAP filters that identify _user_
       records in your LDAP service.

    These questions are optional, and if left blank, your `app-config.yaml` will
    be updated with placeholder values that can be updated manually.

### Manual Setup

For a more manual installation, follow these steps.

1. The `LdapOrgReaderProcessor` is not registered by default, so you have to
   register it in the catalog plugin:

```typescript
// In packages/backend/src/plugins/catalog.ts,
// add an import

import { LdapOrgReaderProcessor } from '@backstage/plugin-catalog-backend-module-ldap';

// ... after const builder = [...] is assigned, add the processor:
builder.addProcessor(
  LdapOrgReaderProcessor.fromConfig(env.config, {
    logger: env.logger,
  }),
);
```

If you're working in a default scaffolded Backstage application, this should set
up your catalog to import users and groups from your LDAP service. Finally,
we'll need to update `app-config.yaml` to tell Backstage how to connect to your
LDAP service:

```yaml
# Under the catalog key,
catalog:
  locations:
    # After other locations,
    - type: ldap-org
      target: ldaps://ds.example.net # Your LDAP service host

  # Add the ldap processor to catalog.processors:
  processors:
    ldapOrg:
      providers:
        - target: ldaps://ds.example.net # Your LDAP service host
          # Your "bind DN" or connection string
          bind:
            dn: uid=ldap-reader-user,ou=people,ou=example,dc=example,dc=net
            secret: ${LDAP_SECRET} # Reads from an environment variable
          users:
            dn: ou=people,ou=example,dc=example,dc=net # base DN to search for users
            options:
              filter: (uid=*) # filter string for users
          groups:
            dn: ou=access,ou=groups,ou=example,dc=example,dc=net # base DN to search for groups
            options:
              filter: (&(objectClass=some-group-class)(!(groupType=email))) # filter string for groups
```

Locations point out the specific org(s) you want to import. The `type` of these
locations must be `ldap-org`, and the `target` must point to the exact URL
(starting with `ldap://` or `ldaps://`) of the targeted LDAP server. You can
have several such location entries if you want, but typically you will have just
one.

The processor itself is configured in the other block, under
`catalog.processors.ldapOrg`. There may be many providers, each targeting a
specific `target` which is supposed to be on the same form as the location
`target`.

That's it – this plugin is now set up and will import users and groups from your
LDAP service. If you run into issues around load times, data volume,
`TimeLimitExceeded`, or similar, you might need to work with results returned
from your LDAP service using _pagination_, as well as supply a longer time limit
within which requests can respond.

To learn about these along with other configuration options available, please
read the next section.

## Configuration

These config blocks have a lot of options in them, so we will describe each
"root" key within the block separately.

### target

This is the URL of the targeted server, typically on the form
`ldaps://ds.example.net` for SSL enabled servers or `ldap://ds.example.net`
without SSL.

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
config, the processor will still copy the attribute `cn` into the entity field
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
config, the processor will still copy the attribute `cn` into the entity field
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

## Customize the Processor

In case you want to customize the ingested entities, the
`LdapOrgReaderProcessor` allows to pass transformers for users and groups.

1. Create a transformer:

```ts
export async function myGroupTransformer(
  vendor: LdapVendor,
  config: GroupConfig,
  group: SearchEntry,
): Promise<GroupEntity | undefined> {
  // Transformations may change namespace, change entity naming pattern, fill
  // profile with more or other details...

  // Create the group entity on your own, or wrap the default transformer
  return await defaultGroupTransformer(vendor, config, group);
}
```

2. Configure the processor with the transformer:

```ts
builder.addProcessor(
  LdapOrgReaderProcessor.fromConfig(config, {
    logger,
    groupTransformer: myGroupTransformer,
  }),
);
```
