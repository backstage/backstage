/*
 * Copyright 2020 Spotify AB
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

import React, {
  createContext,
  useContext,
  ReactNode,
  PropsWithChildren,
  Context,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { ApiRef, ApiHolder, TypesToApiRefs } from './types';
import { ApiAggregator } from './ApiAggregator';
import {
  getGlobalSingleton,
  getOrCreateGlobalSingleton,
} from '../../lib/globalObject';
import {
  VersionedValue,
  createVersionedValueMap,
} from '../../lib/versionedValues';

const missingHolderMessage =
  'No ApiProvider available in react context. ' +
  'A common cause of this error is that multiple versions of @backstage/core-api are installed. ' +
  `You can check if that is the case using 'yarn backstage-cli versions:check', and can in many cases ` +
  `fix the issue either with the --fix flag or using 'yarn backstage-cli versions:bump'`;

type ApiProviderProps = {
  apis: ApiHolder;
  children: ReactNode;
};

type ApiContextType = VersionedValue<{ 1: ApiHolder }> | undefined;
const ApiContext = getOrCreateGlobalSingleton('api-context', () =>
  createContext<ApiContextType>(undefined),
);

export const ApiProvider = ({
  apis,
  children,
}: PropsWithChildren<ApiProviderProps>) => {
  const parentHolder = useContext(ApiContext)?.atVersion(1);
  const versionedValue = useMemo(
    () =>
      createVersionedValueMap({
        1: parentHolder ? new ApiAggregator(apis, parentHolder) : apis,
      }),
    [parentHolder, apis],
  );

  return <ApiContext.Provider value={versionedValue} children={children} />;
};

ApiProvider.propTypes = {
  apis: PropTypes.shape({ get: PropTypes.func.isRequired }).isRequired,
  children: PropTypes.node,
};

export function useApiHolder(): ApiHolder {
  const versionedHolder = useContext(
    getGlobalSingleton<Context<ApiContextType>>('api-context'),
  );

  if (!versionedHolder) {
    throw new Error(missingHolderMessage);
  }

  const apiHolder = versionedHolder.atVersion(1);
  if (!apiHolder) {
    throw new Error('ApiContext v1 not available');
  }

  return apiHolder;
}

export function useApi<T>(apiRef: ApiRef<T>): T {
  const apiHolder = useApiHolder();

  const api = apiHolder.get(apiRef);
  if (!api) {
    throw new Error(`No implementation available for ${apiRef}`);
  }
  return api;
}

export function withApis<T>(apis: TypesToApiRefs<T>) {
  return function withApisWrapper<P extends T>(
    WrappedComponent: React.ComponentType<P>,
  ) {
    const Hoc = (props: PropsWithChildren<Omit<P, keyof T>>) => {
      const apiHolder = useApiHolder();

      const impls = {} as T;

      for (const key in apis) {
        if (apis.hasOwnProperty(key)) {
          const ref = apis[key];

          const api = apiHolder.get(ref);
          if (!api) {
            throw new Error(`No implementation available for ${ref}`);
          }
          impls[key] = api;
        }
      }

      return <WrappedComponent {...(props as P)} {...impls} />;
    };
    const displayName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';

    Hoc.displayName = `withApis(${displayName})`;

    return Hoc;
  };
}
