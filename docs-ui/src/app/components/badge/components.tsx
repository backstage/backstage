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
