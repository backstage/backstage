import {
  childrenPropDefs,
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const popoverPropDefs: Record<string, PropDef> = {
  hideArrow: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether to hide the arrow pointing to the trigger element. Arrow is also automatically hidden for MenuTrigger and SubmenuTrigger contexts.',
  },
  placement: {
    type: 'enum',
    values: [
      'top',
      'top start',
      'top end',
      'bottom',
      'bottom start',
      'bottom end',
      'left',
      'left start',
      'left end',
      'right',
      'right start',
      'right end',
    ],
    default: 'bottom',
    description: 'The placement of the popover relative to the trigger.',
  },
  containerPadding: {
    type: 'number',
    default: '12',
    description:
      'The padding between the popover and the edge of the viewport.',
  },
  offset: {
    type: 'number',
    default: '0',
    description: 'The offset from the trigger element.',
  },
  crossOffset: {
    type: 'number',
    default: '0',
    description: 'The cross-axis offset from the trigger element.',
  },
  shouldFlip: {
    type: 'boolean',
    default: 'true',
    description:
      'Whether the popover should flip to the opposite side when there is not enough space.',
  },
  isOpen: {
    type: 'boolean',
    description: 'Whether the popover is open (controlled).',
  },
  defaultOpen: {
    type: 'boolean',
    description: 'Whether the popover is open by default (uncontrolled).',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(isOpen: boolean) => void'],
    description:
      "Handler that is called when the popover's open state changes.",
  },
  isNonModal: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether the popover is non-modal. Non-modal popovers do not block interaction with the rest of the page.',
  },
  isKeyboardDismissDisabled: {
    type: 'boolean',
    default: 'false',
    description:
      'Whether pressing the escape key to close the popover should be disabled.',
  },
  shouldCloseOnBlur: {
    type: 'boolean',
    default: 'true',
    description:
      'Whether to close the popover when the user interacts outside it.',
  },
  triggerRef: {
    type: 'enum',
    values: ['RefObject<Element | null>'],
    description: 'A ref for the trigger element.',
  },
  ...childrenPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const popoverUsageSnippet = `import { Popover, DialogTrigger, Button } from '@backstage/ui';

<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover>
    <Text>This is a popover</Text>
  </Popover>
</DialogTrigger>`;

export const popoverDefaultSnippet = `<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover>
    <Text>This is a popover</Text>
  </Popover>
</DialogTrigger>`;

export const popoverPlacementsSnippet = `<DialogTrigger>
  <Button>Top</Button>
  <Popover placement="top">
    <Text>Top placement</Text>
  </Popover>
</DialogTrigger>

<DialogTrigger>
  <Button>Right</Button>
  <Popover placement="right">
    <Text>Right placement</Text>
  </Popover>
</DialogTrigger>

<DialogTrigger>
  <Button>Bottom</Button>
  <Popover placement="bottom">
    <Text>Bottom placement</Text>
  </Popover>
</DialogTrigger>

<DialogTrigger>
  <Button>Left</Button>
  <Popover placement="left">
    <Text>Left placement</Text>
  </Popover>
</DialogTrigger>`;

export const popoverNoArrowSnippet = `<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover hideArrow>
    <Text>Popover without arrow</Text>
  </Popover>
</DialogTrigger>`;

export const popoverRichContentSnippet = `<DialogTrigger>
  <Button>Open Popover</Button>
  <Popover>
    <Flex direction="column" gap="3">
      <Text style={{ fontWeight: 'bold' }}>Popover Title</Text>
      <Text>
        This is a popover with rich content. It can contain multiple
        elements and formatted text.
      </Text>
      <Flex gap="2" justify="end">
        <Button variant="tertiary" size="small">Cancel</Button>
        <Button variant="primary" size="small">Confirm</Button>
      </Flex>
    </Flex>
  </Popover>
</DialogTrigger>`;

export const popoverNonModalSnippet = `<DialogTrigger>
  <Button>Open Non-Modal Popover</Button>
  <Popover isNonModal>
    <Text>
      This is a non-modal popover. You can interact with other 
      elements on the page while it's open.
    </Text>
  </Popover>
</DialogTrigger>`;
