import { createRouteRef } from '@backstage/core';

export const rootRoute = createRouteRef({
  icon: () => null,
  path: '/create',
  title: 'Create new entity',
});
export const createTemplateRoute = createRouteRef({
  icon: () => null,
  path: '/create/:templateName',
  title: 'Entity creation',
});
