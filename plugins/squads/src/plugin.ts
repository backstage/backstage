import { 
  createPlugin,
  createRouteRef,
} from '@backstage/core';

export const rootRouteRef = createRouteRef({
  path: '/squads',
  title: 'Squads',
});

export const relativeExplorerRouteRef = createRouteRef({
  path: '/',
  title: 'Squads',
});

// Normally this is /squads/:optionalNamespaceAndName/*
// See Router in ./SquadEntityPage/Router
export const relativeEntityRouteRef = createRouteRef({
  path: '/:optionalNamespaceAndName/*',
  title: 'Squad',
});

export const plugin = createPlugin({
  id: 'squads'
});