---
id: identity-resolver--old
title: Sign-in Identities and Resolvers (Old Backend System)
description: An introduction to Backstage user identities and sign-in resolvers in the old backend system
---

:::info
This documentation is written for the old backend which has been replaced by
[the new backend system](../backend-system/index.md), being the default since
Backstage [version 1.24](../releases/v1.24.0.md). If have migrated to the new
backend system, you may want to read [its own article](./identity-resolver.md)
instead. Otherwise, [consider migrating](../backend-system/building-backends/08-migrating.md)!
:::

By default, every Backstage auth provider is configured only for the use-case of
access delegation. This enables Backstage to request resources and actions from
external systems on behalf of the user, for example re-triggering a build in CI.

If you want to use an auth provider to sign in users, you need to explicitly configure
it have sign-in enabled and also tell it how the external identities should
be mapped to user identities within Backstage.

## Quick Start

> See [providers](../reference/plugin-auth-backend.providers.md)
> for a full list of auth providers and their built-in sign-in resolvers.

Backstage projects created with `npx @backstage/create-app` come configured with a
sign-in resolver for GitHub guest access. This resolver makes all users share
a single "guest" identity and is only intended as a minimum requirement to quickly
get up and running. You can replace `github` for any of the other providers if you need.

This resolver should not be used in production, as it uses a single shared identity,
and has no restrictions on who is able to sign-in. Be sure to read through the rest
of this page to understand the Backstage identity system once you need to install
a resolver for your production environment.

The guest resolver can be useful for testing purposes too, and it looks like this:

```ts
signIn: {
  resolver(_, ctx) {
    const userRef = 'user:default/guest'
    return ctx.issueToken({
      claims: {
        sub: userRef,
        ent: [userRef],
      },
    }),
  },
},
```

## Backstage User Identity

A user identity within Backstage is built up from two pieces of information, a
user [entity reference](../features/software-catalog/references.md), and a
set of ownership entity references.
When a user signs in, a Backstage token is generated with these two pieces of information,
which is then used to identify the user within the Backstage ecosystem.

The user entity reference should uniquely identify the logged in user in Backstage.
It is encouraged that a matching user entity also exists within the Software Catalog,
but it is not required. If the user entity exists in the catalog it can be used to
store additional data about the user. There may even be some plugins that require
this for them to be able to function.

The ownership references are also entity references, and it is likewise
encouraged that these entities exist within the catalog, but it is not a requirement.
The ownership references are used to determine what the user owns, as a set
of references that the user claims ownership though. For example, a user
Jane (`user:default/jane`) might have the ownership references `user:default/jane`,
`group:default/team-a`, and `group:default/admins`. Given these ownership claims,
any entity that is marked as owned by either of `user:jane`, `team-a`, or `admins` would
be considered owned by Jane.

The ownership claims often contain the user entity reference itself, but it is not
required. It is also worth noting that the ownership claims can also be used to
resolve other relations similar to ownership, such as a claim for a `maintainer` or
`operator` status.

The Backstage token that encapsulates the user identity is a JWT. The user entity
reference is stored in the `sub` claim of the payload, while the ownership references
are stored in a custom `ent` claim. Both the user and ownership references should
always be full entity references, as opposed to shorthands like just `jane` or `user:jane`.

## Sign-in Resolvers

Signing in a user into Backstage requires a mapping of the user identity from the
third-party auth provider to a Backstage user identity. This mapping can vary quite
a lot between different organizations and auth providers, and because of that there's
no default way to resolve user identities. The auth provider that one wants to use
for sign-in must instead be configured with a sign-in resolver, which is a function
that is responsible for creating this user identity mapping.

The input to the sign-in resolver function is the result of a successful log in with
the given auth provider, as well as a context object that contains various helpers
for looking up users and issuing tokens. There are also a number of built-in sign-in
resolvers that can be used, which are covered a bit further down.

Note that while it possible to configure multiple auth providers to be used for sign-in,
you should take care when doing so. It is best to make sure that the different auth
providers either do not have any user overlap, or that any users that are able to log
in with multiple providers always end up with the same Backstage identity.

### Custom Resolver Example

Let's look at an example of a custom sign-in resolver for the Google auth provider.
This all typically happens within your `packages/backend/src/plugins/auth.ts` file,
which is responsible for setting up and configuring the auth backend plugin.

You provide the resolver as part of the options you pass when creating a new auth
provider factory. This means you need to replace the default Google provider with
one that you create. Be sure to also include the existing `defaultAuthProviderFactories`
if you want to keep all of the built-in auth providers installed.

Now let's look at the example, with the rest of the commentary being made with in
the code comments:

```ts
// File: packages/backend/src/plugins/auth.ts
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    ...env,
    providerFactories: {
      ...defaultAuthProviderFactories,
      google: providers.google.create({
        signIn: {
          resolver: async (info, ctx) => {
            const {
              profile: { email },
            } = info;
            // Profiles are not always guaranteed to have an email address.
            // You can also find more provider-specific information in `info.result`.
            // It typically contains a `fullProfile` object as well as ID and/or access
            // tokens that you can use for additional lookups.
            if (!email) {
              throw new Error('User profile contained no email');
            }

            // You can add your own custom validation logic here.
            // Logins can be prevented by throwing an error like the one above.
            myEmailValidator(email);

            // This example resolver simply uses the local part of the email as the name.
            const [name] = email.split('@');

            // This helper function handles sign-in by looking up a user in the catalog.
            // The lookup can be done either by reference, annotations, or custom filters.
            //
            // The helper also issues a token for the user, using the standard group
            // membership logic to determine the ownership references of the user.
            return ctx.signInWithCatalogUser({
              entityRef: { name },
            });
          },
        },
      }),
    },
  });
}
```

