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

import { ErrorApi, errorApiRef } from '@backstage/core-plugin-api';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  PermissionApi,
  permissionApiRef,
} from '@backstage/plugin-permission-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { Button } from '@material-ui/core';
import { fireEvent, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react-hooks';
import React from 'react';
import { SWRConfig } from 'swr';
import { PlaylistApi, playlistApiRef } from '../../api';
import { PlaylistEntitiesTable } from './PlaylistEntitiesTable';

jest.mock('./AddEntitiesDrawer', () => ({
  AddEntitiesDrawer: ({ onAdd, open }: { onAdd: Function; open: boolean }) =>
    open ? (
      <Button
        data-testid="mock-add-entities-drawer"
        onClick={() => onAdd('api:test/my-ent')}
      />
    ) : null,
}));

describe('PlaylistEntitiesTable', () => {
  const errorApi: Partial<ErrorApi> = { post: jest.fn() };
  const sampleEntities = [
    {
      kind: 'system',
      metadata: {
        namespace: 'default',
        name: 'test-ent',
        title: 'Test Ent',
        description: 'test ent description',
      },
    },
    {
      kind: 'component',
      metadata: {
        namespace: 'foo',
        name: 'test-ent2',
        title: 'Test Ent 2',
        description: 'test ent description 2',
      },
      spec: {
        type: 'library',
      },
    },
  ];
  const playlistApi: Partial<PlaylistApi> = {
    getPlaylistEntities: jest
      .fn()
      .mockImplementation(async () => sampleEntities),
    addPlaylistEntities: jest.fn().mockImplementation(async () => {}),
    removePlaylistEntities: jest.fn().mockImplementation(async () => {}),
  };

  const mockAuthorize = jest
    .fn()
    .mockImplementation(async () => ({ result: AuthorizeResult.ALLOW }));
  const permissionApi: Partial<PermissionApi> = { authorize: mockAuthorize };

  // SWR used by the usePermission hook needs cache to be reset for each test
  const element = (
    <SWRConfig value={{ provider: () => new Map() }}>
      <TestApiProvider
        apis={[
          [errorApiRef, errorApi],
          [permissionApiRef, permissionApi],
          [playlistApiRef, playlistApi],
        ]}
      >
        <PlaylistEntitiesTable playlistId="playlist-id" />
      </TestApiProvider>
    </SWRConfig>
  );

  const render = async () =>
    renderInTestApp(element, {
      mountedRoutes: { '/catalog/:namespace/:kind/:name': entityRouteRef },
    });

  beforeEach(() => {
    mockAuthorize.mockClear();
  });

  it('renders playlist entities and options', async () => {
    const rendered = await render();

    expect(playlistApi.getPlaylistEntities).toHaveBeenCalledWith('playlist-id');

    expect(rendered.getByText('Test Ent')).toBeInTheDocument();
    expect(rendered.getByText('system')).toBeInTheDocument();
    expect(rendered.getByText('test ent description')).toBeInTheDocument();

    expect(rendered.getByText('Test Ent 2')).toBeInTheDocument();
    expect(rendered.getByText('component - library')).toBeInTheDocument();
    expect(rendered.getByText('test ent description 2')).toBeInTheDocument();

    const removeButtons = rendered.getAllByTitle('Remove from playlist');
    expect(removeButtons.length).toEqual(2);
    removeButtons.forEach(b => expect(b).toBeInTheDocument());
    expect(rendered.getByTitle('Add entities to playlist')).toBeInTheDocument();
  });

  it('has no edit options if unauthorized', async () => {
    mockAuthorize.mockImplementationOnce(async () => ({
      result: AuthorizeResult.DENY,
    }));

    const rendered = await render();
    expect(rendered.queryByTitle('Remove from playlist')).toBeNull();
    expect(rendered.queryByTitle('Add entities to playlist')).toBeNull();
  });

  it('removes a entity correctly', async () => {
    const rendered = await render();

    const removeButtons = rendered.getAllByTitle('Remove from playlist');
    act(() => {
      fireEvent.click(removeButtons[0]);
    });

    await waitFor(() => {
      expect(playlistApi.removePlaylistEntities).toHaveBeenCalledWith(
        'playlist-id',
        ['system:default/test-ent'],
      );
    });
  });

  it('adds an entity correctly', async () => {
    const rendered = await render();

    expect(rendered.queryByTestId('mock-add-entities-drawer')).toBeNull();

    act(() => {
      fireEvent.click(rendered.getByTitle('Add entities to playlist'));
    });

    expect(
      rendered.getByTestId('mock-add-entities-drawer'),
    ).toBeInTheDocument();

    act(() => {
      fireEvent.click(rendered.getByTestId('mock-add-entities-drawer'));
    });

    await waitFor(() => {
      expect(playlistApi.addPlaylistEntities).toHaveBeenCalledWith(
        'playlist-id',
        ['api:test/my-ent'],
      );
    });
  });
});
