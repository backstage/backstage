import React from 'react';
import { Redirect as MockRedirect } from 'react-router-dom';
import OtherLayout from 'shared/components/layout/other/OtherLayout';
import { buildComponentInApp } from 'testUtils';
import gql from 'graphql-tag';

jest.mock('react-router-dom', () => {
  const RouterMocks = jest.requireActual('react-router-dom');
  return {
    ...RouterMocks,
    Redirect: jest.fn().mockImplementation(() => {
      return <span data-testid="redirect">redirect</span>;
    }),
  };
});

describe('<OtherLayout />', () => {
  it('Renders a progress bar while loading', async () => {
    const { getByTestId } = buildComponentInApp(OtherLayout)
      .withProps({ id: 'test' })
      .withApolloLoading()
      .render();
    expect(getByTestId('progress')).toBeInTheDocument();
  });

  it('Redirects for services', async () => {
    window.history.pushState({}, 'Test', '/components/test');
    buildComponentInApp(OtherLayout)
      .withProps({ id: 'test' })
      .withRouterEntries(['/components/test'])
      .withApolloData({
        untypedComponents: [],
        services: [{ id: 'test' }],
        appFeatures: [],
      })
      .render();
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/services/test' }, {});
  });

  it('Redirects for app features', async () => {
    window.history.pushState({}, 'Test', '/components/test');
    buildComponentInApp(OtherLayout)
      .withProps({ id: 'test' })
      .withRouterEntries(['/components/test'])
      .withApolloData({
        untypedComponents: [],
        services: [],
        appFeatures: [{ id: 'test' }],
      })
      .render();
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/app-features/test' }, {});
  });

  it('Redirects for partnerships', async () => {
    window.history.pushState({}, 'Test', '/components/test');
    buildComponentInApp(OtherLayout)
      .withProps({ id: 'test' })
      .withRouterEntries(['/components/test'])
      .withApolloData({
        untypedComponents: [{ componentType: 'partnership' }],
        services: [],
        appFeatures: [],
      })
      .render();
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/partnerships/test' }, {});
  });

  it('Redirects for libraries', async () => {
    window.history.pushState({}, 'Test', '/components/test');
    buildComponentInApp(OtherLayout)
      .withProps({ id: 'test' })
      .withRouterEntries(['/components/test'])
      .withApolloData({
        untypedComponents: [],
        services: [],
        appFeatures: [],
        libraries: [{ id: 'test' }],
      })
      .render();
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/libraries/test' }, {});
  });

  it('renders empty state', async () => {
    const rendered = buildComponentInApp(OtherLayout)
      .withTheme()
      .withApolloData({
        untypedComponents: [],
        services: [],
        appFeatures: [],
      })
      .render({ id: 'my-component', emptyHelperText: 'not there' });

    rendered.getByText('not there');
  });

  it('renders nav items', async () => {
    const rendered = buildComponentInApp(OtherLayout)
      .withTheme()
      .withApolloData({
        untypedComponents: [
          {
            id: 'my-component',
            owner: { name: 'me' },
            componentType: 'other',
            componentInfoLocationUri: 'ghe://a/b/c',
            workflows: [{}],
            dataEndpoints: [{}],
          },
        ],
        services: [],
        appFeatures: [],
      })
      .render({ id: 'my-component' });

    rendered.getByText('Workflows');
    rendered.getByText('Data Endpoints');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(OtherLayout)
      .withTheme()
      .withApolloData({
        untypedComponents: [
          {
            id: 'my-component',
            owner: { name: 'me' },
            componentType: 'other',
            componentInfoLocationUri: 'ghe://a/b/c',
            workflows: [],
            dataEndpoints: [],
          },
        ],
        services: [],
        appFeatures: [],
      })
      .render({
        id: 'my-component',
        fragment: gql`
          fragment MoreData on Component {
            id
          }
        `,
        children: data => {
          receivedData = data;
        },
      });

    expect(receivedData).toEqual(expect.objectContaining({ id: 'my-component' }));
    expect(rendered.queryByText('Workflows')).toBeNull();
    expect(rendered.queryByText('Data Endpoints')).toBeNull();
  });
});
