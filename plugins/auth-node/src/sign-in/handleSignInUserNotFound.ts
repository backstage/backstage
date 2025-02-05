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
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';

import { AuthResolverContext, BackstageSignInResult } from '../types';

/** @public */
export interface HandleSignInUserNotFoundOptions {
  ctx: AuthResolverContext;
  error: any;
  userEntityName: string;
  dangerouslyAllowSignInWithoutUserInCatalog: boolean | undefined;
}

/** @public */
export async function handleSignInUserNotFound(
  options: HandleSignInUserNotFoundOptions,
): Promise<BackstageSignInResult> {
  if (options.error?.name !== 'NotFoundError') {
    throw options.error;
  }
  if (!options.dangerouslyAllowSignInWithoutUserInCatalog) {
    throw new Error(
      'Failed to sign-in, unable to resolve user identity. Please verify that your catalog contains the expected User entities that would match your configured sign-in resolver. For non-production environments, manually provision the user or disable the user provisioning requirement by setting the `dangerouslyAllowSignInWithoutUserInCatalog` option.',
    );
  }

  const userEntityRef = stringifyEntityRef({
    kind: 'User',
    name: options.userEntityName,
    namespace: DEFAULT_NAMESPACE,
  });

  return options.ctx.issueToken({
    claims: {
      sub: userEntityRef,
      ent: [userEntityRef],
    },
  });
}
