import dotenv from 'dotenv';
import http from 'http';
import httpProxy from 'http-proxy';
import cron from 'node-cron';
import { ensureAppIsRunning, listAllApps, stopApp } from "./scalingo.js";
import registry from './registry.js';

dotenv.config();

const startServer = async () => {
  try {
    const host = process.env.HOST || '0.0.0.0';
    const port = parseInt(process.env.PORT, 10) || 3000;

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
      console.log(`Server is running on http://${host}:${port}`);
    });
  } catch (err) {
    process.exit(1);
  }
}

const startCron = async () => {
  cron.schedule('* * * * *', async () => {
    console.log('⏰ Checking apps to idle');
    const now = new Date();

    const apps = (await listAllApps()).filter((a) => a.name !== 'paastis-gateway');
    apps.forEach((app) => {
      if (app.status !== 'running') {
        registry.removeApp(app.name);
      } else {
        if (registry.isRegisteredApp(app.name)) {
          // already managed
          const managedApp = registry.getApp(app.name);
          const diffMs = Math.abs(now - managedApp.lastAccessedAt);
          const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);

          if (diffMins > 1) {
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
  });
};

startServer();
startCron();


