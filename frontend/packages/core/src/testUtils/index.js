/**
 *  Helpers for testing redux components and containers
 */
import { MuiThemeProvider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { V1 } from 'core/app/Themes';
import defaultAppState from 'core/defaultAppState';
import store from 'core/store';
import ErrorBoundary from 'shared/components/ErrorBoundary';
import { SearchProvider } from 'plugins/searchPage/SearchContext';

import { render } from '@testing-library/react';
import { FirestoreProvider } from 'shared/apis/firestore';
import MockFirestoreStorage from 'shared/apis/firestore/MockFirestoreStorage';
import { UserInfoProvider, defaultMockUser } from 'shared/apis/user';

export { default as Keyboard } from './Keyboard';
export { default as mockBreakpoint } from './mockBreakpoint';

export function wrapInTestApp(Component, initialRouterEntries, user = defaultMockUser) {
  const Wrapper = Component instanceof Function ? Component : () => Component;

  return (
    <Provider store={store}>
      <UserInfoProvider user={user}>
        <FirestoreProvider api={new MockFirestoreStorage()}>
          <MemoryRouter initialEntries={initialRouterEntries || ['/']}>
            <ErrorBoundary>
              <Route component={Wrapper} />
            </ErrorBoundary>
          </MemoryRouter>
        </FirestoreProvider>
      </UserInfoProvider>
    </Provider>
  );
}

export function wrapInThemedTestApp(component, initialRouterEntries) {
  const themed = (
    <MuiThemeProvider theme={V1}>
      <ThemeProvider theme={V1}>{component}</ThemeProvider>
    </MuiThemeProvider>
  );
  return wrapInTestApp(themed, initialRouterEntries);
}

export function wrapInSearchTestApp(component) {
  const search = <SearchProvider>{component}</SearchProvider>;
  return wrapInThemedTestApp(search);
}

export function getTestStore(state) {
  const appState = state ? state : defaultAppState;
  const mockStore = configureStore([thunk]);
  return mockStore(appState);
}

export function getGoogleProfile() {
  return {
    getName: () => 'Niklas',
    getGivenName: () => 'Niklas',
    getEmail: () => 'niklas@spotify.com',
    getImageUrl: () => 'http://img.url',
    getId: () => '123456',
  };
}

const DEFAULT_APOLLO_STATE = {
  data: { loading: true },
};

export const ApolloMock = ({ children, state = DEFAULT_APOLLO_STATE }) => {
  // Hideous mocking of the ApolloClient to use the ApolloProvider
  // The test do not have information about the GraphQL queries made by the components
  // and hence we cant use MockedProvider and use the one below.
  const mockClient = {
    query: async () => state,
    watchQuery: () => {
      return {
        refetch: () => {},
        fetchMore: () => {},
        updateQuery: () => {},
        startPolling: () => {},
        stopPolling: () => {},
        subscribeToMore: () => {},
        options: {
          fetchPolicy: {},
        },
        getLastResult: () => {},
        currentResult: () => state,
        getCurrentResult: () => state,
        resetQueryStoreErrors: () => {},
        subscribe: () => {},
        setOptions: () => Promise.resolve({}),
      };
    },
  };
  return <ApolloProvider client={mockClient}>{children}</ApolloProvider>;
};

/**
 * Return a builder for a given Component which will permit fluent immutable
 * configuration and access to @testing-library/react rendering functions.
 *
 * A full example will make the utility of this more clear:
 *
 * const builder = buildComponentInApp(MyComponent)
 *    .withProps({myProp: 'myValue'})
 *
 *     // MuiThemeProvider will wrap MyComponent when this is called:
 *    .withTheme()
 *
 *     // MemoryRouter can be configured with initialEntries:
 *    .withRouterEntries(['/'])
 *
 *     // ApolloProvider wraps MyComponent with a mock client setup to
 *     // provide the given data:
 *    .withApolloData({
 *      component: {id: 'my-component', system: 'my-system'}
 *    });
 *
 * // Test 1: Use the defaults from above when mounting
 * const { getByText } = builder.render();
 * expect(getByText('Display Text').querySelectorAll('td')).toHaveLength(1);

 * // Test 2: ApolloRouter provides loading=true state instead of valid data
 * const { queryByText } = builder.withApolloLoading().render();
 * queryByText('Content').toBeNull();
 */
export function buildComponentInApp(Component) {
  function createBuilder(opt = {}) {
    const builder = {
      withProps: (props = {}) =>
        createBuilder({
          ...opt,
          props: Object.assign(opt.props || {}, props),
        }),
      withTheme: (theme = V1) =>
        createBuilder({
          ...opt,
          theme,
        }),
      withRouterEntries: routerEntries =>
        createBuilder({
          ...opt,
          routerEntries,
        }),
      withApolloLoading: () =>
        // Support `data.loading` (errorOrLoading) or just `loading` (Query)
        createBuilder({
          ...opt,
          apolloState: { data: { loading: true }, loading: true },
        }),
      withApolloData: data =>
        createBuilder({
          ...opt,
          apolloState: { data: { loading: false, ...data } },
        }),
      withApolloError: error =>
        createBuilder({
          ...opt,
          apolloState: { error: error },
        }),
      withUser: user =>
        createBuilder({
          ...opt,
          user,
        }),
      build: (argProps = {}) => {
        const props = { ...(opt.props || {}), ...argProps };
        const component = <Component {...props} />;
        const routed = wrapInTestApp(component, opt.routerEntries, opt.user);
        const themed = opt.theme ? <MuiThemeProvider theme={opt.theme}>{routed}</MuiThemeProvider> : routed;
        return opt.apolloState ? <ApolloMock state={opt.apolloState}>{themed}</ApolloMock> : themed;
      },
      render: props => {
        return render(builder.build(props));
      },
      renderWithEffects: async props => {
        return renderWithEffects(builder.build(props));
      },
    };
    return builder;
  }
  return createBuilder();
}

// Components using useEffect to perform an asynchronous action (such as fetch) must be rendered within an async
// act call to properly get the final state, even with mocked responses. This utility method makes the signature a bit
// cleaner, since act doesn't return the result of the evaluated function.
// https://github.com/testing-library/react-testing-library/issues/281
// https://github.com/facebook/react/pull/14853
export async function renderWithEffects(nodes) {
  let value;
  await act(async () => {
    value = await render(nodes);
  });
  return value;
}

export function logBoundaryErrors() {
  ErrorBoundary.onError = error => console.error('ErrorBoundary received error', error);
}

// Runs a function with all error logging captured and returned as an array.
// If the callback function is async this one will be too.
export function withLogCollector(logsToCollect, callback) {
  if (typeof logsToCollect === 'function') {
    callback = logsToCollect;
    logsToCollect = ['log', 'warn', 'error'];
  }
  const logs = {
    log: [],
    warn: [],
    error: [],
  };

  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;

  if (logsToCollect.includes('log')) {
    console.log = message => {
      logs.log.push(message);
    };
  }
  if (logsToCollect.includes('warn')) {
    console.warn = message => {
      logs.warn.push(message);
    };
  }
  if (logsToCollect.includes('error')) {
    console.error = message => {
      logs.error.push(message);
    };
  }

  const restore = () => {
    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;
  };

  try {
    const ret = callback();

    if (!ret || !ret.then) {
      restore();
      return logs;
    }

    return ret.then(
      () => {
        restore();
        return logs;
      },
      error => {
        restore();
        throw error;
      },
    );
  } catch (error) {
    restore();
    throw error;
  }
}

export const wrapInTheme = (component, theme = V1) => (
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>{component}</ThemeProvider>
  </MuiThemeProvider>
);
