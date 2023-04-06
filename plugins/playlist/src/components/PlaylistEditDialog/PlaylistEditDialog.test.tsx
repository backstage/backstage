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

import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { fireEvent, getByRole, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import React from 'react';

import { PlaylistEditDialog } from './PlaylistEditDialog';

describe('<PlaylistEditDialog/>', () => {
  it('handle saving with an edited playlist', async () => {
    const identityApi: Partial<IdentityApi> = {
      getBackstageIdentity: async () => ({
        type: 'user',
        userEntityRef: 'user:default/me',
        ownershipEntityRefs: ['group:default/test-owner', 'user:default/me'],
      }),
    };

    const mockOnSave = jest.fn().mockImplementation(async () => {});
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[identityApiRef, identityApi]]}>
        <PlaylistEditDialog open onClose={jest.fn()} onSave={mockOnSave} />
      </TestApiProvider>,
    );

    act(() => {
      fireEvent.input(
        getByRole(rendered.getByTestId('edit-dialog-name-input'), 'textbox'),
        {
          target: {
            value: 'test playlist',
          },
        },
      );

      fireEvent.input(
        getByRole(
          rendered.getByTestId('edit-dialog-description-input'),
          'textbox',
        ),
        {
          target: {
            value: 'test description',
          },
        },
      );

      fireEvent.mouseDown(
        getByRole(rendered.getByTestId('edit-dialog-owner-select'), 'button'),
      );

      fireEvent.click(rendered.getByText('test-owner'));

      fireEvent.click(
        getByRole(rendered.getByTestId('edit-dialog-public-option'), 'radio'),
      );

      fireEvent.click(rendered.getByTestId('edit-dialog-save-button'));
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'test playlist',
        description: 'test description',
        owner: 'group:default/test-owner',
        public: true,
      });
    });
  });
});
