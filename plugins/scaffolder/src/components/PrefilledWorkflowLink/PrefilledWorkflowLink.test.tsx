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
import { renderInTestApp } from '@backstage/test-utils';
import { PrefilledWorkflowLink } from './PrefilledWorkflowLink';
import React from 'react';
import { rootRouteRef } from '../../routes';
import { screen } from '@testing-library/react';
import qs from 'qs';

describe('<PrefilledWorkflowLink />', () => {
  it('renders a serialized link to a prefilled workflow', async () => {
    await renderInTestApp(
      <div>
        <PrefilledWorkflowLink
          templateName="create-react-app"
          namespace="default"
          formData={{
            component_id: 'aaa',
            description: 'ddd',
            owner: 'backstage',
            repoUrl: 'github.com?owner=aaa&repo=aaa',
          }}
        >
          Prefilled Workflow
        </PrefilledWorkflowLink>
      </div>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    const link = screen.getByText<HTMLLinkElement>('Prefilled Workflow');

    expect(link).toBeInTheDocument();

    const url = new URL(link.href);

    expect(url.pathname).toBe('/templates/default/create-react-app');

    const formData = qs.parse(url.search.substring(1)).formData as string;

    expect(JSON.parse(formData)).toEqual({
      component_id: 'aaa',
      description: 'ddd',
      owner: 'backstage',
      repoUrl: 'github.com?owner=aaa&repo=aaa',
    });
  });
});
