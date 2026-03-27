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

import { ReactNode, useMemo } from 'react';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import useObservable from 'react-use/esm/useObservable';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Alert } from '../ui/alert';
import { Button } from '../ui/button';

/** @public */
export type DismissableBannerClassKey =
  | 'root'
  | 'topPosition'
  | 'icon'
  | 'content'
  | 'message'
  | 'info'
  | 'error';

/**
 * @public
 * @deprecated This type contained a typo, please use DismissableBannerClassKey instead
 */
export type DismissbleBannerClassKey = DismissableBannerClassKey;

export type Props = {
  variant: 'info' | 'error' | 'warning';
  message: ReactNode;
  id: string;
  fixed?: boolean;
};

/** @public */
export const DismissableBanner = (props: Props) => {
  const { variant, message, id, fixed = false } = props;
  const storageApi = useApi(storageApiRef);
  const notificationsStore = storageApi.forBucket('notifications');
  const observedItems = useObservable(
    notificationsStore.observe$<string[]>('dismissedBanners'),
    notificationsStore.snapshot<string[]>('dismissedBanners'),
  );

  const dismissedBanners = useMemo(
    () => new Set(observedItems.value ?? []),
    [observedItems.value],
  );

  const loadingSettings = observedItems.presence === 'unknown';

  const handleClick = () => {
    notificationsStore.set('dismissedBanners', [...dismissedBanners, id]);
  };

  // Map component variant to shadcn Alert variant — 'error' maps to 'destructive',
  // while 'info' and 'warning' have direct matches in the Alert variant system
  const alertVariant = variant === 'error' ? 'destructive' : variant;

  // Don't render if settings are still loading or the banner has been dismissed
  if (loadingSettings || dismissedBanners.has(id)) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex w-full flex-row flex-nowrap p-0',
        !fixed && 'relative mb-6 -mt-3 z-auto',
        fixed && 'fixed bottom-0 left-1/2 -translate-x-1/2 z-50',
      )}
    >
      <Alert
        variant={alertVariant}
        className={cn(
          'w-full max-w-none flex-nowrap',
          'flex items-center justify-between',
          '[&>a]:text-[var(--banner-link,inherit)]',
        )}
      >
        <div className="flex items-center [&>a]:text-inherit">{message}</div>
        <Button
          variant="ghost"
          size="icon"
          title="Permanently dismiss this message"
          onClick={handleClick}
          className="shrink-0 text-current hover:text-current/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
};
