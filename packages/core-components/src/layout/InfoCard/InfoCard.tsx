/*
 * Copyright 2020 The Backstage Authors
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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { cn } from '../../lib/utils';
import { createElement, type ReactNode, useMemo } from 'react';
import { BottomLink, BottomLinkProps } from '../BottomLink';
import { ErrorBoundary, ErrorBoundaryProps } from '../ErrorBoundary';

/** @public */
export type InfoCardClassKey =
  | 'noPadding'
  | 'header'
  | 'headerTitle'
  | 'headerSubheader'
  | 'headerAvatar'
  | 'headerAction'
  | 'headerContent';

/** @public */
export type CardActionsTopRightClassKey = 'root';

/**
 * Tailwind class-string equivalents of the previous MUI inline-style variant
 * objects.  Each key in `card` maps to classes applied on the outermost
 * `<Card>` element, while `cardContent` keys are applied on `<CardContent>`.
 */
const VARIANT_STYLES = {
  card: {
    flex: 'flex flex-col',
    fullHeight: 'flex flex-col h-full',
    gridItem:
      'flex flex-col h-[calc(100%-10px)] mb-2.5 break-inside-avoid-page print:h-auto',
  },
  cardContent: {
    fullHeight: 'flex-1',
    gridItem: 'flex-1',
  },
} as const;

/** @public */
export type InfoCardVariants = 'flex' | 'fullHeight' | 'gridItem';

/**
 * InfoCard is used to display a paper-styled block on the screen, similar to a panel.
 *
 * You can custom style an InfoCard with the 'className' (outer container) and 'cardClassName' (inner container)
 * props. This is typically used with Tailwind CSS utility classes or the cn() helper.
 *
 * The InfoCard serves as an error boundary. As a result, if you provide an 'errorBoundaryProps' property this
 * specifies the extra information to display in the error component that is displayed if an error occurs
 * in any descendent components.
 *
 * By default the InfoCard has no custom layout of its children, but is treated as a block element. A
 * couple common variants are provided and can be specified via the variant property:
 *
 * When the InfoCard is displayed as a grid item within a grid, you may want items to have the same height for all items.
 * Set to the 'gridItem' variant to display the InfoCard with full height suitable for Grid:
 *
 * `<InfoCard variant="gridItem">...</InfoCard>`
 */
export type Props = {
  title?: ReactNode;
  subheader?: ReactNode;
  divider?: boolean;
  deepLink?: BottomLinkProps;
  /** @deprecated Use errorBoundaryProps instead */
  slackChannel?: string;
  errorBoundaryProps?: ErrorBoundaryProps;
  variant?: InfoCardVariants;
  alignContent?: 'normal' | 'bottom';
  children?: ReactNode;
  headerStyle?: object;
  /**
   * Additional props forwarded to the card header `<div>` element.
   *
   * @remarks
   * Previously typed as MUI `CardHeaderProps`. Now accepts any valid HTML
   * div attributes. Use `Record<string, unknown>` for maximum backward
   * compatibility with existing call sites.
   */
  headerProps?: Record<string, unknown>;
  icon?: ReactNode;
  action?: ReactNode;
  actionsClassName?: string;
  actions?: ReactNode;
  cardClassName?: string;
  actionsTopRight?: ReactNode;
  className?: string;
  noPadding?: boolean;
  titleTypographyProps?: object;
  subheaderTypographyProps?: object;
};

/**
 * Card layout primitive with header, content and actions footer.
 *
 * @public
 */
