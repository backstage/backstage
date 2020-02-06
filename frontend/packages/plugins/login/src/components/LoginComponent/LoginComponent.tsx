import React, { FC, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

const LoginComponent: FC<{}> = () => {
  return (
    <Fragment>
      <Grid container spacing={8} alignItems="flex-end">
        <Grid item md={true} sm={true} xs={true}>
          <TextField
            id="username"
            label="Username"
            type="email"
            autoFocus
            required
          />
        </Grid>
      </Grid>
      <Grid
        container
        justify="flex-start"
        style={{ marginTop: '24px', marginBottom: '24px' }}
      >
        <Button
          variant="contained"
          color="primary"
          style={{ textTransform: 'none' }}
        >
          Login
        </Button>
      </Grid>
    </Fragment>
  );
};

export default LoginComponent;
