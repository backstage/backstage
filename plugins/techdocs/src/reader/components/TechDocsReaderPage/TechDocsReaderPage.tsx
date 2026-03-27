/*
 * Copyright 2022 The Backstage Authors
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

import React, { Children, ReactElement, ReactNode, useMemo } from 'react';
import { useOutlet } from 'react-router-dom';
import { Page, Progress } from '@backstage/core-components';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  TECHDOCS_ADDONS_KEY,
  TECHDOCS_ADDONS_WRAPPER_KEY,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';
import { TechDocsReaderPageRenderFunction } from '../../../types';
import { TechDocsReaderPageContent } from '../TechDocsReaderPageContent';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { TechDocsReaderPageSubheader } from '../TechDocsReaderPageSubheader';
import { rootDocsRouteRef } from '../../../routes';
import {
  getComponentData,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { CookieAuthRefreshProvider } from '@backstage/plugin-auth-react';
import { useExternalRedirect } from './useExternalRedirect';

/* An explanation for the multiple ways of customizing the TechDocs reader page

Please refer to this page on the microsite for the latest recommended approach:
https://backstage.io/docs/features/techdocs/how-to-guides#how-to-customize-the-techdocs-reader-page

The <TechDocsReaderPage> component is responsible for rendering the <TechDocsReaderPageProvider> and
its contained version of a <Page>, which in turn renders the <TechDocsReaderPageContent>.

Historically, there have been different approaches on how this <Page> can be customized, and how the
<TechDocsReaderPageContent> inside could be exchanged for a custom implementation (which was not
possible before). Also, the current implementation supports every scenario to avoid breaking default
configurations of TechDocs.

In particular, there are 4 different TechDocs page configurations:

CONFIGURATION 1: <TechDocsReaderPage> only, no children

<Route path="/docs/:namespace/:kind/:name/*" element={<TechDocsReaderPage />} >

This is the simplest way to use TechDocs. Only a full page is passed, assuming that it comes with
its content inside. Since we allowed customizing it, we started providing <TechDocsReaderLayout> as
a default implementation (which contains <TechDocsReaderPageContent>).

CONFIGURATION 2 (not advised): <TechDocsReaderPage> with element children

<Route
  path="/docs/:namespace/:kind/:name/*"
  element={
    <TechDocsReaderPage>
      {techdocsPage}
    </TechDocsReaderPage>
  }
/>

Previously, there were two ways of passing children to <TechDocsReaderPage>: either as elements (as
shown above), or as a render function (described below in CONFIGURATION 3). The "techdocsPage" is
located in packages/app/src/components/techdocs and is the default implementation of the content
inside.

CONFIGURATION 3 (not advised): <TechDocsReaderPage> with render function as child

<Route
  path="/docs/:namespace/:kind/:name/*"
  element={
    <TechDocsReaderPage>
      {({ metadata, entityMetadata, onReady }) => (
        techdocsPage
      )}
    </TechDocsReaderPage>
  }
/>

Similar to CONFIGURATION 2, the direct children will be passed to the <TechDocsReaderPage> but in
this case interpreted as render prop.

CONFIGURATION 4: <TechDocsReaderPage> and provided content in <Route>

<Route
  path="/docs/:namespace/:kind/:name/*"
  element={<TechDocsReaderPage />}
>
  {techDocsPage}
  <TechDocsAddons>
    <ExpandableNavigation />
    <ReportIssue />
    <TextSize />
    <LightBox />
  </TechDocsAddons>
</Route>

This is the current state in packages/app/src/App.tsx and moved the location of children from inside
the element prop in the <Route> to the children of the <Route>. Then, in <TechDocsReaderPage> they
are retrieved using the useOutlet hook from React Router.

NOTE: Render functions are no longer supported in this approach.
*/

/**
 * Props for {@link TechDocsReaderLayout}
 * @public
 */
export type TechDocsReaderLayoutProps = {
  /**
   * Show or hide the header, defaults to true.
   */
  withHeader?: boolean;
  /**
   * Show or hide the content search bar, defaults to true.
   */
  withSearch?: boolean;
};

/**
 * Default TechDocs reader page structure composed with a header and content
 * @public
 */
export const TechDocsReaderLayout = (props: TechDocsReaderLayoutProps) => {
  const { withSearch, withHeader = true } = props;
  return (
    <Page themeId="documentation">
      {withHeader && <TechDocsReaderPageHeader />}
      <TechDocsReaderPageSubheader />
      <TechDocsReaderPageContent withSearch={withSearch} />
    </Page>
  );
};

/**
 * @deprecated Use CSS custom properties to customize the reader theme instead of MUI ThemeOptions.
 */
type ReaderThemeOptions = Record<string, unknown>;

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  entityRef?: CompoundEntityRef;
  children?: TechDocsReaderPageRenderFunction | ReactNode;
  /** @deprecated Use CSS custom properties to customize the reader theme. */
  overrideThemeOptions?: Partial<ReaderThemeOptions>;
};

