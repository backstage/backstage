/*
 * Copyright 2025 The Backstage Authors
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
  title: 'Backstage UI/Colors',
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
    <div style={{ backgroundColor: 'var(--bui-bg-app)' }}>
      <Box p="4" style={{ backgroundColor: 'var(--bui-bg-neutral-1)' }}>
        <Flex direction="row" gap="4" align="center">
          <Text>Neutral 1</Text>
          <Flex
            px="2"
            py="1"
            style={{ backgroundColor: 'var(--bui-bg-neutral-1-hover)' }}
          >
            <Text>Hover</Text>
          </Flex>
          <Flex
            px="2"
            py="1"
            style={{ backgroundColor: 'var(--bui-bg-neutral-1-pressed)' }}
          >
            <Text>Pressed</Text>
          </Flex>
          <Flex
            px="2"
            py="1"
            style={{ backgroundColor: 'var(--bui-bg-neutral-1-disabled)' }}
          >
            <Text style={{ color: 'var(--bui-fg-disabled)' }}>Disabled</Text>
          </Flex>
        </Flex>
        <Box
          p="4"
          mt="4"
          style={{ backgroundColor: 'var(--bui-bg-neutral-2)' }}
        >
          <Flex direction="row" gap="4" align="center">
            <Text>Neutral 2</Text>
            <Flex
              px="2"
              py="1"
              style={{ backgroundColor: 'var(--bui-bg-neutral-2-hover)' }}
            >
              <Text>Hover</Text>
            </Flex>
            <Flex
              px="2"
              py="1"
              style={{ backgroundColor: 'var(--bui-bg-neutral-2-pressed)' }}
            >
              <Text>Pressed</Text>
            </Flex>
            <Flex
              px="2"
              py="1"
              style={{ backgroundColor: 'var(--bui-bg-neutral-2-disabled)' }}
            >
              <Text style={{ color: 'var(--bui-fg-disabled)' }}>Disabled</Text>
            </Flex>
          </Flex>
          <Box
            p="4"
            mt="4"
            style={{ backgroundColor: 'var(--bui-bg-neutral-3)' }}
          >
            <Flex direction="row" gap="4" align="center">
              <Text>Neutral 3</Text>
              <Flex
                px="2"
                py="1"
                style={{ backgroundColor: 'var(--bui-bg-neutral-3-hover)' }}
              >
                <Text>Hover</Text>
              </Flex>
              <Flex
                px="2"
                py="1"
                style={{ backgroundColor: 'var(--bui-bg-neutral-3-pressed)' }}
              >
                <Text>Pressed</Text>
              </Flex>
              <Flex
                px="2"
                py="1"
                style={{ backgroundColor: 'var(--bui-bg-neutral-3-disabled)' }}
              >
                <Text style={{ color: 'var(--bui-fg-disabled)' }}>
                  Disabled
                </Text>
              </Flex>
            </Flex>
            <Box
              p="4"
              mt="4"
              style={{ backgroundColor: 'var(--bui-bg-neutral-4)' }}
            >
              <Flex direction="row" gap="4" align="center">
                <Text>Neutral 4</Text>
                <Flex
                  px="2"
                  py="1"
                  style={{ backgroundColor: 'var(--bui-bg-neutral-4-hover)' }}
                >
                  <Text>Hover</Text>
                </Flex>
                <Flex
                  px="2"
                  py="1"
                  style={{ backgroundColor: 'var(--bui-bg-neutral-4-pressed)' }}
                >
                  <Text>Pressed</Text>
                </Flex>
                <Flex
                  px="2"
                  py="1"
                  style={{
                    backgroundColor: 'var(--bui-bg-neutral-4-disabled)',
                  }}
                >
                  <Text style={{ color: 'var(--bui-fg-disabled)' }}>
                    Disabled
                  </Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  ),
});

export const BgInherit = meta.story({
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
