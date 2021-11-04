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

import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
// @ts-ignore
import { Line } from 'rc-progress';
import { BackstageTheme } from '@backstage/theme';
import { defaultGetProgressColor, GetColor } from './Gauge';

type Props = {
  /**
   * Progress value between 0.0 - 1.0.
   */
  value: number;
  getColor?: GetColor;
};

export function LinearGauge(props: Props) {
  const { value, getColor = defaultGetProgressColor } = props;
  const { palette } = useTheme<BackstageTheme>();
  if (isNaN(value)) {
    return null;
  }
  let percent = Math.round(value * 100 * 100) / 100;
  if (percent > 100) {
    percent = 100;
  }
  const strokeColor = getColor({
    palette,
    value: percent,
    inverse: false,
    max: 100,
  });
  return (
    <Tooltip title={`${percent}%`}>
      <span>
        <Line
          percent={percent}
          strokeWidth={4}
          trailWidth={4}
          strokeColor={strokeColor}
        />
      </span>
    </Tooltip>
  );
}
