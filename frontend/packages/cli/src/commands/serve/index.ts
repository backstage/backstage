import webpack from 'webpack';
import chalk from 'chalk';
import WebpackDevServer from 'webpack-dev-server';
import { getPaths } from './paths';
import { createConfig } from './config';

function startDevServer(options: { host?: string; port?: number }) {
  const host = options.host ?? process.env.HOST ?? '0.0.0.0';
  const port = options.port ?? (parseInt(process.env.PORT ?? '', 10) || 3000);

  const paths = getPaths();
  const config = createConfig(paths);
  const compiler = webpack(config);
  const server = new WebpackDevServer(compiler, {
    hot: true,
    publicPath: '/',
    quiet: true,
    host,
    port,
  });

  server.listen(port, host, (err?: Error) => {
    if (err) {
      console.error(chalk.red(err.message));
      process.exit(1);
    }
  });
}

export default () => {
  try {
    startDevServer({});
  } catch (error) {
    console.error(chalk.red(error.message));
    process.exit(1);
  }
};
