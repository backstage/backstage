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

import React, { useState } from 'react';
import {
  isNotificationsEnabledFor,
  NotificationSettings,
} from '@backstage/plugin-notifications-common';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Table from '@material-ui/core/Table';
import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
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

const TopicTableRow = withStyles({
  root: {
    paddingLeft: '4px',
  },
})(TableRow);

export const UserNotificationSettingsPanel = (props: {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
  originNames?: Record<string, string>;
  topicNames?: Record<string, string>;
}) => {
  const { settings, onChange } = props;
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
    return formatName(originId, props.originNames);
  };

  const formatTopicName = (topicId: string) => {
    return formatName(topicId, props.topicNames);
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
          <TableCell />
          <TableCell>
            <Typography variant="subtitle1">Origin</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle1">Topic</Typography>
          </TableCell>
          {settings.channels.map(channel => (
            <TableCell key={channel.id}>
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
              <TableCell>
                {origin.topics && origin.topics.length > 0 && (
                  <Tooltip
                    title={`Show Topics for the ${formatOriginName(
                      origin.id,
                    )} origin`}
                  >
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => handleRowToggle(origin.id)}
                    >
                      {expandedRows.has(origin.id) ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>{formatOriginName(origin.id)}</TableCell>
              <TableCell>*</TableCell>
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
            ...(expandedRows.has(origin.id)
              ? origin.topics?.map(topic => (
                  <TopicTableRow key={`${origin.id}-${topic.id}`}>
                    <TableCell />
                    <TableCell />
                    <TableCell>{formatTopicName(topic.id)}</TableCell>
                    {settings.channels.map(ch => (
                      <TableCell key={`${ch.id}-${topic.id}`} align="center">
                        <Tooltip
                          title={`Enable or disable ${channel.id.toLocaleLowerCase(
                            'en-US',
                          )} notifications for the ${formatTopicName(
                            topic.id,
                          )} topic from ${formatOriginName(origin.id)}`}
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
                )) || []
              : []),
          ]),
        )}
      </TableBody>
    </Table>
  );
};
