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

/** @public */
export type EntityResults = {
  entityRef: string;
  results: Languages;
};

/** @public */
export type Languages = {
  languageCount: number;
  totalBytes: number;
  processedDate: string;
  breakdown: Language[];
};

/** @public */
export type Language = {
  name: string;
  percentage: number;
  bytes: number;
  type: string;
  color?: `#${string}`;
};

/** @public */
export type ProcessedEntity = {
  entityRef: string;
  processedDate: Date;
};

/** @public */
export type EntitiesOverview = {
  entityCount: number;
  processedCount: number;
  pendingCount: number;
  staleCount: number;
  filteredEntities: string[];
};
