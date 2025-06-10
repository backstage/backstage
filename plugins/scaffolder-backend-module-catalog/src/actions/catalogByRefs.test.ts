/*
 * Copyright 2025 The Backstage Authors
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

import type { SystemEntity } from '@backstage/catalog-model';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createCatalogByRefsAction } from './catalogByRefs.ts';

describe('catalogByRefs', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const catalog = catalogServiceMock.mock();
  const action = createCatalogByRefsAction({ catalog });

  const user = 'user:default/foobar';
  const output = jest.fn();

  const context = {
    ...createMockActionContext(),
    workspacePath: 'wsp',
    user: {
      ref: user,
    },
    output,
    createTemporaryDirectory: jest.fn(),
  };

  it('should call catalog', async () => {
    const ENTITY1: SystemEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'System',
      metadata: {
        name: 'example-system',
      },
      spec: {
        owner: 'john.doe',
      },
    };

    catalog.getEntitiesByRefs.mockResolvedValueOnce({
      items: [ENTITY1],
    });

    await expect(
      action.handler({
        ...context,
        input: {
          entityRefs: ['system:default/example-system'],
        },
      }),
    ).resolves.not.toThrow();

    expect(output).toHaveBeenCalledWith('entities', [ENTITY1]);
  });

  it('should handle exceptions', async () => {
    catalog.getEntitiesByRefs.mockRejectedValueOnce(
      new Error('Something happened!'),
    );

    await expect(
      action.handler({
        ...context,
        input: {
          entityRefs: ['system:default/example-system'],
        },
      }),
    ).rejects.toThrow();

    expect(output).not.toHaveBeenCalled();
  });
});
