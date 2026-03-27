/*
 * Copyright 2024 The Backstage Authors
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

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type TechDocsRedirectNotificationProps = {
  handleButtonClick: () => void;
  message: string;
  autoHideDuration: number;
};

export const TechDocsRedirectNotification = ({
  message,
  handleButtonClick,
  autoHideDuration,
}: TechDocsRedirectNotificationProps) => {
  const hasShown = useRef(false);

  useEffect(() => {
    if (hasShown.current) return;
    hasShown.current = true;

    toast(message, {
      duration: autoHideDuration,
      action: {
        label: 'Redirect now',
        onClick: () => {
          handleButtonClick();
        },
      },
    });
  }, [message, autoHideDuration, handleButtonClick]);

  return null;
};
