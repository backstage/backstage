/*
 * Copyright 2020 Spotify AB
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

import { render, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { EntityContextMenu } from './EntityContextMenu';

describe('ComponentContextMenu', () => {
  it('should call onUnregisterEntity on button click', async () => {
    await act(async () => {
      const mockCallback = jest.fn();
      const menu = render(
        <EntityContextMenu onUnregisterEntity={mockCallback} />,
      );
      const button = await menu.findByTestId('menu-button');
      fireEvent.click(button);
      const unregister = await menu.findByText('Unregister entity');
      expect(unregister).toBeInTheDocument();
    });
  });
});
