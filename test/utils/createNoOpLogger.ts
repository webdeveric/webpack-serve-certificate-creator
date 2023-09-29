import { Console } from 'node:console';
import { PassThrough } from 'node:stream';

import type { ServerCertificateCreatorContext } from '../../src/types.js';

type Logger = ServerCertificateCreatorContext['logger'];

export const createNoOpLogger = (): Logger =>
  new Console({
    stdout: new PassThrough(),
    stderr: new PassThrough(),
  }) as unknown as Logger;
