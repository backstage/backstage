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

import { useCallback } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { FeatureFlag } from '@backstage/core-plugin-api';
import {
  featureFlagsApiRef,
  useApi,
  useFeatureFlag,
  useTranslationRef,
} from '@backstage/frontend-plugin-api';
import { TranslationFunction } from '@backstage/core-plugin-api/alpha';
import { userSettingsTranslationRef } from '../../translation';

type Props = {
  flag: FeatureFlag;
  initiallyEnabled: boolean;
};

const getSecondaryText = (
  flag: FeatureFlag,
  t: TranslationFunction<typeof userSettingsTranslationRef.T>,
) => {
  const pluginText = (
    <Typography variant="caption" color="textSecondary">
      {flag.pluginId
        ? t('featureFlags.flagItem.subtitle.registeredInPlugin', {
            pluginId: flag.pluginId,
          })
        : t('featureFlags.flagItem.subtitle.registeredInApplication')}
    </Typography>
  );

  if (flag.description) {
    return (
      <>
        <Typography variant="body2" color="textSecondary">
          {flag.description}
        </Typography>
        {pluginText}
      </>
    );
  }

  return pluginText;
};

export const FlagItem = ({ flag, initiallyEnabled }: Props) => {
  const { t } = useTranslationRef(userSettingsTranslationRef);
  const featureFlagsApi = useApi(featureFlagsApiRef);

  const enabled =
    useFeatureFlag(flag.name, { strictPresence: true }) ?? initiallyEnabled;

  const toggleHandler = useCallback(() => {
    featureFlagsApi.setFlag(flag.name, !enabled);
  }, [featureFlagsApi, enabled, flag.name]);

  return (
    <ListItem divider button onClick={toggleHandler}>
      <ListItemIcon>
        <Tooltip
          placement="top"
          arrow
          title={
            enabled
              ? t('featureFlags.flagItem.title.disable')
              : t('featureFlags.flagItem.title.enable')
          }
        >
          <Switch color="primary" checked={enabled} name={flag.name} />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary={flag.name} secondary={getSecondaryText(flag, t)} />
    </ListItem>
  );
};
