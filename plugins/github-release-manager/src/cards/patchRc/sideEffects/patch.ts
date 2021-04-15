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

import { ComponentConfigPatch, ResponseStep } from '../../../types/types';
import { CalverTagParts } from '../../../helpers/tagParts/getCalverTagParts';
import { GitHubReleaseManagerError } from '../../../errors/GitHubReleaseManagerError';
import {
  ApiMethodRetval,
  IPluginApiClient,
  UnboxArray,
} from '../../../api/PluginApiClient';
import { Project } from '../../../contexts/ProjectContext';
import { SemverTagParts } from '../../../helpers/tagParts/getSemverTagParts';

interface Patch {
  bumpedTag: string;
  latestRelease: NonNullable<
    ApiMethodRetval<IPluginApiClient['getLatestRelease']>['latestRelease']
  >;
  pluginApiClient: IPluginApiClient;
  project: Project;
  selectedPatchCommit: UnboxArray<
    ApiMethodRetval<IPluginApiClient['getRecentCommits']>['recentCommits']
  >;
  successCb?: ComponentConfigPatch['successCb'];
  tagParts: NonNullable<CalverTagParts | SemverTagParts>;
}

// Inspo: https://stackoverflow.com/questions/53859199/how-to-cherry-pick-through-githubs-api
export async function patch({
  bumpedTag,
  latestRelease,
  pluginApiClient,
  project,
  selectedPatchCommit,
  successCb,
  tagParts,
}: Patch) {
  const responseSteps: ResponseStep[] = [];

  if (!selectedPatchCommit || !selectedPatchCommit.sha) {
    throw new GitHubReleaseManagerError('Invalid commit');
  }
  const releaseBranchName = latestRelease.targetCommitish;
  /**
   * 1. Here is the branch we want to cherry-pick to:
   * > branch = GET /repos/$owner/$repo/branches/$branchName
   * > branchSha = branch.commit.sha
   * > branchTree = branch.commit.commit.tree.sha
   */
  const releaseBranch = await pluginApiClient.getBranch({
    ...project,
    branchName: releaseBranchName,
  });
  const releaseBranchSha = releaseBranch.commit.sha;
  const releaseBranchTree = releaseBranch.commit.commit.tree.sha;
  responseSteps.push({
    message: `Fetched release branch "${releaseBranch.name}"`,
    link: releaseBranch.links.html,
  });

  /**
   *  2. Create a temporary commit on the branch, which extends as a sibling of
   *  the commit we want but contains the current tree of the target branch:
   *  > parentSha = commit.parents.head // first parent -- there should only be one
   *  > tempCommit = POST /repos/$owner/$repo/git/commits { "message": "temp", "tree": branchTree, "parents": [parentSha] }
   */
  const tempCommit = await pluginApiClient.patch.createTempCommit({
    ...project,
    releaseBranchTree,
    selectedPatchCommit,
    tagParts,
  });
  responseSteps.push({
    message: 'Created temporary commit',
    secondaryMessage: `with message "${tempCommit.message}"`,
  });

  /**
   * 3. Now temporarily force the branch over to that commit:
   * > PATCH /repos/$owner/$repo/git/refs/heads/$refName { sha = tempCommit.sha, force = true }
   */
  await pluginApiClient.patch.forceBranchHeadToTempCommit({
    ...project,
    tempCommit,
    releaseBranchName,
  });

  /**
   * 4. Merge the commit we want into this mess:
   * > merge = POST /repos/$owner/$repo/merges { "base": branchName, "head": commit.sha }
   */
  const merge = await pluginApiClient.patch.merge({
    ...project,
    base: releaseBranchName,
    head: selectedPatchCommit.sha,
  });
  responseSteps.push({
    message: `Merged temporary commit into "${releaseBranchName}"`,
    secondaryMessage: `with message "${merge.commit.message}"`,
    link: merge.htmlUrl,
  });

  /**
   * and get that tree!
   * > mergeTree = merge.commit.tree.sha
   */
  const mergeTree = merge.commit.tree.sha;

  /**
   * 5. Now that we know what the tree should be, create the cherry-pick commit.
   * Note that branchSha is the original from up at the top.
   * > cherry = POST /repos/$owner/$repo/git/commits { "message": "looks good!", "tree": mergeTree, "parents": [branchSha] }
   */
  const {
    cherryPickCommit,
  } = await pluginApiClient.patch.createCherryPickCommit({
    ...project,
    bumpedTag,
    mergeTree,
    releaseBranchSha,
    selectedPatchCommit,
  });
  responseSteps.push({
    message: `Cherry-picked patch commit to "${releaseBranchSha}"`,
    secondaryMessage: `with message "${cherryPickCommit.message}"`,
  });

  /**
   * 6. Replace the temp commit with the real commit:
   * > PATCH /repos/$owner/$repo/git/refs/heads/$refName { sha = cherry.sha, force = true }
   */
  const { updatedReference } = await pluginApiClient.patch.replaceTempCommit({
    ...project,
    cherryPickCommit,
    releaseBranchName,
  });
  responseSteps.push({
    message: `Updated reference "${updatedReference.ref}"`,
  });

  /**
   * 7. Create tag object: https://developer.github.com/v3/git/tags/#create-a-tag-object
   * > POST /repos/:owner/:repo/git/tags
   */
  const { tagObjectResponse } = await pluginApiClient.patch.createTagObject({
    ...project,
    bumpedTag,
    updatedReference,
  });
  responseSteps.push({
    message: 'Created new tag object',
    secondaryMessage: `with name "${tagObjectResponse.tag}"`,
  });

  /**
   * 8. Create a reference: https://developer.github.com/v3/git/refs/#create-a-reference
   * > POST /repos/:owner/:repo/git/refs
   */
  const { reference } = await pluginApiClient.patch.createReference({
    ...project,
    bumpedTag,
    tagObjectResponse,
  });
  responseSteps.push({
    message: `Created new reference "${reference.ref}"`,
    secondaryMessage: `for tag object "${tagObjectResponse.tag}"`,
  });

  /**
   * 9. Update release
   */
  const { release: updatedRelease } = await pluginApiClient.patch.updateRelease(
    {
      ...project,
      bumpedTag,
      latestRelease,
      selectedPatchCommit,
      tagParts,
    },
  );
  responseSteps.push({
    message: `Updated release "${updatedRelease.name}"`,
    secondaryMessage: `with tag ${updatedRelease.tag_name}`,
    link: updatedRelease.html_url,
  });

  await successCb?.({
    updatedReleaseUrl: updatedRelease.html_url,
    updatedReleaseName: updatedRelease.name,
    previousTag: latestRelease.tagName,
    patchedTag: updatedRelease.tag_name,
    patchCommitUrl: selectedPatchCommit.htmlUrl,
    patchCommitMessage: selectedPatchCommit.commit.message,
  });

  return responseSteps;
}
