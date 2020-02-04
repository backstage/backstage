import { buildComponentInApp } from 'testUtils';
import WorkflowLayout from './WorkflowLayout';
import gql from 'graphql-tag';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

const workflow = {
  id: 'my-workflow',
  component: {
    id: 'my-component',
    owner: { name: 'me' },
  },
  componentType: 'workflow',
  componentInfoLocationUri: 'ghe://a/b/c',
};

describe('<WorkflowLayout />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(WorkflowLayout)
      .withApolloLoading()
      .render({ id: 'my-workflow' });

    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const mock = jest.spyOn(FeatureFlags, 'getItem').mockImplementation(flag => flag === 'workflow-alerts');
    const rendered = buildComponentInApp(WorkflowLayout)
      .withTheme()
      .withApolloData({ workflow })
      .render({ id: 'my-workflow' });

    rendered.getByText('my-workflow');
    rendered.getByText('Backfills');
    rendered.getByText('Dependencies');
    rendered.getByText('Alerting');
    mock.mockRestore();
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(WorkflowLayout)
      .withTheme()
      .withApolloData({
        workflow: {
          ...workflow,
          factsJson: JSON.stringify({
            service_tier: 1,
          }),
        },
      })
      .render({
        id: 'my-workflow',
        fragment: gql`
          fragment MoreData on Component {
            id
          }
        `,
        children: data => {
          receivedData = data;
        },
      });

    expect(receivedData).toEqual(expect.objectContaining({ id: 'my-workflow' }));
    rendered.getByText('my-workflow');
    rendered.getByText('Backfills');
    rendered.getByText('Dependencies');
    expect(rendered.queryByText('Alerting')).toBeNull();
  });
});
