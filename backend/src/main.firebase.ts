import express, { type Express } from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { createNestApplication } from './server';

let cachedServer: Promise<Express> | undefined;

async function getExpressServer(): Promise<Express> {
  if (!cachedServer) {
    cachedServer = (async () => {
      const server = express();
      const app = await createNestApplication(server);

      await app.init();
      return server;
    })();
  }

  return cachedServer;
}

export const api = onRequest(
  {
    region: process.env.FUNCTION_REGION ?? 'southamerica-east1',
  },
  async (request, response) => {
    const server = await getExpressServer();
    server(request, response);
  },
);
