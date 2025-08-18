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

import { forwardRef } from 'react';
import { ScrollArea as ScrollAreaPrimitive } from '@base-ui-components/react/scroll-area';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';

const ScrollAreaRoot = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('ScrollArea');

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={clsx(classNames.root, className)}
      {...props}
    />
  );
});
ScrollAreaRoot.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollAreaViewport = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('ScrollArea');

  return (
    <ScrollAreaPrimitive.Viewport
      ref={ref}
      className={clsx(classNames.viewport, className)}
      {...props}
    />
  );
});
ScrollAreaViewport.displayName = ScrollAreaPrimitive.Viewport.displayName;

const ScrollAreaScrollbar = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('ScrollArea');

  return (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      className={clsx(classNames.scrollbar, className)}
      {...props}
    />
  );
});
ScrollAreaScrollbar.displayName = ScrollAreaPrimitive.Scrollbar.displayName;

const ScrollAreaThumb = forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('ScrollArea');

  return (
    <ScrollAreaPrimitive.Thumb
      ref={ref}
      className={clsx(classNames.thumb, className)}
      {...props}
    />
  );
});
ScrollAreaThumb.displayName = ScrollAreaPrimitive.Thumb.displayName;

/** @public */
export const ScrollArea = {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
  Scrollbar: ScrollAreaScrollbar,
  Thumb: ScrollAreaThumb,
};
