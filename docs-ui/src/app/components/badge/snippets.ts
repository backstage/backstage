export const usage = `import { Badge } from '@backstage/ui';

<Badge>Badge</Badge>`;

export const preview = `<Badge>Banana</Badge>`;

export const withIcons = `<Badge icon={<RiBugLine />}>Banana</Badge>`;

export const sizes = `<Flex direction="row" gap="2">
  <Badge size="small">Banana</Badge>
  <Badge size="medium">Banana</Badge>
</Flex>`;

export const statusVariants = `<Flex direction="row" gap="2">
  <Badge>Neutral</Badge>
  <Badge status="info">Info</Badge>
  <Badge status="success">Success</Badge>
  <Badge status="warning">Warning</Badge>
  <Badge status="danger">Danger</Badge>
</Flex>`;

export const pending = `<Flex direction="row" gap="2">
  <Badge isPending>Pending</Badge>
  <Badge status="info" isPending>Deploying</Badge>
  <Badge status="warning" isPending>Waiting for approval</Badge>
</Flex>`;
