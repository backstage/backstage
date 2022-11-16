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
import { BackstageTheme } from '@backstage/theme';
import Box from '@material-ui/core/Box';
import LinearProgress, {
  LinearProgressProps,
} from '@material-ui/core/LinearProgress';
import { useTheme } from '@material-ui/core/styles';
import React, { PropsWithChildren, useEffect, useState } from 'react';

export function Progress(props: PropsWithChildren<LinearProgressProps>) {
  const theme = useTheme<BackstageTheme>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handle = setTimeout(
      () => setIsVisible(true),
      theme.transitions.duration.short,
    );
    return () => clearTimeout(handle);
  }, [theme.transitions.duration.short]);

  return isVisible ? (
    <LinearProgress {...props} data-testid="progress" />
  ) : (
    <Box display="none" />
  );
}
