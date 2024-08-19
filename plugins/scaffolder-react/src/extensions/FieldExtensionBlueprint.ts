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
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';
import { FieldExtensionOptions } from './types';
import { NotImplementedError } from '@backstage/errors';

type FieldExtension = {
  fieldName: string;
  component: (
    props: FieldExtensionComponentProps<TFieldReturnValue, TUiOptions>,
  ) => JSX.Element | null;
  validation?: CustomFieldValidator<TFieldReturnValue, TUiOptions>;
  schema?: CustomFieldExtensionSchema;
};

const extensionDataRef = createExtensionDataRef<FieldExtensionOptions>().with({
  id: 'field-extension',
});

export const FieldExtensionBlueprint = createExtensionBlueprint({
  kind: 'field-extension',
  attachTo: { id: 'page:scaffolder', input: 'field-extensions' },
  dataRefs: {
    extension: extensionDataRef,
  },
  output: [extensionDataRef],
  factory({}, {}) {
    return loader().then(extension => {
      return extensionDataRef(options => extension(node, options));
    });
  },
});

const RepoUrlPicker = FieldExtensionBlueprint.make({
  name: 'repo-url-picker',
  params: {
    component: () =>
      import('../components/RepoUrlPicker').then(m => m.RepoUrlPicker),
    fieldName: 'RepoUrlPicker',
    validation: () => {},
  },
});
