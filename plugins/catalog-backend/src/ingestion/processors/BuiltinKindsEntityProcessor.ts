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
  apiEntityV1alpha1Validator,
  componentEntityV1alpha1Validator,
  Entity,
  groupEntityV1alpha1Validator,
  locationEntityV1alpha1Validator,
  templateEntityV1alpha1Validator,
  userEntityV1alpha1Validator,
} from '@backstage/catalog-model';
import { CatalogProcessor } from './types';

export class BuiltinKindsEntityProcessor implements CatalogProcessor {
  private readonly validators = [
    apiEntityV1alpha1Validator,
    componentEntityV1alpha1Validator,
    groupEntityV1alpha1Validator,
    locationEntityV1alpha1Validator,
    templateEntityV1alpha1Validator,
    userEntityV1alpha1Validator,
  ];

  async validateEntityKind(entity: Entity): Promise<boolean> {
    for (const validator of this.validators) {
      const result = await validator.check(entity);
      if (result) {
        return true;
      }
    }

    return false;
  }
}
