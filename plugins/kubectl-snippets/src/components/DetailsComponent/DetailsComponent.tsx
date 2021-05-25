/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { Card, CardActions, CardMedia, CardContent } from '@material-ui/core';
import { Content, ContentHeader } from '@backstage/core';
// import { ItemCardGrid } from '../../../../../packages/core/src/layout/ItemCard';
// import { ItemCardHeader } from '../../../../../packages/core/src/layout/ItemCard';
// import { Button } from '../../../../../packages/core/src/components';
import { ItemCardGrid } from './ItemCardGrid';
import { ItemCardHeader } from './ItemCardHeader';
import { Button } from '../../components';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  metaCard: {
    width: 500,
  },
  codeCard: {
    width: 740,
  },
  outputCard: {
    width: 740,
  },
  grid: {
    gridTemplateColumns: 'repeat(auto-fill, 53em)',
  },
}));

export const DetailsComponent = () => {
  const styles = useStyles();
  return (
    <Content>
      <ContentHeader title="Snippet details" />
      <ItemCardGrid classes={{ root: styles.grid }}>
        <Card className={styles.metaCard}>
          <CardMedia>
            <ItemCardHeader subtitle="Meta" />
          </CardMedia>
          <CardContent />
          <CardActions />
        </Card>
        <Card className={styles.codeCard}>
          <CardMedia>
            <ItemCardHeader subtitle="Code" />
          </CardMedia>
          <CardContent />
          <CardActions>
            <Button color="primary" to="/kubectl-snippets">
              Run
            </Button>
          </CardActions>
        </Card>
        <Card className={styles.outputCard}>
          <CardMedia>
            <ItemCardHeader subtitle="Output" />
          </CardMedia>
          <CardContent />
        </Card>
      </ItemCardGrid>
    </Content>
  );
};
