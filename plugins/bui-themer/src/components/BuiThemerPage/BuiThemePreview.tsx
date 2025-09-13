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
          <CardHeader>Theme Preview</CardHeader>
          <CardBody>
            <Text
              variant="body-small"
              style={{ color: 'var(--bui-fg-secondary)' }}
            >
              This preview shows how your theme will look with various Backstage
              UI components
            </Text>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Button Variants</CardHeader>
          <CardBody>
            <Flex gap="3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
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
              <Checkbox label="Checkbox Option" />
              <RadioGroup label="Radio Group" orientation="horizontal">
                <Radio value="option-1">Option 1</Radio>
                <Radio value="option-2">Option 2</Radio>
                <Radio value="option-3">Option 3</Radio>
              </RadioGroup>
            </Flex>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Surface Variations</CardHeader>
          <CardBody>
            <Flex gap="3">
              <Card
                style={{
                  backgroundColor: 'var(--bui-bg-surface-1)',
                  color: 'var(--bui-fg-primary)',
                  padding: '12px',
                  minWidth: '120px',
                }}
              >
                <Text variant="body-small">Surface 1</Text>
              </Card>
              <Card
                style={{
                  backgroundColor: 'var(--bui-bg-surface-2)',
                  color: 'var(--bui-fg-primary)',
                  padding: '12px',
                  minWidth: '120px',
                }}
              >
                <Text variant="body-small">Surface 2</Text>
              </Card>
              <Card
                style={{
                  backgroundColor: 'var(--bui-bg-solid)',
                  color: 'var(--bui-fg-solid)',
                  padding: '12px',
                  minWidth: '120px',
                }}
              >
                <Text variant="body-small">Solid</Text>
              </Card>
            </Flex>
          </CardBody>
        </Card>
      </Flex>
    </div>
  );
}
