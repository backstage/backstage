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
} from '@backstage/plugin-notifications-common';
import { ButtonIcon, Switch, Tooltip, TooltipTrigger } from '@backstage/ui';
import { RiArrowDownSLine, RiArrowUpSLine } from '@remixicon/react';
import { NoBorderTableCell } from './NoBorderTableCell';
import { useNotificationFormat } from './UserNotificationSettingsCard';

export const OriginRow = (props: {
  origin: OriginSetting;
  settings: NotificationSettings;
  handleChange: (
    channel: string,
    origin: string,
    topic: string | null,
    enabled: boolean,
  ) => void;
  open: boolean;
  handleRowToggle: (originId: string) => void;
}) => {
  const { origin, settings, handleChange, open, handleRowToggle } = props;
  const { formatOriginName } = useNotificationFormat();
  return (
    <tr>
      <NoBorderTableCell>
        {origin.topics && origin.topics.length > 0 && (
          <TooltipTrigger>
            <ButtonIcon
              aria-label="expand row"
              onPress={() => handleRowToggle(origin.id)}
              icon={
                open ? (
                  <RiArrowUpSLine size={16} />
                ) : (
                  <RiArrowDownSLine size={16} />
                )
              }
              variant="secondary"
            />
            <Tooltip>{`Show Topics for the ${formatOriginName(
              origin.id,
            )} origin`}</Tooltip>
          </TooltipTrigger>
        )}
      </NoBorderTableCell>
      <NoBorderTableCell>{formatOriginName(origin.id)}</NoBorderTableCell>
      <NoBorderTableCell>all</NoBorderTableCell>
      {settings.channels.map(ch => (
        <NoBorderTableCell key={ch.id} align="center">
          <TooltipTrigger>
            <Switch
              isSelected={isNotificationsEnabledFor(
                settings,
                ch.id,
                origin.id,
                null,
              )}
              onChange={(isSelected: boolean) => {
                handleChange(ch.id, origin.id, null, isSelected);
              }}
            />
            <Tooltip>{`Enable or disable ${ch.id.toLocaleLowerCase(
              'en-US',
            )} notifications from ${formatOriginName(origin.id)}`}</Tooltip>
          </TooltipTrigger>
        </NoBorderTableCell>
      ))}
    </tr>
  );
};
