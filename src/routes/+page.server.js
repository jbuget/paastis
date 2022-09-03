import { error } from '@sveltejs/kit'
import { listAllApps } from '../lib/scalingo.js'
import { listAllPlatforms } from '../lib/database.js'

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
  // locals.userid comes from src/hooks.js

  let platforms = await listAllPlatforms()
  console.log(platforms)
  if (!platforms) {
    platforms = []
  }

/*
  let apps = await listAllApps()
  if (!apps) {
    apps = []
  }
*/

  return {
    platforms,
    apps: []
  }

  throw error('Oups')
};
