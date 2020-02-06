import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

type Props = {
  onLogin: (username: string) => Promise<void> | void;
};

const LoginComponent: FC<Props> = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

  const onUsernameChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onSubmit = async () => {
    if (!username) {
      setError('You have to supply a username');
    }

    setError('');
    try {
      await onLogin(username);
    } catch (e) {
      setError(`Login failed: ${e.message}`);
    }
  };

  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <Grid container spacing={8} alignItems="flex-end">
        <Grid item md={true} sm={true} xs={true}>
          <TextField
            id="username"
            label="Username"
            type="email"
            autoFocus
            required
            value={username}
            onChange={onUsernameChanged}
          />
        </Grid>
      </Grid>
      <Grid
        container
        justify="flex-start"
        style={{ marginTop: '24px', marginBottom: '24px' }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={!username}
        >
          Login
        </Button>
      </Grid>
      <Typography>{error || 'Just enter any fake username'}</Typography>
    </form>
  );
};

export default LoginComponent;
