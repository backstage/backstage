export const surfacesSnippet = `<Flex direction="column" gap="4">
  <Box bg="neutral-1">
    <Button variant="secondary">Hello World</Button>
  </Box>
  <Box bg="neutral-1">
    <Button variant="secondary">Hello World</Button>
  </Box>
</Flex>`;

export const adaptiveSnippet = `<Box bg="neutral-1">
  <Card> {/* automatically set background to neutral-2 */}
    <Button variant="secondary">Button with background set to neutral-3</Button>
  </Card>
</Box>`;

export const customCardSnippet = `<Box bg="autoIncrement">
  <Text>Hello World</Text>
</Box>`;

export const customTokensSnippet = `<div style={{ backgroundColor: 'var(--bui-bg-solid)' }}>
  <div style={{ color: 'var(--bui-fg-solid)' }}>Hello World</div>
</div>`;

export const colorPickerSnippet = `import { ColorPicker, ColorArea, ColorSlider, ColorField } from 'react-aria-components';

function MyColorPicker() {
  return (
    <ColorPicker defaultValue="#184">
      <ColorArea
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
        style={{ width: 192, height: 192, borderRadius: 'var(--bui-radius-md)' }}
      />
      <ColorSlider colorSpace="hsb" channel="hue" />
      <ColorField label="Hex" />
    </ColorPicker>
  );
}`;
