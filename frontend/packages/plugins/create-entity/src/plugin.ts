import { createPlugin } from '@spotify-backstage/core';
import CreateEntityPage from './components/CreateEntityPage';
import CreateEntityFormPage from './components/CreateEntityFormPage';

export default createPlugin({
  id: 'create-entity',
  register({ router }) {
    router.registerRoute('/create', CreateEntityPage);
    router.registerRoute('/create/:templateId', CreateEntityFormPage);
  },
});
