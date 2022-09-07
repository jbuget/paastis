import dotenv from 'dotenv';
import http from 'http';
import httpProxy from 'http-proxy';
import cron from 'node-cron';
import { startApp } from "./scalingo.js";
import runningAppsRegistry from './registry.js';

dotenv.config();

const host = process.env.GATEWAY_HOST || '0.0.0.0';
const port = parseInt(process.env.GATEWAY_PORT, 10) || 3000;

const proxy = httpProxy.createProxyServer({ changeOrigin: true });

const server = http.createServer((req, res) => {
  // You can define here your custom logic to handle the request
  // and then proxy the request.

  startApp('hello-fastify', 'osc-fr1').then(() => {
    proxy.web(req, res, { target: 'https://hello-fastify.osc-fr1.scalingo.io' });
  });
});

const startServer = async () => {
  try {
/*
    const apps = await listAllApps();

    const runningApps = apps.filter((app) => app.status === 'running');
    runningApps.forEach(app => {
      runningAppsRegistry.setApp(app.name);
    });
*/

    console.log(`listening on port ${port}`);
    server.listen(port);
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
