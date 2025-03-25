'use client';

import { Input, Grid } from '../../../packages/canon';

export const InputPreview = () => {
  return (
    <div style={{ width: '300px' }}>
      <Input placeholder="Enter your name" />
    </div>
  );
};

export const InputSizes = () => {
  return (
    <Grid style={{ width: '300px' }}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
    </Grid>
  );
};

export const InputError = () => {
  return (
    <div style={{ width: '300px' }}>
      <Input required />
    </div>
  );
};

export const InputPlayground = () => {
  return (
    <div style={{ maxWidth: '300px' }}>
      <Input placeholder="Enter your name" />
    </div>
  );
};
