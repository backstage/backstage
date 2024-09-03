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

import {
  defaultOrganizationTransformer,
  defaultGroupTransformer,
  defaultUserTransformer,
} from './defaultTransformers';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

describe('defaultTransformers', () => {
  it('tests defaultOrganizationTransformer', async () => {
    const organization: MicrosoftGraph.Organization = {
      id: 'foo',
      displayName: 'BAR',
    };
    const result = await defaultOrganizationTransformer(organization);
    expect(result).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        annotations: { 'graph.microsoft.com/tenant-id': 'foo' },
        description: 'BAR',
        name: 'bar',
      },
      spec: { children: [], profile: { displayName: 'BAR' }, type: 'root' },
    });
  });

  it('tests defaultGroupTransformer', async () => {
    const group: MicrosoftGraph.Group = {
      id: 'foo',
      displayName: 'BAR',
    };
    const groupPhoto = 'test_photo';
    const result = await defaultGroupTransformer(group, groupPhoto);
    expect(result).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Group',
      metadata: {
        annotations: { 'graph.microsoft.com/group-id': 'foo' },
        name: 'bar',
      },
      spec: {
        children: [],
        profile: { displayName: 'BAR', picture: 'test_photo' },
        type: 'team',
      },
    });
  });

  it('tests defaultUserTransformer', async () => {
    const user: MicrosoftGraph.User = {
      id: 'foo',
      displayName: 'BAR',
      mail: 'test@outlook.com',
    };
    const userPhoto = 'test_photo';
    const result = await defaultUserTransformer(user, userPhoto);
    expect(result).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'graph.microsoft.com/user-id': 'foo',
          'microsoft.com/email': 'test@outlook.com',
        },
        name: 'test_outlook.com',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'BAR',
          email: 'test@outlook.com',
          picture: 'test_photo',
        },
      },
    });
  });

  it('tests defaultUserTransformer with no email', async () => {
    const user: MicrosoftGraph.User = {
      id: 'foo',
      displayName: 'BAR',
      userPrincipalName: 'test@upn',
    };
    const userPhoto = 'test_photo';
    const result = await defaultUserTransformer(user, userPhoto);
    expect(result).toEqual({
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        annotations: {
          'graph.microsoft.com/user-id': 'foo',
        },
        name: 'test_upn',
      },
      spec: {
        memberOf: [],
        profile: {
          displayName: 'BAR',
          picture: 'test_photo',
        },
      },
    });
  });
});
