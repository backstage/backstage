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

export const statusVariantsWithoutIcon = `<Flex direction="row" gap="2">
  <Badge status="info" icon={false}>Info</Badge>
  <Badge status="success" icon={false}>Success</Badge>
  <Badge status="warning" icon={false}>Warning</Badge>
  <Badge status="danger" icon={false}>Danger</Badge>
</Flex>`;

export const statusVariantsWithCustomIcon = `<Flex direction="row" gap="2">
  <Badge status="info" icon={<RiBugLine />}>Info</Badge>
  <Badge status="success" icon={<RiBugLine />}>Success</Badge>
  <Badge status="warning" icon={<RiBugLine />}>Warning</Badge>
  <Badge status="danger" icon={<RiBugLine />}>Danger</Badge>
</Flex>`;

export const pending = `<Flex direction="row" gap="2">
  <Badge isPending>Pending</Badge>
  <Badge status="info" isPending>Deploying</Badge>
  <Badge status="warning" isPending>Waiting for approval</Badge>
</Flex>`;
