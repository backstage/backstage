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
import { ButtonIcon, Tooltip, TooltipTrigger } from '@backstage/ui';
import CopyIcon from '@material-ui/icons/FileCopy';
import { useEffect, useRef, useState } from 'react';
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  const handleCopyClick = () => {
    // Clear any existing timeout to reset the timer on repeated clicks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setOpen(true);
    copyToClipboard(text);

    // Set new timeout to close tooltip
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, tooltipDelay);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <TooltipTrigger isOpen={open}>
      <ButtonIcon
        icon={<CopyIcon />}
        onPress={handleCopyClick}
        aria-label={ariaLabel}
      />
      <Tooltip>{tooltipText}</Tooltip>
    </TooltipTrigger>
  );
}
