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

import { TemplateList } from './TemplateList';
import { ApiProvider, LocalStorageFeatureFlags } from '@backstage/core-app-api';
import React from 'react';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { SecretsContextProvider } from '@backstage/plugin-scaffolder-react';
import {
  FeatureFlagsApi,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { rootRouteRef } from '../../routes';
import { TemplateCardProps } from '../TemplateCard';
import { Box } from '@material-ui/core';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
  getEntityRelations: () => [],
  getEntitySourceLocation: () => ({}),
}));

const MockTemplateCard = ({ template, deprecated }: TemplateCardProps) => {
  return (
    <Box>
      {template.metadata.name}
      {deprecated}
    </Box>
  );
};

describe('TemplateList', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    (useEntityList as jest.Mock).mockReturnValue({
      loading: true,
      entities: [
        {
          kind: 'Template',
          spec: { type: 'service' },
          metadata: { name: 'template1' },
        },
        {
          kind: 'Template',
          spec: { type: 'service' },
          metadata: { name: 'template2', tags: ['alpha'] },
        },
        {
          kind: 'Template',
          spec: { type: 'service' },
          metadata: { name: 'template3', tags: ['experimental'] },
        },
      ],
    });
  });

  it('should display all non-experimental templates', async () => {
    const mockFeatureFlagsApi = new LocalStorageFeatureFlags();
    const apis = TestApiRegistry.from([
      featureFlagsApiRef,
      mockFeatureFlagsApi,
    ]);

    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SecretsContextProvider>
          <TemplateList TemplateCardComponent={MockTemplateCard} />
        </SecretsContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    expect(rendered.queryByText('template1')).toBeInTheDocument();
    expect(rendered.queryByText('template2')).toBeInTheDocument();
    expect(rendered.queryByText('template3')).not.toBeInTheDocument();
  });

  it('should display all templates including experimental', async () => {
    const featureFlagsApiMock: jest.Mocked<FeatureFlagsApi> = {
      isActive: jest.fn((_: string) => true),
      registerFlag: jest.fn(),
      getRegisteredFlags: jest.fn(),
      save: jest.fn(),
    };

    const apis = TestApiRegistry.from([
      featureFlagsApiRef,
      featureFlagsApiMock,
    ]);

    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SecretsContextProvider>
          <TemplateList TemplateCardComponent={MockTemplateCard} />
        </SecretsContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    expect(rendered.queryByText('template1')).toBeInTheDocument();
    expect(rendered.queryByText('template2')).toBeInTheDocument();
    expect(rendered.queryByText('template3')).toBeInTheDocument();
  });
});
