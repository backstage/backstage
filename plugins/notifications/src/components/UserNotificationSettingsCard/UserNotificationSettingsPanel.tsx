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
import ChevronRight from '@material-ui/icons/ChevronRight';
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

const CenterContentsTableCell = withStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
})(MuiTableCell);

const TopicTableRow = withStyles({
  root: {
    paddingLeft: '4px',
  },
})(TableRow);

export const UserNotificationSettingsPanel = (props: {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
  originNames?: Record<string, string>;
}) => {
  const { settings, onChange } = props;
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

  const formatOriginName = (originId: string) => {
    if (props.originNames && originId in props.originNames) {
      return props.originNames[originId];
    }
    return capitalize(originId.replaceAll(/[_:]/g, ' '));
  };

  if (settings.channels.length === 0) {
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
          <CenterContentsTableCell>
            <Typography variant="subtitle1">Origin</Typography> <ChevronRight />{' '}
            <Typography variant="subtitle1">Topic</Typography>
          </CenterContentsTableCell>
          {settings.channels.map(channel => (
            <TableCell>
              <Typography variant="subtitle1" align="center">
                {channel.id}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {settings.channels.map(channel =>
          channel.origins.flatMap(origin => [
            <TableRow key={`${channel.id}-${origin.id}`}>
              <TableCell>{formatOriginName(origin.id)}</TableCell>
              {settings.channels.map(ch => (
                <TableCell key={ch.id} align="center">
                  <Tooltip
                    title={`Enable or disable ${channel.id.toLocaleLowerCase(
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
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        handleChange(
                          ch.id,
                          origin.id,
                          null,
                          event.target.checked,
                        );
                      }}
                    />
                  </Tooltip>
                </TableCell>
              ))}
            </TableRow>,
            ...(origin.topics?.map(topic => (
              <TopicTableRow key={`${origin.id}-${topic.id}`}>
                <CenterContentsTableCell>
                  <ChevronRight />
                  {topic.id}
                </CenterContentsTableCell>
                {settings.channels.map(ch => (
                  <TableCell key={`${ch.id}-${topic.id}`} align="center">
                    <Tooltip
                      title={`Enable or disable ${channel.id.toLocaleLowerCase(
                        'en-US',
                      )} notifications for the ${
                        topic.id
                      } topic from ${formatOriginName(origin.id)}`}
                    >
                      <Switch
                        checked={isNotificationsEnabledFor(
                          settings,
                          ch.id,
                          origin.id,
                          topic.id,
                        )}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          handleChange(
                            ch.id,
                            origin.id,
                            topic.id,
                            event.target.checked,
                          );
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                ))}
              </TopicTableRow>
            )) || []),
          ]),
        )}
      </TableBody>
    </Table>
  );
};
