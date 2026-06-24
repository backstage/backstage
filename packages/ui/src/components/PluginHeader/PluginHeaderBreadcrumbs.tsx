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

import type { PluginHeaderBreadcrumbEntry } from './types';
import { Link } from '../Link';
import { Text } from '../Text';
import { MenuTrigger, Menu, MenuItem } from '../Menu';
import { RiArrowRightSLine } from '@remixicon/react';
import {
  Focusable,
  Breadcrumb as RACBreadcrumb,
  Breadcrumbs as RACBreadcrumbs,
  Button as RACButton,
} from 'react-aria-components';
import { useIsTruncated } from './useIsTruncated';
import { Tooltip, TooltipTrigger } from '../Tooltip';

const COLLAPSE_THRESHOLD = 5;
const ROOT_ITEMS = 1;
const LEADING_ITEMS = 1;

/** Separator icon that appears after non-current segments */
function BreadcrumbSeparator() {
  return (
    <span aria-hidden="true">
      <RiArrowRightSLine size={16} />
    </span>
  );
}

/** Wraps children in a tooltip that shows on hover when the label is truncated. */
function BreadcrumbTooltipWrapper(props: {
  showTooltip: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const { showTooltip, label, children } = props;

  return (
    <TooltipTrigger delay={300} isDisabled={!showTooltip}>
      {children}
      <Tooltip>{label}</Tooltip>
    </TooltipTrigger>
  );
}

/** Renders a link in the breadcrumbs trail */
function BreadcrumbLink(props: { entry: PluginHeaderBreadcrumbEntry }) {
  const { entry } = props;
  const { ref, truncated } = useIsTruncated<HTMLAnchorElement>();
  return (
    <BreadcrumbTooltipWrapper label={entry.label} showTooltip={truncated}>
      <Link
        href={entry.href}
        standalone
        variant="body-medium"
        truncate
        ref={ref}
      >
        {entry.label}
      </Link>
    </BreadcrumbTooltipWrapper>
  );
}

/**
 * Renders a text in the breadcrumbs trail.
 * If it is truncated, it becomes focusable (requirement for the tooltip to work)
 */
function BreadcrumbText(props: { entry: PluginHeaderBreadcrumbEntry }) {
  const { entry } = props;
  const { ref, truncated } = useIsTruncated<HTMLParagraphElement>();

  return (
    <BreadcrumbTooltipWrapper label={entry.label} showTooltip={truncated}>
      <Focusable excludeFromTabOrder={!truncated}>
        <Text variant="body-medium" truncate ref={ref}>
          {entry.label}
        </Text>
      </Focusable>
    </BreadcrumbTooltipWrapper>
  );
}

/** Renders an ellipsis button that opens a menu with the collapsed breadcrumb items. */
function CollapsedSegment(props: {
  items: PluginHeaderBreadcrumbEntry[];
  ellipsisClassName?: string;
}) {
  const { items, ellipsisClassName } = props;
  const ariaLabel = 'Show more breadcrumbs';
  return (
    <RACBreadcrumb key="collapsed">
      <MenuTrigger>
        <RACButton aria-label={ariaLabel} className={ellipsisClassName}>
          <Text as="span" variant="body-medium">
            …
          </Text>
        </RACButton>
        <Menu>
          {items.map(item => (
            <MenuItem key={item.href} href={item.href}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
      <BreadcrumbSeparator />
    </RACBreadcrumb>
  );
}

/** Renders a non-current breadcrumb segment as a link with a trailing separator. */
function AncestorSegment(props: { entry: PluginHeaderBreadcrumbEntry }) {
  const { entry } = props;
  return (
    <RACBreadcrumb key={entry.href}>
      <BreadcrumbLink entry={entry} />
      <BreadcrumbSeparator />
    </RACBreadcrumb>
  );
}

/**
 * Renders the current page in the breadcrumbs trail
 * - RAC Breadcrumbs will attach `data-current` to this segment
 * - If it's the only entry (eg. we are on the root page of the Plugin), it will render as a link
 * - Otherwise renders as text
 * - If truncated, will be focusable and show a breadcrumb
 */
function CurrentSegment(props: {
  entry: PluginHeaderBreadcrumbEntry;
  isSingleEntry: boolean;
}) {
  const { entry, isSingleEntry } = props;
  return (
    <RACBreadcrumb key={entry.href}>
      {isSingleEntry ? (
        <BreadcrumbLink entry={entry} />
      ) : (
        <BreadcrumbText entry={entry} />
      )}
    </RACBreadcrumb>
  );
}

/**
 * Renders a breadcrumb navigation trail from an ordered list of entries.
 *
 * - Uses RAC Breadcrumb and Breadcrumbs internally for a11y utils
 * - A single entry renders as a clickable link (plugin root page).
 * - Multiple entries render ancestors as links and the last entry as plain text.
 * - When there are {@link COLLAPSE_THRESHOLD} or more entries, middle items
 *   collapse behind an ellipsis menu, keeping the root and leading items visible.
 *
 * @internal
 */
export function PluginHeaderBreadcrumbs(props: {
  entries: PluginHeaderBreadcrumbEntry[];
  className?: string;
  ellipsisClassName?: string;
}) {
  const { entries, className, ellipsisClassName } = props;

  if (entries.length === 0) return null;

  const isSingleEntry = entries.length === 1;
  const current = entries[entries.length - 1];
  const rest = entries.slice(0, -1);

  let ancestorItems: React.ReactNode = null;

  if (entries.length >= COLLAPSE_THRESHOLD) {
    const root = rest.slice(0, ROOT_ITEMS);
    const leading = rest.slice(-LEADING_ITEMS);
    const collapsed = rest.slice(ROOT_ITEMS, -LEADING_ITEMS);

    ancestorItems = (
      <>
        {root.map(entry => (
          <AncestorSegment key={entry.href} entry={entry} />
        ))}
        <CollapsedSegment
          items={collapsed}
          ellipsisClassName={ellipsisClassName}
        />
        {leading.map(entry => (
          <AncestorSegment key={entry.href} entry={entry} />
        ))}
      </>
    );
  } else {
    ancestorItems = rest.map(entry => (
      <AncestorSegment key={entry.href} entry={entry} />
    ));
  }

  return (
    <nav id="Breadcrumbs" aria-label="Breadcrumbs" className={className}>
      <RACBreadcrumbs>
        {ancestorItems}
        <CurrentSegment entry={current} isSingleEntry={isSingleEntry} />
      </RACBreadcrumbs>
    </nav>
  );
}
