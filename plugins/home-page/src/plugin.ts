import { createPlugin } from '@spotify-backstage/core';
import HomePage from './components/HomePage';

export default createPlugin({
  id: 'home-page',
  register({ router }) {
    router.registerRoute('/', HomePage);
  },
});
