import { buildComponentInApp } from 'testUtils';
import SystemLayout from './SystemLayout';
import gql from 'graphql-tag';

const system = {
  id: 'my-system',
  testing: {},
  codeCoverage: {},
};

describe('<SystemLayout />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(SystemLayout)
      .withApolloLoading()
      .render({ id: 'my-system' });

    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(SystemLayout)
      .withTheme()
      .withApolloData({ system })
      .render({ id: 'my-system' });

    rendered.getByText('my-system');
    rendered.getByText('Overview');
    rendered.getByText('Services');
    rendered.getByText('App Features');
    expect(rendered.queryByText('Code Coverage')).toBeNull();
    expect(rendered.queryByText('Tests')).toBeNull();
  });

  it('shows test info and coverage', () => {
    const rendered = buildComponentInApp(SystemLayout)
      .withTheme()
      .withApolloData({
        system: {
          ...system,
          testing: { distribution: [{}] },
          codeCoverage: { history: [{}] },
        },
      })
      .render({ id: 'my-system' });

    rendered.getByText('my-system');
    rendered.getByText('Overview');
    rendered.getByText('Services');
    rendered.getByText('App Features');
    rendered.getByText('Code Coverage');
    rendered.getByText('Tests');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(SystemLayout)
      .withTheme()
      .withApolloData({ system })
      .render({
        id: 'my-system',
        fragment: gql`
          fragment MoreData on Component {
            id
          }
        `,
        children: data => {
          receivedData = data;
        },
      });

    expect(receivedData).toEqual(expect.objectContaining({ id: 'my-system' }));
    rendered.getByText('my-system');
  });
});
