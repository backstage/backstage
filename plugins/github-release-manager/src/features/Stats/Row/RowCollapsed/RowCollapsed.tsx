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
import { Box } from '@material-ui/core';

import { getReleasesWithTags } from '../../helpers/getReleasesWithTags';
import { ReleaseTime } from './ReleaseTime';
import { ReleaseTagList } from './ReleaseTagList';

interface RowCollapsedProps {
  releaseWithTags: ReturnType<
    typeof getReleasesWithTags
  >['releasesWithTags']['releases']['0'];
}

export function RowCollapsed({ releaseWithTags }: RowCollapsedProps) {
  return (
    <Box
      margin={1}
      style={{
        display: 'flex',
        alignItems: 'stretch',
        paddingLeft: '10%',
        paddingRight: '10%',
      }}
    >
      <ReleaseTagList releaseWithTags={releaseWithTags} />

      <ReleaseTime releaseWithTags={releaseWithTags} />
    </Box>
  );
}
