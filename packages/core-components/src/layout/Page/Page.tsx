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

import { ReactNode, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { pageTheme as defaultPageThemes } from '@backstage/theme';
import type { PageTheme } from '@backstage/theme';

/** @public */
export type PageClassKey = 'root';

/**
 * Tailwind utility classes that replicate the original MUI makeStyles grid layout.
 *
 * Layout: 3-row × 3-column CSS grid with named areas for pageHeader,
 * pageSubheader, pageNav, pageContent, and pageSidebar.
 *
 * - `grid` → display: grid
 * - `grid-rows-[max-content_auto_1fr]` → gridTemplateRows: max-content auto 1fr
 * - `grid-cols-[auto_1fr_auto]` → gridTemplateColumns: auto 1fr auto
 * - `overflow-y-auto` → overflowY: auto
 * - `h-screen` → height: 100vh
 * - `max-[599.95px]:h-full` → height: 100% below Backstage xs breakpoint (600px)
 * - `print:block print:h-auto print:overflow-y-visible` → print media overrides
 */
const pageGridClasses =
  'grid grid-rows-[max-content_auto_1fr] grid-cols-[auto_1fr_auto] overflow-y-auto h-screen max-[599.95px]:h-full print:block print:h-auto print:overflow-y-visible';

type Props = {
  themeId: string;
  className?: string;
  children?: ReactNode;
};

/**
 * Core page layout scaffold that wraps every Backstage route.
 *
 * Sets CSS custom properties (`--page-background-image`, `--page-font-color`,
 * `--page-colors`, `--page-shape`) based on the resolved `PageTheme` so that
 * child components (e.g. `Header`) can consume them via `var(--page-*)`.
 *
 * Also sets the `data-page-theme` attribute on the root `<main>` element to
 * enable CSS-based targeting by themeId.
 */
export function Page(props: Props) {
  const { themeId, className, children } = props;

  /**
   * Memoized inline style object that:
   * 1. Looks up the PageTheme by themeId from the built-in page themes record
   * 2. Falls back to the "home" theme, then to the first available theme
   * 3. Sets CSS custom properties for child component consumption
   * 4. Always includes gridTemplateAreas (cannot be expressed via Tailwind)
   */
  const pageThemeStyle = useMemo((): React.CSSProperties => {
    const theme: PageTheme | undefined =
      defaultPageThemes[themeId] ??
      defaultPageThemes.home ??
      Object.values(defaultPageThemes)[0];

    const gridTemplateAreas =
      "'pageHeader pageHeader pageHeader' 'pageSubheader pageSubheader pageSubheader' 'pageNav pageContent pageSidebar'";

    if (!theme) {
      return { gridTemplateAreas } as React.CSSProperties;
    }

    return {
      '--page-background-image': theme.backgroundImage,
      '--page-font-color': theme.fontColor,
      '--page-colors': theme.colors.join(', '),
      '--page-shape': theme.shape,
      gridTemplateAreas,
    } as React.CSSProperties;
  }, [themeId]);

  return (
    <main
      data-page-theme={themeId}
      className={cn(pageGridClasses, className)}
      style={pageThemeStyle}
    >
      {children}
    </main>
  );
}
