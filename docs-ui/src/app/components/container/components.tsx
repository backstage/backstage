'use client';

import { Container } from '../../../../../packages/ui/src/components/Container/Container';
import { DecorativeBox } from '@/components/DecorativeBox';

export const Default = () => {
  return (
    <Container>
      <DecorativeBox>Page content goes here</DecorativeBox>
    </Container>
  );
};

export const ResponsiveSpacing = () => {
  return (
    <Container py={{ initial: '4', md: '8' }}>
      <DecorativeBox>Content with vertical spacing</DecorativeBox>
    </Container>
  );
};
