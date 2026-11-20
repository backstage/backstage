/*
 * Copyright 2026 The Backstage Authors
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

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { ScaffolderTaskStatus } from '@backstage/plugin-scaffolder-react';
import { parseDate } from '@internationalized/date';
import { DatePicker } from '@backstage/ui';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { scaffolderTranslationRef } from '../../translation';
import { OwnerListPicker } from './OwnerListPicker';
import { EntityRefAutocomplete } from './EntityRefAutocomplete';

export type TaskListFilterValues = {
  createdBy: string[];
  templateRef: string[];
  status: ScaffolderTaskStatus[];
  createdAfter?: string;
  createdBefore?: string;
};

export const emptyTaskListFilters: TaskListFilterValues = {
  createdBy: [],
  templateRef: [],
  status: [],
};

const taskStatuses: ScaffolderTaskStatus[] = [
  'open',
  'processing',
  'completed',
  'failed',
  'cancelled',
  'skipped',
];

/**
 * Filters for the task list: owner, template, status and creation time range.
 */
export const TaskListFilters = (props: {
  ownerFilter: 'owned' | 'all';
  onOwnerFilterChange: (ownerFilter: 'owned' | 'all') => void;
  value: TaskListFilterValues;
  onChange: (value: TaskListFilterValues) => void;
}) => {
  const { ownerFilter, onOwnerFilterChange, value, onChange } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const hasFilters =
    value.createdBy.length > 0 ||
    value.templateRef.length > 0 ||
    value.status.length > 0 ||
    !!value.createdAfter ||
    !!value.createdBefore;

  return (
    <Box display="flex" flexDirection="column" style={{ gap: 16 }}>
      <OwnerListPicker
        filter={ownerFilter}
        onSelectOwner={id => {
          onOwnerFilterChange(id);
          onChange({ ...value, createdBy: [] });
        }}
      />
      {ownerFilter === 'all' && (
        <EntityRefAutocomplete
          kind="user"
          label={t('taskListFilters.createdBy.label')}
          placeholder={t('taskListFilters.createdBy.placeholder')}
          value={value.createdBy}
          onChange={createdBy => onChange({ ...value, createdBy })}
        />
      )}
      <EntityRefAutocomplete
        kind="template"
        label={t('taskListFilters.template.label')}
        placeholder={t('taskListFilters.template.placeholder')}
        value={value.templateRef}
        onChange={templateRef => onChange({ ...value, templateRef })}
      />
      <Autocomplete<ScaffolderTaskStatus, true>
        multiple
        size="small"
        options={taskStatuses}
        value={value.status}
        onChange={(_, status) => onChange({ ...value, status })}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label={t('taskListFilters.status.label')}
          />
        )}
      />
      <DatePicker
        size="small"
        label={t('taskListFilters.createdAfter')}
        value={value.createdAfter ? parseDate(value.createdAfter) : null}
        maxValue={
          value.createdBefore ? parseDate(value.createdBefore) : undefined
        }
        onChange={date =>
          onChange({ ...value, createdAfter: date?.toString() })
        }
      />
      <DatePicker
        size="small"
        label={t('taskListFilters.createdBefore')}
        value={value.createdBefore ? parseDate(value.createdBefore) : null}
        minValue={
          value.createdAfter ? parseDate(value.createdAfter) : undefined
        }
        onChange={date =>
          onChange({ ...value, createdBefore: date?.toString() })
        }
      />
      {hasFilters && (
        <Button
          size="small"
          color="primary"
          onClick={() => onChange(emptyTaskListFilters)}
        >
          {t('taskListFilters.clear')}
        </Button>
      )}
    </Box>
  );
};
