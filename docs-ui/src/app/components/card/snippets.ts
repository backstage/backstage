export const cardUsageSnippet = `import { Card, CardHeader, CardBody, CardFooter } from '@backstage/ui';

<Card>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>`;

export const defaultSnippet = `<Card>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>`;

export const customSizeSnippet = `<Card style={{ width: '300px', height: '200px' }}>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>`;

export const withLongBodySnippet = `<Card style={{ width: '300px', height: '200px' }}>
  <CardHeader>
    <Text>Header</Text>
  </CardHeader>
  <CardBody>
    <Text>
      This is the first paragraph of a long body text that demonstrates how
      the Card component handles extensive content.
    </Text>
    <Text>
      Here's a second paragraph that adds more content to our card body.
    </Text>
    <Text>
      This third paragraph continues to add more text to ensure we have a
      proper demonstration of a card with significant content.
    </Text>
  </CardBody>
  <CardFooter>
    <Text>Footer</Text>
  </CardFooter>
</Card>`;
