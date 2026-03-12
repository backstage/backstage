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

import {
  ApiEntityV1alpha2,
  apiEntityV1alpha2Validator as validator,
} from './ApiEntityV1alpha2';

describe('ApiV1alpha2Validator', () => {
  describe('standard API types', () => {
    let entity: ApiEntityV1alpha2;

    beforeEach(() => {
      entity = {
        apiVersion: 'backstage.io/v1alpha2',
        kind: 'API',
        metadata: {
          name: 'test',
        },
        spec: {
          type: 'openapi',
          lifecycle: 'production',
          owner: 'me',
          definition: 'openapi: "3.0.0"\ninfo:\n  title: Test',
          system: 'system',
        },
      };
    });

    it('accepts valid data', async () => {
      await expect(validator.check(entity)).resolves.toBe(true);
    });

    it('ignores v1alpha1 apiVersion', async () => {
      (entity as any).apiVersion = 'backstage.io/v1alpha1';
      await expect(validator.check(entity)).resolves.toBe(false);
    });

    it('ignores v1beta1 apiVersion', async () => {
      (entity as any).apiVersion = 'backstage.io/v1beta1';
      await expect(validator.check(entity)).resolves.toBe(false);
    });

    it('ignores unknown kind', async () => {
      (entity as any).kind = 'Wizard';
      await expect(validator.check(entity)).resolves.toBe(false);
    });

    it('rejects missing type', async () => {
      delete (entity as any).spec.type;
      await expect(validator.check(entity)).rejects.toThrow(/type/);
    });

    it('rejects empty type', async () => {
      (entity as any).spec.type = '';
      await expect(validator.check(entity)).rejects.toThrow(/type/);
    });

    it('rejects missing lifecycle', async () => {
      delete (entity as any).spec.lifecycle;
      await expect(validator.check(entity)).rejects.toThrow(/lifecycle/);
    });

    it('rejects missing owner', async () => {
      delete (entity as any).spec.owner;
      await expect(validator.check(entity)).rejects.toThrow(/owner/);
    });

    it('rejects missing definition for non-mcp-server types', async () => {
      delete (entity as any).spec.definition;
      await expect(validator.check(entity)).rejects.toThrow(/definition/);
    });

    it('rejects empty definition', async () => {
      (entity as any).spec.definition = '';
      await expect(validator.check(entity)).rejects.toThrow(/definition/);
    });

    it('accepts missing system', async () => {
      delete (entity as any).spec.system;
      await expect(validator.check(entity)).resolves.toBe(true);
    });
  });

  describe('mcp-server type', () => {
    let entity: ApiEntityV1alpha2;

    beforeEach(() => {
      entity = {
        apiVersion: 'backstage.io/v1alpha2',
        kind: 'API',
        metadata: {
          name: 'test-mcp',
        },
        spec: {
          type: 'mcp-server',
          lifecycle: 'experimental',
          owner: 'me',
          remotes: [
            {
              type: 'streamable-http',
              url: 'http://localhost:7007/api/mcp',
            },
          ],
        },
      };
    });

    it('accepts valid mcp-server entity', async () => {
      await expect(validator.check(entity)).resolves.toBe(true);
    });

    it('accepts mcp-server entity with multiple remotes', async () => {
      (entity as any).spec.remotes = [
        { type: 'streamable-http', url: 'http://localhost:7007/api/mcp' },
        { type: 'sse', url: 'http://localhost:7007/api/mcp-sse' },
      ];
      await expect(validator.check(entity)).resolves.toBe(true);
    });

    it('does not require definition for mcp-server type', async () => {
      expect((entity.spec as any).definition).toBeUndefined();
      await expect(validator.check(entity)).resolves.toBe(true);
    });

    it('rejects mcp-server entity without remotes', async () => {
      delete (entity as any).spec.remotes;
      await expect(validator.check(entity)).rejects.toThrow(/remotes/);
    });

    it('rejects mcp-server entity with empty remotes array', async () => {
      (entity as any).spec.remotes = [];
      await expect(validator.check(entity)).rejects.toThrow(/remotes/);
    });

    it('rejects mcp-server remote missing type', async () => {
      (entity as any).spec.remotes = [{ url: 'http://localhost' }];
      await expect(validator.check(entity)).rejects.toThrow(/type/);
    });

    it('rejects mcp-server remote missing url', async () => {
      (entity as any).spec.remotes = [{ type: 'streamable-http' }];
      await expect(validator.check(entity)).rejects.toThrow(/url/);
    });

    it('rejects mcp-server remote with empty type', async () => {
      (entity as any).spec.remotes = [{ type: '', url: 'http://localhost' }];
      await expect(validator.check(entity)).rejects.toThrow(/type/);
    });

    it('rejects mcp-server remote with empty url', async () => {
      (entity as any).spec.remotes = [{ type: 'streamable-http', url: '' }];
      await expect(validator.check(entity)).rejects.toThrow(/url/);
    });
  });
});
