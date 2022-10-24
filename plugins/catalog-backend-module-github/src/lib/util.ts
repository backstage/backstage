/*
 * Copyright 2021 The Backstage Authors
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

import { GithubTopicFilters } from '../providers/GithubEntityProviderConfig';

export function parseGithubOrgUrl(urlString: string): { org: string } {
  const path = new URL(urlString).pathname.substr(1).split('/');

  // /backstage
  if (path.length === 1 && path[0].length) {
    return { org: decodeURIComponent(path[0]) };
  }

  throw new Error(`Expected a URL pointing to /<org>`);
}

export function satisfiesTopicFilter(
  topics: string[],
  topicFilter: GithubTopicFilters | undefined,
): Boolean {
  // We don't want to do anything if a filter is not configured (or configured but empty)
  if (!topicFilter) return true;
  if (!topicFilter.include && !topicFilter.exclude) return true;
  if (!topicFilter.include?.length && !topicFilter.exclude?.length) return true;
  // If topic.include is in use, a topic MUST be set that matches the inclusion
  // filter in order for a repository to be ingested
  if (topicFilter.include?.length && !topicFilter.exclude) {
    for (const topic of topics) {
      if (topicFilter.include.includes(topic)) return true;
    }
    return false;
  }
  // If topic.exclude is in use, all topics are included by default
  // with anything matching the filter being discarded. It is technically
  // possible for the filter to be explicitly empty meaning all repositories
  // are ingested although doing so would be pointless.
  if (!topicFilter.include && topicFilter.exclude?.length) {
    if (!topics.length) return true;
    for (const topic of topics) {
      if (topicFilter.exclude.includes(topic)) return false;
    }
    return true;
  }
  // Now the tricky part is where we have both include and exclude configured.
  // In this case, exclude wins out so we take everything matching the initial
  // inclusion filter and from that group, we further discard anything matching
  // the exclusion filter. If an item were to have a topic set in both filters,
  // we expect it to be discarded in the end. The use case here is that is that
  // you may want to retrieve all repos with the topic of team-a while excluding
  // matching repos that are marked as experiments.
  if (topicFilter.include && topicFilter.exclude) {
    const matchesInclude = satisfiesTopicFilter(topics, {
      include: topicFilter.include,
    });
    const matchesExclude = !satisfiesTopicFilter(topics, {
      exclude: topicFilter.exclude,
    });
    if (matchesExclude) return false;
    return matchesInclude;
  }

  // If the topic filter is somehow ever in a state that is not covered here, we
  // will fail "open" so that Backstage is still usable as if the filter was
  // not configured at all.
  return true;
}
