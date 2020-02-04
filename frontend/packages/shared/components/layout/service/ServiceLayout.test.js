import React from 'react';
import { Redirect as MockRedirect } from 'react-router-dom';
import ServiceLayout from 'shared/components/layout/service/ServiceLayout';
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

const service = {
  id: 'my-service',
  owner: { name: 'me' },
  repo: { org: 'a', project: 'b' },
  componentType: 'service',
  componentInfoLocationUri: 'ghe://a/b/c',
};

describe('<ServiceLayout />', () => {
  it('Renders a progress bar while loading', async () => {
    const { getByTestId } = buildComponentInApp(ServiceLayout)
      .withProps({ id: 'test' })
      .withApolloLoading()
      .render();
    expect(getByTestId('progress')).toBeInTheDocument();
  });

  it('Redirects for website', async () => {
    window.history.pushState({}, 'Test', '/services/test');
    buildComponentInApp(ServiceLayout)
      .withProps({ id: 'test' })
      .withRouterEntries(['/services/test'])
      .withApolloData({
        service: { id: 'test', componentType: 'website' },
      })
      .render();
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/websites/test' }, {});
  });

  it('Redirects for website and plugin', async () => {
    window.history.pushState({}, 'Test', '/services/test/capacity');
    buildComponentInApp(ServiceLayout)
      .withProps({ id: 'test' })
      .withRouterEntries(['/services/test/capacity'])
      .withApolloData({
        service: { id: 'test', componentType: 'website' },
      })
      .render();
    expect(MockRedirect).toHaveBeenCalledWith({ to: '/websites/test/capacity' }, {});
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(ServiceLayout)
      .withTheme()
      .withApolloData({ service })
      .render({ id: 'my-service' });

    rendered.getByText('my-service');
    rendered.getByText('Overview');
    rendered.getByText('Podlinks');
    rendered.getByText('Remote Config');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(ServiceLayout)
      .withTheme()
      .withApolloData({
        service: {
          ...service,
          factsJson: JSON.stringify({
            service_tier: 1,
          }),
        },
      })
      .render({
        id: 'my-service',
        fragment: gql`
          fragment MoreData on Component {
            id
          }
        `,
        children: data => {
          receivedData = data;
        },
      });

    expect(receivedData).toEqual(expect.objectContaining({ id: 'my-service' }));
    rendered.getByText('my-service');
    rendered.getByText('Tier 1');
  });
});
