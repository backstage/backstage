/*
 * Copyright 2021 The Backstage Authors
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

import { IndexableDocument } from '@backstage/plugin-search-common';

/**
 * TechDocs indexable document interface
 * @public
 */
export interface TechDocsDocument extends IndexableDocument {
  /**
   * Entity kind
   */
  kind: string;
  /**
   * Entity metadata namespace
   */
  namespace: string;
  /**
   * Entity metadata name
   */
  name: string;
  /**
   * Entity lifecycle
   */
  lifecycle: string;
  /**
   * Entity owner
   */
  owner: string;
  /**
   * Entity path
   */
  path: string;
}
