/*
 * Copyright 2024 The Backstage Authors
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

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  LinkButton,
  WarningPanel,
} from '@backstage/core-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { deviceAuthApiRef } from '../../api';

export const DeviceAuthVerifyPage = () => {
  const identityApi = useApi(identityApiRef);
  const deviceAuthApi = useApi(deviceAuthApiRef);
  const location = useLocation();
  const navigate = useNavigate();
  const [userCode, setUserCode] = useState('');
  const [hasUserIdentity, setHasUserIdentity] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const useCodeValue = params.get('user_code');
    if (useCodeValue) {
      setUserCode(useCodeValue);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      const { token } = await identityApi.getCredentials();
      setHasUserIdentity(!!token);
    };
    fetchData();
  }, [identityApi]);

  const handleConfirm = async () => {
    console.log('Confirming user code', userCode); // eslint-disable-line no-console
    const resp = await deviceAuthApi.verifyUserCode(userCode);
    if (resp.error) {
      console.error('Error confirming user code', resp.error); // eslint-disable-line
      setWarningMessage(resp.error);
      setShowWarning(true);
    } else {
      setCompleteDialogOpen(true);
    }
  };

  const handleDeny = async () => {
    console.log('Denying user code', userCode); // eslint-disable-line no-console
    const resp = await deviceAuthApi.denyUserCode(userCode);
    if (resp.error) {
      console.error('Error denying user code', resp.error); // eslint-disable-line
      setWarningMessage(resp.error);
      setShowWarning(true);
    }
  };

  const formatUserCode = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
    const upperCased = cleaned.toLocaleUpperCase('en-US');
    return upperCased.match(/.{1,4}/g)?.join('-') || upperCased;
  };

  const sanitizedUserCode = (value: string) => {
    return value.toLocaleLowerCase('en-US').replace(/[^a-zA-Z0-9]/g, '');
  };

  const handleUserCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(
      'user_code',
      sanitizedUserCode(event.target.value.slice(0, 9)),
    );
    navigate({ search: searchParams.toString().toLocaleLowerCase('en-US') });
  };

  return (
    <Page themeId="tool">
      <Header title="Backstage Device Code Verification" />
      <Content>
        <Dialog open={completeDialogOpen}>
          <DialogTitle>Verification Complete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You may now close this window.
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Grid container>
          <Grid item xs={4}>
            <InfoCard title="Verify Code">
              <Grid container>
                {showWarning && (
                  <Grid item xs={12}>
                    <WarningPanel
                      severity="error"
                      message={warningMessage}
                      defaultExpanded
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    id="user-code"
                    label="Code"
                    helperText="Confirm this is the code displayed in your terminal"
                    onChange={handleUserCodeChange}
                    value={formatUserCode(userCode)}
                  />
                </Grid>
                <Grid container spacing={2} item xs={12}>
                  <Grid item>
                    <LinkButton
                      variant="contained"
                      color="secondary"
                      to="#"
                      onClick={handleDeny}
                      disabled={!hasUserIdentity}
                    >
                      Deny
                    </LinkButton>
                  </Grid>
                  <Grid item>
                    <LinkButton
                      variant="contained"
                      color="primary"
                      to="#"
                      onClick={handleConfirm}
                      disabled={!hasUserIdentity}
                    >
                      Confirm
                    </LinkButton>
                  </Grid>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
