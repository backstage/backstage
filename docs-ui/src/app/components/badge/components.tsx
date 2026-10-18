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
