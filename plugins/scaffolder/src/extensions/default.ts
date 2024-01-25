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
import {
  EntityPicker,
  EntityPickerSchema,
} from '../components/fields/EntityPicker/EntityPicker';
import {
  EntityNamePicker,
  EntityNamePickerSchema,
} from '../components/fields/EntityNamePicker/EntityNamePicker';
import { entityNamePickerValidation } from '../components/fields/EntityNamePicker/validation';
import {
  EntityTagsPicker,
  EntityTagsPickerSchema,
} from '../components/fields/EntityTagsPicker/EntityTagsPicker';
import {
  OwnerPicker,
  OwnerPickerSchema,
} from '../components/fields/OwnerPicker/OwnerPicker';
import {
  RepoUrlPicker,
  RepoUrlPickerSchema,
} from '../components/fields/RepoUrlPicker/RepoUrlPicker';
import { repoPickerValidation } from '../components/fields/RepoUrlPicker/validation';
import {
  OwnedEntityPicker,
  OwnedEntityPickerSchema,
} from '../components/fields/OwnedEntityPicker/OwnedEntityPicker';
import {
  MyGroupsPicker,
  MyGroupsPickerSchema,
} from '../components/fields/MyGroupsPicker/MyGroupsPicker';

import { SecretInput } from '../components/fields/SecretInput';
import {
  MultiEntityPicker,
  MultiEntityPickerSchema,
  validateMultiEntityPickerValidation,
} from '../components/fields/MultiEntityPicker/MultiEntityPicker';

export const DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS = [
  {
    component: EntityPicker,
    name: 'EntityPicker',
    schema: EntityPickerSchema,
  },
  {
    component: EntityNamePicker,
    name: 'EntityNamePicker',
    validation: entityNamePickerValidation,
    schema: EntityNamePickerSchema,
  },
  {
    component: EntityTagsPicker,
    name: 'EntityTagsPicker',
    schema: EntityTagsPickerSchema,
  },
  {
    component: RepoUrlPicker,
    name: 'RepoUrlPicker',
    validation: repoPickerValidation,
    schema: RepoUrlPickerSchema,
  },
  {
    component: OwnerPicker,
    name: 'OwnerPicker',
    schema: OwnerPickerSchema,
  },
  {
    component: OwnedEntityPicker,
    name: 'OwnedEntityPicker',
    schema: OwnedEntityPickerSchema,
  },
  {
    component: MyGroupsPicker,
    name: 'MyGroupsPicker',
    schema: MyGroupsPickerSchema,
  },
  {
    component: SecretInput,
    name: 'Secret',
  },
  {
    component: MultiEntityPicker,
    name: 'MultiEntityPicker',
    schema: MultiEntityPickerSchema,
    validation: validateMultiEntityPickerValidation,
  },
];
