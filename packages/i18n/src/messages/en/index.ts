import type { Messages } from '../vi/index.js';
import { core } from './core.js';
import { explore } from './explore.js';
import { community } from './community.js';
import { connect } from './connect.js';
import { culture } from './culture.js';

/** Bản tiếng Anh – TypeScript bắt buộc đủ mọi key như bản tiếng Việt. */
export const en: Messages = { ...core, ...explore, ...community, ...connect, ...culture };
