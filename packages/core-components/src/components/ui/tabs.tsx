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
import { Tabs as TabsPrimitive } from 'radix-ui';

import { cn } from '../../lib/utils';

/**
 * Root Tabs container built on the Radix UI Tabs primitive.
 *
 * @remarks
 * Named `ShadcnTabs` (rather than `Tabs`) to avoid a naming collision with the
 * existing Backstage `TabbedLayout` / `Tabs` exports. This is a direct
 * re-export of `TabsPrimitive.Root` and accepts the same props: `value`,
 * `defaultValue`, `onValueChange`, `orientation`, and `dir`.
 *
 * Replaces MUI `Tabs` / `Tab` usage across TabbedLayout, HeaderTabs,
 * TabbedCard, and EntityLayout components.
 *
 * @example
 * ```tsx
 * <ShadcnTabs defaultValue="overview">
 *   <TabsList>
 *     <TabsTrigger value="overview">Overview</TabsTrigger>
 *     <TabsTrigger value="ci-cd">CI / CD</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="overview">…</TabsContent>
 *   <TabsContent value="ci-cd">…</TabsContent>
 * </ShadcnTabs>
 * ```
 *
 * @public
 */
const ShadcnTabs = TabsPrimitive.Root;

/**
 * Horizontal container for tab triggers. Wraps `TabsPrimitive.List` with
 * shadcn/ui new-york styling: rounded-lg muted background, inline-flex
 * layout, and consistent height.
 *
 * @public
 */
const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    data-slot="tabs-list"
    className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * Individual tab trigger button. Wraps `TabsPrimitive.Trigger` with
 * shadcn/ui new-york styling: rounded-md shape, focus-visible ring,
 * active-state background/shadow, and disabled state handling.
 *
 * @remarks
 * Active state is driven by the Radix `data-state="active"` attribute,
 * applying `bg-background`, `text-foreground`, and `shadow`. Focus
 * visibility uses `ring-2 ring-ring ring-offset-2` for keyboard users.
 *
 * @public
 */
const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tabs-trigger"
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background',
      'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Content panel associated with a specific tab trigger. Wraps
 * `TabsPrimitive.Content` with shadcn/ui new-york styling: top margin for
 * visual separation and focus-visible ring for keyboard accessibility.
 *
 * @remarks
 * Uses `forceMount` to keep all tab panels in the DOM at all times. This
 * prevents dangling `aria-controls` references on tab triggers — which
 * would otherwise confuse assistive technology (WCAG 4.1.2 Name/Role/Value).
 * Inactive panels are hidden via `data-[state=inactive]:hidden` so they
 * are not visible or focusable, but remain in the DOM for ARIA reference.
 *
 * Focus rings use `ring-offset-background` to maintain consistent offset
 * coloring with the theme.
 *
 * @public
 */
const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tabs-content"
    forceMount
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'data-[state=inactive]:hidden',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { ShadcnTabs, TabsList, TabsTrigger, TabsContent };
