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
import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { Quadrant, Ring, Entry } from '../../utils/types';

type Segments = {
  [k: number]: { [k: number]: Entry[] };
};

type Props = {
  quadrants: Quadrant[];
  rings: Ring[];
  entries: Entry[];
  onEntryMouseEnter?: (entry: Entry) => void;
  onEntryMouseLeave?: (entry: Entry) => void;
};

const useStyles = makeStyles<Theme>(() => ({
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
  entry: {
    pointerEvents: 'none',
    userSelect: 'none',
    fontSize: '11px',
  },
  entryLink: {
    pointerEvents: 'none',
  },
}));

const RadarLegend: FC<Props> = props => {
  const classes = useStyles(props);

  const _getSegment = (
    segmented: Segments,
    quadrant: Quadrant,
    ring: Ring,
    ringOffset = 0,
  ) => {
    const qidx = quadrant.idx;
    const ridx = ring.idx;
    const segmentedData = qidx === undefined ? {} : segmented[qidx] || {};
    return ridx === undefined ? [] : segmentedData[ridx + ringOffset] || [];
  };

  const _renderRing = (
    ring: Ring,
    entries: Entry[],
    onEntryMouseEnter?: Props['onEntryMouseEnter'],
    onEntryMouseLeave?: Props['onEntryMouseEnter'],
  ) => {
    return (
      <div key={ring.id} className={classes.ring}>
        <h3 className={classes.ringHeading}>{ring.name}</h3>
        {entries.length === 0 ? (
          <p>(empty)</p>
        ) : (
          <ol className={classes.ringList}>
            {entries.map(entry => {
              let node = <span className={classes.entry}>{entry.title}</span>;

              if (entry.url) {
                node = (
                  <a className={classes.entryLink} href={entry.url}>
                    {node}
                  </a>
                );
              }

              return (
                <li
                  key={entry.id}
                  value={(entry.idx || 0) + 1}
                  onMouseEnter={
                    onEntryMouseEnter && (() => onEntryMouseEnter(entry))
                  }
                  onMouseLeave={
                    onEntryMouseLeave && (() => onEntryMouseLeave(entry))
                  }
                >
                  {node}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  };

  const _renderQuadrant = (
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
              _renderRing(
                ring,
                _getSegment(segments, quadrant, ring),
                onEntryMouseEnter,
                onEntryMouseLeave,
              ),
            )}
          </div>
        </div>
      </foreignObject>
    );
  };

  const _setupSegments = (entries: Entry[]) => {
    const segments: Segments = {};

    for (const entry of entries) {
      const qidx = entry.quadrant.idx;
      const ridx = entry.ring.idx;
      let quadrantData: { [k: number]: Entry[] } = {};
      if (qidx !== undefined) {
        if (segments[qidx] === undefined) {
          segments[qidx] = {};
        }

        quadrantData = segments[qidx];
      }

      let ringData = [];
      if (ridx !== undefined) {
        if (quadrantData[ridx] === undefined) {
          quadrantData[ridx] = [];
        }

        ringData = quadrantData[ridx];
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

  const segments: Segments = _setupSegments(entries);

  return (
    <g>
      {quadrants.map(quadrant =>
        _renderQuadrant(
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
