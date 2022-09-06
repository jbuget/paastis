import dotenv from 'dotenv';
import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';
import { listAllApps } from "./scalingo.js";
import runningAppsRegister from './register.js';
import { parse } from 'tldts';

dotenv.config();

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

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
          const parsedUrl = parse(request.url);
          const appName = parsedUrl.subdomain;
          const newPath = request.url.replace(`${appName}.`, '') + `/${appName}`;
          const newUrl = new URL(newPath);
          request.url = newUrl;

          console.log(`appName = ${appName}`);
          console.log('\n');

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