### Built-in Resolvers

You don't always have to write your own custom resolver. The auth backend plugin provides
built-in resolvers for many of the common sign-in patterns. You access these via the `resolvers`
property of each of the auth provider integrations. For example, the Google provider has
a built in resolver that works just like the one we defined above:

```ts
// File: packages/backend/src/plugins/auth.ts
export default async function createPlugin(
  // ...
  return await createRouter({
    // ...
    providerFactories: {
      // ...
      google: providers.google.create({
        signIn: {
          resolver: providers.google.resolvers.emailLocalPartMatchingUserEntityName(),
        },
      });
    }
  })
)
```

There are also other options, like the this one that looks up a user
by matching the `google.com/email` annotation of user entities in the catalog:

```ts
providers.google.create({
  signIn: {
    resolver: providers.google.resolvers.emailMatchingUserEntityAnnotation(),
  },
});
```

## Custom Ownership Resolution

If you want to have more control over the membership resolution and token generation
that happens during sign-in you can replace `ctx.signInWithCatalogUser` with a set
of lower-level calls:

```ts
// File: packages/backend/src/plugins/auth.ts
import { getDefaultOwnershipEntityRefs } from '@backstage/plugin-auth-backend';

export default async function createPlugin(
  // ...
  return await createRouter({
    // ...
    providerFactories: {
      // ...
      google: async ({ profile: { email } }, ctx) => {
        if (!email) {
          throw new Error('User profile contained no email');
        }

        // This step calls the catalog to look up a user entity. You could for example
        // replace it with a call to a different external system.
        const { entity } = await ctx.findCatalogUser({
          annotations: {
            'acme.org/email': email,
          },
        });

        // In this step we extract the ownership references from the user entity using
        // the standard logic. It uses a reference to the entity itself, as well as the
        // target of each `memberOf` relation where the target is of the kind `Group`.
        //
        // If you replace the catalog lookup with something that does not return
        // an entity you will need to replace this step as well.
        //
        // You might also replace it if you for example want to filter out certain groups.
        //
        // Note that `getDefaultOwnershipEntityRefs` only includes groups to which the
        // user has a direct MEMBER_OF relationship. It's perfectly fine to include
        // groups that the user is transitively part of in the claims array, but the
        // catalog doesn't currently provide a direct way of accessing this list of
        // groups.
        const ownershipRefs = getDefaultOwnershipEntityRefs(entity);

        // The last step is to issue the token, where we might provide more options in the future.
        return ctx.issueToken({
          claims: {
            sub: stringifyEntityRef(entity),
            ent: ownershipRefs,
          },
        });
      };
    }
  })
)
```

## Sign-In without Users in the Catalog

While populating the catalog with organizational data unlocks more powerful ways
to browse your software ecosystem, it might not always be a viable or prioritized
option. However, even if you do not have user entities populated in your catalog, you
can still sign in users. As there are currently no built-in sign-in resolvers for
this scenario you will need to implement your own.

Signing in a user that doesn't exist in the catalog is as simple as skipping the
catalog lookup step from the above example. Rather than looking up the user, we
instead immediately issue a token using whatever information is available. One caveat
is that it can be tricky to determine the ownership references, although it can
be achieved for example through a lookup to an external service. You typically
want to at least use the user itself as a lone ownership reference.

Because we no longer use the catalog as an allow-list of users, it is often important
that you limit what users are allowed to sign in. This could be a simple email domain
check like in the example below, or you might for example look up the GitHub organizations
that the user belongs to using the user access token in the provided result object.

```ts
// File: packages/backend/src/plugins/auth.ts
import { createRouter, providers } from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  stringifyEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    ...env,
    providerFactories: {
      google: providers.google.create({
        signIn: {
          resolver: async ({ profile }, ctx) => {
            if (!profile.email) {
              throw new Error(
                'Login failed, user profile does not contain an email',
              );
            }
            // Split the email into the local part and the domain.
            const [localPart, domain] = profile.email.split('@');

            // Next we verify the email domain. It is recommended to include this
            // kind of check if you don't look up the user in an external service.
            if (domain !== 'acme.org') {
              throw new Error(
                `Login failed, this email ${profile.email} does not belong to the expected domain`,
              );
            }

            // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
            const userEntity = stringifyEntityRef({
              kind: 'User',
              name: localPart,
              namespace: DEFAULT_NAMESPACE,
            });
            return ctx.issueToken({
              claims: {
                sub: userEntity,
                ent: [userEntity],
              },
            });
          },
        },
      }),
    },
  });
}
```

## AuthHandler

Similar to a custom sign-in resolver, you can also write a custom auth handler
function which is used to verify and convert the auth response into the profile
that will be presented to the user. This is where you can customize things like
display name and profile picture.

This is also the place where you can do authorization and validation of the user
and throw errors if the user should not be allowed access in Backstage.

```ts
// File: packages/backend/src/plugins/auth.ts
export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    ...
    providerFactories: {
      google: providers.google.create({
        authHandler: async ({
          fullProfile  // Type: passport.Profile,
          idToken      // Type: (Optional) string,
        }) => {
          // Custom validation code goes here
          return {
            profile: {
              email,
              picture,
              displayName,
            }
          };
        }
      })
    }
  })
}
```
