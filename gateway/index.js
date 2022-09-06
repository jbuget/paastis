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
          next()
        }
      });
    });

    fastify.addHook('onRequest', async (request) => {
/*
      console.log(`request.headers.hostname=${request.headers.hostname}`);
      console.log(`request.headers.url=${request.headers.url}`);
      console.log(`request.url=${request.url}`);
*/

      const parsedUrl = parse(request.headers.host);
/*
      console.log(`parsedUrl.domain=${parsedUrl.domain}`);
      console.log(`parsedUrl.domainWithoutSuffix=${parsedUrl.domainWithoutSuffix}`);
      console.log(`parsedUrl.hostname=${parsedUrl.hostname}`);
      console.log(`parsedUrl.subdomain=${parsedUrl.subdomain}`);

*/
      if (parsedUrl.subdomain) {
        const appName = parsedUrl.subdomain.replace('.gateway', '');

        console.log(`appName = ${appName}`);

        const protocol = request.protocol; // https
        const host = request.headers.host.replace(`${appName}.`, ''); // gateway.example.com
        const prefix = appName; // my-app
        const url = request.url || '/';

        const newPath = `${protocol}://${host}/${prefix}${url}`;

        console.log(`newPath=${newPath}`);

        const newUrl = new URL(newPath);
        request.url = newUrl.href;
      }
    });

    await fastify.listen({ host, port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
