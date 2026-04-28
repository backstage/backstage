/*
 * Copyright 2023 The Backstage Authors
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

import { FormFieldBlueprint } from '@backstage/plugin-scaffolder-react/alpha';

export const repoUrlPickerFormField = FormFieldBlueprint.make({
  name: 'repo-url-picker',
  params: {
    field: () => import('./fields/RepoUrlPicker').then(m => m.RepoUrlPicker),
  },
});

export const entityNamePickerFormField = FormFieldBlueprint.make({
  name: 'entity-name-picker',
  params: {
    field: () =>
      import('./fields/EntityNamePicker').then(m => m.EntityNamePicker),
  },
});

export const entityPickerFormField = FormFieldBlueprint.make({
  name: 'entity-picker',
  params: {
    field: () => import('./fields/EntityPicker').then(m => m.EntityPicker),
  },
});

export const ownerPickerFormField = FormFieldBlueprint.make({
  name: 'owner-picker',
  params: {
    field: () => import('./fields/OwnerPicker').then(m => m.OwnerPicker),
  },
});

export const entityTagsPickerFormField = FormFieldBlueprint.make({
  name: 'entity-tags-picker',
  params: {
    field: () =>
      import('./fields/EntityTagsPicker').then(m => m.EntityTagsPicker),
  },
});

export const multiEntityPickerFormField = FormFieldBlueprint.make({
  name: 'multi-entity-picker',
  params: {
    field: () =>
      import('./fields/MultiEntityPicker').then(m => m.MultiEntityPicker),
  },
});

export const myGroupsPickerFormField = FormFieldBlueprint.make({
  name: 'my-groups-picker',
  params: {
    field: () => import('./fields/MyGroupsPicker').then(m => m.MyGroupsPicker),
  },
});

export const ownedEntityPickerFormField = FormFieldBlueprint.make({
  name: 'owned-entity-picker',
  params: {
    field: () =>
      import('./fields/OwnedEntityPicker').then(m => m.OwnedEntityPicker),
  },
});

export const repoBranchPickerFormField = FormFieldBlueprint.make({
  name: 'repo-branch-picker',
  params: {
    field: () =>
      import('./fields/RepoBranchPicker').then(m => m.RepoBranchPicker),
  },
});

export const repoOwnerPickerFormField = FormFieldBlueprint.make({
  name: 'repo-owner-picker',
  params: {
    field: () =>
      import('./fields/RepoOwnerPicker').then(m => m.RepoOwnerPicker),
  },
});

export default [
  repoUrlPickerFormField,
  entityNamePickerFormField,
  entityPickerFormField,
  ownerPickerFormField,
  entityTagsPickerFormField,
  multiEntityPickerFormField,
  myGroupsPickerFormField,
  ownedEntityPickerFormField,
  repoBranchPickerFormField,
  repoOwnerPickerFormField,
];
