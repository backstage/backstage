/*
 * Copyright 2021 The Backstage Authors
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
  makeStyles,
  useTheme,
  IconButton,
  Grid,
  Button,
} from '@material-ui/core';
import FilterList from '@material-ui/icons/FilterList';
import React, { useEffect, useState } from 'react';
import { InfoCard, Select } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';
import { BuildStatus } from '../../api';
import { DatePickerComponent } from '../DatePickerComponent';

export type ActiveFilters = {
  from: string;
  to: string;
  buildStatus?: BuildStatus;
};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  filtersContent: {
    padding: theme.spacing(2, 2, 2, 2.5),
  },
}));

type FilterOption<T> = T | 'all';

interface FiltersProps {
  initDates: { from: string; to: string };
  onFilterChange: (filters: ActiveFilters) => void;
}

export const BuildListFilterComponent = ({
  onFilterChange,
  initDates,
}: FiltersProps) => {
  const classes = useStyles(useTheme<BackstageTheme>());
  const [status, setStatus] = useState<BuildStatus | undefined>();
  const [from, setFrom] = useState<string>(initDates.from);
  const [to, setTo] = useState<string>(initDates.to);
  const [open, setOpen] = useState(false);

  useEffect(() => onFilterChange({ from, to, buildStatus: status }), [
    onFilterChange,
    from,
    to,
    status,
  ]);

  const numFilters =
    Number(!!status) +
    Number(from !== initDates.from) +
    Number(to !== initDates.to);

  const clear = () => {
    setStatus(undefined);
    setFrom(initDates.from);
    setTo(initDates.to);
  };

  const title = (
    <>
      <IconButton onClick={() => setOpen(!open)} aria-label="filter list">
        <FilterList />
      </IconButton>
      Filters ({numFilters})
      {!!numFilters && (
        <Button color="primary" onClick={clear}>
          Clear all
        </Button>
      )}
    </>
  );

  const statusItems: { label: string; value: FilterOption<BuildStatus> }[] = [
    { label: 'All', value: 'all' },
    { label: 'Succeeded', value: 'succeeded' },
    { label: 'Failed', value: 'failed' },
    { label: 'Stopped', value: 'stopped' },
  ];

  const content = (
    <Grid
      container
      spacing={3}
      direction="row"
      className={classes.filtersContent}
    >
      <Grid item xs={2}>
        <DatePickerComponent label="From" value={from} onDateChange={setFrom} />
      </Grid>
      <Grid item xs={2}>
        <DatePickerComponent label="To" value={to} onDateChange={setTo} />
      </Grid>
      <Grid item xs={2}>
        <Select
          label="Status"
          items={statusItems}
          selected={!status ? 'all' : status}
          onChange={arg =>
            setStatus(arg === 'all' ? undefined : (arg as BuildStatus))
          }
        />
      </Grid>
    </Grid>
  );

  return (
    <InfoCard
      title={title}
      titleTypographyProps={{ variant: 'h6' }}
      divider={open}
      noPadding
      variant="gridItem"
    >
      {open && content}
    </InfoCard>
  );
};
