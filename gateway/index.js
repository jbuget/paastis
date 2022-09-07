import dotenv from 'dotenv';
import http from 'http';
import httpProxy from 'http-proxy';
import cron from 'node-cron';
import { ensureAppIsRunning } from "./scalingo.js";
import runningAppsRegistry from './registry.js';
import { parse } from "tldts";

dotenv.config();

const host = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT, 10) || 3000;

const proxy = httpProxy.createProxyServer({ changeOrigin: true });

const server = http.createServer((req, res) => {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  const url = new URL(req.url, `https://${req.headers.host}`);
  const appName = url.hostname.replace(/\..*/, '');
  ensureAppIsRunning(appName, 'osc-fr1')
    .then(() => {
      proxy.web(req, res, { target: `https://${appName}.osc-fr1.scalingo.io` });
    }, (err) => {
      console.error(err);
      res.statusCode = 502;
      res.end(err.toString());
    });
});

const startServer = async () => {
  try {
    server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
    });
  } catch (err) {
    process.exit(1);
  }
}

const startCron = async () => {
  cron.schedule('* * * * *', () => {
    console.log('⏰ Check apps to idle (every minute)');
    const now = new Date();
    const runningApps = runningAppsRegistry.findApps();
    runningApps.forEach((app) => {
      const diffMs = Math.abs(now - app.lastAccessedAt);
      const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
      if (diffMins > 5) {
        runningApps.removeApp(app.name);
      }
    });
  });
};

startServer();
//startCron();


/*
        const parsedUrl = parse(originalReq.headers.host);
        const appName = (parsedUrl.subdomain.split('.'))[0];
        if (appName) {
          const app = runningAppsRegistry.getApp(app);
          if (app) {
            return `${originalReq.protocol}://${app.name}.${app.region}/${originalReq.url}`
          }
          return base;
        }
        return base;

 */

/*
    const apps = await listAllApps();

    const runningApps = apps.filter((app) => app.status === 'running');
    runningApps.forEach(app => {
      runningAppsRegistry.setApp(app.name);
    });
*/

