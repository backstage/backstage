import { createRouteRef } from '@backstage/core';

const NoIcon = () => null;

export const rootRoute = createRouteRef({
  icon: NoIcon,
  path: '/',
  title: 'Catalog',
});
export const entityRoute = createRouteRef({
  icon: NoIcon,
  path: '/catalog/:name/',
  title: 'Entity',
});
