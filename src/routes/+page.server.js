import { error } from '@sveltejs/kit';
import { listAllApps } from '../lib/scalingo.js';

/**
 * @typedef {{
 *   uid: string;
 *   created_at: Date;
 *   text: string;
 *   done: boolean;
 *   pending_delete: boolean;
 * }} Todo
 */

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  // locals.userid comes from src/hooks.js
  const apps = await listAllApps();

  if (apps) {
    console.log(`nbApps = ${apps.length}`)
    return { apps };
  }

  throw error('Oups');
};
