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
import { MetadataHolder } from '@backstage/core-plugin-api';
import {
  createVersionedValueMap,
  createVersionedContext,
} from '@backstage/version-bridge';
import { MetadataAggregator } from './MetadataAggregator';

/**
 * Prop types for the MetadataProvider component.
 *
 * @public
 */
export type MetadataProviderProps = {
  metadata: MetadataHolder;
  children: ReactNode;
};

const MetadataContext = createVersionedContext<{ 1: MetadataHolder }>(
  'metadata-context',
);

/**
 * Provides an {@link @backstage/core-plugin-api#MetadataHolder} for consumption in
 * the React tree.
 *
 * @public
 */
export const MetadataProvider = (
  props: PropsWithChildren<MetadataProviderProps>,
) => {
  const { children, metadata } = props;
  const parentHolder = useContext(MetadataContext)?.atVersion(1);
  const holder = parentHolder
    ? new MetadataAggregator(metadata, parentHolder)
    : metadata;

  return (
    <MetadataContext.Provider
      value={createVersionedValueMap({ 1: holder })}
      children={children}
    />
  );
};

MetadataProvider.propTypes = {
  metadata: PropTypes.shape({ get: PropTypes.func.isRequired }).isRequired,
  children: PropTypes.node,
};
