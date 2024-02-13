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

import { useApp } from '@backstage/core-plugin-api';
import React from 'react';
import { compatWrapper } from '../compatWrapper';

/**
 * @public
 * Props for the System Icon component.
 */
export type SystemIconProps = {
  // The id of the system icon to render.
  id: string;
  // An optional fallback element to render when the system icon is not found.
  fallback?: JSX.Element;
};

function SystemIcon(props: SystemIconProps) {
  const { id, fallback = null } = props;
  const app = useApp();
  const Component = app.getSystemIcon(id);
  return Component ? <Component /> : fallback;
}

/**
 * @public
 * SystemIcon is a component that renders a system icon by its id.
 * @example
 * Rendering the "kind:api" icon:
 * ```tsx
 * <SystemIcon id="kind:api" />
 * ```
 */
function CompatSystemIcon(props: SystemIconProps) {
  return compatWrapper(<SystemIcon {...props} />);
}

export { CompatSystemIcon as SystemIcon };
