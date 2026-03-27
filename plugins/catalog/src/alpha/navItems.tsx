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

import { Home } from 'lucide-react';
import {
  type IconComponent,
  NavItemBlueprint,
} from '@backstage/frontend-plugin-api';
import { rootRouteRef } from '../routes';

/** Map MUI-style fontSize values to Lucide pixel sizes */
const ICON_SIZE_MAP: Record<string, number> = {
  small: 20,
  medium: 24,
  large: 35,
  inherit: 24,
};

/**
 * Wrapper bridging lucide-react's ForwardRefExoticComponent to Backstage's
 * IconComponent type which expects ComponentType<{ fontSize?: ... }>.
 */
const HomeIcon: IconComponent = ({ fontSize = 'medium', ...rest }) => (
  <Home size={ICON_SIZE_MAP[fontSize] ?? 24} {...rest} />
);

export const catalogNavItem = NavItemBlueprint.make({
  params: {
    routeRef: rootRouteRef,
    title: 'Catalog',
    icon: HomeIcon,
  },
});

export default [catalogNavItem];
