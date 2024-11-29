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

import { ApiEntity } from '@backstage/catalog-model';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { ApiDocsConfig, apiDocsConfigRef } from '../../config';
import { ApiTypeTitle } from './ApiTypeTitle';

describe('<ApiTypeTitle />', () => {
  const apiDocsConfig: jest.Mocked<ApiDocsConfig> = {
    getApiDefinitionWidget: jest.fn(),
  } as any;
  let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

  beforeEach(() => {
    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <TestApiProvider apis={[[apiDocsConfigRef, apiDocsConfig]]}>
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('renders API type title', async () => {
    const apiEntity: ApiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'my-name',
      },
      spec: {
        type: 'openapi',
        lifecycle: '...',
        owner: '...',
        definition: '...',
      },
    };
    apiDocsConfig.getApiDefinitionWidget.mockReturnValue({
      type: 'openapi',
      title: 'OpenAPI',
      component: () => <div />,
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ApiTypeTitle apiEntity={apiEntity} />
      </Wrapper>,
    );

    expect(getByText(/OpenAPI/)).toBeInTheDocument();
  });

  it('fallback if title is unknown', async () => {
    const apiEntity: ApiEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'API',
      metadata: {
        name: 'my-name',
      },
      spec: {
        type: 'custom-type',
        lifecycle: '...',
        owner: '...',
        definition: '...',
      },
    };

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <ApiTypeTitle apiEntity={apiEntity} />
      </Wrapper>,
    );

    expect(getByText(/custom-type/i)).toBeInTheDocument();
  });
});
