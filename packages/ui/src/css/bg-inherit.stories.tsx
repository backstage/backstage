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
import preview from '../../../../.storybook/preview';
import { Box } from '../components/Box';
import { Flex } from '../components/Flex';
import { Text } from '../components/Text';

const meta = preview.meta({
  title: 'Backstage UI/Bg Inherit',
  tags: ['!manifest'],
});

/**
 * A `<div>` styled with `background: var(--bui-bg-inherit)` should always
 * resolve to the same color as the surrounding bg provider — at every level
 * of the neutral chain and inside intent surfaces.
 */
const Probe = ({ label }: { label: string }) => (
  <div
    style={{
      backgroundColor: 'var(--bui-bg-inherit)',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.25rem',
      outline: '1px dashed var(--bui-fg-secondary)',
    }}
  >
    <Text>{label}</Text>
  </div>
);

export const Default = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Probe label="App level (no provider) — resolves to --bui-bg-app" />

      <Box bg="neutral" p="4">
        <Flex direction="column" gap="3">
          <Probe label="Inside neutral-1 — resolves to --bui-bg-neutral-1" />
          <Box bg="neutral" p="4">
            <Flex direction="column" gap="3">
              <Probe label="Inside neutral-2 — resolves to --bui-bg-neutral-2" />
              <Box bg="neutral" p="4">
                <Probe label="Inside neutral-3 — resolves to --bui-bg-neutral-3" />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box bg="danger" p="4">
        <Probe label="Inside danger — resolves to --bui-bg-danger" />
      </Box>

      <Box bg="warning" p="4">
        <Probe label="Inside warning — resolves to --bui-bg-warning" />
      </Box>

      <Box bg="success" p="4">
        <Probe label="Inside success — resolves to --bui-bg-success" />
      </Box>
    </Flex>
  ),
});
