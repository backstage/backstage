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
import 'xterm/css/xterm.css';

import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import { PodExecTerminalAttachAddon } from './PodExecTerminalAttachAddon';

/**
 * Props drilled down to the PodExecTerminal component
 *
 * @public
 */
export interface PodExecTerminalProps {
  clusterName: string;
  containerName: string;
  podName: string;
  podNamespace: string;
}

const hasSocketProtocol = (url: string | URL) =>
  /wss?:\/\//.test(url.toString());

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
  const { containerName, podNamespace, podName } = props;

  const [baseUrl, setBaseUrl] = useState(window.location.host);

  const terminalRef = React.useRef(null);
  const discoveryApi = useApi(discoveryApiRef);
  const namespace = podNamespace ?? 'default';

  useEffect(() => {
    discoveryApi
      .getBaseUrl('kubernetes')
      .then(url => url ?? window.location.host)
      .then(url => url.replace(/^http(s?):\/\//, 'ws$1://'))
      .then(url => setBaseUrl(url));
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

  const socketUrl = useMemo(() => {
    if (!hasSocketProtocol(baseUrl)) {
      return '';
    }

    return new URL(
      `${baseUrl}/proxy/api/v1/namespaces/${namespace}/pods/${podName}/exec?${urlParams}`,
    );
  }, [baseUrl, namespace, podName, urlParams]);

  useEffect(() => {
    if (!hasSocketProtocol(socketUrl)) {
      return () => {};
    }

    const terminal = new Terminal();
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    if (terminalRef.current) {
      terminal.open(terminalRef.current);
      fitAddon.fit();
    }

    terminal.writeln('Starting terminal, please wait...');

    const socket = new WebSocket(socketUrl, ['channel.k8s.io']);

    socket.onopen = () => {
      terminal.clear();
      const attachAddon = new PodExecTerminalAttachAddon(socket, {
        bidirectional: true,
      });

      terminal.loadAddon(attachAddon);
    };

    socket.onclose = () => {
      terminal.writeln('Socket connection closed');
    };

    return () => {
      terminal?.clear();
      socket?.close();
    };
  }, [baseUrl, socketUrl]);

  return (
    <div
      data-testid="terminal"
      ref={terminalRef}
      className={classes.podExecTerminal}
    />
  );
};
