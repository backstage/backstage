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

import { createProxyAuthenticator } from '@backstage/plugin-auth-node';
import { NotAllowedError } from '@backstage/errors';
import { stringifyEntityRef, UserEntity } from '@backstage/catalog-model';

const DEFAULT_USER_ENTITY_REF = stringifyEntityRef({
  kind: 'user',
  namespace: 'development',
  name: 'guest',
});

export const guestAuthenticator = createProxyAuthenticator({
  defaultProfileTransform: async (
    result: { userEntityRef?: string },
    context,
  ) => {
    // Get the userEntityRef from the result (passed from authenticate function)
    const userEntityRef = result.userEntityRef || DEFAULT_USER_ENTITY_REF;

    try {
      // Try to find the user in the catalog
      const catalogUser = await context.findCatalogUser({
        entityRef: userEntityRef,
      });
      const userEntity = catalogUser.entity as UserEntity;

      // Extract profile information from the catalog user entity
      const profile = {
        displayName: userEntity.spec?.profile?.displayName,
        email: userEntity.spec?.profile?.email,
        picture: userEntity.spec?.profile?.picture,
      };

      return { profile };
    } catch (error) {
      // If user is not found in catalog, return empty profile
      return { profile: {} };
    }
  },
  initialize({ config }) {
    const allowOutsideDev = config.getOptionalBoolean(
      'dangerouslyAllowOutsideDevelopment',
    );
    const userEntityRef =
      config.getOptionalString('userEntityRef') ?? DEFAULT_USER_ENTITY_REF;
    return {
      disabled:
        process.env.NODE_ENV !== 'development' && allowOutsideDev !== true,
      userEntityRef,
    };
  },
  async authenticate(_, context) {
    if (context.disabled) {
      throw new NotAllowedError(
        "The guest provider cannot be used outside of a development environment unless 'auth.providers.guest.dangerouslyAllowOutsideDevelopment' is enabled",
      );
    }
    return { result: { userEntityRef: context.userEntityRef } };
  },
});
