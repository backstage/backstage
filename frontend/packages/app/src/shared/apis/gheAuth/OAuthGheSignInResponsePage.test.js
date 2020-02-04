import React from 'react';
import OAuthGheSignInResponsePage from './OAuthGheSignInResponsePage';
import { buildComponentInApp } from 'testUtils';
import { initiateLogin } from './gheAuth';

import { Provider } from 'react-redux';
import { createStore } from 'core/store';
import { createMemoryHistory } from 'history';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import * as gheAuthActions from 'shared/apis/gheAuth/actions';
import * as gheAuthSelectors from 'shared/apis/gheAuth/selectors';

describe('<OAuthGheSignInResponsePage />', () => {
  let store = null;
  let WrappedComponent = null;

  beforeEach(() => {
    const history = createMemoryHistory({ initialEntries: ['/ghe/login'] });
    store = createStore(history);

    WrappedComponent = () => (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/ghe/login" component={OAuthGheSignInResponsePage} />
            <Route path="/here">after login</Route>
            <Route path="/">logged in</Route>
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it('should render and initiate login', async () => {
    Object.defineProperty(window, 'location', {
      value: { protocol: 'http', host: 'localhost' },
      writable: true,
    });

    initiateLogin('/here');

    const search = window.location.slice(window.location.indexOf('?'));
    window.location = { search: `${search}&code=123` };

    fetch.mockResponses(
      [JSON.stringify({ access_token: 'abc' }), { status: 200 }],
      [JSON.stringify({ id: 'mock-user' }), { status: 200 }],
    );

    expect(gheAuthSelectors.getUser(store.getState())).toBeNull();

    const rendered = buildComponentInApp(WrappedComponent)
      .withTheme()
      .render({ targetUrl: '/here' });

    rendered.getByTestId('progress');
    await rendered.findByText('after login');

    expect(fetch.mock.calls[0][1].body).toMatch(/"code":"123"/);
    expect(gheAuthSelectors.getUser(store.getState())).toEqual({ accessToken: 'abc', userInfo: { id: 'mock-user' } });

    store.dispatch(gheAuthActions.gheLogOut());

    expect(gheAuthSelectors.getUser(store.getState())).toBeNull();
  });

  it('should render error if login fails', async () => {
    Object.defineProperty(window, 'location', {
      value: { protocol: 'http', host: 'localhost' },
      writable: true,
    });

    initiateLogin('/here');

    const search = window.location.slice(window.location.indexOf('?'));
    window.location = { search: `${search}&code=123` };

    fetch.mockResponse(JSON.stringify({ error: 'NOPE' }), { status: 401 });

    const rendered = buildComponentInApp(WrappedComponent)
      .withTheme()
      .render({ targetUrl: '/here' });

    rendered.getByTestId('progress');
    await rendered.findByText('Error: Failed to authorize: 401 Unauthorized');
  });

  it('should render error if precondition check fails', () => {
    const rendered = buildComponentInApp(WrappedComponent)
      .withTheme()
      .render({ targetUrl: '/here' });

    rendered.getByText('Error: Illegal request');
  });
});
