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

import { sortMembers } from './sortMethods';
import { parseMember } from './parseMethods';
import { BazaarProject, Member } from '../types';
import { BazaarApi } from '../api';
import { Entity } from '@backstage/catalog-model';
import { CatalogApi } from '@backstage/plugin-catalog-react';

export const fetchProjectMembers = async (
  bazaarApi: BazaarApi,
  project: BazaarProject,
): Promise<Member[]> => {
  const response = await bazaarApi.getMembers(project.id);

  if (response.data.length > 0) {
    const dbMembers = response.data.map((member: any) => {
      return parseMember(member);
    });

    dbMembers.sort(sortMembers);
    return dbMembers;
  }
  return [];
};

export const fetchCatalogItems = async (
  catalogApi: CatalogApi,
): Promise<Entity[]> => {
  const entities = await catalogApi.getEntities({
    filter: {
      kind: ['Component', 'Resource'],
    },
    fields: ['kind', 'metadata.name', 'metadata.namespace'],
  });

  return entities.items;
};
