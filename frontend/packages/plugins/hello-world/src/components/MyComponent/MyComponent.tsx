import React, { FC } from 'react';
import Button from '@material-ui/core/Button';

const MyComponent: FC<{}> = () => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => window.location.reload()}
    >
      Hello!
    </Button>
  );
};

export default MyComponent;
