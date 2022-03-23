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
 * Package encapsulating the TechDocs Addon framework.
 *
 * @packageDocumentation
 */

export {
  createTechDocsAddon,
  TechDocsAddons,
  TECHDOCS_ADDONS_WRAPPER_KEY,
} from './addons';
export * from './components';
export { useEntityMetadata, useTechDocsMetadata } from './context';
export { useShadowRoot, useShadowRootElements } from './hooks';
export { TechDocsAddonLocations } from './types';
export type {
  TechDocsAddonAsyncMetadata,
  TechDocsAddonOptions,
  TechDocsMetadata,
  TechDocsEntityMetadata,
} from './types';
