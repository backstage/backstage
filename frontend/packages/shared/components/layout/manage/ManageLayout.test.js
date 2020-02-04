import { buildComponentInApp } from 'testUtils';
import ManageLayout from './ManageLayout';

const user = {
  components: [],
  workflows: [],
  dataEndpoints: [],
  googleCloudPlatformProjects: [],
};

describe('<ManageLayout />', () => {
  it('renders without exploding', () => {
    const rendered = buildComponentInApp(ManageLayout)
      .withTheme()
      .withApolloData({ user })
      .render();

    rendered.getByText('Overview');
  });
});
