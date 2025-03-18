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

import React from 'react';
import {
  isNotificationsEnabledFor,
  NotificationSettings,
} from '@backstage/plugin-notifications-common';
import Table from '@material-ui/core/Table';
import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';
import { capitalize } from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell);

export const UserNotificationSettingsPanel = (props: {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
  originNames?: Record<string, string>;
}) => {
  const { settings, onChange } = props;
  const allOrigins = [
    ...new Set(
      settings.channels.flatMap(channel =>
        channel.origins.map(origin => origin.id),
      ),
    ),
  ];

  const handleChange = (
    channelId: string,
    originId: string,
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
            return {
              ...origin,
              enabled,
            };
          }),
        };
      }),
    };
    onChange(updatedSettings);
  };

  const formatOriginName = (originId: string) => {
    if (props.originNames && originId in props.originNames) {
      return props.originNames[originId];
    }
    return capitalize(originId.replaceAll(/[_:]/g, ' '));
  };

  if (settings.channels.length === 0 || allOrigins.length === 0) {
    return (
      <Typography variant="body1">
        No notification settings available, check back later
      </Typography>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <Typography variant="subtitle1">Origin</Typography>
          </TableCell>
          {settings.channels.map(channel => (
            <TableCell>
              <Typography variant="subtitle1">{channel.id}</Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {allOrigins.map(origin => (
          <TableRow>
            <TableCell>{formatOriginName(origin)}</TableCell>
            {settings.channels.map(channel => (
              <TableCell>
                <Tooltip
                  title={`Enable or disable ${channel.id.toLocaleLowerCase(
                    'en-US',
                  )} notifications from ${formatOriginName(
                    origin,
                  ).toLocaleLowerCase('en-US')}`}
                >
                  <Switch
                    checked={isNotificationsEnabledFor(
                      settings,
                      channel.id,
                      origin,
                    )}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(channel.id, origin, event.target.checked);
                    }}
                  />
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
