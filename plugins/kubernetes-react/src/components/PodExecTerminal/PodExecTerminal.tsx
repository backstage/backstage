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
import '@xterm/xterm/css/xterm.css';

import {
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { ClusterAttributes } from '@backstage/plugin-kubernetes-common';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useRef, useEffect, useMemo, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

import { PodExecTerminalAttachAddon } from './PodExecTerminalAttachAddon';
import { kubernetesReactTranslationRef } from '../../translation';

/**
 * Props drilled down to the PodExecTerminal component
 *
 * @public
 */
export interface PodExecTerminalProps {
  cluster: ClusterAttributes;
  containerName: string;
  podName: string;
  podNamespace: string;
}

const HEADER_KUBERNETES_CLUSTER = 'Backstage-Kubernetes-Cluster';
const CONNECTION_TIMEOUT_MS = 15000;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    podExecTerminal: {
      width: '100%',
      height: '100%',
      '& .xterm-screen': { padding: theme.spacing(1) },
    },
  }),
);

/**
 * Executes a `/bin/sh` process in the given pod's container and opens a terminal connected to it
 *
 * @public
 */
export const PodExecTerminal = (props: PodExecTerminalProps) => {
  const classes = useStyles();
  const { cluster, containerName, podNamespace, podName } = props;
  const { t } = useTranslationRef(kubernetesReactTranslationRef);

  const terminalRef = useRef<HTMLDivElement>(null);
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);
  const namespace = podNamespace ?? 'default';

  const [baseHttpUrl, setBaseHttpUrl] = useState<string | undefined>();

  useEffect(() => {
    discoveryApi.getBaseUrl('kubernetes').then(setBaseHttpUrl);
  }, [discoveryApi]);

  const urlParams = useMemo(() => {
    const params = new URLSearchParams({
      container: containerName,
      stdin: 'true',
      stdout: 'true',
      stderr: 'true',
      tty: 'true',
      command: '/bin/sh',
    });
    return params;
  }, [containerName]);

  const execPath = useMemo(
    () =>
      `/proxy/api/v1/namespaces/${namespace}/pods/${podName}/exec?${urlParams}`,
    [namespace, podName, urlParams],
  );

  const socketUrl = useMemo(() => {
    if (!baseHttpUrl) {
      return undefined;
    }

    return `${baseHttpUrl.replace(/^http(s?):\/\//, 'ws$1://')}${execPath}`;
  }, [baseHttpUrl, execPath]);

  useEffect(() => {
    if (!baseHttpUrl || !socketUrl || !terminalRef.current) {
      return undefined;
    }

    let cancelled = false;
    let socket: WebSocket | undefined;
    let connectionTimeout: ReturnType<typeof setTimeout> | undefined;

    const terminal = new Terminal();
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    fitAddon.fit();

    let opened = false;
    let failureMessageWritten = false;

    const writeFailureMessage = (message: string) => {
      if (failureMessageWritten || cancelled) {
        return;
      }
      failureMessageWritten = true;
      terminal.clear();
      terminal.writeln(message);
    };

    const clearConnectionTimeout = () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = undefined;
      }
    };

    const connectWebSocket = () => {
      socket = new WebSocket(socketUrl, ['channel.k8s.io']);

      connectionTimeout = setTimeout(() => {
        if (!opened && socket?.readyState === WebSocket.CONNECTING) {
          socket.close();
          writeFailureMessage(t('podExecTerminal.errors.connectionFailed'));
        }
      }, CONNECTION_TIMEOUT_MS);

      socket.onopen = () => {
        opened = true;
        clearConnectionTimeout();
        terminal.clear();
        const attachAddon = new PodExecTerminalAttachAddon(socket!, {
          bidirectional: true,
        });
        terminal.loadAddon(attachAddon);
      };

      socket.onerror = () => {
        clearConnectionTimeout();
        if (!opened) {
          writeFailureMessage(t('podExecTerminal.errors.permissionDenied'));
        }
      };

      socket.onclose = event => {
        clearConnectionTimeout();
        if (!opened) {
          writeFailureMessage(
            event.code === 1006 || event.code === 1008
              ? t('podExecTerminal.errors.permissionDenied')
              : t('podExecTerminal.errors.connectionFailed'),
          );
          return;
        }

        terminal.writeln(t('podExecTerminal.errors.connectionClosed'));
      };
    };

    const start = async () => {
      terminal.writeln(t('podExecTerminal.starting'));

      try {
        const probeResponse = await fetchApi.fetch(
          `${baseHttpUrl}${execPath}`,
          {
            headers: {
              [HEADER_KUBERNETES_CLUSTER]: cluster.name,
            },
          },
        );

        if (cancelled) {
          return;
        }

        if (probeResponse.status === 403) {
          writeFailureMessage(t('podExecTerminal.errors.permissionDenied'));
          return;
        }
      } catch {
        if (cancelled) {
          return;
        }
        writeFailureMessage(t('podExecTerminal.errors.connectionFailed'));
        return;
      }

      if (cancelled) {
        return;
      }

      connectWebSocket();
    };

    start();

    return () => {
      cancelled = true;
      clearConnectionTimeout();
      socket?.close();
      terminal.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reconnect only when target changes
  }, [baseHttpUrl, execPath, socketUrl, cluster.name]);

  return (
    <div
      data-testid="terminal"
      ref={terminalRef}
      className={classes.podExecTerminal}
    />
  );
};
