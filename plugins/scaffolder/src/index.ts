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

/**
 * The Backstage plugin that helps you create new things
 *
 * @packageDocumentation
 */

export { scaffolderApiRef, ScaffolderClient } from './api';
export type { ScaffolderApi } from './api';
export {
  createScaffolderFieldExtension,
  ScaffolderFieldExtensions,
} from './extensions';
export type {
  CustomFieldValidator,
  FieldExtensionOptions,
  FieldExtensionComponentProps,
} from './extensions';
export {
  EntityPickerFieldExtension,
  EntityNamePickerFieldExtension,
  EntityTagsPickerFieldExtension,
  OwnerPickerFieldExtension,
  OwnedEntityPickerFieldExtension,
  RepoUrlPickerFieldExtension,
  ScaffolderPage,
  scaffolderPlugin as plugin,
  scaffolderPlugin,
} from './plugin';
export {
  EntityNamePicker,
  EntityPicker,
  EntityTagsPicker,
  OwnerPicker,
  RepoUrlPicker,
  TextValuePicker,
  OwnedEntityPicker,
} from './components/fields';
export { FavouriteTemplate } from './components/FavouriteTemplate';
export { TemplateList } from './components/TemplateList';
export type { TemplateListProps } from './components/TemplateList';
export { TemplateTypePicker } from './components/TemplateTypePicker';
