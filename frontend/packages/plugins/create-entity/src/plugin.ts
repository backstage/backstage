import { createPlugin } from '@backstage/core';
import CreateEntityPage from './components/CreateEntityPage';

export default createPlugin({
  id: 'create-entity',
  register({ router }) {
    router.registerRoute('/create', CreateEntityPage);
  },
});