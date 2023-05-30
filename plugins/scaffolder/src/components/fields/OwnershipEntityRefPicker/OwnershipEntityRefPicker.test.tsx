/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { CatalogApi } from '@backstage/catalog-client';
import { FieldProps } from '@rjsf/core';
import { OwnershipEntityRefPicker } from './OwnershipEntityRefPicker';
import { TestApiProvider } from '@backstage/test-utils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';
import userEvent from '@testing-library/user-event';

// Create a mock IdentityApi
const mockIdentityApi: IdentityApi = {
  getProfileInfo: () =>
    Promise.resolve({
      displayName: 'Bob',
      email: 'bob@example.com',
      picture: 'https://example.com/picture.jpg',
    }),
  getBackstageIdentity: () =>
    Promise.resolve({
      id: 'Bob',
      idToken: 'token',
      type: 'user',
      userEntityRef: 'user:default/Bob',
      ownershipEntityRefs: ['group:default/group1', 'group:default/group2'],
    }),
  getCredentials: () => Promise.resolve({ token: 'token' }),
  signOut: () => Promise.resolve(),
};

describe('<OwnershipEntityRefPicker />', () => {
  let entities: Entity[];
  const onChange = jest.fn();
  const schema = {};
  const required = false;

  const catalogApi: jest.Mocked<CatalogApi> = {
    getEntities: jest.fn(async () => ({ items: entities })),
  } as any;

  beforeEach(() => {
    entities = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group1' },
        spec: { members: ['Bob'] },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group2' },
        spec: { members: ['Bob'] },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: { name: 'group3' },
        spec: { members: ['Alice'] },
      },
    ];

    onChange.mockClear();
    catalogApi.getEntities.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should only return the groups a user is part of and not the groups a user is not part of', async () => {
    const userGroups = entities.filter(
      entity =>
        entity.spec &&
        Array.isArray(entity.spec.members) &&
        entity.spec.members.includes('Bob'),
    );

    catalogApi.getEntities.mockResolvedValue({ items: userGroups });

    const props = {
      onChange,
      schema,
      required,
    } as unknown as FieldProps<any>;

    render(
      <TestApiProvider
        apis={[
          [identityApiRef, mockIdentityApi],
          [catalogApiRef, catalogApi],
        ]}
      >
        <OwnershipEntityRefPicker {...props} />
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.getEntities).toHaveBeenCalledTimes(1),
    );

    expect(catalogApi.getEntities).toHaveBeenCalledWith({
      filter: {
        kind: ['Group'],
        'relations.hasMember': ['group:default/group1', 'group:default/group2'],
      },
    });

    // Check that getEntities was set up to return the correct data
    await expect(catalogApi.getEntities.mock.results[0].value).resolves.toEqual(
      {
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Group',
            metadata: { name: 'group1' },
            spec: { members: ['Bob'] },
          },
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Group',
            metadata: { name: 'group2' },
            spec: { members: ['Bob'] },
          },
        ],
      },
    );

    await expect(
      catalogApi.getEntities.mock.results[0].value,
    ).resolves.not.toEqual(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            metadata: { name: 'group3' },
          }),
        ]),
      }),
    );
  });

  it('should display the groups a user is part of and not display the groups a user is not part of', async () => {
    const userGroups = entities.filter(
      entity =>
        entity.spec &&
        Array.isArray(entity.spec.members) &&
        entity.spec.members.includes('Bob'),
    );
    catalogApi.getEntities.mockResolvedValue({ items: userGroups });

    const props = {
      onChange,
      schema,
      required,
    } as unknown as FieldProps<any>;

    const { queryByText, getByRole } = render(
      <TestApiProvider
        apis={[
          [identityApiRef, mockIdentityApi],
          [catalogApiRef, catalogApi],
        ]}
      >
        <OwnershipEntityRefPicker {...props} />
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(catalogApi.getEntities).toHaveBeenCalledTimes(1),
    );

    // Simulate user input
    const inputField = getByRole('combobox');
    userEvent.click(inputField);
    userEvent.type(inputField, 'group');

    // Wait for the dropdown elements to appear
    await waitFor(() => {
      const group1Element = queryByText('group1');
      const group2Element = queryByText('group2');
      expect(group1Element).toBeInTheDocument();
      expect(group2Element).toBeInTheDocument();
    });

    // Assert that 'group3' is not rendered in the component
    expect(queryByText('group3')).not.toBeInTheDocument();
  });
});
