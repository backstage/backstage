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

import { CompoundEntityRef } from '@backstage/catalog-model';
import { createApiRef } from '@backstage/core-plugin-api';
import { TechDocsEntityMetadata, TechDocsMetadata } from './types';

/**
 * API to talk to techdocs-backend.
 *
 * @public
 */
export interface TechDocsApi {
  getApiOrigin(): Promise<string>;
  getTechDocsMetadata(entityId: CompoundEntityRef): Promise<TechDocsMetadata>;
  getEntityMetadata(
    entityId: CompoundEntityRef,
  ): Promise<TechDocsEntityMetadata>;
}

/**
 * Utility API reference for the {@link TechDocsApi}.
 *
 * @public
 */
export const techdocsApiRef = createApiRef<TechDocsApi>({
  id: 'plugin.techdocs.service',
});

/**
 * The outcome of a docs sync operation.
 *
 * @public
 */
export type SyncResult = 'cached' | 'updated';

/**
 * API which talks to TechDocs storage to fetch files to render.
 *
 * @public
 */
export interface TechDocsStorageApi {
  getApiOrigin(): Promise<string>;
  getStorageUrl(): Promise<string>;
  getBuilder(): Promise<string>;
  getEntityDocs(entityId: CompoundEntityRef, path: string): Promise<string>;
  syncEntityDocs(
    entityId: CompoundEntityRef,
    logHandler?: (line: string) => void,
  ): Promise<SyncResult>;
  getBaseUrl(
    oldBaseUrl: string,
    entityId: CompoundEntityRef,
    path: string,
  ): Promise<string>;
}

/**
 * Utility API reference for the {@link TechDocsStorageApi}.
 *
 * @public
 */
export const techdocsStorageApiRef = createApiRef<TechDocsStorageApi>({
  id: 'plugin.techdocs.storageservice',
});
