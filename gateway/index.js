import dotenv from 'dotenv';
import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';
import { listAllApps } from "./scalingo.js";
import runningAppsRegister from './register.js';

dotenv.config();

const host = process.env.GATEWAY_HOST || '0.0.0.0';
const port = parseInt(process.env.GATEWAY_PORT, 10) || 3000;

const fastify = Fastify({
  logger: true
});

const start = async () => {
  try {
    const apps = await listAllApps();

    const runningApps = apps.filter((app) => app.status === 'running');

    runningApps.forEach(app => {
      runningAppsRegister.setApp(app.name);
      fastify.register(httpProxy, {
        upstream: `https://${app.name}.osc-fr1.scalingo.io`, // https://my-app.scalingo.com
        prefix: app.name, // https://<example.com>/my-app
        preHandler: (request, reply, next) => {
          next()
        }
      });
    });

    await fastify.listen({ host, port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
