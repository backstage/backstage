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

import React, { ReactNode } from 'react';
import { grey } from '@material-ui/core/colors';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import ChatIcon from '@material-ui/icons/Chat';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import GitHubIcon from '@material-ui/icons/GitHub';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

interface DifferProps {
  next?: string | ReactNode;
  prev?: string;
  prefix?: string;
  icon?: 'tag' | 'branch' | 'github' | 'slack' | 'versioning';
}

const Icon = ({ icon }: { icon: DifferProps['icon'] }) => {
  switch (icon) {
    case 'tag':
      return (
        <LocalOfferIcon style={{ verticalAlign: 'middle' }} fontSize="small" />
      );

    case 'branch':
      return (
        <CallSplitIcon style={{ verticalAlign: 'middle' }} fontSize="small" />
      );

    case 'github':
      return (
        <GitHubIcon style={{ verticalAlign: 'middle' }} fontSize="small" />
      );

    case 'slack':
      return <ChatIcon style={{ verticalAlign: 'middle' }} fontSize="small" />;

    case 'versioning':
      return (
        <DynamicFeedIcon style={{ verticalAlign: 'middle' }} fontSize="small" />
      );

    default:
      return null;
  }
};

export const Differ = ({ prev, next, prefix, icon }: DifferProps) => {
  return (
    <>
      {icon && (
        <span>
          <Icon icon={icon} />{' '}
        </span>
      )}
      {prefix && <span>{prefix}: </span>}
      {prev && (
        <>
          <span style={{ color: grey[700] }}>{prev}</span>
          <span>{'  →  '}</span>
        </>
      )}
      <b>{next ?? 'None'}</b>
    </>
  );
};
