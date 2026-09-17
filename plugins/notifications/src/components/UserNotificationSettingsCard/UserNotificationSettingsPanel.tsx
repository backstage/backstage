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

import { useState } from 'react';
import {
  NotificationSettings,
  OriginSetting,
} from '@backstage/plugin-notifications-common';
import { Text } from '@backstage/ui';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { notificationsTranslationRef } from '../../translation';
import { TopicRow } from './TopicRow';
import { OriginRow } from './OriginRow';
import styles from './UserNotificationSettingsPanel.module.css';

export const UserNotificationSettingsPanel = (props: {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
  originNames?: Record<string, string>;
  topicNames?: Record<string, string>;
}) => {
  const { settings, onChange } = props;
  const { t } = useTranslationRef(notificationsTranslationRef);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleRowToggle = (originId: string) => {
    setExpandedRows(prevState => {
      const newExpandedRows = new Set(prevState);
      if (newExpandedRows.has(originId)) {
        newExpandedRows.delete(originId);
      } else {
        newExpandedRows.add(originId);
      }
      return newExpandedRows;
    });
  };
  const handleChange = (
    channelId: string,
    originId: string,
    topicId: string | null,
    enabled: boolean,
  ) => {
    const updatedSettings = {
      channels: settings.channels.map(channel => {
        if (channel.id !== channelId) {
          return channel;
        }
        return {
          ...channel,
          origins: channel.origins.map(origin => {
            if (origin.id !== originId) {
              return origin;
            }

            if (topicId === null) {
              return {
                ...origin,
                enabled,
                topics:
                  origin.topics?.map(topic => {
                    return { ...topic, enabled };
                  }) ?? [],
              };
            }

            return {
              ...origin,
              topics:
                origin.topics?.map(topic => {
                  if (topic.id === topicId) {
                    return {
                      ...topic,
                      enabled: origin.enabled ? enabled : origin.enabled,
                    };
                  }
                  return topic;
                }) ?? [],
            };
          }),
        };
      }),
    };
    onChange(updatedSettings);
  };

  if (settings.channels.length === 0) {
    return (
      <Text variant="body-medium">{t('settings.noSettingsAvailable')}</Text>
    );
  }

  const uniqueOriginsMap = settings.channels
    .flatMap(channel => channel.origins)
    .reduce((map, origin) => {
      if (!map.has(origin.id)) {
        map.set(origin.id, origin);
      }
      return map;
    }, new Map<string, OriginSetting>())
    .values();

  const uniqueOrigins = Array.from(uniqueOriginsMap);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell} />
          <th className={styles.headerCell}>
            <Text variant="title-x-small">{t('settings.table.origin')}</Text>
          </th>
          <th className={styles.headerCell}>
            <Text variant="title-x-small">{t('settings.table.topic')}</Text>
          </th>
          {settings.channels.map(channel => (
            <th key={channel.id} className={styles.headerCell}>
              <Text
                variant="title-x-small"
                style={{ textAlign: 'center', display: 'block' }}
              >
                {channel.id}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {uniqueOrigins.flatMap(origin => [
          <OriginRow
            key={origin.id}
            origin={origin}
            settings={settings}
            open={expandedRows.has(origin.id)}
            handleChange={handleChange}
            handleRowToggle={handleRowToggle}
          />,
          ...(expandedRows.has(origin.id)
            ? origin.topics?.map(topic => (
                <TopicRow
                  key={`${origin.id}-${topic.id}`}
                  topic={topic}
                  origin={origin}
                  settings={settings}
                  handleChange={handleChange}
                />
              )) || []
            : []),
        ])}
      </tbody>
    </table>
  );
};
