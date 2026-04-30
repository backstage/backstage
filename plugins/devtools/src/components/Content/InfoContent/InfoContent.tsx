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

import type { ReactElement } from 'react';
import { Progress } from '@backstage/core-components';
import { Alert, Box, Button, Card, CardBody, Flex, Text } from '@backstage/ui';
import { useInfo } from '../../../hooks';
import { InfoDependenciesTable } from './InfoDependenciesTable';
import {
  RiComputerLine,
  RiCpuLine,
  RiFileCopyLine,
  RiNodejsLine,
} from '@remixicon/react';
import { BackstageLogoIcon } from './BackstageLogoIcon';
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

const InfoCell = ({
  icon,
  label,
  value,
}: {
  icon: ReactElement;
  label: string;
  value: string | undefined;
}) => (
  <Flex direction="row" align="center" gap="2">
    {icon}
    <Flex direction="column" gap="0.5">
      <Text variant="body-medium" weight="bold">
        {label}
      </Text>
      <Text variant="body-small" color="secondary">
        {value}
      </Text>
    </Flex>
  </Flex>
);

/** @public */
export const InfoContent = () => {
  const { about, loading, error } = useInfo();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert status="danger" icon title={error.message} role="alert" />;
  }
  return (
    <Box>
      <Box mb="2">
        <Card>
          <CardBody>
            <Flex
              direction={{ initial: 'column', md: 'row' }}
              align={{ initial: 'stretch', md: 'center' }}
              justify="between"
              gap="4"
            >
              <Flex
                direction={{ initial: 'column', md: 'row' }}
                align={{ initial: 'start', md: 'center' }}
                gap={{ initial: '3', md: '6' }}
              >
                <InfoCell
                  icon={<RiComputerLine />}
                  label="Operating System"
                  value={about?.operatingSystem}
                />
                <InfoCell
                  icon={<RiCpuLine />}
                  label="Resource utilization"
                  value={about?.resourceUtilization}
                />
                <InfoCell
                  icon={<RiNodejsLine />}
                  label="NodeJS Version"
                  value={about?.nodeJsVersion}
                />
                <InfoCell
                  icon={<BackstageLogoIcon />}
                  label="Backstage Version"
                  value={about?.backstageVersion}
                />
              </Flex>
              <Button
                onPress={() => copyToClipboard({ about })}
                iconStart={<RiFileCopyLine />}
              >
                Copy Info to Clipboard
              </Button>
            </Flex>
          </CardBody>
        </Card>
      </Box>
      <InfoDependenciesTable infoDependencies={about?.dependencies} />
    </Box>
  );
};
