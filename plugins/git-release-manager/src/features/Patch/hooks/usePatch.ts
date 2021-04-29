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

import { useEffect, useState } from 'react';
import { useAsync, useAsyncFn } from 'react-use';
import { useApi } from '@backstage/core';

import {
  GetLatestReleaseResult,
  GetRecentCommitsResultSingle,
} from '../../../api/GitReleaseApiClient';
import { CalverTagParts } from '../../../helpers/tagParts/getCalverTagParts';
import { ComponentConfigPatch, CardHook } from '../../../types/types';
import { getPatchCommitSuffix } from '../helpers/getPatchCommitSuffix';
import { gitReleaseManagerApiRef } from '../../../api/serviceApiRef';
import { Project } from '../../../contexts/ProjectContext';
import { SemverTagParts } from '../../../helpers/tagParts/getSemverTagParts';
import { TAG_OBJECT_MESSAGE } from '../../../constants/constants';
import { useResponseSteps } from '../../../hooks/useResponseSteps';
import { useUserContext } from '../../../contexts/UserContext';

interface Patch {
  bumpedTag: string;
  latestRelease: NonNullable<GetLatestReleaseResult>;
  project: Project;
  tagParts: NonNullable<CalverTagParts | SemverTagParts>;
  successCb?: ComponentConfigPatch['successCb'];
}

