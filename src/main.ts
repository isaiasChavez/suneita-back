import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import * as helmet from 'helmet';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '10mb' }));
  app.use(helmet());
  app.enableCors();

  app.setGlobalPrefix('api')

  await app.listen(AppModule.port);
}
bootstrap();