/**
 * CSS class name for styled techdocs reader page overrides.
 * Overrides the default Page component's height (100vh) and overflow (auto)
 * so that the reader page fills its parent's height and allows visible overflow.
 */
const STYLED_PAGE_CLASS = 'techdocs-reader-page-styled';

/**
 * Ensures the styled page CSS is injected into the document head exactly once.
 * Replaces the previous MUI styled(Page)() pattern with a minimal runtime injection.
 */
let styledPageCssInjected = false;
function ensureStyledPageCss(): void {
  if (styledPageCssInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-techdocs', 'styled-page');
  style.textContent = `.${STYLED_PAGE_CLASS} { height: inherit !important; overflow-y: visible !important; }`;
  document.head.appendChild(style);
  styledPageCssInjected = true;
}

/**
 * Styled Backstage Page that fills available vertical space.
 * Replaces the previous MUI styled(Page)() with a className-based approach
 * that injects minimal CSS at runtime to override Page's default height and overflow.
 */
const StyledPage = ({
  className,
  ...props
}: React.ComponentProps<typeof Page>) => {
  ensureStyledPageCss();
  return (
    <Page
      {...props}
      className={[STYLED_PAGE_CLASS, className].filter(Boolean).join(' ')}
    />
  );
};

/**
 * Converts deprecated MUI ThemeOptions overrides to inline CSS properties.
 * Supports common overrides: typography.fontFamily, typography.fontSize.
 */
function themeOptionsToStyle(
  options?: Partial<ReaderThemeOptions>,
): React.CSSProperties {
  if (!options || Object.keys(options).length === 0) return {};

  const style: React.CSSProperties = {};
  const typography = options.typography as Record<string, unknown> | undefined;

  if (typography) {
    if (typeof typography.fontFamily === 'string') {
      style.fontFamily = typography.fontFamily;
    }
    if (
      typeof typography.fontSize === 'number' ||
      typeof typography.fontSize === 'string'
    ) {
      style.fontSize = typography.fontSize as string | number;
    }
  }

  return style;
}

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 *
 * @public
 */
export const TechDocsReaderPage = (props: TechDocsReaderPageProps) => {
  const readerPageStyle = useMemo(() => {
    if (
      props.overrideThemeOptions &&
      Object.keys(props.overrideThemeOptions).length > 0
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        'TechDocsReaderPage: overrideThemeOptions is deprecated. ' +
          'Use CSS custom properties to customize the TechDocs reader theme instead.',
      );
    }
    return themeOptionsToStyle(props.overrideThemeOptions);
  }, [props.overrideThemeOptions]);

  const { kind, name, namespace } = useRouteRefParams(rootDocsRouteRef);
  const { children, entityRef = { kind, name, namespace } } = props;

  const outlet = useOutlet();

  const memoizedEntityRef = useMemo(
    () => ({
      kind: entityRef.kind,
      name: entityRef.name,
      namespace: entityRef.namespace,
    }),
    [entityRef.kind, entityRef.name, entityRef.namespace],
  );

  // Check for external TechDocs redirects and handle navigation
  const { shouldShowProgress } = useExternalRedirect(memoizedEntityRef);

  const page: ReactNode = useMemo(() => {
    if (children) {
      return null;
    }

    const childrenList = outlet ? Children.toArray(outlet.props.children) : [];

    const grandChildren = childrenList.flatMap<ReactElement>(
      child => (child as ReactElement)?.props?.children ?? [],
    );

    return grandChildren.find(
      grandChild =>
        !getComponentData(grandChild, TECHDOCS_ADDONS_WRAPPER_KEY) &&
        !getComponentData(grandChild, TECHDOCS_ADDONS_KEY),
    );
  }, [children, outlet]);

  // Show full-page loading spinner when checking for external redirects or about to redirect.
  // This replaces the entire page content (header, sidebar, and documentation).
  if (shouldShowProgress) {
    return <Progress />;
  }

  // As explained above, "page" is configuration 4 and <TechDocsReaderLayout> is 1
  if (!children) {
    return (
      <div style={readerPageStyle}>
        <CookieAuthRefreshProvider pluginId="techdocs">
          <TechDocsReaderPageProvider entityRef={memoizedEntityRef}>
            {(page as JSX.Element) || <TechDocsReaderLayout />}
          </TechDocsReaderPageProvider>
        </CookieAuthRefreshProvider>
      </div>
    );
  }

  // As explained above, a render function is configuration 3 and React element is 2
  return (
    <div style={readerPageStyle}>
      <CookieAuthRefreshProvider pluginId="techdocs">
        <TechDocsReaderPageProvider entityRef={memoizedEntityRef}>
          {({ metadata, entityMetadata, onReady }) => (
            <StyledPage
              themeId="documentation"
              className="techdocs-reader-page"
            >
              {children instanceof Function
                ? children({
                    entityRef: memoizedEntityRef,
                    techdocsMetadataValue: metadata.value,
                    entityMetadataValue: entityMetadata.value,
                    onReady,
                  })
                : children}
            </StyledPage>
          )}
        </TechDocsReaderPageProvider>
      </CookieAuthRefreshProvider>
    </div>
  );
};
