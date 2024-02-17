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
import { SignInResolver } from '@backstage/plugin-auth-node';

/**
 * Provide a default implementation of the user to resolve to. By default, this
 *  is `user:development/guest`. We will attempt to get that user if they're in the
 *  catalog. If that user doesn't exist in the catalog, we will still create a
 *  token for them so they can keep viewing.
 */
export const signInAsGuestUser: (entityRef?: string) => SignInResolver<{}> =
  (entityRef?: string) => async (_, ctx) => {
    const userRef =
      entityRef ??
      stringifyEntityRef({
        kind: 'user',
        namespace: 'development',
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
