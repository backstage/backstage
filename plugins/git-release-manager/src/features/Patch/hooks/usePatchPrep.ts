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

import { useAsync, useAsyncFn } from 'react-use';
import { useApi } from '@backstage/core-plugin-api';

import { GetRecentCommitsResultSingle } from '../../../api/GitReleaseClient';
import { CalverTagParts } from '../../../helpers/tagParts/getCalverTagParts';
import { getPatchCommitSuffix } from '../helpers/getPatchCommitSuffix';
import { gitReleaseManagerApiRef } from '../../../api/serviceApiRef';
import { GitReleaseManagerError } from '../../../errors/GitReleaseManagerError';
import { Project } from '../../../contexts/ProjectContext';
import { SemverTagParts } from '../../../helpers/tagParts/getSemverTagParts';
import { useResponseSteps } from '../../../hooks/useResponseSteps';

export interface UsePatchPreparation {
  bumpedTag: string;
  releaseBranchName: string;
  project: Project;
  tagParts: NonNullable<CalverTagParts | SemverTagParts>;
}

// Inspiration: https://stackoverflow.com/questions/53859199/how-to-cherry-pick-through-githubs-api
export function usePatchPreparation({
  bumpedTag,
  releaseBranchName,
  project,
  tagParts,
}: UsePatchPreparation) {
  const pluginApiClient = useApi(gitReleaseManagerApiRef);
  const { responseSteps, addStepToResponseSteps, asyncCatcher, abortIfError } =
    useResponseSteps();

  const tempPatchBranchName = `${releaseBranchName}-temp-patch-prep`;

  /**
   * (1) Get the release branch's most recent commit
   */
  const [latestCommitOnReleaseBranchRes, run] = useAsyncFn(
    async (selectedPatchCommit: GetRecentCommitsResultSingle) => {
      const { commit: latestCommit } = await pluginApiClient
        .getCommit({
          owner: project.owner,
          repo: project.repo,
          ref: releaseBranchName,
        })
        .catch(asyncCatcher);

      addStepToResponseSteps({
        message: `[patch prep] Fetched latest commit from "${releaseBranchName}"`,
        secondaryMessage: `with message "${latestCommit.commit.message}"`,
        link: latestCommit.htmlUrl,
      });

      return {
        latestCommit,
        selectedPatchCommit,
      };
    },
  );

  /**
   * (2) Create temporary patch branch based on release branch's most recent sha
   * to test if programmatic cherry pick patching is possible
   */
  const createTempPatchBranchRes = useAsync(async () => {
    abortIfError(latestCommitOnReleaseBranchRes.error);
    if (!latestCommitOnReleaseBranchRes.value) return undefined;

    const { reference: createdReleaseBranch } = await pluginApiClient
      .createRef({
        owner: project.owner,
        repo: project.repo,
        sha: latestCommitOnReleaseBranchRes.value.latestCommit.sha,
        ref: `refs/heads/${tempPatchBranchName}`,
      })
      .catch(error => {
        if (error?.body?.message === 'Reference already exists') {
          throw new GitReleaseManagerError(
            `Branch "${tempPatchBranchName}" already exists: .../tree/${tempPatchBranchName}`,
          );
        }
        throw error;
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: '[patch prep] Created Temp Patch Branch',
      secondaryMessage: `with ref "${createdReleaseBranch.ref}"`,
    });

    return {
      ...createdReleaseBranch,
      selectedPatchCommit:
        latestCommitOnReleaseBranchRes.value.selectedPatchCommit,
    };
  }, [
    latestCommitOnReleaseBranchRes.value,
    latestCommitOnReleaseBranchRes.error,
  ]);

  /**
   * (3) Here is the branch we want to cherry-pick to:
   * > branch = GET /repos/$owner/$repo/branches/$branchName
   * > branchSha = branch.commit.sha
   * > branchTree = branch.commit.commit.tree.sha
   */
  const tempPatchBranchRes = useAsync(async () => {
    abortIfError(createTempPatchBranchRes.error);
    if (!createTempPatchBranchRes.value) return undefined;

    const { branch: releaseBranch } = await pluginApiClient
      .getBranch({
        owner: project.owner,
        repo: project.repo,
        branch: tempPatchBranchName,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `[patch prep] Fetched release branch "${releaseBranch.name}"`,
      link: releaseBranch.links.html,
    });

    return {
      releaseBranch,
      selectedPatchCommit: createTempPatchBranchRes.value.selectedPatchCommit,
    };
  }, [createTempPatchBranchRes.value, createTempPatchBranchRes.error]);

  /**
   *  (4) Create a temporary commit on the branch, which extends as a sibling of
   *  the commit we want but contains the current tree of the target branch:
   *  > parentSha = commit.parents.head // first parent -- there should only be one
   *  > tempCommit = POST /repos/$owner/$repo/git/commits { "message": "temp", "tree": branchTree, "parents": [parentSha] }
   */
  const tempCommitRes = useAsync(async () => {
    abortIfError(tempPatchBranchRes.error);
    if (!tempPatchBranchRes.value) return undefined;

    const { commit: tempCommit } = await pluginApiClient
      .createCommit({
        owner: project.owner,
        repo: project.repo,
        message: `[patch prep] Temporary commit for patch ${tagParts.patch}`,
        parents: [
          tempPatchBranchRes.value.selectedPatchCommit.firstParentSha ?? '',
        ],
        tree: tempPatchBranchRes.value.releaseBranch.commit.commit.tree.sha,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: '[patch prep] Created temporary commit',
      secondaryMessage: `with message "${tempCommit.message}"`,
    });

    return {
      ...tempCommit,
    };
  }, [tempPatchBranchRes.value, tempPatchBranchRes.error]);

  /**
   * (5) Now temporarily force the branch over to that commit:
   * > PATCH /repos/$owner/$repo/git/refs/heads/$refName { sha = tempCommit.sha, force = true }
   */
  const forceBranchRes = useAsync(async () => {
    abortIfError(tempCommitRes.error);
    if (!tempCommitRes.value) return undefined;

    await pluginApiClient
      .updateRef({
        owner: project.owner,
        repo: project.repo,
        sha: tempCommitRes.value.sha,
        ref: `heads/${tempPatchBranchName}`,
        force: true,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `[patch prep] Forced branch "${tempPatchBranchName}" to temporary commit "${tempCommitRes.value.sha}"`,
    });

    return {
      trigger: 'next step 🚀 ',
    };
  }, [tempCommitRes.value, tempCommitRes.error]);

  /**
   * (6) Merge the commit we want into this mess:
   * > merge = POST /repos/$owner/$repo/merges { "base": branchName, "head": commit.sha }
   */
  const mergeRes = useAsync(async () => {
    abortIfError(forceBranchRes.error);
    if (!forceBranchRes.value || !tempPatchBranchRes.value) return undefined;

    const { merge } = await pluginApiClient
      .merge({
        owner: project.owner,
        repo: project.repo,
        base: tempPatchBranchName,
        head: tempPatchBranchRes.value.selectedPatchCommit.sha,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `[patch prep] Merged temporary commit into "${tempPatchBranchName}"`,
      secondaryMessage: `with message "${merge.commit.message}"`,
      link: merge.htmlUrl,
    });

    return {
      ...merge,
    };
  }, [forceBranchRes.value, forceBranchRes.error]);

  /**
   * (7) Now that we know what the tree should be, create the cherry-pick commit.
   * Note that branchSha is the original from up at the top.
   * > cherry = POST /repos/$owner/$repo/git/commits { "message": "looks good!", "tree": mergeTree, "parents": [branchSha] }
   */
  const cherryPickRes = useAsync(async () => {
    abortIfError(mergeRes.error);
    if (!mergeRes.value || !tempPatchBranchRes.value) return undefined;

    const releaseBranchSha = tempPatchBranchRes.value.releaseBranch.commit.sha;
    const selectedPatchCommit = tempPatchBranchRes.value.selectedPatchCommit;

    const { commit: cherryPickCommit } = await pluginApiClient.createCommit({
      owner: project.owner,
      repo: project.repo,
      message: `[patch prep] [patch ${bumpedTag}] ${
        selectedPatchCommit.commit.message
      }

      ${getPatchCommitSuffix({
        commitSha: selectedPatchCommit.sha,
      })}`,
      parents: [releaseBranchSha],
      tree: mergeRes.value.commit.tree.sha,
    });

    addStepToResponseSteps({
      message: `[patch prep] Cherry-picked patch commit to "${releaseBranchSha}"`,
      secondaryMessage: `with message "${cherryPickCommit.message}"`,
    });

    return {
      ...cherryPickCommit,
    };
  }, [mergeRes.value, mergeRes.error]);

  /**
   * (8) Replace the temp commit with the real commit:
   * > PATCH /repos/$owner/$repo/git/refs/heads/$refName { sha = cherry.sha, force = true }
   */
  const updatedRefRes = useAsync(async () => {
    abortIfError(cherryPickRes.error);
    if (!cherryPickRes.value) return undefined;

    const { reference: updatedReference } = await pluginApiClient
      .updateRef({
        owner: project.owner,
        repo: project.repo,
        ref: `heads/${tempPatchBranchName}`,
        sha: cherryPickRes.value.sha,
        force: true,
      })
      .catch(asyncCatcher);

    addStepToResponseSteps({
      message: `[patch prep] Updated reference "${updatedReference.ref}"`,
    });

    return {
      ...updatedReference,
    };
  }, [cherryPickRes.value, cherryPickRes.error]);

  /**
   * (9) Delete temp patch branch
   */
  const deleteTempPatchBranchRes = useAsync(async () => {
    abortIfError(cherryPickRes.error);
    if (!cherryPickRes.value) return undefined;

    const { success: deletedReferenceSuccess } =
      await pluginApiClient.deleteRef({
        owner: project.owner,
        repo: project.repo,
        ref: `heads/${tempPatchBranchName}`,
      });

    addStepToResponseSteps({
      message: `[patch prep] Deleted temporary patch prep branch "${tempPatchBranchName}"`,
    });

    return {
      deletedReferenceSuccess,
    };
  }, [updatedRefRes.value, updatedRefRes.error]);

  const TOTAL_PATCH_PREP_STEPS = 9;

  return {
    TOTAL_PATCH_PREP_STEPS,
    run,
    runInvoked: Boolean(
      deleteTempPatchBranchRes.loading ||
        deleteTempPatchBranchRes.value ||
        deleteTempPatchBranchRes.error,
    ),
    lastCallRes: deleteTempPatchBranchRes,
    responseSteps,
    addStepToResponseSteps,
    asyncCatcher,
    abortIfError,
    selectedPatchCommit: latestCommitOnReleaseBranchRes.value
      ?.selectedPatchCommit as any,
  };
}
