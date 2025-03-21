/*
 * Copyright 2021 The Backstage Authors
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

import fs from 'fs-extra';

jest.mock('fs-extra');

const fsMock = fs as jest.Mocked<typeof fs>;

import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { createCatalogWriteAction } from './write';
import { resolve as resolvePath } from 'path';
import * as yaml from 'yaml';
import { examples } from './write.examples';
import os from 'os';

describe('catalog:write', () => {
  const action = createCatalogWriteAction();
  const mockContext = createMockActionContext({ workspacePath: os.tmpdir() });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should write the catalog-info.yml in the workspace', async () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test',
        annotations: {},
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
        owner: 'default/owner',
      },
    };

    await action.handler({
      ...mockContext,
      input: yaml.parse(examples[0].example).steps[0].input,
    });

    expect(fsMock.outputFile).toHaveBeenCalledTimes(1);
    expect(fsMock.outputFile).toHaveBeenCalledWith(
      resolvePath(mockContext.workspacePath, 'catalog-info.yaml'),
      yaml.stringify(entity),
    );
  });
});
