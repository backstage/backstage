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

import {
  Breadcrumbs as RACBreadcrumbs,
  Breadcrumb as RACBreadcrumb,
  Button as RACButton,
  Focusable,
} from 'react-aria-components';
import { Link } from '../Link';
import { Text } from '../Text';
import { RiArrowRightSLine } from '@remixicon/react';
import { useIsTruncated } from './useIsTruncated';
import { Tooltip, TooltipTrigger } from '../Tooltip';
import { Menu, MenuItem, MenuTrigger } from '../Menu';
import type { BreadcrumbEntry } from './types';

const COLLAPSE_THRESHOLD = 5;
const BEFORE_ITEMS = 1;
const AFTER_ITEMS = 2;

export type PluginHeaderBreadcrumbsProps = {
  entries: BreadcrumbEntry[];
  classes: {
    breadcrumbs: string;
    breadcrumbsSeparator: string;
  };
};

/**
 * A breadcrumb navigation bar. Wraps React Aria's Breadcrumbs (`ol`) in a
 * `nav` landmark.
 * When there are 5 or more items, middle items collapse into an
 * ellipsis menu — the first item and last two items stay visible.
 *
 * @private
 */
export const PluginHeaderBreadcrumbs = (
  props: PluginHeaderBreadcrumbsProps,
) => {
  const { entries, classes } = props;

  if (entries.length < COLLAPSE_THRESHOLD) {
    return (
      <nav aria-label="Breadcrumbs" className={classes.breadcrumbs}>
        <RACBreadcrumbs>
          {entries.map((entry, i) => (
            <BreadcrumbSegment
              entry={entry}
              key={entry.href}
              isCurrent={i === entries.length - 1}
              separatorClassName={classes.breadcrumbsSeparator}
            />
          ))}
        </RACBreadcrumbs>
      </nav>
    );
  } else {
    const before = entries.slice(0, BEFORE_ITEMS);
    const collapsed = entries.slice(BEFORE_ITEMS, entries.length - AFTER_ITEMS);
    const after = entries.slice(entries.length - AFTER_ITEMS, entries.length);

    return (
      <nav aria-label="Breadcrumbs" className={classes.breadcrumbs}>
        <RACBreadcrumbs>
          {before.map(entry => (
            <BreadcrumbSegment
              entry={entry}
              isCurrent={false}
              key={entry.href}
              separatorClassName={classes.breadcrumbsSeparator}
            />
          ))}
          <CollapsedBreadcrumbs
            entries={collapsed}
            key="collapsed-breadcrumbs"
            separatorClassName={classes.breadcrumbsSeparator}
          />
          {after.map((entry, i) => (
            <BreadcrumbSegment
              entry={entry}
              isCurrent={i === after.length - 1}
              key={entry.href}
              separatorClassName={classes.breadcrumbsSeparator}
            />
          ))}
        </RACBreadcrumbs>
      </nav>
    );
  }
};

/**
 * A single breadcrumb `li`.
 * - Content of the `li` is:
 *   - when item is not the current page -- `a` with a separator icon
 *   - when item is current page -- `span`
 * - A tooltip is shown when the text is truncated.
 *
 * @private
 */
const BreadcrumbSegment = (props: {
  entry: BreadcrumbEntry;
  isCurrent: boolean;
  separatorClassName: string;
}) => {
  const { entry, isCurrent, separatorClassName } = props;
  const { ref, truncated } = useIsTruncated<
    HTMLParagraphElement | HTMLAnchorElement
  >();

  let content;

  if (!isCurrent) {
    content = (
      <>
        <TooltipTrigger delay={300}>
          <Link
            href={entry.href}
            standalone
            variant="body-medium"
            ref={ref as React.Ref<HTMLAnchorElement>}
          >
            {entry.label}
          </Link>
          <Tooltip>{entry.label}</Tooltip>
        </TooltipTrigger>
        <BreadcrumbSeparator className={separatorClassName} />
      </>
    );
  } else {
    content = truncated ? (
      <TooltipTrigger delay={300}>
        <Focusable>
          <Text
            as="span"
            variant="body-medium"
            ref={ref as React.Ref<HTMLParagraphElement>}
          >
            {entry.label}
          </Text>
        </Focusable>
        <Tooltip>{entry.label}</Tooltip>
      </TooltipTrigger>
    ) : (
      <Text
        as="span"
        variant="body-medium"
        ref={ref as React.Ref<HTMLParagraphElement>}
      >
        {entry.label}
      </Text>
    );
  }

  return <RACBreadcrumb>{content}</RACBreadcrumb>;
};

const CollapsedBreadcrumbs = (props: {
  entries: BreadcrumbEntry[];
  separatorClassName: string;
}) => {
  const { entries, separatorClassName } = props;
  return (
    <RACBreadcrumb>
      <MenuTrigger>
        {/* Plain button instead of ButtonIcon to avoid padding that shifts the breadcrumb baseline */}
        <RACButton aria-label="Show more breadcrumbs">
          <Text as="span" variant="body-medium">
            …
          </Text>
          <Menu>
            {entries.map((entry, i) => (
              <MenuItem key={i} href={entry.href}>
                {entry.label}
              </MenuItem>
            ))}
          </Menu>
        </RACButton>
      </MenuTrigger>
      <BreadcrumbSeparator className={separatorClassName} />
    </RACBreadcrumb>
  );
};

const BreadcrumbSeparator = (props: { className: string }) => {
  return (
    <span className={props.className} aria-hidden="true">
      <RiArrowRightSLine size={'var(--bui-font-size-3)'} />
    </span>
  );
};
