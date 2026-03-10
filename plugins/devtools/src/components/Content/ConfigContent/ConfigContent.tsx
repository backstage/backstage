/*
 * Copyright 2022 The Backstage Authors
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

import { Progress, WarningPanel } from '@backstage/core-components';
import { Alert, Box, Text } from '@backstage/ui';
import { useTheme } from '@material-ui/core/styles';
import ReactJson from 'react-json-view';
import { useConfig } from '../../../hooks';
import { ConfigError } from '@backstage/plugin-devtools-common';

export const WarningContent = ({ error }: { error: ConfigError }) => {
  if (!error.messages) {
    return <Text as="p">{error.message}</Text>;
  }

  const messages = error.messages as string[];

  return (
    <Box>
      {messages.map((message, index) => (
        <Text as="p" key={index}>
          {message}
        </Text>
      ))}
    </Box>
  );
};

/** @public */
export const ConfigContent = () => {
  const theme = useTheme();
  const { configInfo, loading, error } = useConfig();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert status="danger" title={error.message} />;
  }

  if (!configInfo) {
    return <Alert status="danger" title="Unable to load config data" />;
  }

  return (
    <Box>
      {configInfo && configInfo.error && (
        <Box pb="2">
          <WarningPanel title="Config validation failed">
            <WarningContent error={configInfo.error} />
          </WarningPanel>
        </Box>
      )}
      <Box bg="neutral" p="4">
        <ReactJson
          src={configInfo.config as object}
          name="config"
          enableClipboard={false}
          theme={theme.palette.type === 'dark' ? 'chalk' : 'rjv-default'}
        />
      </Box>
    </Box>
  );
};
