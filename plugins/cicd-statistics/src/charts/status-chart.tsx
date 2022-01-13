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

import React, { Fragment, useMemo } from 'react';
import {
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LegendProps,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Alert from '@material-ui/lab/Alert';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { formatISO9075, parseISO } from 'date-fns';
import { countBy } from 'lodash';

import { Build, FilterStatusType, statusTypes } from '../apis/types';
import { labelFormatterWithoutTime, tickFormatterX } from './utils';
import { statusColorMap } from './colors';

export interface StatusChartProps {
  builds: ReadonlyArray<Build>;
}

export function StatusChart(props: StatusChartProps) {
  const { builds } = props;

  const { statuses, values } = useMemo(() => {
    const buildsByDay = new Map<string, Array<Build>>();

    const foundStatuses = new Set<string>();

    builds.forEach(build => {
      foundStatuses.add(build.status);

      const dayString = formatISO9075(build.requestedAt, {
        representation: 'date',
      });
      const dayList = buildsByDay.get(dayString);
      if (dayList) {
        dayList.push(build);
      } else {
        buildsByDay.set(dayString, [build]);
      }
    });

    return {
      statuses: [
        ...statusTypes.filter(status => foundStatuses.has(status)),
        ...[...foundStatuses].filter(
          status => !(statusTypes as Array<string>).includes(status),
        ),
      ],
      values: [...buildsByDay.entries()].map(([dayString, buildThisDay]) => ({
        __epoch: parseISO(dayString).getTime(),
        ...countBy(buildThisDay, 'status'),
      })),
    };
  }, [builds]);

  const legendPayload = useMemo(
    (): LegendProps['payload'] =>
      statuses.map(status => ({
        value: status,
        type: 'line',
        id: status,
        color: statusColorMap[status as FilterStatusType] ?? '',
      })),
    [statuses],
  );

  return (
    <Accordion defaultExpanded={statuses.length > 1}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Build count per status</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {values.length === 0 ? (
          <Alert severity="info">No data</Alert>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={values}>
              <Legend payload={legendPayload} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="__epoch"
                type="category"
                tickFormatter={tickFormatterX}
              />
              <YAxis type="number" tickCount={5} name="Count" />
              <Tooltip labelFormatter={labelFormatterWithoutTime} />
              {statuses.map(status => (
                <Fragment key={status}>
                  <Bar
                    type="monotone"
                    dataKey={status}
                    stackId="1"
                    stroke={statusColorMap[status as FilterStatusType] ?? ''}
                    fillOpacity={0.8}
                    fill={statusColorMap[status as FilterStatusType] ?? ''}
                  />
                </Fragment>
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
