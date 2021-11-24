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

import { createStyles, makeStyles, useTheme } from '@material-ui/core';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BackstageTheme } from '@backstage/theme';
import { Target } from '../../api';
import { formatSecondsInterval, formatPercentage } from '../../utils';

const EMPTY_HEIGHT = 100;

const useStyles = makeStyles((theme: BackstageTheme) =>
  createStyles({
    toolTip: {
      backgroundColor: theme.palette.background.paper,
      opacity: 0.8,
      padding: 8,
    },
  }),
);

const TargetToolTip = ({ active, payload, label }: any) => {
  const classes = useStyles();

  if (active && payload && payload.length === 2) {
    const buildTime = payload[0].value[1] - payload[0].value[0];
    const compileTime = payload[1].value[1] - payload[1].value[0];
    return (
      <div className={classes.toolTip}>
        {`${label}: ${formatSecondsInterval(payload[0].value)}`}
        <br />
        {buildTime > 0 &&
          `Compile time: ${formatPercentage(compileTime / buildTime)}`}
      </div>
    );
  }

  return null;
};

const getTimelineData = (targets: Target[]) => {
  const min = targets[0].startTimestampMicroseconds;

  return targets
    .filter(target => target.fetchedFromCache === false)
    .map(target => ({
      name: target.name,
      buildTime: [
        target.startTimestampMicroseconds - min,
        target.endTimestampMicroseconds - min,
      ],
      compileTime: [
        target.startTimestampMicroseconds - min,
        target.compilationEndTimestampMicroseconds - min,
      ],
    }));
};

export interface BuildTimelineProps {
  targets: Target[];
  height?: number;
  width?: number;
}

export const BuildTimeline = ({
  targets,
  height,
  width,
}: BuildTimelineProps) => {
  const theme = useTheme();
  if (!targets.length) return <p>No Targets</p>;

  const data = getTimelineData(targets);

  return (
    <ResponsiveContainer
      height={height}
      width={width}
      minHeight={EMPTY_HEIGHT + targets.length * 5}
    >
      <BarChart layout="vertical" data={data} maxBarSize={10} barGap={0}>
        <CartesianGrid strokeDasharray="2 2" />
        <XAxis type="number" domain={[0, 'dataMax']} />
        <YAxis type="category" dataKey="name" padding={{ top: 0, bottom: 0 }} />
        <Tooltip content={<TargetToolTip />} />
        <Legend />
        <Bar
          dataKey="buildTime"
          fill={theme.palette.grey[400]}
          minPointSize={1}
        />
        <Bar dataKey="compileTime" fill={theme.palette.primary.main} />
      </BarChart>
    </ResponsiveContainer>
  );
};
