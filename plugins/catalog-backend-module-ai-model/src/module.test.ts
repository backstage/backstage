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

import { startTestBackend } from '@backstage/backend-test-utils';
import { catalogModelExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { catalogModuleAiResourceEntityModel } from './module';

describe('catalogModuleAiResourceEntityModel', () => {
  it('should register the model source', async () => {
    const extensionPoint = {
      setFieldValidators: jest.fn(),
      setEntityDataParser: jest.fn(),
      addModelSource: jest.fn(),
    };

    await startTestBackend({
      extensionPoints: [[catalogModelExtensionPoint, extensionPoint]],
      features: [catalogModuleAiResourceEntityModel],
    });

    expect(extensionPoint.addModelSource).toHaveBeenCalledTimes(1);
  });
});
