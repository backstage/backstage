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

import { useState, type ReactElement } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { Progress, toastApiRef } from '@backstage/frontend-plugin-api';
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
    <Box className={styles.summaryIcon} aria-hidden="true">
      {icon}
    </Box>
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

/**
 * Displays runtime information and package dependencies. The copy action reports
 * its result through the app's notifications.
 *
 * @public
 */
export const InfoContent = () => {
  const { about, loading, error } = useInfo();
  const toastApi = useApi(toastApiRef);
  const [copying, setCopying] = useState(false);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert status="danger" icon title={error.message} role="alert" />;
  }
  return (
    <Box className={styles.stack}>
      <Card className={styles.panel}>
        <CardHeader>
          <Flex
            align="center"
            justify="between"
            gap="3"
            className={styles.toolbar}
          >
            <Text as="h2" variant="title-small">
              System information
            </Text>
            <Button
              variant="secondary"
              isDisabled={!about}
              isPending={copying}
              onPress={async () => {
                if (!about) return;
                setCopying(true);
                try {
                  await window.navigator.clipboard.writeText(
                    [
                      `OS: ${about.operatingSystem}`,
                      `Resources: ${about.resourceUtilization}`,
                      `node: ${about.nodeJsVersion}`,
                      `backstage: ${about.backstageVersion}`,
                      'Dependencies:',
                      ...about.dependencies.map(
                        dep => `    ${dep.name}: ${dep.versions}`,
                      ),
                      '',
                    ].join('\n'),
                  );
                  toastApi.post({
                    title: 'System information copied',
                    status: 'success',
                  });
                } catch {
                  toastApi.post({
                    title: 'Could not copy system information',
                    status: 'danger',
                  });
                } finally {
                  setCopying(false);
                }
              }}
              iconStart={<RiFileCopyLine size={16} />}
            >
              Copy info
            </Button>
          </Flex>
        </CardHeader>
        <CardBody>
          <div className={styles.summaryGrid}>
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
          </div>
        </CardBody>
      </Card>
      <InfoDependenciesTable infoDependencies={about?.dependencies} />
    </Box>
  );
};
