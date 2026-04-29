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

import type { HeaderProps } from './types';
import { Text } from '../Text';
import { RiArrowRightSLine } from '@remixicon/react';
import { HeaderNav } from './HeaderNav';
import { useDefinition } from '../../hooks/useDefinition';
import { HeaderDefinition } from './definition';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { Lexer } from 'marked';
import { Link } from '../Link';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

const getScrollParent = (element: HTMLElement | null): Element | null => {
  let parent = element?.parentElement;

  while (parent) {
    const { overflow, overflowX, overflowY } = window.getComputedStyle(parent);

    if (
      /(auto|scroll|overlay|hidden)/.test(`${overflow}${overflowX}${overflowY}`)
    ) {
      return parent;
    }

    parent = parent.parentElement;
  }

  return null;
};

const isStickySentinelOutOfView = (
  sentinel: HTMLElement,
  root: Element | null,
) => {
  const sentinelRect = sentinel.getBoundingClientRect();
  const rootTop = root ? root.getBoundingClientRect().top : 0;

  return sentinelRect.bottom <= rootTop;
};

/**
 * Parses inline Markdown links in a string and returns an array of React nodes.
 * URLs are sanitized via `@braintree/sanitize-url`; unsafe URLs are rendered as
 * plain text. Uses `marked` instead of `react-markdown` to avoid ESM issues.
 */
function renderInlineMarkdown(text: string): React.ReactNode[] {
  return Lexer.lexInline(text).map((token, i) => {
    if (token.type === 'link') {
      const href = sanitizeUrl(token.href);
      if (href === 'about:blank') return token.text;
      return (
        <Link key={i} href={href} standalone>
          {token.text}
        </Link>
      );
    }
    return token.raw;
  });
}

/**
 * A secondary header with title, breadcrumbs, tabs, and actions.
 *
 * @public
 */
export const Header = (props: HeaderProps) => {
  const { ownProps, dataAttributes } = useDefinition(HeaderDefinition, props, {
    classNameTarget: 'content',
  });
  const {
    classes,
    title,
    tabs,
    activeTabId,
    customActions,
    breadcrumbs,
    description,
    tags,
    metadata,
    sticky,
  } = ownProps;

  const descriptionNodes = useMemo(
    () => (description ? renderInlineMarkdown(description) : null),
    [description],
  );

  // The sentinel sits directly before the sticky content and leaves the
  // viewport when the content becomes stuck, letting us toggle stuck styling.
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    if (!sticky) {
      setIsStuck(false);
      return;
    }

    const sentinel = stickySentinelRef.current;
    if (!sentinel) {
      return;
    }

    const root = getScrollParent(sentinel);

    if (typeof IntersectionObserver === 'undefined') {
      const updateStuckState = () => {
        setIsStuck(isStickySentinelOutOfView(sentinel, root));
      };
      const scrollTarget = root ?? window;

      updateStuckState();
      scrollTarget.addEventListener('scroll', updateStuckState, {
        passive: true,
      });
      window.addEventListener('resize', updateStuckState);

      return () => {
        scrollTarget.removeEventListener('scroll', updateStuckState);
        window.removeEventListener('resize', updateStuckState);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { root, threshold: 0 },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [sticky]);

  return (
    <>
      <div className={classes.headerTop} data-sticky={sticky || undefined}>
        {tags && tags.length > 0 && (
          <ul className={classes.tags}>
            {tags.map((tag, i) => (
              <li
                key={`${i}:${tag.label}:${tag.href ?? ''}`}
                className={classes.tag}
              >
                {tag.href ? (
                  <Link
                    href={tag.href}
                    variant="body-medium"
                    color="secondary"
                    standalone
                  >
                    {tag.label}
                  </Link>
                ) : (
                  <Text variant="body-medium" color="secondary">
                    {tag.label}
                  </Text>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {sticky && (
        <div
          ref={stickySentinelRef}
          className={classes.stickySentinel}
          data-sticky=""
          aria-hidden="true"
        />
      )}
      <div
        className={classes.content}
        data-sticky={sticky || undefined}
        data-stuck={isStuck || undefined}
        data-has-tags={tags && tags.length > 0 ? '' : undefined}
        {...dataAttributes}
      >
        <div className={classes.titleStack}>
          {isStuck ? (
            <div className={classes.breadcrumbsSmall}>
              {breadcrumbs &&
                breadcrumbs.map(breadcrumb => (
                  <Fragment key={breadcrumb.label}>
                    <Link
                      href={breadcrumb.href}
                      color="secondary"
                      className={classes.breadcrumbLinkSmall}
                      standalone
                    >
                      {breadcrumb.label}
                    </Link>
                    <RiArrowRightSLine
                      className={classes.breadcrumbSeparator}
                      size={16}
                      color="var(--bui-fg-secondary)"
                    />
                  </Fragment>
                ))}
              <h2 className={classes.titleSmall}>{title}</h2>
            </div>
          ) : (
            <div className={classes.breadcrumbs}>
              {breadcrumbs &&
                breadcrumbs.map(breadcrumb => (
                  <Fragment key={breadcrumb.label}>
                    <Link
                      href={breadcrumb.href}
                      color="secondary"
                      className={classes.breadcrumbLink}
                      standalone
                    >
                      {breadcrumb.label}
                    </Link>
                    <RiArrowRightSLine
                      className={classes.breadcrumbSeparator}
                      size={16}
                      color="var(--bui-fg-secondary)"
                    />
                  </Fragment>
                ))}
              <h2 className={classes.title}>{title}</h2>
            </div>
          )}
        </div>
        <div className={classes.controls}>{customActions}</div>
      </div>
      <div className={classes.headerBottom} data-sticky={sticky || undefined}>
        {description && (
          <Text
            variant="body-medium"
            color="secondary"
            className={classes.description}
          >
            {descriptionNodes}
          </Text>
        )}
        {metadata && metadata.length > 0 && (
          <dl className={classes.metaRow}>
            {metadata.map((item, i) => (
              <div key={`${i}:${item.label}`} className={classes.metaItem}>
                <dt>
                  <Text variant="body-medium" color="secondary">
                    {item.label}
                  </Text>
                </dt>
                <dd>
                  {typeof item.value === 'string' ? (
                    <Text variant="body-medium">{item.value}</Text>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {tabs && (
          <div className={classes.tabsWrapper}>
            <HeaderNav tabs={tabs} activeTabId={activeTabId} />
          </div>
        )}
      </div>
    </>
  );
};

/**
 * @public
 * @deprecated Use {@link Header} instead.
 */
export const HeaderPage = Header;
