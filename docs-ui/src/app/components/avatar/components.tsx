'use client';

import { Avatar } from '../../../../../packages/ui/src/components/Avatar/Avatar';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { Text } from '../../../../../packages/ui/src/components/Text/Text';

export const Default = () => {
  return (
    <Avatar
      src="https://avatars.githubusercontent.com/u/1540635?v=4"
      name="Charles de Dreuille"
    />
  );
};

export const Fallback = () => {
  return (
    <Avatar
      src="https://avatars.githubusercontent.com/u/15406AAAAAAAAA"
      name="Charles de Dreuille"
    />
  );
};

export const Sizes = () => {
  return (
    <Flex direction="column" gap="6">
      <Flex>
        <Avatar
          src="https://avatars.githubusercontent.com/u/1540635?v=4"
          name="Charles de Dreuille"
          size="x-small"
        />
        <Avatar
          src="https://avatars.githubusercontent.com/u/1540635?v=4"
          name="Charles de Dreuille"
          size="small"
        />
        <Avatar
          src="https://avatars.githubusercontent.com/u/1540635?v=4"
          name="Charles de Dreuille"
          size="medium"
        />
        <Avatar
          src="https://avatars.githubusercontent.com/u/1540635?v=4"
          name="Charles de Dreuille"
          size="large"
        />
        <Avatar
          src="https://avatars.githubusercontent.com/u/1540635?v=4"
          name="Charles de Dreuille"
          size="x-large"
        />
      </Flex>
      <Flex>
        <Avatar name="Charles de Dreuille" size="x-small" src="" />
        <Avatar name="Charles de Dreuille" size="small" src="" />
        <Avatar name="Charles de Dreuille" size="medium" src="" />
        <Avatar name="Charles de Dreuille" size="large" src="" />
        <Avatar name="Charles de Dreuille" size="x-large" src="" />
      </Flex>
    </Flex>
  );
};

export const Purpose = () => {
  return (
    <Flex direction="column" gap="4">
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Informative (default)</Text>
        <Text variant="body-medium">
          Use when avatar appears alone. Announced as &quot;Charles de
          Dreuille&quot; to screen readers:
        </Text>
        <Flex gap="2" align="center">
          <Avatar
            src="https://avatars.githubusercontent.com/u/1540635?v=4"
            name="Charles de Dreuille"
            purpose="informative"
          />
        </Flex>
      </Flex>
      <Flex direction="column" gap="1">
        <Text variant="title-x-small">Decoration</Text>
        <Text variant="body-medium">
          Use when avatar appears with adjacent text. Hidden from screen
          readers:
        </Text>
        <Flex gap="2" align="center">
          <Avatar
            src="https://avatars.githubusercontent.com/u/1540635?v=4"
            name="Charles de Dreuille"
            purpose="decoration"
          />
          <Text>Charles de Dreuille</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
