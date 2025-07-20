import assert from 'node:assert';
import path from 'node:path';

import { createFsFromVolume, Volume } from 'memfs';
import { type Compiler, type Configuration, webpack } from 'webpack';

export function makeCompiler(config: Configuration): Compiler {
  const compiler = webpack({
    mode: 'development',
    ...config,
    infrastructureLogging: {
      level: 'none',
      debug: false,
      ...config.infrastructureLogging,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compiler.outputFileSystem = createFsFromVolume(new Volume()) as any;

  assert(compiler.outputFileSystem, 'outputFileSystem is not defined');

  compiler.outputFileSystem.join = path.join.bind(path);

  return compiler;
}
