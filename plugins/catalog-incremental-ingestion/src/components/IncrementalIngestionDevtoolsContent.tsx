/*
 * Copyright 2026 The Backstage Authors
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

import { useState } from 'react';
import useAsync from 'react-use/esm/useAsync';
import {
  CodeSnippet,
  ErrorPanel,
  Progress,
  StatusOK,
  StatusWarning,
  Table,
  type TableColumn,
} from '@backstage/core-components';
import {
  alertApiRef,
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import DescriptionIcon from '@material-ui/icons/Description';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import RefreshIcon from '@material-ui/icons/Refresh';

type ProvidersResponse = {
  success: boolean;
  providers: string[];
};

type ProviderStatusResponse = {
  success: boolean;
  status?: {
    current_action?: string;
    next_action_at?: string;
  };
  last_error?: string;
};

type HealthResponse =
  | {
      healthy: true;
    }
  | {
      healthy: false;
      duplicateIngestions: string[];
    };

type ProviderRow = {
  id: string;
  provider: string;
  currentAction: string;
  nextActionAt?: string;
  lastError?: string;
};

type ProviderAction = {
  key: string;
  label: string;
  tooltip?: string;
  method: 'POST' | 'DELETE';
  path: string;
  confirmMessage?: string;
};

type PendingProviderAction = {
  provider: string;
  action: ProviderAction;
};

type RawDialogState = {
  title: string;
  apiUrl: string;
  payload: unknown;
};

const PROVIDER_ACTIONS: ProviderAction[] = [
  {
    key: 'trigger',
    label: 'Trigger',
    tooltip: 'Trigger the next scheduled action immediately',
    method: 'POST',
    path: 'trigger',
  },
  {
    key: 'clear-marks',
    label: 'Cleanup History',
    tooltip:
      'Remove expired marks and ingestion history from completed runs (keeps active ingestion data)',
    method: 'DELETE',
    path: 'marks',
    confirmMessage:
      'Remove expired marks and ingestion history for completed runs of this provider?',
  },
];

const getAvailableActionKeys = (currentAction: string): string[] => {
  const normalized = currentAction.toLowerCase();

  const isResting =
    normalized === 'resting' ||
    normalized.includes('rest complete') ||
    normalized.includes('waiting to start');
  const isComplete = normalized === 'complete';

  const keys: string[] = [];

  if (
    isResting ||
    normalized === 'interstitial' ||
    normalized === 'backing off'
  ) {
    keys.push('trigger');
  }

  if (isResting || isComplete) {
    keys.push('clear-marks');
  }

  return keys;
};

const formatDateTime = (value?: string) => {
  if (!value) {
    return 'Not scheduled';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const isIdleProviderAction = (currentAction: string) => {
  const normalized = currentAction.toLowerCase();

  return (
    normalized === 'resting' ||
    normalized === 'complete' ||
    normalized.includes('rest complete') ||
    normalized.includes('waiting to start')
  );
};

const StatusDisplay = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => (
  <Box display="flex" alignItems="center">
    {icon}
    <Typography variant="body2" style={{ marginLeft: 8 }}>
      {text}
    </Typography>
  </Box>
);

const ProviderStatusDisplay = ({
  currentAction,
}: {
  currentAction: string;
}) => {
  if (isIdleProviderAction(currentAction)) {
    return (
      <StatusDisplay
        icon={<NightsStayIcon fontSize="small" />}
        text={currentAction}
      />
    );
  }

  return (
    <StatusDisplay
      icon={<CircularProgress color="inherit" size="30px" />}
      text={currentAction}
    />
  );
};

const JsonDialog = ({
  open,
  onClose,
  title,
  apiUrl,
  payload,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  apiUrl: string;
  payload: unknown;
}) => {
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          style={{ position: 'absolute', right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box marginBottom={2}>
          <Typography variant="subtitle2">API URL</Typography>
          <Typography variant="body2" component="code">
            {apiUrl}
          </Typography>
        </Box>
        <CodeSnippet
          language="json"
          showLineNumbers
          text={JSON.stringify(payload, null, 2)}
        />
      </DialogContent>
    </Dialog>
  );
};

const getActionIcon = (actionKey: string) => {
  switch (actionKey) {
    case 'trigger':
      return <RefreshIcon />;
    default:
      return <DeleteSweepIcon />;
  }
};

/**
 * DevTools content for catalog incremental ingestion.
 *
 * @public
 */
