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

import { getVoidLogger } from '@backstage/backend-common';
import { GroupEntity, UserEntity } from '@backstage/catalog-model';
import { MicrosoftGraphClient, readMicrosoftGraphOrg } from '../microsoftGraph';
import { MicrosoftGraphOrgReaderProcessor } from './MicrosoftGraphOrgReaderProcessor';

jest.mock('../microsoftGraph', () => {
  return {
    ...jest.requireActual('../microsoftGraph'),
    readMicrosoftGraphOrg: jest.fn(),
  };
});

const readMicrosoftGraphOrgMocked = readMicrosoftGraphOrg as jest.Mock<
  Promise<{ users: UserEntity[]; groups: GroupEntity[] }>
>;

describe('MicrosoftGraphOrgReaderProcessor', () => {
  const emit = jest.fn();
  let processor: MicrosoftGraphOrgReaderProcessor;

  beforeEach(() => {
    processor = new MicrosoftGraphOrgReaderProcessor({
      providers: [
        {
          target: 'https://example.com',
          tenantId: 'tenant',
          clientId: 'clientid',
          clientSecret: 'clientsecret',
        },
      ],
      logger: getVoidLogger(),
    });

    jest
      .spyOn(MicrosoftGraphClient, 'create')
      .mockReturnValue({} as unknown as MicrosoftGraphClient);
  });

  afterEach(() => jest.resetAllMocks());

  it('should process microsoft-graph-org locations', async () => {
    const location = {
      type: 'microsoft-graph-org',
      target: 'https://example.com',
    };

    readMicrosoftGraphOrgMocked.mockResolvedValue({
      users: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: {
            name: 'u1',
          },
          spec: {
            memberOf: [],
          },
        },
      ],
      groups: [
        {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Group',
          metadata: {
            name: 'g1',
          },
          spec: {
            type: 'team',
            children: [],
          },
        },
      ],
    });

    const processed = await processor.readLocation(location, false, emit);

    expect(processed).toBe(true);
    expect(emit).toBeCalledTimes(2);
    expect(emit).toBeCalledWith({
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Group',
        metadata: {
          name: 'g1',
        },
        spec: {
          children: [],
          type: 'team',
        },
      },
      location: {
        target: 'https://example.com',
        type: 'microsoft-graph-org',
      },
      type: 'entity',
    });
    expect(emit).toBeCalledWith({
      entity: {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'User',
        metadata: {
          name: 'u1',
        },
        spec: {
          memberOf: [],
        },
      },
      location: {
        target: 'https://example.com',
        type: 'microsoft-graph-org',
      },
      type: 'entity',
    });
  });

  it('should ignore other locations', async () => {
    const location = {
      type: 'url',
      target: 'https://example.com',
    };

    const processed = await processor.readLocation(location, false, emit);

    expect(processed).toBe(false);
    expect(emit).toBeCalledTimes(0);
  });
});
