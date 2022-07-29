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

export { techdocsApiRef, techdocsStorageApiRef } from './api';
export type { SyncResult, TechDocsApi, TechDocsStorageApi } from './api';

export {
  TechDocsReaderPageProvider,
  useTechDocsReaderPage,
  TechDocsReaderPageContentProvider,
  useTechDocsReaderPageContent,
  withTechDocsReaderPageContentProvider,
  TechDocsShadowDom,
  useShadowRoot,
  useShadowRootElements,
  useShadowRootSelection,
  useShadowDomStylesLoading,
  SHADOW_DOM_STYLE_LOAD_EVENT,
} from './reader';

export type {
  TechDocsReaderPageProviderProps,
  TechDocsReaderPageProviderRenderFunction,
  TechDocsReaderPageContentState,
  TechDocsReaderPageContentStateTypes,
  TechDocsReaderPageContentProviderProps,
  TechDocsReaderPageContentProviderRenderFunction,
  TechDocsReaderPageValue,
  TechDocsShadowDomProps,
} from './reader';

export { TechDocsAddonLocations } from './types';

export type {
  TechDocsEntityMetadata,
  TechDocsMetadata,
  TechDocsAddonOptions,
} from './types';

export { toLowercaseEntityRefMaybe } from './helpers';
