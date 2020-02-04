import React, { FC } from 'react';
import Button from '@material-ui/core/Button';

const LoginComponent: FC<{}> = () => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => window.location.href = "/"}
    >
      Login
    </Button>
  );
};

export default LoginComponent;
