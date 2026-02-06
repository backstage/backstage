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
import {
  Accordion,
  AccordionTrigger,
  AccordionPanel,
  AccordionGroup,
} from './Accordion';
import { Box } from '../Box';
import { Text } from '../Text';
import {
  RiSettings4Line,
  RiBarChartBoxLine,
  RiShieldCheckLine,
  RiBellLine,
  RiPaletteLine,
} from '@remixicon/react';

const Content = () => (
  <Box>
    <Text as="p">
      It's the edge of the world and all of Western civilization
    </Text>
    <Text as="p">
      The sun may rise in the East, at least it settled in a final location
    </Text>
    <Text as="p">It's understood that Hollywood sells Californication</Text>
  </Box>
);

const meta = preview.meta({
  title: 'Backstage UI/Accordion',
  component: Accordion,
});

export const Default = meta.story({
  render: () => (
    <Accordion>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  ),
});

export const WithSubtitle = meta.story({
  render: () => (
    <Accordion>
      <AccordionTrigger
        title="Advanced Settings"
        subtitle="Configure additional options"
      />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  ),
});

export const CustomTrigger = meta.story({
  render: () => (
    <Accordion>
      <AccordionTrigger>
        <Box>
          <Text as="div" variant="body-large" weight="bold">
            Custom Multi-line Trigger
          </Text>
          <Text as="div" variant="body-medium" color="secondary">
            Click to expand additional details and configuration options
          </Text>
        </Box>
      </AccordionTrigger>
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  ),
});

export const DefaultExpanded = meta.story({
  render: () => (
    <Accordion defaultExpanded>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  ),
});

export const GroupSingleOpen = meta.story({
  render: () => (
    <AccordionGroup>
      <Accordion>
        <AccordionTrigger title="First Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              It's the edge of the world and all of Western civilization
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Second Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              The sun may rise in the East, at least it settled in a final
              location
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Third Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              It's understood that Hollywood sells Californication
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
    </AccordionGroup>
  ),
});

export const GroupMultipleOpen = meta.story({
  render: () => (
    <AccordionGroup allowsMultiple>
      <Accordion>
        <AccordionTrigger title="First Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              It's the edge of the world and all of Western civilization
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Second Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              The sun may rise in the East, at least it settled in a final
              location
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Third Panel" />
        <AccordionPanel>
          <Box>
            <Text as="p">
              It's understood that Hollywood sells Californication
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
    </AccordionGroup>
  ),
});

export const WithIcon = meta.story({
  render: () => (
    <Accordion>
      <AccordionTrigger
        title="System Settings"
        iconStart={<RiSettings4Line />}
      />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  ),
});

export const WithIconEnd = meta.story({
  render: () => (
    <Accordion>
      <AccordionTrigger
        title="Analytics Dashboard"
        iconEnd={<RiBarChartBoxLine />}
      />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  ),
});

export const MultipleWithIcons = meta.story({
  render: () => (
    <AccordionGroup>
      <Accordion>
        <AccordionTrigger
          title="Security Settings"
          iconStart={<RiShieldCheckLine />}
        />
        <AccordionPanel>
          <Box>
            <Text as="p">
              Configure authentication, authorization, and security policies
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Notifications" iconStart={<RiBellLine />} />
        <AccordionPanel>
          <Box>
            <Text as="p">
              Manage email, push, and in-app notification preferences
            </Text>
          </Box>
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Appearance" iconStart={<RiPaletteLine />} />
        <AccordionPanel>
          <Box>
            <Text as="p">Customize theme, colors, and display preferences</Text>
          </Box>
        </AccordionPanel>
      </Accordion>
    </AccordionGroup>
  ),
});
