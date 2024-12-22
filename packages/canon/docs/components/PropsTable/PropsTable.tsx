/*
 * Copyright 2024 The Backstage Authors
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
import * as Table from '..';
import { Chip } from '..';

// Modify the PropsTable component to accept a generic type
export const PropsTable = <T extends Record<string, any>>({
  data,
}: {
  data: T;
}) => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell>Prop</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Responsive</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {Object.keys(data).map(n => (
          <Table.Row key={n}>
            <Table.Cell>
              <Chip head>{n}</Chip>
            </Table.Cell>
            <Table.Cell>
              {Array.isArray(data[n].type) ? (
                data[n].type.map((t: any) => <Chip key={t}>{t}</Chip>)
              ) : (
                <Chip>{data[n].type}</Chip>
              )}
            </Table.Cell>
            <Table.Cell>
              <Chip>{data[n].responsive ? 'Yes' : 'No'}</Chip>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
