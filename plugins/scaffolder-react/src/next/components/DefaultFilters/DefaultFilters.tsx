/*
 * Copyright 2024 The Backstage Authors
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
  EntityKindPicker,
  EntitySearchBar,
  EntityTagPicker,
  UserListPicker,
  EntityOwnerPicker,
} from '@backstage/plugin-catalog-react';
import { TemplateCategoryPicker } from '../TemplateCategoryPicker';

/** @public */
export const DefaultFilters = () => {
  return (
    <>
      <EntitySearchBar />
      <EntityKindPicker initialFilter="template" hidden />
      <UserListPicker
        initialFilter="all"
        availableFilters={['all', 'starred']}
      />
      <TemplateCategoryPicker />
      <EntityTagPicker />
      <EntityOwnerPicker />
    </>
  );
};
