import { buildComponentInApp } from 'testUtils';
import DocsLayout from './DocsLayout';
import gql from 'graphql-tag';

describe('<DocsLayout />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(DocsLayout)
      .withApolloLoading()
      .render({ id: 'my-id', system: 'system' });
    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(DocsLayout)
      .withTheme()
      .withApolloData({
        component: {
          id: 'my-id',
          componentType: 'tech-doc',
          componentInfoLocationUri: 'ghe:/a/b/c.yaml',
          owner: {
            name: 'my-owner',
            type: 'squad',
          },
          lifecycle: 'lifecycle',
        },
      })
      .render({ id: 'my-id', system: 'system' });
    rendered.getByText('my-id');
    rendered.getByText('Documentation');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(DocsLayout)
      .withTheme()
      .withApolloData({
        component: {
          id: 'my-id',
          componentType: 'tech-doc',
          componentInfoLocationUri: 'ghe:/a/b/c.yaml',
          owner: {
            name: 'my-owner',
            type: 'squad',
          },
          lifecycle: 'lifecycle',
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
    rendered.getByText('Documentation');
  });
});
