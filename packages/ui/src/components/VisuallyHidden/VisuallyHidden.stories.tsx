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
import preview from '../../../../../.storybook/preview';
import { VisuallyHidden } from './VisuallyHidden';
import { Text } from '../Text';
import { Flex } from '../Flex';

const meta = preview.meta({
  title: 'Backstage UI/VisuallyHidden',
  component: VisuallyHidden,
  parameters: {
    docs: {
      description: {
        component:
          'Visually hides content while keeping it accessible to screen readers. Commonly used for descriptive labels, and other screen-reader-only content.',
      },
    },
  },
});

export const Default = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <Text as="p">
        This text is followed by a paragraph that is visually hidden but
        accessible to screen readers. Try using a screen reader to hear it, or
        inspect the DOM to see it's there.
      </Text>
      <VisuallyHidden>
        This content is visually hidden but accessible to screen readers
      </VisuallyHidden>
    </Flex>
  ),
});

export const ExampleUsage = meta.story({
  render: () => (
    <Flex direction="column" gap="4">
      <VisuallyHidden>
        <Text as="h2">Footer links</Text>
      </VisuallyHidden>
      <Text as="p">
        <a href="#">About us</a>
      </Text>
      <Text as="p">
        <a href="#">Jobs</a>
      </Text>
      <Text as="p">
        <a href="#">Terms and Conditions</a>
      </Text>
      <Text as="p" variant="body-small" color="secondary">
        (Screen readers hear: "Footer links" followed by the list of links)
      </Text>
    </Flex>
  ),
});
