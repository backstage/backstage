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
import { fireEvent, waitFor } from '@testing-library/react';
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

jest.mock('react-router-dom', () => {
  return {
    ...(jest.requireActual('react-router-dom') as any),
    useParams: () => ({
      templateName: 'test',
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

const catalogApi = catalogApiMock.mock();
const analyticsApi = mockApis.analytics();

const apis = TestApiRegistry.from(
  [scaffolderApiRef, scaffolderApiMock],
  [formDecoratorsApiRef, scaffolderDecoratorsMock],
  [catalogApiRef, catalogApi],
  [analyticsApiRef, analyticsApi],
  [catalogApiRef, catalogApi],
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
    fireEvent.click(await findByRole('button', { name: 'Review' }));

    // Create the software
    fireEvent.click(await findByRole('button', { name: 'Create' }));

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
    await waitFor(() =>
      expect(analyticsApi.captureEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'create',
          subject: 'Task has been created',
          attributes: {
            templateSteps: 1,
          },
          context: expect.objectContaining({
            entityRef: 'template:default/test',
          }),
          value: 120,
        }),
      ),
    );
  });

  describe('scaffolder page context menu', () => {
    it('should not render the menu if editUrl and description are undefined', async () => {
      catalogApi.getEntityByRef.mockResolvedValue({
        apiVersion: 'v1',
        kind: 'Service',
        metadata: {
          name: 'test',
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

    it('should render the edit menu item if editUrl is set to url', async () => {
      catalogApi.getEntityByRef.mockResolvedValue({
        apiVersion: 'v1',
        kind: 'Service',
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
      const { queryByTestId, getByTestId } = await renderInTestApp(
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

      // open menu
      fireEvent.click(getByTestId('menu-button'));

      expect(queryByTestId('edit-menu-item')).toBeInTheDocument();
    });

    it('should not render the edit menu item if editUrl is undefined', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        title: 'React JSON Schema Form Test',
        description: 'A test description',
        steps: [],
      });

      catalogApi.getEntityByRef.mockResolvedValue({
        apiVersion: 'v1',
        kind: 'Service',
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

      // open menu
      const menu = queryByTestId('menu-button');
      expect(menu).toBeInTheDocument();
      fireEvent.click(menu!);

      expect(queryByTestId('edit-menu-item')).not.toBeInTheDocument();
    });

    it('should render "hide description" if the description is visible', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        title: 'React JSON Schema Form Test',
        // long description to ensure it is shown by default
        description: 'More than 140 characters incoming! '.repeat(10),
        steps: [],
      });

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

      const { queryByTestId, queryByText } = await renderInTestApp(
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

      // open menu
      const menu = queryByTestId('menu-button');
      expect(menu).toBeInTheDocument();
      fireEvent.click(menu!);

      expect(queryByTestId('description-menu-item')).toBeInTheDocument();
      expect(queryByText('Hide Description')).toBeInTheDocument();
    });

    it('should render "show description" if the description is not visible', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        title: 'React JSON Schema Form Test',
        // short description to ensure it is hidden by default
        description: 'These are less than 140 characters.',
        steps: [],
      });

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

      const { queryByTestId, queryByText, getByTestId } = await renderInTestApp(
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

      // open menu
      fireEvent.click(getByTestId('menu-button'));

      expect(queryByTestId('description-menu-item')).toBeInTheDocument();
      expect(queryByText('Show Description')).toBeInTheDocument();
    });

    it('should not render the description item if no description is set', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        title: 'React JSON Schema Form Test',
        // no description
        steps: [],
      });

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

      const { queryByTestId, getByTestId } = await renderInTestApp(
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

      // open menu
      fireEvent.click(getByTestId('menu-button'));

      expect(queryByTestId('description-menu-item')).not.toBeInTheDocument();
    });

    it('should always hide the description if spec.presentation.showDescription is false', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        title: 'React JSON Schema Form Test',
        // long description to ensure it is shown by default
        description: 'More than 140 characters incoming! '.repeat(10),
        steps: [],
        presentation: {
          showDescription: false,
        },
      });

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

      const { queryByTestId, queryByText } = await renderInTestApp(
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

      // open menu
      const menu = queryByTestId('menu-button');
      expect(menu).toBeInTheDocument();
      fireEvent.click(menu!);

      expect(queryByTestId('description-menu-item')).toBeInTheDocument();
      expect(queryByText('Show Description')).toBeInTheDocument();
    });

    it('should always show the description if spec.presentation.showDescription is true', async () => {
      scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
        title: 'React JSON Schema Form Test',
        // long description to ensure it is shown by default
        description: 'These are less than 140 characters.',
        steps: [],
        presentation: {
          showDescription: true,
        },
      });

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

      const { queryByTestId, queryByText } = await renderInTestApp(
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

      // open menu
      const menu = queryByTestId('menu-button');
      expect(menu).toBeInTheDocument();
      fireEvent.click(menu!);

      expect(queryByTestId('description-menu-item')).toBeInTheDocument();
      expect(queryByText('Hide Description')).toBeInTheDocument();
    });
  });
});
