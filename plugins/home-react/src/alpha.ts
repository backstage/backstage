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

/**
 * React components and utilities for the home plugin's new frontend system.
 *
 * @remarks
 * This package provides React components, blueprints, and utilities for building
 * customizable home pages with the new Backstage frontend system.
 *
 * @packageDocumentation
 */
export { homeReactTranslationRef } from './translation';
export {
  HomePageWidgetBlueprint,
  type HomePageWidgetBlueprintParams,
} from './alpha/blueprints/HomePageWidgetBlueprint';
export {
  HomePageLayoutBlueprint,
  type HomePageLayoutBlueprintParams,
} from './alpha/blueprints/HomePageLayoutBlueprint';
export {
  homePageWidgetDataRef,
  type HomePageWidgetData,
  homePageLayoutComponentDataRef,
  type HomePageLayoutProps,
} from './alpha/dataRefs';
export type { ComponentParts, CardLayout, CardSettings } from './extensions';
