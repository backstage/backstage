/*
 * Copyright 2020 The Backstage Authors
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

import { Entry, Quadrant, Ring } from '../../utils/types';
import { Segments } from './types';

export const setupSegments = (entries: Entry[]) => {
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

export const getSegment = (
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
