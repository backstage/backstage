/*
 * Copyright 2026 The Backstage Authors
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

import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { skillsApiRef } from '../api';
import { rootRouteRef } from '../routes';
import type { Skill, SkillFile } from '@backstage/plugin-skills-common';
import { InstallBox } from './InstallBox';
import { useWellKnownSkillsBaseUrl } from './useWellKnownSkillsBaseUrl';
import {
  HeaderPage,
  Card,
  CardHeader,
  CardBody,
  Accordion,
  AccordionGroup,
  AccordionPanel,
  AccordionTrigger,
  Text,
  Flex,
  Box,
  Alert,
  Skeleton,
  Container,
} from '@backstage/ui';

/** @internal */
export function SkillDetailPage() {
  const { name } = useParams<{ name: string }>();
  const skillsApi = useApi(skillsApiRef);
  const rootRoute = useRouteRef(rootRouteRef);
  const [skill, setSkill] = useState<Skill | undefined>();
  const [files, setFiles] = useState<SkillFile[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const wellKnownBaseUrl = useWellKnownSkillsBaseUrl();

  useEffect(() => {
    if (!name) {
      return undefined;
    }

    let cancelled = false;
    setError(undefined);
    setSkill(undefined);
    setFiles([]);
    setLoading(true);

    Promise.all([skillsApi.getSkill(name), skillsApi.getSkillFiles(name)])
      .then(([skillResult, filesResult]) => {
        if (cancelled) return;
        setSkill(skillResult);
        setFiles(filesResult);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message || 'Failed to load skill');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [name, skillsApi]);

  if (loading) {
    return (
      <>
        <HeaderPage title="Skill" />
        <Skeleton />
      </>
    );
  }

  if (error || !skill) {
    return (
      <>
        <HeaderPage title="Skill" />
        <Alert status="danger" title={error || 'Skill not found'} />
      </>
    );
  }

  const installCommand = `npx skills add ${
    wellKnownBaseUrl ?? 'https://your-backstage.example.com/.well-known/skills'
  }/${skill.name}`;

  return (
    <>
      <HeaderPage
        title={skill.name}
        breadcrumbs={[{ label: 'Skills', href: rootRoute() }]}
      />

      <Container>
        <Flex direction="column" gap="4">
          <Card>
            <CardHeader>Details</CardHeader>
            <CardBody>
              <Flex direction="column" gap="2">
                <Box>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginRight: 'var(--bui-space-1, 8px)',
                    }}
                  >
                    Description:
                  </Text>
                  <Text>{skill.description}</Text>
                </Box>
                {skill.license && (
                  <Box>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        marginRight: 'var(--bui-space-1, 8px)',
                      }}
                    >
                      License:
                    </Text>
                    <Text>{skill.license}</Text>
                  </Box>
                )}
                {skill.compatibility && (
                  <Box>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        marginRight: 'var(--bui-space-1, 8px)',
                      }}
                    >
                      Compatibility:
                    </Text>
                    <Text>{skill.compatibility}</Text>
                  </Box>
                )}
                {skill.source && (
                  <Box>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        marginRight: 'var(--bui-space-1, 8px)',
                      }}
                    >
                      Source:
                    </Text>
                    <Text>{skill.source}</Text>
                  </Box>
                )}
                {skill.allowedTools && (
                  <Box>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        marginRight: 'var(--bui-space-1, 8px)',
                      }}
                    >
                      Allowed Tools:
                    </Text>
                    <Text>{skill.allowedTools}</Text>
                  </Box>
                )}
                {skill.metadata && (
                  <Box>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        marginRight: 'var(--bui-space-1, 8px)',
                      }}
                    >
                      Metadata:
                    </Text>
                    {Object.entries(skill.metadata).map(([key, value]) => (
                      <Text key={key}>
                        {key}: {value}
                      </Text>
                    ))}
                  </Box>
                )}
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Install</CardHeader>
            <CardBody>
              <InstallBox
                description="Use the skills CLI to install this skill."
                command={installCommand}
              />
            </CardBody>
          </Card>

          {files.length > 0 && (
            <Card>
              <CardHeader>Files</CardHeader>
              <CardBody>
                <AccordionGroup allowsMultiple>
                  {files.map(file => (
                    <Accordion
                      key={file.path}
                      defaultExpanded={file.path === files[0]?.path}
                    >
                      <AccordionTrigger title={file.path} />
                      <AccordionPanel>
                        <Box
                          style={{
                            backgroundColor: 'var(--bui-bg-neutral-1, #f5f5f5)',
                            padding: 'var(--bui-space-3, 12px)',
                            borderRadius: 'var(--bui-radius-md, 8px)',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                            overflowX: 'auto',
                          }}
                        >
                          <Text>{file.content}</Text>
                        </Box>
                      </AccordionPanel>
                    </Accordion>
                  ))}
                </AccordionGroup>
              </CardBody>
            </Card>
          )}
        </Flex>
      </Container>
    </>
  );
}
