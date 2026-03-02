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
import { JSONSchema7 } from 'json-schema';

/**
 * Describes a registered annotation on a catalog entity kind.
 *
 * @alpha
 */
export type CatalogModelAnnotationDescriptor = {
  key: string;
  pluginId: string;
  entityKind: string;
  description?: string;
  schema: JSONSchema7;
};

/**
 * Result of validating an entity against registered catalog model schemas.
 *
 * @alpha
 */
export type CatalogModelValidationResult = {
  valid: boolean;
  errors: Array<{
    pluginId: string;
    annotation: string;
    message: string;
  }>;
};

/**
 * Service for consuming registered catalog model extensions.
 * Root-scoped: aggregates all registrations across plugins.
 *
 * See {@link https://backstage.io/docs/backend-system/core-services/catalog-model | the service docs}
 * for more information.
 *
 * @alpha
 */
export interface CatalogModelService {
  listAnnotations(options?: {
    entityKind?: string;
  }): Promise<CatalogModelAnnotationDescriptor[]>;

  validateEntity(entity: {
    kind: string;
    metadata: { annotations?: Record<string, string> };
  }): Promise<CatalogModelValidationResult>;
}
