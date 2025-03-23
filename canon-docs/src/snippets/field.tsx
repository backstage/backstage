'use client';

import { useEffect, useState } from 'react';
import { composeStories } from '@storybook/react';
import * as FieldStories from '../../../packages/canon/src/components/Field/Field.stories';

export const FieldSnippet = ({ story }: { story: string }) => {
  const stories = composeStories(FieldStories);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, [story]);

  if (!isReady) return null;

  if (story === 'Default') return <stories.Default />;
  if (story === 'WithLabelAndDescription')
    return <stories.WithLabelAndDescription />;
  return null;
};
