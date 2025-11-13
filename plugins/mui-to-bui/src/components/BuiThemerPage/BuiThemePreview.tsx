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

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Radio,
  RadioGroup,
  Select,
  Text,
  TextField,
  TagGroup,
  Tag,
} from '@backstage/ui';

interface IsolatedPreviewProps {
  mode: 'light' | 'dark';
  styleObject: Record<string, string>;
}

export function BuiThemePreview({ mode, styleObject }: IsolatedPreviewProps) {
  return (
    <div
      // Setting the theme mode ensures that the correct defaults are picked up from the BUI theme
      data-theme-mode={mode}
      style={{
        // Apply the generated CSS variables directly to this container
        // This creates a scoped context where the variables take precedence
        ...styleObject,
        width: '100%',
        backgroundColor: 'var(--bui-bg-surface-2)',
        padding: 'var(--bui-space-3)',
        borderRadius: 'var(--bui-radius-2)',
        border: '1px solid var(--bui-border)',
      }}
    >
      <Flex direction="column" gap="4">
        <Card>
          <CardHeader>Button Variants</CardHeader>
          <CardBody>
            <Flex gap="3">
              <Flex direction="column" gap="2">
                <Button variant="primary">Primary</Button>
                <Button isDisabled variant="primary">
                  Disabled
                </Button>
              </Flex>
              <Flex direction="column" gap="2">
                <Button variant="secondary">Secondary</Button>
                <Button isDisabled variant="secondary">
                  Disabled
                </Button>
              </Flex>
              <Flex direction="column" gap="2">
                <Button variant="tertiary">Tertiary</Button>
                <Button isDisabled variant="tertiary">
                  Disabled
                </Button>
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Form Inputs</CardHeader>
          <CardBody>
            <Flex direction="column" gap="3">
              <TextField label="Text Input" placeholder="Enter some text" />
              <Select
                label="Select Input"
                options={[
                  { value: 'option1', label: 'Option 1' },
                  { value: 'option2', label: 'Option 2' },
                  { value: 'option3', label: 'Option 3' },
                ]}
              />
              <Checkbox>Checkbox Option</Checkbox>
              <RadioGroup label="Radio Group" orientation="horizontal">
                <Radio value="option-1">Option 1</Radio>
                <Radio value="option-2">Option 2</Radio>
                <Radio value="option-3">Option 3</Radio>
              </RadioGroup>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Tag Variants</CardHeader>
          <CardBody>
            <Flex gap="3">
              <TagGroup>
                <Tag>Default</Tag>
                <Tag
                  style={{
                    backgroundColor: 'var(--bui-bg-danger)',
                    color: 'var(--bui-fg-danger)',
                    border: `1px solid var(--bui-border-danger)`,
                  }}
                >
                  Danger
                </Tag>
                <Tag
                  style={{
                    backgroundColor: 'var(--bui-bg-warning)',
                    color: 'var(--bui-fg-warning)',
                    border: `1px solid var(--bui-border-warning)`,
                  }}
                >
                  Warning
                </Tag>
                <Tag
                  style={{
                    backgroundColor: 'var(--bui-bg-success)',
                    color: 'var(--bui-fg-success)',
                    border: `1px solid var(--bui-border-success)`,
                  }}
                >
                  Success
                </Tag>
              </TagGroup>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Text Variants</CardHeader>
          <CardBody>
            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--bui-space-3)',
              }}
            >
              <Text variant="title-x-small">Title X Small</Text>
              <Text variant="body-x-small">Body X Small</Text>
              <Text variant="title-small">Title Small</Text>
              <Text variant="body-small">Body Small</Text>
              <Text variant="title-medium">Title Medium</Text>
              <Text variant="body-medium">Body Medium</Text>
              <Text variant="title-large">Title Large</Text>
              <Text variant="body-large">Body Large</Text>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </div>
  );
}
