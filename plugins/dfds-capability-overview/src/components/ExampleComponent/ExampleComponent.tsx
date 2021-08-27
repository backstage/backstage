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
import { Container, CircularProgress } from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core';
import {
  EntityKindPicker,
  EntityListProvider,
  useEntityListProvider,
} from '@backstage/plugin-catalog-react';
import { PerfCapabilityCard } from './PerfCabapilityCard';

const CapabilityEntities = React.memo(({ entities }: { entities: any[] }) => {
  return (
    <div>
      {entities.map((capability, index) => {
        return (
          <PerfCapabilityCard
            key={index}
            name={
              capability?.spec?.name ||
              capability?.spec?.rootId ||
              capability?.spec?.id
            }
            id={capability?.spec?.id}
            description={capability?.spec?.description}
            isMember={capability?.spec?.members.some(
              (member: { email: string }) => member.email === 'kodic@dfds.com',
            )}
            members={capability?.spec?.members}
          />
        );
      })}
    </div>
  );
});

const CapabilitiesListBase = React.memo(() => {
  const { backendEntities } = useEntityListProvider();
  return (
    <Page themeId="tool">
      <Header title="Welcome to Capability Discoverability!" />
      <Content>
        <Container maxWidth="lg" style={{ padding: 0 }}>
          {backendEntities.length === 0 && <CircularProgress />}
          {backendEntities.length > 0 && (
            <CapabilityEntities entities={backendEntities} />
          )}
        </Container>
      </Content>
    </Page>
  );
});

export const ExampleComponent = React.memo(() => {
  return (
    <EntityListProvider>
      <EntityKindPicker initialFilter="capability" hidden />
      <CapabilitiesListBase />
    </EntityListProvider>
  );
});
