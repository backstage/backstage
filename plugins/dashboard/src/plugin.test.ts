import { dashboardPlugin } from './plugin';

describe('dashboard', () => {
  it('should export plugin', () => {
    expect(dashboardPlugin).toBeDefined();
  });
});
