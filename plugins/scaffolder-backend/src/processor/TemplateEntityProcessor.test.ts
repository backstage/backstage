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

import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { TemplateEntityProcessor } from './TemplateEntityProcessor';

const mockLocation = { type: 'a', target: 'b' };
const mockEntity: TemplateEntityV1beta3 = {
  apiVersion: 'templates.backstage.io/v1beta3',
  kind: 'Template',
  metadata: { name: 'n' },
  spec: {
    parameters: {},
    steps: [],
    type: 'service',
    owner: 'o',
  },
};

describe('TemplateEntityProcessor', () => {
  describe('validateEntityKind', () => {
    it('validates the entity kind', async () => {
      const processor = new TemplateEntityProcessor();

      await expect(processor.validateEntityKind(mockEntity)).resolves.toBe(
        true,
      );
      await expect(
        processor.validateEntityKind({
          ...mockEntity,
          apiVersion: 'backstage.io/v1beta3',
        }),
      ).resolves.toBe(false);
      await expect(
        processor.validateEntityKind({ ...mockEntity, kind: 'Component' }),
      ).resolves.toBe(false);
    });
  });

  describe('postProcessEntity', () => {
    it('generates relations for component entities', async () => {
      const processor = new TemplateEntityProcessor();

      const emit = jest.fn();

      await processor.postProcessEntity(mockEntity, mockLocation, emit);

      expect(emit).toBeCalledTimes(2);
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Group', namespace: 'default', name: 'o' },
          type: 'ownerOf',
          target: { kind: 'Template', namespace: 'default', name: 'n' },
        },
      });
      expect(emit).toBeCalledWith({
        type: 'relation',
        relation: {
          source: { kind: 'Template', namespace: 'default', name: 'n' },
          type: 'ownedBy',
          target: { kind: 'Group', namespace: 'default', name: 'o' },
        },
      });
    });
  });
});
