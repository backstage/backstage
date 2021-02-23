/*
 * Copyright 2021 Spotify AB
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

import { Badge } from './types';

export const badges: Badge[] = [
  {
    id: 'pingback',
    kind: 'entity',
    description: 'Link to _{entity.metadata.name} in _{app.title}',
    label: '_{entity.kind}',
    message: '_{entity.metadata.name}',
    style: 'flat-square',
  },
  {
    id: 'lifecycle',
    kind: 'entity',
    description: 'Entity lifecycle badge',
    label: 'lifecycle',
    message: '_{entity.spec.lifecycle}',
    style: 'flat-square',
  },
  {
    id: 'owner',
    kind: 'entity',
    description: 'Entity owner badge',
    label: 'owner',
    message: '_{entity.spec.owner}',
    style: 'flat-square',
  },
  {
    id: 'docs',
    kind: 'entity',
    link: '_{entity_url}/docs',
    label: 'docs',
    message: '_{entity.metadata.name}',
    style: 'flat-square',
  },
];
