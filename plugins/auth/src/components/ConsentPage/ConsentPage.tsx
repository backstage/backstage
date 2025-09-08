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
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  makeStyles,
  Divider,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import AppsIcon from '@material-ui/icons/Apps';
import WarningIcon from '@material-ui/icons/Warning';
import {
  Header,
  Page,
  Content,
  Progress,
  EmptyState,
  ResponseErrorPanel,
} from '@backstage/core-components';
import {
  alertApiRef,
  useApi,
  fetchApiRef,
  discoveryApiRef,
} from '@backstage/core-plugin-api';
import { isError } from '@backstage/errors';

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

interface Session {
  id: string;
  clientName?: string;
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  responseType?: string;
  state?: string;
  nonce?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  expiresAt?: string;
}

export const ConsentPage = () => {
  const classes = useStyles();
  const { sessionId } = useParams<{ sessionId: string }>();
  const alertApi = useApi(alertApiRef);
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState<
    | {
        action: 'approve' | 'reject';
      }
    | undefined
  >(undefined);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) return;

      try {
        const baseUrl = await discoveryApi.getBaseUrl('auth');
        const response = await fetchApi.fetch(
          `${baseUrl}/v1/sessions/${sessionId}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSession(data);
      } catch (err) {
        setError(isError(err) ? err.message : 'Failed to load consent request');
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, discoveryApi, fetchApi]);

  const handleAction = useCallback(
    async (action: 'approve' | 'reject') => {
      if (!session) return;

      setSubmitting(true);
      try {
        const baseUrl = await discoveryApi.getBaseUrl('auth');
        const response = await fetchApi.fetch(
          `${baseUrl}/v1/sessions/${session.id}/${action}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        setCompleted({
          action,
        });

        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        }
      } catch (err) {
        alertApi.post({
          message: isError(err) ? err.message : `Failed to ${action} consent`,
          severity: 'error',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [session, discoveryApi, fetchApi, alertApi],
  );

  if (!sessionId) {
    return (
      <Page themeId="tool">
        <Header title="Authorization Error" />
        <Content>
          <EmptyState
            missing="data"
            title="Invalid Request"
            description="The consent request ID is missing or invalid."
          />
        </Content>
      </Page>
    );
  }

  if (loading) {
    return (
      <Page themeId="tool">
        <Header title="Authorization Request" />
        <Content>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={300}
          >
            <Progress />
          </Box>
        </Content>
      </Page>
    );
  }

  if (error ?? !session) {
    return (
      <Page themeId="tool">
        <Header title="Authorization Error" />
        <Content>
          <ResponseErrorPanel
            error={new Error(error || 'Authorization request not found')}
          />
        </Content>
      </Page>
    );
  }

  if (completed) {
    return (
      <Page themeId="tool">
        <Header title="Authorization Complete" />
        <Content>
          <Card className={classes.authCard}>
            <CardContent>
              <Box textAlign="center">
                {completed.action === 'approve' ? (
                  <CheckCircleIcon
                    style={{ fontSize: 64, color: 'green', marginBottom: 16 }}
                  />
                ) : (
                  <CancelIcon
                    style={{ fontSize: 64, color: 'red', marginBottom: 16 }}
                  />
                )}
                <Typography variant="h5" gutterBottom>
                  {completed.action === 'approve'
                    ? 'Authorization Approved'
                    : 'Authorization Denied'}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  {completed.action === 'approve'
                    ? 'You have successfully authorized the application to access your Backstage account.'
                    : 'You have denied the application access to your Backstage account.'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Redirecting to the application...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Content>
      </Page>
    );
  }

  const appName = session.clientName ?? session.clientId;

  return (
    <Page themeId="tool">
      <Header title="Authorization Request" />
      <Content>
        <Card className={classes.authCard}>
          <CardContent>
            <Box className={classes.appHeader}>
              <AppsIcon className={classes.appIcon} />
              <Box>
                <Typography className={classes.appName}>{appName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  wants to access your Backstage account
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
                <strong>Security Notice:</strong> By authorizing this
                application, you are granting it access to your Backstage
                account. The application will receive an access token that
                allows it to act on your behalf.
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
              disabled={submitting}
              onClick={() => handleAction('reject')}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={submitting}
              onClick={() => handleAction('approve')}
              startIcon={<CheckCircleIcon />}
            >
              {submitting ? 'Authorizing...' : 'Authorize'}
            </Button>
          </CardActions>
        </Card>
      </Content>
    </Page>
  );
};
