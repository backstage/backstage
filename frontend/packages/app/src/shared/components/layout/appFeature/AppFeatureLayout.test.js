import { buildComponentInApp } from 'testUtils';
import AppFeatureLayout from './AppFeatureLayout';
import gql from 'graphql-tag';

describe('<AppFeatureLayout />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(AppFeatureLayout)
      .withApolloLoading()
      .render({ id: 'my-id', system: 'system' });
    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(AppFeatureLayout)
      .withTheme()
      .withApolloData({
        appFeature: {
          id: 'my-id',
          componentType: 'app-feature',
          componentInfoLocationUri: 'ghe:/a/b/c.yaml',
          owner: {
            name: 'my-owner',
            type: 'squad',
          },
          lifecycle: 'my-lifecycle',
          codeCoverage: {},
        },
      })
      .render({ id: 'my-id', system: 'system' });
    rendered.getByText('my-id');
    rendered.getByText('Overview');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(AppFeatureLayout)
      .withTheme()
      .withApolloData({
        appFeature: {
          id: 'my-id',
          componentType: 'app-feature',
          componentInfoLocationUri: 'ghe:/a/b/c.yaml',
          owner: {
            name: 'my-owner',
            type: 'squad',
          },
          lifecycle: 'my-lifecycle',
          codeCoverage: {},
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
