import { createPlugin } from '@backstage/core';
import BuildDetailsPage from './components/BuildDetailsPage';
import BuildListPage from './components/BuildListPage';
import BuildIcon from '@material-ui/icons/Build';

// export const buildListRoute = createEntityRoute<[]>('/builds')
// export const buildDetailsRoute = createEntityRoute<[number]>('/builds/:buildId')

export default createPlugin({
  id: 'github-actions',

  register({ entityPage }) {
    entityPage.navItem({ title: 'CI/CD', icon: BuildIcon, target: '/builds' });
    entityPage.route('/builds', BuildListPage);
    entityPage.route('/builds/:buildUri', BuildDetailsPage);
  },
});
