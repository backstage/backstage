import { createPlugin } from '@spotify-backstage/core';
import WelcomePage from './components/WelcomePage';

export default createPlugin({
  id: 'welcome',
  register({ router }) {
    router.registerRoute('/', WelcomePage);
  },
});
