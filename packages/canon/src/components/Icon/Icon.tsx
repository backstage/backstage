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

import React from 'react';
import { useCanon } from '../../contexts/canon';
import type { IconProps } from './types';

/** @public */
export const Icon = (props: IconProps) => {
  const { name, size = 16 } = props;
  const { icons } = useCanon();

  const RemixIcon = icons[name] as React.ComponentType<{ className?: string }>;

  if (!RemixIcon) {
    console.error(`Icon "${name}" not found or is not a valid component.`);
    return <svg />; // Return a default icon or handle the error appropriately
  }

  return <RemixIcon className={`icon-${size}`} />;
};
