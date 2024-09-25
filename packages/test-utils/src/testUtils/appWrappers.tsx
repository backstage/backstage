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

import React, {
  ComponentType,
  PropsWithChildren,
  ReactElement,
  ReactNode,
} from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { themes, UnifiedThemeProvider } from '@backstage/theme';
import MockIcon from '@material-ui/icons/AcUnit';
import { AppIcons, createSpecializedApp } from '@backstage/core-app-api';
import {
  AppComponents,
  attachComponentData,
  BootErrorPageProps,
  createRouteRef,
  ExternalRouteRef,
  IconComponent,
  RouteRef,
} from '@backstage/core-plugin-api';
import { MatcherFunction, RenderResult } from '@testing-library/react';
import { LegacyRootOption, renderWithEffects } from './testingLibrary';
import { defaultApis } from './defaultApis';
import { mockApis } from './mockApis';

const mockIcons = {
  'kind:api': MockIcon,
  'kind:component': MockIcon,
  'kind:domain': MockIcon,
  'kind:group': MockIcon,
  'kind:location': MockIcon,
  'kind:system': MockIcon,
  'kind:user': MockIcon,
  'kind:resource': MockIcon,
  'kind:template': MockIcon,

  brokenImage: MockIcon,
  catalog: MockIcon,
  scaffolder: MockIcon,
  techdocs: MockIcon,
  search: MockIcon,
  chat: MockIcon,
  dashboard: MockIcon,
  docs: MockIcon,
  email: MockIcon,
  github: MockIcon,
  group: MockIcon,
  help: MockIcon,
  user: MockIcon,
  warning: MockIcon,
  star: MockIcon,
  unstarred: MockIcon,
};

const ErrorBoundaryFallback = ({ error }: { error: Error }) => {
  throw new Error(`Reached ErrorBoundaryFallback Page with error, ${error}`);
};
const NotFoundErrorPage = () => {
  throw new Error('Reached NotFound Page');
};
const BootErrorPage = ({ step, error }: BootErrorPageProps) => {
  throw new Error(`Reached BootError Page at step ${step} with error ${error}`);
};
const Progress = () => <div data-testid="progress" />;

const NoRender = (_props: { children: ReactNode }) => null;

/**
 * Options to customize the behavior of the test app wrapper.
 * @public
 */
export type TestAppOptions = {
  /**
   * Initial route entries to pass along as `initialEntries` to the router.
   */
  routeEntries?: string[];

  /**
   * An object of paths to mount route ref on, with the key being the path and the value
   * being the RouteRef that the path will be bound to. This allows the route refs to be
   * used by `useRouteRef` in the rendered elements.
   *
   * @example
   * wrapInTestApp(<MyComponent />, \{
   *   mountedRoutes: \{
   *     '/my-path': myRouteRef,
   *   \}
   * \})
   * // ...
   * const link = useRouteRef(myRouteRef)
   */
  mountedRoutes?: { [path: string]: RouteRef | ExternalRouteRef };

  /**
   * Components to be forwarded to the `components` option of `createApp`.
   */
  components?: Partial<AppComponents>;

  /**
   * Icons to be forwarded to the `icons` option of `createApp`.
   */
  icons?: Partial<AppIcons> & {
    [key in string]: IconComponent;
  };
};

function isExternalRouteRef(
  routeRef: RouteRef | ExternalRouteRef,
): routeRef is ExternalRouteRef {
  // TODO(Rugvip): Least ugly workaround for now, but replace :D
  return String(routeRef).includes('{type=external,');
}

/**
 * Creates a Wrapper component that wraps a component inside a Backstage test app,
 * providing a mocked theme and app context, along with mocked APIs.
 *
 * @param options - Additional options for the rendering.
 * @public
 */
