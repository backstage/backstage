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
import { AuthService, UserInfoService } from '@backstage/backend-plugin-api';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { NotAllowedError, NotFoundError } from '@backstage/errors';
import { CatalogService } from '@backstage/plugin-catalog-node';

export const createWhoAmIAction = ({
  auth,
  catalog,
  userInfo,
  actionsRegistry,
}: {
  auth: AuthService;
  catalog: CatalogService;
  userInfo: UserInfoService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'who-am-i',
    title: 'Who Am I',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description:
      'Returns the catalog entity and user info for the currently authenticated user. This action requires user credentials and cannot be used with service or unauthenticated credentials.',
    schema: {
      input: z => z.object({}),
      output: z =>
        z.object({
          entity: z
            .object({})
            .passthrough()
            .describe('The full catalog entity for the authenticated user'),
          userInfo: z
            .object({
              userEntityRef: z
                .string()
                .describe(
                  'The entity ref of the user, e.g. user:default/jane.doe',
                ),
              ownershipEntityRefs: z
                .array(z.string())
                .describe('Entity refs that the user claims ownership through'),
            })
            .describe(
              'User identity information extracted from the authentication token',
            ),
        }),
    },
    action: async ({ credentials }) => {
      if (!auth.isPrincipal(credentials, 'user')) {
        throw new NotAllowedError('This action requires user credentials');
      }

      const { userEntityRef } = credentials.principal;

      const [entity, info] = await Promise.all([
        catalog.getEntityByRef(userEntityRef, { credentials }),
        userInfo.getUserInfo(credentials),
      ]);

      if (!entity) {
        throw new NotFoundError(
          `User entity not found in the catalog for "${userEntityRef}"`,
        );
      }

      return {
        output: {
          entity,
          userInfo: info,
        },
      };
    },
  });
};
