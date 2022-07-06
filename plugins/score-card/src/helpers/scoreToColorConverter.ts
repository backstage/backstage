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
import { createTheme } from '@material-ui/core/styles';
import { ScoreSuccessEnum } from '../api';

export const scoreToColorConverter = (
  scoreSuccess: ScoreSuccessEnum | undefined,
): string => {
  const theme = createTheme();
  if (typeof scoreSuccess === 'undefined') {
    return theme.palette.grey[500];
  }
  switch (scoreSuccess) {
    // see palette https://coolors.co/72af50-acbf8c-e2e8b3-ffc055-eb6f35
    case ScoreSuccessEnum.Success:
      return 'rgb(114, 175, 80)';
    case ScoreSuccessEnum.AlmostSuccess:
      return 'rgb(172, 191, 140)';
    case ScoreSuccessEnum.Partial:
      return 'rgb(226, 232, 179)';
    case ScoreSuccessEnum.AlmostFailure:
      return 'rgb(255, 192, 85)';
    case ScoreSuccessEnum.Failure:
      return 'rgb(235, 111, 53)';
    default:
      return theme.palette.grey[500];
  }
};
