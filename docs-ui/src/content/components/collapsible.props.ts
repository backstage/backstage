import {
  classNamePropDefs,
  stylePropDefs,
  renderPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const collapsibleRootPropDefs: Record<string, PropDef> = {
  defaultOpen: {
    type: 'boolean',
    default: 'false',
  },
  open: {
    type: 'boolean',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(open) => void'],
  },
  ...renderPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const collapsibleTriggerPropDefs: Record<string, PropDef> = {
  ...renderPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const collapsiblePanelPropDefs: Record<string, PropDef> = {
  hiddenUntilFound: {
    type: 'boolean',
    default: 'false',
  },
  keepMounted: {
    type: 'boolean',
    default: 'false',
  },
  ...renderPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const collapsibleUsageSnippet = `import { Collapsible } from '@backstage/ui';

<Collapsible.Root>
    <Collapsible.Trigger render={(props, state) => (
      <Button {...props}>
        {state.open ? 'Close Panel' : 'Open Panel'}
      </Button>
    )} />
    <Collapsible.Panel>Your content</Collapsible.Panel>
</Collapsible.Root>`;

export const collapsibleDefaultSnippet = `<Collapsible.Root>
    <Collapsible.Trigger render={(props, state) => (
      <Button {...props}>
        {state.open ? 'Close Panel' : 'Open Panel'}
      </Button>
    )} />
    <Collapsible.Panel>
      <Box>
        <Text>It's the edge of the world and all of Western civilization</Text>
        <Text>The sun may rise in the East, at least it settled in a final location</Text>
        <Text>It's understood that Hollywood sells Californication</Text>
      </Box>
    </Collapsible.Panel>
</Collapsible.Root>`;

export const collapsibleTriggerSnippet = `<Collapsible.Trigger render={props => <Button {...props} />} />`;

export const collapsibleOpenSnippet = `<Collapsible.Root defaultOpen>
    <Collapsible.Trigger render={(props, state) => (
      <Button {...props}>
        {state.open ? 'Close Panel' : 'Open Panel'}
      </Button>
    )} />
    <Collapsible.Panel>
      <Box>
        <Text>It's the edge of the world and all of Western civilization</Text>
        <Text>The sun may rise in the East, at least it settled in a final location</Text>
        <Text>It's understood that Hollywood sells Californication</Text>
      </Box>
    </Collapsible.Panel>
</Collapsible.Root>`;
