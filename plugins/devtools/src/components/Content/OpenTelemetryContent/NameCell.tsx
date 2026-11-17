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

import { Badge, Cell, Flex, Text } from '@backstage/ui';

/** Props for {@link NameCell}. */
export interface NameCellProps {
  name: string;
  pluginId: string;
  description?: string;
}

/**
 * A table cell with the telemetry name, a badge for the plugin that owns it,
 * and an optional description underneath.
 */
export const NameCell = ({ name, pluginId, description }: NameCellProps) => (
  <Cell>
    <Flex direction="column" gap="1">
      <Flex align="center" gap="2">
        <Text as="p" variant="body-medium" truncate title={name}>
          {name}
        </Text>
        <Badge size="medium">{pluginId}</Badge>
      </Flex>
      {description && (
        <Text
          variant="body-medium"
          color="secondary"
          truncate
          title={description}
        >
          {description}
        </Text>
      )}
    </Flex>
  </Cell>
);
