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

import { render, screen, act, waitFor } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import {
  alertApiRef,
  AlertApi,
  AlertMessage,
} from '@backstage/core-plugin-api';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';
import { ToastDisplay } from './ToastDisplay';
import { ToastApiForwarder } from '../../apis';

// Mock AlertApi with proper Observable implementation
class MockAlertApi implements AlertApi {
  private subscribers = new Set<
    ZenObservable.SubscriptionObserver<AlertMessage>
  >();

  post(alert: AlertMessage) {
    this.subscribers.forEach(subscriber => subscriber.next(alert));
  }

  alert$(): Observable<AlertMessage> {
    return new ObservableImpl<AlertMessage>(subscriber => {
      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }
}

describe('ToastDisplay', () => {
  let toastApi: ToastApiForwarder;
  let alertApi: MockAlertApi;

  beforeEach(() => {
    toastApi = new ToastApiForwarder();
    alertApi = new MockAlertApi();
  });

  const renderToastDisplay = () => {
    return render(
      <TestApiProvider
        apis={[
          [alertApiRef, alertApi],
          [toastApiRef, toastApi],
        ]}
      >
        <ToastDisplay />
      </TestApiProvider>,
    );
  };

  describe('ToastApi integration', () => {
    it('should display a toast when posted via ToastApi', async () => {
      renderToastDisplay();

      await act(async () => {
        toastApi.post({
          title: 'Test Toast Title',
          status: 'success',
        });
      });

      await expect(
        screen.findByText('Test Toast Title'),
      ).resolves.toBeInTheDocument();
    });

    it('should display toast with description', async () => {
      renderToastDisplay();

      await act(async () => {
        toastApi.post({
          title: 'Title',
          description: 'This is a description',
          status: 'info',
        });
      });

      await expect(screen.findByText('Title')).resolves.toBeInTheDocument();
      await expect(
        screen.findByText('This is a description'),
      ).resolves.toBeInTheDocument();
    });

    it('should display toast with links', async () => {
      renderToastDisplay();

      await act(async () => {
        toastApi.post({
          title: 'Toast with link',
          links: [{ label: 'Click here', href: '/test' }],
        });
      });

      const link = await screen.findByText('Click here');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });

    it('should display multiple toasts', async () => {
      renderToastDisplay();

      await act(async () => {
        toastApi.post({ title: 'Toast 1', status: 'success' });
        toastApi.post({ title: 'Toast 2', status: 'warning' });
        toastApi.post({ title: 'Toast 3', status: 'danger' });
      });

      await expect(screen.findByText('Toast 1')).resolves.toBeInTheDocument();
      await expect(screen.findByText('Toast 2')).resolves.toBeInTheDocument();
      await expect(screen.findByText('Toast 3')).resolves.toBeInTheDocument();
    });

    it('should allow programmatic dismiss via close()', async () => {
      renderToastDisplay();

      let toastKey: string;

      await act(async () => {
        toastKey = toastApi.post({
          title: 'Dismissable Toast',
          status: 'info',
        });
      });

      await expect(
        screen.findByText('Dismissable Toast'),
      ).resolves.toBeInTheDocument();

      await act(async () => {
        toastApi.close(toastKey!);
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 600));
      });

      await waitFor(() => {
        expect(screen.queryByText('Dismissable Toast')).not.toBeInTheDocument();
      });
    });
  });

  describe('AlertApi integration (legacy)', () => {
    it('should display alert as toast when posted via AlertApi', async () => {
      renderToastDisplay();

      await act(async () => {
        alertApi.post({
          message: 'Legacy Alert Message',
          severity: 'success',
        });
      });

      await expect(
        screen.findByText('Legacy Alert Message'),
      ).resolves.toBeInTheDocument();
    });

    it('should map alert error severity to danger status', async () => {
      renderToastDisplay();

      await act(async () => {
        alertApi.post({
          message: 'Error Alert',
          severity: 'error',
        });
      });

      const toast = await screen.findByText('Error Alert');
      expect(toast.closest('[data-status]')).toHaveAttribute(
        'data-status',
        'danger',
      );
    });

    it('should default to success status when no severity', async () => {
      renderToastDisplay();

      await act(async () => {
        alertApi.post({
          message: 'No Severity Alert',
        });
      });

      const toast = await screen.findByText('No Severity Alert');
      expect(toast.closest('[data-status]')).toHaveAttribute(
        'data-status',
        'success',
      );
    });
  });

  describe('concurrent usage', () => {
    it('should handle both ToastApi and AlertApi messages', async () => {
      renderToastDisplay();

      await act(async () => {
        toastApi.post({ title: 'New Toast', status: 'success' });
        alertApi.post({ message: 'Legacy Alert', severity: 'warning' });
      });

      await expect(screen.findByText('New Toast')).resolves.toBeInTheDocument();
      await expect(
        screen.findByText('Legacy Alert'),
      ).resolves.toBeInTheDocument();
    });
  });
});
