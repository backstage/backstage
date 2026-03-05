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

import { useTechDocsReaderPage } from '@backstage/plugin-techdocs-react';

/**
 * Hook for sub-components to retrieve Entity Metadata for the current TechDocs
 * site.
 * @internal
 */
export const useEntityMetadata = () => {
  const { entityMetadata } = useTechDocsReaderPage();
  return entityMetadata;
};

/**
 * Hook for sub-components to retrieve TechDocs Metadata for the current
 * TechDocs site.
 * @internal
 */
export const useTechDocsMetadata = () => {
  const { metadata } = useTechDocsReaderPage();
  return metadata;
};
