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
import { forceSimulation, forceCollide } from 'd3';

import { CartCoord, Entry, ENTRY_RADIUS } from '../../../types';

import { clipToRingAndQuadrant } from './segment';

function compareGoldenTech(a: Entry, b: Entry): number {
  return (+b.goldenTech || 0) - (+a.goldenTech || 0);
}

function compareActive(a: Entry, b: Entry): number {
  return (+a.inactive || 0) - (+b.inactive || 0);
}

function compareLastModified(a: Entry, b: Entry): number {
  return (b.lastModified || 0) - (a.lastModified || 0);
}

export function getVisibleEntries(entries: Entry[], maxBlipsPerSegment: number): Entry[] {
  // set `visible` to false to hide the blip if there are too many entires in a segment
  // note that we want to keep the ordering of the blips, so we do this with mutation
  const blipCounter = new Map<string, number>();
  return [...entries]
    .sort((a, b) => {
      const active = compareActive(a, b);
      if (active !== 0) {
        return active;
      }

      const goldenTech = compareGoldenTech(a, b);
      if (goldenTech !== 0) {
        return goldenTech;
      }

      return compareLastModified(a, b);
    })
    .filter(entry => {
      const key = `${entry.quadrant.name}:${entry.ring.name}`;
      const segmentIdx = (blipCounter.get(key) || 0) + 1;
      blipCounter.set(key, segmentIdx);

      return segmentIdx <= maxBlipsPerSegment;
    });
}

export function adjustEntrySpacing(entries: Entry[], config: { giveSpaceForLabels: boolean }): Entry[] {
  const simulatedEntries = entries.map(e => ({ ...e }));
  const simulation = forceSimulation()
    .nodes(simulatedEntries)
    .force(
      'collision',
      forceCollide()
        .radius(ENTRY_RADIUS * 1.5)
        .strength(0.85),
    )
    .stop();

  for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
    simulation.tick();

    for (const entry of simulatedEntries) {
      const entryCoord = clipToRingAndQuadrant(entry, entry.quadrant, entry.ring);
      const { x, y } = config.giveSpaceForLabels ? giveSpaceForRadarText(entryCoord) : entryCoord;
      entry.x = x;
      entry.y = y;
    }
  }
  return simulatedEntries;
}

const TEXT_AREA_WIDTH = 80;
const TEXT_AREA_BOTTOM = -80;

function giveSpaceForRadarText(coord: CartCoord): CartCoord {
  const { x, y } = coord;
  const absX = Math.abs(x);
  const halfTextAreaWidth = TEXT_AREA_WIDTH / 2;
  if (y > TEXT_AREA_BOTTOM || absX > halfTextAreaWidth) {
    return coord;
  }

  return {
    x: (halfTextAreaWidth * x) / absX,
    y,
  };
}
