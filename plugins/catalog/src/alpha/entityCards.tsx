/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react';
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';
import { createSchemaFromZod } from '@backstage/frontend-plugin-api';

export const EntityAboutCard = createEntityCardExtension({
  id: 'about',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).default('gridItem'),
    }),
  ),
  loader: async ({ config }) =>
    import('../components/AboutCard').then(m => (
      <m.AboutCard variant={config.variant} />
    )),
});

export const EntityLinksCard = createEntityCardExtension({
  id: 'links',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).optional(),
      cols: z
        .union([
          z.number(),
          z.object({
            xs: z.number(),
            sm: z.number(),
            md: z.number(),
            lg: z.number(),
            xl: z.number(),
          }),
        ])
        .optional(),
    }),
  ),
  loader: async ({ config }) =>
    import('../components/EntityLinksCard').then(m => {
      return <m.EntityLinksCard variant={config.variant} cols={config.cols} />;
    }),
});

export const EntityLabelsCard = createEntityCardExtension({
  id: 'labels',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).optional(),
      title: z.string().optional(),
    }),
  ),
  loader: async ({ config }) =>
    import('../components/EntityLabelsCard').then(m => (
      <m.EntityLabelsCard variant={config.variant} title={config.title} />
    )),
});

export const EntityDependsOnComponentsCard = createEntityCardExtension({
  id: 'dependsOn.components',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).default('gridItem'),
      title: z.string().optional(),
      // TODO: columns, tableOptions
    }),
  ),
  loader: async ({ config }) =>
    import('../components/DependsOnComponentsCard').then(m => (
      <m.DependsOnComponentsCard
        variant={config.variant}
        title={config.title}
      />
    )),
});

export const EntityDependsOnResourcesCard = createEntityCardExtension({
  id: 'dependsOn.resources',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).default('gridItem'),
      title: z.string().optional(),
      // TODO: columns, tableOptions
    }),
  ),
  loader: async ({ config }) =>
    import('../components/DependsOnResourcesCard').then(m => (
      <m.DependsOnResourcesCard variant={config.variant} title={config.title} />
    )),
});

export const EntityHasComponentsCard = createEntityCardExtension({
  id: 'has.components',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).default('gridItem'),
      title: z.string().optional(),
    }),
  ),
  loader: async ({ config }) =>
    import('../components/HasComponentsCard').then(m => (
      <m.HasComponentsCard variant={config.variant} title={config.title} />
    )),
});

export const EntityHasResourcesCard = createEntityCardExtension({
  id: 'has.resources',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).default('gridItem'),
      title: z.string().optional(),
    }),
  ),
  loader: async ({ config }) =>
    import('../components/HasResourcesCard').then(m => (
      <m.HasResourcesCard variant={config.variant} title={config.title} />
    )),
});

export const EntityHasSubcomponentsCard = createEntityCardExtension({
  id: 'has.subcomponents',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).default('gridItem'),
      title: z.string().optional(),
      // TODO: tableOptions
    }),
  ),
  loader: async ({ config }) =>
    import('../components/HasSubcomponentsCard').then(m => (
      <m.HasSubcomponentsCard variant={config.variant} title={config.title} />
    )),
});

export const EntityHasSystemsCard = createEntityCardExtension({
  id: 'has.systems',
  configSchema: createSchemaFromZod(z =>
    z.object({
      variant: z.enum(['gridItem', 'flex', 'fullHeight']).default('gridItem'),
      title: z.string().optional(),
    }),
  ),
  loader: async ({ config }) =>
    import('../components/HasSystemsCard').then(m => (
      <m.HasSystemsCard variant={config.variant} title={config.title} />
    )),
});

export default [
  EntityAboutCard,
  EntityLinksCard,
  EntityLabelsCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
];
