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

import { Children, createContext, isValidElement, useContext } from 'react';
import { Button as RACButton } from 'react-aria-components';
import { RiArrowRightSLine } from '@remixicon/react';
import { useDefinition, useIsTruncated } from '../../hooks';
import {
  BreadcrumbsDefinition,
  BreadcrumbSegmentDefinition,
  BreadcrumbCurrentDefinition,
} from './definition';
import { Tooltip, TooltipTrigger } from '../Tooltip';
import { Link } from '../Link';
import { Text } from '../Text';
import { MenuTrigger, Menu, MenuItem } from '../Menu';
import type {
  BreadcrumbTextProps,
  BreadcrumbSegmentProps,
  BreadcrumbCurrentProps,
  BreadcrumbsProps,
} from './types';

const BreadcrumbsContext = createContext<BreadcrumbTextProps>({});

/**
 * A breadcrumb segment that renders as a link.
 * A tooltip is shown when the text is truncated.
 *
 * @public
 */
export const BreadcrumbSegment = (props: BreadcrumbSegmentProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    BreadcrumbSegmentDefinition,
    props,
  );
  const { classes, href, variant, weight, color, children } = ownProps;
  const ctx = useContext(BreadcrumbsContext);
  const { ref, truncated } = useIsTruncated();

  return (
    <li className={classes.root} {...dataAttributes} {...restProps}>
      <TooltipTrigger delay={300} isDisabled={!truncated}>
        <Link
          href={href}
          className={classes.label}
          ref={ref as React.Ref<HTMLAnchorElement>}
          variant={variant ?? ctx.variant}
          weight={weight ?? ctx.weight}
          color={color ?? ctx.color}
          standalone
          truncate
        >
          {children}
        </Link>
        <Tooltip>{children}</Tooltip>
      </TooltipTrigger>
    </li>
  );
};

/**
 * The current (last) breadcrumb item. Renders as plain text with
 * `aria-current="page"`. Supports the `as` prop for semantic elements.
 * A tooltip is shown when the text is truncated.
 *
 * @public
 */
export const BreadcrumbCurrent = (props: BreadcrumbCurrentProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    BreadcrumbCurrentDefinition,
    props,
  );
  const { classes, as, variant, weight, color, children } = ownProps;
  const ctx = useContext(BreadcrumbsContext);
  const { ref, truncated } = useIsTruncated();
  const className = `${classes.label} ${classes.current}`;

  return (
    <li
      className={classes.root}
      aria-current="page"
      data-current
      {...dataAttributes}
      {...restProps}
    >
      <TooltipTrigger delay={300} isDisabled={!truncated}>
        <Text
          as={as}
          className={className}
          ref={ref as React.Ref<HTMLElement>}
          variant={variant ?? ctx.variant}
          weight={weight ?? ctx.weight}
          color={color ?? ctx.color}
          truncate
        >
          {children}
        </Text>
        <Tooltip>{children}</Tooltip>
      </TooltipTrigger>
    </li>
  );
};

const COLLAPSE_THRESHOLD = 5;
const ITEMS_BEFORE = 1;
const ITEMS_AFTER = 2;

function CollapsedBreadcrumb(props: {
  items: Array<{ href?: string; label: React.ReactNode }>;
  ellipsisClassName: string;
  triggerClassName: string;
}) {
  return (
    <li className={props.ellipsisClassName}>
      <MenuTrigger>
        <RACButton
          className={props.triggerClassName}
          aria-label="Show more breadcrumbs"
        >
          …
        </RACButton>
        <Menu>
          {props.items.map((item, i) => (
            <MenuItem key={i} href={item.href}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
    </li>
  );
}

function interleave(
  items: React.ReactNode[],
  separator: React.ReactNode,
): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  items.forEach((child, i) => {
    result.push(child);
    if (i < items.length - 1) {
      result.push(
        <li key={`__bui-sep-${i}`} role="presentation" aria-hidden="true">
          {separator}
        </li>,
      );
    }
  });
  return result;
}

/**
 * A breadcrumb navigation bar.
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
  const { classes, separator, variant, weight, color, children } = ownProps;

  const childArray = Children.toArray(children).filter(isValidElement);
  const totalItems = childArray.length;
  let items: React.ReactNode[];

  if (totalItems >= COLLAPSE_THRESHOLD) {
    const beforeItems = childArray.slice(0, ITEMS_BEFORE);
    const collapsedItems = childArray.slice(
      ITEMS_BEFORE,
      totalItems - ITEMS_AFTER,
    );
    const afterItems = childArray.slice(totalItems - ITEMS_AFTER);

    const menuItems = collapsedItems.map(child => ({
      href: (child.props as BreadcrumbSegmentProps).href,
      label: (child.props as BreadcrumbSegmentProps).children,
    }));

    items = [
      ...beforeItems,
      <CollapsedBreadcrumb
        key="__bui-breadcrumb-ellipsis"
        items={menuItems}
        ellipsisClassName={classes.ellipsis}
        triggerClassName={classes.ellipsisTrigger}
      />,
      ...afterItems,
    ];
  } else {
    items = childArray;
  }

  const separatorNode = (
    <span className={classes.separator} aria-hidden="true">
      {separator ?? <RiArrowRightSLine />}
    </span>
  );

  return (
    <BreadcrumbsContext.Provider value={{ variant, weight, color }}>
      <nav aria-label="Breadcrumbs" {...dataAttributes} {...restProps}>
        <ol className={classes.root}>{interleave(items, separatorNode)}</ol>
      </nav>
    </BreadcrumbsContext.Provider>
  );
};
