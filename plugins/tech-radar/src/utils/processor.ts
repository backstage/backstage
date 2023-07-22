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

import { RadarEntry, TechRadarLoaderResponse } from '../api';
import { Entry } from './types';

export function matchFilter(filter?: string): (entry: RadarEntry) => boolean {
  const terms = filter
    ?.toLocaleLowerCase('en-US')
    .split(/\s/)
    .map(e => e.trim())
    .filter(Boolean);

  if (!terms?.length) {
    return () => true;
  }

  return entry => {
    const text = `${entry.title} ${
      entry.timeline[0]?.description || ''
    }`.toLocaleLowerCase('en-US');
    return terms.every(term => text.includes(term));
  };
}

export const mapToEntries = (
  loaderResponse: TechRadarLoaderResponse,
): Array<Entry> => {
  return loaderResponse.entries.map(entry => ({
    id: entry.key,
    quadrant: loaderResponse.quadrants.find(q => q.id === entry.quadrant)!,
    title: entry.title,
    ring: loaderResponse.rings.find(r => r.id === entry.timeline[0].ringId)!,
    timeline: entry.timeline.map(e => {
      return {
        date: e.date,
        ring: loaderResponse.rings.find(a => a.id === e.ringId)!,
        description: e.description,
        moved: e.moved,
      };
    }),
    moved: entry.timeline[0].moved,
    description: entry.description || entry.timeline[0].description,
    url: entry.url,
    links: entry.links,
  }));
};
