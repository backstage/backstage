/*
 * Copyright 2020 The Backstage Authors
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

import { useApi, identityApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useAsyncRetry } from 'react-use';

export const useUserProfile = () => {
  const identityApi = useApi(identityApiRef);
  const userId = identityApi.getUserId();
  const identityProviderProfile = identityApi.getProfile();

  const catalogApi = useApi(catalogApiRef);

  const { value: entity } = useAsyncRetry(
    () =>
      catalogApi.getEntityByName({
        kind: 'User',
        namespace: 'default',
        name: userId,
      }),
    [catalogApi, userId],
  );

  // TODO: decide how to handle asynchronous loading.
  // Right now the information from the identity provider
  // are returned as fallback when catalog info are not available
  const profile = { ...identityProviderProfile, ...entity?.spec?.profile };
  const displayName = profile.displayName ?? userId;

  return { profile, displayName };
};
