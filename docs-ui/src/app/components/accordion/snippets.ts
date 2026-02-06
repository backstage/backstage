export const accordionUsageSnippet = `import { Accordion, AccordionTrigger, AccordionPanel } from '@backstage/ui';

<Accordion>
  <AccordionTrigger title="Toggle Panel" />
  <AccordionPanel>Your content</AccordionPanel>
</Accordion>`;

export const defaultSnippet = `<Accordion>
  <AccordionTrigger title="Toggle Panel" />
  <AccordionPanel>
    <Text>Your content here</Text>
  </AccordionPanel>
</Accordion>`;

export const withSubtitleSnippet = `<Accordion>
  <AccordionTrigger
    title="Advanced Settings"
    subtitle="Configure additional options"
  />
  <AccordionPanel>
    <Text>Your content here</Text>
  </AccordionPanel>
</Accordion>`;

export const withIconSnippet = `import { RiSettings4Line } from '@remixicon/react';

<Accordion>
  <AccordionTrigger
    title="System Settings"
    iconStart={<RiSettings4Line />}
  />
  <AccordionPanel>
    <Text>Your content here</Text>
  </AccordionPanel>
</Accordion>`;

export const customTriggerSnippet = `<Accordion>
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
    <Text>Your content here</Text>
  </AccordionPanel>
</Accordion>`;

export const defaultExpandedSnippet = `<Accordion defaultExpanded>
  <AccordionTrigger title="Toggle Panel" />
  <AccordionPanel>
    <Text>Your content here</Text>
  </AccordionPanel>
</Accordion>`;

export const groupSingleOpenSnippet = `<AccordionGroup>
  <Accordion>
    <AccordionTrigger title="First Panel" />
    <AccordionPanel>Content 1</AccordionPanel>
  </Accordion>
  <Accordion>
    <AccordionTrigger title="Second Panel" />
    <AccordionPanel>Content 2</AccordionPanel>
  </Accordion>
</AccordionGroup>`;

export const groupMultipleOpenSnippet = `<AccordionGroup allowsMultiple>
  <Accordion>
    <AccordionTrigger title="First Panel" />
    <AccordionPanel>Content 1</AccordionPanel>
  </Accordion>
  <Accordion>
    <AccordionTrigger title="Second Panel" />
    <AccordionPanel>Content 2</AccordionPanel>
  </Accordion>
</AccordionGroup>`;
