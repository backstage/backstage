export const avatarUsageSnippet = `import { Avatar } from '@backstage/ui';

<Avatar src="https://example.com/user.jpg" name="Jane Doe" />`;

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
    <Avatar size="x-small" src="..." name="Charles de Dreuille" />
    <Avatar size="small"   src="..." name="Charles de Dreuille" />
    <Avatar size="medium"  src="..." name="Charles de Dreuille" />
    <Avatar size="large"   src="..." name="Charles de Dreuille" />
    <Avatar size="x-large" src="..." name="Charles de Dreuille" />
  </Flex>
  <Flex>
    <Avatar size="x-small" src="" name="Charles de Dreuille" />
    <Avatar size="small"   src="" name="Charles de Dreuille" />
    <Avatar size="medium"  src="" name="Charles de Dreuille" />
    <Avatar size="large"   src="" name="Charles de Dreuille" />
    <Avatar size="x-large" src="" name="Charles de Dreuille" />
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
