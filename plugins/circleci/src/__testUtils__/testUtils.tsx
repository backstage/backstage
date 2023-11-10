/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { TestApiProvider } from '@backstage/test-utils';

const DEFAULT_ENTITY = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'test',
    annotations: {
      'circleci.com/project-slug': 'github/my-org/dummy',
    },
  },
};

export const makeWrapper =
  ({ entity = DEFAULT_ENTITY, apis }: { entity?: Entity; apis: any[] }) =>
  ({ children }: { children: React.ReactElement }) =>
    (
      <TestApiProvider apis={apis}>
        <EntityProvider entity={entity}>{children}</EntityProvider>
      </TestApiProvider>
    );
