import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCertificate, getCertificate } from '../src/utils.js';

import { createNoOpLogger } from './utils/createNoOpLogger.js';

afterEach(() => {
  vi.clearAllMocks();
});

describe('createCertificate()', () => {
  it('Creates a certificate', () => {
    expect(
      createCertificate({
        commonName: 'example.com',
      }),
    ).toEqual(
      expect.objectContaining({
        cert: expect.any(String),
        fingerprint: expect.any(String),
        private: expect.any(String),
        public: expect.any(String),
      }),
    );
  });
});

describe('getCertificate()', () => {
  it('Gets a certificate', async () => {
    const { readFileSync, mkdirSync, writeFileSync } = await import('node:fs');

    const logger = createNoOpLogger();

    const getCert = (): ReturnType<typeof getCertificate> =>
      getCertificate(
        {
          enabled: true,
          outDir: '.tmp',
          commonName: 'example.com',
          options: {
            days: 1,
          },
        },
        {
          cacheDirectory: '/tmp/.tmp',
          dataPath: '/tmp/.tmp/example.com.json',
          logger,
        },
      );

    const firstResponse = getCert();
    const secondResponse = getCert();

    expect(firstResponse).toEqual(
      expect.objectContaining({
        cert: expect.any(String),
        fingerprint: expect.any(String),
        private: expect.any(String),
        public: expect.any(String),
      }),
    );

    expect(secondResponse).toEqual(firstResponse);

    expect(readFileSync).toHaveBeenCalledTimes(2);
    expect(mkdirSync).toHaveBeenCalledOnce();
    expect(writeFileSync).toHaveBeenCalledOnce();
  });
});