// Inspiration: https://stackoverflow.com/questions/53859199/how-to-cherry-pick-through-githubs-api
export function usePatch({
  bumpedTag,
  latestRelease,
  project,
  tagParts,
  successCb,
}: Patch): CardHook<GetRecentCommitsResultSingle> {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { user } = useUserContext();
  const {
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
  } = useResponseSteps();

  const releaseBranchName = latestRelease.targetCommitish;

  /**
   * (1) Here is the branch we want to cherry-pick to:
   * > branch = GET /repos/$owner/$repo/branches/$branchName
   * > branchSha = branch.commit.sha
   * > branchTree = branch.commit.commit.tree.sha
   */
  const [releaseBranchRes, run] = useAsyncFn(
    async (selectedPatchCommit: GetRecentCommitsResultSingle) => {
      const releaseBranch = await pluginApiClient
        .getBranch({
          owner: project.owner,
          repo: project.repo,
          branchName: releaseBranchName,
        })
        .catch(asyncCatcher);

      addStepToResponseSteps({
        message: `Fetched release branch "${releaseBranch.name}"`,
        link: releaseBranch.links.html,
      });

      return {
        releaseBranch,
        selectedPatchCommit,
      };
    },
  );

  /**
   *  (2) Create a temporary commit on the branch, which extends as a sibling of
   *  the commit we want but contains the current tree of the target branch:
   *  > parentSha = commit.parents.head // first parent -- there should only be one
   *  > tempCommit = POST /repos/$owner/$repo/git/commits { "message": "temp", "tree": branchTree, "parents": [parentSha] }
   */
  const tempCommitRes = useAsync(async () => {
    abortIfError(releaseBranchRes.error);
    if (!releaseBranchRes.value) return undefined;

    const tempCommit = await pluginApiClient
      .createCommit({
        owner: project.owner,
        repo: project.repo,
        message: `Temporary commit for patch ${tagParts.patch}`,
        parents: [
          releaseBranchRes.value.selectedPatchCommit.firstParentSha ?? '',
        ],
        tree: releaseBranchRes.value.releaseBranch.commit.commit.tree.sha,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Created temporary commit',
      secondaryMessage: `with message "${tempCommit.message}"`,
    });

    return {
      ...tempCommit,
    };
  }, [releaseBranchRes.value, releaseBranchRes.error]);

  /**
   * (3) Now temporarily force the branch over to that commit:
   * > PATCH /repos/$owner/$repo/git/refs/heads/$refName { sha = tempCommit.sha, force = true }
   */
  const forceBranchRes = useAsync(async () => {
    abortIfError(tempCommitRes.error);
    if (!tempCommitRes.value) return undefined;

    await pluginApiClient.patch
      .forceBranchHeadToTempCommit({
        owner: project.owner,
        repo: project.repo,
        sha: tempCommitRes.value.sha,
        ref: `heads/${releaseBranchName}`,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Forced branch "${releaseBranchName}" to temporary commit "${tempCommitRes.value.sha}"`,
    });

    return {
      trigger: 'next step 🚀 ',
    };
  }, [tempCommitRes.value, tempCommitRes.error]);

  /**
   * (4) Merge the commit we want into this mess:
   * > merge = POST /repos/$owner/$repo/merges { "base": branchName, "head": commit.sha }
   */
  const mergeRes = useAsync(async () => {
    abortIfError(forceBranchRes.error);
    if (!forceBranchRes.value || !releaseBranchRes.value) return undefined;

    const merge = await pluginApiClient.patch
      .merge({
        owner: project.owner,
        repo: project.repo,
        base: releaseBranchName,
        head: releaseBranchRes.value.selectedPatchCommit.sha,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Merged temporary commit into "${releaseBranchName}"`,
      secondaryMessage: `with message "${merge.commit.message}"`,
      link: merge.htmlUrl,
    });

    return {
      ...merge,
    };
  }, [forceBranchRes.value, forceBranchRes.error]);

  /**
   * (5) Now that we know what the tree should be, create the cherry-pick commit.
   * Note that branchSha is the original from up at the top.
   * > cherry = POST /repos/$owner/$repo/git/commits { "message": "looks good!", "tree": mergeTree, "parents": [branchSha] }
   */
  const cherryPickRes = useAsync(async () => {
    abortIfError(mergeRes.error);
    if (!mergeRes.value || !releaseBranchRes.value) return undefined;

    const releaseBranchSha = releaseBranchRes.value.releaseBranch.commit.sha;

    const cherryPickCommit = await pluginApiClient.patch
      .createCherryPickCommit({
        owner: project.owner,
        repo: project.repo,
        bumpedTag,
        mergeTree: mergeRes.value.commit.tree.sha,
        releaseBranchSha,
        selectedPatchCommit: releaseBranchRes.value.selectedPatchCommit,
        messageSuffix: getPatchCommitSuffix({
          commitSha: releaseBranchRes.value.selectedPatchCommit.sha,
        }),
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Cherry-picked patch commit to "${releaseBranchSha}"`,
      secondaryMessage: `with message "${cherryPickCommit.message}"`,
    });

    return {
      ...cherryPickCommit,
    };
  }, [mergeRes.value, mergeRes.error]);

  /**
   * (6) Replace the temp commit with the real commit:
   * > PATCH /repos/$owner/$repo/git/refs/heads/$refName { sha = cherry.sha, force = true }
   */
  const updatedRefRes = useAsync(async () => {
    abortIfError(cherryPickRes.error);
    if (!cherryPickRes.value) return undefined;

    const updatedReference = await pluginApiClient.patch
      .replaceTempCommit({
        owner: project.owner,
        repo: project.repo,
        cherryPickCommit: cherryPickRes.value,
        releaseBranchName,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Updated reference "${updatedReference.ref}"`,
    });

    return {
      ...updatedReference,
    };
  }, [cherryPickRes.value, cherryPickRes.error]);

  /**
   * (7) Create tag object: https://developer.github.com/v3/git/tags/#create-a-tag-object
   * > POST /repos/:owner/:repo/git/tags
   */
  const createdTagObjRes = useAsync(async () => {
    abortIfError(updatedRefRes.error);
    if (!updatedRefRes.value) return undefined;

    const createdTagObject = await pluginApiClient
      .createTagObject({
        owner: project.owner,
        repo: project.repo,
        tag: bumpedTag,
        objectSha: updatedRefRes.value.object.sha,
        message: TAG_OBJECT_MESSAGE,
        taggerName: user.username,
        taggerEmail: user.email,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: 'Created new tag object',
      secondaryMessage: `with name "${createdTagObject.tagName}"`,
    });

    return {
      ...createdTagObject,
    };
  }, [updatedRefRes.value, updatedRefRes.error]);

  /**
   * (8) Create a reference: https://developer.github.com/v3/git/refs/#create-a-reference
   * > POST /repos/:owner/:repo/git/refs
   */
  const createdReferenceRes = useAsync(async () => {
    abortIfError(createdTagObjRes.error);
    if (!createdTagObjRes.value) return undefined;

    const reference = await pluginApiClient
      .createRef({
        owner: project.owner,
        repo: project.repo,
        ref: `refs/tags/${bumpedTag}`,
        sha: createdTagObjRes.value.tagSha,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Created new reference "${reference.ref}"`,
      secondaryMessage: `for tag object "${createdTagObjRes.value.tagName}"`,
    });

    return {
      ...reference,
    };
  }, [createdTagObjRes.value, createdTagObjRes.error]);

  /**
   * (9) Update release
   */
  const updatedReleaseRes = useAsync(async () => {
    abortIfError(createdReferenceRes.error);
    if (!createdReferenceRes.value || !releaseBranchRes.value) return undefined;

    const updatedRelease = await pluginApiClient.patch
      .updateRelease({
        owner: project.owner,
        repo: project.repo,
        bumpedTag,
        latestRelease,
        selectedPatchCommit: releaseBranchRes.value.selectedPatchCommit,
        tagParts,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `Updated release "${updatedRelease.name}"`,
      secondaryMessage: `with tag ${updatedRelease.tagName}`,
      link: updatedRelease.htmlUrl,
    });

    return {
      ...updatedRelease,
    };
  }, [createdReferenceRes.value, createdReferenceRes.error]);

  /**
   * (10) Run successCb if defined
   */
  useAsync(async () => {
    if (!successCb) return;
    abortIfError(updatedReleaseRes.error);

    if (!updatedReleaseRes.value || !releaseBranchRes.value) return;

    try {
      await successCb?.({
        updatedReleaseUrl: updatedReleaseRes.value.htmlUrl,
        updatedReleaseName: updatedReleaseRes.value.name,
        previousTag: latestRelease.tagName,
        patchedTag: updatedReleaseRes.value.tagName,
        patchCommitUrl: releaseBranchRes.value.selectedPatchCommit.htmlUrl,
        patchCommitMessage:
          releaseBranchRes.value.selectedPatchCommit.commit.message,
      });
    } catch (error) {
      asyncCatcher(error);
    }

    addStepToResponseSteps({
      message: 'Success callback successfully called 🚀',
      icon: 'success',
    });
  }, [updatedReleaseRes.value]);

  const TOTAL_STEPS = 9 + (!!successCb ? 1 : 0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress((responseSteps.length / TOTAL_STEPS) * 100);
  }, [TOTAL_STEPS, responseSteps.length]);

  return {
    progress,
    responseSteps,
    run,
    runInvoked: Boolean(
      releaseBranchRes.loading ||
        releaseBranchRes.value ||
        releaseBranchRes.error,
    ),
  };
}
