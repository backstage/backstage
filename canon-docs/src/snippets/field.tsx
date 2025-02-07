'use client';

import { Input, Field } from '../../../packages/canon';

export const FieldPreview = () => {
  return (
    <div style={{ width: '300px' }}>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Input placeholder="Enter your name" />
        <Field.Description>Visible on your profile</Field.Description>
      </Field.Root>
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
