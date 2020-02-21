import { createPlugin } from '@spotify-backstage/core';
import BuildDetailsPage from './components/BuildDetailsPage';
import BuildListPage from './components/BuildListPage';
import BuildIcon from '@material-ui/icons/Build';
import BuildInfoCard from './components/BuildInfoCard';

// export const buildListRoute = createEntityRoute<[]>('/builds')
// export const buildDetailsRoute = createEntityRoute<[number]>('/builds/:buildId')

export default createPlugin({
  id: 'github-actions',

  register({ entityPage, widgets }) {
    entityPage.navItem({ title: 'CI/CD', icon: BuildIcon, target: '/builds' });
    entityPage.route('/builds', BuildListPage);
    entityPage.route('/builds/:buildUri', BuildDetailsPage);
    widgets.add({ size: 8, component: BuildInfoCard });
  },
});
