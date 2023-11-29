/*
 * Copyright 2023 The Backstage Authors
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
import React, { FC, Fragment } from 'react';

import { makeStyles, useTheme } from '@material-ui/core';

import { Ring, Quadrant } from '../../types';

import { cartesian } from './layout/segment';

const useStyles = makeStyles({
  ring: {
    fill: 'none',
    stroke: '#bbb',
    'stroke-width': '1px',
  },

  axis: {
    fill: 'none',
    stroke: '#bbb',
    'stroke-width': '1px',
  },

  text: {
    fill: '#b3b3b3',
    'font-size': '18px',
    'font-weight': 'bold',
  },

  quadrant: {
    fill: '#b3b3b3',
    'font-size': '24px',
    'font-weight': 'bold',
    letterSpacing: '2px',
  },
});

const path = (radius: number, quadrant: Quadrant) => {
  const start = cartesian({ r: radius, t: quadrant.radialMax });
  const end = cartesian({ r: radius, t: quadrant.radialMin });
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 0 ${end.x} ${end.y}`;
};

const RingLabel: FC<{ ring: Ring; quadrant: Quadrant }> = ({ ring, quadrant }) => {
  const classes = useStyles();
  const y = quadrant.offsetY * -1 * 20;
  const width = ring.outerRadius - ring.innerRadius || 0;
  const x = ((ring.innerRadius || 0) + width / 2) * quadrant.offsetX;

  return (
    <text x={x} y={y} dominantBaseline="middle" textAnchor="middle" className={classes.text}>
      {ring.name}
    </text>
  );
};

interface QuadrantGridProps {
  radius: number;
  quadrant: Quadrant;
  rings: Ring[];
  ringLabels?: boolean;
}

export const QuadrantGrid: FC<QuadrantGridProps> = ({ radius, quadrant, rings, ringLabels }) => {
  const classes = useStyles();
  return (
    <>
      <line key="x" x1={0} y1={0} x2={0} y2={radius * quadrant.offsetY} className={classes.axis} />
      <line key="y" x1={0} y1={0} x2={radius * quadrant.offsetX} y2={0} className={classes.axis} />
      {rings.map(
        (ring, idx) =>
          ring.outerRadius && (
            <Fragment key={`${ring.name}-${idx}`}>
              <path d={path(ring.outerRadius, quadrant)} className={classes.ring} />
              {ringLabels && <RingLabel ring={ring} quadrant={quadrant} />}
            </Fragment>
          ),
      )}
    </>
  );
};

// A component for the background grid of the radar, with axes, rings etc.  It will render around the origin, i.e.
// assume that (0, 0) is in the middle of the drawing.
const RadarGrid: FC<RadarGridProps> = ({ radius, rings, quadrants }) => {
  const classes = useStyles();
  const theme = useTheme();

  // render quadrant texts that follows the outline of the radar. starts from the right mid point of the radar
  const textRadius = radius + 20;
  const offsets = ['87.5%', '62.5%', '62.5%', '87.5%'];
  const paths = ['#path-ccw', '#path-ccw', '#path-cw', '#path-cw'];

  return (
    <>
      <defs>
        // filter to generate text background used below
        <filter x="0" y="0" width="1" height="1" id="solid">
          <feFlood floodColor={theme.palette.background.paper} result="bg" />
          <feMerge>
            <feMergeNode in="bg" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {quadrants.map(quadrant => (
        <QuadrantGrid key={quadrant.id} quadrant={quadrant} rings={rings} radius={radius} />
      ))}

      {rings.map(
        ({ outerRadius, name }) =>
          outerRadius && (
            <text key={name} y={-outerRadius + 42} textAnchor="middle" className={classes.text} filter="url(#solid)">
              {name}
            </text>
          ),
      )}
      <defs>
        <path
          id="path-cw"
          d={`M-${textRadius},0a${textRadius},${textRadius} 0 1,1 ${
            textRadius * 2
          },0a${textRadius},${textRadius} 0 1,1 -${textRadius * 2},0`}
          transform="rotate(180 0 0)"
        />
        <path
          id="path-ccw"
          d={`M-${textRadius},0a${textRadius},${textRadius} 0 1,0 ${
            textRadius * 2
          },0a${textRadius},${textRadius} 0 1,0 -${textRadius * 2},0`}
          transform="rotate(180 0 0)"
        />
      </defs>

      {quadrants.map(({ name }, idx) => (
        <text key={`${name}-${idx}`} className={classes.quadrant}>
          <textPath xlinkHref={paths[idx]} startOffset={offsets[idx]} textAnchor="middle" alignmentBaseline="middle">
            {name}
          </textPath>
        </text>
      ))}
    </>
  );
};

interface RadarGridProps {
  radius: number;
  quadrants: Quadrant[];
  rings: Ring[];
}

export default RadarGrid;
