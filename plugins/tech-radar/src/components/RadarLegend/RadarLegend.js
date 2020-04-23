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
import PropTypes from 'prop-types';
import * as CommonPropTypes from '../../utils/prop-types';
import styles from './RadarLegend.css';

export default class RadarLegend extends React.PureComponent {
  static _renderQuadrant(
    segments,
    quadrant,
    rings,
    onEntryMouseEnter,
    onEntryMouseLeave,
  ) {
    return (
      <foreignObject
        key={quadrant.id}
        x={quadrant.legendX}
        y={quadrant.legendY}
        width={quadrant.legendWidth}
        height={quadrant.legendHeight}
      >
        <div className={styles.quadrant}>
          <h2 className={styles.quadrantHeading}>{quadrant.name}</h2>
          <div className={styles.rings}>
            {rings.map(ring =>
              RadarLegend._renderRing(
                ring,
                RadarLegend._getSegment(segments, quadrant, ring),
                onEntryMouseEnter,
                onEntryMouseLeave,
              ),
            )}
          </div>
        </div>
      </foreignObject>
    );
  }

  static _renderRing(ring, entries, onEntryMouseEnter, onEntryMouseLeave) {
    return (
      <div key={ring.id} className={styles.ring}>
        <h3 className={styles.ringHeading}>{ring.name}</h3>
        {entries.length === 0 ? (
          <p>(empty)</p>
        ) : (
          <ol className={styles.ringList}>
            {entries.map(entry => {
              let node = <span className={styles.entry}>{entry.title}</span>;

              if (entry.url) {
                node = (
                  <a className={styles.entryLink} href={entry.url}>
                    {node}
                  </a>
                );
              }

              return (
                <li
                  key={entry.id}
                  value={entry.idx + 1}
                  onMouseEnter={
                    onEntryMouseEnter && (() => onEntryMouseEnter(entry))
                  }
                  onMouseLeave={
                    onEntryMouseEnter && (() => onEntryMouseLeave(entry))
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
  }

  static _getSegment(segmented, quadrant, ring, ringOffset = 0) {
    return (segmented[quadrant.idx] || {})[ring.idx + ringOffset] || [];
  }

  render() {
    const {
      quadrants,
      rings,
      entries,
      onEntryMouseEnter,
      onEntryMouseLeave,
    } = this.props;

    const segments = {};

    for (const entry of entries) {
      const qidx = entry.quadrant.idx;
      const ridx = entry.ring.idx;
      const quadrantData = segments[qidx] || (segments[qidx] = {});
      const ringData = quadrantData[ridx] || (quadrantData[ridx] = []);
      ringData.push(entry);
    }

    return (
      <g>
        {quadrants.map(quadrant =>
          RadarLegend._renderQuadrant(
            segments,
            quadrant,
            rings,
            onEntryMouseEnter,
            onEntryMouseLeave,
          ),
        )}
      </g>
    );
  }
}

RadarLegend.propTypes = {
  quadrants: PropTypes.arrayOf(PropTypes.shape(CommonPropTypes.QUADRANT))
    .isRequired,
  rings: PropTypes.arrayOf(PropTypes.shape(CommonPropTypes.RING)).isRequired,
  entries: PropTypes.arrayOf(PropTypes.shape(CommonPropTypes.ENTRY)).isRequired,
  onEntryMouseEnter: PropTypes.func,
  onEntryMouseLeave: PropTypes.func,
};
