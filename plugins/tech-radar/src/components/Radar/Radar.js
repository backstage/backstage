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
import { forceCollide, forceSimulation } from 'd3-force';
import RadarPlot from '../RadarPlot';
import Segment from '../../utils/segment';
import Color from 'color';

export default class Radar extends React.Component {
  static adjustQuadrants(quadrants, radius, width, height) {
    /*
    0           1                             2           3 ← x stops index
    │           │                             │           │ ↓ y stops index
    ┼───────────┼─────────────────────────────┼───────────┼─0
    │           │        . -- ~~~ -- .        │           │
    │           │    .-~               ~-.    │           │
    │    <Q3>   │   /                     \   │   <Q2>    │
    │           │  /                       \  │           │
    ┼───────────┼─────────────────────────────┼───────────┼─1
    ┼───────────┼─────────────────────────────┼───────────┼─2
    │           │ |                         | │           │
    │           │  \                       /  │           │
    │    <Q1>   │   \                     /   │   <Q0>    │
    │           │    `-.               .-'    │           │
    │           │        ~- . ___ . -~        │           │
    ┼───────────┼─────────────────────────────┼───────────┼─3
     */
    const margin = 16;
    const xStops = [
      margin,
      width / 2 - radius - margin,
      width / 2 + radius + margin,
      width - margin,
    ];
    const yStops = [margin, height / 2 - margin, height / 2, height - margin];

    // The quadrant parameters correspond to Q[0..3] above.  They are in this order because of the
    // original Zalando code; maybe we should refactor them to be in reverse order?
    const legendParams = [
      {
        x: xStops[2],
        y: yStops[2],
        width: xStops[3] - xStops[2],
        height: yStops[3] - yStops[2],
      },
      {
        x: xStops[0],
        y: yStops[2],
        width: xStops[1] - xStops[0],
        height: yStops[3] - yStops[2],
      },
      {
        x: xStops[0],
        y: yStops[0],
        width: xStops[1] - xStops[0],
        height: yStops[1] - yStops[0],
      },
      {
        x: xStops[2],
        y: yStops[0],
        width: xStops[3] - xStops[2],
        height: yStops[1] - yStops[0],
      },
    ];

    quadrants.forEach((quadrant, idx) => {
      const legendParam = legendParams[idx % 4];

      quadrant.idx = idx;
      quadrant.radialMin = (idx * Math.PI) / 2;
      quadrant.radialMax = ((idx + 1) * Math.PI) / 2;
      quadrant.offsetX = idx % 4 === 0 || idx % 4 === 3 ? 1 : -1;
      quadrant.offsetY = idx % 4 === 0 || idx % 4 === 1 ? 1 : -1;
      quadrant.legendX = legendParam.x;
      quadrant.legendY = legendParam.y;
      quadrant.legendWidth = legendParam.width;
      quadrant.legendHeight = legendParam.height;
    });
  }

  static adjustRings(rings, radius) {
    rings.forEach((ring, idx) => {
      ring.idx = idx;
      ring.outerRadius = ((idx + 2) / (rings.length + 1)) * radius;
      ring.innerRadius =
        ((idx === 0 ? 0 : idx + 1) / (rings.length + 1)) * radius;
    });
  }

  static adjustEntries(entries, activeEntry, quadrants, rings, radius, colors) {
    let seed = 42;
    entries.forEach((entry, idx) => {
      const quadrant = quadrants.find(q => {
        const match =
          typeof entry.quadrant === 'object'
            ? entry.quadrant.id
            : entry.quadrant;
        return q.id === match;
      });
      const ring = rings.find(r => {
        const match =
          typeof entry.ring === 'object' ? entry.ring.id : entry.ring;
        return r.id === match;
      });

      if (!quadrant) {
        throw new Error(
          `Unknown quadrant ${entry.quadrant} for entry ${entry.id}!`,
        );
      }
      if (!ring) {
        throw new Error(`Unknown ring ${entry.ring} for entry ${entry.id}!`);
      }

      entry.idx = idx;
      entry.quadrant = quadrant;
      entry.ring = ring;
      entry.segment = new Segment(quadrant, ring, radius, () => seed++);
      const point = entry.segment.random();
      entry.x = point.x;
      entry.y = point.y;
      entry.active = activeEntry ? entry.id === activeEntry.id : false;
      entry.color = entry.active
        ? entry.ring.color
        : Color(entry.ring.color)
            .desaturate(0.5)
            .lighten(0.1)
            .string();
    });

    const simulation = forceSimulation()
      .nodes(entries)
      .velocityDecay(0.19)
      .force(
        'collision',
        forceCollide()
          .radius(12)
          .strength(0.85),
      )
      .stop();

    for (
      let i = 0,
        n = Math.ceil(
          Math.log(simulation.alphaMin()) /
            Math.log(1 - simulation.alphaDecay()),
        );
      i < n;
      ++i
    ) {
      simulation.tick();

      for (const entry of entries) {
        entry.x = entry.segment.clipx(entry);
        entry.y = entry.segment.clipy(entry);
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = { activeEntry: null };
  }

  _setActiveEntry(entry) {
    this.setState({ activeEntry: entry });
  }

  _clearActiveEntry() {
    this.setState({ activeEntry: null });
  }

  render() {
    // TODO(dflemstr): most of this method can be heavily memoized if performance becomes a problem

    const { width, height, quadrants, rings, entries } = this.props;
    const { activeEntry } = this.state;
    const radius = Math.min(width, height) / 2;

    Radar.adjustQuadrants(quadrants, radius, width, height);
    Radar.adjustRings(rings, radius);
    Radar.adjustEntries(entries, activeEntry, quadrants, rings, radius);

    return (
      <svg
        ref={node => {
          this.node = node;
        }}
        width={width}
        height={height}
        {...this.props.svgProps}
      >
        <RadarPlot
          width={width}
          height={height}
          radius={radius}
          entries={entries}
          quadrants={quadrants}
          rings={rings}
          activeEntry={activeEntry}
          onEntryMouseEnter={entry => this._setActiveEntry(entry)}
          onEntryMouseLeave={entry => this._clearActiveEntry()}
        />
      </svg>
    );
  }
}

Radar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  quadrants: PropTypes.arrayOf(PropTypes.object).isRequired,
  rings: PropTypes.arrayOf(PropTypes.object).isRequired,
  entries: PropTypes.arrayOf(PropTypes.object).isRequired,
};
