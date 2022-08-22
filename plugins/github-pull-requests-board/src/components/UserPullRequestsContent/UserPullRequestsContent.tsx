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
import React from 'react';
import PullRequestsContent from '../PullRequestsContent/PullRequestsContent';
import { useUserRepositories } from '../../hooks/useUserRepositories';
import { useIdentity } from '../../hooks/useIdentity';
import { BackstageUserIdentity } from '@backstage/core-plugin-api';

const UserPullRequestsContentWrapper = ({
  identity,
  allowedKinds,
}: {
  identity: BackstageUserIdentity;
  allowedKinds?: string[];
}) => {
  const { repositories } = useUserRepositories(identity, allowedKinds);
  return <PullRequestsContent repositories={repositories} />;
};

const UserPullRequestsContent = ({
  allowedKinds,
}: {
  allowedKinds?: string[];
}) => {
  const { identity } = useIdentity();
  return (
    <div>
      {' '}
      {identity && (
        <UserPullRequestsContentWrapper
          identity={identity}
          allowedKinds={allowedKinds}
        />
      )}
    </div>
  );
};

export default UserPullRequestsContent;
