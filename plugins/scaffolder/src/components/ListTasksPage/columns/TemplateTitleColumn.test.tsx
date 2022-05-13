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

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import React from 'react';
import { TemplateTitleColumn } from './TemplateTitleColumn';
import { scaffolderApiRef } from '../../../api';
import { ScaffolderApi } from '../../../types';
import { entityRouteRef } from '@backstage/plugin-catalog-react';

describe('<TemplateTitleColumn />', () => {
  const scaffolderApiMock: jest.Mocked<ScaffolderApi> = {
    scaffold: jest.fn(),
    getTemplateParameterSchema: jest.fn(),
  } as any;

  it('should render the column with the template name', async () => {
    const props = {
      entityRef: 'template:default/one-template',
    };
    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      title: 'One Template',
      steps: [],
    });

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <TemplateTitleColumn {...props} />
      </TestApiProvider>,
      { mountedRoutes: { '/test': entityRouteRef } },
    );

    const text = getByText('One Template');
    expect(text).toBeDefined();
  });
});
