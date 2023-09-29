import { afterEach, describe, expect, it, vi } from 'vitest';

import { create } from './utils/create.js';

describe('ServerCertificateCreator', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('Automatically generates a certificate', async () => {
    vi.stubEnv('WEBPACK_SERVE', 'true');

    const { readFileSync, mkdirSync, writeFileSync } = await import('node:fs');

    const { run: run1 } = await create(
      {},
      {
        commonName: 'example.com',
        options: {
          days: 1,
        },
      },
    );

    const { run: run2 } = await create(
      {},
      {
        commonName: 'example.com',
      },
    );

    await expect(run1()).resolves.toBeDefined();
    await expect(run2()).resolves.toBeDefined();

    expect(readFileSync).toHaveBeenCalledTimes(2);
    expect(mkdirSync).toHaveBeenCalledOnce();
    expect(writeFileSync).toHaveBeenCalledOnce();
  });

  it('Auto enabled when using webpack serve', async () => {
    vi.stubEnv('WEBPACK_SERVE', 'true');

    const { readFileSync, mkdirSync, writeFileSync } = await import('node:fs');

    const { run } = await create({}, {});

    await expect(run()).resolves.toBeDefined();

    expect(readFileSync).toHaveBeenCalled();
    expect(mkdirSync).toHaveBeenCalled();
    expect(writeFileSync).toHaveBeenCalled();
  });

  it('Can be disabled', async () => {
    vi.stubEnv('WEBPACK_SERVE', 'true');

    const { readFileSync, mkdirSync, writeFileSync } = await import('node:fs');

    const { run } = await create(
      {
        context: undefined as unknown as string,
      },
      {
        enabled: false,
      },
    );

    await expect(run()).resolves.toBeDefined();

    expect(readFileSync).not.toHaveBeenCalled();
    expect(mkdirSync).not.toHaveBeenCalled();
    expect(writeFileSync).not.toHaveBeenCalled();
  });
});
