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

import SettingsInputCompositeIcon from '@material-ui/icons/SettingsInputComposite';
import SubjectIcon from '@material-ui/icons/Subject';
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';
import BusinessIcon from '@material-ui/icons/Business';
import SettingsInputHdmiIcon from '@material-ui/icons/SettingsInputHdmi';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import CallSplitIcon from '@material-ui/icons/CallSplit';

export function ApiCoreIcon() {
  return <CenterFocusStrongIcon />;
}
export function ApiPluginIcon() {
  return <SettingsInputCompositeIcon />;
}
export function ApiInternalIcon() {
  return <BusinessIcon />;
}
export function ApiOtherIcon() {
  return <SubjectIcon />;
}

export function PluginIcon() {
  return <SettingsInputHdmiIcon />;
}

export function DependenciesIcon() {
  return <MergeTypeIcon />;
}
export function DependentsIcon() {
  return <CallSplitIcon />;
}
