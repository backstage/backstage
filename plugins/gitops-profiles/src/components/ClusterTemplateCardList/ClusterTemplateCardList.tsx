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
import { Grid } from '@material-ui/core';
import ClusterTemplateCard from '../ClusterTemplateCard';
import { useLocalStorage } from 'react-use';

interface Props {
  template: {
    platformName: string;
    title: string;
    repository: string;
    description: string;
  }[];
}

const ClusterTemplateCardList: FC<Props> = props => {
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [templateRepo, setTemplateRepo] = useLocalStorage<string>(
    'gitops-template-repo',
  );

  const handleClicked = (index: number, repository: string) => {
    // eslint-disable-next-line no-console
    console.log(templateRepo);

    setActiveIndex(index);
    setTemplateRepo(repository);
  };

  return (
    <Grid container xl={12} spacing={4}>
      {props.template.map((value, index) => (
        <Grid item xl={2} key={index}>
          <ClusterTemplateCard
            activeIndex={activeIndex}
            onClick={handleClicked}
            index={index}
            key={index}
            platformName={value.platformName}
            title={value.title}
            repository={value.repository}
            description={value.description}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ClusterTemplateCardList;
