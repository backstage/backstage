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
import { AnyZodObject } from 'zod';
import { createServiceRef } from '@backstage/backend-plugin-api';

export interface AnnotationRegistration {
  pluginId: string;
  entityKind: string;
  schema: AnyZodObject;
}

export interface CatalogModelStore {
  addAnnotations(registration: AnnotationRegistration): void;
  getAnnotations(entityKind?: string): AnnotationRegistration[];
}

export const catalogModelStoreServiceRef = createServiceRef<CatalogModelStore>({
  id: 'alpha.core.catalogModelStore',
  scope: 'root',
});

export class DefaultCatalogModelStore implements CatalogModelStore {
  private readonly annotations: AnnotationRegistration[] = [];

  addAnnotations(registration: AnnotationRegistration): void {
    this.annotations.push(registration);
  }

  getAnnotations(entityKind?: string): AnnotationRegistration[] {
    if (entityKind) {
      return this.annotations.filter(a => a.entityKind === entityKind);
    }
    return [...this.annotations];
  }
}
