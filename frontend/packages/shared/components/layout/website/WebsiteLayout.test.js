import { buildComponentInApp } from 'testUtils';
import WebsiteLayout from './WebsiteLayout';
import gql from 'graphql-tag';

const service = {
  id: 'my-website',
  owner: { name: 'me' },
  componentType: 'service',
  componentInfoLocationUri: 'ghe://a/b/c',
};

describe('<WebsiteLayout />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(WebsiteLayout)
      .withApolloLoading()
      .render({ id: 'my-website' });

    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(WebsiteLayout)
      .withTheme()
      .withApolloData({ service })
      .render({ id: 'my-website' });

    rendered.getByText('my-website');
    rendered.getByText('Overview');
    rendered.getByText('Podlinks');
    rendered.getByText('Remote Config');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(WebsiteLayout)
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
        id: 'my-website',
        fragment: gql`
          fragment MoreData on Component {
            id
          }
        `,
        children: data => {
          receivedData = data;
        },
      });

    expect(receivedData).toEqual(expect.objectContaining({ id: 'my-website' }));
    rendered.getByText('my-website');
    rendered.getByText('Tier 1');
    rendered.getByText('Overview');
    rendered.getByText('Podlinks');
    rendered.getByText('Remote Config');
  });
});
