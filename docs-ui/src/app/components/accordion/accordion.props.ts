import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const accordionPropDefs: Record<string, PropDef> = {
  children: {
    type: 'enum',
    values: ['ReactNode', '(state: { isExpanded: boolean }) => ReactNode'],
  },
  defaultExpanded: {
    type: 'boolean',
    default: 'false',
  },
  isExpanded: {
    type: 'boolean',
  },
  onExpandedChange: {
    type: 'enum',
    values: ['(isExpanded: boolean) => void'],
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionTriggerPropDefs: Record<string, PropDef> = {
  level: {
    type: 'enum',
    values: ['1', '2', '3', '4', '5', '6'],
    default: '3',
  },
  title: {
    type: 'string',
  },
  subtitle: {
    type: 'string',
  },
  children: {
    type: 'enum',
    values: ['ReactNode'],
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionPanelPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionGroupPropDefs: Record<string, PropDef> = {
  allowsMultiple: {
    type: 'boolean',
    default: 'false',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const accordionUsageSnippet = `import { Accordion, AccordionTrigger, AccordionPanel } from '@backstage/ui';

<Accordion>
  <AccordionTrigger title="Toggle Panel" />
  <AccordionPanel>Your content</AccordionPanel>
</Accordion>`;

export const accordionWithSubtitleSnippet = `<Accordion>
  <AccordionTrigger
    title="Advanced Settings"
    subtitle="Configure additional options"
  />
  <AccordionPanel>
    <Text>Your content here</Text>
  </AccordionPanel>
</Accordion>`;

export const accordionCustomTriggerSnippet = `<Accordion>
  <AccordionTrigger>
    <Box>
      <Text as="div" weight="bold">Custom Multi-line Trigger</Text>
      <Text as="div" size="small" color="secondary">
        Click to expand additional details
      </Text>
    </Box>
  </AccordionTrigger>
  <AccordionPanel>
    <Text>Your content here</Text>
  </AccordionPanel>
</Accordion>`;

export const accordionDefaultExpandedSnippet = `<Accordion defaultExpanded>
  <AccordionTrigger title="Toggle Panel" />
  <AccordionPanel>
    <Text>Your content here</Text>
  </AccordionPanel>
</Accordion>`;

export const accordionGroupSingleOpenSnippet = `<AccordionGroup>
  <Accordion>
    <AccordionTrigger title="First Panel" />
    <AccordionPanel>Content 1</AccordionPanel>
  </Accordion>
  <Accordion>
    <AccordionTrigger title="Second Panel" />
    <AccordionPanel>Content 2</AccordionPanel>
  </Accordion>
</AccordionGroup>`;

export const accordionGroupMultipleOpenSnippet = `<AccordionGroup allowsMultiple>
  <Accordion>
    <AccordionTrigger title="First Panel" />
    <AccordionPanel>Content 1</AccordionPanel>
  </Accordion>
  <Accordion>
    <AccordionTrigger title="Second Panel" />
    <AccordionPanel>Content 2</AccordionPanel>
  </Accordion>
</AccordionGroup>`;
