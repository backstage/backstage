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

import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { GetNotificationsOptions } from '../../api';
import { NotificationSeverity } from '@backstage/plugin-notifications-common';

export type SortBy = Required<
  Pick<GetNotificationsOptions, 'sort' | 'sortOrder'>
>;

export type NotificationsFiltersProps = {
  unreadOnly?: boolean;
  onUnreadOnlyChanged: (checked: boolean | undefined) => void;
  createdAfter?: string;
  onCreatedAfterChanged: (value: string) => void;
  sorting: SortBy;
  onSortingChanged: (sortBy: SortBy) => void;
  saved?: boolean;
  onSavedChanged: (checked: boolean | undefined) => void;
  severity: NotificationSeverity;
  onSeverityChanged: (severity: NotificationSeverity) => void;
  topic?: string;
  onTopicChanged: (value: string | undefined) => void;
  allTopics?: string[];
};

const ALL = '___all___';

export const CreatedAfterOptions: {
  [key: string]: { label: string; getDate: () => Date };
} = {
  last24h: {
    label: 'Last 24h',
    getDate: () => new Date(Date.now() - 24 * 3600 * 1000),
  },
  lastWeek: {
    label: 'Last week',
    getDate: () => new Date(Date.now() - 7 * 24 * 3600 * 1000),
  },
  all: {
    label: 'Any time',
    getDate: () => new Date(0),
  },
};

export const SortByOptions: {
  [key: string]: {
    label: string;
    sortBy: SortBy;
  };
} = {
  newest: {
    label: 'Newest on top',
    sortBy: {
      sort: 'created',
      sortOrder: 'desc',
    },
  },
  oldest: {
    label: 'Oldest on top',
    sortBy: {
      sort: 'created',
      sortOrder: 'asc',
    },
  },
  topic: {
    label: 'Topic',
    sortBy: {
      sort: 'topic',
      sortOrder: 'asc',
    },
  },
  origin: {
    label: 'Origin',
    sortBy: {
      sort: 'origin',
      sortOrder: 'asc',
    },
  },
};

const getSortByText = (sortBy?: SortBy): string => {
  if (sortBy?.sort === 'created' && sortBy?.sortOrder === 'asc') {
    return 'oldest';
  }
  if (sortBy?.sort === 'topic') {
    return 'topic';
  }
  if (sortBy?.sort === 'origin') {
    return 'origin';
  }

  return 'newest';
};

const AllSeverityOptions: { [key in NotificationSeverity]: string } = {
  critical: 'Critical',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
};

export const NotificationsFilters = ({
  sorting,
  onSortingChanged,
  unreadOnly,
  onUnreadOnlyChanged,
  createdAfter,
  onCreatedAfterChanged,
  saved,
  onSavedChanged,
  severity,
  onSeverityChanged,
  topic,
  onTopicChanged,
  allTopics,
}: NotificationsFiltersProps) => {
  const sortByText = getSortByText(sorting);

  const handleOnCreatedAfterChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    onCreatedAfterChanged(event.target.value as string);
  };

  const handleOnViewChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    if (event.target.value === 'unread') {
      onUnreadOnlyChanged(true);
      onSavedChanged(undefined);
    } else if (event.target.value === 'read') {
      onUnreadOnlyChanged(false);
      onSavedChanged(undefined);
    } else if (event.target.value === 'saved') {
      onUnreadOnlyChanged(undefined);
      onSavedChanged(true);
    } else {
      // All
      onUnreadOnlyChanged(undefined);
      onSavedChanged(undefined);
    }
  };

  const handleOnSortByChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const idx = (event.target.value as string) || 'newest';
    const option = SortByOptions[idx];
    onSortingChanged({ ...option.sortBy });
  };

  let viewValue = 'all';
  if (saved) {
    viewValue = 'saved';
  } else if (unreadOnly) {
    viewValue = 'unread';
  } else if (unreadOnly === false) {
    viewValue = 'read';
  }

  const handleOnSeverityChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const value: NotificationSeverity =
      (event.target.value as NotificationSeverity) || 'normal';
    onSeverityChanged(value);
  };

  const handleOnTopicChanged = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const value = event.target.value as string;
    onTopicChanged(value === ALL ? undefined : value);
  };

  const sortedAllTopics = (allTopics || []).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">Filters</Typography>
          <Divider variant="fullWidth" />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-view">View</InputLabel>
            <Select
              labelId="notifications-filter-view"
              label="View"
              value={viewValue}
              onChange={handleOnViewChanged}
            >
              <MenuItem value="unread">Unread notifications</MenuItem>
              <MenuItem value="read">Read notifications</MenuItem>
              <MenuItem value="saved">Saved</MenuItem>
              <MenuItem value="all">All</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-created">Sent out</InputLabel>

            <Select
              label="Sent out"
              labelId="notifications-filter-created"
              placeholder="Notifications since"
              value={createdAfter}
              onChange={handleOnCreatedAfterChanged}
            >
              {Object.keys(CreatedAfterOptions).map((key: string) => (
                <MenuItem value={key} key={key}>
                  {CreatedAfterOptions[key].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-sort">Sort by</InputLabel>

            <Select
              label="Sort by"
              labelId="notifications-filter-sort"
              placeholder="Field to sort by"
              value={sortByText}
              onChange={handleOnSortByChanged}
            >
              {Object.keys(SortByOptions).map((key: string) => (
                <MenuItem value={key} key={key}>
                  {SortByOptions[key].label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-severity">
              Min severity
            </InputLabel>

            <Select
              label="Min severity"
              labelId="notifications-filter-severity"
              value={severity}
              onChange={handleOnSeverityChanged}
            >
              {Object.keys(AllSeverityOptions).map((key: string) => (
                <MenuItem value={key} key={key}>
                  {AllSeverityOptions[key as NotificationSeverity]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-topic">Topic</InputLabel>

            <Select
              label="Topic"
              labelId="notifications-filter-topic"
              value={topic ?? ALL}
              onChange={handleOnTopicChanged}
            >
              <MenuItem value={ALL} key={ALL}>
                Any topic
              </MenuItem>

              {sortedAllTopics.map((item: string) => (
                <MenuItem value={item} key={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};
