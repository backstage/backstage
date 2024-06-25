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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { Generators } from './generators';
import { TechdocsGenerator } from './techdocs';
import { mockServices } from '@backstage/backend-test-utils';

const logger = loggerToWinstonLogger(mockServices.logger.mock());

const mockEntity = {
  apiVersion: 'version',
  kind: 'TestKind',
  metadata: {
    name: 'testName',
  },
};

describe('generators', () => {
  it('should return error if no generator is registered', async () => {
    const generators = new Generators();

    expect(() => generators.get(mockEntity)).toThrow(
      'No generator registered for entity: "techdocs"',
    );
  });

  it('should return correct registered generator', async () => {
    const generators = new Generators();
    const techdocs = TechdocsGenerator.fromConfig(new ConfigReader({}), {
      logger,
    });

    generators.register('techdocs', techdocs);

    expect(generators.get(mockEntity)).toBe(techdocs);
  });
});
