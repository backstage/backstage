/*
 * Copyright 2026 The Backstage Authors
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

import type { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

export const template = (
  name: string,
  title: string,
  options: {
    tags?: string[];
    namespace?: string;
    owner?: string;
    type?: string;
  } = {},
): TemplateEntityV1beta3 => ({
  apiVersion: 'scaffolder.backstage.io/v1beta3',
  kind: 'Template',
  metadata: {
    name,
    namespace: options.namespace,
    title,
    description: `Create a production-ready ${title.toLowerCase()}.`,
    tags: options.tags ?? ['featured'],
  },
  spec: {
    owner: options.owner ?? 'group:default/platform-team',
    type: options.type ?? 'service',
    parameters: [],
    steps: [],
  },
});

export const templateFixtures = [
  template('node-service', 'Node.js Service'),
  template('react-app', 'React Application', { type: 'website' }),
  template('data-pipeline', 'Data Pipeline', {
    namespace: 'data',
    owner: 'group:data/data-team',
  }),
  template('scheduled-job', 'Scheduled Job'),
  template('event-consumer', 'Event Consumer'),
  template('documentation', 'Documentation Site', { type: 'documentation' }),
  template('mobile-backend', 'Mobile Backend', { namespace: 'mobile' }),
  template('library', 'Shared Library', { type: 'library' }),
  template('experimental', 'Experimental Service', { tags: ['experimental'] }),
  template('unpromoted', 'Unpromoted Website', {
    tags: ['internal'],
    type: 'website',
  }),
];
