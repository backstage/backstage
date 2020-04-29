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
import { Typography, withStyles } from '@material-ui/core';
import {
  Content,
  ContentHeader,
  Header,
  Page,
  pageTheme,
  SupportButton,
} from '@backstage/core';
import ExploreCard from './ExploreCard';
import { useCardLayoutStyles } from './CardLayoutStyles';

const toolsCards = [
  {
    title: 'Title',
    description: 'Something something',
    url: 'http://spotify.com/',
    image: 'https://developer.spotify.com/assets/WebAPI_intro.png',
    tags: ['tag1', 'tag2'],
  },
];

const ExplorePluginPage: FC<{}> = () => {
  const classes = useCardLayoutStyles();
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
          {toolsCards.map((card: Card, ix: any) => (
            <ExploreCard
              title={card.title}
              description={card.description}
              image={card.image}
              objectFit={card.fit}
              url={card.url}
              lifecycle={card.lifecycle}
              domains={card.domains}
              newsTag={card.newsTag}
              key={ix}
            />
          ))}
        </div>
      </Content>
    </Page>
  );
};

export default ExplorePluginPage;
/*
import ExploreLayout from 'shared/components/layout/explore/ExploreLayout';
import ExploreCard from './components/ExploreCard';
import { CardLayoutStyles } from 'shared/components/layout/CardLayoutStyles';

*/

// export default withStyles(cardLayoutStyles)(ExplorePluginPage);
