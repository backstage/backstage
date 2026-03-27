/*
 * Copyright 2023 The Backstage Authors
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

import classNames from 'classnames';
import {
  MinusCircle,
  Circle,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

/** Props for the step icon component, replacing MUI StepIconProps. */
interface StepIconComponentProps {
  active?: boolean;
  completed?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
}

export const StepIcon = (
  props: StepIconComponentProps & { skipped: boolean },
) => {
  const { active, completed, error, skipped } = props;

  const getMiddle = () => {
    if (active) {
      return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    }
    if (completed) {
      return <CheckCircle2 className="h-5 w-5" />;
    }
    if (error) {
      return <AlertCircle className="h-5 w-5" />;
    }
    if (skipped) {
      return <MinusCircle className="h-5 w-5" />;
    }
    return <Circle className="h-5 w-5" />;
  };

  return (
    <div
      className={classNames('text-muted-foreground', {
        'text-green-600 dark:text-green-400': completed,
        'text-destructive': error,
      })}
    >
      {getMiddle()}
    </div>
  );
};
