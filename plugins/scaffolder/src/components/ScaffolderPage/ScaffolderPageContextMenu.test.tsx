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

import userEvent from '@testing-library/user-event';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { rootRouteRef } from '../../routes';
import { ScaffolderPageContextMenu } from './ScaffolderPageContextMenu';

describe('ScaffolderPageContextMenu', () => {
  it('does not render anything if fully disabled', async () => {
    await renderInTestApp(
      <div data-testid="container">
        <ScaffolderPageContextMenu editor={false} actions={false} />
      </div>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(screen.getByTestId('container')).toBeEmptyDOMElement();
  });

  it('renders the editor option', async () => {
    await renderInTestApp(
      <div data-testid="container">
        <ScaffolderPageContextMenu actions={false} />
      </div>,
      {
        mountedRoutes: { '/': rootRouteRef },
      },
    );

    await userEvent.click(screen.getByTestId('container').firstElementChild!);

    expect(screen.queryByText('Template Editor')).toBeInTheDocument();
    expect(screen.queryByText('Installed Actions')).not.toBeInTheDocument();
  });

  it('renders the actions option', async () => {
    await renderInTestApp(
      <div data-testid="container">
        <ScaffolderPageContextMenu actions editor={false} />
      </div>,
      {
        mountedRoutes: { '/': rootRouteRef },
      },
    );

    await userEvent.click(screen.getByTestId('container').firstElementChild!);

    expect(screen.queryByText('Template Editor')).not.toBeInTheDocument();
    expect(screen.queryByText('Installed Actions')).toBeInTheDocument();
  });

  it('renders all options', async () => {
    await renderInTestApp(
      <div data-testid="container">
        <ScaffolderPageContextMenu />
      </div>,
      {
        mountedRoutes: { '/': rootRouteRef },
      },
    );

    await userEvent.click(screen.getByTestId('container').firstElementChild!);

    expect(screen.queryByText('Template Editor')).toBeInTheDocument();
    expect(screen.queryByText('Installed Actions')).toBeInTheDocument();
  });
});
