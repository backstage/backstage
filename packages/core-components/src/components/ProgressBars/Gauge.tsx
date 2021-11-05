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

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';
import { Circle } from 'rc-progress';
import React from 'react';

/** @public */
export type GaugeClassKey = 'root' | 'overlay' | 'circle' | 'colorUnknown';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    root: {
      position: 'relative',
      lineHeight: 0,
    },
    overlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -60%)',
      fontSize: 45,
      fontWeight: 'bold',
      color: theme.palette.textContrast,
    },
    circle: {
      width: '80%',
      transform: 'translate(10%, 0)',
    },
    colorUnknown: {},
  }),
  { name: 'BackstageGauge' },
);

type Props = {
  value: number;
  fractional?: boolean;
  inverse?: boolean;
  unit?: string;
  max?: number;
  getColor?: GetColor;
};

type GetColorArgs = {
  palette: BackstageTheme['palette'];
  value: number;
  inverse?: boolean;
  max?: number;
};

export type GetColor = (
  args: GetColorArgs,
) => string | BackstageTheme['palette']['error'];

const defaultProps = {
  fractional: true,
  inverse: false,
  unit: '%',
  max: 100,
};

export const getProgressColor: GetColor = ({
  palette,
  value,
  inverse,
  max,
}) => {
  if (isNaN(value)) {
    return '#ddd';
  }

  const actualMax = max ? max : defaultProps.max;
  const actualValue = inverse ? actualMax - value : value;

  if (actualValue < actualMax / 3) {
    return palette.status.error;
  } else if (actualValue < actualMax * (2 / 3)) {
    return palette.status.warning;
  }

  return palette.status.ok;
};

/** @public */
export function Gauge(props: Props) {
  const { getColor = getProgressColor } = props;
  const classes = useStyles(props);
  const { palette } = useTheme<BackstageTheme>();
  const { value, fractional, inverse, unit, max } = {
    ...defaultProps,
    ...props,
  };

  const asPercentage = fractional ? Math.round(value * max) : value;
  const asActual = max !== 100 ? Math.round(value) : asPercentage;

  return (
    <div className={classes.root}>
      <Circle
        strokeLinecap="butt"
        percent={asPercentage}
        strokeWidth={12}
        trailWidth={12}
        strokeColor={getColor({ palette, value: asActual, inverse, max })}
        className={classes.circle}
      />
      <div className={classes.overlay}>
        {isNaN(value) ? 'N/A' : `${asActual}${unit}`}
      </div>
    </div>
  );
}
