/*
 * Copyright 2025 The Backstage Authors
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

import {
  createSignInResolverFactory,
  OAuthAuthenticatorResult,
  PassportProfile,
  SignInInfo,
} from '@backstage/plugin-auth-node';

import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';

export namespace openshiftSignInResolvers {
  export const displayNameMatchingUserEntityName = createSignInResolverFactory({
    create() {
      return async (
        info: SignInInfo<OAuthAuthenticatorResult<PassportProfile>>,
        ctx,
      ) => {
        const { displayName } = info.profile;

        if (!displayName) {
          throw new Error(
            `OpenShift user profile does not contain a displayName`,
          );
        }

        const userRef = stringifyEntityRef({
          kind: 'User',
          name: displayName,
          namespace: DEFAULT_NAMESPACE,
        });

        try {
          return await ctx.signInWithCatalogUser({ entityRef: userRef });
        } catch {
          // ignore, as it is possible that the user is not in the catalog
        }

        return ctx.issueToken({
          claims: {
            sub: userRef,
            ent: [userRef],
          },
        });
      };
    },
  });
}
