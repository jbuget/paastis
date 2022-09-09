import http from 'http';
import httpProxy from 'http-proxy';
import cron from 'node-cron';
import config from './config.js';
import { ensureAppIsRunning, listAllApps, stopApp } from "./scalingo.js";
import registry from './registry/index.js';
import RunningApp from "./registry/RunningApp.js";

const startServer = async () => {
  try {
    const { host, port } = config.server;

    const proxy = httpProxy.createProxyServer({ changeOrigin: true });

    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `https://${req.headers.host}`);
      const appName = url.hostname.replace(/\..*/, '');
      ensureAppIsRunning(appName, 'osc-fr1')
        .then(() => registry.getApp(appName))
        .then((runningApp) => {
          if (runningApp) {
            runningApp.updateLastAccessedAt();
            return runningApp;
          }
          return new RunningApp(appName, 'osc-fr1');
        })
        .then((runningApp) => registry.setApp(runningApp))
        .then(() =>
            proxy.web(req, res, { target: `https://${appName}.osc-fr1.scalingo.io` })
          , (err) => {
            console.error(err);
            res.statusCode = 502;
            res.end(err.toString());
          });
    });

    server.listen(port, host, () => {
      console.log(`Server is running on https://${host}:${port}`);
    });
  } catch (err) {
    process.exit(1);
  }
}

const startCron = async () => {

  async function stopIdleApps() {
    console.log('⏰ Checking apps to idle');
    const now = new Date();

    const ignoredApps = config.registry.ignoredApps;

    const apps = (await listAllApps()).filter((a) => !ignoredApps.includes(a.name));
    for (const app of apps) {
      if (app.status !== 'running') {
        await registry.removeApp(app.name);
      } else {
        let runningApp = await registry.getApp(app.name);
        if (runningApp) {
          // already managed
          const managedApp = await registry.getApp(app.name);
          const diffMs = Math.abs(now - managedApp.lastAccessedAt);
          const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);

          if (diffMins > config.startAndStop.maxIdleTime - 1) {
            // ☠️ app should be stopped
            await stopApp(app.name, app.region)
            await registry.removeApp(app.name);
          }
        } else {
          // not yet managed
          const runningApp = new RunningApp(app.name, 'osc-fr1');
          await registry.setApp(runningApp);
        }
      }
    }
    console.log('Active apps: ', (await registry.listApps()));
  }

  await stopIdleApps();
  cron.schedule(config.startAndStop.checkingIntervalCron, stopIdleApps);
};

startServer();
startCron();


