/*
 * Copyright 2023 The Backstage Authors
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
// code ported from https://github.com/opencost/opencost/blob/develop/ui/src/Reports.js

import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import RefreshIcon from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { find, forEach, get, sortBy, toArray } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import AllocationReport from '../AllocationReport';
import AllocationService from '../../services/allocation';
import Controls from '../Controls';
import Page from '../Page';
import Subtitle from '../Subtitle';
import Warnings from '../Warnings';
import {
  checkCustomWindow,
  cumulativeToTotals,
  rangeToCumulative,
  toVerboseTimeRange,
} from '../../util';
import { currencyCodes } from '../../constants/currencyCodes';
import { useApi, configApiRef } from '@backstage/core-plugin-api';

const windowOptions = [
  { name: 'Today', value: 'today' },
  { name: 'Yesterday', value: 'yesterday' },
  { name: 'Week-to-date', value: 'week' },
  { name: 'Month-to-date', value: 'month' },
  { name: 'Last week', value: 'lastweek' },
  { name: 'Last month', value: 'lastmonth' },
  { name: 'Last 7 days', value: '6d' },
  { name: 'Last 30 days', value: '29d' },
  { name: 'Last 60 days', value: '59d' },
  { name: 'Last 90 days', value: '89d' },
];

const aggregationOptions = [
  { name: 'Cluster', value: 'cluster' },
  { name: 'Node', value: 'node' },
  { name: 'Namespace', value: 'namespace' },
  { name: 'Controller kind', value: 'controllerKind' },
  { name: 'Controller', value: 'controller' },
  { name: 'Service', value: 'service' },
  { name: 'Pod', value: 'pod' },
  { name: 'Container', value: 'container' },
];

const accumulateOptions = [
  { name: 'Entire window', value: true },
  { name: 'Daily', value: false },
];

const useStyles = makeStyles({
  reportHeader: {
    display: 'flex',
    flexFlow: 'row',
    padding: 24,
  },
  titles: {
    flexGrow: 1,
  },
});

// generateTitle generates a string title from a report object
function generateTitle({ window, aggregateBy, accumulate }) {
  let windowName = get(find(windowOptions, { value: window }), 'name', '');
  if (windowName === '') {
    if (checkCustomWindow(window)) {
      windowName = toVerboseTimeRange(window);
    } else {
      /* eslint no-console: ["error", { allow: ["warn"] }] */
      console.warn(`unknown window: ${window}`);
    }
  }

  const aggregationName = get(
    find(aggregationOptions, { value: aggregateBy }),
    'name',
    '',
  ).toLocaleLowerCase('en-US');
  if (aggregationName === '') {
    /* eslint no-console: ["error", { allow: ["warn"] }] */
    console.warn(`unknown aggregation: ${aggregateBy}`);
  }

  let str = `${windowName} by ${aggregationName}`;

  if (!accumulate) {
    str = `${str} daily`;
  }

  return str;
}

