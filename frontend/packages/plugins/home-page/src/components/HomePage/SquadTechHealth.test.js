import SquadTechHealth from './SquadTechHealth';
import { buildComponentInApp } from 'testUtils';

const minProps = {
  user: {
    googleCloudPlatformProjects: [],
    squads: [{ id: 'tools', googleCloudPlatformProjects: [], services: [] }],
  },
  squads: ['tools'],
  insights: {
    testCertified: 0.5,
  },
};

describe('<SquadTechHealth/>', () => {
  it('renders without exploding', () => {
    const rendered = buildComponentInApp(SquadTechHealth)
      .withTheme()
      .render(minProps);

    expect(rendered.getByText('Test Certified')).toBeInTheDocument();
    expect(rendered.getByText('50%')).toBeInTheDocument();

    expect(rendered.getByText('Cloud Cost')).toBeInTheDocument();
  });
});
