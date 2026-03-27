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

import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { Button } from '../ui/button';
import {
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../ui/tooltip';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MouseEventHandler, useEffect, useState } from 'react';
import useCopyToClipboard from 'react-use/esm/useCopyToClipboard';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/**
 * Properties for {@link CopyTextButton}
 *
 * @public
 */
export interface CopyTextButtonProps {
  /**
   * The text to be copied
   */
  text: string;
  /**
   * Number of milliseconds that the tooltip is shown
   *
   * @remarks
   *
   * Default: 1000
   */
  tooltipDelay?: number;
  /**
   * Text to show in the tooltip when user has clicked the button
   *
   * @remarks
   *
   * Default: "Text copied to clipboard"
   */
  tooltipText?: string;

  /**
   * Text to use as aria-label prop on the button
   *
   * @remarks
   *
   * Default: "Copy text"
   */
  'aria-label'?: string;
}

/**
 * Copy text button with visual feedback
 *
 * @public
 * @remarks
 *
 * Visual feedback takes form of:
 *  - a hover color
 *  - click ripple
 *  - Tooltip shown when user has clicked
 *
 * @example
 *
 * ```
 * <CopyTextButton
 *   text="My text that I want to be copied to the clipboard"
 *   arial-label="Accessible label for this button" />
 * ```
 */
export function CopyTextButton(props: CopyTextButtonProps) {
  const { t } = useTranslationRef(coreComponentsTranslationRef);
  const {
    text,
    tooltipDelay = 1000,
    tooltipText = t('copyTextButton.tooltipText'),
    'aria-label': ariaLabel = 'Copy text',
  } = props;
  const errorApi = useApi(errorApiRef);
  const [open, setOpen] = useState(false);
  const [{ error }, copyToClipboard] = useCopyToClipboard();

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  const handleCopyClick: MouseEventHandler = e => {
    e.stopPropagation();
    setOpen(true);
    copyToClipboard(text);
    setTimeout(() => {
      setOpen(false);
    }, tooltipDelay);
  };

  return (
    <TooltipProvider>
      <ShadcnTooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyClick}
            aria-label={ariaLabel}
            className={cn('h-8 w-8')}
          >
            {open ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{tooltipText}</p>
        </TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}
