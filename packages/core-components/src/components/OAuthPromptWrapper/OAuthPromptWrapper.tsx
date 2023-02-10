/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  ApiRef,
  errorApiRef,
  OAuthApi,
  SessionApi,
  useApi,
} from '@backstage/core-plugin-api';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Progress } from '@backstage/core-components';

export type PromptableLoginProps<TProps = {}> = TProps & {
  autoPromptLogin?: boolean;
};

const NotAuthorized = (props: { auth: OAuthApi; scope: string[] }) => {
  const { auth, scope } = props;
  const errorApi = useApi(errorApiRef);

  const onSignInClient = useCallback(async () => {
    try {
      await auth.getAccessToken(scope);
    } catch (e: any) {
      errorApi.post(e);
    }
  }, [auth, errorApi, scope]);

  return (
    <Grid container>
      <Grid item xs={8}>
        <Typography>
          You are not logged in. You need to be signed in to see the content of
          this card.
        </Typography>
      </Grid>
      <Grid item xs={4} container justifyContent="flex-end">
        <Tooltip placement="top" arrow title="Sign in">
          <Button variant="outlined" color="primary" onClick={onSignInClient}>
            Sign in
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export type OAuthPromptWrapperProps = PropsWithChildren<{
  authApiRef: ApiRef<OAuthApi & SessionApi>;
  autoPromptLogin: boolean;
  scope: string[];
}>;

export const OAuthPromptWrapper = (props: OAuthPromptWrapperProps) => {
  const { authApiRef, scope, autoPromptLogin, children } = props;
  const auth = useApi(authApiRef);
  const [sessionState, setSessionState] = useState<string | undefined>();

  const { value, loading } = useAsync(async () => {
    auth.sessionState$().subscribe(state => {
      setSessionState(state);
    });

    return await auth.getAccessToken(scope, {
      instantPopup: autoPromptLogin,
      optional: !autoPromptLogin,
    });
  }, [sessionState]);

  if (loading) {
    return <Progress />;
  }

  if (value !== '') {
    return <>{children}</>;
  }

  return <NotAuthorized auth={auth} scope={scope} />;
};
