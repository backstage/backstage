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
import React, { FC } from 'react';
import { Component } from '../../data/component';
import { Progress, InfoCard, StructuredMetadataTable } from '@backstage/core';

type ComponentMetadataCardProps = {
  loading: boolean;
  component: Component | undefined;
};
const ComponentMetadataCard: FC<ComponentMetadataCardProps> = ({
  loading,
  component,
}) => {
  if (loading) {
    return <Progress />;
  }
  if (!component) {
    return null;
  }
  return (
    <InfoCard title="Metadata">
      <StructuredMetadataTable metadata={component} />
    </InfoCard>
  );
};
export default ComponentMetadataCard;
