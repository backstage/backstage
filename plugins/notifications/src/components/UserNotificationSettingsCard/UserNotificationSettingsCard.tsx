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

import React, { useEffect } from 'react';
import { ErrorPanel, InfoCard, Progress } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import { useNotificationsApi } from '../../hooks';
import { NotificationSettings } from '@backstage/plugin-notifications-common';
import { notificationsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { UserNotificationSettingsPanel } from './UserNotificationSettingsPanel';

/** @public */
export type UserNotificationSettingsCardProps = {
  /**
   * Optional origin plugin display names
   */
  originNames?: Record<string, string>;
  /**
   * Optional help message for channel headers
   */
  channelHeaderHelpMessages?: Record<string, string>;
  /**
   * Optional help message for each channel toggle
   */
  channelToggleHelpMessages?: Record<string, Record<string, string>>;
  /**
   * Optional, text to display in a top banner (could be used for displaying additional context)
   */
  helpBannerMessage?: string;
};

/**
 *
 * @param props - Component props (see {@link UserNotificationSettingsCardProps})
 *
 * @example
 * With custom channel header helper messages:
 * ```tsx
 * <UserNotificationSettingsCard
 *    channelHeaderHelpMessages={{ Web: 'In app notification', Email: 'Email notification' }}
 * />
 * ```
 *
 * @example
 * With custom channel toggle helper messages:
 * ```tsx
 * <UserNotificationSettingsCard
 *    channelToggleHelpMessages={{
 *      'plugin:scaffolder': {
 *         Web: 'Receive in-app notification for supported scaffolder templates',
 *       },
 *      'plugin:my-stock-market-plugin': {
 *         Web: 'Receive in-app notification for stock price alert',
 *         Email: 'Receive email notification for every stock purchase'
 *       }
 *    }}
 * />
 * ```
 *
 * @public
 */
export const UserNotificationSettingsCard = (
  props: UserNotificationSettingsCardProps,
) => {
  const [settings, setNotificationSettings] = React.useState<
    NotificationSettings | undefined
  >(undefined);

  const client = useApi(notificationsApiRef);
  const { error, value, loading } = useNotificationsApi(api => {
    return api.getNotificationSettings();
  });

  useEffect(() => {
    if (!loading && !error) {
      setNotificationSettings(value);
    }
  }, [loading, value, error]);

  const onUpdate = (newSettings: NotificationSettings) => {
    client
      .updateNotificationSettings(newSettings)
      .then(updatedSettings => setNotificationSettings(updatedSettings));
  };

  return (
    <Box display="flex" flexDirection="column">
      {props.helpBannerMessage && (
        <Box mb={3}>
          <Alert severity="info">{props.helpBannerMessage}</Alert>
        </Box>
      )}

      <InfoCard title="Notification Settings" variant="gridItem">
        {loading && <Progress />}
        {error && <ErrorPanel title="Failed to load settings" error={error} />}
        {settings && (
          <UserNotificationSettingsPanel
            settings={settings}
            onChange={onUpdate}
            originNames={props.originNames}
            channelHeaderHelpMessages={props.channelHeaderHelpMessages}
            channelToggleHelpMessages={props.channelToggleHelpMessages}
          />
        )}
      </InfoCard>
    </Box>
  );
};
