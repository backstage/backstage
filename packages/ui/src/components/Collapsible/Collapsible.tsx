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

import { forwardRef } from 'react';
import { Collapsible as CollapsiblePrimitive } from '@base-ui-components/react/collapsible';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';

const CollapsibleRoot = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Collapsible');

  return (
    <CollapsiblePrimitive.Root
      ref={ref}
      className={clsx(classNames.root, className)}
      {...props}
    />
  );
});
CollapsibleRoot.displayName = CollapsiblePrimitive.Root.displayName;

const CollapsibleTrigger = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Collapsible');

  return (
    <CollapsiblePrimitive.Trigger
      ref={ref}
      className={clsx(classNames.trigger, className)}
      {...props}
    />
  );
});
CollapsibleTrigger.displayName = CollapsiblePrimitive.Trigger.displayName;

const CollapsiblePanel = forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Panel>
>(({ className, ...props }, ref) => {
  const { classNames } = useStyles('Collapsible');

  return (
    <CollapsiblePrimitive.Panel
      ref={ref}
      className={clsx(classNames.panel, className)}
      {...props}
    />
  );
});
CollapsiblePanel.displayName = CollapsiblePrimitive.Panel.displayName;

/**
 * Collapsible is a component that allows you to collapse and expand content.
 * It is a wrapper around the CollapsiblePrimitive component from base-ui-components.
 *
 * @public
 */
export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
