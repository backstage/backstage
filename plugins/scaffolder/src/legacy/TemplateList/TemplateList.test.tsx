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

import { screen } from '@testing-library/react';
import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { TemplateList } from './TemplateList';
import { rootRouteRef } from '../../routes';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn().mockReturnValue({
    loading: false,
    entities: [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't1',
        },
        spec: {},
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't2',
        },
        spec: {},
      },
    ],
  }),
  getEntityRelations: jest.fn().mockImplementation(() => []),
  getEntitySourceLocation: jest.fn().mockImplementation(() => ({})),
}));

describe('TemplateList', () => {
  const mockIntegrationsApi: Partial<ScmIntegrationsApi> = {
    byHost: () => ({ type: 'github' }),
  };

  it('should filter out templates based on provided filter condition', async () => {
    const TemplateCardComponent = ({
      template,
    }: {
      template: TemplateEntityV1beta3;
    }) => (
      <div data-testid={template.metadata.name}>{template.metadata.name}</div>
    );

    await renderInTestApp(
      <TestApiProvider apis={[[scmIntegrationsApiRef, mockIntegrationsApi]]}>
        <div data-testid="container">
          <TemplateList
            templateFilter={e => e.metadata.name === 't1'}
            TemplateCardComponent={TemplateCardComponent}
          />
        </div>
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(() => screen.getByTestId('t2')).toThrow();
    expect(screen.getByTestId('t1')).toBeDefined();
  });
});
