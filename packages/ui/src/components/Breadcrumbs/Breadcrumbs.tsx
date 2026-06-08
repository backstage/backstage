/*
 * Copyright 2026 The Backstage Authors
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

import { Children, cloneElement, isValidElement, useEffect } from 'react';
import { Breadcrumbs as RACBreadcrumbs } from 'react-aria-components';
import { useDefinition } from '../../hooks';
import { BreadcrumbsDefinition } from './definition';
import { Breadcrumb } from './Breadcrumb';
import { CollapsedBreadcrumb } from './CollapsedBreadcrumb';
import { BreadcrumbsStyleProvider } from './BreadcrumbsContext';
import type { BreadcrumbProps, BreadcrumbsProps } from './types';

const COLLAPSE_THRESHOLD = 5;
/** number of items at start of breadcrumbs to remain uncollapsed */
const ROOT_ITEMS = 1;
/** number of items after the collapsed crumbs, leading up to the current page */
const LEADING_ITEMS = 1;

/**
 * A breadcrumb navigation bar. Wraps React Aria's Breadcrumbs (`ol`) in a
 * `nav` landmark with an `aria-label` (default `"Breadcrumbs"`).
 * When there are 5 or more items, middle items collapse into an
 * ellipsis menu — the first item and last two items stay visible.
 *
 * @public
 */
export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    BreadcrumbsDefinition,
    props,
  );
  const {
    'aria-label': ariaLabel = 'Breadcrumbs',
    currentAs,
    separator,
    variant,
    color,
    weight,
    classes,
    children,
  } = ownProps;

  const contextValue = { variant, color, weight, separator };

  const childArray = Children.toArray(children);

  const filteredChildren = childArray
    .filter(isValidElement)
    .filter(
      child => child.type === Breadcrumb,
    ) as React.ReactElement<BreadcrumbProps>[];

  const invalidCount = childArray.length - filteredChildren.length;
  useEffect(() => {
    if (invalidCount > 0) {
      console.warn(
        `Breadcrumbs: only Breadcrumb children are supported. Found ${invalidCount} non-Breadcrumb children`,
      );
    }
  }, [invalidCount]);

  const initialNumChildren = filteredChildren.length;

  const currentPage = filteredChildren.pop();
  if (!currentPage) return null;

  const currentPageWithAs =
    currentAs && currentPage
      ? cloneElement(currentPage, { as: currentAs })
      : currentPage;

  let renderedChildren: React.ReactNode;

  if (initialNumChildren >= COLLAPSE_THRESHOLD) {
    const root = filteredChildren.splice(0, ROOT_ITEMS);
    const leading = filteredChildren.splice(-LEADING_ITEMS);
    // filteredChildren is now just the collapsed items

    const menuItems = filteredChildren.map(child => ({
      href: child.props.href,
      label: child.props.children,
    }));

    renderedChildren = [
      ...root,
      <CollapsedBreadcrumb
        key="__bui-breadcrumb-ellipsis"
        items={menuItems}
        ellipsisClassName={classes.ellipsis}
        triggerClassName={classes.ellipsisTrigger}
        separatorClassName={classes.separator}
      />,
      ...leading,
      currentPageWithAs,
    ];
  } else {
    renderedChildren = [...filteredChildren, currentPageWithAs];
  }

  return (
    <BreadcrumbsStyleProvider value={contextValue}>
      <nav aria-label={ariaLabel}>
        <RACBreadcrumbs
          className={classes.root}
          {...dataAttributes}
          {...restProps}
        >
          {renderedChildren}
        </RACBreadcrumbs>
      </nav>
    </BreadcrumbsStyleProvider>
  );
};
