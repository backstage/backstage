import { Input } from '@backstage/canon';

export const InputPreview = () => {
  return (
    <div style={{ width: '300px' }}>
      <Input label="Name" placeholder="Enter your name" />
    </div>
  );
};

export const InputLabelAndDescription = () => {
  return (
    <div style={{ width: '300px' }}>
      <Input label="Name" description="Visible on your profile" />
    </div>
  );
};

export const InputError = () => {
  return (
    <div style={{ width: '300px' }}>
      <Input
        label="Name"
        errorMessage="Please enter your name"
        required
        invalid
      />
    </div>
  );
};

export const InputPlayground = () => {
  return (
    <div style={{ maxWidth: '300px' }}>
      <Input label="Name" description="Visible on your profile" />
    </div>
  );
};
