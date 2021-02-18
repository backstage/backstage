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
import React from 'react';
import { useAsync } from 'react-use';
import { Progress, useApi, WarningPanel } from '@backstage/core';
import { useEntity } from '@backstage/plugin-catalog-react';
import { badgesClientApiRef } from '../BadgesClientApi';
import { BadgesDrawer } from './BadgesDrawer';

export const EntityBadgesField = () => {
  const badgesClientApi = useApi(badgesClientApiRef);
  const { entity } = useEntity();
  const { value, loading, error } = useAsync(async () => {
    return {
      badge: await badgesClientApi.getEntityPoweredByBadgeURL(entity),
      markdown: await badgesClientApi.getEntityPoweredByMarkdownCode(entity),
    };
  }, [badgesClientApi, entity]);

  const badges = [];

  if (value) {
    badges.push({
      title: 'Powered by Backstage',
      badgeUrl: value.badge,
      markdownCode: value.markdown,
    });
  }

  return (
    <div>
      {loading && <Progress />}
      {error && (
        <WarningPanel title="Failed to get badge" message={`Error: ${error}`} />
      )}
      {badges.length > 0 && <BadgesDrawer badges={badges} />}
    </div>
  );
};
