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

import { InfoCard } from '@backstage/core-components';
import { EntityRefLinks } from '@backstage/plugin-catalog-react';
import { useUserProfile } from '../useUserProfileInfo';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

const Contents = () => {
  const { backstageIdentity } = useUserProfile();
  const { t } = useTranslationRef(userSettingsTranslationRef);

  if (!backstageIdentity) {
    return (
      <p className="text-sm text-muted-foreground">
        {t('identityCard.noIdentityTitle')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      <div>
        <p className="text-base font-medium mb-1">
          {t('identityCard.userEntity')}:{' '}
          <EntityRefLinks entityRefs={[backstageIdentity.userEntityRef]} />
        </p>
      </div>
      <div>
        <p className="text-base font-medium">
          {t('identityCard.ownershipEntities')}:{' '}
          <EntityRefLinks entityRefs={backstageIdentity.ownershipEntityRefs} />
        </p>
      </div>
    </div>
  );
};

/** @public */
export const UserSettingsIdentityCard = () => {
  const { t } = useTranslationRef(userSettingsTranslationRef);

  return (
    <InfoCard title={t('identityCard.title')}>
      <Contents />
    </InfoCard>
  );
};
