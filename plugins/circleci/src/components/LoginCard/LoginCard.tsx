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

const useSessionStorage = (key: string): [string, (value: string) => void] => {
  const [value, setter] = React.useState(sessionStorage.getItem(key) ?? '');
  const setValue = (newValue: string) => {
    sessionStorage.setItem(key, newValue);
    setter(sessionStorage.getItem(key) ?? '');
  };

  React.useEffect(() => {
    const storageChangeHandle = (e: StorageEvent) => {
      if (e.storageArea !== sessionStorage) return;
      if (e.key !== key) return;
      if (e.newValue !== e.oldValue) {
        setter(e.newValue ?? '');
      }
    };
    window.addEventListener('storage', storageChangeHandle);
    return () => window.removeEventListener('storage', storageChangeHandle);
  }, [key, setter]);

  return [value, setValue];
};
export const LoginCard = () => {
  const [token, setToken] = useSessionStorage(circleCIApiRef.id + '_token');

  const api = useApi(circleCIApiRef);

  React.useEffect(() => {
    if (token && token !== '') {
      api.authenticate(token);
    }
  }, []);
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
