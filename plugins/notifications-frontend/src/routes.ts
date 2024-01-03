import { createRouteRef } from '@backstage/core-plugin-api';

import { NOTIFICATIONS_ROUTE } from './constants';

export const rootRouteRef = createRouteRef({
  id: NOTIFICATIONS_ROUTE,
});
