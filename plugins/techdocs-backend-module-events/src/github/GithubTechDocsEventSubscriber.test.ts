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
import {
  AZURE_DEVOPS_TOPIC_REPO_PUSH,
  GITHUB_TOPIC_REPO_PUSH,
} from '../constants';
import { ServerTokenManager, getVoidLogger } from '@backstage/backend-common';
import { getMatchingEntities, triggerTechDocsRefresh } from '../utils';

import { CatalogApi } from '@backstage/catalog-client';
import { ConfigReader } from '@backstage/config';
import { Entity } from '@backstage/catalog-model';
import { EventParams } from '@backstage/plugin-events-node';
import { GithubTechDocsEventSubscriber } from './GithubTechDocsEventSubscriber';

jest.mock('../utils');
const mockedGetMatchedEntities = getMatchingEntities as jest.MockedFunction<
  typeof getMatchingEntities
>;
const mockedTriggerTechDocsRefresh =
  triggerTechDocsRefresh as jest.MockedFunction<typeof triggerTechDocsRefresh>;

describe('GithubTechDocsEventSubscriber', () => {
  const config = new ConfigReader({
    backend: {
      baseUrl: 'http://some/fake/location',
    },
  });
  const logger = getVoidLogger();
  const catalogClient: jest.Mocked<CatalogApi> = {
    getEntities: jest.fn(),
    getEntityByRef: jest.fn(),
  } as any;

  const tokenManager = ServerTokenManager.noop();

  const subscriber = GithubTechDocsEventSubscriber.fromConfig(config, {
    logger,
    tokenManager,
    catalogClient,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`should only support the ${GITHUB_TOPIC_REPO_PUSH} topic`, async () => {
    const support = subscriber.supportsEventTopics();
    expect(support).toEqual([GITHUB_TOPIC_REPO_PUSH]);
  });

  it(`should handle the ${GITHUB_TOPIC_REPO_PUSH} topic`, async () => {
    const entities: Entity[] = [];
    mockedGetMatchedEntities.mockResolvedValue(entities);

    const event: EventParams = {
      topic: GITHUB_TOPIC_REPO_PUSH,
      eventPayload: {
        ref: 'refs/heads/main',
        repository: {
          name: 'github',
          owner: {
            name: 'project',
          },
        },
      },
    };

    await subscriber.onEvent(event);
    expect(mockedGetMatchedEntities).toHaveBeenCalled();
  });

  it(`should not handle other topics`, async () => {
    const event: EventParams = {
      topic: AZURE_DEVOPS_TOPIC_REPO_PUSH,
      eventPayload: {},
    };

    await subscriber.onEvent(event);
    expect(mockedGetMatchedEntities).not.toHaveBeenCalled();
  });

  it(`should only refresh for main ref`, async () => {
    const entities: Entity[] = [];
    mockedGetMatchedEntities.mockResolvedValue(entities);

    const event: EventParams = {
      topic: GITHUB_TOPIC_REPO_PUSH,
      eventPayload: {
        repository: {
          name: 'github',
          owner: {
            name: 'project',
          },
        },
      },
    };

    await subscriber.onEvent(event);
    expect(mockedGetMatchedEntities).not.toHaveBeenCalled();
  });

  it(`should trigger TechDocs refresh`, async () => {
    const entities: Entity[] = [
      {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: 'test-component',
          namespace: 'default',
        },
        spec: {
          owner: 'Test',
        },
      },
    ];
    mockedGetMatchedEntities.mockResolvedValue(entities);

    const event: EventParams = {
      topic: GITHUB_TOPIC_REPO_PUSH,
      eventPayload: {
        ref: 'refs/heads/main',
        repository: {
          name: 'github',
          owner: {
            name: 'project',
          },
        },
      },
    };

    await subscriber.onEvent(event);
    expect(mockedGetMatchedEntities).toHaveBeenCalled();
    expect(mockedTriggerTechDocsRefresh).toHaveBeenCalled();
  });
});
