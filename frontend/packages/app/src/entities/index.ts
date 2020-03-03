import {
  createEntityKind,
  createWidgetView,
  createEntityPage,
} from '@spotify-backstage/core';
import ComputerIcon from '@material-ui/icons/Computer';
import WebIcon from '@material-ui/icons/Web';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import CloudIcon from '@material-ui/icons/Cloud';
import TimelineIcon from '@material-ui/icons/Timeline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import DnsIcon from '@material-ui/icons/Dns';
import MockEntityPage from './MockEntityPage';
import MockEntityCard from './MockEntityCard';
import GithubActionsPlugin from '@spotify-backstage/plugin-github-actions';

/* SERVICE */
const serviceOverviewPage = createWidgetView()
  .add({ size: 4, component: MockEntityCard })
  .register(GithubActionsPlugin);

const serviceView = createEntityPage()
  .addPage('Overview', WebIcon, '/overview', serviceOverviewPage)
  .register(GithubActionsPlugin)
  .addComponent('Tests', VerifiedUserIcon, '/tests', MockEntityPage)
  .addComponent('Deployment', CloudIcon, '/deployment', MockEntityPage)
  .addComponent('Monitoring', TimelineIcon, '/monitoring', MockEntityPage)
  .addComponent('Service Levels', CheckCircleIcon, '/sla', MockEntityPage)
  .addComponent('Secrets', VpnKeyIcon, '/secrets', MockEntityPage)
  .addComponent('DNS', DnsIcon, '/dns', MockEntityPage);

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
