import { Logger } from '@nestjs/common';
import { createNestApplication } from './server';

async function bootstrap() {
  const app = await createNestApplication();
  const port = process.env.PORT ?? 3000;

  await app.listen(port);
  Logger.log(`Server running at http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
