import { createPlugin } from '@backstage/core';
import HomePage from './components/HomePage';

export default createPlugin({
  id: 'home-page',
  register({ router }) {
    router.registerRoute('/', HomePage);
  },
});
