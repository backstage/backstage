import { createPlugin } from '@backstage/core';
import WelcomePage from './components/WelcomePage';

export default createPlugin({
  id: 'welcome',
  register({ router }) {
    router.registerRoute('/', WelcomePage);
  },
});
