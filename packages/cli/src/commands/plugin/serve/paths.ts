import { resolve as resolvePath } from 'path';
import { existsSync, realpathSync } from 'fs';

export function getPaths() {
  const appDir = realpathSync(process.cwd());

  const resolveApp = (path: string) => resolvePath(appDir, path);
  const resolveOwn = (path: string) => resolvePath(__dirname, '..', path);
  const resolveAppModule = (path: string) => {
    for (const ext of ['mjs', 'js', 'ts', 'tsx', 'jsx']) {
      const filePath = resolveApp(`${path}.${ext}`);
      if (existsSync(filePath)) {
        return filePath;
      }
    }
    return resolveApp(`${path}.js`);
  };

  let appHtml = resolveApp('dev/index.html');
  if (!existsSync(appHtml)) {
    appHtml = resolveOwn('../../templates/serve_index.html');
  }

  return {
    appHtml,
    appPath: resolveApp('.'),
    appAssets: resolveApp('assets'),
    appSrc: resolveApp('src'),
    appDev: resolveApp('dev'),
    appDevEntry: resolveAppModule('dev/index'),
    appTsConfig: resolveApp('tsconfig.json'),
    appNodeModules: resolveApp('node_modules'),
    appPackageJson: resolveApp('package.json'),
  };
}

export type Paths = ReturnType<typeof getPaths>;