export function InfoCard(props: Props): JSX.Element {
  const {
    title,
    subheader,
    divider = true,
    deepLink,
    slackChannel,
    errorBoundaryProps,
    variant,
    alignContent = 'normal',
    children,
    headerStyle,
    headerProps,
    icon,
    action,
    actionsClassName,
    actions,
    cardClassName,
    actionsTopRight,
    className,
    noPadding,
    titleTypographyProps,
    subheaderTypographyProps,
  } = props;

  /*
   * If variant is specified, we build up Tailwind class strings for that
   * particular variant for both the Card and the CardContent (since these
   * need to be synced).
   */
  let variantCardClasses = '';
  let variantContentClasses = '';
  if (variant) {
    const variants = variant.split(/[\s]+/g);
    variants.forEach(name => {
      const cardVariant =
        VARIANT_STYLES.card[name as keyof typeof VARIANT_STYLES.card];
      if (cardVariant) {
        variantCardClasses = cn(variantCardClasses, cardVariant);
      }
      const contentVariant =
        VARIANT_STYLES.cardContent[
          name as keyof typeof VARIANT_STYLES.cardContent
        ];
      if (contentVariant) {
        variantContentClasses = cn(variantContentClasses, contentVariant);
      }
    });
  }

  /**
   * Renders the subtitle region containing the subheader text and/or icon.
   * Returns null when neither is provided so the container div is omitted.
   * Memoized to avoid duplicate calls per render cycle.
   */
  const subTitleContent = useMemo(() => {
    if (!subheader && !icon) {
      return null;
    }

    return (
      <div data-testid="info-card-subheader">
        {subheader && <div className="flex">{subheader}</div>}
        {icon}
      </div>
    );
  }, [subheader, icon]);

  /**
   * Extract style overrides from typography props for backward compatibility.
   * shadcn CardTitle / CardDescription do not accept MUI-style typography prop
   * objects directly, so we map `style`, `className`, and common props into
   * the rendered elements as inline styles / className strings.
   */
  const titleStyleProps = useMemo(() => {
    if (!titleTypographyProps) return {} as Record<string, any>;
    const {
      style,
      className: cls,
      component,
      ...rest
    } = titleTypographyProps as Record<string, any>;
    return { style, className: cls, component, extra: rest };
  }, [titleTypographyProps]);

  const subheaderStyleProps = useMemo(() => {
    if (!subheaderTypographyProps) return {} as Record<string, any>;
    const {
      style,
      className: cls,
      component,
      ...rest
    } = subheaderTypographyProps as Record<string, any>;
    return { style, className: cls, component, extra: rest };
  }, [subheaderTypographyProps]);

  const errProps: ErrorBoundaryProps =
    errorBoundaryProps || (slackChannel ? { slackChannel } : {});

  return (
    <Card className={cn(variantCardClasses, className)}>
      <ErrorBoundary {...errProps}>
        {title && (
          <CardHeader
            className={cn('p-4 pl-5')}
            style={headerStyle ? { ...headerStyle } : undefined}
            {...(headerProps as React.HTMLAttributes<HTMLDivElement>)}
          >
            <div className="flex items-start justify-between">
              <div>
                {titleStyleProps.component ? (
                  createElement(
                    titleStyleProps.component,
                    {
                      className: cn(
                        'font-semibold leading-none tracking-tight font-bold',
                        titleStyleProps.className,
                      ),
                      style: titleStyleProps.style,
                      'data-slot': 'card-title',
                    },
                    title,
                  )
                ) : (
                  <CardTitle
                    className={cn('font-bold', titleStyleProps.className)}
                    style={titleStyleProps.style}
                  >
                    {title}
                  </CardTitle>
                )}
                {subTitleContent &&
                  (subheaderStyleProps.component ? (
                    createElement(
                      subheaderStyleProps.component,
                      {
                        className: cn('pt-2', subheaderStyleProps.className),
                        style: subheaderStyleProps.style,
                      },
                      subTitleContent,
                    )
                  ) : (
                    <div
                      className={cn('pt-2', subheaderStyleProps.className)}
                      style={subheaderStyleProps.style}
                    >
                      {subTitleContent}
                    </div>
                  ))}
              </div>
              {action && <div className="ml-auto">{action}</div>}
            </div>
          </CardHeader>
        )}
        {actionsTopRight && (
          <div className="flex justify-end pt-4 pr-4">{actionsTopRight}</div>
        )}
        {divider && <Separator />}
        <CardContent
          className={cn(
            variantContentClasses,
            cardClassName,
            noPadding && 'p-0 [&:last-child]:pb-0',
            alignContent === 'bottom' && 'flex items-end',
          )}
        >
          {children}
        </CardContent>
        {actions && (
          <CardFooter className={actionsClassName}>{actions}</CardFooter>
        )}
        {deepLink && <BottomLink {...deepLink} />}
      </ErrorBoundary>
    </Card>
  );
}
