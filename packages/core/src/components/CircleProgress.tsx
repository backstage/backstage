/*
 * Copyright 2020 Spotify AB
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

import { makeStyles } from '@material-ui/core';
import { Circle } from 'rc-progress';
import React, { FC } from 'react';
import { COLORS } from '../theme/BackstageTheme';
import { BackstageTheme } from '../theme/theme';

const useStyles = makeStyles((theme: BackstageTheme) => ({
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
    color: theme.palette.textSubtle,
  },
  circle: {
    width: '80%',
    transform: 'translate(10%, 0)',
  },
  colorUnknown: {},
}));

type Props = {
  value: number;
  fractional?: boolean;
  inverse?: boolean;
  unit?: string;
  max?: number;
};

const defaultProps = {
  fractional: true,
  inverse: false,
  unit: '%',
  max: 100,
};

export function getProgressColor(value, inverse, max) {
  if (isNaN(value)) {
    return '#ddd';
  }

  const actualMax = max ? max : defaultProps.max;
  const actualValue = inverse ? actualMax - value : value;

  if (actualValue < actualMax / 3) {
    return COLORS.STATUS.ERROR;
  } else if (actualValue < actualMax * (2 / 3)) {
    return COLORS.STATUS.WARNING;
  }

  return COLORS.STATUS.OK;
}

const CircleProgress: FC<Props> = props => {
  const classes = useStyles(props);
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
        strokeColor={getProgressColor(asActual, inverse, max)}
        className={classes.circle}
      />
      <div className={classes.overlay}>
        {isNaN(value) ? 'N/A' : `${asActual}${unit}`}
      </div>
    </div>
  );
};

export default CircleProgress;
