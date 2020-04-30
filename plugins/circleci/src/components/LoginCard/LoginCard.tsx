import React from 'react';
import {
  Typography,
  Button,
  TextField,
  List,
  ListItem,
} from '@material-ui/core';
import { Person as PersonIcon } from '@material-ui/icons';
import { InfoCard, useApi } from '@backstage/core';
import { circleCIApiRef } from 'api';

export const LoginCard = () => {
  const [token, setToken] = React.useState('');
  const api = useApi(circleCIApiRef);

  return (
    <InfoCard>
      <Typography variant="h6">
        <PersonIcon /> CircleCI Auth
      </Typography>
      <List>
        <ListItem>
          <TextField
            name="circleci-token"
            type="password"
            label="Token"
            value={token}
            onChange={e => setToken(e.target.value)}
          />
        </ListItem>

        <ListItem>
          <Button
            data-testid="github-auth-button"
            variant="outlined"
            color="primary"
            onClick={() => api.authenticate(token)}
          >
            Authenticate
          </Button>
        </ListItem>
      </List>
    </InfoCard>
  );
};
