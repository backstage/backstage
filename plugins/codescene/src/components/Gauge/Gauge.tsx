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
import { BackstagePalette, BackstageTheme } from '@backstage/theme';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { Circle } from 'rc-progress';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    root: {
      position: 'relative',
      lineHeight: 0,
    },
    overlay: {
      position: 'absolute',
      top: '50%',
      left: '60%',
      transform: 'translate(-50%, -60%)',
      fontSize: 30,
      fontWeight: 'bold',
      color: theme.palette.textContrast,
    },
    circle: {
      width: '100%',
      transform: 'translate(10%, 0)',
    },
    colorUnknown: {},
  }),
  { name: 'CodeSceneGauge' },
);

export type GaugeProps = {
  value: number;
  max: number;
  tooltipDelay?: number;
  tooltipText: string;
};

export type GaugePropsGetColorOptions = {
  palette: BackstagePalette;
  value: number;
  max: number;
};

export type GaugePropsGetColor = (args: GaugePropsGetColorOptions) => string;

export const getProgressColor: GaugePropsGetColor = ({
  palette,
  value,
  max,
}) => {
  if (isNaN(value)) {
    return '#ddd';
  }

  if (value < max / 3) {
    return palette.status.error;
  } else if (value < max * (2 / 3)) {
    return palette.status.warning;
  }

  return palette.status.ok;
};

/**
 * Circular Progress Bar
 *
 */
export function Gauge(props: GaugeProps) {
  const classes = useStyles(props);
  const { palette } = useTheme<BackstageTheme>();
  const [hoverRef, setHoverRef] = useState<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const { value, max, tooltipDelay, tooltipText } = {
    ...props,
  };

  useEffect(() => {
    const node = hoverRef;
    const handleMouseOver = () => setOpen(true);
    const handleMouseOut = () => setOpen(false);
    if (node && tooltipText) {
      node.addEventListener('mouseenter', handleMouseOver);
      node.addEventListener('mouseleave', handleMouseOut);

      return () => {
        node.removeEventListener('mouseenter', handleMouseOver);
        node.removeEventListener('mouseleave', handleMouseOut);
      };
    }
    return () => {
      setOpen(false);
    };
  }, [tooltipText, hoverRef]);

  const asPercentage = (value * 100) / max;
  return (
    <div ref={setHoverRef} className={classes.root}>
      <Tooltip
        id="gauge-tooltip"
        title={tooltipText}
        placement="top"
        leaveDelay={tooltipDelay}
        onClose={() => setOpen(false)}
        open={open}
      >
        <div>
          <Circle
            strokeLinecap="butt"
            percent={asPercentage}
            strokeWidth={12}
            trailWidth={12}
            strokeColor={getProgressColor({ palette, value, max })}
            className={classes.circle}
          />
          <div className={classes.overlay}>
            {isNaN(value) ? 'N/A' : `${Math.round(value * 10) / 10}`}
          </div>
        </div>
      </Tooltip>
    </div>
  );
}
