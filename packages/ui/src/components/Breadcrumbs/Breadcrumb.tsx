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
 * Uses RAC Breadcrumb for accessibility (aria-current, keyboard nav, semantic nav/ol).
 * RAC expects its own primitives as children — substituting BUI Link or Text breaks the
 * ARIA wiring. Underline and typography styles are matched via CSS tokens instead.
 */

import { Breadcrumb as RACBreadcrumb, Link } from 'react-aria-components';
import { Focusable } from 'react-aria';
import { RiArrowRightSLine } from '@remixicon/react';
import { useDefinition, useIsTruncated } from '../../hooks';
import { useResolvedHref } from '../../hooks/useResolvedHref';
import { BreadcrumbDefinition } from './definition';
import { Tooltip, TooltipTrigger } from '../Tooltip';
import type { BreadcrumbProps } from './types';
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
 * A single breadcrumb `li`.
 * - Content of the `li` is:
 *   - `a` when `href` is provided & the item is not last (current page). Otherwise plain text (defaults to `span`, unless passed the `as` prop)
 *   - Ends with a separator icon if item is not last (current page)
 * - A tooltip is shown when the text is truncated.
 *
 * @public
 */
export const Breadcrumb = (props: BreadcrumbProps) => {
  const { ownProps, restProps, dataAttributes } = useDefinition(
    BreadcrumbDefinition,
    props,
  );
  const { classes, as, href, children } = ownProps;
  const resolvedHref = useResolvedHref(href);

  return (
    <RACBreadcrumb className={classes.root} {...dataAttributes} {...restProps}>
      {({ isCurrent }) => (
        <>
          <BreadcrumbContent
            as={as}
            href={resolvedHref}
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
