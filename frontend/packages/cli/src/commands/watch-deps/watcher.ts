import { resolve as resolvePath } from 'path';
import chokidar from 'chokidar';
import { Package } from './packages';

/*
 * Watch for changes inside a collection of packages. When a change is detected, stop
 * watching and call the callback with the package the change occured in.
 *
 * The returned promise is resolved once all watchers are ready.
 */
export async function startWatchers(
  packages: Package[],
  paths: string[],
  callback: (pkg: Package) => void,
): Promise<void> {
  const readyPromises = [];

  for (const pkg of packages) {
    let signalled = false;

    const watchLocations = paths.map(path => resolvePath(pkg.location, path));
    const watcher = chokidar
      .watch(watchLocations, {
        cwd: pkg.location,
        ignoreInitial: true,
        disableGlobbing: true,
      })
      .on('all', () => {
        if (!signalled) {
          signalled = true;
          callback(pkg);
        }
        watcher.close();
      });

    readyPromises.push(
      new Promise((resolve, reject) => {
        watcher.on('ready', resolve);
        watcher.on('error', reject);
      }),
    );
  }

  await Promise.all(readyPromises);
}
