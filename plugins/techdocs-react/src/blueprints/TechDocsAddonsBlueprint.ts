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
import {
  createExtensionBlueprint,
  createExtensionDataRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';

/** @public */
export const techDocsAddonsDataRef = createExtensionDataRef<
  JSX.Element[]
>().with({
  id: 'techdocs.addons',
});

/**
 * Creates an extension to add addons to the TechDocs standalone reader and entity pages.
 * @public
 */
export const TechDocsAddonsBlueprint = createExtensionBlueprint({
  kind: 'addons',
  name: 'techdocs',
  attachTo: [
    { id: 'page:techdocs/reader', input: 'addons' },
    { id: 'entity-content:techdocs', input: 'addons' },
  ],
  inputs: {
    addons: createExtensionInput([techDocsAddonsDataRef], {
      singleton: true,
      optional: true,
    }),
  },
  output: [techDocsAddonsDataRef],
  factory: (params: { addons: JSX.Element[] }) => [
    techDocsAddonsDataRef(params.addons),
  ],
  dataRefs: {
    addons: techDocsAddonsDataRef,
  },
});
