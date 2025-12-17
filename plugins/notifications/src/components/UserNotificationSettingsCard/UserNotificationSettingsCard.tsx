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

import { createContext, useState, useContext, useEffect } from 'react';
import { ErrorPanel, InfoCard, Progress } from '@backstage/core-components';
import { useNotificationsApi } from '../../hooks';
import { NotificationSettings } from '@backstage/plugin-notifications-common';
import { notificationsApiRef } from '../../api';
import { useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { notificationsTranslationRef } from '../../translation';
import { UserNotificationSettingsPanel } from './UserNotificationSettingsPanel';
import { capitalize } from 'lodash';

type FormatContextType = {
  formatOriginName: (id: string) => string;
  formatTopicName: (id: string) => string;
};

const NotificationFormatContext = createContext<FormatContextType | undefined>(
  undefined,
);

export const useNotificationFormat = () => {
  const { t } = useTranslationRef(notificationsTranslationRef);
  const context = useContext(NotificationFormatContext);
  if (!context) throw new Error(t('settings.errors.useNotificationFormat'));
  return context;
};

type Props = {
  children: React.ReactNode;
  originMap: Record<string, string> | undefined;
  topicMap: Record<string, string> | undefined;
};

export const NotificationFormatProvider = ({
  children,
  originMap,
  topicMap,
}: Props) => {
  const formatName = (
    id: string,
    nameMap: Record<string, string> | undefined,
  ) => {
    if (nameMap && id in nameMap) {
      return nameMap[id];
    }
    return capitalize(id.replaceAll(/[-_:]/g, ' '));
  };

  const formatOriginName = (originId: string) => {
    return formatName(originId, originMap);
  };

  const formatTopicName = (topicId: string) => {
    return formatName(topicId, topicMap);
  };
  return (
    <NotificationFormatContext.Provider
      value={{ formatOriginName, formatTopicName }}
    >
      {children}
    </NotificationFormatContext.Provider>
  );
};

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
