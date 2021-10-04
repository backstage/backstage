/*
 * Copyright 2020 The Backstage Authors
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

import React, { useContext, ReactNode, PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { ApiHolder } from '@backstage/core-plugin-api';
import { ApiAggregator } from './ApiAggregator';
import {
  createVersionedValueMap,
  createVersionedContext,
} from '@backstage/version-bridge';

type ApiProviderProps = {
  apis: ApiHolder;
  children: ReactNode;
};

const ApiContext = createVersionedContext<{ 1: ApiHolder }>('api-context');

export const ApiProvider = ({
  apis,
  children,
}: PropsWithChildren<ApiProviderProps>) => {
  const parentHolder = useContext(ApiContext)?.atVersion(1);
  const holder = parentHolder ? new ApiAggregator(apis, parentHolder) : apis;

  return (
    <ApiContext.Provider
      value={createVersionedValueMap({ 1: holder })}
      children={children}
    />
  );
};

ApiProvider.propTypes = {
  apis: PropTypes.shape({ get: PropTypes.func.isRequired }).isRequired,
  children: PropTypes.node,
};
