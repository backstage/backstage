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

import { ContainerRunner } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { Logger } from 'winston';
import { getGeneratorKey } from './helpers';
import { TechdocsGenerator } from './techdocs';
import {
  GeneratorBase,
  GeneratorBuilder,
  SupportedGeneratorKey,
} from './types';

/**
 * Collection of docs generators
 * @public
 */
export class Generators implements GeneratorBuilder {
  private generatorMap = new Map<SupportedGeneratorKey, GeneratorBase>();

  /**
   * Returns a generators instance containing a generator for TechDocs
   * @param config - A Backstage configuration
   * @param options - Options to configure the TechDocs generator
   */
  static async fromConfig(
    config: Config,
    options: { logger: Logger; containerRunner: ContainerRunner },
  ): Promise<GeneratorBuilder> {
    const generators = new Generators();

    const techdocsGenerator = TechdocsGenerator.fromConfig(config, options);
    generators.register('techdocs', techdocsGenerator);

    return generators;
  }

  /**
   * Register a generator in the generators collection
   * @param generatorKey - Unique identifier for the generator
   * @param generator - The generator instance to register
   */
  register(generatorKey: SupportedGeneratorKey, generator: GeneratorBase) {
    this.generatorMap.set(generatorKey, generator);
  }

  /**
   * Returns the generator for a given TechDocs entity
   * @param entity - A TechDocs entity instance
   */
  get(entity: Entity): GeneratorBase {
    const generatorKey = getGeneratorKey(entity);
    const generator = this.generatorMap.get(generatorKey);

    if (!generator) {
      throw new Error(`No generator registered for entity: "${generatorKey}"`);
    }

    return generator;
  }
}
