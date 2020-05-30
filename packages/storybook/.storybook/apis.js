import {
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ErrorApiForwarder,
  ErrorAlerter,
} from '@backstage/core';

const builder = ApiRegistry.builder();

const alertApi = builder.add(alertApiRef, new AlertApiForwarder());

builder.add(errorApiRef, new ErrorAlerter(alertApi, new ErrorApiForwarder()));

export const apis = builder.build();
