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
import { fireEvent, getByRole, waitFor, act } from '@testing-library/react';
import { PlaylistApi, playlistApiRef } from '../../api';
import React from 'react';

import { PlaylistEditDialog } from './PlaylistEditDialog';

describe('<PlaylistEditDialog/>', () => {
  const samplePlaylists = [
    {
      id: 'id1',
      name: 'playlist-1',
      owner: 'group:default/some-owner',
      public: true,
      entities: 1,
      followers: 2,
      isFollowing: false,
    },
    {
      id: 'id2',
      name: 'playlist-2',
      owner: 'group:default/another-owner',
      public: true,
      entities: 2,
      followers: 1,
      isFollowing: true,
    },
  ];
  it('handle saving with an edited playlist', async () => {
    const identityApi: Partial<IdentityApi> = {
      getBackstageIdentity: async () => ({
        type: 'user',
        userEntityRef: 'user:default/me',
        ownershipEntityRefs: ['group:default/test-owner', 'user:default/me'],
      }),
    };

    const mockOnSave = jest.fn().mockImplementation(async () => {});
    const playlistApi: Partial<PlaylistApi> = {
      getAllPlaylists: jest
        .fn()
        .mockImplementation(async () => samplePlaylists),
    };
    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [identityApiRef, identityApi],
          [playlistApiRef, playlistApi],
        ]}
      >
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
    });

    act(() => {
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
    });

    act(() => {
      fireEvent.mouseDown(
        getByRole(rendered.getByTestId('edit-dialog-owner-select'), 'button'),
      );
    });

    act(() => {
      fireEvent.click(rendered.getByText('test-owner'));
    });

    act(() => {
      fireEvent.click(
        getByRole(rendered.getByTestId('edit-dialog-public-option'), 'radio'),
      );
    });

    act(() => {
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

  it('displays duplicate validation message for playlist name', async () => {
    const identityApi: Partial<IdentityApi> = {
      getBackstageIdentity: async () => ({
        type: 'user',
        userEntityRef: 'user:default/me',
        ownershipEntityRefs: ['group:default/test-owner', 'user:default/me'],
      }),
    };

    const mockOnSave = jest.fn().mockImplementation(async () => {});
    const playlistApi: Partial<PlaylistApi> = {
      getAllPlaylists: jest
        .fn()
        .mockImplementation(async () => [...samplePlaylists]),
    };

    const rendered = await renderInTestApp(
      <TestApiProvider
        apis={[
          [identityApiRef, identityApi],
          [playlistApiRef, playlistApi],
        ]}
      >
        <PlaylistEditDialog open onClose={jest.fn()} onSave={mockOnSave} />
      </TestApiProvider>,
    );

    act(() => {
      fireEvent.input(
        getByRole(rendered.getByTestId('edit-dialog-name-input'), 'textbox'),
        {
          target: {
            value: 'playlist-1',
          },
        },
      );

      fireEvent.click(rendered.getByTestId('edit-dialog-save-button'));
    });

    await waitFor(() => {
      expect(
        rendered.getByText('A playlist with this name already exists'),
      ).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });
});
