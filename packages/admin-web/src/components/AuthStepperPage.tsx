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
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { SimpleStepper, SimpleStepperStep } from '@backstage/core-components';
import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  List,
  ListItem,
} from '@material-ui/core';

const AuthStepperPage = () => {
  const [oauthMethod, setOauthMethod] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');

  const OAuthSelector = () => {
    return (
      <>
        <Typography variant="body1">
          Which GitHub Authentication method would you like to add?
        </Typography>
        <RadioGroup
          aria-labelledby="github-auth-method"
          defaultValue="oath"
          value={oauthMethod}
          name="github-auth-method"
        >
          <FormControlLabel
            value="oauth"
            control={<Radio />}
            label="OAuth"
            onChange={e => setOauthMethod((e.target as HTMLInputElement).value)}
          />
          <FormControlLabel
            value="github-app"
            control={<Radio />}
            label="GitHub app"
            onChange={e => setOauthMethod((e.target as HTMLInputElement).value)}
          />
        </RadioGroup>
      </>
    );
  };

  const OAuthCredentials = () => {
    if (oauthMethod === 'oauth') {
      return (
        <>
          <Typography variant="body1">
            Please enter your ClientID and ClientSecret:
          </Typography>
          <List>
            <ListItem>
              <TextField
                size="medium"
                variant="standard"
                label="ClientID"
                placeholder="Required*"
                fullWidth
                value={clientId}
                onChange={e => setClientId(e.target.value)}
              />
            </ListItem>
            <ListItem>
              <TextField
                size="medium"
                label="ClientSecret"
                variant="standard"
                placeholder="Required*"
                fullWidth
                value={clientSecret}
                onChange={e => setClientSecret(e.target.value)}
              />
            </ListItem>
          </List>
        </>
      );
    }
    return (
      <Button variant="contained" color="primary">
        Authenticate
      </Button>
    );
  };

  const OAuthValidation = () => {
    return (
      <Typography variant="body1">
        Your clientID and ClientSecret are valid!
      </Typography>
    );
  };

  const OAuthReview = () => {
    return (
      <Typography variant="body1">
        The following GitHub authentication info will be added to you app.
        Please review below information:
        <Typography variant="body2" style={{ color: 'grayText' }}>
          ClientID: {clientId}
        </Typography>
        <Typography variant="body2" style={{ color: 'grayText' }}>
          ClientSecret: {clientSecret}
        </Typography>
      </Typography>
    );
  };

  return (
    <SimpleStepper>
      <SimpleStepperStep
        title="Set up Github Authentication"
        actions={{
          canNext: () => !!oauthMethod,
        }}
      >
        <OAuthSelector />
      </SimpleStepperStep>
      <SimpleStepperStep
        title="Enter your credentials"
        actions={{
          canNext: () => !!clientId && !!clientSecret,
        }}
      >
        <OAuthCredentials />
      </SimpleStepperStep>
      <SimpleStepperStep title="Validation">
        <OAuthValidation />
      </SimpleStepperStep>
      <SimpleStepperStep
        title="Review"
        actions={{
          nextText: 'Confirm',
        }}
      >
        <OAuthReview />
      </SimpleStepperStep>
    </SimpleStepper>
  );
};
export default AuthStepperPage;
