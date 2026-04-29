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

import {
  ApiBlueprint,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
  appTreeApiRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import {
  FormFieldBlueprint,
  formFieldsApiRef,
} from '@backstage/plugin-scaffolder-react/alpha';
import { ScaffolderClient } from '../api';
import { OpaqueFormField } from '@internal/scaffolder';

export const formFieldsApi = ApiBlueprint.makeWithOverrides({
  name: 'form-fields',
  inputs: {
    formFields: createExtensionInput([
      FormFieldBlueprint.dataRefs.formFieldLoader,
    ]),
  },
  factory(originalFactory, { inputs }) {
    const formFieldLoaders = inputs.formFields.map(e =>
      e.get(FormFieldBlueprint.dataRefs.formFieldLoader),
    );

    return originalFactory(defineParams =>
      defineParams({
        api: formFieldsApiRef,
        deps: { appTreeApi: appTreeApiRef },
        factory: ({ appTreeApi }) => ({
          async loadFormFields() {
            const pageFormFieldLoaders = getPageFormFieldLoaders(appTreeApi);

            const formFields = await Promise.all(
              [...formFieldLoaders, ...pageFormFieldLoaders].map(loader =>
                loader(),
              ),
            );

            return formFields.map(OpaqueFormField.toInternal);
          },
        }),
      }),
    );
  },
});

function getPageFormFieldLoaders(appTreeApi: typeof appTreeApiRef.T) {
  const { tree } = appTreeApi.getTree();
  const pageNode = tree.nodes.get('page:scaffolder');
  if (!pageNode?.instance) {
    return [];
  }
  const formFieldNodes = pageNode.edges.attachments.get('formFields') ?? [];
  return formFieldNodes.flatMap(node => {
    if (!node.instance) {
      return [];
    }
    const loader = node.instance.getData(
      FormFieldBlueprint.dataRefs.formFieldLoader,
    );
    return loader ? [loader] : [];
  });
}

export const scaffolderApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
        fetchApi: fetchApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, scmIntegrationsApi, fetchApi, identityApi }) =>
        new ScaffolderClient({
          discoveryApi,
          scmIntegrationsApi,
          fetchApi,
          identityApi,
        }),
    }),
});

export {
  formFieldsApiRef,
  type ScaffolderFormFieldsApi,
} from '@backstage/plugin-scaffolder-react/alpha';

export default [formFieldsApi, scaffolderApi];
