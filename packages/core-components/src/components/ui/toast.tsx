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

import { type ComponentProps } from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';

/**
 * Props for the {@link Toaster} component.
 *
 * @remarks
 * Derived from the Sonner Toaster component props, enabling full customization
 * of toast positioning, theming, duration, and behavior. The Backstage Toaster
 * component pre-applies CSS custom property–based class names so that toast
 * notifications respect the active Backstage light/dark theme.
 *
 * @public
 */
type ToasterProps = ComponentProps<typeof SonnerToaster>;

/**
 * Backstage-themed toast notification container.
 *
 * @remarks
 * Wraps the Sonner {@link https://sonner.emilkowal.dev/ | Toaster} component
 * with Backstage design-system tokens applied through Tailwind CSS utility
 * classes that resolve to CSS custom properties. This ensures toast
 * notifications match the active Backstage theme (light or dark) without
 * hardcoded color values.
 *
 * Place a single `<Toaster />` instance at the application root (typically
 * inside the root layout or App shell). Then use the imperative `toast()`
 * function anywhere in the component tree to trigger notifications.
 *
 * @example
 * ```tsx
 * // In your App root layout:
 * import { Toaster } from './components/ui/toast';
 * function RootLayout({ children }) {
 *   return (
 *     <>
 *       {children}
 *       <Toaster />
 *     </>
 *   );
 * }
 *
 * // Anywhere in a component:
 * import { toast } from './components/ui/toast';
 * toast.success('Entity created successfully');
 * toast.error('Failed to fetch catalog data');
 * toast.warning('Deprecation notice');
 * toast.info('New version available');
 * toast.loading('Processing template…');
 * toast.promise(fetchEntity(), {
 *   loading: 'Loading entity…',
 *   success: 'Entity loaded',
 *   error: 'Failed to load entity',
 * });
 * toast.dismiss();
 * ```
 *
 * @public
 */
function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      data-slot="sonner-toaster"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          error:
            'group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground group-[.toaster]:border-destructive',
          success:
            'group-[.toaster]:bg-success group-[.toaster]:text-success-foreground group-[.toaster]:border-success',
          warning:
            'group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-warning',
          info: 'group-[.toaster]:bg-info group-[.toaster]:text-info-foreground group-[.toaster]:border-info',
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
export type { ToasterProps };
