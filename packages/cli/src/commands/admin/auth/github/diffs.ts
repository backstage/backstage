/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export const addSignInPageDiff =
  '@@ -32,11 +32,27 @@\n' +
  " import { AppRouter, FlatRoutes } from '@backstage/core-app-api';\n" +
  " import { CatalogGraphPage } from '@backstage/plugin-catalog-graph';\n" +
  " import { RequirePermission } from '@backstage/plugin-permission-react';\n" +
  " import { catalogEntityCreatePermission } from '@backstage/plugin-catalog-common/alpha';\n" +
  "+import { githubAuthApiRef } from '@backstage/core-plugin-api';\n" +
  "+import { SignInPage } from '@backstage/core-components';\n" +
  ' \n' +
  ' const app = createApp({\n' +
  '   apis,\n' +
  '+  components: {\n' +
  '+    SignInPage: props => (\n' +
  '+      <SignInPage\n' +
  '+        {...props}\n' +
  '+        auto\n' +
  '+        provider={{\n' +
  "+          id: 'github-auth-provider',\n" +
  "+          title: 'GitHub',\n" +
  "+          message: 'Sign in using GitHub',\n" +
  '+          apiRef: githubAuthApiRef,\n' +
  '+        }}\n' +
  '+      />\n' +
  '+    ),\n' +
  '+  },\n' +
  '   bindRoutes({ bind }) {\n' +
  '     bind(catalogPlugin.externalRoutes, {\n' +
  '       createComponent: scaffolderPlugin.routes.root,\n' +
  '       viewTechDoc: techdocsPlugin.routes.docRoot,\n';

export const replaceSignInResolverDiff =
  '@@ -36,18 +36,18 @@\n' +
  '       //\n' +
  '       //   https://backstage.io/docs/auth/identity-resolver\n' +
  '       github: providers.github.create({\n' +
  '         signIn: {\n' +
  '-          resolver(_, ctx) {\n' +
  "-            const userRef = 'user:default/guest'; // Must be a full entity reference\n" +
  '-            return ctx.issueToken({\n' +
  '-              claims: {\n' +
  "-                sub: userRef, // The user's own identity\n" +
  '-                ent: [userRef], // A list of identities that the user claims ownership through\n' +
  '-              },\n' +
  '-            });\n' +
  '-          },\n' +
  '-          // resolver: providers.github.resolvers.usernameMatchingUserEntityName(),\n' +
  '+          // resolver(_, ctx) {\n' +
  "+          //   const userRef = 'user:default/guest'; // Must be a full entity reference\n" +
  '+          //   return ctx.issueToken({\n' +
  '+          //     claims: {\n' +
  "+          //       sub: userRef, // The user's own identity\n" +
  '+          //       ent: [userRef], // A list of identities that the user claims ownership through\n' +
  '+          //     },\n' +
  '+          //   });\n' +
  '+          // },\n' +
  '+          resolver: providers.github.resolvers.usernameMatchingUserEntityName(),\n' +
  '         },\n' +
  '       }),\n' +
  '     },\n' +
  '   });\n';
