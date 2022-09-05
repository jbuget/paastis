import dotenv from 'dotenv';
import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';
import { listAllApps } from "./scalingo.js";

dotenv.config();

const fastify = Fastify({
  logger: true
});

fastify.register(httpProxy, {
  upstream: 'http://my-api.example.com',
  preHandler: (request, reply, next) => {
    console.log(request);
    next()
  }
});

const start = async () => {
  try {
    const apps = await listAllApps();
    apps.forEach((app) => {
      fastify.register(httpProxy, {
        upstream: `https://${app.name}.scalingo.com`, // https://my-app.scalingo.com
        prefix: app.name, // https://<example.com>/my-app
        preHandler: (request, reply, next) => {
          console.log(request);
          next()
        }
      });
      console.log(`Registered "${app.name}"`);
    });

    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
