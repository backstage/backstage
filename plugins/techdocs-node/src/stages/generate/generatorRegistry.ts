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

import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { LoggerService } from '@backstage/backend-plugin-api';
import {
  GeneratorBase,
  GeneratorFactory,
  TechDocsContainerRunner,
} from './types';

/**
 * Registry for TechDocs generators. Maps generator type names to factory functions
 * and manages generator instance creation.
 *
 * @public
 */
export class GeneratorRegistry {
  private factories = new Map<string, GeneratorFactory>();
  private instances = new Map<string, GeneratorBase>();
  private readonly configuredType: string;

  private constructor(
    private readonly config: Config,
    private readonly options: {
      logger: LoggerService;
      containerRunner?: TechDocsContainerRunner;
    },
  ) {
    this.configuredType =
      config.getOptionalString('techdocs.generator.type') ?? 'techdocs-mkdocs';
  }

  /**
   * Register a generator factory for a given type name.
   * @param type - The generator type identifier (e.g., 'techdocs-mkdocs', 'techdocs-zensical')
   * @param factory - Factory function that creates generator instances
   */
  register(type: string, factory: GeneratorFactory): void {
    if (this.factories.has(type)) {
      throw new Error(`Generator type '${type}' is already registered`);
    }
    this.factories.set(type, factory);
  }

  /**
   * Get a generator instance for the configured type.
   * Generator selection is config-driven; the entity parameter is preserved
   * for GeneratorBuilder interface compatibility but is not used for selection.
   *
   * @param _entity - Entity (unused, preserved for interface compatibility)
   * @returns Generator instance for the configured type
   */
  get(_entity: Entity): GeneratorBase {
    const type = this.configuredType;

    if (!this.instances.has(type)) {
      const factory = this.factories.get(type);
      if (!factory) {
        const registered = Array.from(this.factories.keys()).join(', ');
        throw new Error(
          `No generator registered for type '${type}'. Registered types: ${
            registered || 'none'
          }`,
        );
      }
      this.instances.set(
        type,
        factory({
          config: this.config,
          logger: this.options.logger,
          containerRunner: this.options.containerRunner,
        }),
      );
    }

    return this.instances.get(type)!;
  }

  /**
   * Create a GeneratorRegistry from config. Generators must be registered
   * separately via the register() method.
   *
   * @param config - Backstage configuration
   * @param options - Options including logger and optional container runner
   * @returns Empty GeneratorRegistry ready for generator registration
   */
  static fromConfig(
    config: Config,
    options: {
      logger: LoggerService;
      containerRunner?: TechDocsContainerRunner;
    },
  ): GeneratorRegistry {
    return new GeneratorRegistry(config, options);
  }
}
