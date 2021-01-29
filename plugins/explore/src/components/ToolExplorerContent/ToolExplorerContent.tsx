/*
 * Copyright 2021 Spotify AB
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
import {
  Content,
  ContentHeader,
  EmptyState,
  Progress,
  SupportButton,
  useApi,
} from '@backstage/core';
import { exploreToolsConfigRef } from '@backstage/plugin-explore-react';
import React from 'react';
import { useAsync } from 'react-use';
import { ToolCardGrid } from '../ToolCard';

export const ToolExplorerContent = () => {
  const exploreToolsConfigApi = useApi(exploreToolsConfigRef);
  const { value: tools, loading } = useAsync(async () => {
    return await exploreToolsConfigApi.getTools();
  }, [exploreToolsConfigApi]);

  return (
    <Content noPadding>
      <ContentHeader title="Tools">
        <SupportButton>Discover the tools in your ecosystem.</SupportButton>
      </ContentHeader>

      {loading && <Progress />}
      {!loading && (!tools || tools.length === 0) && (
        <EmptyState
          missing="info"
          title="No tools to display"
          description={`You haven't added any tools yet.`}
        />
      )}
      {!loading && tools && <ToolCardGrid tools={tools} />}
    </Content>
  );
};
