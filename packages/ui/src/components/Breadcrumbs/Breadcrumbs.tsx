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
  Link,
} from 'react-aria-components';
import { Focusable } from 'react-aria';
import { RiArrowRightSLine } from '@remixicon/react';
import { useDefinition, useIsTruncated } from '../../hooks';
import { BreadcrumbsDefinition, BreadcrumbDefinition } from './definition';
import { Tooltip, TooltipTrigger } from '../Tooltip';
import type { BreadcrumbProps, BreadcrumbsProps } from './types';

function BreadcrumbContent(props: {
  href?: string;
  isCurrent: boolean;
  labelClassName: string;
  currentClassName: string;
  children: React.ReactNode;
}) {
  const { href, isCurrent, labelClassName, currentClassName, children } = props;
  const { ref, truncated, checkTruncation } = useIsTruncated();
  const className = `${labelClassName}${
    isCurrent ? ` ${currentClassName}` : ''
  }`;

  const content =
    href && !isCurrent ? (
      <Link
        href={href}
        className={className}
        ref={ref as React.Ref<HTMLAnchorElement>}
        onHoverStart={checkTruncation}
        onFocus={checkTruncation}
      >
        {children}
      </Link>
    ) : (
      <Focusable>
        <span
          className={className}
          ref={ref as React.Ref<HTMLSpanElement>}
          onMouseEnter={checkTruncation}
          onFocus={checkTruncation}
        >
          {children}
        </span>
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
  const { ownProps } = useDefinition(BreadcrumbDefinition, props);
  const { classes, href, children } = ownProps;

  return (
    <RACBreadcrumb className={classes.root}>
      {({ isCurrent }) => (
        <>
          <BreadcrumbContent
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

/**
 * A breadcrumb navigation bar built on React Aria's Breadcrumbs.
 *
 * @public
 */
export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { ownProps } = useDefinition(BreadcrumbsDefinition, props);
  const { classes } = ownProps;

  return (
    <RACBreadcrumbs className={classes.root}>{props.children}</RACBreadcrumbs>
  );
};
