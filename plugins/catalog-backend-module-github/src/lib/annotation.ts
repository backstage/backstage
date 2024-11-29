/*
 * Copyright 2020 The Backstage Authors
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

/**
 * The value of this annotation is the so-called login that identifies a user on
 * [GitHub](https://github.com) (either the public one, or a private GitHub
 * Enterprise installation) that is related to this entity. It is on the format
 * `<username>`, and is the same as can be seen in the URL location bar of the
 * browser when viewing that user.
 *
 * @public
 */
export const ANNOTATION_GITHUB_USER_LOGIN = 'github.com/user-login';

/**
 * The value of this annotation is the so-called slug that identifies a team on
 * [GitHub](https://github.com) (either the public one, or a private GitHub
 * Enterprise installation) that is related to this entity. It is on the format
 * `<organization>/<team>`, and is the same as can be seen in the URL location
 * bar of the browser when viewing that team.
 *
 * @public
 */
export const ANNOTATION_GITHUB_TEAM_SLUG = 'github.com/team-slug';
