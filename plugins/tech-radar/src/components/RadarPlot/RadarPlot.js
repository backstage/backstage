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

import RadarGrid from '../RadarGrid';
import RadarEntry from '../RadarEntry';
import RadarBubble from '../RadarBubble';
import RadarFooter from '../RadarFooter';
import RadarLegend from '../RadarLegend';

// A component that draws the radar circle.
export default class RadarPlot extends React.PureComponent {
  render() {
    const {
      width,
      height,
      radius,
      quadrants,
      rings,
      entries,
      activeEntry,
      onEntryMouseEnter,
      onEntryMouseLeave,
    } = this.props;

    return (
      <g>
        <RadarLegend
          quadrants={quadrants}
          rings={rings}
          entries={entries}
          onEntryMouseEnter={
            onEntryMouseEnter && (entry => onEntryMouseEnter(entry))
          }
          onEntryMouseLeave={
            onEntryMouseLeave && (entry => onEntryMouseLeave(entry))
          }
        />
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          <RadarGrid radius={radius} rings={rings} />
          <RadarFooter x={-0.5 * width} y={0.5 * height} />
          {entries.map(entry => (
            <RadarEntry
              key={entry.id}
              x={entry.x}
              y={entry.y}
              color={entry.color}
              title={entry.title}
              number={entry.idx + 1}
              url={entry.url}
              moved={entry.moved}
              active={activeEntry && activeEntry.id === entry.id}
              onMouseEnter={
                onEntryMouseEnter && (() => onEntryMouseEnter(entry))
              }
              onMouseLeave={
                onEntryMouseLeave && (() => onEntryMouseLeave(entry))
              }
            />
          ))}
          <RadarBubble
            visible={!!activeEntry}
            text={activeEntry ? activeEntry.title : ''}
            x={activeEntry ? activeEntry.x : 0}
            y={activeEntry ? activeEntry.y : 0}
          />
        </g>
      </g>
    );
  }
}

RadarPlot.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  rings: PropTypes.arrayOf(PropTypes.shape(CommonPropTypes.RING)).isRequired,
  quadrants: PropTypes.arrayOf(PropTypes.shape(CommonPropTypes.QUADRANT))
    .isRequired,
  entries: PropTypes.arrayOf(PropTypes.shape(CommonPropTypes.ENTRY)).isRequired,
  activeEntry: PropTypes.object,
  onEntryMouseEnter: PropTypes.func,
  onEntryMouseLeave: PropTypes.func,
};
