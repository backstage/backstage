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
import { useEffect, useState, useRef } from 'react';

import { ContainerScope } from './types';
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesProxyApiRef } from '../../../api/types';
import { Socket } from '../../../utils/socket';

/**
 * Arguments for usePodLogs
 *
 * @public
 */
export interface PodLogsOptions {
  containerScope: ContainerScope;
  previous?: boolean;
}

/**
 * Retrieves the logs for the given pod
 *
 * @public
 */
export const usePodLogs = ({ containerScope, previous }: PodLogsOptions) => {
  const kubernetesProxyApi = useApi(kubernetesProxyApiRef);

  const isMountedRef = useRef(true);

  const [stream, setStream] = useState<{
    logs: string;
    loading: boolean;
    error: Error | null;
  }>({ logs: '', loading: true, error: null });

  useEffect(() => {
    (async () => {
      const sock = await kubernetesProxyApi.streamPodLogs({
        podName: containerScope.podName,
        namespace: containerScope.podNamespace,
        containerName: containerScope.containerName,
        clusterName: containerScope.cluster.name,
        previous,
      });

      sock.addEventListener('message', (e: MessageEvent) => {
        const { data } = e;
        data.text().then((txt: string) => {
          setStream(prev => ({ ...prev, logs: `${prev.logs}\n${txt}` }));
        });
      });

      sock.addEventListener('connecting', () =>
        setStream(prev => ({ ...prev, loading: true })),
      );

      sock.addEventListener('connected', () =>
        setStream(prev => ({ ...prev, loading: false })),
      );

      sock.addEventListener('connect_error', () => {
        setStream(prev => ({
          ...prev,
          error: new Error('Error while connecting'),
        }));
      });

      sock.addEventListener('disconnect_error', () => {
        setStream(prev => ({
          ...prev,
          error: new Error('Error while disconnecting'),
        }));
      });

      if (isMountedRef.current) {
        sock.connect();
      } else if (sock.state === Socket.OPEN) {
        await sock.disconnect();
      }
    })();

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(containerScope)]);

  return stream;
};
