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

import React, { ComponentProps } from 'react';
import { useApp, IconComponent } from '@backstage/core-plugin-api';
import { compatWrapper } from '../compatWrapper';

/**
 * @public
 * Props for the SystemIcon component.
 */
export type SystemIconProps = ComponentProps<IconComponent> & {
  // The id of the system icon to render, if provided as an array, the first icon found will be rendered.
  keys: string | string[];
  // An optional fallback icon component to render when the system icon is not found.
  // Default to () => null.
  Fallback?: IconComponent;
};

function SystemIcon(props: SystemIconProps) {
  const { keys, Fallback = () => null, ...rest } = props;
  const app = useApp();
  for (const key of Array.isArray(keys) ? keys : [keys]) {
    const Icon = app.getSystemIcon(key);
    if (Icon) return <Icon {...rest} />;
  }
  return <Fallback {...rest} />;
}

/**
 * @public
 * SystemIcon is a component that renders a system icon by its id.
 * @example
 * Rendering the "kind:api" icon:
 * ```tsx
 * <SystemIcon keys="kind:api" />
 * ```
 * @example
 * Providing multiple icon ids:
 * ```tsx
 * <SystemIcon keys={['kind:user', 'user']} />
 * ```
 * @example
 * Customizing the fallback icon:
 * ```tsx
 * <SystemIcon keys="kind:api" Fallback={ApiFallbackIcon} />
 * ```
 * @example
 * Customizing the icon font size:
 * ```tsx
 * <SystemIcon keys="kind:api" fontSize="medium" />
 * ```
 */
function CompatSystemIcon(props: SystemIconProps) {
  try {
    // Check if the app context is available
    useApp();
    return <SystemIcon {...props} />;
  } catch {
    // Fallback to the compat wrapper if the app context is not available
    return compatWrapper(<SystemIcon {...props} />);
  }
}

export { CompatSystemIcon as SystemIcon };
