import { resolve } from 'node:path';

import { getCertificate } from './utils.js';

import type { ServerCertificateCreatorContext, ServerCertificateCreatorOptions } from './types.js';
import type { Compiler, WebpackPluginInstance } from 'webpack';

export const PLUGIN_NAME = 'server-certificate-creator';

export class WebpackServeCertificateCreator implements WebpackPluginInstance {
  constructor(private readonly options: Partial<ServerCertificateCreatorOptions> = {}) {}

  get defaultOptions(): ServerCertificateCreatorOptions {
    return {
      enabled: process.env.WEBPACK_SERVE === 'true',
      // This dir should be added to .gitignore
      outDir: '.certificate-cache',
      commonName: 'localhost',
      options: {
        days: 30,
        keySize: 2048,
      },
    };
  }

  apply(compiler: Compiler): void {
    const infraLogger = compiler.getInfrastructureLogger(PLUGIN_NAME);

    const baseDir = compiler.options.context ?? './';

    const options: ServerCertificateCreatorOptions = {
      ...this.defaultOptions,
      ...this.options,
      options: {
        ...this.defaultOptions.options,
        ...this.options.options,
      },
    };

    if (!options.enabled) {
      infraLogger.debug(`Not enabled`);

      return;
    }

    const cacheDirectory = resolve(baseDir, options.outDir);

    const dataPath = resolve(cacheDirectory, `${options.commonName}.json`);

    const context: ServerCertificateCreatorContext = {
      cacheDirectory,
      dataPath,
      logger: infraLogger,
    };

    const certificate = getCertificate(options, context);

    compiler.options.devServer ??= {};
    compiler.options.devServer.server ??= {};
    compiler.options.devServer.server.options ??= {};
    compiler.options.devServer.server.type = 'https';

    compiler.options.devServer.server.options = {
      ...compiler.options.devServer.server.options,
      cert: certificate.cert,
      key: certificate.private,
    };
  }
}
