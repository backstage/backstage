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

import { createBackend } from '@backstage/backend-defaults';
import { catalogModelExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import {
  createBackendFeatureLoader,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  createEntitySchema,
  createFromZod,
  defaultEntityMetadataSchema,
  componentKindSchema,
  parseEntityRef,
  getCompoundEntityRef,
  Entity,
} from '@backstage/catalog-model';
import { processingResult } from '@backstage/plugin-catalog-node';

const backend = createBackend();

// An example of how to group together and load multiple features. You can also
// access root-scoped services by adding `deps`.
const searchLoader = createBackendFeatureLoader({
  *loader() {
    yield import('@backstage/plugin-search-backend');
    yield import('@backstage/plugin-search-backend-module-catalog');
    yield import('@backstage/plugin-search-backend-module-explore');
    yield import('@backstage/plugin-search-backend-module-techdocs');
  },
});

backend.add(import('@backstage/plugin-auth-backend'));
backend.add(import('./authModuleGithubProvider'));
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-catalog-backend-module-unprocessed'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(import('@backstage/plugin-events-backend'));
backend.add(import('@backstage/plugin-devtools-backend'));
backend.add(import('@backstage/plugin-kubernetes-backend'));
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);
backend.add(import('@backstage/plugin-permission-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);
backend.add(
  import('@backstage/plugin-catalog-backend-module-backstage-openapi'),
);
backend.add(searchLoader);
backend.add(import('@backstage/plugin-techdocs-backend'));
backend.add(import('@backstage/plugin-signals-backend'));
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('./instanceMetadata'));

backend.add(
  createBackendModule({
    pluginId: 'catalog',
    moduleId: 'my-custom-kinds',

    register(reg) {
      reg.registerInit({
        deps: {
          catalogModel: catalogModelExtensionPoint,
        },
        async init({ catalogModel }) {
          /**
           * extend the default metadata so that accepts an extra properties
           * and NO additional properties
           */
          const strictMetadataSchema = createFromZod(z =>
            defaultEntityMetadataSchema
              .extend({
                'this-specific-property-is-allowed': z.string().optional(),
              })
              .strict(),
          );
          catalogModel.setDefaultEntityMetadataSchema(strictMetadataSchema);

          // override the default component kind with a custom one
          // all components with lifecycle: experimental are now invalid
          const customComponent = createFromZod(z =>
            componentKindSchema.extend({
              spec: componentKindSchema.shape.spec.extend({
                lifecycle: z.enum(['production', 'borked']),
              }),
            }),
          );
          catalogModel.addEntitySchema(customComponent);

          /**
           * add a new kind
           */
          const fooEntity = createEntitySchema(z => ({
            kind: z.literal('Foo'),
            spec: z
              .object({
                lol: z.string().optional(),
                ref: z.string(),
              })
              .strict(),
          }));
          catalogModel.addEntitySchema(fooEntity);
          // bring an extra relationship for the new kind
          catalogModel.addRelation(
            _z => ({ entity: fooEntity }),
            entity => {
              const target = parseEntityRef(entity.spec.ref);
              const source = getCompoundEntityRef(entity as Entity);
              return [
                processingResult.relation({
                  source,
                  target,
                  type: 'randomBy',
                }),
                processingResult.relation({
                  source: target,
                  target: source,
                  type: 'blablabla',
                }),
              ];
            },
          );
        },
      });
    },
  }),
);

backend.start();
