import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import type { Express } from 'express';
import { AppModule } from './app.module';

function getAllowedOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function validateCorsOrigin(
  origin: string | undefined,
  callback: (error: Error | null, allow?: boolean) => void,
): void {
  const allowedOrigins = getAllowedOrigins();

  if (!origin || allowedOrigins.includes(origin) || isLocalhostOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`Origin ${origin} is not allowed by CORS`));
}

function isLocalhostOrigin(origin: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

export async function createNestApplication(expressInstance?: Express) {
  const app = expressInstance
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressInstance))
    : await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: validateCorsOrigin,
    credentials: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  return app;
}
