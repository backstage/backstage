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

import * as testIds from './test-ids';

describe('test-ids', () => {
  it('should export the correct things', () => {
    expect(testIds).toMatchInlineSnapshot(`
      Object {
        "TEST_IDS": Object {
          "components": Object {
            "circularProgress": "grm--circular-progress",
            "differ": Object {
              "current": "grm--differ-current",
              "icons": Object {
                "branch": "grm--differ--icons--branch",
                "github": "grm--differ--icons--github",
                "slack": "grm--differ--icons--slack",
                "tag": "grm--differ--icons--tag",
                "versioning": "grm--differ--icons--versioning",
              },
              "next": "grm--differ-next",
            },
            "divider": "grm--divider",
            "linearProgressWithLabel": "grm--linear-progress-with-label",
            "noLatestRelease": "grm--no-latest-release",
            "responseStepListDialogContent": "grm--response-step-list--dialog-content",
            "responseStepListItem": "grm--response-step-list-item",
            "responseStepListItemIconDefault": "grm--response-step-list-item--item-icon--default",
            "responseStepListItemIconFailure": "grm--response-step-list-item--item-icon--failure",
            "responseStepListItemIconLink": "grm--response-step-list-item--item-icon--link",
            "responseStepListItemIconSuccess": "grm--response-step-list-item--item-icon--success",
          },
          "createRc": Object {
            "cta": "grm--create-rc--cta",
            "semverSelect": "grm--create-rc--semver-select",
          },
          "form": Object {
            "owner": Object {
              "empty": "grm--form--owner--empty",
              "error": "grm--form--owner--error",
              "loading": "grm--form--owner--loading",
              "select": "grm--form--owner--select",
            },
            "repo": Object {
              "empty": "grm--form--repo--empty",
              "error": "grm--form--repo--error",
              "loading": "grm--form--repo--loading",
              "select": "grm--form--repo--select",
            },
            "versioningStrategy": Object {
              "radioGroup": "grm--form--versioning-strategy--radio-group",
            },
          },
          "info": Object {
            "info": "grm--info",
            "infoCardPlus": "grm--info-card-plus",
          },
          "patch": Object {
            "body": "grm--patch-body",
            "error": "grm--patch-body--error",
            "loading": "grm--patch-body--loading",
            "notPrerelease": "grm--patch-body--not-prerelease--info",
          },
          "promoteRc": Object {
            "cta": "grm--promote-rc-body--cta",
            "mockedPromoteRcBody": "grm-mocked-promote-rc-body",
            "notRcWarning": "grm--promote-rc--not-rc-warning",
            "promoteRc": "grm--promote-rc",
          },
        },
      }
    `);
  });
});
