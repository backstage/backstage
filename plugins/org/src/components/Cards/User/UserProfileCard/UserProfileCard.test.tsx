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

import { UserEntity } from '@backstage/catalog-model';
import {
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { UserProfileCard } from './UserProfileCard';
import { screen } from '@testing-library/react';

describe('UserSummary Test', () => {
  const userEntity: UserEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: 'calum.leavy',
      description: 'Super awesome human',
    },
    spec: {
      profile: {
        displayName: 'Calum Leavy',
        email: 'calum-leavy@example.com',
        picture: 'https://example.com/staff/calum.jpeg',
      },
      memberOf: ['ExampleGroup'],
    },
    relations: [
      {
        type: 'memberOf',
        targetRef: 'group:default/examplegroup',
      },
    ],
  };

  it('Display Profile Card', async () => {
    await renderInTestApp(
      <EntityProvider entity={userEntity}>
        <UserProfileCard variant="gridItem" />
      </EntityProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('calum-leavy@example.com')).toBeInTheDocument();
    expect(screen.getByAltText('Calum Leavy')).toHaveAttribute(
      'src',
      'https://example.com/staff/calum.jpeg',
    );
    expect(screen.getByText('examplegroup').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/group/examplegroup',
    );
    expect(screen.getByText('Super awesome human')).toBeInTheDocument();
  });
});

describe('Edit Button', () => {
  it('Should not be present by default', async () => {
    const userEntity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'calum.leavy',
        description: 'Super awesome human',
      },
      spec: {
        profile: {
          displayName: 'Calum Leavy',
          email: 'calum-leavy@example.com',
        },
        memberOf: ['ExampleGroup'],
      },
      relations: [
        {
          type: 'memberOf',
          targetRef: 'group:default/examplegroup',
        },
      ],
    };

    await renderInTestApp(
      <EntityProvider entity={userEntity}>
        <UserProfileCard variant="gridItem" />
      </EntityProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.queryByTitle('Edit Metadata')).not.toBeInTheDocument();
  });

  it('Should be visible when edit URL annotation is present', async () => {
    const annotations: Record<string, string> = {
      'backstage.io/edit-url': 'https://example.com/user.yaml',
    };
    const userEntity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'calum.leavy',
        description: 'Super awesome human',
        annotations,
      },
      spec: {
        profile: {
          displayName: 'Calum Leavy',
          email: 'calum-leavy@example.com',
        },
        memberOf: ['ExampleGroup'],
      },
      relations: [
        {
          type: 'memberOf',
          targetRef: 'group:default/examplegroup',
        },
      ],
    };

    await renderInTestApp(
      <EntityProvider entity={userEntity}>
        <UserProfileCard variant="gridItem" />
      </EntityProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('Should not show links by default', async () => {
    const annotations: Record<string, string> = {
      'backstage.io/edit-url': 'https://example.com/user.yaml',
    };
    const userEntity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'calum.leavy',
        description: 'Super awesome human',
        annotations,
        links: [
          {
            url: 'slack://user?team=T00000000&id=U00000000',
            title: 'Slack',
            icon: 'message',
          },
          {
            url: 'https://www.google.com',
            title: 'Google',
          },
        ],
      },
      spec: {
        profile: {
          displayName: 'Calum Leavy',
          email: 'calum-leavy@example.com',
        },
        memberOf: ['ExampleGroup'],
      },
      relations: [
        {
          type: 'memberOf',
          targetRef: 'group:default/examplegroup',
        },
      ],
    };

    await renderInTestApp(
      <EntityProvider entity={userEntity}>
        <UserProfileCard variant="gridItem" />
      </EntityProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.queryByText('Slack')).toBeNull();
    expect(screen.queryByText('Google')).toBeNull();
  });

  it('Should show the links if showLinks is set', async () => {
    const annotations: Record<string, string> = {
      'backstage.io/edit-url': 'https://example.com/user.yaml',
    };
    const userEntity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'calum.leavy',
        description: 'Super awesome human',
        annotations,
        links: [
          {
            url: 'slack://user?team=T00000000&id=U00000000',
            title: 'Slack',
            icon: 'message',
          },
          {
            url: 'https://www.google.com',
            title: 'Google',
          },
        ],
      },
      spec: {
        profile: {
          displayName: 'Calum Leavy',
          email: 'calum-leavy@example.com',
        },
        memberOf: ['ExampleGroup'],
      },
      relations: [
        {
          type: 'memberOf',
          targetRef: 'group:default/examplegroup',
        },
      ],
    };

    await renderInTestApp(
      <EntityProvider entity={userEntity}>
        <UserProfileCard showLinks variant="gridItem" />
      </EntityProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('Slack')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
  });
});
