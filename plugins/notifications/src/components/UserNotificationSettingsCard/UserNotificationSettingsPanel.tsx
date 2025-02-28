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
import HelpIcon from '@material-ui/icons/Help';
import Box from '@material-ui/core/Box';

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell);

export const UserNotificationSettingsPanel = (props: {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
  originNames?: Record<string, string>;
  channelHeaderHelpMessages?: Record<string, string>;
  channelToggleHelpMessages?: Record<string, Record<string, string>>;
}) => {
  const {
    settings,
    onChange,
    channelHeaderHelpMessages,
    channelToggleHelpMessages,
  } = props;
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
            <Box display="flex" flexDirection="row">
              <Typography variant="subtitle1">Origin</Typography>
              <Box display="flex" alignItems="center" ml={1}>
                <Tooltip title="Where the notification is originated from - normally a plugin such as the catalog">
                  <HelpIcon fontSize="small" />
                </Tooltip>
              </Box>
            </Box>
          </TableCell>
          {settings.channels.map(channel => (
            <TableCell key={channel.id}>
              <Box display="flex" flexDirection="row">
                <Typography variant="subtitle1">{channel.id}</Typography>
                {channelHeaderHelpMessages?.[channel.id] && (
                  <Box display="flex" alignItems="center" ml={1}>
                    <Tooltip title={channelHeaderHelpMessages[channel.id]}>
                      <HelpIcon fontSize="small" />
                    </Tooltip>
                  </Box>
                )}
              </Box>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {allOrigins.map(origin => (
          <TableRow key={origin}>
            <TableCell>{formatOriginName(origin)}</TableCell>
            {settings.channels.map(channel => (
              <TableCell key={channel.id}>
                <Tooltip
                  title={
                    channelToggleHelpMessages?.[origin]?.[
                      channel.id
                    ]?.toLocaleLowerCase('en-US') ??
                    `Enable or disable ${channel.id.toLocaleLowerCase(
                      'en-US',
                    )} notifications from ${formatOriginName(
                      origin,
                    ).toLocaleLowerCase('en-US')}`
                  }
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