export function createTestAppWrapper(
  options: TestAppOptions = {},
): (props: { children: ReactNode }) => JSX.Element {
  const { routeEntries = ['/'] } = options;
  const boundRoutes = new Map<ExternalRouteRef, RouteRef>();

  const app = createSpecializedApp({
    apis: mockApis,
    defaultApis,
    // Bit of a hack to make sure that the default config loader isn't used
    // as that would force every single test to wait for config loading.
    configLoader: false as unknown as undefined,
    components: {
      Progress,
      BootErrorPage,
      NotFoundErrorPage,
      ErrorBoundaryFallback,
      Router: ({ children }) => (
        <MemoryRouter initialEntries={routeEntries} children={children} />
      ),
      ...options.components,
    },
    icons: {
      ...mockIcons,
      ...options.icons,
    },
    plugins: [],
    themes: [
      {
        id: 'light',
        title: 'Test App Theme',
        variant: 'light',
        Provider: ({ children }) => (
          <UnifiedThemeProvider theme={themes.light}>
            {children}
          </UnifiedThemeProvider>
        ),
      },
    ],
    bindRoutes: ({ bind }) => {
      for (const [externalRef, absoluteRef] of boundRoutes) {
        bind(
          { ref: externalRef },
          {
            ref: absoluteRef,
          },
        );
      }
    },
  });

  const routeElements = Object.entries(options.mountedRoutes ?? {}).map(
    ([path, routeRef]) => {
      const Page = () => <div>Mounted at {path}</div>;

      // Allow external route refs to be bound to paths as well, for convenience.
      // We work around it by creating and binding an absolute ref to the external one.
      if (isExternalRouteRef(routeRef)) {
        const absoluteRef = createRouteRef({ id: 'id' });
        boundRoutes.set(routeRef, absoluteRef);
        attachComponentData(Page, 'core.mountPoint', absoluteRef);
      } else {
        attachComponentData(Page, 'core.mountPoint', routeRef);
      }
      return <Route key={path} path={path} element={<Page />} />;
    },
  );

  const AppProvider = app.getProvider();
  const AppRouter = app.getRouter();

  const TestAppWrapper = ({ children }: { children: ReactNode }) => (
    <AppProvider>
      <AppRouter>
        <NoRender>{routeElements}</NoRender>
        {children}
      </AppRouter>
    </AppProvider>
  );

  return TestAppWrapper;
}

/**
 * Wraps a component inside a Backstage test app, providing a mocked theme
 * and app context, along with mocked APIs.
 *
 * @param Component - A component or react node to render inside the test app.
 * @param options - Additional options for the rendering.
 * @public
 */
export function wrapInTestApp(
  Component: ComponentType | ReactNode,
  options: TestAppOptions = {},
): ReactElement {
  const TestAppWrapper = createTestAppWrapper(options);

  let wrappedElement: React.ReactElement;
  if (Component instanceof Function) {
    wrappedElement = React.createElement(Component as ComponentType);
  } else {
    wrappedElement = Component as React.ReactElement;
  }

  return <TestAppWrapper>{wrappedElement}</TestAppWrapper>;
}

/**
 * Renders a component inside a Backstage test app, providing a mocked theme
 * and app context, along with mocked APIs.
 *
 * The render executes async effects similar to `renderWithEffects`. To avoid this
 * behavior, use a regular `render()` + `wrapInTestApp()` instead.
 *
 * @param Component - A component or react node to render inside the test app.
 * @param options - Additional options for the rendering.
 * @public
 */
export async function renderInTestApp(
  Component: ComponentType<PropsWithChildren<{}>> | ReactNode,
  options: TestAppOptions & LegacyRootOption = {},
): Promise<RenderResult> {
  let wrappedElement: React.ReactElement;
  if (Component instanceof Function) {
    wrappedElement = React.createElement(Component as ComponentType);
  } else {
    wrappedElement = Component as React.ReactElement;
  }
  const { legacyRoot } = options;

  return renderWithEffects(wrappedElement, {
    wrapper: createTestAppWrapper(options),
    legacyRoot,
  });
}

/**
 * Returns a `@testing-library/react` valid MatcherFunction for supplied text
 *
 * @param string - text Text to match by element's textContent
 *
 * @public
 */
export const textContentMatcher =
  (text: string): MatcherFunction =>
  (_, node) => {
    if (!node) {
      return false;
    }

    const hasText = (textNode: Element) =>
      textNode?.textContent?.includes(text) ?? false;
    const childrenDontHaveText = (containerNode: Element) =>
      Array.from(containerNode?.children).every(child => !hasText(child));

    return hasText(node) && childrenDontHaveText(node);
  };
