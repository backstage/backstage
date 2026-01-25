export const avatarUsageSnippet = `import { Avatar } from '@backstage/ui';

<Avatar />`;

export const defaultSnippet = `<Avatar
  src="https://avatars.githubusercontent.com/u/1540635?v=4"
  name="Charles de Dreuille"
/>`;

export const fallbackSnippet = `<Avatar
  src="https://avatars.githubusercontent.com/u/15406AAAAAAAAA"
  name="Charles de Dreuille"
/>`;

export const sizesSnippet = `<Flex direction="column" gap="6">
  <Flex>
    <Avatar src="..." name="Charles de Dreuille" size="x-small" />
    <Avatar src="..." name="Charles de Dreuille" size="small" />
    <Avatar src="..." name="Charles de Dreuille" size="medium" />
    <Avatar src="..." name="Charles de Dreuille" size="large" />
    <Avatar src="..." name="Charles de Dreuille" size="x-large" />
  </Flex>
  <Flex>
    <Avatar name="Charles de Dreuille" size="x-small" src="" />
    <Avatar name="Charles de Dreuille" size="small" src="" />
    <Avatar name="Charles de Dreuille" size="medium" src="" />
    <Avatar name="Charles de Dreuille" size="large" src="" />
    <Avatar name="Charles de Dreuille" size="x-large" src="" />
  </Flex>
</Flex>`;

export const purposeSnippet = `<Flex direction="column" gap="4">
  <Flex direction="column" gap="1">
    <Text variant="title-x-small">Informative (default)</Text>
    <Text variant="body-medium">
      Use when avatar appears alone. Announced as "Charles de Dreuille" to screen readers:
    </Text>
    <Flex gap="2" align="center">
      <Avatar src="..." name="Charles de Dreuille" purpose="informative" />
    </Flex>
  </Flex>
  <Flex direction="column" gap="1">
    <Text variant="title-x-small">Decoration</Text>
    <Text variant="body-medium">
      Use when avatar appears with adjacent text. Hidden from screen readers:
    </Text>
    <Flex gap="2" align="center">
      <Avatar src="..." name="Charles de Dreuille" purpose="decoration" />
      <Text>Charles de Dreuille</Text>
    </Flex>
  </Flex>
</Flex>`;
