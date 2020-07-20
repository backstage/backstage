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
import { stores, mode } from './utils/config';
import React, { FC } from 'react';
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Page,
  pageTheme,
} from '@backstage/core';
import { AndroidTrack } from './types';
import { RmErrorMessage } from './components/RmErrorMessage';
import { AndroidReleases } from './components/AndroidReleases';

const ReleaseManagerPage: FC<{}> = () => {
  const [
    { data: androidData, loading: androidLoading, error: androidError },
  ] = useAxios(`${stores.android.baseUrl[mode]}/com.spotify.music/tracks`);

  const AndroidTracks = () => {
    if (androidError) {
      return (
        <RmErrorMessage
          error={String(androidError)}
          message="Could not load Android tracks."
        />
      );
    }

    if (androidLoading) return <SpacedProgress />;

    return androidData.tracks.map((track: AndroidTrack, i: number) => {
      return (
        <div key={i}>
          <h3>{track.track}</h3>
          <AndroidReleases releases={track.releases} />
        </div>
      );
    });
  };

  return (
    <Page theme={pageTheme.home}>
      <Header type="Tool" title="Release Manager">
        <HeaderLabel label="Owner" value="release" url="/org/release" />
        <HeaderLabel label="Lifecycle" value="Experimental" />
      </Header>
      <Content>
        <ContentHeader title="Overview" />
        <h2>Android</h2>
        <AndroidTracks />
      </Content>
    </Page>
  );
};

export default ReleaseManagerPage;
