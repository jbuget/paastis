import http from 'http';
import httpProxy from 'http-proxy';
import cron from 'node-cron';
import config from './config.js';
import { ensureAppIsRunning, listAllApps, stopApp } from "./scalingo.js";
import registry from './registry.js';

console.log(`\n8888888b.                            888    d8b\n888   Y88b                           888    Y8P\n888    888                           888\n888   d88P 8888b.   8888b.  .d8888b  888888 888 .d8888b\n8888888P"     "88b     "88b 88K      888    888 88K      \n888       .d888888 .d888888 "Y8888b. 888    888 "Y8888b.\n888       888  888 888  888      X88 Y88b.  888      X88\n888       "Y888888 "Y888888  88888P'  "Y888 888  88888P'\n`);

const startServer = async () => {
  try {
    const { host, port } = config.server;

    const proxy = httpProxy.createProxyServer({ changeOrigin: true });

    const server = http.createServer((req, res) => {
      const url = new URL(req.url, `https://${req.headers.host}`);
      const appName = url.hostname.replace(/\..*/, '');
      ensureAppIsRunning(appName, 'osc-fr1')
        .then(() => {
          if (registry.isRegisteredApp(appName)) {
            registry.getApp(appName).updateLastAccessedAt();
          } else {
            registry.registerApp(appName, 'osc-fr1');
          }
          proxy.web(req, res, { target: `https://${appName}.osc-fr1.scalingo.io` });
        }, (err) => {
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
    apps.forEach((app) => {
      if (app.status !== 'running') {
        registry.removeApp(app.name);
      } else {
        if (registry.isRegisteredApp(app.name)) {
          // already managed
          const managedApp = registry.getApp(app.name);
          const diffMs = Math.abs(now - managedApp.lastAccessedAt);
          const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);

          if (diffMins > config.startAndStop.maxIdleTime - 1) {
            // ☠️ app should be stopped
            stopApp(app.name, app.region)
            registry.removeApp(app.name);
          }
        } else {
          // not yet managed
          registry.registerApp(app.name, app.region);
        }
      }
    });
    console.log('Active apps: ', registry.listApps());
  }
  await stopIdleApps();
  cron.schedule(config.startAndStop.checkingIntervalCron, stopIdleApps);
};

startServer();
startCron();


