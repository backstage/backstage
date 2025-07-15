import {
  classNamePropDefs,
  stylePropDefs,
  renderPropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const menuRootPropDefs: Record<string, PropDef> = {
  defaultOpen: {
    type: 'boolean',
    default: 'false',
  },
  open: {
    type: 'boolean',
  },
  onOpenChange: {
    type: 'enum',
    values: ['(open, event) => void'],
  },
  closeParentOnEsc: {
    type: 'boolean',
    default: 'true',
  },
  modal: {
    type: 'boolean',
    default: 'true',
  },
  onOpenChangeComplete: {
    type: 'enum',
    values: ['(open) => void'],
  },
  disabled: {
    type: 'boolean',
    default: 'false',
  },
  openOnHover: {
    type: 'boolean',
  },
  delay: {
    type: 'number',
    default: '100',
  },
  loop: {
    type: 'boolean',
    default: 'true',
  },
  orientation: {
    type: 'enum',
    values: ['horizontal', 'vertical'],
    default: 'vertical',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuTriggerPropDefs: Record<string, PropDef> = {
  ...renderPropDefs,
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuPositionerPropDefs: Record<string, PropDef> = {
  align: {
    type: 'enum',
    values: ['start', 'center', 'end'],
    default: 'center',
  },
  alignOffset: {
    type: 'enum',
    values: ['number', '(data) => number'],
    default: '0',
  },
  side: {
    type: 'enum',
    values: ['bottom', 'inline-end', 'inline-start', 'left', 'right', 'top'],
    default: 'bottom',
  },
  sideOffset: {
    type: 'enum',
    values: ['number', '(data) => number'],
    default: '0',
  },
  arrowPadding: {
    type: 'number',
    default: '5',
  },
  anchor: {
    type: 'enum',
    values: [
      'React.Ref',
      'Element',
      'VirtualElement',
      '(() => Element | VirtualElement | null)',
      'null',
    ],
  },
  collisionBoundary: {
    type: 'enum',
    values: ['clipping-ancestors', 'Element', 'Element[]', 'Rect'],
    default: 'clipping-ancestors',
  },
  collisionPadding: {
    type: 'enum',
    values: ['number', 'Rect'],
    default: '5',
  },
  sticky: {
    type: 'boolean',
    default: 'false',
  },
  positionMethod: {
    type: 'enum',
    values: ['absolute', 'fixed'],
    default: 'absolute',
  },
  trackAnchor: {
    type: 'boolean',
    default: 'true',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuItemPropDefs: Record<string, PropDef> = {
  label: {
    type: 'string',
  },
  onClick: {
    type: 'enum',
    values: ['(event) => void'],
  },
  closeOnClick: {
    type: 'boolean',
    default: 'true',
  },
  disabled: {
    type: 'boolean',
    default: 'false',
  },
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const menuUsageSnippet = `import { Menu } from '@backstage/ui';

<Menu.Root>
  <Menu.Trigger />
  <Menu.Portal>
    <Menu.Positioner>
      <Menu.Popup>
        <Menu.Item />
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>`;

export const menuDefaultSnippet = `<Menu.Root>
  <Menu.Trigger
    render={props => (
      <Button
        {...props}
        size="medium"
        variant="secondary"
        iconEnd="chevron-down"
      >
        Menu
      </Button>
    )}
  />
  <Menu.Portal>
    <Menu.Positioner sideOffset={8} align="start">
      <Menu.Popup>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item>Invite new members</Menu.Item>
        <Menu.Item>Download app</Menu.Item>
        <Menu.Item>Log out</Menu.Item>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>`;

export const menuTriggerSnippet = `<Menu.Trigger render={props => <Button {...props} />} />`;

export const menuHoverSnippet = `<Menu.Root openOnHover delay={100}>
  <Menu.Trigger
    render={props => (
      <Button
        {...props}
        size="medium"
        variant="secondary"
        iconEnd="chevron-down"
      >
        Menu
      </Button>
    )}
  />
  <Menu.Portal>
    <Menu.Positioner sideOffset={8} align="start">
      <Menu.Popup>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item>Invite new members</Menu.Item>
        <Menu.Item>Download app</Menu.Item>
        <Menu.Item>Log out</Menu.Item>
      </Menu.Popup>
    </Menu.Positioner>
  </Menu.Portal>
</Menu.Root>`;

export const menuSubmenuSnippet = `<Menu.Trigger
  render={props => (
    <Button
      {...props}
      size="small"
      variant="secondary"
      iconEnd={<Icon name="chevron-down" />}
    >
      Menu
    </Button>
  )}
/>
<Menu.Portal>
  <Menu.Positioner sideOffset={8} align="start">
    <Menu.Popup>
      <Menu.Item>Settings</Menu.Item>
      <Menu.Item>Invite new members</Menu.Item>
      <Menu.Item>Download app</Menu.Item>
      <Menu.Item>Log out</Menu.Item>
      <Menu.Root>
        <Menu.SubmenuTrigger>Submenu</Menu.SubmenuTrigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              <Menu.Item>Submenu Item 1</Menu.Item>
              <Menu.Item>Submenu Item 2</Menu.Item>
              <Menu.Item>Submenu Item 3</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </Menu.Popup>
  </Menu.Positioner>
</Menu.Portal>`;
