/*
 * Copyright 2022 The Backstage Authors
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
import { EntityLayout } from '@backstage/plugin-catalog';
import { Entity, ANNOTATION_SOURCE_LOCATION } from '@backstage/catalog-model';
import { ApiProvider } from '@backstage/core-app-api';
import { CatalogApi } from '@backstage/catalog-client';
import {
  EntityProvider,
  catalogApiRef,
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  renderInTestApp,
  TestApiRegistry,
  MockPermissionApi,
} from '@backstage/test-utils';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { ANNOTATION_ADR_LOCATION } from '@backstage/plugin-adr-common';
import {
  octokitAdrFileFetcher,
  urlReaderAdrFileFetcher,
} from '../../hooks/adrFileFetcher';
import { EntityAdrContent } from './EntityAdrContent';
import { rootRouteRef } from '../../routes';

const mockApis = TestApiRegistry.from(
  [catalogApiRef, {} as CatalogApi],
  [starredEntitiesApiRef, new MockStarredEntitiesApi()],
  [permissionApiRef, new MockPermissionApi()],
  [
    scmIntegrationsApiRef,
    {
      resolveUrl: options => `${options.url}`,
    } as ScmIntegrationRegistry,
  ],
);

const mockEntity: Entity = {
  kind: 'TestEntity',
  metadata: {
    name: 'Testing Entity 1',
    annotations: {
      [ANNOTATION_ADR_LOCATION]: 'testAdrFolder',
      [ANNOTATION_SOURCE_LOCATION]: 'source:location',
    },
  },
  apiVersion: '',
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('EntityAdrContent', () => {
  it('Falls back to octokitAdrFileFetcher when adrFileFetcher is not specified', async () => {
    const getAdrFilesSpyInstance = jest
      .spyOn(octokitAdrFileFetcher, 'useGetAdrFilesAtUrl')
      .mockImplementation(() => {
        return {
          data: [],
        };
      });

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityProvider entity={mockEntity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <EntityAdrContent />
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/adr': rootRouteRef,
        },
      },
    );

    expect(getAdrFilesSpyInstance).toHaveBeenCalled();
  });

  it('Uses an alternative AdrFileFetcher when provided', async () => {
    const octokitGetAdrFilesSpyInstance = jest
      .spyOn(octokitAdrFileFetcher, 'useGetAdrFilesAtUrl')
      .mockImplementation(() => {
        return {
          data: [],
        };
      });

    const urlReadersGetAdrFilesSpyInstance = jest
      .spyOn(urlReaderAdrFileFetcher, 'useGetAdrFilesAtUrl')
      .mockImplementation(() => {
        return {
          data: [],
        };
      });

    await renderInTestApp(
      <ApiProvider apis={mockApis}>
        <EntityProvider entity={mockEntity}>
          <EntityLayout>
            <EntityLayout.Route path="/" title="tabbed-test-title">
              <EntityAdrContent adrFileFetcher={urlReaderAdrFileFetcher} />
            </EntityLayout.Route>
          </EntityLayout>
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/adr': rootRouteRef,
        },
      },
    );

    expect(octokitGetAdrFilesSpyInstance).not.toHaveBeenCalled();
    expect(urlReadersGetAdrFilesSpyInstance).toHaveBeenCalled();
  });
});
