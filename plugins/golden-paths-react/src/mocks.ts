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
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';

export const mockedEntity: GoldenPathEntityV1beta1 = {
  apiVersion: 'backstage.io/v1beta1',
  kind: 'GoldenPath',
  metadata: { name: 'Test Name X', namespace: 'development' },
  spec: {
    type: 'other',
    steps: [
      {
        template: 'template:development/dummy-template',
      },
    ],
  },
};

export const entityNoTags: GoldenPathEntityV1beta1 = {
  apiVersion: 'backstage.io/v1beta1',
  kind: 'GoldenPath',
  metadata: { name: 'Test Name X', namespace: 'development' },
  relations: [
    { type: RELATION_OWNED_BY, targetRef: 'group:development/t00001' },
  ],
  spec: {
    owner: 'group:development/t00001',
    type: 'other',
    steps: [
      {
        template: 'template:development/dummy-template',
        id: 'dummy-template',
        name: 'Dummy Template',
      },
    ],
  },
};

export const entityNoRegions: GoldenPathEntityV1beta1 = {
  apiVersion: 'backstage.io/v1beta1',
  kind: 'GoldenPath',
  metadata: {
    name: 'Test Name 1',
    namespace: 'development',
    tags: ['test-tag1'],
    description: 'This is some test description',
  },
  relations: [
    { type: RELATION_OWNED_BY, targetRef: 'group:development/t00001' },
  ],
  spec: {
    owner: 'group:development/t00001',
    type: 'other',
    parameters: [],
    steps: [
      {
        template: 'template:development/dummy-template',
        id: 'dummy-template',
        name: 'Dummy Template',
      },
    ],
  },
};

export const entityWithRegions: GoldenPathEntityV1beta1 = {
  apiVersion: 'backstage.io/v1beta1',
  kind: 'GoldenPath',
  metadata: {
    name: 'Test Name 1',
    namespace: 'development',
    tags: ['test-tag1', 'test-tag2'],
    availability: ['Poland', 'Netherlands', 'Germany'],
    description: 'This is some test description',
  },
  relations: [
    { type: RELATION_OWNED_BY, targetRef: 'group:development/t00001' },
  ],
  spec: {
    owner: 'group:development/t00001',
    type: 'other',
    parameters: [
      {
        title: 'Random',
        required: ['message'],
        properties: {
          message: {
            title: 'Message',
            type: 'string',
            description: 'Your message to log to the debug log',
          },
        },
      },
    ],
    steps: [
      {
        template: 'template:development/dummy-template',
        id: 'dummy-template-1',
        name: 'First Dummy Template',
      },
      {
        template: 'template:development/dummy-template',
        id: 'dummy-template-2',
        name: 'Second Dummy Template',
      },
    ],
  },
};
