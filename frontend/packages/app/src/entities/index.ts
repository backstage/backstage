import {
  createEntityKind,
  createWidgetView,
  createEntityPage,
} from '@backstage/core';
import ComputerIcon from '@material-ui/icons/Computer';
import MockEntityPage from './MockEntityPage';
import MockEntityCard from './MockEntityCard';
import GithubActionsPlugin from '@backstage/plugin-github-actions';

/* SERVICE */
const serviceOverviewPage = createWidgetView()
  .addComponent(MockEntityCard)
  .addComponent(MockEntityCard);

const serviceView = createEntityPage()
  .addPage('Overview', '/overview', serviceOverviewPage)
  .register(GithubActionsPlugin)
  .addComponent('Deployment', '/deployment', MockEntityPage);

const serviceEntity = createEntityKind({
  kind: 'service',
  title: 'Service',
  color: {
    primary: '#f00',
    secondary: '#ba5',
  },
  icon: ComputerIcon,
  pages: {
    view: serviceView,
  },
});

export default [serviceEntity];
