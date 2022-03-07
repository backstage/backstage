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
  Grid,
  Switch,
  Tooltip,
  Typography,
  Theme,
  makeStyles,
} from '@material-ui/core';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import BarChartIcon from '@material-ui/icons/BarChart';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { DateTime } from 'luxon';
import LuxonUtils from '@date-io/luxon';

import {
  ChartType,
  ChartTypes,
  CicdConfiguration,
  CicdDefaults,
  FilterBranchType,
  FilterStatusType,
  statusTypes,
} from '../apis/types';
import { ChartableStagesAnalysis } from '../charts/types';
import { ButtonSwitch, SwitchValue } from './button-switch';
import { Toggle } from './toggle';
import { DurationSlider } from './duration-slider';
import { Label } from './label';

export const useStyles = makeStyles<Theme>(
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
    buttonDescription: {
      textTransform: 'uppercase',
      margin: theme.spacing(1, 0, 0, 1),
    },
  }),
  {
    name: 'CicdStatistics',
  },
);

export type BranchSelection = FilterBranchType | 'all';
export type StatusSelection = FilterStatusType;

export interface ChartFilter {
  fromDate: Date;
  toDate: Date;
  branch: string;
  status: Array<string>;
}

export function getDefaultChartFilter(
  cicdConfiguration: CicdConfiguration,
): ChartFilter {
  const toDate = cicdConfiguration.defaults?.timeTo ?? new Date();
  return {
    fromDate:
      cicdConfiguration.defaults?.timeFrom ??
      DateTime.fromJSDate(toDate).minus({ months: 1 }).toJSDate(),
    toDate,
    branch: cicdConfiguration.defaults?.filterType ?? 'branch',
    status:
      cicdConfiguration.defaults?.filterStatus ??
      cicdConfiguration.availableStatuses.filter(
        status => status === 'succeeded' || status === 'failed',
      ),
  };
}

function isSameChartFilter(a: ChartFilter, b: ChartFilter): boolean {
  return (
    a.branch === b.branch &&
    [...a.status].sort().join(' ') === [...b.status].sort().join(' ') &&
    DateTime.fromJSDate(a.fromDate).hasSame(
      DateTime.fromJSDate(b.fromDate),
      'day',
    ) &&
    DateTime.fromJSDate(a.toDate).hasSame(DateTime.fromJSDate(b.toDate), 'day')
  );
}

export type ViewOptions = Pick<
  CicdDefaults,
  | 'lowercaseNames'
  | 'normalizeTimeRange'
  | 'collapsedLimit'
  | 'hideLimit'
  | 'chartTypes'
>;

export function getDefaultViewOptions(
  cicdConfiguration: CicdConfiguration,
): ViewOptions {
  return {
    lowercaseNames: cicdConfiguration.defaults?.lowercaseNames ?? false,
    normalizeTimeRange: cicdConfiguration.defaults?.normalizeTimeRange ?? true,
    collapsedLimit: 60 * 1000, // 1m
    hideLimit: 20 * 1000, // 20s
    chartTypes: {
      succeeded: ['duration'],
      failed: ['count'],
      enqueued: ['count'],
      scheduled: ['count'],
      running: ['count'],
      aborted: ['count'],
      stalled: ['count'],
      expired: ['count'],
      unknown: ['count'],
    },
  };
}

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

const chartTypeValues: Array<SwitchValue<ChartType>> = [
  { value: 'duration', text: <ShowChartIcon />, tooltip: 'Duration' },
  { value: 'count', text: <BarChartIcon />, tooltip: 'Count per day' },
];

export interface ChartFiltersProps {
  analysis?: ChartableStagesAnalysis;

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
    analysis,
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

  const setHideLimit = useCallback(
    (value: number) => {
      setViewOptions(old => ({ ...old, hideLimit: value }));
    },
    [setViewOptions],
  );

  const setCollapseLimit = useCallback(
    (value: number) => {
      setViewOptions(old => ({ ...old, collapsedLimit: value }));
    },
    [setViewOptions],
  );

  const setChartType = useCallback(
    (statusType: FilterStatusType, chartTypes: ChartTypes) => {
      setViewOptions(old => ({
        ...old,
        chartTypes: { ...old.chartTypes, [statusType]: chartTypes },
      }));
    },
    [setViewOptions],
  );
  const setChartTypeSpecific = useMemo(
    () =>
      Object.fromEntries(
        statusTypes.map(
          status =>
            [
              status,
              (chartTypes: ChartTypes) => setChartType(status, chartTypes),
            ] as const,
        ),
      ),
    [setChartType],
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
    if (!DateTime.fromJSDate(toDate).hasSame(DateTime.now(), 'day')) {
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

  const inrefferedStatuses = analysis?.statuses ?? selectedStatus;

  return (
    <MuiPickersUtilsProvider utils={LuxonUtils}>
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
            onChange={date => setFromDate(date?.toJSDate() ?? new Date())}
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
                label={<Label>To today</Label>}
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
                  onChange={date => setToDate(date?.toJSDate() ?? new Date())}
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
          <ButtonSwitch<string>
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
          <ButtonSwitch<string>
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
              <Label>Lowercase names</Label>
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
              <Label>Normalize time range</Label>
            </Tooltip>
          </Toggle>
          <DurationSlider
            header="Hide under peak"
            value={viewOptions.hideLimit}
            setValue={setHideLimit}
          />
          <DurationSlider
            header="Collapse under peak"
            value={viewOptions.collapsedLimit}
            setValue={setCollapseLimit}
          />
          <Typography
            variant="subtitle2"
            className={`${classes.title} ${classes.title}`}
          >
            Chart styles
          </Typography>
          {inrefferedStatuses.map(status => (
            <Grid key={status} container spacing={0}>
              <Grid item>
                <ButtonSwitch<ChartType>
                  values={chartTypeValues}
                  selection={viewOptions.chartTypes[status as FilterStatusType]}
                  onChange={setChartTypeSpecific[status]}
                  multi
                />
              </Grid>
              <Grid item className={classes.buttonDescription}>
                <div>{status}</div>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>
    </MuiPickersUtilsProvider>
  );
}
