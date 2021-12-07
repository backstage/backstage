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

import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { Reader } from './reader';
import { configApiRef, useApi } from '@backstage/core-plugin-api';

export const EntityPageDocs = ({ entity }: { entity: Entity }) => {
  // Lower-case entity triplets by default, but allow override.
  const toLowerMaybe = useApi(configApiRef).getOptionalBoolean(
    'techdocs.legacyUseCaseSensitiveTripletPaths',
  )
    ? (str: string) => str
    : (str: string) => str.toLocaleLowerCase('en-US');

  return (
    <Reader
      withSearch={false}
      entityRef={{
        kind: toLowerMaybe(entity.kind),
        namespace: entity.metadata.namespace ?? 'default',
        name: entity.metadata.name,
      }}
    />
  );
};
