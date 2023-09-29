import assert from 'node:assert';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { generate, type GenerateResult, type SelfsignedOptions } from 'selfsigned';

import type {
  CreateCertificateOptions,
  CreateCertificateResults,
  ServerCertificateCreatorOptions,
  ServerCertificateCreatorContext,
} from './types.js';

export function createCertificate(options: CreateCertificateOptions): CreateCertificateResults {
  const selfSignedOptions: SelfsignedOptions = {
    ...options.options,
    days: options.options?.days || 30,
    keySize: options.options?.keySize || 2048,
  };

  return generate(
    [
      {
        name: 'commonName',
        value: options.commonName,
      },
    ],
    selfSignedOptions,
  );
}

export function getCertificate(
  options: ServerCertificateCreatorOptions,
  context: ServerCertificateCreatorContext,
): GenerateResult {
  try {
    const data = readFileSync(context.dataPath, 'utf-8');

    assert(data, `${context.dataPath} does not exist or is empty`);

    context.logger.debug(`Certificate data loaded from ${context.dataPath}`);

    return JSON.parse(data);
  } catch (error) {
    context.logger.debug(error);

    mkdirSync(context.cacheDirectory, { recursive: true });

    context.logger.debug(`Certificate cache directory created: ${context.cacheDirectory}`);

    const certificate = createCertificate(options);

    writeFileSync(context.dataPath, JSON.stringify(certificate));

    context.logger.debug(`Certificate data written to ${context.dataPath}`);

    return certificate;
  }
}
