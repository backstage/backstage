/*
 * Copyright 2021 The Backstage Authors
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

import { InfoCard, useSidebarPinState } from '@backstage/core-components';
import List from '@material-ui/core/List';
import { UserSettingsPinToggle } from './UserSettingsPinToggle';
import { UserSettingsThemeToggle } from './UserSettingsThemeToggle';
import { UserSettingsLanguageToggle } from './UserSettingsLanguageToggle';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

/** @public */
export const UserSettingsAppearanceCard = () => {
  const { isMobile } = useSidebarPinState();
  const { t } = useTranslationRef(userSettingsTranslationRef);

  return (
    <InfoCard title={t('appearanceCard.title')} variant="gridItem">
      <List dense>
        <UserSettingsThemeToggle />
        <UserSettingsLanguageToggle />
        {!isMobile && <UserSettingsPinToggle />}
      </List>
    </InfoCard>
  );
};
