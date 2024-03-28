/*
 * Copyright 2024 The Backstage Authors
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

import {
  EntitySwitch as entitySwitch,
  EntitySwitchProps as entitySwitchProps,
  EntitySwitchCaseProps as entitySwitchCaseProps,
  EntityPredicates as entityPredicates,
  isKind as isKindCondiiton,
  isNamespace as isNamespaceCondiiton,
  isComponentType as isComponentTypeCondiiton,
  isResourceType as isResourceTypeCondiiton,
  isEntityWith as isEntityWithCondiiton,
} from '@backstage/plugin-catalog-react';

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export const EntitySwitch = entitySwitch;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export type EntitySwitchProps = entitySwitchProps;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export type EntitySwitchCaseProps = entitySwitchCaseProps;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export type EntityPredicates = entityPredicates;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export const isKind = isKindCondiiton;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export const isNamespace = isNamespaceCondiiton;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export const isComponentType = isComponentTypeCondiiton;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export const isResourceType = isResourceTypeCondiiton;

/**
 * @public
 * @deprecated Import from `@backstage/plugin-catalog-react` instead
 */
export const isEntityWith = isEntityWithCondiiton;
