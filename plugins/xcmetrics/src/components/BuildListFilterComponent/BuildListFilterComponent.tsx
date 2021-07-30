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

import React, { useEffect, useState } from 'react';
import { makeStyles, IconButton, Grid, Button } from '@material-ui/core';
import FilterList from '@material-ui/icons/FilterList';
import { InfoCard, Select } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { BuildFilters, BuildStatus, xcmetricsApiRef } from '../../api';
import { DatePickerComponent } from '../DatePickerComponent';

const toSelectItems = (strings: string[]) => {
  return strings.map(str => ({ label: str, value: str }));
};

const useStyles = makeStyles<BackstageTheme>(theme => ({
  filtersContent: {
    padding: theme.spacing(2, 2, 2, 2.5),
  },
}));

type FilterOption<T> = T | 'all';

interface FiltersProps {
  initialValues: BuildFilters;
  onFilterChange: (filters: BuildFilters) => void;
}

export const BuildListFilterComponent = ({
  onFilterChange,
  initialValues,
}: FiltersProps) => {
  const client = useApi(xcmetricsApiRef);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);

  useEffect(() => onFilterChange(values), [onFilterChange, values]);

  const numFilters = Object.keys(values).reduce((sum, key) => {
    const filtersKey = key as keyof BuildFilters;
    return sum + Number(values[filtersKey] !== initialValues[filtersKey]);
  }, 0);

  const title = (
    <>
      <IconButton
        onClick={() => setOpen(!open)}
        aria-label={`${open ? 'hide' : 'show'} filters`}
      >
        <FilterList />
      </IconButton>
      Filters ({numFilters})
      {!!numFilters && (
        <Button color="primary" onClick={() => setValues(initialValues)}>
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

  const { value: projects, loading } = useAsync(async () => {
    return client.getProjects();
  }, []);

  const content = (
    <Grid
      container
      spacing={3}
      direction="row"
      className={classes.filtersContent}
    >
      <Grid item sm={6} md={4} lg={2}>
        <DatePickerComponent
          label="From"
          value={values.from}
          onDateChange={date => setValues({ ...values, from: date })}
        />
      </Grid>
      <Grid item sm={6} md={4} lg={2}>
        <DatePickerComponent
          label="To"
          value={values.to}
          onDateChange={date => setValues({ ...values, to: date })}
        />
      </Grid>
      <Grid item sm={6} md={4} lg={2}>
        <Select
          label="Status"
          items={statusItems}
          selected={!values.buildStatus ? 'all' : values.buildStatus}
          onChange={selection => {
            const buildStatus =
              selection === 'all' ? undefined : (selection as BuildStatus);
            setValues({ ...values, buildStatus });
          }}
        />
      </Grid>
      <Grid item sm={6} md={4} lg={2}>
        {loading ? (
          <Select
            label="Project"
            placeholder="Loading.."
            items={[]}
            onChange={() => undefined}
          />
        ) : (
          <Select
            label="Project"
            items={toSelectItems(['All'].concat(projects ?? []))}
            selected={values.project ? values.project : 'All'}
            onChange={selection =>
              setValues({
                ...values,
                project:
                  selection === 'All' ? undefined : (selection as string),
              })
            }
          />
        )}
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
