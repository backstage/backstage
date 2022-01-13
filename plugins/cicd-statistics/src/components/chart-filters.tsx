/*
 * Copyright 2022 The Backstage Authors
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

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormGroup,
  FormControlLabel,
  Switch,
  Theme,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { subMonths, isSameDay } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import {
  CicdConfiguration,
  FilterBranchType,
  FilterStatusType,
} from '../apis/types';
import { ButtonSwitch, SwitchValue } from './button-switch';
import { Toggle } from './toggle';

const useStyles = makeStyles<Theme>(
  theme => ({
    rootCard: {
      padding: theme.spacing(0, 0, 0, 0),
      margin: theme.spacing(0, 0, 2, 0),
    },
    updateButton: {
      margin: theme.spacing(1, 0, 0, 0),
    },
    header: {
      margin: theme.spacing(0, 0, 0, 0),
      textTransform: 'uppercase',
      fontSize: 12,
      fontWeight: 'bold',
    },
    title: {
      margin: theme.spacing(3, 0, 1, 0),
      textTransform: 'uppercase',
      fontSize: 12,
      fontWeight: 'bold',
      '&:first-child': {
        margin: theme.spacing(1, 0, 1, 0),
      },
    },
  }),
  {
    name: 'CicdStatisticsChartFilters',
  },
);

export type BranchSelection = FilterBranchType<'all'>;
export type StatusSelection = FilterStatusType;

export interface ChartFilter {
  fromDate: Date;
  toDate: Date;
  branch: BranchSelection;
  status: Array<StatusSelection>;
}

export function getDefaultChartFilter(
  cicdConfiguration: CicdConfiguration,
): ChartFilter {
  const toDate = cicdConfiguration.defaults?.timeTo ?? new Date();
  return {
    fromDate: cicdConfiguration.defaults?.timeFrom ?? subMonths(toDate, 1),
    toDate,
    branch: cicdConfiguration.defaults?.filterType ?? 'branch',
    status:
      cicdConfiguration.defaults?.filterStatus ??
      cicdConfiguration.availableStatuses.filter(
        status => status === 'succeeded',
      ),
  };
}

function isSameChartFilter(a: ChartFilter, b: ChartFilter): boolean {
  return (
    a.branch === b.branch &&
    [...a.status].sort().join(' ') === [...b.status].sort().join(' ') &&
    isSameDay(a.fromDate, b.fromDate) &&
    isSameDay(a.toDate, b.toDate)
  );
}

export interface ViewOptions {
  lowercaseNames: boolean;
  normalizeTimeRange: boolean;
}

export function getDefaultViewOptions(
  cicdConfiguration: CicdConfiguration,
): ViewOptions {
  return {
    lowercaseNames: cicdConfiguration.defaults?.lowercaseNames ?? false,
    normalizeTimeRange: cicdConfiguration.defaults?.normalizeTimeRange ?? true,
  };
}

export interface ChartFiltersProps {
  cicdConfiguration: CicdConfiguration;
  initialFetchFilter: ChartFilter;
  currentFetchFilter?: ChartFilter;
  onChangeFetchFilter(filter: ChartFilter): void;
  updateFetchFilter(filter: ChartFilter): void;

  initialViewOptions: ViewOptions;
  onChangeViewOptions(filter: ViewOptions): void;
}

interface InternalRef {
  first: boolean;
}

export function ChartFilters(props: ChartFiltersProps) {
  const {
    cicdConfiguration,
    initialFetchFilter,
    currentFetchFilter,
    onChangeFetchFilter,
    updateFetchFilter,
    initialViewOptions,
    onChangeViewOptions,
  } = props;

  const classes = useStyles();

  const [internalRef] = useState<InternalRef>({ first: true });

  const [useNowAsToDate, setUseNowAsToDate] = useState(true);
  const [toDate, setToDate] = useState(initialFetchFilter.toDate);
  const [fromDate, setFromDate] = useState(initialFetchFilter.fromDate);

  const branchValues: Array<SwitchValue<BranchSelection>> = [
    'master',
    'branch',
    {
      value: 'all',
      tooltip:
        'NOTE; If the build pipelines are very different between master and branch ' +
        'builds, viewing them combined might not result in a very useful chart',
    },
  ];
  const [branch, setBranch] = useState(initialFetchFilter.branch);

  const statusValues: ReadonlyArray<StatusSelection> =
    cicdConfiguration.availableStatuses;
  const [selectedStatus, setSelectedStatus] = useState(
    initialFetchFilter.status,
  );

  const [viewOptions, setViewOptions] = useState(initialViewOptions);

  const setLowercaseNames = useCallback(
    (lowercaseNames: boolean) => {
      setViewOptions(old => ({ ...old, lowercaseNames }));
    },
    [setViewOptions],
  );

  const setNormalizeTimeRange = useCallback(
    (normalizeTimeRange: boolean) => {
      setViewOptions(old => ({ ...old, normalizeTimeRange }));
    },
    [setViewOptions],
  );

  useEffect(() => {
    onChangeViewOptions(viewOptions);
  }, [onChangeViewOptions, viewOptions]);

  useEffect(() => {
    if (internalRef.first) {
      // Skip calling onChangeFetchFilter first time
      internalRef.first = false;
      return;
    }
    onChangeFetchFilter({
      toDate,
      fromDate,
      branch,
      status: selectedStatus,
    });
  }, [
    internalRef,
    toDate,
    fromDate,
    branch,
    selectedStatus,
    onChangeFetchFilter,
  ]);

  const toggleUseNowAsDate = useCallback(() => {
    setUseNowAsToDate(!useNowAsToDate);
    if (!isSameDay(toDate, new Date())) {
      setToDate(new Date());
    }
  }, [useNowAsToDate, toDate]);

  const hasFetchFilterChanges = useMemo(
    () =>
      !currentFetchFilter ||
      !isSameChartFilter(
        {
          toDate,
          fromDate,
          branch,
          status: selectedStatus,
        },
        currentFetchFilter,
      ),
    [toDate, fromDate, branch, selectedStatus, currentFetchFilter],
  );

  const updateFilter = useCallback(() => {
    updateFetchFilter({
      toDate,
      fromDate,
      branch,
      status: selectedStatus,
    });
  }, [toDate, fromDate, branch, selectedStatus, updateFetchFilter]);

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card className={classes.rootCard}>
        <CardHeader
          action={
            <Button
              size="small"
              color="secondary"
              variant="contained"
              onClick={updateFilter}
              disabled={!hasFetchFilterChanges}
            >
              Update
            </Button>
          }
          title={
            <Typography variant="subtitle2" className={classes.header}>
              Fetching options
            </Typography>
          }
        />
        <CardContent>
          <Typography
            variant="subtitle2"
            className={`${classes.title} ${classes.title}`}
          >
            Date range
          </Typography>
          <KeyboardDatePicker
            autoOk
            variant="inline"
            inputVariant="outlined"
            label="From date"
            format="yyyy-MM-dd"
            value={fromDate}
            InputAdornmentProps={{ position: 'start' }}
            onChange={date => setFromDate(date as any as Date)}
          />
          <br />
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={useNowAsToDate}
                    onChange={toggleUseNowAsDate}
                  />
                }
                label="To today"
              />
              {useNowAsToDate ? null : (
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  label="To date"
                  format="yyyy-MM-dd"
                  value={toDate}
                  InputAdornmentProps={{ position: 'start' }}
                  onChange={date => setToDate(date as any as Date)}
                />
              )}
            </FormGroup>
          </FormControl>
          <Typography
            variant="subtitle2"
            className={`${classes.title} ${classes.title}`}
          >
            Branch
          </Typography>
          <ButtonSwitch<BranchSelection>
            values={branchValues}
            selection={branch}
            onChange={setBranch}
          />
          <Typography
            variant="subtitle2"
            className={`${classes.title} ${classes.title}`}
          >
            Status
          </Typography>
          <ButtonSwitch<StatusSelection>
            values={statusValues}
            multi
            vertical
            selection={selectedStatus}
            onChange={setSelectedStatus}
          />
        </CardContent>
      </Card>
      <Card className={classes.rootCard}>
        <CardHeader
          title={
            <Typography variant="subtitle2" className={classes.header}>
              View options
            </Typography>
          }
        />
        <CardContent>
          <Toggle
            checked={viewOptions.lowercaseNames}
            setChecked={setLowercaseNames}
          >
            <Tooltip
              arrow
              title={
                'Lowercasing names can reduce duplications ' +
                'when stage names have changed casing'
              }
            >
              <span>Lowercase names</span>
            </Tooltip>
          </Toggle>
          <Toggle
            checked={viewOptions.normalizeTimeRange}
            setChecked={setNormalizeTimeRange}
          >
            <Tooltip
              arrow
              title={
                'All charts will use the same x-axis. ' +
                'This reduces confusion when stages have been altered over time ' +
                'and only appear in a part of the time range.'
              }
            >
              <span>Normalize time range</span>
            </Tooltip>
          </Toggle>
        </CardContent>
      </Card>
    </MuiPickersUtilsProvider>
  );
}
