import {
  createEntityKind,
  createWidgetView,
  createEntityPage,
} from '@backstage/core';
import ComputerIcon from '@material-ui/icons/Computer';
import WebIcon from '@material-ui/icons/Web';
import DnsIcon from '@material-ui/icons/Dns';
import MockEntityPage from './MockEntityPage';
import MockEntityCard from './MockEntityCard';
import GithubActionsPlugin from '@backstage/plugin-github-actions';

/* SERVICE */
const serviceOverviewPage = createWidgetView()
  .add({ size: 4, component: MockEntityCard })
  .register(GithubActionsPlugin);

const serviceView = createEntityPage()
  .addPage('Overview', WebIcon, '/overview', serviceOverviewPage)
  .register(GithubActionsPlugin)
  .addComponent('Deployment', DnsIcon, '/deployment', MockEntityPage);

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
