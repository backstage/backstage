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

interface Ring {
  id: string;
  name: string;
  color: string;
}

const rings = new Array<Ring>();
rings.push({ id: 'use', name: 'USE', color: '#93c47d' });
rings.push({ id: 'trial', name: 'TRIAL', color: '#93d2c2' });
rings.push({ id: 'assess', name: 'ASSESS', color: '#fbdb84' });
rings.push({ id: 'hold', name: 'HOLD', color: '#efafa9' });

interface Quadrant {
  id: string;
  name: string;
}

const quadrants = new Array<Quadrant>();
quadrants.push({ id: 'infrastructure', name: 'Infrastructure' });
quadrants.push({ id: 'frameworks', name: 'Frameworks' });
quadrants.push({ id: 'languages', name: 'Languages' });
quadrants.push({ id: 'process', name: 'Process' });

interface Entry {
  key: string; // react key
  id: string;
  moved: number;
  quadrant: string;
  ring: string;
  title: string;
  url: string;
}

const entries = new Array<Entry>();
const createEntry = (overrides: Partial<Entry>) =>
  ({
    moved: 0,
    ring: 'use',
    url: '#',
    key: overrides.id,
    ...overrides,
  } as Entry);

entries.push(
  createEntry({ id: 'javascript', title: 'JavaScript', quadrant: 'languages' }),
);
entries.push(
  createEntry({ id: 'typescript', title: 'TypeScript', quadrant: 'languages' }),
);
entries.push(
  createEntry({ id: 'webpack', title: 'Webpack', quadrant: 'frameworks' }),
);
entries.push(
  createEntry({ id: 'react', title: 'React', quadrant: 'frameworks' }),
);
entries.push(
  createEntry({
    id: 'code-reviews',
    title: 'Code Reviews',
    quadrant: 'process',
  }),
);
entries.push(
  createEntry({
    id: 'mob-programming',
    title: 'Mob Programming',
    quadrant: 'process',
    ring: 'assess',
  }),
);
entries.push(
  createEntry({
    id: 'github-actions',
    title: 'GitHub Actions',
    quadrant: 'infrastructure',
  }),
);

export default {
  rings,
  quadrants,
  entries,
};
