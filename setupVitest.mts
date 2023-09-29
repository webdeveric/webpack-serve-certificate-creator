import { vi } from 'vitest';

import type { fs as memFs } from 'memfs';

vi.mock('node:fs', async () => {
  const memfs: { fs: typeof memFs } = await vi.importActual('memfs');

  const newFs = {
    ...memfs.fs,
    mkdirSync: vi.fn(memfs.fs.mkdirSync.bind(memfs.fs)),
    readFileSync: vi.fn(memfs.fs.readFileSync.bind(memfs.fs)),
    writeFileSync: vi.fn(memfs.fs.writeFileSync.bind(memfs.fs)),
  };

  return {
    ...newFs,
    default: newFs,
  };
});
