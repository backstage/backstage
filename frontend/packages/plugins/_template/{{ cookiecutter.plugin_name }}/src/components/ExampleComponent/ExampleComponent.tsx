import React, { FC } from 'react';
import Button from '@material-ui/core/Button';

const ExampleComponent: FC<{}> = () => {
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

export default ExampleComponent;
