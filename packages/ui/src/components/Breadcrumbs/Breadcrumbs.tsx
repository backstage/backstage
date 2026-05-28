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

/**
 * Uses RAC Breadcrumbs for accessibility (aria-current, keyboard nav, semantic nav/ol).
 * RAC expects its own primitives as children — substituting BUI Link or Text breaks the
 * ARIA wiring. Underline and typography styles are matched via CSS tokens instead.
 */

import { Children, isValidElement } from 'react';
import {
  Breadcrumbs as RACBreadcrumbs,
  Breadcrumb as RACBreadcrumb,
  Button as RACButton,
  Link,
} from 'react-aria-components';
import { Focusable } from 'react-aria';
import { RiArrowRightSLine } from '@remixicon/react';
import { useDefinition, useIsTruncated } from '../../hooks';
import { BreadcrumbsDefinition, BreadcrumbDefinition } from './definition';
import { Tooltip, TooltipTrigger } from '../Tooltip';
import { MenuTrigger, Menu, MenuItem } from '../Menu';
import type { BreadcrumbProps, BreadcrumbsProps } from './types';
import { TextOwnProps } from '../Text';

function BreadcrumbContent(props: {
  as?: TextOwnProps['as'];
  href?: string;
  isCurrent: boolean;
  labelClassName: string;
  currentClassName: string;
  children: React.ReactNode;
}) {
  const {
    as = 'span',
    href,
    isCurrent,
    labelClassName,
    currentClassName,
    children,
  } = props;
  const Component = as as React.ElementType;
  const { ref, truncated } = useIsTruncated();
  const className = `${labelClassName}${
    isCurrent ? ` ${currentClassName}` : ''
  }`;

  const content =
    href && !isCurrent ? (
      <Link
        href={href}
        className={className}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
      </Link>
    ) : (
      <Focusable>
        <Component className={className} ref={ref}>
          {children}
        </Component>
      </Focusable>
    );

  return (
    <TooltipTrigger delay={300} isDisabled={!truncated}>
      {content}
      <Tooltip>{children}</Tooltip>
    </TooltipTrigger>
  );
}

/**
 * A single breadcrumb item. Renders as a link when `href` is provided,
 * or as plain text for the current (last) item. The chevron separator
 * is rendered automatically for non-current items. A tooltip is shown
 * when the text is truncated.
 *
 * @public
 */
export const Breadcrumb = (props: BreadcrumbProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    BreadcrumbDefinition,
    props,
  );
  const { classes, as, href, children } = ownProps;

  return (
    <RACBreadcrumb className={classes.root} {...dataAttributes} {...restProps}>
      {({ isCurrent }) => (
        <>
          <BreadcrumbContent
            as={as}
            href={href}
            isCurrent={isCurrent}
            labelClassName={classes.label}
            currentClassName={classes.current}
          >
            {children}
          </BreadcrumbContent>
          {!isCurrent && (
            <RiArrowRightSLine
              className={classes.separator}
              aria-hidden="true"
            />
          )}
        </>
      )}
    </RACBreadcrumb>
  );
};

const COLLAPSE_THRESHOLD = 5;
const ITEMS_BEFORE = 1;
const ITEMS_AFTER = 2;

function CollapsedBreadcrumb(props: {
  items: Array<{ href?: string; label: React.ReactNode }>;
  ellipsisClassName: string;
  triggerClassName: string;
  separatorClassName: string;
}) {
  const { items, ellipsisClassName, triggerClassName, separatorClassName } =
    props;

  return (
    <RACBreadcrumb className={ellipsisClassName}>
      <MenuTrigger>
        {/* Plain button instead of ButtonIcon to avoid padding that shifts the breadcrumb baseline */}
        <RACButton
          className={triggerClassName}
          aria-label="Show more breadcrumbs"
        >
          …
        </RACButton>
        <Menu>
          {items.map((item, i) => (
            <MenuItem key={i} href={item.href}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
      <RiArrowRightSLine className={separatorClassName} aria-hidden="true" />
    </RACBreadcrumb>
  );
}

/**
 * A breadcrumb navigation bar built on React Aria's Breadcrumbs.
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
  const { classes, children } = ownProps;

  const childArray = Children.toArray(children).filter(isValidElement);
  let renderedChildren: React.ReactNode = children;

  if (childArray.length >= COLLAPSE_THRESHOLD) {
    const beforeItems = childArray.slice(0, ITEMS_BEFORE);
    const collapsedItems = childArray.slice(
      ITEMS_BEFORE,
      childArray.length - ITEMS_AFTER,
    );
    const afterItems = childArray.slice(childArray.length - ITEMS_AFTER);

    const menuItems = collapsedItems.map(child => ({
      href: (child.props as BreadcrumbProps).href,
      label: (child.props as BreadcrumbProps).children,
    }));

    renderedChildren = [
      ...beforeItems,
      <CollapsedBreadcrumb
        key="__bui-breadcrumb-ellipsis"
        items={menuItems}
        ellipsisClassName={classes.ellipsis}
        triggerClassName={classes.ellipsisTrigger}
        separatorClassName={classes.separator}
      />,
      ...afterItems,
    ];
  }

  return (
    <RACBreadcrumbs className={classes.root} {...dataAttributes} {...restProps}>
      {renderedChildren}
    </RACBreadcrumbs>
  );
};
