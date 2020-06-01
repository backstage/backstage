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
import useAxios from 'axios-hooks';
import { SpacedProgress } from './components/SpacedProgress';
import { baseUrl } from './utils/config';
import React, { FC } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Page,
  pageTheme,
} from '@backstage/core';
import { ReleasePanel } from './components/ReleasePanel';
import { Release } from './types';
import { RmErrorMessage } from './components/RmErrorMessage';

const Releases: FC<{
  releases: Release[];
}> = ({ releases }) => (
  <>
    {releases.map((release, i) => (
      <ReleasePanel key={i} release={release} />
    ))}
  </>
);

const ReleaseManagerPage: FC<{}> = () => {
  const [{ data: avData, loading: avLoading, error: avError }] = useAxios(
    `${baseUrl}/com.spotify.music/tracks`,
  );
  // const [{ data: ubData, loading: ubLoading, error: ubError }] = useAxios(
  //   `${baseUrl}/unowned-bugs`,
  // );

  const ActiveVersions = () => {
    if (avError)
      return (
        <RmErrorMessage
          error={String(avError)}
          message="Could not load releases."
        />
      );

    return (
      <>
        <h2>Current</h2>
        {avLoading ? (
          <SpacedProgress />
        ) : (
          <Releases releases={avData.current} />
        )}
        <h2>Upcoming</h2>
        {avLoading ? (
          <SpacedProgress />
        ) : (
          <Releases releases={avData.upcoming} />
        )}
      </>
    );
  };

  return (
    <Page theme={pageTheme.home}>
      <Header type="Tool" title="Release Manager">
        <HeaderLabel label="Owner" value="release" url="/org/release" />
        <HeaderLabel label="Lifecycle" value="Experimental" />
      </Header>
      <Content>
        <ContentHeader title="Overview" />
        <ActiveVersions />
      </Content>
    </Page>
  );
};

export default ReleaseManagerPage;
