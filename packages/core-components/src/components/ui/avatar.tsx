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

import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

/**
 * Root Avatar container providing a rounded, fixed-size wrapper for avatar
 * content. Built on the Radix UI Avatar primitive for accessible image +
 * fallback composition with built-in image load state management.
 *
 * @remarks
 * Named `ShadcnAvatar` to avoid conflicts with the existing Backstage
 * `Avatar` component exported from `../Avatar/Avatar.tsx`.
 *
 * @example
 * ```tsx
 * <ShadcnAvatar>
 *   <AvatarImage src="/user-photo.jpg" alt="User Name" />
 *   <AvatarFallback>UN</AvatarFallback>
 * </ShadcnAvatar>
 * ```
 *
 * @public
 */
const ShadcnAvatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className,
    )}
    {...props}
  />
));
ShadcnAvatar.displayName = 'ShadcnAvatar';

/**
 * Avatar image rendered inside the ShadcnAvatar root container. Handles
 * asynchronous image loading and reports load status to the parent Avatar
 * primitive, enabling the AvatarFallback to display when the image is
 * unavailable.
 *
 * @example
 * ```tsx
 * <AvatarImage src="/photo.jpg" alt="Description" />
 * ```
 *
 * @public
 */
const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-image"
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = 'AvatarImage';

/**
 * Fallback content displayed when the avatar image is unavailable, fails to
 * load, or is still loading. Typically renders initials or a placeholder icon
 * centered within the avatar container.
 *
 * @example
 * ```tsx
 * <AvatarFallback>AB</AvatarFallback>
 * <AvatarFallback delayMs={500}>AB</AvatarFallback>
 * ```
 *
 * @public
 */
const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    data-slot="avatar-fallback"
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = 'AvatarFallback';

export { ShadcnAvatar, AvatarImage, AvatarFallback };
