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

import { MetadataHolder, MetadataRef } from './types';
import { useVersionedContext } from '@backstage/version-bridge';

/**
 * React hook for retrieving {@link MetadataHolder}
 *
 * @public
 */
export function useMetadataHolder(): MetadataHolder {
  const versionedHolder = useVersionedContext<{ 1: MetadataHolder }>(
    'metadata-context',
  );
  if (!versionedHolder) {
    throw new Error('Metadata context is not available');
  }

  const metadataHolder = versionedHolder.atVersion(1);
  if (!metadataHolder) {
    throw new Error('Metadata context v1 not available');
  }
  return metadataHolder;
}

/**
 * React hook for retrieving metadata.
 *
 * @param metadataRef - Reference of the metadata to use.
 * @public
 */
export function useMetadata<T>(metadataRef: MetadataRef<T>): T {
  const metadataHolder = useMetadataHolder();

  const metadata = metadataHolder.get(metadataRef);
  if (!metadata) {
    throw new Error(`No implementation available for ${metadataRef}`);
  }
  return metadata;
}
