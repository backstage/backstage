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
import {
  NotFoundErrorPage as SwappableNotFoundErrorPage,
  Progress as SwappableProgress,
  ErrorDisplay as SwappableErrorDisplay,
  PageLayout as SwappablePageLayout,
  type PageLayoutProps,
} from '@backstage/frontend-plugin-api';
import { SwappableComponentBlueprint } from '@backstage/plugin-app-react';
import {
  ErrorPage,
  ErrorPanel,
  Progress as ProgressComponent,
} from '@backstage/core-components';
import {
  BreadcrumbEntry,
  useBreadcrumbEntries,
} from '@backstage/frontend-plugin-api';
import { PageMountContext } from '@internal/frontend';
import { PluginHeader } from '@backstage/ui';
import Button from '@material-ui/core/Button';
import { useContext, useMemo } from 'react';
import { useInRouterContext, useResolvedPath } from 'react-router-dom';

export const Progress = SwappableComponentBlueprint.make({
  name: 'core-progress',
  params: define =>
    define({
      component: SwappableProgress,
      loader: () => ProgressComponent,
    }),
});

export const NotFoundErrorPage = SwappableComponentBlueprint.make({
  name: 'core-not-found-error-page',
  params: define =>
    define({
      component: SwappableNotFoundErrorPage,
      loader: () => () =>
        <ErrorPage status="404" statusMessage="PAGE NOT FOUND" />,
    }),
});

export const ErrorDisplay = SwappableComponentBlueprint.make({
  name: 'core-error-display',
  params: define =>
    define({
      component: SwappableErrorDisplay,
      loader: () => props => {
        const { plugin, error, resetError } = props;
        const title = `Error in ${plugin?.id}`;
        return (
          <ErrorPanel title={title} error={error} defaultExpanded>
            <Button variant="outlined" onClick={resetError}>
              Retry
            </Button>
          </ErrorPanel>
        );
      },
    }),
});

export const PageLayout = SwappableComponentBlueprint.make({
  name: 'core-page-layout',
  params: define =>
    define({
      component: SwappablePageLayout,
      loader: () => (props: PageLayoutProps) => {
        const {
          title,
          icon,
          noHeader,
          titleLink,
          headerActions,
          tabs,
          children,
        } = props;
        // Prefer the page's PageMount basePath when NFS is present; fall
        // back to React Router for isolated/OFS trees (e.g.
        // createExtensionTester + renderInTestApp without AppRouteSwitch).
        // Only call useResolvedPath when there is no page mount — chrome
        // must not unconditionally require root RR when one is present.
        const pageMount = useContext(PageMountContext);
        const inRouter = useInRouterContext();
        const rrParentPath =
          !pageMount && inRouter
            ? useResolvedPath('.').pathname.replace(/\/$/, '')
            : '';
        const parentPath = pageMount
          ? pageMount.basePath.replace(/\/$/, '')
          : rrParentPath;
        // Empty string titleLink is treated as unset (same as undefined) so the
        // breadcrumb still points at the page mount path rather than "".
        const breadcrumbHref =
          titleLink !== undefined && titleLink !== ''
            ? titleLink
            : parentPath || '/';
        const resolvedTabs = useMemo(
          () =>
            tabs?.map(tab => ({
              ...tab,
              href: tab.href.startsWith('/')
                ? tab.href
                : `${parentPath}/${tab.href}`.replace(/\/{2,}/g, '/'),
              matchStrategy: 'prefix' as const,
            })),
          [tabs, parentPath],
        );

        const { items: breadcrumbs } = useBreadcrumbEntries();

        if (noHeader) {
          return <>{children}</>;
        }

        const content = (
          <>
            <PluginHeader
              title={title}
              icon={icon}
              titleLink={titleLink}
              breadcrumbs={breadcrumbs}
              tabs={resolvedTabs}
              customActions={headerActions}
            />
            {children}
          </>
        );

        // in practice title is always provided by PageBlueprint (falls back to pluginId).
        if (!title) {
          return content;
        }

        return (
          <BreadcrumbEntry entry={{ label: title, href: breadcrumbHref }}>
            {content}
          </BreadcrumbEntry>
        );
      },
    }),
});
