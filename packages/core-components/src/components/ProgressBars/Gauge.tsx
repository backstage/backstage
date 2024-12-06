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

import { BackstagePalette } from '@backstage/theme';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Circle } from 'rc-progress';
import { ReactNode, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import classNames from 'classnames';

/** @public */
export type GaugeClassKey =
  | 'root'
  | 'overlay'
  | 'description'
  | 'circle'
  | 'colorUnknown';

const useStyles = makeStyles(
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
      fontSize: theme.typography.pxToRem(45),
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.textContrast,
    },
    overlaySmall: {
      fontSize: theme.typography.pxToRem(25),
    },
    description: {
      fontSize: '100%',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      position: 'absolute',
      wordBreak: 'break-all',
      display: 'inline-block',
    },
    circle: {
      width: '80%',
      transform: 'translate(10%, 0)',
    },
    colorUnknown: {},
  }),
  { name: 'BackstageGauge' },
);

/** @public */
export type GaugeProps = {
  value: number;
  fractional?: boolean;
  inverse?: boolean;
  unit?: string;
  max?: number;
  size?: 'normal' | 'small';
  description?: ReactNode;
  getColor?: GaugePropsGetColor;
  relativeToMax?: boolean;
  decimalDigits?: number;
};

/** @public */
export type GaugePropsGetColorOptions = {
  palette: BackstagePalette;
  value: number;
  inverse?: boolean;
  max?: number;
};

/** @public */
export type GaugePropsGetColor = (args: GaugePropsGetColorOptions) => string;

const defaultGaugeProps = {
  fractional: true,
  inverse: false,
  unit: '%',
  max: 100,
  relativeToMax: false,
};

export const getProgressColor: GaugePropsGetColor = ({
  palette,
  value,
  inverse,
  max,
}) => {
  if (isNaN(value)) {
    return '#ddd';
  }

  const actualMax = max ? max : defaultGaugeProps.max;
  const actualValue = inverse ? actualMax - value : value;

  if (actualValue < actualMax / 3) {
    return palette.status.error;
  } else if (actualValue < actualMax * (2 / 3)) {
    return palette.status.warning;
  }

  return palette.status.ok;
};

/**
 * Circular Progress Bar
 *
 * @public
 *
 */

export function Gauge(props: GaugeProps) {
  const [hoverRef, setHoverRef] = useState<HTMLDivElement | null>(null);
  const { getColor = getProgressColor, size = 'normal' } = props;
  const classes = useStyles(props);
  const { palette } = useTheme();
  const {
    value,
    fractional,
    inverse,
    unit,
    max,
    description,
    relativeToMax,
    decimalDigits,
  } = {
    ...defaultGaugeProps,
    ...props,
  };

  let asPercentage: number;
  if (relativeToMax) {
    asPercentage = (value / max) * 100;
  } else {
    asPercentage = fractional ? Math.round(value * max) : value;
  }
  let asActual: number;
  if (relativeToMax) {
    asActual = value;
  } else {
    asActual = max !== 100 ? Math.round(value) : asPercentage;
  }
  const asDisplay =
    decimalDigits === undefined
      ? asActual.toString()
      : asActual.toFixed(decimalDigits);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const node = hoverRef;
    const handleMouseOver = () => setIsHovering(true);
    const handleMouseOut = () => setIsHovering(false);
    if (node && description) {
      node.addEventListener('mouseenter', handleMouseOver);
      node.addEventListener('mouseleave', handleMouseOut);

      return () => {
        node.removeEventListener('mouseenter', handleMouseOver);
        node.removeEventListener('mouseleave', handleMouseOut);
      };
    }
    return () => {
      setIsHovering(false);
    };
  }, [description, hoverRef]);

  return (
    <Box {...{ ref: setHoverRef }} className={classes.root}>
      <Circle
        strokeLinecap="butt"
        percent={asPercentage}
        strokeWidth={12}
        trailWidth={12}
        strokeColor={getColor({
          palette,
          value: asPercentage,
          inverse,
          max: relativeToMax ? 100 : max,
        })}
        className={classes.circle}
      />
      {description && isHovering ? (
        <Box className={classes.description}>{description}</Box>
      ) : (
        <Box
          className={classNames(classes.overlay, {
            [classes.overlaySmall]: size === 'small',
          })}
        >
          {isNaN(value) ? 'N/A' : `${asDisplay}${unit}`}
        </Box>
      )}
    </Box>
  );
}
