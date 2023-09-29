import type { GenerateResult, SelfsignedOptions } from 'selfsigned';
import type { Compiler } from 'webpack';

export type CreateCertificateOptions = {
  commonName: string;
  options?: SelfsignedOptions;
};

export type CreateCertificateResults = GenerateResult;

export type ServerCertificateCreatorOptions = {
  enabled: boolean;
  outDir: string;
} & CreateCertificateOptions;

export type ServerCertificateCreatorContext = {
  cacheDirectory: string;
  dataPath: string;
  logger: ReturnType<Compiler['getInfrastructureLogger']>;
};
