'use client';

import { Badge } from '../../../../../packages/ui/src/components/Badge/Badge';
import { Flex } from '../../../../../packages/ui/src/components/Flex/Flex';
import { RiBugLine } from '@remixicon/react';

export const Default = () => <Badge>Banana</Badge>;

export const WithIcon = () => <Badge icon={<RiBugLine />}>Banana</Badge>;

export const Sizes = () => (
  <Flex direction="row" gap="2">
    <Badge size="small">Banana</Badge>
    <Badge size="medium">Banana</Badge>
  </Flex>
);

export const StatusVariants = () => (
  <Flex direction="row" gap="2">
    <Badge>Neutral</Badge>
    <Badge status="info">Info</Badge>
    <Badge status="success">Success</Badge>
    <Badge status="warning">Warning</Badge>
    <Badge status="danger">Danger</Badge>
  </Flex>
);

export const StatusVariantsWithoutIcon = () => (
  <Flex direction="row" gap="2">
    <Badge status="info" icon={false}>
      Info
    </Badge>
    <Badge status="success" icon={false}>
      Success
    </Badge>
    <Badge status="warning" icon={false}>
      Warning
    </Badge>
    <Badge status="danger" icon={false}>
      Danger
    </Badge>
  </Flex>
);

export const StatusVariantsWithCustomIcon = () => (
  <Flex direction="row" gap="2">
    <Badge status="info" icon={<RiBugLine />}>
      Info
    </Badge>
    <Badge status="success" icon={<RiBugLine />}>
      Success
    </Badge>
    <Badge status="warning" icon={<RiBugLine />}>
      Warning
    </Badge>
    <Badge status="danger" icon={<RiBugLine />}>
      Danger
    </Badge>
  </Flex>
);

export const Pending = () => (
  <Flex direction="row" gap="2">
    <Badge isPending>Pending</Badge>
    <Badge status="info" isPending>
      Deploying
    </Badge>
    <Badge status="warning" isPending>
      Waiting for approval
    </Badge>
  </Flex>
);
