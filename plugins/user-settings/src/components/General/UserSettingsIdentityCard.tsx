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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useUserProfile } from '../useUserProfileInfo';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

const Contents = () => {
  const { backstageIdentity } = useUserProfile();
  const { t } = useTranslationRef(userSettingsTranslationRef);

  if (!backstageIdentity) {
    return <Typography>{t('identityCard.noIdentityTitle')}</Typography>;
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>
          {t('identityCard.userEntity')}:{' '}
          <EntityRefLinks entityRefs={[backstageIdentity.userEntityRef]} />
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">
          {t('identityCard.ownershipEntities')}:{' '}
          <EntityRefLinks entityRefs={backstageIdentity.ownershipEntityRefs} />
        </Typography>
      </Grid>
    </Grid>
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
