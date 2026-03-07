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

import { ReactNode } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';
import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MarkdownContent } from '../MarkdownContent';

/**
 * Severity-specific Tailwind CSS class mappings for the WarningPanel.
 * Uses CSS custom property tokens for consistent theming in light and dark modes.
 * The `/10` opacity modifier produces the light background effect that replaces
 * the original MUI `lighten(palette.light, 0.9)` pattern.
 */
const severityStyles = {
  warning: {
    container: 'border-warning bg-warning/10 text-warning-foreground',
    icon: 'text-warning-foreground',
    title: 'text-warning-foreground font-bold',
    message: 'text-warning-foreground bg-warning/10',
  },
  error: {
    container: 'border-destructive bg-destructive/10 text-foreground',
    icon: 'text-destructive',
    title: 'text-foreground font-bold',
    message: 'text-foreground bg-destructive/10',
  },
  info: {
    container: 'border-info bg-info/10 text-info-foreground',
    icon: 'text-info-foreground',
    title: 'text-info-foreground font-bold',
    message: 'text-info-foreground bg-info/10',
  },
} as const;

/**
 * Backward-compatible class key type for the WarningPanel component.
 * Retained for consumers using the overridableComponents.ts theming system.
 * @public
 */
export type WarningPanelClassKey =
  | 'panel'
  | 'summary'
  | 'summaryText'
  | 'message'
  | 'details';

export type WarningProps = {
  title?: string;
  severity?: 'warning' | 'error' | 'info';
  titleFormat?: string;
  message?: ReactNode;
  defaultExpanded?: boolean;
  children?: ReactNode;
};

const capitalize = (s: string) => {
  return s.charAt(0).toLocaleUpperCase('en-US') + s.slice(1);
};

/**
 * Show a user friendly error message to a user similar to
 * ErrorPanel except that the warning panel only shows the warning message to
 * the user.
 *
 * @param severity - Ability to change the severity of the alert. Default value
 *        "warning"
 * @param title - A title for the warning. If not supplied, "Warning" will be
 *        used.
 * @param message - Optional more detailed user-friendly message elaborating on
 *        the cause of the error.
 * @param children - Objects to provide context, such as a stack trace or detailed
 *        error reporting. Will be available inside an unfolded accordion.
 */
export function WarningPanel(props: WarningProps) {
  const {
    severity = 'warning',
    title,
    titleFormat,
    message,
    children,
    defaultExpanded,
  } = props;

  const styles = severityStyles[severity];

  // If no severity or title provided, the heading will read simply "Warning"
  const subTitle = capitalize(severity) + (title ? `: ${title}` : '');

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultExpanded ? 'warning-item' : undefined}
      className={cn('rounded-md border', styles.container)}
      role="alert"
    >
      <AccordionItem value="warning-item" className="border-b-0">
        <AccordionTrigger
          className={cn(
            'flex flex-row items-center gap-2 px-4 py-3 hover:no-underline',
            styles.title,
          )}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className={cn('h-5 w-5 shrink-0', styles.icon)} />
            <span className="text-sm font-bold">
              {titleFormat === 'markdown' ? (
                <MarkdownContent
                  content={subTitle}
                  className="break-words [&_p]:inline"
                />
              ) : (
                subTitle
              )}
            </span>
          </div>
        </AccordionTrigger>
        {(message || children) && (
          <AccordionContent forceMount className="px-4 pb-4">
            <div className="flex flex-col gap-2">
              {message && (
                <div className={cn('w-full text-sm', styles.message)}>
                  {message}
                </div>
              )}
              {children && (
                <div className="w-full rounded border border-border bg-background p-4 font-sans text-sm text-foreground">
                  {children}
                </div>
              )}
            </div>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
}
