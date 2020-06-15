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

import {
  RadarRing,
  RadarQuadrant,
  RadarEntry,
  TechRadarLoaderResponse,
} from './api';

const rings = new Array<RadarRing>();
rings.push({ id: 'use', name: 'USE', color: '#93c47d' });
rings.push({ id: 'trial', name: 'TRIAL', color: '#93d2c2' });
rings.push({ id: 'assess', name: 'ASSESS', color: '#fbdb84' });
rings.push({ id: 'hold', name: 'HOLD', color: '#efafa9' });

const quadrants = new Array<RadarQuadrant>();
quadrants.push({ id: 'infrastructure', name: 'Infrastructure' });
quadrants.push({ id: 'frameworks', name: 'Frameworks' });
quadrants.push({ id: 'languages', name: 'Languages' });
quadrants.push({ id: 'process', name: 'Process' });

const entries = new Array<RadarEntry>();
entries.push({
  moved: 0,
  ring: { id: 'use', name: 'USE', color: '#93c47d' },
  url: '#',
  key: 'javascript',
  id: 'javascript',
  title: 'JavaScript',
  quadrant: { id: 'languages', name: 'Languages' },
});
entries.push({
  moved: 0,
  ring: { id: 'use', name: 'USE', color: '#93c47d' },
  url: '#',
  key: 'typescript',
  id: 'typescript',
  title: 'TypeScript',
  quadrant: { id: 'languages', name: 'Languages' },
});
entries.push({
  moved: 0,
  ring: { id: 'use', name: 'USE', color: '#93c47d' },
  url: '#',
  key: 'webpack',
  id: 'webpack',
  title: 'Webpack',
  quadrant: { id: 'frameworks', name: 'Frameworks' },
});
entries.push({
  moved: 0,
  ring: { id: 'use', name: 'USE', color: '#93c47d' },
  url: '#',
  key: 'react',
  id: 'react',
  title: 'React',
  quadrant: { id: 'frameworks', name: 'Frameworks' },
});
entries.push({
  moved: 0,
  ring: { id: 'use', name: 'USE', color: '#93c47d' },
  url: '#',
  key: 'code-reviews',
  id: 'code-reviews',
  title: 'Code Reviews',
  quadrant: { id: 'process', name: 'Process' },
});
entries.push({
  moved: 0,
  url: '#',
  key: 'mob-programming',
  id: 'mob-programming',
  title: 'Mob Programming',
  quadrant: { id: 'process', name: 'Process' },
  ring: { id: 'assess', name: 'ASSESS', color: '#fbdb84' },
});
entries.push({
  moved: 0,
  url: '#',
  key: 'docs-like-code',
  id: 'docs-like-code',
  title: 'Docs-like-code',
  quadrant: { id: 'process', name: 'Process' },
  ring: { id: 'use', name: 'USE', color: '#93c47d' },
});
entries.push({
  moved: 0,
  url: '#',
  key: 'force-push',
  id: 'force-push',
  title: 'Force push to master',
  quadrant: { id: 'process', name: 'Process' },
  ring: { id: 'hold', name: 'HOLD', color: '#93c47d' },
});
entries.push({
  moved: 0,
  ring: { id: 'use', name: 'USE', color: '#93c47d' },
  url: '#',
  key: 'github-actions',
  id: 'github-actions',
  title: 'GitHub Actions',
  quadrant: { id: 'infrastructure', name: 'Infrastructure' },
});

export default function getSampleData(): Promise<TechRadarLoaderResponse> {
  return Promise.resolve({
    rings,
    quadrants,
    entries,
  });
}
