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

import { MockAlertApi } from './MockAlertApi';

describe('MockAlertApi', () => {
  it('should collect alerts', () => {
    const api = new MockAlertApi();

    api.post({ message: 'Test alert 1' });
    api.post({ message: 'Test alert 2', severity: 'error' });
    api.post({
      message: 'Test alert 3',
      severity: 'warning',
      display: 'permanent',
    });

    expect(api.getAlerts()).toHaveLength(3);
    expect(api.getAlerts()[0]).toMatchObject({ message: 'Test alert 1' });
    expect(api.getAlerts()[1]).toMatchObject({
      message: 'Test alert 2',
      severity: 'error',
    });
    expect(api.getAlerts()[2]).toMatchObject({
      message: 'Test alert 3',
      severity: 'warning',
      display: 'permanent',
    });
  });

  it('should emit alerts to observable', done => {
    const api = new MockAlertApi();
    const alerts: string[] = [];

    api.alert$().subscribe({
      next: alert => {
        alerts.push(alert.message);
        if (alerts.length === 2) {
          expect(alerts).toEqual(['First', 'Second']);
          done();
        }
      },
    });

    api.post({ message: 'First' });
    api.post({ message: 'Second' });
  });

  it('should wait for specific alert', async () => {
    const api = new MockAlertApi();

    setTimeout(() => {
      api.post({ message: 'Wrong alert' });
      api.post({ message: 'Right alert', severity: 'error' });
    }, 10);

    const alert = await api.waitForAlert(
      a => a.message === 'Right alert',
      1000,
    );

    expect(alert).toMatchObject({
      message: 'Right alert',
      severity: 'error',
    });
  });

  it('should timeout if alert is not found', async () => {
    const api = new MockAlertApi();

    await expect(
      api.waitForAlert(a => a.message === 'Never posted', 100),
    ).rejects.toThrow('Timed out waiting for alert');
  });

  it('should resolve immediately if alert already exists', async () => {
    const api = new MockAlertApi();

    api.post({ message: 'Already posted' });

    const alert = await api.waitForAlert(
      a => a.message === 'Already posted',
      1000,
    );

    expect(alert).toMatchObject({ message: 'Already posted' });
  });
});
