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

import { IconLinkVerticalProps } from '@backstage/core-components';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

import {
  FilterPredicate,
  createZodV3FilterPredicateSchema,
} from '@backstage/filter-predicates';

import {
  entityFilterExpressionDataRef,
  entityFilterFunctionDataRef,
} from './extensionData';
import { Entity } from '@backstage/catalog-model';
import { resolveEntityFilterData } from './resolveEntityFilterData';
import { useEntity } from '../../hooks';

/**
 * Resolves template expressions like `${metadata.name}` or `${spec.type}`
 * against an entity object using dot-notation paths.
 */
function resolveEntityTemplate(template: string, entity: Entity): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, path: string) => {
    const value = path
      .trim()
      .split('.')
      .reduce((obj: any, key) => obj?.[key], entity);
    return value !== null ? String(value) : '';
  });
}

const entityIconLinkPropsDataRef = createExtensionDataRef<
  () => IconLinkVerticalProps
>().with({
  id: 'entity-icon-link-props',
});

/** @alpha */
export const EntityIconLinkBlueprint = createExtensionBlueprint({
  kind: 'entity-icon-link',
  attachTo: { id: 'entity-card:catalog/about', input: 'iconLinks' },
  output: [
    entityFilterFunctionDataRef.optional(),
    entityFilterExpressionDataRef.optional(),
    entityIconLinkPropsDataRef,
  ],
  dataRefs: {
    useProps: entityIconLinkPropsDataRef,
    filterFunction: entityFilterFunctionDataRef,
    filterExpression: entityFilterExpressionDataRef,
  },
  defaultParams: {
    useProps: () => ({}),
  },
  config: {
    schema: {
      label: z => z.string().optional(),
      title: z => z.string().optional(),
      icon: z => z.string().optional(),
      href: z => z.string().optional(),
      filter: z => createZodV3FilterPredicateSchema(z).optional(),
    },
  },
  *factory(
    params: {
      useProps: () => Omit<IconLinkVerticalProps, 'color'>;
      filter?: FilterPredicate | ((entity: Entity) => boolean);
    },
    { config, node },
  ) {
    const { filter, useProps } = params;
    yield* resolveEntityFilterData(filter, config, node);
    // Only include properties that are defined in the config
    // to avoid overriding defaults with undefined values
    const configProps = Object.entries(config).reduce(
      (rest, [key, value]) =>
        value !== undefined
          ? {
              ...rest,
              [key]: value,
            }
          : rest,
      {},
    );

    const hrefTemplate =
      typeof config.href === 'string' && config.href.includes('{{')
        ? config.href
        : undefined;

    if (hrefTemplate) {
      // When href contains template expressions, resolve them at render time
      // using the current entity. useEntity() is safe here because useProps
      // is always called inside a React component context.
      yield entityIconLinkPropsDataRef(() => {
        const { entity } = useEntity();
        return {
          ...useProps(),
          ...configProps,
          href: resolveEntityTemplate(hrefTemplate, entity),
        };
      });
    } else {
      yield entityIconLinkPropsDataRef(() => ({
        ...useProps(),
        ...configProps,
      }));
    }
  },
});
