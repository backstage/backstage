/*
 * Copyright 2024 The Backstage Authors
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
import { renderInTestApp } from '@backstage/test-utils';
import { TemplateIntroPage } from './TemplateIntroPage';
import { rootRouteRef } from '../../../routes';

describe('TemplateIntroPage', () => {
  it('Should render without exploding', async () => {
    await renderInTestApp(<TemplateIntroPage />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });
    expect(
      screen.getByRole('heading', { name: 'Manage Templates' }),
    ).toBeInTheDocument();
  });

  it('Should have an link back to the create page', async () => {
    await renderInTestApp(<TemplateIntroPage />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });
    expect(screen.getByRole('link', { name: /Scaffolder/ })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('Should have an action to load a template directory', async () => {
    await renderInTestApp(<TemplateIntroPage />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });
    expect(
      screen.getByRole('button', { name: /Load Template Directory/ }),
    ).toBeInTheDocument();
  });

  it('Should have an action to create a template directory', async () => {
    await renderInTestApp(<TemplateIntroPage />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });
    expect(
      screen.getByRole('button', { name: /Create New Template/ }),
    ).toBeInTheDocument();
  });

  it('Should have an action to open the template playground', async () => {
    await renderInTestApp(<TemplateIntroPage />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });
    expect(
      screen.getByRole('button', { name: /Template Form Playground/ }),
    ).toBeInTheDocument();
  });

  it('Should have an action to open the custom fields explorer', async () => {
    await renderInTestApp(<TemplateIntroPage />, {
      mountedRoutes: {
        '/': rootRouteRef,
      },
    });

    expect(
      screen.getByRole('button', { name: /Custom Field Explorer/ }),
    ).toBeInTheDocument();
  });
});
