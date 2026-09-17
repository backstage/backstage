/*
 * Copyright 2025 The Backstage Authors
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

import { useEffect, useState, JSX } from 'react';
import { AppTheme } from '@backstage/core-plugin-api';
import { Theme, useTheme } from '@mui/material/styles';

export function MuiThemeExtractor(props: {
  appTheme: AppTheme;
  children: (theme: Theme) => JSX.Element;
}): JSX.Element {
  const { appTheme, children } = props;
  const [theme, setTheme] = useState<Theme | null>(null);
  const { Provider } = appTheme;
  if (theme) {
    return children(theme);
  }

  return (
    <Provider>
      <MuiThemeExtractorInner setTheme={setTheme} />
    </Provider>
  );
}

function MuiThemeExtractorInner({
  setTheme,
}: {
  setTheme: (theme: Theme) => void;
}) {
  const theme = useTheme();
  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);
  return null;
}
