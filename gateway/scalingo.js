import { clientFromToken } from 'scalingo'
import _ from 'lodash';

let clientOscFr1;
let clientOscSecnumFr1;

async function getClient(region) {
  if (!clientOscFr1) {
    clientOscFr1 = await clientFromToken(process.env.SCALINGO_API_TOKEN, { apiUrl: 'https://api.osc-fr1.scalingo.com' })
  }
  if (!clientOscSecnumFr1) {
    clientOscSecnumFr1 = await clientFromToken(process.env.SCALINGO_API_TOKEN, { apiUrl: 'https://api.osc-secnum-fr1.scalingo.com' })
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

export async function startApp(appId, region) {
  let client = await getClient(region);
  try {
    console.log(`Going to start app ${appId}`)
    await client.Containers.scale(appId, [{ name: 'web', size: 'M', amount: 1 }]);
    let count = 0;
    while (count++ < 30) {
      console.log(`Waiting app ${appId} to be started…`)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const processes = await client.Containers.processes(appId);
      const webProcesses = _.filter(processes, { type: 'web' });
      const allProcessesRunning = webProcesses.length > 0 && _.every(webProcesses, {state: 'running'});
      if (allProcessesRunning) {
        console.log(`App ${appId} started`)
        return;
      }
    }
  } catch (e) {
    throw new Error(`Could not start app ${appId}`);
  }
}


export async function restartApp(appId, region, scope) {
  let client = await getClient(region);
  return client.Containers.restart(appId, scope);
}

export async function stopApp(appId, region) {
  let client = await getClient(region);
  return client.Containers.scale(appId, []);
}
