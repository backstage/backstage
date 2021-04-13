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
import {
  ComponentConfigPatch,
  GhGetCommitResponse,
  GhGetReleaseResponse,
  ResponseStep,
} from '../../../types/types';
import { CalverTagParts } from '../../../helpers/tagParts/getCalverTagParts';
import { GitHubReleaseManagerError } from '../../../errors/GitHubReleaseManagerError';
import { ApiClient } from '../../../api/ApiClient';
import { SemverTagParts } from '../../../helpers/tagParts/getSemverTagParts';

interface Patch {
  apiClient: ApiClient;
  bumpedTag: string;
  latestRelease: GhGetReleaseResponse;
  selectedPatchCommit: GhGetCommitResponse;
  successCb?: ComponentConfigPatch['successCb'];
  tagParts: NonNullable<CalverTagParts | SemverTagParts>;
}

// Inspo: https://stackoverflow.com/questions/53859199/how-to-cherry-pick-through-githubs-api
export async function patch({
  apiClient,
  bumpedTag,
  latestRelease,
  selectedPatchCommit,
  successCb,
  tagParts,
}: Patch) {
  const responseSteps: ResponseStep[] = [];

  if (!selectedPatchCommit || !selectedPatchCommit.sha) {
    throw new GitHubReleaseManagerError('Invalid commit');
  }

  const releaseBranchName = latestRelease.target_commitish;
  /**
   * 1. Here is the branch we want to cherry-pick to:
   * > branch = GET /repos/$owner/$repo/branches/$branchName
   * > branchSha = branch.commit.sha
   * > branchTree = branch.commit.commit.tree.sha
   */
  const { branch: releaseBranch } = await apiClient.getBranch({
    branchName: releaseBranchName,
  });
  const releaseBranchSha = releaseBranch.commit.sha;
  const releaseBranchTree = releaseBranch.commit.commit.tree.sha;
  responseSteps.push({
    message: `Fetched release branch "${releaseBranch.name}"`,
    link: releaseBranch._links.html,
  });

  /**
   *  2. Create a temporary commit on the branch, which extends as a sibling of
   *  the commit we want but contains the current tree of the target branch:
   *  > parentSha = commit.parents.head // first parent -- there should only be one
   *  > tempCommit = POST /repos/$owner/$repo/git/commits { "message": "temp", "tree": branchTree, "parents": [parentSha] }
   */
  const { tempCommit } = await apiClient.patch.createTempCommit({
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
  await apiClient.patch.forceBranchHeadToTempCommit({
    tempCommit,
    releaseBranchName,
  });

  /**
   * 4. Merge the commit we want into this mess:
   * > merge = POST /repos/$owner/$repo/merges { "base": branchName, "head": commit.sha }
   */
  const { merge } = await apiClient.patch.merge({
    base: releaseBranchName,
    head: selectedPatchCommit.sha,
  });
  responseSteps.push({
    message: `Merged temporary commit into "${releaseBranchName}"`,
    secondaryMessage: `with message "${merge.commit.message}"`,
    link: merge.html_url,
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
  const { cherryPickCommit } = await apiClient.patch.createCherryPickCommit({
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
  const { updatedReference } = await apiClient.patch.replaceTempCommit({
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
  const { tagObjectResponse } = await apiClient.patch.createTagObject({
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
  const { reference } = await apiClient.patch.createReference({
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
  const { release: updatedRelease } = await apiClient.patch.updateRelease({
    bumpedTag,
    latestRelease,
    selectedPatchCommit,
    tagParts,
  });
  responseSteps.push({
    message: `Updated release "${updatedRelease.name}"`,
    secondaryMessage: `with tag ${updatedRelease.tag_name}`,
    link: updatedRelease.html_url,
  });

  await successCb?.({
    updatedReleaseUrl: updatedRelease.html_url,
    updatedReleaseName: updatedRelease.name,
    previousTag: latestRelease.tag_name,
    patchedTag: updatedRelease.tag_name,
    patchCommitUrl: selectedPatchCommit.html_url,
    patchCommitMessage: selectedPatchCommit.commit.message,
  });

  return responseSteps;
}
