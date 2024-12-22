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
import { Router } from './Router';
import {
  renderInTestApp,
  TestApiProvider,
  TestAppOptions,
} from '@backstage/test-utils';
import {
  createScaffolderFieldExtension,
  ScaffolderFieldExtensions,
} from '@backstage/plugin-scaffolder-react';
import { scaffolderPlugin } from '../../plugin';
import {
  createScaffolderLayout,
  ScaffolderLayouts,
} from '@backstage/plugin-scaffolder-react';
import { TemplateListPage, TemplateWizardPage } from '../../alpha/components';
import { formFieldsApiRef } from '@backstage/plugin-scaffolder-react/alpha';

jest.mock('../../alpha/components', () => ({
  TemplateWizardPage: jest.fn(() => null),
  TemplateListPage: jest.fn(() => null),
}));

const wrapInApisAndRender = (
  element: React.ReactElement,
  opts?: TestAppOptions,
) =>
  renderInTestApp(
    <TestApiProvider
      apis={[[formFieldsApiRef, { getFormFields: async () => [] }]]}
    >
      {element}
    </TestApiProvider>,
    opts,
  );

describe('Router', () => {
  beforeEach(() => {
    (TemplateWizardPage as jest.Mock).mockClear();
    (TemplateListPage as jest.Mock).mockClear();
  });
  describe('/', () => {
    it('should render the TemplateListPage', async () => {
      await wrapInApisAndRender(<Router />);

      expect(TemplateListPage).toHaveBeenCalled();
    });

    it('should render user-provided TemplateListPage', async () => {
      const { getByText } = await wrapInApisAndRender(
        <Router
          components={{
            EXPERIMENTAL_TemplateListPageComponent: () => <>foobar</>,
          }}
        />,
        {
          routeEntries: ['/'],
        },
      );
      expect(getByText('foobar')).toBeInTheDocument();
      expect(TemplateListPage).not.toHaveBeenCalled();
    });
  });

  describe('/templates/:templateName', () => {
    it('should render the TemplateWizard page', async () => {
      await wrapInApisAndRender(<Router />, {
        routeEntries: ['/templates/default/foo'],
      });

      expect(TemplateWizardPage).toHaveBeenCalled();
    });

    it('should render user-provided TemplateWizardPage', async () => {
      const { getByText } = await wrapInApisAndRender(
        <Router
          components={{
            EXPERIMENTAL_TemplateWizardPageComponent: () => <>foobar</>,
          }}
        />,
        {
          routeEntries: ['/templates/default/foo'],
        },
      );
      expect(getByText('foobar')).toBeInTheDocument();
      expect(TemplateWizardPage).not.toHaveBeenCalled();
    });

    it('should pass through the FormProps property', async () => {
      const transformErrorsMock = jest.fn();

      await wrapInApisAndRender(
        <Router
          formProps={{
            transformErrors: transformErrorsMock,
            noHtml5Validate: true,
          }}
        />,

        {
          routeEntries: ['/templates/default/foo'],
        },
      );

      const mock = TemplateWizardPage as jest.Mock;

      const [{ formProps }] = mock.mock.calls[0];

      expect(formProps).toEqual({
        transformErrors: transformErrorsMock,
        noHtml5Validate: true,
      });
    });

    it('should extract the fieldExtensions and pass them through', async () => {
      const mockComponent = () => null;
      const CustomFieldExtension = scaffolderPlugin.provide(
        createScaffolderFieldExtension({
          name: 'custom',
          component: mockComponent,
        }),
      );

      await wrapInApisAndRender(
        <Router>
          <ScaffolderFieldExtensions>
            <CustomFieldExtension />
          </ScaffolderFieldExtensions>
        </Router>,
        { routeEntries: ['/templates/default/foo'] },
      );

      const mock = TemplateWizardPage as jest.Mock;
      const [{ customFieldExtensions }] = mock.mock.calls[0];

      expect(customFieldExtensions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'custom', component: mockComponent }),
        ]),
      );
    });

    it('should extract the layouts and pass them through', async () => {
      const mockLayoutComponent = () => null;
      const Layout = scaffolderPlugin.provide(
        createScaffolderLayout({
          name: 'layout',
          component: mockLayoutComponent,
        }),
      );

      await wrapInApisAndRender(
        <Router>
          <ScaffolderLayouts>
            <Layout />
          </ScaffolderLayouts>
        </Router>,
        { routeEntries: ['/templates/default/foo'] },
      );

      const mock = TemplateWizardPage as jest.Mock;
      const [{ layouts }] = mock.mock.calls[0];

      expect(layouts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'layout',
            component: mockLayoutComponent,
          }),
        ]),
      );
    });
  });
});
