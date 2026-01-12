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

import { createExtensionBlueprint, createExtensionDataRef } from '../wiring';
import { NavItem } from './NavItemBlueprint';

/**
 * Nav content item used by the nav content component.
 *
 * @public
 */
export type NavContentItem = NavItem & {
  // Additional props to simplify item rendering
  to: string | undefined;
  text: string | undefined;
};

/**
 * The props for the {@link NavContentComponent}.
 *
 * @public
 */
export interface NavContentComponentProps {
  Logo?: () => JSX.Element | null;
  Search?: () => JSX.Element | null;
  items: Array<NavContentItem>;
}

/**
 * A component that renders the nav bar content, to be passed to the {@link NavContentBlueprint}.
 *
 * @public
 */
export type NavContentComponent = (
  props: NavContentComponentProps,
) => JSX.Element | null;

const componentDataRef = createExtensionDataRef<NavContentComponent>().with({
  id: 'core.nav-content.component',
});

/**
 * Creates an extension that replaces the entire nav bar with your own component.
 *
 * @public
 */
export const NavContentBlueprint = createExtensionBlueprint({
  kind: 'nav-content',
  attachTo: { id: 'app/nav', input: 'content' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  *factory(params: { component: NavContentComponent }) {
    yield componentDataRef(params.component);
  },
});
