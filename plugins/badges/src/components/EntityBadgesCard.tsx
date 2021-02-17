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
import { Typography } from '@material-ui/core';
import { CodeSnippet, InfoCard } from '@backstage/core';
import { useEntity } from '@backstage/plugin-catalog-react';

export const EntityBadgesCard = () => {
  const { entity } = useEntity();

  // TODO: extract kind, namespace, entity name from entity data...
  const { kind, namespace, entityname } = {
    kind: 'Component',
    namespace: 'default',
    entityname: 'demo',
  };

  // TODO: get url for backstage and the badges api
  const backstage_ui = 'http://localhost:3000';
  const backstage_api = 'http://localhost:7000';
  const badge = `${backstage_api}/badges/${kind}/${namespace}/${entityname}`;

  const target = backstage_ui;
  const markdown_code = `[![Powered by Backstage](${badge})](${target})`;
  return (
    <InfoCard title="Badges">
      <Typography paragraph>
        Paste the following snippet in your <code>README.md</code> or other
        markdown file, to get a powered by backstage badge:
      </Typography>
      <img src={badge} alt="Powered by Backstage badge" />
      <CodeSnippet text={markdown_code} showCopyCodeButton />
    </InfoCard>
  );
};
