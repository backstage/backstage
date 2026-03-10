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
import { skillsApiRef } from '../api';
import { skillDetailRouteRef } from '../routes';
import { InstallBox } from './InstallBox';
import { useWellKnownSkillsBaseUrl } from './useWellKnownSkillsBaseUrl';
import {
  PluginHeader,
  Table,
  CellText,
  SearchField,
  useTable,
  type ColumnConfig,
  type OffsetParams,
  type OffsetResponse,
  Container,
  Card,
  CardHeader,
  CardBody,
  Flex,
} from '@backstage/ui';
import type {
  Skill,
  SkillsListResponse,
} from '@backstage/plugin-skills-common';

type SkillRow = Skill & { id: string };

function createColumns(
  skillDetailRoute: (params: { name: string }) => string,
): ColumnConfig<SkillRow>[] {
  return [
    {
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      isSortable: true,
      cell: item => (
        <CellText
          title={item.name}
          href={skillDetailRoute({ name: item.name })}
        />
      ),
    },
    {
      id: 'description',
      label: 'Description',
      cell: item => <CellText title={item.description} />,
    },
    {
      id: 'updatedAt',
      label: 'Updated',
      isSortable: true,
      cell: item => (
        <CellText title={new Date(item.updatedAt).toLocaleDateString()} />
      ),
    },
  ];
}

/** @internal */
export function SkillsListPage() {
  const skillsApi = useApi(skillsApiRef);
  const skillDetailRoute = useRouteRef(skillDetailRouteRef);
  const wellKnownBaseUrl = useWellKnownSkillsBaseUrl();
  const columns = createColumns(skillDetailRoute);

  const { tableProps, search } = useTable<SkillRow>({
    mode: 'offset',
    getData: async (
      params: OffsetParams<unknown>,
    ): Promise<OffsetResponse<SkillRow>> => {
      const orderByMap: Record<string, 'name' | 'createdAt' | 'updatedAt'> = {
        name: 'name',
        updatedAt: 'updatedAt',
      };
      const result: SkillsListResponse = await skillsApi.listSkills({
        search: params.search || undefined,
        offset: params.offset,
        limit: params.pageSize,
        orderBy: params.sort?.column
          ? orderByMap[params.sort.column] ?? 'name'
          : 'name',
        order: params.sort?.direction === 'descending' ? 'desc' : 'asc',
      });
      return {
        data: result.skills.map(s => ({ ...s, id: s.name })),
        totalCount: result.totalCount,
      };
    },
    paginationOptions: {
      pageSize: 20,
      pageSizeOptions: [10, 20, 50],
    },
  });

  return (
    <>
      <PluginHeader title="Skills" />
      <Container style={{ marginTop: 'var(--bui-space-4, 16px)' }}>
        <Flex direction="column" gap="4">
          <Card>
            <CardHeader>Install</CardHeader>
            <CardBody>
              <InstallBox
                description="Use the skills CLI to browse this instance and choose which skills to install."
                command={`npx skills add ${
                  wellKnownBaseUrl ??
                  'https://your-backstage.example.com/.well-known/skills'
                }`}
              />
            </CardBody>
          </Card>
          <SearchField
            value={search.value}
            onChange={search.onChange}
            aria-label="Search skills"
            placeholder="Search skills..."
          />
          <Table columnConfig={columns} {...tableProps} />
        </Flex>
      </Container>
    </>
  );
}
