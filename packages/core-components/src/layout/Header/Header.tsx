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

import { configApiRef, useApi } from '@backstage/core-plugin-api';
import {
  CSSProperties,
  type MutableRefObject,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { Helmet } from 'react-helmet';
import { cn } from '../../lib/utils';
import {
  ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';
import { Link } from '../../components/Link';
import { Breadcrumbs } from '../Breadcrumbs';
import { useContent } from '../Sidebar';

/** @public */
export type HeaderClassKey =
  | 'header'
  | 'leftItemsBox'
  | 'rightItemsBox'
  | 'title'
  | 'subtitle'
  | 'type'
  | 'breadcrumb'
  | 'breadcrumbType'
  | 'breadcrumbTitle';

/**
 * Tailwind CSS class mapping for Header component styles.
 *
 * @remarks
 * Replaces the former MUI `makeStyles` theme callback. Visual tokens that
 * previously came from the MUI theme object are now resolved through CSS
 * custom properties set by the parent `Page` component:
 *
 * - `--page-font-color` — header text color (default `#ffffff`)
 * - `--page-background-image` — gradient / image background (default `none`)
 *
 * Shadow depth (`shadow-md`) approximates MUI `theme.shadows[4]`.
 * Padding `p-6` = 1.5rem ≈ MUI `theme.spacing(3)` (24 px).
 * Font size `text-2xl` = 1.5rem matches MUI `theme.typography.h3.fontSize`.
 *
 * **Note on CSS variable fallbacks:** The `#ffffff` hex fallback in
 * `var(--page-font-color, #ffffff)` is intentional — it serves as a last-resort
 * default when the Page component does not set `--page-font-color`. This is
 * safe because the Header is always rendered on a dark gradient background
 * where white text is the correct default.
 */
const headerClasses = {
  header: cn(
    '[grid-area:pageHeader] p-6 w-full shadow-md',
    'relative z-[100] flex flex-row items-center',
    'bg-cover bg-center',
    'max-sm:flex-wrap',
  ),
  leftItemsBox: 'max-w-full grow',
  rightItemsBox: 'w-auto flex items-center gap-4',
  title: cn(
    'text-[var(--page-font-color,#ffffff)]',
    'break-words text-2xl font-bold mb-0',
  ),
  subtitle: cn(
    'text-[var(--page-font-color,#ffffff)] opacity-80',
    'inline-block mt-2 max-w-[75ch]',
  ),
  type: cn(
    'uppercase text-[11px] opacity-80',
    'mb-2 text-[var(--page-font-color,#ffffff)]',
  ),
  breadcrumb: 'text-[var(--page-font-color,#ffffff)]',
  breadcrumbType: 'text-[inherit] opacity-70 -mr-[2.4px] mb-[2.4px]',
  breadcrumbTitle: 'text-[inherit] -ml-[2.4px] mb-[2.4px]',
};

type HeaderStyles = typeof headerClasses;

type Props = {
  component?: ReactNode;
  pageTitleOverride?: string;
  style?: CSSProperties;
  subtitle?: ReactNode;
  title: ReactNode;
  tooltip?: string;
  type?: string;
  typeLink?: string;
};

type TypeFragmentProps = {
  classes: HeaderStyles;
  pageTitle: string | ReactNode;
  type?: Props['type'];
  typeLink?: Props['typeLink'];
};

type TitleFragmentProps = {
  classes: HeaderStyles;
  pageTitle: string | ReactNode;
  tooltip?: Props['tooltip'];
};

type SubtitleFragmentProps = {
  classes: HeaderStyles;
  subtitle?: Props['subtitle'];
};

const TypeFragment = ({
  type,
  typeLink,
  classes,
  pageTitle,
}: TypeFragmentProps) => {
  if (!type) {
    return null;
  }

  if (!typeLink) {
    return <span className={classes.type}>{type}</span>;
  }

  return (
    <Breadcrumbs className={classes.breadcrumb}>
      <Link to={typeLink}>{type}</Link>
      <span>{pageTitle}</span>
    </Breadcrumbs>
  );
};

const TitleFragment = ({ pageTitle, classes, tooltip }: TitleFragmentProps) => {
  const { contentRef } = useContent();

  const FinalTitle = (
    <h1
      ref={contentRef as MutableRefObject<HTMLHeadingElement | null>}
      tabIndex={-1}
      className={classes.title}
    >
      {pageTitle}
    </h1>
  );

  if (!tooltip) {
    return FinalTitle;
  }

  return (
    <TooltipProvider>
      <ShadcnTooltip>
        <TooltipTrigger asChild>{FinalTitle}</TooltipTrigger>
        <TooltipContent side="top" align="start">
          {tooltip}
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
};

const SubtitleFragment = ({ classes, subtitle }: SubtitleFragmentProps) => {
  if (!subtitle) {
    return null;
  }

  if (typeof subtitle !== 'string') {
    return <>{subtitle}</>;
  }

  return <span className={cn(classes.subtitle, 'text-sm')}>{subtitle}</span>;
};
/**
 * Backstage main header with abstract color background in multiple variants
 *
 * @public
 *
 */
export function Header(props: PropsWithChildren<Props>) {
  const {
    children,
    pageTitleOverride,
    style,
    subtitle,
    title,
    tooltip,
    type,
    typeLink,
  } = props;
  const classes = headerClasses;
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') || 'Backstage';
  const documentTitle = pageTitleOverride || title;
  const pageTitle = title || pageTitleOverride;
  const titleTemplate = `${documentTitle} | %s | ${appTitle}`;
  const defaultTitle = `${documentTitle} | ${appTitle}`;

  return (
    <>
      <Helmet titleTemplate={titleTemplate} defaultTitle={defaultTitle} />
      <header
        style={{
          ...style,
          backgroundImage: 'var(--page-background-image, none)',
        }}
        className={classes.header}
      >
        <div className={classes.leftItemsBox}>
          <TypeFragment
            classes={classes}
            type={type}
            typeLink={typeLink}
            pageTitle={pageTitle}
          />
          <TitleFragment
            classes={classes}
            pageTitle={pageTitle}
            tooltip={tooltip}
          />
          <SubtitleFragment classes={classes} subtitle={subtitle} />
        </div>
        <div className={classes.rightItemsBox}>{children}</div>
      </header>
    </>
  );
}
