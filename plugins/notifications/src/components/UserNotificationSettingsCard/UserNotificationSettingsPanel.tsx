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
import Table from '@material-ui/core/Table';
import MuiTableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import { TopicRow } from './TopicRow';
import { OriginRow } from './OriginRow';

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
  },
})(MuiTableCell);

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

  if (settings.channels.length === 0) {
    return (
      <Typography variant="body1">
        No notification settings available, check back later
      </Typography>
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
      </TableBody>
    </Table>
  );
};
