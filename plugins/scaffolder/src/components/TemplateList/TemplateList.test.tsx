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

jest.mock('../../options');
import { TemplateList } from './TemplateList';
import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { SecretsContextProvider } from '@backstage/plugin-scaffolder-react';
import {
  FeatureFlagsApi,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { rootRouteRef } from '../../routes';
import { TemplateCardProps } from '../TemplateCard';
import { Box } from '@material-ui/core';
import { ScaffolderPluginOptions, useScaffolderOptions } from '../../options';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
  getEntityRelations: () => [],
  getEntitySourceLocation: () => ({}),
}));

const mockedUseScaffolderOptions =
  useScaffolderOptions as jest.Mock<ScaffolderPluginOptions>;

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
          spec: { type: 'service', lifecycle: 'production' },
          metadata: { name: 'template1' },
        },
        {
          kind: 'Template',
          spec: { type: 'service', lifecycle: 'production' },
          metadata: { name: 'template2' },
        },
        {
          kind: 'Template',
          spec: { type: 'service', lifecycle: 'experimental' },
          metadata: { name: 'template3' },
        },
      ],
    });
  });

  const renderMe = async (
    featureFlagsApiMock: jest.Mocked<FeatureFlagsApi>,
  ) => {
    return await renderInTestApp(
      <TestApiProvider apis={[[featureFlagsApiRef, featureFlagsApiMock]]}>
        <SecretsContextProvider>
          <TemplateList TemplateCardComponent={MockTemplateCard} />
        </SecretsContextProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );
  };

  it('should display all non-experimental templates', async () => {
    mockedUseScaffolderOptions.mockImplementation(() => ({
      activateExperimentalTemplatesFeature: true,
    }));
    const featureFlagsApiMock: jest.Mocked<FeatureFlagsApi> = {
      isActive: jest.fn((_: string) => false),
      registerFlag: jest.fn(),
      getRegisteredFlags: jest.fn(),
      save: jest.fn(),
    };

    const rendered = await renderMe(featureFlagsApiMock);

    expect(rendered.queryByText('template1')).toBeInTheDocument();
    expect(rendered.queryByText('template2')).toBeInTheDocument();
    expect(rendered.queryByText('template3')).not.toBeInTheDocument();
  });

  it('should display all templates including experimental', async () => {
    mockedUseScaffolderOptions.mockImplementation(() => ({
      activateExperimentalTemplatesFeature: true,
    }));
    const featureFlagsApiMock: jest.Mocked<FeatureFlagsApi> = {
      isActive: jest.fn((_: string) => true),
      registerFlag: jest.fn(),
      getRegisteredFlags: jest.fn(),
      save: jest.fn(),
    };

    const rendered = await renderMe(featureFlagsApiMock);

    expect(rendered.queryByText('template1')).toBeInTheDocument();
    expect(rendered.queryByText('template2')).toBeInTheDocument();
    expect(rendered.queryByText('template3')).toBeInTheDocument();
  });

  it('should display all templates cause feature flag option is not enabled by user', async () => {
    mockedUseScaffolderOptions.mockImplementation(() => ({
      activateExperimentalTemplatesFeature: false,
    }));
    const featureFlagsApiMock: jest.Mocked<FeatureFlagsApi> = {
      isActive: jest.fn((_: string) => true),
      registerFlag: jest.fn(),
      getRegisteredFlags: jest.fn(() => []),
      save: jest.fn(),
    };

    const rendered = await renderMe(featureFlagsApiMock);

    expect(rendered.queryByText('template1')).toBeInTheDocument();
    expect(rendered.queryByText('template2')).toBeInTheDocument();
    expect(rendered.queryByText('template3')).toBeInTheDocument();
  });
});
