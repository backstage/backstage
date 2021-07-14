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

import { Entity, TemplateEntityV1beta2 } from '@backstage/catalog-model';
import { EntityTextFilter } from './filters';

const entities: Entity[] = [
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'react-app',
      tags: ['react', 'experimental'],
    },
  },
  {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'gRPC service',
      tags: ['gRPC', 'java'],
    },
  },
];

const templates: TemplateEntityV1beta2[] = [
  {
    apiVersion: 'backstage.io/v1beta2',
    kind: 'Template',
    metadata: {
      name: 'react-app',
      title: 'Create React App Template',
      tags: ['react', 'experimental'],
    },
    spec: {
      type: '',
      steps: [],
    },
  },
  {
    apiVersion: 'backstage.io/v1beta2',
    kind: 'Template',
    metadata: {
      name: 'gRPC service',
      title: 'Spring Boot gRPC Service',
      tags: ['gRPC', 'java'],
    },
    spec: {
      type: '',
      steps: [],
    },
  },
];

describe('EntityTextFilter', () => {
  it('should search name', () => {
    const filter = new EntityTextFilter('app');
    expect(filter.filterEntity(entities[0])).toBeTruthy();
    expect(filter.filterEntity(entities[1])).toBeFalsy();
  });

  it('should search template title', () => {
    const filter = new EntityTextFilter('spring');
    expect(filter.filterEntity(templates[0])).toBeFalsy();
    expect(filter.filterEntity(templates[1])).toBeTruthy();
  });

  it('should search tags', () => {
    const filter = new EntityTextFilter('java');
    expect(filter.filterEntity(entities[0])).toBeFalsy();
    expect(filter.filterEntity(entities[1])).toBeTruthy();
  });

  it('should be case insensitive', () => {
    const filter = new EntityTextFilter('JaVa');
    expect(filter.filterEntity(entities[0])).toBeFalsy();
    expect(filter.filterEntity(entities[1])).toBeTruthy();
  });
});
