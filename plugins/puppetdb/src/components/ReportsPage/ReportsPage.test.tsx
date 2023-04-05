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
import React from 'react';
import { ReportsPage } from './ReportsPage';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { puppetDbApiRef, PuppetDbClient } from '../../api';
import { ANNOTATION_PUPPET_CERTNAME } from '../../constants';
import { Entity } from '@backstage/catalog-model/';
import { isPluginApplicableToEntity } from '../../index';
import { ApiProvider } from '@backstage/core-app-api';
import { puppetDbRouteRef } from '../../routes';

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Resource',
  metadata: {
    name: 'test',
    annotations: {
      [ANNOTATION_PUPPET_CERTNAME]: 'node1',
    },
  },
};

const entityWithoutAnnotations: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Resource',
  metadata: {
    name: 'test',
    annotations: {},
  },
};

const mockPuppetDbApi: Partial<PuppetDbClient> = {
  getPuppetDbNodeReports: async () => [],
};

const apis = TestApiRegistry.from([puppetDbApiRef, mockPuppetDbApi]);

describe('isPluginApplicableToEntity', () => {
  describe('when entity has no annotations', () => {
    it('returns false', () => {
      expect(isPluginApplicableToEntity(entityWithoutAnnotations)).toBe(false);
    });
  });

  describe('when entity has the puppet annotation', () => {
    it('returns true', () => {
      expect(isPluginApplicableToEntity(entity)).toBe(true);
    });
  });
});

describe('ReportsPage', () => {
  it('should render', async () => {
    const render = await renderInTestApp(
      <ApiProvider apis={apis}>
        <EntityProvider entity={entity}>
          <ReportsPage />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/puppetdb': puppetDbRouteRef,
        },
      },
    );
    expect(
      render.getByText('Latest PuppetDB reports from node node1'),
    ).toBeInTheDocument();
  });
});
