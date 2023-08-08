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
import React from 'react';
import { isArray, filter, map, reduce, reverse, sortBy } from 'lodash';

import Typography from '@material-ui/core/Typography';

import RangeChart from './RangeChart';
import SummaryChart from './SummaryChart';

// TODO niko/etl
/* eslint @typescript-eslint/no-shadow: ["error", { "allow": ["agg"] }]*/
function agg(allocationSet, name) {
  if (allocationSet.length === 0) {
    return null;
  }

  return reduce(
    allocationSet,
    (agg, cur) => ({
      name: agg.name,
      aggregatedBy: cur.aggregatedBy,
      properties: agg.properties,
      start: cur.start,
      end: cur.end,
      cpuCost: agg.cpuCost + cur.cpuCost,
      gpuCost: agg.gpuCost + cur.gpuCost,
      ramCost: agg.ramCost + cur.ramCost,
      pvCost: agg.pvCost + cur.pvCost,
      totalCost: agg.totalCost + cur.totalCost,
      count: agg.count + 1,
    }),
    {
      name: name,
      properties: null,
      cpuCost: 0.0,
      gpuCost: 0.0,
      ramCost: 0.0,
      pvCost: 0.0,
      totalCost: 0.0,
      count: 0,
    },
  );
}

function isIdle(allocation) {
  return allocation.name.indexOf('__idle__') >= 0;
}

function top(n, by) {
  return allocations => {
    if (isArray(allocations[0])) {
      return map(allocations, top(n, by));
    }

    const sorted = reverse(sortBy(allocations, by));
    const active = filter(sorted, a => !isIdle(a));
    const idle = filter(sorted, a => isIdle(a));
    const topn = active.slice(0, n);
    const other = [];
    if (active.length > n) {
      other.push(agg(active.slice(n), 'other'));
    }

    return {
      top: topn,
      other: other,
      idle: idle,
    };
  };
}

const AllocationChart = ({ allocationRange, currency, n, height }) => {
  if (allocationRange.length === 0) {
    return <Typography variant="body2">No data</Typography>;
  }

  if (allocationRange.length === 1) {
    const datum = top(n, alloc => alloc.totalCost)(allocationRange[0]);
    return (
      <SummaryChart
        top={datum.top}
        other={datum.other}
        idle={datum.idle}
        currency={currency}
        height={height}
      />
    );
  }

  const data = top(n, alloc => alloc.totalCost)(allocationRange);
  return <RangeChart data={data} currency={currency} height={height} />;
};

export default React.memo(AllocationChart);
