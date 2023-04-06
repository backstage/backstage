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

import { EntityProvider } from '@backstage/plugin-catalog-react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  MockPermissionApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import * as React from 'react';
import { UnregisterEntity } from './UnregisterEntity';

const mockPermissionApi = new MockPermissionApi();

function render(children: React.ReactNode) {
  return renderInTestApp(
    <TestApiProvider apis={[[permissionApiRef, mockPermissionApi]]}>
      <EntityProvider
        entity={{ apiVersion: 'a', kind: 'b', metadata: { name: 'c' } }}
        children={children}
      />
    </TestApiProvider>,
  );
}

describe('ComponentContextMenu', () => {
  it('should call onUnregisterEntity on button click', async () => {
    const mockCallback = jest.fn();
    await render(
      <UnregisterEntity
        unregisterEntityOptions={{ disableUnregister: 'visible' }}
        isUnregisterAllowed
        onUnregisterEntity={mockCallback}
        onClose={() => {}}
      />,
    );

    const unregister = await screen.findByText('Unregister entity');
    expect(unregister).toBeInTheDocument();
    fireEvent.click(unregister);

    expect(mockCallback).toHaveBeenCalled();
  });

  it('check Unregister entity button is disabled', async () => {
    const mockCallback = jest.fn();

    await render(
      <UnregisterEntity
        unregisterEntityOptions={{ disableUnregister: 'disable' }}
        isUnregisterAllowed
        onUnregisterEntity={mockCallback}
        onClose={() => {}}
      />,
    );

    const unregister = screen.getByText('Unregister entity');
    expect(unregister).toBeInTheDocument();

    const unregisterSpanItem = screen.getByText(/Unregister entity/);
    const unregisterMenuListItem =
      unregisterSpanItem?.parentElement?.parentElement;
    expect(unregisterMenuListItem).toHaveAttribute('aria-disabled');
  });
});
