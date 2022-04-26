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

import { SignInResolver } from './types';

/**
 * A common sign-in resolver that looks up the user using the local part of
 * their email address as the entity name.
 */
export const commonByEmailLocalPartResolver: SignInResolver<unknown> = async (
  info,
  ctx,
) => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('Login failed, user profile does not contain an email');
  }
  const [localPart] = profile.email.split('@');

  return ctx.signInWithCatalogUser({
    entityRef: { name: localPart },
  });
};

/**
 * A common sign-in resolver that looks up the user using their email address
 * as email of the entity.
 */
export const commonByEmailResolver: SignInResolver<unknown> = async (
  info,
  ctx,
) => {
  const { profile } = info;

  if (!profile.email) {
    throw new Error('Login failed, user profile does not contain an email');
  }

  return ctx.signInWithCatalogUser({
    filter: {
      'spec.profile.email': profile.email,
    },
  });
};
