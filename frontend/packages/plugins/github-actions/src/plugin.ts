import { createPlugin } from '@backstage/core';
import { entityViewPage } from '@backstage/core/src/api/plugin/outputs';
import BuildPage from './components/BuildPage';

// export const buildListRoute = createEntityRoute<[]>('/builds')
// export const buildDetailsRoute = createEntityRoute<[number]>('/builds/:buildId')

export default createPlugin({
  id: 'github-actions',

  register({ provide }) {
    provide(entityViewPage, {
      title: 'CI/CD',
      path: 'builds',
      component: BuildPage,
    });
  },
});
