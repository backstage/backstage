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

export const TEST_IDS = {
  info: {
    info: 'grm--info',
    infoCardPlus: 'grm--info-card-plus',
  },
  createRc: {
    cta: 'grm--create-rc--cta',
    semverSelect: 'grm--create-rc--semver-select',
  },
  promoteRc: {
    mockedPromoteRcBody: 'grm-mocked-promote-rc-body',
    notRcWarning: 'grm--promote-rc--not-rc-warning',
    promoteRc: 'grm--promote-rc',
    cta: 'grm--promote-rc-body--cta',
  },
  patch: {
    error: 'grm--patch-body--error',
    loading: 'grm--patch-body--loading',
    notPrerelease: 'grm--patch-body--not-prerelease--info',
    body: 'grm--patch-body',
  },
  components: {
    divider: 'grm--divider',
    reloadButton: 'grm--reload-button',
    noLatestRelease: 'grm--no-latest-release',
    noReleaseBranch: 'grm--no-release-branch',
    circularProgress: 'grm--circular-progress',
    responseStepListDialogContent: 'grm--response-step-list--dialog-content',
    responseStepListItem: 'grm--response-step-list-item',
    responseStepListItemIconSuccess:
      'grm--response-step-list-item--item-icon--success',
    responseStepListItemIconFailure:
      'grm--response-step-list-item--item-icon--failure',
    responseStepListItemIconLink:
      'grm--response-step-list-item--item-icon--link',
    responseStepListItemIconDefault:
      'grm--response-step-list-item--item-icon--default',
    differ: {
      current: 'grm--differ-current',
      next: 'grm--differ-next',
      icons: {
        tag: 'grm--differ--icons--tag',
        branch: 'grm--differ--icons--branch',
        github: 'grm--differ--icons--github',
        slack: 'grm--differ--icons--slack',
        versioning: 'grm--differ--icons--versioning',
      },
    },
  },
};
