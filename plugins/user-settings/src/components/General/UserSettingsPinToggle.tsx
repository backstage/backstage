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

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import { useSidebarPinState } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { userSettingsTranslationRef } from '../../translation';

/** @public */
export const UserSettingsPinToggle = () => {
  const { isPinned, toggleSidebarPinState } = useSidebarPinState();
  const { t } = useTranslationRef(userSettingsTranslationRef);

  return (
    <ListItem>
      <ListItemText
        primary={t('pinToggle.title')}
        secondary={t('pinToggle.description')}
      />
      <ListItemSecondaryAction>
        <Tooltip
          placement="top"
          arrow
          title={
            isPinned
              ? t('pinToggle.switchTitles.unpin')
              : t('pinToggle.switchTitles.pin')
          }
        >
          <Switch
            color="primary"
            checked={isPinned}
            onChange={() => toggleSidebarPinState()}
            name="pin"
            inputProps={{ 'aria-label': t('pinToggle.ariaLabelTitle') }}
          />
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
