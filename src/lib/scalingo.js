import { clientFromToken } from 'scalingo'

const clientOscFr1 = await clientFromToken(import.meta.env.VITE_SCALINGO_API_TOKEN)
const clientOscSecnumFr1 = await clientFromToken(import.meta.env.VITE_SCALINGO_API_TOKEN, {apiUrl: 'https://api.osc-secnum-fr1.scalingo.com'})



export async function listAllApps() {

  let oscFr1Apps = await clientOscFr1.Apps.all()

  let oscSecnumFr1Apps = await clientOscSecnumFr1.Apps.all()

  let apps = oscFr1Apps.concat(oscSecnumFr1Apps)
  return apps
}

export async function restartApp(appId, region, scope) {
  let client = (region === 'osc-secnum-fr1') ? clientOscSecnumFr1 : clientOscFr1;
  await client.Containers.restart(appId, scope);
}

export async function stopApp(appId, region) {
  let client = (region === 'osc-secnum-fr1') ? clientOscSecnumFr1 : clientOscFr1;
  await client.Containers.scale(appId, []);
}
