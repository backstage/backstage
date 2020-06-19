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
import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { Quadrant, Ring, Entry } from '../../utils/types';
import { WithLink } from '../../utils/components';

type Segments = {
  [k: number]: { [k: number]: Entry[] };
};

export type Props = {
  quadrants: Quadrant[];
  rings: Ring[];
  entries: Entry[];
  onEntryMouseEnter?: (entry: Entry) => void;
  onEntryMouseLeave?: (entry: Entry) => void;
};

const ringStyles = {
  rings: {
    columns: 3,
  },
  ring: {
    breakInside: 'avoid-column',
    pageBreakInside: 'avoid',
    '-webkit-column-break-inside': 'avoid',
    fontSize: '12px',
  },
  ringHeading: {
    pointerEvents: 'none',
    userSelect: 'none',
    marginTop: 0,
    marginBottom: 'calc(12px * 0.375)',
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
};

const quadrantStyles = {
  quadrant: {
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  quadrantHeading: {
    pointerEvents: 'none',
    userSelect: 'none',
    marginTop: 0,
    marginBottom: 'calc(18px * 0.375)',
    fontSize: '18px',
  },
};

const entryStyle = {
  entry: {
    pointerEvents: 'none',
    userSelect: 'none',
    fontSize: '11px',
  },
  entryLink: {
    pointerEvents: 'none',
  },
};

const useStyles = makeStyles<Theme>(() => ({
  ringStyles,
  quadrantStyles,
  entryStyle,
}));

const RadarLegend = (props: Props): JSX.Element => {
  const classes = useStyles(props);

  const getSegment = (
    segmented: Segments,
    quadrant: Quadrant,
    ring: Ring,
    ringOffset = 0,
  ) => {
    const quadrantIndex = quadrant.index;
    const ringIndex = ring.index;
    const segmentedData =
      quadrantIndex === undefined ? {} : segmented[quadrantIndex] || {};
    return ringIndex === undefined
      ? []
      : segmentedData[ringIndex + ringOffset] || [];
  };

  const renderRing = (
    ring: Ring,
    entries: Entry[],
    onEntryMouseEnter?: Props['onEntryMouseEnter'],
    onEntryMouseLeave?: Props['onEntryMouseEnter'],
  ) => {
    return (
      <div key={ring.id} className={classes.ring}>
        <h3 className={classes.ringHeading}>{ring.name}</h3>
        {!entries.length ? (
          <p>(empty)</p>
        ) : (
          <ol className={classes.ringList}>
            {entries.map(entry => (
              <li
                key={entry.id}
                value={(entry.index || 0) + 1}
                onMouseEnter={
                  onEntryMouseEnter && (() => onEntryMouseEnter(entry))
                }
                onMouseLeave={
                  onEntryMouseLeave && (() => onEntryMouseLeave(entry))
                }
              >
                <WithLink url={entry.url} className={classes.entryLink}>
                  <span className={classes.entry}>{entry.title}</span>
                </WithLink>
              </li>
            ))}
          </ol>
        )}
      </div>
    );
  };

  const renderQuadrant = (
    segments: Segments,
    quadrant: Quadrant,
    rings: Ring[],
    onEntryMouseEnter: Props['onEntryMouseEnter'],
    onEntryMouseLeave: Props['onEntryMouseLeave'],
  ) => {
    return (
      <foreignObject
        key={quadrant.id}
        x={quadrant.legendX}
        y={quadrant.legendY}
        width={quadrant.legendWidth}
        height={quadrant.legendHeight}
      >
        <div className={classes.quadrant}>
          <h2 className={classes.quadrantHeading}>{quadrant.name}</h2>
          <div className={classes.rings}>
            {rings.map(ring =>
              renderRing(
                ring,
                getSegment(segments, quadrant, ring),
                onEntryMouseEnter,
                onEntryMouseLeave,
              ),
            )}
          </div>
        </div>
      </foreignObject>
    );
  };

  const setupSegments = (entries: Entry[]) => {
    const segments: Segments = {};

    for (const entry of entries) {
      const quadrantIndex = entry.quadrant.index;
      const ringIndex = entry.ring.index;
      let quadrantData: { [k: number]: Entry[] } = {};
      if (quadrantIndex !== undefined) {
        if (segments[quadrantIndex] === undefined) {
          segments[quadrantIndex] = {};
        }

        quadrantData = segments[quadrantIndex];
      }

      let ringData = [];
      if (ringIndex !== undefined) {
        if (quadrantData[ringIndex] === undefined) {
          quadrantData[ringIndex] = [];
        }

        ringData = quadrantData[ringIndex];
      }

      ringData.push(entry);
    }

    return segments;
  };

  const {
    quadrants,
    rings,
    entries,
    onEntryMouseEnter,
    onEntryMouseLeave,
  } = props;

  const segments: Segments = setupSegments(entries);

  return (
    <g>
      {quadrants.map(quadrant =>
        renderQuadrant(
          segments,
          quadrant,
          rings,
          onEntryMouseEnter,
          onEntryMouseLeave,
        ),
      )}
    </g>
  );
};

export default RadarLegend;
