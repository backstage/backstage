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
import { makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { RadarLegendQuadrant } from './RadarLegendQuadrant';
import { RadarLegendProps } from './types';
import { setupSegments } from './utils';

const useStyles = makeStyles<Theme>(theme => ({
  quadrant: {
    height: '100%',
    width: '100%',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
  },
  quadrantHeading: {
    pointerEvents: 'none',
    userSelect: 'none',
    marginTop: 0,
    marginBottom: theme.spacing(2),
    fontSize: '18px',
  },
  rings: {
    columns: 3,
  },
  ring: {
    breakInside: 'avoid-column',
    pageBreakInside: 'avoid',
    '-webkit-column-break-inside': 'avoid',
    fontSize: '12px',
    marginBottom: theme.spacing(2),
  },
  ringEmpty: {
    color: theme.palette.text.secondary,
  },
  ringHeading: {
    pointerEvents: 'none',
    userSelect: 'none',
    marginTop: 0,
    marginBottom: theme.spacing(1),
    fontSize: '12px',
    fontWeight: 800,
  },
  ringList: {
    listStylePosition: 'inside',
    marginTop: 0,
    paddingLeft: 0,
    fontVariantNumeric: 'proportional-nums',
    '-moz-font-feature-settings': 'pnum',
    '-webkit-font-feature-settings': 'pnum',
    'font-feature-settings': 'pnum',
  },
  entry: {
    pointerEvents: 'visiblePainted',
    userSelect: 'none',
    fontSize: '11px',
  },
  activeEntry: {
    pointerEvents: 'visiblePainted',
    userSelect: 'none',
    fontSize: '11px',
    background: '#6f6f6f',
    color: '#FFF',
  },
  entryLink: {
    pointerEvents: 'visiblePainted',
    cursor: 'pointer',
  },
}));

const RadarLegend = ({
  quadrants,
  rings,
  entries,
  onEntryMouseEnter,
  onEntryMouseLeave,
  ...props
}: RadarLegendProps): JSX.Element => {
  const classes = useStyles(props);

  return (
    <g data-testid="radar-legend">
      {quadrants.map(quadrant => (
        <RadarLegendQuadrant
          key={quadrant.id}
          segments={setupSegments(entries)}
          quadrant={quadrant}
          rings={rings}
          classes={classes}
          onEntryMouseEnter={onEntryMouseEnter}
          onEntryMouseLeave={onEntryMouseLeave}
        />
      ))}
    </g>
  );
};

export default RadarLegend;
