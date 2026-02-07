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

import { JSX } from 'react';
import {
  createExtensionBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import {
  homePageLayoutComponentDataRef,
  HomePageLayoutProps,
} from '../dataRefs';

/**
 * Parameters for creating a home page layout extension.
 *
 * @alpha
 */
export interface HomePageLayoutBlueprintParams {
  /**
   * Async loader that returns the layout component.
   * The component receives the collected widgets and renders them.
   */
  loader: () => Promise<(props: HomePageLayoutProps) => JSX.Element>;
}

/**
 * Blueprint for creating custom home page layouts.
 *
 * A layout receives the list of installed widgets and is responsible for
 * arranging them on the home page. This follows the same pattern as
 * `EntityContentLayoutBlueprint` in the catalog plugin.
 *
 * If no layout extension is installed, the home page uses a built-in default.
 * Users can install their own layout to customize how widgets are arranged.
 *
 * @alpha
 */
export const HomePageLayoutBlueprint = createExtensionBlueprint({
  kind: 'home-page-layout',
  attachTo: { id: 'page:home', input: 'layouts' },
  output: [homePageLayoutComponentDataRef],
  dataRefs: {
    component: homePageLayoutComponentDataRef,
  },
  *factory({ loader }: HomePageLayoutBlueprintParams, { node }) {
    yield homePageLayoutComponentDataRef(
      ExtensionBoundary.lazyComponent(node, loader),
    );
  },
});
