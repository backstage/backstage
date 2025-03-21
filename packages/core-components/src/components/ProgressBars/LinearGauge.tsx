/*
 * Copyright 2020 The Backstage Authors
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

import { useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Line } from 'rc-progress';
import React from 'react';

import { GaugePropsGetColor, getProgressColor } from './Gauge';

type Props = {
  /**
   * Progress value between 0.0 - 1.0.
   */
  value: number;
  width?: 'thick' | 'thin';
  getColor?: GaugePropsGetColor;
};

export function LinearGauge(props: Props) {
  const { value, getColor = getProgressColor, width = 'thick' } = props;
  const { palette } = useTheme();
  if (isNaN(value)) {
    return null;
  }
  let percent = Math.round(value * 100 * 100) / 100;
  if (percent > 100) {
    percent = 100;
  }
  const lineWidth = width === 'thick' ? 4 : 1;
  const strokeColor = getColor({
    palette,
    value: percent,
    inverse: false,
    max: 100,
  });
  return (
    <Tooltip title={`${percent}%`}>
      <Typography component="span">
        <Line
          percent={percent}
          strokeWidth={lineWidth}
          trailWidth={lineWidth}
          strokeColor={strokeColor}
        />
      </Typography>
    </Tooltip>
  );
}
