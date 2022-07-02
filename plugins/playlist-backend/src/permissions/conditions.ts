/*
 * Copyright 2022 The Backstage Authors
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

import { PLAYLIST_LIST_RESOURCE_TYPE } from '@backstage/plugin-playlist-common';
import {
  ConditionTransformer,
  createConditionExports,
  createConditionTransformer,
} from '@backstage/plugin-permission-node';

import { ListPlaylistsFilter } from '../service';
import { rules } from './rules';

const { conditions, createConditionalDecision } = createConditionExports({
  pluginId: 'playlist',
  resourceType: PLAYLIST_LIST_RESOURCE_TYPE,
  rules,
});

/**
 * @public
 */
export const playlistConditions = conditions;

/**
 * @public
 */
export const createPlaylistConditionalDecision = createConditionalDecision;

export const transformConditions: ConditionTransformer<ListPlaylistsFilter> =
  createConditionTransformer(Object.values(rules));
