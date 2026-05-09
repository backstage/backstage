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

import { Progress } from '@backstage/core-components';
import { Alert, Box, Button, Flex, Text } from '@backstage/ui';
import { useInfo } from '../../../hooks';
import { InfoDependenciesTable } from './InfoDependenciesTable';
import DescriptionIcon from '@material-ui/icons/Description';
import MemoryIcon from '@material-ui/icons/Memory';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import { BackstageLogoIcon } from './BackstageLogoIcon';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { DevToolsInfo } from '@backstage/plugin-devtools-common';

const copyToClipboard = ({ about }: { about: DevToolsInfo | undefined }) => {
  if (about) {
    let formatted = `OS: ${about.operatingSystem}\nResources: ${about.resourceUtilization}\nnode: ${about.nodeJsVersion}\nbackstage: ${about.backstageVersion}\nDependencies:\n`;
    const deps = about.dependencies;
    for (const key in deps) {
      if (Object.prototype.hasOwnProperty.call(deps, key)) {
        formatted = `${formatted}    ${deps[key].name}: ${deps[key].versions}\n`;
      }
    }
    window.navigator.clipboard.writeText(formatted);
  }
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
}

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <Flex direction="column" gap="1" style={{ minWidth: '160px' }}>
    <Flex gap="2" alignItems="center">
      {icon}
      <Text variant="label" weight="bold">
        {label}
      </Text>
    </Flex>
    <Text as="p">{value}</Text>
  </Flex>
);

/** @public */
export const InfoContent = () => {
  const { about, loading, error } = useInfo();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert status="danger" description={error.message} />;
  }
  return (
    <Box>
      <Box pb="4">
        <Flex wrap="wrap" gap="6" alignItems="flex-start">
          <InfoItem
            icon={<DeveloperBoardIcon fontSize="small" />}
            label="Operating System"
            value={about?.operatingSystem}
          />
          <InfoItem
            icon={<MemoryIcon fontSize="small" />}
            label="Resource utilization"
            value={about?.resourceUtilization}
          />
          <InfoItem
            icon={<DescriptionIcon fontSize="small" />}
            label="NodeJS Version"
            value={about?.nodeJsVersion}
          />
          <InfoItem
            icon={<BackstageLogoIcon />}
            label="Backstage Version"
            value={about?.backstageVersion}
          />
          <Button
            variant="secondary"
            iconStart={<FileCopyIcon fontSize="small" />}
            onPress={() => copyToClipboard({ about })}
          >
            Copy Info to Clipboard
          </Button>
        </Flex>
      </Box>
      <InfoDependenciesTable infoDependencies={about?.dependencies} />
    </Box>
  );
};
