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
import ComponentContextMenu from './ComponentContextMenu';
import { render } from '@testing-library/react';
import * as React from 'react';
import { act } from 'react-dom/test-utils';

describe('ComponentContextMenu', () => {
  it('should call onUnregisterComponent on button click', async () => {
    await act(async () => {
      const mockCallback = jest.fn();
      const menu = await render(
        <ComponentContextMenu onUnregisterComponent={mockCallback} />,
      );
      const button = await menu.findByTestId('menu-button');
      button.click();
      const unregister = await menu.findByText('Unregister component');
      expect(unregister).toBeInTheDOM();
    });
  });
});
