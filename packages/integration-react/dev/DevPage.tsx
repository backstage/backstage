/*
 * Copyright 2021 The Backstage Authors
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

import { ScmIntegration, ScmIntegrationsGroup } from '@backstage/integration';
import { Box, Text } from '@backstage/ui';
import { scmIntegrationsApiRef } from '../src/api/ScmIntegrationsApi';

import { useApi } from '@backstage/core-plugin-api';

const Integrations = (props: {
  group: ScmIntegrationsGroup<ScmIntegration>;
}) => {
  const integrations = props.group.list();
  if (!integrations) {
    return <Text color="secondary">No integrations of this type</Text>;
  }

  return (
    <Text as="div" variant="body-x-small">
      <pre>{JSON.stringify(integrations, undefined, 2)}</pre>
    </Text>
  );
};

export const DevPage = () => {
  const integrations = useApi(scmIntegrationsApiRef);
  return (
    <Box p="6">
      <Box mb="4">
        <Text as="h2" variant="title-large">
          Azure
        </Text>
      </Box>
      <Integrations group={integrations.azure} />
      <Box mb="4">
        <Text as="h2" variant="title-large">
          Bitbucket Cloud
        </Text>
      </Box>
      <Integrations group={integrations.bitbucketCloud} />
      <Box mb="4">
        <Text as="h2" variant="title-large">
          Bitbucket Server
        </Text>
      </Box>
      <Integrations group={integrations.bitbucketServer} />
      <Box mb="4">
        <Text as="h2" variant="title-large">
          GitHub
        </Text>
      </Box>
      <Integrations group={integrations.github} />
      <Box mb="4">
        <Text as="h2" variant="title-large">
          GitLab
        </Text>
      </Box>
      <Integrations group={integrations.gitlab} />
    </Box>
  );
};
