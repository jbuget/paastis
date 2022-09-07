import dotenv from 'dotenv';
import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';
import cron from 'node-cron';
import { listAllApps } from "./scalingo.js";
import runningAppsRegister from './register.js';

dotenv.config();

const host = process.env.GATEWAY_HOST || '0.0.0.0';
const port = parseInt(process.env.GATEWAY_PORT, 10) || 3000;

const fastify = Fastify({
  logger: true
});

const startServer = async () => {
  try {
    const apps = await listAllApps();

    const runningApps = apps.filter((app) => app.status === 'running');
    runningApps.forEach(app => {
      runningAppsRegister.setApp(app.name);
    });

    fastify.register(httpProxy, {
      /*upstream: `https://${app.name}.${app.region}.scalingo.io`, // https://my-app.scalingo.com*/
      upstream: '',
      replyOptions: {
        getUpstream: function (request, baseUrl) {
          return `http://localhost:${request.server.address().port}`
        }
      },
      /*prefix: app.name,*/ // https://<example.com>/my-app
      preHandler: (request, reply, next) => {
        next()
      }
    });

    await fastify.listen({ host, port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

const startCron = async () => {
  cron.schedule('* * * * *', () => {
    console.log('⏰ Check apps to idle (every minute)');
    const now = new Date();
    const runningApps = runningAppsRegister.findApps();
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
startCron();
