/*
 * Copyright 2020 Spotify AB
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
import { Logger } from 'winston';
import { getGeneratorKey } from './helpers';
import { TechdocsGenerator } from './techdocs';
import {
  GeneratorBase,
  GeneratorBuilder,
  SupportedGeneratorKey,
} from './types';

export class Generators implements GeneratorBuilder {
  private generatorMap = new Map<SupportedGeneratorKey, GeneratorBase>();

  static async fromConfig(
    config: Config,
    { logger }: { logger: Logger },
  ): Promise<GeneratorBuilder> {
    const generators = new Generators();

    const techdocsGenerator = new TechdocsGenerator(logger, config);
    generators.register('techdocs', techdocsGenerator);

    return generators;
  }

  register(generatorKey: SupportedGeneratorKey, generator: GeneratorBase) {
    this.generatorMap.set(generatorKey, generator);
  }

  get(entity: Entity): GeneratorBase {
    const generatorKey = getGeneratorKey(entity);
    const generator = this.generatorMap.get(generatorKey);

    if (!generator) {
      throw new Error(`No generator registered for entity: "${generatorKey}"`);
    }

    return generator;
  }
}
