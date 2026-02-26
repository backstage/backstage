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
import { Popover } from './Popover';
import { Button } from '../Button/Button';
import { DialogTrigger } from '../Dialog/Dialog';
import { Text } from '../Text/Text';
import { Flex } from '../Flex/Flex';

const meta = preview.meta({
  title: 'Backstage UI/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
    },
    hideArrow: {
      control: { type: 'boolean' },
    },
    placement: {
      control: { type: 'select' },
      options: [
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
    },
    offset: {
      control: { type: 'number' },
    },
  },
  render: ({ children, isOpen, hideArrow, placement, offset }) => (
    <DialogTrigger>
      <Button>Open Popover</Button>
      <Popover
        isOpen={isOpen}
        hideArrow={hideArrow}
        placement={placement}
        offset={offset}
      >
        {children ?? <Text>This is a popover</Text>}
      </Popover>
    </DialogTrigger>
  ),
});

export const Default = meta.story({
  args: {
    children: <Text>This is a popover</Text>,
  },
});

export const IsOpen = Default.extend({
  args: {
    isOpen: true,
  },
});

export const HideArrow = Default.extend({
  args: {
    isOpen: true,
    hideArrow: true,
  },
});

export const TopPlacement = Default.extend({
  args: {
    isOpen: true,
    placement: 'top',
  },
});

export const RightPlacement = Default.extend({
  args: {
    isOpen: true,
    placement: 'right',
  },
});

export const BottomPlacement = Default.extend({
  args: {
    isOpen: true,
    placement: 'bottom',
  },
});

export const LeftPlacement = Default.extend({
  args: {
    isOpen: true,
    placement: 'left',
  },
});

export const AllPlacements = Default.extend({
  parameters: {
    controls: {
      exclude: ['placement'],
    },
  },
  args: {
    isOpen: true,
  },
  render: ({ isOpen, hideArrow }) => {
    return (
      <DialogTrigger>
        <Button>Open Popovers</Button>
        <Popover isOpen={isOpen} placement="top" hideArrow={hideArrow}>
          <Text>Top placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="right" hideArrow={hideArrow}>
          <Text>Right placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="bottom" hideArrow={hideArrow}>
          <Text>Bottom placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="left" hideArrow={hideArrow}>
          <Text>Left placement</Text>
        </Popover>
      </DialogTrigger>
    );
  },
});

export const AllPlacementsNoArrow = Default.extend({
  parameters: {
    controls: {
      exclude: ['placement', 'hideArrow'],
    },
  },
  args: {
    isOpen: true,
    hideArrow: true,
  },
  render: ({ isOpen }) => {
    return (
      <DialogTrigger>
        <Button>Open Popovers</Button>
        <Popover isOpen={isOpen} placement="top" hideArrow>
          <Text>Top placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="right" hideArrow>
          <Text>Right placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="bottom" hideArrow>
          <Text>Bottom placement</Text>
        </Popover>
        <Popover isOpen={isOpen} placement="left" hideArrow>
          <Text>Left placement</Text>
        </Popover>
      </DialogTrigger>
    );
  },
});

export const WithRichContent = Default.extend({
  args: {
    isOpen: true,
  },
  render: ({ isOpen, hideArrow, placement }) => (
    <DialogTrigger>
      <Button>Open Popover</Button>
      <Popover isOpen={isOpen} hideArrow={hideArrow} placement={placement}>
        <Flex direction="column" gap="3" style={{ width: '280px' }}>
          <Text style={{ fontWeight: 'bold' }}>Popover Title</Text>
          <Text>
            This is a popover with rich content. It can contain multiple
            elements and formatted text.
          </Text>
          <Flex gap="2" justify="end">
            <Button variant="tertiary" size="small">
              Cancel
            </Button>
            <Button variant="primary" size="small">
              Confirm
            </Button>
          </Flex>
        </Flex>
      </Popover>
    </DialogTrigger>
  ),
});

export const CustomOffset = Default.extend({
  args: {
    isOpen: true,
    offset: 20,
    placement: 'bottom',
  },
});

export const NonModal = Default.extend({
  args: {
    isOpen: true,
  },
  render: ({ isOpen, hideArrow, placement }) => (
    <DialogTrigger>
      <Button>Open Non-Modal Popover</Button>
      <Popover
        isOpen={isOpen}
        hideArrow={hideArrow}
        placement={placement}
        isNonModal
      >
        <Text>
          This is a non-modal popover. You can interact with other elements on
          the page while it's open.
        </Text>
      </Popover>
    </DialogTrigger>
  ),
});

export const WithLongContent = Default.extend({
  args: {
    isOpen: true,
  },
  render: ({ isOpen, hideArrow, placement }) => (
    <DialogTrigger>
      <Button>Open Popover</Button>
      <Popover isOpen={isOpen} hideArrow={hideArrow} placement={placement}>
        <Flex direction="column" gap="3" style={{ width: '320px' }}>
          <Text style={{ fontWeight: 'bold' }}>Long Content Example</Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Text>
          <Text>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
          <Text>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </Text>
          <Text>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
            fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt.
          </Text>
          <Text>
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
            consectetur, adipisci velit, sed quia non numquam eius modi tempora
            incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
          </Text>
        </Flex>
      </Popover>
    </DialogTrigger>
  ),
});
