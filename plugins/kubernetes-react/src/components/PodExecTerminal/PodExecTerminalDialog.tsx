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

import OpenInBrowserIcon from '@material-ui/icons/OpenInBrowser';
import React from 'react';

import { KubernetesDialog } from '../KubernetesDialog';
import { useIsPodExecTerminalSupported } from '../../hooks';
import { PodExecTerminal, PodExecTerminalProps } from './PodExecTerminal';

/**
 * Opens a terminal connected to the given pod's container in a dialog
 *
 * @public
 */
export const PodExecTerminalDialog = (props: PodExecTerminalProps) => {
  const { clusterName, containerName, podName } = props;

  const isPodExecTerminalSupported = useIsPodExecTerminalSupported();

  return (
    !isPodExecTerminalSupported.loading &&
    isPodExecTerminalSupported.value && (
      <KubernetesDialog
        buttonAriaLabel="open terminal"
        buttonIcon={<OpenInBrowserIcon />}
        buttonText="Terminal"
        disabled={
          isPodExecTerminalSupported.loading ||
          !isPodExecTerminalSupported.value
        }
        title={`${podName} - ${containerName} terminal shell on cluster ${clusterName}`}
      >
        <PodExecTerminal {...props} />
      </KubernetesDialog>
    )
  );
};
