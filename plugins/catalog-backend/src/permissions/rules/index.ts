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

import { hasAnnotation } from './hasAnnotation';
import { isEntityKind } from './isEntityKind';
import { isEntityOwner } from './isEntityOwner';
import { hasLabel } from './hasLabel';
import { hasMetadata } from './hasMetadata';
import { hasSpec } from './hasSpec';

/**
 * These permission rules can be used to conditionally filter catalog entities
 * or describe a user's access to the entities.
 *
 * @alpha
 */
export const permissionRules = {
  hasAnnotation,
  hasLabel,
  hasMetadata,
  hasSpec,
  isEntityKind,
  isEntityOwner,
};

export type { CatalogPermissionRule } from './util';
export { createCatalogPermissionRule } from './util';
