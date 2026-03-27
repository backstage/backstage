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
import { Slot } from 'radix-ui';
import { ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '../../lib/utils';

/**
 * Root breadcrumb navigation container.
 *
 * @remarks
 * Renders a `<nav>` landmark with `aria-label="breadcrumb"` for assistive
 * technologies. Wraps the entire breadcrumb trail and provides semantic
 * navigation context.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbLink href="/">Home</BreadcrumbLink>
 *     </BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem>
 *       <BreadcrumbPage>Current</BreadcrumbPage>
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 *
 * @public
 */
const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    /** Optional custom separator element rendered between items */
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
));
Breadcrumb.displayName = 'Breadcrumb';

/**
 * Ordered list wrapper inside a Breadcrumb.
 *
 * @remarks
 * Renders an `<ol>` element styled as a horizontal flex layout with
 * responsive gap spacing. Provides the list context for breadcrumb items.
 *
 * @public
 */
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    data-slot="breadcrumb-list"
    className={cn(
      'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
      className,
    )}
    {...props}
  />
));
BreadcrumbList.displayName = 'BreadcrumbList';

/**
 * Individual breadcrumb item container.
 *
 * @remarks
 * Renders an `<li>` element within the breadcrumb list. Each item typically
 * contains either a {@link BreadcrumbLink} or a {@link BreadcrumbPage}.
 *
 * @public
 */
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="breadcrumb-item"
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

/**
 * Breadcrumb link component with asChild composition support.
 *
 * @remarks
 * When `asChild` is false (default), renders a native `<a>` anchor element.
 * When `asChild` is true, uses Radix UI's {@link Slot} primitive to merge
 * all link props (className, href, ref, etc.) into the child element. This
 * enables composing BreadcrumbLink with React Router's `<Link>` for
 * client-side navigation.
 *
 * @example
 * ```tsx
 * // Native anchor
 * <BreadcrumbLink href="/catalog">Catalog</BreadcrumbLink>
 *
 * // React Router Link via asChild
 * <BreadcrumbLink asChild>
 *   <Link to="/catalog">Catalog</Link>
 * </BreadcrumbLink>
 * ```
 *
 * @public
 */
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    /** When true, merges props into child element instead of rendering an anchor */
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : 'a';

  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn('transition-colors hover:text-foreground', className)}
      {...(props as React.HTMLAttributes<HTMLAnchorElement>)}
    />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

/**
 * Non-interactive breadcrumb label representing the current page.
 *
 * @remarks
 * Renders with `aria-current="page"` and `aria-disabled="true"` to
 * indicate the current location in the breadcrumb trail. Styled distinctly
 * from links to visually communicate that it is not clickable.
 *
 * @public
 */
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    data-slot="breadcrumb-page"
    className={cn('font-normal text-foreground', className)}
    {...props}
  />
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

/**
 * Visual separator between breadcrumb items.
 *
 * @remarks
 * Renders a `<li>` with `role="presentation"` and `aria-hidden="true"` so
 * screen readers skip it. Defaults to a {@link ChevronRight} icon when no
 * children are provided. SVG children are sized to 3.5 (14px) via CSS
 * child selectors.
 *
 * @public
 */
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => (
  <li
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-separator"
    className={cn('[&>svg]:h-3.5 [&>svg]:w-3.5', className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

/**
 * Ellipsis indicator for collapsed breadcrumb items.
 *
 * @remarks
 * Renders a {@link MoreHorizontal} icon to indicate that intermediate
 * breadcrumb items have been collapsed due to overflow. Includes a
 * visually hidden "More" label for screen reader accessibility.
 *
 * @public
 */
const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    role="presentation"
    aria-hidden="true"
    data-slot="breadcrumb-ellipsis"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
