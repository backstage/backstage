export const cardUsageSnippet = `import { Card, CardHeader, CardBody, CardFooter } from '@backstage/ui';

<Card>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>`;

export const defaultSnippet = `<Card style={{ width: '300px', height: '200px' }}>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>`;

export const headerAndBodySnippet = `<Card style={{ width: '300px', height: '200px' }}>
  <CardHeader>Header</CardHeader>
  <CardBody>Body content without a footer</CardBody>
</Card>`;

export const interactiveButtonSnippet = `<Card
  style={{ width: '300px' }}
  onPress={() => console.log('Card pressed')}
  label="View component details"
>
  <CardHeader>Interactive Card</CardHeader>
  <CardBody>Click anywhere on this card to trigger the press handler.</CardBody>
  <CardFooter>Click to interact</CardFooter>
</Card>`;

export const interactiveLinkSnippet = `<Card
  style={{ width: '300px' }}
  href="https://backstage.io"
  label="Open Backstage documentation"
>
  <CardHeader>Link Card</CardHeader>
  <CardBody>This card navigates to a URL when clicked.</CardBody>
  <CardFooter>Opens backstage.io</CardFooter>
</Card>`;

export const interactiveWithNestedButtonsSnippet = `import { Button, Flex } from '@backstage/ui';

<Card
  style={{ width: '300px' }}
  onPress={() => console.log('Card pressed')}
  label="View plugin details"
>
  <CardHeader>Card with Actions</CardHeader>
  <CardBody>
    Clicking the card background triggers the card press handler.
    The buttons below remain independently interactive.
  </CardBody>
  <CardFooter>
    <Flex gap="2">
      <Button size="small" variant="secondary" onPress={() => console.log('Primary')}>
        Primary
      </Button>
      <Button size="small" variant="tertiary" onPress={() => console.log('Secondary')}>
        Secondary
      </Button>
    </Flex>
  </CardFooter>
</Card>`;

export const withLongBodySnippet = `import { Text } from '@backstage/ui';

<Card style={{ width: '300px', height: '200px' }}>
  <CardHeader>
    <Text>Header</Text>
  </CardHeader>
  <CardBody>
    <Text>
      This is the first paragraph of a long body text that demonstrates how
      the Card component handles extensive content. The card should adjust
      accordingly to display all the text properly while maintaining its
      structure.
    </Text>
    <Text>
      Here's a second paragraph that adds more content to our card body.
      Having multiple paragraphs helps to visualize how spacing works within
      the card component.
    </Text>
    <Text>
      This third paragraph continues to add more text to ensure we have a
      proper demonstration of a card with significant content. This makes it
      easier to test scrolling behavior and overall layout when content
      exceeds the initial view.
    </Text>
  </CardBody>
  <CardFooter>
    <Text>Footer</Text>
  </CardFooter>
</Card>`;
