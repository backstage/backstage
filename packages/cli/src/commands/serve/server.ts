import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import openBrowser from 'react-dev-utils/openBrowser';
import { choosePort, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import { getPaths } from './paths';
import { createConfig } from './config';

export async function startDevServer() {
  const host = process.env.HOST ?? '0.0.0.0';
  const defaultPort = parseInt(process.env.PORT ?? '', 10) || 3000;

  const port = await choosePort(host, defaultPort);
  if (!port) {
    return;
  }

  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
  const urls = prepareUrls(protocol, host, port);

  const paths = getPaths();
  const config = createConfig(paths);
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, {
    hot: true,
    publicPath: '/',
    quiet: true,
    https: protocol === 'https',
    host,
    port,
  });

  await new Promise((resolve, reject) => {
    server.listen(port, host, (err?: Error) => {
      if (err) {
        reject(err);
        return;
      }

      openBrowser(urls.localUrlForBrowser);
      resolve();
    });
  });
}
