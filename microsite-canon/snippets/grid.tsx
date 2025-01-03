import { Grid } from '@backstage/canon';
import { DecorativeBox } from '../components/DecorativeBox';

export const GridPreview = () => {
  return (
    <Grid>
      <DecorativeBox />
      <DecorativeBox />
      <DecorativeBox />
    </Grid>
  );
};
