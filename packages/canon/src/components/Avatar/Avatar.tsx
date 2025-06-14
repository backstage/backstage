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

import { forwardRef, ElementRef } from 'react';
import { Avatar as AvatarPrimitive } from '@base-ui-components/react/avatar';
import clsx from 'clsx';
import { AvatarProps } from './types';

/** @public */
export const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, src, name, size = 'medium', ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={clsx('canon-AvatarRoot', className)}
    data-size={size}
    {...props}
  >
    <AvatarPrimitive.Image className="canon-AvatarImage" src={src} />
    <AvatarPrimitive.Fallback className="canon-AvatarFallback">
      {(name || '')
        .split(' ')
        .map(word => word[0])
        .join('')
        .toLocaleUpperCase('en-US')
        .slice(0, 2)}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));

Avatar.displayName = AvatarPrimitive.Root.displayName;
