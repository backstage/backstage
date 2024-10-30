/*
 * Copyright 2020 The Backstage Authors
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

/**
 * The Backstage backend plugin that renders technical documentation for your components
 *
 * @packageDocumentation
 */

import { Entity } from '@backstage/catalog-model';
import {
  DocsBuildStrategy as _DocsBuildStrategy,
  TechDocsDocument as _TechDocsDocument,
} from '@backstage/plugin-techdocs-node';

export { techdocsPlugin as default } from './plugin';
export { createRouter } from './service';
export type {
  RouterOptions,
  RecommendedDeploymentOptions,
  OutOfTheBoxDeploymentOptions,
} from './service';

export {
  DefaultTechDocsCollator,
  DefaultTechDocsCollatorFactory,
} from './search';
export type {
  TechDocsCollatorFactoryOptions,
  TechDocsCollatorOptions,
} from './search';

/**
 * @public
 * @deprecated import from `@backstage/plugin-techdocs-node` instead
 */
export type DocsBuildStrategy = _DocsBuildStrategy;
/**
 * @public
 * @deprecated use direct type definition instead
 */
export type ShouldBuildParameters = {
  entity: Entity;
};
/**
 * @public
 * @deprecated import from `@backstage/plugin-techdocs-node` instead
 */
export type TechDocsDocument = _TechDocsDocument;

export * from '@backstage/plugin-techdocs-node';
