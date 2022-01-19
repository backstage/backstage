import { getRelease } from './manifest';

describe('Get Packages', () => {
  it('should return a list of packages in a release', async () => {
    const pkgs = await getRelease('1.0.0');
    console.log(pkgs);
    expect(pkgs.size).toBe(2);
  });
});
