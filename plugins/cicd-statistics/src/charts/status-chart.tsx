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
  Area,
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
import { capitalize } from 'lodash';

import { useZoom, useZoomArea } from './zoom';
import { FilterStatusType, TriggerReason } from '../apis/types';
import { labelFormatterWithoutTime, tickFormatterX } from '../components/utils';
import { statusColorMap, triggerColorMap } from './colors';
import { ChartableStagesAnalysis } from './types';

export interface StatusChartProps {
  analysis: ChartableStagesAnalysis;
}

export function StatusChart(props: StatusChartProps) {
  const { analysis } = props;

  const { zoomFilterValues } = useZoom();
  const { zoomProps, getZoomArea } = useZoomArea();

  const values = useMemo(() => {
    return analysis.daily.values.map(value => {
      const totTriggers = analysis.daily.triggerReasons.reduce(
        (prev, cur) => prev + (value[cur as TriggerReason] ?? 0),
        0,
      );

      if (!totTriggers) {
        return value;
      }

      return {
        ...value,
        ...Object.fromEntries(
          analysis.daily.triggerReasons.map(reason => [
            reason,
            (value[reason as TriggerReason] ?? 0) / totTriggers,
          ]),
        ),
      };
    });
  }, [analysis.daily]);

  const triggerReasonLegendPayload = useMemo(
    (): NonNullable<LegendProps['payload']> =>
      analysis.daily.triggerReasons.map(reason => ({
        value: humanTriggerReason(reason),
        type: 'line',
        id: reason,
        color: triggerColorMap[reason as TriggerReason] ?? '',
      })),
    [analysis.daily.triggerReasons],
  );

  const statusesLegendPayload = useMemo(
    (): NonNullable<LegendProps['payload']> =>
      analysis.daily.statuses.map(status => ({
        value: capitalize(status),
        type: 'line',
        id: status,
        color: statusColorMap[status as FilterStatusType] ?? '',
      })),
    [analysis.daily.statuses],
  );

  const legendPayload = useMemo(
    (): NonNullable<LegendProps['payload']> => [
      ...triggerReasonLegendPayload,
      ...statusesLegendPayload,
    ],
    [statusesLegendPayload, triggerReasonLegendPayload],
  );

  const tooltipFormatter = useMemo(() => {
    const reasonSet = new Set(analysis.daily.triggerReasons);

    return (percentOrCount: number, name: string) => {
      const label = reasonSet.has(name)
        ? humanTriggerReason(name)
        : capitalize(name);
      const valueText = reasonSet.has(name)
        ? `${(percentOrCount * 100).toFixed(0)}%`
        : percentOrCount;

      return [
        <Typography component="span">
          {label}: {valueText}
        </Typography>,
        null,
      ];
    };
  }, [analysis.daily.triggerReasons]);

  const zoomFilteredValues = useMemo(
    () => zoomFilterValues(values),
    [values, zoomFilterValues],
  );

  const barSize = getBarSize(analysis.daily.values.length);

  return (
    <Accordion defaultExpanded={analysis.daily.statuses.length > 1}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          Build count per status over build trigger reason
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {values.length === 0 ? (
          <Alert severity="info">No data</Alert>
        ) : (
          <ResponsiveContainer width="100%" height={140}>
            <ComposedChart data={zoomFilteredValues} {...zoomProps}>
              <Legend payload={legendPayload} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="__epoch"
                type="category"
                tickFormatter={tickFormatterX}
              />
              <YAxis yAxisId={1} type="number" tickCount={5} name="Count" />
              <YAxis yAxisId={2} type="number" name="Triggers" hide />
              <Tooltip
                labelFormatter={labelFormatterWithoutTime}
                formatter={tooltipFormatter}
              />
              {triggerReasonLegendPayload.map(reason => (
                <Fragment key={reason.id}>
                  <Area
                    isAnimationActive={false}
                    type="monotone"
                    dataKey={reason.id!}
                    stackId="triggers"
                    yAxisId={2}
                    stroke={triggerColorMap[reason.id as TriggerReason] ?? ''}
                    fillOpacity={0.5}
                    fill={triggerColorMap[reason.id as TriggerReason] ?? ''}
                  />
                </Fragment>
              ))}
              {[...analysis.daily.statuses].reverse().map(status => (
                <Fragment key={status}>
                  <Bar
                    isAnimationActive={false}
                    type="monotone"
                    barSize={barSize}
                    dataKey={status}
                    stackId="statuses"
                    yAxisId={1}
                    stroke={statusColorMap[status as FilterStatusType] ?? ''}
                    fillOpacity={0.8}
                    fill={statusColorMap[status as FilterStatusType] ?? ''}
                  />
                </Fragment>
              ))}
              {getZoomArea({ yAxisId: 1 })}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </AccordionDetails>
    </Accordion>
  );
}

function humanTriggerReason(reason: string): string {
  if ((reason as TriggerReason) === 'manual') {
    return 'Triggered manually';
  } else if ((reason as TriggerReason) === 'scm') {
    return 'Triggered by SCM';
  } else if ((reason as TriggerReason) === 'internal') {
    return 'Triggered internally';
  } else if ((reason as TriggerReason) === 'other') {
    return 'Triggered by another reason';
  }
  return `Triggered by ${reason}`;
}

function getBarSize(count: number): number {
  if (count < 20) {
    return 10;
  } else if (count < 40) {
    return 8;
  }
  return 5;
}
