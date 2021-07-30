/*
 * Copyright 2021 The Backstage Authors
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
import { JsonObject } from '@backstage/config';

export const deleteProperties = (clonedEntity: Entity) => {
  delete clonedEntity.metadata.uid;
  delete clonedEntity.metadata.generation;
  delete clonedEntity.metadata.etag;
  delete clonedEntity.relations;

  const annotationsToRemove: string[] = [
    'backstage.io/managed-by-location',
    'backstage.io/source-location',
    'backstage.io/view-url',
    'backstage.io/edit-url',
    'backstage.io/managed-by-origin-location',
  ];

  annotationsToRemove.forEach(url => {
    delete clonedEntity.metadata.annotations![url];
  });
  return clonedEntity;
};

const addBazaarProperties = (
  clonedEntity: Entity,
  bazaarDescription: string,
  status: string,
) => {
  if (clonedEntity.metadata.bazaar) {
    (clonedEntity?.metadata?.bazaar as JsonObject).bazaar_description =
      bazaarDescription;
    (clonedEntity?.metadata?.bazaar as JsonObject).status = status;
    (clonedEntity?.metadata?.bazaar as JsonObject).last_modified =
      new Date().toISOString();
  }
};

export const editBazaarProperties = (
  entity: Entity,
  bazaarDescription: string,
  tags: string[],
  status: string,
) => {
  const clonedEntity = JSON.parse(JSON.stringify(entity));
  const modifiedEntity = deleteProperties(clonedEntity);

  if (!modifiedEntity.metadata.bazaar) {
    modifiedEntity.metadata.bazaar = {};
  }

  addBazaarProperties(modifiedEntity, bazaarDescription, status);
  modifiedEntity.metadata.tags = [...tags, 'bazaar'];
  return modifiedEntity;
};
