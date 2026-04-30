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

import { ConfigReader } from '@backstage/config';
import { GeneratorRegistry } from './generatorRegistry';
import { GeneratorBase } from './types';

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  child: jest.fn().mockReturnThis(),
};

const mockEntity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: { name: 'test-component' },
};

describe('GeneratorRegistry', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const logger = mockLogger as any;

  describe('register', () => {
    it('should register a generator factory', () => {
      const config = new ConfigReader({
        techdocs: { generator: { type: 'custom-generator' } },
      });
      const registry = GeneratorRegistry.fromConfig(config, { logger });

      const mockGenerator: GeneratorBase = { run: jest.fn() };
      registry.register('custom-generator', () => mockGenerator);

      expect(registry.get(mockEntity)).toBe(mockGenerator);
    });

    it('should throw when registering duplicate type', () => {
      const config = new ConfigReader({
        techdocs: { generator: {} },
      });
      const registry = GeneratorRegistry.fromConfig(config, { logger });

      const mockGenerator: GeneratorBase = { run: jest.fn() };
      registry.register('techdocs-mkdocs', () => mockGenerator);

      expect(() => {
        registry.register('techdocs-mkdocs', () => mockGenerator);
      }).toThrow("Generator type 'techdocs-mkdocs' is already registered");
    });
  });

  describe('get', () => {
    it('should return the generator for the configured type', () => {
      const config = new ConfigReader({
        techdocs: { generator: { type: 'techdocs-zensical' } },
      });
      const registry = GeneratorRegistry.fromConfig(config, { logger });

      const mockGenerator: GeneratorBase = { run: jest.fn() };
      registry.register('techdocs-zensical', () => mockGenerator);

      expect(registry.get(mockEntity)).toBe(mockGenerator);
    });

    it('should default to techdocs-mkdocs when type is not configured', () => {
      const config = new ConfigReader({
        techdocs: { generator: {} },
      });
      const registry = GeneratorRegistry.fromConfig(config, { logger });

      const mockGenerator: GeneratorBase = { run: jest.fn() };
      registry.register('techdocs-mkdocs', () => mockGenerator);

      expect(registry.get(mockEntity)).toBe(mockGenerator);
    });

    it('should cache generator instances', () => {
      const config = new ConfigReader({
        techdocs: { generator: { type: 'techdocs-mkdocs' } },
      });
      const registry = GeneratorRegistry.fromConfig(config, { logger });

      const factory = jest.fn().mockReturnValue({ run: jest.fn() });
      registry.register('techdocs-mkdocs', factory);

      const first = registry.get(mockEntity);
      const second = registry.get(mockEntity);

      expect(first).toBe(second);
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should pass config and options to factory', () => {
      const config = new ConfigReader({
        techdocs: { generator: { type: 'techdocs-mkdocs' } },
      });
      const mockContainerRunner = { runContainer: jest.fn() };
      const registry = GeneratorRegistry.fromConfig(config, {
        logger,
        containerRunner: mockContainerRunner,
      });

      const factory = jest.fn().mockReturnValue({ run: jest.fn() });
      registry.register('techdocs-mkdocs', factory);

      registry.get(mockEntity);

      expect(factory).toHaveBeenCalledWith({
        config,
        logger,
        containerRunner: mockContainerRunner,
      });
    });

    it('should throw when generator type is not registered', () => {
      const config = new ConfigReader({
        techdocs: { generator: { type: 'unknown-generator' } },
      });
      const registry = GeneratorRegistry.fromConfig(config, { logger });

      expect(() => registry.get(mockEntity)).toThrow(
        "No generator registered for type 'unknown-generator'. Registered types: none",
      );
    });

    it('should list registered types in error message', () => {
      const config = new ConfigReader({
        techdocs: { generator: { type: 'unknown-generator' } },
      });
      const registry = GeneratorRegistry.fromConfig(config, { logger });

      registry.register('techdocs-mkdocs', () => ({ run: jest.fn() }));
      registry.register('techdocs-zensical', () => ({ run: jest.fn() }));

      expect(() => registry.get(mockEntity)).toThrow(
        "No generator registered for type 'unknown-generator'. Registered types: techdocs-mkdocs, techdocs-zensical",
      );
    });
  });

  describe('fromConfig', () => {
    it('should create a registry instance', () => {
      const config = new ConfigReader({
        techdocs: { generator: {} },
      });
      const registry = GeneratorRegistry.fromConfig(config, { logger });

      expect(registry).toBeInstanceOf(GeneratorRegistry);
    });
  });
});
