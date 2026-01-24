'use client';

import {
  Accordion,
  AccordionTrigger,
  AccordionPanel,
  AccordionGroup,
} from '../../../../../packages/ui/src/components/Accordion/Accordion';
import { Box } from '../../../../../packages/ui/src/components/Box/Box';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';

const Content = () => (
  <Box>
    <Text as="p">
      It&apos;s the edge of the world and all of Western civilization
    </Text>
    <Text as="p">
      The sun may rise in the East, at least it settled in a final location
    </Text>
    <Text as="p">
      It&apos;s understood that Hollywood sells Californication
    </Text>
  </Box>
);

export const Default = () => {
  return (
    <Accordion>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  );
};

export const WithSubtitle = () => {
  return (
    <Accordion>
      <AccordionTrigger
        title="Advanced Settings"
        subtitle="Configure additional options"
      />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  );
};

export const CustomTrigger = () => {
  return (
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
  );
};

export const DefaultExpanded = () => {
  return (
    <Accordion defaultExpanded>
      <AccordionTrigger title="Toggle Panel" />
      <AccordionPanel>
        <Content />
      </AccordionPanel>
    </Accordion>
  );
};

export const GroupSingleOpen = () => {
  return (
    <AccordionGroup>
      <Accordion>
        <AccordionTrigger title="First Panel" />
        <AccordionPanel>
          <Content />
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Second Panel" />
        <AccordionPanel>
          <Content />
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Third Panel" />
        <AccordionPanel>
          <Content />
        </AccordionPanel>
      </Accordion>
    </AccordionGroup>
  );
};

export const GroupMultipleOpen = () => {
  return (
    <AccordionGroup allowsMultiple>
      <Accordion>
        <AccordionTrigger title="First Panel" />
        <AccordionPanel>
          <Content />
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Second Panel" />
        <AccordionPanel>
          <Content />
        </AccordionPanel>
      </Accordion>
      <Accordion>
        <AccordionTrigger title="Third Panel" />
        <AccordionPanel>
          <Content />
        </AccordionPanel>
      </Accordion>
    </AccordionGroup>
  );
};
