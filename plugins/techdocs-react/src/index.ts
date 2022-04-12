/*
 * Copyright 2022 The Backstage Authors
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
 * Package encapsulating utilities to be shared by frontend TechDocs plugins.
 *
 * @packageDocumentation
 */

export {
  useTechDocsAddons,
  createTechDocsAddonExtension,
  TechDocsAddons,
  TECHDOCS_ADDONS_WRAPPER_KEY,
} from './addons';
export { techdocsApiRef } from './api';
export type { TechDocsApi } from './api';
export {
  defaultTechDocsReaderPageValue,
  TechDocsReaderPageProvider,
  useTechDocsReaderPage,
} from './context';
export type {
  TechDocsReaderPageProviderProps,
  TechDocsReaderPageProviderRenderFunction,
  TechDocsReaderPageValue,
} from './context';
export {
  useShadowRoot,
  useShadowRootElements,
  useShadowRootSelection,
} from './hooks';
export { TechDocsAddonLocations } from './types';
export type {
  TechDocsEntityMetadata,
  TechDocsMetadata,
  TechDocsAddonOptions,
} from './types';
