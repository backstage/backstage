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
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
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
    <TableRow>
      <NoBorderTableCell>
        {origin.topics && origin.topics.length > 0 && (
          <Tooltip
            title={`Show Topics for the ${formatOriginName(origin.id)} origin`}
          >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => handleRowToggle(origin.id)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        )}
      </NoBorderTableCell>
      <NoBorderTableCell>{formatOriginName(origin.id)}</NoBorderTableCell>
      <NoBorderTableCell>all</NoBorderTableCell>
      {settings.channels.map(ch => (
        <NoBorderTableCell key={ch.id} align="center">
          <Tooltip
            title={`Enable or disable ${ch.id.toLocaleLowerCase(
              'en-US',
            )} notifications from ${formatOriginName(origin.id)}`}
          >
            <Switch
              checked={isNotificationsEnabledFor(
                settings,
                ch.id,
                origin.id,
                null,
              )}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(ch.id, origin.id, null, event.target.checked);
              }}
            />
          </Tooltip>
        </NoBorderTableCell>
      ))}
    </TableRow>
  );
};