export const IncrementalIngestionDevtoolsContent = () => {
  const discoveryApi = useApi(discoveryApiRef);
  const { fetch } = useApi(fetchApiRef);
  const alertApi = useApi(alertApiRef);
  const [refreshKey, setRefreshKey] = useState(0);
  const [busyActionKey, setBusyActionKey] = useState<string>();
  const [pendingAction, setPendingAction] = useState<PendingProviderAction>();
  const [rawDialog, setRawDialog] = useState<RawDialogState>();

  const { loading, error, value } = useAsync(async () => {
    const baseUrl = await discoveryApi.getBaseUrl('catalog');

    const healthResponse = await fetch(`${baseUrl}/incremental/health`);
    if (!healthResponse.ok) {
      throw await ResponseError.fromResponse(healthResponse);
    }

    const health = (await healthResponse.json()) as HealthResponse;

    const providersResponse = await fetch(`${baseUrl}/incremental/providers`);
    if (!providersResponse.ok) {
      throw await ResponseError.fromResponse(providersResponse);
    }

    const providersData = (await providersResponse.json()) as ProvidersResponse;
    const providers = await Promise.all(
      providersData.providers.map(async provider => {
        const statusResponse = await fetch(
          `${baseUrl}/incremental/providers/${encodeURIComponent(provider)}`,
        );
        if (!statusResponse.ok) {
          throw await ResponseError.fromResponse(statusResponse);
        }

        const statusData =
          (await statusResponse.json()) as ProviderStatusResponse;

        return {
          id: provider,
          provider,
          currentAction: statusData.status?.current_action ?? 'unknown',
          nextActionAt: statusData.status?.next_action_at,
          lastError: statusData.last_error,
        };
      }),
    );

    return { health, providers };
  }, [discoveryApi, fetch, refreshKey]);

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ErrorPanel error={error} />;
  }

  const executeProviderAction = async (
    provider: string,
    action: ProviderAction,
  ): Promise<void> => {
    const actionKey = `${provider}:${action.key}`;
    setBusyActionKey(actionKey);

    try {
      const baseUrl = await discoveryApi.getBaseUrl('catalog');
      const response = await fetch(
        `${baseUrl}/incremental/providers/${encodeURIComponent(provider)}/${
          action.path
        }`,
        {
          method: action.method,
        },
      );

      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      const payload = (await response.json()) as {
        message?: string;
      };
      alertApi.post({
        message: payload.message ?? `${action.label} executed for ${provider}`,
        severity: 'success',
      });
      setRefreshKey(key => key + 1);
    } catch (e) {
      alertApi.post({
        message:
          e instanceof Error
            ? e.message
            : `Failed to run ${action.label} for ${provider}`,
        severity: 'error',
      });
    } finally {
      setBusyActionKey(undefined);
    }
  };

  const runProviderAction = async (
    provider: string,
    action: ProviderAction,
  ): Promise<void> => {
    if (pendingAction) {
      return;
    }

    if (action.confirmMessage) {
      setPendingAction({ provider, action });
      return;
    }

    await executeProviderAction(provider, action);
  };

  const openRawDialog = async (
    provider: string,
    kind: 'status' | 'marks',
  ): Promise<void> => {
    const actionKey = `${provider}:${kind}`;
    setBusyActionKey(actionKey);

    try {
      const baseUrl = await discoveryApi.getBaseUrl('catalog');
      const providerPath = encodeURIComponent(provider);
      const apiUrl =
        kind === 'status'
          ? `${baseUrl}/incremental/providers/${providerPath}`
          : `${baseUrl}/incremental/providers/${providerPath}/marks`;

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      setRawDialog({
        title: kind === 'status' ? 'Status Raw' : 'Marks Raw',
        apiUrl,
        payload: await response.json(),
      });
    } catch (e) {
      alertApi.post({
        message:
          e instanceof Error
            ? e.message
            : `Failed to load ${kind} for ${provider}`,
        severity: 'error',
      });
    } finally {
      setBusyActionKey(undefined);
    }
  };

  const columns: TableColumn<ProviderRow>[] = [
    {
      title: 'Provider',
      field: 'provider',
    },
    {
      title: 'Status',
      field: 'currentAction',
      render: row => (
        <ProviderStatusDisplay currentAction={row.currentAction} />
      ),
    },
    {
      title: 'Next Action At',
      field: 'nextActionAt',
      render: row => formatDateTime(row.nextActionAt),
    },
    {
      title: 'Last Error',
      field: 'lastError',
      render: row => row.lastError ?? 'None',
    },
    {
      title: 'Actions',
      field: 'provider',
      render: row => {
        const availableActionKeys = getAvailableActionKeys(row.currentAction);
        const isActionBlocked =
          Boolean(busyActionKey) || Boolean(pendingAction);

        return (
          <Box display="flex" justifyContent="center">
            {PROVIDER_ACTIONS.map(action => {
              const actionKey = `${row.provider}:${action.key}`;
              const isBusy = busyActionKey === actionKey;
              const isAvailable = availableActionKeys.includes(action.key);

              return (
                <Tooltip key={actionKey} title={action.tooltip ?? action.label}>
                  <Box component="span">
                    <IconButton
                      aria-label={action.label}
                      disabled={!isAvailable || isActionBlocked}
                      onClick={() => runProviderAction(row.provider, action)}
                    >
                      {isBusy ? (
                        <CircularProgress size={20} />
                      ) : (
                        getActionIcon(action.key)
                      )}
                    </IconButton>
                  </Box>
                </Tooltip>
              );
            })}
            {(['status', 'marks'] as const).map(kind => {
              const actionKey = `${row.provider}:${kind}`;
              const isBusy = busyActionKey === actionKey;

              return (
                <Tooltip
                  key={actionKey}
                  title={kind === 'status' ? 'Status Raw' : 'Marks Raw'}
                >
                  <Box component="span">
                    <IconButton
                      aria-label={
                        kind === 'status' ? 'Status Raw' : 'Marks Raw'
                      }
                      disabled={isActionBlocked}
                      onClick={() => openRawDialog(row.provider, kind)}
                    >
                      {isBusy ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DescriptionIcon />
                      )}
                    </IconButton>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        );
      },
    },
  ];

  const duplicateIngestions =
    value?.health.healthy === false ? value.health.duplicateIngestions : [];

  return (
    <>
      {rawDialog ? (
        <JsonDialog
          open
          onClose={() => setRawDialog(undefined)}
          title={rawDialog.title}
          apiUrl={rawDialog.apiUrl}
          payload={rawDialog.payload}
        />
      ) : null}
      <Dialog
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(undefined)}
      >
        <DialogTitle>Confirm Provider Action</DialogTitle>
        <DialogContent>
          <Typography>{pendingAction?.action.confirmMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingAction(undefined)} color="primary">
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={async () => {
              if (!pendingAction) {
                return;
              }

              const { provider, action } = pendingAction;
              setPendingAction(undefined);
              await executeProviderAction(provider, action);
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      <Typography paragraph>
        Incremental ingestion providers registered in the catalog backend.
      </Typography>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => setRefreshKey(key => key + 1)}
      >
        Refresh
      </Button>
      <Typography paragraph style={{ marginTop: 16 }}>
        Health:{' '}
        {value?.health.healthy ? (
          <StatusOK>Healthy</StatusOK>
        ) : (
          <StatusWarning>
            Duplicate ingestions detected: {duplicateIngestions.join(', ')}
          </StatusWarning>
        )}
      </Typography>
      <Table
        title="Providers"
        options={{
          paging: false,
          search: false,
          sorting: true,
          padding: 'dense',
        }}
        columns={columns}
        data={value?.providers ?? []}
        emptyContent={
          <Typography color="textSecondary">
            No incremental ingestion providers found.
          </Typography>
        }
      />
    </>
  );
};
