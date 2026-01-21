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
import { ChangeEvent } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { notificationsTranslationRef } from '../../translation';
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

type TranslationKey = keyof (typeof notificationsTranslationRef)['T'];

export const CreatedAfterOptions = {
  last24h: {
    labelKey: 'filters.createdAfter.last24h' satisfies TranslationKey,
    getDate: () => new Date(Date.now() - 24 * 3600 * 1000),
  },
  lastWeek: {
    labelKey: 'filters.createdAfter.lastWeek' satisfies TranslationKey,
    getDate: () => new Date(Date.now() - 7 * 24 * 3600 * 1000),
  },
  all: {
    labelKey: 'filters.createdAfter.anyTime' satisfies TranslationKey,
    getDate: () => new Date(0),
  },
} as const;

export const SortByOptions = {
  newest: {
    labelKey: 'filters.sortBy.newest' satisfies TranslationKey,
    sortBy: {
      sort: 'created' as const,
      sortOrder: 'desc' as const,
    },
  },
  oldest: {
    labelKey: 'filters.sortBy.oldest' satisfies TranslationKey,
    sortBy: {
      sort: 'created' as const,
      sortOrder: 'asc' as const,
    },
  },
  topic: {
    labelKey: 'filters.sortBy.topic' satisfies TranslationKey,
    sortBy: {
      sort: 'topic' as const,
      sortOrder: 'asc' as const,
    },
  },
  origin: {
    labelKey: 'filters.sortBy.origin' satisfies TranslationKey,
    sortBy: {
      sort: 'origin' as const,
      sortOrder: 'asc' as const,
    },
  },
} as const;

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
  const { t } = useTranslationRef(notificationsTranslationRef);
  const sortByText = getSortByText(sorting);

  const handleOnCreatedAfterChanged = (
    event: ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    onCreatedAfterChanged(event.target.value as string);
  };

  const handleOnViewChanged = (
    event: ChangeEvent<{ name?: string; value: unknown }>,
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
    event: ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const idx = ((event.target.value as string) ||
      'newest') as keyof typeof SortByOptions;
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
    event: ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const value: NotificationSeverity =
      (event.target.value as NotificationSeverity) || 'normal';
    onSeverityChanged(value);
  };

  const handleOnTopicChanged = (
    event: ChangeEvent<{ name?: string; value: unknown }>,
  ) => {
    const value = event.target.value as string;
    onTopicChanged(value === ALL ? undefined : value);
  };

  const sortedAllTopics = (allTopics || []).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">{t('filters.title')}</Typography>
          <Divider variant="fullWidth" />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-view">
              {t('filters.view.label')}
            </InputLabel>
            <Select
              labelId="notifications-filter-view"
              label={t('filters.view.label')}
              value={viewValue}
              onChange={handleOnViewChanged}
            >
              <MenuItem value="unread">{t('filters.view.unread')}</MenuItem>
              <MenuItem value="read">{t('filters.view.read')}</MenuItem>
              <MenuItem value="saved">{t('filters.view.saved')}</MenuItem>
              <MenuItem value="all">{t('filters.view.all')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-created">
              {t('filters.createdAfter.label')}
            </InputLabel>

            <Select
              label={t('filters.createdAfter.label')}
              labelId="notifications-filter-created"
              placeholder={t('filters.createdAfter.placeholder')}
              value={createdAfter}
              onChange={handleOnCreatedAfterChanged}
            >
              {Object.keys(CreatedAfterOptions).map((key: string) => (
                <MenuItem value={key} key={key}>
                  {t(
                    CreatedAfterOptions[key as keyof typeof CreatedAfterOptions]
                      .labelKey,
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-sort">
              {t('filters.sortBy.label')}
            </InputLabel>

            <Select
              label={t('filters.sortBy.label')}
              labelId="notifications-filter-sort"
              placeholder={t('filters.sortBy.placeholder')}
              value={sortByText}
              onChange={handleOnSortByChanged}
            >
              {Object.keys(SortByOptions).map((key: string) => (
                <MenuItem value={key} key={key}>
                  {t(SortByOptions[key as keyof typeof SortByOptions].labelKey)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-severity">
              {t('filters.severity.label')}
            </InputLabel>

            <Select
              label={t('filters.severity.label')}
              labelId="notifications-filter-severity"
              value={severity}
              onChange={handleOnSeverityChanged}
            >
              {(
                ['critical', 'high', 'normal', 'low'] as NotificationSeverity[]
              ).map(key => (
                <MenuItem value={key} key={key}>
                  {t(`filters.severity.${key}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="notifications-filter-topic">
              {t('filters.topic.label')}
            </InputLabel>

            <Select
              label={t('filters.topic.label')}
              labelId="notifications-filter-topic"
              value={topic ?? ALL}
              onChange={handleOnTopicChanged}
            >
              <MenuItem value={ALL} key={ALL}>
                {t('filters.topic.anyTopic')}
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
