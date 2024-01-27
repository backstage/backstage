/*
 * Copyright 2024 The Backstage Authors
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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { createSignInResolverFactory } from '@backstage/plugin-auth-node';

export const guestResolver = createSignInResolverFactory({
  create() {
    return async (_, ctx) => {
      const userRef = stringifyEntityRef({
        kind: 'user',
        name: 'guest',
      });
      try {
        return ctx.signInWithCatalogUser({ entityRef: userRef });
      } catch (err) {
        // We can't guarantee that a guest user exists in the catalog, so we issue a token directly,
        return ctx.issueToken({
          claims: {
            sub: userRef,
            ent: [userRef],
          },
        });
      }
    };
  },
});
