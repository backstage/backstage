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
import { Progress } from '@backstage/frontend-plugin-api';
import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Text,
} from '@backstage/ui';
import { useInfo } from '../../../hooks';
import { InfoDependenciesTable } from './InfoDependenciesTable';
import {
  RiComputerLine,
  RiCpuLine,
  RiFileCopyLine,
  RiNodejsLine,
} from '@remixicon/react';
import { BackstageLogoIcon } from './BackstageLogoIcon';
import styles from '../Content.module.css';
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
  <div className={styles.summaryItem}>
    <span className={styles.summaryIcon} aria-hidden="true">
      {icon}
    </span>
    <Flex direction="column" gap="1">
      <Text variant="body-small" color="secondary">
        {label}
      </Text>
      <Text variant="body-medium" weight="bold" className={styles.summaryValue}>
        {value || 'N/A'}
      </Text>
    </Flex>
  </div>
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
    <Box className={styles.stack}>
      <Card className={styles.panel}>
        <CardHeader className={styles.header}>
          <Text as="h2" variant="title-small">
            System information
          </Text>
          <Button
            variant="secondary"
            onPress={() => copyToClipboard({ about })}
            iconStart={<RiFileCopyLine size={16} />}
          >
            Copy info
          </Button>
        </CardHeader>
        <CardBody className={styles.summaryGrid}>
          <InfoCell
            icon={<RiComputerLine size={20} />}
            label="Operating system"
            value={about?.operatingSystem}
          />
          <InfoCell
            icon={<RiCpuLine size={20} />}
            label="Resources"
            value={about?.resourceUtilization}
          />
          <InfoCell
            icon={<RiNodejsLine size={20} />}
            label="Node.js"
            value={about?.nodeJsVersion}
          />
          <InfoCell
            icon={<BackstageLogoIcon width={20} height={20} />}
            label="Backstage"
            value={about?.backstageVersion}
          />
        </CardBody>
      </Card>
      <InfoDependenciesTable infoDependencies={about?.dependencies} />
    </Box>
  );
};
