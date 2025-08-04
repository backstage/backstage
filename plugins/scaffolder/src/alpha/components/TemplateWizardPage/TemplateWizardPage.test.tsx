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

import { ApiProvider } from '@backstage/core-app-api';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import {
  mockApis,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { act, fireEvent } from '@testing-library/react';
import {
  ScaffolderApi,
  scaffolderApiRef,
  SecretsContextProvider,
} from '@backstage/plugin-scaffolder-react';
import { TemplateWizardPage } from './TemplateWizardPage';
import { rootRouteRef } from '../../../routes';
import { ANNOTATION_EDIT_URL } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { ScaffolderFormDecoratorsApi } from '../../api/types';
import { formDecoratorsApiRef } from '../../api/ref';
import { visitsApiRef } from '@backstage/plugin-home';

jest.mock('react-router-dom', () => {
  return {
    ...(jest.requireActual('react-router-dom') as any),
    useParams: () => ({
      templateName: 'test',
    }),
    useLocation: () => ({
      pathname: '/create/templates/default/test-template',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    }),
  };
});

const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
  cancelTask: jest.fn(),
  scaffold: jest.fn(),
  getTemplateParameterSchema: jest.fn(),
  getIntegrationsList: jest.fn(),
  getTask: jest.fn(),
  streamLogs: jest.fn(),
  listActions: jest.fn(),
  listTasks: jest.fn(),
  autocomplete: jest.fn(),
};

const scaffolderDecoratorsMock: jest.Mocked<ScaffolderFormDecoratorsApi> = {
  getFormDecorators: jest.fn().mockResolvedValue([]),
};

const visitsApiMock = {
  updateName: jest.fn().mockResolvedValue(undefined),
  visit: jest.fn(),
  getVisits: jest.fn().mockResolvedValue([]),
};

const catalogApi = catalogApiMock.mock();
const analyticsApi = mockApis.analytics();

const apis = TestApiRegistry.from(
  [scaffolderApiRef, scaffolderApiMock],
  [formDecoratorsApiRef, scaffolderDecoratorsMock],
  [catalogApiRef, catalogApi],
  [analyticsApiRef, analyticsApi],
  [visitsApiRef, visitsApiMock],
);

const entityRefResponse = {
  apiVersion: 'v1',
  kind: 'service',
  metadata: {
    name: 'test',
    annotations: {
      [ANNOTATION_EDIT_URL]: 'http://localhost:3000',
      'backstage.io/time-saved': 'PT2H',
    },
  },
  spec: {
    profile: {
      displayName: 'BackUser',
    },
  },
};

describe('TemplateWizardPage', () => {
  it('captures expected analytics events', async () => {
    scaffolderApiMock.scaffold.mockResolvedValue({ taskId: 'xyz' });
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      steps: [
        {
          title: 'Step 1',
          schema: {
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        },
      ],
      title: 'React JSON Schema Form Test',
    });
    catalogApi.getEntityByRef.mockResolvedValue(entityRefResponse);

    const { findByRole, getByRole } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <SecretsContextProvider>
          <TemplateWizardPage customFieldExtensions={[]} />,
        </SecretsContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );

    // Fill out the name field
    fireEvent.change(getByRole('textbox', { name: 'name' }), {
      target: { value: 'expected-name' },
    });

    // Go to the final page
    await act(async () => {
      fireEvent.click(await findByRole('button', { name: 'Review' }));
    });

    // Create the software
    await act(async () => {
      fireEvent.click(await findByRole('button', { name: 'Create' }));
    });

    // The "Next Step" button should have fired an event
    expect(analyticsApi.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'click',
        subject: 'Next Step (1)',
        context: expect.objectContaining({
          entityRef: 'template:default/test',
        }),
      }),
    );

    // And the "Create" button should have fired an event
    expect(analyticsApi.captureEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'create',
        subject: 'expected-name',
        context: expect.objectContaining({
          entityRef: 'template:default/test',
        }),
        value: 120,
      }),
    );
  });

  describe('scaffolder page context menu', () => {
    it('should render if editUrl is set to url', async () => {
      catalogApi.getEntityByRef.mockResolvedValue({
        apiVersion: 'v1',
        kind: 'service',
        metadata: {
          name: 'test',
          annotations: {
            [ANNOTATION_EDIT_URL]: 'http://localhost:3000',
          },
        },
        spec: {
          profile: {
            displayName: 'BackUser',
          },
        },
      });
      const { queryByTestId } = await renderInTestApp(
        <ApiProvider apis={apis}>
          <SecretsContextProvider>
            <TemplateWizardPage customFieldExtensions={[]} />,
          </SecretsContextProvider>
        </ApiProvider>,
        {
          mountedRoutes: {
            '/create': rootRouteRef,
          },
        },
      );
      expect(queryByTestId('menu-button')).toBeInTheDocument();
    });

    it('should not render if editUrl is undefined', async () => {
      catalogApi.getEntityByRef.mockResolvedValue({
        apiVersion: 'v1',
        kind: 'service',
        metadata: {
          name: 'test',
          // annotations are not set
        },
        spec: {
          profile: {
            displayName: 'BackUser',
          },
        },
      });
      const { queryByTestId } = await renderInTestApp(
        <ApiProvider apis={apis}>
          <SecretsContextProvider>
            <TemplateWizardPage customFieldExtensions={[]} />,
          </SecretsContextProvider>
        </ApiProvider>,
        {
          mountedRoutes: {
            '/create': rootRouteRef,
          },
        },
      );
      expect(queryByTestId('menu-button')).not.toBeInTheDocument();
    });
  });

  describe('useUpdateVisitName hook', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call visitsApi.updateName when template title is available', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        steps: [],
        title: 'Test Template Title',
      });
      catalogApi.getEntityByRef.mockResolvedValue(entityRefResponse);

      await renderInTestApp(
        <ApiProvider apis={apis}>
          <SecretsContextProvider>
            <TemplateWizardPage customFieldExtensions={[]} />
          </SecretsContextProvider>
        </ApiProvider>,
        {
          mountedRoutes: {
            '/create': rootRouteRef,
          },
        },
      );

      expect(visitsApiMock.updateName).toHaveBeenCalledWith(
        '/create/templates/default/test-template',
        'Template Test Template Title',
      );
    });

    it('should not call visitsApi.updateName when template title is undefined', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        steps: [],
      } as any);
      catalogApi.getEntityByRef.mockResolvedValue(entityRefResponse);

      await renderInTestApp(
        <ApiProvider apis={apis}>
          <SecretsContextProvider>
            <TemplateWizardPage customFieldExtensions={[]} />
          </SecretsContextProvider>
        </ApiProvider>,
        {
          mountedRoutes: {
            '/create': rootRouteRef,
          },
        },
      );

      expect(visitsApiMock.updateName).not.toHaveBeenCalled();
    });
  });
});
