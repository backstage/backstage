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
import { useIcons } from './context';
import type { IconProps } from './types';
import clsx from 'clsx';

/** @public */
export const Icon = (props: IconProps) => {
  const { name, size, className, style, ...restProps } = props;
  const { icons } = useIcons();

  const CanonIcon = icons[name] as React.ComponentType<Omit<IconProps, 'name'>>;

  if (!CanonIcon) {
    console.error(`Icon "${name}" not found or is not a valid component.`);
    return null;
  }

  return (
    <CanonIcon
      className={clsx('canon-Icon', className)}
      style={{
        ...(size ? { width: size, height: size } : {}),
        ...style,
      }}
      {...restProps}
    />
  );
};
