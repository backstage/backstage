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

import {
  isNotificationsEnabledFor,
  NotificationSettings,
  OriginSetting,
  TopicSetting,
} from '@backstage/plugin-notifications-common';
import { Switch, Tooltip, TooltipTrigger } from '@backstage/ui';
import { NoBorderTableCell } from './NoBorderTableCell';
import { useNotificationFormat } from './UserNotificationSettingsCard';

export const TopicRow = (props: {
  topic: TopicSetting;
  origin: OriginSetting;
  settings: NotificationSettings;
  handleChange: (
    channel: string,
    origin: string,
    topic: string | null,
    enabled: boolean,
  ) => void;
}) => {
  const { topic, origin, settings, handleChange } = props;
  const { formatOriginName, formatTopicName } = useNotificationFormat();
  return (
    <tr>
      <NoBorderTableCell />
      <NoBorderTableCell />
      <NoBorderTableCell>{formatTopicName(topic.id)}</NoBorderTableCell>
      {settings.channels.map(ch => (
        <NoBorderTableCell key={`${ch.id}-${topic.id}`} align="center">
          <TooltipTrigger>
            <Switch
              isSelected={isNotificationsEnabledFor(
                settings,
                ch.id,
                origin.id,
                topic.id,
              )}
              onChange={(isSelected: boolean) => {
                handleChange(ch.id, origin.id, topic.id, isSelected);
              }}
            />
            <Tooltip>{`Enable or disable ${ch.id.toLocaleLowerCase(
              'en-US',
            )} notifications for the ${formatTopicName(
              topic.id,
            )} topic from ${formatOriginName(origin.id)}`}</Tooltip>
          </TooltipTrigger>
        </NoBorderTableCell>
      ))}
    </tr>
  );
};
