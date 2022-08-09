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
import { TemplateListPage } from '../TemplateListPage';
import { TemplateWizardPage } from '../TemplateWizardPage';
import { Router } from './Router';
import { renderInTestApp } from '@backstage/test-utils';
import {
  createScaffolderFieldExtension,
  ScaffolderFieldExtensions,
} from '../../extensions';
import {
  createScaffolderLayout,
  DEFAULT_SCAFFOLDER_LAYOUT,
  ScaffolderLayouts,
} from '../../layouts';
import { scaffolderPlugin } from '../../plugin';
import { ObjectFieldTemplateProps } from '@rjsf/core';

jest.mock('../TemplateListPage', () => ({
  TemplateListPage: jest.fn(() => null),
}));

jest.mock('../TemplateWizardPage', () => ({
  TemplateWizardPage: jest.fn(() => null),
}));

describe('Router', () => {
  beforeEach(() => {
    (TemplateWizardPage as jest.Mock).mockClear();
    (TemplateListPage as jest.Mock).mockClear();
  });
  describe('/', () => {
    it('should render the TemplateListPage', async () => {
      await renderInTestApp(<Router />);

      expect(TemplateListPage).toHaveBeenCalled();
    });
  });

  describe('/templates/:templateName', () => {
    it('should render the TemplateWizard page', async () => {
      await renderInTestApp(<Router />, {
        routeEntries: ['/templates/default/foo'],
      });

      expect(TemplateWizardPage).toHaveBeenCalled();
    });

    it('should extract the fieldExtensions and pass them through', async () => {
      const mockComponent = () => null;
      const CustomFieldExtension = scaffolderPlugin.provide(
        createScaffolderFieldExtension({
          name: 'custom',
          component: mockComponent,
        }),
      );

      await renderInTestApp(
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

    it('should use the default layout', async () => {
      await renderInTestApp(<Router />, {
        routeEntries: ['/templates/default/foo'],
      });

      const mock = TemplateWizardPage as jest.Mock;

      const [{ layout }] = mock.mock.calls[0];

      expect(layout).toEqual(DEFAULT_SCAFFOLDER_LAYOUT);
    });

    it('should extract the custom layout and pass it through', async () => {
      const mockLayout = () => null;
      const CustomLayout = scaffolderPlugin.provide(
        createScaffolderLayout({
          name: 'customLayout',
          component: mockLayout,
        }),
      );

      const props = {} as ObjectFieldTemplateProps;

      await renderInTestApp(
        <Router>
          <ScaffolderLayouts>
            <CustomLayout {...props} />
          </ScaffolderLayouts>
        </Router>,
        { routeEntries: ['/templates/default/foo'] },
      );

      const mock = TemplateWizardPage as jest.Mock;
      // eslint-disable-next-line no-console
      const [{ layout }] = mock.mock.calls[0];

      expect(layout).toEqual({ name: 'customLayout', component: mockLayout });
    });
  });
});
