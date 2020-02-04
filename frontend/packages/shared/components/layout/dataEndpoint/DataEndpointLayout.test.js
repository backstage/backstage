import { buildComponentInApp } from 'testUtils';
import DataEndpointLayout from './DataEndpointLayout';
import gql from 'graphql-tag';

const dataEndpoint = {
  id: 'my-id',
  componentType: 'data-endpoint',
  componentInfoLocationUri: 'ghe:/a/b/c.yaml',
  storageUriPattern: 'bq://a/b/c',
  owner: {
    name: 'my-owner',
    type: 'squad',
  },
  lifecycle: 'lifecycle',
};

describe('<DataEndpointLayout />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(DataEndpointLayout)
      .withApolloLoading()
      .render({ id: 'my-id', system: 'system' });
    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(DataEndpointLayout)
      .withTheme()
      .withApolloData({ dataEndpoint })
      .render({ id: 'my-id', system: 'system' });
    rendered.getByText('my-id');
    rendered.getByText('Overview');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(DataEndpointLayout)
      .withTheme()
      .withApolloData({ dataEndpoint })
      .render({
        id: 'my-id',
        system: 'system',
        fragment: gql`
          fragment MoreData on Component {
            id
          }
        `,
        children: data => {
          receivedData = data;
        },
      });

    expect(receivedData).toEqual(expect.objectContaining({ id: 'my-id' }));
    rendered.getByText('my-id');
    rendered.getByText('Overview');
  });
});
