import { spawn } from 'child_process';
import _ from 'lodash';
import { clientFromToken } from 'scalingo'
import config from "../config.js";
import { PaasProvider } from "./PaasProvider.js";

export default class ScalingoProvider extends PaasProvider {

  _clientOscFr1;

  async getClient(region) {
    if (!this._clientOscFr1) {
      this._clientOscFr1 = await clientFromToken(config.scalingo.apiToken, { apiUrl: 'https://api.osc-fr1.scalingo.com' })
    }
    return this._clientOscFr1;
  }

  async listAllApps() {
    let clientOscFr1 = await this.getClient('osc-fr1');
    return await clientOscFr1.Apps.all();
  }

  async isAppRunning(appId, region) {
    let client = await this.getClient(region);
    const processes = await client.Containers.processes(appId);
    const webProcesses = _.filter(processes, { type: 'web' });
    const allProcessesRunning = webProcesses.length > 0 && _.every(webProcesses, { state: 'running' });
    return allProcessesRunning;
  }

  async ensureAppIsRunning(appId, region) {
    if (!(await this.isAppRunning(appId, 'osc-fr1'))) {
      await this.startApp(appId, region);
    }
  }

  async startApp(appId, region) {

    const that = this;

    async function executeStartApp(resolve, reject) {
      let client = await that.getClient(region);
      console.log(`Going to start app ${appId}`)
      let formation = await client.Containers.for(appId);
      formation.forEach((f) => (f.amount = 1));
      await client.Containers.scale(appId, formation);
      let count = 0;
      while (count++ < config.scalingo.operationTimeout) {
        console.log(`Waiting app ${appId} to be running…`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const processes = await client.Containers.processes(appId);
        const webProcesses = _.filter(processes, { type: 'web' });
        const allProcessesRunning = webProcesses.length > 0 && _.every(webProcesses, { state: 'running' });
        if (allProcessesRunning) {
          console.log(`✅ App ${appId} started and running`)

          if (config.hooks.afterAppStart) {
            const afterAppStart = spawn(config.hooks.afterAppStart, { shell: true });
            afterAppStart.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });
            afterAppStart.stderr.on('data', (data) => {
              console.error(`stderr: ${data}`);
            });
            afterAppStart.on('close', async (code) => {
              return resolve();
            });
          }
          return resolve();
        }
      }
      return reject(new Error(`Timed out waiting for app ${appId} to be running`));
    }

    return new Promise((resolve, reject) => {
      if (config.hooks.beforeAppStart) {
        const beforeAppStart = spawn(config.hooks.beforeAppStart, { shell: true });
        beforeAppStart.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        beforeAppStart.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        beforeAppStart.on('close', (code) => {
          executeStartApp(resolve, reject);
        });
      } else {
        executeStartApp(resolve, reject);
      }
    });
  }

  async stopApp(appId, region) {

    const that = this;

    async function executeStopApp(resolve, reject) {
      let client = await that.getClient(region);
      console.log(`Stopping app ${appId}`)
      let formation = await client.Containers.for(appId);
      formation.forEach((f) => (f.amount = 0));
      await client.Containers.scale(appId, formation);

      if (config.hooks.afterAppStop) {
        const afterAppStop = spawn(config.hooks.afterAppStop, { shell: true });
        afterAppStop.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        afterAppStop.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        afterAppStop.on('close', async (code) => {
          return resolve();
        });
      }
      return resolve();
    }

    return new Promise((resolve, reject) => {
      if (config.hooks.beforeAppStop) {
        const beforeAppStop = spawn(config.hooks.beforeAppStop, { shell: true });
        beforeAppStop.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        beforeAppStop.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        beforeAppStop.on('close', (code) => {
          executeStopApp(resolve, reject);
        });
      } else {
        executeStopApp(resolve, reject);
      }
    });
  }
}
