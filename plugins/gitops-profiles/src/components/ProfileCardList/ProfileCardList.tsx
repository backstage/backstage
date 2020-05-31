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
import React, { FC, useState } from 'react';
import { Grid } from '@material-ui/core';
import ProfileCard from '../ProfileCard';
import { useLocalStorage } from 'react-use';

interface Props {
  profileTemplates: {
    shortName: string;
    title: string;
    repository: string;
    description: string;
  }[];
}

const ProfileCardList: FC<Props> = props => {
  const [selections, setSelections] = useState<Set<number>>(new Set<number>());
  const [profiles, setProfiles] = useState<Set<string>>(new Set<string>());
  const [gitopsProfiles, setGitopsProfiles] = useLocalStorage<string[]>(
    'gitops-profiles',
  );

  const handleClicked = (index: number, repository: string) => {
    if (selections.has(index)) {
      selections.delete(index);
      profiles.delete(repository);
    } else {
      selections.add(index);
      profiles.add(repository);
    }

    setSelections(selections);
    setProfiles(profiles);

    setGitopsProfiles(Array.from(profiles));
    // eslint-disable-next-line no-console
    console.log(profiles);
    // eslint-disable-next-line no-console
    console.log(gitopsProfiles);
    // eslint-disable-next-line no-console
    console.log(gitopsProfiles);
  };

  return (
    <Grid container xl={12} spacing={4}>
      {props.profileTemplates.map((value, index) => (
        <Grid item xl={2} key={index}>
          <ProfileCard
            shortName={value.shortName}
            selections={selections}
            onClick={handleClicked}
            key={index}
            index={index}
            title={value.title}
            repository={value.repository}
            description={value.description}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProfileCardList;
