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
import { scaffolderPlugin } from '../../plugin';

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
  });
});
