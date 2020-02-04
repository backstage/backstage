import { buildComponentInApp } from 'testUtils';
import { fireEvent } from '@testing-library/react';
import OrgEntityLayout from './OrgEntityLayout';
import { setOverrideUser } from 'shared/apis/user';
import gql from 'graphql-tag';

setOverrideUser('patriko');

const squad = {
  name: 'my-squad',
  untypedComponents: [],
  services: [],
  workflows: [],
  dataEndpoints: [],
};

describe('<OrgEntityLayout />', () => {
  it('renders progress while loading', () => {
    const rendered = buildComponentInApp(OrgEntityLayout)
      .withApolloLoading()
      .render({ entityName: 'squad' });

    rendered.getByTestId('progress');
  });

  it('renders data', () => {
    const rendered = buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({ squad })
      .render({ entityName: 'squad' });

    rendered.getByText('squad');
    rendered.getByText('Overview');
  });

  it('renders navigations', () => {
    const rendered = buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({
        squad: {
          name: 'my-squad',
          testing: {
            distribution: [{}],
          },
          services: [{}],
          websites: [{}],
          appFeatures: [{}],
          workflows: [{}],
          dataEndpoints: [{}],
          tcBuildConfigurations: [{}],
          untypedComponents: [{ componentType: 'partnership' }],
        },
      })
      .render({ entityName: 'squad' });

    rendered.getByText('squad');
    rendered.getByText('Overview');
    rendered.getByText('Tests');
    rendered.getByText('Services');
    rendered.getByText('Websites');
    rendered.getByText('App Features');
    rendered.getByText('Workflows');
    rendered.getByText('Data Endpoints');
    rendered.getByText('Partnerships');
    rendered.getByText('TC Build Configs');
    rendered.getByText('Other');
  });

  it('says thanks', () => {
    buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({ squad: { ...squad, services: [{}] } })
      .render({ entityName: 'squad' })
      .getByText('Thank my-squad for taking care of 1 component');

    buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({ squad: { ...squad, services: [{}, {}] } })
      .render({ entityName: 'squad' })
      .getByText('Thank my-squad for taking care of 2 components');

    buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({ squad: { ...squad, googleCloudPlatformProjects: [{}] } })
      .render({ entityName: 'squad' })
      .getByText('Thank my-squad for taking care of 1 project');

    buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({ squad: { ...squad, googleCloudPlatformProjects: [{}, {}] } })
      .render({ entityName: 'squad' })
      .getByText('Thank my-squad for taking care of 2 projects');

    buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({
        squad: {
          ...squad,
          services: [{}],
          workflows: [{}],
          dataEndpoints: [{}],
          googleCloudPlatformProjects: [{}, {}],
        },
      })
      .render({ entityName: 'squad' })
      .getByText('Thank my-squad for taking care of 3 components and 2 projects');
  });

  it('renders with fragment', () => {
    let receivedData = null;
    const rendered = buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({ squad })
      .render({
        entityName: 'squad',
        fragment: gql`
          fragment MoreData on Component {
            id
          }
        `,
        children: data => {
          receivedData = data;
        },
      });

    expect(receivedData).toEqual({ loading: false, squad });
    rendered.getByText('squad');
  });

  it('toggles to show only production components', () => {
    const rendered = buildComponentInApp(OrgEntityLayout)
      .withTheme()
      .withApolloData({
        squad: {
          name: 'my-squad',
          services: [{ lifecycle: 'production' }],
          workflows: [{ lifecycle: 'experimental' }],
          dataEndpoints: [{}],
          untypedComponents: [{ lifecycle: 'OPERATIONAL' }],
        },
      })
      .render({
        entityName: 'squad',
        children: (data, getProdToggle) => {
          return getProdToggle();
        },
      });

    rendered.getByText('squad');
    rendered.getByText('Services');
    rendered.getByText('Workflows');
    rendered.getByText('Data Endpoints');
    rendered.getByText('Other');

    fireEvent.click(rendered.getByLabelText('Show only Production components'));

    expect(rendered.queryByText('Services')).not.toBeNull();
    expect(rendered.queryByText('Workflows')).toBeNull();
    expect(rendered.queryByText('Data Endpoints')).toBeNull();
    expect(rendered.queryByText('Other')).not.toBeNull();
  });
});
