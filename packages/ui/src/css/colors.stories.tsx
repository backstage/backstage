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
});

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
