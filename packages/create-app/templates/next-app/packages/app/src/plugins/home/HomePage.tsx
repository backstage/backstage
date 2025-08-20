import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { Navigate } from 'react-router';

export const HomePage = PageBlueprint.make({
  params: {
    path: '/',
    loader: async () => <Navigate to="catalog" />
  }
});
