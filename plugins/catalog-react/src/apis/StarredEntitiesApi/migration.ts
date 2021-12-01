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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { StorageApi } from '@backstage/core-plugin-api';
import { isArray, isString } from 'lodash';

/**
 * Migrate the starred entities from the old format (entity:<kind>:<namespace>:<name>) from the
 * old storage location (/settings/starredEntities) to entity references in the new location
 * (/starredEntities/entityRefs).
 *
 * This will only be executed once since the old location is cleared.
 *
 * @param storageApi - the StorageApi to migrate
 */
export async function performMigrationToTheNewBucket({
  storageApi,
}: {
  storageApi: StorageApi;
}) {
  const source = storageApi.forBucket('settings');
  const target = storageApi.forBucket('starredEntities');

  const oldStarredEntities = source.get('starredEntities');

  if (!isArray(oldStarredEntities)) {
    // nothing to do
    return;
  }

  const targetEntities = new Set(target.get('entityRefs') ?? []);

  oldStarredEntities
    .filter(isString)
    // extract the old format 'entity:<kind>:<namespace>:<name>'
    .map(old => old.split(':'))
    // check if the format is valid
    .filter(split => split.length === 4 && split[0] === 'entity')
    // convert to entity references
    .map(([_, kind, namespace, name]) =>
      stringifyEntityRef({ kind, namespace, name }),
    )
    .forEach(e => targetEntities.add(e));

  await target.set('entityRefs', Array.from(targetEntities));

  await source.remove('starredEntities');
}
