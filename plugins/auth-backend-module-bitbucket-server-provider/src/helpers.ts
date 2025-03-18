/*
 * Copyright 2024 The Backstage Authors
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

import { PassportProfile } from '@backstage/plugin-auth-node';

export async function fetchProfile(options: {
  host: string;
  accessToken: string;
}): Promise<PassportProfile> {
  const { host, accessToken } = options;
  // Get current user name
  let whoAmIResponse;
  try {
    whoAmIResponse = await fetch(
      `https://${host}/plugins/servlet/applinks/whoami`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (e) {
    throw new Error(`Failed to retrieve the username of the logged in user`);
  }

  // A response.ok check here would be worthless as the Bitbucket API always returns 200 OK for this call
  const username = whoAmIResponse.headers.get('X-Ausername');
  if (!username) {
    throw new Error(`Failed to retrieve the username of the logged in user`);
  }

  let userResponse;
  try {
    userResponse = await fetch(
      `https://${host}/rest/api/latest/users/${username}?avatarSize=256`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (e) {
    throw new Error(`Failed to retrieve the user '${username}'`);
  }

  if (!userResponse.ok) {
    throw new Error(`Failed to retrieve the user '${username}'`);
  }

  const user = await userResponse.json();

  const passportProfile = {
    provider: 'bitbucketServer',
    id: user.id.toString(),
    displayName: user.displayName,
    username: user.name,
    emails: [
      {
        value: user.emailAddress,
      },
    ],
  } as PassportProfile;

  if (user.avatarUrl) {
    passportProfile.photos = [{ value: `https://${host}${user.avatarUrl}` }];
  }

  return passportProfile;
}
