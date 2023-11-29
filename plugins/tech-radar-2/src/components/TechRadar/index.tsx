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
import React, { FC, useMemo, useState } from 'react';

import { Entry, EntryConfig, Quadrant, QuadrantConfig, Ring, RingConfig } from '../../types';

import Segment from './layout/segment';
import RadarDisplay from './RadarDisplay';

const Radar: FC<RadarPropTypes> = ({ quadrantConfig, ringConfig, entryConfig, svgProps }) => {
  const [activeQuadrant, setActiveQuadrant] = useState<Quadrant>();

  const radius = activeQuadrant ? 490 : 325;
  const size = activeQuadrant ? radius + 40 : radius * 2 + 40;

  const quadrants = useMemo(() => adjustQuadrants(quadrantConfig), [quadrantConfig]);

  const rings = useMemo(() => adjustRings(ringConfig, radius), [ringConfig, radius]);
  const entries = useMemo(
    () => adjustEntries(entryConfig, quadrants, rings, radius),
    [entryConfig, quadrants, rings, radius],
  );

  return (
    <RadarDisplay
      entries={entries}
      quadrants={quadrants}
      rings={rings}
      size={size}
      radius={radius}
      svgProps={svgProps}
      activeQuadrant={activeQuadrant}
      onQuadrantSelect={setActiveQuadrant}
    />
  );
};

function adjustQuadrants(quadrants: QuadrantConfig[]): Quadrant[] {
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

  return quadrants.map((quadrant: QuadrantConfig, idx: number) => {
    return {
      ...quadrant,
      idx,
      radialMin: (idx * Math.PI) / 2,
      radialMax: ((idx + 1) * Math.PI) / 2,
      offsetX: idx % 4 === 0 || idx % 4 === 3 ? 1 : -1,
      offsetY: idx % 4 === 0 || idx % 4 === 1 ? 1 : -1,
    };
  });
}

function adjustRings(rings: RingConfig[], radius: number): Ring[] {
  return rings.map((ring, idx) => ({
    ...ring,
    idx,
    outerRadius: ((idx + 2) / (rings.length + 1)) * radius,
    innerRadius: ((idx === 0 ? 0 : idx + 1) / (rings.length + 1)) * radius,
  }));
}

function adjustEntries(entryConfig: EntryConfig[], quadrants: Quadrant[], rings: Ring[], radius: number): Entry[] {
  let seed = 42;
  const segments: Record<string, Segment> = {};

  const entries = entryConfig.map((entry, idx) => {
    const quadrant = quadrants.find(q => {
      return q.id === entry.category;
    });
    const ring = rings.find(r => {
      return r.id === entry.lifecycle;
    });

    if (!quadrant) {
      throw new Error(`Unknown quadrant ${entry.category} for entry ${entry.id}!`);
    }
    if (!ring) {
      throw new Error(`Unknown ring ${entry.lifecycle} for entry ${entry.id}!`);
    }

    segments[entry.id] = new Segment(quadrant, ring, radius, () => seed++);
    const point = segments[entry.id].random();
    return {
      ...entry,
      idx: idx,
      x: point.x,
      y: point.y,
      inactive: false,
      color: ring.color,
      quadrant: quadrant,
      ring: ring,
    };
  });

  return entries;
}

type RadarPropTypes = {
  quadrantConfig: QuadrantConfig[];
  ringConfig: RingConfig[];
  entryConfig: EntryConfig[];
  svgProps: any;
};

export default Radar;
