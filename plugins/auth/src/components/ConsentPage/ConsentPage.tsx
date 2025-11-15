/*
 * Copyright 2025 The Backstage Authors
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
import { useParams } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import AppsIcon from '@material-ui/icons/Apps';
import WarningIcon from '@material-ui/icons/Warning';
import {
  Content,
  EmptyState,
  Header,
  Page,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { useConsentSession } from './useConsentSession';
import { configApiRef, useApi } from '@backstage/frontend-plugin-api';

const useStyles = makeStyles(theme => ({
  authCard: {
    maxWidth: 600,
    margin: '0 auto',
    marginTop: theme.spacing(4),
  },
  appHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  appIcon: {
    marginRight: theme.spacing(2),
    fontSize: 40,
  },
  appName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  securityWarning: {
    margin: theme.spacing(2, 0),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
  },
  callbackUrl: {
    fontFamily: 'monospace',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    wordBreak: 'break-all',
    fontSize: '0.875rem',
  },
  scopeList: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
  },
}));

const ConsentPageLayout = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Page themeId="tool">
    <Header title={title} />
    <Content>{children}</Content>
  </Page>
);

export const ConsentPage = () => {
  const classes = useStyles();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { state, handleAction } = useConsentSession({ sessionId });
  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') ?? 'Backstage';

  if (!sessionId) {
    return (
      <ConsentPageLayout title="Authorization Error">
        <EmptyState
          missing="data"
          title="Invalid Request"
          description="The consent request ID is missing or invalid."
        />
      </ConsentPageLayout>
    );
  }

  if (state.status === 'loading') {
    return (
      <ConsentPageLayout title="Authorization Request">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <Progress />
        </Box>
      </ConsentPageLayout>
    );
  }

  if (state.status === 'error') {
    return (
      <ConsentPageLayout title="Authorization Error">
        <ResponseErrorPanel error={new Error(state.error)} />
      </ConsentPageLayout>
    );
  }

  if (state.status === 'completed') {
    return (
      <ConsentPageLayout title="Authorization Complete">
        <Card className={classes.authCard}>
          <CardContent>
            <Box textAlign="center">
              {state.action === 'approve' ? (
                <CheckCircleIcon
                  style={{ fontSize: 64, color: 'green', marginBottom: 16 }}
                />
              ) : (
                <CancelIcon
                  style={{ fontSize: 64, color: 'red', marginBottom: 16 }}
                />
              )}
              <Typography variant="h5" gutterBottom>
                {state.action === 'approve'
                  ? 'Authorization Approved'
                  : 'Authorization Denied'}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {state.action === 'approve'
                  ? `You have successfully authorized the application to access your ${appTitle} account.`
                  : `You have denied the application access to your ${appTitle} account.`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Redirecting to the application...
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </ConsentPageLayout>
    );
  }

  const session = state.session;
  const isSubmitting = state.status === 'submitting';
  const appName = session.clientName ?? session.clientId;

  return (
    <ConsentPageLayout title="Authorization Request">
      <Card className={classes.authCard}>
        <CardContent>
          <Box className={classes.appHeader}>
            <AppsIcon className={classes.appIcon} />
            <Box>
              <Typography className={classes.appName}>{appName}</Typography>
              <Typography variant="body2" color="textSecondary">
                wants to access your {appTitle} account
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Alert
            severity="warning"
            icon={<WarningIcon />}
            className={classes.securityWarning}
          >
            <Typography variant="body2">
              <strong>Security Notice:</strong> By authorizing this application,
              you are granting it access to your {appTitle} account. The
              application will receive an access token that allows it to act on
              your behalf.
            </Typography>
            <Box mt={1}>
              <Typography variant="body2">
                <strong>Callback URL:</strong>
              </Typography>
              <Box className={classes.callbackUrl}>{session.redirectUri}</Box>
            </Box>
          </Alert>

          <Box mt={2}>
            <Typography variant="body2" color="textSecondary">
              Make sure you trust this application and recognize the callback
              URL above. Only authorize applications you trust.
            </Typography>
          </Box>
        </CardContent>

        <CardActions className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            disabled={isSubmitting}
            onClick={() => handleAction('reject')}
            startIcon={<CancelIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
            onClick={() => handleAction('approve')}
            startIcon={<CheckCircleIcon />}
          >
            {isSubmitting ? 'Authorizing...' : 'Authorize'}
          </Button>
        </CardActions>
      </Card>
    </ConsentPageLayout>
  );
};
