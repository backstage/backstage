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

import { NotImplementedError } from '@backstage/errors';
import { defaultCatalogEntityModel } from '../defaultCatalogEntityModel';
import { StaticCatalogModelSource } from './StaticCatalogModelSource';
import { CatalogModelSource } from './types';
import { CatalogModelLayer } from '../types';
import uniqBy from 'lodash/uniqBy';

/**
 * A helper for creating common catalog model sources.
 *
 * @alpha
 */
export class CatalogModelSources {
  /**
   * Provides the default catalog model.
   */
  static default(): CatalogModelSource {
    return CatalogModelSources.static([]);
  }

  /**
   * Provides a static catalog model on top of the default one (which is
   * included automatically). User-provided layers take precedence over the
   * default model when layer IDs overlap.
   */
  static static(layers: CatalogModelLayer[]): CatalogModelSource {
    return new StaticCatalogModelSource(
      uniqBy([...layers, defaultCatalogEntityModel], 'layerId'),
    );
  }

  private constructor() {
    throw new NotImplementedError();
  }
}
