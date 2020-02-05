import {
  createEntityKind,
  createOverviewPage,
  createEntityView,
} from '@backstage/core';
import ComputerIcon from '@material-ui/icons/Computer';
import MockEntityPage from './MockEntityPage';
import MockEntityCard from './MockEntityCard';

/* SERVICE */
const serviceOverviewPage = createOverviewPage()
  .addComponent(MockEntityCard)
  .addComponent(MockEntityCard);

const serviceView = createEntityView()
  .addPage('Overview', 'overview', serviceOverviewPage)
  .addComponent('CI/CD', 'ci-cd', MockEntityPage);

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
