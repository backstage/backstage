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
import { NewRelicDashboard } from './NewRelicDashboard';
import { MockStorageApi, TestApiProvider } from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { newRelicDashboardApiRef } from '../../api';
import { NEWRELIC_GUID_ANNOTATION } from '../../constants';
import { storageApiRef } from '@backstage/core-plugin-api';
import { Entity } from '@backstage/catalog-model';

function createImage(
  width: number,
  height: number,
  bgColor: string,
  text: string,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx !== null) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000'; // text color
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '20px sans-serif';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  }
  return canvas;
}

const entity: Entity = {
  apiVersion: '1',
  kind: 'Component',
  metadata: {
    name: 'mocked entity with newrelic service',
    title: 'app with newrelic',
    annotations: {
      [NEWRELIC_GUID_ANNOTATION]: 'some-cool-guid',
    },
  },
};

const newRelicApiMockEmpty = {
  getDashboardEntity: () => Promise.resolve(undefined),
};

export const EmptyNewRelicDashboard = () => (
  <TestApiProvider apis={[[newRelicDashboardApiRef, newRelicApiMockEmpty]]}>
    <EntityProvider entity={entity}>
      <NewRelicDashboard />
    </EntityProvider>
  </TestApiProvider>
);

const resultEntities = [
  {
    dashboardParentGuid: 'parent guid',
    guid: 'guid',
    permalink: 'http://example.com',
    name: 'Production metrics',
  },
];

const dashboardEntity = {
  data: {
    actor: {
      entitySearch: {
        results: {
          entities: resultEntities,
        },
      },
    },
  },
};

const entitySummary = {
  getDashboardEntity: dashboardEntity,
};

const dashboardSnapshot = {
  getDashboardSnapshot: {
    data: {
      dashboardCreateSnapshotUrl: createImage(
        1000,
        600,
        '#ddd',
        'Example snapshot, imagine NewRelic panels here',
      ).toDataURL(),
    },
  },
};

const newRelicApiMockFull = {
  getDashboardEntity: () => Promise.resolve(entitySummary),
  getDashboardSnapshot: () => Promise.resolve(dashboardSnapshot),
};

export const NewRelicDashboardWithSnapshots = () => (
  <TestApiProvider
    apis={[
      [newRelicDashboardApiRef, newRelicApiMockFull],
      [storageApiRef, MockStorageApi.create()],
    ]}
  >
    <EntityProvider entity={entity}>
      <NewRelicDashboard />
    </EntityProvider>
  </TestApiProvider>
);

export default {
  title: 'NewRelic Dashboard',
  component: EmptyNewRelicDashboard,
};
