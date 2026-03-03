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
import { PropsWithChildren, ReactElement } from 'react';

import { MarkdownContent, cn } from '@backstage/core-components';

/**
 * Tailwind classes replacing the former MUI makeStyles markdownDescription:
 * - text-xs: caption-size font (~0.75rem / 12px)
 * - text-muted-foreground: secondary text color via --muted-foreground token
 * - [&>:first-child]:mt-[3px]: preserves the 3px top margin on first child for browser consistency
 * - [&>:first-child]:mb-0: zeroes bottom margin on first child
 * - [&>p]:m-0: zeroes paragraph margins
 */
const markdownDescriptionClasses =
  'text-xs text-muted-foreground [&>:first-child]:mt-[3px] [&>:first-child]:mb-0 [&>p]:m-0';

/**
 * Props for the {@link ScaffolderField} component
 * @alpha
 */
export interface ScaffolderFieldProps {
  rawDescription?: string;
  errors?: ReactElement;
  rawErrors?: string[];
  help?: ReactElement;
  rawHelp?: string;
  required?: boolean;
  disabled?: boolean;
  displayLabel?: boolean;
}

/**
 * A component to wrap up a input field which helps with formatting and supporting markdown
 * on the field types
 * @alpha
 */
export const ScaffolderField = (
  props: PropsWithChildren<ScaffolderFieldProps>,
) => {
  const {
    children,
    displayLabel = true,
    rawErrors = [],
    errors,
    help,
    rawDescription,
    required: _required,
    disabled,
  } = props;

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 w-full',
        rawErrors.length > 0 && 'text-destructive',
        disabled && 'opacity-50 pointer-events-none',
      )}
      role="group"
      aria-invalid={rawErrors.length > 0 || undefined}
      aria-disabled={disabled || undefined}
    >
      {children}
      {displayLabel && rawDescription ? (
        <MarkdownContent
          content={rawDescription}
          linkTarget="_blank"
          className={markdownDescriptionClasses}
        />
      ) : null}
      {errors}
      {help}
    </div>
  );
};
