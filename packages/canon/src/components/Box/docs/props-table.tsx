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
import * as Table from '../../../../docs/components';
import { Chip } from '../../../../docs/components';
import { listResponsiveValues } from '../../../../docs/utils/argTypes';
import { boxProperties } from '../sprinkles.css';

export const PropsTable = () => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.HeaderRow>
          <Table.HeaderCell>Prop</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
        </Table.HeaderRow>
      </Table.Header>
      <Table.Body>
        {Object.keys(boxProperties.styles)
          .filter(
            n =>
              ![
                'padding',
                'paddingX',
                'paddingY',
                'paddingLeft',
                'paddingRight',
                'paddingTop',
                'paddingBottom',
                'margin',
                'marginX',
                'marginY',
                'marginLeft',
                'marginRight',
                'marginTop',
                'marginBottom',
              ].includes(n),
          )
          .map(n => (
            <Table.Row key={n}>
              <Table.Cell>
                <Chip head>{n}</Chip>
              </Table.Cell>
              <Table.Cell>
                {listResponsiveValues(
                  n as keyof typeof boxProperties.styles,
                ).map(value => (
                  <Chip key={value}>{value}</Chip>
                ))}
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
    </Table.Root>
  );
};
