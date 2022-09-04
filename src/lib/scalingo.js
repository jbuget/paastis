import { clientFromToken } from 'scalingo'

let clientOscFr1;
let clientOscSecnumFr1;

async function getClient(region) {
  if (!clientOscFr1) {
    clientOscFr1 = await clientFromToken(import.meta.env.VITE_SCALINGO_API_TOKEN, { apiUrl: 'https://api.osc-fr1.scalingo.com' })
  }
  if (!clientOscSecnumFr1) {
    clientOscSecnumFr1 = await clientFromToken(import.meta.env.VITE_SCALINGO_API_TOKEN, { apiUrl: 'https://api.osc-secnum-fr1.scalingo.com' })
  }
  return (region === 'osc-secnum-fr1') ? clientOscSecnumFr1 : clientOscFr1;
}

export async function listAllApps() {
  let clientOscFr1 = await getClient('osc-fr1');
  let clientOscSecnumFr1 = await getClient('osc-secnum-fr1');
  let oscFr1Apps = await clientOscFr1.Apps.all();
  let oscSecnumFr1Apps = await clientOscSecnumFr1.Apps.all();
  let apps = oscFr1Apps.concat(oscSecnumFr1Apps);
  return apps;
}

export async function getAppDetails(appId, region) {
  let client = await getClient(region);
  const app = await client.Apps.find(appId);
  const containers = await client.Containers.for(appId);
  const addons = await client.Addons.for(appId);
  const result = { app, containers, addons };
  console.log(result)
  return result;
}

export async function restartApp(appId, region, scope) {
  let client = await getClient(region);
  return client.Containers.restart(appId, scope);
}

export async function stopApp(appId, region) {
  let client = await getClient(region);
  return client.Containers.scale(appId, []);
}
