'use client';

import { ToggleButtonGroup } from '../../../../../packages/ui/src/components/ToggleButtonGroup/ToggleButtonGroup';
import { ToggleButton } from '../../../../../packages/ui/src/components/ToggleButton/ToggleButton';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';
import {
  RiCloudLine,
  RiStarFill,
  RiStarLine,
  RiArrowRightSLine,
} from '@remixicon/react';

export const ToggleButtonGroupSurfaces = () => (
  <Flex direction="column" gap="4">
    <Flex direction="column" gap="4">
      <Text>Default</Text>
      <Flex align="center" p="4" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          defaultSelectedKeys={['option1']}
        >
          <ToggleButton id="option1">Option 1</ToggleButton>
          <ToggleButton id="option2">Option 2</ToggleButton>
          <ToggleButton id="option3">Option 3</ToggleButton>
        </ToggleButtonGroup>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 0</Text>
      <Flex align="center" surface="0" p="4" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          defaultSelectedKeys={['option1']}
        >
          <ToggleButton id="option1">Option 1</ToggleButton>
          <ToggleButton id="option2">Option 2</ToggleButton>
          <ToggleButton id="option3">Option 3</ToggleButton>
        </ToggleButtonGroup>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 1</Text>
      <Flex align="center" surface="1" p="4" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          defaultSelectedKeys={['option1']}
        >
          <ToggleButton id="option1">Option 1</ToggleButton>
          <ToggleButton id="option2">Option 2</ToggleButton>
          <ToggleButton id="option3">Option 3</ToggleButton>
        </ToggleButtonGroup>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 2</Text>
      <Flex align="center" surface="2" p="4" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          defaultSelectedKeys={['option1']}
        >
          <ToggleButton id="option1">Option 1</ToggleButton>
          <ToggleButton id="option2">Option 2</ToggleButton>
          <ToggleButton id="option3">Option 3</ToggleButton>
        </ToggleButtonGroup>
      </Flex>
    </Flex>
    <Flex direction="column" gap="4">
      <Text>On Surface 3</Text>
      <Flex align="center" surface="3" p="4" gap="4">
        <ToggleButtonGroup
          selectionMode="single"
          defaultSelectedKeys={['option1']}
        >
          <ToggleButton id="option1">Option 1</ToggleButton>
          <ToggleButton id="option2">Option 2</ToggleButton>
          <ToggleButton id="option3">Option 3</ToggleButton>
        </ToggleButtonGroup>
      </Flex>
    </Flex>
  </Flex>
);

export const ToggleButtonGroupSingle = () => (
  <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['dogs']}>
    <ToggleButton id="dogs">Dogs</ToggleButton>
    <ToggleButton id="cat">Cats</ToggleButton>
    <ToggleButton id="bird">Birds</ToggleButton>
  </ToggleButtonGroup>
);

export const ToggleButtonGroupMultiple = () => (
  <ToggleButtonGroup
    selectionMode="multiple"
    defaultSelectedKeys={['frontend']}
  >
    <ToggleButton id="frontend">Frontend</ToggleButton>
    <ToggleButton id="backend">Backend</ToggleButton>
    <ToggleButton id="platform">Platform</ToggleButton>
  </ToggleButtonGroup>
);

export const ToggleButtonGroupVertical = () => (
  <ToggleButtonGroup selectionMode="single" orientation="vertical">
    <ToggleButton id="morning">Morning</ToggleButton>
    <ToggleButton id="afternoon">Afternoon</ToggleButton>
    <ToggleButton id="evening">Evening</ToggleButton>
  </ToggleButtonGroup>
);

export const ToggleButtonGroupDisabled = () => (
  <ToggleButtonGroup selectionMode="single" isDisabled>
    <ToggleButton id="cat">Cat</ToggleButton>
    <ToggleButton id="dog">Dog</ToggleButton>
    <ToggleButton id="bird">Bird</ToggleButton>
  </ToggleButtonGroup>
);

export const ToggleButtonGroupDisallowEmpty = () => (
  <ToggleButtonGroup
    selectionMode="single"
    disallowEmptySelection
    defaultSelectedKeys={['one']}
  >
    <ToggleButton id="one">One</ToggleButton>
    <ToggleButton id="two">Two</ToggleButton>
    <ToggleButton id="three">Three</ToggleButton>
  </ToggleButtonGroup>
);

export const ToggleButtonGroupIcons = () => (
  <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
    <ToggleButton id="cloud" aria-label="Cloud" iconStart={<RiCloudLine />} />
    <ToggleButton
      id="starred"
      aria-label="Starred"
      iconStart={<RiStarFill />}
    />
    <ToggleButton id="star" iconStart={<RiStarLine />}>
      Star
    </ToggleButton>
    <ToggleButton id="next" iconEnd={<RiArrowRightSLine />}>
      Next
    </ToggleButton>
  </ToggleButtonGroup>
);

export const ToggleButtonGroupIconsOnly = () => (
  <ToggleButtonGroup selectionMode="multiple" defaultSelectedKeys={['cloud']}>
    <ToggleButton id="cloud" aria-label="Cloud" iconStart={<RiCloudLine />} />
    <ToggleButton id="star" aria-label="Star" iconStart={<RiStarLine />} />
    <ToggleButton id="next" aria-label="Next" iconEnd={<RiArrowRightSLine />} />
  </ToggleButtonGroup>
);
