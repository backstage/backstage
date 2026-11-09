/*
 * Copyright 2026 The Backstage Authors
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

import { createBackendModule } from '@backstage/backend-plugin-api';
import { startTestBackend } from '@backstage/backend-test-utils';
import {
  GeneratorBase,
  techdocsGeneratorExtensionPoint,
} from '@backstage/plugin-techdocs-node';
import { techdocsPlugin } from './plugin';

const generator: GeneratorBase = { run: jest.fn() };

const moduleRegistering = (key: string) =>
  createBackendModule({
    pluginId: 'techdocs',
    moduleId: `test-${key}`,
    register(env) {
      env.registerInit({
        deps: { generators: techdocsGeneratorExtensionPoint },
        async init({ generators }) {
          generators.registerGenerator(key, generator);
        },
      });
    },
  });

describe('techdocsPlugin', () => {
  it.each(['mkdocs', 'techdocs'])(
    'rejects registerGenerator for the built-in "%s" engine',
    async key => {
      await expect(
        startTestBackend({
          features: [techdocsPlugin, moduleRegistering(key)],
        }),
      ).rejects.toThrow(
        `Cannot register a generator for the built-in "${key}" engine; use setTechdocsGenerator to replace the default MkDocs generator`,
      );
    },
  );
});
