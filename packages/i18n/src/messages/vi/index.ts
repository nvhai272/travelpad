import { core } from './core.js';
import { explore } from './explore.js';
import { community } from './community.js';
import { connect } from './connect.js';
import { culture } from './culture.js';

/** Bản tiếng Việt – nguồn chuẩn; kiểu `Messages` suy ra từ đây. */
export const vi = { ...core, ...explore, ...community, ...connect, ...culture };
export type Messages = typeof vi;
