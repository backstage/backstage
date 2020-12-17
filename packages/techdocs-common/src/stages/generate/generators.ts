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

import {
  GeneratorBase,
  SupportedGeneratorKey,
  GeneratorBuilder,
} from './types';

import { Entity } from '@backstage/catalog-model';
import { getGeneratorKey } from './helpers';

export class Generators implements GeneratorBuilder {
  private generatorMap = new Map<SupportedGeneratorKey, GeneratorBase>();

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
