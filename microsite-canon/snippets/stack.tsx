import { Stack } from '@backstage/canon';
import { DecorativeBox } from '../components/DecorativeBox';

export const StackPreview = () => {
  return (
    <div style={{ maxWidth: '320px', margin: '0 auto' }}>
      <Stack>
        <DecorativeBox />
        <DecorativeBox />
        <DecorativeBox />
      </Stack>
    </div>
  );
};
