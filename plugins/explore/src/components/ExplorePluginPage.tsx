/*
 * Copyright 2020 Spotify AB
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

/*
 * Copyright 2020 Spotify AB
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

import React, { FC } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  Header,
  Page,
  pageTheme,
  SupportButton,
} from '@backstage/core';
import ExploreCard, { CardData } from './ExploreCard';
import { BackstageTheme } from '@backstage/theme';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, 296px)',
    gridGap: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
}));

const toolsCards = [
  {
    title: 'Tech Radar',
    description: 'Something something',
    url: 'http://spotify.com/',
    image:
      'https://storage.googleapis.com/wf-blogs-engineering-media/2018/09/fe13bb32-wf-tech-radar-hero-1024x597.png',
    tags: ['tag1', 'tag2'],
  },
  {
    title: 'GraphiQL',
    description:
      'Integrates GraphiQL as a tool to browse GraphiQL endpoints inside Backstage.',
    url: 'http://spotify.com/',
    image:
      'https://camo.githubusercontent.com/517398c3fbe0687d3d4dcbe05da82970b882e75a/68747470733a2f2f64337676366c703535716a6171632e636c6f756466726f6e742e6e65742f6974656d732f33413061324e314c3346324f304c3377326e316a2f477261706869514c382e706e673f582d436c6f75644170702d56697369746f722d49643d3433363432',
    tags: ['tag1', 'tag2'],
  },
];

const ExplorePluginPage: FC<{}> = () => {
  const classes = useStyles();
  return (
    <Page theme={pageTheme.home}>
      <Header title="Explore" subtitle="Tools and services" />
      <Content>
        <ContentHeader title="Platforms">
          <SupportButton>
            <Typography>
              Explore platforms available in the Spotify ecosystem
            </Typography>
          </SupportButton>
        </ContentHeader>
        <div className={classes.container}>
          {toolsCards.map((card: CardData, ix: any) => (
            <ExploreCard card={card} key={ix} />
          ))}
        </div>
      </Content>
    </Page>
  );
};

export default ExplorePluginPage;

// export default withStyles(cardLayoutStyles)(ExplorePluginPage);
