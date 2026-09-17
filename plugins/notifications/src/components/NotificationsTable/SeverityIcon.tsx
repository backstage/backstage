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
import { NotificationSeverity } from '@backstage/plugin-notifications-common';
import {
  RiCheckLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiInformationLine,
} from '@remixicon/react';
import styles from './SeverityIcon.module.css';

export const SeverityIcon = ({
  severity,
  className,
  style,
}: {
  severity?: NotificationSeverity;
  className?: string;
  style?: React.CSSProperties;
}) => {
  switch (severity) {
    case 'critical':
      return (
        <RiErrorWarningLine
          size={20}
          className={[styles.critical, className].filter(Boolean).join(' ')}
          style={style}
        />
      );
    case 'high':
      return (
        <RiAlertLine
          size={20}
          className={[styles.high, className].filter(Boolean).join(' ')}
          style={style}
        />
      );
    case 'low':
      return (
        <RiInformationLine
          size={20}
          className={[styles.low, className].filter(Boolean).join(' ')}
          style={style}
        />
      );
    case 'normal':
    default:
      return (
        <RiCheckLine
          size={20}
          className={[styles.normal, className].filter(Boolean).join(' ')}
          style={style}
        />
      );
  }
};
