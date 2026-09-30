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

import { useState, useEffect } from 'react';
import { ErrorPanel, InfoCard, Progress } from '@backstage/core-components';
import { useNotificationsApi } from '../../hooks';
import { NotificationSettings } from '@backstage/plugin-notifications-common';
import { notificationsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { notificationsTranslationRef } from '../../translation';
import { UserNotificationSettingsPanel } from './UserNotificationSettingsPanel';
import { NotificationFormatProvider } from './NotificationFormatContext';

/** @public */
export const UserNotificationSettingsCard = (props: {
  originNames?: Record<string, string>;
  topicNames?: Record<string, string>;
}) => {
  const { t } = useTranslationRef(notificationsTranslationRef);
  const [settings, setNotificationSettings] = useState<
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
    <InfoCard title={t('settings.title')} variant="gridItem">
      {loading && <Progress />}
      {error && <ErrorPanel title={t('settings.errorTitle')} error={error} />}
      {settings && (
        <NotificationFormatProvider
          originMap={props.originNames}
          topicMap={props.topicNames}
        >
          <UserNotificationSettingsPanel
            settings={settings}
            onChange={onUpdate}
          />
        </NotificationFormatProvider>
      )}
    </InfoCard>
  );
};
