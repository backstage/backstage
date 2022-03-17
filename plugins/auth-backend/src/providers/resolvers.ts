/*
 * Copyright 2022 The Backstage Authors
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
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { SignInResolver } from './types';

export const commonByEmailLocalPartResolver: SignInResolver<unknown> = async (
  info,
  ctx,
) => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('Login failed, user profile does not contain an email');
  }
  const [userId] = profile.email.split('@');

  const entityRef = stringifyEntityRef({
    kind: 'User',
    namespace: DEFAULT_NAMESPACE,
    name: userId,
  });
  const ownershipEntityRefs =
    await ctx.catalogIdentityClient.resolveCatalogMembership({
      entityRefs: [entityRef],
    });
  const token = await ctx.tokenIssuer.issueToken({
    claims: {
      sub: entityRef,
      ent: ownershipEntityRefs,
    },
  });

  return { id: userId, token };
};
