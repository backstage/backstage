import { buildComponentInApp } from 'testUtils';
import AppLayout from './AppLayout';
import gql from 'graphql-tag';

describe('<AppNavigation />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(AppLayout)
      .withApolloLoading()
      .render({ id: 'my-id', system: 'system' });
    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(AppLayout)
      .withTheme()
      .withApolloData({
        app: {
          id: 'my-id',
          componentType: 'app',
          componentInfoLocationUri: 'ghe:/a/b/c.yaml',
          owner: {
            name: 'my-owner',
            type: 'squad',
          },
          lifecycle: 'my-lifecycle',
        },
      })
      .render({ id: 'my-id', system: 'system' });
    rendered.getByText('my-id');
    rendered.getByText('Overview');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(AppLayout)
      .withTheme()
      .withApolloData({
        app: {
          id: 'my-id',
          componentType: 'app',
          componentInfoLocationUri: 'ghe:/a/b/c.yaml',
          owner: {
            name: 'my-owner',
            type: 'squad',
          },
          lifecycle: 'my-lifecycle',
        },
      })
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
