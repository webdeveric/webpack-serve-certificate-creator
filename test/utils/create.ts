import { makeCompiler } from './makeCompiler.js';

import type { WebpackServeCertificateCreator } from '../../src/plugin.js';
import type { ServerCertificateCreatorOptions } from '../../src/types.js';
import type { Compiler, Configuration, Stats } from 'webpack';

export async function create(
  config: Configuration,
  pluginOptions: Partial<ServerCertificateCreatorOptions>,
): Promise<{
  compiler: Compiler;
  plugin: WebpackServeCertificateCreator;
  run: () => Promise<Stats | undefined>;
}> {
  const { WebpackServeCertificateCreator } = await import('../../src/plugin.js');

  const plugin = new WebpackServeCertificateCreator(pluginOptions);

  config.plugins ??= [];
  config.plugins.push(plugin);

  const compiler = makeCompiler(config);

  const run = (): Promise<Stats | undefined> =>
    new Promise((resolve, reject) => {
      compiler.run((err, stats) => (err ? reject(err) : resolve(stats)));
    });

  return { compiler, plugin, run };
}
