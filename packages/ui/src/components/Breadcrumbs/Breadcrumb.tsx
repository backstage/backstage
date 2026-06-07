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

import { Breadcrumb as RACBreadcrumb } from 'react-aria-components';
import { Focusable } from 'react-aria';
import { RiArrowRightSLine } from '@remixicon/react';
import { useDefinition, useIsTruncated } from '../../hooks';
import { useResolvedHref } from '../../hooks/useResolvedHref';
import { BreadcrumbDefinition } from './definition';
import { Tooltip, TooltipTrigger } from '../Tooltip';
import { useBreadcrumbsStyle } from './BreadcrumbsContext';
import type { BreadcrumbProps, BreadcrumbStyleProps } from './types';
import { Text } from '../Text';
import type { TextOwnProps } from '../Text';
import { Link } from '../Link';

function BreadcrumbContent(
  props: {
    as?: TextOwnProps['as'];
    href?: string;
    isCurrent: boolean;
    labelClassName: string;
    currentClassName: string;
    children: React.ReactNode;
  } & BreadcrumbStyleProps,
) {
  const {
    as,
    href,
    isCurrent,
    variant,
    color,
    weight,
    labelClassName,
    currentClassName,
    children,
  } = props;
  const { ref, truncated } = useIsTruncated<
    HTMLParagraphElement | HTMLAnchorElement
  >();
  const className = `${labelClassName}${
    isCurrent ? ` ${currentClassName}` : ''
  }`;

  const content =
    href && !isCurrent ? (
      <Link
        truncate
        standalone
        href={href}
        variant={variant}
        color={color}
        weight={weight}
        className={className}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
      </Link>
    ) : (
      <Focusable>
        <Text
          truncate
          as={as}
          variant={variant}
          color={color}
          weight={weight}
          className={className}
          ref={ref as React.Ref<HTMLParagraphElement>}
        >
          {children}
        </Text>
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
  const { classes, as, href, variant, color, weight, children } = ownProps;
  const defaults = useBreadcrumbsStyle();
  const resolvedVariant = variant ?? defaults.variant;
  const resolvedColor = color ?? defaults.color;
  const resolvedWeight = weight ?? defaults.weight;
  const resolvedHref = useResolvedHref(href);
  const separatorColor = `var(--bui-fg-${defaults.color ?? 'primary'})`;
  const separator = defaults.separator ?? (
    <RiArrowRightSLine color={separatorColor} />
  );

  return (
    <RACBreadcrumb
      className={classes.root}
      data-variant={resolvedVariant}
      {...dataAttributes}
      {...restProps}
    >
      {({ isCurrent }) => (
        <>
          <BreadcrumbContent
            as={as}
            href={resolvedHref}
            isCurrent={isCurrent}
            variant={resolvedVariant}
            color={resolvedColor}
            weight={resolvedWeight}
            labelClassName={classes.label}
            currentClassName={classes.current}
          >
            {children}
          </BreadcrumbContent>
          {!isCurrent && (
            <span aria-hidden="true" className={classes.separator}>
              {separator}
            </span>
          )}
        </>
      )}
    </RACBreadcrumb>
  );
};
