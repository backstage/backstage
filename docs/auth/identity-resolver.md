---
id: identity-resolver
title: Identity resolver
description: Identity resolvers of Backstage users after they sign-in
---

This guide explains how the identity of a Backstage user is stored inside their
Backstage Identity Token and how you can customize the Sign In resolvers to
include identity and group membership information of the user from other
external systems. This ultimately helps with determining the ownership of a
Backstage entity by a user. The ideas here were originally proposed in the RFC
[#4089](https://github.com/backstage/backstage/issues/4089).

When a user signs in to Backstage, inside the `claims` field of their Backstage
ID Token (which are standard JWT tokens) a special `ent` field is set. `ent`
contains a list of [entity references](../features/software-catalog/references),
each of which denotes an identity or a membership that is relevant to the user.
There is no guarantee that these correspond to actual existing catalog entities.

Let's take an example sign-in resolver for the Google auth provider and explore
how the `ent` field inside `claims` can be set.

Inside your `packages/backend/src/plugins/auth.ts` file, you can provide custom
sign-in resolvers and set them for any of the Authentication providers inside
`providerFactories` of the `createRouter` imported from the
`@backstage/plugin-auth-backend` plugin.

```ts
export default async function createPlugin({
  ...
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    ...
    providerFactories: {
      google: createGoogleProvider({
        signIn: {
          resolver: async ({ profile: { email } }, ctx) => {
            if (!email) {
              throw new Error('No email associated with user account');
            }

            // Ignore email addresses which do not belong to company's domain name
            if (email.split('@')[1] != 'mycompany.com') {
              throw new Error('Unrecognized domain name of the email ID used to sign in.')
            }

            // List of entity references that denote the identity and membership of the user
            const ent = [];

            // Let's use the username in the email ID as the user's default unique identifier inside Backstage
            const id = email.split('@')[0];
            // Let's add the unique ID in the list
            ent.push(id)
            // Note: While the complete entity references look like `kind:namespace/name`, it should be safe to assume
            // that standalone strings without any : or / can be interpresed as user kind in the default namespace. So,
            // a 'freben' inside the `ent` list should be translated to `User:default/freben` when making any assertions.

            // Let's call the GitHub Enterprise API inside the company and get the teams that the user belongs to
            const gheUsername = getGheUsername(email);
            const gheTeams = getGheTeams(gheUsername);

            // Let's add the GHE identities to ent claims inside a new ghe namespace to keep things separate from the
            // default namespace.
            ent.push(`User:ghe/${gheUsername}`)
            gheTeams.forEach(team => ent.push(`Group:ghe/${team}`))

            // Let's call the internal LDAP provider to get a list of groups the user belongs to
            const ldapGroups = getLdapGroups(email);
            ldapGroups.forEach(ldapGroup => ent.push(`Group:myldap/${ldapGroup}`))

            // Issue the token containing the entity claims
            const token = await ctx.tokenIssuer.issueToken({
              claims: { sub: id, ent },
            });
            return { id, token };
          },
        },
      }),
    },
  });
}
```

As you can see, the generated Backstage ID Token now contains all the claims
about the identity and membership of the user. Once the sign-in process is
complete, and we need to find out if a user owns an Entity in the Software
Catalog, these `ent` claims can be used to determine the ownership. A full
algorithm as proposed in the RFC is as follows

The definition of the ownership of an entity E, for a user U, is as follows:

- Get all the `ownedBy` relations of E, and call them O
- Get all the claims of the user U and call them C
- If any C matches any O, return `true`
- Get all Group entities that U is a member of, using the regular
  `memberOf`/`hasMember` relation mechanism, and call them G
- If any G matches any O, return `true`
- Otherwise, return `false`

## Default sign-in resolvers

Of course you don't have to customize the sign-in resolver if you don't need to.
The Auth backend plugin comes with a set of default sign-in resolvers which you
can use. For example - the Google provider has a default email-based sign in
resolver, which will search the catalog for a single user entity that has a
matching `google.com/email` annotation.

It can be enabled like this

```tsx
# File: packages/backend/src/plugins/auth.ts
...
export default async function createPlugin({
  ...
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    ...
    providerFactories: {
      google: createGoogleProvider({
        signIn: {
          resolver: 'email'
        }
...
```

## Profile transform

Similar to a custom sign-in resolver, you can also write custom profile
transformation function which is used to verify and convert the auth response
into the profile that will be presented to the user. This is where you can
customize things like display name and profile picture.

```tsx
# File: packages/backend/src/plugins/auth.ts
...
export default async function createPlugin({
  ...
}: PluginEnvironment): Promise<Router> {
  return await createRouter({
    ...
    providerFactories: {
      google: createGoogleProvider({
        signIn: {
          resolver: 'email'
        },
        profileTransform: async ({
          fullProfile  // Type: passport.Profile,
          idToken      // Type: (Optional) string,
        }): ProfileInfo => {
          // Do stuff
          return {
            email,
            picture,
            displayName,
          };
        }
      })
    }
  })
}
```
