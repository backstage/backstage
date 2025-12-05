/*
 * Copyright 2025 The Backstage Authors
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
import { Column } from '../types';

const getByPath = (obj: any, path: string): unknown => {
  return path
    .split('.')
    .reduce((acc, part) => (acc === null ? undefined : acc[part]), obj);
};

export const getEntityDataFromColumns = (entity: Entity, columns: Column[]) => {
  const mappedData: Record<string, unknown> = {};
  for (const col of columns) {
    mappedData[col.title] = getByPath(entity, col.entityFilterKey);
  }
  return mappedData;
};
