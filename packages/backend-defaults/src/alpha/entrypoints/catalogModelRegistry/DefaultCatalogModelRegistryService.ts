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
import { PluginMetadataService } from '@backstage/backend-plugin-api';
import PromiseRouter from 'express-promise-router';
import { Router, json } from 'express';
import { z, AnyZodObject } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import {
  CatalogModelRegistryService,
  CatalogModelRegistryAnnotationOptions,
} from '@backstage/backend-plugin-api/alpha';
import { JSONSchema7 } from 'json-schema';

interface AnnotationRegistration {
  pluginId: string;
  entityKind: string;
  schema: AnyZodObject;
}

export class DefaultCatalogModelRegistryService
  implements CatalogModelRegistryService
{
  private readonly annotations: AnnotationRegistration[] = [];
  private readonly metadata: PluginMetadataService;

  constructor(metadata: PluginMetadataService) {
    this.metadata = metadata;
  }

  createRouter(): Router {
    const router = PromiseRouter();
    router.use(json());

    router.get('/.backstage/catalog-model/v1/annotations', (_, res) => {
      const descriptors = [];

      for (const registration of this.annotations) {
        const jsonSchema = zodToJsonSchema(registration.schema) as JSONSchema7;
        const properties = jsonSchema.properties ?? {};

        for (const [key, propSchema] of Object.entries(properties)) {
          const prop = propSchema as JSONSchema7;
          descriptors.push({
            key,
            pluginId: registration.pluginId,
            entityKind: registration.entityKind,
            description: prop.description,
            schema: prop,
          });
        }
      }

      return res.json({ annotations: descriptors });
    });

    return router;
  }

  registerAnnotations<TSchema extends AnyZodObject>(
    options: CatalogModelRegistryAnnotationOptions<TSchema>,
  ): void {
    const schema = options.annotations(z);
    this.annotations.push({
      pluginId: this.metadata.getId(),
      entityKind: options.entityKind,
      schema,
    });
  }
}
