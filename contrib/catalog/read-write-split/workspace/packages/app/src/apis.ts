import { AnyApiFactory } from '@backstage/core-plugin-api';
import { catalogApiFactory } from './catalogApi';

// This file is already present in a typical Backstage app. We are just adding
// the catalog API factory here to ensure that the frontend sends requests to
// the correct set of catalog nodes depending on whether it's a read or a write
// operation.
export const apis: AnyApiFactory[] = [
  // ...other APIs here...
  catalogApiFactory,
];
