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
import { useStyles } from '../../hooks/useStyles';

/** @public */
export const Avatar = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>((props, ref) => {
  const { className, src, name, size = 'medium', ...rest } = props;
  const { classNames } = useStyles('Avatar', {
    size,
  });

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={clsx(classNames.root, className)}
      data-size={size}
      {...rest}
    >
      <AvatarPrimitive.Image className={classNames.image} src={src} />
      <AvatarPrimitive.Fallback className={classNames.fallback}>
        {(name || '')
          .split(' ')
          .map(word => word[0])
          .join('')
          .toLocaleUpperCase('en-US')
          .slice(0, 2)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
});

Avatar.displayName = AvatarPrimitive.Root.displayName;
