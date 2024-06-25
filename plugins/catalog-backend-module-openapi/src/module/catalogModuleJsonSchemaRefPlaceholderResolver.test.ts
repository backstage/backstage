/*
 * Copyright 2024 The Backstage Authors
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

import { startTestBackend } from '@backstage/backend-test-utils';
import { PlaceholderResolver } from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { catalogModuleJsonSchemaRefPlaceholderResolver } from './catalogModuleJsonSchemaRefPlaceholderResolver';
import { jsonSchemaRefPlaceholderResolver } from '../jsonSchemaRefPlaceholderResolver';

describe('catalogModuleJsonSchemaRefPlaceholderResolver', () => {
  it('should register provider at the catalog extension point', async () => {
    const registeredPlaceholderResolvers: {
      [key: string]: PlaceholderResolver;
    } = {};

    const extensionPoint = {
      addPlaceholderResolver: (
        key: string,
        resolver: PlaceholderResolver,
      ): void => {
        registeredPlaceholderResolvers[key] = resolver;
      },
    };

    await startTestBackend({
      extensionPoints: [[catalogProcessingExtensionPoint, extensionPoint]],
      features: [catalogModuleJsonSchemaRefPlaceholderResolver],
    });

    expect(Object.keys(registeredPlaceholderResolvers)).toEqual([
      'asyncapi',
      'openapi',
    ]);
    expect(registeredPlaceholderResolvers.asyncapi).toBe(
      jsonSchemaRefPlaceholderResolver,
    );
    expect(registeredPlaceholderResolvers.openapi).toBe(
      jsonSchemaRefPlaceholderResolver,
    );
  });
});
