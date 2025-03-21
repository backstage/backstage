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

import {
  alertApiRef,
  identityApiRef,
  ProfileInfo,
  useApi,
} from '@backstage/core-plugin-api';
import { useEffect } from 'react';
import useAsync from 'react-use/esm/useAsync';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { UserEntity } from '@backstage/catalog-model';

/** @public */
export const useUserProfile = () => {
  const identityApi = useApi(identityApiRef);
  const alertApi = useApi(alertApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { value, loading, error } = useAsync(async () => {
    let identityProfile = await identityApi.getProfileInfo();
    const backStageIdentity = await identityApi.getBackstageIdentity();
    const catalogProfile = (await catalogApi.getEntityByRef(
      backStageIdentity.userEntityRef,
    )) as unknown as UserEntity;
    if (
      identityProfile.picture === undefined &&
      catalogProfile?.spec?.profile?.picture
    ) {
      identityProfile = {
        ...identityProfile,
        picture: catalogProfile.spec.profile.picture,
      };
    }
    return {
      profile: identityProfile,
      identity: backStageIdentity,
    };
  }, []);

  useEffect(() => {
    if (error) {
      alertApi.post({
        message: `Failed to load user identity: ${error}`,
        severity: 'error',
      });
    }
  }, [error, alertApi]);

  if (loading || error) {
    return {
      profile: {} as ProfileInfo,
      displayName: '',
      loading,
    };
  }

  return {
    profile: value!.profile,
    backstageIdentity: value!.identity,
    displayName: value!.profile.displayName ?? value!.identity.userEntityRef,
    loading,
  };
};
