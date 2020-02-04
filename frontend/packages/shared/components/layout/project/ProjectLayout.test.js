import { buildComponentInApp } from 'testUtils';
import ProjectLayout from './ProjectLayout';
import gql from 'graphql-tag';

describe('<ProjectLayout />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(ProjectLayout)
      .withApolloLoading()
      .render({ id: 'my-project' });

    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(ProjectLayout)
      .withTheme()
      .withApolloData({ googleCloudPlatformProject: { id: 'my-project' } })
      .render({ id: 'my-project' });

    rendered.getByText('my-project');
    rendered.getByText('Overview');
    rendered.getByText('Bigtable');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(ProjectLayout)
      .withTheme()
      .withApolloData({ googleCloudPlatformProject: { id: 'my-project' } })
      .render({
        id: 'my-project',
        fragment: gql`
          fragment MoreData on Component {
            id
          }
        `,
        children: data => {
          receivedData = data;
        },
      });

    expect(receivedData).toEqual({ id: 'my-project' });
    rendered.getByText('Bigtable');
  });
});
