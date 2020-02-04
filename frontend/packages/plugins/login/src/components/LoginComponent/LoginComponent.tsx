import React, { FC, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const LoginComponent: FC<{}> = () => {
  return (
    <Fragment>
      <TextField variant="outlined" label="Username: " />
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.href = "/"}
      >
        Login
      </Button>
    </Fragment>
  );
};

export default LoginComponent;
