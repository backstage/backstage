import { createPlugin } from '@backstage/core';
import WelcomePage from './components/WelcomePage';

export const plugin = createPlugin({
  id: 'welcome',
  register({ router }) {
    router.registerRoute('/', WelcomePage);
  },
});
