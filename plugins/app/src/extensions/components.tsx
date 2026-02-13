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
import { Header, Flex } from '@backstage/ui';
import Button from '@material-ui/core/Button';

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
        const { title, icon, noHeader, headerActions, tabs, children } = props;
        if (tabs) {
          return (
            <Flex
              direction="column"
              style={{ flexGrow: 1, minHeight: 0, gap: 0 }}
            >
              {!noHeader && (
                <Header
                  title={title}
                  icon={icon}
                  tabs={tabs}
                  customActions={headerActions}
                />
              )}
              <main
                style={{
                  flex: '1 1 0',
                  minHeight: 0,
                  overflow: 'auto',
                  padding: 0,
                  margin: 0,
                }}
              >
                {children}
              </main>
            </Flex>
          );
        }
        return (
          <Flex
            direction="column"
            style={{ flexGrow: 1, minHeight: 0, gap: 0 }}
          >
            <main
              style={{
                flex: '1 1 0',
                minHeight: 0,
                overflow: 'auto',
                padding: 0,
                margin: 0,
              }}
            >
              {children}
            </main>
          </Flex>
        );
      },
    }),
});