export const OpenCostReport = () => {
  const classes = useStyles();
  // Allocation data state
  const [allocationData, setAllocationData] = useState([]);
  const [cumulativeData, setCumulativeData] = useState({});
  const [totalData, setTotalData] = useState({});

  // When allocation data changes, create a cumulative version of it
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const cumulative = rangeToCumulative(allocationData, aggregateBy);
    setCumulativeData(toArray(cumulative));
    setTotalData(cumulativeToTotals(cumulative));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allocationData]);

  // Form state, which controls form elements, but not the report itself. On
  // certain actions, the form state may flow into the report state.
  const [window, setWindow] = useState(windowOptions[0].value);
  const [aggregateBy, setAggregateBy] = useState(aggregationOptions[0].value);
  const [accumulate, setAccumulate] = useState(accumulateOptions[0].value);
  const [currency, setCurrency] = useState('USD');

  // Report state, including current report and saved options
  const [title, setTitle] = useState('Last 7 days by namespace daily');

  // When parameters changes, fetch data. This should be the
  // only mechanism used to fetch data. Also generate a sensible title from the paramters.
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setFetch(true);
    setTitle(generateTitle({ window, aggregateBy, accumulate }));
  }, [window, aggregateBy, accumulate]);

  // page and settings state
  const [init, setInit] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  // Initialize once, then fetch report each time setFetch(true) is called
  useEffect(() => {
    if (!init) {
      initialize();
    }
    if (init && fetch) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init, fetch]);

  // parse any context information from the URL
  const routerLocation = useLocation();
  const searchParams = new URLSearchParams(routerLocation.search);
  const routerNavigate = useNavigate();
  useEffect(() => {
    setWindow(searchParams.get('window') || '6d');
    setAggregateBy(searchParams.get('agg') || 'namespace');
    setAccumulate(searchParams.get('acc') === 'true' || false);
    setCurrency(searchParams.get('currency') || 'USD');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocation]);

  async function initialize() {
    setInit(true);
  }

  const configApi = useApi(configApiRef);
  const baseUrl = configApi.getConfig('opencost').getString('baseUrl');
  /* eslint no-console: 0 */
  console.log(`baseUrl:${baseUrl}`);

  async function fetchData() {
    setLoading(true);
    setErrors([]);

    try {
      const resp = await AllocationService.fetchAllocation(
        baseUrl,
        window,
        aggregateBy,
        { accumulate },
      );
      if (resp.data && resp.data.length > 0) {
        const allocationRange = resp.data;
        for (const i in allocationRange) {
          if (Object.hasOwn(allocationRange, i)) {
            // update cluster aggregations to use clusterName/clusterId names
            allocationRange[i] = sortBy(allocationRange[i], a => a.totalCost);
          }
        }
        setAllocationData(allocationRange);
      } else {
        setAllocationData([]);
      }
    } catch (err) {
      if (err.message.indexOf('404') === 0) {
        setErrors([
          {
            primary: 'Failed to load report data',
            secondary:
              'Please update OpenCost to the latest version, then open an Issue on GitHub if problems persist.',
          },
        ]);
      } else {
        let secondary =
          'Please open an OpenCost issue with a bug report if problems persist.';
        if (err.message.length > 0) {
          secondary = err.message;
        }
        setErrors([
          {
            primary: 'Failed to load report data',
            secondary: secondary,
          },
        ]);
      }
      setAllocationData([]);
    }

    setLoading(false);
    setFetch(false);
  }
  return (
    <Page active="reports.html">
      {!loading && errors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <Warnings warnings={errors} />
        </div>
      )}
      {init && (
        <Paper id="report">
          <div className={classes.reportHeader}>
            <div className={classes.titles}>
              <Typography variant="h5">{title}</Typography>
              <Subtitle report={{ window, aggregateBy, accumulate }} />
            </div>

            <IconButton aria-label="refresh" onClick={() => setFetch(true)}>
              <RefreshIcon />
            </IconButton>

            <Controls
              windowOptions={windowOptions}
              window={window}
              setWindow={win => {
                searchParams.set('window', win);
                routerNavigate({
                  search: `?${searchParams.toString()}`,
                });
              }}
              aggregationOptions={aggregationOptions}
              aggregateBy={aggregateBy}
              setAggregateBy={agg => {
                searchParams.set('agg', agg);
                routerNavigate({
                  search: `?${searchParams.toString()}`,
                });
              }}
              accumulateOptions={accumulateOptions}
              accumulate={accumulate}
              setAccumulate={acc => {
                searchParams.set('acc', acc);
                routerNavigate({
                  search: `?${searchParams.toString()}`,
                });
              }}
              title={title}
              cumulativeData={cumulativeData}
              currency={currency}
              currencyOptions={currencyCodes}
              setCurrency={curr => {
                searchParams.set('currency', curr);
                routerNavigate({
                  search: `?${searchParams.toString()}`,
                });
              }}
            />
          </div>

          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ paddingTop: 100, paddingBottom: 100 }}>
                <CircularProgress />
              </div>
            </div>
          )}
          {!loading && (
            <AllocationReport
              allocationData={allocationData}
              cumulativeData={cumulativeData}
              totalData={totalData}
              currency={currency}
            />
          )}
        </Paper>
      )}
    </Page>
  );
};
