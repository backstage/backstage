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

import React, { CSSProperties, Fragment, useMemo } from 'react';
import {
  Area,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  YAxisProps,
  CartesianGrid,
  Legend,
  LegendProps,
  Line,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Alert from '@material-ui/lab/Alert';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { capitalize } from 'lodash';

import { useZoom, useZoomArea } from './zoom';
import { CicdDefaults, statusTypes } from '../apis/types';
import { ChartableStage } from './types';
import {
  pickElements,
  labelFormatter,
  tickFormatterX,
  tickFormatterY,
  tooltipValueFormatter,
  formatDuration,
} from '../components/utils';
import {
  statusColorMap,
  fireColors,
  colorStroke,
  colorStrokeAvg,
} from './colors';

const fullWidth: CSSProperties = { width: '100%' };
const noUserSelect: CSSProperties = { userSelect: 'none' };

const transitionProps = { unmountOnExit: true };

export interface StageChartProps {
  stage: ChartableStage;

  chartTypes: CicdDefaults['chartTypes'];
  defaultCollapsed?: number;
  defaultHidden?: number;
  zeroYAxis?: boolean;
}

export function StageChart(props: StageChartProps) {
  const { stage, ...chartOptions } = props;
  const {
    chartTypes,
    defaultCollapsed = 0,
    defaultHidden = 0,
    zeroYAxis = false,
  } = chartOptions;

  const { zoomFilterValues } = useZoom();
  const { zoomProps, getZoomArea } = useZoomArea();

  const ticks = useMemo(
    () => pickElements(stage.values, 8).map(val => val.__epoch),
    [stage.values],
  );
  const domainY = useMemo(
    () => [zeroYAxis ? 0 : 'auto', 'auto'] as YAxisProps['domain'],
    [zeroYAxis],
  );
  const statuses = useMemo(
    () => statusTypes.filter(status => stage.statusSet.has(status)),
    [stage.statusSet],
  );
  const legendPayload = useMemo(
    (): LegendProps['payload'] =>
      statuses.map(status => ({
        value: capitalize(status),
        type: 'line',
        id: status,
        color: statusColorMap[status],
      })),
    [statuses],
  );

  const subStages = useMemo(
    () =>
      new Map<string, ChartableStage>(
        [...stage.stages.entries()].filter(
          ([_name, subStage]) => subStage.combinedAnalysis.max > defaultHidden,
        ),
      ),
    [stage.stages, defaultHidden],
  );

  const zoomFilteredValues = useMemo(
    () => zoomFilterValues(stage.values),
    [stage.values, zoomFilterValues],
  );

  return stage.combinedAnalysis.max < defaultHidden ? null : (
    <Accordion
      defaultExpanded={stage.combinedAnalysis.max > defaultCollapsed}
      TransitionProps={transitionProps}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {stage.name} (med {formatDuration(stage.combinedAnalysis.med)}, avg{' '}
          {formatDuration(stage.combinedAnalysis.avg)})
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {stage.values.length === 0 ? (
          <Alert severity="info">No data</Alert>
        ) : (
          <Grid container direction="column">
            <Grid item style={noUserSelect}>
              <ResponsiveContainer width="100%" height={140}>
                <ComposedChart data={zoomFilteredValues} {...zoomProps}>
                  <defs>
                    <linearGradient id="colorDur" x1="0" y1="0" x2="0" y2="1">
                      {fireColors.map(([percent, color]) => (
                        <stop
                          key={percent}
                          offset={percent}
                          stopColor={color}
                          stopOpacity={0.8}
                        />
                      ))}
                    </linearGradient>
                  </defs>
                  {statuses.length > 1 && <Legend payload={legendPayload} />}
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="__epoch"
                    type="category"
                    ticks={ticks}
                    tickFormatter={tickFormatterX}
                  />
                  <YAxis
                    yAxisId={1}
                    tickFormatter={tickFormatterY}
                    type="number"
                    tickCount={5}
                    name="Duration"
                    domain={domainY}
                  />
                  <YAxis
                    yAxisId={2}
                    orientation="right"
                    type="number"
                    tickCount={5}
                    name="Count"
                  />
                  <Tooltip
                    formatter={tooltipValueFormatter}
                    labelFormatter={labelFormatter}
                  />
                  {statuses.reverse().map(status => (
                    <Fragment key={status}>
                      {!chartTypes[status].includes('duration') ? null : (
                        <>
                          <Area
                            isAnimationActive={false}
                            yAxisId={1}
                            type="monotone"
                            dataKey={status}
                            stackId={status}
                            stroke={
                              statuses.length > 1
                                ? statusColorMap[status]
                                : colorStroke
                            }
                            fillOpacity={statuses.length > 1 ? 0.5 : 1}
                            fill={
                              statuses.length > 1
                                ? statusColorMap[status]
                                : 'url(#colorDur)'
                            }
                            connectNulls
                          />
                          <Line
                            isAnimationActive={false}
                            yAxisId={1}
                            type="monotone"
                            dataKey={`${status} avg`}
                            stroke={
                              statuses.length > 1
                                ? statusColorMap[status]
                                : colorStrokeAvg
                            }
                            opacity={0.8}
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                          />
                        </>
                      )}
                      {!chartTypes[status].includes('count') ? null : (
                        <Bar
                          isAnimationActive={false}
                          yAxisId={2}
                          type="monotone"
                          dataKey={`${status} count`}
                          stackId="1"
                          stroke={statusColorMap[status] ?? ''}
                          fillOpacity={0.5}
                          fill={statusColorMap[status] ?? ''}
                        />
                      )}
                    </Fragment>
                  ))}
                  {getZoomArea({ yAxisId: 1 })}
                </ComposedChart>
              </ResponsiveContainer>
            </Grid>
            {subStages.size === 0 ? null : (
              <Grid item>
                <Accordion
                  defaultExpanded={false}
                  TransitionProps={transitionProps}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Sub stages ({subStages.size})</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={fullWidth}>
                      {[...subStages.values()].map(subStage => (
                        <StageChart
                          key={subStage.name}
                          {...chartOptions}
                          stage={subStage}
                        />
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
