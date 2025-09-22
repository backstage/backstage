import {
  classNamePropDefs,
  stylePropDefs,
  type PropDef,
} from '@/utils/propDefs';

export const cardPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardHeaderPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardBodyPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardFooterPropDefs: Record<string, PropDef> = {
  ...classNamePropDefs,
  ...stylePropDefs,
};

export const cardUsageSnippet = `import { card } from '@backstage/ui';

<Card>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>`;

export const cardDefaultSnippet = `<Card>
  <CardHeader>Header</CardHeader>
  <CardBody>Body</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>`;

export const cardLongBodySnippet = `<Card style={{ width: '300px', height: '200px' }}>
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

export const cardListRowSnippet = `<Card style={{ width: '300px', height: '200px' }}>
  <CardHeader>
    <Text>Header</Text>
  </CardHeader>
  <CardBody>
    <ListRow>Hello world</ListRow>
    <ListRow>Hello world</ListRow>
    <ListRow>Hello world</ListRow>
    <ListRow>Hello world</ListRow>
    ...
  </CardBody>
  <CardFooter>
    <Text>Footer</Text>
  </CardFooter>
</Card>`;
