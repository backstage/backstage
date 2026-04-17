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

import { apiEntityModel } from '../kinds/ApiEntityV1alpha1';
import { componentEntityModel } from '../kinds/ComponentEntityV1alpha1';
import { domainEntityModel } from '../kinds/DomainEntityV1alpha1';
import { groupEntityModel } from '../kinds/GroupEntityV1alpha1';
import { locationEntityModel } from '../kinds/LocationEntityV1alpha1';
import { resourceEntityModel } from '../kinds/ResourceEntityV1alpha1';
import { systemEntityModel } from '../kinds/SystemEntityV1alpha1';
import { userEntityModel } from '../kinds/UserEntityV1alpha1';
import { wellKnownAnnotationsModel } from '../kinds/annotations';
import { wellKnownRelationsModel } from '../kinds/relations';
import { createCatalogModelLayer } from './createCatalogModelLayer';

/**
 * The default catalog entity model, containing all built-in Backstage entity
 * kinds, relations, and annotations.
 *
 * @alpha
 */
export const defaultCatalogEntityModel = createCatalogModelLayer({
  layerId: 'catalog.backstage.io/default-entity-model',
  builder: model => {
    model.import(apiEntityModel);
    model.import(componentEntityModel);
    model.import(domainEntityModel);
    model.import(groupEntityModel);
    model.import(locationEntityModel);
    model.import(resourceEntityModel);
    model.import(systemEntityModel);
    model.import(userEntityModel);
    model.import(wellKnownRelationsModel);
    model.import(wellKnownAnnotationsModel);
  },
});
