import { buildComponentInApp } from 'testUtils';
import ExploreLayout from './ExploreLayout';

describe('<ExploreLayout />', () => {
  it('renders without exploding', () => {
    const rendered = buildComponentInApp(ExploreLayout)
      .withTheme()
      .render({ children: 'my-child' });
    rendered.getByText('Explore the Spotify ecosystem');
    rendered.getByText('my-child');
  });
});
